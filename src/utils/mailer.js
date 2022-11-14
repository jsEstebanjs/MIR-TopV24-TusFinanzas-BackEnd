const nodemailer = require('nodemailer')

exports.transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

exports.verify = async (transporter) => {
  try {
    const connection = await transporter.verify()
    if (connection) {
      console.log("Preparado para enviar correos")
    }

  } catch (error) {
    console.log(`Problemas para enviar correos ${error}`)
  }
}

exports.welcome = (user) => {
  return {
    from: `<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Bienvenido a Tus Finanzas",
    html: `
      <div>
        <h1> Bienvenido ${user.name}</h1>
      </div>
    `,
    text: `Bienvenido ${user.name}`
  }
}