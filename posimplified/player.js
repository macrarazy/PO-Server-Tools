/** player.js **/
/** All functions created by TheUnknownOne unless specified. **/

_POPlayer = function() {};

_POPlayer.prototype.auths = function () {
    var ret = [], names = sys.dbAuths(), y, n;
    for(y in names) {
        n = names[y];
        if(sys.id(n) != undefined) {
            ret.push(n);
        }
    }
    return ret;
}

_POPlayer.prototype.sendAuth = function (message) {
    var auths = this.auths(), y, send = sys.sendAll, msg = message;
    for(y in auths) {
        send(msg);
    }
}

_POPlayer.prototype.sendAuthHtml = function (message) {
    var auths = this.auths(), y, send = sys.sendHtmlAll, msg = message;
    for(y in auths) {
        send(msg);
    }
}

_POPlayer.prototype.idForIP = function(ip) {
    var players = sys.playerIds(), y, ipArr = [];
    for(y in players) {
        if(sys.ip(players[y]) == ip) {
            ipArr.push(players[y]);
        }
    }
    return ipArr;
}

_POPlayer.prototype.rangeIP = function (name, _parts) {
    var parts = PO.ini.default_rangeip_parts;
    if(parts <= 0 || parts > 2)
        parts = 2;

    if(_parts) {
        var pIsaN = typeof _parts == 'number', pIsnZ = _parts != 0;
        if(pIsaN && pIsnZ)
            parts = POMisc.iffC(parts, _parts, _parts, 2, ">");
    }

    var ip = sys.dbIp(name);
    if(ip == undefined)
        return POMisc.iifC("255.255.", "255.", parts, 2);

    var ipParts = ip.split(".");
    return POMisc.iifC(ipParts[0]+"."+ipParts[1]+".", ipParts[0]+".", parts, 2);
}

/* Created by Intel_iX */
_POPlayer.prototype.color = function (src) {
    if (sys.getColor(src) == '#000000') {
        var clist = ['#5811b1','#399bcd','#0474bb','#f8760d','#a00c9e','#0d762b','#5f4c00','#9a4f6d','#d0990f','#1b1390','#028678','#0324b1'];
        return clist[src % clist.length]; }
    return sys.getColor(src);
}

POPlayer = new _POPlayer();
