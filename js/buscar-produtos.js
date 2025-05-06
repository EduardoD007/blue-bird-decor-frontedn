import ui from "./ui.js"
import api from "./api.js"
import main from "./main.js"


document.addEventListener("DOMContentLoaded", () => {
  localStorage.clear();
  ui.listarNoFormulario('categoria', 'buscaCategoria');
  ui.listarNoFormulario('fornecedor', 'buscaFornecedor');
  ui.renderizarProdutos("paginaBuscar", ' ');
  //ui.formularioEditar();

  const campoSubcategoria = document.getElementById('subcategoria');
  const campoCategoria = document.getElementById("categoria");
  const campoFornecedor = document.getElementById('fornecedor')

  const botaoBuscar01 = document.getElementById('botao-buscar-id')
  const botaoBuscar02 = document.getElementById('botao-buscar-02');

  campoCategoria.addEventListener('change', ui.listarSubcategoriaNoFormulario);

  botaoBuscar01.addEventListener('click', async (event) => {
    event.preventDefault()
    const produtoId = document.getElementById('buscar-produto-id').value
    console.log(produtoId)
    const produto = ui.renderizarProdutoPorId('paginaBuscar',produtoId)
    document.getElementById('buscar-produto-id').value = ''
  })

  botaoBuscar02.addEventListener('click', async (event) => {
    event.preventDefault();
    const categoriaId = String(campoCategoria.value).split(" ")[0];
    const subCategoriaId = String(campoSubcategoria.value).split(" ")[0];
    const fornecedorId = String(campoFornecedor.value).split(" ")[0];

    var queryString = validarParametros(categoriaId, subCategoriaId, fornecedorId);
    console.log(queryString)
    await ui.renderizarProdutos('paginaBuscar',queryString);
    campoCategoria.value = 'Escolha a categoria'
    campoSubcategoria.value = 'Escolha uma subcategoria'
    campoFornecedor.value = 'Escolha um fornecedor'
  });

});

function validarParametros(categoriaId, subCategoriaId, fornecedorId) {
  let string;

  if(categoriaId === "Escolha") {
    categoriaId = "vazio";
  }
  if(subCategoriaId === "Escolha") {
    subCategoriaId ="vazio";
  }
  if(fornecedorId === "Escolha") {
    fornecedorId = "vazio";
  }
  
  string = `?categoria_Id=${categoriaId}&subCategoria_Id=${subCategoriaId}&fornecedor_Id=${fornecedorId}`;
  return string
}











