const Follow = require('./Follow');
const request = require('request');
function UserFollow(req){
    Follow.apply(this, arguments);
}

UserFollow.prototype = Object.create(Follow.prototype);
UserFollow.prototype.constructor = UserFollow;

UserFollow.prototype.signUp = async function(){

};
UserFollow.prototype.start = async function(){
    return this.createChat();
};



UserFollow.prototype.createChat = async function(){
    const data = {
        url: this.apiUrl + '/chats/create',
        method: 'POST',
        body: {
            name: 'new chat',
            members: [this.user]
        },
        headers: {
            'X-Namba-Auth-Token': this.token
        },
        json: true
    };
    return new Promise((resolve, reject)=>{
        request(data, (error, req, body)=>{
            if(!error){
                this.messageId = body.data.membership.chat_id
                resolve(this._sendMessage('Добро пожаловать введите "старт" что бы узнать время намаза'))
            }
            reject(error)
        })
    })
};


module.exports = UserFollow;