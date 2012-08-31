json = function (file) {
    this.file = file;

    this.prototype = {
        "read": function () {
            return JSON.parse(sys.getFileContent(this.file));
        },
        "write": function (code) {
            sys.writeToFile(this.file, JSON.stringify(code));
        },
        "get": function (property) {
            return this.read()[property];
        }
    }
}