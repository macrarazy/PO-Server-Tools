/*
 ==== SCRIPT INFORMATION ====
 - Maintained by TheUnknownOne -
 - Licensed under GPL 3.0 (LICENSE.txt) -
 - Special Thanks to Lamperi, Mystra, and Intel_iX -

 Release: https://github.com/TheUnknownOne/PO-Server-Tools/master/
 - Has no known errors
 Beta: https://github.com/TheUnknownOne/PO-Server-Tools/beta/
 - Has no obvious errors - shouldn't crash
 Alpha: https://github.com/TheUnknownOne/PO-Server-Tools/alpha/
 - Has no fatal errors - can crash
 Development: https://github.com/TheUnknownOne/PO-Server-Tools/devel/
 - Untested code/sandbox for all other versions

 - All modules are available in modules/ -
 - All commands are available in commands/ -
 */

/* Script Configuration */
Config = {};

/* If teams should be checked for Dream World abilities */
Config.DWAbilityCheck = true;

/* If the default channels are automatically joined when a player goes on the server */
Config.AutoChannelJoin = true;

/* If welcome messages should be displayed globally */
Config.WelcomeMessages = false;

/* If admins can give and take auth from users and to moderators. */
Config.AdminsCanAuth = true;

/* Characters which indicate the usage of a command. */
Config.CommandStarts = ["/", "!"];

/* Changes that players authority to that level at auth calculations (so an administrator with a PlayerPermission of 3 can use owner commands, 
 however, they still appear as an administrator) */
Config.PlayerPermissions = {
    "Example player with Config.PlayerPermissions": 3
};

/* Mafia Configuration */
Config.Mafia = {};

/* Amount of different themes that have to be started before one that has been played (norepeat) games ago */
Config.Mafia.norepeat = 3;

/* Path to the file where mafia stats will be written to. */
Config.Mafia.stats_file = "Mafia_Stats.json";

/* Maximum length for a player's name who wants to join a mafia game. */
Config.Mafia.max_name_length = 16;

/* Version of the script. */
SCRIPT_VERSION = "3.0.0 Alpha 1";

/* Data location for modules/commands/languages */
URL = "https://raw.github.com/TheUnknownOne/PO-Server-Tools/";

/* Branch to download modules from. */
BRANCH = "alpha";

/* Mandatory modules. These are required for module runtime 
 NOTE: Will be loaded synchronously */
MandatoryModules = [
    /* Imported */
    "modules/truthy.js",

    "modules/jsext.js",
    
    "modules/utilities.js",
    "modules/cache.js",
    "modules/datahash.js",
    
    "modules/jsession.js",
    "modules/users.js",
    "modules/channels.js",

    "commands/base.js"
];

/* Modules to load
 NOTE: Removing any of these isn't recommended as it might break the script. */
Modules = [
    /* Imported */
    "modules/tlite.js",

    "modules/templates.js", 
    "modules/mafia.js"
];

/* Commands to load
 NOTE: commands/base.js is required */
Commands = [
    /* Commands - User */
    "commands/user/fun.js",
    "commands/user/poll.js",
    "commands/user/pokedex.js",

    /* Commands - Admin */
    "commands/admin/ify.js"
];

/* If modules will get overwritten and re-downloaded every time the script reloads (useful for development). */
OverwriteModules = true;

/* If commands will get overwritten and re-downloaded every time the script reloads (useful for development). */
OverwriteCommands = true;

/* Contains all commands. */
if (typeof CommandHandlers === "undefined") {
    CommandHandlers = {
        /* Object for command lists. */
        _lists: {}
    };
}

/* Contains command/script-defined settings */
Settings = {};

/* PO sys object*/
sys = sys || {};

/* Prints to the server console */
print = print || function (msg) {
    sys.sendAll(msg, 0);
};

/* The global object */
GLOBAL = this;

/* Contains handler functions */
handlers = {};

/* Returns a simple permission handler */
handlers.permissionHandler = function (level) {
    if (level > 4) {
        level = 4;
    }

    return function (src, lev) {
        if (typeof lev === "undefined") {
            lev = level;
        }

        if (!sys) {
            return true;
        }
        if (!util || !util.player || !util.player.auth) { // HARDCODED
            return sys.auth(src) >= lev;
        }

        return util.player.auth(src) >= lev;
    }
};

/* Returns a default permission handler */
handlers.defaultHandler = function (category) {
    if (category === "0") {
        return function () {
            return true;
        }
    } else if (category === "1") {
        return handlers.permissionHandler(1);
    } else if (category === "2") {
        return handlers.permissionHandler(2);
    } else if (category === "3") {
        return handlers.permissionHandler(3);
    } else if (category === "4") {
        return handlers.permissionHandler(4);
    }

    return -1;
};

/* Command List Manager */
handlers.CommandList = function () {
    this.commands = [];

    /**
     * Adds a command to this command list manager
     * @param {String} name Command name
     */
    this.add = function (name) {
        if (!this.commands.indexOf(name) === -1) {
            this.commands.push(name);
        }
    };

    return CommandHandlers._lists;
};

/* Adds a command */
addCommand = function (obj) {
    var name,
        handler,
        category,
        permissionHandler,
        help,
        allowedWhenMuted;

    if (typeof obj !== "object") {
        print("module.command.error: Could not add an unknown command.");
        return;
    }

    name = obj.name;
    handler = obj.handler;
    category = obj.category;
    permissionHandler = obj.permissionHandler;
    help = obj.help;
    allowedWhenMuted = obj.allowedWhenMuted;

    if (!name) {
        print("module.command.error: Could not add an unknown command. Submit a bug report along with this message if you are sure this is not a code modification.");
        return;
    }

    if (!handler) {
        print("module.command.error: Could not add command " + name + " because the handler is missing. Submit a bug report along with this message if you are sure this is not a code modification.");
        return;
    }

    if (category == undefined) {
        category = "0"; // Default
    }

    if (typeof permissionHandler !== "function") {
        permissionHandler = handlers.defaultHandler(category);

        if (permissionHandler === -1) {
            print("module.command.error: Could not add command " + name + " because the permission handler was special and not passed. Submit a bug report along with this message if you are (almost) sure this is not a code modification.");
            return;
        }
    }

    if (!help) {
        help = ["", ""];
    }

    if (allowedWhenMuted == undefined) {
        allowedWhenMuted = true;
    }

    name = name.toLowerCase();

    CommandHandlers[name] = {
        "name": name,
        "handler": handler,
        "permissionHandler": permissionHandler,
        "help": help,
        "allowedWhenMuted": allowedWhenMuted
    };
};

/* Includes a file */
include = function (FileName, GetMethod, NoCache) {
    var source = {},
        code,
        module = {},
        x,
        commandModule = false;

    if (include.modules[FileName] && !NoCache) {
      return include.get(FileName, GetMethod);
    }

    /* Default Values */
    module.file = FileName;
    module.name = FileName.substring(0, FileName.indexOf("."));
    module.hooks = {};
    module.commands = {};

    code = sys.getFileContent(FileName);

    try {
        source = sys.eval.call(GLOBAL, code);
    } catch (Exception) {
        sys.sendAll("Could not include module in file " + FileName + ": " + Exception + " on line " + Exception.lineNumber);
        return;
    }

    if (source) {
        if (source.Name) {
            module.name = source.Name();
        }

        if (module.name.indexOf("Commands - ") !== -1) {
            commandModule = true;
        }

        if (source.Hooks) {
            module.hooks = source.Hooks();
        }

        if (source.Commands) {
            module.commands = source.Commands();

            module.commands.forEach(function (value, index, array) {
                print("adding command " + value.name);
                addCommand(value);
            });
        }
    }

    module.source = source || {};
    module.commandModule = commandModule;

    include.modules[FileName] = module;

    return include.get(FileName, GetMethod);
};

/* Contains all loaded modules */
if (!include.modules) {
    include.modules = {};
}

/* GetMethods for include.get */
include.GetMethod = {
    "Full": 0,
    "Source": 1,
    "Hooks": 2,
    "Commands": 3,
    "Name": 4,
    "CommandModule": 5
};

/* Extended getter for include.modules. Includes the file when it isn't loaded. */
include.get = function (FileName, Method) {
    var query = include.modules[FileName],
        methods = include.GetMethod;

    if (typeof query === "undefined") {
        include(FileName, Method);
        return;
    }

    if (Method === methods.Full) {
        return query;
    } else if (Method === methods.Source) {
        return query.source;
    } else if (Method === methods.Hooks) {
        return query.hooks;
    } else if (Method === methods.Commands) {
        return query.commands;
    } else if (Method === methods.Name) {
        return query.name;
    } else if (Method === methods.CommandModule) {
        return query.commandModule;
    }

    return query;
};

/* Downloads and writes a file to the disk */
download = function (FileName, FilePath, ForceDownload, Synchronously, CallBack) {
    var filePath = FileName.split(/\/|\\/);

    if (sys.getFileContent(FileName) && !ForceDownload) {
        if (typeof CallBack === "function") {
            CallBack();
        }
        return "";
    }

    if (filePath.length !== 1) {
        /* Creates the directories if they do not yet exist */
        delete filePath[filePath.length - 1];
        sys.makeDir(filePath.filter(function (value, index, array) {
            return (value !== "");
        }).join("/"));
    }

    if (Synchronously) {
        sys.writeToFile(FileName, sys.synchronousWebCall(URL + BRANCH + "/" + FilePath));
    } else {
        sys.webCall(URL + BRANCH + "/" + FilePath, function (httpResponse) {
            sys.writeToFile(FileName, httpResponse);

            if (typeof CallBack === "function") {
                CallBack();
            }
        })
    }
};

/* Gets a list of hooks for an event */
getHooks = function (event) {
    var ret = [],
        x,
        current_mod;

    for (x in include.modules) {
        current_mod = include.modules[x];
        if (typeof current_mod.hooks[event] !== "undefined") {
            ret.push(current_mod);
        }
    }

    return ret;
};

/* Calls all hooks which have the given name */
call = function (hook_name, hook_args) {
    var args = [].slice.call(arguments),
        event = args.splice(0, 1)[0],
        hooks = getHooks(event),
        x,
        current,
        stop = false,
        i;

    for (x in hooks) {
        current = hooks[x];
        try {
            if (current.hooks[event].apply(current, args)) {
                stop = true;
            }
        } catch (Exception) {
            sys.sendAll('Error in module "' + current.name + '" (' + current.file + ') when calling hook "' + event + '" with ' + args.length + ' arguments on line ' + Exception.lineNumber + ': ' + Exception);
        }
    }

    return stop;
};

/* Call all hooks which have the given name, and returns their result */
callResult = function (hook_name, hook_args) {
    var args = [].slice.call(arguments),
        event = args.splice(0, 1)[0],
        hooks = getHooks(event),
        x,
        current,
        res = [],
        i,
        currentRes;

    for (x in hooks) {
        current = hooks[x];
        try {
            currentRes = current.hooks[event].apply(current, args);

            if (typeof currentRes !== "boolean" && currentRes != undefined) {
                res.push(currentRes);
            }
        } catch (Exception) {
            sys.sendAll('Error in module "' + current.name + '" (' + current.file + ') when calling hook "' + event + '" with ' + args.length + ' arguments on line ' + Exception.lineNumber + ': ' + Exception);
        }
    }

    return res;
};

/* Downloads and loads all modules and command categories in an anonymous function */
(function () {
    MandatoryModules.forEach(function (value, index, array) {
       download(value, value, OverwriteModules, true);
       include(value, null, OverwriteModules);
    });
    
    Modules.forEach(function (value, index, array) {
        download(value, value, OverwriteModules, false, function () {
            include(value, null, OverwriteModules);
        })
    });
    
    Commands.forEach(function (value, index, array) {
        download(value, value, OverwriteCommands, false, function () {
            include(value, null, OverwriteCommands);
        })
    });
}());

({
    /* Called when the server starts up. */
    serverStartUp: function () {
        call("serverStartUp");
        call("beforeNewMessage", "Script Check: OK");
        call("afterNewMessage", "Script Check: OK");

        sys.updateDatabase();
    },
    /* Called when the server shuts down. */
    serverShutDown: function () {
        call("serverShutDown");

        sys.deleteFile("server.lck");
    },
    /* Called efore a message gets outputted to the console from stdout (stoppable). */
    beforeNewMessage: function (message) {
        if (message === "Script Check: OK") {
            call("beforeNewMessage", message);
            script.init();

            sys.writeToFile("server.lck", "");
        }

        // DEBUG
        if (message.indexOf("~~Server~~:") !== -1) {
            print(sys.eval(message.replace("~~Server~~:", "")));
        }
    },
    /* Called after a message is outputted in the console. */
    afterNewMessage: function (message) {
        // NOTE: Possibly add hooks? Might lag the server
    },
    /* Called when a player logs in (stoppable). */
    beforeLogIn: function (src) {
        if (call("beforeLogIn", src)) {
            sys.stopEvent();
        }
    },
    /* Called after a player logs in. */
    afterLogIn: function (src) {
        call("afterLogIn", src);
    },
    /* Called when a player logs out. */
    beforeLogOut: function (src) {
        call("beforeLogOut", src);
    },
    /* Called after a player logs out. */
    afterLogOut: function (src) {
        call("afterLogOut", src);
    },
    /* Called when a player changes their team. */
    beforeChangeTeam: function (src) {
        call("beforeChangeTeam", src);
    },
    /* Called after a player changed team. */
    afterChangeTeam: function (src) {
        call("afterChangeTeam", src);
    },
    /* Called before a player gets kicked (by player menu->kick) */
    beforePlayerKick: function (src, tar) {
        if (call("beforePlayerKick", src, tar)) {
            sys.stopEvent();
        }
    },
    /* Before a player's chat message is send to the world (stoppable). */
    beforeChatMessage: function (src, message, chan) {
        var command = {},
            commandName,
            fullCommand,
            data = "",
            pos = message.indexOf(' '),
            queryRes,
            auth = sys.maxAuth(util.player.ip(src)),
            cmd,
            commandInfo,
            maxAuth = {
                auth: 0,
                index: 0
            },
            mcmd = [];

        if (call("beforeChatMessage", src, message, chan, true)) {
            sys.stopEvent();
            return;
        }

        /* Command parser */
        if (message.length > 1 && Config.CommandStarts.indexOf(message.charAt(0)) !== -1) {
            sys.stopEvent();

            if (pos !== -1) {
                fullCommand = message.substring(1, pos);
                data = message.substr(pos + 1);
                mcmd = data.split(":");
            } else {
                fullCommand = message.substring(1);
            }

            commandName = fullCommand.toLowerCase();

            if (call("onCommand", src, message, chan, commandName, data)) {
                return;
            }

            queryRes = callResult("commandNameRequested", src, message, chan, commandName).map(function (value) {
                return !!value;
            });
            queryRes = queryRes[queryRes.length - 1];
            /* Last command in the query */

            if (queryRes) {
                commandName = queryRes;
            }

            queryRes = callResult("commandPlayerAuthRequested", src, message, chan, commandName);
            queryRes.forEach(function (auth, index, array) {
                if (auth > maxAuth.auth) {
                    maxAuth = {
                        index: index,
                        auth: auth
                    };
                }
            });
            queryRes = queryRes[maxAuth.index];

            if (queryRes) {
                auth = queryRes;
            }

            if (auth > 3) {
                auth = 3;
            }

            if (auth < 0) {
                auth = 0;
            }

            commandInfo = {
                /* Basic Components */
                src: src,
                tar: sys.id(mcmd[0]),

                data: data,
                dataLower: data.toLowerCase(),
                mcmd: mcmd,

                chan: chan,

                command: commandName,
                fullCommand: fullCommand
            };

            /* Note: commandInfo with basic components only is passed */
            callResult("commandInfoRequested", src, message, chan, commandInfo).forEach(function (info) {
                commandInfo.extend(info);
            });

            cmd = CommandHandlers[commandName];
            if (typeof cmd === "undefined") {
                call("onCommandError", src, fullCommand, chan, "invalid");
                return;
            }
            if (!cmd.permissionHandler(src, auth)) {
                call("onCommandError", src, fullCommand, chan, "nopermission");
                return;
            }
            if (!cmd.allowedWhenMuted && call("allowedWhenMuted", src, command, chan)) {
                call("onCommandError", src, fullCommand, chan, "muted");
                return;
            }

            try {
                cmd.handler(commandInfo);
            } catch (Exception) {
                call("onCommandError", src, fullCommand, chan, "exception", Exception);
            }
        }

        if (call("beforeChatMessage", src, message, chan, false)) {
            sys.stopEvent();
        }
    },
    /* Called when a channel is about to be deleted (stoppable). */
    beforeChannelDestroyed: function (chan) {
        if (call("beforeChannelDestroyed", chan)) {
            sys.stopEvent();
        }
    },
    /* Called after a channel is destroyed. */
    afterChannelDestroyed: function (chan) {
        call("afterChannelDestroyed", chan);
    },
    /* Called when a player joins a channel (stoppable). */
    beforeChannelJoin: function (src, chan) {
        call("beforeChannelJoin", src, chan);
    },
    /* Called after a player joins a channel. */
    afterChannelJoin: function (src, chan) {
        call("afterChannelJoin", src, chan);
    },
    /* Called when a channel is created (stoppable). */
    beforeChannelCreated: function (chan, name, src) {
        if (call("beforeChannelCreated", chan, name, src)) {
            sys.stopEvent();
        }
    },
    /* Called after a channel is created. */
    afterChannelCreated: function (chan, name, src) {
        call("afterChannelCreated", chan, name, src);
    },
    /* Called every second */
    step: function () {
        call("step");
    },
    /* Called when a sys.* function issues a warning (stoppable, but automatically stopped anyway by the script). */
    warning: function (from, warning) {
        call("warning", from, warning);

        sys.stopEvent();
    },
    /* Called when there is a fatal error in scripts.js */
    switchError: function (newScript) {
        call("switchError", newScript);
    },
    /* [Custom] Initialization function for hooks and core globals */
    init: function () {
        //ServerName = sys.getFileContent("config").split("\n")[30].substring(5).replace(/\\xe9/i, "é").trim();

        call("init");
    }
})
