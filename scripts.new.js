/*
 ==== SCRIPT INFORMATION ====
 - Maintained by TheUnknownOne -
 - Licensed under GPL 3.0 (LICENSE.txt) -
 - Special Thanks to Lamperi, Mystra, and Intel_iX -

 Release: https://github.com/TheUnknownOne/PO-Server-Tools/master/
 - Has no known bugs
 Beta: https://github.com/TheUnknownOne/PO-Server-Tools/beta/
 - Has no obvious errors
 Alpha: https://github.com/TheUnknownOne/PO-Server-Tools/alpha/
 - Has no fatal errors
 Development: https://github.com/TheUnknownOne/PO-Server-Tools/devel/
 - Untested code/sandbox for all other versions

 JSDoc is available at:
 - Release: http://theunknownone.github.com/PO-Server-Tools/jsdoc/release/
 - Pre-Release (End of Beta stage): http://theunknownone.github.com/PO-Server-Tools/jsdoc/prerelease/

 Beta, Alpha, and Development don't have a public JSDoc (make it yourself if you need it)

 ==== AVAILABLE MODULES ====

 - All modules are available in modules/ -

 - cache.js
 - channels.js
 - datahash.js
 - enum.js
 - jsession.js
 - jsext.js
 - utilities.js

 ==== NOTES ====
 - Dependencies with '*' in front of them are required at runtime -
 - Dependencies with '+' in front of them are optional -

 - Custom types used in JSDoc: -
 - PID: Id or name of a player
 - CID: Id or name of a channel
 */


/**
 * @fileOverview Primary file of TheUnknownOne's Server Script
 * @author TheUnknownOne
 * @version 3.0.0 Devel
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
 * Clears logs when logs.txt has the given size or more. NOTE: Doesn't work with current version of PO
 * @type {Number}
 */
Config.ClearLogsAtSize = 36700160;

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
SCRIPT_VERSION = "3.0.0 Devel";

/**
 * URL from where the modules will be downloaded from
 * @type {String}
 */
URL = "https://raw.github.com/TheUnknownOne/PO-Server-Tools/";

/**
 * Branch to download modules from
 * @type {String}
 */
BRANCH = "devel";

/**
 * Modules to load
 * @type {Array}
 */
// TODO: Add jsession.js, users.js, and channels.js once done
Modules = ["modules/jsext.js", "modules/utilities.js", "modules/enum.js", "modules/cache.js", "modules/datahash.js"];

/**
 * If modules will get overwritten and re-downloaded every time the script reloads (useful for development)
 * @type {Boolean}
 */
OverwriteModules = true;

/**
 * Object which contains commands. Keep it empty!
 * @type {Object}
 */
Commands = {};

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
    return function (src) {
        if (typeof sys == "undefined") {
            return true;
        }
        if (typeof hpAuth == "undefined") {
            return sys.auth(src) >= level;
        }

        return hpAuth(src) >= level;
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
    }

    return -1;
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
    var cmd, hash;

    if (arguments.length == 1) {
        cmd = arguments[0];
        if (typeof cmd !== "object") {
            return;
        }

        name = cmd.name, handler = cmd.handler, category = cmd.category, permissionHandler = cmd.permissionHandler, category = cmd.category, help = cmd.help, allowedWhenMuted = cmd.allowedWhenMuted;
    }

    if (name == undefined) {
        print("module.command.error: Could not add an unknown command. Submit a bug report along with this message if you are (almost) sure this is not a code modification.");
        return;
    }

    if (handler == undefined) {
        print("module.command.error: Could not add command " + name + " because the handler is missing. Submit a bug report along with this message if you are (almost) sure this is not a code modification.");
        return;
    }

    if (category == undefined) {
        category = "0"; // Default
    }

    if (permissionHandler == undefined) {
        permissionHandler = auth.defaultHandler(category);

        if (permissionHandler == -1) {
            print("module.command.error: Could not add command " + name + " because the permission handler was special and not passed. Submit a bug report along with this message if you are (almost) sure this is not a code modification.");
            return;
        }
    }

    if (help == undefined) {
        help = ["", ""];
    }

    if (allowedWhenMuted == undefined) {
        allowedWhenMuted = true;
    }

    hash = {
        "name": name,
        "handler": handler,
        "permissionHandler": permissionHandler,
        "category": category,
        "help": help,
        "allowedWhenMuted": allowedWhenMuted
    };

    Commands[name] = this.commands[name] = hash;
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
    var source = {}, code, module = {};

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
        source = sys.eval(code);
    } catch (Exception) {
        sys.sendAll("Could not include module in file " + FileName + ": " + Exception + " on line " + Exception.lineNumber);
        return;
    }

    if (source.Name) {
        module.name = source.Name();
    }

    if (source.Hooks) {
        module.hooks = source.Hooks();
    }

    if (source.Commands) {
        module.commands = source.Commands();
    }

    module.source = source;

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
    "Name": 4
};

/**
 * Extended getter for include.modules. Includes the file when it isn't loaded.
 * @param {String} FileName Name of the file
 * @param {Number} Method A GetMethod. Default is include.GetMethod.Full
 * @return {*} Full module, source, hooks, name, or commands.
 */
include.get = function (FileName, Method) {
    var query, methods;

    if (typeof include.modules[FileName] === "undefined") {
        include(FileName, Method);
        return;
    }

    query = include.modules[FileName],
        methods = include.GetMethod;

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
    }

    return query;
};

/**
 * Downloads and writes a file to the disk
 * @param {String} FileName Name for the file when it will be written on the disk
 * @param {String} FilePath Online file path/name of the file
 * @param {Boolean} [ForceDownload=false] If the file will still get downloaded even when it already exists on disk
 * @return {String} Content of URL + Branch + / + FilePath
 */
download = function (FileName, FilePath, ForceDownload) {
    var result;

    if (sys.getFileContent(FileName) && !ForceDownload) {
        return "";
    }

    result = sys.synchronousWebCall(URL + BRANCH + "/" + FilePath);
    sys.writeToFile(FileName, result);

    return result;
};

/**
 * Gets a list of hooks for an event
 * @param {String} event Name of the event
 * @return {Array} Array of hooks with this name
 */
getHooks = function (event) {
    var ret = [],
        x, current_mod, Modules = include.modules;

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
        x, current, stop = false,
        i;

    for (x in hooks) {
        current = hooks[x];
        try {
            if (current.hooks[event].apply(current, args)) {
                stop = true;
            }
        } catch (Exception) {
            sys.sendAll('Error in module "' + current.name + '" when calling hook "' + event + '" with ' + args.length + ' arguments on line ' + Exception.lineNumber + ': ' + Exception, arena);
        }
    }

    return stop;
};

/* Downloads and loads all modules in an anonymous function */
(function () {
    var module;
    for (module in Modules) {
        download(Modules[module], Modules[module], OverwriteModules);
        include(Modules[module], null, OverwriteModules);
    }
}());

({
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
    }
})