const RequestHandler = require('./handler');
const Xray = require('x-ray');
const x = Xray();

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
    await this._getNamaTime();
    return await this._sendMessage('Hello world');
};

Message.prototype._getNamaTime = async function(){
    x(this.site, '.list-times ul', ['li'])((error, list)=>{
        console.log(list)
    })
};

module.exports = Message;