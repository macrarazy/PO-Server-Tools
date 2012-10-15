Enum = function (flags) {
    this.cFlagNum = 0;
    this.flags = {};
    
    if (!flags) {
        return;
    }
    
    if (flags.toString() === "[class Enum]") {
        this.flags = flags.flags;
    } else if (typeof flags === "string") {
        this.addFlag(flags);
    } else if (Array.isArray(flags)) {
        this.addFlags(flags);
    }
}

Enum.prototype.toString = function () {
    return "[class Enum]";
}

Enum.prototype.addFlag = function (flag) {
    if (this.flags.hasOwnProperty(flag)) {
        return;
    }
    
    this.flags[flag] = this.cFlagNum;
    
    this.cFlagNum *= 2;
}

Enum.prototype.addFlags = function (flags) {
    var x;
    for (x in flags) {
        this.addFlag(flags[x]);
    }
}

Enum.prototype.flag = function (name) {
    return this.flags[name];
}

Mask = function (flags) {
    this.cFlagNum = 0;
    this.flags = 0;
    
    if (!flags) {
        return;
    }
    
    if (flags.toString() === "[class Mask]") {
        this.flags = flags.flags;
    } else if (typeof flags === "number") {
        this.addFlag(flags);
    } else if (Array.isArray(flags)) {
        this.addFlags(flags);
    } else if (typeof flags === "object" && flags !== null) {
        this.addFlags(flags.flags);
    }
}

Mask.prototype.toString = function () {
    return "[class Mask]";
}

Mask.prototype.addFlag = function (flag) {
    this.flags |= flag;
}

Mask.prototype.addFlags = function (flags) {
    var x;
    for (x in flags) {
        this.flags |= flags[x];
    }
}

Mask.prototype.removeFlag = function (flag) {
    this.flags &= ~flag;
}

Mask.prototype.removeFlags = function (flags) {
    var x;
    for (x in flags) {
        this.flags &= ~flags[x];
    }
}

Mask.prototype.hasFlag = function (flag) {
    return this.flags & flag;
}

Mask.prototype.hasFlags = function (flags) {
    var compare_mask;
    
    if (flags.toString() === "[class Mask]") {
        compare_mask = flags.flags;
    } else {
        compare_mask = new Mask(flags);
    }
    
    return this.flags & compare_mask;
}

/*
    m_enum = new Enum(["PLAYER_OFFLINE", "PLAYER_ONLINE"]);
    m_enum.addFlag("PLAYER_AWAY");
    
    m_player = {};
    m_player.data = new Mask();
    
    m_player.data.addFlag(m_enum.flag("PLAYER_AWAY"));
    m_player.data.hasFlag("PLAYER_AWAY"); // true
    m_player.data.removeFlag("PLAYER_AWAY");
*/