const nodemailer = require("nodemailer");


const sendEmail = async (receiver, token) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: `${process.env.USER_EMAIL}`,
            pass: `${process.env.USER_PASSWORD}`,
        },
    });
    var mailOptions = {
        from: `${process.env.USER_EMAIL}`,
        to: receiver,
        subject: "Please verify your email",
        text: "From NovelForest Team",
        html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: black;">Welcome you to NovelForest</h2>
        <p>Congratulations! You're almost get to start using NovelForest.
            Just click the button below to validate your email address.
        </p>
        
        <a href=http://localhost:8000/api/auth/verify/${token} style="background: green; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Verify your account</a>
        </div>
      `,
        amp: `<!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
          </head>
          <body> </body>
        </html>`
    };

    transporter.sendMail(mailOptions, function (error, info){
        if (error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    })
}

module.exports = sendEmail;