//Key tools
const express = require('express'), app = express(), morgan = require('morgan'), bodyParser = require('body-parser'), uuid = require('uuid');

var museumItems = [
    {
        "objectID": "1340001",
        "title": "PVC Doric Column Factory",
        "artistDisplayName": "PVC Doric Duck",
        "exhibit": "Simpl Animation",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Animated Film",
        "objectDate": "2022",
        "medium": "Film",
        "dimensions": "NONE",
        "description": "A factory makes PVC doric columns which are then used to construct a house in a short animated film.",
        "department": "4 Film",
        "isPublicDomain": "FALSE",
        "isFeatured": "TRUE"
    },
    {
        "objectID": "1340011",
        "title": "Duck's Trip to School",
        "artistDisplayName": "PVC Doric Duck",
        "exhibit": "Simpl Animation",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Animated Film",
        "objectDate": "2022",
        "medium": "Film",
        "dimensions": "NONE",
        "description": "A duck takes a trip to school and makes several funny mistakes on the way in this short animated film.",
        "department": "4 Film",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "1440001",
        "title": "Architectural Photography Collection One",
        "artistDisplayName": "ClassicalFilm",
        "exhibit": "Photography Films",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Photography Film",
        "objectDate": "2022",
        "medium": "Film",
        "dimensions": "NONE",
        "description": "This film includes views of architecture and architectural details at a university.",
        "department": "4 Film",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "1440011",
        "title": "Architectural Photography Collection Two",
        "artistDisplayName": "ClassicalFilm",
        "exhibit": "Photography Films",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Photography Film",
        "objectDate": "2022",
        "medium": "Film",
        "dimensions": "NONE",
        "description": "This film includes views of architecture and architectural details at two universities.",
        "department": "4 Film",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "2100001",
        "title": "Plastic Silhouettes: The Motion of a Strange Tree",
        "artistDisplayName": "Quik the Artist",
        "exhibit": "Plastic Silhouettes",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Painting (B&W)",
        "objectDate": "2023",
        "medium": "Painting",
        "dimensions": "24 x 14.5",
        "description": "This abstract artwork depicts the life cycle of an imaginary plastic tree.",
        "department": "0 Painting",
        "isPublicDomain": "FALSE",
        "isFeatured": "TRUE"
    },
    {
        "objectID": "2100011",
        "title": "Delacorte Clock Simplified",
        "artistDisplayName": "Quik the Artist",
        "exhibit": "NONE",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Painting (B&W)",
        "objectDate": "2023",
        "medium": "Painting",
        "dimensions": "20 x 30",
        "description": "This is a simple black and white representation of the Delacorte Clock.",
        "department": "0 Painting",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "1250001",
        "title": "Vibration No 450",
        "artistDisplayName": "Solid Architecture",
        "exhibit": "Monumental Structures",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Building Model",
        "objectDate": "2022",
        "medium": "Digital",
        "dimensions": "NONE",
        "description": "This virtual building is a monument to celebrate the concept of vibration. The juxtaposition of limestone and glass captures the monument's essence: a modern interpretation of the ancient dome. Repetitive art deco-inspired details represent the crests of waves in vibrations.",
        "department": "5 Architecture",
        "isPublicDomain": "FALSE",
        "isFeatured": "TRUE"
    },
    {
        "objectID": "1250011",
        "title": "Museum No 238",
        "artistDisplayName": "Solid Architecture",
        "exhibit": "Monumental Structures",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Building Model",
        "objectDate": "2022",
        "medium": "Digital",
        "dimensions": "NONE",
        "description": "This is a plan for the exterior of a museum building. The architectural style is inspired by classical architecture but modernised to create a more striking effect. A monumental dome in the middle of the museum is covered internally with a painting.",
        "department": "5 Architecture",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "1250021",
        "title": "Flute No 1618",
        "artistDisplayName": "Solid Architecture",
        "exhibit": "Monumental Structures",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Building Model",
        "objectDate": "2022",
        "medium": "Digital",
        "dimensions": "NONE",
        "description": "This building's design features triangular forms and pyramid-shaped entrance structures. Its red roof was inspired by pointed gothic arches.",
        "department": "5 Architecture",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "1250031",
        "title": "Lute No 2414",
        "artistDisplayName": "Solid Architecture",
        "exhibit": "Monumental Structures",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Building Model",
        "objectDate": "2022",
        "medium": "Digital",
        "dimensions": "NONE",
        "description": "Lute is inspired by the geometrical characteristics of octagons, rectangles and circles. It features miniature residential towers on the setback and a sculptural roof resembling a pomegranate.",
        "department": "5 Architecture",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "1160001",
        "title": "North + East Waves",
        "artistDisplayName": "Quik the Artist",
        "exhibit": "Simpl Forms",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Virtual Painting (B&W)",
        "objectDate": "2021",
        "medium": "Digital",
        "dimensions": "NONE",
        "description": "This black and white wave-inspired virtual painting is intended to make a strong visual impact.",
        "department": "6 Virtual Painting",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "1160011",
        "title": "The Complement",
        "artistDisplayName": "Quik the Artist",
        "exhibit": "Simpl Forms",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Virtual Painting (B&W)",
        "objectDate": "2021",
        "medium": "Digital",
        "dimensions": "NONE",
        "description": "Two artistic forms complement and connect to each other in this black and white virtual painting.",
        "department": "6 Virtual Painting",
        "isPublicDomain": "FALSE",
        "isFeatured": "TRUE"
    },
    {
        "objectID": "1160021",
        "title": "CycleMap",
        "artistDisplayName": "Quik the Artist",
        "exhibit": "Simpl Forms",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Virtual Painting (B&W)",
        "objectDate": "2021",
        "medium": "Digital",
        "dimensions": "NONE",
        "description": "Black lines inspired by public transport maps travel across the plain white background of this virtual painting.",
        "department": "6 Virtual Painting",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "1270001",
        "title": "Bird in Flight",
        "artistDisplayName": "Standard PVC",
        "exhibit": "NuuPVC++",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Virtual Sculpture (PVC)",
        "objectDate": "2022",
        "medium": "Digital",
        "dimensions": "NONE",
        "description": "This virtual PVC sculpture is inspired by the anatomy of a column. It consists of an undulating shaft which decreases in diameter at the top to form a cone-like capital.",
        "department": "7 Virtual Sculpture",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "1270011",
        "title": "Monkey in PVC Pipe",
        "artistDisplayName": "Standard PVC",
        "exhibit": "NuuPVC++",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Virtual Sculpture (PVC)",
        "objectDate": "2022",
        "medium": "Digital",
        "dimensions": "NONE",
        "description": "The main highlight of the museum's virtual sculpture collection--Monkey in PVC Pipe--is an abstract sculpture designed to encourage viewers to think. Its title was inspired by the artist's sight of a monkey in a PVC pipe in an educational film. The title is connected to nothing about the sculpture other than the fact that it is a 'virtual PVC' sculpture.",
        "department": "7 Virtual Sculpture",
        "isPublicDomain": "FALSE",
        "isFeatured": "TRUE"
    },
    {
        "objectID": "3520001",
        "title": "Nullem's Place",
        "artistDisplayName": "Minobbiane",
        "exhibit": "NONE",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Book",
        "objectDate": "2019",
        "medium": "Written",
        "dimensions": "NONE",
        "description": "A duck named Nullem isolates itself in a windowless building shaped like a concrete block located in an uninhabited desert. After years of complete isolation, a bell's chime awakens Nullem in the middle of the night. Nullem is no longer alone.",
        "department": "2 Literature",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "3520011",
        "title": "Searching and Viewing the City",
        "artistDisplayName": "Minobbiane",
        "exhibit": "NONE",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Book",
        "objectDate": "2020",
        "medium": "Written",
        "dimensions": "NONE",
        "description": "Pots--a gullible tourist elephant--wins a trip to New Duck (a large city). Residents of New Duck take advantage of Pots' gullible personality.",
        "department": "2 Literature",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "3520021",
        "title": "ChimeSounds",
        "artistDisplayName": "Minobbiane",
        "exhibit": "NONE",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Poem",
        "objectDate": "2020",
        "medium": "Written",
        "dimensions": "NONE",
        "description": "This poem written in an unconventional format was inspired by the sound and art of the Delacorte Clock.",
        "department": "2 Literature",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "2230001",
        "title": "Rubber Suit (Black)",
        "artistDisplayName": "Anonymous",
        "exhibit": "Contemporary Clothing",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Shirt/Pants",
        "objectDate": "2022",
        "medium": "Rubber",
        "dimensions": "90 x 55",
        "description": "This contemporary piece of artistic clothing is comprised of a shirt connected to pants. Its construction from an unconventional material (black rubber) increases its visual impact.",
        "department": "3 Clothing",
        "isPublicDomain": "FALSE",
        "isFeatured": "TRUE"
    },
    {
        "objectID": "2230011",
        "title": "The Leathers",
        "artistDisplayName": "Anonymous",
        "exhibit": "Contemporary Clothing",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Pants",
        "objectDate": "2022",
        "medium": "Leather",
        "dimensions": "110 x 30",
        "description": "These contemporary pants make a powerful--almost jarring--impact.",
        "department": "3 Clothing",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    },
    {
        "objectID": "2230021",
        "title": "Plastic Silhouettes (Clothing)",
        "artistDisplayName": "Anonymous",
        "exhibit": "Contemporary Clothing",
        "primaryImage": "NONE",
        "additionalImages": "NONE",
        "videoURL": "NONE",
        "infoURL": "NONE",
        "objectName": "Pants",
        "objectDate": "2022",
        "medium": "Rubber",
        "dimensions": "110 x 30",
        "description": "These beige modern pants were the inspiration of the name of the Plastic Silhouettes exhibit. They are also called the Plastic Pants. The ends of the legs increase in diameter and resemble trumpets.",
        "department": "3 Clothing",
        "isPublicDomain": "FALSE",
        "isFeatured": "FALSE"
    }
];

var museumDepartments = [
    {
        "deptID": "0",
        "deptTitle": "Painting",
        "deptDesc": "NuMuseum's Painting Department (PD) is focused on physical paintings, drawings, illustrations and other forms of two-dimensional art made in the 21st century. Officials at the PD store, investigate, maintain and write about the works in the collection. It is currently not possible to see any items from the PD in person because they are stored in the NuMuseum private collection."
    },
    {
        "deptID": "1",
        "deptTitle": "Sculpture",
        "deptDesc": "NuMuseum's Sculpture Department (PD) is focused on physical sculptures and other forms of three-dimensional art made in the 21st century. Officials at the SD store, investigate, maintain and write about the works in the collection. It is currently not possible to see any items from the SD in person because they are stored in the NuMuseum private collection."
    },
    {
        "deptID": "2",
        "deptTitle": "Literature",
        "deptDesc": "NuMuseum's Literature Department (LD) maintains a collection of written work including stories and poems. All items in the LD are from the 21st century. Officials at the LD identify works to add to the NuMuseum collection by investigating their contents. The items in the LD are in a mix of digital and hand-written formats. It is not possible to see hand-written items in person because they are stored in the NuMuseum private collection."
    },
    {
        "deptID": "3",
        "deptTitle": "Clothing",
        "deptDesc": "NuMuseum's Clothing Department (CD) maintains a physical collection of rare, artistic and notable articles of clothing. Articles in the collection include dresses, pants, shirts and skirts. Officials at the CD do their best to ensure that the often rare or unconventional materials from which the collection items are made are not dirtied, damaged or torn. All items are in a private collection and used by the museum founder when travelling. Items may exit the collection occasionally because of reasons including fitting the museum founder poorly or being banned (eg for toxic scents) because of popular vote by museum officials."
    },
    {
        "deptID": "4",
        "deptTitle": "Film",
        "deptDesc": "NuMuseum's Film Department (FD) maintains a digital collection of recorded, photographical and animated films from the 21st century. All films in the collection are the property of the NuMuseum itself. "
    },
    {
        "deptID": "5",
        "deptTitle": "Architecture",
        "deptDesc": "NuMuseum's Architecture Department (AD) maintains a digital collection of architectural concepts and models. The items in the collection are stored mainly in the 3mf file format which allows them to be visited and photographed virtually at any time by museum officials."
    },
    {
        "deptID": "6",
        "deptTitle": "Virtual Painting",
        "deptDesc": "ADD DESC"
    },
    {
        "deptID": "7",
        "deptTitle": "Virtual Sculpture",
        "deptDesc": "ADD DESC"
    },
    {
        "deptID": "8",
        "deptTitle": "Design",
        "deptDesc": "ADD DESC"
    },
    {
        "deptID": "9",
        "deptTitle": "Miscellaneous",
        "deptDesc": "ADD DESC"
    }
];

var museumArtists = [
    {
        "artistName": "Anonymous",
        "artistBiography": "Anonymous artists/designers designed several items in the NuMuseum--most notably those in the clothing collection.",
        "artistStart": "0",
        "artistMedium": "Multiple"
    },
    {
        "artistName": "ClassicalFilm",
        "artistBiography": "ADD DESC",
        "artistStart": "2012",
        "artistMedium": "Film"
    },
    {
        "artistName": "Minobbiane",
        "artistBiography": "Minobbiane is a rabbit who likes to write stories and gets inpiration from the city in which it lives.",
        "artistStart": "2009",
        "artistMedium": "Written"
    },
    {
        "artistName": "PVC Doric Duck",
        "artistBiography": "ADD DESC",
        "artistStart": "2021",
        "artistMedium": "Film"
    },
    {
        "artistName": "Quik the Artist",
        "artistBiography": "Quik the Artist is a duck who thinks and draws in a two dimensional way. Quik the Artist resides in the dome of a tall and historical hotel building",
        "artistStart": "2020",
        "artistMedium": "Painting + Digital"
    },
    {
        "artistName": "Solid Architecture",
        "artistBiography": "ADD DESC",
        "artistStart": "2022",
        "artistMedium": "Digital"
    },
    {
        "artistName": "Standard PVC",
        "artistBiography": "ADD DESC",
        "artistStart": "2022",
        "artistMedium": "Digital"
    }
];

var appUsers = [];

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
            userInfo.id = uuid.v4;
            appUsers.push(userInfo);
            res.status(201).json(userInfo);
        } else {
            res.status(400).send('FAILURE --> NO USER SURNAME');
        }
    } else {
        res.status(400).send('FAILURE --> NO USER FORENAME');
    }
});

app.listen(1618, () => {
    console.log('APPLICATION ACTIVE ---> LISTENING @ PORT 1618');
});