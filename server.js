import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // Permitir requests desde tu frontend

// Configura tu transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail", // O el servicio que uses
  auth: {
    user: "manzanosalejandro.dev@gmail.com",       // Tu correo
    pass: "Yosti811.",           // Contraseña de app si Gmail
  },
});

app.post("/api/enviar-pedido", async (req, res) => {
  const pedido = req.body;

  if (!pedido) return res.status(400).json({ ok: false, msg: "Pedido vacío" });

  const mailOptions = {
    from: "manzanosalejandro.dev@gmail.com",
    to: "manzanosalejandro.dev@gmail.com",
    subject: `Nuevo pedido: ${pedido.producto.nombre}`,
    html: `
      <h2>Nuevo pedido recibido</h2>
      <h3>Producto</h3>
      <ul>
        <li>Nombre: ${pedido.producto.nombre}</li>
        <li>Talla: ${pedido.producto.talla}</li>
        <li>Color: ${pedido.producto.color}</li>
        <li>Precio: ${pedido.producto.precio} €</li>
      </ul>
      <h3>Datos del cliente</h3>
      <ul>
        <li>Nombre: ${pedido.cliente.nombre}</li>
        <li>Dirección: ${pedido.cliente.direccion}</li>
        <li>Ciudad: ${pedido.cliente.ciudad}</li>
        <li>Código Postal: ${pedido.cliente.cp}</li>
        <li>Teléfono: ${pedido.cliente.telefono}</li>
      </ul>
      <p>Fecha del pedido: ${pedido.fecha}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error enviando el email" });
  }
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
