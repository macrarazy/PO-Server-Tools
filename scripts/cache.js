/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports*/

// File: cache.js (Cache)
// Contains Cache, which is used to persistently store values, unlike DataHash, which stores them in RAM.
// Depends on: utils

// Table of Content:
// [expt]: Exports

(function () {
    var Utils = require('utils');
    
    // Constructs a cache object.
    function Cache(file) {
        this.file = file + ".json";
        this.hash = {};
        this.ensures = 0;
        
        // Ensures that the file exists.
        Utils.createFile(this.file, "{}");

        try {
            this.hash = JSON.parse(sys.getFileContent(this.file));
        } catch (e) {
            sys.writeToFile(file + "-corrupted.json", sys.getFileContent(this.file));
            
            // resets the hash and clears the file (changing its content to "{}")
            this.reset();

            print("Could not load cache from " + this.file + ": " + e);
            print("Old cache saved to " + file + "-corrupted.json. Cache and the " + file + ".json file have been cleared.");
        }
    }

    // Ensures [key] exists, and gives it [value] if it doesn't.
    Cache.prototype.save = function (key, value) {
        if (typeof this.hash[key] === "undefined") {
            this.hash[key] = value;
            this.saveAll();
        }
    };
    
    // Just like Cache#save, but also increments Cache#ensure if a key was created (and doesn't call Cache#saveAll).
    // Used to optimize the way default keys are set. This makes sure Cache#saveAll isn't called if nothing had to be saved.
    Cache.prototype.ensure = function (key, value) {
        if (typeof this.hash[key] === "undefined") {
            this.hash[key] = value;
            ++this.ensure;
        }
    };
    
    // Sets [key]'s value to [value]
    Cache.prototype.write = function (key, value) {
        this.hash[key] = value;
        this.saveAll();
    };

    // Returns the value of [key]. Returns "" (empty string) if it does not exist.
    Cache.prototype.get = function (key) {
        if (this.hash[key] === undefined) {
            return "";
        }

        return this.hash[key];
    };

    // Deletes [key].
    Cache.prototype.remove = function (key) {
        if (this.get(key) === "") {
            return;
        }

        delete this.hash[key];
        this.saveAll();
    };
    
    // Resets the cache.
    Cache.prototype.reset = function () {
        this.hash = {};
        sys.writeToFile(this.file, "{}");
    };

    // Saves all data in the cache to file.
    Cache.prototype.saveAll = function () {
        sys.writeToFile(this.file, JSON.stringify(this.hash));
    };
    
    // Exports [expt]
    
    // Exports a cache object.
    exports.Cache = new Cache();
    
    // Exports the cache constructor.
    exports.cache_constructor = Cache;
}());