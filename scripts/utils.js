/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

// File: utils.js (Utils)
// Contains utilities not specificly for players, channels, and logging.
// Depends on: bot

// No Table of Content.

(function () {
    var Bot = require('bot');
    
    // Team alert shortcut
    exports.teamAlertMessage = function teamAlertMessage(src, team, message) {
        Bot.sendMessage(src, "Team #" + (team + 1) + ": " + message);
    };
        
    // Invalid command shortcut
    exports.invalidCommand = function invalidCommand(src, command, chan) {
        Bot.escapeMessage(src, "The command " + command + " doesn't exist.", chan);
    };
        
    // No permission shortcut
    exports.noPermissionMessage = function noPermissionMessage(src, command, chan) {
        Bot.escapeMessage(src, "You may not use the " + command + " command.", chan);
    };
    
    // Escapes a string's html
    exports.escapeHtml = function escapeHtml(msg) {
        return (sys.escapeHtml || function (str) {
            return str.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/\>/g, "&gt;");
        })(msg);
    };
    
    // Formats errors nicely.
    // Message is optional.
    exports.formatError = function formatError(message, error) {
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
    
    // Not as serious as Unix, but still meant for error reporting.
    // Prints a dump, a message, and the file the error originates from.
    // dump is optional and can be an object/array as well.
    // isWarning is to indicate that this is a warning, and not an error.
    exports.panic = function panic(fileName, functionName, message, dump, isWarning) {
        // don't do anything if warnings are disabled and this is a warning.
        if (!Config.Warnings && isWarning) {
            return;
        }
        
        print("");
        print((isWarning ? "Warning" : "Error") + " from " + fileName + "@" + functionName + ":");
        print(message);
        
        if (dump) {
            // turns arrays/objects into strings (doesn't like functions/numbers/etc., though).
            try {
                dump = JSON.stringify(dump);
            } catch (e) {}
            
            print("Data dump supplied: " + dump);
        }
        
        print("");
        
        if (isWarning) {
            print("Please note that this is a warning. The script should work fine, and reporting it is completely optional. In certain cases, reports might even be ignored.");
        } else {
            print("Please report this at GitHub ( https://github.com/TheUnknownOne/PO-Server-Tools/issues ) or PM ( http://pokemon-online.eu/forums/private.php?do=newpm&u=15094 ). In certain cases, features might cease to function or you might have to restart the server (don't do this right away though, unless if the error message states so).");
        }
    };
    
    // Makes the isWarning argument more readable.
    exports.panic.warning = true;
    exports.panic.error = false;
    
    // Creates a clickable channel link
    exports.channelLink = function channelLink(channel) {
        if (sys.channelId(channel) === undefined) {
            return "";
        }
    
        return "<a href='po:join/" + channel + "'>#" + channel + "</a>";
    };
    
    // Returns an array of channel names.
    exports.channelNames = function channelNames() {
        var channelIds = sys.channelIds(),
            chanNames = [],
            length = channelIds.length,
            i;
    
        for (i = 0; i < length; ++i) {
            chanNames.push(sys.channel(channelIds[i]));
        }
    
        return chanNames;
    };
    
    // TODO: Possibly move to scripts/ux.js
    // Adds channel links to a message
    exports.addChannelLinks = function addChannelLinks(str) {
        var chanNames = channelNames(),
            length = chanNames.length,
            chanName,
            i;
    
        for (i = 0; i < length; ++i) {
            chanName = chanNames[i];
            
            str = str.replace(
                new RegExp("#" + chanName, "gi"),
                "<a href='po:join/" + chanName + "'>" + chanName + "</a>"
            );
        }
    
        return str;
    };
    
    // If the given letter is capitalized
    exports.isCapitalLetter = function isCapitalLetter(letter) {
        return (/[QWERTYUIOPASDFGHJKLZXCVBNM]/).test(letter);
    };
    
    // If the given letter isn't capitalized
    exports.isNormalLetter = function isNormalLetter(letter) {
        return (/[qwertyuiopasdfghjklzxcvbnm]/).test(letter);
    };
    
    // Returns the length of a file
    exports.fileLength = function fileLength(file) {
        return (sys.getFileContent(file) || "").length;
    };
    
    // Cuts an array starting from [entry], turning it into an array.
    // Then .join is called using [join] as argument. The result is returned (an array).
    // If the [array] isn't an array, then simply returns it back.
    exports.cut = function cut(array, entry, join) {
        if (!join) {
            join = "";
        }
    
        if (!Array.isArray(array)) {
            return array;
        }
    
        return [].concat(array).splice(entry).join(join);
    };
    
    // Returns the amount of keys in an object.
    exports.objectLength = function objectLength(obj) {
        return Object.keys(obj).length;
    };
    
    // Copies all values in [otherObj] to [obj]
    exports.extend = function extend(obj, otherObj) {
        var x;
    
        for (x in otherObj) {
            obj[x] = otherObj[x];
        }
    
        return obj;
    };
    
    // Checks if [name] is a valid tier and returns it with proper casing (if it does).
    // Otherwise returns false
    exports.isValidTier = function isValidTier(name) {
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
    exports.isEmpty = function isEmpty(value) {
        // don't check this strictly
        if (value == undefined
                || value === " ") {
            return true;
        }

        // check if it's negative or 0
        if (type === "number") {
            return isNegative(value);
        }

        // check if there are no values
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        
        // check if there are no keys
        // note that we already checked for null and array, so this is guaranteed to be an object
        if (type === "object") {
            return objectLength(value) === 0;
        }

        return false;
    };
    
    // If [n] isn't NaN, negative, or 0
    exports.isPositive = function isPositive(number) {
        return !isNaN(number) && number >= 0;
    };
    
    // If [n] isn't NaN, is negative, or is 0
    exports.isNegative = function isNegative(number) {
        return !isNaN(number) && !isPositive(number);
    };
    
    // Returns "on" if bool is true,
    // "off" if false
    exports.toOnString = function toOnString(bool) {
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
    exports.timeToString = function timeToString(time) {
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

        return fancyJoin(ret) + "</b>";
    };
    
    // A more fancy looking version than the default .join
    // TODO: Comments
    exports.fancyJoin = function fancyJoin(array) {
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
    
    exports.callEvent = function callEvent(name, args) {
        // this is quite rare..
        if (!script) {
            print("Runtime Error (from scripts/utils.js:callEvent): script doesn't exist.");
            return;
        }
        
        if (!script[name]) {
            print("Runtime Error (from scripts/utils.js:callEvent): script." + name + " doesn't exist.");
            return;
        }
        
        // wrap it in a try/catch
        
        try {
            // properly set the scope.
            script[name].apply(script[name], [].slice.call(arguments, 1));
        } catch (e) {
            print("Runtime Error (from scripts/utils.js:callEvent): script." + name + " returned an error: " + formatError(e));
        }
    };
    
    // Calls multiple events.
    // Array should be as follows: [["eventName", "eventArgument1", "eventArgumentEtc"], ["etc"]]
    exports.callEvents = function callEvents(events) {
        var length = events.length,
            event,
            i;
        
        for (i = 0; i < length; ++i) {
            event = events[i];
            // defined at "exports.callEvent = function callEvent"
            callEvent.apply(this, [event[0], [].slice.call(arguments, 1)]);
        }
    };
    
    // Updates an object's prototype (adding/removing functions)
    exports.updatePrototype = function updatePrototype(object, proto) {
        if (object.prototype !== proto.prototype) {
            func.prototype = proto.prototype;
        }
    };
    
    // Finishes a sentence by adding '.' to it if the last character isn't '.', '?', '!', or ';'.
    exports.finishSentence = function finishSentence(string) {
        var lastCharacter = string[string.length - 1];
        
        if (!lastCharacter) {
            return "";
        }
        
        // if the last character isn't...
        if (['.', '?', '!', ';'].indexOf(lastCharacter) !== -1) {
            string += ".";
        }
        
        return string;
    };
    
    // Ensures the file [fileName] exists, and writes [defaultContent] to it if it doesn't.
    // defaultContent is optional; nothing will be written regardless if the file exists or not if it isn't passed.
    exports.createFile = function (fileName, defaultContent) {
        sys.appendToFile(fileName, "");
        
        if (defaultContent && sys.getFileContent(fileName) === "") {
            sys.writeToFile(fileName, defaultContent);
        }
    };
}());