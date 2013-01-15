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
        CommandHandlers.Lists.user.add("pollcommands");

        return [
            {
                name: "vote",
                help: [
                    "Text::Number {Option}",
                    "To vote for Text::Any {Option} on the poll."
                ],
                allowedWhenMuted: false,
                handler: function (command) {
                    var num = +(command.data),
                        ip = command.self.ip,
                        option;

                    if (!DataHash.poll.mode) {
                        command.send("There is no poll.");
                        return;
                    }
                    if (!DataHash.poll.options.has(num)) {
                        command.send("Invalid option '" + num + "'.");
                        return;
                    }
                    
                    option = DataHash.poll.options[num];
                    if (option.votes.has(ip)) {
                        command.send("You already voted!");
                        return;
                    }

                    option.votes.push(ip);
                    Poll.votes++;

                    command.send("You voted for option " + num + " (" + option.name + ") on the poll!");
                    command.sendMain(command.self.player + " voted!");
                }
            },
            {
                name: "pollinfo",
                help: [
                    "To view the running poll's information."
                ],
                handler: function (command) {
                    var options = DataHash.poll.options,
                        option,
                        x;

                    if (!DataHash.poll.mode) {
                        command.send("There is no poll running at the time.");
                        return;
                    }

                    command.send("Poll started by <b>" + DataHash.poll.starter + "</b>!");

                    for (x in options) {
                        option = options.name;
                        command.send(x + ". " + option);
                    }

                    command.line();

                    if (DataHash.poll.votes === 0) {
                        command.send("No one has voted yet.");
                        return;
                    }

                    command.send(DataHash.poll.subject + " - Results so far:");

                    for (x in options) {
                        option = options[x];
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
                    var mcmd = command.mcmd,
                        options,
                        x;

                    if (!mcmd[1]) {
                        mcmd[1] = "";
                    }

                    if (DataHash.poll.mode) {
                        command.send("A poll already exists.");
                        return;
                    }

                    mcmd[1] = util.cut(mcmd, 1, ':');

                    options = mcmd[1].split("/");

                    if (options.length < 2) {
                        command.send("Specify at least 2 options.", chan);
                        return;
                    }

                    DataHash.poll.mode = 1;
                    DataHash.poll.votes = 0;
                    DataHash.poll.subject = mcmd[0];
                    DataHash.poll.starter = command.self.name;

                    command.sendMain("A poll was started by " + command.self.name.bold() + "!");
                    command.sendMain("Subject: " + mcmd[0]);
                    command.sendMain("Please vote! Use <font color='green'><b>/vote</b></font> [<font color='darksalamon'>option #</font>] to vote.");

                    options.forEach(function (value, index, array) {
                        Poll.options[index] = {
                            name: value,
                            votes: []
                        };

                        command.sendMain((index + 1) + ". " + value);
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
                    var starter = DataHash.poll.starter + "",
                        subject = DataHash.poll.subject + "",
                        options = DataHash.poll.options,
                        option,
                        x;

                    if (!DataHash.poll.mode) {
                        command.send("No poll is going on.");
                        return;
                    }


                    DataHash.poll.mode = 0;
                    DataHash.poll.starter = "";
                    DataHash.poll.subject = "";

                    command.sendMain(command.self.player + " closed the poll started by <b>" + starter + "</b>!");

                    if (DataHash.poll.votes === 0) {
                        command.sendMain("No one voted on the " + subject + " poll!");
                        DataHash.poll.options = {};
                        DataHash.poll.votes = 0;
                        return;
                    }

                    command.sendMain(subject + " - Results:", 0);

                    for (x in options) {
                        option = options[x];
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
