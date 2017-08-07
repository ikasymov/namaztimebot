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
    RequestHandler.prototype.start.apply(this, arguments);
    const text = await this._getNamaTime();
    this.site = 'http://nasaatmedia.kg/namaz-ubaktysy';
    return await this._sendMessage(text);
};

Message.prototype._getNamaTime = async function(){
    return new Promise((resolve, reject)=>{
        const city = 'osh';
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