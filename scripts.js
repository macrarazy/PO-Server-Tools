/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    Config: true, require: false, module: true, exports: true*/

/*
 ==== SCRIPT INFORMATION ====
 - Version: 3.0.0 Devel -
 - Maintained by TheUnknownOne -
 - Licensed under MIT (LICENSE.txt) | Version 2.x is licensed under GPL v3 -
 - Special Thanks to Lamperi, Mystra, Intel_iX, and Lutra -

 Release: https://github.com/TheUnknownOne/PO-Server-Tools/master/
 - Has no known errors
 Beta: https://github.com/TheUnknownOne/PO-Server-Tools/beta/
 - Has no obvious errors - shouldn't crash
 Alpha: https://github.com/TheUnknownOne/PO-Server-Tools/alpha/
 - Has no fatal errors - can crash
 Development: https://github.com/TheUnknownOne/PO-Server-Tools/devel/
 - Untested code/sandbox for all other versions

 All module are in the 'scripts' directory. Note that these are required.
 
 Thanks for using this script! :)
 */

// TODO: More comments. :]
// TODO: Use the new events.
/* Script Configuration */
var Config = {
    /* If teams should be checked for Dream World abilities */
    DWAbilityCheck: true,

    /* If the default channels are automatically joined when a player goes on the server */
    AutoChannelJoin: true,

    /* If welcome messages should be displayed globally */
    WelcomeMessages: false,

    /* If admins can give and take auth from users and to moderators. */
    AdminsCanAuth: true,
    
    /* Attempts to fix crashes. Some features might not be available (so if you don't have any problems
        with crashes, don't enable this). */
    NoCrash: false,
    
    /* If warnings should be printed on the server window. Errors will not be affected by this option. */
    Warnings: true,
    
    /* If channels can be created by players. Default channels (and those created with the 'eval' command) can be created regardless. */
    ChannelsEnabled: true,
    
    /* If battles can be started by players. */
    BattlesEnabled: true,
    
    /* If certain tier bans used by the Pokémon Online tiers should be enforced. */
    TierBans: true,
    
    /* File to save channel data in. It's recommended to keep this as-is, unless if you want to reset
        all channel data stored or want to import a file. Note that v3 (this version) is not compatible with v2 channel data. */
    ChannelDataFile: "channel-data.json",
    
    /* File where actions and events will be logged to. 
        Change this to "" in order to disable the log file. 
        Note that it's recommended to clear this file (or simply move it to for example, a logs directory) every now and then, 
        otherwise the server might become laggy. */
    LogFile: "server.log",
    
    /* After how many seconds a player's message should be 'forgiven', causing it to not be counted by
        the floodbot. The floodbot counts the amount of messages a player posts (the exact amount is in scripts/user.js) before it kicks them.
        After this many seconds, the floodbot forgets that the player ever posted a message, causing it not
        to be counted in flood kick calculations. */
    AutoFloodTime: 6,
    
    /* Characters which indicate the usage of a command. */
    CommandStarts: ["/", "!"],
    
    /* List of players that can use the 'eval') command. Note that if the player isn't in this list, then they are simply not allowed to use the command,
        even if they are Owner, with the exception of the server host (who has ip 127.0.0.1).*/
    EvalAccess: [
        "Example player with Config.EvalAccess",
        "Another example player with Config.EvalAccess"
    ],
    
    /* Changes that players authority to that level when performing an auth lookup (so an administrator with a PlayerPermission of 3 can use owner commands, 
        however, they still appear as an administrator).
        
        Note that it's important to write the player's name in lower case (so "theunknownone" instead of "TheUnknownOne")
    */
    PlayerPermissions: {
        "example player with config.playerpermissions": 3,
        "another example player with config.playerpermissions": 2
    },
    
    /* Mafia Configuration */
    Mafia: {
        /* Amount of different themes that have to be started before one that has been played (norepeat) games ago */
        norepeat: 3,

        /* Path to the file where mafia stats will be written to. */
        stats_file: "mafia-stats.json",

        /* Maximum length for a player's name who wants to join a mafia game. */
        max_name_length: 16
    }
};

/* Don't modify anything beyond this point if you don't know what you're doing. */

var Script = {
    /* Version of the script. */
    SCRIPT_VERSION: "3.0.0 Devel",
    
    /* URL for modules/languages, as well as the script itself. */
    DOWNLOAD_URL: "https://raw.github.com/TheUnknownOne/PO-Server-Tools/devel/",
    
    /* Time in milliseconds (since the Unix epoch) since the server (re)loaded the script. Used to calculate loading speeds. */
    EVAL_TIME_START: new Date().getTime()
};

var global = this;
var GLOBAL = this;
var require;

if (typeof require === 'undefined') {
    // Includes a script.
    var require = (function () {
        var require; // require function, see below.
        
        // path: path to the file, no .js
        // nocache: if the cache for the file should be deleted
        require = function (path, force) {
            var content,
                identifier = String(path),
                module = {exports: {}, path: path + ".js"},
                exports = module.exports;
                
            path += ".js";
            
            // Quickly get the module
            if (require.modules[identifier] && !force) {
                return require.modules[identifier];
            }
            
            content = sys.getFileContent("scripts/" + path);
            
            if (content === undefined) {
                return {};
            }
            
            try {
                // This can access require, content, identifier, module(.exports, .path), exports, and path, aswell as anything in the global namespace.
                eval(content);
            } catch (e) {
                print("Fatal Error: Couldn't load module " + identifier + " (scripts/" + path + "): " + e.toString() + " on line " + e.lineNumber);
            }
            
            require.modules[identifier] = module.exports;
            return require.modules[identifier];
        };
        
        require.modules = require.modules || {};
        return require;
    }());
}

// This updates all the module prototypes (and pre-loads some of them, as they are used a lot).
// No need to polute the global namespace with this.
(function () {
    var Utils = require('utils'),
        // JSESSION stuff
        POUser = require('user').User,
        POChannel = require('channel').Channel,
        JSESSION = require('jsession'),
        // these are only used to be updated with Utils.updatePrototype
        Cache = require('cache'),
        ChannelData = require('channel-data');
    
    // Attempts to add new features to JSESSION, Cache, and ChannelData
    Utils.updatePrototype(JSESSION.JSESSION, JSESSION.jsession_constructor);
    Utils.updatePrototype(Cache.Cache, Cache.cache_constructor);
    Utils.updatePrototype(ChannelData.ChannelData, ChannelData.channeldata_constructor);
    
    // NOTE: hasTeam -> PlayerUtils.hasTeamForTier
    // NOTE: firstTeamForTier -> PlayerUtils.firstTeamForTier
    // NOTE: script.namecolor -> PlayerUtils.trueColor
    // NOTE: script.loadAll -> script.init
    
    // NOTE: These will not be used anymore as-is, but some of them (like linkify) will be merged with utils
    /*
    defineCoreProperty(String.prototype, "scramble", function () {
        var thisString = this.split("");
        for (var i = thisString.length, j, k; i; j = parseInt(Math.random() * i), k = thisString[--i], thisString[i] = thisString[j], thisString[j] = k) {}
        return thisString.join("");
    });
    
    defineCoreProperty(String.prototype, "linkify", function () {
        var urlPattern = /\b(?:https?|ftps?|git):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
            pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
            emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim,
            poPattern = /\bpo:[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
    
        return this.replace(urlPattern, '<a target="_blank" href="$&">$&</a>').replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>').replace(emailAddressPattern, '<a target="_blank" href="mailto:$1">$1</a>').replace(poPattern, function ($) {
            var type = $.substring($.indexOf(":", $.indexOf("/"))),
                thing = $.substring($.indexOf("/"));
    
            type = type[0].toUpperCase() + type.substring(1);
    
            return "<a href='" + $ + "'>" + type + " " + thing + "</a>";
        });
    });
    */
    
    JSESSION.identifyScriptAs("TheUnknownOne's Server Script " + Script.SCRIPT_VERSION);
    JSESSION.registerUser(POUser);
    JSESSION.registerChannel(POChannel);
    JSESSION.refill();
}());
/*
function Mail(sender, text, title) {
    var date = new Date();

    this.sender = sender;
    this.title = title;
    this.text = text;
    this.read = false;
    this.sendtime = String(date);
    this.sendAgo = +(sys.time());
}*/

// This defines all the events used by the PO script engine.
script = require('events');