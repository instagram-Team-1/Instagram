import nodemailer from 'nodemailer';

const sendVerificationEmail = async (email: string, code: number) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // or use another email service
    auth: {
      user: 'polarb404@gmail.com',
      pass: 'superSecret123!12sdybjjashr',
    },
  });

  const mailOptions = {
    from: 'pentagram team',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email', error);
  }
};

export default sendVerificationEmail;
