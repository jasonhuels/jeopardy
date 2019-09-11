import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import $ from 'jquery';
import {Jeopardy} from './jeopardy.js';
import {Character} from './character.js';
import {Player} from './player.js';

$(document).ready(function() {
  let player1;
  let player2;
  const players = [player1, player2];
  let turn = Math.round(Math.random());
  let questions = [];
  let answers = [];
  let promise2;
  //remove this after testing
  player1 = new Player("player1");
  player2 = new Player("player2");

  //Create Players
  for(let i=0; i<2; i++){
    let character = new Character();
    let promise1 = character.getCharacter();
    promise1.then(function(response) {
      const body = JSON.parse(response);
      players[i] = new Player(body.name);
      $(`#player${i+1}`).html(`<img src=${body.image}><br><h3>${body.name}: <span id=p${i+1}-score></span></h3>`);
    }, function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.message}`);
    });
  }

  // Get first round of getQuestions
    let jeopardy = new Jeopardy();
    promise2 = jeopardy.getQuestions();
    promise2.then(function(response) {
      const body = JSON.parse(response);
      for(let i=0; i<9; i++) {
        questions[i] = body.results[i].question;
        answers[i] = body.results[i].correct_answer;
        //populate html elements
        // body.results[i].category
        // body.results[i].difficulty
        // body.results[i].incorrect_answers[0-2]

        $("#questions").append(`<div id=q${i} class="question col-md-4">
          <h4 class="category">${body.results[i].category}</h4>
          <h3 class="points">${body.results[i].difficulty}</h3>
        </div><br>`);
      }
      console.log(questions, answers);
    }, function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.message}`);
    });


  // Buzzer
  $("html").keydown(function(e) {
      if(e.shiftKey) {
         if(event.location == 1) {
           //Player1
           console.log('left shift');
         }
         if(event.location == 2) {
           //Player2
           console.log('right shift');
         }
      }
  });

});
