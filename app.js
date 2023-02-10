const express = require('express');
const data_api = require('./data_api');
const asyncc = require('async');
const path = require('path');
const app = express();
const router = express.Router();

const port = 8000;

let static = path.join(__dirname , 'static');
console.log(static);

router.use('/friends/:name' , express.static(`${static}`+'/friends'));
router.use(express.static(`${static}`+'/mainpage'));

let allfriendsData;
let allfriends = ['vinit_jha' , 'jha-shubham19' ,'kamalyadav01', 'brijesh_09'];
router.get('/allfriends' , async (req , res) => {
    allfriends = req.query.usernames.split(';');

    let funProp = [];
    for(let i of allfriends) 
        funProp.push(data_api.bind(null , i));
    asyncc.parallel(funProp).then(result => {allfriendsData = result ; res.json(result)});
    // res.json(allfriendsData);
});
router.get('/data_api/:name' , async (req , res)=> {
    if(allfriendsData == undefined){
        data_api(req.params.name).then(result => res.json(result));
    }
    else{
        res.json(allfriendsData.find(ele => req.params.name == ele.data.matchedUser.username));
    }
});

app.use(router);

app.listen(port , ()=>{
    console.log(`http://localhost:${port}/`);
});




