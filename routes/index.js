const express = require('express');
const router = express.Router();
const request = require('request');
const Xray = require('x-ray');
const x = Xray();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDE2OTk0NTE3LCJwaG9uZSI6IjYzODUiLCJwYXNzd29yZCI6IiQyYSQxMCR3TExDdVlNekpNYmZNQVhobGpBUXVlc2ZiamE1cUtTUmRBRFE2cG9qTFh5MWg1cFVjeUI3VyIsImlzQm90Ijp0cnVlLCJjb3VudHJ5Ijp0cnVlLCJpYXQiOjE1MDIwODExNzZ9.NNRiLjy5ExAmcGxyGspnonif9kdl5WHuUPpesNbS2v8'

function getDateTime() {

    let date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    let dash = '-';
    return day + month + year

};

router.post('/', function(req, res, next){
    const event = req.body.event;
    if(event === 'message/new'){
        let content = req.body.data.content;
        if(content.toLowerCase() === 'start' || content.toLowerCase() === 'старт'){
            let date = getDateTime();
            x('http://muftiyat.kg/ky/namas/' + date,'article', ['.content .field'])((error, list)=>{
                sendMessage(req.body.data.chat_id, list.join('\n')).then(
                    console.log('send namaz')
                )
            });
        }else{
            sendMessage(req.body.data.chat_id, 'Введите "старт" что бы узнать время намаза')
        }
    }else{
        console.log('not event')
    }

});


function sendMessage(messageId, message){
    const data = {
        url: 'https://namba1.co/api' + '/chats/' + messageId + '/write',
        method: 'POST',
        body: {
            type: 'text/plain',
            content: message
        },
        headers: {
            'X-Namba-Auth-Token': token
        },
        json: true
    };
    return new Promise((resolve, reject)=>{
        request(data, (error, req, body)=>{
            if(error){
                reject(error)
            }
            resolve(body)
        })
    })
}
module.exports = router;


