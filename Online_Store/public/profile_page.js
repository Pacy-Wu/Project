/*
 * Name: Pacy Wu
 * Date: May 3, 2021
 * Section: CSE 154 AD
 *
 * This is the JS to implement the UI for my
 * CP4 online store user's profile page. The user
 * are able to log out the account.
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /** Intialize the event listener to all the interactive elements.*/
  function init() {
    id("logout").addEventListener("click", logout);
    qs("header h1").addEventListener("click", switchToOnlineStorePage);
  }

  /** Redirect the browser to online store main page. */
  function switchToOnlineStorePage() {
    window.location.replace("./index.html");
  }

  /**
   * Log out the user and switch the view to login page.
   */
  async function logout() {
    let params = new FormData();
    params.append("username", id("email").textContent);
    let response = await fetch("/logout", {method: "POST", body: params});
    await statusCheck(response);
    window.location.replace("./login-page.html");
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
})();