/**
 * @fileOverview Contains default channels and channelData
 * @author TheUnknownOne
 * @version 3.0.0 Alpha 1
 */

Channels = {
    mafia: util.channel.create("Mafia Channel"),
    trivia: util.channel.create("Trivia"),
    trivreview: util.channel.create("Trivia Review"),
    watch: util.channel.create("Watch"),
    staff: util.channel.create("Staff Channel"),
    script: util.channel.create("Eval 51")
};

(function () {
    var x;
    
    Channels.ids = [];
    
    for (x in Channels) {
        if (!Array.isArray(Channels[x])) {
            Channels[x] = util.channel.id(Channels[x]);
        
            Channels.ids.push(Channels[x]);
        }
    }
}());

// TODO: NEW STUFF

if (!GLOBAL["cData"]) {
    /**
     * Channel Data Manager
     * @class
     * @type {Object}
     */
    cData = new (function () {
        this.file = "ChannelData.json";

        /* Creates the file */
        util.file.create(this.file, "{}");

        this.channelData = util.json.read(this.file);

        /**
         * Imports a JSON property
         * @param {Object} from Object from where the property comes
         * @param {Object} to Object where the property is copied to
         * @param {Object} property_name The property's name
         * @return {Object} this
         */
        this.importJSON = function (from, to, property_name) {
            if (typeof from[property_name] === "undefined") {
                to[property_name] = {};
            } else {
                to[property_name] = JSON.parse(from[property_name]);
            }

            return this;
        };

        /**
         * Loads all channel data
         * @return {Object} this
         */
        this.loadAll = function () {
            var cd = sys.channelIds(),
                x;

            for (x in cd) {
                this.loadFor(cd[x]);
            }

            return this;
        };

        /**
         * Loads data for a specific channel
         * @param {Number} channel The channel's id
         * @return {Object} this
         */
        this.loadFor = function (channel) {
            var chan = JSESSION.channels(channel),
                data,
                isPerm,
                properties,
                json_properties,
                tour_properties,
                x,
                tour;

            if (!chan) {
                return this;
            }

            data = this.channelData[chan.name];

            if (!data) {
                this.importFromChannel(chan.id);
                return this;
            }

            isPerm = Channels.ids.has(chan.id),
                properties = {
                    "creator": "~Unknown~",
                    "topic": "Welcome to " + chan.name + "!",
                    "topicsetter": "",
                    "perm": isPerm,
                    "private": false,
                    "defaultTopic": true,
                    "silence": 0,
                    "toursEnabled": isPerm
                },
                json_properties = ["chanAuth", "banlist", "mutelist", "tourAuth"],
                tour_properties = {
                    "TourDisplay": 1,
                    "AutoStartBattles": false
                };

            for (x in properties) {
                chan[x] = data[x] || properties[x];
            }
            for (x in json_properties) {
                this.importJSON(cData, chan, json_properties[x]);
            }

            if (Tours.channels.has(chan.id)) {
                tour = Tours.channels[chan.id];
                for (x in tour_properties) {
                    tour.setOption(x, tour_properties[x]);
                }
            }

            return this;
        };

        /**
         * Imports all data of a specific channel into cData
         * @param {CID} id Channel identifier
         * @param [shouldOverwrite=false] If the data should be overwritten.
         * @return {Object} this
         */
        this.importFromChannel = function (id, shouldOverwrite) {
            var name = util.channel.name(id),
                data = this.channelData,
                chan = JSESSION.channels(util.channel.id(id)),
                hash = {},
                props = [
                    "creator", "topic", "topicsetter", "perm", "private", "defaultTopic", "silence", "banlist",
                    "mutelist", "chanAuth", "tourAuth"
                ],
                x,
                current;

            if (!chan) {
                return this;
            }

            if (data.has(name) && !shouldOverwrite) {
                return this;
            }

            for (x in props) {
                current = props[x];
                if (chan.has(current)) {
                    hash[current] = chan[current];
                }
            }

            data[name] = hash;

            this.save();

            return this;
        };

        /**
         * Sets (cid)'s cData (stored) property (name) to (value). Saves if (noSave) is false
         * @param {CID} cid Channel identifier
         * @param {String} name The property name
         * @param {*} value (name)'s value.
         * @param [noSave=false] If the data shouldn't be saved to disk right away
         * @return {Object} this
         */
        this.set = function (cid, name, value, noSave) {
            var chan = this.channelData[util.channel.name(cid)];

            if (!chan) {
                return this;
            }

            chan[name] = value;

            if (!noSave) {
                this.save();
            }
        };

        /**
         * Saves all data to disk.
         * @return {Object} this
         */
        this.save = function () {
            util.json.write(this.file, this.channelData);

            return this;
        };
    })();
}

/* Creates old perm channels */
(function () {
    var chanList = cData.channelData,
        x,
        c_chan,
        creator_id;

    for (x in chanList) {
        c_chan = chanList[x];
        if (c_chan.perm && !sys.existChannel(x)) {
            creator_id = sys.id(c_chan.creator);
            if (!creator_id) {
                creator_id = 0;
            }

            script.beforeChannelCreated(util.channel.create(x), x, creator_id);
        }
    }

    for (x in Channels) {
        cData.loadFor(Channels[x]);
    }
}());

({
    /**
     * Returns the name of this module
     * @private
     * @return {String}
     */
    Name: function () {
        return "Channel Data Manager";
    },
    /**
     * Returns the hooks of this module
     * @private
     * @return {Object}
     */
    Hooks: function () {
        return {
            "afterChannelCreated": function (chan, name, src) {
                cData.loadFor(chan);
            },
            "beforeChannelDestroyed": function (chan) {
                return Channels.ids.contains(chan) || JSESSION.channels(chan).perm;
            },
            "afterChannelDestroyed": function (chan) {
                util.watch.channel(chan, "Destroyed");
            },
            "afterLogIn": function (src) {
                var channels,
                    auth = util.player.auth(src),
                    user = JSESSION.users(src) || {originalName: "", megauser: false};

                if (Config.AutoChannelJoin) {
                    channels = [Channels.mafia, Channels.trivia];

                    if (auth > 0 || JSESSION.channels(Channels.watch).isChanMod(src)) {
                        channels.push(Channels.watch);
                    }

                    if (user.megauser || auth > 0 || JSESSION.channels(Channels.staff).isChanMod(src)) {
                        channels.push(Channels.staff);
                    }

                    if (auth > 1 || JSESSION.channels(Channels.script).isChanMod(src) || DataHash.evalOperators.has(user.originalName.toLowerCase())) {
                        channels.push(Channels.script);
                    }
                    if (auth > 1 || JSESSION.channels(Channels.trivreview).isChanMod(src)) {
                        channels.push(Channels.trivreview);
                    }

                    util.channel.putIn(src, channels);
                }
            },
            "warning": function (from, warning) {
                bot.sendAll("Script Warning (can safely be ignored) received from " + from + ": " + warning, Channels.watch);
            },
            "switchError": function (newScript) {
                bot.sendAll("Automatically recovered from a fatal exception. Error: " + util.error.format(newScript), Channels.watch);
            }
        };
    }
})
