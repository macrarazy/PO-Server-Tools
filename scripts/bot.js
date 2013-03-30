/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

(function () {
    function escapeHtml(msg) {
        return (sys.escapeHtml || function (str) {
            return str.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
        })(msg);
    }
    
    // Sends a bot message to a player
    exports.sendMessage = function (src, message, channel) {
        if (typeof channel === "undefined") {
            sys.sendHtmlMessage(
                src,
                "<font color='" + Script.Bot.color + "'><timestamp/><b>" + Script.Bot.name + ":</b></font> " + message
            );
            return;
        }
        
        sys.sendHtmlMessage(
            src,
            "<font color='" + Script.Bot.color + "'><timestamp/><b>" + Script.Bot.name + ":</b></font> " + message,
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
                "<font color='" + Script.Bot.color + "'><timestamp/><b>" + Script.Bot.name + ":</b></font> " + message
            );
            return;
        }
        
        sys.sendHtmlAll(
            "<font color='" + Script.Bot.color + "'><timestamp/><b>" + Script.Bot.name + ":</b></font> " + message,
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