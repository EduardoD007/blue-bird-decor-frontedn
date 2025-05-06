const url = 'http://localhost:3001'

const api = {
  async buscarProdutos(params) {
    try {
      const response = await fetch(`http://localhost:3001/produtos${params}`);
      return await response.json();
    } catch (error) {
      alert(`${error.message} - Erro as buscar produtos`);
      throw error
    }
  },

  async buscarProdutosSemMudar(params) {
    try {
      const response = await fetch(`http://localhost:3001/produtos/semMudar${params}`);
      return await response.json();
    } catch (error) {
      alert(`${error.message} - Erro as buscar produtos`);
      throw error
    }
  },

  async buscarProdutoPorId(id) {
    try {
      const response = await fetch(`http://localhost:3001/produtos/${id}`);
      return await response.json();
    } catch (error) {
      alert(`${error.message} - Erro as buscar produtos`);
      throw error
    }
  },

  async buscaCategoriaPorId(id) {
    const idCategoria = id;
    try {
      const response = await fetch(`http://localhost:3001/categoria_produtos/${idCategoria}`);
      return await response.json();
    } catch (error) {
      alert(`${error.message} - Erro as buscar produtos`);
      throw error
    }
  },

  async buscaCategoria() { 
    try {
      const response = await fetch(`http://localhost:3001/categoria_produtos`);
      return await response.json();
    } catch (error) {
      alert(`${error.message} - Erro as buscar categorias`);
      throw error 
    }
  },

  async buscarSubcategoria(categoriaId) {
    try {
      const response = await fetch(`http://localhost:3001/categoria_produtos/${categoriaId}/subcategorias`)
      return await response.json();
    } catch (error) {
      alert(`${error.message} - Erro ao buscar subcategorias`)
    }
  },

  async buscarTodasSubcategorias() {
    try {
      const response = await fetch(`http://localhost:3001/subcategorias`);
      return await response.json();
    } catch (error) {
      alert(`${error.message} - Erro as buscar todas subcategorias`);
    }
  },

  async buscaFornecedor(){
    try {
      const response = await fetch('http://localhost:3001/fornecedores');
      return await response.json();
    } catch (error) {
      alert(`${error.message} - Erro as buscar fornecedores`);
    }

  },

  async salvarProduto(produto) {
    try {
      const response = await fetch('http://localhost:3001/produtos', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(produto)
      });
      return response.json(); 
    } catch (error) {
      alert(`${error.message} - Erro ao adicionar produto`)
    }
  },

  async salvarCategoria(categoria){
    try {
      await fetch(`http://localhost:3001/categoria_produtos`, 
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(categoria)
        }
      )
    } catch (error) {
      alert(`${error.message} - Erro ao adicionar categoria`)
    }
  },

  async salvarSubcategoria(subcategoria){
    try {
      await fetch(`http://localhost:3001/categoria_produtos/subcategorias`, 
        {
          method:"POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(subcategoria)
        }
      )
    } catch (error) {
      alert(`${error.message} - Erro ao adicionar subCategoria`)
    }
  },

  async deletarProduto(id) { 
    const registroId = id;
    await fetch(`http://localhost:3001/produtos/${registroId}`, {
      method : "DELETE", 
    });  
  }, 

  async deletarCategoria(id) {
    try {
      const response = await fetch(`http://localhost:3001/categoria_produtos/${id}`,
        {
          method: "DELETE"
        }
      );
      const mensagem = await response.json();
      console.log(mensagem);
      alert(mensagem.message);
    } catch (error) {
      alert(`${error.message} - Erro ao apagar categoria`)
    }
  },

  async deletarSubcategoria(id) {
    try {
      const response = await fetch(`http://localhost:3001/subcategorias/${id}`,
        {
          method: "DELETE"
        }
      );
      const mensagem = await response.json();
      alert(mensagem.message);
    } catch (error) {
      alert(`${error.message} - Erro ao excluir subcategoria`)
    }
  },

  async atualizarRegistro (registro, id) {
    try {
      const response = await fetch (`${url}/produtos/${id}`, {
        headers: {
          'Content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(registro)
      })
      console.log(response)
      return await response.json()
      console.log(response)
    } catch (error) {
      alert(`${error.message} - Falha ao atualizar registro`)
    }
  }

}

export default api;