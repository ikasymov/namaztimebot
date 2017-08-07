const express = require('express');
const router = express.Router();
const client = require('redis').createClient('redis://h:pc620575a0d2ca6447a07427de2a718cde3f0f974840921dc15ee4e4ae83d1104@ec2-34-231-155-48.compute-1.amazonaws.com:12419');

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(req.body);
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next){
  console.log(req.body)
});

module.exports = router;



async function requestHandler(req){
    console.log(req.body)
}