//Key tools
const express = require('express'), app = express(), morgan = require('morgan'), bodyParser = require('body-parser'), uuid = require('uuid');

//Integration of mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');
const Artists = Models.Artist;
const Departments = Models.Department;
const Items = Models.Item;
const Users = Models.User;
mongoose.connect('mongodb://127.0.0.1:27017/NuMuseumV2', {useNewUrlParser: true, useUnifiedTopology: true});

//Add requests to log
app.use(morgan('combined'));

//For documentation.html and css
app.use(express.static('public'));

//For body parser
app.use(bodyParser.json());

//Generic error notification 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('ERROR ERROR');
});

//Generic API title
app.get('/', function (req, res) {
    res.status(200).send('You are in the 16 Feb 2023 version of NuMuseum API. Go to documentation.html to learn how to use it.');
});

//Get info about all items in collection
app.get('/collection', function (req, res) {
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
app.get('/collection/title/:title', function (req, res) {
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
app.get('/collection/id/:id', function (req, res) {
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
app.get('/departments', function (req, res) {
    Departments.find().then(function (departments) {
        res.status(200).json(departments);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//Get info about department based on id
app.get('/departments/id/:id', function (req, res) {
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
app.get('/artists', function (req, res) {
    Artists.find().then(function (artists) {
        res.status(200).json(artists);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//Get info about artist based on specific name
app.get('/artists/name/:name', function (req, res) {
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
app.get('/users', function (req, res) {
    Users.find().populate('userFavourites').exec(function (err, users) {
        if (err) {
            console.error(err);
            res.status(500).send('FAILURE --> ' + err);
        } else {
            res.status(200).json(users);
        }
    });
});

//NEW --> Get info about user based on username
app.get('/users/username/:username', function (req, res) {
    username = req.params.username;
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

//Post new user
app.post('/users', function (req, res) {
    const info = req.body;
    Users.findOne({userUsername: info.userUsername}).then(function (user) {
        if (user) {
            res.status(400).send(`FAILURE --> USER \u00AB${info.userUsername}\u00BB ALREADY CREATED`);
        } else {
            Users.create({
                userForename: info.userForename,
                userSurname: info.userSurname,
                userUsername: info.userUsername,
                userCode: info.userCode,
                userEmail: info.userEmail,
                userCelebrate: info.userCelebrate,
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

//Put user update based on username and req body
app.put('/users/username/:username', function (req, res) {
    username = req.params.username;
    newInfo = req.body;
    Users.findOne({userUsername: username}).then(function (user) {
        if (user) {
            Users.findOneAndUpdate({userUsername: username}, {$set: {
                    userForename: newInfo.userForename,
                    userSurname: newInfo.userSurname,
                    userUsername: newInfo.userUsername,
                    userCode: newInfo.userCode,
                    userEmail: newInfo.userEmail,
                    userCelebrate: newInfo.userCelebrate
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
app.delete('/users/username/:username', function (req, res) {
    username = req.params.username;
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

//Post favourite item based on username and item's unique id
app.post('/users/username/:username/favitem/:favitemid', function (req, res) {
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

//Delete favourite item based on username and item's unique id
app.delete('/users/username/:username/favitem/:favitemid', function (req, res) {
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

app.listen(1618, function () {
    console.log('APPLICATION ACTIVE ---> LISTENING @ PORT 1618');
});