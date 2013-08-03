/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: channel-utils.js (ChannelUtils)
// Contains various utilities that are for/have to do with channels
// Depends on: jsession, player-utils

// No Table of Content.

(function () {
    var JSESSION = require('jsession').JSESSION,
        PlayerUtils = require('player-utils');
    
    // Creates a clickable channel link
    exports.channelLink = function (channel) {
        if (sys.channelId(channel) === undefined) {
            return "";
        }
    
        return "<a href='po:join/" + channel + "'>#" + channel + "</a>";
    };
    
    // Returns an array of channel names.
    exports.channelNames = function () {
        var channelIds = sys.channelIds(),
            chanNames = [],
            length = channelIds.length,
            i;
    
        for (i = 0; i < length; i += 1) {
            chanNames.push(sys.channel(channelIds[i]));
        }
    
        return chanNames;
    };
    
    // Adds channel links to a message.
    exports.addChannelLinks = function (str) {
        var chanNames = exports.channelNames(),
            length = chanNames.length,
            chanName,
            i;
    
        for (i = 0; i < length; i += 1) {
            chanName = chanNames[i];
            
            str = str.replace(
                new RegExp("#" + chanName, "gi"),
                "<a href='po:join/" + chanName + "'>" + chanName + "</a>"
            );
        }
    
        return str;
    };

    // Returns a player's channel auth. If their true auth level is higher than their channel auth, that is used instead.
    // Name can also be an id, as PlayerUtils.name is called.    
    exports.channelAuth = function (name, chan) {
        var channel = JSESSION.channels(chan),
            chanAuth,
            trueAuth,
            preferredAuth;
        
        name = PlayerUtils.name(name);
        
        if (!channel || !channel.chanAuth) {
            return 0;
        }
        
        chanAuth = channel.chanAuth[name] || 0;
        trueAuth = PlayerUtils.trueAuth(name);
        
        if (chanAuth >= trueAuth) {
            preferredAuth = chanAuth;
        } else if (trueAuth >= chanAuth) {
            preferredAuth = trueAuth;
        } else { // What?
            preferredAuth = 0;
        }
        
        return preferredAuth || 0;
    };
}());