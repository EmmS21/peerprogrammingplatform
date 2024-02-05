/* eslint-disable import/no-extraneous-dependencies */
import sgMail from "@sendgrid/mail";
import "dotenv/config";

const API_KEY = process.env.SEND_GRID;
sgMail.setApiKey(API_KEY);

const sendEmail = async (vulnerabilities) => {
  const msg = {
    to: "emmanuelsibanda21@gmail.com",
    from: "emmanuelsibandaus@gmail.com",
    subject: "Audit Vulnerabilities Detected",
    text: `The following high or critical severity vulnerabilities have been detected: ${vulnerabilities}`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
  }
};

const vulnerabilities = process.argv[2];
sendEmail(vulnerabilities);
