JSESSION.identifyScriptAs("<%= script.name %> v<%= script.version %>:#<%= script.build %>");
JSESSION.registerUserFactory(JSESSION.factory.User);
JSESSION.registerChannelFactory(JSESSION.factory.Channel);
//JSESSION.registerGlobalFactory(JSESSION.factory.Global);

Script.poScript = ({
    beforeChatMessage: function (src, message, chan) {
        if (Commands.handle(src, message, chan)) {
            return;
        }
    },
    afterLogIn: function (src, chan /* default channel */) {
        chan = sys.channelId(chan);
        
        var self = JSESSION.users(src),
            srcToLower = sys.name(src).toLowerCase(),
            myAuth = sys.auth(src);//,
            //sendWelcomeMessage = Config.WelcomeMessages && (myAuth < 1 || myAuth > 3),
            //temp = "",
            //pNum = sys.numPlayers();

        /*
        WatchEvent(src, "Log In on IP " + sys.ip(src));
        
        
        if (sendWelcomeMessage) {
            botAllExcept(src, me + " joined the server!", 0);
        }*/

        Bot.sendMessage(src, "Welcome, " + Util.player.formatName(src) + "!", chan);
        Bot.sendMessage(src, "Type in <b><font color=green>/commands</font></b> to see the commands and <b><font color=green>/rules</font></b> to see the rules.", chan);
        
        /*
        if (typeof startupTime === 'number' && !isNaN(startupTime)) {
            botMessage(src, "The server has been up for " + startUpTime() + "</b>.", 0);
        }

        if (pNum > maxPlayersOnline) {
            maxPlayersOnline = pNum;
        }

        if (maxPlayersOnline > cache.get("MaxPlayersOnline")) {
            cache.write("MaxPlayersOnline", maxPlayersOnline);
        }

        Bot.sendMessage(src, "Current amount of players online is <b>" + pNum + "</b>. Record is <b>" + maxPlayersOnline + "</b>.", chan);
        */
        
        if (!sys.dbRegistered(srcToLower)) {
            Bot.sendMessage(src, "You are not registered. Click on the 'Register' button if you wish to protect your alias. Registration only requires a password.", chan);
        }

        /*
        TourNotification(src, 0);
        sys.sendMessage(src, "", 0);
        
        if (Config.AutoChannelJoin) {
            var ChanIds = [mafiachan];

            if (sys.auth(src) > 0 || JSESSION.channels(watch).isChanMod(src)) {
                ChanIds.push(watch);
            }

            if (self.megauser || sys.auth(src) > 0 || JSESSION.channels(staffchannel).isChanMod(src)) {
                ChanIds.push(staffchannel);
            }

            if (sys.auth(src) > 1 || JSESSION.channels(scriptchannel).isChanMod(src) || DataHash.evalops.has(srcToLower)) {
                ChanIds.push(scriptchannel);
            }

            putInMultipleChannels(src, ChanIds);
        }

        if (DataHash.idles.has(srcToLower)) {
            if (DataHash.idles[srcToLower].entry !== "") {
                botAll(format("lvl2", DataHash.idles[srcToLower].entry), 0);
            }
            sys.changeAway(src, true);
        }

        ify.afterLogIn(src);
        script.afterChangeTeam(src, true);*/
    }
});