Announcement = new (function () {
this.announcement = sys.getAnnouncement();

this.beforeLogIn = function (src) {
sys.setAnnouncement("", src); // So they don't see the codes.
};
this.afterLogIn = function (src) {
sys.setAnnouncement(this.formatted(), src);
}
this.onChange = function (ann) {
this.announcement = ann;
};

this.formatted = function () {
var a = this.announcement + ' ';
a = a.replace(/{link: (.*?) text:(.*?)}/g, "<a href=$1>$2</a>");
a = a.replace(/{link: (.*?)}/g, "<a href=$1>$1</a>");

a = a.replace(/{b: (.*?)}/g, "<b>$1</b>");
a = a.replace(/{color: (.*?) text: (.*?)}/g, "<font color=$1>$2</font>");

return a;
}
})();
/* Call from main script:
Announcement.beforeLogIn(src); in beforeLogIn
Announcement.afterLogIn(src); in afterLogIn
Announcement.onChange(announcement); when the announcement is changed (in afterNewMessage)

Use this snippet for onChange:
if (message == "Announcement changed.") {
Announcement.onChange(sys.getAnnouncement());
        }
*/