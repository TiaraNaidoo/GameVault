const express = require("express");

/*
Imports the controller functions that will handle each system
route.
*/
const {
    getRoot,
    getAbout,
    getHealth
} = require("../controllers/systemController");

/*
Creates a smaller Express router.

This router will later be registered inside app.js.
*/
const router = express.Router();

/*
GET /

Calls the getRoot controller function.
*/
router.get("/", getRoot);

/*
GET /about

Calls the getAbout controller function.
*/
router.get("/about", getAbout);

/*
GET /health

Calls the getHealth controller function.
*/
router.get("/health", getHealth);

/*
Exports the router so that app.js can use it.
*/
module.exports = router;