import api from "./api.js";
import main from "./main.js";

var trClass = 'tr';
var trClassAlterada = 'tr'

const ui = {

  //Renderiza todos os produtos
  async renderizarProdutos(tipoPagina, params ) {
    console.log(params)
    console.log(tipoPagina)
    //Busca a tabela que exibe os produtos e limpa a tabela
    const listaProdutos = document.getElementById("tabela-produtos");
    listaProdutos.innerText = null;
    //Busca os produtos no banco de dados e passa o retorno para a função de gerar tabela
    try {
      const listaProdutos = await api.buscarProdutos(params);
      this.gerarTabelaProdutos(listaProdutos, tipoPagina);
      return listaProdutos;
    } catch (error) {
      alert(`${error.message} - Erro ao renderizar`);
      throw alert;
    };
  },

  async renderizarProdutoPorId(tipoPagina, id ) {
    //Busca a tabela que exibe os produtos e limpa a tabela
    const listaProdutos = document.getElementById("tabela-produtos");
    listaProdutos.innerText = null;
    //Busca os produtos no banco de dados e passa o retorno para a função de gerar tabela
    try {
      const listaProdutos = await api.buscarProdutoPorId(id);
      this.gerarTabelaProdutos(listaProdutos, tipoPagina);
      return listaProdutos;
    } catch (error) {
      alert(`${error.message} - Erro ao renderizar`);
      throw alert;
    };
  },

  // Renderiza apenas o produto que foi cadastrado e o adiciona na tabela existente
  async renderizarProdutoCadastrado(id,) {

    // Controla a class da tr para altera as cores das linhas
    trClass == 'tr' ? trClass = 'tr-01' : trClass = 'tr';

    if (trClass === 'tr-01') {
      trClass = 'tr'
    } else {
      trClass = 'tr-01'
    }

    try {
      const produtoRetornado = await api.buscarProdutoPorId(id);
      await ui.gerarTabelaProdutos(produtoRetornado, 'trCadastrar');
      return produtoRetornado;
    } catch (error) {
      alert(`${error.message} - Erro ao renderizar novo produto -`);
    };
  },

  //Renderiza o produto que foi alterado, criando uma linha nova com o produto alterado e excluindo a antiga
  async renderizarProdutoAlterado(id, classTr) {
    const listaProdutos = document.getElementById("tabela-produtos");
    const linhaAtual = document.getElementById(`tr-${id}`)
    //Cria uma tr de referência com uma id acima da linha alterada
    const linhaReplaceId = id + 1
    const trReplace = document.getElementById(`tr-${linhaReplaceId}`)

    try {
      const produtoRetornado = await api.buscarProdutoPorId(id);
      await ui.gerarTabelaProdutos(produtoRetornado, 'trEditar');

      //Pega a linha que foi criada e passa a informação de classTr para manter a cor da linha
      const trAlterada = document.getElementById(`tr-${id}`)
      trAlterada.setAttribute('class', classTr)

      // Pega a nova linha criada e move para posição original
      listaProdutos.insertBefore(trAlterada, trReplace)
      return produtoRetornado;

    } catch (error) {
      alert(`${error.message} - Erro ao renderizar novo produto -`);
    };
  },

  //Renderiza os produtos que foram cadastrados no caso de atualização da página
  async renderizarProdutosCadastrados() {
    const listaProdutos = document.getElementById("tabela-produtos");
    let arrayProdutos = new Array();
    // Pega as ids dos produtos cadastrados no momento em uma localStorage
    arrayProdutos = await JSON.parse(localStorage.getItem("produtosCadastrados"));
    var string1 = ``
    var ponto = `?`
    // cria uma string para busca apenas as ids da localStorage
    if (arrayProdutos) {
      for (const id of arrayProdutos) {
        var string2 = `id=${id}&`;
        string1 = string1 + string2;
      }
    }

    string1 = (ponto + string1).slice(0, -1); // deleta o último caractere

    if (arrayProdutos) {
      try {
        const produtosRetornados = await api.buscarProdutos(string1);
        console.log(string1)
        this.gerarTabelaProdutos(produtosRetornados);
        return arrayProdutos;
      } catch (error) {
        alert(`${error.message} - Erro ao renderizar novo produto -`);
      };
    } else {
    }
  },

  //Renderiza as categorias e subcategorias na pagina de cadastro de categoria
  async renderizarCategorias() {
    //Busca as categorias no banco de dados
    const categorias = await api.buscaCategoria();

    // Busca as subcategorias da categoria pelo metodo de escopo de modelo do sequelize.
    try {
      for (const categoria of categorias) {
        const subcategoriaLista = await api.buscarSubcategoria(categoria.id);
        if (subcategoriaLista != 0) {
          ui.gerarTabelaSubcategorias(subcategoriaLista, categoria);
        } else {
          ui.gerarTabelaCategorias(categoria);
        }
      }
    } catch (error) {
      return alert(`${error.message} - Erro ao renderizar categorias`);
    }
  },

  //Renderiza o produto deletado nas páginas de cadastro de produto ou busca
  async renderizarProdutoDeletado(id) {
    try {
      //Pega a class da tr do produto deletado para controle de cor de linha em caso de edição de produto
      const classTr = document.getElementById(`tr-${id}`).getAttribute('class')
      //Pega uma td com a id do produto excluído
      const tdTabela = document.getElementById(`td-id-${id}`);
      //Exclui a linha com a id do produto excluído
      tdTabela.parentNode.parentNode.removeChild(tdTabela.parentNode);
      return classTr
    } catch (error) {
      alert(`${error.message} - Erro ao renderizar novo produto -`);
      throw alert;
    };
  },

  // Lista no campo select do formulário de forma dinâmica
  // Recebe tipoElemento que é o nome do campo select - fornecedor ou categoria
  // Recebe nomeBusca que é o que vai ser buscado no banco de dados: buscaFornecedor ou buscaCategoria
  async listarNoFormulario(tipoElemento, nomeBusca) {
    const elemento = document.getElementById(tipoElemento);
    const varElementos = await api[nomeBusca]();

    varElementos.forEach(element => {
      elemento.innerHTML += `
      <option  value='${element.id}'>${element.id} - ${element.nome}</option>
      `
    })
  },

  //Lista as subcategorias através de uma chamada de eventListener
  async listarSubcategoriaNoFormulario() {
    try {
      const categoriaId = document.getElementById('categoria').value;
      const formSubcategoria = document.getElementById('subcategoria');
      const listaSubcategoria = await api.buscarSubcategoria(categoriaId);

      if (categoriaId !== "Escolha uma categoria") {
        formSubcategoria.innerText = null;
        formSubcategoria.innerHTML = '<option>Escolha uma subcategoria</option>';

        if (listaSubcategoria.length > 0) {
          listaSubcategoria.forEach(subcategoria => {
            formSubcategoria.innerHTML += `
              <option value='${subcategoria.id}'>${subcategoria.id} - ${subcategoria.nome}</option>
            `
          });
        }
      } else {
        formSubcategoria.innerHTML = '<option>Escolha uma subcategoria</option>';
      }
    } catch (error) {
      alert(`${error.message} - Erro ao listar subcategorias`);
      throw alert;
    }
  },

  async listarSubcategoriaNoFormularioDom(campoCategoria, campoSubcategoria) {
    try {
      const categoriaId = document.getElementById(campoCategoria).value;
      const formSubcategoria = document.getElementById(campoSubcategoria);
      const listaSubcategoria = await api.buscarSubcategoria(categoriaId);

      if (categoriaId !== "Escolha uma categoria") {
        formSubcategoria.innerText = null;
        formSubcategoria.innerHTML = '<option>Escolha uma subcategoria</option>';

        if (listaSubcategoria.length > 0) {
          listaSubcategoria.forEach(subcategoria => {
            formSubcategoria.innerHTML += `
              <option value='${subcategoria.id}'>${subcategoria.id} - ${subcategoria.nome}</option>
            `
          });
        }
      } else {
        formSubcategoria.innerHTML = '<option>Escolha uma subcategoria</option>';
      }
    } catch (error) {
      alert(`${error.message} - Erro ao listar subcategorias`);
      throw alert;
    }
  },

  async gerarTabelaProdutos(produtos, tipoPagina) {
    const tabelaProdutos = document.getElementById('tabela-produtos');
    var produtosOrdenados = [];

    // Ordena as propriedades para coincidirem com as colunas da tabela
    for (var produtoNovo of produtos) {
      produtosOrdenados.push(
        {
          id: produtoNovo.id,
          categoria: produtoNovo.categoria_id,
          subcategoria: produtoNovo.subcategoria_id,
          fornecedor: produtoNovo.fornecedor_id,
          descricao: produtoNovo.descricao,
          referencia: produtoNovo.referencia,
          unidade_medida: produtoNovo.unidade_medida,
          largura: produtoNovo.largura,
          custo: produtoNovo.custo,
          venda: produtoNovo.venda
        }
      )
    }

    for (var produto of produtosOrdenados) {

      // Verifica a variável trClass para alternar cor das linhas
      var tr = document.createElement('tr');
      trClass == 'tr' ? trClass = 'tr-01' : trClass = 'tr';
      tr.classList.add(`${trClass}`);
      tr.setAttribute('id', `tr-${produto.id}`);

      // Renderiza cada linha da tabela de produtos
      for (var propriedade in produto) {
        if (!propriedade.includes('createdAt') && !propriedade.includes('updatedAt')) {
          var td = document.createElement('td');
          td.setAttribute('id', `td-${propriedade}-${produto.id}`)
          td.setAttribute('style', 'width: 9%');
          td.classList.add('td-01');
          td.textContent = produto[propriedade];
          tr.appendChild(td);
        }
        if(propriedade.includes('custo') || propriedade.includes('venda') ) {
          td.textContent = new Intl.NumberFormat('pt-Br', { style: 'currency', currency: 'BRL' }).format(Number(produto[propriedade]))
        }
      }

      const botaoEditar = document.createElement('button');
      botaoEditar.setAttribute('id', produto.id);
      botaoEditar.classList.add('botao-excluir');
      //botaoEditar.onclick = () => this.renderizarEditarValorProduto(botaoEditar.getAttribute('id'), produtosOrdenados);
      botaoEditar.onclick = () => {
        if (tipoPagina === 'paginaBuscar') {
          this.formularioEditar(botaoEditar.id)
        } else {
          this.renderizarEditarProduto(botaoEditar.id, produtosOrdenados)
        }
      }

      const imgEditar = document.createElement('img');
      imgEditar.src = '../Assets/Botao-editar.png';
      botaoEditar.appendChild(imgEditar);

      const botaoValor = document.createElement('button');
      botaoValor.setAttribute('id', produto.id);
      botaoValor.classList.add('botao-excluir');
      botaoValor.onclick  = () => this.renderizarEditarValorProduto(botaoEditar.getAttribute('id'), produtosOrdenados);

      const imgValor = document.createElement('img');
      imgValor.src = '../Assets/Botao-valor.png';
      botaoValor.appendChild(imgValor);

      const botaoExcluir = document.createElement('button');
      botaoExcluir.setAttribute('id', produto.id);
      botaoExcluir.classList.add('botao-excluir');
      botaoExcluir.onclick = () => main.excluirProdutoCadastrado(botaoExcluir.getAttribute('id'));

      const imgExcluir = document.createElement('img');
      imgExcluir.src = '../Assets/Botao-excluir-02.png';
      botaoExcluir.appendChild(imgExcluir);

      const tdBotaoExcluir = document.createElement('td');
      tdBotaoExcluir.setAttribute('style', 'width: 3%');
      tdBotaoExcluir.classList.add('td-botao-excluir');
      tdBotaoExcluir.appendChild(botaoExcluir);

      const tdBotaoEditar = document.createElement('td');
      tdBotaoEditar.setAttribute('style', 'width: 3%');
      tdBotaoEditar.classList.add('td-botao-editar');
      tdBotaoEditar.appendChild(botaoEditar);

      const tdBotaoValor = document.createElement('td');
      tdBotaoValor.setAttribute('style', 'width: 3%');
      tdBotaoValor.classList.add('td-botao-valor');
      tdBotaoValor.appendChild(botaoValor);

      
      tr.appendChild(tdBotaoValor);
      tr.appendChild(tdBotaoEditar);
      tr.appendChild(tdBotaoExcluir,);
      

      tabelaProdutos.appendChild(tr);
    }

  },

  async gerarTabelaCategorias(categoria) {
    const tabelaCategoria = document.getElementById('tabela-categoria');

    var categoriaOrdenada = {
      vazioInicio: "",
      categoria_id: categoria.id,
      categoria_nome: categoria.nome,
      excluirCategoria: "",
      subcategoria_id: "",
      subcategoria_nome: "",
      excluirSubcategoria: "",
      vazioFim: ""
    }

    try {
      const tr = document.createElement('tr');
      trClass == 'tr' ? trClass = 'tr-01' : trClass = 'tr';
      tr.classList.add(`${trClass}`);
      tr.setAttribute('id', `tr-${categoria.id}`)
      for (const propriedade in categoriaOrdenada) {
        if (!propriedade.includes('createdAt') && !propriedade.includes('updatedAt')) {
          const td = document.createElement('td');
          td.classList.add('td-01');
          td.setAttribute('style', 'width: 15%');
          td.textContent = categoriaOrdenada[propriedade];
          tr.appendChild(td);

          if (propriedade === 'excluirCategoria') {
            td.classList.add('td-excluir-categoria');
          }
          if (propriedade === 'excluirSubcategoria') {
            td.setAttribute('style', 'width: 5%');
          }
        }
      }
      const botaoExcluirCategoria = document.createElement('button');
      botaoExcluirCategoria.setAttribute('id', 'botao-excluir-categoria');
      botaoExcluirCategoria.classList.add('botao-excluir');
      botaoExcluirCategoria.onclick = () => { main.excluirCategoria(categoria.id) }

      const imgExcluir = document.createElement('img');
      imgExcluir.src = '../Assets/Botao-excluir-02.png'
      botaoExcluirCategoria.appendChild(imgExcluir);

      const tdExcluir = tr.querySelector('.td-excluir-categoria');
      tdExcluir.setAttribute('style', 'width: 5%');

      tdExcluir.appendChild(botaoExcluirCategoria);
      tabelaCategoria.appendChild(tr);
    } catch (error) {
      alert({ message: `${error.message} - Erro ao renderizar categorias` })
    }
  },

  async gerarTabelaSubcategorias(subcategorias, categoria) {
    const tabelaSubcategoria = document.getElementById('tabela-categoria');

    var subcategoriaOrdenada = [];

    for (const subcategoria of subcategorias) {
      subcategoriaOrdenada.push(
        {
          vazioInicio: "",
          categoria_id: categoria.id,
          categoria_nome: categoria.nome,
          excluirCategoria: "",
          subcategoria_id: subcategoria.id,
          subcategoria_nome: subcategoria.nome,
          excluirsubCategoria: "",
          vazioFim: ""
        }
      );
    };



    try {
      for (const subcategoria of subcategoriaOrdenada) {
        const tr = document.createElement('tr');
        tr.setAttribute('id', `tr-${subcategoria.subcategoria_id}`)
        trClass == 'tr' ? trClass = 'tr-01' : trClass = 'tr';
        tr.classList.add(`${trClass}`);

        for (const propriedade in subcategoria) {
          if (!propriedade.includes('createdAt') && !propriedade.includes('updatedAt')) {
            const td = document.createElement('td');
            td.setAttribute('id', `${propriedade}-${subcategoria.subcategoria_id}`)
            td.classList.add('td-01');
            td.setAttribute('style', 'width: 15%');
            td.textContent = subcategoria[propriedade];
            tr.appendChild(td);

            if (propriedade === 'excluirCategoria') {
              td.classList.add('td-excluir-categoria');
            } else if (propriedade === 'excluirsubCategoria') {
              td.classList.add('td-excluir-subcategoria');
            }
          }
        }

        const botaoExcluirCategoria = document.createElement('button');
        botaoExcluirCategoria.setAttribute('id', 'botao-excluir-categoria');
        botaoExcluirCategoria.classList.add('botao-excluir');
        botaoExcluirCategoria.onclick = () => { main.excluirCategoria(subcategoria.categoria_id) };

        const botaoExcluirSubsubcategoria = document.createElement('button');
        botaoExcluirSubsubcategoria.setAttribute('id', 'botao-excluir-subcategoria');
        botaoExcluirSubsubcategoria.classList.add('botao-excluir');
        botaoExcluirSubsubcategoria.onclick = () => { main.excluirSubcategoria(subcategoria.subcategoria_id) }

        const imgExcluirCategoria = document.createElement('img');
        imgExcluirCategoria.src = '../Assets/Botao-excluir-02.png';

        const imgExcluirSubcategoria = document.createElement('img');
        imgExcluirSubcategoria.src = '../Assets/Botao-excluir-02.png';

        const tdExcluirCategoria = tr.querySelector('.td-excluir-categoria');
        const tdExcluirSubcategoria = tr.querySelector('.td-excluir-subcategoria');

        botaoExcluirCategoria.appendChild(imgExcluirCategoria);
        botaoExcluirSubsubcategoria.appendChild(imgExcluirSubcategoria);

        tdExcluirCategoria.appendChild(botaoExcluirCategoria);
        tdExcluirCategoria.setAttribute('style', 'width: 5%');
        tdExcluirSubcategoria.appendChild(botaoExcluirSubsubcategoria);
        tdExcluirSubcategoria.setAttribute('style', 'width: 5%');

        tabelaSubcategoria.appendChild(tr);

      }
    } catch (error) {
      alert({ message: `${error.message} - Erro ao renderizar categorias` })
    }
    document.createElement('tr');
  },


  async renderizarEditarProduto(produtoId) {
    const formularioProduto = document.getElementById("cadastro-produto");

    const produtos = await api.buscarProdutosSemMudar(' ')
    const produtoEditar = produtos.find(e => e.id === Number(produtoId))

    document.getElementById('id').textContent = `${produtoEditar.id}`
    document.getElementById('categoria').value = `${produtoEditar.categoria_id}`
    await this.listarSubcategoriaNoFormulario()
    document.getElementById('subcategoria').value = `${produtoEditar.subcategoria_id}`
    document.getElementById('fornecedor').value = `${produtoEditar.fornecedor_id}`
    document.getElementById('referencia').value = `${produtoEditar.referencia}`
    document.getElementById('descricao').value = `${produtoEditar.descricao}`
    document.getElementById('medida').value = `${produtoEditar.unidade_medida}`
    document.getElementById('largura').value = `${produtoEditar.largura}`
    document.getElementById('custo').value = `${produtoEditar.custo}`
    document.getElementById('venda').value = `${produtoEditar.venda}`
    
  },

  async renderizarEditarValorProduto(produtoId, produtos) {
    const tabelaProdutos = document.getElementById('tabela-produtos');
    const produtoEditar = produtos.find(e => e.id === Number(produtoId))

    for (const propriedade in produtoEditar) {
      let tdEditar = document.getElementById(`td-${propriedade}-${produtoId}`)
      tdEditar.classList.add('td-01')
      if (propriedade == 'custo' || propriedade == 'venda') {
        tdEditar.innerHTML = null
        var campoInput = document.createElement('input')
        campoInput.classList.add('td-input')
        campoInput.setAttribute('id', `td-input-${propriedade}-${produtoId}`)
        campoInput.setAttribute('size', `5`)
        campoInput.value = produtoEditar[propriedade]
        tdEditar.appendChild(campoInput)
      }
    }

    const trNova = document.createElement('tr')
    trNova.setAttribute('id', `tr-nova-${produtoId}`)

    const botaoCancelaEditar = document.createElement('button');
    botaoCancelaEditar.classList.add('td-botao-cancelar');
    botaoCancelaEditar.textContent = 'Cancelar'
    botaoCancelaEditar.onclick = () => this.removeLinhaEditar(trNova, produtoId);

    const botaoConfirmaEditar = document.createElement('button');
    botaoConfirmaEditar.classList.add('td-botao-confirmar');
    botaoConfirmaEditar.textContent = 'Atualizar'
    botaoConfirmaEditar.onclick = () => {
      this.confirmaEditarValorProduto(produtoId, produtoEditar);
      tabelaProdutos.removeChild(trNova)
    }

    const tdNova = document.createElement('td')
    tdNova.classList.add('td-confirmar')
    tdNova.setAttribute('colspan', '13')
    tdNova.appendChild(botaoConfirmaEditar)
    tdNova.appendChild(botaoCancelaEditar)

    trNova.appendChild(tdNova)
    trNova.classList.add('tr-editar')
    const linhaRef = document.getElementById(`tr-${produtoId}`)
    tabelaProdutos.insertBefore(trNova, linhaRef.nextSibling)
  },

  async confirmaEditarValorProduto(produtoId, produtoEditar) {
    const dadosCusto = document.getElementById(`td-input-custo-${produtoId}`)
    const dadosVenda = document.getElementById(`td-input-venda-${produtoId}`)

    const dadosAtualizar = {
      custo: dadosCusto.value,
      venda: dadosVenda.value
    }

    if (api.atualizarRegistro(dadosAtualizar, produtoId)) {
      for (const propriedade in produtoEditar) {
        let tdEditar = document.getElementById(`td-${propriedade}-${produtoId}`)
        if (propriedade == 'custo') {
          tdEditar.innerHTML = null
          tdEditar.textContent =  new Intl.NumberFormat('pt-Br', { style: 'currency', currency: 'BRL' }).format(Number(dadosCusto.value))
          if (dadosCusto.value != produtoEditar.custo) {
            tdEditar.classList.add('td-01-editada')
          }
        }
        if (propriedade == 'venda') {
          tdEditar.innerHTML = null
          tdEditar.textContent = new Intl.NumberFormat('pt-Br', { style: 'currency', currency: 'BRL' }).format(Number(dadosVenda.value))
          if (dadosVenda.value != produtoEditar.venda) {
            tdEditar.classList.add('td-01-editada')
          }
        }
      }
    }
  },

  async removeLinhaEditar(linha, produtoId) {
    const tabelaProdutos = document.getElementById('tabela-produtos');

    var tdCusto = document.getElementById(`td-custo-${produtoId}`)
    const custoValor = document.getElementById(`td-input-custo-${produtoId}`).value
    tdCusto.innerHTML == null
    tdCusto.textContent = custoValor

    var tdVenda = document.getElementById(`td-venda-${produtoId}`)
    const vendaValor = document.getElementById(`td-input-venda-${produtoId}`).value
    tdVenda.innerHTML == null
    tdVenda.textContent = vendaValor

    tabelaProdutos.removeChild(linha)
  },

  async formularioEditar(produtoId) {
    const formularioEditar = document.getElementById('formulario-editar')
    const produtoEditar = await api.buscarProdutosSemMudar(`?id=${produtoId}`)

    const divTitulo = document.createElement('div')
    divTitulo.textContent = 'Editar Produto'
    divTitulo.classList.add('titulo')

    const divConteudoForm = document.createElement('div')
    divConteudoForm.classList.add('conteudo-form-editar')

    const divId = document.createElement('div')
    divId.classList.add('id-label')
    const produtoIdLabel = document.createElement('label')
    produtoIdLabel.textContent = 'Id: '
    const produtoIdLabelValor = document.createElement('label')
    produtoIdLabelValor.setAttribute('id', 'campoProdutoId')
    divId.appendChild(produtoIdLabel)
    divId.appendChild(produtoIdLabelValor)

    const divCategoria = document.createElement('div')
    divCategoria.classList.add('formulario_conteudo__container_campos')
    const categoriaLabel = document.createElement('label')
    categoriaLabel.textContent = 'Categoria'
    const campoCategoria = document.createElement('select')
    const optionCategoria = document.createElement('option')
    optionCategoria.textContent = 'Escolha uma categoria'
    campoCategoria.setAttribute('id', 'campoCategoria')
    campoCategoria.classList.add('formulario_campos')
    campoCategoria.appendChild(optionCategoria)

    divCategoria.appendChild(categoriaLabel)
    divCategoria.appendChild(campoCategoria)

    const divSubcategoria = document.createElement('div')
    divSubcategoria.classList.add('formulario_conteudo__container_campos')
    const subcategoriaLabel = document.createElement('label')
    subcategoriaLabel.textContent = 'Subcategoria'
    const campoSubcategoria = document.createElement('select')
    const optionSubcategoria = document.createElement('option')
    optionSubcategoria.textContent = 'Escolha uma subcategoria'
    campoSubcategoria.setAttribute('id', 'campoSubcategoria')
    campoSubcategoria.classList.add('formulario_campos')
    campoSubcategoria.appendChild(optionSubcategoria)
    divSubcategoria.appendChild(subcategoriaLabel)
    divSubcategoria.appendChild(campoSubcategoria)

    const divFornecedor = document.createElement('div')
    divFornecedor.classList.add('formulario_conteudo__container_campos')
    const fornecedorLabel = document.createElement('label')
    fornecedorLabel.textContent = 'Fornecedor'
    const campoFornecedor = document.createElement('select')
    const optionFornecedor = document.createElement('option')
    optionFornecedor.textContent = 'Escolha um fornecedor'
    campoFornecedor.setAttribute('id', 'campoFornecedor')
    campoFornecedor.classList.add('formulario_campos')
    campoFornecedor.appendChild(optionFornecedor)
    divFornecedor.appendChild(fornecedorLabel)
    divFornecedor.appendChild(campoFornecedor)

    const divDescricao = document.createElement('div')
    divDescricao.classList.add('formulario_conteudo__container_campos')
    const descricaoLabel = document.createElement('label')
    descricaoLabel.textContent = 'Descrição'
    const campoDescricao = document.createElement('input')
    campoDescricao.setAttribute('id', 'campoDescricao')
    campoDescricao.classList.add('formulario_campos')
    divDescricao.appendChild(descricaoLabel)
    divDescricao.appendChild(campoDescricao)

    const divReferencia = document.createElement('div')
    divReferencia.classList.add('formulario_conteudo__container_campos')
    const referenciaLabel = document.createElement('label')
    referenciaLabel.textContent = 'Referência'
    const campoReferencia = document.createElement('input')
    campoReferencia.setAttribute('id', 'campoReferencia')
    campoReferencia.classList.add('formulario_campos')
    divReferencia.appendChild(referenciaLabel)
    divReferencia.appendChild(campoReferencia)

    const divMedida = document.createElement('div')
    divMedida.classList.add('formulario_conteudo__container_campos')
    const medidaLabel = document.createElement('label')
    medidaLabel.textContent = 'Medida'
    const campoMedida = document.createElement('input')
    campoMedida.setAttribute('id', 'campoMedida')
    campoMedida.classList.add('formulario_campos')
    divMedida.appendChild(medidaLabel)
    divMedida.appendChild(campoMedida)

    const divLargura = document.createElement('div')
    divLargura.classList.add('formulario_conteudo__container_campos')
    const larguraLabel = document.createElement('label')
    larguraLabel.textContent = 'Largura'
    const campoLargura = document.createElement('input')
    campoLargura.setAttribute('id', 'campoLargura')
    campoLargura.classList.add('formulario_campos')
    divLargura.appendChild(larguraLabel)
    divLargura.appendChild(campoLargura)

    const divCusto = document.createElement('div')
    divCusto.classList.add('formulario_conteudo__container_campos')
    const custoLabel = document.createElement('label')
    custoLabel.textContent = 'Custo'
    const campoCusto = document.createElement('input')
    campoCusto.setAttribute('id', 'campoCusto')
    campoCusto.classList.add('formulario_campos')
    divCusto.appendChild(custoLabel)
    divCusto.appendChild(campoCusto)

    const divVenda = document.createElement('div')
    divVenda.classList.add('formulario_conteudo__container_campos')
    const vendaLabel = document.createElement('label')
    vendaLabel.textContent = 'Venda'
    const campoVenda = document.createElement('input')
    campoVenda.setAttribute('id', 'campoVenda')
    campoVenda.classList.add('formulario_campos')
    divVenda.appendChild(vendaLabel)
    divVenda.appendChild(campoVenda)

    const divBotoes = document.createElement('div')
    divBotoes.classList.add('botao')

    const botaoCancelaEditar = document.createElement('button');
    botaoCancelaEditar.classList.add('td-botao-cancelar');
    botaoCancelaEditar.textContent = 'Cancelar'
    botaoCancelaEditar.onclick 

    const botaoConfirmaEditar = document.createElement('button');
    botaoConfirmaEditar.setAttribute('id', 'botao-confirma-editar')
    botaoConfirmaEditar.classList.add('td-botao-confirmar');
    botaoConfirmaEditar.textContent = 'Atualizar'
    botaoConfirmaEditar.onclick = async (event) =>{
      event.preventDefault()
      main.submeterFormularioEditar()
      //formularioEditar.innerHTML = null
    } 

    divBotoes.appendChild(botaoConfirmaEditar)
    divBotoes.appendChild(botaoCancelaEditar)

    divConteudoForm.appendChild(divCategoria)
    divConteudoForm.appendChild(divSubcategoria)
    divConteudoForm.appendChild(divFornecedor)
    divConteudoForm.appendChild(divDescricao)
    divConteudoForm.appendChild(divReferencia)
    divConteudoForm.appendChild(divMedida)
    divConteudoForm.appendChild(divLargura)
    divConteudoForm.appendChild(divCusto)
    divConteudoForm.appendChild(divVenda)

    formularioEditar.appendChild(divTitulo)
    formularioEditar.appendChild(divId)
    formularioEditar.appendChild(divConteudoForm)
    formularioEditar.appendChild(divBotoes)


    await this.listarNoFormulario('campoCategoria', 'buscaCategoria')
    await this.listarNoFormulario('campoFornecedor', 'buscaFornecedor')
    produtoIdLabelValor.textContent = `${produtoEditar[0].id}`
    campoCategoria.value = `${produtoEditar[0].categoria_id}`
    await this.listarSubcategoriaNoFormularioDom('campoCategoria', 'campoSubcategoria')
    campoSubcategoria.value = `${produtoEditar[0].subcategoria_id}`
    campoCategoria.onchange = () => this.listarSubcategoriaNoFormularioDom('campoCategoria', 'campoSubcategoria')
    campoFornecedor.value = `${produtoEditar[0].fornecedor_id}`
    campoDescricao.value = `${produtoEditar[0].descricao}`
    campoReferencia.value = `${produtoEditar[0].referencia}`
    campoMedida.value = `${produtoEditar[0].unidade_medida}`
    campoLargura.value = `${produtoEditar[0].largura}`
    campoCusto.value = `${produtoEditar[0].custo}`
    campoVenda.value = `${produtoEditar[0].venda}`
  }
};


export default ui;
