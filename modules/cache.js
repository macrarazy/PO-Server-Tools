/*
 Dependencies:
 - modules/jsext.js
 - modules/utilities.js
 */

/**
 * @fileOverview JSON cache
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

/**
 * A cache instance
 * @param {String} file File for this cache
 * @constructor
 */
Cache = function (file) {
    var cacheName;

    /**
     * File for this cache
     * @type {String}
     */
    this.file = file + ".json";

    /**
     * Used by ensure() to make sure a value exists, but that it isn't overwritten, and that the cache file doesn't update
     * @private
     * @type {Number}
     */
    this.ensures = 0;

    util.file.create(this.file, "{}");

    try {
        this.hash = util.json.read(this.file);
    }
    catch (e) {
        util.json.write(file + "-corrupted.json", this.hash);

        this.hash = {};
        this.saveAll();

        cacheName = file;
        if (file != "Cache") {
            cacheName += " cache";
        } else {
            cacheName = "cache";
        }

        print(util.error.format("Could not load " + cacheName + " from file " + this.file + "!", e));
        print("Old cache available in " + file + "-corrupted.json. Cache and " + this.file + " have been cleared.");
    }
};

/**
 * Ensures that a key is in the cache, and writes the cache to file if it wasn't
 * @param {*} key Name of the key
 * @param {*} value Value of the key
 */
Cache.prototype.save = function (key, value) {
    if (!this.hash.has(key)) {
        this.hash[key] = value;
        this.saveAll();
    }
};

/**
 * Writes a key to the cache, and saves it
 * @param {*} key Name of the key
 * @param {*} value Value of the key
 * @param {Boolean} [noSave=false] If saveAll won't be called
 */
Cache.prototype.write = function (key, value, noSave) {
    this.hash[key] = value;

    if (!noSave) {
        this.saveAll();
    }
};

/**
 * Same as write(), but performs stringify on (value)
 * @param {*} key Name of the key
 * @param {Array|Object} value Value of the key
 * @param {Boolean} [noSave=false] If saveAll won't be called
 */
Cache.prototype.writeJSON = function (key, value, noSave) {
    this.write(key, JSON.stringify(value), noSave);
};

/**
 * Removes a key from the cache, saving the cache if it didn't exist
 * @param {*} key Name of the key
 */
Cache.prototype.remove = function (key) {
    if (!this.hash[key]) {
        return;
    }

    delete this.hash[key];
    this.saveAll();
};

/**
 * Gets a key from the cache, or an empty string if it doesn't exist
 * @param {String} key Name of the key
 * @return {*|String} Returns the key from the cache, or an empty string if it doesn't exist
 */
Cache.prototype.get = function (key) {
    return this.hash[key] || "";
};

/**
 * Resets the cache
 */
Cache.prototype.reset = function () {
    this.hash = {};

    sys.writeToFile(this.file, "{}");
};

/**
 * Saves all data of this cache's hash to it's file
 */
Cache.prototype.saveAll = function () {
    util.json.write(this.file, this.hash);
};

/**
 * Makes sure key exists, but doesn't write the cache to file
 * @param {*} key Name of the key
 * @param {*} value Value of the key
 */
Cache.prototype.ensure = function (key, value) {
    if (!this.hash[key]) {
        this.hash[key] = value;
        this.ensures++;
    }
};

/**
 * Saves the cache to it's file, if it has ensured at least one key using ensure()
 */
Cache.prototype.saveEnsured = function () {
    if (this.ensures) {
        this.ensures = 0;
        this.saveAll();
    }
};

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} Cache
     */
    Name: function () {
        return "Cache";
    }
})