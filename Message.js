const RequestHandler = require('./handler');
const Xray = require('x-ray');
const x = Xray();
const request = require('request');

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
        this.client.get(this.senderId + 'step', (error, value)=>{
            if(!error){
                if(this.message.toLowerCase() === 'start' || this.message.toLowerCase() === 'старт'){
                    resolve(this._sendListOfCity())
                }else if(value === 'wait_time'){
                    resolve(this._sendNamazTimeOfCity())
                }else{
                   resolve(this._sendMessage('Введите старт для начало'))
                }
            }
            reject(error)

        });
    });
};

Message.prototype._sendListOfCity = async function(){
    return new Promise((resolve, reject)=>{
        x(this.site, '.wrapper-main', {
            'ru_list': x('.valign-wrappers', ['.time_select.browser-default.waves-effect.waves-light.btn option']),
            'en_list': x('.valign-wrappers', ['.time_select.browser-default.waves-effect.waves-light.btn option@value'])
        })((error, list)=>{
            if(error){
                reject(error)
            }
            this.client.set('listOfTime', JSON.stringify(list.en_list));
            let text = list.ru_list.map((elem, i)=>{
                return i + ' '+ elem
            }).toString().split(',').join('\n');
            this.client.set(this.senderId + 'step', 'wait_time');
            resolve(this._sendMessage(text));
        });
    });
};

Message.prototype._sendNamazTimeOfCity = async function(){
    return new Promise((resolve, reject)=>{
        this.client.get('listOfTime', (error, value)=>{
            const listOfCity = JSON.parse(value);
            // console.log(listOfCity)
            // this._getNamazTime(listOfCity[this.message])
            console.log(listOfCity[parseInt(this.message)]);
            this._getNamazTime(listOfCity[parseInt(this.message)]).then((namaztime)=>{
                resolve(this._sendMessage(namaztime))
            })

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