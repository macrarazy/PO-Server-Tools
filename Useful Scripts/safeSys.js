safeSys = function () {
    function noop() {}
    return sys || {
        objectName: "safeSys",
        destroyed: noop,
        deleteLater: noop,
        clearTheChat: noop,
        changeScript: noop,
        "import": function () {
            return {};
        },
        sendAll: function (msg) {
            print(msg);
        },
        sendHtmlAll: function (msg) {
            print(msg);
        },
        kick: noop,
        disconnect: noop,
        updatePlayer: noop,
        putInChannel: noop,
        createChannel: noop,
        getAnnouncement: function () {
            return "";
        },
        getColor: function () {
            return "#000000";
        },
        setAnnouncement: noop,
        changeAnnouncement: noop,
        getDescription: function () {
            return "";
        },
        changeDescription: noop,
        makeServerPublic: noop,
        stopEvent: noop,
        shutDown: function () {
            while (1) {
                print("Shutting down");
            }
        },
        sendMessage: noop,
        sendHtmlMessage: noop,
        print: noop,
        clearPass: noop,
        changeAuth: noop,
        changeDbAuth: noop,
        changeAway: noop,
        changeRating: noop,
        changePokeLevel: noop,
        changePokeNum: noop,
        changePokeItem: noop,
        changePokeMove: noop,
        changePokeGender: noop,
        changePokeName: noop,
        changeTier: noop,
        reloadTiers: noop,
        exportMemberDatabase: noop,
        exportTierDatabase: noop,
        updateRatings: noop,
        updateDatabase: noop,
        resetLadder: noop,
        synchronizeTierWithSQL: noop,
        clearChat: noop,
        callLater: function () {
            return -1;
        },
        callQuickly: function () {
            return -1;
        },
        quickCall: function () {
            return -1;
        },
        delayedCall: function () {
            return -1;
        },
        intervalTimer: function () {
            return -1;
        },
        intervalCall: function () {
            return -1;
        },
        stopTimer: function () {
            return false;
        },
        "eval": function (str) {
            eval(str);
        },
        channelIds: function () {
            return [];
        },
        channel: noop,
        channelId: noop,
        channelsOfPlayer: function () {
            return [];
        },
        existChannel: function (id) {
            return id === 0;
        },
        isInChannel: function () {
            return false;
        },
        isInSameChannel: function () {
            return false;
        },
        playerIds: function () {
            return [];
        },
        name: function () {
            return "~Unknown~";
        },
        id: function () {
            return -1;
        },
        auth: function () {
            return 0;
        },
        battling: function () {
            return false;
        },
        away: function () {
            return false;
        },
        ip: function () {
            return undefined;
        },
        proxyIp: function () {
            return undefined;
        },
        hostName: noop,
        gen: function () {
            return 5;
        },
        subgen: function () {
            return 0;
        },
        teamCount: function () {
            return 0;
        },
        generation: function () {
            return "Black/White 2";
        },
        dbAuth: function () {
            return 0;
        },
        dbAuths: function () {
            return [];
        },
        dbAll: function () {
            return [];
        },
        dbIp: function () {
            return undefined;
        },
        dbDelete: noop,
        dbLastOn: function () {
            return "";
        },
        dbExpire: function () {
            return 182;
        },
        dbTempBanTime: function () {
            return 0;
        },
        dbExpiration: function () {
            return 182;
        },
        dbRegistered: function () {
            return false;
        },
        tier: function () {
            return "";
        },
        hasTier: function () {
            return false;
        },
        ranking: function () {
            return 1000;
        },
        ratedBattles: function () {
            return 0;
        },
        maxAuth: function () {
            return 0;
        },
        aliases: function () {
            return [];
        },
        totalPlayersByTier: function () {
            return 0;
        },
        ladderEnabled: function () {
            return false;
        },
        ladderRating: function () {
            return 0;
        },
        memoryDump: function () {
            return "sys not initialized";
        },
        disconnectedPlayers: function () {
            return [];
        },
        hasLegalTeamForTier: function () {
            return false;
        },
        changeName: noop,
        changeInfo: noop,
        info: function () {
            return "";
        },
        changeAvatar: noop,
        avatar: function () {
            return 1;
        },
        pokemon: function () {
            return "MissingNo";
        },
        pokeNum: function () {
            return 0;
        },
        move: function () {
            return "Pound";
        },
        moveNum: function () {
            return 0;
        },
        moveType: function () {
            return "???";
        },
        item: function () {
            return "Potion";
        },
        itemNum: function () {
            return 0;
        },
        nature: function () {
            return "Adamant";
        },
        natureNum: function () {
            return 0;
        },
        ability: function () {
            return "Arena Trap";
        },
        abilityNum: function () {
            return 0;
        },
        genderNum: function () {
            return 0;
        },
        gender: function () {
            return "genderless";
        },
        teamPokeLevel: function () {
            return 100;
        },
        teamPoke: function () {
            return 0;
        },
        hasTeamPoke: function () {
            return false;
        },
        indexOfTeamPoke: function () {
            return -1;
        },
        hasDreamWorldAbility: function () {
            return false;
        },
        compatibleAsDreamWorldEvent: function () {
            return false;
        },
        teamPokeMove: function () {
            return 0;
        },
        hasTeamPokeMove: function () {
            return false;
        },
        indexOfTeamPokeMove: function () {
            return -1;
        },
        hasTeamMove: function () {
            return false;
        },
        teamPokeItem: function () {
            return 0;
        },
        hasTeamItem: function () {
            return false;
        },
        teamPokeNature: function () {
            return 0;
        },
        teamPokeEV: function () {
            return 0;
        },
        teamPokeDV: function () {
            return 0;
        },
        changeTeamPokeDV: noop,
        changeTeamPokeEV: noop,
        numPlayers: function () {
            return 0;
        },
        playersInMemory: function () {
            return 0;
        },
        exists: function () {
            return false;
        },
        loggedIn: function () {
            return false;
        },
        rand: function (min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
        time: function () {
            return String(new Date().getTime() / 1000);
        },
        getTierList: function () {
            return [];
        },
        type: function () {
            return "???";
        },
        typeNum: function () {
            return 17;
        },
        hiddenPowerType: function () {
            return 17;
        },
        getScript: function () {
            return {};
        },
        pokeType1: function () {
            return 17;
        },
        pokeType2: function () {
            return 17;
        },
        banList: function () {
            return [];
        },
        ban: noop,
        tempBan: noop,
        unban: noop,
        prepareWeather: noop,
        weatherNum: function () {
            return 5;
        },
        weather: function () {
            return "Rain";
        },
        teamPokeAbility: function () {
            return 0;
        },
        changePokeAbility: noop,
        pokeAbility: function () {
            return 0;
        },
        changePokeHappiness: noop,
        changePokeShine: noop,
        teamPokeShine: function () {
            return false;
        },
        changePokeNature: noop,
        teamPokeGender: function () {
            return 0;
        },
        teamPokeNick: function () {
            return "Pikachu";
        },
        inflictStatus: noop,
        forceBattle: noop,
        getClauses: function () {
            return 0;
        },
        serverVersion: function () {
            return "2.0.5";
        },
        isServerPrivate: function () {
            return false;
        },
        sendNetworkCommand: noop,
        sha1: function () {
            // TODO: Get code to generate sha1 strings.
            return "";
        },
        md4: function () {
            // TODO: Get code to generate md4 strings.
            return "";
        },
        md5: function () {
            // TODO: Get code to generate md5 strings.
            return "";
        },
        validColor: function () {
            // TODO: Possibly get code to validate this?
            return false;
        },
        hexColor: function () {
            // TODO: Get code to generate hex colors.
            return "#000000";
        },
        saveVal: noop,
        removeVal: noop,
        getVal: function () {
            return "";
        },
        getValKeys: function () {
            return [];
        },
        filesForDirectory: function () {
            return [];
        },
        dirsForDirectory: function () {
            return [];
        },
        appendToFile: noop,
        writeToFile: noop,
        deleteFile: noop,
        getFileContent: function () {
            return undefined;
        },
        webCall: noop,
        synchronousWebCall: function () {
            return "";
        },
        system: noop,
        safeSys: true
    };
};