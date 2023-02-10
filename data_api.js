const puppeteer = require('puppeteer');
const questionJson = require('./allquestion.json');
const property = {};
// console.log(questionJson);
// let arr = JSON.parse(questionJson);
let arr = questionJson.data.questionList.questions;
console.log(arr.length);
for(let i of arr)   
    property[i.titleSlug] = i.difficulty;
const data_api = async (user)=> {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    user = String(user);
    // const some = `
    // userProblemsSolved($username: String!) {
    //     allQuestionsCount {
    //         difficulty
    //         count
    //     }
    // `;
    const query = `
    {
        allQuestionsCount {
            difficulty
            count
        }
        matchedUser(username:"${user}") {
            submitStatsGlobal{
                acSubmissionNum {
                    difficulty
                    count    
                }
            }
        }
        recentAcSubmissionList(username: "${user}", limit: 20){ 
            timestamp
            title
            titleSlug
        }
        
    }`;

    await page.goto('https://leetcode.com/graphql?query='+query);
    
    // page.waitForSelector('#hard');

    // const pre = await page.evaluate(()=> {
    //     console.log("diffLev");
    //     let diffLev = [document.getElementById('easy') , document.getElementById('medium') , document.getElementById('hard')];
    //     let some = {
    //         easy:[] , medium:[] , hard:[]
    //     };
        
    //     for(i of diffLev) {
    //         // some.easy[0].push(i.firstChild.nodeName);
    //         let any = i.id;
    //         for(j of i.children[0].children) {
    //             some[any].push([j.children[0].innerHTML , j.children[0].getAttribute('href')]);
    //         }
    //     }
    //     return some;
    // });
    const pre = await page.evaluate(()=>{
        return document.getElementsByTagName('pre')[0].innerHTML;
    })
   
    browser.close();
    // console.log(pre);
    let obj = JSON.parse(pre);
    for(let i of obj.data.recentAcSubmissionList)
        i.difficulty = property[i.titleSlug];

    obj.data.matchedUser.username = user;
    return obj;
}
// console.log(data_api('vinit_jha').then((res)=>console.log(res)));
// data_api();
module.exports = data_api;