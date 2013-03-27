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
                identifier = path.split('.js').pop();
                
            identifier.join('.js');
            
            // delete the cache or quickly get the module
            if (nocache) {
                delete modules[identifier];
            } else if (modules[identifier]) {
                return modules[identifier];
            }
            
            content = sys.getFileContent(path);
            
            if (content === undefined) {
                return {};
            }
            
            // hurr, JSLint.
            require.modules[identifier] = modules[identifier] = eval('(function (exports, identifier) { ' + content + ';return exports; }(({}), "' + identifier + '"))');
            return modules[identifier];
        };
        
        require.modules = modules;
        return require;
    }());
}