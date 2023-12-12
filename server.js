const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importar el paquete cors
const app = express();

app.use(express.json());
app.use(cors()); // Usar el middleware cors

mongoose.connect('mongodb+srv://David2911:lMGjNg3iIoGc5Jo4@cluster0.ydrqsu1.mongodb.net/ipnizipay');

const DatosSchema = new mongoose.Schema({
  datosCabecera: Object, // Campo para almacenar los datos de la cabecera de la solicitud
  responseCode: Object, // Campo para almacenar los datos de la cabecera
  message: Object, // Campo para almacenar los datos del detalle
  respuestaCompleta: Object // Campo para almacenar cualquier dato adicional de la solicitud
});

const Datos = mongoose.model('ipn', DatosSchema);

app.post('/api/data', async (req, res) => {
  const bodyData = req.body;

  console.log('Datos del cuerpo de la solicitud:');
  console.log(bodyData);

  try {
    // Obtener los datos de la cabecera
    const datosCabecera = req.headers;

    // Obtener los datos del response
    const { responseCode, message, ...respuestaCompleta } = bodyData;

    // Crear una instancia del modelo para guardar en la base de datos
    const nuevaEntrada = new Datos({
      datosCabecera,
      responseCode,
      message,
      respuestaCompleta
    });

    // Guardar los datos en la base de datos
    await nuevaEntrada.save();

    console.log('Datos guardados en la base de datos');

    res.status(200).json({ message: 'Datos recibidos y guardados correctamente en la base de datos' });
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    res.status(500).json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API IPN - Servidor escuchando en el puerto ${PORT}`);
});