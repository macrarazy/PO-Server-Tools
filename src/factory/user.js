Factory.User = function (id) {
    var name = sys.name(id),
        nameLower = name.toLowerCase();

    this.id = id;
    this.impersonation = undefined;
    this.ip = sys.ip(id);
    this.name = name;
    this.lowername = nameLower;
    this.lastMsg = 0;
    this.loginTime = +sys.time();
    this.lastChallenge = 0;
    this.floodCount = 0;
    this.caps = 0;
    this.lastFuture = 0;
    this.teamChanges = 0;
    /*
    if (typeof DataHash === "undefined" || typeof DataHash.voices === "undefined") {
        return;
    }

    var dh = DataHash;

    var d = dh.mutes;
    this.muted = d.has(this.ip);

    this.megauser = dh.megausers.has(mn_lc);

    var i = dh.rankicons;

    if (i.has(mn_lc)) {
        this.icon = i[mn_lc];
    }

    i = dh.voices;
    this.voice = i.has(mn_lc);

    i = dh.macros;
    this.macro = ["%m1", "%m2", "%m3", "%m4", "%m5"];

    if (i.has(mn_lc)) {
        this.macro = i[mn_lc];
    }*/
};

/*
    ! Turn these into utilities
POUser.prototype.addFlood = function () {
    if (typeof hpAuth === 'undefined' || hpAuth(this.id) < 1) {
        this.floodCount++;
        sys.callLater('SESSION.users(' + this.id + ').floodCount--', 6);
    }
};

POUser.prototype.capsMute = function (message, channel) {
    if (typeof hpAuth !== 'undefined' && hpAuth(this.id) > 0) {
        return false;
    }

    if (typeof AutoMute !== 'undefined' && !AutoMute) {
        return false;
    }

    var newCapsAmount = 0,
        z;
    for (z in message) {
        if (capsMessage(message[z])) {
            newCapsAmount += 1;
        } else {
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
        var thetime = +sys.time() + bantime;

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
};*/
