var express = require('express');
var router = express.Router();
//var mysql = require(__('lib/database'));


/* GET home page. */
router.get('/', function(req, res, next) {
   res.json("Default route for Messages");

});

router.post('/', function (req, res) {


  res.sendStatus(200);
});

module.exports = router;
