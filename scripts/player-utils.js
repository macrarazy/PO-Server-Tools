/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports*/

// File: player-utils.js (PlayerUtils)
// Contains player utilities (such as easily getting player and team information).
// Dependencies: datahash, jsession, utils

// No Table of Content.

(function () {
    var JSESSION = require('jsession').JSESSION,
        DataHash = require('datahash'),
        Utils = require('utils'),
        // list of default colors, used when a player doesn't have one (by the client)
        defaultColorList = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];

    // Returns a player's first team for the given [tier].
    // IMPORTANT: Returns a team id, not a team object (or anything cool like that).
    // Returns 0 (the first team) if Config.NoCrash is true.
    // Returns -1 if a player doesn't have a team for that tier.
    exports.firstTeamForTier = function firstTeamForTier(id, tier) {
        var tierToLower = (tier || "").toLowerCase(),
            teamCount = sys.teamCount(id),
            i;
        
        if (Config.NoCrash) {
            return 0;
        }
        
        for (i = 0; i < teamCount; ++i) {
            if (sys.tier(id, i).toLowerCase() === tierToLower) {
                // returns the team id if the tiers match.
                return i;
            }
        }
    
        return -1;
    };
    
    // If the given player has a team for the specific tier.
    // If tier is not specified, then if the player has any teams at all will be returned.
    exports.hasTeamForTier = function hasTeamForTier(id, tier) {
        if (!tier) {
            return sys.teamCount(id) !== 0;
        }
    
        return sys.hasTier(id, tier);
    };
    
    // Returns a player's true color
    // So it doesn't appear to be black if the player has none (in html messages)
    exports.trueColor = function trueColor(src) {
        var defaultColor = sys.getColor(src);
        
        // when the player hasn't set their own color
        if (defaultColor === '#000000') {
            return defaultColorList[src % defaultColorList.length];
        }
        
        return defaultColor;
    };
    
    // Capitalizes a name (even when the player is offline), or returns it (id).
    exports.name = function name(nameOrId) {
        if (typeof nameOrId === 'string') {
            return DataHash.correctNames[nameOrId.toLowerCase()] || sys.name(nameOrId) || nameOrId;
        } else if (typeof nameOrId === 'number') {
            return sys.name(nameOrId) || "~Unknown~";
        }
        
        // panics if it isn't a string or number.
        Utils.panic("scripts/player-utils.js", "PlayerUtils.name(nameOrId)", "Player is not a string or a number.", "typeof nameOrId: " + typeof nameOrId + " | nameOrId's value: " + nameOrId, Utils.panic.warning);
        
        return "~Unknown~";
    };
    
    // Formats a player's name with html. Quite fancy.
    exports.formatName = function formatName(nameOrId) {
        // fixes the case, and lets us accept ids
        var trueName = name(nameOrId);
        
        // simply return a string. still a pain to write manually though.
        return "<b style='color: " + trueColor(trueName) + "'>" + trueName + "</b>";
    };
    
    // Returns a player's name. Accepts an id, name, or the ip itself (if passed)
    exports.ip = function ip(idOrNameOrIp) {
        // since both names and ips are strings, return idOrNameOrIp if sys.dbIp returns undefined
        if (typeof idOrNameOrIp === 'string') {
            return sys.dbIp(idOrNameOrIp) || idOrNameOrIp;
        } else if (typeof idOrNameOrIp === 'number') {
            return sys.ip(idOrNameOrIp) || "0.0.0.0";
        }
        
        // panics if it isn't a string or number.
        Utils.panic("scripts/player-utils.js", "PlayerUtils.ip(nameOrIdOrIp)", "Player is not a string or a number.", "typeof idOrNameOrIp: " + typeof idOrNameOrIp + " | idOrNameOrIp's value: " + idOrNameOrIp, Utils.panic.warning);
        
        return "0.0.0.0";
    };
    
    // Returns the true authority level of a player (takes PlayerPermissions and maxAuth in account)
    exports.trueAuth = function trueAuth(nameOrId) {
        // fixes the case, and lets us accept ids
        var trueName = name(nameOrId),
            trueNameToLower = trueName.toLowerCase(),
            auth = sys.maxAuth(sys.dbIp(trueName)) || 0;
        
        // check for PlayerPermissions (which is the main purpose of this function)
        if ((Config.PlayerPermissions[trueNameToLower] || auth) > auth) {
            auth = Config.PlayerPermissions[trueNameToLower];
        }
        
        return auth;
    };
    
    // returns an array of all ids of [ip] (everyone logged in with [ip])
    exports.ipIds = function ipIds(ip) {
        var playerIds = sys.playerIds(),
            ids = [],
            length = playerIds.length,
            player,
            i;

        for (i = 0; i < length; ++i) {
            player = playerIds[i];
            
            if (ip === sys.ip(player)) {
                ids.push(player);
            }
        }

        return ids;
    };
    
    // opts is an array with these values:
    // ip: The ip to mute.
    // by: The player who issued the mute.
    // reason: The reason of the mute.
    // time: Time the mute lasts in seconds.
    exports.mute = function mute(opts) {
        if (!opts.ip) {
            Utils.panic("scripts/player-utils.js", "mute", "IP is not specified.", opts, Utils.panic.warning);
            return;
        }
        
        if (!opts.by) {
            Utils.panic("scripts/player-utils.js", "mute", "By is not specified.", opts, Utils.panic.warning);
            return;
        }
        
        if (typeof opts.time !== 'number') {
            Utils.panic("scripts/player-utils.js", "mute", "Time is not specified or isn't a number.", opts, Utils.panic.warning);
            return;
        }
        
        // add the current time since epoch to the mute, as that is what we use to check if the mute has expired.
        opts.time += +(sys.time());
        
        if (!opts.reason) {
            opts.reason = "";
        }

        DataHash.mutes[opts.ip] = opts;
        
        // mute all of [opts.ip]'s names that are currently online.
        ipIds(opts.ip).forEach(function (id) {
            JSESSION.users(id).muted = true;
        });
    };
    
    // Returns the string name of the auth level [auth].
    // If img is true (PlayerUtils.authToString.imageIdentifier), returns the image identifier (the one used in po's default theme files)
    // of that auth level.
    exports.authToString = function authToString(auth, img) {
        var auths = {
            'true': {
                0: "User",
                1: "Moderator",
                2: "Administrator",
                3: "Owner",
                '3+': "Invisible"
            },
            'false': {
                0: "U",
                1: "M",
                2: "A",
                3: "O",
                '3+': "U"
            }
        };
        
        // Make sure it's an integer
        auth = Math.round(auth);
        
        // Make sure it's >= 0
        if (auth < 0) {
            auth = 0;
        }
        
        // Give it '3+' if it's > 3 (Invisible)
        if (auth > 3) {
            auth = '3+';
        }
        
        // true/false are used in the object to represent if the image identifier should be
        // returned, or not.
        return auths[img][auth];
    };
    
    exports.authToString.imageIdentifier = true;
    
    // Puts a player in multiple channels.
    exports.pushChannels = function pushChannels(src, channels) {
        var len = channels.length,
            i;

        for (i = 0; i < len; ++i) {
            sys.putInChannel(src, channels[i]);
        }
    };
    
    // If the player is on localhost (127.0.0.1)
    exports.isServerHost = function isServerHost(idOrNameOrIp) {
        return ip(idOrNameOrIp) === "127.0.0.1";
    };
}());