/*
 Dependencies:
 - modules/jsext.js
 - modules/utilities.js
 */

/**
 * @fileOverview Message templates
 * @author TheUnknownOne
 * @version 3.0.0 Devel 1
 */

// TODO: Find a way to not make this as hardcoded as it is with styles
// TODO: Find a way to not make this as hardcoded as it is with pointer commands
// TODO: Find a way to not make this as hardcoded as it is with chat color randomizers
// TODO: JSDOC

/* Define Templates - all should be called with "new" */

/**
 * Contains the message templates
 * @namespace
 * @type {Object}
 */
Templates = {
    /* Basic template - very default */
    basic: function () {
        this.extend({
            template: [],
            register: function (m) {
                this.template.push(m);

                return this;
            },
            render: function (src, chan) {
                sys.sendHtmlMessage(src, this.template.join("<br/>"), chan);

                return this;
            }
        });

        return this;
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

                return this;
            },
            span: function (name) {
                this.register(style.span.replace(/{{Name}}/gi, name) + "<br/>");

                return this;
            },
            render: function (src, chan) {
                this.register(style.footer);
                sys.sendHtmlMessage(src, this.template.join("<br/>"), chan);

                return this;
            }
        });

        return this;
    },
    /* Table template. For tables */
    table: function (template_name, color, border) {
        if (!border) {
            border = 2;
        }

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

                arr.forEach(function (value, index, array) {
                    mess += bolds[0] + value + bolds[1];
                });

                mess += "</tr>";
                this.template.push(mess);

                return this;
            },
            render: function (src, chan) {
                /*var index,
                    code;*/

                this.template.push("</table><br/>", style.footer);

                sys.sendHtmlMessage(src, this.template.join(""), chan);

                // TODO: "fix" this with a hook
                if (ChatColorRandomizers.has(chan)) { // Tables reset fix
                    index = ChatColorRandomizers[chan],
                        code = '<div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + index.firstColor + ', stop:1 ' + index.secondColor + ');">';

                    sys.sendHtmlMessage(src, code, chan);
                }

                return this;
            }
        });

        return this;
    },
    /* Command template - for command lists */
    command: function (template_name) {
        this.extend({
            template: [
                style.header,
                style.span.replace(/{{Name}}/gi, template_name) + "<br/>",
                style.help + "<br/>"
            ],
            format: function (str) {
                // TODO: Improve this - update /help
                // New syntax: (Category)::(Type) {(TEXT)}, ex. Player::Online {Player} (Old: {(Category)::Type (TEXT)} ex. {Player::Online Player}
                /* New colors:
                 Player::Online (online only) | slateblue
                 Player::Offline (offline only) | red
                 Player::Database (online or offline) | mediumpurple
                 Player::Tournament (must be in channel's tournament) | seagreen
                 Player::Auth (must be auth) | orange

                 Text::Number (must be a number) | darksalmon
                 Text::Choice (multiple options defined in (TEXT)) | cadetblue
                 Text::Time (time (number)) | mediumvioletred
                 Text::TimeUnit (time (unit)) | darkviolet
                 Text::Options (options splitted by '/') | mediumorchid
                 Text::Any (any text) | silver
                 */
                return str
                    .replace(/Player::Online \{(.*?)\}/gi, "<b><font color='slateblue'>$1</font></b>")
                    .replace(/Player::Offline \{(.*?)\}/gi, "<b><font color='red'>$1</font></b>")
                    .replace(/Player::Database \{(.*?)\}/gi, "<b><font color='mediumpurple'>$1</font></b>")
                    .replace(/Player::Tournament \{(.*?)\}/gi, "<b><font color='seagreen'>$1</font></b>")
                    .replace(/Player::Auth \{(.*?)\}/gi, "<b><font color='orange'>$1</font></b>")

                    .replace(/Text::Number \{(.*?)\}/gi, "<b><font color='darksalmon'>$1</font></b>")
                    .replace(/Text::Choice \{(.*?)\}/gi, "<b><font color='cadetblue'>$1</font></b>")
                    .replace(/Text::Time \{(.*?)\}/gi, "<b><font color='mediumvioletred'>$1</font></b>")
                    .replace(/Text::TimeUnit \{(.*?)\}/gi, "<b><font color='darkviolet'>$1</font></b>")
                    .replace(/Text::Options \{(.*?)\}/gi, "<b><font color='mediumorchid'>$1</font></b>")
                    .replace(/Text::Any \{(.*?)\}/gi, "<b><font color='silver'>$1</font></b>");
            },
            register: function (name, args, desc) {
                var aliases = this.aliases(name),
                    form = style["command-style"],
                    pre_command = style["pre-command"],
                    args_joined = "",
                    argsLength = arguments.length;

                if (argsLength === 2) {
                    this.template.push(
                        pre_command + form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font>" + form[1] + ": " + this.format(args) + aliases
                    );
                    return this;
                }

                args.forEach(function (value, index, array) {
                    args_joined += (this.format(value) + form[1] + ":" + form[0]);
                }, this);

                args_joined = args_joined.substring(0, args_joined.length - form[0].length);

                this.template.push(
                    pre_command + form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font> " + args_joined + " " + this.format(desc) + aliases
                );

                return this;
            },
            list: function (command) {
                var cmd = Commands[command.toLowerCase()],
                    help,
                    help0;

                if (!cmd) {
                    return this;
                }

                help = cmd.help,
                    help0 = help[0];

                if (help.length === 1) {
                    this.register(cmd.name, help0);
                } else {
                    if (typeof help0 === "string") {
                        help0 = [help0];
                    }
                    this.register(cmd.name, help0, help[1]);
                }

                return this;
            },
            listCommands: function (commands) {
                commands.forEach(function (value, index, array) {
                    this.list(value);
                });

                return this;
            },
            span: function (name) {
                this.template.push("<br/>" + style.span.replace(/{{Name}}/gi, name) + "<br/>");

                return this;
            },
            render: function (src, chan) {
                this.template.push(style.footer);
                sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);

                return this;
            },
            aliases: function (cmd) {
                var aliases = (PointerCommands["!!/Reverse/!!"][cmd] || {}).keys();
                if (aliases.length === 0) {
                    return "";
                }

                return " <i>(Aliases: " + aliases.join(", ") + ")</i>";
            }
        });

        return this;
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