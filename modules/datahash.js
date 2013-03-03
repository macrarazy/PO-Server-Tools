var DataHash;

/* Extends util with DataHash utilities */
util.datahash = {
    /* Writes a DataHash property to the given (cacheInst) */
    write: function (cacheInst, name) {
        if (!name) {
            if (cache) {
                name = cacheInst;
                cacheInst = cache;
            }
        }
        cacheInst.writeJSON(name, DataHash[name]);

        return this;
    },
    /* Resolves a player's hostname and country. */
    resolveLocation: function (src, ip, sync) {
        var loc = DataHash.locations,
            url = "http://ip2country.sourceforge.net/ip2c.php?ip=" + ip,
            code,
            json_code;

        src = util.player.id(src);

        if (!ip && src) {
            ip = util.player.ip(src);
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
                    util.datahash.write(cache, "locations");

                    if (sys.loggedIn(src)) {
                        if (code.country_name === "Anonymous Proxy") {
                            util.message.failWhale(src, 0);
                            bot.send(src, "Remove the proxy to enter the server.");
                            bot.sendAll(player.player(src) + " tried to use a proxy.", Channels.watch);
                            util.mod.kickAll(src);
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
                util.datahash.write(cache, "locations");

                if (sys.loggedIn(src) && util.player.auth(src) < 1) {
                    if (code.country_name === "Anonymous Proxy") {
                        util.message.failWhale(src, 0);
                        bot.send(src, "Remove your proxy to enter the server.");
                        util.watch.player(src, "", "kicked for using a proxy");
                        util.mod.kickAll(src);
                    }
                }
            }
        }

        return this;
    }
};

(function () {
    var x;

    /* Hash in which all kinds of data can be stored. */
    DataHash = {};

    /* File which all data is stored in. */
    DataHash.file = "DataHash.json";
    
    /* Reads DataHash from file */
    util.sandbox.DataHash = util.json.read(DataHash.file);

    util.sandbox.DataHashNeeds = {
        /**
         * Stores proper cased names as (name.lowercase=>name.correctcase) and player last names by ip (ip=>lastname in correctcase)
         * @type {Object}
         */
        names: {},

        /**
         * Contains all mutes by ip
         * @type {Object}
         */
        mutes: {},

        /**
         * Contains all player locations by ip (country only)
         * @type {Object}
         */
        locations: {},

        /**
         * The currently running poll
         * @type {Object}
         */
        poll: {
            mode: 0,
            subject: "",
            starter: "",
            options: {},
            votes: 0
        },

        /**
         * Contains all of the evaluation operators
         * @type {Object}
         */
        evalOperators: {}, // NOTE: evalops -> evalOperators

        /**
         * Contains all auto idles
         * @type {Object}
         */
        idles: {}
    };
    
    for (x in util.sandbox.DataHashNeeds) {
        util.sandbox.dhcurrval = util.sandbox.DataHashNeeds[x];

        if (!util.sandbox.DataHash.has(x)) {
            util.sandbox.DataHash[x] = util.sandbox.dhcurrval;
        }

        util.sandbox.dhNeedsWrite = true;
    }

    if (util.sandbox.dhNeedsWrite) {
        /* Write to file */
        util.json.write(DataHash.file, DataHash);

        delete util.sandbox.dbNeedsWrite;
    }

    /* Extends DataHash */
    DataHash.extend(util.sandbox.DataHash);
});

({
    Name: function () {
        return "DataHash";
    },
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
