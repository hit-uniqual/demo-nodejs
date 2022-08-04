// import Email from 'email-templates'
import nodemailer from 'nodemailer'

require('dotenv').config()

export default async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  })
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: data.email,
    subject: 'Mail verification',
    text: `You email verification otp is:${data.otp}`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log(`Email sent: ${info.response}`)
    }
  })
}
