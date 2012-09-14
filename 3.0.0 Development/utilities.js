// Information & Source
({
    Name: function () {
        return "Utilities";
    },
    Version: function () {
        return "3.0.0 Development";
    },
    Hooks: function () {
        return {};
    },
    Commands: function () {
        return {};
    },
    Init: function () { /* Define utilities */
        getFullInfo = function (src, data, channel, additional) {
            var ret = {},
                props, self, totalAuth, x, mcmd, hash = DataHash;

            for (x in hash) {
                ret.insert("$" + x, hash[x]);
            }

            if (typeof src === "number" && sys.loggedIn(src)) {
                self = sys.name(src), totalAuth = hpAuth(src);
                props = {
                    "src": src,
                    "self": self,
                    "selfLower": selfLower,
                    "selfPlayer": player(src),
                    "user": JSESSION.users(src),
                    "auth": totalAuth,
                    "isHost": isHost()
                };

                for (x in props) {
                    ret.insert(x, props[x]);
                }
            }

            if (typeof data === "string") {
                mcmd = data.split(":");
                props = {
                    "data": data,
                    "dataLower": data.toLowerCase(),
                    "mcmd": mcmd,
                    "tar": sys.id(mcmd[0]),
                    "tarName": sys.name(tar),
                    "tarLower": tarName.toLowerCase(),
                    "tarPlayer": player(tar),
                    "target": JSESSION.users(tar),
                    "ip": sys.dbIp(mcmd[0]),
                }

                for (x in props) {
                    ret.insert(x, props[x]);
                }
            }

            if (typeof chan === "number" && sys.channel(chan) !== undefined) {
                props = {
                    "chan": chan,
                    "channel": JSESSION.channels(chan),

                    "sendMessage": function (message) {
                        botMessage(src, message, chan);
                    },
                    "sendAll": function (message) {
                        botAll(message, chan);
                    },
                    "sendOthers": function (message) {
                        botAllExcept(src, message, chan, botAllExcept.Normal);
                    },

                    "sendWhite": function () {
                        sys.sendMessage(src, "", chan);
                    },
                    "sendWhiteAll": function () {
                        sys.sendAll("", chan);
                    },
                };

                for (x in props) {
                    ret.insert(x, props[x]);
                }
            }

            if (typeof additional === "object" && !Array.isArray(additional) && additional !== null) {
                for (x in additional) {
                    ret.insert(x, additional[x]);
                }
            }

            props = {
                "escape": html_escape,


                "sendMain": function (message) {
                    botAll(message, 0);
                },

                nativeSend: sys.sendAll,
                nativeHtml: sys.sendHtmlAll
            };

            for (x in props) {
                ret.insert(x, props[x]);
            }

            return ret;
        }
    }
})