Announcement = new(function () {
    this.announcement = sys.getAnnouncement();

    this.beforeLogIn = function (src) {
        sys.setAnnouncement("", src); // So they don't see the codes.
    };
    this.afterLogIn = function (src) {
	    sys.setAnnouncement("", src); // So they don't see the codes.
        sys.setAnnouncement(this.formatted(), src);
    }
    this.onChanged = function (ann) {
        this.announcement = ann;
		this.setAnnouncement(this.formatted()); // Applied for everyone.
    };

    this.formatted = function () {
        var a = this.announcement + ' ';
        a = a.replace(/{link: (.*?)|text: (.*?)}/g, "<a href=$1>$2</a>"); // {link: http://google.com|text: Google}
        a = a.replace(/{link: (.*?)}/g, "<a href=$1>$1</a>"); // {link: http://google.com}

        a = a.replace(/{b: (.*?)}/g, "<b>$1</b>"); // {b: Hello World!}
		a = a.replace(/{i: (.*?)}/g, "<i>$1</i>"); // {i: Hello World!}
        a = a.replace(/{u: (.*?)}/g, "<u>$1</u>"); // {u: Hello World!}
        a = a.replace(/{s: (.*?)}/g, "<s>$1</s>"); // {s: Hello World!}
		
        a = a.replace(/{color: (.*?)|text: (.*?)}/g, "<font color=$1>$2</font>"); // {color: green|text: Hello World!}
		
		a = a.replace(/{table: (.*?)}/g, "<table><tr><td>$1</tr></td></table>"); // {table: Hello World!}
		a = a.replace(/{table: (.*?)|table-width: (.*?)}/g, "<table width='$2'><tr><td>$1</tr></td></table>"); // {table: Hello World!|table-width: 100%}

		a = a.replace(/{image: (.*?)}/g, "<img src='$1'>"); // {image: Themes/Classic/mainchat.png}
		a = a.replace(/{image: (.*?) image-align: (.*?)}/g, "<img src='$1' align='$2'>"); // {image: Themes/Classic/mainchat.png|image-align: right}
		
		a = a.replace(/{tag: (.*?)|style: (.*?)|text: (.*?)}/g, "<$1 style='$2'>$3</$1>"); // {tag: b|style: color: "red"|text: Hello World!}

        return a;
    }
})();

/* Call from main script:
Announcement.beforeLogIn(src); in beforeLogIn
Announcement.afterLogIn(src); in afterLogIn
Announcement.onChange(announcement); when the announcement is changed (in afterNewMessage)

Use this snippet for onChanged:
if (message == "Announcement changed.") {
	Announcement.onChanged(sys.getAnnouncement());
}
*/