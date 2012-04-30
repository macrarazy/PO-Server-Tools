var runUtil = function (filename, botInst) {
    var dirname = "serverbot/";
    try {
        var res = eval(sys.getFileContent(dirname+filename));
    } catch(e) {
        print("An error has occured when running bot util "+filename+": "+e);
        return;
    }

    var utilname = filename.split(".")[1];

    botInst.utils[utilname] = res;
}


_Bot = function (uniqueName) {
    if(uniqueName == undefined)
        uniqueName = "BOT"+sys.rand(0, 10001);

    this.version = 0.1;
    this.name = Config.Bot.bot;
    this.color = Config.Bot.color;
    this.uniquename = uniqueName;
    this.authlevel = 3;
    this.data = {};
    this.utils = {};
    // Will soon be POCache!
    this.cache = new Cache_Framework(uniqueName+"_"+version);

    runUtil("utilities.messages.js");
    runUtil("utilities.kick.js");

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

Bot = new _Bot();
