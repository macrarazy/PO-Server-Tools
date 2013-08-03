/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: template.js (Template)
// Contains templates, used in various displays, such as command lists and tables.
// Depends on: chat-gradient, datahash, style

// Table of Content:
// [expt]: Exports

(function () {
    var ChatGradient = require('chat-gradient'),
        DataHash = require('datahash'),
        Style = require('style').style;
    
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
            Style.header,
            Style.span.replace(/\{\{Name\}\}/gi, header) + "<br/>"
        ];
    }
    
    basicTemplate.prototype.register = function (line) {
        this.template.push(line);
    };
    
    basicTemplate.prototype.span = function (name) {
        this.template.push(Style.span.replace(/\{\{Name\}\}/gi, name) + "<br/>");
    };
    
    basicTemplate.prototype.render = function (src, chan) {
        this.register(Style.footer);
        
        sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
    };
    
    //---------------------------------
    // Command template
    //---------------------------------
    
    function commandTemplate(header) {
        this.template = [
            Style.header,
            Style.span.replace(/\{\{Name\}\}/gi, header) + "<br/>",
            Style.help + "<br/>"
        ];
    }
    
    // TODO / NOTE: Types/syntax changed.
    commandTemplate.prototype.format = function (str) {
        return str
            .replace(/\?(.*?)\?/g, "<i>$1</i>")
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
            format = Style["command-style"],
            commandIcon = Style["command-icon"],
            commandColor = Style["command-color"],
            preCommand = Style["pre-command"],
            argsList = "",
            len,
            i;
    
        // One argument
        // .register("commands")
        if (argsLength === 1) {
            this.template.push(command);
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
        // .register("commands", ["?[choice Choice]?", "?[number Repeat]?"], "Displays the command list. Search for a term with the optional ?[choice Choice]?. ?[number Repeat]? can be used to repeat the list.");
    
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
        this.template.push("<br/>" + Style.span.replace(/\{\{Name\}\}/gi, name) + "<br/>");
    };
    
    commandTemplate.prototype.formattedAliases = function (command) {
        var pointerCommands = DataHash.pointerCommands.reverse,
            aliases;
        
        // There are no pointer commands.
        if (!Object.prototype.hasOwnProperty.call(pointerCommands, command)) {
            return "";
        }
    
        aliases = Object.keys(pointerCommands[command]);
        return "<i>(Aliases: " + aliases.join(", ") + ")</i>";
    };
    
    commandTemplate.prototype.render = function (src, chan) {
        this.template.push(Style.footer);
    
        sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
    };
    
    //---------------------------------
    // Table template
    //---------------------------------
    
    function tableTemplate(header, color, border) {
        this.template = [
            Style.header,
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
        
        for (i = 0, len = data.length; i < len; ++i) {
            table += format[0] + data[i] + format[1];
        }
    
        this.template.push(table + "</tr>");
    };
    
    tableTemplate.prototype.render = function (src, chan) {
        this.template.push("</table><br/>" + Style.footer);
        sys.sendHtmlMessage(src, this.template.join(''), chan);
    
        // Fix chat gradient being reset after a table has been posted.
        ChatGradient.refreshPlayer(src, chan);
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
        
        if (!Object.prototype.hasOwnProperty.call(templates, type)) {
            throw TypeError("Template '" + type + "' does not exist. Valid templates are: " + Object.keys(templates).join(", ") + ".");
        }
        
        template = templates[type];
        
        return (new template(a, b, c, d, e, f));
    }
    
    // Exports [expt]
    // Set exports as createTemplate (var Template = require('template'); var template = Template('standard', args...))
    exports = createTemplate;
}());