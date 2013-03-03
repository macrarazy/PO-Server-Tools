/* Utilities used in almost every .js file */

if (typeof Bot === "undefined") {
    /* Default Bot Configuration */
    Bot = {
        "name": "~Server~",
        "color": "red"
    };
}

/* Script Utilities */
util = {};

/* Player Utilities*/
util.player = {
    /* Checks if a player's ip is the same as the given target's. */
    self: function (src, tar) {
        return this.ip(src) === this.ip(tar);
    },
    /* Gives the player auth 3 if they are the host, their auth is 0, and they are registered. */
    hostAuth: function (src) {
        var auth = this.auth(src);

        if (auth > 0 && auth < 3 || auth > 3) {
            return this;
        }

        if (!this.host(src)) {
            return this;
        }

        if (!sys.dbRegistered(this.name(src))) {
            return this;
        }

        sys.changeAuth(src, 3);

        return this;
    },
    /* Checks if [src] is the server host. */
    host: function (src) {
        return this.ip(src) === "127.0.0.1";
    },
    /* Returns the player's "true" auth (Config.PlayerPermissions and sys.maxAuth checked). */
    auth: function (src) {
        var perms = Config.PlayerPermissions,
            name,
            auth,
            maxAuth;

        src = this.id(src);
        name = sys.name(src);
        auth = sys.auth(src);
        maxAuth = sys.maxAuth(this.ip(src));

        if (!sys.loggedIn(src)) {
            name = src;
            auth = sys.dbAuth(src);
            maxAuth = sys.maxAuth(auth);
        }

        perms = perms[name] || 0;

        if (perms > maxAuth) {
            maxAuth = perms;
        }

        return maxAuth;
    },
    /* Checks if a player has permission to perform a specific action. */
    hasPermission: function (src, minAuth) {
        return this.auth(src) >= minAuth;
    },
    /* Returns [user]'s "formatted" name (using html). */
    player: function (user) {
        return "<b><font color='" + this.color(user) + "'>" + this.name(user).escapeHtml() + "</font></b>";
    },
    /* Capitalizes a name or turns a playerid into a name. */
    name: function (user) {
        user = user || "";

        if (Truthy.isString(user)) {
            return user.name();
        } else if (Truthy.isNumber(user)) {
            return sys.name(user);
        }

        if (!Truthy.isUndefined(sys.id(user))) {
            user = sys.name(sys.id(user));
        }

        return user;
    },
    /* Gets the id of a player. Throws the id back if the given number (id) is online, or -1 neither worked. */
    id: function (user) {
        if (Truthy.isString(user)) {
            return sys.id(user) || -1;
        } else if (sys.loggedIn(user)) {
            return user;
        }

        return -1;
    },
    /* Returns the color of a player. */
    color: function (user) {
        var src = this.id(user),
            color = sys.getColor(src),
            colors = [
                '#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f',
                '#1b1390', '#028678', '#0324b1'
            ];

        if (color === '#000000') {
            return colors[src % colors.length];
        }
        return color;
    },
    /* Returns the IP of a player. */
    ip: function (player) {
        return sys.proxyIp(this.id(player)) || sys.dbIp(this.name(player));
    },
    /* Returns the player's playerlist authority icon. */
    authImage: function (name) {
        var auth = this.auth(name),
            authString = "U",
            status = "Available",
            id = this.id(name);

        if (Truthy.isUndefined(this.ip(name))) {
            return "<img src='Themes/Classic/Client/" + authString + "Away.png'>";
        }

        if (auth === 1) {
            authString = "M";
        } else if (auth === 2) {
            authString = "A";
        } else if (auth === 3) {
            authString = "O";
        }

        if (sys.battling(id)) {
            status = "Battle";
        } else if (sys.away(id)) {
            status = "Away";
        }

        return '<img src="Themes/Classic/Client/' + authString + status + '.png">';
    },
    /* Returns the date the player was last on as an HTML-formatted string. */
    lastOnline: function (name) {
        var lastOnline = sys.dbLastOn(this.name(name));

        if (!lastOnline) {
            lastOnline = "Unknown";
        }

        return "<b><font color='blue' size='2'>Last Online:</font></b> <i>" + lastOnline + "</i>";
    },
    /* Returns a player's info as an HTML-formatted string. */
    playerInfo: function (name) {
        var id = this.id(name),
            icon = this.authImage(name),
            player = this.player(name),
            lastOn = this.lastOnline(name);

        if (Truthy.isUndefined(id) || Truthy.isUndefined(this.ip(name))) {
            return icon + " " + player + " <small style='color: red;'>Offline</small> " + lastOn;
        }

        return icon + " " + player + " <small style='color: green;'>Online</small> <small>(<b style='color: blue;'>ID: " + id + "</b>)</small>";
    },
    /* Tests a player's name to see if it isn't bad. Bad names are bad, you see. */
    testName: function (src, nomessage) {
        var name = sys.name(src),
            ip = this.ip(src),
            auth = this.auth(src),
            cyrillic = /\u0408|\u03a1|\u0430|\u0410|\u0412|\u0435|\u0415|\u041c|\u041d|\u043e|\u041e|\u0440|\u0420|\u0441|\u0421|\u0422|\u0443|\u0445|\u0425|\u0456|\u0406/,
            space = /\u0009-\u000D|\u0085|\u00A0|\u1680|\u180E|\u2000-\u200A|\u2028|\u2029|\u2029|\u202F|\u205F|\u3000/,
            dash = /\u058A|\u05BE|\u1400|\u1806|\u2010-\u2015|\u2053|\u207B|\u208B|\u2212|\u2E17|\u2E1A|\u301C|\u3030|\u30A0|\uFE31-\uFE32|\uFE58|\uFE63|\uFF0D/,
            greek = /\u03F3|\u0391|\u0392|\u0395|\u0396|\u0397|\u0399|\u039A|\u039C|\u039D|\u039F|\u03A1|\u03A4|\u03A5|\u03A7/,
            armenian = /\u0555|\u0585/,
            creek = /[\u0370-\u03ff]/,
            special = /[\ufff0-\uffff]/,
            other = /\u3061|\u65532/,
            zalgo = /[\u0300-\u036F]/,
            thai = /[\u0E00-\u0E7F]/,
            fakeI = /\xA1/;

        if (call("testName", src)) {
            return true;
        }
        /*
         Prune.bans();
         Prune.rangeBans();

         if (auth <= 0) {
         var rb = dh.rangebans,
         i, i_l = 0,
         xT, c_rb;
         for (i in rb) {
         i_l = i.length;
         for (xT = 0; xT < i_l; xT++) {
         if (i == util.player.ip(src).substring(0, xT)) {
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
         }*/

        if (fakeI.test(name) || creek.test(name) || armenian.test(name) || dash.test(name) || space.test(name) || cyrillic.test(name) || greek.test(name) || special.test(name) || other.test(name) || zalgo.test(name) || thai.test(name)) {
            if (!nomessage) {
                util.message.failWhale(src, 0);
                bot.send(src, "You are using bad characters in your name.");
                bot.sendAll("Kicked player " + name + " (" + ip + ") for using illegal unicode characters.", Channels.watch);
            }
            return true;
        }

        return false;
    }
};

/* Channel Utilities*/
util.channel = {
    /* Returns a channel's id if [name] is a string, otherwise return [name] if it's a number and it exists (as channel). 
       Returns -1 if neither of those conditions are true. */
    id: function (name) {
        if (Truthy.isString(name)) {
            return sys.channelId(name) || 0;
        } else if (sys.existChannel(name)) {
            return name;
        }

        return -1;
    },
    /* Returns a channel's name. */
    name: function (id) {
        return sys.channel(this.id(id)) || "";
    },
    /* Creates a channel. 
       NOTE: Returns [name] back, and not the channel's id, due to a bug in PO. */
    create: function (name) {
        if (!sys.existChannel(name)) {
            sys.setTimer(function () {
                sys.createChannel(name);
            }, 1000, false);
        }

        return name;
    },
    /* Returns a click-able link (parsed in the client) which allows users to easly join [channel). */
    link: function (channel) {
        channel = this.name(channel);

        return "<a href='po:join/" + channel + "'>#" + channel + "</a>";
    },
    /* Puts [src] in one or more channel(s). */
    putIn: function (src, channel) {
        src = util.player.id(src);

        if (Array.isArray(channel)) {
            channel.forEach(function (value, index, array) {
                sys.putInChannel(src, this.id(value));
            }, this);
        } else {
            sys.putInChannel(this.id(channel));
        }

        return this;
    },
    /* Returns all of the server's channels by name.*/
    names: function () {
        return sys.channelIds().map(function (value, index, array) {
            return sys.channel(value);
        });
    }
};

/* Player Moderation Utilities */
util.mod = {
    /* Bans a player, then kicks them. */
    ban: function (name) {
        var id;

        name = util.player.name(name);
        id = util.player.id(name);

        sys.ban(name);

        if (!Truthy.isUndefined(id)) {
            this.kick(id);
        } else {
            this.kickAliases(sys.dbIp(name));
        }

        return this;
    },
    /* Disconnects [src] (meaning they can reconnect) in 20 milliseconds after this function is called. */
    disconnect: function (src) {
        sys.setTimer(function () {
            sys.disconnect(util.player.id(src));
        }, 20, false);

        return this;
    },
    /* Disconnects [src] (meaning they can reconnect) and their online alts in 20 milliseconds after this function is called. */
    disconnectAll: function (src) {
        var ip = util.player.ip(src);

        sys.playerIds().forEach(function (value, index, array) {
            if (ip === util.player.ip(value)) {
                this.disconnect(value);
            }
        });

        return this;
    },
    /* Kicks [src] in 20 milliseconds after this function is called. */
    kick: function (src) {
        sys.setTimer(function () {
            sys.kick(util.player.id(src));
        }, 20, false);

        return this;
    },
    /* Kicks [src] and their online alts in 20 milliseconds after this function is called. */
    kickAll: function (src) {
        var ip = util.player.ip(src);

        sys.playerIds().forEach(function (value, index, array) {
            if (ip === util.player.ip(value)) {
                this.kick(value);
            }
        });

        return this;
    },
    /* Kicks all players on IP [ip] */
    kickAliases: function (ip) {
        sys.aliases(ip).forEach(function (value, index, array) {
            var id = sys.id(value);
            if (!Truthy.isUndefined(id)) {
                this.kick(id);
            }
        });

        return this;
    }
};

/* Bot Utilities */
bot = util.bot = {
    /* Sends a bot message to [src] */
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
    /* Sends an HTML-escaped message to [src] */
    sendText: function (src, message, channel) {
        return this.send(src, message.escapeHtml(), channel);
    },
    /* Sends a message to everyone on the server. */
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
    /* Sends an HTML-escaped message to everyone */
    sendAllText: function (message, channel) {
        return this.sendAll(message.escapeHtml(), channel);
    },
    /* Sends a message to everyone except [src] */
    sendOthers: function (src, message, channel, type) {
        var func,
            ids = sys.playerIds();

        if (type === this.sendOthersModes.normal) { // escapeHtml
            func = this.sendAll;
        } else {
            func = this.sendAllText;
        }

        src = util.player.id(src);

        ids = ids.filter(function (id) {
            return id !== src;
        });

        ids.forEach(function (value, index, array) {
            func(value, message, channel);
        });

        return this;
    },
    /* Sends an empty line (whitespace) to everyone */
    line: function (chan) {
        chan = util.channel.id(chan);

        if (chan !== -1) {
            sys.sendAll("", chan);
        } else {
            sys.sendAll("");
        }

        return this;
    },
    /* Sends an empty line (whitespace) to [src] */
    lineTo: function (src, chan) {
        src = util.player.id(src);
        chan = util.channel.id(chan);

        if (chan !== -1) {
            sys.sendMessage(src, "", chan);
        } else {
            sys.sendMessage(src, "");
        }

        return this;
    },
    /* Modes for sendOthers */
    sendOthersModes: {
        normal: 0,
        escapeHtml: 1
    }
};

/* JSON Utilities */
util.json = {
    /* Reads a file, runs JSON.parse on the content, and returns it. */
    read: function (file, ensureFile) {
        var code;

        if (ensureFile) {
            this.create(file, "{}");
        }

        return JSON.parse(sys.getFileContent(file) || "") || {};
    },
    /* Runs JSON.stringify an object, then writes it to file. */
    write: function (file, code) {
        sys.writeToFile(file, JSON.stringify(code));

        return this;
    }
};

/* File Utilities */
util.file = {
    /* Creates a file if it already doesn't exist (suppresses any errors). */
    create: function (file, replacement) {
        if (!Truthy.isString(file) || file.isEmpty()) {
            return this;
        }

        sys.appendToFile(file, "");
        if (sys.getFileContent(file) === "") {
            sys.writeToFile(file, replacement);
        }

        return this;
    },
    /* Prepends data to a file. */
    prepend: function (file, data) {
        sys.writeToFile(file, data + sys.getFileContent(file));

        return this;
    }
};

/* Error Utilities */
util.error = {
    /* Formats an error. */
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

        name = e.name;
        msg = e.message;
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

        str = name + lineData + ": " + msg;
        lastChar = msg[msg.length - 1];

        if (lastChar !== "." && lastChar !== "?" && lastChar !== ":" && lastChar !== "!") {
            str += ".";
        }

        return mess + " " + str;
    },
    /* Prints an error backtrace on the server window (and returns that same message). */
    trace: function (e, mess, fname) {
        var lastChar,
            lineData = "",
            error,
            file = "";

        if (typeof mess === "string" && arguments.length !== 1) {
            mess = "[" + mess + "]:";
        } else {
            mess = "";
        }

        if (typeof fname === "string") {
            file = "in file \"" + fname + "\"";
        }

        if (typeof e.toLowerCase !== 'undefined') {
            /** when throw is used **/
            error = mess + " Custom Error " + file + ": " + e.toString();
        } else {
            if (e.lineNumber !== 1) {
                lineData = " on line " + e.lineNumber;
            }

            error = mess + " " + e.name + " " + file + lineData + ": " + e.toString();

            lastChar = error[error.length - 1];

            if (lastChar !== "." && lastChar !== "?" && lastChar !== ":" && lastChar !== "!") {
                error += ".";
            }
        }

        print(error); // "[{help}]: {exceptionName} in file "{fileName}" on line {lineName}: {error}"

        return error;
    }
};

/* Message Utilities */
util.message = {
    /* Checks if a string has caps in it. */
    caps: function (chr) {
        return /[QWERTYUIOPASDFGHJKLZXCVBNM]/.test(chr);
    },
    /* Sends a STFU Truck to the given player. */
    stfuTruck: function (src, chan) {
        bot.send(src, '|^^^^^^^^^^^\||____', chan);
        bot.send(src, '| The STFU Truck  |||""\'|""\__,_', chan);
        bot.send(src, '| _____________ l||__|__|__|)', chan);
        bot.send(src, '...|(@)@)"""""""**|(@)(@)**|(@)', chan);

        return this;
    },
    /* Sends a Fail Whale to the given player. */
    failWhale: function (id, chan) {
        bot.send(id, "▄██████████████▄▐█▄▄▄▄█▌", chan);
        bot.send(id, "██████▌▄▌▄▐▐▌███▌▀▀██▀▀", chan);
        bot.send(id, "████▄█▌▄▌▄▐▐▌▀███▄▄█▌", chan);
        bot.send(id, "▄▄▄▄▄██████████████▀", chan);

        return this;
    },
    /* Adds channel links to a message. */
    addChannelLinks: function (str) {
        util.channel.names().forEach(function (value, index, array) {
            str = str.replace(new RegExp("#" + value, "gi"), "<a href='po:join/" + value + "'>" + value + "</a>");
        });

        return str;
    },
    /* Formats a string to have urls and BBCode. */
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

            auth = player.auth(authLvl);
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
                    ret = Truthy.eval(toEval);
                }
                catch (Exception) {
                    return util.error.format(Exception);
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

/* Logging Utilities */
util.watch = {
    /* Logs a player's action to Watch (if it exists). */
    player: function (player, message, type, channel) {
        var chan = util.channel.link(channel),
            src = util.player.player(player);

        if (chan !== "") {
            chan = "<b>[" + chan + "]</b>";
        }

        if (message) {
            message = ": " + message.escapeHtml();
        } else {
            message = "";
        }

        if (Truthy.isObject(Channels) && Truthy.isNumber(Channels.watch)) {
            sys.sendHtmlAll("<timestamp/>" + chan + " " + type + " (" + src + ")" + message, Channels.watch);
        }

        return this;
    },
    /* Logs a channel's action to Watch (if it exists). */
    channel: function (channel, message) {
        if (Truthy.isObject(Channels) && Truthy.isNumber(Channels.watch)) {
            sys.sendHtmlAll("<timestamp/><b>" + util.chan.name(channel) + "</b>: " + message, Channels.watch);
        }

        return this;
    }
};

/* Time Utilities */
util.time = {
    /* Returns the time since epoch in seconds. */
    time: function () {
        return +(sys.time());
    },
    /* Returns the time since epoch in milliseconds. */
    milli: function () {
        return new Date().getTime();
    },
    /* Formats a number (time) to a readable string. */
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
    /* Returns the time since the server started up */
    startUpTime: function () {
        return util.time.format(util.time.startup || 0);
    }
};

/* Cuts an array from (entry), joins it with (separator), and then returns it. */
util.cut = function (array, entry, separator) {
    if (!separator) {
        separator = ":";
    }

    if (!Truthy.isArray(array)) {
        return array;
    }

    return Truthy.cloneArray(array).splice(entry).join(separator);
};

/* Returns the proper type of a variable */
util.type = function (variable) {
    if (Truthy.isArray(variable)) {
        return "array";
    }

    if (Truthy.isNull(variable)) {
        return "null";
    }

    return typeof variable;
};

/* "Sandbox" for timers (sys.setTimer) */
util.timers = {"sys": []};

/* Simple Sandbox */
util.sandbox = {};

/* The server's name */
util.servername = sys.getFileContent("config").split("\n")[30].substring(5).replace(/\\xe9/i, "é").trim();

({
    Name: function () {
        return "Utilities";
    },
    Hooks: function () {
        return {
            "serverStartUp": function () {
                util.time.startup = util.time.time();
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
                    sendText: function (message) {
                        bot.sendText(src, message, chan);
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
            "onCommandError": function (src, fullCommand, chan, errorType, Exception, fileName) {
                if (errorType === "nopermission") {
                    bot.sendText(src, "You don't have the proper permissions to use the command \"" + fullCommand + "\".", chan);
                } else if (errorType === "invalid") {
                    bot.sendText(src, "The command \"" + fullCommand + "\" doesn't exist.", chan);
                } else if (errorType === "muted") {
                    bot.sendText(src, "You can't use the \"" + fullCommand + "\" command because you are muted", chan);
                } else {
                    bot.sendText(src, "An exception occurred when you tried to use the \"" + fullCommand + "\" command.", chan);
                    
                    if (fileName.isEmpty()) {
                        fileName = "Unknown";
                    }
                    
                    util.error.trace(Exception, "CommandException", fileName);
                }
            }
        };
    }
})
