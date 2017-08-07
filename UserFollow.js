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
                console.log(body)
                resolve(body)
            }
            reject(error)
        })
    })
};


module.exports = UserFollow;