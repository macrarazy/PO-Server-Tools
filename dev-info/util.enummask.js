/* util.Enum and util.Mask
    currently waste space so moved here. */

/**
 * Creates an enum
 * @param {util.Enum|String|Array} [flags] Enum to copy flags from, a single flag, or an array of flags
 * @constructor
 * @return {Object} this
 */
util.Enum = function (flags) {
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
        return this;
    }

    if (flags.toString() === "[class Enum]") {
        this.flags = flags.flags;
    } else if (typeof flags === "string") {
        this.addFlag(flags);
    } else if (Array.isArray(flags)) {
        this.addFlags(flags);
    }
    return this;
};

/**
 * toString implementation of Enum
 * @return {String} [class Enum]
 */

util.Enum.prototype.toString = function () {
    return "[class Enum]";
};

/**
 * Adds a flag to this enum
 * @param {String} flag Name of the flag
 * @return {Object} this
 */

util.Enum.prototype.addFlag = function (flag) {
    if (this.flags.has(flag)) {
        return this;
    }

    this.flags[flag] = this.cFlagNum;
    this.cFlagNum *= 2;

    return this;
};

/**
 * Adds an array of flags to this enum
 * @param {Array} flags Flags to add
 * @return {Object} this
 */
util.Enum.prototype.addFlags = function (flags) {
    flags.forEach(function (value, index, array) {
        this.addFlag(value);
    });

    return this;
};

/**
 * Returns a flag by name
 * @param {String} name The flag's name
 * @return {Number} Number of this flag to use with Mask
 */
util.Enum.prototype.flag = function (name) {
    return this.flags[name] || 0;
};

/**
 * Creates a Mask for flags
 * @param {util.Mask|Number|Array|util.Enum} [flags] Mask to copy flags from, a number, an array of flags, or an enum
 * @constructor
 */
util.Mask = function (flags) {
    this.flags = 0;

    if (!flags) {
        return this;
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

    return this;
};

/**
 * toString implementation for Mask
 * @return {String} [class Mask]
 */
util.Mask.prototype.toString = function () {
    return "[class Mask]";
};

/**
 * Adds a flag to this mask
 * @param {Number} flag Flag to add
 * @return {Object} this
 */

util.Mask.prototype.addFlag = function (flag) {
    this.flags |= flag;

    return this;
};

/**
 * Adds an array or object (must be name=>flag) of flags
 * @param {Array|Object} flags Flags to add
 */

util.Mask.prototype.addFlags = function (flags) {
    var x;
    for (x in flags) {
        this.flags |= flags[x];
    }

    return this;
};

/**
 * Removes a flag from this mask
 * @param {Number} flag Flag to remove
 * @return {Object} this
 */

util.Mask.prototype.removeFlag = function (flag) {
    this.flags &= ~flag;

    return this;
};

/**
 * Removes an array or object (must be name=>flag) of flags
 * @param {Array|Object} flags Flags to add
 * @return {Object} this
 */
util.Mask.prototype.removeFlags = function (flags) {
    var x;
    for (x in flags) {
        this.flags &= ~flags[x];
    }

    return this;
};

/**
 * If this mask has that flag
 * @param {Number} flag Flag to check
 * @return {Boolean} If this mask has that flag
 */
util.Mask.prototype.hasFlag = function (flag) {
    return !!this.flags & flag;
};

/**
 * If this mask has those flags
 * @param {util.Mask|Object|Number|util.Enum} flags Flags to check (Object, Number, or Enum as flags will be passed to new Mask)
 * @return {Boolean} If this mask has those flags
 */
util.Mask.prototype.hasFlags = function (flags) {
    var compare_mask;

    if (flags.toString() === "[class Mask]") {
        compare_mask = flags.flags;
    } else {
        compare_mask = new util.Mask(flags).flags;
    }

    return !!this.flags & compare_mask;
};
