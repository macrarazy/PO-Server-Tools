(function () {
    // This object holds tournament manipulation functions and constants
    Tours = {};
    
    /* !
    // Sends a tournament notification to a player
    // Also called by bots to notify a new tournament has started
    // info is an object and only used when called by a bot
    // Contains these properties:
    // name: Name of the bot.
    // color: Color of the bot.
    Tours.tourNotification = function tourNotification(src, chan, info) {
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
        
        // !No clean type
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
            // these are broadcasted by the bot [global].
            if (!Utils.isEmpty(tour.prize)) {
                prize = '<b style="color: brown;">Prize:</b> ' + tour.prize + '<br/>';
            }
            
            // !This is supposed to be an array
            Tours.tourBox("A Tournament was started by <b style='color:" + info.color + "'>" + Utils.escapeHtml(info.starter) + "</b>! <br/> <b style='color:red'>Players:</b> " + tour.entrants + " <br/> <b style='color: blue'>Type:</b> " + Tours.identify(tour) + " <br/> <b style='color: orange'>Tier:</b> " + tour.tier + " <br/> " + prize + " Type <b style='color:green'>/join</b> to join it!", chan);
        }
    }*/
    
    // Tours channel config.
    // Is a constructor, so should be initialized with new
    Tours.ToursChannelConfig = function ToursChannelConfig(id) {
        if (!(this instanceof ToursChannelConfig)) {
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
    };
    
    
    // Resets all tournament variables for a TCC.
    Tours.clearVariables = function clearVariables(tcc) {
        tcc.state = 0;
        tcc.starter = "";
        tcc.prize = "";
        tcc.round = 0;
        tcc.tier = "";
        tcc.entrants = 0;
        tcc.remaining = 0;
        tcc.finals = false;
        tcc.type = 0;

        tcc.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        tcc.couples = {};
        tcc.players = {};

        tcc.roundPlayers = 0;
        tcc.startTime = 0;
    };
    
    // Resets round tournament variables for a TCC.
    Tours.cleanRoundVariables = function cleanRoundVariables(tcc) {
        tcc.roundStatus = {
            idleBattles: {},
            ongoingBattles: {},
            winLose: {}
        };
    
        tcc.couples = {};
        tcc.roundPlayers = 0;
    };
    
    // Table for tour messages.
    Tours.tourBox = function tourBox(message, chan) {
        if (!Array.isArray(message)) {
            message = [message];
        }
        
        message = message.join('<br/>');
        sys.sendHtmlAll("<table><tr><td><center><hr width='300'>" + message + "<hr width='300'></center></td></tr></table>", chan);
    };
    
    // Sends a tourBox to a player
    Tours.tourBoxPlayer = function tourBoxPlayer(src, message, chan) {
        if (!Array.isArray(message)) {
            message = [message];
        }
        
        message = message.join('<br/>');
        sys.sendHtmlMessage(src, "<table><tr><td><center><hr width='300'>" + message + "<hr width='300'></center></td></tr></table>", chan);
    };
    
    /* !check */
    // Checks if a player has tour auth in the specified channel.
    Tours.hasTourAuth = function (id, channel) {
        var poUser = JSESSION.users(id),
            poChannel = JSESSION.channels(channel);
    
        return poChannel.tourAuth.hasOwnProperty(poUser.name.toLowerCase()) || poUser.megauser || poChannel.isChanMod(id);
    };
    
    // Identifies a tour's type.
    Tours.identify = function identify(type) {
        return Tours.modes[type] || "Unknown";
    };
    
    // Returns the amount of battles required before a player goes on to the next round.
    Tours.battlesRequired = function battlesRequired(mode) {
        return {
            1: 1,
            2: 2,
            3: 3,
            4: 1,
            5: 2,
            6: 3
        }[mode];
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
    
    // Constants
    // Teams
    Tours.blue = 0;
    Tours.red = 1;
    
    // Unused
    //Tours.border = "<font color=blue><timestamp/><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB</b></font>";
}());