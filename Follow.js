const RequestHandler = require('./handler');



function Follow(req){
    RequestHandler.apply(this, arguments);
    this.user = this.data.id;
    this.userName = this.data.name
}

Follow.prototype = Object.create(RequestHandler.prototype);
Follow.prototype.constructor = Follow;

module.exports = Follow;