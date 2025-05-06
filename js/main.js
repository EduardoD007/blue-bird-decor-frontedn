import ui from "./ui.js"
import api from "./api.js"

var produtosCadastrados = [];
const main = {

  async excluirProduto(id) {
    try {
      api.deletarProduto(id);
      ui.renderizarProdutoDeletado(id);
      alert(`Produto ${id} foi excluído com sucesso`)
    } catch (error) {
      alert(`${error.message} - Erro excluir produto`)
    }
  },

  async excluirProdutoCadastrado(id) {
    try {
      api.deletarProduto(id);
      ui.renderizarProdutoDeletado(id);
      main.removerProdutoDaArray(id);
      alert (`Produto ${id} foi excluido com sucesso`);
      return id;
    } catch (error) {
      alert(`${error.message} - Erro ao deletar produto`)
    }
  },

  async excluirCategoria(id) {
    try {
    const resposta = await api.deletarCategoria(id);
    window.location.reload();
    } catch (error) {
      alert(`${error.message} - Erro ao excluir categoria`)
    }
  },

  async excluirSubcategoria(id) {
    try {
    const resposta = await api.deletarSubcategoria(id);
    window.location.reload();
    //alert(`Subcategoria ${subcategoriaId} excluída com sucesso`)
    } catch (error) {
      alert(`${error.message} - Erro ao excluir subcategoria`)
    }
  },

  async gravarProdutosCadastradosNaArray(produto) {
    try {
    produtosCadastrados.push(produto.id);
    localStorage.clear()
    localStorage.setItem("produtosCadastrados", JSON.stringify(produtosCadastrados));
    } catch (error) {
      alert(`${error.message} - Erro ao gravar na array -`)
    }
  },
  
  async removerProdutoDaArray(id) {
    var cont = -1;
    produtosCadastrados.forEach(produto => {
      cont ++; 
      if(produto.id == id) {
        produtosCadastrados.splice(cont,1);
        localStorage.clear()
        localStorage.setItem("produtosCadastrados", JSON.stringify(produtosCadastrados));
      }
    })
  },

  async pegarProdutosNoStorage(){
    if(localStorage.length > 0)
    produtosCadastrados = JSON.parse(localStorage.getItem('produtosCadastrados'));
  },

  async submeterFormularioEditar(event) {

    const id = Number(document.getElementById('campoProdutoId').textContent)
    const categoria_id = Number(document.getElementById('campoCategoria').value)
    const subcategoria_id = Number(document.getElementById('campoSubcategoria').value)
    const fornecedor_id = Number(document.getElementById('campoFornecedor').value)
    const descricao = document.getElementById('campoDescricao').value
    const referencia = document.getElementById('campoReferencia').value
    const unidade_medida = document.getElementById('campoMedida').value
    const largura = document.getElementById('campoLargura').value
    const custo = document.getElementById('campoCusto').value
    const venda = document.getElementById('campoVenda').value

    try {
      const response = await api.atualizarRegistro({ descricao, referencia, unidade_medida, largura, custo, venda, categoria_id, fornecedor_id, subcategoria_id },id)
      const registroAlterado = await response
      const classTr = await ui.renderizarProdutoDeletado(id)
      //await ui.renderizarProdutoAlterado(id, classTr)
      window.location.reload()
    } catch (error) {
      alert(`${error.message} - Erro ao atualizar produto`)
    }
  
  
 
  
  }

};

export default main;




