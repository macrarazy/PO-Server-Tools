/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: tours.js (Tours)
// Contains most tournament logic, including commands.
// Depends on: bot, channel-data, datahash, jsession, player-utils, style, utils

// Table of Content:
// [t-c-c]: ToursChannelConfig
// [t-o]: Tours Object
// [t-rp]: Round Pairing
// [t-evt]: Events
// [t-cmd]: Commands
// [t-const]: Constants
// [expt]: Exports

(function () {
    var Bot = require('bot'),
        ChannelData = require('channel-data'),
        DataHash = require('datahash'),
        JSESSION = require('jsession'),
        PlayerUtils = require('player-utils'),
        // NOTE: Style is require('style').style, not .manager or both
        Style = require('style').style,
        Utils = require('utils');
    
    // This object holds tournament manipulation functions [t-o]
    // And other constants
    var Tours = {};
    
    // Sends a line of whitespace to [src].
    function white(src, chan) {
        sys.sendMessage(src, "", chan);
    }
    
    // Sends the tournament border to [src].
    function border(src, chan) {
        sys.sendHtmlMessage(src, Tours.border, chan);
    }
    
    // Table for channels with ToursChannelConfig.display === Tours.displays.clean
    function tourBox(message, chan) {
        sys.sendHtmlAll("<table><tr><td><center><hr width='300'>" + message + "<hr width='300'></center></td></tr></table>", chan);
    }
    
    // Sends a tourBox to a player
    function tourBoxPlayer(src, message, chan) {
        sys.sendHtmlMessage(src, "<table><tr><td><center><hr width='300'>" + message + "<hr width='300'></center></td></tr></table>", chan);
    }
    
    // Sends a tournament notification to a player
    // Also called by bots to notify a new tournament has started
    // info is an object and only used when called by a bot
    // Contains these properties:
    // name: Name of the bot.
    // color: Color of the bot.
    function tourNotification(src, chan, info) {
        if (!JSESSION.hasChannel(chan)) {
            return;
        }
        
        var tour = JSESSION.channels(chan).tour,
            state = tour.state,
            prize = '',
            finalsStr = '',
            startTime;
    
        // No tournament is running, don't send them anything.
        if (state === 0) {
            return;
        }
        
        if (src !== 0) {
            startTime = Utils.timeToString((+sys.time()) - tour.startTime);
    
            white(src, chan);
            border(src, chan);
    
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=green>A Tournament was started by " + PlayerUtils.formatName(tour.starter) + " " + startTime + " ago! </b></font>", chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=red>Players:</font></b> " + tour.entrants, chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=blue>Type:</b></font> " + Tours.identify(tour), chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=orange>Tier:</b></font> " + tour.tier, chan);
    
            if (!Utils.isEmpty(tour.prize)) {
                sys.sendHtmlMessage(src, "<timestamp/><b><font color=brown>Prize:</b></font> " + tour.prize, chan);
            }
    
            border(src, chan);
    
            if (state === 1) {
                sys.sendHtmlMessage(src, "<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>", chan);
            } else if (state === 2) {
                if (tour.finals) {
                    finalsStr = " (<B>Finals</B>)";
                }
    
                sys.sendHtmlMessage(src, "<timestamp/>Currently in round " + tour.round + finalsStr + ". " + tour.remaining + " players remaining.", chan);
    
            }
    
            border(src, chan);
            white(src, chan);
        } else {
            // these are broadcasted by the bot.
            // that's why everything is sendHtmlAll
            if (tour.display === Tours.displays.normal) {
                Tours.white(chan);
                Tours.border(chan);
                sys.sendHtmlAll("<timestamp/><b><font color=green>A Tournament was started by <b><font color='" + info.color + "'>" + Utils.escapeHtml(info.starter) + "</font></b>! </b></font>", chan);
                sys.sendHtmlAll("<timestamp/><b><font color=red>Players:</font></b> " + tour.entrants, chan);
                sys.sendHtmlAll("<timestamp/><b><font color=blue>Type:</b></font> " + Tours.identify(tour), chan);
                sys.sendHtmlAll("<timestamp/><b><font color=orange>Tier:</b></font> " + tour.tier, chan);
                
                if (!Utils.isEmpty(tour.prize)) {
                    sys.sendHtmlAll("<timestamp/><b><font color=brown>Prize:</b></font> " + tour.prize, chan);
                }
                
                Tours.border(chan);
                sys.sendHtmlAll("<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>", chan);
                Tours.border(chan);
                Tours.white(chan);
            } else {
                if (!Utils.isEmpty(tour.prize)) {
                    prize = '<b style="color: brown;">Prize:</b> ' + tour.prize + '<br/>';
                }
                
                tourBox("A Tournament was started by <b style='color:" + info.color + "'>" + Utils.escapeHtml(info.starter) + "</b>! <br/> <b style='color:red'>Players:</b> " + tour.entrants + " <br/> <b style='color: blue'>Type:</b> " + Tours.identify(tour) + " <br/> <b style='color: orange'>Tier:</b> " + tour.tier + " <br/> " + prize + " Type <b style='color:green'>/join</b> to join it!", chan);
            }
        }
    }
    
    // Tours channel config [t-c-c]
    // Is a constructor, so should be initialized with new
    function ToursChannelConfig(id) {
        if (!this instanceof ToursChannelConfig) {
            return new ToursChannelConfig(id);
        }
        
        // id of the channel
        this.id = id;
        // state the tournament is in
        // 0: no tour is running
        // 1: tour is in signups
        // 2: tour is running
        this.state = 0;
        // the tournament's starter's name
        this.starter = "";
        // the tournament's prize
        this.prize = "";
        // round number of the tournament
        this.round = 0;
        // tier of the tournament
        this.tier = "";
        // amount of entrants that this tournament needs
        this.entrants = 0;
        // if battles should automatically start
        this.autoStartBattles = false;
        // amount of players remaining
        this.remaining = 0;
        // if the tournament is in the finals
        this.finals = false;
        // type of the tournament.
        // 0: Not running
        // 1: Single Elimination
        // 2: Double Elimination
        // 3: Triple Elimination
        // 4: Tag Team Single Elimination
        // 5: Tag Team Double Elimination
        // 6: Tag Team Triple Elimination
        this.type = 0;
    
        // status of the current round
        // contains:
        // - battles that have not begun (idleBattles)
        // - battles that have begun but have not been finished (ongoingBattles)
        // - battles that have ended (winLose)
        this.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        // couples objects (the pairs that have to battle)
        this.couples = {};
        // player objects
        /* {
                'name': name,
                'couplesid': -1,
                'couplenum': -1,
                'roundwins': 0,
                'team': -1
            };
        */
        this.players = {};
        // players in this round that still have to battle
        this.roundPlayers = 0;
        // time since epoch when tour started (signups)
        this.startTime = 0;
        // display of the tour
        // 0: normal
        // 1: clean
        this.display = 1;
    }
    
    // Sends the tournament border to a channel.
    Tours.border = function (chan) {
        sys.sendHtmlAll(Tours.border, chan);
    };
    
    // Sends whitespace to a channel.
    Tours.white = function (chan) {
        sys.sendAll("", chan);
    };
    
    // Checks if a player has tour auth in the specified channel.
    Tours.hasTourAuth = function (id, channel) {
        var poUser = JSESSION.users(id),
            poChannel = JSESSION.channels(channel);
    
        return poChannel.tourAuth.hasOwnProperty(poUser.name.toLowerCase()) || poUser.megauser || poChannel.isChanMod(id);
    };
    
    // Identifies a tour's type.
    // Expects a ToursChannelConfig.
    Tours.identify = function identify(tcc) {
        return Tours.modes[tcc.type] || "Unknown";
    };
    
    // Tourbox that can also take an array.
    // Has support for ToursChannelConfig.display === Tours.displays.normal
    // Expects a ToursChannelConfig.
    Tours.tourBox = function tourBox(message, tcc) {
        var i,
            length,
            msg;
    
        if (typeof message === "string") {
            // make it an array
            message = [message];
        }
    
        if (tcc.display !== Tours.displays.normal && tcc.display !== Tours.displays.clean) {
            // this shouldn't happen, ever
            return;
        }
    
        if (tcc.display === Tours.displays.normal) {
            Tours.white(tcc.id);
            Tours.border(tcc.id);
            Tours.white(tcc.id);
    
            for (i = 0, length = message.length; i < length; i += 1) {
                msg = message[i];
                if (Utils.isEmpty(msg)) {
                    sys.sendAll("", tcc.id);
                } else {
                    sys.sendHtmlAll(msg, tcc.id);
                }
            }
    
            Tours.white(tcc.id);
            Tours.border(tcc.id);
            Tours.white(tcc.id);
        } else { // Tours.displays.clean
            // Just use the default tourbox
            // Join with <br/> (newline)
            tourBox(message.join("<br/>"), tcc.id);
        }
    };
    
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
    
    // Resets all tournament variables
    // Copied from ToursChannelConfig
    // Expects a ToursChannelConfig
    Tours.clearVariables = function clearVariables(tcc) {
        // state the tournament is in
        // 0: no tour is running
        // 1: tour is in signups
        // 2: tour is running
        tcc.state = 0;
        // the tournament's starter's name
        tcc.starter = "";
        // the tournament's prize
        tcc.prize = "";
        // round number of the tournament
        tcc.round = 0;
        // tier of the tournament
        tcc.tier = "";
        // amount of entrants that this tournament needs
        tcc.entrants = 0;
        // amount of players remaining
        tcc.remaining = 0;
        // if the tournament is in the finals
        tcc.finals = false;
        // type of the tournament.
        // 0: Not running
        // 1: Single Elimination
        // 2: Double Elimination
        // 3: Triple Elimination
        // 4: Tag Team Single Elimination
        // 5: Tag Team Double Elimination
        // 6: Tag Team Triple Elimination
        tcc.type = 0;
    
        // status of the current round
        // contains:
        // - battles that have not begun (idleBattles)
        // - battles that have begun but have not been finished (ongoingBattles)
        // - battles that have ended (winLose)
        tcc.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        // couples objects (the pairs that have to battle)
        tcc.couples = {};
        // player objects
        /* {
                'name': name,
                'couplesid': -1,
                'couplenum': -1,
                'roundwins': 0,
                'team': -1
            };
        */
        tcc.players = {};
        // players in this round that still have to battle
        tcc.roundPlayers = 0;
        // time since epoch when tour started (signups)
        tcc.startTime = 0;
    };
    
    // Resets round tournament variables
    // Copied from ToursChannelConfig
    // Expects a ToursChannelConfig
    Tours.cleanRoundVariables = function cleanRoundVariables(tcc) {
        // status of the current round
        // contains:
        // - battles that have not begun (idleBattles)
        // - battles that have begun but have not been finished (ongoingBattles)
        // - battles that have ended (winLose)
        tcc.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        // couples objects (the pairs that have to battle)
        tcc.couples = {};
        // players in this round that still have to battle
        tcc.roundPlayers = 0;
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
    
    // Returns the amount of battles required before a player goes on to the next round
    // Expects a ToursChannelConfig
    Tours.battlesRequired = function battlesRequired(tcc) {
        return {
            1: 1,
            2: 2,
            3: 3,
            4: 1,
            5: 2,
            6: 3
        }[tcc.mode];
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
    
    
    // Most (if not all) of the tournament commands [t-cmd]
    // Note: Permission is handled in the command itself, using Tours.commands.commandsHandler(commandName, src, commandData, chan);
    Tours.commands = {};
    
    // List of all commands that can be used by users and above
    Tours.commands.userCommands = ['tourprize', 'join', 'unjoin', 'viewround'];
    
    // List of all commands that can be used by operators (chan auth/megauser/channel megauser) and above
    Tours.commands.operatorCommands = ['display', 'autostartbattles', 'dq', 'switch', 'push', 'cancelbattle', 'tour', 'changespots', 'endtour'];
    
    // List of all commands that can be used by moderators and above
    Tours.commands.modCommands = [];
    
    // Handles commands, includes permission checks
    Tours.commands.commandsHandler = function tourCommandHandler(commandName, src, commandData, chan, fullCommand) {
        var channel = JSESSION.channels(chan);
        
        if (Tours.commands[commandName]) {
            if (Tours.commands.operatorCommands.indexOf(commandName) > -1
                    || Tours.commands.modCommands.indexOf(commandName) > -1) {
                if (!Tours.hasTourAuth(src, channel.tour)) {
                    Utils.noPermissionMessage(src, fullCommand, chan, channel.tour);
                    return false;
                }
            }
            
            // check their playerpermission too
            if (Tours.commands.modCommands.indexOf(commandName) > -1
                    && PlayerUtils.trueAuth(src) <= 0) {
                Utils.noPermissionMessage(src, fullCommand, chan, channel.tour);
                return false;
            }
                
            Tours.commands[commandName](src, commandData, chan);
            return true;
        }
            
        return false;
    };
    
    // Displays the tournament prize
    // Permission: User
    Tours.commands.tourprize = function tourprizeCommand(src, commandData, chan, tcc) {
        if (tcc.state === 0) {
            Bot.sendMessage(src, "No tournament has started or is currently running.", chan);
            return;
        }
        if (Utils.isEmpty(tcc.prize)) {
            Bot.sendMessage(src, "This tournament has no prize. <font color='gray'>:(</font>", chan);
            return;
        }
    
        Bot.sendMessage(src, "This tournament's prize is: " + tcc.prize, chan);
    };
    
    // To join the tournament.
    // Permission: User
    Tours.commands.join = function joinCommand(src, commandData, chan, tcc) {
        var name = sys.name(src),
            nameToLower = name.toLowerCase(),
            message = PlayerUtils.formatName(src) + " joined the tournament! <b>" + Tours.tourSpots(tcc) - 1 + "</b> more spot(s) left!";
        
        // either hasn't started or isn't running
        if (tcc.state !== 1) {
            Bot.sendMessage(src, "No tournament has started or is already running.", chan);
            return;
        }
    
        if (tcc.players.hasOwnProperty(nameToLower)) {
            Bot.sendMessage(src, "You are already in the tournament. You are not able to join more than once.", chan);
            return;
        }
        
        if (!PlayerUtils.hasTeamForTier(src, tcc.tier)) {
            Bot.sendMessage(src, "You don't have a team for the " + tcc.tier + " tier. Load or make one to join.", chan);
            return;
        }
    
        if (Tours.tourSpots(tcc) > 0) {
            Tours.buildHash(src, tcc);
            
            if (tcc.entrants < 9) {
                // Send a tourbox if less than 9 can participate
                Tours.tourBox(message, tcc);
            } else {
                Bot.sendAll(message, chan);
            }
    
            if (Tours.tourSpots(src) === 0) {
                // because a player has joined, there is one less spot remaining.
                tcc.state = 2;
                tcc.round = 0;
            }
        } else {
            Bot.sendMessage(src, "There are no more spots left!", chan);
        }
    };
    
    // To leave the tournament.
    // Permission: User
    Tours.commands.unjoin = function unjoinCommand(src, commandData, chan, tcc) {
        var name = sys.name(src),
            nameToLower = name.toLowerCase();
        
        if (tcc.state === 0) {
            // no tour has started yet..
            Bot.sendMessage(src, "No tournament has started.", chan);
            return;
        }
    
        if (!tcc.players.hasOwnProperty(nameToLower)) {
            Bot.sendMessage(src, "You have to join the tournament first!", chan);
            return;
        }
    
        // if there the tour has already started, lower the amount
        // of players still remaining
        if (tcc.state === 2) {
            tcc.remaining -= 1;
            
            if (tcc.players[nameToLower].couplesid !== -1) {
                // forcefully end their battle
                Tours.events.tourBattleEnd(Tours.tourOpponent(name, tcc), name, true, tcc);
            }
        }
        
        delete tcc.players[nameToLower];
        
        Tours.tourBox(PlayerUtils.formatName(src) + " left the tournament! <b>" + Tours.tourSpots(tcc) + "</b> spot(s) left!", tcc);
    
        // if there are no more couples remaining,
        // and we are in the battling phase,
        // call .roundPairing (note that we do this after the tourBox above to prevent the order from being all messed up)
        if (tcc.state === 2 && Utils.objectLength(tcc.couples) === 0) {
            Tours.roundPairing(tcc);
        }
    };
    
    // To view the status of the current round.
    // Permission: User
    Tours.commands.viewround = function viewroundCommand(src, commandData, chan, tcc) {
        var idleBattles = tcc.roundStatus.idleBattles,
            ongoingBattles = tcc.roundStatus.ongoingBattles,
            winLose = tcc.roundStatus.winLose,
            anyIdleBattles = (Utils.objectLength(idleBattles) !== 0),
            anyOngoingBattles = (Utils.objectLength(ongoingBattles) !== 0),
            anyFinishedBattles = (Utils.objectLength(winLose) !== 0),
            roundIdentifier = (tcc.finals ? "Finals" : "Round " + tcc.round),
            cur,
            i;
        
        if (tcc.state !== 2) {
            Bot.sendMessage(src, "No tournament has started or is currently running.", chan);
            return;
        }
    
        sys.sendMessage(src, "", chan);
        sys.sendHtmlMessage(src, Style.header, chan);
        sys.sendMessage(src, "", chan);
    
        Bot.sendMessage(src, roundIdentifier + " of " + tcc.tier + " tournament:", chan);
        
        if (anyFinishedBattles) {
            sys.sendMessage(src, "", chan);
            Bot.sendMessage(src, "Battles finished:", chan);
            sys.sendMessage(src, "", chan);
            
            for (i in winLose) {
                cur = winLose[i];
                Bot.sendMessage(src, PlayerUtils.formatName(cur[0]) + " won against " + PlayerUtils.formatName(cur[1]), chan);
            }
    
            sys.sendMessage(src, "", chan);
        }
    
        if (anyOngoingBattles) {
            sys.sendMessage(src, "", chan);
            Bot.sendMessage(src, "Ongoing battles:", chan);
            sys.sendMessage(src, "", chan);
            
            for (i in ongoingBattles) {
                cur = ongoingBattles[i];
                Bot.sendMessage(src, PlayerUtils.formatName(cur[0]) + " VS " + PlayerUtils.formatName(cur[1]), chan);
            }
    
            sys.sendMessage(src, "", chan);
        }
    
        if (anyIdleBattles) {
            sys.sendMessage(src, "", chan);
            Bot.sendMessage(src, "Yet to start battles:", chan);
            sys.sendMessage(src, "", chan);
            
            for (i in idleBattles) {
                cur = idleBattles[i];
                Bot.sendMessage(src, PlayerUtils.formatName(cur[0]) + " VS " + PlayerUtils.formatName(cur[1]), chan);
            }
            
            sys.sendMessage(src, "", chan);
        }
    
        if (anyFinishedBattles) {
            sys.sendMessage(src, "", chan);
            Bot.sendMessage(src, "Players to the next round:", chan);
            sys.sendMessage(src, "", chan);
    
            for (i in winLose) {
                // the first player, e.g. the winner
                Bot.sendMessage(src, PlayerUtils.formatName(winLose[i][0]), chan);
            }
                                
            sys.sendMessage(src, "", chan);
        }
    
        sys.sendMessage(src, "", chan);
        sys.sendHtmlMessage(src, Style.footer, chan);
    };
    
    // Changes the display mode of a channel.
    // Permission: Operator
    Tours.commands.display = function displayCommand(src, commandData, chan, tcc) {
        var mode = parseInt(commandData, 10),
            modeString = (mode === Tours.displays.normal ? "normal" : "clean");
        
        if (mode < 0 || mode > 2) {
            Bot.sendMessage(src, "Valid tournament display modes are 1 (Normal) and 2 (Clean).", chan);
            return;
        }
        
        if (tcc.display === mode) {
            Bot.sendMessage(src, "The tournament display mode is already " + mode + ".", chan);
            return;
        }
    
        tcc.display = mode;
        Tours.tourBox(PlayerUtils.formatName(src) + " changed the tournament display mode to " + modeString + ".");
    
        ChannelData.save(chan, 'display', mode);
    };
    
    // Reverses auto start battle of a channel.
    // Permission: Operator
    Tours.commands.autostartbattles = function autostartbattlesCommand(src, commandData, chan, tcc) {
        var onString = Utils.toOnString(!tcc.autoStartBattles);
        
        tcc.autoStartBattles = !tcc.autoStartBattles;
    
        tourBox(PlayerUtils.formatName(src) + " turned auto start battles " + onString + ".", tcc);
        ChannelData.save(chan, 'autoStartBattles', tcc.autoStartBattles);
    };
    
    // Disqualifies a player from the tournament.
    // Permission: Operator
    Tours.commands.dq = function dqCommand(src, commandData, chan, tcc) {
        var target = commandData.toLowerCase();
        
        if (tcc.state === 0) {
            Bot.sendMessage(src, "No tournament has started or is currently running.", chan);
            return;
        }
    
        if (!tcc.players.hasOwnProperty(target)) {
            Bot.sendMessage(src, "That player never joined the tournament!", chan);
            return;
        }
    
        Tours.tourBox(PlayerUtils.formatName(target) + " was disqualified from the tournament by " + PlayerUtils.formatName(src) + "!", tcc);
    
        if (tcc.state === 2) {
            tcc.remaining -= 1;
            
            // forcefully dq them if they have a couple (e.g. not a bye)
            if (tcc.players[target].couplesid !== -1) {
                Tours.tourBattleEnd(Tours.tourOpponent(commandData), PlayerUtils.trueName(commandData), true, tcc);
            }
        }
        
        delete tcc.players[target];
    };
    
    // Switches a player in the tournament (removing one from it and replacing them with another)
    // Permission: Operator
    Tours.commands["switch"] = function switchCommand(src, commandData, chan, tcc) {
        var mcmd = commandData.split(':'),
            player1 = PlayerUtils.trueName(mcmd[0] || ""),
            player1ToLower = player1.toLowerCase(),
            player2 = PlayerUtils.trueName(mcmd[1] || ""),
            player2ToLower = player2.toLowerCase(),
            helpStr = "",
            message = [],
            idleIndex,
            idleObject;
        
        if (tcc.state === 0) {
            Bot.sendMessage(src, "No tournament has started or is currently running.", chan);
            return;
        }
        
        // give them a helpful message telling them what they did wrong.
        if (!Tours.isInTourney(player1, tcc)) {
            helpStr += "The first player needs to be in the tournament. ";
        }
        
        if (sys.id(player2) === undefined) {
            helpStr += "The second player needs to be logged in.";
        }
        
        if (helpStr !== "") {
            Bot.sendMessage(src, helpStr, chan);
            return;
        }
        
        if (!!Tours.isBattling(player1, tcc)) {
            Bot.sendMessage(src, "The first player shouldn't be battling.", chan);
            return;
        }
    
        idleIndex = Tours.idleBattler(player1, tcc);
        
        // also copy over idleBattlers
        if (idleIndex !== false) {
            idleObject = tcc.roundStatus.idleBattles[idleIndex];
            idleObject[idleObject.indexOf(player1)] = player2;
        }
        
        // TODO: copy over winLose?
    
        // copy the old player, but change the .name
        // and then delete the old player.
        tcc.players[player2ToLower] = Utils.extend({}, tcc.players[player1ToLower]);
        tcc.players[player2ToLower].name = player2;
        
        delete tcc.players[player1ToLower];
    
        message.push(PlayerUtils.formatName(player1) + " was switched with " + PlayerUtils.formatName(player2) + " by " + PlayerUtils.formatName(src) + "!");
    
        if (tcc.state === 1) {
            message.push("<b>" + Tours.tourSpots(tcc) + "</b> more spot(s) left!");
        }
    
        Tours.TourBox(message);
    };
    
    // Adds a player to the tournament.
    // Permission: Operator
    Tours.commands.push = function pushCommand(src, commandData, chan, tcc) {
        var target = PlayerUtils.trueName(commandData || ""),
            targetToLower = target.toLowerCase(),
            message = [];
        
        if (tcc.state === 0) {
            Bot.sendMessage(src, "No tournament has started or is currently running.", chan);
            return;
        }
    
        if (tcc.state === 2 && Tours.isTagTeamTour(tcc)) {
            Bot.sendMessage(src, "You cannot add players to a running tag team tour!", chan);
            return;
        }
    
        if (Tours.isInTourney(targetToLower, tcc)) {
            Bot.sendMessage(src, target + " is already in the tournament!", chan);
            return;
        }
    
        message.push(PlayerUtils.formatName(target) + " was added to the tournament by " + PlayerUtils.formatName(src) + "!");
    
        // create a player object for them.
        // note that they are automatically a bye if the tournament has already started.
        Tours.buildHash(target, tcc);
    
        if (tcc.state === 1) {
            message.push("<b>" + Tours.tourSpots(tcc) + "</b> more spot(s) left!");
        } else if (tcc.state === 2) {
            tcc.remaining += 1;
        }
    
        Tours.tourBox(message, tcc);
        
        // if there are no more spots left, run roundPairing
        if (tcc.state === 1 && Tours.tourSpots(tcc) === 0) {
            tcc.state = 2;
            tcc.round = 0;
            
            Tours.roundPairing(tcc);
        }
    };
    
    // Cancels a battle being official.
    // Permission: Operator
    Tours.commands.cancelbattle = function cancelbattleCommand(src, commandData, chan, tcc) {
        var target = PlayerUtils.trueName(commandData || ""),
            targetToLower = target.toLowerCase(),
            battleIndex;
        
        if (tcc.state === 0) {
            Bot.sendMessage(src, "No tournament has started or is currently running.", chan);
            return;
        }
        
        if (!tcc.players.hasOwnProperty(targetToLower)) {
            Bot.sendMessage(src, target + " is not in the tournament.", chan);
            return;
        }
    
        battleIndex = Tours.isBattling(target, tcc);
    
        if (battleIndex === false) {
            Bot.sendMessage(src, target + "'s battle has either not begun already, or they're through to the next round.", chan);
            return;
        }
    
        // delete them from ongoingBattles
        // which makes their match unofficial
        delete this.roundStatus.ongoingBattles[battleIndex];
        
        // add them back to idleBattles
        // note that we can just copy the old battleIndex over, 
        // because it's exactly what idleBattles (and winLose) uses as well.
        tcc.roundStatus.idleBattles[Utils.objectLength(tcc.roundStatus.idleBattles)] = battleIndex;
    
        Tours.tourBox(PlayerUtils.formatName(target) + " can forfeit their battle and rematch now.", chan);
    };
    
    // Starts a new tournament.
    // Permission: Operator
    Tours.commands.tour = function tourCommand(src, commandData, chan, tcc) {
        // Player MCMD arguments:
        // 0: Tier name
        // 1: Amount of entrants
        // 2: Tournament mode [optional=1]
        // 3: Prize [optional]
        
        var mcmd = commandData.split(':'),
            newSpots = parseInt(mcmd[1], 10),
            newType = parseInt(mcmd[2], 10),
            name = sys.name(src),
            tierName;
        
        // if a tour is in the signups / battling phase
        if (tcc.state !== 0) {
            Bot.sendMessage(src, "A tournament is already running.", chan);
            return;
        }
    
        // clear the variables just in case
        Tours.clearVariables(tcc);
        
        if (isNaN(newSpots)) {
            Bot.sendMessage(src, "Specify a valid number for the entrants.", chan);
            return;
        }
            
        if (newSpots < 3) {
            Bot.sendMessage(src, "Specify a size of 3 or more for the entrants.", chan);
            return;
        }
        
        if (Tours.isTagTeamTour(tcc)) {
            // we already checked if it was < 3
            if (newSpots === 3) {
                Bot.sendMessage(src, "Specify a size of 4 or more for the entrants.", chan);
                return;
            }
    
            if (newSpots % 2 !== 0) {
                Bot.sendMessage(src, "Specify an even number of players (4, 6, 8, 12, 20, ...) for the entrants.", chan);
                return;
            }
        }
        
        // also set the amount of players "remaining"
        tcc.entrants = tcc.remaining = newSpots;
        
        // If the mode couldn't be found,
        // change it to single elimination.
        // note: we have to set it first
        tcc.type = newType;
        
        if (Tours.identify(tcc) === "Unknown") {
            newType = 1;
        }
    
        // in case it was changed.
        tcc.type = newType;
    
        // this fancy piece of code checks if the tier the user specified actually exists
        tierName = Utils.isValidTier(mcmd[0]);
        
        if (!tierName) {
            Bot.sendMessage(src, "Specify a valid tier (" + mcmd[0] + " is not a valid tier).", chan);
            return;
        }
    
        // everything after the 4th ':'
        tcc.prize = Utils.escapeHtml(Utils.cut(mcmd, 3, ':'));
    
        if (Utils.isEmpty(tcc.prize)) {
            tcc.prize = "";
        }
        
        // set all important information
        tcc.tier = tierName;
        tcc.state = 1;
        tcc.startTime = +(sys.time());
        tcc.starter = name;
    
        tourNotification(0, chan, {
            "starter": name,
            "color": PlayerUtils.trueColor(src)
        });
    };
    
    // Changes the amount of entrants.
    // Permission: Operator
    Tours.commands.changespots = function changespotsCommand(src, commandData, chan, tcc) {
        var newSpots = parseInt(commandData, 10);
        
        // if this isn't the signups.
        if (tcc.state !== 1) {
            Bot.sendMessage(src, "No tournament is running or it appears to have passed the signups.", chan);
            return;
        }
    
        if (isNaN(newSpots)) {
            Bot.sendMessage(src, "Specify a valid number.", chan);
            return;
        }
            
        if (newSpots < 3) {
            Bot.sendMessage(src, "Specify a size of 3 or more.", chan);
            return;
        }
        
        if (Tours.isTagTeamTour(tcc)) {
            // we already checked if it was < 3
            if (newSpots === 3) {
                Bot.sendMessage(src, "Specify a size of 4 or more.", chan);
                return;
            }
    
            if (newSpots % 2 !== 0) {
                Bot.sendMessage(src, "Specify an even number of players (4, 6, 8, 12, 20, ...).", chan);
                return;
            }
        }
    
        if (Tours.totalPlayers(tcc) > newSpots) {
            Bot.sendMessage(src, "More than " + newSpots + " players have already signed up!", chan);
            return;
        }
    
        tcc.entrants = tcc.remaining = newSpots;
        Tours.tourBox(
            [
                PlayerUtils.trueName(src) + " changed the numbers of entrants to " + newSpots + "!",
                "<b>" + Tours.tourSpots(tcc) + "</b> more spot(s) remaining!"
            ]
        );
    
        // call roundPairing if no more spots are remaining.
        if (Tours.tourSpots(tcc) === 0) {
            tcc.state = 2;
            tcc.round = 0;
            
            Tours.roundPairing(tcc);
        }
    
    };
    
    // Ends the running tournament.
    // Permission: Operator
    Tours.commands.endtour = function endtourCommand(src, commandData, chan, tcc) {
        if (tcc.state === 0) {
            Bot.sendMessage("No tournament has started or is currently running.");
            return;
        }
        
        // resets all the variables, stopping the running tournament
        Tours.clearVariables(tcc);
        Tours.tourBox("The tournament has been ended by " + PlayerUtils.formatName(src) + "!", tcc);
    };
    
    // Constants [t-const]
    Tours.blue = 0;
    Tours.red = 1;
    
    Tours.border = "<font color=blue><timestamp/><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB</b></font>";
    
    Tours.displays = {
        normal: 1,
        clean: 2
    };
    
    Tours.modes = {
        0: "No tournament is running.",
        1: "Single Elimination",
        2: "Double Elimination",
        3: "Triple Elimination",
        4: "Tag Team Single Elimination",
        5: "Tag Team Double Elimination",
        6: "Tag Team Triple Elimination"
    };
    
    // exports for this module [expt]
    // exports Tours
    exports.Tours = Tours;
    
    // exports ToursChannelConfig
    exports.ToursChannelConfig = ToursChannelConfig;
    
    // exports tourBox, tourBoxPlayer, and tourNotification
    exports.tourBox = tourBox;
    exports.tourBoxPlayer = tourBoxPlayer;
    exports.tourNotification = tourNotification;
    
    // exports white and border
    exports.white = white;
    exports.border = border;
}());