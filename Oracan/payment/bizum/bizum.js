document.addEventListener("DOMContentLoaded", () => {
  const pedido = JSON.parse(localStorage.getItem("pedidoConfirmado"));

  if (!pedido) {
    alert("No se ha encontrado ningún pedido.");
    window.location.href = "/Oracan/payment/facturacion.html";
    return;
  }

  const btnConfirmar = document.getElementById("confirmarPago");
  document.getElementById("importePedido").textContent =
    pedido.producto.precio + "€";

  btnConfirmar.addEventListener("click", () => {
    const pedido = JSON.parse(localStorage.getItem("pedidoConfirmado"));

    const subject = `Nuevo pedido: ${pedido.producto.nombre}`;
    const body = `
Nuevo pedido recibido

Producto:
- Nombre: ${pedido.producto.nombre}
- Talla: ${pedido.producto.talla}
- Color: ${pedido.producto.color}
- Precio: ${pedido.producto.precio} €

Datos del cliente:
- Nombre: ${pedido.cliente.nombre}
- Dirección: ${pedido.cliente.direccion}
- Ciudad: ${pedido.cliente.ciudad}
- Código Postal: ${pedido.cliente.cp}
- Teléfono: ${pedido.cliente.telefono}

Fecha del pedido: ${pedido.fecha}
  `;

    window.location.href = `mailto:manzanosalejandro.dev@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = "/Oracan/index.html";
  });
});
