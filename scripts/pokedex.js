/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: pokedex.js
// Contains a somewhat advanced pokedex using PO's data files.
// Depends on: template, utils

// Table of Content:
// [expt]: Exports

// TODO
(function () {
	var Template = require('template'),
		Utils = require('utils');
	
	// Taken from PO's source code.
	var moveColors = {
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
	
	var statRanges = [30, 50, 60, 70, 80, 90, 100, 200, 300];
	var statColors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];
	
	function parseDbFile(file) {
		var res = sys.getFileContent("db/pokes/" + file + ".txt");

		if (!res) {
			return [];
		}

		return res.split("\n");
	}
	
	function parseMoveFile(file) {
		return parseDbFile("5G/" + file + "_moves");
	}
	
	function dumpMoves(moveArray) {
		var obj = {},
			len = moveArray.length,
			move,
			split,
			space,
			pokeId,
			i;
		
		for (i = 0; i < len; i += 1) {
			move = moveArray[i];

			if (move.trim() === "") {
				continue;
			}
			
			split = move.split(":");
			space = move.split(" ");
			pokeId = parseInt(split[0], 10);

			// Formes (41:1)
			if (split[1].charAt(0) !== "0") {
				continue;
			}

			space.splice(0, 1);
			obj[pokeId] = space.join(" ");
		}
		
		return obj;
	}
	
    var Pokedex = {
		// Object[String pokeName->Object pokeInfo]
        data: {},
		files: {
			stats: parseDbFile("stats"),
			weight: parseDbFile("weight"),
			height: parseDbFile("height"),
			evos: parseDbFile("evos"),
			evolevels: parseDbFile("5G/minlevels"),
			genders: parseDbFile("gender"),
			cc: parseDbFile("level_balance"),
	
			egggroup1: parseDbFile("egg_group_1"),
			egggroup2: parseDbFile("egg_group_2"),
	
			moves: {
				dw: parseMoveFile("dw"),
				egg: parseMoveFile("egg"),
				level: parseMoveFile("level"),
				evo: parseMoveFile("pre_evo"),
				event: parseMoveFile("special"),
				tms: parseMoveFile("tm_and_hm"),
				tutor: parseMoveFile("tutor")
			}
		}
    };
	
	// Prep evos.
	var pokeEvos = Pokedex.files.evos.map(function (pokeIds) {
		return pokeIds.split(" ");
	});
	
	// Moves
	// Object[String pokeId->Array[String] moveNums]
	// moveNums is a string of numbers separated with a space.
	var dwMoves = dumpMoves(Pokedex.files.moves.dw);
	var eggMoves = dumpMoves(Pokedex.files.moves.egg);
	var levelMoves = dumpMoves(Pokedex.files.moves.level);
	var evoMoves = dumpMoves(Pokedex.files.moves.evo);
	var eventMoves = dumpMoves(Pokedex.files.moves.event);
	var tmMoves = dumpMoves(Pokedex.files.moves.tms);
	var tutorMoves = dumpMoves(Pokedex.files.moves.tutor);
	// Filled later on, same structure.
	var pokeMoves = {};
	
	// Pokemon with a second egg group. Object[String pokeId->String eggGroup]
	var eggGroup2Pokes = {};
	
	// Challenge Cup levels. Object[String pokeId->Number ccLevel]
	var ccLevels = {};
	
	var pokeEvolutions = {};
	
	// Bogus iteration variables.
	var pokeId = 649,
		moves,
		uniqueMoves,
		categoryMoves,
		pokeStats,
		move,
		poke,
		nextPoke,
		pokeName,
		stat,
		split,
		space,
		len,
		len2,
		i,
		i2;
	
	// High speed loop
	while (pokeId) {
		// Reset
		uniqueMoves = [];
		
		// Start with level moves.
		moves = [levelMoves[pokeId]];

		// Then Dream World moves, Egg moves, Event moves, Evolution moves, Tutor moves, and TM moves
		if (dwMoves.hasOwnProperty(pokeId)) {
			moves.push(dwMoves[pokeId]);
		}

		if (eggMoves.hasOwnProperty(pokeId)) {
			moves.push(eggMoves[pokeId]);
		}

		if (eventMoves.hasOwnProperty(pokeId)) {
			moves.push(eventMoves[pokeId]);
		}

		if (evoMoves.hasOwnProperty(pokeId)) {
			moves.push(evoMoves[pokeId]);
		}

		if (tutorMoves.hasOwnProperty(pokeId)) {
			moves.push(tutorMoves[pokeId]);
		}

		if (tmMoves.hasOwnProperty(pokeId)) {
			moves.push(tmMoves[pokeId]);
		}

		// Construct a list of unique moves (sometimes multiple categories have the same move).
		for (i = 0, len = moves.length; i < len; i += 1) {
			categoryMoves = moves[i].split(" ");
			
			for (i2 = 0, len2 = categoryMoves.length; i2 < len2; i2 += 1) {
				move = sys.move((+categoryMoves[i]));
				
				if (uniqueMoves.indexOf(move) === -1) {
					uniqueMoves.push(move);
				}
			}
		}
		
		pokeMoves[pokeId] = uniqueMoves;
		pokeId -= 1;
	}

	// Checking Challenge Cup levels.
	for (i = 0, len = Pokedex.files.cc.length; i < len; i += 1) {
		poke = Pokedex.files.cc[i];
		split = poke.split(":");
		space = poke.split(" ");
		
		pokeName = sys.pokemon((+split[0]));

		// MissingNo & Formes.
		if (poke[0] === "0" || split[1][0] !== "0") {
			continue;
		}

		// space is similar to: ["num:0", "minlvl"]
		ccLevels[i] = (+space[1]);
	}
	
	// Evolutions
	for (i = 0, len = pokeEvos.length; i < len; i += 1) {
		poke = pokeEvos[i];
		nextPoke = pokeEvos[i + 1];
		pokeName = sys.pokemon(poke[0]);

		if (nextPoke && (+poke[1]) === +(nextPoke[0])) {
			// Two evolutions.
			pokeEvolutions[i] = [poke[1], nextPoke[1]];
		} else if (poke.length === 3 && poke[1] === poke[2]) {
			// Feebas evo bug in the database.
			pokeEvolutions[i] = [poke[1]];
		} else if (poke.length !== 2) {
			// One evolution.
			poke.splice(0, 1);
			pokeEvolutions[i] = poke;
		} else if (((+poke[0]) + 1) === (+poke[1])) {
			// One evolution also.
			pokeEvolutions[i] = [poke[1]];
		}
	}

	// Done!
	
	// Get egg group 2 from Pokémons that do have it.
	for (i = 0, len = Pokedex.files.egggroup2.length; i < len; i += 1) {
		poke = Pokedex.files.egggroup2[i].split(" ");
		
		// Skip MissingNo
		if (poke === "0") {
			continue;
		}

		// poke[0] is the pokeId, poke[1] is the egg group.
		eggGroup2Pokes[poke[0]] = poke[1];
	}

	// Reset pokeId, as we're going to use it again
	pokeId = 0;
	
	for (i = 0, len = Pokedex.files.stats.length; i < len; i += 1) {
		stat = Pokedex.files.stats[i];
		poke = stat.split(":");
		
		// Invalid (EOF).
		if (!poke[1]) {
			break;
		}
		
		// Formes, MissingNo
		if (poke[1][0] !== "0" || poke[0] === "0") {
			continue;
		}
		
		pokeId += 1;
		pokeName = sys.pokemon(pokeId);
		pokeStats = {
			stats: stat.split(" "),
			weight: Pokedex.files.weight[pokeId].split(" "),
			height: Pokedex.files.height[pokeId].split(" "),
			gender: Pokedex.files.genders[pokeId].split(" "),
			minlevel: Pokedex.files.evolevels[pokeId].split(" "),
			eggGroup1: "",
			eggGroup2: ""
		};
		
		// Egg Group stuff.
		if (Pokedex.files.egggroup1[pokeId]) {
			pokeStats.eggGroup1 = Pokedex.files.egggroup1[pokeId].split(" ");
			pokeStats.eggGroup1 = Utils.cut(pokeStats.eggGroup1, 1, " ");
		}
		
		if (eggGroup2Pokes[pokeId]) {
			pokeStats.eggGroup2 = eggGroup2Pokes[pokeId];
		}
		
		// Generate the data.
		Pokedex.data[pokeName] = {
			weight: pokeStats.weight,
			height: pokeStats.height,
			minlvl: pokeStats.minlevel,
			genders: pokeStats.gender,
			egg: [pokeStats.eggGroup1, pokeStats.eggGroup2],
			moves: pokeMoves[pokeId],
			cc: ccLevels[pokeId],
			evos: pokeEvolutions[pokeId],
			
			stats: {
				HP: pokeStats.stats[1],
				ATK: pokeStats.stats[2],
				DEF: pokeStats.stats[3],
				SPATK: pokeStats.stats[4],
				SPDEF: pokeStats.stats[5],
				SPD: pokeStats.stats[6]
			}
		};
	}

	// API
	function statsOf(poke) {
		var pokeStats = Pokedex.data[poke].stats,
			stats = [],
			i;
		
		for (i in pokeStats) {
			stats.push(pokeStats[i]);
		}
		
		return stats;
	}

	function movesOf(poke) {
		return Pokedex.data[poke].moves.split(" ").map(function (move) {
			return (+move);
		}).sort(function (a, b) {
			return sys.moveType(b) - sys.moveType(a);
		});
	}

	function evosOf(poke) {
		return Pokedex.data[poke].evos || [];
	}

	function baseStatTotal(poke) {
		var stats = Pokedex.data[poke].stats,
			total,
			i;

		for (i in stats) {
			total += (+stats[i]);
		}
		
		return total;
	}
	
	function formatStat(poke, stat) {
		var statValue = Pokedex.data[poke].stats[stat],
			len = statRanges.length,
			i;

		for (i = 0; i < len; i += 1) {
			if (stat <= statRanges[i]) {
				return "<b style='color: " + statColors[i] + "'>" + stat + "</b>";
			}
		}

		return "<b style='color: " + statColors.slice(-1) + "'>" + stat + "</b>";
	}

	function formatStatsOf(poke) {
		var stats = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"],
			str = "",
			len = stats.length,
			stat,
			i;
		
		for (i = 0; i < len; i += 1) {
			stat = stats[i];
			
			str += stat + ": " + formatStat(poke, stat);
			
			if (stat !== "SPD") {
				str += " | ";
			}
		}

		return str;
	}

	function formatEvosOf(poke) {
		var evos = evosOf(poke),
			result = [],
			len = evos.length,
			i;

		for (i = 0; i < len; i += 1) {
			result.push(
				"<b style='color: " + moveColors[sys.pokeType1(evos[i])] + "'>" + sys.pokemon(evos[i]) + "</b>"
			);
		}

		return Utils.fancyJoin(result);
	}

	function formatMovesOf(poke) {
		var moves = movesOf(poke),
			result = [],
			len = moves.length,
			i;

		for (i = 0; i < len; i += 1) {
			result.push("<small><b style='color: " + moveColors[sys.moveType(moves[i])] + "'>" + sys.move(moves[i]) + "</b></small>");
		}

		return result.join(", ") + ".";
	}

	function formatBaseStatTotal(poke) {
		var total = baseStatTotal(poke),
			str = ("<b> " + total + "</b>"),
			ranges = [180, 300, 360, 420, 480, 540, 600, 1200, 1800],
			len = ranges.length,
			i;

		for (i = 0; i < len; i += 1) {
			if (total <= ranges[i]) {
				return "<font color='" + statColors[i] + "'>" + str + "</font>";
			}
		}
		
		return str;
	}

	function pokeType(poke) {
		var pokeId = sys.pokeNum(poke),
			type1 = sys.pokeType1(pokeId),
			type2 = sys.pokeType2(pokeId),
			str = "";

		str += "<b style='color: " + moveColors[type1] + "'>" + sys.type(type1) + "</b>";

		if (type2 !== 17) {
			str += " & <b style='color: " + moveColors[type2] + "'>" + sys.type(type2) + "</b>";
		}

		return str;
	}

	function firstGen(poke) {
		var pokeId = sys.pokeNum(poke);

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
	}

	function pokeAbilities(poke) {
		var pokeId = sys.pokeNum(poke),
			abilities = [sys.pokeAbility(pokeId, 0), sys.pokeAbility(pokeId, 1), sys.pokeAbility(pokeId, 2)],
			str = "";
		
		str += "<b>" + sys.ability(abilities[0]) + "</b>";

		if (abilities[1] !== 0) {
			str += " | <b>" + sys.ability(abilities[1]) + "</b>";
		}
		
		if (abilities[2] !== 0) {
			str += " | <b>" + sys.ability(abilities[2]) + "</b> (<u>Dream World Ability</u>)";
		}
		
		return str;
	}

	function pokeGender(poke) {
		var gender = (+Pokedex.data[poke].genders);

		// Dual gender
		if (gender === 3) {
			return "<img src='Themes/Classic/genders/gender1.png'> <img src='Themes/Classic/genders/gender2.png'>";
		}
		
		// 2, 1, 0: single gender.
		return "<img src='Themes/Classic/genders/gender" + gender + ".png'>";
	}

	function renderPokedex(src, chan, pokemon, sourceOnly) {
		var pokeId = sys.pokeNum(pokemon),
			data = Pokedex.data[pokemon],
			multiType = (sys.pokeType2(pokeId) !== 17),
			multiAbility = (sys.pokeAbility(pokeId, 1) !== 0),
			genderFormat = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + pokeGender(pokemon),
			eggInfo = "";
		
		var template = new Template("basic", "Pokedex - <font color='" + moveColors[sys.pokeType1(pokeId)] + "'" + pokemon + "</font>");
																					
		// Sprites
		template.register("<img src='pokemon:num=" + pokeId + "'> <img src='pokemon:num=" + pokeId + "&back=true'> <img src='pokemon:num=" + pokeId + "&shiny=true'> <img src='pokemon:num=" + pokeId + "&shiny=true&back=true'><br/>");
		// Gender icon.
		template.register(genderFormat);
		
		template.register("National Dex Number: <b>" + pokeId + "</b>.");
		template.register("Generation <b>" + firstGen(pokemon) + "</b> Pokemon. ");

		// Add a white line if the pokemon has evolutions or it's min level isn't 1 or 100.
		if ((data.evos || (data.minlvl !== 1 && data.minlvl !== 100))) {
			template.register("");
		}

		if (data.evos) {
			template.register("Evolution" + (data.evos.length > 1 ? "s" : "") + ": " + formatEvosOf(pokemon));
		}

		if (data.minlvl !== 1 && data.minlvl !== 100) {
			template.register("Minimum Level: <b>" + data.minlvl + "</b>");
		}

		template.register("Level in Challenge Cup: <b>" + data.cc + "</b><br/>");

		if (data.egg[0]) {
			eggInfo += "<b>" + data.egg[0] + "</b>";
		}

		if (data.egg[1]) {
			eggInfo += " and <b>" + data.egg[1] + "</b>";
		}

		template.register("Type" + (multiType ? "s" : "") + ": " + pokeType(pokemon));

		if (eggInfo) {
			template.register("Egg Group" + (data.egg[1] ? "s" : "") + ": " + eggInfo);
		}

		template.register("Abilit" + (multiAbility ? "ies" : "y") + ": " + pokeAbilities(pokemon) + "<br/>");

		template.register("Weight: <b>" + data.weight + " kg</b>");
		template.register("Height <b>" + data.height + " m</b><br/>");

		template.register(formatStatsOf(pokemon));
		template.register("Base Stat Total: " + formatBaseStatTotal(pokemon));

		// Smeargle causes the client to d/c.
		if (pokemon.toLowerCase() !== "smeargle") {
			template.register("<br/> " + formatMovesOf(pokemon));
		} else {
			template.register("<br/> Smeargle learns all moves except Chatter and Transform.");
		}

		if (sourceOnly) {
			sys.sendHtmlMessage(src, Utils.escapeHtml(template.template.join("<br/>")), chan);
		} else {
			template.render(src, chan);
		}
	}
	
	renderPokedex.source = true;
	renderPokedex.template = false;
	
	// Exports [expt]
	
	// Export Pokedex
	exports.Pokedex = Pokedex;
	
	// Export Pokedex API
	exports.statsOf = statsOf;
	exports.movesOf = movesOf;
	exports.evosOf = evosOf;
	exports.baseStatTotal = baseStatTotal;
	
	exports.formatStat = formatStat;
	exports.formatEvosOf = formatEvosOf;
	exports.formatMovesOf = formatMovesOf;
	exports.formatBaseStatTotal = formatBaseStatTotal;
	exports.pokeType = pokeType;
	exports.firstGen = firstGen;
	exports.pokeAbilities = pokeAbilities;
	exports.pokeGender = pokeGender;
	
	exports.renderPokedex = renderPokedex;
	
	// Export various useful structs
	exports.moveColors = moveColors;
	exports.statRanges = statRanges;
	exports.statColors = statColors;
}());