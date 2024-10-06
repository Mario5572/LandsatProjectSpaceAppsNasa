
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { text } from 'express';
dotenv.config()

const GMAILDEORIGEN = 'datellite6@gmail.com'

//Hola si tienes alguna duda del codigo llama a Mario :D
//Si Mario ha muerto o le han secuestrado 3 rusos con kalasnikovs, voy a ayudarte a entender el codigo que viene a continuacion

//Creamos un transporter que creo que va a ser el servicio que se va a encargar de como tal, mandar los gmails
//En este caso estoy usando el servicio smtp de google(el gmail de toda la vida)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: GMAILDEORIGEN,
      pass: `SecretKEY`, //Esta es la clave secreta que da gmail para acceder a su clave, no compartir
    },
});

//Verificamos la integridad del transportador y Ponemos un mensaje por consola si no ha funcionado
transporter.verify().then(()=> console.log("Ready for sending emails")).catch((err)=>console.log("Something went wrong with the gmail transporter, check the mail sender module "+ err ))



export async function sendEmail(options) {
    const {
        subject = '',
        text = '',
        html = '',
        dest = [],
        attachments = []
    } = options;

    const mailOptions = {
        from: `<${GMAILDEORIGEN}>`, // Dirección del remitente
        to: dest.join(', '), // Lista de destinatarios
        subject: subject,
        text: text,
        html: html,
        attachments: attachments
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        return 0;
    } catch (error) {
        console.log("Error, email NOT sent successfully: ", error);
        throw error;
    }
}

