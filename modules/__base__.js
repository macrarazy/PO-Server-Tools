/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, undef: true, vars: true*/
/*global sys*/
var require;

if (typeof require === 'undefined') {
    // includes a script
    require = (function () {
        var modules = {}, // modules cache
            require; // require function, see below.
        
        // path: path to the file, no .js
        // nocache: if the cache for the file should be deleted
        require = function (path, nocache) {
            var content,
                identifier = path.split('.js').pop(),
                module = {exports: {}, path: path},
                exports = module.exports;
                
            identifier.join('.js');
            
            // delete the cache or quickly get the module
            if (require.modules[identifier]) {
                return require.modules[identifier];
            }
            
            content = sys.getFileContent(path);
            
            if (content === undefined) {
                return {};
            }
            
            with (module) {
                try {
                    eval(content);
                } catch (e) {
                    print("Couldn't load module " + identifier + " (" + path + "): " + e.toString() + " on line " + e.lineNumber);
                }
            }
            
            return require.modules[identifier];
        };
        
        require.modules = require.modules || {};
        return require;
    }());
}