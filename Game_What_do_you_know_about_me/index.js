/*
 * Name: Pacy Wu
 * Date: April 22, 2021
 * Section: CSE 154 AD
 *
 * This is the JS to implement the UI for my
 * CP2, which is a game that test your understanding
 * about me. When clicking the answer, it will
 * tells you whether you are correct or not.
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  const CORRECT_ANSWER = ["ACMS - DMA", "Taiwan"];
  const WAITING_TIME = 1000;

  /** Intialize the event listener to all the interactive elements.*/
  function init() {
    qs("body").addEventListener("keydown", lookUpKey);
    qs("body").addEventListener("keydown", lookUpKey);
    let buttons = qsa("section.instruction button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", start);
    }
    let options = qsa(".question-list ul li");
    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener("click", answer);
    }
  }

  /**
   * If the given paramater down if true, select the option below in the menu.
   * Otherwise, select the option above in the menu. Note that the one below the last
   * option is the first option and the one above the first element and the last option.
   * @param {booleang} down - whether you want to select the option below.
   */
  function moveSelection(down) {
    let optionList = qs("header nav ul");
    let firstOption = optionList.firstElementChild;
    let lastOption = optionList.lastElementChild;
    let selectedItem = qs(".selected");
    selectedItem.classList.replace("selected", "not-selected");
    let changeItem;
    if (down && (selectedItem !== lastOption)) {
      changeItem = selectedItem.nextElementSibling;
    } else if (!down && (selectedItem !== firstOption)) { // move up
      changeItem = selectedItem.previousElementSibling;
    } else if (down && (selectedItem === lastOption)) { // select first option
      changeItem = firstOption;
    } else { // select the last option
      changeItem = lastOption;
    }
    changeItem.classList.replace("not-selected", "selected");
  }

  /** Look up the function correlated to the pressed down key */
  function lookUpKey(event) {
    if (event.key === "Enter") {
      enterOption();
    } else if (event.key === "ArrowRight") {
      moveSelection(true);
    } else if (event.key === "ArrowLeft") {
      moveSelection(false);
    }
  }

  /**
   * If the user press down "ENTER", enter the selecting game.
   * @param {sobject} event - the event the user just did
   */
  function enterOption() {
    let selectedItem = qs("header nav .selected");
    let option = selectedItem.textContent.toLowerCase();
    if (option !== "about me") {
      qs("header").classList.add("hidden");
      id(option).classList.remove("hidden");
    } else { // option === "about me"
      qs("header").classList.add("hidden");
      id("about-me").classList.remove("hidden");
    }
  }

  /** Start the game.*/
  function start() {
    let parentSection = this.parentElement.parentElement;
    parentSection.classList.add("hidden");
    parentSection.nextElementSibling.classList.remove("hidden");
    parentSection.nextElementSibling.firstElementChild.classList.remove("hidden");
  }

  /**
   * If the user selects "Go back to Menu", display the menu page.
   * If the user selects "Play Again", start the game from the
   * first question. Otherwise, if the user selects the correct answer
   * to the questoin, notify "Correct !". If the user selects the wrong
   * answer to the question, notify "Wrong !" After notifying, go to the
   * next question.
   */
  function answer() {
    let parentSection = this.parentElement.parentElement;
    if (this.textContent === "Go back to Menu") {
      backToMenu();
    } else if (this.textContent === "Play Again") {
      playAgain(parentSection);
    } else {
      let correct = false;
      let noteTag = gen("p");
      for (let i = 0; i < CORRECT_ANSWER.length; i++) {
        if (CORRECT_ANSWER[i] === this.textContent) {
          noteTag.textContent = "Correct !";
          noteTag.classList.add("correct");
          parentSection.appendChild(noteTag);
          correct = true;
        }
      }
      if (!correct) {
        noteTag.textContent = "Wrong !";
        noteTag.classList.add("wrong");
        parentSection.appendChild(noteTag);
      }
      setTimeout(() => nextQuestion(parentSection), WAITING_TIME);
    }
  }

  /**
   * Display the next question.
   * @param {sobject} currentQuestion - the current question that the user is solving
   */
  function nextQuestion(currentQuestion) {
    currentQuestion.classList.add("hidden");
    currentQuestion.nextElementSibling.classList.remove("hidden");
  }

  /** Go back to menu.*/
  function backToMenu() {
    location.reload();
  }

  /**
   * Restart the game from the first question.
   * @param {sobject} currentQuestion - the current question that the user is solving
   */
  function playAgain(currentQuestion) {
    currentQuestion.classList.add("hidden");
    currentQuestion.parentElement.firstElementChild.classList.remove("hidden");
    let correctWrong = qsa(".question-list p");
    for (let i = 0; i < correctWrong.length; i++) {
      correctWrong[i].remove();
    }
  }

  /* ---- Helper Functions ---- */
  /**
   * Returns the DOM object with the given id attribute.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id (null if not found).
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query (empty if none).
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector string.
   * @returns {object} first element matching the selector in the DOM tree (null if none)
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new HTMLElement of the given type, but does not
   * insert it anywhere in the DOM.
   * @param {string} tagName - name of the type of element to create
   * @returns {object} the newly-created HTML Element
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();