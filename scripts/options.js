/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

// It's only recommended to edit this file if you're adding new features.
// It only sets default values, you see. (and well, some other hardcoded stuff too)
// Note that these (among others) are usually changed by the script itself.
// If "don't change this" is noted in a comment, it means it's still used by the script, but not meant to be changed in this file.
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
    
    // The ids of the default channels.
    exports.defaultChannelIds = {"main": 0, "mafia": -1, "trivia": -1, "triviarev": -1, "staff": -1, "watch": -1, "eval": -1};
    
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
    
    // If the server is starting up (don't change this).
    exports.isStartingUp = false;
    
    // Time (since Unix epoch) when the server started up (don't change this).
    exports.startUpTime = 0;
}());