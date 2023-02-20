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
    Items.find().then(function (items) {
        res.status(200).json(items);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//Get info about item with specific title
app.get('/collection/title/:title', function (req, res) {
    const title = req.params.title;
    Items.findOne({title: title}).then(function (item) {
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(400).send(`FAILURE --> ITEM '${title}' NOT IN NUMUSEUM`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//Get info about item with specific id
app.get('/collection/id/:id', function (req, res) {
    const id = req.params.id;
    Items.findOne({itemId: id}).then(function (item) {
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(400).send(`FAILURE --> ITEM ID${id} NOT IN NUMUSEUM`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
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
            res.status(400).send(`FAILURE --> ARTIST '${name}' NOT IN NUMUSEUM`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//NEW --> Get info about all users
app.get('/users', function (req, res) {
    Users.find().then(function (users) {
        res.status(200).json(users);
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//NEW --> Get info about user based on username
app.get('/users/username/:username', function (req, res) {
    username = req.params.username;
    Users.findOne({userUsername: username}).then(function (user) {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).send(`FAILURE --> USER '${username}' NOT IN NUMUSEUM`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//Post new user
app.post('/users', function (req, res) {
    const info = req.body;
    Users.findOne({userUsername: info.userUsername}).then(function (user) {
        if (user) {
            res.status(400).send(`FAILURE --> USER '${info.userUsername}' ALREADY CREATED`);
        } else {
            Users.create({
                userForename: info.userForename,
                userSurname: info.userSurname,
                userUsername: info.userUsername,
                userCode: info.userCode,
                userEmail: info.userEmail,
                userCelebrate: info.userCelebrate,
                userFavourites: info.userFavourites
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
            }, {new: true}, function (err, updatedInfo) {
                if (err) {
                    console.error(err);
                    res.status(500).send('FAILURE --> ' + err);
                } else {
                    res.status(200).json(updatedInfo);
                }
            });
        } else {
            res.status(400).send(`FAILURE --> NO USER WITH USERNAME '${username}'`);
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).send('FAILURE --> ' + err);
    });
});

//Put user update by id
app.put('/1111users/:id', function (req, res) {
    const id = req.params.id;
    const editedInfo = req.body;

    var userInfo = appUsers.find(function (user) {
        return user.id === id;
    });

    if (userInfo) {
        //Count if any pieces of info were updated
        count = 0;
        //Check what updateable pieces of information got updated
        if (editedInfo.forename) {
            userInfo.forename = editedInfo.forename;
            count++;
        }
        if (editedInfo.surname) {
            userInfo.surname = editedInfo.surname;
            count++;
        }
        if (editedInfo.username) {
            userInfo.username = editedInfo.username;
            count++;
        }
        if (editedInfo.code) {
            userInfo.code = editedInfo.code;
            count++;
        }
        if (count) {
            res.status(200).json(userInfo);
        } else {
            res.status(400).send(`FAILURE --> NO INFORMATION UPDATED FOR EXISTING USER ${id}`);
        }
    } else {
        res.status(400).send(`FAILURE --> NO USER WITH ID ${id}`);
    }
});

//Delete user based on id
app.delete('/users/:id', function (req, res) {
    const id = req.params.id;

    var userInfo = appUsers.find(function (user) {
        return user.id === id;
    });

    if (userInfo) {
        appUsers = appUsers.filter(function (user) {
            return user.id !== id;
        });
        res.status(200).send(`SUCCESS --> USER ID${id} REMOVED`);
    } else {
        res.status(400).send(`FAILURE --> NO USER WITH ID${id}`);
    }
});

//Post favourite item based on user ID and object ID
app.post('/users/:id/:objectID', function (req, res) {
    const {id, objectID} = req.params;

    var userInfo = appUsers.find(function (user) {
        return user.id === id;
    });

    const item = museumItems.find(function (item) {
        return item.objectID === objectID;
    });

    //Info about success and different failure types 
    if (userInfo && item) {
        userInfo.favouriteItems.push(objectID);
        res.status(200).send(`SUCCESS --> Item ID${objectID} titled '${item.title}' is now part of ${userInfo.forename} ${userInfo.surname}'s array of favourites. (User ID${id})`);
    } else if (userInfo && !item) {
        res.status(400).send(`FAILURE --> ITEM ID${objectID} DOES NOT EXIST : EXISTING USER ${userInfo.forename} ${userInfo.surname}'S ARRAY OF FAVOURITES NOT UPDATED (USER ID ${id})`);
    } else if (!userInfo && item) {
        res.status(400).send(`FAILURE --> USER ID${id} DOES NOT EXIST : EXISTING ITEM ID${objectID} TITLED '${item.title}' NOT ADDED TO ARRAY OF FAVOURITES`);
    } else {
        res.status(400).send(`FAILURE --> USER ID${id} DOES NOT EXIST AND ITEM ID${objectID} DOES NOT EXIST`);
    }
});

//Delete favourite item based on user ID and object ID
app.delete('/users/:id/:objectID', function (req, res) {
    const {id, objectID} = req.params;

    var userInfo = appUsers.find(function (user) {
        return user.id === id;
    });

    const item = museumItems.find(function (item) {
        return item.objectID === objectID;
    });

    //Info about success and different failure types 
    if (userInfo && item) {
        userInfo.favouriteItems = userInfo.favouriteItems.filter(function (idNum) {
            return idNum !== objectID;
        });
        res.status(200).send(`SUCCESS --> Item ID${objectID} titled '${item.title}' is no longer part of ${userInfo.forename} ${userInfo.surname}'s array of favourites. (User ID${id})`);
    } else if (userInfo && !item) {
        res.status(400).send(`FAILURE --> ITEM ID${objectID} DOES NOT EXIST : EXISTING USER ${userInfo.forename} ${userInfo.surname}'S ARRAY OF FAVOURITES NOT UPDATED (USER ID ${id})`);
    } else if (!userInfo && item) {
        res.status(400).send(`FAILURE --> USER ID${id} DOES NOT EXIST : EXISTING ITEM ID${objectID} TITLED '${item.title}' NOT REMOVED FROM ARRAY OF FAVOURITES`);
    } else {
        res.status(400).send(`FAILURE --> USER ID${id} DOES NOT EXIST AND ITEM ID${objectID} DOES NOT EXIST`);
    }
});

app.listen(1618, function () {
    console.log('APPLICATION ACTIVE ---> LISTENING @ PORT 1618');
});