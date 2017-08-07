const express = require('express');
const router = express.Router();
const Message = require('../Message');
const RequestHandler = require('../handler');
const Follow = require('../Follow');
const UserFollow = require('../UserFollow');
const UserUnfollow = require('../UserUnfollow');
const MessageUpdate = require('../MessageUpdate');
const NewChat = require('../NewChat');
const request = require('request');
const Xray = require('x-ray');
const x = Xray();
const client = require('redis').createClient('redis://h:pc620575a0d2ca6447a07427de2a718cde3f0f974840921dc15ee4e4ae83d1104@ec2-34-231-155-48.compute-1.amazonaws.com:12419');

/* GET home page. */
router.get('/', function(req, res, next) {
     x('http://nasaatmedia.kg/namaz-ubaktysy/', '.wrapper-main', ['.time_select.browser-default.waves-effect.waves-light.btn option'])((error, list)=>{
        // let text = '';
        // list.forEach((elem, i)=>{
        //     text += i + '\r' + elem + '\n'
        // });
        // console.log(text)
         let text = list.map((elem, i)=>{
             return i + ' '+ elem
         }).toString();
         text.split(',').join('\n')
    });
    res.render('index', { title: 'Express' });
});

let handler = {
    'message/new': Message,
    'message/update': MessageUpdate,
    'user/follow': UserFollow,
    'user/unfollow': UserUnfollow,
    'chat/new': NewChat
};

router.post('/', function(req, res, next){
    const event = req.body.event;
    const currentClass = new handler[event](req);
    currentClass.start().then((result)=>{
        // console.log(result);
        res.end()
    })
});

module.exports = router;



async function requestHandler(req){
    console.log(req.body)
}


