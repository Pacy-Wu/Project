/*
 * Name: Pacy Wu
 * Date: May 20, 2021
 * Section: CSE 154 AD
 *
 * This is the JS to implement the UI for my
 * CP4, which is an online store that grabs data from API,
 * login and logout the user. The users are allow to search
 * for game and make up products, and can send contact information
 * to us if need help.
 */

"use strict";

(function() {

  const GAME_URL = "https://www.cheapshark.com/api/1.0/games?";
  const MAKEUP_URL = "http://makeup-api.herokuapp.com/api/v1/products.json?";
  let currentPageId = "home";

  window.addEventListener("load", init);

  /** Intialize the event listener to all the interactive elements.*/
  function init() {
    qs("body").addEventListener("keydown", startSearch);
    let searchButtons = qsa(".search button");
    for (let i = 0; i < searchButtons.length; i++) {
      searchButtons[i].addEventListener("click", startSearch);
    }
    let navList = qsa("nav ul li");
    for (let i = 0; i < navList.length; i++) {
      navList[i].addEventListener("click", changeView);
    }
    upcomingFillIn();
    qs("#contact button").addEventListener("click", submitUserInfo);
    qs("#account-icon").addEventListener("click", goToAccountPage);
  }

  /**
   * If the user has not logged in, switch to the login page.
   * If the user has already logged in, show their profile.
   */
  async function goToAccountPage() {
    try {
      let response = await fetch("/loginStatus?username=peihsi5@uw.edu");
      await statusCheck(response);
      response = await response.text();
      if (response === "true") {
        window.location.replace("./profile-page.html");
      } else {
        window.location.replace("./login-page.html");
      }
    } catch (err) {
      console.error("Fail to get the login status of the user.");
    }
  }

  /**
   * Submit users' information and his/her questions to the company.
   * Then, inform the user that they have succesfully submit their contact
   * information. If failed, inform the user as well.
   * @param {object} event - the DOM object that is clicked
   */
  async function submitUserInfo(event) {
    try {
      let params = new FormData(qs("form.user-info"));
      let namePattern = /^[A-Z][a-z]*\s+[A-Za-z]*\s*[A-Z][a-z]*\s*$/;
      let emailPattern = /^[\w]*@.*\.[A-Za-z]{3,4}$/;
      let descriptionPattern = /.+/;
      let inputName = params.get("customername");
      let inputEmail = params.get("email");
      let inputDescription = params.get("description");
      if (namePattern.test(inputName) && emailPattern.test(inputEmail) &&
        descriptionPattern.test(inputDescription)) {
        event.preventDefault();
        let submitUrl = "/contact";
        let response = await fetch(submitUrl, {method: "POST", body: params});
        await statusCheck(response);
        response = await response.text();
        let pTag = gen("p");
        pTag.textContent = response;
        qs("form.user-info").appendChild(pTag);
        qs(".all-info button").classList.add("hidden");
      }
    } catch (err) {
      failToSumbit();
    }
  }

  /**
   * Inform the user that they fail to submit their contact
   * information and questions to the compnay.
   */
  function failToSumbit() {
    let pTag = gen("p");
    pTag.textContent = "Fail to submit. Please try again later.";
    qs("form.user-info").appendChild(pTag);
    qs(".all-info button").classList.add("hidden");
  }

  /** Fill in three upcoming products in the home page. */
  async function upcomingFillIn() {
    // api used from http://makeup-api.herokuapp.com/
    let brand = "anna sui"; // default
    let resultSection = qs("#home .result");
    resultSection.innerHTML = "";
    try {
      let response = await fetch(MAKEUP_URL + "brand=" + brand);
      response = await statusCheck(response);
      let json = await response.json();
      for (let i = 0; i < 3; i++) {
        let imgUrl = json[i].image_link;
        let divTag = gen("div");
        let imgTag = gen("img");
        imgTag.src = imgUrl;
        divTag.appendChild(imgTag);
        let productName = json[i].name;
        let productPrice = json[i].price;
        let pTag = gen("p");
        let spanTagProductName = genTagWithInfo("span", productName + " ", "product-name");
        pTag.appendChild(spanTagProductName);
        divTag.appendChild(pTag);
        let pTagPrice = genTagWithInfo("p", "$" + productPrice, "product-price");
        divTag.appendChild(pTagPrice);
        resultSection.appendChild(divTag);
      }
    } catch (err) {
      failToFetch(resultSection);
    }
  }

  /** Siwtch the view page to the one user selected. */
  function changeView() {
    qs("body > header").classList.remove("hidden");
    id(currentPageId).classList.add("hidden");
    let changeToId = this.textContent.toLowerCase();
    if (changeToId === "game") {
      id(changeToId).classList.remove("hidden");
      currentPageId = changeToId;
      generateGamesList("b");
    } else if (changeToId === "home") {
      id(changeToId).classList.remove("hidden");
      currentPageId = changeToId;
    } else if (changeToId === "contact") {
      if (qs(".user-info p")) {
        qs(".user-info p").remove();
      }
      qs("#contact button").classList.remove("hidden");
      let input = qsa("#contact input");
      for (let i = 0; i < input.length; i++) {
        input[i].value = "";
      }
      qs("#contact textarea").value = "";
      id(changeToId).classList.remove("hidden");
      currentPageId = changeToId;
    } else {
      id("make-up").classList.remove("hidden");
      currentPageId = "make-up";
      generateMakeUpList("maybelline");
    }
  }

  /**
   * Generate all make up products that the user search.
   * @param {string} brand - the brand of the make up products that the user wants to look for
   */
  async function generateMakeUpList(brand) {
    let resultSection = qs("#make-up .result");
    resultSection.innerHTML = "";
    try { // api used from http://makeup-api.herokuapp.com/
      let loadingTag = genImgTag("loading_icon.gif", "loading", "loading");
      qs("#make-up .result").appendChild(loadingTag);
      let response = await fetch(MAKEUP_URL + "brand=" + brand);
      response = await statusCheck(response);
      let json = await response.json();
      qs("#make-up .result img").remove();
      for (let i = 0; i < json.length; i++) {
        let imgUrl = json[i].image_link;
        let divTag = gen("div");
        let imgTag = genImgTag(imgUrl, "make-up-product");
        divTag.appendChild(imgTag);
        let pTag = gen("p");
        let spanTagProductName = genTagWithInfo("span", json[i].name + " ", "product-name");
        pTag.appendChild(spanTagProductName);
        divTag.appendChild(pTag);
        let pTagPrice = genTagWithInfo("p", "$" + json[i].price, "product-price");
        divTag.appendChild(pTagPrice);
        resultSection.appendChild(divTag);
      }
      if (json.length === 0) {
        noResult(resultSection);
      }
    } catch (err) {
      failToFetch(resultSection);
    }
  }

  /**
   * Show the message of no search results.
   * @param {object} resultSection - the section to append the message in p tag
   */
  function noResult(resultSection) {
    let pTagNoResult =
          genTagWithInfo("p", "No results. Please try another keyword ...", null);
    resultSection.appendChild(pTagNoResult);
  }

  /**
   * Generate all game products that the user search.
   * @param {string} title - the game title that the user wants to look for
   */
  async function generateGamesList(title) {
    // api used from https://apidocs.cheapshark.com/
    let resultSection = qs("#game .result");
    resultSection.innerHTML = "";
    try {
      let loadingTag = genImgTag("loading_icon.gif", "loading", "loading");
      qs("#game .result").appendChild(loadingTag);
      let response = await fetch(GAME_URL + "title=" + title);
      response = await statusCheck(response);
      let json = await response.json();
      qs("#game .result img").remove();
      generateGameProducts(json);
      if (json.length === 0) {
        noResult(resultSection);
      }
    } catch (err) {
      failToFetch(resultSection);
    }
  }

  /**
   * Generate all game products that the user search.
   * @param {object} json - the result of search products in json object
   */
  async function generateGameProducts(json) {
    let resultSection = qs("#game .result");
    try {
      for (let i = 0; i < json.length; i++) {
        let gameCountry = await getGameCountry(json[i]["gameID"]);
        let divTag = gen("div");
        let imgTag = genImgTag(json[i].thumb, "game-product");
        divTag.appendChild(imgTag);
        let pTag = gen("p");
        let spanTagGameName = genTagWithInfo("span", json[i].external + " ", "product-name");
        let spanTagGameId = genTagWithInfo("span", "#" + json[i]["gameID"] + " ", "game-id");
        let pTagCountry = genTagWithInfo("p", " (From: " + gameCountry + ")", "game-country");
        pTag.appendChild(spanTagGameName);
        pTag.appendChild(spanTagGameId);
        divTag.appendChild(pTag);
        divTag.appendChild(pTagCountry);
        let pTagPrice = genTagWithInfo("p", "$" + json[i].cheapest, "product-price");
        divTag.appendChild(pTagPrice);
        resultSection.appendChild(divTag);
      }
    } catch (err) {
      failToFetch(resultSection);
    }
  }

  /**
   * Find the country of where the game with the given gameID comes from.
   * @param {string} gameId - the game with game id that you are looking up
   * @returns {promise} - a promise with the country of the game
   */
  async function getGameCountry(gameId) {
    try {
      let gameCountry = await fetch("/game-country?id=" + gameId);
      await statusCheck(gameCountry);
      gameCountry = await gameCountry.json();
      gameCountry = gameCountry["country"];
      gameCountry = gameCountry["country of the game"];
      return gameCountry;
    } catch (err) {
      console.error("Fail to get the country of the game");
    }
  }

  /**
   * When the user press enter, start the search.
   * @param {object} event - the event the user just did
   */
  function startSearch(event) {
    if (event.key === "Enter" || this.textContent === "Go") {
      if (currentPageId === "game") {
        let inputText = qs("#game .search input").value;
        generateGamesList(inputText);
      } else if (currentPageId === "make-up") {
        let inputText = qs("#make-up .search input").value;
        generateMakeUpList(inputText);
      }
    }
  }

  /**
   * Check the status of the response.
   * @param {object} response - the response from fetch
   * @returns {object} the given response
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.status());
    }
    return response;
  }

  /**
   * Generate an image tag with the given source, alternate text, and the className
   * @param {string} src - the source of the image
   * @param {string} alt - the alternate text of the image
   * @param {string} className - the class of the image
   * @returns {object} - the image tag that is created
   */
  function genImgTag(src, alt, className) {
    let imgTag = gen("img");
    imgTag.src = src;
    imgTag.alt = alt;
    imgTag.classList.add(className);
    return imgTag;
  }

  /**
   * Gnerate the given type of tag with the given message and given class.
   * @param {string} tagType - the type of tag to generate
   * @param {string} message - the text content in the tag
   * @param {string} addClass - the class of the tag. If null, no class created for the tag.
   * @returns {object} - the generated p tag
   */
  function genTagWithInfo(tagType, message, addClass) {
    let pTag = gen(tagType);
    pTag.textContent = message;
    if (addClass !== null) {
      pTag.classList.add(addClass);
    }
    return pTag;
  }

  /**
   * This function is called when an error occurs in the fetch call chain (e.g. the request
   * returns a non-200 error code) and display a user-friendly message.
   * @param {object} resultSection - the section to append the message in p tag
   */
  function failToFetch(resultSection) {
    let pTagError =
      genTagWithInfo("p", "Fail to fetch. Please try again later.", null);
    resultSection.appendChild(pTagError);
  }

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