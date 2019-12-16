// const express = require('express');
// const path = require('path');
// const port = process.env.PORT || 3000;
// const app = express();

// // the __dirname is the current directory from where the script is running
// app.use(express.static(path.resolve(__dirname, './dist')));
// // send the user to index html page inspite of the url
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './dist/index.html'));
// });

// app.listen(port);

// app.use(express.static(path.join(__dirname, 'dist')));
// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });
// app.listen(port);

const express = require('express');
// const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
// app.use(favicon(__dirname + '/public/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use('/', express.static(path.join(__dirname, 'dist')));
// app.use('/dist', express.static(path.join(__dirname, 'dist')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });
app.listen(port);
