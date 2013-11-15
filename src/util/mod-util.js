Util.mod = {};

// Kicks a player.
Util.mod.kick = function (id) {
    // They have already been kicked..
    if (!sys.loggedIn(id)) {
        return;
    }
    
    // Silently kick them.
    sys.kick(id);
};

// Kicks all of player's alts.
Util.mod.kickAll = function (playerIp) {
    // Get the IP. This allows us to accept ids, names, and regular ips as well.
    var trueIp = Util.player.ip(playerIp);
    
    // Get all their alts.
    Util.player.ipIds(trueIp).forEach(function (id) {
        Util.mod.kick(id);
    });
};

// Disconnects (kick but allow them to reconnect with their data) a player.
Util.mod.disconnect = function (id) {
    // They have already been disconnected..
    if (!sys.loggedIn(id)) {
        return;
    }
    
    // Silently disconnect them.
    sys.disconnect(id);
};

// Disconnects (kick but allow them to reconnect with their data) all of player's alts.
Util.mod.disconnectAll = function (playerIp) {
    // Get the IP. This allows us to accept ids, names, and regular ips as well.
    var trueIp = Util.player.ip(playerIp);
    
    // Get all their alts.
    Util.player.ipIds(trueIp).forEach(function (id) {
        Util.mod.disconnect(id);
    });
};

// Mutes a player.
// opts is an object with these values:
// ip: The ip to mute.
// by: The player who issued the mute.
// reason: The reason of the mute.
// time: Time the mute lasts in seconds.
Util.mod.mute = function (opts) {
    if (!opts.ip || !opts.ip || typeof opts.time !== 'number') {
        return false;
    }
    
    // add the current time since epoch to the mute, as that is what we use to check if the mute has expired.
    opts.time += +(sys.time());
    
    if (!opts.reason) {
        opts.reason = "";
    }
    
    // ?
    //DataHash.mutes[opts.ip] = opts;
    
    // mute all of [opts.ip]'s names that are currently online.
    // note that we only have to set .muted (this prevents them from talking, until their mute has expired). This value is set after the log back in (because we mute their ip) automatically (if they're still muted), so we don't have to do any mumbo jumbo.
    Util.mod.ipIds(opts.ip).forEach(function (id) {
        JSESSION.users(id).muted = true;
    });
    return true;
};

// Permanently bans a player (and kick them).
// NOTE: This is done quietly.
Util.mod.ban = function (name) {
    // Since there is basically nothing to customise atm, this is simply a small wrapper (though it does kick players under the same alt.)
    sys.ban(name);
    Util.mod.kickAll(sys.ip(name));
};

// Temporarly bans a player.
// NOTE: Time is in minutes.
// NOTE: This is done quietly.
Util.mod.tempBan = function (name, time) {
    // Since there is basically nothing to customise atm (kick is done automatically), this is simply a small wrapper (though it does kick players under the same alt.)
    // Ensure time is an integer.
    time = Math.round(time);
    
    sys.tempBan(name, time);
    Util.mod.kickAll(sys.ip(name));
};

// If a player is banned.
Util.mod.isBanned = function (playerName) {
    // Return their name. This allows us to accept ids as well.
    var trueName = Util.player.name(playerName).toLowerCase(),
        bans = sys.banList();
    
    return bans.indexOf(trueName) !== -1;
};

// Returns the amount of seconds name is temporary banned for.
// This > sys.dbTempBanTime.
// NOTE: Unlike sys.dbTempBanTime, this returns 0 if the player isn't banned.
Util.mod.tempBanTime = function (playerName) {
    // Return their name. This allows us to accept ids as well.
    var trueName = Util.player.name(playerName).toLowerCase();
    
    // If they aren't banned, return 0.
    if (!Util.mod.isBanned(trueName)) {
        return 0;
    }
    
    // Otherwise, return for how long they are banned.
    return sys.dbTempBanTime(trueName);
};