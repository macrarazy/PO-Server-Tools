/*===========================================================*\
|| #               -Script Information-                    # ||
|| ######################################################### ||
|| #                                                       # ||
|| # Script:                                               # ||
|| # © TheUnknownOne                                       # ||
|| #                                                       # ||
|| # Credit:                                               # ||
|| # Lutra, Intel_iX                                       # ||
|| #                                                       # ||
|| # Special Thanks:                                       # ||
|| # Lamperi, Mystra                                       # ||
|| #                                                       # ||
|| # Script Version:                                       # ||
|| # 2.2.56                                                # ||
|| #                                                       # ||
|| # Server Requirements:                                  # ||
|| # 2.0.05                                                # ||
|| #                                                       # ||
|| ######################################################### ||
|| #                                                       # ||
|| # Default Styles and Rank Icons Credit:                 # ||
|| # Lutra, Intel_iX, person6445                           # ||
|| #                                                       # ||
|| ######################################################### ||
||                                                           ||
===============================================================
||                     Config Chart                          ||
===============================================================
|| DWAbilityCheck:                                           ||
|| true if you want to check for unreleased Dream World      ||
|| abilities.                                                ||
|| false if you don't.                                       ||
===============================================================
|| AutoChannelJoin:                                          ||
|| Automatically lets a player join all script defined       ||
|| if true. Not if false.                                    ||
===============================================================
|| WelcomeMessages:                                          ||
|| If the script should publicly welcome/goodbye people.     ||
|| true = yes. false = no                                    ||
===============================================================
|| FixChallenges:                                            ||
|| If you have issues with no challenges being sent, turn    ||
|| this on.                                                  ||
|| true = yes. false = no                                    ||
===============================================================
|| NoCrash:                                                  ||
|| This _can_ fix some crashes, but some things won't        ||
|| work anymore. Only use this when you have trouble with    ||
|| the server crashing.                                      ||
|| true = yes. false = no                                    ||
===============================================================
|| ClearLogsAt:                                              ||
|| If file size of logs.txt is higher than given size        ||
|| clears all data. Gets checked every hour. 0 = off         ||
||                                                           ||
|| To help find the bytes you need:                          ||
|| /eval botMessage(src, sTB(yournumberhere));               ||
|| Example: botMessage(src, sTB(1024*4)); (=4 kb)            ||
|| NOTE: Might lag. If the lag is a problem, make this 0.    ||
|| Clearing logs removes lag, so it's recommended!           ||
|| - NO LONGER WORKING ON POv2 (will be re-added when fixed) ||
===============================================================
|| HighPermission users:                                     ||
|| Can use commands with an higher auth level required.      ||
|| Specify the auth level too.                               ||
|| Format: [AuthLvlOfReceiver, AuthLvlReceived]              ||
\*===========================================================*/

EvaluationTimeStart = new Date().getTime(); /* Do not modify this! This is only to count load speed! */
ScriptVerData = ["2.2.56", ""];
ScriptURL = "https://raw.github.com/TheUnknownOne/PO-Server-Tools/master/scripts.js";
CommitDataURL = "http://github.com/api/v2/json/commits/list/TheUnknownOne/PO-Server-Tools/master/scripts.js";
IP_Resolve_URL = "http://ip2country.sourceforge.net/ip2c.php?ip=%1"; /* This URL will get formatted. %1 is the IP */

Config = {
    Mafia: {
        norepeat: 3,
        stats_file: "MafiaStats.txt",
    },

    DWAbilityCheck: true,
    AutoChannelJoin: true,
    WelcomeMessages: false,
    FixChallenges: false,
    NoCrash: false,

    ClearLogsAt: 36700160,
    // NO LONGER WORKING ON v2
    HighPermission: {
        "This gives Administrator Auth to a Moderator.": [1, 2],
        "Don't forget the commas and collons.": [1, 2]
    }
}

// Beyond this, you should not edit anything if you don't know what you're doing!
VERSION = function (v, data) {
    this.version = v;
    if (data == null || typeof data != "string") {
        data = "";
    }

    this.additionalData = data;
}

VERSION.prototype.toString = function () {
    return this.version + " " + this.additionalData;
}

ScriptVersion = new VERSION(ScriptVerData[0], ScriptVerData[1]);

/** RECOVERY **/
RECOVERY_BACKUP = {};

if (typeof script != "undefined") {
    for (var x in script) {
        RECOVERY_BACKUP[x] = script[x];
    }
    if (typeof x !== "undefined") {
        delete x;
    }
}

/** DEFAULT VALUES **/
if (typeof Bot == 'undefined') {
    Bot = {
        bot: "~Server~",
        botcolor: "red"
    }; // default
}

/*** BOTS ***/
botEscapeMessage = function (src, message, channel) {
    if (typeof Bot == 'undefined') {
        return;
    }

    var color = Bot.botcolor,
        name = Bot.bot;

    if (typeof channel != "undefined") {
        sys.sendHtmlMessage(src, "<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + html_escape(message), channel);
    }
    else {
        sys.sendHtmlMessage(src, "<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + html_escape(message));
    }
}

botMessage = function (src, message, channel) {
    if (typeof Bot == 'undefined') {
        return;
    }

    var color = Bot.botcolor,
        name = Bot.bot;

    if (typeof channel != "undefined") {
        sys.sendHtmlMessage(src, "<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message, channel);
    }
    else {
        sys.sendHtmlMessage(src, "<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message);
    }
}

botEscapeAll = function (message, channel) {
    if (typeof Bot == 'undefined') {
        return;
    }

    var color = Bot.botcolor,
        name = Bot.bot;

    if (typeof channel != "undefined") {
        sys.sendHtmlAll("<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + html_escape(message), channel);
    }
    else {
        sys.sendHtmlAll("<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + html_escape(message));
    }
}

botAll = function (message, channel) {
    if (typeof Bot == 'undefined') {
        return;
    }

    var color = Bot.botcolor,
        name = Bot.bot;

    if (typeof channel != "undefined") {
        sys.sendHtmlAll("<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message, channel);
    }
    else {
        sys.sendHtmlAll("<font color='" + color + "'><timestamp/><b>" + name + ":</i></b></font> " + message);
    }
}

teamAlert = function (src, team, message) {
    botMessage(src, "Team #" + (team + 1) + ": " + message);
}

/* Invalid Command Messages */
invalidCommandMessage = function (src, command, chan) {
    botEscapeMessage(src, "The command " + command + " doesn't exist.", chan);
}

noPermissionMessage = function (src, command, chan) {
    botEscapeMessage(src, "You may not use the " + command + " command.", chan);
}

FormatError = function (mess, e) {
    if (typeof mess != "string") {
        mess = "";
    }

    var lastChar = mess[mess.length - 1],
        lineData = "";
    if (mess != "" && lastChar !== "." && lastChar !== "!" && lastChar !== "?" && lastChar !== ":") {
        mess += ".";
    }

    if (typeof e.format !== 'undefined') { /* throw */
        return mess + " Custom Error: " + e;
    }

    if (e.lineNumber != 1) {
        lineData = " on line " + e.lineNumber;
    }

    var name = e.name,
        msg = e.message,
        str = name + lineData + ": " + msg,
        lastChar = msg[msg.length - 1];

    if (lastChar != "." && lastChar != "?" && lastChar != ":" && lastChar != "!") {
        str += ".";
    }

    return mess + " " + str;
}

ChannelLink = function (channel) {
    if (sys.channelId(channel) == undefined) {
        return "";
    }

    return "<a href='po:join/" + channel + "'>#" + channel + "</a>";
}

ChannelNames = function () {
    var channelIds = sys.channelIds(),
        channelNames = [],
        x;
    for (x in channelIds) {
        channelNames.push(sys.channel(channelIds[x]));
    }

    return channelNames;
}

addChannelLinks = function (str) {
    var channelNames = ChannelNames(),
        exp, i, nameslength = channelNames.length;

    for (i = 0; i < nameslength; i++) {
        exp = new RegExp("#" + channelNames[i], "gi");
        str = str.replace(exp, "<a href='po:join/" + channelNames[i] + "'>" + channelNames[i] + "</a>");
    }

    return str;
}

var capsMessage = function (mess) {
    return /[QWERTYUIOPASDFGHJKLZXCVBNM]/.test(mess);
}

var normalLetter = function (l) {
    return /[qwertyuiopasdfghjklzxcvbnm]/.test(l);
}

fileLen = function (file) {
    var f = sys.getFileContent(file).length;
    return f;
}

sTB = function (bytes) {
    var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (bytes == 0) {
        return '0 bytes';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) {
        return (bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

clearlogs = function () {
    return; // no longer working on v2
    var l = Config.ClearLogsAt;
    if (l == 0) {
        return;
    }

    try {
        var len = fileLen("logs.txt");
    }
    catch (e) { /* Linux */
        Config.ClearLogsAt = 0;
        return;
    }

    if (len > l) {
        botAll("Clearing logs.txt", 0);
        sys.writeToFile("logs.txt", "");
    }
}

function POUser(id) {
    var my_name = sys.name(id),
        mn_lc = my_name.toLowerCase();
    if (my_name == undefined) {
        return;
    }

    this.id = id;
    this.impersonation = undefined;
    this.ip = sys.ip(id);
    this.name = my_name;
    this.lowername = mn_lc;
    var date = sys.time() * 1;
    this.lastMsg = 0;
    this.loginTime = date;
    this.lastChallenge = 0;
    this.floodCount = 0;
    this.caps = 0;
    this.lastFuture = 0;
    this.isAutoAFK = false;
    this.teamChanges = 0;

    if (typeof DataHash == "undefined") { /* Shouldn't matter. */
        return;
    }

    var dh = DataHash;

    var d = dh.mutes;
    this.muted = d.hasOwnProperty(this.ip);

    this.megauser = dh.megausers.hasOwnProperty(mn_lc);

    var i = dh.rankicons;

    if (i.hasOwnProperty(mn_lc)) {
        this.icon = i[mn_lc];
    }

    i = dh.voices;
    this.voice = i.hasOwnProperty(mn_lc);

    i = dh.macros;
    this.macro = ["%m1", "%m2", "%m3", "%m4", "%m5"];

    if (i.hasOwnProperty(mn_lc)) {
        this.macro = i[mn_lc];
    }
}

/*
POUser.prototype.muteCheck = function () {
    if (DataHash.mutes == undefined) {
        return;
    }

    if (!DataHash.mutes.hasOwnProperty(this.ip) && this.muted == true) {
        this.muted = false;
    }
}
*/

POUser.prototype.addFlood = function () {
    if (typeof hpAuth == 'undefined' || hpAuth(this.id) < 1) {
        this.floodCount++;
        sys.callLater('JSESSION.users(' + this.id + ').floodCount--', 6);
    }
}

POUser.prototype.capsMute = function (message, channel) {
    if (typeof hpAuth != 'undefined' && hpAuth(this.id) > 0) {
        return false;
    }

    if (typeof AutoMute != 'undefined' && !AutoMute) {
        return false;
    }

    var newCapsAmount = 0;
    for (var z in message) {
        if (capsMessage(message[z])) {
            newCapsAmount += 1;
        }
        else {
            newCapsAmount -= 1;
        }
        if (newCapsAmount < 0) {
            newCapsAmount = 0;
        }
    }

    if (this.caps >= 70) {
        WatchPlayer(this.id, "CAPS Mute Message", message, channel);
        botAll(this.name + " was muted for 5 minutes for spamming caps!", channel);

        var bantime = 60 * 5;
        var thetime = sys.time() * 1 + bantime;

        DataHash.mutes[this.ip] = {
            by: Bot.bot + "</i>",
            why: "Spamming caps.",
            "ip": this.ip,
            time: thetime
        };
        cache.write("mutes", JSON.stringify(DataHash.mutes));

        this.caps = 0;
        this.muted = true;
        return true;
    }

    return false;
}

function POChannel(id) {
    this.name = sys.channel(id);
    this.id = id;

    this.chanAuth = {};
    this.tourAuth = {};
    this.creator = '';
    this.topic = 'Welcome to ' + this.name + '!';
    this.topicsetter = '';
    this.toursEnabled = false;

    if (typeof DefaultChannels != "undefined" && DefaultChannels.indexOf(id) != -1 || typeof DefaultChannels == "undefined") {
        this.perm = true;
        this.tour = new Tours(this.id);
        this.toursEnabled = true;
    }
    else {
        this.perm = false;
    }

    this.private = false;
    this.defaultTopic = true;
    this.silence = 0;

    this.banlist = {};
    this.mutelist = {};

}

POChannel.prototype.giveTourAuth = function (name) {
    var toLower = name.toLowerCase();

    if (this.tourAuth.has(toLower)) {
        return;
    }

    this.tourAuth[toLower] = {
        'name': name.name()
    };

    if (typeof cData == 'undefined') {
        return;
    }

    cData.changeTourAuth(this.id, this.tourAuth);
}

POChannel.prototype.takeTourAuth = function (name) {
    var toLower = name.toLowerCase();

    if (!this.tourAuth.has(toLower)) {
        return;
    }

    delete this.tourAuth[toLower];

    if (typeof cData == 'undefined') {
        return;
    }

    cData.changeTourAuth(this.id, this.tourAuth);
}

POChannel.prototype.changeTopic = function (src, topic, fullCommand) {
    if (isEmpty(topic)) {
        if (this.topic == '') {
            botMessage(src, "There is no topic.", this.id);
            return;
        }

        botEscapeMessage(src, "Topic: " + this.topic, this.id);

        if (this.topicsetter != '') {
            botEscapeMessage(src, "Set by: " + this.topicsetter, this.id)
        }

        if (this.defaultTopic) {
            botMessage(src, "This is a default topic.", this.id);
        }

        return;
    }

    if (!this.isChanMod(src)) {
        noPermissionMessage(src, fullCommand, this.id);
        return;
    }

    if (topic.toLowerCase() == "default") {
        this.topic = "Welcome to " + this.name + "!";
        this.defaultTopic = true;
        this.topicsetter = '';
        botAll("The topic was changed by " + sys.name(src) + " to: " + this.topic, this.id);
        return;
    }

    this.topic = topic;
    this.topicsetter = sys.name(src);
    this.defaultTopic = false;
    botAll("The topic was changed by " + sys.name(src) + " to: " + this.topic, this.id);
    return;
}

POChannel.prototype.changeAuth = function (name, newauth) {
    var nh;
    if (typeof name == "number") {
        nh = sys.name(name).toLowerCase();
    } else {
        nh = name.toLowerCase();
    }

    if (newauth == 0 && this.chanAuth.has(name)) {
        delete this.chanAuth[nh];
        return;
    }

    this.chanAuth[nh] = newauth;
}

POChannel.prototype.canIssue = function (src, tar) {
    if (typeof hpAuth == 'undefined') {
        return false;
    }

    var selfName = sys.name(src),
        targetName = sys.name(tar),
        srcID = src;

    if (typeof src == 'string') {
        selfName = src.toLowerCase();
        srcID = sys.id(src);
    }
    else {
        selfName = selfName.toLowerCase();
    }

    if (typeof tar == 'string') {
        targetName = tar.toLowerCase();
    }
    else {
        targetName = targetName.toLowerCase();
    }

    if (sys.dbIp(targetName) == undefined || sys.dbIp(selfName) == undefined) {
        return false;
    }

    if (hpAuth(src) <= hpAuth(tar) || srcID == undefined || this.chanAuth[selfName] <= this.chanAuth[targetName] && !this.isChanOwner(src)) {
        return false;
    }

    return true;
}

POChannel.prototype.isBannedInChannel = function (ip) {
    return this.banlist.has(ip);
}

POChannel.prototype.isMutedInChannel = function (ip) {
    return this.mutelist.has(ip);
}

POChannel.prototype.isChanMod = function (src) {
    var toLower = sys.name(src).toLowerCase();

    return this.chanAuth[toLower] >= 1 || sys.auth(src) >= 1;
}

POChannel.prototype.isChanAdmin = function (src) {
    var toLower = sys.name(src).toLowerCase();

    return this.chanAuth[toLower] >= 2 || sys.auth(src) >= 2;
}

POChannel.prototype.isChanOwner = function (src) {
    var toLower = sys.name(src).toLowerCase();

    return this.chanAuth[toLower] >= 3 || sys.auth(src) >= 3;
}

function POGlobal(id) {
    this.mafiaVersion = "";
}

JSESSIONInst = function () {
    this.UserData = {};
    this.ChannelData = {};
    this.GlobalData = {};

    this.UserFunc = function () {}
    this.ChannelFunc = function () {}
    this.GlobalFunc = function () {}

    this.UsesUser = false;
    this.UsesChannel = false;
    this.UsesGlobal = false;

    this.ScriptID = undefined;
}

JSESSIONInst.prototype.refill = function () {
    var x, users = sys.playerIds(),
        channels = sys.channelIds();

    if (this.UsesUser) {
        for (x in users) {
            if (this.users(users[x]) == undefined) {
                this.createUser(users[x]);
            }
        }
    }

    if (this.UsesChannel) {
        for (x in channels) {
            if (this.channels(channels[x]) == undefined) {
                this.createChannel(channels[x]);
            }
        }
    }

    if (this.UsesGlobal) {
        if (this.global() == undefined) {
            this.GlobalData = new this.GlobalFunc();
        }
    }
}

JSESSIONInst.prototype.users = function (id) {
    if (!this.UsesUser) {
        return;
    }

    if (typeof this.UserData[id] == 'undefined') {
        return;
    }

    return this.UserData[id];
}

JSESSIONInst.prototype.channels = function (id) {
    if (!this.UsesChannel) {
        return;
    }

    if (typeof this.ChannelData[id] == 'undefined') {
        return;
    }

    return this.ChannelData[id];
}

JSESSIONInst.prototype.global = function () {
    if (!this.UsesGlobal) {
        return;
    }

    if (typeof this.GlobalData == 'undefined') {
        return;
    }

    return this.GlobalData;
}

JSESSIONInst.prototype.identifyScriptAs = function (script) {
    if (this.ScriptID == undefined || this.ScriptID != script) {
        this.clearAll();
    }

    this.ScriptID = script;
    this.refill();
}

JSESSIONInst.prototype.registerUser = function (func) {
    if (typeof func != "function") {
        return;
    }

    this.UserFunc = func;
    this.UsesUser = true;
}

JSESSIONInst.prototype.registerChannel = function (func) {
    if (typeof func != "function") {
        return;
    }

    this.ChannelFunc = func;
    this.UsesChannel = true;
    this.createChannel(0);
}

JSESSIONInst.prototype.registerGlobal = function (func) {
    if (typeof func != "function") {
        return;
    }

    this.GlobalFunc = func;
    this.UsesGlobal = true;
    this.GlobalData = new func();
}

JSESSIONInst.prototype.createChannel = function (id) {
    if (!this.UsesChannel) {
        return false;
    }

    if (typeof this.ChannelData[id] != "undefined") {
        return false;
    }

    if (sys.channel(id) == undefined) {
        return false;
    }

    this.ChannelData[id] = new this.ChannelFunc(id);

    try {
        cData.loadDataFor(sys.channel(channels[x]));
    }
    catch (e) {}

    return true;
}

JSESSIONInst.prototype.destroyChannel = function (id) {
    if (!this.UsesChannel) {
        return false;
    }
    if (id == 0) {
        return false;
    }

    if (typeof this.ChannelData[id] == "undefined") {
        return false;
    }

    delete this.ChannelData[id];
    return true;
}

JSESSIONInst.prototype.createUser = function (id) {
    if (!this.UsesUser) {
        return false;
    }

    if (typeof this.UserData[id] != "undefined") {
        return false;
    }

    if (sys.name(id) == undefined) {
        return false;
    }

    this.UserData[id] = new this.UserFunc(id);
    return true;
}

JSESSIONInst.prototype.destroyUser = function (id) {
    if (!this.UsesUser) {
        return false;
    }
    if (typeof this.UserData[id] != "undefined") {
        return false;
    }
    if (sys.name(id) == undefined) {
        return false;
    }

    delete this.UserData[id];
    return true;
}

JSESSIONInst.prototype.clearAll = function () {
    this.UserData = {};
    this.ChannelData = {};
    this.GlobalData = {};

    this.UserFunc = function () {}
    this.ChannelFunc = function () {}
    this.GlobalFunc = function () {}

    this.UsesUser = false;
    this.UsesChannel = false;
    this.UsesGlobal = false;

    this.ScriptID = undefined;
}

if (typeof JSESSION == 'undefined') {
    // Otherwise will reset user/channel data every script load.
    JSESSION = new JSESSIONInst();
}

cut = function (array, entry, join) {
    if (!join) {
        join = "";
    }

    if (!Array.isArray(array)) {
        return array;
    }

    return array.splice(entry).join(join);
}

firstTeamForTier = function (id, tier) {
    if (Config.NoCrash) {
        return 0;
    }

    var ttl = tier.toLowerCase(),
        x;

    for (x = 0; x < sys.teamCount(id); x++) {
        if (sys.tier(id, x).toLowerCase() == ttl) {
            return x;
        }
    }

    return -1;
}

hasTeam = function (id, tier) {
    if (!tier) {
        return sys.teamCount(id) != 0;
    }

    return sys.hasTier(id, tier);
}

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

        sys.sendHtmlMessage(src, "<timestamp/><b><font color=green>A Tournament was started by " + tour.tourstarter + " " + startTime + " ago! </b></font>", chan);
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
            var finalsSTr = "";
            if (tour.finals) {
                finalsStr = " (<B>Finals</B>)";
            }

            sys.sendHtmlMessage(src, "<timestamp/>Currently in round " + tour.roundnumber + finalsStr + ". " + tour.remaining + " players remaining.", chan);

        }

        border();
        white();
    } else {
        if (TourDisplay == 1) {
            tour.white()
            tour.border();
            sys.sendHtmlAll("<timestamp/><b><font color=green>A Tournament was started by " + info.starter + "! </b></font>", chan);
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

            TourBox("A Tournament was started by <b style='color:" + info.color + "'>" + info.starter + "</b>! <br/> <b style='color:red'>Players:</b> " + tour.tournumber + " <br/> <b style='color: blue'>Type:</b> " + tour.identify() + " <br/> <b style='color: orange'>Tier:</b> " + tour.tourtier + " <br/> " + prize + " Type <b style='color:green'>/join</b> to join it!", chan);
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

    this.roundStatus = this.roundStatusGenerate();
    this.couples = {};
    this.players = {};
    this.roundplayers = 0;
    this.startTime = 0;
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
        test = function () {
            if (noPermission) {
                return !noPermission(id, 1);
            }

            return sys.auth(id) > 0;
        }

        return poChannel.tourAuth[poUser.lowername] != undefined || test() || poUser.megauser || poChannel.isChanMod(id);
}

Tours.prototype.roundStatusGenerate = function () {
    var rethash = {
        'winLose': {},
        'idleBattles': {},
        'ongoingBattles': {}
    };

    return rethash;
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

Tours.prototype.TourBox = function (message) {
    TourBox(message, this.id);
}

Tours.prototype.command_autostartbattles = function (src, commandData, fullCommand) {
    if (!this.hasTourAuth(src)) {
        noPermissionMessage(src, fullCommand, this.id);
        return;
    }

    var cmdlc = commandData.toLowerCase();
    if (cmdlc != 'on' && cmdlc != 'off') {
        botMessage(src, "Pick either on or off.", this.id);
        return;
    }

    if (cmdlc == 'on' && !this.AutoStartBattles) {
        if (TourDisplay == 1) {
            this.border();
            this.white();
            botEscapeAll(sys.name(src) + " turned auto start battles on.", this.id);
            this.white();
            this.border();
        }
        else {
            this.TourBox("<b style='color: " + script.namecolor(src) + "'>" + html_escape(sys.name(src)) + "</b> turned auto start battles on.");
        }
        this.AutoStartBattles = true;
        return;
    }

    if (cmdlc == 'off' && this.AutoStartBattles) {
        if (TourDisplay == 1) {
            this.border();
            this.white();
            botEscapeAll(sys.name(src) + " turned auto start battles off.", this.id);
            this.white();
            this.border();
            this.AutoStartBattles = false;
        }
        else {
            this.TourBox("<b style='color: " + script.namecolor(src) + "'>" + html_escape(sys.name(src)) + "</b> turned auto start battles off.");
            this.AutoStartBattles = false;
        }
        return;
    }

    botMessage(src, "Auto Start Battles is already " + cmdlc, this.id);
    return;
}

Tours.prototype.command_tourprize = function (src, commandData, fullCommand) {
    if (this.tourmode == 0) {
        botMessage(src, "There is currently no tournament.", this.id);
        return;
    }
    if (isEmpty(this.prize)) {
        botMessage(src, "No tournament prize.", this.id);
        return;
    }
    botMessage(src, "The tournament prize is: " + this.prize, this.id);
    return;
}

Tours.prototype.command_join = function (src, commandData, fullCommand) {
    if (this.tourmode != 1) {
        botMessage(src, "You are unable to join because a tournament is not currently running or has passed the signups phase.", this.id);
        return;
    }
    var name = sys.name(src).toLowerCase();
    if (this.players[name] != undefined) {
        botMessage(src, "You are already in the tournament. You are not able to join more than once.", this.id);
        return;
    }
    if (!hasTeam(src, this.tourtier)) {
        botMessage(src, "You don't have a team for the " + this.tourtier + " tier. Load or make one to join.", this.id);
        return;
    }

    if (this.tourSpots() > 0) {
        this.buildHash(src);

        if (TourDisplay == 1) {
            botEscapeAll(sys.name(src) + " joined the tournament! " + this.tourSpots() + " more spot(s) left!", this.id);
        } else {
            this.TourBox("<b style='color: " + script.namecolor(src) + "'>" + html_escape(sys.name(src)) + "</b> joined the tournament! <b>" + this.tourSpots() + "</b> more spot(s) left!");
        }

        if (this.tourSpots() == 0) {
            this.tourmode = 2;
            this.roundnumber = 0;
            this.roundPairing();
        }
        return;
    }
    botMessage(src, "There are no spots remaining.", this.id);
    return;
}

Tours.prototype.command_unjoin = function (src, commandData, fullCommand) {
    if (this.tourmode == 0) {
        botMessage(src, "Wait untill the tournament has started.", this.id);
        return;
    }

    var name2 = sys.name(src).toLowerCase();
    if (this.players[name2] == undefined) {
        botMessage(src, "You have not joined the tournament.", this.id);
        return;
    }

    if (this.tourmode == 2) {
        this.remaining--;
    }

    if (TourDisplay == 1) {
        botEscapeAll(sys.name(src) + " left the tournament " + (this.tourSpots() + 1) + " spots left!", this.id);
    } else {
        this.TourBox("<b style='color: " + script.namecolor(src) + "'>" + html_escape(sys.name(src)) + "</b> left the tournament! <b>" + (this.tourSpots() + 1) + "</b> spots left!");
    }

    if (this.tourmode == 2 && this.players[name2].couplesid != -1) {
        this.tourBattleEnd(this.tourOpponent(name2.name()), name2.name(), true);
    }

    delete this.players[name2];

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
        anyFinishedBattles = objLength(winLose) > 0,
        x;

    var roundInfoStr = "Round " + this.roundnumber;
    if (this.finals) {
        roundInfoStr = "Finals";
    }

    botMessage(src, roundInfoStr + " " + this.tourtier + " tournament:", chan);
    if (anyFinishedBattles) {
        sys.sendMessage(src, "", chan);
        botMessage(src, "Battles finished", chan);
        sys.sendMessage(src, "", chan);
        for (x in winLose) {
            botMessage(src, html_escape(winLose[x][0]) + " won against " + html_escape(winLose[x][1]), chan);
        }

        sys.sendMessage(src, "", chan);
    }

    if (objLength(ongoingBattles) > 0) {
        sys.sendMessage(src, "", chan);
        botMessage(src, "Ongoing battles:", chan);
        sys.sendMessage(src, "", chan);
        for (x in ongoingBattles) {
            botMessage(src, html_escape(ongoingBattles[x][0]) + " VS " + html_escape(ongoingBattles[x][1]), chan);
        }

        sys.sendMessage(src, "", chan);
    }

    if (objLength(idleBattles) > 0) {
        sys.sendMessage(src, "", chan);
        botMessage(src, "Yet to start battles:", chan);
        sys.sendMessage(src, "", chan);
        for (x in idleBattles) {
            botMessage(src, html_escape(idleBattles[x][0]) + " VS " + html_escape(idleBattles[x][1]), chan);
        }
        sys.sendMessage(src, "", chan);
    }

    if (anyFinishedBattles) {
        sys.sendMessage(src, "", chan);
        botMessage(src, "Players to the next round:", chan);
        sys.sendMessage(src, "", chan);

        var str = "";
        for (x in winLose) {
            str += winLose[x][0] + ", ";
        }

        str = str.substr(0, str.lastIndexOf(","));

        botMessage(src, str, chan);
        sys.sendMessage(src, "", chan);
    }

    sys.sendMessage(src, "", chan);
    sys.sendHtmlMessage(src, style.footer, chan);
    return;
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
    var name2 = commandData.toLowerCase();
    if (!this.players[name2]) {
        botMessage(src, "This player is not in the tournament.", this.id);
        return;
    }

    if (this.tourmode == 2) {
        this.remaining--;
    }

    if (TourDisplay == 1) {
        this.border();
        this.white();
        botEscapeAll(commandData.name() + " was removed from the tournament by " + sys.name(src) + "!", this.id);
        this.white();
        this.border();
    }
    else {
        this.TourBox("<b style='color: " + script.namecolor(sys.id(commandData)) + "'>" + commandData.name() + "</b> was removed from the tournament by <b style='color:" + script.namecolor(src) + "'>" + sys.name(src) + "</b>!");
    }


    if (this.tourmode == 2 && this.players[name2].couplesid != -1) {
        this.tourBattleEnd(this.tourOpponent(name2.name()), name2.name(), true);
    }

    delete this.players[name2];
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

    if (TourDisplay == 1) {
        this.border();
        this.white();
        botEscapeAll(parts[0] + " was switched with " + parts[1] + " by " + sys.name(src) + "!", this.id);
        if (this.tourmode == 1) {
            botEscapeAll(this.tourSpots() + " more spot(s) left!", this.id);
        }
        this.white();
        this.border();
    }
    else {
        parts = parts.map(function (pname) {
            return '<b style="color: ' + script.namecolor(sys.id(pname)) + '">' + pname.name() + '</b>';
        });

        var spots = '';
        if (this.tourmode == 1) {
            spots = "<br><b>" + this.tourSpots() + "</b> more spot(s) left!";
        }

        this.TourBox(parts[0] + " was switched with " + parts[1] + " by <b style='color: " + script.namecolor(src) + "'>" + sys.name(src) + "</b>!" + spots);
    }
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

    if (this.tourmode == 2 && this.tagteam_tour()) {
        botMessage(src, "You cannot add players to a running tag team tour!", this.id);
        return;
    }

    if (this.isInTourney(commandData.toLowerCase())) {
        botMessage(src, commandData + " is already in the tournament.", this.id);
        return;
    }
    if (sys.dbIp(commandData) == undefined) {
        botMessage(src, "This person doesn't exist.", this.id);
        return;
    }

    if (this.tourmode == 2) {
        this.remaining++;
    }

    var name = commandData.name();
    this.buildHash(name);

    if (TourDisplay == 1) {
        this.border();
        this.white();
        botEscapeAll(commandData + " was added to the Tournament by " + sys.name(src) + "!", this.id);
        if (this.tourmode == 1) {
            botEscapeAll(this.tourSpots() + " more spot(s) left!", this.id);
        }
        this.white();
        this.border();
    }
    else {
        var spots = "";

        if (this.tourmode == 1) {
            spots = "<br/><b>" + this.tourSpots() + "</b> more spot(s) left!";
        }

        this.TourBox("<b style='color:" + script.namecolor(sys.id(commandData)) + "'>" + name + "</b> was added to the tournament by <b style='color: " + script.namecolor(src) + "'>" + sys.name(src) + "</b>!" + spots);
    }

    if (this.tourmode == 1 && this.tourSpots() == 0) {
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
    if (this.players[name] == undefined) {
        botMessage(src, "This player is not in the tournament", this.id);
        return;
    }
    var startername = name.name();
    var bIndex = this.isBattling(startername);

    if (bIndex === false) {
        botMessage(src, "Either this player is through the next round, or his/her battle hasn't begon yet.", this.id);
        return;
    }

    delete this.roundStatus.startedBattles[bIndex];

    if (TourDisplay == 1) {
        this.border();
        this.white();
        botEscapeAll(startername + " can forfeit their battle and rematch now.", this.id);
        this.white();
        this.border();
    }
    else {
        this.TourBox("<b style='color: " + script.namecolor(sys.id(startername)) + "'>" + startername + "</b> can forfeit their battle and rematch now.");
    }
    return;
}

Tours.prototype.command_tour = function (src, commandData, fullCommand) {
    if (!this.hasTourAuth(src)) {
        noPermissionMessage(src, fullCommand, this.id);
        return;
    }
    if (typeof(this.tourmode) != "undefined" && this.tourmode > 0) {
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

    if (count < objLength(this.players)) {
        botMessage(src, "There are more than that people registered.", this.id);
        return;
    }
    this.tournumber = count;

    if (TourDisplay == 1) {
        this.border();
        this.white();
        botEscapeAll(sys.name(src) + " changed the numbers of entrants to " + count + "!", this.id);
        botEscapeAll(this.tourSpots() + " more spot(s) left!", this.id);
        this.white();
        this.border();
    }
    else {
        this.TourBox("<b style='color: " + script.namecolor(src) + "'>" + sys.name(src) + "</b> changed the numbers of entrants to " + count + "!<br/><b>" + this.tourSpots() + "</b> more spot(s) left!");
    }

    if (this.tourSpots() == 0) {
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

        if (TourDisplay == 1) {
            this.border();
            this.white();
            botAll("The tournament has been ended by " + sys.name(src) + "!", this.id);
            this.white();
            this.border();
        }
        else {
            this.TourBox("The tournament has been ended by <b style='color: " + script.namecolor(src) + "'>" + sys.name(src) + "</b>!");
        }
        return;
    }

    botMessage(src, "You are unable to end the tournament because it is not currently running.", this.id);
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
    this.roundStatus = this.roundStatusGenerate();
    this.winners = [];
    this.players = {};
    this.roundplayers = 0;
    this.startTime = 0;
}

Tours.prototype.cleanRoundVariables = function () {
    this.roundStatus = this.roundStatusGenerate();
    this.roundplayers = 0;
}

Tours.prototype.playerName = function (hash, hashno) {
    var x, now = 0;
    for (x in hash) {
        if (now == hashno) return hash[x].name;
        else now++;
    }

    return '';
}

Tours.prototype.first = function (hash) {
    var x;
    for (x in hash)
    return hash[x];
}

Tours.prototype.teamWin = function () {
    var b = this.Blue;
    var r = this.Red;
    var loser = "";
    var winners = [];
    var loseteam = -1;

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
    if (this.roundnumber == 0 && this.tagteam_tour()) this.buildTeams();

    this.roundnumber++;
    this.cleanRoundVariables();

    if (objLength(this.players) == 1) {
        this.border();
        this.white();
        var winner = this.first(this.players).name;
        botAll("The winner of the " + this.tourtier + " Tournament is " + winner + "!", this.id);
        botAll("Congratulations, " + winner + ", on your success! ", this.id);
        if (typeof this.prize != "undefined") {
            if (!isEmpty(this.prize)) {
                botAll(winner + " will receive the tournament prize: " + this.prize + "!", this.id);
            }
        }
        this.white();
        this.border();

        if (this.id == 0) {
            var name = winner.toLowerCase();
            if (sys.dbIp(name) == undefined) {
                this.clearVariables();
                return;
            }
            var nameId = sys.id(name);
            var money = DataHash.money;
            if (money[name] == undefined) {
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

    if (this.tagteam_tour()) {
        var winners = this.teamWin();
        if (winners.winners.length != 0 && winners.loser != "" && winners.losingteam != -1) {
            // We have winners!
            var win = winners.winners.join(" and ");
            this.border();
            this.white();
            botAll("The winners of the " + this.tourtier + " Tournament are " + win + "!", this.id);
            botAll("Congratulations, " + win + ", on your success! ", this.id);
            if (typeof this.prize != "undefined") {
                if (!isEmpty(this.prize)) {
                    botAll(win + " will receive the tournament prize: " + this.prize + "!", this.id);
                }
            }
            this.white();
            this.border();

            if (this.id == 0) {
                var z, ww = winners.winners,
                    name;
                for (z in ww) {
                    name = ww[z];
                    if (sys.dbIp(name) == undefined) {
                        continue;
                    }

                    var nameId = sys.id(name);
                    var money = DataHash.money;
                    if (money[name] == undefined) {
                        money[name] = 0;
                    }
                    var randNum = sys.rand(500, 1001);
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
        x;
    for (x in plr) {
        if (plr[x] == "") delete plr[x];
    }

    this.finals = objLength(this.players) == 2;
    if (!this.finals) {
        this.border();
        this.white();
        botAll("Round " + this.roundnumber + " of the " + this.tourtier + " Tournament", this.id);
    }
    else {
        this.border();
        this.white();
        botAll("Finals of the " + this.tourtier + " Tournament", this.id);
    }

    this.white();
    var i = 0;
    var tempplayers = {},
        x, p = this.players;
    var x1, name1, n1tl, x2, name2, n2tl;

    for (x in p)
    tempplayers[x] = p[x];

    var a;

    if (this.tagteam_tour()) {
        var team = "<b><font color=blue>[Team Blue]</font></b>",
            team2 = "<b><font color=red>[Team Red]</font></b>";
    }

    else {
        var team = "",
            team2 = "";
    }

    for (a in tempplayers) {
        if (objLength(tempplayers) == 1) {
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

        if (!this.finals) botAll(i + ". " + team + name1 + " VS " + team2 + name2, this.id);
        else botAll(team + name1 + " VS " + team2 + name2, this.id);
    }

    this.white();
    if (objLength(tempplayers) > 0) {
        botAll(this.first(tempplayers).name + " is randomly selected to go to next round!", this.id);
        this.white();
    }

    this.border();
    this.white();
    if (this.AutoStartBattles) {
        var t, p, op, meteams, oppteams;
        for (t in this.couples) {
            p = this.couples[t][0].toLowerCase(), op = this.couples[t][1].toLowerCase();
            if (sys.id(p) !== undefined && sys.id(op) !== undefined) {
                meteams = firstTeamFor(sys.id(p), this.tourtier);
                oppteams = firstTeamFor(sys.id(op), tourtier);
                if (meteams != -1 && oppteams != -1) {
                    if (!this.ongoingTourneyBattle(p) && !this.ongoingTourneyBattle(op)) {
                        sys.forceBattle(sys.id(p), sys.id(op), meteams, oppteams, sys.getClauses(this.tourtier), 0, false);
                        this.roundStatus.ongoingBattles[objLength(this.roundStatus.ongoingBattles)] = [p.name(), op.name()];
                    }
                }
            }
        }
    }
}

Tours.prototype.isInTourney = function (name) {
    var name2 = name.toLowerCase();
    return name2 in this.players;
}

Tours.prototype.isInTourneyId = function (id) {
    var name = sys.name(id).toLowerCase();
    return name in this.players;
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

    var opp = this.couples[id][namenum];
    return opp;
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
                        botAll("Round " + this.roundnumber + " Tournament match between " + n1 + " and " + n2 + " has started!", this.id);
                    }
                    else {
                        botAll("Final Round Tournament match between " + n1 + " and " + n2 + " has started!", this.id);
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
                    botAll("Round " + this.roundnumber + " Tournament match between " + n1 + " and " + n2 + " has started!", this.id);
                }
                else {
                    botAll("Final Round Tournament match between " + n1 + " and " + n2 + " has started!", this.id);
                }
            }
        }
    }
}

Tours.prototype.tie = function (src, dest) {
    var s = sys.name(src),
        d = sys.name(dest);
    var sTL = s.toLowerCase,
        dTL = d.toLowerCase();
    botAll(s + " and " + d + " tied and has to battle again for the Tournament!</font></b>", this.id);
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
    if (this.tourmode != 2) return;
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

    var srcTL = src.toLowerCase();
    var destTL = dest.toLowerCase();

    if (this.battlemode == 1 || this.battlemode == 4 || rush) {
        var stuff = this.roundStatus;
        var stuffSBIndex = this.isBattling(src);
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

        this.border();
        this.white();
        botAll(src + " advances to the next round of the Tournament.", this.id);
        botAll(dest + " is out of the Tournament.", this.id);
        this.white();

        if (objLength(this.couples) > 0) {
            botAll(objLength(this.couples) + " battle(s) remaining.", this.id);
            this.white();
            this.border();
            return;
        }
        this.border();
        this.white();
        this.roundPairing();
    }
    else if (this.battlemode == 2 || this.battlemode == 3 || this.battlemode == 5 || this.battlemode == 6) {
        this.players[srcTL].roundwins++;
        var winnums = this.players[srcTL].roundwins + this.players[destTL].roundwins;
        var srcwin = this.players[srcTL].roundwins;
        var destwin = this.players[destTL].roundwins;
        var winner = '',
            loser = '',
            winnerTL = '',
            loserTL = '';
        var tln = this.battlemode - winnums;

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

            var stuff = this.roundStatus;
            var stuffSBIndex = this.isBattling(src);

            stuff.winLose[objLength(stuff.winLose)] = [src, dest];
            if (stuffSBIndex !== false) {
                delete stuff.ongoingBattles[stuffSBIndex];
            }
            delete this.players[loserTL];
            delete this.couples[this.players[winnerTL].couplesid];
            this.players[winnerTL].couplesid = -1;
            this.players[winnerTL].couplenum = -1;
            this.players[winnerTL].roundwins = 0;
            this.remaining--;

            this.border();
            this.white();
            botAll(winner + " advances to the next round of the Tournament.", this.id);
            botAll(loser + " is out of the Tournament.", this.id);
            this.white();

            if (objLength(this.couples) > 0) {
                botAll(objLength(this.couples) + " battle(s) remaining.", this.id);
                this.white();
                this.border();
                return;
            }
            this.border();
            this.white();
            this.roundPairing();
        }
        else {
            var sid = sys.id(src);
            var did = sys.id(dest);
            botMessage(sid, "Great job, you've won this round! You have won " + srcwin + "/" + tln + " rounds so far.", this.id);
            botMessage(did, "Sadly, you have lost this round. Try to win next round! You have won " + srcwin + "/" + tln + " rounds so far.", this.id);
            sys.forceBattle(sid, did, sys.getClauses(this.tourtier), 0, false);
        }
    }
}

Tours.prototype.tourSpots = function () {
    return this.tournumber - objLength(this.players);
}

Tours.prototype.randomPlayer = function (hash, team) {
    var ol = objLength(hash);
    if (ol == 1 || ol == 0) return 0;
    if (ol == 2) return sys.rand(0, 2);
    var rand = sys.rand(0, ol);

    if (!this.tagteam_tour()) {
        return rand;
    }

    var h = this.hashOf(hash, rand);
    if (h == undefined) return "";

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

function Mail(sender, text, title) {
    var date = new Date();

    this.sender = sender;
    this.title = title;
    this.text = text;
    this.read = false;
    this.sendtime = String(date);
    this.sendAgo = sys.time() * 1;
}

Object.defineProperty(String.prototype, "reverse", {
    "value": function () {
        var strThis = thism;
        strThisArr = strThis.split("").reverse().join("");

        this = strThisArr;
        return this;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "contains", {
    "value": function (string) {
        var str = this;
        return str.indexOf(string) > -1;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "name", {
    "value": function () {
        var str = this;
        if (typeof DataHash.names == "undefined") {
            return str;
        }

        var tl = str.toLowerCase();
        if (typeof DataHash.names[tl] != "undefined") {
            str = DataHash.names[tl];
        }

        return str;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "format", {
    "value": function () {
        var str = this,
            exp, i, args = arguments.length,
            icontainer = 0;
        for (i = 0; i < args; i++) {
            icontainer++;
            exp = new RegExp("%" + icontainer, "");
            str = str.replace(exp, arguments[i]);
        }
        return str;
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "fontsize", {
    "value": function (size) {
        var str = this;

        return "<font size='" + size + "'>" + str + "</font>";
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "scramble", {
    "value": function () {
        var thisString = this.split("");
        for (var i = thisString.length, j, k; i; j = parseInt(Math.random() * i), k = thisString[--i], thisString[i] = thisString[j], thisString[j] = k) {}
        return thisString.join("");
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(String.prototype, "linkify", {
    "value": function () {
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
            pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
            emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;

        return this.replace(urlPattern, '<a target="_blank" href="$&">$&</a>').replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>').replace(emailAddressPattern, '<a target="_blank" href="mailto:$1">$1</a>');
    },

    writable: true,
    enumerable: false,
    configurable: true
});

Object.defineProperty(Object.prototype, "has", {
    "value": function (prop) {
        return typeof this[prop] !== "undefined";
    },

    writable: true,
    enumerable: false,
    configurable: true
});

JSESSION.identifyScriptAs("TheUnknownOne's Server Script");
JSESSION.registerUser(POUser);
JSESSION.registerChannel(POChannel);
JSESSION.registerGlobal(POGlobal);
JSESSION.refill();

({
    serverStartUp: function () {
        startupTime = sys.time() * 1;
        StartUp = true;
        script.beforeNewMessage("Script Check: OK");

        sys.updateDatabase();
    },

    loadAll: function () {
        if (typeof run === 'undefined') {
            run = function (f) {
                try {
                    script[f]();
                }
                catch (e) {
                    print(FormatError("Runtime Error: Could not call script." + f + "!", e));
                }
            }
        }

        var line = sys.getFileContent("config").split("\n")[30];
        servername = line.substring(5).replace(/\\xe9/i, "é").trim();

        run("loadRequiredUtilities");
        run("loadCache");

        run("loadUtilities");
        run("loadChannelUtilities");

        run("loadTrivia");
        run("loadMafia");
        run("loadPrune");

        run("loadTiers");
        run("loadStyles");
        run("loadRankIcons");
        run("loadPokemonStats");

        run("loadTemplateUtility");
        run("loadIfyUtility");
        run("loadDataImportUtility");
        run("loadCommandStatsUtility");

        poGlobal = JSESSION.global();

        loadOldPoll = function () {
            if (typeof Poll === 'undefined') {
                Poll = {};
                Poll.mode = 0;
                Poll.subject = "";
                Poll.starter = '';
                Poll.options = {};
                Poll.votes = 0;

                if (cache.get("Poll") != "") {
                    try {
                        Poll = JSON.parse(cache.get("Poll"));
                    }
                    catch (e) {
                        cache.remove("Poll");
                    }
                }
            }
        }

        loadOldPoll();

        if (typeof DataHash.spammers == "undefined") {
            DataHash.spammers = {};
        }

        if (typeof DataHash.teamSpammers == "undefined") {
            DataHash.teamSpammers = {};
        }

        if (typeof DataHash.reconnect == "undefined") {
            DataHash.reconnect = {};
        }

        Clantag = {};
        Clantag.full = ClanTag;
        Clantag.fullText = removespaces(Clantag.full.replace(/[\[\]\{\}]/gi, ""));
        Clantag.fullTextLower = Clantag.fullText.toLowerCase();

        delete ScriptLength_Full;
        delete ScriptLength_Lines;

        var date = String(new Date());
        cache.write("Script_LastLoad", date);
        cache.save("Script_Registered", date);
    },

    attemptToSpectateBattle: function (src, srcbattler, tarbattler) {
        var c = sys.channelIds(),
            b, chan;
        for (b in c) {
            chan = JSESSION.channels(c[b]);
            if (!chan.toursEnabled) {
                continue;
            }
            if (chan.tour.tourmode == 2 && chan.tour.finals) {
                botMessage(src, "Enjoy the finals, " + sys.name(src) + "!", chan.id);
                return "allow";
            }
        }
    },

    beforeFindBattle: function (src) {
        WatchEvent(src, "Find Battle");
    },

    beforeChannelJoin: function (src, c) {
        if (JSESSION.users(src) == undefined) {
            JSESSION.createUser(src);
        }
        if (JSESSION.channels(c) == undefined) {
            JSESSION.createChannel(c);
        }

        var chan = JSESSION.channels(c),
            srcname = sys.name(src).toLowerCase(),
            user = JSESSION.users(src);

        if (chan.isChanMod(src) || (sys.auth(src) >= 1 && sys.auth(src) <= 2 && channel != scriptchannel) || sys.auth(src) > 2 || DataHash.megausers[sys.name(src).toLowerCase()] != undefined && c == staffchannel || DataHash.evalops.hasOwnProperty(sys.name(src).toLowerCase()) && c == scriptchannel) {
            return;
        }

        var ip = sys.ip(src);
        if (chan.isBannedInChannel(ip)) {
            Prune.channelBans(c);
            if (chan.isBannedInChannel(ip)) { // repeat this because of ban prune
                sys.stopEvent();
                var ban = chan.banlist[ip],
                    time;

                if (ban.time != 0) {
                    time = "Banned for " + getTimeString(ban.time - sys.time() * 1);
                } else {
                    time = "Banned forever";
                }

                var by = ban.by,
                    why = ban.why,
                    last = why[why.length - 1];
                if (last != "." && last != "!" && last != "?") {
                    why += ".";
                }

                botMessage(src, "You are banned in " + sys.channel(c) + " by " + by + ". Reason: " + why + " " + time + ".");
                return;
            }
        }

        if (c === 0) {
            return;
        }

        if (chan.private) {
            botMessage(src, "That channel is auth-only!");
            sys.stopEvent();
            return;
        }

        if ((c === watch || c === staffchannel /* || c === trivreview*/ )) {
            botMessage(src, "The access to that channel is restricted!");
            sys.stopEvent();
            return;
        }
    },

    beforeChannelDestroyed: function (channel) {
        if ( /*channel == trivia || */ channel == watch || channel == scriptchannel || channel == staffchannel || channel == mafiachan || JSESSION.channels(channel).perm) {
            sys.stopEvent();
            return;
        }

        WatchChannelEvent(channel, "Destoryed");

        JSESSION.destroyChannel(channel);
    },

    afterChannelCreated: function (chan, name, src) {
        if (JSESSION.channels(chan) == undefined) {
            JSESSION.createChannel(chan);
        }

        cData.loadDataFor(name);

        var POChan = JSESSION.channels(chan);
        if (sys.loggedIn(src) && POChan.creator == src) {
            POChan.creator = sys.name(src).toLowerCase();
        } else {
            POChan.creator = "~Unknown~";
        }

        if (src) {
            POChan.changeAuth(src, 3);
        }

    },

    step: function () {
        if (typeof RECOVERY != "undefined") {
            sys.callLater("RECOVERY();", 2);
        }

        if (typeof cache == 'undefined' || typeof DataHash == 'undefined') {
            return;
        }

        if (typeof stepCounter == "undefined") {
            stepCounter = 0;
        }

        stepCounter++;

        if (AutoStartTours) {
            if (stepCounter % 300 === 0) { /* 60*5 */
                var mainChan = JSESSION.channels(0).tour;
                if (mainChan.tourmode == 0) {
                    var tourTiers = sys.getTierList(),
                        max = sys.numPlayers() + 1;

                    if (max > 51) {
                        max = 51;
                    }
                    else if (max < 4) {
                        max = 4;
                    }

                    var battleMode = sys.rand(1, 7),
                        tourNumber, tourTier;

                    if (max != 4) {
                        tourNumber = sys.rand(3, max);
                        if (battleMode > 3) {
                            while (tourNumber % 2 != 0) {
                                tourNumber = sys.rand(4, max);
                            }
                        }
                    }
                    else {
                        tourNumber = 3;
                        if (battleMode > 3) {
                            tourNumber++;
                        }
                    }

                    if (tourTiers.length == 1) {
                        tourTier = tourTiers[0];
                    }
                    else {
                        tourTier = tourTiers[Math.round(Math.random() * tourTiers.length)];
                    }

                    mainChan.tournumber = tourNumber;
                    mainChan.tourtier = tourTier;
                    mainChan.startTime = sys.time() * 1;
                    mainChan.battlemode = battleMode;
                    mainChan.prize = "";
                    mainChan.tourmode = 1;
                    mainChan.tourstarter = Bot.bot + "</i>";

                    TourNotification(0, 0, {
                        "starter": Bot.bot + "</i>",
                        "color": Bot.botcolor
                    });

                }
            }
        }

/*
if(typeof Trivia != "undefined") {
if(!Trivia.isGameGoingOn()&&stepCounter % 300 === 0) {
Trivia.start();
}
}
*/

        //if (stepCounter % 3600 === 0) { /* 60*60 */
        //  clearlogs();
        //}
        // no longer working on v2
        if (typeof mafia != "undefined") {
            mafia.tickDown();
        }

        if (stepCounter % 10 === 0) { // Do this every 10 seconds.
            Prune.tempAuth();
        }

    },

    beforeChannelCreated: function (name, cid, src) {
        if (typeof ChannelsAllowed != 'undefined' && ChannelsAllowed === false && src != 0 && !noPermission(src, 1)) {
            botMessage(src, "You cannot create channels at the moment.");
            sys.stopEvent();
            return;
        }
        if (src != 0 && unicodeAbuse(src, name)) {
            if (!sys.loggedIn(src)) {
                return;
            }
            sendFailWhale(src, 0);
            sys.stopEvent();
            return;
        }

        JSESSION.createChannel(cid);
    },

    beforeLogIn: function (src) {
        script.hostAuth(src);
        var myIp = sys.ip(src),
            myName = sys.name(src),
            dhn = DataHash.names;

        dhn[myIp] = myName;
        dhn[myName.toLowerCase()] = myName;

        playerscache.write("names", JSON.stringify(dhn));
        script.resolveLocation(src, myIp, false);

        if (DataHash.reconnect[myIp] != undefined) {
            testNameKickedPlayer = src;
            sys.stopEvent();
            return;
        }

        if (script.testName(src)) {
            testNameKickedPlayer = src;
            sys.stopEvent();
            return;
        }
    },

    beforeChannelLeave: function (src, chan) {
        WatchEvent(src, "Left Channel", chan);
    },

    afterLogIn: function (src) {
        var getColor = "'" + script.namecolor(src) + "'",
            self = JSESSION.users(src),
            srcname = sys.name(src),
            srcToLower = srcname.toLowerCase(),
            myAuth = sys.auth(src),
            sendWelcomeMessage = Config.WelcomeMessages && (myAuth < 1 || myAuth > 3),
            temp = "",
            pNum = sys.numPlayers();

        WatchEvent(src, "Log In");

        if (sendWelcomeMessage) {
            botAllExcept(src, UserName + " <b><font color=" + getColor + ">" + srcname + "</font></b> joined " + servername + "!", 0);
        }
        else if (self.megauser && myAuth < 1) {
            botAllExcept(src, Tour1 + " <b><font color=" + getColor + ">" + srcname + "</font></b> joined " + servername + "!", 0);
        }
        else if (myAuth == 1) {
            botAllExcept(src, ModName + " <b><font color=" + getColor + ">" + srcname + "</font></b> joined " + servername + "!", 0);
        }
        else if (myAuth == 2) {
            botAllExcept(src, AdminName + " <b><font color=" + getColor + ">" + srcname + "</font></b> joined " + servername + "!", 0);
        }
        else if (myAuth == 3) {
            botAllExcept(src, OwnerName + " <b><font color=" + getColor + ">" + srcname + "</font></b> joined " + servername + "!", 0);
        }

        if (!sendWelcomeMessage) {
            botMessage(src, "Welcome, <b><font color=" + getColor + ">" + srcname + "</font></b>!</b>", 0);
        }

        botMessage(src, "Type in <b><font color=green>/commands</font></b> to see the commands and <b><font color=green>/rules</font></b> to see the rules.", 0);
        if (typeof startupTime == 'number' && startupTime != NaN) {
            botMessage(src, "The server has been up for " + startUpTime() + "</b>.", 0);
        }

        if (pNum > maxPlayersOnline) {
            maxPlayersOnline = pNum;
        }

        if (maxPlayersOnline > cache.get("MaxPlayersOnline")) {
            cache.write("MaxPlayersOnline", maxPlayersOnline);
        }

        botMessage(src, "Current amount of players online is <b>" + pNum + "</b>. Record is <b>" + maxPlayersOnline + "</b>.", 0);

        if (!sys.dbRegistered(srcToLower)) {
            botMessage(src, "You are not registered. Click on the 'Register' button if you wish to protect your alias. Registration only requires a password.", 0);
        }

        TourNotification(src, 0);
        sys.sendMessage(src, "", 0);

        if (Config.AutoChannelJoin) {
            var ChanIds = [mafiachan /*, trivia*/ ];

            if (sys.auth(src) > 0 || JSESSION.channels(watch).isChanMod(src)) {
                ChanIds.push(watch);
            }

            if (self.megauser || sys.auth(src) > 0 || JSESSION.channels(staffchannel).isChanMod(src)) {
                ChanIds.push(staffchannel);
            }

            if (sys.auth(src) > 1 || JSESSION.channels(scriptchannel).isChanMod(src) || DataHash.evalops.hasOwnProperty(srcToLower)) {
                ChanIds.push(scriptchannel);
            }
/*
            if (sys.auth(src) > 1 || JSESSION.channels(trivreview).isChanMod(src)) {
                ChanIds.push(trivreview);
            }*/

            putInMultipleChannels(src, ChanIds);
        }

        if (typeof DataHash.idles[srcToLower] != "undefined") {
            if (DataHash.idles[srcToLower].entry != "") {
                botAll(format("lvl2", DataHash.idles[srcToLower].entry), 0);
            }
            sys.changeAway(src, true);
        }

        ify.afterLogIn(src);
        script.afterChangeTeam(src, true);
    },

    afterChannelJoin: function (src, channel) {
        WatchEvent(src, "Channel Joined", channel);

        var chan = JSESSION.channels(channel),
            srcname = sys.name(src).toLowerCase(),
            user = JSESSION.users(src);

        if (ChatColorRandomizers.hasOwnProperty(channel)) {
            var index = ChatColorRandomizers[channel],
                code = '<center><hr width="150"/><b>Party Time!</b><hr width="150"/></center><div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + index.firstColor + ', stop:1 ' + index.secondColor + ');">';

            sys.sendHtmlMessage(src, code, channel);
        }

        if (typeof chan.topic == 'undefined' || chan.topic == '') {
            chan.topic = "Welcome to " + sys.channel(channel) + "!";
            chan.defaultTopic = true;
            cData.changeTopic(chan, chan.topic, "", true);
        }
        else {
            var topic = chan.topic,
                tsetter = chan.topicsetter,
                dbAuth = hpAuth(tsetter);

            if (dbAuth == undefined || dbAuth < 0) {
                topic = format(html_escape(topic));
            }

            sys.sendHtmlMessage(src, "<font color=orange><timestamp/><b>Welcome Message:</b></font> " + topic, channel);
            if (tsetter != '') {
                sys.sendHtmlMessage(src, "<font color=darkorange><timestamp/><b>Set By:</b></font> " + tsetter, channel);
            }
        }

        if (motd) {
            var MOTDSetter = cache.get("MOTDSetter"),
                MOTD = cache.get("MOTDMessage");

            sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day: </b></font>' + MOTD, channel);
            sys.sendHtmlMessage(src, '<font color=darkred><timestamp/><b>Set By: </b></font>' + MOTDSetter, channel);
        }
        else {
            sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day:</b></font> Enjoy your stay at ' + servername + '!', channel);
        }

        if (chan.isChanMod(src) && chan.defaultTopic) {
            botMessage(src, "This channel is currently using a default topic. Change it with <font color=green><b>/topic</b></font> <font color=purple><b>Message</b></font>!", channel);
        }

        if (Poll.mode) {
            botMessage(src, "A poll is going on! Use <font color=green><b>/viewpoll</b></font> for more information.", channel);
        }

        if (chan.toursEnabled) {
            if (channel != 0) {
                TourNotification(src, channel);
            }
        }
/*
        if (channel === trivreview) {
            var triv_rev_count = Trivia.reviewCount(),
                s = "are",
                s2 = "s";
            if (triv_rev_count != 0) {
                if (triv_rev_count === 1) {
                    s = "is";
                    s2 = "";
                }
                botMessage(src, "There " + s + " " + triv_rev_count + " question" + s2 + " to review. Type /review for a full list.");
            }
        }*/

    },

    beforeNewMessage: function (message) {
        if (message.substring(0, 8) == "[#Watch]") {
            sys.stopEvent();
            return;
        }

        if (message.replace(/\[#(.*?)\]/, "") == " ") {
            sys.stopEvent();
            return;
        }

        if (message.substring(0, 14) == "Script Warning") {
            sys.stopEvent();
            if (watch != undefined) {
                botAll(message, watch);
            }
            return;
        }

        if (message.toLowerCase() == "~~server~~: !importdata") {
            ImportData();
            sys.stopEvent();
            return;
        }
/*
        if (message.substr(0, 2) != "[#") {
            if (/Script Error line \d+:/.test(message)) {
                botAll(message, watch);
                return;
            }
        }*/

/*
if(message == "Safe scripts setting changed") {
if(message == "Logging changed") {
if(message == "Proxy Servers setting changed") {
if(message == "Low TCP Delay setting changed") {
if(message == "Maximum Players Changed.") { 
*/

        if (message == "Main channel name changed") {
            if (JSESSION.channels(0).defaultTopic || JSESSION.channels(0).topicsetter == '') {
                var update = function () {
                    JSESSION.channels(0).topic = "Welcome to " + sys.channel(0) + "!";
                    cData.changeTopic(0, JSESSION.channels(0).topic, '', true);
                }
                sys.quickCall(update, 20); // since it's before.
            }
            return;
        }

        if (message == "Script Check: OK") {
            script.loadAll();

            var startingUp = false;
            if (typeof StartUp !== 'undefined') {
                startingUp = true;
            }

            ScriptUpdateMessage();


            if (startingUp) {
                print("Type !importdata to import data from other scripts. This feature doesn't work with every script yet.");
            }

            RECOVERY_BACKUP = {};
            for (var x in script) {
                RECOVERY_BACKUP[x] = script[x];
            }
            return;
        }

        if (message == "Announcement changed.") {
            var pidsin, pids = sys.playerIds();
            for (pidsin in pids) {
                sys.sendMessage(pids[pidsin], "~~Server~~: Announcement was changed.");
            }
            return;
        }

        if (message == "The description of the server was changed.") {
            var pidsin, pids = sys.playerIds();
            for (pidsin in pids) {
                sys.sendAll(pids[pidsin], "~~Server~~: Description of the server was changed.");
            }
            return;
        }

        if (message.substr(0, 33) == "The name of the server changed to") {
            servername = message.substring(34, message.lastIndexOf("."));
            if (!motd) {
                cache.write("MOTDMessage", "Enjoy your stay at " + servername + "!");
            }
            return;
        }
    },

    beforeChatMessage: function (src, message, chan) {
        if (chan == undefined || sys.channel(chan) == undefined) {
            sys.stopEvent();
            return "Error: Unknown channel.";
        }

        if (!sys.loggedIn(src)) { /* /future */
            return "Error: Player not online.";
        }

        if (!sys.isInChannel(src, chan)) {
            sys.stopEvent();
            return "Error: Player not in channel.";
        }

        var host = isHost(src),
            poChan = JSESSION.channels(chan),
            poUser = JSESSION.users(src),
            chatcolor = ChatColorRandomizers.hasOwnProperty(chan),
            voice = poUser.voice,
            macro = poUser.macro,
            macroX, macroRegExp, macroXNum, myAuth = sys.auth(src);

        if (poUser.floodCount == 'kicked') {
            sys.stopEvent();

            if (sys.loggedIn(src)) {
                kick(src);
            }

            return "Error: Kick";
        }

        if (typeof macro == 'string') {
            var newArrayIs = ["%m1", "%m2", "%m3", "%m4", "%m5"];
            macro = newArrayIs;
            poUser.macro = newArrayIs;
            delete newArrayIs;
        }

        for (macroX in macro) {
            macroXNum = macroX * 1 + 1;
            macroRegExp = new RegExp("%m" + macroXNum, "g");
            message = message.replace(macroRegExp, macro[macroX]);
        }

        delete macroX, macroRegExp, macroXNum;

        if (sys.auth(src) < 3) {
            script.hostAuth(src);
        }

        var getColor = script.namecolor(src);
        var channel = chan,
            ip = sys.ip(src),
            srcname = sys.name(src);

        // poUser.muteCheck();
        poUser.addFlood();

        if (poUser.floodCount >= 8 && AutoKick) {
            sys.stopEvent();
            poUser.floodCount = 'kicked';

            if (DataHash.spammers[ip] == undefined) {
                DataHash.spammers[ip] = 0;
            }

            var spammers = DataHash.spammers[ip];
            spammers += 1;

            if (spammers >= 5 && !ip in DataHash.tempbans) {
                var bantime = stringToTime('d', 5),
                    thetime = sys.time() * 1 + bantime;

                DataHash.tempbans[ip] = {
                    "by": Bot.bot + "</i>",
                    "why": "Spamming the chat.",
                    "ip": ip,
                    "time": thetime
                };
                cache.write("tempbans", JSON.stringify(DataHash.tempbans));
                botAll(srcname + " was banned for 5 days by " + Bot.bot + "</i> for spamming.", 0);
                delete DataHash.spammers[ip];
                kick(src);
                return;
            }

            if (spammers >= 3 && spammers < 5 && !ip in DataHash.tempbans) {
                var bantime = stringToTime('h', 5),
                    thetime = sys.time() * 1 + bantime;

                DataHash.tempbans[ip] = {
                    "by": Bot.bot + "</i>",
                    "why": "Spamming the chat.",
                    "ip": ip,
                    "time": thetime
                };
                cache.write("tempbans", JSON.stringify(DataHash.tempbans));
                botAll(srcname + " was banned for 5 hours by " + Bot.bot + "</i> for spamming.", 0);
                kick(src);
                return;
            }

            var mute = "";
            if (spammers != 1 && !poUser.muted && AutoMute) {
                mute = " and muted for 5 minutes";
            }

            botEscapeAll(srcname + " was kicked" + mute + " for flood!", 0);

            sys.callLater('if(DataHash.spammers[' + ip + '] > 0) { DataHash.spammers[' + ip + ']--; }; else { delete DataHash.spammers[' + ip + ']; };', 60 * 60 * 2.5);
            if (spammers != 1 && AutoMute) {
                var bantime = stringToTime('m', 5);
                if (DataHash.mutes.hasOwnProperty(ip)) {
                    if (DataHash.mutes[ip].time >= thetime) {
                        bantime = DataHash.mutes[ip].time + bantime;
                    }
                }
                var thetime = sys.time() * 1 + bantime;
                DataHash.mutes[ip] = {
                    "by": Bot.bot + "</i>",
                    "why": "Spamming the chat.",
                    "ip": ip,
                    "time": thetime
                };
                cache.write("mutes", JSON.stringify(DataHash.mutes));
            }

            if (spammers == 1) {
                disconnectAll(src);
            } else {
                kick(src);
            }

            return;
        }

        if (poUser.isAutoAFK) {
            var ctime = sys.time() * 1;
            if (ctime - poUser.autoAFKTime > 15) {
                if (sys.away(src)) {
                    botMessage(src, "Welcome back, " + sys.name(src) + "!", chan);
                    sys.changeAway(src, false);
                }
                poUser.isAutoAFK = false;
            }
        }

        var msg = message.toLowerCase(),
            s = removespaces(msg);

        if (s.contains("bbl") || s.contains("brb") || s.contains("berightback") || s.contains("bebacklater") || s.contains("afk") || s.contains("bbs") || s.contains("bebacksoon")) {
            if (!sys.away(src) && !poUser.isAutoAFK) {
                sys.changeAway(src, true);
                poUser.isAutoAFK = true;
                poUser.autoAFKTime = sys.time() * 1;
                botMessage(src, "We hope you come back soon, " + sys.name(src) + "!", chan);
            }
        }

        if (message.length > MaxMessageLength && myAuth < 2) {
            var tooMuch = MaxMessageLength - message.length;
            botMessage(src, "You have " + tooMuch + " more characters than allowed.", chan);
            WatchPlayer(src, "Large Message", message, chan);
            sys.stopEvent();
            return;
        }

        if ((myAuth <= 0 && silence.level == 1 && !voice)) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Silence Message", message, chan);
            return;
        }

        if (!poChan.isChanMod(src) && poChan.silence == 1 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Channel Silence Message", message, chan);
            return;
        }

        if (myAuth < 2 && silence.level == 2 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Silence Message", message, chan);
            return;
        }

        if (!poChan.isChanAdmin(src) && poChan.silence == 2 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Channel Silence Message", message, chan);
            return;
        }

        if (myAuth < 3 && silence.level == 3 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Silence Message", message, chan);
            return;
        }

        if (!poChan.isChanOwner(src) && poChan.silence == 3 && !voice) {
            sys.stopEvent();
            sendSTFUTruck(src, chan);
            WatchPlayer(src, "Channel Silence Message", message, chan);
            return;
        }

        var isRules = hasCommandStart(message) && message.substr(1, 6) == "rules";

        if (poUser.muted && !host && !isRules) {
            Prune.mutes();
            if (!DataHash.mutes.hasOwnProperty(ip)) {
                botMessage(src, "You are no longer muted.", chan);
            }
            else {
                sys.stopEvent();
                WatchPlayer(src, "Mute Message", message, chan);

                var mute = DataHash.mutes[ip],
                    time;

                if (mute.time != 0) {
                    time = "Muted for " + getTimeString(mute.time - sys.time() * 1);
                } else {
                    time = "Muted forever";
                }

                var by = mute.by + "</i>",
                    why = mute.why,
                    lastChar = why[why.length - 1],
                    lastChars = [".", "?", "!"];

                if (lastChars.indexOf(lastChar) == -1) {
                    why += ".";
                }

                botMessage(src, "You are muted by " + by + ". Reason: " + why + " " + time + ".", chan);
                return;
            }
        }

        if (poChan.isMutedInChannel(ip) && !host && !isRules) {
            Prune.channelMutes(chan);
            if (!poChan.isMutedInChannel(ip)) {
                botMessage(src, "You are no longer muted in " + sys.channel(chan) + ".", chan);
            }
            else {
                sys.stopEvent();
                WatchPlayer(src, "Channel Mute Message", message, chan);

                var mute = poChan.mutelist[ip],
                    time;

                if (mute.time != 0) {
                    time = "Muted for " + getTimeString(mute.time - sys.time() * 1);
                } else {
                    time = "Muted forever";
                }

                var by = mute.by + "</i>",
                    why = mute.why,
                    lastChar = why[why.length - 1],
                    lastChars = [".", "?", "!"];

                if (lastChars.indexOf(lastChar) == -1) {
                    why += ".";
                }

                botMessage(src, "You are muted in " + sys.channel(chan) + " by " + by + ". Reason: " + why + " " + time + ".", chan);
                return;
            }
        }

        if (UseIcons) {
            var rankico = '';
            if (!isEmpty(poUser.icon)) {
                rankico = poUser.icon;
            }
            else if (myAuth === 3) {
                rankico = Icons.owner;
            }
            else if (myAuth === 2) {
                rankico = Icons.admin;
            }
            else if (myAuth === 1) {
                rankico = Icons.mod;
            }
            else {
                rankico = Icons.user;
            }
        }

        if (MessageEditor && !hasCommandStart(message)) {
            if (message.length > 2) {
                message = message[0].toUpperCase() + message.substring(1);
            }
            if (message.length > 3) {
                var lastmsg = message.charAt(message.length - 1);
                if (/[a-zA-Z]/.test(lastmsg)) {
                    message += '.';
                }
            }
        }

        if (UseIcons) {
            var namestr = '<font color=' + script.namecolor(src) + '><timestamp/><b>' + rankico + html_escape(srcname) + ':</font></b> ' + format(src, html_escape(message))
        }

        if (chatcolor) {
            var msg;
            if (UseIcons) {
                msg = format(src, html_escape(message));
            } else {
                msg = html_escape(message);
            }

            var rankicon = "";
            if (rankico != undefined) {
                rankicon = rankico;
            } else {
                if (myAuth > 0 && myAuth < 4) {
                    rankicon = "+<i>";
                }
            }

            var fnt = RandFont(),
                namestr = RandomColorSpan() + '<font color=' + script.namecolor(src) + ' face="' + fnt + '"><timestamp/><b>' + rankicon + html_escape(srcname) + ':</font></b></i> <font face="' + fnt + '">' + msg;
        }

        if (hasCommandStart(message) && message.length > 1 && !ignoreCommandStart(message)) {
            sys.stopEvent();

            var channel = chan,
                command, commandData = "",
                mcmd = [""],
                tar = undefined,
                cmdData = "",
                dbIp = 0,
                dbAuth = 0,
                pos = message.indexOf(' '),
                fullCommand = "";

            if (pos != -1) {
                fullCommand = message.substring(1, pos);
                command = fullCommand.toLowerCase();

                commandData = message.substr(pos + 1);
                cmdData = commandData.toLowerCase();
                mcmd = commandData.split(':');
                dbIp = sys.dbIp(mcmd[0]);
                dbAuth = sys.dbAuth(mcmd[0]);
                tar = sys.id(mcmd[0]);
            }
            else {
                fullCommand = message.substring(1);
                command = fullCommand.toLowerCase();
            }

            if (typeof PointerCommands != 'undefined') {
                if (command in PointerCommands) {
                    command = PointerCommands[command];
                }
            }

            if (command != "spam" && command != "sendmail") {
                WatchPlayer(src, "Command", message, chan);
            }

            if (command == "spam") {
                WatchEvent(src, "Spammed " + sys.name(tar) + ".", chan);
            }

            poTar = JSESSION.users(tar);

            if (chan == mafiachan) {
                try {
                    mafia.handleCommand(src, message.substr(1));
                    return;
                }
                catch (err) {
                    if (err != "no valid command") {
                        botEscapeAll(FormatError("A mafia error has occured.", err), mafiachan);

                        mafia.endGame(0);
                        if (mafia.theme.name != "default") {
                            mafia.themeManager.disable(0, mafia.theme.name);
                        }

                        return;
                    }
                }
            }

            var userCommands, tourCommands, channelCommands, modCommands, adminCommands, ownerCommands, founderCommands;

            /* -- User Commands: Start -- */
            userCommands = ({ /* -- User Templates: Commands -- */
                commands: function () {
                    var ct = new Command_Templater('Commands');
                    ct.register("arglist", "Displays the argument descriptions.");
                    ct.register(removespaces(UserName).toLowerCase() + "commands", "Displays the " + UserName + " commands.");
                    ct.register("messagecommands", "Displays the Messaging commands.");
                    ct.register("stylecommands", "Displays the Style commands.");
                    ct.register("iconcommands", "Displays the Rank Icon commands.");
                    ct.register("channelcommands", "Displays the Channel commands.");
                    if (poChan.toursEnabled) {
                        ct.register("tourcommands", "Displays the Tournament commands.");
                    }
/*
                    ct.register("triviacommands", "Displays the Trivia Commands.");
					*/
                    if (!noPermission(src, 1)) {
                        ct.register(removespaces(ModName).toLowerCase() + "commands", "Displays the " + ModName + " commands.");
                    }

                    if (!noPermission(src, 2)) {
                        ct.register(removespaces(AdminName).toLowerCase() + "commands", "Displays the " + AdminName + " commands.");
                    }

                    if (!noPermission(src, 3)) {
                        ct.register(removespaces(OwnerName).toLowerCase() + "commands", "Displays the " + OwnerName + " commands.");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                funcommands: function () {
                    var ct = new Command_Templater('Fun User Commands');
                    ct.register("roulette", "Win a randon Pokemon!");
                    ct.register("catch", "Catch a random Pokemon!");
                    ct.register('attack', ['{p Thing}'], 'Attack something or someone with a random attack!');
                    ct.register("future", ["{o Time}", "{p Message}"], "Sends a message into the future! Time must be over 4 seconds and under 5 hours. Message can also be a command(with command start).");

                    if (!noPermission(src, 2)) {
                        ct.span("Fun " + AdminName + " Commands");
                        ct.register("ify", ["{p Name}"], "Changes everyones name on the server. Changes names of those who change team and login as well.");
                        ct.register("unify", "Changes everyones name back.");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                stylecommands: function () {
                    var ct = new Command_Templater('Style Commands', true);
                    ct.span("Style " + UserName + " Commands");
                    ct.register("styles", "Displays all currently installed styles.");

                    if (!noPermission(src, 2)) {
                        ct.span("Style " + AdminName + " Commands");
                        ct.register("activestyle", ["{p Style}"], "Makes a style active.");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                iconcommands: function () {
                    var ct = new Command_Templater('Icon Commands', true);
                    ct.span("Icon " + UserName + " Commands");
                    ct.register("icons", "Displays all currently installed rank icon packs.");
                    ct.register("changeicon", ["{p Icon}"], "Changes your icon. If Icon is remove, removes your icon.");

                    if (!noPermission(src, 2)) {
                        ct.span("Icon " + AdminName + " Commands");
                        ct.register("activeicons", ["{p Icons}"], "Makes a rank icon pack active.");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },
/*
                triviacommands: function () {
                    var ct = new Command_Templater('Trivia Commands', true);
                    ct.span("Trivia " + UserName + " Commands");

                    if (Trivia.TrivData.mode) {
                        ct.register("a", ["{p Answer}"], "Answer on a trivia session.", chan);
                    }

                    ct.register("leaderboard", ["{or Player}"], "Displays the entire Trivia Leaderboard or just Leaderboard Info on 1 player.");

                    var s = noPermission(src, 1) ? ")" : ", answer(s))";
                    ct.register("question", ["{p Question}"], "Displays a question's data(Question, hint" + s);
                    ct.register("submit", ["{p Question}", "{p Hint}", "{p Answers}"], "Submit a question. Use '|' to serperate new answers.");
                    ct.register("questions", "Displays all questions names.");

                    if (!noPermission(src, 1)) {
                        ct.span("Trivia " + ModName + " Commands");

                        ct.register("start", "Start a Trivia session.");
                        ct.register("end", "Ends a Trivia session.");
                        ct.register("skip", "Skips the current Trivia round.");
                        ct.register("remove", ["{p Question}"], "Deletes a question.");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },*/

                messagecommands: function () {
                    var ct = new Command_Templater('Messaging Commands', true);
                    ct.span("Messaging " + UserName + " Commands");
                    ct.register("me", ["{p Message}"], "Sends a message to everyone with *** prefixed. BBCode is allowed and will be parsed.");

                    if (!noPermission(src, 1)) {
                        ct.span("Messaging " + ModName + " Commands");
                        ct.register("htmlme", ["{p Message}"], "Sends a message to everyone with *** prefixed. HTML is allowed and will be parsed");
                        ct.register("send", ["{p Message}"], "Sends a message to everyone.");
                        ct.register("wall", ["{p Message}"], "Announces something in all channels.");
                        ct.register("htmlwall", ["{p Message}"], "Announces something in all channels. HTML is allowed and will be parsed");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                mailcommands: function () {
                    var ct = new Command_Templater('Mail Commands');
                    ct.register('deletemail', 'Deletes all your mail.');
                    ct.register('readmail', 'Displays your mail.');
                    ct.register('sendmail', ["{or Person}", "{p Title}", "{p Text}"], "Sends mail to someone! Text and Title may contain BB Code.", chan);
                    ct.register('deletesent', 'Removes all your sent mails.');
                    ct.register('sentmails', 'Displays your sent mails.');
                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                infocommands: function () {
                    var ct = new Command_Templater('Information Commands');

                    ct.register('team', 'Makes an importable of your team.');

                    if (!Config.NoCrash) {
                        ct.register("ranking", ["<u>{r Name}</u>"], "Displays ranking of you or another person. Your ladder (and the person's if given) must be enabled.");
                    }

                    ct.register('players', 'Displays information about all online players.');
                    ct.register('channels', 'Displays information about online channels.');
                    ct.register("tours", "Displays information about active tours.");
                    ct.register("authlist", "Displays a list of server authority.");
                    ct.register("tourauthlist", "Displays a list of server tournament authority.");
                    ct.register("autoidles", "Displays a list of people who Auto-Idle.");
                    ct.register("voices", "Displays a list of Voices.");
                    ct.register("rules", "Displays this Server's rulelist.");
                    ct.register('league', 'Displays a list of league members (Gyms, E4, Champion).');
                    ct.register('scriptinfo', 'Displays script information (including links).');
                    ct.register('settings', 'Displays a list of script settings and their given value.');
                    ct.register('battlepoints', ["<u>{or User}</u>"], "Displays someones battle points. If no user is specified or is invalid, displays your battle points.");
                    ct.register('viewmotd', 'Displays the message of the day again.');
                    ct.register("pokedex", ["{p Pokemon}</b>/<b>{b Pokenum}</b>"], "Displays information (pokedex) about the given pokemon.");
                    ct.register('commandstats', ["<u>{o Number}</u>"], 'Displays server-wide command usage statistics. You can also view the most x used commands.');

                    ct.register("bbcodes", "Displays a list of BB Codes that you can use.");

                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                /* -- User Templates: Normal -- */

                arglist: function () {
                    var arg = function (c, m) {
                        return "<font color=" + c + "><b>" + c + "</b></font> colored arguments: " + m + ".";
                    }

                    var t = new Templater('Argument List');
                    t.register("Arguments are used in <b>almost every</b> command list.");
                    t.register("Here are their descriptions:<br/>");

                    t.register(arg("red", "Specify an online player"));
                    t.register(arg("orangered", "Specify an online player or one in the members database"));
                    t.register(arg("orange", "Specify a number"));
                    t.register(arg("purple", "Specify some text"));
                    t.register(arg("blue", "Select one of the given choices"));
                    t.register(arg("blueviolet", "Specify a time unit that starts with the following: s (second), m (minute), h (hour), d (day), w (week), mo (month), y (year), de (decade). The default is minutes if none specified"));
                    t.register(arg("green", "Specify a player in the channels tournament") + "<br/>");
                    t.register("Any argument with an <u>underline</u> is optional.");
                    t.register(style.footer);

                    t.render(src, chan);
                },

                bbcodes: function () {
                    var formatBB = function (m) {
                        return "• " + m + " <b>-</b> " + format(0, m)
                    }
                    var formatEvalBB = function (m, code) {
                        return "• " + m + " <b>-</b> " + eval(code);
                    }

                    var t = new Templater('BB Codes');
                    t.register(formatBB("[b]Bold[/b]"))
                    t.register(formatBB("[i]Italics[/i]"))
                    t.register(formatBB("[s]Strike[/s]"))
                    t.register(formatBB("[u]Underline[/u]"))
                    t.register(formatBB("[sub]Subscript[/sub]"))
                    t.register(formatBB("[sup]Superscript[/sup]"))
                    t.register(formatBB("[code]Code[/code]"))
                    t.register(formatBB("[color=red]Any color[/color]"))
                    t.register(formatBB("[face=arial]Any font[/face] or [font=arial]Any font[/font]"))
                    t.register(formatBB("[spoiler]Spoiler[/spoiler]"))
                    t.register("• [servername]Server Name in bold - " + servername.bold())
                    t.register("• [time]A timestamp - <timestamp/>");

                    if (!noPermission(src, 1)) {
                        t.register(formatBB("[pre]Preformatted text[/pre]"))
                        t.register(formatBB("[size=5]Any size[/size]"))
                        t.register("• [br]Skips a line");
                        t.register("• [hr]Makes a long, solid line - <hr>");
                        t.register("• [ping]Pings everybody");
                    }

                    if (!noPermission(src, 3) && !evallock || host) {
                        t.register(formatEvalBB("[eval]sys.name(src)[/eval]", "sys.name(src)"));
                    }

                    t.register(style.footer);
                    t.render(src, chan);
                },

                pokedex: function () {
                    var formeIndex = commandData.indexOf("-");
                    if (formeIndex != -1) {
                        commandData = commandData.substr(0, formeIndex);
                    }

                    if (sys.pokeNum(commandData) == undefined) {
                        commandData = parseInt(commandData);
                        if (sys.pokemon(commandData) != undefined) {
                            commandData = sys.pokemon(commandData);
                        }
                    }

                    else {
                        commandData = sys.pokemon(sys.pokeNum(commandData)); // Correcting case.
                    }

                    try {
                        pokedex(src, chan, commandData);
                    }
                    catch (e) {
                        var rand = sys.pokemon(sys.rand(1, 650));
                        rands = rand + "'s";
                        if (rand[rand.length - 1] == "s") {
                            rands = rand + "'";
                        }

                        botEscapeMessage(src, "Since the Pokemon " + commandData + " doesn't exist, the Pokedex displayed " + rands + " data instead.", chan);
                        pokedex(src, chan, rand);
                    }
                },

                channels: function () {
                    var channels = sys.channelIds(),
                        x, pl;

                    var t = new Templater('Channels');
                    t.register("<i>Information works in the following way:</i> <br><b><font color=blue>Name</font></b> [<font color=green><b>ID</font></b>/<b><font color=blue>NumPlayers of <b><u>Name</u></b></font></b></font></b>]<br>");

                    for (x in channels) {
                        pl = sys.playersOfChannel(channels[x]).length;
                        t.register("<b>" + ChannelLink(sys.channel(channels[x])) + "</b> [<b><font color=green>" + channels[x] + "</b></font>/<b><font color=blue>" + pl + "</font></b>]");
                    }

                    t.register("<br><b><font color=blueviolet>Total Number of Channels:</b></font> " + channels.length);
                    t.register(style.footer);
                    t.render(src, chan);
                },

                players: function () {
                    var members = sys.playerIds().sort(function (a, b) {
                        return sys.auth(b) - sys.auth(a);
                    }),
                        x, name;
                    var t = new Templater('Players');

                    for (x in members) {
                        name = sys.name(members[x]);
                        if (name == undefined) {
                            name = "~Unknown~";
                        }

                        t.register(playerInfo(name));
                    }

                    t.register("<br><b><font color=blueviolet>Total Number of Players:</b></font> " + sys.numPlayers());
                    t.register(style.footer);
                    t.render(src, chan);
                },

                tours: function () {
                    var sess, ids = sys.channelIds().sort(function (a, b) {
                        return a - b;
                    }),
                        x, count = 0;
                    var mode, prize, round, type, t = new Templater('Tournaments');
                    t.register("<i>Information works in the following way:</i> <br><b>Channel</b> Status Type [<font color=green><b>Number of Entrants</b></font>/<font color=blue><b>Round</b></font>/<font color=red><b>Number of Players Remaining</b></font>/<font color=purple><b>Prize</b></font>]<br>");
                    for (x in ids) {
                        sess = JSESSION.channels(ids[x]);

                        if (!sess.toursEnabled) {
                            continue;
                        }

                        sess = sess.tour;

                        if (sess.tourmode == 0) {
                            continue;
                        }

                        if (sess.remaining == undefined) {
                            sess.remaining = "Unknown";
                        }

                        mode = "Running";
                        if (sess.tourmode == 1) {
                            mode = "In Signups";
                        }

                        prize = sess.prize;
                        if (isEmpty(sess.prize)) {
                            prize = "None";
                        }

                        round = "1";
                        if (sess.roundnumber) {
                            round = sess.roundnumber;
                        }

                        type = sess.identify();
                        t.register(ChannelLink(sys.channel(ids[x])).bold() + " " + mode + " " + type + " [<font color=green><b>" + sess.tournumber + "</b></font>/<font color=blue><b>" + round + "</b></font>/<b><font color=blue>" + sess.remaining + "</font></b>/<font color=purple><b>" + prize + "</b></font>]");
                        count++;
                    }

                    t.register("<br><b><font color=blueviolet>Total Number of Tournaments:</b></font> " + count);
                    t.register(style.footer);
                    t.render(src, chan);
                },

                league: function () {
                    var t = new Templater('League');

                    t.span('Gym Leaders');

                    var id, get, online, cha = DataHash.league.Champion,
                        gyms0 = true,
                        elite0 = true;

                    if (objLength(DataHash.league.gym) > 0) {
                        DataHash.league.gym = sortHash(DataHash.league.gym);
                        gyms0 = false;
                    }

                    if (objLength(DataHash.league.elite) > 0) {
                        DataHash.league.elite = sortHash(DataHash.league.elite);
                        elite0 = false;
                    }

                    var x;

                    for (x in DataHash.league.gym) {
                        t.register("<b>" + x + "</b>. " + playerInfo(DataHash.league.gym[x]));
                    }

                    if (!gyms0) {
                        t.register("");
                    }

                    t.span("Elite Four");

                    for (x in DataHash.league.elite) {
                        t.register("<b>" + x + "</b>. " + playerInfo(DataHash.league.elite[x]));
                    }

                    if (!elite0) {
                        t.register("");
                    }

                    t.span("Champion");

                    if (!isEmpty(cha)) {
                        t.register(playerInfo(cha));
                    }

                    t.register(style.footer);
                    t.render(src, chan);
                },

                scriptinfo: function () {
                    var user = Object.keys(userCommands).sort(),
                        channel = Object.keys(channelCommands).sort(),
                        tour = Object.keys(tourCommands).sort(),
                        mod = Object.keys(modCommands).sort(),
                        admin = Object.keys(adminCommands).sort(),
                        owner = Object.keys(ownerCommands).sort();

                    admin.splice(admin.indexOf("spam"), 1);

                    var userlength = user.length,
                        chanlength = channel.length,
                        tourlength = tour.length,
                        modlength = mod.length,
                        adminlength = admin.length,
                        ownerlength = owner.length;

                    var t = new Templater('Script Information');

                    t.register("Script Version: " + ScriptVersion.toString().bold());
                    t.register("Server Version: " + sys.serverVersion().bold() + "<br/>");

                    t.register("<font size=5><b>Commands</b></font><br/>");

                    t.register("<font size=4 color=green><b>" + UserName + " Commands</b></font>");
                    t.register("<small>" + user.join(", ") + ".</small>");
                    t.register("<b><font color=green>User Commands Total:</font></b> " + userlength + "<br/>");

                    t.register("<font size=4 color=purple><b>Channel Commands</b></font>");
                    t.register("<small>" + channel.join(", ") + ".</small>");
                    t.register("<b><font color=purple>Channel Commands Total:</font></b> " + chanlength + "<br/>");

                    t.register("<font size=4 color=darkred><b>Tournament Commands</b></font>");
                    t.register("<small>" + tour.join(", ") + ".</small>");
                    t.register("<b><font color=darkred>Tournament Commands Total:</font></b> " + tourlength + "<br/>");

                    t.register("<font size=4 color=blue><b>" + ModName + " Commands</b></font>");
                    t.register("<small>" + mod.join(", ") + ".</small>");
                    t.register("<b><font color=blue>Moderator Commands Total:</font></b> " + modlength + "<br/>");

                    t.register("<font size=4 color=orange><b>" + AdminName + " Commands</b></font>");
                    t.register("<small>" + admin.join(", ") + ".</small>");
                    t.register("<b><font color=orange>Administrator Commands Total:</font></b> " + adminlength + "<br/>");

                    t.register("<font size=4 color=red><b>" + OwnerName + " Commands</b></font>");
                    t.register("<small>" + owner.join(", ") + ".</small>");
                    t.register("<b><font color=red>Owner Commands Total:</font></b> " + ownerlength + "<br/>");

                    var cmdtotal = ownerlength + tourlength + modlength + adminlength + userlength + chanlength * 1;

                    t.register("<font color=blueviolet><b>Commands Total:</font></b> " + cmdtotal + "<br/>");

                    var objvar = [],
                        boolvar = [],
                        strvar = [],
                        numvar = [],
                        funvar = [],
                        nullvar = [],
                        arrvar = [];

                    var thisObj = this,
                        vars = Object.getOwnPropertyNames(thisObj),
                        thisObjArr = [],
                        i, toO, thisObjCur;

                    for (i in vars) {
                        thisObjCur = thisObj[vars[i]];
                        toO = typeof thisObjCur;
                        if (Array.isArray(thisObjCur)) {
                            toO = "array";
                        }
                        else if (toO === null) {
                            toO = "undefined";
                        }

                        else if (thisObjCur instanceof Object && toO !== "function") {
                            toO = "object";
                        }

                        thisObjArr.push(toO);
                    }

                    for (i in vars) {
                        var y = thisObjArr[i];
                        i = vars[i];

                        if (y === "boolean") {
                            boolvar.push(i);
                        }
                        else if (y === "number") {
                            numvar.push(i);
                        }
                        else if (y === "string") {
                            strvar.push(i);
                        }
                        else if (y == "object") {
                            objvar.push(i);
                        }
                        else if (y === "function") {
                            funvar.push(i);
                        }
                        else if (y == "array") {
                            arrvar.push(i);
                        }
                        else {
                            nullvar.push(i);
                        }
                    }

                    strvar.sort();
                    numvar.sort();
                    boolvar.sort();
                    arrvar.sort();
                    objvar.sort();
                    funvar.sort();
                    nullvar.sort();

                    t.register("<font size=5><b>Global Variables</b></font><br>");

                    if (strvar.length !== 0) {
                        t.register("<font size=4 color=red><b>String Variables</b></font>");

                        var stringStr = "<font size=2>" + strvar.join(", ") + ".</font>";

                        t.register(stringStr);
                        t.register("<b><font color=red>String Variables Total:</font></b> " + strvar.length + "<br>");
                    }

                    if (numvar.length !== 0) {
                        t.register("<font size=4 color=blue><b>Number Variables</b></font>");

                        var numberString = "<font size=2>" + numvar.join(", ") + ".</font>";

                        t.register(numberString);
                        t.register("<b><font color=blue>Number Variables Total:</font></b> " + numvar.length + "<br>");
                    }

                    if (boolvar.length !== 0) {
                        t.register("<font size=4 color=purple><b>Boolean Variables</b></font>");

                        var booleanString = "<font size=2>" + boolvar.join(", ") + ".</font>";

                        t.register(booleanString);
                        t.register("<b><font color=purple>Boolean Variables Total:</font></b> " + boolvar.length + "<br>");
                    }

                    if (arrvar.length !== 0) {
                        t.register("<font size=4 color=midnightblue><b>Array Variables</b></font>")

                        var arrayString = "<font size=2>" + arrvar.join(", ") + ".</font>";

                        t.register(arrayString);
                        t.register("<b><font color=midnightblue>Array Variables Total:</font></b> " + arrvar.length + "<br>");
                    }

                    if (objvar.length !== 0) {
                        t.register("<font size=4 color=goldenrod><b>Object Variables</b></font>")

                        var objectString = "<font size=2>" + objvar.join(", ") + ".</font>";

                        t.register(objectString);
                        t.register("<b><font color=goldenrod>Object Variables Total:</font></b> " + objvar.length + "<br>");
                    }

                    if (funvar.length !== 0) {
                        t.register("<font size=4 color=green><b>Function Variables</b></font>");

                        var functionString = "<font size=2>" + funvar.join(", ") + ".</font>";

                        t.register(functionString);
                        t.register("<b><font color=green>Function Variables Total:</font></b> " + funvar.length + "<br>");
                    }

                    if (nullvar.length !== 0) {
                        t.register("<font size=4 color=grey><b>Undefined Variables</b></font>");

                        var undefinedVar = "<font size=2>" + nullvar.join(", ") + ".</font>";

                        t.register(undefinedVar);
                        t.register("<b><font color=grey>Undefined Variables Total:</font></b> " + nullvar.length + "<br>");
                    }

                    t.register("<b><font color=blueviolet>Global Variables Total:</b> " + vars.length + "</font><br/>");

                    var scriptKeys = Object.keys(script).sort();
                    var scriptStr = scriptKeys.join(", ");

                    t.register("<font size=5><b>Events</b></font><br/>");
                    t.register("<small>" + scriptStr + ".</small>");
                    t.register("<b><font color=blueviolet>Events Total:</font></b> " + scriptKeys.length + " <br/>");

                    if (typeof ScriptLength_Lines == 'undefined') {
                        var servscript = sys.getFileContent("scripts.js");
                        ScriptLength_Lines = servscript.split("\n").length;
                        ScriptLength_Full = servscript.length;
                    }

                    t.register("<b><font size=4 color=forestgreen>Characters:</b></font> Estimated " + ScriptLength_Full);
                    t.register("<b><font size=4 color=darkblue>Lines:</b></font> " + ScriptLength_Lines + "<br/>");
                    t.register("<font color=green><b>Script:</b></font> © TheUnknownOne: <a href='" + ScriptURL + "'>" + ScriptURL + "</a></font>");

                    t.register("<b>Script Registered Date:</b></font> " + cache.get("Script_Registered"));
                    t.register("<b>Script Last Loaded Date:</b></font> " + cache.get("Script_LastLoad"));

                    t.register("<br/>Created and Maintained by <b>TheUnknownOne</b>.");
                    t.register("Credit to <b>Lutra</b> and <b>Intel_iX</b>.");
                    t.register("Special Thanks to <b>Lamperi</b> and <b>Mystra</b>.");
                    t.register("Styles and Rank Icons created by <b>Lutra</b>, <b>Intel_iX</b>, <b>person6445</b>, <b>Rigas</b>.");
                    t.register("<small>Thanks to the PO Dev Team for making Pokemon Online!</small>");

                    t.register(style.footer);
                    t.render(src, chan);
                },

                settings: function () {
                    var t = new Templater('Script Settings');

                    var g = function (str) {
                        return "<font color='green'><b>" + str + "</b></font>";
                    },
                        r = function (str) {
                            return "<font color='red'><b>" + str + "</b></font>";
                        }

                        check = function (compare, name, on, off) {
                            if (compare) {
                                t.register(name + " " + g(on) + ".");
                            } else {
                                t.register(name + " " + r(off) + ".");
                            }
                        }

                        check(AutoStartTours, "AutoStartTours is", "on", "off");

                    check(MessageEditor, "Grammar Corrector is", "on", "off");
                    check(UseIcons, "Rank Icons and BBCode are", "on", "off");

                    check(evallock, "Eval is", "locked", "not locked");

                    check(implock, "Impersonation for " + sLetter(UserName) + " is", "blocked", "not blocked");

                    check(CommandsEnabled.me, "Me is", "on", "off");
                    check(CommandsEnabled._catch_, "Catch is", "on", "off");
                    check(CommandsEnabled.roulette, "Roulette is", "on", "off");
                    check(CommandsEnabled.attack, "Attack is", "on", "off");

                    check(AutoKick, "Auto Kick is", "on", "off");
                    check(AutoMute, "Auto Mute is", "on", "off");

                    t.register("Server Auth Level 0 Name is " + UserName.bold().fontcolor("green") + ".");
                    t.register("Server Auth Level 1 Name is " + ModName.bold().fontcolor("blue") + ".");
                    t.register("Server Auth Level 2 Name is " + AdminName.bold().fontcolor("orange") + ".");
                    t.register("Server Auth Level 3 Name is " + OwnerName.bold().fontcolor("red") + ".");
                    t.register("Server Auth Level 4 Name is " + InvisName.bold() + ".<br/>");

                    t.register("Channel Auth Level 0 Name is " + ChanUser.bold().fontcolor("green") + ".");
                    t.register("Channel Auth Level 1 Name is " + ChanMod.bold().fontcolor("blue") + ".");
                    t.register("Channel Auth Level 2 Name is " + ChanAdmin.bold().fontcolor("orange") + ".");
                    t.register("Channel Auth Level 3 Name is " + ChanOwner.bold().fontcolor("red") + ".<br/>");

                    t.register("Tournament Auth Level 0 Name is " + Tour0.bold().fontcolor("limegreen") + ".");
                    t.register("Tournament Auth Level 1 Name is " + Tour1.bold().fontcolor("mediumblue") + ".<br/>");

                    t.register("Channel Tournament Auth Level 0 Name is " + ChanTour0.bold().fontcolor("limegreen") + ".");
                    t.register("Channel Tournament Auth Level 1 Name is " + ChanTour1.bold().fontcolor("mediumblue") + ".<br/>");

                    t.register("Maximum Message Length is " + String(MaxMessageLength).bold() + ".");
                    t.register("Tournament Display Mode is " + TourDisplay + ".");
                    t.register("The Future Limit is per " + FutureLimit + " seconds.<br/>");

                    t.register("The Bot name is " + Bot.bot.bold().fontcolor(Bot.botcolor) + "</i>.");

                    if (ClanTag != "" && ClanTag != "None") {
                        t.register("The Clan tag is " + ClanTag.bold() + ".");
                    }

                    t.register(style.footer);
                    t.render(src, chan);
                },

                rules: function () {
                    var t = new Templater(servername + ' Rules');

                    t.register("<b>1</b>) Do not spam or overuse CAPS. The bots can mute you for it.");
                    t.register("<b>2</b>) Do not flood or spam the chat. The bots can kick you for it.");
                    t.register("<b>3</b>) Do not complain about hax. It's part of the game.");
                    t.register("<b>4</b>) Do not time stall in a battle. 'Time Stalling' means you wait until your opponent forfeits by not making moves. If you are absent for a couple of minutes, say so.");
                    t.register("<b>5</b>) Do not troll. This is very, very annoying. Doing this will get you kicked, muted, or banned, on sight.");
                    t.register("<b>6</b>) Do not flame or insult. People don't like this.");
                    t.register("<b>7</b>) No sexism, racism, or anything similar to it is allowed.");
                    t.register("<b>8</b>) Do not advertise. Links like pictures and videos are Ok when they dont break the other rules.");
                    t.register("<b>9</b>) No obscene, pornographic, or illegal content. This will be an instant ban in most cases.");
                    t.register("<b>10</b>) Do not ask to be auth. Doing this will usually ruin your chances to ever be one.");
                    t.register("<b>11</b>) Do not mini-moderate. Mini-Moderating means you act like a Moderator, while your not. Contact an Authority instead.");
                    t.register("<b>12</b>) Do not ban evade. Doing so will result in an instant ban, or rangeban.");
                    t.register("<b>13</b>) Do not blackmail. This will result in an instant mute/ban/rangeban.");
                    t.register("<b>14</b>) Do not complain or brag.");

                    t.register("<br/><i>The authority of " + servername + " <u>do not</u> have to apply these rules.</i>");
                    t.register("<i>If the authority of " + servername + " think it is necessary to punish someone, then they are allowed to do so.</i>");
                    t.register("<br/>These rules may be changed at any time without notification.");

                    t.register(style.footer);
                    t.render(src, chan);
                },

                tourauthlist: function () {
                    var authlist = DataHash.megausers;
                    var count = objLength(authlist),
                        x;

                    if (count == 0) {
                        botMessage(src, "No " + sLetter(Tour1) + " at the moment!", chan);
                        return;
                    }

                    var t = new Templater(sLetter(Tour1));
                    t.register('');

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of " + sLetter(Tour1) + ":</font></b> " + count);
                    t.register(style.footer);
                    t.render(src, chan);
                },

                authlist: function () {
                    var authList = sys.dbAuths();
                    if (authList.length == 0) {
                        botMessage(src, "Sorry, no authority at the moment!", chan);
                        return;
                    }
                    var x, c_auth, c_authname, authlists = {
                        'invis': [],
                        'owner': [],
                        'admin': [],
                        'mod': []
                    };

                    for (x in authList) {
                        c_authname = authList[x];
                        c_auth = sys.dbAuth(c_authname);

                        if (c_auth > 3) {
                            authlists.invis.push(c_authname);
                        }
                        else if (c_auth == 3) {
                            authlists.owner.push(c_authname);
                        }
                        else if (c_auth == 2) {
                            authlists.admin.push(c_authname);
                        }
                        else {
                            authlists.mod.push(c_authname);
                        }
                    }

                    authlists.invis.sort();
                    authlists.owner.sort();
                    authlists.admin.sort();
                    authlists.mod.sort();

                    var t = new Templater('Server Authority');
                    var a = authlists,
                        c;

                    if (sys.auth(src) > 2) {
                        c = a.invis;
                        if (c.length != 0) {

                            t.register("<font color=black size=4><b>" + sLetter(InvisName) + " (" + c.length + ")</b></font><br/>")

                            for (x in c) {
                                t.register(playerInfo(c[x]));
                            }

                            t.register("");
                        }
                    }

                    c = a.owner;

                    if (c.length != 0) {
                        t.register("<font color=red size=4><b>" + sLetter(OwnerName) + " (" + c.length + ")</b></font><br/>");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    c = a.admin;

                    if (c.length != 0) {
                        t.register("<font color=orange size=4><b>" + sLetter(AdminName) + " (" + c.length + ")</b></font><br/>");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    c = a.mod;

                    if (c.length != 0) {
                        t.register("<font color=blue size=4><b>" + sLetter(ModName) + " (" + c.length + ")</b></font><br/>");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    t.register("<b><font color=blueviolet>Total Number of Authorities:</font></b> " + sendAuthLength(src));
                    t.register(style.footer);
                    t.render(src, chan);
                },

                autoidles: function () {
                    var authlist = DataHash.idles;
                    var count = objLength(authlist),
                        x;

                    if (count == 0) {
                        botMessage(src, "No one has Auto Idle.", chan);
                        return;
                    }

                    var t = new Templater("Auto Idles");
                    t.register('');

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of Auto Idles:</font></b> " + count);
                    t.register(style.footer);
                    t.render(src, chan);
                },

                voices: function () {
                    var authlist = DataHash.voices;
                    var count = objLength(authlist),
                        x;

                    if (count == 0) {
                        botMessage(src, "No one has Auto Idle.", chan);
                        return;
                    }

                    var t = new Templater("Voices");
                    t.register('');

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of Voices:</font></b> " + count);
                    t.register(style.footer);
                    t.render(src, chan);
                },

                evalops: function () {
                    var authlist = DataHash.evalops;
                    var count = objLength(authlist),
                        x;

                    if (count == 0) {
                        botMessage(src, "No one is Eval Operator.", chan);
                        return;
                    }

                    var t = new Templater("Eval Operators");
                    t.register('');

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of Eval Operators:</font></b> " + count);
                    t.register(style.footer);
                    t.render(src, chan);
                },

                /* -- User Templates: Tables -- */
                ranking: function () {
                    if (Config.NoCrash) {
                        botMessage(src, "This command has been disabled.", chan);
                        return;
                    }
                    if (!sys.ladderEnabled(src)) {
                        botMessage(src, "You don't have your ladder enabled! Enable it at Options->Enable Ladder.", chan);
                        return;
                    }

                    var r, name = sys.name(src),
                        pid = src,
                        list, ranking, rank, ladd, ladder, total, battles, mess_rank, x, i;

                    if (sys.name(tar) != undefined) {
                        name = sys.name(tar), pid = tar;
                        if (!sys.ladderEnabled(tar)) {
                            botMessage(src, "That person doesn't have laddering enabled!", chan);
                            return;
                        }
                    }

                    var tt = new Table_Templater("Ranking of " + name, "orange", "3");

                    if (sys.loggedIn(pid)) {
                        tt.register(["Team #", "Team Tier", "Ranked", "Rating", "Battles"], true);
                        for (i = 0; i < sys.teamCount(pid); i++) {
                            list = sys.tier(src, i);
                            ranking = "unranked";
                            rank = sys.ranking(name, i);

                            if (!isNaN(rank)) {
                                ranking = rank;
                            }

                            ladd = sys.ladderRating(name, i);
                            ladder = "1000";

                            if (ladd != undefined) {
                                ladder = ladd;
                            }

                            total = sys.totalPlayersByTier(list);
                            battles = sys.ratedBattles(name, i);

                            mess_rank = "unranked";
                            if (ranking != "unranked") {
                                mess_rank = ranking + "/" + total;
                            }

                            tt.register([(i + 1), list, mess_rank, ladder, battles], false);
                        }
                    } else {
                        tt.register(["Tier", "Ranked", "Rating", "Battles"], true);
                        var list = sys.getTierList();
                        for (i = 0; i < list.length; i++) {
                            list = list[i];
                            ranking = "unranked";
                            rank = sys.ranking(name, list);

                            if (!isNaN(rank)) {
                                ranking = rank;
                            }

                            ladd = sys.ladderRating(name, list);
                            ladder = "1000";

                            if (ladd != undefined) {
                                ladder = ladd;
                            }

                            total = sys.totalPlayersByTier(list);
                            battles = sys.ratedBattles(name, list);

                            mess_rank = "unranked";
                            if (ranking != "unranked") {
                                mess_rank = ranking + "/" + total;
                            }

                            tt.register([list, mess_rank, ladder, battles], false);
                        }

                    }


                    tt.render(src, chan);
                },

                /* -- User Commands: Idle -- */
                idle: function () {
                    var idle = !sys.away(src),
                        str;

                    if (idle == 1) {
                        str = "You are now idling.";
                    }
                    else {
                        str = "You are now back.";
                    }

                    sys.changeAway(src, idle);
                    botMessage(src, str, chan);
                },

                /* -- User Commands: Future -- */
                future: function () {
                    mcmd[0] = parseInt(mcmd[0]);
                    var isnan = isNaN(mcmd[0]) || mcmd[0] == undefined;
                    if (isnan) {
                        botMessage(src, "Specify time!", chan);
                        return;
                    }

                    var msg = mcmd[1] == undefined;
                    if (msg) {
                        botMessage(src, "Specify a message!", chan);
                        return;
                    }

                    if (mcmd[0] < 5 || mcmd[0] > 5 * 60 * 60) {
                        botMessage(src, "The time must be over 5 seconds and be under 5 hours (" + Number(5 * 60 * 60) + " seconds).", chan);
                        return;
                    }

                    var t = Number(sys.time());
                    if (poUser.lastFuture != 0) {
                        if (poUser.lastFuture > t) {
                            botMessage(src, "Please wait " + getTimeString(poUser.lastFuture - t) + " before using another future.", chan);
                            return;
                        }
                    }

                    poUser.lastFuture = t + FutureLimit
                    var Message = cut(mcmd, 1, ':');
                    sys.callLater("script.beforeChatMessage(" + src + ", '" + String(Message) + "', " + chan + ");", parseInt(mcmd[0]));
                    botMessage(src, "Your message was sent " + getTimeString(mcmd[0]) + " into the future!", chan);
                },

                /* -- User Commands: MOTD -- */
                viewmotd: function () {
                    if (motd) {
                        var MOTDSetter = cache.get("MOTDSetter");
                        var MOTD = cache.get("MOTDMessage");
                        sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day: </b></font>' + MOTD, chan);
                        sys.sendHtmlMessage(src, '<font color=darkred><timestamp/><b>Set By: </b></font>' + MOTDSetter, chan);
                    }
                    else {
                        sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day:</b></font> Enjoy your stay at ' + servername + '!', chan);
                    }
                },

                /* -- User Commands: Ping */
                ping: function () {
                    tar = sys.id(mcmd[0]);
                    if (mcmd[1] == undefined) {
                        tar = sys.id(commandData);
                    }

                    if (tar == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }

                    var msg = true;
                    if (isEmpty(mcmd[1])) {
                        mcmd[1] = "", msg = false;
                    }

                    if (unicodeAbuse(src, mcmd[1])) {
                        if (!sys.loggedIn(src)) {
                            return;
                        }
                        botMessage(src, "Ping sent to " + sys.name(tar) + "!", chan);
                        return;
                    }

                    botMessage(src, "Ping sent to " + sys.name(tar) + "!", chan);
                    if (msg) {
                        mcmd[1] = cut(mcmd, 1, ':');
                        botMessage(tar, sys.name(src) + " has pinged you and sent the following message: " + html_escape(mcmd[1]) + "<ping/>");
                        return;
                    }
                    botMessage(tar, sys.name(src) + " has pinged you!<ping/>");
                },

                /* -- User Commands: Poll */
                vote: function () {
                    if (!Poll.mode) {
                        botMessage(src, "No poll is going on.", chan);
                        return;
                    }
                    var datanum = parseInt(commandData);
                    if (!Poll.options.hasOwnProperty(datanum)) {
                        botMessage(src, "Invalid option.", chan);
                        return;
                    }
                    if (Poll.options[datanum].votes.indexOf(ip) > -1) {
                        botMessage(src, "You already voted!", chan);
                        return;
                    }
                    Poll.options[datanum].votes.push(ip);
                    Poll.votes++;
                    botMessage(src, "Voted option " + datanum + " (" + Poll.options[datanum].name + ") on the poll", chan);
                },

                viewpoll: function () {
                    if (!Poll.mode) {
                        botMessage(src, "No poll is going on.", chan);
                        return;
                    }

                    botMessage(src, "Poll started by " + Poll.starter.bold() + "!", chan);

                    var x, current_votes, option;
                    for (x in Poll.options) {
                        option = Poll.options[x].name;
                        botMessage(src, x + ". " + option, chan)
                    }

                    sys.sendMessage(src, '', chan);

                    if (Poll.votes === 0) {
                        botMessage(src, "No one voted yet.", chan);
                        return;
                    }

                    botMessage(src, Poll.subject + " - Results so far:", chan);

                    for (x in Poll.options) {
                        option = Poll.options[x];
                        current_votes = option.votes;
                        botMessage(src, x + ". " + option.name + " - " + current_votes.length, chan);
                    }
                },

                /* -- User Commands: Macro -- */
                macro: function () {
                    mcmd[1] = cut(mcmd, 1, ':');

                    if (isEmpty(mcmd[1])) {
                        botMessage(src, "Your macros are: " + poUser.macro.join(", "), chan);
                        return;
                    }

                    mcmd[1] = html_escape(mcmd[1]);
                    var num = Math.round(mcmd[0] * 1);
                    if (num > 5 || num < 1) {
                        botMessage(src, "Specify a range of 1-5", chan);
                        return;
                    }

                    poUser.macro[num - 1] = mcmd[1];
                    var toL = sys.name(src).toLowerCase();
                    if (typeof DataHash.macros[toL] != "object") DataHash.macros[toL] = ["%m1", "%m2", "%m3", "%m4", "%m5"];

                    DataHash.macros[toL] = poUser.macro;

                    botMessage(src, "You changed macro " + num + " to: " + mcmd[1], chan);
                },

                /* -- User Commands: Fun -- */
                "catch": function () {
                    if (!CommandsEnabled._catch_) {
                        botMessage(src, fullCommand + " is turned off!", chan);
                        return;
                    }

                    if (testMafiaChat(src, chan)) {
                        return;
                    }

                    var num = sys.rand(1, 649),
                        pokemon = sys.pokemon(num),
                        nature = sys.nature(sys.rand(1, 24)),
                        rand = sys.rand(30, 531),
                        shiny = sys.rand(30, 531),
                        ivs, lvl = sys.rand(1, 101),
                        x;

                    for (x = 0; x <= 6; x++) {
                        ivs.push(sys.rand(0, 32));
                    }

                    if (shiny != rand) {
                        botMessage(src, formatPoke(num, false, false, 0, 5) + " " + formatPoke(num, false, true, 0, 5), chan);
                        botAll(sys.name(src) + " has caught a level " + lvl + " " + pokemon + " with a " + nature + " nature!", chan);
                        botMessage(pokemon + " has the following IVs:", chan);
                        botMessage(src, "HP: " + ivs[0] + " Atk: " + ivs[1] + " Def: " + ivs[2] + " SpA: " + ivs[3] + " SpD: " + ivs[4] + " Spd: " + ivs[5] + ".", chan);
                    }
                    else {
                        botMessage(formatPoke(num, true, false, 0, 5) + " " + formatPoke(num, true, true, 0, 5), chan);
                        botAll(sys.name(src) + " has caught a level " + lvl + " shiny " + pokemon + " with a " + nature + " nature!", chan);
                        botMessage(src, pokemon + " has the following IVs:", chan);
                        botMessage(src, "HP: " + ivs[0] + " Atk: " + ivs[1] + " Def: " + ivs[2] + " SpA: " + ivs[3] + " SpD: " + ivs[4] + " Spd: " + ivs[5] + ".", chan);
                        botAll("This is truly a rare event", chan);
                    }
                },

                attack: function () {
                    if (!CommandsEnabled.attack) {
                        botMessage(src, "/attack is turned off!", chan);
                        return;
                    }
                    if (testMafiaChat(src, chan)) {
                        return;
                    }
                    if (poUser.capsMute(commandData, chan)) {
                        return;
                    }

                    if (commandData.length > 25) {
                        botMessage(src, "The persons name must be under 26 characters.", chan);
                        return;
                    }

                    if (typeof AttackingMoves == "undefined") {
                        AttackingMoves = [];
                        var file = sys.getFileContent("db/moves/5G/damage_class.txt").split("\n"),
                            arr = AttackingMoves,
                            x;

                        for (x in file) {
                            if (file[x] == "0 0") {
                                continue;
                            }

                            arr.push(Number(file[x].split(" ")[0]));
                        }
                    }

                    var attack = AttackingMoves[Math.floor(AttackingMoves.length * Math.random())],
                        getcolor = script.namecolor(tar);
                    attack = sys.move(attack);

                    if (unicodeAbuse(src, commandData)) {
                        if (!sys.loggedIn(src)) {
                            return;
                        }
                        botMessage(src, "<font color=" + getColor + "><b>" + html_escape(sys.name(src)) + "</b></font></font> has used " + attack + " on <b><font color=" + getcolor + ">" + html_escape(commandData) + "</font></b>!", chan);
                        return;
                    }

                    botAll("<font color=" + getColor + "><b>" + html_escape(sys.name(src)) + "</b></font></font> has used " + attack + " on <b><font color=" + getcolor + ">" + html_escape(commandData) + "</font></b>!", chan);
                    return;
                },

                roulette: function () {
                    if (!CommandsEnabled.roulette) {
                        botMessage(src, fullCommand + " is turned off!", chan);
                        return;
                    }
                    if (testMafiaChat(src, message)) {
                        return;
                    }

                    var randpoke = sys.rand(1, 494),
                        rand = sys.rand(1, 4),
                        poke, shine;

                    if (rand == 1 || rand == 3) {
                        poke = formatPoke(randpoke, false, false, false, 5, true)
                        shine = "";
                    }
                    else {
                        poke = formatPoke(randpoke, true, false, false, 5, true)
                        shine = "Shiny ";
                    }

                    var toAll = "<font color='" + getColor + "'><b>" + html_escape(sys.name(src)) + "</b></font> got " + an(shine + sys.pokemon(randpoke)) + "!";

                    botMessage(src, toAll + " " + poke, chan);
                    botAllExcept(src, toAll, chan, botAllExcept.Normal);

                    return;
                },

                /* -- User Commands: CommandStats */
                commandstats: function () {
                    var num = Number(commandData);
                    if (num > objLength(CommandStats.stats.commands)) {
                        CommandStats.display(src, chan, Number(commandData));
                    }
                },

                /* -- User Commands: Mail */
                sendmail: function () {
                    if (dbIp == undefined) {
                        botMessage(src, "This person doesn't exist!", chan);
                        return;
                    }

                    if (mcmd[1] == undefined) {
                        botMessage(src, "Specify a title!", chan);
                        return;
                    }

                    if (mcmd[2] == undefined) {
                        botMessage(src, "Specify text!", chan);
                        return;
                    }

                    if (typeof(DataHash.mail[mcmd[0].toLowerCase()]) == "undefined") {
                        DataHash.mail[mcmd[0].toLowerCase()] = [];
                    }

                    if (typeof(DataHash.mail["SENT_" + sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                    }

                    result = cut(mcmd, 2, ':');

                    DataHash.mail[mcmd[0].toLowerCase()].push(new Mail(sys.name(src), result, mcmd[1]));
                    DataHash.mail["SENT_" + sys.name(src).toLowerCase()].push(new Mail(mcmd[0], result, mcmd[1]));

                    botMessage(src, "Mail sent! A copy of the mail was also sent to your sent mails box. Type /sentmails to view.", chan);

                    if (tar != undefined) {
                        botMessage(tar, "You got mail from " + sys.name(src) + "! Type /readmail to view .<ping/>", 0);
                    }

                    cache.write("mail", JSON.stringify(DataHash.mail));
                },
                sentmails: function () {
                    if (typeof(DataHash.mail["SENT_" + sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (DataHash.mail["SENT_" + sys.name(src).toLowerCase()].length < 1) {
                        botMessage(src, "You don't have any sent mails!", chan);
                        return;
                    }

                    botMessage(src, "Here are your sent mails:", chan);

                    var read = "",
                        y, mail = DataHash.mail["SENT_" + sys.name(src).toLowerCase()];

                    var arr = [];
                    for (y in mail) {
                        var m = mail[y];
                        arr.push("<b>" + format("lvl0", html_escape(m.title)) + "</b>: Sent to " + m.sender + " on " + m.sendtime + " (" + getTimeString(sys.time() * 1 - m.sendAgo) + " ago)", "<i>" + format("lvl0", html_escape(m.text)) + "</i>");
                    }

                    arr.push('');
                    sys.sendHtmlMessage(src, arr.join("<br/>"), chan);
                },
                deletesent: function () {
                    if (typeof(DataHash.mail["SENT_" + sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (DataHash.mail["SENT_" + sys.name(src).toLowerCase()].length < 1) {
                        botMessage(src, "You don't have any sent mails!", chan);
                        return;
                    }

                    DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                    botMessage(src, "Sent Mail deleted!", chan);
                    cache.write("mail", JSON.stringify(DataHash.mail));
                },
                readmail: function () {
                    if (typeof(DataHash.mail[sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail[sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (typeof(DataHash.mail["SENT_" + sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail["SENT_" + sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (DataHash.mail[sys.name(src).toLowerCase()].length < 1) {
                        botMessage(src, "You don't have any mail!", chan);
                        return;
                    }

                    botMessage(src, "Here is your mail:", chan);

                    var arr = [];
                    var read = "",
                        y, mail = DataHash.mail[sys.name(src).toLowerCase()],
                        save = false;
                    var time = sys.time() * 1;

                    for (y in mail) {
                        var m = mail[y];
                        read = "[<b><font color=blue>Old</font></b>]";

                        if (!m.read) {
                            read = "[<b><font color=red>New</font></b>]";
                            m.read = true;
                            save = true;
                        }

                        arr.push(
                        read + " <b>" + format("lvl0", html_escape(m.title)) + "</b>: Sent by " + m.sender + " on " + m.sendtime + " (" + getTimeString(time - m.sendAgo) + " ago)", "<i>" + format("lvl0", html_escape(m.text)) + "</i>");
                    }

                    if (save) {
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    arr.push('');
                    sys.sendHtmlMessage(src, arr.join("<br>"), chan);
                },
                deletemail: function () {
                    if (typeof(DataHash.mail[sys.name(src).toLowerCase()]) == "undefined") {
                        DataHash.mail[sys.name(src).toLowerCase()] = [];
                        cache.write("mail", JSON.stringify(DataHash.mail));
                    }

                    if (DataHash.mail[sys.name(src).toLowerCase()].length < 1) {
                        botMessage(src, "You don't have any mail!", chan);
                        return;
                    }

                    DataHash.mail[sys.name(src).toLowerCase()] = [];
                    botMessage(src, "Mail deleted!", chan);
                    cache.write("mail", JSON.stringify(DataHash.mail));
                },

                /* -- User Commands: Rank Icons */
                changeicon: function () {
                    if (isEmpty(commandData)) {
                        botMessage(src, "Specify an icon!", chan);
                        return;
                    }
                    var resets = ['reset', 'remove', 'delete', 'off'];

                    if (resets.indexOf(cmdData) > -1 && DataHash.rankicons[sys.name(src).toLowerCase()] != undefined) {
                        botMessage(src, "Removed rank icon.", chan);

                        poUser.icon = "";
                        delete DataHash.rankicons[sys.name(src).toLowerCase()];

                        cache.write("rankicons", JSON.stringify(DataHash.rankicons));
                        return;
                    }

                    if (commandData.length != 1) {
                        botMessage(src, "You can only specify one character for your rank icon!", chan);
                        return;
                    }

                    if (commandData == "<" && (sys.auth(src) < 4 && Config.HighPermission[sys.name(src)] !== undefined && Config.HighPermission[sys.name(src)][1] !== 3)) {
                        botMessage(src, "Can't pick this icon!", chan);
                        return;
                    }

                    poUser.icon = commandData;
                    DataHash.rankicons[sys.name(src).toLowerCase()] = commandData;
                    cache.write("rankicons", JSON.stringify(DataHash.rankicons));

                    botMessage(src, "Rank icon changed to " + commandData + "!", chan);
                },

                icons: function () {
                    IconManager.iconInfo(src, chan);
                },

                /* -- User Commands: Register */
                unregister: function () {
                    var name = sys.name(src);
                    if (!sys.dbRegistered(name)) {
                        botMessage(src, "You can't unregister an alias which is not registered!", chan);
                        return;
                    }
                    sys.clearPass(name);
                    botMessage(src, "Your password was succesfully cleared!", chan);
                    sys.sendNetworkCommand(src, 14);
                    if (sys.auth(src) > 0) {
                        sendAuth(name + " cleared their password!");
                        botMessage(src, "Please register again (before logging out)! This is for the safety of the server!", chan);
                    }
                },

                /* -- User Commands: Styles */
                styles: function () {
                    StyleManager.styleInfo(src, chan);
                },

                /* -- User Commands: Trivia */
/*
                a: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.a(src, commandData);
                },
                submit: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.submit(src, mcmd);
                },
                leaderboard: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.leaderboardDisplay(src, commandData);
                },
                questions: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.questionList(src, commandData);
                },
                question: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.viewQuestion(src, commandData);
                },
				*/

                /* -- User Commands: Messaging */
                me: function () {
                    if (!CommandsEnabled.me) {
                        botMessage(src, fullCommand + " is turned off.", chan);
                        return;
                    }
                    if (commandData == "") {
                        botMessage(src, "Specify a message to send.", chan);
                        return;
                    }
                    if (testMafiaChat(src, message)) {
                        return;
                    }

                    if (poUser.capsMute(commandData, chan)) {
                        return;
                    }

                    if (unicodeAbuse(src, commandData)) {
                        if (!sys.loggedIn(src)) {
                            return;
                        }
                        sys.sendHtmlMessage(src, "<font color=" + getColor + "><timestamp/><i><b>*** " + sys.name(src) + "</b> " + format(src, html_escape(commandData)) + "</font></b></i>", chan);
                        return;
                    }

                    sys.sendHtmlAll("<font color=" + getColor + "><timestamp/><i><b>*** " + sys.name(src) + "</b> " + format(src, html_escape(commandData)) + "</font></b></i>", chan);
                },

                /* -- User Commands: Auth */
                callauth: function () {
                    if (mcmd[0] == undefined) {
                        botMessage(src, "Please select an auth level or auth name for the /callauth", chan);
                        return;
                    }

                    var h = mcmd[0].toLowerCase();

                    var l = function (v) {
                        return String(v).toLowerCase();
                    }

                    if (h != "1" && h != "2" && h != "3" && h != l(ModName) && h != l(AdminName) && h != l(OwnerName)) {
                        botMessage(src, "Please select an auth level or auth name for the /callauth", chan);
                        return;
                    }

                    var a = h;
                    if (l(ModName) == a) {
                        a = 1;
                    }
                    else if (l(AdminName) == a) {
                        a = 2;
                    }
                    else if (l(OwnerName) == a) {
                        a = 3;
                    }
                    else {
                        a = Number(a);
                    }

                    var y, PL = sys.playerIds(),
                        count = 0;

                    for (y in PL) {
                        var t = PL[y];
                        if (sys.auth(t) == a) {
                            count++;

                            botMessage(t, sys.name(src) + " has called you!<ping/>", 0);
                        }
                    };

                    if (count === 0) {
                        botMessage(src, "No auths could be pinged.", chan);
                        return;
                    }

                    var s = "s";
                    if (count < 2) {
                        s = "";
                    }

                    botMessage(src, count + " auth" + s + " could be pinged.", chan);
                },

                /* -- User Commands: Team */
                team: function () {
                    script.importable(src, src, chan);
                },

                /* -- User Commands: Impersonation */
                imp: function () {
                    if (implock && sys.auth(src) < 1) {
                        botMessage(src, 'Imping has been locked for ' + sLetter(UserName) + '.', chan);
                        return;
                    }

                    if (poUser.capsMute(commandData, chan)) {
                        return;
                    }

                    if (unicodeAbuse(src, commandData)) {
                        if (!sys.loggedIn(src)) {
                            return;
                        }
                        sendFailWhale(src, chan);
                        if (sys.auth(src) < 1) {
                            kick(src);
                        }
                        return;
                    }

                    if (commandData == '') {
                        botMessage(src, "Specify a name!", chan);
                        return;
                    }

                    if (commandData.length > 20) {
                        botMessage(src, "Maximum characters allowed: 20. Current: " + commandData.length, chan);
                        return;
                    }

                    if (commandData == "off") {
                        delete poUser.impersonation;
                        botMessage(src, "Now you are yourself again!", chan);
                        return;
                    }

                    poUser.impersonation = commandData;

                    if (sys.auth(src) == 0) {
                        sendAuth(poUser.impersonation + " was impersonated by " + sys.name(src) + "!");
                    }

                    botMessage(src, "Now you are " + poUser.impersonation + "!", chan);
                },

                impoff: function () {
                    if (implock && sys.auth(src) < 1) {
                        botMessage(src, "Imping has been locked for " + sLetter(UserName) + ".", chan);
                        return;
                    }
                    if (poUser.impersonation == undefined) {
                        botMessage(src, "You currently don't have any impersonation.", chan);
                        return;
                    }

                    delete poUser.impersonation;
                    botMessage(src, "Now you are yourself again!", chan);
                },

                /* -- User Commands: Battle Points */
                battlepoints: function () {
                    var name = sys.name(src).toLowerCase();
                    var hash = DataHash.money;
                    if (hash[name] == undefined) hash[name] = 0;
                    var displaystr = 'You have {{{money}}} battle points.';

                    if (dbIp != undefined && !isEmpty(commandData)) {
                        if (hash[cmdData] == undefined) hash[cmdData] = 0;

                        displaystr = commandData + ' has {{{money}}} battle points.';
                        name = cmdData;
                    }

                    hash = hash[name];
                    botMessage(src, displaystr.replace(/{{{money}}}/gi, hash), chan);
                    return;
                }
            });

            /* -- User Commands */
            userCommands[removespaces(UserName).toLowerCase() + "commands"] = function () {
                var ct = new Command_Templater(UserName + ' Commands');

                ct.register("funcommands", "Displays Fun Commands.");
                ct.register("mailcommands", "Displays Mail Commands.");
                ct.register("infocommands", "Displays Information Commands.");

                ct.register("ping", ["{r Person}", "<u>{p Message}</u>"], "Pings someone and displays an optional message.");
                ct.register("callauth", ["{b AuthLevel/AuthName}"], "Pings all authority of a certain level or name.");
                ct.register("idle", "Reverses your away status.");

                if (Clantag.full != "None" && Clantag.full != "") {
                    ct.register("join" + Clantag.fullTextLower, "Lets you join the " + Clantag.fullText.bold() + " clan.");
                    ct.register("unjoin" + Clantag.fullTextLower, "Lets you unjoin the " + Clantag.fullText.bold() + " clan.");
                }

                if (Poll.mode) {
                    ct.register("viewpoll", "Displays Poll Information.");
                    ct.register("vote", ["{o Option}"], "Lets you vote in the poll.");
                }

                ct.register("unregister", "Clears your password.");
                ct.register("macro", ["{b 1-5}", "{p Message}"], "Changes one of your five macros. If no macro is specified, displays your macro. %m(macronumber) is replaced by that macro in your message (this adds up to your caps and flood count, and can be used for commands).");

                if (!implock) {
                    ct.register("imp", ["{p Thing}"], "Impersonates something.");
                    ct.register("impoff", "Deletes your impersonation.");
                }
                ct.register(style.footer);
                ct.render(src, chan);
            }

            /* -- User Commands: Clan */
            if (Clantag.full != "None" && Clantag.full != "") {
                userCommands["join" + Clantag.fullTextLower] = function () {
                    var name = sys.name(src);
                    if (name.substr(0, Clantag.full.length) == Clantag.full) {
                        botMessage(src, "You already joined the " + Clantag.full + " clan!", chan);
                        return;
                    }
                    if (sys.id(Clantag.full + name) != undefined) {
                        botMessage(src, "Someone with your name and that tag is already online.", chan);
                        return;
                    }
                    if (ify.onChangeName() == "disallow") {
                        botMessage(src, "Ify is active. You can't join the clan now!", chan);
                        return;
                    }
                    var newName = Clantag.full + sys.name(src);
                    if (newName.length > 20) {
                        botMessage(src, "Please make your name shorter.", chan);
                        return;
                    }
                    botAll(sys.name(src) + " joined the " + Clantag.full.bold() + " clan!", 0);
                    sys.changeName(src, newName);
                }

                userCommands["unjoin" + Clantag.fullTextLower] = function () {
                    var name = sys.name(src);
                    if (name.substr(0, Clantag.full.length) != Clantag.full) {
                        botMessage(src, "You didn't join the " + Clantag.full + " clan!", chan);
                        return;
                    }
                    if (ify.onClanCommand() == "disallow") {
                        botMessage(src, "Ify is active. You can't unjoin the clan now!", chan);
                        return;
                    }

                    var without = name.substr(Clantag.full.length);
                    if (sys.id(without) != src && sys.id(without) != undefined) {
                        botMessage(src, "Someone with your name without the tag is already online.", chan);
                        return;
                    }
                    botAll(sys.name(src) + " unjoined the " + Clantag.full.bold() + " clan!", 0);
                    sys.changeName(src, without);
                }
            }

            /* -- Channel Commands: Start */
            channelCommands = ({ /* -- Channel Templates: Commands */
                channelcommands: function () {
                    var ct = new Command_Templater('Channel Commands', true);

                    ct.span(ChanUser + " Commands");

                    ct.register("csettings", "Displays Channel Settings and information.");
                    ct.register("cauth", "Displays Channel Authority.");
                    ct.register("topic", "Displays Channel Topic.");

                    if (poChan.isChanMod(src) || !noPermission(src, 1)) {
                        ct.span(ChanMod + " Commands");

                        if (!noPermission(src, 1)) {
                            ct.register("perm", ["{b On/Off}"], "Makes the channel permanent or temporally.");
                        }
                        ct.register("channelwall", ["{p Message}"], "Announces something in this channel.");
                        ct.register("channelhtmlwall", ["{p Message}"], "Announces something with HTML in this channel.");
                        ct.register("html", ["{p Message}"], "Sends a message to everyone with HTML.");
                        ct.register("channelkick", ["{r Person}", "{p <u>Reason</u>}"], "Kicks someone from this channel.");
                        ct.register("channelmute", ["{or Person}", "<u>{o Time}</u>", "{bv <u>Time Unit</b>}", "<u>{p Reason}</u>"], "Mutes someone in this channel.");
                        ct.register("channelunmute", ["{or Person}", "<u>{p Reason}</u>"], "Unmutes someone in this channel.");
                        ct.register("invite", ["{r Player}"], "Invites someone to this channel.");
                        ct.register("topic", ["{p Message}"], "Changes the channel topic. If message is default, changes the Topic back to it's default.");
                        ct.register("cbanlist", "Displays Channel Banlist.");
                        ct.register("cmutelist", "Displays Channel Mutelist.");
                        ct.register("csilence", "Silences everyone whos channel authority is lower than yours.");
                        ct.register("cunsilence", "Unsilences the channel.");
                        ct.register("chatcolor", ["{p Color}", "{p Second Color}"], "Adds a Chat Color to the channel. If color is random, then uses a random color.");
                        ct.register("chatcoloroff", "Removes Chat Color in the channel.");
                    }

                    if (poChan.isChanAdmin(src) || !noPermission(src, 2)) {
                        ct.span(ChanAdmin + " Commands");

                        if (!noPermission(src, 2)) {
                            ct.register("destroychannel", "Destroys this channel.");
                        }

                        ct.register("installtour", "Installs tournaments in this channel.");
                        ct.register("uninstalltour", "Uninstalls tournaments in this channel.");

                        ct.register(removespaces(ChanUser).toLowerCase(), ["{or Person}"], "Makes someone " + ChanUser + " in this channel.");
                        ct.register(removespaces(ChanMod).toLowerCase(), ["{or Person}"], "Makes someone " + ChanMod + " in this channel.");
                        ct.register(removespaces(ChanTour0).toLowerCase(), ["{or Person}"], "Makes someone " + ChanTour0 + " in this channel.");
                        ct.register(removespaces(ChanTour1).toLowerCase(), ["{or Person}"], "Makes someone " + ChanTour1 + " in this channel.");

                        ct.register("channel", ["{b Ban/Unban}", "{or Person}", "<u>{o Time}</u>", "{bv <u>Time Unit</b>}", "<u>{p Reason}</u>"], "Bans or unbans someone from this channel.", true);
                    }

                    if (poChan.isChanOwner(src) || !noPermission(src, 2)) {
                        ct.span(ChanOwner + " Commands");

                        if (noPermission(src, 2)) {
                            ct.register("destroychannel", "Destroys the channel.");
                        }

                        ct.register("channelprivate", "Makes the channel auth-only and kicks everyone who isn't channel auth.");
                        ct.register("channelpublic", "Lets everyone back in.");
                        ct.register(removespaces(ChanAdmin).toLowerCase(), ["{or Person}"], "Makes someone " + ChanAdmin + " in this channel.");
                        ct.register(removespaces(ChanOwner).toLowerCase(), ["{or Person}"], "Makes someone " + ChanOwner + " in this channel.");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                /* -- Channel Templates: Normal */
                ctourauthlist: function () {
                    var authlist = poChan.tourAuth,
                        count = objLength(authlist);

                    if (count === 0) {
                        botMessage(src, "No " + sLetter(ChanTour1) + " at the moment!", chan);
                        return;
                    }

                    var t = new Templater(sLetter(ChanTour1));
                    t.register("");

                    for (x in authlist) {
                        t.register(playerInfo(x));
                    }

                    t.register("<br/><b><font color=blueviolet>Total Number of " + sLetter(ChanTour1) + ":</font></b> " + count);
                    t.register(style.footer);
                    t.render(src, chan);
                },

                csettings: function () {
                    var t = new Templater('Channel Settings');

                    var g = function (str) {
                        return "<font color='green'><b>" + str + "</b></font>";
                    },
                        r = function (str) {
                            return "<font color='red'><b>" + str + "</b></font>";
                        }

                        if (poChan.perm) {
                            t.register("The Channel is " + g("permanent") + ".");
                        }
                        else {
                            t.register("The Channel is " + r("temporal") + ".");
                        }

                        if (!poChan.private) {
                            t.register("The Channel is " + g("open") + ".");
                        }
                        else {
                            t.register("The Channel is " + r("private") + ".");
                        }

                        if (poChan.defaultTopic) {
                            t.register("The Channel is " + g("using a default topic") + ".");
                        }
                        else {
                            t.register("The Channel is " + r("using a custom topic") + ".");
                        }

                        if (poChan.toursEnabled) {
                            t.register("The Channel has " + g("tours installed") + ".");
                        }
                        else {
                            t.register("The Channel doesn't have " + r("tours installed") + ".");
                        }

                        if (chatcolor) {
                            t.register("The Channel has " + g("chat color enabled") + ".");
                        } else {
                            t.register("The Channel has " + r("chat color disabled") + ".");
                        }

                        if (poChan.toursEnabled) {
                            if (poChan.tour.AutoStartBattles) {
                                t.register("Auto Start Battles for this channel is " + g("on") + ".");
                            }
                            else {
                                t.register("Auto Start Battles for this channel is " + r("off") + ".<br/>");
                            }
                        }

                        if (poChan.creator != '' && poChan.creator != '~Unknown~') {
                            t.register("The Channel Creator is " + poChan.creator.bold().fontcolor("green") + ".");
                        }

                        t.register("The Channel Topic is " + poChan.topic + ".");
                    if (poChan.topicsetter != '') {
                        t.register("The Channel Topic Setter is " + poChan.topicsetter + ".");
                    }

                    t.register("");

                    t.register("The Channel Silence level is " + String(poChan.silence).bold().fontcolor("blue") + ".");
                    t.register("The Channel ID is " + String(chan).bold().fontcolor("orange") + ".<br/>");

                    t.register("The Channel Name is " + poChan.name.bold().fontcolor("red") + ".");

                    t.register(style.footer);
                    t.render(src, chan);
                },

                cauth: function () {
                    var authList = poChan.chanAuth,
                        x, cauth, auths = {
                            'mods': [],
                            'admins': [],
                            'owners': []
                        },
                        authTotal = objLength(authList);

                    if (authTotal == 0) {
                        botMessage(src, "No one is auth in this channel.", chan);
                        return;
                    }


                    for (x in authList) {
                        cauth = authList[x];
                        if (cauth === 3) {
                            auths.owners.push(x);
                        } else if (cauth === 2) {
                            auths.admins.push(x);
                        }
                        else {
                            auths.mods.push(x);
                        }
                    }

                    var t = new Templater("Channel Authority");

                    var c = auths.owners;
                    if (c.length != 0) {
                        t.register("<font color=red size=4><strong>" + sLetter(ChanOwner) + " (" + c.length + ")</strong></font>");
                        t.register("");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    c = auths.admins;
                    if (c.length != 0) {
                        t.register("<font color=orange size=4><strong>" + sLetter(ChanAdmin) + " (" + c.length + ")</strong></font>");
                        t.register("");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    c = auths.mods;
                    if (c.length != 0) {
                        t.register("<font color=blue size=4><strong>" + sLetter(ChanMod) + " (" + c.length + ")</strong></font>");
                        t.register("");

                        for (x in c) {
                            t.register(playerInfo(c[x]));
                        }

                        t.register("");
                    }

                    t.register("<b><font color=blueviolet>Total Number of Channel Authorities:</b></font> " + authTotal);
                    t.register(style.footer);
                    t.render(src, chan);
                },

                /* -- Channel Templates: Tables */
                cbanlist: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    Prune.channelBans(chan);
                    var bans = poChan.banlist;

                    if (objLength(bans) === 0) {
                        botMessage(src, "No one is banned in this channel.", chan);
                        return;
                    }

                    var last, lastname, l, add, t, n = sys.time() * 1,
                        perm = !noPermission(src, 1),
                        y;

                    var tt = new Table_Templater('Channel Banlist', 'red', '3');
                    if (perm) {
                        add = ["IP", "Banned Name", "Banned By", "Reason", "Time", "Last Used Name"];
                    }
                    else {
                        add = ["Banned Name", "Banned By", "Reason", "Time", "Last Used Name"];
                    }

                    tt.register(add, true);

                    for (y in bans) {
                        last = "N/A", lastname = lastName(y), l = bans[y], t = getTimeString(l.time - n);
                        if (lastname !== undefined) {
                            last = lastname;
                        }
                        if (perm) {
                            add = [y, l.who, l.by, l.why, t, last];
                        }
                        else {
                            add = [l.who, l.by, l.why, t, last];
                        }
                        tt.register(add, false);
                    }

                    tt.render(src, chan);
                },

                cmutelist: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    Prune.channelMutes(chan);

                    var mutes = poChan.mutelist;

                    if (objLength(mutes) == 0) {
                        botMessage(src, "No one is muted in this channel.", chan);
                        return;
                    }

                    var last, lastname, l, add, tstr, now = sys.time() * 1,
                        perm = !noPermission(src, 1),
                        y;

                    var tt = new Table_Templater('Channel Mutelist', 'blue', '3');

                    if (perm) {
                        add = ["IP", "Muted Name", "Muted By", "Reason", "Length", "Last Used Name"];
                    }
                    else {
                        add = ["Muted Name", "Muted By", "Reason", "Length", "Last Used Name"];
                    }

                    tt.register(add, true);

                    for (y in mutes) {
                        last = "N/A", lastname = lastName(y), l = mutes[y], tstr = getTimeString(l.time - now);
                        if (lastname !== undefined) {
                            last = lastname;
                        }
                        if (perm) {
                            add = [y, l.name, l.by, l.why, tstr, last];
                        }
                        else {
                            add = [l.name, l.by, l.why, tstr, last];
                        }
                        tt.register(add, false);
                    }


                    tt.render(src, chan);
                },
                /* -- Channel Commands: Wall -- */
                channelhtmlwall: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    var color = script.namecolor(src),
                        l = '';

                    sys.sendHtmlAll(BORDER + "<br>", chan);

                    if (UseIcons) {
                        l = rankico;
                    }

                    sys.sendHtmlAll('<font color=' + script.namecolor(src) + '><timestamp/><b>' + l + html_escape(sys.name(src)) + ':</font></b> ' + commandData, chan);
                    sys.sendHtmlAll("<br>" + BORDER, chan);
                },

                channelwall: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    var color = script.namecolor(src);
                    var srcname = sys.name(src)

                    sys.sendHtmlAll(BORDER + "<br>", chan);

                    var l = '',
                        send = sys.sendAll,
                        f = commandData,
                        displaystr = srcname + ': ' + f;

                    if (UseIcons) {
                        l = rankico;
                        send = sys.sendHtmlAll;
                        f = format(src, html_escape(commandData));
                        displaystr = '<font color=' + script.namecolor(src) + '><timestamp/><b>' + l + html_escape(srcname) + ':</font></b> ' + f;
                    }

                    send(displaystr, chan);
                    sys.sendHtmlAll("<br>" + BORDER, chan);
                },

                /* -- Channel Commands: HTML -- */
                html: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (noPermission(src, 1)) {
                        var sendStr = '<font color=' + script.namecolor(src) + '><timestamp/><b>' + sys.name(src) + ':</font></b> ' + commandData;
                        sys.sendHtmlAll(sendStr, chan);
                        return;
                    }
                    sys.sendHtmlAll(commandData, chan); // higher power for auth.
                },

                /* -- Channel Commands: Silence */
                csilence: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    var auth = poChan.chanAuth[sys.name(src).toLowerCase()] * 1;

                    if (sys.auth(src) > poChan.chanAuth[sys.name(src).toLowerCase()] * 1) {
                        auth = sys.auth(src);
                    }

                    if (poChan.silence * 1 === auth) {
                        botMessage(src, "The channel is already silenced!", chan);
                        return;
                    }

                    poChan.silence = auth;

                    switch (poChan.silence) {
                    case 1:
                        botEscapeAll(sys.name(src) + " silenced the channel!", chan);
                        break;
                    case 2:
                        botEscapeAll(sys.name(src) + " super silenced the channel!", chan);
                        break;
                    case 3:
                        botEscapeAll(sys.name(src) + " mega silenced the channel!", chan);
                        break;
                    default:
                        botEscapeAll(sys.name(src) + " mega silenced the channel!", chan);
                        poChan.silence = 3;
                        break;
                    }

                    cData.changeStatus(chan, poChan.perm, poChan.private, poChan.silence);
                },
                cunsilence: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (poChan.silence * 1 === 0) {
                        botMessage(src, "There is no silence!");
                        return;
                    }

                    poChan.silence = 0;
                    botEscapeAll(sys.name(src) + " unsilenced the channel!", chan);
                    cData.changeStatus(chan, poChan.perm, poChan.private, 0);
                },

                /* -- Channel Commands: Privacy */
                channelprivate: function () {
                    if (!poChan.isChanOwner(src) && noPermission(src, 3)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (poChan.private) {
                        botMessage(src, 'This channel is already private!', chan);
                        return;
                    }
                    if (chan === 0) {
                        botMessage(src, "Cant do this in the main channel!", chan);
                        return;
                    }

                    var players = sys.playersOfChannel(chan),
                        x, lc, curr;

                    for (x in players) {
                        curr = players[x];
                        lc = sys.name(curr).toLowerCase();
                        if (!poChan.chanAuth.has(lc) && hpAuth(curr) < 1) {
                            sys.kick(curr, chan);
                        }
                    }

                    poChan.private = true;
                    botEscapeAll("This channel has been made private by " + sys.name(src) + "!", chan);
                    cData.changeStatus(chan, poChan.perm, true, poChan.silence);
                },

                channelpublic: function () {
                    if (!poChan.isChanOwner(src) && noPermission(src, 3)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (!poChan.private) {
                        botMessage(src, 'This channel is already public!', chan);
                        return;
                    }
                    if (chan === 0) {
                        botMessage(src, "Cant do this in the main channel!");
                        return;
                    }

                    poChan.private = false;
                    botEscapeAll("This channel has been made public by " + sys.name(src) + "!", chan);
                    cData.changeStatus(chan, cData.perm, false, cData.silence);
                },

                /* -- Channel Commands: Fun -- */
                chatcolor: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    if (chatcolor) {
                        botMessage(src, "This channel already has colorchat enabled!", chan);
                        return;
                    }

                    var c1 = mcmd[0];
                    var c2 = mcmd[1];
                    var c = chan;

                    if (isEmpty(c1)) c1 = "random";
                    if (isEmpty(c2)) c2 = "random";

                    ChatColorRandomizer(c1, c2, chan);
                },

                chatcoloroff: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (!chatcolor) {
                        botMessage(src, "This channel does not have colorchat enabled!", chan);
                        return;
                    }

                    DisableChatColorRandomizer(chan);
                },

                /* -- Channel Commands: Perm */
                perm: function () {
                    if (noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    var cmdlc = cmdData
                    if (cmdlc != 'on' && cmdlc != 'off') {
                        botMessage(src, "Pick either on or off", chan);
                        return;
                    }

                    if (cmdlc == 'on' && poChan.perm != true) {
                        botEscapeAll(sys.name(src) + " made this channel permanent.", chan);
                        poChan.perm = true;
                        cData.changeStatus(chan, true, poChan.private, poChan.silence);
                        return;
                    }

                    if (cmdlc == 'off' && poChan.perm != false) {
                        botEscapeAll(sys.name(src) + " made this channel temporally.", chan);
                        poChan.perm = false;
                        cData.changeStatus(chan, false, poChan.private, poChan.silence);
                        return;
                    }

                    botMessage(src, "Perm status is already " + cmdlc, chan);
                },
                /* -- Channel Commands: Topic */
                topic: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        commandData = "";
                    }
                    if (commandData.length > 500 && noPermission(src, 1)) {
                        botMessage(src, "The topic may not be over 500 characters.", chan);
                        return;
                    }

                    poChan.changeTopic(src, commandData, fullCommand);
                    if (commandData != "") {
                        cData.changeTopic(chan, commandData, sys.name(src), false);
                    }
                },

                /* -- Channel Commands: Destruction */
                destroychannel: function () {
                    if (!poChan.isChanOwner(src, chan) && noPermission(src, 2)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (channels.indexOf(chan) != -1) {
                        botMessage(src, "This channel can't be destoryed!", chan);
                        return;
                    }

                    var players = sys.playersOfChannel(chan);
                    delete cData.channelData[sys.channel(chan)];
                    cData.save();

                    poChan.perm = false;

                    for (x in players) {
                        sys.kick(players[x], chan)
                        if (sys.isInChannel(players[x], 0) != true) {
                            sys.putInChannel(players[x], 0)
                        }
                    }
                },

                /* -- Channel Commands: Mute */
                channelmute: function () {
                    if (!poChan.isChanMod(src, chan) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (dbIp == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (poChan.isMutedInChannel(dbIp)) {
                        botMessage(src, 'That person is already channel muted.', chan);
                        return;
                    }
                    if (!poChan.canIssue(src, mcmd[0])) {
                        botMessage(src, 'That person has either equal or higher Channel Authority than you.', chan);
                        return;
                    }
                    if (self(src, mcmd[0])) {
                        botMessage(src, 'You cannot mute yourself.', chan);
                        return;
                    }

                    var unitTime = stringToTime(mcmd[2], mcmd[1]);
                    var time = 0,
                        timestr = "forever",
                        time_now = sys.time() * 1;
                    if (!isNaN(unitTime)) {
                        mcmd[1] = unitTime;
                        time = time_now + unitTime
                        timestr = "for " + getTimeString(unitTime);
                    }

                    var reason = "None.";

                    botAll(mcmd[0].name() + " has been muted by " + sys.name(src) + " " + timestr + " in " + sys.channel(chan) + "!", chan);
                    if (!isEmpty(mcmd[3])) {
                        reason = cut(mcmd, 3, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }

                    poChan.mutelist[dbIp] = {
                        'by': sys.name(src),
                        'name': mcmd[0].name(),
                        'why': reason,
                        'time': time
                    };
                    cData.changeBans(chan, poChan.mutelist, poChan.banlist);
                },

                channelunmute: function () {
                    if (!poChan.isChanMod(src, chan) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (dbIp == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (!poChan.isMutedInChannel(dbIp)) {
                        botMessage(src, 'That person isn\'t Channel Muted.', chan);
                        return;
                    }
                    botEscapeAll(mcmd[0].name() + " has been unmuted by " + sys.name(src) + "!", chan);
                    if (!isEmpty(mcmd[1])) {
                        var reason = cut(mcmd, 1, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }

                    delete poChan.mutelist[dbIp];
                    cData.changeBans(chan, poChan.mutelist, poChan.banlist);
                },

                /* -- Channel Commands: Tournaments */
                installtour: function () {
                    if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    if (poChan.tour != undefined && !poChan.toursEnabled) {
                        poChan.toursEnabled = true;
                    }

                    if (poChan.toursEnabled) {
                        botMessage(src, "Tours are already installed!", chan);
                        return;
                    }

                    if (chan in channels) {
                        botMessage(src, "You cannot install tours in this channel.", chan);
                        return;
                    }

                    botAll("Installing channel tours...", chan);

                    poChan.toursEnabled = true;
                    poChan.tour = new Tours(chan);

                    botAll("Install successful!", chan);

                    cData.changeToursEnabled(chan, true);
                },

                uninstalltour: function () {
                    if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }

                    if (poChan.tour == undefined && poChan.toursEnabled) {
                        poChan.toursEnabled = false;
                    }

                    if (!poChan.toursEnabled) {
                        botMessage(src, "Tours are not installed!", chan);
                        return;
                    }
                    if (chan in channels) {
                        botMessage(src, "You cannot remove tours in this channel.", chan);
                        return;
                    }

                    botAll("Uninstalling channel tours...", chan);

                    poChan.toursEnabled = false;
                    delete poChan.tour;

                    botAll("Uninstall successful!", chan);

                    cData.changeToursEnabled(chan, false);
                },

                /* -- Channel Commands: Invite */
                invite: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (tar == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }

                    if (sys.isInChannel(tar, chan)) {
                        botMessage(src, "That person is already in this channel.", chan);
                        return;
                    }

                    sys.putInChannel(tar, chan);
                    botMessage(tar, sys.name(src) + " invited you to " + sys.channel(chan) + "! <ping/>", chan);
                    botMessage(src, sys.name(tar) + " was invited.");
                },

                /* -- Channel Commands: Ban */
                channelban: function () {
                    if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (dbIp == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (poChan.isBannedInChannel(dbIp)) {
                        botMessage(src, 'That person is already channel banned.', chan);
                        return;
                    }
                    if (!poChan.canIssue(src, mcmd[0])) {
                        botMessage(src, 'That person has either equal or higher channel auth than you.'.chan);
                        return;
                    }
                    if (self(src, mcmd[0])) {
                        botMessage(src, 'You cannot channel ban yourself.', chan);
                        return;
                    }

                    var unitTime = stringToTime(mcmd[2], mcmd[1]);
                    var time = 0,
                        timestr = "forever",
                        time_now = sys.time() * 1;
                    if (!isNaN(unitTime)) {
                        mcmd[1] = unitTime;
                        time = time_now + unitTime
                        timestr = "for " + getTimeString(unitTime);
                    }

                    var reason = "None.";

                    botAll(mcmd[0].name() + " has been banned by " + sys.name(src) + " " + timestr + " in " + sys.channel(chan) + "!", chan);
                    if (!isEmpty(mcmd[3])) {
                        var reason = cut(mcmd, 3, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }

                    poChan.banlist[dbIp] = {
                        'by': sys.name(src),
                        'who': mcmd[0].name(),
                        'why': reason,
                        'time': time
                    };

                    if (tar != undefined) {
                        sys.kick(tar, chan);
                    }

                    cData.changeBans(chan, poChan.mutelist, poChan.banlist);
                },

                channelunban: function () {
                    if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (dbIp == undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (!poChan.isBannedInChannel(dbIp)) {
                        botMessage(src, "That person isn't banned in this channel.", chan);
                        return;
                    }
                    botEscapeAll(mcmd[0].name() + " has been unbanned by " + sys.name(src) + "!", chan);
                    if (!isEmpty(mcmd[1])) {
                        var reason = cut(mcmd, 1, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }
                    delete poChan.banlist[dbIp];
                    cData.changeBans(chan, poChan.mutelist, poChan.banlist);
                },

                /* -- Channel Commands: Kick */
                channelkick: function () {
                    if (!poChan.isChanMod(src) && noPermission(src, 1)) {
                        noPermissionMessage(src, fullCommand, chan);
                        return;
                    }
                    if (!poChan.canIssue(src, commandData)) {
                        botMessage(src, 'That person has either equal or higher channel authority than you.', chan);
                        return;
                    }
                    if (tar == undefined) {
                        botMessage(src, "That person is either not online, or doesn't exist.", chan);
                        return;
                    }
                    if (self(src, mcmd[0])) {
                        botMessage(src, "You cannot channel kick yourself.", chan);
                        return;
                    }
                    if (!sys.isInChannel(tar, chan)) {
                        botMessage(src, "That person isn't in this channel.", chan);
                        return;
                    }
                    botEscapeAll(sys.name(tar) + " has been kicked in this channel by " + sys.name(src) + "!", chan);
                    if (!isEmpty(mcmd[1])) {
                        var reason = cut(mcmd, 1, ':');
                        botEscapeAll("Reason: " + reason, chan);
                    }
                    sys.kick(tar, chan);
                }
            });

            /* -- Channel Commands: Authing */
            channelCommands[removespaces(ChanTour0).toLowerCase()] = function () {
                if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                    botMessage(src, "You don't have the permission to do that", chan);
                    return;
                }
                if (mcmd[0] == "") {
                    botMessage(src, "Specify a name!", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist", chan);
                    return;
                }
                if (poChan.tourAuth[mcmd[0].toLowerCase()] === undefined) {
                    botMessage(src, "That person is already " + ChanTour0 + "!", chan);
                    return;
                }
                poChan.takeTourAuth(mcmd[0]);
                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + ChanTour0 + " by " + sys.name(src) + ".", chan);
                    return;
                }
                botEscapeAll(commandData + " has been made " + ChanTour0 + " by " + sys.name(src) + ".", chan);
            }

            channelCommands[removespaces(ChanTour1).toLowerCase()] = function () {
                if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                    botMessage(src, "You don't have the permission to do that", chan);
                    return;
                }
                if (mcmd[0] == "") {
                    botMessage(src, "Specify a name!", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist", chan);
                    return;
                }
                if (poChan.tourAuth[mcmd[0].toLowerCase()] != undefined) {
                    botMessage(src, "That person is already " + ChanTour1 + "!", chan);
                    return;
                }
                poChan.giveTourAuth(mcmd[0]);
                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + ChanTour1 + " by " + sys.name(src) + ".", chan);
                    return;
                }
                botEscapeAll(commandData + " has been made " + ChanTour1 + " by " + sys.name(src) + ".", chan);
                putInAuthChan(commandData, "cauth", chan);
            }

            channelCommands[removespaces(ChanUser).toLowerCase()] = function () {
                if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                    botMessage(src, "You don't have the permission to do that", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, 'That player doesn\'t exist!', chan);
                    return;
                }
                if (poChan.chanAuth[commandData.toLowerCase()] == 0 || poChan.chanAuth[commandData.toLowerCase()] == undefined) {
                    botEscapeMessage(src, "That person is already " + ChanUser + "!", chan);
                    return;
                }
                if ((poChan.chanAuth[commandData.toLowerCase()] * 1 >= 2 && !poChan.isChanOwner(src) && sys.auth(src) < 3) || dbAuth == 2 && sys.auth(src) < 3) {
                    botMessage(src, "You can't deauth higher auth!", chan);
                    return;
                }
                botEscapeAll(commandData + " was made " + ChanUser + " by " + sys.name(src) + ".", chan);
                poChan.changeAuth(commandData.toLowerCase(), 0);
            }

            channelCommands[removespaces(ChanMod).toLowerCase()] = function () {
                if (!poChan.isChanAdmin(src) && noPermission(src, 2)) {
                    botMessage(src, "You don't have the permission to do that", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist!", chan);
                    return;
                }
                if (poChan.chanAuth[commandData.toLowerCase()] == 1) {
                    botEscapeMessage(src, "That person is already " + ChanMod + "!", chan);
                    return;
                }
                if ((poChan.chanAuth[commandData.toLowerCase()] * 1 >= 2 && !poChan.isChanOwner(src) && sys.auth(src) < 3) || dbAuth == 2 && sys.auth(src) < 3) {
                    botMessage(src, "You can't deauth higher auth!", chan);
                    return;
                }

                botEscapeAll(commandData + " was made " + ChanMod + " by " + sys.name(src) + ".", chan);
                poChan.changeAuth(commandData.toLowerCase(), 1);
                putInAuthChan(commandData, "cauth", chan);
            }

            channelCommands[removespaces(ChanAdmin).toLowerCase()] = function () {
                if (!poChan.isChanOwner(src) && noPermission(src, 3)) {
                    botMessage(src, "You don't have the permission to do that", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist!", chan);
                    return;
                }
                if (poChan.chanAuth[commandData.toLowerCase()] == 2) {
                    botEscapeMessage(src, "That person is already " + ChanAdmin + "!", chan);
                    return;
                }
                if (sys.auth(src) < 3 && dbAuth > 1 && dbAuth < 3) {
                    botMessage(src, "You can't deauth higher auth!", chan);
                    return;
                }
                botEscapeAll(commandData + " was made " + ChanAdmin + " by " + sys.name(src) + ".", chan);
                poChan.changeAuth(commandData.toLowerCase(), 2);
                putInAuthChan(commandData, "cauth", chan);
            }

            channelCommands[removespaces(ChanOwner).toLowerCase()] = function () {
                if (!poChan.isChanOwner(src) && noPermission(src, 3)) {
                    botMessage(src, "You don't have the permission to do that", chan);
                    return;
                }
                if (dbIp == undefined) {
                    botMessage(src, "That player doesn't exist!", chan);
                    return;
                }
                if (poChan.chanAuth[commandData.toLowerCase()] == 3) {
                    botEscapeMessage(src, "That person is already " + ChanOwner + "!", chan);
                    return;
                }
                botEscapeAll(commandData + " was made " + ChanOwner + " by " + sys.name(src) + ".", chan);
                poChan.changeAuth(commandData.toLowerCase(), 3);
                putInAuthChan(commandData, "cauth", chan);
            }

            /* -- Tour Commands: Start */
            tourCommands = ({ /* -- Tour Templates: Commands */
                tourcommands: function () {
                    if (!poChan.toursEnabled) {
                        return;
                    }
                    var ct = new Command_Templater("Tournament Commands", true);
                    ct.span("Tournament " + ChanTour0 + " Commands");

                    ct.register("join", "Makes you join the tournament.");
                    ct.register("unjoin", "Makes you leave the tournament.");
                    ct.register("viewround", "Displays information about the current round.");
                    ct.register("tourprize", "Displays the tournament prize.");

                    if (poChan.tour.hasTourAuth(src)) {
                        ct.span("Tournament " + ChanTour1 + " Commands");
                        ct.register("tour", ["{p Tier}", "{o Players}", "{o <u>Type</u>}", "{p <u>Prize</u>}"], "Starts a tournament. Type will be Single Elimination (1) if not specified. Types are: Single Elimination (1), Double Elimination (2), Triple Elimination (3), Tag Team Single Elimination (4), Tag Team Double Elimination (5), Tag Team Triple Elimination (6). For Tag Team Tournaments, the entrants must be an even number.");
                        ct.register("dq", ["{g Person}"], "DQs someone from the tournament.");
                        ct.register("cancelbattle", ["{g Person}"], "Makes someones battle unofficial.");
                        ct.register("changespots", ["{o Number}"], "Changes the number of entry spots. In Tag Team Tournaments, the entrants must be an even number.");
                        ct.register("push", ["{or Person}"], "Adds someone to the tournament. In Tag Team Tournaments, you cannot add players after the signup.");
                        ct.register("endtour", "Ends the tournament.");
                        ct.register("switch", ["{g Player}", "{r NewPlayer}"], "Switches 2 players in the tournament.");
                        ct.register("autostartbattles", ["{b On/Off}"], "Turns auto start battles on or off in the channel.");
                    }

                    if (!noPermission(src, 1) || poUser.megauser) {
                        ct.span("Tournament " + Tour1 + " Commands");
                        ct.register("autostarttours", ["{b On/Off}"], "Turns auto start tours on or off.");
                        ct.register("display", ["{b 1/2}"], "Changes the tournament display mode.");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                /* -- Tour Commands: Style -- */
                display: function () {
                    if (noPermission(src, 1) && !poUser.megauser) {
                        noPermissionMessage(src, chan);
                        return;
                    }

                    var num = parseInt(commandData);
                    if (num != 1 && num != 2) {
                        botMessage(src, "Valid tournament display modes are 1 and 2.", chan);
                        return;
                    }
                    if (TourDisplay == num) {
                        botMessage(src, "The tournament display mode is already " + num + ".", chan);
                        return;
                    }

                    botAll(sys.name(src) + " changed the tournament display mode to " + num + "!", 0);
                    TourDisplay = num;
                    cache.write("TourDisplay", num);
                },

                /* -- Tour Commands: AutoStartTours -- */
                autostarttours: function () {
                    if (noPermission(src, 1) && !poUser.megauser) {
                        noPermissionMessage(src, chan);
                        return;
                    }

                    if (cmdData != 'on' && cmdData != 'off') {
                        botMessage(src, "Use on or off.", chan);
                        return;
                    }

                    if (cmdData == 'on' && !AutoStartTours) {
                        if (TourDisplay == 1) {
                            sys.sendHtmlAll(TOUR_BORDER, 0);
                            sys.sendAll("", 0);
                            botEscapeAll(sys.name(src) + " turned auto start tours on.", 0);
                            sys.sendAll("", 0);
                            sys.sendHtmlAll(TOUR_BORDER, 0);
                        }
                        else {
                            TourBox("<b style='color:" + script.namecolor(src) + "'>" + sys.name(src) + "</b> turned auto start tours on.", 0);
                        }
                        AutoStartTours = true;
                        cache.write("AutoStartTours", true);
                        return;
                    }

                    if (cmdData == 'off' && AutoStartTours) {
                        if (TourDisplay == 1) {
                            sys.sendHtmlAll(TOUR_BORDER, 0);
                            sys.sendAll("", 0);
                            botEscapeAll(sys.name(src) + " turned auto start tours off.", 0);
                            sys.sendAll("", 0);
                            sys.sendHtmlAll(TOUR_BORDER, 0);
                        }
                        else {
                            TourBox("<b style='color:" + script.namecolor(src) + "'>" + sys.name(src) + "</b> turned auto start tours off.", 0);
                        }
                        AutoStartTours = false;
                        cache.write("AutoStartTours", false);
                        return;
                    }

                    cmdData += '.';
                    botMessage(src, "Auto Start Tours is already " + cmdData, chan);
                },

                /* -- Tour Commands: Switch -- */
                'switch': function () {
                    poChan.tour.command_switch(src, commandData, fullCommand);
                },

                /* -- Tour Commands: Auto Start Battles -- */
                autostartbattles: function () {
                    poChan.tour.command_autostartbattles(src, commandData, fullCommand);
                },

                /* -- Tour Commands: Prize -- */
                tourprize: function () {
                    poChan.tour.command_tourprize(src, commandData, fullCommand);
                },

                /* -- Tour Commands: Join -- */
                join: function () {
                    poChan.tour.command_join(src, commandData, fullCommand);
                },

                unjoin: function () {
                    poChan.tour.command_unjoin(src, commandData, fullCommand);
                },

                /* -- Tour Commands: Info */
                viewround: function () {
                    poChan.tour.command_viewround(src, commandData, fullCommand);
                },

                /* -- Tour Commands: Sorting */
                dq: function () {
                    poChan.tour.command_dq(src, commandData, fullCommand);
                },

                push: function () {
                    poChan.tour.command_push(src, commandData, fullCommand);
                },

                cancelbattle: function () {
                    poChan.tour.command_cancelbattle(src, commandData, fullCommand);
                },

                /* -- Tour Commands: Spots */
                changespots: function () {
                    poChan.tour.command_changespots(src, commandData, fullCommand);
                },

                /* -- Tour Commands: Tournament */
                tour: function () {
                    if (TourDisplay == 2) {
                        DisableChatColorRandomizer(chan);
                    }

                    poChan.tour.command_tour(src, commandData, fullCommand);
                },

                endtour: function () {
                    poChan.tour.command_endtour(src, commandData, fullCommand);
                }
            });

            /* -- Mod Commands: Start */
            modCommands = ({ /* -- Mod Templates: Commands */
                cmdcommands: function () {
                    var ct = new Command_Templater("Command Commands", true);
                    ct.span("Command " + ModName + " Commands");
                    ct.register("enable", ["{p Command}"], "Enables a command. Valid commands are: me, attack, roulette, catch.");
                    ct.register("disable", ["{p Command}"], "Disables a command. Valid commands are: me, attack, roulette, catch.");

                    if (!noPermission(src, 2)) {
                        ct.span("Command " + AdminName + " Commands");
                        ct.register("implock", "Locks impersonation commands for " + sLetter(UserName) + ".");
                        ct.register("impunlock", "Unlocks impersonation commands for " + sLetter(UserName) + ".");
                    }

                    if (!noPermission(src, 3)) {
                        ct.span("Command " + OwnerName + " Commands");
                        ct.register("pointercommand", ["{p Name}", "{p Command}"], "Creates a pointer command.");
                        ct.register("delpointercommand", ["{p Name}"], "Deletes a pointer command.");
                        ct.register("futurelimit", ["{o Limit}"], "Changes the futures allowed per x seconds.");
                    }

                    if (host) {
                        ct.span("Command Founder Commands");
                        ct.register("evallock", "Locks eval for everyone but you and evalops.");
                        ct.register("evalunlock", "Unlocks eval.");
                    }


                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                moderatecommands: function () {
                    var ct = new Command_Templater("Moderation Commands", true);
                    ct.span("Moderation " + ModName + " Commands");

                    ct.register("kick", ["{r Person}", "{p <u>Reason</u>}"], "Kicks someone.");
                    ct.register("mute", ["{or Person}", "{o <u>Time</u>}", "{bv <u>Time Unit</u>}", "{p <u>Reason</u>}"], "Mutes someone");
                    ct.register("unmute", ["{or Person}", "{p <u>Reason</u>}"], "Unmutes someone.");
                    ct.register("tempban", ["{or Person}", "{o Time}", "{bv <u>Time Unit</u>}", "{p <u>Reason</u>}"], "Bans someone for a given time. " + (!noPermission(src, 2) ? "" : "You can not ban for longer than 5 days."));
                    ct.register("untempban", ["{or Person}", "{p <u>Reason</u>}"], "Unbans someone who has been tempbanned.");
                    ct.register("rangebanlist", "Displays Range Ban List.");
                    ct.register("banlist", "Displays Banlist.");
                    ct.register("tempbanlist", "Displays Temp Ban List.");
                    ct.register("mutelist", "Displays Mute List.");

                    if (!noPermission(src, 2)) {
                        ct.span("Moderation " + AdminName + " Commands");
                        ct.register("ban", ["{or Person}", "{p <u>Reason</u>}"], "Bans someone.");
                        ct.register("unban", ["{or Person}", "{p <u>Reason</u>}"], "Unbans someone.");
                    }

                    if (!noPermission(src, 3)) {
                        ct.span("Moderation " + OwnerName + " Commands");
                        ct.register("rangeban", ["{p RangeIP}", "{o <u>Time</u>}", "{bv <u>Time Unit</u>}", "{p <u>Reason</u>}"], "Bans a range IP.");
                        ct.register("rangeunban", ["{p RangeIP}"], "Removes a rangeban.");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                impcommands: function () {
                    var ct = new Command_Templater("Impersonation Commands");

                    if (implock) {
                        ct.register("imp", ["{p Thing}"], "Lets you Impersonate something.");
                        ct.register("impoff", "Lets you stop Impersonating.");
                    }

                    ct.register("unimp", ["{r Person}"], "Removes someones Impersonation.");

                    ct.register("superimp", ["{p Thing}"], "Changes your name to ~<b>Thing</b>~.");
                    ct.register("superimpoff", "Restores your name.");

                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                silencecommands: function () {
                    var ct = new Command_Templater("Silence Commands", true);
                    ct.span("Silence " + ModName + " Commands");

                    ct.register("silence", ["<u>{o Time}</u>"], "Silences the chat for " + sLetter(UserName) + ". Time goes in minutes.");
                    ct.register("unsilence", "Unsilences the chat.");
                    ct.register("voice", ["{or Player}"], "Gives someone Voice (the ability to talk through channel silences and normal silence).");
                    ct.register("unvoice", ["{or Player}"], "Removes someones Voice.");

                    if (sys.auth(src) < 2) {
                        ct.span("Silence " + AdminName + " Commands");
                        ct.register("supersilence", ["<u>{o Time}</u>"], "Silences the chat for " + sLetter(UserName) + " and " + sLetter(ModName) + ". Time goes in minutes.");
                    }

                    if (sys.auth(src) < 3) {
                        ct.span("Silence " + OwnerName + " Commands");
                        ct.register("megasilence", ["<u>{o Time}</u>"], "Silences the chat for " + sLetter(UserName) + ", " + sLetter(ModName) + " and " + sLetter(AdminName) + ". Time goes in minutes.");
                    }
                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                /* -- Mod Templates: Tables */
                rangebanlist: function () {
                    Prune.rangeBans();

                    var range = DataHash.rangebans;
                    if (objLength(range) == 0) {
                        botMessage(src, 'No one is range banned.', chan);
                        return;
                    }

                    var t = sys.time() * 1,
                        r, i, s;

                    var tt = new Table_Templater("Range Ban List", "darkviolet", "3");
                    tt.register(["Range IP", "By", "Reason", "Duration"], true);

                    for (i in range) {
                        r = range[i], s = "for " + getTimeString(r.time - time);

                        if (r.time == 0) {
                            s = "forever";
                        }

                        tt.register([r.ip, r.by, r.why, s], false);
                    }


                    tt.render(src, chan);
                },

                tempbanlist: function () {
                    Prune.bans();

                    var temp = DataHash.tempbans;
                    if (objLength(temp) == 0) {
                        botMessage(src, "There are currently no temp bans.", chan);
                        return;
                    }

                    var last, lastname, i, r, s, t = sys.time() * 1;

                    var tt = new Table_Templater('Temp Ban List', 'limegreen', '3');
                    tt.register(["IP", "Last Used Name", "By", "Reason", "Duration"], true);

                    for (i in temp) {
                        r = temp[i], s = "forever";

                        if (r.time !== 0) {
                            s = "for " + getTimeString(r.time - t);
                        }

                        last = "N/A";
                        lastname = lastName(r.ip);
                        if (lastname !== undefined) {
                            last = lastname;
                        }

                        tt.register([r.ip, last, r.by, r.why, s], false);
                    }


                    tt.render(src, chan);
                },
                mutelist: function () {
                    Prune.mutes();

                    var mutes = DataHash.mutes;
                    if (objLength(mutes) == 0) {
                        botMessage(src, 'No one is muted.', chan);
                        return;
                    }

                    var tt = new Table_Templater("Mute List", "blue", "3");
                    tt.register(["IP", "Last Used Name", "By", "Reason", "Duration"], true);

                    var s, last, lastname, r, t = sys.time() * 1,
                        i, r, s;

                    for (i in mutes) {
                        r = mutes[i], s = "forever";

                        if (r.time !== 0) {
                            s = "for " + getTimeString(r.time - t);
                        }

                        last = "N/A";
                        lastname = lastName(r.ip);
                        if (lastname !== undefined) {
                            last = lastname;
                        }

                        tt.register([r.ip, last, r.by, r.why, s], false);
                    }


                    tt.render(src, chan);
                },

                info: function () {
                    var ip = dbIp;
                    if (ip == undefined) {
                        botMessage(src, "That person doesn't exist", chan);
                        return;
                    }

                    var color = "N/A",
                        id = "N/A",
                        laston = "N/A",
                        lastname = "N/A",
                        aliases = sys.aliases(ip).map(function (n) {
                            return n.name();
                        }),
                        reg = "no";

                    if (sys.dbRegistered(commandData)) {
                        reg = "yes";
                    }

                    var ban = 'no',
                        banned, banlist = sys.banList();

                    for (banned in banlist) {
                        if (cmdData == banlist[banned]) {
                            ban = 'yes';
                            break;
                        }
                    }

                    var online = 'yes';
                    if (tar === undefined) {
                        online = 'no';
                    }

                    var name = commandData.name(),
                        range = rangeIP(commandData);

                    if (sys.dbLastOn(commandData) !== undefined) {
                        laston = sys.dbLastOn(commandData);
                        lastname = lastName(ip);
                    }

                    Prune.mutes();
                    Prune.bans();

                    var auth = dbAuth,
                        t = parseInt(sys.time()),
                        hash = DataHash,
                        hash_mute = hash.mutes[ip],
                        hash_ban = hash.tempbans[ip],
                        mutepart = "no";

                    if (hash_mute != undefined) {
                        mutepart = "yes";
                    }

                    var mute = mutepart,
                        part;

                    if (mutepart != "no") {
                        part = "forever";
                        if (hash_mute.time != 0) {
                            part = "for " + getTimeString(hash_mute.time - t);
                        }

                        mute = mutepart + ", " + part + "!";
                    }

                    var banpart = "no";
                    if (hash_ban != undefined) {
                        banpart = "yes";
                    }

                    var tban = banpart;

                    if (banpart != "no") {
                        part = "forever";
                        if (hash_ban.time != 0) {
                            part = "for " + getTimeString(hash_ban.time - t);
                        }

                        tban = banpart + ", " + part + "!";
                    }

                    if (online === 'yes') {
                        id = tar;
                        color = script.namecolor(tar);
                    }

                    script.resolveLocation(0, dbIp, true);

                    var loc = hash.locations[dbIp],
                        hostname = loc.hostname,
                        country = loc.country_name;

                    var tt = new Table_Templater("Information of " + name, "orange", "2");

                    tt.register(["Name", "IP", "Range IP", "Last On At", "With Name", "Registered", "Auth Level", "Aliases"], true);
                    tt.register([name, ip, range, laston, lastname, reg, auth, "<small>" + aliases + "</small>"], false);
                    tt.register(["Online", "Hex Color", "ID", "Muted", "Temp Banned", "Banned", "Country", "Hostname"], true);
                    tt.register([online, color, id, mute, tban, ban, country, hostname], false);


                    tt.render(src, chan);
                },

                banlist: function () {
                    var list = sys.banList().sort();

                    if (list.length === 0) {
                        botMessage(src, "No one is banned.", chan);
                        return;
                    }

                    var tt = new Table_Templater("Ban List", "red", "3");
                    tt.register(["Name", "Last Used Name", "IP"], true);

                    var last, lastname, ly, ip, y;

                    for (y in list) {
                        ly = list[y], ip = sys.dbIp(ly), last = "N/A", lastname = lastName(ip);
                        if (lastname !== undefined) {
                            last = lastname;
                        }

                        tt.register([ly.name(), last, ip], false);
                    }


                    tt.render(src, chan);
                },

                /* -- Mod Commands: Voice */
                voice: function () {
                    var v = DataHash.voices,
                        n = mcmd[0];

                    if (dbIp === undefined || n === "") {
                        botMessage(src, "No such player!", chan);
                        return;
                    }
                    if (v.hasOwnProperty(n.toLowerCase())) {
                        botMessage(src, "That player already has Voice!", chan);
                        return;
                    }

                    v[n.toLowerCase()] = {
                        'by': sys.name(src)
                    };
                    if (poTar != undefined) {
                        poTar.voice = true;
                    }

                    botAll(n + " was made Voice by " + sys.name(src) + "!", 0);
                },

                unvoice: function () {
                    var v = DataHash.voices,
                        n = mcmd[0];

                    if (!v.hasOwnProperty(n.toLowerCase())) {
                        botMessage(src, "That player does not have Voice!", chan);
                        return;
                    }

                    delete DataHash.voices[n.toLowerCase()];

                    if (poTar != undefined) {
                        poTar.voice = false;
                    }

                    botAll(n + "'s voice was taken by " + sys.name(src) + "!", 0);
                },

                /* -- Mod Commands: Me -- */
                htmlme: function () {
                    if (commandData === "") {
                        return;
                    }

                    sys.sendHtmlAll("<font color=" + getColor + "><timestamp/><i>*** <b>" + srcname + "</b> " + commandData + "</i>", chan);
                },

                /* -- Mod Commands: Impersonation -- */
                unimp: function () {
                    if (tar === undefined) {
                        botMessage(src, "This person isn't online or doesn't exist.", chan);
                        return;
                    }
                    if (poTar.impersonation === undefined || poTar.impersonation === "") {
                        botMessage(src, "This person does not have an impersonation.", chan);
                        return;
                    }

                    sendAuth(sys.name(tar) + " (" + poTar.impersonation + ") was de-impersonated by " + srcname + "!");
                    delete poTar.impersonation;
                    if (sys.auth(tar) < 1) {
                        botMessage(tar, "You have been un-impersonated by " + srcname + "!");
                    }
                },

                /* -- Mod Commands: Trivia -- */
/*
                start: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.start(src);
                },

                remove: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.remove(src, commandData);
                },

                end: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.end(src);
                },

                skip: function () {
                    if (sendChanError(src, chan, trivia)) return;

                    Trivia.skipRound(src);
                },
				*/

                /* -- Mod Commands: Wall -- */
                htmlwall: function () {
                    var color = script.namecolor(src),
                        l = '';

                    sys.sendHtmlAll(BORDER + "<br>");

                    if (UseIcons) {
                        l = rankico;
                    }

                    sys.sendHtmlAll('<font color=' + color + '><timestamp/><b>' + l + html_escape(srcname) + ':</font></b> ' + commandData);
                    sys.sendHtmlAll("<br>" + BORDER);
                },

                wall: function () {
                    var color = script.namecolor(src),
                        l = '',
                        send = sys.sendAll,
                        f = commandData,
                        displaystr = sys.name(src) + ': ' + f;

                    sys.sendHtmlAll(BORDER + "<br>");

                    if (UseIcons) {
                        l = rankico;
                        send = sys.sendHtmlAll;
                        f = format(src, html_escape(commandData));
                        displaystr = '<font color=' + color + '><timestamp/><b>' + l + html_escape(srcname) + ':</font></b> ' + f;
                    }

                    send(displaystr);
                    sys.sendHtmlAll("<br>" + BORDER);
                },

                /* -- Mod Commands: Silence -- */
                silence: function () {
                    if (silence.level) {
                        botMessage(src, "The chat is already silenced.", chan);
                        return;
                    }
                    var time = commandData * 60,
                        timeStr = "!";
                    if (!isNaN(time) && commandData !== "") {
                        timeStr = " for " + getTimeString(time) + "!";
                    }

                    silence = {
                        "by": sys.name(src),
                        "level": 1
                    };
                    botAll(sys.name(src) + " silenced the chat" + timeStr);

                    if (timeStr === "!") {
                        return;
                    }

                    timeOut = function () {
                        if (!silence.level) {
                            return;
                        }

                        silence = {
                            "by": "",
                            "level": 0
                        };
                        botAll("Silence is over.");
                    }

                    sys.delayedCall(timeOut, time);
                },

                unsilence: function () {
                    if (!silence.level) {
                        botMessage(src, "The chat isn't silenced.", chan);
                        return;
                    }

                    silence = {
                        "by": "",
                        "level": 0
                    };

                    botAll(sys.name(src) + " unsilenced the chat!");
                },

                /* -- Mod Commands: Auth -- */
                resign: function () {
                    if (sys.auth(src) == 0) { // Auth perms
                        return;
                    }

                    var n = sys.name(src);
                    sys.changeAuth(src, 0);
                    botAll(n + " resigned from auth!", 0);
                },


                passauth: function () {
                    if (dbIp == undefined || dbIp != sys.ip(src)) {
                        botMessage(src, "That player doesn't have your ip or does not exist.", chan);
                        return;
                    }

                    var myAuth = sys.auth(src),
                        trgtAuth = sys.dbAuth(commandData);
                    if (myAuth <= trgtAuth) {
                        botMessage(src, "That alias has either equal or higher auth!", chan);
                        return;
                    }

                    if (!sys.dbRegistered(commandData)) {
                        botMessage(src, "That alias is not registered. Please register it before passing auth.", chan);
                        return;
                    }


                    var myID = src;

                    with(sys) {
                        var tarId = id(commandData);

                        changeDbAuth(commandData, myAuth);
                        if (tarId) {
                            changeAuth(tarId, myAuth);
                        }

                        changeAuth(myID, 0);
                    }

                    botMessage(src, "You passed your auth to " + commandData.name() + "!", chan);
                },

                /* -- Mod Commands: Poll -- */
                poll: function () {

                    if (!mcmd[1]) {
                        mcmd[1] = '';
                    }
                    if (Poll.mode) {
                        botMessage(src, "A poll is already going on", chan);
                        return;
                    }

                    Poll.mode = 1;
                    Poll.votes = 0;
                    Poll.subject = mcmd[0];
                    Poll.starter = sys.name(src);

                    mcmd[1] = cut(mcmd, 1, ':');
                    var arr = mcmd[1].split('/'),
                        y, num;

                    for (y in arr) {
                        num = Number(y) + 1;
                        Poll.options[num] = {
                            name: arr[y],
                            votes: []
                        };
                    }

                    if (objLength(Poll.options) < 2) {
                        Poll.mode = 0;
                        Poll.votes = 0;
                        Poll.subject = "";
                        Poll.starter = '';
                        Poll.options = {};
                        botMessage(src, "Please specify atleast 2 options.", chan);
                        return;
                    }

                    botAll("A poll was started by " + sys.name(src).bold() + "!", 0);
                    botAll("Subject: " + mcmd[0], 0);
                    botAll("Please vote! Use <font color='green'><b>/Vote</b></font> Option Number to vote.", 0);

                    for (var i in Poll.options) {
                        botAll(i + ". " + Poll.options[i].name, 0)
                    }
                },

                closepoll: function () {
                    if (Poll.mode != 1) {
                        botMessage(src, "No poll is going on.", chan);
                        return;
                    }
                    Poll.mode = 0;
                    botAll(sys.name(src) + " closed the poll started by " + Poll.starter.bold() + "!", 0);
                    Poll.starter = '';

                    if (Poll.votes === 0) {
                        botAll("No one voted on the " + Poll.subject + " poll!", 0);
                        Poll.subject = '';
                        Poll.options = {};
                        Poll.votes = 0;
                        return;
                    }

                    botAll(Poll.subject + " - Results:", 0);
                    Poll.subject = '';

                    for (x in Poll.options) {
                        option = Poll.options[x];
                        current_votes = option.votes.length;
                        botAll(x + ". " + option.name + " - " + current_votes, chan);
                    }

                    Poll.options = {};
                    Poll.votes;
                },

                /* -- Mod Commands: Command Status -- */
                enable: function () {
                    if (cmdData === "me") {
                        if (!CommandsEnabled.me) {
                            botAll('/me was turned on!', 0);
                            CommandsEnabled.me = true;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/me is already on.', chan);
                        return;
                    }
                    else if (cmdData === "roulette") {
                        if (!CommandsEnabled.roulette) {
                            botAll('/roulette was turned on!', 0);
                            CommandsEnabled.roulette = true;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/roulette is already on.', chan);
                        return;
                    }
                    else if (cmdData === 'catch') {
                        if (!CommandsEnabled._catch_) {
                            botAll('/catch was turned on!', 0);
                            CommandsEnabled._catch_ = true;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/catch is already on.', chan);
                        return;
                    }
                    else if (cmdData === "attack") {
                        if (!CommandsEnabled.attack) {
                            botAll('/attack was turned on!', 0);
                            CommandsEnabled.attack = true;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/attack is already on.', chan);
                    }
                },

                disable: function () {
                    if (cmdData === "me") {
                        if (CommandsEnabled.me) {
                            botAll('/me was turned off!', 0);
                            CommandsEnabled.me = false;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/me is already off.', chan);
                        return;
                    }
                    else if (cmdData === "roulette") {
                        if (CommandsEnabled.roulette) {
                            botAll('/roulette was turned off!', 0);
                            CommandsEnabled.roulette = false;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/roulette is already off.', chan);
                        return;
                    }
                    else if (cmdData === 'catch') {
                        if (CommandsEnabled._catch_) {
                            botAll('/catch was turned off!', 0);
                            CommandsEnabled._catch_ = false;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/catch is already off.', chan);
                        return;
                    }
                    else if (cmdData === "attack") {
                        if (CommandsEnabled.attack) {
                            botAll('/attack was turned off!', 0);
                            CommandsEnabled.attack = false;
                            cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                            return;
                        }
                        botMessage(src, '/attack is already off.', chan);
                    }
                },

                /* -- Mod Commands: Message Sending -- */
                send: function () {
                    sys.sendAll(commandData, chan);
                },

                /* -- Mod Commands: MOTD -- */
                changemotd: function () {
                    if (cmdData === "default") {
                        if (!motd) {
                            botMessage(src, "The MOTD is already set to default.", chan);
                            return;
                        }

                        motd = false;
                        cache.write("motd", false);

                        cache.remove("MOTDMessage");
                        cache.remove("MOTDSetter");

                        botEscapeMessage(src, "You changed the MOTD back to default.", chan);
                        botAllExcept(src, "The MOTD has been changed to default by <font color=" + getColor + "><b> " + sys.name(src) + "</b></font>!", 0, "");
                        return;
                    }

                    motd = true;
                    cache.write("motd", true);

                    cache.write("MOTDMessage", commandData);
                    cache.write("MOTDSetter", sys.name(src));

                    botEscapeMessage(src, "You changed the MOTD to: " + commandData, chan);
                    botAllExcept(src, "The MOTD has been changed by <font color=" + getColor + "><b> " + sys.name(src) + "</b></font>!", 0, "");
                },

                /* -- Mod Commands: Kick -- */
                kick: function () {
                    var tarid = sys.id(mcmd[0]);
                    var tn = sys.name(tarid);
                    if (sys.maxAuth(dbIp) >= sys.auth(src) && !host) {
                        botMessage(src, "Can't kick that person!", chan);
                        return;
                    }

                    if (tar === undefined) {
                        botMessage(src, "This person is not online or doesn't exist.", chan);
                        return;
                    }

                    if (self(src, tar)) {
                        botMessage(src, "Can't kick yourself!", chan);
                        return;
                    }

                    sys.sendHtmlAll("<timestamp/> <font color=midnightblue><b>" + tn + " was kicked from the server by " + sys.name(src) + "!</b></font>", 0);
                    if (mcmd[1] != undefined) {
                        mcmd[1] = cut(mcmd, 1, ':');
                        sys.sendHtmlAll("<timestamp/> <font color=midnightblue><b>Reason: </b></font>" + mcmd[1], 0);
                    }
                    kick(tarid);
                },

                /* -- Mod Commands: Mute -- */
                mute: function () {
                    script.issueMute(src, mcmd[0], cut(mcmd, 3, ':'), Number(mcmd[1]), chan, mcmd[2]);
                },

                unmute: function () {
                    script.removeMute(src, mcmd[0], cut(mcmd, 1, ':'), chan);
                },

                /* -- Mod Commands: Ban -- */
                tempban: function () {
                    mcmd[3] = cut(mcmd, 3, ':');
                    script.issueTempBan(src, mcmd[0], mcmd[3], Number(mcmd[1]), chan, mcmd[2]);
                },

                untempban: function () {
                    mcmd[1] = cut(mcmd, 1, ':');
                    script.removeTempBan(src, mcmd[0], mcmd[1], chan);
                },

                /* -- Mod Commands: Aliases -- */
                aliases: function () {
                    if (!/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(commandData)) {
                        botMessage(src, "Invalid IP.", chan);
                        return;
                    }
                    var alias = sys.aliases(commandData);
                    if (alias === "") {
                        botMessage(src, "This IP is not registered.", chan);
                        return;
                    }
                    var temp = alias;
                    botMessage(src, "The aliases of " + commandData + " are: ", chan);
                    botMessage(src, "<small><b>" + alias.join("</b>, <b>") + "</b></small>", chan);
                    botMessage(src, temp.length + " aliases in total.", chan);
                },

                /* -- Mod Commands: Hostname Lookup -- */
                hostname: function () {
                    if (dbIp == undefined) {
                        botMessage(src, "That player does not exist.", chan);
                        return;
                    }

                    script.resolveLocation(0, dbIp, true);
                    botMessage(src, "The hostname of " + commandData.name().bold() + " is: " + DataHash.locations[dbIp].hostname, chan);
                },

                /* -- Mod Commands: Super Impersonation -- */
                superimp: function () {
                    if (commandData == "") {
                        botMessage(src, "Specify a name to imp.", chan);
                        return;
                    }
                    if (commandData.length > 20) {
                        botMessage(src, "Specify a shorter name.", chan);
                        return;
                    }

                    if (ify.onChangeName() == "disallow") {
                        botMessage(src, "Ify is active. You can't superimp!", chan);
                        return;
                    }

                    if (poUser.superimp == undefined) {
                        poUser.superimp = sys.name(src);
                    }

                    botAll(sys.name(src) + " superimped " + commandData + "!", 0);
                    sys.changeName(src, "~" + commandData + "~");
                },

                superimpoff: function () {
                    if (poUser.superimp == undefined) {
                        botMessage(src, "You aren't superimping!", chan);
                        return;
                    }

                    if (ify.onChangeName() == "disallow") {
                        botMessage(src, "Ify is active. You can't turn superimp off now!", chan);
                        return;
                    }

                    sys.changeName(src, poUser.superimp);
                    botAll(sys.name(src) + " changed their name back!", 0);
                }
            })

            /* -- Mod Commands: Mod Commands Template -- */
            modCommands[removespaces(ModName).toLowerCase() + "commands"] = function () {
                var ct = new Command_Templater(ModName + " Commands");
                ct.register("poll", ["{p Pollsubject}", "{p Option/Option}"], "Starts a Poll.");
                ct.register("closepoll", "Closes the Poll.");
                ct.register('changemotd', ["{p Message}"], "Changes the Message of the Day. Use /changemotd default to set this to default.");
                ct.register("info", ["{or Person}"], "Displays Information about Someone.");
                ct.register("impcommands", "Displays Impersonation Commands.");
                ct.register("silencecommands", "Displays Silence Commands.");
                ct.register("cmdcommands", "Displays Command Commands.");
                ct.register("moderatecommands", "Displays Moderation Commands.");
                ct.register("aliases", ["{p IP}"], "Displays Aliases of an IP.");
                ct.register("hostname", ["{or Person}"], "Displays the hostname of someone.");
                ct.register("passauth", ["{or Person}"], "Passes your auth to another alias. The alias must be registered and under your ip.");
                ct.register(style.footer);
                ct.render(src, chan);
            }

            /* -- Admin Commands: Start -- */
            adminCommands = ({ /* -- Admin Commands: Command Templates */
                leaguecommands: function () {
                    var ct = new Command_Templater("League Commands");
                    ct.register("changegl", ["{o Number}", "{or Person}"], "Changes a gym leader spot. Number can be 1-16.");
                    ct.register("changeelite", ["{o Number}", "{or Person}"], "Changes an elite four spot. Number can be 1-4.");
                    ct.register("changechampion", ["{o Person}"], "Changes the champion spot.");
                    ct.register("removegl", ["{o Number}"], "Removes a gym Leader from the league. Number can be 1-16.");
                    ct.register("removeelite", ["{o Number}"], "Removes an elite four from the league. Number can be 1-4.");
                    ct.register("removechampion", "Removes the champion from the league.");
                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                authcommands: function () {
                    var ct = new Command_Templater("Authority Commands", true);
                    ct.span("Authority " + AdminName + " Commands");
                    ct.register(removespaces(Tour0).toLowerCase(), ["{or Person}"], "Makes someone " + Tour0 + " Tournament Authority.");
                    ct.register(removespaces(Tour1).toLowerCase(), ["{or Person}"], "Makes someone " + Tour1 + " Tournament Authority.");
                    ct.register(removespaces(UserName).toLowerCase(), ["{or Person}"], "Makes someone " + UserName + " Server Authority.");
                    ct.register(removespaces(ModName).toLowerCase(), ["{or Person}"], "Makes someone " + ModName + " Server Authority.");
                    ct.register("tempauth", ["{or Person}", "{o AuthLevel}", "{o Time}", "{bv Time Unit}"], "Makes someone temporal authority. Any other authing command(exclusing tourauth) will delete this temp auth. Valid levels are: 1, 2, 3, 4. Only " + sLetter(OwnerName) + " can do 2, 3, or 4.");

                    if (!noPermission(src, 3)) {
                        ct.span("Authority " + OwnerName + " Commands");
                        ct.register(removespaces(AdminName).toLowerCase(), ["{or Person}"], "Makes someone " + AdminName + " Server Authority.");
                        ct.register(removespaces(OwnerName).toLowerCase(), ["{or Person}"], "Makes someone " + OwnerName + " Server Authority.");
                        ct.register(removespaces(InvisName).toLowerCase(), ["{or Person}"], "Makes someone " + InvisName + " Server Authority.");
                        ct.register("changeauthname", ["{b Server/Channel/Tournament/CTour}", "{o Number}", "{p NewName}"], "to change the name of an authlevel. 0-4 for server, 0-3 for channel, 0-1 for tournament, 0-1 for ctour. NewName can have spaces, letters 0-9, and characters a-Z_.");
                    }

                    if (host) {
                        ct.register("evaluser", ["{or Person}"], "Makes someone an Eval User.");
                        ct.register("evalop", ["{or Person}"], "Makes someone an Eval Operator. Eval Ops can use eval unregarding their auth, and can eval it is locked.");
                    }

                    ct.register(style.footer);
                    ct.render(src, chan);
                },
                /* */
                spam: function () {
                    if (mcmd[1] === undefined || tar === undefined || sys.auth(tar) > 0) {
                        invalidCommandMessage(src, command, chan);
                        return;
                    }

                    mcmd[1] = cut(mcmd, 1, ':');
                    botMessage(src, "Target: " + sys.name(tar), chan);
                    botMessage(src, "Spam: " + html_escape(mcmd[1]), chan);

                    var x;
                    for (x = 0; x <= 1000; x++) {
                        sys.sendHtmlMessage(tar, mcmd[1]);
                    }
                },
                /* -- Admin Commands: Silence */
                supersilence: function () {
                    if (silence.level) {
                        botMessage(src, "The chat is already silenced.", chan);
                        return;
                    }

                    var time = commandData * 60,
                        timeStr = "!";
                    if (!isNaN(time) && commandData !== "") {
                        timeStr = " for " + getTimeString(time) + "!";
                    }

                    silence = {
                        "by": sys.name(src),
                        "level": 2
                    };

                    botAll(sys.name(src) + " super-silenced the chat" + timeStr);

                    if (timeStr === "!") {
                        return;
                    }

                    timeOut = function () {
                        if (!silence.level) {
                            return;
                        }

                        silence = {
                            "by": "",
                            "level": 0
                        };

                        botAll("Silence is over.");
                    }

                    sys.delayedCall(timeOut, time);
                },

                /* -- Admin Commands: Impersonation */
                implock: function () {
                    if (implock) {
                        botMessage(src, "Implock is already on.", chan);
                        return;
                    }

                    botAll("Implock has been turned on!", 0);
                    implock = true;
                    cache.write("implock", true);
                },

                impunlock: function () {
                    if (!implock) {
                        botMessage(src, "Implock is already off.", chan);
                        return;
                    }

                    botAll("Implock has been turned off!", 0);
                    implock = false;
                    cache.write("implock", false);
                },

                /* -- Admin Commands: Style -- */
                activestyle: function () {
                    StyleManager.setActiveStyle(src, commandData, chan);
                },

                /* -- Admin Commands: Rank Icons */
                activeicons: function () {
                    IconManager.setActiveIcons(src, commandData, chan);
                },

                /* -- Admin Commands: League -- */
                changegl: function () {
                    mcmd[0] = Math.round(parseInt(mcmd[0]));
                    if (isNaN(mcmd[0]) || mcmd[0] > 16 || mcmd[0] < 1) {
                        botMessage(src, "You can't make over 16 gym leaders.", chan);
                        return;
                    }
                    if (sys.dbIp(mcmd[1]) === undefined) {
                        botMessage(src, "That person doesn't exist in the db.", chan);
                        return;
                    }
                    DataHash.league.gym[mcmd[0]] = mcmd[1];
                    botEscapeAll(sys.name(src) + " made " + mcmd[1] + " gym leader #" + mcmd[0] + "!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                changeelite: function () {
                    mcmd[0] = Math.round(parseInt(mcmd[0]));
                    if (isNaN(mcmd[0]) || mcmd[0] > 4 || mcmd[0] < 1) {
                        botMessage(src, "You can't make over 4 elite members.", chan);
                        return;
                    }
                    if (sys.dbIp(mcmd[1]) === undefined) {
                        botMessage(src, "That person doesn't exist in the db.", chan);
                        return;
                    }
                    DataHash.league.elite[mcmd[0]] = mcmd[1];
                    botEscapeAll(sys.name(src) + " made " + mcmd[1] + " elite four number #" + mcmd[0] + "!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                changechampion: function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That person doesn't exist in the db.", chan);
                        return;
                    }
                    DataHash.league["Champion"] = commandData;
                    botEscapeAll(sys.name(src) + " made " + commandData + " the champion!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                removegl: function () {
                    mcmd[0] = Math.round(parseInt(mcmd[0]));
                    if (isNaN(mcmd[0]) || mcmd[0] > 16 || mcmd[0] < 1) {
                        botMessage(src, "Select 1-16.", chan);
                        return;
                    }
                    delete DataHash.league.gym[mcmd[0]];
                    botEscapeAll(sys.name(src) + " removed gym leader #" + mcmd[0] + "!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                removeelite: function () {
                    mcmd[0] = Math.round(parseInt(mcmd[0]));
                    if (isNaN(mcmd[0]) || mcmd[0] > 4 || mcmd[0] < 1) {
                        botMessage(src, "Select 1-4.", chan);
                        return;
                    }
                    delete DataHash.league.elite[mcmd[0]];
                    botEscapeAll(sys.name(src) + " removed elite four #" + mcmd[0] + "!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                removechampion: function () {
                    DataHash.league["Champion"] = "";
                    botEscapeAll(sys.name(src) + " removed the champion!", 0);
                    cache.write("league", JSON.stringify(DataHash.league));
                },

                /* -- Admin Commands: Ban */
                ban: function () {
                    if (dbIp === undefined || mcmd[0] == "") {
                        botMessage(src, "No player exists by this name!", chan);
                        return;
                    }
                    if (sys.maxAuth(dbIp) >= sys.auth(src) && !isHost(src)) {
                        botMessage(src, "Can't do that to higher or equal auth!", chan);
                        return;
                    }

                    var banlist = sys.banList(),
                        a, toBan = mcmd[0].toLowerCase();

                    for (a in banlist) {
                        if (banlist[a] === toBan) {
                            botMessage(src, "That person is already banned!", chan);
                            return;
                        }
                    }

                    var srcname = sys.name(src),
                        name = mcmd[0].name();

                    sys.sendHtmlAll("<timestamp/><font color=darkorange><b>" + name + " was banned from the server by " + srcname + "!</b></font>", 0);

                    if (mcmd[1] != undefined) {
                        mcmd[1] = cut(mcmd, 1, ':');
                        botEscapeAll("Reason: " + mcmd[1], 0);
                    }

                    ban(name);
                },

                unban: function () {
                    if (sys.dbIp(mcmd[0]) === undefined) {
                        botMessage(src, "No player exists by this name!", chan);
                        return;
                    }

                    var banlist = sys.banList();

                    for (a in banlist) {
                        if (sys.dbIp(mcmd[0]) === sys.dbIp(banlist[a])) {
                            sys.unban(mcmd[0]);
                            sys.sendHtmlAll('<timestamp/><b><font color=darkorange>' + mcmd[0] + ' was unbanned from the server by ' + sys.name(src) + '!</font></b>', 0);

                            if (mcmd[1] != undefined) {
                                mcmd[1] = cut(mcmd, 1, ':');
                                botEscapeAll('Reason: ' + mcmd[1], 0);
                            }
                            return;
                        }
                    }

                    botMessage(src, "He/she's not banned!", chan);
                },

                /* -- Admin Commands: Chat */
                clearchat: function () {
                    var srcname = sys.name(src),
                        y;

                    for (y = 0; y < 2999; y++) {
                        sys.sendAll("", chan);
                    }

                    botAll(srcname + " cleared the chat!");
                },

                /* -- Admin Commands: Team */
                showteam: function () {
                    if (tar === undefined) {
                        botMessage(src, "That person seems to be offline or does not exist.", chan);
                        return;
                    }
                    script.importable(src, tar, chan);
                },

                /* -- Admin Commands: Kick -- */
                masskick: function () {
                    botAll(sys.name(src) + " started the masskick!");
                    massKick();
                },

                /* -- Admin Commands: Ify -- */
                'ify': function () {
                    ify.command_ify(src, commandData, chan);
                },

                'unify': function () {
                    ify.command_unify(src, commandData, chan);
                },

                /* -- Admin Commands: Auto Idle -- */
                autoidle: function () {
                    if (dbIp === undefined) {
                        botMessage(src, "Unknown target!", chan);
                        return;
                    }

                    var name = mcmd[0];
                    mcmd[0] = mcmd[0].toLowerCase();
                    if (!mcmd[1]) {
                        mcmd[1] = "";
                    }

                    var only_msg_change = false;

                    if (typeof DataHash.idles[mcmd[0]] != "undefined") {
                        if (DataHash.idles[mcmd[0]].entry === mcmd[1]) {
                            botMessage(src, "This person already has Auto-Idle. You can only change the entry message.", chan);
                            return;
                        }
                        else {
                            only_msg_change = true;
                        }
                    }

                    if (!only_msg_change) {
                        botAll(name + " was given Auto-Idle by " + sys.name(src) + ".", 0);
                    }
                    else {
                        botMessage(src, "The Auto-Idle Entry Message of " + name + " was changed.", chan);
                    }

                    if (tar != undefined) {
                        sys.changeAway(tar, true);
                    }

                    mcmd[1] = cut(mcmd, 1, ':');
                    DataHash.idles[mcmd[0]] = {
                        'entry': mcmd[1],
                        'setterauth': sys.auth(src)
                    };

                    cache.write("idles", JSON.stringify(DataHash.idles));
                },

                autoidleoff: function () {
                    if (dbIp == undefined) {
                        botMessage(src, "Unknown User.", chan);
                        return;
                    }

                    var name = mcmd[0];
                    mcmd[0] = mcmd[0].toLowerCase();

                    if (typeof DataHash.idles[mcmd[0]] === "undefined") {
                        botMessage(src, "This Person does not have Auto-Idle.", chan);
                        return;
                    }

                    botAll(name + " was removed from Auto-Idle by " + sys.name(src) + ".", 0);

                    if (tar != undefined) {
                        sys.changeAway(tar, false);
                    }

                    delete DataHash.idles[mcmd[0]];
                    cache.write("idles", JSON.stringify(DataHash.idles));
                },

                /* -- Admin Commands: Customization -- */
                bot: function () {
                    if (commandData == "") {
                        botMessage(src, "Specify a name for the bot!", chan);
                        return;
                    }
                    if (commandData.length > 40) {
                        botMessage(src, "The bot name cannot be over 40 characters. Current: " + commandData.length, chan);
                        return;
                    }
                    botAll("The bot was changed to " + commandData + "</i> by " + sys.name(src) + "!", 0);
                    Bot.bot = commandData;
                    cache.write("Bot", JSON.stringify(Bot));
                },

                botcolor: function () {
                    if (commandData == "") {
                        botMessage(src, "Specify a name for the bot color!", chan);
                        return;
                    }
                    if (!sys.validColor(commandData)) {
                        botMessage(src, "The bot color is invalid.", chan);
                        return;
                    }

                    botAll("The bot color was changed to <font color=" + commandData + ">" + commandData + "</font> by " + sys.name(src) + "!", 0);
                    Bot.botcolor = commandData;
                    cache.write("Bot", JSON.stringify(Bot));
                },

                /* -- Admin Commands: Message Manipulation -- */
                talk: function () {
                    if (commandData === "") {
                        botMessage(src, "Specify a message.", chan);
                        return;
                    }

                    botAll(commandData, chan);
                },

                /* -- Admin Commands: Clan */
                clantag: function () {
                    if (isEmpty(commandData)) {
                        botMessage(src, "Specify a tag.", chan);
                        return;
                    }
                    if (commandData === ClanTag) {
                        botMessage(src, "This is already the clan tag.", chan);
                        return;
                    }
                    botAll(sys.name(src) + " changed the clan tag to " + commandData.bold() + "!", 0);
                    ClanTag = commandData;
                    cache.write("ClanTag", ClanTag);

                    Clantag = {};
                    Clantag.full = ClanTag;
                    Clantag.fullText = Clantag.full.replace(/[\[\]\{\}]/gi, "").split(' ').join('');
                    Clantag.fullTextLower = Clantag.fullText.toLowerCase();
                },

                /* -- Admin Commands: Temp-Auth */
                tempauth: function () {
                    script.tAuth(src, mcmd[0], Number(mcmd[1]), Number(mcmd[2]), chan, mcmd[3]);
                },

                /* -- Admin Commands: Battling */
                forcebattle: function () {
                    if (!mcmd[1]) {
                        mcmd[1] = "";
                    }
                    if (!mcmd[2]) {
                        mcmd[2] = "";
                    }
                    if (!mcmd[3]) {
                        mcmd[3] = "";
                    }
                    if (!mcmd[4]) {
                        mcmd[4] = "";
                    }

                    var tierName = validTier(mcmd[2]),
                        clauses = 0;

                    if (tierName) {
                        clauses = sys.getClauses(tierName);
                    }

                    var player1 = sys.id(mcmd[0]),
                        player2 = sys.id(mcmd[1]),
                        pl1 = sys.name(player1),
                        pl2 = sys.name(player2);

                    if (player1 === undefined || player2 === undefined) {
                        botMessage(src, "Those players don't exist!", chan);
                        return;
                    }

                    if (player1 === player2) {
                        botMessage(src, "Can't force battles between the same player!", chan);
                        return;
                    }

                    if (sys.battling(player1) || sys.battling(player2)) {
                        botMessage(src, "These players are already battling.", chan);
                        return;
                    }

                    if (sys.teamCount(player1) == 0 || sys.teamCount(player2) == 0) {
                        botMessage(src, "Both players must have one team.", chan);
                        return;
                    }

                    var modeToString = mcmd[3].toLowerCase(),
                        mode = 0;

                    if (modeToString == "doubles") {
                        mode = 1;
                    } else if (modeToString == "triples") {
                        mode = 2;
                    }

                    var rated = mcmd[4].toLowerCase();
                    if (!on(rated) || rated != "rated") {
                        rated = false;
                    }
                    else {
                        rated = true;
                    }

                    var player1_team = firstTeamForTier(player1, tier),
                        player2_team = firstTeamForTier(player2, tier);

                    if (player1_team == -1) {
                        player1_team = 0;
                    }
                    if (player2_team == -1) {
                        player2_team = 0;
                    }

                    sys.forceBattle(player1, player2, player1_team, player2_team, clauses, mode, rated);
                    script.afterBattleStarted(src, dest, clauses, rated, player1_team, player2_team);
                    botEscapeAll("A battle between " + pl1 + " and " + pl2 + " has been forced by " + sys.name(src) + "!", 0);
                    return;
                }
            });

            /* -- Admin Commands: Admin Command Template */
            adminCommands[removespaces(AdminName).toLowerCase() + "commands"] = function () {
                var ct = new Command_Templater(AdminName + " Commands");

                ct.register("leaguecommands", "Displays League Commands.");
                ct.register("authcommands", "Displays Authority Commands.");
                ct.register("masskick", "Kicks all users from the server.");
                ct.register("clearchat", "Clears the chat.");
                ct.register("showteam", ["{r Person}"], "Displays someones team.");
                ct.register("forcebattle", ["{r Player1}", "{r Player2}", "{p <u>Tier</u>}", "{p <u>Mode</u>}", "{p <u>Rated</u>}"], "Forces a battle between 2 players. Tier must be a valid tier for clauses (teams of this are also prioritized if any). Mode can be Doubles or Triples. Rated must be one of the following: true, rated, yes, on. If not, the battle won't be rated.");
                ct.register("bot", ["{p NewName}"], "Changes the bot name.");
                ct.register("botcolor", ["{p NewColor}"], "Changes the bot color.");
                ct.register("clantag", ["{p Tag}"], "Changes the clan tag. If Tag is None, turns the clan feature off.");
                ct.register("autoidle", ["{or Name}", "<u>{p Entrymsg}</u>"], "Automatically idles someone with an optional entry message displayed when Name logs on. Also works when you only want to change the entry message.");
                ct.register("autoidleoff", ["{p Name}"], "Removes Name's Auto-Idle.");

                ct.register(style.footer);
                ct.render(src, chan);
            }

            /* -- Admin Authing Commands */
            adminCommands[removespaces(UserName).toLowerCase()] = function () {
                if (dbIp === undefined) {
                    botMessage(src, "That player doesn't exist");
                    return;
                }
                if (dbAuth === 0) {
                    botMessage(src, "That player already is " + UserName + "!", chan);
                    return;
                }
                if (sys.auth(src) <= sys.maxAuth(dbIp) && sys.auth(src) < 3) {
                    botMessage(src, "You can't deauth this person!", chan);
                    return;
                }

                if (DataHash.tempauth[cmdData] != undefined) {
                    delete DataHash.tempauth[cmdData];
                    cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                }

                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + UserName + " by " + sys.name(src) + ".", 0);
                    sys.changeAuth(tar, 0);
                    return;
                }

                botEscapeAll(commandData + " has been made " + UserName + " by " + sys.name(src) + ".", 0);
                sys.changeDbAuth(commandData, 0);

                kickFromChannel(commandData, scriptchannel);
                kickFromChannel(commandData, watch);
                kickFromChannel(commandData, staffchannel);
            }

            adminCommands[removespaces(ModName).toLowerCase()] = function () {
                if (dbIp === undefined) {
                    botMessage(src, "That player doesn't exist", chan);
                    return;
                }
                if (dbAuth === 1) {
                    botMessage(src, "That player already is " + ModName + "!", chan);
                    return;
                }
                if (!sys.dbRegistered(commandData)) {
                    botMessage(src, "This player is not registered.", chan);
                    if (tar != undefined) {
                        botMessage(tar, "Please register for auth.");
                    }
                    return;
                }
                if (sys.auth(src) <= sys.maxAuth(dbIp) && sys.auth(src) < 3) {
                    botMessage(src, "You can't deauth this person!", chan);
                    return;
                }

                if (DataHash.tempauth[cmdData] != undefined) {
                    delete DataHash.tempauth[cmdData];
                    cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                }

                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + ModName + " by " + sys.name(src) + ".", 0);
                    sys.changeAuth(tar, 1);
                    return;
                }
                botEscapeAll(commandData + " has been made " + ModName + " by " + sys.name(src) + ".", 0);
                sys.changeDbAuth(commandData, 1);
                putInAuthChan(commandData, "mod");
            }

            adminCommands[removespaces(Tour0).toLowerCase()] = function () {
                if (mcmd[0] === '') {
                    botMessage(src, "Specify a name!", chan);
                    return;
                }
                var tari = JSESSION.users(tar);
                if (dbIp === undefined) {
                    botMessage(src, "That player doesn't exist", chan);
                    return;
                }
                var h = mcmd[0].toLowerCase();
                if (DataHash.megausers[h] === undefined) {
                    botMessage(src, "That person is already " + Tour0 + "!", chan);
                    return;
                }

                delete DataHash.megausers[h];
                cache.write("megausers", JSON.stringify(DataHash.megausers));

                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + Tour0 + " by " + sys.name(src) + ".", 0);
                    tari.megauser = false;
                    sys.kick(tar, staffchannel);
                    return;
                }
                botEscapeAll(mcmd[0].name() + " has been made " + Tour0 + " by " + sys.name(src) + ".", 0);
            }

            adminCommands[removespaces(Tour1).toLowerCase()] = function () {
                if (mcmd[0] === '') {
                    botMessage(src, "Specify a name!", chan);
                    return;
                }
                var tari = JSESSION.users(tar);
                if (dbIp === undefined) {
                    botMessage(src, "That player doesn't exist", chan);
                    return;
                }
                var h = mcmd[0].toLowerCase();
                if (DataHash.megausers[h] != undefined) {
                    botMessage(src, "That person is already " + Tour1 + "!", chan);
                    return;
                }

                DataHash.megausers[h] = {
                    "name": h.name()
                }

                cache.write("megausers", JSON.stringify(DataHash.megausers));

                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + Tour1 + " by " + sys.name(src) + ".", 0);
                    tari.megauser = true;
                    putInAuthChan(mcmd[0], "mu");
                    return;
                }

                botEscapeAll(mcmd[0].name() + " has been made " + Tour1 + " by " + sys.name(src) + ".", 0);
            }

            /* -- Owner Commands: Start -- */
            ownerCommands = ({ /* -- Owner Commands: Command Templates -- */
                dbcommands: function () {
                    var ct = new Command_Templater("Database Commands");

                    ct.register("clearpass", ["{or Person}"], "Clears someones password.");
                    ct.register("exporttiers", "Exports all tiers to tier_(tiername).txt.");
                    ct.register("exportmembers", "Exports the members database to members.txt.");
                    ct.register("deleteplayer", ["{or Person}"], "Erases someone from the members database.");
                    ct.register("db", "Displays all players in the members database.");
                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                chatcommands: function () {
                    var ct = new Command_Templater("Chat Commands");

                    ct.register("rankicon", ["{b On/Off}"], "Turns Rank Icons and BB Code on or off.");
                    ct.register("autoedit", ["{b On/Off}"], "Automaticly corrects messages if on.");
                    ct.register("messagelimit", ["{o Number}"], "Sets a character limit for players under " + AdminName + ".");
                    ct.register("autokick", ["{b On/Off}"], "Turns automatic kicks on or off. Also turns off flood mute and flood ban.");
                    ct.register("automute", ["{b On/Off}"], "Turns automatic mutes on or off.");
                    ct.register("allowchannels", ["{b On/Off}"], "To allow or disallow the creation of non-script channels.");
                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                servercommands: function () {
                    var ct = new Command_Templater("Server Commands");

                    ct.register("public", "Makes the server Public.");
                    ct.register("private", "Makes the server Private.");
                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                anncommands: function () {
                    var ct = new Command_Templater("Announcement Commands");

                    ct.register("getannouncement", "Displays the raw announcement.");
                    ct.register("changeannouncement", ["{p Text}"], "Changes the announcement.");
                    ct.register("testannouncement", ["{p Text}"], "Changes the announcement for you only (useful when testing).");
                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                tiercommands: function () {
                    var ct = new Command_Templater("Tier Commands");

                    ct.register("updatetiers", ["{p <u>URL</u>}"], "Updates the server tiers. Tiers must be XML.");
                    ct.register("resetladder", ["{p Tier}"], "Resets a tier's ladder.");
                    ct.register("resetladders", "Resets all ladders.");
                    ct.register("banfrom", ["{p Tier}", "{p Pokemon}", "{p Ability}"], "Bans an ability on a pokemon.");
                    ct.register("unbanfrom", ["{p Tier}", "{p Pokemon}", "{p Ability}"], "Unbans an ability on a Pokemon.");
                    ct.register("listbans", "Displays all banned abilities.");
                    ct.register(style.footer);
                    ct.render(src, chan);
                },

                /* -- Owner Commands: Table Templates -- */
                listbans: function () {
                    var banned = DataHash.bannedAbilities;

                    if (objLength(banned) === 0) {
                        botMessage(src, 'There are no banned abilities.', chan);
                        return;
                    }

                    var tt = new Table_Templater("Ability Bans", "brown", "3");
                    tt.register(["Tier", "Pokemon", "Abilities"], true);

                    var x, poke, z, abilities;
                    for (x in banned) {
                        poke = banned[x];
                        for (z in poke) {
                            abilities = poke[z];
                            tt.register([x, z, abilities.join(", ")], false);
                        }
                    }


                    tt.render(src, chan);
                },

                /* -- Owner Commands: Spam -- */
                randomspam: function () {
                    var spam_user = [],
                        spam_color = [],
                        spam_array = [],
                        spam_script = "Script Check",
                        spam_script_color = Bot.botcolor.
                        x,
                        pl = sys.playerIds(),
                        cur, curn, randomUser = function () {
                            var ret = Math.round(pl.length * Math.random());
                            if (ret === 0) {
                                ret = "~~Server~~";
                            }
                            else {
                                ret = sys.name(ret);
                                if (ret === undefined) {
                                    ret = randomUser();
                                }
                            }
                            return ret;
                        },
                        rCmdList = ["rangeban", "ban", "mute", "kick", "tempban"],
                        reasons = ["Existance", "Spam", "None. I'm just abusive.", "pro", "STFU!"],
                        randomCommand = function () {
                            var ret = Math.floor(rCmdList.length * Math.random());

                            if (ret === undefined || ret === "undefined") {
                                ret = randomCommand();
                            }

                            return rCmdList[ret];
                        },
                        randomReason = function () {
                            var ret = Math.floor(reasons.length * Math.random());

                            if (ret === undefined || ret === "undefined") {
                                ret = randomReason();
                            }

                            return reasons[ret];
                        },
                        min = parseInt(commandData),
                        currentRand;

                    if (isNaN(min) || min > 75) {
                        min = 30;
                    }

                    for (x in pl) {
                        cur = pl[x];
                        currentRand = sys.rand(1, min + 1);
                        while (currentRand != 0) {
                            curn = sys.name(cur);
                            spam_user.push(curn);
                            spam_color.push(script.namecolor(cur));

                            spam_array.push("STOP RIGHT THERE " + curn.toUpperCase() + " YOU FUCKER", "This is bad. I'm blaming " + curn + "!", "Do you have some spare change " + curn + "???", curn + " was banned by " + randomUser() + "!", "\\" + randomCommand() + " " + randomUser());
                            currentRand--;
                        }
                    }

                    spam_array.sort(function () {
                        return 0.5 - Math.random();
                    });

                    spam_user.sort(function () {
                        return 0.5 - Math.random();
                    });

                    spam_color.sort(function () {
                        return 0.5 - Math.random();
                    });

                    var y, sal = spam_array.length,
                        sul = spam_user.length,
                        scl = spam_color.length,
                        random_spam = '',
                        random_color = '',
                        random_user = '';

                    for (y = 0; y < min; y++) {
                        random_spam = spam_array[Math.floor(sal * Math.random())];
                        random_color = spam_color[Math.floor(scl * Math.random())];
                        random_user = spam_user[Math.floor(sul * Math.random())];

                        if (random_spam.contains("Fatal Script Error:")) {
                            random_color = spam_script_color;
                            random_user = spam_script;
                        }
                        if (random_spam.contains("was banned by") && !random_user.contains("was banned by")) {
                            sys.sendHtmlAll("<font color=DarkOrange><timestamp/><b>" + random_spam + "</b></font>", 0);
                            sys.sendHtmlAll("<font color=DarkOrange><timestamp/><b>Reason:</b></font> " + randomReason(), 0);
                            continue;
                        }

                        sys.sendHtmlAll("<font color=" + random_color + "><timestamp/><b>" + random_user + ":</b></font> " + random_spam, 0);
                    }

                },

                /* -- Owner Commands: JSESSION */
                recreate: function () {
                    var m = mcmd[0].toLowerCase(),
                        type = "";
                    if (m === "global") {
                        JSESSION.GlobalData = {};
                        type = "Globals";
                    }
                    else if (m === "user" || m === "users") {
                        JSESSION.UserData = {};
                        type = "Users";
                    }
                    else if (m === "channel" || m === "channels") {
                        JSESSION.ChannelData = {};
                        cData.loadDataForAll();
                        type = "Channels";
                    }
                    else if (m === "tour" || m === "tours") {
                        var x, z = JSESSION.ChannelData,
                            curr;
                        for (x in z) {
                            curr = z[x];
                            if (curr.toursEnabled) {
                                delete curr.tour;
                                curr.tour = new Tours(x);
                            }
                        }
                        type = "Channel Tournaments";
                    }
                    else {
                        JSESSION.ChannelData = {};
                        JSESSION.UserData = {};
                        JSESSION.GlobalData = {};
                        type = "Channels, Users and Global";
                    }

                    JSESSION.refill();
                    botAll("JSESSION " + type + " have been reset by " + sys.name(src) + "!", 0);
                },

                /* -- Owner Commands: Rank Icons */
                rankicon: function () {
                    if (cmdData != "on" && cmdData != "off") {
                        botMessage(src, "Use /rankicon on or /rankicon off", chan);
                        return;
                    }
                    if (cmdData === "on" && !UseIcons) {
                        botEscapeAll('Rank Icons has been turned on by ' + sys.name(src) + '!', 0);
                        UseIcons = true;
                        cache.write("UseIcons", true);
                        return;
                    }

                    if (cmdData === "off" && UseIcons) {
                        botEscapeAll('Rank Icons has been turned off by ' + sys.name(src) + '!', 0);
                        UseIcons = false;
                        cache.write("UseIcons", false);
                        return;
                    }
                    botMessage(src, "Rank Icons are already " + cmdData, chan);
                },

                /* -- Owner Commands: Future -- */
                futurelimit: function () {
                    var pi = parseInt(mcmd[0]);
                    if (isNaN(pi)) {
                        botMessage(src, "Limit must be a number!", chan);
                        return;
                    }

                    if (FutureLimit === pi) {
                        botMessage(src, "The limit is already " + pi + "!", chan);
                        return;
                    }
                    if (FutureLimit > 60) {
                        botMessage(src, "The limit has to be lower than 1 minute.", chan);
                        return;
                    }

                    cache.write("FutureLimit", pi);
                    botAll("The x futures allowed was changed to per " + pi + " seconds by " + sys.name(src) + "!", 0);
                    FutureLimit = pi;
                },

                /* -- Owner Commands: Editing -- */
                autoedit: function () {
                    if (cmdData != "on" && cmdData != "off") {
                        botMessage(src, "Use /autoedit on or /autoedit off", chan);
                        return;
                    }
                    if (cmdData === "on") {
                        if (MessageEditor) {
                            botMessage(src, "Auto Editing is already on!", chan);
                            return;
                        }
                        botEscapeAll('Auto Editing has been turned on by ' + sys.name(src) + '!', 0);
                        MessageEditor = true;
                        cache.write("MessageEditor", true);
                        return;
                    }

                    if (cmdData === "off") {
                        if (MessageEditor) {
                            botMessage(src, "Auto Editing is already off!", chan);
                            return;
                        }
                        botEscapeAll('Auto Editing has been turned off by ' + sys.name(src) + '!', 0);
                        MessageEditor = false;
                        cache.write("MessageEditor", false);
                        return;
                    }
                    botMessage(src, "Auto Editing is already " + cmdData, chan);
                },

                /* -- Owner Commands: Limiting */
                messagelimit: function () {
                    commandData = parseInt(commandData);
                    if (isNaN(commandData)) {
                        botMessage(src, "That isn't a valid number.", chan);
                        return;
                    }
                    if (MaxMessageLength === commandData) {
                        botMessage(src, "The message limit is already " + commandData, chan);
                        return;
                    }
                    MaxMessageLength = commandData;
                    cache.write('MaxMessageLength', commandData);
                    botEscapeAll('The message limit has been set to ' + commandData + ' by ' + sys.name(src) + '!', 0);
                },

                /* -- Owner Commands: Announcement */
                getannouncement: function () {
                    botEscapeMessage(src, "The raw announcement is: " + sys.getAnnouncement());
                },

                changeannouncement: function () {
                    if (commandData === "") {
                        commandData = "<";
                    }
                    sys.changeAnnouncement(commandData);
                },

                testannouncement: function () {
                    sys.setAnnouncement(commandData, src);
                },

                /* -- Owner Commands: Updating */
                updatetiers: function () {
                    var URL = "http://pokemon-online.eu/tiers.xml";
                    if (/http[s]\:\/\//.test(commandData)) {
                        URL = commandData;
                    }
                    sys.webCall(URL, function synctiers(resp) {
                        if (resp === "") {
                            botMessage(src, "Error: No Content on page or not existing.", chan);
                            return;
                        }
                        if (sys.getFileContent('tiers.xml') === resp) {
                            botMessage(src, 'Seems like the tiers are the same as that websites tiers.', chan);
                            return;
                        }
                        sys.writeToFile('tiers.xml', resp);
                        sys.reloadTiers();
                        botAll('Tiers have been changed to <a href="' + URL + '">' + URL + '</a> by ' + sys.name(src) + '!', 0);
                    });
                },

                /* -- Owner Commands: Server Status */
                public: function () {
                    if (!sys.isServerPrivate()) {
                        botMessage(src, "The Server is already public.", chan);
                        return;
                    }

                    sys.makeServerPublic(true);

                    var conf = sys.getFileContent("config");
                    conf.replace(/Private=1/, "Private=0");
                    sys.writeToFile("config", conf);

                    botAll("The server has been made public by " + sys.name(src) + "!", 0);
                },

                private: function () {
                    if (sys.isServerPrivate()) {
                        botMessage(src, "The Server is already private.", chan);
                        return;
                    }
                    var conf = sys.getFileContent("config");
                    conf.replace(/Private=0/, "Private=1");
                    sys.writeToFile("config", conf);

                    sys.makeServerPublic(false);

                    botAll("The server has been made private by " + sys.name(src) + "!", 0);
                },

                /* -- Owner Commands: Password */
                clearpass: function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That person doesn't exist.", chan);
                        return;
                    }
                    if (!sys.dbRegistered(commandData)) {
                        botMessage(src, "That person isn't registered.", chan);
                        return;
                    }

                    sendAuth(commandData + "'s password was cleared by " + sys.name(src) + ".");
                    sys.clearPass(commandData);
                    botMessage(src, "You cleared " + commandData + "'s password.", chan);

                    if (tar != undefined) {
                        sys.sendNetworkCommand(tar, 14);
                        botMessage(tar, "<ping/>Your password has been cleared by " + html_escape(sys.name(src)) + ".");
                    }
                },

                /* -- Owner Commands: Script */
                reloadscript: function () {
                    var LoadScript = sys.getFileContent("scripts.js");
                    try {
                        sys.changeScript(LoadScript);
                        script.beforeChatMessage(src, "Hooray! New scripts :D", chan);
                    }
                    catch (e) {
                        botMessage(src, FormatError("Error occured.", e), chan);
                        return;
                    }
                },

                /* -- Owner Commands: Rangeban */
                rangeban: function () {
                    var ip = mcmd[0].split('.').join("");
                    if (isNaN(ip) || ip === undefined || ip === "") {
                        botMessage(src, "Invalid IP.", chan);
                        return;
                    }

                    var isValidIP = function (ipz, codeat) {
                        var i = ipz.split('.');
                        if ((i[codeat] < 0 || i[codeat] > 255) && i !== undefined) {
                            return false;
                        }

                        for (var z = 0; z < 3; z++) {
                            if (i[z] != undefined) {
                                if (i[z].length > 3) {
                                    return false;
                                }
                            }
                        }

                        if (i[3] != undefined) {
                            return false;
                        }
                        return true;
                    }

                    var c = mcmd[0];
                    if (!isValidIP(c, 0) || !isValidIP(c, 1) || !isValidIP(c, 2)) {
                        botMessage(src, "Invalid IP.", chan);
                        return;
                    }

                    Prune.rangeBans();

                    if (DataHash.rangebans[mcmd[0]] != undefined) {
                        botMessage(src, "Can't ban an already banned IP.", chan);
                        return;
                    }

                    var time = 0,
                        timestr, timeUnitTime = stringToTime(mcmd[2], mcmd[1] * 1);

                    if (!isNaN(timeUnitTime)) {
                        time = sys.time() * 1 + timeUnitTime;
                    }
                    if (time === 0) {
                        timestr = 'forever';
                    }
                    else {
                        timestr = "for " + getTimeString(mcmd[1] * 1 + timeUnitTime);
                    }

                    var re = "None given";
                    if (!isEmpty(mcmd[1])) {
                        re = mcmd[3];
                    }

                    DataHash.rangebans[mcmd[0]] = {
                        by: sys.name(src),
                        why: re,
                        ip: mcmd[0],
                        "time": time
                    };

                    botEscapeAll(sys.name(src) + " banned IP range " + mcmd[0] + " " + timestr + "!", 0);
                    if (re != "None given") {
                        botAll("Reason: " + re, 0);
                    }

                    var l = mcmd[0].length,
                        p = sys.playerIds(),
                        q;

                    for (q in p) {
                        var b = p[q];
                        if (sys.ip(b).substring(0, l) === mcmd[0]) {
                            sys.kick(b);
                        }
                    }

                    cache.write("rangebans", JSON.stringify(DataHash.rangebans));
                },

                rangeunban: function () {
                    Prune.rangeBans();

                    if (DataHash.rangebans.hasOwnProperty(commandData)) {
                        botMessage(src, "Removed rangeban for " + commandData + ".", chan);

                        delete DataHash.rangebans[commandData];
                        cache.write("rangebans", JSON.stringify(DataHash.rangebans));
                        return;
                    }

                    botEscapeMessage(src, "Couldn't find range IP " + commandData + " in the range banlist.", chan);
                },

                /* -- Owner Commands: Eval */
                eval: function () {
                    var isEOp = DataHash.evalops[sys.name(src).toLowerCase()] != undefined;
                    if (evallock && !host && !isEOp) {
                        botMessage(src, 'Eval has been blocked by the host!', chan);
                        return;
                    }
                    var srcname = sys.name(src),
                        code = commandData;
                    sys.sendHtmlAll(BORDER, scriptchannel);
                    botAll(srcname + " evaluated the following code:", scriptchannel);
                    sys.sendHtmlAll("<code>" + html_escape(code) + "</code>", scriptchannel);
                    sys.sendHtmlAll(BORDER, scriptchannel);

                    try {

                        var now = millitime(),
                            result = eval(code),
                            end = millitime();

                        botEscapeAll(result, scriptchannel);

                        var took = end - now,
                            sec = took / 1000,
                            micro = took * 1000;
                        botAll("Code took " + took + " milliseconds / " + sec + " seconds to run. ", scriptchannel);
                    }
                    catch (err) {
                        var err = FormatError("", err);
                        botAll(err, scriptchannel);
                    }

                },

                /* -- Owner Commands: Stats */
                resetcommandstats: function () {
                    var command_stats = CommandStats;
                    command_stats.stats.startTime = sys.time() * 1;
                    command_stats.save();

                    botAll("Command stats were reset by " + sys.name(src) + "!", 0);
                },

                /* -- Owner Commands: Names */
                changeauthname: function () {
                    if (isEmpty(mcmd[0]) || isEmpty(mcmd[1]) || isEmpty(mcmd[2])) {
                        botMessage(src, "Unknown Arguments.", chan);
                        return;
                    }
                    mcmd[2] = cut(mcmd, 2, ':');
                    var d = removespaces(mcmd[2]).toLowerCase()
                    var inObj = function (variable, obj) {
                        return variable in obj;
                    }

                    if (inObj(d, userCommands) || inObj(d, channelCommands) || inObj(d, tourCommands) || inObj(d, modCommands) || inObj(d, adminCommands) || inObj(d, ownerCommands) || inObj(d, founderCommands)) {
                        botMessage(src, "That name already exists in a command!", chan);
                        return;
                    }

                    var y = removespaces(mcmd[2]).toLowerCase();
                    if (/\W/.test(y)) {
                        botMessage(src, "You can only use letters A-z, numbers 0-9, spaces, and _.", chan);
                        return;
                    }

                    if (mcmd[0].toLowerCase() != "ctour" && mcmd[0].toLowerCase() != "tournament" && mcmd[0].toLowerCase() != "channel" && mcmd[0].toLowerCase() != "server") {
                        botMessage(src, "Currently, you can only pick ctour, channel, tournament, or server as auth type.", chan);
                        return;
                    }

                    if (mcmd[0].toLowerCase() === "ctour") {
                        if (mcmd[1] != "1" && mcmd[1] != "0") {
                            botMessage(src, "Choose auth number 0 or 1 for authtype ctour", chan);
                            return;
                        }
                        sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type CTour's auth level " + mcmd[1] + " name has been changed to " + mcmd[2] + " by " + sys.name(src) + "!</b></font>", 0);
                        if (mcmd[1] === "0") {
                            ChanTour0 = mcmd[2];
                        }
                        else if (mcmd[1] === "1") {
                            ChanTour1 = mcmd[2];
                        }
                        cache.write("ChanTour" + mcmd[1] + "Name", mcmd[2]);
                        return;
                    }

                    if (mcmd[0].toLowerCase() === "tournament") {
                        if (mcmd[1] != "1" && mcmd[1] != "0") {
                            botMessage(src, "Choose select auth number 0 or 1 for authtype tournament", chan);
                            return;
                        }
                        sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type Tournament's auth level " + mcmd[1] + " name has been changed to " + mcmd[2] + " by " + sys.name(src) + "!</b></font>", 0);
                        if (mcmd[1] === "0") {
                            Tour0 = mcmd[2];
                        }
                        else if (mcmd[1] === "1") {
                            Tour1 = mcmd[2];
                        }
                        cache.write("TourLevel" + mcmd[1] + "Name", mcmd[2]);
                        return;
                    }

                    if (mcmd[0].toLowerCase() === "server") {
                        if (mcmd[1] != "1" && mcmd[1] != "0" && mcmd[1] != "2" && mcmd[1] != "3" && mcmd[1] != "4") {
                            botMessage(src, "Choose auth number 0, 1, 2, 3 or 4 for authtype server", chan);
                            return;
                        }
                        sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type Server's auth level " + mcmd[1] + " name has been changed to " + mcmd[2] + " by " + sys.name(src) + "!</b></font>", 0);
                        if (mcmd[1] === "0") {
                            UserName = mcmd[2];
                        }
                        else if (mcmd[1] === "1") {
                            ModName = mcmd[2];
                        }
                        else if (mcmd[1] === "2") {
                            AdminName = mcmd[2];
                        }
                        else if (mcmd[1] === "3") {
                            OwnerName = mcmd[2];
                        }
                        else if (mcmd[1] === "4") {
                            InvisName = mcmd[2];
                        }
                        cache.write("AuthLevel" + mcmd[1] + "Name", mcmd[2]);
                        return;
                    }

                    if (mcmd[0].toLowerCase() === "channel") {
                        if (mcmd[1] != "1" && mcmd[1] != "0" && mcmd[1] != "2" && mcmd[1] != "3") {
                            botMessage(src, "Choose auth number 0, 1, 2 or 3 for authtype channel", chan);
                            return;
                        }
                        sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type Channel's auth level " + mcmd[1] + " name has been changed to " + mcmd[2] + " by " + sys.name(src) + "!</b></font>", 0);
                        if (mcmd[1] === "0") {
                            ChanUser = mcmd[2];
                        }
                        else if (mcmd[1] === "1") {
                            ChanMod = mcmd[2];
                        }
                        else if (mcmd[1] === "2") {
                            ChanAdmin = mcmd[2];
                        }
                        else if (mcmd[1] === "3") {
                            ChanOwner = mcmd[2];
                        }
                        cache.write("ChanLevel" + mcmd[1] + "Name", mcmd[2]);
                    }
                },

                /* -- Owner Commands: Automatic Disabling -- */
                autokick: function () {
                    if (cmdData != "on" && cmdData != "off") {
                        botMessage(src, "Use 'on' or 'off'.", chan);
                        return;
                    }

                    if (!AutoKick && cmdData == "on") {
                        AutoKick = true;
                    }
                    else if (AutoKick && cmdData == "off") {
                        AutoKick = false;
                    }
                    else {
                        botMessage(src, "Auto Kick is already " + cmdData + ".", chan);
                        return;
                    }

                    cache.write("AutoKick", AutoKick);
                    botAll("Auto Kick was turned " + cmdData + " by " + sys.name(src) + "!", 0);
                },

                automute: function () {
                    if (cmdData != "on" && cmdData != "off") {
                        botMessage(src, "Use 'on' or 'off'.", chan);
                        return;
                    }

                    if (!AutoMute && cmdData == "on") {
                        AutoMute = true;
                    }
                    else if (AutoMute && cmdData == "off") {
                        AutoMute = false;
                    }
                    else {
                        botMessage(src, "Auto Mute is already " + cmdData + ".", chan);
                        return;
                    }

                    cache.write("AutoMute", AutoMute);
                    botAll("Auto Mute was turned " + cmdData + " by " + sys.name(src) + "!", 0);
                },

                /* -- Owner Commands: Channels -- */
                allowchannels: function () {
                    if (cmdData != "on" && cmdData != "off") {
                        botMessage(src, "Use 'on' or 'off'.", chan);
                        return;
                    }

                    if (!ChannelsAllowed && cmdData == "on") {
                        ChannelsAllowed = true;
                    }
                    else if (ChannelsAllowed && cmdData == "off") {
                        ChannelsAllowed = false;
                    }
                    else {
                        botMessage(src, "Channels are already " + cmdData + ".", chan);
                        return;
                    }

                    cache.write("ChannelsAllowed", ChannelsAllowed);
                    botAll("Channels were turned " + cmdData + " by " + sys.name(src) + "!", 0);
                },

                /* -- Owner Commands: Player -- */
                deleteplayer: function () {
                    if (dbIp === undefined) {
                        botMessage(src, "That player doesn't exist", chan);
                        return;
                    }
                    var name = commandData.name();
                    botEscapeAll(name + " was deleted from the members database by " + sys.name(src) + "!", 0);
                    sys.dbDelete(name);
                    if (tar != undefined) {
                        sys.kick(tar);
                    }
                },

                /* -- Owner Commands: Export */
                exportmembers: function () {
                    sys.exportMemberDatabase();
                    botEscapeAll("The Members have been exported by " + sys.name(src) + "!", 0);
                },

                exporttiers: function () {
                    sys.exportTierDatabase();
                    botEscapeAll("The Tiers have been exported by " + sys.name(src) + "!", 0);
                },

                /* -- Owner Commands: Silence */
                megasilence: function () {
                    if (silence.level) {
                        botMessage(src, "The chat is already silenced.", chan);
                        return;
                    }

                    var time = commandData * 60,
                        timeStr = "!";
                    if (!isNaN(time) && commandData !== "") {
                        timeStr = " for " + getTimeString(time) + "!";
                    }

                    silence = {
                        "by": sys.name(src),
                        "level": 3
                    };

                    botAll(sys.name(src) + " mega-silenced the chat" + timeStr);

                    if (timeStr === "!") {
                        return;
                    }

                    timeOut = function () {
                        if (!silence.level) {
                            return;
                        }

                        silence = {
                            "by": "",
                            "level": 0
                        };
                        botAll("Silence is over.");
                    }

                    sys.delayedCall(timeOut, time);

                },

                /* -- Owner Commands: DB Display -- */
                dbplayers: function () {
                    // Format DB into multiple packages.
                    var Strings = {
                        1: ""
                    },
                        x, d = sys.dbAll(),
                        c = 0,
                        cstr = "",
                        o;
                    for (x in d) {
                        if (c > 250) {
                            o = objLength(Strings)++;
                            Strings[o - 1] = cstr;
                            Strings[o] = "";
                            cstr = Strings[o];
                            c = 0;
                        }

                        cstr += d[x].name() + ", ";
                        c++;
                    }

                    Strings[objLength(Strings)] = cstr;

                    botMessage(src, "The following players are in the members database:", chan);
                    for (x in Strings) {
                        botMessage(src, Strings[x]);
                    }
                },

                /* -- Owner Commands: Ladder -- */
                resetladder: function () {
                    var tiers = sys.getTierList(),
                        get = false,
                        y, name;
                    for (y in tiers) {
                        if (tiers[y].toLowerCase() === commandData.toLowerCase()) {
                            get = true;
                            name = tiers[y];
                            break;
                        }
                    }

                    if (!get) {
                        botEscapeMessage(src, "The tier " + commandData + " doesn't exist", chan);
                        return;
                    }

                    botAll("The ladder of the tier " + name + " has been reset by " + sys.name(src) + "!", 0);
                    sys.resetLadder(name);
                },

                resetladders: function () {
                    var tiers = sys.getTierList();
                    for (y in tiers) {
                        sys.resetLadder(tiers[y]);
                    }
                    botAll("Every ladder has been reset by " + sys.name(src) + "!", 0);
                },

                /* -- Owner Commands: Pointers */
                pointercommand: function () {
                    if (isEmpty(mcmd[0]) || isEmpty(mcmd[1])) {
                        botMessage(src, "Specify a command.", chan);
                        return;
                    }

                    mcmd[1] = cut(mcmd, 1, ':');

                    var pointer = mcmd[0].toLowerCase(),
                        command = mcmd[1].toLowerCase(),
                        rmPoint = removespaces(pointer),
                        rmCmd = removespaces(command);

                    if (rmPoint == "!!/reverse/!!" || hasCommandStart(rmPoint)) {
                        botMessage(src, "This pointer is reserved.");
                        return;
                    }

                    var inObj = function (variable, obj) {
                        return variable in obj;
                    }

                    if (inObj(rmPoint, userCommands) || inObj(rmPoint, channelCommands) || inObj(rmPoint, tourCommands) || inObj(rmPoint, modCommands) || inObj(rmPoint, adminCommands) || inObj(rmPoint, ownerCommands) || inObj(rmPoint, founderCommands)) {
                        botMessage(src, "That pointer is already defined as a normal command.", chan);
                        return;
                    }
                    if (!inObj(rmCmd, userCommands) && !inObj(rmCmd, channelCommands) && !inObj(rmCmd, tourCommands) && !inObj(rmCmd, modCommands) && !inObj(rmCmd, adminCommands) && !inObj(rmCmd, ownerCommands) && !inObj(rmCmd, founderCommands)) {
                        botMessage(src, "That command doesn't exist!", chan);
                        return;
                    }
                    if (/\W/.test(rmPoint)) {
                        botMessage(src, "You can only use letters A-z, numbers 0-9, and _.", chan);
                        return;
                    }
                    if (rmPoint in PointerCommands && PointerCommands[rmPoint] === rmCmd) {
                        botMessage(src, "Pointer is already defined with that command!", chan);
                        return;
                    }

                    var re = ['defined', 'as'];
                    if (rmPoint in PointerCommands) {
                        re = ['redefined', 'differently as'];
                    }

                    PointerCommands[rmPoint] = rmCmd;
                    var points = PointerCommands["!!/Reverse/!!"];
                    if (!points.hasOwnProperty(rmPoint)) {
                        points[rmPoint] = {};
                    }
                    points[rmPoint][rmCmd] = '';

                    botAll(sys.name(src) + " " + re[0] + " Pointer Command " + pointer + " " + re[1] + " " + command + "!", 0);
                    cache.write("pointercommands", JSON.stringify(PointerCommands));
                },

                delpointercommand: function () {
                    var d = removespaces(cmdData);
                    if (d === "") {
                        botMessage(src, "Specify a Pointer Command.", chan);
                        return;
                    }
                    if (d == "!!/Reverse/!!") {
                        botMessage(src, "This pointer cannot be deleted.");
                        return;
                    }
                    if (!d in PointerCommands) {
                        botMessage(src, "Pointer doesn't exist!", chan);
                        return;
                    }
                    delete PointerCommands[d];
                    delete PointerCommands["!!/Reverse/!!"][d];

                    botAll(sys.name(src) + " removed the Pointer Command " + d + "!", 0);
                    cache.write("pointercommands", JSON.stringify(PointerCommands));
                },

                /* -- Owner Commands: Ban */
                banfrom: function () {
                    if (mcmd[0] === undefined || mcmd[1] === undefined || mcmd[2] === undefined) {
                        botMessage(src, "Invalid parameters.", chan);
                        return;
                    }

                    var tiers = sys.getTierList(),
                        get = false,
                        y, name;
                    for (y in tiers) {
                        if (tiers[y].toLowerCase() === mcmd[0].toLowerCase()) {
                            get = true;
                            name = tiers[y].toLowerCase();
                            break;
                        }
                    }

                    if (!get) {
                        botEscapeMessage(src, "The tier " + mcmd[0] + " doesn't exist!", chan);
                        return;
                    }

                    var num = sys.pokeNum(mcmd[1]);
                    if (num === undefined) {
                        botEscapeMessage(src, "The pokemon " + mcmd[1] + " doesn't exist!", chan);
                        return;
                    }

                    var abilityarr = [];

                    for (var y = 0; y < 5; y++) {
                        abilityarr.push(sys.ability(sys.pokeAbility(num, y, 5)).toLowerCase());
                    }

                    if (abilityarr.indexOf(mcmd[2].toLowerCase()) === -1) {
                        botEscapeMessage(src, "The ability " + mcmd[2] + " for pokemon " + mcmd[1] + " doesn't exist!", chan);
                        return;
                    }
                    var bans = DataHash.bannedAbilities;
                    if (bans[name] === undefined) {
                        bans[name] = {};
                    }

                    var pN = sys.pokemon(num).toLowerCase();
                    if (bans[name][pN] === undefined) {
                        bans[name][pN] = [];
                    }

                    if (bans[name][pN].indexOf(mcmd[2].toLowerCase()) != -1) {
                        botMessage(src, "The ability " + mcmd[2] + " is already banned on " + mcmd[1] + " in tier " + mcmd[0], chan);
                        return;
                    }

                    bans[name][pN].push(mcmd[2].toLowerCase());

                    botAll(sys.name(src) + " has banned the ability " + mcmd[2] + " on " + mcmd[1] + " in tier " + mcmd[0] + "!", 0);
                    cache.write("bannedAbilities", JSON.stringify(DataHash.bannedAbilities));
                },
                unbanfrom: function () {
                    if (mcmd[0] === undefined || mcmd[1] === undefined || mcmd[2] === undefined) {
                        botMessage(src, "Invalid parameters.", chan);
                        return;
                    }

                    var tiers = sys.getTierList(),
                        get = false,
                        y, name, tier = mcmd[0];
                    for (y in tiers) {
                        if (tiers[y].toLowerCase() === tier.toLowerCase()) {
                            get = true;
                            name = tier.toLowerCase();
                            tier = tiers[y];
                            break;
                        }
                    }

                    if (!get) {
                        botEscapeMessage(src, "The tier " + mcmd[0] + " doesn't exist!", chan);
                        return;
                    }

                    var num = sys.pokeNum(mcmd[1]);
                    if (num === undefined) {
                        botEscapeMessage(src, "The pokemon " + mcmd[1] + " doesn't exist!", chan);
                        return;
                    }

                    var abilityarr = [];

                    for (var y = 0; y < 5; y++) {
                        abilityarr.push(sys.ability(sys.pokeAbility(num, y, 5)).toLowerCase());
                    }

                    if (abilityarr.indexOf(mcmd[2].toLowerCase()) === -1) {
                        botEscapeMessage(src, "The ability " + mcmd[2] + " for pokemon " + mcmd[1] + " doesn't exist!", chan);
                        return;
                    }
                    var bans = DataHash.bannedAbilities;
                    if (typeof bans[name] === 'undefined') {
                        botMessage(src, tier + " doesn't have any ability bans.", chan);
                        return;
                    }

                    var pN = sys.pokemon(num).toLowerCase();
                    if (typeof bans[name][pN] === 'undefined') {
                        botMessage(src, sys.pokemon(num) + " doesn't have any ability bans in " + tier, chan);
                        return;
                    }

                    if (bans[name][pN].indexOf(mcmd[2].toLowerCase()) === -1) {
                        botMessage(src, "The ability " + mcmd[2] + " isn't banned on " + mcmd[1] + " in tier " + mcmd[0], chan);
                        return;
                    }

                    if (bans[name][pN].length === 1) {
                        delete bans[name][pN];
                    }
                    else {
                        bans[name][pN].splice(mcmd[2].toLowerCase(), 1);
                    }

                    botAll(sys.name(src) + " has unbanned the ability " + mcmd[2] + " on " + mcmd[1] + " in tier " + mcmd[0] + "!", 0);
                    cache.write("bannedAbilities", JSON.stringify(DataHash.bannedAbilities));
                }
            });

            founderCommands = ({
                evallock: function () {
                    if (evallock) {
                        botMessage(src, "Eval is already disabled!", chan);
                        return;
                    }
                    evallock = true;
                    cache.write("evallock", true);
                    botEscapeAll(sys.name(src) + " has locked eval.", scriptchannel);
                },

                evalunlock: function () {
                    if (!evallock) {
                        botMessage(src, "Eval is already enabled!", chan);
                        return;
                    }
                    evallock = false;
                    cache.write("evallock", false);
                    botEscapeAll(sys.name(src) + " has unlocked eval.", scriptchannel);
                },

                evalop: function () {
                    var m = mcmd[0].toLowerCase();
                    if (dbIp == undefined) {
                        botMessage(src, "That player doesn't exist!", chan);
                        return;
                    }
                    var d = DataHash.evalops;
                    if (d.hasOwnProperty(m)) {
                        botMessage(src, "This player already is Eval Operator.", chan);
                        return;
                    }
                    if (!sys.dbRegistered(commandData)) {
                        botMessage(src, "This player is not registered.", chan);
                        if (tar != undefined) {
                            botMessage(tar, "Please register for auth.");
                        }
                        return;
                    }

                    DataHash.evalops[m] = {
                        'by': sys.name(src)
                    };

                    cache.write("evalops", JSON.stringify(DataHash.evalops));

                    putInAuthChan(m, "evalop");
                    botAll(sys.name(src) + " made " + m.name() + " Eval Operator!", scriptchannel);
                },

                evaluser: function () {
                    var m = mcmd[0].toLowerCase();
                    if (dbIp == undefined) {
                        botMessage(src, "That player doesn't exist!", chan);
                        return;
                    }
                    var d = DataHash.evalops;
                    if (!d.hasOwnProperty(m)) {
                        botMessage(src, "This player isn't an Eval Operator.", chan);
                        return;
                    }

                    botAll(sys.name(src) + " made " + m.name() + " Eval User!", scriptchannel);

                    delete DataHash.evalops[m];
                    if (tar != undefined) {
                        sys.kick(tar, scriptchannel);
                    }

                    cache.write("evalops", JSON.stringify(DataHash.evalops));
                },

            });

            /* -- Owner Commands: Owner Commands Template */
            ownerCommands[removespaces(OwnerName).toLowerCase() + "commands"] = function () {
                var ct = new Command_Templater(OwnerName + " Commands");

                ct.register("chatcommands", "Displays Chat Commands.");
                ct.register("dbcommands", "Displays Database Commands.");
                ct.register("anncommands", "Displays Announcement Commands.");
                ct.register("jsessioncommands", "Displays JSESSION Commands.");
                ct.register("servercommands", "Displays Server Commands.");
                ct.register("tiercommands", "Displays Tier Commands.");
                ct.register("eval", ["{p Code}"], "Evaluates a QtScript code and returns the result.");
                ct.register("randomspam", ["{o Number}"], "Spams the chat with random messages.");
                ct.register("resetcommandstats", "Resets command stats.");
                ct.register("recreate", ["{p <u>Type</u>}"], "Resets JSESSION data and refills. Types can be: Channels, Global, Tours, Users, All. Default is All.");
                ct.register(style.footer);
                ct.render(src, chan);
            }

            /* -- Owner Commands: Authing */
            ownerCommands[removespaces(AdminName).toLowerCase()] = function () {
                if (dbIp === undefined) {
                    botMessage(src, "That player doesn't exist.", chan);
                    return;
                }
                if (dbAuth === 2) {
                    botMessage(src, "That player already is " + AdminName + "!", chan);
                    return;
                }

                if (!sys.dbRegistered(commandData)) {
                    botMessage(src, "This player is not registered.", chan);
                    if (tar != undefined) {
                        botMessage(tar, "Please register for auth.");
                    }
                    return;
                }

                if (DataHash.tempauth[cmdData] != undefined) {
                    delete DataHash.tempauth[cmdData];
                    cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                }

                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + AdminName + " by " + sys.name(src) + ".", 0);
                    sys.changeAuth(tar, 2);
                    return;
                }
                botEscapeAll(commandData + " has been made " + AdminName + " by " + sys.name(src) + ".", chan);
                sys.changeDbAuth(commandData, 2);
                putInAuthChan(commandData, "admin");
            }

            ownerCommands[removespaces(OwnerName).toLowerCase()] = function () {
                if (dbIp === undefined) {
                    botMessage(src, "That player doesn't exist.", chan);
                    return;
                }
                if (dbAuth === 3) {
                    botMessage(src, "That player already is " + OwnerName + "!", chan);
                    return;
                }

                if (!sys.dbRegistered(commandData)) {
                    botMessage(src, "This player is not registered.", chan);
                    if (tar != undefined) {
                        botMessage(tar, "Please register for auth.");
                    }
                    return;
                }

                if (DataHash.tempauth[cmdData] != undefined) {
                    delete DataHash.tempauth[cmdData];
                    cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                }

                if (tar != undefined) {
                    botEscapeAll(sys.name(tar) + " has been made " + OwnerName + " by " + sys.name(src) + ".", 0);
                    sys.changeAuth(tar, 3);
                    return;
                }
                botEscapeAll(commandData + " has been made " + OwnerName + " by " + sys.name(src) + ".", 0);
                sys.changeDbAuth(commandData, 3);
                putInAuthChan(commandData, "admin");
            }

            ownerCommands[removespaces(InvisName).toLowerCase()] = function () {
                if (sys.dbIp(commandData) === undefined) {
                    botMessage(src, "That player doesn't exist.", chan);
                    return;
                }
                if (dbAuth >= 4) {
                    botMessage(src, "That player already is " + InvisName + "!", chan);
                    return;
                }

                if (!sys.dbRegistered(commandData)) {
                    botMessage(src, "This player is not registered.", chan);
                    if (tar != undefined) {
                        botMessage(tar, "Please register for auth.");
                    }
                    return;
                }

                if (DataHash.tempauth[cmdData] != undefined) {
                    delete DataHash.tempauth[cmdData];
                    cache.write("tempauth", JSON.stringify(DataHash.tempauth));
                }
                var users = sys.playerIds(),
                    y, sendArr3 = [],
                    sendArr0 = [],
                    X;

                for (y in users) {
                    if (sys.auth(users[y]) > 2) {
                        sendArr3.push(users[y]);
                    }
                    else {
                        sendArr0.push(users[y]);
                    }
                }

                var m_name = sys.name(src),
                    t_name = commandData.name();
                if (tar != undefined) {
                    for (x in sendArr3) {
                        botMessage(sendArr3[x], t_name + " has been made " + InvisName + " by " + m_name + ".", 0);
                    }
                    for (x in sendArr0) {
                        botMessage(sendArr0[x], t_name + " has been made " + UserName + " by " + m_name + ".", 0);
                    }
                    sys.changeAuth(tar, 127);
                    putInAuthChan(commandData, "admin");
                    return;
                }

                for (x in sendArr3) {
                    botMessage(sendArr3[x], t_name + " has been made " + InvisName + " by " + m_name + ".", 0);
                }
                for (x in sendArr0) {
                    botMessage(sendArr0[x], t_name + " has been made " + UserName + " by " + m_name + ".", 0);
                }

                sys.changeDbAuth(commandData, 127);
            }

            var getCommand = ({
                '0': function (name) {
                    if (name in tourCommands && poChan.toursEnabled) {
                        return tourCommands[name];
                    }
                    else if (name in channelCommands) {
                        return channelCommands[name];
                    }
                    else if (name in userCommands) {
                        return userCommands[name];
                    }
                },
                '1': function (name) {
                    if (name in modCommands) {
                        return modCommands[name];
                    }
                    else if (name in tourCommands && poChan.toursEnabled) {
                        return tourCommands[name];
                    }
                    else if (name in channelCommands) {
                        return channelCommands[name];
                    }
                    else if (name in userCommands) {
                        return userCommands[name];
                    }
                },
                '2': function (name) {
                    if (name in adminCommands) {
                        return adminCommands[name];
                    }
                    else if (name in modCommands) {
                        return modCommands[name];
                    }
                    else if (name in tourCommands && poChan.toursEnabled) {
                        return tourCommands[name];
                    }
                    else if (name in channelCommands) {
                        return channelCommands[name];
                    }
                    else if (name in userCommands) {
                        return userCommands[name];
                    }
                },
                '3': function (name) {
                    if (name in founderCommands && host) {
                        return founderCommands[name];
                    }
                    else if (name in ownerCommands) {
                        return ownerCommands[name];
                    }
                    else if (name in adminCommands) {
                        return adminCommands[name];
                    }
                    else if (name in modCommands) {
                        return modCommands[name];
                    }
                    else if (name in tourCommands && poChan.toursEnabled) {
                        return tourCommands[name];
                    }
                    else if (name in channelCommands) {
                        return channelCommands[name];
                    }
                    else if (name in userCommands) {
                        return userCommands[name];
                    }
                }
            });
            var op = sys.auth(src),
                ch = Config.HighPermission;

            if (op > 3) {
                op = 3;
            }

            if (op < 0) {
                op = 0;
            }

            if (ch[sys.name(src)] !== undefined && ch[sys.name(src)][0] === sys.auth(src)) {
                op = ch[sys.name(src)][1];
            }

            if (command == "eval" && DataHash.evalops[sys.name(src).toLowerCase()] != undefined) {
                op = 3;
            }

            var cmd = getCommand[op](command);
            if (!cmd) {
                if (!getCommand[3](command)) {
                    invalidCommandMessage(src, fullCommand, chan);
                }
                else {
                    noPermissionMessage(src, fullCommand, chan);
                }
                return;
            }
            cmd();

            if (command != "spam") {
                CommandStats.write(fullCommand.toLowerCase(), sys.name(src));
            }
            return;
        }

        WatchPlayer(src, "Message", message, chan);

        if (testMafiaChat(src, chan)) {
            sys.stopEvent();
            return;
        }

        if (poUser.capsMute(message, chan)) {
            sys.stopEvent();
            return;
        }

        sys.stopEvent();

        var nc = script.namecolor(src),
            sendHtml = sys.sendHtmlAll,
            send = sys.sendAll;

        if (chatcolor) {
            namestr += "</font></span>";
        }

        if (unicodeAbuse(src, message)) {
            if (!sys.loggedIn(src)) {
                poUser.floodCount = 'kicked';
                return;
            }

            sendHtml = sys.sendHtmlMessage, send = sys.sendMessage;
        }

        if (typeof poUser.impersonation != 'undefined') {
            if (myAuth <= 0 && implock) {
                delete poUser.impersonation;
                botMessage(src, "You are now yourself again!", chan);
                sys.stopEvent();
                return;
            }

            var nc = script.namecolor(src),
                font = '',
                font2 = '';

            if (chatcolor) {
                font = ' face="' + fnt + '"', font2 = '<font face="' + fnt + '">%1</font>';
            }

            if (myAuth >= 1 && myAuth <= 3) {
                var l = "+<i>",
                    f;
                if (UseIcons) {
                    l = rankico;
                }

                if (UseIcons) {
                    f = format(src, html_escape(message));
                } else {
                    f = html_escape(message);
                }

                if (chan === watch) {
                    sendHtml(src, "<font color=" + nc + " " + font + "><timestamp/>" + l + "<b>" + html_escape(poUser.impersonation) + ":</b></i></font> " + font2.format(message));
                }
                else {
                    sendHtml(src, "<font color=" + nc + " " + font + "><timestamp/>" + l + "<b>" + html_escape(poUser.impersonation) + ":</b></i></font> " + font2.format(message), chan);
                }
            }

            else {
                var l = "",
                    f;
                if (UseIcons) {
                    l = rankico;
                }

                if (UseIcons) {
                    f = format(src, html_escape(message));
                } else {
                    f = html_escape(message);
                }

                if (chan === watch) {
                    sendHtml(src, "<font color=" + nc + " " + font + "><timestamp/>" + l + "<b>" + html_escape(poUser.impersonation) + ":</b></font> " + font2.format(message));
                }
                else {
                    sendHtml(src, "<font color=" + nc + " " + font + "><timestamp/>" + l + "<b>" + html_escape(poUser.impersonation) + ":</b></font> " + font2.format(message), chan);
                }
            }


            if (chan === watch) {
                send(src, srcname + ": " + message);
                return;
            }
            else {
                send(src, srcname + ": " + message, chan);
                return;
            }
        }


        if (UseIcons || chatcolor) {
            if (chan === watch) {
                sendHtml(namestr);
                return;
            }
            else {
                sendHtml(namestr, chan);
                return;
            }
        }

        if (chan === watch) {
            send(srcname + ": " + message);
            return;
        }

/* 
        if (chan === trivia && Trivia.isGameGoingOn() && !Trivia.timeout) {
            Trivia.a(message);
            return;

        } */
        sys.sendAll(srcname + ": " + message, chan);
    },

    beforeLogOut: function (src) {
        var func = function (id, name, color, autoKicked) {
            if (typeof autoKicked !== 'number') {
                sys.sendHtmlAll("<timestamp/><b>Log Out</b> -- <font color=" + color + "><b>" + name + "</b></font>", watch);

                if (Config.WelcomeMessages) {
                    botAll("Goodbye, " + name + "!", 0);
                }
            }
        };

        sys.callQuickly("func('" + src + "', '" + sys.name(src) + "', '" + script.namecolor(src) + "', '" + typeof testNameKickedPlayer == 'number' + "');", 200);

        delete testNameKickedPlayer;

        ify.beforeLogOut(src);
        JSESSION.destroyUser(src);
    },

    afterPlayerAway: function (src, mode) {
        var m = "Now active and ready for battles.";
        if (mode) {
            m = "Now idling.";
        }

        WatchEvent(src, m);
    },

    afterChangeTeam: function (src, logging) {
        var myName = sys.name(src),
            lc = myName.toLowerCase();

        if (!logging) {
            // UPDATING DATA
            var myUser = JSESSION.users(src),
                dh = DataHash;

            myUser.name = myName;
            myUser.lowername = lc;
            myUser.megauser = dh.megausers.hasOwnProperty(lc);
            myUser.voice = dh.voices.hasOwnProperty(lc);
            myUser.icon = undefined;

            if (dh.rankicons.hasOwnProperty(lc)) {
                myIcon = dh.icons[lc];
            }


            if (typeof myUser.teamChanges == 'object') {
                myUser.teamChanges = 0;
            }

            myUser.teamChanges++;

            var teamChanges = myUser.teamChanges,
                ip = sys.ip(src);

            if (teamChanges > 2) {
                if (typeof dh.teamSpammers[ip] == "undefined") {
                    dh.teamSpammers[ip] = 0;
                    sys.callLater("if(typeof DataHash.teamSpammers['" + ip + "'] != 'undefined') DataHash.teamSpammers['" + ip + "']--; ", 60 * 3);
                }
                else if (dh.teamSpammers[ip] == 0) {
                    dh.teamSpammers[ip] = 1;
                    botAll("Alert: Possible spammer on ip " + ip + " and name " + myName + ". Kicked.", watch);
                    kick(src);
                    sys.callLater("if(typeof DataHash.teamSpammers['" + ip + "'] != 'undefined') DataHash.teamSpammers['" + ip + "']--; ", 60 * 5);
                    return;
                }
                else {
                    botAll("Spammer: ip " + ip + ", name " + myName + ". Banned.<ping/>", watch);
                    ban(myName);
                    delete dh.teamSpammers[ip];
                    return;
                }
            }

            script.resolveLocation(src, ip, false);

            sys.callLater("if(JSESSION.users(" + src + ") != undefined) JSESSION.users(" + src + ").teamChanges--;", 5);

            // Everything else //
            var getColor = script.namecolor(src),
                dhn = DataHash.names;

            WatchEvent(src, "Changed Team/Name");

            dhn[ip] = myName;
            dhn[lc] = myName;
            playerscache.write("names", JSON.stringify(dhn));

            script.hostAuth(src);

            if (script.testName(src) === true) {
                testNameKickedPlayer = src;
                kick(src);
                return;
            }
        } /* END OF LOGGING */

        var myMail = DataHash.mail[lc];
        if (myMail != undefined) {
            if (myMail.length > 0) {
                var p, count = 0;
                for (p in myMail) {
                    if (!myMail[p].read) {
                        count++;
                    }
                }

                if (count > 0) {
                    botMessage(src, "You have " + count + " new mails! Type <font color='green'><b>/readmail</b></font> to view!");
                }
            }
        }

        var team, i, j, k;
        for (team = 0; team < sys.teamCount(src); team++) {
            if (sys.gen(src, team) === 2) {
                pokes: for (i = 0; i <= 6; i++) {
                    for (j = 0; j < bannedGSCSleep.length; ++j)
                    if (sys.hasTeamPokeMove(src, team, i, bannedGSCSleep[j])) {
                        for (k = 0; k < bannedGSCTrap.length; ++k) {
                            if (sys.hasTeamPokeMove(src, team, i, bannedGSCTrap[k])) {
                                teamAlert(src, team, "SleepTrapping is banned in GSC. Pokemon " + sys.pokemon(sys.teamPoke(src, team, i)) + "  removed from your team.");
                                sys.changePokeNum(src, team, i, 0);
                                continue pokes;
                            }
                        }
                    }
                }
            }

            if (!Config.NoCrash) {
                if (!TierBans.isLegalTeam(src, team, sys.tier(src, team))) {
                    TierBans.findGoodTier(src, team);
                }
            }

        }

        if (!logging) {
            ify.afterChangeTeam(src);
        }
    },

    afterBattleEnded: function (winner, loser, result, battle_id) {
        if (result != "tie" && sys.ip(winner) != sys.ip(loser)) {
            var winMoney = sys.rand(10, 101),
                loseMoney = sys.rand(1, 101),
                winnerName = sys.name(winner).toLowerCase(),
                loserName = sys.name(loser).toLowerCase(),
                money = DataHash.money;

            if (typeof money[loserName] === "undefined") {
                botMessage(loser, "You are getting 'battle points'. Currently, you can't do anything with these, but in the future, you will!", 0);
                money[loserName] = 0;
            }
            if (typeof money[winnerName] === "undefined") {
                botMessage(winner, "You are getting 'battle points'. Currently, you can't do anything with these, but in the future, you will!", 0);
                money[winnerName] = 0;
            }

            money[winnerName] += winMoney;
            money[loserName] -= loseMoney;

            botMessage(winner, 'You won ' + winMoney + ' battle points!');
            botMessage(loser, 'You lost ' + loseMoney + ' battle points!');

            cache.write("money", JSON.stringify(DataHash.money));
        }

        var c = sys.channelIds(),
            b, c_chan;

        for (b in c) {
            c_chan = JSESSION.channels(c[b]);
            if (c_chan.toursEnabled) {
                c_chan.tour.afterBattleEnded(winner, loser, result);
            }
        }
    },

    afterBattleStarted: function (src, dest, clauses, rated, srcteam, destteam) {
        var c = sys.channelIds(),
            b, c_chan;

        for (b in c) {
            c_chan = JSESSION.channels(c[b]);
            if (c_chan.toursEnabled) {
                c_chan.tour.afterBattleStarted(src, dest, clauses, rated, srcteam, destteam);
            }
        }
    },

    beforeChallengeIssued: function (src, dest, clauses, rated, mode, team, destTier) {
        if (Config.FixChallenges) {
            return;
        }

        var poUser = JSESSION.users(src);
        if (poUser == undefined) {
            JSESSION.createUser(src);
            poUser = JSESSION.users(src);
        }

        var time = sys.time() * 1;
        if (poUser.lastChallenge + 15 - time > 0 && sys.auth(src) < 2 && poUser.lastChallenge != 0) {
            botMessage(src, "Please wait " + getTimeString(poUser.lastChallenge + 15 - time) + " before challenging.");
            sys.stopEvent();
            return;
        }

        poUser.lastChallenge = time;

        var isChallengeCup = sys.getClauses(destTier) % 32 >= 16,
            hasChallengeCupClause = (clauses % 32) >= 16;

        if (isChallengeCup && !hasChallengeCupClause) {
            botMessage(src, "Challenge Cup must be enabled in the challenge window for a CC battle");
            sys.stopEvent();
            return;
        }

        if ((clauses % 32) >= 16) {
            return;
        }

        if (!Config.NoCrash) {
            if (sys.tier(src, team).indexOf("Doubles") != -1 && destTier.indexOf("Doubles") != -1 && mode != 1) {
                botMessage(src, "To fight in doubles, enable doubles in the challenge window!");
                sys.stopEvent();
                return;
            }
            if (sys.tier(src, team).indexOf("Triples") != -1 && destTier.indexOf("Triples") != -1 && mode != 2) {
                botMessage(src, "To fight in triples, enable triples in the challenge window!");
                sys.stopEvent();
                return;
            }
        }
    },

    beforeChangeTier: function (src, team, oldtier, newtier) {
        if (!TierBans.isLegalTeam(src, team, newtier)) {
            sys.stopEvent();
            teamAlert(src, team, "You cannot go in the " + newtier + " tier. Appointing another tier for this team...");
            TierBans.findGoodTier(src, team);
        }
    },

    beforePlayerKick: function (src, tar) {
        // JSESSION.users(src).muteCheck();
        sys.stopEvent();

        var myName = sys.name(src),
            theirName = sys.name(tar);

        if (JSESSION.users(src).muted) {
            var ip = sys.ip(src),
                dhm = DataHash.mutes[ip];

            WatchEvent(src, "Attempted to kick " + theirName + " while muted.");

            var time;
            if (dhm.time != 0) {
                time = "Muted for " + getTimeString(dhm.time - sys.time() * 1);
            } else {
                time = "Muted forever";
            }

            var by = dhm.by + "</i>",
                why = dhm.why,
                lastChar = why[why.length - 1],
                lastChars = [".", "?", "!"];

            if (lastChars.indexOf(lastChar) == -1) {
                why += ".";
            }

            botMessage(src, "You are muted by " + by + ". Reason: " + why + " " + time + "!");
            return;
        }

        sys.sendHtmlAll("<font color='midnightblue'><timestamp/><b> " + myName + " kicked " + theirName + "!</b></font>");
        kick(tar);
    },

    beforePlayerBan: function (src, tar) {
        // JSESSION.users(src).muteCheck();
        sys.stopEvent();

        var myName = sys.name(src),
            theirName = sys.name(tar);

        if (JSESSION.users(src).muted) {
            var ip = sys.ip(src),
                dhm = DataHash.mutes[ip];

            WatchEvent(src, "Attempted to ban " + theirName + " while muted.");

            var time;
            if (dhm.time != 0) {
                time = "Muted for " + getTimeString(dhm.time - sys.time() * 1);
            } else {
                time = "Muted forever";
            }

            var by = dhm.by + "</i>",
                why = dhm.why,
                lastChar = why[why.length - 1],
                lastChars = [".", "?", "!"];

            if (lastChars.indexOf(lastChar) == -1) {
                why += ".";
            }

            botMessage(src, "You are muted by " + by + ". Reason: " + why + " " + time + "!");
            return;
        }


        sys.sendHtmlAll("<font color='darkorange'><timestamp/><b> " + sys.name(src) + " banned " + sys.name(tar) + "!</b></font>");
        ban(theirName);
    },

    testName: function (src, nomessage) {
        var name = sys.name(src),
            ip = sys.ip(src),
            dh = DataHash,
            auth = sys.maxAuth(ip);

        Prune.bans();
        Prune.rangeBans();

        if (auth <= 0) {
            var rb = dh.rangebans,
                i, i_l = 0,
                xT, c_rb;
            for (i in rb) {
                i_l = i.length;
                for (xT = 0; xT < i_l; xT++) {
                    if (i == sys.ip(src).substring(0, xT)) {
                        if (!nomessage) {
                            c_rb = rb[i];
                            var time;
                            if (c_rb.time != 0) {
                                time = 'Banned for ' + getTimeString(c_rb.time - sys.time() * 1);
                            } else {
                                time = "Banned forever";
                            }

                            var by = c_rb.by,
                                why = c_rb.why,
                                lastChar = why[why.length - 1],
                                lastChars = [".", "?", "!"];

                            if (lastChars.indexOf(lastChar) == -1) {
                                why += ".";
                            }

                            sendFailWhale(src, 0);
                            botMessage(src, 'Your ip range ' + i + ' is banned by ' + by + '. Reason: ' + why + ' ' + time + '.', 0);
                            botAll('Player ' + name + ' with range IP ' + i + ' has attempted to enter the server and failed. [Reason: Rangebanned]', watch);
                        }
                        return true;
                    }
                }
            }
        }

        var tb = DataHash.tempbans[ip];
        if (tb != undefined && auth < 1) {
            if (!nomessage) {
                var time;

                if (tb.time != 0) {
                    time = "for " + getTimeString(tb.time - sys.time() * 1);
                } else {
                    time = "forever";
                }

                var reason = tb.why,
                    by = tb.by,
                    lastChar = reason[reason.length - 1],
                    lastChars = [".", "?", "!"];

                if (lastChars.indexOf(lastChar) == -1) {
                    reason += ".";
                }

                sendFailWhale(src, 0);
                botMessage(src, "You are banned! By " + by + ". Reason " + why + " " + time + "!", 0);
                botAll('Player ' + name + ' (' + ip + ') has attempted to enter the server and failed. [Reason: Tempbanned]', watch);
            }
            return true;
        }

        var cyrillic = /\u0408|\u03a1|\u0430|\u0410|\u0412|\u0435|\u0415|\u041c|\u041d|\u043e|\u041e|\u0440|\u0420|\u0441|\u0421|\u0422|\u0443|\u0445|\u0425|\u0456|\u0406/,
            space = /\u0009-\u000D|\u0085|\u00A0|\u1680|\u180E|\u2000-\u200A|\u2028|\u2029|\u2029|\u202F|\u205F|\u3000/,
            dash = /\u058A|\u05BE|\u1400|\u1806|\u2010-\u2015|\u2053|\u207B|\u208B|\u2212|\u2E17|\u2E1A|\u301C|\u3030|\u30A0|\uFE31-\uFE32|\uFE58|\uFE63|\uFF0D/,
            greek = /\u03F3|\u0391|\u0392|\u0395|\u0396|\u0397|\u0399|\u039A|\u039C|\u039D|\u039F|\u03A1|\u03A4|\u03A5|\u03A7/,
            armenian = /\u0555|\u0585/,
            creek = /[\u0370-\u03ff]/,
            special = /[\ufff0-\uffff]/,
            other = /\u3061|\u65532/,
            zalgo = /[\u0300-\u036F]/,
            thai = /[\u0E00-\u0E7F]/,
            fakei = /\xA1/;

        if (fakei.test(name) || creek.test(name) || armenian.test(name) || dash.test(name) || space.test(name) || cyrillic.test(name) || greek.test(name) || special.test(name) || other.test(name) || zalgo.test(name) || thai.test(name)) {
            if (!nomessage) {
                sendFailWhale(src, 0);
                botMessage(src, "You are using bad characters in your name.");
                botAll('Player ' + name + ' (' + ip + ') has failed to log in. [Reason: Unicode characters]', watch);
            }
            return true;
        }

        if (name[0] == "S" && name[1] == "E" && name[2] == "N" && name[3] == "T" && name[4] == "_") {
            if (!nomessage) {
                sendFailWhale(src, 0);
            }
            return true;
        }

        return false;
    },

    namecolor: function (src) {
        var myColor = sys.getColor(src);
        if (myColor == '#000000') {
            var namecolorlist = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];
            return namecolorlist[src % namecolorlist.length];
        }
        return myColor;
    },


    hostAuth: function (src) {
        var auth = sys.auth(src);
        if (auth < 3 || auth > 3) {
            return;
        }

        if (!isHost(src)) {
            return;
        }

        if (!sys.dbRegistered(sys.name(src))) {
            return;
        }

        sys.changeAuth(src, 3);
    },

    issueMute: function (src, target, reason, time, c, timeunit) {
        var time = parseInt(time),
            theIP = sys.dbIp(target),
            srcauth = sys.auth(src),
            srcname = sys.name(src),
            tarid = sys.id(target),
            now_time = sys.time() * 1,
            timeUnitTime = stringToTime(timeunit, time);

        if (theIP == undefined) {
            botMessage(src, "Unknown target!", c);
            return;
        }
        if (sys.maxAuth(theIP) >= srcauth && !isHost(src)) {
            botMessage(src, "You don't have sufficient auth to mute " + target + ".", c);
            return;
        }

        Prune.mutes();
        var oldtime = 0;
        if (DataHash.mutes.hasOwnProperty(theIP)) {
            oldtime = DataHash.mutes[theIP].time - now_time;
        }

        if (time == undefined || timeunit == undefined || isNaN(timeUnitTime) || timeUnitTime == "forever") {
            botEscapeAll(target + " was muted by " + srcname + " forever!", 0);

            if (!isEmpty(reason)) {
                botEscapeAll("Reason: " + reason, 0);
            }

            var all = idsOfIP(theIP),
                z;
            for (z in all) {
                JSESSION.users(all[z]).muted = true;
            }

            var re = "None given";

            if (!isEmpty(reason)) {
                re = reason;
            }

            DataHash.mutes[theIP] = {
                by: sys.name(src),
                why: re,
                ip: theIP,
                time: 0
            };
            return;
        }

        var timestr = getTimeString(timeUnitTime + oldtime),
            thetime = now_time + timeUnitTime + oldtime;

        botEscapeAll(target + " was muted by " + srcname + " for " + timestr + "!", 0);


        if (!isEmpty(reason)) {
            botEscapeAll("Reason: " + reason, 0);
        }

        var all = idsOfIP(theIP),
            z;
        for (z in all) {
            JSESSION.users(all[z]).muted = true;
        }

        var re = "None given";

        if (!isEmpty(reason)) {
            re = reason;
        }

        DataHash.mutes[theIP] = {
            by: sys.name(src),
            why: re,
            ip: theIP,
            time: thetime
        };
        cache.write("mutes", JSON.stringify(DataHash.mutes));
    },

    removeMute: function (src, target, reason, c) {
        var theIP = sys.dbIp(target),
            srcauth = sys.auth(src),
            srcname = sys.name(src);

        if (theIP == undefined) {
            botMessage(src, "This person doesn't exist.", c);
            return;
        }

        Prune.mutes();

        if (!DataHash.mutes.hasOwnProperty(theIP)) {
            botMessage(src, "You cannot unmute someone who isn't muted!", c);
            return;
        }

        botEscapeAll(target + " was unmuted by " + srcname + "!", 0);

        if (!isEmpty(reason)) {
            botEscapeAll("Reason: " + reason, 0);
        }

        var all = idsOfIP(theIP),
            z;

        for (z in all) {
            JSESSION.users(all[z]).muted = false;
        }

        delete DataHash.mutes[theIP];
        cache.write("mutes", JSON.stringify(DataHash.mutes));
    },

    issueTempBan: function (src, target, reason, time, c, timeunit) {
        var theIP = sys.dbIp(target),
            srcauth = sys.auth(src),
            srcname = sys.name(src),
            tarid = sys.id(target),
            timeUnitTime = stringToTime(timeunit, time);

        if (theIP == undefined) {
            botMessage(src, "Unknown target!");
            return;
        }
        if (sys.maxAuth(theIP) >= srcauth && !isHost(src)) {
            botMessage(src, "You don't have sufficient auth to temp ban " + target + ".", c);
            return;
        }

        Prune.bans();

        if (DataHash.tempbans.hasOwnProperty(theIP)) {
            botMessage(src, "You cannot ban an already banned player!", c);
            return;
        }

        if (time == undefined || isNaN(timeUnitTime)) {
            botMessage(src, "Specify time!", c);
            return;
        }
        if (timeUnitTime > 7200 && srcauth < 2) {
            botMessage(src, "You may only ban for a maximum of 5 days.", c);
            return;
        }

        var thetime = sys.time() * 1 + timeUnitTime,
            thestr = thetime - sys.time() * 1,
            timestr = getTimeString(thestr);

        botEscapeAll(target + " was banned by " + srcname + " for " + timestr + "!", 0);

        if (!isEmpty(reason)) {
            botEscapeAll("Reason: " + reason, 0);
        }

        if (tarid != undefined) {
            kick(tarid);
        }
        else {
            aliasKick(theIP);
        }

        var re = "None given";

        if (!isEmpty(reason)) {
            re = reason;
        }

        DataHash.tempbans[theIP] = {
            by: sys.name(src),
            why: re,
            ip: theIP,
            time: thetime
        };
        cache.write("tempbans", JSON.stringify(DataHash.tempbans));
    },

    removeTempBan: function (src, target, reason, c) {
        var theIP = sys.dbIp(target),
            srcauth = sys.auth(src),
            srcname = sys.name(src),
            tarid = sys.id(target);

        if (theIP == undefined) {
            botMessage(src, "Unknown target!", c);
            return;
        }

        Prune.bans();

        if (!DataHash.tempbans.hasOwnProperty(theIP)) {
            botMessage(src, "You cannot unban someone who isn't banned!", c);
            return;
        }

        botEscapeAll(target + " was un-tempbanned by " + srcname + "!", 0);

        if (!isEmpty(reason)) {
            botEscapeAll("Reason: " + reason, 0);
        }

        delete DataHash.tempbans[theIP];
        cache.write("tempbans", JSON.stringify(DataHash.tempbans));
    },

    tAuth: function (src, tar, auth, time, chan, timeUnit) {
        var sa = sys.auth(src),
            ta = sys.dbAuth(tar),
            theIP = sys.dbIp(tar),
            timeUnitTime = stringToTime(timeUnit, time);

        auth = Math.round(auth);

        if (theIP == undefined) {
            botMessage(src, "Unknown target!", chan);
            return;
        }

        if (auth <= 0) {
            botMessage(src, "You cannot give " + UserName + " authority to someone.", chan);
            return;
        }

        if (!sys.dbRegistered(tar)) {
            botMessage(src, "This player is not registered.", chan);
            if (sys.id(tar) != undefined) {
                botMessage(sys.id(tar), "Please register for Authority.");
            }
            return;
        }

        if (auth > 1 && sa == 2) {
            botMessage(src, "You cannot give any authority higher than " + ModName + " to " + tar, chan);
            return;
        }

        if (auth > 3) {
            auth = 127;
        }

        var toAuth = "admin";
        if (auth < 2) {
            toAuth = "mod";
        }

        if (sys.maxAuth(theIP) >= sa && sa < 3 || ta >= auth) {
            botMessage(src, "You cannot give " + authToString(auth) + " to " + tar + "!", chan);
            return;
        }

        if (isNaN(timeUnitTime)) {
            botMessage(src, "Specify valid time!", chan);
            return;
        }

        if (DataHash.tempauth[tar.toLowerCase()] != undefined) {
            botMessage(src, "This user already has tempauth.", chan);
            return;
        }

        var timey = getTimeString(timeUnitTime);

        putInAuthChan(tar, toAuth);
        botAll(sys.name(src) + " made " + tar + " " + authToString(auth) + " for " + timey + ".", 0);

        if (sys.id(tar) != undefined) {
            sys.changeAuth(sys.id(tar), auth);
        }

        sys.changeDbAuth(tar, auth);
        var correctCase = tar;

        tar = tar.toLowerCase();
        time = timeUnitTime;
        time += sys.time() * 1;

        DataHash.tempauth[tar] = {
            'time': time,
            'role': auth,
            'name': correctCase,
            'oldauth': ta
        };
        cache.write("tempauth", JSON.stringify(DataHash.tempauth));
    },

    importable: function (src, tar, chan) {
        var natureNames = {
            24: "Quirky</font></b> Nature",
            23: "Careful</font></b> Nature (+SDef, -SAtk)",
            22: "Sassy</font></b> Nature (+SDef, -Spd)",
            21: "Gentle</font></b> Nature (+SDef, -Def)",
            20: "Calm</font></b> Nature (+SDef, -Atk)",
            19: "Rash</font></b> Nature (+SAtk, -SDef)",
            18: "Bashful</font></b> Nature",
            17: "Quiet</font></b> Nature (+SAtk, -Spd)",
            16: "Mild</font></b> Nature (+SAtk, -Def)",
            15: "Modest</font></b> Nature (+SAtk, -Atk)",
            14: "Naive</font></b> Nature (+Spd, -SDef)",
            13: "Jolly</font></b> Nature (+Spd, -SAtk)",
            12: "Serious</font></b> Nature",
            11: "Hasty</font></b> Nature (+Spd, -Def)",
            10: "Timid</font></b> Nature (+Spd, -Atk)",
            9: "Lax</font></b> Nature (+Def, -SDef)",
            8: "Impish</font></b> Nature (+Def, -SAtk)",
            7: "Relaxed</font></b> Nature (+Def, -Spd)",
            6: "Docile</font></b> Nature",
            5: "Bold</font></b> Nature (+Def, -Atk)",
            4: "Naughty</font></b> Nature (+Atk, -SDef)",
            3: "Adamant</font></b> Nature (+Atk, -SAtk)",
            2: "Brave</font></b> Nature (+Atk, -Spd)",
            1: "Lonely</font></b> Nature (+Atk, -Def)",
            0: "Hardy</font></b> Nature"
        },
            colorNames = {
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
            },
            genderNames = {
                2: "female",
                1: "male",
                0: "neutral"
            },
            evNames = {
                0: "HP",
                1: "Atk",
                2: "Def",
                3: "SAtk",
                4: "SDef",
                5: "Spd"
            };

        var hiddenPowerNum = 237,
            t = new Template(),
            teamno, gen, fullgen, n, numteams = sys.teamCount(tar);

        t.register(style.header);
        t.register("<font color=" + script.namecolor(tar) + "><b>" + sys.name(tar) + "</b></font>'s Teams<br/>");

        for (n = 0; n < numteams; n++) {
            teamno = n + 1;
            gen = sys.gen(tar, n);
            fullgen = sys.generation(gen, sys.subgen(tar, n));

            if (n != 0) {
                t.register("");
            }

            t.register("#" + teamno + ": Gen " + gen + " (" + fullgen + ")<br/>");

            var i, color, gender, pokeId, nick, item, level, evstr, w, evtable, dvstr, dvtable, nature, j, moveNum, moveName, moveStr, hpdvs, hp, movetype, hptype;

            for (i = 0; i < 6; i++) {
                color = colorNames[sys.pokeType1(sys.teamPoke(tar, n, i), gen)];
                pokeId = sys.teamPoke(tar, n, i);

                if (pokeId === 0) {
                    continue;
                }

                gender = genderNames[sys.teamPokeGender(tar, n, i)];
                shinyPoke = false; // sys.teamPokeShine(tar, n, i); = bugged in v2
                t.register("<img src='pokemon:num=" + pokeId + "&gen=" + gen + "&back=false&shiny=" + shinyPoke + "&gender=" + gender + "'><img src='pokemon:num=" + pokeId + "&gen=" + gen + "&back=true&shiny=" + shinyPoke + "&gender=" + gender + "'>");

                nick = sys.teamPokeNick(tar, n, i) + "</b></font> (<b><font color=" + color + ">" + sys.pokemon(sys.teamPoke(tar, n, i)) + "</b></font>)"
                if (sys.teamPokeNick(tar, n, i) == sys.pokemon(sys.teamPoke(tar, n, i))) {
                    nick = sys.pokemon(sys.teamPoke(tar, n, i)) + "</b></font>";
                }

                item = "<img src='item:" + sys.teamPokeItem(tar, n, i) + "'>";
                if (sys.item(sys.teamPokeItem(tar, n, i)) == "(No Item)") {
                    item = "";
                }

                t.register("<font color=" + color + "><b> " + nick + " " + sys.gender(sys.teamPokeGender(tar, n, i)).replace(/female/g, "<img src='Themes/Classic/genders/gender2.png'> (F)").replace(/male/g, "<img src='Themes/Classic/genders/gender1.png'> (M)").replace(/genderless/g, "<img src='Themes/Classic/genders/gender0.png'>") + " @ " + item + " " + sys.item(sys.teamPokeItem(tar, n, i)));

                if (gen > 2) {
                    t.register("<font color=" + color + "><b>Trait:</b></font> " + sys.ability(sys.teamPokeAbility(tar, n, i)));
                }

                level = sys.teamPokeLevel(tar, n, i);

                if (level != 100) {
                    t.register('<b><font color=' + color + '>Level:</b></font> ' + level);
                }

                evstr = [];

                for (w = 0; w < 6; w++) {
                    evtable = evNames[w];
                    if (sys.teamPokeEV(tar, n, i, w) != 0 || gen == 2 && sys.teamPokeEV(tar, n, i, q) != 255) {
                        evstr.push(sys.teamPokeEV(tar, n, i, w) + " " + evtable);
                    }
                }

                if (evstr.length != 0) {
                    t.register("<font color=" + color + "><b>EVs:</b></font> " + evstr.join(" / "));
                }

                dvstr = [];
                for (w = 0; w < 6; w++) {
                    dvtable = evNames[w];
                    if (sys.teamPokeDV(tar, n, i, w) != 31 || gen == 2 && sys.teamPokeDV(tar, n, i, w) != 15) {
                        dvstr.push(sys.teamPokeDV(tar, n, i, w) + " " + dvtable);
                    }
                }

                if (dvstr.length != 0) {
                    t.register("<font color=" + color + "><b>IVs:</b></font> " + dvstr.join(" / "));
                }

                if (gen > 2) {
                    nature = natureNames[sys.teamPokeNature(tar, n, i)];
                    t.register("<b><font color=" + color + ">" + nature + "</font></b>");
                }

                for (j = 0; j < 4; j++) {
                    moveNum = sys.teamPokeMove(tar, n, i, j);
                    moveName = sys.move(moveNum);
                    moveStr = "<b><font color=" + colorNames[sys.moveType(moveNum)] + ">" + moveName + "</font></b>";

                    if (moveNum == 0) {
                        continue;
                    }

                    if (moveNum == hiddenPowerNum) {
                        hpdvs = [];

                        for (w = 0; w < 6; w++) {
                            hpdvs.push(sys.teamPokeDV(src, n, i, w));
                        }

                        hp = sys.hiddenPowerType.apply(sys, [gen].concat(hpdvs));
                        movetype = sys.type(hp);

                        hptype = "<font color=" + colorNames[hp] + "><b>" + movetype + "</b></font>";
                        moveStr = "<font color=" + colorNames[hp] + "><b>Hidden Power</b></font> [" + hptype + "]";
                    }

                    t.register(moveStr);
                }

                if (teamno != numteams) {
                    t.register("<hr/>");
                }
            }
        }

        t.register(style.footer);
        t.render(src, chan, "<br/>");
    },

    loadTiers: function () {
        TierBans = new(function () {
            this.bans = [];

            this.Include = 0;
            this.Exclude = 1;

            this.newBan = function (method, tiers, ban) {
                this.bans.push({
                    method: method,
                    tiers: tiers,
                    ban: ban
                });
            }

            this.isLegalTeam = function (src, team, tier, silent) {
                if (tier == "Challenge Cup") {
                    return true;
                }


                if (!sys.hasLegalTeamForTier(src, team, tier)) {
                    return false;
                }

                var alerts = [],
                    x, b = this.bans,
                    cban, correct, z, alert;

                for (x in b) {
                    cban = b[x];
                    if (cban.method == this.Include) {
                        correct = cban.tiers.indexOf(tier) != -1;
                    } else {
                        correct = cban.tiers.indexOf(tier) == -1;
                    }

                    if (correct) {
                        alert = cban.ban(src, team, tier);
                        if (typeof alert == "object") {
                            alerts.concat(alert);
                        }
                    }

                    if (alerts.length == 0) {
                        return true; // Team is valid
                    } else if (!silent) {
                        for (z in alerts) {
                            teamAlert(src, team, alerts[z]);
                        }
                        return false;
                    }
                }
            }

            this.findGoodTier = function (src, team) {
                var path = ["Wifi LC", "DW LC", "Wifi LC Ubers", "Wifi NU", "Wifi LU", "Wifi UU", "Wifi OU", "No Preview OU", "Wifi Ubers", "No Preview Ubers", "Challenge Cup"],
                    i, tier;
                for (i in path) {
                    tier = path[i];
                    if (sys.hasLegalTeamForTier(src, team, tier) && this.isLegalTeam(src, team, tier, true)) {
                        teamAlert(src, team, "Your team's tier is now " + tier + ".");
                        sys.changeTier(src, team, tier);
                        return;
                    }
                }
            }
        })();

        var INCLUDING = TierBans.Include,
            EXCLUDING = TierBans.Exclude,
            cc = ["Challenge Cup", "CC 1v1"],
            dw = ["No Preview OU", "No Preview Ubers", "Monotype", "Gen 5 1v1 Ubers", "Gen 5 1v1", "Challenge Cup", "CC 1v1", "DW Uber Triples", "No Preview OU Triples", "No Preview Uber Doubles", "No Preview OU Doubles", "Shanai Cup", "Monocolour"];

        TierBans.newBan(EXCLUDING, [], function eventShinies(player, team) {
            if (typeof beasts == "undefined") {
                beasts = {};
                beasts[sys.pokeNum('Raikou')] = ['Extremespeed', 'Aura Sphere', 'Weather Ball', 'Zap Cannon'].map(sys.moveNum);
                beasts[sys.pokeNum('Suicune')] = ['Extremespeed', 'Aqua Ring', 'Sheer Cold', 'Air Slash'].map(sys.moveNum);
                beasts[sys.pokeNum('Entei')] = ['Extremespeed', 'Howl', 'Crush Claw', 'Flare Blitz'].map(sys.moveNum);
            }

            var beast, slot, i;
            for (beast in beasts) {
                for (slot = 0; slot < 6; slot++) {
                    if (sys.teamPoke(player, team, slot) == beast) {
                        for (i = 0; i < 4; i++) {
                            if (beasts[beast].indexOf(sys.teamPokeMove(player, team, slot, i)) != -1) {
                                sys.changePokeShine(player, team, slot, true);
                            }
                        }
                    }
                }
            }
        });

        TierBans.newBan(EXCLUDING, cc, function customAbilityBans(src, team, tier) {
            var ltier = tier.toLowerCase(),
                ret = [],
                bans = DataHash.bannedAbilities,
                i, ability, lability, poke, lpoke;
            for (i = 0; i < 6; ++i) {
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
        });

        TierBans.newBan(EXCLUDING, cc, function eventMovesCheck(src, team, tier) {
            var ret = [],
                i, poke, x, y, nat, move;
            for (i = 0; i < 6; i++) {
                poke = sys.teamPoke(src, team, i);
                if (pokeNatures.has(poke)) {
                    for (x in pokeNatures[poke]) {
                        nat = pokeNatures[poke][x];
                        for (y in nat[0]) {
                            move = nat[0][y];
                            if (sys.hasTeamPokeMove(src, team, i, sys.moveNum(move)) && sys.teamPokeNature(src, team, i) != sys.natureNum(nat[1])) {
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
                i, x;
            for (i = 0; i < 6; i++) {
                x = sys.teamPoke(src, team, i);
                if (x !== 0 && sys.hasDreamWorldAbility(src, team, i) && lcpokemons.indexOf(x) != -1) {
                    ret.push(sys.pokemon(x) + " is not allowed with a Dream World ability in the " + tier + " tier. Change it in the teambuilder.");

                }
            }
            return ret;
        });

        TierBans.newBan(INCLUDING, ["Wifi NU"], function evioliteCheck(src, team, tier) {
            var evioliteLimit = 6,
                eviolites = 0,
                i, x, item;

            for (i = 0; i < 6; i++) {
                x = sys.teamPoke(src, team, i);
                item = sys.teamPokeItem(src, team, i);
                if (item !== undefined) {
                    item = sys.item(item);
                }
                else {
                    item = "";
                }
                if (item == "Eviolite" && ++eviolites > evioliteLimit) {
                    return ["Only 1 pokemon is allowed with eviolite in " + tier + " tier. Please remove extra evioites in teambuilder."];
                }
            }
        });

        TierBans.newBan(EXCLUDING, dw, function dwAbilityCheck(src, team, tier) {
            if (sys.gen(src, team) < 5) {
                return;
            }
            var ret = [],
                i, x;
            for (i = 0; i < 6; i++) {
                x = sys.teamPoke(src, team, i);
                if (x !== 0 && sys.hasDreamWorldAbility(src, team, i) && (!(x in dwpokemons) || (breedingpokemons.indexOf(x) != -1 && sys.compatibleAsDreamWorldEvent(src, team, i) !== true))) {
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
                i, x;

            for (i = 0; i < 6; i++) {
                x = sys.teamPoke(src, team, i);
                if (x !== 0 && sys.teamPokeAbility(src, team, i) == moody) {
                    ret.push(sys.pokemon(x) + " is not allowed with Moody in " + tier + ". Change it in the teambuilder.");
                }
            }
            return ret;
        });

        TierBans.newBan(INCLUDING, ["Clear Skies"], function weatherlesstiercheck(src, team, tier) {
            var ret = [],
                i, ability, tl;
            for (i = 0; i < 6; i++) {
                ability = sys.ability(sys.teamPokeAbility(src, team, i));
                tl = ability.toLowerCase();

                if (tl == "drizzle" || tl == "drought" || tl == "snow warning" || tl == "sand stream") {
                    ret.push("Your team has a pokemon with the ability " + ability + ", please remove before entering " + tier + " tier.");
                }
            }
            return ret;
        });

        TierBans.newBan(INCLUDING, ["Monotype"], function monotypeCheck(src, team, tier) {
            var TypeA = sys.pokeType1(sys.teamPoke(src, team, 0), 5),
                TypeB = sys.pokeType2(sys.teamPoke(src, team, 0), 5),
                k, checkType, i, temptypeA, temptypeB;
            for (i = 1; i < 6; i++) {
                if (sys.teamPoke(src, team, i) === 0) {
                    continue;
                }

                temptypeA = sys.pokeType1(sys.teamPoke(src, team, i), 5), temptypeB = sys.pokeType2(sys.teamPoke(src, team, i), 5);

                if (checkType !== undefined) {
                    k = 3;
                }
                if (i == 1) {
                    k = 1;
                }
                if (TypeB != 17) {
                    if (temptypeA == TypeA && temptypeB == TypeB && k == 1 || temptypeA == TypeB && temptypeB == TypeA && k == 1) {
                        k = 2;
                    }
                }
                if (temptypeA == TypeA && k == 1 || temptypeB == TypeA && k == 1) {
                    checkType = TypeA;
                }
                if (temptypeA == TypeB && k == 1 || temptypeB == TypeB && k == 1) {
                    if (TypeB != 17) {
                        checkType = TypeB;
                    }
                    if (TypeB == 17) {
                        checkType = TypeA;
                    }
                }
                if (i > 1 && k == 2) {
                    k = 1;
                    if (temptypeA == TypeA && temptypeB == TypeB && k == 1 || temptypeA == TypeB && temptypeB == TypeA && k == 1) {
                        k = 2;
                    }
                    if (temptypeA == TypeA && k == 1 || temptypeB == TypeA && k == 1) {
                        checkType = TypeA;
                    }
                    if (temptypeA == TypeB && k == 1 || temptypeB == TypeB && k == 1) {
                        if (TypeB != 17) {
                            checkType = TypeB;
                        }
                        if (TypeB == 17) {
                            checkType = TypeA;
                        }
                    }
                }
                if (k == 3) {
                    if (temptypeA != checkType && temptypeB != checkType) {
                        return ["Your team is not Monotype as " + sys.pokemon(sys.teamPoke(src, team, i)) + " is not of type " + sys.type(checkType) + "!"];
                    }
                }

                if (k == 1) {
                    if (TypeB == 17) {
                        TypeB = TypeA;
                    }
                    if (temptypeA != TypeA && temptypeB != TypeA && temptypeA != TypeB && temptypeB != TypeB) {
                        return ["Your team is not Monotype as " + sys.pokemon(sys.teamPoke(src, team, i)) + " does not share a type with " + sys.pokemon(sys.teamPoke(src, team, 0)) + "!"];
                    }

                }
            }
        });

        TierBans.newBan(INCLUDING, ["Monogen"], function monoGenCheck(src, team, tier) {
            var GEN_MAX = [0, 151, 252, 386, 493, 647],
                gen = 0,
                i, pokenum, species;
            for (i = 0; i < 6; ++i) {
                pokenum = sys.teamPoke(src, team, i), species = pokenum % 65536; // remove alt formes
                if (species === 0) {
                    continue;
                }
                if (gen === 0) {
                    while (species > GEN_MAX[gen])++gen; // Search for correct gen for first poke
                } else if (!(GEN_MAX[gen - 1] < species && species <= GEN_MAX[gen])) {
                    return [sys.pokemon(pokenum) + " is not from gen " + gen + "!"];
                }
            }
        });


        TierBans.newBan(INCLUDING, ["Monocolour"], function monoColourCheck(src, team, tier) {
            if (typeof pokeColours == 'undefined') {
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
                colour, i;

            for (colour in colours) {
                if (colours[colour].indexOf(poke) > -1) {
                    thecolour = colour;
                }
            }
            for (i = 1; i < 6; ++i) {
                poke = sys.pokemon(sys.teamPoke(src, team, i));
                if (colours[thecolour].indexOf(poke) == -1 && poke != "Missingno") {
                    return [sLetter(poke) + " colour is not " + thecolour];
                }
            }
        });

        TierBans.newBan(INCLUDING, ["Smogon OU", "Wifi OU", "No Preview OU"], function swiftSwimCheck(src, team, tier) {
            var i, j;
            for (i = 0; i < 6; ++i) {
                if (sys.ability(sys.teamPokeAbility(src, team, i)) == "Drizzle") {
                    for (j = 0; j < 6; ++j) {
                        if (sys.ability(sys.teamPokeAbility(src, team, j)) == "Swift Swim") {
                            return ["You cannot have the combination of Swift Swim and Drizzle in " + tier];
                        }
                    }
                }
            }
        });

        TierBans.newBan(INCLUDING, ["Smogon UU"], function droughtCheck(src, team, tier) {
            var i;
            for (i = 0; i < 6; ++i) {
                if (sys.ability(sys.teamPokeAbility(src, team, i)) == "Drought") {
                    return ["Drought is not allowed in Smogon UU"];
                }
            }
        });

        TierBans.newBan(INCLUDING, ["Wifi UU", "Wifi LU", "Wifi NU"], function sandStreamCheck(src, team, tier) {
            var i;
            for (i = 0; i < 6; ++i) {
                if (sys.ability(sys.teamPokeAbility(src, team, i)) == "Sand Stream") {
                    return ["Sand Stream is not allowed in " + tier + "."];
                }
            }
        });

        TierBans.newBan(INCLUDING, ["Wifi UU", "Wifi LU", "Wifi NU"], function snowWarningCheck(src, team, tier) {
            var i;
            for (i = 0; i < 6; ++i) {
                if (sys.ability(sys.teamPokeAbility(src, team, i)) == "Snow Warning") {
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

            for (i = 0; i < 6; ++i) {
                ability = sys.ability(sys.teamPokeAbility(src, team, i)), lability = ability.toLowerCase(), poke = sys.pokemon(sys.teamPoke(src, team, i)), lpoke = poke.toLowerCase();
                if (lpoke in bannedAbilities && bannedAbilities[lpoke].indexOf(lability) != -1) {
                    ret.push(poke + " is not allowed to have ability " + ability + " in " + tier + ". Please change it in Teambuilder.");
                }
            }
            return ret;
        });

        TierBans.newBan(EXCLUDING, cc, function hasOneUsablePokemon(player, team) {
            var slot, move;
            for (slot = 0; slot < 6; slot++) {
                if (sys.teamPoke(player, team, slot) !== 0) {
                    for (move = 0; move < 4; move++)
                    if (sys.teamPokeMove(player, team, slot, move) !== 0) {
                        return;
                    }
                }
            }

            return ["You do not have any valid pokemon. (Please make at least one in Teambuilder)"];
        });

        dwpokemons = {};

        var dwpok, pnum = sys.pokeNum;

        if (Config.DWAbilityCheck) {
            var dwlist = ["Rattata", "Raticate", "Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Oddish", "Gloom", "Vileplume", "Bellossom", "Bellsprout", "Weepinbell", "Victreebel", "Ponyta", "Rapidash", "Farfetch'd", "Doduo", "Dodrio", "Exeggcute", "Exeggutor", "Lickitung", "Lickilicky", "Tangela", "Tangrowth", "Kangaskhan", "Sentret", "Furret", "Cleffa", "Clefairy", "Clefable", "Igglybuff", "Jigglypuff", "Wigglytuff", "Mareep", "Flaaffy", "Ampharos", "Hoppip", "Skiploom", "Jumpluff", "Sunkern", "Sunflora", "Stantler", "Poochyena", "Mightyena", "Lotad", "Ludicolo", "Lombre", "Taillow", "Swellow", "Surskit", "Masquerain", "Bidoof", "Bibarel", "Shinx", "Luxio", "Luxray", "Psyduck", "Golduck", "Growlithe", "Arcanine", "Scyther", "Scizor", "Tauros", "Azurill", "Marill", "Azumarill", "Bonsly", "Sudowoodo", "Girafarig", "Miltank", "Zigzagoon", "Linoone", "Electrike", "Manectric", "Castform", "Pachirisu", "Buneary", "Lopunny", "Glameow", "Purugly", "Natu", "Xatu", "Skitty", "Delcatty", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Bulbasaur", "Charmander", "Squirtle", "Ivysaur", "Venusaur", "Charmeleon", "Charizard", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Infernape", "Monferno", "Piplup", "Prinplup", "Empoleon", "Treecko", "Sceptile", "Grovyle", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Caterpie", "Metapod", "Butterfree", "Pidgey", "Pidgeotto", "Pidgeot", "Spearow", "Fearow", "Zubat", "Golbat", "Crobat", "Aerodactyl", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Yanma", "Yanmega", "Murkrow", "Honchkrow", "Delibird", "Wingull", "Pelipper", "Swablu", "Altaria", "Starly", "Staravia", "Staraptor", "Gligar", "Gliscor", "Drifloon", "Drifblim", "Skarmory", "Tropius", "Chatot", "Slowpoke", "Slowbro", "Slowking", "Krabby", "Kingler", "Horsea", "Seadra", "Kingdra", "Goldeen", "Seaking", "Magikarp", "Gyarados", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Wooper", "Quagsire", "Qwilfish", "Corsola", "Remoraid", "Octillery", "Mantine", "Mantyke", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Barboach", "Whiscash", "Clamperl", "Gorebyss", "Huntail", "Relicanth", "Luvdisc", "Buizel", "Floatzel", "Finneon", "Lumineon", "Tentacool", "Tentacruel", "Corphish", "Crawdaunt", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Shellos", "Gastrodon", "Lapras", "Dratini", "Dragonair", "Dragonite", "Elekid", "Electabuzz", "Electivire", "Poliwag", "Poliwrath", "Politoed", "Poliwhirl", "Vulpix", "Ninetales", "Musharna", "Munna", "Darmanitan", "Darumaka", "Mamoswine", "Togekiss", "Burmy", "Wormadam", "Mothim", "Pichu", "Pikachu", "Raichu", "Abra", "Kadabra", "Alakazam", "Spiritomb", "Mr. Mime", "Mime Jr.", "Meditite", "Medicham", "Meowth", "Persian", "Shuppet", "Banette", "Spinarak", "Ariados", "Drowzee", "Hypno", "Wobbuffet", "Wynaut", "Snubbull", "Granbull", "Houndour", "Houndoom", "Smoochum", "Jynx", "Ralts", "Gardevoir", "Gallade", "Sableye", "Mawile", "Volbeat", "Illumise", "Spoink", "Grumpig", "Stunky", "Skuntank", "Bronzong", "Bronzor", "Mankey", "Primeape", "Machop", "Machoke", "Machamp", "Magnemite", "Magneton", "Magnezone", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Rhyperior", "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Phanpy", "Donphan", "Magby", "Magmar", "Magmortar", "Larvitar", "Pupitar", "Tyranitar", "Makuhita", "Hariyama", "Numel", "Camerupt", "Torkoal", "Spinda", "Trapinch", "Vibrava", "Flygon", "Cacnea", "Cacturne", "Absol", "Beldum", "Metang", "Metagross", "Hippopotas", "Hippowdon", "Skorupi", "Drapion", "Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop", "Bagon", "Shelgon", "Salamence", "Seel", "Dewgong", "Shellder", "Cloyster", "Chinchou", "Lanturn", "Smeargle", "Porygon", "Porygon2", "Porygon-Z", "Drilbur", "Excadrill", "Basculin", "Basculin-a", "Alomomola", "Stunfisk", "Druddigon", "Foongus", "Amoonguss", "Liepard", "Purrloin", "Minccino", "Cinccino", "Sandshrew", "Sandslash", "Vullaby", "Mandibuzz", "Rufflet", "Braviary", "Frillish", "Jellicent", "Weedle", "Kakuna", "Beedrill", "Shroomish", "Breloom", "Zangoose", "Seviper", "Combee", "Vespiquen", "Patrat", "Watchog", "Blitzle", "Zebstrika", "Woobat", "Swoobat", "Mienfoo", "Mienshao", "Bouffalant", "Staryu", "Starmie", "Togepi", "Shuckle", "Togetic", "Rotom", "Sigilyph", "Riolu", "Lucario", "Lugia", "Ho-Oh", "Dialga", "Palkia", "Giratina", "Grimer", "Muk", "Ditto", "Venonat", "Venomoth", "Herdier", "Lillipup", "Stoutland", "Sewaddle", "Swadloon", "Leavanny", "Cubchoo", "Beartic", "Landorus", "Thundurus", "Tornadus", "Dunsparce", "Sneasel", "Weavile", "Nosepass", "Probopass", "Karrablast", "Escavalier", "Shelmet", "Accelgor", "Snorunt", "Glalie", "Froslass", "Heatran", "Pinsir", "Emolga", "Heracross", "Trubbish", "Garbodor", "Snover", "Abomasnow", "Diglett", "Dugtrio", "Geodude", "Graveler", "Golem", "Onix", "Steelix", "Voltorb", "Electrode", "Cubone", "Marowak", "Whismur", "Loudred", "Exploud", "Aron", "Lairon", "Aggron", "Spheal", "Sealeo", "Walrein", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Gible", "Gabite", "Garchomp", "Pidove", "Tranquill", "Unfezant", "Tympole", "Palpitoad", "Seismitoad", "Cottonee", "Whimsicott", "Petilil", "Lilligant", "Ducklett", "Swanna", "Deerling", "Sawsbuck", "Elgyem", "Beheeyem", "Pawniard", "Bisharp", "Heatmor", "Durant", "Venipede", "Whirlipede", "Scolipede", "Tirtouga", "Carracosta", "Joltik", "Galvantula", "Maractus", "Dwebble", "Crustle", "Roggenrola", "Boldore", "Gigalith", "Vanillite", "Vanillish", "Vanilluxe", "Klink", "Klang", "Klinklang", "Swinub", "Piloswine", "Golett", "Golurk"];
            for (dwpok in dwlist) {
                dwpokemons[pnum(dwlist[dwpok])] = true;
            }
        }

        var lclist = ["Bulbasaur", "Charmander", "Squirtle", "Croagunk", "Turtwig", "Chimchar", "Piplup", "Treecko", "Torchic", "Mudkip"];
        lcpokemons = [];

        for (dwpok in lclist) {
            lcpokemons.push(pnum(lclist[dwpok]));
        }

        bannedGSCSleep = [sys.moveNum("Spore"), sys.moveNum("Hypnosis"), sys.moveNum("Lovely Kiss"), sys.moveNum("Sing"), sys.moveNum("Sleep Powder")];
        bannedGSCTrap = [sys.moveNum("Mean Look"), sys.moveNum("Spider Web")];

        pokeNatures = {
            "Heatran": [
                ["Eruption"], "Quiet"],
            "Suicune": [
                ["ExtremeSpeed", "Sheer Cold", "Aqua Ring", "Air Slash"], "Relaxed"],
            "Raikou": [
                ["ExtremeSpeed", "Weather Ball", "Zap Cannon", "Aura Sphere"], "Rash"],
            "Entei": [
                ["ExtremeSpeed", "Flare Blitz", "Howl", "Crush Claw"], "Adamant"],
            "Snivy": [
                ["Aromatherapy", "Synthesis"], "Hardy"]
        };

        breedingpokemons = [];

        if (Config.DWAbilityCheck) {
            var breedingList = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Hitmonlee", "Hitmonchan", "Hitmontop", "Tyrogue", "Porygon", "Porygon2", "Porygon-Z"];
            for (dwnum in breedingList) {
                breedingpokemons.push(sys.pokeNum(breedingList[dwpok]));
            }
        }

    },

    resolveLocation: function (id, ip, synchronously) {
        var dhl = DataHash.locations,
            myip = ip;
        if (dhl[ip] == undefined) {
            dhl[ip] = {
                'hostname': 'pending',
                'country_code': 'pending',
                'country_name': 'pending'
            };

            if (!synchronously) {
                sys.webCall(IP_Resolve_URL.format(ip), function (json_code) {
                    json_code = json_code.replace("ip", '"ip"');
                    json_code = json_code.replace("hostname", '"hostname"');
                    json_code = json_code.replace("country_code", '"country_code"');
                    json_code = json_code.replace("country_name", '"country_name"');

                    var code = JSON.parse(json_code);
                    dhl[myip] = code;
                    playerscache.write("locations", JSON.stringify(dhl));

                    if (sys.loggedIn(id)) {
                        if (code.country_name == "Anonymous Proxy") {
                            sendFailWhale(src, 0);
                            botMessage(src, "Remove the proxy to enter the server.");
                            botAll(sys.name(id) + " tried to enter the server and failed. [Reason: Proxy]", watch);
                            kick(src);
                        }
                    }
                });
            }
            else {
                var json_code = sys.synchronousWebCall(IP_Resolve_URL.format(ip));
                json_code = json_code.replace("ip", '"ip"');
                json_code = json_code.replace("hostname", '"hostname"');
                json_code = json_code.replace("country_code", '"country_code"');
                json_code = json_code.replace("country_name", '"country_name"');

                var code = JSON.parse(json_code);
                dhl[myip] = code;
                playerscache.write("locations", JSON.stringify(dhl));

                if (sys.loggedIn(id)) {
                    if (code.country_name == "Anonymous Proxy") {
                        sendFailWhale(src, 0);
                        botMessage(src, "Remove the proxy to enter the server.");
                        botAll(sys.name(id) + " tried to enter the server and failed. [Reason: Proxy]", watch);
                        kick(src);
                    }
                }
            }

        }
    },

    loadUtilities: function () {
        if (typeof fonts == 'undefined') {
            // Windows 7 Fonts //
            // Note: Some fonts MIGHT not work/look too much like default font
            // so they won't be noticed.
            fonts = ["Aharoni", "Andalus", "Angsana New", "AngsanaUPC", "Aparajita", "Arabic Typesetting", "Arial", "Arial Unicode MS", "Batang", "BatangChe", "Blackadder ITC", "Book Antiqua", "Bookman Old Style", "Bookshelf Symbol 7", "Bradley Hand ITC", "Browallia New", "BrowalliaUPC", "Calibri", "Cambria", "Cambria Math", "Candara", "Century Gothic", "Century", "Comic Sans MS", "Consolas", "Constantia", "Copperplate Gothic", "Corbel", "Cordia New", "CordiaUPC", "Courier New", "Courier", "Curlz MT", "DaunPenh", "David", "DFKai-SB", "DilleniaUPC", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Engravers MT", "Eras ITC", "Estrangelo Edessa", "EucrosiaUPC", "Euphemia", "Eurostile", "FangSong", "Felix Titling", "Fixedsys", "Franklin Gothic", "Franklin Gothic Book", "FrankReuhl", "FreesiaUPC", "Freestyle Script", "French Script MT", "Gabriolia", "Garamond", "Gautami", "Georgia", "Gisha", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Impact", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jokerman", "Juice ITC", "KaiTI", "Kalinga", "Kartika", "Khmer UI", "KodchiangUPC", "Kokila", "Kristen ITC", "Lao UI", "Latha", "Leelawadee", "Levenim MT", "LilyUPC", "Lucida Console", "Lucida", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Unicode", "Maiandra GD", "Malgun Gothic", "Mangal", "Matisse ITC", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Miriam Fixed", "Miriam", "Mistral", "Modern", "Mongolian Baiti", "Monotype Corsiva", "MoolBoran", "MS Gothic", "MS Mincho", "MS PGothic", "MS PMincho", "MS Reference1", "MS Reference2", "MS Reference Sans Serif", "MS Reference Specialty", "MS Sans Serif", "MS Serif", "MS UI Gothic", "MT Extra", "MV Boli", "Narkisim", "NSimSun", "Nyala", "OCR A Breed", "Palatino Linotype", "Papyrus", "Perpetua", "PlantageNet Cherokee", "PMingLiU", "PMingLiU-ExtB", "Pristina", "Raavi", "Rockwell", "Rod", "Roman", "Sakkal", "Script", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Symbol", "Shonar Bangla", "Shruti", "SemHei", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Small Fonts", "Sylfaen", "Symbol", "System", "Tahoma", "Tempus Sans ITC", "Terminal", "Times New Roman", "Traditional Arabic", "Trebucket MS", "Tunga", "Utsaah", "Vani", "Verdana", "Vijaya", "Vivaldi", "Vrinda", "Webdings", "Wingdings2", "Wingdings3", "Wingdings"];

            // PO Fonts //
            fonts.push("LCD", "SignPainter'sGothicShadedSC JL");
        }

        checkForUpdates = function (noresume) {
            var commitData = "";
            try {
                commitData = JSON.parse(cache.get("LastCommitData"));
            }
            catch (e) {
                commitData = "";
            }

            sys.webCall(CommitDataURL, function (resp) {
                if (resp != "") {
                    var json = JSON.parse(resp);
                    var lastCom = json.commits[0];
                    var commitMsg = lastCom.message;

                    if (commitMsg.toLowerCase().indexOf("(script: no update)") == -1) {
                        if (commitData.message != commitMsg || commitData == "") {
                            cache.write("LastCommitData", JSON.stringify(lastCom));
                            botAll("An update for the script is available. Update available on <a href=" + ScriptURL + ">" + ScriptURL + "</a>.", 0);
                            botAll("Commit Message: " + commitMsg, 0);

                        }
                    }
                }
            });

            if (noresume == null) {
                sys.callLater("checkForUpdates();", 1800);
            }
        }

        if (typeof updateChecking == 'undefined') {
            sys.callLater("checkForUpdates();", 1800); /* 60*30 */
            updateChecking = true;
        }

        ScriptUpdateMessage = function () {
            var runEndTime = new Date().getTime(),
                ending = runEndTime - EvaluationTimeStart,
                load = "Runtime: " + ending / 1000 + " seconds.";
            delete EvaluationTimeStart;

            DisableChatColorRandomizer(0);

            if (typeof StartUp !== 'undefined') {
                delete StartUp;
                print("\t\tServer Script has been loaded.\t\t\n\t\tEvaluation Time: " + ending / 1000 + " seconds.\t\t");
                return;
            }

            var code = '<center><table border="1" width="50%" style="background: qradialgradient(cy: 0.1, cx: 0.5, fx: 0.9, fy: 0, radius: 2 stop: 0 black, stop: 1 white);"><tr style="background: qradialgradient(cy: 0.1, cx: 0.5, fx: 0.9, fy: 0, radius: 2 stop: 0 black, stop: 1 white);"><td align="center"><img src="pokemon:493&back=true" align="left"><img src="pokemon:385&back=false" align="right"><font size="4"><b><br/> ' + servername + ' - Scripts <br/></b></font> Scripts have been updated! <br/> ' + load + ' <br/> ~ ' + ScriptVersion + ' ~ <br/></td></tr></table></center>';
            sys.sendHtmlAll(code, 0);
        }

        ChatColorRandomizer = function (firstColor, secondColor, channel) {
            if (firstColor === undefined || firstColor.toLowerCase() == "random") {
                firstColor = randcolor();
            }
            if (secondColor === undefined || secondColor.toLowerCase() == "random") {
                secondColor = randcolor();
            }

            var code = '<center><hr width="150"/><b>Party Time!</b><hr width="150"/></center><div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + firstColor + ', stop:1 ' + secondColor + ');">';

            sys.sendHtmlAll(code, channel);

            ChatColorRandomizers[channel] = {
                'firstColor': firstColor,
                'secondColor': secondColor
            };
        }

        DisableChatColorRandomizer = function (channel) {
            if (!ChatColorRandomizers.hasOwnProperty(channel)) {
                return;
            }

            delete ChatColorRandomizers[channel];

            sys.sendHtmlAll('<center><hr width="150"/><b>Party Time is over!</b><hr width="150"/></center>', channel);
        }

        RandFont = function () {
            return fonts[Math.round(fonts.length * Math.random())];
        }

        RandomColorSpan = function () {
            var color1 = sys.rand(0, 256),
                color2 = sys.rand(0, 256),
                color3 = sys.rand(0, 256);

            return "<span style='background-color: rgb(" + color1 + ", " + color2 + ", " + color3 + ");'>"
        }

        randcolor = function (tagformat) {
            var nums = 5,
                str = '';

            while (nums >= 0) {
                str += sys.rand(0, 16).toString(16);
                nums--;
            }

            if (!tagformat) {
                return "#" + str;
            } else {
                return "<font color='#" + str + "'>";
            }
        }

        removespaces = function (string) {
            return string.split(' ').join('');
        }

        authToString = function (auth, img) {
            if (!img) {
                if (auth == 0) {
                    return UserName;
                } else if (auth == 1) {
                    return ModName;
                } else if (auth == 2) {
                    return AdminName;
                } else if (auth == 3) {
                    return OwnerName;
                } else {
                    return InvisName;
                }
            }
            else {
                if (auth == 1) {
                    return 'M';
                } else if (auth == 2) {
                    return 'A';
                } else if (auth == 3) {
                    return 'O';
                } else {
                    return 'U';
                }
            }
        }

        putInAuthChan = function (name, type, channel) {
            var src = sys.id(name),
                putIn = function (id, chan) {
                    if (!sys.isInChannel(id, chan)) {
                        sys.putInChannel(id, chan);
                    }
                }

                if (src == undefined) {
                    return;
                }

                if (type == "mu") {
                    put(src, staffchannel);
                }
                if (type == "evalop" || type == "admin") {
                    putIn(src, scriptchannel);
                }
                if (type == "mod" || type == "admin") {
                    putIn(src, staffchannel);
                    putIn(src, watch);
                }
                if (type == "cauth") {
                    putIn(src, channel);
                }
        }

        kickFromChannel = function (name, chan) {
            var ownTL = name.toLowerCase(),
                cObj = JSESSION.channels(chan),
                isMU = DataHash.megausers.hasOwnProperty(ownTL),
                isOp = DataHash.evalops.hasOwnProperty(ownTL);

            if (cObj.chanAuth.hasOwnProperty(ownTL) && cObj.chanAuth[ownTL] > 0) {
                return;
            }

            if (chan == staffchannel && isMU) {
                return;
            }

            if (chan == scriptchannel && isOp) {
                return;
            }

            var id = sys.id(name);
            if (id != undefined) {
                sys.kick(id, chan);
                if (sys.channelsOfPlayer(id).length == 0) {
                    sys.putInChannel(id, 0);
                }
            }
        }

        AuthIMG = function (x) {
            if (typeof x == 'string') {
                var ats = authToString(sys.dbAuth(x), true);
                return "<img src='Themes/Classic/Client/" + ats + "Away.png'>";
            }

            var status, ats = authToString(sys.auth(x), true),
                n;

            if (sys.away(x)) {
                status = 'Away';
            }
            else if (!sys.away(x)) {
                status = 'Available';
            }
            else if (sys.battling(x)) {
                status = 'Battle';
            }

            n = ats + status + ".png";
            return '<img src="Themes/Classic/Client/' + n + '">';
        }

        sendSTFUTruck = function (src, chan) {
            var name = "",
                message = "The chat is silenced";
            if (silence.by) {
                name = " by " + silence.by + "!";
            }
            if (!silence.level) {
                name = "STFU!";
            }
            botMessage(src, '|^^^^^^^^^^^\||____', chan);
            botMessage(src, '| The STFU Truck  |||""\'|""\__,_', chan);
            botMessage(src, '| _____________ l||__|__|__|)', chan);
            botMessage(src, '...|(@)@)"""""""**|(@)(@)**|(@)', chan);
            botMessage(src, message + name + "!", chan);
        }

        sendFailWhale = function (id, chan) {
            botMessage(id, "▄██████████████▄▐█▄▄▄▄█▌", chan);
            botMessage(id, "██████▌▄▌▄▐▐▌███▌▀▀██▀▀", chan);
            botMessage(id, "████▄█▌▄▌▄▐▐▌▀███▄▄█▌", chan);
            botMessage(id, "▄▄▄▄▄██████████████▀", chan);
            botMessage(id, "Fail!", chan);
        }

        sortHash = function (object, method) {
            var objs = Object.keys(object),
                y, newobj = {},
                x, n;

            if (typeof method == 'function') {
                objs.sort(method);
            }
            else {
                objs.sort();
            }

            for (x in objs) {
                n = objs[x];
                newobj[n] = object[n];
            }

            return newobj;
        }

        if (typeof silence == "undefined") {
            silence = {
                "by": "",
                "level": 0
            };
        }

        if (typeof ChatColorRandomizers == 'undefined') {
            ChatColorRandomizers = {};
        }

        ban = function (name) {
            sys.ban(name);

            var id = sys.id(name);
            if (id != undefined) {
                kick(id);
            }
            else {
                aliasKick(sys.dbIp(name));
            }
        }

        disconnectAll = function (src) {
            var xlist, c, ip = sys.ip(src),
                playerIdList = sys.playerIds();

            for (xlist in playerIdList) {
                c = playerIdList[xlist];
                if (ip == sys.ip(c)) {
                    sys.disconnect(c);
                }
            }
        }

        kick = function (src) {
            var xlist, c, ip = sys.ip(src),
                playerIdList = sys.playerIds(),
                addIp = false;
            for (xlist in playerIdList) {
                c = playerIdList[xlist];
                if (ip == sys.ip(c)) {
                    sys.callQuickly('sys.kick(' + c + ');', 20);
                    addIp = true;
                }
            }

            if (addIp) {
                DataHash.reconnect[ip] = true;
                sys.callLater("delete DataHash.reconnect['" + ip + "'];", 5);
            }
        }

        aliasKick = function (ip) {
            var aliases = sys.aliases(ip),
                alias, id, addIp = false;
            for (alias in aliases) {
                id = sys.id(aliases[alias]);
                if (id != undefined) {
                    sys.callQuickly('sys.kick(' + id + ');', 20);
                    addIp = true;
                }
            }

            if (!addIp) {
                DataHash.reconnect[ip] = true;
                sys.callLater("delete DataHash.reconnect['" + ip + "'];", 5);
            }
        }

        massKick = function () {
            var x, ids = sys.playerIds(),
                current;

            for (x in ids) {
                current = ids[x];
                if (sys.auth(current) <= 0 && !JSESSION.users(current).megauser) {
                    sys.kick(current);
                }
            }
        }

        rangeIP = function (name) {
            var ips = sys.dbIp(name).split('.');
            return ips[0] + '.' + ips[1] + '.';
        }

        isHost = function (src) {
            return sys.ip(src) == "127.0.0.1";
        }

        self = function (src, tarname) {
            return sys.ip(src) == sys.dbIp(tarname);
        }

        function clink($1) {
            return ChannelLink(sys.channel($1));
        }

        function evalBBCode($1) {
            if (evallock && !GlobalHostVar) {
                return $1;
            }
            var toEval = $1.substr(6, $1.lastIndexOf("[") - 6),
                ret;
            try {
                ret = eval(toEval);
            }
            catch (e) {
                return FormatError("", e);
            }

            if (ret === undefined || ret === null) {
                ret = "";
            }

            return ret;
        }

        format = function (src, str) {
            if (typeof str != "string") {
                str = String(str);
            }

            var auth = hpAuth(src);
            GlobalHostVar = isHost(src);

            if (src == "lvl0") {
                auth = 0;
                GlobalHostVar = false;
            }

            if (src == "lvl2") {
                auth = 2;
                GlobalHostVar = false;
            }

            if (src == 0) {
                auth = 3;
                GlobalHostVar = true;
            }

            if (typeof src == 'number' && sys.loggedIn(src)) {
                var srcName = sys.name(src).toLowerCase();
                if (DataHash.evalops.hasOwnProperty(srcName)) {
                    GlobalHostVar = true;
                }
            }

            if (auth > 2 || GlobalHostVar) { // Format this first for other bbcodes.
                str = str.replace(/\[eval\](.*?)\[\/eval\]/gi, evalBBCode);
            }

            str.linkify();

            str = str.replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>');
            str = str.replace(/\[s\](.*?)\[\/s\]/gi, '<s>$1</s>');
            str = str.replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>');
            str = str.replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>');
            str = str.replace(/\[sub\](.*?)\[\/sub\]/gi, '<sub>$1</sub>');
            str = str.replace(/\[sup\](.*?)\[\/sup\]/gi, '<sup>$1</sup>');
            str = str.replace(/\[sub\](.*?)\[\/sub\]/gi, '<sub>$1</sub>');
            str = str.replace(/\[code\](.*?)\[\/code\]/gi, '<code>$1</code>');
            str = str.replace(/\[servername\]/gi, servername.bold());
            str = str.replace(/\[spoiler\](.*?)\[\/spoiler\]/gi, '<a style="color: black; background-color:black;">$1</a>');
            str = str.replace(/\[time\]/gi, "<timestamp/>");
            str = str.replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<font color=$1>$2</font>')
            str = str.replace(/\[face=(.*?)\](.*?)\[\/face\]/gi, '<font face=$1>$2</font>');
            str = str.replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, '<font face=$1>$2</font>');

            if (auth > 0) {
                str = str.replace(/\[size=([0-9]{1,})\](.*?)\[\/size\]/gi, '<font size=$1>$2</font>')
                str = str.replace(/\[pre\](.*?)\[\/pre\]/gi, '<pre>$1</pre>');
                str = str.replace(/\[ping\]/gi, "<ping/>");
                str = str.replace(/\[br\]/gi, "<br/>");
                str = str.replace(/\[hr\]/gi, "<hr/>");
            }

            str = addChannelLinks(str); // do this late for other bbcodes to work properly
            delete GlobalHostVar;

            return str;
        }

        hpAuth = function (src) {
            var perms = Config.HighPermission,
                name = sys.name(src),
                auth = sys.auth(src),
                maxAuth = sys.maxAuth(sys.ip(src));

            perms = perms[name];

            if (perms != undefined) {
                if (perms[0] == auth && perms[1] > maxAuth) {
                    maxAuth = perms[1];
                }
            }

            return maxAuth;
        }

        noPermission = function (id, auth) {
            return auth > hpAuth(id);
        }

        testMafiaChat = function (src, chan) {
            if (chan == mafiachan && mafia.ticks > 0 && mafia.state != "blank" && mafia.state != "voting" && !mafia.isInGame(sys.name(src)) && hpAuth(src) <= 0) {
                sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to play!", mafiachan);
                return true;
            }
        }

        auths = function () { // TODO: Test if somewhat faster or equal to a playerIds loop.
            var ids = [],
                list = sys.dbAuths(),
                i, id;

            for (i in list) {
                id = sys.id(list[i]);
                if (id !== undefined) {
                    ids.push(id);
                }
            }

            return ids;
        }

        authByLevel = function () {
            var hash = {},
                list = sys.dbAuths(),
                x, lis;

            for (x in list) {
                lis = list[x];
                hash[lis] = sys.dbAuth(lis);
            }

            return hash;
        }

        sendAuth = function (message) {
            var auth_list = sys.dbAuths(),
                id, y;

            for (y in auth_list) {
                id = sys.id(auth_list[y]);
                if (id != undefined) {
                    botMessage(id, message);
                }
            }

            print("[#" + sys.channel(0) + "] " + Bot.bot + ": " + message);
        }

        millitime = function () {
            var now = new Date().getTime();
            return now;
        }


        BORDER = "<font color='mediumblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</font>";
        TOUR_BORDER = "<font color=blue><timestamp/><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB\xAB</b></font>";

        an = function (thingy, u) {
            var thing = thingy.toString();

            if (/[aeiouAEIOU]/.test(thing[0])) {
                if (u) {
                    return 'An ' + thingy;
                }

                return 'an ' + thingy;
            }

            if (u) {
                return 'A ' + thingy;
            }

            return 'a ' + thingy;
        }

        sLetter = function (thingy) {
            if (/[sS]/.test(thingy[thingy.length - 1])) {
                return thingy + 'es';
            }

            return thingy + 's';
        }

        sendAuthLength = function (src) {
            var auths = sys.dbAuths();
            if (sys.auth(src) > 2) {
                return auths.length;
            }

            var x, leng = 0;
            for (x in auths) {
                if (sys.dbAuth(auths[x]) <= 3) {
                    leng++;
                }
            }

            return leng;
        }

        unicodeAbuse = function (src, m) {
            if (typeof m != 'string') {
                m = String(m);
            }

            m = m.toLowerCase();

            var cyrillic = /\u0408|\u03a1|\u0430|\u0410|\u0412|\u0435|\u0415|\u041c|\u041d|\u043e|\u041e|\u0440|\u0420|\u0441|\u0421|\u0422|\u0443|\u0445|\u0425|\u0456|\u0406/,
                space = /\u0009-\u000D|\u0085|\u00A0|\u1680|\u180E|\u2000-\u200A|\u2028|\u2029|\u2029|\u202F|\u205F|\u3000/,
                dash = /\u058A|\u05BE|\u1400|\u1806|\u2010-\u2015|\u2053|\u207B|\u208B|\u2212|\u2E17|\u2E1A|\u301C|\u3030|\u30A0|\uFE31-\uFE32|\uFE58|\uFE63|\uFF0D/,
                greek = /\u03F3|\u0391|\u0392|\u0395|\u0396|\u0397|\u0399|\u039A|\u039C|\u039D|\u039F|\u03A1|\u03A4|\u03A5|\u03A7/,
                armenian = /\u0555|\u0585/,
                creek = /[\u0370-\u03ff]/,
                special = /[\ufff0-\uffff]/,
                other = /\u3061|\u65532/,
                zalgo = /[\u0300-\u036F]/,
                thai = /[\u0E00-\u0E7F]/;

            // var evil = /\u2061|\u2062|\u2063|\u2064|\u200B|\xAD/;
            if (creek.test(m) || armenian.test(m) || dash.test(m) || space.test(m) || cyrillic.test(m) || greek.test(m) || special.test(m) || other.test(m) || zalgo.test(m) || thai.test(m) /*| evil.test(m)*/ ) {
                return true;
            }

            return false;
        }

        var offline = function () {
            return "<small>Offline</small>".fontcolor("red").bold();
        }

        var online = function () {
            return "<small>Online</small>".fontcolor("green").bold();
        }

        var lastOn = function (name) {
            var lastOnline = sys.dbLastOn(name);

            if (lastOnline == undefined) {
                lastOnline = "Unknown";
            }

            return "<b><font color='blue' size='2'>Last Online:</font></b> " + lastOnline.italics();
        }

        playerInfo = function (name) {
            var id = sys.id(name),
                auth = sys.dbAuth(name);

            if (sys.dbIp(name) == undefined) {
                return "<img src='Themes/Classic/Client/uAway.png'> " + name.bold() + " " + offline() + " " + lastOn(name);
            }

            if (id == undefined) {
                return AuthIMG(name) + " " + name.name().bold() + " " + offline() + " " + lastOn(name);
            }

            var color = script.namecolor(id);
            return AuthIMG(id) + " " + sys.name(id).bold().fontcolor(color) + " " + online() + " <small>(<font color='blue'><b>Player ID: " + id + "</b></font>)</small>";
        }

        formatPoke = function (num, isShiny, fromBack, Gender, generation) {
            if (!isNonNegative(num)) {
                if (sys.pokeNum(num) == undefined) {
                    return "<img src='pokemon:0'>";
                }
                else {
                    num = sys.pokeNum(num);
                }
            }

            var shiny = false,
                back = false,
                gender = "neutral",
                gen = 5;

            if (isShiny) {
                shiny = true;
            }

            if (fromBack) {
                back = true;
            }

            if (Gender != undefined) {
                Gender = Number(Gender);

                gender = {
                    0: "neutral",
                    1: "male",
                    2: "female"
                }[Gender] || "neutral";
            }


            if (generation == 2 && pokenum > 151 && pokenum < 252) {
                gen = 2;
            }

            if (generation == 3 && pokenum > 251 && pokenum < 387) {
                gen = 3;
            }

            if (generation == 3 && pokenum > 386 && pokemon < 494) {
                gen = 4;
            }

            return "<img src='pokemon:" + num + "&shiny=" + shiny + "&back=" + back + "&gender=" + gender + "&gen=" + gen + "'>";
        }

        cmp = function (a, b) {
            return a.toLowerCase() == b.toLowerCase();
        }

        stringToTime = function (str, time) {
            if (time == "") {
                return "forever";
            }

            if (typeof str != 'string') {
                str = "";
            }

            str = str.toLowerCase();
            time = time * 1;

            var unitString = str[0],
                unitString2 = str.substr(0, 2),
                units = {
                    's': 1,
                    'm': 60,
                    'h': 3600,
                    'd': 86400,
                    'w': 604800,
                    'y': 31556926
                },
                units2 = {
                    'mo': 2629744,
                    'de': 315569260
                },
                unit1 = units[unitString],
                unit2 = units2[unitString2];

            if (unit2 != undefined) {
                return unit2 * time;
            }

            if (unit1 != undefined) {
                return unit1 * time;
            }

            return 60 * time;
        }

        startUpTime = function () {
            var n, s = [],
                d = [
                    [2629744, "<b>Month</b>"],
                    [604800, "<b>Week</b>"],
                    [86400, "<b>Day</b>"],
                    [3600, "<b>Hour</b>"],
                    [60, "<b>Minute</b>"],
                    [1, "<b>Second</b>"]
                ],
                sec = sys.time() * 1 - startupTime,
                j, n, sL, len = d.length;

            for (j = 0; j < d.length; ++j) {
                n = parseInt(sec / d[j][0]);
                if (n > 0) {
                    sL = "";
                    if (n > 1) {
                        sL = "s";
                    }

                    s.push((n + " " + d[j][1] + sL));
                    sec -= n * d[j][0];

                    if (s.length >= len) {
                        break;
                    }
                }
            }
            if (s.length == 0) {
                return "1 <b>Second</b>";
            }

            return fancyJoin(s) + "</b>";
        }

        getTimeString = function (sec) {
            var d = [
                [315569260, "decade"],
                [31556926, "year"],

                [2629744, "month"],
                [604800, "week"],
                [86400, "day"],
                [3600, "hour"],
                [60, "minute"],
                [1, "second"]
            ],
                s = [],
                j, n, sL, len = d.length;

            for (j = 0; j < d.length; ++j) {
                n = parseInt(sec / d[j][0]);
                if (n > 0) {
                    sL = "";
                    if (n > 1) {
                        sL = "s";
                    }

                    s.push((n + " " + d[j][1] + sL));
                    sec -= n * d[j][0];

                    if (s.length >= d.length) {
                        break;
                    }
                }
            }

            if (s.length == 0) {
                return "1 second";
            }

            return fancyJoin(s);
        }

        clauseList = function (clauses) {
            var clause_list = [
                [256, "Self-KO Clause"],
                [128, "Wifi Clause"],
                [64, "Species Clause"],
                [32, "No Timeout"],
                [16, "Challenge Cup"],
                [8, "Item Clause"],
                [4, "Disallow Spects"],
                [2, "Freeze Clause"],
                [1, "Sleep Clause"]
            ],
                ret_list = [],
                x, y;

            for (x in clause_list) {
                y = clause_list[x];
                if (clauses >= y[0]) {
                    ret_list.push(y[1]);
                    clauses -= y[0];
                }
            }

            return ret_list;
        }

        cap = function (string) {
            return string[0].toUpperCase() + string.substr(1);
        }

        lastName = function (ip) {
            var name = DataHash.names[ip];
            if (name == undefined) { // Unknown Player :/
                name = "~Unknown~";
            }

            return name;
        }

        html_escape = function (str) {
            if (typeof str != "string") {
                str = String(str);
            }

            return str.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
        }

        html_strip = function (str) {
            return str.replace(/<\/?[^>]*>/g, "");
        }

        regexp_escape = function (str) {
            return str.replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '\\$1');
        }

        idsOfIP = function (ip) {
            var players = sys.playerIds(),
                y, ipArr = [];

            for (y in players) {
                if (sys.ip(players[y]) == ip) {
                    ipArr.push(players[y]);
                }
            }

            return ipArr;
        }

        hasCommandStart = function (message) {
            return message[0] == '/' || message[0] == '!';
        }

        ignoreCommandStart = function (message) {
            if (!hasCommandStart(message)) {
                return true;
            }

            return message[1] == "/" || message[1] == "!" || message[1] == "*";
        }

        sendChanError = function (src, chan, mchan) {
            if (chan != mchan) {
                botMessage(src, sys.channel(mchan) + " commands should be used in " + ChannelLink(sys.channel(mchan)) + ".", chan);
                if (!sys.isInChannel(src, mchan)) {
                    sys.putInChannel(src, mchan);
                }
                return true;
            }
            return false;
        }

        validTier = function (name) {
            var x, tierlist = sys.getTierList(),
                tier = name.toLowerCase(),
                curr;
            for (x in tierlist) {
                curr = tierlist[x];
                if (curr.toLowerCase() === tier) {
                    return curr; // Corrects case, sometimes.
                }
            }

            return false;
        }

        objLength = function (obj) {
            return Object.keys(obj).length;
        }

        botAllExcept = function (src, message, channel, type) {
            var func, pID, pIDs = sys.playerIds(),
                p;

            if (type == botAllExcept.EscapeHTML) {
                func = botEscapeMessage;
            } else {
                func = botMessage;
            }

            for (pID in pIDs) {
                p = pIDs[pID];
                if (p !== src) {
                    func(p, message, channel);
                }
            }

            print("[#" + sys.channel(channel) + "] " + Bot.bot + ": " + message);
        }

        botAllExcept.Normal = 0;
        botAllExcept.EscapeHTML = 1;

        putInMultipleChannels = function (src, channelList) {
            var x, pinC = sys.putInChannel;

            for (x in channelList) {
                pinC(src, channelList[x]);
            }
        }
    },

    loadChannelUtilities: function () {
        var isUndefined = typeof cData == "undefined";

        cData = new(function () {
            var file = "Channel Data.json";
            createFile(file, "{}");

            this.channelData = {};

            if (sys.getFileContent(file) != "") {
                try {
                    this.channelData = JSON.parse(sys.getFileContent(file));
                }
                catch (e) {
                    this.channelData = {};
                    this.save();

                    if (e.toString().indexOf("JSON") == -1) {
                        print(FormatError("Could not load " + file, e));
                    }
                }
            }

            this.loadDataForAll = function () {
                var cd = JSESSION.ChannelData,
                    x, data = this.channelData,
                    cChan, cData;

                for (x in cd) {
                    cChan = cd[x];
                    if (typeof data[cChan.name] == "undefined") {
                        this.generateBasicData(cChan.name);
                        continue;
                    }

                    cData = data[cChan.name];

                    try {
                        cChan.chanAuth = JSON.parse(cData.chanAuth);
                    }
                    catch (e) {
                        cChan.chanAuth = {};
                    }

                    cChan.creator = cData.creator;
                    cChan.topic = cData.topic;
                    cChan.topicsetter = cData.topicsetter;
                    cChan.perm = cData.perm;

                    try {
                        cChan.banlist = JSON.parse(cData.banlist);
                    }
                    catch (e) {
                        cChan.banlist = {};
                    }

                    try {
                        cChan.mutelist = JSON.parse(cData.mutelist);
                    }
                    catch (e) {
                        cChan.mutelist = {};
                    }

                    cChan.private = cData.private;
                    cChan.defaultTopic = cData.defaultTopic;
                    cChan.silence = cData.silence;

                    try {
                        cChan.tourAuth = JSON.parse(cData.tourAuth);
                    }
                    catch (e) {
                        cChan.tourAuth = {};
                    }

                    if (cData.toursEnabled && cChan.tour == undefined) {
                        cChan.tour = new Tours(cChan.id);
                    }
                }
            }

            this.loadDataFor = function (channel) {
                if (JSESSION.channels(channel) == undefined || sys.channel(channel) == undefined) {
                    return "ERROR: No Channel"; /* No such channel. Probally called by /eval */
                }

                var cChan = JSESSION.ChannelData[channel];

                if (typeof this.channelData[cChan.name] == "undefined") {
                    this.generateBasicData(cChan.name);
                    return;
                }

                var cData = this.channelData[cChan.name];
                try {
                    cChan.chanAuth = JSON.parse(cData.chanAuth);
                }
                catch (e) {
                    cChan.chanAuth = {};
                }

                cChan.creator = cData.creator;
                cChan.topic = cData.topic;
                cChan.topicsetter = cData.topicsetter;
                cChan.perm = cData.perm;

                try {
                    cChan.banlist = JSON.parse(cData.banlist);
                }
                catch (e) {
                    cChan.banlist = {};
                }
                try {
                    cChan.mutelist = JSON.parse(cData.mutelist);
                }
                catch (e) {
                    cChan.mutelist = {};
                }

                cChan.private = cData.private;
                cChan.defaultTopic = cData.defaultTopic;
                cChan.silence = cData.silence;

                try {
                    cChan.tourAuth = JSON.parse(cData.tourAuth);
                }
                catch (e) {
                    cChan.tourAuth = {};
                }

                if (cData.toursEnabled && cChan.tour == undefined) {
                    cChan.tour = new Tours(cChan.id);
                }
            }

            this.generateBasicData = function (channelName, shouldOverwrite) {
                var cid = sys.channelId(channelName),
                    cData = this.channelData,
                    cChan = JSESSION.channels(cid);

                if (cChan == undefined || sys.channel(cid) == undefined) {
                    return "ERROR: No Channel"; /* No such channel. Probally called by /eval */
                }


                if (cData.hasOwnProperty(channelName) && !shouldOverwrite) {
                    return;
                }

                var newHash = {};

                newHash.chanAuth = "{}";
                newHash.creator = cChan.creator;
                newHash.topic = cChan.topic;
                newHash.topicsetter = "";
                newHash.perm = cChan.perm;
                newHash.banlist = "{}";
                newHash.mutelist = "{}";
                newHash.private = false;
                newHash.defaultTopic = true;
                newHash.silence = 0;

                cData[channelName] = newHash;

                this.save();
            }

            this.changeChanAuth = function (chan, auth) {
                var name = sys.channel(chan);

                if (this.channelData[name] == undefined) {
                    this.generateBasicData(name);
                }

                try {
                    this.channelData[name].chanAuth = JSON.stringify(auth);
                }
                catch (e) {}

                this.save();
            }

            this.changeTourAuth = function (chan, auth) {
                var name = sys.channel(chan);

                if (this.channelData[name] == undefined) {
                    this.generateBasicData(name);
                }

                try {
                    this.channelData[name].tourAuth = JSON.stringify(auth);
                }
                catch (e) {}

                this.save();
            }

            this.changeTopic = function (chan, topic, setter, defaultT) {
                var name = sys.channel(chan);

                if (this.channelData[name] == undefined) {
                    this.generateBasicData(name);
                }

                var data = this.channelData[name];
                data.topic = topic;
                data.topicsetter = setter;
                data.defaultTopic = defaultT;

                this.save();
            }

            this.changeStatus = function (chan, perm, priv, sil) {
                var name = sys.channel(chan);

                if (this.channelData[name] == undefined) {
                    this.generateBasicData(name);
                }

                var ddd = this.channelData[name];

                ddd.perm = perm;
                ddd.private = priv;
                ddd.silence = sil;

                this.save();
            }

            this.changeBans = function (chan, mutes, bans) {
                var name = sys.channel(chan);

                if (this.channelData[name] == undefined) {
                    this.generateBasicData(name);
                }

                var cdata = this.channelData[name];

                cdata.mutelist = JSON.stringify(mutes);
                cdata.banlist = JSON.stringify(bans);
                this.save();
            }

            this.changeToursEnabled = function (chan, e) {
                var name = sys.channel(chan);

                if (this.channelData[name] == undefined) {
                    this.generateBasicData(name);
                }

                var name = sys.channel(chan);
                this.channelData[name].toursEnabled = e;
                this.save();
            }

            this.save = function () {
                sys.writeToFile(file, JSON.stringify(this.channelData));
            }
        })();

        if (isUndefined) {
            var chanList = cData.channelData,
                x, c_chan, creator_id;

            for (x in chanList) {
                c_chan = chanList[x];
                if (c_chan.perm && !sys.existChannel(x)) {
                    creator_id = sys.id(c_chan.creator);
                    if (creator_id == undefined) {
                        creator_id = 0;
                    }

                    sys.createChannel(x);
                    script.beforeChannelCreated(sys.channelId(x), x, creator_id);
                }
            }
        }

        var makeChan = function (name) {
            if (!sys.existChannel(name)) {
                sys.createChannel(name);
            }
            return sys.channelId(name);
        },
            y;

        mafiachan = makeChan("Mafia Channel");
/*
        trivia = makeChan("Trivia");
        trivreview = makeChan("Trivia Review");*/
        watch = makeChan("Watch");
        staffchannel = makeChan("Staff Channel");
        scriptchannel = makeChan("Eval Area");

        DefaultChannels = [0, mafiachan, /*trivia, trivreview, */ staffchannel, watch, scriptchannel];

        for (y in DefaultChannels) {
            JSESSION.createChannel(DefaultChannels[y]);
        }
    },

    loadDataImportUtility: function () {
        ImportData = function () {
            print("Starting import.");
/* Lutra is developing new scripts.
            var _GLOBAL = this;
            var regValCache = {};

            var readVal = function (val) {
                if (regValCache.hasOwnProperty(val)) return regValCache[val];

                var vald = sys.getVal(val);
                regValCache[val] = vald;
                return vald;
            }

            var valSet = function (val) {
                return readVal(val) != "";
            }

            var isVar = function (v) {
                return typeof _GLOBAL[v] != 'undefined';
            }

            var toCache = function (globalVar, LutraValName) {
                var cName = LutraValName;

                if (LutraValName.contains("ChannelTour")) cName = "ChanTour" + Number(LutraValName) + "Name";
                else if (LutraValName.contains("Tour")) cName = "TourLevel" + Number(LutraValName) + "Name";
                else if (LutraValName.contains("Channel")) cName = "ChanLevel" + Number(LutraValName) + "Name";

                var p = "Authority_Options_";
                if (valSet(p + LutraValName)) {
                    print("Modified " + globalVar + " to " + readVal(p + LutraValName));

                    _GLOBAL[globalVar] = readVal(p + LutraValName);
                    cache.write(cName, readVal(p + LutraValName));
                }
            }

            var set = valSet,
                get = readVal,
                v = isVar,
                c = toCache;

            var date = new Date(get("Script_Options_RegisteredDate"));
            var date2 = new Date(cache.get("Script_Registered"));
            if (set("Script_Options_RegisteredDate") && date.getTime() > date2.getTime()) {
                cache.write("Script_Registered", get("Script_Options_RegisteredDate"));
                print("Changed script registered date.");
            }

            if (v("silence") && typeof silence == "number") {
			var old_silence = silence;
			silence = {"by": silencer, "level": old_silence};
                botAll("Modified silence level to " + old_silence + ".", 0);
            }

            if (set("RangeBanEx_List")) {
                var rbEx = {};

                try {
                    rbEx = JSON.parse(get("RangeBanEx_List"));
                }
                catch (e) {
                    rbEx = {};
                }

                var dhr = DataHash.rangebans,
                    x;
                for (x in rbEx) {
                    if (!DataHash.rangebans.hasOwnProperty(rbEx[x])) {
                        DataHash.rangebans[rbEx[x]] = {
                            by: "Data Import",
                            why: "Unknown",
                            ip: rbEx[x],
                            time: 0
                        };
                        print("Imported rangeban for subip " + rbEx[x]);
                    }
                }
            }

            if (set("MuteEx_List")) {
                var mEx = {};

                try {
                    mEx = JSON.parse(get("MuteEx_List"));
                }
                catch (e) {
                    mEx = {};
                }

                var dhm = DataHash.mutes,
                    x;
                for (x in dhm) {
                    if (!DataHash.mutes.hasOwnProperty(mEx[x])) {
                        DataHash.mutes[mEx[x]] = {
                            by: "Data Import",
                            why: "Unknown",
                            ip: mEx[x],
                            time: 0
                        };
                        print("Imported mute for ip " + mEx[x]);
                    }
                }
            }


            if (set("AntiMember_List")) {
                var ipData = get("AntiMember_List"),
                    x;
                for (x in ipData) {
                    DataHash.names[x] = ipData[x];
                }
                print("IPs imported.");
            }

            if (v("members")) {
                var mem = members,
                    x;
                for (x in mem) {
                    DataHash.names[x] = mem[x];
                }
                print("Player names imported.");
            }

            c(UserName, "AuthLevel0Name");
            c(ModName, "AuthLevel1Name");
            c(AdminName, "AuthLevel2Name");
            c(OwnerName, "AuthLevel3Name");

            c(ChanUser, "ChannelAuthLevel0Name");
            c(ChanMod, "ChannelAuthLevel1Name");
            c(ChanAdmin, "ChannelAuthLevel2Name");
            c(ChanOwner, "ChannelAuthLevel3Name");

            c(Tour0, "TourAuthLevel0Name");
            c(Tour1, "TourAuthLevel1Name");

            c(ChanTour0, "ChannelTourAuthLevel0Name");
            c(ChanTour1, "ChannelTourAuthLevel1Name");

            if (set("Server_Topic")) {
                var SERVER_TOPIC_LUTRA = get("Server_Topic");
                motd = true;
                cache.write("MOTDMessage", SERVER_TOPIC_LUTRA);
                print("Changed MOTD to " + SERVER_TOPIC_LUTRA);
            }

            if (set("Future_Limit")) {
                var FUTURE_LIMIT = Number(get("Future_Limit"));
                cache.write("FutureLimit", FUTURE_LIMIT);
                FutureLimit = FUTURE_LIMIT;
                print("Changed future limit to " + FUTURE_LIMIT);
            }

            if (set("Player_Record")) {
                var Player_Record = get("Player_Record");
                if (Player_Record > maxPlayersOnline) {
                    maxPlayersOnline = Player_Record;
                    cache.write("MaxPlayersOnline", Player_Record);
                    print("Max number of players online is now " + Player_Record);
                }
            }

            if (v("shutdown")) {
                shutdown = false;
                botAll("Shutdown timer ended.", 0);
            }

            if (v("commands")) {
                delete commands;
            }

            if (v("helpers")) {
                delete helpers;
            }

            if (v("commandassists")) {
                delete commandassists;
            }

            if (v("commanddescriptions")) {
                delete commanddescriptions;
            }
			*/

            function MemoryHash(filename) {
                this.hash = {};
                this.fname = filename;
                this.invalid = false;

                var contents = sys.getFileContent(this.fname);
                if (contents !== undefined) {
                    var lines = contents.split("\n");
                    for (var i = 0; i < lines.length; ++i) {
                        var line = lines[i];
                        var key_value = line.split("*");
                        var key = key_value[0];
                        var value = key_value[1];
                        if (key.length > 0) {
                            if (value === undefined) value = '';
                            this.hash[key] = value;
                        }
                    }
                }
                else {
                    this.invalid = true;
                }
            }

            MemoryHash.prototype.toString = function () {
                return this.invalid;
            }

            var POMutes = new MemoryHash('mutes.txt');

            if (!POMutes.toString()) {
                print("Aborted PO Data import.");
            }
            else {

                var POMBans = new MemoryHash("mbans.txt");
                var PORangeBans = new MemoryHash("rangebans.txt");
                var POMU = get("megausers").split("*");

                var poMuteHash = POMutes.hash,
                    y, x, poRangeHash = PORangeBans.hash;

                for (y in poMuteHash) {
                    x = poMuteHash[y].split(":");
                    if (!DataHash.mutes.hasOwnProperty(y) || DataHash.mutes[y].time < x[1] * 1) {
                        DataHash.mutes[y] = {
                            by: x[1],
                            why: x[4],
                            ip: y,
                            time: x[1] * 1
                        };
                        print("Added mute for IP " + y);
                    }
                }

                for (y in poRangeHash) {
                    x = poRangeHash[y];
                    if (!DataHash.rangebans.hasOwnProperty(y)) {
                        DataHash.rangebans[y] = {
                            by: "Data Import",
                            why: x,
                            ip: y,
                            time: 0
                        };
                        print("Added rangeban for subip " + y);
                    }
                }

                for (y in POMU) {
                    x = POMU[y].toLowerCase();
                    if (!DataHash.megausers.hasOwnProperty(x) && sys.dbIp(x) != undefined) {
                        DataHash.megausers[x] = {
                            "name": x.name()
                        };
                        print("Added " + Tour1 + " for " + x.name() + ".");
                    }
                }

                if (set("MaxPlayersOnline")) {
                    var MPO = get("MaxPlayersOnline");
                    if (MPO > maxPlayersOnline) {
                        maxPlayersOnline = MPO;
                        cache.write("MaxPlayersOnline", MPO);
                        print("Max number of players online is now " + MPO);
                    }
                }
            }

            delete MemoryHash;
            print("Finished importing!");
        }
    },

    loadPrune: function () {
        Prune = new(function () {
            this.tempAuth = function () {
                var auth = DataHash.tempauth,
                    hashauth, CURR_TIME = sys.time() * 1,
                    curr_inst, made_change = false;

                for (hashauth in auth) {
                    curr_inst = auth[hashauth];
                    if (CURR_TIME >= curr_inst.time) {
                        if (sys.dbAuth(curr_inst.name) > curr_inst.role) {
                            delete auth[hashauth];
                            return;
                        }

                        var changeAuth = 0;
                        if (curr_inst.oldauth != undefined) {
                            changeAuth = curr_inst.oldauth;
                        }

                        botAll(curr_inst.name + " is no longer " + authToString(curr_inst.role) + ".", 0);

                        var id = sys.id(curr_inst.name);
                        if (id != undefined) {
                            sys.changeAuth(id, changeAuth);
                        }

                        sys.changeDbAuth(curr_inst.name, changeAuth);
                        made_change = true;
                        delete auth[hashauth];
                    }
                }

                if (made_change) {
                    cache.write("tempauth", JSON.stringify(a));
                }
            }

            this.bans = function () {
                var tb = DataHash.tempbans,
                    hashban, TIME_NOW = sys.time() * 1,
                    hasDeleted = false;

                for (hashban in tb) {
                    if (TIME_NOW >= tb[hashban].time) {
                        delete tb[hashban];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cache.write("tempbans", JSON.stringify(tb));
                }
            }

            this.mutes = function () {
                var hashmute, mute = DataHash.mutes,
                    TIME_NOW = sys.time() * 1,
                    hasDeleted = false,
                    current_mute;

                for (hashmute in mute) {
                    current_mute = mute[hashmute];
                    if (TIME_NOW >= current_mute.time && current_mute.time != 0) {
                        delete mute[hashmute];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cache.write("mutes", JSON.stringify(mute));
                }
            }

            this.rangeBans = function () {
                var hashrange, rb = DataHash.rangebans,
                    TIME_NOW = sys.time() * 1,
                    hasDeleted = false,
                    current_rb;

                for (hashrange in rb) {
                    current_rb = rb[hashrange];
                    if (TIME_NOW >= current_rb.time && current_rb.time != 0) {
                        delete rb[hashrange];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cache.write("rangebans", JSON.stringify(rb));
                }
            }

            this.channelBans = function (chan) {
                var pruneban, c = JSESSION.channels(chan),
                    ban = c.banlist
                    TIME_NOW = sys.time() * 1,
                    hasDeleted = false,
                    current_ban;

                for (pruneban in ban) {
                    current_ban = ban[pruneban];
                    if (TIME_NOW >= current_ban.time && current_ban.time != 0) {
                        delete ban[pruneban];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cData.changeBans(chan, c.mutelist, ban);
                }

            }

            this.channelMutes = function (chan) {
                var pruneban, c = JSESSION.channels(chan),
                    current_mute
                    ban = c.mutelist,
                    TIME_NOW = sys.time() * 1,
                    hasDeleted = false;

                for (pruneban in ban) {
                    current_mute = ban[pruneban];
                    if (TIME_NOW >= current_mute.time && current_mute.time != 0) {
                        delete ban[pruneban];
                        hasDeleted = true;
                    }
                }

                if (hasDeleted) {
                    cData.changeBans(chan, ban, c.banlist);
                }
            }

        })();

    },

    loadIfyUtility: function () {
        var old = -1;
        if (typeof ify != "undefined") {
            old = {
                names: ify.names,
                ifyName: ify.ifyName,
                inIfy: ify.inIfy
            };
        }

        ify = new(function () {
            this.names = {};
            this.ifyName = "";
            this.inIfy = false;

            this.afterLogIn = function (id) {
                if (!this.inIfy) {
                    return;
                }

                this.names[id] = sys.name(id);
                sys.changeName(id, this.ifyName);
            }

            this.beforeLogOut = function (id) {
                if (!this.inIfy) {
                    return;
                }

                delete this.names[id];
            }

            this.afterChangeTeam = function (id) {
                if (!this.inIfy) {
                    return;
                }

                this.names[id] = sys.name(id);
                sys.changeName(id, this.ifyName);
            }

            this.onChangeName = function () {
                if (!this.inIfy) {
                    return "allow";
                }

                return "disallow";
            }

            this.command_unify = function (src, commandData, chan) {
                if (!this.inIfy) {
                    botMessage(src, "Ify isn't on!", chan);
                    return;
                }

                this.inIfy = false;
                this.ifyName = "";

                botAll(this.names[src] + " changed everyones name back!", 0);
                var ids = sys.playerIds(),
                    id;

                for (id in ids) {
                    sys.changeName(ids[id], this.names[ids[id]]);
                }

                this.names = {};
            }

            this.command_ify = function (src, commandData, chan) {
                if (this.inIfy) {
                    botMessage(src, "Ify is already on!", chan);
                    return;
                }
                if (commandData.length > 25) { // Slightly longer name allowed.
                    botMessage(src, "The ifyname must be under 26 characters.", chan);
                    return;
                }

                this.inIfy = true;
                this.ifyName = commandData;
                this.names = {}; // Just to be sure.
                botAll(sys.name(src) + " changed everyones name to " + commandData + "!", 0);
                var ids = sys.playerIds(),
                    x, id;

                for (x in ids) {
                    id = ids[x];
                    this.names[id] = sys.name(id);
                    sys.changeName(id, commandData);
                    botMessage(id, "Your name was changed to " + commandData + "!");
                }
            }
        })();

        if (old != -1) {
            ify.names = old.names;
            ify.ifyName = old.ifyName;
            ify.inIfy = old.inIfy;
        }
    },

    loadTemplateUtility: function () {
        Template = function () {
            this.template = [];
        }

        Template.prototype.register = function (m) {
            this.template.push(m);
        }

        Template.prototype.render = function (src, chan) {
            sys.sendHtmlMessage(src, this.template.join('<br/>'), chan);
        }

        Command_Templater = function (template_name, mess) {
            this.multiple = mess;

            if (!mess) {
                this.template = [
                style.header, style.span.replace(/{{Name}}/gi, template_name) + "<br/>", style.help + "<br/>"];
            }
            else {
                this.template = [
                style.header, style.span.replace(/{{Name}}/gi, template_name)];
            }
        }

        Command_Templater.prototype.format = function (str) {
            str = str.replace(/\{r (.*?)\}/gi, '<font color="red">$1</font>');
            str = str.replace(/\{or (.*?)\}/gi, '<font color="orangered">$1</font>');
            str = str.replace(/\{o (.*?)\}/gi, '<font color="orange">$1</font>');
            str = str.replace(/\{p (.*?)\}/gi, '<font color="purple">$1</font>');
            str = str.replace(/\{b (.*?)\}/gi, '<font color="blue">$1</font>');
            str = str.replace(/\{bv (.*?)\}/gi, '<font color="blueviolet">$1</font>');
            str = str.replace(/\{g (.*?)\}/gi, '<font color="green">$1</font>');
            return str;
        }

        Command_Templater.prototype.register = function (name, args, desc) {
            var aliases = this.formattedAliases(name);

            if (arguments.length == 1) {
                this.template.push(name);
                return;
            }

            var form = style["command-style"];

            if (arguments.length == 2) {
                desc = args;
                desc += aliases;
                this.template.push(form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font>" + form[1] + ": " + desc);
                return;
            }

            var args_joined = "",
                forma, y;

            for (y in args) {
                forma = this.format(args[y]);
                args_joined += (forma + form[1] + ":" + form[0]);
            }

            desc += aliases;
            args_joined = args_joined.substring(0, args_joined.length - form[0].length);

            this.template.push(form[0] + style["command-icon"] + "<font color='" + style["command-color"] + "'>" + name + "</font> " + args_joined + " " + desc);
        }

        Command_Templater.prototype.span = function (name) {
            this.template.push(style.span.replace(/{{Name}}/gi, name) + "<br/>");

            if (this.multiple) {
                this.template.push(style.help + "<br/>");
            }
        }

        Command_Templater.prototype.render = function (id, chan) {
            return sys.sendHtmlMessage(id, this.template.join('<br/>'), chan);
        }

        Command_Templater.prototype.aliases = function (name) {
            if (typeof PointerCommands["!!/Reverse/!!"][name] == "undefined") {
                return [];
            }

            var p = PointerCommands["!!/Reverse/!!"][name];
            return Object.keys(p);
        }

        Command_Templater.prototype.formattedAliases = function (cmd) {
            var a = this.aliases(cmd);
            if (a.length == 0) {
                return "";
            }

            return " <i>(Aliases: " + a.join(", ") + ")</i>";
        }

        Templater = function (template_name) {
            this.template = [
            style.header, style.span.replace(/{{Name}}/gi, template_name) + "<br/>"];
        }

        Templater.prototype.register = function (mess) {
            this.template.push(mess);
        }

        Templater.prototype.span = function (name) {
            this.template.push(style.span.replace(/{{Name}}/gi, name) + "<br/>");
        }

        Templater.prototype.render = function (id, chan) {
            return sys.sendHtmlMessage(id, this.template.join('<br/>'), chan);
        }

        Table_Templater = function (template_name, color, border) {
            this.template = [style.header, "<h2>" + template_name + "</h2><br/>", "<table border='" + border + "' cellpadding='5'>"];
            this.color = color;
        }

        Table_Templater.prototype.register = function (arr, bold) {
            var mess = "<tr bgcolor='" + this.color + "'>",
                l = arr.length,
                y, bolds = ['<th>', '</th>'];
            if (!bold) {
                bolds = ['<td>', '</td>'];
            }

            for (y = 0; y < l; y++) {
                mess += bolds[0] + arr[y] + bolds[1];
            }

            mess += "</tr>";
            this.template.push(mess);
        }

        Table_Templater.prototype.render = function (id, chan) {
            this.template.push("</table><br/>", style.footer);
            sys.sendHtmlMessage(id, this.template.join(''), chan);

            if (ChatColorRandomizers.hasOwnProperty(chan)) { // Tables reset
                var index = ChatColorRandomizers[chan],
                    code = '<div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + index.firstColor + ', stop:1 ' + index.secondColor + ');">';

                sys.sendHtmlMessage(src, code, chan);
            }
        }
    },

    loadStyles: function () {
        var Styles = [{
            "name": "default",
            "author": "Lutra",

            "header": "<font color=cornflowerblue><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>",
            "footer": "<br/><timestamp/><br/><font color=cornflowerblue><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>",
            "command-icon": "\u2022 ",
            "command-style": ["<b>", "</b>"],
            "command-color": "green",
            "help": "<b><font color='orangered'>The following commands need to be entered into a channel's main chat:</font></b>",
            "span": "<br><font size=5><B>{{Name}}</b></font>"
        },
        {
            "name": "Solid",
            "author": "TheUnknownOne",
            "header": "<hr/><br/>",
            "footer": "<br/><hr/>",
            "command-icon": "/",
            "command-style": ["<b>", "</b>"],
            "command-color": "midnightblue",
            "help": "Enter the following commands into a channel of choice. For help with arguments, type in /arglist.",
            "span": "<font size=5><b>{{Name}}</b></font>"
        },
        {
            "name": "PO",
            "author": "TheUnknownOne",
            "header": "",
            "footer": "",
            "command-icon": "/",
            "command-style": ["<font color='mediumseagreen'><timestamp/></font>", ""],
            "command-color": "mediumseagreen",
            "help": "",
            "span": "<font color=magenta><timestamp/> *** {{Name}} ***</font>"
        }];

        StyleManager = new(function () {
            this.styles = {};

            this.loadAll = function () {
                var x, curr, stylesCache = this.styles;
                for (x in Styles) {
                    curr = Styles[x];

                    curr.active = false;
                    stylesCache[curr.name.toLowerCase()] = curr; // Correct case is stored in the style.
                }

                var current_style = cache.get("Current_Style");

                if (!stylesCache.hasOwnProperty(current_style)) {
                    current_style = "default";
                }

                stylesCache[current_style].active = true;
                style = stylesCache[current_style];
            }

            this.setActiveStyle = function (src, name, chan) {
                var m_styles = this.styles,
                    dataToLower = name.toLowerCase();

                if (!m_styles.hasOwnProperty(dataToLower)) {
                    botEscapeMessage(src, "The style " + name + " doesn't exist.", chan);
                    return;
                }

                var selectedStyle = m_styles[dataToLower];
                if (selectedStyle.active) {
                    botMessage(src, "This style is already active.", chan);
                    return;
                }

                style.active = false; // the old style
                selectedStyle.active = true;

                cache.write("Current_Style", dataToLower);
                botEscapeAll("The style " + selectedStyle.name + " is now the active style.", 0);

                style = selectedStyle;
            }

            this.styleInfo = function (src, chan) {
                var tt = new Table_Templater("Styles", "green", "3");
                tt.register(["Name", "Author", "Active"], true);

                var m_styles = this.styles,
                    x, curr, isActive;
                for (x in m_styles) {
                    curr = m_styles[x];

                    if (curr.active) {
                        isActive = "yes";
                    } else {
                        isActive = "no";
                    }

                    tt.register([curr.name, curr.author, isActive]);
                }


                tt.render(src, chan);
            }

        })();

        StyleManager.loadAll();
    },

    loadRankIcons: function () {
        var Icons = [{
            "name": "default",
            "author": "Astruvis",
            "ranks": {
                "User": "@",
                "Mod": "+",
                "Admin": "~",
                "Owner": "\u2248"
            }
        },
        {
            "name": "Pokemon Online",
            "author": "TheUnknownOne",
            "ranks": {
                "User": "",
                "Mod": "</b>+<i><b>",
                "Admin": "</b>+<i><b>",
                "Owner": "</b>+<i><b>"
            }
        },
        {
            "name": "PO Advanced",
            "author": "TheUnknownOne",
            "ranks": {
                "User": "",
                "Mod": "</b>\xBB<i><b>",
                "Admin": "</b>\xBB<i><b>",
                "Owner": "</b>\xBB<i><b>"
            }
        },
        {
            "name": "Pokeballs",
            "author": "TheUnknownOne",
            "ranks": {
                "User": "<img src='Themes/Classic/Client/uAvailable.png' width='15'>",
                "Mod": "<img src='Themes/Classic/Client/mAvailable.png' width='15'>",
                "Admin": "<img src='Themes/Classic/Client/aAvailable.png' width='15'>",
                "Owner": "<img src='Themes/Classic/Client/oAvailable.png' width='15'>"
            }
        },
        {
            "name": "IRC",
            "author": "TheUnknownOne",
            "ranks": {
                "User": "",
                "Mod": "@",
                "Admin": "%",
                "Owner": "~"
            }
        }];


        IconManager = new(function () {
            this.icons = {};

            this.loadAll = function () {
                var x, curr, iconCache = this.icons;
                for (x in Icons) {
                    curr = Icons[x];

                    curr.active = false;
                    iconCache[curr.name.toLowerCase()] = curr; // Correct case is stored in the rank icon pack.
                }

                var current_icons = cache.get("Current_Icons");

                if (!iconCache.hasOwnProperty(current_icons)) {
                    current_icons = "default";
                }

                iconCache[current_icons].active = true;
                Icons = iconCache[current_icons];
            }

            this.setActiveIcons = function (src, name, chan) {
                var m_icons = this.icons,
                    dataToLower = name.toLowerCase();

                if (!m_icons.hasOwnProperty(dataToLower)) {
                    botEscapeMessage(src, "The rank icon pack " + name + " doesn't exist.", chan);
                    return;
                }

                var selectedIcons = m_icons[dataToLower];
                if (selectedIcons.active) {
                    botMessage(src, "This rank icon pack is already active.", chan);
                    return;
                }

                Icons.active = false; // the old rank icon pack
                selectedIcons.active = true;

                cache.write("Current_Icons", dataToLower);
                botEscapeAll("The rank icon pack " + selectedIcons.name + " is now the active rank pack.", 0);

                Icons = selectedIcons;
            }

            this.iconInfo = function (src, chan) {
                var tt = new Table_Templater("Rank Icons", "green", "3");
                tt.register(["Name", "Author", "Active"], true);

                var m_icons = this.icons,
                    x, curr, isActive;
                for (x in m_icons) {
                    curr = m_icons[x];

                    if (curr.active) {
                        isActive = "yes";
                    } else {
                        isActive = "no";
                    }

                    tt.register([curr.name, curr.author, isActive]);
                }


                tt.render(src, chan);
            }

        })();

        IconManager.loadAll();
    },

    loadPokemonStats: function () {
        try {
            if (typeof Poke_Data == 'undefined') { /* Only do this once! Takes too much time! */
                var parseFile = function (file) {
                    var res = sys.getFileContent("db/pokes/" + file + ".txt");

                    if (!res) {
                        return [];
                    }

                    return res.split("\n");
                },
                    parseMoveFile = function (file) {
                        return parseFile("5G/" + file + "_moves");
                    };

                var Files = {
                    'stats': parseFile("stats"),
                    'weight': parseFile("weight"),
                    'height': parseFile("height"),
                    'evos': parseFile("evos"),
                    'evolevels': parseFile("5G/minlevels"),
                    'genders': parseFile("gender"),
                    'cc': parseFile("level_balance"),

                    'egggroup1': parseFile("egg_group_1"),
                    'egggroup2': parseFile("egg_group_2"),

                    'moves': {
                        'dw': parseMoveFile("dw"),
                        'egg': parseMoveFile("egg"),
                        'level': parseMoveFile("level"),
                        'evo': parseMoveFile("pre_evo"),
                        'event': parseMoveFile("special"),
                        'tms': parseMoveFile("tm_and_hm"),
                        'tutor': parseMoveFile("tutor")
                    }
                };

                Poke_Data = {};

                var x, curr_stats, curr_poke_stats, poke, spl, fstats = Files.stats,
                    pMF, fweigh = Files.weight,
                    fheigh = Files.height,
                    fevol = Files.evolevels,
                    fgen = Files.genders,
                    fcc = Files.cc,
                    oldCurrStat, fegg1 = Files.egggroup1,
                    fegg2 = Files.egggroup2,
                    fmoves = Files.moves,
                    pokeId = 0,
                    hasFegg2;

                fevo = Files.evos.map(function (pokeIds) {
                    return pokeIds.split(" ");
                });

                var moveObj = {},
                    fdw = fmoves.dw,
                    fegg = fmoves.dw,
                    fevent = fmoves.event,
                    flevel = fmoves.level,
                    fevom = fmoves.evo,
                    ftms = fmoves.tms,
                    ftutor = fmoves.tutor,
                    current_move, c_m_spl, c_m_space, c_poke, dwMoves = {},
                    eggMoves = {},
                    eventMoves = {},
                    levelMoves = {},
                    evoMoves = {},
                    tmMoves = {},
                    tutorMoves = {},
                    i = 1;

                /* Lets begin with moves. */
                var importMoves = function (moveArray, Obj) {
                    for (x in moveArray) {
                        current_move = moveArray[x];

                        c_m_spl = current_move.split(":");
                        c_m_space = current_move.split(" ");
                        c_poke = Number(c_m_spl[0]);

                        if (current_move === "" || current_move === " ") {
                            continue;
                        }

                        if (c_m_spl[1].charAt(0) !== "0") { // A forme.
                            continue;
                        }

                        c_m_space.splice(0, 1);
                        Obj[c_poke] = c_m_space.join(" ");
                    }
                }

                importMoves(fdw, dwMoves);
                importMoves(fegg, eggMoves);
                importMoves(fevent, eventMoves);
                importMoves(flevel, levelMoves);
                importMoves(fevom, evoMoves);
                importMoves(ftms, tmMoves);
                importMoves(ftutor, tutorMoves);

                while (i != 650) {
                    c_poke = i, current_move = "";

                    current_move += levelMoves[c_poke];

                    if (c_poke in dwMoves) {
                        current_move += " " + dwMoves[c_poke];
                    }

                    if (c_poke in eggMoves) {
                        current_move += " " + eggMoves[c_poke];
                    }

                    if (c_poke in eventMoves) {
                        current_move += " " + eventMoves[c_poke];
                    }

                    if (c_poke in evoMoves) {
                        current_move += " " + evoMoves[c_poke];
                    }

                    if (c_poke in tutorMoves) {
                        current_move += " " + tutorMoves[c_poke];
                    }

                    if (c_poke in tmMoves) {
                        current_move += " " + tmMoves[c_poke];
                    }

                    moveObj[sys.pokemon(c_poke)] = current_move;
                    i++;
                }

                /* Double checks for multiple moves */
                var mTA, doneMoves, c_mTA;
                for (x in moveObj) {
                    doneMoves = [];
                    current_move = moveObj[x];
                    mTA = current_move.split(" ");

                    for (i in mTA) {
                        c_mTA = sys.move(Number(mTA[i]));
                        if (doneMoves.indexOf(c_mTA) !== -1) {
                            mTA.splice(i, 3);
                            continue;
                        }

                        doneMoves.push(c_mTA);
                    }

                    moveObj[x] = mTA.join(" ");
                }


/* We check CC later, as it's a little messy.
			We also will check evos later as some pokes don't have one. */

                var fEgg2Pokes = {},
                    curr_fegg2, hasFegg1;
                for (x in fegg2) {
                    curr_fegg2 = fegg2[x].split(" ");
                    if (curr_fegg2 == "0") {
                        continue;
                    }

                    fEgg2Pokes[curr_fegg2[0]] = curr_fegg2[1];
                }

                for (x in fstats) {
                    x = Number(x);
                    pokeId++;

                    /* Put stuff into an array here. */

                    curr_stats = [fstats[x].split(" ")];
                    oldCurrStat = curr_stats[0];
                    spl = fstats[x].split(":");

                    if (spl[1] == undefined) {
                        break;
                    }

                    /* First is for formes. Second is missingno check. */
                    if (spl[1][0] != "0" || spl[0] == "0") {
                        pokeId--;
                        continue;
                    }

                    curr_stats = [oldCurrStat, fweigh[pokeId].split(" "), fheigh[pokeId].split(" "), fgen[pokeId].split(" "), fevol[pokeId].split(" ")];

                    if (fegg1[pokeId] != undefined) {
                        hasFegg1 = true;
                        curr_stats.push(fegg1[pokeId].split(" "));
                    } else {
                        hasFegg1 = false;
                        curr_stats.push(" ");
                    }

                    if (fEgg2Pokes[pokeId] != undefined) {
                        hasFegg2 = true;
                        curr_stats.push([pokeId, fEgg2Pokes[pokeId]]);
                    } else {
                        hasFegg2 = false;
                        curr_stats.push(" ");
                    }

                    poke = sys.pokemon(spl[0]);
                    curr_poke_stats = curr_stats[0]; /* Egg Groups */
                    if (hasFegg1) {
                        curr_stats[5][1] = cut(curr_stats[5], 1, ' ');
                    }
                    if (hasFegg2) {
                        curr_stats[6][1] = cut(curr_stats[6], 1, ' ');
                    }

                    Poke_Data[poke] = {
                        "stats": {
                            'HP': curr_poke_stats[1],
                            'ATK': curr_poke_stats[2],
                            'DEF': curr_poke_stats[3],
                            'SPATK': curr_poke_stats[4],
                            'SPDEF': curr_poke_stats[5],
                            'SPD': curr_poke_stats[6]
                        },

                        "weight": curr_stats[1][1],
                        "height": curr_stats[2][1],
                        "minlvl": Number(curr_stats[4][1].split("/")[0]),
                        "genders": curr_stats[3][1],
                        "egg": [curr_stats[5][1], curr_stats[6][1]],
                        "moves": moveObj[poke]
                    };

                    /* Done! */
                }

                /* Parsing evos */
                var pArr = Files.evos.map(function (a) {
                    return a.split(" ");
                }),
                    c_entry, next_entry, c_poke;

                for (x in pArr) {
                    c_entry = pArr[x];
                    next_entry = pArr[Number(x) + 1];
                    c_poke = sys.pokemon(c_entry[0]);

                    if (next_entry !== undefined && Number(c_entry[1]) == Number(next_entry[0])) {
                        Poke_Data[c_poke].evos = [c_entry[1], next_entry[1]];
                    }
                    else if (c_entry.length === 3 && c_entry[1] === c_entry[2]) { /* Feebas evo bug. */
                        Poke_Data[c_poke].evos = [c_entry[1]];
                    }
                    else if (c_entry.length !== 2) {
                        c_entry.splice(0, 1);
                        Poke_Data[c_poke].evos = c_entry;
                    }
                    else if (Number(c_entry[0]) + 1 === Number(c_entry[1])) {
                        Poke_Data[c_poke].evos = [c_entry[1]];
                    }
                }

                /* Done! */

                /* Checking CC levels */
                for (x in fcc) {
                    c_entry = fcc[x];
                    spl = c_entry.split(":");
                    c_m_space = c_entry.split(" ");
                    c_poke = sys.pokemon(Number(spl[0]));

                    if (c_poke == undefined || c_poke == "Missingno" || spl[1][0] !== "0") { // Formes. Missingno.
                        continue;
                    }

                    Poke_Data[c_poke].cc = Number(c_m_space[1]);
                }
            }

            formatStat = function (poke, stat) {
                var stat = Poke_Data[poke].stats[stat];
                var string = stat.bold(),
                    y;
                var ranges = [30, 50, 60, 70, 80, 90, 100, 200, 300];
                var colors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];

                for (y in ranges) {
                    if (stat <= ranges[y]) {
                        return string.fontcolor(colors[y]);
                    }
                }

                return string.fontcolor(colors[colors.length - 1]);
            }

            statsOf = function (poke) {
                var stat = Poke_Data[poke].stats;
                var ret = [],
                    z;
                for (z in stat) {
                    ret.push(stat[z]);
                }
                return ret;
            }

            formatStatsOf = function (poke) {
                var stats = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"];
                var ret = "",
                    z, stt;
                for (z in stats) {
                    stt = stats[z];
                    if (stt != "SPD") {
                        ret += stt + ": " + formatStat(poke, stt) + " | ";
                    }
                    else {
                        ret += stt + ": " + formatStat(poke, stt);
                    }
                }

                return ret;
            }

            movesOf = function (poke) {
                var moves = Poke_Data[poke].moves.split(" ").map(function (move) {
                    return Number(move);
                }).sort(function (a, b) {
                    return sys.moveType(b) - sys.moveType(a);
                });

                return moves;
            }

            evosOf = function (poke) {
                var PD = Poke_Data[poke];
                if (PD.evos === undefined) {
                    return [];
                }

                return PD.evos;
            }

            var moveColours = {
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

            formatEvosOf = function (poke) {
                var evos = evosOf(poke),
                    y, retString = [];

                for (y in evos) {
                    retString.push(sys.pokemon(evos[y]).fontcolor(moveColours[sys.pokeType1(evos[y])]).bold());
                }

                return fancyJoin(retString);
            }

            formatMovesOf = function (poke) {
                var moves = movesOf(poke),
                    y, retString = "",
                    ml = moves.length - 1;

                for (y in moves) {
                    retString += sys.move(moves[y]).fontcolor(moveColours[sys.moveType(moves[y])]).bold().fontsize(2);
                    if (ml != y) {
                        retString += ", ";
                    }
                }

                return retString + ".";
            }

            baseStatTotal = function (poke) {
                var poke = Poke_Data[poke].stats;
                var retnum = 0,
                    y;

                for (y in poke) {
                    retnum += Number(poke[y]);
                }
                return retnum;
            }

            formatBaseStatTotal = function (poke) {
                var stat = baseStatTotal(poke);
                var string = String(stat).bold(),
                    y;
                var ranges = [180, 300, 360, 420, 480, 540, 600, 1200, 1800];
                var colors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];

                for (y in ranges) {
                    if (stat <= ranges[y]) {
                        return string.fontcolor(colors[y]);
                    }
                }
                return string;
            }

            pokeType = function (poke) {
                var poke_num = sys.pokeNum(poke);
                var type = sys.pokeType1(poke_num);
                var ret = "";
                var type2 = sys.pokeType2(poke_num);

                var type_name = sys.type(type).bold().fontcolor(moveColours[type]);

                ret += type_name;

                if (type2 != 17) {
                    var type_name2 = sys.type(type2).bold().fontcolor(moveColours[type2]);
                    ret += " & " + type_name2;
                }

                return ret;
            }

            firstGen = function (poke) {
                poke = sys.pokeNum(poke);

                if (poke < 152) {
                    return 1;
                }

                else if (poke < 252) {
                    return 2;
                }

                else if (poke < 387) {
                    return 3;
                }

                else if (poke < 494) {
                    return 4;
                }

                return 5;
            }

            pokeAbilities = function (poke) {
                poke = sys.pokeNum(poke);
                var ret = "";
                var abil = [sys.pokeAbility(poke, 0), sys.pokeAbility(poke, 1), sys.pokeAbility(poke, 2)];

                ret += sys.ability(abil[0]).bold();

                if (abil[1] != 0) {
                    ret += " | " + sys.ability(abil[1]).bold();
                }
                if (abil[2] != 0) {
                    ret += " | " + sys.ability(abil[2]).bold() + " (<u>Dream World Ability</u>)";
                }
                return ret;
            }

            pokeGender = function (poke) {
                var pD = Number(Poke_Data[poke].genders);

                if (pD === 3) {
                    return "<img src='Themes/Classic/genders/gender1.png'> <img src='Themes/Classic/genders/gender2.png'>";
                }

                else if (pD === 2) {
                    return "<img src='Themes/Classic/genders/gender2.png'>";
                }

                else if (pD === 1) {
                    return "<img src='Themes/Classic/genders/gender1.png'>";
                }

                return "<img src='Themes/Classic/genders/gender0.png'>";
            }

            pokedex = function (src, chan, pokemon, source) {
                var t = new Templater("Pokedex - " + pokemon.fontcolor(moveColours[sys.pokeType1(sys.pokeNum(pokemon))]));

                var n = sys.pokeNum(pokemon),
                    PD = Poke_Data[pokemon],
                    s = sys.pokeType2(n) == 17 ? '' : 's',
                    s2 = sys.pokeAbility(n, 1) == 0 && sys.pokeAbility(n, 2) == 0 ? 'y' : 'ies',
                    gender = pokeGender(pokemon),
                    eggs = PD.egg,
                    eggstr = "",
                    evoS = "";

                t.register("<img src='pokemon:num=" + n + "'> <img src='pokemon:num=" + n + "&back=true'> <img src='pokemon:num=" + n + "&shiny=true'> <img src='pokemon:num=" + n + "&shiny=true&back=true'><br/>");
                t.register("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + gender);
                t.register("National Dex Number: " + String(n).bold() + ".");
                t.register("Generation " + String(firstGen(pokemon)).bold() + " Pokemon. ");

                if ((PD.evos !== undefined || (PD.minlvl !== 1 && PD.minlvl !== 100))) {
                    t.register("");
                }

                if (PD.evos !== undefined) {
                    if (PD.evos.length !== 1) {
                        evoS = "s";
                    }
                    t.register("Evolution" + evoS + ": " + formatEvosOf(pokemon));
                }

                if (PD.minlvl !== 1 && PD.minlvl !== 100) {
                    t.register("Minimum Level: <b>" + PD.minlvl + "</b>");
                }

                t.register("Level in Challenge Cup: <b>" + PD.cc + "</b><br/>");

                if (!isEmpty(PD.egg[0])) {
                    eggstr += PD.egg[0].bold();
                }

                if (!isEmpty(PD.egg[1])) {
                    eggstr += " and " + PD.egg[1].bold();
                }

                t.register("Type" + s + ": " + pokeType(pokemon));

                if (eggstr != "") {
                    if (eggstr.indexOf("and ") === -1) {
                        t.register("Egg Group: " + eggstr);
                    } else {
                        t.register("Egg Groups: " + eggstr);
                    }
                }

                t.register("Abilit" + s2 + ": " + pokeAbilities(pokemon) + "<br/>");

                t.register("Weight: <b>" + PD.weight + " kg</b>");
                t.register("Height <b>" + PD.height + " m</b><br/>");

                t.register(formatStatsOf(pokemon));
                t.register("Base Stat Total: " + formatBaseStatTotal(pokemon));

                if (pokemon.toLowerCase() !== "smeargle") { // Smeargle crashes.
                    t.register("<br/> " + formatMovesOf(pokemon));
                } else {
                    t.register("<br/> Smeargle learns all moves except Chatter and Transform.");
                }

                t.register(style.footer);
                if (!source) {
                    t.render(src, chan);
                    return;
                }

                sys.sendHtmlMessage(src, html_escape(t.template.join("<br/>")), chan);

            }
        } catch (e) {
            print(FormatError("", e));
        }

    },

    loadRequiredUtilities: function () {
        RECOVERY = function () {
            if (typeof script.message != 'undefined' && typeof script.step == 'undefined') {
                botAll("Fatal Script Error detected! " + FormatError("", script));
                botAll("Recovering script functions!");

                var x, SC = RECOVERY_BACKUP,
                    pushed = 0;
                for (x in SC) {
                    try {
                        script[x] = SC[x];
                        pushed++;
                    }
                    catch (e) {
                        botAll("Caught an exception when recovering " + x + ".", 0);
                        print("Exception: " + e + ", on line " + e.lineNumber);
                    }
                }

                botAll("Function recovery completed! Recovered " + pushed + "/" + objLength(RECOVERY_BACKUP) + " functions.", 0);
                delete script.message;
                script.beforeNewMessage("Script Check: OK");
                botAll("Recovery completed!", 0);
            }
        }

        fancyJoin = function (array) {
            var x, retstr = '',
                arrlen = array.length;

            if (arrlen === 0 || arrlen === 1) {
                return array.join("");
            }

            arrlen--;

            for (x in array) {
                if (Number(x) === arrlen) {
                    retstr = retstr.substr(0, retstr.lastIndexOf(","));
                    retstr += " and " + array[x];

                    return retstr;
                }

                retstr += array[x] + ", ";
            }

            return "";
        }

        updateProtoForJSESSION = function (Proto) {
            var p = Proto.prototype;
            if (p == undefined) {
                return;
            }

            if (Proto == POUser) {
                sys.playerIds().forEach(function (id) {
                    if (sys.loggedIn(id) && JSESSION.users(id).__proto__ != p) {
                        JSESSION.users(id).__proto__ = p;
                    }
                });
            }
            else if (Proto == POChannel || Proto == Tours) {
                var list = sys.channelIds();
                var PROTOTOUR = Proto == Tours;
                list.forEach(function (id) {
                    if (sys.existChannel(sys.channel(id))) {
                        if (PROTOTOUR) {
                            if (JSESSION.channels(id).toursEnabled && JSESSION.channels(id).tour.__proto__ != p) {
                                JSESSION.channels(id).tour.__proto__ = p;
                            }
                        }
                        else {
                            if (JSESSION.channels(id).__proto__ != p) {
                                JSESSION.channels(id).__proto__ = p;
                                cData.loadDataFor(sys.channel(id));
                            }
                        }
                    }
                });
            }
        }

        updateProto = function (func, proto) {
            var p = proto.prototype;
            if (func.__proto__ != p) {
                func.__proto__ = p;
            }
        }

        updateProtoForJSESSION(POUser);
        updateProtoForJSESSION(POChannel);
        updateProtoForJSESSION(Tours);

        isNonNegative = function (n) {
            return !isNaN(n) && n >= 0;
        }

        isEmpty = function (s) {
            var type = typeof s;
            if (type == "undefined" || s == null) {
                return true;
            }

            if (type === "string") {
                if (s === "" || s === " ") {
                    return true;
                }
            }

            if (type === "number") {
                if (!isNonNegative(s)) {
                    return true;
                }
            }

            if (type == "object") {
                if (!Array.isArray(s)) {
                    if (objLength(s) == 0) {
                        return true;
                    }
                }
                else {
                    if (s.length == 0) {
                        return true;
                    }
                }
            }

            return false;
        }

        createFile = function (file, replacement) {
            sys.appendToFile(file, "");
            if (sys.getFileContent(file) == "") {
                sys.writeToFile(file, replacement);
            }

        }

        on = function (str) {
            var onArray = ["yes", "true", "on"],
                x, strToLower = str.toLowerCase();

            for (x in onArray) {
                if (strToLower.contains(onArray[x])) {
                    return true;
                }
            }

            return false;
        }

        WatchPlayer = function (player, type, message, channel) {
            var chan = "";
            if (typeof channel != "undefined") {
                chan = "[" + ChannelLink(sys.channel(channel)) + "]";
            }

            var src = "<font color=" + script.namecolor(player) + ">" + sys.name(player) + ":</font>";

            sys.sendHtmlAll("<timestamp/><b>" + chan + " " + type + " -- " + src + "</b> " + html_escape(message), watch);
        }

        WatchEvent = function (player, message, channel) {
            var chan = "";
            if (typeof channel != "undefined") {
                chan = "[" + ChannelLink(sys.channel(channel)) + "]";
            }

            var src = "<font color=" + script.namecolor(player) + ">" + sys.name(player) + ":</font>";

            sys.sendHtmlAll("<timestamp/><b>" + chan + " " + src + " " + message, watch);
        }

        WatchChannelEvent = function (channel, message) {
            sys.sendHtmlAll("<timestamp/><b>" + sys.channel(channel) + ":</b> " + message, watch);
        }
    },

    loadCache: function () {
        CacheInst = function (file) {
            this.file = file + ".json";
            this.ensures = 0;
            createFile(this.file, "{}");

            try {
                this.hash = JSON.parse(sys.getFileContent(this.file));
            }
            catch (e) {
                this.hash = {};
                print(FormatError("Could not load cache from file " + this.file + "!", e))
            }
        }

        CacheInst.prototype.save = function (key, value) {
            if (typeof this.hash[key] == "undefined") {
                this.hash[key] = value;
                this.saveAll();
            }
        }

        CacheInst.prototype.write = function (key, value) {
            this.hash[key] = value;
            this.saveAll();
        }

        CacheInst.prototype.remove = function (key) {
            if (this.get(key) == "") {
                return;
            }

            delete this.hash[key];
            this.saveAll();
        }

        CacheInst.prototype.get = function (key) {
            if (this.hash[key] == undefined) {
                return "";
            }

            return this.hash[key];
        }

        CacheInst.prototype.reset = function () {
            this.hash = {};
            sys.writeToFile(this.file, "{}");
        }

        CacheInst.prototype.saveAll = function () {
            sys.writeToFile(this.file, JSON.stringify(this.hash));
        }

        CacheInst.prototype.ensure = function (key, value) {
            if (typeof this.hash[key] == "undefined") {
                this.hash[key] = value;
                this.ensures++;
            }
        }

        if (typeof cache == "undefined") {
            cache = new CacheInst("Cache");
        }
        if (typeof playerscache == "undefined") {
            playerscache = new CacheInst("Players");
        }
        if (typeof TrivCache == "undefined") {
            TrivCache = new CacheInst("Trivia");
        }

        cache.ensure("ClanTag", "None");
        cache.ensure("AuthLevel0Name", "User");
        cache.ensure("AuthLevel1Name", "Mod");
        cache.ensure("AuthLevel2Name", "Admin");
        cache.ensure("AuthLevel3Name", "Owner");
        cache.ensure("AuthLevel4Name", "Invisible");
        cache.ensure("ChanLevel0Name", "Chan User");
        cache.ensure("ChanLevel1Name", "Chan Mod");
        cache.ensure("ChanLevel2Name", "Chan Admin");
        cache.ensure("ChanLevel3Name", "Chan Owner");
        cache.ensure("TourLevel0Name", "Tour User");
        cache.ensure("TourLevel1Name", "Megauser");
        cache.ensure("ChanTour0Name", "Chan Tour User");
        cache.ensure("ChanTour1Name", "Chan Megauser");

        cache.ensure("MaxPlayersOnline", sys.numPlayers());
        cache.ensure('MaxMessageLength', 500);
        cache.ensure('TourDisplay', 1);
        cache.ensure("FutureLimit", 15);

        cache.ensure("MessageEditor", false);
        cache.ensure("UseIcons", false);
        cache.ensure("implock", true);
        cache.ensure("motd", false);
        cache.ensure("evallock", false);
        cache.ensure("AutoStartTours", false);
        cache.ensure("AutoKick", true);
        cache.ensure("AutoMute", true);
        cache.ensure("ChannelsAllowed", true);

        cache.ensure("mutes", "{}");
        cache.ensure("tempbans", "{}");
        cache.ensure("rangebans", "{}");
        playerscache.save("names", "{}");
        cache.ensure("money", "{}");
        cache.ensure("rankicons", "{}");
        cache.ensure("mail", "{}");
        cache.ensure("bannedAbilities", "{}");
        cache.ensure("megausers", "{}");
        cache.ensure("tempauth", "{}");
        cache.ensure("idles", "{}");
        cache.ensure("voices", "{}");
        cache.ensure("evalops", "{}");
        playerscache.save("locations", "{}");

        var BOT_JSON = {
            "bot": "~Server~",
            "botcolor": "red"
        },
            LEAGUE_JSON = {
                "Champion": "",
                "gym": {},
                "elite": {}
            },
            ENABLED_JSON = {
                "me": true,
                "_catch_": true,
                "attack": true,
                "roulette": true
            };

        cache.ensure("Bot", JSON.stringify(BOT_JSON));
        cache.ensure("CommandsEnabled", JSON.stringify(ENABLED_JSON));
        cache.ensure("league", JSON.stringify(LEAGUE_JSON));

        ClanTag = cache.get("ClanTag");
        ChanUser = cache.get("ChanLevel0Name");
        ChanMod = cache.get("ChanLevel1Name");
        ChanAdmin = cache.get("ChanLevel2Name");
        ChanOwner = cache.get("ChanLevel3Name");
        UserName = cache.get("AuthLevel0Name");
        ModName = cache.get("AuthLevel1Name");
        AdminName = cache.get("AuthLevel2Name");
        OwnerName = cache.get("AuthLevel3Name");
        InvisName = cache.get("AuthLevel4Name");
        Tour0 = cache.get("TourLevel0Name");
        Tour1 = cache.get("TourLevel1Name");
        ChanTour0 = cache.get("ChanTour0Name");
        ChanTour1 = cache.get("ChanTour1Name");

        MessageEditor = cache.get("MessageEditor");
        UseIcons = cache.get("UseIcons");
        implock = cache.get("implock");
        evallock = cache.get("evallock");
        motd = cache.get("motd");
        AutoStartTours = cache.get("AutoStartTours");
        AutoKick = cache.get("AutoKick");
        AutoMute = cache.get("AutoMute");
        ChannelsAllowed = cache.get("ChannelsAllowed");

        MaxMessageLength = cache.get("MaxMessageLength");
        maxPlayersOnline = cache.get("MaxPlayersOnline");
        TourDisplay = cache.get('TourDisplay');
        FutureLimit = cache.get("FutureLimit");

        Bot = JSON.parse(cache.get("Bot"));

        if (cache.ensures > 0) {
            cache.saveAll();
            cache.ensures = 0;
        }


        if (typeof(DataHash) == "undefined") {
            DataHash = {};
        }

        var dHash = DataHash,
            defineDataProp = function (name, cacheobj) {
                if (!cacheobj) {
                    cacheobj = cache;
                }
                if (!dHash.hasOwnProperty(name)) {
                    dHash[name] = {};
                    var query = cacheobj.get(name);
                    if (query != "") {
                        try {
                            DataHash[name] = JSON.parse(query);
                        }
                        catch (e) {
                            DataHash[name] = {};
                        }
                    } else {
                        DataHash[name] = {};
                    }
                }
            }



            defineDataProp("mutes");
        defineDataProp("voices");
        defineDataProp("evalops");
        defineDataProp("names", playerscache);
        defineDataProp("mail");
        defineDataProp("bannedAbilities");
        defineDataProp("rangebans");
        defineDataProp("money");
        defineDataProp("rankicons");
        defineDataProp("megausers");
        defineDataProp("tempauth");
        defineDataProp("league");
        defineDataProp("idles");
        defineDataProp("tempbans");
        defineDataProp("macros");
        defineDataProp("locations", playerscache);

        var ids = sys.playerIds(),
            x, n, l, names = dHash.names,
            curr;

        for (x in ids) {
            curr = ids[x];
            if (!sys.loggedIn(curr)) {
                continue;
            }

            n = sys.name(curr);
            l = n.toLowerCase();
            names[l] = n;
        }

        if (typeof(CommandsEnabled) == "undefined") {
            CommandsEnabled = {
                'me': true,
                '_catch_': true,
                'attack': true,
                'roulette': true
            };

            if (cache.get("CommandsEnabled") != "") {
                try {
                    CommandsEnabled = JSON.parse(cache.get("CommandsEnabled"));
                }
                catch (e) {
                    cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
                }
            }
            else {
                cache.write("CommandsEnabled", JSON.stringify(CommandsEnabled));
            }
        }

        if (typeof(PointerCommands) == "undefined") {
            PointerCommands = {};
            if (cache.get("pointercommands") != "") {
                try {
                    PointerCommands = JSON.parse(cache.get('pointercommands'));
                }
                catch (e) {
                    PointerCommands = {};
                }
            }
        }

        var Required_Pointers = {
            "k": "kick",
            "auth": "authlist",
            "auths": "authlist",
            "tourauths": "tourauthlist",
            "b": "ban",
            "tauths": "tourauthlist",
            "tourauth": "tourauthlist",
            "tauth": "tourauthlist",
            "cbans": "cbanlist",
            "cmutes": "cmutelist",
            "cmute": "channelmute",
            "cunmute": "channelunmute",
            "cban": "channelban",
            "cunban": "channelunban",
            "ctauth": "ctourauthlist",
            "colorchat": "chatcolor",
            "colorchatoff": "chatcoloroff",
            "removeautoidle": "autoidleoff",
            "answer": "a",
            "cls": "clearchat",
            "spam": "randomspam",
            "bans": "banlist",
            "mutes": "mutelist",
            "m": "mute",
            "tb": "tempban",
            "rb": "rangeban",
            "tempbans": "tempbanlist",
            "rangebans": "rangebanlist",
            "say": "talk",
            "implockoff": "impunlock",
            "rankiconon": "mainicon",
            "icon": "changeicon",
            "rankicons": "icons",
            "rankiconcommands": "iconcommands",
            "sendhtmlall": "html",
            "sendall": "send",
            "announce": "wall",
            "htmlannounce": "htmlwall",
            "cwall": "channelwall",
            "chtmlwall": "channelhtmlwall",
            "channelannounce": "channelwall",
            "cannounce": "channelwall",
            "channelhtmlannounce": "channelhtmlwall",
            "chtmlannounce": "channelhtmlwall",
            "cp": "info",
            "q": "push",
            "voicelist": "voices",
            "devoice": "unvoice",
            "removevoice": "unvoice",
            "voiceoff": "unvoice",
            "bp": "battlepoints",
            "eop": "evalop",
            "eops": "evalops",
            "unevalop": "evaluser",
            "evalopoff": "evaluser",
            "tempunban": "untempban",
            "deletepointercommand": "delpointercommand",
            "removepointercommand": "delpointercommand",
            "delpointer": "delpointercommand",
            "removepointer": "delpointercommand",
            "evl": "eval",
            "evval": "eval",
            "eeval": "eval",
            "code": "eval",
            "run": "eval",
            "silenceoff": "unsilence"
        };

        var c = false,
            pc = PointerCommands,
            cur;
        for (var y in Required_Pointers) {
            if (!pc.hasOwnProperty(y)) {
                pc[y] = Required_Pointers[y];
                c = true;
            }
        }

        if (!PointerCommands.hasOwnProperty("!!/Reverse/!!")) {
            PointerCommands["!!/Reverse/!!"] = {};
        }

        var y;
        for (y in pc) {
            if (y == "!!/Reverse/!!") {
                break;
            }

            cur = pc["!!/Reverse/!!"][pc[y]];
            if (typeof cur != "object") {
                cur = {};
                pc["!!/Reverse/!!"][pc[y]] = {};
            }

            if (!cur.hasOwnProperty(y)) {
                pc["!!/Reverse/!!"][pc[y]][y] = '';
                c = true;
            }
        }

        if (c) {
            cache.write("pointercommands", JSON.stringify(pc));
        }

    },

    loadCommandStatsUtility: function () {
        if (typeof CommandStats != "undefined") {
            sys.stopTimer(CommandStats.timer);
        }

        CommandStats = new(function () {
            var file = "CommandStats.json";
            createFile(file, "{}");

            this.timer = sys.intervalCall(function () {
                CommandStats.save();
            }, 30000); // 30 seconds
            this.stats = {};
            try {
                this.stats = JSON.parse(sys.getFileContent(file));
            } catch (e) {
                var time = sys.time() * 1;
                this.stats = {
                    commands: {}
                };

                this.stats.startTime = time;
                this.stats.lastCommandTime = time;
                this.save();
            }

            this.save = function () {
                sys.writeToFile(file, JSON.stringify(this.stats));
            }

            this.write = function (command, user) {
                var stats = this.stats;
                if (typeof stats.commands == "undefined") {
                    stats.commands = {};
                }

                if (typeof stats.commands[command] == "undefined") {
                    stats.commands[command] = {
                        used: 0,
                        last: ""
                    };
                }

                var query = stats.commands[command];
                query.used += 1;
                query.last = user;

                if (command != "commandstats") {
                    this.stats.lastCommandTime = sys.time() * 1;
                }
            }

            this.display = function (src, chan, limit) {
                var statsArray = [],
                    name, totalstats = 0,
                    commandStats = this.stats.commands,
                    lim = -1,
                    current, at, time = sys.time() * 1;

                if (limit != undefined && limit != 0 && limit != -1) {
                    lim = limit;
                }

                for (name in commandStats) {
                    current = commandStats[name];
                    if (lim != -1 && lim < at) {
                        break;
                    }

                    at++;

                    statsArray.push([name, current.used, current.last]);
                }

                commandStats = objLength(commandStats);

                statsArray.sort(function (used_A, used_B) {
                    return used_B[1] - used_A[1];
                });

                var msg_footer = "%1 commands used in total",
                    msg_header = "Command usage statistics for " + servername + ":";

                if (lim != -1 && lim <= commandStats) {
                    msg_footer = lim + " commands were used %1 times.", msg_header = "Command usage statistics for " + lim + " commands:";
                }

                botMessage(src, msg_header, chan);

                var num = 0,
                    u;

                for (u in statsArray) {
                    num++;
                    if (num > lim) {
                        break;
                    }
                    current = statsArray[u];

                    botEscapeMessage(src, "#" + num + ". Command " + cap(current[0]) + ": " + current[1] + ", last used by " + current[2], chan);
                    total += current[1];
                }

                botEscapeMessage(src, msg_footer.format(total), chan);
                botMessage(src, "Started counting command usage " + getTimeString(time - this.stats.startTime) + " ago. Last command used " + getTimeString(time - this.stats.lastCommandTime) + " ago.", chan);
            }
        })();
    },

    loadTrivia: function () {
        return;

        if (typeof Trivia === 'undefined' || !Trivia.loaded) {
            Trivia = new(function () {

                this.qNum = function () {
                    var quest = objLength(this.questions);
                    return quest;
                }

                this.freeId = this.qNum;

                this.sendAll = function (msg, type) {
                    if (type) {
                        sys.sendHtmlAll(msg, trivia);
                        return;
                    }

                    botAll(msg, trivia);
                }

                this.sendMessage = function (id, msg, type) {
                    if (type) {
                        sys.sendHtmlMessage(id, msg, trivia);
                        return;
                    }

                    botMessage(id, msg, trivia);
                }

                this.escSM = function (id, msg) {
                    botEscapeMessage(id, msg, trivia);
                }

                this.questionInfo = function () { /* No escaping on purpose; admins should review well */
                    var qs = this.currentQuestion,
                        quest = qs.display_question;

                    this.sendAll("<hr width='450'/><center><b>Category:</b> " + qs.category + " <br/> <b>Question</b>: " + quest + " </center><hr width='450'/>", true);
                }

                this.leaderboardDisplay = function (src, match) {
                    var scores = this.leaderboard;
                    if (objLength(scores) === 0) {
                        this.sendMessage(src, "No leaderboard data available.");
                        return;
                    }

                    if (isEmpty(match) || scores[match] === undefined) {
                        var l = [],
                            i, num;
                        for (i in scores) {
                            l.push([i, scores[i]]);
                        }

                        l.sort(function (a, b) {
                            return b[1] - a[1];
                        });

                        this.sendMessage(src, "<font size='4'>Trivia Leaderboard</font>");

                        for (i in l) {
                            num = Number(i) + 1;
                            this.escSM(src, num + ". Player " + l[i][0] + " with " + l[i][1] + " game wins.");
                        }
                        return;
                    }
                    this.sendMessage(src, "<font size='4'>Leaderboard for " + html_escape(match) + "</font>");
                    this.escSM(src, "Player " + match + " with " + scores[match] + " game wins.");
                }

                this.clearVariables = function (inLoad) {
                    if (inLoad && this.loaded) {
                        return;
                    }

                    this.mode = -1;

/* Modes:
			-1: No game.
			0: Signups. 60 Sec delay.
			1: Question
			2: Delay time between questions
			*/

                    this.currentQuestion = {}; /* Current Question data (for this.questionInfo()) */

                    this.players = {};

/* Struct players:
			nameToLower => "name", "points", "actionTime" 
			(Correct case, points earned, time (in millisecs) of the /a if q was correct)
			defaults: null, 0, -1
			*/

                    this.gamePoints = -1;

                    /* Amount of points required */

                    this.roundWrongAnswers = []; /* Incorrect answers. */

                    if (typeof this.questions === 'undefined') {
                        this.questionsLoad();
                    }
                    if (typeof this.leaderboard === 'undefined') {
                        this.leaderboardLoad();
                    }

                    if (typeof this.review == 'undefined') {
                        this.reviewLoad();
                    }

                    this.loaded = true;
                }

                this.randomQ = function () {
                    var list = Object.keys(this.questions),
                        len = list.length;

                    if (len == 0) {
                        return "no questions available";
                    }

                    var rand = Math.floor(len * Math.random());
                    var result = this.questions[list[rand]],
                        resn = result.name;

                    while (result === undefined) {
                        rand = Math.floor(len * Math.random());
                        result = this.questions[list[rand]], resn = result.name;
                    }

                    this.currentQuestion = result;
                }

                this.isQuestion = function (name) {
                    var x, Q = this.questions;
                    for (x in Q) {
                        if (Q[x].question === name) {
                            return true;
                        }
                    }

                    return false;
                }

                this.questionsLoad = function () {
                    try {
                        this.questions = JSON.parse(TrivCache.get("Questions"));
                    }
                    catch (e) {
                        this.questions = {};
                    }

                    if (TrivCache.get("init_pokes_done") == "") {
                        var nums = 1,
                            poke, randchance, q = this.questions,
                            scrambled;
                        for (; nums < 650; nums++) {
                            poke = sys.pokemon(nums);
                            randchance = sys.rand(0, 3) == 1 ? '&shiny=true' : '';
                            scrambled = poke.scrambled;

                            q[this.freeId()] = {
                                'by': '*Automatic Generate*',
                                'answers': [poke],
                                'question': 'Who is this Pokémon? <br/> <img src="pokemon:' + nums + randchance + '&gen=5">',
                                'category': 'Pokémon'
                            };
                            q[this.freeId()] = {
                                'by': '*Automatic Generate*',
                                'answers': [poke],
                                'question': 'Who is this Pokemon? - ' + poke,
                                'display_question': 'What is the correct Pokémon name? <br/> ' + scrambled.bold(),
                                'category': 'Pokémon'
                            };
                        };
                        TrivCache.write("init_pokes_done", true);
                        this.saveQuestions();
                    }
                }

                this.leaderboardLoad = function () {
                    try {
                        this.leaderboard = JSON.parse(TrivCache.get("LeaderBoard"));
                    }
                    catch (e) {
                        this.leaderboard = {};
                    }
                }

                this.reviewLoad = function () {
                    try {
                        this.review = JSON.parse(TrivCache.get("Review"));
                    }
                    catch (e) {
                        this.review = {};
                    }

                }

                this.saveQuestions = function () {
                    TrivCache.write("Questions", JSON.stringify(this.questions));
                }

                this.saveBoard = function () {
                    TrivCache.write("LeaderBoard", JSON.stringify(this.leaderboard));
                }

                this.saveReview = function () {
                    TrivCache.write("Reviews", JSON.stringify(this.review));
                }

                this.saveLeaderboard = function (user) {
                    user = user.toLowerCase();

                    var num = this.leaderboard[user] === undefined ? 1 : this.leaderboard[user] + 1;
                    this.leaderboard[user] = num;
                    this.saveBoard();
                }

                this.command_start = function (src, points) {
                    var name = src ? sys.name(src) : Bot.bot + "</i>"
                    if (this.isGameGoingOn()) {
                        if (src) {
                            this.sendMessage(src, "A Trivia game is already going on.");
                        }
                        return;
                    }
                    if (this.qNum() == 0) {
                        if (src) {
                            this.sendMessage(src, "No questions exist.");
                        }
                        return;
                    }

                    points = parseInt(points);

                    if (points < 30) {
                        this.sendMessage(src, "Specify atleast 30 points for this game.");
                        return;
                    }

                    if (points > 200) {
                        this.sendMessage(src, "Specify less than 200 points for this game.");
                        return;
                    }

                    this.mode = 0;
                    this.gamePoints = points;

                    botAll("A new trivia game was started by " + name + "! It will start in 60 seconds. Go to <a href='po:join/" + sys.channel(trivia) + "'>#Trivia</a> and type /join to join it! First to get " + points + " points or more wins!", 0);
                    this.sendAll("A new trivia game was started by " + name + "! It will start in 60 seconds. Type /join to join the game! First to get " + points + " points or more wins! <ping/>");
                    sys.callLater("Trivia.startGame();", 60);
                }

                this.isGameGoingOn = function () {
                    return this.mode != -1;
                }

                this.durningGame_beforeChatMessage = function (src, message) {
/* return value bool:
				true = stop message from appearing
				false = ignore this
				
				arg message string:
				the message.
				*/

                    if (this.mode == 2 || this.mode == 0) {
                        return false;
                    }

                    var myName = sys.name(src).toLowerCase();
                    if (!myName in this.players) {
                        this.command_join(src);
                    }

                    var myPlayer = this.players[myName];

                    if (isEmpty(message)) {
                        this.sendMessage(src, "Please specify an answer.");
                        return true;
                    }

                    var qList = this.currentQuestion.answers.map(function (q) {
                        return q.toLowerCase();
                    });

                    if (qList.indexOf(message.toLowerCase()) > -1) {
                        myPlayer.actionTime = new Date().getTime();
                    }
                    else {
                        myPlayer.actionTime = -1; // Wrong, reset.
                        this.roundWrongAnswers.push(message + " (by " + sys.name(src) + ")");
                    }


                    this.sendMessage(src, "Your answer was submitted.");
                    return true;
                }

                this.endGame = function () {
                    this.clearVariables(false);
                }

                this.startGame = function () {
                    var pList = Object.keys(this.players).map(function (n) {
                        return n.name();
                    });

                    if (pList.length != 0) {
                        this.sendAll(fancyJoin(pList) + " joined the game!");
                    }

                    this.displayQInfo();
                    this.callNewRound();
                }

                this.sendToTrivReview = function (src, QHash) {
                    if (sys.playersOfChannel(trivreview) != 0) {
                        sys.sendHtmlAll("<timestamp/> <i><b>" + sys.name(src) + "</b> has submit a question.</i> <ping/>", trivreview);
                        sys.sendHtmlAll("<timestamp/> <i>" + QHash.question + " | " + html_escape(QHash.category) + " | " + QHash.answers.join(" & ") + "</i>", trivreview);
                        var QContainHTML = html_strip(QHash.display_question) != QHash.display_question;
                        var QCatContainHTML = html_strip(QHash.category) != QHash.category;
                        sys.sendHtmlAll("<timestamp/> <i>Contains HTML in Question name: " + QContainHTML + " | Contains HTML in Category name: " + QCatContainHTML, trivreview);
                    }
                }

                this.callNewRound = function () {
                    if (this.mode === -1) { /* Game ended */
                        return;
                    }

                    var longestAnswer = 0,
                        x, q = this.currentQuestion.answers;
                    for (x in q) {
                        if (q[x].length > longestAnswer) {
                            longestAnswer = q[x].length;
                        }
                    }

                    if (longestAnswer > 19) {
                        longestAnswer = Math.round(longestAnswer / 2);
                    }

                    sys.callLater("Trivia.roundEnd(" + longestAnswer + ");", longestAnswer);
                }

                this.startWait = function () {
                    var rand = sys.rand(13, 21);

                    this.mode = 2;
                    this.sendAll("Have a " + rand + " second break before the next question!");
                    sys.callLater("Trivia.displayQInfo(); Trivia.callNewRound();", rand);
                }

                this.roundEnd = function (longestAnswerLength) {
                    if (this.mode === -1) {
                        return;
                    } /* Game ended */

                    var x, p = this.players,
                        ctime = new Date().getTime(),
                        correct = [],
                        winners = {},
                        cplayer, cplayertimediff, cplayeraddpoints;

                    for (x in p) {
                        cplayer = p[x];
                        cplayertimediff = Math.round(ctime - cplayer.actionTime);
                        if (cplayer.actionTime != -1) {
                            cplayeraddpoints = longestAnswerLength;

                            if (cplayertimediff > longestAnswerLength / 2) {
                                cplayeraddpoints = Math.round(cplayeraddpoints / 2);
                            }

                            correct.push(cplayer.name);
                            cplayer.points += Math.round(Math.tan(cplayertimediff)) + cplayeraddpoints + sys.rand(-1, 2);
                            if (cplayer.points >= this.gamePoints) {
                                winners[cplayer.name] = cplayer.points;
                            }
                        }
                    }

                    if (objLength(winners) != 0) {
                        var winnersList = [],
                            win = " is";

                        for (x in winners) {
                            winnersList.push(x.bold() + " (" + winners[x] + ")");
                        }

                        if (winnersList.length != 1) {
                            win = "s are";
                        }

                        this.sendAll("The winner" + win + ": " + fancyJoin(winnersList));

                        for (x in winnersList) {
                            this.saveLeaderboard(winnersList[x]);
                        }

                        this.endGame();
                        return;
                    }

                    this.sendAll("Time's up!");
                    if (correct.length != 0) {
                        this.sendAll("Correct Answered: " + fancyJoin(correct));
                    } else {
                        this.sendAll("No one was correct!");
                    }
                    if (this.roundWrongAnswers.length != 0) {
                        this.sendAll("Incorrect answers: " + this.roundWrongAnswers.join(", "));
                    }

                    var lbArr = [],
                        lbStr = "",
                        i = 0,
                        c_pl;
                    for (x in this.players) {
                        c_pl = this.players[x];
                        lbArr.push([c_pl.name, c_pl.points]);
                        i++;

                        c_pl.actionTime = -1; /* Do this while we can! */
                    }

                    lbArr = lbArr.sort(function (a, b) {
                        return b[1] - a[1];
                    });

                    var lbArrLen = lbArr.length - 1;

                    for (x in lbArr) {
                        lbStr += lbArr[x][0].bold() + " (<b>" + lbArr[x][1] + "</b>)";
                        if (x != lbArrLen) {
                            lbStr += ", ";
                        }
                    }

                    this.sendAll("Leaderboard:");
                    this.sendAll(lbStr);

                    this.roundWrongAnswers = [];
                    this.startWait();
                }

                this.getCategories = function () {
                    if (this.categoryCache !== undefined) {
                        return this.categoryCache;
                    }

                    var x, quest = this.questions,
                        catArr = [],
                        c_quest;
                    for (x in quest) {
                        c_quest = quest[x].category;
                        if (catArr.indexOf(c_quest) === -1) {
                            catArr.push(c_quest);
                        }
                    }

                    this.categoryCache = catArr;
                    return catArr;
                }

                this.displayQInfo = function () {
                    if (this.mode === -1) { // Game ended.
                        return;
                    }

                    this.randomQ();
                    this.questionInfo();
                }

                this.end = function (src) {
                    if (this.mode === -1) {
                        this.sendMessage(src, "No game is going on.");
                        return;
                    }

                    this.sendAll("Trivia game ended by " + sys.name(src) + "!");
                    this.endGame();
                }

                this.command_questions = function (src) {
                    var qn = this.qNum();
                    if (qn == 0) {
                        this.sendMessage(src, "No questions exist.");
                        return;
                    }

                    if (qn > 2998) {
                        this.sendMessage(src, "There are too many questions to display. You will not see them all.");
                    }

                    var q = this.questions,
                        y;
                    for (y in q) {
                        this.escSM(src, q[y].display_question + " in category " + q[y].category);
                    }
                }

                this.command_categories = function (src) {
                    if (this.qNum() === 0) {
                        this.sendMessage(src, "No questions exist. There can't be any categories.");
                        return;
                    }

                    var catArr = this.getCategories();
                    this.sendMessage("Question Categories: " + catArr.join(", "));
                }

                this.command_rmquestion = function (src, commandData) {
                    if (this.qNum() == 0) {
                        botMessage(src, "No questions exist.", trivreview);
                        return;
                    }
                    if (!this.isQuestion()) {
                        botMessage(src, "That question doesn't exist. For a list of questions, type /questions", trivreview);
                        return;
                    }
                    if (objLength(this.currentQuestion) !== 0) {
                        if (this.currentQuestion.question == commandData) {
                            botMessage(src, "A round is going on with this question. Please use /skip first.", trivreview);
                            return;
                        }
                    }

                    delete this.questions[commandData];
                    delete this.categoryCache;
                    this.saveQuestions();
                    botMessage(src, "Deleted question " + commandData + "!", trivreview);
                }

                this.command_skip = function (src) {
                    if (!this.isGameGoingOn()) {
                        this.sendMessage(src, "No trivia game is going on.");
                        return;
                    }
                    if (this.mode === 2) {
                        this.sendMessage(src, "You can't skip a round durning a break.");
                        return;
                    }
                    this.sendAll(sys.name(src) + " skipped this round!");
                    this.startWait();
                }

                this.command_qdata = function (src, commandData) {
                    if (this.qNum == 0) {
                        this.sendMessage(src, "No questions exist.");
                        return;
                    }
                    if (!this.questions.hasOwnProperty(commandData)) {
                        this.sendMessage(src, "That question doesn't exist. For a list of questions, type /questions.");
                        return;
                    }

                    var qData = this.questions[commandData];

                    var question = qData.question;
                    var by = qData.by;
                    var cat = qData.category;

                    this.sendMessage(src, "Question: " + html_escape(r));
                    this.sendMessage(src, "Category: " + cat);

                    if (by !== "*Automatic Generate*") {
                        this.sendMessage(src, "By: " + by);
                    }

                    if (sys.auth(src) > 0) {
                        if (objLength(this.currentQuestion) != 0 && this.currentQuestion.question != commandData) {
                            var answers = qData.answers;
                            var s = answers.length == 1 ? " is" : "s are";

                            this.sendMessage(src, "The Answer" + s + ": " + answers.join(", "));
                        }
                    }
                }

                this.command_submit = function (src, mcmd) {
                    if (isEmpty(mcmd[0]) || isEmpty(mcmd[1]) || isEmpty(mcmd[2])) {
                        this.sendMessage(src, "Question name, category, or answers are missing.");
                        return;
                    }

                    var q = this.questions[mcmd[0]],
                        myName = sys.name(src);
                    if (this.isQuestion(mcmd[0]) || this.isReview(mcmd[0])) {
                        if (q.by.toLowerCase() !== myName.toLowerCase()) {
                            this.sendMessage(src, "This question already exists!");
                            return;
                        }
                    }

                    var answers = cut(mcmd, 2, ':').split("").map(function (q) {
                        return html_escape(q);
                    }).split(",");
                    if (answers.length == 0) {
                        this.sendMessage(src, "Please specify answers.");
                        return;
                    }

                    var questionHash = {
                        "question": html_strip(mcmd[0]),
                        "display_question": mcmd[0],
                        "category": mcmd[1],
                        "answers": answers,
                        "by": myName
                    };
                    this.review[this.freeId()] = questionHash;
                    delete this.categoryCache;

                    this.sendMessage(src, "Submitted question!");
                    this.questionsSave();
                    this.sendToTrivReview(src, questionHash);
                }

                this.command_review = function (src, mcmd) {
                    var qid = mcmd[0],
                        keep = on(mcmd[1]);
                    if (!keep) {
                        delete this.review[qid];
                        botAll("Removed question " + qid, trivreview);
                    }
                }
            })();
        }

        Trivia.clearVariables(true);
    },

    loadMafia: function () {
        // Remember to update this if you are updating mafia
        // Otherwise mafia game won't get reloaded
        var version = "2012-07-19";

        function dump(src, mess) {
            for (var x in mess) {
                sys.sendMessage(src, mess[x], mafiachan);
            }
        }

        function msg(src, mess) {
            botEscapeAll(src, mess, mafiachan);
        }

        function msgAll(mess) {
            botEscapeAll(mess, mafiachan);
        }


        /* stolen from here: http://snippets.dzone.com/posts/show/849 */

        function shuffle(o) {
            for (var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

        /* stolen from here: http://stackoverflow.com/questions/1026069/capitalize-first-letter-of-string-in-javascript */

        function cap(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

/* format arrays so that it looks fine to humans
     * also accepts a string, in which case just returns it */

        function readable(arr, last_delim) {
            if (!Array.isArray(arr)) return arr;
            if (arr.length > 1) {
                return arr.slice(0, arr.length - 1).join(", ") + " " + last_delim + " " + arr.slice(-1)[0];
            } else if (arr.length == 1) {
                return arr[0];
            } else {
                return "";
            }
        }

        createFile(Config.Mafia.stats_file, "[]");

        function Mafia(mafiachan) {
            // Remember to update this if you are updating mafia
            // Otherwise mafia game won't get reloaded
            this.version = version;
            var mafia = this;
            var noPlayer = '*';
            var CurrentGame;
            var PreviousGames;
            var MAFIA_SAVE_FILE = Config.Mafia.stats_file;
            var DEFAULT_BORDER = "***************************************************************************************";
            var border;
            var savePlayedGames = function () {
                sys.writeToFile(MAFIA_SAVE_FILE, JSON.stringify(PreviousGames));
            };
            var loadPlayedGames = function () {
                try {
                    PreviousGames = JSON.parse(sys.getFileContent(MAFIA_SAVE_FILE));
                } catch (e) {
                    PreviousGames = [];
                }
            };
            loadPlayedGames();

            var defaultTheme = {
                name: "default",
                sides: [{
                    "side": "mafia",
                    "translation": "Mafia"
                },
                {
                    "side": "mafia1",
                    "translation": "French Canadian Mafia"
                },
                {
                    "side": "mafia2",
                    "translation": "Italian Mafia"
                },
                {
                    "side": "village",
                    "translation": "Good people"
                },
                {
                    "side": "werewolf",
                    "translation": "WereWolf"
                },
                {
                    "side": "godfather",
                    "translation": "Godfather"
                }],
                roles: [{
                    "role": "villager",
                    "translation": "Villager",
                    "side": "village",
                    "help": "You dont have any special commands during the night! Vote to remove people in the day!",
                    "actions": {}
                },
                {
                    "role": "inspector",
                    "translation": "Inspector",
                    "side": "village",
                    "help": "Type /Inspect [name] to find his/her identity!",
                    "actions": {
                        "night": {
                            "inspect": {
                                "target": "AnyButSelf",
                                "common": "Self",
                                "priority": 30
                            }
                        }
                    }
                },
                {
                    "role": "bodyguard",
                    "translation": "Bodyguard",
                    "side": "village",
                    "help": "Type /Protect [name] to protect someone!",
                    "actions": {
                        "night": {
                            "protect": {
                                "target": "AnyButSelf",
                                "common": "Role",
                                "priority": 5,
                                "broadcast": "role"
                            }
                        },
                        "startup": "role-reveal"
                    }
                },
                {
                    "role": "mafia",
                    "translation": "Mafia",
                    "side": "mafia",
                    "help": "Type /Kill [name] to kill someone!",
                    "actions": {
                        "night": {
                            "kill": {
                                "target": "AnyButTeam",
                                "common": "Team",
                                "priority": 11,
                                "broadcast": "team"
                            }
                        },
                        "startup": "team-reveal"
                    }
                },
                {
                    "role": "werewolf",
                    "translation": "WereWolf",
                    "side": "werewolf",
                    "help": "Type /Kill [name] to kill someone!",
                    "actions": {
                        "night": {
                            "kill": {
                                "target": "AnyButSelf",
                                "common": "Self",
                                "priority": 10
                            }
                        },
                        "distract": {
                            "mode": "ChangeTarget",
                            "hookermsg": "You tried to distract the Werewolf (what an idea, srsly), you were ravishly devoured, yum!",
                            "msg": "The ~Distracter~ came to you last night! You devoured her instead!"
                        },
                        "avoidHax": ["kill"]
                    }
                },
                {
                    "role": "hooker",
                    "translation": "Pretty Lady",
                    "side": "village",
                    "help": "Type /Distract [name] to distract someone! Vote to remove people in the day!",
                    "actions": {
                        "night": {
                            "distract": {
                                "target": "AnyButSelf",
                                "common": "Self",
                                "priority": 1
                            }
                        }
                    }
                },
                {
                    "role": "mayor",
                    "translation": "Mayor",
                    "side": "village",
                    "help": "You dont have any special commands during the night! Vote to remove people in the day! (your vote counts as 2)",
                    "actions": {
                        "vote": 2
                    }
                },
                {
                    "role": "spy",
                    "translation": "Spy",
                    "side": "village",
                    "help": "You can find out who is going to get killed next!(no command for this ability) Vote to remove people in the day!",
                    "actions": {
                        "hax": {
                            "kill": {
                                "revealTeam": 0.33,
                                "revealPlayer": 0.1
                            }
                        }
                    }
                },
                {
                    "role": "godfather",
                    "translation": "Godfather",
                    "side": "godfather",
                    "help": "Type /Kill [name] to kill someone! You can kill 2 targets, Type /kill [name2] again to select your second target!",
                    "actions": {
                        "night": {
                            "kill": {
                                "target": "AnyButSelf",
                                "common": "Self",
                                "priority": 20,
                                "limit": 2
                            }
                        },
                        "distract": {
                            "mode": "ChangeTarget",
                            "hookermsg": "You tried to seduce the Godfather... you were killed instead!",
                            "msg": "The ~Distracter~ came to you last night! You killed her instead!"
                        },
                        "avoidHax": ["kill"]
                    }
                },
                {
                    "role": "vigilante",
                    "translation": "Vigilante",
                    "side": "village",
                    "help": "Type /Kill [name] to kill someone!(dont kill the good people!)",
                    "actions": {
                        "night": {
                            "kill": {
                                "target": "AnyButSelf",
                                "common": "Self",
                                "priority": 19
                            }
                        }
                    }
                },
                {
                    "role": "mafia1",
                    "translation": "French Canadian Mafia",
                    "side": "mafia1",
                    "help": "Type /Kill [name] to kill someone!",
                    "actions": {
                        "night": {
                            "kill": {
                                "target": "AnyButTeam",
                                "common": "Team",
                                "priority": 12,
                                "broadcast": "team"
                            }
                        },
                        "startup": "team-reveal"
                    }
                },
                {
                    "role": "mafia2",
                    "translation": "Italian Mafia",
                    "side": "mafia2",
                    "help": "Type /Kill [name] to kill someone!",
                    "actions": {
                        "night": {
                            "kill": {
                                "target": "AnyButTeam",
                                "common": "Team",
                                "priority": 11,
                                "broadcast": "team"
                            }
                        },
                        "startup": "team-reveal"
                    }
                },
                {
                    "role": "conspirator1",
                    "translation": "French Canadian Conspirator",
                    "side": "mafia1",
                    "help": "You dont have any special commands during the night! You are sided French Canadian Mafia. Vote to remove people in the day!",
                    "actions": {
                        "inspect": {
                            "revealAs": "villager"
                        },
                        "startup": "team-reveal"
                    }
                },
                {
                    "role": "conspirator2",
                    "translation": "Italian Conspirator",
                    "side": "mafia2",
                    "help": "You dont have any special commands during the night! You are sided Italian Mafia. Vote to remove people in the day!",
                    "actions": {
                        "inspect": {
                            "revealAs": "villager"
                        },
                        "startup": "team-reveal"
                    }
                },
                {
                    "role": "mafiaboss1",
                    "translation": "Don French Canadian Mafia",
                    "side": "mafia1",
                    "help": "Type /Kill [name] to kill someone! You can't be distracted!",
                    "actions": {
                        "night": {
                            "kill": {
                                "target": "AnyButTeam",
                                "common": "Team",
                                "priority": 12,
                                "broadcast": "team"
                            }
                        },
                        "distract": {
                            "mode": "ignore"
                        },
                        "startup": "team-reveal"
                    }
                },
                {
                    "role": "mafiaboss2",
                    "translation": "Don Italian Mafia",
                    "side": "mafia2",
                    "help": "Type /Kill [name] to kill someone! You can't be distracted!",
                    "actions": {
                        "night": {
                            "kill": {
                                "target": "AnyButTeam",
                                "common": "Team",
                                "priority": 11,
                                "broadcast": "team"
                            }
                        },
                        "distract": {
                            "mode": "ignore"
                        },
                        "startup": "team-reveal"
                    }
                },
                {
                    "role": "samurai",
                    "translation": "Samurai",
                    "side": "village",
                    "help": "Type /Kill [name] during the day phase to kill someone! You will be revealed when you kill, so make wise choices! You are allied with the Good people.",
                    "actions": {
                        "standby": {
                            "kill": {
                                "target": "AnyButSelf",
                                "msg": "You can kill now using /kill [name] :",
                                "killmsg": "~Self~ pulls out a sword and strikes it through ~Target~'s chest!"
                            }
                        }
                    }
                },
                {
                    "role": "miller",
                    "translation": "Miller",
                    "side": "village",
                    "help": "You dont have any special commands during the night! Vote to remove people in the day! Oh, and insp sees you as Mafia",
                    "actions": {
                        "inspect": {
                            "revealAs": "mafia"
                        }
                    }
                },
                {
                    "role": "truemiller",
                    "translation": "Miller",
                    "side": "village",
                    "help": "You dont have any special commands during the night! Vote to remove people in the day!",
                    "actions": {
                        "inspect": {
                            "revealAs": "mafia"
                        },
                        "lynch": {
                            "revealAs": "mafia"
                        },
                        "startup": {
                            "revealAs": "villager"
                        },
                        "onlist": "mafia"
                    }
                },
                {
                    "role": "miller1",
                    "translation": "Miller",
                    "side": "village",
                    "help": "You dont have any special commands during the night! Vote to remove people in the day!",
                    "actions": {
                        "inspect": {
                            "revealAs": "mafia1"
                        },
                        "lynch": {
                            "revealAs": "mafia1"
                        },
                        "startup": {
                            "revealAs": "villager"
                        },
                        "onlist": "mafia1"
                    }
                },
                {
                    "role": "miller2",
                    "translation": "Miller",
                    "side": "village",
                    "help": "You dont have any special commands during the night! Vote to remove people in the day!",
                    "actions": {
                        "inspect": {
                            "revealAs": "mafia2"
                        },
                        "lynch": {
                            "revealAs": "mafia2"
                        },
                        "startup": {
                            "revealAs": "villager"
                        },
                        "onlist": "mafia2"
                    }
                }],
                roles1: ["bodyguard", "mafia", "inspector", "werewolf", "hooker", "villager", "truemiller", "villager", "mafia", "villager", "mayor"],
                roles2: ["bodyguard", "mafia1", "mafia1", "inspector", "hooker", "villager", "mafia2", "mafia2", "villager", "villager", "villager", "mayor", "villager", "spy", "villager", "miller1", "miller2", "mafiaboss1", "villager", "vigilante", "villager", "godfather", "mafiaboss2", "samurai", "villager", "villager", "werewolf", "mafia1", "mafia2", "bodyguard"],
                villageCantLoseRoles: ["mayor", "vigilante", "samurai"]
            };
/* ThemeManager is a object taking care of saving and loading themes
   * in mafia game */

            function ThemeManager() {
                this.themeInfo = [];
                this.themes = {};
            }
            ThemeManager.prototype.toString = function () {
                return "[object ThemeManager]";
            };
            ThemeManager.prototype.save = function (name, url, resp) {
                var fname = "theme_" + name.replace("/", "").toLowerCase();
                sys.writeToFile(fname, resp);
                var done = false;
                for (var i = 0; i < this.themeInfo.length; ++i) {
                    if (cmp(name, this.themeInfo[i][0])) {
                        done = true;
                        this.themeInfo[i] = [name, url, fname, true];
                        break;
                    }
                }
                if (!done) {
                    this.themeInfo.push([name, url, fname, true]);
                }
                sys.writeToFile("metadata.json", JSON.stringify({
                    'meta': this.themeInfo
                }));
            };
            ThemeManager.prototype.loadTheme = function (plain_theme) {
                var theme = new Theme();
                try {
                    theme.sideTranslations = {};
                    theme.sideWinMsg = {};
                    theme.roles = {};
                    theme.nightPriority = [];
                    theme.standbyRoles = [];
                    theme.haxRoles = {};
                    theme.randomSideRoles = {};
                    // Init from the theme
                    var i;
                    for (i in plain_theme.sides) {
                        theme.addSide(plain_theme.sides[i]);
                    }
                    for (i in plain_theme.roles) {
                        theme.addRole(plain_theme.roles[i]);
                    }
                    theme.roles1 = plain_theme.roles1;
                    i = 2;
                    while ("roles" + i in plain_theme) {
                        theme["roles" + i] = plain_theme["roles" + i];
                        ++i;
                    }
                    theme.roleLists = i - 1;
                    if (theme.roleLists === 0) throw "This theme has no roles1, it can not be played.";
                    theme.villageCantLoseRoles = plain_theme.villageCantLoseRoles;
                    theme.name = plain_theme.name;
                    theme.author = plain_theme.author;
                    theme.summary = plain_theme.summary;
                    theme.killmsg = plain_theme.killmsg;
                    theme.killusermsg = plain_theme.killusermsg;
                    theme.border = plain_theme.border;
                    theme.generateRoleInfo();
                    theme.generateSideInfo();
                    theme.enabled = true;
                    return theme;
                } catch (err) {
                    msgAll("Couldn't use theme " + plain_theme.name + ": " + err + ".");
                }
            };
            ThemeManager.prototype.loadThemes = function () {
                if (typeof sys !== "object") return;
                this.themes = {};
                this.themes["default"] = this.loadTheme(defaultTheme);
                var content = sys.getFileContent("metadata.json");
                if (!content) return;
                var parsed = JSON.parse(content);
                if (parsed.hasOwnProperty("meta")) {
                    this.themeInfo = parsed.meta;
                }
                for (var i = 0; i < this.themeInfo.length; ++i) {
                    try {
                        var theme = this.loadTheme(JSON.parse(sys.getFileContent(this.themeInfo[i][2])));
                        this.themes[theme.name.toLowerCase()] = theme;
                        if (!this.themeInfo[i][3]) theme.enabled = false;
                    } catch (err) {
                        msgAll("Error loading cached theme \"" + this.themeInfo[i][0] + "\": " + err);
                    }
                }
            };
            ThemeManager.prototype.saveToFile = function (plain_theme) {
                if (typeof sys != "object") return;
                var fname = "theme_" + plain_theme.name.toLowerCase();
                sys.writeToFile(fname, JSON.stringify(plain_theme));
                this.themeInfo.push([plain_theme.name, "", fname, true]);
                sys.writeToFile("metadata.json", JSON.stringify({
                    'meta': this.themeInfo
                }));
            };
            ThemeManager.prototype.loadWebTheme = function (url, announce, update, updatename) {
                if (typeof sys != 'object') return;
                var manager = this;
                sys.webCall(url, function (resp) {
                    try {
                        var plain_theme = JSON.parse(resp);
                        var theme = manager.loadTheme(plain_theme);
                        var lower = theme.name.toLowerCase();
                        if (manager.themes.hasOwnProperty(lower) && !update) {
                            msgAll("Won't update " + theme.name + " with /add, use /update to force an update");
                            return;
                        }
                        if (manager.themes.hasOwnProperty(lower) && update && updatename && updatename != lower) {
                            msgAll("Won't update '" + updatename + "' to '" + theme.name + "', use the old name.");
                            return;
                        }
                        manager.themes[lower] = theme;
                        manager.save(theme.name, url, resp, update);
                        if (announce) {
                            msgAll("Loaded theme " + theme.name);
                        }
                    } catch (err) {
                        msgAll("Couldn't download theme from " + url);
                        msgAll("" + err);
                        return;
                    }
                });
            };
            ThemeManager.prototype.remove = function (src, name) {
                name = name.toLowerCase();
                if (name in this.themes) {
                    delete this.themes[name];
                    for (var i = 0; i < this.themeInfo.length; ++i) {
                        if (cmp(name, this.themeInfo[i][0])) {
                            this.themeInfo.splice(i, 1);
                            break;
                        }
                    }
                    sys.writeToFile("metadata.json", JSON.stringify({
                        'meta': this.themeInfo
                    }));
                    msg(src, "theme " + name + " removed.");
                }
            };
            ThemeManager.prototype.enable = function (src, name) {
                name = name.toLowerCase();
                if (name in this.themes) {
                    this.themes[name].enabled = true;
                    for (var i = 0; i < this.themeInfo.length; ++i) {
                        if (cmp(name, this.themeInfo[i][0])) {
                            this.themeInfo[i][3] = true;
                            break;
                        }
                    }
                    sys.writeToFile("metadata.json", JSON.stringify({
                        'meta': this.themeInfo
                    }));
                    msg(src, "theme " + name + " enabled.");
                }
            };
            ThemeManager.prototype.disable = function (src, name) {
                name = name.toLowerCase();
                if (name in this.themes) {
                    this.themes[name].enabled = false;
                    for (var i = 0; i < this.themeInfo.length; ++i) {
                        if (cmp(name, this.themeInfo[i][0])) {
                            this.themeInfo[i][3] = false;
                            break;
                        }
                    }
                    sys.writeToFile("metadata.json", JSON.stringify({
                        'meta': this.themeInfo
                    }));
                    msg(src, "theme " + name + " disabled.");
                }
            };
/* Theme is a small helper to organize themes
   * inside the mafia game */

            function Theme() {}
            Theme.prototype.toString = function () {
                return "[object Theme]";
            };
            Theme.prototype.addSide = function (obj) {
                this.sideTranslations[obj.side] = obj.translation;
                if ("winmsg" in obj) {
                    this.sideWinMsg[obj.side] = obj.winmsg;
                }
            };
            Theme.prototype.addRole = function (obj) {
                this.roles[obj.role] = obj;
                if (!obj.actions) {
                    obj.actions = {};
                }
                if (typeof obj.side == "object") {
                    this.randomSideRoles[obj.role] = obj.side;
                }
                var i, action;
                if ("hax" in obj.actions) {
                    for (i in obj.actions.hax) {
                        action = i;
                        if (!(action in this.haxRoles)) {
                            this.haxRoles[action] = [];
                        }
                        this.haxRoles[action].push(obj.role);
                    }
                }
                if ("night" in obj.actions) {
                    for (i in obj.actions.night) {
                        var priority = obj.actions.night[i].priority;
                        action = i;
                        var role = obj.role;
                        this.nightPriority.push({
                            'priority': priority,
                            'action': action,
                            'role': role
                        });
                    }
                    this.nightPriority.sort(function (a, b) {
                        return a.priority - b.priority;
                    });
                }
                if ("standby" in obj.actions) {
                    this.standbyRoles.push(obj.role);
                }
            };
            Theme.prototype.generateRoleInfo = function () {
                var sep = "*** *********************************************************************** ***";
                var roles = [sep];
                var role;
                var role_i = null;
                var role_order = Object.keys(this.roles);
                var this_roles = this.roles;
                role_order.sort(function (a, b) {
                    var tra = this_roles[a].translation;
                    var trb = this_roles[b].translation;
                    if (tra == trb) return 0;
                    else if (tra < trb) return -1;
                    else return 1;
                });

                function trrole(s) {
                    return this.trrole(s);
                }

                function trside(s) {
                    return this.trside(s);
                }
                for (var r = 0; r < role_order.length; ++r) {
                    try {
                        role = this.roles[role_order[r]];
                        roles.push("±Role: " + role.translation);
                        // check which abilities the role has
                        var abilities = "",
                            a, ability;
                        if ("info" in role) {
                            abilities += role.info;
                        } else {
                            if (role.actions.night) {
                                for (a in role.actions.night) {
                                    ability = role.actions.night[a];
                                    abilities += "Can " + a + " " + ("limit" in ability ? ability.limit + " persons" : "one person") + " during the night. ";
                                    if ("avoidHax" in role.actions && role.actions.avoidHax.indexOf(a) != -1) {
                                        abilities += "(Can't be detected by spies.) ";
                                    }
                                }
                            }
                            if (role.actions.standby) {
                                for (a in role.actions.standby) {
                                    ability = role.actions.standby[a];
                                    abilities += "Can " + a + " " + ("limit" in ability ? ability.limit + " persons" : "one person") + " during the standby. ";
                                }
                            }
                            if ("vote" in role.actions) {
                                abilities += "Vote counts as " + role.actions.vote + ". ";
                            }
                            if ("voteshield" in role.actions) {
                                abilities += "Receives " + role.actions.voteshield + " extra votes if voted for at all. ";
                            }
                            if ("kill" in role.actions) {
                                if (role.actions.kill.mode == "ignore") {
                                    abilities += "Can't be nightkilled. ";
                                } else if (role.actions.kill.mode == "killattackerevenifprotected") {
                                    abilities += "Revenges nightkills (even when protected). ";
                                } else if (role.actions.kill.mode == "killattacker") {
                                    abilities += "Revenges nightkills. ";
                                } else if (role.actions.kill.mode == "poisonattacker" || role.actions.kill.mode == "poisonattackerevenifprotected") {
                                    abilities += "Poison attacker when killed. ";
                                } else if (typeof role.actions.kill.mode == "object") {
                                    if ("ignore" in role.actions.kill.mode) {
                                        var ignoreRoles = role.actions.kill.mode.ignore.map(trrole, this);
                                        abilities += "Can't be nightkilled by " + readable(ignoreRoles, "and") + ". ";
                                    }
                                    if ("evadeChance" in role.actions.kill.mode && role.actions.kill.mode.evadeChance > 0) {
                                        abilities += "Has a " + Math.floor(role.actions.kill.mode.evadeChance * 100) + "% chance of evading nightkills. ";
                                    }
                                }
                            }
                            if ("daykill" in role.actions) {
                                if (role.actions.daykill == "evade") {
                                    abilities += "Can't be daykilled. ";
                                } else if (role.actions.daykill == "revenge") {
                                    abilities += "Counter daykills. ";
                                } else if (role.actions.daykill == "bomb") {
                                    abilities += "Revenges daykills. ";
                                } else if (typeof role.actions.daykill == "object" && typeof role.actions.daykill.mode == "object" && role.actions.daykill.mode.evadeChance > 0) {
                                    abilities += "Has a " + Math.floor(role.actions.daykill.mode.evadeChance * 100) + "% chance of evading daykills. ";
                                } else if (role.actions.daykill == "revealkiller") {
                                    abilities += "Reveals killer when daykilled. ";
                                }
                            }
                            if ("poison" in role.actions) {
                                if (role.actions.poison.mode == "ignore") {
                                    abilities += "Can't be poisoned. ";
                                } else if (typeof role.actions.poison.mode == "object" && role.actions.poison.mode.evadeChance > 0) {
                                    abilities += "Has a " + Math.floor(role.actions.poison.mode.evadeChance * 100) + "% chance of evading poison. ";
                                }
                            }
                            if ("hax" in role.actions && Object.keys) {
                                var haxy = Object.keys(role.actions.hax);
                                abilities += "Gets hax on " + readable(haxy, "and") + ". ";
                            }
                            if ("inspect" in role.actions) {
                                if (Array.isArray(role.actions.inspect.revealAs)) {
                                    var revealAs = role.actions.inspect.revealAs.map(trrole, this);
                                    abilities += "Reveals as " + readable(revealAs, "or") + " when inspected. ";
                                } else if (role.actions.inspect.revealAs == "*") {
                                    abilities += "Reveals as a random role when inspected. ";
                                } else {
                                    abilities += "Reveals as " + this.roles[role.actions.inspect.revealAs].translation + " when inspected. ";
                                }
                            }
                            if ("distract" in role.actions) {
                                if (role.actions.distract.mode == "ChangeTarget") abilities += "Kills any distractors. ";
                                if (role.actions.distract.mode == "ignore") abilities += "Ignores any distractors. ";
                            }
                            if ("initialCondition" in role.actions) {
                                if ("poison" in role.actions.initialCondition) {
                                    abilities += "Dies at the end of night " + (role.actions.initialCondition.poison.count || 2) + ". ";
                                }
                            }
                            if (typeof role.side == "string") {
                                abilities += "Sided with " + this.trside(role.side) + ". ";
                            } else if (typeof role.side == "object") {
                                var plop = Object.keys(role.side.random);
                                var tran = [];
                                for (var p = 0; p < plop.length; ++p) {
                                    tran.push(this.trside(plop[p]));
                                }
                                abilities += "Sided with " + readable(tran, "or") + ". ";
                            }
                            if (role.hasOwnProperty("winningSides")) {
                                if (role.winningSides == "*") {
                                    abilities += "Wins the game in any case. ";
                                } else if (Array.isArray(role.winningSides)) {
                                    // Argh give me Function.bind already ;~;
                                    abilities += "Wins the game with " + readable(role.winningSides.map(trside, this), "or");
                                }
                            }
                        }
                        roles.push("±Ability: " + abilities);
                        // check on which player counts the role appears
                        var parts = [];
                        var end = 0;
                        for (var i = 1; i <= this.roleLists; ++i) {
                            role_i = "roles" + i;
                            var start = this[role_i].indexOf(role.role);
                            var last = end;
                            end = this[role_i].length;
                            if (start >= 0) {
                                ++start;
                                start = start > last ? start : 1 + last;
                                if (parts.length > 0 && parts[parts.length - 1][1] == start - 1) {
                                    parts[parts.length - 1][1] = end;
                                } else {
                                    parts.push([start, end]);
                                    if (parts.length > 1) {
                                        parts[parts.length - 2] = parts[parts.length - 2][0] < parts[parts.length - 2][1] ? parts[parts.length - 2].join("-") : parts[parts.length - 2][1];
                                    }
                                }
                            }
                        }
                        if (parts.length > 0) {
                            parts[parts.length - 1] = parts[parts.length - 1][0] < parts[parts.length - 1][1] ? parts[parts.length - 1].join("-") : parts[parts.length - 1][1];
                        }
                        roles.push("±Game: " + parts.join(", ") + " Players");
                        roles.push(sep);
                    } catch (err) {
                        if (role_i === null) msgAll("Error adding role " + role.translation + "(" + role.role + ") to /roles");
                        else msgAll("Error making rolelist with role id: " + role_i);
                        throw err;
                    }
                }
                this.roleInfo = roles;
            };
            Theme.prototype.generateSideInfo = function () {
                var sep = "*** *********************************************************************** ***";
                var sides = [sep];
                var side;
                var side_order = Object.keys(this.sideTranslations);
                var this_sideTranslations = this.sideTranslations;
                // sort sides by name
                side_order.sort(function (a, b) {
                    var tra = this_sideTranslations[a];
                    var trb = this_sideTranslations[b];
                    if (tra == trb) return 0;
                    else if (tra < trb) return -1;
                    else return 1;
                });
                // sort roles by name
                var role;
                var role_order = Object.keys(this.roles);
                var this_roles = this.roles;
                role_order.sort(function (a, b) {
                    var tra = this_roles[a].translation;
                    var trb = this_roles[b].translation;
                    if (tra == trb) return 0;
                    else if (tra < trb) return -1;
                    else return 1;
                });
                // check each role for its side
                var side_list = {};
                var randomSide_list = [];
                for (var r = 0; r < role_order.length; ++r) {
                    try {
                        role = this.roles[role_order[r]];
                        if (typeof role.side == "string") {
                            if (side_list[role.side] === undefined) side_list[role.side] = [];
                            side_list[role.side].push(role.translation);
                        } else if (typeof role.side == "object" && role.side.random) {
                            var plop = Object.keys(role.side.random);
                            var tran = [];
                            for (var p = 0; p < plop.length; ++p) {
                                tran.push(this.trside(plop[p]));
                            }
                            randomSide_list.push("±Role: " + role.translation + " can be sided with " + readable(tran, "or") + ". ");
                        }
                    } catch (err) {
                        msgAll("Error adding role " + role.translation + "(" + role.role + ") to /sides");
                        throw err;
                    }
                }
                // writes the list of roles for each side
                for (var s = 0; s < side_order.length; ++s) {
                    try {
                        side = side_order[s];
                        if (side_list[side] !== undefined) sides.push("±Side: The " + this.trside(side) + " consists of " + side_list[side].join(", ") + ".");
                    } catch (err) {
                        msgAll("Error adding side " + this.trside(side) + "(" + side + ") to /sides");
                        throw err;
                    }
                }
                if (randomSide_list.length > 0) sides = sides.concat(randomSide_list);
                sides.push(sep);
                this.sideInfo = sides;
            }; /* Theme Loading and Storing */
            Theme.prototype.trside = function (side) {
                return this.sideTranslations[side];
            };
            Theme.prototype.trrole = function (role) {
                return this.roles[role].translation;
            };
            Theme.prototype.getHaxRolesFor = function (command) {
                if (command in this.haxRoles) {
                    return this.haxRoles[command];
                }
                return [];
            };
            // End of Theme
            this.isInGame = function (player) {
                if (this.state == "entry") {
                    return this.signups.indexOf(player) != -1;
                }
                return player in this.players;
            };
            // init
            this.themeManager = new ThemeManager();
            this.hasCommand = function (name, command, state) {
                var player = this.players[name];
                return (state in player.role.actions && command in player.role.actions[state]);
            };
            this.correctCase = function (string) {
                var lstring = string.toLowerCase();
                for (var x in this.players) {
                    if (x.toLowerCase() == lstring) return this.players[x].name;
                }
                // try to trim around if there's extra whitespace
                lstring = lstring.replace(/^\s+|\s+$/g, '');
                for (var y in this.players) {
                    if (y.toLowerCase() == lstring) return this.players[y].name;
                }
                return noPlayer;
            };
            this.clearVariables = function () { /* hash : playername => playerstruct */
                this.players = {};
                this.signups = [];
                this.state = "blank";
                this.ticks = 0;
                this.votes = {};
                this.voteCount = 0;
                this.ips = [];
                this.numjoins = {};
                this.resetTargets();
                // Recharges shouldn't be cleared between nights
                this.teamRecharges = {};
                this.roleRecharges = {};
            };
            this.lastAdvertise = 0;
            this.reduceRecharges = function () {
                var o, a;
                for (o in this.teamRecharges) {
                    for (a in this.teamRecharges[o]) {
                        if (this.teamRecharges[o][a] > 0)--this.teamRecharges[o][a];
                    }
                }
                for (o in this.roleRecharges) {
                    for (a in this.roleRecharges[o]) {
                        if (this.roleRecharges[o][a] > 0)--this.roleRecharges[o][a];
                    }
                }
                for (var p in this.players) {
                    for (o in this.players[p].recharges) {
                        if (this.players[p].recharges[o] > 0)--this.players[p].recharges[o];
                    }
                }
            };
            this.resetTargets = function () {
                this.teamTargets = {};
                this.roleTargets = {};
                for (var p in this.players) {
                    this.players[p].targets = {};
                    this.players[p].dayKill = undefined;
                    this.players[p].revealUse = undefined;
                    this.players[p].exposeUse = undefined;
                    this.players[p].guarded = undefined;
                    this.players[p].safeguarded = undefined;
                }
            };
            this.clearVariables(); /* callback for /start */
            this.userVote = function (src, commandData) {
                var themeName = commandData.toLowerCase();
                if (this.state == "blank") {
                    this.state = "voting";
                    this.ticks = 20;
                    this.votes = {};
                    this.possibleThemes = {};
                    var total = 5;
                    var i;
                    if (PreviousGames.length === 0 || PreviousGames.slice(-1)[0].what != "default") {
                        this.possibleThemes["default"] = 0;
                        --total;
                    }
                    var allThemes = Object.keys(this.themeManager.themes);
                    var Check = PreviousGames.slice(-Config.Mafia.norepeat).reverse().map(function (g) {
                        return g.what;
                    });
                    if (themeName in this.themeManager.themes && this.themeManager.themes[themeName].enabled) {
                        if (Check.indexOf(themeName) == -1 && themeName != "default") {
                            if (!(themeName in this.possibleThemes)) {
                                this.possibleThemes[themeName] = 0;
                                --total;
                            }
                        }
                    }
                    while (allThemes.length > 0 && total > 0) {
                        var indx = Math.floor(allThemes.length * Math.random());
                        var name = allThemes[indx];
                        allThemes.splice(indx, 1);
                        // exclude themes played recently
                        if (name != "default" && Check.indexOf(name) != -1) {
                            continue;
                        }
                        // exclude disabled themes
                        if (this.themeManager.themes[name].enabled && !(name in this.possibleThemes)) {
                            this.possibleThemes[name] = 0;
                            --total;
                        }
                    }
                    border = DEFAULT_BORDER;
                    sys.sendAll("", mafiachan);
                    sys.sendAll(border, mafiachan);
                    sys.sendAll("±Game: " + sys.name(src) + " started a voting for next game's theme!. You have " + this.ticks + " seconds to vote with /votetheme!", mafiachan);
                    sys.sendAll("±Game: Choose from these themes: " + Object.keys(this.possibleThemes).join(", ") + " !", mafiachan);
                    sys.sendAll(border, mafiachan);
                    sys.sendAll("", mafiachan);
                }
                if (this.state != "voting") {
                    sys.sendMessage(src, "±Game: This command makes no sense during a game, right?!", mafiachan);
                    return;
                }
                if (this.canJoin(src) !== true) {
                    return;
                }
                if (!this.possibleThemes.hasOwnProperty(themeName)) {
                    sys.sendMessage(src, "±Game: You can not vote this theme!", mafiachan);
                    return;
                }
                var ip = sys.ip(src);
                if (this.votes.hasOwnProperty(ip)) {
                    if (this.votes[ip] != themeName) sys.sendAll("±Game: " + sys.name(src) + " changed their vote to " + this.themeManager.themes[themeName].name + "!", mafiachan);
                } else {
                    sys.sendAll("±Game: " + sys.name(src) + " voted for " + this.themeManager.themes[themeName].name + "!", mafiachan);
                }
                this.votes[sys.ip(src)] = {
                    theme: themeName,
                    who: sys.name(src)
                };
            }; /* callback for /realstart */
            this.startGame = function (src, commandData) {
                var now = (new Date()).getTime();
                if (src !== null) {
                    if (JSESSION.users(src).mafia_start !== undefined && JSESSION.users(src).mafia_start + 5000 > now) {
                        sys.sendMessage(src, "±Game: Wait a moment before trying to start again!", mafiachan);
                        return;
                    }
                    JSESSION.users(src).mafia_start = now;
                }
                if (this.state != "blank") {
                    sys.sendMessage(src, "±Game: A game is going on. Wait until it's finished to start another one", mafiachan);
                    sys.sendMessage(src, "±Game: You can join the game by typing /join !", mafiachan);
                    return;
                }
                var previous = this.theme ? this.theme.name : undefined;
                var themeName = commandData == noPlayer ? "default" : commandData.toLowerCase();
                // Prevent a single player from dominating the theme selections.
                // We exclude mafia admins from this.
                var i;
                if (src) {
                    var PlayerCheck = PreviousGames.slice(-5).reverse();
                    if (!this.isMafiaAdmin(src)) {
                        for (i = 0; i < PlayerCheck.length; i++) {
                            var who = PlayerCheck[i].who;
                            var what = PlayerCheck[i].what;
                            if (who == sys.name(src)) {
                                sys.sendMessage(src, "±Game: Sorry, you have started a game " + (i + 1) + " games ago, let someone else have a chance!", mafiachan);
                                return;
                            }
                            if (themeName !== "default" && what == themeName) {
                                sys.sendMessage(src, "±Game: This theme was started " + (i + 1) + " games ago! No repeat!", mafiachan);
                                return;
                            }
                        }
                    }
                    if (themeName in this.themeManager.themes) {
                        if (!this.themeManager.themes[themeName].enabled) {
                            sys.sendMessage(src, "±Game: This theme is disabled!", mafiachan);
                            return;
                        }
                        this.theme = this.themeManager.themes[themeName];
                    } else {
                        sys.sendMessage(src, "±Game: No such theme!", mafiachan);
                        return;
                    }
                } else {
                    this.theme = this.themeManager.themes[themeName];
                }
                border = this.theme.border ? this.theme.border : DEFAULT_BORDER;
                CurrentGame = {
                    who: src !== null ? sys.name(src) : "voted",
                    what: themeName,
                    when: parseInt(sys.time(), 10),
                    playerCount: 0
                };
                if (src !== null) {
                    sys.sendAll("", mafiachan);
                    sys.sendAll(border, mafiachan);
                    if (this.theme.name == "default") {
                        sys.sendAll("±Game: " + sys.name(src) + " started a game!", mafiachan);
                    } else {
                        sys.sendAll("±Game: " + sys.name(src) + " started a game with theme " + this.theme.name + "!", mafiachan);
                    }
                    sys.sendAll("±Game: Type /Join to enter the game!", mafiachan);
                    sys.sendAll(border, mafiachan);
                    sys.sendAll("", mafiachan);
                }
                if (this.theme.summary === undefined) {
                    sys.sendAll("±Game: Consider adding a summary field to this theme that describes the setting of the game and points out the odd quirks of the theme!", mafiachan);
                } else {
                    sys.sendAll("±Game: " + this.theme.summary, mafiachan);
                }
                if (sys.playersOfChannel(mafiachan).length < 150) {
                    var time = parseInt(sys.time(), 10);
                    if (time > this.lastAdvertise + 60 * 15) {
                        this.lastAdvertise = time;
                        sys.sendAll("", 0);
                        sys.sendAll(border, 0);
                        if (this.theme.name == "default") {
                            sys.sendAll("±Game: A new mafia game was started at #" + sys.channel(mafiachan) + "!", 0);
                        } else {
                            sys.sendAll("±Game: A new " + this.theme.name + "-themed mafia game was started at #" + sys.channel(mafiachan) + "!", 0);
                        }
                        sys.sendAll(border, 0);
                        sys.sendAll("", 0);
                    }
                }
                this.clearVariables();
                mafia.state = "entry";
                mafia.ticks = 60;
            }; /* callback for /end */
            this.endGame = function (src) {
                if (mafia.state == "blank") {
                    sys.sendMessage(src, "±Game: No game is going on.", mafiachan);
                    return;
                }
                sys.sendAll(border, mafiachan);
                sys.sendAll("±Game: " + (src ? sys.name(src) : Config.Mafia.bot) + " has stopped the game!", mafiachan);
                sys.sendAll(border, mafiachan);
                sys.sendAll("", mafiachan);
                mafia.clearVariables();
                runUpdate();
            }; /* called every second */
            this.tickDown = function () {
                if (this.ticks <= 0) {
                    return;
                }
                this.ticks = this.ticks - 1;
                if (this.ticks === 0) {
                    this.callHandler(this.state);
                } else {
                    if (this.ticks == 30 && this.state == "entry") {
                        sys.sendAll("", mafiachan);
                        sys.sendAll("±Game: Hurry up, you only have " + this.ticks + " seconds more to join!", mafiachan);
                        sys.sendAll("", mafiachan);
                    }
                }
            };
            this.sendPlayer = function (player, message) {
                var id = sys.id(player);
                if (id === undefined) return;
                sys.sendMessage(id, message, mafiachan);
            };
            // Grab a list of all roles belonging to a given team.
            this.getRolesForTeam = function (side) {
                var team = [];
                for (var p in this.players) {
                    var player = this.players[p];
                    if (player.role.side == side) {
                        team.push(player.role.translation);
                    }
                }
                return team.sort(); // Sort as to not give out the order.
            };
            this.getRolesForTeamS = function (side) {
                return mafia.getRolesForTeam(side).join(", ");
            };
            this.getPlayersForTeam = function (side) {
                var team = [];
                for (var p in this.players) {
                    var player = this.players[p];
                    if (player.role.side == side) {
                        team.push(player.name);
                    }
                }
                return team;
            };
            this.getPlayersForTeamS = function (side) {
                return mafia.getPlayersForTeam(side).join(", ");
            };
            this.getPlayersForRole = function (role) {
                var team = [];
                for (var p in this.players) {
                    var player = this.players[p];
                    if (player.role.role == role) {
                        team.push(player.name);
                    }
                }
                return team;
            };
            this.getPlayersForRoleS = function (role) {
                return mafia.getPlayersForRole(role).join(", ");
            };
            this.getCurrentRoles = function () {
                var list = [];
                for (var p in this.players) {
                    if (typeof this.players[p].role.actions.onlist === "string") list.push(this.theme.trrole(this.players[p].role.actions.onlist));
                    else list.push(this.players[p].role.translation);
                } /* Sorting to not give out the order of the roles per player */
                return list.sort().join(", ");
            };
            this.getCurrentPlayers = function () {
                var list = [];
                for (var p in this.players) {
                    list.push(this.players[p].name);
                }
                return list.sort().join(", ");
            };
            this.player = function (role) {
                for (var p in this.players) {
                    if (mafia.players[p].role.role == role) //Checks sequentially all roles to see if this is the good one
                    return p;
                }
                return noPlayer;
            };
            this.removePlayer = function (player) {
                //sys.sendAll("removing player " + player.name, mafiachan);
                for (var action in player.role.actions.night) {
                    var targetMode = player.role.actions.night[action].target;
                    var team = this.getPlayersForTeam(player.role.side);
                    var role = this.getPlayersForRole(player.role.role);
                    if ((targetMode == 'AnyButSelf' || targetMode == 'Any') || (targetMode == 'AnyButTeam' && team.length == 1) || (targetMode == 'AnyButRole' && role.length == 1)) {
                        this.removeTarget(player, action);
                    }
                }
                if (mafia.votes.hasOwnProperty(player.name)) delete mafia.votes[player.name];
                delete this.players[player.name];
            };
            this.kill = function (player) {
                if (this.theme.killmsg) {
                    sys.sendAll(this.theme.killmsg.replace(/~Player~/g, player.name).replace(/~Role~/g, player.role.translation), mafiachan);
                } else {
                    sys.sendAll("±Kill: " + player.name + " (" + player.role.translation + ") died!", mafiachan);
                }
                this.removePlayer(player);
            };
            this.removeTargets = function (player) {
                for (var action in player.role.actions.night) {
                    this.removeTarget(player, action);
                }
            };
            this.removeTarget = function (player, action) {
                var targetMode = player.role.actions.night[action].common;
                if (targetMode == 'Self') {
                    player.targets[action] = [];
                } else if (targetMode == 'Team') {
                    if (!(player.role.side in this.teamTargets)) {
                        this.teamTargets[player.role.side] = {};
                    }
                    this.teamTargets[player.role.side][action] = [];
                } else if (targetMode == 'Role') {
                    if (!(player.role.role in this.roleTargets)) {
                        this.roleTargets[player.role.role] = {};
                    }
                    this.roleTargets[player.role.role][action] = [];
                }
            };
            this.setRechargeFor = function (player, phase, action, count) {
                var commonTarget = player.role.actions[phase][action].common;
                if (commonTarget == 'Self') {
                    player.recharges[action] = count;
                } else if (commonTarget == 'Team') {
                    if (!(player.role.side in this.teamRecharges)) {
                        this.teamRecharges[player.role.side] = {};
                    }
                    this.teamRecharges[player.role.side][action] = count;
                } else if (commonTarget == 'Role') {
                    if (!(player.role.role in this.roleRecharges)) {
                        this.roleRecharges[player.role.role] = {};
                    }
                    this.roleRecharges[player.role.role][action] = count;
                }
            };
            this.getRecharge = function (player, phase, action) {
                var commonTarget = player.role.actions[phase][action].common;
                if (commonTarget == 'Self') {
                    return player.recharges[action];
                } else if (commonTarget == 'Team') {
                    if (!(player.role.side in this.teamRecharges)) {
                        this.teamRecharges[player.role.side] = {};
                    }
                    return this.teamRecharges[player.role.side][action];
                } else if (commonTarget == 'Role') {
                    if (!(player.role.role in this.roleRecharges)) {
                        this.roleRecharges[player.role.role] = {};
                    }
                    return this.roleRecharges[player.role.role][action];
                }
            };
            this.getTargetsFor = function (player, action) {
                var commonTarget = player.role.actions.night[action].common;
                if (commonTarget == 'Self') {
                    if (!(action in player.targets)) {
                        player.targets[action] = [];
                    }
                    return player.targets[action];
                } else if (commonTarget == 'Team') {
                    if (!(player.role.side in this.teamTargets)) {
                        this.teamTargets[player.role.side] = {};
                    }
                    if (!(action in this.teamTargets[player.role.side])) {
                        this.teamTargets[player.role.side][action] = [];
                    }
                    return this.teamTargets[player.role.side][action];
                } else if (commonTarget == 'Role') {
                    if (!(player.role.role in this.roleTargets)) {
                        this.roleTargets[player.role.role] = {};
                    }
                    if (!(action in this.roleTargets[player.role.role])) {
                        this.roleTargets[player.role.role][action] = [];
                    }
                    return this.roleTargets[player.role.role][action];
                }
            };
            this.setTarget = function (player, target, action) {
                var commonTarget = player.role.actions.night[action].common;
                var limit = 1;
                if (player.role.actions.night[action].limit !== undefined) {
                    limit = player.role.actions.night[action].limit;
                }
                var list;
                if (commonTarget == 'Self') {
                    if (!(action in player.targets)) {
                        player.targets[action] = [];
                    }
                    list = player.targets[action];
                } else if (commonTarget == 'Team') {
                    if (!(player.role.side in this.teamTargets)) {
                        this.teamTargets[player.role.side] = {};
                    }
                    if (!(action in this.teamTargets[player.role.side])) {
                        this.teamTargets[player.role.side][action] = [];
                    }
                    list = this.teamTargets[player.role.side][action];
                } else if (commonTarget == 'Role') {
                    if (!(player.role.role in this.roleTargets)) {
                        this.roleTargets[player.role.role] = {};
                    }
                    if (!(action in this.roleTargets[player.role.role])) {
                        this.roleTargets[player.role.role][action] = [];
                    }
                    list = this.roleTargets[player.role.role][action];
                }
                if (list.indexOf(target.name) == -1) {
                    list.push(target.name);
                    if (list.length > limit) {
                        list.splice(0, 1);
                    }
                }
                if (this.ticks > 0 && limit > 1) this.sendPlayer(player.name, "±Game: Your target(s) are " + list.join(', ') + "!");
            };
            this.setPlayerRole = function (player, role) {
                player.role = mafia.theme.roles[role];
                if (typeof mafia.theme.roles[role].side == "object") {
                    player.role.side = randomSample(mafia.theme.roles[role].side.random);
                }
                if ("night" in player.role.actions) {
                    for (var act in player.role.actions.night) {
                        if ("initialrecharge" in player.role.actions.night[act]) {
                            mafia.setRechargeFor(player, "night", act, player.role.actions.night[act].initialrecharge);
                        }
                    }
                }
                if ("initialCondition" in player.role.actions) {
                    var condition = player.role.actions.initialCondition;
                    if ("poison" in condition) {
                        player.poisoned = 1;
                        player.poisonCount = condition.poison.count || 2;
                        player.poisonDeadMessage = condition.poison.poisonDeadMessage;
                    }
                }
            };
            this.testWin = function () {
                if (Object.keys(mafia.players).length === 0) {
                    sys.sendAll("±Game: Everybody died! This is why we can't have nice things :(", mafiachan);
                    sys.sendAll(border, mafiachan);
                    mafia.clearVariables();
                    runUpdate();
                    return true;
                }
                outer: for (var p in mafia.players) {
                    var winSide = mafia.players[p].role.side;
                    if (winSide != 'village') {
                        for (var i in mafia.theme.villageCantLoseRoles) {
                            if (mafia.player(mafia.theme.villageCantLoseRoles[i]) != noPlayer)
                            // baddies shouldn't win if vigi, mayor or samurai is alive
                            continue outer;
                        }
                    }
                    //Roles which win when certain roles are dead
                    var winByDeadRoles;
                    if (mafia.players[p].role.hasOwnProperty("winIfDeadRoles")) {
                        var deadRoles = mafia.players[p].role.winIfDeadRoles;
                        winByDeadRoles = true;
                        for (var t = 0; t < deadRoles.length; ++t) {
                            if (mafia.getPlayersForRoleS(deadRoles[t]) !== "") {
                                winByDeadRoles = false;
                                break;
                            }
                        }
                    }
                    var players = [];
                    var goodPeople = [];
                    if (winByDeadRoles) {
                        players = mafia.getPlayersForTeam(mafia.players[p].role.side);
                    } else {
                        for (var x in mafia.players) {
                            // Roles which win with multiple sides
                            if (mafia.players[x].role.hasOwnProperty("winningSides")) {
                                var ws = mafia.players[x].role.winningSides;
                                if (ws == "*" || (Array.isArray(ws) && ws.indexOf(winSide) >= 0)) {
                                    players.push(x);
                                    continue; // inner
                                }
                            }
                            if (mafia.players[x].role.side == winSide) {
                                players.push(x);
                            } else if (winSide == 'village') {
                                // if winSide = villy all people must be good people
                                continue outer;
                            } else if (mafia.players[x].role.side == 'village') {
                                goodPeople.push(x);
                            } else {
                                // some other baddie team alive
                                continue outer;
                            }
                        }
                    }
                    if (winByDeadRoles || players.length >= goodPeople.length) {
                        if (winSide in mafia.theme.sideWinMsg) {
                            sys.sendAll(mafia.theme.sideWinMsg[winSide].replace(/~Players~/g, readable(players, "and")), mafiachan);
                        } else {
                            sys.sendAll("±Game: The " + mafia.theme.trside(winSide) + " (" + readable(players, "and") + ") wins!", mafiachan);
                        }
                        if (winByDeadRoles) {
                            var losingSides = [];
                            for (var tr in mafia.theme.sideTranslations) {
                                if (tr !== winSide && mafia.getPlayersForTeamS(tr) !== "") {
                                    losingSides.push(mafia.theme.trside(tr) + " (" + readable(mafia.getPlayersForTeam(tr), "and") + ")");
                                }
                            }
                            sys.sendAll("±Game: The " + readable(losingSides, "and") + " lose!", mafiachan);
                        } else if (goodPeople.length > 0) {
                            sys.sendAll("±Game: The " + mafia.theme.trside('village') + " (" + readable(goodPeople, "and") + ") lose!", mafiachan);
                        }
                        sys.sendAll(border, mafiachan);
                        mafia.clearVariables();
                        runUpdate();
                        return true;
                    }
                }
                return false;
            };

            function randomSample(hash) {
                var cum = 0;
                var val = Math.random();
                var psum = 0.0;
                var x;
                var count = 0;
                for (x in hash) {
                    psum += hash[x];
                    count += 1;
                }
                if (psum === 0.0) {
                    var j = 0;
                    for (x in hash) {
                        cum = (++j) / count;
                        if (cum >= val) {
                            return x;
                        }
                    }
                } else {
                    for (x in hash) {
                        cum += hash[x] / psum;
                        if (cum >= val) {
                            return x;
                        }
                    }
                }
            }
            this.handlers = {
                entry: function () {
                    sys.sendAll(border, mafiachan);
                    sys.sendAll("Times Up! :", mafiachan);
                    // Save stats if the game was played
                    CurrentGame.playerCount = mafia.signups.length;
                    PreviousGames.push(CurrentGame);
                    savePlayedGames();
                    if (mafia.signups.length < 5) {
                        sys.sendAll("Well, Not Enough Players! :", mafiachan);
                        sys.sendAll("You need at least 5 players to join (Current; " + mafia.signups.length + ").", mafiachan);
                        sys.sendAll(border, mafiachan);
                        mafia.clearVariables();
                        return;
                    } /* Resetting the Random Sides Object */
                    for (var x in mafia.theme.randomSideRoles) {
                        mafia.theme.roles[x].side = mafia.theme.randomSideRoles[x];
                    } /* Creating the roles list */
                    var i = 1;
                    while (mafia.signups.length > mafia.theme["roles" + i].length) {
                        ++i;
                    }
                    var srcArray = mafia.theme["roles" + i].slice(0, mafia.signups.length);
                    srcArray = shuffle(srcArray);
                    for (i = 0; i < srcArray.length; ++i) {
                        mafia.players[mafia.signups[i]] = {
                            'name': mafia.signups[i],
                            'role': mafia.theme.roles[srcArray[i]],
                            'targets': {},
                            'recharges': {}
                        };
                        var rechargeplayer = mafia.players[mafia.signups[i]];
                        var initPlayer = mafia.players[mafia.signups[i]];
                        if ("night" in initPlayer.role.actions) {
                            for (var act in initPlayer.role.actions.night) {
                                if ("initialrecharge" in initPlayer.role.actions.night[act]) {
                                    mafia.setRechargeFor(initPlayer, "night", act, initPlayer.role.actions.night[act].initialrecharge);
                                }
                            }
                        }
                        if ("initialCondition" in initPlayer.role.actions) {
                            var condition = initPlayer.role.actions.initialCondition;
                            if ("poison" in condition) {
                                initPlayer.poisoned = 1;
                                initPlayer.poisonCount = condition.poison.count || 2;
                                initPlayer.poisonDeadMessage = condition.poison.poisonDeadMessage;
                            }
                        }
                        if (typeof mafia.theme.roles[srcArray[i]].side == "object") {
                            if ("random" in mafia.theme.roles[srcArray[i]].side) {
                                var side = randomSample(mafia.theme.roles[srcArray[i]].side.random);
                                mafia.players[mafia.signups[i]].role.side = side;
                            }
                        }
                    }
                    sys.sendAll("The Roles have been Decided! :", mafiachan);
                    var p, player;
                    for (p in mafia.players) {
                        player = mafia.players[p];
                        var role = player.role;
                        if (typeof role.actions.startup == "object" && typeof role.actions.startup.revealAs == "string") {
                            mafia.sendPlayer(player.name, "±Game: You are a " + mafia.theme.trrole(role.actions.startup.revealAs) + "!");
                        } else {
                            mafia.sendPlayer(player.name, "±Game: You are a " + role.translation + "!");
                        }
                        mafia.sendPlayer(player.name, "±Game: " + role.help);
                        if (role.actions.startup == "team-reveal") {
                            mafia.sendPlayer(player.name, "±Game: Your team is " + mafia.getPlayersForTeamS(role.side) + ".");
                        }
                        if (role.actions.startup == "team-reveal-with-roles") {
                            var playersRole = mafia.getPlayersForTeam(role.side).map(function (x) {
                                return x + " (" + this.players[x].role.translation + ")";
                            }, mafia);
                            mafia.sendPlayer(player.name, "±Game: Your team is " + readable(playersRole, "and") + ".");
                        }
                        if (typeof role.actions.startup == "object" && Array.isArray(role.actions.startup["team-revealif"])) {
                            if (role.actions.startup["team-revealif"].indexOf(role.side) != -1) {
                                mafia.sendPlayer(player.name, "±Game: Your team is " + mafia.getPlayersForTeamS(role.side) + ".");
                            }
                        }
                        if (role.actions.startup == "role-reveal") {
                            mafia.sendPlayer(player.name, "±Game: People with your role are " + mafia.getPlayersForRoleS(role.role) + ".");
                        }
                        if (typeof role.actions.startup == "object" && role.actions.startup.revealRole) {
                            if (typeof role.actions.startup.revealRole == "string") {
                                if (mafia.getPlayersForRoleS(player.role.actions.startup.revealRole) !== "") mafia.sendPlayer(player.name, "±Game: The " + mafia.theme.roles[role.actions.startup.revealRole].translation + " is " + mafia.getPlayersForRoleS(player.role.actions.startup.revealRole) + "!");
                            } else if (Array.isArray(role.actions.startup.revealRole)) {
                                for (var s = 0, l = role.actions.startup.revealRole.length; s < l; ++s) {
                                    var revealrole = role.actions.startup.revealRole[s];
                                    if (mafia.getPlayersForRoleS(revealrole) !== "") mafia.sendPlayer(player.name, "±Game: The " + mafia.theme.roles[revealrole].translation + " is " + mafia.getPlayersForRoleS(revealrole) + "!");
                                }
                            }
                        }
                    }
                    sys.sendAll("Current Roles: " + mafia.getCurrentRoles() + ".", mafiachan);
                    sys.sendAll("Current Players: " + mafia.getCurrentPlayers() + ".", mafiachan);
                    // Send players all roles sided with them
                    for (p in mafia.players) {
                        player = mafia.players[p];
                        mafia.sendPlayer(player.name, "Current Team: " + mafia.getRolesForTeamS(player.role.side));
                    }
                    sys.sendAll("Time: Night", mafiachan);
                    sys.sendAll("Make your moves, you only have 30 seconds! :", mafiachan);
                    sys.sendAll(border, mafiachan);
                    mafia.ticks = 30;
                    mafia.state = "night";
                    mafia.resetTargets();
                    mafia.reduceRecharges();
                },
                night: function () {
                    sys.sendAll(border, mafiachan);
                    sys.sendAll("Times Up! :", mafiachan);
                    var nightkill = false;
                    var getTeam = function (role, commonTarget) {
                        var team = [];
                        if (commonTarget == 'Role') {
                            team = mafia.getPlayersForRole(role.role);
                        } else if (commonTarget == 'Team') {
                            team = mafia.getPlayersForTeam(role.side);
                        }
                        return team;
                    };
                    var stalkTargets = {};
                    for (var s in mafia.players) {
                        stalkTargets[s] = {};
                        if (!("night" in mafia.players[s].role.actions)) continue;
                        var targetActions = Object.keys(mafia.players[s].role.actions.night);
                        for (var act = 0; act < targetActions.length; ++act) {
                            var foundTargets = mafia.getTargetsFor(mafia.players[s], targetActions[act]);
                            for (var f = 0; f < foundTargets.length; ++f) {
                                stalkTargets[s][foundTargets[f]] = 1;
                            }
                        }
                    }
                    var player, names, j;
                    for (var i in mafia.theme.nightPriority) {
                        var o = mafia.theme.nightPriority[i];
                        names = mafia.getPlayersForRole(o.role);
                        var command = o.action;
                        var Action = mafia.theme.roles[o.role].actions.night[o.action];
                        if ("command" in Action) {
                            command = Action.command; // translate to real command
                        }
                        var rechargeCount = 0;
                        if ("recharge" in Action) { // a command that can only be used once every X nights
                            rechargeCount = Action.recharge;
                        }
                        //Fail chance for common:Role and Team
                        if (["Role", "Team"].indexOf(Action.common) != -1 && "failChance" in Action && Action.failChance > Math.random()) {
                            for (var f in names) {
                                if (mafia.getTargetsFor(mafia.players[names[f]], o.action).length > 0) {
                                    mafia.sendPlayer(names[f], "±Game: You couldn't " + o.action + " this night!");
                                }
                            }
                            continue;
                        }
                        for (j = 0; j < names.length; ++j) {
                            if (!mafia.isInGame(names[j])) continue;
                            player = mafia.players[names[j]];
                            var targets = mafia.getTargetsFor(player, o.action);
                            var target, t; // current target
                            //Fail chance for common:Self
                            if (Action.common == "Self" && "failChance" in Action && Action.failChance > Math.random()) {
                                if (targets.length > 0) {
                                    mafia.sendPlayer(player.name, "±Game: You couldn't " + o.action + " this night!");
                                }
                                continue;
                            }
                            // Limit the use of this command for the following nights
                            if (rechargeCount > 0 && targets.length > 0) {
                                // set the recharge period
                                mafia.setRechargeFor(player, "night", o.action, rechargeCount);
                            }
                            if (command == "distract") {
                                for (t in targets) {
                                    target = targets[t];
                                    if (!mafia.isInGame(target)) continue;
                                    target = mafia.players[target];
                                    var distractMode = target.role.actions.distract;
                                    if (distractMode === undefined) {} else if (target.safeguarded) {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was guarded!");
                                    } else if (distractMode.mode == "ChangeTarget") {
                                        mafia.sendPlayer(player.name, "±Game: " + distractMode.hookermsg);
                                        mafia.sendPlayer(target.name, "±Game: " + distractMode.msg.replace(/~Distracter~/g, player.role.translation));
                                        mafia.kill(player);
                                        nightkill = true;
                                        mafia.removeTargets(target);
                                        stalkTargets[target.name] = {};
                                        continue;
                                    } else if (distractMode.mode == "ignore") {
                                        if (distractMode.msg) mafia.sendPlayer(target.name, "±Game: " + distractMode.msg.replace(/~Distracter~/g, player.role.translation));
                                        continue;
                                    } else if (typeof distractMode.mode == "object" && (distractMode.mode.ignore == player.role.role || Array.isArray(distractMode.mode.ignore) && distractMode.mode.ignore.indexOf(player.role.role) > -1)) {
                                        if (distractMode.msg) mafia.sendPlayer(target.name, "±Game: " + distractMode.msg.replace(/~Distracter~/g, player.role.translation));
                                        continue;
                                    } else if (typeof distractMode.mode == "object" && Array.isArray(distractMode.mode.killif) && distractMode.mode.killif.indexOf(player.role.role) > -1) {
                                        if (distractMode.hookermsg) mafia.sendPlayer(player.name, "±Game: " + distractMode.hookermsg);
                                        if (distractMode.msg) mafia.sendPlayer(target.name, "±Game: " + distractMode.msg.replace(/~Distracter~/g, player.role.translation));
                                        mafia.kill(player);
                                        nightkill = true;
                                        mafia.removeTargets(target);
                                        stalkTargets[target.name] = {};
                                        continue;
                                    }
                                    // enables custom distracter message
                                    var distractCustomMsg = Action.distractmsg;
                                    // "distractmsg" item under "night" { "distract" }
                                    if (typeof distractCustomMsg == "string") {
                                        mafia.sendPlayer(target.name, "±Game: " + distractCustomMsg.replace(/~Distracter~/g, player.role.translation));
                                    } else {
                                        mafia.sendPlayer(target.name, "±Game: The " + player.role.translation + " came to you last night! You were too busy being distracted!");
                                    }
                                    mafia.removeTargets(target);
                                    stalkTargets[target.name] = {}; /* warn role / teammates */
                                    var teamMsg = Action.teammsg;
                                    // above defined "distract": { "teammsg": <string> }
                                    if ("night" in target.role.actions) {
                                        for (var action in target.role.actions.night) {
                                            var team = getTeam(target.role, target.role.actions.night[action].common);
                                            for (var x in team) {
                                                if (team[x] != target.name) {
                                                    // now we check if teammsg was defined for the role
                                                    if (teamMsg === undefined) {
                                                        mafia.sendPlayer(team[x], "±Game: Your teammate was too busy with the " + player.role.translation + " during the night, you decided not to " + action + " anyone during the night!");
                                                    } else if (typeof teamMsg == "string") {
                                                        mafia.sendPlayer(team[x], "±Game: " + teamMsg.replace(/~Distracter~/g, player.role.translation).replace(/~Action~/g, action));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if (command == "protect") {
                                for (t in targets) {
                                    target = targets[t];
                                    if (mafia.isInGame(target)) {
                                        target = mafia.players[target];
                                        if (!("protect" in target.role.actions && target.role.actions.protect.mode == "ignore")) {
                                            target.guarded = true;
                                        } else if (target.role.actions.protect.silent !== true) {
                                            mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was not affected by the protect!");
                                        }
                                    }
                                }
                            } else if (command == "inspect") {
                                for (t in targets) {
                                    target = targets[t];
                                    if (!mafia.isInGame(target)) continue;
                                    target = mafia.players[target];
                                    var inspectMode = target.role.actions.inspect || {};
                                    var Sight = Action.Sight;
                                    if (target.safeguarded) {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was guarded!");
                                    } else if (inspectMode.revealSide !== undefined || Sight === "Team") {
                                        mafia.sendPlayer(player.name, "±Info: " + target.name + " is sided with the " + mafia.theme.trside(target.role.side) + "!!");
                                    } else if (inspectMode.revealAs !== undefined) {
                                        if (typeof inspectMode.revealAs == "string") {
                                            if (inspectMode.revealAs == "*") {
                                                var rr = 1;
                                                while (mafia.signups.length > mafia.theme["roles" + rr].length) {
                                                    ++rr;
                                                }
                                                var rrole = mafia.theme["roles" + rr].slice(0, mafia.signups.length);
                                                mafia.sendPlayer(player.name, "±Info: " + target.name + " is the " + mafia.theme.trrole(rrole[Math.floor(Math.random() * rrole.length)]) + "!!");
                                            } else {
                                                mafia.sendPlayer(player.name, "±Info: " + target.name + " is the " + mafia.theme.trrole(inspectMode.revealAs) + "!!");
                                            }
                                        } else if (Array.isArray(inspectMode.revealAs)) {
                                            mafia.sendPlayer(player.name, "±Info: " + target.name + " is the " + mafia.theme.trrole(inspectMode.revealAs[Math.floor(Math.random() * inspectMode.revealAs.length)]) + "!!");
                                        }
                                    } else if (typeof Sight == "object") {
                                        var srole = randomSample(Sight);
                                        mafia.sendPlayer(player.name, "±Info: " + target.name + " is the " + mafia.theme.trrole((srole == "true") ? target.role.role : srole) + "!!");
                                    } else {
                                        mafia.sendPlayer(player.name, "±Info: " + target.name + " is the " + target.role.translation + "!!");
                                    }
                                }
                            } else if (command == "poison") {
                                for (t in targets) {
                                    target = targets[t];
                                    if (!mafia.isInGame(target)) continue;
                                    target = mafia.players[target];
                                    if (target.safeguarded) {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was guarded!");
                                    } else if ("poison" in target.role.actions && target.role.actions.poison.mode == "ignore") {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was immune to the poison!");
                                    } else if ("poison" in target.role.actions && typeof target.role.actions.poison.mode == "object" && target.role.actions.poison.mode.evadeChance > sys.rand(0, 100) / 100) {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") evaded the poison! Somehow.");
                                    } else if (target.poisoned === undefined || target.poisonCount - target.poisoned >= (Action.count ? Action.count : 2)) {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was poisoned!");
                                        target.poisoned = 1;
                                        target.poisonCount = Action.count || 2;
                                        target.poisonDeadMessage = Action.poisonDeadMessage;
                                    }
                                }
                            } else if (command == "safeguard") {
                                for (t in targets) {
                                    target = targets[t];
                                    if (mafia.isInGame(target)) {
                                        target = mafia.players[target];
                                        if (!("safeguard" in target.role.actions && target.role.actions.safeguard.mode == "ignore")) {
                                            target.safeguarded = true;
                                        } else if (target.role.actions.safeguard.silent !== true) {
                                            mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was not affected by the safeguard!");
                                        }
                                    }
                                }
                            } else if (command == "kill") {
                                for (t in targets) {
                                    target = targets[t];
                                    if (!mafia.isInGame(target)) continue;
                                    target = mafia.players[target];
                                    var revenge = false;
                                    var revengetext = "±Game: You were killed during the night!";
                                    if ("kill" in target.role.actions && (target.role.actions.kill.mode == "killattacker" && !target.guarded || target.role.actions.kill.mode == "killattackerevenifprotected")) {
                                        revenge = true;
                                        if (target.role.actions.kill.msg) revengetext = target.role.actions.kill.msg;
                                    } else if ("kill" in target.role.actions && (target.role.actions.kill.mode == "poisonattacker" && !target.guarded || target.role.actions.kill.mode == "poisonattackerevenifprotected")) {
                                        var targetAction = target.role.actions.kill;
                                        if (player.poisoned === undefined || player.poisonCount - player.poisoned >= (targetAction.count ? targetAction.count : 2)) {
                                            mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") poisoned you before dying!");
                                            player.poisoned = 1;
                                            player.poisonCount = targetAction.count || 2;
                                            player.poisonDeadMessage = targetAction.poisonDeadMessage;
                                        }
                                    }
                                    if (target.guarded) {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was protected!");
                                    } else if ("kill" in target.role.actions && target.role.actions.kill.mode == "ignore") {
                                        if (!target.role.actions.kill.msg) mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") evaded the kill!");
                                        else mafia.sendPlayer(player.name, target.role.actions.kill.msg.replace(/~Self~/g, target.name));
                                    } else if ("kill" in target.role.actions && typeof target.role.actions.kill.mode == "object" && target.role.actions.kill.mode.evadeChance > sys.rand(0, 100) / 100) {
                                        if (!target.role.actions.kill.msg) mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") evaded the kill!");
                                        else mafia.sendPlayer(player.name, target.role.actions.kill.msg.replace(/~Self~/g, target.name));
                                    } else if ("kill" in target.role.actions && typeof target.role.actions.kill.mode == "object" && Array.isArray(target.role.actions.kill.mode.ignore) && target.role.actions.kill.mode.ignore.indexOf(player.role.role) != -1) {
                                        if (!target.role.actions.kill.msg) mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") evaded the kill!");
                                        else mafia.sendPlayer(player.name, target.role.actions.kill.msg.replace(/~Self~/g, target.name));
                                    } else {
                                        if (!Action.msg) {
                                            if (mafia.theme.killusermsg) {
                                                mafia.sendPlayer(target.name, mafia.theme.killusermsg);
                                            } else {
                                                mafia.sendPlayer(target.name, "±Game: You were killed during the night!");
                                            }
                                        } else {
                                            mafia.sendPlayer(target.name, Action.msg); // custom kill message for the killer
                                        }
                                        mafia.kill(target);
                                        nightkill = true;
                                    }
                                    if (revenge) {
                                        mafia.sendPlayer(player.name, revengetext);
                                        mafia.kill(player);
                                        nightkill = true;
                                    }
                                }
                            } else if (command == "stalk") {
                                for (t in targets) {
                                    target = targets[t];
                                    if (mafia.isInGame(target) && target.safeguarded) {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was guarded!");
                                    } else {
                                        var visited = Object.keys(stalkTargets[target]).sort();
                                        if (visited.length > 0) {
                                            mafia.sendPlayer(player.name, "±Game: Your target (" + target + ") visited " + readable(visited, "and") + " this night!");
                                        } else {
                                            mafia.sendPlayer(player.name, "±Game: Your target (" + target + ") didn't visit anyone this night!");
                                        }
                                    }
                                }
                            } else if (command == "convert") {
                                for (t in targets) {
                                    target = targets[t];
                                    if (!mafia.isInGame(target)) continue;
                                    target = mafia.players[target];
                                    if (mafia.isInGame(target) && target.safeguarded) {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was guarded!");
                                    } else if ("convert" in target.role.actions && target.role.actions.convert.mode == "ignore") {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") couldn't be converted!");
                                    } else if ("canConvert" in Action && Action.canConvert != "*" && Action.canConvert.indexOf(target.role.role) == -1) {
                                        mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") couldn't be converted!");
                                    } else {
                                        var oldRole = target.role;
                                        var newRole;
                                        if (typeof Action.newRole == "object") {
                                            for (var nr in Action.newRole) {
                                                if (Action.newRole[nr].indexOf(oldRole.role) != -1) {
                                                    newRole = nr;
                                                    break;
                                                }
                                            }
                                        } else {
                                            newRole = Action.newRole;
                                        }
                                        if (newRole === undefined) {
                                            mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") couldn't be converted!");
                                        } else {
                                            mafia.setPlayerRole(target, newRole);
                                            if (!Action.silent) {
                                                if ("convertmsg" in Action) {
                                                    sys.sendAll("±Game: " + Action.convertmsg.replace(/~Old~/g, oldRole.translation).replace(/~New~/g, target.role.translation), mafiachan);
                                                } else {
                                                    sys.sendAll("±Game: A " + oldRole.translation + " has been converted into a " + target.role.translation + "!", mafiachan);
                                                }
                                            }
                                            mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") has been converted and is now a " + target.role.translation + "!");
                                            mafia.sendPlayer(target.name, "±Game: You have been converted and changed roles!");
                                            mafia.showOwnRole(sys.id(target.name));
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // decrease counters
                    for (var p in mafia.players) {
                        player = mafia.players[p];
                        var poisonCount = player.poisonCount;
                        if (poisonCount !== undefined) {
                            if (player.poisoned < poisonCount) {
                                mafia.sendPlayer(player.name, "±Game: You have " + (player.poisonCount - player.poisoned) + " days to live.");
                                player.poisoned++;
                            } else if (player.poisoned >= poisonCount) {
                                mafia.sendPlayer(player.name, "±Game: " + (player.poisonDeadMessage ? player.poisonDeadMessage : "You died because of Poison!"));
                                mafia.kill(player);
                                nightkill = true; // kinda night kill
                            }
                        }
                    }
                    this.reduceRecharges();
                    if (!nightkill) {
                        sys.sendAll("No one died! :", mafiachan);
                    }
                    if (mafia.testWin()) {
                        return;
                    }
                    mafia.ticks = 30;
                    if (mafia.players.length >= 15) {
                        mafia.ticks = 40;
                    } else if (mafia.players.length <= 4) {
                        mafia.ticks = 15;
                    }
                    sys.sendAll(border, mafiachan);
                    sys.sendAll("Current Roles: " + mafia.getCurrentRoles() + ".", mafiachan);
                    sys.sendAll("Current Players: " + mafia.getCurrentPlayers() + ".", mafiachan);
                    // Send players all roles sided with them
                    for (p in mafia.players) {
                        player = mafia.players[p];
                        var side = player.role.side;
                        mafia.sendPlayer(player.name, "Current Team: " + mafia.getRolesForTeamS(side));
                    }
                    sys.sendAll("Time: Day", mafiachan);
                    sys.sendAll("You have " + mafia.ticks + " seconds to debate who are the bad guys! :", mafiachan);
                    for (var role in mafia.theme.standbyRoles) {
                        names = mafia.getPlayersForRole(mafia.theme.standbyRoles[role]);
                        for (j = 0; j < names.length; ++j) {
                            for (var k in mafia.players[names[j]].role.actions.standby) {
                                mafia.sendPlayer(names[j], mafia.players[names[j]].role.actions.standby[k].msg);
                            }
                        }
                    }
                    sys.sendAll(border, mafiachan);
                    mafia.state = "standby";
                },
                standby: function () {
                    mafia.ticks = 30;
                    sys.sendAll(border, mafiachan);
                    sys.sendAll("Current Roles: " + mafia.getCurrentRoles() + ".", mafiachan);
                    sys.sendAll("Current Players: " + mafia.getCurrentPlayers() + ".", mafiachan);
                    // Send players all roles sided with them
                    for (var p in mafia.players) {
                        var player = mafia.players[p];
                        var side = player.role.side;
                        mafia.sendPlayer(player.name, "Current Team: " + mafia.getRolesForTeamS(side));
                    }
                    sys.sendAll("Time: Day", mafiachan);
                    sys.sendAll("It's time to vote someone off, type /Vote [name],  you only have " + mafia.ticks + " seconds! :", mafiachan);
                    sys.sendAll(border, mafiachan);
                    mafia.state = "day";
                    mafia.votes = {};
                    mafia.voteCount = 0;
                },
                day: function () {
                    sys.sendAll(border, mafiachan);
                    sys.sendAll("Times Up! :", mafiachan);
                    var voted = {},
                        player;
                    for (var pname in mafia.votes) {
                        player = mafia.players[pname];
                        var target = mafia.votes[pname];
                        // target play have been killed meanwhile by slay
                        if (!mafia.isInGame(target)) continue;
                        if (!(target in voted)) {
                            voted[target] = 0;
                        }
                        if (player.role.actions.vote !== undefined) {
                            voted[target] += player.role.actions.vote;
                        } else {
                            voted[target] += 1;
                        }
                    }
                    var tie = true;
                    var maxi = 0;
                    var downed = noPlayer;
                    for (var x in voted) {
                        player = mafia.players[x];
                        if (player.role.actions.voteshield !== undefined) voted[x] += player.role.actions.voteshield;
                        if (voted[x] == maxi) {
                            tie = true;
                        } else if (voted[x] > maxi) {
                            tie = false;
                            maxi = voted[x];
                            downed = x;
                        }
                    }
                    if (tie) {
                        sys.sendAll("No one was voted off! :", mafiachan);
                        sys.sendAll(border, mafiachan);
                    } else {
                        var roleName = typeof mafia.players[downed].role.actions.lynch == "object" && typeof mafia.players[downed].role.actions.lynch.revealAs == "string" ? mafia.theme.trrole(mafia.players[downed].role.actions.lynch.revealAs) : mafia.players[downed].role.translation;
                        sys.sendAll("±Game: " + downed + " (" + roleName + ") was removed from the game!", mafiachan);
                        mafia.removePlayer(mafia.players[downed]);
                        if (mafia.testWin()) return;
                    }
                    sys.sendAll("Current Roles: " + mafia.getCurrentRoles() + ".", mafiachan);
                    sys.sendAll("Current Players: " + mafia.getCurrentPlayers() + ".", mafiachan);
                    // Send players all roles sided with them
                    for (var p in mafia.players) {
                        player = mafia.players[p];
                        var side = player.role.side;
                        mafia.sendPlayer(player.name, "Current Team: " + mafia.getRolesForTeamS(side));
                    }
                    sys.sendAll("Time: Night", mafiachan);
                    sys.sendAll("Make your moves, you only have 30 seconds! :", mafiachan);
                    sys.sendAll(border, mafiachan);
                    mafia.ticks = 30;
                    mafia.state = "night";
                    mafia.resetTargets();
                },
                voting: function () {
                    this.state = "blank";
                    var res = {},
                        theme, players = {},
                        ips = {};
                    for (var ip in this.votes) {
                        theme = this.votes[ip].theme;
                        res[theme] = ++res[theme] || 1;
                        players[theme] = players[theme] || [];
                        players[theme].push(this.votes[ip].who);
                        ips[theme] = ips[theme] || [];
                        ips[theme].push(ip);
                    }
                    var winner = {
                        votes: -1,
                        theme: null
                    };
                    for (theme in res) {
                        if (res[theme] > winner.votes) {
                            winner.votes = res[theme];
                            winner.theme = theme;
                        }
                    }
                    if (winner.theme !== null) {
                        sys.sendAll("", mafiachan);
                        sys.sendAll("±Game: Theme " + winner.theme + " won with " + winner.votes + " votes!", mafiachan);
                        sys.sendAll("±Game: Type /Join to enter the game!", mafiachan);
                        sys.sendAll("", mafiachan);
                        this.startGame(null, winner.theme);
                        this.signups = players[winner.theme];
                        this.ips = ips[winner.theme];
                        mafia.ticks = 40;
                        sys.sendAll("±Game: " + this.signups.join(", ") + " joined the game!", mafiachan);
                    } else {
                        sys.sendAll("Really? No votes, so no game.", mafiachan);
                    }
                }
            };
            this.callHandler = function (state) {
                try {
                    if (state in this.handlers) this.handlers[state].call(this);
                } catch (e) {
                    sys.sendAll("Error occurred in mafia while handling the end of '" + state + "' phase: " + e, mafiachan);
                }
            };
            this.showCommands = function (src) {
                sys.sendMessage(src, "", mafiachan);
                sys.sendMessage(src, "Server Commands:", mafiachan);
                for (var x in mafia.commands.user) {
                    sys.sendMessage(src, "/" + cap(x) + " - " + mafia.commands.user[x][1], mafiachan);
                }
                if (sys.auth(src) > 0) {
                    sys.sendMessage(src, "Authority Commands:", mafiachan);
                    for (x in mafia.commands.auth) {
                        sys.sendMessage(src, "/" + cap(x) + " - " + mafia.commands.auth[x][1], mafiachan);
                    }
                }
                sys.sendMessage(src, "", mafiachan);
            };
            this.showHelp = function (src) {
                var help = ["*** *********************************************************************** ***", "±Game: The objective in this game on how to win depends on the role you are given.", "*** *********************************************************************** ***", "±Role: Mafia", "±Win: Eliminate the WereWolf and the Good People!", "*** *********************************************************************** ***", "±Role: WereWolf", "±Win: Eliminate everyone else in the game!", "*** *********************************************************************** ***", "±Role: Good people (Inspector, Bodyguard, Pretty Lady, Villager, Mayor, Spy, Vigilante, Samurai)", "±Win: Eliminate the WereWolf, Mafia (French and Italian if exists) and the Godfather!", "*** *********************************************************************** ***", "±Role: French Canadian Mafia, Don French Canadian Mafia", "±Win: Eliminate the Italian Mafia, Godfather and the Good People!", "*** *********************************************************************** ***", "±Role: Italian Mafia, Don Italian Mafia", "±Win: Eliminate the French Canadian Mafia, Godfather and the Good People!", "*** *********************************************************************** ***", "±More: Type /roles for more info on the characters in the game!", "±More: Type /rules to see some rules you should follow during a game!", "*** *********************************************************************** ***", ""];
                dump(src, help);
            };
            this.showRoles = function (src, commandData) {
                var themeName = "default";
                var data = commandData.split(":");
                if (mafia.state != "blank") {
                    themeName = mafia.theme.name.toLowerCase();
                }
                if (data[0] != noPlayer && data[0] !== "") {
                    themeName = data[0].toLowerCase();
                    if (!mafia.themeManager.themes.hasOwnProperty(themeName)) {
                        sys.sendMessage(src, "±Game: No such theme!", mafiachan);
                        return;
                    }
                }
                var roles = mafia.themeManager.themes[themeName].roleInfo;
                if (data[1]) {
                    var sep = "*** *********************************************************************** ***";
                    var filterRoles = [sep];
                    var roleTranslation = data[1].toLowerCase();
                    for (var i = 0; i < roles.length; ++i) {
                        if (roles[i].search(/±role:/i) > -1 && roles[i].toLowerCase().search(roleTranslation) > -1) {
                            filterRoles.push(roles[i]);
                            filterRoles.push(roles[i + 1]);
                            filterRoles.push(roles[i + 2]);
                            filterRoles.push(sep);
                        }
                    }
                    if (filterRoles.length == 1) {
                        filterRoles.push("±Game: No such role in this theme!");
                        filterRoles.push(sep);
                    }
                    filterRoles.push("");
                    roles = filterRoles;
                }
                dump(src, roles);
            };
            this.showSides = function (src, commandData) {
                var themeName = "default";
                if (mafia.state != "blank") {
                    themeName = mafia.theme.name.toLowerCase();
                }
                if (commandData != noPlayer) {
                    themeName = commandData.toLowerCase();
                    if (!mafia.themeManager.themes.hasOwnProperty(themeName)) {
                        sys.sendMessage(src, "±Game: No such theme!", mafiachan);
                        return;
                    }
                }
                var sides = mafia.themeManager.themes[themeName].sideInfo;
                dump(src, sides);
            };
            this.showRules = function (src) {
                var rules = ["", "     Server Rules: ", "±Rule: No spamming / flooding ", "±Rule: No insulting - especially not auth. ", "±Rule: No trolling.", "±Tip: Type /rules on other channel to see full rules.", "", "     Game Rules: ", "±Rule: Do not quote any of the Bots.", "±Rule: Do not quit the game before you are dead.", "±Rule: Do not vote yourself / get yourself killed on purpose", "±Rule: Do not talk once you're dead or voted off. ", "±Rule: Do not use a hard to type name.", "±Rule: Do not group together to ruin the game", "±Rule: DO NOT REVEAL YOUR PARTNER IF YOU ARE MAFIA", "", "±Game: Disobey them and you will be banned from mafia/muted according to the mod/admin's wishes!", ""];
                dump(src, rules);
            };
            this.showThemes = function (src) {
                var l = [];
                for (var t in mafia.themeManager.themes) {
                    l.push(mafia.themeManager.themes[t].name);
                }
                msg(src, "Installed themes are: " + l.join(", "));
            };
            this.showThemeInfo = function (src, data) {
                data = data.toLowerCase();
                mafia.themeManager.themeInfo.sort(function (a, b) {
                    return a[0].localeCompare(b[0]);
                });
                var mess = [];
                mess.push("<table><tr><th>Theme</th><th>URL</th><th>Author</th><th>Enabled</th></tr>");
                for (var i = 0; i < mafia.themeManager.themeInfo.length; ++i) {
                    var info = mafia.themeManager.themeInfo[i];
                    var theme = mafia.themeManager.themes[info[0].toLowerCase()];
                    if (!theme) continue;
                    if (data == noPlayer || data.indexOf(theme.name.toLowerCase()) != -1) {
                        mess.push('<tr><td>' + theme.name + '</td><td><a href="' + info[1] + '">' + info[1] + '</a></td><td>' + (theme.author ? readable(theme.author, "and") : "unknown") + '</td><td>' + (theme.enabled ? "yes" : "no") + '</td></tr>');
                    }
                }
                mess.push("</table>");
                sys.sendHtmlMessage(src, mess.join(""), mafiachan);
            };
            this.showThemeDetails = function (src, commandData) {
                var themeName = "default";
                if (mafia.state != "blank") {
                    themeName = mafia.theme.name.toLowerCase();
                }
                if (commandData != noPlayer) {
                    themeName = commandData.toLowerCase();
                    if (!mafia.themeManager.themes.hasOwnProperty(themeName)) {
                        sys.sendMessage(src, "±Game: No such theme!", mafiachan);
                        return;
                    }
                }
                var theme = mafia.themeManager.themes[themeName];
                var link = "No link found";
                for (var i = 0; i < mafia.themeManager.themeInfo.length; ++i) {
                    if (mafia.themeManager.themeInfo[i][0].toLowerCase() == themeName) {
                        link = mafia.themeManager.themeInfo[i][1];
                        break;
                    }
                }
                var mess = [];
                mess.push("");
                mess.push("<b>Theme: </b>" + theme.name);
                mess.push("<b>Author: </b>" + (theme.author ? readable(theme.author, "and") : "Unknown"));
                mess.push("<b>Enabled: </b>" + (theme.enabled ? "Yes" : "No"));
                mess.push("<b>Number of Players: </b> Up to " + (theme["roles" + theme.roleLists].length) + " players");
                mess.push("<b>Summary: </b>" + (theme.summary ? theme.summary : "No summary available."));
                mess.push("(For more information about this theme, type <b>/roles " + theme.name + "</b>)");
                if (link == "No link found") {
                    mess.push('<b>Code: </b>' + link);
                } else {
                    mess.push('<b>Code: </b><a href="' + link + '">' + link + '</a>');
                }
                mess.push("");
                for (var x in mess) {
                    sys.sendHtmlMessage(src, mess[x], mafiachan);
                }
            };
            this.showPlayedGames = function (src) {
                var mess = [];
                mess.push("<table><tr><th>Theme</th><th>Who started</th><th>When</th><th>Players</th></tr>");
                var recentGames = PreviousGames.slice(-10);
                var t = parseInt(sys.time(), 10);
                for (var i = 0; i < recentGames.length; ++i) {
                    var game = recentGames[i];
                    mess.push('<tr><td>' + game.what + '</td><td>' + game.who + '</td><td>' + getTimeString(game.when - t) + '</td><td>' + game.playerCount + '</td></tr>');
                }
                mess.push("</table>");
                sys.sendHtmlMessage(src, mess.join(""), mafiachan);
            };
            this.showOwnRole = function (src) {
                var name = sys.name(src);
                if (mafia.state != "blank" && mafia.state != "entry") {
                    if (mafia.isInGame(name)) {
                        var player = mafia.players[name];
                        var role = player.role;
                        if (typeof role.actions.startup == "object" && typeof role.actions.startup.revealAs == "string") {
                            mafia.sendPlayer(player.name, "±Game: You are a " + mafia.theme.trrole(role.actions.startup.revealAs) + "!");
                        } else {
                            mafia.sendPlayer(player.name, "±Game: You are a " + role.translation + "!");
                        }
                        mafia.sendPlayer(player.name, "±Game: " + role.help);
                        if (role.actions.startup == "team-reveal") {
                            mafia.sendPlayer(player.name, "±Game: Your team is " + mafia.getPlayersForTeamS(role.side) + ".");
                        }
                        if (role.actions.startup == "team-reveal-with-roles") {
                            var playersRole = mafia.getPlayersForTeam(role.side).map(function (x) {
                                return x + " (" + this.players[x].role.translation + ")";
                            }, mafia);
                            mafia.sendPlayer(player.name, "±Game: Your team is " + readable(playersRole, "and") + ".");
                        }
                        if (typeof role.actions.startup == "object" && Array.isArray(role.actions.startup["team-revealif"])) {
                            if (role.actions.startup["team-revealif"].indexOf(role.side) != -1) {
                                mafia.sendPlayer(player.name, "±Game: Your team is " + mafia.getPlayersForTeamS(role.side) + ".");
                            }
                        }
                        if (role.actions.startup == "role-reveal") {
                            mafia.sendPlayer(player.name, "±Game: People with your role are " + mafia.getPlayersForRoleS(role.role) + ".");
                        }
                        if (typeof role.actions.startup == "object" && role.actions.startup.revealRole) {
                            if (typeof role.actions.startup.revealRole == "string") {
                                if (mafia.getPlayersForRoleS(player.role.actions.startup.revealRole) !== "") mafia.sendPlayer(player.name, "±Game: The " + mafia.theme.roles[role.actions.startup.revealRole].translation + " is " + mafia.getPlayersForRoleS(player.role.actions.startup.revealRole) + "!");
                            } else if (Array.isArray(role.actions.startup.revealRole)) {
                                for (var s = 0, l = role.actions.startup.revealRole.length; s < l; ++s) {
                                    var revealrole = role.actions.startup.revealRole[s];
                                    if (mafia.getPlayersForRoleS(revealrole) !== "") mafia.sendPlayer(player.name, "±Game: The " + mafia.theme.roles[revealrole].translation + " is " + mafia.getPlayersForRoleS(revealrole) + "!");
                                }
                            }
                        }
                    } else {
                        sys.sendMessage(src, "±Game: You are not in the game!", mafiachan);
                    }
                } else {
                    sys.sendMessage(src, "±Game: No game running!", mafiachan);
                }
            };
            this.flashPlayer = function (src, commandData) {};
            this.showPriority = function (src, commandData) {
                var themeName = "default";
                if (mafia.state != "blank") {
                    themeName = mafia.theme.name.toLowerCase();
                }
                if (commandData != noPlayer) {
                    themeName = commandData.toLowerCase();
                    if (!mafia.themeManager.themes.hasOwnProperty(themeName)) {
                        sys.sendMessage(src, "±Game: No such theme!", mafiachan);
                        return;
                    }
                }
                var theme = mafia.themeManager.themes[themeName];
                sys.sendHtmlMessage(src, "", mafiachan);
                sys.sendHtmlMessage(src, "Priority List for theme <b>" + theme.name + ":</b>", mafiachan);
                for (var p = 0; p < theme.nightPriority.length; ++p) {
                    var prio = theme.nightPriority[p];
                    sys.sendHtmlMessage(src, "[" + prio.priority + "] " + theme.roles[prio.role].translation + " (" + cap(prio.action) + ")", mafiachan);
                }
                sys.sendHtmlMessage(src, "", mafiachan);
            };
            // Auth commands
            this.isMafiaAdmin = function (src) {
                if (!noPermission(src, 1)) return true;
                return false;
            };
            this.isMafiaSuperAdmin = function (src) {
                if (!noPermission(src, 1)) return true;
                return false;
            };
            this.pushUser = function (src, name) {
                if (!mafia.isMafiaSuperAdmin(src)) {
                    msg(src, "Super Admin Command.");
                    return;
                }
                if (this.state != "entry") {
                    msg(src, "Pushing makes no sense outside entry...");
                    return;
                }
                var id = sys.id(name);
                if (id) {
                    name = sys.name(id);
                    this.signups.push(name);
                    this.ips.push(sys.ip(id));
                } else {
                    this.signups.push(name);
                }
                sys.sendAll("±Game: " + name + " joined the game! (pushed by " + sys.name(src) + ")", mafiachan);
            };
            this.slayUser = function (src, name) {
                var slayer = typeof src == "string" ? src : sys.name(src);
                if (this.state == "entry") {
                    for (var i = 0; i < this.signups.length; ++i) {
                        if (name.toLowerCase() == this.signups[i].toLowerCase()) {
                            msgAll(" " + this.signups[i] + " was taken out from the game by " + slayer + "!");
                            this.signups.splice(i, 1);
                            return;
                        }
                    }
                } else {
                    name = this.correctCase(name);
                    if (this.isInGame(name)) {
                        var player = this.players[name];
                        sys.sendAll("±Kill: " + player.name + " (" + player.role.translation + ") was slayed by " + slayer + "!", mafiachan);
                        this.removePlayer(player);
                        return;
                    }
                }
                msg(src, "No such target.");
            };
            this.addTheme = function (src, url) {
                if (!mafia.isMafiaAdmin(src)) {
                    msg(src, "admin+ command.");
                    return;
                }
                mafia.themeManager.loadWebTheme(url, true, false);
            };
            this.updateTheme = function (src, data) {
                var url = data,
                    name = data;
                if (data.indexOf("::") >= 0) {
                    var parts = url.split("::");
                    name = parts[0];
                    url = parts[1];
                }
                var theme = mafia.themeManager.themes[name.toLowerCase()];
                //  theme.author can be either string or Array of strings
                var authorMatch = theme !== undefined && (typeof theme.author == "string" && theme.author.toLowerCase() == sys.name(src).toLowerCase() || Array.isArray(theme.author) && theme.author.map(function (s) {
                    return s.toLowerCase();
                }).indexOf(sys.name(src).toLowerCase()) >= 0);
                if (!mafia.isMafiaAdmin(src) && !authorMatch) {
                    msg(src, "You need to be admin or the author of this theme.");
                    return;
                }
                var dlurl;
                if (url.substr(0, 7) != "http://") {
                    for (var i = 0; i < mafia.themeManager.themeInfo.length; ++i) {
                        if (mafia.themeManager.themeInfo[i][0].toLowerCase() == name.toLowerCase()) {
                            dlurl = mafia.themeManager.themeInfo[i][1];
                            break;
                        }
                    }
                } else {
                    dlurl = url;
                }
                msg(src, "Download url: " + dlurl);
                if (dlurl) {
                    mafia.themeManager.loadWebTheme(dlurl, true, true, authorMatch ? theme.name.toLowerCase() : null);
                }
            };
            this.removeTheme = function (src, name) {
                if (!mafia.isMafiaSuperAdmin(src)) {
                    msg(src, "admin+ command.");
                    return;
                }
                mafia.themeManager.remove(src, name);
            };
            this.disableTheme = function (src, name) {
                if (!mafia.isMafiaAdmin(src)) {
                    msg(src, "admin+ command.");
                    return;
                }
                mafia.themeManager.disable(src, name);
            };
            this.enableTheme = function (src, name) {
                if (!mafia.isMafiaAdmin(src)) {
                    msg(src, "admin+ command.");
                    return;
                }
                mafia.themeManager.enable(src, name);
            };
            this.updateAfter = function (src) {};

            function runUpdate() {}
            this.importOld = function (src, name) {
                msgAll("Importing old themes", mafiachan);
                mafia.themeManager.loadTheme(defaultTheme);
                mafia.themeManager.saveToFile(defaultTheme);
                mafia.themeManager.loadThemes();
            };
            this.commands = {
                user: {
                    commands: [this.showCommands, "To see the various commands."],
                    start: [this.userVote, "Start voting for a new game theme / or vote!"],
                    votetheme: [this.userVote, "Start voting for a new game theme / or vote!"],
                    starttheme: [this.startGame, "Starts a Game of Mafia with specified theme."],
                    help: [this.showHelp, "For info on how to win in a game."],
                    roles: [this.showRoles, "For info on all the Roles in the game."],
                    sides: [this.showSides, "For info on all teams in the game."],
                    myrole: [this.showOwnRole, "To view again your role, help text and teammates."],
                    rules: [this.showRules, "To see the Rules for the Game/Server."],
                    themes: [this.showThemes, "To view installed themes."],
                    themeinfo: [this.showThemeInfo, "To view installed themes (more details)."],
                    details: [this.showThemeDetails, "To view info about a specific theme."],
                    priority: [this.showPriority, "To view the priority list of a theme. "],
                    playedgames: [this.showPlayedGames, "To view recently played games"],
                    update: [this.updateTheme, "To update a Mafia Theme!"]
                },
                auth: {
                    push: [this.pushUser, "To push users to a Mafia game."],
                    slay: [this.slayUser, "To slay users in a Mafia game."],
                    shove: [this.slayUser, "To remove users before a game starts."],
                    end: [this.endGame, "To cancel a Mafia game!"],
                    add: [this.addTheme, "To add a Mafia Theme!"],
                    remove: [this.removeTheme, "To remove a Mafia Theme!"],
                    disable: [this.disableTheme, "To disable a Mafia Theme!"],
                    enable: [this.enableTheme, "To enable a disabled Mafia Theme!"],
                    importold: [this.importOld, ""]
                }
            };
            this.canJoin = function (src) {
                if (this.isInGame(sys.name(src))) {
                    sys.sendMessage(src, "±Game: You already joined!", mafiachan);
                    return;
                }
                if (this.ips.indexOf(sys.ip(src)) != -1) {
                    sys.sendMessage(src, "±Game: This IP is already in list. You cannot register two times!", mafiachan);
                    return;
                }
                if (JSESSION.users(src).muted) {
                    sys.sendMessage(src, "±Game: You are muted!", mafiachan);
                    return;
                }
                if (!sys.dbRegistered(sys.name(src))) {
                    sys.sendMessage(src, "±Game: You need to register to play mafia here! Click on the 'Register' button below and follow the instructions!", mafiachan);
                    return;
                }
                if (this.numjoins[sys.ip(src)] >= 2) {
                    sys.sendMessage(src, "±Game: You can't join/unjoin more than 3 times!", mafiachan);
                    return;
                }
                var name = sys.name(src);
                for (var x in name) {
                    var code = name.charCodeAt(x);
                    if (name[x] != ' ' && name[x] != '.' && (code < 'a'.charCodeAt(0) || code > 'z'.charCodeAt(0)) && (code < 'A'.charCodeAt(0) || code > 'Z'.charCodeAt(0)) && name[x] != '-' && name[x] != '_' && name[x] != '<' && name[x] != '>' && (code < '0'.charCodeAt(0) || code > '9'.charCodeAt(0))) {
                        sys.sendMessage(src, "±Name: You're not allowed to have the following character in your name: " + name[x] + ".", mafiachan);
                        sys.sendMessage(src, "±Rule: You must change it if you want to join!", mafiachan);
                        return;
                    }
                }
                if (name.length > 12) {
                    sys.sendMessage(src, "±Name: You're not allowed to have more than 12 letters in your name!", mafiachan);
                    sys.sendMessage(src, "±Rule: You must change it if you want to join!", mafiachan);
                    return;
                }
                return true;
            };
            this.handleCommand = function (src, message, channel) {
                var command;
                var commandData = '*';
                var pos = message.indexOf(' ');
                if (pos != -1) {
                    command = message.substring(0, pos).toLowerCase();
                    commandData = message.substr(pos + 1);
                } else {
                    command = message.substr(0).toLowerCase();
                }
                if (command in this.commands.user) {
                    this.commands.user[command][0].call(this, src, commandData);
                    return true;
                }
                var name, x, player, target;
                if (this.state == "entry") {
                    if (command == "join") {
                        if (this.canJoin(src) !== true) {
                            return;
                        }
                        if (this.signups.length >= this.theme["roles" + this.theme.roleLists].length) {
                            sys.sendMessage(src, "±Game: There can't be more than " + this.theme["roles" + this.theme.roleLists].length + " players!", mafiachan);
                            return;
                        }
                        name = sys.name(src);
                        this.signups.push(name);
                        this.ips.push(sys.ip(src));
                        if (this.numjoins.hasOwnProperty(sys.ip(src))) {
                            this.numjoins[sys.ip(src)] += 1
                        } else {
                            this.numjoins[sys.ip(src)] = 1
                        }
                        sys.sendAll("±Game: " + name + " joined the game!", mafiachan);
                        if (this.signups.length == this.theme["roles" + this.theme.roleLists].length) {
                            this.ticks = 1;
                        }
                        return;
                    }
                    if (command == "unjoin") {
                        if (this.isInGame(sys.name(src))) {
                            name = sys.name(src);
                            delete this.ips[this.ips.indexOf(sys.ip(src))];
                            this.signups.splice(this.signups.indexOf(name), 1);
                            sys.sendAll("±Game: " + name + " unjoined the game!", mafiachan);
                            return;
                        } else {
                            sys.sendMessage(src, "±Game: You haven't even joined!", mafiachan);
                            return;
                        }
                    }
                } else if (this.state == "night") {
                    name = sys.name(src);
                    if (this.isInGame(name) && this.hasCommand(name, command, "night")) {
                        commandData = this.correctCase(commandData);
                        if (!this.isInGame(commandData)) {
                            sys.sendMessage(src, "±Hint: That person is not playing!", mafiachan);
                            return;
                        }
                        player = mafia.players[name];
                        target = mafia.players[commandData];
                        if (["Any", "Self", "OnlySelf"].indexOf(player.role.actions.night[command].target) == -1 && commandData == name) {
                            sys.sendMessage(src, "±Hint: Nope, this wont work... You can't target yourself!", mafiachan);
                            return;
                        } else if (player.role.actions.night[command].target == "OnlySelf" && commandData != name) {
                            sys.sendMessage(src, "±Hint: You can only use this action on yourself!", mafiachan);
                            return;
                        } else if (player.role.actions.night[command].target == 'AnyButTeam' && player.role.side == target.role.side || player.role.actions.night[command].target == 'AnyButRole' && player.role.role == target.role.role) {
                            sys.sendMessage(src, "±Hint: Nope, this wont work... You can't target your partners!", mafiachan);
                            return;
                        }
                        var recharge = mafia.getRecharge(player, "night", command);
                        if (recharge !== undefined && recharge > 0) {
                            sys.sendMessage(src, "±Game: You cannot use this action for " + recharge + " night(s)!", mafiachan);
                            return;
                        }
                        sys.sendMessage(src, "±Game: You have chosen to " + command + " " + commandData + "!", mafiachan);
                        this.setTarget(player, target, command);
                        var team;
                        var broadcast = player.role.actions.night[command].broadcast;
                        if (broadcast !== undefined) {
                            team = [];
                            if (broadcast == "team") {
                                team = this.getPlayersForTeam(player.role.side);
                            } else if (broadcast == "role") {
                                team = this.getPlayersForRole(player.role.role);
                            }
                            var broadcastmsg = "±Game: Your partner(s) have decided to " + command + " '" + commandData + "'!";
                            if (player.role.actions.night[command].broadcastmsg) {
                                broadcastmsg = player.role.actions.night[command].broadcastmsg.replace(/~Player~/g, name).replace(/~Target~/g, commandData).replace(/~Action~/, command);
                            }
                            for (x in team) {
                                if (team[x] != name) {
                                    this.sendPlayer(team[x], "±Game: Your partner(s) have decided to " + command + " '" + commandData + "'!");
                                }
                            }
                        } /* Hax-related to command */
                        // some roles can get "hax" from other people using some commands...
                        // however, roles can have avoidHax: ["kill", "distract"] in actions..
                        if ("avoidHax" in player.role.actions && player.role.actions.avoidHax.indexOf(command) != -1) {
                            return;
                        }
                        var haxRoles = mafia.theme.getHaxRolesFor(command);
                        for (var i in haxRoles) {
                            var role = haxRoles[i];
                            var haxPlayers = this.getPlayersForRole(role);
                            for (var j in haxPlayers) {
                                var haxPlayer = haxPlayers[j];
                                var r = Math.random();
                                var roleName = this.theme.trside(player.role.side);
                                team = this.getPlayersForRole(player.role.side);
                                var playerRole = this.theme.trrole(player.role.role);
                                if (r < mafia.theme.roles[role].actions.hax[command].revealTeam) {
                                    if (team.length > 1) this.sendPlayer(haxPlayer, "±Game: The " + roleName + " are going to " + command + " " + commandData + "!");
                                    else this.sendPlayer(haxPlayer, "±Game: The " + roleName + " is going to " + command + " " + commandData + "!");
                                }
                                if (r < mafia.theme.roles[role].actions.hax[command].revealPlayer) {
                                    if (team.length > 1) this.sendPlayer(haxPlayer, "±Game: " + name + " is one of The " + roleName + "!");
                                    else this.sendPlayer(haxPlayer, "±Game: " + name + " is The " + roleName + "!");
                                }
                                if (r < mafia.theme.roles[role].actions.hax[command].revealRole) {
                                    this.sendPlayer(haxPlayer, "±Game: " + name + " is " + playerRole + "!");
                                }
                            }
                        }
                        return;
                    }
                } else if (this.state == "day") {
                    if (this.isInGame(sys.name(src)) && command == "vote") {
                        commandData = this.correctCase(commandData);
                        if (!this.isInGame(commandData)) {
                            sys.sendMessage(src, "±Game: That person is not playing!", mafiachan);
                            return;
                        }
                        if (sys.name(src) in this.votes) {
                            sys.sendMessage(src, "±Rule: You already voted!", mafiachan);
                            return;
                        }
                        sys.sendAll("±Game:" + sys.name(src) + " voted for " + commandData + "!", mafiachan);
                        this.votes[sys.name(src)] = commandData;
                        this.voteCount += 1;
                        if (this.voteCount == Object.keys(mafia.players).length) {
                            mafia.ticks = 1;
                        } else if (mafia.ticks < 8) {
                            mafia.ticks = 8;
                        }
                        return;
                    }
                } else if (mafia.state == "standby") {
                    name = sys.name(src);
                    if (this.isInGame(name) && this.hasCommand(name, command, "standby")) {
                        player = mafia.players[name];
                        commandData = this.correctCase(commandData);
                        target = commandData != noPlayer ? mafia.players[commandData] : null;
                        var commandObject = player.role.actions.standby[command];
                        if (commandObject.hasOwnProperty("command")) command = commandObject.command;
                        if (target !== null) {
                            if ((commandObject.target === undefined || ["Self", "Any"].indexOf(commandObject.target) == -1) && player == target) {
                                sys.sendMessage(src, "±Hint: Nope, this wont work... You can't target yourself!", mafiachan);
                                return;
                            } else if (commandObject.target == 'AnyButTeam' && player.role.side == target.role.side || commandObject.target == 'AnyButRole' && player.role.role == target.role.role) {
                                sys.sendMessage(src, "±Hint: Nope, this wont work... You can't target your partners!", mafiachan);
                                return;
                            }
                        }
                        if (command == "kill") {
                            if (player.dayKill >= (commandObject.limit || 1)) {
                                sys.sendMessage(src, "±Game: You already killed!", mafiachan);
                                return;
                            }
                            if (target === null) {
                                sys.sendMessage(src, "±Game: That person is not playing!", mafiachan);
                                return;
                            }
                            var revenge = false;
                            if (target.role.actions.hasOwnProperty("daykill")) {
                                if (target.role.actions.daykill == "evade") {
                                    sys.sendMessage(src, "±Game: That person is gone, you can't kill them!", mafiachan);
                                    return;
                                } else if (target.role.actions.daykill == "revenge" || target.role.actions.daykill == "bomb") {
                                    revenge = true;
                                } else if (typeof target.role.actions.daykill.mode == "object" && target.role.actions.daykill.mode.evadeChance > sys.rand(0, 100) / 100) {
                                    sys.sendMessage(src, "±Game: Your kill was evaded!", mafiachan);
                                    sys.sendMessage(sys.id(target.name), "±Game: You evaded a kill!", mafiachan);
                                    player.dayKill = player.dayKill + 1 || 1;
                                    return;
                                }
                            }
                            sys.sendAll(border, mafiachan);
                            if (!revenge) {
                                sys.sendAll("±Game: " + commandObject.killmsg.replace(/~Self~/g, name).replace(/~Target~/g, commandData), mafiachan);
                                if ("revealChance" in commandObject && commandObject.revealChance > sys.rand(0, 100) / 100) {
                                    if (commandObject.revealmsg !== undefined && typeof commandObject.revealmsg == "string") {
                                        sys.sendAll("±Game: " + commandObject.revealmsg.replace(/~Self~/g, name).replace(/~Role~/g, mafia.players[name].role.translation), mafiachan);
                                    } else {
                                        sys.sendAll("±Game: While attacking, " + name + " (" + mafia.players[name].role.translation + ") made a mistake and was revealed!", mafiachan);
                                    }
                                }
                                if ("daykill" in target.role.actions && target.role.actions.daykill === "revealkiller") {
                                    if ("daykillrevengemsg" in target.role.actions) {
                                        sys.sendAll("±Game: " + target.role.actions.daykillrevengemsg.replace(/~Self~/g, target.name).replace(/~Target~/g, name).replace(/~Role~/g, mafia.players[name].role.translation), mafiachan);
                                    } else {
                                        sys.sendAll("±Game: Before dying, " + target.name + " revealed that " + name + " is the " + mafia.players[name].role.translation + "!", mafiachan);
                                    }
                                }
                                player.dayKill = player.dayKill + 1 || 1;
                                this.kill(mafia.players[commandData]);
                            } else {
                                if (target.role.actions.daykillrevengemsg !== undefined && typeof target.role.actions.daykillrevengemsg == "string") {
                                    sys.sendAll("±Game: " + target.role.actions.daykillrevengemsg.replace(/~Self~/g, commandData).replace(/~Target~/g, name), mafiachan);
                                } else {
                                    sys.sendAll("±Game: ~Target~ tries to attack ~Self~, but ~Self~ fights back and kills ~Target~!".replace(/~Self~/g, commandData).replace(/~Target~/g, name), mafiachan);
                                }
                                this.kill(mafia.players[name]);
                                if (target.role.actions.daykill === "bomb") this.kill(mafia.players[commandData]);
                            }
                            if (this.testWin()) {
                                return;
                            }
                            sys.sendAll(border, mafiachan);
                        } else if (command == "reveal") {
                            if (player.revealUse >= (commandObject.limit || 1)) {
                                sys.sendMessage(src, "±Game: You already used this command!", mafiachan);
                                return;
                            }
                            var revealMessage = commandObject.revealmsg ? commandObject.revealmsg : "~Self~ is revealed to be a ~Role~!";
                            sys.sendAll(border, mafiachan);
                            sys.sendAll("±Game: " + revealMessage.replace(/~Self~/g, name).replace(/~Role~/g, player.role.translation), mafiachan);
                            sys.sendAll(border, mafiachan);
                            player.revealUse = player.revealUse + 1 || 1;
                        } else if (command == "expose") {
                            if (player.exposeUse >= (commandObject.limit || 1)) {
                                sys.sendMessage(src, "±Game: You already used this command!", mafiachan);
                                return;
                            }
                            if (target === null) {
                                sys.sendMessage(src, "±Game: That person is not playing!", mafiachan);
                                return;
                            }
                            var exposeMessage = commandObject.exposemsg ? commandObject.exposemsg : "~Self~ revealed that ~Target~ is the ~Role~!";
                            var inspectMode = target.role.actions.inspect || {};
                            var revealedRole;
                            if (inspectMode.revealAs !== undefined) {
                                if (typeof inspectMode.revealAs == "string") {
                                    if (inspectMode.revealAs == "*") {
                                        var rr = 1;
                                        while (mafia.signups.length > mafia.theme["roles" + rr].length) {
                                            ++rr;
                                        }
                                        var rrole = mafia.theme["roles" + rr].slice(0, mafia.signups.length);
                                        revealedRole = mafia.theme.trrole(rrole[Math.floor(Math.random() * rrole.length)]);
                                    } else {
                                        revealedRole = mafia.theme.trrole(inspectMode.revealAs);
                                    }
                                } else if (Array.isArray(inspectMode.revealAs)) {
                                    revealedRole = mafia.theme.trrole(inspectMode.revealAs[Math.floor(Math.random() * inspectMode.revealAs.length)]);
                                }
                            } else {
                                revealedRole = target.role.translation;
                            }
                            sys.sendAll(border, mafiachan);
                            sys.sendAll("±Game: " + exposeMessage.replace(/~Self~/g, name).replace(/~Target~/g, target.name).replace(/~Role~/g, revealedRole), mafiachan);
                            if ("revealChance" in commandObject && commandObject.revealChance > sys.rand(0, 100) / 100) {
                                if (commandObject.revealmsg !== undefined && typeof commandObject.revealmsg == "string") {
                                    sys.sendAll("±Game: " + commandObject.revealmsg.replace(/~Self~/g, name).replace(/~Role~/g, mafia.players[name].role.translation), mafiachan);
                                } else {
                                    sys.sendAll("±Game: While exposing, " + name + " (" + mafia.players[name].role.translation + ") made a mistake and was revealed!", mafiachan);
                                }
                            }
                            sys.sendAll(border, mafiachan);
                            player.exposeUse = player.exposeUse + 1 || 1;
                        }
                        return;
                    }
                }
                if (command == "join") {
                    sys.sendMessage(src, "±Game: You can't join now!", mafiachan);
                    return;
                }

                if (!this.isMafiaAdmin(src)) {
                    throw ("no valid command");
                }

                if (command in this.commands.auth) {
                    this.commands.auth[command][0].call(this, src, commandData);
                    return;
                }
                throw ("no valid command");
            };
        };

        if (typeof poGlobal == 'undefined') {
            poGlobal = JSESSION.global();
        }

        if (typeof mafia == 'undefined') {
            mafia = new Mafia(mafiachan);
            mafia.importOld();
            poGlobal.mafiaVersion = mafia.version;
        }
        else {
            if (Mafia.version > poGlobal.mafiaVersion) {
                poGlobal.mafiaVersion = Mafia.version;

                delete mafia;
                mafia = new Mafia(mafiachan);
                mafia.importOld();

                botAll("Mafia was updated!", mafiachan);
            }
        }
    }
})