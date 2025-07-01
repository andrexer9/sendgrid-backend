const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/enviar-codigo', async (req, res) => {
  const { email, codigo } = req.body;

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Código de Verificación',
    text: `Tu código de verificación es: ${codigo}`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('Correo enviado correctamente');
  } catch (error) {
    console.error('Error al enviar:', error);
    res.status(500).send('Error al enviar correo');
  }
});

app.post('/enviar-correo-tutor', async (req, res) => {
  const { correo, mensaje, datosEstudiante } = req.body;

  const msg = {
    to: correo,
    from: process.env.EMAIL_FROM,
    subject: 'Mensaje de estudiante asignado',
    text: `
${mensaje}

Datos del estudiante:
- Nombre: ${datosEstudiante.nombre}
- Correo institucional: ${datosEstudiante.correo}
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('Correo enviado al tutor correctamente');
  } catch (error) {
    console.error('Error al enviar:', error);
    res.status(500).send('Error al enviar correo');
  }
});

app.get('/', (req, res) => res.send('API SendGrid funcionando'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
