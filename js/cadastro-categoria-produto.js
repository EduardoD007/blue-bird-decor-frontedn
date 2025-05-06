import ui from "./ui.js"
import api from "./api.js"
import main from "./main.js"

document.addEventListener("DOMContentLoaded", () => {
  localStorage.clear();
  ui.renderizarCategorias();
  ui.listarNoFormulario('lista-categoria', 'buscaCategoria');

  const formularioCategoria = document.getElementById("cadastro-categoria");
  const formularioSubcategoria = document.getElementById("cadastro-subcategoria")

  formularioCategoria.addEventListener("submit", submeterCategoria);
  formularioSubcategoria.addEventListener("submit", submeterSubcategoria);
});

async function submeterCategoria(event) {
  event.preventDefault();
  const nome = document.getElementById("categoria").value;
  await api.salvarCategoria({nome});
  window.location.reload();
};

async function submeterSubcategoria(event) {
  event.preventDefault();
  const categoria_id = String(document.getElementById("lista-categoria").value).split(" ")[0];
  const nome = document.getElementById("subcategoria").value;
  await api.salvarSubcategoria({nome, categoria_id});
  window.location.reload();
};

