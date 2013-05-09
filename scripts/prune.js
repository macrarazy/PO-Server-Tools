/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports*/

// File: prune.js (Prune)
// Contains utilities used to prune mutes, bans, and temp auth.
// Depends on: jsession, channel-data, datahash, player-utils, bot

// Table of Content:
// [prune-ctor]: Prune constructor
// [expt]: Exports

(function () {
    var JSESSION = require('jsession'),
        ChannelData = require('channel-data'),
        DataHash = require('datahash'),
        PlayerUtils = require('player-utils'),
        Bot = require('bot');
    
    // Prune constructor [prune-ctor]
    // This constructor is empty and its only use is to be able to update the Prune prototype.
    function Prune() {
    }
    
    // Prunes old (expired) temporary authorities.
    Prune.prototype.tempAuth = function () {
        var auths = DataHash.tempAuth,
            timeNow = +(sys.time()),
            hasMadeChange = false,
            id,
            oldAuth,
            cur,
            i;
        
        for (i in auths) {
            if (auths.hasOwnProperty(i)) {
                cur = auths[i];
                oldAuth = 0;
                
                // If the current time has passed the length of the temp auth.
                if (timeNow >= cur.time) {
                    if (cur.oldAuth) {
                        oldAuth = cur.oldAuth;
                    }
    
                    Bot.sendAll(cur.name + " is no longer " + PlayerUtils.authToString(cur.role) + ".", 0);
    
                    id = sys.id(cur.name);
                    
                    // if they're online, change their auth right away.
                    if (id !== undefined) {
                        sys.changeAuth(id, oldAuth);
                    } else {
                        // otherwise, change their auth in the database
                        sys.changeDbAuth(cur.name, oldAuth);
                    }
                    
                    hasMadeChange = true;
                    
                    // delete the object because it has expired.
                    delete auths[i];
                }
            }
        }

        if (hasMadeChange) {
            DataHash.save("tempAuth");
        }
    };

    // Most of these are similar to Prune#tempAuth, except simpler.
    
    // Prunes old (expired) mutes.
    Prune.prototype.mutes = function () {
        var mutes = DataHash.mutes,
            timeNow = +(sys.time()),
            hasMadeChange = false,
            cur,
            i;

        for (i in mutes) {
            if (mutes.hasOwnProperty(i)) {
                cur = mutes[i];
                
                if (cur.time !== 0 && timeNow >= cur.time) {
                    hasMadeChange = true;
                    delete mutes[i];
                }
            }
        }

        if (hasMadeChange) {
            DataHash.save("mutes");
        }
    };
    
    // Prunes all old (expired) temporary bans.
    Prune.prototype.bans = function () {
        var bans = DataHash.tempBans,
            timeNow = +(sys.time()),
            hasMadeChange = false,
            cur,
            i;

        for (i in bans) {
            if (bans.hasOwnProperty(i)) {
                cur = bans[i];
                
                if (timeNow >= cur.time) {
                    hasMadeChange = true;
                    delete bans[i];
                }
            }
        }

        if (hasMadeChange) {
            DataHash.save("tempBans");
        }
    };

    // Prunes all old (expired) range bans.
    Prune.prototype.rangeBans = function () {
        var bans = DataHash.rangeBans,
            timeNow = +(sys.time()),
            hasMadeChange = false,
            cur,
            i;

        for (i in bans) {
            if (bans.hasOwnProperty(i)) {
                cur = bans[i];
                
                if (cur.time !== 0 && timeNow >= cur.time) {
                    hasMadeChange = true;
                    delete bans[i];
                }
            }
        }

        if (hasMadeChange) {
            DataHash.save("rangeBans");
        }
    };

    Prune.prototype.channelMutes = function (chan) {
        var channel = JSESSION.channels(chan),
            mutes = channel.muteList,
            timeNow = +(sys.time()),
            hasMadeChange = false,
            cur,
            i;

        for (i in mutes) {
            if (mutes.hasOwnProperty(i)) {
                cur = mutes[i];
                
                if (cur.time !== 0 && timeNow >= cur.time) {
                    hasMadeChange = true;
                    delete mutes[i];
                }
            }
        }

        if (hasMadeChange) {
            ChannelData.save(chan, "muteList", mutes);
        }
    };
    
    Prune.prototype.channelBans = function (chan) {
        var channel = JSESSION.channels(chan),
            bans = channel.muteList,
            timeNow = +(sys.time()),
            hasMadeChange = false,
            cur,
            i;

        for (i in bans) {
            if (bans.hasOwnProperty(i)) {
                cur = bans[i];
                
                if (cur.time !== 0 && timeNow >= cur.time) {
                    hasMadeChange = true;
                    delete bans[i];
                }
            }
        }

        if (hasMadeChange) {
            ChannelData.save(chan, "banList", bans);
        }
    };
    
    // Exports [expt]
    
    // Export an instance of Prune
    exports.Prune = new Prune();
    
    // Export the Prune constructor.
    exports.prune_constructor = Prune;
}());
