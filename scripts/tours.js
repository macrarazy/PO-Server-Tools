/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

// File: tours.js
// Contains most tournament logic, including commands.
// Depends on: player-utils, utils, bot, datahash, jsession

// Table of Content:
// [t-c-c]: ToursChannelConfig
// [t-o]: Tours Object
// [t-rp]: Round Pairing
// [t-evt]: Events
// [t-cmd]: Commands
// [t-const]: Constants
// [expt]: Exports

(function () {
    // TODO: PlayerUtils: PlayerUtils.formatName(id | name) (same as player())
    var PlayerUtils = require('player-utils'),
        // TODO: ChannelData: ChannelData.save(chanId, propertyName, propertyValue)
        ChannelData = require('channel-data'),
        // TODO: Utils: Utils.timeToString(): getTimeString
        // TODO: Utils: Utils.isEqual(): cmp
        // TODO: Utils: Utils.toOnString(bool): toOn
        Utils = require('utils'),
        Bot = require('bot'),
        DataHash = require('datahash'),
        JSESSION = require('jsession').JSESSION;
    
    // Whitespace
    function white(src, chan) {
        sys.sendMessage(src, "", chan);
    }
    
    // Sends the tour border to [src]
    function border(src, chan) {
        sys.sendHtmlMessage(src, Tours.border, chan);
    }
    
    // Table for channels with ToursChannelConfig#display === Tours.displays.clean
    function tourBox(message, chan) {
        sys.sendHtmlAll("<table><tr><td><center><hr width='300'>" + message + "<hr width='300'></center></td></tr></table>", chan);
    }
    
    // Sends a tourBox to a player
    function tourBoxPlayer(src, message, chan) {
        sys.sendHtmlMessage(src, "<table><tr><td><center><hr width='300'>" + message + "<hr width='300'></center></td></tr></table>", chan);
    }
    
    // Sends a tournament notification to a player
    // Also called by bots to notify a new tournament has started
    // ------
    // info is an object and only used when called by a bot
    // Contains these properties:
    // name: Name of the bot.
    // color: Color of the bot.
    // TODO: This function is really ugly.
    function tourNotification(src, chan, info) {
        var tour = JSESSION.channels(chan).tour,
            mode = tour.mode,
            prize = '',
            finalsStr = '',
            startTime;
    
        if (src !== 0) {
            if (mode === 0) {
                return;
            }
            
            startTime = Utils.timeToString(+(sys.time()) - tour.startTime);
    
            white(src, chan);
            border(src, chan);
    
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=green>A Tournament was started by " + PlayerUtils.formatName(tour.starter) + " " + startTime + " ago! </b></font>", chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=red>Players:</font></b> " + tour.entrants, chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=blue>Type:</b></font> " + Tours.identify(tour), chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=orange>Tier:</b></font> " + tour.tier, chan);
    
            if (!isEmpty(tour.prize)) {
                sys.sendHtmlMessage(src, "<timestamp/><b><font color=brown>Prize:</b></font> " + tour.prize, chan);
            }
    
            border(src, chan);
    
            if (mode === 1) {
                sys.sendHtmlMessage(src, "<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>", chan);
            } else if (mode === 2) {
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
                // TODO: Implement color support for bot.
                sys.sendHtmlAll("<timestamp/><b><font color=green>A Tournament was started by " + Utils.escapeHtml(info.starter) + "! </b></font>", chan);
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
    
    // This object holds tournament manipulation functions [t-o]
    // And other constants
    Tours = {};
    
    // Sends the tournament border to a channel
    Tours.border = function (chan) {
        sys.sendHtmlAll(Tours.border, chan);
    };
    
    // Sends whitespace to a channel
    Tours.white = function (chan) {
        sys.sendAll("", chan);
    };
    
    // Checks if a player has tour auth in the specified channel
    Tours.hasTourAuth = function (id, channel) {
        var poUser = JSESSION.users(id),
            poChannel = JSESSION.channels(channel);
    
        return poChannel.tourAuth.hasOwnProperty(poUser.name.toLowerCase()) || poUser.megauser || poChannel.isChanMod(id);
    };
    
    // Identifies a tour's type.
    // Expects a ToursChannelConfig
    Tours.identify = function (tcc) {
        return Tours.modes[tcc.type] || "Unknown";
    };
    
    // Tourbox that can also take an array
    // Has support for ToursChannelConfig.display === Tours.displays.normal
    // Expects a ToursChannelConfig
    Tours.tourBox = function (message, tcc) {
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
    
            for (i = 0, length = message.length; i < length; ++i) {
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
    Tours.idleBattler = function (name, tcc) {
        var hash = tcc.roundStatus.idleBattles,
            curr,
            i;
    
        for (i in hash) {
            curr = hash[i];
            // is the first or second battler of this battle [name]?
            if (curr[0] === name || curr[1] === name) {
                return x;
            }
        }
    
        return false;
    };
    
    // Checks if [name] has begun their battle but hasn't finished yet
    // Returns their entry in ToursChannelConfig.roundStatus.ongoingBattles if they are
    Tours.isBattling = function (name) {
        var hash = tcc.roundStatus.ongoingBattles,
            cur,
            i;
    
        name = name.toLowerCase();
        for (i in hash) {
            cur = hash[i];
            // is the first or second battler of this battle [name]?
            if (cur[0].toLowerCase() === name || cur[1].toLowerCase() === name) {
                return x;
            }
        }
    
        return false;
    };
    
    // Resets all tournament variables
    // Copied from ToursChannelConfig
    // Expects a ToursChannelConfig
    Tours.clearVariables = function (tcc) {
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
    Tours.cleanRoundVariables = function (tcc) {
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
    
    // Returns the total amount of players that have signed up
    // Expects a ToursChannelConfig
    Tours.totalPlayers = function (tcc) {
        return Utils.objectLength(tcc.players);
    };
    
    // get the amount of spots left in the tournament
    // using the formula: amount of entrants allowed - amount of entrants that joined
    Tours.tourSpots = function (tcc) {
        return tcc.entrants - Utils.objectLength(tcc.players);
    };
    
    // if this tour is a tag team tour
    Tours.isTagTeamTour = function (tcc) {
        return tcc.type > 3 && tcc.type < 7;
    };
    
    // Returns the object at [pos] in [hash]
    // Returns an empty object ({}) if [hash] has less entries than [pos]
    Tours.hashAt = function (hash, pos) {
        var num = 0,
            i;
        
        for (i in hash) {
            if (now === pos) {
                return hash[i];
            }
            ++num;
        }
        
        return {};
    };
    
    // Returns the name of the player in [hash] at position [hashno]
    // Returns "" if the hash has less than [pos + 1] entries
    Tours.playerName = function (hash, pos) {
        return (Tours.hashAt(hash, pos).name || "");
    };
    
    // Checks which team has won in tag team tours (if any).
    // Returns an object with 3 properties:
    // - winners: Names of the winners in a team (empty if none)
    // - loser: The name of the loser's team
    // - losingteam: ID of the team that lost (Tours.blue | Tours.red)
    Tours.teamWin = function (tcc) {
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
    Tours.randomPlayer = function (object, teamId) {
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
            print("Warning from scripts/tours.js: Unknown player in Tours.randomPlayer at position " + random + ".");
            return 0;
        }
    
        // keep doing it
        // TODO: this might crash
        while (playerObj.team !== team) {
            random = sys.rand(0, entries);
            playerObj = Tours.hashAt(object, random);
        }
    
        // this position is fine.
        return rand;
    };
    
    // builds a new entrant's player hash
    Tours.buildHash = function (src, tcc) {
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
    Tours.buildTeams = function (tcc) {
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
    Tours.playersOfTeam = function (team, tcc) {
        var players = tcc.players,
            numPlayers = 0,
            i;
        
        for (i in players) {
            if (players[i].team === team) {
                ++numPlayers;
            }
        }
    
        return numPlayers;
    };
    
    // returns the names of all players in [team]
    // expects a ToursChannelConfig
    Tours.namesOfTeam = function (team, tcc) {
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
    Tours.isInTourney = function (name, tcc) {
        return tcc.players.hasOwnProperty(name.toLowerCase());
    };
    
    // check if someone is in the tournament by id
    Tours.isInTourneyId = function (id, tcc) {
        return tcc.players.hasOwnProperty(sys.name(id).toLowerCase());
    };
    
    // returns the name of [name]'s tour opponent
    // expects a ToursChannelConfig
    Tours.tourOpponent = function (name, tcc) {
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
    Tours.areOpponentsForTourBattle = function (src, dest, tcc) {
        return Tours.isInTourney(sys.name(src)) && Tours.isInTourney(sys.name(dest)) && Tours.tourOpponent(sys.name(src), tcc).toLowerCase() === sys.name(dest).toLowerCase();
    };
    
    // Checks if [src] (name) and [dest] (name) are opponents in this round.
    // Expects a ToursChannelConfig
    Tours.areOpponentsForTourBattle2 = function (src, dest, tcc) {
        return Tours.isInTourney(src) && Tours.isInTourney(dest) && Tours.tourOpponent(src, tcc).toLowerCase() === dest.toLowerCase();
    };
    
    // Returns the amount of battles required before a player goes on to the next round
    // Expects a ToursChannelConfig
    Tours.battlesRequired = function (tcc) {
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
    Tours.roundPairing = function (tcc) {
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
    
        ++this.round;
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
                DataHash.money[name] += randNum;
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
                    for (i = 0, length = winners.length; i < length; ++i) {
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
                        DataHash.money[name] += randNum;
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
            team = "<b><font color=blue>[Team Blue]</font></b>";
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
            
            ++i;
    
            if (tcc.finals) {
                message.push(team1 + name1 + " VS " + team2 + name2);
            } else {
                // add their battle number
                message.push(i + ". " + team1 + name1 + " VS " + team2 + name2);
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
        
        // end of roundPairing..
        // that was a long ride :P
    };
    
    // Tournament events [t-evt]
    Tours.events = {};
    
    // After a battle has started.
    // Expects a ToursChannelConfig
    Tours.events.afterBattleStarted = function (src, dest, clauses, rated, srcteam, destteam, tcc) {
        var srcName = sys.name(src),
            destName = sys.name(dest),
            idleBattler;
        
        // e.g. when the tour has started
        if (tcc.mode === 2) {
            if (Tours.areOpponentsForTourBattle(src, dest, ttc)) {
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
                        Bot.sendMessage("Final round tournament match between " + srcName + " and " + destName + " has started!", tcc.id);
                    } else {
                        Bot.sendMessage("Round " + tcc.round + " tournament match between " + srcName + " and " + destName + " has started!", tcc.id);
                    }
                } else {
                    if (sys.tier(src, srcteam) === sys.tier(dest, destteam) && Utils.isEqual(sys.tier(src, srcteam), tcc.tier)) {
                        idleBattler = Tours.idleBattler(srcName, ttc);
                        
                        if (tcc.roundStatus.idleBattles[idleBattler] !== undefined) {
                            // be lazy and copy it over
                            tcc.roundStatus.ongoingBattles[Utils.objectLength(tcc.roundStatus.ongoingBattles)] = tcc.roundStatus.idleBattles[idleBattler];
                            delete tcc.roundStatus.idleBattles[idleBattler];
                        }
                        
                        if (tcc.finals) {
                            Bot.sendMessage("Final round tournament match between " + srcName + " and " + destName + " has started!", tcc.id);
                        } else {
                            Bot.sendMessage("Round " + tcc.round + " tournament match between " + srcName + " and " + destName + " has started!", tcc.id);
                        }
                    } else {
                        Bot.sendMessage(src, "Your or your opponents team does not match the tournament tier (the match is not official).", tcc.id);
                        Bot.sendMessage(dest, "Your or your opponents team does not match the tournament tier (the match is not official).", tcc.id);
                    }
                }
            }
        }
    };
    
    // when the battles have ended
    // expects a ToursChannelConfig
    Tours.events.afterBattleEnded = function (src, dest, desc, tcc) {
        // bail if the tour hasn't started or we only have one player left.
        if (tcc.mode !== 2 || Utils.objectLength(tcc.players) === 1) {
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
    
    
    // When a two players tie
    // Expects a ToursChannelConfig
    Tours.events.tie = function (src, dest, tcc) {
        // their teams
        var playerTeam = PlayerUtils.firstTeamForTier(src, tcc.tier),
            opponentTeam = PlayerUtils.firstTeamForTier(dest, tcc.tier),
            // their couples object
            couple = tcc.couples[tcc.players[sys.name(src).toLowerCase()].couplesid],
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
    Tours.events.tourBattleEnd = function (src, dest, rush, tcc) {
        var srcLower = src.toLowerCase(),
            destLower = dest.toLowerCase(),
            winner = '',
            loser = '',
            srcWins = 0,
            destWins = 0,
            totalWins = 0,
            playerTeam = 0,
            destTeam = 0,
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
            --tcc.remaining;
    
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
            ++srcPlayer.roundwins;
    
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
                --tcc.remaining;
        
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
    Tours.commands.userCommands = ['tourprize'];
    
    // List of all commands that can be used by operators (chan auth/megauser/channel megauser) and above
    Tours.commands.operatorCommands = ['display', 'autostartbattles'];
    
    // List of all commands that can be used by moderators and above
    Tours.commands.modCommands = [];
    
    // Handles commands, includes permission checks
    Tours.commands.commandsHandler = function (commandName, src, commandData, chan, fullCommand) {
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
    
    // Changes the display mode of a channel.
    // Permission: Operator
    Tours.commands.display = function (src, commandData, chan, tcc) {
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
    Tours.commands.autostartbattles = function (src, commandData, chan, tcc) {
        var onString = Utils.toOnString(!tcc.autoStartBattles);
        
        tcc.autoStartBattles = !tcc.autoStartBattles;
    
        tourBox(PlayerUtils.formatName(src) + " turned auto start battles " + onString + ".", tcc);
        ChannelData.save(chan, 'autoStartBattles', tcc.autoStartBattles);
    };
    
    // Displays the tournament prize
    // Permission: User
    Tours.commands.tourprize = function (src, commandData, chan, tcc) {
        if (tcc.mode === 0) {
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
    Tours.commands.join = function (src, commandData, chan, tcc) {
        // either hasn't started or isn't running
        if (tcc.mode !== 1) {
            Bot.sendMessage(src, "No tournament has started or is already running.", tcc.id);
            return;
        }
    
        var self = sys.name(src).toLowerCase();
        if (this.players.has(self)) {
            botMessage(src, "You are already in the tournament. You are not able to join more than once.", this.id);
            return;
        }
        if (!hasTeam(src, this.tourtier)) {
            botMessage(src, "You don't have a team for the " + this.tourtier + " tier. Load or make one to join.", this.id);
            return;
        }
    
        var me = player(src),
            spots = this.tourSpots(),
            message;
        if (spots > 0) {
            this.buildHash(src);
    
            spots--;
            message = me + " joined the tournament! <b>" + spots + "</b> more " + Grammar.s("spot", spots) + " left!";
    
            if (this.tournumber < 9) { // Max spots is 8 for the bigger message.
                this.TourBox(message);
            } else {
                this.sendAll(message);
            }
    
    
            if (spots === 0) {
                this.tourmode = 2;
                this.roundnumber = 0;
                this.roundPairing();
            }
            return;
        }
    
        botMessage(src, "There are no spots remaining.", this.id);
    };
    
    Tours.prototype.command_unjoin = function (src, commandData, fullCommand) {
        if (this.tourmode === 0) {
            botMessage(src, "Wait untill the tournament has started.", this.id);
            return;
        }
    
        var self = sys.name(src).toLowerCase();
        if (!this.players.has(self)) {
            botMessage(src, "You have not joined the tournament.", this.id);
            return;
        }
    
        if (this.tourmode === 2) {
            this.remaining--;
        }
    
        var me = player(src),
            spotsNow = this.tourSpots() + 1;
    
        this.TourBox(me + " left the tournament! <b>" + spotsNow + "</b> spots left!");
    
        if (this.tourmode === 2 && this.players[self].couplesid !== -1) {
            this.tourBattleEnd(this.tourOpponent(self.name()), self.name(), true);
        }
    
        delete this.players[self];
    
        if (objLength(this.couples) === 0 && this.tourmode === 2) {
            this.roundPairing();
        }
    };
    
    Tours.prototype.command_viewround = function (src, commandData, fullCommand) {
        if (this.tourmode !== 2) {
            botMessage(src, "You are unable to view the round because a tournament is not currently running or is in signing up phase.", this.id);
            return;
        }
    
        var chan = this.id;
    
        sys.sendMessage(src, "", chan);
        sys.sendHtmlMessage(src, style.header, chan);
        sys.sendMessage(src, "", chan);
    
        var battleHash = this.roundStatus,
            idleBattles = battleHash.idleBattles,
            ongoingBattles = battleHash.ongoingBattles,
            winLose = battleHash.winLose,
            anyFinishedBattles = !winLose.isEmpty(),
            x,
            curr;
    
        var roundInfoStr = "Round " + this.roundnumber;
        if (this.finals) {
            roundInfoStr = "Finals";
        }
    
        botMessage(src, roundInfoStr + " of " + this.tourtier + " tournament:", chan);
        if (anyFinishedBattles) {
            sys.sendMessage(src, "", chan);
            botMessage(src, "Battles finished", chan);
            sys.sendMessage(src, "", chan);
            for (x in winLose) {
                curr = winLose[x];
                botMessage(src, player(curr[0]) + " won against " + player(curr[1]), chan);
            }
    
            sys.sendMessage(src, "", chan);
        }
    
        if (!ongoingBattles.isEmpty()) {
            sys.sendMessage(src, "", chan);
            botMessage(src, "Ongoing battles:", chan);
            sys.sendMessage(src, "", chan);
            for (x in ongoingBattles) {
                curr = ongoingBattles[x];
                botMessage(src, player(curr[0]) + " VS " + player(curr[1]), chan);
            }
    
            sys.sendMessage(src, "", chan);
        }
    
        if (!idleBattles.isEmpty()) {
            sys.sendMessage(src, "", chan);
            botMessage(src, "Yet to start battles:", chan);
            sys.sendMessage(src, "", chan);
            for (x in idleBattles) {
                curr = idleBattles[x];
                botMessage(src, player(curr[0]) + " VS " + player(curr[1]), chan);
            }
            sys.sendMessage(src, "", chan);
        }
    
        if (anyFinishedBattles) {
            sys.sendMessage(src, "", chan);
            botMessage(src, "Players to the next round:", chan);
            sys.sendMessage(src, "", chan);
    
            var str = "";
            for (x in winLose) {
                str += player(winLose[x][0]) + ", ";
            }
    
            str = str.substr(0, str.lastIndexOf(","));
    
            botMessage(src, str, chan);
            sys.sendMessage(src, "", chan);
        }
    
        sys.sendMessage(src, "", chan);
        sys.sendHtmlMessage(src, style.footer, chan);
    };
    
    Tours.prototype.command_dq = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        if (this.tourmode === 0) {
            botMessage(src, "Wait until the tournament has started.", this.id);
            return;
        }
    
        var target = commandData.toLowerCase();
        if (!this.players.has(target)) {
            botMessage(src, "This player is not in the tournament.", this.id);
            return;
        }
    
        if (this.tourmode === 2) {
            this.remaining--;
        }
    
        this.TourBox(player(target) + " was removed from the tournament by " + player(src) + "!");
    
    
        if (this.tourmode === 2 && this.players[target].couplesid !== -1) {
            this.tourBattleEnd(this.tourOpponent(target.name()), target.name(), true);
        }
    
        delete this.players[target];
    };
    
    Tours.prototype.command_switch = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        var parts = commandData.split(':');
        parts[1] = parts[1].toLowerCase();
    
        if (!this.isInTourney(parts[0]) || sys.id(parts[1]) === undefined) {
            botMessage(src, "The players need to exist!", this.id);
            return;
        }
        if (!!this.isBattling(parts[0])) {
            botMessage(src, "You can't switch a battling player!", this.id);
            return;
        }
    
        var obj = this.players[parts[0].toLowerCase()],
            playerN = parts[0].name(),
            switchN = parts[1].name(),
            indexOfIdle = this.idleBattler(playerN),
            indexThingy,
            pNum;
    
        if (indexOfIdle !== false) {
            indexThingy = this.roundStatus.idleBattles[indexOfIdle];
            pNum = indexThingy[0] === playerN;
            delete this.roundStatus.idleBattlers[indexOfIdle];
            if (pNum) {
                this.roundStatus.idleBattlers[objLength(this.roundStatus.idleBattlers)] = [swittchN, indexThingy[1]];
            } else {
                this.roundStatus.idleBattlers[objLength(this.roundStatus.idleBattlers)] = [indexThingy[0], switchN];
            }
        }
    
        this.players[parts[1]] = obj;
        this.players[parts[1]].name = switchN;
        delete this.players[parts[0].toLowerCase()];
    
        var spots = this.tourSpots(),
            message = [player(parts[0]) + " was switched with " + player(parts[1]) + " by " + player(src) + "!"];
    
        if (this.tourmode === 1) {
            message.push("<b>" + spots + "</b> more " + s("spot", spots) + " left!");
        }
    
        this.TourBox(message);
    };
    
    Tours.prototype.command_push = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
        if (this.tourmode === 0) {
            botMessage(src, "Wait until the tournament has started.", this.id);
            return;
        }
    
        if (sys.dbIp(commandData) === undefined) {
            botMessage(src, "This person doesn't exist.", this.id);
            return;
        }
    
        if (this.tourmode === 2 && this.tagteam_tour()) {
            botMessage(src, "You cannot add players to a running tag team tour!", this.id);
            return;
        }
    
        var target = player(commandData);
        if (this.isInTourney(commandData.toLowerCase())) {
            botMessage(src, target + " is already in the tournament.", this.id);
            return;
        }
    
        if (this.tourmode === 2) {
            this.remaining++;
        }
    
        var name = commandData.name(),
            spots = this.tourSpots(),
            me = player(src),
            message = [target + " was added to the tournament by " + me + "!"];
    
        this.buildHash(name);
    
        if (this.tourmode === 1) {
            message.push("<b>" + spots + "</b> more " + s("spot", spots) + " left!");
        }
    
        this.TourBox(message);
    
        if (this.tourmode === 1 && spots === 0) {
            this.tourmode = 2;
            this.roundnumber = 0;
            this.roundPairing();
        }
    
        return;
    };
    
    Tours.prototype.command_cancelbattle = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
        if (this.tourmode !== 2) {
            botMessage(src, "Wait until a tournament starts", this.id);
            return;
        }
        var name = commandData.toLowerCase();
        if (!this.players.has(name)) {
            botMessage(src, "This player is not in the tournament", this.id);
            return;
        }
    
        var startername = name.name(),
            bIndex = this.isBattling(startername);
    
        if (bIndex === false) {
            botMessage(src, "Either this player is through the next round, or his/her battle hasn't begon yet.", this.id);
            return;
        }
    
        delete this.roundStatus.startedBattles[bIndex];
    
        var target = player(startername);
        this.TourBox(target + " can forfeit their battle and rematch now.");
        return;
    };
    
    Tours.prototype.command_tour = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
        if (this.tourmode > 0) {
            botMessage(src, "You are unable to start a tournament because one is still currently running.", this.id);
            return;
        }
    
        this.clearVariables();
    
        var mcmd = commandData.split(':');
        this.tournumber = parseInt(mcmd[1], 10);
    
        var cp = parseInt(mcmd[2], 10);
        if (this.identify(cp) === "Unknown Mode") {
            cp = 1; /* set to Single Elimination */
        }
    
        this.battlemode = cp;
    
        if (!this.tagteam_tour()) {
            if (isNaN(this.tournumber) || this.tournumber <= 2) {
                botMessage(src, "You must specify a tournament size of 3 or more.", this.id);
                return;
            }
        } else {
            if (isNaN(this.tournumber) || this.tournumber <= 3) {
                botMessage(src, "You must specify a tournament size of 4 or more.", this.id);
                return;
            }
    
            if (this.tournumber % 2 !== 0) {
                botMessage(src, "You must specify an even number of players for tag team tours. [4, 8, 12, ..]", this.id);
                return;
            }
        }
    
        if (this.tournumber > 150) {
            botMessage(src, "Having over 150 players would be impossible!", this.id);
            return;
        }
    
        var tierName = validTier(mcmd[0]);
        if (!tierName) {
            botMessage(src, "There does not seem to be a " + mcmd[0] + " tier.", this.id);
            return;
        }
    
        this.tourtier = tierName;
        mcmd[3] = cut(mcmd, 3, ':');
        this.prize = html_escape(mcmd[3]);
    
        if (isEmpty(this.prize)) {
            this.prize = "";
        }
    
        var m_name = sys.name(src);
    
        this.remaining = this.tournumber;
        this.tourmode = 1;
        this.startTime = +(sys.time());
        this.tourstarter = m_name;
    
        tourNotification(0, this.id, {
            "starter": m_name,
            "color": script.namecolor(src)
        });
    };
    
    Tours.prototype.command_changespots = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        if (this.tourmode !== 1) {
            botMessage(src, "You cannot change the number of spots because the tournament has passed the sign-up phase.", this.id);
            return;
        }
    
        var count = parseInt(commandData, 10);
        if (!this.tagteam_tour()) {
            if (isNaN(count) || count < 3) {
                botMessage(src, "You must specify a size of 3 or more.", this.id);
                return;
            }
        } else {
            if (isNaN(count) || count <= 3) {
                botMessage(src, "You must specify a size of 4 or more.", this.id);
                return;
            }
    
            if (count % 2 !== 0) {
                botMessage(src, "You must specify an even number of players for tag team tours. [4, 8, 12]", this.id);
                return;
            }
        }
    
        if (count < this.players.length()) {
            botMessage(src, "There are more than that people registered.", this.id);
            return;
        }
    
        this.tournumber = count;
        this.remaining = count;
    
        var spots = this.tourSpots(),
            me = player(src),
            message = [me + " changed the numbers of entrants to " + count + "!", "<b>" + spots + "</b> more " + s("spot", spots) + " left!"];
    
        this.TourBox(message);
    
        if (spots === 0) {
            this.tourmode = 2;
            this.roundnumber = 0;
            this.roundPairing();
        }
    
    };
    
    Tours.prototype.command_endtour = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        if (this.tourmode !== 0) {
            this.clearVariables();
    
            var me = player(src);
            this.TourBox("The tournament has been ended by " + me + "!");
            return;
        }
    
        botMessage(src, "No tournament is running.", this.id);
    };
    
    // Constants [t-const]
    Tours.blue = 0;
    Tours.red = 1;
    
    Tours.border = "<font color=blue><timestamp/><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB</b></font>";
    
    Tours.displays = {
        normal: 1,
        clean: 2
    };
    
    Tour.modes = {
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