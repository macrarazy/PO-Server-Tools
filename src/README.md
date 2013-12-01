# Source

This contains the source files for the script. Files are processed with `grunt.file.template`, so you can use `<%= %>` for external variables.

## Structure

**banner.jst**: This file is prepended to scripts.js and parsed with `grunt.file.template`.

**bot.js**: Bot/message utilities go here. <br/>
**defines.js**: Global definitions go here. <br/>
**scripts.js**: Events and whatnot go here.

**util/player-util.js**: Player related utilities go here. <br/>
**util/mod-util.js**: Moderation utilities go here. <br/>
**util/util.js**: Misc. utilities go here. <br/>