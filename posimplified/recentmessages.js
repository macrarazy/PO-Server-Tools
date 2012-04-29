/*
  Documentation:
  3 Functions:
    * void _PORecentMessages(int recentMessageTotal)
    * void addRecent(in src, string message)
    * mix (boolean/string) displayRecent()

  Call addRecent in afterChatMessage/end of beforeChatMessage.
  Call var rec = PORecentMessages.displayRecent();
  if(rec)
  sys.sendHtmlAll(rec);
  in afterLogIn.
*/

_PORecentMessages = function (recentMessageTotal) {
    this.recent = new Array();
    if(!isNaN(recentMessageTotal) && recentMessageTotal < 25)
        this.recentMessages = recentMessageTotal;
    else
        this.recentMessages = 10;
}

_PORecentMessages.prototype.addRecent = function (src, message) {
    if(typeof message != "string" || message == "" || sys.name(src) == undefined)
    var name = sys.auth(src) > 0 ? "+<i><b>"+sys.name(src)+"</b></i>" : "<b>"+sys.name(src)+"</b>";

    var string = "<font color="+POPlayer.color(src)+"><timestamp/> "+name+":</font> "+POString.html_escape(message);
    if(this.recent.length < this.recentMessages)
        this.recent.push(string);
    POArray.moveSpot(this.recent, this.recentMessages, string);

}

_PORecentMessages.prototype.displayRecent = function () {
    var rec = this.recent;
    if(rec.length < 1)
        return false;
    var disstr = "", x, rl = rec.length;
    for(x in rec) {
        disstr += rec[x]+x != rl-1 ? "<br/>" : "";
    }
    return disstr;
}

PORecentMessages = new _PORecentMessages();
