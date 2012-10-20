/**
 * @fileOverview Extends default JavaScript prototypes
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

defineOn = function (core, props) {
    var x, curr;
    for (x in props) {
        Object.defineProperty(core, x, {
            "value": props[x],

            writable: true,
            configurable: true
        });
    }
};

defineOn(String.prototype, {
    isEmpty: function () {
        return this.trim() === "";
    },
    contains: function (string) {
        return this.indexOf(string) > -1;
    },
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
    escapeHtml: function () {
        return this.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    },
    stripHtml: function () {
        return this.replace(/<\/?[^>]*>/g, "");
    },
    cap: function () {
        return this[0].toUpperCase() + this.substr(1);
    },
    removeSpaces: function () {
        return this.split(" ").join("");
    }
});

defineOn(Boolean.prototype, {
    isEmpty: function () {
        return this === false;
    }
});

defineOn(Number.prototype, {
    isEmpty: function () {
        return !isFinite(this) || this === 0;

    },
    isPositive: function () {
        return this > 0;
    },
    isNegative: function () {
        return 0 >= this;
    }
});

defineOn(Object.prototype, {
    isEmpty: function () {
        return this.length() === 0;
    },
    keys: function () {
        return Object.keys(this);
    },
    has: function (prop) {
        return this.hasOwnProperty(prop);
    },
    extend: function (other) {
        var x, current;

        for (x in arguments) {
            current = arguments[x];
            if (typeof current === "object" && !Array.isArray(current) && current !== null) {
                this.extend(current);
            } else {
                this[x] = current;
            }
        }

        return this;
    },
    length: function () {
        return Object.keys(this).length;
    }
});

defineOn(Array.prototype, {
    isEmpty: function () {
        return this.length === 0;
    },
    has: function (prop) {
        return this.indexOf(prop) > -1;
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