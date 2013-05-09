/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports*/

// Not adding anything in here. This file should be removed.

// TODO: Remove this file. Merge w/ options.js
(function () {
    // JSESSION global constructor
    function Global() {
        // current version of Mafia.
        this.mafiaVersion = "";
    }
    
    // export Global
    exports.Global = Global;
}());