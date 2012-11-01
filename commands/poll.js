({
    /**
     * Returns the name of this module
     * @private
     * @return {String} Polls
     */
    Name: function () {
        return "Polls";
    },
    /**
     * Returns the hooks of this module
     * @private
     * @return {Object}
     */
    Hooks: function () {
        return {
            "afterChannelJoin": function (src, chan) { // TODO: Add this module
                if (DataHash.poll.mode) {
                    bot.send(src, "A poll is going on! Use <font color='green'><b>/viewpoll</b></font> for more information.", chan);
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
        return [
            {
                name: "vote",
                category: "0",
                help: [
                    "{Template::PollOption Poll Option}", "To vote for {Template::PollOption Poll Option} on the poll."
                ],
                allowedWhenMuted: false,
                handler: function (command) {
                    var num = command.data * 1,
                        ip = command.srcInfo.ip, // TODO: command.srcInfo
                        Poll = DataHash.poll;

                    if (!Poll.mode) {
                        command.send("There is no poll.");
                        return;
                    }
                    if (!Poll.options.has(num)) {
                        command.send("Invalid option '" + num + "'.");
                        return;
                    }
                    if (Poll.options[num].votes.has(ip)) {
                        command.send("You already voted!");
                        return;
                    }

                    Poll.options[num].votes.push(ip);
                    Poll.votes++;

                    command.send("You voted for option " + num + " (" + Poll.options[num].name + ") on the poll!");
                }
            },

            viewpoll
        :
        function () {
            if (!Poll.mode) {
                botMessage(src, "No poll is going on.", chan);
                return;
            }

            botMessage(src, "Poll started by " + Poll.starter.bold() + "!", chan);

            var x, current_votes, option;
            for (x in Poll.options) {
                option = Poll.options[x].name;
                botMessage(src, x + ". " + option, chan)
            }

            sys.sendMessage(src, '', chan);

            if (Poll.votes === 0) {
                botMessage(src, "No one voted yet.", chan);
                return;
            }

            botMessage(src, Poll.subject + " - Results so far:", chan);

            for (x in Poll.options) {
                option = Poll.options[x];
                current_votes = option.votes;
                botMessage(src, x + ". " + option.name + " - " + current_votes.length, chan);
            }
        }

        ]
        ;
    }
})