var express = require('express');
var router = express.Router();
var peopleModel = require('./../models/dbconnect');
/* GET home page. */
router.post('/', function (req, res, next) {
    var body = req.body;
    var people = new peopleModel({
        name: body.name,
        age: body.age,
        wechat: body.wechat,
        gender: body.gender
    });
    people.save((err)=>{
        // console.log('aaa');
        if(err){
            throw err;
        }else {
            console.log('写入数据成功');
        }
    });
    res.end();
});

module.exports = router;