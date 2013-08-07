/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: channel.js (Channel)
// Contains the JSESSION channel constructor.
// Depends on: bot, channel-data, player-utils, options, tours, utils

// Table of Content:
// [chan-ctor]: JSESSION channel constructor.
// [chan-util]: Channel utilities defined in the JSESSION channel constructor (isBanned, isMuted, isChanMod, etc.)
// [expt]: Exports

(function () {
    var Bot = require('bot'),
        ChannelData = require('channel-data'),
        PlayerUtils = require('player-utils'),
        Options = require('options'),
        Tours = require('tours'),
        Utils = require('utils');
    
    // JSESSION channel constructor [chan-ctor]
    function Channel(id) {
        this.name = sys.channel(id);
        this.id = id;
            
        this.chanAuth = {};
        this.tourAuth = {};
        this.creator = "~Unknown~";
        this.topic = "Welcome to " + this.name + "!";
        // TODO: topicsetter -> topicSetter
        this.topicSetter = '';
        
        this.tour = new Tours.ToursChannelConfig(id);
        
        this.perm = false;
    
        // it only contains names..
        // anyways, these are auto perm channels (the default channels, basically).
        if (Options.defaultChannels.indexOf(this.name) !== -1) {
            this.perm = true;
        }
    
        this.private = false;
        this.defaultTopic = true;
        this.silence = {
            level: 0,
            issuer: ""
        };
    
        // TODO: Rename banlist -> banList; mutelist -> muteList
        this.banList = {};
        this.muteList = {};
    }
    
    // gives/takes tour auth to a player
    Channel.prototype.doTourAuth = function (name, mode) {
        var toLower = String(name).toLowerCase();
    
        if (mode === 'give') {
            this.tourAuth[toLower] = {
                'name': PlayerUtils.name(name)
            };
        } else if (mode === 'take') {
            delete this.tourAuth[toLower];
        } else {
            throw new TypeError("Channel#doTourAuth (defined in scripts/channel.js): Mode is not 'give' or 'take'.");
        }
    
        ChannelData.save(this.id, 'tourAuth', this.tourAuth);
    };
    
    // Changes the channel topic
    // TODO: Remove this, put this in /topic instead.
    Channel.prototype.changeTopic = function (src, topic, fullCommand) {
        var me = sys.name(src),
            mePlayer = PlayerUtils.formatName(me);
        
        // no topic specified? let them see it.
        if (Utils.isEmpty(topic)) {
            if (this.topic === '') {
                Bot.sendMessage(src, "There is no topic.", this.id);
                return;
            }
    
            Bot.escapeMessage(src, "Topic: " + this.topic, this.id);
    
            if (this.topicSetter !== '') {
                Bot.escapeMessage(src, "Set by: " + this.topicSetter, this.id);
            }
            if (this.defaultTopic) {
                Bot.sendMessage(src, "This is a default topic.", this.id);
            }
            return;
        }
    
        if (!this.isChanMod(src)) {
            Utils.noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        // set the topic.
        // magic word "default" sets it back to the default
        if (topic.toLowerCase() === "default") {
            this.topic = "Welcome to " + this.name + "!";
            this.topicSetter = '';
            this.defaultTopic = true;
        } else {
            this.topic = topic;
            this.topicSetter = me;
            this.defaultTopic = false;
        }
    
        Bot.sendAll("The topic was changed by " + mePlayer + " to: " + this.topic, this.id);
        return;
    };
    
    // changes a player's auth level
    Channel.prototype.changeAuth = function (name, auth) {
        var trueName = PlayerUtils.name(name).toLowerCase();
    
        if (auth <= 0 && this.chanAuth.has(trueName)) {
            return (delete this.chanAuth[trueName]);
        }
    
        this.chanAuth[trueName] = auth;
        return true;
    };
    
    // Channel utilities (defined in the JSESSION channel constructor) [chan-util]
    
    // if a player can issue channel punishment on another player
    Channel.prototype.canIssue = function (src, tar) {
        var selfName = PlayerUtils.name(src).toLowerCase(),
            targetName = PlayerUtils.name(tar).toLowerCase(),
            selfId = sys.id(selfName);
    
        // the player trying to issue doesn't exist? wat.
        if (selfId === undefined) {
            return false;
        }
        
        // test if they don't exist
        if (!PlayerUtils.ip(selfName) || !PlayerUtils.ip(targetName)) {
            return false;
        }
    
        // test if the target has more/equal auth than the issuer
        if (PlayerUtils.trueAuth(src) <= PlayerUtils.trueAuth(tar)) {
            return false;
        }
        
        // test if the target has more/equal auth than the issuer. allow it anyway if the issuer is channel owner.
        if ((this.chanAuth[selfName] <= this.chanAuth[targetName]) && !this.isChanOwner(src)) {
            return false;
        }
    
        // alright. player can issue punishment.
        return true;
    };
    
    // if the player is banned in this channel
    Channel.prototype.isBanned = function (ip) {
        return this.banList.hasOwnProperty(PlayerUtils.ip(ip));
    };
    
    // if the player is muted in this channel
    Channel.prototype.isMuted = function (ip) {
        return this.muteList.hasOwnProperty(PlayerUtils.ip(ip));
    };
    
    // if the player is a channel moderator (auth >= 1)
    Channel.prototype.isChanMod = function (src) {
        return PlayerUtils.trueAuth(src) >= 1 || (this.chanAuth[PlayerUtils.name(src).toLowerCase()] || 0) >= 1;
    };
    
    // if the player is a channel administrator (auth >= 2)
    Channel.prototype.isChanAdmin = function (src) {
        return PlayerUtils.trueAuth(src) >= 2 || (this.chanAuth[PlayerUtils.name(src).toLowerCase()] || 0) >= 2;
    };
    
    // if the player is a channel owner (auth >= 3)
    Channel.prototype.isChanOwner = function (src) {
        return PlayerUtils.trueAuth(src) >= 3 || (this.chanAuth[PlayerUtils.name(src).toLowerCase()] || 0) >= 3;
    };
    
    // Exports [expt]
    // export Channel (the JSESSION channel constructor)
    exports.Channel = Channel;
}());