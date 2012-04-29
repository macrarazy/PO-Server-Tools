/** string.js **/
/** All functions created by TheUnknownOne unless specified. **/

_POString = function () {};

_POString.prototype.rainbow = function (string, colorlist) {
        if(typeof colorlist != "object") {
        colorlist = PO.ini.default_rainbow_colorlist;
        }

        var times = string.length;
        var y, curr_color = 0, ret = '', colorslen = colorlist.length;
        for(y = 0; y < times; y++) {
        ret += "<font color='"+colorlist[curr_color]+"'>"+string[y]+"</font>";
        curr_color++;
        if(curr_color == colorslen)
        curr_color = 0;
        }
        }

_POString.prototype.random_rainbow = function (string, colorlist) {
        if(typeof colorlist != "object") {
        colorlist = PO.ini.default_random_rainbow_colorlist;
        }

        var times = string.length;
        var y, ret = '', curr_color, r = sys.rand, len = colorlist.length-1;
        for(y = 0; y < times; y++) {
        curr_color = colorlist[r(0, len)];
        ret += "<font color='"+curr_color+"'>"+string[y]+"</font>";
        }
        }

_POString.prototype.remove_spaces = function(string, join) {
    if(!join) join = PO.ini.default_remove_spaces_join;
    return string.split(" ").join(join);
}

/* Created by Mystra */
_POString.prototype.html_escape = function (str) {
    return str.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}

_POString.prototype.html_strip = function (str) {
    return str.replace(/<\/?[^>]*>/g, "");
}

_POString.prototype.regexp_strip = function (str) {
    return str.replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '');
}

_POString.prototype.print = function (str) {
    if(str == undefined)  {
        print("");
        return;
    }

    print(this.html_strip(str));
}

_POString.prototype.simularity = function (str, comparestr) {
    var x, simularity = 0, curstr, curcom;
    if(str.length == 0 || comparestr.length == 0)
        return 0;

    for(x in comparestr) {
        if(typeof str[x] == "undefined" ||
                typeof comparestr[x] == "undefined")
            break;
        curstr = str[x];
        curcom = comparestr[x];

        if(curstr == curcom)
            simularity++;
    }

    return simularity;
}
_POString.prototype.randomColor = function () {
    var nums = 5;
    var str = '';

    while(nums >= 0) {
        str += sys.rand(0, 16).toString(16);
        nums--;
    }

    return "#"+str;
}

POString = new _POString();
