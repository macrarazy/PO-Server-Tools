/* Documentation:

  Hooks are pieces of code that are run at certain points which are useful for modifications and some other things.
  They can also be very useful for PO Simplified itself!

  Creating hook categories:
  safeCategory(category, shouldSaveCache)

  Creating hooks:
  createHook(catname, hookname, hookfunction, shouldOverwriteIfAlreadyExist)

  running hooks:
  runHook(category, hook)

  getting all hooks for category:
  getHooksForCategory(category)

  getting all hooks:
  getAllHooks()

  getting hook function:
  getHook(category, hook)

  delete hook:
  deleteHook(category, hook)

  delete category (cannot delete category ungrouped):
  deleteCategory(category, (OPTIONAL) copyHooksToThisCategory)

  Hook Useage Example:
  // {command stuff here}
  POHookManager.runHook("commands", "commandRunProcess", [command, commandData]);
  if(command == "me") {
  POHookManager.runHook("commands", "commandStartMe", [src, commandData]);
  sys.sendAll("*** "+sys.name(src)+" "+commandData);
  POHookManager.runHook("command", "commandEndMe", [src, commandData]);
  return;
  }

  // { late in beforechatmessage }
  var f = sys.channelId("Fun");
  if(channel == f) {
  var fhooks = POHookManager.getHooksForCategory("funChannel");
  for(var x in fhooks) {
  message = POHookManager.runHook("funChannel", fhooks[x], [src, message]);
  }
  }

  // {init function}
  var boldMessage_HOOK = function (src, message) {
  message = message.bold();
  return message;
  }

  POHookManager.createHook("funChannel", "boldMessage", boldMessage_HOOK);
*/

_POHookManager = function (table) {
    this.hooks = {"ungrouped": {}};
    this.cacheH = POCache;

    if(typeof table == "string"
            || table == "")
        this.table = "POHookManager_hooks";
    else
        this.table = table;

    this.cacheH.makeS(this.table, JSON.stringify(this.hooks));
        try {
            this.hooks = JSON.parse(this.cacheH.read(this.table));
        }
        catch(e) {
            this.hooks = {"ungrouped": {}};
            this.cacheH.removeS(this.table);
            print("POHookManager: Could not get hooks from cache. Removed table and changed hooks to default. Error Data: "+e);
        }

}

_POHookManager.prototype.safeCategory = function (cat, iSave) {
    if(typeof this.hooks[cat] == "undefined") {
        this.hooks[cat] = {};
        this.saveAll(iSave);
    }
}

_POHookManager.prototype.createHook = function (hookcat, hookname, hookfunc, _overwrite) {
    if(typeof hookcat != "string" || typeof hookname != "string"
            || typeof hookfunc != "function")
        return false;

    if(hookcat == "")
        hookcat = "ungrouped";

    this.safeCategory(hookcat, true);

    if(hookname == "")
        hookname = "unknownhook"+POObject.length(this.hooks[hookcat]);

    if(typeof this.hooks[hookcat][hookname] != "undefined" && !_overwrite) {
        this.saveAll();
        return;
    }

    this.hooks[hookcat][hookname] = hookfunc;
    this.saveAll();
}

_POHookManager.prototype.runHook = function (category, hook, args) {
    if(typeof args != "object" || !args instanceof Array)
        args = [];
    var get = this.getHook(category, hook);
    if(get == undefined)
        return "Hook Runtime Error: Hook not found.";

    try {
        get.apply(get, args);
    }
    catch(e) {
        return "Hook Runtime Error: "+e;
    }

    return true;

}

_POHookManager.prototype.getHooksForCategory = function (category) {
    if(typeof this.hooks[category] == "undefined")
        return [];

    var ret = [], x, cat = this.hooks[category];

    for(x in cat) {
        ret.push(cat[x]);
    }

    return ret;
}

_POHookManager.prototype.getAllHooks = function () {
    var h = this.hooks, x, z, y, hooks = {};
    for(x in h) {
        y = h[x];
        for(z in y) {
            hooks[y[z]] = x;
        }
    }
    return hooks;
}

_POHookManager.prototype.getHook = function (category, hook) {
    if(typeof this.hooks[category][hook] == "undefined")
        return undefined;
    return this.hooks[category][hook];
}

_POHookManager.prototype.deleteHook = function (category, hook) {
    delete this.hooks[category][hook];
    this.saveAll();
}

_POHookManager.prototype.deleteCategory = function(category, _hookMoveCategory) {
    if(category == "ungrouped")
        return false;

    if(typeof _hookMoveCategory != "string"
            || typeof this.hooks[hookMoveCategory] == "undefined")
    delete this.hooks[category];
    else {
        var x, xname, newcat = this.hooks[_hookMoveCategory], nowcat = this.hooks[category];
        if(typeof newcat == "undefined")
            return false;
        for(x in nowcat) {
            xname = x;
            if(typeof newcat[x] != "undefined")
                xname = "delete"+category+"copy"+x;
            newcat[x] = nowcat[x];
        }
        delete this.hooks[category];
    }
}

_POHookManager.prototype.prototype.saveAll = function (iSave) {
    if(!iSave)
        this.cacheH.storeS(this.table, JSON.stringify(this.hooks));
    else
        this.cacheH.store(this.table, JSON.stringify(this.hooks));

}

POHookManager = new _POHookManager();
