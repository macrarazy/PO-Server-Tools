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
        },
        //TODO:JSDOC update
        /**
         * Resolves a player's hostname and country
         * @param src
         * @param ip
         * @param sync
         */
        resolveLocation: function (src, ip, sync) {
            var loc = DataHash.locations,
                url = "http://ip2country.sourceforge.net/ip2c.php?ip=" + ip,
                code,
                json_code;

            if (!loc.has(ip)) {
                loc[ip] = {
                    'hostname': 'pending',
                    'country_code': 'pending',
                    'country_name': 'pending'
                };

                if (!sync) {
                    sys.webCall(url, function (json_code) {
                        json_code = json_code.replace("ip", '"ip"').replace("hostname", '"hostname"').replace("country_code", '"country_code"').replace("country_name", '"country_name"');
                        code = JSON.parse(json_code);

                        loc[ip] = code;
                        util.datahash.write("locations");

                        if (sys.loggedIn(src)) {
                            if (code.country_name === "Anonymous Proxy") {
                                //TODO: add util.message.failWhale and util.message.stfuTruck
                                util.message.failWhale(src, 0);
                                bot.sendMessage(src, "Remove the proxy to enter the server.");
                                bot.sendAll(util.player.player(src) + " tried to use a proxy.", watch);
                                util.mod.kickAll(src);
                            }
                        }
                    });
                } else {
                    json_code = sys.synchronousWebCall(url).replace("ip", '"ip"').replace("hostname", '"hostname"').replace("country_code", '"country_code"').replace("country_name", '"country_name"');
                    code = JSON.parse(json_code);

                    loc[ip] = code;
                    util.datahash.write("locations");

                    if (sys.loggedIn(src)) {
                        if (code.country_name === "Anonymous Proxy") {
                            util.message.failWhale(src, 0);
                            bot.sendMessage(src, "Remove the proxy to enter the server.");
                            bot.sendAll(util.player.player(src) + " tried to use a proxy.", watch);
                            util.mod.kickAll(src);
                        }
                    }
                }

            }
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

    /**
     * Contains all player locations by ip (country only)
     * @type {Object}
     */
    DataHash.locations = {};

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