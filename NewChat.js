const RequestHandler = require('./handler');




function NewChat(req){
    RequestHandler.apply(this, arguments);
    this.messageId = this.data.chat_id
}

NewChat.prototype = Object.create(RequestHandler.prototype);
NewChat.prototype.constructor = NewChat;


NewChat.prototype.start = async function(){
    return this._sendMessage('Добро пожаловать введите "старт" что бы узнать время намаза')
};

module.exports = NewChat;