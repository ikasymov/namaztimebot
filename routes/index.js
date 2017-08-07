const express = require('express');
const router = express.Router();
const Message = require('../Message');
const RequestHandler = require('../handler');
const Follow = require('../Follow');
const UserFollow = require('../UserFollow');
const UserUnfollow = require('../UserUnfollow');
const NewChat = require('../NewChat');
const client = require('redis').createClient('redis://h:pc620575a0d2ca6447a07427de2a718cde3f0f974840921dc15ee4e4ae83d1104@ec2-34-231-155-48.compute-1.amazonaws.com:12419');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

let handler = {
    'message/new': Message,
    'message/update': Message,
    'user/follow': UserFollow,
    'user/unfollow': UserUnfollow,
    'chat/new': NewChat
};

router.post('/', function(req, res, next){
    const event = req.body.event;
    let currentClass = new handler[event](req);
    currentClass.start()
});

module.exports = router;



async function requestHandler(req){
    console.log(req.body)
}


