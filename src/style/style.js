(function () {
    var styles = [{
        "name": "default",
        "author": "Lutra",
        "header": "<font color=cornflowerblue><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>",
        "footer": "<br/><timestamp/><br/><font color=cornflowerblue><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>",
        "pre-command": "",
        "command-icon": "\u2022 ",
        "command-style": ["<b>", "</b>"],
        "command-color": "green",
        "help": "<b><font color='orangered'>The following commands need to be entered into a channel's main chat:</font></b>",
        "span": "<br><font size=5><B>{{Name}}</b></font>"
    }];
    var style, len, i;
    
    Style = {
        styles: {},
        style: null
    };
    
    Style.loadAll = function () {
        for (i = 0, len = styles.length; i < len; i += 1) {
            style = styles[i];
            Style.styles[style.name] = style;
        }
    };
    
    Style.loadAll();
    Style.style = Style.styles["default"];
}());
