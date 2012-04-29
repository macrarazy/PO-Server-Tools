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
		|| # 2.0.50 Release Candidate 2                            # ||
		|| #                                                       # ||
		|| ######################################################### ||
		|| #                                                       # ||
		|| # Default Styles and Rank Icons Credit:                 # ||
		|| # TheUnknownOne, Lutra, Intel_iX, person6445            # ||
		|| #                                                       # ||
		|| ######################################################### ||
		|| #                                                       # ||
		|| ######################################################### ||
		|| #              -Licence Information-                    # ||
		|| ######################################################### ||
		|| #                                                       # ||
		|| # The Script is available under the                     # ||
		|| # Creative Commons Attribution-ShareAlike License 3.0   # ||
		|| # Which can be found at:                                # ||
		|| # http://creativecommons.org/licenses/by-nc-sa/3.0/     # ||
		|| #                                                       # ||
		|| ######################################################### ||
		|| #               -Tier Requirements-                     # ||
		|| ######################################################### ||
		|| #                                                       # ||
		|| # The newest Pokémon Online tiers are required for      # ||
		|| # Auto Start Tour tiers.                                # ||
		|| # Link: http://pokemon-online.eu/tiers.xml              # ||
		|| # Command: /updatetiers [optional link, uses PO tiers   # ||
		|| # as default.]                                          # ||
		|| #                                                       # ||
		|| ######################################################### ||
		|| #                                                       # ||
		|| # Required tiers are:                                   # ||  
		|| # Middle Cup, Wifi 1v1 CC, Clear Skies, Wifi UU,        # ||
		|| # Wifi OU, DW OU, DW Ubers, Wifi Ubers, CC 1v1, DW UU   # ||
		|| # Clear Skies DW, Wifi LC, Challenge Cup                # ||
		|| #                                                       # ||
		|| # If you don't have these, turn Auto Start Tours off.   # ||
		|| #                                                       # ||
		\*===========================================================*/

		/*===========================================================*\
		||                     Config Chart                          ||
		|| @ = Property                                              ||
		|| - = Description of Property or Setting                    ||
		|| ~ = Usage                                                 ||
		|| # = Changable Setting in Property                         ||
		|| & = Note                                                  ||
		|| !- -! = Tip/Hint                                          ||
		|| ^ = Example                                               ||
		===============================================================
		|| @ Config:                                                 ||
		|| - Set your settings here, some things don't exist yet.    ||
		===============================================================
		|| @ ClanTag:                                                ||
		|| - Your clan's tag. If it is None, then this function is   ||
		|| - disabled. Please include [] and make it uppercase       ||
		===============================================================
		|| @ DWAbilityCheck:                                         ||
		|| - true if you want to check for unreleashed Dream World   ||
		|| - abilities.                                              ||
		|| - false if you don't.                                     ||
		===============================================================
		|| @ HighPermission users:                                   ||
		|| - Can use commands with an higher auth level required.    ||
		|| - Specify the auth level too.                             ||
		|| ~ [minauth,recevingauth]                                  ||
		===============================================================
		|| @ Bot + Color:                                            ||
		|| - Allows you to quickly change color of the bots,         ||
		|| - you can use command too.                                ||
		===============================================================
		|| @ Server Stuff:                                           ||
		|| # Name:                                                   ||
		|| - Display name when chatting in the Server Window         || 
		|| - you can use command too.                                ||
		|| # Color:                                                  ||
		|| - Display color for that, you can use command too.        ||
		|| # Change:                                                 ||
		|| true if this should work, false if not.                   ||
		|| !- Add <ping/> in the name to ping everyone. -!           ||
		===============================================================
		|| @ canChangeMOTD + DefaultMOTD + MOTDName:                 ||
		|| # canChangeMOTD:                                          ||
		|| - true if Auth can change the MOTD.                       ||
		|| - false if not.                                           ||
		|| # MOTDName:                                               ||
		|| - How MOTD will be displayed.                             ||
		|| ^ (ex: "Welcome Message: Welcome to the server!"          ||
		|| ^ instead of                                              ||
		|| ^ "Message Of The Day: Welcome to the server!")           ||
		|| # DefaultMOTD:                                            ||
		|| - MOTD by default if no MOTD exists.                      ||
		|| !- {{servername}} for servername. -!                      ||
		|| !- {{site}} for website/forum. -!                         ||
		|| !- {{email}} for your email. -!                           ||
		|| & <Doesn't work yet>                                      ||
		===============================================================
		|| @ ServerSided:                                            ||
		|| # Email:                                                  ||
		|| - Contact info(can be displayed in MOTD).                 ||
		|| # ServerName:                                             ||
		|| - Your server's name, will automaticly detect             ||
		|| - if not changed.                                         ||
		|| # WebSite:                                                ||
		|| - The link of your website/forum.                         ||
		|| & <Doesn't work yet>                                      ||
		===============================================================
		|| @ AutoChannelJoin:                                        ||
		|| - Automaticly lets a player join all script defined       ||
		|| - if true. Not if false.                                  ||
		\*===========================================================*/

		/*===========================================================*\
		||                     ConfigSaves                           ||
		===============================================================
		|| # First Argument:                                         ||
		|| - Your old Config cache hash. If this hash exists,        ||
		|| - Then deletes it, to save space.                         ||
		|| # Second Argument:                                        ||
		|| - The new Config cache hash name. Change this if you      ||
		|| - Change the Config by script. Do not name this the same  ||
		|| - As the first argument...                                ||
		\*===========================================================*/

	   /*========================================*\
	   |  ~ Thanks to the following testers: ~    |
	   |  * kupo (The Battle Tower)               |
	   \*========================================*/
	
		ScriptVerData = ["2.0.50", "Release Candidate 2"];
		NOTIFY_UNIQUE_ID = "Notify::pushFix";
		// Do not change NOTIFY_UNIQUE_ID if you don't know what it does! (don't guess :x)
		
		
		try {
		delete RECOVERY_BACKUP;
		} catch (e) {}
		
		RECOVERY_BACKUP = {};
		
		if(typeof script != "undefined") {
		for(var x in script)
		RECOVERY_BACKUP[x] = script[x];
		}
		
		var ConfigLoad = function() {
		ConfigSaves = ["%%-Config-%%","==Config=="];

		if(servername== undefined) {
		script.configload();
		}

		Config={
		Mafia:{
		norepeat:3,
		stats_file:"MafiaStats.txt",
		},
		DWAbilityCheck:true,
		HighPermission:{
		"This gives Administrator Auth to a Moderator.":[1,2],
		"Don't forget the commas and collons.":[1,2]
		},
		ClanTag:"None",
		MOTD:{
		MOTDName:"Message Of The Day",
		canChangeMOTD:true,
		DefaultMOTD:"Welcome to {{servername}}"
		},
		ServerSided:{
		Email:"Example@serverwebsite.example",
		ServerName:servername,
		WebSite:"http://serverwebsite.example"
		},
		Server:{
		Name:"~~Server~~",
		Color:"blue",
		Change:true
		},
		"AutoChannelJoin":true,
		Bot:{
		bot:"~Server~",
		botcolor:"red"
		},
		}
		}

		VERSION = function (v, data) {
		this.version = v;
		if(data == null || typeof data != "string")
		data = "";
		this.additionalData = data;
		}
		
		VERSION.prototype.toString = function () {
		return this.version+" "+this.additionalData;
		}
		
		
		ScriptVersion = new VERSION(ScriptVerData[0], ScriptVerData[1]);
		
		
        /*** BOTS ***/
		botEscapeMessage = function(src, message, channel) {
		if(typeof Config == 'undefined')
		return;
		
		var color = Config.Bot.botcolor;
		var name = Config.Bot.bot;
		if(typeof channel != "undefined") {
		sys.sendHtmlMessage(src, "<font color='"+color+"'><timestamp/><b>"+name+":</i></b></font> " + html_escape(message), channel);
		}
		else {
		sys.sendHtmlMessage(src, "<font color='"+color+"'><timestamp/><b>"+name+":</i></b></font> " + html_escape(message));
		}
		}

		botMessage = function(src, message, channel) {
		if(typeof Config == 'undefined')
		return;
		
		var color = Config.Bot.botcolor;
		var name = Config.Bot.bot;
		if(typeof channel != "undefined") {
		sys.sendHtmlMessage(src, "<font color='"+color+"'><timestamp/><b>"+name+":</i></b></font> " + message, channel);
		}
		else {
		sys.sendHtmlMessage(src, "<font color='"+color+"'><timestamp/><b>"+name+":</i></b></font> " + message);
		}
		}

		botEscapeAll = function(message, channel) {
		if(typeof Config == 'undefined')
		return;
		
		var color = Config.Bot.botcolor;
		var name = Config.Bot.bot;
		if(typeof channel != "undefined") {
		sys.sendHtmlAll("<font color='"+color+"'><timestamp/><b>"+name+":</i></b></font> " + html_escape(message), channel);
		}
		else {
		sys.sendHtmlAll("<font color='"+color+"'><timestamp/><b>"+name+":</i></b></font> " + html_escape(message));
		}
		}

		botAll = function(message, channel) {
		if(typeof Config == 'undefined')
		return;
		
		var color = Config.Bot.botcolor;
		var name = Config.Bot.bot;
		if(typeof channel != "undefined") {
		sys.sendHtmlAll("<font color='"+color+"'><timestamp/><b>"+name+":</i></b></font> " + message, channel);
		}
		else {
		sys.sendHtmlAll("<font color='"+color+"'><timestamp/><b>"+name+":</i></b></font> " + message);
		}
		}

		FormatError = function (mess, e) {
		if(typeof mess != "string")
		mess = "";
		
		if(mess != "" && mess[mess.length-1] != "." && mess[mess.length-1] != "!"
		&& mess[mess.length-1] != "?" && mess[mess.length-1] != ":")
		mess += ".";
		
		if(typeof e.format !== 'undefined') {
		return mess+" Custom Error: "+e
		}
		
		var lineData = e.lineNumber == 1 ? "" : " on line "+e.lineNumber;
        var name = e.name;
		var msg = e.message;
		
		var str = name+lineData+": "+msg;
		var lastChar = msg[msg.length-1];
		str += lastChar == "." ? "" : ".";
		
		return mess+" "+str;
		}
		
		ChannelLink = function (channel) {
		if(sys.channelId(channel) == undefined)
		return "";
		
		return "<a href='po:join/"+channel+"'>#"+channel+"</a>";
		}
		
		ChannelNames = function () {
		var channelIds = sys.channelIds(), channelNames = [];
		for(var x in channelIds) {
		channelNames.push(sys.channel(channelIds[x]));
		}
		
		return channelNames;
		}
		
		addChannelLinks = function (line2) {
		var channelNames = ChannelNames();

		var line = line2;
		var pos = 0;
		pos = line.indexOf('#', pos);
		var longestName = "", longestChannelName = "", html = "", channelName = "", res;
		while(pos != -1) {
		++pos;
		channelNames.forEach(function(name) {
		channelName = String(line.midRef(pos, name.length));
		res = channelName.toLowerCase() == name.toLowerCase();
		if(res && longestName.length < channelName.length) {
		longestName = name;
		longestChannelName = channelName;
		}
		});
		if(longestName !== "") {
		html = "<a href=\"po:join/%1\">#%2</a>".format(longestName, longestChannelName);
		line = line.replaceBetween(pos-1, longestName.length+1, html);
		pos += html.length-1;
		longestName = "";
		longestChannelName = "";
		}
		pos = line.indexOf('#', pos);
		}
		return line;
		}
		
		var capsMessage = function(mess) {
		return /[A-Z]/.test(mess);
		}

		var normalLetter = function(l) {
		return /[a-z]/.test(l);
		}

		function POUser(id)
		{
		this.id = id;
		this.impersonation=undefined;
		this.ip = sys.ip(id);
		this.name = sys.name(id);
		this.lowername = sys.name(id).toLowerCase();
		var date = sys.time()*1;
		this.lastMsg = 0;
		this.loginTime = date;
		this.lastChallenge = 0;
		this.floodCount = 0;
		this.caps = 0;
		this.lastFuture = 0;

		if(typeof DataHash == "undefined") {
		print("Runtime Error: DataHash undefined.");
		this.muted = false;
		this.megauser = false;
		this.icon = "";
		this.voice = false;
		return;
		}
		
		if(DataHash.mutes !== undefined) {
		var d = DataHash.mutes;
		this.muted = d.hasOwnProperty(this.ip);
		}

		if(DataHash.megausers !== undefined) {
		this.megauser = DataHash.megausers.hasOwnProperty(this.lowername);
		}

		if(DataHash.rankicons !== undefined) {
		var i = DataHash.rankicons;
		if(i.hasOwnProperty(this.lowername)) {
		this.icon = i[this.lowername];
		}
		else {
		this.icon = undefined;
		}
		}
		
		if(DataHash.voices !== undefined) {
		var i = DataHash.voices;
		this.voice = i.hasOwnProperty(this.lowername);
  		}
		
		}

		POUser.prototype.toString = function () {
		return "[object POUser]";
		}

		POUser.prototype.muteCheck = function() {
		if(DataHash.mutes == undefined) {
		return;
		}

		if(!DataHash.mutes.hasOwnProperty(this.ip)&&this.muted == true) {
		this.muted = false;
		}
		}

		POUser.prototype.addFlood = function() {
		if(sys.auth(this.id) < 1) {
		this.floodCount++;
		sys.callLater('JSESSION.users('+this.id+').floodCount--',6);
		}
		}

		POUser.prototype.capsMute = function(message) {
		if(sys.auth(this.id) > 0) {
		return false;
		}
		if(typeof hpAuth != 'undefined' &&
		hpAuth(this.id) > 0)
		return false;


		for(var z in message) {
        if(capsMessage(message[z])) {
		this.caps+=1;
		}
        else {
		this.caps-=1;
		}
        if(this.caps < 0) {
		this.caps = 0;
		}
        }

		if(this.caps >= 50 && this.caps <= 69) {
		botMessage(this.id, "You are nearing your caps mute.");
		}
		
		if(this.caps >= 70) {
		sys.sendHtmlAll("<timestamp/><b>Caps Mute Message</b> -- <font color="+script.namecolor(this.id)+"><b>"+this.name+":</b></font> "+ html_escape(message), watch);
		botAll(this.name+" was muted for 5 minutes for spamming caps!",0);

		var bantime = 60*5;
		var thetime = sys.time()*1 + bantime;

		DataHash.mutes[this.ip] = {by:Config.Bot.bot+"</i>",why:"Spamming caps.","ip":this.ip,time:thetime};
		cache.write("mutes",JSON.stringify(DataHash.mutes));

		this.caps = 0;
		this.muted = true;
		return true;
		}

		return false;
		}


		function POChannel(id)
		{ 
		this.name = sys.channel(id);
		this.id = id;

		this.chanAuth = {};
		this.tourAuth = {};
		this.creator = '';
		this.topic = 'Welcome to '+this.name+'!';
		this.topicsetter = '';
		this.toursEnabled = false;

		if(typeof(channels) != "undefined"&&id in channels||typeof(channels) == "undefined") {
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

		POChannel.prototype.giveTourAuth = function(name) {
		if(this.tourAuth[name.toLowerCase()] !== undefined)
		return false;
		this.tourAuth[name.toLowerCase()] = {'ip':sys.dbIp(name)};
		return true;
		}

		POChannel.prototype.takeTourAuth = function(name) {
		if(this.tourAuth[name.toLowerCase()] == undefined)
		return false;
		delete this.tourAuth[name.toLowerCase()];
		return true;
		}
		POChannel.prototype.toString = function () {
		return "[object POChannel]";
		}

		POChannel.prototype.changeTopic = function(source,topic) {
		if(isEmpty(topic)) {
		if(this.topic == '') {
		botMessage(source,"No Topic exists!",this.id);
		return;
		}

		botEscapeMessage(source,"Topic: "+this.topic,this.id);

		if(this.topicsetter != '') {
		botMessage(source,"Set by: "+this.topicsetter,this.id)
		}

		if(this.defaultTopic) {
		botMessage(source,"This is a default topic.",this.id);
		}

		return;
		}

		if(!this.isChanMod(source)) {
		botEscapeMessage(source,"You don't have the rights!",this.id);
		return;
		}

		if(topic.toLowerCase() == "default") {
		this.topic = "Welcome to "+this.name+"!";
		this.defaultTopic = true;
		this.topicsetter = '';
		botAll("The topic was changed by "+sys.name(source)+" to: "+this.topic,this.id);
		return;
		}

		this.topic = topic;
		this.topicsetter=sys.name(source);
		this.defaultTopic = false;
		botAll("The topic was changed by "+sys.name(source)+" to: "+this.topic,this.id);
		return;
		}

		POChannel.prototype.changeAuth = function(name,newauth) {
		if(this.chanAuth == undefined)
		this.chanAuth = {};
		var nh = typeof name == "number"
		? sys.name(name).toLowerCase()
		: name.toLowerCase()
		this.chanAuth[nh] = newauth;
		}

		POChannel.prototype.canIssue = function(src,tar) {
		if(this.chanAuth == undefined) {
		this.chanAuth = {};
		return false;
		}
		var t = typeof tar == "number" ? sys.name(tar).toLowerCase() : tar.toLowerCase()
		var so = typeof src == "number" ? sys.name(src).toLowerCase() : src.toLowerCase();
		var o = typeof src == "number" ? src : sys.id(src);
		if(this.chanAuth[so] <= this.chanAuth[t]&&!this.isChanOwner(o)) {
		return false;
		}
		return true;
		}

		POChannel.prototype.isBannedInChannel = function (srcip) {
		if(typeof(this.banlist) == "undefined") {
		this.banlist = {};
		}

		return typeof this.banlist[srcip] == "object";
		}

		POChannel.prototype.isMutedInChannel = function (ip) {
		if(this.mutelist == undefined)
		this.mutelist = {};
		return typeof this.mutelist[ip] == "object";
		}

		POChannel.prototype.isChanMod = function (userid) {
		if(this.chanAuth == undefined) {
		this.chanAuth = {}; }
		return this.chanAuth[sys.name(userid).toLowerCase()] >= 1;
		}

		POChannel.prototype.isChanAdmin = function (userid) {
		if(this.chanAuth == undefined) {
		this.chanAuth = {}; }
		return this.chanAuth[sys.name(userid).toLowerCase()] >= 2;
		}

		POChannel.prototype.isChanOwner = function (userid) {
		if(this.chanAuth == undefined) {
		this.chanAuth = {}; }
		return this.chanAuth[sys.name(userid).toLowerCase()] >= 3;
		}

		function POGlobal(id) { }

		/* Not done yet, regexps fail. 
		_SyntaxHighlighter = function () {
		
		// onReplace
		var commentBlock = function ($1) {
		if(this.inComment)
		return $1;
		this.inComment = true;
		return "<font color=green"+$1+"</font>";
		}
		
		var commentLine = function ($1) {
		if(this.inComment)
		return $1;
		this.inComment = true;
		return "<font color=lightblue>"+$1+"</font>";
		}
		
		this.commentBlock = [/\/\* (.*?)\*\//gm, commentBlock];
		this.commentLine = [/\/\/ (.*?)/g, commentLine];
		this.string1 = [/\"(.*?)\"/g, "purple"];
		this.string2 = [/\'(.*?)\'/g, "purple"];
		
		this.hash = [/\{(.*?)\}/g, "orange"];
		this.keyWords = [
		"in", "function", "prototype", "var", "this", "do", 
		"for", "return", "void", "while", "with", "case", 
		"default", "switch", "try", "catch", "finally", "new",
		"true", "false"];
		
		this.keyWords.sort(
		function(first, second) {
		if(first.length >= second)
		return first;
		else
		return second;
		});
		
		this.keyword = ["darkblue", true, true, false];
		this.functionStart = [/(.*?)\./, "darkred"];
		this.number = [/[0-9]/g, "red"];
		
		this.operators = ["+", "|","&", "*", "%", "-", "=", "/"];
		this.operator = ["grey", false, false, true];
		}
		
		_SyntaxHighlighter.prototype.highlight = function (code) {
		var c = code;
		
		c = c.replace(this.commentBlock[0], 
		"<font color="+this.commentBlock[1]+">$1</font>");
		c = c.replace(this.commentLine[0], 
		"<font color="+this.commentLine[1]+">$1</font>");
		
		if(this.inComment)
		return c;
		
		c = c.replace(this.string1[0], 
		"<font color="+this.string1[1]+">$1</font>");
		c = c.replace(this.string2[0], 
		"<font color="+this.string2[1]+">$1</font>");
		c = c.replace(this.hash[0], 
		"<font color="+this.hash[1]+">$1</font>");
		c = c.replace(this.number[0], 
		"<font color="+this.number[1]+">$1</font>");
		c = c.replace(this.functionStart[0], 
		"<font color="+this.functionStart[1]+">$1</font>");
		
		// Keywords and operators
		var k = this.keyWords, o = this.operators;
		var km = this.keyword, om = this.operator, z;
		
		var captureFormatting = function (arr) {
		var isItalic = false, isUnderline = false, isBold = false, stra = "";

		stra += "<font color="+arr[0]+">";
		
		if(arr[1]) {
		stra += "<i>";
		isItalic = true;
		}
		
		if(arr[2]) {
		stra += "<u>";
		isUnderline = true;
		}
		
		if(arr[3]) {
		stra += "<b>";
		isBold = true;
		}
		
		stra += "[CODE]";
		if(isBold) stra += "</b>";
        if(isUnderline) stra += "</u>";
		if(isItalic) stra += "</i>";
        stra += "</font>";
		
		return stra;
		}
		
		var kmF = captureFormatting(km);
		var omF = captureFormatting(om);
		
		for(z in k) {
		c = c.replace(k[z], kmF.replace("[CODE]", k[z]));
		}
		
		for(z in o) {
		c = c.replace(o[z], omF.replace("[CODE]", o[z]));
		}
		
		return c;
		}
		
		
		EvalHighlighter = new _SyntaxHighlighter();
		*/
		
		_JSESSION = function () {
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

		_JSESSION.prototype.toString = function() {
		var str = "JSESSION Information\r\n";
		if(this.UsesUser)
		str += " Uses User; User contains "+objLength(this.UserData)+" values;"
		if(this.UsesChannel)
		str += " Uses Channel; Channel contains "+objLength(this.ChannelData)+" values;"
		if(this.UsesGlobal)
		str += " Uses Global;"
		if(this.ScriptID != undefined)
		str += " Has Script ID";

		return str;
		}

		_JSESSION.prototype.refill = function () {
        var x, users = sys.playerIds(), channels = sys.channelIds();
		if(this.UsesUser) {
		for(x in users) {
		if(this.users(users[x]) == undefined)
        this.createUser(users[x]);
		}
		}

		if(this.UsesChannel) {
		for(x in channels) {
		if(this.channels(channels[x]) == undefined)
		this.createChannel(channels[x]);
		}
		}
		}

		_JSESSION.prototype.users = function (id) {
		if(!this.UsesUser)
		return undefined;
		
		if(typeof this.UserData[id] == 'undefined')
		return undefined;
		
		return this.UserData[id];
		}

		_JSESSION.prototype.channels = function (id) {
		if(!this.UsesChannel)
		return undefined;
		
		if(typeof this.ChannelData[id] == 'undefined')
		return undefined;
		
		return this.ChannelData[id];
		}

		_JSESSION.prototype.global = function () {
		if(!this.UsesGlobal)
		return undefined;
		
		if(typeof this.GlobalData == 'undefined')
		return undefined;
		
		return this.GlobalData;
		}

		_JSESSION.prototype.identifyScriptAs = function (script) {
		if(this.ScriptID == undefined || this.ScriptID != script) {
		this.clearAll();
		}
		this.ScriptID = script;
		}

		_JSESSION.prototype.registerUser = function (func) {
		if(typeof func != "function")
		return;

		this.UserFunc = func;
		this.UsesUser = true;
		}

		_JSESSION.prototype.registerChannel = function(func) {
		if(typeof func != "function")
		return;

		this.ChannelFunc = func;
		this.UsesChannel = true;
		this.createChannel(0);
		}

		_JSESSION.prototype.registerGlobal = function(func) {
		if(typeof func != "function")
		return;

		this.GlobalFunc = func;
		this.UsesGlobal = true;
		this.GlobalData = new func();
		}

		_JSESSION.prototype.createChannel = function (id) {
		if(!this.UsesChannel)
		return false;

		if(typeof this.ChannelData[id] != "undefined")
		return false;

		if(sys.channel(id) == undefined)
		return false;
		
		this.ChannelData[id] = new this.ChannelFunc(id);
		return true;
		}

		_JSESSION.prototype.destroyChannel = function (id) {
		if(!this.UsesChannel)
		return false;
		if(id == 0)
		return false;

		if(typeof this.ChannelData[id] == "undefined")
		return false;

		delete this.ChannelData[id];
		return true;
		}

		_JSESSION.prototype.createUser = function (id) {
		if(!this.UsesUser)
		return false;

		if(typeof this.UserData[id] != "undefined")
		return false;

		if(sys.name(id) == undefined)
		return false;

		this.UserData[id] = new this.UserFunc(id);
		return true;
		}

		_JSESSION.prototype.destroyUser = function (id) {
		if(!this.UsesUser)
		return false;
		if(typeof this.UserData[id] != "undefined")
		return false;
		if(sys.name(id) == undefined)
		return false;

		delete this.UserData[id];
		return true;
		}

		_JSESSION.prototype.clearAll = function () {

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

		if(typeof JSESSION == 'undefined') {
		// Otherwise will reset user/channel data every script load.
		JSESSION = new _JSESSION();
		}
		
		cut = function(array, entry, join) {
		if(!join) join = "";
		return array.splice(entry).join(join);
		}

		function Tours(id) {
		this.id = id;
		this.tourmode = 0;
		this.tourstarter = "";
		this.prize = "";
		this.roundnumber = 0;
		this.tourtier = "";
		this.tournumber = 0;
		this.AutoStartBattles = true;
		this.remaining = 0;
		this.finals = false;

		this.battlemode = 0;

		this.completed = {};
		this.couples = {};
		this.losers = [];
		this.ongoingBattles = [];
		this.idleBattles = [];
		this.startedBattles = [];
		this.winners = [];
		this.players = {};
		this.roundplayers = 0;
		}

		Tours.prototype.border = function () {
		return sys.sendHtmlAll(tour,this.id);
		}

		Tours.prototype.white = function() {
		return sys.sendAll("",this.id);
		}

		Tours.prototype.identify = function (test) {
		if(test == null) test = this.battlemode;
		if(test === 0)
		return "No tournament is running.";
		else if(test === 1)
		return "Single Elimination";
		else if(test === 2)
		return "Double Elimination";
		else if(test === 3)
		return "Triple Elimination";
		else if(test === 4)
		return "Tag Team Single Elimination";
		else if(test === 5)
		return "Tag Team Double Elimination";
		else if(test === 6) 
		return "Tag Team Triple Elimination";
		else
		return "Unknown Mode";
		}

		Tours.prototype.command_autostartbattles = function (src,commandData) {
		var poUser = JSESSION.users(src);
		if(sys.auth(src) < 1&&!poUser.megauser&&!JSESSION.channels(this.id).isChanMod(src)) {
		botMessage(src, "You may not use the autostartbattles command.", this.id);
		return;
		}

		var cmdlc = commandData.toLowerCase();
		if (cmdlc != 'on' && cmdlc != 'off') {
		botMessage(src, "Pick either on or off.", this.id);
		return;
		}

		if (cmdlc == 'on' && !this.AutoStartBattles) {
		if(display == 1) {
		this.border();
		this.white();
		botEscapeAll(sys.name(src)+" turned auto start battles on.", this.id);
		this.white();
		this.border();
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ "<b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b> turned auto start battles off."
		+ "<hr width='300'>"
		+ "</center>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}
		this.AutoStartBattles = true;
		return;
		}

		if (cmdlc == 'off' && this.AutoStartBattles) {
		if(display == 1) {
		this.border();
		this.white();
		botEscapeAll(sys.name(src)+" turned auto start battles off.", this.id);
		this.white();
		this.border();
		this.AutoStartBattles = false;
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ "<b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b> turned auto start battles off."
		+ "<hr width='300'>"
		+ "</center>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		this.AutoStartBattles = false;
		}
		return;
		}

		botMessage(src,"Auto Start Battles is already "+cmdlc,this.id);
		return;
		}

		Tours.prototype.command_tourprize = function (src,commandData) {
		if (this.tourmode == 0){
		botMessage(src, "There is currently no tournament.",this.id);
		return;
		}
		if(isEmpty(this.prize)) {
		botMessage(src,"No tournament prize.",this.id);
		return;
		}
		botMessage(src,"The tournament prize is: "+this.prize,this.id);
		return;
		}

		Tours.prototype.command_join = function(src,commandData) {
		if (this.tourmode != 1){
		botMessage(src, "You are unable to join because a tournament is not currently running or has passed the signups phase.",this.id);
		return;
		}
		var name = sys.name(src).toLowerCase();
		if (name in this.players){
		botMessage(src, "You are already in the tournament. You are not able to join more than once.",this.id);
		return;
		}
		var srctier = sys.tier(src);
		if (!cmp(srctier, this.tourtier)){
		botMessage(src, "You are currently not battling in the " + this.tourtier + " tier. Change your tier to " + this.tourtier + " to be able to join.",this.id);
		return;
		}

		if (this.tourSpots() > 0){
		this.buildHash(src);

		botAll(sys.name(src) + " joined the tournament! " + this.tourSpots() + " more spot(s) left!", this.id);

		if (this.tourSpots() == 0){
		this.tourmode = 2;
		this.roundnumber = 0;
		this.roundPairing();
		}
		}
		else {
		botMessage(src,"There are no spots remaining.",this.id);
		}
		return;
		}

		Tours.prototype.command_unjoin = function(src,commandData) {
		if (this.tourmode == 0) {
		botMessage(src, "Wait till the tournament has started.", this.id);
		return;
		}

		var name2 = sys.name(src).toLowerCase();
		if (!name2 in this.players) {
		botMessage(src, "You have not joined the tournament.", this.id);
		return;
		}

		if(this.tourmode == 2) {
		this.remaining--;
		}

		if(this.players[name2].couplesid != -1 && this.tourmode == 2 && this.startedBattles.indexOf(name2) > -1)  {
		this.tourBattleEnd(this.tourOpponent(name2), name2, true);
		botEscapeAll(sys.name(src) + " left the tournament!", 0);
		}
		delete this.players[name2];

		if (this.roundplayers == 0){
		this.roundPairing();
		}

		if(!this.tagteam_tour() || this.tourmode != 2)
		return;
		
		var loser = "";
		var winners = [];
		
		if(this.playersOfTeam(this.Blue) == 0) {
		loser = "Team Blue";
		winners = this.namesOfTeam(this.Red);
		}
		else if (this.playersOfTeam(this.Red) == 0) {
		loser = "Team Red";
		winners = this.namesOfTeam(this.Blue);
		}
		
		if(loser == "")
		return;
		
		if(display == 1) {
		this.border();
		this.white();
		botEscapeAll(loser+" lost the Tournament!",this.id);
		botEscapeAll(winners.join(", ")+" won the Tournament! (no prizes will be given)", this.id);
		this.white();
		this.border();
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ loser+" lost the Tournament!"
		+ winners.join(", ")+" won the Tournament! <small><b>(no prizes will be given)</b></small>"
		+ "</center>"
		+ "<hr width='300'>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}
		
		return;
		}

		Tours.prototype.command_viewround = function (src,commandData) {
		if (this.tourmode != 2){
		botMessage(src, "You are unable to view the round because a tournament is not currently running or is in signing up phase.",this.id);
		return;
		}

		sys.sendMessage(src, "",this.id);
		sys.sendHtmlMessage(src, style.header,this.id);
		sys.sendMessage(src, "",this.id);

		botMessage(src,"Round " + this.roundnumber + " of " + this.tourtier + " tournament",this.id);
		if (this.losers.length > 0) {
		sys.sendMessage(src, "",this.id);
		botMessage(src,"Battles finished",this.id);
		sys.sendMessage(src, "",this.id);
		for (var x = 0; x < this.losers.length*2; x+=2)
		botMessage(src,html_escape(this.losers[x]) + " won against " + html_escape(this.winresults[x+1]),this.id);
		}

		sys.sendMessage(src, "",this.id);

		if (this.ongoingBattles.length > 0) {
		sys.sendMessage(src, "",this.id);
		botMessage(src,"Ongoing battles",this.id);
		sys.sendMessage(src, "",this.id);
		var x = 0;
		for (x in this.ongoingBattles) {
		botMessage(src,html_escape(this.ongoingBattles[x]) + " VS " + html_escape(this.ongoingBattles[x+1]),this.id);
		x += 1;
		}

		sys.sendMessage(src, "",this.id);
		}

		if (this.idleBattles.length > 0) {
		sys.sendMessage(src, "",this.id);
		botMessage(src,"Yet to start battles",this.id);
		sys.sendMessage(src, "",this.id);

		var x = 0;
		for (x in this.idleBattles) {
		botMessage(src,html_escape(this.idleBattles[x]) + " VS " + html_escape(this.idleBattles[x+1]),this.id);
		x += 1;
		}
		sys.sendMessage(src, "",this.id);
		}

		if (this.winners.length > 0) {
		sys.sendMessage(src, "",this.id);
		botMessage(src,"Members to the next round",this.id);
		sys.sendMessage(src, "",this.id);

		var str = this.winners.join(", ");

		botMessage(src,str,this.id);
		sys.sendMessage(src, "",this.id);
		}

		sys.sendHtmlMessage(src, style.footer, this.id);
		return;
		}

		Tours.prototype.command_dq = function (src,commandData) {
		var poUser = JSESSION.users(src);
		if (JSESSION.channels(this.id).tourAuth[sys.name(src).toLowerCase()] == undefined&&sys.auth(src) < 1&&!poUser.megauser&&!JSESSION.channels(this.id).isChanMod(src)) {
		botMessage(src, "You may not use the dq command.",this.id);
		return;
		}
		
		if (this.tourmode == 0) {
		botMessage(src, "Wait until the tournament has started.",this.id);
		return;
		}
		var name2 = commandData.toLowerCase();
		if(!name2 in this.players) {
		botMessage(src, "This player is not in the tournament.", this.id);
		return;
		}

		if(this.tourmode == 2)
		this.remaining--;

		if(display == 1) {
		this.border();
		this.white();
		botEscapeAll(commandData + " was removed from Tournament by " + sys.name(src) + "!",this.id);
		this.white();
		this.border();
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ commandData+" was removed from the Tournament by <b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b>!"
		+ "<hr width='300'>"
		+ "</center>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}

		if(this.players[name2].couplesid != -1 && this.startedBattles.indexOf(name2) > -1) {
		this.tourBattleEnd(this.tourOpponent(name2), name2, true);
		}
		delete this.players[name2];
		
		if(!this.tagteam_tour() || this.tourmode != 2)
		return;
		
		var loser = "";
		var winners = [];
		
		if(this.playersOfTeam(this.Blue) == 0) {
		loser = "Team Blue";
		winners = this.namesOfTeam(this.Red);
		}
		else if (this.playersOfTeam(this.Red) == 0) {
		loser = "Team Red";
		winners = this.namesOfTeam(this.Blue);
		}
		
		if(loser == "")
		return;
		
		if(display == 1) {
		this.border();
		this.white();
		botEscapeAll(loser+" lost the Tournament!",this.id);
		botEscapeAll(winners.join(", ")+" won the Tournament! (no prizes will be given)", this.id);
		this.white();
		this.border();
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ loser+" lost the Tournament!"
		+ winners.join(", ")+" won the Tournament! <small><b>(no prizes will be given)</b></small>"
		+ "</center>"
		+ "<hr width='300'>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}
		
		return;
		}
        
		Tours.prototype.command_switch = function (src, commandData) {
		var poUser = JSESSION.users(src);
		if (JSESSION.channels(this.id).tourAuth[sys.name(src).toLowerCase()] == undefined&&sys.auth(src) < 1&&!poUser.megauser&&!JSESSION.channels(this.id).isChanMod(src)) {
		botMessage(src, "You may not use the switch command.",this.id);
		return;
		}
		
		var parts = commandData.split(':');
		if(!this.isInTourney(parts[0]) 
		|| sys.id(parts[1]) == undefined) {
		botMessage(src, "The players need to exist!", this.id);
		return;
		}
		if(this.ongoingTourneyBattle(parts[0])) {
		botMessage(src, "You can't switch a battling player!", this.id);
		return;
		}
		
		var obj = this.players[parts[0].toLowerCase()];
		this.players[parts[1]] = obj;
		this.players[parts[1]].name = sys.name(sys.id(parts[1]));
		delete this.players[parts[0].toLowerCase()];
		
		if(display == 1) {
		this.border();
		this.white();
		botEscapeAll(parts[0] + " was switched with "+parts[1]+" by " + sys.name(src) + "!",this.id);
		if(this.tourmode == 1) {
		botEscapeAll(this.tourSpots() + " more spot(s) left!", this.id);
		}
		this.white();
		this.border();
		}
		else {
		var spots = this.tourmode == 1 ? "<br><b>"+this.tourSpots() +"</b> more spot(s) left!" : '';
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ parts[0]+" was switched with "+parts[1]+" by <b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b>!"
		+ spots
		+ "<hr width='300'>"
		+ "</center>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}
		}
		
		Tours.prototype.command_push = function (src,commandData) {
		var poUser = JSESSION.users(src);
		if (JSESSION.channels(this.id).tourAuth[sys.name(src).toLowerCase()] == undefined&&sys.auth(src) < 1&&!poUser.megauser&&!JSESSION.channels(this.id).isChanMod(src)) {
		botMessage(src, "You may not use the push command.",this.id);
		return;
		}
		if (this.tourmode == 0) {
		botMessage(src, "Wait until the tournament has started.",this.id);
		return;
		}
		
		if(this.tourmode == 2 && this.tagteam_tour()) {
		botMessage(src, "You cannot add players to a running tag team tour!", this.id);
		return;
		}
		
		if (this.isInTourney(commandData.toLowerCase())) {
		botMessage(src, commandData + " is already in the tournament.",this.id);
		return;
		}
		if(sys.dbIp(commandData) == undefined) {
		botMessage(src,"Unknown target!",this.id);
		return;
		}
		if(this.tourmode == 2)
		this.remaining++;


		var name = sys.id(commandData) != undefined ? sys.name(sys.id(commandData)) : commandData;
		this.buildHash(name);
		
		if(display == 1) {
		this.border();
		this.white();
		botEscapeAll(commandData + " was added to the Tournament by " + sys.name(src) + "!",this.id);
		if(this.tourmode == 1) {
		botEscapeAll(this.tourSpots() + " more spot(s) left!", this.id);
		}
		this.white();
		this.border();
		}
		else {
		var spots = this.tourmode == 1 ? "<br><b>"+this.tourSpots() +"</b> more spot(s) left!" : '';
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ commandData+" was added to the Tournament by <b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b>!"
		+ spots
		+ "<hr width='300'>"
		+ "</center>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}

		if (this.tourmode == 1 && this.tourSpots() == 0) {
		this.tourmode = 2;
		this.roundnumber = 0;
		this.roundPairing();
		}
		
		return;
		}
		
		
		Tours.prototype.command_cancelbattle = function (src,commandData) {
		var poUser = JSESSION.users(src);
		if (JSESSION.channels(this.id).tourAuth[sys.name(src).toLowerCase()] == undefined&&sys.auth(src) < 1&&!poUser.megauser&&!JSESSION.channels(this.id).isChanMod(src)) {
		botMessage(src, "You may not use the cancelbattle command.",this.id);
		return;
		}
		if (this.tourmode != 2) {
		botMessage(src, "Wait until a tournament starts",this.id);
		return;
		}
		var name = commandData.toLowerCase();
		if(!name in this.players) {
		botMessage(src, "This player is not in the tournament", this.id);
		return;
		}
		var startername = sys.id(name) != undefined ? sys.name(sys.id(name)) : DataHash.names[name];
		if(this.startedBattles.indexOf(startername) == -1) {
		botMessage(src, "Either this player is through the next round, or his/her battle hasn't begon yet.", this.id);
		return;
		}

		var namenum = this.players[name].couplenum, nummy = this.players[name].couplesid;
		var opp = this.couples[nummy][namenum].toLowerCase();
		delete this.startedBattles[name];
		delete this.startedBattles[opp];
		if(display == 1) {
		this.border();
		this.white();
		botEscapeAll(commandData + " can forfeit their battle and rematch now.",this.id);
		this.white();
		this.border();
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ commandData+" can forfeit their battle and rematch now."
		+ "</center>"
		+ "<hr width='300'>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}
		return;
		}

		Tours.prototype.command_tour = function (src,commandData) {
		var poUser = JSESSION.users(src);
		if (JSESSION.channels(this.id).tourAuth[sys.name(src).toLowerCase()] == undefined&&sys.auth(src) < 1&&!poUser.megauser&&!JSESSION.channels(this.id).isChanMod(src)) {
		botMessage(src, "You may not use the tour command.",this.id);
		return;
		}
		if (typeof(this.tourmode) != "undefined" && this.tourmode > 0){
		botMessage(src, "You are unable to start a tournament because one is still currently running.",this.id);
		return;
		}

		this.clearVariables();

		var commandpart = commandData.split(':');
		this.tournumber = parseInt(commandpart[1]);


		var cp = parseInt(commandpart[2]);
		if(this.identify(cp) == "Unknown Mode") {
		cp = 1; /* set to Single Elimination */
		}
		
		this.battlemode = cp;
		
		if(!this.tagteam_tour()) {
		if (isNaN(this.tournumber) || this.tournumber <= 2){
		botMessage(src, "You must specify a tournament size of 3 or more.",this.id);
		return;
		}
		}
		else {
        if (isNaN(this.tournumber) || this.tournumber <= 3){
		botMessage(src, "You must specify a tournament size of 4 or more.",this.id);
		return;
		}
		
		var half = this.tournumber/2;
		if(Math.floor(half) != half) {
		botMessage(src, "You must specify an even number of players for tag team tours. [4, 8, 12]", this.id)
		return;
		}
		}
		
		var tier = sys.getTierList();
		var found = false;

		for (var x in tier) {
		if (cmp(tier[x], commandpart[0])) {
		this.tourtier = tier[x];
		found = true;
		break;
		}
		}

		if (!found) {
		botMessage(src, "There does not seem to be a " + commandpart[0] + " tier.",this.id);
		return;
		}

		commandpart[3] = cut(commandpart,3,':');
		this.prize = html_escape(commandpart[3]);

		if(isEmpty(this.prize)) {
		this.prize = "";
		}

		this.remaining = this.tournumber;
		this.tourmode = 1;

		if(display==1) {
		this.white()
		this.border();
		sys.sendHtmlAll("<timestamp/><b><font color=green>A Tournament was started by " + sys.name(src) + "! </b></font>", this.id);
		sys.sendHtmlAll("<timestamp/><b><font color=red>Players:</font></b> " + this.tournumber, this.id);
		sys.sendHtmlAll("<timestamp/><b><font color=blue>Type:</b></font> "+this.identify(cp), this.id);
		sys.sendHtmlAll("<timestamp/><b><font color=orange>Tier:</b></font> " + this.tourtier, this.id);
		if(!isEmpty(this.prize)) {
		sys.sendHtmlAll("<timestamp/><b><font color=brown>Prize:</b></font> "+this.prize, this.id);
		}
		this.border();
		sys.sendHtmlAll("<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>",this.id);
		this.border();
		this.white();
		}
		else
		{
		var prize = !isEmpty(this.prize) ? '<b>Prize:</b> '+this.prize+'<br>' : ''
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ "A Tournament was started by <b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b>!<br>"
		+ "<b>Players:</b> "+this.tournumber+" <br>"
		+ "<b>Type:</b> "+this.identify(cp)+" <br>"
		+ "<b>Tier:</b> "+this.tourtier+" <br>"
		+ prize
		+ "Type <b style='color:green'>/Join</b> to join the Tournament!"
		+ "</center>"
		+ "<hr width='300'>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}
		this.tourstarter = sys.name(src);
		return;
		}

		Tours.prototype.command_changespots = function (src,commandData) {
		var poUser = JSESSION.users(src);
        if (JSESSION.channels(this.id).tourAuth[sys.name(src).toLowerCase()] == undefined&&sys.auth(src) < 1&&!poUser.megauser&&!JSESSION.channels(this.id).isChanMod(src)) {
		botMessage(src, "You may not use the changespots command.",this.id);
		return;
		}

		if (this.tourmode != 1) {
		botMessage(src, "You cannot change the number of spots because "+ChannelLink(sys.channel(this.id))+" Tournament has passed the sign-up phase.",this.id);
		return;
		}

		var count = parseInt(commandData);
		if(!this.tagteam_tour()) {
		if (isNaN(count) || count < 3) {
		botMessage(src, "You must specify a size of 3 or more.",this.id);
		return;
		}
		}
		else {
		if (isNaN(count) || count <= 3){
		botMessage(src, "You must specify a size of 4 or more.",this.id);
		return;
		}
		
		var half = count/2;
		if(Math.floor(half) != half) {
		botMessage(src, "You must specify an even number of players for tag team tours. [4, 8, 12]", this.id)
		return;
		}
		}

        if (count < objLength(this.players)) {
		botMessage(src, "There are more than that people registered.",this.id);
		return;
		}
		this.tournumber = count;

		if(display == 1) {
		this.border();
		this.white();
		botEscapeAll(sys.name(src) + " changed the numbers of entrants to " + count + "!", this.id);
		botEscapeAll(this.tourSpots() + " more spot(s) left!", this.id);
		this.white();
		this.border();
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ "<b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b> changed the numbers of entrants to " + count + "!"
		+ "<b>"+this.tourSpots() + "</b> more spot(s) left!"
		+ "</center>"
		+ "<hr width='300'>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}
		
		if (this.tourSpots() == 0) {
		this.tourmode = 2;
		this.roundnumber = 0;
		this.roundPairing();
		}
		
		}

		Tours.prototype.command_endtour = function (src,commandData) {
		var poUser = JSESSION.users(src);
		if (JSESSION.channels(this.id).tourAuth[sys.name(src).toLowerCase()] == undefined&&sys.auth(src) < 1&&!poUser.megauser&&!JSESSION.channels(this.id).isChanMod(src)) {
		botEscapeMessage(src, "You may not use the endtour command.",this.id);
		return;
		}
		if (this.tourmode != 0){
		this.clearVariables();

		if(display == 1) {
		this.border();
		this.white();
		botAll("The Tournament was cancelled by " + sys.name(src) + "!", this.id);
		this.white();
		this.border();
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ "The Tournament was cancelled by <b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b>!"
		+ "<hr width='300'>"
		+ "</center>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",this.id);
		}
		return;
		}
		
		botMessage(src, "You are unable to end the Tournament because it is not currently running.",this.id);
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
		this.losers = [];
		this.ongoingBattles = [];
		this.startedBattles = [];
		this.idleBattles = [];
		this.winners = [];
		this.players = {};
		this.roundplayers = 0;
		}
		
		Tours.prototype.cleanRoundVariables = function () {
		this.losers = [];
		this.ongoingBattles = [];
		this.winners = [];
		this.idleBattles = [];
		this.roundplayers = [];
		}

		Tours.prototype.playerName = function(hash, hashno) {
		var x, now = 0;
		for(x in hash) {
		if(now == hashno)
		return hash[x].name;
		else
		now++;
		}
		
		return '';
		}

		Tours.prototype.first = function(hash) {
		for(var x in hash)
		return hash[x];
		}

		Tours.prototype.teamWin = function () {
		var b = this.Blue;
		var r = this.Red;
		var loser = "";
		var winners = [];
		var loseteam = -1;
		
		if(this.playersOfTeam(b) == 0) {
		loser = "Team Blue";
		winners = this.namesOfTeam(r);
		loseteam = b;
		}
		else if (this.playersOfTeam(r) == 0) {
		loser = "Team Red";
		winners = this.namesOfTeam(b);
		loseteam = r;
		}
		
		return {'winners': winners, 'loser': loser, 'losingteam': loseteam};
		}
		
		Tours.prototype.roundPairing = function () {
		if(this.roundnumber == 0 && this.tagteam_tour())
		this.buildTeams();
		
		this.roundnumber += 1;
		this.cleanRoundVariables();
		
		if (objLength(this.players) == 1) {
		var winner = this.first(this.players).name;
		botAll("The winner of the "+this.tourtier+" Tournament is " + winner + "!", this.id);
		botAll("Congratulations, " + winner + ", on your success! ", this.id);
		if(typeof this.prize != "undefined") {
		if(!isEmpty(this.prize)) {
		botAll(winner + " will receive the tournament prize: "+this.prize+"!", this.id);
		}
		}
		this.white();
		this.border();

		if(this.id == 0) {
		var name = winner.toLowerCase();
		if(sys.dbIp(name) == undefined) {
		this.clearVariables();
		return;
		}
		var nameId = sys.id(name);
		var money = DataHash.money;
		if(money[name] == undefined) {
		money[name]=0;
		}
		var randNum = sys.rand(500,1001);
		money[name] += randNum;
		cache.write("money",JSON.stringify(DataHash.money));

		if(nameId != undefined) {
		botMessage(nameId,"You won "+randNum+" money!",this.id);
		}
		}

		this.clearVariables();
		return;
		}

		if(this.tagteam_tour()) {
		var winners = this.teamWin();
		if(winners.winners.length != 0 && winners.loser != "" &&
		winners.losingteam != -1) {
		// We have winners!
		var win = winners.winners.join(" and ");
		botAll("The winners of the "+this.tourtier+" Tournament are " + win +"!", this.id);
		botAll("Congratulations, " + win + ", on your success! ", this.id);
		if(typeof this.prize != "undefined") {
		if(!isEmpty(this.prize)) {
		botAll(win + " will receive the tournament prize: "+this.prize+"!", this.id);
		}
		}
		this.white();
		this.border();

		if(this.id == 0) {
		var z, ww = winners.winners, name;
		for(z in ww) {
		name = ww[z];
		if(sys.dbIp(name) == undefined) {
		continue;
		}
		
		var nameId = sys.id(name);
		var money = DataHash.money;
		if(money[name] == undefined) {
		money[name]=0;
		}
		var randNum = sys.rand(500,1001);
		money[name] += randNum;
		cache.write("money",JSON.stringify(DataHash.money));

		if(nameId != undefined) {
		botMessage(nameId,"You won "+randNum+" money!",this.id);
		}
		}
        }
		
		this.clearVariables();
		return;
		}
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
		var tempplayers = {}, x, p = this.players;
		var x1, name1, n1tl, x2, name2, n2tl;
		
		for(x in p)
		tempplayers[x] = p[x];
		
		var a;
		
		var team = "<b><font color=blue>[Team Blue]</font></b>", 
		team2 = "<b><font color=red>[Team Red]</font></b>";
		
		if(!this.tagteam_tour()) {
		team = "", team2 = "";
		}
		
		for(a in p) {
		if(!this.tagteam_tour()) {
		x1 = this.randomPlayer(tempplayers);
		if(isEmpty(x1))
		break;
		name1 = this.playerName(tempplayers, x1);
		n1tl = name1.toLowerCase();
		delete tempplayers[n1tl];
		x2 = this.randomPlayer(tempplayers);
		if(isEmpty(x2))
		break;
		name2 = this.playerName(tempplayers, x2);
		n2tl = name2.toLowerCase();
		delete tempplayers[n2tl];
		} else {
	    x1 = this.randomPlayer(tempplayers, 0);
		if(isEmpty(x1))
		break;
		name1 = this.playerName(tempplayers, x1);
		n1tl = name1.toLowerCase();
		delete tempplayers[n1tl];
		x2 = this.randomPlayer(tempplayers, 1);
		if(isEmpty(x2))
		break;
		name2 = this.playerName(tempplayers, x2);
		n2tl = name2.toLowerCase(); 
		delete tempplayers[n2tl];
		}
		
		try {
		this.couples[i] = [name1, name2];
		this.players[n1tl].couplesid = i;
		this.players[n2tl].couplesid = i;
		this.players[n1tl].couplenum = 0;
		this.players[n2tl].couplenum = 1;
		} catch(e) { // Had to do it this way >.>
		break;
		}
		
		if(!this.AutoStartBattles) {
		this.idleBattles.push(name1);
		this.idleBattles.push(name2);
		}
		i++;

		if (!this.finals)
		botAll(i + ". " + team+name1 + " VS " + team2+name2, this.id);
		else
		botAll(team+name1 + " VS " + team2+name2, this.id);
		}
		
		this.white();
		if (objLength(tempplayers) > 0) {
		botAll(this.first(tempplayers).name + " is randomly selected to go to next round!", this.id);
		this.white();
		}

		this.border();
		this.white();
		if(this.AutoStartBattles) {
		var t;
		for(t in this.couples) {
		var p = this.couples[t][0].toLowerCase(), op = this.couples[t][1].toLowerCase();
		if(sys.id(p) !== undefined&&sys.id(op) !== undefined) {
		if(sys.tier(sys.id(p)) == sys.tier(sys.id(op))&&cmp(sys.tier(sys.id(p)),this.tourtier)) {
		if(!this.ongoingTourneyBattle(p)&&!this.ongoingTourneyBattle(op)) {
		sys.forceBattle(sys.id(p),sys.id(op),sys.getClauses(this.tourtier),0,false);
		this.startedBattles.push(p);
		this.startedBattles.push(op);
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
		if(this.players[name].couplesid == -1)
		return "";
		var namenum = this.players[name].couplenum, id = this.players[name].couplesid;
		namenum = namenum == 0 ? 1 : 0;
		var opp = this.couples[id][namenum];
		return opp;
		}

		Tours.prototype.areOpponentsForTourBattle = function(src, dest) {
		return this.isInTourney(sys.name(src)) && this.isInTourney(sys.name(dest)) && this.tourOpponent(sys.name(src)).toLowerCase() == sys.name(dest).toLowerCase();
		}

		Tours.prototype.areOpponentsForTourBattle2 = function(src, dest) {
		return this.isInTourney(src) && this.isInTourney(dest) && this.tourOpponent(src).toLowerCase() == dest.toLowerCase();
		}

		Tours.prototype.ongoingTourneyBattle = function (name) {
		return this.startedBattles.indexOf(name.toLowerCase()) > -1;
		}

		Tours.prototype.afterBattleStarted = function(src, dest) {
		if (this.tourmode == 2) {
		if (this.areOpponentsForTourBattle(src, dest)) {
		var n1 = sys.name(src), n2 = sys.name(dest);
		if (sys.tier(src) == sys.tier(dest) && cmp(sys.tier(src), this.tourtier)) {
		this.idleBattles.splice(n1, 1);
		this.idleBattles.splice(n2, 1);
		this.startedBattles.push(n1);
		this.startedBattles.push(n2);
		if(!this.finals)
		botAll("Round "+this.roundnumber+" Tournament match between "+sys.name(src)+" and "+sys.name(dest)+" has started!",this.id);
		else
		botAll("Final Round Tournament match between "+sys.name(src)+" and "+sys.name(dest)+" has started!",this.id);
		}
		}
		}
		}

		Tours.prototype.tie = function(src, dest) {
		var s = sys.name(src), d = sys.name(dest);
		var sTL = s.toLowerCase, dTL = d.toLowerCase();
		botAll(s+" and "+d+" tied and has to battle again for the Tournament!</font></b>",this.id);
		if(this.AutoStartBattles) {
		sys.forceBattle(src,dest,sys.getClauses(this.tourtier),0,false);
		}
		else {
		this.idleBattles.push(sTL);
		this.idleBattles.push(dTL);
		this.startedBattles.splice(sTL, 1);
		this.startedBattles.splice(dTL, 1);
		}
		}

		Tours.prototype.afterBattleEnded = function(src, dest, desc) {
		if (this.tourmode != 2)
		return;
		if(desc == "tie") {
		this.tie(src, dest);
		return;
		}
		
		this.tourBattleEnd(sys.name(src), sys.name(dest));
		}

		Tours.prototype.tourBattleEnd = function(src, dest, rush) {
		if (!this.areOpponentsForTourBattle2(src, dest) || !this.ongoingTourneyBattle(src)) {
		return;
		}
		
		var srcTL = src.toLowerCase();
		var destTL = dest.toLowerCase();

		if(this.battlemode == 1||this.battlemode == 4||rush) {
		this.losers.push(src);
		this.losers.push(dest);
		this.winners.push(src);

		this.startedBattles.splice(srcTL, 1);
		this.startedBattles.splice(destTL, 1);
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
		else if(this.battlemode == 2 || this.battlemode == 3
		|| this.battlemode == 5 || this.battlemode == 6) {
		this.players[srcTL].roundwins++;
		var winnums = this.players[srcTL].roundwins + this.players[destTL].roundwins;
		var srcwin = this.players[srcTL].roundwins;
		var destwin = this.players[destTL].roundwins;
		var winner = '', loser = '', winnerTL = '', loserTL = '';
		var tln = this.battlemode-winnums;
		
		if(winnums >= this.battlemode) {
		if(srcwin == destwin) {
		this.tie();
		return;
		}
		
		if(srcwin > destwin) {
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
		
		this.losers.push(winner);
		this.losers.push(loser);
		this.winners.push(winner);
		
	    this.startedBattles.splice(srcTL, 1);
		this.startedBattles.splice(destTL, 1);
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
		botMessage(sid, "Great job, you've won this round! You have won "+srcwin+"/"+tln+" rounds so far.", this.id);
		botMessage(did, "Sadly, you have lost this round. Try to win next round! You have won "+srcwin+"/"+tln+" rounds so far.", this.id);
		sys.forceBattle(sid,did,sys.getClauses(this.tourtier),0,false);
		}
		}
		}

		Tours.prototype.tourSpots = function () {
		return this.tournumber - objLength(this.players);
		}
		
		Tours.prototype.randomPlayer = function (hash, team) {
		var ol = objLength(hash);
		if(ol == 1)
		return 0;
		if(ol == 2)
		return sys.rand(0, 2);
		var rand = sys.rand(0, ol);
		
		if(!this.tagteam_tour())
		return rand;
		
		var h = this.hashOf(hash, rand);
		if(h == undefined)
		return undefined;
		
		while(h.team != team) {
		h = this.hashOf(hash, sys.rand(0, ol));
		}
		
		return rand;
		}
		
		
		Tours.prototype.buildHash = function (src) {
		var name = sys.name(src);
		if(name == undefined)
		name = src;
		
		this.players[name.toLowerCase()] = {'name':name, 'couplesid':-1, 'couplenum':-1, 'roundwins':0, 'team': -1};
		}
		
		Tours.prototype.tagteam_tour = function () {
		var b = this.battlemode;
		return b > 3 && b < 7;
		}
		
		Tours.prototype.buildTeams = function () {
		var p = this.players, y, team = 0, id;
		for(y in p) {
		p[y].team = team;
		id = sys.id(p[y].name);
		if(team == 0) {
		if(id != undefined)
		botMessage(id, "You are in Team Blue.", this.id);
		
		team++;
		}
		else {
		if(id != undefined)
		botMessage(id, "You are in Team Red.", this.id);
		
		team--;
		}
		}
		}
		
		Tours.prototype.playersOfTeam = function (team) {
		var y, p = this.players, ret = 0;
		for(y in p) {
		if(p[y].team == team) 
		ret++;
		}
		
		return ret;
		}
		
		Tours.prototype.namesOfTeam = function (team) {
		var y, p = this.players, ret = [];
		for(y in p) {
		if(p[y].team == team) 
		ret.push(p[y].name);
		}
		
		return ret;
		}
		
		Tours.prototype.totalPlayers = function () {
		return objLength(this.players);
		}
		
		Tours.prototype.hashOf = function (hash, num) {
		var y, i =0;
		for(y in hash) {
		if(i == num) {
		return hash[y];
		}
		i++;
		}
		
		return undefined;
		}
		
		Tours.prototype.Blue = 0;
		Tours.prototype.Red = 1;

		function Mail(sender,text,title) {
		this.sender = sender;
		this.title = title;
		this.text = text;
		this.read = false;
		var date = new Date();
		this.sendtime = String(date);
		this.sendAgo = sys.time()*1;
		}

		String.prototype.contains = function(string) {
		var str = this;
        return str.indexOf(string) > -1;
		}

		// Used to get unicode value of some text.
        String.prototype.unicode = function() {
		var str = this, y, strlen = str.length;
		var uarr = [];
		for(y = 0; y < strlen; y++) {
		uarr.push(str.charCodeAt(y));
		}
		return uarr;
		}

		String.prototype.unicodeRegExp = function() {
		var str = this, y;
		var code = str.unicode();
		var code_str = "/";
		for(y in code) {
		code_str += "\\u"+code[y]+"|";
		}
		return code_str.substring(0,code_str.length-1)+"/";
        }

		String.prototype.name = function () {
		var str = this;
		if(typeof DataHash.names == "undefined")
		return str;
		if(typeof DataHash.names[str.toLowerCase()] != "undefined") {
		str = DataHash.names[str.toLowerCase()];
		}
		return str;
		}


		String.prototype.format = function () {
		var str = this;
		var exp, i, args = arguments.length, icontainer = 0;
		for (i = 0; i < args; i++) {
		icontainer++;
		exp = new RegExp("%"+icontainer,"");
		str = str.replace(exp, arguments[i]);
		}
		return str;
		}
		// Example: var mystring = 'Hello, %0'; mystring.format("someone");
		// Returns: Hello, someone

		String.prototype.midRef = function(position, n) { // QStringRef QString::midRef
		if(n == null || typeof n != "number")
		n = -1;
		
		var str = this;
		var strlen = str.length-1;
		if(position > strlen)
		return "";
		
		var substri = str.substr(position);
		if(n > strlen || n == -1) 
		return substri;
		
		return substri.substr(0, n);
		}
		
		String.prototype.replaceBetween = function (pos1, pos2, replace) {
		var str = this;
		var returnStr = str;
		var sub = str.substr(pos1, pos2);
		returnStr = returnStr.replace(sub, replace);
		
		return returnStr;
		}
		
		JSESSION.identifyScriptAs("JSESSION Original");
		JSESSION.registerUser(POUser);
		JSESSION.registerChannel(POChannel);
		JSESSION.registerGlobal(POGlobal);
		JSESSION.refill();

		if(typeof TourChanger == 'undefined') {
		TourChanger = function () {
		this.tourChange = false;
		this.uniqueID = NOTIFY_UNIQUE_ID;
		
	    this.checkID = function () {
		if(this.uniqueID != NOTIFY_UNIQUE_ID) {
		this.tourChange = false;
		this.once();
		this.uniqueID = NOTIFY_UNIQUE_ID;
		}
		}
		
		this.once = function () {
		if(this.tourChange)
		return;
		
		var tours = JSESSION.ChannelData, x;
		for(x in tours) {
		if(typeof tours[x].tour != "undefined") {
		tours[x].tour = new Tours(tours[x].id);
		botAll("Tournament was updated!", tours[x].id);
		}
		}
		
		this.tourChange = true;
		}
	    }
		}
		
		if(typeof NotifyTourChange == 'undefined') {
		NotifyTourChange = new TourChanger();
		}
		
		NotifyTourChange.checkID();
		NotifyTourChange.once();

		({
		customAbilityBans: function(src, e, tier) {
		if(!tier) tier = sys.tier(src);
		var ltier = tier.toLowerCase();
		var valid = true;
		var bans = DataHash.bannedAbilities;
		for (var i = 0; i < 6; ++i) {

		var ability = sys.ability(sys.teamPokeAbility(src, i));
		var lability = ability.toLowerCase();
		var poke = sys.pokemon(sys.teamPoke(src, i));
		var lpoke = poke.toLowerCase();

		if (bans[ltier] != undefined) {
		if(bans[ltier][lpoke] != undefined) {
		if(bans[ltier][lpoke].indexOf(lability) != -1) {
		botMessage(src, poke + " is not allowed to have ability " + ability + " in "+tier+". Please change it in Teambuilder (You are now in Challenge Cup).")
		valid = false;
		break;
		}
		}
		}
		}
		
		if (!valid) {
		sys.changeTier(src, "Challenge Cup")
		if(e) {
		sys.stopEvent();
		}
		}
		}
		,
		channelsLoad: function () {
		var makeChan = function(name) {
		sys.createChannel(name);
		return sys.channelId(name);
		}
		
		mafiachan = makeChan("Mafia Channel");
		trivia = makeChan("Trivia");
		watch = makeChan("Watch");
		staffchannel = makeChan("Staff Channel");
		scriptchannel = makeChan("Eval Area");
		
		channels = [0,mafiachan,trivia,staffchannel,watch,scriptchannel];
		updateChannelData();
		}
		,

		cacheload: function () {
		if(typeof createFile == 'undefined') {
		run("required_functions_load") }
		Cache_Framework = function (file) {
		this.file = file;
		this.sics = 0;
		createFile(this.file,"txt","{}");
		try {
		this.hash = JSON.parse(sys.getFileContent(this.file+".txt"));
		}
		catch(e) {
		this.hash = {};
		print(FormatError("Could not load cache from file "+this.file+".txt!", e))
		}
		}

		Cache_Framework.prototype.save = function(a,b) {
		if(isEmpty(a)||isEmpty(b)) {
		return;
		}
		if(typeof(this.hash[a]) == "undefined") {
		this.hash[a] = b;
		this.save();
		}
		}

		Cache_Framework.prototype.write = function(a,b) {
		if(isEmpty(a)||isEmpty(b)) {
		return;
		}
		this.hash[a] = b;
		this.savec();
		}

		Cache_Framework.prototype.remove = function(a) {
		if(isEmpty(a)||this.get(a) == "") {
		return;
		}
		delete this.hash[a];
		this.savec();
		}

		Cache_Framework.prototype.get = function(a) {
		if(isEmpty(a)) {
		return;
		}
		if(this.hash[a] == undefined) {
		return "";
		}
		return this.hash[a];
		}

		Cache_Framework.prototype.clearcache = function() {
		this.hash = {};
		sys.writeToFile(this.file+".txt","{}");
		}

		Cache_Framework.prototype.savec = function () {
		sys.writeToFile(this.file+".txt",JSON.stringify(this.hash));
		}

		Cache_Framework.prototype.sic = function(a,b) {
		if(typeof(this.hash[a]) == "undefined") {
		this.hash[a] = b;
		this.sics++;
		}
		}

		if(typeof cache == 'undefined')
		cache = new Cache_Framework("RegVals");
		if(typeof TrivCache == 'undefined')
		TrivCache = new Cache_Framework("Trivia");
		if(typeof ForumDB == 'undefined')
		ForumDB = new Cache_Framework("Forum");

		cache.sic("AuthLevel0Name","User");
		cache.sic("AuthLevel1Name","Mod");
		cache.sic("AuthLevel2Name","Admin");
		cache.sic("AuthLevel3Name","Owner");
		cache.sic("AuthLevel4Name","Invisible");
		cache.sic("ChanLevel0Name","Chan User");
		cache.sic("ChanLevel1Name","Chan Mod");
		cache.sic("ChanLevel2Name","Chan Admin");
		cache.sic("ChanLevel3Name","Chan Owner");
		cache.sic("TourLevel0Name","Tour User");
		cache.sic("TourLevel1Name","Megauser");
		cache.sic("ChanTour0Name","Chan Tour User");
		cache.sic("ChanTour1Name","Chan Megauser");
		cache.sic("MaxPlayersOnline",0);
		cache.sic('MaxMessageLength',500);
		cache.sic('TourDisplay',1);
		cache.sic("FutureLimit", 15);
		
		cache.sic("allowedit",false);
		cache.sic("allowicon",false);
		cache.sic("implock",true);
		cache.sic("motd",false);
		cache.sic("evallock",false);
		cache.sic("AutoStartTours",true);

		cache.sic("mutes","{}");
		cache.sic("tempbans","{}");
		cache.sic("rangebans","{}");
		cache.sic("names","{}");
		cache.sic("money","{}");
		cache.sic("rankicons","{}");
		cache.sic("mail","{}");
		cache.sic("bannedAbilities","{}");
		cache.sic("megausers","{}");
		cache.sic("tempauths","{}");
		cache.sic("idles", "{}");
		cache.sic("voices", "{}");
		cache.sic("CommandsEnabled","{'me':true,'_catch_':true,'attack':true,'roulette':true}");

		if(cache.get('league') == "")
		{
		var syntax = {
		"Champion":"",
		"gym":{},
		"elite":{}
		};
		cache.sic("league",JSON.stringify(syntax));
		}

		if(cache.get('pointercommands') == '')
		{
		var NewUsePC = {
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
		"icon": "icons",
		"rankicons": "icons",
		"rankiconinfo": "iconinfo",
		"rankinfo": "iconinfo",
		"loadicon": "loadicons",
		"rankiconcommands": "iconcommands",
				
		"style": "mainstyle",
		
		"sendhtmlall": "html",
		"send": "sendall",
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
		"voiceoff": "unvoice"
		};

		cache.sic("pointercommands",JSON.stringify(NewUsePC));
		}

		ChanUser=cache.get("ChanLevel0Name")
		ChanMod=cache.get("ChanLevel1Name");
		ChanAdmin=cache.get("ChanLevel2Name")
		ChanOwner=cache.get("ChanLevel3Name")
		UserName=cache.get("AuthLevel0Name")
		ModName=cache.get("AuthLevel1Name")
		AdminName=cache.get("AuthLevel2Name")
		OwnerName=cache.get("AuthLevel3Name")
		InvisName=cache.get("AuthLevel4Name")
		Tour0 = cache.get("TourLevel0Name");
		Tour1 = cache.get("TourLevel1Name");
		ChanTour0 = cache.get("ChanTour0Name");
		ChanTour1 = cache.get("ChanTour1Name");

		allowedit=cache.get("allowedit");
		allowicon=cache.get("allowicon");
		implock=cache.get("implock");
		evallock=cache.get("evallock");
		motd=cache.get("motd");
		AutoStartTours = cache.get("AutoStartTours");

		MaxMessageLength=cache.get("MaxMessageLength");
		maxPlayersOnline=cache.get("MaxPlayersOnline");
		display = cache.get('TourDisplay');
		FutureLimit = cache.get("FutureLimit");

		if(cache.sics > 0) {
		cache.savec();
		}

		/*
		if(ForumDB.get('settings') == '') {
		var time = String(new Date());
		var dbsettings = {
		"Enabled": true,
		"DisableMSG": "",
		"CreateDate": time,

		"CharacterLimit": {
		"Member": 20,
		"ThreadTitle": 50,
		"ThreadText": 500,
		"ReplyTitle": 30,
		"ReplyText": 250
		},

		"Authority": {}
		};

		ForumDB.sic("settings", JSON.stringify(dbsettings));
		}

		if(typeof Forum == 'undefined')
		run("forumload");

		Forum.Settings = JSON.parse(ForumDB.get("settings"));

		if(ForumDB.get('members') == '') {
		ForumDB.sic("members", "{}");
		var joins = authByLevel(), x, j;
		for(x in joins) {
		j = joins[x];
		Forum.join(x, j);
		}
		}
		Forum.Members = JSON.parse(ForumDB.get("members"));

		if(ForumDB.get('categories') == '') {
		ForumDB.sic("categories", "{}");
		}
		Forum.Categories = JSON.parse(ForumDB.get("categories"));

		if(ForumDB.get('forums') == '') {
		ForumDB.sic("forums", "{}");
		}
		Forum.Forums = JSON.parse(ForumDB.get("forums"));

		if(ForumDB.get('thread') == '') {
		ForumDB.sic("thread", "{}");
		}
		Forum.Threads = JSON.parse(ForumDB.get("thread"));

		if(ForumDB.get('posts') == '') {
		ForumDB.sic("posts", "{}");
		}
		Forum.Posts = JSON.parse(ForumDB.get("posts"));

		if(ForumDB.sics > 0) {
		ForumDB.savec();
		}
		*/

		}
		,

		forumload : function () {
		return; // causes additional load and is incomplete so far.

		POForum = function () {
		this.Version = 1.0;
		}

		/***********************************\
		*         Functions               *
		* - Joining                       *
		* - Creating                      *
		\***********************************/

		POForum.prototype.join = function(name, auth) {
		if(name.length > this.Settings.CharacterLimit.Member)
		return 0;
		var ret = 1;
		if(typeof this.Members == 'undefined')
		this.Members = {};

		if(auth != undefined && auth != 0) {
		var id = objLength(this.Members)+1;
		var hash = {"name": name, "id": id, "auth": auth, "banned": false};
		this.Members[name.toLowerCase()] = hash;
		delete hash.banned;
		this.Settings.Authority[name.toLowerCase()] = hash;
		// ForumDB.write("settings", JSON.stringify(this.Settings));
		this.updateDB("settings");
		ret = 2;
		}

		else {
		var id = objLength(this.Members)+1;
		var hash = {"name": name, "id": id, "auth": 0, "banned": false};
		this.Members[name.toLowerCase()] = hash;
		}
		// ForumDB.write("members", JSON.stringify(this.Members));
		this.updateDB("members");
		return ret;
		}
		/* Codes:
		0: Failed, name too long.
		1: Created without Auth.
		2: Created with Auth.
		*/

		POForum.prototype.makeCategory = function(by, name, desc) {
		if(arguments.length == 2) {
		var desc = name;
		name = by;
		}
		else {
		if(typeof this.Members[by.toLowerCase()] == 'undefined')
		return 0;
		if(this.Members[by.toLowerCase()].auth < 3)
		return 1;
		}
		if(desc == undefined)
		desc = "";

		var id = objLength(this.Categories)+1;
		var hash = {'name': name, 'description': desc}
		this.Categories[id] = hash;
		// ForumDB.write("categories", JSON.stringify(this.Categories));
		this.updateDB("categories");
		return 2;
		}
		/* Codes:
		0: Failed, no such member.
		1: Failed, auth is too low (weird...)
		2: Success.
		*/


		POForum.prototype.makeForum = function(category, by, name, desc) {
		if(arguments.length == 3) {
		var desc = name;
		name = by;
		}
		else {
		if(typeof this.Members[by.toLowerCase()] == 'undefined')
		return 0;
		if(this.Members[by.toLowerCase()].auth < 2)
		return 1;
		}
		if(typeof this.Categories[category] == 'undefined')
		return 2;
		if(desc == undefined)
		desc = "";

		var id = objLength(this.Forums)+1;
		var hash = {'categoryid': category, 'name': name, 'description': desc}
		this.Forums[id] = hash;
		// ForumDB.write("forums", JSON.stringify(this.Forums));
		this.updateDB("forums");
		return 3;
		}
		/* Codes:
		0: Failed, no such member.
		1: Failed, auth is too low (weird...)
		2: Failed, no such category.
		3: Success.
		*/

		POForum.prototype.postThread = function(by, forum, title, text) {
		if(typeof this.Members[by.toLowerCase()] == 'undefined')
		return 0;
		var bid = this.Members[by.toLowerCase()].id;
		if(forum == undefined)
		return 1;

		if(title == undefined)
		return 2;

		if(title.length > this.Settings.CharacterLimit.ThreadTitle)
		return 3;

		if(text == undefined)
		return 4;

		if(text.length > this.Settings.CharacterLimit.ThreadText)
		return 5;

		var id = objLength(this.Threads)+1;
		var hash = {'forumid': forum, 'title': title, 'text': text, 'byid': bid}
		this.Threads[id] = hash;
		// ForumDB.write("threads", JSON.stringify(this.Threads));
		this.updateDB("threads");
		return 6;
		}
		/* Codes:
		0: Failed, no such member.
		1: Failed, no such forum.
		2: Failed, no title.
		3: Failed, title too long.
		4: Failed, no text.
		5: Failed, text has too much characters.
		6: Success.
		*/

		POForum.prototype.postReply = function(by, thread, title, text) {
		if(typeof this.Members[by.toLowerCase()] == 'undefined')
		return 0;
		var bid = this.Members[by.toLowerCase()].id;
		if(thread == undefined)
		return 1;

		if(typeof this.Threads[thread] == undefined)
		return 2;

		if(title == undefined)
		title = "RE: "+this.Threads[thread].title;

		if(title.length > this.Settings.CharacterLimit.ReplyTitle)
		return 3;

		if(text == undefined)
		return 4;

		if(text.length > this.Settings.CharacterLimit.ReplyText)
		return 5;

		var id = objLength(this.Posts)+1;
		var hash = {'threadid': thread, 'title': title, 'text': text, 'byid': bid}
		this.Posts[id] = hash;
		// ForumDB.write("posts", JSON.stringify(this.Posts));
		this.updateDB("posts");
		return 6;
		}
		/* Codes:
		0: Failed, no such member.
		1: Failed, no such thread.
		3: Failed, title too long.
		4: Failed, no text.
		5: Failed, text has too much characters.
		6: Success.
		*/

		/***********************************\
		*         Functions               *
		* - Renaming                      *
		* - Banning                       *
		* - Authing                       *
		* - Deleting                      *
		\***********************************/

		POForum.prototype.renameMember = function(name, newname) {
		name = name.toLowerCase();
		if(typeof this.Members[name] == 'undefined')
		return 0;
		if(name == newname)
		return 1;
		var nntl = newname.toLowerCase();
		var prephash = this.Members[name];
		prephash.name = newname;
		delete this.Members[name];
		if(prephash.auth > 0) {
		delete this.Settings.Authority[name];
		this.Settings.Authority[nntl] = prephash;
		ForumDB.write("settings", JSON.stringify(this.Settings));
		}
		this.Members[nntl] = prephash;
		// ForumDB.write("members", JSON.stringify(this.Members));
		this.updateDB("members");
		return 2;
		}
		/* Codes:
		0: Failed, no such member.
		1: Failed, name is the same.
		2: Success.
		*/

		POForum.prototype.renameCategory = function(id, newname, desc) {
		if(typeof this.Categories[id] == 'undefined')
		return 0;
		var name = this.Categories[id].name;
		if(name == newname)
		return 1;
		var prephash = this.Categories[id];
		prephash.name = newname;
		if(!isEmpty(desc))
		prephash.description = desc;
		this.Categories[id] = prephash;
		// ForumDB.write("categories", JSON.stringify(this.Categories));
		this.updateDB("categories");
		return 2;
		}
		/* Codes:
		0: Failed, no such category.
		1: Failed, name is the same.
		2: Success.
		*/

		POForum.prototype.renameForum = function(id, newname, desc) {
		if(typeof this.Forums[id] == 'undefined')
		return 0;
		var name = this.Forums[id].name;
		if(name == newname)
		return 1;
		var prephash = this.Forums[id];
		prephash.name = newname;
		if(!isEmpty(desc))
		prephash.description = desc;
		this.Forums[id] = prephash;
		// ForumDB.write("forums", JSON.stringify(this.Forums));
		this.updateDB("forums");
		return 2;
		}
		/* Codes:
		0: Failed, no such forum.
		1: Failed, name is the same.
		2: Success.
		*/

		POForum.prototype.editThread = function(id, newname, text) {
		if(typeof this.Threads[id] == 'undefined')
		return 0;
		var oldtext = this.Threads[id].text;
		var oldtitle = this.Threads[id].title;
		if(newname.length > this.Settings.CharacterLimit.ThreadTitle)
		return 1;
		if(text == undefined && newname == undefined)
		return 2;
		if(text.length > this.Settings.CharacterLimit.ThreadText)
		return 4;
		if(oldtext == text && oldtitle == newname)
		return 3;
		var prephash = this.Threads[id];
		prephash.text = text;
		if(!isEmpty(newname))
		prephash.title = newname;
		this.Threads[id] = prephash;
		// ForumDB.write("threads", JSON.stringify(this.Threads));
		this.updateDB("threads");
		return 5;
		}
		/* Codes:
		0: Failed, no such thread.
		1: Failed, new title is too long.
		2: Failed, no new text or title.
		3: Failed, text and title are the same.
		4: Failed, text is too long.
		5: Success.
		*/

		POForum.prototype.editPost = function(id, newname, text) {
		if(typeof this.Posts[id] == 'undefined')
		return 0;
		var oldtext = this.Posts[id].text;
		var oldtitle = this.Posts[id].title;
		if(newname.length > this.Settings.CharacterLimit.ThreadTitle)
		return 1;
		if(text == undefined && newname == undefined)
		return 2;
		if(text.length > this.Settings.CharacterLimit.ThreadText)
		return 4;
		if(oldtext == text && oldtitle == newname)
		return 3;
		var prephash = this.Posts[id];
		prephash.text = text;
		if(!isEmpty(newname))
		prephash.title = newname;
		this.Posts[id] = prephash;
		// ForumDB.write("posts", JSON.stringify(this.Posts));
		this.updateDB("posts");
		return 5;
		}
		/* Codes:
		0: Failed, no such post.
		1: Failed, new title is too long.
		2: Failed, no new text or title.
		3: Failed, text and title are the same.
		4: Failed, text is too long.
		5: Success.
		*/

		POForum.prototype.ban = function(by, to) {
		to = to.toLowerCase();
		by = by.toLowerCase()
		if(typeof this.Members[to] == 'undefined')
		return 0;
		if(typeof this.Members[by] == 'undefined')
		return 1;
		if(this.Members[by].auth < 2)
		return 2;
		if(to == by)
		return 3;
		var trgthash = this.Members[to];
		if(trgthash.auth > 0)
		return 4;
		this.Members[to].banned = true;
		// ForumDB.write("members", JSON.stringify(this.Members));
		this.updateDB("members");
		return 5;
		}
		/* Codes:
		0: Failed, no such member.
		1: Failed, no such banner.
		2: Failed, banner's auth is too low.
		3: Failed, cannot ban self.
		4: Failed, cannot ban auth.
		5: Success.
		*/

		POForum.prototype.deleteMember = function(name) {
		var ntl = name.toLowerCase();
		var pt = this.tpForMember(ntl), t = pt.threads, p = pt.posts, tl = t.length, pl = p.length;
		var u, tpTD = false, id, tPOSTu, tPOSTl, tPOSTd = false;
		if(tl > 0) {
		for(u in t) {
		id = t[u];
		tPOST = this.postsForThread(id);
		tPOSTl = objLength(tPOST);
		if(tPOSTl > 0) {
		for(tPOSTu in tPOST) {
		delete this.Posts[tPOSTu];
		}
		tPOSTd = true;
		}

		delete this.Threads[u];
		thTD = true;
		}
		}

		if(pl > 0) {
		for(u in p) {
		delete this.Posts[u];
		tPOSTd = true;
		}
		}

		delete this.Members[ntl];
		this.updateDB("members");
		//ForumDB.write("members", JSON.stringify(this.Members));
		if(tPOSTd)
		this.updateDB("posts");
		//ForumDB.write("posts", JSON.stringify(this.Posts));
		if(tpTD)
		this.updateDB("threads");
		//ForumDB.write("threads", JSON.stringify(this.Threads));
		}


		/***********************************\
		*         Functions               *
		* - Display                       *
		\***********************************/

		POForum.prototype.banlist = function (mode) {
		var mem = this.Members, x, arr = [];
		if(mode == undefined || mode == 0) {
		for(x in mem){
		if(mem[x].banned) {
		arr.push(x);
		}
		}
		}
		else if(mode == 1) {
		for(x in mem){
		if(mem[x].banned) {
		arr.push(mem[x].name);
		}
		}
		}
		else if(mode == 2) {
		for(x in mem){
		if(mem[x].banned) {
		arr.push(mem[x].id);
		}
		}
		}
		return arr;
		}
		/* Modes:
		0: Return an array of lowercase names.
		1: Return an array of correct names.
		2: Return an array of ids.
		*/

		POForum.prototype.authlist = function (mode) {
		var mem = this.Settings.Authority, x, arr = [];
		if(mode == undefined || mode == 0) {
		for(x in mem){
		arr.push(x);
		}
		}
		else if(mode == 1) {
		for(x in mem){
		arr.push(mem[x].name);
		}
		}
		else if(mode == 2) {
		for(x in mem){
		arr.push(mem[x].id);
		}
		}
		return arr;
		}
		/* Modes:
		0: Return an array of lowercase names.
		1: Return an array of correct names.
		2: Return an array of ids.
		*/

		POForum.prototype.memberlist = function (mode) {
		var mem = this.Members, x, arr = [];
		if(mode == undefined || mode == 0) {
		for(x in mem){
		if(!mem[x].banned && !mem[x].auth)
		arr.push(x);
		}
		}
		else if(mode == 1) {
		for(x in mem){
		if(!mem[x].banned && !mem[x].auth)
		arr.push(mem[x].name);
		}
		}
		else if(mode == 2) {
		for(x in mem){
		if(!mem[x].banned && !mem[x].auth)
		arr.push(mem[x].id);
		}
		}
		return arr;
		}
		/* Modes:
		0: Return an array of lowercase names.
		1: Return an array of correct names.
		2: Return an array of ids.
		*/

		POForum.prototype.forumsForCategory = function (cid) {
		var x, h = {}, f = this.Forums, u;
		for(x in f) {
		u = f[x];
		if(f[x].categoryid == cid)
		h[x] = u;
		}
		return h;
		}

		POForum.prototype.threadsForForum = function (fid) {
		var x, h = {}, t = this.Threads, u;
		for(x in t) {
		u = t[x];
		if(t[x].forumid == fid)
		h[x] = u;
		}
		return h;
		}

		POForum.prototype.postsForThread = function (tid) {
		var x, h = {}, p = this.Posts, u;
		for(x in p) {
		u = p[x];
		if(p[x].threadid == tid)
		h[x] = u;
		}
		return h;
		}

		POForum.prototype.lastPostForThread = function (tid) {
		var pft = this.postsForThread(tid), u = objLength(pft), y, c=0;
		for(y in pft) {
		if(u != c) {
		c++;
		continue;
		}
		return pft[y];
		}
		}

		POForum.prototype.tpForMember = function(name) {
		var ntl = name.toLowerCase();
		if(typeof this.Members[ntl] == 'undefined')
		return 0;
		var nid = this.Members[ntl].id;
		var rh = {'threads': [], 'posts': []};
		var t = this.Threads, p = this.Posts, y, u, n;
		for(y in t) {
		n = t[y].byid;
		if(n == nid)
		rh.threads.push(n);
		}
		for(y in p) {
		n = p[y].byid;
		if(n == nid)
		rh.posts.push(n);
		}
		return rh;
		}

		/* Codes:
		0: No such member.
		*/

		POForum.prototype.threadPreview = function(tid) {
		if(typeof this.Threads[tid] == 'undefined')
		return 0;
		var txt = html_escape_strip(this.Threads[tid].text), add = '';
		if(txt.length > 20)
		add = '...';
		return txt.splice(0, 20)+add;
		}
		/* Codes:
		0: No such thread
		*/

		POForum.prototype.showHome = function (src) {
		if(sys.name(src) == undefined)
		return 0;
		var c = this.Categories, ffc, y, x, tff, CU, CUX;
		var mt = objLength(this.Members), pt = objLength(this.Posts), tt = objLength(this.Threads);

		var display = "<table border='1' width='100%'> <tr><td>"
		+ "<h1> "+servername+" Forums</h1><br/>"
		+ "<td><h2>Statistics</h2><b>Members Total: "+mt+"</b> |"
		+ "<b>Thread Total: "+tt+"</b> |"
		+ "<b>Posts Total "+pt+"</b></td></tr>";

		for(y in c) {
		x = tff[y];
		ffc = this.forumsForCategory(y);
		display += "<tr><td>"+x.name+"<br/>"+x.description+"</tr></td>";
		for(CU in ffc) {
		CUX = fcc[CU];
		tff = objLength(this.threadsForForum(CU));
		display += "<tr><td>"+CUX.name+" (Forum ID: "+y+")<br/>"
		+ CUX.description+"<br/>"
		+ "Threads: "+tff+"<br/>"
		+ "Use GO "+CU+" to view this thread.";
		}
		}

		sys.sendHtmlMessage(src, display, forum);
		}

		/* Codes:
		0: No such user.
		*/

		POForum.prototype.showForum = function (src, fid) {
		if(sys.name(src) == undefined)
		return 0;
		if(typeof this.Forums[fid] == 'undefined')
		return 1;
		var f = this.Forums[fid], tff = this.threadsForForum(fid), ppp, y, x, pft, lpft;
		var mt = objLength(this.Members), pt = objLength(this.Posts), tt = objLength(this.Threads);

		var display = "<table border='1' width='100%'> <tr><td>"
		+ "<h1> "+servername+" Forums</h1><br/>"
		+ "<td><b>Home</b> <small>(use: BACK)</small></td>"
		+ "<td><h2>Statistics</h2><b>Members Total: "+mt+"</b> |"
		+ "<b>Thread Total: "+tt+"</b> |"
		+ "<b>Posts Total "+pt+"</b></td>"
		+ "<td><h2>Index: "+f.name+"</h2> <small>(Forum ID: "+fid+")</small><br/>"
		+ f.discription+"</td></tr>";
		for(y in tff) {
		x = tff[y];
		pft = objLength(this.postsForThread(y));
		ppp = this.threadPreview(y);
		lpft = this.lastPostForThread(y);
		display += "<tr><td>"+x.title+" by "+this.Members[x.byid].name+": (Thread ID: "+y+")<br/>"
		+ "Preview: "+ppp+" <br/>Posts: "+pft+"<br/>Last Post: "+lpft.title+" by "
		+ lpft.name+"<br/>Use READ "+y+" to view this thread.";
		}

		sys.sendHtmlMessage(src, display, forum);
		}

		/* Codes:
		0: No such user.
		1: No such forum.
		*/

		POForum.prototype.showThread = function (src, tid) {
		if(sys.name(src) == undefined)
		return 0;
		if(typeof this.Threads[tid] == 'undefined')
		return 1;
		var p = this.postsForThread(tid), x, y, t = this.Threads[tid];
		var mt = objLength(this.Members), pt = objLength(this.Posts), tt = objLength(this.Threads);

		var display = "<table border='1' width='100%'> <tr><td>"
		+ "<h1> "+servername+" Forums</h1><br/>"
		+ "<td><b>Home</b> <small>(use: BACK twice)</small></td>"
		+ "<td><h2>Statistics</h2><b>Members Total: "+mt+"</b> |"
		+ "<b>Thread Total: "+tt+"</b> |"
		+ "<b>Posts Total "+pt+"</b></td>"
		+ "<td><h2>Thread: "+t.title+" by "+f.name+"</h2> <small>(Thread ID: "+tid+")</small><br/>"
		+ "<br/>Message:<br/>"+t.text+"</td></tr>";
		for(y in p) {
		x = p[y];
		display += "<tr><td>"+x.title+" by "+this.Members[x.byid].name+": (Post ID: "+y+")<br/>"
		+ "<br/>Message:<br/>"+t.text+"</td></tr>";
		}

		sys.sendHtmlMessage(src, display, forum);
		}

		/* Codes:
		0: No such user.
		1: No such forum.
		*/

		/***********************************\
		*         Functions               *
		* - Updates                       *
		* - DB Updates                    *
		\***********************************/

		POForum.prototype.updateForum = function (newVersion) {
		script.forumload();
		// botAll("The Forum has updated to version "+newVersion+"!", forum);
		}

		POForum.prototype.addDB = function (newName, newValue, matching) {
		if(matching == undefined || matching == 0 || matching >= 8) {
		var c = ForumDB.hash, x, y, n;
		for(x in y) {
		n = JSON.parse(y[x]);
		n[newName] = newValue;
		this[x[0].toUpperCase()+x.splice(0)] = n;
		// ForumDB.write(x, JSON.stringify(n));
		this.updateDB(x);
		}
		}
		else if(matching == 1) {
		var auth = this.Settings.Authority, x, mem = this.Members;
		for(x in auth) {
		auth[x][newName] = newValue;
		mem[x][newName] = newValue;
		}
		// ForumDB.write("settings", JSON.stringify(this.Settings));
		this.updateDB("settings");
		// ForumDB.write("members", JSON.stringify(mem));
		this.updateDB("members");
		}
		else if(matching == 2) {
		var mem = this.Members, x;
		for(x in mem) {
		if(mem[x].banned == true) {
		mem[x][newName] = newValue;
		}
		}
		// ForumDB.write("members", JSON.stringify(mem));
		this.updateDB("members");
		}
		else if(matching == 3) {
		var mem = this.Members, x;
		for(x in mem) {
		if(mem[x].banned == false && mem[x].auth == 0) {
		mem[x][newName] = newValue;
		}
		}
		// ForumDB.write("members", JSON.stringify(mem));
		this.updateDB("members");
		}
		else if(matching == 4) {
		var cat = this.Categories, x;
		for(x in cat) {
		cat[x][newName] = newValue;
		}
		// ForumDB.write("categories", JSON.stringify(cat));
		this.updateDB("categories");
		}
		else if(matching == 5) {
		var fo = this.Forums, x;
		for(x in fo) {
		fo[x][newName] = newValue;
		}
		// ForumDB.write("forums", JSON.stringify(fo));
		this.updateDB("forums");
		}
		else if(matching == 6) {
		var th = this.Threads, x;
		for(x in th) {
		th[x][newName] = newValue;
		}
		// ForumDB.write("threads", JSON.stringify(th));
		this.updateDB("threads");
		}
		else if(matching == 7) {
		var po = this.Posts, x;
		for(x in po) {
		po[x][newName] = newValue;
		}
		// ForumDB.write("posts", JSON.stringify(po));
		this.updateDB("posts");
		}
		}

		POForum.prototype.delDB = function (name, matching) {
		if(matching == undefined || matching == 0 || matching >= 8) {
		var c = ForumDB.hash, x, y, n;
		for(x in y) {
		n = JSON.parse(y[x]);
		delete n[name];
		this[x[0].toUpperCase()+x.splice(0, 1)] = n;
		// ForumDB.write(x, JSON.stringify(n));
		this.updateDB(x);
		}
		}
		else if(matching == 1) {
		var auth = this.Settings.Authority, x, mem = this.Members;
		for(x in auth) {
		delete auth[x][name];
		delete mem[x][name];
		}
		// ForumDB.write("settings", JSON.stringify(this.Settings));
		// ForumDB.write("members", JSON.stringify(mem));
		this.updateDB("members");
		this.updateDB("settings");
		}
		else if(matching == 2) {
		var mem = this.Members, x;
		for(x in mem) {
		if(mem[x].banned == true) {
		delete mem[x][name];
		}
		}
		// ForumDB.write("members", JSON.stringify(mem));
		this.updateDB("members");
		}
		else if(matching == 3) {
		var mem = this.Members, x;
		for(x in mem) {
		if(mem[x].banned == false && mem[x].auth == 0) {
		delete mem[x][name];
		}
		}
		// ForumDB.write("members", JSON.stringify(mem));
		this.updateDB("members");
		}
		else if(matching == 4) {
		var cat = this.Categories, x;
		for(x in cat) {
		delete cat[x][name];
		}
		// ForumDB.write("categories", JSON.stringify(cat));
		this.updateDB("categories");
		}
		else if(matching == 5) {
		var fo = this.Forums, x;
		for(x in fo) {
		delete fo[x][name];
		}
		// ForumDB.write("forums", JSON.stringify(fo));
		this.updateDB("forums");
		}
		else if(matching == 6) {
		var th = this.Threads, x;
		for(x in th) {
		delete th[x][name];
		}
		// ForumDB.write("threads", JSON.stringify(th));
		this.updateDB("threads");
		}
		else if(matching == 7) {
		var po = this.Posts, x;
		for(x in po) {
		delete po[x][name];
		}
		// ForumDB.write("posts", JSON.stringify(po));
		this.updateDB("posts");
		}
		}

		/*
		Matching Codes:
		0: All
		1: Only Auth.
		2: Only Banned.
		3: Only Members.
		4: Only Categories.
		5: Only Forums.
		6: Only Threads.
		7: Only Posts.
		*/

		POForum.prototype.updateDB = function (type, hash, data) {
		var types = ForumDB, u, typearray = [], lctypes = [], lt = type.toLowerCase();
		for(u in types) {
		typearray.push(u[0].toUpperCase+u.substr(0,1));
		lctypes.push(u);
		}
		if(lctypes.indexOf(lt) == -1)
		return 0;
		var z = type[1].toUpperCase()+lt;
		if(hash || data == undefined)
		ForumDB.write(lt, JSON.stringify(this[z]));
		else
		ForumDB.write(lt, data);
		return 1;
		}

		/* Codes:
		0: No such DB type.
		1: Success
		*/

		/***********************************\
		*         Functions               *
		* - Command Handling              *
		\***********************************/
		POForum.prototype.CMDExecuteHelper = function () {}
		POForum.prototype.CMDExecuteHelper.prototype = {
		/*** Helpers ***/
		memberExist: function (lcn) {
		var lcn = lcn.toLowerCase();
		return typeof Forum.Members[lcn] != 'undefined';
		},
		categoryExist: function (cid) {
		return typeof Forum.Category[cid] != 'undefined';
		},
		forumExist: function (fid) {
		return typeof Forum.Forums[fid] != 'undefined';
		},
		threadExist: function (tid) {
		return typeof Forum.Threads[tid] != 'undefined';
		},
		postExist: function (pid) {
		return typeof Forum.Posts[pid] != 'undefined';
		},
		errorCatcher: function (cmd, errorno) {
		errorCodes = {
		0: 'No such member',
		1: 'No such category',
		2: 'No such forum',
		3: 'No such thread',
		4: 'No such post'
		}
		if(typeof this[cmd] == 'undefined')
		return 'POForum.CMDExecuteHelper.errorCatcher could not execute specified command '+cmd+'.';
		
		return errorCodes[errorno];
		},
		
		/*** Commands ***/
		go: function (src, data) {
		var fd = Number(data);
		var forumex = this.forumExist(fd);
		if(!forumex)
		return 2;
		this.showForum(src, fd);
		},
		read: function (src, data) {
		var td = Number(data);
		var tex = this.threadExist(td);
		if(!tex)
		return 3;
		this.showThread(src, td);
		},
		}

		POForum.prototype.sendCMD = function (user, message) {
		var mp = message.split(" ");
		var mps = cut(mp, 1, '');
		var utl = user.toLowerCase();
		var mpotl = mp[0].toLowerCase();

		var commands = { 
		"go": -1, // go to forum (ex: GO forumid)
		"read": -1, // read thread (ex: READ threadid)
		"back": -1, // if in thread => previous forum | else => index. (ex: BACK)
		"join": -1, // join forum. (ex: JOIN)
		"mkcategory": 3, // make a category (owner +) (ex: MKCATEGORY xxx%%%xxx)
		"mkforum": 2, // make a forum (admin +) (ex: MKFORUM xxx%%%xxx)
		"postthread": 0, // post a thread (ex: POSTTHREAD xxx%%%xxx)
		"postreply": 0, // reply to a thread (ex: POSTREPLY xxx%%%xxx)
		"delcategory": 3, // delete category (owner+) (ex: DELCATEGORY id)
		"delforum": 2, // delete forum (admin +) (ex: DELFORUM id)
		"delpost": 1, // delete post (mod +) (ex: DELPOST id)
		"delthread": 1, // delete thread (mod +) (ex: DELTHREAD id)
		"delownpost": 0, // delete own post (ex: DELOWNPOST POSTID)
		"delownthread": 0, // delete own thread (ex: DELOWNTHREAD THREADID)
		"ban": 2, // ban user (and ip). (ex: BAN userID/userNAME)
		"unban": 2, // undo. (ex: UNBAN id/name)
		"deluser": 3 // delete user (ex: DELUSER userid/username)
		}

		if(!mp[0].toLowerCase() in commands)
		return ["unknown", message, user];

		if(typeof this.Members[utl] == 'undefined' && commands[mpotl] > -1)
		return ["auth_too_low", message, user];

		if(this.Members[utl].auth < commands[mpotl])
		return ["auth_too_low", message, user];

		return [mp[0], mps, mp];
		}

		POForum.prototype.handleCMD = function(src, cmd) {
		var res = cmd[0].toLowerCase();
		if(res == "unknown")
		return 0;
		else if(res == "auth_too_low")
		return 1;
		var errorCode = this.CMDExecuteHelper[res](src, cmd);
		if(errorCode != undefined) {
		return this.CMDExecuteHelper.errorCatcher(res);
		}
		return catchErr;
		}
		/* Codes:
		0: Unknown CMD.
		1: Auth too low for CMD.
		2: Success.
		String: ERROR
		*/

		Forum = new POForum();
		}
		,

		channelload : function () {
		Channels = new (function() {

		this.numChannels = function () {
		return sys.channelIds().length;
		}

		this.createChannel = function (channelList) {
		for (var i = 0; i < channelList.length; ++i) {
		sys.createChannel(channelList[i]);
		}
		}

		this.channelId = function(channelList) {
		var arr = []
		for (var i = 0; i < channelList.length; ++i) {
		arr.push(sys.channelId(channelList[i]));
		}
		return arr;
		}

		this.putInChannel = function (idList, channel) {
		for (var i = 0; i < idList.length; ++i) {
		for(var h = 0; h < channel.length; h++) {
		sys.putInChannel(idList[i], channel[h]);
		}
		}
		}

		})();

		createFile("ChannelData","json","{}");

		initChannelData = function() {
		if(typeof(channelData) == "undefined") {
		channelData = {};
		if(sys.getFileContent("ChannelData.json") != "") {
		try {
		channelData = JSON.parse(sys.getFileContent("ChannelData.json"));
		}
		catch(e) {
		channelData = {};
		print(FormatError("Could not load ChannelData.json", e));
		}
		}
		}
		}

		initChannelData();

		loadChannelData = function(chan) {
		if(chan == undefined || sys.channel(chan) == undefined) {
		var c = sys.channelIds(), x;
		for(x in c) {
		if(JSESSION.channels(c[x]) == undefined) {
		continue;
		}

		if(typeof channelData[sys.channel(c[x])] == "undefined") {
		updateChannelData(c[x]);
		continue;
		}

		try {
		var cData = channelData[sys.channel(c[x])];
		var POChan = JSESSION.channels(c[x]);
		POChan.chanAuth = cData.chanAuth;
		POChan.creator = cData.creator;
		POChan.topic = cData.topic;
		POChan.topicsetter = cData.topicsetter;
		POChan.perm = cData.perm;
		POChan.banlist = cData.banlist;
		POChan.mutelist = cData.mutelist;
		POChan.private = cData.private;
		POChan.defaultTopic = cData.defaultTopic;
		POChan.silence = cData.silence;
		if(cData.toursEnabled == undefined) {
		cData.toursEnabled = false;
		}

		if(cData.tourAuth == undefined) {
		cData.tourAuth = {};
		}

		POChan.tourAuth = cData.tourAuth;
		if(cData.toursEnabled&&POChan.tour == undefined)
		POChan.tour = new Tours(c[x]);
		}
		
		catch(e) {}
		}
		saveChannelData();
		return;
		}
		if(JSESSION.channels(chan) == undefined) {
		return;
		}

		if(typeof channelData[chan] == 'undefined') {
		updateChannelData(chan);
		return;
		}
		try {
		var cData = channelData[sys.channel(chan)];
		var POChan = JSESSION.channels(chan);
		POChan.chanAuth = cData.chanAuth;
		POChan.creator = cData.creator;
		POChan.topic = cData.topic;
		POChan.topicsetter = cData.topicsetter;
		POChan.perm = cData.perm;
		POChan.banlist = cData.banlist;
		POChan.mutelist = cData.mutelist;
		POChan.private = cData.private;
		POChan.defaultTopic = cData.defaultTopic;
		POChan.silence = cData.silence;
		if(cData.toursEnabled == undefined) {
		cData.toursEnabled = false;
		}

		if(cData.tourAuth == undefined) {
		cData.tourAuth = {};
		}

		POChan.tourAuth = cData.tourAuth;
		if(cData.toursEnabled&&POChan.tour == undefined)
		POChan.tour = new Tours(chan);
		}
		catch(e) {}
		saveChannelData();
		}

		createChannelData = function () {
		var f = channelData, d;
		for(d in f) {
		try {
		if(f[d].perm == true) {
		if(!sys.existChannel(f[d].name)) {
		sys.createChannel(f[d].name);
		}
		}
		}
		catch(e) {}
		}
		}


		updateChannelData = function(chan) {
		if(chan == undefined || sys.channel(chan) == undefined) {
		var x;
		var c = sys.channelIds();
		try {
		for(x in c) {
		var cData = channelData[sys.channel(c[x])];
		cData = {};
		var y = JSESSION.channels(c[x]);
		cData.chanAuth = y.chanAuth;
		if(y.tourAuth == undefined)
		y.tourAuth = {};
		if(y.toursEnabled == undefined)
		y.toursEnabled = false;
		cData.tourAuth = y.tourAuth;
		cData.creator = y.creator;
		cData.topic = y.topic;
		cData.topicsetter = y.topicsetter;
		cData.perm = y.perm;
		cData.banlist = y.banlist;
		cData.mutelist = y.mutelist;
		cData.private = y.private;
		cData.defaultTopic = y.defaultTopic;
		cData.silence = y.silence;
		cData.toursEnabled = y.toursEnabled;
		}
		}
		catch(e) {}
		return;
		}
		if(JSESSION.channels(chan) == undefined)
		JSESSION.createChannel(chan);
		var cData = channelData[sys.channel(chan)];
		cData = {};
		var y = JSESSION.channels(chan);
		cData.chanAuth = y.chanAuth;
		if(y.tourAuth == undefined)
		y.tourAuth = {};
		if(y.toursEnabled == undefined)
		y.toursEnabled = false;
		cData.tourAuth = y.tourAuth;
		cData.creator = y.creator;
		cData.topic = y.topic;
		cData.topicsetter = y.topicsetter;
		cData.perm = y.perm;
		cData.banlist = y.banlist;
		cData.mutelist = y.mutelist;
		cData.private = y.private;
		cData.defaultTopic = y.defaultTopic;
		cData.silence = y.silence;
		cData.toursEnabled = y.toursEnabled;
		saveChannelData();
		}

		saveChannelData = function() {
		sys.writeToFile("ChannelData.json",JSON.stringify(channelData));
		}
		}
		,

		otherload: function () {
		if(typeof fonts == 'undefined') {
		// Windows 7 Fonts //
		// Note: Some fonts MIGHT not work/look too much like default font
		// so they won't be noticed.
		
		fonts = ["Aharoni", "Andalus", "Angsana New", "AngsanaUPC", 
		"Aparajita", "Arabic Typesetting", "Arial", "Arial Unicode MS",
		"Batang", "BatangChe", "Blackadder ITC", "Book Antiqua",
		"Bookman Old Style", "Bookshelf Symbol 7", "Bradley Hand ITC",
		"Browallia New", "BrowalliaUPC", "Calibri", "Cambria",
		"Cambria Math", "Candara", "Century Gothic", "Century",
		"Comic Sans MS", "Consolas", "Constantia", "Copperplate Gothic",
		"Corbel", "Cordia New", "CordiaUPC", "Courier New", "Courier", 
		"Curlz MT", "DaunPenh", "David", "DFKai-SB", "DilleniaUPC", 
		"DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC",
		"Engravers MT", "Eras ITC", "Estrangelo Edessa", "EucrosiaUPC",
		"Euphemia", "Eurostile", "FangSong", "Felix Titling", "Fixedsys",
		"Franklin Gothic", "Franklin Gothic Book", "FrankReuhl", "FreesiaUPC",
		"Freestyle Script", "French Script MT", "Gabriolia", "Garamond",
		"Gautami", "Georgia", "Gisha", "Gulim", "GulimChe", "Gungsuh",
		"GungsuhChe", "Impact", "IrisUPC", "Iskoola Pota", "JasmineUPC",
		"Jokerman", "Juice ITC", "KaiTI", "Kalinga", "Kartika",
		"Khmer UI", "KodchiangUPC", "Kokila", "Kristen ITC", "Lao UI",
		"Latha", "Leelawadee", "Levenim MT", "LilyUPC", "Lucida Console",
		"Lucida", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Unicode",
		"Maiandra GD", "Malgun Gothic", "Mangal", "Matisse ITC", "Meiryo",
		"Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", 
		"Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif",
		"Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei",
		"Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB",
		"MingLiU-ExtB", "Miriam Fixed", "Miriam", "Mistral", "Modern",
		"Mongolian Baiti", "Monotype Corsiva", "MoolBoran", "MS Gothic",
		"MS Mincho", "MS PGothic", "MS PMincho", "MS Reference1",
		"MS Reference2", "MS Reference Sans Serif", "MS Reference Specialty",
		"MS Sans Serif", "MS Serif", "MS UI Gothic", "MT Extra", "MV Boli",
		"Narkisim", "NSimSun", "Nyala", "OCR A Breed", "Palatino Linotype",
		"Papyrus", "Perpetua", "PlantageNet Cherokee", "PMingLiU",
		"PMingLiU-ExtB", "Pristina", "Raavi", "Rockwell", "Rod", "Roman",
		"Sakkal", "Script", "Segoe Print", "Segoe Script", "Segoe UI",
		"Segoe UI Symbol", "Shonar Bangla", "Shruti", "SemHei", 
		"Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Small Fonts",
		"Sylfaen", "Symbol", "System", "Tahoma", "Tempus Sans ITC", 
		"Terminal", "Times New Roman", "Traditional Arabic", "Trebucket MS", 
		"Tunga", "Utsaah", "Vani", "Verdana", "Vijaya", "Vivaldi", "Vrinda", 
		"Webdings", "Wingdings2", "Wingdings3", "Wingdings"];
		
		// PO Fonts //
		fonts.push("LCD");
		fonts.push("SignPainter'sGothicShadedSC JL");
		}
		
		
		ScriptUpdateMessage = function () {
		DisableChatColorRandomizer(0);
		
		if(typeof StartUp == 'undefined')
		StartUp = false;
		if(StartUp) {
		StartUp = false;
		var code = '<center>' +
		'<table border=1 width=65%>' +
		'<tr style="background: qradialgradient(cy: 0.1, cx: 0.5, fx: 0.9, fy: 0, radius: 2 stop: 0 black, stop: 1 white);">' +
		'<td align=center>' +
		'<img src="pokemon:493&back=true" align=left>' +
		'<img src="pokemon:385&back=false" align=right>' +
		'<font size=4><b>' +
		'<br/>'+servername+' - Scripts<br/>' +
		'</b></font>' +
		'Scripts have been loaded!<br/>' +
		'</td></tr></table></center>';
		
		sys.sendHtmlAll(code, 0);
		return;
		}
		
		var code = '<center>' +
		'<table border=1 width=65%>' +
		'<tr style="background: qradialgradient(cy: 0.1, cx: 0.5, fx: 0.9, fy: 0, radius: 2 stop: 0 black, stop: 1 white);">' +
		'<td align=center>' +
		'<img src="pokemon:493&back=true" align=left>' +
		'<img src="pokemon:385&back=false" align=right>' +
		'<font size=4><b>' +
		'<br/>'+servername+' - Scripts<br/>' +
		'</b></font>' +
		'Scripts have been updated!<br/>' +
		'~ '+ScriptVersion+' ~' +
		'</td></tr></table></center>';
		
		sys.sendHtmlAll(code, 0);
		}
		
		ChatColorRandomizer = function (firstColor, secondColor, channels) {
		if(firstColor === null || firstColor === undefined ||
		firstColor.toLowerCase() == "random")
		firstColor = randcolor();
		if(secondColor === null || secondColor === undefined ||
		secondColor.toLowerCase() == "random")
		secondColor = randcolor();
				
		var code = '<center><hr width="150"/><b>Party Time!</b><hr width="150"/></center><div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 '+firstColor+', stop:1 '+secondColor+');">';
		
		if(typeof channels == 'undefined' ||
		!channels instanceof Array || channels.length == 0) {
		sys.sendHtmlAll(code);
		channels = [0];
		}
		else {
		for(var y in channels) {
		sys.sendHtmlAll(code, channels[y]);
		}
		}
		
		for(var y in channels) 
		ChatColorRandomizers[channels[y]] = {'firstColor': firstColor, 'secondColor':secondColor};
		}
		
		DisableChatColorRandomizer = function (channel) {
		if(!ChatColorRandomizers.hasOwnProperty(channel))
		return;
		
		delete ChatColorRandomizers[channel];
		
		sys.sendHtmlAll('<center><hr width="150"/><b>Party Time is over!</b><hr width="150"/></center>', channel);
		}
		
		RandFont = function () {
		var font = fonts[Math.round(fonts.length*Math.random())];
		return font;
		}
				
		randcolor = function (tagformat) {
		var nums = 5;
		var str = '';
		while(nums >= 0) {
		str+=sys.rand(0, 16).toString(16);
		nums--;
		}
		if(!tagformat)
		return "#"+str;
		else
		return "<font color='#"+str+"'>";
		}


		removespaces = function(string)  {
		return string.split(' ').join('');
		}

		authToString = function(auth,img) {
		if(!img) {
		switch(auth) {
		case 0: return UserName;
		case 1: return ModName;
		case 2: return AdminName;
		case 3: return OwnerName;
		default: return InvisName;
		}
		}

		else {
		switch(auth) {
		case 1: return 'M';
		case 2: return 'A';
		case 3: return 'O';
		default: return 'U';
		}
		}
		}

		AuthIMG = function(x) {
		if(typeof x == 'string') {
		var ats = authToString(sys.dbAuth(x),true);
		return "<img src='Themes/Classic/Client/"+ats+"Away.png'>";
		}

		var status, ats = authToString(sys.auth(x),true), n;
		if(sys.away(x))
		status = 'Away';

		else if(!sys.away(x))
		status = 'Available';

		else if(sys.battling(x))
		status = 'Battle';

		n = ats+status+".png";
		return '<img src="Themes/Classic/Client/'+n+'">';
		}

		sortHash = function(object, method) {
		var objs = [], y, newobj = {}, x, n;
		for(y in object) {
		objs.push(y);
		}
		if(typeof method == 'function') {
		objs.sort(method);
		}
		else
		objs.sort();

		for(x in objs) {
		n = objs[x];
		newobj[n] = object[n];
		}

		return newobj;
		}

		if(typeof muteall == "undefined") {
		muteall = false;
		}

		if(typeof supermuteall == 'undefined') {
		supermuteall = false;
		}

		if(typeof megamuteall == 'undefined') {
		megamuteall = false;
		}
		
		try {
		if(ChatColorRandomizers instanceof Object)
		ChatColorRandomizers = {};
		} catch(e) {
		ChatColorRandomizers = {}; 
		}
		
		ban = function(name) {
		sys.ban(name);
		if(sys.id(name) != undefined) {
		kick(sys.id(name));
		}
		else {
		aliasKick(sys.dbIp(name));
		}
		}

		kick = function(src) {
		var xlist, c;
		var ip = sys.ip(src);
		var playerIdList = sys.playerIds();

		for(xlist in playerIdList) {
		c = playerIdList[xlist];
		if(ip == sys.ip(c)) {
		botAll("Running kick against IP: "+ip+", id: "+src+", name: "+sys.name(src), watch);
		sys.callQuickly('sys.kick('+c+');',1);
		}
		}
		}

		aliasKick = function(ip) {
		var aliases = sys.aliases(ip), alias, id;
		for(alias in aliases) {
		id = sys.id(aliases[alias]);
		if(id != undefined) {
		sys.callQuickly('sys.kick('+id+');',150);
		}
		}
		}

		massKick = function () {
		var xKick;
		var idListz = sys.playerIds();
		for(xKick in idListz) {
		if(sys.auth(idListz[xKick]) <= 0&&!JSESSION.users(idListz[xKick]).megauser) {
		sys.kick(idListz[xKick]);
		}
		}
		}

		selectInHash = function(hash, lowersearch) {
		var y, h = hash, lowersearch = lowersearch.toLowerCase(), c, ret;
		for(y in h) {
		c = h[y].toLowerCase();
		if(c == lowersearch) {
		ret = c;
		break;
		}
		}
		return ret;
		}


		self = function(src, tarname) {
		return sys.ip(src) == sys.dbIp(tarname);
		}

		dbRangeIPCheck = function(name) {
		var ips = sys.dbIp(name).split('.');
		return ips[0]+'.'+ips[1]+'.';
		}

		isHost = function (src) {
		return sys.ip(src) == "127.0.0.1";
		}

		formatPoke = function(pokenum,shine,backsprite,gendar,gan) {
		if(!pokenum||pokenum < 1||isNaN(pokenum)) {
		if(sys.pokeNum(pokenum) == undefined) {
		return "<img src='pokemon:0'>";
		}
		else {
		pokenum = sys.pokeNum(pokenum);
		}
		}

		var shiny = false, back = false, gender = "neutral", gen = 5;

		if(shine)
		shiny = true;

		if(backsprite)
		back = true;

		if(gendar) {
		gendar = Number(gendar);
		if((gendar == 0||gendar == 1||gendar == 2)) {
		gender = {0:"neutral",1:"male",2:"female"}[gendar];
		}
		}

		if(gan == 2 && pokenum > 151 && pokenum < 252)
		gen = gan;

		if(gan == 2 && pokenum > 251 && pokenum < 387)
		gen = 3;

		if(gan == 3 && pokenum > 386 && pokemon < 494)
		gen = 4;

		return "<img src='pokemon:"+pokenum+"&shiny="+shiny+"&back="+back+"&gender="+gender+"&gen="+gen+"'>";
		}

		function atag(s) {
		return '<a href="'+s+'">'+s+'</a>';
		}
		
		function clink($1) {
		return ChannelLink(sys.channel($1));
		}
		
		function evalBBCode ($1) {
		if(evallock && !GlobalHostVar) {
		return $1; }
		var toEval = $1.substr(6, $1.lastIndexOf("[")-6);		
		var ret;
		try {
		ret = eval(toEval);
		}
		catch(e) {
		return FormatError("", e);
		}
		
		if(ret === undefined || ret === null)
		ret = "";
		
		return ret;
		}
		
        format = function(src, str) {
        if(typeof str != "string")
        str = String(str);

		var auth = hpAuth(src);
		GlobalHostVar = isHost(src);
		
		if(src == "lvl0") {
		auth = 0;
		GlobalHostVar = false;
		}
		
		if(src == "lvl2") {
		auth = 2;
		GlobalHostVar = false;
		}
		
		if(src == 0) {
		auth = 3;
		GlobalHostVar = true;
		}
		
		if(auth > 2) { // Format this first for other bbcodes.
		str = str.replace(/\[eval\](.*?)\[\/eval\]/gi, evalBBCode);
		}
		
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
		str = str.replace(/[a-z]{3,}:\/\/[^ ]+/i,atag);
		str = str.replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<font color=$1>$2</font>')
		str = str.replace(/\[face=(.*?)\](.*?)\[\/face\]/gi, '<font face=$1>$2</font>');
		str = str.replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, '<font face=$1>$2</font>');

		if(auth > 0) {
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

		sendHtmlMessage = function (idList, message) {
		for (var i = 0; i < idList.length; ++i) {
		sys.sendHtmlMessage(idList[i], message);
		}
		}

		sendMessage = function (idList, message) {
		for (var i = 0; i < idList.length; ++i) {
		sys.sendMessage(idList[i], message);
		}
		}

		var hpAllow = function (id, auth) {
		var hp = Config.HighPermission, n = sys.name(id);
		return hp[n] !== undefined && hp[n][0] == sys.auth(id) && hp[n][1] >= auth;
		}

		noPermission = function (id,auth) {
		return sys.auth(id) < auth && !hpAllow(id, auth);
		}
		
		hpAuth = function (src) {
		var hp = Config.HighPermission, n = sys.name(src);
		var auth = sys.auth(src);
		if(hp[n] !== undefined && hp[n][0] == sys.auth(src)) {
		auth = hp[n][1];
		}
		
		return auth;
		}
		

		auths = function () {
		var ids = [];
		var list = sys.dbAuths();

		for (var i = 0; i < list.length; ++i) {
		var id = sys.id(list[i]);
		if (id !== undefined) {
		ids.push(id);
		}
		}
		return ids;
		}

		authByLevel = function () {
		var hash = {};
		var list = sys.dbAuths(), x, lis;

		for(x in list) {
		lis = list[x];
		hash[lis] = sys.dbAuth(lis);
		}

		return hash;
		}

		sendAuth = function (message) {
		var auth_list = sys.dbAuths(), id;
		for(var y in auth_list) {
		id = sys.id(auth_list[y]);
		if(id != undefined) {
		botMessage(id,message);
		}
		}
		print(html_strip(Config.Bot.bot+message));
		}

		millitime = function () {
		var now = new Date().getTime();
		return now;
		}

		runtime = function (eval_str, args) {
		var now = millitime();

		if(typeof eval_str == "string") {
		eval(eval_str);
		}

		else if(typeof eval_str == "function") {
		if(typeof args != "object")
		args = [];
		eval_str.apply(null,args);
		}

		var end = millitime();
		return end-now;
		}

		border = "»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»:";
		border2 = "<font color='mediumblue'><b>»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»</font>";
		border3 = "<font color='cornflowerblue'><b>»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»</font>";
		tour = "<font color=blue><timestamp/><b>«««««««««««««««««««««««»»»»»»»»»»»»»»»»»»»»»»»»</b></font>";
		SMT_tourCounter = 0;

		sendMainTour = function() {
		var send = false;
		if(SMT_tourCounter == 0) {
		sys.sendAll("",0);
		SMT_tourCounter = 1;
		send = true;
		}
		sys.sendHtmlAll(tour,0);
		if(SMT_tourCounter && !send) {
		sys.sendAll("",0);
		SMT_tourCounter = 0;
		}
		}

		spelling = function(thingy,u) {
		var thing = thingy.toString();
		if(/[aeiouAEIOU]/.test(thing[0])) {
		if(u) {
		return 'An '+thingy;
		}
		return 'an '+thingy;
		}

		if(u) {
		return 'A '+thingy;
		}
		return 'a '+thingy;
		}

		sLetter = function(thingy) {
		if(/[sS]/.test(thingy[thingy.length-1])) {
		return thingy+'es';
		}
		return thingy+'s';
		}

		sendAuthLength = function(src) {
		var auths = sys.dbAuths();
		if(sys.auth(src) > 2) {
		return auths.length;
		}

		var x;
		var leng = 0;
		for(x in auths) {
		if(sys.dbAuth(auths[x]) <= 3) {
		leng+=1;
		}
		}

		return leng;
		}

		isOffensive = function(m,id) {
		if(typeof m != 'string')
		return;
		m = m.toLowerCase();
		var URLBans = ["nobrain.dk","meatspin.com","lemonparty.org"]
		var ban;

		var cyrillic = /\u0408|\u03a1|\u0430|\u0410|\u0412|\u0435|\u0415|\u041c|\u041d|\u043e|\u041e|\u0440|\u0420|\u0441|\u0421|\u0422|\u0443|\u0445|\u0425|\u0456|\u0406/;
		var space = /\u0009-\u000D|\u0085|\u00A0|\u1680|\u180E|\u2000-\u200A|\u2028|\u2029|\u2029|\u202F|\u205F|\u3000/;
		var dash = /\u058A|\u05BE|\u1400|\u1806|\u2010-\u2015|\u2053|\u207B|\u208B|\u2212|\u2E17|\u2E1A|\u301C|\u3030|\u30A0|\uFE31-\uFE32|\uFE58|\uFE63|\uFF0D/;
		var greek = /\u03F3|\u0391|\u0392|\u0395|\u0396|\u0397|\u0399|\u039A|\u039C|\u039D|\u039F|\u03A1|\u03A4|\u03A5|\u03A7/;
		var armenian = /\u0555|\u0585/;
		var creek = /[\u0370-\u03ff]/;
		var special = /[\ufff0-\uffff]/;
		/* bad characters like spam */
		var other = /\u3061|\u65532/;
		var zalgo = /[\u0300-\u036F]/;
		var thai = /[\u0E00-\u0E7F]/;

		if (creek.test(m)
		||armenian.test(m)
		||dash.test(m)
		||space.test(m)
		||cyrillic.test(m)
		||greek.test(m)
		||special.test(m)
		||other.test(m)
		||zalgo.test(m)
		||thai.test(m)) {
		botMessage(id,"You have bad characters in your message.");
		return true;
		}
		
		for(var z = 0; z < URLBans.length; z++) {
		if(m.indexOf(URLBans[z]) > -1) {
		botMessage(id,"Bad URL: "+URLBans[z]);
		return true;
		}
		}

		return false;
		}

		cmp = function(a, b) {
		return a.toLowerCase() == b.toLowerCase();
		}

		if(typeof(cache) == "undefined") {
		run("cacheload") }

		if(typeof(DataHash) == "undefined") {
		DataHash = {}; }

		if(typeof(DataHash.mutes) == "undefined") {
		DataHash.mutes = {};
		if(cache.get("mutes") != "") {
		try {
		DataHash.mutes = JSON.parse(cache.get("mutes"));
		}
		catch(e) {
		DataHash.mutes = {};
		}
		}
		}

		if(typeof DataHash.voices == "undefined") {
        DataHash.voices = {};
		if(cache.get("voices") != "") {
		try {
		DataHash.voices = JSON.parse(cache.get("voices"));
		}
		catch(e) {
		DataHash.voices = {};
		}
		}
		}
		
		if(typeof(DataHash.names) == "undefined") {
		DataHash.names = {};

		if(cache.get("names") != "") {
		try {
		DataHash.names = JSON.parse(cache.get("names"));
		}
		catch(e) {
		DataHash.names = {};
		}
		}


		var ids = sys.playerIds(), x,n,l;
		for(x in ids) {
		n = sys.name(ids[x]); l = n.toLowerCase();
		if(typeof DataHash.names[l] != 'undefined')
		continue;
		DataHash.names[l] = n;
		}
		}

		if(typeof(DataHash.mail) == "undefined") {
		DataHash.mail = {};
		if(cache.get("mail") != "") {
		try {
		DataHash.mail = JSON.parse(cache.get("mail"));
		}
		catch(e){
		DataHash.mail = {};
		}
		}
		}

		if(typeof(DataHash.bannedAbilities) == "undefined") {
		DataHash.bannedAbilities = {};
		if(cache.get("bannedAbilities") != "") {
		try {
		DataHash.bannedAbilities = JSON.parse(cache.get("bannedAbilities"));
		}
		catch(e){
		DataHash.bannedAbilities = {};
		}
		}
		}

		if(typeof(DataHash.rangebans) == "undefined") {
		DataHash.rangebans = {};
		if(cache.get("rangebans") != "") {
		try {
		DataHash.rangebans = JSON.parse(cache.get("rangebans"));
		}
		catch(e){
		DataHash.rangebans = {};
		}
		}
		}

		if(typeof(DataHash.money) == "undefined") {
		DataHash.money = {};
		if(cache.get("money") != "") {
		try {
		DataHash.money = JSON.parse(cache.get("money"));
		}
		catch(e) {
		DataHash.money = {};
		}
		}
		}

		if(typeof(DataHash.rankicons) == "undefined") {
		DataHash.rankicons = {};
		if(cache.get("rankicons") != "") {
		try {
		DataHash.rankicons = JSON.parse(cache.get("rankicons"));
		}
		catch(e) {
		DataHash.rankicons = {};
		}
		}
		}

		if(typeof(DataHash.megausers) == "undefined") {
		DataHash.megausers = {};
		if(cache.get("megausers") != "") {
		try {
		DataHash.megausers = JSON.parse(cache.get("megausers"));
		}
		catch(e) {
		DataHash.megausers = {};
		}
		}
		}


		if(typeof(DataHash.tempauth) == "undefined") {
		DataHash.tempauth = {};
		if(cache.get("tempauths") != "") {
		try {
		DataHash.tempauth = JSON.parse(cache.get("tempauths"));
		}
		catch(e) {
		DataHash.tempauth = {};
		}
		}
		}

		if(typeof(DataHash.league) == "undefined") {
		DataHash.league = {};
		if(cache.get("league") != "") {
		try {
		DataHash.league = JSON.parse(cache.get("league"));
		}
		catch(e) {
		DataHash.league = {};
		}
		}
		}

		if(typeof(DataHash.idles) == "undefined") {
		DataHash.mutes = {};
		if(cache.get("idles") != "") {
		try {
		DataHash.idles = JSON.parse(cache.get("idles"));
		}
		catch(e) {
		DataHash.idles = {};
		}
		}
		}
		if(typeof(DataHash.tempbans) == "undefined") {
		DataHash.tempbans = {};
		if(cache.get("tempbans") != "") {
		try {
		DataHash.tempbans = JSON.parse(cache.get("tempbans"));
		}
		catch(e) {
		DataHash.tempbans = {};
		}
		}
		}

		if(typeof(CommandsEnabled) == "undefined") {
		CommandsEnabled = {'me':true,'_catch_':true,'attack':true,'roulette':true};
		if(cache.get("CommandsEnabled") != "") {
		try {
		CommandsEnabled = JSON.parse(cache.get("CommandsEnabled"));
		}
		catch(e){
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		}
		}
		else {
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		}
		}

		if(typeof(PointerCommands) == "undefined") {
		PointerCommands = {};
		if(cache.get("pointercommands") != "") {
		try {
		PointerCommands = JSON.parse(cache.get('pointercommands'));
		}
		catch(e){
		PointerCommands = {};
		}
		}
		}

		startUpTime = function() {
		var n, s = [];
		var d=[[7*24*60*60,"<b>Week"],[24*60*60,"<b>Day"],[60*60,"<b>Hour"],[60,"<b>Minute"],[1,"<b>Second"]];
		var sec = sys.time()*1-startupTime

		for(j=0;j<5;++j){
		var n=parseInt(sec/d[j][0]);
		if(n>0){
		s.push((n+" "+d[j][1]+(n>1?"s":"")));
		sec-=n*d[j][0];
		if(s.length>=5)
		break;
		}
		}
		return s.join("</b>, ");
		}

		lastName = function(ip) {
		if(typeof DataHash.names[ip] != "undefined" && typeof(DataHash) != "undefined") {
		return DataHash.names[ip];
		}
		return undefined;
		}

		sendSTFUTruck = function(src,c) {
		sys.sendMessage(src, '|^^^^^^^^^^^\||____',c);
		sys.sendMessage(src, '| The STFU Truck  |||""\'|""\__,_',c);
		sys.sendMessage(src, '| _____________ l||__|__|__|)',c);
		sys.sendMessage(src, '...|(@)@)"""""""**|(@)(@)**|(@)',c);
		botMessage(src,"The Chat is Silenced!",c);
		}

		getTimeString=function(sec){
		var s=[];
		var n;
		var d=[[7*24*60*60,"week"],[24*60*60,"day"],[60*60,"hour"],[60,"minute"],[1,"second"]];

		for(j=0;j<5;++j){
		var n=parseInt(sec/d[j][0]);
		if(n>0){
		s.push((n+" "+d[j][1]+(n>1?"s":"")));
		sec-=n*d[j][0];
		if(s.length>=5)
		break;
		}
		}

		return s.join(", ");
		}

		shuffle=function(o){
		for(var j,x,i=o.length;i;j=parseInt(Math.random()*i),x=o[--i],o[i]=o[j],o[j]=x);
		return o;
		}

		cap=function(string){
		return string.charAt(0).toUpperCase()+string.slice(1);
		}

		dump=function(src,mess){
		for(x in mess) {
		sys.sendMessage(src,mess[x],mafiachan);
		}
		}

		html_escape = function(str) {
		return str.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
		}

		html_strip = function (str) {
		return str.replace(/<\/?[^>]*>/g, "");
		}

		html_escape_strip = function(str) {
		return str.replace(/\&amp;/g, "").replace(/\&lt;/g, "").replace(/\&gt;/g, "");
		}

		regexp_escape = function (str) {
		return str.replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '\\$1');
		}

		regexp_strip = function (str) {
		return str.replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '');
		}

		idsOfIP = function(ip) {
		var players = sys.playerIds(), y, ipArr = [];
		for(y in players) {
		if(sys.ip(players[y]) == ip) {
		ipArr.push(players[y]);
		}
		}
		return ipArr;
		}

		hasCommandStart = function(message) {
		return message[0] == '/' || message[0] == '\\' || message[0] == ',';
		}

		sendChanError = function(src,chan,mchan) {
		if(chan != mchan) {
		botMessage(src,ChannelLink(sys.channel(mchan))+" commands should be used in channel "+ChannelLink(sys.channel(mchan))+".",chan);
		if(!sys.isInChannel(src,mchan)) {
		sys.putInChannel(src,mchan);
		}
		return true;
		}
		return false;
		}

		authsOf = function(authy) {
		var auths = sys.dbAuths();
		var count = 0;
		for(var y in auths) {
		if(authy < 4) {
		if(sys.dbAuth(auths[y]) == authy) {
		count++;
		}
		}
		else {
		if(sys.dbAuth(auths[y]) >= authy) {
		count++;
		}
		}
		}

		return count;
		}

		objLength = function(obj) {
		return Object.keys(obj).length;
		}

		sendBotToAllBut=function(id,mss,cid,kind) {
		var typo;
		if(kind==undefined)
		var kind = "";

		var k = kind.toLowerCase();
		if(k == "escape")
		typo = botEscapeMessage;
		else
		typo = botMessage;

		var pID;
		var pIDs = sys.playerIds();
		for(pID in pIDs) {
		var p = pIDs[pID];
		if(p !== id) {
		typo(p,mss,cid);
		}
		}

		print(html_strip(Config.Bot.bot+": "+mss));
		}
		}
		,

		templaterload:function() {

		Template = function () {
		this.template = [];
		}

		Template.prototype.register = function(m) {
		this.template.push(m);
		}

		Template.prototype.render = function(src,chan) {
		sys.sendHtmlMessage(src,this.template.join('<br/>'),chan);
		}

		Command_Templater = function(template_name,mess) {
		this.multiple = mess ? true : false;
		if(!mess) {
		this.template = [
		style.header,
		style.span.replace(/{{Name}}/gi,template_name)+"<br/>",
		style.message+"<br/>"
		];
		}
		else {
		this.template = [
		style.header,
		style.span.replace(/{{Name}}/gi,template_name)
		];
		}
		}

		Command_Templater.prototype.format = function(str) {
		str = str.replace(/\{r (.*?)\}/gi, '<font color="red">$1</font>');
		str = str.replace(/\{or (.*?)\}/gi, '<font color="orangered">$1</font>');
		str = str.replace(/\{o (.*?)\}/gi, '<font color="orange">$1</font>');
		str = str.replace(/\{p (.*?)\}/gi, '<font color="purple">$1</font>');
		str = str.replace(/\{b (.*?)\}/gi, '<font color="blue">$1</font>');
		str = str.replace(/\{g (.*?)\}/gi, '<font color="green">$1</font>');
		return str;
		}

		Command_Templater.prototype.register = function(name,args,desc,nospace) {
		if(arguments.length == 1) {
		this.template.push(name);
		return;
		}

		var form = style.formatting;

		if(arguments.length == 2) {
		desc = args;
		this.template.push(form[0]+style.icon+" <font color='"+style.color+"'>"+name+"</font>"+form[1]+": "+desc);
		return;
		}

		var space = !nospace ? ' ' : '', add = ':';
		if(space == '') {
		args[1] = " "+args[1]; }
		var args_joined = "", forma;
		for(var y in args) {
		forma = this.format(args[y]);
		if(space == '') {
		add = y == 0 ? '' : ':'; }
		args_joined += (forma+form[1]+add+form[0]);
		}

		args_joined = args_joined.substring(0,args_joined.length-form[0].length);
		this.template.push(form[0]+style.icon+" <font color='"+style.color+"'>"+name+"</font>"
		+ space+args_joined+" "+desc);
		}

		Command_Templater.prototype.span = function(name) {
		this.template.push(style.span.replace(/{{Name}}/gi,name)+"<br/>");
		if(this.multiple) {
		this.template.push(style.message+"<br/>");
		}
		}

		Command_Templater.prototype.render = function(id,chan) {
		return sys.sendHtmlMessage(id,this.template.join('<br/>'),chan);
		}

		Templater = function (template_name) {
		this.template = [
		style.header,
		style.span.replace(/{{Name}}/gi,template_name)+"<br/>"
		];
		}

		Templater.prototype.register = function(mess) {
		this.template.push(mess);
		}

		Templater.prototype.span = function(name) {
		this.template.push(style.span.replace(/{{Name}}/gi,name)+"<br/>");
		}

		Templater.prototype.render = function(id,chan) {
		return sys.sendHtmlMessage(id,this.template.join('<br/>'),chan);
		}

		Table_Templater = function (template_name,color,border) {
		this.template = [
		style.header,
		"<h2>"+template_name+"</h2><br/>",
		"<table border='"+border+"' cellpadding='5'>"
		];
		this.color = color;
		}

		Table_Templater.prototype.register = function(arr,bold) {
		var mess = "<tr bgcolor='"+this.color+"'>", l = arr.length;
		var bolds = bold ? ['<th>','</th>'] : ['<td>','</td>'];

		for(var y = 0; y < l; y++) {
		mess += bolds[0]+arr[y]+bolds[1];
		}

		mess += "</tr>";
		this.template.push(mess);
		}

		Table_Templater.prototype.end = function() {
		this.template.push("</table><br/>");
		this.template.push(style.footer);
		}

		Table_Templater.prototype.render = function(id,chan) {
		sys.sendHtmlMessage(id,this.template.join(''),chan);
		
		if(ChatColorRandomizers.hasOwnProperty(chan)) { // Tables reset
		var index = ChatColorRandomizers[channel];
		var code = '<center><hr width="150"/><b>Party Time!</b><hr width="150"/></center><div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 '+index.firstColor+', stop:1 '+index.secondColor+');">';
        sys.sendHtmlMessage(src, code, channel);
		}

		return undefined;
		}
		}
		,

		triviaload:function() {
		Trivia = new function() {
		this.questionNum = function() {
		var quest = objLength(this.questions);
		return quest;
		}

		this.questionInfo = function() {
		botAll("The Question is: "+html_escape(this.TrivData.question.name),trivia);
		botAll("Hint: "+html_escape(this.TrivData.question.hint),trivia);
		}

		this.leaderboardDisplay = function(src,match) {
		var scores = this.leaderboard;
		if(objLength(scores) < 1) {
		botMessage(src, "No leaderboard data available.",trivia);
		return;
		}

		if(isEmpty(match)||scores[match] == undefined) {
		var l = [];
		for (var user in scores)
		l.push([user, scores[user]]);

		l.sort(function(a,b) { return b[1] - a[1]; });
		botMessage(src,"<font size=4>Trivia Leaderboard</font>",trivia);
		for (var i = 0; i < l.length; ++i) {
		var num = i+1;
		botEscapeMessage(src,num+". Player " + l[i][0] + " with " + l[i][1] + " round wins",trivia);
		}
		return;
		}
		botMessage(src,"<font size=4>Leaderboard for "+html_escape(match)+"</font>",trivia);
		botMessage(src, "Player "+match+" with "+String(scores[match]*1)+" round wins",trivia);
		}

		this.initData = function() {
		if(typeof(this.TrivData) != "undefined")
		return;

		this.TrivData = {
		mode:0,
		question:'',
		rand:0,
		round:1,
		timeout:0
		}
		}

		this.selectRandomQuestion = function() {
		var list = Object.keys(this.questions);
		var rand = Math.round(list.length*Math.random());
		var result = this.questions[list[rand]];
		this.TrivData.question = {
		name:result.question,
		hint:result.hint,
		answers:result.answers
		}
		}

		this.doesQuestionExist = function(qn) {
		return typeof(this.questions[qn]) != "undefined";
		}

		this.endSession = function() {
		delete this.TrivData;
		this.initData();
		}

		this.questionsLoad = function() {
		try {
		this.questions = JSON.parse(TrivCache.get("Questions"));
		}
		catch(e) {
		this.questions = {};
		}
		}

		this.leaderboardLoad = function() {
		try {
		this.leaderboard = JSON.parse(TrivCache.get("LeaderBoard"));
		}
		catch(e) {
		this.leaderboard = {};
		}
		}

		this.questionsSave = function() {
		TrivCache.write("Questions",JSON.stringify(this.questions));
		}

		this.leaderboardSave = function() {
		TrivCache.write("LeaderBoard",JSON.stringify(this.leaderboard));
		}

		this.writeStatsToBoard = function(user) {
		var num = this.leaderboard[user] === undefined ? 1 : this.leaderboard[user]+1;
		this.leaderboard[user] = num;
		this.leaderboardSave();
		}

		this.start=function(src) {
		var name = src ? sys.name(src) : Config.Bot.bot+"</i>"
		if(this.isGameGoingOn()) {
		if(src) {
		botMessage(src,"A Trivia game is already going on.",trivia);
		}
		return;
		}
		if(this.questionNum() == 0) {
		if(src) {
		botMessage(src,"No questions exist.",trivia);
		}
		return;
		}
		this.TrivData.mode = 1;
		this.TrivData.round = 1;
		this.selectRandomQuestion();
		botAll("A new trivia game was started by "+name+"!",0);
		botAll("A new trivia game was started by "+name+" [Round: 1]!",trivia);
		this.questionInfo();
		return;
		}

		this.isGameGoingOn = function() {
		return this.TrivData.mode != 0;
		}

		this.a=function(src,commandData) {
		if(isEmpty(commandData)) {
		botMessage(src,"Please specify an answer.",trivia);
		return;
		}
		if(!this.isGameGoingOn()) {
		botMessage(src,"No trivia game is going on.",trivia);
		return;
		}
		if(this.TrivData.timeout) {
		botMessage(src,"Wait for a moment..",trivia);
		return;
		}

		var x, split = this.questions[this.TrivData.question.name].answers.split("|||");

		for(var x in split) {
		if(commandData.toLowerCase() == split[x].toLowerCase()) {
		botAll(sys.name(src)+" answered correctly and won this trivia round!",trivia);
		this.writeStatsToBoard(sys.name(src));

		if(this.TrivData.round >= 20) {
		botAll("The game has ended!",trivia);
		this.TrivData.round = 1;
		this.endSession();
		return;
		}

		this.TrivData.rand = sys.rand(20,31);
		this.TrivData.round++;
		this.TrivData.timeout = 1;
		botAll("Have a "+this.TrivData.rand+" second break until the next question!",trivia);
		sys.callLater("Trivia.newGameLoad()",Trivia.TrivData.rand);
		return;
		}
		}

		botMessage(src,"Sorry, incorrect! Your answer was: "+commandData,trivia);
		return;
		}

		this.newGameLoad = function() {
		this.TrivData.mode = 1;
		this.TrivData.timeout = 0;
		this.selectRandomQuestion();
		botAll("Answer the following question! [Round: "+this.TrivData.round+"]",trivia);
		this.questionInfo();
		}

		this.end=function(src) {
		if(!this.TrivData.mode) {
		botMessage(src,"No trivia session is going on.");
		return;
		}
		botAll("Trivia game ended by "+sys.name(src)+"!",trivia);
		botAll("Trivia game ended by "+sys.name(src)+"!",0);
		this.endSession();
		return;
		}

		this.questionList=function(src) {
		if(this.questionNum() == 0) {
		botMessage(src,"No questions exist.",trivia);
		return;
		}
		var q = this.questions, y;
		for(y in q) {
		botEscapeMessage(src,"Question - "+q[y].question,trivia);
		}
		return;
		}

		this.remove = function(src,commandData) {
		if(this.questionNum() == 0) {
		botMessage(src,"No questions exist.",trivia);
		return;
		}
		if(selectInHash(this.questions,commandData) == undefined) {
		botMessage(src,"That question doesn't exist. For a list of questions, type /questions",trivia);
		return;
		}
		if(this.TrivData.question.name.toLowerCase() == commandData.toLowerCase()) {
		botMessage(src,"A round is going on with this question. Please use /skip first.",trivia);
		return;
		}
		delete this.questions[commandData];
		botMessage(src,"Deleted question!",trivia);
		this.questionsSave();
		return;
		}

		this.skipRound=function(src) {
		if(!this.isGameGoingOn()) {
		botMessage(src,"No trivia game is going on.",trivia);
		return;
		}
		if(this.TrivData.timeout) {
		botMessage(src,"Wait for a moment..",trivia);
		return;
		}
		botAll(sys.name(src)+" skipped this round!",trivia);

		if(this.TrivData.round >= 20) {
		botAll("The game has ended!",trivia);
		this.TrivData.round = 1;
		this.endSession();
		return;
		}

		this.TrivData.rand = sys.rand(6,12);
		this.TrivData.round++;
		this.TrivData.timeout = 1;
		botAll("Have a "+this.TrivData.rand+" second break until the next question!",trivia);
		sys.callLater("Trivia.newGameLoad()",Trivia.TrivData.rand);

		}

		this.viewQuestion = function(src,commandData) {
		if(isEmpty(commandData))
		return;
		if(this.questionNum() == 0) {
		botMessage(src,"No questions exist.",trivia);
		return;
		}
		if(selectInHash(this.questions,commandData) == undefined) {
		botMessage(src,"That question doesn't exist. For a list of questions, type /questions",trivia);
		return;
		}

		var y = undefined;
		var r = this.questions[commandData].question
		var o = this.questions[commandData].hint
		if(typeof(this.questions[commandData].by) != "undefined")
		var y = this.questions[commandData].by;

		botMessage(src, "Question: "+html_escape(String(r)),trivia);
		botMessage(src, "Hint: "+html_escape(String(o)),trivia);

		if(y != undefined)
		botAll("By: "+html_escape(String(y)),trivia);

		if(sys.auth(src) > 0) {
		var ans = this.questions[commandData].answers;
		var answers = ans.split("|||");
		var joined = answers.join(", ");

		var s = answers.length == 1 ? " is" : "s are";
		botMessage(src, "The Answer"+s+": "+html_escape(joined),trivia);
		botMessage(src, "Total Number of possible Answers: "+answers.length,trivia);
		}
		}

		this.submit=function(src,mcmd) {
		if(isEmpty(mcmd[0])||isEmpty(mcmd[1])||isEmpty(mcmd[2])) {
		botMessage(src,"Specify parameters!",trivia);
		return;
		}
		if(this.doesQuestionExist(mcmd[0]) && this.questions[mcmd[0]].by !== sys.name(src)) {
		botMessage(src,"This question already exists!",trivia);
		return;
		}
		if(mcmd[2].indexOf("|||") != -1) {
		botMessage(src,"Please don't put \"|||\" in your answers",trivia);
		return;
		}
		mcmd[2] = cut(mcmd, 2, ':');
		this.questions[mcmd[0]] = {};
		this.questions[mcmd[0]].hint = mcmd[1];

		var _Answers = mcmd[2].split("|").join("|||");
		var aResult = _Answers.indexOf("|||") != -1 ? _Answers : _Answers+"|||";

		this.questions[mcmd[0]].answers = aResult;
		this.questions[mcmd[0]].question = mcmd[0];
		this.questions[mcmd[0]].by = sys.name(src);

		botMessage(src,"Submitted question!",trivia);
		this.questionsSave();
		return;
		}

		}();
		Trivia.initData();
		Trivia.questionsLoad();
		Trivia.leaderboardLoad();
		}
		,

		required_functions_load : function() {
		RECOVERY = function () {
		if(typeof script.message != 'undefined' && typeof script.step == 'undefined') {
		botAll("Fatal Script Error detected! "+FormatError("", script));
		botAll("Recovering script functions!");
		
		var x, SC = RECOVERY_BACKUP, pushedFunctions = 0;
		for(x in SC) {
		try {
		script[x] = SC[x];
		pushedFunctions++;
		}
		
		catch(e) {
		botAll("Error when recovering "+x+"! "+FormatError("", e));
		}
		}
		
		botAll("Function recovery completed! Recovered "+pushedFunctions+"/"+objLength(RECOVERY_BACKUP)+" functions.");
		script.beforeNewMessage("Script Check: OK");
		botAll("Recovery completed!");
		}
		}
		
		/*
		compareDots = function(compr1, compr2) {
		var s = compr1.split(".");
		var z = compr2.split("."), y, i = s.length;

		if(i != z.length) {
		return new TypeError("Argument 1 does not have the same number of dots as Argument 2 in compareDots");
		} if(compr1 == compr2) {
		return "Equal";
		}

		for(y = 0; y < i; y++) {
		if(s[y] > z[y])
		return compr1;
		else if(z[y] > s[y])
		return compr2;
		}

		return "Equal";
		}
		*/


		isNonNegative=function(n){
		return typeof n=='number'&&!isNaN(n)&&n>=0;
		}

		isEmpty = function(s) {
		if(typeof(s) === "undefined"){
		return true;
		}

		if(typeof s == "string") {
		if(s===""||s===undefined||s===" ") {
		return true;
		}
		}

		if(typeof(s) === "number") {
		if(!isNonNegative(s)) {
		return true;
		}
		}

		if(typeof(s) == "function") {
		var i;
		for(var i in s) {
		if(typeof(s[i]) != "object"||s==null) {
		return true;
		}
		}
		}

		if(typeof(s) == "object") {
		if(!s instanceof Object && !s instanceof Array)
		return true;
		}

		return false;
		}

		createFile = function(file,type,replacement) {
		var t = type.toLowerCase()
		switch(t) {
		case 'json':
		case 'hashfile':
		t = ".json";
		break;
		case 'txt':
		case 'text':
		case 'normal':
		case 'file':
		t = ".txt";
		break;
		case 'javascript':
		case 'qscript':
		case 'script':
		case 'js':
		t = ".js";
		break;
		}

		sys.appendToFile(file+t,"");
		if(sys.getFileContent(file+t) == "") {
		sys.writeToFile(file+t,replacement);
		}

		}
		}
		,

		statsload : function() {
		if(typeof Poke_Stats == 'undefined') {
		var File_Content = sys.getFileContent("db/pokes/poke_stats.txt").split("\n");
		Poke_Stats = {};
		var x, curr_stats, poke, spl, flen = File_Content.length;

		for(x = 0; x < flen; x++) {
		curr_stats = File_Content[x].split(" ");
		spl = curr_stats[0].split(":");

		if(spl[1] != "0"||spl[0] == "0") {
		continue;
		}

		poke = sys.pokemon(spl[0]);

		Poke_Stats[poke] = {
		'HP':curr_stats[1],
		'ATK':curr_stats[2],
		'DEF':curr_stats[3],
		'SPATK':curr_stats[4],
		'SPDEF':curr_stats[5],
		'SPD':curr_stats[6]
		};
		}}


		formatStat = function(poke,stat) {
		var stat = Poke_Stats[poke][stat];
		var string = stat.bold(), y;
		var ranges = [30, 50, 60, 70, 80, 90, 100, 200, 300];
		var colors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];

		for(y in ranges) {
		if(stat <= ranges[y]) {
		string = string.fontcolor(colors[y]);
		return string;
		}
		}
		}
		statsOf = function(poke) {
		var stat = Poke_Stats[poke];
		var ret = [], z;
		for(z in stat) {
		ret.push(stat[z]);
		}
		return ret;
		}

		formatStatsOf = function(poke) {
		var stats = ["HP","ATK","DEF","SPATK","SPDEF","SPD"];
		var ret = "", z, stat_len = stats.length, stt;
		for(z = 0; z < stat_len; z++) {
		stt = stats[z];
		if(stt != "SPD") {
		ret += stt+": "+formatStat(poke,stt)+" | ";
		}
		else {
		ret += stt+": "+formatStat(poke,stt);
		}
		}

		return ret;
		}

		baseStatTotal = function(poke) {
		var poke = Poke_Stats[poke];
		var retnum = 0, y;
		for(y in poke) {
		retnum += Number(poke[y]);
		}
		return retnum;
		}

		formatBaseStatTotal = function(poke) {
		var stat = baseStatTotal(poke);
		var string = String(stat).bold(), y;
		var ranges = [180, 300, 360, 420, 480, 540, 600, 1200, 1800];
		var colors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];

		for(y in ranges) {
		if(stat <= ranges[y]) {
		string = string.fontcolor(colors[y]);
		return string;
		}
		}
		return string;
		}

		pokeType = function(poke) {
		var poke_num = sys.pokeNum(poke);
		var type = sys.pokeType1(poke_num);
		var ret = "";
		var type2 = sys.pokeType2(poke_num);

		var type_name = sys.type(type).bold();

		ret += type_name;

		if(type2 != 17) {
		var type_name2 = sys.type(type2).bold();
		ret += " & "+type_name2;
		}

		return ret;
		}

		firstGen = function(poke) {
		poke = sys.pokeNum(poke);
		if(poke < 152)
		return 1;
		else if(poke < 252)
		return 2;
		else if(poke < 387)
		return 3;
		else if(poke < 494)
		return 4;
		else
		return 5;
		}

		pokeAbilities = function(poke) {
		poke = sys.pokeNum(poke);
		var ret = "";
		var abil = [sys.pokeAbility(poke,0),sys.pokeAbility(poke,1),sys.pokeAbility(poke,2)];

		ret += sys.ability(abil[0]).bold();

		if(abil[1] != 0) {
		ret += " | "+sys.ability(abil[1]).bold();
		}
		if(abil[2] != 0) {
		ret += " | "+sys.ability(abil[2]).bold()+" (<u>Dream World Ability</u>)";
		}
		return ret;
		}

		randPoke = function() {
		return sys.pokemon(sys.rand(1,650));
		}

		pokedex = function(src,chan,pokemon,source) {
		var n = sys.pokeNum(pokemon);
		var t = new Templater("Pokedex - "+pokemon);
		var s = sys.pokeType2(n) == 17 ? '' : 's';
		var s2 = sys.pokeAbility(n,1) == 0 && sys.pokeAbility(n,2) == 0 ? 'y' : 'ies'
		t.register("<img src='pokemon:num="+n+"'>"
		+ " <img src='pokemon:num="+n+"&back=true'>"
		+ " <img src='pokemon:num="+n+"&shiny=true'>"
		+ " <img src='pokemon:num="+n+"&shiny=true&back=true'><br/>");

		t.register("National Dex Number: "+String(n).bold()+".");
		t.register("Generation "+String(firstGen(pokemon)).bold()+" Pokemon."+"<br/>");


		t.register("Type"+s+": "+pokeType(pokemon));
		t.register("Abilit"+s2+": "+pokeAbilities(pokemon)+".<br/>");
		t.register(formatStatsOf(pokemon));
		t.register("Base Stat Total: "+formatBaseStatTotal(pokemon)+".");
		t.register(style.footer);
		if(!source) {
		t.render(src,chan);
		return;
		}
		sys.sendHtmlMessage(src,html_escape(t.template.join("<br/>")),chan);

		}

		}
		,

		pruneload: function () {
		prune_tempauth = function () {
		var a = DataHash.tempauth;
		var hashauth;
		var CURR_TIME = sys.time()*1;
		var curr_inst;
		var made_change = false;
       
	    for(hashauth in a) {
		curr_inst = a[hashauth];
		if(CURR_TIME >= curr_inst.time) {
		if(sys.dbAuth(curr_inst.name) > curr_inst.role) {
		delete a[hashauth];
		return;
		}

		var changeAuth = 0;
		if(curr_inst.oldauth != undefined) {
		changeAuth = curr_inst.oldauth;
		}

		botAll(curr_inst.name+" is no longer "+authToString(curr_inst.role)+".",0);

		var id = sys.id(curr_inst.name);
		if(id != undefined) {
		sys.changeAuth(id,changeAuth);
		}

		sys.changeDbAuth(curr_inst.name,changeAuth);
		made_change = true;
		delete a[hashauth];
		}
		}
		
		if(made_change)
		cache.write("tempauths",JSON.stringify(a));
		}
		
		prune_bans = function () {
		var tb = DataHash.tempbans, hashban, TIME_NOW = sys.time()*1, hasDeleted = false;
		for(hashban in tb) {
		if(TIME_NOW >= tb[hashban].time) {

		delete tb[hashban];
		hasDeleted = true;
		}
		}
		if(hasDeleted)
		cache.write("tempbans",JSON.stringify(tb));
		}

		prune_mutes = function () {
		var hashmute, mute = DataHash.mutes, TIME_NOW = sys.time()*1, hasDeleted = false;
		for(hashmute in mute) {
		if(TIME_NOW >= mute[hashmute].time&&mute[hashmute].time != 0) {

		delete mute[hashmute];
		hasDeleted = true;
		}
		}
		if(hasDeleted)
		cache.write("mutes",JSON.stringify(mute));
		}

		prune_rangebans = function () {
		var hashrange, rb = DataHash.rangebans, TIME_NOW = sys.time()*1, hasDeleted = false;;
		for(hashrange in rb) {
		if(TIME_NOW >= rb[hashrange].time&&rb[hashrange].time != 0) {

		delete rb[hashrange];
		hasDeleted = true;
		}
		}
		if(hasDeleted)
		cache.write("rangebans",JSON.stringify(rb));
		}

		prune_channel_bans = function(chan) {
		var pruneban, ban = JSESSION.channels(chan).banlist, TIME_NOW = sys.time()*1, hasDeleted = false;
		for(pruneban in ban) {
		if(TIME_NOW >= ban[pruneban].time&&ban[pruneban].time != 1) {
		delete ban[pruneban];
		hasDeleted = true;
		}
		}
		if(hasDeleted)
		updateChannelData(chan);
		}

		prune_channel_mutes = function(chan) {
		var pruneban, ban = JSESSION.channels(chan).mutelist, TIME_NOW = sys.time()*1, hasDeleted;
		for(pruneban in ban) {
		if(TIME_NOW >= ban[pruneban].time&&ban[pruneban].time != 1) {
		delete ban[pruneban];
		hasDeleted = true;
		}
		}

		if(hasDeleted)
		updateChannelData(chan);
		}

		}
		,

		importload: function () {
		// TODO: Import Lutra and PO Script data.
		importData = function () {
		}
		
		}
		,
		
		dataManagementLoad: function() {
		run = function (f) {
		if(typeof script[f] == "undefined")
		return;

		try {
		script[f]();
		}
		catch(e) {
		print(FormatError("Runtime Error: Could not call script."+f+"! Please report this.", e));
		}
		}

		run("required_functions_load");
		run("otherload");
		run("configload");

		ConfigLoad();

		run("cacheload");
		run("pruneload");
		run("channelload");
		run("channelsLoad");

		run("triviaload");
		run("myload");
		run("mafiaload");

		run("tierload");
		run("managerload");
		run("templaterload");
		run("statsload");
		run("importload");

		// script.forumload(); //

		/*try {
		for(var x in channels) {
		var cx = channels[x];
		if(JSESSION.channels(cx).tour == undefined) {
		JSESSION.channels(cx).tour = new Tours(cx);
		}
		}
		}
		catch(e) {}*/

		createFile("CommandStats","txt","");

		initCommandStats = function() {
		try {
		if(sys.getFileContent("CommandStats.txt") == "") {
		commandStats = {};
		commandStats.startTime = parseInt(sys.time());
		saveCommandStats();
		return;
		}
		commandStats = JSON.parse(sys.getFileContent("CommandStats.txt"));
		}
		catch(e) {
		commandStats = {};
		commandStats.startTime = parseInt(sys.time());
		saveCommandStats();
		}
		}

		saveCommandStats = function() {
		sys.writeToFile("CommandStats.txt",JSON.stringify(commandStats));
		}

		writeCommandStats = function(n,user) {
		commandStats[n] = commandStats[n] || {stat:0,lastuser:undefined};
		commandStats[n].stat += 1;
		commandStats[n].lastuser = user;
		if(n != "commandstats") {
		commandStats.lastCommandUse = parseInt(sys.time());
		}
		saveCommandStats();
		}

		displayCommandStats = function(src,chan,limit) {
		var cmdS = [];
		for (var name in commandStats)
		cmdS.push([name,commandStats[name].stat,commandStats[name].lastuser]);
		var totalstats = 0;
		cmdS.sort(function(a,b) { return b[1] - a[1]; });
		if(!limit) limit = 3000;
		var msg = limit === 3000 ? "%1 Commands used in total" : "%1 Commands were used in the top "+limit;
		var msg2 = limit === 3000 ? "Command Usage Statistics for "+servername+":" : "Command Usage Statistics for the top "+limit+":"
		botMessage(src,msg2,chan);

		var num = 0;
		for(var u = 0; u < cmdS.length; u++) {
		num++;
		if(num>limit) {
		break;
		}
		if(cmdS[u][0]=="startTime"||cmdS[u][0]=="lastCommandUse") {
		num--;
		continue;
		}
		botEscapeMessage(src,"#"+num+". Command "+cap(cmdS[u][0])+": "+cmdS[u][1]+", last used by "+cmdS[u][2],chan);
		totalstats+= cmdS[u][1];
		}

		botEscapeMessage(src,msg.format(totalstats),chan);
		if(commandStats.startTime == undefined) {
		commandStats.startTime = parseInt(sys.time())+1;
		}
		if(commandStats.lastCommandUse == undefined) {
		commandStats.lastCommandUse = parseInt(sys.time())+1;
		}
		botMessage(src,"Started counting command usage "+getTimeString(sys.time()*1-commandStats.startTime)+" ago. Last command used "+getTimeString(sys.time()*1-commandStats.lastCommandUse)+" ago.",chan);

		}

		initCommandStats();
		poGlobal = JSESSION.global();

		loadOldPoll = function() {
		if(typeof(Poll) == 'undefined') {
		Poll = {};
		Poll.mode = 0;
		Poll.votes = {};
		Poll.subject = "";
		Poll.starter = '';
		Poll.options = [];
		if(cache.get("Poll") != "") {
		try {
		Poll = JSON.parse(cache.get("Poll"));
		}
		catch(e){
		cache.remove("Poll");
		}
		}
		}
		}

		loadOldPoll();

		saveConfig = function() {
		cache.write(ConfigSaves[1],JSON.stringify(Config));
		}

		loadConfig = function() {

		if(Config === undefined)  {
		ConfigLoad();
		}

		if(cache.get(ConfigSaves[0]) != "" && ConfigSaves[0] != ConfigSaves[1])  {
		cache.remove(ConfigSaves[0]);
		}

		cache.save(ConfigSaves[1],JSON.stringify(Config));

		if(JSON.parse(cache.get(ConfigSaves[1])) !== Config) {
		Config = JSON.parse(cache.get(ConfigSaves[1]));
		}

		}

		loadConfig();
		importData();

		if(typeof DataHash.spammers == "undefined") {
		DataHash.spammers = {};
		}

		Clantag = {};
		Clantag.full = Config.ClanTag;
		Clantag.fullText = removespaces(Clantag.full.replace(/[\[\]\{\}]/gi,""));
		Clantag.fullTextLower = Clantag.fullText.toLowerCase();

		if(typeof channelData == 'undefined')
		run("channelload");

		createChannelData();

		delete ScriptLength_Full;
		delete ScriptLength_Lines;
		
		}
		,

		serverStartUp : function() { 
		startupTime = sys.time()*1;
		StartUp = true;
		script.beforeNewMessage("Script Check: OK");
		}
		,

		attemptToSpectateBattle:function(src, srcbattler, tarbattler) {
		var c = sys.channelIds(), b;
		for(b in c) {
		var chan = JSESSION.channels(c[b]);
		if(!chan.toursEnabled)
		continue;
		if(chan.tour.tourmode == 2&&chan.tour.finals) {
		botMessage(src,"Enjoy the finals of the "+chan.name+" Tournament!");
		return "allow"; // disallow specs :(
		}
		}
		}
		,

		beforeFindBattle: function (src) {
		var tier = sys.tier(src);
		var getColor = script.namecolor(src);
		sys.sendHtmlAll("<timestamp/><b>Find Battle</b> -- <font color="+getColor+"><b>"+sys.name(src)+": "+tier+"</b></font>", watch);
		print("Find Battle["+sys.name(src)+"] in tier "+tier);
		}
		,
		
		ScriptDataUpdater : function() {
		var date = String(new Date());
		if(typeof cache == 'undefined') {
		script.dataManagementLoad();
		}
		cache.write("Script_LastLoad",date);
		cache.save("Script_Registered",date);
		}
		,

		configload : function () {
		var conf = sys.getFileContent("config").split("\n");
		var x;
		var serv = new RegExp("server_name","g");
		servername = "";
		for (x in conf){
		if (serv.test(conf[x]) == true){
		servername = conf[x].substring(12,conf[x].length-1).replace(/\\xe9/i,"é");
		}
		}
		}
		,

		beforeChannelJoin : function(src, c) {
		if(JSESSION.users(src) == undefined)
		JSESSION.createUser(src);
		if(JSESSION.channels(c) == undefined)
		JSESSION.createChannel(c);
		
		var chan = JSESSION.channels(c);
		var srcname = sys.name(src).toLowerCase();
		var user = JSESSION.users(src);
		if((typeof(chan.chanAuth[srcname]) == 'undefined')
		||(typeof(chan.chanAuth[srcname]) == 'undefined'||chan.chanAuth[srcname] < sys.auth(src)&&sys.auth(src) != 0)
		||(typeof(chan.chanAuth[srcname]) == 'undefined'||chan.creator == srcname && chan.chanAuth[srcname] != 3)) {
		var has = false;

		if(sys.auth(src) == 0) {
		chan.changeAuth(srcname,0);
		has = true;
		}

		if(sys.auth(src) == 1) {
		chan.changeAuth(srcname,1);
		has=true;
		}

		if(sys.auth(src) == 2) {
		chan.changeAuth(srcname,2);
		has=true;
		}

		if(sys.auth(src) > 2||chan.creator === srcname && chan.creator !== '~Unknown~') {
		chan.changeAuth(srcname,3);
		has=true;
		}

		if(has) {
		updateChannelData(chan);
		}
		}

		if(chan.isChanMod(src)||(sys.auth(src) >= 1 && sys.auth(src) <= 2&&channel != scriptchannel)||sys.auth(src) > 3||DataHash.megausers[sys.name(src).toLowerCase()] != undefined&&c==staffchannel)
		return;

		var ip = sys.ip(src);
		if(chan.isBannedInChannel(ip)) {
		sys.stopEvent();
		prune_channel_bans(c);
		if(!chan.isBannedInChannel(ip)) {
		script.beforeChannelJoin(src,c);
		return;
		}
		var mute = chan.banlist[ip];
		var time = mute.time != 0 ? "Banned for "+getTimeString(mute.time-sys.time()*1) : "Banned forever";
		var by = mute.by;
		var why = mute.why;
		why += why[why.length-1] == "." ? "" : ".";
		botMessage(src, "You are banned in "+ChannelLink(sys.channel(c))+" by "+by+". Reason: "+why+" "+time+".");
		return;
		}

		if(c === 0) { 
		return; 
		}

		if (chan.private)  {
		botMessage(src,"Sorry, that channel is auth-only!");
		sys.stopEvent();
		return;
		}

		if ((c == watch||c==staffchannel)) {
		botMessage(src,"Sorry, the access to that channel is restricted!");
		sys.stopEvent();
		return;
		}

		if ((c == scriptchannel)) {
		botMessage(src,"Sorry, the access to that channel is restricted!");
		sys.stopEvent();
		return;
		}
		}
		,

		beforeChannelDestroyed : function(channel) {
		var ch = JSESSION.channels(channel);
		if (channel==trivia||channel == watch|| channel == scriptchannel || channel == staffchannel || channel==mafiachan||ch.perm) {
		sys.stopEvent();
		return;
		}
		updateChannelData(channel);
		sys.sendHtmlAll("<timestamp/><b>"+ChannelLink(sys.channel(channel))+"</b> -- <b>Channel destroyed</b>", watch);
		JSESSION.destroyChannel(channel);
		}
		,

		afterChannelCreated: function(chan, name, src) {
		if(JSESSION.channels(chan)==undefined)
		JSESSION.createChannel(chan); //:?
		
		loadChannelData(chan);

		var POChan = JSESSION.channels(chan);
		POChan.creator = src ? sys.name(src).toLowerCase() : "~Unknown~"
		if(src) {
		POChan.changeAuth(src,3);
		}

		}
		,
		removeMute:function(src,target,reason,c) {
		var theIP = sys.dbIp(target);
		var srcauth = sys.auth(src);
		var srcname = sys.name(src);

		if (theIP == undefined) {
		botMessage(src, "Null target!",c);
		return;
		}

		prune_mutes();
		if((!DataHash.mutes.hasOwnProperty(theIP))) {
		botMessage(src, "You cannot unmute a not muted player!",c);
		return;
		}
		botEscapeAll(target + " was unmuted by " + srcname+"!",0);

		if(!isEmpty(reason))
		botEscapeAll("Reason: " + reason,0);

		var all = idsOfIP(theIP);
		for(var z in all) {
		JSESSION.users(all[z]).muted = false;
		}

		delete DataHash.mutes[theIP];
		cache.write("mutes",JSON.stringify(DataHash.mutes));
		return;
		}
		,

		removeTempBan:function(src,target,reason,c) {
		var theIP = sys.dbIp(target);
		var srcauth = sys.auth(src);
		var srcname = sys.name(src);
		var tarid = sys.id(target);

		if (theIP == undefined) {
		botMessage(src, "Null target!",c);
		return;
		}

		prune_bans();
		if(!(DataHash.tempbans.hasOwnProperty(theIP))) {
		botMessage(src, "You cannot Unban a not Banned player!",c);
		return;
		}
		botEscapeAll(target + " was temp-unbanned by " + srcname+"!",0);

		if(!isEmpty(reason))
		botEscapeAll("Reason: " + reason,0);

		delete DataHash.tempbans[theIP];
		cache.write("tempbans",JSON.stringify(DataHash.tempbans));
		return;
		}
		,

		issueMute:function(src,target,reason,time,c) {
		var time = parseInt(time);
		var theIP = sys.dbIp(target);
		var srcauth = sys.auth(src);
		var srcname = sys.name(src);
		var tarid = sys.id(target);
		var POTarget = JSESSION.users(tarid);
		var now_time = sys.time()*1;

		if (theIP == undefined) {
		botMessage(src, "Null target!");
		return;
		}
		if (sys.maxAuth(theIP) >= srcauth &&srcauth < 3) {
		botMessage(src, "You dont have sufficient auth to mute " + target + ".",c);
		return;
		}

		prune_mutes();
		var oldtime = 0;
		if(DataHash.mutes.hasOwnProperty(theIP)) {
		oldtime = DataHash.mutes[theIP].time-now_time;
		}

		if(time == undefined||isNaN(time*60)) {
		botEscapeAll(target + " was muted by " + srcname+" forever!",0);

		if(!isEmpty(reason))
		botEscapeAll("Reason: " + reason,0);

		var all = idsOfIP(theIP);
		for(var z in all) {
		JSESSION.users(all[z]).muted = true;
		}

		var re = !isEmpty(reason) ? reason : "None";
		DataHash.mutes[theIP] = {by:sys.name(src),why:re,ip:theIP,time:0};
		return;
		}

		var timestr = getTimeString(time*60+oldtime);
		var thetime = now_time+time*60+oldtime;

		botEscapeAll(target + " was muted by " + srcname+" for "+timestr+"!",0);

		var re = !isEmpty(reason) ? reason : "None";
		if(!isEmpty(reason))
		botEscapeAll("Reason: " + reason,0);

		var all = idsOfIP(theIP);
		for(var z in all) {
		JSESSION.users(all[z]).muted = true;
		}

		DataHash.mutes[theIP] = {by:sys.name(src),why:re,ip:theIP,time:thetime};
		cache.write("mutes",JSON.stringify(DataHash.mutes));
		return;
		}
		,

		issueTempBan:function(src,target,reason,time,c) {
		var theIP = sys.dbIp(target);
		var srcauth = sys.auth(src);
		var srcname = sys.name(src);
		var tarid = sys.id(target);

		if (theIP == undefined) {
		botMessage(src, "Null target!");
		return;
		}
		if (sys.maxAuth(theIP) >= srcauth &&srcauth < 3) {
		botMessage(src, "You dont have sufficient auth to temp ban " + target + ".",c);
		return;
		}

		prune_bans();

		if(DataHash.tempbans.hasOwnProperty(theIP)) {
		botMessage(src, "You cannot Ban an already Banned player!",c);
		return;
		}

		if(time == undefined||isNaN(time*60)) {
		botMessage(src,"Specify time!",c);
		return;
		}
		if(time > 7200&&srcauth < 2) {
		botMessage(src,"You may only Ban for a maximum of 5 Days (7200 Minutes).",c);
		return;
		}
		time = time*60;
		var thetime = parseInt(sys.time())+time
		var thestr = thetime-sys.time();
		var timestr = getTimeString(thestr);

		botEscapeAll(target + " was banned by " + srcname+" for "+timestr+"!",0);

		reason = !isEmpty(reason) && reason != undefined ? reason : "None";
		if(!isEmpty(reason))
		botEscapeAll("Reason: " + reason,0);

		if(tarid != undefined) {
		kick(tarid);
		}
		else {
		aliasKick(theIP);
		}

		DataHash.tempbans[theIP] = {by:sys.name(src),why:rreason,ip:theIP,time:thetime};
		cache.write("tempbans",JSON.stringify(DataHash.tempbans));
		}
		,

		tAuth:function(src,tar,auth,time,chan) {
		var sa = sys.auth(src);
		var ta = sys.dbAuth(tar);
		var theIP = sys.dbIp(tar);
		auth = Math.round(auth);
		if(theIP == undefined) {
		botMessage(src,"Null target!",chan);
		return;
		}

		if(auth <= 0) {
		botMessage(src,"You cannot give "+UserName+" Authority to someone.",chan);
		return;
		}

		if(!sys.dbRegistered(tar)) {
		botMessage(src,"This player is not registered.",chan);
		if(sys.id(tar) != undefined) {
		botMessage(sys.id(tar),"Please register for Authority.");
		}
		return;
		}

		if(auth > 1&&sa == 2) {
		botMessage(src,"You cannot give any Authority higher than "+ModName+" to "+tar,chan);
		return;
		}

		if(auth > 3)
		auth = 4;

		if (sys.maxAuth(theIP) >= sa &&sa < 3||ta >= auth) {
		botMessage(src,"You cannot give "+authToString(auth)+" to "+tar+"!",chan);
		return;
		}

		if(isNaN(time*60)) {
		botMessage(src,"Specify valid time!",chan);
		return;
		}

		if(DataHash.tempauth[tar.toLowerCase()] != undefined) {
		botMessage(src,"This user already has tempauth.",chan);
		return;
		}

		var timey = getTimeString(time*60);

		botAll(sys.name(src)+" made "+tar+" "+authToString(auth)+" for "+timey+".",0);

		if(sys.id(tar) != undefined) {
		sys.changeAuth(sys.id(tar),auth);
		}

		sys.changeDbAuth(tar,auth);
		var correctCase = tar;
		tar = tar.toLowerCase();
		time = time*60;
		time += sys.time()*1;
		DataHash.tempauth[tar] = {'time':time,'role':auth,'name':correctCase,'oldauth':ta};
		cache.write("tempauths",JSON.stringify(DataHash.tempauth));
		}
		,

		step:function() {
		if(typeof RECOVERY != "undefined") {
		sys.callQuickly("RECOVERY();", 950); 
		}
		
		if(typeof cache == 'undefined'||typeof DataHash == 'undefined') {
		return;
		}

		/* if(typeof(trivCounter) == "undefined") {
		trivCounter = 0; 
		} */

		if(AutoStartTours) {
		if(typeof(tourCounter) == "undefined") {
		tourCounter = 0;
		}
		tourCounter += 1;
		if(tourCounter >= 60*5) {
		tourCounter = 0;
		var mainChan = JSESSION.channels(0);
		if(mainChan.toursEnabled&&mainChan.tour.tourmode == 0) {
		var tourTiers = ["Middle Cup","Wifi 1v1 CC","Clear Skies","Wifi UU","Wifi OU","DW OU","DW Ubers","Wifi Ubers","Clear Skies DW","Wifi LC","DW UU","CC 1v1","Challenge Cup"];

		var max = sys.numPlayers()+1;
		if(max > 31)
		max = 31;
		else if(max < 4)
		max = 4;

		if(max != 4) {
		var tourNumber = sys.rand(3,max);
		}
		else {
		var tourNumber = 3;
		}

		var tourTier = tourTiers[Math.round(Math.random()*tourTiers.length)];

		mainChan.tour.tournumber = tourNumber;
		mainChan.tour.tourtier = tourTier;
		mainChan.tour.battlemode = sys.rand(1, 7);

		mainChan.tour.prize = "";


		mainChan.tour.tourmode = 1;

		if(display == 1)
		{
		mainChan.tour.white();
		mainChan.tour.border();
		sys.sendHtmlAll("<timestamp/><b><font color=green>A Tournament was started by " + Config.Bot.bot + "</i>! </b></font>", 0);
		sys.sendHtmlAll("<timestamp/><b><font color=red>Players:</font></b> " + mainChan.tour.tournumber, 0);
		sys.sendHtmlAll("<timestamp/><b><font color=blue>Type:</b></font> "+mainChan.tour.identify(), 0);
		sys.sendHtmlAll("<timestamp/><b><font color=orange>Tier:</b></font> " + mainChan.tour.tourtier, 0);
		mainChan.tour.border();
		sys.sendHtmlAll("<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>",0);
		mainChan.tour.border();
		mainChan.tour.white();
		}

		else
		{
		DisableChatColorRandomizer(0);
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ "A Tournament was started by <b style='color:"+Config.Bot.botcolor+"'>"+Config.Bot.bot+"</i></b>!<br>"
		+ "<b>Players:</b> "+mainChan.tour.tournumber+" <br>"
		+ "<b>Type:</b> "+mainChan.tour.identify()+" <br>"
		+ "<b>Tier:</b> "+mainChan.tour.tourtier+" <br>"
		+ "Type <b style='color:green'>/Join</b> to join the Tournament!"
		+ "</center>"
		+ "<hr width='300'>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",0);
		}

		mainChan.tour.tourstarter = Config.Bot.bot+"</i>"
		}
		}
		}

		/*
		trivCounter += 1;
		if(typeof Trivia != "undefined") {
		if(!Trivia.isGameGoingOn()&&trivCounter >= 300) {
		Trivia.start();
		trivCounter = 0;
		}
		}
		*/

		if(typeof(mafia) == "undefined") {
		script.dataManagementLoad();
		}

		mafia.tickDown();
		
		if(typeof pruneTACounter == 'undefined')
		pruneTACounter = 0;
		
		pruneTACounter++;
		if(pruneTACounter >= 15) { // Do this every 15 seconds.
		prune_tempauth();
		pruneTACounter = 0;
		}
		
		}
		,

		testName:function(src,nomessage) {
		var name = sys.name(src);
		var ip = sys.ip(src);

		prune_bans();
		prune_rangebans();

		/* 
		// Disabled: some ISPs fail.
		// Uncomment to block most proxies (they return their ip instead of hostname)
		// Some ISPs fail however so you might lose people.
		
		try { // Old Servers
		sys.hostName(ip, function (r) {
		if(r == ip) {
		botAll('Player '+name+' with IP '+ip+' has attempted to enter the Server and failed. [Reason: Proxy]',watch);
		sys.kick(src);
		return true;
		}
		});
		} catch (e) {}
		*/
		
		if(sys.maxAuth(ip) <= 0) {
		var valrangebanlist = DataHash.rangebans;
		var i,i_l = 0;
		for(i in valrangebanlist) {
		var i_l = i.length;
		for(var xT = 0; xT < i_l; xT++) {
		if(i == sys.ip(src).substring(0,xT)) {
		if(!nomessage) {
		var time = DataHash.rangebans[i].time != 0 ? 'Banned for '+getTimeString(DataHash.rangebans[i].time-sys.time()*1) : "Banned forever";
		var by = DataHash.rangebans[i].by
		var why = DataHash.rangebans[i].why;

		botMessage(src,'Your RangeIP: '+i+' is banned by '+by+'. Reason: '+why+'. '+time+'!',0);
		botAll('Player '+name+' with RangeIP '+i+' has attempted to enter the Server and failed. [Reason: Rangebanned]',watch);
		}
		return true;
		}
		}
		}
		}

		if(typeof DataHash.tempbans[ip] != "undefined"&&sys.maxAuth(ip) < 1) {
		if(!nomessage) {
		var time = DataHash.tempbans[ip].time != 0 ? getTimeString(DataHash.tempbans[ip].time-sys.time()*1) : "forever";
		var reason = DataHash.tempbans[ip].why;
		var by = DataHash.tempbans[ip].by
		botMessage(src,"You are banned! By "+by+". Reason "+why+". For "+time+"!");
		botAll('Player '+sys.name(src)+' ('+sys.ip(src)+') has attempted to enter the Server and failed. [Reason: Tempbanned]',watch);
		}
		return true;
		}

		if(sys.auth(src) < 1) { // If player has no auth.
		try { // If no internet connection or old server
		sys.hostName(ip, function (anchorfree) {
		if(anchorfree.contains("anchorfree")) {
		if(!nomessage) {
		botMessage(src,"Change your IP. Don't use hotspot shield.");
		botAll('Player '+sys.name(src)+' ('+sys.ip(src)+') has failed to log in. [Reason: Hotspot Shield Proxy]',watch);
        }
		return true;
		}
		});
		}
		
		catch (e) {}
		}

		var cyrillic = /\u0408|\u03a1|\u0430|\u0410|\u0412|\u0435|\u0415|\u041c|\u041d|\u043e|\u041e|\u0440|\u0420|\u0441|\u0421|\u0422|\u0443|\u0445|\u0425|\u0456|\u0406/;
		var space = /\u0009-\u000D|\u0085|\u00A0|\u1680|\u180E|\u2000-\u200A|\u2028|\u2029|\u2029|\u202F|\u205F|\u3000/;
		var dash = /\u058A|\u05BE|\u1400|\u1806|\u2010-\u2015|\u2053|\u207B|\u208B|\u2212|\u2E17|\u2E1A|\u301C|\u3030|\u30A0|\uFE31-\uFE32|\uFE58|\uFE63|\uFF0D/;
		var greek = /\u03F3|\u0391|\u0392|\u0395|\u0396|\u0397|\u0399|\u039A|\u039C|\u039D|\u039F|\u03A1|\u03A4|\u03A5|\u03A7/;
		var armenian = /\u0555|\u0585/;
		var creek = /[\u0370-\u03ff]/;
		var special = /[\ufff0-\uffff]/;
		var other = /\u3061|\u65532/;
		var zalgo = /[\u0300-\u036F]/;
		var thai = /[\u0E00-\u0E7F]/;

		if (creek.test(name)
		||armenian.test(name)
		||dash.test(name)
		||space.test(name)
		||cyrillic.test(name)
		||greek.test(name)
		||special.test(name)
		||other.test(name)
		||zalgo.test(name)
		||thai.test(name)) {
		if(!nomessage) {
		botMessage(src,"You are using bad characters in your name.");
		botAll('Player '+sys.name(src)+' ('+sys.ip(src)+') has failed to log in. [Reason: Illegal Unicode characters]',watch);
		}
		return true;
		}


		if(name[0] == "S" && name[1] == "E" && name[2] == "N" && name[3] == "D"
		&& name[4] == "_") {
		return true;
		}

		return false;
		}
		,

		beforeChannelCreated : function(name,cid,src) {
		if(isOffensive(name,src)) {
		sys.stopEvent();
		return;
		}
		
		JSESSION.createChannel(cid);
		}
		,

		beforeLogIn: function (src) {
		script.hostAuth(src);
		DataHash.names[sys.ip(src)] = sys.name(src);
		DataHash.names[sys.name(src).toLowerCase()] = sys.name(src);

		cache.write("names",JSON.stringify(DataHash.names));

		var ban = sys.banList();

		for(var nam in ban) {
		var name = ban[nam];
		if(sys.dbIp(name) == sys.ip(src)) {

		if(isHost(src)) {
		sys.unban(name);
		return;
		}

		botAll('Player '+sys.name(src)+' ('+sys.ip(src)+') has attempted to enter the server and failed.<ping/> [Reason: Banned]',watch);
		botMessage(src,"You are banned!");
		sys.stopEvent();
		return;
		}
		}

		if(script.testName(src) == true) {
		sys.stopEvent();
		return;
		}
		}
		,

		beforeChannelLeave: function(src, channel) {
		var getColor = script.namecolor(src);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(channel))+"]Left Channel</b> -- <font color="+getColor+"><b>"+sys.name(src)+"</b></font>", watch);
		}
		,

		afterLogIn: function (src) { 
		var getColor = "'"+script.namecolor(src)+"'";
		var self = JSESSION.users(src);
		var srcToLower = sys.name(src).toLowerCase();
		sys.sendHtmlAll("<timestamp/><b>Logged in</b> -- <font color="+getColor+"><b>"+sys.name(src)+" ["+sys.ip(src)+"]</b></font>", watch);
		var temp = "";
		if(DataHash.tempauth[self.lowername] != undefined)
		temp = "[<b><font color=red>Temp</font></b>] ";

		else if(self.megauser&&sys.auth(src) < 1) {
		sendBotToAllBut(src,Tour1+" <b><font color=" + getColor + ">" + sys.name(src) + "</font></b> entered!",0);
		}

		else if (sys.auth(src) == 1) {
		sendBotToAllBut(src,temp+ModName+" <b><font color=" + getColor + ">" + sys.name(src) + "</font></b> entered!",0);
		}

		else if (sys.auth(src) == 2) {
		sendBotToAllBut(src,temp+AdminName+" <b><font color=" + getColor + ">" + sys.name(src) + "</font></b> entered!",0);
		}

		else if (sys.auth(src) == 3) {
		sendBotToAllBut(src,temp+OwnerName+" <b><font color=" + getColor + ">" + sys.name(src) + "</font></b> entered!",0);
		}

		botMessage(src, "Welcome, <b><font color=" + getColor + ">" + sys.name(src) + "</font></b>!</b>",0);

		botMessage(src,"Type in <b><font color=green>/Commands</font></b> to see the commands and <b><font color=green>/Rules</font></b> to see the rules.",0);

		if(sys.numPlayers() > maxPlayersOnline)
		maxPlayersOnline=sys.numPlayers();

		if (maxPlayersOnline > cache.get("MaxPlayersOnline"))
		cache.write("MaxPlayersOnline", maxPlayersOnline);

		botMessage(src,"Current number of players online is: <B>"+sys.numPlayers()+"</B>. Max number of players online was <B>" +maxPlayersOnline + "</B>.",0);

		if(typeof startupTime == 'number'&&startupTime != NaN) {
		botMessage(src,"The Server has been up for "+startUpTime()+".");
		}

		var srcname = sys.name(src), poChan = JSESSION.channels(0);

		var border = function() {
		return sys.sendHtmlMessage(src,tour,0);
		}
		var white = function() {
		return sys.sendMessage(src,"",0);
		}

		if (poChan.tour.tourmode == 1){

		white();
		border();
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=green>A Tournament was started by " + poChan.tour.tourstarter + "! </b></font>",0);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=red>PLAYERS:</font></b> " + poChan.tour.tournumber,0);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=blue>TYPE:</b></font> Single Elimination",0);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=orange>TIER:</b></font> " + poChan.tour.tourtier,0);

		if(!isEmpty(poChan.tour.prize)) {
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=brown>PRIZE:</b></font> "+poChan.tour.prize,0);
		}

		border();
		sys.sendHtmlMessage(src,"<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>",0);
		border();
		white();
		}

		else if (poChan.tour.tourmode == 2){
		white();
		border();
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=green>A Tournament was started by " + poChan.tour.tourstarter + "! </b></font>",0);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=red>Players:</font></b> " + poChan.tour.tournumber,0);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=blue>Type:</b></font> "+poChan.tour.identify(),0);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=orange>Tier:</b></font> " + poChan.tour.tourtier,0);
		if(!isEmpty(poChan.tour.prize)) {
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=brown>Prize:</b></font> "+poChan.tour.prize,0);
		}
		border();
		if(poChan.tour.remaining == undefined)
		poChan.tour.remaining = "Unknown";
		var _final = poChan.tour.finals ? " (<B>Finals</B>)" : ""

		sys.sendHtmlMessage(src,"<timestamp/>Currently in round "+poChan.tour.roundnumber+_final+". "+poChan.tour.remaining+" players remaining.",0);
		border();
		white();
		}
		sys.sendHtmlMessage(src,"",0);

		if(Config.AutoChannelJoin) {
		var ChanIds = [mafiachan,trivia];

		if(sys.auth(src) > 0||JSESSION.channels(watch).isChanMod(src)) {
		ChanIds.push(watch);
		}

		if(self.megauser||sys.auth(src) > 0||JSESSION.channels(staffchannel).isChanMod(src)) {
		ChanIds.push(staffchannel);
		}

		if (sys.auth(src) > 1||JSESSION.channels(scriptchannel).isChanMod(src)) {
		ChanIds.push(scriptchannel);
		}

		Channels.putInChannel([src],ChanIds);
		}

		prune_mutes();

		if(typeof DataHash.idles[srcToLower] != "undefined") {
		if(DataHash.idles[srcToLower].entry != "") {
		botAll(format("lvl2", DataHash.idles[srcToLower].entry),0);
		// prevent admins from inputting bad code at owner auto idle
		// for owners, it's too bad :p security comes first
		}
		sys.changeAway(src,true);
		}

		script.afterChangeTeam(src,true);
		}
		,
		afterChannelJoin : function(src, channel) {
		var getColor = script.namecolor(src);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(channel))+"]Joined Channel</b> -- <font color="+getColor+"><b>"+sys.name(src)+"</b></font>", watch);

		var chan = JSESSION.channels(channel);
		var srcname = sys.name(src).toLowerCase();
		var user = JSESSION.users(src);
		
		if(ChatColorRandomizers.hasOwnProperty(channel)) {
		var index = ChatColorRandomizers[channel];
		var code = '<center><hr width="150"/><b>Party Time!</b><hr width="150"/></center><div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 '+index.firstColor+', stop:1 '+index.secondColor+');">';

		sys.sendHtmlMessage(src, code, channel);
		}

		if (typeof (chan.topic) == 'undefined'||chan.topic == '') {
		chan.topic = "Welcome to "+ChannelLink(sys.channel(channel))+"!";
		chan.defaultTopic = true;
		updateChannelData(chan);
		}

        else {	
		var topic = chan.topic, tsetter = chan.topicsetter;
		var dbAuth = sys.dbAuth(tsetter);
		if(allowicon) {
		var auth = dbAuth == undefined ? "lvl0" : dbAuth;
		topic = format(auth, topic);
		if(dbAuth != undefined && dbAuth < 0)
		topic = html_escape(topic);
        }
		else {
		if(dbAuth != undefined && dbAuth < 0)
        topic = html_escape(topic);
        }
		sys.sendHtmlMessage(src, "<font color=orange><timestamp/><b>Welcome Message:</b></font> " + topic, channel);
		if(tsetter != '') {
		sys.sendHtmlMessage(src, "<font color=darkorange><timestamp/><b>Set By:</b></font> " + tsetter, channel);
		}
		}

		if(motd) {
		var MOTDSetter = cache.get("MOTDSetter");
		var MOTD = cache.get("MOTDMessage");

		sys.sendHtmlMessage(src,'<font color=red><timestamp/><b>Message Of The Day: </b></font>' + MOTD,channel);
		sys.sendHtmlMessage(src,'<font color=darkred><timestamp/><b>Set By: </b></font>' + MOTDSetter,channel);
		}

		else {
		sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day:</b></font> Enjoy your stay at '+servername+'!',channel);
		}

		if(chan.isChanMod(src)&&chan.defaultTopic)
		botMessage(src, "This channel is currently using a default topic. Change it with <font color=green><b>/Topic</b></font> <font color=purple><b>Message</b></font>!",channel);
		

		if(Poll.mode)
		botMessage(src,"A poll is going on! Use <font color=green><b>/viewpoll</b></font> for more information.",channel);

		if(chan.toursEnabled) {
		if(channel != 0) {

		var border = function() {
		return sys.sendHtmlMessage(src,tour,channel);
		}

		var white = function() {
		return sys.sendMessage(src,"",channel);
		}

		if (chan.tour.tourmode == 1){
		white();
		border();
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=green>A Tournament was started by " + chan.tour.tourstarter + "! </b></font>",channel);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=red>Players:</font></b> " + chan.tour.tournumber,channel);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=blue>Type:</b></font> "+chan.tour.identify(),channel);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=orange>Tier:</b></font> " + chan.tour.tourtier,channel);

		if(!isEmpty(chan.tour.prize)) {
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=brown>Prize:</b></font> "+chan.tour.prize,channel);
		}

		border();
		sys.sendHtmlMessage(src,"<timestamp/>Type <font color=green><b>/Join</b></font> to enter the tournament!</b></font>",channel);
		border();
		white();
		}

		else if (chan.tour.tourmode == 2){
		white();
		border();
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=green>A Tournament was started by " + chan.tour.tourstarter + "! </b></font>",channel);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=red>Players:</font></b> " + chan.tour.tournumber,channel);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=blue>Type:</b></font> "+chan.tour.identify(),channel);
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=orange>Tier:</b></font> " + chan.tour.tourtier,channel);
		if(!isEmpty(chan.tour.prize)) {
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=brown>Prize:</b></font> "+chan.tour.prize,channel);
		}
		border();

		var _final = chan.tour.finals ? " (<B>Finals</B>)" : ""
		if(chan.tour.remaining == undefined)
		chan.tour.remaining = "Unknown";

		sys.sendHtmlMessage(src,"<timestamp/>Currently in round "+chan.tour.roundnumber+_final+". "+chan.tour.remaining+" players remaining.",channel);
		border();
		white();
		}
		}
		}
		}
		,


		beforeNewMessage: function (message) { 
		if(message.substring(0,17) == "Script Warning in") {
		sys.stopEvent();
		return; }/*
		if(message.indexOf("Script Error line") != -1&&message.indexOf("[#") == -1) {
		sys.sendAll(message,watch); 
		return; }*/

		/* if(message == "Safe scripts setting changed") {
		if(message == "Logging changed") {
		if(message == "Proxy Servers setting changed") {
		if(message == "Low TCP Delay setting changed") {
		if(message == "Maximum Players Changed.") { */

		if(message == "Main channel name changed") {
		if(JSESSION.channels(0).defaultTopic||JSESSION.channels(0).topicsetter == '') {
		var update = function() {
		JSESSION.channels(0).topic = "Welcome to "+sys.channel(0)+"!";
		updateChannelData(0);
		}
		sys.delayedCall(update(),1); // since its before.
		}
		return;
		}

		if (message == "Script Check: OK") {
		script.dataManagementLoad();
		script.ScriptDataUpdater();
		ScriptUpdateMessage();
		
		delete RECOVERY_BACKUP;
		RECOVERY_BACKUP = {};
		for(var x in script)
		RECOVERY_BACKUP[x] = script[x];
		
		return; 
		}

		if(message == "Announcement changed.") {
		sys.stopEvent();
		sys.sendAll("~~Server~~: Announcement was changed.");
		return; }

		if(message == "The description of the server was changed.") {
		sys.stopEvent();
		sys.sendAll("~~Server~~: Description of the server was changed.");
		return; }

		if(message.substr(0, 33) == "The name of the server changed to"){
		servername = message.substring(34, message.lastIndexOf("."));
		return; }

		if(message.substr(0,11) == "~~Server~~:"&&Config.Server.Change) {
		sys.sendHtmlAll("<font color="+Config.Server.Color+"><timestamp/>"
		+ "<b>"+Config.Server.Name+":</b></font>"
		+ " "+html_escape(message.replace(/~~Server~~\:/,"")));
		sys.stopEvent();
		return;
		}

		if (message.substring(0,8) == "[#Watch]") {
		sys.stopEvent();
		return;
		}

		}
		,

		beforeChatMessage: function (src, message, chan) {
		if(chan == undefined)
		return;

        var host = isHost(src);
		var poChan = JSESSION.channels(chan);
		var poUser = JSESSION.users(src);
		var chatcolor = ChatColorRandomizers.hasOwnProperty(chan);
		var voice = poUser.voice || false;
		
		if(poUser.floodCount == 'kicked') {
		sys.stopEvent();
		return;
		}

		if(sys.auth(src) < 3) {
		script.hostAuth(src);
		}

		var getColor = script.namecolor(src);
		var channel = chan, ip = sys.ip(src);
		var srcname = sys.name(src);
		var ip = sys.ip(src);

		poUser.muteCheck();
		poUser.addFlood();

		if(poUser.floodCount >= 8) {
		sys.stopEvent();
		poUser.floodCount = 'kicked';

		if(DataHash.spammers[ip] == undefined) {
		DataHash.spammers[ip] = 0;
		}

		DataHash.spammers[ip] += 1;

		if(DataHash.spammers[ip] >=5) {
		var bantime = 60*60*24;
		var thetime = sys.time()*1 + bantime
		DataHash.tempbans[ip] = {"by":Config.Bot.bot+"</i>","why":"Spamming the chat","ip":ip,"time":thetime};
		cache.write("tempbans",JSON.stringify(DataHash.tempbans));
		botAll(sys.name(src)+" was banned for 1 day by "+Config.Bot.bot+"</i> for spamming",0);
		delete DataHash.spammers[ip];
		kick(src);
		return;
		}

		if(DataHash.spammers[ip] >=3&&DataHash.spammers[ip] < 5) {
		var bantime = 5*60*60;
		var thetime = sys.time()*1 + bantime
		DataHash.tempbans[ip] = {"by":Config.Bot.bot+"</i>","why":"Spamming the chat","ip":ip,"time":thetime};
		cache.write("tempbans",JSON.stringify(DataHash.tempbans));
		botAll(sys.name(src)+" was banned for 5 hours by "+Config.Bot.bot+"</i> for spamming",0);
		kick(src);
		return;
		}

		var mute = !poUser.muted ? " and muted for 5 minutes" : ""
		botEscapeAll(sys.name(src)+" was kicked"+mute+" for flood!",0);

		sys.callLater('if(DataHash.spammers['+ip+'] > 0) { DataHash.spammers['+ip+']--; }; else { delete DataHash.spammers['+ip+']; };',60*30);
		var bantime = 60*5;
		if(DataHash.mutes.hasOwnProperty(ip)) {
		if(DataHash.mutes[ip].time >= thetime) {
		bantime = 60*10;
		}
		}
		var thetime = sys.time()*1 + bantime;
		DataHash.mutes[ip] = {"by":Config.Bot.bot+"</i>","why":"Spamming the chat","ip":ip,"time":thetime};
		cache.write("mutes",JSON.stringify(DataHash.mutes));
		kick(src);
		return;
		}

		/*
		if(!sys.dbRegistered(srcname)) {
		if(poUser.lastMsg+2-sys.time()*1 > 0&&!poChan.isChanMod(src)&&sys.auth(src) < 1&&poUser.lastMsg != 0) {

		botMessage(src,"Please wait "+getTimeString(poUser.lastMsg+2-sys.time()*1)+" before talking again.",chan);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Halted Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);

		sys.stopEvent();
		return;
		} 
		}

		poUser.lastMsg = sys.time()*1; 
		*/

		var msg = message.toLowerCase();

		if(message.length>=parseInt(MaxMessageLength)&&sys.auth(src) < 1){
		botMessage(src,'You can\'t use that number of Characters in your Message. Maximum: '+MaxMessageLength+'. Current: '+message.length,chan);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Huge Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);
		print('Massive Message by '+sys.name(src)+': '+message);
		sys.stopEvent();
		return;
		}

		if ((sys.auth(src) <= 0 && muteall && !voice)) {
		sys.stopEvent();
		sendSTFUTruck(src,chan);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Silence Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);
		print("Silence Message["+sys.channel(chan)+"] -- "+sys.name(src)+": " + message);
		return;
		}

		if((!poChan.isChanMod(src)&&sys.auth(src) < 1 &&poChan.silence == 1 && !voice)) {
		sys.stopEvent();
		sendSTFUTruck(src,chan);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Silence Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);
		print("Silence Message["+sys.channel(chan)+"] -- "+sys.name(src)+": " + message);
		return;
		}

		if((!poChan.isChanAdmin(src)&&sys.auth(src) < 2&&poChan.silence == 2 && !voice)) {
		sys.stopEvent();
		sendSTFUTruck(src,chan);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Super Silence Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);
		print("Super Silence Message["+sys.channel(chan)+"] -- "+sys.name(src)+": " + message);
		return;
		}

		if ((sys.auth(src) < 2 && supermuteall)) {
		sys.stopEvent();
		sendSTFUTruck(src,chan);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Super Silence Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);
		print("Super Silence Message["+sys.channel(chan)+"] -- "+sys.name(src)+": " + message);
		return;
		}

		if ((sys.auth(src) < 3 && megamuteall)) {
		sys.stopEvent();
		sendSTFUTruck(src,chan);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Mega Silence Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);
		print("Mega Silence Message["+sys.channel(chan)+"] -- "+sys.name(src)+": " + message);
		return;
		}

		if((!poChan.isChanOwner(src)&&sys.auth(src) < 3&&poChan.silence == 3 && !voice)) {
		sys.stopEvent();
		sendSTFUTruck(src,chan);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Mega Silence Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);
		print("Mega Silence Message["+sys.channel(chan)+"] -- "+sys.name(src)+": " + message);
		return;
		}


		if (poUser.muted && !host) {
		prune_mutes();
		if(!DataHash.mutes.hasOwnProperty(ip)) {
		botMessage(src,"You are no longer muted.",chan);
		}
		else {
		sys.stopEvent();

		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Mute Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);

		print("Mute Message -- "+sys.name(src)+": " + message);

		var mute = DataHash.mutes[ip];
		var time = mute.time != 0 ? "Muted for "+getTimeString(mute.time-sys.time()*1) : "Muted forever";
		var by = mute.by+"</i>";
		var why = mute.why;
		why += why[why.length-1] == "." ? "" : "."

		botMessage(src, "You are muted by "+by+". Reason: "+why+" "+time+".",chan);
		return;
		}
		}

		if(poChan.isMutedInChannel(ip) && !host) {
		prune_channel_mutes(chan);
		if(!poChan.isMutedInChannel(ip)) {
		botMessage(src,"You are no longer muted in "+sys.channel(chan)+".",chan);
		}
		else {
		sys.stopEvent();
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Channel Mute Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);
		print("Mute Message("+sys.channel(chan)+") -- "+sys.name(src)+": " + message);

		var mute = poChan.mutelist[ip];
		var time = mute.time != 0 ? "Muted for "+getTimeString(mute.time-sys.time()*1) : "Muted forever";
		var by = mute.by;
		var why = mute.why;
		why += why[why.length-1] == "." ? "" : "."

		botMessage(src, "You are muted in "+sys.channel(chan)+" by "+by+". Reason: "+why+" "+time+".",chan);
		return;
		}
		}

		if(allowicon&&typeof(allowicon) != 'undefined') {
		var auth = sys.auth(src);
		var rankico = '';
		if(!isEmpty(poUser.icon)) {
		rankico = poUser.icon;
		}
		else if(auth === 3) {
		rankico = Icons.owner;
		}
		else if(auth === 2) {
		rankico = Icons.admin;
		}
		else if(auth === 1) {
		rankico = Icons.mod;
		}
		else {
		rankico = Icons.user;
		}
		}

		if(allowedit&&!hasCommandStart(message)) {
		if(message.length > 2) {
		message = message[0].toUpperCase()+message.substring(1);
		}
		if(message.length > 3) {
		var lastmsg = message.charAt(message.length-1);
		if (/[a-zA-Z]/.test(lastmsg)) {
		message += '.';
		}
		}
		}

		if(allowicon && typeof(allowicon) != 'undefined') {
		var namestr = '<font color='+script.namecolor(src)+'><timestamp/><b>'+rankico+html_escape(sys.name(src))+':</font></b> '+format(src, html_escape(message))
		}
		
		if(chatcolor) {
		var msg = allowicon ? format(src, html_escape(message)) : html_escape(message);
		var rankicon = typeof rankico != 'undefined' ? rankico : sys.auth(src) > 0 && sys.auth(src) < 4 ? "+<i>" : "";
		var fnt = RandFont();
		var namestr = '<font color='+script.namecolor(src)+' face="'+fnt+'"><timestamp/><b>'+rankicon+html_escape(sys.name(src))+':</font></b></i> <font face="'+fnt+'">'+msg;
		}
		
		if (hasCommandStart(message)&& message.length > 1) {
		sys.stopEvent();

		var channel=chan;
		var command, commandData = "", mcmd = [""], tar = undefined, cmdData = "", dbIp = 0, dbAuth = 0;
		var pos = message.indexOf(' ');

		if(pos != -1) {
		command = message.substring(1, pos).toLowerCase();

		commandData = message.substr(pos+1);
		cmdData = commandData.toLowerCase();
		mcmd = commandData.split(':');
		dbIp = sys.dbIp(mcmd[0]);
		dbAuth = sys.dbAuth(mcmd[0]);
		tar = sys.id(mcmd[0]);
		}
		else {
		command = message.substring(1).toLowerCase();
		}

		if(typeof PointerCommands != 'undefined') {
		if(command in PointerCommands) {
		command = PointerCommands[command];
		}
		}

		if(command != "spam"&&command != "sendmail") {
		print("Command -- " + sys.name(src) + ": " + message);
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Command</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);
		}

		poTarget = JSESSION.users(tar);

		if(chan==mafiachan){
		try {
		mafia.handleCommand(src,message.substr(1));
		return;
		}

		catch(err){
		if(err!="no valid command"){

		botEscapeAll(FormatError("A mafia error has occured.",err),mafiachan);

		mafia.endGame(0);
		if(mafia.theme.name != "default") {
		mafia.themeManager.disable(0,mafia.theme.name);
		}

		return;
		}
		}
		}

		var userCommands = new Object();
		var tourCommands = new Object();
		var channelCommands = new Object();
		var modCommands = new Object();
		var adminCommands = new Object();
		var ownerCommands = new Object();

		if(typeof Command_Templater == 'undefined'||typeof Table_Templater == 'undefined'||typeof Templater == 'undefined') {
		run("templaterload") }

		/* -- User Commands: Start */
		userCommands = ({
		/* -- User Templates: Commands */
		commands: function () {

		var ct = new Command_Templater('Commands');
		ct.register("arglist","Displays the Argument meanings.");
		ct.register("usercommands","Displays the "+UserName+" commands.");
		ct.register("pointercommands","Displays the Pointer commands.");
		ct.register("messagecommands","Displays the Messaging commands.");
		ct.register("stylecommands","Displays the Style commands.");
		ct.register("iconcommands","Displays the Rank Icon commands.");
		ct.register("channelcommands","Displays the Channel commands.");
		if(poChan.toursEnabled)
		ct.register("tourcommands","Displays the Tournament commands.");
		ct.register("triviacommands","Displays the Trivia Commands.");
		if (!noPermission(src,1))
		ct.register(removespaces(ModName).toLowerCase()+"commands","Displays the "+ModName+" commands.");
		if (!noPermission(src,2))
		ct.register(removespaces(AdminName).toLowerCase()+"commands","Displays the "+AdminName+" commands.");
		if (!noPermission(src,3))
		ct.register(removespaces(OwnerName).toLowerCase()+"commands","Displays the "+OwnerName+" commands.");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		funcommands: function () {
		var ct = new Command_Templater('Fun Commands');
		ct.register("roulette","Win a randon Pokemon!");
		ct.register("catch","Catch a random Pokemon!");
		ct.register('attack',['{p Thing}'],'Attack something with a random Attack!');
		ct.register("future", ["{o Time}", "{p Message}"], "Sends a message into the future! Time must be over 4 seconds and under 5 hours. Message can also be a command(with command start).");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		stylecommands: function () {
		var ct = new Command_Templater('Style Commands',true);
		ct.span("Style "+UserName+" Commands");
		ct.register("styles", "Displays all Style Names.");
		ct.register("styleinfo", "Displays full information about Styles.");

		if(!noPermission(src,1)) {
		ct.span("Style "+ModName+" Commands");
		ct.register("loadstyle",["{p URL}"],"Loads a style from the Web.");
		}
		if(!noPermission(src,2)) {
		ct.span("Style "+AdminName+" Commands");
		ct.register("mainstyle", ["{p Style}"], "Makes a Style the Main. (Current Style is "+style.name+")");
		}
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		iconcommands: function () {
		var ct = new Command_Templater('Rank Icon Commands',true);
		ct.span("Rank Icon "+UserName+" Commands");
		ct.register("icons", "Displays all Rank Icon Names.");
		ct.register("iconinfo", "Displays full information about Rank Icons.");
		ct.register("changeicon", ["{p Icon}"], "Changes your Icon. If Icon is remove, removes your Icon.");

		if(!noPermission(src,1)) {
		ct.span("Rank Icon "+ModName+" Commands");
		ct.register("loadicons",["{p URL}"],"Loads Rank Icons from the Web.");
		}
		if(!noPermission(src,2)) {
		ct.span("Rank Icon "+AdminName+" Commands");
		ct.register("mainicon", ["{p Name}"], "Makes a Rank Icons List the Main. (Current Rank Icons List is "+Icons.name+")");
		}
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		triviacommands : function () {
		var ct = new Command_Templater('Trivia Commands',true);
		ct.span("Trivia "+UserName+" Commands");

		if(Trivia.TrivData.mode) {
		ct.register("a", ["{p Answer}"], "Answer on a trivia session.", chan);
		}

		ct.register("leaderboard", ["{or Player}"], "Displays the entire Trivia Leaderboard or just Leaderboard Info on 1 player.");

		var s = noPermission(src,1) ? ")" : ", answer(s))";
		ct.register("question", ["{p Question}"],"Displays a question's data(Question, hint"+s);
		ct.register("submit", ["{p Question}","{p Hint}","{p Answers}"], "Submit a question. Use '|' to serperate new answers.");
		ct.register("questions","Displays all questions names.");

		if (!noPermission(src,1)) {
		ct.span("Trivia "+ModName+" Commands");

		ct.register("start", "Start a Trivia session.");
		ct.register("end", "Ends a Trivia session.");
		ct.register("skip", "Skips the current Trivia round.");
		ct.register("remove", ["{p Question}"], "Deletes a question.");
		}

		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		messagecommands: function () {
		var ct = new Command_Templater('Messaging Commands',true);
		ct.span("Messaging "+UserName+" Commands");
		ct.register("me", ["{p Message}"], "Sends a message to everyone with *** infront while using BBCode.");

		if (!noPermission(src,1)) {
		ct.span("Messaging "+ModName+" Commands");
        ct.register("htmlme", ["{p Message}"], "Sends a message to everyone with *** infront while using HTML.");
		ct.register("sendall", ["{p Message}"], "Sends a message to everyone.");
		ct.register("wall", ["{p Message}"], "Announces something.");
		ct.register("htmlwall", ["{p Message}"], "Announces something with HTML.");
		}

		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		mailcommands: function () {
		var ct = new Command_Templater('Mail Commands');
		ct.register('deletemail','Deletes all your mail.');
		ct.register('readmail','Displays your mail.');
		ct.register('sendmail', ["{or Person}","{p Title}","{p Text}"], "Sends mail to someone! Text and Title may contain BB Code.", chan);
		ct.register('deletesend', 'Removes all your send mails.');
		ct.register('sendmails', 'Displays your send mails.');
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		infocommands: function () {
		var ct = new Command_Templater('Information Commands');

		ct.register('team','Makes an importable of your team.');
		ct.register("ranking", ["<u>{r Person}</u>"],"Displays ranking stats of you or another Player.");
		ct.register('players','Displays Information of Players Online and Number of Players online.');
		ct.register("tours","Displays Information of Tournaments existing and Number of existing Tournaments.");
		ct.register('channels','Displays Information of Channels exisiting and Number of Channels existing.');
		ct.register("authlist", "Displays Server Authority.");
		ct.register("tourauthlist","Displays Server Tournament Authority.");
		ct.register("autoidles", "Displays Auto Idles.");
		ct.register("voices", "Displays Voices");
		ct.register("rules", "Displays Server Rules.");
		ct.register('league','Displays League Members.');
		ct.register('scriptinfo', 'Displays Script Information.');
		ct.register('settings', 'Displays Script Settings.');
		ct.register('money', ["<u>{or User}</u>"], "Displays someones Money. If no user is specified or is invalid, displays your money.");
		ct.register('viewmotd','Displays the Message of the Day.');
		ct.register("pokedex", ["{p Pokemon}/{b Pokenum}"], "Displays Information about Pokemon.");
		ct.register('commandstats', ["<u>{o Number}</u>"], 'Displays Command Statistics. You can also view the most (number) used commands.');

		ct.register("bbcodes", "Displays usable BB Codes for your Auth Level.");

		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		/* -- User Templates: Normal */

		arglist: function () {
		var arg = function(c,m) {
		return "<font color="+c+"><b>"+c+"</b></font> colored arguments: "+m+".";
		}

		var t = new Templater('Argument List');
		t.register("Arguments are used in <b>almost every</b> command list.");
		t.register("These are their descriptions:<br/>");

		t.register(arg("red","Specify an online player"));
		t.register(arg("orangered","Specify an online player or one in the Members Database"));
		t.register(arg("orange","Specify a number"));
		t.register(arg("purple","Specify some text"));
		t.register(arg("blue","Select one of the given choices"));
		t.register(arg("green","Specify a player in the channel's tournament")+"<br/>");
		t.register("Any argument containing an <u>underline</u> is optional.");
		t.register(style.footer);

		t.render(src,chan);
		}
		,

		bbcodes: function () {
		var formatBB = function(m) {
		return "• "+m+" <b>-</b> "+format(0, m)
		}
		var formatEvalBB = function (m, code) {
		return "• "+m+" <b>-</b> "+eval(code);
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
		t.register("• [servername]Server Name in bold - "+servername.bold())
		t.register("• [time]A timestamp - <timestamp/>");
		
		if(!noPermission(src,1)) {
		t.register(formatBB("[pre]Preformatted text[/pre]"))
		t.register(formatBB("[size=5]Any size[/size]"))
		t.register("• [br]Skips a line");
		t.register("• [hr]Makes a long, solid line - <hr>");
		t.register("• [ping]Pings everybody");
		}
		
		if(!noPermission(src,3) && !evallock || host) {
		t.register(formatEvalBB("[eval]sys.name(src)[/eval]", "sys.name(src)"));
        }
		
		t.register(style.footer);
		t.render(src,chan);
		}
		,

		pokedex: function () { /* The display function uses Templater... */
		if(sys.pokeNum(commandData) == undefined) {
		commandData = parseInt(commandData);
		if(sys.pokemon(commandData) != undefined) {
		commandData = sys.pokemon(commandData);
		}
		}
		else {
		commandData = sys.pokemon(sys.pokeNum(commandData)); // Correcting case.
		}

		try {
		pokedex(src,chan,commandData);
		}
		catch(e) {
		var rand = randPoke(), rands = rand[rand.length-1] == "s" ? rand+"'" : rand+"'s";
		commandData = rand;
		botMessage(src,"Since the Pokemon or Pokenum doesn't exist, the Pokedex displayed "+rands+" data instead.",chan);
		pokedex(src,chan,commandData);
		}
		}
		,

		channels: function () {
		var channels = sys.channelIds().sort(function(a, b) {
		return a-b; });
		var t = new Templater('Channels');
		t.register("<i>Information works in the following way:</i> <br><b>Name</b> [<font color=green><b>ID</font></b>/<b><font color=blue>NumPlayers of <b><u>Name</u></b></font></b></font></b>]<br>");

		for(var x in channels) {
		var pl = sys.playersOfChannel(channels[x]).length;
		t.register("<b>"+ChannelLink(sys.channel(chan))+"</b> [<b><font color=green>"+channels[x]+"</b></font>/<b><font color=blue>"+pl+"</font></b>]");
		}

		t.register("<br><b><font color=blueviolet>Total Number of Channels:</b></font> "+channels.length);
		t.register(style.footer);
		t.render(src,chan);
		}
		,

		players: function () {
		var members = sys.playerIds().sort(function(a, b) {
		return a-b; }), st, u;
		var t = new Templater('Players');
		t.register("<i>Information works in the following way:</i> <br>AuthIcon <font color="+script.namecolor(src)+"><b>Name</b></font> [<font color=green><b>Status</b></font>/<font color=blue><b>PlayerID</b></font>/<font color=red><b>NumChannels of <u>Name</u></b></font></font>]<br>");

		for(x in members) {
		u = members[x];
		if(sys.away(u)) {
		st = 'Idle';
		}

		else if(sys.battling(u))  {
		st = 'Battling';
		}

		else {
		st = 'Active';
		}


		t.register(AuthIMG(u)+" <font color="+script.namecolor(u)+"><b>"+sys.name(u)+"</b></font> [<font color=green><b>"+st+"</b></font>/<font color=blue><b>"+u+"</font></b>/<font color=red><b>"+sys.channelsOfPlayer(u).length+"</b></font>] ");
		}

		t.register("<br><b><font color=blueviolet>Total Number of Players:</b></font> "+sys.numPlayers());
		t.register(style.footer);
		t.render(src,chan);
		}
		,

		tours: function () {
		var sess, ids = sys.channelIds().sort(function(a, b) {
		return a-b; }), x, count = 0;
		var mode, prize, round;
		var t = new Templater('Tournaments');
		t.register("<i>Information works in the following way:</i> <br><b>Channel</b> Status [<font color=green><b>Number of Entrants</b></font>/<font color=blue><b>Round</b></font>/<font color=red><b>Number of Players Remaining</b></font>/<font color=purple><b>Prize</b></font>]<br>");
		for(x in ids) {
		sess = JSESSION.channels(ids[x]);
		if(!sess.toursEnabled)
		continue;
		sess = sess.tour;
		if(sess.tourmode == 0)
		continue;
		if(sess.remaining == undefined)
		sess.remaining = "Unknown";
		mode = sess.tourmode == 1 ? "In Signups" : "Running";
		prize = isEmpty(sess.prize) ? "None" : sess.prize;
		round = sess.roundnumber ? sess.roundnumber : "1";
		t.register(ChannelLink(sys.channel(ids[x])).bold()+" "+mode+" [<font color=green><b>"+sess.tournumber+"</b></font>/<font color=blue><b>"+round+"</b></font>/<b><font color=blue>"+sess.remaining+"</font></b>/<font color=purple><b>"+prize+"</b></font>]");
		count++;
		}

		t.register("<br><b><font color=blueviolet>Total Number of Tournaments:</b></font> "+count);
		t.register(style.footer);
		t.render(src,chan);
		}
		,

		league: function () {
		var t = new Templater('League');

		t.span('Gym Leaders');

		var id, get, online, cha = DataHash.league.Champion, gyms0 = true, elite0 = true;

		if(objLength(DataHash.league.gym) > 0) {
		DataHash.league.gym = sortHash(DataHash.league.gym);
		gyms0 = false;
		}

		if(objLength(DataHash.league.elite) > 0) {
		DataHash.league.elite = sortHash(DataHash.league.elite);
		elite0 = false;
		}

		for(var g in DataHash.league.gym) {
		get = DataHash.league.gym[g];
		id = sys.id(get);
		online = id ? "<small>[<font color='green'>Online</font>]</small>"
		: "<small>[<font color='red'>Offline</font>]</small>";
		t.register("<b><font color="+script.namecolor(id)+">" + get + ":</b></font> Gym Leader #"+g+" "+online);
		}

		if(!gyms0) {
		t.register("");
		}

		t.span("Elite Four");

		for(var i in DataHash.league.elite) {
		get = DataHash.league.elite[i];
		id = sys.id(get);
		online = id ? "<small>[<font color='green'>Online</font>]</small>"
		: "<small>[<font color='red'>Offline</font>]</small>";
		t.register("<b><font color="+script.namecolor(id)+">" + get + ":</b></font> Elite Four #"+i+" "+online);
		}

		if(!elite0) {
		t.register("");
		}

		t.span("Champion");

		if (!isEmpty(cha)) {
		id = sys.id(cha);
		online = id ? "<small>[<font color='green'>Online</font>]</small>"
		: "<small>[<font color='red'>Offline</font>]</small>";
		t.register("<b><font color="+script.namecolor(id)+">" + cha + ":</b></font> Champion "+online);
		}

		t.register(style.footer);
		t.render(src,chan);
		}
		,


		scriptinfo: function () {
		var user = Object.keys(userCommands).sort();
		user.join(",  ");
		var tour = Object.keys(tourCommands).sort();
		tour.join(",  ");
		var channel = Object.keys(channelCommands).sort();
		channel.join(",  ");
		var mod = Object.keys(modCommands).sort();
		mod.join(",  ");
		var admin = Object.keys(adminCommands).sort();
		admin.splice(admin.indexOf("spam"),1);
		admin.join(",  ");
		var owner = Object.keys(ownerCommands).sort();
		owner.join(",  ");

		var tourlength = Object.keys(tourCommands).length;
		var userlength = Object.keys(userCommands).length;
		var chanlength = Object.keys(channelCommands).length;
		var modlength = Object.keys(modCommands).length;
		var adminlength = Object.keys(adminCommands).length-1;
		var ownerlength = Object.keys(ownerCommands).length;

		var t = new Templater('Script Information');
		t.register("Script Version: "+ScriptVersion.toString().bold());
		t.register("Server Version: <b>"+sys.serverVersion()+"</b><br/>");
		t.register("<font size=5><b>Commands</b></font><br/>");
		t.register("<font size=4 color=green><b>"+UserName+" Commands</b></font>");
		t.register("<b><small>"+user+".</b></small>");
		t.register("<b>User Commands Total:</b> "+userlength+"<br/>");
		t.register("<font size=4 color=purple><b>Channel Commands</b></font>");
		t.register("<b><small>"+channel+".</b></small>");
		t.register("<b>Channel Commands Total:</b> "+chanlength+"<br/>");
		t.register("<font size=4 color=darkred><b>Tournament Commands</b></font>");
		t.register("<b><small>"+tour+".</b></small>");
		t.register("<b>Tournament Commands Total:</b> "+tourlength+"<br/>");
		t.register("<font size=4 color=blue><b>"+ModName+" Commands</b></font>");
		t.register("<b><small>"+mod+".</b></small>");
		t.register("<b>Moderator Commands Total:</b> "+modlength+"<br/>");
		t.register("<font size=4 color=orange><b>"+AdminName+" Commands</b></font>");
		t.register("<b><small>"+admin+"</b></small>");
		t.register("<b>Administrator Commands Total:</b> "+adminlength+"<br/>");
		t.register("<font size=4 color=red><b>"+OwnerName+" Commands</b></font>");
		t.register("<b><small>"+owner+"</b></small>");
		t.register("<b>Owner Commands Total:</b> "+ownerlength+"<br/>");

		var cmdtotal = ownerlength+tourlength+modlength+adminlength+userlength+chanlength*1;

		t.register("<font size=4><b>Commands Total:</b> "+cmdtotal+"</font><br>");

		var scri = Object.keys(script);
		var fu = String(scri).replace(/,/g,', ');

		t.register("<font size=5><b>Events</b></font><br/>");
		t.register("<b><small>"+fu+".</b></small>");
		t.register("<b>Events Total:</b> "+scri.length+"<br>");

		var objvar = [], boolvar = [], strvar = [], numvar = [], funvar = [];
		var objstr = "", boolstr = "", strstr = "", numstr = "", funstr = "";
		var nullstr = "", nullvar = [], arrvar = [], arrstr = "";
		
		var vars = this;

		for(var i in vars) {
		var y = vars[i];
		if(typeof y === "boolean") {
		boolvar.push(i);
		}
		if(typeof y === "number") {
		numvar.push(i);
		}
		if(typeof y === "string") {
		strvar.push(i);
		}
		if(y instanceof Object && typeof y !== "function") {
		objvar.push(i);
		}
		if(typeof y === "function") {
		funvar.push(i);
		}
		if(y === null) {
		nullvar.push(i);
		}
		if(y instanceof Array) {
		arrvar.push(i);
		}
		}

		boolvar.sort();
		numvar.sort();
		strvar.sort();
		objvar.sort();
		funvar.sort();
		nullvar.sort();
		arrvar.sort();

		t.register("<font size=5><b>Global Variables</b></font><br>");
		t.register("<font size=4 color=red><b>String Variables</b></font>");

		for(var y in strvar) {
		strstr += "<font size=2><b>"+strvar[y]+", </b></font>";
		}

		if(strstr != "")
		t.register(strstr)
		t.register("<b>String Variables Total:</b> "+strvar.length+"<br>");
		t.register("<font size=4 color=blue><b>Number Variables</b></font>");

		for(var y in numvar) {
		numstr += "<font size=2><b>"+numvar[y]+", </b></font>";
		}

		if(numstr != "")
		t.register(numstr)
		t.register("<b>Number Variables Total:</b> "+numvar.length+"<br>");
		t.register("<font size=4 color=purple><b>Boolean Variables</b></font>");

		for(var y in boolvar) {
		boolstr += "<font size=2><b>"+boolvar[y]+", </b></font>";
		}

		if(boolstr != "")
		t.register(boolstr)
		t.register("<b>Boolean Variables Total:</b> "+boolvar.length+"<br>");
		t.register("<font size=4 color=orange><b>Object Variables</b></font>")

		for(var y in objvar) {
		objstr += "<font size=2><b>"+objvar[y]+", </b></font>";
		}

		if(objstr != "")
		t.register(objstr);
		t.register("<b>Object Variables Total:</b> "+objvar.length+"<br>");
		t.register("<font size=4 color=midnightblue><b>Array Variables</b></font>")

		for(var y in arrvar) {
		arrstr += "<font size=2><b>"+arrvar[y]+", </b></font>";
		}

		if(arrstr != "")
		t.register(arrstr);
		t.register("<b>Array Variables Total:</b> "+arrvar.length+"<br>");
		t.register("<font size=4 color=grey><b>Null Variables</b></font>");

		for(var y in nullvar) {
		nullstr += "<font size=2><b>"+nullvar[y]+", </b></font>";
		}

		if(nullstr != "")
		t.register(nullstr);
		t.register("<b>Null Variables Total:</b> "+nullvar.length+"<br>");
		t.register("<font size=4 color=green><b>Function Variables</b></font>");

		for(var y in funvar) {
		funstr += "<font size=2><b>"+funvar[y]+", </b></font>";
		}

		if(funstr != "")
		t.register(funstr);
		t.register("<b>Function Variables Total:</b> "+funvar.length+"<br>");
		t.register("<b><font size=4>Global Variables Total:</b> "+Object.keys(this).length+"</font>");
		t.register("");

		var servscript = sys.getFileContent("scripts.js");
		if(typeof ScriptLength_Lines == 'undefined') {
		ScriptLength_Lines = servscript.split("\n").length;
		}

		if(typeof ScriptLength_Full == 'undefined') {
		ScriptLength_Full = servscript.length;
		}

		t.register("<b><font size=4 color=forestgreen>Characters:</b></font> Estimated "+ScriptLength_Full);
		t.register("<b><font size=4 color=darkblue>Lines:</b></font> "+ScriptLength_Lines+"<br/>");
		t.register("<font color=green><b>Script:</b></font> © TheUnknownOne: <a href='http://pastebin.com/raw.php?i=JxBxLdQt'>http://pastebin.com/raw.php?i=JxBxLdQt</a></font>");
		// t.register("<small><font color=blue><b>Auto Update Script:</b></font> © TheUnknownOne: <a href='http://pastebin.com/raw.php?i=x9xSx0t8'>http://pastebin.com/raw.php?i=x9xSx0t8</a></font></small>");
		t.register("<font color=blue><b>Script Installer:</b></font> © TheUnknownOne: <a href='http://pastebin.com/raw.php?i=f4HNtphA'>http://pastebin.com/raw.php?i=f4HNtphA</a><br/>");

		t.register("<b>Script Registered Date:</b></font> "+cache.get("Script_Registered"));
		t.register("<b>Script Last Loaded Date:</b></font> "+cache.get("Script_LastLoad"));
		
		t.register("<br/>Created and Maintained by <b>TheUnknownOne</b>.");
        t.register("Credit to <b>Lutra</b> and <b>Intel_iX</b>.");
		t.register("Special Thanks to <b>Lamperi</b> and <b>Mystra</b>.");
		t.register("Styles and Rank Icons created by <b>TheUnknownOne</b>, <b>Lutra</b>, <b>Intel_iX</b>, <b>person6445</b>, <b>Rigas</b>.");
		t.register("<br/>This script is available under the <a href='http://creativecommons.org/licenses/by-nc-sa/3.0/'>Creative Commons Attribution-ShareAlike License 3.0</a>.");
	    t.register("<small>Thanks to the PO Dev Team for making Pokemon Online!</small>");	
		t.register(style.footer);
		t.render(src,chan);
		}
		,

		settings: function () {
		var t = new Templater('Script Settings');

		var g = function(str) {
		return "<font color='green'><b>"+str+"</b></font>";
		}

		var r = function(str) {
		return "<font color='red'><b>"+str+"</b></font>";
		}

		if(AutoStartTours)
		t.register("AutoStartTours is "+g("on")+".");
		else
		t.register("AutoStartTours is "+r("off")+".");

		if(allowedit)
		t.register("Grammar Editor is "+g("on")+".");
		else
		t.register("Grammar Editor is "+r("off")+".");

		if(allowicon)
		t.register("Rank Icons and BBCode are "+g("on")+".");
		else
		t.register("Rank Icons and BBCode are "+r("off")+".");

		if(evallock)
		t.register("Eval and Runtime are "+g("locked")+".");
		else
		t.register("Eval and Runtime are "+r("not locked")+".");

		if(implock)
		t.register("Impersonation for "+sLetter(UserName)+" is "+g("blocked")+".");
		else
		t.register("Impersonation for "+sLetter(UserName)+" is "+r("not blocked")+".");

		if(CommandsEnabled.me)
		t.register("Me is "+g("on")+".");
		else
		t.register("Me is "+r("off")+".");

		if(CommandsEnabled._catch_)
		t.register("Catch is "+g("on")+".");
		else
		t.register("Catch is "+r("off")+".");

		if(CommandsEnabled.roulette)
		t.register("Roulette is "+g("on")+".");
		else
		t.register("Roulette is "+r("off")+".");

		if(CommandsEnabled.attack)
		t.register("Attack is "+g("on")+".");
		else
		t.register("Attack is "+r("off")+".");

		if(muteall)
		t.register("Silence is "+g("on")+".");
		else
		t.register("Silence is "+r("off")+".");

		if(supermuteall)
		t.register("Super Silence is "+g("on")+".");
		else
		t.register("Super Silence is "+r("off")+".");

		if(megamuteall)
		t.register("Mega Silence is "+g("on")+".");
		else
		t.register("Mega Silence is "+r("off")+".");

		t.register("Server Auth Level 0 Name is "+UserName.bold().fontcolor("green")+".");
		t.register("Server Auth Level 1 Name is "+ModName.bold().fontcolor("blue")+".");
		t.register("Server Auth Level 2 Name is "+AdminName.bold().fontcolor("orange")+".");
		t.register("Server Auth Level 3 Name is "+OwnerName.bold().fontcolor("red")+".");
		t.register("Server Auth Level 4 Name is "+InvisName.bold()+".<br/>");

		t.register("Channel Auth Level 0 Name is "+ChanUser.bold().fontcolor("green")+".");
		t.register("Channel Auth Level 1 Name is "+ChanMod.bold().fontcolor("blue")+".");
		t.register("Channel Auth Level 2 Name is "+ChanAdmin.bold().fontcolor("orange")+".");
		t.register("Channel Auth Level 3 Name is "+ChanOwner.bold().fontcolor("red")+".<br/>");

		t.register("Tournament Auth Level 0 Name is "+Tour0.bold().fontcolor("limegreen")+".");
		t.register("Tournament Auth Level 1 Name is "+Tour1.bold().fontcolor("mediumblue")+".<br/>");

		t.register("Channel Tournament Auth Level 0 Name is "+ChanTour0.bold().fontcolor("limegreen")+".");
		t.register("Channel Tournament Auth Level 1 Name is "+ChanTour1.bold().fontcolor("mediumblue")+".<br/>");

		t.register("Maximum Message Length is "+String(MaxMessageLength).bold()+".");
		t.register("Tournament Display Mode is "+display+".");
		t.register("The Future Limit is per "+FutureLimit+" seconds.");

		t.register("The Bot Name is "+Config.Bot.bot.bold().fontcolor(Config.Bot.botcolor)+"</i>.");
		t.register("The Server Chat Name is "+Config.Server.Name.bold().fontcolor(Config.Server.Color)+"</i>.");
		t.register("The ClanTag is "+Config.ClanTag.bold()+".");

		t.register(style.footer);
		t.render(src,chan);
		}
		,

		rules: function () {
		var t = new Templater(servername+' Rules');

		t.register(
		"<b>1</b>) Do not spam or overuse CAPS. This is both a rule, and a warning. The CAPSBot will (if the "+servername+" Authority have not done yet so) mute you, along with any other spammers."
		);
		t.register(
		"<b>2</b>) Do not flood or spam the chat. Once again, this is both a rule, and a warning."
		);
		t.register(
		"<b>3</b>) Do not complain about hax. It's part of the game."
		);
		t.register(
		"<b>4</b>) Do not Time Stall in a battle. 'Time Stalling' means you wait until your opponent forfeits by not making moves. If you are absent for a couple of minutes, say so."
		);
		t.register(
		"<b>5</b>) Do not Troll. This is very, very annoying. Doing this will get you kicked, muted, or banned, on sight."
		);
		t.register(
		"<b>6</b>) Do not Flame, Insult, or make Racist Comments. These can be very insulting to people."
		);
		t.register(
		"<b>7</b>) Absolutely no Cyber Bullying at all."
		);
		t.register(
		"<b>8</b>) Do not advertise Servers/Clans/Forums/Youtube Channels/Sites. Links like pictures and videos are Ok, most of the time."
		);
		t.register(
		"<b>9</b>) No Obscene, Pornographic, or illegal content. This will be an instant ban in most cases."
		);
		t.register(
		"<b>10</b>) Do not ask to be Server Authority<font size=2>(Exception: Being Authority before a Server Reset)</font>. Doing this will basically ruin your chances to ever be one."
		);
		t.register(
		"<b>11</b>) Do not Mini-Moderate. Mini-Moderating means you act like a Moderator, while your not. Contact an Authority instead."
		);
		t.register(
		"<b>12</b>) Do not Ban Evade. Doing so will result in an instant ban, or rangeban."
		);
		t.register(
		"<b>13</b>) Do not Blackmail. This will result in an instant mute/ban/rangeban."
		);
		t.register(
		"<b>14</b>) Do not complain or brag. This can cause big arguments, not exactly what we want."
		);

		t.register(
		"<i>The Owners of "+servername+" have the right to change the rules at <u>any</u> time without notification.</i>"
		);

		t.register(style.footer);
		t.render(src,chan);
		}
		,

		tourauthlist: function () {
		if(objLength(DataHash.megausers) == 0) {
		botMessage(src,"No "+sLetter(Tour1)+" at the moment!",chan);
		return;
		}

		var authlist = DataHash.megausers;
		var count = 0, id;
		var t = new Templater(sLetter(Tour1));
		t.register('');

		for(x in authlist) {
		id = sys.id(x);
		if(id == undefined) {
		t.register(AuthIMG(x)+"<b> " + x + " </b><font color=red><small>Offline</small></font> <i> Last Online:</i> " + sys.dbLastOn(x));
		}

		else {
		var color=script.namecolor(id);
		t.register(AuthIMG(id)+"<font color="+color+"><b> " + sys.name(sys.id(x)) + " </b></font><font color=green><small>Online</small></font>");
		}

		count++;
		}

		t.register("<br/><b><font color=blueviolet>Total Number of "+sLetter(Tour1)+":</font></b> "+count);
		t.register(style.footer);
		t.render(src,chan);
		}
		,

		authlist: function () {
		var authList = sys.dbAuths();
		if(authList.length == 0) {
		botMessage(src,"Sorry, no authority at the moment!",chan);
		return;
		}

		var authlist = authList.sort();
		var t = new Templater('Server Authority');

		if(sys.auth(src) > 2) {
		if(authsOf(4) !== 0) {

		t.register("<font color=black size=4><b>"+sLetter(InvisName)+" ("+authsOf(4)+")</b></font><br/>")

		for (var x in authlist) {
		var auth = authlist[x], id = sys.id(auth);
		if(DataHash.names[auth] != undefined)
		auth = DataHash.names[auth];
		if (sys.dbAuth(auth) > 3) {
		var temp = "";
		if(DataHash.tempauth[auth] != undefined)
		temp = "[<b><font color=red>Temp</font></b>] ";

		if (id == undefined) {
		t.register(AuthIMG(auth)+" "+temp+"<b>" + auth + "</b> <font color=red><small>Offline</font> <i> Last Online:</i> " + sys.dbLastOn(auth));
		}

		else {
		var color=script.namecolor(id);
		t.register(AuthIMG(id)+" "+temp+" <font color="+color+"><b>" + sys.name(id) + "</b></font> <font color=green><small>Online</small></font>");
		}

		}
		}
		t.register("")
		}
		}

		if(authsOf(3) !== 0) {
		t.register("<font color=red size=4><b>"+sLetter(OwnerName)+" ("+authsOf(3)+")</b></font><br/>");

		for (var x in authlist) {
		var auth = authlist[x], id = sys.id(auth);
		if (sys.dbAuth(auth) == 3) {

		var temp = "";
		if(DataHash.tempauth[auth] != undefined)
		temp = "[<b><font color=red>Temp</font></b>] ";

		if (id == undefined) {
		t.register(AuthIMG(auth)+" "+temp+"<b>" + auth + "</b> <font color=red><small>Offline</font> <i> Last Online:</i> " + sys.dbLastOn(auth));
		}

		else {
		var color=script.namecolor(id);
		t.register(AuthIMG(id)+" "+temp+"<font color="+color+"><b>" + sys.name(id) + "</b></font> <font color=green><small>Online</small></font>");
		}

		}
		}
		t.register("");
		}

		if(authsOf(2) !== 0) {
		t.register("<font color=orange size=4><b>"+sLetter(AdminName)+" ("+authsOf(2)+")</b></font><br/>");

		for(var x in authlist) {
		var auth = authlist[x], id = sys.id(auth);
		if (sys.dbAuth(auth) == 2) {

		var temp = "";
		if(DataHash.tempauth[auth] != undefined)
		temp = "[<b><font color=red>Temp</font></b>] ";

		if (id == undefined) {
		t.register(AuthIMG(auth)+" "+temp+"<b>" + auth + "</b> <font color=red><small>Offline</small></font> <i> Last Online:</i> " + sys.dbLastOn(auth));
		}

		else {
		var color=script.namecolor(id);
		t.register(AuthIMG(id)+" "+temp+"<b><font color="+color+">" + sys.name(id) + "</font></b> <font color=green><small>Online</small></font>");
		}

		}
		}
		t.register("")
		}

		if(authsOf(1) !== 0) {
		t.register("<font color=blue size=4><b>"+sLetter(ModName)+" ("+authsOf(1)+")</b></font><br/>");

		for(x in authlist) {
		var auth = authlist[x], id = sys.id(auth);
		if(sys.dbAuth(auth) == 1) {

		var temp = "";
		if(DataHash.tempauth[auth] != undefined)
		temp = "[<b><font color=red>Temp</font></b>] ";

		if(id == undefined) {
		t.register(AuthIMG(auth)+" "+temp+"<b>" + auth + "</b> <font color=red><small>Offline</small></font> <i> Last Online:</i> " + sys.dbLastOn(auth));
		}

		else {
		var color=script.namecolor(id);
		t.register(AuthIMG(id)+" "+temp+"<font color="+color+"><b> " + sys.name(id) + " </b></font> <font color=green><small>Online</small></font>");
		}

		}
		}
		t.register("");
		}
		t.register("<b><font color=blueviolet>Total Number of Authorities:</font></b> "+sendAuthLength(src));
		t.register(style.footer);
		t.render(src,chan);
		}
		,

		/* -- User Templates: Tables -- */

		pointercommands: function () {
		var range = PointerCommands;
		if(Object.keys(range) == 0) {
		botMessage(src,'Sorry, there are currently no pointer commands.',chan);
		return;
		}
		var tt = new Table_Templater("Pointer Commands","blue","3");
		tt.register(["Command","Points To"],true);
		for(var b in range) {
		tt.register([b,range[b]],false);
		}
		tt.end();
		tt.render(src,chan);
		}
		,

		ranking: function () {
		if(!sys.ladderEnabled(src)) {
		botMessage(src,"You don't have your ladder enabled! Enable it at Options->Enable Ladder.",chan);
		return;
		}

		var tierlist = sys.getTierList(), r;
		var name = sys.name(src);

		if(sys.name(tar) != undefined) {
		name = sys.name(tar);
		if(!sys.ladderEnabled(tar)) {
		botMessage(src,"That person doesn't have laddering enabled!",chan);
		return;
		}
		}

		var tt = new Table_Templater("Ranking of "+name,"orange","3");
		var list, ranking, ladder, total, battles, mess_rank;
		tt.register(["Tier","Ranked","Rating","Battles"],true);
		for(r in tierlist) {
		list = tierlist[r];
		ranking = !isNaN(sys.ranking(name,list)) ? sys.ranking(name,list) : "unranked";
		ladder = sys.ladderRating(name,list) != undefined ? sys.ladderRating(name,list) : "1000";
		total = sys.totalPlayersByTier(list);
		battles = sys.ratedBattles(name,list);
		mess_rank = ranking == "unranked" ? ranking : ranking+"/"+total;
		tt.register([list,mess_rank,ladder,battles],false);
		}
		tt.end();
		tt.render(src,chan);
		}
		,
		
		/* -- User Commands: Small Lists */
		autoidles: function () {
		var s = Object.keys(DataHash.idles);
		if(s.length == 0) {
		botMessage(src, "No one has Auto Idle.", chan);
		return;
		}
		
		var res = [];
		s.forEach(function(n) {
		res.push(n.name());
		});
		
		botMessage(src, "The following players have Auto Idle:", chan);
		botMessage(src, res.join(", "), chan);
		}
		,
		
		voices: function () {
		var s = Object.keys(DataHash.voices);
		if(s.length == 0) {
		botMessage(src, "No one is Voice.", chan);
		return;
		}
		
		var res = [];
		s.forEach(function(n) {
		res.push(n.name());
		});
		
		botMessage(src, "The following players are Voice:", chan);
		botMessage(src, res.join(", "), chan);
		}
		,
		
		/* -- User Commands: Idle -- */
		idle: function () {
		var idle = !sys.away(src), str;
		
		if(idle == 1) str = "You are now idling.";
		else str = "You are now back.";
		
		sys.changeAway(src, idle);
		botMessage(src, str, chan);
		}
		,
		
		/* -- User Commands: Future -- */
		future: function () {
		mcmd[0] = parseInt(mcmd[0]);
		var isnan = isNaN(mcmd[0]) || mcmd[0] == undefined;
		if(isnan) {
		botMessage(src, "Specify time!", chan);
		return;
		}
		
		var msg = mcmd[1] == undefined;
		if(msg) {
		botMessage(src, "Specify a message!", chan);
		return;
		}
		
		if(mcmd[0] < 5 || mcmd[0] > 5*60*60) {
		botMessage(src, "The time must be over 5 seconds and be under 5 hours ("+Number(5*60*60)+" seconds).", chan);
		return;
		}
		
		var t = Number(sys.time());
		if(poUser.lastFuture != 0) {
		if(poUser.lastFuture > t) {
		botMessage(src, "Please wait "+getTimeString(poUser.lastFuture-t)+" before using another future.", chan);
		return;
		}
		}
		
		poUser.lastFuture = t+FutureLimit
		var Message = cut(mcmd, 1, ':');
		sys.callLater("script.beforeChatMessage("+src+", '"+Message+"', "+chan+");", mcmd[0]);
		botMessage(src, "Your message was send "+getTimeString(mcmd[0])+" into the future!", chan);
		}
		,
		
		/* -- User Commands: MOTD -- */
		viewmotd: function () {
		if(motd) {
		var MOTDSetter = cache.get("MOTDSetter");
		var MOTD = cache.get("MOTDMessage");
		sys.sendHtmlMessage(src,'<font color=red><timestamp/><b>Message Of The Day: </b></font>' + MOTD,chan);
		sys.sendHtmlMessage(src,'<font color=darkred><timestamp/><b>Set By: </b></font>' + MOTDSetter,chan);
		}
		else {
		sys.sendHtmlMessage(src, '<font color=red><timestamp/><b>Message Of The Day:</b></font> Enjoy your stay at '+servername+'!',chan);
		}
		}
		,

		/* -- User Commands: Ping */
		ping: function () {
		tar = sys.id(mcmd[0]);
		if(mcmd[1] == undefined) {
		tar = sys.id(commandData);
		}

		if(tar == undefined) {
		botMessage(src,"That person doesn't exist.",chan);
		return;
		}

		var msg = true;
		if(isEmpty(mcmd[1])) {
		mcmd[1] = "", msg=false;
		}

		if(isOffensive(mcmd[1],src)) {
		return;
		}

		botMessage(src,"Ping sent to "+sys.name(tar)+"!",chan);
		if(msg) {
		mcmd[1] = cut(mcmd,1,':');
		botMessage(tar,sys.name(src)+" has pinged you and send the following message: "+html_escape(mcmd[1])+"<ping/>");
		return;
		}
		botMessage(tar,sys.name(src)+" has pinged you!<ping/>");
		}
		,

		/* -- User Commands: Poll */
		vote: function () {
		if(Poll.mode != 1) {
		botMessage(src,"No poll is going on.",chan);
		return;
		}
		var datanum = parseInt(commandData)-1;
		if(Poll.options[datanum] == undefined) {
		botMessage(src,"Invalid option.",chan);
		return;
		}
		Poll.votes[ip] = datanum; var dat = datanum+1;
		botMessage(src,"Voted option "+dat+" ("+Poll.options[datanum]+") on the poll",chan);
		}
		,
		viewpoll:function() {
		if(Poll.mode != 1) {
		botMessage(src,"No poll is going on.",chan);
		return;
		}
		botMessage(src,"Poll started by "+Poll.starter.bold()+"!",chan);

		for(var i in Poll.options) {
		var nummy = parseInt(i)+1;
		botMessage(src,nummy+". "+Poll.options[i],chan)
		}
		sys.sendMessage(src,'',chan);
		botMessage(src,Poll.subject+" - Results so far:",chan);
		var Count = {};
		for(var y in Poll.votes) {
		var vote = Poll.votes[y];
		if(Count[Poll.options[vote]] == undefined) {
		Count[Poll.options[vote]] = 1;
		continue;
		}
		Count[Poll.options[vote]] += 1;
		}
		for(var x in Count) {
		var nummy = parseInt(Count[x])-1;
		if(Poll.options[nummy] != undefined) {
		var num = parseInt(Count[x]);
		botMessage(src,num+". "+x+" - "+Count[x],chan);
		}
		}
		}
		,

		/* -- User Commands: Fun */
		'catch': function () {
		if(!CommandsEnabled._catch_) {
		botMessage(src,"/catch is turned off!",chan);
		return;
		}
		if (channel == mafiachan && mafia.ticks > 0 && mafia.state!="blank" && !mafia.isInGame(sys.name(src)) && sys.auth(src) <= 0) {
		sys.stopEvent();
		sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to talk!", mafiachan);
		return;
		}

		var num=Math.floor(650*Math.random());
		var pokemon=sys.pokemon(num);
		var nature=Math.floor(25*Math.random());
		nature=sys.nature(nature);
		var rand = sys.rand(30,531);
		var shiny=Math.round(rand*Math.random());
		var hpiv=sys.rand(0, 31);
		var spaiv=sys.rand(0, 31);
		var atkiv=sys.rand(0, 31);
		var defiv=sys.rand(0, 31);
		var spdiv=sys.rand(0, 31);
		var speiv=sys.rand(0, 31);
		var lvl = sys.rand(0,101);

		if (shiny!=rand) {
		botAll(formatPoke(num,false,false,0,5)+" "+formatPoke(num,false,true,0,5),chan);
		botEscapeAll(sys.name(src) + " has caught a level "+lvl+" " + pokemon + " with a " + nature + " nature!",chan);
		botEscapeAll(pokemon + " has the following IVs:",chan);
		botEscapeAll("HP: " + hpiv + " Atk: " + atkiv + " Def: " + defiv + " SpA: " + spaiv + " SpD: " + spdiv + " Spd: " + speiv + ".",chan);
		}

		else {
		botAll(formatPoke(num,true,false,0,5)+" "+formatPoke(num,true,true,0,5),chan);
		botEscapeAll(sys.name(src) + " has caught a level "+lvl+" shiny " + pokemon + " with a " + nature + " nature!",chan);
		botEscapeAll(pokemon + " has the following IVs:",chan);
		botEscapeAll("HP: " + hpiv + " Atk: " + atkiv + " Def: " + defiv + " SpA: " + spaiv + " SpD: " + spdiv + " Spd: " + speiv + ".",chan);
		botEscapeAll("This is truly a rare event",0);
		}
		}
		,

		attack: function () {
		if(!CommandsEnabled.attack) {
		botMessage(src,"/attack is turned off!",chan);
		return;
		}
		if (channel == mafiachan && mafia.ticks > 0 && mafia.state!="blank" && !mafia.isInGame(sys.name(src)) && sys.auth(src) <= 0) {
		sys.stopEvent();
		sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to talk!", mafiachan);
		return;
		}

		if(poUser.capsMute(commandData)) {
		return;
		}

		if(isOffensive(commandData,src)) {
		return;
		}

		var attack=Math.floor(560*Math.random());
		attack=sys.move(attack);
		var getcolor = script.namecolor(tar);

		botAll("<font color=" + getColor + "><b>" + html_escape(sys.name(src)) + "</b></font></font> has used " + attack + " on <b><font color=" + getcolor + ">" + html_escape(commandData) + "</font></b>!",chan);
		return;
		}
		,

		roulette: function () {
		if(!CommandsEnabled.roulette) {
		botMessage(src,"/roulette is turned off!",chan);
		return;
		}
		if (channel == mafiachan && mafia.ticks > 0 && mafia.state!="blank" && !mafia.isInGame(sys.name(src)) && sys.auth(src) <= 0) {
		sys.stopEvent();
		sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to talk!", mafiachan);
		return;
		}
		var randpoke = sys.rand(1,494);
		var rand = sys.rand(1,4), poke, shine;

		if(rand == 1||rand==3) {
		poke = formatPoke(randpoke,false,false,false,5,true)
		shine = "";
		}

		else if(rand == 2) {
		poke = formatPoke(randpoke,true,false,false,5,true)
		shine = "Shiny ";
		}

		botAll("<font color="+getColor+"><b>"+html_escape(sys.name(src))+"</b></font> got "+spelling(shine+sys.pokemon(randpoke))+" "+poke+"!",chan);
		return;
		}
		,

		/* -- User Commands: CommandStats */
		commandstats: function () {
		commandData = parseInt(commandData);

		if(isNaN(commandData)) {
		commandData = 3000;
		}

		displayCommandStats(src,chan,commandData);
		}
		,

		/* -- User Commands: Mail */
		sendmail: function () {
		if(dbIp == undefined) {
		botMessage(src,"Null tar!",chan);
		return;
		}

		if(mcmd[1] == undefined) {
		botMessage(src,"Specify a title!",chan);
		return;
		}

		if(mcmd[2] == undefined) {
		botMessage(src,"Specify text!",chan);
		return;
		}

		if(typeof(DataHash.mail[mcmd[0].toLowerCase()]) == "undefined") {
		DataHash.mail[mcmd[0].toLowerCase()] = [];
		}

		if(typeof(DataHash.mail["SEND_"+sys.name(src).toLowerCase()]) == "undefined") {
		DataHash.mail["SEND_"+sys.name(src).toLowerCase()] = [];
		}

		result = cut(mcmd,2,':');

		DataHash.mail[mcmd[0].toLowerCase()].push(new Mail(sys.name(src),result,mcmd[1]));
		DataHash.mail["SEND_"+sys.name(src).toLowerCase()].push(new Mail(mcmd[0],result,mcmd[1]));

		botMessage(src,"Mail send! A copy of the mail was also send to your send mails box. Type /sendmails to view.",chan);

		if(tar != undefined) {
		botMessage(tar,"You got mail from "+sys.name(src)+"! Type /readmail to view.<ping/>");
		}

		cache.write("mail",JSON.stringify(DataHash.mail));
		}
		,
		sendmails: function () {
		if(typeof(DataHash.mail["SEND_"+sys.name(src).toLowerCase()]) == "undefined") {
		DataHash.mail["SEND_"+sys.name(src).toLowerCase()] = [];
		cache.write("mail",JSON.stringify(DataHash.mail));
		}

		if(DataHash.mail["SEND_"+sys.name(src).toLowerCase()].length < 1) {
		botMessage(src,"You don't have any send mails!",chan);
		return;
		}

		botMessage(src,"Here are your send mails:",chan);

		var read = "", y, mail = DataHash.mail["SEND_"+sys.name(src).toLowerCase()];

		var arr = [];
		for(y in mail) {
		var m = mail[y];
		arr.push("<b>"+format("lvl0", html_escape(m.title))+"</b>: Send to "+m.sender+" on "+m.sendtime+" ("+getTimeString(sys.time()*1-m.sendAgo)+" ago)");
		arr.push("<i>"+format("lvl0", html_escape(m.text))+"</i>");
		}

		arr.push('');
		sys.sendHtmlMessage(src,arr.join("<br>"),chan);
		}
		,
		deletesend: function () {
		if(typeof(DataHash.mail["SEND_"+sys.name(src).toLowerCase()]) == "undefined") {
		DataHash.mail["SEND_"+sys.name(src).toLowerCase()] = [];
		cache.write("mail",JSON.stringify(DataHash.mail));
		}

		if(DataHash.mail["SEND_"+sys.name(src).toLowerCase()].length < 1) {
		botMessage(src,"You don't have any send mails!",chan);
		return;
		}

		DataHash.mail["SEND_"+sys.name(src).toLowerCase()] = [];
		botMessage(src,"Send Mail deleted!",chan);
		cache.write("mail",JSON.stringify(DataHash.mail));
		}
		,
		readmail: function () {
		if(typeof(DataHash.mail[sys.name(src).toLowerCase()]) == "undefined") {
		DataHash.mail[sys.name(src).toLowerCase()] = [];
		cache.write("mail",JSON.stringify(DataHash.mail));
		}

		if(typeof(DataHash.mail["SEND_"+sys.name(src).toLowerCase()]) == "undefined") {
		DataHash.mail["SEND_"+sys.name(src).toLowerCase()] = [];
		cache.write("mail",JSON.stringify(DataHash.mail));
		}

		if(DataHash.mail[sys.name(src).toLowerCase()].length < 1) {
		botMessage(src,"You don't have any mail!",chan);
		return;
		}

		botMessage(src,"Here is your mail:",chan);

		var arr = [];
		var read = "", y, mail = DataHash.mail[sys.name(src).toLowerCase()], save = false;
		var time = sys.time()*1;

		for(y in mail) {
		var m = mail[y];
		read = "[<b><font color=blue>Old</font></b>]";

		if(!m.read) {
		read = "[<b><font color=red>New</font></b>]";
		m.read = true;
		save = true;
		}

		arr.push(read+" <b>"+format("lvl0", html_escape(m.title))+"</b>: Send by "+m.sender+" on "+m.sendtime+" ("+getTimeString(time-m.sendAgo)+" ago)");
		arr.push("<i>"+format("lvl0", html_escape(m.text))+"</i>");
		}

		if(save) {
		cache.write("mail",JSON.stringify(DataHash.mail)); }

		arr.push('');
		sys.sendHtmlMessage(src,arr.join("<br>"),chan);
		}
		,
		deletemail: function () {
		if(typeof(DataHash.mail[sys.name(src).toLowerCase()]) == "undefined") {
		DataHash.mail[sys.name(src).toLowerCase()] = [];
		cache.write("mail",JSON.stringify(DataHash.mail));
		}

		if(DataHash.mail[sys.name(src).toLowerCase()].length < 1) {
		botMessage(src,"You don't have any mail!",chan);
		return;
		}

		DataHash.mail[sys.name(src).toLowerCase()] = [];
		botMessage(src,"Mail deleted!",chan);
		cache.write("mail",JSON.stringify(DataHash.mail));
		}
		,

		/* -- User Commands: Rank Icons */
		changeicon: function () {
		if(isEmpty(commandData)) {
		botMessage(src,"Specify an icon!",chan);
		return;
		}
		var resets = ['reset','remove','delete'];

		if(resets.indexOf(cmdData) > -1 &&DataHash.rankicons[sys.name(src).toLowerCase()] != undefined) {
		botMessage(src,"Removed rank icon.",chan);
		poUser.icon = "";
		delete DataHash.rankicons[sys.name(src).toLowerCase()];
		cache.write("rankicons",JSON.stringify(DataHash.rankicons));
		return;
		}

		if(commandData.length != 1) {
		botMessage(src,"You can only specify 1 character for your rank icon!",chan);
		return;
		}

		if(commandData == "<"&&(sys.auth(src) < 4&&Config.HighPermission[sys.name(src)] !== undefined&&Config.HighPermission[sys.name(src)][1] !== 3)) {
		botMessage(src,"Can't pick this icon!",chan);
		return;
		}

		poUser.icon = commandData;
		DataHash.rankicons[sys.name(src).toLowerCase()] = commandData;
		cache.write("rankicons",JSON.stringify(DataHash.rankicons));

		botMessage(src,"Rank icon changed to "+commandData+"!",chan);
		}
		,

		icons:function() {
		iconManager.showIcons(src,chan);
		}
		,

		iconinfo:function() {
		iconManager.showIconInfo(src.chan);
		}
		,

		/* -- User Commands: Register */
		unregister: function () {
		var name = sys.name(src);
		if(!sys.dbRegistered(name)) {
		botMessage(src,'You can\'t Unregister an alias which is not Registered at all!',chan);
		return;
		}
		sys.clearPass(name);
		sendAuth(name+" cleared their password!");
		botMessage(src, "Your password is succesfully cleared!",chan);
		}
		,

		/* -- User Commands: Styles */
		styles: function () {
		styleManager.showStyles(src,chan);
		}
		,

		styleinfo: function () {
		styleManager.showStyleInfo(src,chan);
		}
		,

		/* -- User Commands: Trivia */
		a: function () {
		if(sendChanError(src,chan,trivia))
		return;

		Trivia.a(src,commandData);
		}
		,
		submit: function () {
		if(sendChanError(src,chan,trivia))
		return;

		Trivia.submit(src,mcmd);
		}
		,
		leaderboard: function () {
		if(sendChanError(src,chan,trivia))
		return;

		Trivia.leaderboardDisplay(src,commandData);
		}
		,
		questions: function () {
		if(sendChanError(src,chan,trivia))
		return;

		Trivia.questionList(src,commandData);
		}
		,
		question: function () {
		if(sendChanError(src,chan,trivia))
		return;

		Trivia.viewQuestion(src,commandData);
		}
		,

		/* -- User Commands: Messaging */
		me: function () {
		if (channel == mafiachan && mafia.ticks > 0 && mafia.state!="blank" && !mafia.isInGame(sys.name(src)) && sys.auth(src) <= 0) {
		sys.stopEvent();
		sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to talk!", mafiachan);
		return;
		}
		if (!CommandsEnabled.me) {
		botMessage(src, "/me is turned off.",chan);
		return;
		}
		if(commandData == "")
		return;

		if(poUser.capsMute(commandData)) {
		return;
		}

		if(isOffensive(commandData,src)) {
		return;
		}

		sys.sendHtmlAll("<font color=" + getColor + "><timestamp/><i><b>*** " + sys.name(src) + "</b> " + format(src, html_escape(commandData)) + "</font></b></i>",chan);
		}
		,

		/* -- User Commands: Info */
		changeinfo : function () {
		if(isEmpty(commandData)) {
		botMessage(src,'Trainer info set to none!',chan);
		sys.changeInfo(src,'');
		return;
		}

		if(isOffensive(commandData,src)) {
		return;
		}

		sys.changeInfo(src, commandData);
		botMessage(src, "You changed your info to: " + html_escape(commandData),chan);
		}
		,

		/* -- User Commands: Avatar */
		changeavatar: function () {
		var p = Math.floor(parseInt(commandData));

		if(!isNonNegative(p)||p > 262||p < 0||commandData.indexOf(".") != -1) {
		botMessage(src,'Avatar number cannot be found!',chan);
		return;
		}
		if(p == 0) {
		botMessage(src,"Changed avatar to empty!",chan);
		sys.changeAvatar(src,0);
		return;
		}

		sys.changeAvatar(src, p)
		botMessage(src, "You changed your avatar num to: #" + html_escape(commandData),chan);
		}
		,

		/* -- User Commands: Auth */
		callauth: function () {
		if(mcmd[0]==undefined) {
		botMessage(src,"Please select an auth level or auth name for the /callauth",chan);
		return;
		}

		var h = mcmd[0].toLowerCase();

		var l = function(v) {
		return String(v).toLowerCase();
		}

		if(h!="1"&&h!="2"&&h!="3"&&h!=l(ModName)&&h!=l(AdminName)&&h!=l(OwnerName)) {
		botMessage(src,"Please select an auth level or auth name for the /callauth",chan);
		return;
		}

		var a = h;
		if(l(ModName)==a)
		a = 1;
		else if(l(AdminName)==a)
		a = 2;
		else if(l(OwnerName)==a)
		a = 3;
		else
		a = Number(a);

		var y, PL = sys.playerIds(), count = 0;

		for(y in PL) {
		var t = PL[y];
		if(sys.auth(t) == a) {
		count++;

		botMessage(t,sys.name(src)+" has called you!<ping/>",0);
		}
		};

		if(count===0) {
		botMessage(src,"No auths could be pinged..",chan);
		return;
		}
		var s = count < 2 ? "" : "s"
		botMessage(src,count+" auth"+s+" could be pinged.",chan);
		}
		,

		/* -- User Commands: Team */
		team: function () {
		script.importable(src,src,chan);
		}
		,

		/* -- User Commands: Impersonation */

		imp: function () {
		if(implock&&sys.auth(src) < 1) {
		botMessage(src,'Imping has been locked for '+sLetter(UserName)+'.',chan);
		return;
		}

		if(poUser.capsMute(commandData)) {
		return;
		}

		if(isOffensive(commandData,src)) {
		return;
		}
		if(commandData == '') {
		botMessage(src,"Specify a name!",chan);
		return;
		}

		if(commandData.length > 20) {
		botMessage(src, "Maximum characters allowed: 20. Current: "+commandData.length, chan);
		return;
		}
		
		if(commandData == "off") {
		delete poUser.impersonation;
		botMessage(src, "Now you are yourself again!",chan);
		return;
		}
		
		poUser.impersonation = commandData;

		if(sys.auth(src) == 0)
		sendAuth(poUser.impersonation + " was impersonated by "+sys.name(src)+"!");

		botMessage(src, "Now you are " + poUser.impersonation +"!",chan);
		return;
		}
		,

		impoff: function () {
		if(implock&&sys.auth(src) < 1) {
		botMessage(src,'Imping has been locked for '+sLetter(UserName)+'.',chan);
		return;
		}
		if(poUser.impersonation == undefined){
		botMessage(src,'Sorry, you currently dont have any impersonation, so you cant unimp.',chan);
		return;
		}

		delete poUser.impersonation;
		botMessage(src, "Now you are yourself again!",chan);
		return;
		}
		,

		/* -- User Commands: Money */
		money: function () {
		var name = sys.name(src).toLowerCase();
		var hash = DataHash.money;
		if(hash[name] == undefined)
		hash[name] = 0;
		var displaystr = 'You have {{{money}}} money.';

		if(dbIp != undefined&&!isEmpty(commandData)) {
		if(hash[cmdData] == undefined)
		hash[cmdData] = 0;

		displaystr = commandData+' has {{{money}}} money.';
		name = cmdData;
		}

		hash = hash[name];
		botMessage(src,displaystr.replace(/{{{money}}}/gi,hash),chan);
		return;
		}
		});

		/* -- User Commands */
		userCommands[removespaces(UserName).toLowerCase()+"commands"] = function() {
		var ct = new Command_Templater(UserName+' Commands');

		ct.register("funcommands","Displays Fun Commands.");
		ct.register("mailcommands", "Displays Mail Commands.");
		ct.register("infocommands", "Displays Information Commands.");

		ct.register("ping", ["{r Person}", "<u>{p Message}</u>"], "Pings Someone and Displays an Optional Message.");
		ct.register("callauth", ["{b AuthLevel/AuthName}"], "Pings all Authority of a Level or Name.");
        ct.register("idle", "Reverses your away status.");
		
		if(Clantag.full != "None") {
		ct.register("join"+Clantag.fullTextLower, "Lets you join the "+Clantag.fullText.bold()+" Clan.");
		ct.register("unjoin"+Clantag.fullTextLower, "Lets you unjoin the "+Clantag.fullText.bold()+" Clan.");
		}

		if(Poll.mode) {
		ct.register("viewpoll", "Displays Poll Information.");
		ct.register("vote", ["{o Option}"], "Lets you vote in the Poll.");
		}

		ct.register("unregister","Clears your password.");
		ct.register("changeavatar", ["{o Number}"], "Changes your Avatar. Changes back once you leave the Server.");
		ct.register("changeinfo", ["{p Info}"], "Changes your Description. Changes back once you leave the Server.");
		if(!implock) {
		ct.register("imp", ["{p Thing}"], "Impersonates something.");
		ct.register("impoff","Deletes your Impersonation.");
		}
		ct.register(style.footer);
		ct.render(src,chan);
		}

		/* -- User Commands: Clan */
		if(Clantag.full != "None") {
		userCommands["join"+Clantag.fullTextLower] = function() {
		var name = sys.name(src);
		if(name.substr(0,Clantag.full.length) == Clantag.full) {
		botMessage(src,"You already joined the "+Clantag.full+" clan!",chan);
		return;
		}
		if(sys.id(Clantag.full+name) != undefined) {
		botMessage(src,"Someone with your name and that tag is already online.",chan);
		return;
		}
		var newName = Clantag.full+sys.name(src);
		if(newName.length > 20) {
		botMessage(src,"Please make your name shorter.",chan);
		return;
		}
		botAll(sys.name(src)+" joined the "+Clantag.full.bold()+" clan!",0);
		sys.changeName(src,newName);
		}

		userCommands["unjoin"+Clantag.fullTextLower] = function() {
		var name = sys.name(src);
		if(name.substr(0,Clantag.full.length) != Clantag.full) {
		botMessage(src,"You didn't join the "+Clantag.full+" clan!",chan);
		return;
		}
		var without = name.substr(Clantag.full.length);
		if(sys.id(without) != src&&sys.id(without) != undefined) {
		botMessage(src,"Someone with your name without the tag is already online.",chan);
		return;
		}
		botAll(sys.name(src)+" unjoined the "+Clantag.full.bold()+" clan!",0);
		sys.changeName(src,without);
		}
		}
		
		/* Server Requests */
		// The Battle Tower
		if(servername.contains("The Battle Tower")) {
		userCommands["d"] = function () {
		// Server Request.
		if(!servername.contains("The Battle Tower"))
		return;
		
		var srcname = sys.name(src);
		var death=[];
		death[0]="<font color='green'><b>" + srcname + " was mauled by a wild Tyranitar!</b></font>";
		death[1]="<font color='purple'><b>" + srcname + " attacked a Wobbufett!</b></font>";
		death[2]="<font color='black'><b>" + srcname + " died from a broken heart...</b></font>";
		death[3]="<font color='gold'><b>" + srcname + " was zapped by Thundurus's Thunderbolt!</b></font>";
		death[4]="<font color='brown'><b>" + srcname + " met Conkeldurr in a dark alley.</b></font>";
		death[5]="<font color='purple'><b>" + srcname + " held onto a Drifloon and floated away.</b></font>";
		death[6]="<font color='blue'><b>" + srcname + " was shot by [HD]Marshtomp because they suck.</b></font>";
		death[7]="<font color='#413839'><b>" + srcname + " got kicked in the head by </font></b><b><font color=green>kupochus</b></font>.";
		death[8]="<font color='#151B54'><b>" + srcname + " got caught and eaten by Mako!</font></b>.";
		death[9]="<font color=orange><b>" + srcname + " got their body digitized into megapixels by [HXG] Tech</font></b>.";
		death[10]="<font color=grey><b>Noir showed " + srcname + " his stabs</font></b>.";
		death[11]="<font color=red><b> " + srcname + " got beat up by SlowBro</font></b>.";
		death[12]="font color=maroon><b>" + srcname + " was entoxicated by </font> <font color=hotpink>Titan's awesome power </font></b>.";
		death[13]="<font color='blue'><b>" + srcname + " got stapled by </b></font><font color='red'><b>Deputy Red's</b></font><font color='blue'><b> Stapler</b></font>";
        death[14]="<font color=darkblue><b>"+ srcname +" floated away...</b></font>";
		death[15]="<font color=blueviolet><b>"+ srcname +" got killed by the triple 6 crew</b></font>";
		var c = Math.floor(death.length*Math.random())
		botAll(death[c], 0);
		sys.callQuickly("sys.kick(" + src + ");", 200);
        }
		
		userCommands["death"] = userCommands["d"];
		}

		/* -- Channel Commands: Start */
		channelCommands = ({
		/* -- Channel Templates: Commands */
		channelcommands: function () {
		var ct = new Command_Templater('Channel Commands',true);

		ct.span(ChanUser+" Commands");

		ct.register("csettings", "Displays Channel Settings and Information.");
		ct.register("cauth", "Displays Channel Authority.");
		ct.register("topic", "Displays Channel Topic.");
		ct.register("createchannel", ["{p Name}"], "Creates a new Channel.");

		if (poChan.isChanMod(src)||!noPermission(src,1)) {
		ct.span(ChanMod+" Commands");

		if(!noPermission(src,1)) {
		ct.register("perm", ["{b On/Off}"], "Makes the Channel Permanent or Temporal.");
		}
		ct.register("channelwall", ["{p Message}"], "Announces something in this channel.");
		ct.register("channelhtmlwall", ["{p Message}"], "Announces something with HTML in this channel.");
		ct.register("html", ["{p Message}"], "Sends a message to everyone with HTML.");
		ct.register("channelkick", ["{r Person}"], "Kicks someone from the Channel.");
		ct.register("channel", ["{b Mute/Unmute}", "{or Person}",  "<u>{p Reason}</u>", "<u>{o Time}</u>"], "Mutes or Unmutes someone in the Channel.",true);
		ct.register("topic", ["{p Message}"], "Changes the Channel Topic. If Message is default, changes the Topic back to default.");
		ct.register("cbanlist", "Displays Channel Banlist.");
		ct.register("cmutelist", "Displays Channel Mutelist.");
		ct.register("csilence", "Silences everyone who's Channel Authority is lower than yours.");
		ct.register("cunsilence","Unsilences the Channel.");
		ct.register("chatcolor", ["{p Color}", "{p SecondColor}"], "Adds a Chat Color to the Channel. If color is random, then uses a random color.");
		ct.register("chatcoloroff","Removes Chat Color in the Channel.");
		}

		if (poChan.isChanAdmin(src)||!noPermission(src,2)) {
		ct.span(ChanAdmin+" Commands");

		if(!noPermission(src,2)) {
		ct.register("destroychannel", "Destroys the Channel.");
		}

		ct.register("installtour", "Installs Tournaments in this Channel.");
		ct.register("uninstalltour", "Uninstalls Tournaments in this Channel.");

		ct.register("channelclearchat", "Clears the Channel Chat for everyone in the Channel.");

		ct.register(removespaces(ChanUser).toLowerCase(), ["{or Person}"], "Makes someone "+ChanUser.toLowerCase()+" in this Channel.");
		ct.register(removespaces(ChanMod).toLowerCase(), ["{or Person}"], "Makes someone "+ChanMod.toLowerCase()+" in this Channel.");
		ct.register(removespaces(ChanTour0).toLowerCase(), ["{or Person}"], "Makes someone "+ChanTour0.toLowerCase()+" in this Channel.");
		ct.register(removespaces(ChanTour1).toLowerCase(), ["{or Person}"], "Makes someone "+ChanTour1.toLowerCase()+" in this Channel.");

		ct.register("channel", ["{b Ban/Unban}", "{or Person}", "<u>{p Reason}</u>", "<u>{o Time}</u>"], "Bans/Unbans someone from this Channel.",true);
		}

		if (poChan.isChanOwner(src)||!noPermission(src,2)) {
		ct.span(ChanOwner+" Commands");

		if(noPermission(src,1)) {
		ct.register("perm", ["{b On/Off}"], "Makes the Channel Permanent or Temporal.");
		}

		if(noPermission(src,2)) {
		ct.register("destroychannel", "Destroys the Channel.");
		}

		ct.register("channelprivate", "Makes the Channel Auth-Only and kicks all Non-Auth.");
		ct.register("channelpublic", "Lets everyone back in.");
		ct.register(removespaces(ChanAdmin).toLowerCase(), ["{or Person}"], "Makes someone "+ChanAdmin.toLowerCase()+" in this Channel.");
		ct.register(removespaces(ChanOwner).toLowerCase(), ["{or Person}"], "Makes someone "+ChanOwner.toLowerCase()+" in this Channel.");
		}

		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		/* -- Channel Templates: Normal */
		ctourauthlist: function () {
		if(Object.keys(poChan.tourAuth).length == 0) {
		botMessage(src,"No "+sLetter(ChanTour1)+" at the moment!",chan);
		return;
		}

		var authlist = poChan.tourAuth;
		var count = 0;
		var t = new Templater(sLetter(ChanTour1));
		t.register("");

		for(x in authlist) {
		if(sys.id(x) == undefined) {
		t.register(AuthIMG(x)+" <b> " + x + " </b><font color=red><small>Offline</small></font> <i> Last Online:</i> " + sys.dbLastOn(x));
		}

		else {
		var color=script.namecolor(sys.id(x));
		t.register(AuthIMG(sys.id(x))+" <font color="+color+"><b>" + sys.name(sys.id(x)) + "</b></font> <font color=green><small>Online</small></font>");
		}

		count++;
		}

		t.register("<br/><b><font color=blueviolet>Total Number of "+sLetter(ChanTour1)+":</font></b> "+count);
		t.register(style.footer);
		t.render(src,chan);
		}
		,

		csettings:function() {
		var t = new Templater('Channel Settings');

		var g = function(str) {
		return "<font color='green'><b>"+str+"</b></font>";
		}

		var r = function(str) {
		return "<font color='red'><b>"+str+"</b></font>";
		}

		if(poChan.perm)
		t.register("The Channel is "+g("permanent")+".");
		else
		t.register("The Channel is "+r("temporal")+".");

		if(!poChan.private)
		t.register("The Channel is "+g("open")+".");
		else
		t.register("The Channel is "+r("private")+".");

		if(poChan.defaultTopic)
		t.register("The Channel is "+g("using a default topic")+".");
		else
		t.register("The Channel is "+r("using a custom topic")+".");

		if(poChan.toursEnabled)
		t.register("The Channel has "+g("tours installed")+".");
		else
		t.register("The Channel doesn't have "+r("tours installed")+".");

		if(chatcolor)
		t.register("The Channel has "+g("chat color enabled")+".");
		else
		t.register("The Channel has "+r("chat color disabled")+".");
		
		if(poChan.toursEnabled) {
		if(poChan.tour.AutoStartBattles)
		t.register("AutoStartBattles for this channel is "+g("on")+".");
		else
		t.register("AutoStartBattles for this channel is "+r("off")+".<br/>");
		}

		if(poChan.creator != '') {
		t.register("The Channel Creator is "+poChan.creator.bold().fontcolor("green")+".");
		}

		t.register("The Channel Topic is "+poChan.topic+".");
		if(poChan.topicsetter != '') {
		t.register("The Channel Topic Setter is "+poChan.topicsetter+".");
		}

		t.register("");

		t.register("The Channel Silence level is "+String(poChan.silence).bold().fontcolor("blue")+".");
		t.register("The Channel ID is "+String(chan).bold().fontcolor("orange")+".<br/>");

		t.register("The Channel Name is "+poChan.name.bold().fontcolor("red")+".");

		t.register(style.footer);
		t.render(src,chan);
		}
		,

		cauth: function () {
		var authList = poChan.chanAuth;
		if(objLength(authList) == 0) {
		botMessage(src,"No channel authority at the moment!",chan);
		return;
		}

		var update = false, temp = "", auths = {}, x, status;
		for(x in authList) {
		var Authlevel = authList[x];
		var Newauth = sys.dbAuth(x);
		if(Newauth > Authlevel) {
		if(Newauth > 3) {
		Newauth = 3;
		}
		poChan.changeAuth(x,Newauth);
		update=true;
		}
		}

		if(update)
		{
		updateChannelData(chan);
		}

		for(var y in authList) {
		if(DataHash.names[y] != undefined)
		auths[DataHash.names[y]] = authList[y];
		}

		var authTotal = 0;
		var t = new Templater("Channel Authority");

		var cAuthsOf = function(num) {
		var arr_re = 0;
		for(var x in auths) {
		if(auths[x] == num) {
		arr_re += 1;
		}
		}
		return arr_re;
		}

		if(cAuthsOf(3) !== 0) {
		t.register("<font color=red size=4><strong>"+sLetter(ChanOwner)+" ("+cAuthsOf(3)+")</strong></font>");
		t.register("")

		for (var x in auths) {
		var auth = x, id = sys.id(auth);
		if (auths[x] == 3) {

		if(sys.away(id)) {
		status = 'Away'; }

		else {
		status = 'Available'; }

		if (id == undefined) {
		t.register("<img src='themes/classic/client/OAway.png'> <b> "+auth+ " </b><font color=red><small>Offline</font> <i> Last Online:</i> " + sys.dbLastOn(auth));
		}

		else {
		var color=script.namecolor(id);
		t.register("<img src='themes/classic/client/O"+status+".png'> "+temp+"<font color="+color+"><b>" + sys.name(id) + " </font></b><font color=green><small>Online</small></font>");
		}

		authTotal += 1;
		}
		}
		t.register("");
		}

		if(cAuthsOf(2) !== 0) {
		t.register("<font color=orange size=4><strong>"+sLetter(ChanAdmin)+" ("+cAuthsOf(2)+")</strong></font>");
		t.register("")

		for(var x in auths) {
		var auth = x, id = sys.id(auth);
		if (auths[x] == 2) {

		if(sys.away(id)) {
		status = 'Away'; }

		else {
		status = 'Available'; }

		if (id == undefined) {
		t.register("<img src='themes/classic/client/AAway.png'> <b> "+auth+ " </b><font color=red><small>Offline</small></font> <i> Last Online:</i> " + sys.dbLastOn(auth));
		}

		else {
		var color=script.namecolor(id);
		t.register("<img src='themes/classic/client/A"+status+".png'> "+temp+"<b><font color="+color+">" + sys.name(id) + " </font></b><font color=green><small>Online</small></font>");
		}

		authTotal += 1;
		}
		}
		t.register("");
		}

		if(cAuthsOf(1) !== 0) {
		t.register("<font color=blue size=4><strong>"+sLetter(ChanMod)+" ("+cAuthsOf(1)+")</strong></font>");
		t.register("")

		for(x in auths) {
		var auth = x, id = sys.id(auth);
		if(auths[x] == 1) {

		if(sys.away(id)) {
		status = 'Away'; }

		else {
		status = 'Available'; }

		if(id == undefined) {
		t.register("<img src='themes/classic/client/MAway.png'> "+temp+"<b> "+auth+ " </b><font color=red><small>Offline</small></font> <i> Last Online:</i> " + sys.dbLastOn(auth));
		}

		else {
		var color=script.namecolor(id);
		t.register("<img src='themes/classic/client/M"+status+".png'> "+temp+"<font color="+color+"><b> " + sys.name(id) + " </b></font><font color=green><small>Online</small></font>");
		}

		authTotal += 1;
		}
		}
		t.register("");
		}

		t.register("<b><font color=blueviolet>Total Number of Channel Authorities:</b></font> "+authTotal);
		t.register(style.footer);
		t.render(src,chan);
		}
		,

		/* -- Channel Templates: Tables */
		cbanlist:function() {
		if(!poChan.isChanMod(src)&&noPermission(src,1)) {
		botMessage(src, "You dont have the permission to do that",chan);
		return;
		}
		prune_channel_bans(chan);
		var list = poChan.banlist;
		if(Object.keys(list).length == 0) {
		botMessage(src,"No banned ips.",chan);
		return;
		}
		var list, lastname, l, add, t, n = sys.time()*1;
		var perm = !noPermission(src,1);
		var tt = new Table_Templater('Channel Banlist','red','3');
		if(perm) {
		add = ["IP","Banned Name","Banned By","Reason","Time","Last Used Name"];
		}
		else {
		add = ["Banned Name","Banned By","Reason","Time","Last Used Name"];
		}

		tt.register(add,true);
		for(var y in list) {
		last="N/A", lastname = lastName(y), l = list[y], t = getTimeString(l.time-n);
		if(lastname !== undefined) {
		last = lastname;
		}
		if(perm) {
		add = [y,l.who,l.by,l.why,t,last];
		}
		else {
		add = [l.who,l.by,l.why,t,last];
		}
		tt.register(add,false);
		}
		tt.register(add,false);
		tt.end();
		tt.render(src,chan);
		}
		,

		cmutelist:function() {
		if(!poChan.isChanMod(src)&&noPermission(src,1)) {
		botMessage(src, "You dont have the permission to do that",chan);
		return;
		}
		prune_channel_mutes(chan);
		var list = poChan.mutelist;
		if(Object.keys(list).length == 0) {
		botMessage(src,"No muted ips.",chan);
		return;
		}

		var last, lastname, l, add, tstr, now = sys.time()*1;
		var perm = !noPermission(src,1);
		var tt = new Table_Templater('Channel Mutelist','blue','3');

		if(perm) {
		add = ["IP","Muted Name","Muted By","Reason","Length","Last Used Name"];
		}
		else {
		add = ["Muted Name","Muted By","Reason","Length","Last Used Name"];
		}
		tt.register(add,true);

		for(var y in list) {
		last="N/A", lastname = lastName(y), l = list[y], tstr = getTimeString(l.time-now);
		if(lastname !== undefined) {
		last = lastname;
		}
		if(perm) {
		add = [y,l.name,l.by,l.why,tstr,last];
		}
		else {
		add = [l.name,l.by,l.why,tstr,last];
		}
		tt.register(add,false);
		}

		tt.end();
		tt.render(src,chan);
		}
		,
        /* -- Channel Commands: Wall -- */
		channelhtmlwall: function () {
		var color = script.namecolor(src);
		var srcname = sys.name(src)

		sys.sendHtmlAll(border2+"<br>", chan);
		var l = allowicon === true ? rankico : '';
		sys.sendHtmlAll('<font color='+script.namecolor(src)+'><timestamp/><b>'+l+html_escape(sys.name(src))+':</font></b> '+commandData, chan);
		sys.sendHtmlAll("<br>"+border2, chan);
		}
		,

		channelwall: function () {
		var color = script.namecolor(src);
		var srcname = sys.name(src)

		sys.sendHtmlAll(border2+"<br>", chan);

		var l = '', send = sys.sendAll, f = commandData;
		if(allowicon) {
		l = rankico;
		send = sys.sendHtmlAll;
		f = format(src, html_escape(commandData));
		}
		var displaystr = allowicon === true ? '<font color='+script.namecolor(src)+'><timestamp/><b>'+l+html_escape(sys.name(src))+':</font></b> '+f : sys.name(src)+': '+f

		send(displaystr, chan);
		sys.sendHtmlAll("<br>"+border2, chan);
		}
		,
		
		/* -- Channel Commands: HTML -- */
		html: function () {
		if(!poChan.isChanMod(src)&&noPermission(src,1)) {
		botMessage(src, "You dont have the permission to do that",chan);
		return;
		}
		if(noPermission(src, 1)) {
		var sendStr = '<font color='+script.namecolor(src)+'><timestamp/><b>'+sys.name(src)+':</b> '+format(0, message);
		sys.sendHtmlAll(sendStr, chan);
		return;
		}
		sys.sendHtmlAll(commandData,chan); // higher power for auth.
		}
		,
		
		/* -- Channel Commands: Silence */
		csilence:function() {
		if(!poChan.isChanMod(src)&&noPermission(src,1)) {
		botMessage(src, "You dont have the permission to do that",chan);
		return;
		}

		auth = sys.auth(src) > poChan.chanAuth[sys.name(src).toLowerCase()]*1 ? sys.auth(src) : poChan.chanAuth[sys.name(src).toLowerCase()]*1


		if(poChan.silence*1 === auth) {
		botMessage(src,"The channel is already silenced!",chan);
		return;
		}

		poChan.silence = auth;

		switch(poChan.silence) {
		case 1:
		botEscapeAll(sys.name(src)+" silenced the channel!",chan);
		break;
		case 2:
		botEscapeAll(sys.name(src)+" super silenced the channel!",chan);
		break;
		case 3:
		botEscapeAll(sys.name(src)+" mega silenced the channel!",chan);
		break;
		default:
		botEscapeAll(sys.name(src)+" mega silenced the channel!",chan);
		poChan.silence = 3;
		break;
		}

		updateChannelData(chan);
		}
		,
		cunsilence:function() {
		if(!poChan.isChanMod(src)&&noPermission(src,1)) {
		botMessage(src, "You dont have the permission to do that",chan);
		return;
		}
		if(poChan.silence*1 === 0) {
		botMessage(src,"There is no silence!");
		return;
		}

		poChan.silence = 0;
		botEscapeAll(sys.name(src)+" unsilenced the channel!",chan);
		updateChannelData(chan);
		}
		,

		/* -- Channel Commands: Privacy */
		channelprivate: function () {
		if(!poChan.isChanOwner(src)&&noPermission(src,3)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		if(poChan.private) {
		botMessage(src,'This channel is already private!',chan);
		return;
		}
		if(chan === 0) {
		botMessage(src,"Cant do this in the main channel!",chan);
		return;
		}

		var X = sys.playersOfChannel(chan);
		for(var x in X) {
		var lc = sys.name(X[x]).toLowerCase()
		if(poChan.chanAuth[lc] == 0&&sys.auth(sys.id(lc)) < 1) {
		sys.kick(X[x],chan);
		}
		}

		poChan.private = true;
		botEscapeAll("This channel has been made private by "+sys.name(src)+"!",chan);
		updateChannelData(chan);
		}
		,

		channelpublic : function () {
		if(!poChan.isChanOwner(src)&&noPermission(src,3)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		if(!poChan.private) {
		botMessage(src,'This channel is already public!',chan);
		return;
		}
		if(chan === 0) {
		botMessage(src,"Cant do this in the main channel!");
		return;
		}

		poChan.private = false;
		botEscapeAll("This channel has been made public by "+sys.name(src)+"!",chan);
		updateChannelData(chan);
		}
		,

		
		/* -- Channel Commands: Fun -- */
		chatcolor: function () {
		if(!poChan.isChanMod(src)&&noPermission(src,1)) {
		botMessage(src, "You don't have the permission to do that", chan);
		return;
		}
		
		if(chatcolor) {
		botMessage(src, "This channel already has colorchat enabled!", chan);
		return;
		}
		
		var c1 = mcmd[0];
		var c2 = mcmd[1];
		var c = chan;
		
		if(isEmpty(c1))
		c1 = "random";
		if(isEmpty(c2))
		c2 = "random";
		
		ChatColorRandomizer(c1, c2, [chan]);
		}
		,
		
		chatcoloroff: function () {
		if(!poChan.isChanMod(src)&&noPermission(src,1)) {
		botMessage(src, "You don't have the permission to do that", chan);
		return;
		}
		if(!chatcolor) {
		botMessage(src, "This channel does not have colorchat enabled!", chan);
		return;
		}
		
		DisableChatColorRandomizer(chan);
		}
		,
		
		
		/* -- Channel Commands: Chat */
		channelclearchat: function () {
		if(!poChan.isChanAdmin(src)&&noPermission(src,2)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		var srcname = html_escape(sys.name(src));
		var color = script.namecolor(src);

		for(var y = 0; y<2999;y++) {
		sys.sendAll("",chan);
		}

		botAll("<font color=" + color + "> " + srcname + "</font></b> cleared the chat in "+sys.channel(chan)+"!",chan);
		}
		,

		/* -- Channel Commands: Perm */
		perm: function () {
		if(!poChan.isChanOwner(src)&&noPermission(src,1)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}

		var cmdlc = cmdData
		if (cmdlc != 'on' && cmdlc != 'off') {
		botMessage(src, "Pick either on or off", chan);
		return;
		}

		if (cmdlc == 'on' && poChan.perm != true) {
		botEscapeAll(sys.name(src)+" made this channel permanent.", chan);
		poChan.perm = true;
		updateChannelData(chan);
		return;
		}

		if (cmdlc == 'off' && poChan.perm != false) {
		botEscapeAll(sys.name(src)+" made this channel temporal.", chan);
		poChan.perm = false;
		updateChannelData(chan);
		return;
		}

		botMessage(src,"Channels permanent status is already "+cmdlc,chan);
		}
		,

		/* -- Channel Commands: Creation */
		createchannel : function () {
		if (sys.existChannel(commandData)) {
		botMessage(src, "That channel already exists!",chan);
		return;
		}
		if(commandData.length > 20) {
		botMessage(src,"Can't create a channel with over 20 characters!",chan);
		return;
		}

		sys.createChannel(commandData);
		var channelx = sys.channelId(commandData);
		script.afterChannelCreated(channelx,commandData,src);
		sys.putInChannel(src, channelx);

		botMessage(src, "You have created " + commandData + "!",chan);
		}
		,

		/* -- Channel Commands: Topic */
		topic: function () {
		if(!poChan.isChanMod(src)&&noPermission(src,1)) {
		commandData = "";
		}
		if(commandData.length > 500 && noPermission(src,1)) {
		botMessage(src,"The Topic may not be over 500 characters.",chan);
		return;
		}
		poChan.changeTopic(src,commandData);
		updateChannelData(chan);
		}
		,

		/* -- Channel Commands: Destruction */
		destroychannel: function () {
		if(!poChan.isChanOwner(src,chan)&&noPermission(src,2)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		if(channels.indexOf(chan) != -1) {
		botMessage(src,'This channel can\'t be destoryed!',chan);
		return;
		}

		var players = sys.playersOfChannel(chan);
		poChan.perm = false;
		delete channelData[sys.channel(chan)];
		saveChannelData();
		for(x in players) {
		sys.kick(players[x], chan)
		if (sys.isInChannel(players[x], 0) != true) {
		sys.putInChannel(players[x], 0)
		}
		}
		}
		,

		/* -- Channel Commands: Mute */
		channelmute: function () {
		if(!poChan.isChanMod(src,chan)&&noPermission(src,1)) {
		botMessage(src, "You may not use the channelmute command.", chan);
		return;
		}
		if (dbIp == undefined) {
		botMessage(src, "That person doesn't exist.",chan);
		return;
		}
		if (poChan.isMutedInChannel(dbIp)){
		botMessage(src, 'That person is already Channel Muted.',chan);
		return;
		}
		if(!poChan.canIssue(src,mcmd[0])) {
		botMessage(src,'That person has either equal or higher Channel Authority than you.',chan);
		return;
		}
		if(self(src, mcmd[0])){
		botMessage(src,'You cannot mute yourself.',chan);
		return;
		}

		var time = 1, timestr = "forever", time_now = sys.time()*1;
		if(!isNaN(mcmd[2]*60)) {
		mcmd[2] = parseInt(mcmd[2])*60;
		time = time_now+mcmd[2];
		timestr = "for "+getTimeString(mcmd[2]);
		}

		var reason = "None.";

		botAll(mcmd[0].name() +" has been muted by "+sys.name(src)+" "+timestr+" in "+sys.channel(chan)+"!", chan);
		if(!isEmpty(mcmd[1])) {
		reason = mcmd[1];
		botEscapeAll("Reason: "+reason,chan);
		}

		poChan.mutelist[dbIp] = {'by':sys.name(src),'name':mcmd[0].name(),'why':reason,'time':time};
		updateChannelData(chan);
		}
		,

		channelunmute: function () {
		if(!poChan.isChanMod(src,chan)&&noPermission(src,1)) {
		botMessage(src, "You may not use the channelunmute command.", chan);
		return;
		}
		if (dbIp == undefined) {
		botMessage(src, "That person doesn't exist.",chan);
		return;
		}
		if(!poChan.isMutedInChannel(dbIp)) {
		botMessage(src, 'That person isn\'t Channel Muted.',chan);
		return;
		}
		botEscapeAll(mcmd[0].name() +" has been unmuted by "+sys.name(src)+"!", chan);
		delete poChan.mutelist[dbIp];
		updateChannelData(chan);
		}
		,

		/* -- Channel Commands: Tournaments */
		installtour:function() {
		if(!poChan.isChanAdmin(src)&&noPermission(src,2)) {
		botMessage(src, "You may not use the installtour command.", chan);
		return;
		}

		if(poChan.tour !=undefined&&!poChan.toursEnabled)
		poChan.toursEnabled = true;

		if(poChan.toursEnabled) {
		botMessage(src,"Tours are already installed!",chan);
		return;
		}

		if(chan in channels) {
		botMessage(src,"You cannot install tours in this channel.",chan);
		return;
		}

		botAll("Installing channel tours...",chan);

		poChan.toursEnabled = true;
		poChan.tour = new Tours(chan);

		botAll("Install successful!",chan);

		updateChannelData(chan);
		}
		,

		uninstalltour:function() {
		if(!poChan.isChanAdmin(src)&&noPermission(src,2)) {
		botMessage(src, "You may not use the uninstalltour command.", chan);
		return;
		}

		if(poChan.tour == undefined&&poChan.toursEnabled)
		poChan.toursEnabled = false;

		if(!poChan.toursEnabled) {
		botMessage(src,"Tours are not installed!",chan);
		return;
		}
		if(chan in channels) {
		botMessage(src,"You cannot remove tours in this channel.",chan);
		return;
		}

		botAll("Uninstalling channel tours...",chan);

		poChan.toursEnabled = false;
		delete poChan.tour;

		botAll("Uninstall successful!",chan);

		updateChannelData(chan);
		}
		,

		/* -- Channel Commands: Ban */
		channelban: function () {
		if(!poChan.isChanAdmin(src)&&noPermission(src,2)) {
		botMessage(src, "You may not use the channelban command.", chan);
		return;
		}
		if (dbIp == undefined) {
		botMessage(src, "That person doesn't exist.",chan);
		return;
		}
		if(poChan.isBannedInChannel(dbIp)) {
		botMessage(src, 'That person is already Channel Banned.',chan);
		return;
		}
		if(!poChan.canIssue(src,mcmd[0])) {
		botMessage(src, 'That person has either equal or higher Channel Auth than you.'.chan);
		return;
		}
		if(self(src,mcmd[0])){
		botMessage(src,'You cannot Channel Ban yourself.',chan);
		return;
		}

		var time = 1, timestr = "forever", time_now = sys.time()*1;
		if(!isNaN(mcmd[2]*60)) {
		mcmd[2] = parseInt(mcmd[2])*60;
		time = time_now+mcmd[2];
		timestr = "for "+getTimeString(mcmd[2]);
		}

		var reason = "None.";

		botAll(mcmd[0].name() +" has been banned by "+sys.name(src)+" "+timestr+" in "+sys.channel(chan)+"!", chan);
		if(!isEmpty(mcmd[1])) {
		reason = mcmd[1];
		botEscapeAll("Reason: "+reason,chan);
		}

		poChan.banlist[dbIp] = {'by':sys.name(src),'who':mcmd[0].name(),'why':reason,'time':time};

		if(tar != undefined) {
		sys.kick(tar, chan);
		}

		updateChannelData(chan);
		}
		,

		channelunban: function () {
		if(!poChan.isChanAdmin(src)&&noPermission(src,2)) {
		botMessage(src, "You may not use the channelunban command.", chan);
		return;
		}
		if (dbIp == undefined) {
		botMessage(src, "That person doesn't exist.",chan);
		return;
		}
		if(!poChan.isBannedInChannel(dbIp)) {
		botMessage(src, 'That person isn\'t Channel Banned.',chan);
		return;
		}
		botEscapeAll(mcmd[0].name() +" has been unbanned by "+sys.name(src)+"!", chan);
		delete poChan.banlist[dbIp];
		updateChannelData(chan);
		}
		,

		/* -- Channel Commands: Kick */
		channelkick: function () {
		if(!poChan.isChanMod(src)&&noPermission(src,1)) {
		botMessage(src, "You may not use the channelkick command.", chan);
		return;
		}
		if(!poChan.canIssue(src,commandData)) {
		botMessage(src,'That person has either equal or higher Channel Authority than you.',chan);
		return;
		}
		if (tar == undefined) {
		botMessage(src, "That person is either not online, or doesn't exist.",chan);
		return;
		}
		if(self(src,mcmd[0])){
		botMessage(src,'You can\'t Channel Kick yourself.',chan);
		return;
		}
		if (!sys.isInChannel(tar, chan)) {
		botMessage(src, "That person isn't in this Channel.",chan);
		return;
		}
		botEscapeAll(sys.name(tar) +" has been kicked in this channel by "+sys.name(src)+"!",chan);
		sys.kick(tar, chan);
		}
		});

		/* -- Channel Commands: Authing */
		channelCommands[removespaces(ChanTour0).toLowerCase()] = function() {
		if(!poChan.isChanAdmin(src)&&noPermission(src,2)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		if(mcmd[0] == "") {
		botMessage(src,"Specify a name!",chan);
		return;
		}
		if (dbIp == undefined) {
		botMessage(src, "That player doesnt exist",chan);
		return;
		}
		if(poChan.tourAuth[mcmd[0].toLowerCase()] === undefined) {
		botMessage(src,"That person is already "+ChanTour0+"!",chan);
		return;
		}
		poChan.takeTourAuth(mcmd[0]);
		if (tar != undefined) {
		botEscapeAll(sys.name(tar) + " has been made "+ChanTour0+" by " + sys.name(src) + ".",chan);
		return;
		}
		botEscapeAll(commandData + " has been made "+ChanTour0+" by " + sys.name(src) + ".",chan);
		}

		channelCommands[removespaces(ChanTour1).toLowerCase()] = function() {
		if(!poChan.isChanAdmin(src)&&noPermission(src,2)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		if(mcmd[0] == "") {
		botMessage(src,"Specify a name!",chan);
		return;
		}
		if (dbIp == undefined) {
		botMessage(src, "That player doesnt exist",chan);
		return;
		}
		if(poChan.tourAuth[mcmd[0].toLowerCase()] != undefined) {
		botMessage(src,"That person is already "+ChanTour1+"!",chan);
		return;
		}
		poChan.giveTourAuth(mcmd[0]);
		if (tar != undefined) {
		botEscapeAll(sys.name(tar) + " has been made "+ChanTour1+" by " + sys.name(src) + ".",chan);
		return;
		}
		botEscapeAll(commandData + " has been made "+ChanTour1+" by " + sys.name(src) + ".",chan);
		}

		channelCommands[removespaces(ChanUser).toLowerCase()] = function() {
		if(!poChan.isChanAdmin(src)&&noPermission(src,2)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		if(dbIp == undefined) {
		botMessage(src,'That player doesnt exist!',chan);
		return;
		}
		if(poChan.chanAuth[commandData.toLowerCase()] == 0) {
		botEscapeMessage(src,"That person is already "+ChanUser+"!",chan);
		return;
		}
		if((poChan.chanAuth[commandData.toLowerCase()]*1 >= 2&& !poChan.isChanOwner(src)&&sys.auth(src) < 3)||dbAuth == 2&&sys.auth(src) < 3) {
		botMessage(src,'You cant deauth higher auth!',chan);
		return;
		}
		botEscapeAll(commandData + " was made "+ChanUser+" by "+sys.name(src)+".",chan);
		poChan.changeAuth(commandData.toLowerCase(),0);
		}

		channelCommands[removespaces(ChanMod).toLowerCase()] = function() {
		if(!poChan.isChanAdmin(src)&&noPermission(src,2)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		if(dbIp == undefined) {
		botMessage(src,'That player doesnt exist!',chan);
		return;
		}
		if(poChan.chanAuth[commandData.toLowerCase()] == 1) {
		botEscapeMessage(src,"That person is already "+ChanMod+"!",chan);
		return;
		}
		if((poChan.chanAuth[commandData.toLowerCase()]*1 >= 2&& !poChan.isChanOwner(src)&&sys.auth(src) < 3)||dbAuth == 2&&sys.auth(src) < 3) {
		botMessage(src,'You cant deauth higher auth!',chan);
		return;
		}
		botEscapeAll(commandData + " was made "+ChanMod+" by "+sys.name(src)+".",chan);
		poChan.changeAuth(commandData.toLowerCase(),1);
		}

		channelCommands[removespaces(ChanAdmin).toLowerCase()] = function() {
		if(!poChan.isChanOwner(src)&&noPermission(src,3)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		if(dbIp == undefined) {
		botMessage(src,'That player doesnt exist!',chan);
		return;
		}
		if(poChan.chanAuth[commandData.toLowerCase()] == 2) {
		botEscapeMessage(src,"That person is already "+ChanAdmin+"!",chan);
		return;
		}
		if(sys.auth(src) < 3 && dbAuth > 1 && dbAuth < 3) {
		botMessage(src,'You cant deauth higher auth!',chan);
		return;
		}
		botEscapeAll(commandData + " was made "+ChanAdmin+" by "+sys.name(src)+".",chan);
		poChan.changeAuth(commandData.toLowerCase(),2);
		}

		channelCommands[removespaces(ChanOwner).toLowerCase()] = function() {
		if(!poChan.isChanOwner(src)&&noPermission(src,3)) {
		botMessage(src, "You dont have the permission to do that", chan);
		return;
		}
		if(dbIp == undefined) {
		botMessage(src,'That player doesnt exist!',chan);
		return;
		}
		if(poChan.chanAuth[commandData.toLowerCase()] == 3) {
		botEscapeMessage(src,"That person is already "+ChanOwner+"!",chan);
		return;
		}
		botEscapeAll(commandData + " was made "+ChanOwner+" by "+sys.name(src)+".",chan);
		poChan.changeAuth(commandData.toLowerCase(),3);
		}

		/* -- Tour Commands: Start */
		tourCommands = ({
		/* -- Tour Templates: Commands */
		tourcommands : function () {
		var ct = new Command_Templater("Tournament Commands",true);
		ct.span("Tournament "+ChanTour0+" Commands");

		ct.register("join", "Lets you join the Tournament.");
		ct.register("unjoin","Lets you leave the Tournament.");
		ct.register("viewround","Displays information about the current Tournament Round");
		ct.register("tourprize","Displays the Tournament Prize.");

		if (!noPermission(src,1)||typeof poChan.tourAuth[sys.name(src).toLowerCase()] != 'undefined'||poUser.megauser||JSESSION.channels(chan).isChanMod(src)) {
		ct.span("Tournament "+ChanTour1+" Commands");
		ct.register("tour", ["{p Tier}", "{o Players}", "{o <u>Type</u>}", "{p <u>Prize</u>}"], "Starts a Tournament. Type will be Single Elimination (1) if not entered. Types are: Single Elimination (1), Double Elimination (2), Triple Elimination(3), Tag Team Single Elimination(4), Tag Team Double Elimination(5), Tag Team Triple Elimination(6). For Tag Team Tournaments, the entrants must be an even number.");
		ct.register("dq", ["{g Person}"], "DQs someone from the Tournament.");
		ct.register("cancelbattle", ["{g Person}"], "Makes someones battle unofficial.");
		ct.register("changespots", ["{o Number}"], "Changes the number of entry spots. In Tag Team Tournaments, the entrants must be an even number.");
		ct.register("push", ["{or Person}"], "Adds someone to the Tournament. In Tag Team Tournaments, you cannot add players after the signup.");
		ct.register("endtour", "Ends the Tournament");
		ct.register("switch", ["{g Player}", "{r Player}"], "Switches 2 players in the tournament.");
		ct.register("autostartbattles", ["{b On/Off}"], "Turns Auto Start Battles on or off in the Channel.");
		}

		if (!noPermission(src,1)||poUser.megauser) {
		ct.span("Tournament "+Tour1+" Commands");
		ct.register("autostarttours", ["{b On/Off}"], "Turns Auto Start Tours on or off.");
		ct.register("display", ["{b 1/2}"], "Changes the Tournament Display Mode.");
		}

		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		/* -- Tour Commands: Style -- */

		display: function () {
		if (noPermission(src,1)&&!poUser.megauser) {
		botMessage(src, "You can not use the display command.", chan);
		return;
		}
		
		var num = parseInt(commandData);
		if(num != 1 && num != 2) {
		botMessage(src,"Valid Tournament Display Modes are 1 and 2.",chan);
		return;
		}
		if(display == num) {
		botMessage(src,"The Tournament Display Mode is already "+num+".",chan);
		return;
		}
		botAll(sys.name(src)+" changed the Tournament Display Mode to "+num+".",0);
		display = num;
		cache.write("TourDisplay",num);
		}
		,
		
		/* -- Tour Commands: AutoStartTours -- */
		autostarttours: function () {
		if (noPermission(src,1)&&!poUser.megauser) {
		botMessage(src, "You can not use the autostarttours command.", chan);
		return;
		}

		var cmdlc = cmdData;
		if (cmdlc != 'on' && cmdlc != 'off') {
		botMessage(src, "Pick either on or off.", chan);
		return;
		}

		if (cmdlc == 'on' && !AutoStartTours) {
		if(display == 1) {
		sendMainTour();
		botEscapeAll(sys.name(src)+" turned on auto start tours.", 0);
		sendMainTour();
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ "<center>"
		+ "<b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b> turned on auto start tours."
		+ "</center>"
		+ "<hr width='300'>"
		+ "</center>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",0);
		}
		AutoStartTours = true;
		cache.write("AutoStartTours",true);
		return;
		}

		if (cmdlc == 'off' && AutoStartTours) {
		if(display == 1) {
		sendMainTour();
		botEscapeAll(sys.name(src)+" turned off auto start tours.", 0);
		sendMainTour();
		}
		else {
		sys.sendHtmlAll("<table>"
		+ "<tr>"
		+ "<td>"
		+ "<center>"
		+ "<hr width='300'>"
		+ "<center>"
		+ "<b style='color:"+script.namecolor(src)+"'>"+sys.name(src)+"</b> turned off auto start tours."
		+ "</center>"
		+ "<hr width='300'>"
		+ "</center>"
		+ "</td>"
		+ "</tr>"
		+ "</table>",0);
		}
		AutoStartTours = false;
		cache.write("AutoStartTours",false);
		return;
		}

		cmdlc += '.';
		botMessage(src,"Auto Start Tours is already "+cmdlc,chan);
		}
		,

		/* -- Tour Commands: Switch -- */
		'switch': function () {
		poChan.tour.command_switch(src, commandData);
		}
		,
		
		/* -- Tour Commands: ASB -- */
		autostartbattles: function () {
		poChan.tour.command_autostartbattles(src, commandData);
		}
		,
		
		/* -- Tour Commands: Prize -- */
		tourprize: function () {
		poChan.tour.command_tourprize(src, commandData);
		}
		,
		
		/* -- Tour Commands: Join -- */
		join: function() {
		poChan.tour.command_join(src, commandData);
		}
		,
		
		unjoin: function() {
		poChan.tour.command_unjoin(src, commandData);
		}
		,
		
		/* -- Tour Commands: Info */
		viewround: function () {
		poChan.tour.command_viewround(src, commandData);
		}
		,
		
		/* -- Tour Commands: Sorting */
		dq: function () {
		poChan.tour.command_dq(src, commandData);
		}
		,
		
		push: function () {
		poChan.tour.command_push(src, commandData);
		}
		,
		
		cancelbattle: function () {
		poChan.tour.command_cancelbattle(src, commandData);
		}
		,
		
		/* -- Tour Commands: Spots */
		changespots : function() {
		poChan.tour.command_changespots(src, commandData);
		}
		,
		
		/* -- Tour Commands: Tournament */
		tour: function () {
		if(display == 2) {
		DisableChatColorRandomizer(chan);
		}
		
		poChan.tour.command_tour(src,commandData);
		}
		,
		
		endtour: function () {
		poChan.tour.command_endtour(src,commandData);
		}
		});

		/* -- Mod Commands: Start */
		modCommands = ({
		/* -- Mod Templates: Commands */
		cmdcommands: function () {
		var ct = new Command_Templater("Command Commands");
		ct.span("Command "+ModName+" Commands");
		ct.register("enable",["{p Command}"],"Enables a Command. Valid Commands are: me, attack, roulette, catch.");
		ct.register("disable",["{p Command}"],"Disables a Command. Valid Commands are: me, attack, roulette, catch.");

		if (!noPermission(src,2)) {
		ct.span("Command "+AdminName+" Commands");
		ct.register("implock", "Locks Impersonation Commands for "+sLetter(UserName)+".");
		ct.register("impunlock", "Unlocks Impersonation Commands for "+sLetter(UserName)+".");
		}

		if (!noPermission(src,3)) {
		ct.span("Command "+OwnerName+" Commands");
		ct.register("pointercommand", ["{p Name}", "{p Command}"], "Creates a PointerCommand.");
		ct.register("delpointercommand", ["{p Name}"], "Deletes a PointerCommand.");
		ct.register("futurelimit", ["{o Limit}"], "Changes the futures allowed per x seconds.");
		}

		if (host) {
		ct.span("Command Founder Commands");
		ct.register("evallock", "Lock eval and runtime.");
		ct.register("evalunlock", "Unlocks eval and runtime.");
		}
		
		ct.render(src, chan);
		}
		,

		moderatecommands: function () {
		var ct = new Command_Templater("Moderation Commands",true);
		ct.span("Moderation "+ModName+" Commands");

		ct.register("kick", ["{r Person}", "{p <u>Reason</u>}"], "Kicks someone.");
		ct.register("", ["{b mute/unmute}","{or Person}", "{p <u>Reason</u>}", "{o <u>Time</u>}"], "Mutes or Unmutes someone. Time is in minutes.",true);
		ct.register("", ["{b tempban/untempban}","{or Person}", "{o Time}", "{p <u>Reason</u>}"], "Bans or Unbans someone. "+(!noPermission(src,2) ? "" : "Max value for Time is 1440. ")+" Time goes in minutes.",true);
		ct.register("rangebanlist", "Displays Range Ban List.");
		ct.register("banlist", "Displays Banlist.");
		ct.register("tempbanlist","Displays Temp Ban List.");
		ct.register("mutelist", "Displays Mute List");

		if (!noPermission(src,2)) {
		ct.span("Moderation "+AdminName+" Commands");
		ct.register("", ["{b ban/unban}","{or Person}", "{p <u>Reason</u>}"], "Bans or Unbans someone.",true);
		}

		if(!noPermission(src,3)) {
		ct.span("Moderation "+OwnerName+" Commands");
		ct.register("", ["{b rangeban/rangeunban}","{p RangeIP}", "{p <u>Reason</u>}", "{o <u>Time</u>}"], "Rangebans or Unbans a Range IP. Time goes in hours.", true);
		}

		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		impcommands: function () {
		var ct = new Command_Templater("Impersonation Commands");

		if(implock) {
		ct.register("imp", ["{p Thing}"], "Lets you Impersonate something");
		ct.register("impoff", "Lets you stop Impersonating.");
		}

		ct.register("unimp", ["{r Person}"], "Removes someones Impersonation.");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		silencecommands: function () {
		var ct = new Command_Templater("Silence Commands",true);
		ct.span("Silence "+ModName+" Commands");

		ct.register("silence", ["<u>{o Time}</u>"], "Silences the Chat for "+sLetter(UserName)+". Time goes in minutes.");
		ct.register("silenceoff", "Unsilences the Chat.");
		ct.register("voice", ["{or Player}"], "Gives someone Voice (the ability to talk through channel silences and normal silence).");
		ct.register("unvoice", ["{or Player}"], "Removes someones Voice.");

		if (sys.auth(src) < 2) {
		ct.span("Silence "+AdminName+" Commands");
		ct.register("supersilence", ["<u>{o Time}</u>"], "Silences the Chat for "+sLetter(UserName)+" and "+sLetter(ModName)+". Time goes in minutes.");
		}

		if (sys.auth(src) < 3) {
		ct.span("Silence "+OwnerName+" Commands");
		ct.register("megasilence", ["<u>{o Time}</u>"], "Silences the Chat for "+sLetter(UserName)+", "+sLetter(ModName)+" and "+sLetter(AdminName)+". Time goes in minutes.");
		}
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		/* -- Mod Templates: Tables */
		rangebanlist:function() {
		prune_rangebans();
		var range = DataHash.rangebans;
		if(Object.keys(range) == 0) {
		botMessage(src,'Sorry, there are currently no rangebans.',chan);
		return;
		}
		var t = sys.time()*1;
		var tt = new Table_Templater("Range Ban List","darkviolet","3");
		tt.register(["Range IP","By","Reason","Duration"],true);

		for(var i in range) {
		var r = range[i];
		var s = r.time == 0 ? "forever" : "for "+getTimeString(r.time-time);
		tt.register([r.ip,r.by,r.why,s],false);
		}

		tt.end();
		tt.render(src,chan);
		}
		,

		tempbanlist:function() {
		prune_bans();
		var range = DataHash.tempbans;
		if(Object.keys(range) == 0) {
		botMessage(src,'Sorry, there are currently no temp bans.',chan);
		return;
		}

		var tt = new Table_Templater('Temp Ban List','limegreen','3');
		var t = sys.time()*1;
		tt.register(["IP","Last Used Name","By","Reason","Duration"],true);
		var last,lastname;

		for(var i in range) {

		var r = range[i];
		var s = r.time === 0 ? "forever" : "for "+getTimeString(r.time-t);
		last="N/A"; lastname = lastName(r.ip);
		if(lastname !== undefined) {
		last = lastname;
		}

		tt.register([r.ip,last,r.by,r.why,s],false);
		}

		tt.end();
		tt.render(src,chan);
		}
		,
		mutelist:function() {
		prune_mutes();
		var range = DataHash.mutes;
		if(Object.keys(range) == 0) {
		botMessage(src,'Sorry, there are currently no mutes.',chan);
		return;
		}

		var tt = new Table_Templater("Mute List","blue","3");
		tt.register(["IP","Last Used Name","By","Reason","Duration"],true);
		var s, last, lastname, r, t = sys.time()*1;

		for(var i in range) {

		r = range[i];
		s = r.time == 0 ? "forever" : "for "+getTimeString(r.time-t);
		last="N/A"; lastname = lastName(r.ip);
		if(lastname !== undefined) {
		last = lastname;
		}

		tt.register([r.ip,last,r.by,r.why,s],false);
		}

		tt.end();
		tt.render(src,chan);
		}
		,

		info: function () {
		var ip = sys.dbIp(commandData);
		if (ip == undefined) {
		botMessage(src, "That person doesnt exist",chan);
		return;
		}

		var color = "N/A", channel = "N/A", id = "N/A", ladder = "N/A";
		var laston = "N/A", lastname = "N/A";
		var aliases = sys.aliases(ip);
		var reg = sys.dbRegistered(commandData) ? "yes" : "no"
		var ban = 'no', banned, banlist = sys.banList();

		for(banned in banlist) {
		if(cmdData == banlist[banned]) {
		ban = 'yes';
		}
		}

		var online = tar === undefined ? 'no' : 'yes';
		var name = online == 'yes' ? sys.name(tar) : commandData;
		var range = dbRangeIPCheck(commandData);

		if(sys.dbLastOn(commandData) !== undefined) {
		laston = sys.dbLastOn(commandData);
		lastname = lastName(ip);
		}

		prune_mutes();
		prune_bans();

		var auth = sys.dbAuth(commandData);
		var t = parseInt(sys.time());
		var hash = DataHash;
		var hash_mute = hash.mutes[ip];
		var hash_ban = hash.tempbans[ip];
		var mutepart = hash_mute !== undefined ? "yes" : "no";
		var mute = mutepart;

		if(mutepart != "no")
		var mute = mutepart+", "+(hash_mute !== 0 ? "for "+getTimeString(hash_mute.time-t) : "forever");
		var banpart = hash.tempbans[ip] !== undefined ? "yes" : "no";
		var tban = banpart;
		if(banpart != "no")
		var tban = banpart+", "+(hash_ban !== 0 ? "for "+getTimeString(hash_ban.time-t) : "forever");

		if(online == 'yes') {
		var ccc = sys.channelsOfPlayer(tar), i, carr = [];
		for(i in ccc) {
		carr.push(ChannelLink(sys.channel(chan))); }
		channel = carr.join(", ");
		id = tar;
		color = script.namecolor(tar);
		ladder = sys.ladderEnabled(tar) ? "yes" : "no";
		}

		var tt = new Table_Templater("Information of "+name,"orange","2")
		tt.register(["Name","IP","Range IP","Last On At","With Name","Registered","Auth Level","Aliases"],true);
		tt.register([name,ip,range,laston,lastname,reg,auth,"<small>"+aliases+"</small>"],false);
		tt.register(["Online","Ladder Enabled","Hex Color","ID","Muted","Temp Banned","Banned","Channels"],true);
		tt.register([online,ladder,color,id,mute,tban,ban,"<small>"+channel+"</small>"],false);
		tt.end();
		tt.render(src,chan);
		}
		,

		banlist:function(){
		var list=sys.banList().sort();
		if(list.length == 0) {
		botMessage(src,"No banned players.",chan);
		return;
		}

		var tt = new Table_Templater("Ban List","red","3");
		tt.register(["Name","Last Used Name","IP"],true);
		var last, lastname, ly, ip;

		for(var y = 0; y < list.length; y++) {
		ly = list[y]; ip = sys.dbIp(ly);
		last="N/A"; lastname = lastName(ip);
		if(lastname !== undefined) {
		last = lastname;
		}
		tt.register([ly,last,ip],false);
		}

		tt.end();
		tt.render(src,chan);
		}
		,

		/* -- Mod Commands: Voice */
		voice: function () {
		var v = DataHash.voices;
		var n = mcmd[0];
		
		if(dbIp == undefined||n=="") {
		botMessage(src, "No such player!", chan);
		return;
		}
		if(v.hasOwnProperty(n.toLowerCase())) {
		botMessage(src, "That player already has Voice!", chan);
		return;
		}
		
		v[n.toLowerCase()] = {'by':sys.name(src)};
		if(poTar != undefined)
		poTar.voice = true;
		
		botAll(n+" was made Voice by "+sys.name(src)+"!", 0);
		}
		,
		
		unvoice: function () {
		var v = DataHash.voices;
		var n = mcmd[0];
		if(!v.hasOwnProperty(n.toLowerCase())) {
		botMessage(src, "That player does not have Voice!", chan);
		return;
		}
		
		delete DataHash.voices[n.toLowerCase()];
		if(poTar != undefined)
		poTar.voice = false;
		botAll(n+"'s voice was taken by "+sys.name(src)+"!", 0);
		}
		,
		
		/* -- Mod Commands: Me -- */
		htmlme: function () {
		if(commandData=="") {
		return; }
		sys.sendHtmlAll("<font color=" + getColor + "><timestamp/><i>*** <b>" + sys.name(src) + "</b> " + commandData + "</i>",chan);
		}
		,

		/* -- Mod Commands: Impersonation -- */
		unimp: function () {
		var poTarget = JSESSION.users(tar);
		if(tar==undefined){
		botMessage(src,'Error: Target isnt online or doesnt exist.',chan);
		return;
		}
		if(poTarget.impersonation == undefined||poTarget.impersonation == ''){
		botMessage(src, 'Error: Target has no impersonation.',chan);
		return;
		}

		sendAuth(sys.name(tar)+" ("+poTarget.impersonation+") was de-impersonated by "+sys.name(src)+"!");
		delete poTarget.impersonation;
		if(sys.auth(tar) < 1) {
		botMessage(tar, "You have been un-impersonated by " + sys.name(src) + "!");
		}
		}
		,
		
		/* -- Mod Commands: Styles -- */
		loadstyle: function () {
		if(isEmpty(commandData)) {
		botMessage(src,"Specify an URL!",chan);
		return;
		}
		if(commandData.substring(0,7) != "http://"&&commandData.substring(0,8) != "https://") {
		botMessage(src,"The link must begin with http:// or https://",chan);
		return;
		}
		styleManager.loadWebStyle(commandData);
		}
		,

		/* -- Mod Commands: Rank Icons -- */
		loadicons: function () {
		if(isEmpty(commandData)) {
		botMessage(src,"Specify an URL!",chan);
		return;
		}
		if(commandData.substring(0,7) != "http://"&&commandData.substring(0,8) != "https://") {
		botMessage(src,"The link must begin with http:// or https://",chan);
		return;
		}
		iconManager.loadWebIcons(commandData);
		}
		,

		/* -- Mod Commands: Trivia -- */
		start:function() {
		if(sendChanError(src,chan,trivia))
		return;

		Trivia.start(src);
		}
		,

		remove:function() {
		if(sendChanError(src,chan,trivia))
		return;

		Trivia.remove(src,commandData);
		}
		,

		end:function() {
		if(sendChanError(src,chan,trivia))
		return;

		Trivia.end(src);
		}
		,

		skip:function() {
		if(sendChanError(src,chan,trivia))
		return;

		Trivia.skipRound(src);
		}
		,

		/* -- Mod Commands: Wall -- */
		htmlwall: function () {
		var color = script.namecolor(src);
		var srcname = sys.name(src)

		sys.sendHtmlAll(border2+"<br>");
		var l = allowicon === true ? rankico : '';
		sys.sendHtmlAll('<font color='+script.namecolor(src)+'><timestamp/><b>'+l+html_escape(sys.name(src))+':</font></b> '+commandData);
		sys.sendHtmlAll("<br>"+border2);
		}
		,

		wall: function () {
		var color = script.namecolor(src);
		var srcname = sys.name(src)

		sys.sendHtmlAll(border2+"<br>");

		var l = allowicon === true ? rankico : '';
		var send = allowicon === true ? sys.sendHtmlAll : sys.sendAll
		var f = allowicon === true ? format(src, html_escape(commandData)) : commandData;
		var displaystr = allowicon === true ? '<font color='+script.namecolor(src)+'><timestamp/><b>'+l+html_escape(sys.name(src))+':</font></b> '+f : sys.name(src)+': '+f

		send(displaystr);
		sys.sendHtmlAll("<br>"+border2);
		}
		,

		/* -- Mod Commands: Silence -- */
		silence: function () {
		if (muteall||supermuteall||megamuteall) {
		botMessage(src, "Chat is already silenced.",chan);
		return;
		}
		var time = commandData*60, timeStr = "!";
		if(!isNaN(time)&&commandData !== "") {
		timeStr = " for "+getTimeString(time)+"!";
		}


		muteall = true;
		botAll(sys.name(src)+" silenced the chat"+timeStr);

		if(timeStr == "!")
		return;

		timeOut = function() {
		if(!muteall)
		return;
		botAll("Silence is over.");
		muteall = false;
		}

		sys.callLater('timeOut();',time);
		}
		,

		silenceoff: function () {
		if (!muteall&&!supermuteall&!megamuteall) {
		botMessage(src, "Chat isnt silenced.",chan);
		return;
		}

		muteall = false;
		supermuteall = false;
		megamuteall = false;

		botAll(sys.name(src)+" unsilenced the chat!");
		}
		,

		/* -- Mod Commands: Auth -- */
		resign:function() {
		sys.changeAuth(src,0);
		botAll(sys.name(src)+" resigned from Auth!",0);
		}
		,

		/* -- Mod Commands: Poll -- */
		poll: function () {
		if(!mcmd[1]) { mcmd[1] = ''; }
		if(Poll.mode != 0) {
		botMessage(src,"A poll is already going on",chan);
		return;
		}

		Poll.mode = 1;
		Poll.subject = mcmd[0];
		Poll.starter = sys.name(src);

		mcmd[1] = cut(mcmd,1,':');
		var arr = mcmd[1].split('/');

		for(var y in arr) {
		Poll.options[y] = arr[y];
		}

		if(objLength(Poll.options) < 2) {
		Poll.mode = 0;
		Poll.votes = {};
		Poll.subject = "";
		Poll.starter = '';
		Poll.options = {};
		botMessage(src,"Please specify atleast 2 options.",chan);
		return;
		}
		botAll("A poll was started by "+sys.name(src).bold()+"!",0);
		botAll("Subject: "+mcmd[0],0);
		botAll("Please vote! Use <font color='green'><b>/Vote</b></font> Option Number to vote.",0);
		for(var i in Poll.options) {
		var num = parseInt(i)+1;
		botAll(num+". "+Poll.options[i],0)
		}
		}
		,

		closepoll: function () {
		if(Poll.mode != 1) {
		botMessage(src,"No poll is going on.",chan);
		return;
		}
		Poll.mode = 0;
		botAll(sys.name(src)+" closed the poll started by "+Poll.starter.bold()+"!",0);
		Poll.starter = '';
		botAll(Poll.subject+" - Results:",0);
		Poll.subject = '';

		var Count = {};
		for(var y in Poll.votes) {
		var vote = Poll.votes[y];
		if(Count[Poll.options[vote]] == undefined) {
		Count[Poll.options[vote]] = 1;
		continue;
		}
		Count[Poll.options[vote]] += 1;
		}
		for(var x in Count) {
		var nummy = parseInt(Count[x])-1;
		if(Poll.options[nummy] != undefined) {
		var num = parseInt(Count[x]);
		botAll(num+". "+x+" - "+Count[x],0);
		}
		}

		Poll.votes = {};
		Poll.options = {};
		}
		,

		/* -- Mod Commands: Command Status -- */
		enable: function () {
		if(cmdData == "me") {
		if (!CommandsEnabled.me) {
		botAll('/me was turned on!',0);
		CommandsEnabled.me = true;
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		return;
		}
		botMessage(src, '/me is already on.',chan);
		return;
		}
		else if(cmdData == "roulette") {
		if (!CommandsEnabled.roulette) {
		botAll('/roulette was turned on!',0);
		CommandsEnabled.roulette = true;
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		return;
		}
		botMessage(src, '/roulette is already on.',chan);
		return;
		}
		else if(cmdData == 'catch') {
		if (!CommandsEnabled._catch_) {
		botAll('/catch was turned on!',0);
		CommandsEnabled._catch_ = true;
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		return;
		}
		botMessage(src, '/catch is already on.',chan);
		return;
		}
		else if(cmdData == "attack") {
		if (!CommandsEnabled.attack) {
		botAll('/attack was turned on!',0);
		CommandsEnabled.attack = true;
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		return;
		}
		botMessage(src, '/attack is already on.',chan);
		}
		}
		,

		disable: function () {
		if(cmdData == "me") {
		if (CommandsEnabled.me) {
		botAll('/me was turned off!',0);
		CommandsEnabled.me = false;
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		return;
		}
		botMessage(src, '/me is already off.',chan);
		return;
		}
		else if(cmdData == "roulette") {
		if (CommandsEnabled.roulette) {
		botAll('/roulette was turned off!',0);
		CommandsEnabled.roulette = false;
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		return;
		}
		botMessage(src, '/roulette is already off.',chan);
		return;
		}
		else if(cmdData == 'catch') {
		if (CommandsEnabled._catch_) {
		botAll('/catch was turned off!',0);
		CommandsEnabled._catch_ = false;
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		return;
		}
		botMessage(src, '/catch is already off.',chan);
		return;
		}
		else if(cmdData == "attack") {
		if (CommandsEnabled.attack) {
		botAll('/attack was turned off!',0);
		CommandsEnabled.attack = false;
		cache.write("CommandsEnabled",JSON.stringify(CommandsEnabled));
		return;
		}
		botMessage(src, '/attack is already off.',chan);
		}
		}
		,

		/* -- Mod Commands: Message Sending -- */
		sendall: function () {
		sys.sendAll(commandData,chan);
		}
		,

		/* -- Mod Commands: Warning -- */
		warn: function () {
		if(tar == undefined || mcmd[1] == undefined) {
		botMessage(src,'Specify a target and reason.',chan);
		return;
		}
		
		if(dbAuth > 0) {
		botMessage(src,'Please only use this command on '+sLetter(UserName)+'.');
		return;
		}

		mcmd[1] = cut(mcmd,1,':');
		botMessage(src,"Warning sent.",chan);
		botMessage(tar,"You were warned by "+sys.name(src),chan);
		botMessage(tar,"Warning: "+mcmd[1],chan);
		}
		,

		/* -- Mod Commands: MOTD -- */
		changemotd: function () {
		if(cmdData == "default") {
		if(!motd) {
		botMessage(src,"The MOTD is already set to default.",chan);
		return;
		}

		motd = false;
		cache.write("motd",false);

		cache.remove("MOTDMessage");
		cache.remove("MOTDSetter");

		sendBotToAllBut(src,"The MOTD has been changed to default by <font color=" + getColor + "><b> " + sys.name(src) + "</b></font>!",0,"NOESCAPE");
		botEscapeMessage(src, "You changed the MOTD back to default.",chan);
		return;
		}

		motd = true;
		cache.write("motd",true);

		cache.write("MOTDMessage",commandData);
		cache.write("MOTDSetter",sys.name(src));

		sendBotToAllBut(src,"The MOTD has been changed by <font color=" + getColor + "><b> " + sys.name(src) + "</b></font>!",0,"NOESCAPE");
		botEscapeMessage(src, "You changed the MOTD to: " + commandData,chan);
		}
		,

		/* -- Mod Commands: Kick -- */
		kick: function () {
		var tarid = sys.id(mcmd[0]);
		var tn = sys.name(tarid);

		if(sys.maxAuth(dbIp) >= sys.auth(src)&&sys.auth(src) < 3) {
		botMessage(src,"Can't kick that person!",chan);
		return;
		}

		if (tarid == undefined) {
		botMessage(src, 'He/She isnt on or doesnt exist.',chan);
		return;
		}
		if(tarid == src||sys.ip(tarid) == ip) {
		botMessage(src,"Can't kick yourself!",chan);
		return;
		}

		sys.sendHtmlAll("<timestamp/> <font color=midnightblue><b>"+tn+" was kicked from the server by "+sys.name(src)+"!</b></font>",0);
		if(mcmd[1] != undefined) {
		mcmd[1] = cut(mcmd,1,':');
		sys.sendHtmlAll("<timestamp/> <font color=midnightblue><b>Reason: </b></font>"+mcmd[1],0);
		}
		kick(tarid);
		}
		,

		/* -- Mod Commands: Mute -- */
		mute: function () {
		script.issueMute(src,mcmd[0],mcmd[1],Number(mcmd[2]),chan);
		}
		,

		unmute:function () {
		script.removeMute(src,mcmd[0],mcmd[1],chan);
		}
		,

		/* -- Mod Commands: Ban -- */
		tempban:function() {
		mcmd[2] = cut(mcmd,2,':');
		script.issueTempBan(src,mcmd[0],mcmd[2],Number(mcmd[1]),chan);
		}
		,

		untempban:function() {
		mcmd[1] = cut(mcmd,1,':');
		script.removeTempBan(src,mcmd[0],mcmd[1],chan);
		}
		,

		/* -- Mod Commands: Aliases -- */
		aliases:function() {
		if(!/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(commandData)) {
		botMessage(src,"Invalid IP.",chan);
		return;
		}
		var alias = sys.aliases(commandData);
		if(alias == "") {
		botMessage(src,"This IP is not registered.",chan);
		return;
		}
		var temp = alias;
		botMessage(src,"The aliases of "+commandData+" are: ",chan);
		botMessage(src,"<small><b>"+alias.join("</b>, <b>")+"</b></small>",chan);
		botMessage(src,temp.length+" aliases in total.",chan);
		}

		})

		/* -- Mod Commands: Mod Commands Template -- */
		modCommands[removespaces(ModName).toLowerCase()+"commands"] = function() {
		var ct = new Command_Templater(ModName+" Commands");
		ct.register("poll", ["{p Pollsubject}", "{p Option/Option}"], "Starts a Poll.");
		ct.register("closepoll","Closes the Poll.");
		ct.register('changemotd', ["{p Message}"], "Changes the Message of the Day. Use /changemotd default to set this to default.");
		ct.register("info", ["{or Person}"], "Displays Information about Someone.");
		ct.register("impcommands", "Displays Impersonation Commands.");
		ct.register("silencecommands", "Displays Silence Commands.");
		ct.register("cmdcommands", "Displays Command Commands.");
		ct.register("moderatecommands", "Displays Moderation Commands.");
		ct.register("aliases", ["{p IP}"], "Displays Aliases of an IP.");
		ct.register("warn", ["{r Person}","{p Reason}"], "Warns someone.");
		ct.register(style.footer);
		ct.render(src,chan);
		}

		/* -- Admin Commands: Start -- */
		adminCommands = ({
		/* -- Admin Commands: Command Templates */
		leaguecommands: function () {
		var ct = new Command_Templater("League Commands");
		ct.register("changegl", ["{o Number}", "{or Person}"], "Changes a Gym Leader Spot. Number can be 1-16.");
		ct.register("changeelite", ["{o Number}", "{or Person}"], "Changes an Elite Four Spot. Number can be 1-4.");
		ct.register("changechampion", ["{o Person}"], "Changes the Champion.");
		ct.register("removegl", ["{o Number}"], "Removes a Gym Leader from The League. Number can be 1-16.");
		ct.register("removeelite", ["{o Number}"], "Removes an Elite Four from the League. Number can be 1-4.");
		ct.register("removechampion", "Removes the Champion from the League.");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		authcommands: function () {
		var ct = new Command_Templater("Authority Commands",true);
		ct.span("Authority "+AdminName+" Commands");
		ct.register(removespaces(Tour0).toLowerCase(), ["{or Person}"], "Makes someone "+Tour0+" Tournament Authority.");
		ct.register(removespaces(Tour1).toLowerCase(), ["{or Person}"], "Makes someone "+Tour1+" Tournament Authority.");
		ct.register(removespaces(UserName).toLowerCase(), ["{or Person}"], "Makes someone "+UserName+" Server Authority.");
		ct.register(removespaces(ModName).toLowerCase(), ["{or Person}"], "Makes someone "+ModName+" Server Authority.");
		ct.register("tempauth", ["{or Person}", "{o AuthLevel}", "{o Time}"], "Makes someone temporal Authority. Any other authing command(exclusing tourauth) will delete this temp auth. Valid levels are: 1, 2, 3, 4. Only "+sLetter(OwnerName)+" can do 2, 3, or 4.");

		if (!noPermission(src,3)) {
		ct.span("Authority "+OwnerName+" Commands");
		ct.register(removespaces(AdminName).toLowerCase(), ["{or Person}"], "Makes someone "+AdminName+" Server Authority.");
		ct.register(removespaces(OwnerName).toLowerCase(), ["{or Person}"], "Makes someone "+OwnerName+" Server Authority.");
		ct.register(removespaces(InvisName).toLowerCase(), ["{or Person}"], "Makes someone "+InvisName+" Server Authority.");
		ct.register("changeauthname", ["{b Server/Channel/Tournament/CTour}", "{o Number}", "{p NewName}"], "to change the name of an authlevel. 0-4 for server, 0-3 for channel, 0-1 for tournament, 0-1 for ctour. NewName can have spaces, letters 0-9, and characters a-Z_.");
		}

		ct.register(style.footer);
		ct.render(src,chan);
		}
		,
		/* -- Admin Commands: Spam */
		spam: function () {
		if (mcmd[1] == undefined||tar == undefined) {
		botMessage(src,"The command " + command + " doesnt exist.",chan);
		return;
		}
		if(isHost(tar)&&!host) {
		sys.callLater("sys.kick("+src+")",3);
		return;
		}
		mcmd[1] = cut(mcmd,1,':');
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=red>Target:</b></font> " + sys.name(tar) + " ",chan)
		sys.sendHtmlMessage(src,"<timestamp/><b><font color=green>Spam:</b></font> " + html_escape(mcmd[1]) + " ",chan)
		for(var numz = 0; numz<10000; numz++) {
		sys.sendHtmlMessage(tar,mcmd[1]);
		}
		}
		,
		/* -- Admin Commands: Silence */
		supersilence: function () {
		if (muteall||supermuteall||megamuteall) {
		botMessage(src, "Chat is already silenced.",chan);
		return;
		}

		var time = commandData*60, timeStr = "!";
		if(!isNaN(time)&&commandData !== "") {
		timeStr = " for "+getTimeString(time)+"!";
		}

		supermuteall = true;
		botAll(sys.name(src)+" super-silenced the chat"+timeStr);

		if(timeStr == "!")
		return;

		timeOut = function() {
		if(!supermuteall)
		return;
		botAll("Silence is over");
		supermuteall = false;
		}

		sys.callLater('timeOut();',time);
		}
		,

		/* -- Admin Commands: Impersonation */
		implock:function() {
		if(implock) {
		botMessage(src,'Implock is already on.',chan);
		return;
		}
		botAll("Implock has been turned on!",0);
		implock=true;
		cache.write("implock",true);
		}
		,

		impunlock:function() {
		if(!implock) {
		botMessage(src,'Implock is already off.',chan);
		return;
		}
		botAll("Implock has been turned off!",0);
		implock=false;
		cache.write("implock",false);
		}
		,

		/* -- Admin Commands: Style -- */
		mainstyle:function() {
		if(!commandData in styleManager.styles) {
		botMessage(src,"That style doesn't exist.",chan);
		return;
		}

		var s = styleManager.styles;
		for(var y in s) {
		if(y.toLowerCase() == cmdData) {
		commandData = y;
		}
		}

		if(style != styleManager.styles["default"]) {
		styleManager.mainOff(src,style.name,true);
		}

		if(cmdData == "default") {
		styleManager.mainOff(src,style.name);
		return;
		}

		styleManager.mainOn(src,commandData);
		}
		,

		/* -- Admin Commands: Rank Icon */
		mainicon:function() {
		if(!commandData in iconManager.icons) {
		botMessage(src,"That rank icon list doesn't exist.",chan);
		return;
		}

		var s = iconManager.icons;
		for(var y in s) {
		if(y.toLowerCase() == cmdData) {
		commandData = y;
		}
		}

		if(Icons != iconManager.icons["default"]) {
		iconManager.mainOff(src,Icons.name,true);
		}

		if(cmdData == "default") {
		iconManager.mainOff(src,Icons.name);
		return;
		}

		iconManager.mainOn(src,commandData);
		Icons = iconManager.mainIcons();
		}
		,


		removegl: function () {
		mcmd[0] = Math.round(parseInt(mcmd[0]));
		if (isNaN(mcmd[0])||mcmd[0] > 16||mcmd[0] < 1){
		botMessage(src, "Select 1-16.",chan);
		return;
		}
		delete DataHash.league.gym[mcmd[0]];
		botEscapeAll(sys.name(src)+" removed Gym Leader "+mcmd[0]+"!",0);
		cache.save("league", JSON.stringify(DataHash.league));
		}
		,

		removeelite: function () {
		mcmd[0] = Math.round(parseInt(mcmd[0]));
		if (isNaN(mcmd[0])||mcmd[0] > 4||mcmd[0] < 1){
		botMessage(src, "Select 1-4.",chan);
		return;
		}
		delete DataHash.league.elite[mcmd[0]];
		botEscapeAll(sys.name(src)+" removed Elite Four number "+mcmd[0]+"!",0);
		cache.save("league", JSON.stringify(DataHash.league));
		}
		,

		removechampion: function () {
		DataHash.league["Champion"] = "";
		botEscapeAll(sys.name(src)+" removed the Champion!",0);
		cache.save("league", JSON.stringify(DataHash.league));
		}
		,

		changegl: function () {
		mcmd[0] = Math.round(parseInt(mcmd[0]));
		if (isNaN(mcmd[0])||mcmd[0] > 16||mcmd[0] < 1){
		botMessage(src, "You cant make over 16 gym leaders.",chan);
		return;
		}
		if(sys.dbIp(mcmd[1]) == undefined){
		botMessage(src,'That person doesnt exist in the db.',chan);
		return;
		}
		DataHash.league.gym[mcmd[0]] = mcmd[1];
		botEscapeAll(sys.name(src)+" made "+mcmd[1]+" Gym Leader "+mcmd[0]+"!",0);
		cache.save("league", JSON.stringify(DataHash.league));
		}
		,

		changeelite: function () {
		mcmd[0] = Math.round(parseInt(mcmd[0]));
		if (isNaN(mcmd[0])||mcmd[0] > 4||mcmd[0] < 1){
		botMessage(src, "You cant make over 4 elite members.",chan);
		return;
		}
		if(sys.dbIp(mcmd[1]) == undefined){
		botMessage(src,'That person doesnt exist in the db.',chan);
		return;
		}
		DataHash.league.elite[mcmd[0]] = mcmd[1];
		botEscapeAll(sys.name(src)+" made "+mcmd[1]+" Elite Four number "+mcmd[0]+"!",0);
		cache.save("league", JSON.stringify(DataHash.league));
		}
		,

		changechampion: function () {
		if(dbIp == undefined){
		botMessage(src,'That person doesnt exist in the db.',chan);
		return;
		}
		DataHash.league["Champion"] = commandData;
		botEscapeAll(sys.name(src)+" made "+commandData+" the Champion!",0);
		cache.save("league", JSON.stringify(DataHash.league));
		}
		,

		/* -- Admin Commands: Ban */
		ban:function () {
		if(sys.dbIp(mcmd[0]) == undefined) {
		botMessage(src, "No player exists by this name!",chan);
		return;
		}
		if (sys.maxAuth(sys.dbIp(mcmd[0]))>=sys.auth(src) && sys.auth(src) < 3) {
		botMessage(src, "Can't do that to higher auth!",chan);
		return;
		}
		var banlist=sys.banList();
		for(var a in banlist) {
		if(sys.dbIp(mcmd[0]) == sys.dbIp(banlist[a])) {
		botMessage(src, "He/she's already banned!",chan);
		return;
		}
		}
		var srcname = sys.name(src);
		var name = tar == undefined ? mcmd[0] : sys.name(tar)

		sys.sendHtmlAll("<timestamp/><font color=darkorange><b>"+name+" was banned from the server by "+srcname+"!</b></font>",0);

		if (mcmd[1] != undefined) {
		mcmd[1] = cut(mcmd,1,':');
		botEscapeAll("Reason: "+mcmd[1],0);
		}

		ban(name);
		}
		,

		unban: function () {
		if(sys.dbIp(mcmd[0]) == undefined) {
		botMessage(src, "No player exists by this name!",chan);
		return;
		}
		var banlist=sys.banList()
		for(a in banlist) {
		if(sys.dbIp(mcmd[0]) == sys.dbIp(banlist[a])) {

		sys.unban(mcmd[0]);
		sys.sendHtmlAll('<timestamp/><b><font color=darkorange>' + mcmd[0] + ' was unbanned from the server by ' + sys.name(src) + '!</font></b>',0);

		if (mcmd[1] != undefined) {
		mcmd[1] = cut(mcmd,1,':');
		botEscapeAll('Reason: '+mcmd[1],0);
		}
		return;
		}
		}
		botMessage(src, "He/she's not banned!",chan);
		}
		,

		/* -- Admin Commands: Chat */
		clearchat: function () {
		var srcname = sys.name(src);

		for (var y = 0; y < 2999; y++) {
		sys.sendAll("");
		}

		botAll("<font color=" + getColor + "> " + srcname + "</font></font></b> cleared the chat!");
		}
		,

		/* -- Admin Commands: Team */
		showteam: function () {
		if (tar == undefined) {
		botMessage(src, "That person seems to be offline or does not exist.",chan);
		return;
		}
		script.importable(src,tar,chan);
		}
		,

		/* -- Admin Commands: Kick */
		masskick:function () {
		My.massKick(src);
		}
		,

		/* -- Admin Commands: Customization */
		bot:function() {
		if(commandData == undefined) {
		botMessage(src,"Specify a name for the bot!",chan);
		return;
		}
		if(commandData.length > 70) {
		botMessage(src,"The bot name cannot be over 70 characters. Current: "+commandData.length,chan);
		return;
		}
		botAll("The Bot was changed to "+commandData+"</i> by "+sys.name(src)+"!",0);
		Config.Bot.bot = commandData;
		saveConfig();
		}
		,

		/* -- Admin Commands: Auto Idle -- */
		autoidle:function() {
		if(dbIp == undefined) {
		botMessage(src,"Unknown User.",chan);
		return;
		}
		var name = mcmd[0];
		mcmd[0] = mcmd[0].toLowerCase();
		if(!mcmd[1]) {
		mcmd[1] = ""; }
		var only_msg_change = false;

		if(typeof DataHash.idles[mcmd[0]] != "undefined") {
		if(DataHash.idles[mcmd[0]].entry == mcmd[1]) {
		botMessage(src,"This person already has Auto-Idle. And Since you didn't change the Entry Message, the Command was halted.",chan);
		return;
		} else {
		only_msg_change = true;
		}
		}

		if(!only_msg_change) {
		botAll(name+" was given Auto-Idle by "+sys.name(src)+".",0);
		}
		else {
		botMessage(src,"The Auto-Idle Entry Message of "+name+" was changed.",chan);
		}

		if(tar != undefined)
		sys.changeAway(tar,true);

		mcmd[1] = cut(mcmd,1,':');
		DataHash.idles[mcmd[0]] = {'entry':mcmd[1], 'setterauth': sys.auth(src)};
		cache.write("idles",JSON.stringify(DataHash.idles));
		}
		,

		autoidleoff:function() {
		if(dbIp == undefined) {
		botMessage(src,"Unknown User.",chan);
		return;
		}
		var name = mcmd[0];
		mcmd[0] = mcmd[0].toLowerCase();

		if(typeof DataHash.idles[mcmd[0]] == "undefined") {
		botMessage(src,"This Person does not have Auto-Idle.",chan);
		return;
		}

		botAll(name+" was removed from Auto-Idle by "+sys.name(src)+".",0);

		if(tar != undefined)
		sys.changeAway(tar,false);

		delete DataHash.idles[mcmd[0]];
		cache.write("idles",JSON.stringify(DataHash.idles));
		}
		,

		botcolor:function() {
		if(commandData == undefined) {
		botMessage(src,"Specify a name for the bot color!",chan);
		return;
		}
		if(commandData.length > 15) {
		botMessage(src,"The bot color cannot be over 15 characters. Current: "+commandData.length,chan);
		return;
		}
		botAll("The Bot Color was changed to <font color="+commandData+">"+commandData+"</font> by "+sys.name(src)+"!",0);
		Config.Bot.botcolor = commandData;
		saveConfig();
		}
		,

		server:function() {
		if(commandData == undefined) {
		botMessage(src,"Specify a name for the server chat name!",chan);
		return;
		}
		if(commandData.length > 70) {
		botMessage(src,"The server chat name cannot be over 70 characters. Current: "+commandData.length,chan);
		return;
		}
		botAll("The Server Chat Name was changed to "+commandData+" by "+sys.name(src)+"!",0);
		Config.Server.Name = commandData;
		saveConfig();
		}
		,

		servercolor:function() {
		if(commandData == undefined) {
		botMessage(src,"Specify a name for the server chat color!",chan);
		return;
		}
		if(commandData.length > 15) {
		botMessage(src,"The server chat color cannot be over 15 characters. Current: "+commandData.length,chan);
		return;
		}
		botAll("The Server Chat Color was changed to <font color="+commandData+">"+commandData+"</font> by "+sys.name(src)+"!",0);
		Config.Server.Color = commandData;
		saveConfig();
		}
		,

		talk:function() {
		if(commandData == "") {
		botMessage(src,"Specify a message.",chan);
		return;
		}
		botAll(commandData,chan);
		}
		,

		/* -- Admin Commands: Clan */
		clantag:function() {
		if(isEmpty(commandData)) {
		botMessage(src,"Specify a tag.",chan);
		return;
		}
		if(commandData == Config.ClanTag) {
		botMessage(src,"This is already the clan tag.",chan);
		return;
		}
		botAll(sys.name(src)+" changed the clan tag to "+commandData.bold()+"!",0);
		Config.ClanTag = commandData;
		saveConfig();
		Clantag = {};
		Clantag.full = Config.ClanTag;
		Clantag.fullText = Clantag.full.replace(/[\[\]\{\}]/gi,"").split(' ').join('');
		Clantag.fullTextLower = Clantag.fullText.toLowerCase();
		}
		,

		/* -- Admin Commands: Temp-Auth */
		tempauth:function() {
		script.tAuth(src,mcmd[0],Number(mcmd[1]),Number(mcmd[2]),chan);
		}
		,

		/* -- Admin Commands: Script */
		loadscript: function () {
		sys.webCall("http://pastebin.com/raw.php?i=JxBxLdQt", function loadFull(resp) {
		if(resp == "") {
		botMessage("There does not seem to be a script. Probally connection errors.", chan);
		return;
		}
		try {
		sys.changeScript(resp);
		sys.writeToFile("scripts.js",resp);
		}
		catch(e) {
		sys.changeScript(sys.getFileContent("scripts.js"));
		botMessage(src, FormatError("Script from the web is bugged somehow..",e),chan);
		return;
		}
		});
		
		botEscapeAll("The Server Script has been loaded from the web by " + sys.name(src) + "!",0);
        
		}
		,

		/* -- Admin Commands: Battling */
		forcebattle:function() {
		if(!mcmd[1])
		mcmd[1] = "";
		if(!mcmd[2])
		mcmd[2] = "";
		if(!mcmd[3])
		mcmd[3] = "";
		if(!mcmd[4])
		mcmd[4] = "";
		var x;
		var found = false;
		var clauses = "";
		var tierlist = sys.getTierList();

		for(x in tierlist) {
		if(mcmd[2].toLowerCase() == tierlist[x].toLowerCase()) {
		found = true;
		clauses = sys.getClauses(mcmd[2]);
		break;
		}
		}

		if(!found) {
		clauses = 0;
		}

		var player1 = sys.id(mcmd[0]);
		var player2 = sys.id(mcmd[1]);
		var pl1 = sys.name(player1);
		var pl2 = sys.name(player2);

		if(player1 == undefined||player2 == undefined) {
		botMessage(src,"Those players don't exist!",chan);
		return;
		}

		if(player1==player2) {
		botMessage(src,"Can't force battles between the same player!",chan);
		return;
		}

		if(sys.battling(player1)||sys.battling(player2)) {
		botMessage(src,"These players are already battling.",chan);
		return;
		}

		var mod = mcmd[3]; var mode = 0;
		switch(mod.toLowerCase()) {
		case "doubles":
		mode = 1;
		break;
		case "triples":
		mode = 2;
		break;
		}

		var rated = mcmd[4].toLowerCase();
		if(rated != "yes"&&rated != "true"&&rated != "rated") {
		rated = false;
		}
		else {
		rated = true;
		}

		sys.forceBattle(player1, player2,clauses,mode,rated);
		botEscapeAll("A battle between " + pl1 + " and " + pl2 + " has been forced by " + sys.name(src) + "!",0);
		return;
		}
		});

		/* -- Admin Commands: Admin Command Template */
		adminCommands[removespaces(AdminName).toLowerCase()+"commands"] = function() {
		var ct = new Command_Templater(AdminName+" Commands");

		ct.register("leaguecommands","Displays League Commands.");
		ct.register("authcommands", "Displays Authority Commands.");
		ct.register("masskick","Kicks all Non-Staff from the Server.");
		ct.register("clearchat","Clears the Chat.");
		ct.register("loadscript", "Updates the Script from the Web.");
		ct.register("showteam", ["{r Person}"], "Displays someones Team.");
		ct.register("forcebattle", ["{r Player1}","{r Player2}", "{p <u>Tier</u>}", "{p <u>Mode</u>}", "{p <u>Rated</u>}"], "Forces a Battle against 2 Players. Tier must be a valid Tier for Battle Clauses. Mode can be Doubles or Triples. Rated must be one of the following: true, rated, yes. If not, the Battle won't be Rated.");
		ct.register("bot", ["{p NewName}"], "Changes the Bot Name.");
		ct.register("botcolor", ["{p NewColor}"], "Changes the Bot Color.");
		ct.register("server", ["{p NewName}"], "Changes the Server Chat Name.");
		ct.register("servercolor", ["{p NewColor}"], "Changes the Server Chat Color.");
		ct.register("clantag", ["{p Tag}"], "Changes the Clan Tag. If Tag is None, turns the Clan feature off.");
		ct.register("autoidle", ["{or Name}", "{p Entrymsg}"], "Automaticly Idles someone with an optional Entrymsg. Also works when you only want to change the Entrymsg.");
		ct.register("autoidleoff", ["{p Name}"], "Removes Automatic Idling.");

		ct.register(style.footer);
		ct.render(src,chan);
		}

		/* -- Admin Authing Commands */
		adminCommands[removespaces(UserName).toLowerCase()] = function() {
		if (dbIp == undefined) {
		botMessage(src, "That player doesnt exist");
		return;
		}
		if(dbAuth == 0) {
		botMessage(src,"That player already is "+UserName+"!",chan);
		return;
		}
		if (sys.auth(src) <= sys.maxAuth(dbIp)&&sys.auth(src) < 3) {
		sendAuth(sys.name(src) + " attempted deauth on "+commandData);
		return;
		}

		if(DataHash.tempauth[cmdData] != undefined) {
		delete DataHash.tempauth[cmdData];
		cache.write("tempauths",JSON.stringify(DataHash.tempauth));
		}

		if (tar != undefined) {
		botEscapeAll(sys.name(tar) + " has been made "+UserName+" by " + sys.name(src) + ".",0);
		sys.changeAuth(tar, 0);
		return;
		}
		botEscapeAll(commandData + " has been made "+UserName+" by " + sys.name(src) + ".",0);
		sys.changeDbAuth(commandData, 0);
		}

		adminCommands[removespaces(ModName).toLowerCase()] = function() {
		if (dbIp == undefined) {
		botMessage(src, "That player doesnt exist",chan);
		return;
		}
		if(dbAuth == 1) {
		botMessage(src,"That player already is "+ModName+"!",chan);
		return;
		}
		if(!sys.dbRegistered(commandData)) {
		botMessage(src,"This player is not registered.",chan);
		if(tar != undefined) {
		botMessage(tar,"Please register for auth.");
		}
		return;
		}
		if (sys.auth(src) <= sys.maxAuth(dbIp)&&sys.auth(src) < 3) {
		sendAuth(sys.name(src) + " attempted deauth on "+commandData);
		return;
		}

		if(DataHash.tempauth[cmdData] != undefined) {
		delete DataHash.tempauth[cmdData];
		cache.write("tempauths",JSON.stringify(DataHash.tempauth));
		}

		if (tar != undefined) {
		botEscapeAll(sys.name(tar) + " has been made "+ModName+" by " + sys.name(src) + ".",0);
		sys.changeAuth(tar, 1);
		return;
		}
		botEscapeAll(commandData + " has been made "+ModName+" by " + sys.name(src) + ".",0);
		sys.changeDbAuth(commandData, 1);
		}

		adminCommands[removespaces(Tour0).toLowerCase()] = function() {
		if(mcmd[0] == '') {
		botMessage(src,"Specify a name!",chan);
		return;
		}
		var tari = JSESSION.users(tar);
		if (dbIp == undefined) {
		botMessage(src, "That player doesnt exist",chan);
		return;
		}
		var h = mcmd[0].toLowerCase();
		if(DataHash.megausers[h] == undefined) {
		botMessage(src,"That person is already "+Tour0+"!",chan);
		return;
		}

		delete DataHash.megausers[h];
		cache.write("megausers",JSON.stringify(DataHash.megausers));

		if (tar != undefined) {
		botEscapeAll(sys.name(tar) + " has been made "+Tour0+" by " + sys.name(src) + ".",0);
		tari.megauser = false;
		return;
		}
		botEscapeAll(mcmd[0].name() + " has been made "+Tour0+" by " + sys.name(src) + ".",0);
		}

		adminCommands[removespaces(Tour1).toLowerCase()] = function() {
		mcmd = [cmdData,commandData];
		if(mcmd[0] == '') {
		botMessage(src,"Specify a name!",chan);
		return;
		}
		var tari = JSESSION.users(tar);
		if (dbIp == undefined) {
		botMessage(src, "That player doesnt exist",chan);
		return;
		}
		var h = mcmd[0].toLowerCase();
		if(DataHash.megausers[h] != undefined) {
		botMessage(src,"That person is already "+Tour1+"!",chan);
		return;
		}
		DataHash.megausers[h] = {"name":h.name()};
		cache.write("megausers",JSON.stringify(DataHash.megausers));

		if (tar != undefined) {
		botEscapeAll(sys.name(tar) + " has been made "+Tour1+" by " + sys.name(src) + ".",0);
		tari.megauser = true;
		return;
		}
		botEscapeAll(mcmd[0].name() + " has been made "+Tour1+" by " + sys.name(src) + ".",0);
		}

		/* -- Owner Commands: Start */
		ownerCommands = ({
		/* -- Owner Commands: Command Templates */
		dbcommands : function () {
		var ct = new Command_Templater("Database Commands");

		ct.register("clearpass", ["{or Person}"], "Clears someones Password.");
		ct.register("exporttiers", "Exports the Tiers Database to tier_(tiername).txt.");
		ct.register("exportmembers", "Exports the Members Database to members.txt.");
		ct.register("deleteplayer", ["{or Person}"], "Erases someone from the Members Database.");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		chatcommands: function () {
		var ct = new Command_Templater("Chat Commands");

		ct.register("rankicon", ["{b On/Off}"], "Turns Rank Icons and BB Code on or off.");
		ct.register("autoedit", ["{b On/Off}"], "Automaticly Corrects Messages if on.");
		ct.register("messagelimit", ["{o Number}"], "Sets a Character Limit for Players under the "+sLetter(AdminName)+" Authority Level.");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		servercommands: function () {
		var ct = new Command_Templater("Server Commands");

		ct.register("public", "Makes the Server Public.");
		ct.register("private", "Makes the Server Private.");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		anncommands: function () {
		var ct = new Command_Templater("Announcement Commands");

		ct.register("getannouncement", "Displays the raw Announcement.");
		ct.register("changeannouncement", ["{p New}"], "Changes the Announcement.");
		ct.register("testannouncement", ["{p New}"], "Changes the Announcement for you.");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,
		
		jsessioncommands: function () {
		var ct = new Command_Templater("JSESSION Commands");

		ct.register("recreate", ["{p <u>Type</u>}"], "Resets JSESSION data and refills. Types can be: Channels, Global, Tours, Users, All. Default is All.");
		ct.register("refill", "Creates JSESSION data for unknown channels and users.");
		ct.register("identifyscript", ["{p Name}"], "Changes Script ID, resets all JSESSION data and refills.");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		tiercommands : function () {
		var ct = new Command_Templater("Tier Commands");

		ct.register("updatetiers", ["{p <u>URL</u>}"], "Updates the Server Tiers. The URL's Content must be XML.");
		ct.register("resetladder", ["{p Tier}"], "Resets a Tier's Ladder.");
		ct.register("resetladders", "Resets all Ladders.");
		ct.register("banfrom", ["{p Tier}", "{p Pokemon}", "{p Ability}"], "Bans an Ability on a Pokemon from a Tier.");
		ct.register("unbanfrom", ["{p Tier}", "{p Pokemon}", "{p Ability}"], "Unbans an Ability on a Pokemon from a Tier.");
		ct.register("listbans","Displays all Banned Abilities.");
		ct.register(style.footer);
		ct.render(src,chan);
		}
		,

		/* -- Owner Commands: Table Templates */
		listbans:function() {
		var range = DataHash.bannedAbilities;
		if(Object.keys(range) == 0) {
		botMessage(src,'Sorry, there are currently no banned abilities.',chan);
		return;
		}

		var tt = new Table_Templater("Ability Bans","brown","3");
		tt.register(["Tier","Pokemon","Abilities"],true);

		for(var b in range) {
		var poketier = b;
		var poke = range[b];
		for(var k in poke) {
		var pkmn = k;
		var obc = poke[k];
		tt.register([poketier,pkmn,obc.join(", ")],false);
		}
		}

		tt.end();
		tt.render(src,chan);
		}
		,

		/* -- Owner Commands: Spam -- */
		randomspam: function () {

		/*
		var spam_array=[
		'COME HERE CUPCAKE',
		'Made in China ® is Made in China',
		'Pizza is a Vegetable? Congress says yes.',
		'Haters Gonna Hate',
		"._.",
		"I just heard that you liek the burmyz",
		"I LIEK MUDKIPZ",
		"Fatal Error line 1: Syntax Error: The script has deactivated because it saw a ghost.",
		"STOP RIGHT THERE YOU MOTHER FUCKER"
		];

		var spam_user=[
		Config.Bot.bot+"</i>",
		Config.Server.Name+"</i>",
		'Noob Grunt',
		'~~Server~~', 
		'Script Check', 
		'Trollface.jpg'];

		var spam_color=[
		Config.Server.Color,
		'dodgerblue', 
		'GoldenRod', 
		'Red', 
		'Orange', 
		'Green', 
		'Blue', 
		'Indigo',
		Config.Bot.botcolor];
		*/
		var spam_user = [], spam_color = [], spam_array = [];
		var spam_script = "Script Check", spam_script_color = Config.Bot.color;

		var x, pl = sys.playerIds(), cur, curn;
		var randomUser = function () {
		var ret = Math.round(pl.length*Math.random());
		if(ret == 0)
		ret = Config.Server.Name;
		else {
		ret = sys.name(ret);
		if(ret == undefined)
		ret = randomUser();
		}
		return ret;
		}

		for(x in pl) {
		cur = pl[x];
		curn = sys.name(cur);
		spam_user.push(curn);
		spam_color.push(script.namecolor(cur));

        spam_array.push("STOP RIGHT THERE "+curn.toUpperCase()+" YOU MOTHER FUCKER");
		spam_array.push("Fatal Script Error: Script Content was removed by "+curn+"!");
		spam_array.push("Do you have some change "+curn+"???");
		spam_array.push(curn+" was banned by "+randomUser()+"!");
		}

		var y, min = parseInt(commandData);
		var sal = spam_array.length, sul = spam_user.length, scl = spam_color.length;
		var random_spam='', random_color='', random_user='';

		if(isNaN(min)||min > 75) {
		min = 30; }

		for(y = 0; y < min; y++) {
		random_spam = spam_array[Math.floor(sal*Math.random())];
		random_color = spam_color[Math.floor(scl*Math.random())];
		random_user = spam_user[Math.floor(sul*Math.random())];

		if(random_spam.replace(/Fatal Script Error\:/, "") != random_spam) {
		random_color = spam_script_color;
		random_user = spam_script;
		}
		if(random_spam.replace(/was banned by/, "") != random_spam) {
		sys.sendHtmlAll("<font color=DarkOrange><timestamp/><b>"+random_spam+"</b></font>", 0);
		sys.sendHtmlAll("<font color=DarkOrange><timestamp/><b>Reason:</b></font> Existance.", 0);
		continue;
		}

		sys.sendHtmlAll("<font color="+random_color+"><timestamp/><b>"+random_user+":</b></font> " + random_spam,0);
		}

		}
		,

		/* -- Owner Commands: JSESSION */
		recreate: function () {
		var m = mcmd[0].toLowerCase(), type = "", has = "has";
		if(m == "global") {
		JSESSION.GlobalData = {};
		type = "Global";
		}
		else if(m == "user" || m == "users") {
		JSESSION.UserData = {};
		type = "User";
		}
		else if(m == "channel" || m == "channels") {
		JSESSION.ChannelData = {};
		type = "Channel"
		}
		else if(m == "tour" || m == "tours") {
		var x, z = JSESSION.ChannelData;
		for(x in z) {
		if(z[x].toursEnabled && z[x].tour != undefined) {
		delete z[x].tour;
		z[x].tour = new Tours(z[x].id);
		}
		}
		type = "Channel Tournament";
		}
		else {
		JSESSION.ChannelData = {};
		JSESSION.UserData = {};
		JSESSION.GlobalData = {};
		type = "Channel, User and Global";
		has = "have";
		}
		
		JSESSION.refill();
		botAll("JSESSION "+type+" "+has+" been reset by "+sys.name(src)+"!", 0);
		}
		,
		
		refill: function () {
		JSESSION.refill();
		botMessage(src, "JSESSION Data has been refilled.", chan);
		}
		,
		
		identifyscript: function () {
		if(mcmd[0] == undefined) {
		botMessage(src, "Specify a name!", chan);
		return;
		}
		if(JSESSION.ScriptID == mcmd[0]) {
		botMessage(src, "Identical Script ID.", chan);
		return;
		}
		JSESSION.identifyScriptAs(mcmd[0]);
		JSESSION.refill();
		botAll(src, sys.name(src)+" changed the Script ID and resetted all JSESSION data!", 0);
		}
		,
		
		/* -- Owner Commands: Rank Icons */
		rankicon: function () {
		if (cmdData != "on"&&cmdData != "off") {
		botMessage(src, "Use /rankicon on or /rankicon off",chan);
		return;
		}
		if(cmdData == "on"&&!allowicon) {
		botEscapeAll('Rank Icons has been turned on by '+sys.name(src)+'!',0);
		allowicon = true;
		cache.write("allowicon",true);
		return;
		}

		if(cmdData == "off"&&allowicon) {
		botEscapeAll('Rank Icons has been turned off by '+sys.name(src)+'!',0);
		allowicon = false;
		cache.write("allowicon",false);
		return;
		}
		botMessage(src,"Rank Icons are already "+cmdData,chan);
		}
		,

		/* -- Owner Commands: Future -- */
		futurelimit: function () {
		var pi = parseInt(mcmd[0]);
		if(isNaN(pi)) {
		botMessage(src, "Limit must be a number!", chan);
		return;
		}
		
		if(FutureLimit == pi) {
		botMessage(src, "The limit is already "+pi+"!", chan);
		return; 
		}
		if(FutureLimit > 60) {
		botMessage(src, "The limit has to be lower than 1 minute.", chan);
		return;
		}
		
		cache.write("FutureLimit", pi);
		botAll("The Futures allowed was changed to per "+pi+" seconds by "+sys.name(src)+"!", 0);
		FutureLimit = pi;
		}
		,
		
		/* -- Owner Commands: Editing -- */
		autoedit:function(){
		if (cmdData != "on"&&cmdData != "off") {
		botMessage(src, "Use /autoedit on or /autoedit off",chan);
		return;
		}
		if(cmdData == "on") {
		if(allowedit) {
		botMessage(src, "Auto Editing is already on!", chan);
		return;
		}
		botEscapeAll('Auto Editing has been turned on by '+sys.name(src)+'!',0);
		allowedit = true;
		cache.write("allowedit",true);
		return;
		}

		if(cmdData == "off") {
		if(allowedit) {
		botMessage(src, "Auto Editing is already off!", chan);
		return;
		}
		botEscapeAll('Auto Editing has been turned off by '+sys.name(src)+'!',0);
		allowedit = false;
		cache.write("allowedit",false);
		return;
		}
		botMessage(src,"Auto Editing is already "+cmdData,chan);
		}
		,

		/* -- Owner Commands: Limiting */
		messagelimit:function(){
		commandData = parseInt(commandData);
		if(isNaN(commandData)){
		botMessage(src,'Sorry, but that isn\'t a number.',chan);
		return;
		}
		if(MaxMessageLength == commandData) {
		botMessage(src,"The Message Limit is already "+commandData,chan);
		return;
		}
		MaxMessageLength = commandData;
		cache.write('MaxMessageLength',commandData);
		botEscapeAll('The message limit has been set to '+commandData+' by '+sys.name(src)+'!',0);
		}
		,

		/* -- Owner Commands: Announcement */
		getannouncement: function () {
		botEscapeMessage(src,"The raw Announcement is: " + sys.getAnnouncement());
		}
		,

		changeannouncement: function () {
		if(commandData == "") {
		commandData = "<"; }
		sys.changeAnnouncement(commandData);
		}
		,

		testannouncement:function() {
		sys.setAnnouncement(commandData,src);
		}
		,

		/* -- Owner Commands: Updating */
		updatetiers:function () {
		var URL = "https://raw.github.com/lamperi/po-server-goodies/56c0ad87dcb448d8afa47a555bb5ada8781ec931/tiers.xml";
		if(/http[s]\:\/\//.test(commandData)) {
		URL = commandData;
		}
		sys.webCall(URL,function synctiers(resp) {
		if(resp == "") {
		botMessage(src,"Error: No Content on page or not existing.",chan);
		return;
		}
		if(sys.getFileContent('tiers.xml') == resp) {
		botMessage(src,'Seems like the tiers are the same as that websites tiers.',chan);
		return;
		}
		sys.writeToFile('tiers.xml', resp);
		sys.reloadTiers();
		botAll('Tiers have been changed to <a href="'+URL+'">'+URL+'</a> by '+sys.name(src)+'!',0);
		});
		}
		,

		/* -- Owner Commands: Server Status */
        public: function () {
		if(!sys.isServerPrivate()) {
		botMessage(src, "The Server is already public.",chan);
		return;
		}
		sys.makeServerPublic(true);
		var conf = sys.getFileContent("config");
		conf.replace(/server_private=1/,"server_private=0");
		sys.writeToFile("config",conf);
		botAll("The Server has been made public by <b><font color= " + getColor + "> " + html_escape(sys.name(src)) + "</b><font>",0);
		}
		,

		private: function () {
		if(sys.isServerPrivate()) {
		botMessage(src, "The Server is already private.",chan);
		return;
		}
		var conf = sys.getFileContent("config");
		conf.replace(/server_private=0/,"server_private=1");
		sys.writeToFile("config",conf);
		sys.makeServerPublic(false);
		botAll("The Server has been made private by <b><font color= " + getColor + "> " + html_escape(sys.name(src)) + "</b><font>",0);
		}
		,

		/* -- Owner Commands: Password */
		clearpass: function () {
		if(dbIp == undefined) {
		botMessage(src, "Sorry, that person doesnt exist.",chan);
		return;
		}
		if(!sys.dbRegistered(commandData)) {
		botMessage(src,'Sorry, that person isn\'t registered.',chan);
		return;
		}

		sendAuth(commandData+"'s password was cleared by "+sys.name(src)+".");
		sys.clearPass(commandData);
		botMessage(src,"You cleared " + commandData + "'s password.",chan);

		if(tar != undefined) {
		botMessage(tar,"<ping/>Your Password has been cleared by " + html_escape(sys.name(src)) + ".");
		}
		}
		,

		/* -- Owner Commands: Script */
		reloadscript: function () {
        var LoadScript = sys.getFileContent("scripts.js");
        try {
		sys.changeScript(LoadScript);
        script.beforeChatMessage(src, "/randomspam 1", chan);
		} 
		catch(e) {
		botMessage(src,FormatError("Error occured.", e), chan);
		return;
		}
		}
		,

		/* -- Owner Commands: Rangeban */
		rangeban: function () {
		var ip = mcmd[0].split('.').join("");
		if(isNaN(ip) || ip == undefined) {
		botMessage(src,"Invalid IP.",chan);
		return;
		}

		var isValidIP=function(ipz,codeat) {
		var i = ipz.split('.');
		if((i[codeat] < 0||i[codeat] > 255)&&i!==undefined) {
		return false;
		}

		for(var z = 0; z<3; z++) {
		if(i[z] != undefined) {
		if(i[z].length > 3) {
		return false;
		}
		}
		}

		if(i[3] != undefined) {
		return false;
		}
		return true;
		}

		var c = mcmd[0];
		if(!isValidIP(c,0)||!isValidIP(c,1)||!isValidIP(c,2)) {
		botMessage(src,"Invalid IP.",chan);
		return;
		}
		prune_rangebans();
		if(DataHash.rangebans[mcmd[0]] != undefined) {
		botMessage(src,"Can't ban an already banned IP.",chan);
		return;
		}
		var time = 0;
		if(!isNaN(mcmd[1]*60*60)) {
		var time = sys.time()*1+mcmd[1]*60*60; }
		if(time == 0) {
		var timestr = 'forever';
		}
		else {
		var timestr = "for "+getTimeString(mcmd[1]*60*60);
		}
		var re = !isEmpty(mcmd[2]) ? mcmd[2] : "None";
		DataHash.rangebans[mcmd[0]] = {by:sys.name(src),why:re,ip:mcmd[0],"time":time};

		botEscapeAll(sys.name(src)+" banned IP range "+mcmd[0]+" "+timestr+"!",0);
		var l = mcmd[0].length, p = sys.playerIds(), q;

		for(q in p) {
		var b = p[q];
		if(sys.ip(b).substring(0,l) == mcmd[0]) {
		sys.kick(b);
		}
		}

		cache.write("rangebans",JSON.stringify(DataHash.rangebans));
		}
		,

		rangeunban:function() {
		prune_range_bans();
		if(DataHash.rangebans[commandData] != undefined) {
		botMessage(src,"Removed rangeban for "+commandData+".",chan);
		delete DataHash.rangebans[commandData];
		cache.write("rangebans",JSON.stringify(DataHash.rangebans));
		return;
		}
		botEscapeMessage(src,"Couldn't find range IP "+commandData+" in rangebanlist.",chan);
		}
		,

		/* -- Owner Commands: Eval */
		eval: function () {
		if(evallock&&!host) {
		botMessage(src,'Eval has been blocked by the host!',chan);
		return;
		}
		var srcname = sys.name(src), code = commandData;
		sys.sendHtmlAll(border2,scriptchannel);
		botAll(srcname+" evaluated the following code:", scriptchannel);
		sys.sendHtmlAll("<code>"+html_escape(code)+"</code>",scriptchannel);
		sys.sendHtmlAll(border2,scriptchannel);
		try {
		eval(code);
		sys.appendToFile('Evals.txt','Succesfull evaluated code: '+code+' \r\n');
		botAll("No errors were detected!", scriptchannel);
		}

		catch(err){
		sys.appendToFile('Evals.txt','Unsuccesfull evaluated code: '+code+' \r\n');
		var err=FormatError("", err) == "." ? err : FormatError("", err);
		botAll(err, scriptchannel);
		}
		
		}
		,

		runtime:function() {
		if(evallock&&!host) {
		botMessage(src,'Runtime has been blocked by the host!',chan);
		return;
		}
		var srcname = sys.name(src), code = commandData;
		sys.sendHtmlAll(border2,scriptchannel);
		botAll(srcname+" evaluated the following code:", scriptchannel);
		sys.sendHtmlAll("<code>"+html_escape(code)+"</code>",scriptchannel);
		sys.sendHtmlAll(border2,scriptchannel);
		try {
		var runtime_res = runtime(code);
		sys.appendToFile('Evals.txt','Succesfull evaluated code using runtime: '+code+' \r\n');
		var u1000 = runtime_res/1000;
		var umicro = runtime_res*1000;
		botAll("No errors were detected!", scriptchannel);
		botAll("Code took "+umicro+" microseconds / "+runtime_res+" milliseconds / "+u1000+" seconds to run. ", scriptchannel);
		}

		catch(err){
		sys.appendToFile('Evals.txt','Unsuccesfull evaluated code using runtime: '+code+' \r\n');
        var err=FormatError("", err) == "." ? err : FormatError("", err);
		botAll(err, scriptchannel);
		}
		}
		,
		/* -- Owner Commands: Stats */
		resetcommandstats:function() {
		commandStats = {};
		commandStats.startTime = parseInt(sys.time());
		saveCommandStats();
		sendAuth("Command stats were reset by "+sys.name(src)+"!");
		}
		,

		/* -- Owner Commands: Names */
		changeauthname : function () {
		if(isEmpty(mcmd[0])||isEmpty(mcmd[1])||isEmpty(mcmd[2])) {
		botMessage(src,"Unknown Arguments.",chan);
		return;
		}
		mcmd[2] = cut(mcmd,2,':');
		var d = removespaces(mcmd[2]).toLowerCase()
		var inObj = function(variable,obj) {
		return variable in obj;
		}

		if(inObj(d,userCommands)
		||inObj(d,channelCommands)
		||inObj(d,tourCommands)
		||inObj(d,modCommands)
		||inObj(d,adminCommands)
		||inObj(d,ownerCommands)
		||inObj(d,founderCommands)) {
		botMessage(src,"That name already exists in a command!",chan);
		return;
		}

		var y = removespaces(mcmd[2]).toLowerCase();
		if (/\W/.test(y)){
		botMessage(src,"You can only use letters A-z, numbers 0-9, spaces, and _.",chan);
		return;
		}

		if(mcmd[0].toLowerCase() != "ctour"&&mcmd[0].toLowerCase() != "tournament"&&mcmd[0].toLowerCase() != "channel"&&mcmd[0].toLowerCase() != "server") {
		botMessage(src,"Currently, you can only pick ctour, channel, tournament, or server as auth type.",chan);
		return;
		}

		if(mcmd[0].toLowerCase() == "ctour") {
		if(mcmd[1] != "1"&&mcmd[1] != "0") {
		botMessage(src,"Choose auth number 0 or 1 for authtype ctour",chan);
		return;
		}
		sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type CTour's auth level "+mcmd[1]+" name has been changed to "+mcmd[2]+" by "+sys.name(src)+"!</b></font>",0);
		if(mcmd[1] == "0") {
		ChanTour0 = mcmd[2];
		}
		else if(mcmd[1] == "1") {
		ChanTour1 = mcmd[2];
		}
		cache.write("ChanTour"+mcmd[1]+"Name",mcmd[2]);
		return;
		}

		if(mcmd[0].toLowerCase() == "tournament") {
		if(mcmd[1] != "1"&&mcmd[1] != "0") {
		botMessage(src,"Choose select auth number 0 or 1 for authtype tournament",chan);
		return;
		}
		sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type Tournament's auth level "+mcmd[1]+" name has been changed to "+mcmd[2]+" by "+sys.name(src)+"!</b></font>",0);
		if(mcmd[1] == "0") {
		Tour0 = mcmd[2];
		}
		else if(mcmd[1] == "1") {
		Tour1 = mcmd[2];
		}
		cache.write("TourLevel"+mcmd[1]+"Name",mcmd[2]);
		return;
		}

		if(mcmd[0].toLowerCase() == "server") {
		if(mcmd[1] != "1"&&mcmd[1] != "0"&&mcmd[1] != "2"&&mcmd[1] != "3"&&mcmd[1] != "4") {
		botMessage(src,"Choose auth number 0, 1, 2, 3 or 4 for authtype server",chan);
		return;
		}
		sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type Server's auth level "+mcmd[1]+" name has been changed to "+mcmd[2]+" by "+sys.name(src)+"!</b></font>",0);
		if(mcmd[1] == "0") {
		UserName = mcmd[2];
		}
		else if(mcmd[1] == "1") {
		ModName = mcmd[2];
		}
		else if(mcmd[1] == "2") {
		AdminName = mcmd[2];
		}
		else if(mcmd[1] == "3") {
		OwnerName = mcmd[2];
		}
		else if(mcmd[1] == "4") {
		InvisName = mcmd[2];
		}
		cache.write("AuthLevel"+mcmd[1]+"Name",mcmd[2]);
		return;
		}

		if(mcmd[0].toLowerCase() == "channel") {
		if(mcmd[1] != "1"&&mcmd[1] != "0"&&mcmd[1] != "2"&&mcmd[1] != "3") {
		botMessage(src,"Choose auth number 0, 1, 2 or 3 for authtype channel",chan);
		return;
		}
		sys.sendHtmlAll("<timestamp/><b><font color=darkviolet>Auth type Channel's auth level "+mcmd[1]+" name has been changed to "+mcmd[2]+" by "+sys.name(src)+"!</b></font>",0);
		if(mcmd[1] == "0") {
		ChanUser = mcmd[2];
		}
		else if(mcmd[1] == "1") {
		ChanMod = mcmd[2];
		}
		else if(mcmd[1] == "2") {
		ChanAdmin = mcmd[2];
		}
		else if(mcmd[1] == "3") {
		ChanOwner = mcmd[2];
		}
		cache.write("ChanLevel"+mcmd[1]+"Name",mcmd[2]);
		}
		}
		,

		/* -- Owner Commands: Player */
		deleteplayer: function () {
		if (dbIp == undefined) {
		botMessage(src, "That player doesnt exist",chan);
		return;
		}
		if(dbAuth > 0) {
		botMessage(src,"Can't delete auth!",chan);
		return;
		}
		var name = tar != undefined ? sys.name(tar) : commandData;
		botEscapeAll(name + " was deleted from the members database by " + sys.name(src) + "!",0);
		sys.dbDelete(name);
		if(tar != undefined)
		sys.kick(tar);
		}
		,

		/* -- Owner Commands: Export */
		exportmembers : function () {
		sys.exportMemberDatabase();
		botEscapeAll("The Members have been exported by " + sys.name(src) + "!",0);
		}
		,

		exporttiers : function () {
		sys.exportTierDatabase();
		botEscapeAll("The Tiers have been exported by " + sys.name(src) + "!",0);
		}
		,

		/* -- Owner Commands: Silence */
		megasilence: function () {
		if (muteall||supermuteall||megamuteall) {
		botMessage(src, "Chat is already silenced.",chan);
		return;
		}

		var time = commandData* 60, timeStr = "!";
		if(!isNaN(time)&&commandData !== "") {
		timeStr = " for "+getTimeString(time)+"!";
		}


		megamuteall = true;
		botAll(sys.name(src)+" mega-silenced the chat"+timeStr);

		if(timeStr == "!")
		return;

		timeOut = function() {
		if(!megamuteall)
		return;
		botAll("Silence is over.");
		megamuteall = false;
		}

		sys.callLater('timeOut();',time);

		}
		,

		/* -- Owner Commands: Ladder */
		resetladder:function() {
		var tiers = sys.getTierList(), get = false, y, name;
		for(y in tiers) {
		if(tiers[y].toLowerCase() == commandData.toLowerCase()) {
		get = true; name = tiers[y];
		break;
		}
		}

		if(!get) {
		botEscapeMessage(src,"The tier "+commandData+" doesn't exist",chan);
		return;
		}

		botAll("The ladder of the tier "+name+" has been reset by "+sys.name(src)+"!",0);
		sys.resetLadder(name);
		}
		,

		resetladders:function() {
		var tiers = sys.getTierList();
		for(y in tiers) {
		sys.resetLadder(tiers[y]);
		}
		botAll("Every ladder has been reset by "+sys.name(src)+"!",0);
		}
		,

		/* -- Owner Commands: Pointers */
		pointercommand:function() {
		if(mcmd[0]==""||mcmd[1]==""||mcmd[1]==undefined) {
		botMessage(src,"Specify a command.",chan);
		return;
		}
		mcmd[1] = cut(mcmd,1,':');

		var c = mcmd[0].toLowerCase(), y = mcmd[1].toLowerCase();
		var d = removespaces(c);

		var inObj = function(variable,obj) {
		return variable in obj;
		}

		if(inObj(d,userCommands)
		||inObj(d,channelCommands)
		||inObj(d,tourCommands)
		||inObj(d,modCommands)
		||inObj(d,adminCommands)
		||inObj(d,ownerCommands)
		||inObj(d,founderCommands)) {
		botMessage(src,"That pointer is already defined as a normal command.",chan);
		return;
		}
		var y = removespaces(y);
		if(!inObj(y,userCommands)
		&&!inObj(y,channelCommands)
		&&!inObj(y,tourCommands)
		&&!inObj(y,modCommands)
		&&!inObj(y,adminCommands)
		&&!inObj(y,ownerCommands)
		&&!inObj(y,founderCommands)) {
		botMessage(src,"That command doesn't exist!",chan);
		return;
		}
		if (/\W/.test(d)){
		botMessage(src,"You can only use letters A-z, numbers 0-9, and _.",chan);
		return;
		}
		if(d in PointerCommands) {
		if(PointerCommands[d] == y) {
		botMessage(src,"Pointer is already defined with that command!",chan);
		return;
		}
		}
		var re = [d in PointerCommands ? 'redefined' : 'defined',d in PointerCommands ? 'differantly as' : 'as'];
		PointerCommands[d] = y;
		botAll(sys.name(src)+" "+re[0]+" Pointer Command "+d+" "+re[1]+" "+y+"!",0);
		cache.write("pointercommands",JSON.stringify(PointerCommands));
		}
		,

		delpointercommand:function() {
		var d = removespaces(cmdData);
		if(d == "") {
		botMessage(src,"Specify a Pointer Command.",chan);
		return;
		}
		if(!d in PointerCommands) {
		botMessage(src,"Pointer doesn't exist!",chan);
		return;
		}
		delete PointerCommands[d];
		botAll(sys.name(src)+" removed the Pointer Command "+d+"!",0);
		cache.write("pointercommands",JSON.stringify(PointerCommands));
		}
		,

		/* -- Owner Commands: Ban */
		banfrom:function() {
		if(mcmd[0]==undefined||mcmd[1]==undefined||mcmd[2]==undefined) {
		botMessage(src,"Usage /banfrom tier:poke:ability",chan);
		return;
		}

		var tiers = sys.getTierList(), get = false, y, name;
		for(y in tiers) {
		if(tiers[y].toLowerCase() == mcmd[0].toLowerCase()) {
		get = true; name = tiers[y].toLowerCase();
		break;
		}
		}

		if(!get) {
		botEscapeMessage(src,"The tier "+mcmd[0]+" doesn't exist!",chan);
		return;
		}

		var num = sys.pokeNum(mcmd[1]);
		if(num == undefined) {
		botEscapeMessage(src,"The pokemon "+mcmd[1]+" doesn't exist!",chan);
		return;
		}

		var abilityarr = [];

		for(var y = 0; y<5; y++) {
		abilityarr.push(sys.ability(sys.pokeAbility(num,y,5)).toLowerCase());
		}

		if(abilityarr.indexOf(mcmd[2].toLowerCase()) == -1) {
		botEscapeMessage(src,"The Ability "+mcmd[2]+" for pokemon "+mcmd[1]+" doesn't exist!",chan);
		return;
		}
		var bans = DataHash.bannedAbilities;
		if(bans[name] == undefined) {
		bans[name] = {};
		}

		var pN = sys.pokemon(num).toLowerCase();
		if(bans[name][pN] == undefined) {
		bans[name][pN] = [];
		}

		if(bans[name][pN].indexOf(mcmd[2].toLowerCase()) != -1) {
		botMessage(src,"The ability "+mcmd[2]+" is already banned on "+mcmd[1]+" in tier "+mcmd[0],chan);
		return;
		}

		bans[name][pN].push(mcmd[2].toLowerCase());

		botAll(sys.name(src)+" has banned the ability "+mcmd[2]+" on "+mcmd[1]+" in tier "+mcmd[0]+"!",0);
		cache.write("bannedAbilities",JSON.stringify(DataHash.bannedAbilities));
		}
		,
		unbanfrom:function() {
		if(mcmd[0]==undefined||mcmd[1]==undefined||mcmd[2]==undefined) {
		botMessage(src,"Usage /unbanfrom tier:poke:ability",chan);
		return;
		}

		var tiers = sys.getTierList(), get = false, y, name;
		for(y in tiers) {
		if(tiers[y].toLowerCase() == mcmd[0].toLowerCase()) {
		get = true; name = tiers[y].toLowerCase();
		break;
		}
		}

		if(!get) {
		botEscapeMessage(src,"The tier "+mcmd[0]+" doesn't exist!",chan);
		return;
		}

		var num = sys.pokeNum(mcmd[1]);
		if(num == undefined) {
		botEscapeMessage(src,"The pokemon "+mcmd[1]+" doesn't exist!",chan);
		return;
		}

		var abilityarr = [];

		for(var y = 0; y<5; y++) {
		abilityarr.push(sys.ability(sys.pokeAbility(num,y,5)).toLowerCase());
		}

		if(abilityarr.indexOf(mcmd[2].toLowerCase()) == -1) {
		botEscapeMessage(src,"The Ability "+mcmd[2]+" for pokemon "+mcmd[1]+" doesn't exist!",chan);
		return;
		}
		var bans = DataHash.bannedAbilities;
		if(typeof bans[name] == 'undefined') {
		botMessage(src,"That Tier has no Ability Bans.",chan);
		return;
		}

		var pN = sys.pokemon(num).toLowerCase();
		if(typeof bans[name][pN] == 'undefined') {
		botMessage(src,"That Pokemon has no Ability Bans.",chan);
		return;
		}

		if(bans[name][pN].indexOf(mcmd[2].toLowerCase()) == -1) {
		botMessage(src,"The ability "+mcmd[2]+" isn't banned on "+mcmd[1]+" in tier "+mcmd[0],chan);
		return;
		}

		if(bans[name][pN].length == 1) {
		delete bans[name][pN]; }
		else {
		bans[name][pN].splice(mcmd[2].toLowerCase(),1); }

		botAll(sys.name(src)+" has unbanned the ability "+mcmd[2]+" on "+mcmd[1]+" in tier "+mcmd[0]+"!",0);
		cache.write("bannedAbilities",JSON.stringify(DataHash.bannedAbilities));
		}
		});

		var founderCommands = ({
		evallock:function() {
		if(evallock) {
		botMessage(src, "Eval and runtime are already disabled!", chan);
		return;
		}
		evallock = true;
		cache.write("evallock",true);
		botEscapeAll(sys.name(src)+" has locked eval and runtime.",scriptchannel);
		}
		,
		evalunlock:function() {
		if(!evallock) {
		botMessage(src, "Eval and runtime are already enabled!", chan);
		return;
		}
		evallock = false;
		cache.write("evallock",false);
		botEscapeAll(sys.name(src)+" has unlocked eval and runtime.",scriptchannel);
		}
		,
		});

		/* -- Owner Commands: Owner Commands Template */
		ownerCommands[removespaces(OwnerName).toLowerCase()+"commands"] = function() {
		var ct = new Command_Templater(OwnerName+" Commands");

		ct.register("chatcommands", "Displays Chat Commands.");
		ct.register("dbcommands","Displays Database Commands.");
		ct.register("anncommands","Displays Announcement Commands.");
		ct.register("jsessioncommands", "Displays JSESSION Commands.");
		ct.register("servercommands","Displays Server Commands.");
		ct.register("tiercommands", "Displays Tier Commands.");
		ct.register("eval", ["{p Code}"], "Evaluates a QtScript code.");
		ct.register("runtime", ["{p Code}"], "Evaluates a QtScript code and displays the time needed to evaluate it.");
        ct.register("randomspam", ["{o Number}"], "Spams the Chat with Random Messages.");
		ct.register("resetcommandstats", "Resets Command Stats.");
		ct.register(style.footer);
		ct.render(src,chan);
		}

		/* -- Owner Commands: Authing */
		ownerCommands[removespaces(AdminName).toLowerCase()] = function() {
		if (dbIp == undefined) {
		botMessage(src, "That player doesnt exist.",chan);
		return;
		}
		if(dbAuth == 2) {
		botMessage(src,"That player already is "+AdminName+"!",chan);
		return;
		}

		if(!sys.dbRegistered(commandData)) {
		botMessage(src,"This player is not registered.",chan);
		if(tar != undefined) {
		botMessage(tar,"Please register for auth.");
		}
		return;
		}

		if(DataHash.tempauth[cmdData] != undefined) {
		delete DataHash.tempauth[cmdData];
		cache.write("tempauths",JSON.stringify(DataHash.tempauth));
		}

		if (tar != undefined) {
		botEscapeAll(sys.name(tar) + " has been made "+AdminName+" by " + sys.name(src) + ".",0);
		sys.changeAuth(tar, 2);
		return;
		}
		botEscapeAll(commandData + " has been made "+AdminName+" by " + sys.name(src) + ".",chan);
		sys.changeDbAuth(commandData, 2);
		}

		ownerCommands[removespaces(OwnerName).toLowerCase()] = function() {
		if (dbIp == undefined) {
		botMessage(src, "That player doesnt exist.",chan);
		return;
		}
		if(dbAuth == 3) {
		botMessage(src,"That player already is "+OwnerName+"!",chan);
		return;
		}

		if(!sys.dbRegistered(commandData)) {
		botMessage(src,"This player is not registered.",chan);
		if(tar != undefined) {
		botMessage(tar,"Please register for auth.");
		}
		return;
		}

		if(DataHash.tempauth[cmdData] != undefined) {
		delete DataHash.tempauth[cmdData];
		cache.write("tempauths",JSON.stringify(DataHash.tempauth));
		}

		if (tar != undefined) {
		botEscapeAll(sys.name(tar) + " has been made "+OwnerName+" by " + sys.name(src) + ".",0);
		sys.changeAuth(tar, 3);
		return;
		}
		botEscapeAll(commandData + " has been made "+OwnerName+" by " + sys.name(src) + ".",0);
		sys.changeDbAuth(commandData, 3);
		}

		ownerCommands[removespaces(InvisName).toLowerCase()] = function() {
		if (sys.dbIp(commandData) == undefined) {
		botMessage(src, "That player doesnt exist.",chan);
		return;
		}
		if(dbAuth >= 4) {
		botMessage(src,"That player already is "+InvisName+"!",chan);
		return;
		}

		if(!sys.dbRegistered(commandData)) {
		botMessage(src,"This player is not registered.",chan);
		if(tar != undefined) {
		botMessage(tar,"Please register for auth.");
		}
		return;
		}

		if(DataHash.tempauth[cmdData] != undefined) {
		delete DataHash.tempauth[cmdData];
		cache.write("tempauths",JSON.stringify(DataHash.tempauth));
		}
		var users = sys.playerIds(),y,sendArr3 = [],sendArr0 = [];
		for(y in users) {
		if(sys.auth(users[y]) > 2) {
		sendArr3.push(users[y]);
		}
		else {
		sendArr0.push(users[y]);
		}
		}

		if (tar != undefined) {
		for(var x in sendArr3) {
		botMessage(sendArr3[x],sys.name(tar) + " has been made "+InvisName+" by " + sys.name(src) + ".",0);
		}
		for(var x in sendArr0) {
		botMessage(sendArr0[x],sys.name(tar) + " has been made "+UserName+" by " + sys.name(src) + ".",0);
		}
		sys.changeAuth(tar, 127);
		return;
		}
		for(var x in sendArr3) {
		botMessage(sendArr3[x],commandData + " has been made "+InvisName+" by " + sys.name(src) + ".",0);
		}
		for(var x in sendArr0) {
		botMessage(sendArr0[x],commandData + " has been made "+UserName+" by " + sys.name(src) + ".",0);
		}
		sys.changeDbAuth(commandData, 127);
		}

		var getCommand = ({
		'0': function (name) {
		if (name in tourCommands&&poChan.toursEnabled) {
		   return tourCommands[name];
		}
		else if (name in channelCommands) {
		   return channelCommands[name];
		}
		else if (name in userCommands) {
		   return userCommands[name];
		}
		}
		,
		'1': function (name) {
		if (name in modCommands) {
		   return modCommands[name];
		}
		else if (name in tourCommands&&poChan.toursEnabled) {
		   return tourCommands[name];
		}
		else if (name in channelCommands) {
		   return channelCommands[name];
		}
		else if (name in userCommands) {
		   return userCommands[name];
		}
		}
		,
		'2' : function (name) {
		if (name in adminCommands) {
		   return adminCommands[name];
		}
		else if (name in modCommands) {
		   return modCommands[name];
		}
		else if (name in tourCommands&&poChan.toursEnabled) {
		   return tourCommands[name];
		}
		else if (name in channelCommands) {
		   return channelCommands[name];
		}
		else if (name in userCommands) {
		   return userCommands[name];
		}
		}
		,
		'3' : function (name) {
		if (name in founderCommands&&host) {
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
		else if (name in tourCommands&&poChan.toursEnabled) {
		   return tourCommands[name];
		}
		else if (name in channelCommands) {
		   return channelCommands[name];
		}
		else if (name in userCommands) {
		   return userCommands[name];
		}
		}
		,
		});
		var op = sys.auth(src);

		if(op > 3) {
		op = 3;
		}

		if(op < 0) {
		op = 0;
		}

		var ch = Config.HighPermission;

		if(ch[sys.name(src)] !== undefined&&ch[sys.name(src)][0] == sys.auth(src)) {
		op = ch[sys.name(src)][1];
		}

		var cmd = getCommand[op](command);
		if (!cmd) {
		botEscapeMessage(src,getCommand[3](command) ? "You may not use the " + command + " command." : "The command " + command + " doesn't exist.", chan)
		return; }
		if(command != "spam")  {
		writeCommandStats(command,sys.name(src));
		}
		cmd();
		return;
		}
		sys.sendHtmlAll("<timestamp/><b>["+ChannelLink(sys.channel(chan))+"]Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> "+ html_escape(message), watch);

		if (channel == mafiachan && mafia.ticks > 0 && mafia.state!="blank" && !mafia.isInGame(sys.name(src)) && sys.auth(src) <= 0) {
		sys.stopEvent();
		sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to talk!", mafiachan);
		return;
		}

		if(poUser.capsMute(message)) {
		sys.stopEvent();
		return;
		}

		if(isOffensive(message,src)) {
		sys.stopEvent();
		return;
		}

		if (typeof poUser.impersonation != 'undefined') {
		if(sys.auth(src) <= 0&&implock) {
		delete poUser.impersonation;
		botMessage(src,"You are now yourself again!",chan);
		return;
		}

		var nc = script.namecolor(src);
		sys.stopEvent();
		
		if(chatcolor) {
		if(sys.auth(src) >= 1 && sys.auth(src) <= 3) {
		var l = allowicon === true ? rankico : '+<i>';
		var f = allowicon === true ? format(src, html_escape(message)) : html_escape(message);
		if(chan == watch) {
		sys.sendHtmlAll("<font color="+nc+" face='"+fnt+"'><timestamp/>"+l+"<b>"+html_escape(poUser.impersonation) + ":</b></i></font> <font face='"+fnt+"'>" + f+"</font>");
		}
		else {
		sys.sendHtmlAll("<font color="+nc+" face='"+fnt+"'><timestamp/>"+l+"<b>"+html_escape(poUser.impersonation) + ":</b></i></font> <font face='"+fnt+"'>" + f +"</font>",chan);
		}
		return;
		}
		
		if(sys.auth(src) >= 1 && sys.auth(src) <= 3){
		var l = allowicon === true ? rankico : '+<i>';
		var f = allowicon === true ? format(src, html_escape(message)) : html_escape(message);
		if(chan == watch) {
		sys.sendHtmlAll("<font color="+nc+" face='"+fnt+"'><timestamp/>"+l+"<b>"+html_escape(poUser.impersonation) + ":</b></i></font> <font face='"+fnt+"'> "+f+"</font>");
		}
		else {
		sys.sendHtmlAll("<font color="+nc+" face='"+fnt+"'><timestamp/>"+l+"<b>"+html_escape(poUser.impersonation) + ":</b></i></font> <font face='"+fnt+"'> "+f+"</font>",chan);
		}
		return;
		}
		}
        
		if(sys.auth(src) >= 1 && sys.auth(src) <= 3){
		var l = allowicon === true ? rankico : '+<i>';
		var f = allowicon === true ? format(src, html_escape(message)) : html_escape(message);
		if(chan == watch) {
		sys.sendHtmlAll("<font color="+nc+"><timestamp/>"+l+"<b>"+html_escape(poUser.impersonation) + ":</b></i></font> "+f);
		}
		else {
		sys.sendHtmlAll("<font color="+nc+"><timestamp/>"+l+"<b>"+html_escape(poUser.impersonation) + ":</b></i></font> "+f,chan);
		}
		return;
		}
		
		else if(sys.auth(src) > 3) {
		var l = allowicon === true ? rankico : '';
		if(chan != watch) {
		sys.sendHtmlAll("<font color="+nc+"><timestamp/>"+l+"<b>"+html_escape(poUser.impersonation) + ":</b></font> " + message,chan);
		} else {
		sys.sendHtmlAll("<font color="+nc+"><timestamp/>"+l+"<b>"+html_escape(poUser.impersonation) + ":</b></font> " + message);
		}
		return;
		}

		else if(sys.auth(src) <= 0){
		var f = allowicon === true ? format(src, html_escape(message)) : html_escape(message);
		var l = allowicon === true ? rankico : '';
		sys.sendHtmlAll("<font color="+nc+"><timestamp/>"+l+"<b>"+html_escape(poUser.impersonation) + ":</b></font> " + f,chan);
		return;
		}
		}
		
		if(allowicon || chatcolor) {
		if(chatcolor)
		namestr += "</font>";
		
		if(chan === watch) {
		sys.sendHtmlAll(namestr);
		sys.stopEvent();
		return;
		}

		else {
		sys.sendHtmlAll(namestr,chan);
		sys.stopEvent();
		return;
		}
		}

		if(chan === watch) {
		sys.sendAll(sys.name(src)+": "+message);
		sys.stopEvent();
		return;
		}

		if(chan === trivia && Trivia.isGameGoingOn()) {
		Trivia.a(message);
		}

		}
		,
		beforeLogOut: function (src) {
		var getColor = script.namecolor(src);
		if(!script.testName(src,true)) {
		sys.sendHtmlAll("<timestamp/><b>Log Out</b> -- <font color="+getColor+"><b>"+sys.name(src)+"</b></font>", watch);
		}
		JSESSION.destroyUser(src);
		}
		,
		
		afterPlayerAway: function(src, mode) {
		var m = mode ? "Now idling." : "Now active and ready for battles."
		var getColor = script.namecolor(src);
		sys.sendHtmlAll("<timestamp/><b>Changed Status</b> -- <font color="+getColor+"><b>"+sys.name(src)+"</b></font> -- <B>"+m+"</b>", watch);
		}
		,
		
		afterChangeTeam: function(src, logging) {
		if(!logging) {
		// UPDATING DATA
		var myUser = JSESSION.users(src);
		myUser.name = sys.name(src);
        var lc = sys.name(src).toLowerCase();
		myUser.lowername = lc;
		myUser.megauser = DataHash.megausers.hasOwnProperty(lc);
		myUser.voice = DataHash.voices.hasOwnProperty(lc);
		
		// The rest.
		var getColor = script.namecolor(src);
		sys.sendHtmlAll("<timestamp/><b>Changed Team</b> -- <font color="+getColor+"><b>"+sys.name(src)+"</b></font>", watch);

		DataHash.names[sys.ip(src)] = sys.name(src);
		DataHash.names[sys.name(src).toLowerCase()] = sys.name(src);
		cache.write("names",JSON.stringify(DataHash.names));

		script.hostAuth(src);

		if(script.testName(src) == true) {
		kick(src);
		return;
		}

		var chid = sys.channelsOfPlayer(src), x, srcname = sys.name(src).toLowerCase();

		for(x in chid) {
		var chan = JSESSION.channels(chid[x]);
		if(typeof(chan.chanAuth[srcname]) == 'undefined') {
		if(sys.auth(src) == 0)
		chan.chanAuth[srcname] = 0;

		if(sys.auth(src) == 1)
		chan.chanAuth[srcname] = 1;

		if(sys.auth(src) == 2)
		chan.chanAuth[srcname] = 2;

		if(sys.auth(src) > 2||chan.creator === sys.name(src)&&chan.creator !== '~Unknown~')
		chan.chanAuth[srcname] = 3;
		}
		}
		}


		if(typeof DataHash.mail[srcname] != "undefined") {
		if(DataHash.mail[srcname].length > 0) {
		var mail = DataHash.mail[sys.name(src).toLowerCase()], p, count = 0;

		for(p in mail) {
		if(!mail[p].read) {
		count++;
		}
		}

		if(count > 0) {
		botMessage(src,"You have "+count+" new mails! Type <font color='green'><b>/readmail</b></font> to view!");
		}
		}
		}

		script.customAbilityBans(src);

		if(sys.gen(src)>=4) {
		for(var i=0;i<6;i++) {
		var poke=sys.teamPoke(src,i);
		if(poke in pokeNatures) {
		for(x in pokeNatures[poke]) {
		if(sys.hasTeamPokeMove(src,i,x)&&sys.teamPokeNature(src,i)!=pokeNatures[poke][x]) {
		botMessage(src,sys.pokemon(poke)+" with "+sys.move(x)+" must be a "+sys.nature(pokeNatures[poke][x])+" nature. Change it in the teambuilder.");
		sys.changePokeNum(src,i,0);
		}
		}
		}
		}
		}
		try {
		if (sys.gen(src) == 2) {
		pokes:
		for (var i = 0; i <= 6; i++)
		for (var j = 0; j < bannedGSCSleep.length; ++j)
		if (sys.hasTeamPokeMove(src, i, bannedGSCSleep[j]))
		for (var k = 0; k < bannedGSCTrap.length; ++k)
		if (sys.hasTeamPokeMove(src, i, bannedGSCTrap[k])) {
		botMessage(src, "SleepTrapping is banned in GSC. Pokemon " + sys.pokemon(sys.teamPoke(src,i)) + "  removed from your team.");
		sys.changePokeNum(src, i, 0);
		continue pokes;
		}

		}
		} catch (e) { botAll(FormatError("",e), watch); }


		script.dreamWorldAbilitiesCheck(src,false);
		script.littleCupCheck(src,false);
		script.inconsistentCheck(src,false);
		script.monotypecheck(src);
		script.weatherlesstiercheck(src);
		script.shanaiAbilityCheck(src,false);
		script.monoColourCheck(src);
		script.advance200Check(src);

		}
		,
		
		hostAuth: function (src) {
		var auth = sys.auth(src);
		if(auth < 3||auth > 3)
		return;
		if (!isHost(src))
		return;
		if(!sys.dbRegistered(sys.name(src)))
		return;
		sys.changeAuth(src, 3);
		}
		,
		
		afterBattleEnded: function(winner, loser, result, battle_id) {
		if(result!="tie"&&sys.ip(winner)!=sys.ip(loser)) {
		var winMoney = sys.rand(10,101);
		var loseMoney = sys.rand(1,101);
		var winnerName = sys.name(winner).toLowerCase();
		var loserName = sys.name(loser).toLowerCase();
		var money = DataHash.money;
		if(typeof money[loserName] == "undefined") {
		money[loserName]=0;
		}
		if(typeof money[winnerName] == "undefined") {
		money[winnerName] = 0;
		}
		money[winnerName] += winMoney;
		money[loserName] -= loseMoney;
		botMessage(winner,'You won '+winMoney+' money!');
		botMessage(loser,'You lost '+loseMoney+' money!');
		cache.write("money",JSON.stringify(DataHash.money));
		}
		
		var c = sys.channelIds(), b;
		for(b in c) {
		if(JSESSION.channels(c[b]).toursEnabled)
		JSESSION.channels(c[b]).tour.afterBattleEnded(winner, loser);
		}
		}
		,

		afterBattleStarted: function(src, dest) {
		var c = sys.channelIds(), b;
		for(b in c) {
		if(JSESSION.channels(c[b]).toursEnabled)
		JSESSION.channels(c[b]).tour.afterBattleStarted(src, dest);
		}
		}
		,
		
		beforeChallengeIssued: function (src, dest, clauses, rated, mode) {
		var poUser = JSESSION.users(src);
		if(poUser.lastChallenge+15-sys.time()*1 > 0&&sys.auth(src) < 2&&poUser.lastChallenge != 0) {
		botMessage(src,"Please wait "+getTimeString(poUser.lastChallenge+15-sys.time()*1)+" before challenging.");
		sys.stopEvent();
		return;
		}

		poUser.lastChallenge = sys.time()*1;

		if((sys.tier(src)=="Challenge Cup"&&sys.tier(dest)=="Challenge Cup"||sys.tier(src)=="1v1 Challenge Cup"&&sys.tier(dest)=="1v1 Challenge Cup")&&(clauses%32<16)){
		botMessage(src,"Challenge Cup must be enabled in the challenge window for a CC battle");
		sys.stopEvent();
		return;
		}
		if((clauses%32)>=16)
		return;
		if(sys.tier(src).indexOf("Doubles")!=-1&&sys.tier(dest).indexOf("Doubles")!=-1&&mode!=1){
		botMessage(src,"To fight in doubles, enable doubles in the challenge window!");
		sys.stopEvent();
		return;
		}
		if(sys.tier(src).indexOf("Triples")!=-1&&sys.tier(dest).indexOf("Triples")!=-1&&mode!=2){
		botMessage(src,"To fight in triples, enable triples in the challenge window!");
		sys.stopEvent();
		return;
		}
		script.eventMovesCheck(src);
		script.eventMovesCheck(dest);
		script.customAbilityBans(dest,true);
		script.customAbilityBans(src,true);
		if(sys.tier(src)==sys.tier(dest)){
		var tier=sys.tier(src);
		script.dreamWorldAbilitiesCheck(src,true);
		script.dreamWorldAbilitiesCheck(dest,true);
		script.inconsistentCheck(src,true);
		script.inconsistentCheck(dest,true);
		script.littleCupCheck(src,true);
		script.littleCupCheck(dest,true);
		script.shanaiAbilityCheck(src,true)
		script.shanaiAbilityCheck(dest,true);
		script.evioliteCheck(src);
		script.evioliteCheck(dest);
		}
		}
		,
		
		beforeChangeTier: function(src, oldtier, newtier){
		script.monotypecheck(src,newtier)
		script.weatherlesstiercheck(src,newtier)
		script.monoColourCheck(src,newtier)
		script.swiftSwimCheck(src, newtier)
		script.droughtCheck(src, newtier);
		script.advance200Check(src, newtier);
		script.customAbilityBans(src,true,newtier);
		script.evioliteCheck(src, newtier);
		}
		,
		
		beforeBattleMatchup : function(src,dest){
		/* var c = sys.channelIds(), b;
		for(b in c) {
		if(sys.isInChannel(src,c[b])&&sys.isInChannel(dest,c[b])) {
		if(JSESSION.channels(c[b]).toursEnabled) {
		if(JSESSION.channels(c[b]).tour.beforeBattleMatchup(src,dest)) {
		sys.stopEvent();
		return;
		}
		}
		}
		} */

		script.eventMovesCheck(src);
		script.eventMovesCheck(dest);
		script.customAbilityBans(dest,true);
		script.customAbilityBans(src,true);
		if(sys.tier(src)==sys.tier(dest)){
		var tier=sys.tier(src);
		script.dreamWorldAbilitiesCheck(src,true);
		script.dreamWorldAbilitiesCheck(dest,true);
		script.inconsistentCheck(src,true);
		script.inconsistentCheck(dest,true);
		script.littleCupCheck(src,true);
		script.littleCupCheck(dest,true);
		script.shanaiAbilityCheck(src,true)
		script.shanaiAbilityCheck(dest,true);
		script.evioliteCheck(src);
		script.evioliteCheck(dest);
		}
		}
		,
		monoColourCheck:function(src,tier){
		if(!tier)
		tier=sys.tier(src);
		if(tier!="Monocolour")
		return;
		var colours={'Red':['Charmander','Charmeleon','Charizard','Vileplume','Paras','Parasect','Krabby','Kingler','Voltorb','Electrode','Goldeen','Seaking','Jynx','Magikarp','Magmar','Flareon','Ledyba','Ledian','Ariados','Yanma','Scizor','Slugma','Magcargo','Octillery','Delibird','Porygon2','Magby','Ho-Oh','Torchic','Combusken','Blaziken','Wurmple','Medicham','Carvanha','Camerupt','Solrock','Corphish','Crawdaunt','Latias','Groudon','Deoxys','Deoxys-A','Deoxys-D','Deoxys-S','Kricketot','Kricketune','Magmortar','Porygon-Z','Rotom','Rotom-H','Rotom-F','Rotom-W','Rotom-C','Rotom-S','Tepig','Pignite','Emboar','Pansear','Simisear','Throh','Venipede','Scolipede','Krookodile','Darumaka','Darmanitan','Dwebble','Crustle','Scrafty','Shelmet','Accelgor','Druddigon','Pawniard','Bisharp','Braviary','Heatmor',],'Blue':['Squirtle','Wartortle','Blastoise','Nidoran?','Nidorina','Nidoqueen','Oddish','Gloom','Golduck','Poliwag','Poliwhirl','Poliwrath','Tentacool','Tentacruel','Tangela','Horsea','Seadra','Gyarados','Lapras','Vaporeon','Omanyte','Omastar','Articuno','Dratini','Dragonair','Totodile','Croconaw','Feraligatr','Chinchou','Lanturn','Marill','Azumarill','Jumpluff','Wooper','Quagsire','Wobbuffet','Heracross','Kingdra','Phanpy','Suicune','Mudkip','Marshtomp','Swampert','Taillow','Swellow','Surskit','Masquerain','Loudred','Exploud','Azurill','Meditite','Sharpedo','Wailmer','Wailord','Swablu','Altaria','Whiscash','Chimecho','Wynaut','Spheal','Sealeo','Walrein','Clamperl','Huntail','Bagon','Salamence','Beldum','Metang','Metagross','Regice','Latios','Kyogre','Piplup','Prinplup','Empoleon','Shinx','Luxio','Luxray','Cranidos','Rampardos','Gible','Gabite','Garchomp','Riolu','Lucario','Croagunk','Toxicroak','Finneon','Lumineon','Mantyke','Tangrowth','Glaceon','Azelf','Phione','Manaphy','Oshawott','Dewott','Samurott','Panpour','Simipour','Roggenrola','Boldore','Gigalith','Woobat','Swoobat','Tympole','Palpitoad','Seismitoad','Sawk','Tirtouga','Carracosta','Ducklett','Karrablast','Eelektrik','Eelektross','Elgyem','Cryogonal','Deino','Zweilous','Hydreigon','Cobalion','Thundurus',],'Green':['Bulbasaur','Ivysaur','Venusaur','Caterpie','Metapod','Bellsprout','Weepinbell','Victreebel','Scyther','Chikorita','Bayleef','Meganium','Spinarak','Natu','Xatu','Bellossom','Politoed','Skiploom','Larvitar','Tyranitar','Celebi','Treecko','Grovyle','Sceptile','Dustox','Lotad','Lombre','Ludicolo','Breloom','Electrike','Roselia','Gulpin','Vibrava','Flygon','Cacnea','Cacturne','Cradily','Kecleon','Tropius','Rayquaza','Turtwig','Grotle','Torterra','Budew','Roserade','Bronzor','Bronzong','Carnivine','Yanmega','Leafeon','Shaymin','Shaymin-S','Snivy','Servine','Serperior','Pansage','Simisage','Swadloon','Cottonee','Whimsicott','Petilil','Lilligant','Basculin','Maractus','Trubbish','Garbodor','Solosis','Duosion','Reuniclus','Axew','Fraxure','Golett','Golurk','Virizion','Tornadus',],'Yellow':['Kakuna','Beedrill','Pikachu','Raichu','Sandshrew','Sandslash','Ninetales','Meowth','Persian','Psyduck','Ponyta','Rapidash','Drowzee','Hypno','Exeggutor','Electabuzz','Jolteon','Zapdos','Moltres','Cyndaquil','Quilava','Typhlosion','Pichu','Ampharos','Sunkern','Sunflora','Girafarig','Dunsparce','Shuckle','Elekid','Raikou','Beautifly','Pelipper','Ninjask','Makuhita','Manectric','Plusle','Minun','Numel','Lunatone','Jirachi','Mothim','Combee','Vespiquen','Chingling','Electivire','Uxie','Cresselia','Victini','Sewaddle','Leavanny','Scraggy','Cofagrigus','Archen','Archeops','Deerling','Joltik','Galvantula','Haxorus','Mienfoo','Keldeo',],'Purple':['Rattata','Ekans','Arbok','Nidoran?','Nidorino','Nidoking','Zubat','Golbat','Venonat','Venomoth','Grimer','Muk','Shellder','Cloyster','Gastly','Haunter','Gengar','Koffing','Weezing','Starmie','Ditto','Aerodactyl','Mewtwo','Crobat','Aipom','Espeon','Misdreavus','Forretress','Gligar','Granbull','Mantine','Tyrogue','Cascoon','Delcatty','Sableye','Illumise','Swalot','Grumpig','Lileep','Shellos','Gastrodon','Ambipom','Drifloon','Drifblim','Mismagius','Stunky','Skuntank','Spiritomb','Skorupi','Drapion','Gliscor','Palkia','Purrloin','Liepard','Gothita','Gothorita','Gothitelle','Mienshao','Genesect',],'Pink':['Clefairy','Clefable','Jigglypuff','Wigglytuff','Slowpoke','Slowbro','Exeggcute','Lickitung','Chansey','Mr. Mime','Porygon','Mew','Cleffa','Igglybuff','Flaaffy','Hoppip','Slowking','Snubbull','Corsola','Smoochum','Miltank','Blissey','Whismur','Skitty','Milotic','Gorebyss','Luvdisc','Cherubi','Cherrim','Mime Jr.','Happiny','Lickilicky','Mesprit','Munna','Musharna','Audino','Alomomola',],'Brown':['Weedle','Pidgey','Pidgeotto','Pidgeot','Raticate','Spearow','Fearow','Vulpix','Diglett','Dugtrio','Mankey','Primeape','Growlithe','Arcanine','Abra','Kadabra','Alakazam','Geodude','Graveler','Golem','Farfetch\'d','Doduo','Dodrio','Cubone','Marowak','Hitmonlee','Hitmonchan','Kangaskhan','Staryu','Pinsir','Tauros','Eevee','Kabuto','Kabutops','Dragonite','Sentret','Furret','Hoothoot','Noctowl','Sudowoodo','Teddiursa','Ursaring','Swinub','Piloswine','Stantler','Hitmontop','Entei','Zigzagoon','Seedot','Nuzleaf','Shiftry','Shroomish','Slakoth','Slaking','Shedinja','Hariyama','Torkoal','Spinda','Trapinch','Baltoy','Feebas','Regirock','Chimchar','Monferno','Infernape','Starly','Staravia','Staraptor','Bidoof','Bibarel','Buizel','Floatzel','Buneary','Lopunny','Bonsly','Hippopotas','Hippowdon','Mamoswine','Heatran','Patrat','Watchog','Lillipup','Conkeldurr','Sandile','Krokorok','Sawsbuck','Beheeyem','Stunfisk','Bouffalant','Vullaby','Mandibuzz','Landorus',],'Black':['Snorlax','Umbreon','Murkrow','Unown','Sneasel','Houndour','Houndoom','Mawile','Spoink','Seviper','Claydol','Shuppet','Banette','Duskull','Dusclops','Honchkrow','Chatot','Munchlax','Weavile','Dusknoir','Giratina','Darkrai','Blitzle','Zebstrika','Sigilyph','Yamask','Chandelure','Zekrom',],'Gray':['Machop','Machoke','Machamp','Magnemite','Magneton','Onix','Rhyhorn','Rhydon','Pineco','Steelix','Qwilfish','Remoraid','Skarmory','Donphan','Pupitar','Poochyena','Mightyena','Nincada','Nosepass','Aron','Lairon','Aggron','Volbeat','Barboach','Anorith','Armaldo','Snorunt','Glalie','Relicanth','Registeel','Shieldon','Bastiodon','Burmy','Wormadam','Wormadam-G','Wormadam-S','Glameow','Purugly','Magnezone','Rhyperior','Probopass','Arceus','Herdier','Stoutland','Pidove','Tranquill','Unfezant','Drilbur','Excadrill','Timburr','Gurdurr','Whirlipede','Zorua','Zoroark','Minccino','Cinccino','Escavalier','Ferroseed','Ferrothorn','Klink','Klang','Klinklang','Durant','Terrakion','Kyurem',],'White':['Butterfree','Seel','Dewgong','Togepi','Togetic','Mareep','Smeargle','Lugia','Linoone','Silcoon','Wingull','Ralts','Kirlia','Gardevoir','Vigoroth','Zangoose','Castform','Absol','Shelgon','Pachirisu','Snover','Abomasnow','Togekiss','Gallade','Froslass','Dialga','Regigigas','Swanna','Vanillite','Vanillish','Vanilluxe','Emolga','Foongus','Amoonguss','Frillish','Jellicent','Tynamo','Litwick','Lampent','Cubchoo','Beartic','Rufflet','Larvesta','Volcarona','Reshiram','Meloetta','Meloetta-S'],}
		var poke=sys.pokemon(sys.teamPoke(src,0));
		var thecolour='';
		for(var colour in colours){
		if(colours[colour].indexOf(poke)>-1){
		thecolour=colour;
		}
		}
		if(thecolour==''){
		botMessage(src,"Bug! "+poke+" doesnt have a colour in checkMonocolour :(");
		sys.changeTier(src,"Challenge Cup");
		sys.stopEvent()
		return;
		}
		for(var i=1;i<6;++i){
		var poke=sys.pokemon(sys.teamPoke(src,i));
		if(colours[thecolour].indexOf(poke)==-1){
		botMessage(src,poke+" doesnt have the colour: "+thecolour);
		sys.changeTier(src,"Challenge Cup");
		sys.stopEvent()
		return;
		}
		}
		botMessage(src,"Your team is a good monocolour team with colour: "+thecolour);
		}
		,
		shanaiAbilityCheck : function(src, se) {
		var tier = sys.tier(src);
		if (["Shanai Cup", "Shanai Cup 1.5", "Shanai Cup STAT", "Original Shanai Cup TEST"].indexOf(tier) == -1) {
		return;
		}
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
		};
		for (var i = 0; i < 6; ++i) {
		var ability = sys.ability(sys.teamPokeAbility(src, i));
		var lability = ability.toLowerCase();
		var poke = sys.pokemon(sys.teamPoke(src, i));
		var lpoke = poke.toLowerCase();

		if (lpoke in bannedAbilities && bannedAbilities[lpoke].indexOf(lability) != -1) {
		botMessage(src, "" + poke + " is not allowed to have ability " + ability + " in this tier. Please change it in Teambuilder (You are now in Challenge Cup).")
		sys.changeTier(src, "Challenge Cup")
		if (se)
		sys.stopEvent();
		return;
		}
		}
		}
		,

		eventMovesCheck : function(src)
		{
		for (var i = 0; i < 6; i++) {
		var poke = sys.teamPoke(src, i);
		if (poke in pokeNatures) {
		for (x in pokeNatures[poke]) {
		if (sys.hasTeamPokeMove(src, i, x) && sys.teamPokeNature(src, i) != pokeNatures[poke][x])
		{
		botMessage(src, "" + sys.pokemon(poke) + " with " + sys.move(x) + " must be a " + sys.nature(pokeNatures[poke][x]) + " nature. Change it in the teambuilder.");
		sys.stopEvent();
		sys.changePokeNum(src, i, 0);
		}

		}
		}
		}
		}
		,
		littleCupCheck : function(src, se) {
		if (["Wifi LC", "Wifi LC Ubers","Wifi LC UU"].indexOf(sys.tier(src)) == -1) {
		return;
		}
		for (var i = 0; i < 6; i++) {
		var x = sys.teamPoke(src, i);
		if (x != 0 && sys.hasDreamWorldAbility(src, i) && lcpokemons.indexOf(x) != -1 ) {
		if (se) {
		botMessage(src, "" + sys.pokemon(x) + " is not allowed with a Dream World ability in this tier. Change it in the teambuilder.");
		}

		if (sys.tier(src) == "Wifi LC" && sys.hasLegalTeamForTier(src, "DW LC") || sys.tier(src) == "Wifi LC Ubers" && sys.hasLegalTeamForTier(src, "DW OU")) {
		sys.changeTier(src, "DW LC");
		}else {
		if (se)
		sys.changePokeNum(src, i, 0);

		}
		if (se)
		sys.stopEvent();
		}
		}
		}
		,
		dreamWorldAbilitiesCheck : function(src, se) {
		if (sys.gen(src) < 5)
		return;

		if (["DW OU", "DW Ubers", "DW LC", "Monotype", "DW UU", "DW LU", "DW 1v1", "Clear Skies", "Challenge Cup" , "CC 1v1", "DW Uber Triples", "DW OU Triples", "DW Uber Doubles", "DW OU Doubles", "Shanai Cup", "Shanai Cup 1.5", "Shanai Cup STAT", "Original Shanai Cup TEST", "Monocolour"].indexOf(sys.tier(src)) != -1) {
		return;
		}

		for (var i = 0; i < 6; i++) {
		var x = sys.teamPoke(src, i);
		if (x != 0 && sys.hasDreamWorldAbility(src, i) && (!(x in dwpokemons) || (breedingpokemons.indexOf(x) != -1 && sys.compatibleAsDreamWorldEvent(src, i) != true))) {
		if (se) {
		if (!(x in dwpokemons))
		botMessage(src, "" + sys.pokemon(x) + " is not allowed with a Dream World ability in this tier. Change it in the teambuilder.");
		else
		botMessage(src, "" + sys.pokemon(x) + " has to be Male and have no egg moves with its Dream World ability in  " + sys.tier(src) + " tier. Change it in the teambuilder.");
		}
		if (sys.tier(src) == "Wifi OU" && sys.hasLegalTeamForTier(src, "DW OU")) {
		sys.changeTier(src, "DW OU");
		} else if (sys.tier(src) == "Wifi OU" && sys.hasLegalTeamForTier(src, "DW Ubers")) {
		sys.changeTier(src, "DW Ubers");
		} else if (sys.tier(src) == "Wifi Ubers") {
		sys.changeTier(src, "DW Ubers");
		}
		else if (sys.tier(src) == "DW 1v1" && sys.hasLegalTeamForTier(src, "DW OU")) {
		sys.changeTier(src, "DW OU");
		}
		else if (sys.tier(src) == "DW 1v1" && sys.hasLegalTeamForTier(src, "DW Ubers")) {
		sys.changeTier(src, "DW Ubers");
		}
		else if (sys.tier(src) == "Wifi UU" && sys.hasLegalTeamForTier(src, "DW UU")) {
		sys.changeTier(src, "DW UU");
		} else if (sys.tier(src) == "Wifi LU" && sys.hasLegalTeamForTier(src, "DW LU")) {
		sys.changeTier(src, "DW LU");
		}
		else if (sys.tier(src) == "Wifi LC" && sys.hasLegalTeamForTier(src, "Wifi LC") || sys.tier(src) == "Wifi LC Ubers" && sys.hasLegalTeamForTier(src, "Wifi LC Ubers")) {
		sys.changeTier(src, "DW LC");
		}else {
		if (se)
		sys.changePokeNum(src, i, 0);

		}
		if (se)
		sys.stopEvent();
		}
		}
		}
		,

		inconsistentCheck : function(src, se) {
		if (["DW OU", "DW UU", "DW LU", "Wifi OU", "Wifi UU", "Wifi LU", "Wifi LC", "DW LC", "Wifi Ubers", "DW Ubers", "Clear Skies", "Monotype", "Monocolour", "Smogon OU", "Smogon UU", "Smogon RU", "Wifi NU"].indexOf(sys.tier(src)) == -1) {
		return;
		}
		var moody = sys.abilityNum("Moody");
		for (var i = 0; i < 6; i++) {
		var x = sys.teamPoke(src, i);

		if (x != 0 && sys.teamPokeAbility(src, i) == moody) {
		botMessage(src, "" + sys.pokemon(x) + " is not allowed with Moody in this tier. Change it in the teambuilder.");
		sys.changeTier(src, "Challenge Cup");
		if (se)
		sys.stopEvent();
		}
		}
		}
		,
		weatherlesstiercheck : function(src, tier) {
		if (!tier) tier = sys.tier(src);
		if (tier != "Clear Skies") return;
		for (var i = 0; i < 6; i++){
		ability = sys.ability(sys.teamPokeAbility(src, i))
		if(ability.toLowerCase() == "drizzle" || ability.toLowerCase() == "drought" || ability.toLowerCase() == "snow warning" || ability.toLowerCase() == "sand stream") {
		botMessage(src, "Your team has a pokemon with the ability: " + ability + ", please remove before entering this tier.");
		if(sys.hasLegalTeamForTier(src, "DW OU")) {
		if(sys.hasLegalTeamForTier(src,"Wifi OU")) {
		sys.changeTier(src, "Wifi OU");
		sys.stopEvent()
		return;
		}
		sys.changeTier(src, "DW OU");
		sys.stopEvent()
		return;
		}
		if(sys.hasLegalTeamForTier(src,"Wifi Ubers")) {
		sys.changeTier(src, "Wifi Ubers");
		sys.stopEvent()
		return;
		}
		sys.changeTier(src, "DW Ubers");
		sys.stopEvent()
		return;
		}
		}
		}
		,

		swiftSwimCheck : function(src, tier){
		if (!tier) tier = sys.tier(src);
		if (tier != "Smogon OU") return;
		for(var i = 0; i <6; ++i){
		if(sys.ability(sys.teamPokeAbility(src, i)) == "Drizzle"){
		for(var j = 0; j <6; ++j){
		if(sys.ability(sys.teamPokeAbility(src, j)) == "Swift Swim"){
		botMessage(src, "You cannot have the combination of Swift Swim and Drizzle in Smogon OU")
		sys.stopEvent()
		sys.changeTier(src, "Challenge Cup")
		return;
		}
		}
		}
		}
		}
		,
		droughtCheck : function(src, tier){
		if (!tier) tier = sys.tier(src);
		if (tier != "Smogon UU") return;
		for(var i = 0; i <6; ++i){
		if(sys.ability(sys.teamPokeAbility(src, i)) == "Drought"){
		botMessage(src, "Drought is not allowed in Smogon UU")
		sys.stopEvent()
		sys.changeTier(src, "Challenge Cup")
		return;
		}
		}
		}
		,
		monotypecheck:function(src,tier){
		if(!tier)
		tier=sys.tier(src);
		if(tier!="Monotype")
		return;
		var TypeA=sys.pokeType1(sys.teamPoke(src,0),5);
		var TypeB=sys.pokeType2(sys.teamPoke(src,0),5);
		var k;
		var checkType;

		for(var i=1;i<6;i++){
		var temptypeA=sys.pokeType1(sys.teamPoke(src,i),5);
		var temptypeB=sys.pokeType2(sys.teamPoke(src,i),5);
		if(sys.teamPoke(src,i)==0){
		temptypeA=TypeA;
		}
		if(checkType!=undefined){
		k=3;
		}
		if(i==1){
		k=1;
		}
		if(TypeB!=17){
		if(temptypeA==TypeA&&temptypeB==TypeB&&k==1||temptypeA==TypeB&&temptypeB==TypeA&&k==1){
		k=2;
		}
		}
		if(temptypeA==TypeA&&k==1||temptypeB==TypeA&&k==1){
		checkType=TypeA;
		}
		if(temptypeA==TypeB&&k==1||temptypeB==TypeB&&k==1){
		if(TypeB!=17){
		checkType=TypeB;
		}
		if(TypeB==17)
		checkType=TypeA;
		}
		if(i>1&&k==2){
		k=1;
		if(temptypeA==TypeA&&temptypeB==TypeB&&k==1||temptypeA==TypeB&&temptypeB==TypeA&&k==1){
		k=2;
		}
		if(temptypeA==TypeA&&k==1||temptypeB==TypeA&&k==1){
		checkType=TypeA;
		}
		if(temptypeA==TypeB&&k==1||temptypeB==TypeB&&k==1){
		if(TypeB!=17){
		checkType=TypeB;
		}
		if(TypeB==17)
		checkType=TypeA;
		}
		}

		if(k==3){
		if(temptypeA!=checkType&&temptypeB!=checkType){
		botMessage(src,"Team not Monotype as "+sys.pokemon(sys.teamPoke(src,i))+" is not "+sys.type(checkType)+"!");
		if(sys.hasLegalTeamForTier(src,"Dream World")){
		if(sys.hasLegalTeamForTier(src,"Wifi")){
		sys.changeTier(src,"Wifi");
		sys.stopEvent()
		return;
		}
		sys.changeTier(src,"Dream World");
		sys.stopEvent()
		return;
		}
		if(sys.hasLegalTeamForTier(src,"Wifi Ubers")){
		sys.changeTier(src,"Wifi Ubers");
		sys.stopEvent()
		return;
		}
		sys.changeTier(src,"Dream World Ubers");
		sys.stopEvent()
		return;
		}
		}

		if(k==1){
		if(TypeB==17){
		TypeB=TypeA;
		}

		if(temptypeA!=TypeA&&temptypeB!=TypeA&&temptypeA!=TypeB&&temptypeB!=TypeB){
		botMessage(src,"Team not Monotype as "+sys.pokemon(sys.teamPoke(src,i))+" does not share a type with "+sys.pokemon(sys.teamPoke(src,0))+"!")
		if(sys.hasLegalTeamForTier(src,"Dream World")){
		if(sys.hasLegalTeamForTier(src,"Wifi")){
		sys.changeTier(src,"Wifi");
		sys.stopEvent()
		return;
		}
		sys.changeTier(src,"Dream World");
		sys.stopEvent()
		return;
		}
		if(sys.hasLegalTeamForTier(src,"Wifi Ubers")){
		sys.changeTier(src,"Wifi Ubers");
		sys.stopEvent()
		return;
		}
		sys.changeTier(src,"Dream World Ubers");
		sys.stopEvent()
		return;
		}
		}
		}
		}
		,
		namecolor: function (src) {
		if (sys.getColor(src) == '#000000') {
		var clist = ['#5811b1','#399bcd','#0474bb','#f8760d','#a00c9e','#0d762b','#5f4c00','#9a4f6d','#d0990f','#1b1390','#028678','#0324b1'];
		return clist[src % clist.length];
		}
		return sys.getColor(src);
		}
		,

		beforePlayerKick: function(src, tar) {
		JSESSION.users(src).muteCheck();
		sys.stopEvent();

		if (JSESSION.users(src).muted) {
		sys.sendHtmlAll("<timestamp/><b>Mute Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> /kick "+sys.name(tar), watch);

		print("Mute Message -- "+sys.name(src)+": /kick "+sys.name(tar));

		var time = DataHash.mutes[ip].time != 0 ? "Muted for "+getTimeString(DataHash.mutes[ip].time-sys.time()*1) : "Muted forever";
		var by = DataHash.mutes[ip].by+"</i>";
		var why = DataHash.mutes[ip].why

		botMessage(src, "You are muted by "+by+". Reason: "+why+". "+time+"!");
		return;
		}

		My.kick(src,tar,"","MidnightBlue");
		return;
		}
		,

		beforePlayerBan: function(src, tar) {
		JSESSION.users(src).muteCheck();
		sys.stopEvent();

		if (JSESSION.users(src).muted) {
		sys.sendHtmlAll("<timestamp/><b>Mute Message</b> -- <font color="+getColor+"><b>"+sys.name(src)+":</b></font> /ban "+sys.name(tar), watch);

		print("Mute Message -- "+sys.name(src)+": /ban "+sys.name(tar));

		var time = DataHash.mutes[ip].time != 0 ? "Muted for "+getTimeString(DataHash.mutes[ip].time-sys.time()*1) : "Muted forever";
		var by = DataHash.mutes[ip].by+"</i>";
		var why = DataHash.mutes[ip].why

		botMessage(src, "You are muted by "+by+". Reason: "+why+". "+time+"!");
		return;
		}

		My.ban(src,tar,"","DarkOrange");
		return;
		}
		,

		myload:function() {
		My = new (function() {

		this.kick = function(src,tar,reason,color) {
		if(tar == undefined) {
		botMessage(src,"That person isn't online.");
		return;
		}

		if(sys.dbAuth(sys.ip(tar)) >= sys.auth(src) && sys.auth(src) < 3) {
		botMessage(src,"Can't kick higher or equal Auth.");
		return;
		}

		sys.sendHtmlAll("<font color='"+color+"'><timestamp/><b> "+sys.name(src)+" kicked "+sys.name(tar)+"!</b></font>");
		if(!isEmpty(reason))
		sys.sendHtmlAll("<font color='"+color+"'><timestamp/><b>Reason:</b></font> "+reason);
		kick(tar);
		}

		this.ban = function(src,tar,reason,color) {
		if(tar == undefined) {
		botMessage(src,"That person isn't online.");
		return;
		}

		if(sys.dbAuth(sys.ip(tar)) >= sys.auth(src) && sys.auth(src) < 3) {
		botMessage(src,"Can't kick higher or equal Auth.");
		return;
		}

		sys.sendHtmlAll("<font color="+color+"><timestamp/><b>"+sys.name(src)+" banned "+sys.name(tar)+"!</b></font>");
		if(!isEmpty(reason))
		sys.sendHtmlAll("<font color="+color+"><timestamp/><b>Reason:</b></font> "+reason);
		ban(sys.name(tar));
		return;
		}

		this.massKick = function(src) {
		botEscapeAll("Masskick called by "+sys.name(src)+"!");
		massKick();
		}
		})();
		}
		,

		advance200Check: function(src, tier){
		if (!tier) tier = sys.tier(src);
		if (tier != "Adv 200")
		return;
		if(typeof advanced200banlist === 'undefined') {
		var pokes = {
		"Sceptile": ["Dynamicpunch", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift", "Thunderpunch", "Mega Punch", "Swords Dance", "Mega Kick", "Body Slam", "Double-Edge", "Counter", "Seismic Toss", "Mimic", "Substitute"],
		"Torchic": ["Snore", "Endure", "Mud-slap", "Sleep Talk", "Swift", "Mega Punch", "Swords Dance", "Mega Kick", "Body Slam", "Double-Edge", "Seismic Toss", "Mimic", "Substitute", "Rock Slide"],
		"Combusken": ["Dynamicpunch", "Snore", "Endure", "Mud-slap", "Sleep Talk", "Swift", "Mega Punch", "Swords Dance", "Mega Kick", "Body Slam", "Double-Edge", "Seismic Toss", "Mimic", "Substitute", "Rock Slide", "Thunderpunch", "Fire Punch", "Fury Cutter"],
		"Blaziken": ["Dynamicpunch", "Snore", "Endure", "Mud-slap", "Sleep Talk", "Swift", "Mega Punch", "Swords Dance", "Mega Kick", "Body Slam", "Double-Edge", "Seismic Toss", "Mimic", "Substitute", "Rock Slide", "Thunderpunch", "Fire Punch", "Fury Cutter"],
		"Mudkip": ["Body Slam", "Double-Edge", "Mimic", "Substitute", "Rollout", "Snore", "Icy Wind", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Defense Curl"],
		"Marshtomp": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Rock Slide", "Substitute", "Dynamicpunch", "Rollout", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Defense Curl"],
		"Swampert": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Rock Slide", "Substitute", "Dynamicpunch", "Rollout", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Defense Curl"],
		"Poochyena": ["Psych Up", "Snore", "Endure", "Mud-slap", "Sleep Talk", "Body Slam", "Double-edge", "Counter", "Mimic", "Substitute"],
		"Mightyena": ["Psych Up", "Snore", "Endure", "Mud-slap", "Sleep Talk", "Body Slam", "Double-edge", "Counter", "Mimic", "Substitute"],
		"Zigzagoon": ["Body Slam", "Double-edge", "Mimic", "Thunder Wave", "Rollout", "Snore", "Icy Wind", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift", "Defense Curl", "Fury Cutter"],
		"Linoone": ["Body Slam", "Double-edge", "Mimic", "Thunder Wave", "Rollout", "Snore", "Icy Wind", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift", "Defense Curl", "Fury Cutter"],
		"Wurmple":[],
		"Silcoon":[],
		"Cascoon":[],
		"Beautifly": ["Double-edge", "Mimic", "Substitute", "Snore", "Endure", "Swagger", "Sleep Talk", "Swift"],
		"Dustox": ["Double-edge", "Mimic", "Substitute", "Snore", "Endure", "Swagger", "Sleep Talk", "Swift"],
		"Lotad": ["Swords Dance", "Body Slam", "Double-Edge", "Mimic", "Substitute", "Snore", "Icy Wind", "Endure", "Swagger", "Sleep Talk"],

		"Lombre": ["Swords Dance", "Body Slam", "Double-Edge", "Mimic", "Substitute", "Dynamicpunch", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch"],
		"Ludicolo": ["Mega Punch", "Swords Dance", "Mega Kick", "Body Slam", "Double-Edge", "Seismic Toss", "Mimic", "Metronome", "Substitute", "Dynamicpunch", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch"],
		"Seedot": ["Swords Dance", "Body Slam", "Double-Edge", "Mimic", "Substitute", "Rollout", "Snore", "Endure", "Swagger", "Sleep Talk", "Defense Curl"],
		"Nuzleaf": ["Swords Dance", "Mega Kick", "Body Slam", "Double-Edge", "Mimic", "Substitute", "Rollout", "Psych Up", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift", "Defense Curl", "Fury Cutter"],
		"Shiftry": ["Swords Dance", "Mega Kick", "Body Slam", "Double-Edge", "Mimic", "Substitute", "Rollout", "Psych Up", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift", "Defense Curl", "Fury Cutter"],
		"Taillow": ["Double-edge", "Counter", "Mimic", "Substitute", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift"],
		"Swellow": ["Double-edge", "Counter", "Mimic", "Substitute", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift"],
		"Wingull": ["Double-Edge", "Mimic", "Substitute", "Snore", "Icy Wind", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift"],
		"Pelipper": ["Double-Edge", "Mimic", "Substitute", "Snore", "Icy Wind", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift"],
		"Ralts": ["Body Slam", "Double-edge", "Mimic", "Dream Eater", "Thunder Wave", "Substitute", "Psych Up", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Defense Curl", "Thunderpunch", "Fire Punch"],
		"Kirlia": ["Body Slam", "Double-edge", "Mimic", "Dream Eater", "Thunder Wave", "Substitute", "Psych Up", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Defense Curl", "Thunderpunch", "Fire Punch"],
		"Gardevoir": ["Body Slam", "Double-edge", "Mimic", "Dream Eater", "Thunder Wave", "Substitute", "Psych Up", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Defense Curl", "Thunderpunch", "Fire Punch"],
		"Surskit": ["Double-edge", "Mimic", "Substitute", "Psych Up", "Snore", "Icy Wind", "Endure", "Swagger", "Sleep Talk", "Swift"],
		"Masquerain": ["Double-edge", "Mimic", "Substitute", "Psych Up", "Snore", "Icy Wind", "Endure", "Swagger", "Sleep Talk", "Swift"],
		"Shroomish": ["Swords Dance", "Body Slam", "Double-edge", "Mimic", "Substitute", "Snore", "Endure", "Sleep Talk"],
		"Breloom": ["Mega Punch", "Swords Dance", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Substitute", "Dynamicpunch", "Snore", "Endure", "Mud-slap", "Sleep Talk", "Thunderpunch", "Fury Cutter"],
		"Slakoth": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Seismic Toss", "Mimic", "Rock Slide", "Substitute", "Dynamicpunch", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch", "Fury Cutter"],
		"Vigoroth": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Seismic Toss", "Mimic", "Rock Slide", "Substitute", "Dynamicpunch", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch", "Fury Cutter"],
		"Slaking": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Seismic Toss", "Mimic", "Rock Slide", "Substitute", "Dynamicpunch", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch", "Fury Cutter"],
		"Abra": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Metronome", "Dream Eater", "Thunder Wave", "Substitute", "Dynamicpunch", "Psych Up", "Snore", "Endure", "Swagger", "Sleep Talk", "Barrier"],
		"Kadabra": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Metronome", "Dream Eater", "Thunder Wave", "Substitute", "Dynamicpunch", "Psych Up", "Snore", "Endure", "Swagger", "Sleep Talk", "Barrier"],
		"Alakazam": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Metronome", "Dream Eater", "Thunder Wave", "Substitute", "Dynamicpunch", "Psych Up", "Snore", "Endure", "Swagger", "Sleep Talk", "Barrier"],
		"Nincada": ["Double-edge", "Mimic", "Substitute", "Snore", "Mud-slap", "Swagger", "Sleep Talk", "Fury Cutter"],
		"Ninjask": ["Double-edge", "Mimic", "Substitute", "Snore", "Mud-slap", "Swagger", "Sleep Talk", "Fury Cutter"],
		"Shedinja": ["Double-edge", "Mimic", "Dream Eater", "Substitute", "Snore", "Mud-slap", "Swagger", "Sleep Talk", "Fury Cutter"],
		"Whismur": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Substitute", "Dynamicpunch", "Rollout", "Psych Up", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Sleep Talk", "Defense Curl", "Thunderpunch", "Fire Punch"],
		"Loudred": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Rock Slide", "Substitute", "Dynamicpunch", "Rollout", "Psych Up", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Sleep Talk", "Defense Curl", "Thunderpunch", "Fire Punch"],
		"Exploud": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Rock Slide", "Substitute", "Dynamicpunch", "Rollout", "Psych Up", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Sleep Talk", "Defense Curl", "Thunderpunch", "Fire Punch"],
		"Makuhita": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Mimic", "Metronome", "Rock Slide", "Substitute", "Snore", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch"],
		"Hariyama": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Mimic", "Metronome", "Rock Slide", "Substitute", "Snore", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch"],
		"Goldeen": ["Double-edge", "Mimic", "Substitute", "Snore", "Icy Wind", "Endure", "Swagger", "Swift", "Psybeam", "Haze"],
		"Seaking": ["Double-edge", "Mimic", "Substitute", "Snore", "Icy Wind", "Endure", "Swagger", "Swift", "Psybeam", "Haze"],
		"Magikarp": [],
		"Gyarados": ["Body Slam", "Double-Edge", "Mimic", "Thunder Wave", "Substitute", "Snore", "Icy Wind", "Endure", "Swagger", "Sleep Talk"],
		"Azurill": ["Body Slam", "Double-edge", "Mimic", "Substitute", "Rollout", "Snore", "Icy Wind", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift", "Defense Curl"],
		"Marill": ["Mega Punch", "Mega Kick", "Body Slam", "Mimic", "Substitute", "Dynamicpunch", "Rollout", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Swift", "Defense Curl", "Present", "Belly Drum", "Perish Song"],
		"Azumarill": ["Mega Punch", "Mega Kick", "Body Slam", "Seismic Toss", "Mimic", "Substitute", "Dynamicpunch", "Rollout", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Swift", "Defense Curl", "Present", "Belly Drum", "Perish Song"],
		"Geodude": ["Body Slam", "Counter", "Seismic Toss", "Mimic", "Metronome", "Substitute", "Dynamicpunch", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Fire Punch", "Mega Punch"],
		"Graveler": ["Body Slam", "Counter", "Seismic Toss", "Mimic", "Metronome", "Substitute", "Dynamicpunch", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Fire Punch", "Mega Punch"],
		"Golem": ["Body Slam", "Counter", "Seismic Toss", "Mimic", "Metronome", "Substitute", "Dynamicpunch", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Fire Punch", "Fury Cutter", "Mega Punch"],
		"Nosepass": ["Body Slam", "Double-edge", "Mimic", "Substitute", "Dynamicpunch", "Rollout", "Snore", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Defense Curl", "Thunderpunch", "Fire Punch"],
		"Skitty": ["Body Slam", "Mimic", "Dream Eater", "Thunder Wave", "Rollout", "Psych Up", "Snore", "Icy Wind", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift", "Defense Curl", "Wish"],
		"Delcatty": ["Body Slam", "Mimic", "Dream Eater", "Thunder Wave", "Rollout", "Psych Up", "Snore", "Icy Wind", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift", "Defense Curl", "Wish"],
		"Zubat": ["Double-edge", "Mimic", "Substitute", "Snore", "Endure", "Swagger", "Sleep Talk", "Swift", "Faint Attack", "Whirlwind", "Curse"],
		"Golbat": ["Double-edge", "Mimic", "Substitute", "Snore", "Endure", "Swagger", "Sleep Talk", "Swift", "Faint Attack", "Whirlwind", "Curse"],
		"Crobat": ["Double-edge", "Mimic", "Substitute", "Snore", "Endure", "Swagger", "Sleep Talk", "Swift", "Faint Attack", "Whirlwind", "Curse"],
		"Tentacool": ["Swords Dance", "Double-edge", "Mimic", "Substitute", "Snore", "Icy Wind", "Endure", "Swagger", "Sleep Talk", "Aurora Beam", "Rapid Spin", "Haze"],
		"Tentacruel": ["Swords Dance", "Double-edge", "Mimic", "Substitute", "Snore", "Icy Wind", "Endure", "Swagger", "Sleep Talk", "Aurora Beam", "Rapid Spin", "Haze"],
		"Sableye": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Metronome", "Dream Eater", "Substitute", "Dynamicpunch", "Snore", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch", "Fury Cutter"],
		"Mawile": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Rock Slide", "Substitute", "Dynamicpunch", "Psych Up", "Snore", "Icy Wind", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch"],
		"Aron": ["Mimic", "Rock Slide", "Substitute", "Rollout", "Snore", "Endure", "Swagger", "Sleep Talk", "Defense Curl", "Fury Cutter"],
		"Lairon": ["Mimic", "Rock Slide", "Substitute", "Rollout", "Snore", "Endure", "Swagger", "Sleep Talk", "Defense Curl", "Fury Cutter"],
		"Aggron": ["Mega Punch", "Mega Kick", "Counter", "Seismic Toss", "Mimic", "Thunder Wave", "Rock Slide", "Substitute", "Dynamicpunch", "Rollout", "Snore", "Icy Wind", "Endure", "Ice Punch", "Swagger", "Sleep Talk", "Defense Curl", "Thunderpunch", "Fire Punch", "Fury Cutter"],
		"Machop": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Mimic", "Metronome", "Substitute", "Snore", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch", "Rolling Kick"],
		"Machoke": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Mimic", "Metronome", "Substitute", "Snore", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch", "Rolling Kick"],
		"Machamp": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Mimic", "Metronome", "Substitute", "Snore", "Endure", "Mud-slap", "Ice Punch", "Swagger", "Sleep Talk", "Thunderpunch", "Fire Punch", "Rolling Kick"],
		"Meditite": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Metronome", "Dream Eater", "Substitute", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift"],
		"Medicham": ["Mega Punch", "Mega Kick", "Body Slam", "Double-edge", "Counter", "Seismic Toss", "Mimic", "Metronome", "Dream Eater", "Rock Slide", "Substitute", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift"],
		"Electrike": ["Body Slam", "Double-edge", "Mimic", "Substitute", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk"],
		"Manectric": ["Body Slam", "Double-edge", "Mimic", "Substitute", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk"],
		"Plusle": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Mega Kick", "Mega Punch", "Metronome", "Mimic", "Mud-Slap", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Swagger", "Swift", "ThunderPunch", "Wish"],
		"Minun": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Mega Kick", "Mega Punch", "Metronome", "Mimic", "Mud-Slap", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Swagger", "Swift", "ThunderPunch", "Wish"],
		"Magnemite": ["Double-Edge", "Endure", "Mimic", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Magneton": ["Double-Edge", "Endure", "Mimic", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Voltorb": ["Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave"],
		"Electrode": ["Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave"],
		"Volbeat": ["Body Slam", "Counter", "DynamicPunch", "Endure", "Ice Punch", "Mega Kick", "Mega Punch", "Metronome", "Mimic", "Mud-Slap", "Psych Up", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Thunder Wave", "ThunderPunch"],
		"Illumise": ["Body Slam", "Counter", "Double-Edge", "DynamicPunch", "Endure", "Ice Punch", "Mega Kick", "Mega Punch", "Metronome", "Mimic", "Mud-Slap", "Psych Up", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Thunder Wave", "ThunderPunch"],
		"Oddish": ["Double-Edge", "Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance"],
		"Gloom": ["Double-Edge", "Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance"],
		"Vileplume": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Sleep Talk", "Substitute", "Swagger", "Swords Dance"],
		"Bellossom": ["Double-Edge", "Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance"],
		"Doduo": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Faint Attack", "Flail"],
		"Dodrio": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Faint Attack", "Flail"],
		"Roselia": ["Body Slam", "Double-Edge", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Swords Dance"],
		"Gulpin": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "Dream Eater", "DynamicPunch", "Endure", "Explosion", "Fire Punch", "Ice Punch", "Mimic", "Mud-Slap", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "ThunderPunch", "Pain Split"],
		"Swalot": ["Counter", "Defense Curl", "Double-Edge", "Dream Eater", "DynamicPunch", "Endure", "Explosion", "Fire Punch", "Ice Punch", "Mimic", "Mud-Slap", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "ThunderPunch", "Pain Split"],
		"Carvanha": ["Double-Edge", "Endure", "Fury Cutter", "Icy Wind", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Sharpedo": ["Double-Edge", "Endure", "Fury Cutter", "Icy Wind", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Wailmer": ["Body Slam", "Defense Curl", "Double-Edge", "Endure", "Icy Wind", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Wailord": ["Body Slam", "Defense Curl", "Double-Edge", "Endure", "Icy Wind", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Numel": ["Body Slam", "Defense Curl", "Endure", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Camerupt": ["Body Slam", "Defense Curl", "Endure", "Explosion", "Mimic", "Mud-Slap", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Slugma": ["Defense Curl", "Double-Edge", "Endure", "Mimic", "Mud-Slap", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "Heat Wave"],
		"Magcargo": ["Defense Curl", "Double-Edge", "Endure", "Mimic", "Mud-Slap", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "Heat Wave"],
		"Torkoal": ["Double-Edge", "Endure", "Explosion", "Mimic", "Mud-Slap", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Grimer": ["Body Slam", "DynamicPunch", "Endure", "Explosion", "Fire Punch", "Ice Punch", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "ThunderPunch"],
		"Muk": ["Body Slam", "DynamicPunch", "Endure", "Explosion", "Fire Punch", "Ice Punch", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "ThunderPunch"],
		"Koffing": ["Endure", "Mimic", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "Psybeam", "Pain Split"],
		"Weezing": ["Endure", "Mimic", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "Psybeam", "Pain Split"],
		"Spoink": ["Body Slam", "Double-Edge", "Dream Eater", "Endure", "Icy Wind", "Mimic", "Sleep Talk", "Substitute", "Swagger", "Swift"],
		"Grumpig": ["Body Slam", "Counter", "Double-Edge", "Dream Eater", "DynamicPunch", "Endure", "Fire Punch", "Ice Punch", "Icy Wind", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Seismic Toss", "Sleep Talk", "Substitute", "Swagger", "Swift", "Thunderpunch"],
		"Sandshrew": ["Body Slam", "Counter", "Double-Edge", "DynamicPunch", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance"],
		"Sandslash": ["Body Slam", "Counter", "Double-Edge", "DynamicPunch", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance"],
		"Skarmory": ["Counter", "Double-Edge", "Endure", "Mimic", "Mud-Slap", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger", "Whirlwind", "Curse"],
		"Spinda": ["Body Slam", "Counter", "Defense Curl", "Dream Eater", "DynamicPunch", "Endure", "Fire Punch", "Ice Punch", "Icy Wind", "Mega Kick", "Mega Punch", "Metronome", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "ThunderPunch", "Wish"],
		"Trapinch": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Mud-Slap", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Vibrava": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Mud-Slap", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Flygon": ["Body Slam", "Double-Edge", "Earth Power", "Endure", "Fire Punch", "Fury Cutter", "Mimic", "Mud-Slap", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Cacnea": ["Body Slam", "Counter", "Double-Edge", "DynamicPunch", "Endure", "Mega Punch", "Mimic", "Mud-Slap", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swords Dance", "ThunderPunch"],
		"Cacturne": ["Body Slam", "Counter", "Double-Edge", "DynamicPunch", "Endure", "Low Kick", "Magic Coat", "Mega Punch", "Mimic", "Mud-Slap", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swords Dance", "ThunderPunch"],
		"Swablu": ["Body Slam", "Double-Edge", "Dream Eater", "Endure", "Mimic", "Mud-Slap", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Altaria": ["Body Slam", "Double-Edge", "Dream Eater", "Endure", "Mimic", "Mud-Slap", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Zangoose": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Fire Punch", "Fury Cutter", "Ice Punch", "Icy Wind", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Swords Dance", "Thunder Wave", "ThunderPunch"],
		"Seviper": ["Body Slam", "Double-Edge", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swift"],
		"Lunatone": ["Body Slam", "Defense Curl", "Double-Edge", "Dream Eater", "Endure", "Mimic", "Psych Up", "Rock Slide", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Solrock": ["Body Slam", "Defense Curl", "Double-Edge", "Dream Eater", "Endure", "Mimic", "Psych Up", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Barboach": ["Double-Edge", "Endure", "icy Wind", "Mimic", "Mud-Slap", "Sleep Talk", "Substitute", "Swagger"],
		"Whiscash": ["Double-Edge", "Endure", "Icy Wind", "Mimic", "Mud-Slap", "Rock Slide", "Sleep Talk", "Substitute", "Swagger"],
		"Corphish": ["Body Slam", "Counter", "Double-Edge", "Endure", "Fury Cutter", "Icy Wind", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Crawdaunt": ["Body Slam", "Counter", "Double-Edge", "Endure", "Fury Cutter", "Icy Wind", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Baltoy": ["Double-Edge", "Dream Eater", "Endure", "Explosion", "Mimic", "Psych Up", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Claydol": ["Double-Edge", "Dream Eater", "Endure", "Mimic", "Psych Up", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Lileep": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Cradily": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Anorith": ["Body Slam", "Double-Edge", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance", "Rapid Spin"],
		"Armaldo": ["Body Slam", "Double-Edge", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Rock Slide", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance", "Rapid Spin"],
		"Igglybuff": ["Body Slam", "Counter", "Double-Edge", "Dream Eater", "Endure", "Icy Wind", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Psych Up", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave", "Perish Song", "Present", "Wish"],
		"Jigglypuff": ["Body Slam", "Counter", "Dream Eater", "DynamicPunch", "Endure", "Fire Punch", "Ice Punch", "Mega Kick", "Mega Punch", "Mud-Slap", "Psych Up", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave", "ThunderPunch", "Perish Song", "Present", "Wish"],
		"Wigglytuff": ["Body Slam", "Counter", "Dream Eater", "DynamicPunch", "Endure", "Fire Punch", "Ice Punch", "Mega Kick", "Mega Punch", "Mud-Slap", "Psych Up", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave", "ThunderPunch", "Perish Song", "Present", "Wish"],
		"Feebas": ["Double-Edge", "Endure", "Icy Wind", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Milotic": ["Body Slam", "Double-Edge", "Endure", "Icy Wind", "Mimic", "Mud-Slap", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Castform": ["Body Slam", "Defense Curl", "Double-Edge", "Endure", "Icy Wind", "Mimic", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Thunder Wave"],
		"Staryu": ["Double-Edge", "Endure", "Icy Wind", "Mimic", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave"],
		"Starmie": ["Double-Edge", "Dream Eater", "Endure", "Icy Wind", "Mimic", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave"],
		"Kecleon": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Fire Punch", "Fury Cutter", "Ice Punch", "Icy Wind", "Mega Kick", "Mega Punch", "Metronome", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Swagger", "Swift", "Thunder Wave", "ThunderPunch"],
		"Shuppet": ["Body Slam", "Double-Edge", "Dream Eater", "Endure", "Icy Wind", "Mimic", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave"],
		"Banette": ["Body Slam", "Double-Edge", "Dream Eater", "Endure", "Icy Wind", "Metronome", "Mimic", "Mud-Slap", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave"],
		"Duskull": ["Body Slam", "Double-Edge", "Dream Eater", "Endure", "Icy Wind", "Mimic", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Pain Split"],
		"Dusclops": ["Body Slam", "Counter", "Double-Edge", "Dream Eater", "DynamicPunch", "Endure", "Fire Punch", "Ice Punch", "Icy Wind", "Mega Kick", "Mega Punch", "Metronome", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunderpunch", "Pain Split"],
		"Tropius": ["Double-Edge", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance"],
		"Chimecho": ["Defense Curl", "Endure", "Icy Wind", "Mimic", "Psych Up", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Absol": ["Body Slam", "Counter", "Dream Eater", "Double-Edge", "Endure", "Fury Cutter", "Icy Wind", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Sleep Talk", "Snore", "Swagger", "Swift", "Thunder Wave"],
		"Vulpix": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Spite"],
		"Ninetales": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Spite"],
		"Pichu": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "Endure", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Thunder Wave", "Present", "Wish"],
		"Pikachu": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "ThunderPunch", "Present", "Wish"],
		"Raichu": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "ThunderPunch", "Present", "Wish"],
		"Psyduck": ["Body Slam", "Counter", "Double-Edge", "DynamicPunch", "Endure", "Ice Punch", "Icy Wind", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Golduck": ["Body Slam", "Counter", "Double-Edge", "DynamicPunch", "Endure", "Fury Cutter", "Ice Punch", "Icy Wind", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Natu": ["Double-Edge", "Dream Eater", "Endure", "Mimic", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Thunder Wave", "Faint Attack", "Featherdance"],
		"Xatu": ["Double-Edge", "Dream Eater", "Endure", "Mimic", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift", "Thunder Wave"],
		"Girafarig": ["Body Slam", "Double-edge", "Mimic", "Dream Eater", "Thunder Wave", "Substitute", "Psych Up", "Snore", "Endure", "Mud-slap", "Swagger", "Sleep Talk", "Swift", "Beat Up", "Wish"],
		"Phanpy": ["Body Slam", "Counter", "Double-Edge", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Donphan": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "Mimic", "Mud-Slap", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Pinsir": ["Body Slam", "Double-Edge", "Endure", "Fury Cutter", "Mimic", "Rock Slide", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Flail"],
		"Heracross": ["Body Slam", "Counter", "Double-Edge", "Fury Cutter", "Mimic", "Rock Slide", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance", "Bide", "Flail"],
		"Rhyhorn": ["Body Slam", "Counter", "Double-Edge", "Endure", "Icy Wind", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance"],
		"Rhydon": ["Body Slam", "Counter", "Double-Edge", "DynamicPunch", "Endure", "fire Punch", "Icy Wind", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swords Dance", "ThunderPunch"],
		"Snorunt": ["Body Slam", "Double-Edge", "Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Glalie": ["Body Slam", "Double-Edge", "Explosion", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Spheal": ["Double-Edge", "Endure", "Icy Wind", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Sleep Talk", "Substitute", "Swagger"],
		"Sealeo": ["Double-Edge", "Endure", "Icy Wind", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Sleep Talk", "Substitute"],
		"Walrein": ["Double-Edge", "Endure", "Icy Wind", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Sleep Talk", "Substitute"],
		"Clamperl": ["Body Slam", "Double-Edge", "Endure", "Icy Wind", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Huntail": ["Body Slam", "Double-Edge", "Endure", "Icy Wind", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Gorebyss": ["Body Slam", "Double-Edge", "Endure", "Icy Wind", "Mimic", "Mud-Slap", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Relicanth": ["Body Slam", "Endure", "Icy Wind", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Corsola": ["Body Slam", "Defense Curl", "Double-Edge", "Endure", "Explosion", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "Icicle Spear"],
		"Chinchou": ["Double-Edge", "Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Lanturn": ["Double-Edge", "Endure", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Luvdisc": ["Double-Edge", "Endure", "Icy Wind", "Mimic", "Psych Up", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Horsea": ["Double-Edge", "Endure", "Icy Wind", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Seadra": ["Double-Edge", "Endure", "Icy Wind", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Kingdra": ["Body Slam", "Double-Edge", "Endure", "Icy Wind", "Mimic", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Bagon": ["Body Slam", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Rock Slide", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Shelgon": ["Body Slam", "Defense Curl", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger"],
		"Salamence": ["Body Slam", "Defense Curl", "Endure", "Fury Cutter", "Mimic", "Mud-Slap", "Rock Slide", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swagger", "Swift"],
		"Beldum": [],
		"Metang": ["Body Slam", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Explosion", "Fury Cutter", "Ice Punch", "Icy Wind", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swift", "Thunderpunch"],
		"Metagross": ["Body Slam", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Explosion", "Fury Cutter", "Ice Punch", "Icy Wind", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Rollout", "Sleep Talk", "Snore", "Substitute", "Swift", "Thunderpunch"],
		"Regirock": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Explosion", "Fire Punch", "Ice Punch", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Psych Up", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave", "ThunderPunch"],
		"Regice": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Explosion", "Ice Punch", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave", "ThunderPunch"],
		"Registeel": ["Body Slam", "Counter", "Defense Curl", "Double-Edge", "DynamicPunch", "Endure", "Explosion", "Ice Punch", "Mega Kick", "Mega Punch", "Mimic", "Mud-Slap", "Psych Up", "Rock Slide", "Rollout", "Seismic Toss", "Sleep Talk", "Snore", "Substitute", "Swagger", "Thunder Wave", "ThunderPunch"]
		}
		advance200Banlist = {};
		for (var poke in pokes) {
		var pokeNum = sys.pokeNum(poke);
		if (!pokeNum) {
		botEscapeAll("Script Error: pokemon " + poke + " is unknown in 200 banlist", 0)
		continue;
		}
		advance200Banlist[pokeNum] = [];
		for (var k = 0; k < pokes[poke].length; ++k) {
		var moveNum = sys.moveNum(pokes[poke][k]);
		if (!moveNum) {
		botEscapeAll("Script Error: move " + pokes[poke][k] + " for pokemon " + poke + " is unknown in 200 banlist", 0)
		continue;
		}
		advance200Banlist[pokeNum].push(moveNum);
		}
		}

		}
		var valid = true;
		for (var i = 0; i < 6; ++i) {
		var poke = sys.teamPoke(src, i);
		if (poke != 0 && !advance200Banlist.hasOwnProperty(poke)) {
		botEscapeAll("Script Error: pokemon " + sys.pokemon(poke) + " should be banned in advance 200 in tiers.xml", 0);
		botMessage(src, "Pokemon " + sys.pokemon(poke) + " is not allowed in advance 200!");
		valid = false;
		break;
		}
		if (poke == 0)
		continue;
		for (var j = 0; j < 4; ++j) {
		var move = sys.teamPokeMove(src, i, j);
		if (advance200Banlist[poke].indexOf(move) >= 0) {
		botMessage(src, "Pokemon " + sys.pokemon(poke) + " is not allowed to have move " + sys.move(move) + " in advance 200!");
		valid = false;
		break;
		}
		}
		}
		if (!valid) {
		sys.changeTier(src, "Challenge Cup");
		sys.stopEvent();
		}
		}
		,
		
		evioliteCheck: function(src, tier) {
		var t = sys.tier(src);
		if(tier != undefined) t = tier;
		if(t != "Wifi NU")
		return;
		var evioliteLimit = 6;
		var eviolites = 0;
		for (var i = 0; i < 6; i++) {
		var x = sys.teamPoke(src, i);
		var item = sys.teamPokeItem(src, i);
		item = item !== undefined ? sys.item(item) : "(no item)";
		if (item == "Eviolite" && ++eviolites > evioliteLimit) {
		botMessage(src, "Only 1 pokemon is allowed with eviolite in Wifi NU tier. Please remove extra evioites in teambuilder.");
		return true;
		}
		}
		}
		,

		tierload: function () {
		dwpokemons = {};

		if(Config.DWAbilityCheck) {
        var dwlist = ["Rattata", "Raticate", "Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Oddish", "Gloom", "Vileplume", "Bellossom", "Bellsprout", "Weepinbell", "Victreebel", "Ponyta", "Rapidash", "Farfetch'd", "Doduo", "Dodrio", "Exeggcute", "Exeggutor", "Lickitung", "Lickilicky", "Tangela", "Tangrowth", "Kangaskhan", "Sentret", "Furret", "Cleffa", "Clefairy", "Clefable", "Igglybuff", "Jigglypuff", "Wigglytuff", "Mareep", "Flaaffy", "Ampharos", "Hoppip", "Skiploom", "Jumpluff", "Sunkern", "Sunflora", "Stantler", "Poochyena", "Mightyena", "Lotad", "Ludicolo", "Lombre", "Taillow", "Swellow", "Surskit", "Masquerain", "Bidoof", "Bibarel", "Shinx", "Luxio", "Luxray", "Psyduck", "Golduck", "Growlithe", "Arcanine", "Scyther", "Scizor", "Tauros", "Azurill", "Marill", "Azumarill", "Bonsly", "Sudowoodo", "Girafarig", "Miltank", "Zigzagoon", "Linoone", "Electrike", "Manectric", "Castform", "Pachirisu", "Buneary", "Lopunny", "Glameow", "Purugly", "Natu", "Xatu", "Skitty", "Delcatty", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Bulbasaur", "Charmander", "Squirtle", "Ivysaur", "Venusaur", "Charmeleon", "Charizard", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Infernape", "Monferno", "Piplup", "Prinplup", "Empoleon", "Treecko", "Sceptile", "Grovyle", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Caterpie", "Metapod", "Butterfree", "Pidgey", "Pidgeotto", "Pidgeot", "Spearow", "Fearow", "Zubat", "Golbat", "Crobat", "Aerodactyl", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Yanma", "Yanmega", "Murkrow", "Honchkrow", "Delibird", "Wingull", "Pelipper", "Swablu", "Altaria", "Starly", "Staravia", "Staraptor", "Gligar", "Gliscor", "Drifloon", "Drifblim", "Skarmory", "Tropius", "Chatot", "Slowpoke", "Slowbro", "Slowking", "Krabby", "Kingler", "Horsea", "Seadra", "Kingdra", "Goldeen", "Seaking", "Magikarp", "Gyarados", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Wooper", "Quagsire", "Qwilfish", "Corsola", "Remoraid", "Octillery", "Mantine", "Mantyke", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Barboach", "Whiscash", "Clamperl", "Gorebyss", "Huntail", "Relicanth", "Luvdisc", "Buizel", "Floatzel", "Finneon", "Lumineon", "Tentacool", "Tentacruel", "Corphish", "Crawdaunt", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Shellos", "Gastrodon", "Lapras", "Dratini", "Dragonair", "Dragonite", "Elekid", "Electabuzz", "Electivire", "Poliwag", "Poliwrath", "Politoed", "Poliwhirl", "Vulpix", "Ninetales", "Musharna", "Munna", "Darmanitan", "Darumaka", "Mamoswine", "Togekiss", "Burmy", "Wormadam", "Mothim", "Pichu", "Pikachu", "Raichu","Abra","Kadabra","Alakazam","Spiritomb","Mr. Mime","Mime Jr.","Meditite","Medicham","Meowth","Persian","Shuppet","Banette","Spinarak","Ariados","Drowzee","Hypno","Wobbuffet","Wynaut","Snubbull","Granbull","Houndour","Houndoom","Smoochum","Jynx","Ralts","Gardevoir","Gallade","Sableye","Mawile","Volbeat","Illumise","Spoink","Grumpig","Stunky","Skuntank","Bronzong","Bronzor","Mankey","Primeape","Machop","Machoke","Machamp","Magnemite","Magneton","Magnezone","Koffing","Weezing","Rhyhorn","Rhydon","Rhyperior","Teddiursa","Ursaring","Slugma","Magcargo","Phanpy","Donphan","Magby","Magmar","Magmortar","Larvitar","Pupitar","Tyranitar","Makuhita","Hariyama","Numel","Camerupt","Torkoal","Spinda","Trapinch","Vibrava","Flygon","Cacnea","Cacturne","Absol","Beldum","Metang","Metagross","Hippopotas","Hippowdon","Skorupi","Drapion","Tyrogue","Hitmonlee","Hitmonchan","Hitmontop","Bagon","Shelgon","Salamence","Seel","Dewgong","Shellder","Cloyster","Chinchou","Lanturn","Smeargle","Porygon","Porygon2","Porygon-Z"];
		for(var dwpok in dwlist){
		dwpokemons[sys.pokeNum(dwlist[dwpok])]=true;
		}
		}

		var lclist = ["Bulbasaur", "Charmander", "Squirtle", "Croagunk", "Turtwig", "Chimchar", "Piplup", "Treecko","Torchic","Mudkip"]
		lcpokemons=[];

		for(var dwpok in lclist){
		lcpokemons.push(sys.pokeNum(lclist[dwpok]));
		}



		bannedGSCSleep = [sys.moveNum("Spore"), sys.moveNum("Hypnosis"), sys.moveNum("Lovely Kiss"), sys.moveNum("Sing"), sys.moveNum("Sleep Powder")].sort();
		bannedGSCTrap = [sys.moveNum("Mean Look"), sys.moveNum("Spider Web")].sort();

		var inconsistentList=["Remoraid","Bidoof","Snorunt","Smeargle","Bibarel","Octillery","Glalie"];
		inpokemons=[];

		for(var inpok in inconsistentList){
		inpokemons.push(sys.pokeNum(inconsistentList[inpok]));
		}

		pokeNatures=[];
		var list="Heatran-Eruption/Quiet=Suicune-ExtremeSpeed/Relaxed|Sheer Cold/Relaxed|Aqua Ring/Relaxed|Air Slash/Relaxed=Raikou-ExtremeSpeed/Rash|Weather Ball/Rash|Zap Cannon/Rash|Aura Sphere/Rash=Entei-ExtremeSpeed/Adamant|Flare Blitz/Adamant|Howl/Adamant|Crush Claw/Adamant";

		var sepPokes=list.split('=');

		for(var x in sepPokes){

		var sepMovesPoke=sepPokes[x].split('-');
		var sepMoves=sepMovesPoke[1].split('|');

		var poke=sys.pokeNum(sepMovesPoke[0]);
		pokeNatures[poke]=[];

		for(var y=0;y<sepMoves.length;++y){
		var movenat=sepMoves[y].split('/');
		pokeNatures[poke][sys.moveNum(movenat[0])]=sys.natureNum(movenat[1]);
		}

		}
		breedingpokemons=[];

		if(Config.DWAbilityCheck) {
		var breedingList = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Mamoswine", "Togekiss","Hitmonlee","Hitmonchan","Hitmontop","Tyrogue"];
		for(var inpok in breedingList){
		breedingpokemons.push(sys.pokeNum(breedingList[inpok]));
		}
		}

		}
		,
		managerload:function() {
		var defaultStyle = {
		"name":"default",
		"author":"Lutra",
		"styling":{
		"header":"<font color=cornflowerblue><b>»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»</font>",
		"footer":"<br/><timestamp/><br/><font color=cornflowerblue><b>»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»</font>",
		"icon":"•",
		"formatting":["<b>","</b>"],
		"color":"green",
		"message":"<b><font color='orangered'>The following commands need to be entered into a channel's main chat:</font></b>",
		"span":"<br><font size=5><B>{{Name}}</b></font>"
		}
		};

		var greenStyle = {
		"name":"Green Daylight",
		"author":"TheUnknownOne",
		"styling":{
		"header":"<font color=green>»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»</font><br/>",
		"footer":"<br><font color=green>»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»</font>",
		"icon":"<font color=orange>•</font>",
		"formatting":["<b>","</b>"],
		"color":"green",
		"message":"<",
		"span":"<font size=5><b>{{Name}}</b></font>"
		}
		};

		var tildes = {
		"name":"dem tildes",
		"author":"person6445",
		"styling":{
		"header":"<font color=midnightblue><b>˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??</font><br/>",
		"footer":"<br/><font color=midnightblue><b>˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??˜~˜??</font>",
		"icon":"<font color=magenta>?</font>",
		"formatting":["<b><font color=magenta>","</font></b>"],
		"message":"<br><b><font color=limegreen>Enter these commands into the client's main channel:</font></b><br/>",
		"span":"<br><font color=magenta size=5><B>{{Name}}</b></font>"
		}
		}

		function Style() {}

		function StyleManager() {
		this.styleInfo = [];
		this.styles = {};
		}

		StyleManager.prototype.save=function(name,url,resp){
		var fname="Styles_Style-"+name.replace(/\//g,"").toLowerCase()+".txt";
		sys.writeToFile(fname,resp);
		var done=false;
		for(var i=0;i<this.styleInfo.length;++i){
		if(cmp(name,this.styleInfo[i][0])){
		done=true;
		this.styleInfo[i]=[name,url,fname,true];
		break;
		}
		}
		if(!done){
		this.styleInfo.push([name,url,fname,true]);
		}
		sys.writeToFile("Styles_Metadata.txt",JSON.stringify({'meta':this.styleInfo}));
		}

		StyleManager.prototype.saveToFile=function(plain){
		var fname="Styles_Style-"+plain.name.replace(/\//g,"").toLowerCase()+".txt";

		if(this.styles.hasOwnProperty(plain.name.toLowerCase())){
		return;
		}

		sys.writeToFile(fname,JSON.stringify(plain));
		this.styleInfo.push([plain.name,"",fname,true]);
		sys.writeToFile("Styles_Metadata.txt",JSON.stringify({'meta':this.styleInfo}));
		}

		StyleManager.prototype.loadStyle=function(plain_style){
		var style=new Style();
		try {
		style.name = plain_style.name;
		if(typeof(this.styles[plain_style.name]) == "undefined") {
		style.main = false; }
		style.author = plain_style.author;
		style.footer = plain_style.styling.footer;
		style.header = plain_style.styling.header;
		style.icon = plain_style.styling.icon;
		style.color = plain_style.styling.color;
		style.formatting = plain_style.styling.formatting;
		style.message = plain_style.styling.message;
		style.span = plain_style.styling.span;
		return style;
		}

		catch(err){
		botEscapeAll(FormatError("Couldn't use style: "+plain_style.name+".", e),0);
		}
		}

		StyleManager.prototype.mainOn=function(src,name,s){
		if(this.styles[name] == undefined)
		return;
		if(!s) {
		if(this.styles[name].main === true) {
		botMessage(src,"That rank icon pack is already the main!");
		return;
		}
		}
		this.styles[name].main = true;
		cache.write("DefaultStyle",name);
		if(!s)
		botEscapeAll("Style "+name+" was made main style.",0);
		style = this.styles[name];
		}

		StyleManager.prototype.mainOff=function(src,name,s){
		if(!s) {
		if(this.styles[name].main === false) {
		botMessage(src,"That Style isn't the main.");
		return;
		}
		}
		this.styles[name].main=false;
		cache.remove("DefaultStyle");
		if(!s)
		botEscapeAll("Style "+name+" was removed as main.",0);
		style = this.styles["default"];
		}

		StyleManager.prototype.importOld=function(){ (function(){
		this.saveToFile(defaultStyle);
		this.saveToFile(greenStyle);
		this.saveToFile(tildes);
		this.loadStyle(defaultStyle);
		this.loadStyle(greenStyle);
		this.loadStyle(tildes);
		this.loadStyles();

		try {
		if(cache.get("DefaultStyle") != "") {
		this.styles[cache.get("DefaultStyle")].main = true; } }
		catch(e) {}
		style = this.mainStyle();

		}).apply(this,[]);
		}

		StyleManager.prototype.loadStyles=function(){
		var content=sys.getFileContent("Styles_Metadata.txt");
		if(!content)
		return;
		var parsed=JSON.parse(content);
		if(parsed.hasOwnProperty("meta")){
		this.styleInfo=parsed.meta;
		}
		for(var i=0;i<this.styleInfo.length;++i){
		if(!this.styleInfo[i][3])
		continue;
		try{
		var style=this.loadStyle(JSON.parse(sys.getFileContent(this.styleInfo[i][2])));
		this.styles[style.name]=style;
		}
		catch(err){
		botEscapeAll(FormatError("Error loading cached style \""+this.styleInfo[i][0]+"\".", e),0);
		}
		}
		}

		StyleManager.prototype.loadWebStyle=function(url,ann){
		if(typeof sys!='object')
		return;
		var manager=this;
		sys.webCall(url,function(resp){
		try{
		var plain_theme=JSON.parse(resp);
		var theme=manager.loadStyle(plain_theme);
		var lower=theme.name.toLowerCase();

		if(manager.styles.hasOwnProperty(lower)){
		return;
		}

		manager.styles[lower]=theme;
		manager.save(theme.name,url,resp);

		if(ann!="no")
		botAll("Loaded style from <a href='"+url+"'>"+url+"</a>",0);
		}

		catch(err){
		if(ann != "no") {
		botAll("Couldn't download style from "+url,0);
		botAll(FormatError("",e),0);
		}
		return;
		}
		});
		}

		StyleManager.prototype.mainStyle = function() {
		for(var x in this.styles) {
		if(this.styles[x].main == true) {
		return this.styles[x];
		}
		}
		return this.styles["default"];
		}

		StyleManager.prototype.showStyles=function(src,chan){
		var l=[];
		for(var t in this.styles){
		l.push(this.styles[t].name);
		}
		var text="Installed styles are: "+l.join(", ");
		botMessage(src,text,chan);
		};
		StyleManager.prototype.showStyleInfo=function(src,chan){
		this.styleInfo.sort(function(a,b){
		return a[0].localeCompare(b[0]);
		});
		var mess=[];
		mess.push("<table><tr><th>Style</th><th>URL</th><th>Author</th><th>Main</th></tr>");
		for(var i=0;i<this.styleInfo.length;++i){
		var info=this.styleInfo[i];
		var style=this.styles[info[0].toLowerCase()];
		if(!style)
		continue;
		mess.push('<tr><td>'+style.name+'</td><td><a href="'+info[1]+'">'+info[1]+'</a></td><td>'+(style.author?style.author:"unknown")+'</td><td>'+(style.main?"yes":"no")+'</td></tr>');
		}
		mess.push("</table>");
		sys.sendHtmlMessage(src,mess.join(""),chan);
		}

		var defaultIcons = {
		"name":"default",
		"author":"Astruvis",
		"ranks":{
		"User":"@",
		"Mod":"+",
		"Admin":"~",
		"Owner":"\u2248"
		}
		};

		var iconBurst = {
		"name":"Iconburst",
		"author":"TheUnknownOne",
		"ranks": {
		"User":"%",
		"Mod":"±",
		"Admin":"\u2261",
		"Owner":"#"
		}
		}

		var PO = {
		"name":"Pokemon Online",
		"author":"TheUnknownOne",
		"ranks": {
		"User":"",
		"Mod":"</b>+<i><b>",
		"Admin":"</b>+<i><b>",
		"Owner":"</b>+<i><b>"
		}
		}

		var POA = {
		"name":"PO Advanced",
		"author":"TheUnknownOne",
		"ranks": {
		"User":"",
		"Mod":"</b>»<i><b>",
		"Admin":"</b>»<i><b>",
		"Owner":"</b>»<i><b>"
		}
		}

		var skyDrop = {
		"name":"Skydrop",
		"author":"TheUnknownOne",
		"ranks": {
		"User":"",
		"Mod":"$",
		"Admin":"%",
		"Owner":"+"
		}
		}

		/* Credit to Rigas for the Idea: */
		var pokeballs = {
		"name":"Pokeballs",
		"author":"TheUnknownOne",
		"ranks": {
		"User":"<img src='Themes/Classic/Client/uAvailable.png' width='15'>",
		"Mod":"<img src='Themes/Classic/Client/mAvailable.png' width='15'>",
		"Admin":"<img src='Themes/Classic/Client/aAvailable.png' width='15'>",
		"Owner":"<img src='Themes/Classic/Client/oAvailable.png' width='15'>"
		}
		}

		var four = {
		"name":"four-thousand",
		"author":"person6445",
		"ranks":{
		"User":"?",
		"Mod":"?",
		"Admin":"?",
		"Owner":"?"
		}
		}

		var iconArr = [defaultIcons,iconBurst,PO,POA,skyDrop,pokeballs,four];
		function RankIconList() {}
		function IconManager() {
		this.iconInfo = [];
		this.icons = {};
		}
		IconManager.prototype.save=function(name,url,resp){
		var fname="RankIcons_List-"+name.replace(/\//g,"").toLowerCase()+".txt";
		sys.writeToFile(fname,resp);
		var done=false;
		for(var i=0;i<this.iconInfo.length;++i){
		if(cmp(name,this.iconInfo[i][0])){
		done=true;
		this.iconInfo[i]=[name,url,fname,true];
		break;
		}
		}
		if(!done){
		this.iconInfo.push([name,url,fname,true]);
		}
		sys.writeToFile("RankIcons_Metadata.txt",JSON.stringify({'meta':this.iconInfo}));
		}
		IconManager.prototype.saveToFile=function(plain){
		if(typeof sys!="object")
		return;
		var fname="RankIcons_List-"+plain.name.replace(/\//g,"").toLowerCase()+".txt";

		if(this.icons.hasOwnProperty(plain.name.toLowerCase())){
		return;
		}

		sys.writeToFile(fname,JSON.stringify(plain));

		this.iconInfo.push([plain.name,"",fname,true]);

		sys.writeToFile("RankIcons_Metadata.txt",JSON.stringify({'meta':this.iconInfo}));
		}

		IconManager.prototype.mainIcons = function() {
		for(var x in this.icons) {
		if(this.icons[x].main == true) {
		return this.icons[x];
		}
		}
		return this.icons["default"];
		}

		IconManager.prototype.importOld=function(){ (function(){
		var a_l = iconArr.length;

		for(var y = 0; y < a_l; y++)
		{
		var ar = iconArr[y];
		this.saveToFile(ar);
		this.loadRankIconList(ar);
		}

		this.loadRankIcons();

		try {
		if(cache.get("DefaultIcons") != "") {
		this.icons[cache.get("DefaultIcons")].main = true; }}
		catch(e) {}
		}).apply(this,[]);
		}

		IconManager.prototype.mainOn=function(src,name,s){
		if(this.icons[name] == undefined)
		return;
		if(!s) {
		if(this.icons[name].main === true) {
		botMessage(src,"That Rank Icon List is already the main.");
		return;
		}
		}
		this.icons[name].main = true;
		cache.write("DefaultIcons",name);
		if(!s)
		botEscapeAll("Rank Icon List "+name+" is now the main.",0);
		}

		IconManager.prototype.mainOff=function(src,name,s){
		if(!s) {
		if(this.icons[name].main === false) {
		botMessage(src,"Those Rank Icons aren't the main.");
		return;
		}
		}
		this.icons[name].main=false;
		cache.remove("DefaultIcons");
		if(!s)
		botEscapeAll("Rank Icon List "+name+" was removed as main.",0);
		}

		IconManager.prototype.loadRankIconList=function(plain_icons){
		var icon=new RankIconList();
		try {

		if(typeof(this.icons[plain_icons.name]) == "undefined") {
		icon.main = false;  }
		icon.name = plain_icons.name;
		icon.author = plain_icons.author;
		icon.user = plain_icons.ranks.User
		icon.mod = plain_icons.ranks.Mod
		icon.admin = plain_icons.ranks.Admin
		icon.owner = plain_icons.ranks.Owner
		return icon;
		}
		catch(err){
		botEscapeAll(FormatError("Couldn't use rank icon list: "+plain_icons.name+".", e),0);
		}
		}

		IconManager.prototype.loadRankIcons=function(){
		var content=sys.getFileContent("RankIcons_Metadata.txt");
		if(!content)
		return;
		var parsed=JSON.parse(content);
		if(parsed.hasOwnProperty("meta")){
		this.iconInfo=parsed.meta;
		}
		for(var i=0;i<this.iconInfo.length;++i){
		if(!this.iconInfo[i][3])
		continue;
		try{
		var icon=this.loadRankIconList(JSON.parse(sys.getFileContent(this.iconInfo[i][2])));
		this.icons[icon.name]=icon;
		}
		catch(err){
		botEscapeAll(FormatError("Error loading cached rankiconlist \""+this.iconInfo[i][0]+"\".", e),0);
		}
		}
		}

		IconManager.prototype.showIcons=function(src,chan){
		var l = [];
		for(var t in this.icons){
		l.push(this.icons[t].name);
		}
		var text="Installed rank icon lists are: "+l.join(", ");
		botMessage(src,text,chan);
		};
		IconManager.prototype.showIconInfo=function(src,chan){
		this.iconInfo.sort(function(a,b){
		return a[0].localeCompare(b[0]);
		});
		var mess = [];
		mess.push("<table><tr><th>Name</th><th>URL</th><th>Author</th><th>Main</th></tr>");
		for(var i=0;i<this.iconInfo.length;++i){
		var info=this.iconInfo[i];
		var theme=this.icons[info[0].toLowerCase()];
		if(!theme)
		continue;
		mess.push('<tr><td>'+theme.name+'</td><td><a href="'+info[1]+'">'+info[1]+'</a></td><td>'+(theme.author?theme.author:"unknown")+'</td><td>'+(theme.main?"yes":"no")+'</td></tr>');
		}
		mess.push("</table>");
		sys.sendHtmlMessage(src,mess.join(""),chan);
		}

		IconManager.prototype.loadWebIcons=function(url,a,update){
		if(typeof sys!='object')
		return;
		var manager=this;
		sys.webCall(url,function(resp){
		try{
		var plain_theme=JSON.parse(resp);
		var theme=manager.loadRankIconList(plain_theme);
		var lower=theme.name.toLowerCase();
		if(manager.icons.hasOwnProperty(lower)&&update){
		return;
		}
		manager.icons[lower]=theme;
		manager.save(theme.name,url,resp);
		if(a!=="no")
		botAll("Loaded RIs from <a href='"+url+"'>"+url+"</a>",0);
		}
		catch(err){
		if(a!="no") {
		botAll("Couldn't download RIs from "+url,0);
		botAll(FormatError("", e),0);
		}
		return;
		}
		});
		}

		styleManager = new StyleManager();
		iconManager = new IconManager();
		styleManager.importOld();
		iconManager.importOld();
		Icons = iconManager.mainIcons();

		}
		,

		importable: function(src, tar, chan) {

		var naturei = {
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
		}

		var colori = {
		0:"#a8a878",
		1:"#c03028",
		2:"#a890f0",
		3:"#a040a0",
		4:"#e0c068",
		5:"#b8a038",
		6:"#a8b820",
		7:"#705898",
		8:"#b8b8d0",
		9:"#f08030",
		10:"#6890f0",
		11:"#78c850",
		12:"#f8d030",
		13:"#f85888",
		14:"#98d8d8",
		15:"#7038f8",
		16:"#705848"}

		var genderi = {2: "female", 1: "male", 0: "neutral"}
		var evtablei = {0:"HP",1:"Atk",2:"Def",3:"SAtk",4:"SDef",5:"Spd"}

		var gen = sys.gen(tar);
		var t = new Template();

		t.register(style.header);
		t.register("<font color="+script.namecolor(tar)+"><b>"+sys.name(tar)+"</b></font>'s Gen "+gen+" Team<br/>");

		for (var i = 0; i < 6; i+=1) {
		var color = colori[sys.pokeType1(sys.teamPoke(tar,i),gen)]
		if (sys.teamPoke(tar,i) == 0){
		continue;
		}

		var gender = genderi[sys.teamPokeGender(tar,i)]

		t.register("<img src='pokemon:num="+sys.teamPoke(tar, i)+"&gen="+gen+"&back=false&gender="+gender+"'>"
		+ "<img src='pokemon:num="+sys.teamPoke(tar, i)+"&gen="+gen+"&back=true&gender="+gender+"'>");

		var nick = sys.teamPokeNick(tar,i)+" ("+sys.pokemon(sys.teamPoke(tar, i))+")"
		if(sys.teamPokeNick(tar,i) == sys.pokemon(sys.teamPoke(tar,i))) {
		nick = sys.pokemon(sys.teamPoke(tar,i));
		}
		var item = "<img src='item:"+sys.teamPokeItem(tar,i)+"'>";
		if(sys.item(sys.teamPokeItem(tar,i)) == "(No Item)") {
		item = "";
		}

		t.register("<font color="+color+"><b> "+nick+"</b></font> "
		+ sys.gender(sys.teamPokeGender(tar,i)).replace(/female/g,"<img src='Themes/Classic/genders/gender2.png'> (F)").replace(/male/g,"<img src='Themes/Classic/genders/gender1.png'> (M)").replace(/genderless/g,"<img src='Themes/Classic/genders/gender0.png'>")
		+ " @ "+item+" "+ sys.item(sys.teamPokeItem(tar, i)));

		if(gen > 2) {
		t.register("<font color="+color+"><b>Trait:</b></font> "
		+ sys.ability(sys.teamPokeAbility(tar,i)));
		}

		var level = sys.teamPokeLevel(tar, i);

		if (level != 100)
		t.register('<b><font color="+color+">Level:</b></font> ' + level);

		var evstr = [];

		for(var w = 0; w < 6; w++) {
		var evtable = evtablei[w];
		if(sys.teamPokeEV(tar,i,w) != 0||gen == 2 && sys.teamPokeDV(tar,i,q) != 255) {
		evstr.push(sys.teamPokeEV(tar,i,w)+" "+evtable); }
		}

		if(evstr.length != 0)
		t.register("<font color="+color+"><b>EVs:</b></font> "+evstr.join(" / "));
		var dvstr = [];
		for(var q = 0; q < 6; q++) {
		var dvtable = evtablei[q];
		if(sys.teamPokeDV(tar,i,q) != 31||gen == 2&&sys.teamPokeDW(tar,i,q) != 15) {
		dvstr.push(sys.teamPokeDV(tar,i,q)+" "+dvtable); }
		}

		if(dvstr.length != 0)
		t.register("<font color="+color+"><b>IVs:</b></font> "+dvstr.join(" / "));

		if(gen > 2) {
		var nature = naturei[sys.teamPokeNature(tar, i)];
		t.register("<b><font color="+color+">"+nature+"</font></b>");
		}

		for (var j = 0; j < 4; j++) {

		var moveNum = sys.teamPokeMove(tar, i, j);
		var moveStr = "<b><font color="+color+">"+sys.move(moveNum)+"</font></b>";
		var moveName = sys.move(moveNum);

		if (moveNum == 0){
		continue;
		}

		if (moveNum == sys.moveNum("Hidden Power")) {
		var hpdvs = [];

		for(var n = 0; n < 6; n++ ) {
		hpdvs.push(sys.teamPokeDV(src,i,n));
		}

		var b = hpdvs;
		var hp = sys.hiddenPowerType(gen,b[0],b[1],b[2],b[3],b[4],b[5],b[6]);
		var t = sys.type(hp);
		
		var hptype = "<font color="+colori[hp]+"><b>"+t+"</b></font>";
		moveStr = "<font color="+color+"><b>Hidden Power</b></font> [" + hptype + "]";
		moveNum = hp;
		}

		/* var type = "<img src='Themes/Classic/types/type"+sys.moveType(moveNum)+"'>"; */
		t.register('- '+moveStr);
		}
		}

		t.register(style.footer);
		t.render(src,chan,"<br/>");
		}
		,
		
		mafiaload: function () {
		function Mafia(mafiachan) {
		// Remember to update this if you are updating mafia
		// Otherwise mafia game won't get reloaded
		this.version = "2012-01-21.1";
		var mafia = this;

		var noPlayer = '*';
		var CurrentGame;
		var PreviousGames;
		var MAFIA_SAVE_FILE = Config.Mafia.stats_file;

		var DEFAULT_BORDER = "***************************************************************************************";
		var border;

		var savePlayedGames = function() {
		sys.writeToFile(MAFIA_SAVE_FILE, JSON.stringify(PreviousGames));
		};
		var loadPlayedGames = function() {
		try {
		PreviousGames = JSON.parse(sys.getFileContent(MAFIA_SAVE_FILE));
		} catch(e) {
		PreviousGames = [];
		}
		};
		loadPlayedGames();


		var defaultTheme = {
		name: "default",
		sides: [
		{ "side": "mafia", "translation": "Mafia"
		},
		{ "side": "mafia1", "translation": "French Canadian Mafia"
		},
		{ "side": "mafia2", "translation": "Italian Mafia"
		},
		{ "side": "village", "translation": "Good people"
		},
		{ "side": "werewolf", "translation": "WereWolf"
		},
		{ "side": "godfather", "translation": "Godfather"
		}
		],
		roles: [{
		"role": "villager",
		"translation": "Villager",
		"side": "village",
		"help": "You dont have any special commands during the night! Vote to remove people in the day!",
		"actions": {}
		}, {
		"role": "inspector",
		"translation": "Inspector",
		"side": "village",
		"help": "Type /Inspect [name] to find his/her identity!",
		"actions": { "night": {"inspect": {"target": "AnyButSelf", "common": "Self", "priority": 30} } }
		}, {
		"role": "bodyguard",
		"translation": "Bodyguard",
		"side": "village",
		"help": "Type /Protect [name] to protect someone!",
		"actions": { "night": {"protect": {"target": "AnyButSelf", "common": "Role", "priority": 5, "broadcast": "role"} },
		"startup": "role-reveal"}
		}, {
		"role": "mafia",
		"translation": "Mafia",
		"side": "mafia",
		"help": "Type /Kill [name] to kill someone!",
		"actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 11, "broadcast": "team"} },
		"startup": "team-reveal"}
		}, {
		"role": "werewolf",
		"translation": "WereWolf",
		"side": "werewolf",
		"help": "Type /Kill [name] to kill someone!",
		"actions": { "night": {"kill": {"target": "AnyButSelf", "common": "Self", "priority": 10} },
		"distract": {"mode": "ChangeTarget", "hookermsg": "You tried to distract the Werewolf (what an idea, srsly), you were ravishly devoured, yum!", "msg": "The ~Distracter~ came to you last night! You devoured her instead!"},
		"avoidHax": ["kill"] }
		}, {
		"role": "hooker",
		"translation": "Pretty Lady",
		"side": "village",
		"help": "Type /Distract [name] to distract someone! Vote to remove people in the day!",
		"actions": { "night": {"distract": {"target": "AnyButSelf", "common": "Self", "priority": 1} } }
		}, {
		"role": "mayor",
		"translation": "Mayor",
		"side": "village",
		"help": "You dont have any special commands during the night! Vote to remove people in the day! (your vote counts as 2)",
		"actions": { "vote": 2 }
		}, {
		"role": "spy",
		"translation": "Spy",
		"side": "village",
		"help": "You can find out who is going to get killed next!(no command for this ability) Vote to remove people in the day!",
		"actions": { "hax": {"kill": { "revealTeam": 0.33, "revealPlayer": 0.1} } }
		}, {
		"role": "godfather",
		"translation": "Godfather",
		"side": "godfather",
		"help": "Type /Kill [name] to kill someone! You can kill 2 targets, Type /kill [name2] again to select your second target!",
		"actions": { "night": {"kill": {"target": "AnyButSelf", "common": "Self", "priority": 20, "limit": 2} },
		"distract": {"mode": "ChangeTarget", "hookermsg": "You tried to seduce the Godfather... you were killed instead!", "msg": "The ~Distracter~ came to you last night! You killed her instead!"},
		"avoidHax": ["kill"] }
		}, {
		"role": "vigilante",
		"translation": "Vigilante",
		"side": "village",
		"help": "Type /Kill [name] to kill someone!(dont kill the good people!)",
		"actions": { "night": {"kill": {"target": "AnyButSelf", "common": "Self", "priority": 19} } }
		}, {
		"role": "mafia1",
		"translation": "French Canadian Mafia",
		"side": "mafia1",
		"help": "Type /Kill [name] to kill someone!",
		"actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 12, "broadcast": "team"} },
		"startup": "team-reveal"}
		}, {
		"role": "mafia2",
		"translation": "Italian Mafia",
		"side": "mafia2",
		"help": "Type /Kill [name] to kill someone!",
		"actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 11, "broadcast": "team"} },
		"startup": "team-reveal"}
		}, {
		"role": "conspirator1",
		"translation": "French Canadian Conspirator",
		"side": "mafia1",
		"help": "You dont have any special commands during the night! You are sided French Canadian Mafia. Vote to remove people in the day!",
		"actions": { "inspect": {"revealAs": "villager"},
		"startup": "team-reveal"}
		}, {
		"role": "conspirator2",
		"translation": "Italian Conspirator",
		"side": "mafia2",
		"help": "You dont have any special commands during the night! You are sided Italian Mafia. Vote to remove people in the day!",
		"actions": { "inspect": {"revealAs": "villager"},
		"startup": "team-reveal"}
		}, {
		"role": "mafiaboss1",
		"translation": "Don French Canadian Mafia",
		"side": "mafia1",
		"help": "Type /Kill [name] to kill someone! You can't be distracted!",
		"actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 12, "broadcast": "team"} },
		"distract": {"mode": "ignore"},
		"startup": "team-reveal"}
		}, {
		"role": "mafiaboss2",
		"translation": "Don Italian Mafia",
		"side": "mafia2",
		"help": "Type /Kill [name] to kill someone! You can't be distracted!",
		"actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 11, "broadcast": "team"} },
		"distract": {"mode": "ignore"},
		"startup": "team-reveal"}
		}, {
		"role": "samurai",
		"translation": "Samurai",
		"side": "village",
		"help": "Type /Kill [name] during the day phase to kill someone! You will be revealed when you kill, so make wise choices! You are allied with the Good people.",
		"actions": { "standby": {"kill": {"target": "AnyButSelf", "msg": "You can kill now using /kill [name] :",
		"killmsg": "~Self~ pulls out a sword and strikes it through ~Target~'s chest!"} } }
		}, {
		"role": "miller",
		"translation": "Miller",
		"side": "village",
		"help": "You dont have any special commands during the night! Vote to remove people in the day! Oh, and insp sees you as Mafia",
		"actions": { "inspect": {"revealAs": "mafia"} }
		}, {
		"role": "truemiller",
		"translation": "Miller",
		"side": "village",
		"help": "You dont have any special commands during the night! Vote to remove people in the day!",
		"actions": { "inspect": {"revealAs": "mafia"}, "lynch": {"revealAs": "mafia"}, "startup": {"revealAs": "villager"}, "onlist": "mafia" }
		}, {
		"role": "miller1",
		"translation": "Miller",
		"side": "village",
		"help": "You dont have any special commands during the night! Vote to remove people in the day!",
		"actions": { "inspect": {"revealAs": "mafia1"}, "lynch": {"revealAs": "mafia1"}, "startup": {"revealAs": "villager"}, "onlist": "mafia1" }
		}, {
		"role": "miller2",
		"translation": "Miller",
		"side": "village",
		"help": "You dont have any special commands during the night! Vote to remove people in the day!",
		"actions": { "inspect": {"revealAs": "mafia2"}, "lynch": {"revealAs": "mafia2"}, "startup": {"revealAs": "villager"}, "onlist": "mafia2" }
		}],
		roles1: ["bodyguard", "mafia", "inspector", "werewolf", "hooker", "villager", "truemiller",
		"villager", "mafia", "villager", "mayor"],
		roles2: ["bodyguard", "mafia1", "mafia1", "inspector", "hooker", "villager", "mafia2",
		"mafia2", "villager", "villager", "villager", "mayor", "villager", "spy", "villager",
		"miller1", "miller2", "mafiaboss1", "villager", "vigilante", "villager", "godfather",
		"mafiaboss2", "samurai", "villager", "villager", "werewolf", "mafia1",
		"mafia2", "bodyguard"],
		villageCantLoseRoles: ["mayor", "vigilante", "samurai"]
		};

		/* ThemeManager is a object taking care of saving and loading themes
		* in mafia game */
		function ThemeManager() {
		this.themeInfo = [];
		this.themes = {};
		}
		ThemeManager.prototype.toString = function() { return "[object ThemeManager]"; };

		ThemeManager.prototype.save = function(name, url, resp) {
		var fname = "MAFIA_theme_" + name.replace("/", "").toLowerCase();
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
		sys.writeToFile("MAFIA_metadata.json", JSON.stringify({'meta': this.themeInfo}));
		};

		ThemeManager.prototype.loadTheme = function(plain_theme) {
		var theme = new Theme();
		try {
		theme.sideTranslations = {};
		theme.sideWinMsg = {};
		theme.roles = {};
		theme.nightPriority = [];
		theme.standbyRoles = [];
		theme.haxRoles = {};

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
		while ("roles"+i in plain_theme) {
		theme["roles"+i] = plain_theme["roles"+i];
		++i;
		}
		theme.roleLists = i-1;
		theme.villageCantLoseRoles = plain_theme.villageCantLoseRoles;
		theme.name = plain_theme.name;
		theme.author = plain_theme.author;
		theme.summary = plain_theme.summary;
		theme.killmsg = plain_theme.killmsg;
		theme.killusermsg = plain_theme.killusermsg;
		theme.border = plain_theme.border;
		theme.generateRoleInfo();
		//theme.generateSideInfo();
		theme.enabled = true;
		return theme;
		} catch (err) {
		if (typeof sys == 'object')
		botAll("Couldn't use theme " + plain_theme.name + ": "+err+".", mafiachan);
		else
		print("Couldn't use theme: " + plain_theme.name + ": "+err+".");
		}
		};

		ThemeManager.prototype.loadThemes = function() {
		if (typeof sys !== "object") return;
		this.themes = {};
		this.themes["default"] = this.loadTheme(defaultTheme);
		var content = sys.getFileContent("MAFIA_metadata.json");
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
		} catch(err) {
		botAll("Error loading cached theme \"" + this.themeInfo[i][0] + "\": " + err, mafiachan);
		}
		}
		};
		ThemeManager.prototype.saveToFile = function(plain_theme) {
		if (typeof sys != "object") return;
		var fname = "MAFIA_theme_" + plain_theme.name.toLowerCase();
		sys.writeToFile(fname, JSON.stringify(plain_theme));
		this.themeInfo.push([plain_theme.name, "", fname, true]);
		sys.writeToFile("MAFIA_metadata.json", JSON.stringify({'meta': this.themeInfo}));
		};

		ThemeManager.prototype.loadWebTheme = function(url, announce, update) {
		if (typeof sys != 'object') return;
		var manager = this;
		sys.webCall(url, function(resp) {
		try {
		var plain_theme = JSON.parse(resp);
		var theme = manager.loadTheme(plain_theme);
		var lower = theme.name.toLowerCase();
		if (manager.themes.hasOwnProperty(lower) && !update) {
		botAll("Won't update " + theme.name + " with /add, use /update to force an update", mafiachan);
		return;
		}
		manager.themes[lower] = theme;
		manager.save(theme.name, url, resp, update);
		if (announce) {
		botAll("Loaded theme " + theme.name, mafiachan);
		}
		} catch (err) {
		botAll("Couldn't download theme from "+url, mafiachan);
		botAll("" + err, mafiachan);
		return;
		}
		});
		};

		ThemeManager.prototype.remove = function(src, name) {
		name = name.toLowerCase();
		if (name in this.themes) {
		delete this.themes[name];
		for (var i = 0; i < this.themeInfo.length; ++i) {
		if (cmp(name, this.themeInfo[i][0])) {
		this.themeInfo.splice(i,1);
		break;
		}
		}
		sys.writeToFile("MAFIA_metadata.json", JSON.stringify({'meta': this.themeInfo}));
		botAll("theme " + name + " removed.", mafiachan);
		}
		};

		ThemeManager.prototype.enable = function(src, name) {
		name = name.toLowerCase();
		if (name in this.themes) {
		this.themes[name].enabled = true;
		for (var i = 0; i < this.themeInfo.length; ++i) {
		if (cmp(name, this.themeInfo[i][0])) {
		this.themeInfo[i][3] = true;
		break;
		}
		}
		sys.writeToFile("MAFIA_metadata.json", JSON.stringify({'meta': this.themeInfo}));
		botAll("theme " + name + " enabled.", mafiachan);
		}
		};

		ThemeManager.prototype.disable = function(src, name) {
		name = name.toLowerCase();
		if (name in this.themes) {
		this.themes[name].enabled = false;
		for (var i = 0; i < this.themeInfo.length; ++i) {
		if (cmp(name, this.themeInfo[i][0])) {
		this.themeInfo[i][3] = false;
		break;
		}
		}
		sys.writeToFile("MAFIA_metadata.json", JSON.stringify({'meta': this.themeInfo}));
		botAll("theme " + name + " disabled.", mafiachan);
		}
		};

		/* Theme is a small helper to organize themes
		* inside the mafia game */
		function Theme() {}
		Theme.prototype.toString = function() { return "[object Theme]"; };

		Theme.prototype.addSide = function(obj) {
		this.sideTranslations[obj.side] = obj.translation;
		if ("winmsg" in obj){
		this.sideWinMsg[obj.side] = obj.winmsg;
		}
		};
		Theme.prototype.addRole = function(obj) {
		this.roles[obj.role] = obj;

		var i, action;
		if ("hax" in obj.actions) {
		for(i in obj.actions.hax) {
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
		this.nightPriority.push({'priority': priority, 'action': action, 'role': role});
		}
		this.nightPriority.sort(function(a,b) { return a.priority - b.priority; });
		}
		if ("standby" in obj.actions) {
		for (i in obj.actions.standby) {
		this.standbyRoles.push(obj.role);
		}
		}
		};
		Theme.prototype.generateRoleInfo = function() {
		var sep = "*** *********************************************************************** ***";
		var roles = [sep];
		var role;
		var role_order = Object.keys(this.roles);
		var this_roles = this.roles;
		role_order.sort(function(a,b) {
		var tra = this_roles[a].translation;
		var trb = this_roles[b].translation;
		if (tra == trb)
		return 0;
		else if (tra < trb)
		return -1;
		else
		return 1;
		});
		for (var r = 0; r < role_order.length; ++r) {
		try {
		role = this.roles[role_order[r]];
		roles.push("±Role: " + role.translation);

		// check which abilities the role has
		var abilities = "", a, ability;
		if (role.actions.night) {
		for (a in role.actions.night) {
		ability = role.actions.night[a];
		abilities += "Can " + a + " " + ("limit" in ability ? ability.limit + " persons" : "one person") +" during the night. ";
		if ("avoidHax" in role.actions && role.actions.avoidHax.indexOf(a) != -1) {
		abilities += "(Can't be detected by spies.) ";
		}
		}
		}
		if (role.actions.standby) {
		for (a in role.actions.standby) {
		ability = role.actions.standby[a];
		abilities += "Can " + a + " " + ("limit" in ability ? ability.limit + " persons" : "one person") +" during the standby. ";
		}
		}
		if ("vote" in role.actions) {
		abilities += "Vote counts as " + role.actions.vote + ". ";
		}
		if ("kill" in role.actions) {
		if (role.actions.kill.mode == "ignore") {
		abilities += "Can't be nightkilled. ";
		}
		else if (role.actions.kill.mode == "killattackerevenifprotected") {
		abilities += "Revenges nightkills (even when protected). ";
		}
		else if (role.actions.kill.mode == "killattacker") {
		abilities += "Revenges nightkills. ";
		}
		else if (typeof role.actions.kill.mode == "object" && role.actions.kill.mode.evadeChance > 0) {
		abilities += "Has a " + Math.floor(role.actions.kill.mode.evadeChance*100) + "% chance of evading nightkills. ";
		}
		}
		if ("daykill" in role.actions) {
		if (role.actions.daykill == "evade") {
		abilities += "Can't be daykilled. ";
		}
		else if (role.actions.daykill == "revenge") {
		abilities += "Revenges daykills. ";
		}
		}
		if ("poison" in role.actions) {
		if (role.actions.poison.mode == "ignore") {
		abilities += "Can't be poisoned. ";
		}
		else if (typeof role.actions.poison.mode == "object" && role.actions.poison.mode.evadeChance > 0) {
		abilities += "Has a " + Math.floor(role.actions.poison.mode.evadeChance*100) + "% chance of evading poison. ";
		}
		}
		if ("hax" in role.actions && Object.keys) {
		var haxy = Object.keys(role.actions.hax);
		abilities += "Gets hax on " + (haxy.length > 1 ? haxy.splice(0,haxy.length-1).join(", ")+" and ":"") + haxy + ". ";
		}
		if ("inspect" in role.actions) {
		abilities += "Reveals as " + this.roles[role.actions.inspect.revealAs].translation + " when inspected. ";
		}
		if ("distract" in role.actions) {
		if (role.actions.distract.mode == "ChangeTarget")
		abilities += "Kills any distractors. ";
		if (role.actions.distract.mode == "ignore")
		abilities += "Ignores any distractors. ";
		}
		if (typeof role.side == "string") {
		abilities += "Sided with " + this.trside(role.side) + ". ";
		} else if (typeof role.side == "object") {
		var plop = Object.keys(role.side.random);
		var tran = [];
		for(var p = 0; p < plop.length; ++p) {
		tran.push(this.trside(plop[p]));
		}
		abilities += "Sided with " + (tran.length > 1 ? tran.splice(0,tran.length-1).join(", ")+" or ":"") + tran + ". ";
		}
		roles.push("±Ability: " + abilities);

		// check on which player counts the role appears
		var parts = [];
		var end = 0;
		for(var i = 1; i <= this.roleLists; ++i) {
		var role_i = "roles"+i;
		var start = this[role_i].indexOf(role.role);
		var last = end;
		end = this[role_i].length;
		if (start >= 0) {
		++start;
		start = start > last ? start : 1+last;
		if(parts.length > 0 && parts[parts.length-1][1] == start-1) {
		parts[parts.length-1][1] = end;
		} else {
		parts.push([start,end]);
		if (parts.length > 1) {
		parts[parts.length-2] = parts[parts.length-2][0] < parts[parts.length-2][1] ? parts[parts.length-2].join("-") : parts[parts.length-2][1];
		}
		}
		}
		}
		if (parts.length > 0) {
		parts[parts.length-1] = parts[parts.length-1][0] < parts[parts.length-1][1] ? parts[parts.length-1].join("-") : parts[parts.length-1][1];
		}
		roles.push("±Game: " + parts.join(", ") + " Players");

		roles.push(sep);
		} catch (err) {
		botAll("Error adding role " + role.translation + "(" + role.role + ") to /roles", mafiachan);
		throw err;
		}
		}
		this.roleInfo = roles;
		};
		Theme.prototype.generateSideInfo = function() {
		var sep = "*** *********************************************************************** ***";
		var sides = [sep];  
		var side;
		var side_order = Object.keys(this.sides);
		var this_sides = this.sides;        
		// sort sides by name
		side_order.sort(function(a,b) {
		var tra = this_sides[a].translation;
		var trb = this_sides[b].translation;
		if (tra == trb)
		return 0;
		else if (tra < trb)
		return -1;
		else
		return 1;
		}); 
		// sort roles by name
		var role;
		var role_order = Object.keys(this.roles);
		var this_roles = this.roles;
		role_order.sort(function(a,b) {
		var tra = this_roles[a].translation;
		var trb = this_roles[b].translation;
		if (tra == trb)
		return 0;
		else if (tra < trb)
		return -1;
		else
		return 1;
		});
		// check each role for its side
		var side_list = {};
		var randomSide_list = [];
		for (var r = 0; r < role_order.length; ++r) {
		try {
		role = this.roles[role_order[r]];
		if (typeof roles.side == "string") {        
		if (side_list[role.side] === undefined) 
		side_list[role.side] = [];
		side_list[role.side].push(role.translation);
		} else if (typeof role.side == "object" && role.side.random) {
		var plop = Object.keys(role.side.random);
		var tran = [];
		for (var p = 0; p < plop.length; ++p) {
		tran.push(this.trside(plop[p]));
		}
		randomSide_list.push("±Role: " + role.translation + " can be sided with " + (tran.length > 1 ? tran.splice(0,tran.length-1).join(", ")+" or ":"") + tran + ". ");
		}
		} catch (err) {
		botAll("Error adding role " + role.translation + "(" + role.role + ") to /sides", mafiachan);
		throw err;
		}
		}
		// writes the list of roles for each side
		for (var s = 0; s < side_order.length; ++s) {
		try {
		side = this.sides[side_order[s]];           
		sides.push("±Side: The " + side.translation + " consists of " + side_list[side].join(", ") + ".");
		} catch (err) {
		botAll("Error adding side " + side.translation + "(" + side.side + ") to /sides", mafiachan);
		throw err;
		}
		}
		if (randomSide_list.length > 0) 
		sides.concat(randomSide_list);  
		sides.push(sep);
		this.sideInfo = sides;  
		};

		/* Theme Loading and Storing */
		Theme.prototype.trside = function(side) {
		return this.sideTranslations[side];
		};
		Theme.prototype.trrole = function(role) {
		return this.roles[role].translation;
		};
		Theme.prototype.getHaxRolesFor = function(command) {
		if (command in this.haxRoles) {
		return this.haxRoles[command];
		}
		return [];
		};
		// End of Theme

		this.isInGame = function(player) {
		if (this.state == "entry") {
		return this.signups.indexOf(player) != -1;
		}
		return player in this.players;
		};
		// init
		this.themeManager = new ThemeManager();

		this.hasCommand = function(name, command, state) {
		var player = this.players[name];
		return (state in player.role.actions && command in player.role.actions[state]);
		};
		this.correctCase = function(string) {
		var lstring = string.toLowerCase();
		for (var x in this.players) {
		if (x.toLowerCase() == lstring)
		return this.players[x].name;
		}
		// try to trim around if there's extra whitespace
		lstring = lstring.replace(/^\s+|\s+$/g, '');
		for (var y in this.players) {
		if (y.toLowerCase() == lstring)
		return this.players[y].name;
		}
		return noPlayer;
		};
		this.clearVariables = function() {
		/* hash : playername => playerstruct */
		this.players = {};
		this.signups = [];
		this.state = "blank";
		this.ticks = 0;
		this.votes = {};
		this.voteCount = 0;
		this.ips = [];
		this.resetTargets();
		};
		this.lastAdvertise = 0;
		this.resetTargets = function() {
		this.teamTargets = {};
		this.roleTargets = {};
		for (var p in this.players) {
		this.players[p].targets = {};
		this.players[p].dayKill = undefined;
		this.players[p].guarded = undefined;
		this.players[p].safeguarded = undefined;
		}
		};
		this.clearVariables();
		/* callback for /start */
		this.userVote = function(src, commandData) {
		var themeName = commandData.toLowerCase();
		if (this.state == "blank") {
		this.state = "voting";
		this.ticks = 20;
		this.votes = {};
		this.possibleThemes = {};
		var total = 5;
		if (themeName in this.themeManager.themes && this.themeManager.themes[themeName].enabled) {
		this.possibleThemes[themeName] = 0;
		--total;
		}
		if (PreviousGames.length === 0 || PreviousGames.slice(-1)[0].what != "default") {
		this.possibleThemes["default"] = 0;
		--total;
		}
		var allThemes = Object.keys(this.themeManager.themes);
		var Check = PreviousGames.slice(-Config.Mafia.norepeat).reverse();
		outer:
		while (allThemes.length > 0 && total > 0) {
		var indx = Math.floor(allThemes.length * Math.random());
		var name = allThemes[indx];
		allThemes.splice(indx, 1);
		// exclude themes played recently
		for (i = 0; i < Check.length; ++i) {
		if (Check[i].what == name && name != "default") {
		continue outer;
		}
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
		sys.sendAll("±Game: Choose from these themes: " + Object.keys(this.possibleThemes).join(", ") +" !", mafiachan);
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
		if (this.votes[ip] != themeName) 
		sys.sendAll("±Game: " + sys.name(src) + " changed their vote to "+ this.themeManager.themes[themeName].name + "!", mafiachan);
		} else {
		sys.sendAll("±Game: " + sys.name(src) + " voted for "+ this.themeManager.themes[themeName].name + "!", mafiachan);
		}
		this.votes[sys.ip(src)] = {theme: themeName, who: sys.name(src)};
		};
		/* callback for /realstart */
		this.startGame = function(src, commandData) {
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
		if (who == sys.name(src)) {
		sys.sendMessage(src, "±Game: Sorry, you have started a game " + i + " games ago, let someone else have a chance!",mafiachan);
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
		CurrentGame = {who: src !== null ? sys.name(src) : "voted", what: themeName, when: parseInt(sys.time(), 10), playerCount: 0};

		// For random theme
		//mafia.theme = mafia.themeManager.themes[Object.keys(mafia.themeManager.themes)[parseInt(Object.keys(mafia.themeManager.themes).length * Math.random())]];

		if (src !== null) {
		sys.sendAll("", mafiachan);
		sys.sendAll(border, mafiachan);
		if (this.theme.name == "default") {
		sys.sendAll("±Game: " + sys.name(src) + " started a game!", mafiachan);
		} else {
		sys.sendAll("±Game: " + sys.name(src) + " started a game with theme "+this.theme.name+"!", mafiachan);
		}
		sys.sendAll("±Game: Type /Join to enter the game!", mafiachan);
		sys.sendAll(border, mafiachan);
		sys.sendAll("", mafiachan);
		}

		if (this.theme.summary === undefined) {
		sys.sendAll("±Game: Consider adding a summary field to this theme that describes the setting of the game and points out the odd quirks of the theme!",mafiachan);
		} else {
		sys.sendAll("±Game: " + this.theme.summary,mafiachan);
		}

		if (sys.playersOfChannel(mafiachan).length < 150) {
		var time = parseInt(sys.time(), 10);
		if (time > this.lastAdvertise + 60*15) {
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
		};
		/* callback for /end */
		this.endGame = function(src) {
		if (mafia.state == "blank") {
		sys.sendMessage(src, "±Game: No game is going on.",mafiachan);
		return;
		}
		sys.sendAll(border, mafiachan);

		sys.sendAll("±Game: " + (src ? sys.name(src) : Config.Mafia.bot) + " has stopped the game!", mafiachan);
		sys.sendAll(border, mafiachan);
		sys.sendAll("", mafiachan);

		mafia.clearVariables();
		};
		/* called every second */
		this.tickDown = function() {
		if (this.ticks <= 0) {
		return;
		}
		this.ticks = this.ticks - 1;
		if (this.ticks === 0) {
		this.callHandler(this.state);
		} else {
		if (this.ticks == 30 && this.state == "entry") {
		sys.sendAll("", mafiachan);
		sys.sendAll("±Game: Hurry up, you only have "+this.ticks+" seconds more to join!", mafiachan);
		sys.sendAll("", mafiachan);
		}
		}
		};
		this.sendPlayer = function(player, message) {
		var id = sys.id(player);
		if (id === undefined)
		return;
		sys.sendMessage(id, message, mafiachan);
		};
		// Grab a list of all roles belonging to a given team.
		this.getRolesForTeam = function(side) {
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

		this.getPlayersForTeam = function(side) {
		var team = [];
		for (var p in this.players) {
		var player = this.players[p];
		if (player.role.side == side) {
		team.push(player.name);
		}
		}
		return team;
		};
		this.getPlayersForTeamS = function(side) {
		return mafia.getPlayersForTeam(side).join(", ");
		};
		this.getPlayersForRole = function(role) {
		var team = [];
		for (var p in this.players) {
		var player = this.players[p];
		if (player.role.role == role) {
		team.push(player.name);
		}
		}
		return team;
		};
		this.getPlayersForRoleS = function(role) {
		return mafia.getPlayersForRole(role).join(", ");
		};
		this.getCurrentRoles = function() {
		var list = [];
		for (var p in this.players) {
		if (typeof this.players[p].role.actions.onlist === "string")
		list.push(this.theme.trrole(this.players[p].role.actions.onlist));
		else
		list.push(this.players[p].role.translation);
		}
		/* Sorting to not give out the order of the roles per player */
		return list.sort().join(", ");
		};
		this.getCurrentPlayers = function() {
		var list = [];
		for (var p in this.players) {
		list.push(this.players[p].name);
		}
		return list.sort().join(", ");

		};
		this.player = function(role) {
		for (var p in this.players) {
		if (mafia.players[p].role.role == role) //Checks sequentially all roles to see if this is the good one
		return x;
		}
		return noPlayer;
		};
		this.removePlayer = function(player) {
		for (var action in player.role.actions.night) {
		var targetMode = player.role.actions.night[action].target;
		var team = this.getPlayersForTeam(player.role.side);
		var role = this.getPlayersForRole(player.role.role);
		if ((targetMode == 'AnyButSelf' || targetMode == 'Any')
		|| (targetMode == 'AnyButTeam' && team.length == 1)
		|| (targetMode == 'AnyButRole' && role.length == 1)) {
		this.removeTarget(player, action);
		}
		}
		if (mafia.votes.hasOwnProperty(player.name))
		delete mafia.votes[player.name];
		delete this.players[player.name];
		};
		this.kill = function(player) {
		if (this.theme.killmsg) {
		sys.sendAll(this.theme.killmsg.replace(/~Player~/g, player.name).replace(/~Role~/g, player.role.translation), mafiachan);
		} else {
		sys.sendAll("±Kill: " + player.name + " (" + player.role.translation + ") died!", mafiachan);
		}
		this.removePlayer(player);
		};
		this.removeTargets = function(player) {
		for (var action in player.role.actions.night) {
		this.removeTarget(player, action);
		}
		};
		this.removeTarget = function(player, action) {
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
		this.removeTarget2 = function(player, target) {
		// TODO: implement
		};
		this.getTargetsFor = function(player, action) {
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
		this.teamTargets[player.role.side][action]= [];
		}
		return this.teamTargets[player.role.side][action];
		} else if (commonTarget == 'Role') {
		if (!(player.role.role in this.roleTargets)) {
		this.roleTargets[player.role.role] = {};
		}
		if (!(action in this.roleTargets[player.role.role])) {
		this.roleTargets[player.role.role][action]= [];
		}
		return this.roleTargets[player.role.role][action];
		}
		};
		this.setTarget = function(player, target, action) {
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
		this.teamTargets[player.role.side][action]= [];
		}
		list = this.teamTargets[player.role.side][action];
		} else if (commonTarget == 'Role') {
		if (!(player.role.role in this.roleTargets)) {
		this.roleTargets[player.role.role] = {};
		}
		if (!(action in this.roleTargets[player.role.role])) {
		this.roleTargets[player.role.role][action]= [];
		}
		list = this.roleTargets[player.role.role][action];
		}
		if (list.indexOf(target.name) == -1) {
		list.push(target.name);
		if (list.length > limit) {
		list.splice(0, 1);
		}
		}
		if (this.ticks > 0 && limit > 1)
		this.sendPlayer(player.name, "±Game: Your target(s) are " + list.join(', ') + "!");
		};
		this.testWin = function() {

		if (Object.keys(mafia.players).length === 0) {
		sys.sendAll("±Game: Everybody died! This is why we can't have nice things :(", mafiachan);
		sys.sendAll(border, mafiachan);
		mafia.clearVariables();
		return true;

		}
		outer:
		for (var p in mafia.players) {
		var winSide = mafia.players[p].role.side;
		if (winSide != 'village') {
		for (var i in mafia.theme.villageCantLoseRoles) {
		if (mafia.player(mafia.theme.villageCantLoseRoles[i]) != noPlayer)
		// baddies shouldn't win if vigi, mayor or samurai is alive
		continue outer;
		}
		}
		var players = [];
		var goodPeople = [];
		for (var x in mafia.players) {
		if (mafia.players[x].role.side == winSide) {
		players.push(x);
		} else if (winSide == 'village') {
		// if winSide = villy all people must be good people
		continue outer;
		} else if (mafia.players[x].role.side == 'village') {
		goodPeople.push(x);
		} else {
		// some other baddie team alive
		return false;
		}
		}

		if (players.length >= goodPeople.length) {
		if(winSide in mafia.theme.sideWinMsg){
		sys.sendAll(mafia.theme.sideWinMsg[winSide].replace(/~Players~/g, (players.length > 1 ? players.splice(0,players.length-1).join(", ")+" and ":"") + players), mafiachan);
		} else {
		sys.sendAll("±Game: The " + mafia.theme.trside(winSide) + " (" + players.join(', ') + ") wins!", mafiachan);
		}
		if (goodPeople.length > 0) {
		sys.sendAll("±Game: The " + mafia.theme.trside('village') + " (" + goodPeople.join(', ') + ") lose!", mafiachan);
		}
		sys.sendAll(border, mafiachan);
		mafia.clearVariables();
		return true;
		}
		}
		return false;
		};
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
		}

		/* Creating the roles list */
		var i = 1;
		while (mafia.signups.length > mafia.theme["roles"+i].length) {
		++i;
		}
		var srcArray = mafia.theme["roles"+i].slice(0, mafia.signups.length);

		srcArray = shuffle(srcArray);

		for (i = 0; i < srcArray.length; ++i) {
		mafia.players[mafia.signups[i]] = {'name': mafia.signups[i], 'role': mafia.theme.roles[srcArray[i]], 'targets': {}};
		if (typeof mafia.theme.roles[srcArray[i]].side == "object") {
		if ("random" in mafia.theme.roles[srcArray[i]].side) {
		var cum = 0;
		var val = sys.rand(1,100)/100;
		var psum = 0.0;
		var side;
		for(side in mafia.theme.roles[srcArray[i]].side.random) {
		psum += mafia.theme.roles[srcArray[i]].side.random[side];
		}
		if (psum === 0.0) {
		botAll("Broken theme...", mafiachan);
		return;
		}
		for (side in mafia.theme.roles[srcArray[i]].side.random) {
		cum += mafia.theme.roles[srcArray[i]].side.random[side]/psum;
		if (cum >= val) {
		mafia.players[mafia.signups[i]].role.side = side;
		break;
		}
		}
		if (typeof mafia.players[mafia.signups[i]].role.side == "object") {
		botAll("Broken theme...", mafiachan);
		return;
		}
		} else {
		botAll("Broken theme...", mafiachan);
		return;
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
		if (typeof role.actions.startup == "object" && role.actions.startup["team-revealif"] && typeof role.actions.startup["team-revealif"].indexOf == "function") {
		if (role.actions.startup["team-revealif"].indexOf(role.side) != -1) {
		mafia.sendPlayer(player.name, "±Game: Your team is " + mafia.getPlayersForTeamS(role.side) + ".");
		}
		}
		if (role.actions.startup == "role-reveal") {
		mafia.sendPlayer(player.name, "±Game: People with your role are " + mafia.getPlayersForRoleS(role.role) + ".");
		}

		if (typeof role.actions.startup == "object" && role.actions.startup.revealRole) {
		if (typeof role.actions.startup.revealRole == "string") {
		mafia.sendPlayer(player.name, "±Game: The " + mafia.theme.roles[role.actions.startup.revealRole].translation + " is " + mafia.getPlayersForRoleS(player.role.actions.startup.revealRole) + "!");
		} else if (typeof role.actions.startup.revealRole == "object" && typeof role.actions.startup.revealRole.indexOf == "function") {
		for (var s = 0, l = role.actions.startup.revealRole.length; s < l; ++s) {
		var revealrole = role.actions.startup.revealRole[s];
		mafia.sendPlayer(player.name, "±Game: The " + mafia.theme.roles[revealrole].translation + " is " + mafia.getPlayersForRoleS(revealrole) + "!");
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
		},
		night : function() {
		sys.sendAll(border, mafiachan);
		sys.sendAll("Times Up! :", mafiachan);

		var nightkill = false;
		var getTeam = function(role, commonTarget) {
		var team = [];
		if (commonTarget == 'Role') {
		team = mafia.getPlayersForRole(role.role);
		} else if (commonTarget == 'Team') {
		team = mafia.getPlayersForTeam(role.side);
		}
		return team;
		};

		var player, names, j;
		for (var i in mafia.theme.nightPriority) {
		var o = mafia.theme.nightPriority[i];
		names = mafia.getPlayersForRole(o.role);
		var command = o.action;
		var Action = mafia.theme.roles[o.role].actions.night[o.action];
		if ("command" in Action) {
		command = Action.command; // translate to real command
		}
		for (j = 0; j < names.length; ++j) {
		if (!mafia.isInGame(names[j])) continue;
		player = mafia.players[names[j]];
		var targets = mafia.getTargetsFor(player, o.action);
		var target, t; // current target

		if (command == "distract") {
		if (targets.length === 0) continue;
		target = targets[0];
		if (!mafia.isInGame(target)) continue;
		target = mafia.players[target];
		var distractMode = target.role.actions.distract;
		if (distractMode === undefined) {}
		else if (target.safeguarded) {
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was guarded!");
		} else if (distractMode.mode == "ChangeTarget") {
		mafia.sendPlayer(player.name, "±Game: " + distractMode.hookermsg);
		mafia.sendPlayer(target.name, "±Game: " + distractMode.msg.replace(/~Distracter~/g, player.role.translation));
		mafia.kill(player);
		nightkill = true;
		mafia.removeTargets(target);
		continue;
		} else if (distractMode.mode == "ignore") {
		if (distractMode.msg)
		mafia.sendPlayer(target.name, "±Game: " + distractMode.msg.replace(/~Distracter~/g, player.role.translation));
		continue;
		} else if (typeof distractMode.mode == "object" && (typeof distractMode.mode.ignore == "string" && distractMode.mode.ignore == player.role.role || typeof distractMode.mode.ignore == "object" && typeof distractMode.mode.ignore.indexOf == "function" && distractMode.mode.ignore.indexOf(player.role.role) > -1)) {
		if (distractMode.msg)
		mafia.sendPlayer(target.name, "±Game: " + distractMode.msg.replace(/~Distracter~/g, player.role.translation));
		continue;
		} else if (typeof distractMode.mode == "object" && typeof distractMode.mode.killif == "object" && typeof distractMode.mode.killif.indexOf == "function" && distractMode.mode.killif.indexOf(player.role.role) > -1) {
		if (distractMode.hookermsg)
		mafia.sendPlayer(player.name, "±Game: " + distractMode.hookermsg);
		if (distractMode.msg)
		mafia.sendPlayer(target.name, "±Game: " + distractMode.msg.replace(/~Distracter~/g, player.role.translation));
		mafia.kill(player);
		nightkill = true;
		mafia.removeTargets(target);
		continue;
		}
		mafia.sendPlayer(target.name, "±Game: The " + player.role.translation +" came to you last night! You were too busy being distracted!");
		mafia.removeTargets(target);
		/* warn role / teammates */
		if ("night" in target.role.actions) {
		for (var action in target.role.actions.night) {
		var team = getTeam(target.role, target.role.actions.night[action].common);
		for (var x in team) {
		if (team[x] != target.name) {
		mafia.sendPlayer(team[x], "±Game: Your teammate was too busy with the " + player.role.translation + " during the night, you decided not to " + action + " anyone during the night!");
		}
		}
		}
		}
		}
		else if (command == "protect") {
		for (t in targets) {
		target = targets[t];
		if (mafia.isInGame(target)) {
		target = mafia.players[target];
		if (!("protect" in target.role.actions && target.role.actions.protect.mode == "ignore")) {
		target.guarded = true;
		} else if (target.role.actions.protect.silent !== true){
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was not affected by the protect!");
		}
		}
		}
		}
		else if (command == "inspect") {
		if (targets.length === 0) continue;
		target = targets[0];
		if (!mafia.isInGame(target)) continue;
		target = mafia.players[target];
		var inspectMode = target.role.actions.inspect;
		if (target.safeguarded) {
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was guarded!");
		} else if (inspectMode === undefined) {
		mafia.sendPlayer(player.name, "±Info: " + target.name + " is the " + target.role.translation + "!!");
		} else {
		if (inspectMode.revealAs !== undefined) {
		mafia.sendPlayer(player.name, "±Info: " + target.name + " is the " + mafia.theme.trrole(inspectMode.revealAs) + "!!");
		}
		if (inspectMode.revealSide !== undefined) {
		mafia.sendPlayer(player.name, "±Info: " + target.name + " is sided with the " + mafia.theme.trside(target.role.side) + "!!");
		}
		}
		}
		else if (command == "poison") {
		for (t in targets) {
		target = targets[t];
		if (!mafia.isInGame(target)) continue;
		target = mafia.players[target];
		if (target.safeguarded) {
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was guarded!");
		} else if ("poison" in target.role.actions && target.role.actions.poison.mode == "ignore") {
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was immune to the poison!");
		} else if ("poison" in target.role.actions && typeof target.role.actions.poison.mode == "object" && target.role.actions.poison.mode.evadeChance > sys.rand(0,100)/100) {
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") evaded the poison! Somehow.");
		} else if (target.poisoned === undefined) {
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was poisoned!");
		target.poisoned = 1;
		target.poisonCount = Action.count || 2;
		target.poisonDeadMessage = Action.poisonDeadMessage;
		}
		}
		}
		else if (command == "safeguard") {
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
		}
		else if (command == "kill") {
		for (t in targets) {
		target = targets[t];
		if (!mafia.isInGame(target)) continue;
		target = mafia.players[target];
		var revenge = false;
		var revengetext = "±Game: You were killed during the night!";
		if ("kill" in target.role.actions && (target.role.actions.kill.mode == "killattacker" && !target.guarded || target.role.actions.kill.mode == "killattackerevenifprotected")) {
		revenge = true;
		if (target.role.actions.kill.msg)
		revengetext = target.role.actions.kill.msg;
		}
		if (target.guarded) {
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was protected!");
		} else if ("kill" in target.role.actions && target.role.actions.kill.mode == "ignore") {
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") evaded the kill!");
		} else if ("kill" in target.role.actions && typeof target.role.actions.kill.mode == "object" && target.role.actions.kill.mode.evadeChance > sys.rand(0,100)/100) {
		mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") evaded the kill!");
		} else {
		if (mafia.theme.killusermsg) {
		mafia.sendPlayer(target.name, mafia.theme.killusermsg);
		} else {
		mafia.sendPlayer(target.name, "±Game: You were killed during the night!");
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
		}
		}
		}
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
		standby : function() {
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
		day : function() {
		sys.sendAll(border, mafiachan);
		sys.sendAll("Times Up! :", mafiachan);

		var voted = {}, player;
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

		if (mafia.testWin())
		return;
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
		voting: function() {
		this.state = "blank";
		var res = {}, theme, players = {}, ips = {};
		for (var ip in this.votes) {
		theme = this.votes[ip].theme;
		res[theme] = ++res[theme] || 1;
		players[theme] = players[theme] || [];
		players[theme].push(this.votes[ip].who);
		ips[theme] = ips[theme] || [];
		ips[theme].push(ip);
		}
		var winner = {votes: -1, theme: null};
		for (theme in res) {
		if (res[theme] > winner.votes) {
		winner.votes = res[theme];
		winner.theme = theme;
		}
		}
		if (winner.theme !== null) {
		sys.sendAll("±Game: Theme " + winner.theme + " won with " + winner.votes + " votes!", mafiachan);
		sys.sendAll("±Game: Type /Join to enter the game!", mafiachan);
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
		this.callHandler = function(state) {
		try {
		if (state in this.handlers)
		this.handlers[state].call(this);
		} catch(e) {
		sys.sendAll("Error occurred in mafia while handling the end of '" + state + "' phase: " + e, mafiachan);
		}
		};
		this.showCommands = function(src) {
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
		this.showHelp = function(src) {
		var help = [
		"*** *********************************************************************** ***",
		"±Game: The objective in this game on how to win depends on the role you are given.",
		"*** *********************************************************************** ***",
		"±Role: Mafia",
		"±Win: Eliminate the WereWolf and the Good People!",
		"*** *********************************************************************** ***",
		"±Role: WereWolf",
		"±Win: Eliminate everyone else in the game!",
		"*** *********************************************************************** ***",
		"±Role: Good people (Inspector, Bodyguard, Pretty Lady, Villager, Mayor, Spy, Vigilante, Samurai)",
		"±Win: Eliminate the WereWolf, Mafia (French and Italian if exists) and the Godfather!",
		"*** *********************************************************************** ***",
		"±Role: French Canadian Mafia, Don French Canadian Mafia",
		"±Win: Eliminate the Italian Mafia, Godfather and the Good People!",
		"*** *********************************************************************** ***",
		"±Role: Italian Mafia, Don Italian Mafia",
		"±Win: Eliminate the French Canadian Mafia, Godfather and the Good People!",
		"*** *********************************************************************** ***",
		"±More: Type /roles for more info on the characters in the game!",
		"±More: Type /rules to see some rules you should follow during a game!",
		"*** *********************************************************************** ***",
		""
		];
		dump(src, help);
		};
		this.showRoles = function(src, commandData) {
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
		var roles;
		if (themeName == "default2") {
		roles = [
		"*** *********************************************************************** ***",
		"±Role: Villager",
		"±Ability: The Villager has no command during night time. They can only vote during the day!",
		"±Game: 6-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Inspector",
		"±Ability: The Inspector can find out the identity of a player during the Night. ",
		"±Game: 5-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Bodyguard",
		"±Ability: The Bodyguard can protect one person during the night from getting killed, but the bodyguard cant protect itself.",
		"±Game: 5-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Pretty Lady",
		"±Ability: The Pretty Lady can distract people during the night thus cancelling their move, unless it's the WereWolf.",
		"±Game: 5-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Samurai",
		"±Ability: The Samurai can kill people during the standby phase, but he will be revealed when doing so.",
		"±Game: 25-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Mafia",
		"±Ability: The Mafia is a group of 2 people. They get one kill each night. They strike after the WereWolf.",
		"±Game: 5-12 Players",
		"*** *********************************************************************** ***",
		"±Role: WereWolf",
		"±Ability: The WereWolf is solo. To win it has to kill everyone else in the game. The Werewolf strikes first.",
		"±Game: 5-12 27-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Italian Mafia",
		"±Ability: The Italian Mafia is a group of 2-3 people. They get one kill each night. They strike before the French Canadian Mafia.",
		"±Game: 12-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Italian Conspirator",
		"±Ability: Italian Conspirator is sided with Italian Mafia, but doesn't have any special commands. Shows up as a Villager to inspector.",
		"±Game: -",
		"*** *********************************************************************** ***",
		"±Role: Don Italian Mafia",
		"±Ability: Don Italian Mafia is sided with Italian Mafia. He kills with Italian mafia each night. He can't be distracted.",
		"±Game: 24-30 Players",
		"*** *********************************************************************** ***",
		"±Role: French Canadian Mafia",
		"±Ability: The French Canadian Mafia is a group of 2-4 people. They get one kill each night. They strike after the Italian Mafia.",
		"±Game: 12-30 Players",
		"*** *********************************************************************** ***",
		"±Role: French Canadian Conspirator",
		"±Ability: French Canadian Conspirator is sided with French Canadian Mafia, but doesn't have any special commands. Shows up as a Villager to inspector.",
		"±Game: -",
		"*** *********************************************************************** ***",
		"±Role: Don French Canadian Mafia",
		"±Ability: Don French Canadian Mafia is sided with French Canadian Mafia. He kills with French Canadian mafia each night. He can't be distracted.",
		"±Game: 18-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Mayor",
		"±Ability: The Mayor has no command during the night but his/her vote counts as 2.",
		"±Game: 10-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Spy",
		"±Ability: The Spy has 33% chance of finding out who is going to get killed by The Italian or French Canadian Mafia during the night. And 10% chance to find out who is the killer!",
		"±Game: 13-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Vigilante",
		"±Ability: The Vigilante can kill a person during the night! He/she strikes after The French Canadian and Italian Mafia.",
		"±Game: 20-30 Players",
		"*** *********************************************************************** ***",
		"±Role: Godfather",
		"±Ability: The Godfather can kill 2 people during the night! He/she strikes Last!",
		"±Game: 22-30 Players",
		"*** *********************************************************************** ***",
		""
		];
		} else {
		roles = mafia.themeManager.themes[themeName].roleInfo;
		}
		dump(src, roles);
		};
		this.showSides = function(src, commandData) {
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
		this.showRules = function(src) {
		var rules = [
		"",
		"     Server Rules: ",
		"±Rule: No spamming / flooding ",
		"±Rule: No insulting - especially not auth. ",
		"±Rule: No trolling.",
		"±Tip: Type /rules on other channel to see full rules.",
		"",
		"     Game Rules: ",
		"±Rule: Do not quote any of the Bots.",
		"±Rule: Do not quit the game before you are dead.",
		"±Rule: Do not vote yourself / get yourself killed on purpose",
		"±Rule: Do not talk once you're dead or voted off. ",
		"±Rule: Do not use a hard to type name.",
		"±Rule: Do not group together to ruin the game",
		"±Rule: DO NOT REVEAL YOUR PARTNER IF YOU ARE MAFIA",
		"",
		"±Game: Disobey them and you will be banned from mafia/muted according to the mod/admin's wishes!",
		""
		];
		dump(src, rules);
		};
		this.showThemes = function(src) {
		var l = [];
		for (var t in mafia.themeManager.themes) {
		l.push(mafia.themeManager.themes[t].name);
		}
		botMessage(src, "Installed themes are: " + l.join(", "), mafiachan);
		};
		this.showThemeInfo = function(src) {
		mafia.themeManager.themeInfo.sort(function(a,b) {return a[0].localeCompare(b[0]);});
		var mess = [];
		mess.push("<table><tr><th>Theme</th><th>URL</th><th>Author</th><th>Enabled</th></tr>");
		for (var i = 0; i < mafia.themeManager.themeInfo.length; ++i) {
		var info = mafia.themeManager.themeInfo[i];
		var theme = mafia.themeManager.themes[info[0].toLowerCase()];
		if (!theme) continue;
		mess.push('<tr><td>' + theme.name + '</td><td><a href="' + info[1] + '">' + info[1] + '</a></td><td>' + (theme.author ? theme.author : "unknown") + '</td><td>' + (theme.enabled ? "yes" : "no")+ '</td></tr>');
		}
		mess.push("</table>");
		sys.sendHtmlMessage(src, mess.join(""), mafiachan);
		};
		this.showThemeDetails = function(src, commandData) {
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
		for (var i = 0; i < mafia.themeManager.themeInfo.length; ++i){
		if (mafia.themeManager.themeInfo[i][0] == themeName){
		link = mafia.themeManager.themeInfo[i][1];
		break;
		}
		}   
		var mess = [];
		mess.push("");
		mess.push("<b>Theme: </b>" + theme.name);
		mess.push("<b>Author: </b>" + (theme.author ? theme.author : "Unknown"));
		mess.push("<b>Enabled: </b>" + (theme.enabled ? "Yes" : "No")); 
		mess.push("<b>Number of Players: </b> Up to " + (theme["roles" + theme.roleLists].length) + " players");
		mess.push("<b>Summary: </b>" + (theme.summary ? theme.summary : "No summary avaiable."));
		mess.push("(For more information about this theme, type <b>/roles " + theme.name + "</b>)");
		mess.push("<b>Code: </b>" + link);   
		mess.push("");
		for (var x in mess){
		sys.sendHtmlMessage(src, mess[x], mafiachan);
		}
		};

		this.showPlayedGames = function(src) {
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

		// Auth commands
		this.isMafiaAdmin = function(src) {
		if (sys.auth(src) >= 1)
		return true;
		return false;
		};
		this.isMafiaSuperAdmin = function(src) {
		if (sys.auth(src) >= 2)
		return true;
		return false;
		};
		this.pushUser = function(src, name) {
		if (sys.auth(src) < 2) {
		botMessage(src, "admin+ command.", mafiachan);
		return;
		}
		if (this.state != "entry") {
		botMessage(src, "Pushing makes no sense outside entry...", mafiachan);
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
		this.slayUser = function(src, name) {
		var slayer = typeof src == "string" ? src : sys.name(src);
		if (this.state == "entry") {
		for (var i = 0; i < this.signups.length; ++i) {
		if (name.toLowerCase() == this.signups[i].toLowerCase()) {
		botAll(" " + this.signups[i] + " was taken out from the game by " + slayer + "!", mafiachan);
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
		botMessage(src, "No such target.", mafiachan);
		};
		this.addTheme = function(src, url) {
		if (!mafia.isMafiaAdmin(src)) {
		botMessage(src, "admin+ command.". mafiachan);
		return;
		}
		mafia.themeManager.loadWebTheme(url, true, false);
		};
		this.updateTheme = function(src, url) {
		var theme = mafia.themeManager.themes[url.toLowerCase()];
		var authorMatch = theme !== undefined && typeof theme.author == "string" && theme.author.toLowerCase() == sys.name(src).toLowerCase();
		if (!mafia.isMafiaAdmin(src) && !authorMatch) {
		botMessage(src, "You need to be admin or the author of this theme.", chan);
		return;
		}
		var dlurl;
		if (url.substr(0,7) != "http://") {
		for (var i = 0; i < mafia.themeManager.themeInfo.length; ++i) {
		if (mafia.themeManager.themeInfo[i][0].toLowerCase() == url.toLowerCase()) {
		dlurl = mafia.themeManager.themeInfo[i][1];
		break;
		}
		}
		} else {
		dlurl = url;
		}
		botMessage(src, "Download url: " + dlurl, chan);
		if (dlurl) {
		mafia.themeManager.loadWebTheme(dlurl, true, true);
		}
		};
		this.removeTheme = function(src, name) {
		if (!mafia.isMafiaSuperAdmin(src)) {
		botMessage(src, "admin+ command.", chan);
		return;
		}
		mafia.themeManager.remove(src, name);
		};
		this.disableTheme = function(src, name) {
		if (!mafia.isMafiaAdmin(src)) {
		botMessage(src, "admin+ command.", chan);
		return;
		}
		mafia.themeManager.disable(src, name);
		};
		this.enableTheme = function(src, name) {
		if (!mafia.isMafiaAdmin(src)) {
		botMessage(src, "admin+ command.", src);
		return;
		}
		mafia.themeManager.enable(src, name);
		};

		this.importOld = function(src, name) {
		botAll("Importing old themes", mafiachan);
		mafia.themeManager.loadTheme(defaultTheme);
		mafia.themeManager.saveToFile(defaultTheme);
		};

		this.commands = {
		user: {
		commands : [this.showCommands, "To see the various commands."],
		start: [this.userVote, "Start voting for a new game theme / or vote!"],
		votetheme: [this.userVote, "Start voting for a new game theme / or vote!"],
		starttheme: [this.startGame, "Starts a Game of Mafia with specified theme."],
		help: [this.showHelp, "For info on how to win in a game."],
		roles: [this.showRoles, "For info on all the Roles in the game."],
		rules: [this.showRules, "To see the Rules for the Game/Server."],
		themes: [this.showThemes, "To view installed themes."],
		themeinfo: [this.showThemeInfo, "To view installed themes (more details)."],
		details: [this.showThemeDetails, "To view info about a specific theme."],
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
		this.canJoin = function(src) {
		if (this.isInGame(sys.name(src))) {
		sys.sendMessage(src, "±Game: You already joined!", mafiachan);
		return;
		}
		if (this.ips.indexOf(sys.ip(src))!=-1) {
		sys.sendMessage(src, "±Game: This IP is already in list. You cannot register two times!", mafiachan);
		return;
		}
		if (JSESSION.users(src).muted) {
		sys.sendMessage(src, "±Game: You are muted!", mafiachan);
		return;
		}
		var name = sys.name(src);
		for (var x in name) {
		var code = name.charCodeAt(x);
		if (name[x] != ' ' && name[x] != '.' && (code < 'a'.charCodeAt(0) || code > 'z'.charCodeAt(0))
		&& (code < 'A'.charCodeAt(0) || code > 'Z'.charCodeAt(0)) && name[x] != '-' && name[x] != '_' && name[x] !='<' && name[x] != '>' && (code < '0'.charCodeAt(0) || code > '9'.charCodeAt(0)))
		{
		sys.sendMessage(src, "±Name: You're not allowed to have the following character in your name: " + name[x] + ".", mafiachan);
		sys.sendMessage(src, "±Rule: You must change it if you want to join!", mafiachan);
		return;
		}
		}
		if (name.length > 14) {
		sys.sendMessage(src, "±Name: You're not allowed to have more than 12 letters in your name!", mafiachan);
		sys.sendMessage(src, "±Rule: You must change it if you want to join!", mafiachan);
		return;
		}
		return true;
		};
		this.handleCommand = function(src, message, channel) {

		var command;
		var commandData = '*';
		var pos = message.indexOf(' ');

		if (pos != -1) {
		command = message.substring(0, pos).toLowerCase();
		commandData = message.substr(pos+1);
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
		if (this.signups.length >= this.theme["roles"+this.theme.roleLists].length) {
		sys.sendMessage(src, "±Game: There can't be more than " + this.theme["roles"+this.theme.roleLists].length + " players!", mafiachan);
		return;
		}
		name = sys.name(src);

		this.signups.push(name);
		this.ips.push(sys.ip(src));
		sys.sendAll("±Game: " + name + " joined the game!", mafiachan);
		if (this.signups.length == this.theme["roles"+this.theme.roleLists].length) {
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

		if (["Self", "Any"].indexOf(player.role.actions.night[command].target) == -1 && commandData == name) {
		sys.sendMessage(src, "±Hint: Nope, this wont work... You can't target yourself!", mafiachan);
		return;
		}
		else if (player.role.actions.night[command].target == 'AnyButTeam' && player.role.side == target.role.side
		|| player.role.actions.night[command].target == 'AnyButRole' && player.role.role == target.role.role) {
		sys.sendMessage(src, "±Hint: Nope, this wont work... You can't target your partners!", mafiachan);
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
		}

		/* Hax-related to command */
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
		if (r < mafia.theme.roles[role].actions.hax[command].revealTeam) {
		if (team.length > 1)
		this.sendPlayer(haxPlayer, "±Game: The " + roleName + " are going to " + command + " " + commandData + "!");
		else
		this.sendPlayer(haxPlayer, "±Game: The " + roleName + " is going to " + command + " " + commandData + "!");
		}
		if (r < mafia.theme.roles[role].actions.hax[command].revealPlayer) {
		if (team.length > 1)
		this.sendPlayer(haxPlayer, "±Game: " + name + " is one of The " + roleName + "!");
		else
		this.sendPlayer(haxPlayer, "±Game: " + name + " is The " + roleName + "!");
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
		this.voteCount+=1;

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
		if (commandObject.hasOwnProperty("command"))
		command = commandObject.command;

		if (target !== null) {
		if ((commandObject.target === undefined || ["Self", "Any"].indexOf(commandObject.target) == -1) && player == target) {
		sys.sendMessage(src, "±Hint: Nope, this wont work... You can't target yourself!", mafiachan);
		return;
		} else if (commandObject.target == 'AnyButTeam' && player.role.side == target.role.side
		|| commandObject.target == 'AnyButRole' && player.role.role == target.role.role) {
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
		} else if (target.role.actions.daykill == "revenge") {
		revenge = true;
		}
		}
		sys.sendAll(border, mafiachan);
		if (!revenge) {
		sys.sendAll("±Game: " + commandObject.killmsg.replace(/~Self~/g, name).replace(/~Target~/g, commandData), mafiachan);
		player.dayKill = player.dayKill+1 || 1;
		this.kill(mafia.players[commandData]);
		} else {
		if (target.role.actions.daykillrevengemsg !== undefined && typeof target.role.actions.daykillrevengemsg == "string") {
		sys.sendAll("±Game: " + target.role.actions.daykillrevengemsg.replace(/~Self~/g, commandData).replace(/~Target~/g, name), mafiachan);
		} else {
		sys.sendAll("±Game: ~Target~ tries to attack ~Self~, but ~Self~ fights back and kills ~Target~!".replace(/~Self~/g, commandData).replace(/~Target~/g, name), mafiachan);

		}
		this.kill(mafia.players[name]);
		}

		if (this.testWin()) {
		return;
		}
		sys.sendAll(border, mafiachan);
		} else if (command == "reveal") {
		var revealMessage = commandObject.revealmsg ? commandObject.revealmsg : "~Self~ is revealed to be a ~Role~!";
		sys.sendAll(border, mafiachan);
		sys.sendAll("±Game: " + revealMessage.replace(/~Self~/g, name).replace(/~Role~/g, player.role.translation), mafiachan);
		sys.sendAll(border, mafiachan);
		}
		return;
		}
		}
		if (command == "join") {
		sys.sendMessage(src, "±Game: You can't join now!", mafiachan);
		return;
		}

		if (command == "mafiaadmins") {
		sendChanMessage(src, "");
		sendChanMessage(src, "*** MAFIA ADMINS ***");
		sendChanMessage(src, "");
		for (x in mafiaAdmins.hash) {
		sendChanMessage(src, x + (sys.id(x) !== undefined ? ":" : ""));
		}
		sendChanMessage(src, "");
		return;
		}

		if (!this.isMafiaAdmin(src))
		throw ("no valid command");

		if (command in this.commands.auth) {
		this.commands.auth[command][0].call(this, src, commandData);
		return;
		}
		if (!this.isMafiaSuperAdmin(src))
		throw ("no valid command");

		throw ("no valid command");
		};

		// we can always slay them :3
		this.onMute = function(src) {
		this.slayUser(Config.capsbot, sys.name(src));
		};
		this.onKick = function(src) {
		this.slayUser(Config.floodbot, sys.name(src));
		};
		};
		mafia = new Mafia(mafiachan);
		mafia.importOld();
		}
		,
		})