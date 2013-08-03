/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: events.js
// Defines all events passed to the PO script engine, along with some custom ones.
// Depends on: bot, cache, channel-data, channel-utils, chat-gradient, datahash, jsession, options, player-utils, prune, tier-bans, tours, user, utils, watch-utils, rank-icons, mafia

// Table of Content:

// [sys-evts]: System events
// [evt-loadScript]: loadScript event
// [evt-unloadScript]: loadScript event
// [evt-switchError]: switchError event
// [evt-warning]: warning event
// [evt-serverStartUp]: serverStartUp event
// [evt-serverShutDown]: serverShutDown event
// [evt-init] init event
// [evt-step] step event

// [msg-evts] Message events
// [evt-beforeNewMessage] beforeNewMessage event
// [evt-afterNewMessage] afterNewMessage event
// [evt-beforeChatMessage] beforeChatMessage event
// [evt-afterChatMessage] afterChatMessage event

// [chan-evts]: Channel events
// [evt-beforeChannelCreated]: beforeChannelCreated event
// [evt-afterChannelCreated]: afterChannelCreated event
// [evt-beforeChannelJoin]: beforeChannelJoin event
// [evt-afterChannelJoin] afterChannelJoin event
// [evt-beforeChannelLeave] beforeChannelLeave event
// [evt-afterChannelLeave] afterChannelLeave event
// [evt-beforeChannelDestroyed] beforeChannelDestroyed event
// [evt-afterChannelDestroyed] afterChannelDestroyed event

// [bat-evts]: Battle events
// [evt-beforeFindBattle] beforeFindBattle event
// [evt-afterFindBattle] afterFindBattle event
// [evt-beforeBattleMatchup] beforeBattleMatchup event
// [evt-afterBattleMatchup] afterBattleMatchup event
// [evt-beforeChallengeIssued] beforeChallengeIssued event
// [evt-afterChallengeIssued] afterChallengeIssued event
// [evt-battleSetup] battleSetup event
// [evt-beforeBattleStarted] beforeBattleStarted event
// [evt-afterBattleStarted] afterBattleStarted event
// [evt-beforeBattleEnded] beforeBattleEnded event
// [evt-afterBattleEnded] afterBattleEnded event
// [evt-attemptToSpectateBattle] attemptToSpectateBattle event
// [evt-beforeSpectateBattle] beforeSpectateBattle event
// [evt-afterSpectateBattle] afterSpectateBattle event

// [plyr-evts]: Player events
// [evt-beforeIPConnected] beforeIPConnected event
// [evt-afterIPConnected] afterIPConnected event
// [evt-beforeLogIn] beforeLogIn event
// [evt-afterLogIn] afterLogIn event
// [evt-beforeLogOut] beforeLogOut event
// [evt-afterLogOut] afterLogOut event
// [evt-beforePlayerRegister] beforePlayerRegister event
// [evt-afterPlayerRegister] afterPlayerRegister event
// [evt-beforeNewPM] beforeNewPM event
// [evt-afterNewPM] afterNewPM event
// [evt-beforePlayerAway] beforePlayerAway event
// [evt-afterPlayerAway] afterPlayerAway event
// [evt-beforeChangeTeam] beforeChangeTeam event
// [evt-afterChangeTeam] afterChangeTeam event
// [evt-beforeChangeTier] beforeChangeTier event
// [evt-afterChangeTier] afterChangeTier event
// [evt-beforePlayerKick] beforePlayerKick event
// [evt-afterPlayerKick] afterPlayerKick event
// [evt-beforePlayerBan] beforePlayerBan event
// [evt-afterPlayerBan] afterPlayerBan event

(function () {
    // TODO: Mafia
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
        RankIcons = require('rank-icons'),
        TierBans = require('tier-bans'),
        Tours = require('tours').Tours,
        User = require('user'),
        Utils = require('utils'),
        WatchUtils = require('watch-utils'),
        // Incomplete
        Mafia = require('mafia');
    
    var tourNotification = require('tours').tourNotification;
    
    var Events = {};
    
    // [sys-evts] System events
    
    // [evt-loadScript] loadScript event
    // [Stoppable] Called when: Script is loaded.
    // Currently unused.
    Events.loadScript = function loadScript() {
        if (require.provide("loadScript#start")) {
            sys.stopEvent();
            return;
        }
        
        if (require.provide("loadScript#end")) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-unloadScript] unloadScript event
    // [Unstoppable] Called when: Script is unloaded (changed/updated).
    // Currently unused.
    Events.unloadScript = function unloadScript() {
        require.provide("unloadScript#start");
        require.provide("unloadScript#end");
    };
    
    // [evt-switchError] switchError event
    // [Unstoppable] Called when: An error occured when loading updating the scripts.
    // Currently unused.
    Events.switchError = function switchError(scr) {
        require.provide("switchError#start", scr);
        require.provide("switchError#end", scr);
    };
    
    // [evt-warning] warning event
    // [Stoppable] Called when: A warning is triggered by a sys function.
    // Currently unused.
    Events.warning = function warning(func, message, backtrace) {
        if (require.provide("warning#start", func, message, backtrace)) {
            sys.stopEvent();
            return;
        }
        
        if (require.provide("warning#end", func, message, backtrace)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-serverStartUp] serverStartUp event
    // [Unstoppable] Called when: Server starts up.
    // Sets start up variables and calls event beforeNewMessage.
    Events.serverStartUp = function serverStartUp() {
        require.provide("serverStartUp#start");
        
        Options.isStartingUp = true;
        Options.startUpTime = +(sys.time());
        
        // Call beforeNewMessage with "Script Check: OK".
        // This is not done by the server itself in serverStartUp.
        Utils.callEvent("beforeNewMessage", "Script Check: OK");
        
        require.provide("serverStartUp#end");
    };

    // [evt-serverShutDown] serverShutDown event
    // [Unstoppable] Called when: Server shuts down.
    // Currently unused.
    Events.serverShutDown = function serverShutDown() {
        require.provide("serverShutDown#start");
        require.provide("serverShutDown#end");
    };

    // [evt-init] init event
    // [Unstoppable] Called when: Custom.
    // Initializes certain values.
    Events.init = function init() {
        require.provide("init#start");
        
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
        for (i = 0; i < length; i += 1) {
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
        // TODO: Remove clantag
/*

        ScriptLength = {};
*/
        // Register script recent re-load and register dates.
        Cache.write("scriptRecentLoadDate", date);
        Cache.save("scriptRegisterDate", date);
        
        require.provide("init#end");
    };

    // [evt-step] step event
    // [Unstoppable] Called when: Every second.
    // Handles temporary auth pruning and mafia's tick event.
    // NOTE: Hooks are unavailable for this event.
    Events.step = function step() {
        Options.stepCounter += 1;
        
        // Prune temp auth every 10 seconds.
        if (Options.stepCounter % 10 === 0) {
            Prune.tempAuth();
        }
        
        //Mafia.tickDown();
    };

    // [msg-evts] Message events.
        
    // [evt-beforeNewMessage] beforeNewMessage event
    // [Stoppable] Called when: A message is outputted to stdout.
    // Logs script warnings, errors, gives the server host an eval command, and calls Events.init if the scripts were (re)loaded.
    // NOTE: Hooks are unavailable for this event.
    Events.beforeNewMessage = function beforeNewMessage(message) {
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
            Events.init();
            Utils.scriptUpdateMessage();
            return;
        }

        if (message.substr(0, 33) === "The name of the server changed to") {
            Options.serverName = message.substring(34, message.lastIndexOf("."));
            return;
        }
    };
    
    // [evt-afterNewMessage] afterNewMessage event
    // [Unstoppable] Called when: A message is outputted to stdout.
    // Currently unused.
    // NOTE: Hooks are unavailable for this event.
    Events.afterNewMessage = function afterNewMessage(message) {
    };
    
    // [evt-beforeChatMessage] beforeChatMessage event
    // [Stoppable] Called when: A player sends a chat message.
    // Runs macros, flood checks, commands, silences, mutes, rank icons, chat gradients.
    Events.beforeChatMessage = function beforeChatMessage(src, message, chan) {
        if (require.provide("beforeChatMessage#start", src, message, chan)) {
            sys.stopEvent();
            return;
        }
        
        // Pseudo error for /eval.
        if (sys.channel(chan) === undefined) {
            return "Error: Unknown channel.";
        }
        
        // When the player logs off after they used /future
        if (!sys.loggedIn(src)) {
            return "Error: Player not online.";
        }
        
        // Pseudo error for /eval.
        if (!sys.isInChannel(src, chan)) {
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
        for (i = 0, len = macros.length; i < len; i += 1) {
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
                DataHash.chatSpammers[ip] += 1;
                
                WatchUtils.logPlayerEvent(src, "Flood violation added for '" + ip + "' - now at " + DataHash.chatSpammers[i] + " violations.");
                sys.setTimer(function () {
                    if (DataHash.chatSpammers[ip] > 0) {
                        // remove one violation
                        DataHash.chatSpammers[ip] -= 1;
                    } else {
                        // they only had 1 violation, so simply delete it.
                        delete DataHash.spammers[ip];
                    }
                    
                    WatchUtils.logSystemEvent("Flood violation removed", "A flood violation for '" + ip + "' was removed.");
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
                Bot.sendMessage(src, "This would be allowed: " + message.substr(0, Options.messageCharacterLimit), chan);
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
                
                // Add a full stop/period at the end if there is a character a-z instead, and there is no text other than the characters a-z.
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
        
        if (require.provide("beforeChatMessage#end", src, message, chan)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterChatMessage] afterChatMessage event
    // [Unstoppable] Called when: A player sends a chat message.
    // Currently unused.
    Events.afterChatMessage = function afterChatMessage(src, message, chan) {
        require.provide("afterChatMessage#start", src, message, chan);
        require.provide("afterChatMessage#end", src, message, chan);
    };
    
    // [chan-evts] Channel events
    
    // [evt-beforeChannelCreated] beforeChannelCreated event
    // [Stoppable] Called when: Before a channel will be created.
    // Checks if channels are enabled and creates the JSESSION object of the channel.
    Events.beforeChannelCreated = function beforeChannelCreated(chan, name, src) {
        if (require.provide("beforeChannelCreated#start", chan, name, src)) {
            sys.stopEvent();
            return;
        }
        
        // Prevent players from creating a channel if Config.ChannelsEnabled is false.
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
    
        if (require.provide("beforeChannelCreated#end", chan, name, src)) {
            sys.stopEvent();
            return;
        }
    };

    // [evt-afterChannelCreated] afterChannelCreated event
    // [Unstoppable] Called when: After a channel has been created.
    // Sets channel data stored in ChannelData, and gives creator/auth perms if the channel was created by a player.
    Events.afterChannelCreated = function afterChannelCreated(chan, name, src) {
        require.provide("afterChannelCreated#start", chan, name, src);
        
        var channel = JSESSION.channels(chan);

        // Bail and panic if the channel doesn't exist.
        if (channel === undefined) {
            Utils.panic("events.js", "Events.afterChannelCreated", "JSESSION does not contain channel " + chan + " (" + name + ").", JSESSION.ChannelData, Utils.panic.error);
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
        
        require.provide("afterChannelCreated#end", chan, name, src);
    };
    
    // [evt-beforeChannelJoin] beforeChannelJoin event
    // [Stoppable] Called when: [src] joins the channel [chan].
    // Checks if a player can join [chan] - handling bans, the channel being private, and the channel being restricted (default channels such as Ever Grande City (staff channel)).
    Events.beforeChannelJoin = function beforeChannelJoin(src, chan) {
        if (require.provide("beforeChannelJoin#start", src, chan)) {
            sys.stopEvent();
            return;
        }
        
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
        
        // TODO: Add this
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
        
        if (require.provide("beforeChannelJoin#end", src, chan)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterChannelJoin] afterChannelJoin event
    // [Unstoppable] Called when: After a player joins a channel.
    // Logs the player joining a channel, creates a chatgradient (if the channel has one), and sends them the channel topic and server message of the day (if any).
    Events.afterChannelJoin = function afterChannelJoin(src, chan) {
        require.provide("afterChannelJoin#start", src, chan);
        
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
        
        require.provide("afterChannelJoin#end", src, chan);
    };
    
    // [evt-beforeChannelLeave] beforeChannelLeave event
    // [Stoppable] Called when: A player leaves a channel.
    // Logs the player leaving a channel.
    Events.beforeChannelLeave = function beforeChannelLeave(src, chan) {
        if (require.provide("beforeChannelLeave#start", src, chan)) {
            sys.stopEvent();
            return;
        }
        
        WatchUtils.logPlayerEvent(src, "Left channel " + sys.channel(chan) + " (ID: " + chan + ")");
        
        if (require.provide("beforeChannelLeave#end", src, chan)) {
            sys.stopEvent();
            return;
        }
    };

    // [evt-afterChannelLeave] afterChannelLeave event
    // [Unstoppable] Called when: A player leaves a channel.
    // Currently unused.
    Events.afterChannelLeave = function afterChannelLeave(src, chan) {
        require.provide("afterChannelLeave#start", src, chan);
        require.provide("afterChannelLeave#end", src, chan);
    };
    
    // [evt-beforeChannelDestroyed] beforeChannelDestroyed event
    // [Stoppable] Called when: A channel is deleted.
    // Stops perm/default channels from being destroyed.
    Events.beforeChannelDestroyed = function beforeChannelDestroyed(chan) {
        if (require.provide("beforeChannelDestroyed#start", chan)) {
            sys.stopEvent();
            return;
        }
        
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
        
        if (require.provide("beforeChannelDestroyed#end", chan)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterChannelDestroyed] afterChannelDestroyed event
    // [Unstoppable] Called when: A channel is deleted.
    // Currently unused.
    Events.afterChannelDestroyed = function afterChannelDestroyed(chan) {
        require.provide("afterChannelDestroyed#start", chan);
        require.provide("afterChannelDestroyed#end", chan);
    };
    
    // [bat-evts] Battle events

    // [evt-beforeFindBattle] beforeFindBattle event
    // [Stoppable] Called when: [src] tries to find a battle via the "Find Battle" button.
    // Logs [src] pressing "Find Battle".
    Events.beforeFindBattle = function beforeFindBattle(src) {
        if (require.provide("beforeFindBattle#start", src)) {
            sys.stopEvent();
            return;
        }
        
        WatchUtils.logPlayerEvent(src, "Initiated a Find Battle search.");
        
        if (require.provide("beforeFindBattle#end", src)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterFindBattle] afterFindBattle event
    // [Unstoppable] Called when: [src] tries to find a battle via the "Find Battle" button.
    // Currently unused.
    Events.afterFindBattle = function afterFindBattle(src) {
        require.provide("afterFindBattle#start", src);
        require.provide("afterFindBattle#end", src);
    };
    
    // [evt-beforeBattleMatchup] beforeBattleMatchup event
    // [Stoppable] Called when: A find battle pair is selected.
    // Prevents the battle if they are disabled.
    Events.beforeBattleMatchup = function beforeBattleMatchup(src, tar, clauses, rated, mode) {
        if (require.provide("beforeBattleMatchup#start", src, tar, clauses, rated, mode)) {
            sys.stopEvent();
            return;
        }
        
        if (!Config.BattlesEnabled) {
            Bot.sendMessage(src, "Battles are currently disabled.");
            sys.stopEvent();
            return;
        }
        
        if (require.provide("beforeBattleMatchup#end", src, tar, clauses, rated, mode)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterBattleMatchup] afterBattleMatchup event
    // [Unstoppable] Called when: A find battle pair is selected.
    // Currently unused.
    Events.afterBattleMatchup = function afterBattleMatchup(src, tar, clauses, rated, mode) {
        require.provide("afterBattleMatchup#start", src, tar, clauses, rated, mode);
        require.provide("afterBattleMatchup#end", src, tar, clauses, rated, mode);
    };
    
    // [evt-beforeChallengeIssued] beforeChallengeIssued event
    // [Stoppable] Called when: A player issues a challenge.
    // Prevents challenge spam and ensures the battle is Doubles/Triples if the tier is.
    Events.beforeChallengeIssued = function beforeChallengeIssued(src, tar, clauses, rated, mode, srcTeam, tarTier) {
        if (require.provide("beforeChallengeIssued#start", src, tar, clauses, rated, mode, srcTeam, tarTier)) {
            sys.stopEvent();
            return;
        }
        
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
        
        if ((sys.getClauses(tarTier) % 32 >= 16) && (clauses % 32) < 16) {
            Bot.sendMessage(src, "Challenge Cup must be enabled in the challenge window for a CC battle");
            sys.stopEvent();
            return;
        }

        // Ignore this if challenge cup is enabled.
        if ((clauses % 32) >= 16) {
            return;
        }

        if (!Config.NoCrash) {
            if (mode !== 1 && sys.tier(src, srcTeam).indexOf("Doubles") !== -1 && tar.indexOf("Doubles") !== -1) {
                Bot.sendMessage(src, "To fight in doubles, enable doubles in the challenge window!");
                sys.stopEvent();
                return;
            }
            if (mode !== 2 && sys.tier(src, srcTeam).indexOf("Triples") !== -1 && tar.indexOf("Triples") !== -1) {
                Bot.sendMessage(src, "To fight in triples, enable triples in the challenge window!");
                sys.stopEvent();
                return;
            }
        }
        
        if (require.provide("beforeChallengeIssued#end", src, tar, clauses, rated, mode, srcTeam, tarTier)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterChallengeIssued] afterChallengeIssued event
    // [Unstoppable] Called when: A player issues a challenge.
    // Currently unused.
    Events.afterChallengeIssued = function afterChallengeIssued(src, tar, clauses, rated, mode, srcTeam, tarTier) {
        require.provide("afterChallengeIssued#start", src, tar, clauses, rated, mode, srcTeam, tarTier);
        require.provide("afterChallengeIssued#end", src, tar, clauses, rated, mode, srcTeam, tarTier);
    };
    
    // [evt-battleSetup] battleSetup event
    // [Unstoppable] Called when: A battle is started (used to set up battle effects).
    // Currently unused.
    Events.battleSetup = function battleSetup(src, tar, battleId) {
        require.provide("battleSetup#start", src, tar, battleId);
        require.provide("battleSetup#end", src, tar, battleId);
    };
    
    // [evt-beforeBattleStarted] beforeBattleStarted event
    // [Unstoppable] Called when: A battle has started.
    // Currently unused.
    Events.beforeBattleStarted = function beforeBattleStarted(src, tar, clauses, rated, mode, battleId, srcTeam, tarTeam) {
        require.provide("beforeBattleStarted#start", src, tar, clauses, rated, mode, battleId, srcTeam, tarTeam);
        require.provide("beforeBattleStarted#end", src, tar, clauses, rated, mode, battleId, srcTeam, tarTeam);
    };
    
    // [evt-afterBattleStarted] afterBattleStarted event
    // [Unstoppable] Called when: A battle has started.
    // Makes tours work properly.
    Events.afterBattleStarted = function afterBattleStarted(src, tar, clauses, rated, mode, battleId, srcTeam, tarTeam) {
        require.provide("afterBattleStarted#start", src, tar, clauses, rated, mode, battleId, srcTeam, tarTeam);
        
        // TODO: Add this as a hook.
        var channelIds = sys.channelIds(),
            len = channelIds.length,
            i;

        for (i = 0; i < len; i += 1) {
            Tours.events.afterBattleStarted(src, tar, clauses, rated, mode, battleId, srcTeam, tarTeam, JSESSION.channels(channelIds[i]).tour);
        }
        
        require.provide("afterBattleStarted#end", src, tar, clauses, rated, srcTeam, tarTeam);
    };
    
    // [evt-beforeBattleEnded] beforeBattleEnded event
    // [Unstoppable] Called when: A player issues a challenge.
    // Currently unused.
    Events.beforeBattleEnded = function beforeBattleEnded(winner, loser, result, battleId) {
        require.provide("beforeBattleEnded#start", winner, loser, result, battleId);
        require.provide("beforeBattleEnded#end", winner, loser, result, battleId);
    };
    
    // [evt-afterBattleEnded] afterBattleEnded event
    // [Unstoppable] Called when: A player issues a challenge.
    // Gives the players battle points, makes tours work.
    Events.afterBattleEnded = function afterBattleEnded(winner, loser, result, battleId) {
        require.provide("afterBattleEnded#start", winner, loser, result, battleId);
        
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

        
        for (i = 0; i < len; i += 1) {
            Tours.events.afterBattleStarted(winner, loser, result, JSESSION.channels(channelIds[i]).tour);
        }
        
        require.provide("afterBattleEnded#end", winner, loser, result, battleId);
    };
    
    // [evt-attemptToSpectateBattle] attemptToSpectateBattle event
    // [Semi-unstoppable] Called when: [src] tries to spectate a battle between [battler1] and [battler2].
    // Allows [src] to watch [battler1]'s and [battler2]'s battle if they are currently playing
    // a tournament finals match (even when Disallow Spectators is on).
    Events.attemptToSpectateBattle = function attemptToSpectateBattle(src, battler1, battler2) {
        if (require.provide("attemptToSpectateBattle#start", src, battler1, battler2)) {
            return "allow";
        }
        
        var channelIds = sys.channelIds(),
            length = channelIds.length,
            tour,
            i;

        for (i = 0; i < length; i += 1) {
            // ensure we have an object
            tour = JSESSION.channels(channelIds[i]).tour;
            
            if (!tour) {
                Utils.panic("events.js", "Events.attemptToSpectateBattle", "No tour object exists for channel " + sys.channel(channelIds[i]) + " (" + channelIds[i] + ").", JSESSION.channels(channelIds[i]), Utils.panic.warning);
                continue;
            }
            
            if (tour.finals && Tours.isInTourneyId(battler1, tour) && Tours.isInTourneyId(battler2, tour)) {
                Bot.sendMessage(src, "Enjoy the final match!", tour.id);
                return "allow";
            }
        }
        
        if (require.provide("attemptToSpectateBattle#end", src, battler1, battler2)) {
            return "allow";
        }
    };
    
    // [evt-beforeSpectateBattle] beforeSpectateBattle event
    // [Stoppable] Called when: A player spectates a battle.
    // Currently unused.
    Events.beforeSpectateBattle = function beforeSpectateBattle(src, battler1, battler2) {
        if (require.provide("beforeSpectateBattle#start", src, battler1, battler2)) {
            sys.stopEvent();
            return;
        }
        if (require.provide("beforeSpectateBattle#end", src, battler1, battler2)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterSpectateBattle] afterSpectateBattle event
    // [Unstoppable] Called when: A player spectates a battle.
    // Currently unused.
    Events.afterSpectateBattle = function afterSpectateBattle(src, battler1, battler2) {
        require.provide("afterSpectateBattle#start", src, battler1, battler2);
        require.provide("afterSpectateBattle#end", src, battler1, battler2);
    };
    
    // [plyr-evts] Player Events
    
    // [evt-beforeIPConnected] beforeIPConnected event
    // [Stoppable] Called when: An ip tries to send information to the server (before name, etc. is sent).
    // Currently unused.
    Events.beforeIPConnected = function beforeIPConnected(ip) {
        if (require.provide("beforeIPConnected#start", ip)) {
            sys.stopEvent();
            return;
        }
        if (require.provide("beforeIPConnected#end", ip)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterIPConnected] afterIPConnected event
    // [Unstoppable] Called when: An ip tries to send information to the server (before name, etc. is sent).
    // Currently unused.
    Events.afterIPConnected = function afterIPConnected(ip) {
        require.provide("afterIPConnected#start", ip);
        require.provide("afterIPConnected#end", ip);
    };
    
    // [evt-beforeLogIn] beforeLogIn event
    // [Stoppable] Called when: Before a player logs in.
    // Adds a player's correct name to DataHash, resolves their location, ensures they don't instantly reconnect after being kicked,
    // and that their name doesn't contain characters such as those which make it easy to impersonate a player (cyrillic, greek).
    Events.beforeLogIn = function beforeLogIn(src) {
        if (require.provide("beforeLogIn#start", src)) {
            sys.stopEvent();
            return;
        }
        
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
        
        if (require.provide("beforeLogIn#end", src)) {
            sys.stopEvent();
            return;
        }
    };

    // [evt-afterLogIn] afterLogIn event
    // [Unstoppable] Called when: After a player logs in.
    // Logs the player logging in, sends them welcome messages, updates the most amount of players online, and sends a custom welcome message to everyone (if they have one).
    Events.afterLogIn = function afterLogIn(src) {
        require.provide("afterLogIn#start", src);
        
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

        
        if (DataHash.hasDataProperty("autoIdle", nameLower)) {
            if (DataHash.autoIdle[nameLower].welcomeMessage !== "") {
                Bot.sendAll(DataHash.autoIdle[nameLower].welcomeMessage, 0);
            }
            
            sys.changeAway(src, true);
        }
        
        // This gets called in afterChangeTeam as well.
        User.shared();
        
        require.provide("afterLogIn#end", src);
    };
    
    // [evt-beforeLogOut] beforeLogOut event
    // [Unstoppable] Called when: A player logs out.
    // Logs the player leaving the server, and destroys their JSESSION object.
    Events.beforeLogOut = function beforeLogOut(src) {
        require.provide("beforeLogOut#start", src);
        
        WatchUtils.logPlayerEvent(src, "Logged out.");
        
        if (Config.WelcomeMessages) {
            Bot.sendAll("Goodbye, " + sys.name(src) + "!", 0);
        }
        
        if (Options.ifyInfo.active) {
            delete Options.ifyInfo.names[src];
        }
        
        JSESSION.destroyUser(src);
        
        require.provide("beforeLogOut#end", src);
    };
    
    // [evt-afterLogOut] afterLogOut event
    // Called when: A player logs out.
    // Currently unused.
    Events.afterLogOut = function afterLogOut(src) {
        require.provide("afterLogOut#start", src);
        require.provide("afterLogOut#end", src);
    };
    
    // [evt-beforePlayerRegister] beforePlayerRegister event
    // [Stoppable] Called when: A player registers.
    // Currently unused.
    Events.beforePlayerRegister = function beforePlayerRegister(src) {
        if (require.provide("beforePlayerRegister#start", src)) {
            sys.stopEvent();
            return;
        }
        if (require.provide("beforePlayerRegister#end", src)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterPlayerRegister] afterPlayerRegister event
    // [Unstoppable] Called when: A player registers.
    // Currently unused.
    Events.afterPlayerRegister = function afterPlayerRegister(src) {
        require.provide("afterPlayerRegister#start", src);
        require.provide("afterPlayerRegister#end", src);
    };
    
    // [evt-beforeNewPM] beforeNewPM event
    // [Stoppable] Called when: A player starts a conversation with someone else via Private Messaging.
    // Currently unused.
    Events.beforeNewPM = function beforeNewPM(src) {
        if (require.provide("beforeNewPM#start", src)) {
            sys.stopEvent();
            return;
        }
        if (require.provide("beforeNewPM#end", src)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterNewPM] afterNewPM event
    // [Unstoppable] Called when: A player starts a conversation with someone else via Private Messaging.
    // Currently unused.
    Events.afterNewPM = function afterNewPM(src) {
        require.provide("afterNewPM#start", src);
        require.provide("afterNewPM#end", src);
    };
    
    // [evt-beforePlayerAway] beforePlayerAway event
	// [Stoppable] Called when: A player toggles their away status.
	// Currently unused.
	Events.beforePlayerAway = function beforePlayerAway(src, mode) {
        if (require.provide("beforePlayerAway#start", src, mode)) {
            sys.stopEvent();
            return;
        }
        if (require.provide("beforePlayerAway#end", src, mode)) {
            sys.stopEvent();
            return;
        }
	};
    
    // [evt-afterPlayerAway] afterPlayerAway event
    // [Unstoppable] Called when: A player toggles their away status.
    // Logs the player's away status to Guardtower.
    Events.afterPlayerAway = function afterPlayerAway(src, mode) {
        require.provide("afterPlayerAway#start", src, mode);
        
        WatchUtils.logPlayerEvent(src, (mode ? "Now idling." : "Now active and ready for battles"));
        
        require.provide("afterPlayerAway#end", src, mode);
    };
    
    // [evt-beforeChangeTeam] beforeChangeTeam event
	// [Stoppable] Called when: A player changes their team and/or name.
	// Currently unused.
	Events.beforeChangeTeam = function beforeChangeTeam(src) {
        if (require.provide("beforeChangeTeam#start", src)) {
            sys.stopEvent();
            return;
        }
        if (require.provide("beforeChangeTeam#end", src)) {
            sys.stopEvent();
            return;
        }
	};
    
    // [evt-afterChangeTeam] afterChangeTeam event
    // Called when: A player changes their team and/or name.
    // Adds data of the player's new name (if they changed it) and prevents team change spamming.
    // TODO: Add WatchUtils to afterChangeTeam
    Events.afterChangeTeam = function afterChangeTeam(src) {
        require.provide("afterChangeTeam#start", src);

        var name = sys.name(src),
            nameLower = name.toLowerCase(),
            ip = sys.ip(src),
            userObject = JSESSION.users(src);
        
        User.shared();
        
        userObject.name = name;
        userObject.megauser = DataHash.hasDataProperty("megausers", nameLower);
        userObject.voice = DataHash.hasDataProperty("voices", nameLower);

        userObject.teamChanges += 1;

        if (userObject.teamChanges > 2) {
            // Clear it every 10 seconds.
            sys.setTimer(function () {
                DataHash.teamSpammers[ip] -= 1;
                
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
            userObject.teamChanges -= 1;
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

        require.provide("afterChangeTeam#end", src);
    };

    // [evt-beforeChangeTier] beforeChangeTier event
    // [Stoppable] Called when: A player changes one of their teams' tier.
    // Ensures all the player's teams are valid for the tier they're in.
    Events.beforeChangeTier = function beforeChangeTier(src, team, oldTier, newTier) {
        if (require.provide("beforeChangeTier#start", src, team, oldTier, newTier)) {
            sys.stopEvent();
            return;
        }
        
        if (!TierBans.isLegalTeam(src, team, newtier)) {
            sys.stopEvent();
            Utils.teamAlertMessage(src, team, "Your team is not valid for the " + oldTier + " tier.");
            TierBans.findGoodTier(src, team);
        }
        
        if (require.provide("beforeChangeTier#end", src, team, oldTier, newTier)) {
            sys.stopEvent();
            return;
        }
    };

    // [evt-afterChangeTier] afterChangeTier event
	// [Unstoppable] Called when: A player changes one of their teams' tier.
	// Currently unused.
	Events.afterChangeTier = function afterChangeTier(src, team, oldTier, newTier) {
         require.provide("afterChangeTier#start", src, team, oldTier, newTier);
         require.provide("afterChangeTier#end", src, team, oldTier, newTier);
	};
    
    // [evt-beforePlayerKick] beforePlayerKick event
    // [Stoppable] Called when: A player kicks someone.
    // Ensures the player isn't muted when they kick (if they are, then prevent it), and sends a custom kick message.
    Events.beforePlayerKick = function beforePlayerKick(src, tar) {
        if (require.provide("beforePlayerKick#start", src, tar)) {
            sys.stopEvent();
            return;
        }
        
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
        
        if (require.provide("beforePlayerKick#end", src, tar)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterPlayerKick] afterPlayerKick event
	// [Unstoppable] Called when: A player kicks someone.
	// Currently unused.
	Events.afterPlayerKick = function afterPlayerKick(src, tar) {
        require.provide("afterPlayerKick#start", src, tar);
        require.provide("afterPlayerKick#end", src, tar);
	};
    
    // [evt-beforePlayerBan] beforePlayerBan event
    // [Stoppable] Called when: A player bans someone.
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
    Events.beforePlayerBan = function beforePlayerBan(src, tar, time) {
        if (require.provide("beforePlayerBan#start", src, tar, time)) {
            sys.stopEvent();
            return;
        }
        
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
        
        if (require.provide("beforePlayerBan#end", src, tar, time)) {
            sys.stopEvent();
            return;
        }
    };
    
    // [evt-afterPlayerBan] afterPlayerBan event
	// [Unstoppable] Called when: A player bans someone.
	// Currently unused.
	Events.afterPlayerBan = function afterPlayerBan(src, tar, time) {
        require.provide("afterPlayerBan#start", src, tar, time);
        require.provide("afterPlayerBan#end", src, tar, time);
	};
    
    // Will be added as a command later.
    /*
    

    // TODO: Turn these into commands
    Ify.commands.unify = function (src, commandData, chan) {
        if (!Ify.inIfy) {
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
    };

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

        testMafiaChat = function (src, chan) {
            if (chan == mafiachan && mafia.ticks > 0 && mafia.state != "blank" && mafia.state != "voting" && !mafia.isInGame(sys.name(src)) && hpAuth(src) <= 0) {
                sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to play!", mafiachan);
                return true;
            }
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
        
        BORDER = "<font color='mediumblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</font>";

        

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
        
        lastName = function (ip) {
            var name = DataHash.names[ip];
            if (name == undefined) { // Unknown Player :/
                name = "~Unknown~";
            }

            return name;
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

    
    
    // Now in scripts/pokedex.js
    loadPokemonStats: function () {
        
    },

    // See scripts/utils.js
    loadRequiredUtilities: function () {
    },

    loadCache: function () {
        if (typeof cache == "undefined") {
            cache = new CacheInst("Cache");
        }
        if (typeof playerscache == "undefined") {
            playerscache = new CacheInst("Players");
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
    
    // NOTE: Command stats are no longer available.
    // TODO: add mafia
    loadMafia: function () {
    }*/
    
    return Events;
}());