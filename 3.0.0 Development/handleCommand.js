// New handleCommand for 3.0.0
// Assumes in beforeChatMessage along with some utilities.
// Commands is a global variable and contains all of the commands.
if (hasCommandStart(message) && message.length > 1 && !ignoreCommandStart(message)) {
    sys.stopEvent();

    var command = {},
        commandName, fullCommand, data = "";
    mcmd = [""], pos = message.indexOf(' '),

    if (pos != -1) {
        fullCommand = message.substring(1, pos);
        commandName = fullCommand.toLowerCase();

        data = message.substr(pos + 1);
        mcmd = commandData.split(':');
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

    if (commandName != "spam" && commandName != "sendmail") {
        WatchPlayer(src, "Command", message, chan);
    }

    if (commandName == "spam") {
        WatchEvent(src, "Spammed " + sys.name(tar) + ".", chan);
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

    // Construct command - TODO: Add these ontop of beforeChatMessage (the variables)?
    command = {
        "src": src,
        "self": self,
        "selfLower": selfLower,
        "selfPlayer": player(src),
        "user": JSESSION.users(src),
        "auth": totalAuth,

        "data": data,
        "dataLower": data.toLowerCase(),

        "chan": chan,
        "channel": JSESSION.channels(chan),

        "mcmd": mcmd,

        "tar": sys.id(mcmd[0]),
        "tarName": sys.name(tar),
        "tarLower": tarName.toLowerCase(),
        "tarPlayer": player(tar),
        "target": JSESSION.users(tar),
        "ip": sys.dbIp(mcmd[0]),

        "command": commandName,
        "fullCommand": fullCommand,

        "escape": html_escape,

        "sendMessage": function (message) {
            botMessage(src, message, chan);
        },
        "sendAll": function (message) {
            botAll(message, chan);
        },
        "sendOthers": function (message) {
            botAllExcept(src, message, chan, botAllExcept.Normal);
        },

        "sendWhite": function () {
            sys.sendMessage(src, "", chan);
        },
        "sendWhiteAll": function () {
            sys.sendAll("", chan);
        },

        "sendMain": function (message) {
            botAll(message, 0);
        },

        nativeSend: sys.sendAll,
        nativeHtml: sys.sendHtmlAll

    };
	
    if (command != "spam") {
        CommandStats.write(fullCommand.toLowerCase(), sys.name(src));
    }
}