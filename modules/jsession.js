/*
Dependencies:
    - scripts.js
    - modules/jsext.js
    - modules/utilities.js
    - modules/datahash.js
    - modules/cdata.js
    - modules/channels.js
    - modules/tours.js
 */

/**
 * @fileOverview SESSION for JavaScript.
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

// TODO: Add JSDOC

if (!JSESSION) {
    /**
     * JSESSION
     * @namespace
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

        this.users = function (id) {
            if (!this.UsesUser || !this.UserData.has(id)) {
                return;
            }

            return this.UserData[id];
        };

        this.channels = function (id) {
            if (!this.UsesChannel || !this.ChannelData.has(id)) {
                return;
            }

            return this.ChannelData[id];
        };

        this.global = function () {
            if (!this.UsesGlobal || !this.GlobalData) {
                return;
            }

            return this.GlobalData;
        };

        this.identifyScriptAs = function (script) {
            if (this.ScriptID === undefined || this.ScriptID !== script) {
                this.clearAll();
            }

            this.ScriptID = script;
            this.refill();
        };

        this.registerUser = function (func) {
            if (typeof func !== "function") {
                return;
            }

            this.UserFunc = func;
            this.UsesUser = true;
        };

        this.registerChannel = function (func) {
            if (typeof func !== "function") {
                return;
            }

            this.ChannelFunc = func;
            this.UsesChannel = true;
        };

        this.registerGlobal = function (func) {
            if (typeof func !== "function") {
                return;
            }

            this.GlobalFunc = func;
            this.UsesGlobal = true;
            this.GlobalData = new func();
        };

        this.createChannel = function (id) {
            if (!this.UsesChannel || !this.ChannelData.has(id) || !sys.channel(id)) {
                return false;
            }

            this.ChannelData[id] = new this.ChannelFunc(id);
            return true;
        };

        this.destroyChannel = function (id) {
            if (!this.UsesChannel || id === 0 || !this.ChannelData.has(id)) {
                return false;
            }

            delete this.ChannelData[id];
            return true;
        };

        this.createUser = function (id) {
            if (!this.UsesUser || this.UserData.has(id) || !sys.loggedIn(id)) {
                return false;
            }

            this.UserData[id] = new this.UserFunc(id);
            return true;
        };

        this.destroyUser = function (id) {
            if (!this.UsesUser || !this.UserData.has(id) || !sys.loggedIn(id)) {
                return false;
            }

            delete this.UserData[id];
            return true;
        };

        this.hasUser = function (src) {
            return this.UserData.has(src);
        };

        this.hasChannel = function (channel) {
            return this.ChannelData.has(channel);
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
    var my_name = sys.name(id),
        mn_lc,
        date = sys.time() * 1, dh = DataHash, current;

    if (my_name === undefined) {
        return;
    }

    mn_lc = my_name.toLowerCase();

    this.id = id;
    this.impersonation = undefined;
    this.ip = sys.ip(id);
    this.name = my_name;
    this.lowername = mn_lc;
    this.lastMsg = 0;
    this.loginTime = date;
    this.lastChallenge = 0;
    this.floodCount = 0;
    this.caps = 0;
    this.lastFuture = 0;
    this.isAutoAFK = false;
    this.teamChanges = 0;
    this.macro = ["%m1", "%m2", "%m3", "%m4", "%m5"];

    current = dh.mutes;

    this.muted = current.has(this.ip);

    current = dh.megausers;

    this.megauser = current.has(mn_lc);

    current = dh.rankicons;

    if (current.has(mn_lc)) {
        this.icon = current[mn_lc]
    }

    current = dh.voices;
    this.voice = i.has(mn_lc);

    current = dh.macros;

    if (current.has(mn_lc)) {
        this.macro = current[mn_lc];
    }
};

POUser.prototype.addFlood = function () {
    if (util.player.auth(this.id) < 0) {
        this.floodCount++;
        sys.callLater('JSESSION.users(' + this.id + ').floodCount--', 6);
    }
};

POUser.prototype.capsMute = function (message, channel) {
    var newCapsAmount = 0,
        x, time = sys.time() * 1 + (60 * 5);

    if (!AutoMute) {
        return false;
    }

    for (x in message) {
        if (util.message.caps(message[x])) {
            newCapsAmount += 1;
        }
        else {
            newCapsAmount -= 1;
        }
        if (newCapsAmount < 0) {
            newCapsAmount = 0;
        }
    }

    if (this.caps >= 70) {
        // TODO: Update
        WatchPlayer(this.id, "CAPS Mute Message", message, channel);
        bot.sendAll(util.player.player(this.id) + " was muted for 5 minutes for spamming caps!", channel);

        DataHash.mutes[this.ip] = {
            by: Bot.bot,
            why: "Spamming caps.",
            ip: this.ip,
            time: time
        };

        util.datahash.write("mutes");

        this.caps = 0;
        this.muted = true;
        return true;
    }

    return false;
};

/**
 * Function used as channel data initializer
 * @param {Number} id The channel's Id
 * @constructor
 */
POChannel = function (id) {
    this.name = sys.channel(id);
    this.id = id;

    this.chanAuth = {};
    this.tourAuth = {};
    this.creator = '';
    this.topic = 'Welcome to ' + this.name + '!';
    this.topicsetter = '';
    this.toursEnabled = false;

    this.perm = false;

    // TODO: Add tours
    // TODO: Add DefaultChannels
    if (typeof DefaultChannels != "undefined" && DefaultChannels.indexOf(id) != -1 || typeof DefaultChannels == "undefined") {
        this.perm = true;
        this.tour = new Tours(this.id);
        this.toursEnabled = true;
    }

    this.private = false;
    this.defaultTopic = true;
    this.silence = 0;

    this.banlist = {};
    this.mutelist = {};

};

POChannel.prototype.manageTourAuth = function (name, add) {
    var toLower = util.player.name(name).toLowerCase();

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

    // TODO: add cData or something
    if (typeof cData == 'undefined') {
        return;
    }

    cData.changeTourAuth(this.id, this.tourAuth);
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

POChannel.prototype.changeAuth = function (name, auth) {
    name = util.player.name(name);

    if (auth.isNegative() && this.chanAuth.has(name.toLowerCase())) {
        delete this.chanAuth[name];
        return;
    }

    this.chanAuth[name] = auth;
};

POChannel.prototype.canIssue = function (src, tar) {
    var self, target;

    src = util.player.id(src);
    tar = util.player.id(tar);

    if (util.player.ip(src) === undefined || util.player.ip(tar) === undefined) {
        return false;
    }

    self = util.player.name(src),
        target = util.player.name(tar);

    if (util.player.auth(tar) >= util.player.auth(src) || this.chanAuth[targetName] >= this.chanAuth[self] && !this.isChanOwner(src)) {
        return false;
    }

    return true;
};

POChannel.prototype.isBanned = function (ip) {
    return this.banlist.has(ip);
};

POChannel.prototype.isMuted = function (ip) {
    return this.mutelist.has(ip);
};

POChannel.prototype.isChanMod = function (src) {
    return this.chanAuth[util.player.name(src)] >= 1 || util.player.auth(src) >= 1;
};

POChannel.prototype.isChanAdmin = function (src) {
    return this.chanAuth[util.player.name(src)] >= 2 || util.player.auth(src) >= 2;
};

POChannel.prototype.isChanOwner = function (src) {
    return this.chanAuth[util.player.name(src)] >= 3 || util.player.auth(src) >= 3;
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
    }
})