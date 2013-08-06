/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: player-utils.js (PlayerUtils)
// Contains player utilities (such as easily getting player and team information).
// Dependencies: datahash, jsession, utils

// Table of Content:
// [mod]: Moderation utilities.

(function () {
    var DataHash = require('datahash'),
        JSESSION = require('jsession'),
        Utils = require('utils');
    
    // list of default colors, used when a player doesn't have one (by the client)
    var defaultColorList = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];

    // Various importable stuff.
    var natureNames = {
        24: "Quirky</b> Nature",
        23: "Careful</b> Nature (+SDef, -SAtk)",
        22: "Sassy</b> Nature (+SDef, -Spd)",
        21: "Gentle</b> Nature (+SDef, -Def)",
        20: "Calm</b> Nature (+SDef, -Atk)",
        19: "Rash</b> Nature (+SAtk, -SDef)",
        18: "Bashful</b> Nature",
        17: "Quiet</b> Nature (+SAtk, -Spd)",
        16: "Mild</b> Nature (+SAtk, -Def)",
        15: "Modest</b> Nature (+SAtk, -Atk)",
        14: "Naive</b> Nature (+Spd, -SDef)",
        13: "Jolly</b> Nature (+Spd, -SAtk)",
        12: "Serious</b> Nature",
        11: "Hasty</b> Nature (+Spd, -Def)",
        10: "Timid</b> Nature (+Spd, -Atk)",
        9: "Lax</b> Nature (+Def, -SDef)",
        8: "Impish</b> Nature (+Def, -SAtk)",
        7: "Relaxed</b> Nature (+Def, -Spd)",
        6: "Docile</b> Nature",
        5: "Bold</b> Nature (+Def, -Atk)",
        4: "Naughty</b> Nature (+Atk, -SDef)",
        3: "Adamant</b> Nature (+Atk, -SAtk)",
        2: "Brave</b> Nature (+Atk, -Spd)",
        1: "Lonely</b> Nature (+Atk, -Def)",
        0: "Hardy</b> Nature"
    };
    var typeColorNames = {
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
    
    var genderToImportable = {
        incompatible: {
            "male": "<img src='Themes/Classic/genders/gender1.png'> (M)",
            "female": "<img src='Themes/Classic/genders/gender2.png'> (F)",
            "genderless": "<img src='Themes/Classic/genders/gender0.png'>"
        },
        
        "male": "(M)",
        "female": "(F)",
        "genderless": ""
    };
    
    var statNames = {
        0: "HP",
        1: "Atk",
        2: "Def",
        3: "SAtk",
        4: "SDef",
        5: "Spd"
    };
    
    // Returns a player's first team for the given [tier].
    // IMPORTANT: Returns a team id, not a team object (or anything cool like that).
    // Returns 0 (the first team) if Config.NoCrash is true.
    // Returns -1 if a player doesn't have a team for that tier.
    exports.firstTeamForTier = function (id, tier) {
        var tierToLower = (tier || "").toLowerCase(),
            teamCount = sys.teamCount(id),
            i;
        
        if (Config.NoCrash) {
            return 0;
        }
        
        for (i = 0; i < teamCount; i += 1) {
            if (sys.tier(id, i).toLowerCase() === tierToLower) {
                // returns the team id if the tiers match.
                return i;
            }
        }
    
        return -1;
    };
    
    // If the given player has a team for the specific tier.
    // If tier is not specified, then if the player has any teams at all will be returned.
    exports.hasTeamForTier = function (id, tier) {
        if (!tier) {
            return sys.teamCount(id) !== 0;
        }
    
        return sys.hasTier(id, tier);
    };
    
    // Returns a player's true color
    // So it doesn't appear to be black if the player has none (in html messages)
    exports.trueColor = function (src) {
        var defaultColor = sys.getColor(src);
        
        // when the player hasn't set their own color
        if (defaultColor === '#000000') {
            return defaultColorList[src % defaultColorList.length];
        }
        
        return defaultColor;
    };
    
    // Capitalizes a name (even when the player is offline), or returns it (id).
    exports.name = function (nameOrId) {
        if (typeof nameOrId === 'string') {
            return DataHash.correctNames[nameOrId.toLowerCase()] || sys.name(nameOrId) || nameOrId;
        } else if (typeof nameOrId === 'number') {
            return sys.name(nameOrId) || "~Unknown~";
        }
        
        // panics if it isn't a string or number.
        Utils.panic("scripts/player-utils.js", "PlayerUtils.name(nameOrId)", "Player is not a string or a number.", "typeof nameOrId: " + typeof nameOrId + " | nameOrId's value: " + nameOrId, Utils.panic.warning);
        
        return "~Unknown~";
    };
    
    // Formats a player's name with html. Quite fancy.
    exports.formatName = function (nameOrId) {
        // fixes the case, and lets us accept ids
        var trueName = exports.name(nameOrId);
        
        // simply return a string. still a pain to write manually though.
        return "<b style='color: " + exports.trueColor(trueName) + "'>" + trueName + "</b>";
    };
    
    // Returns a player's name. Accepts an id, name, or the ip itself (if passed)
    exports.ip = function (idOrNameOrIp) {
        // since both names and ips are strings, return idOrNameOrIp if sys.dbIp returns undefined
        if (typeof idOrNameOrIp === 'string') {
            return sys.dbIp(idOrNameOrIp) || idOrNameOrIp;
        } else if (typeof idOrNameOrIp === 'number') {
            return sys.ip(idOrNameOrIp) || "0.0.0.0";
        }
        
        // panics if it isn't a string or number.
        Utils.panic("scripts/player-utils.js", "PlayerUtils.ip(nameOrIdOrIp)", "Player is not a string or a number.", "typeof idOrNameOrIp: " + typeof idOrNameOrIp + " | idOrNameOrIp's value: " + idOrNameOrIp, Utils.panic.warning);
        
        return "0.0.0.0";
    };
    
    exports.rangeIp = function (ip, parts) {
        // We use exports.ip to let us accept ids, names, or an actual ip.
        var rangeIp = exports.ip(ip).split(".");
        
        // by default, we use 2 parts (for example): [x.xx].xxx.xxx
        parts = parts || 2;
        
        if (parts < 1 || parts > 4) {
            parts = 2;
        }
        
        // Cut off any part after the wanted amount of parts/subaddresses.
        rangeIp.splice(parts, 4);
        return rangeIp.join(".");
    };
    
    
    // Returns the true authority level of a player (takes PlayerPermissions and maxAuth in account)
    exports.trueAuth = function (nameOrId) {
        // fixes the case, and lets us accept ids
        var trueName = exports.name(nameOrId),
            trueNameToLower = trueName.toLowerCase(),
            auth = sys.maxAuth(sys.dbIp(trueName)) || 0;
        
        // check for PlayerPermissions (which is the main purpose of this function)
        if ((Config.PlayerPermissions[trueNameToLower] || -1) > auth) {
            auth = Config.PlayerPermissions[trueNameToLower] || 0;
        }
        
        return auth;
    };
    
    // returns an array of all ids of [ip] (everyone logged in with [ip])
    exports.ipIds = function (ip) {
        var playerIds = sys.playerIds(),
            ids = [],
            length = playerIds.length,
            player,
            i;

        for (i = 0; i < length; i += 1) {
            player = playerIds[i];
            
            if (ip === sys.ip(player)) {
                ids.push(player);
            }
        }

        return ids;
    };
    
    // Returns the string name of the auth level [auth].
    // If img is true (PlayerUtils.authToString.imageIdentifier), returns the image identifier (the one used in po's default theme files)
    // of that auth level.
    exports.authToString = function (auth, img) {
        var auths = {
            'true': {
                0: "User",
                1: "Moderator",
                2: "Administrator",
                3: "Owner",
                '3+': "Invisible"
            },
            'false': {
                0: "U",
                1: "M",
                2: "A",
                3: "O",
                '3+': "U"
            }
        };
        
        // Make sure it's an integer
        auth = Math.round(auth);
        
        // Make sure it's >= 0
        if (auth < 0) {
            auth = 0;
        }
        
        // Give it '3+' if it's > 3 (Invisible)
        if (auth > 3) {
            auth = '3+';
        }
        
        // true/false are used in the object to represent if the image identifier should be
        // returned, or not.
        return auths[img][auth];
    };
    
    exports.authToString.imageIdentifier = true;
    
    // Returns a player's status image (which can be battle, available, or away).
    exports.statusImage = function (src) {
        var status = "Away",
            isAway,
            authIdentifier;
        
        // The player is most likely online if this is the case.
        if (typeof src === "string") {
            // This gets the player's auth's image identifier.
            return "<img src='Themes/Classic/Client/" + exports.authToString(sys.dbAuth(src), true) + "Away.png'>";
        }
        
        isAway = sys.away(src);
        authIdentifier = exports.authToString(sys.auth(src), true);
        
        if (sys.battling(src)) {
            status = "Battle";
        } else if (!isAway) {
            status = "Available";
        } else {
            // Pretty much useless, but w/e.
            status = "Away";
        }

        return "<img src='Themes/Classic/Client/" + authIdentifier + status + ".png'>";
    };
    
    (function () {
        // Helper functions for playerStatus
        function offline() {
            return "<small style='color: red; font-weight: bold;'>Offline</small>";
        }

        function online() {
            return "<small style='color: green; font-weight: bold;'>Online</small>";
        }
        
        function lastOn(name) {
            var lastOnline = sys.dbLastOn(name);

            if (!lastOnline) {
                lastOnline = "Unknown";
            }

            return "<small style='color: blue; font-weight: bold; font-style: italic;'>Last Online:</small> " + lastOnline;
        }
        
        function player(id, name) {
            return "<b style='color: " + exports.trueColor(id) + "'>" + Utils.escapeHtml(name) + "</b>";
        }
            
        // Return's a player's status (when they were last online, if they are even online, their name, and the status image).
        exports.playerStatus = function (name) {
            // Allows us to accept ids.
            name = exports.name(name);
            
            var id = sys.id(name) || -1,
                auth = sys.dbAuth(name),
                ip = sys.dbIp(name);
            
            if (!ip) {
                return "<img src='Themes/Classic/Client/UAway.png'>" + player(-1, name) + " " + offline() + " " + lastOn(name);
            }
    
            if (!id) {
                return exports.statusImage(name) + " " + player(-1, name) + " " + offline() + " " + lastOn(name);
            }
            
            return exports.statusImage(id) + " " + player(id, name) + " " + online() + " <small>(<b style='color: blue'>Player ID: " + id + "</b>)</small>";
        };
    }());
    
    // Puts a player in multiple channels.
    exports.pushChannels = function (src, channels) {
        var len = channels.length,
            i;

        for (i = 0; i < len; i += 1) {
            sys.putInChannel(src, channels[i]);
        }
    };
    
    // If the player is on localhost (127.0.0.1)
    exports.isServerHost = function (idOrNameOrIp) {
        return exports.ip(idOrNameOrIp) === "127.0.0.1";
    };
    
    // If tar is the same player as src (checks with IPs).
    exports.isSamePlayer = function (src, tar) {
        // Allows us to accept ids and names.
        return exports.ip(src) === exports.ip(tar);
    };
    
    // Returns the amount of authorities on the server.
    // src is optional. If specified, the player will be checked if they're owner or above.
    // if they are, they're allowed to know how many invisible auth are there as well.
    // This does not include PlayerPermission auths on purpose.
    exports.authCount = function (src) {
        var auths = sys.dbAuths(),
            count = 0,
            len,
            i;
        
        // Just return the complete amount of auths if they're owner or above, or if the argument isn't specified.
        if (!src || (src && exports.trueAuth(src) > 2)) {
            return auths.length;
        }
        
        for (i = 0, len = auths.length; i < len; i += 1) {
            // If they're owner or below (visible), add them.
            if (sys.dbAuth(auths[i]) <= 3) {
                count += 1;
            }
        }

        return count;
    };
    
    // Returns a list of online players' ids that have authority.
    // Doesn't check for PlayerPermission players (on purpose).
    exports.authIds = function () {
        var auths = sys.dbAuths(),
            ids = [],
            id,
            len,
            i;
        
        for (i = 0, len = auths.length; i < len; i += 1) {
            id = sys.id(auths[i]);
            
            if (id) {
                ids.push(id);
            }
        }
        
        return ids;
    };
    
    // Moderation utilities [mod]
    
    // Kicks a player.
    exports.kick = function (id) {
        // They have already been kicked..
        if (!sys.loggedIn(id)) {
            return;
        }
        
        // Silently kick them.
        sys.kick(id);
    };
    
    // Kicks all of player's ids.
    exports.kickAll = function (playerIp) {
        // Get the IP. This allows us to accept ids, names, and regular ips as well.
        var trueIp = exports.ip(playerIp);
        
        // Get all their alts.
        exports.ipIds(trueIp).forEach(function (id) {
            // They have already been kicked..
            if (!sys.loggedIn(id)) {
                return;
            }
            
            // Silently kick them.
            sys.kick(id);
        });
    };
    
    // Disconnects (kick but allow them to reconnect with their data) a player.
    exports.disconnect = function (id) {
        // They have already been disconnected..
        if (!sys.loggedIn(id)) {
            return;
        }
        
        // Silently disconnect them.
        sys.disconnect(id);
    };
    
    // Disconnects (kick but allow them to reconnect with their data) all of player's ids.
    exports.disconnectAll = function (playerIp) {
        // Get the IP. This allows us to accept ids, names, and regular ips as well.
        var trueIp = exports.ip(playerIp);
        
        // Get all their alts.
        exports.ipIds(trueIp).forEach(function (id) {
            // They have already been disconnected..
            if (!sys.loggedIn(id)) {
                return;
            }
            
            // Silently disconnect them.
            sys.disconnect(id);
        });
    };
    
    // Mutes a player.
    // opts is an array with these values:
    // ip: The ip to mute.
    // by: The player who issued the mute.
    // reason: The reason of the mute.
    // time: Time the mute lasts in seconds.
    exports.mute = function (opts) {
        if (!opts.ip) {
            Utils.panic("scripts/player-utils.js", "mute", "IP is not specified.", opts, Utils.panic.warning);
            return;
        }
        
        if (!opts.by) {
            Utils.panic("scripts/player-utils.js", "mute", "By is not specified.", opts, Utils.panic.warning);
            return;
        }
        
        if (typeof opts.time !== 'number') {
            Utils.panic("scripts/player-utils.js", "mute", "Time is not specified or isn't a number.", opts, Utils.panic.warning);
            return;
        }
        
        // add the current time since epoch to the mute, as that is what we use to check if the mute has expired.
        opts.time += +(sys.time());
        
        if (!opts.reason) {
            opts.reason = "";
        }

        DataHash.mutes[opts.ip] = opts;
        
        // mute all of [opts.ip]'s names that are currently online.
        // note that we only have to set .muted (this prevents them from talking, until their mute has expired). This value is set after the log back in (because we mute their ip) automatically (if they're still muted), so we don't have to do any mumbo jumbo.
        exports.ipIds(opts.ip).forEach(function (id) {
            JSESSION.users(id).muted = true;
        });
    };
    
    // Permanently bans a player (and kick them).
    // NOTE: This is done quietly.
    exports.ban = function (name) {
        // Since there is basically nothing to customise atm, this is simply a small wrapper (though it does kick players under the same alt.)
        sys.ban(name);
        
        exports.kickAll(sys.ip(name));
    };
    
    // Temporarly bans a player.
    // NOTE: Time is in minutes.
    // NOTE: This is done quietly.
    exports.tempBan = function (name, time) {
        // Since there is basically nothing to customise atm (kick is done automatically), this is simply a small wrapper (though it does kick players under the same alt.)
        // Ensure time is an integer.
        time = Math.round(time);
        
        sys.tempBan(name, time);
        
        exports.kickAll(sys.ip(name));
    };
    
    // If a player is banned.
    exports.isBanned = function (playerName) {
        // Return their name. This allows us to accept ids as well.
        var trueName = exports.name(playerName).toLowerCase(),
            bans = sys.banList();
        
        return bans.indexOf(trueName) !== -1;
    };
    
    // Returns the amount of seconds name is temporary banned for.
    // This > sys.dbTempBanTime.
    // NOTE: Unlike sys.dbTempBanTime, this returns 0 if the player isn't banned.
    exports.tempBanTime = function (playerName) {
        // Return their name. This allows us to accept ids as well.
        var trueName = exports.name(playerName).toLowerCase();
        
        // If they aren't banned, return 0.
        if (!exports.isBanned(trueName)) {
            return 0;
        }
        
        // Otherwise, return for how long they are banned.
        return sys.dbTempBanTime(trueName);
    };
    
    // Creates an importable [array] for src's team, teamId.
    // Importables will have some goodies that will break them for use with PO, disable this with a third argument that is true.
    exports.teamImportable = function (src, teamId, compatible) {
        var importable = [],
            maxTeamPokemon = 6,
            pokemonStatsCount = 6,
            maxPokemonMoves = 4,
            pokemonMaxLevel = 100,
            pokemon_MissingNo = 0,
            itemname_NoItem = "(No Item)",
            move_NoMove = 0,
            move_HiddenPower = 237;
        
        var gen = sys.gen(src, teamId),
            fullGen = sys.generation(gen, sys.subgen(src, teamId)),
            pokemon,
            move,
            ev,
            iv,
            pokemonId,
            pokemonName,
            pokemonLevel,
            pokemonItem,
            pokemonAbility,
            pokemonColor,
            pokemonGender,
            pokemonNature,
            pokemonShiny,
            pokemonNickname,
            pokemonEV,
            pokemonEVs = [],
            pokemonIV,
            pokemonIVs = [],
            moveId,
            moveName,
            moveType,
            movePart,
            nicknamePart,
            itemPart,
            genderPart;
        
        if (!compatible) {
            importable.push("Team #" + (teamId + 1) + ": Gen " + gen + " (" + fullGen + ")");
        }

        // Loop over their Pokémon.
        for (pokemon = 0; pokemon < maxTeamPokemon; pokemon += 1) {
            pokemonId = sys.teamPoke(src, teamId, pokemon);
            
            // Don't handle MissingNo
            if (pokemonId === pokemon_MissingNo) {
                continue;
            }
            
            pokemonName = sys.pokemon(pokemonId);
            pokemonLevel = sys.teamPokeLevel(src, teamId, pokemon);
            pokemonItem = sys.teamPokeItem(src, teamId, pokemon);
            pokemonAbility = sys.teamPokeAbility(src, teamId, pokemon);
            pokemonColor = typeColorNames[sys.pokeType1(pokemonId)];
            pokemonGender = sys.teamPokeGender(src, teamId, pokemon);
            pokemonNature = sys.teamPokeNature(src, teamId, pokemon);
            pokemonShiny = sys.teamPokeShine(src, teamId, pokemon);
            pokemonNickname = sys.teamPokeNick(src, teamId, pokemon);
            
            if (!compatible) {
                importable.push(
                    "<img src='pokemon:num=" + pokemonId + "&gen=" + gen + "&back=false&shiny=" + pokemonShiny + "&gender=" + pokemonGender + "'> <img src='pokemon:num=" + pokemonId + "&gen=" + gen + "&back=true&shiny=" + pokemonShiny + "&gender=" + pokemonGender + "'>"
                );
            }
            
            nicknamePart = pokemonNickname + "</b></font>";
            
            if (pokemonName !== pokemonNickname) {
                nicknamePart += " (<b style='color:" + pokemonColor + "'>" + pokemonName + "</b>)";
            }
            
            itemPart = sys.item(pokemonItem);
            
            if (itemPart === itemname_NoItem) {
                itemPart = "";
            } else if (!compatible) { // If the item isn't (No Item), and compatible is off, display an image instead.
                itemPart = itemPart + " <img src='item:" + pokemonItem + "'>";
            }
                
            genderPart = compatible ? genderToImportable[sys.gender(pokemonGender)] : genderToImportable.incompatible[sys.gender(pokemonGender)];
            
            importable.push(
                // <b> tag is closed by nicknamePart
                "<b style='color: " + pokemonColor + "'>" + nicknamePart + " " + genderPart + " @ " + itemPart
            );
            
            // In Generation 1 and 2, there were no abilities.
            if (gen > 2) {
                importable.push(
                    "<b style='color: " + pokemonColor + "'>Trait:</b> " + sys.ability(pokemonAbility)
                );
            }
            
            // Only add the level header if the Pokémon's level isn't maximum.
            if (pokemonMaxLevel > pokemonLevel) {
                importable.push(
                    "<b style='color: " + pokemonColor + "'>Level:</b> " + pokemonLevel
                );
            }
            
            // No EVs or IVs in Generation 1.
            if (gen > 1) {
                // EVs
                for (ev = 0; ev < pokemonStatsCount; ev += 1) {
                    pokemonEV = sys.teamPokeEV(src, teamId, pokemon, ev);
                    
                    // 255 is the default in Generation 2.
                    if (pokemonEV === 0 || (gen === 2 && pokemonEV === 255)) {
                        continue;
                    }
                    
                    pokemonEVs.push(pokemonEV + " " + statNames[ev]);
                }
                
                // If there are custom EVs, add the header. EVs are separated with a forward slash, one space before it, and one after.
                if (pokemonEVs.length) {
                    importable.push(
                        "<b style='color: " + pokemonColor + "'>EVs:</b> " + pokemonEVs.join(" / ")
                    );
                }
                
                // IVs - DVs in Pokémon Online
                for (iv = 0; iv < pokemonStatsCount; iv += 1) {
                    pokemonIV = sys.teamPokeDV(src, teamId, pokemon, iv);
                    
                    // 15 is the default in Generation 2, 31 otherwise.
                    if (pokemonIV === 31 || (gen === 2 && pokemonIV === 15)) {
                        continue;
                    }
                    
                    pokemonEVs.push(pokemonIV + " " + statNames[iv]);
                }
                
                // If there are custom IVs, add the header. IVs are separated with a forward slash, one space before it, and one after.
                if (pokemonIVs.length) {
                    importable.push(
                        "<b style='color: " + pokemonColor + "'>IVs:</b> " + pokemonIVs.join(" / ")
                    );
                }
            }
            
            // There are no natures in Generation 2 either.
            if (gen > 2) {
                // natureNames contains all the info we need. <b> is once again closed in this aswell.
                importable.push(
                    "<b style='color: " + pokemonColor + "'>" + natureNames[pokemonNature]
                );
            }
            
            // Now handle the moves. Oh boy.
            for (move = 0; move < maxPokemonMoves; move += 1) {
                moveId = sys.teamPokeMove(src, teamId, pokemon, move);
                moveName = sys.move(moveId);
                moveType = sys.moveType(moveId);
                movePart = "<b style='color: " + typeColorNames[moveType] + "'>" + moveName + "</b>";
                
                // Skip empty move slots.
                if (moveId === move_NoMove) {
                    continue;
                }
                
                // Special stuff for Hidden Power.
                if (moveId === move_HiddenPower) {
                    // Redo the IVs, this time include every one.
                    pokemonIVs = [];
                    
                    for (iv = 0; iv < pokemonStatsCount; iv += 1) {
                        pokemonIV = sys.teamPokeDV(src, teamId, pokemon, iv);
                        pokemonIVs.push(pokemonIV);
                    }
                    
                    // Combine the gen with the pokemon's complete IV list to get the type of hidden power via hiddenPowerType.
                    moveType = sys.hiddenPowerType.apply(sys, [gen].concat(pokemonIVs));
                    movePart = "<b style='color: " + typeColorNames[moveType] + "'>" + moveName + "</b>";
                }
                
                importable.push(
                    "-" + movePart
                );
            }
        }

        return importable;
    };
    
    // Kicks everyone on the server, with the exception of those caught by the filter.
    // The filter should return true if a player shouldn't be kicked. It gets the player's id as argument.
    exports.massKick = function (filter) {
        var ids = sys.playerIds(),
            len = ids.length,
            i;
        
        if (typeof filter !== "function") {
            filter = function () {
                return false;
            };
        }

        for (i = 0; i < len; i += 1) {
            if (!filter(ids[i])) {
                sys.kick(ids[i]);
            }
        }
    };
}());