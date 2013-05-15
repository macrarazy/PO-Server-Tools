/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports*/

// File: user.js (User)
// Contains the JSESSION user constructor.
// Depends on: datahash, options, jsession, utils, player-utils, watch-utils, bot, tier-bans

// Table of Content:
// [user-ctor]: JSESSION user constructor.
// [expt]: Exports

(function () {
    var DataHash = require('datahash'),
        Options = require('options'),
        JSESSION = require('jsession'),
        Utils = require('utils'),
        PlayerUtils = require('player-utils'),
        WatchUtils = require('watch-utils'),
        Bot = require('bot'),
        // TODO: TierBans
        TierBans = require('tier-bans');
    
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
        
        this.id = id;
        // TODO: ensure this is set properly.
        //this.impersonation = undefined;
        this.ip = sys.ip(id);
        this.name = name;
        this.lastMsg = 0;
        this.loginTime = (new Date()).getTime();
        this.lastChallenge = 0;
        this.floodCount = 0;
        this.caps = 0;
        this.lastFuture = 0;
        this.isAutoAFK = false;
        this.autoAFKTime = -1;
        this.teamChanges = 0;
        
        this.muted = DataHash.hasDataProperty('mutes', this.ip);
        this.megauser = DataHash.hasDataProperty('megausers', nameToLower);
        this.voice = DataHash.hasDataProperty('voices', nameToLower);
        this.icon = DataHash.icons[nameToLower] || "";
        this.macro = DataHash.hasDataProperty('macros', nameToLower)
            ? DataHash.macros[nameToLower]
            : ["%m1", "%m2", "%m3", "%m4", "%m5"];
    }
    
    // Adds floodCount to User.
    User.prototype.addFlood = function () {
        if (PlayerUtils.trueAuth && PlayerUtils.trueAuth(this.id) < 1) {
            ++this.floodCount;
            
            sys.setTimer(function () {
                --JSESSION.users(this.id).floodCount;
            }, Config.AutoFloodTime * 1000, false);
        }
    };
    
    // Attempts to mute User for caps. Of course, this is only done if they have done stuff that is no good. :[
    // Returns true if User was muted.
    User.prototype.capsMute = function (message, channel) {
        var messageLength = message.length,
            caps = 0,
            char,
            i;
        
        if (PlayerUtils.trueAuth(this.id) < 1) {
            return false;
        }
    
        if (Options.autoMute === false) {
            return false;
        }
        
        for (i = 0; i < messageLength; ++i) {
            char = message[i];
            if (Utils.isCapitalLetter(char)) {
                ++caps;
            } else if (Utils.isNormalLetter(char) && caps > 0) {
                caps -= 1;
            }
        }
        
        this.caps += caps;
    
        if (this.caps >= 70) {
            WatchUtils.logPlayerMessage("Message (triggered CAPS mute)", this.id, message, channel);
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
    
    // Sends various messages to the player, as well as checking for certain updates such as new mail.
    // Called in afterLogIn and afterChangeTeam events.
    User.shared = function shared(src) {
        var name = sys.name(src),
            nameLower = name.toLowerCase(),
            teams = sys.teamCount(src),
            bannedSleep = TierBans.bannedGSCSleep,
            bannedTrap = TierBans.bannedGSCTrap,
            sleepLength = bannedSleep.length,
            trapLength = bannedTrap.length,
            newMails = 0,
            team,
            mails,
            len,
            i,
            j,
            k;
        
        if (DataHash.hasDataProperty("mail", nameLower)) {
            mails = DataHash.mail[nameLower].mails;
            
            if (mails.length > 0) {
                for (i = 0, len = mails.length; i < len; ++i) {
                    if (!mails[i].read) {
                        ++newMails;
                    }
                }

                if (newMails > 0) {
                    Bot.sendMessage(src, "You have " + newMails + " new mails! Type <font color='green'><b>/readmail</b></font> to view them!");
                }
            }
        }

        for (team = 0; team < teams; ++team) {
            // 2nd Generation (GSC)
            if (sys.gen(src, team) === 2) {
                pokes:
                for (i = 0; i <= 6; ++i) {
                    for (j = 0; j < sleepLength; ++j) {
                        if (sys.hasTeamPokeMove(src, team, i, bannedSleep[j])) {
                            for (k = 0; k < trapLength; ++k) {
                                if (sys.hasTeamPokeMove(src, team, i, bannedTrap[k])) {
                                    Utils.teamAlertMessage(src, team, "SleepTrapping is banned in GSC. Pokemon " + sys.pokemon(sys.teamPoke(src, team, i)) + "  removed from your team.");
                                    sys.changePokeNum(src, team, i, 0);
                                    continue pokes;
                                }
                            }
                        }
                    }
                }
            }

            if (!Config.NoCrash) {
                if (!TierBans.isLegalTeam(src, team, sys.tier(src, team))) {
                    TierBans.findGoodTier(src, team);
                }
            }

        }
    };
    
    // Exports [expt]
    // Export User (the JSESSION user constructor)
    exports.User = User;
}());