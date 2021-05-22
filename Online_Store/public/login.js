/*
 * Name: Pacy Wu
 * Date: May 20, 2021
 * Section: CSE 154 AD
 *
 * This is the JS to implement the UI for my
 * CP4 online store login page. The users are able
 * to login with their username and password.
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /** Intialize the event listener to all the interactive elements.*/
  function init() {
    qs("form button").addEventListener("click", login);
    qs("header h1").addEventListener("click", switchToOnlineStorePage);
  }

  /** Redirect the browser to online store main page. */
  function switchToOnlineStorePage() {
    window.location.replace("./index.html");
  }

  /**
   * If the user gives correct username and password, log in the user and redirect
   * the browser to online store's main page. Otherwise, gives the user information
   * about their login status, which is either wrong password or username not found.
   * @param {object} event - the object that is clicked
   */
  async function login(event) {
    try {
      if (qs("form div .warning")) {
        qs("form div .warning").remove();
      }
      event.preventDefault();
      let params = new FormData(id("login-form"));
      let response = await fetch("/login", {method: "POST", body: params});
      await statusCheck(response);
      response = await response.text();
      if (response === "true") {
        switchToOnlineStorePage();
      } else {
        let pTag = gen("p");
        if (response === "wrong password") {
          pTag.textContent = "Wrong password";
        } else { // username not found
          pTag.textContent = "Username not found";
        }
        pTag.classList.add("warning");
        qs("form div").insertBefore(pTag, qs("form div p"));
      }
    } catch (err) {
      console.error("Fail to login due to fetch error.");
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
   * Returns the DOM object with the given id attribute.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id (null if not found).
   */
  function id(idName) {
    return document.getElementById(idName);
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