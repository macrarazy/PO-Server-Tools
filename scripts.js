/*      
    TheUnknownOne's Server Script (https://github.com/TheUnknownOne/PO-Server-Tools) @ v2.7.0-dev
    
    By TheUnknownOne (https://github.com/TheUnknownOne/)
    License: MIT
    
    Special Thanks to Lutra, Intel_iX, Lamperi, coyotte508 & Mystra
    Default styles & rank icons partially by Lutra, Intel_iX & person6445

    Tested on PO v2.3.0
*/

/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/defines.js */
var Script,
    JSESSION,
    Util,
    Bot,
    Tours;

Script = {
    version: "2.7.0-dev",
    url: "https://raw.github.com/TheUnknownOne/PO-Server-Tools/master/scripts.js",
    bot: {
        name: "~Server~",
        color: "blue"
    },
    poScript: (typeof Script !== 'undefined' ? Script.poScript : {})
};

/*
var Config = {
    Mafia: {
        norepeat: 3,
        stats_file: "MafiaStats.txt",
        max_name_length: 16
    },

    DWAbilityCheck: true,
    AutoChannelJoin: true,
    WelcomeMessages: false,
    FixChallenges: false,
    NoCrash: false,
    AdminsCanAuth: true,

    HighPermission: {
        "This gives Administrator Auth to a Moderator.": [1, 2],
        "Don't forget the commas and colons.": [1, 2]
    }
};

var IP_Resolve_URL = "http://ip2country.sourceforge.net/ip2c.php?ip=%1";*/
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/jsession.js */
(function setupJSESSION() {
    if (typeof JSESSION !== 'undefined') {
        return;
    }
    
    function noop(){}

    JSESSION = {
        userData: {},
        channelData: {},
        globalData: {},

        userFactory: noop,
        channelFactory: noop,
        globalFactory: noop,

        usesUser: false,
        usesChannel: false,
        usesGlobal: false,

        scriptId: null,
        factory: {} // Used by User, Channel, and Global constructors.
    };
    
    // Note: Refill is automatically called by identifyAsScript
    JSESSION.refill = function refill() {
        var players,
            player,
            channels,
            channel,
            len,
            i;
        
        if (JSESSION.usesUser) {
            players = sys.playerIds();
            for (i = 0, len = players.length; i < len; i += 1) {
                player = players[i];
                if (!JSESSION.hasUser(player)) {
                    JSESSION.createUser(player);
                }
            }
        }
        if (JSESSION.usesChannel) {
            channels = sys.channelIds();
            for (i = 0, len = channels.length; i < len; i += 1) {
                channel = channels[i];
                if (!JSESSION.hasChannel(channel)) {
                    JSESSION.createChannel(channel);
                }
            }
        }
        if (JSESSION.usesGlobal) {
            if (!JSESSION.hasGlobal()) {
                JSESSION.globalData = new (JSESSION.globalFactory)();
            }
        }
    };
    
    JSESSION.users = JSESSION.user = function user(id) {
        if (!JSESSION.usesUser) {
            return;
        }
        
        return JSESSION.userData[id];
    };
    
    JSESSION.channels = JSESSION.channel = function channel(id) {
        if (!JSESSION.usesChannel) {
            return;
        }
        
        return JSESSION.channelData[id];
    };
    
    JSESSION.global = function global() {
        if (!JSESSION.usesGlobal) {
            return;
        }
        
        return JSESSION.globalData;
    };
    
    JSESSION.identifyScriptAs = function (id) {
        if (JSESSION.scriptId !== id) {
            JSESSION.clearAll();
        }
        
        JSESSION.scriptId = id;
        JSESSION.refill();
    };
    
    // These must all be constructors.
    JSESSION.registerUserFactory = function (Factory) {
        JSESSION.userFactory = Factory;
        JSESSION.usesUser = true;
    };
    
    JSESSION.registerChannelFactory = function (Factory) {
        JSESSION.channelFactory = Factory;
        JSESSION.usesChannel = true;
    };
    
    JSESSION.registerGlobalFactory = function (Factory) {
        JSESSION.globalFactory = Factory;
        JSESSION.usesGlobal = true;
        JSESSION.globalData = new Factory();
    };
    
    JSESSION.createUser = function (id) {
        if (!JSESSION.usesUser || typeof JSESSION.userData[id] !== 'undefined') {
            return false;
        }
        
        JSESSION.userData[id] = new (JSESSION.userFactory)(id);
        return true;
    };
    JSESSION.destroyUser = function (id) {
        if (!JSESSION.usesUser || typeof JSESSION.userData[id] === 'undefined') {
            return false;
        }
        
        delete JSESSION.userData[id];
        return true;
    };
    JSESSION.hasUser = function (id) {
        return JSESSION.userData.hasOwnProperty(id);
    };
    
    JSESSION.createChannel = function (id) {
        if (!JSESSION.usesChannel || typeof JSESSION.channelData[id] !== 'undefined') {
            return false;
        }
        
        JSESSION.channelData[id] = new (JSESSION.channelFactory)(id);
        return true;
    };
    JSESSION.destroyChannel = function (id) {
        if (!JSESSION.usesChannel || typeof JSESSION.channelData[id] === 'undefined') {
            return false;
        }
        
        delete JSESSION.channelData[id];
        return true;
    };
    JSESSION.hasChannel = function (id) {
        return JSESSION.channelData.hasOwnProperty(id);
    };

    JSESSION.hasGlobal = function () {
        return Object.keys(JSESSION.globalData).length === 0;
    };
    
    JSESSION.clearAll = function () {
        JSESSION.userData = {};
        JSESSION.channelData = {};
        JSESSION.globalData = {};
        
        JSESSION.userFactory = noop;
        JSESSION.channelFactory = noop;
        JSESSION.globalFactory = noop;
        
        JSESSION.usesUser = false;
        JSESSION.usesChannel = false;
        JSESSION.usesGlobal = false;
        
        JSESSION.scriptId = null;
    };
}());
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/factory/user.js */
JSESSION.factory.User = function (id) {
    var name = sys.name(id),
        nameLower = name.toLowerCase();

    this.id = id;
    this.impersonation = undefined;
    this.ip = sys.ip(id);
    this.name = name;
    this.lowername = nameLower;
    this.lastMsg = 0;
    this.loginTime = +sys.time();
    this.lastChallenge = 0;
    this.floodCount = 0;
    this.caps = 0;
    this.lastFuture = 0;
    this.teamChanges = 0;
    /*
    if (typeof DataHash === "undefined" || typeof DataHash.voices === "undefined") {
        return;
    }

    var dh = DataHash;

    var d = dh.mutes;
    this.muted = d.has(this.ip);

    this.megauser = dh.megausers.has(mn_lc);

    var i = dh.rankicons;

    if (i.has(mn_lc)) {
        this.icon = i[mn_lc];
    }

    i = dh.voices;
    this.voice = i.has(mn_lc);

    i = dh.macros;
    this.macro = ["%m1", "%m2", "%m3", "%m4", "%m5"];

    if (i.has(mn_lc)) {
        this.macro = i[mn_lc];
    }*/
};

/*
    ! Turn these into utilities
POUser.prototype.addFlood = function () {
    if (typeof hpAuth === 'undefined' || hpAuth(this.id) < 1) {
        this.floodCount++;
        sys.callLater('JSESSION.users(' + this.id + ').floodCount--', 6);
    }
};

POUser.prototype.capsMute = function (message, channel) {
    if (typeof hpAuth !== 'undefined' && hpAuth(this.id) > 0) {
        return false;
    }

    if (typeof AutoMute !== 'undefined' && !AutoMute) {
        return false;
    }

    var newCapsAmount = 0,
        z;
    for (z in message) {
        if (capsMessage(message[z])) {
            newCapsAmount += 1;
        } else {
            newCapsAmount -= 1;
        }
        if (newCapsAmount < 0) {
            newCapsAmount = 0;
        }
    }

    if (this.caps >= 70) {
        WatchPlayer(this.id, "CAPS Mute Message", message, channel);
        botAll(this.name + " was muted for 5 minutes for spamming caps!", channel);

        var bantime = 60 * 5;
        var thetime = +sys.time() + bantime;

        DataHash.mutes[this.ip] = {
            by: Bot.bot + "</i>",
            why: "Spamming caps.",
            "ip": this.ip,
            time: thetime
        };
        cache.write("mutes", JSON.stringify(DataHash.mutes));

        this.caps = 0;
        this.muted = true;
        return true;
    }

    return false;
};*/
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/factory/channel.js */
JSESSION.factory.Channel = function (id) {
    this.name = sys.channel(id);
    this.id = id;

    this.chanAuth = {};
    this.tourAuth = {};
    this.creator = '';
    this.topic = 'Welcome to ' + this.name + '!';
    this.topicsetter = '';
    this.toursEnabled = false;
    
    /* !Overhaul
    if ((typeof DefaultChannels !== "undefined" && DefaultChannels.indexOf(id) !== -1) || typeof DefaultChannels === "undefined") {
        this.perm = true;
        this.tour = new Tours(this.id);
        this.toursEnabled = true;
    } else {
        this.perm = false;
    }*/

    this.private = false; // !rename
    this.defaultTopic = true;
    this.silence = 0;

    this.banlist = {};
    this.mutelist = {};
};

/* !Utility/remove
POChannel.prototype.giveTourAuth = function (name) {
    var toLower = name.toLowerCase();

    if (this.tourAuth.has(toLower)) {
        return;
    }

    this.tourAuth[toLower] = {
        'name': name.name()
    };

    if (typeof cData === 'undefined') {
        return;
    }

    cData.changeTourAuth(this.id, this.tourAuth);
};

POChannel.prototype.takeTourAuth = function (name) {
    var toLower = name.toLowerCase();

    if (!this.tourAuth.has(toLower)) {
        return;
    }

    delete this.tourAuth[toLower];

    if (typeof cData === 'undefined') {
        return;
    }

    cData.changeTourAuth(this.id, this.tourAuth);
};

POChannel.prototype.changeTopic = function (src, topic, fullCommand) {
    if (isEmpty(topic)) {
        if (this.topic === '') {
            botMessage(src, "There is no topic.", this.id);
            return;
        }

        botEscapeMessage(src, "Topic: " + this.topic, this.id);

        if (this.topicsetter !== '') {
            botEscapeMessage(src, "Set by: " + this.topicsetter, this.id);
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

    if (topic.toLowerCase() === "default") {
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

POChannel.prototype.changeAuth = function (name, newauth) {
    var nh;
    if (typeof name === "number") {
        nh = sys.name(name).toLowerCase();
    } else {
        nh = name.toLowerCase();
    }

    if (newauth === 0 && this.chanAuth.has(name)) {
        delete this.chanAuth[nh];
        return;
    }

    this.chanAuth[nh] = newauth;
};

*/

/* !Decide if these should be kept
POChannel.prototype.canIssue = function (src, tar) {
    if (typeof hpAuth === 'undefined') {
        return false;
    }

    var selfName = sys.name(src),
        targetName = sys.name(tar),
        srcID = src;

    if (typeof src === 'string') {
        selfName = src.toLowerCase();
        srcID = sys.id(src);
    } else {
        selfName = selfName.toLowerCase();
    }

    if (typeof tar === 'string') {
        targetName = tar.toLowerCase();
    } else {
        targetName = targetName.toLowerCase();
    }

    if (sys.dbIp(targetName) === undefined || sys.dbIp(selfName) === undefined) {
        return false;
    }

    if (hpAuth(src) <= hpAuth(tar) || srcID === undefined || ((this.chanAuth[selfName] <= this.chanAuth[targetName]) && !this.isChanOwner(src))) {
        return false;
    }

    return true;
};

POChannel.prototype.isBannedInChannel = function (ip) {
    return this.banlist.has(ip);
};

POChannel.prototype.isMutedInChannel = function (ip) {
    return this.mutelist.has(ip);
};

POChannel.prototype.isChanMod = function (src) {
    var toLower = sys.name(src).toLowerCase();

    return this.chanAuth[toLower] >= 1 || hpAuth(src) >= 1;
};

POChannel.prototype.isChanAdmin = function (src) {
    var toLower = sys.name(src).toLowerCase();

    return this.chanAuth[toLower] >= 2 || hpAuth(src) >= 2;
};

POChannel.prototype.isChanOwner = function (src) {
    var toLower = sys.name(src).toLowerCase();

    return this.chanAuth[toLower] >= 3 || hpAuth(src) >= 3;
};*/
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/util/util.js */
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
}());
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/util/player-util.js */
(function () {
    // list of default colors, used when a player doesn't have one (by the client)
    var defaultColorList = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];

    // Various importable stuff.
    var natureNames = {
        24: "Quirky</b> Nature",
        23: "Careful</b> Nature (+SDef, -SAtk)",
        22: "Sassy</b> Nature (+SDef, -Spd)",
        21: "Gentle</b> Nature (+SDef, -Def)",
        20: "Calm</b> Nature (+SDef, -Atk)",
        19: "Rash</b> Nature (+SAtk, -SDef)",
        18: "Bashful</b> Nature",
        17: "Quiet</b> Nature (+SAtk, -Spd)",
        16: "Mild</b> Nature (+SAtk, -Def)",
        15: "Modest</b> Nature (+SAtk, -Atk)",
        14: "Naive</b> Nature (+Spd, -SDef)",
        13: "Jolly</b> Nature (+Spd, -SAtk)",
        12: "Serious</b> Nature",
        11: "Hasty</b> Nature (+Spd, -Def)",
        10: "Timid</b> Nature (+Spd, -Atk)",
        9: "Lax</b> Nature (+Def, -SDef)",
        8: "Impish</b> Nature (+Def, -SAtk)",
        7: "Relaxed</b> Nature (+Def, -Spd)",
        6: "Docile</b> Nature",
        5: "Bold</b> Nature (+Def, -Atk)",
        4: "Naughty</b> Nature (+Atk, -SDef)",
        3: "Adamant</b> Nature (+Atk, -SAtk)",
        2: "Brave</b> Nature (+Atk, -Spd)",
        1: "Lonely</b> Nature (+Atk, -Def)",
        0: "Hardy</b> Nature"
    };
    var typeColorNames = {
        0: "#a8a878",
        1: "#c03028",
        2: "#a890f0",
        3: "#a040a0",
        4: "#e0c068",
        5: "#b8a038",
        6: "#a8b820",
        7: "#705898",
        8: "#b8b8d0",
        9: "#f08030",
        10: "#6890f0",
        11: "#78c850",
        12: "#f8d030",
        13: "#f85888",
        14: "#98d8d8",
        15: "#7038f8",
        16: "#705848"
    };
    
    var genderToImportable = {
        incompatible: {
            "male": "<img src='Themes/Classic/genders/gender1.png'> (M)",
            "female": "<img src='Themes/Classic/genders/gender2.png'> (F)",
            "genderless": "<img src='Themes/Classic/genders/gender0.png'>"
        },
        
        "male": "(M)",
        "female": "(F)",
        "genderless": ""
    };
    
    var statNames = {
        0: "HP",
        1: "Atk",
        2: "Def",
        3: "SAtk",
        4: "SDef",
        5: "Spd"
    };
    
    Util.player = {};
    
    // Returns a player's first team for the given [tier].
    // IMPORTANT: Returns a team id, not a team object (or anything cool like that).
    // Returns -1 if a player doesn't have a team for that tier.
    Util.player.firstTeamForTier = function (id, tier) {
        var tierToLower = (tier || "").toLowerCase(),
            teamCount = sys.teamCount(id),
            i;
        
        for (i = 0; i < teamCount; i += 1) {
            if (sys.tier(id, i).toLowerCase() === tierToLower) {
                // returns the team id if the tiers match.
                return i;
            }
        }
    
        return -1;
    };
    
    // If the given player has a team for the specific tier.
    // If tier is not specified, then if the player has any teams at all will be returned.
    Util.player.hasTeamForTier = function (id, tier) {
        if (!tier) {
            return sys.teamCount(id) !== 0;
        }
    
        return sys.hasTier(id, tier);
    };
    
    // Returns a player's true color
    // So it doesn't appear to be black if the player has none (in html messages)
    Util.player.trueColor = function (src) {
        src = sys.id(Util.player.name(src));
        
        var defaultColor = sys.getColor(src);
        
        // when the player hasn't set their own color
        if (defaultColor === '#000000') {
            return defaultColorList[src % defaultColorList.length];
        }
        
        return defaultColor;
    };
    
    // Capitalizes a name (even when the player is offline), or returns it (id).
    Util.player.name = function (nameOrId) {
        if (typeof nameOrId === 'string') {
            return /*DataHash.correctNames[nameOrId.toLowerCase()] || */sys.name(nameOrId) || nameOrId;
        } else if (typeof nameOrId === 'number') {
            return sys.name(nameOrId) || "~Unknown~";
        }

        return "~Unknown~";
    };
    
    // Formats a player's name with html. Quite fancy.
    Util.player.formatName = function (nameOrId) {
        // fixes the case, and lets us accept ids
        var trueName = Util.player.name(nameOrId);
        
        // simply return a string. still a pain to write manually though.
        return "<b style='color: " + Util.player.trueColor(nameOrId) + "'>" + trueName + "</b>";
    };
    
    // Returns a player's name. Accepts an id, name, or the ip itself (if passed)
    Util.player.ip = function (idOrNameOrIp) {
        // since both names and ips are strings, return idOrNameOrIp if sys.dbIp returns undefined
        if (typeof idOrNameOrIp === 'string') {
            return sys.dbIp(idOrNameOrIp) || idOrNameOrIp;
        } else if (typeof idOrNameOrIp === 'number') {
            return sys.ip(idOrNameOrIp) || "0.0.0.0";
        }

        return "0.0.0.0";
    };
    
    Util.player.rangeIp = function (ip, parts) {
        // We use Util.player.ip to let us accept ids, names, or an actual ip.
        var rangeIp = Util.player.ip(ip).split(".");
        
        // by default, we use 2 parts (for example): [x.xx].xxx.xxx
        parts = parts || 2;
        
        if (parts < 1 || parts > 4) {
            parts = 2;
        }
        
        // Cut off any part after the wanted amount of parts/subaddresses.
        rangeIp.splice(parts, 4);
        return rangeIp.join(".");
    };
    
    // Returns the true authority level of a player (takes PlayerPermissions and maxAuth in account)
    Util.player.trueAuth = function (nameOrId) {
        // fixes the case, and lets us accept ids
        var trueName = Util.player.name(nameOrId),
            trueNameToLower = trueName.toLowerCase(),
            auth = sys.maxAuth(sys.dbIp(trueName)) || 0;
        
        // check for PlayerPermissions (which is the main purpose of this function)
        /*if ((Config.PlayerPermissions[trueNameToLower] || -1) > auth) {
            auth = Config.PlayerPermissions[trueNameToLower] || 0;
        }*/
        
        return auth;
    };
    
    // returns an array of all ids of [ip] (everyone logged in with [ip])
    Util.player.ipIds = function (ip) {
        var playerIds = sys.playerIds(),
            ids = [],
            length = playerIds.length,
            player,
            i;

        for (i = 0; i < length; i += 1) {
            player = playerIds[i];
            
            if (ip === sys.ip(player)) {
                ids.push(player);
            }
        }

        return ids;
    };
    
    // Returns the string name of the auth level [auth].
    // If img is true (Util.player.authToString.imageIdentifier), returns the image identifier (the one used in po's default theme files)
    // of that auth level.
    Util.player.authToString = function (auth, img) {
        var auths = {
            'true': {
                0: "User",
                1: "Moderator",
                2: "Administrator",
                3: "Owner",
                '3+': "Invisible"
            },
            'false': {
                0: "U",
                1: "M",
                2: "A",
                3: "O",
                '3+': "U"
            }
        };
        
        // Make sure it's an integer
        auth = Math.round(auth);
        
        // Make sure it's >= 0
        if (auth < 0) {
            auth = 0;
        }
        
        // Give it '3+' if it's > 3 (Invisible)
        if (auth > 3) {
            auth = '3+';
        }
        
        // true/false are used in the object to represent if the image identifier should be
        // returned, or not.
        return auths[img][auth];
    };
    
    Util.player.authToString.imageIdentifier = true;
    
    // Returns a player's status image (which can be battle, available, or away).
    Util.player.statusImage = function (src) {
        var status = "Away",
            isAway,
            authIdentifier;
        
        // The player is most likely online if this is the case.
        if (typeof src === "string") {
            // This gets the player's auth's image identifier.
            return "<img src='Themes/Classic/Client/" + Util.player.authToString(sys.dbAuth(src), true) + "Away.png'>";
        }
        
        isAway = sys.away(src);
        authIdentifier = Util.player.authToString(sys.auth(src), true);
        
        if (sys.battling(src)) {
            status = "Battle";
        } else if (!isAway) {
            status = "Available";
        } else {
            // Pretty much useless, but w/e.
            status = "Away";
        }

        return "<img src='Themes/Classic/Client/" + authIdentifier + status + ".png'>";
    };
    
    (function () {
        // Helper functions for playerStatus
        function offline() {
            return "<small style='color: red; font-weight: bold;'>Offline</small>";
        }

        function online() {
            return "<small style='color: green; font-weight: bold;'>Online</small>";
        }
        
        function lastOn(name) {
            var lastOnline = sys.dbLastOn(name);

            if (!lastOnline) {
                lastOnline = "Unknown";
            }

            return "<small style='color: blue; font-weight: bold; font-style: italic;'>Last Online:</small> " + lastOnline;
        }
        
        function player(id, name) {
            return "<b style='color: " + Util.player.trueColor(id) + "'>" + Util.escapeHtml(name) + "</b>";
        }
            
        // Return's a player's status (when they were last online, if they are even online, their name, and the status image).
        Util.player.playerStatus = function (name) {
            // Allows us to accept ids.
            name = Util.player.name(name);
            
            var id = sys.id(name) || -1,
                auth = sys.dbAuth(name),
                ip = sys.dbIp(name);
            
            if (!ip) {
                return "<img src='Themes/Classic/Client/UAway.png'>" + player(-1, name) + " " + offline() + " " + lastOn(name);
            } else if (!id) {
                return Util.player.statusImage(name) + " " + player(-1, name) + " " + offline() + " " + lastOn(name);
            }
            
            return Util.player.statusImage(id) + " " + player(id, name) + " " + online() + " <small>(<b style='color: blue'>Player ID: " + id + "</b>)</small>";
        };
    }());
    
    // Puts a player in multiple channels.
    Util.player.pushChannels = function (src, channels) {
        var len = channels.length,
            i;

        for (i = 0; i < len; i += 1) {
            if (!sys.isInChannel(src, channels[i])) {
                sys.putInChannel(src, channels[i]);
            }
        }
    };
    
    // If the player is on localhost (127.0.0.1 (IPv4) / ::1%0 (IPv6))
    Util.player.isServerHost = function (idOrNameOrIp) {
        var ip = Util.player.ip(idOrNameOrIp);
        
        return ip === "127.0.0.1" || ip === "::1%0";
    };
    
    // If tar is the same player as src (checks with IPs).
    Util.player.isSamePlayer = function (src, tar) {
        // Allows us to accept ids and names.
        return Util.player.ip(src) === Util.player.ip(tar);
    };
    
    // Returns the amount of authorities on the server.
    // src is optional. If specified, the player will be checked if they're owner or above.
    // if they are, they're allowed to know how many invisible auth are there as well.
    // This does not include PlayerPermission auths on purpose.
    Util.player.authCount = function (src) {
        var auths = sys.dbAuths(),
            count = 0,
            len,
            i;
        
        // Just return the complete amount of auths if they're owner or above, or if the argument isn't specified.
        if (!src || (src && Util.player.trueAuth(src) > 2)) {
            return auths.length;
        }
        
        for (i = 0, len = auths.length; i < len; i += 1) {
            // If they're owner or below (visible), add them.
            if (sys.dbAuth(auths[i]) <= 3) {
                count += 1;
            }
        }

        return count;
    };
    
    // Returns a list of online players' ids that have authority.
    // Doesn't check for PlayerPermission players (on purpose).
    Util.player.authIds = function () {
        var auths = sys.dbAuths(),
            ids = [],
            id,
            len,
            i;
        
        for (i = 0, len = auths.length; i < len; i += 1) {
            id = sys.id(auths[i]);
            
            if (id) {
                ids.push(id);
            }
        }
        
        return ids;
    };
    
    // Creates an importable [array] for src's team, teamId.
    // Importables will have some goodies that will break them for use with PO, disable this with a third argument that is true.
    Util.player.teamImportable = function (src, teamId, compatible) {
        var importable = [],
            maxTeamPokemon = 6,
            pokemonStatsCount = 6,
            maxPokemonMoves = 4,
            pokemonMaxLevel = 100,
            pokemon_MissingNo = 0,
            itemname_NoItem = "(No Item)",
            move_NoMove = 0,
            move_HiddenPower = 237;
        
        var gen = sys.gen(src, teamId),
            fullGen = sys.generation(gen, sys.subgen(src, teamId)),
            pokemon,
            move,
            ev,
            iv,
            pokemonId,
            pokemonName,
            pokemonLevel,
            pokemonItem,
            pokemonAbility,
            pokemonColor,
            pokemonGender,
            pokemonNature,
            pokemonShiny,
            pokemonNickname,
            pokemonEV,
            pokemonEVs = [],
            pokemonIV,
            pokemonIVs = [],
            moveId,
            moveName,
            moveType,
            movePart,
            nicknamePart,
            itemPart,
            genderPart;
        
        if (!compatible) {
            importable.push("Team #" + (teamId + 1) + ": Gen " + gen + " (" + fullGen + ")");
        }

        // Loop over their Pokémon.
        for (pokemon = 0; pokemon < maxTeamPokemon; pokemon += 1) {
            pokemonId = sys.teamPoke(src, teamId, pokemon);
            
            // Don't handle MissingNo
            if (pokemonId === pokemon_MissingNo) {
                continue;
            }
            
            pokemonName = sys.pokemon(pokemonId);
            pokemonLevel = sys.teamPokeLevel(src, teamId, pokemon);
            pokemonItem = sys.teamPokeItem(src, teamId, pokemon);
            pokemonAbility = sys.teamPokeAbility(src, teamId, pokemon);
            pokemonColor = typeColorNames[sys.pokeType1(pokemonId)];
            pokemonGender = sys.teamPokeGender(src, teamId, pokemon);
            pokemonNature = sys.teamPokeNature(src, teamId, pokemon);
            pokemonShiny = sys.teamPokeShine(src, teamId, pokemon);
            pokemonNickname = sys.teamPokeNick(src, teamId, pokemon);
            
            if (!compatible) {
                importable.push(
                    "<img src='pokemon:num=" + pokemonId + "&gen=" + gen + "&back=false&shiny=" + pokemonShiny + "&gender=" + pokemonGender + "'> <img src='pokemon:num=" + pokemonId + "&gen=" + gen + "&back=true&shiny=" + pokemonShiny + "&gender=" + pokemonGender + "'>"
                );
            }
            
            nicknamePart = pokemonNickname + "</b></font>";
            
            if (pokemonName !== pokemonNickname) {
                nicknamePart += " (<b style='color:" + pokemonColor + "'>" + pokemonName + "</b>)";
            }
            
            itemPart = sys.item(pokemonItem);
            
            if (itemPart === itemname_NoItem) {
                itemPart = "";
            } else if (!compatible) { // If the item isn't (No Item), and compatible is off, display an image instead.
                itemPart = itemPart + " <img src='item:" + pokemonItem + "'>";
            }
                
            genderPart = compatible ? genderToImportable[sys.gender(pokemonGender)] : genderToImportable.incompatible[sys.gender(pokemonGender)];
            
            importable.push(
                // <b> tag is closed by nicknamePart
                "<b style='color: " + pokemonColor + "'>" + nicknamePart + " " + genderPart + " @ " + itemPart
            );
            
            // In Generation 1 and 2, there were no abilities.
            if (gen > 2) {
                importable.push(
                    "<b style='color: " + pokemonColor + "'>Trait:</b> " + sys.ability(pokemonAbility)
                );
            }
            
            // Only add the level header if the Pokémon's level isn't maximum.
            if (pokemonMaxLevel > pokemonLevel) {
                importable.push(
                    "<b style='color: " + pokemonColor + "'>Level:</b> " + pokemonLevel
                );
            }
            
            // No EVs or IVs in Generation 1.
            if (gen > 1) {
                // EVs
                for (ev = 0; ev < pokemonStatsCount; ev += 1) {
                    pokemonEV = sys.teamPokeEV(src, teamId, pokemon, ev);
                    
                    // 255 is the default in Generation 2.
                    if (pokemonEV === 0 || (gen === 2 && pokemonEV === 255)) {
                        continue;
                    }
                    
                    pokemonEVs.push(pokemonEV + " " + statNames[ev]);
                }
                
                // If there are custom EVs, add the header. EVs are separated with a forward slash, one space before it, and one after.
                if (pokemonEVs.length) {
                    importable.push(
                        "<b style='color: " + pokemonColor + "'>EVs:</b> " + pokemonEVs.join(" / ")
                    );
                }
                
                // IVs - DVs in Pokémon Online
                for (iv = 0; iv < pokemonStatsCount; iv += 1) {
                    pokemonIV = sys.teamPokeDV(src, teamId, pokemon, iv);
                    
                    // 15 is the default in Generation 2, 31 otherwise.
                    if (pokemonIV === 31 || (gen === 2 && pokemonIV === 15)) {
                        continue;
                    }
                    
                    pokemonEVs.push(pokemonIV + " " + statNames[iv]);
                }
                
                // If there are custom IVs, add the header. IVs are separated with a forward slash, one space before it, and one after.
                if (pokemonIVs.length) {
                    importable.push(
                        "<b style='color: " + pokemonColor + "'>IVs:</b> " + pokemonIVs.join(" / ")
                    );
                }
            }
            
            // There are no natures in Generation 2 either.
            if (gen > 2) {
                // natureNames contains all the info we need. <b> is once again closed in this aswell.
                importable.push(
                    "<b style='color: " + pokemonColor + "'>" + natureNames[pokemonNature]
                );
            }
            
            // Now handle the moves. Oh boy.
            for (move = 0; move < maxPokemonMoves; move += 1) {
                moveId = sys.teamPokeMove(src, teamId, pokemon, move);
                moveName = sys.move(moveId);
                moveType = sys.moveType(moveId);
                movePart = "<b style='color: " + typeColorNames[moveType] + "'>" + moveName + "</b>";
                
                // Skip empty move slots.
                if (moveId === move_NoMove) {
                    continue;
                }
                
                // Special stuff for Hidden Power.
                if (moveId === move_HiddenPower) {
                    // Redo the IVs, this time include every one.
                    pokemonIVs = [];
                    
                    for (iv = 0; iv < pokemonStatsCount; iv += 1) {
                        pokemonIV = sys.teamPokeDV(src, teamId, pokemon, iv);
                        pokemonIVs.push(pokemonIV);
                    }
                    
                    // Combine the gen with the pokemon's complete IV list to get the type of hidden power via hiddenPowerType.
                    moveType = sys.hiddenPowerType.apply(sys, [gen].concat(pokemonIVs));
                    movePart = "<b style='color: " + typeColorNames[moveType] + "'>" + moveName + "</b>";
                }
                
                importable.push(
                    "-" + movePart
                );
            }
        }

        return importable;
    };
    
    // Kicks everyone on the server, with the exception of those caught by the filter.
    // The filter should return true if a player shouldn't be kicked. It gets the player's id as argument.
    Util.player.massKick = function (filter) {
        var ids = sys.playerIds(),
            len = ids.length,
            i;
        
        if (typeof filter !== "function") {
            filter = function () {
                return false;
            };
        }

        for (i = 0; i < len; i += 1) {
            if (!filter(ids[i])) {
                sys.kick(ids[i]);
            }
        }
    };
}());
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/util/mod-util.js */
Util.mod = {};

// Kicks a player.
Util.mod.kick = function (id) {
    // They have already been kicked..
    if (!sys.loggedIn(id)) {
        return;
    }
    
    // Silently kick them.
    sys.kick(id);
};

// Kicks all of player's alts.
Util.mod.kickAll = function (playerIp) {
    // Get the IP. This allows us to accept ids, names, and regular ips as well.
    var trueIp = Util.player.ip(playerIp);
    
    // Get all their alts.
    Util.player.ipIds(trueIp).forEach(function (id) {
        Util.mod.kick(id);
    });
};

// Disconnects (kick but allow them to reconnect with their data) a player.
Util.mod.disconnect = function (id) {
    // They have already been disconnected..
    if (!sys.loggedIn(id)) {
        return;
    }
    
    // Silently disconnect them.
    sys.disconnect(id);
};

// Disconnects (kick but allow them to reconnect with their data) all of player's alts.
Util.mod.disconnectAll = function (playerIp) {
    // Get the IP. This allows us to accept ids, names, and regular ips as well.
    var trueIp = Util.player.ip(playerIp);
    
    // Get all their alts.
    Util.player.ipIds(trueIp).forEach(function (id) {
        Util.mod.disconnect(id);
    });
};

// Mutes a player.
// opts is an object with these values:
// ip: The ip to mute.
// by: The player who issued the mute.
// reason: The reason of the mute.
// time: Time the mute lasts in seconds.
Util.mod.mute = function (opts) {
    if (!opts.ip || !opts.ip || typeof opts.time !== 'number') {
        return false;
    }
    
    // add the current time since epoch to the mute, as that is what we use to check if the mute has expired.
    opts.time += +(sys.time());
    
    if (!opts.reason) {
        opts.reason = "";
    }
    
    // ?
    //DataHash.mutes[opts.ip] = opts;
    
    // mute all of [opts.ip]'s names that are currently online.
    // note that we only have to set .muted (this prevents them from talking, until their mute has expired). This value is set after the log back in (because we mute their ip) automatically (if they're still muted), so we don't have to do any mumbo jumbo.
    Util.mod.ipIds(opts.ip).forEach(function (id) {
        JSESSION.users(id).muted = true;
    });
    return true;
};

// Permanently bans a player (and kick them).
// NOTE: This is done quietly.
Util.mod.ban = function (name) {
    // Since there is basically nothing to customise atm, this is simply a small wrapper (though it does kick players under the same alt.)
    sys.ban(name);
    Util.mod.kickAll(sys.ip(name));
};

// Temporarly bans a player.
// NOTE: Time is in minutes.
// NOTE: This is done quietly.
Util.mod.tempBan = function (name, time) {
    // Since there is basically nothing to customise atm (kick is done automatically), this is simply a small wrapper (though it does kick players under the same alt.)
    // Ensure time is an integer.
    time = Math.round(time);
    
    sys.tempBan(name, time);
    Util.mod.kickAll(sys.ip(name));
};

// If a player is banned.
Util.mod.isBanned = function (playerName) {
    // Return their name. This allows us to accept ids as well.
    var trueName = Util.player.name(playerName).toLowerCase(),
        bans = sys.banList();
    
    return bans.indexOf(trueName) !== -1;
};

// Returns the amount of seconds name is temporary banned for.
// This > sys.dbTempBanTime.
// NOTE: Unlike sys.dbTempBanTime, this returns 0 if the player isn't banned.
Util.mod.tempBanTime = function (playerName) {
    // Return their name. This allows us to accept ids as well.
    var trueName = Util.player.name(playerName).toLowerCase();
    
    // If they aren't banned, return 0.
    if (!Util.mod.isBanned(trueName)) {
        return 0;
    }
    
    // Otherwise, return for how long they are banned.
    return sys.dbTempBanTime(trueName);
};
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/bot.js */
(function setupBot() {
    var NoSender = -1,
        NoTarget = -1,
        NoChannel = -1;
    
    Bot = {};
    Bot.NoSender = NoSender;
    Bot.NoTarget = NoTarget;
    Bot.NoChannel = NoChannel;

    Bot.broadcast = function (message, channel, target) {
        if (channel === undefined || channel === null) {
            channel = NoChannel;
        }
        
        if (target === undefined || target === null) {
            target = NoTarget;
        }
        
        sys.broadcast(
            "<font color='" + Script.bot.color + "'><timestamp/><b>" + Script.bot.name + ":</b></font> " + message, // message
            channel, // channel
            NoSender, // sender
            true, // html
            target // target
        );
    };
    
    Bot.sendMessage = function (src, message, channel) {
        Bot.broadcast(message, channel, src);
    };
    
    Bot.sendAll = function (message, channel) {
        Bot.broadcast(message, channel, NoTarget);
    };
    
    Bot.sendEscapedMessage = function (src, message, channel) {
        Bot.broadcast(Util.escapeHtml(message), channel, src);
    };
    
    Bot.sendEscapedAll = function (message, channel) {
        Bot.broadcast(Util.escapeHtml(message), channel, NoTarget);
    };
    
    Bot.teamAlert = function (src, team, message) {
        Bot.broadcast("Team #" + (team + 1) + ": " + message, NoChannel, src);
    };
    
    Bot.invalidCommandMessage = function (src, command, channel) {
        Bot.broadcast("Hmm, '" + command + "' doesn't appear to exist as a command.", channel, src);
    };
    
    Bot.noPermissionMessage = function (src, command, channel) {
        Bot.broadcast("Using " + command + " is not something for you!", channel, src);
    };
}());
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/tours/defines.js */
(function () {
    // This object holds tournament manipulation functions and constants
    Tours = {};
    
    // Sends a tournament notification to a player
    // Also called by bots to notify a new tournament has started
    // info is an object and only used when called by a bot
    // Contains these properties:
    // name: Name of the bot.
    // color: Color of the bot.
    /*Tours.tourNotification = function tourNotification(src, chan, info) {
        if (!JSESSION.hasChannel(chan)) {
            return;
        }
        
        var tour = JSESSION.channels(chan).tour,
            state = tour.state,
            prize = '',
            finalsStr = '',
            startTime;
    
        // No tournament is running, don't send them anything.
        if (state === 0) {
            return;
        }
        
        // !No clean type
        if (src !== 0) {
            startTime = Util.timeToString((+sys.time()) - tour.startTime);
    
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=green>A Tournament was started by " + PlayerUtils.formatName(tour.starter) + " " + startTime + " ago! </b></font>", chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=red>Players:</font></b> " + tour.entrants, chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=blue>Type:</b></font> " + Tours.identify(tour), chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=orange>Tier:</b></font> " + tour.tier, chan);
    
            if (!Util.isEmpty(tour.prize)) {
                sys.sendHtmlMessage(src, "<timestamp/><b><font color=brown>Prize:</b></font> " + tour.prize, chan);
            }
    
            if (state === 1) {
                sys.sendHtmlMessage(src, "<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>", chan);
            } else if (state === 2) {
                if (tour.finals) {
                    finalsStr = " (<B>Finals</B>)";
                }
    
                sys.sendHtmlMessage(src, "<timestamp/>Currently in round " + tour.round + finalsStr + ". " + tour.remaining + " players remaining.", chan);
    
            }
        } else {
            // these are broadcasted by the bot [global].
            if (!Util.isEmpty(tour.prize)) {
                prize = '<b style="color: brown;">Prize:</b> ' + tour.prize + '<br/>';
            }
            
            // !This is supposed to be an array
            Tours.tourBox([
                "A tournament was started by <b style='color:" + info.color + "'>" + Utils.escapeHtml(info.starter) + "</b> " + startedAgo + " ago!",
                "<b style='color:red'>Players:</b> " + tour.entrants,
                "<b style='color: blue'>Type:</b> " + Tours.identify(tour),
                "<b style='color: orange'>Tier:</b> " + tour.tier,
                prize + " Type <b style='color:green'>/join</b> to join it!"
            ], chan);
        }
    };*/
    
    // Tours channel config.
    // Is a constructor, so should be initialized with new
    Tours.ToursChannelConfig = function ToursChannelConfig(id) {
        if (!(this instanceof ToursChannelConfig)) {
            return new ToursChannelConfig(id);
        }
        
        // id of the channel
        this.id = id;
        // state the tournament is in
        // 0: no tour is running
        // 1: tour is in signups
        // 2: tour is running
        this.state = 0;
        // the tournament's starter's name
        this.starter = "";
        // the tournament's prize
        this.prize = "";
        // round number of the tournament
        this.round = 0;
        // tier of the tournament
        this.tier = "";
        // amount of entrants that this tournament needs
        this.entrants = 0;
        // if battles should automatically start
        this.autoStartBattles = false;
        // amount of players remaining
        this.remaining = 0;
        // if the tournament is in the finals
        this.finals = false;
        // type of the tournament.
        // 0: Not running
        // 1: Single Elimination
        // 2: Double Elimination
        // 3: Triple Elimination
        // 4: Tag Team Single Elimination
        // 5: Tag Team Double Elimination
        // 6: Tag Team Triple Elimination
        this.type = 0;
    
        // status of the current round
        // contains:
        // - battles that have not begun (idleBattles)
        // - battles that have begun but have not been finished (ongoingBattles)
        // - battles that have ended (winLose)
        this.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        // couples objects (the pairs that have to battle)
        this.couples = {};
        // player objects
        /* {
                'name': name,
                'couplesid': -1,
                'couplenum': -1,
                'roundwins': 0,
                'team': -1
            };
        */
        this.players = {};

        // players in this round that still have to battle
        this.roundPlayers = 0;
        // time since epoch when tour started (signups)
        this.startTime = 0;
    };
    
    
    // Resets all tournament variables for a TCC.
    Tours.clearVariables = function clearVariables(tcc) {
        tcc.state = 0;
        tcc.starter = "";
        tcc.prize = "";
        tcc.round = 0;
        tcc.tier = "";
        tcc.entrants = 0;
        tcc.remaining = 0;
        tcc.finals = false;
        tcc.type = 0;

        tcc.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        tcc.couples = {};
        tcc.players = {};

        tcc.roundPlayers = 0;
        tcc.startTime = 0;
    };
    
    // Resets round tournament variables for a TCC.
    Tours.cleanRoundVariables = function cleanRoundVariables(tcc) {
        tcc.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        tcc.couples = {};
        tcc.roundPlayers = 0;
    };
    
    // Table for tour messages.
    Tours.tourBox = function tourBox(message, chan) {
        if (!Array.isArray(message)) {
            message = [message];
        }
        
        message = message.join('<br/>');
        sys.sendHtmlAll("<table><tr><td><center><hr width='300'>" + message + "<hr width='300'></center></td></tr></table>", chan);
    };
    
    // Sends a tourBox to a player
    Tours.tourBoxPlayer = function tourBoxPlayer(src, message, chan) {
        if (!Array.isArray(message)) {
            message = [message];
        }
        
        message = message.join('<br/>');
        sys.sendHtmlMessage(src, "<table><tr><td><center><hr width='300'>" + message + "<hr width='300'></center></td></tr></table>", chan);
    };
    
    /* !check */
    // Checks if a player has tour auth in the specified channel.
    Tours.hasTourAuth = function (id, channel) {
        var poUser = JSESSION.users(id),
            poChannel = JSESSION.channels(channel);
    
        return poChannel.tourAuth.hasOwnProperty(poUser.name.toLowerCase()) || poUser.megauser || poChannel.isChanMod(id);
    };
    
    // Identifies a tour's type.
    Tours.identify = function identify(type) {
        return Tours.modes[type] || "Unknown";
    };
    
    // Returns the amount of battles required before a player goes on to the next round.
    Tours.battlesRequired = function battlesRequired(mode) {
        return {
            1: 1,
            2: 2,
            3: 3,
            4: 1,
            5: 2,
            6: 3
        }[mode];
    };
    
    Tours.modes = {
        0: "No tournament is running.",
        1: "Single Elimination",
        2: "Double Elimination",
        3: "Triple Elimination",
        4: "Tag Team Single Elimination",
        5: "Tag Team Double Elimination",
        6: "Tag Team Triple Elimination"
    };
    
    // Constants
    // Teams
    Tours.blue = 0;
    Tours.red = 1;
    
    // Unused
    //Tours.border = "<font color=blue><timestamp/><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB</b></font>";
}());
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/scripts.js */
JSESSION.identifyScriptAs("TheUnknownOne's Server Script v2.7.0-dev");
JSESSION.registerUserFactory(JSESSION.factory.User);
JSESSION.registerChannelFactory(JSESSION.factory.Channel);
//JSESSION.registerGlobalFactory(JSESSION.factory.Global);

Script.poScript = ({
});