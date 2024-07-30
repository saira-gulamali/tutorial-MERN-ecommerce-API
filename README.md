# 10 - Ecommerce API

Taken from John Smilga - Node Course - Section 14 - E-commerce API

## Description

Backend app providing full e-commerce functionality including:

- login/logout/signup
- update user profile
- create/delete/update/get order/s
- create/delete/update/get product/s
- create/update/get order/s

## Tech stack

### backend

- node
- express
- mongoose
- mongoDB
- nodemon

- bcrypt
- cookie-parser
- cors
- dotenv
- express-async-errors
- express-fileupload
- express-mongo-sanitize
- express-rate-limit
- helmet
- http-status-codes
- joi
- jsonwebtoken
- morgan
- validator
- xss-clean

## Usage

- copy repo files to local directory
- npm install
- configure .env file with PORT, MONGO_URI,JWT_SECRET, JWT_LIFETIME & CORS

* PORT is the port the backend API server will run on
* MONGO_URI is the mongoDB database connection string (ensure to include the database name, username and password)
* JWT_SECRET is a 256 bit encryption string
* JWT_LIFETIME is the expiry time of a JWT (e.g. 30d)
* CORS is the url of the frontend server

- npm run dev
- connect with localhost:5000

## Docgen Information

docgen provides api documentation of the routes using postman export file

### windows installation

- generate an index.html with the following command
- ensure windows_amd64.exe is located in a directory that has been added to your path environment variable:

`js
windows_amd64 build -i {name of postman json export file} -o ~/{output directory}/index.html
`
