const Follow = require('./Follow');

function UserUnfollow(req){
    Follow.apply(this, arguments)
}

UserUnfollow.prototype = Object.create(Follow.prototype);
UserUnfollow.prototype.constructor = UserUnfollow;


UserUnfollow.prototype._deleteAccount = async function(){
    return new Promise((resolve, reject)=>{
        this.client.del(this.user + 'signUp', (error=>{
            if(!error){
                resolve(true)
            }
            reject(false)
        }))
    })
};



module.exports = UserUnfollow;