/*
 * Name: Pacy Wu
 * Date: May 20, 2021
 * Section: CSE 154 AD
 *
 * This is the JS to implement the API used in index.js, profile_page.js, and login.js.
 */

"use strict";

const express = require('express');
const multer = require('multer');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const country = ['China', 'India', 'United States', 'Indonesia', 'Pakistan', 'Brazil',
    'Nigeria', 'Bangladesh', 'Russia', 'Mexico', 'Japan', 'Ethiopia', 'Philippines',
    'Egypt', 'Vietnam', 'DR Congo', 'Turkey', 'Iran', 'Germany', 'Thailand', 'United Kingdom',
    'France', 'Italy', 'Tanzania', 'South Africa', 'Myanmar', 'Kenya', 'South Korea',
    'Colombia', 'Spain', 'Uganda', 'Argentina', 'Algeria', 'Sudan', 'Ukraine', 'Iraq',
    'Afghanistan', 'Poland', 'Canada', 'Morocco', 'Saudi Arabia', 'Uzbekistan', 'Peru', 'Angola',
    'Malaysia', 'Mozambique', 'Ghana', 'Yemen', 'Nepal', 'Venezuela', 'Madagascar', 'Cameroon',
    "Cote d'Ivoire", 'North Korea', 'Australia', 'Niger', 'Sri Lanka', 'Burkina Faso', 'Mali',
    'Romania', 'Malawi', 'Chile', 'Kazakhstan', 'Zambia', 'Guatemala', 'Ecuador', 'Syria',
    'Netherlands', 'Senegal', 'Cambodia', 'Chad', 'Somalia', 'Zimbabwe', 'Guinea', 'Rwanda',
    'Benin', 'Burundi', 'Tunisia', 'Bolivia', 'Belgium', 'Haiti', 'Cuba', 'South Sudan',
    'Dominican Republic', 'Czech Republic', 'Greece', 'Jordan', 'Portugal', 'Azerbaijan',
    'Sweden', 'Honduras', 'United Arab Emirates', 'Hungary', 'Tajikistan', 'Belarus', 'Austria',
    'Papua New Guinea', 'Serbia', 'Israel', 'Switzerland', 'Togo', 'Sierra Leone', 'Laos',
    'Paraguay', 'Bulgaria', 'Libya', 'Lebanon', 'Nicaragua', 'Kyrgyzstan', 'El Salvador',
    'Turkmenistan', 'Singapore', 'Denmark', 'Finland', 'Congo', 'Slovakia', 'Norway', 'Oman',
    'State of Palestine', 'Costa Rica', 'Liberia', 'Ireland', 'Central African Republic',
    'New Zealand', 'Mauritania', 'Panama', 'Kuwait', 'Croatia', 'Moldova', 'Georgia', 'Eritrea',
    'Uruguay', 'Bosnia and Herzegovina', 'Mongolia', 'Armenia', 'Jamaica', 'Qatar', 'Albania',
    'Lithuania', 'Namibia', 'Gambia', 'Botswana', 'Gabon', 'Lesotho', 'North Macedonia',
    'Slovenia', 'Guinea-Bissau', 'Latvia', 'Bahrain', 'Equatorial Guinea', 'Trinidad and Tobago',
    'Estonia', 'Timor-Leste', 'Mauritius', 'Cyprus', 'Eswatini', 'Djibouti', 'Fiji', 'Comoros',
    'Guyana', 'Bhutan', 'Solomon Islands', 'Montenegro', 'Luxembourg', 'Suriname', 'Cabo Verde',
    'Micronesia', 'Maldives', 'Malta', 'Brunei', 'Belize', 'Bahamas', 'Iceland', 'Vanuatu',
    'Barbados', 'Sao Tome & Principe', 'Samoa', 'Saint Lucia', 'Kiribati', 'Grenada',
    'St. Vincent & Grenadines', 'Tonga', 'Seychelles', 'Antigua and Barbuda', 'Andorra',
    'Dominica', 'Marshall Islands', 'Saint Kitts & Nevis', 'Monaco', 'Liechtenstein', 'San Marino',
    'Palau', 'Tuvalu', 'Nauru', 'Holy See'];

const invalidRequestErrorCode = 400;

let gamePairCountry = new Map();
let customerPairEmail = new Map();
let customerPairQuestions = new Map();
let loginInfo = new Map();
let loginUsers = new Set();

/**
 * Return a json containing the gameID to the country of where the game comes from.
 * If there is no passed in gameID, return an error message "Please pass in game ID"
 * with status code 400.
 */
app.get("/game-country", (request, response) => {
  let idNum = request.query["id"];
  if (!idNum) {
    let errorMessage = "Please pass in game ID.";
    response.status(invalidRequestErrorCode).send(errorMessage);
  }
  if (!gamePairCountry.has(idNum)) {
    gamePairCountry.set(idNum, genRandCountry());
  }
  let result = {gameId: idNum, country: {"country of the game": gamePairCountry.get(idNum)}};
  response.json(result);
});

/**
 * Login the user and return a string "true" if the given username and password match.
 * If the given username does not exist, return a string "username not found".
 * If the given username exists but the given password is wrong, return a string "wrong password".
 * Otherwise, if missing given username or given password, eturn an error message
 * "Please pass in both username and password parameter" with status code 400.
 */
app.post("/login", (request, response) => {
  loginInfo.set("abcde@uw.edu", "abcde");
  let username = request.body.username;
  let password = request.body.password;
  if (!username || !password) {
    let errorMessage = "Please pass in both username and password parameter.";
    response.status(invalidRequestErrorCode).send(errorMessage);
  }
  response.type("text");
  if (loginInfo.has(username) && loginInfo.get(username) === password) {
    loginUsers.add(username);
    response.send("true");
  } else if (loginInfo.has(username) && loginInfo.get(username) !== password) {
    response.send("wrong password");
  } else {
    response.send("username not found");
  }
});

/**
 * Store users' name, email, and their description into our database and return
 * a string "Thank you {name}. We will get back to you soon." to inform the user
 * that they have contact us succesfully. If missing either name, email, or the
 * description, return an error "Missing either name, email, or description"
 * with the status code 400.
 */
app.post("/contact", (request, response) => {
  let name = request.body.customername.trim();
  let email = request.body.email.trim();
  let description = request.body.description.trim();
  if (!name || !email || !description) {
    let errorMessage = "Missing either name, email, or description.";
    response.status(invalidRequestErrorCode).send(errorMessage);
  }
  customerPairEmail.set(name, email);
  customerPairQuestions.set(name, description);
  response.type("text");
  response.send("Thank you " + name + ". We will get back to you soon.");
});

/**
 * Return the login status of the given username. If the user is login, return
 * a string "true". If the user is not login, return a string "false". Otherwise,
 * if missing the given username, return an error meesage "Please pass in username"
 * with the status code 400.
 */
app.get("/loginStatus", (request, response) => {
  let username = request.query["username"];
  if (!username) {
    let errorMessage = "Please pass in username.";
    response.status(invalidRequestErrorCode).send(errorMessage);
  }
  response.type("text");
  if (loginUsers.has(username)) {
    response.send("true");
  } else {
    response.send("false");
  }
});

/**
 * Log out the user with the given username. If the username is missing,
 * return an error message "Please pass in username" with status code 400.
 */
app.post("/logout", (request, response) => {
  let username = request.body.username;
  if (!username) {
    let errorMessage = "Please pass in username.";
    response.status(invalidRequestErrorCode).send(errorMessage);
  }
  loginUsers.delete(username);
  response.end();
});

/**
 * Generate a random country.
 * @returns {string} - a random country
 */
function genRandCountry() {
  let randNum = Math.floor(Math.random() * country.length);
  let result = country[randNum];
  return result;
}

const LOCALHOST_PORT = 8000;
app.use(express.static("public"));
const PORT = process.env.PORT || LOCALHOST_PORT;
app.listen(PORT);