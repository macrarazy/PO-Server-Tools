


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
        var channel = SESSION.channels(chan);

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
