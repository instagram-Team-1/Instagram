import dotenv from 'dotenv'
import { Resend } from 'resend'

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

const sendVerificationEmail = async (email: string, code: number) => {
  try {
    const response = await resend.emails.send({
      from: 'Pentagram Team <team@yourdomain.com>', 
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
    })
    console.log('Resend API response:', response)
  } catch (error) {
    console.error('Error sending verification email', error)
  }
}

export default sendVerificationEmail
