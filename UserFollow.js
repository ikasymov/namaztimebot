const Follow = require('./Follow');

function UserFollow(req){
    Follow.apply(this, arguments);
}

UserFollow.prototype = Object.create(Follow.prototype);
UserFollow.prototype.constructor = UserFollow;

UserFollow.prototype.signUp = async function(){
    return new Promise((resolve, reject)=>{
        this.client.set(this.user + 'signUp', true, ((error)=>{
            if(!error){
                resolve(true)
            }
            reject(false)
        }))
    });
};


module.exports = UserFollow;