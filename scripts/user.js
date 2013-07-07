/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, Qt, print, gc, version,
    Config: true, require: false, module: true, exports: true*/

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
        TierBans = require('tier-bans'),
        Prune = require('prune');
    
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
    
    // If a player is valid. Returns one of the following:
    // "rangebanned": The player is rangebanned.
    // "ipbanned": The player is ipbanned.
    // "badunicode": The player has bad unicode characters in their name.
    // "fine": Their name is fine.
    User.isValid = function (src) {
        var name = sys.name(src),
            ip = sys.ip(src),
            auth = sys.maxAuth(ip);
        
        var len,
            i;

        Prune.bans();
        Prune.rangeBans();

        // If they don't have auth, possibly kick them because their name is invalid or they're banned some way or another.
        if (auth <= 0) {
            if (DataHash.hasDataProperty("ipBans", ip)) {
                return "ipbanned";
            }
            
            for (i in DataHash.rangeBans) {
                if (ip.substring(0, i.length) === i) {
                    return "rangebanned";
                }
            }
        }

        // Kick them for bad characters, even as auth.
        var banned = [
            /\u0408|\u03a1|\u0430|\u0410|\u0412|\u0435|\u0415|\u041c|\u041d|\u043e|\u041e|\u0440|\u0420|\u0441|\u0421|\u0422|\u0443|\u0445|\u0425|\u0456|\u0406/, // cyrillic
            /\u0009-\u000D|\u0085|\u00A0|\u1680|\u180E|\u2000-\u200A|\u2028|\u2029|\u2029|\u202F|\u205F|\u3000/, // space
            /\u058A|\u05BE|\u1400|\u1806|\u2010-\u2015|\u2053|\u207B|\u208B|\u2212|\u2E17|\u2E1A|\u301C|\u3030|\u30A0|\uFE31-\uFE32|\uFE58|\uFE63|\uFF0D/, // dash
            /\u03F3|\u0391|\u0392|\u0395|\u0396|\u0397|\u0399|\u039A|\u039C|\u039D|\u039F|\u03A1|\u03A4|\u03A5|\u03A7/, // greek
            /\u0555|\u0585/, // armenian
            /[\u0370-\u03ff]/, // creek
            /[\ufff0-\uffff]/, // special
            /\u3061|\u65532/, // other
            /[\u0300-\u036F]/, // zalgo
            /[\u0E00-\u0E7F]/, // thai
            /\xA1/ // fakei
        ];

        for (i = 0, len = banned.length; i < len; ++i) {
            if (banned[i].test(name)) {
                return "badunicode";
            }
        }
        
        return "fine";
    };
    
    // Exports [expt]
    // Export User (the JSESSION user constructor)
    exports.User = User;
}());