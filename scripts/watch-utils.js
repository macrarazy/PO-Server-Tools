/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports*/

// File: watch-utils.js (WatchUtils)
// Contains various logging utilities (which also send messages to Guardtower).
// Depends on: options, player-utils

// No Table of Content.

(function () {
    var Options = require('options'),
        PlayerUtils = require('player-utils');
    
    // Note that we don't have to create the LogFile, because appendToFile does this automatically.
    
    // Logs a player event to watch, such as a log in.
    exports.logPlayerEvent = function logPlayerEvent(src, message) {
        if (!Options.defaultChannelIds.watch) {
            sys.sendHtmlAll(
                "<timestamp>[" + PlayerUtils.formatName(src) + "] <i>" + message + "</i>",
                Options.defaultChannelIds.watch
            );
        }
        
        if (Config.LogFile) {
            sys.appendToFile(Config.LogFile, "Player event '" + message + "' for player '" + PlayerUtils.name(src) + "' (ID " + src + ") called. \r\n");
        }
    };
    
    // Logs a channel event to watch, such as channel creation.
    exports.logChannelEvent = function logChannelEvent(chan, message) {
        if (Options.defaultChannelIds.watch) {
            sys.sendHtmlAll(
                "<timestamp>[#<b>" + (sys.channel(chan) || chan) + "</b>] <i>" + message + "</i>",
                Options.defaultChannelIds.watch
            );
        }
        
        if (Config.LogFile) {
            sys.appendToFile(Config.LogFile, "Channel event '" + message + "' for player '" + (sys.channel(chan) || chan) + "' (ID " + (sys.channelId(chan) || chan) + ") called. \r\n");
        }
    };
    
    // Logs a player message to watch.
    exports.logPlayerMessage = function logPlayerMessage(type, src, message, chan) {
        if (Options.defaultChannelIds.watch) {
            sys.sendHtmlAll(
                "<timestamp>[" + PlayerUtils.formatName(src) + " ~ <i>" + type + "</i>] <i>" + message + "</i> in <i>#" + (sys.channel(chan) || chan) + "</i>.",
                Options.defaultChannelIds.watch
            );
        }
        
        if (Config.LogFile) {
            sys.appendToFile(Config.LogFile, "Player '" + PlayerUtils.name(src) + "' (ID " + src + ") said '" + message + "' (Type: " + type + "). \r\n");
        }
    };
    
    // Logs a system message to watch.
    exports.logSystemMessage = function logSystemMessage(type, message) {
        if (Options.defaultChannelIds.watch) {
            sys.sendHtmlAll(
                "<timestamp>[<u><b>~SYS</b></u> - " + type + "] <i>" + message + "</i>",
                Options.defaultChannelIds.watch
            );
        }
        
        if (Config.LogFile) {
            sys.appendToFile(Config.LogFile, "System event '" + type + "' (" + message + ") called. \r\n");
        }
    };
}());