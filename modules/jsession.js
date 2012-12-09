/**
 * @fileOverview SESSION for JavaScript.
 * @author TheUnknownOne
 * @version 3.0.0 Alpha 1
 */

if (!GLOBAL["JSESSION"]) {
    /**
     * JSESSION
     * @class
     * @type {Function}
     */
    JSESSION = new (function () {
        /**
         * Contains data for users
         * @type {Object}
         */
        this.UserData = {};

        /**
         * Contains data for channels
         * @type {Object}
         */
        this.ChannelData = {};

        /**
         * Contains global data
         * @type {Object}
         */
        this.GlobalData = {};

        /**
         * User init function
         * @constructor
         * @type {Function}
         */
        this.UserFunc = function () {
        };

        /**
         * Channel init function
         * @constructor
         * @type {Function}
         */
        this.ChannelFunc = function () {
        };

        /**
         * Global init function
         * @constructor
         * @type {Function}
         */
        this.GlobalFunc = function () {
        };

        /**
         * If JSESSION uses user data
         * @type {Boolean}
         */
        this.UsesUser = false;

        /**
         * If JSESSION uses channel data
         * @type {Boolean}
         */
        this.UsesChannel = false;

        /**
         * If JSESSION uses global data
         * @type {Boolean}
         */
        this.UsesGlobal = false;

        /**
         * ScriptID assigned to JSESSION
         * @type {Undefined}
         */
        this.ScriptID = undefined;

        /**
         * Creates missing user and channel data
         * @type {Function}
         */
        this.refill = function () {
            var x, users = sys.playerIds(),
                channels = sys.channelIds();

            if (this.UsesUser) {
                for (x in users) {
                    if (!this.users(users[x])) {
                        this.createUser(users[x]);
                    }
                }
            }

            if (this.UsesChannel) {
                for (x in channels) {
                    if (!this.channels(channels[x])) {
                        this.createChannel(channels[x]);
                    }
                }
            }

            if (this.UsesGlobal) {
                if (!this.global()) {
                    this.GlobalData = new this.GlobalFunc();
                }
            }
        };

        /**
         * Returns a user object
         * @param {PID} id Player identifier
         * @return {Undefined|Object} Undefined if no user function is registered or if the player doesn't exist, or their player object
         */
        this.users = function (id) {
            id = Umbrella.get("util.player").id(id);

            if (!this.UsesUser || !this.UserData.has(id)) {
                return undefined;
            }

            return this.UserData[id];
        };

        /**
         * Returns a channel object
         * @param {CID} id Channel identifier
         * @return {Undefined|Object} Undefined if no channel function is registered or if the channel doesn't exist, or its channel object
         */
        this.channels = function (id) {
            id = Umbrella.get("util.channel").id(id);

            if (!this.UsesChannel || !this.ChannelData.has(id)) {
                return undefined;
            }

            return this.ChannelData[id];
        };

        /**
         * Returns the global JSESSION object if a global function is registered
         * @return {Undefined|Object} Undefined if no global function is registered, or the global JSESSION object
         */
        this.global = function () {
            if (!this.UsesGlobal || !this.GlobalData) {
                return undefined;
            }

            return this.GlobalData;
        };

        /**
         * Sets the ScriptID, clearing all data if it isn't the same as the registered ScriptID, and refills
         * @param {String} script String to identify the script as
         */
        this.identifyScriptAs = function (script) {
            if (this.ScriptID !== script) {
                this.clearAll();
            }

            this.ScriptID = script;
            this.refill();
        };

        /**
         * Registers a user function
         * @param {Function} func User function to register
         */
        this.registerUser = function (func) {
            if (util.type(func) !== "function") {
                return;
            }

            this.UserFunc = func;
            this.UsesUser = true;
        };

        /**
         * Registers a channel function
         * @param {Function} func Channel function to register
         */
        this.registerChannel = function (func) {
            if (util.type(func) !== "function") {
                return;
            }

            this.ChannelFunc = func;
            this.UsesChannel = true;
        };

        /**
         * Registers a global function
         * @param {Function} func Global function to register
         */
        this.registerGlobal = function (func) {
            if (util.type(func) !== "function") {
                return;
            }

            this.GlobalFunc = func;
            this.UsesGlobal = true;
            this.GlobalData = new func();
        };

        /**
         * Creates a user object
         * @param {PID} id Player identifier
         * @return {Boolean}
         */
        this.createUser = function (id) {
            id = Umbrella.get("util.player").id(id);

            if (!this.UsesUser || this.UserData.has(id) || !sys.loggedIn(id)) {
                return false;
            }

            this.UserData[id] = new this.UserFunc(id);
            return true;
        };

        /**
         * Removes a user object
         * @param {PID} id Player identifier
         * @return {Boolean}
         */
        this.removeUser = function (id) {
            id = Umbrella.get("util.player").id(id);

            if (!this.UsesUser || !this.UserData.has(id) || !sys.loggedIn(id)) {
                return false;
            }

            delete this.UserData[id];
            return true;
        };

        /**
         * Creates a channel object
         * @param {CID} id Channel identifier
         * @return {Boolean}
         */
        this.createChannel = function (id) {
            id = Umbrella.get("util.channel").id(id);

            if (!this.UsesChannel || !this.ChannelData.has(id) || !sys.channel(id)) {
                return false;
            }

            this.ChannelData[id] = new this.ChannelFunc(id);
            return true;
        };

        /**
         * Removes a channel object
         * @param {CID} id Channel identifier
         * @return {Boolean}
         */
        this.removeChannel = function (id) {
            id = Umbrella.get("util.channel").id(id);

            if (!this.UsesChannel || id === 0 || !this.ChannelData.has(id)) {
                return false;
            }

            delete this.ChannelData[id];
            return true;
        };

        /**
         * If there is user data for (src)
         * @param {PID} src Player identifier
         * @return {Boolean}
         */
        this.hasUser = function (src) {
            return this.UserData.has(Umbrella.get("util.player").id(src));
        };

        /**
         * If there is channel data for (channel)
         * @param {CID} channel Channel identifier
         * @return {Boolean}
         */
        this.hasChannel = function (channel) {
            return this.ChannelData.has(Umbrella.get("util.channel").id(channel));
        };

        /**
         * Resets all JSESSION data
         * @type {Function}
         */
        this.clearAll = function () {
            this.UserData = {};
            this.ChannelData = {};
            this.GlobalData = {};

            this.UserFunc = function () {
            };
            this.ChannelFunc = function () {
            };
            this.GlobalFunc = function () {
            };

            this.UsesUser = false;
            this.UsesChannel = false;
            this.UsesGlobal = false;

            this.ScriptID = undefined;
        }
    })();
}

/**
 * Function used as user data initializer
 * @param {Number} id The player's Id
 * @constructor
 */
POUser = function (id) {
    var name,
        nameToLower;

    Umbrella.get("util.player", "player");
    
    id = player.id(id),
        name = player.name(id),
        nameToLower = name.toLowerCase();

    this.ip = player.ip(id);
    this.name = name;

    this.id = id;
    this.lastChallenge = 0;
    this.floodCount = 0;
    this.caps = 0;
    this.lastFuture = 0;
    this.teamChanges = 0;

    this.macro = ["%m1", "%m2", "%m3", "%m4", "%m5"];

    this.impersonation = undefined;

    this.isAutoAFK = false;
    this.muted = DataHash.mutes.has(this.ip);
    this.megauser = DataHash.megausers.has(nameToLower); // TODO: DataHash.megausers, .voices, .macros
    this.voice = DataHash.voices.has(nameToLower);

    if (DataHash.rankicons.has(nameToLower)) {
        this.icon = DataHash.rankicons[mn_lc]
    }

    if (DataHash.macros.has(nameToLower)) {
        this.macro = DataHash.macros[nameToLower];
    }

    /*
     Unused: this.lastMsg = 0;
     Unused: this.loginTime = date;
     */
    
    Umbrella.unload();
};

/**
 * Adds +1 flood count to this player if they are not auth
 */
POUser.prototype.addFlood = function () {
    if (Umbrella.get("util.player").auth(this.id) < 0) {
        this.floodCount++;
        sys.callLater('JSESSION.users(' + this.id + ').floodCount--', 6);
    }
};

/**
 * Attempts to mute a player for caps, if (message) has too many caps in it
 * @param {String} message Message to check
 * @param {CID} channel Channel identifier to send the caps mute message in
 * @return {Boolean} If the player was CAPS muted
 */
POUser.prototype.capsMute = function (message, channel) {
    var newCapsAmount = 0,
        x, 
        time = +(sys.time()) + (60 * 5);

    channel = Umbrella.get("util.channel").id(channel);

    // TODO: AutoMute command
    if (Settings.has("AutoMute") && !Settings.AutoMute) {
        return false;
    }

    Umbrella.load(["util.message", "util.watch", "util.bot"], ["utilMessage", "watch", "bot"]);
    
    for (x in message) {
        if (utilMessage.caps(message[x])) {
            newCapsAmount += 1;
        }
        else {
            newCapsAmount -= 1;
        }
        if (newCapsAmount < 0) {
            newCapsAmount = 0;
        }
    }

    this.caps = newCapsAmount;

    if (this.caps >= 70) {
        watch.player(this.id, message, "CAPS Mute Message", channel);
        bot.sendAll(util.player.player(this.id) + " was muted for 5 minutes by " + Bot.bot + ".", channel);
        bot.sendAll("Reason: Spamming caps.", channel);

        DataHash.mutes[this.ip] = {
            by: Bot.bot,
            why: "Spamming caps.",
            ip: this.ip,
            time: time
        };

        Umbrella.get("util.datahash").write("mutes");

        this.caps = 0;
        this.muted = true;
        return true;
    }
    
    Umbrella.unload();

    return false;
};

/**
 * Function used as channel data initializer
 * @param {Number} id The channel's Id
 * @constructor
 */
POChannel = function (id) {
    var x;
    
    this.name = sys.channel(id);
    this.id = id;

    this.creator = '';
    this.topic = 'Welcome to ' + this.name + '!';
    this.topicsetter = '';

    this.perm = false;

    if (typeof Channels !== "undefined" && util.type(Channels) === "object") {
        for (x in Channels) {
            if (Channels[x] === id) {
                this.perm = true;
                break;
            }
        }
    }

    // TODO: Add tours
    if (Tours && !Tours.channels.has(id)) {
        Tours.add(id);
    }

    this.private = false;
    this.defaultTopic = true;
    this.silence = 0;

    this.banlist = {};
    this.mutelist = {};
    this.chanAuth = {};
    this.tourAuth = {};
};

/**
 * Managesa player's channel tour auth
 * @param {PID} name Player identifier
 * @param {Boolean} [add=false] If tourAuth will be given, or taken
 */
POChannel.prototype.manageTourAuth = function (name, add) {
    var toLower = Umbrella.get("util.player").name(name).toLowerCase();

    if (add) {
        if (this.tourAuth.has(toLower)) {
            return;
        }

        this.tourAuth[toLower] = {
            'name': name.name()
        };
    } else {
        if (!this.tourAuth.has(toLower)) {
            return;
        }

        delete this.tourAuth[toLower];
    }

    if (cData) {
        cData.set(this.id, "tourAuth", this.tourAuth);
    }
};

// TODO: Add this as command instead

/*
 POChannel.prototype.changeTopic = function (src, topic, fullCommand) {
 if (topic.isEmpty()) {
 if (this.topic == '') {
 botMessage(src, "There is no topic.", this.id);
 return;
 }

 botEscapeMessage(src, "Topic: " + this.topic, this.id);

 if (this.topicsetter != '') {
 botEscapeMessage(src, "Set by: " + this.topicsetter, this.id)
 }

 if (this.defaultTopic) {
 botMessage(src, "This is a default topic.", this.id);
 }

 return;
 }

 if (!this.isChanMod(src)) {
 noPermissionMessage(src, fullCommand, this.id);
 return;
 }

 var me = sys.name(src),
 mePlayer = player(me);

 if (topic.toLowerCase() == "default") {
 this.topic = "Welcome to " + this.name + "!";
 this.defaultTopic = true;
 this.topicsetter = '';
 } else {
 this.topic = topic;
 this.topicsetter = me;
 this.defaultTopic = false;
 }

 botAll("The topic was changed by " + mePlayer + " to: " + this.topic, this.id);
 return;
 };
 */

/**
 * Changes a player's channel auth.
 * @param {PID} name Player identifier
 * @param {Number} auth The auth level to give
 */
POChannel.prototype.changeAuth = function (name, auth) {
    name = Umbrella.get("util.player").name(name);

    if (auth.isNegative() && this.chanAuth.has(name.toLowerCase())) {
        delete this.chanAuth[name];
    } else {
        this.chanAuth[name] = auth;
    }

    if (cData) {
        cData.set(this.id, "chanAuth", this.chanAuth);
    }
};

/**
 * If a player can issue a channel mute or ban to someone else
 * @param {PID} src Player identifier of the issuer
 * @param {PID} tar Player identifier of the target
 * @return {Boolean} If (src) can channel ban/mute (tar)
 */
POChannel.prototype.canIssue = function (src, tar) {
    var self, 
        target,
        player = Umbrella.get("util.player");

    src = player.id(src);
    tar = player.id(tar);

    if (player.ip(src) === undefined || player.ip(tar) === undefined) {
        return false;
    }

    self = player.name(src),
        target = player.name(tar);

    if (player.auth(tar) >= player.auth(src) || this.chanAuth[target] >= this.chanAuth[self] && !this.isChanOwner(src)) {
        return false;
    }

    return true;
};

/**
 * If an ip is banned in this channel
 * @param {String} ip Ip to check
 * @return {Boolean}
 */
POChannel.prototype.isBanned = function (ip) {
    return this.banlist.has(ip);
};

/**
 * If an ip is muted in this channel
 * @param {String} ip Ip to check
 * @return {Boolean}
 */
POChannel.prototype.isMuted = function (ip) {
    return this.mutelist.has(ip);
};

/**
 * If a player is a channel moderator
 * @param {PID} src Player identifier
 * @return {Boolean}
 */
POChannel.prototype.isChanMod = function (src) {
    var player = Umbrella.get("util.player");
    
    return this.chanAuth[player.name(src)] >= 1 || player.auth(src) >= 1;
};

/**
 * If a player is a channel administrator
 * @param {PID} src Player identifier
 * @return {Boolean}
 */
POChannel.prototype.isChanAdmin = function (src) {
    var player = Umbrella.get("util.player");

    return this.chanAuth[player.name(src)] >= 2 || player.auth(src) >= 2;
};

/**
 * If a player is a channel owner
 * @param {PID} src Player identifier
 * @return {Boolean}
 */
POChannel.prototype.isChanOwner = function (src) {
    var player = Umbrella.get("util.player");

    return this.chanAuth[player.name(src)] >= 3 || player.auth(src) >= 3;
};

/**
 * Function used as global data initializer
 * @constructor
 */
POGlobal = function () {
    this.mafiaVersion = "";
};

JSESSION.identifyScriptAs("TheUnknownOne's Server Script (version " + SCRIPT_VERSION + ")");
JSESSION.registerUser(POUser);
JSESSION.registerChannel(POChannel);
JSESSION.registerGlobal(POGlobal);
JSESSION.refill();

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} JavaScript SESSION
     */
    Name: function () {
        return "JavaScript SESSION";
    },
    /**
     * Returns the hooks of this module
     * @private
     * @return {Object}
     */
    Hooks: function () {
        return {
            "afterChannelCreated": function (chan, name, src) {
                JSESSION.createChannel(chan);
            },
            "afterChannelDestroyed": function (chan) {
                JSESSION.removeChannel(chan);
            },
            "beforeLogIn": function (src) {
                JSESSION.createUser(src);
            },
            "beforeLogOut": function (src) {
                JSESSION.removeUser(src);
            },
            "commandInfoRequested": function (src, message, chan, commandInfo) {
                var selfName = sys.name(src),
                    tar = commandInfo.target,
                    tarName = sys.name(tar),
                    chan = commandInfo.chan,
                    chanName = sys.channel(chan).
                    player = Umbrella.get("util.player");

                return {
                    self: {
                        name: selfName,
                        nameLower: selfName.toLowerCase(),
                        player: player.player(src),
                        auth: player.auth(src),
                        ip: sys.ip(src),
                        isHost: player.host(src),
                        jsession: JSESSION.users(src)
                    },
                    target: {
                        name: tarName,
                        nameLower: tarName.toLowerCase(),
                        player: player.player(tar),
                        auth: player.auth(tar),
                        ip: sys.ip(tar),
                        isHost: player.host(tar),
                        jsession: JSESSION.users(tar)
                    },
                    chan: {
                        name: chanName,
                        nameLower: chanName.toLowerCase(),
                        players: sys.playersOfChannel(chan),
                        jsession: JSESSION.channels(chan)
                    }
                };
            }
        };
    }
})
