/** module.js **/
/** All functions created by TheUnknownOne unless specified. **/

_POModule = function () {}

_POModule.prototype.loadedModules = function () {
    var mods = PO.includedModules, mod, modname;
    var modhash = {};
    for(mod in mods) {
        modname = mods[mod][0]+mods[mod][1];
        modhash[modname] = {'name': mods[mod][2], 'function': mods[mod][3]};
    }

    return modhash;
}

_POModule.prototype.skippedModules = function () {
    var mods = PO.skippedModules, x, y, _PATH;
    var modhash = {};
    for(x in mods) {
        y = mods[x];
        _PATH = POMisc.iffC(y.path, PO.ModulePath, "", "\"default\"")
        modhash[y.name] = {
                'author': y.author,
                'file': y.file,
                'path': _PATH,
                'loadAfter': y.loadAfter
    };
    }
    return modhash;
}

_POModule.prototype.findModule = function(path, file, _inisafe) {
    path = PO.testPath(path);
    if(!this.fileExists(file, path) || path+file == this.iniFile && !_inisafe) {
        return undefined;
    }

    var y, a = PO.includedModules, n, z, h, match = undefined;
    for(y in a) {
        n = a[y];
        for(z in n) {
            h = n[z];
            if(h[0] == path && h[1] == file ) {
                match = z;
                break;
            }
        }
    }

    return match;
}

_POModule.prototype.moduleLoaded = function(name) {
    name = name.toLowerCase()
    var x, loads = PO.includedModules, load = false;
    for(x in loads) {
        if(loads[x][2].toLowerCase() == name) {
            load = true;
            break;
        }
    }
    return load;
}

_POModule.prototype.reloadModule = function(path, file, _newname, _function) {
    var find = this.findModule(path, file);

    if(find == undefined)
        return false;

    delete PO.includedModules[find];
    var name = POMisc.iff(_newname, "", "undefined");
    var func = POMisc.iff(_function, false, "undefined");
    PO.includeModule(path, file, name, func);
    return true;
}

POModule = new _POModule();
