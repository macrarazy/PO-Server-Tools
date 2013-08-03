/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: bot.js
// Contains the bot message sending functions (and a copy of escapeHtml found in utils).
// These functions are very commonly used, be careful not to break anything.
// Depends on: options

// No Table of Content.

(function () {
    var Options = require('options');
    
    function escapeHtml(msg) {
        return msg.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/\>/g, "&gt;");
    }
    
    // Sends a bot message to a player
    exports.sendMessage = function (src, message, channel) {
        if (typeof channel === "undefined") {
            sys.sendHtmlMessage(
                src,
                "<font color='" + Options.Bot.color + "'><timestamp/><b>" + Options.Bot.name + ":</b></font> " + message
            );
            return;
        }
        
        sys.sendHtmlMessage(
            src,
            "<font color='" + Options.Bot.color + "'><timestamp/><b>" + Options.Bot.name + ":</b></font> " + message,
            channel
        );
    };
    
    // Same as sendMessage, but escapes html in the message
    exports.escapeMessage = function (src, message, channel) {
        exports.sendMessage(src, escapeHtml(message), channel);
    };
    
    // Sends a bot message to everyone
    exports.sendAll = function (message, channel) {
        if (typeof channel === "undefined") {
            sys.sendHtmlAll(
                "<font color='" + Options.Bot.color + "'><timestamp/><b>" + Options.Bot.name + ":</b></font> " + message
            );
            return;
        }
        
        sys.sendHtmlAll(
            "<font color='" + Options.Bot.color + "'><timestamp/><b>" + Options.Bot.name + ":</b></font> " + message,
            channel
        );
    };
    
    // Same as sendAll, but escapes html in the message
    exports.escapeAll = function (message, channel) {
        exports.sendAll(escapeHtml(message), channel);
    };
    
    // Expose escapeHtml (also in utils)
    exports.escapeHtml = escapeHtml;
    
    // Why not!
    exports.stfuTruck = function (src, chan) {
        exports.sendMessage(src, '|^^^^^^^^^^^\\||____', chan);
        exports.sendMessage(src, '| The STFU Truck  |||""\'|""\\__,_', chan);
        exports.sendMessage(src, '| _____________ l||__|__|__|)', chan);
        exports.sendMessage(src, '...|(@)@)"""""""**|(@)(@)**|(@)', chan);
    };
    
    exports.failWhale = function (src, chan) {
        exports.sendMessage(src, "▄██████████████▄▐█▄▄▄▄█▌", chan);
        exports.sendMessage(src, "██████▌▄▌▄▐▐▌███▌▀▀██▀▀", chan);
        exports.sendMessage(src, "████▄█▌▄▌▄▐▐▌▀███▄▄█▌", chan);
        exports.sendMessage(src, "▄▄▄▄▄██████████████▀", chan);
    };
}());