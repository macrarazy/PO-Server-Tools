# TheUnknownOne's Server Tools
***

## scripts.js
### Version: 2.2.60  

**Report bugs/post suggestions/ideas in Issues**

It has many useful features for you and your community. Ranging from an easy changable league, to custom ability bans, private channels, and even triple elimination tournaments!
All made beautiful with a simple, yet powerful templating system that is customizable with styles.  
***

**Coding Style**
- Formatter: https://chrome.google.com/webstore/detail/pnldlbhphmlbhgjbbjojpidlemceicco (Google Chrome): Use default settings
- 4 spaces for indent (use formatter)
- Prefer "var foo, bar;" over "var foo; var bar;"
- Prefer "'10' * 1;" over "parseInt('10', 10);"
- NO registry values (use cache or playercache (names, etc.) depending on what you're doing), SESSION (use JSESSION), or sys.system (only when necessary, please include in commit description).
- "var x; for (x in foo) {}" preferred over "for (var x in foo) {}"
- "var x; for (x in foo) {}" preferred over "var x = 0, len = foo.length; for (; len < x; x++) {}" (for Arrays)
- Always add curly braces and semicolons.
- Only do prototypes when needed / best option (such as with Tours, for now)
- Use as much available functions as possible - including custom Corexxx.protoype function ("".contains() instead of "".indexOf() > -1)
- Do .contains for Strings, .has for other types.
- Prefer .isEmpty() over isEmpty() and "".length === 0| [].length === 0 | {}.length() === 0; 
- No ternary operators allowed, ever.
- No switches allowed, ever.  
  
**There are more rules than just that (reading the code helps most), but those are the basics!**