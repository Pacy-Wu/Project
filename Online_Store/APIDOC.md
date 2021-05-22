# Online Store API Documentation
The Online Store API provides information about the store's products and stores users information. 

## Get the country of where the game is from
**Request Format:** /game-country?id={gameID}

**Request Type:** GET

**Returned Data Format**: JSON

**Description:**  Get country of where the game with the given gameID comes from. The return data has both information of game id and its country.


**Example Request:** /game-country?id=222576

**Example Response:**
```json
{
  "gameId": "222576",
  "country": {
    "country of the game": "Burkina Faso"
  }
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If there is no passed in `gameID`, returns an error with the message: `Please pass in game ID.`

## Get the login status of the user
**Request Format:** /loginStatus?username={username}

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Get the login status of the user with given username.


**Example Request:** /loginStatus?username=peihsi5@uw.edu

**Example Response:**
```
true
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If there is no passed in `username`, returns an error with the message: `Please pass in username."`

## Login the user if the given username and password match
**Request Format:** /login endpoint with POST parameters of `username` and `password`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Given a valid `username` and `password` to send, the system will reply a message with the login status.

**Example Request:** /login endpoint with POST parameters of `username=peihsi5@uw.edu` and `password=12345`

**Example Response:**
```
username not found
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If there is missing either `username` or `password`, returns an error with the message: `Please pass in both username and password parameter.`

## Send the customer's feedback to the company
**Request Format:** /contact endpoint with POST parameters of `customername`, `email`, and `description`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Given a valid `customername`, `email`, and `description` to send, the system will reply a message telling the user that the contact information has been successfully sent to the company.

**Example Request:** /contact endpoint with POST parameters of `customername=Hello`, `email=peihsi5@uw.edu`, and `description="Unalbe to order"`

**Example Response:**
```
Thank you Hello. We will get back to you soon.
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If there is missing either `customername`, `email`, or `description`, returns an error with the message: `Missing either name, email, or description.`

## Log the user with the username out
**Request Format:** /logout endpoint with POST parameters of `username`

**Request Type:** POST

**Returned Data Format**: Does not return any data

**Description:** Given a valid `username` to send, the system will log out the user with the username.

**Example Request:** /logout endpoint with POST parameters of `username=peihsi5@uw.edu`

**Example Response:** Does not return any data

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If there is no `username` passed in, returns an error with the message: `Please pass in username.`
