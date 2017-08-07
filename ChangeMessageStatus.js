const Message = require('./Message');

function ChangeMessageStatus(req){
    Message.apply(this, arguments)
}

ChangeMessageStatus.prototype = Object.create(Message.prototype);
ChangeMessageStatus.prototype.constructor = ChangeMessageStatus;
