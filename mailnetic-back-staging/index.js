const express = require("express");
const nodemailer = require("nodemailer");
const Imap = require("node-imap");
const cors = require("cors");
const MailParser = require("mailparser").MailParser;
const { simpleParser } = require("mailparser");
const app = express();

require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

const admin = require("firebase-admin");
const ejs = require("ejs");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("./service.js");
const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const port = 3001;

const sendVerificationEmail = async (userEmail, template) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sid@sight3.io", // generated ethereal user
        pass: "Cooking@9098", // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
      to: userEmail,
      subject: "Email Verification",
      html: template,
      from: `Jirazo sid@sight3.io`,
    });
    console.log("Message sent: %s", JSON.stringify(info));
  } catch (err) {
    console.log(err);
  }
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
};

app.post("/solana-auth", async (req, res) => {
  // const { body, headers } = req;
  console.log(req);
  try {
    return res.status(200).json();
  } catch (e) {
    console.log("Errror", e);
    return res.status(400).json();
  }
});

// Creating a POST route that sends customized verification emails
app.post("/send-signin-link", async (req, res) => {
  const { email } = req.body;
  console.log("email", email);
  const actionCodeSettings = {
    url: "http://localhost:3000/login",
  };

  try {
    // generate action like with the Firebase Admin SDK
    const actionLink = await getAuth().generateSignInWithEmailLink(
      email,
      actionCodeSettings
    );
    console.log("actionLink : ", actionLink);

    // embedding action link to customized verification email template
    const code = Math.floor(Math.random() * 9000) + 1000;

    const template = await ejs.renderFile("verify-email.ejs", {
      actionLink,
      code,
    });

    // send verification email using  SendGrid, Nodemailer, etc.
    await sendVerificationEmail(email, template);

    res.status(200).json({ message: "Email successfully sent.", code });
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).json({message: "Something went wrong.",code : '- - - -'});
    // handle errors
  }
});

app.get("/send-email", async (req, res) => {
  const { body, headers } = req;
  // console.log(body);

  try {
    const { email, host,port, from } = body;
    let transporter = nodemailer.createTransport({
      host,
      port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: from?.email, // generated ethereal user
        pass: from?.password, // generated ethereal password
      },
    });
    // const imapConfig = {
    //   user: "sid@sight3.io",
    //   password: "Cooking@9098",
    //   host: "imap.secureserver.net",
    //   ssl: false,
    //   port: 993,
    //   authTimeout: 10000,
    //   connTimeout: 30000,
    //   keepalive: true,
    //   tlsOptions: {
    //     rejectUnauthorized: false,
    //   },
    // };
    // const imap = new Imap(imapConfig);
    // console.log(imap.state);
    // imap.connect();
    // console.log(imap.state);
    // imap.connect();
    // imap.on("ready", function () {
    //   console.log("CONNECTING");
    //   if (imap.state !== "authenticated") {
    //   }
    // });
    // imap.end();

    // Function to append an email to the sent folder
    // function appendToSentFolder(email) {
    //   imap.append(email, { mailbox: "Sent" }, function (err) {
    //     if (err) {
    //       console.error("Error appending email to sent folder:", err);
    //     } else {
    //       console.log("Email appended to sent folder successfully.");
    //     }

    //     // Close the IMAP connection
    //     imap.end();
    //   });
    // }

    // // Connect to the IMAP server

    // imap.once("ready", function () {
    //   console.log("READY--READY");
    //   // Select the Sent folder
    //   imap.openBox("Sent", true, function (err, box) {
    //     if (err) {
    //       console.error("Error opening Sent folder:", err);
    //       return;
    //     }

    //     // Compose the email you want to append
    //     const email = {
    //       from: "sender@example.com",
    //       to: "recipient@example.com",
    //       subject: "Test Email",
    //       text: "This is a test email.",
    //       date: new Date(),
    //     };

    //     // Convert the email object to a string
    //     const emailString = `From: ${email.from}\r\nTo: ${
    //       email.to
    //     }\r\nSubject: ${
    //       email.subject
    //     }\r\nDate: ${email.date.toUTCString()}\r\n\r\n${email.text}`;

    //     // Append the email to the sent folder
    //     appendToSentFolder(emailString);
    //   });
    // });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      ...email,
      from: `${from?.name} ${from?.email}`,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    return res.json({ success: true, email });
  } catch (e) {
    console.log("Errror", { success: false, error: e });
    return e;
  }
});

app.listen(port, () => {
  console.log(`Listening to streams`);
});
