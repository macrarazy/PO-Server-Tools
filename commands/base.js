/**
 * @fileOverview Defines all command list managers/containers
 * @author TheUnknownOne
 * @version 3.0.0 Devel 1
 */

Commands.Lists
    .user = new handlers.commandList()
    .mod = new handlers.commandList()
    .admin = new handlers.commandList()
    .owner = new handlers.commandList()
    .host = new handlers.commandList();

({
    /**
     * Returns the name of this module
     * @private
     * @return {String}
     */
    Name: function () {
        return "Commands Base";
    },
    /**
     * Returns the commands of this module
     * @private
     * @return {Array}
     */
        // TODO: Implement custom Auth Names.
    Commands: function () {
        return [
            {
                name: "commands",
                handler: function (command) {
                    var commands = ["usercommands"],
                        auth = command.self.auth;

                    if (auth === 1) {
                        commands.push("modcommands");
                    }
                    if (auth === 2) {
                        commands.push("admincommands");
                    }
                    if (auth === 3) {
                        commands.push("ownercommands");
                    }
                    if (command.self.host) {
                        commands.push("hostcommands");
                    }

                    new Templates.command("Commands")
                        .listCommands(commands)
                        .render(command.src, command.chan);
                }
            },
            {
                name: "usercommands",
                help: ["To view the <b>user</b> commands"],
                handler: function (command) {
                    new Templates.command("User Commands")
                        .listCommands(Commands.Lists.user.commands)
                        .render(command.src, command.chan);
                }
            },
            {
                name: "modcommands",
                help: ["To view the <b>moderator</b> commands"],
                handler: function (command) {
                    new Templates.command("Moderator Commands")
                        .listCommands(Commands.Lists.mod.commands)
                        .render(command.src, command.chan);
                }
            },
            {
                name: "admincommands",
                help: ["To view the <b>administrator</b> commands"],
                handler: function (command) {
                    new Templates.command("Administrator Commands")
                        .listCommands(Commands.Lists.admin.commands)
                        .render(command.src, command.chan);
                }
            },
            {
                name: "ownercommands",
                help: ["To view the <b>owner</b> commands"],
                handler: function (command) {
                    new Templates.command("Owner Commands")
                        .listCommands(Commands.Lists.owner.commands)
                        .render(command.src, command.chan);
                }
            },
            {
                name: "hostcommands",
                help: ["To view the <b>host</b> commands"],
                handler: function (command) {
                    new Templates.command("Host Commands")
                        .listCommands(Commands.Lists.host.commands)
                        .render(command.src, command.chan);
                }
            }
        ];
    }
})