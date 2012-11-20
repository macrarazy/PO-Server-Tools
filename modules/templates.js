/*
 Dependencies:
 - modules/jsext.js
 - modules/utilities.js
 */

// TODO: Find a way to not make this as hardcoded as it is with styles
// TODO: Find a way to not make this as hardcoded as it is with pointer commands
// TODO: Find a way to not make this as hardcoded as it is with chat color randomizers

(function () {
    var currentTemplate;

    /* Define Templates */
    Templates = {};

    /* Default template - very basic */
    currentTemplate = Templates.default = function () {
        this.template = [];
    };

    currentTemplate.prototype.register = function (m) {
        this.template.push(m);
    };

    currentTemplate.prototype.render = function (src, chan) {
        sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
    };

    /* Command template - for command lists */
    currentTemplate = Templates.command = function (template_name, nohelp) {
        this.multiple = nohelp;

        if (!nohelp) {
            this.template = [
                style.header, style.span.replace(/{{Name}}/gi, template_name) + "<br/>", style.help + "<br/>"
            ];
        }
        else {
            this.template = [
                style.header, style.span.replace(/{{Name}}/gi, template_name)
            ];
        }
    };

    currentTemplate.prototype.format = function (str) {
        // TODO: Improve this
        return str.replace(/\{Player::Online (.*?)\}/gi, '<b><font color="red">$1</font></b>')
            .replace(/\{Player::Database (.*?)\}/gi, '<b><font color="orangered">$1</font></b>')
            .replace(/\{Player::Tournament (.*?)\}/gi, '<b><font color="green">$1</font></b>')
            .replace(/\{Text::Number (.*?)\}/gi, '<b><font color="orange">$1</font></b>')
            .replace(/\{Text::Any (.*?)\}/gi, '<b><font color="purple">$1</font></b>')
            .replace(/\{Text::Choice (.*?)\}/gi, '<b><font color="blue">$1</font></b>')
            .replace(/\{Text::Time (.*?)\}/gi, '<b><font color="blueviolet">$1</font></b>');
    };

    currentTemplate.prototype.register = function (name, args, desc) {
        var aliases = this.formattedAliases(name),
            form,
            pre_command,
            args_joined = "",
            formatted,
            y;

        if (arguments.length == 1) {
            this.template.push(name);
            return;
        }

        form = style["command-style"],
            pre_command = style["pre-command"];

        if (arguments.length == 2) {
            desc = this.format(args) + aliases; // desc->args in 2 arg length commands
            this.template.push(pre_command + form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font>" + form[1] + ": " + desc);
            return;
        }

        for (y in args) {
            formatted = this.format(args[y]);
            args_joined += (formatted + form[1] + ":" + form[0]);
        }

        desc = this.format(desc) + aliases;
        args_joined = args_joined.substring(0, args_joined.length - form[0].length);

        this.template.push(pre_command + form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font> " + args_joined + " " + desc);
    };

    currentTemplate.prototype.span = function (name) {
        this.template.push("<br/>" + style.span.replace(/{{Name}}/gi, name) + "<br/>");

        if (this.multiple) {
            this.template.push(style.help + "<br/>");
        }
    };

    currentTemplate.prototype.render = function (id, chan) {
        this.template.push(style.footer);

        sys.sendHtmlMessage(id, this.template.join('<br/>'), chan);
    };

    currentTemplate.prototype.aliases = function (name) {
        if (!PointerCommands["!!/Reverse/!!"].has(name)) {
            return [];
        }

        var p = PointerCommands["!!/Reverse/!!"][name];
        return p.keys();
    };

    currentTemplate.prototype.formattedAliases = function (cmd) {
        var a = this.aliases(cmd);
        if (a.length == 0) {
            return "";
        }

        return " <i>(Aliases: " + a.join(", ") + ")</i>";
    };

    /* List/info template. For helpful lists/info/etc. */
    currentTemplate = Templates.list = function (template_name) {
        this.template = [
            style.header,
            style.span.replace(/{{Name}}/gi, template_name) + "<br/>"
        ];
    };

    currentTemplate.prototype.register = function (mess) {
        this.template.push(mess);
    };

    currentTemplate.prototype.span = function (name) {
        this.template.push(style.span.replace(/{{Name}}/gi, name) + "<br/>");
    };

    currentTemplate.prototype.render = function (id, chan) {
        this.register(style.footer);

        return sys.sendHtmlMessage(id, this.template.join('<br/>'), chan);
    };

    /* Table template. For tables */
    currentTemplate = Templates.table = function (template_name, color, border) {
        this.template = [
            style.header,
            "<h2>" + template_name + "</h2><br/>",
            "<table border='" + border + "' cellpadding='5'>"
        ];
        this.color = color;
    };

    currentTemplate.prototype.register = function (arr, bold) {
        var mess = "<tr bgcolor='" + this.color + "'>",
            l = arr.length,
            y,
            bolds = ['<th>', '</th>'];

        if (!bold) {
            bolds = ['<td>', '</td>'];
        }

        for (y = 0; y < l; y++) {
            mess += bolds[0] + arr[y] + bolds[1];
        }

        mess += "</tr>";
        this.template.push(mess);
    };

    currentTemplate.prototype.render = function (id, chan) {
        this.template.push("</table><br/>", style.footer);

        sys.sendHtmlMessage(id, this.template.join(''), chan);

        if (ChatColorRandomizers.has(chan)) { // Tables reset fix
            var index = ChatColorRandomizers[chan],
                code = '<div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + index.firstColor + ', stop:1 ' + index.secondColor + ');">';

            sys.sendHtmlMessage(id, code, chan);
        }
    }

}());

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} Templates
     */
    Name: function () {
        return "Templates";
    }
})