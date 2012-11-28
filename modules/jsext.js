/*
 Dependencies:
 - modules/datahash.js
 */

/**
 * @fileOverview Extends default JavaScript prototypes
 * @author TheUnknownOne
 * @version 3.0.0 Devel 1
 */

/**
 * Defines unenumerable properties on an object
 * @param {Object} core Object to define properties on
 * @param {Object} props Object of functions to define on core
 */

defineOn = function (core, props) {
    var x;
    for (x in props) {
        Object.defineProperty(core, x, {
            "value": props[x],

            writable: true,
            configurable: true
        });
    }
};

/* Defines on String */
defineOn(String.prototype, {
    /**
     * If the trimmed version of this string is empty
     * @return {Boolean}
     */
    isEmpty: function () {
        return this.trim() === "";
    },
    /**
     * Checks if a this string has (part) of a another string
     * @param {String} string String to check for
     * @return {Boolean}
     */
    contains: function (string) {
        return this.indexOf(string) > -1;
    },
    /**
     * Formats the string, replacing %(NUM) with the number of the argument + 1
     * @return {String} Formatted code
     * @example "%1 are very %2".format("Strings", "cool"); // Strings are very cool
     */
    format: function () {
        var str = this,
            exp, i, args = arguments.length,
            num = 0;

        for (i = 0; i < args; i++) {
            num++;
            exp = new RegExp("%" + num, "g");
            str = str.replace(exp, arguments[i]);
        }
        return str;
    },
    /**
     * Returns the html-escaped version of this string
     * @return {String}
     */
    escapeHtml: function () {
        return this.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    },
    /**
     * Returns the html-stripped version of this string
     * @return {String}
     */
    stripHtml: function () {
        return this.replace(/<\/?[^>]*>/g, "");
    },
    /**
     * Capitalizes the first character in this string
     * @return {String}
     */
    cap: function () {
        return this[0].toUpperCase() + this.substr(1);
    },
    /**
     * Removes all spaces in this string
     * @return {String}
     */
    removeSpaces: function () {
        return this.split(" ").join("");
    },
    /**
     * Returns the proper cased name of a string (player name). Requires datahash.js
     * @return {String} The string if modules/datahash.js isn't loaded or the proper capitalized
     */
    name: function () {
        var str = this,
            tl = str.toLowerCase();
        if (!DataHash || !DataHash.names || !DataHash.names.has(tl)) {
            return str;
        }

        return DataHash.names[tl];
    }
});

/* Defines on Boolean */
defineOn(Boolean.prototype, {
    /**
     * If this Boolean is false
     * @return {Boolean}
     */
    isEmpty: function () {
        return this == false;
    }
});

/* Defines on Number */
defineOn(Number.prototype, {
    /**
     * If this Number is finite and not (under) 0
     * @return {Boolean}
     */
    isEmpty: function () {
        return !isFinite(this) || this <= 0;
    },
    /**
     * If this Number is positive and not 0
     * @return {Boolean}
     */
    isPositive: function () {
        return this > 0;
    },
    /**
     * If this number is negative or 0
     * @return {Boolean}
     */
    isNegative: function () {
        return 0 >= this;
    }
});

/* Defines on Object */
defineOn(Object.prototype, {
    /**
     * If this Object has no properties
     * @return {Boolean}
     */
    isEmpty: function () {
        return this.length() === 0;
    },
    /**
     * Returns all keys/properties in this array
     * @return {Array}
     */
    keys: function () {
        return Object.keys(this);
    },
    /**
     * Short for hasOwnProperty
     * @param {*} prop Property to pass to hasOwnProperty
     * @return {Boolean}
     */
    has: function (prop) {
        return this.hasOwnProperty(prop);
    },
    /**
     * Extends this Object (adding all properties from arguments to this array)
     */
    extend: function () {
        var x,
            y,
            current;

        for (x in arguments) {
            current = arguments[x];
            if (typeof current === "object" && !Array.isArray(current) && current !== null) {
                for (y in current) {
                    this[y] = current[y];
                }
            }
        }
    },
    /**
     * Returns the amount of keys in this Object
     * @return {Number}
     */
    length: function () {
        return Object.keys(this).length;
    },
    /**
     * Returns the first property in this Object
     * @return {*}
     */
    first: function () {
        var x;
        for (x in this) {
            return this[x];
        }
    }

});

/* Defines on Array */
defineOn(Array.prototype, {
    /**
     * If this Array has no values
     * @return {Boolean}
     */
    isEmpty: function () {
        return this.length === 0;
    },
    /**
     * If this array has (prop) in it
     * @param {*} prop Value to check if the Array has it
     * @return {Boolean}
     */
    has: function (prop) {
        return this.indexOf(prop) > -1;
    },
    /**
     * Makes a readable version of this Array.
     * @return {String}
     */
    fancyJoin: function () {
        var array = this,
            x,
            retstr = "",
            arrlen = array.length;

        if (arrlen < 2) {
            return array.join("");
        }

        arrlen--;

        for (x in array) {
            if (arrlen === x * 1) {
                retstr = retstr.substr(0, retstr.lastIndexOf(","));
                retstr += " and " + array[x];

                return retstr;
            }

            retstr += array[x] + ", ";
        }

        return retstr;
    }
});

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} JavaScript Extend Core
     */
    Name: function () {
        return "JavaScript Extend Core"
    }
})