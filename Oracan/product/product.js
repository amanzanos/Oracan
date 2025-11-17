document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const UI = {
    imagenPrincipal: document.getElementById("imagenPrincipal"),
    vistaAlternativa: document.getElementById("vistaAlternativa"),
    nombre: document.getElementById("nombreProducto"),
    descripcion: document.getElementById("descripcionProducto"),
    precio: document.getElementById("precioProducto"),
    fit: document.getElementById("fitProducto"),
    material: document.getElementById("materialProducto"),
    diseno: document.getElementById("disenoProducto"),
    especificaciones: document.getElementById("especificaciones"),
    btnEspecificaciones: document.getElementById("btnEspecificaciones"),
    coloresContenedor: document.getElementById("coloresProducto"),
    zoomContainer: document.querySelector(".zoom-container"),
    zoomLente: document.querySelector(".zoom-lente"),
    btnComprar: document.querySelector(".boton-comprar"),
    sliderContainer: document.getElementById("productosInteres"),
  };

  let producto = null;
  try {
    producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
  } catch (e) {
    console.error("Error parseando productoSeleccionado:", e);
  }
  if (!producto) return;

  // ---------- Rellenar info básica ----------
  if (UI.imagenPrincipal) UI.imagenPrincipal.src = producto.imagen || "";
  if (UI.vistaAlternativa)
    UI.vistaAlternativa.src = producto.imagenAlt || producto.imagen || "";
  if (UI.nombre) UI.nombre.textContent = producto.nombre || "";
  if (UI.descripcion) UI.descripcion.textContent = producto.descripcion || "";
  if (UI.precio)
    UI.precio.textContent =
      producto.precio != null ? Number(producto.precio).toFixed(2) : "";
  if (UI.fit) UI.fit.textContent = producto.fit || "—";
  if (UI.material) UI.material.textContent = producto.material || "—";
  if (UI.diseno) UI.diseno.textContent = producto.diseno || "—";

  // ---------- Acordeón especificaciones ----------
  if (UI.btnEspecificaciones && UI.especificaciones) {
    UI.btnEspecificaciones.addEventListener("click", () => {
      UI.especificaciones.classList.toggle("activo");
      UI.btnEspecificaciones.classList.toggle("abierto");
    });
  }

  // ---------- COLORES ----------
  const normalizeColor = (c) => {
    if (!c) return null;
    if (typeof c === "string")
      return { nombre: c, hex: "#cccccc", imagen: producto.imagen || "" };
    if (typeof c === "object")
      return {
        nombre: c.nombre || "Color",
        hex: c.hex || "#cccccc",
        imagen: c.imagen || producto.imagen || "",
      };
    return null;
  };

  if (UI.coloresContenedor) {
    UI.coloresContenedor.innerHTML = "";
    const raw = Array.isArray(producto.colores) ? producto.colores : [];

    const clearSelected = () =>
      UI.coloresContenedor
        .querySelectorAll(".color-btn")
        .forEach((b) => b.classList.remove("selected"));

    const buildDefaultBtn = () => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color-btn default-color selected";
      btn.setAttribute("aria-label", "Imagen por defecto");
      btn.style.position = "relative";
      btn.style.width = "30px";
      btn.style.height = "30px";
      btn.style.borderRadius = "50%";
      btn.style.background = "#ffffff";
      btn.style.padding = "0";
      btn.style.marginRight = "8px";
      btn.style.border = "none";

      const slash = document.createElement("span");
      slash.style.position = "absolute";
      slash.style.left = "-10%";
      slash.style.top = "50%";
      slash.style.width = "120%";
      slash.style.height = "2px";
      slash.style.background = "#000";
      slash.style.transform = "rotate(-45deg)";
      slash.style.pointerEvents = "none";
      btn.appendChild(slash);

      btn.addEventListener("click", () => {
        clearSelected();
        btn.classList.add("selected");
        if (UI.imagenPrincipal) {
          UI.imagenPrincipal.style.opacity = "0";
          setTimeout(() => {
            UI.imagenPrincipal.src = producto.imagen || "";
            if (UI.vistaAlternativa)
              UI.vistaAlternativa.src =
                producto.imagenAlt || producto.imagen || "";
            UI.imagenPrincipal.style.opacity = "1";
          }, 130);
        }
      });

      return btn;
    };

    UI.coloresContenedor.appendChild(buildDefaultBtn());

    raw.forEach((r) => {
      const c = normalizeColor(r);
      if (!c) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color-btn";
      btn.title = c.nombre;
      btn.style.width = "30px";
      btn.style.height = "30px";
      btn.style.borderRadius = "50%";
      btn.style.marginRight = "8px";
      btn.style.padding = "0";
      btn.style.border = "0";
      btn.style.cursor = "pointer";
      btn.style.backgroundColor = c.hex || "#cccccc";

      const hex = (c.hex || "#cccccc").replace("#", "");
      const rVal = parseInt(
        hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2),
        16
      );
      const gVal = parseInt(
        hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4),
        16
      );
      const bVal = parseInt(
        hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6),
        16
      );
      const lum = (0.2126 * rVal + 0.7152 * gVal + 0.0722 * bVal) / 255;
      if (lum > 0.8) btn.style.boxShadow = "inset 0 0 0 2px rgba(0,0,0,0.25)";

      btn.addEventListener("click", () => {
        clearSelected();
        btn.classList.add("selected");
        if (UI.imagenPrincipal) {
          UI.imagenPrincipal.style.opacity = "0";
          setTimeout(() => {
            UI.imagenPrincipal.src = c.imagen || producto.imagen || "";
            if (UI.vistaAlternativa)
              UI.vistaAlternativa.src =
                producto.imagenAlt || c.imagen || producto.imagen || "";
            UI.imagenPrincipal.style.opacity = "1";
          }, 130);
        }
      });

      UI.coloresContenedor.appendChild(btn);
    });
  }

  // ---------- TALLAS y MODAL ----------
  const tallasWrapper = document.querySelector(".tallas");
  const guiaWrapper = document.querySelector(".guia-tallas");
  const modalGuia = document.getElementById("modalGuia");

  if (producto.accesorio) {
    // Si es accesorio, eliminamos todo lo de tallas
    if (tallasWrapper) tallasWrapper.remove();
    if (guiaWrapper) guiaWrapper.remove();
    if (modalGuia) modalGuia.remove();
  } else {
    // Lógica de selección de talla
    let tallaSeleccionada = null;
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList && target.classList.contains("talla")) {
        $$(".talla").forEach((t) => t.classList.remove("activa"));
        target.classList.add("activa");
        tallaSeleccionada = target.textContent.trim();
      }
    });

    // Modal guía
    const abrirGuia = document.getElementById("abrirGuia");
    const cerrarModalBtn = modalGuia
      ? modalGuia.querySelector(".cerrar")
      : null;

    if (abrirGuia && modalGuia)
      abrirGuia.addEventListener(
        "click",
        () => (modalGuia.style.display = "flex")
      );
    if (cerrarModalBtn && modalGuia)
      cerrarModalBtn.addEventListener(
        "click",
        () => (modalGuia.style.display = "none")
      );
    window.addEventListener("click", (e) => {
      if (modalGuia && e.target === modalGuia) modalGuia.style.display = "none";
    });
  }

  // ---------- Dots de imagen ----------
  let intercambiarImagenes = () => {};
  const dotsContainer = document.querySelector(".image-dots");
  if (!producto.accesorio) {
    const dots = document.querySelectorAll(".image-dots .dot");

    const activarDot = (index) => {
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[index].classList.add("active");
    };

    const cambiarImagenPorDot = (index) => {
      if (!UI.imagenPrincipal) return;
      UI.imagenPrincipal.src =
        index === 0 ? producto.imagen : producto.imagenAlt || producto.imagen;
      activarDot(index);
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = parseInt(dot.dataset.index);
        cambiarImagenPorDot(index);
      });
    });

    const syncDots = () => {
      const src = UI.imagenPrincipal.src;
      const base = new URL(producto.imagen, location.href).href;
      const alt = producto.imagenAlt
        ? new URL(producto.imagenAlt, location.href).href
        : base;
      if (src === alt) activarDot(1);
      else activarDot(0);
    };

    intercambiarImagenes = () => {
      if (!UI.imagenPrincipal || !UI.vistaAlternativa) return;
      const tmp = UI.imagenPrincipal.src;
      UI.imagenPrincipal.src = UI.vistaAlternativa.src;
      UI.vistaAlternativa.src = tmp;
      syncDots();
    };
  } else if (dotsContainer) {
    dotsContainer.style.display = "none";
  }

  if (UI.vistaAlternativa)
    UI.vistaAlternativa.addEventListener("click", intercambiarImagenes);
  if (UI.imagenPrincipal)
    UI.imagenPrincipal.addEventListener("click", intercambiarImagenes);

  // ---------- Comprar ----------
  if (UI.btnComprar) {
    UI.btnComprar.addEventListener("click", () => {
      if (!producto.accesorio && !tallaSeleccionada) {
        alert("👕 Selecciona una talla antes de continuar.");
        return;
      }
      if (producto.accesorio) {
        alert("🛒 Accesorio añadido al carrito. Próximamente disponible.");
      } else {
        alert(
          `🛒 Has elegido la talla ${tallaSeleccionada}. Próximamente disponible.`
        );
      }
    });
  }

  // ---------- Lupa / Zoom ----------
  if (UI.zoomContainer && UI.imagenPrincipal && UI.zoomLente) {
    const img = UI.imagenPrincipal;
    const lens = UI.zoomLente;
    lens.style.display = "none";

    const moveLens = (clientX, clientY) => {
      const rect = img.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      lens.style.display = "block";
      const lw = lens.offsetWidth,
        lh = lens.offsetHeight;
      let left = x - lw / 2,
        top = y - lh / 2;
      left = Math.max(0, Math.min(left, rect.width - lw));
      top = Math.max(0, Math.min(top, rect.height - lh));
      lens.style.left = `${left}px`;
      lens.style.top = `${top}px`;
      lens.style.backgroundImage = `url('${img.src}')`;
      const posX = (x / rect.width) * 100;
      const posY = (y / rect.height) * 100;
      lens.style.backgroundPosition = `${posX}% ${posY}%`;
      lens.style.backgroundSize = `${rect.width * 2}px ${rect.height * 2}px`;
    };

    UI.zoomContainer.addEventListener("mousemove", (e) =>
      moveLens(e.clientX, e.clientY)
    );
    UI.zoomContainer.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches && e.touches[0]) {
          moveLens(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    UI.zoomContainer.addEventListener(
      "mouseleave",
      () => (lens.style.display = "none")
    );
    UI.zoomContainer.addEventListener(
      "touchend",
      () => (lens.style.display = "none")
    );
  } // Dentro del DOMContentLoaded de producto.js
  if (UI.btnComprar) {
    UI.btnComprar.addEventListener("click", () => {
      // Guardar producto seleccionado en localStorage
      let colorSeleccionado = null;
      const colorBtn = document.querySelector(".color-btn.selected");
      if (colorBtn && !colorBtn.classList.contains("default-color")) {
        colorSeleccionado = colorBtn.title || null;
      }

      let talla = null;
      const tallaBtn = document.querySelector(".talla.activa");
      if (tallaBtn) talla = tallaBtn.textContent.trim();

      if (!producto.accesorio && !talla) {
        alert("👕 Selecciona una talla antes de continuar.");
        return;
      }
      const productoSeleccionado = {
        nombre: UI.nombre.textContent,
        descripcion: UI.descripcion.textContent,
        precio: UI.precio.textContent,
        imagen: UI.imagenPrincipal.src,
        imagenAlt: UI.vistaAlternativa ? UI.vistaAlternativa.src : null,
        fit: UI.fit ? UI.fit.textContent : null,
        material: UI.material ? UI.material.textContent : null,
        diseno: UI.diseno ? UI.diseno.textContent : null,
        accesorio: producto.accesorio || false,
        talla: talla,
        color: colorSeleccionado,
      };
      console.log("Producto guardado:", productoSeleccionado);

      localStorage.setItem(
        "productoSeleccionado",
        JSON.stringify(productoSeleccionado)
      );
      // Redirigir a facturación
      window.location.href = "/Oracan/payment/facturacion.html";
    });
  }
});
