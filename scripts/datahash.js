/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports: true*/

// File: datahash.js (DataHash)
// Contains DataHash, which is used to read and write values.
// Depends on: cache, watch-utils

// Table of Content:
// [expt]: Exports

(function () {
    var Cache = require('cache').Cache,
        WatchUtils = require('watch-utils');
    
    var DataHash = {},
        IP_URL = "http://ip2country.sourceforge.net/ip2c.php?ip=";
    
    // TODO: More datahash properties
    DataHash.mutes = {};
    DataHash.megausers = {};
    DataHash.voices = {};
    DataHash.icons = {};
    DataHash.macros = {};
    DataHash.correctNames = {};
    DataHash.namesByIp = {};
    DataHash.tempAuth = {};
    // TODO: tempbans -> ipBans. tempbans are replaced by po's new tempban system.
    DataHash.ipBans = {};
    DataHash.rangeBans = {};
    DataHash.locations = {};
    DataHash.autoIdles = {};
    
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
    // Note that we don't have to call JSON.stringify, this is already done by the Cache itself.
    DataHash.save = function (type) {
        Cache.save("DataHash_" + type, DataHash[type]);
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
    

    // NOTE: All requests are async
    DataHash.resolveLocation = function (src, ip) {
        var resp;
        
        if (!DataHash.hasDataProperty('locations', ip)) {
            DataHash.locations[ip] = {
                'hostname': 'pending',
                'country_code': 'pending',
                'country_name': 'pending'
            };
            
            sys.webCall(IP_URL + ip, function (json) {
                // They return malformed JSON, but a valid JavaScript Object.
                var resp = eval(json);
                
                DataHash.locations[ip] = resp;

                if (sys.loggedIn(src)) {
                    if (resp.country_name === "Anonymous Proxy") {
                        WatchUtils.logPlayerEvent(src, "Proxy detected");
                    }
                }
            });
        }
    };
        
    DataHash.getData();
    
    // Exports [expt]
    
    // Set DataHash as exports, allowing require('DataHash') to be just datahash, without needing something
    // like require('DataHash').DataHash
    exports = DataHash;
}());