var requestId;
var html;
var clicked = false;
var gameEnded = false;
var timerId;

var closeBtn = document.getElementById("close");
$(closeBtn).attr("onclick", false);

var audio = document.getElementById('audio');
var audio2 = document.getElementById('audio2');

window.onload = function() {
    var storedBestScore = localStorage.getItem('bestScore');

    if(storedBestScore === null || isNaN(storedBestScore)){
        storedBestScore = 0;
    }
    else{
        document.getElementById('final-bestScore').innerHTML = 'BEST SCORE : ' + storedBestScore;
        document.getElementById('bestScore').innerHTML = 'BEST SCORE : ' +  storedBestScore;
    }

};

var scoreElement = document.getElementById('score').innerHTML;
var bestScoreElement = document.getElementById('bestScore').innerHTML;// 기본 bestScore
var bestScoreText = document.getElementById('final-bestScore').innerHTML;// 모달창 bestScore
var bestScore = localStorage.getItem('bestScore');

if(bestScore === null || isNaN(bestScore)){
    bestScore = 0;
}else{
    bestScore = parseInt(bestScore);
}

var holes = document.getElementsByClassName('hole');
holes = Array.prototype.slice.call(holes);
var score = document.getElementById('score');

function loadPage(requestId){

    if(requestId === 'GM-001'|| requestId === 'lose'){
        html = 'index.html';
    }
    else if(requestId === 'GM-002'){
        document.querySelector('#howList').classList.add('display-none');
        return;
    }
    else if(requestId ==='GM-007'){
        document.querySelector('#modalPage').classList.remove('display-none');
        return;
    }
    else if(requestId === 'GM-008'){
        html = 'gameStart.html';
    }
    if (requestId !== 'lose') {
        localStorage.setItem('bestScore', bestScore);
    }
    location.href= html;
}

function ready(){
    requestId = 'GM-008';
    loadPage(requestId);
}

function mainPage(){
    requestId = 'GM-001';
    loadPage(requestId);
}

var startClick = false;

function startGame(){
    $(closeBtn).attr("onclick", "closePage();");

    audio.play();

    requestId = 'GM-002';
    loadPage(requestId);

    moveMole();
}

function closePage(){
    clearTimeout(timerId);
    requestId = 'GM-007';
    loadPage(requestId);

    gameEnded = true;
    var modalPage = document.getElementById('modalPage');

    modalPage.classList.remove('display-none');
}

function continueGame(){
    gameEnded = false;
    if(result == 0){
        score.innerHTML = 'SCORE ' + result;
    }
    else{
        score.textContent = 'SCORE ' + result;
    }
    document.getElementById('modalPage').classList.add('display-none');
    moveMole(); 
}

function loseScore(){
    bestScore = 0;
    storedBestScore = 0;
    result = 0;

    requestId = 'lose';
    loadPage(requestId);
}

function mainPage(){
    requestId = 'GM-001';
    loadPage(requestId);
}

function gameOver(){

    for (var i = 0; i < holes.length; i++) {//두더지 클릭 못하게
        holes[i].removeEventListener('click', handleMoleClick);
    }

    gameEnded = true;

    var audio3 = new Audio('../sound/blip01.mp3'); //효과음
    audio3.play();
    clearInterval(timerId);

    requestId = 'GM-006';

    document.querySelector('#modalPage2').classList.remove('display-none');

    document.getElementById('final-score').innerHTML = 'SCORE : '+ result;
    document.getElementById('final-bestScore').innerHTML =  'BEST SCORE : ' + bestScore;

    document.getElementById('bestScore').innerHTML =  'BEST SCORE : ' + bestScore;

}

function missMole(){
    clearInterval(timerId);
    var moleHole = document.getElementById(hitPosition);
    var moleImage = moleHole.querySelector('img');
    if (moleImage) {
        moleHole.removeChild(moleImage);
    }

    var moleImage = moleHole.querySelector('img');
    if (moleImage) {
        moleImage.classList.add('mole-enter'); 
    }
    setTimeout(function() {
        gameOver();
    }, 500);  
}

var result = 0;

var img = new Image();
img.src = "../img/mole1-removebg-preview.png";
img.width = "150";
img.height = "150";

function randomHole() { // 번호 랜덤 생성

    for (var i = 0; i < holes.length; i++) {
        holes[i].innerHTML = '';
    }
    
    var randomIndex = Math.floor(Math.random() * holes.length);
    var randomHole = holes[randomIndex];

    var imgElement = document.createElement('img'); 
    imgElement.src = img.src; 
    imgElement.width = img.width; 
    imgElement.height = img.height;

    imgElement.style.position = 'relative';
    imgElement.style.left = '22%';
    imgElement.style.bottom = '90%';

    randomHole.appendChild(imgElement); 

    hitPosition = randomHole.id;

    clicked = false;    // 두더지를 놓쳤을 경우
}

function handleMoleClick(event) { // 두더지를 클릭했을때
   
    if(!clicked && !gameEnded){
        var moleElement = this;
        
        if (moleElement.id == hitPosition) { // hitPosition 두더지가 나오는 포지션
            audio2.play();

            result += 100;
            score.innerHTML = 'SCORE '+ result;

            if(result >= bestScore){
                bestScore = result;
                bestScoreText.innerHTML = 'BEST SCORE : ' + bestScore;
            }

            var imgElement2 = new Image(); 
            imgElement2.src = "../img/mole2-removebg-preview.png"; 
            imgElement2.width = "150"; 
            imgElement2.height = "150"; 
        
            imgElement2.style.position = 'relative';
            imgElement2.style.left = '22%';
            imgElement2.style.bottom = '90%';

            var currentImage = moleElement.querySelector('img');
            moleElement.removeEventListener('click', handleMoleClick);

            if (currentImage) {
                moleElement.replaceChild(imgElement2, currentImage);
                
                setTimeout(function() {
                    moleElement.removeChild(imgElement2);
                    moleElement.addEventListener('click', handleMoleClick);
                }, 250);
                
            }

            gameEnded = false;
            clicked = true;
            moveMole();

            setTimeout(function () {
                audio2.pause();
                audio2.currentTime = 0;
            }, 450);
        }
        
    }

}

for (var i = 0; i < holes.length; i++) {
    var hole = holes[i];
    clicked = true;
    hole.addEventListener('click', handleMoleClick);
}

function moveMole() { // 점수가 높아질수록 빨라짐

    var interval = 3000; 

    if (result > 2000) {
        interval = 500; 
    } 
    else if (result > 1000) {
        interval = 1000; 
    } 
    else if (result > 500) {
        interval = 2000; 
    }

    clearInterval(timerId);

    timerId = setInterval(function() {

    if(!clicked){
        missMole();
    }
    else{
        randomHole();
    } 

    }, interval);
}

