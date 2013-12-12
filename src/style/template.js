(function () {
    var templates = {};
    
    //---------------------------------
    // Default template
    //---------------------------------
    
    function defaultTemplate() {
        this.template = [];
    }
    
    defaultTemplate.prototype.register = function (line) {
        this.template.push(line);
    };
    
    defaultTemplate.prototype.render = function (src, chan) {
        sys.sendHtmlAll(src, this.template.join("<br/>"), chan);
    };

    //---------------------------------
    // Basic template
    //---------------------------------
    
    function basicTemplate(header) {
        this.template = [
            Style.style.header,
            Style.style.span.replace(/\{\{Name\}\}/gi, header) + "<br/>"
        ];
    }
    
    basicTemplate.prototype.register = function (line) {
        this.template.push(line);
    };
    
    basicTemplate.prototype.span = function (name) {
        this.template.push(Style.style.span.replace(/\{\{Name\}\}/gi, name) + "<br/>");
    };
    
    basicTemplate.prototype.render = function (src, chan) {
        this.register(Style.style.footer);
        
        sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
    };
    
    //---------------------------------
    // Command template
    //---------------------------------
    
    function commandTemplate(header) {
        this.template = [
            Style.style.header,
            Style.style.span.replace(/\{\{Name\}\}/gi, header) + "<br/>",
            Style.style.help + "<br/>"
        ];
    }
    
    // TODO / NOTE: Types/syntax changed.
    commandTemplate.prototype.format = function (str) {
        return str
            .replace(/\?(.*?)\?/g, "<i>$1</i>") // ?text? -> <i>text</i>
            .replace(/\[onlinePlayer (.*?)\]/gi, '<b><font color="red">$1</font></b>')
            .replace(/\[databasePlayer (.*?)\]/gi, '<b><font color="orangered">$1</font></b>')
            .replace(/\[tournamentPlayer (.*?)\]/gi, '<b><font color="green">$1</font></b>')
            .replace(/\[anything (.*?)\]/gi, '<b><font color="purple">$1</font></b>')
            .replace(/\[choice (.*?)\]/gi, '<b><font color="blue">$1</font></b>')
            .replace(/\[number (.*?)\]/gi, '<b><font color="orange">$1</font></b>')
            .replace(/\[time (.*?)\]/gi, '<b><font color="blueviolet">$1</font></b>');
    };
    
    commandTemplate.prototype.register = function (command, args, help) {
        var aliases = this.aliases(command),
            argsLength = arguments.length,
            format = Style.style["command-style"],
            commandIcon = Style.style["command-icon"],
            commandColor = Style.style["command-color"],
            preCommand = Style.style["pre-command"],
            argsList = "",
            len,
            i;
    
        // One argument
        // .register("commands")
        // .register([["commands", "Displays the command list."]])
        if (argsLength === 1) {
            if (Array.isArray(command)) {
                for (i = 0, len = command.length; i < len; i += 1) {
                    this.register.apply(this, command[i]);
                }
            } else {
                this.template.push(command);
            }
            return;
        }
        
        // Two arguments
        // .register("commands", "Displays the command list.");
        if (argsLength === 2) {
            // args becomes help
            this.template.push(
                preCommand + format[0] + commandIcon + "<font color='" + commandColor + "'>" + command + "</font>" + format[1] + ": " + (this.format(args) + aliases)
            );
            return;
        }
    
        // Three arguments
        // .register("commands", ["[choice Choice]", "[number Repeat]"], "Displays the command list. Search for a term with the optional [choice Choice]. [number Repeat] can be used to repeat the list.");
    
        for (i = 0, len = args.length; i < len; i += 1) {
            argsList += this.format(args[i]) + format[1] + ":" + format[0];
        }
        
        // Remove the last format[0]
        argsList = argsList.substring(0, (argsList.length - format[1].length));
    
        this.template.push(
            preCommand + format[0] + commandIcon + "<font color='" + commandColor + "'>" + command + "</font> " + argsList + " " + (this.format(help) + aliases)
        );
    };
    
    commandTemplate.prototype.span = function (name) {
        this.template.push("<br/>" + Style.style.span.replace(/\{\{Name\}\}/gi, name) + "<br/>");
    };
    
    commandTemplate.prototype.aliases = function (command) {
        var pointerCommands = Commands.pointers.reverse,
            aliases;
        
        // There are no pointer commands for this command, so don't do anything.
        if (!Util.hasOwn(pointerCommands, command)) {
            return "";
        }
    
        aliases = Object.keys(pointerCommands[command]);
        return "<i>(Aliases: " + aliases.join(", ") + ")</i>";
    };
    
    commandTemplate.prototype.render = function (src, chan) {
        this.template.push(Style.style.footer);
        sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
    };
    
    //---------------------------------
    // Table template
    //---------------------------------
    
    function tableTemplate(header, color, border) {
        this.template = [
            Style.style.header,
            "<h2>" + header + "</h2><br/>",
            "<table border='" + border + "' cellpadding='5'>"
        ];
        
        this.color = color;
    }
    
    tableTemplate.prototype.register = function (data, isBold) {
        var table = ("<tr bgcolor='" + this.color + "'>"),
            format = ["<td>", "</td>"],
            len,
            i;
        
        if (isBold) {
            format = ["<th>", "</th>"];
        }
        
        for (i = 0, len = data.length; i < len; i += 1) {
            table += format[0] + data[i] + format[1];
        }
    
        this.template.push(table + "</tr>");
    };
    
    tableTemplate.prototype.render = function (src, chan) {
        this.template.push("</table><br/>" + Style.style.footer);
        sys.sendHtmlMessage(src, this.template.join(''), chan);
    
        // Fix chat gradient being reset after a table has been posted.
        /* ChatGradient.refreshPlayer(src, chan); */
    };
    
    // Register the templates.
	
    // QtScript doesn't like keywords as identifiers.
    templates["default"] = defaultTemplate;
    templates.basic = basicTemplate;
    templates.command = commandTemplate;
    templates.table = tableTemplate;
    
    // Creates a template.
    function createTemplate(type, a, b, c, d, e, f) {
        var template;
        
        if (!Util.hasOwn(templates, type)) {
            throw new TypeError("Template '" + type + "' does not exist. Valid templates are: " + Object.keys(templates).join(", ") + ".");
        }
        
        template = templates[type];
        
        return (new template(a, b, c, d, e, f));
    }
    
    // Set Template as createTemplate (var template = Template('standard', args...))
    Template = createTemplate;
    Template.templates = templates;
}());