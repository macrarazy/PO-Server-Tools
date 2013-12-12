JSESSION.identifyScriptAs("<%= script.name %> v<%= script.version %>:#<%= script.build %>");
JSESSION.registerUserFactory(JSESSION.factory.User);
JSESSION.registerChannelFactory(JSESSION.factory.Channel);
//JSESSION.registerGlobalFactory(JSESSION.factory.Global);

Script.poScript = ({
    beforeChatMessage: function (src, message, chan) {
        if (Commands.handle(src, message, chan)) {
            return;
        }
    }
});