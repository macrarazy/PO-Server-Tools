/* Documentation:

  format:
To be send with sys.sendHtmlAll();
*/

_POBBCode = function () {};

_POBBCode.format = function (message, AuthLevel) {

    if(typeof message != "string")
        message = String(message);

    function atag(s) {
        return '<a href="'+s+'">'+s+'</a>';
    }

    function autocap($1) {
        var str = $1;
        str = str.replace(/\[autocaps\]/gi, "");
        var sentances = str.split("."), sentance;
        for(sentance in sentances) {
            sentances[sentance][0] = sentances[sentance].toUpperCase();
        }
        str = sentances.join(".");
    }

    var str = message;
    if(!AuthLevel) AuthLevel = 0;
    str = str.replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>');
    str = str.replace(/\[s\](.*?)\[\/s\]/gi, '<s>$1</s>');
    str = str.replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>');
    str = str.replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>');
    str = str.replace(/\[sub\](.*?)\[\/sub\]/gi, '<sub>$1</sub>');
    str = str.replace(/\[sup\](.*?)\[\/sup\]/gi, '<sup>$1</sup>');
    str = str.replace(/\[sub\](.*?)\[\/sub\]/gi, '<sub>$1</sub>');
    str = str.replace(/\[code\](.*?)\[\/code\]/gi, '<code>$1</code>');
    str = str.replace(/\[spoiler\](.*?)\[\/spoiler\]/gi, '<a style="color: black; background-color:black;">$1</a>');
    str = str.replace(/\[time\]/gi, "<timestamp/>");
    str = str.replace(/[a-z]{3,}:\/\/[^ ]+/i,atag);
    str = str.replace(/\[color=([a-zA-Z]{1,}|[0-9\#]{1,})\](.*?)\[\/color\]/gi, '<font color=$1>$2</font>')
    str = str.replace(/\[face=([a-zA-Z]{1,}|[0-9\#]{1,})\](.*?)\[\/face\]/gi, '<font face=$1>$2</font>')

    if(str.indexOf("[autocaps]") > -1)
        str = autocap(str);

    if(AuthLevel !== 0) {
        str = str.replace(/\[size=([0-9]{1,})\](.*?)\[\/size\]/gi, '<font size=$1>$2</font>')
        str = str.replace(/\[pre\](.*?)\[\/pre\]/gi, '<pre>$1</pre>');
        str = str.replace(/\[ping\]/gi, "<ping/>");
        str = str.replace(/\[br\]/gi, "<br/>");
        str = str.replace(/\[hr\]/gi, "<hr/>");
    }

    return str;
}

POBBCode = new _POBBCode();
