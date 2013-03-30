/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

(function () {
    // TODO: ChannelData: Add cData (ChannelData.xxx)
    var ChannelData = require('channel-data'),
        ChannelUtils = require('channel-utils'),
        // TODO: PlayerUtils: PlayerUtils.name(id | name) (like old String#name (as in modules/jsext.js))
        // TODO: PlayerUtils: PlayerUtils.formatName(id | name) (same as player())
        // TODO: PlayerUtils: PlayerUtils.name(id | name) (like modules/utilities.js' util.player.name)
        // TODO: PlayerUtils: PlayerUtils.ip(id | name | ip) (that checks sys.ip, dbIp, and proxyIp (because of the webclient))
        PlayerUtils = require('player-utils'),
        // TODO: Utils.isEmpty
        Utils = require('utils'),
        // TODO: This is being improved.
        Tours = require('tours'),
        Bot = require('bot'),
        Options = require('options');
    
    // JSESSION channel constructor
    function Channel(id) {
        this.name = sys.channel(id);
        this.id = id;
    
        this.chanAuth = {};
        this.tourAuth = {};
        this.creator = '';
        this.topic = 'Welcome to ' + this.name + '!';
        // TODO: Rename topicsetter -> topicSetter
        this.topicSetter = '';
        
        // TODO: REMOVE ALL THIS TOURS STUFF
        this.toursEnabled = false;
        
        this.perm = false;
    
        // it only contains names..
        if (Options.indexOf(this.name) !== -1) {
            this.perm = true;
            
            // TODO: REMOVE ALL THIS TOURS STUFF
            this.tour = new Tours(this.id);
            this.toursEnabled = true;
        }
    
        this.private = false;
        this.defaultTopic = true;
        this.silence = 0;
    
        // TODO: Rename banlist -> banList; mutelist -> muteList
        this.banList = {};
        this.muteList = {};
    
    }
    
    // gives/takes tour auth to a player
    // TODO: Remove this, merge with new tours.js (or something)
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
    
        ChannelData.changeTourAuth(this.id, this.tourAuth);
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
            // TODO: Possibly move .noPermissionMessage somewhere else
            // Like ux.js
            Utils.noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        // set the topic.
        // magic word "default" sets it back to normal
        if (topic.toLowerCase() === "default") {
            this.topic = "Welcome to " + this.name + "!";
            this.topicsetter = '';
            this.defaultTopic = true;
        } else {
            this.topic = topic;
            this.topicsetter = me;
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
    Channel.prototype.isMutedInChannel = function (ip) {
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
    
    // export Channel
    exports.Channel = Channel;
}());