/*
 Dependencies:
 - modules/jsext.js
 + modules/datahash.js
 + modules/channels.js
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
     * Gives the player auth 3 if they are the host, their auth is 0, and they are registered.
     * @param {PID} src Player identifier
     * @return {Object} this
     */
    hostAuth: function (src) {
        var auth = util.player.auth(src);

        if (auth > 0 && auth < 3 || auth > 3) {
            return this;
        }

        if (!util.player.host(src)) {
            return this;
        }

        if (!sys.dbRegistered(util.player.name(src))) {
            return this;
        }

        sys.changeAuth(src, 3);

        return this;
    },
    /**
     * If (src) is the server host
     * @param {PID} src Player identifier
     * @return {Boolean}
     */
    host: function (src) {
        return util.player.ip(src) === "127.0.0.1";
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
            name = src,
                auth = sys.dbAuth(src),
                maxAuth = sys.maxAuth(auth);
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
        if (typeof user === "string" && (DataHash && DataHash.names && DataHash.names.has(user.toLowerCase()))) {
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
        var src = util.player.id(user),
            myColor = sys.getColor(src),
            colorlist = [
                '#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f',
                '#1b1390', '#028678', '#0324b1'
            ];

        if (myColor == '#000000') {
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
    },
    /**
     * Returns the player's pokeball image thingy
     * @param {PID} name Player identifier
     * @return {String} Player status/auth image
     */
    authImage: function (name) {
        var auth = util.player.auth(name),
            authString = "U",
            status = 'Available',
            id = util.player.id(name);

        if (!util.player.ip(name)) {
            return "<img src='Themes/Classic/Client/" + authString + "Away.png'>";
        }

        if (auth === 1) {
            authString = "M";
        } else if (auth === 2) {
            authString = "A";
        } else if (auth === 3) {
            authString = "O";
        }

        if (sys.away(id)) {
            status = 'Away';
        }
        else if (sys.battling(id)) {
            status = 'Battle';
        }

        return '<img src="Themes/Classic/Client/' + authString + status + '.png">';
    },
    /**
     * Returns the date the player was last on as a html-formatted string
     * @param {PID} name Player identifier
     * @return {String} Formatted last online date
     */
    lastOnline: function (name) {
        var lastOnline = sys.dbLastOn(util.player.name(name));

        if (!lastOnline) {
            lastOnline = "Unknown";
        }

        return "<b><font color='blue' size='2'>Last Online:</font></b> <i>" + lastOnline + "</i>";
    },
    /**
     * Returns a player's info as a html-formatted string
     * @param {PID} name Player identifier
     * @return {String} Formatted player info
     */
    playerInfo: function (name) {
        var id = util.player.id(name),
            auth = util.player.auth(name),
            status,
            icon = util.player.authImage(name),
            player = util.player.player(name),
            lastOn = util.player.lastOnline(name);

        if (!util.player.ip(name)) {
            return icon + player + " <small style='color: red;'>Offline</small> " + lastOn;
        }

        if (id == undefined) {
            return icon + " " + player + " <small style='color: red;'>Offline</small> " + lastOn;
        }

        return icon + " " + player + " <small style='color: green;'>Online</small> <small>(<b style='color: blue;'>Player ID: " + id + "</b>)</small>";
    },
    // TODO: Fix this
    /**
     * Tests a player's name to see if it isn't bad
     * @param {Number} src The player's id
     * @param {Boolean} [nomessage=false] If no message will be sent to the player and watch
     * @return {Boolean} If the player's name is bad
     */
    testName: function (src, nomessage) {
        var name = sys.name(src),
            ip = sys.ip(src),
            dh = DataHash,
            auth = sys.maxAuth(ip);

        Prune.bans();
        Prune.rangeBans();

        if (auth <= 0) {
            var rb = dh.rangebans,
                i, i_l = 0,
                xT, c_rb;
            for (i in rb) {
                i_l = i.length;
                for (xT = 0; xT < i_l; xT++) {
                    if (i == sys.ip(src).substring(0, xT)) {
                        if (!nomessage) {
                            c_rb = rb[i];
                            var time;
                            if (c_rb.time != 0) {
                                time = 'Banned for ' + util.time.format(c_rb.time - sys.time() * 1);
                            } else {
                                time = "Banned forever";
                            }

                            var by = c_rb.by,
                                why = c_rb.why,
                                lastChar = why[why.length - 1],
                                lastChars = [".", "?", "!"];

                            if (lastChars.indexOf(lastChar) == -1) {
                                why += ".";
                            }

                            util.message.failWhale(src, 0);
                            bot.send(src, 'Your ip range ' + i + ' is banned by ' + by + '. Reason: ' + why + ' ' + time + '.', 0);
                            bot.sendAll('Player ' + name + ' with range IP ' + i + ' has attempted to enter the server and failed. [Reason: Rangebanned]', watch);
                        }
                        return true;
                    }
                }
            }
        }

        var tb = DataHash.tempbans[ip];
        if (tb != undefined && auth < 1) {
            if (!nomessage) {
                var time;

                if (tb.time != 0) {
                    time = "for " + getTimeString(tb.time - sys.time() * 1);
                } else {
                    time = "forever";
                }

                var reason = tb.why,
                    by = tb.by,
                    lastChar = reason[reason.length - 1],
                    lastChars = [".", "?", "!"];

                if (lastChars.indexOf(lastChar) == -1) {
                    reason += ".";
                }

                util.message.failWhale(src, 0);
                bot.send(src, "You are banned! By " + by + ". Reason " + why + " " + time + "!", 0);
                bot.sendAll("Player " + name + " (" + ip + ") has attempted to enter the server and failed. [Reason: Tempbanned]", watch);
            }
            return true;
        }

        var cyrillic = /\u0408|\u03a1|\u0430|\u0410|\u0412|\u0435|\u0415|\u041c|\u041d|\u043e|\u041e|\u0440|\u0420|\u0441|\u0421|\u0422|\u0443|\u0445|\u0425|\u0456|\u0406/,
            space = /\u0009-\u000D|\u0085|\u00A0|\u1680|\u180E|\u2000-\u200A|\u2028|\u2029|\u2029|\u202F|\u205F|\u3000/,
            dash = /\u058A|\u05BE|\u1400|\u1806|\u2010-\u2015|\u2053|\u207B|\u208B|\u2212|\u2E17|\u2E1A|\u301C|\u3030|\u30A0|\uFE31-\uFE32|\uFE58|\uFE63|\uFF0D/,
            greek = /\u03F3|\u0391|\u0392|\u0395|\u0396|\u0397|\u0399|\u039A|\u039C|\u039D|\u039F|\u03A1|\u03A4|\u03A5|\u03A7/,
            armenian = /\u0555|\u0585/,
            creek = /[\u0370-\u03ff]/,
            special = /[\ufff0-\uffff]/,
            other = /\u3061|\u65532/,
            zalgo = /[\u0300-\u036F]/,
            thai = /[\u0E00-\u0E7F]/,
            fakei = /\xA1/;

        if (fakei.test(name) || creek.test(name) || armenian.test(name) || dash.test(name) || space.test(name) || cyrillic.test(name) || greek.test(name) || special.test(name) || other.test(name) || zalgo.test(name) || thai.test(name)) {
            if (!nomessage) {
                util.message.failWhale(src, 0);
                util.send(src, "You are using bad characters in your name.");
                util.sendAll("Player " + name + " (" + ip + ") has failed to log in. [Reason: Unicode characters]", watch);
            }
            return true;
        }

        if (name[0] == "S" && name[1] == "E" && name[2] == "N" && name[3] == "T" && name[4] == "_") {
            if (!nomessage) {
                util.message.failWhale(src, 0);
            }
            return true;
        }

        return false;
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
            if (id === undefined) {
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
     * @return {String} po:join link for the channel
     */
    link: function (channel) {
        channel = util.channel.name(channel);

        return "<a href='po:join/" + channel + "'>#" + channel + "</a>";
    },
    /**
     * Puts (src) in one or more channel(s)
     * @param {PID} src Player identifier
     * @param {CID|CIDArray} channel Channel identifier or an array of channel identifiers
     * @return {Object} this
     */
    putIn: function (src, channel) {
        src = util.player.id(src);

        if (channel instanceof Array) {
            channel.forEach(function (value, index, array) {
                sys.putInChannel(src, util.channel.id(value));
            });
        } else {
            sys.putInChannel(util.channel.id(channel));
        }

        return this;
    },
    /**
     * Returns all of the server's channels by name.
     * @return {Array} All channel names
     */
    names: function () {
        return sys.channelIds().map(function (value, index, array) {
            return sys.channel(value);
        });
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
     * @return {Object} this
     */
    ban: function (name) {
        var id;

        name = util.player.name(name);
        id = util.player.id(name);

        sys.ban(name);

        if (id !== undefined) {
            util.mod.kick(id);
        } else {
            util.mod.kickAliases(sys.dbIp(name));
        }

        return this;
    },
    /**
     * Disconnects a player in 20 milliseconds
     * @param {PID} src Player identifier to disconnect
     * @return {Object} this
     */
    disconnect: function (src) {
        sys.setTimer(function () {
            sys.disconnect(util.player.id(src));
        }, 20, false);

        return this;
    },
    /**
     * Disconnects a player and their online alts in 20 milliseconds
     * @param {PID} src Player identifier to disconnect
     * @return {Object} this
     */
    disconnectAll: function (src) {
        var ip = util.player.ip(src);

        sys.playerIds().forEach(function (value, index, array) {
            if (ip === sys.ip(value)) {
                util.mod.disconnect(value);
            }
        });

        return this;
    },
    /**
     * Kicks a player in 20 milliseconds
     * @param {PID} src Player identifier to kick
     * @return {Object} this
     */
    kick: function (src) {
        sys.setTimer(function () {
            sys.kick(util.player.id(src));
        }, 20, false);

        return this;
    },
    /**
     * Kicks a player and their online alts in 20 milliseconds
     * @param {PID} src Player identifier to kick
     * @return {Object} this
     */
    kickAll: function (src) {
        var ip = util.player.ip(src);

        sys.playerIds().forEach(function (value, index, array) {
            if (ip === sys.ip(value)) {
                util.mod.kick(value);
            }
        });

        return this;
    },
    /**
     * Kicks an ip's alts (when the target is offline)
     * @param {String} ip IP used to check for alts to kick them
     * @return {Object} this
     */
    kickAliases: function (ip) {
        var aliases = sys.aliases(ip);

        aliases.forEach(function (value, index, array) {
            var id = sys.id(value);
            if (id !== undefined) {
                util.mod.kick(id);
            }
        });

        return this;
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
     * @return {Object} this
     */
    send: function (src, message, channel) {
        var color = Bot.color,
            name = Bot.name;

        src = util.player.id(src);
        channel = util.channel.id(channel);

        if (channel !== -1) {
            sys.sendHtmlMessage(src, "<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message, channel);
        } else {
            sys.sendHtmlMessage(src, "<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message);
        }

        return this;
    },
    /**
     * HTML-escaped message using JSEXT send to src
     * @param {PID} src Player identifier
     * @param {String} message Message to send to src
     * @param {CID} [channel] Channel identifier
     * @return {Object} this
     */
    sendText: function (src, message, channel) {
        util.bot.send(src, message.escapeHtml(), channel);

        return this;
    },
    /**
     * Sends a message to everyone on the server
     * @param {String} message Message to send
     * @param {CID} [channel] Channel identifier
     * @return {Object} this
     */
    sendAll: function (message, channel) {
        var color = Bot.color,
            name = Bot.name;

        channel = util.channel.id(channel);

        if (channel !== -1) {
            sys.sendHtmlAll("<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message, channel);
        } else {
            sys.sendHtmlAll("<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message);
        }

        return this;
    },
    /**
     * HTML-escaped message using JSExt send to everyone
     * @param {String} message Message to send
     * @param {CID} [channel] Channel identifier
     * @return {Object} this
     */
    sendAllText: function (message, channel) {
        util.sendAllText(message.escapeHtml(), channel);

        return this;
    },
    /**
     * Sends a message to everyone except (src)
     * @param {PID} src Player identifier
     * @param {String} message Message to send
     * @param {CID} [channel] Channel identifier
     * @param {Number} [type=0] If the message will me html-escaped. 1 = true, anything else = false
     * @return {Object} this
     */
    sendOthers: function (src, message, channel, type) {
        var func,
            pID,
            pIDs = sys.playerIds(),
            p;

        src = util.player.id(src);

        pIDs = pIDs.filter(function (id) {
            return id !== src;
        });

        if (type === 1) { // escapeHtml
            func = util.bot.sendAllText;
        } else {
            func = util.bot.sendAll;
        }

        for (pID in pIDs) {
            p = pIDs[pID];
            func(p, message, channel);
        }

        return this;
    },
    /**
     * Sends an empty line (whitespace) to everyone
     * @param {CID} [chan] Channel identifier
     * @return {Object} this
     */
    line: function (chan) {
        chan = util.channel.id(chan);

        if (chan !== -1) {
            sys.sendAll("", chan);
        } else {
            sys.sendAll("");
        }

        return this;
    },
    /**
     * Sends an empty line (whitespace) to src
     * @param {PID} src Player identifier
     * @param {CID} [chan=all] Channel identifier
     * @return {Object} this
     */
    lineTo: function (src, chan) {
        src = util.player.id(src);
        chan = util.channel.id(chan);

        if (chan !== -1) {
            sys.sendMessage(src, "", chan);
        } else {
            sys.sendMessage(src, "");
        }

        return this;
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
     * @return {Object} this
     */
    write: function (file, code) {
        sys.writeToFile(file, JSON.stringify(code));

        return this;
    }
};

/**
 * Grammar utilities. Only applies to lang-en.txt
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
        var ret = "a ";

        if (/[aeiouAEIOU]/.test(word[0])) {
            ret = "an ";
        }

        if (cap) {
            ret = ret.cap();
        }

        return ret + word;
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
        if (number !== 1) {
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
     * @return {Object} this
     */
    create: function (file, replacement) {
        sys.appendToFile(file, "");
        if (sys.getFileContent(file) === "") {
            sys.writeToFile(file, replacement);
        }

        return this;
    },
    /**
     * Prepends data to a file
     * @param {String} file Path to the file
     * @param {String} data Data to prepend to the file
     * @return {Object} this
     */
    prepend: function (file, data) {
        sys.writeToFile(file, data + sys.getFileContent(file));

        return this;
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
        var lastChar,
            lineData = "",
            name,
            msg,
            str;

        if (arguments.length === 1) {
            e = mess;
            mess = "";
        }

        if (typeof mess !== "string") {
            mess = "";
        }

        name = e.name,
            msg = e.message,
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
    },
    /**
     * Sends the stfu truck to (src)
     * @param {PID} src Player identifier
     * @param {CID} [chan] Channel identifier
     * @return {Object} this
     */
    stfuTruck: function (src, chan) {
        bot.send(src, '|^^^^^^^^^^^\||____', chan);
        bot.send(src, '| The STFU Truck  |||""\'|""\__,_', chan);
        bot.send(src, '| _____________ l||__|__|__|)', chan);
        bot.send(src, '...|(@)@)"""""""**|(@)(@)**|(@)', chan);

        return this;
    },
    /**
     * Sends the fail whale to (id)
     * @param {PID} id Player identifier
     * @param {CID} [chan] Channel identifier
     * @return {Object} this
     */
    failWhale: function (id, chan) {
        bot.send(id, "▄██████████████▄▐█▄▄▄▄█▌", chan);
        bot.send(id, "██████▌▄▌▄▐▐▌███▌▀▀██▀▀", chan);
        bot.send(id, "████▄█▌▄▌▄▐▐▌▀███▄▄█▌", chan);
        bot.send(id, "▄▄▄▄▄██████████████▀", chan);

        return this;
    },
    /**
     * Adds channel links to a message
     * @param {String} str Input
     * @return {String} Formatted message
     */
    addChannelLinks: function (str) {
        var channelNames = util.channel.names();

        channelNames.forEach(function (value, index, array) {
            str = str.replace(new RegExp("#" + value, "gi"), "<a href='po:join/" + value + "'>" + value + "</a>");
        });

        return str;
    },
    /**
     * Formats a string to have urls and bbcode.
     * @param {String} str Message to format
     * @param {Undefined|Number} authLvl Undefined for user-access, -1 for auth:3 and host (eval) access, or a player's id for their auth level.
     * @return {String} Formatted message
     */
    format: function (str, authLvl) {
        var auth = authLvl,
            isHost = authLvl === -1,
            name,
            urlPattern = /\b(?:https?|ftps?|git):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
            pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
            emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim,
            poPattern = /\bpo:[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        if (authLvl === -1) {
            auth = 3;
        } else {
            auth = 0;
        }

        str = str + "";

        if (typeof authLvl === 'number' && sys.loggedIn(authLvl)) {
            name = sys.name(authLvl).toLowerCase();

            isHost = util.player.host(authLvl);

            if (DataHash && DataHash.evalOperators && DataHash.evalOperators.has(name)) {
                isHost = true;
            }

            auth = util.player.auth(authLvl);
        }

        if (auth > 2 || isHost) { /* Format this first for other bbcodes. */
            str = str.replace(/\[eval\](.*?)\[\/eval\]/gi, function ($1) {
                var toEval,
                    ret;

                // TODO: Add EvalEnabled as command
                if (!Settings.EvalEnabled && !isHost) {
                    return $1;
                }

                toEval = $1.substr(6, $1.lastIndexOf("[") - 6);

                try {
                    ret = sys.eval(toEval);
                }
                catch (e) {
                    return util.error.format("", e);
                }

                if (ret === undefined) {
                    ret = "(Nothing was returned)";
                }

                return ret;
            });
        }

        str = str
            .replace(urlPattern, '<a target="_blank" href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a target="_blank" href="mailto:$1">$1</a>')
            .replace(poPattern, function ($) {
                var type = $.substring($.indexOf(":", $.indexOf("/"))),
                    thing = $.substring($.indexOf("/"));

                type = type[0].toUpperCase() + type.substring(1);

                return "<a href='" + $ + "'>" + type + " " + thing + "</a>";
            });

        // NOTE: Reminder to remove [servername] as bbcode
        str = str
            .replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>')
            .replace(/\[s\](.*?)\[\/s\]/gi, '<s>$1</s>')
            .replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>')
            .replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>')
            .replace(/\[sub\](.*?)\[\/sub\]/gi, '<sub>$1</sub>')
            .replace(/\[sup\](.*?)\[\/sup\]/gi, '<sup>$1</sup>')
            .replace(/\[sub\](.*?)\[\/sub\]/gi, '<sub>$1</sub>')
            .replace(/\[code\](.*?)\[\/code\]/gi, '<code>$1</code>')
            .replace(/\[spoiler\](.*?)\[\/spoiler\]/gi, '<a style="color: black; background-color:black;">$1</a>')
            .replace(/\[time\]/gi, "<timestamp/>")
            .replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<font color=$1>$2</font>')
            .replace(/\[face=(.*?)\](.*?)\[\/face\]/gi, '<font face=$1>$2</font>')
            .replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, '<font face=$1>$2</font>');

        if (auth > 0) {
            str = str
                .replace(/\[size=([0-9]{1,})\](.*?)\[\/size\]/gi, '<font size=$1>$2</font>')
                .replace(/\[pre\](.*?)\[\/pre\]/gi, '<pre>$1</pre>')
                .replace(/\[ping\]/gi, "<ping/>")
                .replace(/\[br\]/gi, "<br/>")
                .replace(/\[hr\]/gi, "<hr/>");
        }

        /* Do this last for other BBcodes to work properly */
        return util.message.addChannelLinks(str);
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
     * @return {Object} this
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
            sys.sendHtmlAll("<timestamp/><b>" + chan + "</b> <i>" + type + "</i> (" + src + ")" + message, watch);
        }

        return this;
    },
    /**
     * Logs a channel's action to Watch (if it exists)
     * @param {CID} channel Channel identifier
     * @param {String} message Event to log
     * @return {Object} this
     */
    channel: function (channel, message) {
        if (util.type(watch) === "number") {
            sys.sendHtmlAll("<timestamp/><b>" + util.channel.name(channel) + "</b>: " + message, watch);
        }

        return this;
    }
};

/**
 * Time Utilities
 * @type {Object}
 */
util.time = {
    /**
     * Returns the time since epoch in seconds
     * @return {Number}
     */
    time: function () {
        return sys.time() * 1;
    },
    /**
     * Formats a number (time) to a readable string
     * @param {Number} time Time to format
     * @return {String}
     */
    format: function (time) {
        var ret = [],
            times = [
                [2629744, "<b>Month</b>"],
                [604800, "<b>Week</b>"],
                [86400, "<b>Day</b>"],
                [3600, "<b>Hour</b>"],
                [60, "<b>Minute</b>"],
                [1, "<b>Second</b>"]
            ],
            timeToFormat = util.time.time() - time;

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
            return "1 <b>Second</b>";
        }

        return ret.fancyJoin() + "</b>";
    },
    /**
     * Returns the time since the server started up
     * @return {String} Result of util.time.format
     */
    startUpTime: function () {
        return util.time.format(util.time.startup);
    }
};

/**
 * Creates an enum
 * @param {util.enum|String|Array} [flags] Enum to copy flags from, a single flag, or an array of flags
 * @constructor
 * @return {Object} this
 */
util.enum = function (flags) {
    /**
     * To count flags
     * @private
     * @type {Number}
     */
    this.cFlagNum = 0;

    /**
     * Contains flags for this enum
     * @type {Object}
     */
    this.flags = {};

    if (!flags) {
        return this;
    }

    if (flags.toString() === "[class Enum]") {
        this.flags = flags.flags;
    } else if (typeof flags === "string") {
        this.addFlag(flags);
    } else if (Array.isArray(flags)) {
        this.addFlags(flags);
    }
};

/**
 * toString implementation of Enum
 * @return {String} [class Enum]
 */

util.enum.prototype.toString = function () {
    return "[class Enum]";
};

/**
 * Adds a flag to this enum
 * @param {String} flag Name of the flag
 * @return {Object} this
 */

util.enum.prototype.addFlag = function (flag) {
    if (this.flags.has(flag)) {
        return this;
    }

    this.flags[flag] = this.cFlagNum;
    this.cFlagNum *= 2;

    return this;
};

/**
 * Adds an array of flags to this enum
 * @param {Array} flags Flags to add
 * @return {Object} this
 */
util.enum.prototype.addFlags = function (flags) {
    flags.forEach(function (value, index, array) {
        this.addFlag(value);
    });

    return this;
};

/**
 * Returns a flag by name
 * @param {String} name The flag's name
 * @return {Number} Number of this flag to use with Mask
 */
util.enum.prototype.flag = function (name) {
    return this.flags[name] || 0;
};

/**
 * Creates a Mask for flags
 * @param {util.mask|Number|Array|util.enum} [flags] Mask to copy flags from, a number, an array of flags, or an enum
 * @constructor
 */
util.mask = function (flags) {
    this.flags = 0;

    if (!flags) {
        return this;
    }

    if (flags.toString() === "[class Mask]") {
        this.flags = flags.flags;
    } else if (typeof flags === "number") {
        this.addFlag(flags);
    } else if (Array.isArray(flags)) {
        this.addFlags(flags);
    } else if (flags.toString() === "[class Enum]") {
        this.addFlags(flags.flags);
    }

    return this;
};

/**
 * toString implementation for Mask
 * @return {String} [class Mask]
 */
util.mask.prototype.toString = function () {
    return "[class Mask]";
};

/**
 * Adds a flag to this mask
 * @param {Number} flag Flag to add
 * @return {Object} this
 */

util.mask.prototype.addFlag = function (flag) {
    this.flags |= flag;

    return this;
};

/**
 * Adds an array or object (must be name=>flag) of flags
 * @param {Array|Object} flags Flags to add
 */

util.mask.prototype.addFlags = function (flags) {
    var x;
    for (x in flags) {
        this.flags |= flags[x];
    }

    return this;
};

/**
 * Removes a flag from this mask
 * @param {Number} flag Flag to remove
 * @return {Object} this
 */

util.mask.prototype.removeFlag = function (flag) {
    this.flags &= ~flag;

    return this;
};

/**
 * Removes an array or object (must be name=>flag) of flags
 * @param {Array|Object} flags Flags to add
 * @return {Object} this
 */
util.mask.prototype.removeFlags = function (flags) {
    var x;
    for (x in flags) {
        this.flags &= ~flags[x];
    }

    return this;
};

/**
 * If this mask has that flag
 * @param {Number} flag Flag to check
 * @return {Boolean} If this mask has that flag
 */
util.mask.prototype.hasFlag = function (flag) {
    return !!this.flags & flag;
};

/**
 * If this mask has those flags
 * @param {util.mask|Object|Number|util.enum} flags Flags to check (Object, Number, or Enum as flags will be passed to new Mask)
 * @return {Boolean} If this mask has those flags
 */
util.mask.prototype.hasFlags = function (flags) {
    var compare_mask;

    if (flags.toString() === "[class Mask]") {
        compare_mask = flags.flags;
    } else {
        compare_mask = new util.mask(flags).flags;
    }

    return !!this.flags & compare_mask;
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
    if (variable instanceof Array) {
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
    },
    /**
     * Returns the hooks of this module
     * @private
     * @return {Object}
     */
    Hooks: function () {
        return {
            "serverStartUp": function () {
                util.time.startup = util.time.time() * 1;
            },
            "commandNameRequested": function (src, message, chan, commandName) {
                if (commandName != "sendmail") { // HARDCODED
                    util.watch.player(src, message, "Command", chan);
                }
            },
            "commandInfoRequested": function (src, message, chan, commandInfo) {
                return {
                    /* Improve tar */
                    tar: util.player.id(commandInfo.mcmd[0]),

                    /* Message utility functions */
                    send: function (message) {
                        bot.send(src, message, chan);

                        return this;
                    },
                    sendAll: function (message) {
                        bot.sendAll(message, chan);

                        return this;
                    },
                    sendOthers: function (message, escapeHtml) {
                        bot.sendOthers(src, message, chan, escapeHtml);

                        return this;
                    },
                    line: function () {
                        bot.line(src, chan);

                        return this;
                    },
                    lineAll: function () {
                        bot.lineAll(chan);

                        return this;
                    },
                    sendMain: function () {
                        bot.sendAll(message, 0);

                        return this;
                    }
                };
            },
            "onCommandError": function (src, fullCommand, chan, errorType, Exception) {
                if (errorType === "nopermission") {
                    bot.sendText(src, "You don't have the proper permissions to use the command \"" + fullCommand + "\".", chan);
                } else if (errorType === "invalid") {
                    bot.sendText(src, "The command \"" + fullCommand + "\" doesn't exist.", chan);
                } else if (errorType === "muted") {
                    bot.sendText(src, "You can't use the \"" + fullCommand + "\" command because you are muted", chan);
                } else {
                    bot.sendText(src, "An exception occurred when you tried to use the \"" + fullCommand + "\" command.", chan);
                    print("CommandError: " + util.error.format(Exception || {
                        name: "UnknownError",
                        message: "An unknown exception has occurred",
                        lineNumber: 1
                    }) + "\".");
                }
            }
        };
    }
})