/* Documentation:
  Getting Stats:
  mix (undefined/object) get(mix (string/int) poke);

  Getting specific stat:
  mix (undefined/object) getStat(mix (string/int) poke, string stat)
  stats can be:
  HP | Hit Points
  ATK | Attack
  DEF | Defence
  SPATK | Special Attack
  SPDEF | Special Defence
  SPD | Speed

  Can be both and can be any case. Spaces are optional aswell.
*/

_POPokemonStats = function () {
    if(typeof this.Pokemons == 'undefined') {
    var File_Content = sys.getFileContent("db/pokes/poke_stats.txt").split("\n");
    this.Pokemons = {};
    var x, curr_stats, poke, pokenum, spl, flen = File_Content.length;

    for(x = 0; x < flen; x++) {
    curr_stats = File_Content[x].split(" ");
    spl = curr_stats[0].split(":");

    if(spl[1] != "0"||spl[0] == "0") {
    continue;
    }

    poke = sys.pokemon(spl[0]);
    pokenum = sys.pokeNum(poke);

    this.Pokemons[poke] = {
         'HP':curr_stats[1],
         'ATK':curr_stats[2],
         'DEF':curr_stats[3],
         'SPATK':curr_stats[4],
         'SPDEF':curr_stats[5],
         'SPD':curr_stats[6],
         'NUM':pokenum
    };

    }
    }
}

_POPokemonStats.prototype.get = function (poke) {
    if(typeof poke == "number")
        poke = sys.pokemon(poke);
    else if(typeof poke == "string")
        poke = sys.pokemon(sys.pokeNum(poke)); // Corrects case.
    else
        poke = undefined;

    if(poke == undefined)
        return undefined;

    return this.Pokemons[poke];
}

_POPokemonStats.prototype.getStat = function (poke, stat) {
    var get = this.get(poke);
    if(get == undefined)
        return undefined;

    stat = POString.remove_spaces(stat.toLowerCase());
    var stats = ["hp", "hitpoints", "atk", "attack", "def", "defence",
                 "spatk", "specialattack", "spdef", "specialdefence",
                 "spd", "speed"];
    var translations = [["hp", "hitpoints"],
                        ["atk", "attack"],
                        ["def", "defence"],
                        ["spatk", "specialattack"],
                        ["spdef", "specialdefence"],
                        ["spd", "speed"]], x, trans = stat;

    if(stats.indexOf(stat) == -1) {
       return undefined;
    }

    for(x in translations) {
        if(stat == translations[x][1]) {
            trans = translations[x][0];
            break;
        }
        else if(stat == translations[x][0])
            break;
    }

    return this.Pokemons[poke][stat]
}

POPokemonStats = new _POPokemonStats();
