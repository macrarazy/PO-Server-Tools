(function setupJSESSION() {
    if (typeof JSESSION !== 'undefined') {
        return;
    }
    
    function noop(){}

    JSESSION = {
        userData: {},
        channelData: {},
        globalData: {},

        userFactory: noop,
        channelFactory: noop,
        globalFactory: noop,

        usesUser: false,
        usesChannel: false,
        usesGlobal: false,

        scriptId: null,
        factory: {} // Used by User, Channel, and Global constructors.
    };
    
    // Note: Refill is automatically called by identifyAsScript
    JSESSION.refill = function refill() {
        var players,
            player,
            channels,
            channel,
            len,
            i;
        
        if (JSESSION.usesUser) {
            players = sys.playerIds();
            for (i = 0, len = players.length; i < len; i += 1) {
                player = players[i];
                if (!JSESSION.hasUser(player)) {
                    JSESSION.createUser(player);
                }
            }
        }
        if (JSESSION.usesChannel) {
            channels = sys.channelIds();
            for (i = 0, len = channels.length; i < len; i += 1) {
                channel = channels[i];
                if (!JSESSION.hasChannel(channel)) {
                    JSESSION.createChannel(channel);
                }
            }
        }
        if (JSESSION.usesGlobal) {
            if (!JSESSION.hasGlobal()) {
                JSESSION.globalData = new (JSESSION.globalFactory)();
            }
        }
    };
    
    JSESSION.users = JSESSION.user = function user(id) {
        if (!JSESSION.usesUser) {
            return;
        }
        
        return JSESSION.userData[id];
    };
    
    JSESSION.channels = JSESSION.channel = function channel(id) {
        if (!JSESSION.usesChannel) {
            return;
        }
        
        return JSESSION.channelData[id];
    };
    
    JSESSION.global = function global() {
        if (!JSESSION.usesGlobal) {
            return;
        }
        
        return JSESSION.globalData;
    };
    
    JSESSION.identifyScriptAs = function (id) {
        if (JSESSION.scriptId !== id) {
            JSESSION.clearAll();
        }
        
        JSESSION.scriptId = id;
        JSESSION.refill();
    };
    
    // These must all be constructors.
    JSESSION.registerUserFactory = function (Factory) {
        JSESSION.userFactory = Factory;
        JSESSION.usesUser = true;
    };
    
    JSESSION.registerChannelFactory = function (Factory) {
        JSESSION.channelFactory = Factory;
        JSESSION.usesChannel = true;
    };
    
    JSESSION.registerGlobalFactory = function (Factory) {
        JSESSION.globalFactory = Factory;
        JSESSION.usesGlobal = true;
        JSESSION.globalData = new Factory();
    };
    
    JSESSION.createUser = function (id) {
        if (!JSESSION.usesUser || typeof JSESSION.userData[id] !== 'undefined') {
            return false;
        }
        
        JSESSION.userData[id] = new (JSESSION.userFactory)(id);
        return true;
    };
    JSESSION.destroyUser = function (id) {
        if (!JSESSION.usesUser || typeof JSESSION.userData[id] === 'undefined') {
            return false;
        }
        
        delete JSESSION.userData[id];
        return true;
    };
    JSESSION.hasUser = function (id) {
        return JSESSION.userData.hasOwnProperty(id);
    };
    
    JSESSION.createChannel = function (id) {
        if (!JSESSION.usesChannel || typeof JSESSION.channelData[id] !== 'undefined') {
            return false;
        }
        
        JSESSION.channelData[id] = new (JSESSION.channelFactory)(id);
        return true;
    };
    JSESSION.destroyChannel = function (id) {
        if (!JSESSION.usesChannel || typeof JSESSION.channelData[id] === 'undefined') {
            return false;
        }
        
        delete JSESSION.channelData[id];
        return true;
    };
    JSESSION.hasChannel = function (id) {
        return JSESSION.channelData.hasOwnProperty(id);
    };

    JSESSION.hasGlobal = function () {
        return Object.keys(JSESSION.globalData).length === 0;
    };
    
    JSESSION.clearAll = function () {
        JSESSION.userData = {};
        JSESSION.channelData = {};
        JSESSION.globalData = {};
        
        JSESSION.userFactory = noop;
        JSESSION.channelFactory = noop;
        JSESSION.globalFactory = noop;
        
        JSESSION.usesUser = false;
        JSESSION.usesChannel = false;
        JSESSION.usesGlobal = false;
        
        JSESSION.scriptId = null;
    };
}());