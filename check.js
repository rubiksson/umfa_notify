const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 🟢 Email Configuration (use your Gmail/SMTP details)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use your SMTP provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // App password (NOT your real password)
  },
});

async function checkProduct() {
  const url = 'https://jakosport.is/product/halfrenndpeysa/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const optionExists = $('.wvs-style-squared li.button-variable-item-164').length > 0;

  // Colors for Console Output
  const blue = '\x1b[34m'; // Blue timestamp 🔵
  const red = '\x1b[31m'; // Red for "NOT available" 🔴
  const green = '\x1b[32m'; // Green for "AVAILABLE" ✅
  const reset = '\x1b[0m'; // Reset color ⚪

  // Timestamp in UK format 🇬🇧
  const timestamp = `${blue}[${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}]${reset}`;

  // Status message
  const status = optionExists
    ? `${green}AVAILABLE!${reset}`
    : `${red}NOT available.${reset}`;

  console.log(`${timestamp} UMFA football top is ${status}`);

  // 🟢 Send Email if Available
  if (optionExists) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL, // Your notification email
      subject: 'UMFA Football Top Available!',
      text: `Yo! The UMFA football top (size 152) is back in stock. Grab it now: ${url}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`${red}Email failed to send: ${error}${reset}`);
      } else {
        console.log(`${green}Email sent: ${info.response}${reset}`);
      }
    });
  }
}

checkProduct().catch(console.error);