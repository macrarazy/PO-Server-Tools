/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: tier-bans.js (TierBans)
// Contains pokemon bans used by the Pokémon Online tiers. This module can be disabled by setting Config.TierBans to false.
// Depends on: utils

// Table of Content:
// [expt]: Exports

(function () {
    var Utils = require('utils');
    
    var TierBans = {},
        beasts = {
            // Raikou
            243: (['Extremespeed', 'Aura Sphere', 'Weather Ball', 'Zap Cannon'].map(sys.moveNum)),
            // Entei
            244: (['Extremespeed', 'Howl', 'Crush Claw', 'Flare Blitz'].map(sys.moveNum)),
            // Suicune
            255: (['Extremespeed', 'Aqua Ring', 'Sheer Cold', 'Air Slash'].map(sys.moveNum))
        },
        INCLUDING = false,
        EXCLUDING = true,
        cc = ["Challenge Cup", "CC 1v1"],
        dw = ["No Preview OU", "No Preview Ubers", "Monotype", "Gen 5 1v1 Ubers", "Gen 5 1v1", "Challenge Cup", "CC 1v1", "DW Uber Triples", "No Preview OU Triples", "No Preview Uber Doubles", "No Preview OU Doubles", "Shanai Cup", "Monocolour"],
        dwpokemons = {},
        pokeColours = {},
        pokeNatures = {
            "Heatran": [
                ["Eruption"], "Quiet"
            ],
            "Suicune": [
                ["ExtremeSpeed", "Sheer Cold", "Aqua Ring", "Air Slash"], "Relaxed"
            ],
            "Raikou": [
                ["ExtremeSpeed", "Weather Ball", "Zap Cannon", "Aura Sphere"], "Rash"
            ],
            "Entei": [
                ["ExtremeSpeed", "Flare Blitz", "Howl", "Crush Claw"], "Adamant"
            ],
            "Snivy": [
                ["Aromatherapy", "Synthesis"], "Hardy"
            ]
        },
        lcpokemons = [],
        breedingpokemons = [];
    
    var dwlist = ["Rattata", "Raticate", "Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Oddish", "Gloom", "Vileplume", "Bellossom", "Bellsprout", "Weepinbell", "Victreebel", "Ponyta", "Rapidash", "Farfetch'd", "Doduo", "Dodrio", "Exeggcute", "Exeggutor", "Lickitung", "Lickilicky", "Tangela", "Tangrowth", "Kangaskhan", "Sentret", "Furret", "Cleffa", "Clefairy", "Clefable", "Igglybuff", "Jigglypuff", "Wigglytuff", "Mareep", "Flaaffy", "Ampharos", "Hoppip", "Skiploom", "Jumpluff", "Sunkern", "Sunflora", "Stantler", "Poochyena", "Mightyena", "Lotad", "Ludicolo", "Lombre", "Taillow", "Swellow", "Surskit", "Masquerain", "Bidoof", "Bibarel", "Shinx", "Luxio", "Luxray", "Psyduck", "Golduck", "Growlithe", "Arcanine", "Scyther", "Scizor", "Tauros", "Azurill", "Marill", "Azumarill", "Bonsly", "Sudowoodo", "Girafarig", "Miltank", "Zigzagoon", "Linoone", "Electrike", "Manectric", "Castform", "Pachirisu", "Buneary", "Lopunny", "Glameow", "Purugly", "Natu", "Xatu", "Skitty", "Delcatty", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Bulbasaur", "Charmander", "Squirtle", "Ivysaur", "Venusaur", "Charmeleon", "Charizard", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Infernape", "Monferno", "Piplup", "Prinplup", "Empoleon", "Treecko", "Sceptile", "Grovyle", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Caterpie", "Metapod", "Butterfree", "Pidgey", "Pidgeotto", "Pidgeot", "Spearow", "Fearow", "Zubat", "Golbat", "Crobat", "Aerodactyl", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Yanma", "Yanmega", "Murkrow", "Honchkrow", "Delibird", "Wingull", "Pelipper", "Swablu", "Altaria", "Starly", "Staravia", "Staraptor", "Gligar", "Gliscor", "Drifloon", "Drifblim", "Skarmory", "Tropius", "Chatot", "Slowpoke", "Slowbro", "Slowking", "Krabby", "Kingler", "Horsea", "Seadra", "Kingdra", "Goldeen", "Seaking", "Magikarp", "Gyarados", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Wooper", "Quagsire", "Qwilfish", "Corsola", "Remoraid", "Octillery", "Mantine", "Mantyke", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Barboach", "Whiscash", "Clamperl", "Gorebyss", "Huntail", "Relicanth", "Luvdisc", "Buizel", "Floatzel", "Finneon", "Lumineon", "Tentacool", "Tentacruel", "Corphish", "Crawdaunt", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Shellos", "Gastrodon", "Lapras", "Dratini", "Dragonair", "Dragonite", "Elekid", "Electabuzz", "Electivire", "Poliwag", "Poliwrath", "Politoed", "Poliwhirl", "Vulpix", "Ninetales", "Musharna", "Munna", "Darmanitan", "Darumaka", "Mamoswine", "Togekiss", "Burmy", "Wormadam", "Mothim", "Pichu", "Pikachu", "Raichu", "Abra", "Kadabra", "Alakazam", "Spiritomb", "Mr. Mime", "Mime Jr.", "Meditite", "Medicham", "Meowth", "Persian", "Shuppet", "Banette", "Spinarak", "Ariados", "Drowzee", "Hypno", "Wobbuffet", "Wynaut", "Snubbull", "Granbull", "Houndour", "Houndoom", "Smoochum", "Jynx", "Ralts", "Gardevoir", "Gallade", "Sableye", "Mawile", "Volbeat", "Illumise", "Spoink", "Grumpig", "Stunky", "Skuntank", "Bronzong", "Bronzor", "Mankey", "Primeape", "Machop", "Machoke", "Machamp", "Magnemite", "Magneton", "Magnezone", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Rhyperior", "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Phanpy", "Donphan", "Magby", "Magmar", "Magmortar", "Larvitar", "Pupitar", "Tyranitar", "Makuhita", "Hariyama", "Numel", "Camerupt", "Torkoal", "Spinda", "Trapinch", "Vibrava", "Flygon", "Cacnea", "Cacturne", "Absol", "Beldum", "Metang", "Metagross", "Hippopotas", "Hippowdon", "Skorupi", "Drapion", "Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop", "Bagon", "Shelgon", "Salamence", "Seel", "Dewgong", "Shellder", "Cloyster", "Chinchou", "Lanturn", "Smeargle", "Porygon", "Porygon2", "Porygon-Z", "Drilbur", "Excadrill", "Basculin", "Basculin-a", "Alomomola", "Stunfisk", "Druddigon", "Foongus", "Amoonguss", "Liepard", "Purrloin", "Minccino", "Cinccino", "Sandshrew", "Sandslash", "Vullaby", "Mandibuzz", "Rufflet", "Braviary", "Frillish", "Jellicent", "Weedle", "Kakuna", "Beedrill", "Shroomish", "Breloom", "Zangoose", "Seviper", "Combee", "Vespiquen", "Patrat", "Watchog", "Blitzle", "Zebstrika", "Woobat", "Swoobat", "Mienfoo", "Mienshao", "Bouffalant", "Staryu", "Starmie", "Togepi", "Shuckle", "Togetic", "Rotom", "Sigilyph", "Riolu", "Lucario", "Lugia", "Ho-Oh", "Dialga", "Palkia", "Giratina", "Grimer", "Muk", "Ditto", "Venonat", "Venomoth", "Herdier", "Lillipup", "Stoutland", "Sewaddle", "Swadloon", "Leavanny", "Cubchoo", "Beartic", "Landorus", "Thundurus", "Tornadus", "Dunsparce", "Sneasel", "Weavile", "Nosepass", "Probopass", "Karrablast", "Escavalier", "Shelmet", "Accelgor", "Snorunt", "Glalie", "Froslass", "Heatran", "Pinsir", "Emolga", "Heracross", "Trubbish", "Garbodor", "Snover", "Abomasnow", "Diglett", "Dugtrio", "Geodude", "Graveler", "Golem", "Onix", "Steelix", "Voltorb", "Electrode", "Cubone", "Marowak", "Whismur", "Loudred", "Exploud", "Aron", "Lairon", "Aggron", "Spheal", "Sealeo", "Walrein", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Gible", "Gabite", "Garchomp", "Pidove", "Tranquill", "Unfezant", "Tympole", "Palpitoad", "Seismitoad", "Cottonee", "Whimsicott", "Petilil", "Lilligant", "Ducklett", "Swanna", "Deerling", "Sawsbuck", "Elgyem", "Beheeyem", "Pawniard", "Bisharp", "Heatmor", "Durant", "Venipede", "Whirlipede", "Scolipede", "Tirtouga", "Carracosta", "Joltik", "Galvantula", "Maractus", "Dwebble", "Crustle", "Roggenrola", "Boldore", "Gigalith", "Vanillite", "Vanillish", "Vanilluxe", "Klink", "Klang", "Klinklang", "Swinub", "Piloswine", "Golett", "Golurk", "Gothitelle", "Gothorita"];
    
    var breedingList = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Hitmonlee", "Hitmonchan", "Hitmontop", "Tyrogue", "Porygon", "Porygon2", "Porygon-Z", "Gothorita", "Gothitelle"];
    
    var lclist = ["Bulbasaur", "Charmander", "Squirtle", "Croagunk", "Turtwig", "Chimchar", "Piplup", "Treecko", "Torchic", "Mudkip"];

    var bannedGSCSleep = [sys.moveNum("Spore"), sys.moveNum("Hypnosis"), sys.moveNum("Lovely Kiss"), sys.moveNum("Sing"), sys.moveNum("Sleep Powder")];
    var bannedGSCTrap = [sys.moveNum("Mean Look"), sys.moveNum("Spider Web")];
    
    var len,
        i;
    
    if (Config.DWAbilityCheck) {
        for (i = 0, len = dwlist.length; i < len; i += 1) {
            dwpokemons[sys.pokeNum(dwlist[i])] = true;
        }
    }


    for (i = 0, len = lclist.length; i < len; i += 1) {
        lcpokemons.push(sys.pokeNum(lclist[i]));
    }
    
    if (Config.DWAbilityCheck) {
        for (i = 0, len = breedingList.length; i < len; i += 1) {
            breedingpokemons.push(sys.pokeNum(breedingList[i]));
        }
    }
    
    TierBans.bannedGSCSleep = bannedGSCSleep;
    TierBans.bannedGSCTrap = bannedGSCTrap;
    
    TierBans.bans = [];
    TierBans.include = INCLUDING;
    TierBans.exclude = EXCLUDING;
    TierBans.newBan = function (method, tiers, ban) {
        TierBans.bans.push({
            method: method,
            tiers: tiers,
            ban: ban
        });
    };

    TierBans.isLegalTeam = function (src, team, tier, silent) {
        var alerts = [],
            bans = TierBans.bans,
            len = bans.length,
            alertLen,
            ban,
            alert,
            isCorrect,
            i,
            j;
        
        if (tier === "Challenge Cup" || tier === "Battle Factory") {
            return true;
        }
        
        if (!sys.hasLegalTeamForTier(src, team, tier)) {
            return false;
        }

        for (i = 0; i < len; i += 1) {
            ban = bans[i];
            isCorrect = ban.tiers.indexOf(tier) !== -1;
            
            if (ban.method === TierBans.exclude) {
                isCorrect = !isCorrect;
            }
            
            if (isCorrect) {
                alert = ban.ban(src, team, tier);
                
                if (Array.isArray(alert)) {
                    alerts.concat(alert);
                }
            }

            // Their team is valid if they have no alerts.
            if (alerts.length === 0) {
                return true;
            } else if (!silent) {
                for (j = 0, alertLen = alerts.length; j < alertLen; j += 1) {
                    Utils.teamAlertMessage(src, team, alerts[j]);
                }
                
                return false;
            }
        }
    };

    TierBans.findGoodTier = function (src, team) {
        var path = ["Wifi LC", "DW LC", "Wifi LC Ubers", "Wifi NU", "Wifi LU", "Wifi UU", "Wifi OU", "No Preview OU", "Wifi Ubers", "No Preview Ubers", "Challenge Cup"],
            tier,
            i;
        
        for (i in path) {
            tier = path[i];
            if (sys.hasLegalTeamForTier(src, team, tier) && this.isLegalTeam(src, team, tier, true)) {
                Utils.teamAlertMessage(src, team, "Your team's tier is now " + tier + ".");
                sys.changeTier(src, team, tier);
                return;
            }
        }
    };
    
    TierBans.newBan(EXCLUDING, [], function eventShinies(player, team) {
        var beast,
            slot,
            i;
        
        for (beast in beasts) {
            for (slot = 0; slot < 6; slot += 1) {
                if (sys.teamPoke(player, team, slot) === beast) {
                    for (i = 0; i < 4; i += 1) {
                        if (beasts[beast].has(sys.teamPokeMove(player, team, slot, i))) {
                            sys.changePokeShine(player, team, slot, true);
                        }
                    }
                }
            }
        }
    });

    // TODO: customAbilityBans
    /*
    TierBans.newBan(EXCLUDING, cc, function customAbilityBans(src, team, tier) {
        var ltier = tier.toLowerCase(),
            ret = [],
            bans = DataHash.bannedAbilities,
            i, ability, lability, poke, lpoke;
        for (i = 0; i < 6; i += 1) {
            ability = sys.ability(sys.teamPokeAbility(src, team, i)), lability = ability.toLowerCase(), poke = sys.pokemon(sys.teamPoke(src, team, i)), lpoke = poke.toLowerCase();

            if (bans[ltier] != undefined) {
                if (bans[ltier][lpoke] != undefined) {
                    if (bans[ltier][lpoke].indexOf(lability) != -1) {
                        ret.push(poke + " is not allowed to have ability " + ability + " in " + tier + ". Please change it in Teambuilder.");
                    }
                }
            }
        }
        return ret;
    });*/

    TierBans.newBan(EXCLUDING, cc, function eventMovesCheck(src, team, tier) {
        var ret = [],
            poke,
            nat,
            move,
            i,
            x,
            y;
        
        for (i = 0; i < 6; i += 1) {
            poke = sys.teamPoke(src, team, i);
            if (pokeNatures.has(poke)) {
                for (x in pokeNatures[poke]) {
                    nat = pokeNatures[poke][x];
                    for (y in nat[0]) {
                        move = nat[0][y];
                        if (sys.hasTeamPokeMove(src, team, i, sys.moveNum(move)) && sys.teamPokeNature(src, team, i) !== sys.natureNum(nat[1])) {
                            ret.push(sys.pokemon(poke) + " with " + move + " must be a " + nat[1] + " nature. Change it in the teambuilder.");
                        }
                    }
                }
            }
        }
        return ret;
    });

    TierBans.newBan(INCLUDING, ["Wifi LC", "Wifi LC Ubers", "Wifi UU LC"], function littleCupCheck(src, team, tier) {
        var ret = [],
            x,
            i;
        
        for (i = 0; i < 6; i += 1) {
            x = sys.teamPoke(src, team, i);
            if (x !== 0 && sys.hasDreamWorldAbility(src, team, i) && lcpokemons.indexOf(x) !== -1) {
                ret.push(sys.pokemon(x) + " is not allowed with a Dream World ability in the " + tier + " tier. Change it in the teambuilder.");

            }
        }
        return ret;
    });

    TierBans.newBan(INCLUDING, ["Wifi NU"], function evioliteCheck(src, team, tier) {
        var evioliteLimit = 6,
            eviolites = 0,
            x,
            i,
            item;

        for (i = 0; i < 6; i += 1) {
            x = sys.teamPoke(src, team, i);
            item = sys.teamPokeItem(src, team, i);
            
            if (item !== undefined) {
                item = sys.item(item);
            } else {
                item = "";
            }
            
            eviolites += 1;
            
            if (item === "Eviolite" && eviolites > evioliteLimit) {
                return ["Only 1 pokemon is allowed with eviolite in " + tier + " tier. Please remove extra evioites in teambuilder."];
            }
        }
    });

    TierBans.newBan(EXCLUDING, dw, function dwAbilityCheck(src, team, tier) {
        var ret = [],
            x,
            i;
        
        if (sys.gen(src, team) < 5) {
            return;
        }
        
        for (i = 0; i < 6; i += 1) {
            x = sys.teamPoke(src, team, i);
            if (x !== 0 && sys.hasDreamWorldAbility(src, team, i) && (!(x in dwpokemons) || (breedingpokemons.indexOf(x) !== -1 && sys.compatibleAsDreamWorldEvent(src, team, i) !== true))) {
                if (!(x in dwpokemons)) {
                    ret.push(sys.pokemon(x) + " is not allowed with a Dream World ability in " + tier + " tier. Change it in the teambuilder.");
                } else {
                    ret.push(sys.pokemon(x) + " has to be Male and have no egg moves with its Dream World ability in  " + tier + " tier. Change it in the teambuilder.");
                }
            }
        }
        return ret;
    });

    TierBans.newBan(INCLUDING, ["No Preview OU", "Wifi OU", "Wifi UU", "Wifi LU", "Wifi LC", "DW LC", "Wifi Ubers", "No Preview Ubers", "Clear Skies", "Clear Skies DW", "Monotype", "Monocolour", "Monogen", "Smogon OU", "Smogon UU", "Smogon RU", "Wifi NU"], function inconsistentCheck(src, team, tier) {
        var moody = sys.abilityNum("Moody"),
            ret = [],
            x,
            i;

        for (i = 0; i < 6; i += 1) {
            x = sys.teamPoke(src, team, i);
            if (x !== 0 && sys.teamPokeAbility(src, team, i) === moody) {
                ret.push(sys.pokemon(x) + " is not allowed with Moody in " + tier + ". Change it in the teambuilder.");
            }
        }
        return ret;
    });

    TierBans.newBan(INCLUDING, ["Clear Skies"], function weatherlesstiercheck(src, team, tier) {
        var ret = [],
            ability,
            tl,
            i;
        
        for (i = 0; i < 6; i += 1) {
            ability = sys.ability(sys.teamPokeAbility(src, team, i));
            tl = ability.toLowerCase();

            if (tl === "drizzle" || tl === "drought" || tl === "snow warning" || tl === "sand stream") {
                ret.push("Your team has a pokemon with the ability " + ability + ", please remove before entering " + tier + " tier.");
            }
        }
        return ret;
    });

    TierBans.newBan(INCLUDING, ["Monotype"], function monotypeCheck(src, team, tier) {
        var TypeA = sys.pokeType1(sys.teamPoke(src, team, 0), 5),
            TypeB = sys.pokeType2(sys.teamPoke(src, team, 0), 5),
            k,
            checkType,
            i,
            temptypeA,
            temptypeB;
        
        for (i = 1; i < 6; i += 1) {
            if (sys.teamPoke(src, team, i) === 0) {
                continue;
            }

            temptypeA = sys.pokeType1(sys.teamPoke(src, team, i), 5);
            temptypeB = sys.pokeType2(sys.teamPoke(src, team, i), 5);

            if (checkType !== undefined) {
                k = 3;
            }
            if (i === 1) {
                k = 1;
            }
            if (TypeB !== 17) {
                if ((temptypeA === TypeA && temptypeB === TypeB && k === 1) || (temptypeA === TypeB && temptypeB === TypeA && k === 1)) {
                    k = 2;
                }
            }
            if ((temptypeA === TypeA && k === 1) || (temptypeB === TypeA && k === 1)) {
                checkType = TypeA;
            }
            if ((temptypeA === TypeB && k === 1) || (temptypeB === TypeB && k === 1)) {
                if (TypeB !== 17) {
                    checkType = TypeB;
                }
                if (TypeB === 17) {
                    checkType = TypeA;
                }
            }
            if (i > 1 && k === 2) {
                k = 1;
                if ((temptypeA === TypeA && temptypeB === TypeB && k === 1) || (temptypeA === TypeB && temptypeB === TypeA && k === 1)) {
                    k = 2;
                }
                if ((temptypeA === TypeA && k === 1) || (temptypeB === TypeA && k === 1)) {
                    checkType = TypeA;
                }
                if ((temptypeA === TypeB && k === 1) || (temptypeB === TypeB && k === 1)) {
                    if (TypeB !== 17) {
                        checkType = TypeB;
                    }
                    if (TypeB === 17) {
                        checkType = TypeA;
                    }
                }
            }
            if (k === 3) {
                if (temptypeA !== checkType && temptypeB !== checkType) {
                    return ["Your team is not Monotype as " + sys.pokemon(sys.teamPoke(src, team, i)) + " is not of type " + sys.type(checkType) + "!"];
                }
            }

            if (k === 1) {
                if (TypeB === 17) {
                    TypeB = TypeA;
                }
                if (temptypeA !== TypeA && temptypeB !== TypeA && temptypeA !== TypeB && temptypeB !== TypeB) {
                    return ["Your team is not Monotype as " + sys.pokemon(sys.teamPoke(src, team, i)) + " does not share a type with " + sys.pokemon(sys.teamPoke(src, team, 0)) + "!"];
                }

            }
        }
    });

    TierBans.newBan(INCLUDING, ["Monogen"], function monoGenCheck(src, team, tier) {
        var GEN_MAX = [0, 151, 252, 386, 493, 647],
            gen = 0,
            i,
            pokenum,
            species;
        
        for (i = 0; i < 6; i += 1) {
            pokenum = sys.teamPoke(src, team, i);
            species = pokenum % 65536; // remove alt formes
            
            if (species === 0) {
                continue;
            }
            if (gen === 0) {
                while (species > GEN_MAX[gen]) {
                    gen += 1; // Search for correct gen for first poke
                }
            } else if (!(GEN_MAX[gen - 1] < species && species <= GEN_MAX[gen])) {
                return [sys.pokemon(pokenum) + " is not from gen " + gen + "!"];
            }
        }
    });


    TierBans.newBan(INCLUDING, ["Monocolour"], function monoColourCheck(src, team, tier) {
        if (Object.keys(pokeColours).length === 0) {
            pokeColours = {
                'Red': ['Charmander', 'Charmeleon', 'Charizard', 'Vileplume', 'Paras', 'Parasect', 'Krabby', 'Kingler', 'Voltorb', 'Electrode', 'Goldeen', 'Seaking', 'Jynx', 'Magikarp', 'Magmar', 'Flareon', 'Ledyba', 'Ledian', 'Ariados', 'Yanma', 'Scizor', 'Slugma', 'Magcargo', 'Octillery', 'Delibird', 'Porygon2', 'Magby', 'Ho-Oh', 'Torchic', 'Combusken', 'Blaziken', 'Wurmple', 'Medicham', 'Carvanha', 'Camerupt', 'Solrock', 'Corphish', 'Crawdaunt', 'Latias', 'Groudon', 'Deoxys', 'Deoxys-A', 'Deoxys-D', 'Deoxys-S', 'Kricketot', 'Kricketune', 'Magmortar', 'Porygon-Z', 'Rotom', 'Rotom-H', 'Rotom-F', 'Rotom-W', 'Rotom-C', 'Rotom-S', 'Tepig', 'Pignite', 'Emboar', 'Pansear', 'Simisear', 'Throh', 'Venipede', 'Scolipede', 'Krookodile', 'Darumaka', 'Darmanitan', 'Dwebble', 'Crustle', 'Scrafty', 'Shelmet', 'Accelgor', 'Druddigon', 'Pawniard', 'Bisharp', 'Braviary', 'Heatmor'],
                'Blue': ['Squirtle', 'Wartortle', 'Blastoise', 'Nidoran?', 'Nidorina', 'Nidoqueen', 'Oddish', 'Gloom', 'Golduck', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Tentacool', 'Tentacruel', 'Tangela', 'Horsea', 'Seadra', 'Gyarados', 'Lapras', 'Vaporeon', 'Omanyte', 'Omastar', 'Articuno', 'Dratini', 'Dragonair', 'Totodile', 'Croconaw', 'Feraligatr', 'Chinchou', 'Lanturn', 'Marill', 'Azumarill', 'Jumpluff', 'Wooper', 'Quagsire', 'Wobbuffet', 'Heracross', 'Kingdra', 'Phanpy', 'Suicune', 'Mudkip', 'Marshtomp', 'Swampert', 'Taillow', 'Swellow', 'Surskit', 'Masquerain', 'Loudred', 'Exploud', 'Azurill', 'Meditite', 'Sharpedo', 'Wailmer', 'Wailord', 'Swablu', 'Altaria', 'Whiscash', 'Chimecho', 'Wynaut', 'Spheal', 'Sealeo', 'Walrein', 'Clamperl', 'Huntail', 'Bagon', 'Salamence', 'Beldum', 'Metang', 'Metagross', 'Regice', 'Latios', 'Kyogre', 'Piplup', 'Prinplup', 'Empoleon', 'Shinx', 'Luxio', 'Luxray', 'Cranidos', 'Rampardos', 'Gible', 'Gabite', 'Garchomp', 'Riolu', 'Lucario', 'Croagunk', 'Toxicroak', 'Finneon', 'Lumineon', 'Mantyke', 'Tangrowth', 'Glaceon', 'Azelf', 'Phione', 'Manaphy', 'Oshawott', 'Dewott', 'Samurott', 'Panpour', 'Simipour', 'Roggenrola', 'Boldore', 'Gigalith', 'Woobat', 'Swoobat', 'Tympole', 'Palpitoad', 'Seismitoad', 'Sawk', 'Tirtouga', 'Carracosta', 'Ducklett', 'Karrablast', 'Eelektrik', 'Eelektross', 'Elgyem', 'Cryogonal', 'Deino', 'Zweilous', 'Hydreigon', 'Cobalion', 'Thundurus'],
                'Green': ['Bulbasaur', 'Ivysaur', 'Venusaur', 'Caterpie', 'Metapod', 'Bellsprout', 'Weepinbell', 'Victreebel', 'Scyther', 'Chikorita', 'Bayleef', 'Meganium', 'Spinarak', 'Natu', 'Xatu', 'Bellossom', 'Politoed', 'Skiploom', 'Larvitar', 'Tyranitar', 'Celebi', 'Treecko', 'Grovyle', 'Sceptile', 'Dustox', 'Lotad', 'Lombre', 'Ludicolo', 'Breloom', 'Electrike', 'Roselia', 'Gulpin', 'Vibrava', 'Flygon', 'Cacnea', 'Cacturne', 'Cradily', 'Kecleon', 'Tropius', 'Rayquaza', 'Turtwig', 'Grotle', 'Torterra', 'Budew', 'Roserade', 'Bronzor', 'Bronzong', 'Carnivine', 'Yanmega', 'Leafeon', 'Shaymin', 'Shaymin-S', 'Snivy', 'Servine', 'Serperior', 'Pansage', 'Simisage', 'Swadloon', 'Cottonee', 'Whimsicott', 'Petilil', 'Lilligant', 'Basculin', 'Maractus', 'Trubbish', 'Garbodor', 'Solosis', 'Duosion', 'Reuniclus', 'Axew', 'Fraxure', 'Golett', 'Golurk', 'Virizion', 'Tornadus'],
                'Yellow': ['Kakuna', 'Beedrill', 'Pikachu', 'Raichu', 'Sandshrew', 'Sandslash', 'Ninetales', 'Meowth', 'Persian', 'Psyduck', 'Ponyta', 'Rapidash', 'Drowzee', 'Hypno', 'Exeggutor', 'Electabuzz', 'Jolteon', 'Zapdos', 'Moltres', 'Cyndaquil', 'Quilava', 'Typhlosion', 'Pichu', 'Ampharos', 'Sunkern', 'Sunflora', 'Girafarig', 'Dunsparce', 'Shuckle', 'Elekid', 'Raikou', 'Beautifly', 'Pelipper', 'Ninjask', 'Makuhita', 'Manectric', 'Plusle', 'Minun', 'Numel', 'Lunatone', 'Jirachi', 'Mothim', 'Combee', 'Vespiquen', 'Chingling', 'Electivire', 'Uxie', 'Cresselia', 'Victini', 'Sewaddle', 'Leavanny', 'Scraggy', 'Cofagrigus', 'Archen', 'Archeops', 'Deerling', 'Joltik', 'Galvantula', 'Haxorus', 'Mienfoo', 'Keldeo'],
                'Purple': ['Rattata', 'Ekans', 'Arbok', 'Nidoran?', 'Nidorino', 'Nidoking', 'Zubat', 'Golbat', 'Venonat', 'Venomoth', 'Grimer', 'Muk', 'Shellder', 'Cloyster', 'Gastly', 'Haunter', 'Gengar', 'Koffing', 'Weezing', 'Starmie', 'Ditto', 'Aerodactyl', 'Mewtwo', 'Crobat', 'Aipom', 'Espeon', 'Misdreavus', 'Forretress', 'Gligar', 'Granbull', 'Mantine', 'Tyrogue', 'Cascoon', 'Delcatty', 'Sableye', 'Illumise', 'Swalot', 'Grumpig', 'Lileep', 'Shellos', 'Gastrodon', 'Ambipom', 'Drifloon', 'Drifblim', 'Mismagius', 'Stunky', 'Skuntank', 'Spiritomb', 'Skorupi', 'Drapion', 'Gliscor', 'Palkia', 'Purrloin', 'Liepard', 'Gothita', 'Gothorita', 'Gothitelle', 'Mienshao', 'Genesect'],
                'Pink': ['Clefairy', 'Clefable', 'Jigglypuff', 'Wigglytuff', 'Slowpoke', 'Slowbro', 'Exeggcute', 'Lickitung', 'Chansey', 'Mr. Mime', 'Porygon', 'Mew', 'Cleffa', 'Igglybuff', 'Flaaffy', 'Hoppip', 'Slowking', 'Snubbull', 'Corsola', 'Smoochum', 'Miltank', 'Blissey', 'Whismur', 'Skitty', 'Milotic', 'Gorebyss', 'Luvdisc', 'Cherubi', 'Cherrim', 'Mime Jr.', 'Happiny', 'Lickilicky', 'Mesprit', 'Munna', 'Musharna', 'Audino', 'Alomomola'],
                'Brown': ['Weedle', 'Pidgey', 'Pidgeotto', 'Pidgeot', 'Raticate', 'Spearow', 'Fearow', 'Vulpix', 'Diglett', 'Dugtrio', 'Mankey', 'Primeape', 'Growlithe', 'Arcanine', 'Abra', 'Kadabra', 'Alakazam', 'Geodude', 'Graveler', 'Golem', 'Farfetch\'d', 'Doduo', 'Dodrio', 'Cubone', 'Marowak', 'Hitmonlee', 'Hitmonchan', 'Kangaskhan', 'Staryu', 'Pinsir', 'Tauros', 'Eevee', 'Kabuto', 'Kabutops', 'Dragonite', 'Sentret', 'Furret', 'Hoothoot', 'Noctowl', 'Sudowoodo', 'Teddiursa', 'Ursaring', 'Swinub', 'Piloswine', 'Stantler', 'Hitmontop', 'Entei', 'Zigzagoon', 'Seedot', 'Nuzleaf', 'Shiftry', 'Shroomish', 'Slakoth', 'Slaking', 'Shedinja', 'Hariyama', 'Torkoal', 'Spinda', 'Trapinch', 'Baltoy', 'Feebas', 'Regirock', 'Chimchar', 'Monferno', 'Infernape', 'Starly', 'Staravia', 'Staraptor', 'Bidoof', 'Bibarel', 'Buizel', 'Floatzel', 'Buneary', 'Lopunny', 'Bonsly', 'Hippopotas', 'Hippowdon', 'Mamoswine', 'Heatran', 'Patrat', 'Watchog', 'Lillipup', 'Conkeldurr', 'Sandile', 'Krokorok', 'Sawsbuck', 'Beheeyem', 'Stunfisk', 'Bouffalant', 'Vullaby', 'Mandibuzz', 'Landorus'],
                'Black': ['Snorlax', 'Umbreon', 'Murkrow', 'Unown', 'Sneasel', 'Houndour', 'Houndoom', 'Mawile', 'Spoink', 'Seviper', 'Claydol', 'Shuppet', 'Banette', 'Duskull', 'Dusclops', 'Honchkrow', 'Chatot', 'Munchlax', 'Weavile', 'Dusknoir', 'Giratina', 'Darkrai', 'Blitzle', 'Zebstrika', 'Sigilyph', 'Yamask', 'Chandelure', 'Zekrom'],
                'Gray': ['Machop', 'Machoke', 'Machamp', 'Magnemite', 'Magneton', 'Onix', 'Rhyhorn', 'Rhydon', 'Pineco', 'Steelix', 'Qwilfish', 'Remoraid', 'Skarmory', 'Donphan', 'Pupitar', 'Poochyena', 'Mightyena', 'Nincada', 'Nosepass', 'Aron', 'Lairon', 'Aggron', 'Volbeat', 'Barboach', 'Anorith', 'Armaldo', 'Snorunt', 'Glalie', 'Relicanth', 'Registeel', 'Shieldon', 'Bastiodon', 'Burmy', 'Wormadam', 'Wormadam-G', 'Wormadam-S', 'Glameow', 'Purugly', 'Magnezone', 'Rhyperior', 'Probopass', 'Arceus', 'Herdier', 'Stoutland', 'Pidove', 'Tranquill', 'Unfezant', 'Drilbur', 'Excadrill', 'Timburr', 'Gurdurr', 'Whirlipede', 'Zorua', 'Zoroark', 'Minccino', 'Cinccino', 'Escavalier', 'Ferroseed', 'Ferrothorn', 'Klink', 'Klang', 'Klinklang', 'Durant', 'Terrakion', 'Kyurem'],
                'White': ['Butterfree', 'Seel', 'Dewgong', 'Togepi', 'Togetic', 'Mareep', 'Smeargle', 'Lugia', 'Linoone', 'Silcoon', 'Wingull', 'Ralts', 'Kirlia', 'Gardevoir', 'Vigoroth', 'Zangoose', 'Castform', 'Absol', 'Shelgon', 'Pachirisu', 'Snover', 'Abomasnow', 'Togekiss', 'Gallade', 'Froslass', 'Dialga', 'Regigigas', 'Swanna', 'Vanillite', 'Vanillish', 'Vanilluxe', 'Emolga', 'Foongus', 'Amoonguss', 'Frillish', 'Jellicent', 'Tynamo', 'Litwick', 'Lampent', 'Cubchoo', 'Beartic', 'Rufflet', 'Larvesta', 'Volcarona', 'Reshiram', 'Meloetta', 'Meloetta-S']
            };
        }

        var poke = sys.pokemon(sys.teamPoke(src, team, 0)),
            thecolour = '',
            colour,
            i;

        for (colour in pokeColours) {
            if (pokeColours[colour].indexOf(poke) > -1) {
                thecolour = colour;
            }
        }
        
        for (i = 1; i < 6; i += 1) {
            poke = sys.pokemon(sys.teamPoke(src, team, i));
            if (pokeColours[thecolour].indexOf(poke) === -1 && poke !== "Missingno") {
                return [poke + " colour is not " + thecolour];
            }
        }
    });

    TierBans.newBan(INCLUDING, ["Smogon OU", "Wifi OU", "No Preview OU"], function swiftSwimCheck(src, team, tier) {
        var i, j;
        for (i = 0; i < 6; i += 1) {
            if (sys.ability(sys.teamPokeAbility(src, team, i)) === "Drizzle") {
                for (j = 0; j < 6; j += 1) {
                    if (sys.ability(sys.teamPokeAbility(src, team, j)) === "Swift Swim") {
                        return ["You cannot have the combination of Swift Swim and Drizzle in " + tier];
                    }
                }
            }
        }
    });

    TierBans.newBan(INCLUDING, ["Smogon UU"], function droughtCheck(src, team, tier) {
        var i;
        for (i = 0; i < 6; i += 1) {
            if (sys.ability(sys.teamPokeAbility(src, team, i)) === "Drought") {
                return ["Drought is not allowed in Smogon UU"];
            }
        }
    });

    TierBans.newBan(INCLUDING, ["Wifi UU", "Wifi LU", "Wifi NU"], function sandStreamCheck(src, team, tier) {
        var i;
        for (i = 0; i < 6; i += 1) {
            if (sys.ability(sys.teamPokeAbility(src, team, i)) === "Sand Stream") {
                return ["Sand Stream is not allowed in " + tier + "."];
            }
        }
    });

    TierBans.newBan(INCLUDING, ["Wifi UU", "Wifi LU", "Wifi NU"], function snowWarningCheck(src, team, tier) {
        var i;
        for (i = 0; i < 6; i += 1) {
            if (sys.ability(sys.teamPokeAbility(src, team, i)) === "Snow Warning") {
                return ["Snow Warning is not allowed in " + tier + "."];
            }
        }
    });

    TierBans.newBan(INCLUDING, ["Shanai Cup"], function shanaiAbilityCheck(src, team, tier) {
        var bannedAbilities = {
            'treecko': ['overgrow'],
            'chimchar': ['blaze'],
            'totodile': ['torrent'],
            'spearow': ['sniper'],
            'skorupi': ['battle armor', 'sniper'],
            'spoink': ['thick fat'],
            'golett': ['iron fist'],
            'magnemite': ['magnet pull', 'analytic'],
            'electrike': ['static', 'lightningrod'],
            'nosepass': ['sturdy', 'magnet pull'],
            'axew': ['rivalry'],
            'croagunk': ['poison touch', 'dry skin'],
            'cubchoo': ['rattled'],
            'joltik': ['swarm'],
            'shroomish': ['effect spore', 'quick feet'],
            'pidgeotto': ['big pecks'],
            'karrablast': ['swarm']
        },
            ret = [],
            ability, lability, poke, lpoke;

        for (i = 0; i < 6; i += 1) {
            ability = sys.ability(sys.teamPokeAbility(src, team, i));
            lability = ability.toLowerCase();
            poke = sys.pokemon(sys.teamPoke(src, team, i));
            lpoke = poke.toLowerCase();
            
            if (lpoke in bannedAbilities && bannedAbilities[lpoke].indexOf(lability) !== -1) {
                ret.push(poke + " is not allowed to have ability " + ability + " in " + tier + ". Please change it in Teambuilder.");
            }
        }
        return ret;
    });

    TierBans.newBan(EXCLUDING, cc, function hasOneUsablePokemon(player, team) {
        var slot, move;
        for (slot = 0; slot < 6; slot += 1) {
            if (sys.teamPoke(player, team, slot) !== 0) {
                for (move = 0; move < 4; move += 1) {
                    if (sys.teamPokeMove(player, team, slot, move) !== 0) {
                        return;
                    }
                }
            }
        }

        return ["You do not have any valid pokemon. (Please make at least one in Teambuilder)"];
    });
    
    // Exports [expt]
    
    // Completely export the tierbans object.
    module.exports = TierBans;
}());
