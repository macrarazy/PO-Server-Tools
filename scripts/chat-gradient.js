/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, SESSION, script, print, gc, version, Config, require, module, exports: true*/

// File: chat-gradient.js (ChatGradient)
// ChatGradients, previously known as ChatColorRandomizers. This is a 'fun' component and isn't required (however, stuff will break as-is).
// No dependencies.

// Table of Content:
// [expt]: Exports

(function () {
    var ChatGradient = {};
    var channelGradients = {};
    var fonts = ["Aharoni", "Andalus", "Angsana New", "AngsanaUPC", "Aparajita", "Arabic Typesetting", "Arial", "Arial Unicode MS", "Batang", "BatangChe", "Blackadder ITC", "Book Antiqua", "Bookman Old Style", "Bookshelf Symbol 7", "Bradley Hand ITC", "Browallia New", "BrowalliaUPC", "Calibri", "Cambria", "Cambria Math", "Candara", "Century Gothic", "Century", "Comic Sans MS", "Consolas", "Constantia", "Copperplate Gothic", "Corbel", "Cordia New", "CordiaUPC", "Courier New", "Courier", "Curlz MT", "DaunPenh", "David", "DFKai-SB", "DilleniaUPC", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Engravers MT", "Eras ITC", "Estrangelo Edessa", "EucrosiaUPC", "Euphemia", "Eurostile", "FangSong", "Felix Titling", "Fixedsys", "Franklin Gothic", "Franklin Gothic Book", "FrankReuhl", "FreesiaUPC", "Freestyle Script", "French Script MT", "Gabriolia", "Garamond", "Gautami", "Georgia", "Gisha", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Impact", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jokerman", "Juice ITC", "KaiTI", "Kalinga", "Kartika", "Khmer UI", "KodchiangUPC", "Kokila", "Kristen ITC", "Lao UI", "Latha", "Leelawadee", "Levenim MT", "LilyUPC", "Lucida Console", "Lucida", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Unicode", "Maiandra GD", "Malgun Gothic", "Mangal", "Matisse ITC", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Miriam Fixed", "Miriam", "Mistral", "Modern", "Mongolian Baiti", "Monotype Corsiva", "MoolBoran", "MS Gothic", "MS Mincho", "MS PGothic", "MS PMincho", "MS Reference1", "MS Reference2", "MS Reference Sans Serif", "MS Reference Specialty", "MS Sans Serif", "MS Serif", "MS UI Gothic", "MT Extra", "MV Boli", "Narkisim", "NSimSun", "Nyala", "OCR A Breed", "Palatino Linotype", "Papyrus", "Perpetua", "PlantageNet Cherokee", "PMingLiU", "PMingLiU-ExtB", "Pristina", "Raavi", "Rockwell", "Rod", "Roman", "Sakkal", "Script", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Symbol", "Shonar Bangla", "Shruti", "SemHei", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Small Fonts", "Sylfaen", "Symbol", "System", "Tahoma", "Tempus Sans ITC", "Terminal", "Times New Roman", "Traditional Arabic", "Trebucket MS", "Tunga", "Utsaah", "Vani", "Verdana", "Vijaya", "Vivaldi", "Vrinda", "Webdings", "Wingdings2", "Wingdings3", "Wingdings"];

    // These are two additional fonts added by PO.
    fonts.push("LCD", "SignPainter'sGothicShadedSC JL");
    
    // Registers a channel to use ChatGradient.
    // if first/secondColor is falsy or "random", then a random color is chosen.
    ChatGradient.addChannel = function (firstColor, secondColor, channel) {
        // <div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + index.firstColor + ', stop:1 ' + index.secondColor + ');">
        // '<center><hr width="150"/><b>Party Time!</b><hr width="150"/></center><div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + firstColor + ', stop:1 ' + secondColor + ');">';
        
        channelGradients[channel] = {
            firstColor: ((!firstColor || firstColor === "random") ? ChatGradient.randomHexColor() : firstColor),
            secondColor: ((!secondColor || secondColor === "random") ? ChatGradient.randomHexColor() : secondColor)
        };
    };
    
    // Unregisters a channel using ChatGradient.
    ChatGradient.removeChannel = function (channel) {
        delete channelGradients[channel];
    };
    
    // If a channel is using ChatGradient.
    ChatGradient.hasChannel = function (channel) {
        return Object.prototype.hasOwnProperty.call(channelGradients, channel);
    };

    // Returns the colors specified in addChannel of a registered channel.
    // If the channel isn't registered, returns false
    ChatGradient.channelColors = function (channel) {
        var chanIndex = channelGradients[channel];
        
        if (!chanIndex) {
            return false;
        }
        
        return [chanIndex.firstColor, chanIndex.secondColor];
    };
    
    // Sends a ChatGradient to a channel.
    ChatGradient.send = function (channel) {
        var colors = ChatGradient.channelColors(channel);
        
        sys.sendHtmlAll('<center><hr width="150"/><b>Party Time!</b><hr width="150"/></center><div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + colors[0] + ', stop:1 ' + colors[1] + ');">', channel);
    };
    
    // Ends the ChatGradient in a channel.
    ChatGradient.end = function (channel) {
        sys.sendHtmlAll('<center><hr width="150"/><b>Party Time is over!</b><hr width="150"/></center>', channel);
    };
    
    // Refreshes a ChatGradient in a channel.
    ChatGradient.refresh = function (channel) {
        var colors = ChatGradient.channelColors(channel);
        
        sys.sendHtmlAll('<div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + colors[0] + ', stop:1 ' + colors[1] + ');">', channel);
    };
    
    // Refreshes a player's ChatGradient in a channel.
    ChatGradient.refreshPlayer = function (src, channel) {
        var colors = ChatGradient.channelColors(channel);
        
        sys.sendHtmlMessage(src, '<div style="background-color: qradialgradient(cx:0.8, cy:1, fx: 0.8, fy: 0.2, radius: 0.8,stop:0.1 ' + colors[0] + ', stop:1 ' + colors[1] + ');">', channel);
    };
    
    // Picks a random font from the font list.
    ChatGradient.randomFont = function () {
        return fonts[Math.round(fonts.length * Math.random())];
    };
    
    // Returns an HTML span (without closing tag or content) with a random background color.
    ChatGradient.randomColorSpan = function () {
        var color1 = sys.rand(0, 256),
            color2 = sys.rand(0, 256),
            color3 = sys.rand(0, 256);

        return "<span style='background-color: rgb(" + color1 + ", " + color2 + ", " + color3 + ");'>";
    };

    // Returns a random hex color.
    ChatGradient.randomHexColor = function () {
        var hex = "";

        while (hex.length < 6) {
            hex += sys.rand(0, 17).toString(16);
        }

        return hex;
    };
    
    // Exports [expt]
    // Export ChatGradient
    exports = ChatGradient;
}());