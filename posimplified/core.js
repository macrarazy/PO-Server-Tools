/** core.js **/
/** All functions created by TheUnknownOne unless specified. **/

_PO = function (path, ini_file) {
    this.includedModules = new Array();
    this.skippedModules = new Array();
    this.moduleDefaultName = "Unknown Module";

    /****** Startup Functions ******/

    this.Error = function (mess, e) {
        if(typeof mess != "string")
            mess = "";

        if(mess != "" && mess[mess.length-1] != "." && mess[mess.length-1] != "!"
                && mess[mess.length-1] != "?")
            mess += ".";

        var lineData = e.lineNumber == 1 ? "" : " on line "+e.lineNumber;
        var msg = e.message;
        var type = e.name;

        var str = type+lineData+": "+msg+".";


        return mess+" "+str;
    }

    this.testPath = function (path) {
        if(path != "" && path[path.length-1] != "/") {
            path += "/";
        }
        return path;
    }

    this.includeModule = function (module_path, module_file, _name, _function) {
        path = this.testPath(path);

        var content = sys.getFileContent(module_path+module_file);
        _name = _name == undefined ? this.moduleDefaultName : _name;

        try {
            eval(content);
        }
        catch(e) {
            var str = "PO Simplified Runtime Error: Cannot run module "+_name+" ("+module_path+module_file+").";
            print(this.Error(str, e));
        }

        var pushArray = [module_path, module_file, _name];

        if(_function)
            pushArray.push(content);
        else
            pushArray.push("");

        this.includedModules.push(pushArray);

        if(_function)
            return content;
    }

    /****** End Startup Functions ******/

    this.iniFile = path+ini_file;
    var name = "Pokemon Online Simplified ini.js";
    this.includeModule(path, ini_file, name, true);
    this.ini = ini;

    Object.defineProperty(this, this.RECOVERY, {value: ini});

    delete ini;
    this.moduleDefaultName = this.ini.default_module_name;

    /*
    Notes:
    * file.js must be loaded before
    > module.js

    * misc.js must be loaded before
    > file.js
    > player.js
    > module.js
    */

    this.ModulePath = "posimplified/";
    this.ModulePrefix = "Pokemon Online Simplified ";

    var files = [
            "misc.js",
            "file.js",
            "player.js",
            "module.js",
            "string.js",
            "array.js",
            "object.js"
        ];

    var current, current_file;
    for(current in files) {
        current_file = files[current];
        this.includeModule(this.ModulePath, current_file, this.ModulePrefix+current_file);
    }

    /* Load Custom Modules */
    var x, xc, m = this.ini.custom_modules, ll = [], llx, xcC;
    for(x in m) {
        xc = m[x];
        if(xc.loadAfter instanceof Array) {
            xxC = xc.loadAfter;
            for(llx in xxC) {
                if(POModule.moduleLoaded(xxC[llx]))
                    continue;
                else
                ll.push(xc);
            }
        }

        this.includeModule(xc.path == "default" ? this.ModulePath : xc.path, xc.file, this.ModulePrefix+"Custom Module - "+xc.name+" by "+xc.author);
    }

    var canLoad;
    for(x in ll) {
        xc = ll[x];
        xxC = xc.loadAfter;
        canLoad = true;
        for(llx in xxC) { // If the module was not loaded at all.
            if(POModule.moduleLoaded(xxC[llx]))
                continue;
            else {
                canLoad = false;
                break;
            }
        }
        if(!canLoad) {
            this.skippedModules.push(xc);
            continue;
            this.includeModule(xc.path == "default" ? this.ModulePath : xc.path, xc.file, this.ModulePrefix+"Custom Module - "+xc.name+" by "+xc.author);
        }
    }

}

_PO.prototype.ini_set = function (setting, value) {
    if(typeof this.ini[setting] == "undefined") {
        return new TypeError("No such setting named "+setting+" in PO.ini");
    }

    var old = this.ini[setting];
    if(typeof old != typeof value) {
        return new TypeError("PO.ini."+setting+"'s type is not new value type.");
    }

    this.ini[setting] = value;
    return old;
}

_PO.prototype.ini_restore = function () {
    if(this.ini == this.RECOVERY) {
        return new ReferenceError("PO.ini is the same as PO.RECOVERY");
    }
    var oldini = this.ini;
    this.ini = this.RECOVERY;
    return oldini;
}

PO = new _PO("posimplified/", "ini.js");
