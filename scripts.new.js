/*
 ==== SCRIPT INFORMATION ====
 - Maintained by TheUnknownOne -
 - Licensed under GPL 3.0 (LICENSE.txt) -
 - Special Thanks to Lamperi, Mystra, and Intel_iX -

 Release: https://github.com/TheUnknownOne/PO-Server-Tools/master/
 - Has no known errors
 Beta: https://github.com/TheUnknownOne/PO-Server-Tools/beta/
 - Has no obvious errors
 Alpha: https://github.com/TheUnknownOne/PO-Server-Tools/alpha/
 - Has no fatal errors
 Development: https://github.com/TheUnknownOne/PO-Server-Tools/devel/
 - Untested code/sandbox for all other versions

 JSDoc is available at:
 - Release: http://theunknownone.github.com/PO-Server-Tools/jsdoc/release/

 Beta, Alpha, and Development don't have a public JSDoc (make it yourself if you need it)

 - All modules are available in modules/ -
 - All command categories are available in commands/ -

 ==== NOTES ====
 - Dependencies with '*' in front of them are required at runtime -
 - Dependencies with '+' in front of them are optional -

 - Custom types used in JSDoc: -
 - PID: Id or name of a player
 - CID: Id or name of a channel
 - PIDArray: Array of PIDs
 - CIDArray: Array of CIDs
 - !{Type}Array: Array of with any type of variable except {Type}
 */


/**
 * @fileOverview Primary file of TheUnknownOne's Server Script
 * @author TheUnknownOne
 * @version 3.0.0 Alpha 1
 */

/**
 * Script configuration
 * @namespace
 * @type {Object}
 */
Config = {};

/**
 * If Dream World abilities will be checked
 * @type {Boolean}
 */
Config.DWAbilityCheck = true;

/**
 * If the default channels are automatically joined when a player goes on the server
 * @type {Boolean}
 */
Config.AutoChannelJoin = true;

/**
 * If global welcome messages are displayed
 * @type {Boolean}
 */
Config.WelcomeMessages = false;

/**
 * Fixes some crashes caused by PO v2 but changes/breaks some features
 * @type {Boolean}
 */
Config.NoCrash = false;

/**
 * If admins can give and take auth from users and to moderators.
 * @type {Boolean}
 */
Config.AdminsCanAuth = true;

/**
 * Clears logs when logs.txt has the given size in MB or more. NOTE: Doesn't work with current version of PO
 * @type {Number}
 */
// NOTE: Size is in MB now.
Config.ClearLogsAtSize = 35;

/**
 * Characters which can be used to "start" a command with.
 * @type {Array}
 */
Config.CommandStarts = ["/", "!"];

/**
 * Changes that players authority to that level at auth calculations (so an auth with auth level 2 has permissions of auth level 3, but that would not be visible)
 * @type {Object}
 */
Config.PlayerPermissions = {
    "Example player with Config.PlayerPermissions": 3
};

/**
 * Configuration for Mafia
 * @type {Object}
 */
Config.Mafia = {};

/**
 * Amount of different themes that have to be started before one that has been played (norepeat) games ago
 * @type {Number}
 */
Config.Mafia.norepeat = 3;

/**
 * Path to the file where mafia stats will be written to
 * @type {String}
 */
Config.Mafia.stats_file = "Mafia_Stats.json";

/**
 * Maximum length for a player who wants to join mafia
 * @type {Number}
 */
Config.Mafia.max_name_length = 16;

/**
 * Version of the script
 * @type {String}
 */
SCRIPT_VERSION = "3.0.0 Alpha 1";

/**
 * URL from where the modules will be downloaded from
 * @type {String}
 */
URL = "https://raw.github.com/TheUnknownOne/PO-Server-Tools/";

/**
 * Branch to download modules from
 * @type {String}
 */
BRANCH = "alpha";

/**
 * Modules to load
 * @type {Array}
 */
Modules = [
    "modules/jsext.js", "modules/utilities.js", "modules/cache.js", "modules/datahash.js",
    "modules/jsession.js", "modules/users.js", "modules/channels.js", "modules/templates.js",
    "modules/mafia.js"
];

/**
 * Command categories to load
 * @type {Array}
 */

CommandCategories = [
    /* Base for all commands - Required */
    "commands/base.js",

    /* Commands - User */
    "commands/user/fun.js",
    "commands/user/poll.js",
    "commands/user/pokedex.js",

    /* Commands - Admin */
    "commands/admin/ify.js"
];

/**
 * If modules will get overwritten and re-downloaded every time the script reloads (useful for development)
 * @type {Boolean}
 */
OverwriteModules = true;

/**
 * If commands will get overwritten and re-downloaded every time the script reloads (useful for development)
 * @type {Boolean}
 */
OverwriteCommands = true;

/**
 * Contains commands
 * @type {Object}
 */
Commands = {
    /**
     * Object for command lists. Can't be changed by addCommand.
     */
    Lists: {}
};

/**
 * Contains command-defined settings
 * @type {Object}
 */
Settings = {};

/**
 * PO sys object
 * @type {Object}
 */
sys = sys || {};

/**
 * Prints to the server console
 * @type {Function}
 */
print = print || function (msg) {
    sys.sendAll(msg, 0);
};

/**
 * Contains the global object
 * @type {Object}
 */
GLOBAL = this;

/**
 * Contains handlers
 * @namespace
 * @type {Object}
 */
handlers = {};

/**
 * Returns a simple permission handler
 * @param {String} level Auth level for this handler
 * @return {Function} The handler
 */
handlers.permissionHandler = function (level) {
    if (level > 4) {
        level = 4;
    }

    return function (src) {
        if (!sys) {
            return true;
        }
        if (!util || !util.player || !util.player.auth) { // HARDCODED
            return sys.auth(src) >= level;
        }

        return util.player.auth(src) >= level;
    }
};

/**
 * Returns a default handler
 * @param {String} category Auth level for this handler, as string
 * @return {Function|Number} A default handler, or -1 if the category doesn't have a default handler
 */
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

/**
 * Command list manager
 * @constructor
 */
handlers.commandList = function () {
    this.commands = [];

    /**
     * Adds a command to this command list manager (thingy)
     * @param {String} name Command name
     */
    this.add = function (name) {
        if (!this.commands.indexOf(name) === -1) {
            this.commands.push(name);
        }
    };

    return Commands.Lists;
};

/**
 * Adds a command
 * @param {String|Object} name Name of the command, or an object containing all of the parameters for this function
 * @param {Function} handler The actual command
 * @param {Function} [permissionHandler] Permission handler for this command
 * @param {String} [category="0"] Auth category for this command
 * @param {Array} [help=["", ""]] Help message for this command
 * @param {Boolean} [allowedWhenMuted=true] If this command can be used, even when muted
 */
addCommand = function (name, handler, permissionHandler, category, help, allowedWhenMuted) {
    var cmd,
        hash;

    if (arguments.length == 1) {
        cmd = arguments[0];
        if (typeof cmd !== "object") {
            return;
        }

        name = cmd.name,
            handler = cmd.handler,
            category = cmd.category,
            permissionHandler = cmd.permissionHandler,
            category = cmd.category,
            help = cmd.help,
            allowedWhenMuted = cmd.allowedWhenMuted;
    }

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

    if (!permissionHandler) {
        permissionHandler = auth.defaultHandler(category);

        if (permissionHandler == -1) {
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

    hash = {
        "name": name,
        "handler": handler,
        "permissionHandler": permissionHandler,
        "help": help,
        "allowedWhenMuted": allowedWhenMuted
    };

    Commands[name] = hash;
};

/**
 * Includes a file
 * @namespace
 * @param {String} FileName Name of the file to load
 * @param {Number} [GetMethod] GetMethod to be passed to include.get
 * @param {Boolean} [NoCache=false] If the lazy module cache should be bypassed
 * @return {*} Result of include.get
 */
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

            for (x in module.commands) {
                addCommand(module.commands[x]);
            }
        }
    }

    module.source = source || {};
    module.commandModule = commandModule;

    include.modules[FileName] = module;

    return include.get(FileName, GetMethod);
};

if (!include.modules) {
    /**
     * Contains all loaded modules
     * @type {Object}
     */
    include.modules = {};
}

/**
 * GetMethods for include.get
 * @type {Object}
 */
include.GetMethod = {
    "Full": 0,
    "Source": 1,
    "Hooks": 2,
    "Commands": 3,
    "Name": 4,
    "CommandModule": 5
};

/**
 * Extended getter for include.modules. Includes the file when it isn't loaded.
 * @param {String} FileName Name of the file
 * @param {Number} Method A GetMethod. Default is include.GetMethod.Full
 * @return {*} Full module, source, hooks, name, or commands.
 */
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

/**
 * Downloads and writes a file to the disk
 * @param {String} FileName Name for the file when it will be written on the disk
 * @param {String} FilePath Online file path/name of the file
 * @param {Boolean} [ForceDownload=false] If the file will still get downloaded even when it already exists on disk
 * @param {Boolean} [Synchronously=false] If the file will be downloaded synchronously
 * @param {Function} [CallBack] Function called when the async reply is finished (Synchronously has to be false)
 * @return {String} Content of URL + Branch + / + FilePath
 */
download = function (FileName, FilePath, ForceDownload, Synchronously, CallBack) {
    // TODO: Scripts crash in this function. Fix.
    var filePath = FileName.split(/\/|\\/);

    if (sys.getFileContent(FileName) && !ForceDownload) {
        return "";
    }

    if (filePath.length !== 1) {
        /* Creates the directories if they do not yet exist */
        delete filePath[filePath.length - 1];
        sys.makeDir(filePath.filter(function (value, index, array) {
            return !(value === "")
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

/**
 * Gets a list of hooks for an event
 * @param {String} event Name of the event
 * @return {Array} Array of hooks with this name
 */
getHooks = function (event) {
    var ret = [],
        x,
        current_mod,
        Modules = include.modules;

    for (x in Modules) {
        current_mod = Modules[x];
        if (typeof current_mod.hooks[event] !== "undefined") {
            ret.push(current_mod);
        }
    }

    return ret;
};

/**
 * To call all hooks which have the name hook_name
 * @param {String} hook_name Name of the hook
 * @param {*} hook_args Arguments for the hook (everything after the 1st argument)
 * @return {Boolean} If any of the called hooks want to stop the event
 * @example if (call("Example")) { sys.stopEvent(); }
 */
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

/**
 * To call all hooks which have the name hook_name, and returns their result
 * @param {String} hook_name Name of the hook
 * @param {*} hook_args Arguments for the hook (everything after the 1st argument)
 * @return {!BooleanArray} Result returned from the hooks
 */
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
    Modules.forEach(function (value, index, array) {
        download(value, value, OverwriteModules, true);
        include(value, null, OverwriteModules);
    });

    CommandCategories.forEach(function (value, index, array) {
        download(value, value, OverwriteCommands, false, function () {
            include(value, null, OverwriteCommands);
        });
    });
}());

({
    /**
     * When the server starts up
     */
    serverStartUp: function () {
        call("serverStartUp");
        call("beforeNewMessage", "Script Check: OK");
        call("afterNewMessage", "Script Check: OK");

        if (sys.getFileContent("server.lck") === "") {
            Config.NoCrash = true;
            sys.writeToFile("server.crashed", "Delete this file to turn automatic Config.NoCrash off.");
        } else if (sys.getFileContent("server.crashed") !== undefined) {
            Config.NoCrash = true;
        }

        sys.updateDatabase();
    },
    /**
     * When the server shuts down
     */
    serverShutDown: function () {
        call("serverShutDown");

        sys.deleteFile("server.lck");
    },
    /**
     * Before a message gets outputted to the console from stdout
     * @param {String} message Message from stdout
     */
    beforeNewMessage: function (message) {
        if (message === "Script Check: OK") {
            call("beforeNewMessage", message);
            script.init();

            sys.writeToFile("server.lck", "");
        }
    },
    /**
     * After a message is outputted in the console
     * @param {String} message Outputted message
     */
    afterNewMessage: function (message) {
        // NOTE: Possibly add hooks? Might lag the server
    },
    /**
     * When a player logs in (stoppable)
     * @param {Number} src Player id
     */
    beforeLogIn: function (src) {
        if (call("beforeLogIn", src)) {
            sys.stopEvent();
        }
    },
    /**
     * After a player logs in
     * @param {Number} src Player id
     */
    afterLogIn: function (src) {
        call("afterLogIn", src);
    },
    /**
     * When a player logs out
     * @param {Number} src Player id
     */
    beforeLogOut: function (src) {
        call("beforeLogOut", src);
    },
    /**
     * After a player logs out
     * @param {Number} src Player id
     */
    afterLogOut: function (src) {
        call("afterLogOut", src);
    },
    /**
     * When a player changes their team
     * @param {Number} src Player id
     */
    beforeChangeTeam: function (src) {
        call("beforeChangeTeam", src);
    },
    /**
     * After a player changed team
     * @param {Number} src Player id
     */
    afterChangeTeam: function (src) {
        call("afterChangeTeam", src);
    },
    beforePlayerKick: function (src, tar) {
        if (call("beforePlayerKick", src, tar)) {
            sys.stopEvent();
        }
    },
    /**
     * When the server receives a player's chat message (stoppable)
     * @param {Number} src The player's id
     * @param {String} message The message sent
     * @param {Number} chan The id of the channel which this message was sent in
     */
    beforeChatMessage: function (src, message, chan) {
        var command = {},
            commandName,
            fullCommand,
            data = "",
            pos = message.indexOf(' '),
            queryRes,
            auth = sys.maxAuth(sys.ip(src)),
            cmd,
            commandInfo,
            maxAuth = {
                auth: 0,
                index: 0
            },
            mcmd;

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

            queryRes = callResult("commandPlayerAuthRequested", src, message, chan, commandName).forEach(function (auth, index, array) {
                if (auth > maxAuth.auth) {
                    maxAuth = {
                        index: index,
                        auth: auth
                    };
                }
            })[maxAuth.index];

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

                command: command,
                fullCommand: fullCommand
            };

            /* Note: commandInfo with basic components only is passed */
            callResult("commandInfoRequested", src, message, chan, commandInfo).forEach(function (info) {
                commandInfo.extend(info);
            });

            cmd = Commands[commandName];
            if (typeof cmd === "undefined") {
                call("onCommandError", src, fullCommand, chan, "invalid");
                return;
            }
            if (!cmd.permissionHandler(src)) {
                call("onCommandError", src, fullCommand, chan, "nopermission");
                return;
            }
            if (!cmd.allowedWhenMuted && call("allowedWhenMuted", src, command, chan)) {
                call("onCommandError", src, fullCommand, chan, "muted");
                return;
            }

            try {
                cmd(commandInfo);
            } catch (Exception) {
                call("onCommandError", src, fullCommand, chan, "exception", Exception);
            }
        }

        if (call("beforeChatMessage", src, message, chan, false)) {
            sys.stopEvent();
        }
    },
    /**
     * When a channel is about to be deleted (stoppable)
     * @param {Number} chan Channel id
     */
    beforeChannelDestroyed: function (chan) {
        if (call("beforeChannelDestroyed", chan)) {
            sys.stopEvent();
        }
    },
    /**
     * After a channel is destroyed
     * @param {Number} chan Channel id
     */
    afterChannelDestroyed: function (chan) {
        call("afterChannelDestroyed", chan);
    },
    /**
     * When a player joins a channel (stoppable)
     * @param {Number} src Player id
     * @param {Number} chan Channel id
     */
    beforeChannelJoin: function (src, chan) {
        call("beforeChannelJoin", src, chan);
    },
    /**
     * After a player joins a channel
     * @param {Number} src Player id
     * @param {Number} chan Channel id
     */
    afterChannelJoin: function (src, chan) {
        call("afterChannelJoin", src, chan);
    },
    /**
     * When a channel is created (stoppable)
     * @param {Number} chan The id of the channel
     * @param {String} name The name of the channel
     * @param {Number} src The id of the player who created the channel (0 if it was created by the app/script)
     */
    beforeChannelCreated: function (chan, name, src) {
        if (call("beforeChannelCreated", chan, name, src)) {
            sys.stopEvent();
        }
    },
    /**
     * After a channel is created
     * @param {Number} chan The id of the channel
     * @param {String} name The name of the channel
     * @param {Number} src The id of the player who created the channel (0 if it was created by the app/script)
     */
    afterChannelCreated: function (chan, name, src) {
        call("afterChannelCreated", chan, name, src);
    },
    /**
     * Called every second
     */
    step: function () {
        call("step");
    },
    /**
     * When a sys function issues a warning (stoppable, but automatically stopped anyway)
     * @param {String} from The function's name
     * @param {String} warning The warning (message)
     */
    warning: function (from, warning) {
        call("warning", from, warning);

        sys.stopEvent();
    },
    /**
     * When there is a fatal error in scripts.js
     * @param {Error} newScript Error to be formatted
     */
    switchError: function (newScript) {
        call("switchError", newScript);
    },
    /**
     * Initialization function for hooks and core globals
     */
    init: function () {
        ServerName = sys.getFileContent("config").split("\n")[30].substring(5).replace(/\\xe9/i, "é").trim();

        call("init");
    }
})