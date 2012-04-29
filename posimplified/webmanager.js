/*
  Documentation:
  4 Functions:
    * void _POWebManager()
    * mix (all) getContent(string url, function callback, optional object _POST)
    * functions downloadModule(string url, object moddata)
    * string downloadModuleStatus(mix (boolean/string))

  Using downloadModuleStatus =>
  POWebManager.downloadModuleStatus(POWebManager.downloadModule(arguments));
*/

_POWebManager = function () {};

_POWebManager.prototype.getContent = function(url, callback, _POST) {
    if(callback == undefined)
        callback = "return resp;";
    var callArray = ["webCall", url, callback];
    if(_POST instanceof Object)
        callArray.push(_POST);
    var webCont = POMisc.callsysfunc.apply(null, callArray);
    if(webCont == "")
        return "undefined";
    else
        return webCont;
}

_POWebManager.prototype.downloadModule = function (url, moddata) {
    if(!moddata instanceof Object)
        return "0";

    var module = this.getContent(url);
    var path = moddata.path == "default" ? PO.ModulePath : PO.testPath(moddata.path);
    if(module == "undefined")
        return "1";

    sys.writeToFile(path+moddata.file, module);
    var list = moddata.loadAfter, x;
    for(x in list) {
        if(!this.findModule(list[x]))
            return "2";
    }

    PO.includeModule(path, moddata.file, moddata.name+" by "+moddata.author)
    return true;
}

_POWebManager.prototype.downloadModuleStatus = function (result) {
    if(result == true)
        return "Success.";
    else {
        if(result === "0")
            return "Error 1: Module Data is not an object.";
        else if (result === "1")
            return "Error 2: URL does not contain any information.";
        else if(result === "2")
            return "Error 3: A Module in Module Data's loadAfter is not installed. Module might not be working properly.";
        else
            return "Unknown Error.";
    }
}

POWebManager = new _POWebManager();
