// ==================== Require modules ==================
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");


// === Setting express app and connecting it to modules ===
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// =============== Configurating Mailchimp ================
const API_KEY = "57866b1f22605585d23d6c7ab60e4317-us21";
const SERVER_PREFIX = "us21";
const LIST_ID = "beec7ac31f";

mailchimp.setConfig({
    apiKey: API_KEY,
    server: SERVER_PREFIX
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
        const response = await mailchimp.lists.addListMember(LIST_ID, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });

        if (response.statusCode === 200) {
            console.log(response.email_address + "'s been added to audience as " + response.status);
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
