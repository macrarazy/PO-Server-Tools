/**
 * @fileOverview DataHash (Object containing data)
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

/*
Dependencies:
    - modules/jsext.js
    - modules/utilities.js
 */
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
    /* Define default DataHash properties */

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