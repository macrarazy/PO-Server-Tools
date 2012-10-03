makeEnum = function (names) {
    var now = 1,
        x, ret = {};
    for (x in names) {
        ret[names[x]] = now;
        now *= 2;
    }

    return ret;
}

addFlag = function (mask, flag) {
    return mask | flag;
}

addFlags = function (mask, flags) {
    var ret = mask,
        x;
    for (x in flags) {
        ret |= flags[x];
    }

    return ret;
}

removeFlag = function (mask, flag) {
    return mask & ~flag;
}

removeFlags = function (mask, flags) {
    var ret = mask,
        x;
    for (x in flags) {
        ret &= ~flags[x];
    }
    
    return ret;
}

hasFlag = function (mask, flag) {
    return mask & flag;
}

hasFlags = function (mask, flags) {
    var compare_mask = addFlags(0, flags);
    return mask & compare_mask;
}