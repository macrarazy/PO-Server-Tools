/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

// File: user.js (User)
// Contains the JSESSION user constructor.
// Depends on: datahash, options, jsession, utils, player-utils, watch-utils

// Table of Content:
// [user-ctor]: JSESSION user constructor.
// [expt]: Exports

(function () {
    var DataHash = require('datahash'),
        Options = require('options'),
        JSESSION = require('jsession'),
        Utils = require('utils'),
        PlayerUtils = require('player-utils'),
        WatchUtils = require('watch-utils');
    
    // TODO: Add comments here.
    // JSESSION user constructor [user-ctor]
    function User(id) {
        var name = sys.name(id),
            nameToLower = name.toLowerCase(),
            time = +(sys.time());
        
        if (name === undefined) {
            Utils.panic('scripts/user.js', 'User (constructor)', 'User ' + id + ' is not logged in.', name, Utils.panic.error);
            return;
        }
    
        if (!DataHash) {
            Utils.panic('scripts/user.js', 'User (constructor)', 'DataHash does not exist.', name, Utils.panic.error);
            return;
        }
        
        this.id = id;
        // TODO: ensure this is set properly.
        //this.impersonation = undefined;
        this.ip = sys.ip(id);
        this.name = name;
        this.lastMsg = 0;
        this.loginTime = date;
        this.lastChallenge = 0;
        this.floodCount = 0;
        this.caps = 0;
        this.lastFuture = 0;
        this.isAutoAFK = false;
        this.teamChanges = 0;
        
        this.muted = DataHash.hasDataProperty('mutes', this.ip);
        this.megauser = DataHash.hasDataProperty('megausers', nameToLower);
        this.voice = DataHash.hasDataProperty('voices', nameToLower);
        this.icon = DataHash.icons[nameToLower] || "";
        this.macro = DataHash.hasDataProperty('macros', nameToLower)
            ? DataHash.macros[nameToLower]
            : ["%m1", "%m2", "%m3", "%m4", "%m5"];
    }
    
    // Adds floodCount to User
    User.prototype.addFlood = function () {
        if (PlayerUtils.trueAuth && PlayerUtils.trueAuth(this.id) < 1) {
            ++this.floodCount;
            
            sys.setTimer(function () {
                --JSESSION.users(this.id).floodCount;
            }, Config.AutoFloodTime * 1000, false);
        }
    };
    
    // Attempts to mute User for caps (it's not meant to be THAT mean)
    // Returns true if User was muted
    User.prototype.capsMute = function (message, channel) {
        var messageLength = message.length,
            caps = 0,
            char,
            i;
        
        if (PlayerUtils.trueAuth(this.id) < 1) {
            return false;
        }
    
        if (Options.AutoMute === false) {
            return false;
        }
        
        for (i = 0; i < messageLength; ++i) {
            char = message[i];
            if (Utils.isCapitalLetter(char)) {
                ++caps;
            } else if (Utils.isNormalLetter(char) && caps > 0) {
                newCapsAmount -= 1;
            }
        }
        
        this.caps += caps;
    
        if (this.caps >= 70) {
            WatchUtils.logPlayerMessage(this.id, "CAPS Mute Message", message, channel);
            Bot.sendAll(this.name + " got muted for 5 minutes by " + Options.Bot.name + " with reason 'CAPS'.", channel);
    
            PlayerUtils.mute({
                ip: this.ip,
                by: Options.Bot.name,
                reason: "CAPS",
                time: 60 * 5
            });
    
            this.caps = 0;
            this.muted = true;
            return true;
        }
    
        return false;
    };
    
    // Exports [expt]
    
    // Export User (the JSESSION user constructor)
    exports.User = User;
}());