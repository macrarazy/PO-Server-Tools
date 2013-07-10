/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: events.js
// Defines all events passed to the PO script engine.
// Depends on: bot, cache, channel-data, channel-utils, chat-gradient, datahash, jsession, options, player-utils, prune, tier-bans, tours, user, utils, watch-utils, rank-icons, mafia

// Table of Content:

// [sys-evts]: System events
// [evt-serverStartUp]: serverStartUp event
// [evt-serverShutDown]: serverShutDown event
// [evt-init] init event
// [evt-step] step event

// [msg-evts] Message events
// [evt-beforeNewMessage] beforeNewMessage event
// [evt-beforeChatMessage] beforeChatMessage event

// [chan-evts]: Channel events
// [evt-beforeChannelCreated]: beforeChannelCreated event
// [evt-afterChannelCreated]: afterChannelCreated event
// [evt-beforeChannelJoin]: beforeChannelJoin event
// [evt-afterChannelJoin] afterChannelJoin event
// [evt-beforeChannelLeave] beforeChannelLeave event
// [evt-beforeChannelDestroyed] beforeChannelDestroyed event

// [bat-evts]: Battle events
// [evt-beforeFindBattle] beforeFindBattle event
// [evt-attemptToSpectateBattle] attemptToSpectateBattle event
// [evt-beforeBattleMatchup] beforeBattleMatchup event
// [evt-beforeChallengeIssued] beforeChallengeIssued event
// [evt-afterBattleStarted] afterBattleStarted event
// [evt-afterBattleEnded] afterBattleEnded event

// [plyr-evts]: Player events
// [evt-beforeLogIn] beforeLogIn event
// [evt-afterLogIn] afterLogIn event
// [evt-beforeLogOut] beforeLogOut event
// [evt-afterPlayerAway] afterPlayerAway event
// [evt-afterChangeTeam] afterChangeTeam event
// [evt-beforeChangeTier] beforeChangeTier event
// [evt-beforePlayerKick] beforePlayerKick event
// [evt-beforePlayerBan] beforePlayerBan event

(function () {
    // TODO: Mafia, RankIcons [RankIcons.getIcon]
    var Bot = require('bot'),
        Cache = require('cache').Cache,
        ChannelData = require('channel-data').ChannelData,
        ChannelUtils = require('channel-utils'),
        ChatGradient = require('chat-gradient'),
        DataHash = require('datahash'),
        JSESSION = require('jsession'),
        Options = require('options'),
        PlayerUtils = require('player-utils'),
        Prune = require('prune'),
        TierBans = require('tier-bans'),
        Tours = require('tours').Tours,
        User = require('user'),
        Utils = require('utils'),
        WatchUtils = require('watch-utils'),
        // Incomplete
        RankIcons = require('rank-icons'),
        Mafia = require('mafia');
    
    var tourNotification = require('tours').tourNotification;
    
    var Events = {};
    
    // [sys-evts] System events
    
    // [evt-serverStartUp] serverStartUp event
    // Called when: Server starts up.
    // Sets start up variables and calls event beforeNewMessage.
    Events.serverStartUp = function () {
        Options.isStartingUp = true;
        Options.startUpTime = +(sys.time());
        
        // Call beforeNewMessage with "Script Check: OK".
        // This is not done by the server itself in serverStartUp.
        Utils.callEvent("beforeNewMessage", "Script Check: OK");
    };

    // [evt-serverShutDown] serverShutDown event
    // Called when: Server shuts down.
    // Currently does nothing.
    Events.serverShutDown = function () {
    };

    // [evt-init] init event
    // Called when: Custom.
    // Initializes certain values.
    Events.init = function () {
        var serverLine = sys.getFileContent("config").split("\n")[30],
            defaultChannels = Options.defaultChannels,
            channelIdKeys = Object.keys(Options.defaultChannelIds),
            length = defaultChannels.length,
            chanData = ChannelData.data,
            date = (new Date()).toUTCString(),
            curChan,
            cur,
            i;
        
        Options.serverName = serverLine.substring(5).replace(/\\xe9/i, "é").trim();
        
        // Creates/gets the id of the default channels.
        // NOTE: Very important that this is done in init(). If this is done during (or before) serverStartUp, the server crashes.
        for (i = 0; i < length; ++i) {
            Options.defaultChannelIds[channelIdKeys[i]] = sys.createChannel(defaultChannels[i]) || sys.channelId(defaultChannels[i]);
        }
        
        // Loads old channel data
        // We don't have to worry if the channel has any data saved at all (empty object), that's handled for us. :]
        for (i in chanData) {
            if (chanData.hasOwnProperty(i)) {
                ChannelData.exportData(sys.channelId(i));
            }
        }
        
        // Initialises all cache values.
        Cache.init();

        // Old stuff.
        // TODO: Remove/put in a different module.
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
        // NOTE: DataHash.spammers -> chatSpammers
        // reconnect -> autoReconnectBlock
/*
        if (typeof Clantag === "undefined" || Clantag.full !== ClanTag) {
            Clantag = {};
            Clantag.full = ClanTag;
            Clantag.fullText = removespaces(Clantag.full.replace(/[\[\]\{\}]/gi, ""));
            Clantag.fullTextLower = Clantag.fullText.toLowerCase();
        }

        ScriptLength = {};
*/
        // Register script recent re-load and register dates.
        Cache.write("scriptRecentLoadDate", date);
        Cache.save("scriptRegisterDate", date);
    };

    // [evt-step] step event
    // Called when: Every second.
    // Handles temporary auth pruning and mafia's tick event.
    Events.step = function () {
        Options.stepCounter += 1;
        
        // Prune temp auth every 10 seconds.
        if (Options.stepCounter % 10 === 0) {
            Prune.tempAuth();
        }
        
        //Mafia.tickDown();
    };

    // [msg-evts] Message events.
        
    // [evt-beforeNewMessage] beforeNewMessage event
    // Called when: A message is outputted to stdout.
    // Logs script warnings, errors, gives the server host an eval command, and calls script.init if the scripts were (re)loaded.
    Events.beforeNewMessage = function (message) {
        var result,
            mainChan;
        
        // Don't post any messages from Guardtower here.
        // Guardtower is index 3.
        // Also take out empty messages.
        if (message.substring(0, "[#" + Options.defaultChannelIds.watch + "]".length) === "[#" + Options.defaultChannelIds.watch + "]"
                || message.replace(/^\[#(.*?)\]/, "") === " ") {
            sys.stopEvent();
            return;
        }

        if (message.substring(0, 14) === "Script Warning") {
            WatchUtils.logSystemEvent("Script Warning", message);
            sys.stopEvent();
            return;
        }

        if (message.substring(0, 14) === "~~Server~~: ->") {
            sys.stopEvent();
            print("-> " + message.substring(14));
            
            try {
                result = GLOBAL.eval.call(null, message.substring(14));
            } catch (e) {
                result = Utils.formatError(e);
            }

            print("<- " + result);
            return;
        }

        if (message.substr(0, 2) !== "[#") {
            if (/Script Error line \d+:/.test(message)) {
                WatchUtils.logSystemEvent("Script Error", message);
                return;
            }
        }

        /*
        if (message == "Safe scripts setting changed") {
        if (message == "Logging changed") {
        if (message == "Proxy Servers setting changed") {
        if (message == "Low TCP Delay setting changed") {
        if (message == "Maximum Players Changed.") {
        if (message === "Announcement changed.") {
        if (message === "The description of the server was changed.") {
        */

        // Update the main channel's topic if it's in default mode.
        if (message === "Main channel name changed") {
            mainChan = JSESSION.channels(0);
            
            if (mainChan.defaultTopic) {
                mainChan.topic = "Welcome to " + sys.channel(0) + "!";
                ChannelData.save(0, "topic", mainChan.topic);
            }
            
            return;
        }

        if (message === "Script Check: OK") {
            script.init();
            Utils.scriptUpdateMessage();
            return;
        }

        if (message.substr(0, 33) === "The name of the server changed to") {
            Options.serverName = message.substring(34, message.lastIndexOf("."));
            return;
        }
    };

    // [evt-beforeChatMessage] beforeChatMessage event
    // Called when: Before a player sends a chat message.
    // Runs macros, flood checks, commands, silences, mutes, rank icons, chat gradients.
    Events.beforeChatMessage = function (src, message, chan) {
        // Pseudo error for /eval.
        if (sys.channel(chan) === undefined) {
            sys.stopEvent();
            return "Error: Unknown channel.";
        }
        
        // When the player logs off after they used /future
        if (!sys.loggedIn(src)) {
            return "Error: Player not online.";
        }
        
        // Pseudo error for /eval.
        if (!sys.isInChannel(src, chan)) {
            sys.stopEvent();
            return "Error: Player not in channel.";
        }

        var isServerHost = PlayerUtils.isServerHost(src),
            hasChatGradient = ChatGradient.hasChannel(chan),
            userObject = JSESSION.users(src),
            channelObject = JSESSION.channels(chan),
            playerAuth = PlayerUtils.trueAuth(src),
            playerColor = PlayerUtils.trueColor(src),
            formatName = PlayerUtils.formatName(src),
            playerName = sys.name(src),
            ip = sys.ip(src),
            rankIcon = RankIcons.getIcon(playerAuth);

        var macros = userObject.macros,
            htmlMessage = "",
            mute,
            muteTime,
            len,
            i;
        
        var chatSpammers = DataHash.chatSpammers;
        
        // This is usually triggered if the player has a spam bot running, or something similar.
        // Ensures that they can't post messages after they have (well, supposed to, although it will happen eventually) been floodkicked
        if (userObject.floodCount === "ignore") {
            sys.stopEvent();

            if (sys.loggedIn(src)) {
                PlayerUtils.kickAll(src);
            }

            return "Error: Player kicked.";
        }

        // Give Owner authority to the host if they aren't one.
        if (ip === "127.0.0.1" && playerAuth < 3) {
            sys.changeAuth(src, 3);
        }
        
        // Format the message with the player's macros.
        for (i = 0, len = macros.length; i < len; ++i) {
            message = message.replace(new RegExp("%m" + (i + 1), "g"), macros[i]);
        }

        // If flooding is on, check for violations.
        if (Options.floodCheck) {
            userObject.addFlood();
    
            // Checks if the player is spamming/flooding.
            if (userObject.floodCount >= 8) {
                userObject.floodCount = "ignore";
                sys.stopEvent();
                
                if (!chatSpammers.hasOwnProperty(ip)) {
                    chatSpammers[ip] = 0;
                }
    
                // Give them a violation.
                // One violation is cleared every 30 minutes.
                ++DataHash.chatSpammers[ip];
                
                WatchUtils.logPlayerEvent(src, "Flood violation added for '" + ip + "' - now at " + DataHash.chatSpammers[i] + " violations.");
                sys.setTimer(function () {
                    if (DataHash.chatSpammers[ip] > 0) {
                        // remove one violation
                        --DataHash.chatSpammers[ip];
                    } else {
                        // they only had 1 violation, so simply delete it.
                        delete DataHash.spammers[ip];
                    }
                    
                    WatchUtils.logSystemEvent("Violation removed", "A flood violation for '" + ip + "' was removed.");
                }, 60 * 30);
                
                // After 5 violations, ban them for 1 hour.
                if (DataHash.chatSpammers[ip] >= 5) {
                    WatchUtils.logPlayerEvent(src, "Banned for 1 hour for receiving 5 flood violations.");
                    Bot.sendAll(playerName + " got banned for 1 hour by " + Options.Bot.name + " with reason 'Do not flood the chat'.", chan);
                    
                    PlayerUtils.tempBan({
                        ip: ip,
                        time: 60 * 60
                    });
                    
                    PlayerUtils.kickAll(src);
                    
                    // Remove all their violations.
                    delete DataHash.spammersHash[ip];
                    return;
                } else if (DataHash.chatSpammers[ip] >= 3) {
                    // After the 3th violation, mute them for 10 minutes.
                    // After the 4th violation, mute them for 30 minutes.
                    muteTime = DataHash.chatSpammers[ip] === 3 ? 10 : 30;
                    
                    WatchUtils.logPlayerEvent(src, "Muted for " + muteTime + " minutes for receiving " + DataHash.chatSpammers[ip] + " flood violations.");
                    Bot.sendAll(playerName + " got muted for " + muteTime + " minutes by " + Options.Bot.name + " with reason 'Do not flood the chat'.", chan);
                    
                    PlayerUtils.mute({
                        ip: ip,
                        by: Options.Bot.name,
                        reason: "Do not flood the chat.",
                        time: 60 * muteTime
                    });
                    return;
                } else if (DataHash.chatSpammers[ip] === 1) {
                    // Disconnect (not kick) them for their first violation.
                    WatchUtils.logPlayerEvent(src, "Disconnected for receiving 1 flood violation.");
                                              
                    Bot.sendAll(playerName + " got disconnected by " + Options.Bot.name + " with reason 'Do not flood the chat'.", chan);
                    PlayerUtils.disconnectAll(src);
                    return;
                }
                    
                // Otherwise, simply mute them for 5 minutes (2nd violation)
                WatchUtils.logPlayerEvent(src, "Muted for 5 minutes for receiving 2 flood violations.");
                Bot.sendAll(playerName + " got muted for 5 minutes by " + Options.Bot.name + " with reason 'Do not flood the chat'.", chan);
                
                PlayerUtils.mute({
                    ip: ip,
                    by: Options.Bot.name,
                    reason: "Do not flood the chat.",
                    time: 60 * 5
                });
            }
        }

        // This fancy piece of code here automatically idles a player when it suspects them to go afk.
        if (userObject.autoAFKTime !== -1) {
            if ((+sys.time()) - userObject.autoAFKTime > 15) {
                if (sys.away(src)) {
                    Bot.sendMessage(src, "Welcome back, " + formatName + "!", chan);
                    sys.changeAway(src, false);
                }
                
                userObject.autoAFKTime = -1;
                WatchUtils.logPlayerEvent(src, "Unidled via message.");
            }
        }
        
        if (userObject.autoAFKTime === -1 && !sys.away(src) &&
                (/bbl|brb|berightback|bebacklater|afk|bbs|bebacksoon/i).test(Utils.removeSpaces(message))) {
            Bot.sendMessage(src, "We hope you see you soon, " + formatName + "!", chan);
            sys.changeAway(src, true);
            
            userObject.autoAFKTime = +(sys.time());
            WatchUtils.logPlayerEvent(src, "Idled via message.");
        }

        // Ensures the message has less characters than the messageCharacterLimit.
        // This only applies to Users.
        if (Options.messageCharacterLimit !== -1 && playerAuth <= 0) {
            if (Options.messageCharacterLimit < message.length) {
                Bot.sendMessage(src, "You have " + (message.length - Options.messageCharacterLimit) + " too many characters in your message. Please decrease its size and then try again.", chan);
                
                WatchUtils.logPlayerMessage("Message too long", src, message, chan);
                sys.stopEvent();
                return;
            }
        }

        if (!userObject.voice) {
            if (Options.silence.level > playerAuth) {
                Bot.stfuTruck(src, chan);
                Bot.sendMessage(src, "Respect the almighty silence issued by " + Options.silence.issuer + "!", chan);
                
                WatchUtils.logPlayerMessage("Silenced message", src, message, chan);
                
                sys.stopEvent();
                return;
            }
            if (channelObject.silence.level > ChannelUtils.channelAuth(src, chan)) {
                Bot.stfuTruck(src, chan);
                Bot.sendMessage(src, "Respect the almighty silence issued by " + channelObject.silence.issuer + "!", chan);
                
                WatchUtils.logPlayerMessage("Channel silenced message", src, message, chan);
                
                sys.stopEvent();
                return;
            }
        }

        // Server mute.
        if (!isServerHost && userObject.muted) {
            Prune.mutes();
            
            if (!DataHash.hasDataProperty("mutes", ip)) {
                Bot.sendMessage(src, "You are no longer muted.", chan);
            } else {
                WatchUtils.logPlayerMessage("Muted message", src, message, chan);
                sys.stopEvent();

                mute = DataHash.mutes[ip];
                muteTime = mute.time !== 0 ? Utils.timeToString(mute.time - (+sys.time())) : "forever";
                
                Bot.sendMessage(src, "You are muted by " + mute.by + " for '" + mute.reason + "'. Your mute lasts for " + muteTime + ".", chan);
                return;
            }
        }

        // Channel mute.
        if (!isServerHost && channelObject.isMuted(ip)) {
            Prune.channelMutes(chan);
            
            if (!channelObject.isMuted(ip)) {
                Bot.sendMessage(src, "You are no longer muted in " + sys.channel(chan) + ".", chan);
            } else {
                WatchUtils.logPlayerMessage("Channel muted message", src, message, chan);
                sys.stopEvent();

                mute = channelObject.muteList[ip];
                muteTime = mute.time !== 0 ? Utils.timeToString(mute.time - (+sys.time())) : "forever";
                
                Bot.sendMessage(src, "You are muted by " + mute.by + " in " + sys.channel(chan) + " for '" + mute.reason + "'. Your mute lasts for " + muteTime + ".", chan);
                return;
            }
        }

        // TODO: Options.fixMessage
        if (Options.fixMessage && !Utils.isCommandIndicator(message.charAt(0))) {
            if (message.length > 2) {
                // Capitalize the first character.
                message = message[0].toUpperCase() + message.substring(1);
                
                // Add a full stop at the end if there is a character a-z instead, and there is no text other than the characters a-z.
                if (message.length > 3) {
                    if (/[a-z]/i.test(message.charAt(message.length - 1))
                            && !(/[a-z]/.test(message))) {
                        message += ".";
                    }
                }
            }
        }

        // TODO: Options.rankIcons, Utils.formatMessage
        if (Options.rankIcons) {
            htmlMessage = "<font color='" + (hasChatGradient ? ChatGradient.randomHexColor() : playerColor) + "'" + (hasChatGradient ? " face='" + ChatGradient.randomFont() : "") + "'" + "><timestamp/><b>" + rankIcon + playerName + ":</font></b> " + Utils.formatMessage(src, Utils.escapeHtml(message));
        }

        // Change the name if there's an impersonation.
        if (userObject.impersonation) {
            playerName = userObject.impersonation;
        }

        WatchUtils.logPlayerMessage("Regular message", src, message, chan);

        // We do this to resend the message (so we can modify it).
        sys.stopEvent();
        
        // TODO: Mafia.testChat, Utils.badUnicode
        // Prevents the user from talking if they have been caps muting, are deadtalking in Mafia, or are using bad unicode characters.
        if (Mafia.testChat(src, chan)
                || userObject.capsMute(message, chan)
                || Utils.badUnicode(src, message)) {
            return;
        }

        // Send it globally if it was typed in Guardtower.
        if (chan === Options.defaultChannelIds.watch) {
            // If rank icons or chat gradient is on, send the message with html and bbcode formatting.
            if (Options.rankIcons || hasChatGradient) {
                sys.sendHtmlAll(htmlMessage);
            } else {
                sys.sendAll(playerName + ": " + message);
            }
            return;
        }
        
        // If rank icons or chat gradient is on, send the message with html and bbcode formatting.
        if (Options.rankIcons || hasChatGradient) {
            sys.sendHtmlAll(htmlMessage, chan);
            return;
        }
        
        // Just send the message regulary.
        sys.sendAll(playerName + ": " + message, chan);
    };
    
    // [chan-evts] Channel events
    
    // [evt-beforeChannelCreated] beforeChannelCreated event
    // Called when: Before a channel will be created.
    // Checks if channels are enabled and creates the JSESSION object of the channel.
    Events.beforeChannelCreated = function (chan, name, src) {
        // prevent players from creating a channel if Config.ChannelsEnabled is false.
        if (!Config.ChannelsEnabled && sys.loggedIn(src)) {
            Bot.sendMessage(src, "The creation of channels by players is disabled.");
            sys.stopEvent();
            return;
        }
        
        /*
        if (src != 0 && unicodeAbuse(src, name)) {
            sendFailWhale(src, 0);
            sys.stopEvent();
            return;
        }*/

        JSESSION.createChannel(chan);
    };

    // [evt-afterChannelCreated] afterChannelCreated event
    // Called when: After a channel has been created.
    // Sets channel data stored in ChannelData, and gives creator/auth perms if the channel was created by a player.
    Events.afterChannelCreated = function (chan, name, src) {
        var channel = JSESSION.channels(chan);

        // Bail and panic if the channel doesn't exist.
        if (channel === undefined) {
            Utils.panic("scripts.js", "event[afterChannelCreated]", "JSESSION does not contain channel " + chan + " (" + name + ").", JSESSION.ChannelData, Utils.panic.error);
            return;
        }
        
        ChannelData.exportData(chan);
        
        // if creator is -1 then it was set in beforeChannelCreated, which means the channel was actually created for the first time.
        // also give them auth.
        if (sys.loggedIn(src) && channel.creator === -1) {
            channel.creator = sys.name(src).toLowerCase();
            // TODO: Channel#changeAuth -> ChannelUtils.changeAuth
            channel.changeAuth(src, 3);
        }
    };
    
    // [evt-beforeChannelJoin] beforeChannelJoin event
    // Called when: [src] joins the channel [chan].
    // Checks if a player can join [chan] - handling bans, the channel being private, and the channel being restricted (default channels such as Ever Grande City (staff channel)).
    Events.beforeChannelJoin = function (src, chan) {
        var channelIds = Options.defaultChannelIds,
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
        }

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
*/
        
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
    };
    
    // [evt-afterChannelJoin] afterChannelJoin event
    // Called when: After a player joins a channel.
    // Logs the player joining a channel, creates a chatgradient (if the channel has one), and sends them the channel topic and server message of the day (if any).
    Events.afterChannelJoin = function (src, chan) {
        var channel = JSESSION.channels(chan),
            name = sys.name(src),
            nameLower = name.toLowerCase(),
            user = JSESSION.users(src),
            setterAuth = PlayerUtils.trueAuth(channel.topicSetter);
        
        WatchUtils.logPlayerEvent(src, "Joined channel " + sys.channel(chan) + " (ID " + chan + ")");

        if (ChatGradient.hasChannel(channel)) {
            ChatGradient.refreshPlayer(src, channel);
        }

        sys.sendHtmlMessage(src, "<font color='orange'><timestamp/><b>Topic:</b></font> " + channel.topic, chan);

        if (channel.topicSetter !== "") {
            sys.sendHtmlMessage(src, "<font color='darkorange'><timestamp/><b>Set By:</b></font> " + channel.topicSetter, chan);
        }

        if (Options.motd.enabled) {
            sys.sendHtmlMessage(src, "<font color='red'><timestamp/><b>Message Of The Day:</b></font> " + Options.motd.message, chan);
            sys.sendHtmlMessage(src, "<font color='darkred'><timestamp/><b>Set By:</b></font> " + Options.motd.setter, chan);
        }

        // TODO: Polls
        /*
        if (Poll.mode) {
            botMessage(src, "A poll is going on! Use <font color=green><b>/viewpoll</b></font> for more information.", chan);
        }*/

        // Don't send them a notification if this is the main channel.
        if (channel !== 0) {
            tourNotification(src, channel);
        }
    };
    
    // [evt-beforeChannelLeave] beforeChannelLeave event
    // Called when: Before a player leaves a channel.
    // Logs the player leaving a channel.
    Events.beforeChannelLeave = function (src, chan) {
        WatchUtils.logPlayerEvent(src, "Left channel " + sys.channel(chan) + " (ID: " + chan + ")");
    };

    // [evt-beforeChannelDestroyed] beforeChannelDestroyed event
    // Called when: Before a channel is deleted
    // Stops perm/default channels from being destroyed.
    Events.beforeChannelDestroyed = function (chan) {
        var defaultIds = Options.defaultChannelIds;
        
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
    };
    
    // [bat-evts] Battle events

    // [evt-beforeFindBattle] beforeFindBattle event
    // Called when: [src] tries to find a battle via the "Find Battle" button.
    // Logs [src] pressing "Find Battle".
    Events.beforeFindBattle = function (src) {
        WatchUtils.logPlayerEvent(src, "Initiated a Find Battle search.");
    };
    
    // [evt-attemptToSpectateBattle] attemptToSpectateBattle event
    // Called when: [src] tries to spectate a battle between [battler1] and [battler2].
    // Allows [src] to watch [battler1]'s and [battler2]'s battle if they are currently playing
    // a tournament finals match (even when Disallow Spectators is on).
    Events.attemptToSpectateBattle = function (src, battler1, battler2) {
        var Bot = require('bot'),
            Utils = require('utils'),
            Tours = require('tours').Tours,
            JSESSION = require('jsession').JSESSION;
        
        var channelIds = sys.channelIds(),
            length = channelIds.length,
            tour,
            i;

        for (i = 0; i < length; ++i) {
            // ensure we have an object
            tour = (JSESSION.channels(channelIds[i]) || {tour: "NoTour"}).tour || {tour: "NoTour"};
            
            if (tour === "NoTour") {
                Utils.panic("scripts.js", "event[attemptToSpectateBattle]", "No tour object exists for channel " + sys.channel(channelIds[i]) + " (" + channelIds[i] + ").", JSESSION.channels(channelIds[i]), Utils.panic.warning);
                continue;
            }
            
            if (tour.finals && Tours.isInTourneyId(battler1, tour) && Tours.isInTourneyId(battler2, tour)) {
                Bot.sendMessage(src, "Enjoy the final match!", tour.id);
                return "allow";
            }
        }
    };
    
    // [evt-beforeBattleMatchup] beforeBattleMatchup event
    // Called when: A find battle pair is selected.
    // Prevents the battle if they are disabled.
    Events.beforeBattleMatchup = function (src) {
        if (!Config.BattlesEnabled) {
            Bot.sendMessage(src, "Battles are currently disabled.");
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-beforeChallengeIssued] beforeChallengeIssued event
    // Called when: A player issues a challenge.
    // Prevents challenge spam and ensures the battle is Doubles/Triples if the tier is.
    Events.beforeChallengeIssued = function (src, dest, clauses, rated, mode, team, destTier) {
        var userObject = JSESSION.users(src),
            time = (+sys.time());
        
        if (!Config.BattlesEnabled) {
            Bot.sendMessage(src, "Battles are currently disabled.");
            sys.stopEvent();
            return;
        }

        if (sys.auth(src) < 2 && userObject.lastChallenge !== 0 && (userObject.lastChallenge + 15 - time) > 0) {
            Bot.sendMessage(src, "Please wait " + Utils.timeToString(userObject.lastChallenge + 15 - time) + " before challenging again.");
            sys.stopEvent();
            return;
        }

        userObject.lastChallenge = time;
        
        if ((sys.getClauses(destTier) % 32 >= 16) && (clauses % 32) < 16) {
            Bot.sendMessage(src, "Challenge Cup must be enabled in the challenge window for a CC battle");
            sys.stopEvent();
            return;
        }

        // Ignore this if challenge cup is enabled.
        if ((clauses % 32) >= 16) {
            return;
        }

        if (!Config.NoCrash) {
            if (mode !== 1 && sys.tier(src, team).indexOf("Doubles") !== -1 && destTier.indexOf("Doubles") !== -1) {
                Bot.sendMessage(src, "To fight in doubles, enable doubles in the challenge window!");
                sys.stopEvent();
                return;
            }
            if (mode !== 2 && sys.tier(src, team).indexOf("Triples") !== -1 && destTier.indexOf("Triples") !== -1) {
                Bot.sendMessage(src, "To fight in triples, enable triples in the challenge window!");
                sys.stopEvent();
                return;
            }
        }
    };
    
    // [evt-afterBattleStarted] afterBattleStarted event
    // Called when: Once a battle has started.
    // Makes tours work properly.
    Events.afterBattleStarted = function (src, dest, clauses, rated, srcteam, destteam) {
        var channelIds = sys.channelIds(),
            len = channelIds.length,
            i;

        for (i = 0; i < len; ++i) {
            Tours.events.afterBattleStarted(src, dest, clauses, rated, srcteam, destteam, JSESSION.channels(channelIds[i]).tour);
        }
    };
    
    // [evt-afterBattleEnded] afterBattleEnded event
    // Called when: A player issues a challenge.
    // Gives the players battle points, makes tours work.
    Events.afterBattleEnded = function (winner, loser, result, battleId) {
        var winnerName = sys.name(winner),
            loserName = sys.name(loser),
            winnerLower = winnerName.toLowerCase(),
            loserLower = loserName.toLowerCase(),
            winnerMoney = 0,
            loserMoney = 0,
            channelIds = sys.channelIds(),
            len = channelIds.length,
            i;

        // If the battle wasn't a tie, give/take bp to/from them.
        // Also don't give/take anything from them if they are the same person.
        if (result !== "tie" && sys.ip(winner) !== sys.ip(loser)) {
            var winMoney = sys.rand(50, 81),
                loseMoney = sys.rand(13, 36);

            if (!DataHash.hasDataProperty("battlePoints", winnerLower)) {
                DataHash.battlePoints[winnerLower] = 0;
            }
            
            if (!DataHash.hasDataProperty("battlePoints", loserLower)) {
                DataHash.battlePoints[loserLower] = 0;
            }

            DataHash.battlePoints[winnerLower] += winnerMoney;
            DataHash.battlePoints[loserLower] -= loserMoney;

            if (DataHash.battlePoints[loserLower] < 0) {
                DataHash.battlePoints[loserLower] = 0;
            }
            
            DataHash.save("battlePoints");
            
            Bot.sendMessage(winner, "You won " + winnerMoney + " battle points!");
            Bot.sendMessage(loser, "You lost " + loserMoney + " battle points!");
        }

        
        for (i = 0; i < len; ++i) {
            Tours.events.afterBattleStarted(winner, loser, result, JSESSION.channels(channelIds[i]).tour);
        }
    };
    
    // [plyr-evts] Player Events
    
    // [evt-beforeLogIn] beforeLogIn event
    // Called when: Before a player logs in.
    // Adds a player's correct name to DataHash, resolves their location, ensures they don't instantly reconnect after being kicked,
    // and that their name doesn't contain characters such as those which make it easy to impersonate a player (cyrillic, greek).
    Events.beforeLogIn = function (src) {
        var name = sys.name(src),
            ip = sys.ip(src);

        // Give Owner authority to the host if they aren't one.
        if (ip === "127.0.0.1" && sys.auth(src) < 3) {
            sys.changeAuth(src, 3);
        }

        DataHash.correctNames[name.toLowerCase()] = name;
        DataHash.namesByIp[ip] = name;

        DataHash.save("correctNames");
        DataHash.save("namesByIp");
        
        DataHash.resolveLocation(src, ip);

        // Players will only be in autoReconnectBlock if they were kicked.
        // User.isValid checks for bad unicode characters and the like, as well as ban checking.
        if (DataHash.hasDataProperty("autoReconnectBlock", ip)
                || User.isValid(src) !== "fine") {
            sys.stopEvent();
            return;
        }
    };

    // [evt-afterLogIn] afterLogIn event
    // Called when: After a player logs in.
    // Logs the player logging in, sends them welcome messages, updates the most amount of players online, and sends a custom welcome message to everyone (if they have one).
    Events.afterLogIn = function (src) {
        var name = PlayerUtils.formatName(src),
            plainName = sys.name(src),
            nameLower = plainName.toLowerCase(),
            auth = PlayerUtils.trueAuth(src),
            playersOnline = sys.numPlayers(),
            chanIds = [Options.defaultChannelIds.mafia];
        
        WatchUtils.logPlayerEvent(src, "Logged in with ip '" + sys.ip(src) + "'");

        Bot.sendMessage(src, "Welcome, " + name + "!", 0);
        Bot.sendMessage(src, "Type '<b><font color=green>/commands</font></b>' to see the server commands and '<b><font color=green>/rules</font></b>' to read the server rules.", 0);
        if (Options.startUpTime !== 0) {
            Bot.sendMessage(src, "The server has been up for " + Utils.timeToString(Options.startUpTime) + ".", 0);
        }

        // Update the most players online, if we've hit a new limit
        if (playersOnline > Options.mostPlayersOnline) {
            Options.mostPlayersOnline = playersOnline;
            Cache.write("mostPlayersOnline", playersOnline);
        }

        Bot.sendMessage(src, "<b>" + playersOnline + "</b> players are currently online. The highest amount of players we've ever seen is <b>" + Options.mostPlayersOnlines + "</b>.", 0);

        // Check if they are registered.
        if (!sys.dbRegistered(nameLower)) {
            Bot.sendMessage(src, "You are not registered. Click on the 'Register' button to claim this name. Registration only requires a password.", 0);
        }

        // Notify them about running tournaments
        tourNotification(src, 0);
        
        // Send a white line.
        sys.sendMessage(src, "", 0);

        if (Config.AutoChannelJoin) {
            if (auth > 0 || JSESSION.channels(Options.defaultChannelIds.watch).isChanMod(src)) {
                chanIds.push(Options.defaultChannelIds.watch);
            }

            if (auth > 0 || JSESSION.users(src).megauser || SESSION.channels(Options.defaultChannelIds.staff).isChanMod(src)) {
                chanIds.push(Options.defaultChannelIds.staff);
            }

            if (auth > 1 || JSESSION.channels(Options.defaultChannelIds.eval).isChanMod(src) || Config.evalAccess.indexOf(plainName) !== -1) {
                chanIds.push(Options.defaultChannelIds.eval);
            }
            
            // puts the player in those channels.
            PlayerUtils.pushChannels(src, chanIds);
        }

        
        if (DataHash.hasDataProperty('autoIdle', nameLower)) {
            if (DataHash.autoIdle[nameLower].welcomeMessage !== "") {
                Bot.sendAll(DataHash.autoIdle[nameLower].welcomeMessage, 0);
            }
            
            sys.changeAway(src, true);
        }
        
        // TODO: This needs work.
        
        // This gets called in afterChangeTeam as well.
        User.shared();
        //ify.afterLogIn(src);
    };
    
    // [evt-beforeLogOut] beforeLogOut event
    // Called when: Before a player logs out.
    // Logs the player leaving the server, and destroys their JSESSION object.
    Events.beforeLogOut = function (src) {
        WatchUtils.logPlayerEvent(src, "Logged out.");
        
        if (Config.WelcomeMessages) {
            Bot.sendAll("Goodbye, " + sys.name(src) + "!", 0);
        }
        
        //ify.beforeLogOut(src);
        JSESSION.destroyUser(src);
    };
    
    // [evt-afterPlayerAway] afterPlayerAway event
    // Called when: Once a player toggles their away status.
    // Logs the player's away status to Guardtower.
    Events.afterPlayerAway = function (src, mode) {
        var WatchUtils = require('watch-utils');
        
        WatchUtils.logPlayerEvent(src, (mode ? "Now idling." : "Now active and ready for battles"));
    };

    // [evt-afterChangeTeam] afterChangeTeam event
    // Called when: Once a player changes their team or name.
    // Adds data of the player's new name (if they changed it) and prevents team change spamming.
    // TODO: Add WatchUtils to afterChangeTeam
    Events.afterChangeTeam = function (src) {
        var name = sys.name(src),
            nameLower = name.toLowerCase(),
            ip = sys.ip(src),
            userObject = JSESSION.users(src);
        
        userObject.name = name;
        userObject.megauser = DataHash.hasDataProperty("megausers", nameLower);
        userObject.voice = DataHash.hasDataProperty("voices", nameLower);

        ++userObject.teamChanges;

        if (userObject.teamChanges > 2) {
            // Clear it every 10 seconds.
            sys.setTimer(function () {
                --DataHash.teamSpammers[ip];
                
                // 0 or negative teamSpammers count? Delete it.
                if (!DataHash.teamSpammers[ip]) {
                    delete DataHash.teamSpammers[ip];
                }
            }, 10000, false);
            
            // Don't do anything the first time.
            if (!DataHash.hasDataProperty("teamSpammers", ip)) {
                DataHash.teamSpammers[ip] = 0;
                return;
            } else if (DataHash.teamSpammers[ip] === 0) {
                WatchUtils.logPlayerEvent(src, "Kicked for team change spam under ip '" + ip + "'.");
                PlayerUtils.kick(src);
                
                DataHash.teamSpammers[ip] = 1;
                return;
            }
            
            // Else...
            WatchUtils.logPlayerEvent(src, "Banned for team change spam under ip '" + ip + "'.");
            PlayerUtils.ban(name);
            
            delete DataHash.teamSpammers[ip];
            return;
        }

        DataHash.resolveLocation(src, ip);

        // Clear it every 5 seconds.
        sys.setTimer(function () {
            --userObject.teamChanges;
        }, 5000, false);

        // Everything else //
        WatchUtils.logPlayerEvent(src, "Changed name/team.");

        DataHash.namesByIp[ip] = name;
        DataHash.correctNames[nameLower] = name;
        
        DataHash.save("namesByIp");
        DataHash.save("correctNames");

        if (User.isValid(src) !== "fine") {
            PlayerUtils.kick(src);
            return;
        }

        //ify.afterChangeTeam(src);
    };

    // [evt-beforeChangeTier] beforeChangeTier event
    // Called when: Before a player changes their tier.
    // Ensures all the player's teams are valid for the tier they're in.
    Events.beforeChangeTier = function (src, team, oldtier, newtier) {
        if (!TierBans.isLegalTeam(src, team, newtier)) {
            sys.stopEvent();
            Utils.teamAlertMessage(src, team, "Your team is not valid for the " + newtier + " tier. Appointing another tier for this team...");
            TierBans.findGoodTier(src, team);
        }
    };

    // [evt-beforePlayerKick] beforePlayerKick event
    // Called when: Before a player kicks someone.
    // Ensures the player isn't muted when they kick (if they are, then prevent it), and sends a custom kick message.
    Events.beforePlayerKick = function (src, tar) {
        var playerName = sys.name(src),
            targetName = sys.name(tar),
            ip = sys.ip(src),
            mute = DataHash.mutes[ip],
            muteTime;
        
        sys.stopEvent();

        // If the player is muted, prevent them from kicking.
        if (mute) {
            WatchUtils.logPlayerEvent(src, "Attempted to kick " + targetName + " while muted.");
            
            muteTime = mute.time !== 0 ? Utils.timeToString(mute.time - (+sys.time())) : "forever";
            Bot.sendMessage(src, "You are muted by " + mute.by + " for '" + mute.reason + "'. Your mute lasts for " + muteTime + ".");
            return;
        }

        sys.sendHtmlAll("<font color='midnightblue'><timestamp/><b> " + playerName + " kicked " + targetName + "!</b></font>");
        PlayerUtils.kick(tar);
    };

    // [evt-beforePlayerBan] beforePlayerBan event
    // Called when: Before a player bans someone.
    // Ensures the player isn't muted when they ban (if they are, then prevent it), and sends a custom ban message.
    /* Experiment: tempBan behavior
        To ban: sys.tempBan(name, time_in_minutes);
        To find ban time: sys.dbTempBanTime(name) => time_in_seconds
        To unban: sys.unban(name);
        
        beforePlayerBan(..., ..., time) is a time in minutes.
        
        sys.dbTempBanTime(name) is very unreliable. Only use it if you're sure they're banned (check with sys.banList).
        
        It returns the time in seconds, but only if the player has been banned. Otherwise it returns large numbers such as 4294967206.
        
        tempBan should not use floating point numbers. This can cause weird behavior as well. So, no second bans.
        
        time (in beforePlayerBan) is undefined if the ban isn't a tempBan.
    */
    Events.beforePlayerBan = function (src, tar, time) {
        var playerName = sys.name(src),
            targetName = sys.name(tar),
            ip = sys.ip(src),
            mute = DataHash.mutes[ip],
            muteTime;
        
        sys.stopEvent();

        // If the player is muted, prevent them from banning.
        if (mute) {
            WatchUtils.logPlayerEvent(src, "Attempted to ban " + targetName + " while muted.");
            
            muteTime = mute.time !== 0 ? Utils.timeToString(mute.time - (+sys.time())) : "forever";
            Bot.sendMessage(src, "You are muted by " + mute.by + " for '" + mute.reason + "'. Your mute lasts for " + muteTime + ".");
            return;
        }

        if (time) {
            // Temporary ban.
            // Time is in minutes, and timeToString expects seconds.
            sys.sendHtmlAll("<font color='darkgreen'><timestamp/><b> " + playerName + " banned " + targetName + " for " + Utils.timeToString(time * 60) + "!</b></font>");
            PlayerUtils.tempBan(targetName, time);
        } else {
            // Permanent ban.
            sys.sendHtmlAll("<font color='darkorange'><timestamp/><b> " + playerName + " banned " + targetName + "!</b></font>");
            PlayerUtils.ban(targetName);
        }
    };
    
    // Will be added as a command later.
    /*
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
    */


    // NOTE: script.resolveLocation -> DataHash.resolveLocation
    /*
    loadUtilities: function () {
        // TODO: Change for the next version.
        checkForUpdates = function (noresume) {
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
            sys.callLater("checkForUpdates();", 1800); // 60*30
            updateChecking = true;
        }

        // ScriptUpdateMessage -> Utils.scriptUpdateMessage

        // AuthIMG -> PlayerUtils.statusImage

        // sendSTFUTruck -> Bot.stfuTruck
        // sendFailWhale -> Bot.failWhale

        // sortHash -> Utils.sortObject
        

        // silence -> Options.silence
        
        // ban -> PlayerUtils.ban
        // disconnectAll -> PlayerUtils.disconnectAll
        // kick -> PlayerUtils.kickAll
        
        // massKick -> PlayerUtils.massKick

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
            if (creek.test(m) || armenian.test(m) || dash.test(m) || space.test(m) || cyrillic.test(m) || greek.test(m) || special.test(m) || other.test(m) || zalgo.test(m) || thai.test(m)) {
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

        // putInMultipleChannels -> PlayerUtils.pushChannels
    },

    loadChannelUtilities: function () {
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
                    iconCache[curr.name.toLowerCase()] = curr; // Correct case is stored in the rank icon pack.
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
            if (typeof Poke_Data == 'undefined') { // Only do this once! Takes too much time!
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

                //Lets begin with moves.
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

                // Double checks for multiple moves
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


//We check CC later, as it's a little messy.
//We also will check evos later as some pokes don't have one.

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

                    //Put stuff into an array here.

                    curr_stats = [fstats[x].split(" ")];
                    oldCurrStat = curr_stats[0];
                    spl = fstats[x].split(":");

                    if (spl[1] == undefined) {
                        break;
                    }

                    //First is for formes. Second is missingno check.
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
                    curr_poke_stats = curr_stats[0]; //Egg Groups
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

                    // Done!
                }

                //Parsing evos
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
                    else if (c_entry.length === 3 && c_entry[1] === c_entry[2]) { // Feebas evo bug.
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

                // Done!

                // Checking CC levels
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
    },

    loadCache: function () {
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
            }, 30000); //30 seconds

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

    // TODO: add mafia
    loadMafia: function () {
    }*/
    
    return Events;
}());