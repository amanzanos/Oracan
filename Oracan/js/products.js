const datosRopa = {
  ropa: [
    {
      id: 1,
      nombre: "Camiseta Exceed",
      descripcion:
        "Camiseta ligera y transpirable de algodón orgánico con tonos azul oscuro. Ideal para looks urbanos y casuales. Mensaje inspirador estampado en la parte trasera para motivarte cada día.",
      precio: 29.99,
      imagen: "assets/images/camisetaExceed.jpeg",
      material: "Algodón orgánico 100%",
      fit: "Regular fit",
      diseno: "Detalles minimalistas con mensaje inspirador en inglés",
      imagenAlt: "assets/images/camisetaExceedAlt.jpeg",
      colores: [
        { nombre: "Rojo", hex: "#d40000", imagen: "assets/images/rojo.jpg" },
        { nombre: "Azul", hex: "#0040ff", imagen: "assets/images/azul.webp" },
      ],
      accesorio: false,
    },
    {
      id: 2,
      nombre: "Camiseta Twisted Reality",
      descripcion:
        "Sudadera gruesa con interior afelpado y tacto suave. Perfecta para soportar climas fríos y ventosos, manteniendo la comodidad y estilo urbano. Ideal para combinar con jeans o pantalones deportivos.",
      precio: 49.95,
      imagen: "assets/images/camisetaTwistedReality.jpeg",
      material: "Algodón 80% + Poliéster reciclado 20%",
      fit: "Oversize",
      diseno: "Camiseta con logo al frente y diseño abstracto en la espalda",
      imagenAlt: "assets/images/camisetaTwistedRealityAlt.jpeg",
      colores: [
        { nombre: "Rojo", hex: "#d40000", imagen: "assets/images/rojo.jpg" },
        { nombre: "Azul", hex: "#0040ff", imagen: "assets/images/azul.webp" },
      ],
      accesorio: false,
    },
    {
      id: 3,
      nombre: "Gorra Rush Oracan",
      descripcion:
        "Gorra minimalista de estilo moderno con visera curva y ajuste trasero. Ideal para protegerte del sol y complementar cualquier look urbano o deportivo. Diseño elegante.",
      precio: 89.5,
      imagen: "assets/images/gorra.jpeg",
      material: "Nylon técnico + forro térmico ligero",
      fit: "Slim-fit",
      diseno: "Gorra verde con logo bordado en el frontal",
      accesorio: true,
    },
    {
      id: 4,
      nombre: "Calcetines Rush Oracan",
      descripcion:
        "Calcetines ergonómicos de lana reciclada, suaves y transpirables. Perfectos para mantener los pies cómodos durante todo el día, ya sea en actividades deportivas o para uso diario. Diseño con logo bordado en zona visible.",
      precio: 24.9,
      imagen: "assets/images/calcetines.jpeg",
      material: "Lana reciclada suave",
      fit: "Talla única",
      diseno:
        "Calcetines con diseño anatómico, transpirables y con logo bordado",
      colores: [
        {
          nombre: "Azul",
          hex: "#889ddc32",
          imagen: "assets/images/calcetinesAzul.jpeg",
        },
      ],
      accesorio: true,
    },
    {
      id: 5,
      nombre: "Gafas Boreal",
      descripcion:
        "Gafas modernas inspiradas en los paisajes del norte, con montura resistente y lentes de alta calidad. Perfectas para actividades al aire libre o looks urbanos. Diseñadas para comodidad y estilo diario.",
      precio: 24.9,
      imagen: "assets/images/camiseta1.jpg",
      material: "Policarbonato",
      fit: "Universal",
      diseno: "Montura ligera y resistente, ideal para todo tipo de rostro",
      imagenAlt: "assets/images/camisetaTwistedRealityAlt.jpeg",
      colores: [
        { nombre: "Rojo", hex: "#d40000", imagen: "assets/images/rojo.jpg" },
        { nombre: "Azul", hex: "#0040ff", imagen: "assets/images/azul.webp" },
      ],
      accesorio: false,
    },
  ],
};


const contenedor = document.getElementById("contenedorRopa");

datosRopa.ropa.forEach((producto, index) => {
  const section = document.createElement("section");
  section.classList.add("producto");

  section.classList.add(index % 2 === 0 ? "izquierda" : "derecha");

  section.innerHTML = `
    <div class="info">
      <h2>${producto.nombre}</h2>
      <p>${producto.descripcion}</p>
      <p class="precio">${producto.precio.toFixed(2)} €</p>
      <a href="#" class="boton">Ver más</a>
    </div>
    <div class="imagen-producto">
      <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>
  `;

  contenedor.appendChild(section);
});
