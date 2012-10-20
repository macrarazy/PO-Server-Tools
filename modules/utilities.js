/**
 * @fileOverview Utilities file
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

/*
 Custom types used in JSDoc
 - POPlayer: Id or name of a player
 - POChannel: Id or name of a channel
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
     * @param {Number} src Id of the player to check
     * @param {String} tarName Name of another person to check
     * @return {Boolean} If the ip of src is the same of tarName
     * @example util.player.self(src, sys.name(src)); // true
     */
    self: function (src, tarName) {
        return sys.ip(src) === sys.dbIp(tarName);
    },
    /**
     * Returns the players "true" auth (Config.PlayerPermissions and maxAuth on ip calculated)
     * @param {POPlayer} src Player identifier
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
     * @param {POPlayer} src Player identifier
     * @param {Number} minAuth Minimum auth required to perform the action
     * @return {Boolean} If the player has permission to do the action
     */
    hasPermission: function (src, minAuth) {
        return util.player.auth(src) >= minAuth;
    },
    /**
     * Formatted player name
     * @param {POPlayer} user Player identifier
     * @return {String} Formatted name
     */
    player: function (user) {
        return "<b><font color='" + util.player.color(user) + "'>" + util.player.name(user).escapeHtml() + "</font></b>";
    },
    /**
     * Properly capitalizes a name or makes a name out of an Id
     * @param {POPlayer} user Player identifier
     * @return {String} Name of the player, or an empty string
     */
    name: function (user) {
        if (typeof user === "string") {
            return sys.name(sys.id(user));
        } else if (user != undefined) {
            return sys.name(user);
        }

        return "";
    },
    /**
     * Gets the id of a player. Throws the id back if the given number (id) is online, or -1 neither worked
     * @param {POPlayer} user Player identifier
     * @return {Number} Id of the player or -1 if not online or no number given
     */
    id: function (user) {
        if (typeof user === "string") {
            return sys.id(user);
        } else if (sys.loggedIn(user)) {
            return user;
        }

        return -1;
    },
    /**
     * Returns the color of a player
     * @param {POPlayer} user Player Identifier
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
     * @param {POChannel} name Channel identifier
     * @return {Number} The channel's id, or -1
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
     * @param {POPlayer} name Player identifier to ban
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
     * @param {POPlayer} src Player identifier to disconnect
     */
    disconnect: function (src) {
        sys.callQuickly("sys.disconnect(" + util.player.id(src) + ")", 20);
    },
    /**
     * Disconnects a player and their online alts in 20 milliseconds
     * @param {Number|String} src Id or name of the player to disconnect
     */
    disconnectAll: function (src) {
        var x, id, ip = sys.ip(util.player.id(src)),
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
     * @param {POPlayer} src Player identifier to kick
     */
    kick: function (src) {
        sys.callQuickly("sys.kick(" + util.player.id(src) + ");", 20);
    },
    /**
     * Kicks a player and their online alts in 20 milliseconds
     * @param {POPlayer} src Player identifier to kick
     */
    kickAll: function (src) {
        var x, id, ip = sys.ip(util.player.id(src)),
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
            alias, id;

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
     * @param {POPlayer} src Player identifier
     * @param {String} message Message to send to src
     * @param {POChannel} [channel=all] Channel identifier
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
     * @param {POPlayer} src Player identifier
     * @param {String} message Message to send to src
     * @param {POChannel} [channel=all] Channel identifier
     */
    sendText: function (src, message, channel) {
        util.bot.send(src, message.escapeHtml(), channel);
    },
    /**
     * Sends a message to everyone on the server
     * @param {String} message Message to send
     * @param {POChannel} [channel=all] Channel identifier
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
     * @param {POChannel} [channel=all] Channel identifier
     */
    sendAllText: function (message, channel) {
        util.sendAllText(message.escapeHtml(), channel);
    },
    /**
     * Sends an empty line (whitespace) to everyone
     * @param {POChannel} [chan=all] Channel identifier
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
     * @param {POPlayer} src Player identifier
     * @param {POChannel} [chan=all] Channel identifier
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
 * Object for timers
 * @type {Object}
 */
util.timers = {"sys": []};

/**
 * Sandbox
 * @type {Object}
 */
util.sandbox = {};

({
    /**
     * Returns the function of this module
     * @private
     * @return {String} Utilities
     */
    Name: function () {
        return "Utilities";
    }
})