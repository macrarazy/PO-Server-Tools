/* Fun commands for users */

(function () {
    if (typeof AttackingMoves === "undefined") {
        AttackingMoves = [];

        Truthy.foreach(sys.getFileContent("db/moves/5G/damage_class.txt").split("\n"), 
            function (value, index, array) {
                if (value === "0 0") {
                    return "continue";
                }

                AttackingMoves.push(+(value.split(" ")[0]));
        });
    }
}());

({
    Name: function () {
        return "Commands - User: Fun";
    },
    Commands: function () {
        CommandHandlers._lists.user.add("funcommands");

        // TODO: Add other fun commands
        return [
            {
                name: "roulette",
                help: ["Find a random Pokémon with the chance of it being shiny!"],
                handler: function (command) {
                    var randpoke = sys.rand(1, 650),
                        rand = sys.rand(1, 5),
                        poke,
                        shine = "",
                        shiny;

                    // NOTE: notEnabled hook for CommandsEnabled
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
                name: "catch",
                help: ["Catch a random Pokémon with the chance of it being shiny!"],
                handler: function (command) {
                    var num = sys.rand(1, 649),
                        pokemon = sys.pokemon(num),
                        nature = sys.nature(sys.rand(1, 24)),
                        rand = sys.rand(30, 531),
                        shiny = sys.rand(30, 531),
                        ivs = [
                            sys.rand(0, 32), sys.rand(0, 32), sys.rand(0, 32), sys.rand(0, 32), sys.rand(0, 32),
                            sys.rand(0, 32)
                        ],
                        lvl = sys.rand(1, 101);

                    // NOTE: notEnabled hook for CommandsEnabled
                    if (call("notEnabled", command)) {
                        return;
                    }
                    /* For mafia */
                    if (command.self.auth < 1 && call("onMessageCommand", command)) {
                        return;
                    }

                    // TODO: util.pokemon
                    // util.pokemon.sprite = formatPoke
                    if (rand !== shiny) {
                        command
                            .send(util.pokemon.sprite(num, false, false, 0, 5) + " " + util.pokemon.sprite(num, false, true, 0, 5))
                            .sendAll(command.self.player + " caught a level " + lvl + " " + pokemon + " with a " + nature + " nature!")
                            .send(pokemon + " has the following IVs:")
                            .send("HP: " + ivs[0] + " Atk: " + ivs[1] + " Def: " + ivs[2] + " SpA: " + ivs[3] + " SpD: " + ivs[4] + " Spd: " + ivs[5] + ".");
                    }
                    else {
                        command
                            .send(util.pokemon.sprite(num, true, false, 0, 5) + " " + util.pokemon.sprite(num, true, true, 0, 5))
                            .sendAll(command.self.player + " caught a level " + lvl + " " + pokemon + " with a " + nature + " nature!")
                            .send(pokemon + " has the following IVs:")
                            .send("HP: " + ivs[0] + " Atk: " + ivs[1] + " Def: " + ivs[2] + " SpA: " + ivs[3] + " SpD: " + ivs[4] + " Spd: " + ivs[5] + ".")
                            .sendAll("This is truly a rare event");
                    }
                }
            },
            {
                name: "attack",
                help: [
                    [
                        "Text::Any {Player}",
                        "Pokemon::AttackingMove {<u>Attack</u>}"
                    ],
                    "Attack Text::Any {Player} with a(n) (random) attack! Pokemon::AttackingMove {<u>Attack</u>} is optional and has to be an attacking move."
                ],
                handler: function (command) {
                    var player = command.mcmd[0],
                        attack = sys.move(AttackingMoves[Math.floor(AttackingMoves.length * Math.random())]),
                        movenum = sys.moveNum(command.mcmd[1]);

                    // NOTE: notEnabled hook for CommandsEnabled
                    if (call("notEnabled", command)) {
                        return;
                    }
                    /* For mafia */
                    if (command.self.auth < 1 && call("onMessageCommand", command)) {
                        return;
                    }
                    // TODO: JSESSIONUser.prototype.capsMute
                    if (command.self.jsession.capsMute(command.data, chan)) { // Combine both.
                        return;
                    }

                    if (player.length > 25) {
                        command.send("The player's name must be 25 characters or less.");
                        return;
                    }

                    if (AttackingMoves.has(movenum)) {
                        attack = sys.move(movenum); // Corrects case.
                    }

                    // TODO: call("messageAllowed") hook
                    if (call("messageAllowed", src, commandData)) {
                        return;
                    }

                    command.sendAll(command.self.player + " used " + attack + " on " + command.tar.player + "!");
                }
            },
            {

                name: "future",
                help: [
                    [
                        "Text::Number {Time}",
                        "Text::Any Message"
                    ],
                    "Sends Text::Any {Message} Text::Number {Time} seconds into the future! Text::Number {Time} must be 5 seconds or more and under 5 hours. Text::Any {Message} can also be a command (with a proper command start)."
                ],
                handler: function (command) {
                    var mcmd = command.mcmd,
                        time = util.time.time(),
                        poUser = command.self.jsession,
                        mess = util.cut(mcmd, 1, ":");

                    mcmd[0] = +(mcmd[0]);

                    if (isNaN(mcmd[0])) {
                        command.send("Specify a valid amount of time!");
                        return;
                    }
                    if (!mcmd[1]) {
                        command.send("Specify a message!");
                        return;
                    }
                    if (mcmd[0] < 5 || mcmd[0] > 18000) {
                        command.send("The time must be over 5 seconds and be under 5 hours (" + 18000 + " seconds).");
                        return;
                    }
                    if (poUser.lastFuture !== 0) {
                        if (poUser.lastFuture > time) {
                            command.send("Please wait " + util.time.format(poUser.lastFuture - time) + " before using another /future.");
                            return;
                        }
                    }

                    // TODO: Settings.FutureLimit
                    poUser.lastFuture = time + (Settings.FutureLimit || 30);

                    sys.setTimer(function () {
                        script.beforeChatMessage(command.src, mess, command.chan);
                    }, mcmd[0], false);

                    command.send("Your message was sent " + util.time.format(mcmd[0]) + " into the future!");
                }
            },
            {
                name: "funcommands",
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
