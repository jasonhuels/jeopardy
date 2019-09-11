import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import $ from 'jquery';
import {Jeopardy} from './jeopardy.js';
import {Character} from './character.js';
import {Player} from './player.js';

$(document).ready(function() {
  let player1 = new Player("player1");
  let player2 = new Player("player2");
  const players = [player1, player2];
  let turn = Math.round(Math.random());
  let questions = [];
  let answers = [];
  let notAnswers = [];
  let promise2;
  let answerKeys = ["a1", "a2", "a3", "a4"];
  const reg_nums = /[^0-9.]/;
  let timeInterval;
  let timer = 0;
  const scoring = ["easy", 100, "medium", 300, "hard", 500];

  //Create Players
  // for(let i=0; i<2; i++){
  //   let character = new Character();
  //   let promise1 = character.getCharacter();
  //   promise1.then(function(response) {
  //     const body = JSON.parse(response);
  //     players[i].name = body.name;
  //     $(`#player${i+1}`).html(`<img src=${body.image}><br><h3>${body.name}: <span id=p${i+1}-score></span></h3>`);
  //   }, function(error) {
  //     $('.showErrors').text(`There was an error processing your request: ${error.message}`);
  //   });
  // }

  // Get first round of getQuestions
    let jeopardy = new Jeopardy();
    promise2 = jeopardy.getQuestions();
    promise2.then(function(response) {
      const body = JSON.parse(response);
      for(let i=0; i<9; i++) {
        questions[i] = body.results[i].question;
        answers[i] = body.results[i].correct_answer;
        notAnswers[i] = body.results[i].incorrect_answers;

        $("#questions").append(`<div id=q${i} class="question col-md-4">
          <h4 class="category">${body.results[i].category}</h4>
          <h3 class="points">$${scoring[scoring.indexOf(body.results[i].difficulty)+1]}</h3>
        </div><br>`);
      }
      console.log(questions, answers, notAnswers);
    }, function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.message}`);
    });

  // Buzzer
  $("html").keydown(function(e) {
      if(e.shiftKey) {
        // timeInterval=setInterval(()=> {
        //   timer++;
        //   if(timer >= 10){
        //     clearInterval(timeInterval);
        //     timer = 0;
        //     document.getElementById("myModal").style.display = 'none';
        //   }
        //   console.log(timer);
        // },1000);
         if(event.location == 1) {
           //Player1
           turn = 0;
           // console.log('left shift');
         }
         if(event.location == 2) {
           //Player2
           turn = 1;
           // console.log('right shift');
         }
      }
  });

  promise2.then(function() {
    console.log(event.target);
    var currentQuestion;
    var points;

    var index = 0;
    $("div.question").click(function() {
      // timer = 0;
      // clearInterval(timeInterval);
      currentQuestion = this;
      points = parseInt(currentQuestion.lastElementChild.innerHTML.replace(reg_nums, ''));
       index = this.id.replace(reg_nums, '');
      $(this).removeClass("question");
      this.style.display = "none";
      document.getElementById("myModal").style.display = "block";
      $("#jep-quest").text(questions[index]);
      console.log(answers[index], notAnswers[index]); // delete after testing
      if(notAnswers[index].length < 4) {
        notAnswers[index].splice(Math.floor(Math.random()*3), 0, answers[index]);
        for(let i=0; i<answerKeys.length; i++){
          $(`#${answerKeys[i]}`).html(notAnswers[index][i]);
        }
      }
    });

    $(".answersOptions").click(function(event) {
      console.log(event.target.innerHTML === answers[index]);
      console.log(this);
      console.log(event.target);
      if(this.innerHTML === answers[index]) {
        // clearInterval(timeInterval);
        players[turn].score += points;
        $("#p1-score").text(player1.score);
        $("#p2-score").text(player2.score);
        console.log(player1.score, player2.score);
        document.getElementById("myModal").style.display = 'none';
      } else if(this.innerHTML !== answers[index]){
        // clearInterval(timeInterval);
        players[turn].score -= points;
        $("#p1-score").text(player1.score);
        $("#p2-score").text(player2.score);
        console.log(player1.score, player2.score);
        changeTurn(turn);
      } else{
        console.log('else wtf');
      }
    });

  }, function(error) {
    $('.showErrors').text(`There was an error processing your request: ${error.message}`);
  });
});

function changeTurn(turn) {
  if(turn === 0) {
    turn = 1;
  } else {
    turn = 0;
  }
}
