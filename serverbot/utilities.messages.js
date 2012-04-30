LoginMessages = [
                  "Hello %0, welcome to "+servername,
                  "What's up, %0?",
                  "Enjoy your stay at "+servername+", %0!"
              ];

WarnMessages = [
            "%0, please stop %2, or you will be %1!",
            "%0, stop %2, otherwise you will be %1!"

        ];

KickMessages = [
            "%0, you shouldn't have %1!",
            "%0, don't %1!",
            "Bad %0!"

        ];

MuteMessages = KickMessages;

TempBanMessages = [
            "You should leave for a while, %0!",
            "You shouldn't have annoying, %0!"
        ];

BanMessages = [
            "Goodbye, %0. We are done with you.",
            "You aren't welcome anymore, %0!"
        ];

RangeBanMessages = [
            "Don't return, %0. We are completely done with you",
            "You brought this on yourself, %0!"
        ];

_Bot.prototype.randomMessage = function (type) {
    var arr;
    switch(type.toLowerCase()) {
    case "login":
        arr = LoginMessages;
        break;
    case "warn":
    case "warning":
        arr = WarnMessages;
        break;
    case "kick":
        arr = KickMessages;
        break;
    case "mute":
        arr = MuteMessages;
        break;
    case "tempban":
        arr = TempBanMessages;
        break;
    case "ban":
        arr = BanMessages;
        break;
    case "rangeban":
        arr = RangeBanMessages;
        break;
    default:
        return;
    }

    var messages = arr.length
    var randMessage = arr[Math.floor(Math.random()*messages)];

    return randMessage;
}
