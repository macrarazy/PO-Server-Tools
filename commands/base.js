/**
 * @fileOverview Defines all command list managers/containers
 * @author TheUnknownOne
 * @version 3.0.0 Devel
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
        return "Command Base";
    }
})