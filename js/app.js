
let cardLists = ["fa-balance-scale", "fa-accessible-icon", "fa-ambulance", "fa-graduation-cap", "fa-code", "fa-terminal", "fa-codepen", "fa-tasks"];

// Declare the number of clicks
let clicks = 0;

// Declare number of matches cards
let matchFound = 0;

// Check when first card is opened
let gameStarted = false;

// Timer
let timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {
    $('#timer').html(timer.getTimeValues().toString());

    /**
     * Later implement " Improving the game "
     * if(timer.getTimeValues().toString() === '00:00:05'){
            console.log("Time Out");
            gameStarted = false;
            console.log(matchFound);        
            showResults();
        } else {
            console.log("keep going!");
            console.log(timer.getTimeValues().toString());               
        }
     */
});

// Declare an event to reset button
$('#resetButton').click(resetGame);

// Create card and append it into document
function createCard(card) {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}

// Generate random cards on the deck
function generateCards() {
    for (let i = 0; i < 2; i++) {
        cardLists = shuffle(cardLists);
        cardLists.forEach(createCard);
    }
}
// Shuffle / Randomize cards function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length
        , temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// An Array to store the card opened
openCards = [];

// Main function 
function toggleCard() {
    console.log("Card Clicked!");
    // start the timer when first card is opened
    if (gameStarted == false) {
        gameStarted = true;
        console.log("Calling Timer to Start counting!");
        timer.start();
    }

    if (openCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        disableCLick();
    } else if (openCards.length === 1) {
        // Calling updateClicks to increase the clicks number
        updateClicks();
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        setTimeout(matchOpenCards, 1100);
    }
}
// Disable click of the cards
function disableCLick() {
    openCards.forEach(function (card) {
        card.off('click');
    });
}

// Enable clicks on cards
function enableClick() {
    console.log("Cards not matched closing now!");
    openCards[0].click(toggleCard);
}

// check openCards if they match or not while checking the click will be disable to check the number of cards found 
function matchOpenCards() {
    if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
        console.log("match Card", openCards[0][0].firstChild.className);
        openCards[0].addClass("match").animateCss('pulse');
        openCards[1].addClass("match").animateCss('pulse');
        disableCLick();
        removeOpenCards();
        setTimeout(checkWin, 1000);
    }
    else {
        console.log("not match card", openCards[0][0].firstChild.className, " != ", openCards[1][0].firstChild.className);
        openCards[0].toggleClass("show open").animateCss('flipInY');
        openCards[1].toggleClass("show open").animateCss('flipInY');
        enableClick();
        removeOpenCards();
    }
}

// function to remove open cards from the array
function removeOpenCards() {
    openCards = [];
}

// animation function
$.fn.extend({
    animateCss: function (animationName) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});

// update clicks by adding 1 then check if it equals 10, 20 or 30 one start will be changed to blank star.
function updateClicks() {
    clicks += 1;
    $('#moves').html(`${clicks} Clicks`);
    if (clicks == 30) {
        addBlankStar();
    }
    else if (clicks == 20) {
        addBlankStar();
    }
    else if (clicks == 10) {
        addBlankStar();
    }
}

// check all cards matched end the game otherwise increse the found card number 
function checkWin() {
    matchFound += 1;
    if (matchFound == 8) {
        showResults();
    }
}

// blank stars will be adding after exceeding number of clicks
function addBlankStar() {
    $('#stars').children()[0].remove();
    $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}

// initial stars
function addStars(num) {
    for (let i = 0; i < num; i++) {
        $('#stars').append('<li><i class="fa fa-star"></i></li>');
    }
}

// reset the game
function resetGame() {
    clicks = 0;
    matchFound = 0;
    $('#deck').empty();
    $('#stars').empty();
    $('#gameSection')[0].style.display = "";
    $('#sucess-result')[0].style.display = "none";
    gameStarted=false;
    timer.stop();
    $('#timer').html("00:00:00");
    console.log("Game reseted!");
    playGame();
}

// inital function to generate cards and adding 4 starts
function playGame() {
    generateCards();
    $('.card').click(toggleCard);
    $('#moves').html("0 Clicks");
    addStars(4);
}

// shows result on end game
function showResults() {
    $('#sucess-result').empty();
    timer.pause();
    let starResult = '<i class="fa fa-star fa-3x" style="color: green"></i>';
    let starBlankResult = '<i class="fa fa-star-o fa-3x"></i>';
    let scoreBoard = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " /> </svg>
        <p class="success"> Congratulations you made it  
            <img src="img/power2.png" style="height: 35px;width: 40px;color: #73AF44;"/> !!! 
        </p>
        <p>
            <span class="score-titles">Clicks:</span>
            <span class="score-values">${clicks}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top-2">
             <div class="star">
             <p class="success"> You will gain </p>
                    ${starResult}
             </div>
             <div class="star">
                ${ (clicks > 23) ? starBlankResult : starResult }
             </div>
            <div class="star">
                ${ (clicks > 14) ? starBlankResult : starResult }
             </div>
        </div>
        <div class="text-center margin-top-2" id="reset">
            <i class="fa fa-repeat fa-2x" style="cursor: pointer"></i>
          </div>
    `;
    $('#gameSection')[0].style.display = "none";
    $('#sucess-result')[0].style.display = "block";
    $('#sucess-result').append($(scoreBoard));
    $('#reset').click(resetGame);
}

// start the game
playGame();

/*
* for improvement 
* SVG when the user didnt find all the matched cards and time is up! 
* <path xmlns="http://www.w3.org/2000/svg" d="M0.324,1.909c-0.429-0.429-0.429-1.143,0-1.587c0.444-0.429,1.143-0.429,1.587,0l9.523,9.539  l9.539-9.539c0.429-0.429,1.143-0.429,1.571,0c0.444,0.444,0.444,1.159,0,1.587l-9.523,9.524l9.523,9.539  c0.444,0.429,0.444,1.143,0,1.587c-0.429,0.429-1.143,0.429-1.571,0l-9.539-9.539l-9.523,9.539c-0.444,0.429-1.143,0.429-1.587,0  c-0.429-0.444-0.429-1.159,0-1.587l9.523-9.539L0.324,1.909z" fill="#D80027"/> 

function showResults() {
    $('#sucess-result').empty();
    timer.pause();
    let scoreBoard = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " /> </svg>
            ${(matchFound > 7) ? '<p class="success"> Congratulations you made it <img src="img/power2.png" style="height: 35px;width: 40px;color: #73AF44;"/>' : '<p class="faild">Try again'}  
             !!! 
        </p>
        <p>
            <span class="score-titles">Clicks:</span>
            <span class="score-values">${clicks}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top-2">
             <div class="star">
             <p class="success"> You will gain </p>
                <i class="fa fa-star fa-3x"></i>    
             </div>
             <div class="star">
                <i class="fa ${ (matchFound < 7) ? "fa-star-o" : "fa-star"}  fa-3x"></i>    
             </div>
            <div class="star">
                <i class="fa ${ (matchFound < 3) ? "fa-star-o" : "fa-star"} fa-3x"></i>    
             </div>
        </div>
        <div class="text-center margin-top-2" id="reset">
            <i class="fa fa-repeat fa-2x" style="cursor: pointer"></i>
          </div>
    `;
    $('#gameSection')[0].style.display = "none";
    $('#sucess-result')[0].style.display = "block";
    $('#sucess-result').append($(scoreBoard));
    $('#reset').click(resetGame);
}
*/