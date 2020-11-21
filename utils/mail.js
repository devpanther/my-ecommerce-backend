const sgMail = require("@sendgrid/mail");

module.exports.sendMail = async (data) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    await sgMail.send({
      to: data.email, // The recipient's email
      from: process.env.SENDER, // The verified sender's email
      templateId: data.templateId, // Dynamic Template ID
      dynamicTemplateData: {
        email: data.email,
        firstname: data.firstname,
        link: data.link,
        token: data.token ? data.token : "",
        logo: "https://kenzy-ecommerce.s3.af-south-1.amazonaws.com/logo-1.jpg",
      }, // Data to embed in the dynamic template
    });
    console.log("Sent");
  } catch (e) {
    console.error(e);
  }
};

module.exports.sendReceiptMail = async ({
  email,
  templateId,
  amount,
  date,
  last4,
  receipt_url,
  card_logo,
  description,
}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    await sgMail.send({
      to: email, // The recipient's email
      from: process.env.SENDER, // The verified sender's email
      templateId, // Dynamic Template ID
      dynamicTemplateData: {
        amount,
        date,
        last4,
        receipt_url,
        card_logo,
        description,
      }, // Data to embed in the dynamic template
    });
  } catch (e) {
    console.error(e);
  }
};
