/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports*/

// File: bot.js
// Contains the bot message sending functions (and a copy of escapeHtml found in utils).
// These functions are very commonly used, be careful not to break anything.
// Depends on: options

// No Table of Content.

(function () {
    var Options = require('options');
    
    function escapeHtml(msg) {
        return (sys.escapeHtml || function (str) {
            return str.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/\>/g, "&gt;");
        })(msg);
    }
    
    // Sends a bot message to a player
    exports.sendMessage = function (src, message, channel) {
        // we have to do this manually.
        // PO APIs are silly.
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
        // we have to do this manually.
        // PO APIs are silly.
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
}());