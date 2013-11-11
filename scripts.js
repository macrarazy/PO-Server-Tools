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
    Bot;

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
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/util.js */
(function setupUtil() {
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
}());
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
/*! Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/src/scripts.js */
JSESSION.identifyScriptAs("TheUnknownOne's Server Script v2.7.0-dev");
//JSESSION.registerUserFactory(JSESSION.factory.User);
//JSESSION.registerChannelFactory(JSESSION.factory.Channel);
//JSESSION.registerGlobalFactory(JSESSION.factory.Global);

Script.poScript = ({
});