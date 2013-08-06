/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: channel-data.js (ChannelData)
// Contains ChannelData, which stores data (chan auth, etc.) of channels even after the server has shut down.
// Depends on: jsession, utils

// Table of Content:
// [expt]: Exports

(function () {
    var JSESSION = require('jsession'),
        Utils = require('utils');
    
    var ChannelData = {};
	
    // ChannelData constructor
    ChannelData.load = function (file) {
        ChannelData.file = file + ".json";
        ChannelData.data = {};
        
        // ensures the file exists.
        Utils.createFile(file, "{}");
        
        try {
            ChannelData.data = JSON.parse(sys.getFileContent(ChannelData.file));
        } catch (e) {
            sys.writeToFile(file + "-corrupted.json", sys.getFileContent(ChannelData.file));
            
            // resets the hash and clears the file (changing its content to "{}")
            ChannelData.data = {};
            ChannelData.saveData();

            print("Could not load channel data from " + ChannelData.file + ": " + e);
            print("Old channel data saved to " + file + "-corrupted.json. Channel data and the " + file + ".json file have been cleared.");
        }
        
        return this;
    };

    // Sets [property] for [chanName].
    ChannelData.save = function (chanName, property, value) {
        // this allows this function to accept ids as well.
        chanName = sys.channel(chanName) || chanName;
        
        if (ChannelData.data[chanName] === undefined) {
            ChannelData.data[chanName] = {};
        }
        
        ChannelData.data[chanName][property] = value;
        ChannelData.saveData();
        return ChannelData;
    };
    
    // Same as ChannelData#save, but doesn't call ChannelData#saveData
    ChannelData.set = function (chanName, property, value) {
        // this allows this function to accept ids as well.
        chanName = sys.channel(chanName) || chanName;
        
        if (ChannelData.data[chanName] === undefined) {
            ChannelData.data[chanName] = {};
        }
        
        ChannelData.data[chanName][property] = value;
        return ChannelData;
    };
    
    // Exports channel data into the channel, [chan] (channel id).
    // [chan] HAS to be a number/id!
    ChannelData.exportData = function (chan) {
        var channel = (JSESSION.channels(chan) || {name: undefined}),
            data = ChannelData.data[channel.name],
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
        
        return ChannelData;
    };
    
    // Saves all data in ChannelData#data to file.
    ChannelData.saveData = function () {
        sys.writeToFile(ChannelData.file, JSON.stringify(ChannelData.data));
        return ChannelData;
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
    module.exports = ChannelData;
}());