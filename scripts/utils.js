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
            return str.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/\>/g, "&gt;");
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
    
    // Returns the amount of keys in an object.
    exports.objectLength = function (obj) {
        return Object.keys(obj).length;
    };
    
    // Copies all values in [otherObj] to [obj]
    exports.extend = function (obj, otherObj) {
        var x;
    
        for (x in otherObj) {
            obj[x] = otherObj[x];
        }
    
        return obj;
    };
    
    // Checks if [name] is a valid tier and returns it with proper casing (if it does).
    // Otherwise returns false
    exports.isValidTier = function (name) {
        var tiers = sys.getTierList(),
            length = tiers.length,
            cur,
            i;
        
        name = name.toLowerCase();
        
        for (i = 0; i < length; ++i) {
            curr = tiers[i];
            
            if (curr.toLowerCase() === name) {
                // this corrects the case
                return curr;
            }
        }

        // return false to indicate that tier doesn't exist.
        return false;
    };
    
    // Checks if [value] is empty.
    exports.isEmpty = function (value) {
        // don't check this strictly
        if (value == undefined
                || value === " ") {
            return true;
        }

        // check if it's negative or 0
        if (type === "number") {
            return Utils.isNegative(value);
        }

        // check if there are no values
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        
        // check if there are no keys
        // note that we already checked for null and array, so this is guaranteed to be an object
        if (type === "object") {
            return Utils.objectLength(value) === 0;
        }

        return false;
    };
    
    // If [n] isn't NaN, negative, or 0
    exports.isPositive = function (number) {
        return !isNaN(number) && number >= 0;
    };
    
    // If [n] isn't NaN, is negative, or is 0
    exports.isNegative = function (number) {
        return !isNaN(number) && !exports.isPositive(number);
    };
    
    // Returns "on" if bool is true,
    // "off" if false
    exports.toOnString = function (bool) {
        return bool ? "on" : "off";
    };
    
    // Checks if 2 values are equal.
    // From Flight/flight.js: https://github.com/TheUnknownOne/Flight/blob/master/flight.js
    exports.isEqual = function deepEqual(condition1, condition2) {
        var type1,
            type2,
            i,
            isArray,
            len,
            nan1,
            nan2;
        
        if (condition1 === condition2) {
            return true; // speed stuff up.
        }
        
        if ((type1 = typeof condition1) !== (type2 = typeof condition2)) {
            return false; // don't even bother wasting time.
        }
        
        if ((isNaN(condition1) && isNaN(condition2)) && type1 === "number") {
            return true;
        }
        
        if (condition1.toString || condition2.toString) {
            if (!condition1.toString || !condition2.toString) {
                return false; // they clearly aren't equal
            }
            
            if (condition1.toString() !== condition2.toString()) {
                return false; // again, speeds stuff up
            }
        }
        
        if ((isArray = Array.isArray(condition1)) !== Array.isArray(condition2)) {
            return false; // check for Array
        }
        
        
        // begin doing work.
        if (type1 === "function") {
            if (condition1.name && condition2.name) {
                if (condition1.name === condition2.name) {
                    return true; // assume they're equal
                }
            }
            
            return condition1.toString() === condition2.toString(); // assume they're equal
        }
        
        if (['string', 'boolean', 'number'].indexOf(type1) !== -1) { // already verified that both their types are equal
            return condition1 === condition2;
        }
        
        if (condition1 instanceof Date || condition2 instanceof Date) {
            if (!(condition1 instanceof Date) || !(condition2 instanceof Date)) {
                return false;
            }
            
            return condition1.valueOf() === condition2.valueOf();
        }
        
        if (condition1 instanceof RegExp || condition2 instanceof RegExp) {
            if (!(condition1 instanceof RegExp) || !(condition2 instanceof RegExp)) {
                return false;
            }
            
            return condition1.source === condition2.source &&
                condition1.global === condition2.global &&
                condition1.ignoreCase === condition2.ignoreCase &&
                condition1.multiline === condition2.multiline &&
                condition1.sticky === condition2.sticky;
        }
        
        if (isArray) {
            if ((len = condition1.length) !== condition2.length) {
                return false; // try to bail out even more
            }
            
            if (condition1.toString() === condition2.toString()) {
                return true;
            }
            
            // ugh..
            
            for (i = 0; i < len; ++i) { // we already verified that they're of the same length
                if (!deepEqual(condition1[i], condition2[i])) {
                    return false;
                }
            }
            
            return true;
        }
        
        if (condition1.toString() === "[object Object]") {
            if (Object.keys(condition1).join(':') !== Object.keys(condition2).join(':')) {
                return false;
            }
            
            // didn't work :[
            
            for (i in condition1) {
                if (!(i in condition2)) {
                    return false;
                }
                
                if (!deepEqual(condition1[i], condition2[i])) {
                    return false;
                }
            }
            
            for (i in condition2) {
                if (!(i in condition1)) {
                    return false;
                }
                
                if (!deepEqual(condition2[i], condition1[i])) {
                    return false;
                }
            }
            
            return true;
        }
        
        return condition1 === condition2; // safety
    };
    
    // Turns [time] into a string (for example, 60 becomes "Minute"
    // TODO: Comments
    exports.timeToString = function (time) {
        var ret = [],
            times = [
                [2629744, "Month"],
                [604800, "Week"],
                [86400, "Day"],
                [3600, "Hour"],
                [60, "Minute"],
                [1, "Second"]
            ],
            timeToFormat = +(sys.time()) - time;

        times.forEach(function (value, index, array) {
            var currentTime = +(timeToFormat / value[0]),
                s = "";

            if (currentTime > 0) {
                if (currentTime > 1) {
                    s = "<b>s</b>";
                }

                ret.push((currentTime + " " + value[1] + s));
                timeToFormat -= currentTime * value[0];
            }
        });

        if (ret.length === 0) {
            return "1 Second";
        }

        return exports.fancyJoin(ret) + "</b>";
    };
    
    // A more fancy looking version than the default .join
    // TODO: Comments
    exports.fancyJoin = function (array) {
        var retstr = "",
            arrlen = array.length - 1;

        if (arrlen + 1 < 2) {
            return array.join("");
        }

        array.forEach(function (value, index) {
            if (index === arrlen) {
                retstr = retstr.substr(0, retstr.lastIndexOf(",")) + " and " + array[index];
                return;
            }

            retstr += array[index] + ", ";
        });

        return retstr;
    };
}());