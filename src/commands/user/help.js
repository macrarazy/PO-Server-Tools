(function () {
    Commands.register('commands', function (info) {
        var template = Template('command', 'Commands');
        template.register([
            ['help', 'Displays a list of helpful topics.'],
            ['usercommands', 'Displays a list of commands for users.'],
            // messagecommands,
            ['channelcommands', 'Displays a list of commands for channels.'],
            ['tourcommands', 'Displays a list of commands for tournaments.']
        ]);
        
        if (info.perm >= 1) {
            template.register("modcommands",   "Displays a list of commands for moderators.");
        }
        if (info.perm >= 2) {
            template.register("admincommands", "Displays a list of commands for administrators.");
        }
        if (info.perm >= 3) {
            template.register("ownercommands", "Displays a list of commands for owners.");
        }
    
        template.render(info.src, info.chan);
    });
    
    var helpEntries = {
        "default": {
            title: "",
            message: [
                "<b>The following help topics are available</b>: <small>(/help [topic])</small> <br/>",
                // red, green, blue pattern
                "• <font color='red'><b>arguments</b></font>: Help with command arguments.",
                "• <font color='green'><b>register</b></font>: Help with registering."
            ]
        },
        "arguments": {
            title: "Arguments",
            message: [
                "Arguments are used in almost <i>every</i> command list and command.",
                "Here are their descriptions: <br/>",
                
                // [onlinePlayer Player]
                "• For <font color='red'><b>Red</b></font> colored arguments, give the name of an online player.",
                // [databasePlayer Player]
                "• For <font color='orangered'><b>Orangered</b></font> colored arguments, give the name of a player who has once entered the server.",
                // [tournamentPlayer Player]
                "• For <font color='green'><b>Green</b></font> colored arguments, give the name of a player who's in the channel's tournament.",
                // [anything Text]
                "• For <font color='purple'><b>Purple</b></font> colored arguments, you may give anything (the command may inpose some limitations).",
                // [choice A/B/C]
                "• For <font color='blue'><b>Blue</b></font> colored arguments, give one of the choices (usually in the command's description).",
                // [number Num]
                "• For <font color='orange'><b>Orange</b></font> colored arguments, give a decimal number.",
                // [time Unit]
                "• For <font color='blueviolet'><b>Blueviolet</b></font> colored arguments, give a time unit (s, m, h, d, w, mo, y, de). Usually the default is in minutes."
            ]
        },
        "register": {
            title: "Registering",
            message: [
                "To register <small>(on the desktop client)</small>, click on the <b>Register</b> button below the chat.",
                "Registration is free and does not require an email or even a name. All it does is lock your current user name with a password so other people cannot go on it (assuming they don't know the password).",
                "<b>If you ever forget your password, you can ask one of the Owners " + Util.icons.owner + " to reset it for you.</b>"
            ]
        }
    };
                        
    Commands.register('help', function (info) {
        var type = info.data.toLowerCase().trim();
        var entry = helpEntries[type] || helpEntries["default"];
        var title = "Help", template, len, i;
        
        if (entry.title) {
            title += " - " + entry.title;
        }
        
        template = Template("basic", title);
        for (i = 0, len = entry.message.length; i < len; i += 1) {
            template.register(entry.message[i]);
        }
        
        template.render(info.src, info.chan);
    });
}());
