/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

(function () {
    var Bot = require('bot');
    
    // TODO: Possibly move to scripts/ux.js
    // Team alert shortcut
    exports.teamAlertMessage = function (src, team, message) {
        Bot.sendMessage(src, "Team #" + (team + 1) + ": " + message);
    };
        
    // TODO: Possibly move to scripts/ux.js
    // Invalid command shortcut
    exports.invalidCommand = function (src, command, chan) {
        Bot.escapeMessage(src, "The command " + command + " doesn't exist.", chan);
    };
        
    // TODO: Possibly move to scripts/ux.js
    // No permission shortcut
    exports.noPermissionMessage = function (src, command, chan) {
        Bot.escapeMessage(src, "You may not use the " + command + " command.", chan);
    };
    
    // Escapes a string's html
    exports.escapeHtml = function (msg) {
        return (sys.escapeHtml || function (str) {
            return str.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
        })(msg);
    };
    
    // Formats errors nicely.
    // Message is optional.
    exports.formatError = function (message, error) {
        var line = "";
        
        if (typeof error === "undefined") {
            error = message;
            message = "";
        }
    
        if (typeof error.toLowerCase !== 'undefined') { // when throw is used, error is a string.
            return message + " Custom Error: " + e.toString();
        }
    
        if (e.lineNumber !== 1) {
            line = " on line " + e.lineNumber;
        }
    
        return message + " " + error.name + line + ": " + error.message;
    };
    
    // Creates a clickable channel link
    exports.channelLink = function (channel) {
        if (sys.channelId(channel) === undefined) {
            return "";
        }
    
        return "<a href='po:join/" + channel + "'>#" + channel + "</a>";
    };
    
    // Returns an array of channel names.
    exports.channelNames = function () {
        var channelIds = sys.channelIds(),
            channelNames = [],
            length = channelIds.length,
            i;
    
        for (i = 0; i < length; ++i) {
            channelNames.push(sys.channel(channelIds[i]));
        }
    
        return channelNames;
    };
    
    // TODO: Possibly move to scripts/ux.js
    // Adds channel links to a message
    exports.addChannelLinks = function (str) {
        var channelNames = exports.channelNames(),
            length = channelNames.length,
            i;
    
        for (i = 0; i < length; ++i) {
            str = str.replace(
                new RegExp("#" + channelNames[i], "gi"),
                "<a href='po:join/" + channelNames[i] + "'>" + channelNames[i] + "</a>"
            );
        }
    
        return str;
    };
    
    // If the given letter is capitalized
    exports.isCapitalLetter = function (letter) {
        return (/[QWERTYUIOPASDFGHJKLZXCVBNM]/).test(letter);
    };
    
    // If the given letter isn't capitalized
    exports.isNormalLetter = function (letter) {
        return (/[qwertyuiopasdfghjklzxcvbnm]/).test(letter);
    };
    
    // Returns the length of a file
    exports.fileLength = function (file) {
        return (sys.getFileContent(file) || "").length;
    };
    
    // Cuts an array starting from [entry], turning it into an array.
    // Then .join is called using [join] as argument. The result is returned (an array).
    // If the [array] isn't an array, then simply returns it back.
    exports.cut = function (array, entry, join) {
        if (!join) {
            join = "";
        }
    
        if (!Array.isArray(array)) {
            return array;
        }
    
        return [].concat(array).splice(entry).join(join);
    };

    firstTeamForTier = function (id, tier) {
        if (Config.NoCrash) {
            return 0;
        }
    
        var ttl = tier.toLowerCase(),
            x;
    
        for (x = 0; x < sys.teamCount(id); x++) {
            if (sys.tier(id, x).toLowerCase() == ttl) {
                return x;
            }
        }
    
        return -1;
    };
    
    hasTeam = function (id, tier) {
        if (!tier) {
            return sys.teamCount(id) != 0;
        }
    
        return sys.hasTier(id, tier);
    };
}());