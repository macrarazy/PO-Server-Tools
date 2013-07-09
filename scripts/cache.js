/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, Qt, print, gc, version,
    Config: true, require: false, module: true, exports: true*/

// File: cache.js (Cache)
// Contains Cache, which is used to persistently store values, unlike DataHash, which stores them in RAM.
// Depends on: options, utils

// Table of Content:
// [cachector]: Cache constructor
// [cacheinit]: Cache initialiser
// [expt]: Exports

/* Values used by the default cache (with the exception of datahash properties):
    - mostPlayersOnline (Number)
    - messageCharacterLimit (Number)
    - floodCheck (Boolean)
    - botSettings (Object)
    - motdSettings (Object)
    - scriptRecentLoadDate (String)
    - scriptRegisteredDate (String)
    - activeStyle (String)
*/

(function () {
    var Options = require('options'),
        Utils = require('utils');
    
    // Constructs a cache object. [cachector]
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
    
    // Ensures all keys (which an object) exist (keyName -> keyValue).
    // Only runs saveAll if a new key had to be created.
    Cache.prototype.ensure = function (keys) {
        var key;
        
        for (key in keys) {
            if (typeof this.hash[key] === "undefined") {
                this.hash[key] = keys[key];
            }
        }
    };
    
    // Sets [key]'s value to [value]
    Cache.prototype.write = function (key, value) {
        this.hash[key] = value;
        this.saveAll();
    };

    // Returns the value of [key]. Returns "" (empty string) if it does not exist.
    Cache.prototype.get = function (key) {
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
    
    // Helper used by init(), to change properties in Options with a value from Cache
    function initValues(values) {
        var i;
        
        for (i in values) {
            Options[i] = exports.Cache.get(values[i]);
        }
    }
    
    // Initialises all cache values, with the exception of DataHash (which is done in datahash.js). [cacheinit]
    function init() {
        // NOTE: We don't have to init script recent load and script register, as this is done in init()
        // Ensures all cache values exist, with a default value.
        exports.Cache.ensure({
            botSettings: {
                bot: "~Server~",
                color: "red"
            },
            motdSettings: {
                enabled: false,
                message: "",
                setter: ""
            },
            floodCheck: true,
            mostPlayersOnline: 0,
            messageCharacterLimit: 300,
            activeStyle: "default"
        });
        
        // Sets the Option.xxx values.
        initValues({
            Bot: 'botSettings',
            motd: 'motdSettings',
            floodCheck: 'floodCheck',
            mostPlayersOnline: 'mostPlayersOnline',
            messageCharacterLimit: 'messageCharacterLimit'
        });
    }
    
    // Exports [expt]
    // Exports a cache object.
    exports.Cache = new Cache();
    
    // Exports the cache constructor.
    exports.cache_constructor = Cache;
    
    // Exports the cache value initialiser.
    exports.init = init;
}());