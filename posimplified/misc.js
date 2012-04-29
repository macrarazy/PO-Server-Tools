/** misc.js **/
/** All functions created by TheUnknownOne unless specified. **/

_POMisc = function () {}

_POMisc.prototype.callsysfunc = function(func) {
    var result, args;
    if(func == undefined) func = PO.ini.default_callsysfunc_function;
    if(arguments.length == 0) args = PO.ini.default_callsysfunc_arguments;
    else args = arguments.splice(1);
    try {
        result = sys[func].apply(null,args);
    }
    catch(e) {
        result = e;
    }
    return result;
}

_POMisc.prototype.iif = function(if1, if2, c) {
    if(typeof(if1) == "undefined" || typeof(if2) == "undefined")
        return if1;

    c = String(c).toLowerCase();
    if(c == "bool" || c == "flag")
        c = "boolean";
    if(c != "string" && c != "number" && c != "object" && c != "boolean" && c != "function")
        c = "undefined";

    return typeof if1 == c ? if1 : if2;
}

_POMisc.prototype.iifC = function(if1, if2, c, cval, _operator) {
    if(typeof(if1) == "undefined" || typeof(if2) == "undefined")
        return if1;

    var o = _operator;
    if(o != ">" && o != ">=" && o != "===" && o != "==" && o != "<" && o != "<=")
        o = "==";

    var evas;
    cval = c == "typeof" ? "\""+cval+"\"" : cval;
    eval("evas = "+c+" "+if1+" "+o+" "+cval+" ? "+if1+" : "+if2+";");
    return evas;
}

_POMisc.prototype.serverConfig = function () {
    var hash = {};
    var file = "config";
    var cnt = sys.getFileContent(file);
    var da = "";
    var y, c = cnt.split("\n"), s;

    for(y in c) {
        if(c[y] == "[General]")
            continue;
        s = c[y].split("=");
        s[1] = s[1].replace(/\\xe9/i,"é"); // Pokémon fix.

        if(da != "") {
            if(!s[0] == "server_maxplayers" || !s[0] == "mainchanname") {
                hash[dan] += s[1];
            }
            else {
                da = "";
            }
        }

        if(s[0] == "server_description" || s[0] == "server_announcement") {
            da = s[0];
            hash[s[0]] = s[1];
        }

        hash[s[0]] = s[1];
    }

    return hash;
}

_POMisc.prototype.type_of = function (arg) {
    var type = typeof arg;
    if(type == "object") {
        if(type == null)
            type = "null";
        else if(arg instanceof Object)
            type = "object";
        else if(arg instanceof Array)
            type = "array";
        else
            type = "undefined";
    }

    return type;
}
