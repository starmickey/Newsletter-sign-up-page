// ==================== Require modules ==================
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

// === Setting express app and connecting it to modules ===
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// =============== Configurating Mailchimp ================

mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER_PREFIX
});

// ================== App events managers =================
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.get("/success", function (req, res) {
    res.sendFile(__dirname + "/success.html");
});

app.get("/failure", function (req, res) {
    res.sendFile(__dirname + "/failure.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    const subscribeUser = async () => {
        const response = await mailchimp.lists.addListMember(process.env.LIST_ID, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });

        console.log("adding " + response.email_address + " status code: " + response.statusCode);


        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");

        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    };

    subscribeUser();
});

app.post("/failure", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server running");
});
