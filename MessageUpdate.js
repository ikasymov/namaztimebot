const Message = require('./Message');

function UpdateMessage(req){
    Message.apply(this, arguments)
}

UpdateMessage.prototype = Object.create(Message);
UpdateMessage.prototype.constructor = UpdateMessage;

module.exports = UpdateMessage;