/*
 Dependencies:
 * modules/jsext.js
 * modules/utilities.js
 - modules/jsession.js
 - modules/datahash.js
 */

/**
 * @fileOverview Contains default channels and channelData
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

mafiachan = util.channel.create("Mafia Channel");
trivia = util.channel.create("Trivia");
trivreview = util.channel.create("Trivia Review");
watch = util.channel.create("Watch");
staffchannel = util.channel.create("Staff Channel");
scriptchannel = util.channel.create("Eval Area");

Channels = [0, mafiachan, trivia, trivreview, watch, staffchannel, scriptchannel];

if (!cData) {
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

        this.importJSON = function (from, to, property_name) {
            if (typeof from[property_name] === "undefined") {
                to[property_name] = {};
            } else {
                to[property_name] = JSON.parse(from[property_name]);
            }
        };

        this.loadDataForAll = function () {
            var cd = JSESSION.ChannelData,
                x;

            for (x in cd) {
                this.loadDataFor(cd[x]);
            }
        };

        this.loadDataFor = function (channel) {
            var chan = JSESSION.channels(channel),
                data,
                isPerm,
                properties,
                json_properties,
                tour_properties,
                x,
                tour;

            if (!chan) {
                return;
            }

            data = this.channelData[chan.name];

            if (!data) {
                return this.importFromChannel(chan.id);
            }

            isPerm = Channels.has(chan.id) || cData.perm,
                properties = {
                    "creator": "~Unknown~",
                    "topic": "Welcome to " + chan.name + "!",
                    "topicsetter": "",
                    "perm": isPerm,
                    "private": false,
                    "defaultTopic": true,
                    "silence": 0,
                    "toursEnabled": cData.toursEnabled
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
        };

        this.importFromChannel = function (id, shouldOverwrite) {
            var name = util.channel.name(id),
                data = this.channelData,
                chan = JSESSION.channels(cid),
                hash = {},
                props = [
                    "creator", "topic", "topicsetter", "perm", "private", "defaultTopic", "silence", "banlist",
                    "mutelist", "chanAuth", "tourAuth"
                ],
                x,
                current;

            if (!chan) {
                return "ERROR: No Channel";
            }

            if (data.has(name) && !shouldOverwrite) {
                return;
            }

            for (x in props) {
                current = props[x];
                if (chan.has(current)) {
                    hash[current] = chan[current];
                }
            }

            data[name] = hash;

            this.save();
        };

        this.set = function (cid, name, value, noSave) {
            var chan = this.channelData[util.channel.name(cid)];

            if (!chan) {
                return;
            }

            chan[name] = value;

            if (!noSave) {
                this.save();
            }
        };

        this.save = function () {
            util.json.write(this.file, this.channelData);
        };
    })();
}

/* Creates old perm channels */
(function () {
    var chanList = cData.channelData,
        x,
        c_chan,
        creator_id,
        current;

    for (x in chanList) {
        c_chan = chanList[x];
        if (c_chan.perm && !sys.existChannel(x)) {
            creator_id = util.player.id(c_chan.creator);
            if (creator_id === -1) {
                creator_id = 0;
            }

            script.beforeChannelCreated(util.channel.create(x), x, creator_id);
        }
    }

    for (x in Channels) {
        cData.loadDataFor(Channels[x]);
    }
}());

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} Channel Data Manager
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
            "beforeChannelDestroyed": function (chan) {
                return Channels.has(chan) || JSESSION.channels(chan).perm;
            },
            "afterChannelDestroyed": function (chan) {
                util.watch.channel(chan, "Destroyed");
            },
            "afterLogIn": function (src) {
                var channels,
                    auth = util.player.auth(src);

                if (Config.AutoChannelJoin) {
                    channels = [mafiachan, trivia];

                    if (auth > 0 || JSESSION.channels(watch).isChanMod(src)) {
                        channels.push(watch);
                    }

                    if (JSESSION.users(src).megauser || auth > 0 || JSESSION.channels(staffchannel).isChanMod(src)) {
                        channels.push(staffchannel);
                    }

                    if (auth > 1 || JSESSION.channels(scriptchannel).isChanMod(src) || DataHash.evalops.has(srcToLower)) {
                        channels.push(scriptchannel);
                    }
                    if (auth > 1 || JSESSION.channels(trivreview).isChanMod(src)) {
                        channels.push(trivreview);
                    }

                    util.channel.putIn(src, channels);
                }
            }
        };
    }
})