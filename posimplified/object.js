/** object.js **/
/** All functions created by TheUnknownOne unless specified. **/

_POObject = function () {}

_POObject.prototype.length = function (obj) {
    if(!obj instanceof Object)
        return 0;

    return Object.keys(obj).length;
}

_POObject.prototype.values = function(obj) {
    if(!obj instanceof Object)
        return [];

    return Object.keys(obj);
}

POObject = new _POObject();
