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
    res.status(200).send('You are in the 16 Feb 2023 version (V1) of NuMuseum API \u00ABRubberPants\u00BB Branch II \u00ABSimpl\u00BB. Go to documentation.html to learn how to use it.');
});

//Get info about all items in collection
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

//Get info about item with specific title
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

//Get info about item with specific title
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

//Get info about all departments
app.get('/departments', passport.authenticate('jwt', {session: false}), function (req, res) {
    Departments.find().then(function (departments) {
        res.status(200).json(departments);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//Get info about department based on id
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

//Get info about all artists
app.get('/artists', passport.authenticate('jwt', {session: false}), function (req, res) {
    Artists.find().then(function (artists) {
        res.status(200).json(artists);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//Get info about artist based on specific name
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

//NEW --> Get info about all users
app.get('/users', passport.authenticate('jwt', {session: false}), function (req, res) {
    Users.find().populate('favourites').exec(function (err, users) {
        if (err) {
            console.error(err);
            res.status(500).send('FAILURE --> ' + err);
        } else {
            res.status(200).json(users);
        }
    });
});

//NEW --> Get info about user based on username
app.get('/users/username/:username', passport.authenticate('jwt', {session: false}), function (req, res) {
    const username = req.params.username;
    Users.findOne({username: username}).populate('favourites').exec(function (err, user) {
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

//Post new user
app.post('/users', [
    check('username', 'FAILURE --> MINIMUM USERNAME LENGTH IS FIVE').isLength({min: 5}),
    check('username', 'FAILURE --> USERNAME MUST BE ALPHA-NUMERICAL').isAlphanumeric(),
    check('code', 'FAILURE --> MINIMUM CODE LENGTH IS TEN').isLength({min: 10}),
    check('email', 'FAILURE --> REAL EMAIL REQUIRED').isEmail()
], function (req, res) {
    var fails = validationResult(req);
    if (!fails.isEmpty()) {
        return res.status(422).json({FAILURES: fails.array()});
    }
    const info = req.body;
    var nuCode = Users.mixCode(info.code);
    Users.findOne({username: info.username}).then(function (user) {
        if (user) {
            res.status(400).send(`FAILURE --> USER \u00AB${info.username}\u00BB ALREADY CREATED`);
        } else {
            var mixDate = new Date(info.dmbirthday);
            Users.create({
                username: info.username,
                code: nuCode,
                email: info.email,
                dmbirthday: mixDate.setUTCFullYear(1618),
                favourites: []
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

//Put user update based on username and req body
app.put('/users/username/:username', passport.authenticate('jwt', {session: false}), [
    //Checks for what is included
    check('username', 'FAILURE --> MINIMUM USERNAME LENGTH IS FIVE').optional().isLength({min: 5}),
    check('username', 'FAILURE --> USERNAME MUST BE ALPHA-NUMERICAL').optional().isAlphanumeric(),
    check('code', 'FAILURE --> MINIMUM CODE LENGTH IS TEN').optional().isLength({min: 10}),
    check('email', 'FAILURE --> REAL EMAIL REQUIRED').optional().isEmail()
], function (req, res) {
    var fails = validationResult(req);
    if (!fails.isEmpty()) {
        return res.status(422).json({FAILURES: fails.array()});
    }

    const username = req.params.username;
    const newInfo = req.body;

    //Hashing for new code if it is in the req body
    if (newInfo.code) {
        var nuCode = Users.mixCode(newInfo.code);
    }

    Users.findOne({username: username}).then(function (user) {
        if (user) {
            var mixDate = new Date(newInfo.dmbirthday);
            Users.findOneAndUpdate({username: username}, {$set: {
                    username: newInfo.username,
                    code: nuCode,
                    email: newInfo.email,
                    dmbirthday: mixDate.setUTCFullYear(1618)
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

//Delete user based on username
app.delete('/users/username/:username', passport.authenticate('jwt', {session: false}), function (req, res) {
    const username = req.params.username;
    Users.findOneAndRemove({username: username}).then(function (user) {
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

//Post favourite item based on username and item's unique id
app.post('/users/username/:username/favitem/:favitemid', passport.authenticate('jwt', {session: false}), function (req, res) {
    const {username, favitemid} = req.params;
    Users.findOne({username: username}).then(function (user) {
        if (user) {
            Users.findOneAndUpdate({username: username}, {$addToSet: {favourites: favitemid}}, {new : true}, function (err, updatedInfo) {
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

//Delete favourite item based on username and item's unique id
app.delete('/users/username/:username/favitem/:favitemid', passport.authenticate('jwt', {session: false}), function (req, res) {
    const {username, favitemid} = req.params;
    Users.findOne({username: username}).then(function (user) {
        if (user) {
            Users.findOneAndUpdate({username: username}, {$pull: {favourites: favitemid}}, {new : true}, function (err, updatedInfo) {
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
    console.log('THIS IS NUMUSEUM PUBLIC VERSION 1 \u00ABRubberPants\u00BB BRANCH 2 \u00ABSimpl\u00BB WORKING ON ' + port);
});

