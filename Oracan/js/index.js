document.getElementById("scrollDown").addEventListener("click", () => {
  document
    .getElementById("seccion-inicio")
    .scrollIntoView({ behavior: "smooth" });
});

let testimonios = { testimonios: [] };
let datosRopa = { ropa: [] };

async function cargarDatos() {
  const testRes = await fetch("/Oracan/data/testimonials.json");
  const prodRes = await fetch("/Oracan/data/products.json");

  testimonios = await testRes.json();
  datosRopa = await prodRes.json();

  const storedTest = localStorage.getItem("testimonios");
  if (storedTest) testimonios.testimonios = JSON.parse(storedTest);

  iniciarRender();
}

function iniciarRender() {
  const basicos = datosRopa.ropa.filter((p) => !p.accesorio);
  const accesorios = datosRopa.ropa.filter((p) => p.accesorio);

  renderProductos(
    accesorios,
    "Accesorios",
    "Complementos que marcan la diferencia",
    true
  );
  renderProductos(
    basicos,
    "Nuestros Básicos",
    "Prendas esenciales de nuestra colección"
  );

  renderTestimonios();
}

const contenedor = document.getElementById("contenedorRopa");

// Filtrar productos
const basicos = datosRopa.ropa.filter((p) => !p.accesorio);
const accesorios = datosRopa.ropa.filter((p) => p.accesorio);

// Función para renderizar secciones
function renderProductos(
  productos,
  titulo,
  subtituloTexto,
  esCarrusel = false
) {
  // Título de la sección
  const tituloSeccion = document.createElement("h2");
  tituloSeccion.textContent = titulo;
  tituloSeccion.classList.add("titulo-categoria");

  const subtitulo = document.createElement("span");
  subtitulo.textContent = subtituloTexto;
  tituloSeccion.appendChild(subtitulo);
  contenedor.appendChild(tituloSeccion);

  // Contenedor principal: normal o carrusel
  const contenedorSeccion = document.createElement("div");
  if (esCarrusel) {
    contenedorSeccion.classList.add("carrusel-accesorios");
  } else {
    contenedorSeccion.classList.add("seccion-productos");
  }
  contenedor.appendChild(contenedorSeccion);

  productos.forEach((producto, index) => {
    const section = document.createElement("section");
    section.classList.add("producto", "animar-scroll");
    section.style.position = "relative";
    if (!esCarrusel) section.style.animationDelay = `${index * 0.15}s`;

    section.innerHTML = `
      <div class="info">
        <h3>${producto.nombre}</h3>
        <p class="descripcion">${producto.descripcion}</p>
        <p class="precio">${producto.precio.toFixed(2)} €</p>
        <button class="boton ver-mas" data-index="${
          producto.id - 1
        }">Ver más</button>
      </div>
      <div class="imagen-producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
    `;

    const imgContainer = section.querySelector(".imagen-producto");
    const img = imgContainer.querySelector("img");

    if (window.innerWidth <= 768) {
      section.style.backgroundImage = `url('${producto.imagen}')`;
      section.style.backgroundSize = "cover";
      section.style.backgroundPosition = "center";
      section.style.backgroundRepeat = "no-repeat";
      if (imgContainer) imgContainer.style.display = "none";

      const overlay = document.createElement("div");
      overlay.className = "fondo-overlay";
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0,0,0,0.35)";
      overlay.style.zIndex = "1";
      section.prepend(overlay);

      const info = section.querySelector(".info");
      if (info) {
        info.style.position = "relative";
        info.style.zIndex = "2";
      }

      let toggled = false;
      section.addEventListener("touchstart", () => {
        if (!producto.imagenAlt) return;
        section.style.backgroundImage = toggled
          ? `url('${producto.imagen}')`
          : `url('${producto.imagenAlt}')`;
        toggled = !toggled;
      });
    } else {
      img.addEventListener("mouseover", () => {
        if (producto.imagenAlt) img.src = producto.imagenAlt;
      });
      img.addEventListener("mouseout", () => (img.src = producto.imagen));
      img.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
        if (producto.imagenAlt)
          img.src =
            img.src === producto.imagen ? producto.imagenAlt : producto.imagen;
      });
    }

    contenedorSeccion.appendChild(section);
  });
}


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("ver-mas")) {
    const index = e.target.dataset.index;
    const producto = datosRopa.ropa[index];

    localStorage.setItem(
      "productoSeleccionado",
      JSON.stringify(producto)
    );

    window.location.href = "/Oracan/product/product.html";
  }
});


// Scroll suave en enlaces internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

const abrir = document.getElementById("abrirModal");
const modal = document.getElementById("modalTestimonio");
const cerrar = document.getElementById("cerrarModal");

abrir.onclick = () => (modal.style.display = "flex");
cerrar.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Función para renderizar testimonios
function renderTestimonios() {
  const cont = document.getElementById("listaTestimonios");
  cont.innerHTML = testimonios.testimonios
    .map(
      (t) => `
<div class="testimonio">
<i class="fas fa-quote-left"></i>
<p>“${t.testimonio}”</p>
<h4>— ${t.nombre} ${t.apellido.charAt(0)}.</h4>
</div>
`
    )
    .join("");
}

// Añadir nuevo testimonio al formulario
const form = document.getElementById("formTestimonio");
form.onsubmit = (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const testimonio = document.getElementById("testimonio").value.trim();

  // Evitar duplicados exactos
  if (
    !testimonios.testimonios.some(
      (t) =>
        t.nombre === nombre &&
        t.apellido === apellido &&
        t.testimonio === testimonio
    )
  ) {
    testimonios.testimonios.push({ nombre, apellido, testimonio });
    localStorage.setItem(
      "testimonios",
      JSON.stringify(testimonios.testimonios)
    );
    renderTestimonios();
  }

  modal.style.display = "none";
  form.reset();
};
cargarDatos();
