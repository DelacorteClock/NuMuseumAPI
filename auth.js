const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
        passport = require('passport');
require('./passport');

var generateJWTToken = function (user) {
    return jwt.sign(user, jwtSecret, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
};

module.exports = function (router) {
    router.post('/login', function (req, res) {
        passport.authenticate('local', {session: false}, function (error, user, info) {
            if (error || !user) {
                return res.status(400).json({
                    message: 'ERROR ERROR',
                    user: user
                });
            }
            req.login(user, {session: false}, function (error) {
                if (error) {
                    res.send(`ERROR ERROR ---> ${error}`);
                }
                var token = generateJWTToken(user.toJSON());
                return res.json({user: user, token: token});
            });
        })(req, res);
    });
};
