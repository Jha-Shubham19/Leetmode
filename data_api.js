const puppeteer = require('puppeteer');
const questionJson = require('./allquestion.json');
const property = {};

let arr = questionJson.data.questionList.questions;
console.log(arr.length);
for(let i of arr)   
    property[i.titleSlug] = i.difficulty;
const data_api = async (user)=> {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    user = String(user);
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
    
    const pre = await page.evaluate(()=>{
        return document.getElementsByTagName('pre')[0].innerHTML;
    })
   
    browser.close();
    let obj = JSON.parse(pre);
    for(let i of obj.data.recentAcSubmissionList)
        i.difficulty = property[i.titleSlug];

    obj.data.matchedUser.username = user;
    return obj;
}

module.exports = data_api;