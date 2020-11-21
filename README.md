## INTRODUCTION

This project is the backend of an ecommerce website created with React, where users can create account to place orders and leave their comments about their orders.

## TECHNOLOGY STACK

- Node
- Express
- MongoDB
- GraphQL
- Stripe
- Sendgrid

## SETUP

- Open up your terminal
- Clone this repo by typing `git clone <repo url>`
- Go to the directory of repo by typing `cd <name of folder>`
- Type `npm install` to install all dependencies
- [To run this project, you need to install the latest version of MongoDB Community Edition first.](https://docs.mongodb.com/manual/installation/)
- Once you install MongoDB, make sure it's running.
- Create a Stripe account [here](https://dashboard.stripe.com/register)
- Create a bank account and copy the secret key
- Create a sendgrid account [here](https://signup.sendgrid.com/)
- Verify your account and get the secret key
- Create different dynamic templates with the appropriate data to embed in it
- Create a `.env` file in the root directory
- Type these following environment variables:
  `MONGODB_URL=<Your MongoDB Connection String e.g mongodb://localhost:27017>`
  `SECRET_KEY=<Your Secret Key>`
  `STRIPE_SECRET_KEY=<Your Stripe Secret Key e.g sk_test_....>`
  `ACCESS_TOKEN_SECRET_KEY=<Your Access Token Secret Key>`
  `REFRESH_TOKEN_SECRET_KEY=<Your Refresh Token Secret Key>`
  `FRONTEND_ENDPOINT=<The url of the frontend e.g http://localhost:3000>`
  `FRONTEND_ENDPOINT=<The url of the frontend e.g http://localhost:3000>`
  `ACTIVATE_EMAIL_ID=<The template id of your dynamic activate email template>`
  `PASSWORD_RESET_ID=<The template id of your dynamic password reset template>`
  `RECEIPT_EMAIL_ID=<The template id of your dynamic receipt email template>`
  `SENDGRID_API_KEY=<Your Sendgrid secret key>`
  `SENDER=<Your verified email on sendgrid>`

- Run `node seed.js` to populate the database with data gotten from [spooncular](http://spoonacular.com)
- Run `npm start` to start the server
