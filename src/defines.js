var Script,
    Factory,
    Util,
    Bot,
    Tours,
    Commands,
    Style,
    Template;

Script = {
    version: "<%= script.version %>",
    url: "<%= script.url %>",
    bot: {
        name: "<%= script.default.bot.name %>",
        color: "<%= script.default.bot.color %>"
    },
    poScript: (typeof Script !== 'undefined' ? Script.poScript : {})
};

/*
var Config = {
    Mafia: {
        norepeat: 3,
        stats_file: "MafiaStats.txt",
        max_name_length: 16
    },

    DWAbilityCheck: true,
    AutoChannelJoin: true,
    WelcomeMessages: false,
    FixChallenges: false,
    NoCrash: false,
    AdminsCanAuth: true,

    HighPermission: {
        "This gives Administrator Auth to a Moderator.": [1, 2],
        "Don't forget the commas and colons.": [1, 2]
    }
};

var IP_Resolve_URL = "http://ip2country.sourceforge.net/ip2c.php?ip=%1";*/