var express = require('express');
var router = express.Router();
//var UserModel = require('../models/User');
var hasher = require('wordpress-hash-node');
//var mysql = require(__('lib/database'));

/* GET users listing. */
router.get('/', function(req, res, next) {
    var password = 'Funnys5140';
    var hash = hasher.CheckPassword(password,"$P$Dum0FQSFevBGocOlp/l75QhdQkv21e0");
  res.json( hash );
});

router.post('/', function(req, res, next){
  var UserObject = req.body;

  UserModel
      .create(UserObject)
      .then(function(User){
        res.status(200).json(User);
      }, function(err){
        res.status(400).json(err)
      })
});

router.post('/validate', function(req, res, next){
    if(!req.body.email){
        res.json(400, 'Please make sure all the parameters are passed in the body of this request');
        return;
    }

    var getUserQuery = "select * from q39ya_users where email = '" + req.body.email + "'";

    mysql(function(err, conn) {
        if (err) {
            res.json(500, err);
            return;
        }
        conn.query(getUserQuery, function(err, rows) {
            if(rows.length > 0){
                return res.json('true');
            }
            else{
                return res.json('false');
            }
        });

    });

})

router.post('/login', function(req,res,next){
    if(!req.body.email || !req.body.password){
        res.json(400, 'Please make sure all the parameters are passed in the body of this request');
        return;
    }

    var loginResponse = {status : 'default',User : {}, msg : 'default' };
    var getUserQuery = "select * from q39ya_users where email = '" + req.body.email + "'"; //+ "and password " + req.body.password;

    mysql(function(err, conn){
        if(err){
            res.json(500,err);
            return;
        }
        conn.query(getUserQuery, function(err, rows) {
            if(rows.length > 0){

                var password = rows[0].password;
                var hash = hasher.CheckPassword(req.body.password,password);

                if(hash){
                    loginResponse.status = "Success";
                    loginResponse.User = rows[0];
                }
                else{
                    loginResponse.status = "InvalidPassword"
                    loginResponse.msg = "You typed in a wrong password";
                }
                res.json(200,loginResponse);
            }
            else{
                loginResponse.status = "InvalidUser";
                loginResponse.msg = "The user does not exist";
                res.json(200, loginResponse)
            }

        })
    })

});


module.exports = router;
