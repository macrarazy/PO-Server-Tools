/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports*/

// File: channel-utils.js (ChannelUtils)
// Contains various utilities that are for/have to do with channels
// No dependencies.

// No Table of Content.

(function () {
    // Creates a clickable channel link
    exports.channelLink = function channelLink(channel) {
        if (sys.channelId(channel) === undefined) {
            return "";
        }
    
        return "<a href='po:join/" + channel + "'>#" + channel + "</a>";
    };
    
    // Returns an array of channel names.
    exports.channelNames = function channelNames() {
        var channelIds = sys.channelIds(),
            chanNames = [],
            length = channelIds.length,
            i;
    
        for (i = 0; i < length; ++i) {
            chanNames.push(sys.channel(channelIds[i]));
        }
    
        return chanNames;
    };
    
    // Adds channel links to a message
    exports.addChannelLinks = function addChannelLinks(str) {
        var chanNames = channelNames(),
            length = chanNames.length,
            chanName,
            i;
    
        for (i = 0; i < length; ++i) {
            chanName = chanNames[i];
            
            str = str.replace(
                new RegExp("#" + chanName, "gi"),
                "<a href='po:join/" + chanName + "'>" + chanName + "</a>"
            );
        }
    
        return str;
    };
}());