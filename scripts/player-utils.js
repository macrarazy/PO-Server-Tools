/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

// File: player-utils.js
// Contains player utilities (such as easily getting player and team information).
// Dependencies: datahash, jsession, utils

// No Table of Content.

(function () {
    var JSESSION = require('jsession').JSESSION,
        // TODO: DataHash.correctNames, DataHash.namesByIp
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
    
    // Capitalizes a name (even when the player is offline), or returns it (id)
    exports.name = function name(nameOrId) {
        if (typeof nameOrId === 'string') {
            return DataHash.correctNames[nameOrId.toLowerCase()] || sys.name(nameOrId) || nameOrId;
        } else if (typeof nameOrId === 'number') {
            return sys.name(nameOrId) || "~Unknown~";
        }
        
        // panics if it isn't a string or number.
        Utils.panic("scripts/player-utils.js", "PlayerUtils.name(nameOrId)", "Player is not a string or a number.", "typeof nameOrId: " + typeof nameOrId + " | nameOrId's value: " + nameOrId, utils.panic.warning);
        
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
        Utils.panic("scripts/player-utils.js", "PlayerUtils.ip(nameOrIdOrIp)", "Player is not a string or a number.", "typeof nameOrIdOrIp: " + typeof nameOrIdOrIp + " | nameOrIdOrIp's value: " + nameOrIdOrIp, utils.panic.warning);
        
        return "0.0.0.0";
    };
    
    exports.trueAuth = function trueAuth() {
    };
    
    exports.mute = function mute() {
    };
}());