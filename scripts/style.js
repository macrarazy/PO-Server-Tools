/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, Qt, print, gc, version,
    Config: true, require: false, module: true, exports: true*/

// File: style.js
// Styles for templates, (command) lists, and various other stuff.
// Depends on: cache

// Table of Content:
// [smgr]: Style manager
// [expt]: Exports

(function () {
    var Utils = require('utils'),
        Cache = require('cache');
    
    // TODO: Change the default styles to something more original.
    var defaultStyles = [
        {
            "name": "default",
            "author": "Lutra",
            "header": "<font color=cornflowerblue><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>",
            "footer": "<br/><timestamp/><br/><font color=cornflowerblue><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>",
            "pre-command": "",
            "command-icon": "\u2022 ",
            "command-style": ["<b>", "</b>"],
            "command-color": "green",
            "help": "<b><font color='orangered'>The following commands need to be entered into a channel's main chat:</font></b>",
            "span": "<br><font size=5><B>{{Name}}</b></font>"
        },
        {
            "name": "Solid",
            "author": "TheUnknownOne",
            "header": "<hr/><br/>",
            "footer": "<br/><hr/>",
            "pre-command": "",
            "command-icon": "/",
            "command-style": ["<b>", "</b>"],
            "command-color": "midnightblue",
            "help": "Enter the following commands into a channel of choice:",
            "span": "<font size=5><b>{{Name}}</b></font>"
        },
        {
            "name": "PO",
            "author": "TheUnknownOne",
            "header": "",
            "footer": "",
            "pre-command": "<font color='mediumseagreen'><timestamp/></font>",
            "command-icon": "/",
            "command-style": ["<b>", "</b>"],
            "command-color": "mediumseagreen",
            "help": "",
            "span": "<font color=magenta><timestamp/> *** {{Name}} ***</font>"
        },
        {
            "name": "New Age",
            "author": "TheUnknownOne",
            "header": "<br/><b><font color='darkred'>/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/</font></b><br/>",
            "footer": "<br/><b><font color='darkred'>/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/</font></b><br/>",
            "pre-command": "<font color=darkred><timestamp/>",
            "command-icon": "/",
            "command-style": ["<b>", "</b></font>"],
            "command-color": "darkred",
            "help": "<",
            "span": "<font size=5 color='darkred'><b>{{Name}}</b></font>"
        }
    ];
    
    var Style = {
        style: {}
    };
    
    // [smgr] Style manager
    // This manages loading styles, as well as setting the current one.
    Style.manager = (function () {
        var styles = {},
            activeStyleName = Cache.get("activeStyle");
        
        /// API ///
        function loadStyle(object) {
            if (!object || !object.name) {
                Utils.panic("style.js", "Style.manager.loadStyle", "Couldn't add style: no name.", object, Utils.panic.warning);
                return;
            }
            
            styles[object.name] = object;
        }
        
        function loadStyleFromFile(fileName) {
            var fileContent = sys.getFileContent(fileName),
                object;
            
            if (!fileContent) {
                Utils.panic("style.js", "Style.manager.loadStyleFromFile", "Couldn't read file '" + fileName + "'.", null, Utils.panic.warning);
                return;
            }
            
            try {
                object = JSON.parse(fileContent);
            } catch (error) {
                Utils.panic("style.js", "Style.manager.loadStyleFromFile", "Couldn't parse style.", error, Utils.panic.warning);
                return;
            }
            
            if (!object || !object.name) {
                Utils.panic("style.js", "Style.manager.loadStyleFromFile", "Couldn't add style: no name.", object, Utils.panic.warning);
                return;
            }
            
            styles[object.name] = object;
        }
        
        function changeStyle(style) {
            if (!styles[style]) {
                Utils.panic("style.js", "Style.manager.changeStyle", "Couldn't change style to '" + style + "': doesn't exist.", styles, Utils.panic.warning);
                return;
            }
            
            Cache.write("activeStyle", style);
            Style.style = styles[style];
        }
        
        function activeStyle() {
            return Cache.get("activeStyle");
        }
        
        /// Load default styles ///
        defaultStyles.forEach(function (style) {
            loadStyle(style);
        });
        
        Style.style = styles[activeStyleName];
        
        if (!Style.style) {
            Utils.panic("style.js", "Style.manager<anonymous function>", "Couldn't set active style to '" + activeStyleName + "': style doesn't exist. Changing to default style.", null, Utils.panic.warning);
            
            Style.style = styles["default"];
            if (!Style.style) {
                Utils.panic("style.js", "Style.manager<anonymous function>", "Fatal: Couldn't set active style to '" + activeStyleName + "': style doesn't exist. Changing to default failed.", null, Utils.panic.error);
                return;
            }
        }
        
        /// Export API ///
        return {
            styles: styles,
            loadStyle: loadStyle,
            loadStyleFromFile: loadStyleFromFile,
            changeStyle: changeStyle,
            activeStyle: activeStyle
        };
    }());
    
    /* TODO: Make this a command
        this.styleInfo = function (src, chan) {
            var tt = new Table_Templater("Styles", "green", "3");
            tt.register(["Name", "Author", "Active"], true);

            var m_styles = this.styles,
                x, curr, isActive;
            for (x in m_styles) {
                curr = m_styles[x];

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
    // Export Style.
    exports = Style;
}());