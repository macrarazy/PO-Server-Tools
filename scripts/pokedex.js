/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: pokedex.js
// Contains an somewhat advanced pokedex using PO's data files.
// Depends on: 

// Table of Content:
//

// TODO
(function () {
    var Pokedex = {
        data: {}
    };
    
    try {
        var parseFile = function (file) {
                var res = sys.getFileContent("db/pokes/" + file + ".txt");
    
                if (!res) {
                    return [];
                }
    
                return res.split("\n");
            },
            parseMoveFile = function (file) {
                return parseFile("5G/" + file + "_moves");
            };
    
        var Files = {
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
        };
        
        var x, curr_stats, curr_poke_stats, poke, spl, fstats = Files.stats,
            pMF, fweigh = Files.weight,
            fheigh = Files.height,
            fevol = Files.evolevels,
            fgen = Files.genders,
            fcc = Files.cc,
            oldCurrStat, fegg1 = Files.egggroup1,
            fegg2 = Files.egggroup2,
            fmoves = Files.moves,
            pokeId = 0,
            hasFegg2;

        fevo = Files.evos.map(function (pokeIds) {
            return pokeIds.split(" ");
        });

        var moveObj = {},
            fdw = fmoves.dw,
            fegg = fmoves.dw,
            fevent = fmoves.event,
            flevel = fmoves.level,
            fevom = fmoves.evo,
            ftms = fmoves.tms,
            ftutor = fmoves.tutor,
            current_move, c_m_spl, c_m_space, c_poke, dwMoves = {},
            eggMoves = {},
            eventMoves = {},
            levelMoves = {},
            evoMoves = {},
            tmMoves = {},
            tutorMoves = {},
            i = 1;

        //Lets begin with moves.
        var importMoves = function (moveArray, Obj) {
            for (x in moveArray) {
                current_move = moveArray[x];

                c_m_spl = current_move.split(":");
                c_m_space = current_move.split(" ");
                c_poke = Number(c_m_spl[0]);

                if (current_move === "" || current_move === " ") {
                    continue;
                }

                if (c_m_spl[1].charAt(0) !== "0") { // A forme.
                    continue;
                }

                c_m_space.splice(0, 1);
                Obj[c_poke] = c_m_space.join(" ");
            }
        }

        importMoves(fdw, dwMoves);
        importMoves(fegg, eggMoves);
        importMoves(fevent, eventMoves);
        importMoves(flevel, levelMoves);
        importMoves(fevom, evoMoves);
        importMoves(ftms, tmMoves);
        importMoves(ftutor, tutorMoves);

        while (i != 650) {
            c_poke = i;
            current_move = "";

            current_move += levelMoves[c_poke];

            if (c_poke in dwMoves) {
                current_move += " " + dwMoves[c_poke];
            }

            if (c_poke in eggMoves) {
                current_move += " " + eggMoves[c_poke];
            }

            if (c_poke in eventMoves) {
                current_move += " " + eventMoves[c_poke];
            }

            if (c_poke in evoMoves) {
                current_move += " " + evoMoves[c_poke];
            }

            if (c_poke in tutorMoves) {
                current_move += " " + tutorMoves[c_poke];
            }

            if (c_poke in tmMoves) {
                current_move += " " + tmMoves[c_poke];
            }

            moveObj[sys.pokemon(c_poke)] = current_move;
            i += 1;
        }

        // Double checks for multiple moves
        var mTA, doneMoves, c_mTA;
        for (x in moveObj) {
            doneMoves = [];
            current_move = moveObj[x];
            mTA = current_move.split(" ");

            for (i in mTA) {
                c_mTA = sys.move(Number(mTA[i]));
                if (doneMoves.has(c_mTA)) {
                    mTA.splice(i, 3);
                    continue;
                }

                doneMoves.push(c_mTA);
            }

            moveObj[x] = mTA.join(" ");
        }


//We check CC later, as it's a little messy.
//We also will check evos later as some pokes don't have one.

        var fEgg2Pokes = {},
            curr_fegg2, hasFegg1;
        for (x in fegg2) {
            curr_fegg2 = fegg2[x].split(" ");
            if (curr_fegg2 == "0") {
                continue;
            }

            fEgg2Pokes[curr_fegg2[0]] = curr_fegg2[1];
        }

        for (x in fstats) {
            x = Number(x);
            pokeId += 1;

            //Put stuff into an array here.

            curr_stats = [fstats[x].split(" ")];
            oldCurrStat = curr_stats[0];
            spl = fstats[x].split(":");

            if (spl[1] == undefined) {
                break;
            }

            //First is for formes. Second is missingno check.
            if (spl[1][0] != "0" || spl[0] == "0") {
                pokeId -= 1;
                continue;
            }

            curr_stats = [oldCurrStat, fweigh[pokeId].split(" "), fheigh[pokeId].split(" "), fgen[pokeId].split(" "), fevol[pokeId].split(" ")];

            if (fegg1[pokeId] != undefined) {
                hasFegg1 = true;
                curr_stats.push(fegg1[pokeId].split(" "));
            } else {
                hasFegg1 = false;
                curr_stats.push(" ");
            }

            if (fEgg2Pokes[pokeId] != undefined) {
                hasFegg2 = true;
                curr_stats.push([pokeId, fEgg2Pokes[pokeId]]);
            } else {
                hasFegg2 = false;
                curr_stats.push(" ");
            }

            poke = sys.pokemon(spl[0]);
            curr_poke_stats = curr_stats[0]; //Egg Groups
            if (hasFegg1) {
                curr_stats[5][1] = cut(curr_stats[5], 1, ' ');
            }
            if (hasFegg2) {
                curr_stats[6][1] = cut(curr_stats[6], 1, ' ');
            }

            Poke_Data[poke] = {
                "stats": {
                    'HP': curr_poke_stats[1],
                    'ATK': curr_poke_stats[2],
                    'DEF': curr_poke_stats[3],
                    'SPATK': curr_poke_stats[4],
                    'SPDEF': curr_poke_stats[5],
                    'SPD': curr_poke_stats[6]
                },

                "weight": curr_stats[1][1],
                "height": curr_stats[2][1],
                "minlvl": Number(curr_stats[4][1].split("/")[0]),
                "genders": curr_stats[3][1],
                "egg": [curr_stats[5][1], curr_stats[6][1]],
                "moves": moveObj[poke]
            };

            // Done!
        }

        //Parsing evos
        var pArr = Files.evos.map(function (a) {
            return a.split(" ");
        }),
            c_entry, next_entry, c_poke;

        for (x in pArr) {
            c_entry = pArr[x];
            next_entry = pArr[Number(x) + 1];
            c_poke = sys.pokemon(c_entry[0]);

            if (next_entry !== undefined && Number(c_entry[1]) == Number(next_entry[0])) {
                Poke_Data[c_poke].evos = [c_entry[1], next_entry[1]];
            }
            else if (c_entry.length === 3 && c_entry[1] === c_entry[2]) { // Feebas evo bug.
                Poke_Data[c_poke].evos = [c_entry[1]];
            }
            else if (c_entry.length !== 2) {
                c_entry.splice(0, 1);
                Poke_Data[c_poke].evos = c_entry;
            }
            else if (Number(c_entry[0]) + 1 === Number(c_entry[1])) {
                Poke_Data[c_poke].evos = [c_entry[1]];
            }
        }

        // Done!

        // Checking CC levels
        for (x in fcc) {
            c_entry = fcc[x];
            spl = c_entry.split(":");
            c_m_space = c_entry.split(" ");
            c_poke = sys.pokemon(Number(spl[0]));

            if (c_poke == undefined || c_poke == "Missingno" || spl[1][0] !== "0") { // Formes. Missingno.
                continue;
            }

            Poke_Data[c_poke].cc = Number(c_m_space[1]);
        }
    
        formatStat = function (poke, stat) {
            var stat = Poke_Data[poke].stats[stat];
            var string = stat.bold(),
                y;
            var ranges = [30, 50, 60, 70, 80, 90, 100, 200, 300];
            var colors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];
    
            for (y in ranges) {
                if (stat <= ranges[y]) {
                    return string.fontcolor(colors[y]);
                }
            }
    
            return string.fontcolor(colors[colors.length - 1]);
        }
    
        statsOf = function (poke) {
            var stat = Poke_Data[poke].stats;
            var ret = [],
                z;
            for (z in stat) {
                ret.push(stat[z]);
            }
            return ret;
        }
    
        formatStatsOf = function (poke) {
            var stats = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"];
            var ret = "",
                z, stt;
            for (z in stats) {
                stt = stats[z];
                if (stt != "SPD") {
                    ret += stt + ": " + formatStat(poke, stt) + " | ";
                }
                else {
                    ret += stt + ": " + formatStat(poke, stt);
                }
            }
    
            return ret;
        }
    
        movesOf = function (poke) {
            var moves = Poke_Data[poke].moves.split(" ").map(function (move) {
                return Number(move);
            }).sort(function (a, b) {
                return sys.moveType(b) - sys.moveType(a);
            });
    
            return moves;
        }
    
        evosOf = function (poke) {
            var PD = Poke_Data[poke];
            if (PD.evos === undefined) {
                return [];
            }
    
            return PD.evos;
        }
    
        var moveColours = {
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
            16: "#705848"
        };
    
        formatEvosOf = function (poke) {
            var evos = evosOf(poke),
                y, retString = [];
    
            for (y in evos) {
                retString.push(sys.pokemon(evos[y]).fontcolor(moveColours[sys.pokeType1(evos[y])]).bold());
            }
    
            return fancyJoin(retString);
        }
    
        formatMovesOf = function (poke) {
            var moves = movesOf(poke),
                y, retString = "",
                ml = moves.length - 1;
    
            for (y in moves) {
                retString += sys.move(moves[y]).fontcolor(moveColours[sys.moveType(moves[y])]).bold().fontsize(2);
                if (ml != y) {
                    retString += ", ";
                }
            }
    
            return retString + ".";
        }
    
        baseStatTotal = function (poke) {
            var poke = Poke_Data[poke].stats;
            var retnum = 0,
                y;
    
            for (y in poke) {
                retnum += Number(poke[y]);
            }
            return retnum;
        }
    
        formatBaseStatTotal = function (poke) {
            var stat = baseStatTotal(poke);
            var string = String(stat).bold(),
                y;
            var ranges = [180, 300, 360, 420, 480, 540, 600, 1200, 1800];
            var colors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];
    
            for (y in ranges) {
                if (stat <= ranges[y]) {
                    return string.fontcolor(colors[y]);
                }
            }
            return string;
        }
    
        pokeType = function (poke) {
            var poke_num = sys.pokeNum(poke);
            var type = sys.pokeType1(poke_num);
            var ret = "";
            var type2 = sys.pokeType2(poke_num);
    
            var type_name = sys.type(type).bold().fontcolor(moveColours[type]);
    
            ret += type_name;
    
            if (type2 != 17) {
                var type_name2 = sys.type(type2).bold().fontcolor(moveColours[type2]);
                ret += " & " + type_name2;
            }
    
            return ret;
        }
    
        firstGen = function (poke) {
            poke = sys.pokeNum(poke);
    
            if (poke < 152) {
                return 1;
            }
    
            else if (poke < 252) {
                return 2;
            }
    
            else if (poke < 387) {
                return 3;
            }
    
            else if (poke < 494) {
                return 4;
            }
    
            return 5;
        }
    
        pokeAbilities = function (poke) {
            poke = sys.pokeNum(poke);
            var ret = "";
            var abil = [sys.pokeAbility(poke, 0), sys.pokeAbility(poke, 1), sys.pokeAbility(poke, 2)];
    
            ret += sys.ability(abil[0]).bold();
    
            if (abil[1] != 0) {
                ret += " | " + sys.ability(abil[1]).bold();
            }
            if (abil[2] != 0) {
                ret += " | " + sys.ability(abil[2]).bold() + " (<u>Dream World Ability</u>)";
            }
            return ret;
        }
    
        pokeGender = function (poke) {
            var pD = Number(Poke_Data[poke].genders);
    
            if (pD === 3) {
                return "<img src='Themes/Classic/genders/gender1.png'> <img src='Themes/Classic/genders/gender2.png'>";
            }
    
            else if (pD === 2) {
                return "<img src='Themes/Classic/genders/gender2.png'>";
            }
    
            else if (pD === 1) {
                return "<img src='Themes/Classic/genders/gender1.png'>";
            }
    
            return "<img src='Themes/Classic/genders/gender0.png'>";
        }
    
        pokedex = function (src, chan, pokemon, source) {
            var t = new Templater("Pokedex - " + pokemon.fontcolor(moveColours[sys.pokeType1(sys.pokeNum(pokemon))]));
    
            var n = sys.pokeNum(pokemon),
                PD = Poke_Data[pokemon],
                s = sys.pokeType2(n) == 17 ? '' : 's',
                s2 = sys.pokeAbility(n, 1) == 0 && sys.pokeAbility(n, 2) == 0 ? 'y' : 'ies',
                gender = pokeGender(pokemon),
                eggs = PD.egg,
                eggstr = "",
                evoS = "";
    
            t.register("<img src='pokemon:num=" + n + "'> <img src='pokemon:num=" + n + "&back=true'> <img src='pokemon:num=" + n + "&shiny=true'> <img src='pokemon:num=" + n + "&shiny=true&back=true'><br/>");
            t.register("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + gender);
            t.register("National Dex Number: " + String(n).bold() + ".");
            t.register("Generation " + String(firstGen(pokemon)).bold() + " Pokemon. ");
    
            if ((PD.evos !== undefined || (PD.minlvl !== 1 && PD.minlvl !== 100))) {
                t.register("");
            }
    
            if (PD.evos !== undefined) {
                if (PD.evos.length !== 1) {
                    evoS = "s";
                }
                t.register("Evolution" + evoS + ": " + formatEvosOf(pokemon));
            }
    
            if (PD.minlvl !== 1 && PD.minlvl !== 100) {
                t.register("Minimum Level: <b>" + PD.minlvl + "</b>");
            }
    
            t.register("Level in Challenge Cup: <b>" + PD.cc + "</b><br/>");
    
            if (!isEmpty(PD.egg[0])) {
                eggstr += PD.egg[0].bold();
            }
    
            if (!isEmpty(PD.egg[1])) {
                eggstr += " and " + PD.egg[1].bold();
            }
    
            t.register("Type" + s + ": " + pokeType(pokemon));
    
            if (eggstr != "") {
                if (!eggstr.contains("and ")) {
                    t.register("Egg Group: " + eggstr);
                } else {
                    t.register("Egg Groups: " + eggstr);
                }
            }
    
            t.register("Abilit" + s2 + ": " + pokeAbilities(pokemon) + "<br/>");
    
            t.register("Weight: <b>" + PD.weight + " kg</b>");
            t.register("Height <b>" + PD.height + " m</b><br/>");
    
            t.register(formatStatsOf(pokemon));
            t.register("Base Stat Total: " + formatBaseStatTotal(pokemon));
    
            if (pokemon.toLowerCase() !== "smeargle") { // Smeargle crashes.
                t.register("<br/> " + formatMovesOf(pokemon));
            } else {
                t.register("<br/> Smeargle learns all moves except Chatter and Transform.");
            }
    
            if (!source) {
                t.render(src, chan);
                return;
            }
    
            sys.sendHtmlMessage(src, html_escape(t.template.join("<br/>")), chan);
    
        }
    } catch (e) {
        print(FormatError("", e));
    }
}());