var requestId;
var html ;

function loadPage(requestId){

    if(requestId === 'GM-001'){
        html = 'index.html';
    }
    else if(requestId === 'GM-002'){
        html = 'gameStart.html';
    }
    else if(requestId ==='GM-007'){
        document.querySelector('#modalPage').classList.remove('display-none');
        return;
    }
    else if(requestId === 'GM-008'){
        html = 'gameStart.html';
    }

    location.href= html;
}

function mainPage(){
    requestId = 'GM-001';
    loadPage(requestId);
}

function ready(){
    requestId = 'GM-008';
    loadPage(requestId);
}
