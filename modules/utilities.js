/*
 Dependencies:
 - modules/jsext.js
 + modules/datahash.js
 + modules/channels.js (for util.watch)
 */

/**
 * @fileOverview Utilities file
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

if (!Bot) {
    /**
     * Bot configuration
     * @type {Object}
     */
    Bot = {
        "name": "~Server~",
        "color": "red"
    };
}

/**
 * Utilities namespace
 * @namespace
 * @type {Object}
 */

util = {};

/**
 * Player utilities
 * @namespace
 * @type {Object}
 */
util.player = {
    /**
     * To check if a player's ip is the same as the given target's
     * @param {PID} src Player identifier
     * @param {PID} tar Player identifier of player to check against
     * @return {Boolean} If the ip of src is the same of tarName
     * @example util.player.self(src, sys.name(src)); // true
     */
    self: function (src, tar) {
        return util.player.ip(src) === util.player(tar);
    },
    /**
     * Returns the players "true" auth (Config.PlayerPermissions and maxAuth on ip calculated)
     * @param {PID} src Player identifier
     * @return {Number} Auth level
     */
    auth: function (src) {
        var perms = Config.PlayerPermissions,
            name,
            auth,
            maxAuth;

        src = util.player.id(src);

        name = sys.name(src),
            auth = sys.auth(src),
            maxAuth = sys.maxAuth(sys.ip(src));

        if (!sys.loggedIn(src)) {
            name = src, auth = sys.dbAuth(src), maxAuth = sys.maxAuth(auth);
        }

        perms = perms[name];

        if (perms !== undefined && perms > maxAuth) {
            maxAuth = perms;

        }

        return maxAuth;
    },
    /**
     * Checks if a player has permission to perform a specific action
     * @param {PID} src Player identifier
     * @param {Number} minAuth Minimum auth required to perform the action
     * @return {Boolean} If the player has permission to do the action
     */
    hasPermission: function (src, minAuth) {
        return util.player.auth(src) >= minAuth;
    },
    /**
     * Formatted player name
     * @param {PID} user Player identifier
     * @return {String} Formatted name
     */
    player: function (user) {
        return "<b><font color='" + util.player.color(user) + "'>" + util.player.name(user).escapeHtml() + "</font></b>";
    },
    /**
     * Properly capitalizes a name or makes a name out of an Id
     * @param {PID} user Player identifier
     * @return {String|*} Name of the player, or (user) if the player doesn't exist
     */
    name: function (user) {
        if (user !== undefined && typeof user === "string" || DataHash && DataHash.names && DataHash.names.has(user.toLowerCase())) {
            return user.name();
        } else if (typeof user === "number") {
            return sys.name(user);
        }

        return user;
    },
    /**
     * Gets the id of a player. Throws the id back if the given number (id) is online, or -1 neither worked
     * @param {PID} user Player identifier
     * @return {Number|*} Id of the player, or (user) if the player isn't online
     */
    id: function (user) {
        if (typeof user === "string") {
            return sys.id(user) || user;
        } else if (sys.loggedIn(user)) {
            return user;
        }

        return user;
    },
    /**
     * Returns the color of a player
     * @param {PID} user Player Identifier
     * @return {String} The player's color
     */
    color: function (user) {
        var src = util.player.id(user), myColor = sys.getColor(src), colorlist;
        if (myColor == '#000000') {
            colorlist = [
                '#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f',
                '#1b1390', '#028678', '#0324b1'
            ];
            return colorlist[src % colorlist.length];
        }
        return myColor;
    },
    /**
     * Returns the IP of a player
     * @param {PID} player Player identifier
     * @return {String|Undefined} The player's ip or undefined if they don't exist
     */
    ip: function (player) {
        return sys.dbIp(util.player.name(player));
    }
};

/**
 * Channel utilities
 * @namespace
 * @type {Object}
 */

util.channel = {
    /**
     * Returns a channel's id
     * @param {CID} name Channel identifier
     * @return {Number} The channel's id, or -1 if the channel doesn't exist
     */
    id: function (name) {
        var id;
        if (typeof name === "string") {
            id = sys.channelId(name);
            if (id == undefined) {
                return -1;
            }

            return id;
        } else if (typeof name === "number") {
            return name;
        }

        return -1;
    },
    /**
     * Returns a channel's name
     * @param {CID} id Channel identifier
     * @return {String} The channel's name, or an empty string
     */
    name: function (id) {
        return sys.channel(util.channel.id(id)) || "";
    },
    /**
     * Creates a channel or returns its id
     * @param {String} name Channel name
     * @return {Number} Id of the channel
     */
    create: function (name) {
        if (!sys.existChannel(name)) {
            return sys.createChannel(name);
        }

        return util.channel.id(name);
    },
    /**
     * Returns a click-able link in the client to join (channel)
     * @param {CID} channel Channel identifier
     * @return {String}
     */
    link: function (channel) {
        channel = util.channel.name(channel);

        return "<a href='po:join/" + channel + "'>#" + channel + "</a>";
    }
};

/**
 * Moderation utilities
 * @namespace
 * @type {Object}
 */
util.mod = {
    /**
     * Bans a player, and kicks them
     * @param {PID} name Player identifier to ban
     */
    ban: function (name) {
        var id;

        name = util.player.name(name);
        id = util.player.id(name);

        sys.ban(name);

        if (id != undefined) {
            util.mod.kick(id);
        }
        else {
            util.mod.kickAliases(sys.dbIp(name));
        }
    },
    /**
     * Disconnects a player in 20 milliseconds
     * @param {PID} src Player identifier to disconnect
     */
    disconnect: function (src) {
        sys.callQuickly("sys.disconnect(" + util.player.id(src) + ")", 20);
    },
    /**
     * Disconnects a player and their online alts in 20 milliseconds
     * @param {PID} src Player identifier to disconnect
     */
    disconnectAll: function (src) {
        var x,
            id,
            ip = util.player.ip(src),
            pids = sys.playerIds();

        for (x in pids) {
            id = playerIdList[x];
            if (ip === sys.ip(id)) {
                util.mod.disconnect(id);
            }
        }
    },
    /**
     * Kicks a player in 20 milliseconds
     * @param {PID} src Player identifier to kick
     */
    kick: function (src) {
        sys.callQuickly("sys.kick(" + util.player.id(src) + ");", 20);
    },
    /**
     * Kicks a player and their online alts in 20 milliseconds
     * @param {PID} src Player identifier to kick
     */
    kickAll: function (src) {
        var x,
            id,
            ip = sys.ip(util.player.ip(src)),
            pids = sys.playerIds();

        for (x in pids) {
            id = playerIdList[x];
            if (ip == sys.ip(id)) {
                util.mod.kick(id);
            }
        }
    },
    /**
     * Kicks an ip's alts (when the target is offline)
     * @param {String} ip IP used to check for alts to kick them
     */
    kickAliases: function (ip) {
        var aliases = sys.aliases(ip),
            alias,
            id;

        for (alias in aliases) {
            id = sys.id(aliases[alias]);
            if (id !== undefined) {
                util.mod.kick(id);
            }
        }
    }
};

/**
 * Bot utilities
 * @namespace
 * @type {Object}
 */
util.bot = {
    /**
     * Sends a message from the bot to src, in an optional channel
     * @param {PID} src Player identifier
     * @param {String} message Message to send to src
     * @param {CID} [channel] Channel identifier
     */
    send: function (src, message, channel) {
        var color = Bot.color,
            name = Bot.name;

        src = util.player.id(src);
        channel = util.channel.id(channel);

        if (channel !== -1) {
            sys.sendHtmlMessage(src, "<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message, channel);
        }
        else {
            sys.sendHtmlMessage(src, "<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message);
        }
    },
    /**
     * HTML-escaped message using JSEXT send to src
     * @param {PID} src Player identifier
     * @param {String} message Message to send to src
     * @param {CID} [channel] Channel identifier
     */
    sendText: function (src, message, channel) {
        util.bot.send(src, message.escapeHtml(), channel);
    },
    /**
     * Sends a message to everyone on the server
     * @param {String} message Message to send
     * @param {CID} [channel] Channel identifier
     */
    sendAll: function (message, channel) {
        var color = Bot.color,
            name = Bot.name;

        channel = util.channel.id(channel);

        if (channel !== -1) {
            sys.sendHtmlAll("<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message, channel);
        }
        else {
            sys.sendHtmlAll("<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message);
        }
    },
    /**
     * HTML-escaped message using JSEXT send to everyone
     * @param {String} message Message to send
     * @param {CID} [channel] Channel identifier
     */
    sendAllText: function (message, channel) {
        util.sendAllText(message.escapeHtml(), channel);
    },
    /**
     * Sends an empty line (whitespace) to everyone
     * @param {CID} [chan] Channel identifier
     */
    line: function (chan) {
        chan = util.channel.id(chan);

        if (chan !== -1) {
            sys.sendAll("", chan);
        } else {
            sys.sendAll("");
        }
    },
    /**
     * Sends an empty line (whitespace) to src
     * @param {PID} src Player identifier
     * @param {CID} [chan=all] Channel identifier
     */
    lineTo: function (src, chan) {
        chan = util.channel.id(chan);

        if (chan !== -1) {
            sys.sendMessage(src, "", chan);
        } else {
            sys.sendMessage(src, "");
        }
    }
};

/**
 * JSON utilities
 * @namespace
 * @type {Object}
 */
util.json = {
    /**
     * Reads a file, parses the content, and returns it
     * @param {String} file Path to the file
     * @return {Object} Parsed JSON code or an empty object
     */
    read: function (file) {
        var code = sys.getFileContent(file);
        if (!code) {
            return {};
        }
        return JSON.parse(code) || {};
    },
    /**
     * Stringifies an object, then writes it to file
     * @param {String} file Path to the file
     * @param {Object} code Object to stringify
     */
    write: function (file, code) {
        sys.writeToFile(file, JSON.stringify(code));
    }
};

/**
 * Grammar utilities. Note: Only apply to lang-en.txt
 * @namespace
 * @type {Object}
 */
util.grammar = {
    /**
     * To correct a/an
     * @param {String} word Word to correct
     * @param {Boolean} [cap=false] If an/a should be An or A
     * @return {String} Corrected word
     */
    an: function (word, cap) {
        var ret;

        if (/[aeiouAEIOU]/.test(word[0])) {
            if (cap) {
                ret = "An";
            } else {
                ret = "an";
            }
        } else {
            if (cap) {
                ret = "A";
            } else {
                ret = "a";
            }
        }

        return ret + " " + word;
    },
    /**
     * To correct -s or -es
     * @param {String} word Word to correct
     * @return {String} Corrected word
     */
    es: function (word) {
        if (/[sS]/.test(word[word.length - 1])) {
            return word + "es";
        }

        return word + "s";
    },
    /**
     * Adds "s" to word if number isn't 1
     * @param {String} word Word to correct
     * @param {Number} number Number to check
     * @return {String} Corrected word
     */
    s: function (word, number) {
        if (number != 1) {
            word += "s";
        }

        return word;
    }
};

/**
 * File utilities
 * @namespace
 * @type {Object}
 */
util.file = {
    /**
     * Creates a file if it already doesn't exist (suppresses any errors)
     * @param {String} file Path to the file
     * @param {String} replacement Data to write to the file if it doesn't exist
     */
    create: function (file, replacement) {
        sys.appendToFile(file, "");
        if (sys.getFileContent(file) === "") {
            sys.writeToFile(file, replacement);
        }
    },
    /**
     * Prepends data to a file
     * @param {String} file Path to the file
     * @param {String} data Data to prepend to the file
     */
    prepend: function (file, data) {
        sys.writeToFile(file, data + sys.getFileContent(file));
    }
};

/**
 * Error utilities
 * @namespace
 * @type {Object}
 */
util.error = {
    /**
     * Formats an error
     * @param {String} mess Message to prepend to the error
     * @param {Error} e Error object
     * @return {String} Error message
     */
    format: function (mess, e) {
        var lastChar, lineData = "", name = e.name, msg = e.message, str;

        if (typeof mess !== "string") {
            mess = "";
        }

        lastChar = mess[mess.length - 1];

        if (mess !== "" && lastChar !== "." && lastChar !== "!" && lastChar !== "?" && lastChar !== ":") {
            mess += ".";
        }

        if (typeof e.toLowerCase !== 'undefined') { /** when throw is used **/
            return mess + " Custom Error: " + e;
        }

        if (e.lineNumber !== 1) {
            lineData = " on line " + e.lineNumber;
        }

        str = name + lineData + ": " + msg,
            lastChar = msg[msg.length - 1];

        if (lastChar !== "." && lastChar !== "?" && lastChar !== ":" && lastChar !== "!") {
            str += ".";
        }

        return mess + " " + str;
    }
};

/**
 * Message Utilities
 * @namespace
 * @type {Object}
 */
util.message = {
    /**
     * If a string has caps in it
     * @param {String} char String to check
     * @return {Boolean}
     */
    caps: function (char) {
        return /[QWERTYUIOPASDFGHJKLZXCVBNM]/.test(char);
    }
};

/**
 * Logging Utilities
 * @namespace
 * @type {Object}
 */
util.watch = {
    /**
     * Logs a player's action to Watch (if it exists)
     * @param {PID} player Player identifier
     * @param {String} [message=""] Message to log
     * @param {String} type Type of event
     * @param {CID} [channel] Channel identifier
     */
    player: function (player, message, type, channel) {
        var chan = util.channel.link(channel),
            src = util.player.player(player);

        if (chan !== "") {
            chan = "[" + chan + "]";
        }

        if (message) {
            message = ": " + message.escapeHtml();
        } else {
            message = "";
        }

        if (util.type(watch) === "number") {
            sys.sendHtmlAll("<timestamp/><b>" + chan + "</b> <i>" + type + "</i> by " + src + message, watch);
        }
    },
    /**
     * Logs a channel's action to Watch (if it exists)
     * @param {CID} channel Channel identifier
     * @param {String} message Event to log
     */
    channel: function (channel, message) {
        if (util.type(watch) === "number") {
            sys.sendHtmlAll("<timestamp/><b>" + util.channel.name(channel) + "</b>: " + message, watch);
        }
    }
};

/**
 * Cuts an array from (entry) and joins it
 * @param {Array} array Array to cut
 * @param {Number} entry Index of the value to cut from
 * @param {String} [join=":"] String to use to join the array
 * @return {String} Joined array starting from (entry)
 */
util.cut = function (array, entry, join) {
    if (!join) {
        join = ":";
    }

    if (!Array.isArray(array)) {
        return array;
    }

    return [].concat(array).splice(entry).join(join);
};

/**
 * Returns the proper type of a variable
 * @param {*} variable Variable to check
 * @return {String} The variable's type
 */
util.type = function (variable) {
    if (Array.isArray(variable)) {
        return "array";
    }

    if (variable === null) {
        return "null";
    }

    return typeof variable;
};

/**
 * An empty function
 * @example (util.mod.kick || util.noop)(id);
 */
util.noop = function () {

};

/**
 * Object for timers
 * @type {Object}
 */
util.timers = {"sys": []};

/**
 * Sandbox
 * @type {Object}
 */
util.sandbox = {};

/* Quick access to util.bot */
bot = util.bot;

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} Utilities
     */
    Name: function () {
        return "Utilities";
    }
})