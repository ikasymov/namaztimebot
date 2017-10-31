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


async function setTyppingStatus(chatId, status){
  let setStatus = {
    true: 'typing',
    false: 'stoptyping'
  };
  let data = {
    url: 'https://namba1.co/api' + '/chats/' + chatId + '/' + setStatus[status],
    method: 'GET',
    headers: {
      'X-Namba-Auth-Token': token
    }
  };
  return new Promise((resolve, reject)=>{
    request(data, (error, req, body)=>{
      if(error){
        reject(error)
      }
      resolve(true)
    })
  });
};


router.post('/', async function(req, res, next){
    const event = req.body.event;
    if(event === 'message/new'){
        console.log(req.body)
        let chat_id = req.body.data.chat_id;
        await setTyppingStatus(chat_id, true);
        let content = req.body.data.content;
        if(content.toLowerCase() === 'start' || content.toLowerCase() === 'старт'){
            let date = getDateTime();
            x('http://muftiyat.kg/ky/namas/' + date,'article', ['.content .field'])((error, list)=>{
                setTyppingStatus(chat_id, false).then(result=>{
                  if(list.length <= 0){
                    return sendMessage(chat_id, 'Еще не известно время намаза, попробуйте позже')
                  }
                  return sendMessage(chat_id, list.join('\n'))
                }).then(
                 console.log('send namaz')
                )
  
              res.end()
            });
        }else{
            sendMessage(req.body.data.chat_id, 'Введите "старт" что бы узнать время намаза')
            res.end()
        }
    }else if(event === 'user/follow'){
      const data = {
        url: 'https://namba1.co/api' + '/chats/create',
        method: 'POST',
        body: {
          name: 'new chat',
          members: [req.body.data.id]
        },
        headers: {
          'X-Namba-Auth-Token': token
        },
        json: true
      };
      return new Promise((resolve, reject)=>{
        request(data, (error, req, body)=>{
            let sendText = 'Данный бот позволяет узнать время намаза. Выберите одну из команд: \n "старт" - узнать время намаза';
            let chatId = body.data.membership.chat_id;
            sendMessage(chatId, sendText).then(result=>{
              resolve(res.end())
            })
        });
      })
  
    }
    else{
        console.log('not event');
        res.end()
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


