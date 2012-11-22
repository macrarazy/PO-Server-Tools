/* Dependencies:
 - modules/jsext.js
 - modules/utilities.js
 */

/**
 * @fileOverview Server-side pokedex
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

(function () {
    var parseFile,
        parseMoveFile,
        Files,
        stats,
        fweigh,
        fheigh,
        fevol,
        fgen,
        fcc,
        fegg1,
        fegg2,
        fmoves,
        pokeId = 0,
        hasFegg2,
        moveObj = {},
        fdw,
        fegg,
        fevent,
        flevel,
        fevom,
        ftms,
        ftutor,
        current_move,
        dwMoves = {},
        eggMoves = {},
        eventMoves = {},
        levelMoves = {},
        evoMoves = {},
        tmMoves = {},
        tutorMoves = {},
        i = 1,
        importMoves,
        fEgg2Pokes = {},
        hasFegg1,
        evos,
        statsLoopStopped = false;

    try {
        if (!Pokedex) {
            Pokedex = {};
        }
        if (!Pokedex.data) { /* Only do this once! Takes too much time! */
            parseFile = function (file) {
                    return (sys.getFileContent("db/pokes/" + file + ".txt") || "").split("\n");
                },
                parseMoveFile = function (file) {
                    return parseFile("5G/" + file + "_moves");
                },
                Files = {
                    'stats': parseFile("stats"),
                    'weight': parseFile("weight"),
                    'height': parseFile("height"),
                    'evos': parseFile("evos"),
                    'evolevels': parseFile("5G/minlevels"),
                    'genders': parseFile("gender"),
                    'cc': parseFile("level_balance"),

                    'egggroup1': parseFile("egg_group_1"),
                    'egggroup2': parseFile("egg_group_2"),

                    'moves': {
                        'dw': parseMoveFile("dw"),
                        'egg': parseMoveFile("egg"),
                        'level': parseMoveFile("level"),
                        'evo': parseMoveFile("pre_evo"),
                        'event': parseMoveFile("special"),
                        'tms': parseMoveFile("tm_and_hm"),
                        'tutor': parseMoveFile("tutor")
                    }
                },
                stats = Files.stats,
                fweigh = Files.weight,
                fheigh = Files.height,
                fevol = Files.evolevels,
                fgen = Files.genders,
                fcc = Files.cc,
                fegg1 = Files.egggroup1,
                fegg2 = Files.egggroup2,
                fmoves = Files.moves,
                fdw = fmoves.dw,
                fegg = fmoves.dw,
                fevent = fmoves.event,
                flevel = fmoves.level,
                fevom = fmoves.evo,
                ftms = fmoves.tms,
                ftutor = fmoves.tutor,
                dwMoves = {},
                eggMoves = {},
                eventMoves = {},
                levelMoves = {},
                evoMoves = {},
                tmMoves = {},
                tutorMoves = {},
                importMoves = function (moveArray, Obj) {
                    moveArray.forEach(function (value, index, array) {
                        var moveSplit = value.split(":"),
                            moveSpace = value.split(" "),
                            poke = +(moveSplit[0]);

                        if (value.isEmpty() || moveSplit[1].charAt(0) !== "0") { // Empty line, forme
                            return;
                        }

                        moveSpace.splice(0, 1);
                        Obj[poke] = moveSpace.join(" ");
                    });
                },
                evos = Files.evos.map(function (evo) {
                    return evo.split(" ");
                });

            Pokedex.data = {};

            /* Let's begin with moves */
            importMoves(fdw, dwMoves);
            importMoves(fegg, eggMoves);
            importMoves(fevent, eventMoves);
            importMoves(flevel, levelMoves);
            importMoves(fevom, evoMoves);
            importMoves(ftms, tmMoves);
            importMoves(ftutor, tutorMoves);

            while (i !== 650) {
                current_move = levelMoves[i];

                [dwMoves, eggMoves, eventMoves, evoMoves, tutorMoves, tmMoves].forEach(function (value, index, array) {
                    if (value.has(i)) {
                        current_move += " " + value[i];
                    }
                });

                moveObj[sys.pokemon(i)] = current_move;
                i++;
            }

            /* Checks for duplicate moves */
            moveObj.forEach(function (value, index, array) {
                var movesDone = [],
                    move2Array = value.split(" ");

                move2Array.forEach(function (value, index, array) {
                    var moveId = sys.move(+(value));
                    if (movesDone.has(moveId)) {
                        array.splice(i, 3);
                        return;
                    }

                    movesDone.push(moveId);
                });

                array[index] = move2Array.join(" ");
            });

            /* We check CC later, as it's a little messy.
               We also will check evolutions later as some pokes don't have one. */
            fegg2.forEach(function (value, index, array) {
                var current = value.split(" ");
                if (current === "0") {
                    return;
                }

                fEgg2Pokes[current[0]] = current[1];
            });

            stats.forEach(function (value, index, array) {
                var currentStats,
                    statsTemp,
                    split,
                    poke;

                if (statsLoopStopped) {
                    return;
                }

                pokeId++;

                /* Put stuff into an array here. */
                currentStats = [value.split(" ")],
                    statsTemp = currentStats[0],
                    split = value.split(":");

                if (!split[1]) {
                    statsLoopStopped = true;
                    return;
                }

                /* First is for formes. Second is missingno check. */
                if (split[1].charAt(0) !== "0" || split[0] === "0") {
                    pokeId--;
                    return;
                }

                currentStats = [
                    statsTemp,
                    fweigh[pokeId].split(" "),
                    fheigh[pokeId].split(" "),
                    fgen[pokeId].split(" "),
                    fevol[pokeId].split(" ")
                ];

                if (!!fegg1[pokeId]) {
                    hasFegg1 = true;
                    currentStats.push(fegg1[pokeId].split(" "));
                } else {
                    hasFegg1 = false;
                    currentStats.push(" ");
                }

                if (!!fEgg2Pokes[pokeId]) {
                    hasFegg2 = true;
                    currentStats.push([pokeId, fEgg2Pokes[pokeId]]);
                } else {
                    hasFegg2 = false;
                    currentStats.push(" ");
                }

                poke = +(split[0]);

                /* Egg Groups */
                if (hasFegg1) {
                    currentStats[5][1] = util.message.cut(currentStats[5], 1, ' ');
                }
                if (hasFegg2) {
                    currentStats[6][1] = util.message.cut(currentStats[6], 1, ' ');
                }

                Pokedex.data[poke] = {
                    "stats": {
                        'HP': statsTemp[1],
                        'ATK': statsTemp[2],
                        'DEF': statsTemp[3],
                        'SPATK': statsTemp[4],
                        'SPDEF': statsTemp[5],
                        'SPD': statsTemp[6]
                    },

                    "weight": statsTemp[1][1],
                    "height": statsTemp[2][1],
                    "minlvl": +(statsTemp[4][1].split("/").charAt(0)),
                    "genders": statsTemp[3][1],
                    "egg": [statsTemp[5][1], statsTemp[6][1]],
                    "moves": moveObj[poke]
                };
            }); /* Done! */

            /* Parsing evolutions */
            evos.forEach(function (value, index, array) {
                var nextEntry = array[index + 1],
                    poke = sys.pokemon(value[0]),
                    data = Pokedex.data[poke],
                    length = value.length;

                if (!!nextEntry && +(value[1]) === +(nextEntry[0])) {
                    data.evos = [value[1], nextEntry[1]];
                } else if (length === 3 && value[1] === value[2]) { /* Feebas evo bug. */
                    data.evos = [value[1]];
                } else if (length !== 2) {
                    array[index].splice(0, 1);
                    data.evos = value;
                } else if (+(value[0]) + 1 === +(value[1])) {
                    data.evos = [value[1]];
                }
            }); /* Done! */

            /* Checking CC levels */
            fcc.forEach(function (value, index, array) {
                var split = value.split(":"),
                    ccSpace = value.split(" "),
                    poke = sys.pokemon(+(split[0]));

                if (!poke || poke === "Missingno" || split[1].charAt(0) !== "0") { // Formes. Missingno.
                    return;
                }

                Pokedex.data[poke].cc = +(ccSpace[1]);
            });
        }
        /* End of loading pokemon data */

        Pokedex.moveColours = {
            0: "#a8a878",
            1: "#c03028",
            2: "#a890f0",
            3: "#a040a0",
            4: "#e0c068",
            5: "#b8a038",
            6: "#a8b820",
            7: "#705898",
            8: "#b8b8d0",
            9: "#f08030",
            10: "#6890f0",
            11: "#78c850",
            12: "#f8d030",
            13: "#f85888",
            14: "#98d8d8",
            15: "#7038f8",
            16: "#705848",
            17: "black"
        };

        /* Pokedex functions */
        Pokedex.formatStat = function (poke, pokeStat) {
            var stat = Pokedex.data[poke].stats[pokeStat],
                string = stat.bold(),
                ranges = [30, 50, 60, 70, 80, 90, 100, 200, 300],
                colors = [
                    "#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"
                ],
                loopDone = false;


            ranges.forEach(function (value, index, array) {
                if (!loopDone && stat <= value) {
                    string = string.fontcolor(colors[index]);
                    loopDone = true;
                }
            });

            return string;
        };

        Pokedex.statsOf = function (poke) {
            var ret = [];

            Pokedex.data[poke].stats.forEach(function (value, index, array) {
                ret.push(value);
            });

            return ret;
        };

        Pokedex.formatStatsOf = function (poke) {
            var ret = "";

            ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"].forEach(function (value, index, array) {
                ret += value + ": " + Pokedex.formatStat(poke, value) + " | ";
            });

            return ret;
        };

        Pokedex.movesOf = function (poke) {
            return Pokedex.data[poke].moves.split(" ").map(function (move) {
                return +(move);
            }).sort(function (a, b) {
                    return sys.moveType(b) - sys.moveType(a);
                });
        };

        Pokedex.evosOf = function (poke) {
            return Pokedex.data[poke].evos || [];
        };

        Pokedex.formatEvosOf = function (poke) {
            var evos = Pokedex.evosOf(poke),
                ret = [];

            evos.forEach(function (value, index, array) {
                ret.push("<b>" + sys.pokemon(value).fontcolor(Pokedex.moveColours[sys.pokeType1(value)]) + "</b>");
            });

            return ret.fancyJoin();
        };

        Pokedex.formatMovesOf = function (poke) {
            var moves = Pokedex.movesOf(poke),
                retString = "",
                movesLength = moves.length - 1;

            moves.forEach(function (value, index, array) {
                retString += "<small><b style='color: " + Pokedex.moveColours[sys.moveType(value)] + "'>" + sys.move(value) + "</b></small>";
                if (index !== movesLength) {
                    retString += ", ";
                }
            });

            return retString + ".";
        };

        Pokedex.baseStatTotal = function (pokemon) {
            var poke = Pokedex.data[pokemon].stats,
                ret = 0;

            poke.forEach(function (value, index, array) {
                ret += value * 1;
            });

            return ret;
        };

        Pokedex.formatBaseStatTotal = function (poke) {
            var stat = Pokedex.baseStatTotal(poke),
                string = stat.bold(),
                ranges = [180, 300, 360, 420, 480, 540, 600, 1200, 1800],
                colors = [
                    "#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"
                ],
                loopDone = false;

            ranges.forEach(function (value, index, array) {
                if (!loopDone && stat <= value) {
                    string = string.fontcolor(colors[index]);
                    loopDone = true;
                }
            });

            return string;
        };

        Pokedex.pokeType = function (poke) {
            var poke_num = sys.pokeNum(poke),
                type = sys.pokeType1(poke_num),
                ret = "",
                type2 = sys.pokeType2(poke_num),
                type_name2;

            ret += sys.type(type).bold().fontcolor(Pokedex.moveColours[type]);

            if (type2 != 17) {
                type_name2 = sys.type(type2).bold().fontcolor(Pokedex.moveColours[type2]);
                ret += " & " + type_name2;
            }

            return ret;
        };

        Pokedex.firstGen = function (poke) {
            poke = sys.pokeNum(poke);

            if (poke < 152) {
                return 1;
            } else if (poke < 252) {
                return 2;
            } else if (poke < 387) {
                return 3;
            } else if (poke < 494) {
                return 4;
            }

            return 5;
        };

        Pokedex.pokeAbilities = function (poke) {
            var ret,
                abil;

            poke = sys.pokeNum(poke),
                abil = [sys.pokeAbility(poke, 0), sys.pokeAbility(poke, 1), sys.pokeAbility(poke, 2)];

            ret += sys.ability(abil[0]).bold();

            if (abil[1] !== 0) {
                ret += " | " + sys.ability(abil[1]).bold();
            }
            if (abil[2] !== 0) {
                ret += " | " + sys.ability(abil[2]).bold() + " (<u>Dream World Ability</u>)";
            }
            return ret;
        };

        Pokedex.pokeGender = function (poke) {
            var pD = +(Pokedex.data[poke].genders);

            if (pD === 3) {
                return "<img src='Themes/Classic/genders/gender1.png'> <img src='Themes/Classic/genders/gender2.png'>";
            } else if (pD === 2) {
                return "<img src='Themes/Classic/genders/gender2.png'>";
            } else if (pD === 1) {
                return "<img src='Themes/Classic/genders/gender1.png'>";
            }

            return "<img src='Themes/Classic/genders/gender0.png'>";
        };

        Pokedex.run = function (src, pokemon, chan, showSource) {
            var t = new Templates.list("Pokedex - " + pokemon.fontcolor(Pokedex.moveColours[sys.pokeType1(sys.pokeNum(pokemon))])),
                n = sys.pokeNum(pokemon),
                PD = Pokedex.data[pokemon],
                s = sys.pokeType2(n) == 17 ? "" : "s",
                s2 = sys.pokeAbility(n, 1) == 0 && sys.pokeAbility(n, 2) == 0 ? "y" : "ies",
                gender = Pokedex.pokeGender(pokemon),
                eggs = PD.egg,
                eggstr = "",
                evoS = "";

            t.register("<img src='pokemon:num=" + n + "'> <img src='pokemon:num=" + n + "&back=true'> <img src='pokemon:num=" + n + "&shiny=true'> <img src='pokemon:num=" + n + "&shiny=true&back=true'><br/>");
            t.register("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + gender);
            t.register("National Dex Number: " + String(n).bold() + ".");
            t.register("Generation " + (Pokedex.firstGen(pokemon) + "").bold() + " Pokemon. ");

            if (!!PD.evos || (PD.minlvl !== 1 && PD.minlvl !== 100)) {
                t.register("");
            }

            if (!!PD.evos) {
                if (PD.evos.length !== 1) {
                    evoS = "s";
                }
                t.register("Evolution" + evoS + ": " + Pokedex.formatEvosOf(pokemon));
            }

            if (PD.minlvl !== 1 && PD.minlvl !== 100) {
                t.register("Minimum Level: <b>" + PD.minlvl + "</b>");
            }

            t.register("Level in Challenge Cup: <b>" + PD.cc + "</b><br/>");

            if (!PD.egg[0].isEmpty()) {
                eggstr += PD.egg[0].bold();
            }

            if (!PD.egg[1].isEmpty()) {
                eggstr += " and " + PD.egg[1].bold();
            }

            t.register("Type" + s + ": " + Pokedex.pokeType(pokemon));

            if (eggstr != "") {
                if (!eggstr.contains("and ")) {
                    t.register("Egg Group: " + eggstr);
                } else {
                    t.register("Egg Groups: " + eggstr);
                }
            }

            t.register("Abilit" + s2 + ": " + Pokedex.pokeAbilities(pokemon) + "<br/>");

            t.register("Weight: <b>" + PD.weight + " kg</b>");
            t.register("Height <b>" + PD.height + " m</b><br/>");

            t.register(Pokedex.formatStatsOf(pokemon));
            t.register("Base Stat Total: " + Pokedex.formatBaseStatTotal(pokemon));

            if (pokemon.toLowerCase() !== "smeargle") { // Smeargle crashes.
                t.register("<br/> " + Pokedex.formatMovesOf(pokemon));
            } else {
                t.register("<br/> Smeargle learns all moves except Chatter and Transform.");
            }

            if (showSource) {
                sys.sendHtmlMessage(src, t.template.join("<br/>").escapeHtml(), chan);
                return;
            }

            t.render(src, chan);
        }
    } catch (Exception) {
        print(util.error.format(Exception));
    }
}());

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} Commands - Pokedex
     */
    Name: function () {
        return "Commands - Pokedex";
    },
    /**
     * Returns the commands of this module
     * @private
     * @return {Object}
     */
    Commands: function () {
        return [
            {
                name: "pokedex",
                handler: function (command) {
                    var data = command.data,
                        formeIndex = data.indexOf("-"),
                        rand,
                        rands;

                    if (formeIndex != -1) {
                        data = data.substr(0, formeIndex);
                    }

                    if (!sys.pokeNum(data)) {
                        data = +(data);
                        if (!!sys.pokemon(data)) {
                            data = sys.pokemon(data);
                        }
                    } else {
                        data = sys.pokemon(sys.pokeNum(data));
                        /* Correcting case. */
                    }

                    try {
                        Pokedex.run(src, data, chan);
                    } catch (ignore) {
                        rand = sys.pokemon(sys.rand(1, 650));
                        rands = util.grammar.es(rand);

                        command.send("Since the Pokémon " + data + " doesn't exist, the Pokédex displayed " + rands + " data instead.".escapeHtml());
                        try {
                            Pokedex.run(command.src, rand, command.chan);
                        } catch (PokedexException) {
                            command.send("The Pokédex isn't functional at the moment.");
                            print("PokedexException: " + util.error.format(PokedexException));
                        }
                    }
                }
            }
        ];
    }
})