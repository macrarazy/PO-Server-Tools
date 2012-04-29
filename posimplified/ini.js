ini = {
        default_module_name: "Unknown Module",
        auto_file_exists: ['.exe', '.dll', 'scripts.js', 'core.js', 'ini.js'],
        default_rainbow_colorlist:["red","green","blue"],
        default_random_rainbow_colorlist:["red","green","blue"],
        default_remove_spaces_join:'',
        default_cut_join:'',
        default_cut_part_join:'',
        default_rangeip_parts: 2,
        default_callsysfunc_function:'sendAll',
        default_callsysfunc_arguments:['ReferenceError: No argument in PO.callsysfunc.'],
        custom_modules: [

            {
            "name": "Cache",
            "author": "TheUnknownOne",
            "path": "default",
            "file": "cache.js"
            },

            {
            "name": "Recent Messages",
            "author": "TheUnknownOne",
            "path": "default",
            "file": "recentmessages.js"
            },

            {
            "name": "Internet Manager",
            "author": "TheUnknownOne",
            "path": "default",
            "file": "webmanager.js"
            },

            {
            "name": "Encoding",
            "author": "phpjs.org",
            "path": "default",
            "file": "encoding.js"
            },

            {
            "name": "Variable Manager",
            "author": "TheUnknownOne",
            "path": "default",
            "file": "variablemanager.js"
            },

            {
            "name": "Server Commands",
            "author": "TheUnknownOne",
            "path": "default",
            "file": "servercommands.js",
            "loadAfter": ["Cache"]
            },

            {
            "name": "Pokemon Stats",
            "author": "TheUnknownOne",
            "path": "default",
            "file": "pokestats.js"
            },

            {
            "name": "Hook Manager",
            "author": "TheUnknownOne",
            "path": "default",
            "file": "hookmanager.js"
            },

            {
            "name": "Data Processor",
            "author": "TheUnknownOne",
            "path": "default",
            "file": "dataprocessor.js"
            },

            {
            "name": "BBCode",
            "author": "TheUnknownOne",
            "path": "default",
            "file": "bbcode.js"
            }

        ]
        }
