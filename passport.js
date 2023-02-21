const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
Models = require('./models.js'),
passportJWT = require('passport-jwt');

var Users = Models.User,
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'code'
}, function (username, code, callback) {
    console.log(`Username \u00AB${username}\u00BB Code \u00AB${code}\u00BB`);
    Users.findOne({userUsername: username}, function (error, user) {
        if (error) {
            console.log(`ERROR ERROR ---> ${error}`);
            return callback(error);
        }
        if (!user) {
            console.log(`ERROR ERROR ---> USERNAME \u00AB${username}\u00AB NOT IN NUMUSEUM DATABASE`);
            return callback(null, false, {message: 'FAILURE --> USERNAME NOT CORRECT'});
        }
        if (!user.validateCode(code)) {
            console.log(`ERROR ERROR ---> CODE NOT IN NUMUSEUM DATABASE`);
            return callback(null, false, {message: 'FAILURE --> CODE NOT CORRECT'});
        }
        console.log('FINISH');
        return callback(null, user);
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, function (jwtPayload, callback) {
    return Users.findById(jwtPayload._id).then(function (user) {
        return callback(null, user);
    }).catch(function (error) {
        return callback(error);
    });
}));