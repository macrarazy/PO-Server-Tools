/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: jsession.js
// Contains JSESSION, which is a replacement for PO's in-built 'SESSION', which is pretty buggy.
// No dependencies.

// Table of Content:
// [expt]: Exports.

(function () {
    function noop() {}
    
    var JSESSION = {},
        userData = {},
        channelData = {},
        globalData = {},
        userFactory = noop,
        channelFactory = noop,
        globalFactory = noop,
        usesUserFactory = false,
        usesChannelFactory = false,
        usesGlobalFactory = false,
        scriptId;

    // Refills everything, adding missing users, channels, and the global object
    JSESSION.refill = function refill() {
        var users = sys.playerIds(),
            channels = sys.channelIds(),
            length,
            cur,
            i;
    
        if (usesUserFactory) {
            length = users.length;
            for (i = 0; i < length; i += 1) {
                cur = users[i];
                if (JSESSION.users(cur) === undefined) {
                    JSESSION.createUser(cur);
                }
            }
        }
    
        if (usesChannelFactory) {
            length = channels.length;
            for (i = 0; i < length; i += 1) {
                cur = channels[i];
                if (JSESSION.channels(cur) === undefined) {
                    JSESSION.createChannel(cur);
                }
            }
        }
    
        if (usesGlobalFactory) {
            if (JSESSION.global() === undefined) {
                globalData = new globalFactory();
            }
        }
    };
    
    // Attempts to return a user object
    JSESSION.users = function (id) {
        if (!usesUserFactory) {
            return;
        }
    
        if (typeof userData[id] === 'undefined') {
            return;
        }
    
        return userData[id];
    };
    
    // Attempts to return a channel object.
    JSESSION.channels = function (id) {
        if (!usesChannelFactory) {
            return;
        }
    
        if (typeof channelData[id] === 'undefined') {
            return;
        }
    
        return channelData[id];
    };
    
    // Attempts to return a global object.
    JSESSION.global = function () {
        if (!usesGlobalFactory) {
            return;
        }
    
        return globalData;
    };
    
    // Identifies the script as a certain id, clearing everything if they don't match
    // or if no script was registered beforehand.
    // Then refills.
    JSESSION.identifyScriptAs = function (script) {
        if (scriptId === undefined || scriptId !== script) {
            JSESSION.clearAll();
        }
    
        scriptId = script;
        JSESSION.refill();
    };
    
    // Registers the user constructor.
    JSESSION.registerUserFactory = function (factory) {
        if (typeof factory !== "function") {
            return;
        }
    
        userFactory = factory;
        usesUserFactory = true;
    };
    
    // Registers the channel constructor.
    JSESSION.registerChannelFactory = function (factory) {
        if (typeof factory !== "function") {
            return;
        }
    
        channelFactory = factory;
        usesChannelFactory = true;
    };
    
    // Registers the global constructor.
    JSESSION.registerGlobalFactory = function (factory) {
        if (typeof factory !== "function") {
            return;
        }
    
        globalFactory = factory;
        usesGlobalFactory = true;
		
        globalData = new factory();
    };
    
    // Creates a channel object.
    // Used internally. Should be used in afterChannelCreated event as well.
    JSESSION.createChannel = function (id) {
        if (!usesChannelFactory || typeof channelData[id] !== "undefined") {
            return false;
        }
		
        channelData[id] = new channelFactory(id);
        return true;
    };
    
    // Destroys a channel object.
    // Should be used in afterChannelDestroyed event.
    JSESSION.destroyChannel = function (id) {
        if (!usesChannelFactory || id === 0 || typeof channelData[id] === "undefined") {
            return false;
        }
		
        delete channelData[id];
        return true;
    };
    
    // Creates a user object.
    // Used internally. Should be used in the afterLogIn event as well.
    JSESSION.createUser = function (id) {
        if (!usesUserFactory || typeof userData[id] !== "undefined") {
            return false;
        }
		
        userData[id] = new userFactory(id);
        return true;
    };
    
    // Destroys a user object.
    // Should be used in the afterLogOut event.
    JSESSION.destroyUser = function (id) {
        if (!usesUserFactory || typeof userData[id] === "undefined") {
            return false;
        }
		
        delete userData[id];
        return true;
    };
    
    // If a user exists [by id].
    JSESSION.hasUser = function (id) {
        return typeof userData[id] !== "undefined";
    };
    
    // If a channel exists [by id].
    JSESSION.hasChannel = function (id) {
        return typeof channelData[id] !== "undefined";
    };
	
    JSESSION.getUserData = function () {
        return userData;
    };
    
    JSESSION.getChannelData = function () {
        return channelData;
    };
    
    JSESSION.getGlobalData = function () {
        return globalData;
    };
    
    // Resets all data.
    // Used internally. It's not recommended to use this function.
    JSESSION.clearAll = function () {
        userData = {};
        channelData = {};
        globalData = {};
        
        userFactory = noop;
        channelFactory = noop;
        globalFactory = noop;
        
        usesUserFactory = false;
        usesChannelFactory = false;
        usesGlobalFactory = false;
        
        scriptId = undefined;
    };
    
    // Exports [expt]
    
    // export JSESSION
    module.exports = JSESSION;
}());