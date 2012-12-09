/**
 * @fileOverview DataHash (Object containing data)
 * @author TheUnknownOne
 * @version 3.0.0 Alpha 1
 */

/* Extends util with DataHash utilities */
/**
 * DataHash Utilities
 * @type {Object}
 */
Umbrella.create("util.datahash", {
    /**
     * Writes a DataHash property to the given (cacheInst)
     * @param {Cache} cacheInst An instance of Cache
     * @param {String} name Name of the DataHash property
     * @return {Object} this
     */
    write: function (cacheInst, name) {
        cacheInst.writeJSON(name, DataHash[name]);

        return this;
    },
    /**
     * Resolves a player's hostname and country
     * @param {PID} [src] Player identifier
     * @param {String} [ip] Player IP. Required if (src) isn't passed/doesn't exist/isn't online
     * @param {Boolean} [sync=false] If the webCall is synchronous
     */
    resolveLocation: function (src, ip, sync) {
        var loc = DataHash.locations,
            url = "http://ip2country.sourceforge.net/ip2c.php?ip=" + ip,
            code,
            json_code;

        Umbrella.load(["util.player", "util.bot"], ["player", "bot"]);
        
        src = player.id(src);

        if (!ip && src) {
            ip = player.ip(src);
        }

        if (!loc.has(ip)) {
            loc[ip] = {
                'hostname': 'pending',
                'country_code': 'pending',
                'country_name': 'pending'
            };

            if (!sync) {
                sys.webCall(url, function (json_code) {
                    json_code = json_code
                        .replace("ip", '"ip"')
                        .replace("hostname", '"hostname"')
                        .replace("country_code", '"country_code"')
                        .replace("country_name", '"country_name"');
                    
                    code = JSON.parse(json_code);

                    loc[ip] = code;
                    Umbrella.get("util.datahash").write(cache, "locations");

                    if (sys.loggedIn(src)) {
                        if (code.country_name === "Anonymous Proxy") {
                            Umbrella.get("util.message").failWhale(src, 0);
                            bot.send(src, "Remove the proxy to enter the server.");
                            bot.sendAll(player.player(src) + " tried to use a proxy.", Channels.watch);
                            Umbrella.get("util.mod").kickAll(src);
                        }
                    }
                });
            } else {
                json_code = sys.synchronousWebCall(url)
                    .replace("ip", '"ip"')
                    .replace("hostname", '"hostname"')
                    .replace("country_code", '"country_code"')
                    .replace("country_name", '"country_name"');
                
                code = JSON.parse(json_code);

                loc[ip] = code;
                Umbrella.get("util.datahash").write(cache, "locations");

                if (sys.loggedIn(src) && util.player.auth(src) < 1) {
                    if (code.country_name === "Anonymous Proxy") {
                        Umbrella.get("util.message").failWhale(src, 0);
                        bot.send(src, "Remove your proxy to enter the server.");
                        Umbrella.get("util.watch").player(src, "", "kicked for using a proxy");
                        Umbrella.get("util.mod").kickAll(src);
                    }
                }
            }
        }
        
        Umbrella.unload();

        return this;
    }
});

Umbrella.load("util.json", "json");

/**
 * Hash in which all kinds of data can be stored
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
util.sandbox.DataHash = json.read(DataHash.file);

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

    /**
     * The currently running poll
     * @type {Object}
     */
    DataHash.poll = {
        mode: 0,
        subject: "",
        starter: "",
        options: {},
        votes: 0
    };

    /**
     * Contains all of the evaluation operators
     * @type {Object}
     */
    DataHash.evalOperators = {}; // NOTE: evalops -> evalOperators

    /* Write to file */
    json.write(DataHash.file, DataHash);
} else {
    /* Extends DataHash */
    DataHash.extend(util.sandbox.DataHash);
}

Umbrella.unload();

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} DataHash
     */
    Name: function () {
        return "DataHash";
    },
    /**
     * Returns the hooks of this module
     * @private
     * @return {Object}
     */
    Hooks: function () {
        return {
            "commandPlayerAuthRequested": function (src, message, chan, commandName) {
                if (commandName === "eval" && DataHash.evalOperators.has(sys.name(src).toLowerCase())) { // HARDCODED
                    return 3;
                }
            }
        };
    }
})
