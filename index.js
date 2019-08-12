// Import express
let express = require('express');
var cors = require('cors');
// Import Body parser
let bodyParser = require('body-parser');

// Initialize the app
let app = express();
app.use(cors());
// Import routes
let apiRoutes = require("./api-routes/api-routes")

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.urlencoded())
app.use(bodyParser.json());

// Setup server port
var port = process.env.PORT || 3000;
// Use Api routes in the App
app.use('/', apiRoutes)
/*
app.post('/myaction', function(req, res) {
  res.send('You sent the name "' + req.body.name + '".');
});
*/

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});

//getAllPosts