/*
 Dependencies:
 * modules/jsext.js
 * modules/utilities.js
 - modules/jsession.js
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
    cData = new (function () {
        var file = "Channel Data.json";
        createFile(file, "{}");

        this.channelData = {};

        if (sys.getFileContent(file) != "") {
            try {
                this.channelData = JSON.parse(sys.getFileContent(file));
            }
            catch (e) {
                this.channelData = {};
                this.save();

                if (!e.toString().contains("JSON")) {
                    print(FormatError("Could not load " + file, e));
                }
            }
        }

        this.importValue = function (from, to, property_name, default_value) {
            if (typeof from[property_name] == "undefined") {
                to[property_name] = default_value;
            } else {
                to[property_name] = from[property_name];
            }
        }

        this.importJSONValue = function (from, to, property_name) {
            if (typeof from[property_name] == "undefined") {
                to[property_name] = {};
            } else {
                to[property_name] = JSON.parse(from[property_name]);
            }
        }

        this.exportValue = function (to, property, value) {
            to[property] = value;
        }

        this.exportJSONValue = function (to, property, value) {
            to[property] = JSON.stringify(value);
        }

        this.loadDataForAll = function () {
            var cd = JSESSION.ChannelData,
                x;

            for (x in cd) {
                this.loadDataFor(cd[x]);
            }
        }

        this.loadDataFor = function (channel) {
            if (JSESSION.channels(channel) == undefined || sys.channel(channel) == undefined) {
                return "ERROR: No Channel";
                /* No such channel. Probally called by /eval */
            }

            var cChan = JSESSION.ChannelData[channel];

            if (typeof this.channelData[cChan.name] == "undefined") {
                this.generateBasicData(cChan.name);
                return;
            }

            var cData = this.channelData[cChan.name],
                isPerm = DefaultChannels.has(cChan.id) || cData.perm,
                properties = {
                    "creator": "~Unknown~",
                    "topic": "Welcome to " + cChan.name + "!",
                    "topicsetter": "",
                    "perm": isPerm,
                    "private": false,
                    "defaultTopic": true,
                    "silence": 0,
                    "toursEnabled": cData.toursEnabled,
                },
                json_properties = ["chanAuth", "banlist", "mutelist", "tourAuth"],
                tour_properties = {
                    "TourDisplay": 1,
                    "AutoStartBattles": false
                },
                x;

            for (x in properties) {
                this.importValue(cData, cChan, x, properties[x]);
            }
            for (x in json_properties) {
                this.importJSONValue(cData, cChan, json_properties[x]);
            }

            if (cChan.toursEnabled && cChan.tour == undefined) {
                cChan.tour = new Tours(cChan.id);
                var tour = cChan.tour;
                for (x in tour_properties) {
                    this.importValue(cData, tour, x, tour_properties[x]);
                }
            }
        }

        this.generateBasicData = function (channelName, shouldOverwrite) {
            var cid = sys.channelId(channelName),
                cData = this.channelData,
                cChan = JSESSION.channels(cid);

            if (cChan == undefined || sys.channel(cid) == undefined) {
                return "ERROR: No Channel";
                /* No such channel. Probally called by /eval */
            }

            if (cData.has(channelName) && !shouldOverwrite) {
                return;
            }

            var newHash = {};

            newHash.chanAuth = "{}";
            newHash.creator = cChan.creator;
            newHash.topic = cChan.topic;
            newHash.topicsetter = "";
            newHash.perm = cChan.perm;
            newHash.banlist = "{}";
            newHash.mutelist = "{}";
            newHash.private = false;
            newHash.defaultTopic = true;
            newHash.silence = 0;
            newHash.TourDisplay = 1;
            newHash.AutoStartBattles = false;
            newHash.toursEnabled = DefaultChannels.has(cid);

            cData[channelName] = newHash;

            this.save();
        }

        this.changeChanAuth = function (chan, auth) {
            var name = sys.channel(chan);

            if (!this.channelData.has(name)) {
                this.generateBasicData(name);
            }

            this.exportJSONValue(this.channelData[name], "chanAuth", auth);
            this.save();
        }

        this.changeTourAuth = function (chan, auth) {
            var name = sys.channel(chan);

            if (!this.channelData.has(name)) {
                this.generateBasicData(name);
            }

            this.exportJSONValue(this.channelData[name], "tourAuth", auth);
            this.save();
        }

        this.changeTopic = function (chan, topic, topicsetter, defaultTopic) {
            var name = sys.channel(chan);

            if (!this.channelData.has(name)) {
                this.generateBasicData(name);
            }

            var data = this.channelData[name],
                properties = {
                    "topic": topic,
                    "topicsetter": topicsetter,
                    "defaultTopic": defaultTopic
                },
                x;

            for (x in properties) {
                this.exportValue(data, x, properties[x]);
            }

            this.save();
        }

        this.changeStatus = function (chan, perm, private, silence) {
            var name = sys.channel(chan);

            if (!this.channelData.has(name)) {
                this.generateBasicData(name);
            }

            var data = this.channelData[name],
                properties = {
                    "perm": perm,
                    "private": private,
                    "silence": silence
                },
                x;

            for (x in properties) {
                this.exportValue(data, x, properties[x]);
            }

            this.save();
        }

        this.changeBans = function (chan, mutes, bans) {
            var name = sys.channel(chan);

            if (!this.channelData.has(name)) {
                this.generateBasicData(name);
            }

            var data = this.channelData[name],
                properties = {
                    "mutelist": mutes,
                    "banlist": bans
                },
                x;

            for (x in properties) {
                this.exportJSONValue(data, x, properties[x]);
            }

            this.save();
        }

        this.changeToursEnabled = function (chan, enabled) {
            var name = sys.channel(chan);

            if (!this.channelData.has(name)) {
                this.generateBasicData(name);
            }

            this.exportValue(this.channelData[name], "toursEnabled", enabled);
            this.save();
        }

        this.changeTourOptions = function (chan, display, autostartbattles) {
            var name = sys.channel(chan);

            if (!this.channelData.has(name)) {
                this.generateBasicData(name);
            }

            var data = this.channelData[name],
                properties = {
                    "TourDisplay": display,
                    "AutoStartBattles": autostartbattles
                },
                x;

            for (x in properties) {
                this.exportValue(data, x, properties[x]);
            }
        };

        this.save = function () {
            sys.writeToFile(file, JSON.stringify(this.channelData));
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

    for (x in DefaultChannels) {
        current = DefaultChannels[x];
        cData.loadDataFor(current);
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
    }
})