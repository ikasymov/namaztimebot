const RequestHandler = require('./handler');




function NewChat(req){
    RequestHandler.apply(this, arguments)
}

NewChat.prototype = Object.create(RequestHandler.prototype);
NewChat.prototype.constructor = NewChat;

module.exports = NewChat;