//Key tools
const express = require('express'), app = express(), morgan = require('morgan'), bodyParser = require('body-parser'), uuid = require('uuid');
const {check, validationResult} = require('express-validator');

//Integration of mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');
const Artists = Models.Artist;
const Departments = Models.Department;
const Items = Models.Item;
const Users = Models.User;
//mongoose.connect('mongodb://127.0.0.1:27017/NuMuseumV2', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.RUBBERSUIT, {useNewUrlParser: true, useUnifiedTopology: true});

//Add requests to log
app.use(morgan('combined'));

//For documentation.html and css
app.use(express.static('public'));

//For body parser
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

//Require auth
var auth = require('./auth')(app);

//Require passport and import passport.js
const passport = require('passport');
require('./passport');

//Generic error notification 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('ERROR ERROR');
});

//Generic API title
app.get('/', function (req, res) {
    res.status(200).send('You are in the 16 Feb 2023 version of NuMuseum API. Go to documentation.html to learn how to use it.');
});

/** Get item info
 * Gets info about all items in collection in json format
 */
app.get('/collection', passport.authenticate('jwt', {session: false}), function (req, res) {
    Items.find().populate('artist').populate('department').exec(function (err, items) {
        if (err) {
            console.error(err);
            res.status(500).send('FAILURE --> ' + err);
        } else {
            res.status(200).json(items);
        }
    });
});

/** Get unpoulated item info
 * Gets info about all items in collection in json format without populated artist and department info
 */
app.get('/min/collection', passport.authenticate('jwt', {session: false}), function (req, res) {
    Items.find().then(function (items) {
        res.status(200).json(items);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Get item info with title
 * Takes title in url
 * Gets info about item with the title in json format
 */
app.get('/collection/title/:title', passport.authenticate('jwt', {session: false}), function (req, res) {
    const title = req.params.title;
    Items.findOne({title: title}).populate('artist').populate('department').exec(function (err, item) {
        if (err) {
            console.error(err);
            res.status(500).send('FAILURE --> ' + err);
        } else if (item) {
            res.status(200).json(item);
        } else {
            res.status(400).send(`FAILURE --> ITEM \u00AB${title}\u00BB NOT IN NUMUSEUM`);
        }
    });
});

/** Get item info with id
 * Takes id in url
 * Gets info about item with the id in json format
 */
app.get('/collection/id/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
    const id = req.params.id;
    Items.findOne({itemId: id}).populate('artist').populate('department').exec(function (err, item) {
        if (err) {
            console.error(err);
            res.status(500).send('FAILURE --> ' + err);
        } else if (item) {
            res.status(200).json(item);
        } else {
            res.status(400).send(`FAILURE --> ITEM ID${id} NOT IN NUMUSEUM`);
        }
    });
});

/** Get all department info
 * Gets info about all departments in json format
 */
app.get('/departments', passport.authenticate('jwt', {session: false}), function (req, res) {
    Departments.find().then(function (departments) {
        res.status(200).json(departments);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Get department info with id
 * Takes id in url
 * Gets info about department with the id in json format
 */
app.get('/departments/id/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
    const id = req.params.id;
    Departments.findOne({deptId: id}).then(function (department) {
        if (department) {
            res.status(200).json(department);
        } else {
            res.status(400).send(`FAILURE --> DEPARTMENT ID${id} NOT IN NUMUSEUM`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Get all artist info
 * Gets info about all departments in json format
 */
app.get('/artists', passport.authenticate('jwt', {session: false}), function (req, res) {
    Artists.find().then(function (artists) {
        res.status(200).json(artists);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Get artist info with name
 * Takes name in url
 * Gets info about artist with the name in json format
 */
app.get('/artists/name/:name', passport.authenticate('jwt', {session: false}), function (req, res) {
    const name = req.params.name;
    Artists.findOne({artistName: name}).then(function (artist) {
        if (artist) {
            res.status(200).json(artist);
        } else {
            res.status(400).send(`FAILURE --> ARTIST \u00AB${name}\u00BB NOT IN NUMUSEUM`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Get all user info
 * Gets info about all users in json format
 */
app.get('/users', passport.authenticate('jwt', {session: false}), function (req, res) {
    Users.find().populate('userFavourites').exec(function (err, users) {
        if (err) {
            console.error(err);
            res.status(500).send('FAILURE --> ' + err);
        } else {
            res.status(200).json(users);
        }
    });
});

/** Get user info with username
 * Takes username in url
 * Gets info about user with username in json format
 */
app.get('/users/username/:username', passport.authenticate('jwt', {session: false}), function (req, res) {
    const username = req.params.username;
    Users.findOne({userUsername: username}).populate('userFavourites').exec(function (err, user) {
        if (err) {
            console.error(err);
            res.status(500).send('FAILURE --> ' + err);
        } else if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).send(`FAILURE --> USER \u00AB${username}\u00BB NOT IN NUMUSEUM`);
        }
    });
});

/** Get unpopulated user info with username
 * Takes username in url
 * Gets info about user with username in json format without populated favourites
 */
app.get('/min/users/username/:username', passport.authenticate('jwt', {session: false}), function (req, res) {
    const username = req.params.username;
    Users.findOne({userUsername: username}).then(function (user) {
        res.status(200).json(user);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Post new user info
 * Takes json with alpha-numerical strings userForename and userSurname (both min length 2), alpha-numerical string userUsername (min length 5), string userCode (min length 10), email string userEmail and optional date string userCelebrate
 * Posts user info to database 
 */
app.post('/users', [
    check('userForename', 'FAILURE --> USERFORENAME IS REQUIRED').isLength({min: 2}),
    check('userForename', 'FAILURE --> USERFORENAME MUST BE ALPHA-NUMERICAL').isAlphanumeric(),
    check('userSurname', 'FAILURE --> USERSURNAME IS REQUIRED').isLength({min: 2}),
    check('userSurname', 'FAILURE --> USERSURNAME MUST BE ALPHA-NUMERICAL').isAlphanumeric(),
    check('userUsername', 'FAILURE --> MINIMUM USERUSERNAME LENGTH IS FIVE').isLength({min: 5}),
    check('userUsername', 'FAILURE --> USERUSERNAME MUST BE ALPHA-NUMERICAL').isAlphanumeric(),
    check('userCode', 'FAILURE --> MINIMUM USERCODE LENGTH IS TEN').isLength({min: 10}),
    check('userEmail', 'FAILURE --> REAL USEREMAIL REQUIRED').isEmail()
], function (req, res) {
    var fails = validationResult(req);
    if (!fails.isEmpty()) {
        return res.status(422).json({FAILURES: fails.array()});
    }
    const info = req.body;
    var nuCode = Users.mixCode(info.userCode);
    Users.findOne({userUsername: info.userUsername}).then(function (user) {
        if (user) {
            res.status(400).send(`FAILURE --> USER \u00AB${info.userUsername}\u00BB ALREADY CREATED`);
        } else {
            var mixDate = new Date(info.userCelebrate);
            Users.create({
                userForename: info.userForename,
                userSurname: info.userSurname,
                userUsername: info.userUsername,
                userCode: nuCode,
                userEmail: info.userEmail,
                userCelebrate: mixDate.setUTCFullYear(1600),
                userFavourites: []
            }).then(function (newuser) {
                res.status(201).json(newuser);
            }).catch(function (err) {
                console.error(err);
                res.status(500).send('FAILURE --> ' + err);
            });
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Put user info update
 * Takes json with one or more of these strings: alpha-numerical strings userForename and userSurname (both min length 2), alpha-numerical string userUsername (min length 5), string userCode (min length 10), email string userEmail and date string userCelebrate
 * Puts user info update to database 
 */
app.put('/users/username/:username', passport.authenticate('jwt', {session: false}), [
    //Checks for what is included
    check('userForename', 'FAILURE --> USERFORENAME IS REQUIRED').optional().isLength({min: 2}),
    check('userForename', 'FAILURE --> USERFORENAME MUST BE ALPHA-NUMERICAL').optional().isAlphanumeric(),
    check('userSurname', 'FAILURE --> USERSURNAME IS REQUIRED').optional().isLength({min: 2}),
    check('userSurname', 'FAILURE --> USERSURNAME MUST BE ALPHA-NUMERICAL').optional().isAlphanumeric(),
    check('userUsername', 'FAILURE --> MINIMUM USERUSERNAME LENGTH IS FIVE').optional().isLength({min: 5}),
    check('userUsername', 'FAILURE --> USERUSERNAME MUST BE ALPHA-NUMERICAL').optional().isAlphanumeric(),
    check('userCode', 'FAILURE --> MINIMUM USERCODE LENGTH IS TEN').optional().isLength({min: 10}),
    check('userEmail', 'FAILURE --> REAL USEREMAIL REQUIRED').optional().isEmail()
], function (req, res) {
    var fails = validationResult(req);
    if (!fails.isEmpty()) {
        return res.status(422).json({FAILURES: fails.array()});
    }

    const username = req.params.username;
    const newInfo = req.body;

    //Hashing for new code if it is in the req body
    if (newInfo.userCode) {
        var nuCode = Users.mixCode(newInfo.userCode);
    }

    Users.findOne({userUsername: username}).then(function (user) {
        if (user) {
            var mixDate = new Date(newInfo.userCelebrate);
            Users.findOneAndUpdate({userUsername: username}, {$set: {
                    userForename: newInfo.userForename,
                    userSurname: newInfo.userSurname,
                    userUsername: newInfo.userUsername,
                    userCode: nuCode,
                    userEmail: newInfo.userEmail,
                    userCelebrate: mixDate.setUTCFullYear(1618)
                }
            }, {new : true}, function (err, updatedInfo) {
                if (err) {
                    console.error(err);
                    res.status(500).send('FAILURE --> ' + err);
                } else {
                    res.status(200).json(updatedInfo);
                }
            });
        } else {
            res.status(400).send(`FAILURE --> NO USER WITH USERNAME \u00AB${username}\u00BB`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Delete user with name
 * Takes name in url
 * Deletes user with name
 */
app.delete('/users/username/:username', passport.authenticate('jwt', {session: false}), function (req, res) {
    const username = req.params.username;
    Users.findOneAndRemove({userUsername: username}).then(function (user) {
        if (user) {
            res.status(200).send(`SUCCESS --> USER WITH USERNAME \u00AB${username}\u00BB REMOVED`);
        } else {
            res.status(400).send(`FAILURE --> NO USER WITH USERNAME \u00AB${username}\u00BB FOUND`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Post favourite with username and favourite uuid
 * Takes username and favourite item uuid in url
 * Posts favourite uuid to favourites array of user with username
 */
app.post('/users/username/:username/favitem/:favitemid', passport.authenticate('jwt', {session: false}), function (req, res) {
    const {username, favitemid} = req.params;
    Users.findOne({userUsername: username}).then(function (user) {
        if (user) {
            Users.findOneAndUpdate({userUsername: username}, {$addToSet: {userFavourites: favitemid}}, {new : true}, function (err, updatedInfo) {
                if (err) {
                    console.error(err);
                    res.status(500).send('FAILURE --> ' + err);
                } else {
                    //res.json(updatedInfo);
                    res.status(200).send(`SUCCESS --> Item ID${favitemid} is now part of the favourite item array of user with username \u00AB${username}\u00BB`);
                }
            });
        } else {
            res.status(400).send(`FAILURE --> NO USER WITH USERNAME \u00AB${username}\u00BB`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/** Post favourite with username and favourite uuid
 * Takes username and favourite item uuid in url
 * Posts favourite uuid to favourites array of user with username
 */
app.delete('/users/username/:username/favitem/:favitemid', passport.authenticate('jwt', {session: false}), function (req, res) {
    const {username, favitemid} = req.params;
    Users.findOne({userUsername: username}).then(function (user) {
        if (user) {
            Users.findOneAndUpdate({userUsername: username}, {$pull: {userFavourites: favitemid}}, {new : true}, function (err, updatedInfo) {
                if (err) {
                    console.error(err);
                    res.status(500).send('FAILURE --> ' + err);
                } else {
                    //res.json(updatedInfo);
                    res.status(200).send(`SUCCESS --> Item ID${favitemid} is no longer part of the favourite item array of user with username \u00AB${username}\u00BB`);
                }
            });
        } else {
            res.status(400).send(`FAILURE --> NO USER WITH USERNAME \u00AB${username}\u00BB`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

/* global process */
const port = process.env.PORT || 1618;
app.listen(port, '0.0.0.0', () => {
    console.log('THIS IS NUMUSEUM PUBLIC VERSION 1 \u00ABRubberPants\u00BB WORKING ON ' + port);
});

