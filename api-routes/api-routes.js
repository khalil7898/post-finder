// api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to DO Nothing Application(Enjoy!!)XD'
    });
});

// set /getPosts  route: 
const postsController = require('../controllers/postsController');
router.route('/getPosts')
    .post(postsController.getAllPosts);

// Export API routes
module.exports = router;