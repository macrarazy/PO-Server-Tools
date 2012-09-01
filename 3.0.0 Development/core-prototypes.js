Object.defineProperty(String.prototype, "reverse", {
    "value": function () {
        var strThis = thism;
        strThisArr = strThis.split("").reverse().join("");

        this = strThisArr;
        return this;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "contains", {
    "value": function (string) {
        var str = this;
        return str.indexOf(string) > -1;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "has", {
    "value": function (string) {
        return this.contains(string);
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "name", {
    "value": function () {
        var str = this;
        if (typeof DataHash.names == "undefined") {
            return str;
        }

        var tl = str.toLowerCase();
        if (typeof DataHash.names[tl] != "undefined") {
            str = DataHash.names[tl];
        }

        return str;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "format", {
    "value": function () {
        var str = this,
            exp, i, args = arguments.length,
            icontainer = 0;
        for (i = 0; i < args; i++) {
            icontainer++;
            exp = new RegExp("%" + icontainer, "");
            str = str.replace(exp, arguments[i]);
        }
        return str;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "fontsize", {
    "value": function (size) {
        var str = this;

        return "<font size='" + size + "'>" + str + "</font>";
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "scramble", {
    "value": function () {
        var thisString = this.split("");
        for (var i = thisString.length, j, k; i; j = parseInt(Math.random() * i), k = thisString[--i], thisString[i] = thisString[j], thisString[j] = k) {}
        return thisString.join("");
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "linkify", {
    "value": function () {
        var urlPattern = /\b(?:https?|ftps?|git):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
            pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
            emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim,
            poPattern = /\bpo:[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        return this.replace(urlPattern, '<a target="_blank" href="$&">$&</a>').replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>').replace(emailAddressPattern, '<a target="_blank" href="mailto:$1">$1</a>').replace(poPattern, function ($) {
            var type = $.substring($.indexOf(":", $.indexOf("/"))),
                thing = $.substring($.indexOf("/"));

            type = type[0].toUpperCase() + type.substring(1);

            return "<a href='" + $ + "'>" + type + " " + thing + "</a>";
        });
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(Object.prototype, "has", {
    "value": function (prop) {
        return typeof this[prop] !== "undefined";
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(Object.prototype, "contains", {
    "value": function (prop) {
        return this.has(prop);
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(Object.prototype, "insert", {
    "value": function (name, val) {
        if (!this.has(name)) {
            this[name] = val;
            return;
        }

        if (typeof val == "object" && !Array.isArray(val) && val !== null) {
            var x;
            for (x in val) {
                this[name][x] = val[x];
            }

            return;
        }

        this[name] = val;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(Object.prototype, "remove", {
    "value": function (name) {
        if (!this.has(name)) {
            return;
        }

        delete this[name];
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(Object.prototype, "first", {
    "value": function () {
        var x;
        for (x in this) {
            return this[x]; // Grab the first property
        }
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(Object.prototype, "length", {
    "value": function () {
        return Object.keys(this).length;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(Array.prototype, "has", {
    "value": function (prop) {
        var x;
        for (x in this) {
            if (this[x] == prop) {
                return true;
            }
        }

        return false;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(Array.prototype, "contains", {
    "value": function (prop) {
        return this.has(prop);
    },

    writable: true,
    enumerable: false,
    configurable: true
});