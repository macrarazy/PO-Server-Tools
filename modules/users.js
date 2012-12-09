/**
 * @fileOverview User Data Manager
 * @author TheUnknownOne
 * @version 3.0.0 Alpha 1
 */

({
    /**
     * Returns the name of this module
     * @private
     * @return {String}
     */
    Name: function () {
        return "User Data Manager";
    },
    Hooks: function () {
        return {
            "beforeLogIn": function (src) {
                var ip = Umbrella.get("util.player").ip(src),
                    name = Umbrella.get("util.player").name(src),
                    names = DataHash.names;

                Umbrella.get("util.player").hostAuth(src);

                names[ip] = names[name.toLowerCase()] = name;

                Umbrella.get("util.datahash")
                    .write("names")
                    .resolveLocation(src, ip, false);

                if (Umbrella.get("util.player").testName(src)) {
                    util.sandbox.kickedPlayer = src;
                    return true;
                }
            },
            "afterLogIn": function (src) {
                var ip = Umbrella.get("util.player").ip(src),
                    auth = Umbrella.get("util.player").auth(src),
                    sendWelcomeMessage = (Config.WelcomeMessages && (auth < 1 || auth > 3)),
                    numPlayers = sys.numPlayers(),
                    maxPlayersOnline = cache.get("MaxPlayersOnline"),
                    name = sys.name(src).toLowerCase(),
                    idles = DataHash.idles,
                    player = Umbrella.get("util.player").player(src)
                    bot = Umbrella.get("util.bot");

                Umbrella.get("util.watch").player(src, "Log In on IP " + ip);

                
                if (sendWelcomeMessage) {
                    bot.sendOthers(src, player + " joined the server!", 0);
                }

                bot
                    .send(src, "Welcome, " + player + "!", 0)
                    .send(src, "Type in <b><font color='green'>/Commands</font></b> to see the commands and <b><font color='green'>/Rules</font></b> to see the rules.", 0);

                if (util.type(util.time.startup) === "number") {
                    bot.send(src, "The server has been up for " + Umbrella.get("util.time").startUpTime() + "</b>.", 0);
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
                /*
                if (Tours) {
                    Tours.notification(src, 0);
                }*/

                bot.line(src, 0);

                if (idles.has(name)) {
                    if (idles[name].entry) {
                        bot.sendAll(Umbrella.get("util.message").format(idles[name].entry, 2), 0);
                    }
                    sys.changeAway(src, true);
                }

                call("afterChangeTeam", src, true);
            },
            "beforePlayerKick": function (src, tar) {
                var self = JSESSION.users(src),
                    target = JSESSION.users(tar),
                    ip = Umbrella.get("util.player").ip(src),
                    mutes = DataHash.mutes[ip],
                    info = {};

                if (self.muted) {
                    Umbrella.get("util.watch").player(src, null, "Attempted to kick " + target.originalName + " while muted.");

                    if (mutes.time != 0) {
                        info.time = "Muted for " + Umbrella.get("util.time").format(mutes.time.time - +(sys.time()));
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
                    return true;
                }

                sys.sendHtmlAll("<font color='midnightblue'><timestamp/><b> " + self.originalName + " kicked " + target.originalName + "!</b></font>");

                Umbrella.get("util.mod").kickAll(tar);
                return true;
            },
            "beforePlayerBan": function (src, tar) {
                var self = JSESSION.users(src),
                    target = JSESSION.users(tar),
                    ip = Umbrella.get("util.player").ip(src),
                    mutes = DataHash.mutes[ip],
                    info = {};

                if (self.muted) {
                    Umbrella.get("util.watch").player(src, null, "Attempted to ban " + target.originalName + " while muted.");

                    if (mutes.time != 0) {
                        info.time = "Muted for " + Umbrella.get("util.time").format(mutes.time.time - +(sys.time()));
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
                    return true;
                }
                sys.sendHtmlAll("<font color='darkorange'><timestamp/><b> " + self.originalName + " banned " + target.originalName + "!</b></font>");

                Umbrella.get("util.mod").ban(tar);
                return true;
            }
        };
    }
})
