/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys, exports, module*/

(function () {
    TourBox = function (message, chan) {
        sys.sendHtmlAll("<table><tr><td><center><hr width='300'>" + message + "<hr width='300'></center></td></tr></table>", chan);
    }
    
    TourNotification = function (src, chan, info) { // info is an object
        var tour = JSESSION.channels(chan).tour,
            mode = tour.tourmode;
    
        if (src != 0) {
            if (mode == 0) {
                return;
            }
    
            var white = function () {
                sys.sendMessage(src, "", chan);
            },
                border = function () {
                    sys.sendHtmlMessage(src, TOUR_BORDER, chan);
                },
                startTime = getTimeString(sys.time() * 1 - tour.startTime);
    
            white();
            border();
    
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=green>A Tournament was started by " + player(tour.tourstarter) + " " + startTime + " ago! </b></font>", chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=red>Players:</font></b> " + tour.tournumber, chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=blue>Type:</b></font> " + tour.identify(), chan);
            sys.sendHtmlMessage(src, "<timestamp/><b><font color=orange>Tier:</b></font> " + tour.tourtier, chan);
    
            if (!isEmpty(tour.prize)) {
                sys.sendHtmlMessage(src, "<timestamp/><b><font color=brown>Prize:</b></font> " + tour.prize, chan);
            }
    
            border();
    
            if (mode == 1) {
                sys.sendHtmlMessage(src, "<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>", chan);
            }
            else if (mode == 2) {
                var finalsStr = "";
                if (tour.finals) {
                    finalsStr = " (<B>Finals</B>)";
                }
    
                sys.sendHtmlMessage(src, "<timestamp/>Currently in round " + tour.roundnumber + finalsStr + ". " + tour.remaining + " players remaining.", chan);
    
            }
    
            border();
            white();
        } else {
            if (tour.TourDisplay == tour.Displays.Normal) {
                tour.white()
                tour.border();
                // TODO: Implement color support for bot.
                sys.sendHtmlAll("<timestamp/><b><font color=green>A Tournament was started by " + player(info.starter) + "! </b></font>", chan);
                sys.sendHtmlAll("<timestamp/><b><font color=red>Players:</font></b> " + tour.tournumber, chan);
                sys.sendHtmlAll("<timestamp/><b><font color=blue>Type:</b></font> " + tour.identify(), chan);
                sys.sendHtmlAll("<timestamp/><b><font color=orange>Tier:</b></font> " + tour.tourtier, chan);
                if (!isEmpty(tour.prize)) {
                    sys.sendHtmlAll("<timestamp/><b><font color=brown>Prize:</b></font> " + tour.prize, chan);
                }
                tour.border();
                sys.sendHtmlAll("<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>", chan);
                tour.border();
                tour.white()
            }
            else {
                var prize = '';
    
                if (!isEmpty(tour.prize)) {
                    prize = '<b style="color: brown;">Prize:</b> ' + tour.prize + '<br/>';
                }
    
                // Bots
                TourBox("A Tournament was started by <b style='color:" + info.color + "'>" + html_escape(info.starter) + "</b>! <br/> <b style='color:red'>Players:</b> " + tour.tournumber + " <br/> <b style='color: blue'>Type:</b> " + tour.identify() + " <br/> <b style='color: orange'>Tier:</b> " + tour.tourtier + " <br/> " + prize + " Type <b style='color:green'>/join</b> to join it!", chan);
            }
        }
    }
    
    function Tours(id) {
        this.id = id;
        this.tourmode = 0;
        this.tourstarter = "";
        this.prize = "";
        this.roundnumber = 0;
        this.tourtier = "";
        this.tournumber = 0;
        this.AutoStartBattles = false;
        this.remaining = 0;
        this.finals = false;
    
        this.battlemode = 0;
    
        this.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        this.couples = {};
        this.players = {};
        this.roundplayers = 0;
        this.startTime = 0;
        this.TourDisplay = 1;
    
        this.Displays = {
            Normal: 1,
            Clean: 2
        };
    }
    
    Tours.prototype.border = function () {
        sys.sendHtmlAll(TOUR_BORDER, this.id);
    }
    
    Tours.prototype.white = function () {
        sys.sendAll("", this.id);
    }
    
    Tours.prototype.hasTourAuth = function (id) {
        var poUser = JSESSION.users(id),
            poChannel = JSESSION.channels(this.id),
    
            return poChannel.tourAuth[poUser.lowername] != undefined || poUser.megauser || poChannel.isChanMod(id);
    }
    
    Tours.prototype.identify = function (test) {
        if (test == null) {
            test = this.battlemode;
        }
        if (test === 0) {
            return "No tournament is running.";
        }
        else if (test === 1) {
            return "Single Elimination";
        }
        else if (test === 2) {
            return "Double Elimination";
        }
        else if (test === 3) {
            return "Triple Elimination";
        }
        else if (test === 4) {
            return "Tag Team Single Elimination";
        }
        else if (test === 5) {
            return "Tag Team Double Elimination";
        }
        else if (test === 6) {
            return "Tag Team Triple Elimination";
        }
        else {
            return "Unknown Mode";
        }
    }
    
    Tours.prototype.sendAll = function (message) {
        botAll(message, this.id);
    }
    
    Tours.prototype.sendPM = function (src, message) {
        botMessage(src, message, this.id);
    }
    
    Tours.prototype.TourBox = function (message, Display) {
        var x, curr;
    
        if (typeof message == "string") {
            message = [message]; // Make it an array.
        }
    
        if (Display !== this.Displays.Normal && Display !== this.Displays.Clean) {
            Display = this.TourDisplay;
        }
    
        if (Display == this.Displays.Normal) {
            this.white();
            this.border();
            this.white();
    
            for (x in message) {
                curr = message[x];
                if (curr.isEmpty()) {
                    sys.sendAll("", this.id);
                } else {
                    this.sendAll(message[x]);
                }
            }
    
            this.white();
            this.border();
            this.white();
        } else { // this.Displays.Clean
            TourBox(message.join("<br/>"), this.id);
        }
    }
    
    Tours.prototype.idleBattler = function (name) {
        var hash = this.roundStatus.idleBattles,
            x, chash;
    
        for (x in hash) {
            chash = hash[x];
            if (chash[0] === name || chash[1] === name) {
                return x;
            }
        }
    
        return false;
    }
    
    Tours.prototype.isBattling = function (name) {
        var hash = this.roundStatus.ongoingBattles,
            x, chash;
    
        for (x in hash) {
            chash = hash[x];
            if (chash[0] === name || chash[1] === name) {
                return x;
            }
        }
    
        return false;
    }
    
    Tours.prototype.command_display = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        var num = parseInt(commandData);
        if (num !== 1 && num !== 2) {
            this.sendPM(src, "Valid tournament display modes are 1 (Normal) and 2 (Clean).");
            return;
        }
        if (this.TourDisplay === num) {
            this.sendPM(src, "The tournament display mode is already " + num + ".");
            return;
        }
    
        var me = player(src),
            mode = "Normal";
    
        if (num === this.Displays.Clean) {
            mode = "Clean";
        }
    
        this.TourBox(me + " changed the tournament display mode to " + mode + ".", num);
    
        this.TourDisplay = num;
    
        cData.changeTourOptions(this.id, num, this.AutoStartBattles);
    }
    
    Tours.prototype.command_autostartbattles = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        this.AutoStartBattles = !this.AutoStartBattles;
        var to_on = toOn(this.AutoStartBattles),
            me = player(src);
    
        this.TourBox(me + " turned auto start battles " + to_on + ".");
    
        cData.changeTourOptions(this.id, this.TourDisplay, this.AutoStartBattles);
    }
    
    Tours.prototype.command_tourprize = function (src, commandData, fullCommand) {
        if (this.tourmode == 0) {
            this.sendPM(src, "There is currently no tournament.");
            return;
        }
        if (isEmpty(this.prize)) {
            this.sendPM(src, "There is no prize.");
            return;
        }
    
        this.sendPM(src, "The tournament prize is: " + this.prize);
    }
    
    Tours.prototype.command_join = function (src, commandData, fullCommand) {
        if (this.tourmode != 1) {
            botMessage(src, "You are unable to join because a tournament is not currently running or has passed the signups phase.", this.id);
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
    
    
            if (spots == 0) {
                this.tourmode = 2;
                this.roundnumber = 0;
                this.roundPairing();
            }
            return;
        }
    
        botMessage(src, "There are no spots remaining.", this.id);
    }
    
    Tours.prototype.command_unjoin = function (src, commandData, fullCommand) {
        if (this.tourmode == 0) {
            botMessage(src, "Wait untill the tournament has started.", this.id);
            return;
        }
    
        var self = sys.name(src).toLowerCase();
        if (!this.players.has(self)) {
            botMessage(src, "You have not joined the tournament.", this.id);
            return;
        }
    
        if (this.tourmode == 2) {
            this.remaining--;
        }
    
        var me = player(src),
            spotsNow = this.tourSpots() + 1;
    
        this.TourBox(me + " left the tournament! <b>" + spotsNow + "</b> spots left!");
    
        if (this.tourmode == 2 && this.players[self].couplesid != -1) {
            this.tourBattleEnd(this.tourOpponent(self.name()), self.name(), true);
        }
    
        delete this.players[self];
    
        if (objLength(this.couples) == 0 && this.tourmode == 2) {
            this.roundPairing();
        }
    }
    
    Tours.prototype.command_viewround = function (src, commandData, fullCommand) {
        if (this.tourmode != 2) {
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
            x, curr;
    
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
    }
    
    Tours.prototype.command_dq = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        if (this.tourmode == 0) {
            botMessage(src, "Wait until the tournament has started.", this.id);
            return;
        }
    
        var target = commandData.toLowerCase();
        if (!this.players.has(target)) {
            botMessage(src, "This player is not in the tournament.", this.id);
            return;
        }
    
        if (this.tourmode == 2) {
            this.remaining--;
        }
    
        this.TourBox(player(target) + " was removed from the tournament by " + player(src) + "!");
    
    
        if (this.tourmode == 2 && this.players[target].couplesid != -1) {
            this.tourBattleEnd(this.tourOpponent(target.name()), target.name(), true);
        }
    
        delete this.players[target];
    }
    
    Tours.prototype.command_switch = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        var parts = commandData.split(':');
        parts[1] = parts[1].toLowerCase();
    
        if (!this.isInTourney(parts[0]) || sys.id(parts[1]) == undefined) {
            botMessage(src, "The players need to exist!", this.id);
            return;
        }
        if (this.ongoingTourneyBattle(parts[0])) {
            botMessage(src, "You can't switch a battling player!", this.id);
            return;
        }
    
        var obj = this.players[parts[0].toLowerCase()],
            playerN = parts[0].name(),
            switchN = parts[1].name(),
            indexOfIdle = this.idleBattler(playerN),
            indexThingy, pNum;
    
        if (indexOfIdle !== false) {
            indexThingy = this.roundStatus.idleBattles[indexOfIdle];
            pNum = indexThingy[0] == playerN;
            delete this.roundStatus.idleBattlers[indexOfIdle];
            if (pNum) {
                this.roundStatus.idleBattlers[objLength(this.roundStatus.idleBattlers)] = [swittchN, indexThingy[1]];
            }
            else {
                this.roundStatus.idleBattlers[objLength(this.roundStatus.idleBattlers)] = [indexThingy[0], switchN];
            }
        }
    
        this.players[parts[1]] = obj;
        this.players[parts[1]].name = switchN;
        delete this.players[parts[0].toLowerCase()];
    
        var spots = this.tourSpots(),
            message = [player(parts[0]) + " was switched with " + player(parts[1]) + " by " + player(src) + "!"];
    
        if (this.tourmode == 1) {
            message.push("<b>" + spots + "</b> more " + s("spot", spots) + " left!");
        }
    
        this.TourBox(message);
    }
    
    Tours.prototype.command_push = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
        if (this.tourmode == 0) {
            botMessage(src, "Wait until the tournament has started.", this.id);
            return;
        }
    
        if (sys.dbIp(commandData) == undefined) {
            botMessage(src, "This person doesn't exist.", this.id);
            return;
        }
    
        if (this.tourmode == 2 && this.tagteam_tour()) {
            botMessage(src, "You cannot add players to a running tag team tour!", this.id);
            return;
        }
    
        var target = player(commandData);
        if (this.isInTourney(commandData.toLowerCase())) {
            botMessage(src, target + " is already in the tournament.", this.id);
            return;
        }
    
        if (this.tourmode == 2) {
            this.remaining++;
        }
    
        var name = commandData.name(),
            spots = this.tourSpots(),
            me = player(src),
            message = [target + " was added to the tournament by " + me + "!"];
    
        this.buildHash(name);
    
        if (this.tourmode == 1) {
            message.push("<b>" + spots + "</b> more " + s("spot", spots) + " left!");
        }
    
        this.TourBox(message);
    
        if (this.tourmode == 1 && spots == 0) {
            this.tourmode = 2;
            this.roundnumber = 0;
            this.roundPairing();
        }
    
        return;
    }
    
    Tours.prototype.command_cancelbattle = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
        if (this.tourmode != 2) {
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
    }
    
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
        this.tournumber = parseInt(mcmd[1]);
    
        var cp = parseInt(mcmd[2]);
        if (this.identify(cp) == "Unknown Mode") {
            cp = 1; /* set to Single Elimination */
        }
    
        this.battlemode = cp;
    
        if (!this.tagteam_tour()) {
            if (isNaN(this.tournumber) || this.tournumber <= 2) {
                botMessage(src, "You must specify a tournament size of 3 or more.", this.id);
                return;
            }
        }
        else {
            if (isNaN(this.tournumber) || this.tournumber <= 3) {
                botMessage(src, "You must specify a tournament size of 4 or more.", this.id);
                return;
            }
    
            if (this.tournumber % 2 != 0) {
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
        this.startTime = sys.time() * 1;
        this.tourstarter = m_name;
    
        TourNotification(0, this.id, {
            "starter": m_name,
            "color": script.namecolor(src)
        });
    }
    
    Tours.prototype.command_changespots = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        if (this.tourmode != 1) {
            botMessage(src, "You cannot change the number of spots because the tournament has passed the sign-up phase.", this.id);
            return;
        }
    
        var count = parseInt(commandData);
        if (!this.tagteam_tour()) {
            if (isNaN(count) || count < 3) {
                botMessage(src, "You must specify a size of 3 or more.", this.id);
                return;
            }
        }
        else {
            if (isNaN(count) || count <= 3) {
                botMessage(src, "You must specify a size of 4 or more.", this.id);
                return;
            }
    
            if (count % 2 != 0) {
                botMessage(src, "You must specify an even number of players for tag team tours. [4, 8, 12]", this.id)
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
    
        if (spots == 0) {
            this.tourmode = 2;
            this.roundnumber = 0;
            this.roundPairing();
        }
    
    }
    
    Tours.prototype.command_endtour = function (src, commandData, fullCommand) {
        if (!this.hasTourAuth(src)) {
            noPermissionMessage(src, fullCommand, this.id);
            return;
        }
    
        if (this.tourmode != 0) {
            this.clearVariables();
    
            var me = player(src);
            this.TourBox("The tournament has been ended by " + me + "!");
            return;
        }
    
        botMessage(src, "No tournament is running.", this.id);
    }
    
    Tours.prototype.clearVariables = function () {
        this.tourmode = 0;
        this.tourstarter = "";
        this.prize = "";
        this.roundnumber = 0;
        this.tourtier = "";
        this.tournumber = 0;
        this.remaining = 0;
        this.finals = false;
    
        this.battlemode = 0;
    
        this.couples = {};
        this.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        this.winners = [];
        this.players = {};
        this.roundplayers = 0;
        this.startTime = 0;
    }
    
    Tours.prototype.cleanRoundVariables = function () {
        this.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        this.roundplayers = 0;
    }
    
    Tours.prototype.playerName = function (hash, hashno) {
        var x, now = 0;
        for (x in hash) {
            if (now == hashno) {
                return hash[x].name;
            }
            now++;
        }
    
        return "";
    }
    
    Tours.prototype.teamWin = function () {
        var b = this.Blue,
            r = this.Red,
            loser = "",
            winners = [],
            loseteam = -1;
    
        if (this.playersOfTeam(b) == 0) {
            loser = "Team Blue";
            winners = this.namesOfTeam(r);
            loseteam = b;
        }
        else if (this.playersOfTeam(r) == 0) {
            loser = "Team Red";
            winners = this.namesOfTeam(b);
            loseteam = r;
        }
    
        return {
            'winners': winners,
            'loser': loser,
            'losingteam': loseteam
        };
    }
    
    Tours.prototype.roundPairing = function () {
        if (this.roundnumber == 0 && this.tagteam_tour()) {
            this.buildTeams();
        }
    
        this.roundnumber++;
        this.cleanRoundVariables();
    
        if (this.players.length() === 1) {
            var winner = this.players.first().name,
                message = ["The winner of the " + this.tourtier + " tournament is " + winner + "!", "Congratulations, " + winner + ", on your success!"];
            if (!isEmpty(this.prize)) {
                message.push("", winner + " will receive the tournament prize: " + this.prize + "!");
            }
    
            this.TourBox(message);
    
            if (this.id == 0) {
                var name = winner.toLowerCase();
                if (sys.dbIp(name) == undefined) {
                    this.clearVariables();
                    return;
                }
                var nameId = sys.id(name),
                    money = DataHash.money;
                if (!money.has(name)) {
                    money[name] = 0;
                }
                var randNum = sys.rand(500, 1001);
                money[name] += randNum;
                cache.write("money", JSON.stringify(DataHash.money));
    
                if (nameId != undefined) {
                    botMessage(nameId, "You won " + randNum + " battle points!", this.id);
                }
            }
    
            this.clearVariables();
            return;
        }
    
        if (this.tagteam_tour()) { // TODO: Improve in 3.0
            var winners = this.teamWin();
            if (winners.winners.length != 0 && winners.loser != "" && winners.losingteam != -1) {
                // We have winners!
                var win = winners.winners.join(" and "),
                    message = ["The winners of the " + this.tourtier + " tournament are " + win + "!", "Congratulations, " + win + ", on your success!"];
    
                if (!isEmpty(this.prize)) {
                    message.push("", win + " will receive the tournament prize: " + this.prize + "!");
                }
    
                this.TourBox(message);
    
                if (this.id == 0) {
                    var z, ww = winners.winners,
                        name;
                    for (z in ww) {
                        name = ww[z];
                        if (sys.dbIp(name) == undefined) {
                            continue;
                        }
    
                        var nameId = sys.id(name),
                            money = DataHash.money;
                        if (money[name] == undefined) {
                            money[name] = 0;
                        }
                        var randNum = sys.rand(320, 751);
    
                        if (randNum < 350) {
                            randNum = sys.rand(330, 380); // Give some more points (most of the time)
                        }
    
                        money[name] += randNum;
                        cache.write("money", JSON.stringify(DataHash.money));
    
                        if (nameId != undefined) {
                            botMessage(nameId, "You won " + randNum + " battle points!", this.id);
                        }
                    }
                }
    
                this.clearVariables();
                return;
            }
        }
    
        var plr = this.players,
            x, message = [];
        for (x in plr) {
            if (plr[x] == "") {
                delete plr[x];
            }
        }
    
        this.finals = this.players.length() === 2;
        if (!this.finals) {
            message.push("Round " + this.roundnumber + " of the " + this.tourtier + " tournament:", "");
        }
        else {
            message.push("Finals of the " + this.tourtier + " tournament:", "");
        }
    
        var i = 0,
            x, p = this.players,
            tempplayers = new Object().extend(p),
            x1, name1, n1tl, x2, name2, n2tl, a, team1, team2;
    
        if (this.tagteam_tour()) {
            team = "<b><font color=blue>[Team Blue]</font></b>", team2 = "<b><font color=red>[Team Red]</font></b>";
        }
    
        else {
            team = "", team2 = "";
        }
    
        for (a in tempplayers) {
            if (tempplayers.length() === 1) {
                break;
            }
    
            if (!this.tagteam_tour()) {
                x1 = this.randomPlayer(tempplayers);
                name1 = this.playerName(tempplayers, x1);
                n1tl = name1.toLowerCase();
                delete tempplayers[n1tl];
    
                x2 = this.randomPlayer(tempplayers);
                name2 = this.playerName(tempplayers, x2);
                n2tl = name2.toLowerCase();
                delete tempplayers[n2tl];
    
            }
            else {
                x1 = this.randomPlayer(tempplayers, 0);
                name1 = this.playerName(tempplayers, x1);
                n1tl = name1.toLowerCase();
                delete tempplayers[n1tl];
    
                x2 = this.randomPlayer(tempplayers, 1);
                name2 = this.playerName(tempplayers, x2);
                n2tl = name2.toLowerCase();
                delete tempplayers[n2tl];
            }
    
            this.couples[i] = [name1, name2];
            this.players[n1tl].couplesid = i;
            this.players[n2tl].couplesid = i;
            this.players[n1tl].couplenum = 0;
            this.players[n2tl].couplenum = 1;
    
            if (!this.AutoStartBattles) {
                this.roundStatus.idleBattles[i] = [name1, name2];
            }
            i++;
    
            if (!this.finals) {
                message.push(i + ". " + team + name1 + " VS " + team2 + name2);
            }
            else {
                message.push(team + name1 + " VS " + team2 + name2);
            }
        }
    
        message.push("");
    
        if (tempplayers.length() > 0) {
            message.push(tempplayers.first().name + " is randomly selected to go to next round!", "");
        }
    
        this.TourBox(message);
    
        if (this.AutoStartBattles) {
            var tourInst = this;
            sys.quickCall(function () {
                var tour = tourInst,
                    t, p, op, meteams, oppteams, couples = tour.couples;
                for (t in couples) {
                    p = couples[t][0].toLowerCase(), op = couples[t][1].toLowerCase();
                    if (sys.id(p) !== undefined && sys.id(op) !== undefined) {
                        meteams = firstTeamForTier(sys.id(p), tour.tourtier);
                        oppteams = firstTeamForTier(sys.id(op), tour.tourtier);
                        if (meteams != -1 && oppteams != -1) {
                            if (!tour.ongoingTourneyBattle(p) && !tour.ongoingTourneyBattle(op)) {
                                sys.forceBattle(sys.id(p), sys.id(op), meteams, oppteams, sys.getClauses(tour.tourtier), 0, false);
                                tour.roundStatus.ongoingBattles[tour.roundStatus.ongoingBattles.length()] = [p.name(), op.name()];
                            }
                        }
                    }
                }
            }, 2500);
        }
    }
    
    Tours.prototype.isInTourney = function (name) {
        var name2 = name.toLowerCase();
        return this.players.has(name2);
    }
    
    Tours.prototype.isInTourneyId = function (id) {
        var name = sys.name(id).toLowerCase();
        return this.players.has(name);
    }
    
    Tours.prototype.tourOpponent = function (nam) {
        var name = nam.toLowerCase();
        if (this.players[name].couplesid == -1) {
            return "";
        }
        var namenum = this.players[name].couplenum,
            id = this.players[name].couplesid;
    
        if (namenum == 0) {
            namenum = 1;
        } else {
            namenum = 0;
        }
    
        return this.couples[id][namenum];
    }
    
    Tours.prototype.areOpponentsForTourBattle = function (src, dest) {
        return this.isInTourney(sys.name(src)) && this.isInTourney(sys.name(dest)) && this.tourOpponent(sys.name(src)).toLowerCase() == sys.name(dest).toLowerCase();
    }
    
    Tours.prototype.areOpponentsForTourBattle2 = function (src, dest) {
        return this.isInTourney(src) && this.isInTourney(dest) && this.tourOpponent(src).toLowerCase() == dest.toLowerCase();
    }
    
    Tours.prototype.ongoingTourneyBattle = function (name) {
        return this.isBattling(name.name());
    }
    
    Tours.prototype.afterBattleStarted = function (src, dest, clauses, rated, srcteam, destteam) {
        if (this.tourmode == 2) {
            if (this.areOpponentsForTourBattle(src, dest)) {
                var n1 = sys.name(src),
                    n2 = sys.name(dest);
                if (Config.NoCrash) {
                    if (sys.tier(src, srcteam) == sys.tier(dest, destteam) && cmp(sys.tier(src, srcteam), this.tourtier)) {
                        var idleBattleIndex = this.idleBattler(n1);
                        if (this.roundStatus.idleBattles[idleBattleIndex] != undefined) {
                            delete this.roundStatus.idleBattles[idleBattleIndex];
                            this.roundStatus.ongoingBattles[objLength(this.roundStatus.ongoingBattles)] = [n1, n2];
                        }
                        if (!this.finals) {
                            botAll("Round " + this.roundnumber + " tournament match between " + n1 + " and " + n2 + " has started!", this.id);
                        }
                        else {
                            botAll("Final round tournament match between " + n1 + " and " + n2 + " has started!", this.id);
                        }
                    } else {
                        botMessage(src, "Your or your opponents team does not match the tournament tier (the match is not official).");
                        botMessage(dest, "Your or your opponents team does not match the tournament tier (the match is not official).");
                    }
                } else {
                    var idleBattleIndex = this.idleBattler(n1);
                    if (this.roundStatus.idleBattles[idleBattleIndex] != undefined) {
                        delete this.roundStatus.idleBattles[idleBattleIndex];
                        this.roundStatus.ongoingBattles[objLength(this.roundStatus.ongoingBattles)] = [n1, n2];
                    }
                    if (!this.finals) {
                        botAll("Round " + this.roundnumber + " tournament match between " + n1 + " and " + n2 + " has started!", this.id);
                    }
                    else {
                        botAll("Final round tournament match between " + n1 + " and " + n2 + " has started!", this.id);
                    }
                }
            }
        }
    }
    
    Tours.prototype.tie = function (src, dest) {
        var s = sys.name(src),
            d = sys.name(dest),
            sTL = s.toLowerCase,
            dTL = d.toLowerCase(),
            me = player(src),
            target = player(dest);
    
        botAll(me + " and " + target + " tied and has to battle again for the tournament!", this.id);
    
        if (this.AutoStartBattles) {
            sys.forceBattle(src, dest, sys.getClauses(this.tourtier), 0, false);
        }
        else {
            var startedBattleIndex = this.isBattling(s);
            if (startedBattleIndex != false) {
                delete this.roundStatus.startedBattles[startedBattleIndex];
                this.roundStatus.idleBattles[objLength(this.roundStatus.idleBattles)] = [s, d];
            }
        }
    }
    
    Tours.prototype.afterBattleEnded = function (src, dest, desc) {
        if (this.tourmode != 2 || this.players.length() === 1) {
            return;
        }
    
        if (desc == "tie") {
            this.tie(src, dest);
            return;
        }
    
        this.tourBattleEnd(sys.name(src), sys.name(dest));
    }
    
    Tours.prototype.tourBattleEnd = function (src, dest, rush) {
        if ((!this.areOpponentsForTourBattle2(src, dest) || !this.ongoingTourneyBattle(src)) && !rush) {
            return;
        }
    
        var srcTL = src.toLowerCase(),
            destTL = dest.toLowerCase(),
            message = [];
    
        if (this.battlemode == 1 || this.battlemode == 4 || rush) {
            var stuff = this.roundStatus,
                stuffSBIndex = this.isBattling(src);
    
            stuff.winLose[objLength(stuff.winLose)] = [src, dest];
            if (stuffSBIndex !== false) {
                delete stuff.ongoingBattles[stuffSBIndex];
            }
    
            delete this.players[destTL];
            delete this.couples[this.players[srcTL].couplesid];
            this.players[srcTL].couplesid = -1;
            this.players[srcTL].couplenum = -1;
            this.players[srcTL].roundwins = 0;
            this.remaining--;
    
            message.push(src + " advances to the next round of the tournament.", dest + " is out of the tournament.");
    
            var couplesLen = this.couples.length();
            if (couplesLen > 0) {
                message.push("", couplesLen + " " + Grammar.s("battle", couplesLen) + " remaining.");
            } else {
                this.roundPairing();
            }
        }
        else if (this.battlemode == 2 || this.battlemode == 3 || this.battlemode == 5 || this.battlemode == 6) {
            this.players[srcTL].roundwins++;
    
            var winnums = this.players[srcTL].roundwins + this.players[destTL].roundwins,
                srcwin = this.players[srcTL].roundwins,
                destwin = this.players[destTL].roundwins,
                winner = '',
                loser = '',
                winnerTL = '',
                loserTL = '',
                tln = this.battlemode - winnums;
    
            if (winnums >= this.battlemode) {
                if (srcwin == destwin) {
                    this.tie();
                    return;
                }
    
                if (srcwin > destwin) {
                    winner = src;
                    winnerTL = src.toLowerCase();
                    loser = dest;
                    loserTL = dest.toLowerCase();
                }
                else {
                    winner = dest;
                    winnerTL = dest.toLowerCase();
                    loser = src;
                    loserTL = src.toLowerCase()
                }
    
                var stuff = this.roundStatus,
                    stuffSBIndex = this.isBattling(src),
                    winner = this.players[winnerTL];
    
                stuff.winLose[stuff.winLose.length()] = [src, dest];
                if (stuffSBIndex !== false) {
                    delete stuff.ongoingBattles[stuffSBIndex];
                }
    
                delete this.players[loserTL];
                delete this.couples[winner.couplesid];
                winner.couplesid = -1;
                winner.couplenum = -1;
                winner.roundwins = 0;
                this.remaining--;
    
                message.push(winner + " advances to the next round of the tournament.", loser + " is out of the tournament.");
    
                var couplesLen = this.couples.length();
                if (couplesLen > 0) {
                    message.push("", couplesLen + " " + Grammar.s("battle", couplesLen) + " remaining.");
                } else {
                    this.roundPairing();
                }
            }
            else {
                var sid = sys.id(src),
                    did = sys.id(dest);
    
                botMessage(sid, "Great job, you've won this round! You have won " + srcwin + "/" + tln + " rounds so far.", this.id);
                botMessage(did, "Sadly, you have lost this round. Try to win next round! You have won " + destwin + "/" + tln + " rounds so far.", this.id);
                sys.forceBattle(sid, did, sys.getClauses(this.tourtier), 0, false);
            }
        }
    
        this.TourBox(message);
    }
    
    Tours.prototype.tourSpots = function () {
        return this.tournumber - objLength(this.players);
    }
    
    Tours.prototype.randomPlayer = function (hash, team) {
        var ol = objLength(hash);
        if (ol == 1 || ol == 0) {
            return 0;
        }
        if (ol == 2) {
            return sys.rand(0, 2);
        }
        var rand = sys.rand(0, ol);
    
        if (!this.tagteam_tour()) {
            return rand;
        }
    
        var h = this.hashOf(hash, rand);
        if (h == undefined) {
            return "";
        }
    
        while (h.team != team) {
            rand = sys.rand(0, ol);
            h = this.hashOf(hash, rand);
        }
    
        return rand;
    }
    
    Tours.prototype.buildHash = function (src) {
        var name = sys.name(src);
        if (name == undefined) {
            name = src;
        }
    
    
        this.players[name.toLowerCase()] = {
            'name': name,
            'couplesid': -1,
            'couplenum': -1,
            'roundwins': 0,
            'team': -1
        };
    }
    
    Tours.prototype.tagteam_tour = function () {
        var b = this.battlemode;
        return b > 3 && b < 7;
    }
    
    Tours.prototype.buildTeams = function () {
        var p = this.players,
            y, team = 0,
            id;
        for (y in p) {
            p[y].team = team;
            id = sys.id(p[y].name);
            if (team == 0) {
                if (id != undefined) {
                    botMessage(id, "You are in Team Blue.", this.id);
                }
    
                team++;
            }
            else {
                if (id != undefined) {
                    botMessage(id, "You are in Team Red.", this.id);
                }
    
                team--;
            }
        }
    }
    
    Tours.prototype.playersOfTeam = function (team) {
        var y, p = this.players,
            ret = 0;
        for (y in p) {
            if (p[y].team == team) {
                ret++;
            }
        }
    
        return ret;
    }
    
    Tours.prototype.namesOfTeam = function (team) {
        var y, p = this.players,
            ret = [];
        for (y in p) {
            if (p[y].team == team) {
                ret.push(p[y].name);
            }
        }
    
        return ret;
    }
    
    Tours.prototype.totalPlayers = function () {
        return objLength(this.players);
    }
    
    Tours.prototype.hashOf = function (hash, num) {
        var y, i = 0;
        for (y in hash) {
            if (i == num) {
                return hash[y];
            }
            i++;
        }
    }
    
    Tours.prototype.Blue = 0;
    Tours.prototype.Red = 1;
    
    // exports Tours
    exports.Tours = Tours;
}());