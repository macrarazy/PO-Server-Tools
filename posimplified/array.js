/** array.js **/
/** All functions created by TheUnknownOne unless specified. **/

_POArray = function () {};

_POArray.prototype.cut = function(array, from, join) {
    if(!join) join = PO.ini.default_cut_join;
    return array.splice(from).join(join);
}

_POArray.prototype.cut_part = function(array, from, to, join) {
    if(!join) join = PO.ini.default_cut_part_join;
    return array.splice(from, to).join(join);
}

_POArray.prototype.push = function(array) {
    if(!array instanceof Array)
        return false;

    var pushlist = arguments.splice(0, 1), z;
    if(pushlist.length > 0) {
        for(z in pushlist) {
            array.push(pushlist[z]);
        }
    }

    return true;
}

_POArray.prototype.moveSpot = function (array, spots, _changefirstTo) {
    var x, arl = array.length, cft = typeof _changeFirstTo == "string";
    if(arl < 1)
        return;
    for(x in array) {
        if(x >= spots) {
            return;
        }
        if(cft && x == 0) {
            array[1] = array[0];
            array[0] = _changeFirstTo;
        }
        else if(cft && x == 1)
            continue;

        array[x] = array[x+1];
    }
}

_POArray.prototype.shuffle = function (array) {
    array.sort
            (function() {
                 return 0.5 - Math.random()
             });
}

POArray = new _POArray();
