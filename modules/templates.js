/*
 Dependencies:
 - modules/jsext.js
 - modules/utilities.js
 */

// TODO: Find a way to not make this as hardcoded as it is with styles
// TODO: Find a way to not make this as hardcoded as it is with pointer commands
// TODO: Find a way to not make this as hardcoded as it is with chat color randomizers
// TODO: JSDOC

/* Define Templates - all should be called with "new" */
Templates = {
    /* Basic template - very default */
    basic: function () {
        this.extend({
            template: [],
            register: function (m) {
                this.template.push(m);
            },
            render: function (src, chan) {
                sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
            }
        });
    },
    /* List/info template. For helpful lists/info/etc. */
    list: function (template_name) {
        this.extend({
            template: [
                style.header,
                style.span.replace(/{{Name}}/gi, template_name) + "<br/>"
            ],
            register: function (mess) {
                this.template.push(mess);
            },
            span: function (name) {
                this.register(style.span.replace(/{{Name}}/gi, name) + "<br/>");
            },
            render: function (src, chan) {
                this.register(style.footer);
                sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
            }
        });
    },
    /* Table template. For tables */
    table: function (template_name, color, border) {
        this.extend({
            template: [
                style.header,
                "<h2>" + template_name + "</h2><br/>",
                "<table border='" + border + "' cellpadding='5'>"
            ],
            color: color,
            register: function (arr, bold) {
                var mess = "<tr bgcolor='" + this.color + "'>",
                    bolds = ['<th>', '</th>'];

                if (!bold) {
                    bolds = ['<td>', '</td>'];
                }

                arr.forEach(function (index, value, array) {
                    mess += bolds[0] + value + bolds[1];
                });

                mess += "</tr>";
                this.template.push(mess);
            },
            render: function (src, chan) {
                this.template.push("</table><br/>", style.footer);

                sys.sendHtmlMessage(src, this.template.join(''), chan);

                // TODO: "fix" this
                if (ChatColorRandomizers.has(chan)) { // Tables reset fix
                    var index = ChatColorRandomizers[chan],
                        code = '<div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + index.firstColor + ', stop:1 ' + index.secondColor + ');">';

                    sys.sendHtmlMessage(src, code, chan);
                }
            }
        });
    },
    /* Command template - for command lists */
    command: function (template_name, nohelp) {
        this.extend({
            template: [
                style.header,
                style.span.replace(/{{Name}}/gi, template_name) + "<br/>",
                style.help + "<br/>"
            ],
            format: function (str) {
                // TODO: Improve this
                return str.replace(/\{Player::Online (.*?)\}/gi, '<b><font color="red">$1</font></b>')
                    .replace(/\{Player::Database (.*?)\}/gi, '<b><font color="orangered">$1</font></b>')
                    .replace(/\{Player::Tournament (.*?)\}/gi, '<b><font color="green">$1</font></b>')
                    .replace(/\{Text::Number (.*?)\}/gi, '<b><font color="orange">$1</font></b>')
                    .replace(/\{Text::Any (.*?)\}/gi, '<b><font color="purple">$1</font></b>')
                    .replace(/\{Text::Choice (.*?)\}/gi, '<b><font color="blue">$1</font></b>')
                    .replace(/\{Text::Time (.*?)\}/gi, '<b><font color="blueviolet">$1</font></b>');
            },
            register: function (name, args, desc) {
                var aliases = this.formattedAliases(name),
                    form = style["command-style"],
                    pre_command = style["pre-command"],
                    args_joined = "",
                    y,
                    argsLength = arguments.length;

                if (argsLength == 2) {
                    this.template.push(pre_command + form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font>" + form[1] + ": " + this.format(args) + aliases);
                    return;
                }

                args.forEach(function (index, value, array) {
                    args_joined += (this.format(value) + form[1] + ":" + form[0]);
                }, this);

                args_joined = args_joined.substring(0, args_joined.length - form[0].length);

                this.template.push(pre_command + form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font> " + args_joined + " " + this.format(desc) + aliases);
            },
            span: function (name) {
                this.template.push("<br/>" + style.span.replace(/{{Name}}/gi, name) + "<br/>");
            },
            render: function (src, chan) {
                this.template.push(style.footer);

                sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
            },
            aliases: function (name) {
                if (!PointerCommands["!!/Reverse/!!"].has(name)) {
                    return [];
                }

                return PointerCommands["!!/Reverse/!!"][name].keys();
            },
            formattedAliases: function (cmd) {
                var a = this.aliases(cmd);
                if (a.length === 0) {
                    return "";
                }

                return " <i>(Aliases: " + a.join(", ") + ")</i>";
            }
        });
    }
};

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