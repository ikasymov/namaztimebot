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
    this.senderId= this.data.sender_id;
    this.site = 'http://nasaatmedia.kg/namaz-ubaktysy/'
}

Message.prototype = Object.create(RequestHandler.prototype);
Message.prototype.constructor = Message;


Message.prototype.start = async function(){
    this.site = 'http://nasaatmedia.kg/namaz-ubaktysy';
    return new Promise((resolve, reject)=>{
        if(!error){
            this._sendListOfCity().then(result=>{
                console.log(result)
            })
        }
        reject(error)

    });
};

Message.prototype._sendListOfCity = async function(){
    let date = await getDateTime();
    let dateOfNamaz = await new Promise((resolve, reject)=>{
    x('http://muftiyat.kg/ky/namas/' + date,'article', ['.content .field'])((error, list)=>{
        resolve(list.join('\n'))
    });
    return this._sendMessage(dateOfNamaz);
    });
};

Message.prototype._sendNamazTimeOfCity = async function(){
    return new Promise((resolve, reject)=>{
        this.client.get('listOfTime', (error, value)=>{
            const listOfCity = JSON.parse(value);
            const city = listOfCity[parseInt(this.message)];
            if(city !== undefined){
                this._getNamazTime(city).then((namaztime)=>{
                    resolve(this._sendMessage(namaztime))
                })
            }else{
                resolve(this._sendMessage('Введите правильные номер'))
            }

        })
    });
};

Message.prototype._getNamazTime = async function(city){
    return new Promise((resolve, reject)=>{
        const data = {
            url: this.site,
            method: 'GET',
            headers: {
                Connection: 'keep-alive',
                Cookie: 'selected_city=' + city,
                Accept: '*/*'
            }
        };
        request(data, (error, req, body)=>{
            x(body, '.list-times ul', ['li'])((error, list)=>{
                if(!error){
                    resolve(list.join(' '))
                }
                reject(error)
            })
        })
    });
};

module.exports = Message;