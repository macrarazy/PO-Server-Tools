/*
 Dependencies:
 - modules/jsext.js
 - modules/utilities.js
 */

/**
 * @fileOverview DataHash (Object containing data)
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

/* Extends util with DataHash utilities */
if (!util.datahash) {
    /**
     * DataHash Utilities
     * @namespace
     * @type {Object}
     */
    util.datahash = {
        /**
         * Writes a DataHash property to the given (cacheInst)
         * @param {Cache} cacheInst An instance of Cache
         * @param {String} name Name of the DataHash property
         */
        write: function (cacheInst, name) {
            cacheInst.writeJSON(name, DataHash[name]);
        }
    };
}

/**
 * The DataHash
 * @namespace
 * @type {Object}
 */
DataHash = {};

/**
 * File which all content is stored in
 * @type {String}
 */
DataHash.file = "DataHash.json";

/* Reads DataHash from file */
util.sandbox.DataHash = util.json.read(DataHash.file);

if (util.sandbox.DataHash.isEmpty()) {
    /**
     * Stores proper cased names as (name.lowercase=>name.correctcase) and player last names by ip (ip=>lastname in correctcase)
     * @type {Object}
     */
    DataHash.names = {};

    /**
     * Contains all mutes by ip
     * @type {Object}
     */
    DataHash.mutes = {};

    /* Write to file */
    util.json.write(DataHash.file, DataHash);
} else {
    /* Extends DataHash */
    DataHash.extend(util.sandbox.DataHash);
}

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} DataHash
     */
    Name: function () {
        return "DataHash";
    }
})