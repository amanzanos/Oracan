document.addEventListener("DOMContentLoaded", () => {
  const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
  const resumenDiv = document.getElementById("productoResumen");

  if (producto) {
    resumenDiv.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <div>
        <h3>${producto.nombre}</h3>
        <p>Precio: ${producto.precio} €</p>
        <p>Talla: ${producto.talla || "—"}</p>
        <p>Color: ${producto.color || "—"}</p>
      </div>
    `;
  } else {
    resumenDiv.innerHTML = "<p>No hay producto seleccionado.</p>";
  }

  const form = document.getElementById("formFacturacion");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const ciudad = document.getElementById("ciudad").value.trim();
    const cp = document.getElementById("cp").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    const errores = [];
    if (!/^[a-zA-ZÀ-ÿ\s]{3,50}$/.test(nombre))
      errores.push("Nombre inválido (3-50 letras).");
    if (!/^.{5,100}$/.test(direccion))
      errores.push("Dirección inválida (5-100 caracteres).");
    if (!/^[a-zA-ZÀ-ÿ\s]{2,50}$/.test(ciudad))
      errores.push("Ciudad inválida (2-50 letras).");
    if (!/^\d{5}$/.test(cp))
      errores.push("Código postal inválido (5 dígitos).");
    if (!/^\d{9}$/.test(telefono))
      errores.push("Teléfono inválido (9 dígitos).");

    if (errores.length > 0) {
      alert("❌ Corrige los errores:\n" + errores.join("\n"));
      return;
    }

    if (!producto) {
      alert("❌ No hay producto seleccionado.");
      return;
    }

    const pedido = {
      producto: {
        nombre: producto.nombre,
        precio: producto.precio,
        talla: producto.talla || "—",
        color: producto.color || "—",
      },
      cliente: {
        nombre,
        direccion,
        ciudad,
        cp,
        telefono,
      },
      fecha: new Date().toLocaleString(),
    };
    console.log("Pedido creado:", pedido);
    console.log("Producto en el pedido:", pedido.producto.nombre);
    localStorage.setItem("pedidoConfirmado", JSON.stringify(pedido));
    console.log("Pedido guardado:", pedido);
    window.location.href = "/Oracan/payment/bizum/bizum.html";
  });
});
