const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwWBedzr9pnmIu0qXiehnQVQ9E-THsf7oVMNu7dDHC4Bn_qiEhphDrR6W1_ZtOFjkHv/exec";

// Arreglo de 26 imágenes (puedes reemplazar las URLs por tus rutas locales o enlaces directos)
// Ruta base donde tienes tus imágenes (puede ser 'img/', './fotos/' o déjala vacía '' si usas URLs completas)
const BASE_IMAGE_PATH = "./Imagenes/";
const options = [
  { id: "Altos Mirandinos",       title: "Altos Mirandinos",         filename: "Altos Mirandinos.jpeg" },
  { id: "Amazonas",               title: "Amazonas",                 filename: "Amazonas.jpeg" },
  { id: "Anzoategui",             title: "Anzoátegui",               filename: "Anzoategui.png" },
  { id: "Apure",                  title: "Apure",                    filename: "Apure.jpg" },
  { id: "Aragua",                 title: "Aragua",                   filename: "Aragua.png" },
  { id: "Barinas",                title: "Barinas",                  filename: "Barinas.jpg" },
  { id: "Baruta",                 title: "Baruta",                   filename: "Baruta.png" },
  { id: "Bolivar",                title: "Bolívar",                  filename: "Bolivar.png" },
  { id: "Carabobo",               title: "Carabobo",                 filename: "Carabobo.png" },
  { id: "Cojedes",                title: "Cojedes",                  filename: "Cojedes.jpg" },
  { id: "Delta Amacuro",          title: "Delta Amacuro",            filename: "Delta Amacuro.png" },
  { id: "Eje Barlovento",         title: "Eje Barlovento",           filename: "Barlovento.jpg" },
  { id: "Eje Guarenas Guatire",   title: "Eje Guarenas - Guatire",   filename: "Guarenas.png" },
  { id: "Falcon",                 title: "Falcón",                   filename: "Falcon.png" },
  { id: "La California",          title: "La California",            filename: "La California.png" },
  { id: "Lara",                   title: "Lara",                     filename: "Lara.jpg" },
  { id: "libertador",             title: "Libertador",               filename: "Libertador.jpeg" },
  { id: "Merida",                 title: "Mérida",                   filename: "Merida.png" },
  { id: "Monagas",                title: "Monagas",                  filename: "Monagas.jpeg" },
  { id: "Nueva Esparta",          title: "Nueva Esparta",            filename: "Nueva Esparta.jfif" },
  { id: "portuguesa",             title: "Portuguesa",               filename: "Portuguesa.jpg" },
  { id: "Sucre",                  title: "Sucre",                    filename: "Sucre.png" },
  { id: "Tachira",                title: "Táchira",                  filename: "Tachira.jpeg" },
  { id: "Trujillo",               title: "Trujillo",                 filename: "Trujillo.png" },
  { id: "Valles del Tuy",         title: "Valles del Tuy",           filename: "Valles del Tuy.png" },
  { id: "Yaracuy",                title: "Yaracuy",                  filename: "Yaracuy.jpeg" },
  { id: "Zulia",                  title: "Zulia",                    filename: "Zulia.png" }
];

const voterData = {};
let selectedOption = null;

// Renderizar las 26 tarjetas en el contenedor
const gallery = document.getElementById("gallery-container");
const submitBtn = document.getElementById("submit-vote-btn");

// Renderizar la lista configurable
options.forEach((opt) => {
  const card = document.createElement("div");
  card.className = "option-card";
  card.setAttribute("data-id", opt.id);

  // Concatenar ruta base con nombre de archivo
  const fullImagePath = `${BASE_IMAGE_PATH}${opt.filename}`;

  card.innerHTML = `
      <div class="image-wrapper">
        <img src="${fullImagePath}" alt="${opt.title}" loading="lazy">
        <button type="button" class="zoom-btn" onclick="openZoom(event, '${fullImagePath}')">🔍 Zoom</button>
      </div>
      <div class="option-info">${opt.title}</div>
    `;

  card.addEventListener("click", () => {
    document
      .querySelectorAll(".option-card")
      .forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedOption = opt.id;
    submitBtn.disabled = false;
    submitBtn.innerText = `Votar por: ${opt.title}`;
  });

  gallery.appendChild(card);
});

// Paso 1: Enviar formulario personal
document.getElementById("voter-form").addEventListener("submit", (e) => {
  e.preventDefault();
  voterData.nombre = document.getElementById("nombre").value.trim();
  voterData.apellido = document.getElementById("apellido").value.trim();
  voterData.cedula = document.getElementById("cedula").value.trim();
  voterData.coordinacion = document.getElementById("coordinacion").value.trim();

  document.getElementById("step-register").classList.add("hidden");
  document.getElementById("step-vote").classList.remove("hidden");
});

// Zoom
function openZoom(e, src) {
  e.stopPropagation();
  const modal = document.getElementById("zoom-modal");
  document.getElementById("modal-img").src = src;
  modal.style.display = "flex";
}

function closeZoom() {
  document.getElementById("zoom-modal").style.display = "none";
}

// Paso 2: Enviar voto a Google Sheets
submitBtn.addEventListener("click", async () => {
  if (!selectedOption) return;

  submitBtn.disabled = true;
  submitBtn.innerText = "Registrando voto...";

  const payload = {
    ...voterData,
    opcion: selectedOption,
  };

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const res = await response.json();

    if (res.status === "success") {
      document.getElementById("step-vote").classList.add("hidden");
      document.getElementById("step-success").classList.remove("hidden");
    } else {
      alert(res.message || "Ocurrió un error al registrar el voto.");
      submitBtn.disabled = false;
      submitBtn.innerText = "Reintentar";
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión al enviar los datos.");
    submitBtn.disabled = false;
    submitBtn.innerText = "Reintentar";
  }
});
