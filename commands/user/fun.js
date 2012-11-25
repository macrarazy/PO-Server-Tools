({
    /**
     * Returns the name of this module
     * @private
     * @return {String}
     */
    Name: function () {
        return "Commands - User: Fun";
    },
    Commands: function () {
        if (Commands.Lists.user && !Commands.Lists.user.has("funcommands")) {
            Commands.Lists.user.push("funcommands");
        }

        // TODO: Add other fun commands
        return [
            {
                name: "roulette",
                category: "0",
                help: ["Find a random pokemon with the chance of it being shiny!"],
                handler: function (command) {
                    var randpoke = sys.rand(1, 650),
                        rand = sys.rand(1, 5),
                        poke,
                        shine = "",
                        shiny;

                    // TODO: notEnabled hook for CommandsEnabled
                    if (call("notEnabled", command)) {
                        return;
                    }
                    /* For mafia */
                    if (command.self.auth < 1 && call("onMessageCommand", command)) {
                        return;
                    }

                    // TODO: util.pokemon
                    // util.pokemon.sprite = formatPoke
                    if (rand !== 1) {
                        poke = util.pokemon.sprite(randpoke, false, false, false, 5, true);
                    } else {
                        poke = util.pokemon.sprite(randpoke, true, false, false, 5, true);
                        shine = "Shiny ";
                    }

                    shiny = util.grammar.an(shine + sys.pokemon(randpoke)) + "!";

                    command
                        .send("You got " + shiny + " " + poke)
                        .sendOthers(command.self.player + " got " + shiny);
                }
            },
            {
                name: "funcommands",
                category: "0",
                help: ["To view the <b>fun</b> commands."],
                handler: function (command) {
                    new Templates.command("Fun Commands")
                        .listCommands(["roulette", "catch", "attack", "future"])
                        .render(command.src, command.chan);
                }
            }
        ];
    }
})