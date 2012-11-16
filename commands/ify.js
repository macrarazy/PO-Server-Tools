/*
Dependencies:
    - modules/utilities.js
    - modules/jsession.js
 */

/**
 * @fileOverview Name-ify module
 * @author TheUnknownOne
 * @version 3.0.0 Devel
 */

({
    /**
     * Returns the name of this module
     * @private
     * @return {String} Commands - Ify
     */
    Name: function () {
        return "Commands - Ify";
    },
    /**
     * Returns the hooks of this module
     * @private
     * @return {Object}
     */
    Hooks: function () {
        return {
            afterChangeTeam: function (id) {
                if (!!Settings.IfyName) {
                    sys.changeName(id, Settings.IfyName);
                }
            },
            changeName: function () {
                return !!Settings.IfyName;
            }
        };
    },
    /**
     * Returns the commands of this module
     * @private
     * @return {Array}
     */
    Commands: function () {
        return [
            {
                name: "ify",
                category: "2",
                help: [
                    "{Template::String Name}",
                    "Turns global server name-ify on and uses {Template::String Name} as name."
                ],
                allowedWhenMuted: false,
                handler: function (command) {
                    var ids = sys.playerIds(),
                        x,
                        id,
                        data = command.data;

                    if (!!Settings.IfyName) {
                        command.send("Ify is already on!");
                        return;
                    }
                    if (data.length > 25) { // Slightly longer name allowed.
                        command.send("The ify-name must be under 26 characters.");
                        return;
                    }

                    Settings.IfyName = data;

                    command.sendMain(command.self.player + " changed the name of everyone on the server to " + data + "!");

                    for (x in ids) {
                        id = ids[x];

                        sys.changeName(id, data);
                        bot.send(id, "Your name was changed to " + data + "!");
                    }
                }
            },
            {
                name: "unify",
                category: "2",
                help: ["Turns global server name-ify off and restores the name of everyone."],
                allowedWhenMuted: false,
                handler: function (command) {
                    var ids = sys.playerIds(),
                        id,
                        current;

                    if (!Settings.IfyName) {
                        command.send("Ify isn't on!");
                        return;
                    }

                    Settings.IfyName = false;

                    command.sendMain(command.self.jsession.originalName + " changed all names back!");

                    for (id in ids) {
                        current = ids[id];
                        sys.changeName(current, JSESSION.users(current).originalName);
                    }
                }
            }
        ];
    }
})