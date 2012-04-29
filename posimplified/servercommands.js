/* Documentation:


  Run command (validation automatic):
  if(POServerCommandHandler.runCommand((string)message))
     sys.stopEvent();
  in beforeNewMessage

  Create Commands:
  createCommand(string name, function func)

  Delete Commands:
  deleteCommand(string name);

  Change Commands:
  changeCommand(string name, function func)

  Copy Command (for alternative command names):
  copyCommand(string name, string secondName);

  Mass CMD Creation:
  var x, commandNames = cmdN, commandsToCreateArray = cmdCreaAr, current; // cmdCreaAr should be an array of functions
  for(x in commandsToCreateArray) {
  current = commandsToCreateArray[x];
  if(POServerCommandHandler.createCommand(commandNames[x], current))
    print(commandNames[x]+" created!");
    // print = optional
  }

  Command should be:
  - contain arguments: CMDString, CMDArray, TargetID.
  - CMDString: server cmd data string.
  - CMDArray: same as cmdstring, but with ":" splitted into an array. [0] always exists.
  - TargetID: id of CMDArray[0]. can be undefined.
  Arguments are optional. They do not have to be entered (they do if you intend to use them).
  They can be renamed.
  Example:

  var command_me = function (commandData) {
  sys.sendAll("*** ~~Server~~ "+commandData);
  }

  var command_eval = function (CMDString) {
  eval(CMDString);
  }

  var command_kick = function (CMDString, CMDArray, TargetID)
  if(sys.name(TargetID) != undefined) {
  sys.kick(TargetID);
  }
  }

  var PSCH = POServerCommandHandler;

  PSCH.createCommand("me", command_me);
  PSCH.createCommand("eval", command_eval);
  PSCH.createCommand("kick", command_kick);
  PSCH.copyCommand("eval", "runcode");
  PSCH.copyCommand("kick", "k");

  CMD Start Creation:
  createCMDStart(string start);
  Deleting them:
  deleteCMDStart(string start);

  start automaticly formatted to string & only uses 1st character.

*/


_POServerCommandHandler = function (cacheTable) {
    this.cacheHandler = POCache;

    if(!cacheTable || typeof cacheTable != "string")
        this.cacheTable = "POServerCommandHandler";
    else
        this.cacheTable = cacheTable;

    this.startTable = this.cacheTable += "_CMDSTARTS";
    this.cacheTable += "_COMMANDS";

    this.cacheHandler.make(this.cacheTable, "{}");
    this.cacheHandler.makeS(this.startTable, "['/', '!', '>']");

    try {
        this.commands = JSON.parse(this.cacheHandler.read(this.cacheTable));
    }
    catch (e) {
        this.commands = {};
        this.cacheHandler.removeS(this.cacheTable);
        print("Error ("+e+") in POServerCommandHandler: Could not read "+this.cacheTable+" in "+this.cacheHandler.toString()+"!");
    }

    this.commandStarts = this.cacheHandler.read(this.startTable);

}
_POServerCommandHandler.prototype.possibleCMDStart = function (start) {
    return this.commandStarts.indexOf(start) != -1;

}

_POServerCommandHandler.prototype.validate = function (data) {
    return message.substring(0, 11) == "~~Server~~: " && this.possibleCMDStart.indexOf(message[12]) != -1;

}

_POServerCommandHandler.prototype.runCommand = function (message) {
    if(!this.validate(message))
        return;

    PO.print(message);
    message = message.substr(13);

    var pos = message.indexOf(' ');
    var command = message.substring(1, pos).toLowerCase();
    var CMDString = "";
    var CMDArray = [];

    if (pos != -1) {
        CMDString = message.substr(pos+1);
        CMDArray = message.split(':');
    }

    var TargetID = sys.id(mcmd[0]) == undefined ? 0 : sys.id(mcmd[0]);
    var commands = this.commands;
    PO.print(message);

    if(this.commandExists(command)) {
        commands[command](CMDString, CMDArray, TargetID);
    }
    else {
        print("The command "+command+" does not seem to exist.");
    }


}

_POServerCommandHandler.prototype.createCommand = function(name, func) {
    if(typeof name != "string")
        return false;
    if(typeof func != "function")
        return false;

    name = name.toLowerCase();

    if(this.commandExists(name))
        return false;

    this.commands[name] = func;
    this.saveCommands();
    return true;
}

_POServerCommandHandler.prototype.deleteCommand = function (name) {
    if(!this.commandExists(name))
        return false;
    else {
        delete this.commands[name];
        this.saveCommands();
        return true;
    }
}

_POServerCommandHandler.prototype.changeCommand = function (name, func) {
    if(typeof name != "string")
        return false;
    if(typeof func != "function")
        return false;

    name = name.toLowerCase();

    if(!this.commandExists(name))
        return false;

    this.commands[name] = func;
    this.saveCommands();
    return true;
}

_POServerCommandHandler.prototype.copyCommand = function (name, secondName) {
    if(typeof name != "string" || typeof secondName != "string")
        return false;

    name = name.toLowerCase();
    secondName = secondName.toLowerCase();

    if(!this.commandExists(name) ||
            this.commandExists(secondName))
        return false;

    this.commands[secondName] = this.commands[name];
    this.saveCommands();
    return true;
}

_POServerCommandHandler.prototype.commandExists = function (name) {
    return name in this.commands;
}

_POServerCommandHandler.prototype.createCMDStart = function(start) {
    start = String(start);
    if(start == "")
        return false;
    start = start[0];
    if(this.possibleCMDStart(start))
        return false;

    this.commandStarts.push(start);
    this.saveStarts();
    return true;
}

_POServerCommandHandler.prototype.deleteCMDStart = function(start) {
    start = String(start);
    if(start == "")
        return false;
    start = start[0];
    if(!this.possibleCMDStart(start))
        return false;

    delete this.commandStarts[this.commandStarts.indexOf(start)];
    this.saveStarts();
    return true;
}

_POServerCommandHandler.prototype.saveCommands = function() {
    this.cacheHandler.storeS(this.cacheTable, JSON.stringify(this.commands));
}

_POServerCommandHandler.prototype.saveStarts = function () {
    this.cacheHandler.storeS(this.startTable, this.commandStarts);
}

POServerCommandHandler = new _POServerCommandHandler();
