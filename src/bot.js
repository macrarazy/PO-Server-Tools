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