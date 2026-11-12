const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwWBedzr9pnmIu0qXiehnQVQ9E-THsf7oVMNu7dDHC4Bn_qiEhphDrR6W1_ZtOFjkHv/exec";

// Arreglo de 26 imágenes (puedes reemplazar las URLs por tus rutas locales o enlaces directos)
// Ruta base donde tienes tus imágenes (puede ser 'img/', './fotos/' o déjala vacía '' si usas URLs completas)
const BASE_IMAGE_PATH = "./Imagenes/";
const options = [
  {
    id: "Altos Mirandinos",
    title: "Altos Mirandinos",
    filename: "Altos Mirandinos.jpeg",
  },
  { id: "Amazonas", title: "Amazonas", filename: "Amazonas.jpeg" },
  { id: "Anzoategui", title: "Anzoátegui", filename: "Anzoategui.png" },
  { id: "Apure", title: "Apure", filename: "Apure.jpg" },
  { id: "Aragua", title: "Aragua", filename: "Aragua.png" },
  { id: "Barinas", title: "Barinas", filename: "Barinas.jpg" },
  { id: "Baruta", title: "Baruta", filename: "Baruta.png" },
  { id: "Bolivar", title: "Bolívar", filename: "Bolivar.png" },
  { id: "Carabobo", title: "Carabobo", filename: "Carabobo.png" },
  { id: "Cojedes", title: "Cojedes", filename: "Cojedes.jpg" },
  {
    id: "Delta Amacuro",
    title: "Delta Amacuro",
    filename: "Delta Amacuro.png",
  },
  { id: "Eje Barlovento", title: "Eje Barlovento", filename: "Barlovento.jpg" },
  {
    id: "Eje Guarenas Guatire",
    title: "Eje Guarenas - Guatire",
    filename: "Guarenas.png",
  },
  { id: "Falcon", title: "Falcón", filename: "Falcon.png" },
  {
    id: "La California",
    title: "La California",
    filename: "La California.png",
  },
  { id: "Lara", title: "Lara", filename: "Lara.jpg" },
  { id: "libertador", title: "Libertador", filename: "Libertador.jpeg" },
  { id: "Merida", title: "Mérida", filename: "Merida.png" },
  { id: "Monagas", title: "Monagas", filename: "Monagas.jpeg" },
  {
    id: "Nueva Esparta",
    title: "Nueva Esparta",
    filename: "Nueva Esparta.jfif",
  },
  { id: "portuguesa", title: "Portuguesa", filename: "Portuguesa.jpg" },
  { id: "Sucre", title: "Sucre", filename: "Sucre.png" },
  { id: "Tachira", title: "Táchira", filename: "Tachira.jpeg" },
  { id: "Trujillo", title: "Trujillo", filename: "Trujillo.png" },
  {
    id: "Valles del Tuy",
    title: "Valles del Tuy",
    filename: "Valles del Tuy.png",
  },
  { id: "Yaracuy", title: "Yaracuy", filename: "Yaracuy.jpeg" },
  { id: "Zulia", title: "Zulia", filename: "Zulia.png" },
];

const MAX_VOTES = 3;
let selectedOptions = [];
const voterData = {};

const gallery = document.getElementById("gallery-container");
const reviewBtn = document.getElementById("go-to-review-btn");
const counterText = document.getElementById("selection-counter");

// Renderizar galería de tarjetas
options.forEach((opt) => {
  const card = document.createElement("div");
  card.className = "option-card";
  card.setAttribute("data-id", opt.id);

  const fullImagePath = `${BASE_IMAGE_PATH}${opt.filename}`;

  card.innerHTML = `
      <div class="selection-badge"></div>
      <div class="image-wrapper">
        <img src="${fullImagePath}" alt="${opt.title}" loading="lazy">
        <button type="button" class="zoom-btn" onclick="openZoom(event, '${fullImagePath}')">🔍 Zoom</button>
      </div>
      <div class="option-info">${opt.title}</div>
    `;

  card.addEventListener("click", () => toggleSelection(opt.id));
  gallery.appendChild(card);
});

// Alternar selección
function toggleSelection(id) {
  const index = selectedOptions.indexOf(id);

  if (index > -1) {
    selectedOptions.splice(index, 1);
  } else {
    if (selectedOptions.length >= MAX_VOTES) {
      alert(
        "Solo puedes seleccionar un máximo de 3 opciones. Si deseas cambiar alguna, desmarca una primero.",
      );
      return;
    }
    selectedOptions.push(id);
  }

  updateGalleryUI();
}

function updateGalleryUI() {
  document.querySelectorAll(".option-card").forEach((card) => {
    const cardId = card.getAttribute("data-id");
    const order = selectedOptions.indexOf(cardId);
    const badge = card.querySelector(".selection-badge");

    if (order > -1) {
      card.classList.add("selected");
      badge.innerText = order + 1;
    } else {
      card.classList.remove("selected");
      badge.innerText = "";
    }
  });

  counterText.innerText = `Seleccionadas: ${selectedOptions.length} de ${MAX_VOTES}`;

  if (selectedOptions.length === MAX_VOTES) {
    reviewBtn.disabled = false;
    reviewBtn.innerText = "Revisar Selecciones";
  } else {
    reviewBtn.disabled = true;
    reviewBtn.innerText = `Selecciona ${MAX_VOTES - selectedOptions.length} más para continuar`;
  }
}

// Paso 1: Registro
document.getElementById("voter-form").addEventListener("submit", (e) => {
  e.preventDefault();
  voterData.nombre = document.getElementById("nombre").value.trim();
  voterData.apellido = document.getElementById("apellido").value.trim();
  voterData.cedula = document.getElementById("cedula").value.trim();
  voterData.coordinacion = document.getElementById("coordinacion").value.trim();

  document.getElementById("step-register").classList.add("hidden");
  document.getElementById("step-vote").classList.remove("hidden");
});

// Paso 2 a Paso 3: Ir a Revisión
reviewBtn.addEventListener("click", () => {
  if (selectedOptions.length !== MAX_VOTES) return;

  // Llenar datos del elector en la vista de revisión
  document.getElementById("summary-name").innerText =
    `${voterData.nombre} ${voterData.apellido}`;
  document.getElementById("summary-cedula").innerText = voterData.cedula;
  document.getElementById("summary-coordinacion").innerText =
    voterData.coordinacion;

  // Renderizar las 3 imágenes elegidas
  const reviewContainer = document.getElementById("review-container");
  reviewContainer.innerHTML = "";

  selectedOptions.forEach((id, index) => {
    const item = options.find((opt) => opt.id === id);
    const fullImagePath = `${BASE_IMAGE_PATH}${item.filename}`;

    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
        <div class="image-wrapper">
          <img src="${fullImagePath}" alt="${item.title}">
          <button type="button" class="zoom-btn" onclick="openZoom(event, '${fullImagePath}')">🔍 Zoom</button>
        </div>
        <div class="review-card-title">Voto ${index + 1}: ${item.title}</div>
      `;
    reviewContainer.appendChild(card);
  });

  document.getElementById("step-vote").classList.add("hidden");
  document.getElementById("step-review").classList.remove("hidden");
});

// Volver a modificar selección
document.getElementById("back-to-vote-btn").addEventListener("click", () => {
  document.getElementById("step-review").classList.add("hidden");
  document.getElementById("step-vote").classList.remove("hidden");
});

// Paso 3 a Enviar: Confirmación final
// Paso 3 a Enviar: Confirmación final
document
  .getElementById("confirm-submit-btn")
  .addEventListener("click", async () => {
    const confirmBtn = document.getElementById("confirm-submit-btn");
    const backBtn = document.getElementById("back-to-vote-btn");

    confirmBtn.disabled = true;
    backBtn.disabled = true;
    confirmBtn.innerText = "Registrando votos en el sistema...";

    // Mapear los IDs a los títulos legibles para que se guarden bien claros en Sheets
    const formattedVotes = selectedOptions.map((id) => {
      const item = options.find((opt) => opt.id === id);
      return item ? item.title : id;
    });

    const payload = {
      ...voterData,
      opciones: formattedVotes,
    };

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (res.status === "success") {
        document.getElementById("step-review").classList.add("hidden");
        document.getElementById("step-success").classList.remove("hidden");

        // Recargar la página automáticamente después de 3 segundos (3000 ms)
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        alert(res.message || "Ocurrió un error al registrar el voto.");
        confirmBtn.disabled = false;
        backBtn.disabled = false;
        confirmBtn.innerText = "Confirmar y Enviar Votos";
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al enviar los datos.");
      confirmBtn.disabled = false;
      backBtn.disabled = false;
      confirmBtn.innerText = "Confirmar y Enviar Votos";
    }
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
