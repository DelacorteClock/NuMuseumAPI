const http = require('http'),
        fs = require('fs'),
        url = require('url');

//Make server
http.createServer(function (request, response) {
    //Make address the request url, interpreted the parsed address and make a blank string for the file path
    var address = request.url, interpreted = url.parse(address, true), filePath = '';
    //Return documentation.html file just if address includes 'documentation' in the path name
    if (interpreted.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html'; 
    }
    //Add log information to log.txt
    fs.appendFile('log.txt', 'User requested ' + address + ' at ' + new Intl.DateTimeFormat('en-GB', {dateStyle: 'full', timeStyle: 'long', timeZone: 'UTC'}).format(new Date()) + '\n\n', function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log('LOG UPDATED');
        }
    });
    //If there is no error write the contents of the filePath's file in the response
    fs.readFile(filePath, (error, data) => {
        if (error) {
            throw error;
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}).listen(8080);
console.log('TESTING SERVER RUNNING ON PORT 8080');