/*
 Dependencies:
 - modules/jsext.js
 - modules/utilities.js
 - modules/datahash.js
 - modules/jsession.js
 + modules/tours.js
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
                    idles = DataHash.idles,
                    channels,
                    player = util.player.player(src);

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
                    bot.sendOthers(src, player + " joined the server!", 0);
                }

                bot.send(src, "Welcome, " + player + "!", 0);
                bot.send(src, "Type in <b><font color='green'>/Commands</font></b> to see the commands and <b><font color='green'>/Rules</font></b> to see the rules.", 0);

                if (util.type(util.time.startup) === "number") {
                    bot.send(src, "The server has been up for " + util.time.startUpTime() + "</b>.", 0);
                }

                if (numPlayers > maxPlayersOnline) {
                    maxPlayersOnline = numPlayers;
                }

                if (maxPlayersOnline > cache.get("MaxPlayersOnline")) {
                    cache.write("MaxPlayersOnline", maxPlayersOnline, true);
                }

                bot.send(src, "Current amount of players online is <b>" + numPlayers + "</b>. Record is <b>" + maxPlayersOnline + "</b>.", 0);

                if (!sys.dbRegistered(name)) {
                    bot.send(src, "You are not registered. Click on the 'Register' button if you wish to protect your alias. Registration only requires a password.", 0);
                }

                // TODO: Add Tours.notification
                if (Tours) {
                    Tours.notification(src, 0);
                }

                bot.line(src, 0);

                if (idles.has(name)) {
                    if (idles[name].entry) {
                        bot.sendAll(util.message.format(idles[name].entry, 2), 0);
                    }
                    sys.changeAway(src, true);
                }

                // TODO: Add afterChangeTeam hooks that have from:afterLogIn param
                call("afterChangeTeam", src, true);
            },
            "beforePlayerKick": function (src, tar) {
                var self = JSESSION.users(src),
                    target = JSESSION.users(tar),
                    ip = util.player.ip(src),
                    mutes = DataHash.mutes[ip],
                    info = {};

                sys.stopEvent();

                if (self.muted) {
                    util.watch.player(src, null, "Attempted to kick " + target.originalName + " while muted.");

                    if (mutes.time != 0) {
                        info.time = "Muted for " + util.time.format(mutes.time.time - util.time.time());
                    } else {
                        info.time = "Muted forever";
                    }

                    // NOTE: Mute & ban why -> reason
                    info.by = mutes.by,
                        info.reason = mutes.reason;

                    // TODO: Move this to the actual command
                    /*
                        lastChar = why[why.length - 1],
                        lastChars = [".", "?", "!"];

                    if (lastChars.indexOf(lastChar) == -1) {
                        why += ".";
                    }
                    */

                    bot.send(src, "You are muted by " + info.by + ". Reason: " + info.reason + " " + info.time + "!");
                    return;
                }
                sys.sendHtmlAll("<font color='midnightblue'><timestamp/><b> " + self.originalName + " kicked " + target.originalName + "!</b></font>");

                util.mod.kickAll(tar);
            },
            "beforePlayerBan": function (src, tar) {
                var self = JSESSION.users(src),
                    target = JSESSION.users(tar),
                    ip = util.player.ip(src),
                    mutes = DataHash.mutes[ip],
                    info = {};

                sys.stopEvent();

                if (self.muted) {
                    util.watch.player(src, null, "Attempted to ban " + target.originalName + " while muted.");

                    if (mutes.time != 0) {
                        info.time = "Muted for " + util.time.format(mutes.time.time - util.time.time());
                    } else {
                        info.time = "Muted forever";
                    }

                    // NOTE: Mute & ban why -> reason
                    info.by = mutes.by,
                        info.reason = mutes.reason;

                    // TODO: Move this to the actual command
                    /*
                     lastChar = why[why.length - 1],
                     lastChars = [".", "?", "!"];

                     if (lastChars.indexOf(lastChar) == -1) {
                     why += ".";
                     }
                     */

                    bot.send(src, "You are muted by " + info.by + ". Reason: " + info.reason + " " + info.time + "!");
                    return;
                }
                sys.sendHtmlAll("<font color='darkorange'><timestamp/><b> " + self.originalName + " banned " + target.originalName + "!</b></font>");

                util.mod.ban(tar);
            }
        };
    }
})