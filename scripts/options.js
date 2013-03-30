/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

// It's only recommended to edit this file if you're adding new features.
// It only sets default values, you see. (and well, some other hardcoded stuff too)
(function () {
    // HARDCODED: Default/main channels
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
    
    // Bot: name and color
    exports.Bot = {
        bot: "~Server~",
        color: "red"
    };
    
    // If players should automatically be muted for flooding.
    exports.AutoMute = true;
}());