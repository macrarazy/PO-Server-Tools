
    // Checks if [name] hasn't begun their battle
    // Returns their entry in ToursChannelConfig.roundStatus.idleBattle if they are
    Tours.idleBattler = function idleBattler(name, tcc) {
        var hash = tcc.roundStatus.idleBattles,
            curr,
            i;
    
        for (i in hash) {
            curr = hash[i];
            // is the first or second battler of this battle [name]?
            if (curr[0] === name || curr[1] === name) {
                return i;
            }
        }
    
        return false;
    };
    
    // Checks if [name] has begun their battle but hasn't finished yet
    // Returns their entry in ToursChannelConfig.roundStatus.ongoingBattles if they are
    Tours.isBattling = function isBattling(name, tcc) {
        var hash = tcc.roundStatus.ongoingBattles,
            cur,
            i;
    
        name = name.toLowerCase();
        for (i in hash) {
            cur = hash[i];
            // is the first or second battler of this battle [name]?
            if (cur[0].toLowerCase() === name || cur[1].toLowerCase() === name) {
                return i;
            }
        }
    
        return false;
    };
    
    // Returns the total amount of players that are playing
    // Expects a ToursChannelConfig
    Tours.totalPlayers = function totalPlayers(tcc) {
        return Utils.objectLength(tcc.players);
    };
    
    // get the amount of spots left in the tournament
    // using the formula: amount of entrants allowed - amount of entrants that joined
    Tours.tourSpots = function tourSpots(tcc) {
        return tcc.entrants - Utils.objectLength(tcc.players);
    };
    
    // if this tour is a tag team tour
    Tours.isTagTeamTour = function isTagTeamTour(tcc) {
        return tcc.type > 3 && tcc.type < 7;
    };
    
    // Returns the object at [pos] in [hash]
    // Returns an empty object ({}) if [hash] has less entries than [pos]
    Tours.hashAt = function hashAt(hash, pos) {
        var num = 0,
            i;
        
        for (i in hash) {
            if (num === pos) {
                return hash[i];
            }
            
            num += 1;
        }
        
        return {};
    };
    
    // Returns the name of the player in [hash] at position [hashno]
    // Returns "" if the hash has less than [pos + 1] entries
    Tours.playerName = function playerName(hash, pos) {
        return (Tours.hashAt(hash, pos).name || "");
    };
    
    // Checks which team has won in tag team tours (if any).
    // Returns an object with 3 properties:
    // - winners: Names of the winners in a team (empty if none)
    // - loser: The name of the loser's team
    // - losingteam: ID of the team that lost (Tours.blue | Tours.red)
    Tours.teamWin = function teamWin(tcc) {
        var loser = "",
            winners = [],
            loseteam = -1;
    
        if (this.playersOfTeam(Tours.blue) === 0) {
            // blue loses
            loser = "Team Blue";
            loseteam = Tours.blue;
            winners = this.namesOfTeam(Tours.red);
        } else if (this.playersOfTeam(Tours.red) === 0) {
            // red loses
            loser = "Team Red";
            loseteam = Tours.red;
            winners = this.namesOfTeam(Tours.blue);
        } // no team has lost (yet)
    
        return {
            'winners': winners,
            'loser': loser,
            'losingteam': loseteam
        };
    };
    
    // returns a random player's location in [object]
    Tours.randomPlayer = function randomPlayer(object, teamId, tcc) {
        var entries = Utils.objectLength(object),
            playerObj,
            random = sys.rand(0, entries);
        
        if (entries < 2) {
            return 0;
        } else if (entries === 2) {
            return sys.rand(0, 2);
        }
    
        // if this isn't a tag team tour
        // just return the random number
        if (!Tours.isTagTeamTour(tcc)) {
            return random;
        }
    
        // keep running until you get their team
        playerObj = Tours.hashAt(object, random);
        // no player at this first random position?
        // bail, and print a warning
        if (playerObj === undefined) {
            Utils.panic("scripts/tours.js", "Tours.randomPlayer(object, teamId)", "Unknown player at position " + random + ".", tcc.players, Utils.panic.warning);
            return 0;
        }
    
        // keep doing it
        // TODO: this might crash
        while (playerObj.team !== teamId) {
            random = sys.rand(0, entries);
            playerObj = Tours.hashAt(object, random);
        }
    
        // this position is fine.
        return random;
    };
    
    // builds a new entrant's player hash
    Tours.buildHash = function buildHash(src, tcc) {
        var name = sys.name(src);
        // just use their name
        if (name === undefined) {
            name = src;
        }
    
        tcc.players[name.toLowerCase()] = {
            'name': name, // their capitalized name
            'couplesid': -1, // their couples id (which is set later on)
            'couplenum': -1, // their couples number (which is set later on)
            'roundwins': 0, // the amount of wins this round (for doubles & triples elimination)
            'team': -1 // their team's id (set later on)
        };
    };
    
    // Builds the teams.
    Tours.buildTeams = function buildTeams(tcc) {
        var players = tcc.players,
            player,
            id,
            team = 0,
            i;
        
        for (i in players) {
            player = players[i];
            player.team = team;
            
            id = sys.id(player.name);
            
            if (id !== undefined) {
                if (team === 0) {
                    Bot.sendMessage(id, "You are in Team Blue.", tcc.id);
                } else {
                    Bot.sendMessage(id, "You are in Team Red.", tcc.id);
                }
            }
            
            // trick to reverse team
            // if it's 0: make it 1
            // if it's 1: make it 0
            team = 1 - team;
        }
    };
    
    // returns the amount of players of [team]
    // expects a ToursChannelConfig
    Tours.playersOfTeam = function playersOfTeam(team, tcc) {
        var players = tcc.players,
            numPlayers = 0,
            i;
        
        for (i in players) {
            if (players[i].team === team) {
                numPlayers += 1;
            }
        }
    
        return numPlayers;
    };
    
    // returns the names of all players in [team]
    // expects a ToursChannelConfig
    Tours.namesOfTeam = function namesOfTeam(team, tcc) {
        var players = tcc.players,
            names = [],
            player,
            i;
        
        for (i in players) {
            player = players[i];
            if (player.team === team) {
                names.push(player.name);
            }
        }
    
        return names;
    };
    
    // check if someone is in the tournament
    Tours.isInTourney = function isInTourney(name, tcc) {
        return tcc.players.hasOwnProperty(name.toLowerCase());
    };
    
    // check if someone is in the tournament by id
    Tours.isInTourneyId = function isInTourneyId(id, tcc) {
        return tcc.players.hasOwnProperty(sys.name(id).toLowerCase());
    };
    
    // returns the name of [name]'s tour opponent
    // expects a ToursChannelConfig
    Tours.tourOpponent = function tourOpponent(name, tcc) {
        name = name.toLowerCase();
        
        // no couplesid?
        // return an empty string
        if (tcc.players[name].couplesid === -1) {
            return "";
        }
    
        // returns the couple's name
        // the couplesid of the player is reversed.
        return tcc.couples[tcc.players[name].couplesid][1 - tcc.players[name].couplesid];
    };
    
    // Checks if [src] (id) and [dest] (id) are opponents in this round.
    // Expects a ToursChannelConfig
    Tours.areOpponentsForTourBattle = function areOpponentsForTourBattle(src, dest, tcc) {
        return Tours.isInTourney(sys.name(src)) && Tours.isInTourney(sys.name(dest)) && Tours.tourOpponent(sys.name(src), tcc).toLowerCase() === sys.name(dest).toLowerCase();
    };
    
    // Checks if [src] (name) and [dest] (name) are opponents in this round.
    // Expects a ToursChannelConfig
    Tours.areOpponentsForTourBattle2 = function areOpponentsForTourBattle2(src, dest, tcc) {
        return Tours.isInTourney(src) && Tours.isInTourney(dest) && Tours.tourOpponent(src, tcc).toLowerCase() === dest.toLowerCase();
    };
    
    // Does the round pairing. [t-rp]
    // Expects a ToursChannelConfig
    Tours.roundPairing = function roundPairing(tcc) {
        var winner = "",
            winnerNames = "",
            // team tags
            team1 = "",
            team2 = "",
            id = 0,
            moneyGain = 0,
            // used inside couples generation
            // contains data about the players
            p1 = [],
            p2 = [],
            winners = [],
            message = [],
            players = tcc.players,
            // copy of player - stuff is deleted in this object
            // hence why it's copied
            playersCopy = Utils.extend({}, players),
            isTagTeamTour = Tours.isTagTeamTour(tcc),
            isAutoStartBattles = tcc.autoStartBattles,
            i,
            // iterator only
            j,
            length;
        
        // If it's the first round, and it's
        // a tag team tour, then builds the teams
        if (tcc.round === 0 && isTagTeamTour) {
            Tours.buildTeams(tcc);
        }
    
        this.round += 1;
        Tours.cleanRoundVariables(tcc);
    
        if (Utils.objectLength(tcc.players) === 1) {
            // We have a winner!
            winner = Tours.playerName(tcc.players, 0);
            message = [
                "The winner of the " + tcc.tier + " tournament is " + winner + "!",
                "Congratulations, " + winner + ", on your success!"
            ];
            
            if (!Utils.isEmpty(this.prize)) {
                message.push("", winner + " will receive the tournament prize: " + this.prize + "!");
            }
    
            Tours.tourBox(message, tcc);
    
            // main channel
            if (tcc.id === 0) {
                // attempt to give money to the player
                winner = winner.toLowerCase();
                if (!PlayerUtils.ip(winner)) {
                    return Tours.clearVariables(tcc);
                }
                
                id = sys.id(winner);
                
                if (!DataHash.money.hasOwnProperty(winner)) {
                    // ensure they exist in DataHash.money
                    DataHash.money[winner] = 0;
                }
                
                moneyGain = sys.rand(500, 1001);
                DataHash.money[winner] += moneyGain;
                DataHash.save("money");
    
                if (id !== undefined) {
                    Bot.sendMessage(id, "You won " + moneyGain + " battle points!", tcc.id);
                }
            }
    
            // just clear variables anyway..
            Tours.clearVariables(tcc);
            return;
        }
    
        // is this a tag team tour?
        if (Tours.isTagTeamTour(tcc)) {
            // check if there are winners
            winners = Tours.teamWin(tcc);
            
            if (winners.winners.length !== 0 && winners.loser !== "" && winners.losingteam !== -1) {
                // We have winners!
                winnerNames = winners.winners.join(" and ");
                message = [
                    "The winners of the " + tcc.tier + " tournament are " + winnerNames + "!",
                    "Congratulations, " + winnerNames + ", on your success!"
                ];
    
                if (!Utils.isEmpty(this.prize)) {
                    message.push("", winnerNames + " will receive the tournament prize: " + tcc.prize + "!");
                }
    
                Tours.tourBox(message, tcc);
                
                if (tcc.id === 0) {
                    winners = winners.winners;
                    for (i = 0, length = winners.length; i < length; i += 1) {
                        // attempt to give money to the players
                        winner = winners[i].toLowerCase();
                        if (!PlayerUtils.ip(winner)) {
                            return Tours.clearVariables(tcc);
                        }
                        
                        id = sys.id(winner);
                        
                        if (!DataHash.money.hasOwnProperty(winner)) {
                            // ensure they exist in DataHash.money
                            DataHash.money[winner] = 0;
                        }
                        
                        moneyGain = sys.rand(500, 1001);
                        DataHash.money[winner] += moneyGain;
                        DataHash.save("money");
            
                        if (id !== undefined) {
                            Bot.sendMessage(id, "You won " + moneyGain + " battle points!", tcc.id);
                        }
                    }
                }
    
                // clear anyway
                Tours.clearVariables(tcc);
                return;
            }
        }
        
        for (i in players) {
            // clear empty players
            // this is bug.
            if (players[i] === "") {
                print("Warning from scripts/tours.js: Empty player " + i + " found.");
                delete players[i];
            }
        }
    
        this.finals = Utils.objectLength(players) === 2;
        if (this.finals) {
            message.push("Finals of the " + tcc.tier + " tournament:", "");
        } else {
            message.push("Round " + tcc.round + " of the " + tcc.tier + " tournament:", "");
        }
    
        if (isTagTeamTour) {
            // team tags
            team1 = "<b><font color=blue>[Team Blue]</font></b>";
            team2 = "<b><font color=red>[Team Red]</font></b>";
        }
        
        i = 0;
        
        // generates the couples
        // use j as iterator instead
        for (j in playersCopy) {
            // we have deleted all but one player (this is for our bye)
            // quit the loop
            if (Utils.objectLength(playersCopy) === 1) {
                break;
            }
    
            // reset variables
            p1 = [];
            p2 = [];
            
            if (isTagTeamTour) {
                // gets a random player from blue
                p1.push(Tours.randomPlayer(playersCopy, Tours.blue));
                p1.push(Tours.playerName(playersCopy, p1[0]));
                p1.push(p1[1].toLowerCase());
                // delete them from the players copy
                delete playersCopy[p1[2]];
    
                // gets a random player from red
                p2.push(Tours.randomPlayer(playersCopy, Tours.red));
                p2.push(Tours.playerName(playersCopy, p2[0]));
                p2.push(p2[1].toLowerCase());
                // delete them from the players copy
                delete playersCopy[p2[2]];
            } else {
                // just get random players
                p1.push(Tours.randomPlayer(playersCopy));
                p1.push(Tours.playerName(playersCopy, p1[0]));
                p1.push(p1[1].toLowerCase());
                // delete them from the players copy
                delete playersCopy[p1[2]];
                
                p2.push(Tours.randomPlayer(playersCopy));
                p2.push(Tours.playerName(playersCopy, p2[0]));
                p2.push(p2[1].toLowerCase());
                // delete them from the players copy
                delete playersCopy[p2[2]];
            }
    
            // make a couples object
            // index: [i]: the ID
            // array of 2 entries: the first player's name, and the second player's name
            tcc.couples[i] = [p1[1], p2[1]];
            
            // set their couples id
            tcc.players[p1[2]].couplesid = i;
            tcc.players[p2[2]].couplesid = i;
            
            // set their couples number (their index in the couples array)
            tcc.players[p1[2]].couplenum = 0;
            tcc.players[p2[2]].couplenum = 1;
    
            // auto start battles?
            if (isAutoStartBattles) {
                // add them to idleBattles with their couples id and name
                tcc.roundStatus.idleBattles[i] = [p1[1], p2[1]];
            }
            
            i += 1;
    
            if (tcc.finals) {
                message.push(team1 + p1[1] + " VS " + team2 + p2[1]);
            } else {
                // add their battle number
                message.push(i + ". " + team1 + p1[1] + " VS " + team2 + p2[1]);
            }
        }
    
        message.push("");
    
        // players are left? (e.g. an uneven number of players this round)
        if (Utils.objectLength(playersCopy) > 0) {
            // give them a bye
            message.push(Tours.hashAt(playersCopy, 0) + " is randomly selected to go to next round!", "");
        }
    
        // Send it as a tourBox
        // Note: Expects a ToursChannelConfig, not a channel id
        Tours.tourBox(message, tcc);
    
        // automatically start all battles
        // slightly delay it
        if (isAutoStartBattles) {
            sys.setTimer(function () {
                // reference to couples, because we're going to iterate it
                var couples = tcc.couples,
                    couple,
                    player,
                    opponent,
                    playerTeam,
                    opponentTeam,
                    // iterator only
                    i;
                
                for (i in couples) {
                    couple = couples[i];
                    player = couple[0].toLowerCase();
                    opponent = couple[1].toLowerCase();
                    
                    // only start a battle if both players are logged in
                    if (sys.id(player) !== undefined && sys.id(opponent) !== undefined) {
                        playerTeam = PlayerUtils.firstTeamForTier(sys.id(player), tcc.tier);
                        opponentTeam = PlayerUtils.firstTeamForTier(sys.id(opponent), tcc.tier);
                        if (playerTeam !== -1 && opponentTeam !== -1) {
                            if (!Tours.isBattling(player, tcc) && !Tours.isBattling(opponent, tcc)) {
                                sys.forceBattle(
                                    sys.id(player), // first player's id
                                    sys.id(opponent), // second player's id
                                    playerTeam, // first player's team id
                                    opponentTeam, // second player's team id
                                    sys.getClauses(tcc.tier), // clauses
                                    0, // battle mode: singles, doubles, triples
                                    false // is the battle rated?
                                );
                                
                                // add them to ongoing battles
                                // be lazy, just copy couples over as it contains the information we need.
                                tcc.roundStatus.ongoingBattles[Utils.objectLength(tcc.roundStatus.ongoingBattles)] = couple;
                            }
                        } else {
                            // notify them that they don't have a valid team
                            if (playerTeam === -1) {
                                Bot.sendMessage(sys.id(player), "You don't have a valid team for the " + tcc.tier + " tier. Your battle with " + couple[1] + " couldn't automatically be started. Please get a valid team to avoid disqualification.", tcc.id);
                            }
                            if (opponentTeam === -1) {
                                Bot.sendMessage(sys.id(opponent), "You don't have a valid team for the " + tcc.tier + " tier. Your battle with " + couple[0] + " couldn't automatically be started. Please get a valid team to avoid disqualification.", tcc.id);
                            }
                        }
                    }
                }
            }, 2500, false);
        }
    };
    
    // Tournament events [t-evt]
    Tours.events = {};
    
    // Called after a battle has started.
    // Expects a ToursChannelConfig.
    Tours.events.afterBattleStarted = function afterBattleStarted(src, tar, clauses, rated, mode, battleId, srcTeam, tarTeam, tcc) {
        var srcName = sys.name(src),
            tarName = sys.name(tar),
            idleBattler;
        
        // e.g. when the tour has started
        if (tcc.state === 2) {
            if (Tours.areOpponentsForTourBattle(src, tar, tcc)) {
                // No crash safety guard
                if (!Config.NoCrash) {
                    // don't check for tiers as we don't want to (possibly) crash.
                    idleBattler = Tours.idleBattler(srcName, tcc);
                    if (tcc.roundStatus.idleBattles[idleBattler] !== undefined) {
                        // be lazy and copy it over
                        tcc.roundStatus.ongoingBattles[Utils.objectLength(tcc.roundStatus.ongoingBattles)] = tcc.roundStatus.idleBattles[idleBattler];
                        delete tcc.roundStatus.idleBattles[idleBattler];
                    }
                    
                    if (tcc.finals) {
                        Bot.sendMessage("Final round tournament match between " + srcName + " and " + tarName + " has started!", tcc.id);
                    } else {
                        Bot.sendMessage("Round " + tcc.round + " tournament match between " + srcName + " and " + tarName + " has started!", tcc.id);
                    }
                } else {
                    if (sys.tier(src, srcTeam) === sys.tier(tar, tarTeam) && Utils.isEqual(sys.tier(src, srcTeam), tcc.tier)) {
                        idleBattler = Tours.idleBattler(srcName, tcc);
                        
                        if (tcc.roundStatus.idleBattles[idleBattler] !== undefined) {
                            // be lazy and copy it over
                            tcc.roundStatus.ongoingBattles[Utils.objectLength(tcc.roundStatus.ongoingBattles)] = tcc.roundStatus.idleBattles[idleBattler];
                            delete tcc.roundStatus.idleBattles[idleBattler];
                        }
                        
                        if (tcc.finals) {
                            Bot.sendMessage("Final round tournament match between " + srcName + " and " + tarName + " has started!", tcc.id);
                        } else {
                            Bot.sendMessage("Round " + tcc.round + " tournament match between " + srcName + " and " + tarName + " has started!", tcc.id);
                        }
                    } else {
                        Bot.sendMessage(src, "Your or your opponents team does not match the tournament tier (the match is not official).", tcc.id);
                        Bot.sendMessage(tar, "Your or your opponents team does not match the tournament tier (the match is not official).", tcc.id);
                    }
                }
            }
        }
    };
    
    // Called when a battle has ended.
    // expects a ToursChannelConfig.
    Tours.events.afterBattleEnded = function afterBattleEnded(src, dest, desc, tcc) {
        // bail if the tour hasn't started or we only have one player left.
        if (tcc.state !== 2 || Utils.objectLength(tcc.players) === 1) {
            return;
        }
    
        // result = tie?
        // call Tours.events.tie
        if (desc === "tie") {
            Tours.event.tie(src, dest, tcc);
            return;
        }
    
        // false because we don't want to force the player to get kicked out (for doubles/triples)
        Tours.events.tourBattleEnd(sys.name(src), sys.name(dest), false, tcc);
    };
    
    
    // Called when two players tie.
    // Expects a ToursChannelConfig.
    Tours.events.tie = function tie(src, dest, tcc) {
        // their teams
        var playerTeam = PlayerUtils.firstTeamForTier(src, tcc.tier),
            opponentTeam = PlayerUtils.firstTeamForTier(dest, tcc.tier),
            player = sys.name(src),
            opponent = sys.name(dest),
            // their couples object
            couple = tcc.couples[tcc.players[player.toLowerCase()].couplesid],
            startedBattle;
    
        Bot.sendAll(PlayerUtils.formatName(src) + " and " + PlayerUtils.formatName(dest) + " tied and has to battle again for the tournament!", tcc.id);
    
        // automatically start battles
        if (tcc.autoStartBattles) {
            if (playerTeam !== -1 && opponentTeam !== -1) {
                if (!Tours.isBattling(player, tcc) && !Tours.isBattling(opponent, tcc)) {
                    sys.forceBattle(
                        src, // first player's id
                        dest, // second player's id
                        playerTeam, // first player's team id
                        opponentTeam, // second player's team id
                        sys.getClauses(tcc.tier), // clauses
                        0, // battle mode: singles, doubles, triples
                        false // is the battle rated?
                    );
                    
                    // don't add them to ongoingBattles
                    // as they should already be in there
                }
            } else {
                // notify them that they don't have a valid team
                if (playerTeam === -1) {
                    Bot.sendMessage(src, "You don't have a valid team for the " + tcc.tier + " tier. Your battle with " + couple[1] + " couldn't automatically be started. Please get a valid team to avoid disqualification.", tcc.id);
                }
                if (opponentTeam === -1) {
                    Bot.sendMessage(dest, "You don't have a valid team for the " + tcc.tier + " tier. Your battle with " + couple[0] + " couldn't automatically be started. Please get a valid team to avoid disqualification.", tcc.id);
                }
            }
        } else {
            // auto start battles is off
            startedBattle = Tours.isBattling(sys.name(src).toLowerCase(), tcc);
            if (startedBattle !== false) {
                // they were battling, actually pretty weird if they weren't
                // but anyway..
                tcc.roundStatus.idleBattles[Utils.objectLength(tcc.roundStatus.idleBattles)] = tcc.roundStatus.startedBattles[startedBattle];
                delete tcc.roundStatus.startedBattles[startedBattle];
            }
        }
    };
    
    // After a battle has ended
    // [src] and [dest] are names
    // Expects a ToursChannelConfig
    Tours.events.tourBattleEnd = function tourBattleEnd(src, dest, rush, tcc) {
        var srcLower = src.toLowerCase(),
            destLower = dest.toLowerCase(),
            winner = '',
            loser = '',
            srcWins = 0,
            destWins = 0,
            totalWins = 0,
            playerTeam = 0,
            opponentTeam = 0,
            message = [],
            srcPlayer,
            destPlayer,
            winnerPlayer,
            isBattling,
            entries;
        
        // check if they are actually opponents / still "battling"
        // if rush is true, then don't care about the above (this is used for dqing)
        if ((!Tours.areOpponentsForTourBattle2(src, dest, tcc) || !Tours.isBattling(src, tcc)) && !rush) {
            return;
        }
        
        // Single Elimination / Rush
        if (tcc.type === 1 || tcc.type === 4 || rush) {
            isBattling = Tours.isBattling(srcLower, tcc);
            srcPlayer = tcc.players[srcLower];
            
            // add them to winLose (battle results)
            tcc.roundStatus.winLose[Utils.objectLength(tcc.roundStatus.winLose)] = [src, dest];
            
            if (isBattling !== false) {
                // remove them from ongoingBattles
                delete tcc.roundStatus.ongoingBattles[isBattling];
            }
    
            // we don't care about the dest (loser) and the couples object anymore
            delete tcc.players[destLower];
            delete tcc.couples[srcPlayer.couplesid];
            
            // reset variables
            srcPlayer.couplesid = -1;
            srcPlayer.couplenum = -1;
            srcPlayer.roundwins = 0;
            
            // one less remaining..
            tcc.remaining -= 1;
    
            message.push(src + " advances to the next round of the tournament.", dest + " is out of the tournament.");
    
            entries = Utils.objectLength(tcc.couples);
            
            if (entries > 0) {
                message.push("", entries + " battle(s) remaining.");
            } else {
                tcc.roundPairing();
            }
        // Double and Triple Elimination
        // Although this checks for Tag Team Single Elimination, we don't care as we already handled that.
        } else if (tcc.type >= 2 && tcc.type <= 6) {
            srcPlayer = tcc.players[srcLower];
            destPlayer = tcc.players[destLower];
            
            // give [src] a round win
            srcPlayer.roundwins += 1;
    
            srcWins = srcPlayer.roundwins;
            destWins = destPlayer.roundwins;
    
            if (srcWins === Tours.battlesRequired(tcc) || destWins === Tours.battlesRequired(tcc)) {
                // this should tie
                if (srcWins === destWins) {
                    // not sure if this is really supposed to happen..
                    Tours.events.tie(sys.id(src), sys.id(dest), tcc);
                    return;
                }
    
                if (srcWins > destWins) {
                    winner = src;
                    loser = dest;
                } else {
                    winner = dest;
                    loser = src;
                }
    
                isBattling = Tours.isBattling(src, tcc);
                winnerPlayer = tcc.players[winner.toLowerCase()];
    
                // add them to winLose (battle results)
                tcc.roundStatus.winLose[Utils.objectLength(tcc.roundStatus.winLose)] = [src, dest];
                
                if (isBattling !== false) {
                    // remove them from ongoingBattles
                    delete tcc.roundStatus.ongoingBattles[isBattling];
                }
        
                // we don't care about the loser and the couples object anymore
                delete tcc.players[loser.toLowerCase()];
                delete tcc.couples[winnerPlayer.couplesid];
                
                // reset variables
                winnerPlayer.couplesid = -1;
                winnerPlayer.couplenum = -1;
                winnerPlayer.roundwins = 0;
                
                // one less remaining..
                tcc.remaining -= 1;
        
                message.push(winner + " advances to the next round of the tournament.", loser + " is out of the tournament.");
        
                entries = Utils.objectLength(tcc.couples);
                
                if (entries > 0) {
                    message.push("", entries + " battle(s) remaining.");
                } else {
                    tcc.roundPairing();
                }
            } else {
                // tell them how many times they still have to win and auto-launch the next battle
                // TODO: make this require autostartbattles
                
                srcPlayer = tcc.players[srcLower];
                destPlayer = tcc.players[destLower];
                
                srcWins = srcPlayer.roundwins;
                destWins = destPlayer.roundwins;
                totalWins = (srcWins) + (destWins);
                
                Bot.sendMessage(sys.id(src), "Great job, you've won this round! You have won " + srcWins + "/" + totalWins + " rounds so far.", tcc.id);
                Bot.sendMessage(sys.id(dest), "Sadly, you have lost this round. Try to win next round! You have won " + destWins + "/" + totalWins + " rounds so far.", tcc.id);
                
                playerTeam = PlayerUtils.firstTeamForTier(sys.id(src), tcc.tier);
                opponentTeam = PlayerUtils.firstTeamForTier(sys.id(dest), tcc.tier);
                
                // just use their first team for now
                if (playerTeam === -1) {
                    playerTeam = 0;
                }
                if (opponentTeam === -1) {
                    opponentTeam = 0;
                }
                
                sys.forceBattle(
                    sys.id(src), // first player's id
                    sys.id(dest), // second player's id
                    playerTeam, // first player's team id
                    opponentTeam, // second player's team id
                    sys.getClauses(tcc.tier), // clauses
                    0, // battle mode: singles, doubles, triples
                    false // is the battle rated?
                );
            }
        }
    
        Tours.tourBox(message, tcc);
    };