# WTWR (What to Wear?): Back End
The back-end for the WTWR project through Practicum.

## Project Features
* User Authentication / Password Hashing System
  - Utilizes jsonwebtoken and bcrypt to privately authorize users and allow access to the API
* Express.js
  - The backbone of the entire project.
* MongoDB / Mongoose
  - The database host for the project

## API Calls
* Users
  - Create a User
    * POST at '/signup'
    * Requires an email and password field in the request headers
  - Login to a User
    * POST at '/signin'
    * Requires an email and password field in the request headers
  - Get Current User
    * GET at '/users/me'
    * Requires authorization in the request headers
  - Update a User
    * PATCH at 'users/me'
    * Requires name, avatar, and authorization in the request headers

* Items
  - Get all items
    * GET at '/items'
    * No headers required
  - Create an item
    * POST at '/items'
    * Requires name, weather, imageUrl and authorization in the request headers
  - Delete an item
    * DELETE at '/items/:itemId'
    * Requires authorization in the request headers
  - Like an item
    * PUT at 'items/itemId/likes'
    * Requires authorization in the request headers
  - Dislike an item
    * DELETE at 'items/itemId/likes'
    * Requires authorization in the request headers


## Running the Project
`npm run start` — to launch the server 
`npm run dev` — to launch the server with the hot reload feature
