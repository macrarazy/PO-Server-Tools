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
