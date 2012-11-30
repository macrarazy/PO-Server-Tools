/**
 * @fileOverview Poll commands
 * @author TheUnknownOne
 * @version 3.0.0 Alpha 1
 */

({
    /**
     * Returns the name of this module
     * @private
     * @return {String}
     */
    Name: function () {
        return "Commands - User: Polls";
    },
    /**
     * Returns the hooks of this module
     * @private
     * @return {Object}
     */
    Hooks: function () {
        return {
            "afterChannelJoin": function (src, chan) {
                if (DataHash.poll.mode) {
                    bot.send(src, "A poll is going on! Use <font color='green'><b>/pollinfo</b></font> for more information.", chan);
                }
            }
        };
    },
    /**
     * Returns the commands of this module
     * @private
     * @return {Object}
     */
    Commands: function () {
        // TODO: Current voting status function.
        Commands.Lists.user.add("pollcommands");

        return [
            {
                name: "vote",
                help: [
                    "Text::Number {Option}",
                    "To vote for Text::Any {Option} on the poll."
                ],
                allowedWhenMuted: false,
                handler: function (command) {
                    var num = command.data * 1,
                        ip = command.self.ip,
                        Poll = DataHash.poll,
                        options;

                    if (!Poll.mode) {
                        command.send("There is no poll.");
                        return;
                    }
                    if (!Poll.options.has(num)) {
                        command.send("Invalid option '" + num + "'.");
                        return;
                    }
                    options = Poll.options[num].votes;
                    if (options.has(ip)) {
                        command.send("You already voted!");
                        return;
                    }

                    options.push(ip);
                    Poll.votes++;

                    command.send("You voted for option " + num + " (" + Poll.options[num].name + ") on the poll!");
                    command.sendMain(command.self.player + " voted!");
                }
            },
            {
                name: "pollinfo",
                help: [
                    "To view the running poll's information."
                ],
                handler: function (command) {
                    var Poll = DataHash.poll,
                        x,
                        option;

                    if (!Poll.mode) {
                        command.send("There is no poll running at the time.");
                        return;
                    }

                    command.send("Poll started by " + Poll.starter.bold() + "!");

                    for (x in Poll.options) {
                        option = Poll.options[x].name;
                        command.send(x + ". " + option);
                    }

                    command.line();

                    if (Poll.votes === 0) {
                        command.send("No one has voted yet.");
                        return;
                    }

                    command.send(Poll.subject + " - Results so far:");

                    for (x in Poll.options) {
                        option = Poll.options[x];
                        command.send(x + ". " + option.name + " - " + option.votes.length);
                    }
                }
            },
            {
                name: "poll",
                help: [
                    [
                        "Text::Any Subject",
                        "Text::Options Options"
                    ],
                    "To open a <b>poll</b>. The subject will be Text::Any Subject and the options will be Text::Any Options Options (use '/' to separate each option)."
                ],
                category: "1",
                allowedWhenMuted: false,
                handler: function (command) {
                    var Poll = DataHash.poll,
                        mcmd = command.mcmd,
                        options,
                        x;

                    if (!mcmd[1]) {
                        mcmd[1] = "";
                    }

                    if (Poll.mode) {
                        command.send("A poll already exists.");
                        return;
                    }

                    mcmd[1] = cut(mcmd, 1, ':');

                    options = mcmd[1].split("/");

                    if (options.length < 2) {
                        command.send("Specify at least 2 options.", chan);
                        return;
                    }

                    Poll.mode = 1;
                    Poll.votes = 0;
                    Poll.subject = mcmd[0];
                    Poll.starter = command.self.name;

                    command.sendMain("A poll was started by " + command.self.name.bold() + "!");
                    command.sendMain("Subject: " + mcmd[0]);
                    command.sendMain("Please vote! Use <font color='green'><b>/vote</b></font> [<font color='darksalamon'>option #</font>] to vote.");

                    options.forEach(function (value, index, array) {
                        Poll.options[index] = {
                            name: value,
                            votes: []
                        };

                        command.sendMain((i + 1) + ". " + value);
                    });
                }
            },
            {
                name: "closepoll",
                help: [
                    "To close the running <b>poll</b> (if any)."
                ],
                category: "1",
                allowedWhenMuted: false,
                handler: function (command) {
                    var Poll = DataHash.poll,
                        starter,
                        subject,
                        options,
                        option,
                        x;

                    if (!Poll.mode) {
                        command.send("No poll is going on.");
                        return;
                    }

                    starter = Poll.starter + "";
                    subject = Poll.subject + "";
                    options = Poll.options;

                    Poll.mode = 0;
                    Poll.starter = "";
                    Poll.subject = "";

                    command.sendMain(command.self.player + " closed the poll started by " + starter.bold() + "!");

                    if (Poll.votes === 0) {
                        command.sendMain("No one voted on the " + subject + " poll!");
                        Poll.options = {};
                        Poll.votes = 0;
                        return;
                    }

                    command.sendMain(subject + " - Results:", 0);

                    for (x in options) {
                        option = Poll.options[x];
                        command.sendMain(x + ". " + option.name + " - " + option.votes.length);
                    }

                    Poll.options = {};
                    Poll.votes = 0;
                }
            },
            {
                name: "pollcommands",
                category: "0",
                help: [
                    "To view the <b>poll</b> commands."
                ],
                handler: function (command) {
                    var commands = ["vote", "pollinfo"];

                    if (command.self.auth >= 1) {
                        commands.push("poll", "closepoll");
                    }

                    new Templates.command("Poll Commands")
                        .listCommands(commands)
                        .render(command.src, command.chan);
                }
            }
        ];
    }
})