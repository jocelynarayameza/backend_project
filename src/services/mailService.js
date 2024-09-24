import { createTransport } from 'nodemailer';
import 'dotenv/config'


export const transporter = createTransport({
    host: process.env.HOST_ETHEREAL,
    port: process.env.PORT_ETHEREAL,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    }
});

export const mailOptionsEthereal = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Bienvenido/a',
    text: 'Este es el texto del email',
    html: "<h1>Mail de prueba Ethereal</h1>"
};

const transporterGmail = createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_GMAIL,
        pass: process.PASSWORD_GMAIL,
    },
});

const createMsgReset = (first_name) => {
    return `<p>¡Hola ${first_name}! Hacé click <a href="http://localhost:8080/new-pass">AQUÍ</a> 
      para restablecer tu contraseña.
      </p>`;
};

export const sendMail = async (user, token = null) => {
    try {
        const { first_name, email } = user;

        const msg = createMsgReset(first_name);
        const subj = "Restablecimiento de contraseña";

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subj,
            html: msg,
        };

        const response = await transporter.sendMail(mailOptions);
        if (token) return token;
        console.log("Enviado", response);
    } catch (error) {
        throw new Error(error);
    }
};