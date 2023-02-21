const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var artistSchema = mongoose.Schema({
    artistName: {type: String, required: true},
    artistBiography: {type: String, required: true},
    artistStart: {type: String, required: true},
    artistMedium: [String]
});

var departmentSchema = mongoose.Schema({
    deptId: {type: String, required: true},
    deptTitle: {type: String, required: true},
    deptDescription: {type: String, required: true}
});

var userSchema = mongoose.Schema({
    userForename: {type: String, required: true},
    userSurname: {type: String, required: true},
    userUsername: {type: String, required: true},
    userCode: {type: String, required: true},
    userEmail: {type: String, required: true},
    userCelebrate: Date,
    userFavourites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
},{versionKey: false});

userSchema.statics.mixCode = function (code) {
    return bcrypt.hashSync(code, 10);
};

userSchema.methods.validateCode = function (code) {
    return bcrypt.compareSync(code, this.userCode);
};

var itemSchema = mongoose.Schema({
    itemId: {type: String, required: true},
    title: {type: String, required: true},
    artist: {type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true},
    exhibit: {type: String, required: true},
    primaryImage: {type: String, required: true},
    links: [String],
    objectName: {type: String, required: true},
    objectDate: {type: String, required: true},
    medium: {type: String, required: true},
    dimensions: [Number],
    description: {type: String, required: true},
    department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true},
    isPublicDomain: Boolean,
    isFeatured: Boolean
});

var Item = mongoose.model('Item', itemSchema);
var User = mongoose.model('User', userSchema);
var Department = mongoose.model('Department', departmentSchema);
var Artist = mongoose.model('Artist', artistSchema);

module.exports.Item = Item;
module.exports.User = User;
module.exports.Department = Department;
module.exports.Artist = Artist;