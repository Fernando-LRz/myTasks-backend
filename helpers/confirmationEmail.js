import nodemailer from 'nodemailer';

const confirmationEmail = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { name, lastname, email, token } = data;

    const info = await transporter.sendMail({
      from: 'myTasks',
      to: email,
      subject: 'myTasks - Confirma tu e-mail',
      text: 'myTasks - Confirma tu e-mail',
      html: `<p>Hola, ${name} ${lastname}!</p>

        <p>Confirma tu e-mail para activar tu cuenta en myTasks, para ello presiona en el siguiente enlace: 
          <a href="${process.env.FRONTEND_URL}/confirm/${token}">click aquí</a>
        </p>

        <p>Si usted no creó esta cuenta, por favor ignore este mensaje.</p>
      `
    });

    console.log("E-mail envíado: %s", info.messageId);
};

export default confirmationEmail;