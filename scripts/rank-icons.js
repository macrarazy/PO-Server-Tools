/*jslint continue: true, es5: true, evil: true, forin: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script: true, Qt, print, gc, version,
    global: false, GLOBAL: false, require: false, Config: true, Script: true, module: true, exports: true*/

// File: rank-icons.js
// Fully optional icons used to showcase a player's authority level in chat.
// Depends on: cache, utils

// Table of Content:
// [smgr]: Icon manager
// [expt]: Exports

(function () {
    var Cache = require('cache').cache,
        Utils = require('utils');
    
    // TODO: Change the default rank icons to something more original.
    // NOTE: Rank icon packs from v2 are unsupported.
    var defaultIcons = [
        {
            "name": "default",
            "author": "Astruvis",
            "user": "@",
            "mod": "+",
            "admin": "~",
            "owner": "\u2248"
        },
        {
            "name": "Pokémon Online",
            "author": "TheUnknownOne",
            "user": "",
            "mod": "</b>+<i><b>",
            "admin": "</b>+<i><b>",
            "owner": "</b>+<i><b>"
        },
        {
            "name": "PO Advanced",
            "author": "TheUnknownOne",
            "user": "",
            "mod": "</b>\xBB<i><b>",
            "admin": "</b>\xBB<i><b>",
            "owner": "</b>\xBB<i><b>"
        },
        {
            "name": "Pokeballs",
            "author": "TheUnknownOne",
            "user": "<img src='Themes/Classic/Client/uAvailable.png' width='15'>",
            "mod": "<img src='Themes/Classic/Client/mAvailable.png' width='15'>",
            "admin": "<img src='Themes/Classic/Client/aAvailable.png' width='15'>",
            "owner": "<img src='Themes/Classic/Client/oAvailable.png' width='15'>"
        },
        {
            "name": "IRC",
            "author": "TheUnknownOne",
            "user": "",
            "mod": "@",
            "admin": "%",
            "owner": "~"
        }
    ];
    
    var RankIcons = {
        icons: {}
    };
    
    // [smgr] Icon manager
    // This manages loading rank icons, as well as setting the current one.
    RankIcons.manager = (function () {
        var icons = {},
            activeIconsName = Cache.get("activeIcons");
        
        /// API ///
        function loadIcons(object) {
            if (!object || !object.name) {
                Utils.panic("rankicons.js", "RankIcons.manager.loadIcons", "Couldn't add icons: no name.", object, Utils.panic.warning);
                return;
            }
            
            icons[object.name] = object;
        }
        
        function loadIconsFromFile(fileName) {
            var fileContent = sys.getFileContent(fileName),
                object;
            
            if (!fileContent) {
                Utils.panic("rankicons.js", "RankIcons.manager.loadIconsFromFile", "Couldn't read file '" + fileName + "'.", null, Utils.panic.warning);
                return false;
            }
            
            try {
                object = JSON.parse(fileContent);
            } catch (error) {
                Utils.panic("rankicons.js", "RankIcons.manager.loadIconsFromFile", "Couldn't parse icons.", error, Utils.panic.warning);
                return false;
            }
            
            if (!object || !object.name) {
                Utils.panic("rankicons.js", "RankIcons.manager.loadIconsFromFile", "Couldn't add icons: no name.", object, Utils.panic.warning);
                return false;
            }
            
            icons[object.name] = object;
        }
        
        function changeIcons(iconPack) {
            if (!icons[iconPack]) {
                Utils.panic("rankicons.js", "RankIcons.manager.changeIcons", "Couldn't change icons to '" + iconPack + "': doesn't exist.", icons, Utils.panic.warning);
                return;
            }
            
            Cache.write("activeIcons", iconPack);
            RankIcons.icons = icons[iconPack];
        }
        
        function getIcon(authLevel) {
            var icons = RankIcons.icons;
            
            if (authLevel === 3) {
                return icons.owner;
            } else if (authLevel === 2) {
                return icons.admin;
            } else if (authLevel === 1) {
                return icons.mod;
            } else if (authLevel <= 0 || authLevel >= 4) {
                return icons.user;
            }
            
            return icons.user;
        }
        
        function activeIcons() {
            return Cache.get("activeIcons");
        }
        
        /// Load default icon packs ///
        defaultIcons.forEach(function (icons) {
            loadIcons(icons);
        });
        
        RankIcons.icons = icons[activeIconsName];
        
        if (!RankIcons.icons) {
            Utils.panic("rankicons.js", "RankIcons.manager<anonymous function>", "Couldn't set active icon pack to '" + activeIconsName + "': icons don't exist. Changing to default icons.", null, Utils.panic.warning);
            
            RankIcons.icons = icons["default"];
            if (!RankIcons.icons) {
                Utils.panic("rankicons.js", "RankIcons.manager<anonymous function>", "Fatal: Couldn't set active icon pack to '" + activeIconsName + "': icons don't exist. Changing to default failed.", null, Utils.panic.error);
                return;
            }
        }
        
        /// Export API ///
        return {
            icons: icons,
            loadIcons: loadIcons,
            loadIconsFromFile: loadIconsFromFile,
            changeIcons: changeIcons,
            getIcon: getIcon,
            activeIcons: activeIcons
        };
    }());
    
    /* TODO: Make this a command
        this.iconInfo = function (src, chan) {
            var tt = new Table_Templater("Rank Icons", "green", "3");
            tt.register(["Name", "Author", "Active"], true);

            var m_icons = this.icons,
                x, curr, isActive;
            for (x in m_icons) {
                curr = m_icons[x];

                if (curr.active) {
                    isActive = "yes";
                } else {
                    isActive = "no";
                }

                tt.register([curr.name, curr.author, isActive]);
            }


            tt.render(src, chan);
        } */
    
    // [expt] Exports
    // Export RankIcons.
    module.exports = RankIcons;
}());