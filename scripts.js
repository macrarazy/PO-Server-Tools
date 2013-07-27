/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    Config: true, require: false, module: true, exports: true*/

/*
 ==== SCRIPT INFORMATION ====
 - Version: 3.0.0 Devel 1 -
 - Maintained by TheUnknownOne -
 - Licensed under MIT (LICENSE) | Version 2.x is licensed under GPL v3 -
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

/* Script Configuration */
var Config = {
    // If teams should be checked for Dream World abilities.
    DWAbilityCheck: true,

    // If a player automatically joins the default channels (Mafia, Staff channel, etc) (according to their auth).
    AutoChannelJoin: true,

    // If player welcome messages should be displayed to everyone.
    WelcomeMessages: false,

    // If admins can give and take auth from users and to moderators.
    AdminsCanAuth: true,
    
    // Attempts to fix some crashes. Some features might not be available.
    // If you don't have any problems with crashes (related to this script), don't enable this.
    NoCrash: false,
    
    // If warnings should be printed on the server window. Errors will not be affected by this option.
    Warnings: true,
    
    // If channels can be created by players. Default channels (and those created with the 'eval' command) can be created regardless.
    ChannelsEnabled: true,
    
    // If battles can be started by players.
    BattlesEnabled: true,
    
    // If certain tier bans used by the Pokémon Online tiers should be enforced.
    // No support for smogon tiers is available.
    TierBans: true,
    
    // File to save channel data in. 
    // It's recommended to keep this as-is, unless if you want to reset all channel data stored or want to import a file.
    // Note that v3 (this version) is not compatible with v2 channel data.
    ChannelDataFile: "channel-data.json",
    
    // File where actions and events will be logged to. 
    // Change this to "" in order to disable the log file. 
    // Note that it's recommended to clear this file (or simply move it to, for example, a logs directory) every now and then, 
    // otherwise the server might become laggy.
    LogFile: "server.log",
    
    // After how many seconds a player's message should be 'forgiven', causing it to not be taken into consideration by the floodbot.
    // The floodbot counts the amount of messages a player posts (the exact amount is in scripts/user.js) before it kicks them.
    // After this many seconds, the floodbot forgets that the player ever posted that message (and decreases the floodcount).
    FloodClearTime: 6,
    
    // List of players that can use the 'eval') command. Note that if the player isn't in this list, then they are simply not allowed to use the command,
    // even if they are Owner, with the exception of the server host (who has ip 127.0.0.1).
    
    // Note that it's important to write the player's name in lower case (so "theunknownone" instead of "TheUnknownOne").
    EvalAccess: [
        "example player with config.evalaccess",
        "another example player with config.evalaccess"
    ],
    
    // Changes that player's authority to that level when performing an auth lookup (so an administrator with a PlayerPermission of 3 can use owner commands, 
    // however, they still appear as an administrator, even in the authlist).
        
    // Note that it's important to write the player's name in lower case (so "theunknownone" instead of "TheUnknownOne").
    PlayerPermissions: {
        "example player with config.playerpermissions": 3,
        "another example player with config.playerpermissions": 2
    },
    
    // Mafia configuration.
    Mafia: {
        // Amount of different themes that have to be started before one that has been played (norepeat) games ago.
        norepeat: 3,

        // Path to the file where mafia stats will be written to.
        stats_file: "mafia-stats.json",

        // Maximum length for a player's name. If their name has more characters than this, they will not be able to join.
        max_name_length: 16
    }
};

// You shouldn't change most of these.
// The only thing you really should change is the "downloadBranch" variable, which decides from which branch to pull down.
// See the notice at the top of the script to find out what branch you want to use.
var Script = {
    // The script's version.
    version: "3.0.0 Devel 1",
    
    // URL to the script's data.
    downloadUrl: "https://raw.github.com/TheUnknownOne/PO-Server-Tools/",
    
    // Branch of the script's data. Make this an empty string if you're loading from somewhere else than GitHub.
    downloadBranch: "devel",
    
    // URL to the script's latest version (uses downloadUrl and downloadBranch as a base).
    versionCheckUrl: "scripts.version",
    
    // URL to a json file with the script's module files (uses downloadUrl and downloadBranch as a base).
    scriptFilesUrl: "scripts.files.json",
    
    // Time in milliseconds (since the Unix epoch) since the server (re)loaded the script. Used to calculate how long it took to load the script.
    loadStart: new Date().getTime()
};


// Don't modify anything beyond this point if you don't know what you're doing.
var global = this;
var GLOBAL = this;
var require;

if (typeof require === 'undefined') {
    // Includes a script.
    var require = (function () {
        var require, // require function, see below.
            hookId = 0; // hook guid.
        
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
            
            if (!content) {
                return {};
            }
            
            try {
                // This can access require, content, identifier, module(.exports, .path), exports, and path, as well as anything in the global namespace.
                eval(content);
            } catch (e) {
                print("Critical: Couldn't load module " + identifier + " (scripts/" + path + "): " + e.toString() + " (on line " + e.lineNumber + ").");
                
                if (e.backtracetext) {
                    print("Backtrace:");
                    print(e.backtracetext);
                }
            }
            
            require.modules[identifier] = module.exports;
            return require.modules[identifier];
        };
        
        require.hook = function (event, hook, hookId, force) {
            if (!require.hooks[event]) {
                require.hooks[event] = {};
            }
            
            if (!hookId) {
                hookId = event + " Hook #" + hookId;
            }
            
            if (!force && require.hooks[event][hookId]) {
                return false;
            }
            
            require.hooks[event][hookId] = hook;
            return true;
        };
        
        require.provide = function (event, args) {
            var ignoreEvent = false,
                hookArgs = [].slice.call(arguments, 1),
                hooks = require.hooks[event],
                i;
            
            if (!hooks) {
                return false;
            }
            
            for (i in hooks) {
                try {
                    if (hooks[i].apply(null, hookArgs)) {
                        ignoreEvent = true;
                    }
                } catch (e) {
                    print("Error: Couldn't execute hook '" + i + "' for event '" + event + "': " + e.toString() + " (on line " + e.lineNumber + ").");
                    
                    if (e.backtracetext) {
                        print("Backtrace:");
                        print(e.backtracetext);
                    }
                }
            }
            
            return ignoreEvent;
        };
        
        require.hooks = require.hooks || {};
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
    
    JSESSION.identifyScriptAs("TheUnknownOne's Server Script " + Script.version);
    JSESSION.registerUser(POUser);
    JSESSION.registerChannel(POChannel);
    JSESSION.refill();
    
    // Load modules that have to define some hooks.
    // We don't have to do anything else with them so creating a variable is pointless.
    require('ify');
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