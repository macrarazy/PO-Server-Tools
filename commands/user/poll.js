/**
 * @fileOverview Poll commands
 * @author TheUnknownOne
 * @version 3.0.0 Devel
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
        Commands.Lists.user.add("pollcommands");

        return [
            {
                name: "vote",
                help: [
                    "Text::Any {Option}",
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
                name: "pollcommands",
                category: "0",
                help: [
                    "To view the <b>poll</b> commands."
                ],
                handler: function (command) {
                    var commands = ["vote", "pollinfo"];

                    if (command.self.auth >= 2) {
                        // TODO: Admin/mod poll commands
                        commands.push("");
                    }

                    new Templates.command("Poll Commands")
                        .listCommands(commands)
                        .render(command.src, command.chan);
                }
            }
        ];
    }
})