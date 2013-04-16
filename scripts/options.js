/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

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
    
    // Bot: name and color
    exports.Bot = {
        bot: "~Server~",
        color: "red"
    };
    
    // If players should automatically be muted for flooding.
    exports.AutoMute = true;
    
    // The server's name.
    exports.serverName = "";
    
    // The ids of the default channels (don't change this).
    exports.defaultChannelIds = {"main": 0, "mafia": -1, "trivia": -1, "triviarev": -1, "staff": -1, "watch": -1, "eval": -1};
    
    // If the server is starting up (don't change this).
    exports.isStartingUp = false;
    
    // Time (since Unix epoch) when the server started up (don't change this).
    exports.startUpTime = 0;
    
    // Counter for the 'step' event, which increases every second.
    exports.stepCounter = 0;
    
    // Hardcoded values [hcdval]
    
    // Default/main channels
    exports.defaultChannels = [
        sys.channel(0),
        "Mafia", // mafiachan
        "Trivia", // trivchan
        "Trivia Review", // trivrevchan
        "Ever Grande City", // staffchan
        "Guardtower", // watchchan
        // TODO: Remove evalchan/scriptchannel, merge to watch/watchchan
        "Area 51" // evalchan
    ];
}());