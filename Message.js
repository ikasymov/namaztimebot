const RequestHandler = require('./handler');
const Xray = require('x-ray');
const x = Xray();
const request = require('request');

async function getDateTime() {

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

function Message(req){
    RequestHandler.apply(this, arguments);
    this.messageId = this.data.chat_id;
    this.message = this.data.content;
}

Message.prototype = Object.create(RequestHandler.prototype);
Message.prototype.constructor = Message;


Message.prototype.start = async function(){
    this.site = 'http://nasaatmedia.kg/namaz-ubaktysy';
    return new Promise((resolve, reject)=>{
        if(this.message.toLowerCase() === 'start' || this.message.toLowerCase() === 'старт'){
            this._sendListOfCity().then(result=>{
                console.log(result)
            })
        }else{
            this._sendMessage('Введи старт для просмотра времени намаза').then(result=>{
                console.log(result)
            })
        }

    });
};

Message.prototype._sendListOfCity = async function(){
    let date = await getDateTime();
    return new Promise((resolve, reject)=>{
        x('http://muftiyat.kg/ky/namas/' + date,'article', ['.content .field'])((error, list)=>{
            this._sendMessage(list.join('\n')).then(result=>{
                resolve(result)
            })
        });
    });
};

module.exports = Message;