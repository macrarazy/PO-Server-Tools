/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

(function () {
    var DataHash = require('datahash'),
        Options = require('options'),
        JSESSION = require('jsession'),
        
        Utils = require('utils'),
        PlayerUtils = require('player-utils'),
        WatchUtils = require('watch-utils');
    
    // JSESSION user constructor
    function User(id) {
        var name = sys.name(id),
            nameToLower = name.toLowerCase(),
            time = +(sys.time());
        
        if (name === undefined) {
            print('JSESSION Warning: Unknown user created.');
            return;
        }
    
        this.id = id;
        // TODO: ensure this is properly set.
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
    
        if (!DataHash) {
            print('JSESSION Warning: DataHash does not exist.');
            return;
        }
        
        this.muted = DataHash.mutes.hasOwnProperty(this.ip);
        this.megauser = DataHash.megausers.hasOwnProperty(nameToLower);
        this.voice = DataHash.voices.hasOwnProperty(nameToLower);
        this.icon = DataHash.icons[nameToLower] || "";
        this.macro = ["%m1", "%m2", "%m3", "%m4", "%m5"];
    
        if (DataHash.macros.hasOwnProperty(nameToLower)) {
            this.macro = DataHash.macros.hasOwnProperty[nameToLower];
        }
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
            i,
            char;
        
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
            WatchUtils.logPlayer(this.id, "CAPS Mute Message", message, channel);
            Bot.sendAll(this.name + " got muted for 5 minutes. [Reason: TALKING TOO MUCH IN CAPS]", channel);
    
            // TODO: PlayerUtils.mute
            PlayerUtils.mute({
                ip: this.ip,
                by: Options.Bot.name,
                reason: "TAKING TOO MUCH IN CAPS",
                time: 60 * 5
            });
    
            this.caps = 0;
            this.muted = true;
            return true;
        }
    
        return false;
    };
    
    // Export User.
    exports.User = User;
}());