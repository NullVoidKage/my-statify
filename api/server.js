const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { send } = require('micro');
const microCors = require('micro-cors');

const app = express();

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Gabimarusixtynine@gmail.com", // Replace with your Gmail email address
    pass: "nevtjxjswbpswmuf", // Replace with your Gmail password
  },
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  const mail = {
    from: name,
    to: "ferwelo.n.bscs@gmail.com",
    subject: "My Statify - Concern",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
        <h2 style="color: #333;">Contact Form Submission</h2>
        <p style="color: #333; font-size: 16px;">Name: ${name}</p>
        <p style="color: #333; font-size: 16px;">Email: ${email}</p>
        <p style="color: #333; font-size: 16px;">Message:</p>
        <div style="background-color: #fff; border: 1px solid #ccc; padding: 10px; color: #333; font-size: 14px; line-height: 1.6;">
          ${message}
        </div>
      </div>
    `,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.log(error);
      res.status(500).json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});

const cors = microCors({ allowMethods: ['POST'] });

module.exports = cors((req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 200, 'ok');
  }
  return app(req, res);
});