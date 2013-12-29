(function () {
    Commands.register("me", function (info) {
        var src = info.src, chan = info.chan;
        if (!info.data) {
            return Bot.sendMessage(src, "You have to enter a message!", chan);
        }

        sys.sendHtmlAll("<font color='" + Util.player.trueColor(src) + "'><timestamp/><i><b>*** " + sys.name(src) + "</b> " + Util.escapeHtml(info.data) + "</i></font>", chan);
    });
}());
