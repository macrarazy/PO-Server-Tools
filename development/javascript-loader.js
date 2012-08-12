/* 

To-do List:
ADD: Support for commands.
TEST: Whole script

*/

if (typeof include === "undefined") {
    include = function (FileName, GetMethod) {
        if (include.cache[FileName]) {
            return include.get(FileName, GetMethod);
        }

        var module = {};
        module.file = FileName;
        module.name = FileName.substring(0, FileName.indexOf("."));;
        module.version = SCRIPT_VERSION; // Constant that contains your script version. Can be a number too if you don't want a variable for it. (the variable has to be a number though)
        module.hooks = {};

        var source = {};

        try {
            source = eval(code);
        } catch (Exception) {
            source = {};
            sys.sendAll("Could not include module in file " + FileName + ": " + Exception + " on line " + Exception.lineNumber);
        }

        source["script"] = source;
        source["sys"] = sys;
        source["SESSION"] = SESSION;
        source["gc"] = gc;

        source = include.moduleProperty(source, "Hooks", "object");
        source = include.moduleProperty(source, "Version", "number");
        source = include.moduleProperty(source, "Name", "string");

        if (source["Init"]) {
            source["Init"]();
            delete source["Init"];
        }

        module.source = source;

        include.cache[FileName] = module;
        include.modules.push(module);

        return include.get(FileName, GetMethod);
    }

    include.cache = {};
    include.modules = {};

    include.GetMethod = {
        "Full": 0,
        "Source": 1,
        "Hooks": 2,
        "File": 3,
        "Name": 4,
        "Version": 5
    };

    include.get = function (FileName, Method) {
        if (!include.inCache(FileName)) {
            include(FileName, Method);
            return;
        }

        var query = include.cache[FileName];

        if (Method == include.GetMethod.Full) {
            return query;
        } else if (Method == include.GetMethod.Source) {
            return query.source;
        } else if (Method == include.GetMethod.Hooks) {
            return query.hooks;
        } else if (Method == include.GetMethod.File) {
            return query.file;
        } else if (Method == include.GetMethod.Name) {
            return query.name;
        } else if (Method == include.GetMethod.Version) {
            return query.version;
        } else {
            return query;
        }
    }

    include.fileExists = function (file) {
        return sys.getFileContent(file) != undefined;
    }

    include.moduleProperty = function (module, property, secondary_type) {
        if (typeof module[property] === "function") {
            module[property.toLowerCase()] = module[property]();
            delete module[property];
        } else if (typeof module[property] === secondary_type) {
            module[property.toLowerCase()] = module[property];
            delete module[property];
        }

        return module;
    }

    include.download = function (Location, FileName, Force) {
        if (include.fileExists(FileName) && !Force) {
            return;
        }

        var result = sys.synchronousWebCall(Location);
        sys.writeToFile(FileName, result);

        return result;
    }

    include.update = function (Source, FileName, GetMethod) {
        download(Source, FileName, true);
        delete include.cache[FileName];

        var x, modules = include.modules;
        for (x in modules) {
            if (modules[x].file == FileName) {
                modules.splice(x, 1);
                break;
            }
        }

        return include(FileName, GetMethod);
    }

    gethooks = function (Event) {
        var ret = [],
            x, current_mod, Modules = include.modules;

        for (x in Modules) {
            current_mod = Modules[x];
            if (typeof current_mod.hook[Event] !== "undefined") {
                ret.push(current_mod);
            }
        }

        return ret;
    }

    callplugins = function (hook_args) {
        var args = Array.prototype.slice.call(arguments),
            event = args.splice(0, 1),
            hooks = gethooks(event),
            x, current, stop = false,
            i;

        for (x in hooks) {
            current = hooks[x];
            try {
                if (current.hooks[event].apply(current, args)) {
                    stop = true;
                }
            } catch (Exception) {
                sys.sendAll("Error in module " + current.name + " when calling hook " + event + " with " + args.length + " arguments: " + Exception);
                for (i in args) {
                    print("arguments[" + i + "] = " + args[i]);
                }
            }
        }
    }

}

/* 
-- Modules --

Modules behave the same way as PO script files. 
Don't use script. outside of ({ }). Use this. instead.

Name can be a function (returns the name (string), preferred) or a string.
Version can be a function (returns the version (number), preferred) or a number.
Hooks can be a function (returns the plugins (object), preferred) or an object.

Name, Version, and Hooks are case-sensitive and can be defined in or outside of ({ }) ( Name: "foo" can be put inside ({ }) instead of a function)
include.GetMethod.Full is the default get method.

sys., SESSION., gc(), and script. are available inside ({ }) (probably outside too (except script.), but untested). They are available in the modules global scope.

Examples:
include("script_constants.js", include.GetMethod.Source); // gets the code from ({ }) (global scope)
include("script_constants.js", include.GetMethod.Version); // gets the script version. you might prefer to do include.get
include("script_constants.js", include.GetMethod.Full); // gets the module

*/