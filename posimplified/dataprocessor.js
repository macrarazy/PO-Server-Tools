/* Documentation

  Replace instances if required.

  Getting data:
  "/'+PODataProcessor+"/'
  or
  PODataProcessor.toString()

  Returning user data:
  users(id)

  Returning channel data:
  channels(id)

  Returning global data:
  global(id)

  Call
  createUser(id):

  in beforeChannelJoined or in beforeLogIn:
  if(PODataProcessor.users(src) == undefined)
  PODataProcessor.createUser(src);

  Call
  createChannel(id)

  in beforeChannelCreated:
  PODataProcessor.createChannel(id);

  Call
  deleteUser(id)

  in beforeLogOut:
  PODataProcessor.deleteUser(src);

  Call
  deleteChannel(id)

  in beforeChannelDestoryed:
  PODataProcessor.deleteChannel(id);

  Creating the Data Processor (example):

  function DataUser (id) {
  this.blabla = id; // id
  // etc
  }

  function DataChannel (id) {
  this.blabla = id; // id
  // etc
  }

  function DataGlobal () {
  this.ScriptFile = "script.js";
  // etc
  }

  PODataProcessor.identifyScriptAs("script name here.");
  PODataProcessor.registerUser(DataUser);
  PODataProcessor.registerChannel(DataChannel);
  PODataProcessor.registerGlobal(DataGlobal);
  PODataProcessor.refill();

*/

_PODataProcessor = function () {
    this.UserData = {};
    this.ChannelData = {};
    this.GlobalData = {};

    this.UserFunc = function () {}
    this.ChannelFunc = function () {}
    this.GlobalFunc = function () {}

    this.UsesUser = false;
    this.UsesChannel = false;
    this.UsesGlobal = false;

    this.ScriptID = undefined;
}

_PODataProcessor.prototype.toString = function() {
    var str = "Data Processor Information\r\n";
    if(this.UsesUser)
        str += " Uses User; User contains "+objLength(this.UserData)+" values;"
    if(this.UsesChannel)
        str += " Uses Channel; Channel contains "+objLength(this.ChannelData)+" values;"
    if(this.UsesGlobal)
        str += " Uses Global;"
    if(this.ScriptID != undefined)
        str += " Has Script ID";

    return str;
}

_PODataProcessor.prototype.refill = function () {

    var x, users = sys.playerIds(), channels = sys.channelIds();
    if(this.UsesUser) {
        for(x in users) {
            this.createUser(users[x]);
        }
    }

    if(this.UsesChannel) {
        for(x in channels) {
            this.createChannel(channels[x]);
        }
    }
}

_PODataProcessor.prototype.users = function (id) {
    if(!this.UsesUser)
        return undefined;
    return this.UserData[id];
}

_PODataProcessor.prototype.channels = function (id) {
    if(!this.UsesChannel)
        return undefined;
    return this.ChannelData[id];
}

_PODataProcessor.prototype.global = function () {
    if(!this.UsesGlobal)
        return undefined;
    return this.GlobalData;
}

_PODataProcessor.prototype.identifyScriptAs = function (script) {
    if(this.ScriptID == undefined || this.ScriptID != script) {
        this.clearAll();
    }
    this.ScriptID = script;
}

_PODataProcessor.prototype.registerUser = function (func) {
    if(typeof func != "function")
        return;

    this.UserFunc = func;
    this.UsesUser = true;
}

_PODataProcessor.prototype.registerChannel = function(func) {
    if(typeof func != "function")
        return;

    this.ChannelFunc = func;
    this.UsesChannel = true;
    this.createChannel(0);
}

_PODataProcessor.prototype.registerGlobal = function(func) {
    if(typeof func != "function")
        return;

    this.GlobalFunc = func;
    this.UsesGlobal = true;
    this.GlobalData = new func();
}

_PODataProcessor.prototype.createChannel = function (id) {
    if(!this.UsesChannel)
        return false;

    if(typeof this.ChannelData[id] != "undefined")
        return false;

    if(sys.channel(id) == undefined)
        return false;

    this.ChannelData[id] = new this.ChannelFunc(id);
    return true;
}

_PODataProcessor.prototype.destoryChannel = function (id) {
    if(!this.UsesChannel)
        return false;
    if(id == 0)
        return false;

    if(typeof this.ChannelData[id] == "undefined")
        return false;

    delete this.ChannelData[id];
    return true;
}

_PODataProcessor.prototype.createUser = function (id) {
    if(!this.UsesUser)
        return false;

    if(typeof this.UserData[id] != "undefined")
        return false;

    if(sys.name(id) == undefined)
        return false;

    this.UserData[id] = new this.UserFunc(id);
    return true;
}

_PODataProcessor.prototype.destoryUser = function (id) {
    if(!this.UsesUser)
        return false;
    if(typeof this.UserData[id] != "undefined")
        return false;
    if(sys.name(id) == undefined)
        return false;

    delete this.UserData[id];
    return true;
}

_PODataProcessor.prototype.clearAll = function () {

    this.UserData = {};
    this.ChannelData = {};
    this.GlobalData = {};

    this.UserFunc = function () {}
    this.ChannelFunc = function () {}
    this.GlobalFunc = function () {}

    this.UsesUser = false;
    this.UsesChannel = false;
    this.UsesGlobal = false;

    this.ScriptID = undefined;
}

PODataProcessor = new _PODataProcessor();
