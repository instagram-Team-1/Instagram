import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendVerificationEmail = async (email:string, code:number) => {
  try {
   
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS, 
      },
    });

   
    const mailOptions = {
      from: 'pentagram team', 
      to: email,                      
      subject: 'Verification Code',   
      text: `Your verification code is: ${code}`,  
    };

  
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email', error);
  }
};

export default sendVerificationEmail;