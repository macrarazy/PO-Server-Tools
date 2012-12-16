/**
 * @fileOverview JSON cache
 * @author TheUnknownOne
 * @version 3.0.0 Alpha 1
 */

/**
 * A cache instance
 * @constructor
 * @param {String} file File for this cache
 * @return {Object} this
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
    } catch (Exception) {
        util.json.write(file + "-corrupted.json", this.hash);

        this.hash = {};
        this.saveAll();

        cacheName = file;
        if (file !== "Cache") {
            cacheName += " cache";
        } else {
            cacheName = "cache";
        }

        print(util.error.format("Could not load " + cacheName + " from file " + this.file + "!", Exception));
        print("Old cache available in " + file + "-corrupted.json. Cache and " + this.file + " have been cleared.");
    }

    return this;
};

/**
 * Ensures that a key is in the cache, and writes the cache to file if it wasn't
 * @param {*} key Name of the key
 * @param {*} value Value of the key
 * @return {Object} this
 */
Cache.prototype.save = function (key, value) {
    if (!this.hash.has(key)) {
        this.hash[key] = value;
        this.saveAll();
    }

    return this;
};

/**
 * Writes a key to the cache, and saves it
 * @param {*} key Name of the key
 * @param {*} value Value of the key
 * @param {Boolean} [noSave=false] If saveAll won't be called
 * @return {Object} this
 */
Cache.prototype.write = function (key, value, noSave) {
    this.hash[key] = value;

    if (!noSave) {
        this.saveAll();
    }

    return this;
};

/**
 * Same as write(), but performs stringify on (value)
 * @param {*} key Name of the key
 * @param {Array|Object} value Value of the key
 * @param {Boolean} [noSave=false] If saveAll won't be called
 * @return {Object} this
 */
Cache.prototype.writeJSON = function (key, value, noSave) {
    this.write(key, JSON.stringify(value), noSave);

    return this;
};

/**
 * Removes a key from the cache, saving the cache if it didn't exist
 * @param {*} key Name of the key
 * @return {Object} this
 */
Cache.prototype.remove = function (key) {
    if (!this.hash.has(key)) {
        return this;
    }

    delete this.hash[key];
    this.saveAll();

    return this;
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
 * @return {Object} this
 */
Cache.prototype.reset = function () {
    this.hash = {};

    sys.writeToFile(this.file, "{}");

    return this;
};

/**
 * Saves all data of this cache's hash to it's file
 * @return {Object} this
 */
Cache.prototype.saveAll = function () {
    util.json.write(this.file, this.hash);

    return this;
};

/**
 * Makes sure key exists, but doesn't write the cache to file
 * @param {*} key Name of the key
 * @param {*} value Value of the key
 * @return {Object} this
 */
Cache.prototype.ensure = function (key, value) {
    if (!this.hash.has(key)) {
        this.hash[key] = value;
        this.ensures++;
    }

    return this;
};

/**
 * Saves the cache to it's file, if it has ensured at least one key using ensure()
 * @return {Object} this
 */
Cache.prototype.saveEnsured = function () {
    if (this.ensures) {
        this.ensures = 0;
        this.saveAll();
    }

    return this;
};

if (typeof cache === "undefined") {
    cache = new Cache("Cache");
}

({
    /**
     * Returns the name of this module
     * @private
     * @return {String}
     */
    Name: function () {
        return "Cache";
    }
})
