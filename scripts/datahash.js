/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

// File: datahash.js (DataHash)
// Contains DataHash, which is used to read and write values.
// Depends on: cache

// Table of Content:
// [expt]: Exports

(function () {
    var Cache = require('cache').Cache,
        DataHash = {};
    
    // TODO: More datahash properties
    DataHash.mutes = {};
    DataHash.megausers = {};
    DataHash.voices = {};
    DataHash.icons = {};
    DataHash.macros = {};
    DataHash.correctNames = {};
    DataHash.namesByIp = {};
    DataHash.tempAuth = {};
    DataHash.tempBans = {};
    DataHash.rangeBans = {};
    
    // NOTE: These properties should never be saved.
    DataHash.chatSpammers = {};
    DataHash.teamSpammers = {};
    DataHash.autoReconnectBlock = {};
    
    // Checks if DataHash.[property] has a value named [value].
    // This is to prevent values named 'hasOwnProperty' from breaking functionality.
    DataHash.hasDataProperty = function (property, value) {
        return Object.prototype.hasOwnProperty.call(DataHash[property], value);
    };
    
    // Saves the DataHash.[type] object.
    DataHash.save = function (type) {
        Cache.save("DataHash_" + type, JSON.stringify(DataHash[type]));
    };
    
    // Gets all the values from Cache.
    // This is also called right away from this module, so there's no need
    // to call it elsewhere. But it's there, I guess.
    DataHash.getData = function () {
        var entry,
            i;
        
        for (i in DataHash) {
            if (DataHash.hasOwnProperty(i)) {
                entry = DataHash[i];
                
                // filter out functions, including this one.
                if (typeof entry === 'object') {
                    DataHash[i] = Cache.get("DataHash_" + i) || {};
                }
            }
        }
    };
    
    DataHash.getData();
    
    // Exports [expt]
    
    // Set DataHash as exports, allowing require('DataHash') to be just datahash, without needing something
    // like require('DataHash').DataHash
    exports = DataHash;
}());