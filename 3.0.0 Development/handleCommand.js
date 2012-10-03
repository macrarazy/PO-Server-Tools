// New handleCommand for 3.0.0
// Assumes in beforeChatMessage along with some utilities.
// Commands is a global variable and contains all of the commands.
if (hasCommandStart(message) && message.length > 1 && !ignoreCommandStart(message)) {
    sys.stopEvent();

    var command = {},
        commandName, fullCommand, data = "",
		pos = message.indexOf(' '),

    if (pos != -1) {
        fullCommand = message.substring(1, pos);
        commandName = fullCommand.toLowerCase();

        data = message.substr(pos + 1);
    }
    else {
        fullCommand = message.substring(1);
        commandName = fullCommand.toLowerCase();
    }

    if (typeof PointerCommands != 'undefined') {
        if (commandName in PointerCommands) {
            commandName = PointerCommands[commandName];
        }
    }

    if (chan == mafiachan) {
        try {
            mafia.handleCommand(src, message.substr(1));
            return;
        }
        catch (err) {
            if (err != "no valid command") {
                botAll(FormatError("A mafia error has occured.", err), mafiachan);

                mafia.endGame(0);
                if (mafia.theme.name != "default") {
                    mafia.themeManager.disable(0, mafia.theme.name);
                }

                return;
            }
        }
    }

    if (commandName != "sendmail") {
        WatchPlayer(src, "Command", message, chan);
    }

    var totalAuth = hpAuth(src),
        auth = totalAuth;

    if (auth > 3) {
        auth = 3;
    }

    if (auth < 0) {
        auth = 0;
    }

    var self = sys.name(src),
        selfLower = sys.name(src).toLowerCase();

    if (commandName == "eval" && DataHash.evalops.has(selfLower)) {
        auth = 3;
    }

    var cmd = Commands[commandName];
    if (typeof cmd == "undefined") {
        invalidCommandMessage(src, fullCommand, chan);
        return;
    }

    if (!cmd.permissionHandler(src)) {
        noPermissionMessage(src, fullCommand, chan);
        return;
    }

    cmd(getFullInfo(src, data, chan, {"command": commandName, "fullCommand": fullCommand}));
}