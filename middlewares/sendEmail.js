require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "prohunt012@gmail.com",
        pass: "rsbfipknjbdnthwh",
      },
    });

    await transporter.sendMail({
      from: "prohunt012@gmail.com",
      to: email,
      subject: subject,
      html: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
