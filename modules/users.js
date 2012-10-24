/*
 Dependencies:
 - modules/jsext.js
 - modules/utilities.js
 - modules/datahash.js
 - modules/jsession.js
 */

/**
 * @fileOverview User Data Manager
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

/* Extends util with "user" */

if (!util.user) {
    util.user = {
        hostAuth: function (src) {
            var auth = util.player.auth(src);

            if (auth < 3 || auth > 3) {
                return;
            }

            if (!util.user.host(src)) {
                return;
            }

            if (!sys.dbRegistered(util.player.name(src))) {
                return;
            }

            sys.changeAuth(src, 3);
        },
        host: function (src) {
            return util.player.ip(src) === "127.0.0.1";
        }
    };
}

({
    Name: function () {
        return "User Data Manager";
    },
    Hooks: function () {
        return {
            "beforeLogIn": function (src) {
                var ip = util.player.ip(src),
                    name = util.player.name(src),
                    names = DataHash.names;

                util.user.hostAuth(src);

                names[ip] = name;
                names[name.toLowerCase()] = name;

                util.datahash.write("names");
                util.datahash.resolveLocation(src, ip, false);

                if (util.user.testName(src)) {
                    util.sandbox.kickedPlayer = src;
                    return true;
                }
            },
            "afterLogIn": function (src) {
                var ip = util.player.ip(src),
                    auth = util.player.auth(src),
                    sendWelcomeMessage = (Config.WelcomeMessages && (auth < 1 || auth > 3)),
                    numPlayers = sys.numPlayers(),
                    maxPlayersOnline = cache.get("MaxPlayersOnline"),
                    name = sys.name(src).toLowerCase(),
                    idles = DataHash.idles;

                /*
                 var me = player(src),
                 self = JSESSION.users(src),
                 srcToLower = sys.name(src).toLowerCase(),
                 myAuth = sys.auth(src),
                 sendWelcomeMessage = Config.WelcomeMessages && (myAuth < 1 || myAuth > 3),
                 temp = "",
                 pNum = sys.numPlayers();
                 */

                util.watch.player(src, "Log In on IP " + ip);

                if (sendWelcomeMessage) {
                    //TODO: add util.bot.sendAllExcept
                    bot.sendAllExcept(src, me + " joined the server!", 0);
                }

                bot.sendMessage(src, "Welcome, " + me + "!", 0);
                bot.sendMessage(src, "Type in <b><font color='green'>/Commands</font></b> to see the commands and <b><font color='green'>/Rules</font></b> to see the rules.", 0);

                if (util.type(util.time.startup) === "number") {
                    bot.sendMessage(src, "The server has been up for " + util.time.startUpTime() + "</b>.", 0);
                }

                if (numPlayers > maxPlayersOnline) {
                    maxPlayersOnline = numPlayers;
                }

                if (maxPlayersOnline > cache.get("MaxPlayersOnline")) {
                    cache.write("MaxPlayersOnline", maxPlayersOnline, true);
                }

                bot.sendMessage(src, "Current amount of players online is <b>" + numPlayers + "</b>. Record is <b>" + maxPlayersOnline + "</b>.", 0);

                if (!sys.dbRegistered(srcToLower)) {
                    bot.sendMessage(src, "You are not registered. Click on the 'Register' button if you wish to protect your alias. Registration only requires a password.", 0);
                }

                // TODO: Update
                Tours.notification(src, 0);

                sys.sendMessage(src, "", 0);

                // TODO: Update
                if (Config.AutoChannelJoin) {
                    var ChanIds = [mafiachan /*, trivia*/];

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

                if (idles.has(name)) {
                    if (idles[name].entry) {
                        // TODO: Update
                        bot.sendAll(util.format(idles[name].entry, 2), 0);
                    }
                    sys.changeAway(src, true);
                }

                // TODO: Update
                ify.afterLogIn(src);
                // TODO: Update
                //script.afterChangeTeam(src, true);
                call("afterChangeTeam", src, true);
            }
        };
    }
})