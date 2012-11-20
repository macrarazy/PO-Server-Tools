Language = new(function() {
    this.languages = {};
    this.defaultLanguage = "English";
    
    this.read = function (fn) {
        var file = sys.getFileContent(fn);
        
        if (!file) {
            return;
        }
        
        this.parse(file.split("\n"), fn);
    };
    
    this.parse = function (data, file) {
        var x, line, lang = {}, key, val;
        for (x in data) {
            line = data[x].trim();
            
            if (line.length < 2) {
                continue; // Empty line
            }
            
            if (line[0] === "#" || line.substr(0, 2) === "//") { // Comments
                continue;
            }
            
            if (line.indexOf("=") === -1) { // Weird line
                print("Warning: Malformed syntax in " + file + " at line " + (x + 1) + " (line was skipped).");
                continue;
            }
            
            key = line.substr(0, line.indexOf("=").trim(), val = line.substr(line.indexOf("=") + 1).trim();
            
            if (val[val.length - 1] === ";") { // Ignore
                val = val.substr(0, val.length - 2);
            }
            
            lang[key] = val;
        }
        
        if (!lang["lang.name"] || !lang["lang.shortname"]) {
            print("Couldn't parse language file (" + file + "): No name.");
            return;
        }
        
        this.languages[lang.name] = lang;
    };
    
    this.get = function (name, ln) {
        var lang = this.languages[name], defaultSet = false;
        
        if (!lang) {
            lang = this.languages[this.defaultLanguage];
            defaultSet = true;
            if (!lang) {
                print("Error: Couldn't find default language: " + this.defaultLanguage);
                return name;
            }
        }
        
        if (!lang[name]) {
            lang = this.languages[this.defaultLanguage];
            defaultSet = true;
            
            if (!lang[name]) {
                print("Error: No translation for " + name + " in " + this.defaultLanguage + " (default language).");
                return name;
            }
        }
        
        return lang[name];
    }
})();