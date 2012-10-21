/*
 Dependencies:
 - modules/jsext.js
 */

/**
 * @fileOverview Enums for JavaScript
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

/**
 * Creates an enum
 * @param {Enum|String|Array} [flags] Enum to copy flags from, a single flag, or an array of flags
 * @constructor
 */
Enum = function (flags) {
    /**
     * To count flags
     * @private
     * @type {Number}
     */
    this.cFlagNum = 0;

    /**
     * Contains flags for this enum
     * @type {Object}
     */
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
};

/**
 * toString implementation of Enum
 * @return {String} [class Enum]
 */

Enum.prototype.toString = function () {
    return "[class Enum]";
};

/**
 * Adds a flag to this enum
 * @param {String} flag Name of the flag
 */

Enum.prototype.addFlag = function (flag) {
    if (this.flags.has(flag)) {
        return;
    }

    this.flags[flag] = this.cFlagNum;

    this.cFlagNum *= 2;
};

/**
 * Adds an array of flags to this enum
 * @param {Array} flags Flags to add
 */
Enum.prototype.addFlags = function (flags) {
    var x;
    for (x in flags) {
        this.addFlag(flags[x]);
    }
};

/**
 * Returns a flag by name
 * @param {String} name The flag's name
 * @return {Number} Number of this flag to use with Mask
 */
Enum.prototype.flag = function (name) {
    return this.flags[name] || 0;
};

/**
 * Creates a Mask for flags
 * @param {Mask|Number|Array|Enum} [flags] Mask to copy flags from, a number, an array of flags, or an enum
 * @constructor
 */
Mask = function (flags) {
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
    } else if (flags.toString() === "[class Enum]") {
        this.addFlags(flags.flags);
    }
};

/**
 * toString implementation for Mask
 * @return {String} [class Mask]
 */
Mask.prototype.toString = function () {
    return "[class Mask]";
};

/**
 * Adds a flag to this mask
 * @param {Number} flag Flag to add
 */

Mask.prototype.addFlag = function (flag) {
    this.flags |= flag;
};

/**
 * Adds an array or object (must be name=>flag) of flags
 * @param {Array|Object} flags Flags to add
 */

Mask.prototype.addFlags = function (flags) {
    var x;
    for (x in flags) {
        this.flags |= flags[x];
    }
};

/**
 * Removes a flag from this mask
 * @param {Number} flag Flag to remove
 */

Mask.prototype.removeFlag = function (flag) {
    this.flags &= ~flag;
};

/**
 * Removes an array or object (must be name=>flag) of flags
 * @param {Array|Object} flags Flags to add
 */
Mask.prototype.removeFlags = function (flags) {
    var x;
    for (x in flags) {
        this.flags &= ~flags[x];
    }
};

/**
 * If this mask has that flag
 * @param {Number} flag Flag to check
 * @return {Boolean} If this mask has that flag
 */
Mask.prototype.hasFlag = function (flag) {
    return !!this.flags & flag;
};

/**
 * If this mask has those flags
 * @param {Mask|Object|Number|Enum} flags Flags to check (Object, Number, or Enum as flags will be passed to new Mask)
 * @return {Boolean} If this mask has those flags
 */
Mask.prototype.hasFlags = function (flags) {
    var compare_mask;

    if (flags.toString() === "[class Mask]") {
        compare_mask = flags.flags;
    } else {
        compare_mask = new Mask(flags).flags;
    }

    return !!this.flags & compare_mask;
};

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} Enums
     */
    Name: function () {
        return "Enums";
    }
})