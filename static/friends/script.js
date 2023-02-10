function setWidthOfPie(solvedQuestion){
    let pie = document.getElementsByClassName('pieChart')[0];
    let pieHeight = pie.clientHeight;
    pie.style.width = pieHeight+'px';

    let sq = solvedQuestion.map(val => val.count);
    // console.log("skj to bot h");
    console.log(sq);
    let angOne = parseInt(sq[1]/sq[0]*360);
    let angTwo = parseInt(sq[2]/sq[0]*360);
    console.log(angOne , angTwo);
    pie.style.backgroundImage = `conic-gradient(#009964 0deg,#009964 ${angOne}deg ,
         #ffa11b ${angOne}deg, #ffa11b ${angTwo+angOne}deg , #da211a ${angTwo}deg)`;
}
function addListeners(myObj) {
    for(let i of document.getElementsByClassName("pseNav")[0].children)
        i.addEventListener("click" , function(){
            // console.log("first")
            document.getElementsByClassName("whenSelected")[0].classList.remove("whenSelected");
            this.classList.add("whenSelected");
            fillProblemsList(myObj , this.innerHTML);
        });

    fillProblemsList(myObj , 'Easy');
}
function fillProblemsList(myObj , diff) {
    console.log(diff);
    let mainArray = myObj.data.recentAcSubmissionList;
    // console.log(mainArray);
    mainArray = mainArray.filter(val=> val.difficulty == diff);
    let divProb = document.getElementsByClassName('problems')[0];
    divProb.innerHTML = '';
    mainArray.map((val) => {
        let a = document.createElement('a');
        a.setAttribute('href' , 'https://leetcode.com/problems/'+val.titleSlug);
        a.setAttribute('target' , '_blank');
        // a.classList.add('problems-list');
        a.innerHTML = val.title;
        // console.log(a , divProb);
        divProb.appendChild(a);
    })
    console.log(mainArray);
}
function fillProblemsCount(myObj) {
    let solvedQuestion = myObj.data.matchedUser.submitStatsGlobal.acSubmissionNum;
    let totalQuestion = myObj.data.allQuestionsCount;

    let spans = document.querySelectorAll('.secFirst_div1 span');
    console.log(spans);
    // return;
    for(let i = 0 ; i<4 ; i++) {
        spans[i*2].innerHTML = solvedQuestion[i].count;
        spans[i*2+1].innerHTML = totalQuestion[i].count;
    }
    setWidthOfPie(solvedQuestion);
}
function setLocalVariableTimestamp(myObj , user) {
    let recent = myObj.data.recentAcSubmissionList;
    let localVal = JSON.parse(localStorage.getItem(user));
    let timestamp = localVal.timestamp;

    let [easy , medium , hard] = [true , true , true];
    
    for(let i of recent) {
        if(i.difficulty == "Easy" && easy) {
            easy = false;
            timestamp.Easy = i.timestamp;
        }
        else if(i.difficulty == "Medium" && medium) {
            medium = false;
            timestamp.Medium = i.timestamp;
        }
        else if(i.difficulty == "Hard" && hard) {
            hard = false;
            timestamp.Hard = i.timestamp;
        }
    }
    localVal.timestamp = timestamp;
    localStorage.setItem(user , JSON.stringify(localVal))
}
async function onLoaded() {
    let user = document.URL;
    user = user.substring(user.lastIndexOf('/' , user.length-2));
    console.log(user);
    document.getElementsByTagName('main')[0].style.filter = "blur(12px)";
    // return;
    let myJson = await fetch('http://localhost:8000/data_api'+user);//.then(result => result.json()).then(last => console.log(last));
    console.log(myJson);
    let myObj =  await myJson.json();//.then((result) => console.log(result));
    document.getElementsByTagName('main')[0].style.filter = "blur(0px)";
    console.log(myObj);
    user = user.substring(1 , user.length-1);
    document.getElementsByTagName("h2")[0].innerHTML = user;
    
    addListeners(myObj);
    fillProblemsCount(myObj);
    setLocalVariableTimestamp(myObj , user);
}

onLoaded();
