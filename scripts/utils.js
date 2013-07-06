/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports, Script*/

// File: utils.js (Utils)
// Contains utilities not specificly for players, channels, and logging.
// Depends on: bot, options, chat-gradient

// No Table of Content.

(function () {
    var Bot = require('bot'),
        Options = require('options'),
        ChatGradient = require('chat-gradient');
    
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
            return message + " Custom Error: " + error.toString();
        }
    
        if (error.lineNumber !== 1) {
            line = " on line " + error.lineNumber;
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
            cur = tiers[i];
            
            if (cur.toLowerCase() === name) {
                // this corrects the case
                return cur;
            }
        }

        // return false to indicate that tier doesn't exist.
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
    
    // Checks if [value] is empty.
    exports.isEmpty = function isEmpty(value) {
        var type = typeof value;
        
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
    
    // Turns [time] into a string (for example, 60 becomes "Minute")
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
                    s = "s";
                }

                ret.push((currentTime + " " + value[1] + s));
                timeToFormat -= currentTime * value[0];
            }
        });

        if (ret.length === 0) {
            return "1 Second";
        }

        return fancyJoin(ret);
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
            object.prototype = proto.prototype;
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
    exports.createFile = function createFile(fileName, defaultContent) {
        sys.appendToFile(fileName, "");
        
        if (defaultContent && sys.getFileContent(fileName) === "") {
            sys.writeToFile(fileName, defaultContent);
        }
    };
    
    /* Changes all occurances of %num in [string] to the argument at the position of [string] + 1
        
        For example, when called like: format("Goodbye, %1. %2", playerName, randomGoodbye),
        the string returned will, for example, be "Goodbye, TheUnknownOne. Hope you had a nice time!" if playerName would be "TheUnknownOne"
        and randomGoodbye would be "Hope you had a nice time!". 
        
        This function is similar to http://qt-project.org/doc/qt-4.8/qstring.html#arg , except that it accepts all the arguments in one go.
        
        Very important to note that if, for example, you call the function with 3 arguments (the string and the 2 arguments that are replaced).
        but the string is, for example, "%1 %2 %3", %3 will remain untouched ("TheUnknownOne Hope you had a nice time! %3", it will be called the same way
        as illustrated above, but with the example string given in this section).
    */
    exports.format = function format(string) {
        var argsLength = arguments.length,
            i;
        
        // start at the first argument, which is the string.
        for (i = 1; i < argsLength; ++i) {
            string = string.replace(new RegExp("%" + (i + 1), "gm"), arguments[i]);
        }
        
        return string;
    };
    
    // Displays the script update message to every player.
    exports.scriptUpdateMessage = function scriptUpdateMessage() {
        var timeToRun = (new Date()).getTime() - Script.EVAL_TIME_START,
            took = "Runtime: " + timeToRun / 1000 + " seconds.";

        Script.EVAL_TIME_START = (new Date()).getTime();

        if (Options.isStartingUp) {
            print("\t\tServer Script has been loaded.\t\t\n\t\tEvaluation Time: " + timeToRun / 1000 + " seconds.\t\t");
            return;
        }
        
        sys.sendHtmlAll('<center><table border="1" width="50%" style="background: qradialgradient(cy: 0.1, cx: 0.5, fx: 0.9, fy: 0, radius: 2 stop: 0 black, stop: 1 white);"><tr style="background: qradialgradient(cy: 0.1, cx: 0.5, fx: 0.9, fy: 0, radius: 2 stop: 0 black, stop: 1 white);"><td align="center"><img src="pokemon:493&back=true" align="left"><img src="pokemon:385&back=false" align="right"><font size="4"><b><br/> ' + Options.serverName + ' - Scripts <br/></b></font> Scripts have been updated! <br/> ' + took + ' <br/> ~ ' + Script.SCRIPT_VERSION + ' ~ <br/></td></tr></table></center>', 0);
        
        // Refresh the gradient in the main channel, if it uses one.
        if (ChatGradient.hasChannel(0)) {
            ChatGradient.refresh(0);
        }
    };
    
    // Removes all spaces from a string.
    exports.removeSpaces = function removeSpaces(str) {
        return str.split(" ").join("");
    };
    
    // Sorts an object alphabetically.
    // NOTE: Doesn't copy over non-enumerable objects and doesn't copy deep.
    exports.sortObject = function (obj) {
        var keys = Object.keys(obj),
            sortedObject = {},
            key,
            len = keys.length,
            i;

        keys.sort();

        for (i = 0; i < len; i += 1) {
            key = keys[i];
            sortedObject[key] = obj[key];
        }

        return sortedObject;
    };
}());