/** cache.js **/
/** All functions created by TheUnknownOne unless specified. **/

_POCache = function (file) {
    if(file == undefined)
        file = 'posimplified/POSimplifiedDataStore.json';
    this.path = file;

    this.stored = false;
    this.removed = false;
    // Useful for checking if any value has been saved/deleted
    // If no -S functions are used or only very rarely.

    POFile.saveStore(file, "{}");
    var content = PO.content(file);
    try {
        this.dataStorage = JSON.parse(content);
    }
    catch(e) {
        this.dataStorage = {};
        print("An error has occured when loading PODataStore. dataStorage is now an empty object");
    }
    this.tempStorage = {};
}

_POCache.prototype.make = function (name, value, temp) {
    if(typeof this.dataStorage[name] == "undefined") {
        this.dataStorage[name] = value;
        this.stored = true;
    }
}

_POCache.prototype.makeT = function (name, value) {
    if(typeof this.tempStorage[name] == "undefined") {
        this.tempStorage[name] = value;
    }
}

_POCache.prototype.makeS = function (name, value) {
    if(typeof this.dataStorage[name] == "undefined") {
        this.dataStorage[name] = value;
        this.saveToFile();
    }
}

_POCache.prototype.store = function (name, value) {
    var ov = this.dataStorage[name];
    if(ov == value)
        return;

    his.dataStorage[name] = value;
    this.stored = true;
}

_POCache.prototype.storeT = function (name, value) {
    this.tempStorage[name] = value;
}

_POCache.prototype.storeS = function (name, value) {
    var ov = this.dataStorage[name];
    if(ov == value)
        return;

    this.dataStorage[name] = value;
    this.saveToFile();
}

_POCache.prototype.remove = function (name) {
    var ds = typeof this.dataStorage[name] != "undefined";
    if(!ds)
        return;

    delete this.dataStorage[name];
    this.removed = true;
}

_POCache.prototype.removeT = function (name) {
    delete this.tempStorage[name];
}

_POCache.prototype.removeM = function (name) {
    var ds = typeof this.dataStorage[name] != "undefined";
    delete this.dataStorage[name];
    delete this.tempStorage[name];
    if(ds)
        this.removed = true;
}

_POCache.prototype.removeMS = function (name) {
    var ds = typeof this.dataStorage[name] != "undefined";
    delete this.dataStorage[name];
    delete this.tempStorage[name];
    if(ds) {
        this.saveToFile();
        this.removed = true;
    }
}

_POCache.prototype.removeS = function (name) {
    var ds = typeof this.dataStorage[name] != "undefined";
    if(!ds)
        return;

    delete this.dataStorage[name];
    this.saveToFile();
}

_POCache.prototype.read = function (name) {
    if(typeof this.dataStorage[name] == "undefined")
        return undefined;

    return this.dataStorage[name];
}

_POCache.prototype.readT = function (name) {
    if(typeof this.tempStorage[name] == "undefined")
        return undefined;

    return this.tempStorage[name];
}

_POCache.prototype.readM = function (name) {
    var ds = typeof this.dataStorage[name];
    var ts = typeof this.tempStorage[name];
    var array = [undefined, undefined];

    if(ds == "undefined" && ts == "undefined")
        return array;

    if(ds != "undefined")
        array[0] = this.dataStorage[name];

    if(ts != "undefined")
        array[1] = this.tempStorage[name];

    return array;
}

_POCache.prototype.clearStorage = function () {
    this.dataStorage = {};
}

_POCache.prototype.clearStorageT = function () {
    this.tempStorage = {};
}

_POCache.prototype.clearStorageM = function () {
    this.dataStorage = {};
    this.tempStorage = {};
}

_POCache.prototype.clearStorageS = function () {
    this.dataStorage = {};
    sys.writeToFile(this.path, "{}");
}

_POCache.prototype.saveToFile = function () {
    sys.writeToFile(this.path, JSON.stringify(this.dataStorage));
    this.removed = false;
    this.saved = false;
}

_POCache.prototype.toString = function () {
    return "POCache";
}


POCache = new _POCache();
