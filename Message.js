const RequestHandler = require('./handler');

function Message(req){
    RequestHandler.apply(this, arguments);
    this.messageId = this.data.chat_id;
    this.message = this.data.content;
    this.senderId= this.data.sender_id

}

Message.prototype = Object.create(RequestHandler.prototype);
Message.prototype.constructor = Message;


Message.prototype.start = async function(){
    RequestHandler.start.apply(this, arguments);
    return await this._sendMessage('Hello world');
};

module.exports = Message;