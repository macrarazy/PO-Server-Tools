# Source

This contains the source files for the script. Files are processed with `grunt.file.template`, so you can use `<%= %>` for external variables.

## Structure

**banner.jst**: This file is prepended to scripts.js and parsed with `grunt.file.template`. <br/>
**bot.js**: Bot/message utilities go here. <br/>
**defines.js**: Global definitions go here. <br/>
**scripts.js**: Events and whatnot go here. <br/>
**util.js**: Utilities go here. <br/>