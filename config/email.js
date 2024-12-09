const nodemailer = require('nodemailer');

const sendOtpEmail = async (to, otp) => {
    // console.log(to, otp);
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
