/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys*/

/*
 ==== SCRIPT INFORMATION ====
 - Version: 3.0.0 Devel -
 - Maintained by TheUnknownOne -
 - Licensed under MIT (LICENSE.txt) | Version 2.x is licensed under GPL v3 -
 - Special Thanks to Lamperi, Mystra, and Intel_iX -

 Release: https://github.com/TheUnknownOne/PO-Server-Tools/master/
 - Has no known errors
 Beta: https://github.com/TheUnknownOne/PO-Server-Tools/beta/
 - Has no obvious errors - shouldn't crash
 Alpha: https://github.com/TheUnknownOne/PO-Server-Tools/alpha/
 - Has no fatal errors - can crash
 Development: https://github.com/TheUnknownOne/PO-Server-Tools/devel/
 - Untested code/sandbox for all other versions

 - All modules are in the directory 'scripts' -
 */

// TODO: More comments. :]
/* Script Configuration */
var Config = {
    /* If teams should be checked for Dream World abilities */
    DWAbilityCheck: true,

    /* If the default channels are automatically joined when a player goes on the server */
    AutoChannelJoin: true,

    /* If welcome messages should be displayed globally */
    WelcomeMessages: false,

    /* If admins can give and take auth from users and to moderators. */
    AdminsCanAuth: true,

    /* Characters which indicate the usage of a command. */
    CommandStarts: ["/", "!"],

    /* Changes that players authority to that level when performing an auth lookup (so an administrator with a PlayerPermission of 3 can use owner commands, 
        however, they still appear as an administrator).
        
        Note that it's important to write the player's name in lower case (so "theunknownone" instead of "TheUnknownOne")
    */
    PlayerPermissions: {
        "Example player with Config.PlayerPermissions": 3,
        "Another example player with Config.PlayerPermissions": 2
    },
    
    /* After how many seconds a player's message should be 'forgiven', causing it to not be counted by
        the floodbot. The floodbot counts the amount of messages a player posts (the exact amount is in scripts/user.js) before it kicks them.
        After this many seconds, the floodbot forgets that the player ever posted a message, causing it not
        to be counted in flood kick calculations. */
    AutoFloodTime: 6,
    
    /* Attempts to fix crashes. Some features might not be available (so if you don't have any problems
        with crashes, don't enable this). */
    NoCrash: false,

    /* Mafia Configuration */
    Mafia: {
        /* Amount of different themes that have to be started before one that has been played (norepeat) games ago */
        norepeat: 3,

        /* Path to the file where mafia stats will be written to. */
        stats_file: "mafia-stats.json",

        /* Maximum length for a player's name who wants to join a mafia game. */
        max_name_length: 16
    }
};

var Script = {
    /* Version of the script. */
    SCRIPT_VERSION: "3.0.0 Devel",
    
    /* URL of the script only. */
    SCRIPT_URL: "https://raw.github.com/TheUnknownOne/PO-Server-Tools/master/scripts.js",
    
    /* URL for modules/languages (github) */
    URL: "https://raw.github.com/TheUnknownOne/PO-Server-Tools/",

    /* Branch to download modules (and other data) from. */
    BRANCH: "devel",
    
    /* Time in ms (since epoch) since the server (re)loaded the script. Used to calculate loading speeds. */
    EVAL_TIME_START: new Date().getTime()
};

var IP_Resolve_URL = "http://ip2country.sourceforge.net/ip2c.php?ip=%1"; /* This URL will get formatted. %1 is the IP */

/* Don't modify anything beyond this point if you don't know what you're doing. */
var global = this;
var GLOBAL = this;
    
if (typeof require === 'undefined') {
    // includes a script
    var require = (function () {
        var require; // require function, see below.
        
        // path: path to the file, no .js
        // nocache: if the cache for the file should be deleted
        require = function (path) {
            var content,
                identifier = String(path),
                module = {exports: {}, path: path + ".js"},
                exports = module.exports;
                
            path += ".js";
            
            // delete the cache or quickly get the module
            if (require.modules[identifier]) {
                return require.modules[identifier];
            }
            
            content = sys.getFileContent("scripts/" + path);
            
            if (content === undefined) {
                return {};
            }
            
            try {
                eval.call(global, content);
            } catch (e) {
                print("Couldn't load module " + identifier + " (scripts/" + path + "): " + e.toString() + " on line " + e.lineNumber);
            }
            
            require.modules[identifier] = module.exports;
            return require.modules[identifier];
        };
        
        require.modules = require.modules || {};
        return require;
    }());
}

// No need to polute the global namespace with this.
(function () {
    // Require'd (included) scripts.
    var Options = require('options');
    var Bot = require('bot');
    var Utils = require('utils');
    
    // JSESSION stuff
    var POUser = require('user').User;
    var POChannel = require('channel').Channel;
    // TODO: Remove this and merge it with options.js
    var POGlobal = require('global').Global;
        
    var JSESSION = require('jsession').JSESSION;
    
    // Attempts to add new features to JSESSION
    Utils.updatePrototype(JSESSION, require('jsession').jsession_constructor);
    
    // NOTE: hasTeam -> PlayerUtils.hasTeamForTier
    // NOTE: firstTeamForTier -> PlayerUtils.firstTeamForTier
    // NOTE: script.namecolor -> PlayerUtils.trueColor
    // NOTE: script.loadAll -> script.init
    
    // NOTE: These will not be used anymore as-is, but some of them (like linkify) will be merged with utils
    /*
    defineCoreProperty = function (core, prop, func) {
        Object.defineProperty(core, prop, {
            "value": func,
    
            writable: true,
            enumerable: false,
            configurable: true
        });
    }
    
    defineCoreProperty(String.prototype, "reverse", function () {
        var strThis = this;
        strThisArr = strThis.split("").reverse().join("");
    
        this = strThisArr;
        return this;
    });
    
    defineCoreProperty(String.prototype, "isEmpty", function () {
        var mess = this;
        return mess == "" || mess.trim() == "";
    });
    
    defineCoreProperty(String.prototype, "contains", function (string) {
        var str = this;
        return str.indexOf(string) > -1;
    });
    
    defineCoreProperty(String.prototype, "has", function (string) {
        return this.contains(string);
    });
    
    defineCoreProperty(String.prototype, "name", function () {
        var str = this;
        if (typeof DataHash.names == "undefined") {
            return str;
        }
    
        var tl = str.toLowerCase();
        if (typeof DataHash.names[tl] != "undefined") {
            str = DataHash.names[tl];
        }
    
        return str;
    });
    
    defineCoreProperty(String.prototype, "format", function () {
        var str = this,
            exp, i, args = arguments.length,
            icontainer = 0;
        for (i = 0; i < args; i++) {
            icontainer++;
            exp = new RegExp("%" + icontainer, "");
            str = str.replace(exp, arguments[i]);
        }
        return str;
    });
    
    defineCoreProperty(String.prototype, "fontsize", function (size) {
        var str = this;
    
        return "<font size='" + size + "'>" + str + "</font>";
    });
    
    defineCoreProperty(String.prototype, "scramble", function () {
        var thisString = this.split("");
        for (var i = thisString.length, j, k; i; j = parseInt(Math.random() * i), k = thisString[--i], thisString[i] = thisString[j], thisString[j] = k) {}
        return thisString.join("");
    });
    
    defineCoreProperty(String.prototype, "linkify", function () {
        var urlPattern = /\b(?:https?|ftps?|git):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
            pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
            emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim,
            poPattern = /\bpo:[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
    
        return this.replace(urlPattern, '<a target="_blank" href="$&">$&</a>').replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>').replace(emailAddressPattern, '<a target="_blank" href="mailto:$1">$1</a>').replace(poPattern, function ($) {
            var type = $.substring($.indexOf(":", $.indexOf("/"))),
                thing = $.substring($.indexOf("/"));
    
            type = type[0].toUpperCase() + type.substring(1);
    
            return "<a href='" + $ + "'>" + type + " " + thing + "</a>";
        });
    });
    
    defineCoreProperty(Boolean.prototype, "isEmpty", function () {
        return this === false;
    });
    
    defineCoreProperty(Number.prototype, "isEmpty", function () {
        return !isFinite(this) || this === 0;
    });
    
    defineCoreProperty(Number.prototype, "positive", function () {
        return !this.isEmpty();
    });
    
    defineCoreProperty(Object.prototype, "isEmpty", function () {
        return this.length() === 0;
    });
    
    defineCoreProperty(Object.prototype, "keys", function () {
        return Object.keys(this);
    });
    
    defineCoreProperty(Object.prototype, "has", function (prop) {
        return typeof this[prop] !== "undefined";
    });
    
    defineCoreProperty(Object.prototype, "contains", function (prop) {
        return this.has(prop);
    });
    
    defineCoreProperty(Object.prototype, "insert", function (name, val) {
        this[name] = val;
    });
    
    defineCoreProperty(Object.prototype, "extend", function (other) {
        var x;
    
        if (typeof other === "object" && !Array.isArray(other) && other !== null) {
            for (x in other) {
                this[x] = other[x];
            }
        }
    
        return this;
    });
    
    defineCoreProperty(Object.prototype, "remove", function (name) {
        if (!this.has(name)) {
            return;
        }
    
        delete this[name];
    });
    
    defineCoreProperty(Object.prototype, "first", function () {
        var x;
        for (x in this) {
            return this[x];
        }
    });
    
    defineCoreProperty(Object.prototype, "length", function () {
        return Object.keys(this).length;
    });
    
    defineCoreProperty(Array.prototype, "has", function (prop) {
        var x;
        for (x in this) {
            if (this[x] == prop) {
                return true;
            }
        }
    
        return false;
    });
    
    defineCoreProperty(Array.prototype, "isEmpty", function () {
        return this.length === 0;
    });
    
    defineCoreProperty(Array.prototype, "contains", function (prop) {
        return this.has(prop);
    });
    */
    
    JSESSION.identifyScriptAs("TheUnknownOne's Server Script " + Script.SCRIPT_VERSION);
    JSESSION.registerUser(POUser);
    JSESSION.registerChannel(POChannel);
    JSESSION.registerGlobal(POGlobal);
    JSESSION.refill();
}());

    
function Mail(sender, text, title) {
    var date = new Date();

    this.sender = sender;
    this.title = title;
    this.text = text;
    this.read = false;
    this.sendtime = String(date);
    this.sendAgo = +(sys.time());
}

({
    // Event: serverStartUp [event-serverStartUp]
    // Called when: Server starts up
    // Sets start up variables and calls event beforeNewMessage
    serverStartUp: function () {
        var Options = require('options'),
            Utils = require('utils');
        
        Options.isStartingUp = true;
        Options.startUpTime = +(sys.time());
        
        // Call beforeNewMessage with "Script Check: OK"
        // This is weirdly not done by the server itself in serverStartUp
        Utils.callEvent("beforeNewMessage", "Script Check: OK");
        
        // sys.updateDatabase();
    },

    // Event: serverShutDown [event-serverShutDown]
    // Called when: Server shuts down
    // Currently does nothing.
    serverShutDown: function () {
    },

    // Event: init [event-init]
    // Called when: Custom
    // Initializes certain values
    init: function () {
        var Options = require('options'),
            Utils = require('utils'),
            serverLine = sys.getFileContent("config").split("\n")[30],
            defaultChannels = Options.defaultChannels,
            channelIdKeys = Object.keys(Options.defaultChannelIds),
            length = defaultChannels.length,
            i;
        
        Options.serverName = serverLine.substring(5).replace(/\\xe9/i, "é").trim();
        
        // creates/gets the id of the default channels.
        // NOTE: Very important that this is done in init(). If this is done during (or before) serverStartUp, the server crashes.
        for (i = 0; i < length; ++i) {
            Options.defaultChannelIds[channelIdKeys[i]] = sys.createChannel(defaultChannels[i]) || sys.channelId(defaultChannels[i]);
        }
        
        /*run("loadRequiredUtilities");
        run("loadCache");

        run("loadUtilities");
        run("loadChannelUtilities");

        run("loadTrivia");
        run("loadMafia");
        run("loadPrune");

        run("loadTiers");
        run("loadStyles");
        run("loadRankIcons");
        run("loadPokemonStats");

        run("loadTemplateUtility");
        run("loadIfyUtility");
        run("loadCommandStatsUtility");*/

        /*
        loadOldPoll = function () {
            if (typeof Poll === 'undefined') {
                Poll = {};
                Poll.mode = 0;
                Poll.subject = "";
                Poll.starter = '';
                Poll.options = {};
                Poll.votes = 0;

                if (cache.get("Poll") != "") {
                    try {
                        Poll = JSON.parse(cache.get("Poll"));
                    }
                    catch (e) {
                        cache.remove("Poll");
                    }
                }
            }
        }

        loadOldPoll();
*/
        /*
        if (typeof DataHash.spammers == "undefined") {
            DataHash.spammers = {};
        }

        if (typeof DataHash.teamSpammers == "undefined") {
            DataHash.teamSpammers = {};
        }

        if (typeof DataHash.reconnect == "undefined") {
            DataHash.reconnect = {};
        }

        if (typeof Clantag === "undefined" || Clantag.full !== ClanTag) {
            Clantag = {};
            Clantag.full = ClanTag;
            Clantag.fullText = removespaces(Clantag.full.replace(/[\[\]\{\}]/gi, ""));
            Clantag.fullTextLower = Clantag.fullText.toLowerCase();
        }

        ScriptLength = {};

        var date = String(new Date());
        cache.write("Script_LastLoad", date);
        cache.save("Script_Registered", date);
        */
    },

    // Event: attemptToSpectateBattle
    // Called when: [src] tries to spectate a battle between [battler1] and [battler2]
    // Allows [src] to watch [battler1]'s and [battler2]'s battle if they are currently playing
    // a tournament finals match (even when Disallow Spectators is on).
    attemptToSpectateBattle: function (src, battler1, battler2) {
        var Tours = require('tours').Tours,
            channelIds = sys.channelIds(),
            length = channelIds.length,
            tour,
            i;

        for (i = 0; i < length; ++i) {
            // ensure we have an object
            tour = (JSESSION.channels(channelIds[i]) || {tour: {}}).tour;
            
            if (tour.finals && Tours.isInTourneyId(battler1, tour) && Tours.isInTourneyId(battler2, tour)) {
                Bot.sendMessage(src, "Enjoy the final match!", tour.id);
                return "allow";
            }
        }
    },

    // Event: beforeFindBattle
    // Called when: [src] tries to find a battle via the "Find Battle" button.
    // Logs [src] pressing "Find Battle".
    beforeFindBattle: function (src) {
        // TODO: WatchUtils: WatchUtils.logPlayerEvent()
        var WatchUtils = require('watch-utils');
        
        WatchUtils.logPlayerEvent(src, "Pressed \"Find Battle\"");
    },

    // Event: beforeChannelJoin
    // Called when: [src] joins the channel [chan].
    // 
    beforeChannelJoin: function (src, chan) {
        var JSESSION = require('jsession').JSESSION,
            Options = require('options'),
            channelIds = Options.defaultChannelIds,
            name = sys.name(src),
            user,
            channel;
        
        // Ensure their JSESSION objects exist
        // Only alarm when a channel object doesn't exist yet
        if (!JSESSION.hasUser(src)) {
            JSESSION.createUser(src);
        }
        if (!JSESSION.hasChannel(chan)) {
            JSESSION.createChannel(chan);
        }

        user = JSESSION.users(src);
        channel = JSESSION.channels(src);

        // Allow them in if they're (channel) auth (even if banned, etc.)
        // This checks if they're normal auth as well.
        if (channel.isChanMod(src)) {
            return;
        }
        
/*        if ( DataHash.megausers.has(srcname) && c == staffchannel || DataHash.evalops.has(srcname) && c == scriptchannel) {
            return;
        }*/

        var ip = sys.ip(src);
        if (chan.isBannedInChannel(ip)) {
            Prune.channelBans(c);
            if (chan.isBannedInChannel(ip)) { // repeat this because of ban pruning
                sys.stopEvent();
                var ban = chan.banlist[ip],
                    time;

                if (ban.time !== 0) {
                    time = "Banned for " + getTimeString(ban.time - +sys.time());
                } else {
                    time = "Banned forever";
                }

                var by = ban.by,
                    why = ban.why,
                    last = why[why.length - 1];
                if (last !== "." && last !== "!" && last !== "?") {
                    why += ".";
                }

                botMessage(src, "You are banned in " + sys.channel(c) + " by " + by + ". Reason: " + why + " " + time + ".");
                return;
            }
        }

        // If this is the main channel, ignore it being private,
        // but do prevent them from getting in main if they're banned
        if (chan === 0) {
            return;
        }

        // don't care about #name being changed
        // this can only happen to the main channel, and we already prevented it from reaching this
        if (channel.private) {
            Bot.sendMessage(src, channel.name + " is auth-only!");
            sys.stopEvent();
            return;
        }

        if (chan === channelIds.triviarev
                || chan === channelIds.watch
                || chan === channelIds.staff
                || chan === channelIds.eval) {
            Bot.sendMessage(src, "The access to " + channel.name + " is restricted!");
            sys.stopEvent();
            return;
        }
    },

    // Event: beforeChannelDestroyed
    // Called when: Before a channel is deleted
    // Stops perm/default channels from being destroyed.
    beforeChannelDestroyed: function (chan) {
        // TODO: WatchUtils: logChannelEvent(): WatchChannelEvent
        var WatchUtils = require('watch-utils'),
            JSESSION = require('jsession').JSESSION,
            defaultIds = require('options').defaultChannelIds;
        
        if (chan === defaultIds.mafia
                || chan === defaultIds.trivia
                || chan === defaultIds.triviarev
                || chan === defaultIds.watch
                || chan === defaultIds.staff
                || chan === defaultIds.eval
                || JSESSION.channels(chan).perm) {
            sys.stopEvent();
            return;
        }

        WatchUtils.logChannelEvent(chan, "Destroyed");
        JSESSION.destroyChannel(chan);
    },

    afterChannelCreated: function (chan, name, src) {
        if (typeof cData != "undefined") {
            cData.loadDataFor(name);
        }

        if (!JSESSION.hasChannel(chan)) {
            return;
        }

        var POChan = JSESSION.channels(chan);
        if (sys.loggedIn(src) && POChan.creator == src) {
            POChan.creator = sys.name(src).toLowerCase();
        } else {
            POChan.creator = "~Unknown~";
        }

        if (src) {
            POChan.changeAuth(src, 3);
        }
    },

    step: function () {
        if (typeof RECOVERY != "undefined") {
            sys.callLater("RECOVERY();", 2);
        }

        if (typeof cache == 'undefined' || typeof DataHash == 'undefined') {
            return;
        }

        if (typeof stepCounter == "undefined") {
            stepCounter = 0;
        }

        stepCounter++;

        if (AutoStartTours) {
            if (stepCounter % 300 === 0) { /* 60*5 */
                var mainChan = JSESSION.channels(0).tour;
                if (mainChan.tourmode == 0) {
                    var tourTiers = sys.getTierList(),
                        max = sys.numPlayers() + 1;

                    if (max > 51) {
                        max = 51;
                    }
                    else if (max < 4) {
                        max = 4;
                    }

                    var battleMode = sys.rand(1, 7),
                        tourNumber, tourTier;

                    if (max != 4) {
                        tourNumber = sys.rand(3, max);
                        if (battleMode > 3) {
                            while (tourNumber % 2 != 0) {
                                tourNumber = sys.rand(4, max);
                            }
                        }
                    }
                    else {
                        tourNumber = 3;
                        if (battleMode > 3) {
                            tourNumber++;
                        }
                    }

                    if (tourTiers.length == 1) {
                        tourTier = tourTiers[0];
                    }
                    else {
                        tourTier = tourTiers[Math.round(Math.random() * tourTiers.length)];
                    }

                    mainChan.tournumber = tourNumber;
                    mainChan.tourtier = tourTier;
                    mainChan.startTime = sys.time() * 1;
                    mainChan.battlemode = battleMode;
                    mainChan.prize = "";
                    mainChan.tourmode = 1;
                    mainChan.tourstarter = Bot.bot + "</i>";

                    TourNotification(0, 0, {
                        "starter": Bot.bot + "</i>",
                        "color": Bot.botcolor
                    });

                }
            }
        }

/*
if(typeof Trivia != "undefined") {
if(!Trivia.isGameGoingOn()&&stepCounter % 300 === 0) {
Trivia.start();
}
}
*/

        //if (stepCounter % 3600 === 0) { /* 60*60 */
        //  clearlogs();
        //}
        // no longer working on v2
        if (typeof mafia != "undefined") {
            mafia.tickDown();
        }

        if (stepCounter % 10 === 0) { // Do this every 10 seconds.
            Prune.tempAuth();
        }

    },

    beforeChannelCreated: function (name, cid, src) {
        if (typeof ChannelsAllowed != 'undefined' && ChannelsAllowed === false && src != 0 && permission(src, 1)) {
            botMessage(src, "You cannot create channels at the moment.");
            sys.stopEvent();
            return;
        }
        if (src != 0 && unicodeAbuse(src, name)) {
            sendFailWhale(src, 0);
            sys.stopEvent();
            return;
        }

        JSESSION.createChannel(cid);
    },

    beforeLogIn: function (src) {
        var myIp = sys.ip(src),
            myName = sys.name(src),
            dhn = DataHash.names,
            toLower = myName.toLowerCase();

        script.hostAuth(src);

        dhn.extend({
            myIp: myName,
            toLower: myName
        });

        playerscache.write("names", JSON.stringify(dhn));
        script.resolveLocation(src, myIp, false);

        if (DataHash.reconnect.has(myIp)) {
            testNameKickedPlayer = src;
            sys.stopEvent();
            return;
        }

        if (script.testName(src)) {
            testNameKickedPlayer = src;
            sys.stopEvent();
            return;
        }
    },

    beforeChannelLeave: function (src, chan) {
        WatchEvent(src, "Left Channel", chan);
    },

    afterLogIn: function (src) {
        var me = player(src),
            self = JSESSION.users(src),
            srcToLower = sys.name(src).toLowerCase(),
            myAuth = sys.auth(src),
            sendWelcomeMessage = Config.WelcomeMessages && (myAuth < 1 || myAuth > 3),
            temp = "",
            pNum = sys.numPlayers();

        WatchEvent(src, "Log In on IP " + sys.ip(src));

        if (sendWelcomeMessage) {
            botAllExcept(src, me + " joined the server!", 0);
        }

        botMessage(src, "Welcome, " + me + "!", 0);

        botMessage(src, "Type in <b><font color=green>/Commands</font></b> to see the commands and <b><font color=green>/Rules</font></b> to see the rules.", 0);

        if (typeof startupTime == 'number' && startupTime != NaN) {
            botMessage(src, "The server has been up for " + startUpTime() + "</b>.", 0);
        }

        if (pNum > maxPlayersOnline) {
            maxPlayersOnline = pNum;
        }

        if (maxPlayersOnline > cache.get("MaxPlayersOnline")) {
            cache.write("MaxPlayersOnline", maxPlayersOnline);
        }

        botMessage(src, "Current amount of players online is <b>" + pNum + "</b>. Record is <b>" + maxPlayersOnline + "</b>.", 0);

        if (!sys.dbRegistered(srcToLower)) {
            botMessage(src, "You are not registered. Click on the 'Register' button if you wish to protect your alias. Registration only requires a password.", 0);
        }

        TourNotification(src, 0);
        sys.sendMessage(src, "", 0);

        if (Config.AutoChannelJoin) {
            var ChanIds = [mafiachan /*, trivia*/ ];

            if (sys.auth(src) > 0 || JSESSION.channels(watch).isChanMod(src)) {
                ChanIds.push(watch);
            }

            if (self.megauser || sys.auth(src) > 0 || JSESSION.channels(staffchannel).isChanMod(src)) {
                ChanIds.push(staffchannel);
            }

            if (sys.auth(src) > 1 || JSESSION.channels(scriptchannel).isChanMod(src) || DataHash.evalops.has(srcToLower)) {
                ChanIds.push(scriptchannel);
            }
/*
            if (sys.auth(src) > 1 || JSESSION.channels(trivreview).isChanMod(src)) {
                ChanIds.push(trivreview);
            }*/

            putInMultipleChannels(src, ChanIds);
        }

        if (DataHash.idles.has(srcToLower)) {
            if (DataHash.idles[srcToLower].entry != "") {
                botAll(format("lvl2", DataHash.idles[srcToLower].entry), 0);
            }
            sys.changeAway(src, true);
        }

        ify.afterLogIn(src);
        script.afterChangeTeam(src, true);
    },

    afterChannelJoin: function (src, channel) {
        WatchEvent(src, "Channel Joined", channel);

        var chan = JSESSION.channels(channel),
            srcname = sys.name(src).toLowerCase(),
            user = JSESSION.users(src);

        if (ChatColorRandomizers.has(channel)) {
            var index = ChatColorRandomizers[channel],
                code = '<center><hr width="150"/><b>Party Time!</b><hr width="150"/></center><div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + index.firstColor + ', stop:1 ' + index.secondColor + ');">';

            sys.sendHtmlMessage(src, code, channel);
        }

        if (!chan.topic) {
            chan.topic = "Welcome to " + sys.channel(channel) + "!";
            chan.defaultTopic = true;
            cData.changeTopic(chan, chan.topic, "", true);
        }
        else {
            var topic = chan.topic,
                tsetter = chan.topicsetter,
                dbAuth = hpAuth(tsetter);

            if (dbAuth == undefined || dbAuth < 0) {
                topic = format(html_escape(topic));
            }

            sys.sendHtmlMessage(src, "<font color=orange><timestamp/><b>Welcome Message:</b></font> " + topic, channel);

            if (tsetter != '') {
                sys.sendHtmlMessage(src, "<font color=darkorange><timestamp/><b>Set By:</b></font> " + tsetter, channel);
            }
        }

        if (motd) {
            var MOTDSetter = cache.get("MOTDSetter"),
                MOTD = cache.get("MOTDMessage");

            sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day: </b></font>' + MOTD, channel);
            sys.sendHtmlMessage(src, '<font color=darkred><timestamp/><b>Set By: </b></font>' + MOTDSetter, channel);
        }
        else {
            sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day:</b></font> Enjoy your stay at ' + servername + '!', channel);
        }

/*
        if (chan.isChanMod(src) && chan.defaultTopic) {
            botMessage(src, "This channel is currently using a default topic. Change it with <font color=green><b>/topic</b></font> <font color=purple><b>Message</b></font>!", channel);
        }*/

        if (Poll.mode) {
            botMessage(src, "A poll is going on! Use <font color=green><b>/viewpoll</b></font> for more information.", channel);
        }

        if (chan.toursEnabled) {
            if (channel != 0) {
                TourNotification(src, channel);
            }
        }
/*
        if (channel === trivreview) {
            var triv_rev_count = Trivia.reviewCount(),
                s = "are",
                s2 = "s";
            if (triv_rev_count != 0) {
                if (triv_rev_count === 1) {
                    s = "is";
                    s2 = "";
                }
                botMessage(src, "There " + s + " " + triv_rev_count + " question" + s2 + " to review. Type /review for a full list.");
            }
        }*/

    },

    beforeNewMessage: function (message) {
        if (message.substring(0, 8) == "[#Watch]") {
            sys.stopEvent();
            return;
        }

        if (message.replace(/\[#(.*?)\]/, "") == " ") {
            sys.stopEvent();
            return;
        }

        if (message.substring(0, 14) == "Script Warning") {
            sys.stopEvent();
            if (typeof watch != "undefined") {
                botAll(message, watch);
            }
            return;
        }

        if (message.substring(0, 14) == "~~Server~~: >>") {
            sys.stopEvent();
            print(">> " + message.substring(14));

            var result;
            try {
                result = eval(message.substring(14));
            } catch (e) {
                result = FormatError("", e);
            }

            print("<< " + result);
            return;
        }
/*
        if (message.substr(0, 2) != "[#") {
            if (/Script Error line \d+:/.test(message)) {
                botAll(message, watch);
                return;
            }
        }*/

/*
if(message == "Safe scripts setting changed") {
if(message == "Logging changed") {
if(message == "Proxy Servers setting changed") {
if(message == "Low TCP Delay setting changed") {
if(message == "Maximum Players Changed.") { 
*/

        if (message == "Main channel name changed") {
            var mainChan = JSESSION.channels(0);
            if (mainChan.defaultTopic || mainChan.topicsetter == '') {
                var update = function () {
                    mainChan.topic = "Welcome to " + sys.channel(0) + "!";
                    cData.changeTopic(0, mainChan.topic, '', true);
                }
                sys.quickCall(update, 20); // since it's before.
            }
            return;
        }

        if (message == "Script Check: OK") {
            sys.appendToFile(".scriptsession", "");

            script.loadAll();

            ScriptUpdateMessage();

            RECOVERY_BACKUP = {};
            for (var x in script) {
                RECOVERY_BACKUP[x] = script[x];
            }
            return;
        }

        if (message == "Announcement changed.") {
            var pidsin, pids = sys.playerIds();
            for (pidsin in pids) {
                sys.sendMessage(pids[pidsin], "~~Server~~: Announcement was changed.");
            }
            return;
        }

        if (message == "The description of the server was changed.") {
            var pidsin, pids = sys.playerIds();
            for (pidsin in pids) {
                sys.sendAll(pids[pidsin], "~~Server~~: Description of the server was changed.");
            }
            return;
        }

        if (message.substr(0, 33) == "The name of the server changed to") {
            servername = message.substring(34, message.lastIndexOf("."));
            if (!motd) {
                cache.write("MOTDMessage", "Enjoy your stay at " + servername + "!");
            }
            return;
        }
    },

    beforeChatMessage: function (src, message, chan) {
        if (chan == undefined || sys.channel(chan) == undefined) {
            sys.stopEvent();
            return "Error: Unknown channel.";
        }

        if (!sys.loggedIn(src)) { /* /future */
            return "Error: Player not online.";
        }

        if (!sys.isInChannel(src, chan)) {
            sys.stopEvent();
            return "Error: Player not in channel.";
        }

        var host = isHost(src),
            poChan = JSESSION.channels(chan),
            poUser = JSESSION.users(src),
            chatcolor = ChatColorRandomizers.has(chan),
            voice = poUser.voice,
            macro = poUser.macro,
            macroX, macroRegExp, macroXNum, myAuth = sys.auth(src);

        if (poUser.floodCount == 'kicked') {
            sys.stopEvent();

            if (sys.loggedIn(src)) {
                kick(src);
            }

            return "Error: Player kicked.";
        }

        for (macroX in macro) {
            macroXNum = 1 + macroX;
            macroRegExp = new RegExp("%m" + macroXNum, "g");
            message = message.replace(macroRegExp, macro[macroX]);
        }

        delete macroX, macroRegExp, macroXNum;

        if (sys.auth(src) < 3) {
            script.hostAuth(src);
        }

        var getColor = script.namecolor(src),
            channel = chan,
            ip = sys.ip(src),
            srcname = sys.name(src);

        poUser.addFlood();

        if ((AutoMute || AutoKick) && poUser.floodCount >= 8) {
            sys.stopEvent();
            poUser.floodCount = 'kicked';

            var spammersHash = DataHash.spammers,
                tempbanHash = DataHash.tempbans;

            if (!spammersHash.has(ip)) {
                spammersHash[ip] = 0;
            }

            var spammers = spammersHash[ip];
            spammers += 1;

            if (spammers >= 5 && !tempbanHash.has(ip)) {
                var bantime = stringToTime('d', 5),
                    thetime = sys.time() * 1 + bantime;


                tempbanHash.insert(ip, {
                    "by": Bot.bot + "</i>",
                    "why": "Spamming the chat.",
                    "ip": ip,
                    "time": thetime
                });

                botAll(srcname + " was banned for 5 days by " + Bot.bot + "</i> for spamming.", 0);

                cache.write("tempbans", JSON.stringify(tempbansHash));
                delete spammersHash[ip];

                kick(src);
                return;
            }

            if (spammers >= 3 && spammers < 5 && !tempbansHash.has(ip)) {
                var bantime = stringToTime('h', 5),
                    thetime = sys.time() * 1 + bantime;

                tempbansHash.insert(ip, {
                    "by": Bot.bot + "</i>",
                    "why": "Spamming the chat.",
                    "ip": ip,
                    "time": thetime
                })

                botAll(srcname + " was banned for 5 hours by " + Bot.bot + "</i> for spamming.", 0);

                cache.write("tempbans", JSON.stringify(DataHash.tempbans));

                kick(src);
                return;
            }

            var mute = "",
                kick = "";
            if (spammers != 1 && !poUser.muted && AutoMute) {
                mute = " and muted for 5 minutes";
            }
            if (AutoKick) {
                if (spammers == 1) {
                    kick = "disconnected";
                } else {
                    kick = "kicked";
                }
            }

            botAll(srcname + " was " + kick + mute + " for flood!", 0);

            sys.callLater('if(DataHash.spammers[' + ip + '] > 0) { DataHash.spammers[' + ip + ']--; }; else { delete DataHash.spammers[' + ip + ']; };', 60 * 60 * 2.5);

            if (spammers != 1 && AutoMute) {
                var bantime = stringToTime('m', 5),
                    mutesHash = DataHash.mutes;
                if (mutesHash.has(ip)) {
                    if (mutesHash[ip].time >= thetime) {
                        bantime += mutesHash.time;
                    }
                }

                var thetime = sys.time() * 1 + bantime;

                mutesHash.insert(ip, {
                    "by": Bot.bot + "</i>",
                    "why": "Spamming the chat.",
                    "ip": ip,
                    "time": thetime
                });

                cache.write("mutes", JSON.stringify(DataHash.mutes));
            }

            if (AutoKick) {
                if (spammers == 1) {
                    disconnectAll(src);
                } else {
                    kick(src);
                }
            }

            return;
        }

        if (poUser.isAutoAFK) {
            var ctime = sys.time() * 1;
            if (ctime - poUser.autoAFKTime > 15) {
                if (sys.away(src)) {
                    botMessage(src, "Welcome back, " + player(src) + "!", chan);
                    sys.changeAway(src, false);
                }
                poUser.isAutoAFK = false;
            }
        }

        var msg = message.toLowerCase(),
            s = removespaces(msg);

        if (s.contains("bbl") || s.contains("brb") || s.contains("berightback") || s.contains("bebacklater") || s.contains("afk") || s.contains("bbs") || s.contains("bebacksoon")) {
            if (!sys.away(src) && !poUser.isAutoAFK) {
                sys.changeAway(src, true);
                poUser.isAutoAFK = true;
                poUser.autoAFKTime = sys.time() * 1;
                botMessage(src, "We hope you come back soon, " + player(src) + "!", chan);
            }
        }

        if (message.length > MaxMessageLength && myAuth < 2) {
            var tooMuch = message.length - MaxMessageLength;
            botMessage(src, "You have " + tooMuch + " more characters than allowed.", chan);
            WatchPlayer(src, "Large Message", message, chan);
            sys.stopEvent();
            return;
        }

        if (myAuth <= 0 && silence.level == 1 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Silence Message", message, chan);
            return;
        }

        if (!poChan.isChanMod(src) && poChan.silence == 1 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Channel Silence Message", message, chan);
            return;
        }

        if (myAuth < 2 && silence.level == 2 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Silence Message", message, chan);
            return;
        }

        if (!poChan.isChanAdmin(src) && poChan.silence == 2 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Channel Silence Message", message, chan);
            return;
        }

        if (myAuth < 3 && silence.level == 3 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Silence Message", message, chan);
            return;
        }

        if (!poChan.isChanOwner(src) && poChan.silence == 3 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Channel Silence Message", message, chan);
            return;
        }

        if (poUser.muted && !host) {
            Prune.mutes();
            if (!DataHash.mutes.has(ip)) {
                botMessage(src, "You are no longer muted.", chan);
            }
            else {
                sys.stopEvent();
                WatchPlayer(src, "Mute Message", message, chan);

                var mute = DataHash.mutes[ip],
                    time;

                if (mute.time != 0) {
                    time = "Muted for " + getTimeString(mute.time - sys.time() * 1);
                } else {
                    time = "Muted forever";
                }

                var by = mute.by + "</i>",
                    why = mute.why,
                    lastChar = why[why.length - 1],
                    lastChars = [".", "?", "!"];

                if (lastChars.indexOf(lastChar) == -1) {
                    why += ".";
                }

                botMessage(src, "You are muted by " + by + ". Reason: " + why + " " + time + ".", chan);
                return;
            }
        }

        if (poChan.isMutedInChannel(ip) && !host && !isRules) {
            Prune.channelMutes(chan);
            if (!poChan.isMutedInChannel(ip)) {
                botMessage(src, "You are no longer muted in " + sys.channel(chan) + ".", chan);
            }
            else {
                sys.stopEvent();
                WatchPlayer(src, "Channel Mute Message", message, chan);

                var mute = poChan.mutelist[ip],
                    time;

                if (mute.time != 0) {
                    time = "Muted for " + getTimeString(mute.time - sys.time() * 1);
                } else {
                    time = "Muted forever";
                }

                var by = mute.by + "</i>",
                    why = mute.why,
                    lastChar = why[why.length - 1],
                    lastChars = [".", "?", "!"];

                if (lastChars.indexOf(lastChar) == -1) {
                    why += ".";
                }

                botMessage(src, "You are muted in " + sys.channel(chan) + " by " + by + ". Reason: " + why + " " + time + ".", chan);
                return;
            }
        }

        if (UseIcons) {
            var rankico = '';
            if (!isEmpty(poUser.icon)) {
                rankico = poUser.icon;
            }
            else if (myAuth === 3) {
                rankico = Icons.Owner;
            }
            else if (myAuth === 2) {
                rankico = Icons.Admin;
            }
            else if (myAuth === 1) {
                rankico = Icons.Mod;
            }
            else {
                rankico = Icons.User;
            }
        }

        if (MessageEditor && !hasCommandStart(message)) {
            if (message.length > 2) {
                message = message[0].toUpperCase() + message.substring(1);
            }
            if (message.length > 3) {
                var lastmsg = message.charAt(message.length - 1);
                if (/[a-zA-Z]/.test(lastmsg)) {
                    message += '.';
                }
            }
        }

        if (UseIcons) {
            var namestr = '<font color=' + script.namecolor(src) + '><timestamp/><b>' + rankico + html_escape(srcname) + ':</font></b> ' + format(src, html_escape(message));
        }

        if (chatcolor) {
            var msg;
            if (UseIcons) {
                msg = format(src, html_escape(message));
            } else {
                msg = html_escape(message);
            }

            var rankicon = "";
            if (rankico !== undefined) {
                rankicon = rankico;
            } else {
                if (myAuth > 0 && myAuth < 4) {
                    rankicon = "+<i>";
                }
            }

            var fnt = RandFont(),
                namestr = '<font color=' + script.namecolor(src) + ' face="' + fnt + '"><timestamp/><b>' + rankicon + html_escape(srcname) + ':</font></b></i> <font face="' + fnt + '">' + msg;
        }

        if (hasCommandStart(message) && message.length > 1 && !ignoreCommandStart(message)) {
            sys.stopEvent();

            var channel = chan,
                command, commandData = "",
                mcmd = [""],
                tar = undefined,
                cmdData = "",
                dbIp = 0,
                dbAuth = 0,
                pos = message.indexOf(' '),
                fullCommand = "";

            if (pos != -1) {
                fullCommand = message.substring(1, pos);
                command = fullCommand.toLowerCase();

                commandData = message.substr(pos + 1);
                cmdData = commandData.toLowerCase();
                mcmd = commandData.split(':');
                dbIp = sys.dbIp(mcmd[0]);
                dbAuth = sys.dbAuth(mcmd[0]);
                tar = sys.id(mcmd[0]);
            }
            else {
                fullCommand = message.substring(1);
                command = fullCommand.toLowerCase();
            }

            if (typeof PointerCommands != 'undefined') {
                if (command in PointerCommands) {
                    command = PointerCommands[command];
                }
            }

            if (command != "sendmail") {
                WatchPlayer(src, "Command", message, chan);
            }

            poTar = JSESSION.users(tar);

            if (chan == mafiachan) {
                try {
                    mafia.handleCommand(src, message.substr(1));
                    return;
                }
                catch (err) {
                    if (err != "no valid command") {
                        botEscapeAll(FormatError("A mafia error has occured.", err), mafiachan);

                        mafia.endGame(0);
                        if (mafia.theme.name != "default") {
                            mafia.themeManager.disable(0, mafia.theme.name);
                        }

                        return;
                    }
                }
            }

            var userCommands, tourCommands, channelCommands, modCommands, adminCommands, ownerCommands, founderCommands;

            userCommands = ({
                commands: function () {
                    var ct = new Command_Templater('Commands');
                    ct.register("help", "Displays a list of helpful topics.");
                    ct.register(removespaces(UserName).toLowerCase() + "commands", "Displays the " + UserName + " commands.");
                    ct.register("messagecommands", "Displays the Messaging commands.");
                    ct.register("stylecommands", "Displays the Style commands.");
                    ct.register("iconcommands", "Displays the Rank Icon commands.");
                    ct.register("channelcommands", "Displays the Channel commands.");
                    if (poChan.toursEnabled) {
                        ct.register("tourcommands", "Displays the Tournament commands.");
                    }

                    /*ct.register("triviacommands", "Displays the Trivia commands.");*/

                    if (permission(src, 1)) {
                        ct.register(removespaces(ModName).toLowerCase() + "commands", "Displays the " + ModName + " commands.");
                    }

                    if (permission(src, 2)) {
                        ct.register(removespaces(AdminName).toLowerCase() + "commands", "Displays the " + AdminName + " commands.");
                    }

                    if (permission(src, 3)) {
                        ct.register(removespaces(OwnerName).toLowerCase() + "commands", "Displays the " + OwnerName + " commands.");
                    }

                    ct.render(src, chan);
                },

                funcommands: function () {
                    var ct = new Command_Templater('Fun Commands', true);

                    ct.span("Fun " + UserName + " Commands");

                    ct.register("roulette", "To win a randon Pokémon.");
                    ct.register("catch", "To catch a random Pokémon.");
                    ct.register("attack", ["{Text::Any Player}", "{Text::Any <u>Attack</u>}"], "To attack {Text::Any Player} with a (random) attack! Attack is optional and has to be an attacking move.");
                    ct.register("future", ["{Text::Number Time}", "{Text::Any Message}"], "To send {Text::Any Message} {Text::Number Time} seconds into the future. {Text::Number Time} must be over 4 seconds and under 5 hours. {Text::Any Message} can also be a command (with a proper command start).");

                    if (permission(src, 2)) {
                        ct.span("Fun " + AdminName + " Commands");
                        ct.register("ify", ["{Text::Any Name}"], "To change the name of everyone on the server to {Text::Any Name}. Changes names of those who change team and login as well.");
                        ct.register("unify", "To change everyones name back.");
                    }

                    ct.render(src, chan);
                },

                stylecommands: function () {
                    var ct = new Command_Templater('Style Commands', true);
                    ct.span("Style " + UserName + " Commands");
                    ct.register("styles", "Displays all currently installed styles.");

                    if (permission(src, 2)) {
                        ct.span("Style " + AdminName + " Commands");
                        ct.register("activestyle", ["{Text::Any Style}"], "Makes the style, {Text::Any Style} active.");
                    }

                    ct.render(src, chan);
                },

                iconcommands: function () {
                    var ct = new Command_Templater('Icon Commands', true);

                    ct.span("Icon " + UserName + " Commands");
                    ct.register("icons", "Displays all currently installed rank icon packs.");
                    ct.register("changeicon", ["{Text::Any Rank Icon}"], "Changes your rank icon to {Text::Any Rank Icon}. If {Text::Any Rank Icon} is remove, your custom rank icon will be removed.");

                    if (permission(src, 2)) {
                        ct.span("Icon " + AdminName + " Commands");
                        ct.register("activeicons", ["{Text::Any Rank Icons}"], "Makes the rank icon set, {Text::Any Rank Icons} active.");
                    }

                    ct.render(src, chan);
                },

/*triviacommands: function () {
                    var ct = new Command_Templater('Trivia Commands', true);
                    
                    ct.span("Trivia " + UserName + " Commands");

                    ct.render(src, chan);
                },*/

                messagecommands: function () {
                    var ct = new Command_Templater('Messaging Commands', true);

                    ct.span("Messaging " + UserName + " Commands");
                    ct.register("me", ["{Text::Any Message}"], "To send {Text::Any Message} as <i><b><font color='" + script.namecolor(src) + "'>*** " + sys.name(src) + " {Text::Any Message}</font></b></i>. BB code is allowed.");

                    if (permission(src, 1)) {
                        ct.span("Messaging " + ModName + " Commands");
                        ct.register("htmlme", ["{Text::Any Message}"], "Send {Text::Any Message} in the same way as <b>me</b>, except that HTML is allowed and BB code is not.");
                        ct.register("send", ["{Text::Any Message}"], "To send {Text::Any Message} to everyone in this channel.");
                        ct.register("wall", ["{Text::Any Message}"], "To announce {Text::Any Message} in every channel. BB code is allowed.");
                        ct.register("htmlwall", ["{Text::Any Message}"], "To announce {Text::Any Message} in every channel. HTML is allowed.");
                    }

                    if (host) {
                        ct.span("Messaging Founder Commands");
                        ct.register("sudo", ["{Player::Online Player}", "{Text::Any Channel Name}", "{Text::Any Message}"], "To make {Player::Online Player} say {Text::Any Message} in {Text::Any Channel Name}. Can be commands etc. too.");
                    }

                    ct.render(src, chan);
                },

                mailcommands: function () {
                    var ct = new Command_Templater('Mail Commands');

                    ct.register('sendmail', ["{Player::Database Player}", "{Text::Any Title}", "{Text::Any Content}"], "To send a mail with {Text::Any Title} as title and {Text::Any Content} as content to {Player::Database Player}. {Text::Any Title} and {Text::Any Content} may contain BB code.", chan);
                    ct.register('readmail', 'To see your mail.');
                    ct.register('sentmails', 'To see your sent mails box.');
                    ct.register('deletemail', 'To delete your mail.');
                    ct.register('deletesent', 'To delete your sent mails box.');

                    ct.render(src, chan);
                },

                infocommands: function () {
                    var ct = new Command_Templater('Information Commands');

                    ct.register('team', 'Makes an importable of your team.');

                    if (!Config.NoCrash) {
                        ct.register("ranking", ["{Player::Online <u>Name</u>}"], "Displays ranking of you or {Player::Online Name}. Your ladder (and the player's if given) must be enabled.");
                    }

                    ct.register('players', 'Displays information about all online players.');
                    ct.register('channels', 'Displays information about online channels.');
                    ct.register("tours", "Displays information about active tours.");

                    ct.register("authlist", "Displays the list of server authority.");
                    ct.register("tourauthlist", "Displays the list of server tournament authority.");

                    ct.register("autoidles", "Displays the list of people who automatically idle.");
                    ct.register("voices", "Displays the list of voices.");

                    ct.register("rules", "Displays the list of rules.");

                    ct.register("league", "Displays the list of league members (Gym Leaders, Elite Four, Champion).");
                    ct.register("scriptinfo", "Displays script information (including links).");

                    ct.register("settings", 'Displays a list of script settings and their values.');

                    ct.register("battlepoints", ["{Player::Database <u>Player</u>}"], "Displays your or {Player::Database <u>Player</u>}'s battle points.");

                    ct.register("viewmotd", 'Displays the Message of the Day');

                    ct.register("pokedex", ["{Text::Any Pokemon}</b>/<b>{Text::Number Pokenum}</b>"], "Displays the pokedex information of {Text::Any Pokemon} or {Text::Number Pokenum}.");

                    ct.register("commandstats", ["{Text::Number X}"], 'Displays server-wide command usage statistics. You can also view the most {Text::Number X} used commands.');

                    ct.register("bbcodes", "Displays a list of BB codes that you can use.");

                    ct.render(src, chan);
                },

                /* -- User Templates: Normal -- */
                help: function () {
                    if (cmdData == "arguments") {
                        var arg = function (c, m) {
                            return "<font color=" + c + "><b>" + c + "</b></font> colored arguments: " + m + ".";
                        },
                            t = new Templater("Help - Arguments");

                        t.register("Arguments are used in <b>almost every</b> command list.");
                        t.register("Here are their descriptions:<br/>");

                        t.register(arg("red", "Specify an online player"));
                        t.register(arg("orangered", "Specify an online player or one in the players database"));
                        t.register(arg("orange", "Specify a number"));
                        t.register(arg("purple", "Specify some text"));
                        t.register(arg("blue", "Select one of the given choices"));
                        t.register(arg("blueviolet", "Specify a time unit that starts with the following: s (second), m (minute), h (hour), d (day), w (week), mo (month), y (year), de (decade). The default is minutes if none specified"));
                        t.register(arg("green", "Specify a player in the channels tournament") + "<br/>");
                        t.register("Any argument with an <u>underline</u> is optional.");

                        t.render(src, chan);
                        return;
                    }

                    // Default
                    var t = new Templater("Help");

                    t.register("<b>The following help topics are available:</b><br/>");
                    t.register("- <b>arguments</b>: Help for command arguments.");

                    t.render(src, chan);
                },

                bbcodes: function () {
                    var formatBB = function (m) {
                        return "• " + m + " <b>-</b> " + format(0, m)
                    },
                        formatEvalBB = function (m, code) {
                            return "• " + m + " <b>-</b> " + eval(code);
                        },
                        t = new Templater('BB Codes');

                    t.register(formatBB("[b]Bold[/b]"))
                    t.register(formatBB("[i]Italics[/i]"))
                    t.register(formatBB("[s]Strike[/s]"))
                    t.register(formatBB("[u]Underline[/u]"))
                    t.register(formatBB("[sub]Subscript[/sub]"))
                    t.register(formatBB("[sup]Superscript[/sup]"))
                    t.register(formatBB("[code]Code[/code]"))
                    t.register(formatBB("[color=red]Any color[/color]"))
                    t.register(formatBB("[face=arial]Any font[/face] or [font=arial]Any font[/font]"))
                    t.register(formatBB("[spoiler]Spoiler[/spoiler]"))
                    t.register("• [servername]Server Name in bold - " + servername.bold())
                    t.register("• [time]A timestamp - <timestamp/>");

                    if (permission(src, 1)) {
                        t.register(formatBB("[pre]Preformatted text[/pre]"))
                        t.register(formatBB("[size=5]Any size[/size]"))
                        t.register("• [br]Skips a line");
                        t.register("• [hr]Makes a long, solid line - <hr>");
                        t.register("• [ping]Pings everybody");
                    }

                    if (permission(src, 3) && !evallock || host) {
                        t.register(formatEvalBB("[eval]sys.name(src)[/eval]", "sys.name(src)"));
                    }

                    t.render(src, chan);
                },

                pokedex: function () {
                    var formeIndex = commandData.indexOf("-");
                    if (formeIndex != -1) {
                        commandData = commandData.substr(0, formeIndex);
                    }

                    if (sys.pokeNum(commandData) == undefined) {
                        commandData = parseInt(commandData);
                        if (sys.pokemon(commandData) != undefined) {
                            commandData = sys.pokemon(commandData);
                        }
                    }

                    else {
                        commandData = sys.pokemon(sys.pokeNum(commandData)); // Correcting case.
                    }

                    try {
                        pokedex(src, chan, commandData);
                    }
                    catch (e) {
                        var rand = sys.pokemon(sys.rand(1, 650));
                        rands = rand + "'s";
                        if (rand[rand.length - 1] == "s") {
                            rands = rand + "'";
                        }

                        botEscapeMessage(src, "Since the Pokémon " + commandData + " doesn't exist, the Pokédex displayed " + rands + " data instead.", chan);
                        pokedex(src, chan, rand);
                    }
                },

                channels: function () {
                    var channels = sys.channelIds(),
                        x, pl, t = new Templater('Channels');

                    t.register("<i>Information works in the following way:</i> <br><b><font color=blue>Name</font></b> [<font color=green><b>ID</font></b>/<b><font color=blue>NumPlayers of <b><u>Name</u></b></font></b></font></b>]<br>");

                    for (x in channels) {
                        pl = sys.playersOfChannel(channels[x]).length;
                        t.register("<b>" + ChannelLink(sys.channel(channels[x])) + "</b> [<b><font color=green>" + channels[x] + "</b></font>/<b><font color=blue>" + pl + "</font></b>]");
                    }

                    t.register("<br><b><font color=blueviolet>Total Number of Channels:</b></font> " + channels.length);

                    t.render(src, chan);
                },

                players: function () {
                    var members = sys.playerIds().sort(function (a, b) {
                        return sys.auth(b) - sys.auth(a);
                    }),
                        x, name, t = new Templater('Players');

                    for (x in members) {
                        name = sys.name(members[x]);
                        if (name == undefined) {
                            name = "~Unknown~";
                        }

                        t.register(playerInfo(name));
                    }

                    t.register("<br><b><font color=blueviolet>Total Number of Players:</b></font> " + sys.numPlayers());

                    t.render(src, chan);
                },

                tours: function () {
                    var sess, ids = sys.channelIds().sort(function (a, b) {
                        return a - b;
                    }),
                        x, count = 0,
                        mode, prize, round, type, t = new Templater('Tournaments');

                    t.register("<i>Information works in the following way:</i> <br><b>Channel</b> Status Type [<font color=green><b>Number of Entrants</b></font>/<font color=blue><b>Round</b></font>/<font color=red><b>Number of Players Remaining</b></font>/<font color=purple><b>Prize</b></font>]<br>");

                    for (x in ids) {
                        sess = JSESSION.channels(ids[x]);

                        if (!sess.toursEnabled) {
                            continue;
                        }

                        sess = sess.tour;

                        if (sess.tourmode == 0) {
                            continue;
                        }

                        if (sess.remaining == undefined) {
                            sess.remaining = "Unknown";
                        }

                        mode = "Running";
                        if (sess.tourmode == 1) {
                            mode = "In Signups";
                        }

                        prize = sess.prize;
                        if (isEmpty(sess.prize)) {
                            prize = "None";
                        }

                        round = "1";
                        if (sess.roundnumber) {
                            round = sess.roundnumber;
                        }

                        type = sess.identify();
                        t.register(ChannelLink(sys.channel(ids[x])).bold() + " " + mode + " " + type + " [<font color=green><b>" + sess.tournumber + "</b></font>/<font color=blue><b>" + round + "</b></font>/<b><font color=blue>" + sess.remaining + "</font></b>/<font color=purple><b>" + prize + "</b></font>]");
                        count++;
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of Tournaments:</b></font> " + count);

                    t.render(src, chan);
                },

                league: function () {
                    var t = new Templater('League');

                    t.span('Gym Leaders');

                    var id, get, online, league = DataHash.league,
                        cha = league.Champion,
                        gyms0 = true,
                        elite0 = true,
                        x;

                    if (!league.gym.isEmpty()) {
                        league.gym = sortHash(league.gym);
                        gyms0 = false;
                    }

                    if (!league.elite.isEmpty()) {
                        league.elite = sortHash(league.elite);
                        elite0 = false;
                    }

                    for (x in league.gym) {
                        t.register("<b>" + x + "</b>. " + playerInfo(league.gym[x]));
                    }

                    if (!gyms0) {
                        t.register("");
                    }

                    t.span("Elite Four");

                    for (x in league.elite) {
                        t.register("<b>" + x + "</b>. " + playerInfo(league.elite[x]));
                    }

                    if (!elite0) {
                        t.register("");
                    }

                    t.span("Champion");

                    if (!isEmpty(cha)) {
                        t.register(playerInfo(cha));
                    }

                    t.render(src, chan);
                },

                scriptinfo: function () {
                    var user = userCommands.keys().sort(),
                        channel = channelCommands.keys().sort(),
                        tour = tourCommands.keys().sort(),
                        mod = modCommands.keys().sort(),
                        admin = adminCommands.keys().sort(),
                        owner = ownerCommands.keys().sort(),
                        userlength = user.length,
                        chanlength = channel.length,
                        tourlength = tour.length,
                        modlength = mod.length,
                        adminlength = admin.length,
                        ownerlength = owner.length,
                        t = new Templater('Script Information');

                    t.register("Script Version: " + Version.bold());
                    t.register("Server Version: " + sys.serverVersion().bold() + "<br/>");

                    t.register("<font size=5><b>Commands</b></font><br/>");

                    t.register("<font size=4 color=green><b>" + UserName + " Commands</b></font>");
                    t.register("<small>" + user.join(", ") + ".</small>");
                    t.register("<b><font color=green>User Commands Total:</font></b> " + userlength + "<br/>");

                    t.register("<font size=4 color=purple><b>Channel Commands</b></font>");
                    t.register("<small>" + channel.join(", ") + ".</small>");
                    t.register("<b><font color=purple>Channel Commands Total:</font></b> " + chanlength + "<br/>");

                    t.register("<font size=4 color=darkred><b>Tournament Commands</b></font>");
                    t.register("<small>" + tour.join(", ") + ".</small>");
                    t.register("<b><font color=darkred>Tournament Commands Total:</font></b> " + tourlength + "<br/>");

                    t.register("<font size=4 color=blue><b>" + ModName + " Commands</b></font>");
                    t.register("<small>" + mod.join(", ") + ".</small>");
                    t.register("<b><font color=blue>Moderator Commands Total:</font></b> " + modlength + "<br/>");

                    t.register("<font size=4 color=orange><b>" + AdminName + " Commands</b></font>");
                    t.register("<small>" + admin.join(", ") + ".</small>");
                    t.register("<b><font color=orange>Administrator Commands Total:</font></b> " + adminlength + "<br/>");

                    t.register("<font size=4 color=red><b>" + OwnerName + " Commands</b></font>");
                    t.register("<small>" + owner.join(", ") + ".</small>");
                    t.register("<b><font color=red>Owner Commands Total:</font></b> " + ownerlength + "<br/>");

                    var cmdtotal = ownerlength + tourlength + modlength + adminlength + userlength + chanlength * 1;

                    t.register("<font color=blueviolet><b>Commands Total:</font></b> " + cmdtotal + "<br/>");

                    var objvar = [],
                        boolvar = [],
                        strvar = [],
                        numvar = [],
                        funvar = [],
                        nullvar = [],
                        arrvar = [],
                        thisObj = this,
                        vars = Object.getOwnPropertyNames(thisObj),
                        thisObjArr = [],
                        i, toO, thisObjCur, y;

                    for (i in vars) {
                        thisObjCur = thisObj[vars[i]];
                        toO = typeof thisObjCur;
                        if (Array.isArray(thisObjCur)) {
                            toO = "array";
                        }
                        else if (toO === null) {
                            toO = "undefined";
                        }

                        else if (thisObjCur instanceof Object && toO !== "function") {
                            toO = "object";
                        }

                        thisObjArr.push(toO);
                    }

                    for (i in vars) {
                        y = thisObjArr[i];
                        i = vars[i];

                        if (y === "boolean") {
                            boolvar.push(i);
                        }
                        else if (y === "number") {
                            numvar.push(i);
                        }
                        else if (y === "string") {
                            strvar.push(i);
                        }
                        else if (y == "object") {
                            objvar.push(i);
                        }
                        else if (y === "function") {
                            funvar.push(i);
                        }
                        else if (y == "array") {
                            arrvar.push(i);
                        }
                        else {
                            nullvar.push(i);
                        }
                    }

                    strvar.sort();
                    numvar.sort();
                    boolvar.sort();
                    arrvar.sort();
                    objvar.sort();
                    funvar.sort();
                    nullvar.sort();

                    t.register("<font size=5><b>Global Variables</b></font><br>");

                    if (strvar.length !== 0) {
                        t.register("<font size=4 color=red><b>String Variables</b></font>");

                        var stringStr = "<font size=2>" + strvar.join(", ") + ".</font>";

                        t.register(stringStr);
                        t.register("<b><font color=red>String Variables Total:</font></b> " + strvar.length + "<br>");
                    }

                    if (numvar.length !== 0) {
                        t.register("<font size=4 color=blue><b>Number Variables</b></font>");

                        var numberString = "<font size=2>" + numvar.join(", ") + ".</font>";

                        t.register(numberString);
                        t.register("<b><font color=blue>Number Variables Total:</font></b> " + numvar.length + "<br>");
                    }

                    if (boolvar.length !== 0) {
                        t.register("<font size=4 color=purple><b>Boolean Variables</b></font>");

                        var booleanString = "<font size=2>" + boolvar.join(", ") + ".</font>";

                        t.register(booleanString);
                        t.register("<b><font color=purple>Boolean Variables Total:</font></b> " + boolvar.length + "<br>");
                    }

                    if (arrvar.length !== 0) {
                        t.register("<font size=4 color=midnightblue><b>Array Variables</b></font>")

                        var arrayString = "<font size=2>" + arrvar.join(", ") + ".</font>";

                        t.register(arrayString);
                        t.register("<b><font color=midnightblue>Array Variables Total:</font></b> " + arrvar.length + "<br>");
                    }

                    if (objvar.length !== 0) {
                        t.register("<font size=4 color=goldenrod><b>Object Variables</b></font>")

                        var objectString = "<font size=2>" + objvar.join(", ") + ".</font>";

                        t.register(objectString);
                        t.register("<b><font color=goldenrod>Object Variables Total:</font></b> " + objvar.length + "<br>");
                    }

                    if (funvar.length !== 0) {
                        t.register("<font size=4 color=green><b>Function Variables</b></font>");

                        var functionString = "<font size=2>" + funvar.join(", ") + ".</font>";

                        t.register(functionString);
                        t.register("<b><font color=green>Function Variables Total:</font></b> " + funvar.length + "<br>");
                    }

                    if (nullvar.length !== 0) {
                        t.register("<font size=4 color=grey><b>Undefined Variables</b></font>");

                        var undefinedVar = "<font size=2>" + nullvar.join(", ") + ".</font>";

                        t.register(undefinedVar);
                        t.register("<b><font color=grey>Undefined Variables Total:</font></b> " + nullvar.length + "<br>");
                    }

                    t.register("<b><font color=blueviolet>Global Variables Total:</b> " + vars.length + "</font><br/>");

                    var scriptKeys = Object.keys(script).sort();
                    var scriptStr = scriptKeys.join(", ");

                    t.register("<font size=5><b>Events</b></font><br/>");
                    t.register("<small>" + scriptStr + ".</small>");
                    t.register("<b><font color=blueviolet>Events Total:</font></b> " + scriptKeys.length + " <br/>");

                    if (!ScriptLength.has("Lines") || !ScriptLength.has("Full")) {
                        var servscript = sys.getFileContent("scripts.js");
                        ScriptLength.Lines = servscript.split("\n").length;
                        ScriptLength.Full = servscript.length;
                    }

                    t.register("<b><font size=4 color=forestgreen>Characters:</b></font> Estimated " + ScriptLength.Full);
                    t.register("<b><font size=4 color=darkblue>Lines:</b></font> " + ScriptLength.Lines + "<br/>");
                    t.register("<font color=green><b>Script:</b></font> © TheUnknownOne: <a href='" + ScriptURL + "'>" + ScriptURL + "</a></font>");

                    t.register("<b>Script Registered Date:</b></font> " + cache.get("Script_Registered"));
                    t.register("<b>Script Last Loaded Date:</b></font> " + cache.get("Script_LastLoad"));

                    t.register("<br/>Created and Maintained by <b>TheUnknownOne</b>.");
                    t.register("Credit to <b>Lutra</b> and <b>Intel_iX</b>.");
                    t.register("Special Thanks to <b>Lamperi</b> and <b>Mystra</b>.");
                    t.register("Styles and Rank Icons created by <b>Lutra</b>, <b>Intel_iX</b>, <b>person6445</b>, <b>Rigas</b>.");
                    t.register("<small>Thanks to the PO Dev Team for making Pokemon Online!</small>");

                    t.render(src, chan);
                },

                settings: function () {
                    var t = new Templater('Script Settings'),
                        g = function (str) {
                            return "<font color='green'><b>" + str + "</b></font>";
                        },
                        r = function (str) {
                            return "<font color='red'><b>" + str + "</b></font>";
                        },
                        check = function (compare, name, on, off) {
                            if (compare) {
                                t.register(name + " " + g(on) + ".");
                            } else {
                                t.register(name + " " + r(off) + ".");
                            }
                        };

                    check(AutoStartTours, "AutoStartTours is", "on", "off");

                    check(MessageEditor, "Grammar Corrector is", "on", "off");
                    check(UseIcons, "Rank Icons and BBCode are", "on", "off");
                    check(ChannelsAllowed, "Channels are", "allowed", "disallowed");

                    check(evallock, "Eval is", "locked", "not locked");

                    check(implock, "Impersonation for " + Grammar.es(UserName) + " is", "blocked", "not blocked");

                    check(CommandsEnabled.me, "Me is", "on", "off");
                    check(CommandsEnabled._catch_, "Catch is", "on", "off");
                    check(CommandsEnabled.roulette, "Roulette is", "on", "off");
                    check(CommandsEnabled.attack, "Attack is", "on", "off");

                    check(AutoKick, "Auto Kick is", "on", "off");
                    check(AutoMute, "Auto Mute is", "on", "off");

                    t.register("Server Auth Level 0 Name is " + UserName.bold().fontcolor("green") + ".");
                    t.register("Server Auth Level 1 Name is " + ModName.bold().fontcolor("blue") + ".");
                    t.register("Server Auth Level 2 Name is " + AdminName.bold().fontcolor("orange") + ".");
                    t.register("Server Auth Level 3 Name is " + OwnerName.bold().fontcolor("red") + ".");
                    t.register("Server Auth Level 4 Name is " + InvisName.bold() + ".<br/>");

                    t.register("Channel Auth Level 0 Name is " + ChanUser.bold().fontcolor("green") + ".");
                    t.register("Channel Auth Level 1 Name is " + ChanMod.bold().fontcolor("blue") + ".");
                    t.register("Channel Auth Level 2 Name is " + ChanAdmin.bold().fontcolor("orange") + ".");
                    t.register("Channel Auth Level 3 Name is " + ChanOwner.bold().fontcolor("red") + ".<br/>");

                    t.register("Tournament Auth Level 0 Name is " + Tour0.bold().fontcolor("limegreen") + ".");
                    t.register("Tournament Auth Level 1 Name is " + Tour1.bold().fontcolor("mediumblue") + ".<br/>");

                    t.register("Channel Tournament Auth Level 0 Name is " + ChanTour0.bold().fontcolor("limegreen") + ".");
                    t.register("Channel Tournament Auth Level 1 Name is " + ChanTour1.bold().fontcolor("mediumblue") + ".<br/>");

                    t.register("Maximum Message Length is " + String(MaxMessageLength).bold() + ".");
                    t.register("Futures allowed every " + String(FutureLimit).bold() + " seconds.<br/>");

                    t.register("The Bot name is " + Bot.bot.bold().fontcolor(Bot.botcolor) + "</i>.");

                    if (ClanTag != "" && ClanTag != "None") {
                        t.register("The Clan tag is " + ClanTag.bold() + ".");
                    }

                    t.render(src, chan);
                },

                rules: function () {
                    var t = new Templater(servername + ' Rules');

                    t.register("<b>1</b>) Do not spam or overuse CAPS. The bots can mute you for it.");
                    t.register("<b>2</b>) Do not flood or spam the chat. The bots can kick you for it.");
                    t.register("<b>3</b>) Do not complain about hax. It's part of the game.");
                    t.register("<b>4</b>) Do not time stall in a battle. 'Time Stalling' means you wait until your opponent forfeits by not making moves. If you are absent for a couple of minutes, say so.");
                    t.register("<b>5</b>) Do not troll. This is very, very annoying. Doing this will get you kicked, muted, or banned, on sight.");
                    t.register("<b>6</b>) Do not flame or insult. People don't like this.");
                    t.register("<b>7</b>) No sexism, racism, or anything similar to it is allowed.");
                    t.register("<b>8</b>) Do not advertise. Links like pictures and videos are Ok when they dont break the other rules.");
                    t.register("<b>9</b>) No obscene, pornographic, or illegal content. This will be an instant ban in most cases.");
                    t.register("<b>10</b>) Do not ask to be auth. Doing this will usually ruin your chances to ever be one.");
                    t.register("<b>11</b>) Do not mini-moderate. Mini-Moderating means you act like a moderator, while your not. Contact an Authority instead.");
                    t.register("<b>12</b>) Do not ban evade. Doing so will result in an instant ban, or rangeban.");
                    t.register("<b>13</b>) Do not blackmail. This will result in an instant mute/ban/rangeban.");

                    t.register("<br/><b>If the server authority think it is necessary to punish someone, then they are allowed to do so. Report them to higher powers if you think you have been abused.</b>");
                    t.register("The server authority <u>do not</u> have to apply these rules.");

                    t.render(src, chan);
                },

                tourauthlist: function () {
                    var authlist = DataHash.megausers,
                        count = authlist.length(),
                        x, t = new Templater(Grammar.es(Tour1));

                    t.register('');

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of " + Grammar.es(Tour1) + ":</font></b> " + count);

                    t.render(src, chan);
                },

                authlist: function () {
                    var authList = sys.dbAuths(),
                        x, c_auth, c_authname, authlists = {
                            'invis': [],
                            'owner': [],
                            'admin': [],
                            'mod': []
                        };

                    for (x in authList) {
                        c_authname = authList[x];
                        c_auth = sys.dbAuth(c_authname);

                        if (c_auth > 3) {
                            authlists.invis.push(c_authname);
                        }
                        else if (c_auth == 3) {
                            authlists.owner.push(c_authname);
                        }
                        else if (c_auth == 2) {
                            authlists.admin.push(c_authname);
                        }
                        else {
                            authlists.mod.push(c_authname);
                        }
                    }

                    authlists.invis.sort();
                    authlists.owner.sort();
                    authlists.admin.sort();
                    authlists.mod.sort();

                    var t = new Templater('Server Authority'),
                        a = authlists,
                        c;

                    if (sys.auth(src) > 2) {
                        c = a.invis;
                        if (c.length != 0) {

                            t.register("<font color=black size=4><b>" + Grammar.es(InvisName) + " (" + c.length + ")</b></font><br/>")

                            for (x in c) {
                                t.register(playerInfo(c[x]));
                            }

                            t.register("");
                        }
                    }

                    c = a.owner;

                    if (c.length != 0) {
                        t.register("<font color=red size=4><b>" + Grammar.es(OwnerName) + " (" + c.length + ")</b></font><br/>");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    c = a.admin;

                    if (c.length != 0) {
                        t.register("<font color=orange size=4><b>" + Grammar.es(AdminName) + " (" + c.length + ")</b></font><br/>");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    c = a.mod;

                    if (c.length != 0) {
                        t.register("<font color=blue size=4><b>" + Grammar.es(ModName) + " (" + c.length + ")</b></font><br/>");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    t.register("<b><font color=blueviolet>Total Number of Authorities:</font></b> " + sendAuthLength(src));

                    t.render(src, chan);
                },

                autoidles: function () {
                    var authlist = DataHash.idles,
                        count = authlist.length(),
                        x;

                    if (count === 0) {
                        botMessage(src, "No one has Auto Idle.", chan);
                        return;
                    }

                    var t = new Templater("Auto Idles");
                    t.register('');

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of Auto Idles:</font></b> " + count);

                    t.render(src, chan);
                },

                voices: function () {
                    var authlist = DataHash.voices,
                        count = authlist.length(),
                        x, t = new Templater("Voices");

                    t.register('');

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of Voices:</font></b> " + count);

                    t.render(src, chan);
                },

                evalops: function () {
                    var authlist = DataHash.evalops,
                        count = authlist.length(),
                        x, t = new Templater("Eval Operators");

                    t.register('');

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of Eval Operators:</font></b> " + count);

                    t.render(src, chan);
                },

                /* -- User Templates: Tables -- */
                ranking: function () {
                    if (!sys.ladderEnabled(src)) {
                        botMessage(src, "You don't have your ladder enabled! Enable it at Options->Enable Ladder.", chan);
                        return;
                    }

                    var r, name = sys.name(src),
                        pid = src,
                        list, ranking, rank, ladd, ladder, total, battles, mess_rank, x, i;

                    if (tar !== undefined) {
                        name = sys.name(tar), pid = tar;
                        if (!sys.ladderEnabled(tar)) {
                            botMessage(src, "That person doesn't have laddering enabled!", chan);
                            return;
                        }
                    }

                    var tt = new Table_Templater("Ranking of " + name, "orange", "3");

                    if (sys.loggedIn(pid) && !Config.NoCrash) {
                        tt.register(["Team #", "Team Tier", "Ranked", "Rating", "Battles"], true);
                        for (i = 0; i < sys.teamCount(pid); i++) {
                            list = sys.tier(src, i);
                            ranking = "unranked";
                            rank = sys.ranking(name, i);

                            if (!isNaN(rank)) {
                                ranking = rank;
                            }

                            ladd = sys.ladderRating(name, i);
                            ladder = "1000";

                            if (ladd != undefined) {
                                ladder = ladd;
                            }

                            total = sys.totalPlayersByTier(list);
                            battles = sys.ratedBattles(name, i);

                            mess_rank = "unranked";
                            if (ranking != "unranked") {
                                mess_rank = ranking + "/" + total;
                            }

                            tt.register([(i + 1), list, mess_rank, ladder, battles], false);
                        }
                    } else {
                        tt.register(["Tier", "Ranked", "Rating", "Battles"], true);
                        var list = sys.getTierList();
                        for (i = 0; i < list.length; i++) {
                            list = list[i];
                            ranking = "unranked";
                            rank = sys.ranking(name, list);

                            if (!isNaN(rank)) {
                                ranking = rank;
                            }

                            ladd = sys.ladderRating(name, list);
                            ladder = "1000";

                            if (ladd != undefined) {
                                ladder = ladd;
                            }

                            total = sys.totalPlayersByTier(list);
                            battles = sys.ratedBattles(name, list);

                            mess_rank = "unranked";
                            if (ranking != "unranked") {
                                mess_rank = ranking + "/" + total;
                            }

                            tt.register([list, mess_rank, ladder, battles], false);
                        }

                    }


                    tt.render(src, chan);
                },

                /* -- User Commands: Idle -- */
                idle: function () {
                    var idle = !sys.away(src),
                        str;

                    if (idle == 1) {
                        str = "You are now idling.";
                    }
                    else {
                        str = "You are now back.";
                    }

                    sys.changeAway(src, idle);
                    botMessage(src, str, chan);
                },

                /* -- User Commands: Future -- */
                future: function () {
                    mcmd[0] = parseInt(mcmd[0]);
                    var isnan = isNaN(mcmd[0]);
                    if (isnan) {
                        botMessage(src, "Specify time!", chan);
                        return;
                    }

                    var msg = mcmd[1] == undefined;
                    if (msg) {
                        botMessage(src, "Specify a message!", chan);
                        return;
                    }

                    if (mcmd[0] < 5 || mcmd[0] > 5 * 60 * 60) {
                        botMessage(src, "The time must be over 5 seconds and be under 5 hours (" + (5 * 60 * 60) + " seconds).", chan);
                        return;
                    }

                    var t = Number(sys.time());
                    if (poUser.lastFuture != 0) {
                        if (poUser.lastFuture > t) {
                            botMessage(src, "Please wait " + getTimeString(poUser.lastFuture - t) + " before using another future.", chan);
                            return;
                        }
                    }

                    poUser.lastFuture = t + FutureLimit;
                    var Message = cut(mcmd, 1, ':');
                    
                    sys.delayedCall(function () {
                        script.beforeChatMessage(src, Message, chan);
                    }, parseInt(mcmd[0]));
                    
                    botMessage(src, "Your message was sent " + getTimeString(mcmd[0]) + " into the future!", chan);
                },

                /* -- User Commands: MOTD -- */
                viewmotd: function () {
                    if (motd) {
                        var MOTDSetter = cache.get("MOTDSetter"),
                            MOTD = cache.get("MOTDMessage");
                        sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day: </b></font>' + MOTD, chan);
                        sys.sendHtmlMessage(src, '<font color=darkred><timestamp/><b>Set By: </b></font>' + MOTDSetter, chan);
                    }
                    else {
                        sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day:</b></font> Enjoy your stay at ' + servername + '!', chan);
                    }
                },

                /* -- User Commands: Ping */
                ping: function () {
                    tar = sys.id(mcmd[0]);
                    if (mcmd[1] == undefined) {
                        tar = sys.id(commandData);
                    }

                    if (tar === undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }

                    var msg = true,
                        me = player(src),
                        target = player(tar);
                    if (isEmpty(mcmd[1])) {
                        mcmd[1] = "", msg = false;
                    }

                    if (unicodeAbuse(src, mcmd[1])) {
                        if (!sys.loggedIn(src)) {
                            return;
                        }
                        botMessage(src, "Ping sent to " + target + "!", chan);
                        return;
                    }

                    botMessage(src, "Ping sent to " + target + "!", chan);
                    if (msg) {
                        mcmd[1] = cut(mcmd, 1, ':');
                        botMessage(tar, me + " has pinged you and sent the following message: " + html_escape(mcmd[1]) + "<ping/>");
                        return;
                    }
                    botMessage(tar, me + " has pinged you!<ping/>");
                },

                /* -- User Commands: Poll */
                vote: function () {
                    if (!Poll.mode) {
                        botMessage(src, "No poll is going on.", chan);
                        return;
                    }
                    var datanum = parseInt(commandData);
                    if (!Poll.options.has(datanum)) {
                        botMessage(src, "Invalid option.", chan);
                        return;
                    }
                    if (Poll.options[datanum].votes.has(ip)) {
                        botMessage(src, "You already voted!", chan);
                        return;
                    }
                    Poll.options[datanum].votes.push(ip);
                    Poll.votes++;
                    botMessage(src, "Voted option " + datanum + " (" + Poll.options[datanum].name + ") on the poll.", chan);
                },

                viewpoll: function () {
                    if (!Poll.mode) {
                        botMessage(src, "No poll is going on.", chan);
                        return;
                    }

                    botMessage(src, "Poll started by " + Poll.starter.bold() + "!", chan);

                    var x, current_votes, option;
                    for (x in Poll.options) {
                        option = Poll.options[x].name;
                        botMessage(src, x + ". " + option, chan)
                    }

                    sys.sendMessage(src, '', chan);

                    if (Poll.votes === 0) {
                        botMessage(src, "No one voted yet.", chan);
                        return;
                    }

                    botMessage(src, Poll.subject + " - Results so far:", chan);

                    for (x in Poll.options) {
                        option = Poll.options[x];
                        current_votes = option.votes;
                        botMessage(src, x + ". " + option.name + " - " + current_votes.length, chan);
                    }
                },

                /* -- User Commands: Macro -- */
                macro: function () {
                    mcmd[1] = cut(mcmd, 1, ':');

                    if (isEmpty(mcmd[1])) {
                        botMessage(src, "Your macros are: " + poUser.macro.join(", "), chan);
                        return;
                    }

                    mcmd[1] = html_escape(mcmd[1]);
                    var num = Math.round(mcmd[0] * 1);
                    if (num > 5 || num < 1) {
                        botMessage(src, "Specify a range of 1-5", chan);
                        return;
                    }

                    poUser.macro[num - 1] = mcmd[1];
                    var toL = sys.name(src).toLowerCase(),
                        macros = DataHash.macros;

                    if (typeof macros[toL] != "object") {
                        macros[toL] = ["%m1", "%m2", "%m3", "%m4", "%m5"];
                    }

                    macros[toL] = poUser.macro;

                    botMessage(src, "You changed macro " + num + " to " + mcmd[1], chan);
                },

                /* -- User Commands: Fun -- */
                "catch": function () {
                    if (!CommandsEnabled._catch_) {
                        botMessage(src, fullCommand + " is turned off!", chan);
                        return;
                    }

                    if (testMafiaChat(src, chan)) {
                        return;
                    }

                    var num = sys.rand(1, 649),
                        pokemon = sys.pokemon(num),
                        nature = sys.nature(sys.rand(1, 24)),
                        rand = sys.rand(30, 531),
                        shiny = sys.rand(30, 531),
                        ivs = [],
                        lvl = sys.rand(1, 101),
                        x;

                    for (x = 0; x <= 6; x++) {
                        ivs.push(sys.rand(0, 32));
                    }

                    if (shiny != rand) {
                        botMessage(src, formatPoke(num, false, false, 0, 5) + " " + formatPoke(num, false, true, 0, 5), chan);
                        botAll(player(src) + " caught a level " + lvl + " " + pokemon + " with a " + nature + " nature!", chan);
                        botMessage(src, pokemon + " has the following IVs:", chan);
                        botMessage(src, "HP: " + ivs[0] + " Atk: " + ivs[1] + " Def: " + ivs[2] + " SpA: " + ivs[3] + " SpD: " + ivs[4] + " Spd: " + ivs[5] + ".", chan);
                    }
                    else {
                        botMessage(formatPoke(num, true, false, 0, 5) + " " + formatPoke(num, true, true, 0, 5), chan);
                        botAll(player(src) + " has caught a level " + lvl + " shiny " + pokemon + " with a " + nature + " nature!", chan);
                        botMessage(src, pokemon + " has the following IVs:", chan);
                        botMessage(src, "HP: " + ivs[0] + " Atk: " + ivs[1] + " Def: " + ivs[2] + " SpA: " + ivs[3] + " SpD: " + ivs[4] + " Spd: " + ivs[5] + ".", chan);
                        botAll("This is truly a rare event", chan);
                    }
                },

                attack: function () {
                    if (!CommandsEnabled.attack) {
                        botMessage(src, fullCommand + " is turned off.", chan);
                        return;
                    }
                    if (testMafiaChat(src, chan)) {
                        return;
                    }
                    if (poUser.capsMute(commandData, chan)) { // Combine both.
                        return;
                    }

                    if (commandData.length > 25) {
                        botMessage(src, "The persons name must be under 26 characters.", chan);
                        return;
                    }

                    if (typeof AttackingMoves == "undefined") {
                        AttackingMoves = [];
                        var file = sys.getFileContent("db/moves/5G/damage_class.txt").split("\n"),
                            arr = AttackingMoves,
                            x;

                        for (x in file) {
                            if (file[x] == "0 0") {
                                continue;
                            }

                            arr.push(Number(file[x].split(" ")[0]));
                        }
                    }

                    var attack = sys.move(AttackingMoves[Math.floor(AttackingMoves.length * Math.random())]),
                        movenum = sys.moveNum(mcmd[1]);
                    if (AttackingMoves.has(movenum)) {
                        attack = sys.move(movenum); // Corrects case.
                    }


                    if (unicodeAbuse(src, commandData)) {
                        return;
                    }

                    botAll(player(src) + " used " + attack + " on " + player(mcmd[0]) + "!", chan);
                },

                roulette: function () {
                    if (!CommandsEnabled.roulette) {
                        botMessage(src, fullCommand + " is turned off.", chan);
                        return;
                    }
                    if (testMafiaChat(src, message)) {
                        return;
                    }

                    var randpoke = sys.rand(1, 494),
                        rand = sys.rand(1, 4),
                        poke, shine;

                    if (rand == 1 || rand == 3) {
                        poke = formatPoke(randpoke, false, false, false, 5, true)
                        shine = "";
                    }
                    else {
                        poke = formatPoke(randpoke, true, false, false, 5, true)
                        shine = "Shiny ";
                    }

                    var shiny = an(shine + sys.pokemon(randpoke)) + "!";

                    botMessage(src, "You got a " + shiny + " " + poke, chan);
                    botAllExcept(src, player(src) + " got a " + shiny, chan, botAllExcept.Normal);
                },

                /* -- User Commands: CommandStats */
                commandstats: function () {
                    var num = Number(commandData);
                    if (num > objLength(CommandStats.stats.commands)) {
                        CommandStats.display(src, chan, Number(commandData));
                    }
                },

                /* -- User Commands: Mail */
                sendmail: function () {
                    if (dbIp == undefined) {
                        botMessage(src, "This person doesn't exist!", chan);
                        return;
                    }

                    if (isEmpty(mcmd[1])) {
                        botMessage(src, "Specify a title!", chan);
                        return;
                    }

                    if (isEmpty(mcmd[2])) {
                        botMessage(src, "Specify text!", chan);
                        return;
                    }

                    if (typeof(DataHash.mail[mcmd[0].toLowerCase()]) == "undefined") {
                        DataHash.mail[mcmd[0].toLowerCase()] = [];
                    }

                    if (typeof(DataHash.mail["SENT_" + sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                    }

                    result = cut(mcmd, 2, ':');

                    DataHash.mail[mcmd[0].toLowerCase()].push(new Mail(sys.name(src), result, mcmd[1]));
                    DataHash.mail["SENT_" + sys.name(src).toLowerCase()].push(new Mail(mcmd[0], result, mcmd[1]));

                    botMessage(src, "Mail sent! A copy of the mail was also sent to your sent mails box. Type /sentmails to view.", chan);

                    if (tar != undefined) {
                        botMessage(tar, "You got mail from " + player(src) + "! Type /readmail to view .<ping/>", 0);
                    }

                    cache.write("mail", JSON.stringify(DataHash.mail));
                },
                sentmails: function () {
                    if (typeof(DataHash.mail["SENT_" + sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (DataHash.mail["SENT_" + sys.name(src).toLowerCase()].length < 1) {
                        botMessage(src, "You don't have any sent mails!", chan);
                        return;
                    }

                    botMessage(src, "Here are your sent mails:", chan);

                    var read = "",
                        y, mail = DataHash.mail["SENT_" + sys.name(src).toLowerCase()];

                    var arr = [];
                    for (y in mail) {
                        var m = mail[y];
                        arr.push("<b>" + format("lvl0", html_escape(m.title)) + "</b>: Sent to " + m.sender + " on " + m.sendtime + " (" + getTimeString(sys.time() * 1 - m.sendAgo) + " ago)", "<i>" + format("lvl0", html_escape(m.text)) + "</i>");
                    }

                    arr.push('');
                    sys.sendHtmlMessage(src, arr.join("<br/>"), chan);
                },
                deletesent: function () {
                    if (typeof(DataHash.mail["SENT_" + sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (DataHash.mail["SENT_" + sys.name(src).toLowerCase()].length < 1) {
                        botMessage(src, "You don't have any sent mails!", chan);
                        return;
                    }

                    DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                    botMessage(src, "Sent Mail deleted!", chan);
                    cache.write("mail", JSON.stringify(DataHash.mail));
                },
                readmail: function () {
                    if (typeof(DataHash.mail[sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail[sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (typeof(DataHash.mail["SENT_" + sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (DataHash.mail[sys.name(src).toLowerCase()].length < 1) {
                        botMessage(src, "You don't have any mail!", chan);
                        return;
                    }

                    botMessage(src, "Here is your mail:", chan);

                    var arr = [];
                    var read = "",
                        y, mail = DataHash.mail[sys.name(src).toLowerCase()],
                        save = false;
                    var time = sys.time() * 1;

                    for (y in mail) {
                        var m = mail[y];
                        read = "[<b><font color=blue>Old</font></b>]";

                        if (!m.read) {
                            read = "[<b><font color=red>New</font></b>]";
                            m.read = true;
                            save = true;
                        }

                        arr.push(
                        read + " <b>" + format("lvl0", html_escape(m.title)) + "</b>: Sent by " + m.sender + " on " + m.sendtime + " (" + getTimeString(time - m.sendAgo) + " ago)", "<i>" + format("lvl0", html_escape(m.text)) + "</i>");
                    }

                    if (save) {
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    arr.push('');
                    sys.sendHtmlMessage(src, arr.join("<br>"), chan);
                },
                deletemail: function () {
                    if (typeof(DataHash.mail[sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail[sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (DataHash.mail[sys.name(src).toLowerCase()].length < 1) {
                        botMessage(src, "You don't have any mail!", chan);
                        return;
                    }

                    DataHash.mail[sys.name(src).toLowerCase()] = [];
                    botMessage(src, "Mail deleted!", chan);
                    cache.write("mail", JSON.stringify(DataHash.mail));
                },

                /* -- User Commands: Rank Icons */
                changeicon: function () {
                    if (isEmpty(commandData)) {
                        botMessage(src, "Specify an icon!", chan);
                        return;
                    }
                    var resets = ['reset', 'remove', 'delete', 'off'];

                    if (resets.has(cmdData) && DataHash.rankicons.has(sys.name(src).toLowerCase())) {
                        botMessage(src, "Removed rank icon.", chan);

                        poUser.icon = "";
                        delete DataHash.rankicons[sys.name(src).toLowerCase()];

                        cache.write("rankicons", JSON.stringify(DataHash.rankicons));
                        return;
                    }

                    if (commandData.length != 1) {
                        botMessage(src, "You can only specify one character for your rank icon!", chan);
                        return;
                    }

                    if (commandData == "<" && (sys.auth(src) < 4 && Config.HighPermission[sys.name(src)] !== undefined && Config.HighPermission[sys.name(src)][1] !== 3)) {
                        botMessage(src, "Can't pick this icon!", chan);
                        return;
                    }

                    poUser.icon = commandData;
                    DataHash.rankicons[sys.name(src).toLowerCase()] = commandData;
                    cache.write("rankicons", JSON.stringify(DataHash.rankicons));

                    botMessage(src, "Rank icon changed to " + commandData + "!", chan);
                },

                icons: function () {
                    IconManager.iconInfo(src, chan);
                },

                /* -- User Commands: Register */
                unregister: function () {
                    var name = sys.name(src);
                    if (!sys.dbRegistered(name)) {
                        botMessage(src, "You can't unregister an alias which is not registered!", chan);
                        return;
                    }
                    sys.clearPass(name);
                    botMessage(src, "Your password was succesfully cleared!", chan);
                    sys.sendNetworkCommand(src, 14);
                    if (sys.auth(src) > 0) {
                        sendAuth(name + " cleared their password!");
                        botMessage(src, "Please register again (before logging out)! This is for the safety of the server!", chan);
                    }
                },

                /* -- User Commands: Styles */
                styles: function () {
                    StyleManager.styleInfo(src, chan);
                },

                /* -- User Commands: Trivia */
/*
                a: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.a(src, commandData);
                },
                submit: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.submit(src, mcmd);
                },
                leaderboard: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.leaderboardDisplay(src, commandData);
                },
                questions: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.questionList(src, commandData);
                },
                question: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.viewQuestion(src, commandData);
                },
				*/

                /* -- User Commands: Messaging */
                me: function () {
                    if (!CommandsEnabled.me) {
                        botMessage(src, fullCommand + " is turned off.", chan);
                        return;
                    }
                    if (commandData == "") {
                        botMessage(src, "Specify a message to send.", chan);
                        return;
                    }
                    if (testMafiaChat(src, message)) {
                        return;
                    }

                    if (poUser.capsMute(commandData, chan)) {
                        return;
                    }

                    if (unicodeAbuse(src, commandData)) {
                        return;
                    }

                    sys.sendHtmlAll("<font color=" + getColor + "><timestamp/><i><b>*** " + sys.name(src) + "</b> " + format(src, html_escape(commandData)) + "</font></b></i>", chan);
                },

                /* -- User Commands: Auth */
                callauth: function () {
                    if (mcmd[0] == undefined) {
                        botMessage(src, "Please select an auth level or auth name for the /callauth", chan);
                        return;
                    }

                    var h = mcmd[0].toLowerCase(),
                        l = function (v) {
                            return v.toLowerCase()
                        },
                        a = h;

                    if (h != "1" && h != "2" && h != "3" && h != l(ModName) && h != l(AdminName) && h != l(OwnerName)) {
                        botMessage(src, "Please select an auth level or auth name for the /callauth", chan);
                        return;
                    }

                    if (l(ModName) == a) {
                        a = 1;
                    }
                    else if (l(AdminName) == a) {
                        a = 2;
                    }
                    else if (l(OwnerName) == a) {
                        a = 3;
                    }
                    else {
                        a = Number(a);
                    }

                    var y, PL = sys.playerIds(),
                        count = 0;

                    for (y in PL) {
                        var t = PL[y];
                        if (sys.auth(t) == a) {
                            count++;

                            botMessage(t, player(src) + " has called you!<ping/>", 0);
                        }
                    };

                    if (count === 0) {
                        botMessage(src, "No auths could be pinged.", chan);
                        return;
                    }

                    var s = "s";
                    if (count < 2) {
                        s = "";
                    }

                    botMessage(src, count + " auth" + s + " could be pinged.", chan);
                },

                /* -- User Commands: Team */
                team: function () {
                    script.importable(src, src, chan);
                },

                /* -- User Commands: Impersonation */
                imp: function () {
                    if (implock && sys.auth(src) < 1) {
                        botMessage(src, 'Imping has been locked for ' + Grammar.es(UserName) + '.', chan);
                        return;
                    }

                    if (poUser.capsMute(commandData, chan)) {
                        return;
                    }

                    if (unicodeAbuse(src, commandData)) {
                        if (!sys.loggedIn(src)) {
                            return;
                        }
                        sendFailWhale(src, chan);
                        if (sys.auth(src) < 1) {
                            kick(src);
                        }
                        return;
                    }

                    if (commandData == '') {
                        botMessage(src, "Specify a name!", chan);
                        return;
                    }

                    if (commandData.length > 20) {
                        botMessage(src, "Maximum characters allowed: 20. Current: " + commandData.length, chan);
                        return;
                    }

                    if (commandData == "off") {
                        delete poUser.impersonation;
                        botMessage(src, "Now you are yourself again!", chan);
                        return;
                    }

                    poUser.impersonation = commandData;

                    if (sys.auth(src) == 0) {
                        sendAuth(poUser.impersonation + " was impersonated by " + player(src) + "!");
                    }

                    botMessage(src, "You now are " + poUser.impersonation + "!", chan);
                },

                impoff: function () {
                    if (implock && sys.auth(src) < 1) {
                        botMessage(src, "Imping has been locked for " + Grammar.es(UserName) + ".", chan);
                        return;
                    }
                    if (poUser.impersonation == undefined) {
                        botMessage(src, "You currently don't have any impersonation.", chan);
                        return;
                    }

                    delete poUser.impersonation;
                    botMessage(src, "Now you are yourself again!", chan);
                },

                /* -- User Commands: Battle Points */
                battlepoints: function () {
                    var name = sys.name(src).toLowerCase(),
                        hash = DataHash.money,
                        displaystr = 'You have %1 battle points.';
                    if (hash[name] == undefined) {
                        hash[name] = 0;
                    }

                    if (dbIp != undefined && !isEmpty(commandData)) {
                        if (hash[cmdData] == undefined) {
                            hash[cmdData] = 0;
                        }

                        displaystr = player(commandData) + ' has %1 battle points.';
                        name = cmdData;
                    }

                    hash = hash[name];
                    botMessage(src, displaystr.format(hash), chan);
                    return;
                }
            });

            /* -- User Commands */
            userCommands[removespaces(UserName).toLowerCase() + "commands"] = function () {
                var ct = new Command_Templater(UserName + ' Commands');

                ct.register("funcommands", "Displays the Fun commands.");
                ct.register("mailcommands", "Displays the Mail commands.");
                ct.register("infocommands", "Displays the Information commands.");

                ct.register("ping", ["{Player::Online Player}", "{Text::Any <u>Message</u>}"], "To ping {Player::Online Player} with an optional {Text::Any Message}.");
                ct.register("callauth", ["{Text::Choice Auth Level/Auth Name}"], "Pings all authority of {Text::Number Auth Level} or {Text::Any Auth Name}.");
                ct.register("idle", "To reverse your away status.");

                if (Clantag.full != "None" && Clantag.full != "") {
                    ct.register("join" + Clantag.fullTextLower, "To join the " + Clantag.fullText.bold() + " clan.");
                    ct.register("unjoin" + Clantag.fullTextLower, "To unjoin the " + Clantag.fullText.bold() + " clan.");
                }

                if (Poll.mode) {
                    ct.register("viewpoll", "Displays the poll's information.");
                    ct.register("vote", ["{Text::Number Option}"], "To vote the option, {Text::Number Option}, in the poll.");
                }

                ct.register("unregister", "To unregister your alias.");
                ct.register("macro", ["{Text::Number 1-5}", "{Text::Any Message}"], "Changes one of your five macros to {Text::Any Message}. If no macro is specified, displays your macros. %m(macronumber) is replaced by that macro in your message (this adds up to your caps and flood count, and can be used for commands).");

                if (!implock) {
                    ct.register("imp", ["{Text::Any Target}"], "To impersonate {Text::Any Target}");
                    ct.register("impoff", "To remove your impersonation.");
                }

                ct.render(src, chan);
            }

            /* -- User Commands: Clan */
            if (Clantag.full != "None" && Clantag.full != "") {
                userCommands["join" + Clantag.fullTextLower] = function () {
                    var name = sys.name(src);
                    if (name.substr(0, Clantag.full.length) == Clantag.full) {
                        botMessage(src, "You already joined the " + Clantag.full + " clan!", chan);
                        return;
                    }
                    if (sys.id(Clantag.full + name) != undefined) {
                        botMessage(src, "Someone with your name and that tag is already online.", chan);
                        return;
                    }
                    if (ify.onChangeName() == "disallow") {
                        botMessage(src, "Ify is active. You can't join the clan now!", chan);
                        return;
                    }
                    var newName = Clantag.full + sys.name(src);
                    if (newName.length > 20) {
                        botMessage(src, "Please make your name shorter.", chan);
                        return;
                    }
                    botAll(player(src) + " joined the " + Clantag.full.bold() + " clan!", 0);
                    sys.changeName(src, newName);
                }

                userCommands["unjoin" + Clantag.fullTextLower] = function () {
                    var name = sys.name(src);
                    if (name.substr(0, Clantag.full.length) != Clantag.full) {
                        botMessage(src, "You didn't join the " + Clantag.full + " clan!", chan);
                        return;
                    }
                    if (ify.onClanCommand() == "disallow") {
                        botMessage(src, "Ify is active. You can't unjoin the clan now!", chan);
                        return;
                    }

                    var without = name.substr(Clantag.full.length);
                    if (sys.id(without) != src && sys.id(without) != undefined) {
                        botMessage(src, "Someone with your name without the clan tag is already online.", chan);
                        return;
                    }

                    botAll(player(src) + " unjoined the " + Clantag.full.bold() + " clan!", 0);
                    sys.changeName(src, without);
                }
            }

            /* -- Channel Commands: Start */
            channelCommands = ({ /* -- Channel Templates: Commands */
                channelcommands: function () {
                    var ct = new Command_Templater("Channel Commands", true),
                        topicContent = ["topic", "To display this channels topic."],
                        isChanMod = poChan.isChanMod(src);

                    if (isChanMod) {
                        topicContent = ["topic", "{Text::Any Topic}", "To display this channels topic if {Text::Any Topic} is empty. Otherwise sets it to {Text::Any Topic}."];
                    }

                    ct.span("Channel " + ChanUser + " Commands");

                    ct.register("csettings", "Displays channel settings and information.");
                    ct.register("cauth", "Displays the authority of this channel.");
                    ct.register.apply(ct, topicContent);

                    if (isChanMod) {
                        ct.span("Channel " + ChanMod + " Commands");

                        if (permission(src, 1)) {
                            ct.register("perm", "Makes the channel permanent or temporally.");
                        }
                        ct.register("channelwall", ["{Text::Any Message}"], "To announce {Text::Any Message} in this channel.");
                        ct.register("channelhtmlwall", ["{Text::Any Message}"], "To announce {Text::Any Message} with HTML in this channel.");
                        ct.register("html", ["{Text::Any Message}"], "To send {Text::Any Message} with HTML in this channel.");
                        ct.register("channelkick", ["{Player::Online Player}", "{Text::Any <u>Reason</u>}"], "To kick {Player::Online Player} with an optional {Text::Any Reason} in this channel.");
                        ct.register("channelmute", ["{Player::Database Player}", "<u>{Text::Number Time}</u>", "{Text::Time <u>Time Unit</u>}", "{Text::Any <u>Reason</u>}"], "To mute {Player::Database Player} for an optional {Text::Number Time}, {Text::Time Time Unit}, and/or {Text::Any Reason} in this channel.");
                        ct.register("channelunmute", ["{Player::Database Player}", "{Text::Any <u>Reason</u>}"], "To unmute {Player::Database Player} with an optional {Text::Any Reason} in this channel.");
                        ct.register("invite", ["{Player::Online Player}"], "To invite {Player::Online Player} to this channel.");
                        ct.register("topic", ["{Text::Any Topic}"], "To change the channel topic to {Text::Any Topic}. If {Text::Any Topic} is default, changes this channel's topic back to it's default.");
                        ct.register("cbanlist", "Displays this channel's banlist.");
                        ct.register("cmutelist", "Displays this channel's mutelist.");
                        ct.register("csilence", "To silence everyone whos channel authority is lower than yours.");
                        ct.register("cunsilence", "To unsilence the channel.");
                        ct.register("chatcolor", ["{Text::Any Color}", "{Text::Any Second Color}"], "Adds the chat color effect to this channel using the colors {Text::Any Color} and {Text::Any Second Color} If {Text::Any Color} or {Text::Any Second Color} is random, then uses a random color.");
                        ct.register("chatcoloroff", "Removes the chat color effect from this channel.");
                    }

                    if (poChan.isChanAdmin(src)) {
                        ct.span("Channel " + ChanAdmin + " Commands");

                        if (permission(src, 2)) {
                            ct.register("destroychannel", "To destory this channel.");
                        }

                        ct.register("installtour", "To install tournaments in this channel.");
                        ct.register("uninstalltour", "To uninstall tournaments in this channel.");

                        ct.register(removespaces(ChanUser).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(ChanUser) + " in this channel.");
                        ct.register(removespaces(ChanMod).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(ChanMod) + " in this channel.");
                        ct.register(removespaces(ChanTour0).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(ChanTour0) + " in this channel.");
                        ct.register(removespaces(ChanTour1).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(ChanTour1) + " in this channel.");

                        ct.register("channelban", ["{Player::Database Player}", "<u>{o Time}</u>", "{bv <u>Time Unit</b>}", "<u>{p Reason}</u>"], "Bans or unbans someone from this channel.");
                    }

                    if (poChan.isChanOwner(src)) {
                        ct.span("Channel " + ChanOwner + " Commands");

                        if (noPermission(src, 2)) {
                            ct.register("destroychannel", "To destory this channel.");
                        }

                        ct.register("channelpublic", "To allow everyone (with the exception of players on the channel banlist) into the channel.");
                        ct.register("channelprivate", "To make the channel auth-only. Also kicks everyone out of the channel who isn't (channel) auth.");
                        ct.register(removespaces(ChanAdmin).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(ChanAdmin) + " in this channel.");
                        ct.register(removespaces(ChanOwner).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(ChanOwner) + " in this channel.");
                    }

                    ct.render(src, chan);
                },

                /* -- Channel Templates: Normal */
                ctourauthlist: function () {
                    var authlist = poChan.tourAuth,
                        count = authlist.length(),
                        t = new Templater(Grammar.es(ChanTour1));

                    t.register("");

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of " + Grammar.es(ChanTour1) + ":</font></b> " + count);

                    t.render(src, chan);
                },

                csettings: function () {
                    var t = new Templater('Channel Settings'),
                        g = function (str) {
                            return "<font color='green'><b>" + str + "</b></font>";
                        },
                        r = function (str) {
                            return "<font color='red'><b>" + str + "</b></font>";
                        },
                        check = function (compare, name, on, off) {
                            if (compare) {
                                t.register(name + " " + g(on) + ".");
                            } else {
                                t.register(name + " " + r(off) + ".");
                            }
                        };

                    check(poChan.perm, "The channel is", "permanent", "temporally");
                    check(poChan.private, "The channel is", "private", "public"); /* private = when the channel is private */
                    check(!poChan.defaultTopic, "The channel is using a", "custom topic", "default topic"); /* give custom topic green, not red. */
                    check(poChan.toursEnabled, "The channel has", "tours enabled", "tours disabled");
                    check(chatcolor, "The channel has", "chat color enabled", "chat color disabled");

                    if (poChan.toursEnabled) {
                        check(poChan.tour.AutoStartBattles, "Auto Start Battles for this channel is", "on", "off");
                    }

                    if (poChan.creator != '' && poChan.creator != '~Unknown~') {
                        t.register("The channel creator is " + poChan.creator.bold().fontcolor("green") + ".");
                    }

                    t.register("The channel topic is " + poChan.topic + ".");
                    if (poChan.topicsetter != '') {
                        t.register("The channel topic setter is " + poChan.topicsetter + ".");
                    }

                    t.register("");

                    t.register("The channel silence level is " + String(poChan.silence).bold().fontcolor("blue") + ".");
                    t.register("The channel ID is " + String(chan).bold().fontcolor("orange") + ".<br/>");

                    t.register("The channel name is " + poChan.name.bold().fontcolor("red") + ".");

                    t.render(src, chan);
                },

                cauth: function () {
                    var authList = poChan.chanAuth,
                        x, cauth, auths = {
                            'mods': [],
                            'admins': [],
                            'owners': []
                        },
                        authTotal = authList.length();

                    for (x in authList) {
                        cauth = authList[x];
                        if (cauth === 3) {
                            auths.owners.push(x);
                        } else if (cauth === 2) {
                            auths.admins.push(x);
                        }
                        else {
                            auths.mods.push(x);
                        }
                    }

                    var t = new Templater("Channel Authority"),
                        c = auths.owners;

                    if (c.length != 0) {
                        t.register("<font color=red size=4><strong>" + Grammar.es(ChanOwner) + " (" + c.length + ")</strong></font>");
                        t.register("");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    c = auths.admins;
                    if (c.length != 0) {
                        t.register("<font color=orange size=4><strong>" + Grammar.es(ChanAdmin) + " (" + c.length + ")</strong></font>");
                        t.register("");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    c = auths.mods;
                    if (c.length != 0) {
                        t.register("<font color=blue size=4><strong>" + Grammar.es(ChanMod) + " (" + c.length + ")</strong></font>");
                        t.register("");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    t.register("<b><font color=blueviolet>Total Number of Channel Authorities:</b></font> " + authTotal);

                    t.render(src, chan);
                },

                /* -- Channel Templates: Tables */
                cbanlist: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    Prune.channelBans(chan);

                    var bans = poChan.banlist,
                        last, lastname, l, add, t, n = sys.time() * 1,
                        perm = permission(src, 1),
                        y;

                    var tt = new Table_Templater('Channel Banlist', 'red', '3');
                    if (perm) {
                        add = ["IP", "Banned Name", "Banned By", "Reason", "Time", "Last Used Name"];
                    }
                    else {
                        add = ["Banned Name", "Banned By", "Reason", "Time", "Last Used Name"];
                    }

                    tt.register(add, true);

                    for (y in bans) {
                        last = "N/A", lastname = lastName(y), l = bans[y], t = getTimeString(l.time - n);
                        if (lastname !== "~Unknown~") {
                            last = lastname;
                        }
                        if (perm) {
                            add = [y, l.who, l.by, l.why, t, last];
                        }
                        else {
                            add = [l.who, l.by, l.why, t, last];
                        }
                        tt.register(add, false);
                    }

                    tt.render(src, chan);
                },

                cmutelist: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    Prune.channelMutes(chan);

                    var mutes = poChan.mutelist,
                        last, lastname, l, add, tstr, now = sys.time() * 1,
                        perm = permission(src, 1),
                        y, tt = new Table_Templater('Channel Mutelist', 'blue', '3');

                    if (perm) {
                        add = ["IP", "Muted Name", "Muted By", "Reason", "Length", "Last Used Name"];
                    }
                    else {
                        add = ["Muted Name", "Muted By", "Reason", "Length", "Last Used Name"];
                    }

                    tt.register(add, true);

                    for (y in mutes) {
                        last = "N/A", lastname = lastName(y), l = mutes[y], tstr = getTimeString(l.time - now);
                        if (lastname !== "~Unknown~") {
                            last = lastname;
                        }
                        if (perm) {
                            add = [y, l.name, l.by, l.why, tstr, last];
                        }
                        else {
                            add = [l.name, l.by, l.why, tstr, last];
                        }
                        tt.register(add, false);
                    }


                    tt.render(src, chan);
                },

                channelhtmlwall: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    var color = script.namecolor(src),
                        l = '';

                    sys.sendHtmlAll(BORDER + "<br>", chan);

                    if (UseIcons) {
                        l = rankico;
                    }

                    sys.sendHtmlAll('<font color=' + script.namecolor(src) + '><timestamp/><b>' + l + html_escape(sys.name(src)) + ':</font></b> ' + commandData, chan);
                    sys.sendHtmlAll("<br>" + BORDER, chan);
                },

                channelwall: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    var color = script.namecolor(src),
                        srcname = sys.name(src),
                        l = '',
                        send = sys.sendAll,
                        f = commandData,
                        displaystr = srcname + ': ' + f;

                    sys.sendHtmlAll(BORDER + "<br>", chan);

                    if (UseIcons) {
                        l = rankico;
                        send = sys.sendHtmlAll;
                        f = format(src, html_escape(commandData));
                        displaystr = '<font color=' + script.namecolor(src) + '><timestamp/><b>' + l + html_escape(srcname) + ':</font></b> ' + f;
                    }

                    send(displaystr, chan);
                    sys.sendHtmlAll("<br>" + BORDER, chan);
                },

                html: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (noPermission(src, 1)) {
                        var sendStr = '<font color=' + script.namecolor(src) + '><timestamp/><b>' + sys.name(src) + ':</font></b> ' + commandData;
                        sys.sendHtmlAll(sendStr, chan);
                        return;
                    }

                    sys.sendHtmlAll(commandData, chan); /* Direct HTML for auth */
                },

                csilence: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    var auth = poChan.chanAuth[sys.name(src).toLowerCase()];

                    if (sys.auth(src) > poChan.chanAuth[sys.name(src).toLowerCase()]) {
                        auth = sys.auth(src);
                    }

                    if (poChan.silence === auth) {
                        botMessage(src, "The channel is already silenced!", chan);
                        return;
                    }

                    poChan.silence = auth;

                    if (poChan.silence > 3) {
                        poChan.silence = 3;
                    }

                    var type = {
                        1: "",
                        2: "super ",
                        3: "mega "
                    }[poChan.silence];

                    botAll(player(src) + " " + type + "silenced the channel!", chan);

                    cData.changeStatus(chan, poChan.perm, poChan.private, poChan.silence);
                },

                cunsilence: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (poChan.silence * 1 === 0) {
                        botMessage(src, "There is no silence!");
                        return;
                    }

                    poChan.silence = 0;
                    botAll(player(src) + " unsilenced the channel!", chan);
                    cData.changeStatus(chan, poChan.perm, poChan.private, 0);
                },

                /* -- Channel Commands: Privacy */
                channelprivate: function () {
                    if (!poChan.isChanOwner(src) && noPermission(src, 3)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (poChan.private) {
                        botMessage(src, 'This channel is already private!', chan);
                        return;
                    }
                    if (chan === 0) {
                        botMessage(src, "Cant do this in the main channel!", chan);
                        return;
                    }

                    var players = sys.playersOfChannel(chan),
                        x, lc, curr;

                    for (x in players) {
                        curr = players[x];
                        lc = sys.name(curr).toLowerCase();
                        if (!poChan.chanAuth.has(lc) && hpAuth(curr) < 1) {
                            sys.kick(curr, chan);
                        }
                    }

                    poChan.private = true;
                    botAll("This channel has been made private by " + player(src) + "!", chan);
                    cData.changeStatus(chan, poChan.perm, true, poChan.silence);
                },

                channelpublic: function () {
                    if (!poChan.isChanOwner(src) && noPermission(src, 3)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (!poChan.private) {
                        botMessage(src, 'This channel is already public!', chan);
                        return;
                    }
                    if (chan === 0) {
                        botMessage(src, "Cant do this in the main channel!");
                        return;
                    }

                    poChan.private = false;
                    botAll("This channel has been made public by " + player(src) + "!", chan);
                    cData.changeStatus(chan, cData.perm, false, cData.silence);
                },

                /* -- Channel Commands: Fun -- */
                chatcolor: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    if (chatcolor) {
                        botMessage(src, "This channel already has colorchat enabled!", chan);
                        return;
                    }

                    var c1 = mcmd[0];
                    var c2 = mcmd[1];
                    var c = chan;

                    if (isEmpty(c1)) c1 = "random";
                    if (isEmpty(c2)) c2 = "random";

                    ChatColorRandomizer(c1, c2, chan);
                },

                chatcoloroff: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (!chatcolor) {
                        botMessage(src, "This channel does not have colorchat enabled!", chan);
                        return;
                    }

                    DisableChatColorRandomizer(chan);
                },

                /* -- Channel Commands: Perm */
                perm: function () {
                    if (noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    poChan.perm = !poChan.perm;

                    var status = "permanent";
                    if (!poChan.perm) {
                        status = "temporally";
                    }

                    botAll(player(src) + " made this channel " + status + ".", chan);
                    cData.changeStatus(chan, poChan.perm, poChan.private, poChan.silence);
                },

                /* -- Channel Commands: Topic */
                topic: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        commandData = "";
                    }
                    if (commandData.length > 500 && noPermission(src, 1)) {
                        botMessage(src, "The topic may not be over 500 characters.", chan);
                        return;
                    }

                    poChan.changeTopic(src, commandData, fullCommand);
                    if (commandData != "") {
                        cData.changeTopic(chan, commandData, sys.name(src), false);
                    }
                },

                /* -- Channel Commands: Destruction */
                destroychannel: function () {
                    if (!poChan.isChanOwner(src, chan) && noPermission(src, 2)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (DefaultChannels.has(chan)) {
                        botMessage(src, "This channel can't be destoryed!", chan);
                        return;
                    }

                    var players = sys.playersOfChannel(chan),
                        curr;

                    delete cData.channelData[sys.channel(chan)];
                    cData.save();

                    poChan.perm = false;

                    for (x in players) {
                        curr = players[x];
                        sys.kick(curr, chan)
                        if (sys.isInChannel(curr, 0) != true) {
                            sys.putInChannel(curr, 0)
                        }
                    }
                },

                /* -- Channel Commands: Mute */
                channelmute: function () {
                    if (!poChan.isChanMod(src, chan) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (dbIp == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (poChan.isMutedInChannel(dbIp)) {
                        botMessage(src, 'That person is already channel muted.', chan);
                        return;
                    }
                    if (!poChan.canIssue(src, mcmd[0])) {
                        botMessage(src, 'That person has either equal or higher Channel Authority than you.', chan);
                        return;
                    }
                    if (self(src, mcmd[0])) {
                        botMessage(src, 'You cannot mute yourself.', chan);
                        return;
                    }

                    var unitTime = stringToTime(mcmd[2], mcmd[1]),
                        time = 0,
                        timestr = "forever",
                        time_now = sys.time() * 1;

                    if (!isNaN(unitTime)) {
                        mcmd[1] = unitTime;
                        time = time_now + unitTime
                        timestr = "for " + getTimeString(unitTime);
                    }

                    var reason = "None.";

                    botAll(player(mcmd[0]) + " has been muted by " + player(src) + " " + timestr + " in this channel!", chan);
                    if (!isEmpty(mcmd[3])) {
                        reason = cut(mcmd, 3, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }

                    poChan.mutelist[dbIp] = {
                        'by': sys.name(src),
                        'name': mcmd[0].name(),
                        'why': reason,
                        'time': time
                    };
                    cData.changeBans(chan, poChan.mutelist, poChan.banlist);
                },

                channelunmute: function () {
                    if (!poChan.isChanMod(src, chan)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (dbIp == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (!poChan.isMutedInChannel(dbIp)) {
                        botMessage(src, "That person isn't muted in this channel.", chan);
                        return;
                    }
                    botAll(player(mcmd[0]) + " has been unmuted by " + player(src) + " in this channel!", chan);
                    if (!isEmpty(mcmd[1])) {
                        var reason = cut(mcmd, 1, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }

                    delete poChan.mutelist[dbIp];
                    cData.changeBans(chan, poChan.mutelist, poChan.banlist);
                },

                installtour: function () {
                    if (!poChan.isChanAdmin(src)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    if (poChan.tour != undefined && !poChan.toursEnabled) {
                        poChan.toursEnabled = true;
                    }

                    if (poChan.toursEnabled && poChan.has("tour")) {
                        botMessage(src, "Tours are already installed!", chan);
                        return;
                    }

                    if (DefaultChannels.has(chan)) {
                        botMessage(src, "You cannot install tours in this channel.", chan);
                        return;
                    }

                    botAll("Installing channel tours...", chan);

                    poChan.toursEnabled = true;
                    poChan.tour = new Tours(chan);

                    botAll("Install successful!", chan);

                    cData.changeToursEnabled(chan, true);
                },

                uninstalltour: function () {
                    if (!poChan.isChanAdmin(src)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    if (poChan.tour == undefined && poChan.toursEnabled) {
                        poChan.toursEnabled = false;
                    }

                    if (!poChan.toursEnabled || !poChan.has("tour")) {
                        botMessage(src, "Tours are not installed!", chan);
                        return;
                    }
                    if (DefaultChannels.has(chan)) {
                        botMessage(src, "You cannot remove tours in this channel.", chan);
                        return;
                    }

                    botAll("Uninstalling channel tours...", chan);

                    poChan.toursEnabled = false;
                    delete poChan.tour;

                    botAll("Uninstall successful!", chan);

                    cData.changeToursEnabled(chan, false);
                },

                invite: function () {
                    if (!poChan.isChanMod(src)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (tar == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }

                    if (sys.isInChannel(tar, chan)) {
                        botMessage(src, "That person is already in this channel.", chan);
                        return;
                    }

                    botMessage(tar, player(src) + " invites you to go to " + ChannelLink(sys.channel(chan)) + "! <ping/>", chan);
                    botMessage(src, player(tar) + " was invited.");
                },

                channelban: function () {
                    if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (dbIp == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (poChan.isBannedInChannel(dbIp)) {
                        botMessage(src, 'That person is already channel banned.', chan);
                        return;
                    }
                    if (!poChan.canIssue(src, mcmd[0])) {
                        botMessage(src, 'That person has either equal or higher channel auth than you.'.chan);
                        return;
                    }
                    if (self(src, mcmd[0])) {
                        botMessage(src, 'You cannot channel ban yourself.', chan);
                        return;
                    }

                    var unitTime = stringToTime(mcmd[2], mcmd[1]),
                        time = 0,
                        timestr = "forever",
                        time_now = sys.time() * 1,
                        reason = "None given.";
                    if (!isNaN(unitTime)) {
                        mcmd[1] = unitTime;
                        time = time_now + unitTime
                        timestr = "for " + getTimeString(unitTime);
                    }

                    botAll(player(mcmd[0]) + " has been banned by " + player(src) + " " + timestr + " in this channel!", chan);
                    if (!isEmpty(mcmd[3])) {
                        reason = cut(mcmd, 3, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }

                    poChan.banlist[dbIp] = {
                        'by': sys.name(src),
                        'who': mcmd[0].name(),
                        'why': reason,
                        'time': time
                    };

                    if (tar != undefined) {
                        sys.kick(tar, chan);
                    }

                    cData.changeBans(chan, poChan.mutelist, poChan.banlist);
                },

                channelunban: function () {
                    if (!poChan.isChanAdmin(src)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (dbIp == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (!poChan.isBannedInChannel(dbIp)) {
                        botMessage(src, "That person isn't banned in this channel.", chan);
                        return;
                    }

                    botEscapeAll(mcmd[0].name() + " has been unbanned by " + sys.name(src) + " in this channel!", chan);
                    if (!isEmpty(mcmd[1])) {
                        var reason = cut(mcmd, 1, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }

                    delete poChan.banlist[dbIp];
                    cData.changeBans(chan, poChan.mutelist, poChan.banlist);
                },

                /* -- Channel Commands: Kick */
                channelkick: function () {
                    if (!poChan.isChanMod(src)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (!poChan.canIssue(src, mcmd[0])) {
                        botMessage(src, 'That person has either equal or higher channel authority than you.', chan);
                        return;
                    }
                    if (tar == undefined) {
                        botMessage(src, "That person is either not online, or doesn't exist.", chan);
                        return;
                    }
                    if (self(src, mcmd[0])) {
                        botMessage(src, "You cannot channel kick yourself.", chan);
                        return;
                    }
                    if (!sys.isInChannel(tar, chan)) {
                        botMessage(src, "That person isn't in this channel.", chan);
                        return;
                    }
                    botAll(player(tar) + " has been kicked in this channel by " + player(src) + "!", chan);
                    if (!isEmpty(mcmd[1])) {
                        var reason = cut(mcmd, 1, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }
                    sys.kick(tar, chan);
                }
            });

            channelCommands[removespaces(ChanTour0).toLowerCase()] = function () {
                if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                    noPermissionMessage(src, fullCommand, chan);
                    return;
                }
                if (mcmd[0] == "") {
                    botMessage(src, "Specify a name!", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist", chan);
                    return;
                }
                if (poChan.tourAuth[mcmd[0].toLowerCase()] === undefined) {
                    botMessage(src, "That person is already " + ChanTour0 + "!", chan);
                    return;
                }
                poChan.takeTourAuth(mcmd[0]);
                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + ChanTour0 + " by " + sys.name(src) + ".", chan);
                    return;
                }
                botEscapeAll(commandData + " has been made " + ChanTour0 + " by " + sys.name(src) + ".", chan);
            }

            channelCommands[removespaces(ChanTour1).toLowerCase()] = function () {
                if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                    noPermissionMessage(src, fullCommand, chan);
                    return;
                }
                if (mcmd[0] == "") {
                    botMessage(src, "Specify a name!", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist", chan);
                    return;
                }
                if (poChan.tourAuth[mcmd[0].toLowerCase()] != undefined) {
                    botMessage(src, "That person is already " + ChanTour1 + "!", chan);
                    return;
                }
                poChan.giveTourAuth(mcmd[0]);
                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + ChanTour1 + " by " + sys.name(src) + ".", chan);
                    return;
                }
                botEscapeAll(commandData + " has been made " + ChanTour1 + " by " + sys.name(src) + ".", chan);
                putInAuthChan(commandData, "cauth", chan);
            }

            channelCommands[removespaces(ChanUser).toLowerCase()] = function () {
                if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                    noPermissionMessage(src, fullCommand, chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist!", chan);
                    return;
                }
                var chanAuth = poChan.chanAuth,
                    player = chanAuth[commandData.toLowerCase()];
                if (player == undefined) {
                    botMessage(src, "That person is already " + ChanUser + "!", chan);
                    return;
                }
                if ((player >= 2 && !poChan.isChanOwner(src) && sys.auth(src) < 3) || dbAuth == 2 && sys.auth(src) < 3) {
                    botMessage(src, "You can't deauth higher auth!", chan);
                    return;
                }

                botEscapeAll(commandData + " was made " + ChanUser + " by " + sys.name(src) + ".", chan);
                poChan.changeAuth(commandData.toLowerCase(), 0);

                cData.changeChanAuth(chan, poChan.chanAuth);
            }

            channelCommands[removespaces(ChanMod).toLowerCase()] = function () {
                if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                    noPermissionMessage(src, fullCommand, chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist!", chan);
                    return;
                }
                if (poChan.chanAuth[commandData.toLowerCase()] == 1) {
                    botMessage(src, "That person is already " + ChanMod + "!", chan);
                    return;
                }
                if ((poChan.chanAuth[commandData.toLowerCase()] * 1 >= 2 && !poChan.isChanOwner(src) && sys.auth(src) < 3) || dbAuth == 2 && sys.auth(src) < 3) {
                    botMessage(src, "You can't deauth higher auth!", chan);
                    return;
                }

                botEscapeAll(commandData + " was made " + ChanMod + " by " + sys.name(src) + ".", chan);
                poChan.changeAuth(commandData.toLowerCase(), 1);

                cData.changeChanAuth(chan, poChan.chanAuth);

                putInAuthChan(commandData, "cauth", chan);
            }

            channelCommands[removespaces(ChanAdmin).toLowerCase()] = function () {
                if (!poChan.isChanOwner(src) && noPermission(src, 3)) {
                    botMessage(src, "You don't have the permission to do that", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist!", chan);
                    return;
                }
                if (poChan.chanAuth[commandData.toLowerCase()] == 2) {
                    botEscapeMessage(src, "That person is already " + ChanAdmin + "!", chan);
                    return;
                }
                if (sys.auth(src) < 3 && dbAuth > 1 && dbAuth < 3) {
                    botMessage(src, "You can't deauth higher auth!", chan);
                    return;
                }
                botEscapeAll(commandData + " was made " + ChanAdmin + " by " + sys.name(src) + ".", chan);
                poChan.changeAuth(commandData.toLowerCase(), 2);

                cData.changeChanAuth(chan, poChan.chanAuth);

                putInAuthChan(commandData, "cauth", chan);
            }

            channelCommands[removespaces(ChanOwner).toLowerCase()] = function () {
                if (!poChan.isChanOwner(src) && noPermission(src, 3)) {
                    botMessage(src, "You don't have the permission to do that", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist!", chan);
                    return;
                }
                if (poChan.chanAuth[commandData.toLowerCase()] == 3) {
                    botEscapeMessage(src, "That person is already " + ChanOwner + "!", chan);
                    return;
                }
                botEscapeAll(commandData + " was made " + ChanOwner + " by " + sys.name(src) + ".", chan);
                poChan.changeAuth(commandData.toLowerCase(), 3);

                cData.changeChanAuth(chan, poChan.chanAuth);

                putInAuthChan(commandData, "cauth", chan);
            }

            tourCommands = ({
                tourcommands: function () {
                    if (!poChan.toursEnabled) {
                        return;
                    }

                    var ct = new Command_Templater("Tournament Commands", true);
                    ct.span("Tournament " + ChanTour0 + " Commands");

                    ct.register("join", "To join this channel's tournament.");
                    ct.register("unjoin", "To unjoin this channel's tournament.");
                    ct.register("viewround", "Displays information about the current round.");
                    ct.register("tourprize", "Displays this channel's tournament prize.");

                    if (poChan.tour.hasTourAuth(src)) {
                        ct.span("Tournament " + ChanTour1 + " Commands");
                        ct.register("tour", ["{Text::Any Tier}", "{Text::Number Players}", "{Text::Number <u>Type</u>}", "{Text::Any <u>Prize</u>}"], "Starts a new tournament. Type will be Single Elimination (1) if not specified. Types are: Single Elimination (1), Double Elimination (2), Triple Elimination (3), Tag Team Single Elimination (4), Tag Team Double Elimination (5), Tag Team Triple Elimination (6). For Tag Team Tournaments, the entrants must be an even number.");
                        ct.register("dq", ["{Player::Tournament Player}"], "Disqualifies {Player::Tournament Player} from this channel's tournament.");
                        ct.register("cancelbattle", ["{Player::Tournament Player}"], "Makes someones battle unofficial.");
                        ct.register("changespots", ["{Text::Number Spots}"], "Changes the number of entry spots to {Text::Number Spots}. In Tag Team Tournaments, the entrants must be an even number.");
                        ct.register("push", ["{Player::Database Player}"], "Adds {Player::Database Player} to the tournament. In Tag Team Tournaments, you cannot add players after the signup.");
                        ct.register("endtour", "Ends this channel's running tournament.");
                        ct.register("switch", ["{Player::Tournament Player}", "{Player::Online New Player}"], "Switches {Player::Tournament Player} with {Player::Online New Player} in this channel's tournament.");
                        ct.register("autostartbattles", "Toggles auto start battles in this channel.");
                        ct.register("display", ["{Text::Choice 1/2}"], "To change this channel's tournament display mode. 1 is Normal, 2 is Clean.");
                    }

/*
                    if (permission(src, 1) || poUser.megauser) {
                        ct.span("Tournament " + Tour1 + " Commands");
                    }*/

                    ct.render(src, chan);
                },


                display: function () {
                    poChan.tour.command_display(src, commandData, fullCommand);
                },

                "switch": function () {
                    poChan.tour.command_switch(src, commandData, fullCommand);
                },

                autostartbattles: function () {
                    poChan.tour.command_autostartbattles(src, commandData, fullCommand);
                },

                tourprize: function () {
                    poChan.tour.command_tourprize(src, commandData, fullCommand);
                },

                join: function () {
                    poChan.tour.command_join(src, commandData, fullCommand);
                },

                unjoin: function () {
                    poChan.tour.command_unjoin(src, commandData, fullCommand);
                },

                viewround: function () {
                    poChan.tour.command_viewround(src, commandData, fullCommand);
                },

                dq: function () {
                    poChan.tour.command_dq(src, commandData, fullCommand);
                },

                push: function () {
                    poChan.tour.command_push(src, commandData, fullCommand);
                },

                cancelbattle: function () {
                    poChan.tour.command_cancelbattle(src, commandData, fullCommand);
                },

                changespots: function () {
                    poChan.tour.command_changespots(src, commandData, fullCommand);
                },

                tour: function () {
                    if (TourDisplay == 2) {
                        DisableChatColorRandomizer(chan);
                    }

                    poChan.tour.command_tour(src, commandData, fullCommand);
                },

                endtour: function () {
                    poChan.tour.command_endtour(src, commandData, fullCommand);
                }
            });

            modCommands = ({
                cmdcommands: function () {
                    var ct = new Command_Templater("Command Commands", true);
                    ct.span("Command " + ModName + " Commands");
                    ct.register("enable", ["{Text::Any Command}"], "Enables {Text::Any Command}. Valid commands are: me, attack, roulette, catch.");
                    ct.register("disable", ["{Text::Any Command}"], "Disables {Text::Any Command}. Valid commands are: me, attack, roulette, catch.");

                    if (permission(src, 2)) {
                        ct.span("Command " + AdminName + " Commands");
                        ct.register("implock", "Locks impersonation commands for " + Grammar.es(UserName) + ".");
                        ct.register("impunlock", "Unlocks impersonation commands for " + Grammar.es(UserName) + ".");
                    }

                    if (permission(src, 3)) {
                        ct.span("Command " + OwnerName + " Commands");
                        ct.register("pointercommand", ["{Text::Any Name}", "{Text::Any Command}"], "Creates the pointer command, {Text::Any Name}, that points to {Text::Any Command}.");
                        ct.register("delpointercommand", ["{Text::Any Name}"], "Deletes the pointer command, {Text::Any Name}.");
                        ct.register("futurelimit", ["{Text::Number Limit}"], "Changes the futures allowed to every {Text::Number Limit} seconds.");
                    }

                    if (host) {
                        ct.span("Command Founder Commands");
                        ct.register("evallock", "To lock eval for everyone but you and eval operators.");
                        ct.register("evalunlock", "To unlock eval.");
                    }

                    ct.render(src, chan);
                },

                moderatecommands: function () {
                    var ct = new Command_Templater("Moderation Commands", true);
                    ct.span("Moderation " + ModName + " Commands");

                    ct.register("kick", ["{Player::Online Player}", "{Text::Any <u>Reason</u>}"], "To kick {Player::Online Player} with the optional reason, {Text::Any Reason}.");
                    ct.register("mute", ["{Player::Database Player}", "{Text::Number <u>Time</u>}", "{Text::Time <u>Time Unit</u>}", "{Text::Any <u>Reason</u>}"], "To mute {Player::Database Player} for {Text::Number Time} with {Text::Time Time Unit} as time unit, with the reason being {Text::Any Reason}.");
                    ct.register("unmute", ["{Player::Database Player}", "{Text::Any <u>Reason</u>}"], "To unmute {Player::Database Player}, with the reason being {Text::Any Reason}.");
                    ct.register("tempban", ["{Player::Database Player}", "{Text::Number <u>Time</u>}", "{Text::Time <u>Time Unit</u>}", "{Text::Any <u>Reason</u>}"], "To ban {Player::Database Player} for {Text::Number Time} with {Text::Time Time Unit} as time unit, with the reason being {Text::Any Reason}.");
                    ct.register("untempban", ["{Player::Database Player}", "{Text::Any <u>Reason</u>}"], "To un-tempban {Player::Database Player}, with the reason being {Text::Any Reason}.");
                    ct.register("rangebanlist", "Displays the list of range bans.");
                    ct.register("banlist", "Displays the list of bans.");
                    ct.register("tempbanlist", "Displays the list of temp bans.");
                    ct.register("mutelist", "Displays the list of mutes.");

                    if (permission(src, 2)) {
                        ct.span("Moderation " + AdminName + " Commands");
                        ct.register("ban", ["{Player::Database Player}", "{Text::Any <u>Reason</u>}"], "To ban {Player::Database Player}, with the reason being {Text::Any Reason}.");
                        ct.register("unban", ["{Player::Database Player}", "{Text::Any <u>Reason</u>}"], "To unban {Player::Database Player}, with the reason being {Text::Any Reason}.");
                    }

                    if (permission(src, 3)) {
                        ct.span("Moderation " + OwnerName + " Commands");
                        ct.register("rangeban", ["{Text::Any Range IP}", "{Text::Number <u>Time</u>}", "{Text::Time <u>Time Unit</u>}", "{Text::Any <u>Reason</u>}"], "To range ban {Text::Any Range IP} for {Text::Number Time} with {Text::Time Time Unit} as time unit, with the reason being {Text::Any Reason}.");
                        ct.register("rangeunban", ["{Text::Any Range IP}"], "To un-range ban {Text::Any Range IP}.");
                    }

                    ct.render(src, chan);
                },

                impcommands: function () {
                    var ct = new Command_Templater("Impersonation Commands");

                    if (implock) {
                        ct.register("imp", ["{Text::Any Target}"], "To impersonate {Text::Any Target}.");
                        ct.register("impoff", "To stop impersonating.");
                    }

                    ct.register("unimp", ["{Player::Online Player}"], "Removes {Player::Online Player}'s impersonation.");

                    ct.register("superimp", ["{Text::Any Target}"], "Changes your name to ~{Text::Any Target}~.");
                    ct.register("superimpoff", "Restores your name to it's original.");

                    ct.render(src, chan);
                },

                silencecommands: function () {
                    var ct = new Command_Templater("Silence Commands", true);
                    ct.span("Silence " + ModName + " Commands");

                    ct.register("silence", ["{Text::Number <u>Time</u>}"], "Silences the chat for all auth under " + Grammar.es(UserName) + " for {Text::Number Time}. If no {Text::Number Time} specified, silences the chat forever.");
                    ct.register("unsilence", "Unsilences the chat.");
                    ct.register("voice", ["{Player::Database Player}"], "Gives {Player::Database Player} voice (the ability to talk through channel silences and normal silence).");
                    ct.register("unvoice", ["{Player::Database Player}"], "Removes {Player::Database Player}'s voice.");

                    if (sys.auth(src) < 2) {
                        ct.span("Silence " + AdminName + " Commands");
                        ct.register("supersilence", ["{Text::Number <u>Time</u>}"], "Silences the chat for all auth under " + Grammar.es(ModName) + " for {Text::Number Time}. If no {Text::Number Time} specified, silences the chat forever.");
                    }

                    if (sys.auth(src) < 3) {
                        ct.span("Silence " + OwnerName + " Commands");
                        ct.register("megasilence", ["{Text::Number <u>Time</u>}"], "Silences the chat for all auth under " + Grammar.es(AdminName) + " for {Text::Number Time}. If no {Text::Number Time} specified, silences the chat forever.");
                    }

                    ct.render(src, chan);
                },

                /* -- Mod Templates: Tables */
                rangebanlist: function () {
                    Prune.rangeBans();

                    var range = DataHash.rangebans,
                        t = sys.time() * 1,
                        r, i, s;

                    var tt = new Table_Templater("Range Ban List", "darkviolet", "3");
                    tt.register(["Range IP", "By", "Reason", "Duration"], true);

                    for (i in range) {
                        r = range[i], s = "for " + getTimeString(r.time - time);

                        if (r.time == 0) {
                            s = "forever";
                        }

                        tt.register([r.ip, r.by, r.why, s], false);
                    }


                    tt.render(src, chan);
                },

                tempbanlist: function () {
                    Prune.bans();

                    var temp = DataHash.tempbans,
                        last, lastname, i, r, s, t = sys.time() * 1,
                        tt = new Table_Templater('Temp Ban List', 'limegreen', '3');

                    tt.register(["IP", "Last Used Name", "By", "Reason", "Duration"], true);

                    for (i in temp) {
                        r = temp[i];
                        s = "forever";

                        if (r.time !== 0) {
                            s = "for " + getTimeString(r.time - t);
                        }

                        last = "N/A";
                        lastname = lastName(r.ip);

                        if (lastname !== "~Unknown~") {
                            last = lastname;
                        }

                        tt.register([r.ip, last, r.by, r.why, s], false);
                    }


                    tt.render(src, chan);
                },
                mutelist: function () {
                    Prune.mutes();

                    var mutes = DataHash.mutes,
                        s, last, lastname, r, t = sys.time() * 1,
                        i, r, s, tt = new Table_Templater("Mute List", "midnightblue", "3");

                    tt.register(["IP", "Last Used Name", "By", "Reason", "Duration"], true);

                    for (i in mutes) {
                        r = mutes[i];
                        s = "forever";

                        if (r.time !== 0) {
                            s = "for " + getTimeString(r.time - t);
                        }

                        last = "N/A";
                        lastname = lastName(r.ip);
                        if (lastname !== "~Unknown~") {
                            last = lastname;
                        }

                        tt.register([r.ip, last, r.by, r.why, s], false);
                    }


                    tt.render(src, chan);
                },

                info: function () {
                    var ip = dbIp;
                    if (ip == undefined) {
                        botMessage(src, "That person doesn't exist", chan);
                        return;
                    }

                    var color = "N/A",
                        id = "N/A",
                        laston = "N/A",
                        lastname = "N/A",
                        aliases = sys.aliases(ip).map(function (n) {
                            return n.name();
                        }),
                        reg = "no";

                    if (sys.dbRegistered(commandData)) {
                        reg = "yes";
                    }

                    var ban = 'no',
                        banned, banlist = sys.banList();

                    for (banned in banlist) {
                        if (cmdData == banlist[banned]) {
                            ban = 'yes';
                            break;
                        }
                    }

                    var online = 'yes';
                    if (tar === undefined) {
                        online = 'no';
                    }

                    var name = commandData.name(),
                        range = rangeIP(commandData);

                    if (sys.dbLastOn(commandData) !== undefined) {
                        laston = sys.dbLastOn(commandData);
                        lastname = lastName(ip);
                    }

                    Prune.mutes();
                    Prune.bans();

                    var auth = dbAuth,
                        t = parseInt(sys.time()),
                        hash = DataHash,
                        hash_mute = hash.mutes[ip],
                        hash_ban = hash.tempbans[ip],
                        mutepart = "no";

                    if (hash_mute != undefined) {
                        mutepart = "yes";
                    }

                    var mute = mutepart,
                        part;

                    if (mutepart != "no") {
                        part = "forever";
                        if (hash_mute.time != 0) {
                            part = "for " + getTimeString(hash_mute.time - t);
                        }

                        mute = mutepart + ", " + part + "!";
                    }

                    var banpart = "no";
                    if (hash_ban != undefined) {
                        banpart = "yes";
                    }

                    var tban = banpart;

                    if (banpart != "no") {
                        part = "forever";
                        if (hash_ban.time != 0) {
                            part = "for " + getTimeString(hash_ban.time - t);
                        }

                        tban = banpart + ", " + part + "!";
                    }

                    if (online === 'yes') {
                        id = tar;
                        color = script.namecolor(tar);
                    }

                    script.resolveLocation(0, dbIp, true);

                    var loc = hash.locations[dbIp],
                        hostname = loc.hostname,
                        country = loc.country_name;

                    var tt = new Table_Templater("Information of " + name, "orange", "2");

                    tt.register(["Name", "IP", "Range IP", "Last On At", "With Name", "Registered", "Auth Level", "Aliases"], true);
                    tt.register([name, ip, range, laston, lastname, reg, auth, "<small>" + aliases + "</small>"], false);
                    tt.register(["Online", "Hex Color", "ID", "Muted", "Temp Banned", "Banned", "Country", "Hostname"], true);
                    tt.register([online, color, id, mute, tban, ban, country, hostname], false);


                    tt.render(src, chan);
                },

                banlist: function () {
                    var list = sys.banList().sort();

                    if (list.length === 0) {
                        botMessage(src, "No one is banned.", chan);
                        return;
                    }

                    var tt = new Table_Templater("Ban List", "red", "3");
                    tt.register(["Name", "Last Used Name", "IP"], true);

                    var last, lastname, ly, ip, y;

                    for (y in list) {
                        ly = list[y], ip = sys.dbIp(ly), last = "N/A", lastname = lastName(ip);
                        if (lastname !== undefined) {
                            last = lastname;
                        }

                        tt.register([ly.name(), last, ip], false);
                    }


                    tt.render(src, chan);
                },

                /* -- Mod Commands: Voice */
                voice: function () {
                    var v = DataHash.voices,
                        n = mcmd[0];

                    if (dbIp === undefined || n === "") {
                        botMessage(src, "No such player!", chan);
                        return;
                    }
                    if (v.has(n.toLowerCase())) {
                        botMessage(src, "That player already has Voice!", chan);
                        return;
                    }

                    v[n.toLowerCase()] = {
                        'by': sys.name(src)
                    };
                    if (poTar != undefined) {
                        poTar.voice = true;
                    }

                    botAll(n + " was made Voice by " + sys.name(src) + "!", 0);
                },

                unvoice: function () {
                    var v = DataHash.voices,
                        n = mcmd[0];

                    if (!v.has(n.toLowerCase())) {
                        botMessage(src, "That player does not have Voice!", chan);
                        return;
                    }

                    delete DataHash.voices[n.toLowerCase()];

                    if (poTar != undefined) {
                        poTar.voice = false;
                    }

                    botAll(n + "'s voice was taken by " + sys.name(src) + "!", 0);
                },

                /* -- Mod Commands: Me -- */
                htmlme: function () {
                    if (commandData === "") {
                        return;
                    }

                    sys.sendHtmlAll("<font color=" + getColor + "><timestamp/><i>*** <b>" + srcname + "</b> " + commandData + "</i>", chan);
                },

                /* -- Mod Commands: Impersonation -- */
                unimp: function () {
                    if (tar === undefined) {
                        botMessage(src, "This person isn't online or doesn't exist.", chan);
                        return;
                    }
                    if (poTar.impersonation === undefined || poTar.impersonation === "") {
                        botMessage(src, "This person does not have an impersonation.", chan);
                        return;
                    }

                    sendAuth(sys.name(tar) + " (" + poTar.impersonation + ") was de-impersonated by " + srcname + "!");
                    delete poTar.impersonation;
                    if (sys.auth(tar) < 1) {
                        botMessage(tar, "You have been un-impersonated by " + srcname + "!");
                    }
                },

                /* -- Mod Commands: Trivia -- */
/*
                start: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.start(src);
                },

                remove: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.remove(src, commandData);
                },

                end: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.end(src);
                },

                skip: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.skipRound(src);
                },
				*/

                /* -- Mod Commands: Wall -- */
                htmlwall: function () {
                    var color = script.namecolor(src),
                        l = '';

                    sys.sendHtmlAll(BORDER + "<br>");

                    if (UseIcons) {
                        l = rankico;
                    }

                    sys.sendHtmlAll('<font color=' + color + '><timestamp/><b>' + l + html_escape(srcname) + ':</font></b> ' + commandData);
                    sys.sendHtmlAll("<br>" + BORDER);
                },

                wall: function () {
                    var color = script.namecolor(src),
                        l = '',
                        send = sys.sendAll,
                        f = commandData,
                        displaystr = sys.name(src) + ': ' + f;

                    sys.sendHtmlAll(BORDER + "<br>");

                    if (UseIcons) {
                        l = rankico;
                        send = sys.sendHtmlAll;
                        f = format(src, html_escape(commandData));
                        displaystr = '<font color=' + color + '><timestamp/><b>' + l + html_escape(srcname) + ':</font></b> ' + f;
                    }

                    send(displaystr);
                    sys.sendHtmlAll("<br>" + BORDER);
                },

                /* -- Mod Commands: Silence -- */
                silence: function () {
                    if (silence.level) {
                        botMessage(src, "The chat is already silenced.", chan);
                        return;
                    }
                    var time = commandData * 60,
                        timeStr = "!";
                    if (!isNaN(time) && commandData !== "") {
                        timeStr = " for " + getTimeString(time) + "!";
                    }

                    silence = {
                        "by": sys.name(src),
                        "level": 1
                    };
                    botAll(sys.name(src) + " silenced the chat" + timeStr);

                    if (timeStr === "!") {
                        return;
                    }

                    timeOut = function () {
                        if (!silence.level) {
                            return;
                        }

                        silence = {
                            "by": "",
                            "level": 0
                        };
                        botAll("Silence is over.");
                    }

                    sys.delayedCall(timeOut, time);
                },

                unsilence: function () {
                    if (!silence.level) {
                        botMessage(src, "The chat isn't silenced.", chan);
                        return;
                    }

                    silence = {
                        "by": "",
                        "level": 0
                    };

                    botAll(sys.name(src) + " unsilenced the chat!");
                },

                /* -- Mod Commands: Auth -- */
                resign: function () {
                    if (sys.auth(src) == 0) { // Auth perms
                        return;
                    }

                    var n = sys.name(src);
                    sys.changeAuth(src, 0);
                    botAll(n + " resigned from auth!", 0);
                },


                passauth: function () {
                    if (dbIp == undefined || dbIp != sys.ip(src)) {
                        botMessage(src, "That player doesn't have your ip or does not exist.", chan);
                        return;
                    }

                    var myAuth = sys.auth(src),
                        trgtAuth = sys.dbAuth(commandData);
                    if (myAuth <= trgtAuth) {
                        botMessage(src, "That alias has either equal or higher auth!", chan);
                        return;
                    }

                    if (!sys.dbRegistered(commandData)) {
                        botMessage(src, "That alias is not registered. Please register it before passing auth.", chan);
                        return;
                    }


                    var myID = src;

                    with(sys) {
                        var tarId = id(commandData);

                        changeDbAuth(commandData, myAuth);
                        if (tarId) {
                            changeAuth(tarId, myAuth);
                        }

                        changeAuth(myID, 0);
                    }

                    botMessage(src, "You passed your auth to " + commandData.name() + "!", chan);
                },

                /* -- Mod Commands: Poll -- */
                poll: function () {

                    if (!mcmd[1]) {
                        mcmd[1] = '';
                    }
                    if (Poll.mode) {
                        botMessage(src, "A poll is already going on", chan);
                        return;
                    }

                    Poll.mode = 1;
                    Poll.votes = 0;
                    Poll.subject = mcmd[0];
                    Poll.starter = sys.name(src);

                    mcmd[1] = cut(mcmd, 1, ':');
                    var arr = mcmd[1].split('/'),
                        y, num;

                    for (y in arr) {
                        num = Number(y) + 1;
                        Poll.options[num] = {
                            name: arr[y],
                            votes: []
                        };
                    }

                    if (objLength(Poll.options) < 2) {
                        Poll.mode = 0;
                        Poll.votes = 0;
                        Poll.subject = "";
                        Poll.starter = '';
                        Poll.options = {};
                        botMessage(src, "Please specify atleast 2 options.", chan);
                        return;
                    }

                    botAll("A poll was started by " + sys.name(src).bold() + "!", 0);
                    botAll("Subject: " + mcmd[0], 0);
                    botAll("Please vote! Use <font color='green'><b>/Vote</b></font> Option Number to vote.", 0);

                    for (var i in Poll.options) {
                        botAll(i + ". " + Poll.options[i].name, 0)
                    }
                },

                closepoll: function () {
                    if (Poll.mode != 1) {
                        botMessage(src, "No poll is going on.", chan);
                        return;
                    }
                    Poll.mode = 0;
                    botAll(sys.name(src) + " closed the poll started by " + Poll.starter.bold() + "!", 0);
                    Poll.starter = '';

                    if (Poll.votes === 0) {
                        botAll("No one voted on the " + Poll.subject + " poll!", 0);
                        Poll.subject = '';
                        Poll.options = {};
                        Poll.votes = 0;
                        return;
                    }

                    botAll(Poll.subject + " - Results:", 0);
                    Poll.subject = '';

                    for (x in Poll.options) {
                        option = Poll.options[x];
                        current_votes = option.votes.length;
                        botAll(x + ". " + option.name + " - " + current_votes, chan);
                    }

                    Poll.options = {};
                    Poll.votes;
                },

                /* -- Mod Commands: Command Status -- */
                enable: function () {
                    if (cmdData === "me") {
                        if (!CommandsEnabled.me) {
                            botAll('/me was turned on!', 0);
                            CommandsEnabled.me = true;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/me is already on.', chan);
                        return;
                    }
                    else if (cmdData === "roulette") {
                        if (!CommandsEnabled.roulette) {
                            botAll('/roulette was turned on!', 0);
                            CommandsEnabled.roulette = true;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/roulette is already on.', chan);
                        return;
                    }
                    else if (cmdData === 'catch') {
                        if (!CommandsEnabled._catch_) {
                            botAll('/catch was turned on!', 0);
                            CommandsEnabled._catch_ = true;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/catch is already on.', chan);
                        return;
                    }
                    else if (cmdData === "attack") {
                        if (!CommandsEnabled.attack) {
                            botAll('/attack was turned on!', 0);
                            CommandsEnabled.attack = true;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/attack is already on.', chan);
                    }
                },

                disable: function () {
                    if (cmdData === "me") {
                        if (CommandsEnabled.me) {
                            botAll('/me was turned off!', 0);
                            CommandsEnabled.me = false;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/me is already off.', chan);
                        return;
                    }
                    else if (cmdData === "roulette") {
                        if (CommandsEnabled.roulette) {
                            botAll('/roulette was turned off!', 0);
                            CommandsEnabled.roulette = false;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/roulette is already off.', chan);
                        return;
                    }
                    else if (cmdData === 'catch') {
                        if (CommandsEnabled._catch_) {
                            botAll('/catch was turned off!', 0);
                            CommandsEnabled._catch_ = false;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/catch is already off.', chan);
                        return;
                    }
                    else if (cmdData === "attack") {
                        if (CommandsEnabled.attack) {
                            botAll('/attack was turned off!', 0);
                            CommandsEnabled.attack = false;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/attack is already off.', chan);
                    }
                },

                /* -- Mod Commands: Message Sending -- */
                send: function () {
                    sys.sendAll(commandData, chan);
                },

                /* -- Mod Commands: MOTD -- */
                changemotd: function () {
                    if (cmdData === "default") {
                        if (!motd) {
                            botMessage(src, "The MOTD is already set to default.", chan);
                            return;
                        }

                        motd = false;
                        cache.write("motd", false);

                        cache.remove("MOTDMessage");
                        cache.remove("MOTDSetter");

                        botEscapeMessage(src, "You changed the MOTD back to default.", chan);
                        botAllExcept(src, "The MOTD has been changed to default by " + player(src) + ".", 0, "");
                        return;
                    }

                    motd = true;
                    cache.write("motd", true);

                    cache.write("MOTDMessage", commandData);
                    cache.write("MOTDSetter", sys.name(src));

                    botEscapeMessage(src, "You changed the MOTD to: " + commandData, chan);
                    botAllExcept(src, "The MOTD has been changed by " + player(src) + ".", 0, "");
                },

                /* -- Mod Commands: Kick -- */
                kick: function () {
                    var tarid = sys.id(mcmd[0]);
                    var tn = sys.name(tarid);
                    if (sys.maxAuth(dbIp) >= sys.auth(src) && !host) {
                        botMessage(src, "Can't kick that person!", chan);
                        return;
                    }

                    if (tar === undefined) {
                        botMessage(src, "This person is not online or doesn't exist.", chan);
                        return;
                    }

                    if (self(src, tar)) {
                        botMessage(src, "Can't kick yourself!", chan);
                        return;
                    }

                    sys.sendHtmlAll("<timestamp/> <font color=midnightblue><b>" + tn + " was kicked from the server by " + sys.name(src) + "!</b></font>", 0);
                    if (mcmd[1] != undefined) {
                        mcmd[1] = cut(mcmd, 1, ':');
                        sys.sendHtmlAll("<timestamp/> <font color=midnightblue><b>Reason: </b></font>" + mcmd[1], 0);
                    }
                    kick(tarid);
                },

                /* -- Mod Commands: Mute -- */
                mute: function () {
                    script.issueMute(src, mcmd[0], cut(mcmd, 3, ':'), Number(mcmd[1]), chan, mcmd[2]);
                },

                unmute: function () {
                    script.removeMute(src, mcmd[0], cut(mcmd, 1, ':'), chan);
                },

                /* -- Mod Commands: Ban -- */
                tempban: function () {
                    mcmd[3] = cut(mcmd, 3, ':');
                    script.issueTempBan(src, mcmd[0], mcmd[3], Number(mcmd[1]), chan, mcmd[2]);
                },

                untempban: function () {
                    mcmd[1] = cut(mcmd, 1, ':');
                    script.removeTempBan(src, mcmd[0], mcmd[1], chan);
                },

                /* -- Mod Commands: Aliases -- */
                aliases: function () {
                    if (!/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(commandData)) {
                        botMessage(src, "Invalid IP.", chan);
                        return;
                    }
                    var alias = sys.aliases(commandData);
                    if (alias === "") {
                        botMessage(src, "This IP is not registered.", chan);
                        return;
                    }
                    var temp = alias;
                    botMessage(src, "The aliases of " + commandData + " are: ", chan);
                    botMessage(src, "<small><b>" + alias.join("</b>, <b>") + "</b></small>", chan);
                    botMessage(src, temp.length + " aliases in total.", chan);
                },

                hostname: function () {
                    if (dbIp == undefined) {
                        botMessage(src, "That player does not exist.", chan);
                        return;
                    }

                    script.resolveLocation(0, dbIp, true);
                    botMessage(src, "The hostname of " + commandData.name().bold() + " is: " + DataHash.locations[dbIp].hostname, chan);
                },

                superimp: function () {
                    if (commandData == "") {
                        botMessage(src, "Specify a name to imp.", chan);
                        return;
                    }
                    if (commandData.length > 20) {
                        botMessage(src, "Specify a shorter name.", chan);
                        return;
                    }

                    if (ify.onChangeName() == "disallow") {
                        botMessage(src, "Ify is active. You can't superimp!", chan);
                        return;
                    }

                    if (poUser.superimp == undefined) {
                        poUser.superimp = sys.name(src);
                    }

                    botAll(sys.name(src) + " superimped " + commandData + "!", 0);
                    sys.changeName(src, "~" + commandData + "~");
                },

                superimpoff: function () {
                    if (poUser.superimp == undefined) {
                        botMessage(src, "You aren't superimping!", chan);
                        return;
                    }

                    if (ify.onChangeName() == "disallow") {
                        botMessage(src, "Ify is active. You can't turn superimp off now!", chan);
                        return;
                    }

                    sys.changeName(src, poUser.superimp);
                    botAll(sys.name(src) + " changed their name back!", 0);
                }
            })

            modCommands[removespaces(ModName).toLowerCase() + "commands"] = function () {
                var ct = new Command_Templater(ModName + " Commands");

                ct.register("impcommands", "Displays the Impersonation commands.");
                ct.register("silencecommands", "Displays the Silence commands.");
                ct.register("cmdcommands", "Displays the Command commands.");
                ct.register("moderatecommands", "Displays the Moderation commands.");
                ct.register("poll", ["{Text::Any Subject}", "{Text::Any Options}"], "To start a poll with the subject as {Text::Any Subject}, and options as {Text::Any Options}, which are separated with '/'.");
                ct.register("closepoll", "To close the running poll.");
                ct.register("info", ["{Player::Database Player}"], "Displays player information of {Player::Database Player}.");
                ct.register("aliases", ["{Text::Any IP}"], "Displays the aliases of {Text::Any IP}.");
                ct.register("hostname", ["{Player::Database Player}"], "Displays the hostname of {Player::Database Player}.");
                ct.register('changemotd', ["{Text::Any MOTD}"], "Changes the Message of the Day to {Text::Any MOTD}. Use /changemotd default to set this to default.");
                ct.register("passauth", ["{Player::Database Player}"], "To pass your auth to {Player::Database Player}. The alias must be registered and under your ip.");

                ct.render(src, chan);
            }

            adminCommands = ({
                leaguecommands: function () {
                    var ct = new Command_Templater("League Commands");

                    ct.register("changegl", ["{Text::Number Number}", "{Player::Database Player}"], "To make {Player::Database Player} the league Gym Leader #{Text::Number Spot}, which can be 1-16.");
                    ct.register("changeelite", ["{Text::Number Number}", "{Player::Database Player}"], "To make {Player::Database Player} the league Elite Four #{Text::Number Spot}, which can be 1-4.");
                    ct.register("changechampion", ["{Player::Database Player}"], "To make {Player::Database Player} the league champion.");

                    ct.register("removegl", ["{Text::Number Spot}"], "To remove Gym Leader {Text::Number Spot} from the league. {Text::Number Spot} can be 1-4.");
                    ct.register("removeelite", ["{Text::Number Spot}"], "To remove Elite Four {Text::Number Spot} from the league. {Text::Number Spot} can be 1-4.");
                    ct.register("removechampion", "To remove the league's champion.");

                    ct.render(src, chan);
                },

                authcommands: function () {
                    var ct = new Command_Templater("Authority Commands", true);

                    ct.span("Authority " + AdminName + " Commands");

                    if (Config.AdminsCanAuth) {
                        ct.register(removespaces(UserName).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(UserName) + ".");
                        ct.register(removespaces(ModName).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(ModName) + ".");
                        ct.register("tempauth", ["{Player::Database Player}", "{Text::Number Auth Level}", "{Text::Number Time}", "{Text::Time Time Unit}"], "To give {Player::Database Player} temporary authority. Any other authing command (except tourauth) will delete this temp auth. Valid levels are: 1, 2, 3, 4. Only " + Grammar.es(OwnerName) + " can do 2, 3, or 4.");
                    }
                    ct.register(removespaces(Tour0).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(Tour0) + ".");
                    ct.register(removespaces(Tour1).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(Tour1) + ".");

                    if (permission(src, 3)) {
                        ct.span("Authority " + OwnerName + " Commands");

                        if (!Config.AdminsCanAuth) {
                            ct.register(removespaces(UserName).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(UserName) + ".");
                            ct.register(removespaces(ModName).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(ModName) + ".");
                            ct.register("tempauth", ["{Player::Database Player}", "{Text::Number Auth Level}", "{Text::Number Time}", "{Text::Time Time Unit}"], "To give {Player::Database Player} temporary authority. Any other authing command (except tourauth) will delete this temp auth. Valid levels are: 1, 2, 3, 4.");
                        }
                        ct.register(removespaces(AdminName).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(AdminName) + ".");
                        ct.register(removespaces(OwnerName).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(OwnerName) + ".");
                        ct.register(removespaces(InvisName).toLowerCase(), ["{Player::Database Player}"], "To make {Player::Database Player} " + Grammar.a(InvisName) + ".");
                        ct.register("changeauthname", ["{Text::Choice Server/Channel/Tournament/CTour}", "{Text::Number Auth Level}", "{Text::Any New Name}"], "To change the name of the {Text::Number Auth Level} authority level, which is part of {Text::Choice Auth Levels}, to {Text::Any New Name}. Server can be 0-4 | Channel can be 0-3 | Tournament and CTour can be 0-1. {Text::Any New Name} can have spaces, letters 0-9, and characters a-Z_.");
                    }

                    if (host) {
                        ct.register("evaluser", ["{Player::Database Player}"], "To make {Player::Database Player} an Eval User.");
                        ct.register("evalop", ["{Player::Database Player}"], "To make {Player::Database Player} an Eval Operator. Eval Ops can use eval unregarding their auth, and can use eval when it's locked.");
                    }

                    ct.render(src, chan);
                },

                supersilence: function () {
                    if (silence.level) {
                        botMessage(src, "The chat is already silenced.", chan);
                        return;
                    }

                    var time = commandData * 60,
                        timeStr = "!";
                    if (!isNaN(time) && commandData !== "") {
                        timeStr = " for " + getTimeString(time) + "!";
                    }

                    silence = {
                        "by": sys.name(src),
                        "level": 2
                    };

                    botAll(player(src) + " super-silenced the chat" + timeStr);

                    if (timeStr === "!") {
                        return;
                    }

                    timeOut = function () {
                        if (!silence.level) {
                            return;
                        }

                        silence = {
                            "by": "",
                            "level": 0
                        };

                        botAll("Silence is over.");
                    }

                    sys.delayedCall(timeOut, time);
                },

                implock: function () {
                    if (implock) {
                        botMessage(src, "Implock is already on.", chan);
                        return;
                    }

                    botAll("Implock has been turned on!", 0);
                    implock = true;
                    cache.write("implock", true);
                },

                impunlock: function () {
                    if (!implock) {
                        botMessage(src, "Implock is already off.", chan);
                        return;
                    }

                    botAll("Implock has been turned off!", 0);
                    implock = false;
                    cache.write("implock", false);
                },

                activestyle: function () {
                    StyleManager.setActiveStyle(src, commandData, chan);
                },

                activeicons: function () {
                    IconManager.setActiveIcons(src, commandData, chan);
                },

                changegl: function () {
                    mcmd[0] = Math.round(parseInt(mcmd[0]));
                    if (isNaN(mcmd[0]) || mcmd[0] > 16 || mcmd[0] < 1) {
                        botMessage(src, "You can't make over 16 gym leaders.", chan);
                        return;
                    }
                    if (sys.dbIp(mcmd[1]) === undefined) {
                        botMessage(src, "That person doesn't exist in the db.", chan);
                        return;
                    }
                    DataHash.league.gym[mcmd[0]] = mcmd[1];
                    botEscapeAll(sys.name(src) + " made " + mcmd[1] + " gym leader #" + mcmd[0] + "!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                changeelite: function () {
                    mcmd[0] = Math.round(parseInt(mcmd[0]));
                    if (isNaN(mcmd[0]) || mcmd[0] > 4 || mcmd[0] < 1) {
                        botMessage(src, "You can't make over 4 elite members.", chan);
                        return;
                    }
                    if (sys.dbIp(mcmd[1]) === undefined) {
                        botMessage(src, "That person doesn't exist in the db.", chan);
                        return;
                    }
                    DataHash.league.elite[mcmd[0]] = mcmd[1];
                    botEscapeAll(sys.name(src) + " made " + mcmd[1] + " elite four number #" + mcmd[0] + "!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                changechampion: function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That person doesn't exist in the db.", chan);
                        return;
                    }
                    DataHash.league["Champion"] = commandData;
                    botEscapeAll(sys.name(src) + " made " + commandData + " the champion!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                removegl: function () {
                    mcmd[0] = Math.round(parseInt(mcmd[0]));
                    if (isNaN(mcmd[0]) || mcmd[0] > 16 || mcmd[0] < 1) {
                        botMessage(src, "Select 1-16.", chan);
                        return;
                    }
                    delete DataHash.league.gym[mcmd[0]];
                    botEscapeAll(sys.name(src) + " removed gym leader #" + mcmd[0] + "!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                removeelite: function () {
                    mcmd[0] = Math.round(parseInt(mcmd[0]));
                    if (isNaN(mcmd[0]) || mcmd[0] > 4 || mcmd[0] < 1) {
                        botMessage(src, "Select 1-4.", chan);
                        return;
                    }
                    delete DataHash.league.elite[mcmd[0]];
                    botEscapeAll(sys.name(src) + " removed elite four #" + mcmd[0] + "!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                removechampion: function () {
                    DataHash.league["Champion"] = "";
                    botEscapeAll(sys.name(src) + " removed the champion!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                ban: function () {
                    if (dbIp === undefined || mcmd[0] == "") {
                        botMessage(src, "No player exists by this name!", chan);
                        return;
                    }
                    if (sys.maxAuth(dbIp) >= hpAuth(src) && !isHost(src)) {
                        botMessage(src, "Can't do that to higher or equal auth!", chan);
                        return;
                    }

                    var banlist = sys.banList(),
                        a, toBan = mcmd[0].toLowerCase();

                    for (a in banlist) {
                        if (banlist[a] === toBan) {
                            botMessage(src, "That person is already banned!", chan);
                            return;
                        }
                    }

                    var me = player(src),
                        name = mcmd[0],
                        target = player(name);

                    botAll(target + " was banned from the server by " + me + "!", 0);

                    if (mcmd[1] != undefined) {
                        mcmd[1] = cut(mcmd, 1, ':');
                        botEscapeAll("Reason: " + mcmd[1], 0);
                    }

                    ban(name);
                },

                unban: function () {
                    if (sys.dbIp(mcmd[0]) === undefined) {
                        botMessage(src, "No player exists by this name!", chan);
                        return;
                    }

                    var banlist = sys.banList();

                    for (a in banlist) {
                        if (sys.dbIp(mcmd[0]) === sys.dbIp(banlist[a])) {
                            sys.unban(mcmd[0]);

                            var me = player(src);
                            botAll(player(mcmd[0]) + " was unbanned from the server by " + me + "!", 0);

                            if (mcmd[1] != undefined) {
                                mcmd[1] = cut(mcmd, 1, ':');
                                botEscapeAll('Reason: ' + mcmd[1], 0);
                            }
                            return;
                        }
                    }

                    botMessage(src, "He/she's not banned!", chan);
                },

                clearchat: function () {
                    var me = player(src),
                        y;

                    for (y = 0; y < 2999; y++) {
                        sys.sendAll("", chan);
                    }

                    botAll(me + " cleared the chat!");
                },

                showteam: function () {
                    if (tar === undefined) {
                        botMessage(src, "That person seems to be offline or does not exist.", chan);
                        return;
                    }
                    
                    if (typeof mcmd[1] === "string") {
                        return script.importable(src, tar, chan, true);
                    }
                    script.importable(src, tar, chan);
                },

                masskick: function () {
                    botAll(player(src) + " started the masskick!");
                    massKick();
                },

                'ify': function () {
                    ify.command_ify(src, commandData, chan);
                },

                'unify': function () {
                    ify.command_unify(src, commandData, chan);
                },

                autoidle: function () {
                    if (dbIp === undefined) {
                        botMessage(src, "Unknown target!", chan);
                        return;
                    }

                    var name = mcmd[0];
                    mcmd[0] = mcmd[0].toLowerCase();
                    if (!mcmd[1]) {
                        mcmd[1] = "";
                    }

                    var only_msg_change = false;

                    if (typeof DataHash.idles[mcmd[0]] != "undefined") {
                        if (DataHash.idles[mcmd[0]].entry === mcmd[1]) {
                            botMessage(src, "This person already has Auto-Idle. You can only change the entry message.", chan);
                            return;
                        }
                        else {
                            only_msg_change = true;
                        }
                    }

                    if (!only_msg_change) {
                        botAll(name + " was given Auto-Idle by " + player(src) + ".", 0);
                    }
                    else {
                        botMessage(src, "The Auto-Idle Entry Message of " + name + " was changed.", chan);
                    }

                    if (tar != undefined) {
                        sys.changeAway(tar, true);
                    }

                    mcmd[1] = cut(mcmd, 1, ':');
                    DataHash.idles[mcmd[0]] = {
                        'entry': mcmd[1],
                        'setterauth': sys.auth(src)
                    };

                    cache.write("idles", JSON.stringify(DataHash.idles));
                },

                autoidleoff: function () {
                    if (dbIp == undefined) {
                        botMessage(src, "This player doesn't exist.", chan);
                        return;
                    }

                    var name = mcmd[0];
                    mcmd[0] = mcmd[0].toLowerCase();

                    if (!DataHash.idles.has(mcmd[0])) {
                        botMessage(src, "This player doesn't have auto idle.", chan);
                        return;
                    }

                    botAll(player(src) + " removed " + Grammar.es(name) + " auto idle!", 0);

                    if (tar != undefined) {
                        sys.changeAway(tar, false);
                    }

                    DataHash.idles.remove(mcmd[0]);
                    cache.write("idles", JSON.stringify(DataHash.idles));
                },

                bot: function () {
                    if (commandData == "") {
                        botMessage(src, "Specify a name for the bot!", chan);
                        return;
                    }
                    if (commandData.length > 40) {
                        botMessage(src, "The bot name cannot be over 40 characters. Current: " + commandData.length, chan);
                        return;
                    }
                    botAll("The bot was changed to " + commandData + "</i> by " + sys.name(src) + "!", 0);
                    Bot.bot = commandData;
                    cache.write("Bot", JSON.stringify(Bot));
                },

                botcolor: function () {
                    if (commandData == "") {
                        botMessage(src, "Specify a name for the bot color!", chan);
                        return;
                    }
                    if (!sys.validColor(commandData)) {
                        botMessage(src, "The bot color is invalid.", chan);
                        return;
                    }

                    botAll("The bot color was changed to <font color=" + commandData + ">" + commandData + "</font> by " + sys.name(src) + "!", 0);
                    Bot.botcolor = commandData;
                    cache.write("Bot", JSON.stringify(Bot));
                },

                talk: function () {
                    if (commandData === "") {
                        botMessage(src, "Specify a message.", chan);
                        return;
                    }

                    botAll(commandData, chan);
                },

                clantag: function () {
                    if (commandData.isEmpty()) {
                        botMessage(src, "Specify a tag.", chan);
                        return;
                    }
                    if (commandData === ClanTag) {
                        botMessage(src, "This is already the clan tag.", chan);
                        return;
                    }

                    botAll(player(src) + " changed the clan tag to " + commandData.bold() + "!", 0);

                    ClanTag = commandData;
                    cache.write("ClanTag", ClanTag);

                    Clantag = {};
                    Clantag.full = ClanTag;
                    Clantag.fullText = Clantag.full.replace(/[\[\]\{\}]/gi, "").split(' ').join('');
                    Clantag.fullTextLower = Clantag.fullText.toLowerCase();
                },

                tempauth: function () {
                    script.tAuth(src, mcmd[0], Number(mcmd[1]), Number(mcmd[2]), chan, mcmd[3]);
                },

                forcebattle: function () {
                    if (!mcmd[1]) {
                        mcmd[1] = "";
                    }
                    if (!mcmd[2]) {
                        mcmd[2] = "";
                    }
                    if (!mcmd[3]) {
                        mcmd[3] = "";
                    }
                    if (!mcmd[4]) {
                        mcmd[4] = "";
                    }

                    var tierName = validTier(mcmd[2]),
                        clauses = 0;

                    if (tierName) {
                        clauses = sys.getClauses(tierName);
                    }

                    var player1 = sys.id(mcmd[0]),
                        player2 = sys.id(mcmd[1]),
                        pl1 = sys.name(player1),
                        pl2 = sys.name(player2);

                    if (player1 === undefined || player2 === undefined) {
                        botMessage(src, "Those players don't exist!", chan);
                        return;
                    }

                    if (player1 === player2) {
                        botMessage(src, "Can't force battles between the same player!", chan);
                        return;
                    }

                    if (sys.battling(player1) || sys.battling(player2)) {
                        botMessage(src, "These players are already battling.", chan);
                        return;
                    }

                    if (sys.teamCount(player1) == 0 || sys.teamCount(player2) == 0) {
                        botMessage(src, "Both players must have one team.", chan);
                        return;
                    }

                    var modeToString = mcmd[3].toLowerCase(),
                        mode = 0;

                    if (modeToString == "doubles") {
                        mode = 1;
                    } else if (modeToString == "triples") {
                        mode = 2;
                    }

                    var rated = mcmd[4].toLowerCase();
                    if (!on(rated) || rated != "rated") {
                        rated = false;
                    }
                    else {
                        rated = true;
                    }

                    var player1_team = firstTeamForTier(player1, tier),
                        player2_team = firstTeamForTier(player2, tier);

                    if (player1_team == -1) {
                        player1_team = 0;
                    }
                    if (player2_team == -1) {
                        player2_team = 0;
                    }

                    sys.forceBattle(player1, player2, player1_team, player2_team, clauses, mode, rated);
                    script.afterBattleStarted(src, dest, clauses, rated, player1_team, player2_team);
                    botEscapeAll("A battle between " + pl1 + " and " + pl2 + " has been forced by " + sys.name(src) + "!", 0);
                }
            });

            adminCommands[removespaces(AdminName).toLowerCase() + "commands"] = function () {
                var ct = new Command_Templater(AdminName + " Commands");

                ct.register("leaguecommands", "Displays the League commands.");
                ct.register("authcommands", "Displays the Authority commands.");
                ct.register("masskick", "Kicks all users from the server.");
                ct.register("clearchat", "Clears the chat.");
                ct.register("showteam", ["{Player::Online Player}", "{Text::Any <u>\"simple\"</u>}"], "Displays {Player::Online Player}'s team. If {Text::Any <u>\"simple\"</u>} is specified (can be anything), then displays an importable instead (no images).");
                ct.register("forcebattle", ["{Player::Online Player1}", "{Player::Online Player2}", "{Text::Any <u>Tier</u>}", "{Text::Any <u>Mode</u>}", "{Text::Any <u>Rated</u>}"], "Forces a battle between {Player::Online Player1} and {Player::Online Player2}, using {Text::Any Tier}'s clauses, {Text::Any Mode} as battle mode, and {Text::Any Rated} deciding if the battle is rated. Tier must be a valid tier for clauses (teams of this are also prioritized if any). Mode can be Doubles or Triples. Rated must be one of the following: true, rated, yes, on. If not, the battle won't be rated.");
                ct.register("bot", ["{Text::Any Name}"], "Changes the bot's name to {Text::Any Name}.");
                ct.register("botcolor", ["{Text::Any Color}"], "Changes the bot's color to {Text::Any Color}.");
                ct.register("clantag", ["{Text::Any Clan Tag}"], "Changes the clan tag to {Text::Any Clan Tag}. If Tag is None, turns the clan feature off.");
                ct.register("autoidle", ["{Player::Database Player}", "{Text::Any <u>Entry Message</u>}"], "To enable automatic idling of {Player::Database Player} with an optional entry message displayed when he/she logs on. Also works when you only want to change the entry message.");
                ct.register("autoidleoff", ["{Player::Database Player}"], "Removes {Player::Database Player}'s auto idle.");

                ct.render(src, chan);
            }

            if (Config.AdminsCanAuth) {
                adminCommands[removespaces(UserName).toLowerCase()] = function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That player doesn't exist");
                        return;
                    }
                    if (dbAuth === 0) {
                        botMessage(src, "That player already is " + UserName + "!", chan);
                        return;
                    }
                    if (sys.auth(src) <= sys.maxAuth(dbIp) && sys.auth(src) < 3) {
                        botMessage(src, "You can't deauth this person!", chan);
                        return;
                    }

                    if (DataHash.tempauth[cmdData] != undefined) {
                        delete DataHash.tempauth[cmdData];
                        cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                    }

                    if (tar != undefined) {
                        botEscapeAll(sys.name(tar) + " has been made " + UserName + " by " + sys.name(src) + ".", 0);
                        sys.changeAuth(tar, 0);
                        return;
                    }

                    botEscapeAll(commandData + " has been made " + UserName + " by " + sys.name(src) + ".", 0);
                    sys.changeDbAuth(commandData, 0);

                    kickFromChannel(commandData, scriptchannel);
                    kickFromChannel(commandData, watch);
                    kickFromChannel(commandData, staffchannel);
                }

                adminCommands[removespaces(ModName).toLowerCase()] = function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That player doesn't exist", chan);
                        return;
                    }
                    if (dbAuth === 1) {
                        botMessage(src, "That player already is " + ModName + "!", chan);
                        return;
                    }
                    if (!sys.dbRegistered(commandData)) {
                        botMessage(src, "This player is not registered.", chan);
                        if (tar != undefined) {
                            botMessage(tar, "Please register for auth.");
                        }
                        return;
                    }
                    if (sys.auth(src) <= sys.maxAuth(dbIp) && sys.auth(src) < 3) {
                        botMessage(src, "You can't deauth this person!", chan);
                        return;
                    }

                    if (DataHash.tempauth[cmdData] != undefined) {
                        delete DataHash.tempauth[cmdData];
                        cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                    }

                    if (tar != undefined) {
                        botEscapeAll(sys.name(tar) + " has been made " + ModName + " by " + sys.name(src) + ".", 0);
                        sys.changeAuth(tar, 1);
                        return;
                    }
                    botEscapeAll(commandData + " has been made " + ModName + " by " + sys.name(src) + ".", 0);
                    sys.changeDbAuth(commandData, 1);
                    putInAuthChan(commandData, "mod");
                }

                adminCommands[removespaces(Tour0).toLowerCase()] = function () {
                    if (mcmd[0] === '') {
                        botMessage(src, "Specify a name!", chan);
                        return;
                    }
                    var tari = JSESSION.users(tar);
                    if (dbIp === undefined) {
                        botMessage(src, "That player doesn't exist", chan);
                        return;
                    }
                    var h = mcmd[0].toLowerCase();
                    if (DataHash.megausers[h] === undefined) {
                        botMessage(src, "That person is already " + Tour0 + "!", chan);
                        return;
                    }

                    delete DataHash.megausers[h];
                    cache.write("megausers", JSON.stringify(DataHash.megausers));

                    if (tar != undefined) {
                        botEscapeAll(sys.name(tar) + " has been made " + Tour0 + " by " + sys.name(src) + ".", 0);
                        tari.megauser = false;
                        sys.kick(tar, staffchannel);
                        return;
                    }
                    botEscapeAll(mcmd[0].name() + " has been made " + Tour0 + " by " + sys.name(src) + ".", 0);
                }

                adminCommands[removespaces(Tour1).toLowerCase()] = function () {
                    if (mcmd[0] === '') {
                        botMessage(src, "Specify a name!", chan);
                        return;
                    }
                    var tari = JSESSION.users(tar);
                    if (dbIp === undefined) {
                        botMessage(src, "That player doesn't exist", chan);
                        return;
                    }
                    var h = mcmd[0].toLowerCase();
                    if (DataHash.megausers[h] != undefined) {
                        botMessage(src, "That person is already " + Tour1 + "!", chan);
                        return;
                    }

                    DataHash.megausers[h] = {
                        "name": h.name()
                    }

                    cache.write("megausers", JSON.stringify(DataHash.megausers));

                    if (tar != undefined) {
                        botEscapeAll(sys.name(tar) + " has been made " + Tour1 + " by " + sys.name(src) + ".", 0);
                        tari.megauser = true;
                        putInAuthChan(mcmd[0], "mu");
                        return;
                    }

                    botEscapeAll(mcmd[0].name() + " has been made " + Tour1 + " by " + sys.name(src) + ".", 0);
                }
            }

            ownerCommands = ({
                dbcommands: function () {
                    var ct = new Command_Templater("Database Commands");

                    ct.register("clearpass", ["{Player::Database Player}"], "To clear {Player::Database Player}'s password.");
                    ct.register("exporttiers", "To export all tiers to tier_(tiername).txt.");
                    ct.register("exportplayers", "To export the all players in the database to members.txt.");
                    ct.register("deleteplayer", ["{Player::Database Player}"], "To delete {Player::Database Player} from the players database.");
                    ct.register("dbplayers", "Displays all players in the players database.");

                    ct.render(src, chan);
                },

                chatcommands: function () {
                    var ct = new Command_Templater("Chat Commands");

                    ct.register("rankicon", "To toggle Rank Icons and BB Code.");
                    ct.register("autoedit", "To toggle automatic grammar correction.");
                    ct.register("messagelimit", ["{Text::Number Limit}"], "To set a character limit for players under " + AdminName + " to {Text::Number Limit}.");
                    ct.register("autokick", "To toggle automatic kicks.");
                    ct.register("automute", "To toggle automatic mutes.");

                    ct.render(src, chan);
                },

                servercommands: function () {
                    var ct = new Command_Templater("Server Commands");

                    ct.register("public", "To make the server public.");
                    ct.register("private", "To make the server private.");
                    ct.register("allowchannels", "To toggle the allowance of creation of non-script channels.");
                    ct.register("battles", "To toggle the allowance of battles.");

                    ct.render(src, chan);
                },

                anncommands: function () {
                    var ct = new Command_Templater("Announcement Commands");

                    ct.register("getannouncement", "Displays the raw announcement.");
                    ct.register("changeannouncement", ["{Text::Any Text}"], "To change the announcement to {Text::Any Text}.");
                    ct.register("testannouncement", ["{Text::Any Text}"], "To change the announcement to {Text::Any Text}, for yourself only (useful when testing).");

                    ct.render(src, chan);
                },

                tiercommands: function () {
                    var ct = new Command_Templater("Tier Commands");

                    ct.register("updatetiers", ["{Text::Any <u>URL</u>}"], "To update the server's tiers from {Text::Any URL} (default is <a href='http://pokemon-online.eu/tiers.xml'>pokemon-online.eu/tiers.xml</a>). Tiers must be XML.");
                    ct.register("resetladder", ["{Text::Any Tier}"], "To reset {Text::Any Tier}'s ladders.");
                    ct.register("resetladders", "To reset all ladders.");
                    ct.register("banfrom", ["{Text::Any Tier}", "{Text::Any Pokemon}", "{Text::Any Ability}"], "To ban the ability, {Text::Any Ability}, on {Text::Any Pokemon}, in {Text::Any Tier}.");
                    ct.register("unbanfrom", ["{Text::Any Tier}", "{Text::Any Pokemon}", "{Text::Any Ability}"], "To unban the ability, {Text::Any Ability}, on {Text::Any Pokemon}, in {Text::Any Tier}.");
                    ct.register("listbans", "Displays all banned abilities.");

                    ct.render(src, chan);
                },

                listbans: function () {
                    var banned = DataHash.bannedAbilities,
                        tt = new Table_Templater("Ability Bans", "brown", "3"),
                        x, poke, z, abilities;

                    tt.register(["Tier", "Pokemon", "Abilities"], true);

                    for (x in banned) {
                        poke = banned[x];
                        for (z in poke) {
                            abilities = poke[z];
                            tt.register([x, z, abilities.join(", ")], false);
                        }
                    }


                    tt.render(src, chan);
                },

                randomspam: function () {
                    var spam_user = [],
                        spam_color = [],
                        spam_array = [],
                        spam_script = "Script Check",
                        spam_script_color = Bot.botcolor.
                        x,
                        pl = sys.playerIds(),
                        cur, curn, randomUser = function () {
                            var ret = Math.round(pl.length * Math.random());
                            if (ret === 0) {
                                ret = "~~Server~~";
                            }
                            else {
                                ret = sys.name(ret);
                                if (ret === undefined) {
                                    ret = randomUser();
                                }
                            }
                            return ret;
                        },
                        rCmdList = ["rangeban", "ban", "mute", "kick", "tempban"],
                        reasons = ["Existance", "Spam", "None. I'm just abusive.", "pro", "STFU!"],
                        randomCommand = function () {
                            var ret = Math.floor(rCmdList.length * Math.random());

                            if (ret === undefined || ret === "undefined") {
                                ret = randomCommand();
                            }

                            return rCmdList[ret];
                        },
                        randomReason = function () {
                            var ret = Math.floor(reasons.length * Math.random());

                            if (ret === undefined || ret === "undefined") {
                                ret = randomReason();
                            }

                            return reasons[ret];
                        },
                        min = parseInt(commandData),
                        currentRand;

                    if (isNaN(min) || min > 75) {
                        min = 30;
                    }

                    for (x in pl) {
                        cur = pl[x];
                        currentRand = sys.rand(1, min + 1);
                        while (currentRand != 0) {
                            curn = sys.name(cur);
                            spam_user.push(curn);
                            spam_color.push(script.namecolor(cur));

                            spam_array.push("STOP RIGHT THERE " + curn.toUpperCase() + " YOU FUCKER", "This is bad. I'm blaming " + curn + "!", "Do you have some spare change " + curn + "???", curn + " was banned by " + randomUser() + "!", "\\" + randomCommand() + " " + randomUser());
                            currentRand--;
                        }
                    }

                    spam_array.sort(function () {
                        return 0.5 - Math.random();
                    });

                    spam_user.sort(function () {
                        return 0.5 - Math.random();
                    });

                    spam_color.sort(function () {
                        return 0.5 - Math.random();
                    });

                    var y, sal = spam_array.length,
                        sul = spam_user.length,
                        scl = spam_color.length,
                        random_spam = '',
                        random_color = '',
                        random_user = '';

                    for (y = 0; y < min; y++) {
                        random_spam = spam_array[Math.floor(sal * Math.random())];
                        random_color = spam_color[Math.floor(scl * Math.random())];
                        random_user = spam_user[Math.floor(sul * Math.random())];

                        if (random_spam.contains("Fatal Script Error:")) {
                            random_color = spam_script_color;
                            random_user = spam_script;
                        }
                        if (random_spam.contains("was banned by") && !random_user.contains("was banned by")) {
                            sys.sendHtmlAll("<font color=darkorange><timestamp/><b>" + random_spam + "</b></font>", 0);
                            sys.sendHtmlAll("<font color=darkorange><timestamp/><b>Reason:</b></font> " + randomReason(), 0);
                            continue;
                        }

                        sys.sendHtmlAll("<font color=" + random_color + "><timestamp/><b>" + random_user + ":</b></font> " + random_spam, 0);
                    }

                },

                recreate: function () {
                    var m = mcmd[0].toLowerCase(),
                        type = "";
                    if (m === "global") {
                        JSESSION.GlobalData = {};
                        type = "Globals";
                    }
                    else if (m === "user" || m === "users") {
                        JSESSION.UserData = {};
                        type = "Users";
                    }
                    else if (m === "channel" || m === "channels") {
                        JSESSION.ChannelData = {};
                        cData.loadDataForAll();
                        type = "Channels";
                    }
                    else if (m === "tour" || m === "tours") {
                        var x, z = JSESSION.ChannelData,
                            curr;
                        for (x in z) {
                            curr = z[x];
                            if (curr.toursEnabled) {
                                delete curr.tour;
                                curr.tour = new Tours(x);
                            }
                        }
                        type = "Channel Tournaments";
                    }
                    else {
                        JSESSION.ChannelData = {};
                        JSESSION.UserData = {};
                        JSESSION.GlobalData = {};
                        type = "Channels, Users and Global";
                    }

                    JSESSION.refill();
                    botAll("JSESSION " + type + " have been reset by " + player(src) + "!", 0);
                },

                rankicon: function () {
                    UseIcons = !UseIcons;
                    botAll("Rank Icons have been turned " + toOn(UseIcons) + " by " + player(src) + "!", 0);
                    cache.write("UseIcons", UseIcons);
                },

                futurelimit: function () {
                    var pi = parseInt(mcmd[0]);
                    if (isNaN(pi)) {
                        botMessage(src, "Limit must be a number!", chan);
                        return;
                    }

                    if (FutureLimit === pi) {
                        botMessage(src, "The limit is already " + pi + "!", chan);
                        return;
                    }
                    if (FutureLimit > 60) {
                        botMessage(src, "The limit has to be lower than 1 minute.", chan);
                        return;
                    }

                    cache.write("FutureLimit", pi);
                    botAll("The x futures allowed was changed to per " + pi + " seconds by " + sys.name(src) + "!", 0);
                    FutureLimit = pi;
                },

                autoedit: function () {
                    MessageEditor = !MessageEditor;
                    botEscapeAll("Auto Editing has been turned " + toOn(MessageEditor) + " by " + sys.name(src) + "!", 0);
                    cache.write("MessageEditor", MessageEditor);
                },

                messagelimit: function () {
                    commandData = parseInt(commandData);
                    if (isNaN(commandData)) {
                        botMessage(src, "That isn't a valid number.", chan);
                        return;
                    }
                    if (MaxMessageLength === commandData) {
                        botMessage(src, "The message limit is already " + commandData, chan);
                        return;
                    }
                    MaxMessageLength = commandData;
                    cache.write('MaxMessageLength', commandData);
                    botEscapeAll('The message limit has been set to ' + commandData + ' by ' + sys.name(src) + '!', 0);
                },

                getannouncement: function () {
                    botEscapeMessage(src, "The raw announcement is: " + sys.getAnnouncement());
                },

                changeannouncement: function () {
                    if (commandData === "") {
                        commandData = "<";
                    }
                    sys.changeAnnouncement(commandData);
                },

                testannouncement: function () {
                    sys.setAnnouncement(commandData, src);
                },

                updatetiers: function () {
                    var URL = "http://pokemon-online.eu/tiers.xml";
                    if (/http[s]\:\/\//.test(commandData)) {
                        URL = commandData;
                    }
                    sys.webCall(URL, function (resp) {
                        if (resp === "") {
                            botMessage(src, "Couldn't download tiers from " + URL, chan);
                            return;
                        }
                        if (sys.getFileContent('tiers.xml') === resp) {
                            botMessage(src, 'Same tiers.', chan);
                            return;
                        }
                        sys.writeToFile('tiers.xml', resp);
                        sys.reloadTiers();
                        botAll(player(src) + ' updated the tiers!', 0);
                    });
                },

                "public": function () {
                    if (!sys.isServerPrivate()) {
                        botMessage(src, "The server is already public.", chan);
                        return;
                    }


                    var conf = sys.getFileContent("config");
                    conf.replace(/Private=1/, "Private=0");
                    sys.writeToFile("config", conf);

                    sys.makeServerPublic(true);

                    botAll(player(src) + " made the server public!", 0);
                },

                "private": function () {
                    if (sys.isServerPrivate()) {
                        botMessage(src, "The server is already private.", chan);
                        return;
                    }
                    var conf = sys.getFileContent("config");
                    conf.replace(/Private=0/, "Private=1");
                    sys.writeToFile("config", conf);

                    sys.makeServerPublic(false);

                    botAll(player(src) + " made the server private!", 0);
                },

                clearpass: function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (!sys.dbRegistered(commandData)) {
                        botMessage(src, "That person isn't registered.", chan);
                        return;
                    }

                    sendAuth(commandData + "'s password was cleared by " + sys.name(src) + ".");
                    sys.clearPass(commandData);
                    botMessage(src, "You cleared " + commandData + "'s password.", chan);

                    if (tar != undefined) {
                        sys.sendNetworkCommand(tar, 14);
                        botMessage(tar, "<ping/>Your password has been cleared by " + html_escape(sys.name(src)) + ".");
                    }
                },

                reloadscript: function () {
                    var LoadScript = sys.getFileContent("scripts.js");
                    try {
                        sys.changeScript(LoadScript);
                        script.beforeChatMessage(src, "Hooray! New scripts :D", chan);
                    }
                    catch (e) {
                        botMessage(src, FormatError("Error occured.", e), chan);
                        return;
                    }
                },

                rangeban: function () {
                    var ip = mcmd[0].split('.').join("");
                    if (isNaN(ip) || ip === undefined || ip === "") {
                        botMessage(src, "Invalid IP.", chan);
                        return;
                    }

                    var isValidIP = function (ipz, codeat) {
                        var i = ipz.split('.');
                        if ((i[codeat] < 0 || i[codeat] > 255) && i !== undefined) {
                            return false;
                        }

                        for (var z = 0; z < 3; z++) {
                            if (i[z] != undefined) {
                                if (i[z].length > 3) {
                                    return false;
                                }
                            }
                        }

                        if (i[3] != undefined) {
                            return false;
                        }
                        return true;
                    }

                    var c = mcmd[0];
                    if (!isValidIP(c, 0) || !isValidIP(c, 1) || !isValidIP(c, 2)) {
                        botMessage(src, "Invalid IP.", chan);
                        return;
                    }

                    Prune.rangeBans();

                    if (DataHash.rangebans[mcmd[0]] != undefined) {
                        botMessage(src, "Can't ban an already banned IP.", chan);
                        return;
                    }

                    var time = 0,
                        timestr, timeUnitTime = stringToTime(mcmd[2], mcmd[1] * 1);

                    if (!isNaN(timeUnitTime)) {
                        time = sys.time() * 1 + timeUnitTime;
                    }
                    if (time === 0) {
                        timestr = 'forever';
                    }
                    else {
                        timestr = "for " + getTimeString(mcmd[1] * 1 + timeUnitTime);
                    }

                    var re = "None given";
                    if (!isEmpty(mcmd[1])) {
                        re = mcmd[3];
                    }

                    DataHash.rangebans[mcmd[0]] = {
                        by: sys.name(src),
                        why: re,
                        ip: mcmd[0],
                        "time": time
                    };

                    botEscapeAll(sys.name(src) + " banned IP range " + mcmd[0] + " " + timestr + "!", 0);
                    if (re != "None given") {
                        botAll("Reason: " + re, 0);
                    }

                    var l = mcmd[0].length,
                        p = sys.playerIds(),
                        q;

                    for (q in p) {
                        var b = p[q];
                        if (sys.ip(b).substring(0, l) === mcmd[0]) {
                            sys.kick(b);
                        }
                    }

                    cache.write("rangebans", JSON.stringify(DataHash.rangebans));
                },

                rangeunban: function () {
                    Prune.rangeBans();

                    if (DataHash.rangebans.has(commandData)) {
                        botMessage(src, "Removed rangeban for " + commandData + ".", chan);

                        delete DataHash.rangebans[commandData];
                        cache.write("rangebans", JSON.stringify(DataHash.rangebans));
                        return;
                    }

                    botEscapeMessage(src, "Couldn't find range IP " + commandData + " in the range banlist.", chan);
                },

                eval: function () {
                    var isEOp = DataHash.evalops[sys.name(src).toLowerCase()] != undefined;
                    if (evallock && !host && !isEOp) {
                        botMessage(src, 'Eval has been blocked by the host!', chan);
                        return;
                    }

                    var srcname = sys.name(src),
                        code = commandData;

                    sys.sendHtmlAll(BORDER, scriptchannel);
                    botAll(srcname + " evaluated the following code:", scriptchannel);
                    sys.sendHtmlAll("<code>" + html_escape(code) + "</code>", scriptchannel);
                    sys.sendHtmlAll(BORDER, scriptchannel);

                    try {

                        var now = millitime(),
                            result = eval(code),
                            end = millitime();

                        botEscapeAll(result, scriptchannel);

                        var took = end - now,
                            sec = took / 1000,
                            micro = took * 1000;
                        botAll("Code took " + took + " milliseconds / " + sec + " seconds to run. ", scriptchannel);
                    }
                    catch (err) {
                        var err = FormatError("", err);
                        botAll(err, scriptchannel);
                    }

                },

                resetcommandstats: function () {
                    CommandStats.stats.startTime = sys.time() * 1;
                    CommandStats.save();

                    botAll("Command stats were reset by " + player(src) + "!", 0);
                },

                changeauthname: function () {
                    if (isEmpty(mcmd[0]) || isEmpty(mcmd[1]) || isEmpty(mcmd[2])) {
                        botMessage(src, "Specify the type of auth, the level, and it's new name.", chan);
                        return;
                    }
                    mcmd[2] = cut(mcmd, 2, ':');

                    var d = removespaces(mcmd[2]).toLowerCase(),
                        inObj = function (variable, obj) {
                            return variable in obj;
                        };

                    if (inObj(d, userCommands) || inObj(d, channelCommands) || inObj(d, tourCommands) || inObj(d, modCommands) || inObj(d, adminCommands) || inObj(d, ownerCommands) || inObj(d, founderCommands)) {
                        botMessage(src, "That name already exists in a command!", chan);
                        return;
                    }

                    var y = removespaces(mcmd[2]).toLowerCase();
                    if (/\W/.test(y)) {
                        botMessage(src, "You can only use letters A-z, numbers 0-9, spaces, and _.", chan);
                        return;
                    }

                    if (mcmd[0].toLowerCase() != "ctour" && mcmd[0].toLowerCase() != "tournament" && mcmd[0].toLowerCase() != "channel" && mcmd[0].toLowerCase() != "server") {
                        botMessage(src, "Currently, you can only pick ctour, channel, tournament, or server as auth type.", chan);
                        return;
                    }

                    if (mcmd[0].toLowerCase() === "ctour") {
                        if (mcmd[1] != "1" && mcmd[1] != "0") {
                            botMessage(src, "Choose auth number 0 or 1 for authtype ctour", chan);
                            return;
                        }
                        sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type CTour's auth level " + mcmd[1] + " name has been changed to " + mcmd[2] + " by " + sys.name(src) + "!</b></font>", 0);
                        if (mcmd[1] === "0") {
                            ChanTour0 = mcmd[2];
                        }
                        else if (mcmd[1] === "1") {
                            ChanTour1 = mcmd[2];
                        }
                        cache.write("ChanTour" + mcmd[1] + "Name", mcmd[2]);
                        return;
                    }

                    if (mcmd[0].toLowerCase() === "tournament") {
                        if (mcmd[1] != "1" && mcmd[1] != "0") {
                            botMessage(src, "Choose select auth number 0 or 1 for authtype tournament", chan);
                            return;
                        }
                        sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type Tournament's auth level " + mcmd[1] + " name has been changed to " + mcmd[2] + " by " + sys.name(src) + "!</b></font>", 0);
                        if (mcmd[1] === "0") {
                            Tour0 = mcmd[2];
                        }
                        else if (mcmd[1] === "1") {
                            Tour1 = mcmd[2];
                        }
                        cache.write("TourLevel" + mcmd[1] + "Name", mcmd[2]);
                        return;
                    }

                    if (mcmd[0].toLowerCase() === "server") {
                        if (mcmd[1] != "1" && mcmd[1] != "0" && mcmd[1] != "2" && mcmd[1] != "3" && mcmd[1] != "4") {
                            botMessage(src, "Choose auth number 0, 1, 2, 3 or 4 for authtype server", chan);
                            return;
                        }
                        sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type Server's auth level " + mcmd[1] + " name has been changed to " + mcmd[2] + " by " + sys.name(src) + "!</b></font>", 0);
                        if (mcmd[1] === "0") {
                            UserName = mcmd[2];
                        }
                        else if (mcmd[1] === "1") {
                            ModName = mcmd[2];
                        }
                        else if (mcmd[1] === "2") {
                            AdminName = mcmd[2];
                        }
                        else if (mcmd[1] === "3") {
                            OwnerName = mcmd[2];
                        }
                        else if (mcmd[1] === "4") {
                            InvisName = mcmd[2];
                        }
                        cache.write("AuthLevel" + mcmd[1] + "Name", mcmd[2]);
                        return;
                    }

                    if (mcmd[0].toLowerCase() === "channel") {
                        if (mcmd[1] != "1" && mcmd[1] != "0" && mcmd[1] != "2" && mcmd[1] != "3") {
                            botMessage(src, "Choose auth number 0, 1, 2 or 3 for authtype channel", chan);
                            return;
                        }
                        sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type Channel's auth level " + mcmd[1] + " name has been changed to " + mcmd[2] + " by " + sys.name(src) + "!</b></font>", 0);
                        if (mcmd[1] === "0") {
                            ChanUser = mcmd[2];
                        }
                        else if (mcmd[1] === "1") {
                            ChanMod = mcmd[2];
                        }
                        else if (mcmd[1] === "2") {
                            ChanAdmin = mcmd[2];
                        }
                        else if (mcmd[1] === "3") {
                            ChanOwner = mcmd[2];
                        }
                        cache.write("ChanLevel" + mcmd[1] + "Name", mcmd[2]);
                    }
                },

                autokick: function () {
                    AutoKick = !AutoKick;
                    cache.write("AutoKick", AutoKick);
                    botAll("Auto Kick was turned " + toOn(AutoKick) + " by " + player(src) + "!", 0);
                },

                automute: function () {
                    AutoMute = !AutoMute;

                    cache.write("AutoMute", AutoMute);
                    botAll("Auto Mute was turned " + toOn(AutoMute) + " by " + player(src) + "!", 0);
                },

                allowchannels: function () {
                    ChannelsAllowed = !ChannelsAllowed;
                    cache.write("ChannelsAllowed", ChannelsAllowed);
                    botAll("Channels were turned " + toOn(ChannelsAllowed) + " by " + player(src) + "!", 0);
                },

                battles: function () {
                    BattlesAllowed = !BattlesAllowed;
                    cache.write("BattlesAllowed", BattlesAllowed);
                    botAll("Battles were turned " + toOn(BattlesAllowed) + " by " + player(src) + "!", 0);
                },

                deleteplayer: function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That player doesn't exist", chan);
                        return;
                    }

                    var name = commandData.name();
                    botEscapeAll(player(name) + " was deleted from the players database by " + player(src) + "!", 0);
                    sys.dbDelete(name);

                    if (tar != undefined) {
                        sys.kick(tar);
                    }
                },

                exportmembers: function () {
                    sys.exportMemberDatabase();
                    botEscapeAll(player(src) + " exported the players database!", 0);
                },

                exporttiers: function () {
                    sys.exportTierDatabase();
                    botEscapeAll(player(src) + " exported the tiers database!", 0);
                },

                megasilence: function () {
                    if (silence.level) {
                        botMessage(src, "The chat is already silenced.", chan);
                        return;
                    }

                    var time = commandData * 60,
                        timeStr = "!";
                    if (!isNaN(time) && commandData !== "") {
                        timeStr = " for " + getTimeString(time) + "!";
                    }

                    silence = {
                        "by": sys.name(src),
                        "level": 3
                    };

                    botAll(player(src) + " mega-silenced the chat" + timeStr);

                    if (timeStr === "!") {
                        return;
                    }

                    timeOut = function () {
                        if (!silence.level) {
                            return;
                        }

                        silence = {
                            "by": "",
                            "level": 0
                        };
                        botAll("Silence is over.");
                    }

                    sys.delayedCall(timeOut, time);

                },

                dbplayers: function () { /* Format DB into multiple packages. */
                    var Strings = {
                        1: ""
                    },
                        x, d = sys.dbAll(),
                        c = 0,
                        cstr = "",
                        o;

                    for (x in d) {
                        if (c > 250) {
                            o = Strings.length() + 1;
                            Strings[o - 1] = cstr;
                            Strings[o] = "";
                            cstr = Strings[o];
                            c = 0;
                        }

                        cstr += player(d[x]) + ", ";
                        c++;
                    }

                    Strings[Strings.length()] = cstr;

                    botMessage(src, "The following players are in the players database:", chan);

                    for (x in Strings) {
                        botMessage(src, Strings[x]);
                    }
                },

                resetladder: function () {
                    var tier = validTier(commandData);

                    if (!tier) {
                        botEscapeMessage(src, "The tier " + commandData + " doesn't exist.", chan);
                        return;
                    }

                    botAll("The ladder of the tier " + tier + " has been reset by " + player(src) + "!", 0);
                    sys.resetLadder(tier);
                },

                resetladders: function () {
                    var tiers = sys.getTierList(),
                        y;
                    for (y in tiers) {
                        sys.resetLadder(tiers[y]);
                    }

                    botAll("Every ladder has been reset by " + player(src) + "!", 0);
                },

                pointercommand: function () {
                    if (isEmpty(mcmd[0]) || isEmpty(mcmd[1])) {
                        botMessage(src, "Specify a command.", chan);
                        return;
                    }

                    mcmd[1] = cut(mcmd, 1, ':');

                    var pointer = mcmd[0].toLowerCase(),
                        command = mcmd[1].toLowerCase(),
                        rmPoint = removespaces(pointer),
                        rmCmd = removespaces(command);

                    if (rmPoint.toLowerCase() == "!!/reverse/!!" || hasCommandStart(rmPoint)) {
                        botMessage(src, "This pointer is reserved.");
                        return;
                    }

                    var inObj = function (variable, obj) {
                        return variable in obj;
                    }

                    if (inObj(rmPoint, userCommands) || inObj(rmPoint, channelCommands) || inObj(rmPoint, tourCommands) || inObj(rmPoint, modCommands) || inObj(rmPoint, adminCommands) || inObj(rmPoint, ownerCommands) || inObj(rmPoint, founderCommands)) {
                        botMessage(src, "That pointer is already defined as a normal command.", chan);
                        return;
                    }
                    if (!inObj(rmCmd, userCommands) && !inObj(rmCmd, channelCommands) && !inObj(rmCmd, tourCommands) && !inObj(rmCmd, modCommands) && !inObj(rmCmd, adminCommands) && !inObj(rmCmd, ownerCommands) && !inObj(rmCmd, founderCommands)) {
                        botMessage(src, "That command doesn't exist!", chan);
                        return;
                    }
                    if (/\W/.test(rmPoint)) {
                        botMessage(src, "You can only use letters A-z, numbers 0-9, and _.", chan);
                        return;
                    }
                    if (rmPoint in PointerCommands && PointerCommands[rmPoint] === rmCmd) {
                        botMessage(src, "Pointer is already defined with that command!", chan);
                        return;
                    }

                    var re = ['defined', 'as'];
                    if (rmPoint in PointerCommands) {
                        re = ['redefined', 'differently as'];
                    }

                    PointerCommands[rmPoint] = rmCmd;
                    var points = PointerCommands["!!/Reverse/!!"];
                    if (!points.has(rmPoint)) {
                        points[rmPoint] = {};
                    }
                    points[rmPoint][rmCmd] = '';

                    botAll(sys.name(src) + " " + re[0] + " Pointer Command " + pointer + " " + re[1] + " " + command + "!", 0);
                    cache.write("pointercommands", JSON.stringify(PointerCommands));
                },

                delpointercommand: function () {
                    var d = removespaces(cmdData);
                    if (d === "") {
                        botMessage(src, "Specify a Pointer Command.", chan);
                        return;
                    }
                    if (d == "!!/Reverse/!!") {
                        botMessage(src, "This pointer cannot be deleted.");
                        return;
                    }
                    if (!d in PointerCommands) {
                        botMessage(src, "Pointer doesn't exist!", chan);
                        return;
                    }
                    delete PointerCommands[d];
                    delete PointerCommands["!!/Reverse/!!"][d];

                    botAll(sys.name(src) + " removed the Pointer Command " + d + "!", 0);
                    cache.write("pointercommands", JSON.stringify(PointerCommands));
                },

                banfrom: function () {
                    if (mcmd[0] === undefined || mcmd[1] === undefined || mcmd[2] === undefined) {
                        botMessage(src, "Invalid parameters.", chan);
                        return;
                    }

                    var name = validTier(mcmd[0]);

                    if (!name) {
                        botEscapeMessage(src, "The tier " + mcmd[0] + " doesn't exist!", chan);
                        return;
                    }

                    var num = sys.pokeNum(mcmd[1]);
                    if (num === undefined) {
                        botEscapeMessage(src, "The pokemon " + mcmd[1] + " doesn't exist!", chan);
                        return;
                    }

                    var abilityarr = [];

                    for (var y = 0; y < 5; y++) {
                        abilityarr.push(sys.ability(sys.pokeAbility(num, y, 5)).toLowerCase());
                    }

                    if (!abilityarr.has(mcmd[2].toLowerCase())) {
                        botEscapeMessage(src, "The ability " + mcmd[2] + " for pokemon " + mcmd[1] + " doesn't exist!", chan);
                        return;
                    }
                    var bans = DataHash.bannedAbilities;
                    if (bans[name] === undefined) {
                        bans[name] = {};
                    }

                    var pN = sys.pokemon(num).toLowerCase();
                    if (bans[name][pN] === undefined) {
                        bans[name][pN] = [];
                    }

                    if (bans[name][pN].has(mcmd[2].toLowerCase())) {
                        botMessage(src, "The ability " + mcmd[2] + " is already banned on " + mcmd[1] + " in tier " + mcmd[0], chan);
                        return;
                    }

                    bans[name][pN].push(mcmd[2].toLowerCase());

                    botAll(sys.name(src) + " has banned the ability " + mcmd[2] + " on " + mcmd[1] + " in tier " + mcmd[0] + "!", 0);
                    cache.write("bannedAbilities", JSON.stringify(DataHash.bannedAbilities));
                },

                unbanfrom: function () {
                    if (mcmd[0] === undefined || mcmd[1] === undefined || mcmd[2] === undefined) {
                        botMessage(src, "Invalid parameters.", chan);
                        return;
                    }

                    var name = validTier(mcmd[0]);

                    if (!name) {
                        botEscapeMessage(src, "The tier " + mcmd[0] + " doesn't exist!", chan);
                        return;
                    }

                    var num = sys.pokeNum(mcmd[1]);
                    if (num === undefined) {
                        botEscapeMessage(src, "The pokemon " + mcmd[1] + " doesn't exist!", chan);
                        return;
                    }

                    var abilityarr = [];

                    for (var y = 0; y < 5; y++) {
                        abilityarr.push(sys.ability(sys.pokeAbility(num, y, 5)).toLowerCase());
                    }

                    if (!abilityarr.has(mcmd[2].toLowerCase())) {
                        botEscapeMessage(src, "The ability " + mcmd[2] + " for pokemon " + mcmd[1] + " doesn't exist!", chan);
                        return;
                    }
                    var bans = DataHash.bannedAbilities;
                    if (typeof bans[name] === 'undefined') {
                        botMessage(src, tier + " doesn't have any ability bans.", chan);
                        return;
                    }

                    var pN = sys.pokemon(num).toLowerCase();
                    if (typeof bans[name][pN] === 'undefined') {
                        botMessage(src, sys.pokemon(num) + " doesn't have any ability bans in " + tier, chan);
                        return;
                    }

                    if (!bans[name][pN].has(mcmd[2].toLowerCase())) {
                        botMessage(src, "The ability " + mcmd[2] + " isn't banned on " + mcmd[1] + " in tier " + mcmd[0], chan);
                        return;
                    }

                    if (bans[name][pN].length === 1) {
                        delete bans[name][pN];
                    }
                    else {
                        bans[name][pN].splice(mcmd[2].toLowerCase(), 1);
                    }

                    botAll(sys.name(src) + " has unbanned the ability " + mcmd[2] + " on " + mcmd[1] + " in tier " + mcmd[0] + "!", 0);
                    cache.write("bannedAbilities", JSON.stringify(DataHash.bannedAbilities));
                }
            });

            founderCommands = ({
                evallock: function () {
                    if (evallock) {
                        botMessage(src, "Eval is already disabled!", chan);
                        return;
                    }
                    evallock = true;
                    cache.write("evallock", true);
                    botEscapeAll(sys.name(src) + " has locked eval.", scriptchannel);
                },

                evalunlock: function () {
                    if (!evallock) {
                        botMessage(src, "Eval is already enabled!", chan);
                        return;
                    }
                    evallock = false;
                    cache.write("evallock", false);
                    botEscapeAll(sys.name(src) + " has unlocked eval.", scriptchannel);
                },

                evalop: function () {
                    var m = mcmd[0].toLowerCase();
                    if (dbIp == undefined) {
                        botMessage(src, "That player doesn't exist!", chan);
                        return;
                    }
                    var d = DataHash.evalops;
                    if (d.has(m)) {
                        botMessage(src, "This player already is Eval Operator.", chan);
                        return;
                    }
                    if (!sys.dbRegistered(commandData)) {
                        botMessage(src, "This player is not registered.", chan);
                        if (tar != undefined) {
                            botMessage(tar, "Please register for auth.");
                        }
                        return;
                    }

                    DataHash.evalops[m] = {
                        'by': sys.name(src)
                    };

                    cache.write("evalops", JSON.stringify(DataHash.evalops));

                    putInAuthChan(m, "evalop");
                    botAll(sys.name(src) + " made " + m.name() + " Eval Operator!", scriptchannel);
                },

                evaluser: function () {
                    var m = mcmd[0].toLowerCase();
                    if (dbIp == undefined) {
                        botMessage(src, "That player doesn't exist!", chan);
                        return;
                    }
                    var d = DataHash.evalops;
                    if (!d.has(m)) {
                        botMessage(src, "This player isn't an Eval Operator.", chan);
                        return;
                    }

                    botAll(sys.name(src) + " made " + m.name() + " Eval User!", scriptchannel);

                    delete DataHash.evalops[m];
                    if (tar != undefined) {
                        sys.kick(tar, scriptchannel);
                    }

                    cache.write("evalops", JSON.stringify(DataHash.evalops));
                },

                sudo: function () {
                    var res = script.beforeChatMessage(sys.id(mcmd[0]), cut(mcmd[2], ':'), sys.channelId(mcmd[1]));
                    if (res !== undefined) {
                        print(res);
                    }
                },

            });

            ownerCommands[removespaces(OwnerName).toLowerCase() + "commands"] = function () {
                var ct = new Command_Templater(OwnerName + " Commands");

                ct.register("chatcommands", "Displays the Chat commands.");
                ct.register("dbcommands", "Displays the the Database commands.");
                ct.register("anncommands", "Displays the Announcement commands.");
                ct.register("servercommands", "Displays the Server commands.");
                ct.register("tiercommands", "Displays the Tier commands.");
                ct.register("eval", ["{Text::Any Code}"], "To evaluate a QtScript {Text::Any Code} server-side and returns the result.");
                ct.register("randomspam", ["{Text::Number Times}"], "To spam the chat with random messages, {Text::Number Times} times (default is 30).");
                ct.register("recreate", ["{Text::Any <u>Type</u>}"], "To reset JSESSION data and refill. {Text::Any Type} can be Channels, Global, Tours, Users, All. Default is All.");
                ct.register("resetcommandstats", "To reset command stats.");

                ct.render(src, chan);
            }

            if (!Config.AdminsCanAuth) {
                ownerCommands[removespaces(UserName).toLowerCase()] = function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That player doesn't exist");
                        return;
                    }
                    if (dbAuth === 0) {
                        botMessage(src, "That player already is " + UserName + "!", chan);
                        return;
                    }
                    if (sys.auth(src) <= sys.maxAuth(dbIp) && sys.auth(src) < 3) {
                        botMessage(src, "You can't deauth this person!", chan);
                        return;
                    }

                    if (DataHash.tempauth[cmdData] != undefined) {
                        delete DataHash.tempauth[cmdData];
                        cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                    }

                    if (tar != undefined) {
                        botEscapeAll(sys.name(tar) + " has been made " + UserName + " by " + sys.name(src) + ".", 0);
                        sys.changeAuth(tar, 0);
                        return;
                    }

                    botEscapeAll(commandData + " has been made " + UserName + " by " + sys.name(src) + ".", 0);
                    sys.changeDbAuth(commandData, 0);

                    kickFromChannel(commandData, scriptchannel);
                    kickFromChannel(commandData, watch);
                    kickFromChannel(commandData, staffchannel);
                }

                ownerCommands[removespaces(ModName).toLowerCase()] = function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That player doesn't exist", chan);
                        return;
                    }
                    if (dbAuth === 1) {
                        botMessage(src, "That player already is " + ModName + "!", chan);
                        return;
                    }
                    if (!sys.dbRegistered(commandData)) {
                        botMessage(src, "This player is not registered.", chan);
                        if (tar != undefined) {
                            botMessage(tar, "Please register for auth.");
                        }
                        return;
                    }
                    if (sys.auth(src) <= sys.maxAuth(dbIp) && sys.auth(src) < 3) {
                        botMessage(src, "You can't deauth this person!", chan);
                        return;
                    }

                    if (DataHash.tempauth[cmdData] != undefined) {
                        delete DataHash.tempauth[cmdData];
                        cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                    }

                    if (tar != undefined) {
                        botEscapeAll(sys.name(tar) + " has been made " + ModName + " by " + sys.name(src) + ".", 0);
                        sys.changeAuth(tar, 1);
                        return;
                    }
                    botEscapeAll(commandData + " has been made " + ModName + " by " + sys.name(src) + ".", 0);
                    sys.changeDbAuth(commandData, 1);
                    putInAuthChan(commandData, "mod");
                }
            }

            ownerCommands[removespaces(AdminName).toLowerCase()] = function () {
                if (dbIp === undefined) {
                    botMessage(src, "That player doesn't exist.", chan);
                    return;
                }
                if (dbAuth === 2) {
                    botMessage(src, "That player already is " + AdminName + "!", chan);
                    return;
                }

                if (!sys.dbRegistered(commandData)) {
                    botMessage(src, "This player is not registered.", chan);
                    if (tar != undefined) {
                        botMessage(tar, "Please register for auth.");
                    }
                    return;
                }

                if (DataHash.tempauth[cmdData] != undefined) {
                    delete DataHash.tempauth[cmdData];
                    cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                }

                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + AdminName + " by " + sys.name(src) + ".", 0);
                    sys.changeAuth(tar, 2);
                    return;
                }
                botEscapeAll(commandData + " has been made " + AdminName + " by " + sys.name(src) + ".", chan);
                sys.changeDbAuth(commandData, 2);
                putInAuthChan(commandData, "admin");
            }

            ownerCommands[removespaces(OwnerName).toLowerCase()] = function () {
                if (dbIp === undefined) {
                    botMessage(src, "That player doesn't exist.", chan);
                    return;
                }
                if (dbAuth === 3) {
                    botMessage(src, "That player already is " + OwnerName + "!", chan);
                    return;
                }

                if (!sys.dbRegistered(commandData)) {
                    botMessage(src, "This player is not registered.", chan);
                    if (tar != undefined) {
                        botMessage(tar, "Please register for auth.");
                    }
                    return;
                }

                if (DataHash.tempauth[cmdData] != undefined) {
                    delete DataHash.tempauth[cmdData];
                    cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                }

                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + OwnerName + " by " + sys.name(src) + ".", 0);
                    sys.changeAuth(tar, 3);
                    return;
                }

                botEscapeAll(commandData + " has been made " + OwnerName + " by " + sys.name(src) + ".", 0);
                sys.changeDbAuth(commandData, 3);
                putInAuthChan(commandData, "admin");
            }

            ownerCommands[removespaces(InvisName).toLowerCase()] = function () {
                if (sys.dbIp(commandData) === undefined) {
                    botMessage(src, "That player doesn't exist.", chan);
                    return;
                }
                if (dbAuth >= 4) {
                    botMessage(src, "That player already is " + InvisName + "!", chan);
                    return;
                }

                if (!sys.dbRegistered(commandData)) {
                    botMessage(src, "This player is not registered.", chan);
                    if (tar != undefined) {
                        botMessage(tar, "Please register for auth.");
                    }
                    return;
                }

                if (DataHash.tempauth[cmdData] != undefined) {
                    delete DataHash.tempauth[cmdData];
                    cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                }

                var users = sys.playerIds(),
                    y, sendArr3 = [],
                    sendArr0 = [],
                    X;

                for (y in users) {
                    if (sys.auth(users[y]) > 2) {
                        sendArr3.push(users[y]);
                    }
                    else {
                        sendArr0.push(users[y]);
                    }
                }

                var m_name = sys.name(src),
                    t_name = commandData.name();
                if (tar != undefined) {
                    for (x in sendArr3) {
                        botMessage(sendArr3[x], t_name + " has been made " + InvisName + " by " + m_name + ".", 0);
                    }
                    for (x in sendArr0) {
                        botMessage(sendArr0[x], t_name + " has been made " + UserName + " by " + m_name + ".", 0);
                    }
                    sys.changeAuth(tar, 127);
                    putInAuthChan(commandData, "admin");
                    return;
                }

                for (x in sendArr3) {
                    botMessage(sendArr3[x], t_name + " has been made " + InvisName + " by " + m_name + ".", 0);
                }
                for (x in sendArr0) {
                    botMessage(sendArr0[x], t_name + " has been made " + UserName + " by " + m_name + ".", 0);
                }

                sys.changeDbAuth(commandData, 127);
            }

            var getCommand = ({
                '0': function (name) {
                    if (name in tourCommands && poChan.toursEnabled) {
                        return tourCommands[name];
                    }
                    else if (name in channelCommands) {
                        return channelCommands[name];
                    }
                    else if (name in userCommands) {
                        return userCommands[name];
                    }
                },
                '1': function (name) {
                    if (name in modCommands) {
                        return modCommands[name];
                    }
                    else if (name in tourCommands && poChan.toursEnabled) {
                        return tourCommands[name];
                    }
                    else if (name in channelCommands) {
                        return channelCommands[name];
                    }
                    else if (name in userCommands) {
                        return userCommands[name];
                    }
                },
                '2': function (name) {
                    if (name in adminCommands) {
                        return adminCommands[name];
                    }
                    else if (name in modCommands) {
                        return modCommands[name];
                    }
                    else if (name in tourCommands && poChan.toursEnabled) {
                        return tourCommands[name];
                    }
                    else if (name in channelCommands) {
                        return channelCommands[name];
                    }
                    else if (name in userCommands) {
                        return userCommands[name];
                    }
                },
                '3': function (name) {
                    if (name in founderCommands && host) {
                        return founderCommands[name];
                    }
                    else if (name in ownerCommands) {
                        return ownerCommands[name];
                    }
                    else if (name in adminCommands) {
                        return adminCommands[name];
                    }
                    else if (name in modCommands) {
                        return modCommands[name];
                    }
                    else if (name in tourCommands && poChan.toursEnabled) {
                        return tourCommands[name];
                    }
                    else if (name in channelCommands) {
                        return channelCommands[name];
                    }
                    else if (name in userCommands) {
                        return userCommands[name];
                    }
                }
            });

            var op = sys.auth(src),
                ch = Config.HighPermission;

            if (op > 3) {
                op = 3;
            }

            if (op < 0) {
                op = 0;
            }

            if (ch[sys.name(src)] !== undefined && ch[sys.name(src)][0] === sys.auth(src)) {
                op = ch[sys.name(src)][1];
            }

            if (command == "eval" && DataHash.evalops.has(sys.name(src).toLowerCase())) {
                op = 3;
            }

            var cmd = getCommand[op](command);
            if (!cmd) {
                if (!getCommand[3](command)) {
                    invalidCommandMessage(src, fullCommand, chan);
                }
                else {
                    noPermissionMessage(src, fullCommand, chan);
                }
                return;
            }
            cmd();
            return;
        }

        WatchPlayer(src, "Message", message, chan);

        if (testMafiaChat(src, chan)) {
            sys.stopEvent();
            return;
        }

        if (poUser.capsMute(message, chan)) {
            sys.stopEvent();
            return;
        }

        sys.stopEvent();

        var nc = script.namecolor(src),
            sendHtml = sys.sendHtmlAll,
            send = sys.sendAll;

        if (unicodeAbuse(src, message)) {
            if (!sys.loggedIn(src)) {
                poUser.floodCount = 'kicked';
                return;
            }

            return;
        }

        if (typeof poUser.impersonation != 'undefined') {
            if (myAuth <= 0 && implock) {
                delete poUser.impersonation;
                botMessage(src, "You are now yourself again!", chan);
                sys.stopEvent();
                return;
            }

            var nc = script.namecolor(src),
                font = '',
                font2 = '%1';

            if (chatcolor) {
                font = ' face="' + fnt + '"', font2 = '<font face="' + fnt + '">%1</font>';
            }

            var l = "",
                f;
            if (UseIcons) {
                l = rankico;
            } else if (myAuth >= 1 && myAuth <= 3) {
                l = "+<i>";
            }

            if (UseIcons) {
                f = format(src, html_escape(message));
            } else {
                f = html_escape(message);
            }

            if (chan === watch) {
                sendHtml("<font color=" + nc + " " + font + "><timestamp/>" + l + "<b>" + html_escape(poUser.impersonation) + ":</b></i></font> " + font2.format(f));
            }
            else {
                sendHtml("<font color=" + nc + " " + font + "><timestamp/>" + l + "<b>" + html_escape(poUser.impersonation) + ":</b></i></font> " + font2.format(f), chan);
            }

            if (chan === watch) {
                send(srcname + ": " + message);
            }

            return;
        }


        if (UseIcons || chatcolor) {
            if (chan === watch) {
                sendHtml(namestr);
                return;
            }
            else {
                sendHtml(namestr, chan);
                return;
            }
        }

        if (chan === watch) {
            send(srcname + ": " + message);
            return;
        }

/* 
        if (chan === trivia && Trivia.isGameGoingOn() && !Trivia.timeout) {
            Trivia.a(message);
            return;

        } */
        sys.sendAll(srcname + ": " + message, chan);
    },

    beforeLogOut: function (src) {
        var func = function (id, name, color, autoKicked) {
            if (typeof autoKicked !== 'number') {
                WatchEvent(id, "Log Out");

                if (Config.WelcomeMessages) {
                    botAll("Goodbye, " + name + "!", 0);
                }
            }
        };

        sys.callQuickly("func('" + src + "', '" + sys.name(src) + "', '" + typeof testNameKickedPlayer == 'number' + "');", 200);

        delete testNameKickedPlayer;

        ify.beforeLogOut(src);
        JSESSION.destroyUser(src);
    },

    afterPlayerAway: function (src, mode) {
        var m = "Now active and ready for battles.";
        if (mode) {
            m = "Now idling.";
        }

        WatchEvent(src, m);
    },

    afterChangeTeam: function (src, logging) {
        var myName = sys.name(src),
            lc = myName.toLowerCase();

        if (!logging) {
            // UPDATING DATA
            var myUser = JSESSION.users(src),
                dh = DataHash;

            myUser.name = myName;
            myUser.lowername = lc;
            myUser.megauser = dh.megausers.has(lc);
            myUser.voice = dh.voices.has(lc);
            myUser.icon = undefined;

            if (dh.rankicons.has(lc)) {
                myIcon = dh.icons[lc];
            }


            if (typeof myUser.teamChanges == 'object') {
                myUser.teamChanges = 0;
            }

            myUser.teamChanges++;

            var teamChanges = myUser.teamChanges,
                ip = sys.ip(src);

            if (teamChanges > 2) {
                if (typeof dh.teamSpammers[ip] == "undefined") {
                    dh.teamSpammers[ip] = 0;
                    sys.callLater("if(typeof DataHash.teamSpammers['" + ip + "'] != 'undefined') DataHash.teamSpammers['" + ip + "']--; ", 60 * 3);
                }
                else if (dh.teamSpammers[ip] == 0) {
                    dh.teamSpammers[ip] = 1;
                    botAll("Alert: Possible spammer on ip " + ip + " and name " + myName + ". Kicked.", watch);
                    kick(src);
                    sys.callLater("if(typeof DataHash.teamSpammers['" + ip + "'] != 'undefined') DataHash.teamSpammers['" + ip + "']--; ", 60 * 5);
                    return;
                }
                else {
                    botAll("Spammer: ip " + ip + ", name " + myName + ". Banned.<ping/>", watch);
                    ban(myName);
                    delete dh.teamSpammers[ip];
                    return;
                }
            }

            script.resolveLocation(src, ip, false);

            sys.callLater("if(JSESSION.users(" + src + ") != undefined) JSESSION.users(" + src + ").teamChanges--;", 5);

            // Everything else //
            var getColor = script.namecolor(src),
                dhn = DataHash.names;

            WatchEvent(src, "Changed Team/Name");

            dhn[ip] = myName;
            dhn[lc] = myName;
            playerscache.write("names", JSON.stringify(dhn));

            script.hostAuth(src);

            if (script.testName(src) === true) {
                testNameKickedPlayer = src;
                kick(src);
                return;
            }
        } /* END OF LOGGING */

        var myMail = DataHash.mail[lc];
        if (myMail != undefined) {
            if (myMail.length > 0) {
                var p, count = 0;
                for (p in myMail) {
                    if (!myMail[p].read) {
                        count++;
                    }
                }

                if (count > 0) {
                    botMessage(src, "You have " + count + " new mails! Type <font color='green'><b>/readmail</b></font> to view!");
                }
            }
        }

        var team, i, j, k;
        for (team = 0; team < sys.teamCount(src); team++) {
            if (sys.gen(src, team) === 2) {
                pokes: for (i = 0; i <= 6; i++) {
                    for (j = 0; j < bannedGSCSleep.length; ++j)
                    if (sys.hasTeamPokeMove(src, team, i, bannedGSCSleep[j])) {
                        for (k = 0; k < bannedGSCTrap.length; ++k) {
                            if (sys.hasTeamPokeMove(src, team, i, bannedGSCTrap[k])) {
                                teamAlert(src, team, "SleepTrapping is banned in GSC. Pokemon " + sys.pokemon(sys.teamPoke(src, team, i)) + "  removed from your team.");
                                sys.changePokeNum(src, team, i, 0);
                                continue pokes;
                            }
                        }
                    }
                }
            }

            if (!Config.NoCrash) {
                if (!TierBans.isLegalTeam(src, team, sys.tier(src, team))) {
                    TierBans.findGoodTier(src, team);
                }
            }

        }

        if (!logging) {
            ify.afterChangeTeam(src);
        }
    },

    afterBattleEnded: function (winner, loser, result, battle_id) {
        if (result != "tie" && sys.ip(winner) != sys.ip(loser)) {
            var winMoney = sys.rand(50, 81),
                loseMoney = sys.rand(13, 36),
                winnerName = sys.name(winner).toLowerCase(),
                loserName = sys.name(loser).toLowerCase(),
                money = DataHash.money;

            if (typeof money[loserName] === "undefined") {
                money[loserName] = 0;
            }
            if (typeof money[winnerName] === "undefined") {
                money[winnerName] = 0;
            }

            money[winnerName] += winMoney;
            money[loserName] -= loseMoney;

            botMessage(winner, 'You won ' + winMoney + ' battle points!');
            botMessage(loser, 'You lost ' + loseMoney + ' battle points!');

            cache.write("money", JSON.stringify(DataHash.money));
        }

        var c = sys.channelIds(),
            b, c_chan;

        for (b in c) {
            c_chan = JSESSION.channels(c[b]);
            if (c_chan.toursEnabled) {
                c_chan.tour.afterBattleEnded(winner, loser, result);
            }
        }
    },

    afterBattleStarted: function (src, dest, clauses, rated, srcteam, destteam) {
        var c = sys.channelIds(),
            b, c_chan;

        for (b in c) {
            c_chan = JSESSION.channels(c[b]);
            if (c_chan.toursEnabled) {
                c_chan.tour.afterBattleStarted(src, dest, clauses, rated, srcteam, destteam);
            }
        }
    },

    beforeBattleMatchup: function (src) {
        if (!BattlesAllowed) {
            botMessage(src, "Battles are currently disabled.");
            return sys.stopEvent();
        }
    },
    
    beforeChallengeIssued: function (src, dest, clauses, rated, mode, team, destTier) {
        if (Config.FixChallenges) {
            return sys.stopEvent();
        }
        
        if (!BattlesAllowed) {
            botMessage(src, "Battles are currently disabled.");
            return sys.stopEvent();
        }

        var poUser = JSESSION.users(src);
        if (poUser == undefined) {
            JSESSION.createUser(src);
            poUser = JSESSION.users(src);
        }

        var time = sys.time() * 1;
        if (poUser.lastChallenge + 15 - time > 0 && sys.auth(src) < 2 && poUser.lastChallenge != 0) {
            botMessage(src, "Please wait " + getTimeString(poUser.lastChallenge + 15 - time) + " before challenging.");
            return sys.stopEvent();
        }

        poUser.lastChallenge = time;

        var isChallengeCup = sys.getClauses(destTier) % 32 >= 16,
            hasChallengeCupClause = (clauses % 32) >= 16;

        if (isChallengeCup && !hasChallengeCupClause) {
            botMessage(src, "Challenge Cup must be enabled in the challenge window for a CC battle");
            sys.stopEvent();
            return;
        }

        if ((clauses % 32) >= 16) {
            return;
        }

        if (!Config.NoCrash) {
            if (sys.tier(src, team).contains("Doubles") && destTier.contains("Doubles") && mode != 1) {
                botMessage(src, "To fight in doubles, enable doubles in the challenge window!");
                sys.stopEvent();
                return;
            }
            if (sys.tier(src, team).contains("Triples") && destTier.contains("Triples") && mode != 2) {
                botMessage(src, "To fight in triples, enable triples in the challenge window!");
                sys.stopEvent();
                return;
            }
        }
    },

    beforeChangeTier: function (src, team, oldtier, newtier) {
        if (!TierBans.isLegalTeam(src, team, newtier)) {
            sys.stopEvent();
            teamAlert(src, team, "You cannot go in the " + newtier + " tier. Appointing another tier for this team...");
            TierBans.findGoodTier(src, team);
        }
    },

    beforePlayerKick: function (src, tar) {
        sys.stopEvent();

        var myName = sys.name(src),
            theirName = sys.name(tar);

        if (JSESSION.users(src).muted) {
            var ip = sys.ip(src),
                dhm = DataHash.mutes[ip];

            WatchEvent(src, "Attempted to kick " + theirName + " while muted.");

            var time;
            if (dhm.time != 0) {
                time = "Muted for " + getTimeString(dhm.time - sys.time() * 1);
            } else {
                time = "Muted forever";
            }

            var by = dhm.by + "</i>",
                why = dhm.why,
                lastChar = why[why.length - 1],
                lastChars = [".", "?", "!"];

            if (lastChars.indexOf(lastChar) == -1) {
                why += ".";
            }

            botMessage(src, "You are muted by " + by + ". Reason: " + why + " " + time + "!");
            return;
        }

        sys.sendHtmlAll("<font color='midnightblue'><timestamp/><b> " + myName + " kicked " + theirName + "!</b></font>");
        kick(tar);
    },

    beforePlayerBan: function (src, tar) {
        sys.stopEvent();

        var myName = sys.name(src),
            theirName = sys.name(tar);

        if (JSESSION.users(src).muted) {
            var ip = sys.ip(src),
                dhm = DataHash.mutes[ip];

            WatchEvent(src, "Attempted to ban " + theirName + " while muted.");

            var time;
            if (dhm.time != 0) {
                time = "Muted for " + getTimeString(dhm.time - sys.time() * 1);
            } else {
                time = "Muted forever";
            }

            var by = dhm.by + "</i>",
                why = dhm.why,
                lastChar = why[why.length - 1],
                lastChars = [".", "?", "!"];

            if (lastChars.indexOf(lastChar) == -1) {
                why += ".";
            }

            botMessage(src, "You are muted by " + by + ". Reason: " + why + " " + time + "!");
            return;
        }


        sys.sendHtmlAll("<font color='darkorange'><timestamp/><b> " + sys.name(src) + " banned " + sys.name(tar) + "!</b></font>");
        ban(theirName);
    },

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
                                time = 'Banned for ' + getTimeString(c_rb.time - sys.time() * 1);
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

                            sendFailWhale(src, 0);
                            botMessage(src, 'Your ip range ' + i + ' is banned by ' + by + '. Reason: ' + why + ' ' + time + '.', 0);
                            botAll('Player ' + name + ' with range IP ' + i + ' has attempted to enter the server and failed. [Reason: Rangebanned]', watch);
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

                sendFailWhale(src, 0);
                botMessage(src, "You are banned! By " + by + ". Reason " + why + " " + time + "!", 0);
                botAll('Player ' + name + ' (' + ip + ') has attempted to enter the server and failed. [Reason: Tempbanned]', watch);
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
                sendFailWhale(src, 0);
                botMessage(src, "You are using bad characters in your name.");
                botAll('Player ' + name + ' (' + ip + ') has failed to log in. [Reason: Unicode characters]', watch);
            }
            return true;
        }

        if (name[0] == "S" && name[1] == "E" && name[2] == "N" && name[3] == "T" && name[4] == "_") {
            if (!nomessage) {
                sendFailWhale(src, 0);
            }
            return true;
        }

        return false;
    },
    hostAuth: function (src) {
        var auth = sys.auth(src);
        if (auth < 3 || auth > 3) {
            return;
        }

        if (!isHost(src)) {
            return;
        }

        if (!sys.dbRegistered(sys.name(src))) {
            return;
        }

        sys.changeAuth(src, 3);
    },

    issueMute: function (src, target, reason, time, c, timeunit) {
        var time = parseInt(time),
            theIP = sys.dbIp(target),
            srcauth = sys.auth(src),
            srcname = sys.name(src),
            tarid = sys.id(target),
            now_time = sys.time() * 1,
            timeUnitTime = stringToTime(timeunit, time);

        if (theIP == undefined) {
            botMessage(src, "Unknown target!", c);
            return;
        }
        if (sys.maxAuth(theIP) >= srcauth && !isHost(src)) {
            botMessage(src, "You don't have sufficient auth to mute " + target + ".", c);
            return;
        }

        Prune.mutes();
        var oldtime = 0;
        if (DataHash.mutes.has(theIP)) {
            oldtime = DataHash.mutes[theIP].time - now_time;
        }

        if (time == undefined || timeunit == undefined || isNaN(timeUnitTime) || timeUnitTime == "forever") {
            botEscapeAll(target + " was muted by " + srcname + " forever!", 0);

            if (!isEmpty(reason)) {
                botEscapeAll("Reason: " + reason, 0);
            }

            var all = idsOfIP(theIP),
                z;
            for (z in all) {
                JSESSION.users(all[z]).muted = true;
            }

            var re = "None given";

            if (!isEmpty(reason)) {
                re = reason;
            }

            DataHash.mutes[theIP] = {
                by: sys.name(src),
                why: re,
                ip: theIP,
                time: 0
            };
            return;
        }

        var timestr = getTimeString(timeUnitTime + oldtime),
            thetime = now_time + timeUnitTime + oldtime;

        botEscapeAll(target + " was muted by " + srcname + " for " + timestr + "!", 0);


        if (!isEmpty(reason)) {
            botEscapeAll("Reason: " + reason, 0);
        }

        var all = idsOfIP(theIP),
            z;
        for (z in all) {
            JSESSION.users(all[z]).muted = true;
        }

        var re = "None given";

        if (!isEmpty(reason)) {
            re = reason;
        }

        DataHash.mutes[theIP] = {
            by: sys.name(src),
            why: re,
            ip: theIP,
            time: thetime
        };
        cache.write("mutes", JSON.stringify(DataHash.mutes));
    },

    removeMute: function (src, target, reason, c) {
        var theIP = sys.dbIp(target),
            srcauth = sys.auth(src),
            srcname = sys.name(src);

        if (theIP == undefined) {
            botMessage(src, "This person doesn't exist.", c);
            return;
        }

        Prune.mutes();

        if (!DataHash.mutes.has(theIP)) {
            botMessage(src, "You cannot unmute someone who isn't muted!", c);
            return;
        }

        botEscapeAll(target + " was unmuted by " + srcname + "!", 0);

        if (!isEmpty(reason)) {
            botEscapeAll("Reason: " + reason, 0);
        }

        var all = idsOfIP(theIP),
            z;

        for (z in all) {
            JSESSION.users(all[z]).muted = false;
        }

        delete DataHash.mutes[theIP];
        cache.write("mutes", JSON.stringify(DataHash.mutes));
    },

    issueTempBan: function (src, target, reason, time, c, timeunit) {
        var theIP = sys.dbIp(target),
            srcauth = sys.auth(src),
            srcname = sys.name(src),
            tarid = sys.id(target),
            timeUnitTime = stringToTime(timeunit, time);

        if (theIP == undefined) {
            botMessage(src, "Unknown target!");
            return;
        }
        if (sys.maxAuth(theIP) >= srcauth && !isHost(src)) {
            botMessage(src, "You don't have sufficient auth to temp ban " + target + ".", c);
            return;
        }

        Prune.bans();

        if (DataHash.tempbans.has(theIP)) {
            botMessage(src, "You cannot ban an already banned player!", c);
            return;
        }

        if (time == undefined || isNaN(timeUnitTime)) {
            botMessage(src, "Specify time!", c);
            return;
        }
        if (timeUnitTime > 7200 && srcauth < 2) {
            botMessage(src, "You may only ban for a maximum of 5 days.", c);
            return;
        }

        var thetime = sys.time() * 1 + timeUnitTime,
            thestr = thetime - sys.time() * 1,
            timestr = getTimeString(thestr);

        botEscapeAll(target + " was banned by " + srcname + " for " + timestr + "!", 0);

        if (!isEmpty(reason)) {
            botEscapeAll("Reason: " + reason, 0);
        }

        if (tarid != undefined) {
            kick(tarid);
        }
        else {
            aliasKick(theIP);
        }

        var re = "None given";

        if (!isEmpty(reason)) {
            re = reason;
        }

        DataHash.tempbans[theIP] = {
            by: sys.name(src),
            why: re,
            ip: theIP,
            time: thetime
        };
        cache.write("tempbans", JSON.stringify(DataHash.tempbans));
    },

    removeTempBan: function (src, target, reason, c) {
        var theIP = sys.dbIp(target),
            srcauth = sys.auth(src),
            srcname = sys.name(src),
            tarid = sys.id(target);

        if (theIP == undefined) {
            botMessage(src, "Unknown target!", c);
            return;
        }

        Prune.bans();

        if (!DataHash.tempbans.has(theIP)) {
            botMessage(src, "You cannot unban someone who isn't banned!", c);
            return;
        }

        botEscapeAll(target + " was un-tempbanned by " + srcname + "!", 0);

        if (!isEmpty(reason)) {
            botEscapeAll("Reason: " + reason, 0);
        }

        delete DataHash.tempbans[theIP];
        cache.write("tempbans", JSON.stringify(DataHash.tempbans));
    },

    tAuth: function (src, tar, auth, time, chan, timeUnit) {
        var sa = sys.auth(src),
            ta = sys.dbAuth(tar),
            theIP = sys.dbIp(tar),
            timeUnitTime = stringToTime(timeUnit, time);

        auth = Math.round(auth);

        if (theIP == undefined) {
            botMessage(src, "Unknown target!", chan);
            return;
        }

        if (auth <= 0) {
            botMessage(src, "You cannot give " + UserName + " authority to someone.", chan);
            return;
        }

        if (!sys.dbRegistered(tar)) {
            botMessage(src, "This player is not registered.", chan);
            if (sys.id(tar) != undefined) {
                botMessage(sys.id(tar), "Please register for Authority.");
            }
            return;
        }

        if (auth > 1 && sa == 2) {
            botMessage(src, "You cannot give any authority higher than " + ModName + " to " + tar, chan);
            return;
        }

        if (auth > 3) {
            auth = 127;
        }

        var toAuth = "admin";
        if (auth < 2) {
            toAuth = "mod";
        }

        if (sys.maxAuth(theIP) >= sa && sa < 3 || ta >= auth) {
            botMessage(src, "You cannot give " + authToString(auth) + " to " + tar + "!", chan);
            return;
        }

        if (isNaN(timeUnitTime)) {
            botMessage(src, "Specify valid time!", chan);
            return;
        }

        if (DataHash.tempauth[tar.toLowerCase()] != undefined) {
            botMessage(src, "This user already has tempauth.", chan);
            return;
        }

        var timey = getTimeString(timeUnitTime);

        putInAuthChan(tar, toAuth);
        botAll(sys.name(src) + " made " + tar + " " + authToString(auth) + " for " + timey + ".", 0);

        if (sys.id(tar) != undefined) {
            sys.changeAuth(sys.id(tar), auth);
        }

        sys.changeDbAuth(tar, auth);
        var correctCase = tar;

        tar = tar.toLowerCase();
        time = timeUnitTime;
        time += sys.time() * 1;

        DataHash.tempauth[tar] = {
            'time': time,
            'role': auth,
            'name': correctCase,
            'oldauth': ta
        };
        cache.write("tempauth", JSON.stringify(DataHash.tempauth));
    },

    importable: function (src, tar, chan, simple) {
        var natureNames = {
            24: "Quirky</font></b> Nature",
            23: "Careful</font></b> Nature (+SDef, -SAtk)",
            22: "Sassy</font></b> Nature (+SDef, -Spd)",
            21: "Gentle</font></b> Nature (+SDef, -Def)",
            20: "Calm</font></b> Nature (+SDef, -Atk)",
            19: "Rash</font></b> Nature (+SAtk, -SDef)",
            18: "Bashful</font></b> Nature",
            17: "Quiet</font></b> Nature (+SAtk, -Spd)",
            16: "Mild</font></b> Nature (+SAtk, -Def)",
            15: "Modest</font></b> Nature (+SAtk, -Atk)",
            14: "Naive</font></b> Nature (+Spd, -SDef)",
            13: "Jolly</font></b> Nature (+Spd, -SAtk)",
            12: "Serious</font></b> Nature",
            11: "Hasty</font></b> Nature (+Spd, -Def)",
            10: "Timid</font></b> Nature (+Spd, -Atk)",
            9: "Lax</font></b> Nature (+Def, -SDef)",
            8: "Impish</font></b> Nature (+Def, -SAtk)",
            7: "Relaxed</font></b> Nature (+Def, -Spd)",
            6: "Docile</font></b> Nature",
            5: "Bold</font></b> Nature (+Def, -Atk)",
            4: "Naughty</font></b> Nature (+Atk, -SDef)",
            3: "Adamant</font></b> Nature (+Atk, -SAtk)",
            2: "Brave</font></b> Nature (+Atk, -Spd)",
            1: "Lonely</font></b> Nature (+Atk, -Def)",
            0: "Hardy</font></b> Nature"
        },
            colorNames = {
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
            },
            genderNames = {
                2: "female",
                1: "male",
                0: "neutral"
            },
            evNames = {
                0: "HP",
                1: "Atk",
                2: "Def",
                3: "SAtk",
                4: "SDef",
                5: "Spd"
            },
            hiddenPowerNum = 237,
            t = new Template(),
            teamno, gen, fullgen, n, numteams = sys.teamCount(tar);

        t.register(style.header);
        t.register("<font color=" + script.namecolor(tar) + "><b>" + sys.name(tar) + "</b></font>'s Teams<br/>");

        for (n = 0; n < numteams; n++) {
            teamno = n + 1;
            gen = sys.gen(tar, n);
            fullgen = sys.generation(gen, sys.subgen(tar, n));

            if (n != 0) {
                t.register("");
            }

            t.register("#" + teamno + ": Gen " + gen + " (" + fullgen + ")<br/>");

            var i, color, gender, pokeId, nick, item, level, evstr, w, evtable, dvstr, dvtable, nature, j, moveNum, moveName, moveStr, hpdvs, hp, movetype, hptype;

            for (i = 0; i < 6; i++) {
                color = colorNames[sys.pokeType1(sys.teamPoke(tar, n, i), gen)];
                pokeId = sys.teamPoke(tar, n, i);

                if (pokeId === 0) {
                    continue;
                }

                gender = genderNames[sys.teamPokeGender(tar, n, i)];
                shinyPoke = false; // sys.teamPokeShine(tar, n, i); = bugged in v2
                if (!simple) {
                    t.register("<img src='pokemon:num=" + pokeId + "&gen=" + gen + "&back=false&shiny=" + shinyPoke + "&gender=" + gender + "'><img src='pokemon:num=" + pokeId + "&gen=" + gen + "&back=true&shiny=" + shinyPoke + "&gender=" + gender + "'>");
                }

                nick = sys.teamPokeNick(tar, n, i) + "</b></font> (<b><font color=" + color + ">" + sys.pokemon(sys.teamPoke(tar, n, i)) + "</b></font>)"
                if (sys.teamPokeNick(tar, n, i) == sys.pokemon(sys.teamPoke(tar, n, i))) {
                    nick = sys.pokemon(sys.teamPoke(tar, n, i)) + "</b></font>";
                }

                item = "<img src='item:" + sys.teamPokeItem(tar, n, i) + "'>";
                if (sys.item(sys.teamPokeItem(tar, n, i)) == "(No Item)") {
                    item = "";
                }

                if (!simple) {
                    t.register("<font color=" + color + "><b> " + nick + " " + sys.gender(sys.teamPokeGender(tar, n, i)).replace(/female/g, "<img src='Themes/Classic/genders/gender2.png'> (F)").replace(/male/g, "<img src='Themes/Classic/genders/gender1.png'> (M)").replace(/genderless/g, "<img src='Themes/Classic/genders/gender0.png'>") + " @ " + item + " " + sys.item(sys.teamPokeItem(tar, n, i)));
                } else {
                    t.register("<font color=" + color + "><b> " + nick + " " + sys.gender(sys.teamPokeGender(tar, n, i)).replace(/female/g, "(F)").replace(/male/g, "(M)").replace(/genderless/g, "") + " @ " + sys.item(sys.teamPokeItem(tar, n, i)));                
                }

                if (gen > 2) {
                    t.register("<font color=" + color + "><b>Trait:</b></font> " + sys.ability(sys.teamPokeAbility(tar, n, i)));
                }

                level = sys.teamPokeLevel(tar, n, i);

                if (level != 100) {
                    t.register('<b><font color=' + color + '>Level:</b></font> ' + level);
                }

                evstr = [];

                for (w = 0; w < 6; w++) {
                    evtable = evNames[w];
                    if (sys.teamPokeEV(tar, n, i, w) != 0 || gen == 2 && sys.teamPokeEV(tar, n, i, q) != 255) {
                        evstr.push(sys.teamPokeEV(tar, n, i, w) + " " + evtable);
                    }
                }

                if (evstr.length != 0) {
                    t.register("<font color=" + color + "><b>EVs:</b></font> " + evstr.join(" / "));
                }

                dvstr = [];
                for (w = 0; w < 6; w++) {
                    dvtable = evNames[w];
                    if (sys.teamPokeDV(tar, n, i, w) != 31 || gen == 2 && sys.teamPokeDV(tar, n, i, w) != 15) {
                        dvstr.push(sys.teamPokeDV(tar, n, i, w) + " " + dvtable);
                    }
                }

                if (dvstr.length != 0) {
                    t.register("<font color=" + color + "><b>IVs:</b></font> " + dvstr.join(" / "));
                }

                if (gen > 2) {
                    nature = natureNames[sys.teamPokeNature(tar, n, i)];
                    t.register("<b><font color=" + color + ">" + nature + "</font></b>");
                }

                for (j = 0; j < 4; j++) {
                    moveNum = sys.teamPokeMove(tar, n, i, j);
                    moveName = sys.move(moveNum);
                    moveStr = "<b><font color=" + colorNames[sys.moveType(moveNum)] + ">" + moveName + "</font></b>";

                    if (moveNum == 0) {
                        continue;
                    }

                    if (moveNum == hiddenPowerNum) {
                        hpdvs = [];

                        for (w = 0; w < 6; w++) {
                            hpdvs.push(sys.teamPokeDV(src, n, i, w));
                        }

                        hp = sys.hiddenPowerType.apply(sys, [gen].concat(hpdvs));
                        movetype = sys.type(hp);

                        hptype = "<font color=" + colorNames[hp] + "><b>" + movetype + "</b></font>";
                        moveStr = "<font color=" + colorNames[hp] + "><b>Hidden Power</b></font> [" + hptype + "]";
                    }

                    t.register("-" + moveStr);
                }
                
                t.register("");

                if (teamno != numteams) {
                    t.register("<hr/>");
                }
            }
        }

        t.render(src, chan, "<br/>");
    },

    loadTiers: function () {
        TierBans = new(function () {
            this.bans = [];

            this.Include = 0;
            this.Exclude = 1;

            this.newBan = function (method, tiers, ban) {
                this.bans.push({
                    method: method,
                    tiers: tiers,
                    ban: ban
                });
            }

            this.isLegalTeam = function (src, team, tier, silent) {
                if (tier == "Challenge Cup") {
                    return true;
                }


                if (!sys.hasLegalTeamForTier(src, team, tier)) {
                    return false;
                }

                var alerts = [],
                    x, b = this.bans,
                    cban, correct, z, alert;

                for (x in b) {
                    cban = b[x];
                    if (cban.method == this.Include) {
                        correct = cban.tiers.has(tier);
                    } else {
                        correct = !cban.tiers.has(tier);
                    }

                    if (correct) {
                        alert = cban.ban(src, team, tier);
                        if (typeof alert == "object") {
                            alerts.concat(alert);
                        }
                    }

                    if (alerts.length == 0) {
                        return true; // Team is valid
                    } else if (!silent) {
                        for (z in alerts) {
                            teamAlert(src, team, alerts[z]);
                        }
                        return false;
                    }
                }
            }

            this.findGoodTier = function (src, team) {
                var path = ["Wifi LC", "DW LC", "Wifi LC Ubers", "Wifi NU", "Wifi LU", "Wifi UU", "Wifi OU", "No Preview OU", "Wifi Ubers", "No Preview Ubers", "Challenge Cup"],
                    i, tier;
                for (i in path) {
                    tier = path[i];
                    if (sys.hasLegalTeamForTier(src, team, tier) && this.isLegalTeam(src, team, tier, true)) {
                        teamAlert(src, team, "Your team's tier is now " + tier + ".");
                        sys.changeTier(src, team, tier);
                        return;
                    }
                }
            }
        })();

        var INCLUDING = TierBans.Include,
            EXCLUDING = TierBans.Exclude,
            cc = ["Challenge Cup", "CC 1v1"],
            dw = ["No Preview OU", "No Preview Ubers", "Monotype", "Gen 5 1v1 Ubers", "Gen 5 1v1", "Challenge Cup", "CC 1v1", "DW Uber Triples", "No Preview OU Triples", "No Preview Uber Doubles", "No Preview OU Doubles", "Shanai Cup", "Monocolour"];

        TierBans.newBan(EXCLUDING, [], function eventShinies(player, team) {
            if (typeof beasts == "undefined") {
                beasts = {};
                beasts[sys.pokeNum('Raikou')] = ['Extremespeed', 'Aura Sphere', 'Weather Ball', 'Zap Cannon'].map(sys.moveNum);
                beasts[sys.pokeNum('Suicune')] = ['Extremespeed', 'Aqua Ring', 'Sheer Cold', 'Air Slash'].map(sys.moveNum);
                beasts[sys.pokeNum('Entei')] = ['Extremespeed', 'Howl', 'Crush Claw', 'Flare Blitz'].map(sys.moveNum);
            }

            var beast, slot, i;
            for (beast in beasts) {
                for (slot = 0; slot < 6; slot++) {
                    if (sys.teamPoke(player, team, slot) == beast) {
                        for (i = 0; i < 4; i++) {
                            if (beasts[beast].has(sys.teamPokeMove(player, team, slot, i))) {
                                sys.changePokeShine(player, team, slot, true);
                            }
                        }
                    }
                }
            }
        });

        TierBans.newBan(EXCLUDING, cc, function customAbilityBans(src, team, tier) {
            var ltier = tier.toLowerCase(),
                ret = [],
                bans = DataHash.bannedAbilities,
                i, ability, lability, poke, lpoke;
            for (i = 0; i < 6; ++i) {
                ability = sys.ability(sys.teamPokeAbility(src, team, i)), lability = ability.toLowerCase(), poke = sys.pokemon(sys.teamPoke(src, team, i)), lpoke = poke.toLowerCase();

                if (bans[ltier] != undefined) {
                    if (bans[ltier][lpoke] != undefined) {
                        if (bans[ltier][lpoke].indexOf(lability) != -1) {
                            ret.push(poke + " is not allowed to have ability " + ability + " in " + tier + ". Please change it in Teambuilder.");
                        }
                    }
                }
            }
            return ret;
        });

        TierBans.newBan(EXCLUDING, cc, function eventMovesCheck(src, team, tier) {
            var ret = [],
                i, poke, x, y, nat, move;
            for (i = 0; i < 6; i++) {
                poke = sys.teamPoke(src, team, i);
                if (pokeNatures.has(poke)) {
                    for (x in pokeNatures[poke]) {
                        nat = pokeNatures[poke][x];
                        for (y in nat[0]) {
                            move = nat[0][y];
                            if (sys.hasTeamPokeMove(src, team, i, sys.moveNum(move)) && sys.teamPokeNature(src, team, i) != sys.natureNum(nat[1])) {
                                ret.push(sys.pokemon(poke) + " with " + move + " must be a " + nat[1] + " nature. Change it in the teambuilder.");
                            }
                        }
                    }
                }
            }
            return ret;
        });

        TierBans.newBan(INCLUDING, ["Wifi LC", "Wifi LC Ubers", "Wifi UU LC"], function littleCupCheck(src, team, tier) {
            var ret = [],
                i, x;
            for (i = 0; i < 6; i++) {
                x = sys.teamPoke(src, team, i);
                if (x !== 0 && sys.hasDreamWorldAbility(src, team, i) && lcpokemons.indexOf(x) != -1) {
                    ret.push(sys.pokemon(x) + " is not allowed with a Dream World ability in the " + tier + " tier. Change it in the teambuilder.");

                }
            }
            return ret;
        });

        TierBans.newBan(INCLUDING, ["Wifi NU"], function evioliteCheck(src, team, tier) {
            var evioliteLimit = 6,
                eviolites = 0,
                i, x, item;

            for (i = 0; i < 6; i++) {
                x = sys.teamPoke(src, team, i);
                item = sys.teamPokeItem(src, team, i);
                if (item !== undefined) {
                    item = sys.item(item);
                }
                else {
                    item = "";
                }
                if (item == "Eviolite" && ++eviolites > evioliteLimit) {
                    return ["Only 1 pokemon is allowed with eviolite in " + tier + " tier. Please remove extra evioites in teambuilder."];
                }
            }
        });

        TierBans.newBan(EXCLUDING, dw, function dwAbilityCheck(src, team, tier) {
            if (sys.gen(src, team) < 5) {
                return;
            }
            var ret = [],
                i, x;
            for (i = 0; i < 6; i++) {
                x = sys.teamPoke(src, team, i);
                if (x !== 0 && sys.hasDreamWorldAbility(src, team, i) && (!(x in dwpokemons) || (breedingpokemons.indexOf(x) != -1 && sys.compatibleAsDreamWorldEvent(src, team, i) !== true))) {
                    if (!(x in dwpokemons)) {
                        ret.push(sys.pokemon(x) + " is not allowed with a Dream World ability in " + tier + " tier. Change it in the teambuilder.");
                    } else {
                        ret.push(sys.pokemon(x) + " has to be Male and have no egg moves with its Dream World ability in  " + tier + " tier. Change it in the teambuilder.");
                    }
                }
            }
            return ret;
        });

        TierBans.newBan(INCLUDING, ["No Preview OU", "Wifi OU", "Wifi UU", "Wifi LU", "Wifi LC", "DW LC", "Wifi Ubers", "No Preview Ubers", "Clear Skies", "Clear Skies DW", "Monotype", "Monocolour", "Monogen", "Smogon OU", "Smogon UU", "Smogon RU", "Wifi NU"], function inconsistentCheck(src, team, tier) {
            var moody = sys.abilityNum("Moody"),
                ret = [],
                i, x;

            for (i = 0; i < 6; i++) {
                x = sys.teamPoke(src, team, i);
                if (x !== 0 && sys.teamPokeAbility(src, team, i) == moody) {
                    ret.push(sys.pokemon(x) + " is not allowed with Moody in " + tier + ". Change it in the teambuilder.");
                }
            }
            return ret;
        });

        TierBans.newBan(INCLUDING, ["Clear Skies"], function weatherlesstiercheck(src, team, tier) {
            var ret = [],
                i, ability, tl;
            for (i = 0; i < 6; i++) {
                ability = sys.ability(sys.teamPokeAbility(src, team, i));
                tl = ability.toLowerCase();

                if (tl == "drizzle" || tl == "drought" || tl == "snow warning" || tl == "sand stream") {
                    ret.push("Your team has a pokemon with the ability " + ability + ", please remove before entering " + tier + " tier.");
                }
            }
            return ret;
        });

        TierBans.newBan(INCLUDING, ["Monotype"], function monotypeCheck(src, team, tier) {
            var TypeA = sys.pokeType1(sys.teamPoke(src, team, 0), 5),
                TypeB = sys.pokeType2(sys.teamPoke(src, team, 0), 5),
                k, checkType, i, temptypeA, temptypeB;
            for (i = 1; i < 6; i++) {
                if (sys.teamPoke(src, team, i) === 0) {
                    continue;
                }

                temptypeA = sys.pokeType1(sys.teamPoke(src, team, i), 5), temptypeB = sys.pokeType2(sys.teamPoke(src, team, i), 5);

                if (checkType !== undefined) {
                    k = 3;
                }
                if (i == 1) {
                    k = 1;
                }
                if (TypeB != 17) {
                    if (temptypeA == TypeA && temptypeB == TypeB && k == 1 || temptypeA == TypeB && temptypeB == TypeA && k == 1) {
                        k = 2;
                    }
                }
                if (temptypeA == TypeA && k == 1 || temptypeB == TypeA && k == 1) {
                    checkType = TypeA;
                }
                if (temptypeA == TypeB && k == 1 || temptypeB == TypeB && k == 1) {
                    if (TypeB != 17) {
                        checkType = TypeB;
                    }
                    if (TypeB == 17) {
                        checkType = TypeA;
                    }
                }
                if (i > 1 && k == 2) {
                    k = 1;
                    if (temptypeA == TypeA && temptypeB == TypeB && k == 1 || temptypeA == TypeB && temptypeB == TypeA && k == 1) {
                        k = 2;
                    }
                    if (temptypeA == TypeA && k == 1 || temptypeB == TypeA && k == 1) {
                        checkType = TypeA;
                    }
                    if (temptypeA == TypeB && k == 1 || temptypeB == TypeB && k == 1) {
                        if (TypeB != 17) {
                            checkType = TypeB;
                        }
                        if (TypeB == 17) {
                            checkType = TypeA;
                        }
                    }
                }
                if (k == 3) {
                    if (temptypeA != checkType && temptypeB != checkType) {
                        return ["Your team is not Monotype as " + sys.pokemon(sys.teamPoke(src, team, i)) + " is not of type " + sys.type(checkType) + "!"];
                    }
                }

                if (k == 1) {
                    if (TypeB == 17) {
                        TypeB = TypeA;
                    }
                    if (temptypeA != TypeA && temptypeB != TypeA && temptypeA != TypeB && temptypeB != TypeB) {
                        return ["Your team is not Monotype as " + sys.pokemon(sys.teamPoke(src, team, i)) + " does not share a type with " + sys.pokemon(sys.teamPoke(src, team, 0)) + "!"];
                    }

                }
            }
        });

        TierBans.newBan(INCLUDING, ["Monogen"], function monoGenCheck(src, team, tier) {
            var GEN_MAX = [0, 151, 252, 386, 493, 647],
                gen = 0,
                i, pokenum, species;
            for (i = 0; i < 6; ++i) {
                pokenum = sys.teamPoke(src, team, i), species = pokenum % 65536; // remove alt formes
                if (species === 0) {
                    continue;
                }
                if (gen === 0) {
                    while (species > GEN_MAX[gen]) {
                        ++gen; // Search for correct gen for first poke
                    }
                } else if (!(GEN_MAX[gen - 1] < species && species <= GEN_MAX[gen])) {
                    return [sys.pokemon(pokenum) + " is not from gen " + gen + "!"];
                }
            }
        });


        TierBans.newBan(INCLUDING, ["Monocolour"], function monoColourCheck(src, team, tier) {
            if (typeof pokeColours == 'undefined') {
                pokeColours = {
                    'Red': ['Charmander', 'Charmeleon', 'Charizard', 'Vileplume', 'Paras', 'Parasect', 'Krabby', 'Kingler', 'Voltorb', 'Electrode', 'Goldeen', 'Seaking', 'Jynx', 'Magikarp', 'Magmar', 'Flareon', 'Ledyba', 'Ledian', 'Ariados', 'Yanma', 'Scizor', 'Slugma', 'Magcargo', 'Octillery', 'Delibird', 'Porygon2', 'Magby', 'Ho-Oh', 'Torchic', 'Combusken', 'Blaziken', 'Wurmple', 'Medicham', 'Carvanha', 'Camerupt', 'Solrock', 'Corphish', 'Crawdaunt', 'Latias', 'Groudon', 'Deoxys', 'Deoxys-A', 'Deoxys-D', 'Deoxys-S', 'Kricketot', 'Kricketune', 'Magmortar', 'Porygon-Z', 'Rotom', 'Rotom-H', 'Rotom-F', 'Rotom-W', 'Rotom-C', 'Rotom-S', 'Tepig', 'Pignite', 'Emboar', 'Pansear', 'Simisear', 'Throh', 'Venipede', 'Scolipede', 'Krookodile', 'Darumaka', 'Darmanitan', 'Dwebble', 'Crustle', 'Scrafty', 'Shelmet', 'Accelgor', 'Druddigon', 'Pawniard', 'Bisharp', 'Braviary', 'Heatmor'],
                    'Blue': ['Squirtle', 'Wartortle', 'Blastoise', 'Nidoran?', 'Nidorina', 'Nidoqueen', 'Oddish', 'Gloom', 'Golduck', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Tentacool', 'Tentacruel', 'Tangela', 'Horsea', 'Seadra', 'Gyarados', 'Lapras', 'Vaporeon', 'Omanyte', 'Omastar', 'Articuno', 'Dratini', 'Dragonair', 'Totodile', 'Croconaw', 'Feraligatr', 'Chinchou', 'Lanturn', 'Marill', 'Azumarill', 'Jumpluff', 'Wooper', 'Quagsire', 'Wobbuffet', 'Heracross', 'Kingdra', 'Phanpy', 'Suicune', 'Mudkip', 'Marshtomp', 'Swampert', 'Taillow', 'Swellow', 'Surskit', 'Masquerain', 'Loudred', 'Exploud', 'Azurill', 'Meditite', 'Sharpedo', 'Wailmer', 'Wailord', 'Swablu', 'Altaria', 'Whiscash', 'Chimecho', 'Wynaut', 'Spheal', 'Sealeo', 'Walrein', 'Clamperl', 'Huntail', 'Bagon', 'Salamence', 'Beldum', 'Metang', 'Metagross', 'Regice', 'Latios', 'Kyogre', 'Piplup', 'Prinplup', 'Empoleon', 'Shinx', 'Luxio', 'Luxray', 'Cranidos', 'Rampardos', 'Gible', 'Gabite', 'Garchomp', 'Riolu', 'Lucario', 'Croagunk', 'Toxicroak', 'Finneon', 'Lumineon', 'Mantyke', 'Tangrowth', 'Glaceon', 'Azelf', 'Phione', 'Manaphy', 'Oshawott', 'Dewott', 'Samurott', 'Panpour', 'Simipour', 'Roggenrola', 'Boldore', 'Gigalith', 'Woobat', 'Swoobat', 'Tympole', 'Palpitoad', 'Seismitoad', 'Sawk', 'Tirtouga', 'Carracosta', 'Ducklett', 'Karrablast', 'Eelektrik', 'Eelektross', 'Elgyem', 'Cryogonal', 'Deino', 'Zweilous', 'Hydreigon', 'Cobalion', 'Thundurus'],
                    'Green': ['Bulbasaur', 'Ivysaur', 'Venusaur', 'Caterpie', 'Metapod', 'Bellsprout', 'Weepinbell', 'Victreebel', 'Scyther', 'Chikorita', 'Bayleef', 'Meganium', 'Spinarak', 'Natu', 'Xatu', 'Bellossom', 'Politoed', 'Skiploom', 'Larvitar', 'Tyranitar', 'Celebi', 'Treecko', 'Grovyle', 'Sceptile', 'Dustox', 'Lotad', 'Lombre', 'Ludicolo', 'Breloom', 'Electrike', 'Roselia', 'Gulpin', 'Vibrava', 'Flygon', 'Cacnea', 'Cacturne', 'Cradily', 'Kecleon', 'Tropius', 'Rayquaza', 'Turtwig', 'Grotle', 'Torterra', 'Budew', 'Roserade', 'Bronzor', 'Bronzong', 'Carnivine', 'Yanmega', 'Leafeon', 'Shaymin', 'Shaymin-S', 'Snivy', 'Servine', 'Serperior', 'Pansage', 'Simisage', 'Swadloon', 'Cottonee', 'Whimsicott', 'Petilil', 'Lilligant', 'Basculin', 'Maractus', 'Trubbish', 'Garbodor', 'Solosis', 'Duosion', 'Reuniclus', 'Axew', 'Fraxure', 'Golett', 'Golurk', 'Virizion', 'Tornadus'],
                    'Yellow': ['Kakuna', 'Beedrill', 'Pikachu', 'Raichu', 'Sandshrew', 'Sandslash', 'Ninetales', 'Meowth', 'Persian', 'Psyduck', 'Ponyta', 'Rapidash', 'Drowzee', 'Hypno', 'Exeggutor', 'Electabuzz', 'Jolteon', 'Zapdos', 'Moltres', 'Cyndaquil', 'Quilava', 'Typhlosion', 'Pichu', 'Ampharos', 'Sunkern', 'Sunflora', 'Girafarig', 'Dunsparce', 'Shuckle', 'Elekid', 'Raikou', 'Beautifly', 'Pelipper', 'Ninjask', 'Makuhita', 'Manectric', 'Plusle', 'Minun', 'Numel', 'Lunatone', 'Jirachi', 'Mothim', 'Combee', 'Vespiquen', 'Chingling', 'Electivire', 'Uxie', 'Cresselia', 'Victini', 'Sewaddle', 'Leavanny', 'Scraggy', 'Cofagrigus', 'Archen', 'Archeops', 'Deerling', 'Joltik', 'Galvantula', 'Haxorus', 'Mienfoo', 'Keldeo'],
                    'Purple': ['Rattata', 'Ekans', 'Arbok', 'Nidoran?', 'Nidorino', 'Nidoking', 'Zubat', 'Golbat', 'Venonat', 'Venomoth', 'Grimer', 'Muk', 'Shellder', 'Cloyster', 'Gastly', 'Haunter', 'Gengar', 'Koffing', 'Weezing', 'Starmie', 'Ditto', 'Aerodactyl', 'Mewtwo', 'Crobat', 'Aipom', 'Espeon', 'Misdreavus', 'Forretress', 'Gligar', 'Granbull', 'Mantine', 'Tyrogue', 'Cascoon', 'Delcatty', 'Sableye', 'Illumise', 'Swalot', 'Grumpig', 'Lileep', 'Shellos', 'Gastrodon', 'Ambipom', 'Drifloon', 'Drifblim', 'Mismagius', 'Stunky', 'Skuntank', 'Spiritomb', 'Skorupi', 'Drapion', 'Gliscor', 'Palkia', 'Purrloin', 'Liepard', 'Gothita', 'Gothorita', 'Gothitelle', 'Mienshao', 'Genesect'],
                    'Pink': ['Clefairy', 'Clefable', 'Jigglypuff', 'Wigglytuff', 'Slowpoke', 'Slowbro', 'Exeggcute', 'Lickitung', 'Chansey', 'Mr. Mime', 'Porygon', 'Mew', 'Cleffa', 'Igglybuff', 'Flaaffy', 'Hoppip', 'Slowking', 'Snubbull', 'Corsola', 'Smoochum', 'Miltank', 'Blissey', 'Whismur', 'Skitty', 'Milotic', 'Gorebyss', 'Luvdisc', 'Cherubi', 'Cherrim', 'Mime Jr.', 'Happiny', 'Lickilicky', 'Mesprit', 'Munna', 'Musharna', 'Audino', 'Alomomola'],
                    'Brown': ['Weedle', 'Pidgey', 'Pidgeotto', 'Pidgeot', 'Raticate', 'Spearow', 'Fearow', 'Vulpix', 'Diglett', 'Dugtrio', 'Mankey', 'Primeape', 'Growlithe', 'Arcanine', 'Abra', 'Kadabra', 'Alakazam', 'Geodude', 'Graveler', 'Golem', 'Farfetch\'d', 'Doduo', 'Dodrio', 'Cubone', 'Marowak', 'Hitmonlee', 'Hitmonchan', 'Kangaskhan', 'Staryu', 'Pinsir', 'Tauros', 'Eevee', 'Kabuto', 'Kabutops', 'Dragonite', 'Sentret', 'Furret', 'Hoothoot', 'Noctowl', 'Sudowoodo', 'Teddiursa', 'Ursaring', 'Swinub', 'Piloswine', 'Stantler', 'Hitmontop', 'Entei', 'Zigzagoon', 'Seedot', 'Nuzleaf', 'Shiftry', 'Shroomish', 'Slakoth', 'Slaking', 'Shedinja', 'Hariyama', 'Torkoal', 'Spinda', 'Trapinch', 'Baltoy', 'Feebas', 'Regirock', 'Chimchar', 'Monferno', 'Infernape', 'Starly', 'Staravia', 'Staraptor', 'Bidoof', 'Bibarel', 'Buizel', 'Floatzel', 'Buneary', 'Lopunny', 'Bonsly', 'Hippopotas', 'Hippowdon', 'Mamoswine', 'Heatran', 'Patrat', 'Watchog', 'Lillipup', 'Conkeldurr', 'Sandile', 'Krokorok', 'Sawsbuck', 'Beheeyem', 'Stunfisk', 'Bouffalant', 'Vullaby', 'Mandibuzz', 'Landorus'],
                    'Black': ['Snorlax', 'Umbreon', 'Murkrow', 'Unown', 'Sneasel', 'Houndour', 'Houndoom', 'Mawile', 'Spoink', 'Seviper', 'Claydol', 'Shuppet', 'Banette', 'Duskull', 'Dusclops', 'Honchkrow', 'Chatot', 'Munchlax', 'Weavile', 'Dusknoir', 'Giratina', 'Darkrai', 'Blitzle', 'Zebstrika', 'Sigilyph', 'Yamask', 'Chandelure', 'Zekrom'],
                    'Gray': ['Machop', 'Machoke', 'Machamp', 'Magnemite', 'Magneton', 'Onix', 'Rhyhorn', 'Rhydon', 'Pineco', 'Steelix', 'Qwilfish', 'Remoraid', 'Skarmory', 'Donphan', 'Pupitar', 'Poochyena', 'Mightyena', 'Nincada', 'Nosepass', 'Aron', 'Lairon', 'Aggron', 'Volbeat', 'Barboach', 'Anorith', 'Armaldo', 'Snorunt', 'Glalie', 'Relicanth', 'Registeel', 'Shieldon', 'Bastiodon', 'Burmy', 'Wormadam', 'Wormadam-G', 'Wormadam-S', 'Glameow', 'Purugly', 'Magnezone', 'Rhyperior', 'Probopass', 'Arceus', 'Herdier', 'Stoutland', 'Pidove', 'Tranquill', 'Unfezant', 'Drilbur', 'Excadrill', 'Timburr', 'Gurdurr', 'Whirlipede', 'Zorua', 'Zoroark', 'Minccino', 'Cinccino', 'Escavalier', 'Ferroseed', 'Ferrothorn', 'Klink', 'Klang', 'Klinklang', 'Durant', 'Terrakion', 'Kyurem'],
                    'White': ['Butterfree', 'Seel', 'Dewgong', 'Togepi', 'Togetic', 'Mareep', 'Smeargle', 'Lugia', 'Linoone', 'Silcoon', 'Wingull', 'Ralts', 'Kirlia', 'Gardevoir', 'Vigoroth', 'Zangoose', 'Castform', 'Absol', 'Shelgon', 'Pachirisu', 'Snover', 'Abomasnow', 'Togekiss', 'Gallade', 'Froslass', 'Dialga', 'Regigigas', 'Swanna', 'Vanillite', 'Vanillish', 'Vanilluxe', 'Emolga', 'Foongus', 'Amoonguss', 'Frillish', 'Jellicent', 'Tynamo', 'Litwick', 'Lampent', 'Cubchoo', 'Beartic', 'Rufflet', 'Larvesta', 'Volcarona', 'Reshiram', 'Meloetta', 'Meloetta-S']
                };
            }

            var poke = sys.pokemon(sys.teamPoke(src, team, 0)),
                thecolour = '',
                colour, i;

            for (colour in colours) {
                if (colours[colour].indexOf(poke) > -1) {
                    thecolour = colour;
                }
            }
            for (i = 1; i < 6; ++i) {
                poke = sys.pokemon(sys.teamPoke(src, team, i));
                if (colours[thecolour].indexOf(poke) == -1 && poke != "Missingno") {
                    return [Grammar.es(poke) + " colour is not " + thecolour];
                }
            }
        });

        TierBans.newBan(INCLUDING, ["Smogon OU", "Wifi OU", "No Preview OU"], function swiftSwimCheck(src, team, tier) {
            var i, j;
            for (i = 0; i < 6; ++i) {
                if (sys.ability(sys.teamPokeAbility(src, team, i)) == "Drizzle") {
                    for (j = 0; j < 6; ++j) {
                        if (sys.ability(sys.teamPokeAbility(src, team, j)) == "Swift Swim") {
                            return ["You cannot have the combination of Swift Swim and Drizzle in " + tier];
                        }
                    }
                }
            }
        });

        TierBans.newBan(INCLUDING, ["Smogon UU"], function droughtCheck(src, team, tier) {
            var i;
            for (i = 0; i < 6; ++i) {
                if (sys.ability(sys.teamPokeAbility(src, team, i)) == "Drought") {
                    return ["Drought is not allowed in Smogon UU"];
                }
            }
        });

        TierBans.newBan(INCLUDING, ["Wifi UU", "Wifi LU", "Wifi NU"], function sandStreamCheck(src, team, tier) {
            var i;
            for (i = 0; i < 6; ++i) {
                if (sys.ability(sys.teamPokeAbility(src, team, i)) == "Sand Stream") {
                    return ["Sand Stream is not allowed in " + tier + "."];
                }
            }
        });

        TierBans.newBan(INCLUDING, ["Wifi UU", "Wifi LU", "Wifi NU"], function snowWarningCheck(src, team, tier) {
            var i;
            for (i = 0; i < 6; ++i) {
                if (sys.ability(sys.teamPokeAbility(src, team, i)) == "Snow Warning") {
                    return ["Snow Warning is not allowed in " + tier + "."];
                }
            }
        });

        TierBans.newBan(INCLUDING, ["Shanai Cup"], function shanaiAbilityCheck(src, team, tier) {
            var bannedAbilities = {
                'treecko': ['overgrow'],
                'chimchar': ['blaze'],
                'totodile': ['torrent'],
                'spearow': ['sniper'],
                'skorupi': ['battle armor', 'sniper'],
                'spoink': ['thick fat'],
                'golett': ['iron fist'],
                'magnemite': ['magnet pull', 'analytic'],
                'electrike': ['static', 'lightningrod'],
                'nosepass': ['sturdy', 'magnet pull'],
                'axew': ['rivalry'],
                'croagunk': ['poison touch', 'dry skin'],
                'cubchoo': ['rattled'],
                'joltik': ['swarm'],
                'shroomish': ['effect spore', 'quick feet'],
                'pidgeotto': ['big pecks'],
                'karrablast': ['swarm']
            },
                ret = [],
                ability, lability, poke, lpoke;

            for (i = 0; i < 6; ++i) {
                ability = sys.ability(sys.teamPokeAbility(src, team, i)), lability = ability.toLowerCase(), poke = sys.pokemon(sys.teamPoke(src, team, i)), lpoke = poke.toLowerCase();
                if (lpoke in bannedAbilities && bannedAbilities[lpoke].indexOf(lability) != -1) {
                    ret.push(poke + " is not allowed to have ability " + ability + " in " + tier + ". Please change it in Teambuilder.");
                }
            }
            return ret;
        });

        TierBans.newBan(EXCLUDING, cc, function hasOneUsablePokemon(player, team) {
            var slot, move;
            for (slot = 0; slot < 6; slot++) {
                if (sys.teamPoke(player, team, slot) !== 0) {
                    for (move = 0; move < 4; move++)
                    if (sys.teamPokeMove(player, team, slot, move) !== 0) {
                        return;
                    }
                }
            }

            return ["You do not have any valid pokemon. (Please make at least one in Teambuilder)"];
        });

        dwpokemons = {};

        var dwpok, pnum = sys.pokeNum;

        if (Config.DWAbilityCheck) {
            var dwlist = ["Rattata", "Raticate", "Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Oddish", "Gloom", "Vileplume", "Bellossom", "Bellsprout", "Weepinbell", "Victreebel", "Ponyta", "Rapidash", "Farfetch'd", "Doduo", "Dodrio", "Exeggcute", "Exeggutor", "Lickitung", "Lickilicky", "Tangela", "Tangrowth", "Kangaskhan", "Sentret", "Furret", "Cleffa", "Clefairy", "Clefable", "Igglybuff", "Jigglypuff", "Wigglytuff", "Mareep", "Flaaffy", "Ampharos", "Hoppip", "Skiploom", "Jumpluff", "Sunkern", "Sunflora", "Stantler", "Poochyena", "Mightyena", "Lotad", "Ludicolo", "Lombre", "Taillow", "Swellow", "Surskit", "Masquerain", "Bidoof", "Bibarel", "Shinx", "Luxio", "Luxray", "Psyduck", "Golduck", "Growlithe", "Arcanine", "Scyther", "Scizor", "Tauros", "Azurill", "Marill", "Azumarill", "Bonsly", "Sudowoodo", "Girafarig", "Miltank", "Zigzagoon", "Linoone", "Electrike", "Manectric", "Castform", "Pachirisu", "Buneary", "Lopunny", "Glameow", "Purugly", "Natu", "Xatu", "Skitty", "Delcatty", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Bulbasaur", "Charmander", "Squirtle", "Ivysaur", "Venusaur", "Charmeleon", "Charizard", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Infernape", "Monferno", "Piplup", "Prinplup", "Empoleon", "Treecko", "Sceptile", "Grovyle", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Caterpie", "Metapod", "Butterfree", "Pidgey", "Pidgeotto", "Pidgeot", "Spearow", "Fearow", "Zubat", "Golbat", "Crobat", "Aerodactyl", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Yanma", "Yanmega", "Murkrow", "Honchkrow", "Delibird", "Wingull", "Pelipper", "Swablu", "Altaria", "Starly", "Staravia", "Staraptor", "Gligar", "Gliscor", "Drifloon", "Drifblim", "Skarmory", "Tropius", "Chatot", "Slowpoke", "Slowbro", "Slowking", "Krabby", "Kingler", "Horsea", "Seadra", "Kingdra", "Goldeen", "Seaking", "Magikarp", "Gyarados", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Wooper", "Quagsire", "Qwilfish", "Corsola", "Remoraid", "Octillery", "Mantine", "Mantyke", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Barboach", "Whiscash", "Clamperl", "Gorebyss", "Huntail", "Relicanth", "Luvdisc", "Buizel", "Floatzel", "Finneon", "Lumineon", "Tentacool", "Tentacruel", "Corphish", "Crawdaunt", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Shellos", "Gastrodon", "Lapras", "Dratini", "Dragonair", "Dragonite", "Elekid", "Electabuzz", "Electivire", "Poliwag", "Poliwrath", "Politoed", "Poliwhirl", "Vulpix", "Ninetales", "Musharna", "Munna", "Darmanitan", "Darumaka", "Mamoswine", "Togekiss", "Burmy", "Wormadam", "Mothim", "Pichu", "Pikachu", "Raichu", "Abra", "Kadabra", "Alakazam", "Spiritomb", "Mr. Mime", "Mime Jr.", "Meditite", "Medicham", "Meowth", "Persian", "Shuppet", "Banette", "Spinarak", "Ariados", "Drowzee", "Hypno", "Wobbuffet", "Wynaut", "Snubbull", "Granbull", "Houndour", "Houndoom", "Smoochum", "Jynx", "Ralts", "Gardevoir", "Gallade", "Sableye", "Mawile", "Volbeat", "Illumise", "Spoink", "Grumpig", "Stunky", "Skuntank", "Bronzong", "Bronzor", "Mankey", "Primeape", "Machop", "Machoke", "Machamp", "Magnemite", "Magneton", "Magnezone", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Rhyperior", "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Phanpy", "Donphan", "Magby", "Magmar", "Magmortar", "Larvitar", "Pupitar", "Tyranitar", "Makuhita", "Hariyama", "Numel", "Camerupt", "Torkoal", "Spinda", "Trapinch", "Vibrava", "Flygon", "Cacnea", "Cacturne", "Absol", "Beldum", "Metang", "Metagross", "Hippopotas", "Hippowdon", "Skorupi", "Drapion", "Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop", "Bagon", "Shelgon", "Salamence", "Seel", "Dewgong", "Shellder", "Cloyster", "Chinchou", "Lanturn", "Smeargle", "Porygon", "Porygon2", "Porygon-Z", "Drilbur", "Excadrill", "Basculin", "Basculin-a", "Alomomola", "Stunfisk", "Druddigon", "Foongus", "Amoonguss", "Liepard", "Purrloin", "Minccino", "Cinccino", "Sandshrew", "Sandslash", "Vullaby", "Mandibuzz", "Rufflet", "Braviary", "Frillish", "Jellicent", "Weedle", "Kakuna", "Beedrill", "Shroomish", "Breloom", "Zangoose", "Seviper", "Combee", "Vespiquen", "Patrat", "Watchog", "Blitzle", "Zebstrika", "Woobat", "Swoobat", "Mienfoo", "Mienshao", "Bouffalant", "Staryu", "Starmie", "Togepi", "Shuckle", "Togetic", "Rotom", "Sigilyph", "Riolu", "Lucario", "Lugia", "Ho-Oh", "Dialga", "Palkia", "Giratina", "Grimer", "Muk", "Ditto", "Venonat", "Venomoth", "Herdier", "Lillipup", "Stoutland", "Sewaddle", "Swadloon", "Leavanny", "Cubchoo", "Beartic", "Landorus", "Thundurus", "Tornadus", "Dunsparce", "Sneasel", "Weavile", "Nosepass", "Probopass", "Karrablast", "Escavalier", "Shelmet", "Accelgor", "Snorunt", "Glalie", "Froslass", "Heatran", "Pinsir", "Emolga", "Heracross", "Trubbish", "Garbodor", "Snover", "Abomasnow", "Diglett", "Dugtrio", "Geodude", "Graveler", "Golem", "Onix", "Steelix", "Voltorb", "Electrode", "Cubone", "Marowak", "Whismur", "Loudred", "Exploud", "Aron", "Lairon", "Aggron", "Spheal", "Sealeo", "Walrein", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Gible", "Gabite", "Garchomp", "Pidove", "Tranquill", "Unfezant", "Tympole", "Palpitoad", "Seismitoad", "Cottonee", "Whimsicott", "Petilil", "Lilligant", "Ducklett", "Swanna", "Deerling", "Sawsbuck", "Elgyem", "Beheeyem", "Pawniard", "Bisharp", "Heatmor", "Durant", "Venipede", "Whirlipede", "Scolipede", "Tirtouga", "Carracosta", "Joltik", "Galvantula", "Maractus", "Dwebble", "Crustle", "Roggenrola", "Boldore", "Gigalith", "Vanillite", "Vanillish", "Vanilluxe", "Klink", "Klang", "Klinklang", "Swinub", "Piloswine", "Golett", "Golurk", "Gothitelle", "Gothorita"];
            for (dwpok in dwlist) {
                dwpokemons[pnum(dwlist[dwpok])] = true;
            }
        }

        var lclist = ["Bulbasaur", "Charmander", "Squirtle", "Croagunk", "Turtwig", "Chimchar", "Piplup", "Treecko", "Torchic", "Mudkip"];
        lcpokemons = [];

        for (dwpok in lclist) {
            lcpokemons.push(pnum(lclist[dwpok]));
        }

        bannedGSCSleep = [sys.moveNum("Spore"), sys.moveNum("Hypnosis"), sys.moveNum("Lovely Kiss"), sys.moveNum("Sing"), sys.moveNum("Sleep Powder")];
        bannedGSCTrap = [sys.moveNum("Mean Look"), sys.moveNum("Spider Web")];

        pokeNatures = {
            "Heatran": [
                ["Eruption"], "Quiet"],
            "Suicune": [
                ["ExtremeSpeed", "Sheer Cold", "Aqua Ring", "Air Slash"], "Relaxed"],
            "Raikou": [
                ["ExtremeSpeed", "Weather Ball", "Zap Cannon", "Aura Sphere"], "Rash"],
            "Entei": [
                ["ExtremeSpeed", "Flare Blitz", "Howl", "Crush Claw"], "Adamant"],
            "Snivy": [
                ["Aromatherapy", "Synthesis"], "Hardy"]
        };

        breedingpokemons = [];

        if (Config.DWAbilityCheck) {
            var breedingList = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Hitmonlee", "Hitmonchan", "Hitmontop", "Tyrogue", "Porygon", "Porygon2", "Porygon-Z", "Gothorita", "Gothitelle"];
            for (dwnum in breedingList) {
                breedingpokemons.push(sys.pokeNum(breedingList[dwpok]));
            }
        }

    },

    resolveLocation: function (id, ip, synchronously) {
        var dhl = DataHash.locations,
            myip = ip;
        if (dhl[ip] == undefined) {
            dhl[ip] = {
                'hostname': 'pending',
                'country_code': 'pending',
                'country_name': 'pending'
            };

            if (!synchronously) {
                sys.webCall(IP_Resolve_URL.format(ip), function (json_code) {
                    json_code = json_code.replace("ip", '"ip"');
                    json_code = json_code.replace("hostname", '"hostname"');
                    json_code = json_code.replace("country_code", '"country_code"');
                    json_code = json_code.replace("country_name", '"country_name"');

                    var code = JSON.parse(json_code);
                    dhl[myip] = code;
                    playerscache.write("locations", JSON.stringify(dhl));

                    if (sys.loggedIn(id)) {
                        if (code.country_name == "Anonymous Proxy") {
                            sendFailWhale(src, 0);
                            botMessage(src, "Remove the proxy to enter the server.");
                            botAll(sys.name(id) + " tried to enter the server and failed. [Reason: Proxy]", watch);
                            kick(src);
                        }
                    }
                });
            }
            else {
                var json_code = sys.synchronousWebCall(IP_Resolve_URL.format(ip));
                json_code = json_code.replace("ip", '"ip"');
                json_code = json_code.replace("hostname", '"hostname"');
                json_code = json_code.replace("country_code", '"country_code"');
                json_code = json_code.replace("country_name", '"country_name"');

                var code = JSON.parse(json_code);
                dhl[myip] = code;
                playerscache.write("locations", JSON.stringify(dhl));

                if (sys.loggedIn(id)) {
                    if (code.country_name == "Anonymous Proxy") {
                        sendFailWhale(src, 0);
                        botMessage(src, "Remove the proxy to enter the server.");
                        botAll(sys.name(id) + " tried to enter the server and failed. [Reason: Proxy]", watch);
                        kick(src);
                    }
                }
            }

        }
    },

    loadUtilities: function () {
        if (typeof fonts == 'undefined') {
            // Windows 7 Fonts //
            // Note: Some fonts MIGHT not work/look too much like default font
            // so they won't be noticed.
            fonts = ["Aharoni", "Andalus", "Angsana New", "AngsanaUPC", "Aparajita", "Arabic Typesetting", "Arial", "Arial Unicode MS", "Batang", "BatangChe", "Blackadder ITC", "Book Antiqua", "Bookman Old Style", "Bookshelf Symbol 7", "Bradley Hand ITC", "Browallia New", "BrowalliaUPC", "Calibri", "Cambria", "Cambria Math", "Candara", "Century Gothic", "Century", "Comic Sans MS", "Consolas", "Constantia", "Copperplate Gothic", "Corbel", "Cordia New", "CordiaUPC", "Courier New", "Courier", "Curlz MT", "DaunPenh", "David", "DFKai-SB", "DilleniaUPC", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Engravers MT", "Eras ITC", "Estrangelo Edessa", "EucrosiaUPC", "Euphemia", "Eurostile", "FangSong", "Felix Titling", "Fixedsys", "Franklin Gothic", "Franklin Gothic Book", "FrankReuhl", "FreesiaUPC", "Freestyle Script", "French Script MT", "Gabriolia", "Garamond", "Gautami", "Georgia", "Gisha", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Impact", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jokerman", "Juice ITC", "KaiTI", "Kalinga", "Kartika", "Khmer UI", "KodchiangUPC", "Kokila", "Kristen ITC", "Lao UI", "Latha", "Leelawadee", "Levenim MT", "LilyUPC", "Lucida Console", "Lucida", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Unicode", "Maiandra GD", "Malgun Gothic", "Mangal", "Matisse ITC", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Miriam Fixed", "Miriam", "Mistral", "Modern", "Mongolian Baiti", "Monotype Corsiva", "MoolBoran", "MS Gothic", "MS Mincho", "MS PGothic", "MS PMincho", "MS Reference1", "MS Reference2", "MS Reference Sans Serif", "MS Reference Specialty", "MS Sans Serif", "MS Serif", "MS UI Gothic", "MT Extra", "MV Boli", "Narkisim", "NSimSun", "Nyala", "OCR A Breed", "Palatino Linotype", "Papyrus", "Perpetua", "PlantageNet Cherokee", "PMingLiU", "PMingLiU-ExtB", "Pristina", "Raavi", "Rockwell", "Rod", "Roman", "Sakkal", "Script", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Symbol", "Shonar Bangla", "Shruti", "SemHei", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Small Fonts", "Sylfaen", "Symbol", "System", "Tahoma", "Tempus Sans ITC", "Terminal", "Times New Roman", "Traditional Arabic", "Trebucket MS", "Tunga", "Utsaah", "Vani", "Verdana", "Vijaya", "Vivaldi", "Vrinda", "Webdings", "Wingdings2", "Wingdings3", "Wingdings"];

            // PO Fonts //
            fonts.push("LCD", "SignPainter'sGothicShadedSC JL");
        }

        checkForUpdates = function (noresume) {
            return; // TODO: Modify.
            var commitData = "";
            try {
                commitData = JSON.parse(cache.get("LastCommitData"));
            }
            catch (e) {
                commitData = "";
            }

            sys.webCall(CommitDataURL, function (resp) {
                if (resp != "") {
                    var json = JSON.parse(resp);
                    var lastCom = json.commits[0];
                    var commitMsg = lastCom.message;

                    if (commitMsg.toLowerCase().indexOf("(script: no update)") == -1) {
                        if (commitData.message != commitMsg || commitData == "") {
                            cache.write("LastCommitData", JSON.stringify(lastCom));
                            botAll("An update for the script is available. Update available on <a href=" + ScriptURL + ">" + ScriptURL + "</a>.", 0);
                            botAll("Commit Message: " + commitMsg, 0);

                        }
                    }
                }
            });

            if (noresume == null) {
                sys.callLater("checkForUpdates();", 1800);
            }
        }

        if (typeof updateChecking == 'undefined') {
            sys.callLater("checkForUpdates();", 1800); /* 60*30 */
            updateChecking = true;
        }

        ScriptUpdateMessage = function () {
            var runEndTime = new Date().getTime(),
                ending = runEndTime - EvaluationTimeStart,
                load = "Runtime: " + ending / 1000 + " seconds.";
            delete EvaluationTimeStart;

            DisableChatColorRandomizer(0);

            if (typeof StartUp !== 'undefined') {
                delete StartUp;
                print("\t\tServer Script has been loaded.\t\t\n\t\tEvaluation Time: " + ending / 1000 + " seconds.\t\t");
                return;
            }

            var code = '<center><table border="1" width="50%" style="background: qradialgradient(cy: 0.1, cx: 0.5, fx: 0.9, fy: 0, radius: 2 stop: 0 black, stop: 1 white);"><tr style="background: qradialgradient(cy: 0.1, cx: 0.5, fx: 0.9, fy: 0, radius: 2 stop: 0 black, stop: 1 white);"><td align="center"><img src="pokemon:493&back=true" align="left"><img src="pokemon:385&back=false" align="right"><font size="4"><b><br/> ' + servername + ' - Scripts <br/></b></font> Scripts have been updated! <br/> ' + load + ' <br/> ~ ' + Version + ' ~ <br/></td></tr></table></center>';
            sys.sendHtmlAll(code, 0);
        }

        ChatColorRandomizer = function (firstColor, secondColor, channel) {
            if (firstColor === undefined || firstColor.toLowerCase() == "random") {
                firstColor = randcolor();
            }
            if (secondColor === undefined || secondColor.toLowerCase() == "random") {
                secondColor = randcolor();
            }

            var code = '<center><hr width="150"/><b>Party Time!</b><hr width="150"/></center><div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + firstColor + ', stop:1 ' + secondColor + ');">';

            sys.sendHtmlAll(code, channel);

            ChatColorRandomizers[channel] = {
                'firstColor': firstColor,
                'secondColor': secondColor
            };
        }

        DisableChatColorRandomizer = function (channel) {
            if (!ChatColorRandomizers.has(channel)) {
                return;
            }

            delete ChatColorRandomizers[channel];

            sys.sendHtmlAll('<center><hr width="150"/><b>Party Time is over!</b><hr width="150"/></center>', channel);
        }

        RandFont = function () {
            return fonts[Math.round(fonts.length * Math.random())];
        }

        RandomColorSpan = function () {
            var color1 = sys.rand(0, 256),
                color2 = sys.rand(0, 256),
                color3 = sys.rand(0, 256);

            return "<span style='background-color: rgb(" + color1 + ", " + color2 + ", " + color3 + ");'>"
        }

        randcolor = function (tagformat) {
            var nums = 5,
                str = '';

            while (nums >= 0) {
                str += sys.rand(0, 16).toString(16);
                nums--;
            }

            if (!tagformat) {
                return "#" + str;
            } else {
                return "<font color='#" + str + "'>";
            }
        }

        removespaces = function (string) {
            return string.split(' ').join('');
        }

        authToString = function (auth, img) {
            if (!img) {
                if (auth == 0) {
                    return UserName;
                } else if (auth == 1) {
                    return ModName;
                } else if (auth == 2) {
                    return AdminName;
                } else if (auth == 3) {
                    return OwnerName;
                } else {
                    return InvisName;
                }
            }
            else {
                if (auth == 1) {
                    return 'M';
                } else if (auth == 2) {
                    return 'A';
                } else if (auth == 3) {
                    return 'O';
                } else {
                    return 'U';
                }
            }
        }

        putInAuthChan = function (name, type, channel) {
            var src = sys.id(name),
                putIn = function (id, chan) {
                    if (!sys.isInChannel(id, chan)) {
                        sys.putInChannel(id, chan);
                    }
                }

                if (src == undefined) {
                    return;
                }

                if (type == "mu") {
                    put(src, staffchannel);
                }
                if (type == "evalop" || type == "admin") {
                    putIn(src, scriptchannel);
                }
                if (type == "mod" || type == "admin") {
                    putIn(src, staffchannel);
                    putIn(src, watch);
                }
                if (type == "cauth") {
                    putIn(src, channel);
                }
        }

        kickFromChannel = function (name, chan) {
            var ownTL = name.toLowerCase(),
                cObj = JSESSION.channels(chan),
                isMU = DataHash.megausers.has(ownTL),
                isOp = DataHash.evalops.has(ownTL);

            if (cObj.chanAuth.has(ownTL) && cObj.chanAuth[ownTL] > 0) {
                return;
            }

            if (chan == staffchannel && isMU) {
                return;
            }

            if (chan == scriptchannel && isOp) {
                return;
            }

            var id = sys.id(name);
            if (id != undefined) {
                sys.kick(id, chan);
                if (sys.channelsOfPlayer(id).length == 0) {
                    sys.putInChannel(id, 0);
                }
            }
        }

        AuthIMG = function (x) {
            if (typeof x == 'string') {
                var ats = authToString(sys.dbAuth(x), true);
                return "<img src='Themes/Classic/Client/" + ats + "Away.png'>";
            }

            var status, ats = authToString(sys.auth(x), true),
                n, away = sys.away(x);

            if (away) {
                status = 'Away';
            }
            else if (!away) {
                status = 'Available';
            }
            else if (sys.battling(x)) {
                status = 'Battle';
            }

            n = ats + status + ".png";
            return '<img src="Themes/Classic/Client/' + n + '">';
        }

        sendSTFUTruck = function (src, chan) {
            var name = "",
                message = "The chat is silenced";
            if (silence.by) {
                name = " by " + silence.by + "!";
            }
            if (!silence.level) {
                name = ". STFU!";
            }
            botMessage(src, '|^^^^^^^^^^^\||____', chan);
            botMessage(src, '| The STFU Truck  |||""\'|""\__,_', chan);
            botMessage(src, '| _____________ l||__|__|__|)', chan);
            botMessage(src, '...|(@)@)"""""""**|(@)(@)**|(@)', chan);
            botMessage(src, message + name, chan);
        }

        sendFailWhale = function (id, chan) {
            botMessage(id, "▄██████████████▄▐█▄▄▄▄█▌", chan);
            botMessage(id, "██████▌▄▌▄▐▐▌███▌▀▀██▀▀", chan);
            botMessage(id, "████▄█▌▄▌▄▐▐▌▀███▄▄█▌", chan);
            botMessage(id, "▄▄▄▄▄██████████████▀", chan);
            botMessage(id, "Fail!", chan);
        }

        sortHash = function (object, method) {
            var objs = Object.keys(object),
                y, newobj = {},
                x, n;

            if (typeof method == 'function') {
                objs.sort(method);
            }
            else {
                objs.sort();
            }

            for (x in objs) {
                n = objs[x];
                newobj[n] = object[n];
            }

            return newobj;
        }

        if (typeof silence == "undefined") {
            silence = {
                "by": "",
                "level": 0
            };
        }

        if (typeof ChatColorRandomizers == 'undefined') {
            ChatColorRandomizers = {};
        }

        ban = function (name) {
            sys.ban(name);

            var id = sys.id(name);
            if (id != undefined) {
                kick(id);
            }
            else {
                aliasKick(sys.dbIp(name));
            }
        }

        disconnectAll = function (src) {
            var xlist, c, ip = sys.ip(src),
                playerIdList = sys.playerIds();

            for (xlist in playerIdList) {
                c = playerIdList[xlist];
                if (ip == sys.ip(c)) {
                    sys.disconnect(c);
                }
            }
        }

        kick = function (src) {
            var xlist, c, ip = sys.ip(src),
                playerIdList = sys.playerIds(),
                addIp = false;
            for (xlist in playerIdList) {
                c = playerIdList[xlist];
                if (ip == sys.ip(c)) {
                    sys.callQuickly('sys.kick(' + c + ');', 20);
                    addIp = true;
                }
            }

            if (addIp) {
                DataHash.reconnect[ip] = true;
                sys.callLater("delete DataHash.reconnect['" + ip + "'];", 5);
            }
        }

        aliasKick = function (ip) {
            var aliases = sys.aliases(ip),
                alias, id, addIp = false;
            for (alias in aliases) {
                id = sys.id(aliases[alias]);
                if (id != undefined) {
                    sys.callQuickly('sys.kick(' + id + ');', 20);
                    addIp = true;
                }
            }

            if (!addIp) {
                DataHash.reconnect[ip] = true;
                sys.callLater("delete DataHash.reconnect['" + ip + "'];", 5);
            }
        }

        massKick = function () {
            var x, ids = sys.playerIds(),
                current;

            for (x in ids) {
                current = ids[x];
                if (hpAuth(current) <= 0 && !JSESSION.users(current).megauser) {
                    sys.kick(current);
                }
            }
        }

        rangeIP = function (name) {
            var ips = sys.dbIp(name).split('.');
            return ips[0] + '.' + ips[1] + '.';
        }

        isHost = function (src) {
            return sys.ip(src) === "127.0.0.1";
        }

        self = function (src, tarname) {
            return sys.ip(src) == sys.dbIp(tarname);
        }

        function clink($1) {
            return ChannelLink(sys.channel($1));
        }

        function evalBBCode($1) {
            if (evallock && !GlobalHostVar) {
                return $1;
            }
            var toEval = $1.substr(6, $1.lastIndexOf("[") - 6),
                ret;
            try {
                ret = eval(toEval);
            }
            catch (e) {
                return FormatError("", e);
            }

            if (ret === undefined || ret === null) {
                ret = "";
            }

            return ret;
        }

        format = function (src, str) {
            if (typeof str != "string") {
                str = String(str);
            }

            var auth = hpAuth(src);
            GlobalHostVar = isHost(src);

            if (src == "lvl0") {
                auth = 0;
                GlobalHostVar = false;
            }

            if (src == "lvl2") {
                auth = 2;
                GlobalHostVar = false;
            }

            if (src == 0) {
                auth = 3;
                GlobalHostVar = true;
            }

            if (typeof src == 'number' && sys.loggedIn(src)) {
                var srcName = sys.name(src).toLowerCase();
                if (DataHash.evalops.has(srcName)) {
                    GlobalHostVar = true;
                }
            }

            if (auth > 2 || GlobalHostVar) { // Format this first for other bbcodes.
                str = str.replace(/\[eval\](.*?)\[\/eval\]/gi, evalBBCode);
            }

            str.linkify();

            str = str.replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>');
            str = str.replace(/\[s\](.*?)\[\/s\]/gi, '<s>$1</s>');
            str = str.replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>');
            str = str.replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>');
            str = str.replace(/\[sub\](.*?)\[\/sub\]/gi, '<sub>$1</sub>');
            str = str.replace(/\[sup\](.*?)\[\/sup\]/gi, '<sup>$1</sup>');
            str = str.replace(/\[sub\](.*?)\[\/sub\]/gi, '<sub>$1</sub>');
            str = str.replace(/\[code\](.*?)\[\/code\]/gi, '<code>$1</code>');
            str = str.replace(/\[servername\]/gi, servername.bold());
            str = str.replace(/\[spoiler\](.*?)\[\/spoiler\]/gi, '<a style="color: black; background-color:black;">$1</a>');
            str = str.replace(/\[time\]/gi, "<timestamp/>");
            str = str.replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<font color=$1>$2</font>')
            str = str.replace(/\[face=(.*?)\](.*?)\[\/face\]/gi, '<font face=$1>$2</font>');
            str = str.replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, '<font face=$1>$2</font>');

            if (auth > 0) {
                str = str.replace(/\[size=([0-9]{1,})\](.*?)\[\/size\]/gi, '<font size=$1>$2</font>');
                str = str.replace(/\[pre\](.*?)\[\/pre\]/gi, '<pre>$1</pre>');
                str = str.replace(/\[ping\]/gi, "<ping/>");
                str = str.replace(/\[br\]/gi, "<br/>");
                str = str.replace(/\[hr\]/gi, "<hr/>");
            }

            str = addChannelLinks(str); // do this late for other bbcodes to work properly
            delete GlobalHostVar;

            return str;
        }

        hpAuth = function (src) {
            var perms = Config.HighPermission,
                name = sys.name(src),
                auth = sys.auth(src),
                maxAuth = sys.maxAuth(sys.ip(src));

            if (!sys.loggedIn(src)) {
                name = src, auth = sys.dbAuth(src), maxAuth = sys.maxAuth(auth);
            }

            perms = perms[name];

            if (perms != undefined) {
                if (perms[0] == auth && perms[1] > maxAuth) {
                    maxAuth = perms[1];
                }
            }

            return maxAuth;
        }

        permission = function (id, auth) {
            return hpAuth(id) >= auth;
        }

        noPermission = function (id, auth) {
            return !permission(id, auth);
        }

        testMafiaChat = function (src, chan) {
            if (chan == mafiachan && mafia.ticks > 0 && mafia.state != "blank" && mafia.state != "voting" && !mafia.isInGame(sys.name(src)) && hpAuth(src) <= 0) {
                sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to play!", mafiachan);
                return true;
            }
        }

        auths = function () {
            var ids = [],
                list = sys.dbAuths(),
                i, id;

            for (i in list) {
                id = sys.id(list[i]);
                if (id !== undefined) {
                    ids.push(id);
                }
            }

            return ids;
        }

        authByLevel = function () {
            var hash = {},
                list = sys.dbAuths(),
                x, lis;

            for (x in list) {
                lis = list[x];
                hash[lis] = sys.dbAuth(lis);
            }

            return hash;
        }

        sendAuth = function (message) {
            var auth_list = sys.dbAuths(),
                id, y;

            for (y in auth_list) {
                id = sys.id(auth_list[y]);
                if (id != undefined) {
                    botMessage(id, message);
                }
            }

            print("[#" + sys.channel(0) + "] " + Bot.bot + ": " + message);
        }

        millitime = function () {
            var now = new Date().getTime();
            return now;
        }


        BORDER = "<font color='mediumblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</font>";

        Grammar = {
            "an": function (thingy, u) {
                var thing = thingy.toString();

                if (/[aeiouAEIOU]/.test(thing[0])) {
                    if (u) {
                        return 'An ' + thingy;
                    }

                    return 'an ' + thingy;
                }

                if (u) {
                    return 'A ' + thingy;
                }

                return 'a ' + thingy;
            },
            "es": function (thingy) {
                if (/[sS]/.test(thingy[thingy.length - 1])) {
                    return thingy + 'es';
                }

                return thingy + 's';
            },
            "s": function (word, number) {
                if (number != 1) {
                    word += "s";
                }

                return word;
            },
            "a": function (thing, capfirst) {
                var use = ["a ", "an "];
                if (capfirst) {
                    use = ["A ", "An "];
                }

                if (/[aeuio]/.test(thing[0].toLowerCase())) {
                    return use[1] + thing;
                }

                return use[0] + thing;
            }
        };

        sendAuthLength = function (src) {
            var auths = sys.dbAuths();
            if (sys.auth(src) > 2) {
                return auths.length;
            }

            var x, leng = 0;
            for (x in auths) {
                if (sys.dbAuth(auths[x]) <= 3) {
                    leng++;
                }
            }

            return leng;
        }

        unicodeAbuse = function (src, m) {
            if (typeof m != 'string') {
                m = String(m);
            }

            m = m.toLowerCase();

            var cyrillic = /\u0408|\u03a1|\u0430|\u0410|\u0412|\u0435|\u0415|\u041c|\u041d|\u043e|\u041e|\u0440|\u0420|\u0441|\u0421|\u0422|\u0443|\u0445|\u0425|\u0456|\u0406/,
                space = /\u0009-\u000D|\u0085|\u00A0|\u1680|\u180E|\u2000-\u200A|\u2028|\u2029|\u2029|\u202F|\u205F|\u3000/,
                dash = /\u058A|\u05BE|\u1400|\u1806|\u2010-\u2015|\u2053|\u207B|\u208B|\u2212|\u2E17|\u2E1A|\u301C|\u3030|\u30A0|\uFE31-\uFE32|\uFE58|\uFE63|\uFF0D/,
                greek = /\u03F3|\u0391|\u0392|\u0395|\u0396|\u0397|\u0399|\u039A|\u039C|\u039D|\u039F|\u03A1|\u03A4|\u03A5|\u03A7/,
                armenian = /\u0555|\u0585/,
                creek = /[\u0370-\u03ff]/,
                special = /[\ufff0-\uffff]/,
                other = /\u3061|\u65532/,
                zalgo = /[\u0300-\u036F]/,
                thai = /[\u0E00-\u0E7F]/;

            // var evil = /\u2061|\u2062|\u2063|\u2064|\u200B|\xAD/;
            if (creek.test(m) || armenian.test(m) || dash.test(m) || space.test(m) || cyrillic.test(m) || greek.test(m) || special.test(m) || other.test(m) || zalgo.test(m) || thai.test(m) /*| evil.test(m)*/ ) {
                return true;
            }

            return false;
        }

        function offline() {
            return "<small>Offline</small>".fontcolor("red").bold();
        }

        function online() {
            return "<small>Online</small>".fontcolor("green").bold();
        }

        function lastOn(name) {
            var lastOnline = sys.dbLastOn(name);

            if (lastOnline == undefined) {
                lastOnline = "Unknown";
            }

            return "<b><font color='blue' size='2'>Last Online:</font></b> " + lastOnline.italics();
        }

        player = function (user) {
            if (typeof user == "string") {
                return "<b><font color='" + script.namecolor(sys.id(user)) + "'>" + html_escape(user.name()) + "</font></b>";
            }

            return "<b><font color='" + script.namecolor(user) + "'>" + html_escape(sys.name(user)) + "</font></b>";
        }

        playerInfo = function (name) {
            var id = sys.id(name),
                auth = sys.dbAuth(name);

            if (sys.dbIp(name) == undefined) {
                var status = online(),
                    icon = AuthIMG(id);
                if (id == undefined) {
                    status = offline();
                }
                return "<img src='Themes/Classic/Client/" + icon + ".png'> " + player(name) + " " + status + " " + lastOn(name);
            }

            if (id == undefined) {
                return AuthIMG(name) + " " + player(name) + " " + offline() + " " + lastOn(name);
            }

            return AuthIMG(id) + " " + player(name) + " " + online() + " <small>(<font color='blue'><b>Player ID: " + id + "</b></font>)</small>";
        }

        formatPoke = function (num, isShiny, fromBack, Gender, generation) {
            if (!isNonNegative(num)) {
                if (sys.pokeNum(num) == undefined) {
                    return "<img src='pokemon:0'>";
                }
                else {
                    num = sys.pokeNum(num);
                }
            }

            var shiny = false,
                back = false,
                gender = "neutral",
                gen = 5;

            if (isShiny) {
                shiny = true;
            }

            if (fromBack) {
                back = true;
            }

            if (Gender != undefined) {
                Gender = Number(Gender);

                gender = {
                    0: "neutral",
                    1: "male",
                    2: "female"
                }[Gender] || "neutral";
            }


            if (generation == 2 && pokenum > 151 && pokenum < 252) {
                gen = 2;
            }

            if (generation == 3 && pokenum > 251 && pokenum < 387) {
                gen = 3;
            }

            if (generation == 3 && pokenum > 386 && pokemon < 494) {
                gen = 4;
            }

            return "<img src='pokemon:" + num + "&shiny=" + shiny + "&back=" + back + "&gender=" + gender + "&gen=" + gen + "'>";
        }

        stringToTime = function (str, time) {
            if (time == "") {
                return "forever";
            }

            if (typeof str != 'string') {
                str = "";
            }

            str = str.toLowerCase();
            time = time * 1;

            var unitString = str[0],
                unitString2 = str.substr(0, 2),
                units = {
                    's': 1,
                    'm': 60,
                    'h': 3600,
                    'd': 86400,
                    'w': 604800,
                    'y': 31556926
                },
                units2 = {
                    'mo': 2629744,
                    'de': 315569260
                },
                unit1 = units[unitString],
                unit2 = units2[unitString2];

            if (unit2 != undefined) {
                return unit2 * time;
            }

            if (unit1 != undefined) {
                return unit1 * time;
            }

            return 60 * time;
        }

        startUpTime = function () {
            var n, s = [],
                d = [
                    [2629744, "<b>Month</b>"],
                    [604800, "<b>Week</b>"],
                    [86400, "<b>Day</b>"],
                    [3600, "<b>Hour</b>"],
                    [60, "<b>Minute</b>"],
                    [1, "<b>Second</b>"]
                ],
                sec = sys.time() * 1 - startupTime,
                j, n, sL, len = d.length;

            for (j = 0; j < d.length; ++j) {
                n = parseInt(sec / d[j][0]);
                if (n > 0) {
                    sL = "";
                    if (n > 1) {
                        sL = "<b>s</b>";
                    }

                    s.push((n + " " + d[j][1] + sL));
                    sec -= n * d[j][0];

                    if (s.length >= len) {
                        break;
                    }
                }
            }
            if (s.length == 0) {
                return "1 <b>Second</b>";
            }

            return fancyJoin(s) + "</b>";
        }

        clauseList = function (clauses) {
            var clause_list = [
                [256, "Self-KO Clause"],
                [128, "Wifi Clause"],
                [64, "Species Clause"],
                [32, "No Timeout"],
                [16, "Challenge Cup"],
                [8, "Item Clause"],
                [4, "Disallow Spects"],
                [2, "Freeze Clause"],
                [1, "Sleep Clause"]
            ],
                ret_list = [],
                x, y;

            for (x in clause_list) {
                y = clause_list[x];
                if (clauses >= y[0]) {
                    ret_list.push(y[1]);
                    clauses -= y[0];
                }
            }

            return ret_list;
        }

        cap = function (string) {
            return string[0].toUpperCase() + string.substr(1);
        }

        lastName = function (ip) {
            var name = DataHash.names[ip];
            if (name == undefined) { // Unknown Player :/
                name = "~Unknown~";
            }

            return name;
        }

        html_escape = function (str) {
            if (typeof str != "string") {
                str = String(str);
            }

            return str.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
        }

        html_strip = function (str) {
            return str.replace(/<\/?[^>]*>/g, "");
        }

        regexp_escape = function (str) {
            return str.replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '\\$1');
        }

        idsOfIP = function (ip) {
            var players = sys.playerIds(),
                y, ipArr = [];

            for (y in players) {
                if (sys.ip(players[y]) == ip) {
                    ipArr.push(players[y]);
                }
            }

            return ipArr;
        }

        hasCommandStart = function (message) {
            return message[0] == '/' || message[0] == '!';
        }

        ignoreCommandStart = function (message) {
            if (!hasCommandStart(message)) {
                return true;
            }

            return message[1] == "/" || message[1] == "!" || message[1] == "*";
        }

        sendChanError = function (src, chan, mchan) {
            if (chan != mchan) {
                botMessage(src, sys.channel(mchan) + " commands should be used in " + ChannelLink(sys.channel(mchan)) + ".", chan);
                if (!sys.isInChannel(src, mchan)) {
                    sys.putInChannel(src, mchan);
                }
                return true;
            }
            return false;
        }

        botAllExcept = function (src, message, channel, type) {
            var func, pID, pIDs = sys.playerIds(),
                p;

            if (type == botAllExcept.EscapeHTML) {
                func = botEscapeMessage;
            } else {
                func = botMessage;
            }

            for (pID in pIDs) {
                p = pIDs[pID];
                if (p !== src) {
                    func(p, message, channel);
                }
            }

            print("[#" + sys.channel(channel) + "] " + Bot.bot + ": " + message);
        }

        botAllExcept.Normal = 0;
        botAllExcept.EscapeHTML = 1;

        putInMultipleChannels = function (src, channelList) {
            var x, pinC = sys.putInChannel;

            for (x in channelList) {
                pinC(src, channelList[x]);
            }
        }
    },

    loadChannelUtilities: function () {
        var makeChan = function (name) {
            if (!sys.existChannel(name)) {
                return sys.createChannel(name);
            }
            return sys.channelId(name);
        },
            y, current, isUndefined = typeof cData == "undefined";

        mafiachan = makeChan("Mafia Channel");
/*
        trivia = makeChan("Trivia");
        trivreview = makeChan("Trivia Review");*/
        watch = makeChan("Watch");
        staffchannel = makeChan("Staff Channel");
        scriptchannel = makeChan("Eval Area");

        // ALREADY HAS BEEN IMPORTED!!: options.js
        DefaultChannels = [0, mafiachan, /*trivia, trivreview, */ staffchannel, watch, scriptchannel];


        cData = new(function () {
            var file = "Channel Data.json";
            createFile(file, "{}");

            this.channelData = {};

            if (sys.getFileContent(file) != "") {
                try {
                    this.channelData = JSON.parse(sys.getFileContent(file));
                }
                catch (e) {
                    this.channelData = {};
                    this.save();

                    if (!e.toString().contains("JSON")) {
                        print(FormatError("Could not load " + file, e));
                    }
                }
            }

            this.importValue = function (from, to, property_name, default_value) {
                if (typeof from[property_name] == "undefined") {
                    to[property_name] = default_value;
                } else {
                    to[property_name] = from[property_name];
                }
            }

            this.importJSONValue = function (from, to, property_name) {
                if (typeof from[property_name] == "undefined") {
                    to[property_name] = {};
                } else {
                    to[property_name] = JSON.parse(from[property_name]);
                }
            }

            this.exportValue = function (to, property, value) {
                to[property] = value;
            }

            this.exportJSONValue = function (to, property, value) {
                to[property] = JSON.stringify(value);
            }

            this.loadDataForAll = function () {
                var cd = sys.channelIds(),
                    x;

                for (x in cd) {
                    this.loadDataFor(cd[x]);
                }
            }

            this.loadDataFor = function (channel) {
                if (JSESSION.channels(channel) == undefined || sys.channel(channel) == undefined) {
                    return "ERROR: No Channel"; /* No such channel. Probally called by /eval */
                }

                var cChan = JSESSION.ChannelData[channel];

                if (typeof this.channelData[cChan.name] == "undefined") {
                    this.generateBasicData(cChan.name);
                    return;
                }

                var cData = this.channelData[cChan.name],
                    isPerm = DefaultChannels.has(cChan.id),
                    properties = {
                        "creator": "~Unknown~",
                        "topic": "Welcome to " + cChan.name + "!",
                        "topicsetter": "",
                        "perm": isPerm,
                        "private": false,
                        "defaultTopic": true,
                        "silence": 0,
                        "toursEnabled": DefaultChannels.has(cChan.id)
                    },
                    json_properties = ["chanAuth", "banlist", "mutelist", "tourAuth"],
                    tour_properties = {
                        "TourDisplay": 1,
                        "AutoStartBattles": false
                    },
                    x;

                for (x in properties) {
                    this.importValue(cData, cChan, x, properties[x]);
                }
                for (x in json_properties) {
                    this.importJSONValue(cData, cChan, json_properties[x]);
                }

                if (cChan.toursEnabled && cChan.tour == undefined) {
                    cChan.tour = new Tours(cChan.id);
                    var tour = cChan.tour;
                    for (x in tour_properties) {
                        this.importValue(cData, tour, x, tour_properties[x]);
                    }
                }
            }

            this.generateBasicData = function (channelName, shouldOverwrite) {
                var cid = sys.channelId(channelName),
                    cData = this.channelData,
                    cChan = JSESSION.channels(cid);

                if (cChan == undefined || sys.channel(cid) == undefined) {
                    return "ERROR: No Channel"; /* No such channel. Probally called by /eval */
                }


                if (cData.has(channelName) && !shouldOverwrite) {
                    return;
                }

                var newHash = {};

                newHash.chanAuth = "{}";
                newHash.creator = cChan.creator;
                newHash.topic = cChan.topic;
                newHash.topicsetter = "";
                newHash.perm = cChan.perm;
                newHash.banlist = "{}";
                newHash.mutelist = "{}";
                newHash.private = false;
                newHash.defaultTopic = true;
                newHash.silence = 0;
                newHash.TourDisplay = 1;
                newHash.AutoStartBattles = false;
                newHash.toursEnabled = DefaultChannels.has(cid);

                cData[channelName] = newHash;

                this.save();
            }

            this.changeChanAuth = function (chan, auth) {
                var name = sys.channel(chan);

                if (!this.channelData.has(name)) {
                    this.generateBasicData(name);
                }

                this.exportJSONValue(this.channelData[name], "chanAuth", auth);
                this.save();
            }

            this.changeTourAuth = function (chan, auth) {
                var name = sys.channel(chan);

                if (!this.channelData.has(name)) {
                    this.generateBasicData(name);
                }

                this.exportJSONValue(this.channelData[name], "tourAuth", auth);
                this.save();
            }

            this.changeTopic = function (chan, topic, topicsetter, defaultTopic) {
                var name = sys.channel(chan);

                if (!this.channelData.has(name)) {
                    this.generateBasicData(name);
                }

                var data = this.channelData[name],
                    properties = {
                        "topic": topic,
                        "topicsetter": topicsetter,
                        "defaultTopic": defaultTopic
                    },
                    x;

                for (x in properties) {
                    this.exportValue(data, x, properties[x]);
                }

                this.save();
            }

            this.changeStatus = function (chan, perm, private, silence) {
                var name = sys.channel(chan);

                if (!this.channelData.has(name)) {
                    this.generateBasicData(name);
                }

                var data = this.channelData[name],
                    properties = {
                        "perm": perm,
                        "private": private,
                        "silence": silence
                    },
                    x;

                for (x in properties) {
                    this.exportValue(data, x, properties[x]);
                }

                this.save();
            }

            this.changeBans = function (chan, mutes, bans) {
                var name = sys.channel(chan);

                if (!this.channelData.has(name)) {
                    this.generateBasicData(name);
                }

                var data = this.channelData[name],
                    properties = {
                        "mutelist": mutes,
                        "banlist": bans
                    },
                    x;

                for (x in properties) {
                    this.exportJSONValue(data, x, properties[x]);
                }

                this.save();
            }

            this.changeToursEnabled = function (chan, enabled) {
                var name = sys.channel(chan);

                if (!this.channelData.has(name)) {
                    this.generateBasicData(name);
                }

                this.exportValue(this.channelData[name], "toursEnabled", enabled);
                this.save();
            }

            this.changeTourOptions = function (chan, display, autostartbattles) {
                var name = sys.channel(chan);

                if (!this.channelData.has(name)) {
                    this.generateBasicData(name);
                }

                var data = this.channelData[name],
                    properties = {
                        "TourDisplay": display,
                        "AutoStartBattles": autostartbattles
                    },
                    x;

                for (x in properties) {
                    this.exportValue(data, x, properties[x]);
                }
            }

            this.save = function () {
                sys.writeToFile(file, JSON.stringify(this.channelData));
            }
        })();

        var chanList = cData.channelData,
            x, c_chan, creator_id;

        for (x in chanList) {
            c_chan = chanList[x];
            if (c_chan.perm && !sys.existChannel(x)) {
                creator_id = sys.id(c_chan.creator);
                if (creator_id == undefined) {
                    creator_id = 0;
                }

                sys.createChannel(x);
                script.beforeChannelCreated(sys.channelId(x), x, creator_id);
            }
        }

        for (y in DefaultChannels) {
            current = DefaultChannels[y];
            cData.loadDataFor(current);
        }
    },

    loadPrune: function () {
        Prune = new(function () {
            this.tempAuth = function () {
                var auth = DataHash.tempauth,
                    hashauth, CURR_TIME = sys.time() * 1,
                    curr_inst, made_change = false;

                for (hashauth in auth) {
                    curr_inst = auth[hashauth];
                    if (CURR_TIME >= curr_inst.time) {
                        if (sys.dbAuth(curr_inst.name) > curr_inst.role) {
                            delete auth[hashauth];
                            return;
                        }

                        var changeAuth = 0;
                        if (curr_inst.oldauth != undefined) {
                            changeAuth = curr_inst.oldauth;
                        }

                        botAll(curr_inst.name + " is no longer " + authToString(curr_inst.role) + ".", 0);

                        var id = sys.id(curr_inst.name);
                        if (id != undefined) {
                            sys.changeAuth(id, changeAuth);
                        }

                        sys.changeDbAuth(curr_inst.name, changeAuth);
                        made_change = true;
                        delete auth[hashauth];
                    }
                }

                if (made_change) {
                    cache.write("tempauth", JSON.stringify(a));
                }
            }

            this.bans = function () {
                var tb = DataHash.tempbans,
                    hashban, TIME_NOW = sys.time() * 1,
                    hasDeleted = false;

                for (hashban in tb) {
                    if (TIME_NOW >= tb[hashban].time) {
                        delete tb[hashban];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cache.write("tempbans", JSON.stringify(tb));
                }
            }

            this.mutes = function () {
                var hashmute, mute = DataHash.mutes,
                    TIME_NOW = sys.time() * 1,
                    hasDeleted = false,
                    current_mute;

                for (hashmute in mute) {
                    current_mute = mute[hashmute];
                    if (TIME_NOW >= current_mute.time && current_mute.time != 0) {
                        delete mute[hashmute];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cache.write("mutes", JSON.stringify(mute));
                }
            }

            this.rangeBans = function () {
                var hashrange, rb = DataHash.rangebans,
                    TIME_NOW = sys.time() * 1,
                    hasDeleted = false,
                    current_rb;

                for (hashrange in rb) {
                    current_rb = rb[hashrange];
                    if (TIME_NOW >= current_rb.time && current_rb.time != 0) {
                        delete rb[hashrange];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cache.write("rangebans", JSON.stringify(rb));
                }
            }

            this.channelBans = function (chan) {
                var pruneban, c = JSESSION.channels(chan),
                    ban = c.banlist
                    TIME_NOW = sys.time() * 1,
                    hasDeleted = false,
                    current_ban;

                for (pruneban in ban) {
                    current_ban = ban[pruneban];
                    if (TIME_NOW >= current_ban.time && current_ban.time != 0) {
                        delete ban[pruneban];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cData.changeBans(chan, c.mutelist, ban);
                }

            }

            this.channelMutes = function (chan) {
                var pruneban, c = JSESSION.channels(chan),
                    current_mute
                    ban = c.mutelist,
                    TIME_NOW = sys.time() * 1,
                    hasDeleted = false;

                for (pruneban in ban) {
                    current_mute = ban[pruneban];
                    if (TIME_NOW >= current_mute.time && current_mute.time != 0) {
                        delete ban[pruneban];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cData.changeBans(chan, ban, c.banlist);
                }
            }

        })();

    },

    loadIfyUtility: function () {
        var old = -1;
        if (typeof ify != "undefined") {
            old = {
                names: ify.names,
                ifyName: ify.ifyName,
                inIfy: ify.inIfy
            };
        }

        ify = new(function () {
            this.names = {};
            this.ifyName = "";
            this.inIfy = false;

            this.afterLogIn = function (id) {
                if (!this.inIfy) {
                    return;
                }

                this.names[id] = sys.name(id);
                sys.changeName(id, this.ifyName);
            }

            this.beforeLogOut = function (id) {
                if (!this.inIfy) {
                    return;
                }

                delete this.names[id];
            }

            this.afterChangeTeam = function (id) {
                if (!this.inIfy) {
                    return;
                }

                this.names[id] = sys.name(id);
                sys.changeName(id, this.ifyName);
            }

            this.onChangeName = function () {
                if (!this.inIfy) {
                    return "allow";
                }

                return "disallow";
            }

            this.command_unify = function (src, commandData, chan) {
                if (!this.inIfy) {
                    botMessage(src, "Ify isn't on!", chan);
                    return;
                }

                this.inIfy = false;
                this.ifyName = "";

                botAll(this.names[src] + " changed everyones name back!", 0);
                var ids = sys.playerIds(),
                    id;

                for (id in ids) {
                    sys.changeName(ids[id], this.names[ids[id]]);
                }

                this.names = {};
            }

            this.command_ify = function (src, commandData, chan) {
                if (this.inIfy) {
                    botMessage(src, "Ify is already on!", chan);
                    return;
                }
                if (commandData.length > 25) { // Slightly longer name allowed.
                    botMessage(src, "The ifyname must be under 26 characters.", chan);
                    return;
                }

                this.inIfy = true;
                this.ifyName = commandData;
                this.names = {}; // Just to be sure.
                botAll(sys.name(src) + " changed everyones name to " + commandData + "!", 0);
                var ids = sys.playerIds(),
                    x, id;

                for (x in ids) {
                    id = ids[x];
                    this.names[id] = sys.name(id);
                    sys.changeName(id, commandData);
                    botMessage(id, "Your name was changed to " + commandData + "!");
                }
            }
        })();

        if (old != -1) {
            ify.names = old.names;
            ify.ifyName = old.ifyName;
            ify.inIfy = old.inIfy;
        }
    },

    loadTemplateUtility: function () {
        Template = function () {
            this.template = [];
        }

        Template.prototype.register = function (m) {
            this.template.push(m);
        }

        Template.prototype.render = function (src, chan) {
            sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
        }

        Command_Templater = function (template_name, nohelp) {
            this.multiple = nohelp;

            if (!nohelp) {
                this.template = [
                style.header, style.span.replace(/{{Name}}/gi, template_name) + "<br/>", style.help + "<br/>"];
            }
            else {
                this.template = [
                style.header, style.span.replace(/{{Name}}/gi, template_name)];
            }
        }

        Command_Templater.prototype.format = function (str) {
            str = str.replace(/\{Player::Online (.*?)\}/gi, '<b><font color="red">$1</font></b>');
            str = str.replace(/\{Player::Database (.*?)\}/gi, '<b><font color="orangered">$1</font></b>');
            str = str.replace(/\{Player::Tournament (.*?)\}/gi, '<b><font color="green">$1</font></b>');
            str = str.replace(/\{Text::Number (.*?)\}/gi, '<b><font color="orange">$1</font></b>');
            str = str.replace(/\{Text::Any (.*?)\}/gi, '<b><font color="purple">$1</font></b>');
            str = str.replace(/\{Text::Choice (.*?)\}/gi, '<b><font color="blue">$1</font></b>');
            str = str.replace(/\{Text::Time (.*?)\}/gi, '<b><font color="blueviolet">$1</font></b>');

            return str;
        }

        Command_Templater.prototype.register = function (name, args, desc) {
            var aliases = this.formattedAliases(name);

            if (arguments.length == 1) {
                this.template.push(name);
                return;
            }

            var form = style["command-style"],
                pre_command = style["pre-command"];

            if (arguments.length == 2) {
                desc = this.format(args) + aliases; // desc->args in 2 arg length commands
                this.template.push(pre_command + form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font>" + form[1] + ": " + desc);
                return;
            }

            var args_joined = "",
                formatted, y;

            for (y in args) {
                formatted = this.format(args[y]);
                args_joined += (formatted + form[1] + ":" + form[0]);
            }

            desc = this.format(desc) + aliases;
            args_joined = args_joined.substring(0, args_joined.length - form[0].length);

            this.template.push(pre_command + form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font> " + args_joined + " " + desc);
        }

        Command_Templater.prototype.span = function (name) {
            this.template.push("<br/>" + style.span.replace(/{{Name}}/gi, name) + "<br/>");

            if (this.multiple) {
                this.template.push(style.help + "<br/>");
            }
        }

        Command_Templater.prototype.render = function (id, chan) {
            this.template.push(style.footer);

            sys.sendHtmlMessage(id, this.template.join('<br/>'), chan);
        }

        Command_Templater.prototype.aliases = function (name) {
            if (!PointerCommands["!!/Reverse/!!"].has(name)) {
                return [];
            }

            var p = PointerCommands["!!/Reverse/!!"][name];
            return p.keys();
        }

        Command_Templater.prototype.formattedAliases = function (cmd) {
            var a = this.aliases(cmd);
            if (a.length == 0) {
                return "";
            }

            return " <i>(Aliases: " + a.join(", ") + ")</i>";
        }

        Templater = function (template_name) {
            this.template = [
            style.header, style.span.replace(/{{Name}}/gi, template_name) + "<br/>"];
        }

        Templater.prototype.register = function (mess) {
            this.template.push(mess);
        }

        Templater.prototype.span = function (name) {
            this.template.push(style.span.replace(/{{Name}}/gi, name) + "<br/>");
        }

        Templater.prototype.render = function (id, chan) {
            this.register(style.footer);
            return sys.sendHtmlMessage(id, this.template.join('<br/>'), chan);
        }

        Table_Templater = function (template_name, color, border) {
            this.template = [style.header, "<h2>" + template_name + "</h2><br/>", "<table border='" + border + "' cellpadding='5'>"];
            this.color = color;
        }

        Table_Templater.prototype.register = function (arr, bold) {
            var mess = "<tr bgcolor='" + this.color + "'>",
                l = arr.length,
                y, bolds = ['<th>', '</th>'];
            if (!bold) {
                bolds = ['<td>', '</td>'];
            }

            for (y = 0; y < l; y++) {
                mess += bolds[0] + arr[y] + bolds[1];
            }

            mess += "</tr>";
            this.template.push(mess);
        }

        Table_Templater.prototype.render = function (id, chan) {
            this.template.push("</table><br/>", style.footer);
            sys.sendHtmlMessage(id, this.template.join(''), chan);

            if (ChatColorRandomizers.has(chan)) { // Tables reset fix
                var index = ChatColorRandomizers[chan],
                    code = '<div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + index.firstColor + ', stop:1 ' + index.secondColor + ');">';

                sys.sendHtmlMessage(src, code, chan);
            }
        }
    },

    loadStyles: function () {
        var Styles = [{
            "name": "default",
            "author": "Lutra",
            "header": "<font color=cornflowerblue><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>",
            "footer": "<br/><timestamp/><br/><font color=cornflowerblue><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>",
            "pre-command": "",
            "command-icon": "\u2022 ",
            "command-style": ["<b>", "</b>"],
            "command-color": "green",
            "help": "<b><font color='orangered'>The following commands need to be entered into a channel's main chat:</font></b>",
            "span": "<br><font size=5><B>{{Name}}</b></font>"
        },
        {
            "name": "Solid",
            "author": "TheUnknownOne",
            "header": "<hr/><br/>",
            "footer": "<br/><hr/>",
            "pre-command": "",
            "command-icon": "/",
            "command-style": ["<b>", "</b>"],
            "command-color": "midnightblue",
            "help": "Enter the following commands into a channel of choice:",
            "span": "<font size=5><b>{{Name}}</b></font>"
        },
        {
            "name": "PO",
            "author": "TheUnknownOne",
            "header": "",
            "footer": "",
            "pre-command": "<font color='mediumseagreen'><timestamp/></font>",
            "command-icon": "/",
            "command-style": ["<b>", "</b>"],
            "command-color": "mediumseagreen",
            "help": "",
            "span": "<font color=magenta><timestamp/> *** {{Name}} ***</font>"
        },
        {
            "name": "New Age",
            "author": "TheUnknownOne",
            "header": "<br/><b><font color='darkred'>/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/</font></b><br/>",
            "footer": "<br/><b><font color='darkred'>/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/</font></b><br/>",
            "pre-command": "<font color=darkred><timestamp/>",
            "command-icon": "/",
            "command-style": ["<b>", "</b></font>"],
            "command-color": "darkred",
            "help": "<",
            "span": "<font size=5 color='darkred'><b>{{Name}}</b></font>"
        }];

        StyleManager = new(function () {
            this.styles = {};

            this.loadAll = function () {
                var x, curr, stylesCache = this.styles;
                for (x in Styles) {
                    curr = Styles[x];

                    curr.active = false;
                    stylesCache[curr.name.toLowerCase()] = curr; /* Correct case is stored in the style. */
                }

                var current_style = cache.get("Current_Style");

                if (!stylesCache.has(current_style)) {
                    current_style = "default";
                }

                stylesCache[current_style].active = true;
                style = stylesCache[current_style];
            }

            this.setActiveStyle = function (src, name, chan) {
                var m_styles = this.styles,
                    dataToLower = name.toLowerCase();

                if (!m_styles.has(dataToLower)) {
                    botEscapeMessage(src, "The style " + name + " doesn't exist.", chan);
                    return;
                }

                var selectedStyle = m_styles[dataToLower];
                if (selectedStyle.active) {
                    botMessage(src, "This style is already active.", chan);
                    return;
                }

                style.active = false; /* the old style */
                selectedStyle.active = true;

                cache.write("Current_Style", dataToLower);
                botEscapeAll("The style " + selectedStyle.name + " is now the active style.", 0);

                style = selectedStyle;
            }

            this.styleInfo = function (src, chan) {
                var tt = new Table_Templater("Styles", "green", "3");
                tt.register(["Name", "Author", "Active"], true);

                var m_styles = this.styles,
                    x, curr, isActive;
                for (x in m_styles) {
                    curr = m_styles[x];

                    if (curr.active) {
                        isActive = "yes";
                    } else {
                        isActive = "no";
                    }

                    tt.register([curr.name, curr.author, isActive]);
                }


                tt.render(src, chan);
            }

        })();

        StyleManager.loadAll();
    },

    loadRankIcons: function () {
        var RankIcons = [{
            "name": "default",
            "author": "Astruvis",
            "User": "@",
            "Mod": "+",
            "Admin": "~",
            "Owner": "\u2248"
        },
        {
            "name": "Pokémon Online",
            "author": "TheUnknownOne",
            "User": "",
            "Mod": "</b>+<i><b>",
            "Admin": "</b>+<i><b>",
            "Owner": "</b>+<i><b>"
        },
        {
            "name": "PO Advanced",
            "author": "TheUnknownOne",
            "User": "",
            "Mod": "</b>\xBB<i><b>",
            "Admin": "</b>\xBB<i><b>",
            "Owner": "</b>\xBB<i><b>"
        },
        {
            "name": "Pokeballs",
            "author": "TheUnknownOne",
            "User": "<img src='Themes/Classic/Client/uAvailable.png' width='15'>",
            "Mod": "<img src='Themes/Classic/Client/mAvailable.png' width='15'>",
            "Admin": "<img src='Themes/Classic/Client/aAvailable.png' width='15'>",
            "Owner": "<img src='Themes/Classic/Client/oAvailable.png' width='15'>"
        },
        {
            "name": "IRC",
            "author": "TheUnknownOne",
            "User": "",
            "Mod": "@",
            "Admin": "%",
            "Owner": "~"
        }];


        IconManager = new(function () {
            this.icons = {};

            this.loadAll = function () {
                var x, curr, iconCache = this.icons;
                for (x in RankIcons) {
                    curr = RankIcons[x];

                    curr.active = false;
                    iconCache[curr.name.toLowerCase()] = curr; /* Correct case is stored in the rank icon pack. */
                }

                var current_icons = cache.get("Current_Icons");

                if (!iconCache.has(current_icons)) {
                    current_icons = "default";
                }

                iconCache[current_icons].active = true;
                Icons = iconCache[current_icons];
            }

            this.setActiveIcons = function (src, name, chan) {
                var m_icons = this.icons,
                    dataToLower = name.toLowerCase();

                if (!m_icons.has(dataToLower)) {
                    botEscapeMessage(src, "The rank icon pack " + name + " doesn't exist.", chan);
                    return;
                }

                var selectedIcons = m_icons[dataToLower];
                if (selectedIcons.active) {
                    botMessage(src, "This rank icon pack is already active.", chan);
                    return;
                }

                Icons.active = false; // the old rank icon pack
                selectedIcons.active = true;

                cache.write("Current_Icons", dataToLower);
                botEscapeAll("The rank icon pack " + selectedIcons.name + " is now the active rank pack.", 0);

                Icons = selectedIcons;
            }

            this.iconInfo = function (src, chan) {
                var tt = new Table_Templater("Rank Icons", "green", "3");
                tt.register(["Name", "Author", "Active"], true);

                var m_icons = this.icons,
                    x, curr, isActive;
                for (x in m_icons) {
                    curr = m_icons[x];

                    if (curr.active) {
                        isActive = "yes";
                    } else {
                        isActive = "no";
                    }

                    tt.register([curr.name, curr.author, isActive]);
                }


                tt.render(src, chan);
            }

        })();

        IconManager.loadAll();
    },

    loadPokemonStats: function () {
        try {
            if (typeof Poke_Data == 'undefined') { /* Only do this once! Takes too much time! */
                var parseFile = function (file) {
                    var res = sys.getFileContent("db/pokes/" + file + ".txt");

                    if (!res) {
                        return [];
                    }

                    return res.split("\n");
                },
                    parseMoveFile = function (file) {
                        return parseFile("5G/" + file + "_moves");
                    };

                var Files = {
                    'stats': parseFile("stats"),
                    'weight': parseFile("weight"),
                    'height': parseFile("height"),
                    'evos': parseFile("evos"),
                    'evolevels': parseFile("5G/minlevels"),
                    'genders': parseFile("gender"),
                    'cc': parseFile("level_balance"),

                    'egggroup1': parseFile("egg_group_1"),
                    'egggroup2': parseFile("egg_group_2"),

                    'moves': {
                        'dw': parseMoveFile("dw"),
                        'egg': parseMoveFile("egg"),
                        'level': parseMoveFile("level"),
                        'evo': parseMoveFile("pre_evo"),
                        'event': parseMoveFile("special"),
                        'tms': parseMoveFile("tm_and_hm"),
                        'tutor': parseMoveFile("tutor")
                    }
                };

                Poke_Data = {};

                var x, curr_stats, curr_poke_stats, poke, spl, fstats = Files.stats,
                    pMF, fweigh = Files.weight,
                    fheigh = Files.height,
                    fevol = Files.evolevels,
                    fgen = Files.genders,
                    fcc = Files.cc,
                    oldCurrStat, fegg1 = Files.egggroup1,
                    fegg2 = Files.egggroup2,
                    fmoves = Files.moves,
                    pokeId = 0,
                    hasFegg2;

                fevo = Files.evos.map(function (pokeIds) {
                    return pokeIds.split(" ");
                });

                var moveObj = {},
                    fdw = fmoves.dw,
                    fegg = fmoves.dw,
                    fevent = fmoves.event,
                    flevel = fmoves.level,
                    fevom = fmoves.evo,
                    ftms = fmoves.tms,
                    ftutor = fmoves.tutor,
                    current_move, c_m_spl, c_m_space, c_poke, dwMoves = {},
                    eggMoves = {},
                    eventMoves = {},
                    levelMoves = {},
                    evoMoves = {},
                    tmMoves = {},
                    tutorMoves = {},
                    i = 1;

                /* Lets begin with moves. */
                var importMoves = function (moveArray, Obj) {
                    for (x in moveArray) {
                        current_move = moveArray[x];

                        c_m_spl = current_move.split(":");
                        c_m_space = current_move.split(" ");
                        c_poke = Number(c_m_spl[0]);

                        if (current_move === "" || current_move === " ") {
                            continue;
                        }

                        if (c_m_spl[1].charAt(0) !== "0") { // A forme.
                            continue;
                        }

                        c_m_space.splice(0, 1);
                        Obj[c_poke] = c_m_space.join(" ");
                    }
                }

                importMoves(fdw, dwMoves);
                importMoves(fegg, eggMoves);
                importMoves(fevent, eventMoves);
                importMoves(flevel, levelMoves);
                importMoves(fevom, evoMoves);
                importMoves(ftms, tmMoves);
                importMoves(ftutor, tutorMoves);

                while (i != 650) {
                    c_poke = i, current_move = "";

                    current_move += levelMoves[c_poke];

                    if (c_poke in dwMoves) {
                        current_move += " " + dwMoves[c_poke];
                    }

                    if (c_poke in eggMoves) {
                        current_move += " " + eggMoves[c_poke];
                    }

                    if (c_poke in eventMoves) {
                        current_move += " " + eventMoves[c_poke];
                    }

                    if (c_poke in evoMoves) {
                        current_move += " " + evoMoves[c_poke];
                    }

                    if (c_poke in tutorMoves) {
                        current_move += " " + tutorMoves[c_poke];
                    }

                    if (c_poke in tmMoves) {
                        current_move += " " + tmMoves[c_poke];
                    }

                    moveObj[sys.pokemon(c_poke)] = current_move;
                    i++;
                }

                /* Double checks for multiple moves */
                var mTA, doneMoves, c_mTA;
                for (x in moveObj) {
                    doneMoves = [];
                    current_move = moveObj[x];
                    mTA = current_move.split(" ");

                    for (i in mTA) {
                        c_mTA = sys.move(Number(mTA[i]));
                        if (doneMoves.has(c_mTA)) {
                            mTA.splice(i, 3);
                            continue;
                        }

                        doneMoves.push(c_mTA);
                    }

                    moveObj[x] = mTA.join(" ");
                }


/* We check CC later, as it's a little messy.
			We also will check evos later as some pokes don't have one. */

                var fEgg2Pokes = {},
                    curr_fegg2, hasFegg1;
                for (x in fegg2) {
                    curr_fegg2 = fegg2[x].split(" ");
                    if (curr_fegg2 == "0") {
                        continue;
                    }

                    fEgg2Pokes[curr_fegg2[0]] = curr_fegg2[1];
                }

                for (x in fstats) {
                    x = Number(x);
                    pokeId++;

                    /* Put stuff into an array here. */

                    curr_stats = [fstats[x].split(" ")];
                    oldCurrStat = curr_stats[0];
                    spl = fstats[x].split(":");

                    if (spl[1] == undefined) {
                        break;
                    }

                    /* First is for formes. Second is missingno check. */
                    if (spl[1][0] != "0" || spl[0] == "0") {
                        pokeId--;
                        continue;
                    }

                    curr_stats = [oldCurrStat, fweigh[pokeId].split(" "), fheigh[pokeId].split(" "), fgen[pokeId].split(" "), fevol[pokeId].split(" ")];

                    if (fegg1[pokeId] != undefined) {
                        hasFegg1 = true;
                        curr_stats.push(fegg1[pokeId].split(" "));
                    } else {
                        hasFegg1 = false;
                        curr_stats.push(" ");
                    }

                    if (fEgg2Pokes[pokeId] != undefined) {
                        hasFegg2 = true;
                        curr_stats.push([pokeId, fEgg2Pokes[pokeId]]);
                    } else {
                        hasFegg2 = false;
                        curr_stats.push(" ");
                    }

                    poke = sys.pokemon(spl[0]);
                    curr_poke_stats = curr_stats[0]; /* Egg Groups */
                    if (hasFegg1) {
                        curr_stats[5][1] = cut(curr_stats[5], 1, ' ');
                    }
                    if (hasFegg2) {
                        curr_stats[6][1] = cut(curr_stats[6], 1, ' ');
                    }

                    Poke_Data[poke] = {
                        "stats": {
                            'HP': curr_poke_stats[1],
                            'ATK': curr_poke_stats[2],
                            'DEF': curr_poke_stats[3],
                            'SPATK': curr_poke_stats[4],
                            'SPDEF': curr_poke_stats[5],
                            'SPD': curr_poke_stats[6]
                        },

                        "weight": curr_stats[1][1],
                        "height": curr_stats[2][1],
                        "minlvl": Number(curr_stats[4][1].split("/")[0]),
                        "genders": curr_stats[3][1],
                        "egg": [curr_stats[5][1], curr_stats[6][1]],
                        "moves": moveObj[poke]
                    };

                    /* Done! */
                }

                /* Parsing evos */
                var pArr = Files.evos.map(function (a) {
                    return a.split(" ");
                }),
                    c_entry, next_entry, c_poke;

                for (x in pArr) {
                    c_entry = pArr[x];
                    next_entry = pArr[Number(x) + 1];
                    c_poke = sys.pokemon(c_entry[0]);

                    if (next_entry !== undefined && Number(c_entry[1]) == Number(next_entry[0])) {
                        Poke_Data[c_poke].evos = [c_entry[1], next_entry[1]];
                    }
                    else if (c_entry.length === 3 && c_entry[1] === c_entry[2]) { /* Feebas evo bug. */
                        Poke_Data[c_poke].evos = [c_entry[1]];
                    }
                    else if (c_entry.length !== 2) {
                        c_entry.splice(0, 1);
                        Poke_Data[c_poke].evos = c_entry;
                    }
                    else if (Number(c_entry[0]) + 1 === Number(c_entry[1])) {
                        Poke_Data[c_poke].evos = [c_entry[1]];
                    }
                }

                /* Done! */

                /* Checking CC levels */
                for (x in fcc) {
                    c_entry = fcc[x];
                    spl = c_entry.split(":");
                    c_m_space = c_entry.split(" ");
                    c_poke = sys.pokemon(Number(spl[0]));

                    if (c_poke == undefined || c_poke == "Missingno" || spl[1][0] !== "0") { // Formes. Missingno.
                        continue;
                    }

                    Poke_Data[c_poke].cc = Number(c_m_space[1]);
                }
            }

            formatStat = function (poke, stat) {
                var stat = Poke_Data[poke].stats[stat];
                var string = stat.bold(),
                    y;
                var ranges = [30, 50, 60, 70, 80, 90, 100, 200, 300];
                var colors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];

                for (y in ranges) {
                    if (stat <= ranges[y]) {
                        return string.fontcolor(colors[y]);
                    }
                }

                return string.fontcolor(colors[colors.length - 1]);
            }

            statsOf = function (poke) {
                var stat = Poke_Data[poke].stats;
                var ret = [],
                    z;
                for (z in stat) {
                    ret.push(stat[z]);
                }
                return ret;
            }

            formatStatsOf = function (poke) {
                var stats = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"];
                var ret = "",
                    z, stt;
                for (z in stats) {
                    stt = stats[z];
                    if (stt != "SPD") {
                        ret += stt + ": " + formatStat(poke, stt) + " | ";
                    }
                    else {
                        ret += stt + ": " + formatStat(poke, stt);
                    }
                }

                return ret;
            }

            movesOf = function (poke) {
                var moves = Poke_Data[poke].moves.split(" ").map(function (move) {
                    return Number(move);
                }).sort(function (a, b) {
                    return sys.moveType(b) - sys.moveType(a);
                });

                return moves;
            }

            evosOf = function (poke) {
                var PD = Poke_Data[poke];
                if (PD.evos === undefined) {
                    return [];
                }

                return PD.evos;
            }

            var moveColours = {
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

            formatEvosOf = function (poke) {
                var evos = evosOf(poke),
                    y, retString = [];

                for (y in evos) {
                    retString.push(sys.pokemon(evos[y]).fontcolor(moveColours[sys.pokeType1(evos[y])]).bold());
                }

                return fancyJoin(retString);
            }

            formatMovesOf = function (poke) {
                var moves = movesOf(poke),
                    y, retString = "",
                    ml = moves.length - 1;

                for (y in moves) {
                    retString += sys.move(moves[y]).fontcolor(moveColours[sys.moveType(moves[y])]).bold().fontsize(2);
                    if (ml != y) {
                        retString += ", ";
                    }
                }

                return retString + ".";
            }

            baseStatTotal = function (poke) {
                var poke = Poke_Data[poke].stats;
                var retnum = 0,
                    y;

                for (y in poke) {
                    retnum += Number(poke[y]);
                }
                return retnum;
            }

            formatBaseStatTotal = function (poke) {
                var stat = baseStatTotal(poke);
                var string = String(stat).bold(),
                    y;
                var ranges = [180, 300, 360, 420, 480, 540, 600, 1200, 1800];
                var colors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];

                for (y in ranges) {
                    if (stat <= ranges[y]) {
                        return string.fontcolor(colors[y]);
                    }
                }
                return string;
            }

            pokeType = function (poke) {
                var poke_num = sys.pokeNum(poke);
                var type = sys.pokeType1(poke_num);
                var ret = "";
                var type2 = sys.pokeType2(poke_num);

                var type_name = sys.type(type).bold().fontcolor(moveColours[type]);

                ret += type_name;

                if (type2 != 17) {
                    var type_name2 = sys.type(type2).bold().fontcolor(moveColours[type2]);
                    ret += " & " + type_name2;
                }

                return ret;
            }

            firstGen = function (poke) {
                poke = sys.pokeNum(poke);

                if (poke < 152) {
                    return 1;
                }

                else if (poke < 252) {
                    return 2;
                }

                else if (poke < 387) {
                    return 3;
                }

                else if (poke < 494) {
                    return 4;
                }

                return 5;
            }

            pokeAbilities = function (poke) {
                poke = sys.pokeNum(poke);
                var ret = "";
                var abil = [sys.pokeAbility(poke, 0), sys.pokeAbility(poke, 1), sys.pokeAbility(poke, 2)];

                ret += sys.ability(abil[0]).bold();

                if (abil[1] != 0) {
                    ret += " | " + sys.ability(abil[1]).bold();
                }
                if (abil[2] != 0) {
                    ret += " | " + sys.ability(abil[2]).bold() + " (<u>Dream World Ability</u>)";
                }
                return ret;
            }

            pokeGender = function (poke) {
                var pD = Number(Poke_Data[poke].genders);

                if (pD === 3) {
                    return "<img src='Themes/Classic/genders/gender1.png'> <img src='Themes/Classic/genders/gender2.png'>";
                }

                else if (pD === 2) {
                    return "<img src='Themes/Classic/genders/gender2.png'>";
                }

                else if (pD === 1) {
                    return "<img src='Themes/Classic/genders/gender1.png'>";
                }

                return "<img src='Themes/Classic/genders/gender0.png'>";
            }

            pokedex = function (src, chan, pokemon, source) {
                var t = new Templater("Pokedex - " + pokemon.fontcolor(moveColours[sys.pokeType1(sys.pokeNum(pokemon))]));

                var n = sys.pokeNum(pokemon),
                    PD = Poke_Data[pokemon],
                    s = sys.pokeType2(n) == 17 ? '' : 's',
                    s2 = sys.pokeAbility(n, 1) == 0 && sys.pokeAbility(n, 2) == 0 ? 'y' : 'ies',
                    gender = pokeGender(pokemon),
                    eggs = PD.egg,
                    eggstr = "",
                    evoS = "";

                t.register("<img src='pokemon:num=" + n + "'> <img src='pokemon:num=" + n + "&back=true'> <img src='pokemon:num=" + n + "&shiny=true'> <img src='pokemon:num=" + n + "&shiny=true&back=true'><br/>");
                t.register("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + gender);
                t.register("National Dex Number: " + String(n).bold() + ".");
                t.register("Generation " + String(firstGen(pokemon)).bold() + " Pokemon. ");

                if ((PD.evos !== undefined || (PD.minlvl !== 1 && PD.minlvl !== 100))) {
                    t.register("");
                }

                if (PD.evos !== undefined) {
                    if (PD.evos.length !== 1) {
                        evoS = "s";
                    }
                    t.register("Evolution" + evoS + ": " + formatEvosOf(pokemon));
                }

                if (PD.minlvl !== 1 && PD.minlvl !== 100) {
                    t.register("Minimum Level: <b>" + PD.minlvl + "</b>");
                }

                t.register("Level in Challenge Cup: <b>" + PD.cc + "</b><br/>");

                if (!isEmpty(PD.egg[0])) {
                    eggstr += PD.egg[0].bold();
                }

                if (!isEmpty(PD.egg[1])) {
                    eggstr += " and " + PD.egg[1].bold();
                }

                t.register("Type" + s + ": " + pokeType(pokemon));

                if (eggstr != "") {
                    if (!eggstr.contains("and ")) {
                        t.register("Egg Group: " + eggstr);
                    } else {
                        t.register("Egg Groups: " + eggstr);
                    }
                }

                t.register("Abilit" + s2 + ": " + pokeAbilities(pokemon) + "<br/>");

                t.register("Weight: <b>" + PD.weight + " kg</b>");
                t.register("Height <b>" + PD.height + " m</b><br/>");

                t.register(formatStatsOf(pokemon));
                t.register("Base Stat Total: " + formatBaseStatTotal(pokemon));

                if (pokemon.toLowerCase() !== "smeargle") { // Smeargle crashes.
                    t.register("<br/> " + formatMovesOf(pokemon));
                } else {
                    t.register("<br/> Smeargle learns all moves except Chatter and Transform.");
                }

                if (!source) {
                    t.render(src, chan);
                    return;
                }

                sys.sendHtmlMessage(src, html_escape(t.template.join("<br/>")), chan);

            }
        } catch (e) {
            print(FormatError("", e));
        }

    },

    loadRequiredUtilities: function () {
        RECOVERY = function () {
            if (typeof script.message != 'undefined' && typeof script.step == 'undefined') {
                botAll("Fatal Script Error detected! " + FormatError("", script));
                botAll("Recovering script functions!");

                var x, SC = RECOVERY_BACKUP,
                    pushed = 0;
                for (x in SC) {
                    try {
                        script[x] = SC[x];
                        pushed++;
                    }
                    catch (e) {
                        botAll("Caught an exception when recovering " + x + ".", 0);
                        print("Exception: " + e + ", on line " + e.lineNumber);
                    }
                }

                botAll("Function recovery completed! Recovered " + pushed + "/" + objLength(RECOVERY_BACKUP) + " functions.", 0);
                delete script.message;
                script.beforeNewMessage("Script Check: OK");
                botAll("Recovery completed!", 0);
            }
        }

        fancyJoin = function (array) {
            var x, retstr = '',
                arrlen = array.length;

            if (arrlen === 0 || arrlen === 1) {
                return array.join("");
            }

            arrlen--;

            for (x in array) {
                if (Number(x) === arrlen) {
                    retstr = retstr.substr(0, retstr.lastIndexOf(","));
                    retstr += " and " + array[x];

                    return retstr;
                }

                retstr += array[x] + ", ";
            }

            return "";
        }

        updateProtoForJSESSION = function (Proto) {
            var p = Proto.prototype;
            if (p == undefined) {
                return;
            }

            if (Proto == POUser) {
                sys.playerIds().forEach(function (id) {
                    if (sys.loggedIn(id) && JSESSION.users(id).__proto__ != p) {
                        JSESSION.users(id).__proto__ = p;
                    }
                });
            }
            else if (Proto == POChannel || Proto == Tours) {
                var list = sys.channelIds(),
                    PROTOTOUR = Proto == Tours,
                    channel;

                list.forEach(function (id) {
                    channel = JSESSION.channels(id);
                    if (sys.existChannel(sys.channel(id))) {
                        if (PROTOTOUR) {
                            if (channel.toursEnabled && channel.tour.__proto__ != p) {
                                channel.tour.__proto__ = p;
                            }
                        }
                        else {
                            if (channel.__proto__ != p) {
                                channel.__proto__ = p;
                                cData.loadDataFor(sys.channel(id));
                            }
                        }
                    }
                });
            }
        }

        updateProtoForJSESSION(POUser);
        updateProtoForJSESSION(POChannel);
        updateProtoForJSESSION(Tours);
        
        createFile = function (file, replacement) {
            sys.appendToFile(file, "");
            if (sys.getFileContent(file) == "") {
                sys.writeToFile(file, replacement);
            }

        }

        on = function (str) {
            var onArray = ["yes", "true", "on"],
                x, strToLower = str.toLowerCase();

            for (x in onArray) {
                if (strToLower.contains(onArray[x])) {
                    return true;
                }
            }

            return false;
        }

        WatchPlayer = function (player, type, message, channel) {
            var chan = "";
            if (typeof channel != "undefined") {
                chan = "[" + ChannelLink(sys.channel(channel)) + "]";
            }

            var src = "<font color=" + script.namecolor(player) + ">" + html_escape(sys.name(player)) + ":</font>";

            if (typeof watch != "undefined") {
                sys.sendHtmlAll("<timestamp/><b>" + chan + " " + type + " -- " + src + "</b> " + html_escape(message), watch);
            }
        }

        WatchEvent = function (player, message, channel) {
            var chan = "";
            if (typeof channel != "undefined") {
                chan = "[" + ChannelLink(sys.channel(channel)) + "]";
            }

            var src = "<font color=" + script.namecolor(player) + ">" + html_escape(sys.name(player)) + ":</font>";

            if (typeof watch != "undefined") {
                sys.sendHtmlAll("<timestamp/><b>" + chan + " " + src + "</b> " + message, watch);
            }
        }

        WatchChannelEvent = function (channel, message) {
            if (typeof watch != "undefined") {
                sys.sendHtmlAll("<timestamp/><b>" + sys.channel(channel) + ":</b> " + message, watch);
            }
        }
    },

    loadCache: function () {
        CacheInst = function (file) {
            this.file = file + ".json";
            this.ensures = 0;
            createFile(this.file, "{}");

            try {
                this.hash = JSON.parse(sys.getFileContent(this.file));
            }
            catch (e) {
                sys.writeToFile(file + "-corrupt.json", JSON.stringify(this.hash));
                this.hash = {};
                this.saveAll();
                var cacheName = file;
                if (file != "Cache") {
                    cacheName += " cache";
                } else {
                    cacheName = "cache";
                }

                print(FormatError("Could not load " + cacheName + " from file " + this.file + ".json!", e));
                print("Old cache available in " + file + "-corrupt.json. Cache has been cleared and " + file + ".json has been cleared.");
            }
        }

        CacheInst.prototype.save = function (key, value) {
            if (typeof this.hash[key] == "undefined") {
                this.hash[key] = value;
                this.saveAll();
            }
        }

        CacheInst.prototype.write = function (key, value) {
            this.hash[key] = value;
            this.saveAll();
        }

        CacheInst.prototype.remove = function (key) {
            if (this.get(key) == "") {
                return;
            }

            delete this.hash[key];
            this.saveAll();
        }

        CacheInst.prototype.get = function (key) {
            if (this.hash[key] == undefined) {
                return "";
            }

            return this.hash[key];
        }

        CacheInst.prototype.reset = function () {
            this.hash = {};
            sys.writeToFile(this.file, "{}");
        }

        CacheInst.prototype.saveAll = function () {
            sys.writeToFile(this.file, JSON.stringify(this.hash));
        }

        CacheInst.prototype.ensure = function (key, value) {
            if (typeof this.hash[key] == "undefined") {
                this.hash[key] = value;
                this.ensures++;
            }
        }

        if (typeof cache == "undefined") {
            cache = new CacheInst("Cache");
        }
        if (typeof playerscache == "undefined") {
            playerscache = new CacheInst("Players");
        }
        if (typeof TrivCache == "undefined") {
            TrivCache = new CacheInst("Trivia");
        }

        cache.ensure("ClanTag", "None");
        cache.ensure("AuthLevel0Name", "User");
        cache.ensure("AuthLevel1Name", "Mod");
        cache.ensure("AuthLevel2Name", "Admin");
        cache.ensure("AuthLevel3Name", "Owner");
        cache.ensure("AuthLevel4Name", "Invisible");
        cache.ensure("ChanLevel0Name", "Chan User");
        cache.ensure("ChanLevel1Name", "Chan Mod");
        cache.ensure("ChanLevel2Name", "Chan Admin");
        cache.ensure("ChanLevel3Name", "Chan Owner");
        cache.ensure("TourLevel0Name", "Tour User");
        cache.ensure("TourLevel1Name", "Megauser");
        cache.ensure("ChanTour0Name", "Chan Tour User");
        cache.ensure("ChanTour1Name", "Chan Megauser");

        cache.ensure("MaxPlayersOnline", sys.numPlayers());
        cache.ensure('MaxMessageLength', 500);
        cache.ensure('TourDisplay', 1);
        cache.ensure("FutureLimit", 15);

        cache.ensure("MessageEditor", false);
        cache.ensure("UseIcons", false);
        cache.ensure("implock", true);
        cache.ensure("motd", false);
        cache.ensure("evallock", false);
        cache.ensure("AutoStartTours", false);
        cache.ensure("AutoKick", true);
        cache.ensure("AutoMute", true);
        cache.ensure("ChannelsAllowed", true);
        cache.ensure("BattlesAllowed", true);

        cache.ensure("mutes", "{}");
        cache.ensure("tempbans", "{}");
        cache.ensure("rangebans", "{}");
        playerscache.save("names", "{}");
        cache.ensure("money", "{}");
        cache.ensure("rankicons", "{}");
        cache.ensure("mail", "{}");
        cache.ensure("bannedAbilities", "{}");
        cache.ensure("megausers", "{}");
        cache.ensure("tempauth", "{}");
        cache.ensure("idles", "{}");
        cache.ensure("voices", "{}");
        cache.ensure("evalops", "{}");
        playerscache.save("locations", "{}");

        var BOT_JSON = {
            "bot": "~Server~",
            "botcolor": "red"
        },
            LEAGUE_JSON = {
                "Champion": "",
                "gym": {},
                "elite": {}
            },
            ENABLED_JSON = {
                "me": true,
                "_catch_": true,
                "attack": true,
                "roulette": true
            };

        cache.ensure("Bot", JSON.stringify(BOT_JSON));
        cache.ensure("CommandsEnabled", JSON.stringify(ENABLED_JSON));
        cache.ensure("league", JSON.stringify(LEAGUE_JSON));

        ClanTag = cache.get("ClanTag");
        ChanUser = cache.get("ChanLevel0Name");
        ChanMod = cache.get("ChanLevel1Name");
        ChanAdmin = cache.get("ChanLevel2Name");
        ChanOwner = cache.get("ChanLevel3Name");
        UserName = cache.get("AuthLevel0Name");
        ModName = cache.get("AuthLevel1Name");
        AdminName = cache.get("AuthLevel2Name");
        OwnerName = cache.get("AuthLevel3Name");
        InvisName = cache.get("AuthLevel4Name");
        Tour0 = cache.get("TourLevel0Name");
        Tour1 = cache.get("TourLevel1Name");
        ChanTour0 = cache.get("ChanTour0Name");
        ChanTour1 = cache.get("ChanTour1Name");

        MessageEditor = cache.get("MessageEditor");
        UseIcons = cache.get("UseIcons");
        implock = cache.get("implock");
        evallock = cache.get("evallock");
        motd = cache.get("motd");
        AutoStartTours = cache.get("AutoStartTours");
        AutoKick = cache.get("AutoKick");
        AutoMute = cache.get("AutoMute");
        ChannelsAllowed = cache.get("ChannelsAllowed");
        BattlesAllowed = cache.get("BattlesAllowed")

        MaxMessageLength = cache.get("MaxMessageLength");
        maxPlayersOnline = cache.get("MaxPlayersOnline");
        TourDisplay = cache.get('TourDisplay');
        FutureLimit = cache.get("FutureLimit");

        Bot = JSON.parse(cache.get("Bot"));

        if (cache.ensures > 0) {
            cache.saveAll();
            cache.ensures = 0;
        }


        if (typeof DataHash === "undefined") {
            DataHash = {};
        }

        var dHash = DataHash,
            defineDataProp = function (name, cacheobj) {
                if (!cacheobj) {
                    cacheobj = cache;
                }
                if (!dHash.has(name)) {
                    dHash[name] = {};
                    var query = cacheobj.get(name);
                    if (query != "") {
                        try {
                            DataHash[name] = JSON.parse(query);
                        }
                        catch (e) {
                            DataHash[name] = {};
                        }
                    } else {
                        DataHash[name] = {};
                    }
                }
            };

        defineDataProp("mutes");
        defineDataProp("voices");
        defineDataProp("evalops");
        defineDataProp("names", playerscache);
        defineDataProp("mail");
        defineDataProp("bannedAbilities");
        defineDataProp("rangebans");
        defineDataProp("money");
        defineDataProp("rankicons");
        defineDataProp("megausers");
        defineDataProp("tempauth");
        defineDataProp("league");
        defineDataProp("idles");
        defineDataProp("tempbans");
        defineDataProp("macros");
        defineDataProp("locations", playerscache);

        var ids = sys.playerIds(),
            x, n, l, names = dHash.names,
            curr;

        for (x in ids) {
            curr = ids[x];
            if (!sys.loggedIn(curr)) {
                continue;
            }

            n = sys.name(curr);
            l = n.toLowerCase();
            names[l] = n;
        }

        if (typeof CommandsEnabled === "undefined") {
            CommandsEnabled = {
                'me': true,
                '_catch_': true,
                'attack': true,
                'roulette': true
            };

            if (cache.get("CommandsEnabled") != "") {
                try {
                    CommandsEnabled = JSON.parse(cache.get("CommandsEnabled"));
                }
                catch (e) {
                    cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                }
            }
            else {
                cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
            }
        }

        if (typeof PointerCommands === "undefined") {
            PointerCommands = {};
            if (cache.get("pointercommands") != "") {
                try {
                    PointerCommands = JSON.parse(cache.get('pointercommands'));
                }
                catch (e) {
                    PointerCommands = {};
                }
            }
        }

        var Required_Pointers = {
            "k": "kick",
            "auth": "authlist",
            "auths": "authlist",
            "tourauths": "tourauthlist",
            "b": "ban",
            "tauths": "tourauthlist",
            "tourauth": "tourauthlist",
            "tauth": "tourauthlist",
            "cbans": "cbanlist",
            "cmutes": "cmutelist",
            "cmute": "channelmute",
            "cunmute": "channelunmute",
            "cban": "channelban",
            "cunban": "channelunban",
            "ctauth": "ctourauthlist",
            "colorchat": "chatcolor",
            "colorchatoff": "chatcoloroff",
            "removeautoidle": "autoidleoff",
            "answer": "a",
            "cls": "clearchat",
            "spam": "randomspam",
            "bans": "banlist",
            "mutes": "mutelist",
            "m": "mute",
            "tb": "tempban",
            "rb": "rangeban",
            "tempbans": "tempbanlist",
            "rangebans": "rangebanlist",
            "say": "talk",
            "implockoff": "impunlock",
            "rankiconon": "mainicon",
            "icon": "changeicon",
            "rankicons": "icons",
            "rankiconcommands": "iconcommands",
            "sendhtmlall": "html",
            "sendall": "send",
            "announce": "wall",
            "htmlannounce": "htmlwall",
            "cwall": "channelwall",
            "chtmlwall": "channelhtmlwall",
            "channelannounce": "channelwall",
            "cannounce": "channelwall",
            "channelhtmlannounce": "channelhtmlwall",
            "chtmlannounce": "channelhtmlwall",
            "cp": "info",
            "q": "push",
            "voicelist": "voices",
            "devoice": "unvoice",
            "removevoice": "unvoice",
            "voiceoff": "unvoice",
            "bp": "battlepoints",
            "eop": "evalop",
            "eops": "evalops",
            "unevalop": "evaluser",
            "evalopoff": "evaluser",
            "tempunban": "untempban",
            "deletepointercommand": "delpointercommand",
            "removepointercommand": "delpointercommand",
            "delpointer": "delpointercommand",
            "removepointer": "delpointercommand",
            "evl": "eval",
            "evval": "eval",
            "eeval": "eval",
            "code": "eval",
            "run": "eval",
            "silenceoff": "unsilence"
        },
            c = false,
            pc = PointerCommands,
            cur, y;

        for (y in Required_Pointers) {
            if (!pc.has(y)) {
                pc[y] = Required_Pointers[y];
                c = true;
            }
        }

        if (!PointerCommands.has("!!/Reverse/!!")) {
            PointerCommands["!!/Reverse/!!"] = {};
        }

        for (y in pc) {
            if (y == "!!/Reverse/!!") {
                break;
            }

            cur = pc["!!/Reverse/!!"][pc[y]];
            if (typeof cur != "object") {
                cur = {};
                pc["!!/Reverse/!!"][pc[y]] = {};
            }

            if (!cur.has(y)) {
                pc["!!/Reverse/!!"][pc[y]][y] = '';
                c = true;
            }
        }

        if (c) {
            cache.write("pointercommands", JSON.stringify(pc));
        }

    },

    loadCommandStatsUtility: function () {
        if (typeof CommandStats != "undefined") {
            sys.stopTimer(CommandStats.timer);
        }

        CommandStats = new(function () {
            var file = "CommandStats.json";
            createFile(file, "{}");

            this.timer = sys.intervalCall(function () {
                CommandStats.save();
            }, 30000); /* 30 seconds */

            this.stats = {};
            try {
                this.stats = JSON.parse(sys.getFileContent(file));
            } catch (e) {
                var time = sys.time() * 1;
                this.stats = {
                    commands: {}
                };

                this.stats.startTime = time;
                this.stats.lastCommandTime = time;
                this.save();
            }

            this.save = function () {
                sys.writeToFile(file, JSON.stringify(this.stats));
            }

            this.write = function (command, user) {
                var stats = this.stats;
                if (!stats.has("commands")) {
                    stats.commands = {};
                }

                if (!stats.commands.has(command)) {
                    stats.commands[command] = {
                        used: 0,
                        last: ""
                    };
                }

                var query = stats.commands[command];
                query.used += 1;
                query.last = user;

                if (command != "commandstats") {
                    this.stats.lastCommandTime = sys.time() * 1;
                }
            }

            this.display = function (src, chan, limit) {
                var statsArray = [],
                    name, totalstats = 0,
                    commandStats = this.stats.commands,
                    lim = -1,
                    current, at, time = sys.time() * 1,
                    statsLen = commandStats.length();

                if (limit != undefined && limit != 0 && limit != -1) {
                    lim = limit;
                }

                for (name in commandStats) {
                    current = commandStats[name];
                    if (lim != -1 && lim < at) {
                        break;
                    }

                    at++;

                    statsArray.push([name, current.used, current.last]);
                }

                statsArray.sort(function (used_A, used_B) {
                    return used_B[1] - used_A[1];
                });

                var msg_footer = "%1 commands used in total",
                    msg_header = "Command usage statistics for " + servername + ":";

                if (lim != -1 && lim <= statsLen) {
                    msg_footer = lim + " commands were used %1 times.", msg_header = "Command usage statistics for " + lim + " commands:";
                }

                botMessage(src, msg_header, chan);

                var num = 0,
                    u;

                for (u in statsArray) {
                    num++;
                    if (num > lim) {
                        break;
                    }
                    current = statsArray[u];

                    botEscapeMessage(src, "#" + num + ". Command " + cap(current[0]) + ": " + current[1] + ", last used by " + current[2], chan);
                    total += current[1];
                }

                botEscapeMessage(src, msg_footer.format(total), chan);
                botMessage(src, "Started counting command usage " + getTimeString(time - this.stats.startTime) + " ago. Last command used " + getTimeString(time - this.stats.lastCommandTime) + " ago.", chan);
            }
        })();
    },

    loadTrivia: function () {
        return;

        if (typeof Trivia === 'undefined' || !Trivia.loaded) {
            Trivia = new(function () {
                var Flags = {
                    "html": 1,
                    "AutoGenerator": "Automatic Trivia Question Generator",
                    "NoQuestionsAvailable": "No questions are available.",
                };

                this.questionNumber = this.freeId = function () {
                    return this.questions.length();
                }

                function sendAll(msg, html) {
                    if (html == Flags.html) {
                        sys.sendHtmlAll(msg, trivia);
                        return;
                    }

                    botAll(msg, trivia);
                }

                function sendMessage(id, msg, html) {
                    if (html == Flags.html) {
                        sys.sendHtmlMessage(id, msg, trivia);
                        return;
                    }

                    botMessage(id, msg, trivia);
                }

                function escapeMessage(id, msg) {
                    botEscapeMessage(id, msg, trivia);
                }

                this.questionInfo = function () { /* No escaping on purpose; admins should review well */
                    var currentQuestion = this.currentQuestion,
                        displayQuestion = currentQuestion.display;

                    sendAll("<hr width='450'/><center><b>Category:</b> " + currentQuestion.category + " <br/> <b>Question</b>: " + displayQuestion + " </center><hr width='450'/>", Flags.html);
                }

                this.leaderboardDisplay = function (src, match) {
                    var scores = this.leaderboard;
                    if (scores.isEmpty()) {
                        sendMessage(src, "No leaderboard available.");
                        return;
                    }

                    var l = [],
                        i, num, p;

                    if (match.isEmpty()) {
                        for (i in scores) {
                            l.push([i, scores[i]]);
                        }

                        l.sort(function (a, b) {
                            return b[1] - a[1];
                        });

                        sendMessage(src, "<font size='4'>Trivia Leaderboard</font>");

                        p = player(l[i][0]);

                        for (i in l) {
                            num = Number(i) + 1;
                            escapeMessage(src, num + ". Player " + p + " with " + l[i][1] + " game wins.");
                        }
                        return;
                    }

                    p = player(match);
                    sendMessage(src, "<font size='4'>Leaderboard for " + p + "</font>");
                    escapeMessage(src, "Player " + p + " with " + scores[match] + " game wins.");
                }

                this.clearVariables = function (inLoad) {
                    if (inLoad && this.loaded) {
                        return;
                    }

                    this.mode = -1;

/* Modes:
			-1: No game.
			0: Signups. 60 Sec delay.
			1: Question
			2: Delay time between questions
			*/

                    this.currentQuestion = {}; /* Current Question data (for this.questionInfo()) */

                    this.players = {};

/* Struct players:
				nameToLower => "name", "points", "actionTime" 
				(Correct case, points earned, time (in millisecs) of the /a if q was correct)
				defaults: null, 0, 0
			*/

                    this.gamePoints = -1;

                    /* Amount of points required */

                    this.roundWrongAnswers = []; /* Incorrect answers. */

                    if (typeof this.questions === 'undefined') {
                        this.questionsLoad();
                    }
                    if (typeof this.leaderboard === 'undefined') {
                        this.leaderboardLoad();
                    }

                    if (typeof this.review == 'undefined') {
                        this.reviewLoad();
                    }

                    this.loaded = true;
                }

                this.randomQ = function () {
                    var list = this.questions.keys(),
                        len = list.length;

                    if (len == 0) {
                        return Flags.NoQuestionsAvailable;
                    }

                    var rand = Math.floor(len * Math.random()),
                        result = this.questions[list[rand]],
                        resn = result.name;

                    while (result === undefined) {
                        rand = Math.floor(len * Math.random());
                        result = this.questions[list[rand]], resn = result.name;
                    }

                    this.currentQuestion = result;
                }

                this.isQuestion = function (id) {
                    var x, questions = this.questions,
                        curr;
                    for (x in questions) {
                        curr = questions[x]
                        if (curr != id) {
                            continue;
                        }
                        return true;
                    }

                    return false;
                }

                this.addQuestion = function (info) {
                    if (!info.display_question) {
                        info.display_question = info.question;
                    }

                    this.questions[this.freeId()] = info;
                }

                this.questionsLoad = function () {
                    try {
                        this.questions = JSON.parse(TrivCache.get("Questions"));
                    }
                    catch (e) {
                        this.questions = {};
                    }

                    if (TrivCache.get("init_pokes_done") == "") {
                        var nums = 1,
                            poke, randchance, scrambled;

                        for (; nums < 650; nums++) {
                            poke = sys.pokemon(nums);
                            randchance = sys.rand(0, 3) == 1 ? '&shiny=true' : '';
                            scrambled = poke.scrambled;

                            this.addQuestion({
                                'by': Flags.AutoGenerator,
                                'answers': [poke],
                                'question': 'Who is this Pokémon? <br/> <img src="pokemon:' + nums + randchance + '&gen=5">',
                                'category': 'Pokémon'
                            });
                            this.addQuestion({
                                'by': Flags.AutoGenerator,
                                'answers': [poke],
                                'question': 'Who is this Pokemon? - ' + poke,
                                'display_question': 'What is the correct Pokémon name? <br/> ' + scrambled.bold(),
                                'category': 'Pokémon'
                            });
                        };

                        TrivCache.write("init_pokes_done", true);
                        this.saveQuestions();
                    }
                }

                this.leaderboardLoad = function () {
                    try {
                        this.leaderboard = JSON.parse(TrivCache.get("LeaderBoard"));
                    }
                    catch (e) {
                        this.leaderboard = {};
                    }
                }

                this.reviewLoad = function () {
                    try {
                        this.review = JSON.parse(TrivCache.get("Review"));
                    }
                    catch (e) {
                        this.review = {};
                    }

                }

                this.saveQuestions = function () {
                    TrivCache.write("Questions", JSON.stringify(this.questions));
                }

                this.saveLeaderBoard = function () {
                    TrivCache.write("LeaderBoard", JSON.stringify(this.leaderboard));
                }

                this.saveReview = function () {
                    TrivCache.write("Reviews", JSON.stringify(this.review));
                }

                this.saveLeaderboard = function (user) {
                    user = user.toLowerCase();

                    var lbNum = 1,
                        board = this.leaderboard;
                    if (board.has(user)) {
                        lbNum + board[user];
                    }

                    board[user] = lbNum;
                    this.saveLeaderBoard();
                }

                this.command_start = function (src, points) {
                    var name = sys.name(src),
                        send = function (mess) {
                            if (src) {
                                sendMessage(src, mess);
                            }
                        };

                    if (!src) {
                        name = Bot.bot + "</i>";
                    }

                    if (this.isGameGoingOn()) {
                        send("A Trivia game is already going on.");
                        return;
                    }
                    if (this.questions.isEmpty()) {
                        send("No questions exist.");
                        return;
                    }

                    points = parseInt(points);

                    if (points < 30) {
                        send("Specify at least 30 points for this game.");
                        return;
                    }

                    if (points > 200) {
                        send("Specify less than 200 points for this game.");
                        return;
                    }

                    this.mode = 0;
                    this.gamePoints = points;

                    var me = player(src);
                    if (!src) {
                        me = name;
                    }

                    botAll("A new trivia game was started by " + me + "! It will start in 60 seconds. Go to " + ChannelLink(sys.channel(trivia)) + " and type /join to join it! First to get " + points + " points or more wins!", 0);
                    sendAll("A new trivia game was started by " + me + "! It will start in 60 seconds. Type /join to join the game! First to get " + points + " points or more wins! <ping/>");
                    sys.callLater("Trivia.startGame();", 60);
                }

                this.isGameGoingOn = function () {
                    return this.mode != -1;
                }

                this.durningGame_beforeChatMessage = function (src, message) {
/* return value bool:
				true = stop message from appearing
				false = ignore this
				
				arg message string:
				the message.
				*/

                    if (this.mode == 2 || this.mode == 0) {
                        return false;
                    }

                    var myName = sys.name(src).toLowerCase();
                    if (this.players.has(myName)) {
                        this.command_join(src);
                    }

                    var myPlayer = this.players[myName];

                    if (message.isEmpty()) {
                        sendMessage(src, "Specify an answer.");
                        return true;
                    }

                    var qList = this.currentQuestion.answers.map(function (q) {
                        return q.toLowerCase();
                    }),
                        messageToLower = message.toLowerCase();

                    if (qList.has(messageToLower)) {
                        myPlayer.actionTime = new Date().getTime();
                    }
                    else {
                        if (myPlayer.actionTime != -1) {
                            myPlayer.actionTime = -1; // Wrong, reset.
                            this.roundWrongAnswers.push(message + " (by " + sys.name(src) + ")");
                        }
                    }


                    this.sendMessage(src, "Your answer was submitted.");
                    return true;
                }

                this.endGame = function () {
                    this.clearVariables(false);
                }

                this.startGame = function () {
                    var pList = this.players.keys().map(function (n) {
                        return player(n);
                    });

                    if (pList.length != 0) {
                        sendAll(fancyJoin(pList) + " joined the game!");
                    }

                    this.displayQInfo();
                    this.callNewRound();
                }

                this.sendToTrivReview = function (src, question) {
                    if (sys.playersOfChannel(trivreview) != 0) {
                        sys.sendHtmlAll("<timestamp/> <i><b>" + sys.name(src) + "</b> has submit a question.</i> <ping/>", trivreview);
                        sys.sendHtmlAll("<timestamp/> <i>" + question.question + " | " + html_escape(question.category) + " | " + question.answers.join(" & ") + "</i>", trivreview);
                        var questionContainHTML = html_strip(question.display_question) != question.display_question;
                        var categoryContainHTML = html_strip(question.category) != question.category;
                        sys.sendHtmlAll("<timestamp/> <i>Contains HTML in displayed question: " + questionContainHTML + " | Contains HTML in category: " + categoryContainHTML, trivreview);
                    }
                }

                this.callNewRound = function () {
                    if (this.mode === -1) { /* Game ended */
                        return;
                    }

                    var longestAnswer = 0,
                        x, q = this.currentQuestion.answers,
                        curr;
                    for (x in q) {
                        curr = q[x].length;
                        if (curr > longestAnswer) {
                            longestAnswer = curr
                        }
                    }

                    if (longestAnswer > 19) {
                        longestAnswer = Math.round(longestAnswer / 2);
                    }

                    sys.callLater("Trivia.roundEnd(" + longestAnswer + ");", longestAnswer);
                }

                this.startWait = function () {
                    var rand = sys.rand(13, 21);

                    this.mode = 2;
                    sendAll("Have a " + rand + " second break before the next question!");
                    sys.callLater("Trivia.displayQInfo(); Trivia.callNewRound();", rand);
                }

                this.roundEnd = function (longestAnswerLength) {
                    if (this.mode === -1) {
                        return;
                    } /* Game ended */

                    var x, p = this.players,
                        ctime = new Date().getTime(),
                        correct = [],
                        winners = {},
                        cplayer, cplayertimediff, cplayeraddpoints;

                    for (x in p) {
                        cplayer = p[x];
                        cplayertimediff = Math.round(ctime - cplayer.actionTime);
                        if (cplayer.actionTime != -1) {
                            cplayeraddpoints = longestAnswerLength;

                            if (cplayertimediff > longestAnswerLength / 2) {
                                cplayeraddpoints = Math.round(cplayeraddpoints / 2);
                            }

                            correct.push(cplayer.name);
                            cplayer.points += Math.round(Math.tan(cplayertimediff)) + cplayeraddpoints + sys.rand(-1, 2);
                            if (cplayer.points >= this.gamePoints) {
                                winners[cplayer.name] = cplayer.points;
                            }
                        }
                    }

                    if (!winners.isEmpty()) {
                        var winnersList = [],
                            win = " is";

                        for (x in winners) {
                            winnersList.push(x.bold() + " (" + winners[x] + ")");
                        }

                        if (winnersList.length != 1) {
                            win = "s are";
                        }

                        sendAll("The winner" + win + ": " + fancyJoin(winnersList));

                        for (x in winnersList) {
                            this.saveLeaderboard(winnersList[x]);
                        }

                        this.endGame();
                        return;
                    }

                    this.sendAll("Time's up!");
                    if (!correct.isEmpty()) {
                        this.sendAll("Correct Answered: " + fancyJoin(correct));
                    } else {
                        this.sendAll("No one was correct!");
                    }
                    if (this.roundWrongAnswers.length != 0) {
                        this.sendAll("Incorrect answers: " + this.roundWrongAnswers.join(", "));
                    }

                    var lbArr = [],
                        lbStr = "",
                        i = 0,
                        c_pl;

                    for (x in this.players) {
                        c_pl = this.players[x];
                        lbArr.push([c_pl.name, c_pl.points]);
                        i++;

                        c_pl.actionTime = 0; /* Do this while we can! */
                    }

                    lbArr = lbArr.sort(function (a, b) {
                        return b[1] - a[1];
                    });

                    var lbArrLen = lbArr.length - 1;

                    for (x in lbArr) {
                        lbStr += lbArr[x][0].bold() + " (<b>" + lbArr[x][1] + "</b>)";
                        if (x != lbArrLen) {
                            lbStr += ", ";
                        }
                    }

                    sendAll("Leaderboard:");
                    sendAll(lbStr);

                    this.roundWrongAnswers = [];
                    this.startWait();
                }

                this.getCategories = function () {
                    if (this.categoryCache !== undefined) {
                        return this.categoryCache;
                    }

                    var x, quest = this.questions,
                        catArr = [],
                        c_quest;
                    for (x in quest) {
                        c_quest = quest[x].category;
                        if (!catArr.has(c_quest)) {
                            catArr.push(c_quest);
                        }
                    }

                    this.categoryCache = catArr;
                    return catArr;
                }

                this.displayQInfo = function () {
                    if (this.mode === -1) { // Game ended.
                        return;
                    }

                    this.randomQ();
                    this.questionInfo();
                }

                this.end = function (src) {
                    if (this.mode === -1) {
                        sendMessage(src, "No game is going on.");
                        return;
                    }

                    sendAll("Trivia game ended by " + player(src) + "!");
                    this.endGame();
                }

                this.command_questions = function (src) {
                    var len = this.questionsLength();
                    if (len === 0) {
                        sendMessage(src, "No questions exist.");
                        return;
                    }

                    if (len > 2998) {
                        sendMessage(src, "There are too many questions to display. You will not see them all.");
                    }

                    var q = this.questions,
                        y, curr;
                    for (y in q) {
                        curr = q[y];
                        escapeMessage(src, y + ": " + curr.question);
                    }
                }

                this.command_categories = function (src) {
                    if (this.questions.isEmpty()) {
                        this.sendMessage(src, "No questions exist. There can't be any categories.");
                        return;
                    }

                    var catArr = this.getCategories();
                    sendMessage(src, "Question Categories: " + catArr.join(", "));
                }

                this.command_rmquestion = function (src, commandData) {
                    if (this.questionNumber() === 0) {
                        botMessage(src, "No questions exist.", trivreview);
                        return;
                    }
                    if (!this.isQuestion()) {
                        botMessage(src, "That question doesn't exist. For a list of questions, type /questions", trivreview);
                        return;
                    }
                    if (!this.currentQuestion.isEmpty()) {
                        if (this.currentQuestion.question == commandData) {
                            botMessage(src, "A round is going on with this question. Use /skip first.", trivreview);
                            return;
                        }
                    }

                    delete this.questions[commandData];
                    delete this.categoryCache;
                    this.saveQuestions();
                    botMessage(src, "Deleted question " + commandData + "!", trivreview);
                }

                this.command_skip = function (src) {
                    if (!this.isGameGoingOn()) {
                        sendMessage(src, "No trivia game is going on.");
                        return;
                    }
                    if (this.mode === 2) {
                        sendMessage(src, "You can't skip a round durning a break.");
                        return;
                    }
                    sendAll(player(src) + " skipped this round!");
                    this.startWait();
                }

                this.command_qdata = function (src, commandData) {
                    if (this.questionNumber() === 0) {
                        sendMessage(src, "No questions exist.");
                        return;
                    }
                    if (!this.questions.has(commandData)) {
                        sendMessage(src, "That question doesn't exist. For a list of questions, type /questions.");
                        return;
                    }

                    var qData = this.questions[commandData],
                        question = qData.question,
                        by = qData.by,
                        t = qData.category;

                    sendMessage(src, "Question: " + html_escape(r));
                    sendMessage(src, "Category: " + cat);

                    if (by !== Flags.AutoGenerator) {
                        sendMessage(src, "By: " + by);
                    }

                    if (hpAuth(src) > 0) {
                        if (!this.currentQuestion.isEmpty() && this.currentQuestion.question != commandData) {
                            var answers = qData.answers,
                                s = answers.length == 1 ? " is" : "s are";

                            sendMessage(src, "The answer" + s + ": " + answers.join(", "));
                        }
                    }
                }

                this.command_submit = function (src, mcmd) {
                    if (isEmpty(mcmd[0]) || isEmpty(mcmd[1]) || isEmpty(mcmd[2])) {
                        this.sendMessage(src, "Question name, category, or answers are missing.");
                        return;
                    }

                    var q = this.questions[mcmd[0]],
                        myName = sys.name(src);
                    if (this.isQuestion(mcmd[0]) || this.isReview(mcmd[0])) {
                        if (q.by.toLowerCase() !== myName.toLowerCase()) {
                            this.sendMessage(src, "This question already exists!");
                            return;
                        }
                    }

                    var answers = cut(mcmd, 2, ':').split("").map(function (q) {
                        return html_escape(q);
                    }).split(",");
                    if (answers.length == 0) {
                        this.sendMessage(src, "Please specify answers.");
                        return;
                    }

                    var questionHash = {
                        "question": html_strip(mcmd[0]),
                        "display_question": mcmd[0],
                        "category": mcmd[1],
                        "answers": answers,
                        "by": myName
                    };
                    this.review[this.freeId()] = questionHash;
                    delete this.categoryCache;

                    this.sendMessage(src, "Submitted question!");
                    this.questionsSave();
                    this.sendToTrivReview(src, questionHash);
                }

                this.command_review = function (src, mcmd) {
                    var qid = mcmd[0],
                        keep = on(mcmd[1]);
                    if (!keep) {
                        delete this.review[qid];
                        botAll("Removed question " + qid, trivreview);
                    }
                }
            })();
        }

        Trivia.clearVariables(true);
    },

    // TODO: add mafia
    loadMafia: function () {
    }
})
