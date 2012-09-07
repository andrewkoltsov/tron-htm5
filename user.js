module.exports.User = function (name) {
    this.name = name;
    this.setName = function (name) {
        this.name = name;
    }
}