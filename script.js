const quizApp = document.querySelector(".quiz-app");
const bullets = document.querySelector(".bullets ul");
const btn = document.querySelector(".submit-answer");
const count = document.querySelector(".quiz-header .count");
const container = document.querySelector(".quiz-questions");
const bulletsContainer = document.querySelector(".bullets");
const socre = document.querySelector(".score");
const timeAnswer = document.querySelector(".timer-answer");

let current = 0;
let rightAnswerCount = 0;
let countDownInterval;

function getQuestions() {

    const myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // convert json to js object
            let myQuestionsObject = JSON.parse(this.responseText);
            // data lenght
            let totalQuestions = myQuestionsObject.length
            // set timer for first time
            countDown(165, totalQuestions);
            // set count && create bullets
            createBullets(totalQuestions, current);
            // set data 
            setData(myQuestionsObject[current], totalQuestions);
            // submit data
            btn.addEventListener("click", function () {
                const rightAnswer = myQuestionsObject[current].right_answer;
                // get number of correct answers
                checkedAnswer(rightAnswer, totalQuestions);
                current++;
                // clear container before add new data
                container.innerHTML = "";
                // clear first timer and set anew one each btn clicked
                clearInterval(countDownInterval);
                countDown(165, totalQuestions);
                // add new data
                setData(myQuestionsObject[current], totalQuestions);
                // set active class to current li 
                handelBullets();
                // get results
                getResults(totalQuestions);
            });
        }
    }
    // set method name , json file
    myRequest.open("GET", "question.json", true);
    myRequest.send();
}


function createBullets(num, current) {
    // header count 
    count.innerHTML = num;
    // bullets
    for (let i = 0; i < num; i++) {
        const bullet = document.createElement("li");
        bullets.appendChild(bullet);
        if (i === 0) {
            bullet.className = "active";
        }
    }
}

function handelBullets() {
    // select lis
    let bulletsLis = document.querySelectorAll("li");
    // convert to array
    let arrbulletsLis = Array.from(bulletsLis);
    // set active class for current li
    arrbulletsLis.forEach((b, index) => {
        if (current === index) {
            b.className = "active";
        }
    });
}

function setData(obj, num) {
    // once current index < total questions .... run
    if (current < num) {
        const answers = document.createElement("div");
        const questionName = document.createElement("h2");
        const questionNameText = document.createTextNode(obj.title);

        answers.className = "answers";

        questionName.appendChild(questionNameText);
        container.appendChild(questionName);
        container.appendChild(answers);

        // set radio inputs and labels
        for (let i = 1; i <= 4; i++) {

            const answer = document.createElement("div");
            const inputs = document.createElement("input");
            const label = document.createElement("label");
            const labelText = document.createTextNode(obj[`answer_${i}`]);

            answer.className = "answer";

            inputs.setAttribute("type", "radio");
            inputs.setAttribute("name", "answerQuestion");
            inputs.dataset.answerOption = obj[`answer_${i}`];
            inputs.setAttribute("id", `answer-${i}`);
            label.setAttribute("for", `answer-${i}`);

            answers.appendChild(answer);
            answer.appendChild(inputs);
            answer.appendChild(label);
            label.appendChild(labelText);

            // to make first input checked
            if (i == 1) {
                inputs.checked = true;
            }
        }
    }

}

function checkedAnswer(rightAnswer, totalQuestions) {
    const answers = document.getElementsByName("answerQuestion");
    let choosen;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            choosen = answers[i].dataset.answerOption;
        }
    }

    if (rightAnswer === choosen) {
        rightAnswerCount++;
    }

}

function getResults(totalQuestions) {
    let result;

    if (current === totalQuestions) {
        container.remove();
        btn.remove();
        bulletsContainer.remove();
        socre.style.display = "block";
    }

    if (rightAnswerCount > (totalQuestions / 2) && rightAnswerCount < totalQuestions) {
        result = `<span style = "color: #5D6E";>Good Answers</span>, ${rightAnswerCount} form ${totalQuestions}`
    } else if (rightAnswerCount === totalQuestions) {
        result = `<span style = "color: #5D6E";>Perfect Answers</span>, ${rightAnswerCount} form ${totalQuestions}`
    } else {
        result = `<span style = "color: #FA897B";>Bad Answers</span>, ${rightAnswerCount} form ${totalQuestions}`
    }
    socre.innerHTML = result;
}

function countDown(duration, totalQuestions) {
    if (current < totalQuestions) {
        let min, sec;
        countDownInterval = setInterval(() => {

            min = parseInt(duration / 60);
            sec = parseInt(duration % 60);

            // to make timer two parts 00:00
            min = min < 10 ? `0${min}` : min;
            sec = sec < 10 ? `0${sec}` : sec;

            timeAnswer.innerHTML = `${min}:${sec}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                btn.click();
            }
        }, 1000);
    }
}

getQuestions();