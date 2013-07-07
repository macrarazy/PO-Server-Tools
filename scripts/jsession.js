/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, Qt, print, gc, version,
    Config: true, require: false, module: true, exports: true*/

// File: jsession.js
// Contains JSESSION, which is a replacement for PO's in-built 'SESSION', which is pretty buggy.
// No dependencies.

// Table of Content:
// [ctor]: JSESSION constructor.
// [expt]: Exports.

(function () {
    // JSESSION constructor [ctor]
    function JSESSION() {
        this.UserData = {};
        this.ChannelData = {};
        this.GlobalData = {};
    
        this.UserFunc = function () {};
        this.ChannelFunc = function () {};
        this.GlobalFunc = function () {};
    
        this.UsesUser = false;
        this.UsesChannel = false;
        this.UsesGlobal = false;
    
        this.ScriptID = undefined;
    }
    
    // Refills everything, adding missing users, channels, and the global object
    JSESSION.prototype.refill = function () {
        var users = sys.playerIds(),
            channels = sys.channelIds(),
            i,
            cur,
            length;
    
        if (this.UsesUser) {
            length = users.length;
            for (i = 0; i < length; ++i) {
                cur = users[i];
                if (this.users(cur) === undefined) {
                    this.createUser(cur);
                }
            }
        }
    
        if (this.UsesChannel) {
            length = channels.length;
            for (i = 0; i < length; ++i) {
                cur = channels[i];
                if (this.channels(cur) === undefined) {
                    this.createChannel(cur);
                }
            }
        }
    
        if (this.UsesGlobal) {
            if (this.global() === undefined) {
                this.GlobalData = new this.GlobalFunc();
            }
        }
    };
    
    // Attempts to return a user object
    JSESSION.prototype.users = function (id) {
        if (!this.UsesUser) {
            return;
        }
    
        if (typeof this.UserData[id] === 'undefined') {
            return;
        }
    
        return this.UserData[id];
    };
    
    // Attempts to return a channel object.
    JSESSION.prototype.channels = function (id) {
        if (!this.UsesChannel) {
            return;
        }
    
        if (typeof this.ChannelData[id] === 'undefined') {
            return;
        }
    
        return this.ChannelData[id];
    };
    
    // Attempts to return a global object.
    JSESSION.prototype.global = function () {
        if (!this.UsesGlobal) {
            return;
        }
    
        if (typeof this.GlobalData === 'undefined') {
            return;
        }
    
        return this.GlobalData;
    };
    
    // Identifies the script as a certain id, clearing everything if they don't match
    // or if no script was registered beforehand.
    // Then refills.
    JSESSION.prototype.identifyScriptAs = function (script) {
        if (this.ScriptID === undefined || this.ScriptID !== script) {
            this.clearAll();
        }
    
        this.ScriptID = script;
        this.refill();
    };
    
    // Registers the user constructor.
    JSESSION.prototype.registerUser = function (func) {
        if (typeof func !== "function") {
            return;
        }
    
        this.UserFunc = func;
        this.UsesUser = true;
    };
    
    // Registers the channel constructor.
    JSESSION.prototype.registerChannel = function (func) {
        if (typeof func !== "function") {
            return;
        }
    
        this.ChannelFunc = func;
        this.UsesChannel = true;
    };
    
    // Registers the global constructor.
    JSESSION.prototype.registerGlobal = function (Func) {
        if (typeof Func !== "function") {
            return;
        }
    
        this.GlobalFunc = Func;
        this.UsesGlobal = true;
        this.GlobalData = new Func();
    };
    
    // Creates a channel object.
    // Used internally. Should be used in afterChannelCreated event as well.
    JSESSION.prototype.createChannel = function (id) {
        if (!this.UsesChannel) {
            return false;
        }
    
        if (typeof this.ChannelData[id] !== "undefined") {
            return false;
        }
    
        if (sys.channel(id) === undefined) {
            return false;
        }
    
        this.ChannelData[id] = new this.ChannelFunc(id);
        return true;
    };
    
    // Destroys a channel object.
    // Should be used in afterChannelDestroyed event.
    JSESSION.prototype.destroyChannel = function (id) {
        if (!this.UsesChannel) {
            return false;
        }
        if (id === 0) {
            return false;
        }
    
        if (typeof this.ChannelData[id] === "undefined") {
            return false;
        }
    
        delete this.ChannelData[id];
        return true;
    };
    
    // Creates a user object.
    // Used internally. Should be used in the afterLogIn event as well.
    JSESSION.prototype.createUser = function (id) {
        if (!this.UsesUser) {
            return false;
        }
    
        if (typeof this.UserData[id] !== "undefined") {
            return false;
        }
    
        if (sys.name(id) === undefined) {
            return false;
        }
    
        this.UserData[id] = new this.UserFunc(id);
        return true;
    };
    
    // Destroys a user object.
    // Should be used in the afterLogOut event.
    JSESSION.prototype.destroyUser = function (id) {
        if (!this.UsesUser) {
            return false;
        }
        if (typeof this.UserData[id] === "undefined") {
            return false;
        }
        if (sys.name(id) === undefined) {
            return false;
        }
    
        delete this.UserData[id];
        return true;
    };
    
    // If a user exists [by id]
    JSESSION.prototype.hasUser = function (src) {
        return this.UserData.hasOwnProperty(src);
    };
    
    // If a channel exists [by id]
    JSESSION.prototype.hasChannel = function (channel) {
        return this.ChannelData.hasOwnProperty(channel);
    };
    
    // Resets all data.
    // Used internally. It's not recommended to use this function.
    JSESSION.prototype.clearAll = function () {
        this.UserData = {};
        this.ChannelData = {};
        this.GlobalData = {};
    
        this.UserFunc = function () {};
        this.ChannelFunc = function () {};
        this.GlobalFunc = function () {};
    
        this.UsesUser = false;
        this.UsesChannel = false;
        this.UsesGlobal = false;
    
        this.ScriptID = undefined;
    };
    
    // Exports [expt]
    
    // export JSESSION
    exports.JSESSION = new JSESSION();
    
    // export the JSESSION constructor (used with Utils.updatePrototype)
    exports.jsession_constructor = JSESSION;
}());