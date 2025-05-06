import ui from "./ui.js"
import api from "./api.js"
import main from "./main.js"


document.addEventListener("DOMContentLoaded", () => {

  main.pegarProdutosNoStorage();
  ui.renderizarProdutosCadastrados();
  ui.listarNoFormulario("categoria", "buscaCategoria");
  ui.listarNoFormulario("fornecedor", "buscaFornecedor");

  const formularioProduto = document.getElementById("cadastro-produto");
  const campoCategoria = document.getElementById("categoria");

  formularioProduto.addEventListener("submit", submeterFormularioProduto);
  campoCategoria.addEventListener("change", ui.listarSubcategoriaNoFormulario)

});

async function submeterFormularioProduto(event) {
  event.preventDefault();

  const id = Number(document.getElementById("id").textContent);
  const categoria_id = Number(document.getElementById("categoria").value);
  var fornecedor_id = Number(document.getElementById("fornecedor").value);
  var subcategoria_id = Number(document.getElementById("subcategoria").value);
  const referencia = document.getElementById("referencia").value;
  const descricao = document.getElementById("descricao").value;
  const largura = document.getElementById("largura").value;
  const unidade_medida = document.getElementById("medida").value;
  const custo = document.getElementById("custo").value;
  const venda = document.getElementById("venda").value;

  if (subcategoria_id === "Escolha") {
    subcategoria_id = null;
  };

  if (fornecedor_id === "Escolha") {
    fornecedor_id = null;
  };

  try {
    if (id) {
      const response = await api.atualizarRegistro({ descricao, referencia, unidade_medida, largura, custo, venda, categoria_id, fornecedor_id, subcategoria_id },id)
      const classTr = await ui.renderizarProdutoDeletado(id)
      //await ui.renderizarProdutoAlterado(id, classTr)
      window.location.reload();

    } else {
      const response = await api.salvarProduto({ descricao, referencia, unidade_medida, largura, custo, venda, categoria_id, fornecedor_id, subcategoria_id });
      const produtoRegistrado = await response;
      await ui.renderizarProdutoCadastrado(produtoRegistrado.id);
      main.gravarProdutosCadastradosNaArray(produtoRegistrado)
      window.location.reload();
    }
  } catch (error) {
    
  }
};







