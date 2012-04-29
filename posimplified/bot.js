LoginMessages = [
                  "Hello %0, welcome to "+servername,
                  "What's up, %0?",
                  "Enjoy your stay at "+servername+", %0!"
              ];

WarnMessages = [
            "%0, please stop %2, or you will be %1!",
            "%0, stop %2, otherwise you will be %1!"

        ];

KickMessages = [
            "%0, you shouldn't have %1!",
            "%0, don't %1!",
            "Bad %0!"

        ];

MuteMessages = KickMessages;

TempBanMessages = [
            "You should leave for a while, %0!",
            "You shouldn't have annoying, %0!"
        ];

BanMessages = [
            "Goodbye, %0. We are done with you.",
            "You aren't welcome anymore, %0!"
        ];

RangeBanMessages = [
            "Don't return, %0. We are completely done with you",
            "You brought this on yourself, %0!"
        ]


_Bot = function (uniqueName) {
    if(uniqueName == undefined)
        uniqueName = "BOT"+sys.rand(0, 10001);

    this.version = 0.1;
    this.name = Config.Bot.bot;
    this.color = Config.Bot.color;
    this.uniquename = uniqueName;
    this.authlevel = 3;
    this.data = {};
    // Will soon be POCache!
    this.cache = new Cache_Framework(uniqueName+"_"+version);
}

_Bot.prototype.moderateMessage = function (message) {
    if(!this.auth())
        return; // Bot does not have auth.

    if(this.isNotAllowed(message)) {
        var modtype = this.getModerationType(message);

        if(!this.invisible()) {
            var chans = this.getModerationChannels(modtype);
            var modmessage = this.getModerationMessage(modtype);

            if(chans == "all")
                this.chatMessage(message);
            else
                this.chatMessage(message, chans);
        }
        this.moderationAction(modtype);
    }

}

_Bot.prototype.handleLogin = function (id) {
    var message = this.randomMessage("login");
    this.chatMessageTo(id, randMessage.format(sys.name(id)), 0);

}

_Bot.prototype.moderationAction = function (type) {


}

_Bot.prototype.getModerationType = function () {

}

_Bot.prototype.getModerationChannels = function () {

}

_Bot.prototype.getModerationMessage = function () {

}

_Bot.prototype.chatMessage = function(message, channel) {
    var applyArray = [], str = "";
    if(this.auth() && !this.invisible()) {
        str = "<font color='"+this.color+"'><timestamp/>+<i><b>"+this.name+":</b></i> "+html_escape(message);
    }
    else {
        str = "<font color='"+this.color+"'><timestamp/><b>"+this.name+":</b> "+html_escape(message);
    }

    applyArray.push(str);
    if(channel != null && sys.channel(channel) != undefined)
        applyArray.push(channel);

    sys.sendHtmlAll.apply(applyArray)
}
_Bot.prototype.chatMessageTo = function(id, message, channel) {
    var applyArray = [], str = "";
    if(this.auth() && !this.invisible()) {
        str = "<font color='"+this.color+"'><timestamp/>+<i><b>"+this.name+":</b></i> "+html_escape(message);
    }
    else {
        str = "<font color='"+this.color+"'><timestamp/><b>"+this.name+":</b> "+html_escape(message);
    }

    applyArray.push(id);
    applyArray.push(str);
    if(channel != null && sys.channel(channel) != undefined)
        applyArray.push(channel);

    sys.sendHtmlMessage.apply(applyArray)
}

_Bot.prototype.toString = function () {
    var str = "A bot created by TheUnknownOne. \n Focuses on Chat, Channels and Entertainment. \n";
    str += "Version: "+this.version+" \n";
    str += "\n Created for TheUnknownOne's Server Script. Should not be ported to other scripts, as this bot involes functions probally only available to TheUnknownOne's Server Script."
}

/** HELPERS **/

_Bot.prototype.invisible = function () {
    return this.authlevel > 3;
}

_Bot.prototype.auth = function () {
    return this.authlevel > 0;
}

_Bot.prototype.exists = function (id) {
    return sys.name(id) !== undefined;
}

_Bot.prototype.randomMessage = function (type) {
    var arr;
    switch(type.toLowerCase()) {
    case "login":
        arr = LoginMessages;
        break;
    case "warn":
    case "warning":
        arr = WarnMessages;
        break;
    case "kick":
        arr = KickMessages;
        break;
    case "mute":
        arr = MuteMessages;
        break;
    case "tempban":
        arr = TempBanMessages;
        break;
    case "ban":
        arr = BanMessages;
        break;
    case "rangeban":
        arr = RangeBanMessages;
        break;
    default:
        return;
    }

    var messages = arr.length
    var randMessage = arr[Math.floor(Math.random()*messages)];

    return randMessage;
}


/** MODERATION ACTIONS **/

_Bot.prototype.kick = function (id, reason) {
    if(!this.auth())
        return; // Bot is not auth.
    if(!this.exists(id))
        return; // Player does not exist!

    var isSecret = this.invisible();

    if(!isSecret) {
        this.chatMessage(this.randomMessage("kick").format(sys.name(id), reason));
    }
    sys.sendHtmlAll("<font color='midnightblue'><timestamp/><b>"+this.name+" kicked "+sys.name(id)+"!");
    sys.kick(id);
}


Bot = new _Bot();
