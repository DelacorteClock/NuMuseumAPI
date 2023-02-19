//Key tools
const express = require('express'), app = express(), morgan = require('morgan'), bodyParser = require('body-parser'), uuid = require('uuid');

//Integration of mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');
const Artists = Models.Artist;
const Departments = Models.Department;
const Items = Models.Item;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/NuMuseum', {useNewUrlParser: true, useUnifiedTopology: true});

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

//Get info about all items in virtual museum
app.get('/collection', function (req, res) {
    res.status(200).json(museumItems);
});

//Get info about item with specific title
app.get('/collection/title/:title', function (req, res) {
    const title = req.params.title;
    const item = museumItems.find(function (item) {
        return item.title === title;
    });

    if (item) {
        res.status(200).json(item);
    } else {
        res.status(400).send(`FAILURE --> ITEM '${title}' NOT IN NUMUSEUM`);
    }
});

//Get info about item with specific id
app.get('/collection/id/:id', function (req, res) {
    const id = req.params.id;
    const item = museumItems.find(function (item) {
        return item.objectID === id;
    });

    if (item) {
        res.status(200).json(item);
    } else {
        res.status(400).send(`FAILURE --> ITEM ID${id} NOT IN NUMUSEUM`);
    }
});

//Get info about all departments
//Separate sample json for departments to avoid storing dept info in each item in collection
app.get('/departments', function (req, res) {
    res.status(200).json(museumDepartments);
});

//Get info about department by id
app.get('/departments/id/:id', function (req, res) {
    const id = req.params.id;
    const dept = museumDepartments.find(function (dept) {
        return dept.deptID === id;
    });

    if (dept) {
        res.status(200).json(dept);
    } else {
        res.status(400).send(`FAILURE --> DEPARTMENT ID${id} NOT IN NUMUSEUM`);
    }
});

//Get info about all artists
app.get('/artists', function (req, res) {
    res.status(200).json(museumArtists);
});

//Get info about artist based on specific name
app.get('/artists/name/:name', function (req, res) {
    const name = req.params.name;
    const artist = museumArtists.find(function (artist) {
        return artist.artistName === name;
    });

    if (artist) {
        res.status(200).json(artist);
    } else {
        res.status(400).send(`FAILURE --> ARTIST ${name} NOT IN NUMUSEUM`);
    }
});

//Post new user info
app.post('/users', function (req, res) {
    const userInfo = req.body;

    if (userInfo.forename) {
        if (userInfo.surname) {
            //Login info--maybe add email, telephone etc later
            if (userInfo.username && userInfo.code) {
                userInfo.id = uuid.v4();
                userInfo.favouriteItems = [];
                appUsers.push(userInfo);
                res.status(201).json(userInfo);
            } else {
                res.status(400).send('FAILURE --> BAD USER LOGIN INFO');
            }
        } else {
            res.status(400).send('FAILURE --> NO USER SURNAME');
        }
    } else {
        res.status(400).send('FAILURE --> NO USER FORENAME');
    }
});

//Put user update by id
app.put('/users/:id', function (req, res) {
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