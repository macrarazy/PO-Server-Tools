Commands = {commands: {}, pointers: {}};

Commands.hasCommandStart = function (message) {
    var first = message[0];
    return (first === '/' || first === '!') && message.length > 1;
};

Commands.ignoreCommandStart = function (message) {
    var second = message[1];
    return !((/[a-z]/g).test(second));
};

Commands.register = function (name, handler, minAuth) {
    handler.minAuth = minAuth || 0;
    Commands.commands[name] = handler;
    return Commands;
};

Commands.ptr = function (name, to) {
    Commands.pointers[name] = to;
    return Commands;
};

Commands.handle = function (src, message, chan) {
    var commandInfo = {};
    var pos, perm, cmd;

    if (Commands.hasCommandStart(message) && !Commands.ignoreCommandStart(message)) {
        sys.stopEvent();
        
        pos = message.indexOf(' ');
        
        commandInfo.src     = commandInfo.source = src;
        commandInfo.chan    = commandInfo.channel = chan;
        commandInfo.message = message;
        
        if (pos !== -1) {
            commandInfo.fullCommand = message.substr(1, pos);
            commandInfo.command     = commandInfo.fullCommand.toLowerCase();
            
            commandInfo.data        = message.substr(pos + 1);
            commandInfo.args        = commandInfo.data.split(':');
            commandInfo.dbIp        = sys.dbIp(commandInfo.args[0]);
            commandInfo.dbAuth      = sys.dbAuth(commandInfo.args[0]);
            commandInfo.target      = sys.id(commandInfo.args[0]);
        } else {
            commandInfo.fullCommand = message.substr(1);
            commandInfo.command     = commandInfo.fullCommand.toLowerCase();
            commandInfo.args        = [];
            commandInfo.data =
                commandInfo.dbIp =
                commandInfo.dbAuth  = "";
            commandInfo.target      = 0;
        }

        if (Util.hasOwn(Commands.pointers, commandInfo.command)) {
            commandInfo.command = Commands.pointers[commandInfo.command];
        }

        perm = sys.auth(src);
        if (perm > 3) {
            perm = 3;
        } else if (perm < 0) {
            perm = 0;
        }

        /*if (ch[sys.name(src)] !== undefined && ch[sys.name(src)][0] === sys.auth(src)) {
            op = ch[sys.name(src)][1];
        } // HighPermission

        if (command === "eval" && DataHash.evalops.has(sys.name(src).toLowerCase())) {
            op = 3;
        }*/

        if (!Util.hasOwn(Commands.commands, commandInfo.command)) {
            Bot.invalidCommandMessage(src, commandInfo.fullCommand, chan);
            return true;
        }
        
        // cmd is a function with a 'minAuth' property, so it is callable.
        cmd = Commands.commands[commandInfo.command];
        if (cmd.minAuth > perm) {
            Bot.noPermissionMessage(src, commandInfo.fullCommand, chan);
            return true;
        }
        
        cmd(commandInfo);
        return true;
    }
    
    return false;
};