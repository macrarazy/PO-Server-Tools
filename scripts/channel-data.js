/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports*/

// File: channel-data.js (ChannelData)
// Contains ChannelData, which stores data (chan auth, etc.) of channels even after the server has shut down.
// Depends on: utils, jsession

// Table of Content:
// [expt]: Exports

(function () {
    var Utils = require('utils'),
        JSESSION = require('jsession').JSESSION;
    
    // ChannelData constructor
    function ChannelData(file) {
        this.file = file + ".json";
        this.data = {};
        
        // ensures the file exists.
        Utils.createFile(file, "{}");
        
        try {
            this.channelData = JSON.parse(sys.getFileContent(file));
        } catch (e) {
            sys.writeToFile(file + "-corrupted.json", sys.getFileContent(this.file));
            
            // resets the hash and clears the file (changing its content to "{}")
            this.data = {};
            this.saveData();

            print("Could not load channel data from " + this.file + ": " + e);
            print("Old channel data saved to " + file + "-corrupted.json. Channel data and the " + file + ".json file have been cleared.");
        }
        
        return this;
    }

    // Sets [property] for [chanName].
    ChannelData.prototype.save = function (chanName, property, value) {
        // this allows this function to accept ids as well.
        chanName = sys.channel(chanName) || chanName;
        
        if (this.data[chanName] === undefined) {
            this.data[chanName] = {};
        }
        
        this.data[chanName][property] = value;
        this.saveData();
        
        return this;
    };
    
    // Same as ChannelData#save, but doesn't call ChannelData#saveData
    ChannelData.prototype.set = function (chanName, property, value) {
        // this allows this function to accept ids as well.
        chanName = sys.channel(chanName) || chanName;
        
        if (this.data[chanName] === undefined) {
            this.data[chanName] = {};
        }
        
        this.data[chanName][property] = value;
        return this;
    };
    
    // Exports channel data into the channel, [chan] (channel id).
    // [chan] HAS to be a number/id!
    ChannelData.prototype.exportData = function (chan) {
        var channel = JSESSION.channels(chan) || {name: undefined},
            data = this.data[channel.name],
            cur,
            i;
        
        // don't do anything if we don't even have any data or has no entries.
        if (data === undefined || Utils.objectLength(data) === 0) {
            return;
        }
        
        for (i in data) {
            cur = data[i];
            
            // Tournament properties.
            if (['autoStartBattles', 'display'].indexOf(i) > -1) {
                channel.tour[i] = cur;
            } else {
                channel[i] = cur;
            }
        }
        
        return this;
    };
    
    // Saves all data in ChannelData#data to file.
    ChannelData.prototype.saveData = function () {
        sys.writeToFile(this.file, JSON.stringify(this.data));
        return this;
    };
    
    /*
        ChannelData.defaultValues = {
            chanAuth: {},
            tourAuth: {},
            creator: "",
            topic: "Welcome!",
            topicSetter: "",
            autoStartBattles: true,
            display: 0,
            perm: false,
            private: true,
            defaultTopic: true,
            silence: 0,
            banList: {},
            muteList: {}
        };
    */
    
    // Exports [expt]
    
    // exports an instance of ChannelData
    exports.ChannelData = new ChannelData(Config.ChannelDataFile);
    
    // exports the ChannelData constructor
    exports.channeldata_constructor = ChannelData;
}());