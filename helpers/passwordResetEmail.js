import nodemailer from 'nodemailer';

const passwordResetEmail = async (data) => {
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
      subject: 'myTasks - Restablece tu contraseña',
      text: 'myTasks - Restablece tu contraseña',
      html: `<p>Hola, ${name} ${lastname}!</p>

        <p>Has solicitado restablecer tu contraseña, para ello presiona en el siguiente enlace: 
          <a href="${process.env.FRONTEND_URL}/reset-password/${token}">click aquí</a>
        </p>

        <p>Si usted no solicitó este cambio, por favor ignore este mensaje.</p>
      `
    });

    console.log('E-mail envíado: %s', info.messageId);
};

export default passwordResetEmail;

