(function setupUtil() {
    var capitalLetter = /[QWERTYUIOPASDFGHJKLZXCVBNM]/,
        lowerLetter = /[qwertyuiopasdfghjklzxcvbnm]/,
        urlPattern = /\b(?:https?|ftps?|git):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
        pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
        emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim,
        timeForName = [
            [2629744, "month"],
            [604800, "week"],
            [86400, "day"],
            [3600, "hour"],
            [60, "minute"],
            [1, "second"]
        ];

    Util = {};
    Util.escapeHtml = function (str) {
        return ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    Util.stripHtml = function (str) {
        return ('' + str).replace(/<\/?[^>]*>/g, '');
    };

    Util.escapeRegex = function (str) {
        return ('' + str).replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '\\$1');
    };
    
    Util.removeSpaces = function (str) {
        return str.split(' ').join('');
    };
    
    // Shortcut to Object.prototype.hasOwnProperty.call
    // Allows us to use hasOwnProperty even if it has been overwritten.
    Util.hasOwn = function (obj, property) {
        return Object.prototype.hasOwnProperty.call(obj, property);
    };
    
    Util.formatError = function (error, msg) {
        var lineNumber;
        
        if (typeof msg !== 'string') {
            msg = '';
        }
        
        if (!(error instanceof Error)) {
            return msg + " Custom Error: " + error;
        }
        
        lineNumber = error.lineNumber ? ' on line ' + error.lineNumber : '';
        return msg + " " + error.name + lineNumber + ": " + error.message;
    };
    
    // Capitalizes a string.
    Util.capitalize = function (str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    };
    
    // If the given letter is capitalized.
    Util.isCapitalLetter = function (letter) {
        return capitalLetter.test(letter);
    };
    
    // If the given letter isn't capitalized
    Util.isNormalLetter = function (letter) {
        return lowerLetter.test(letter);
    };
    
    // Turns [time] into a string (for example, 60 becomes "1 Minute")
    Util.timeToString = function (timeToFormat) {
        var ret = [],
            len = timeForName.length,
            currentTime,
            time,
            i;

        if (timeToFormat < 0) {
            return "0 seconds";
        }
        
        for (i = 0; i < len; i += 1) {
            time = timeForName[i];
            currentTime = parseInt(timeToFormat / time[0], 10);
            
            if (currentTime > 0) {
                ret.push(currentTime + " " + time[1] + (currentTime > 1 ? "s" : ""));
                timeToFormat -= currentTime * time[0];
                
                if (timeToFormat <= 0) {
                    break;
                }
            }
        }
        
        if (ret.length === 0) {
            return "1 second";
        }

        return Util.fancyJoin(ret);
    };
    
    // A more fancy looking version than the default .join
    Util.fancyJoin = function (array) {
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
    
    // Adds clickable links to a message for urls, pseudo urls, and email addresses.
    Util.linkify = function (message) {
        return message
            .replace(urlPattern, '<a target="_blank" href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a target="_blank" href="mailto:$1">$1</a>');
    };
    
    Util.channelLink = function (channel) {
        return "<a href='po:join/" + channel + "'>#" + channel + "</a>";
    };
    
    Util.channelNames = function () {
        var channelIds = sys.channelIds(),
            channelNames = [],
            len, i;
    
        for (i = 0, len = channelIds.length; i < len; i += 1) {
            channelNames.push(sys.channel(channelIds[i]));
        }
    
        return channelNames;
    };
    
    Util.addChannelLinks = function (str) {
        // Don't do anything if there are no #'s in the message.
        // Helps save on evaluation time, rarely messages will include a hash.
        if (str.indexOf('#') === -1) {
            return str;
        }
        
        var channelNames = Util.channelNames(),
            nameslength = channelNames.length,
            name, len, i;
    
        for (i = 0; i < nameslength; i += 1) {
            name = channelNames[i];
            str = str.replace(new RegExp("#" + name, "gi"), "<a href='po:join/" + name + "'>" + name + "</a>");
        }

        return str;
    };
    
    // Reverses a string/array.
    Util.reverse = function (str) {
        return str.reverse ? str.reverse() : str.split('').reverse().join('');
    };
}());