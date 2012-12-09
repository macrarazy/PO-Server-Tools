/*
 Umbrella - by TheUnknownOne

 Information is in README.md
 */

Umbrella_Global = GLOBAL;
Umbrella = (function (global) {
    var // Private/Protected Variables
        $packages = {}, // Packages
        $loadedPackages = {}; // Loaded packages.

    // Private/Protected Functions
    function $ensureString(msg) {
        if (typeof msg !== "string") {
            if (msg.toString) {
                msg = msg.toString();
            } else {
                msg = "";
            }
        }

        return msg;
    }

    function $typeError(name, msg) {
        name = $ensureString(name);
        msg = $ensureString(msg);

        throw new TypeError("Umbrella." + name + ": " + msg + ".");
    }

    function $isObject(obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    }

    function $obj2str(obj) { // http://www.davidpirek.com/blog/object-to-string-how-to-deserialize-json
        function parse(_o) {
            var a = [],
                t,
                p;

            for (p in _o) {
                if (_o.hasOwnProperty(p)) {
                    t = _o[p];

                    if (t && typeof t == "object") {
                        a[a.length] = p + ":{ " + arguments.callee(t).join(", ") + "}";
                    } else {
                        if (typeof t == "string") {
                            a[a.length] = [p + ": \"" + t.toString() + "\""];
                        } else {
                            a[a.length] = [p + ": " + t.toString()];
                        }
                    }
                }
            }

            return a;
        }

        return "{" + parse(obj).join(", ") + "}";
    }

    // Public Functions
    function createPackage(name, packet) {
        if (!$isObject(packet)) {
            return $typeError("createPackage", "Packet isn't an object");
        }

        if (!(name in $packages)) {
            return $packages[name] = packet;
        }

        return {};
    }

    function getPackage(name) {
        return $packages[name] || {};
    }

    function deletePackage(name) {
        var x;

        if (!name || name === true) {
            for (x in $loadedPackages) {
                if ($loadedPackages.hasOwnProperty(x) && Umbrella_Global.hasOwnProperty(x)) {
                    delete Umbrella_Global[x];
                    delete $loadedPackages[x];
                }
            }
        } else {
            delete $packages[name];
        }

        return this;
    }

    function unloadPackages() {
        deletePackage(true);
    }

    function loadPackages(packages, as) {
        if (typeof packages !== "string" && !Array.isArray(packages)) {
            return $typeError("loadPackages", "Packages isn't a string or array");
        }
        if (as != undefined && (typeof as !== "string" && !Array.isArray(as))) {
            return $typeError("loadPackages", "As is defined and it isn't a string or array");
        }
        if (as != undefined && (typeof packages !== typeof as)) {
            return $typeError("loadPackages", "As is defined and isn't the same type as packages")
        }

        var packageExists = !!$packages[packages],
            packageIsntLoaded = !$loadedPackages[packages],
            pack = as || packages;

        if (!packageExists && !Array.isArray(packages)) {
            return $typeError("loadPackages", "The package doesn't exist");
        }

        if (typeof packages === "string") {
            if (packageIsntLoaded) {
                Umbrella_Global[pack] = $loadedPackages[pack] = $packages[packages];
            }
        } else {
            packages.forEach(function (value, index, array) {
                var _as = value;
                if (Array.isArray(as)) {
                    _as = as[index];
                }

                if (!!$packages[value] && !$loadedPackages[_as]) {
                    Umbrella_Global[_as] = $loadedPackages[_as] = $packages[value];
                }
            });
        }

        return this;
    }

    function updatePackage (name, pack) {
        if ($packages[name]) {
            return $packages[name] = pack;
        }
        return {};
    }

    function ns(namespace, lastObj) {
        if (!namespace) {
            return $typeError("namespace", "Namespace is falsy");
        }

        if (!$isObject(lastObj)) {
            lastObj = {};
        }

        var splitted = namespace.split("."),
            ns = null,
            nest = "",
            code = "{}";

        try {
            splitted.forEach(function (value, index, array) {
                nest += "['" + value + "']";
                if (typeof array[index + 1] === "undefined") {
                    code = $obj2str(lastObj);
                }

                global.eval.call(null, "if(!Umbrella_Global" + nest + ") { Umbrella_Global" + nest + " = " + code + "; }");
            });
        } catch (ignore) {
            return {};
        }

        try {
            ns = global.eval.call(null, "Umbrella_Global" + nest);
        } catch (ignore) {
            return {};
        }

        return ns || {};
    }

    return {
        createPackage: createPackage,
        create: createPackage,
        getPackage: getPackage,
        "get": getPackage,
        deletePackage: deletePackage,
        del: deletePackage,
        unloadPackages: unloadPackages,
        unload: unloadPackages,
        loadPackages: loadPackages,
        load: loadPackages,
        updatePackage: updatePackage,
        update: updatePackage,
        namespace: ns,
        ns: ns
    };
}(Umbrella_Global));
