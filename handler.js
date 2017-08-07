const client = require('redis').createClient('redis://h:pc620575a0d2ca6447a07427de2a718cde3f0f974840921dc15ee4e4ae83d1104@ec2-34-231-155-48.compute-1.amazonaws.com:12419');
const request = require('request');


function RequestHandler(req){
    this.data = req.body.data;
    this.event = req.body.event;
    this.client = client;
    this.apiUrl = process.env.apiUrl;
    this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDE2OTk0NTE3LCJwaG9uZSI6IjYzODUiLCJwYXNzd29yZCI6IiQyYSQxMCR3TExDdVlNekpNYmZNQVhobGpBUXVlc2ZiamE1cUtTUmRBRFE2cG9qTFh5MWg1cFVjeUI3VyIsImlzQm90Ijp0cnVlLCJjb3VudHJ5Ijp0cnVlLCJpYXQiOjE1MDIwODExNzZ9.NNRiLjy5ExAmcGxyGspnonif9kdl5WHuUPpesNbS2v8'
}

RequestHandler.prototype._sendMessage = async function(message){
    const data = {
        url: this.apiUrl + '/chats/' + this.messageId + '/write',
        method: 'POST',
        body: {
            type: 'text/plain',
            content: message
        },
        headers: {
            'X-Namba-Auth-Token': this.token
        }
    };
    return new Promise((resolve, reject)=>{
        request(data, (error, req, body)=>{
            if(error){
                reject(error)
            }
            resolve(body)
        })
    })
};


module.exports = RequestHandler;
