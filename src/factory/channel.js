JSESSION.factory.Channel = function (id) {
    this.name = sys.channel(id);
    this.id = id;

    this.chanAuth = {};
    this.tourAuth = {};
    this.creator = '';
    this.topic = 'Welcome to ' + this.name + '!';
    this.topicsetter = '';
    this.toursEnabled = false;
    
    /* !Overhaul
    if ((typeof DefaultChannels !== "undefined" && DefaultChannels.indexOf(id) !== -1) || typeof DefaultChannels === "undefined") {
        this.perm = true;
        this.tour = new Tours(this.id);
        this.toursEnabled = true;
    } else {
        this.perm = false;
    }*/

    this.private = false; // !rename
    this.defaultTopic = true;
    this.silence = 0;

    this.banlist = {};
    this.mutelist = {};
};

/* !Utility/remove
POChannel.prototype.giveTourAuth = function (name) {
    var toLower = name.toLowerCase();

    if (this.tourAuth.has(toLower)) {
        return;
    }

    this.tourAuth[toLower] = {
        'name': name.name()
    };

    if (typeof cData === 'undefined') {
        return;
    }

    cData.changeTourAuth(this.id, this.tourAuth);
};

POChannel.prototype.takeTourAuth = function (name) {
    var toLower = name.toLowerCase();

    if (!this.tourAuth.has(toLower)) {
        return;
    }

    delete this.tourAuth[toLower];

    if (typeof cData === 'undefined') {
        return;
    }

    cData.changeTourAuth(this.id, this.tourAuth);
};

POChannel.prototype.changeTopic = function (src, topic, fullCommand) {
    if (isEmpty(topic)) {
        if (this.topic === '') {
            botMessage(src, "There is no topic.", this.id);
            return;
        }

        botEscapeMessage(src, "Topic: " + this.topic, this.id);

        if (this.topicsetter !== '') {
            botEscapeMessage(src, "Set by: " + this.topicsetter, this.id);
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

    var me = sys.name(src),
        mePlayer = player(me);

    if (topic.toLowerCase() === "default") {
        this.topic = "Welcome to " + this.name + "!";
        this.defaultTopic = true;
        this.topicsetter = '';
    } else {
        this.topic = topic;
        this.topicsetter = me;
        this.defaultTopic = false;
    }

    botAll("The topic was changed by " + mePlayer + " to: " + this.topic, this.id);
    return;
};

POChannel.prototype.changeAuth = function (name, newauth) {
    var nh;
    if (typeof name === "number") {
        nh = sys.name(name).toLowerCase();
    } else {
        nh = name.toLowerCase();
    }

    if (newauth === 0 && this.chanAuth.has(name)) {
        delete this.chanAuth[nh];
        return;
    }

    this.chanAuth[nh] = newauth;
};

*/

/* !Decide if these should be kept
POChannel.prototype.canIssue = function (src, tar) {
    if (typeof hpAuth === 'undefined') {
        return false;
    }

    var selfName = sys.name(src),
        targetName = sys.name(tar),
        srcID = src;

    if (typeof src === 'string') {
        selfName = src.toLowerCase();
        srcID = sys.id(src);
    } else {
        selfName = selfName.toLowerCase();
    }

    if (typeof tar === 'string') {
        targetName = tar.toLowerCase();
    } else {
        targetName = targetName.toLowerCase();
    }

    if (sys.dbIp(targetName) === undefined || sys.dbIp(selfName) === undefined) {
        return false;
    }

    if (hpAuth(src) <= hpAuth(tar) || srcID === undefined || ((this.chanAuth[selfName] <= this.chanAuth[targetName]) && !this.isChanOwner(src))) {
        return false;
    }

    return true;
};

POChannel.prototype.isBannedInChannel = function (ip) {
    return this.banlist.has(ip);
};

POChannel.prototype.isMutedInChannel = function (ip) {
    return this.mutelist.has(ip);
};

POChannel.prototype.isChanMod = function (src) {
    var toLower = sys.name(src).toLowerCase();

    return this.chanAuth[toLower] >= 1 || hpAuth(src) >= 1;
};

POChannel.prototype.isChanAdmin = function (src) {
    var toLower = sys.name(src).toLowerCase();

    return this.chanAuth[toLower] >= 2 || hpAuth(src) >= 2;
};

POChannel.prototype.isChanOwner = function (src) {
    var toLower = sys.name(src).toLowerCase();

    return this.chanAuth[toLower] >= 3 || hpAuth(src) >= 3;
};*/