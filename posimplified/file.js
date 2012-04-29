/** file.js **/
/** All functions created by TheUnknownOne unless specified. **/

_POFile = function () {}

_POFile.prototype.safeStore = function(file, storage) {
    sys.appendToFile(file, '');
    var content = sys.getFileContent(file);
    if(content == '')
        sys.appendToFile(file, storage);
}

_POFile.prototype.fileExists = function (file, _path, _nodelete) {
    var testFile = file;
    if(typeof _path == 'string') {
        testFile = PO.testPath(testFile)+file;
    }

    var tsti = testFile.indexOf, y, i = PO.ini.auto_file_exist;
    for(y in i) {
        if(tsti(i[y]) != -1)
            return true;
    }

    this.safeStore(testFile, '');
    var content = sys.getFileContent(testFile);

    if(content == '') {
        if(!_nodelete) {
            sys.writeToFile(testFile, "Ready to Delete.");
            sys.deleteFile(testFile);
        }
        return false;
    }

    return true;
}

_POFile.prototype.content = function (file, _path, _parsejson) {
    var testFile = file;
    if(typeof _path == 'string') {
        testFile = PO.testPath(testFile)+file;
    }
    var exist = this.fileExists(file, POMisc.iff(_path, false, "string"), true);
    if(!exist)
        return "";

    var content = sys.getFileContent(testFile);
    if(content instanceof Object && _parsejson) {
        return JSON.parse(content);
    }

    return content;
}

_POFile.prototype.displayTo = function (file, src, _path, _channel) {
    if(sys.name(src) === undefined)
        return;
    if(sys.channel(_channel) === undefined)
        channel = false;

    var file = file, path = POMisc.iffC(_path, "", typeof path, "string");
    var content = this.content(file, path).split("\n").join("<br>");
    var array = ["sendHtmlAll", src, content];
    if(channel !== false)
        array.push(channel);
    POMisc.callsysfunc.apply(null, array);
}

_POFile.prototype.displayAbout = function (src, _channel) {
    this.displayTo("ABOUT.txt", src, "posimplified/", _channel);
}

_POFile.prototype.displayDoc = function (src, _channel) {
    this.displayTo("DOCUMENTATION.txt", src, "posimplified/", _channel);
}

POFile = new _POFile();
