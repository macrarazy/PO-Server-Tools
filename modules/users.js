/* User Manager */

({
    Name: function () {
        return "User Manager";
    },
    Hooks: function () {
        return {
            "beforeLogIn": function (src) {
                var ip = util.player.ip(src),
                    name = util.player.name(src);

                util.player.hostAuth(src);

                DataHash.names[ip] = DataHash.names[name.toLowerCase()] = name;

                util.datahash
                    .write("names")
                    .resolveLocation(src, ip, false);

                if (util.player.testName(src)) {
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
                    player = util.player.player(src);

                util.watch.player(src, "Using IP " + ip, "Logged In");

                
                if (sendWelcomeMessage) {
                    bot.sendOthers(src, player + " joined the server!", 0);
                }

                bot
                    .send(src, "Welcome, " + player + "!", 0)
                    .send(src, "Type in <b><font color='green'>/Commands</font></b> to see the commands and <b><font color='green'>/Rules</font></b> to see the rules.", 0);

                if (Truthy.isNumber(util.time.startup)) {
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
                /*
                if (Tours) {
                    Tours.notification(src, 0);
                }*/

                bot.line(src, 0);

                if (DataHash.idles.has(name)) {
                    if (DataHash.idles[name].entry) {
                        bot.sendAll(util.message.format(DataHash.idles[name].entry, 0), 0);
                    }
                    sys.changeAway(src, true);
                }

                call("afterChangeTeam", src, true);
            },
            "beforePlayerKick": function (src, tar) {
                var self = JSESSION.users(src),
                    target = JSESSION.users(tar),
                    ip = util.player.ip(src),
                    mutes = DataHash.mutes[ip],
                    info = {};

                if (self.muted) {
                    util.watch.player(src, null, "Attempted to kick " + target.originalName + " while muted.");

                    if (mutes.time != 0) {
                        info.time = "Muted for " + util.time.format(mutes.time.time - util.time.time());
                    } else {
                        info.time = "Muted forever";
                    }

                    // NOTE: Mute & ban why -> reason
                    info.by = mutes.by;
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

                util.mod.kickAll(tar);
                return true;
            },
            "beforePlayerBan": function (src, tar) {
                var self = JSESSION.users(src),
                    target = JSESSION.users(tar),
                    ip = util.player.ip(src),
                    mutes = DataHash.mutes[ip],
                    info = {};

                if (self.muted) {
                    util.watch.player(src, null, "Attempted to ban " + target.originalName + " while muted.");

                    if (mutes.time != 0) {
                        info.time = "Muted for " + util.time.format(mutes.time.time - util.time.time());
                    } else {
                        info.time = "Muted forever";
                    }

                    // NOTE: Mute & ban why -> reason
                    info.by = mutes.by;
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

                util.mod.ban(tar);
                return true;
            }
        };
    }
})
