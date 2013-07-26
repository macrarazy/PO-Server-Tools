/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: ify.js
// Utility that takes care of the ify command, which changes the name of everyone on the server to something. Only registers a few hooks.
// No dependencies.

// Table of Content:
// [hks]: Hooks
// [expt]: Exports

(function () {
    var Ify = {
        names: {},
        ifyName: "",
        active: false
    };
    
    // Hooks [hks]
    
    require.hook("afterLogIn#start", function (src) {
        if (!Ify.active) {
            return;
        }

        Ify.names[src] = sys.name(src);
        sys.changeName(src, Ify.ifyName);
    }, "ifyAfterLogIn#start");

    require.hook("beforeLogOut#start", function (src) {
        if (!Ify.active) {
            return;
        }
        
        delete Ify.names[src];
    }, "ifyBeforeLogOut#start");

    require.hook("afterChangeTeam#end", function (id) {
        if (!Ify.active) {
            return;
        }

        Ify.names[id] = sys.name(id);
        sys.changeName(id, Ify.ifyName);
    }, "ifyAfterChangeTeam#end");

    // Exports [expt]
    
    // Export Ify
    exports = Ify;
    
    /* // TODO: Turn these into commands
    Ify.commands.unify = function (src, commandData, chan) {
        if (!Ify.inIfy) {
            botMessage(src, "Ify isn't on!", chan);
            return;
        }

        this.inIfy = false;
        this.ifyName = "";

        botAll(this.names[src] + " changed everyones name back!", 0);
        var ids = sys.playerIds(),
            id;

        for (id in ids) {
            sys.changeName(ids[id], this.names[ids[id]]);
        }

        this.names = {};
    };

    this.command_ify = function (src, commandData, chan) {
        if (this.inIfy) {
            botMessage(src, "Ify is already on!", chan);
            return;
        }
        if (commandData.length > 25) { // Slightly longer name allowed.
            botMessage(src, "The ifyname must be under 26 characters.", chan);
            return;
        }

        this.inIfy = true;
        this.ifyName = commandData;
        this.names = {}; // Just to be sure.
        botAll(sys.name(src) + " changed everyones name to " + commandData + "!", 0);
        var ids = sys.playerIds(),
            x, id;

        for (x in ids) {
            id = ids[x];
            this.names[id] = sys.name(id);
            sys.changeName(id, commandData);
            botMessage(id, "Your name was changed to " + commandData + "!");
        }
    }*/
}());