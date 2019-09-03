const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.firstName = user.name.split(" ")[0];
    this.to = user.email;
    this.from = `Mudassar Hassan <${process.env.EMAIL_FROM}>`;
    this.url = url;
  }

  mailTransporter() {
    if (process.env.NODE_ENV == "production") {
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      subject,
      url: this.url,
      firstName: this.firstName
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };
    await this.mailTransporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Natours Family!");
  }

  async sendPasswordResetLink() {
    await this.send("passwordReset", "Password Reset Link");
  }
};
