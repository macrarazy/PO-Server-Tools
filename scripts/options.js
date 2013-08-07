/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: options.js (Options)
// Contains script options (mainly default and hardcoded values). If you're looking to change behavior,
// change Config in scripts.js. Note that this file does have a couple of interesting properties,
// mainly defaultChannels (which you could change, if you wanted to).
// No dependencies.

// Table of Content:
// [dynval]: Dynamic values (values that are changed in the runtime of the script).
// [hcdval]: Hardcoded values (values that are not changed in the runtime of the script).

// It's only recommended to edit this file if you're adding new features.
// It only sets default values (and well, some other hardcoded stuff too).
// Note that these (among others) are usually changed by the script itself.
// If "don't change this" is noted in a comment, it means it's still used by the script (and changing it in this file could cause buggy behavior), 
// but not meant to be changed in this file.
(function () {
    // Dynamic values [dynval]
    
    /* These properties are configured to be the same as their Cache value. 
        Note that if you wish to change these, then you should use a command, or if you insist on changing the default,
        then cache.js is be the way to go. */
    // The bot's name and its color.
    // Cache field used: botSettings
    exports.bot = {
        name: "~Server~",
        color: "red"
    };

    // Message of the day.
    // Cache field used: motdSettings
    exports.motd = {
        enabled: false,
        message: "",
        setter: ""
    };
    
    // Global silence.
    // Cache field used: globalSilence
    exports.silence = {
        issuer: "",
        level: 0
    };
    
    // If players should be punished for flooding the chat.
    // Cache field used: floodCheck
    exports.floodCheck = true;
    
    // Highest amount of players recorded.
    // Cache field used: mostPlayersOnline
    exports.mostPlayersOnline = 0;
    /* End */
    
    // The server's name.
    exports.serverName = "";
    
    // The ids of the default channels (don't change this).
    exports.defaultChannelIds = {"main": 0, "mafia": -1, "staff": -1, "watch": -1, "eval": -1};
    
    // If the server is starting up (don't change this).
    exports.isStartingUp = false;
    
    // Time (since the Unix epoch) when the server started up (don't change this).
    exports.startUpTime = 0;
    
    // Counter for the 'step' event, which increases every second.
    exports.stepCounter = 0;
    
    // Info for ify, which is a command to change everyone's names into something of choice, and back.
    exports.ifyInfo = {
        names: {},
        name: "",
        active: false
    };
    
    // Hardcoded values [hcdval]
    
    // Default/main channels. Feel free to modify their names. Do note that you might have to restart the server afterwards (and stuff like tours, topics, auth, etc. won't carry over).
    // NOTE: Never put channels in between of these, only add them at the end of the array. (don't put a channel called "Trivia" between "Mafia" and "Ever Grande City")
    // Indexes:
    // 0: Main channel.
    // 1: Mafia channel (default is "Mafia").
    // 2: Staff channel (default is "Ever Grande City").
    // 3: Watch channel (default is "Guardtower").
    // 4: Eval channel (default is "Area 51").
    exports.defaultChannels = [
        sys.channel(0),
        "Mafia", // mafiachan
        "Ever Grande City", // staffchan
        "Guardtower", // watchchan
        "Area 51" // evalchan
    ];
	
    exports.border = "<font color='mediumblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</font>";
}());