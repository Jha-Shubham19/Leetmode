class objContainer {
    static myObj = null;
    static setObj(myObj) {
        objContainer.myObj = myObj;
    }
};
function addListnerForLocalStorage() {
    //fox + and -
    let chk_box_add = document.getElementById("add-mem");
    chk_box_add.addEventListener('change' , function() {
        let label = document.querySelector("label[for='add-mem']");
        if(label.innerHTML == String.fromCodePoint(0x0002B)) 
            label.innerHTML = String.fromCodePoint(0x02212);
        else label.innerHTML = String.fromCodePoint(0x0002B);
    });
    
    let form = document.getElementsByTagName("form")[0];
    form.addEventListener('submit' , async function(event) {
        event.preventDefault();
        let key = this.children[0].value;
        let val = this.children[1].value;
        
        localStorage.setItem(key , JSON.stringify({displayName:val , timestamp:{Easy:0 , Medium:0 , Hard:0}}));
        // this.children[0].value = null;
        // this.children[1].value = null;
        chk_box_add.checked = false;
        document.querySelector("label[for='add-mem']").textContent = String.fromCodePoint(0x0002B);
        // fillWatchList();
        location.reload();
    });
    
    let butt = document.querySelector('#remove');
    if(localStorage.length == 0) butt.disabled = true;
    butt.addEventListener('change' , function(){
        let labelAddMem = document.querySelector("h2 > label");
        if(this.checked == true) {
            chk_box_add.checked = false;
            let spans = document.querySelectorAll(".frnd > span");
            for(let i=0 ; i<spans.length ; i++) {
                let spanEle = spans[i];
                spanEle.removeChild(spanEle.firstChild);
                let small = spanEle.firstElementChild;
                if(small.hasChildNodes())
                    small.removeChild(small.firstChild);

                if((i+1)%3 == 0){
                    spanEle.insertAdjacentText("afterbegin" , String.fromCodePoint(0x1f5d1));
                    spanEle.classList.add('trash');
                    spanEle.addEventListener('click' , function() {
                        let a = this.parentElement.firstElementChild.getAttribute("href");
                        let username = a.substring(a.lastIndexOf('/')+1);
                        localStorage.removeItem(username);
        
                        this.closest(".friends-list").removeChild(this.closest(".frnd-container")); 
                    });
                }
            }
            labelAddMem.setAttribute("for" , "remove");
            labelAddMem.textContent = String.fromCodePoint(0x2705);
        }
        else {
            labelAddMem.setAttribute("for" , "add-mem");
            labelAddMem.textContent = String.fromCodePoint(0x0002B);
            fillWatchList();
        }
    })
}
{/* <div class="frnd-container">
    <div class="frnd">
        <a href="friends/vinit_jha" class="frnd-name">Vinit Jha</a>
        <span>10<small>+2</small></span>
        <span>10<small>+2</small></span>
        <span>10<small>+2</small></span>
    </div>
    <div class="frnd-points-container">
        <span>Points : <span>100</span></span>
    </div>
</div> */}
function fillWatchList() {
    let myObj = objContainer.myObj;
    let frndContainerArr = [];
    
    for(let i of myObj) {
        if(localStorage.getItem(i.username) == null) continue;

        let frnd_container = document.createElement("div");
        frnd_container.classList.add("frnd-container");
        let frnd = document.createElement("div");
        frnd.classList.add("frnd");
        let frnd_points_container = document.createElement("div");
        frnd_points_container.classList.add("frnd-points-container");

        frnd_container.appendChild(frnd);
        frnd_container.appendChild(frnd_points_container);

        let frnd_name = document.createElement('a');
        frnd_name.setAttribute('href' , `friends/${i.username}`);
        frnd_name.classList.add("frnd-name");
        let userObj = JSON.parse(localStorage.getItem(i.username));
        frnd_name.textContent = `${userObj.displayName}`;

        frnd.appendChild(frnd_name);
        let pnt = 0;
        let levels = ["Easy" , "Medium" , "Hard"];
        for(let j = 1 ; j<=3 ; j++) {
            let span = document.createElement("span");
            let cnt = i.acSubmissionNum[j].count;
            let cnt_text = document.createTextNode(`${cnt}`);
            span.appendChild(cnt_text);
            pnt += cnt*Math.pow(2, j);

            let small = document.createElement("small");
            let qcnt = i.howManyQuestion[levels[j-1]];
            if(qcnt != 0)
                small.appendChild(document.createTextNode(`+${qcnt}`));
            span.appendChild(small);
            frnd.appendChild(span);
        }
        let spanP = document.createElement("span");
        spanP.appendChild(document.createTextNode('Points : '));

        let spanC = document.createElement("span");
        let pnt_text = document.createTextNode(`${pnt}`);
        spanC.appendChild(pnt_text);
        spanP.appendChild(spanC);
        frnd_points_container.appendChild(spanP);

        frndContainerArr.push(frnd_container);
    }
    frndContainerArr.sort(function(a , b) {
        let asmall = a.querySelectorAll('small');
        let aout = 0;
        for(let i of asmall)
            if(i.hasChildNodes()) {
                aout = -1;
                break;
            }
        let bsmall = b.querySelectorAll('small');
        let bout = 0;
        for(let i of bsmall)
            if(i.hasChildNodes()) {
                bout = -1;
                break;
            }
        if(aout == bout) 
            return a.querySelector('a').textContent.localeCompare(b.querySelector('a').textContent);
        return aout == -1 ? -1 : 1;
            
    })
    let sec = document.getElementsByClassName("friends-list")[0];
    sec.innerHTML = null;
    for(let i of frndContainerArr)
        sec.appendChild(i);
}
function getHowManyQuestions(user , recent) {
    
    let cntArr = {Easy : 0 , Medium : 0 , Hard : 0};
    let localVal = JSON.parse(localStorage.getItem(user));
    let timestamp = localVal.timestamp;
    let [easy , medium , hard] = [true , true , true];

    //new local vari
    if(timestamp.Easy == 0 && timestamp.Medium == 0 && timestamp.Hard ==0) {
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
        localStorage.setItem(user , JSON.stringify(localVal));
    }
    else {
        for(let i of recent) {
            if(i.difficulty == "Easy" && timestamp.Easy < i.timestamp)
                cntArr.Easy += 1;
            else if(i.difficulty == "Medium" && timestamp.Medium < i.timestamp)
                cntArr.Medium += 1;
            else if(i.difficulty == "Hard" && timestamp.Hard < i.timestamp)
                cntArr.Hard += 1;
        }
    }
    console.log(cntArr);
    return cntArr;

}
async function onLoaded(){
    // localStorage.clear();
    // return;
    // localStorage.removeItem('vinit_jha');
    // localStorage.removeItem('brijesh_09')
    // localStorage.setItem('jha-shubham19' , JSON.stringify({displayName: 'Shubham Jha' , timestamp:{Easy:1 , Medium:0 , Hard:0}}));
    // localStorage.setItem('kamalyadav01' , JSON.stringify({displayName: 'Kamal Yadav' , timestamp:{Easy:1 , Medium:0 , Hard:0}}));
    // localStorage.setItem('vinit_jha' , 'vinit Jha');
    // localStorage.setItem('brijesh_09' , JSON.stringify({displayName: 'BD' , timestamp:{Easy:1 , Medium:0 , Hard:0}}));
    console.log("first");
    if(screen.availWidth > 450) alert("Switch to Mobile view");
    let users = [];
    for(let i = 0 ; i < localStorage.length ; i++)
    users.push(localStorage.key(i));
    users = users.join(';');
    
    console.log(users);
    if(localStorage.length == 0) {   
        addListnerForLocalStorage();
        document.querySelector(".friends-list").innerHTML = null;
        return;
    }
    document.querySelector('.friends-list').style.filter = "blur(5px)";
    let some = await fetch(`http://localhost:8000/allfriends?usernames=${users}`);
    let myObj = await some.json();
    document.querySelector('.friends-list').style.filter = "none";
    console.log(myObj);
    let reqObj = myObj.map(ele => {
        let out = {};
        out.username = ele.data.matchedUser.username;
        out.acSubmissionNum = ele.data.matchedUser.submitStatsGlobal.acSubmissionNum;
        out.howManyQuestion = getHowManyQuestions(out.username , ele.data.recentAcSubmissionList);
        return out;
    });
    
    objContainer.setObj(reqObj);
    console.log(reqObj);
    
    addListnerForLocalStorage();
    fillWatchList();
    console.log(myObj);
    
}
onLoaded();