/* ===================================================================
   "Monte o seu sistema": o painel de exemplo que funciona

   A pessoa escolhe o ramo e os modulos (caixa, agenda, clientes,
   estoque, ordens de servico, metas) e usa um painel de verdade: lanca
   venda, marca horario, baixa estoque, avanca OS. Os modulos dividem o
   mesmo estado -- concluir um horario lanca a venda no caixa, vender um
   produto baixa o estoque, e a meta e a visao geral acompanham tudo.

   Se a pessoa montou a previa de site antes (estilos.js), o sistema ja
   abre com o nome e o ramo dela: e o "site e sistema do SEU negocio".

   Tudo vive so na aba: F5 volta do zero. Os numeros sao ilustrativos.
   Carregado sob demanda pelo setupSistema() do index.html, pelo mesmo
   motivo do estilos.js: quem nao rola ate aqui nao paga nada.
   =================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Os modulos. padrao: quais vem marcados em cada ramo.
     --------------------------------------------------------------- */
  var MODULOS = [
    { id: 'caixa', nome: 'Caixa', desc: 'Entradas, saídas e fechamento do dia em um botão.', ico: 'caixa' },
    { id: 'agenda', nome: 'Agenda', desc: 'Horários por profissional, sem conflito.', ico: 'agenda' },
    { id: 'clientes', nome: 'Clientes', desc: 'Cadastro, histórico e quanto cada um já gastou.', ico: 'clientes' },
    { id: 'estoque', nome: 'Estoque', desc: 'Quantidade na mão e alerta antes de acabar.', ico: 'estoque' },
    { id: 'os', nome: 'Ordens de serviço', desc: 'Do pedido à entrega, cada serviço com status.', ico: 'os' },
    { id: 'metas', nome: 'Metas', desc: 'Meta do mês e quanto falta por dia.', ico: 'metas' }
  ];

  /* ---------------------------------------------------------------
     Dados de exemplo por ramo. itens: [nome, preco, 'servico'|'produto'].
     estoque: [nome, qtd, minimo, unidade]. dias: faturamento dos seis
     dias anteriores (o setimo e hoje, que comeca pelo que ja entrou).
     --------------------------------------------------------------- */
  var RAMOS = {
    barbearia: {
      rotulo: 'Barbearia', padrao: ['caixa', 'agenda', 'clientes', 'metas'],
      itens: [['Corte', 45, 'servico'], ['Barba', 35, 'servico'], ['Corte e barba', 70, 'servico'], ['Sobrancelha', 15, 'servico'], ['Pomada modeladora', 39, 'produto'], ['Óleo para barba', 32, 'produto']],
      profs: ['Rafa', 'Léo'], agenda: 'Agenda', vaga: 'Horário',
      estoque: [['Pomada modeladora', 12, 5, 'un'], ['Óleo para barba', 4, 5, 'un'], ['Lâminas', 3, 4, 'cx'], ['Shampoo', 9, 4, 'un'], ['Toalhas', 30, 20, 'un']],
      despesas: [['Aluguel do espaço', 1800], ['Produtos', 420], ['Energia', 310]],
      mes: 18420, dias: [980, 1120, 860, 1340, 1510, 720], meta: 26000
    },
    salao: {
      rotulo: 'Salão', padrao: ['caixa', 'agenda', 'clientes', 'estoque'],
      itens: [['Corte', 80, 'servico'], ['Escova', 60, 'servico'], ['Coloração', 180, 'servico'], ['Manicure', 50, 'servico'], ['Hidratação', 90, 'servico'], ['Máscara capilar', 69, 'produto']],
      profs: ['Carla', 'Bia'], agenda: 'Agenda', vaga: 'Horário',
      estoque: [['Máscara capilar', 8, 4, 'un'], ['Esmalte vermelho', 3, 5, 'un'], ['Tinta 7.1', 6, 4, 'un'], ['Shampoo profissional', 5, 3, 'un'], ['Acetona', 2, 3, 'un']],
      despesas: [['Aluguel do espaço', 2200], ['Produtos', 780], ['Energia', 390]],
      mes: 24300, dias: [1280, 1460, 990, 1720, 2140, 1650], meta: 34000
    },
    petshop: {
      rotulo: 'Pet shop', padrao: ['caixa', 'agenda', 'clientes', 'estoque'],
      itens: [['Banho', 55, 'servico'], ['Banho e tosa', 90, 'servico'], ['Consulta', 150, 'servico'], ['Leva e traz', 20, 'servico'], ['Ração 15 kg', 189, 'produto'], ['Antipulgas', 64, 'produto']],
      profs: ['Dani', 'Marcos'], agenda: 'Agenda', vaga: 'Horário',
      estoque: [['Ração 15 kg', 6, 4, 'un'], ['Antipulgas', 11, 5, 'un'], ['Shampoo neutro', 3, 4, 'un'], ['Petisco', 20, 10, 'pct'], ['Tapete higiênico', 2, 5, 'pct']],
      despesas: [['Aluguel do espaço', 2600], ['Fornecedor de ração', 1900], ['Energia', 450]],
      mes: 31750, dias: [1540, 1890, 1320, 2050, 2380, 1760], meta: 42000
    },
    clinica: {
      rotulo: 'Clínica', padrao: ['agenda', 'clientes', 'caixa', 'metas'],
      itens: [['Consulta clínica', 180, 'servico'], ['Pediatria', 220, 'servico'], ['Dermatologia', 250, 'servico'], ['Exame', 90, 'servico'], ['Retorno', 60, 'servico']],
      profs: ['Dra. Ana', 'Dr. Paulo'], agenda: 'Agenda', vaga: 'Consulta',
      estoque: [['Luvas', 4, 5, 'cx'], ['Seringas', 60, 40, 'un'], ['Álcool 70%', 3, 4, 'L'], ['Gaze', 25, 20, 'pct'], ['Máscaras', 8, 10, 'cx']],
      despesas: [['Aluguel da sala', 3400], ['Material', 860], ['Energia', 520]],
      mes: 46200, dias: [2340, 2980, 1980, 3120, 2760, 1440], meta: 62000
    },
    restaurante: {
      rotulo: 'Restaurante', padrao: ['caixa', 'estoque', 'agenda', 'metas'],
      itens: [['Prato do dia', 29, 'servico'], ['Executivo', 42, 'servico'], ['Marmita semanal', 129, 'servico'], ['Sobremesa', 12, 'servico'], ['Refrigerante', 7, 'produto'], ['Suco natural', 10, 'servico']],
      profs: ['Salão', 'Varanda'], agenda: 'Reservas', vaga: 'Mesa',
      estoque: [['Arroz 5 kg', 8, 4, 'sc'], ['Feijão 1 kg', 5, 6, 'pct'], ['Óleo 900 ml', 3, 5, 'un'], ['Carne', 14, 10, 'kg'], ['Refrigerante', 48, 24, 'lata']],
      despesas: [['Hortifrúti', 640], ['Gás', 380], ['Aluguel do salão', 3900]],
      mes: 52800, dias: [2410, 2690, 2230, 2880, 3460, 3910], meta: 70000
    },
    mercado: {
      rotulo: 'Mercado', padrao: ['caixa', 'estoque', 'clientes', 'metas'],
      itens: [['Compra no balcão', 86, 'servico'], ['Cesta básica', 189, 'servico'], ['Café 500 g', 18, 'produto'], ['Leite 1 L', 5, 'produto'], ['Arroz 5 kg', 27, 'produto'], ['Taxa de entrega', 8, 'servico']],
      profs: ['Moto 1', 'Moto 2'], agenda: 'Entregas', vaga: 'Entrega',
      estoque: [['Arroz 5 kg', 22, 10, 'sc'], ['Feijão 1 kg', 9, 12, 'pct'], ['Leite 1 L', 30, 24, 'cx'], ['Café 500 g', 6, 8, 'pct'], ['Óleo 900 ml', 14, 10, 'un']],
      despesas: [['Distribuidor', 4200], ['Energia', 980], ['Aluguel', 3500]],
      mes: 88400, dias: [4120, 4560, 3890, 4710, 5620, 6040], meta: 115000
    },
    outro: {
      rotulo: 'Outro ramo', padrao: ['caixa', 'os', 'clientes', 'metas'],
      itens: [['Orçamento aprovado', 350, 'servico'], ['Serviço avulso', 180, 'servico'], ['Manutenção', 240, 'servico'], ['Visita técnica', 90, 'servico'], ['Peça de reposição', 75, 'produto']],
      profs: ['Equipe 1', 'Equipe 2'], agenda: 'Agenda', vaga: 'Visita',
      estoque: [['Peça de reposição', 9, 5, 'un'], ['Material básico', 4, 6, 'kit'], ['Parafusos', 120, 50, 'un'], ['Cabos', 3, 4, 'rolo'], ['Luvas', 10, 6, 'par']],
      despesas: [['Material', 690], ['Combustível', 420], ['Aluguel', 1500]],
      mes: 21900, dias: [980, 1450, 760, 1320, 1680, 540], meta: 30000
    }
  };
  var ORDEM = ['barbearia', 'salao', 'petshop', 'clinica', 'restaurante', 'mercado', 'outro'];
  // a previa de site usa os mesmos ids de ramo
  var CLIENTES = ['Rafael Souza', 'Juliana Lima', 'Carlos Pereira', 'Patrícia Alves', 'Fernanda Rocha', 'Marcos Oliveira', 'Aline Costa', 'Bruno Martins', 'Camila Santos', 'Diego Ferreira'];
  var HORAS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  var FORMAS = ['Pix', 'Cartão', 'Dinheiro'];

  /* ---------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  var fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var fmt2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  function real(v) { return Math.round(v) === v ? fmt.format(v) : fmt2.format(v); }
  function num(s) { var n = parseFloat(String(s).replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : 0; }
  // sorteio com semente: o mesmo ramo sempre abre com os mesmos dados
  function sorteio(semente) {
    var x = 0;
    for (var i = 0; i < semente.length; i++) x = (x * 31 + semente.charCodeAt(i)) >>> 0;
    return function () { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; };
  }
  function iniciais(n) { return String(n).trim().split(/\s+/).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase(); }
  function agora() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  var SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  var ICONES = {
    geral: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    caixa: '<rect x="2.5" y="6" width="19" height="13" rx="2"/><path d="M2.5 10h19M6.5 15h3"/>',
    agenda: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    clientes: '<path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"/><circle cx="9.5" cy="7.5" r="3.5"/><path d="M21 20v-1.5a4 4 0 0 0-3-3.9M15.5 4.1a3.5 3.5 0 0 1 0 6.8"/>',
    estoque: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
    os: '<rect x="5" y="3.5" width="14" height="17.5" rx="2"/><path d="M9 3.5h6v3H9zM8.5 11h7M8.5 15h5"/>',
    metas: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    menos: '<path d="M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    busca: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    alerta: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.2v.3"/>',
    whats: '<path d="M4.5 19.5l1.2-3.6A7.8 7.8 0 1 1 8.4 18.6z"/><path d="M9.3 9.2c.3 2.3 2.2 4.3 4.6 4.8l1-1.2 1.8.9c-.4 1.3-1.5 1.8-2.6 1.6-3-.6-5.4-3-6-6-.2-1.1.3-2.2 1.6-2.6l.9 1.8z" fill="currentColor" stroke="none"/>',
    ajustes: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'
  };
  function ico(n, cls) {
    return '<svg class="sx-i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONES[n] || '') + '</svg>';
  }

  /* ---------------------------------------------------------------
     O estado inicial de um painel: dados de exemplo coerentes com o
     ramo, gerados com semente pra nao mudarem a cada abertura.
     --------------------------------------------------------------- */
  function criarDados(ramoId, nome) {
    var R = RAMOS[ramoId];
    var rnd = sorteio(ramoId);
    var servicos = R.itens.filter(function (i) { return i[2] === 'servico'; });
    var pega = function (arr) { return arr[Math.floor(rnd() * arr.length)]; };
    var vendas = [];
    var id = 1;
    // o que ja entrou hoje de manha
    ['08:15', '08:40', '09:05', '09:25', '09:50', '10:10', '10:45', '11:05', '11:30'].forEach(function (h) {
      var it = pega(R.itens);
      vendas.push({ id: id++, desc: it[0], valor: it[1], forma: pega(FORMAS), tipo: 'entrada', hora: h, item: it[0] });
    });
    vendas.push({ id: id++, desc: R.despesas[1][0], valor: Math.round(R.despesas[1][1] / 4), forma: 'Pix', tipo: 'saida', hora: '10:30' });
    // agenda do dia: mais cheia de manha, com buracos a tarde
    var agenda = {};
    R.profs.forEach(function (p, pi) {
      HORAS.forEach(function (h, hi) {
        var cheio = hi < 4 ? rnd() < .75 : rnd() < .45;
        if (cheio) {
          agenda[pi + '|' + h] = { cliente: pega(CLIENTES), servico: pega(servicos)[0], status: hi < 3 ? 'feito' : 'marcado' };
        }
      });
    });
    var clientes = CLIENTES.map(function (n, i) {
      return { nome: n, fone: '(61) 9' + (8100 + Math.floor(rnd() * 1800)) + '-' + (1000 + Math.floor(rnd() * 8999)), visitas: 2 + Math.floor(rnd() * 22), gasto: 0, ultimo: pega(servicos)[0], dias: Math.floor(rnd() * 40), aniver: i === 3 };
    });
    clientes.forEach(function (c) { c.gasto = c.visitas * (servicos[0][1] + Math.round(rnd() * 30)); });
    var os = [
      { id: 101, cliente: CLIENTES[2], desc: servicos[0][0], valor: servicos[0][1] * 2, status: 0 },
      { id: 102, cliente: CLIENTES[5], desc: (servicos[2] || servicos[0])[0], valor: (servicos[2] || servicos[0])[1], status: 1 },
      { id: 103, cliente: CLIENTES[1], desc: (servicos[1] || servicos[0])[0], valor: (servicos[1] || servicos[0])[1], status: 1 },
      { id: 104, cliente: CLIENTES[7], desc: (servicos[3] || servicos[0])[0], valor: (servicos[3] || servicos[0])[1] * 3, status: 2 }
    ];
    return {
      ramo: ramoId, R: R, nome: nome || R.rotulo,
      vendas: vendas, prox: id, agenda: agenda, clientes: clientes,
      estoque: R.estoque.map(function (e) { return { nome: e[0], qtd: e[1], min: e[2], un: e[3] }; }),
      os: os, proxOs: 105, meta: R.meta, fechado: false,
      usos: {}
    };
  }

  function somaHoje(d, tipo) {
    return d.vendas.filter(function (v) { return v.tipo === tipo; }).reduce(function (a, v) { return a + v.valor; }, 0);
  }
  function faturamentoMes(d) { return d.R.mes + somaHoje(d, 'entrada'); }
  function alertas(d) { return d.estoque.filter(function (e) { return e.qtd <= e.min; }).length; }

  /* ===============================================================
     O CONFIGURADOR
     =============================================================== */
  function montar(raiz, opts) {
    if (!raiz || raiz.__sistema) return raiz && raiz.__sistema;
    opts = opts || {};
    var fone = opts.whatsapp || '5561994299823';
    var st = { etapa: 'ramo', ramo: null, nome: '', mods: [], tela: 'geral', d: null, vemDaPrevia: false, sel: null, cli: null, busca: '' };

    raiz.classList.add('sx');
    raiz.innerHTML =
      '<div class="sx-janela">' +
        '<div class="sx-barra"><span class="sx-bolinhas"><i></i><i></i><i></i></span><span class="sx-url" data-url>painel.suaempresa.com.br</span></div>' +
        '<div class="sx-corpo" data-corpo></div>' +
        '<div class="sx-aviso" data-aviso role="status"></div>' +
      '</div>' +
      '<div class="sx-acoes" data-acoes>' +
        '<p data-acoes-txt></p>' +
        '<div class="sx-acoes-bts"><button type="button" class="btn btn-secondary btn-sm" data-refazer>' + ico('ajustes') + 'Trocar módulos</button>' +
        '<a class="btn btn-primary btn-sm" data-quero data-sem-portao target="_blank" rel="noopener">' + ico('whats') + 'Quero um sistema assim</a></div>' +
      '</div>' +
      '<p class="sx-sr" aria-live="polite" data-fala></p>';

    var $ = function (s) { return raiz.querySelector(s); };
    var corpo = $('[data-corpo]');
    var tiraAviso;

    // se a pessoa montou a previa de site, o sistema ja sabe quem ela e
    function lerPrevia() {
      var p = window.ACTechPrevia;
      if (p && p.nome && RAMOS[p.ramo]) {
        st.nome = p.nome; st.ramo = p.ramo; st.vemDaPrevia = true;
        return true;
      }
      return false;
    }
    lerPrevia();
    function naPrevia(e) {
      if (st.etapa === 'painel' || st.etapa === 'montando') return;
      if (lerPrevia()) { st.mods = RAMOS[st.ramo].padrao.slice(); desenhar(); }
    }
    document.addEventListener('actech:previa', naPrevia);

    /* ---- etapas do configurador ---- */
    function telaRamo() {
      return '<div class="sx-cfg"><div class="sx-cfg-cartao">' +
        '<span class="sx-passo">Passo 1 de 2</span>' +
        '<h3>Pra que tipo de negócio?</h3>' +
        '<p>O painel abre com dados de exemplo que fazem sentido pro seu ramo.</p>' +
        '<div class="sx-chips" role="radiogroup" aria-label="Ramo">' +
          ORDEM.map(function (id) {
            var on = st.ramo === id;
            return '<button type="button" role="radio" aria-checked="' + on + '" class="sx-chip' + (on ? ' is-on' : '') + '" data-ramo="' + id + '">' + RAMOS[id].rotulo + '</button>';
          }).join('') +
        '</div>' +
        '<label class="sx-campo"><span>Nome do negócio <small>(opcional)</small></span><input data-nome maxlength="30" placeholder="Ex.: Barbearia do Zé" value="' + esc(st.nome) + '" /></label>' +
        '<button type="button" class="sx-cta" data-ir-modulos' + (st.ramo ? '' : ' disabled') + '>Escolher os módulos' + ico('seta') + '</button>' +
      '</div></div>';
    }
    function telaModulos() {
      return '<div class="sx-cfg"><div class="sx-cfg-cartao sx-cfg-cartao--larga">' +
        '<div class="sx-passo-linha"><span class="sx-passo">Passo 2 de 2</span><button type="button" class="sx-link" data-voltar>Voltar</button></div>' +
        '<h3>O que o seu sistema precisa ter?</h3>' +
        '<p>Já deixamos marcado o mais comum pra ' + esc(RAMOS[st.ramo].rotulo.toLowerCase()) + '. A visão geral vem sempre.</p>' +
        '<div class="sx-mods">' +
          MODULOS.map(function (m) {
            var on = st.mods.indexOf(m.id) > -1;
            var nomeMod = m.id === 'agenda' ? RAMOS[st.ramo].agenda : m.nome;
            return '<button type="button" role="checkbox" aria-checked="' + on + '" class="sx-mod' + (on ? ' is-on' : '') + '" data-mod="' + m.id + '">' +
              '<span class="sx-mod-ico">' + ico(m.ico) + '</span><span class="sx-mod-txt"><b>' + nomeMod + '</b><small>' + m.desc + '</small></span>' +
              '<span class="sx-mod-marca">' + ico('check') + '</span></button>';
          }).join('') +
        '</div>' +
        '<button type="button" class="sx-cta" data-montar' + (st.mods.length ? '' : ' disabled') + '>Montar o meu sistema' + ico('seta') + '</button>' +
      '</div></div>';
    }
    function telaMontando() {
      var nomes = st.mods.map(function (id) { return id === 'agenda' ? RAMOS[st.ramo].agenda : achaMod(id).nome; });
      return '<div class="sx-cfg"><div class="sx-cfg-cartao sx-montando" role="status"><b>Montando o sistema' + (st.nome ? ' da ' + esc(st.nome) : '') + '…</b><ul>' +
        ['Visão geral'].concat(nomes).map(function (n, i) { return '<li style="animation-delay:' + (i * 180) + 'ms">' + ico('check') + n + '</li>'; }).join('') +
        '</ul></div></div>';
    }
    function achaMod(id) { for (var i = 0; i < MODULOS.length; i++) if (MODULOS[i].id === id) return MODULOS[i]; }

    /* ===============================================================
       O PAINEL
       =============================================================== */
    function telaPainel() {
      var d = st.d;
      var itens = [{ id: 'geral', nome: 'Visão geral', ico: 'geral' }].concat(st.mods.map(function (id) {
        var m = achaMod(id);
        return { id: id, nome: id === 'agenda' ? d.R.agenda : m.nome, ico: m.ico };
      }));
      var hoje = new Date();
      return '<div class="sx-app">' +
        '<nav class="sx-lado" aria-label="Módulos do sistema"><b class="sx-marca"><i>' + esc(iniciais(d.nome)) + '</i><span>' + esc(d.nome) + '</span></b>' +
          itens.map(function (it) {
            var badge = it.id === 'estoque' && alertas(d) ? '<em>' + alertas(d) + '</em>' : '';
            return '<button type="button" class="sx-nav' + (st.tela === it.id ? ' is-on' : '') + '" data-tela="' + it.id + '"' + (st.tela === it.id ? ' aria-current="page"' : '') + '>' + ico(it.ico) + '<span>' + it.nome + '</span>' + badge + '</button>';
          }).join('') +
        '</nav>' +
        '<div class="sx-main"><header class="sx-topo"><div><h3>' + tituloTela() + '</h3><small>' + SEMANA[hoje.getDay()] + ', ' + hoje.getDate() + ' de ' + MESES[hoje.getMonth()] + '</small></div>' +
          '<span class="sx-user"><i>VC</i></span></header>' +
          '<div class="sx-tela" data-tela-corpo>' + corpoTela() + '</div></div>' +
      '</div>';
    }
    function tituloTela() {
      if (st.tela === 'geral') return 'Visão geral';
      if (st.tela === 'agenda') return st.d.R.agenda + ' de hoje';
      return achaMod(st.tela).nome;
    }
    function corpoTela() {
      return ({ geral: tGeral, caixa: tCaixa, agenda: tAgenda, clientes: tClientes, estoque: tEstoque, os: tOs, metas: tMetas })[st.tela]();
    }

    /* ---- visao geral ---- */
    function tGeral() {
      var d = st.d;
      var ent = somaHoje(d, 'entrada');
      var nEnt = d.vendas.filter(function (v) { return v.tipo === 'entrada'; }).length;
      var kpis = [
        ['Faturamento do mês', real(faturamentoMes(d)), 1],
        ['Entrou hoje', real(ent), 8],
        ['Ticket médio', real(nEnt ? Math.round(ent / nEnt) : 0), 5]
      ];
      if (st.mods.indexOf('agenda') > -1) {
        var total = Object.keys(d.agenda).length, feitos = 0;
        for (var k in d.agenda) if (d.agenda[k].status === 'feito') feitos++;
        kpis.push([d.R.agenda + ' hoje', feitos + ' de ' + total, 3]);
      } else if (st.mods.indexOf('estoque') > -1) kpis.push(['Itens acabando', String(alertas(d)), alertas(d) ? 7 : 3]);
      else if (st.mods.indexOf('os') > -1) kpis.push(['OS em aberto', String(d.os.filter(function (o) { return o.status < 3; }).length), 3]);
      else if (st.mods.indexOf('metas') > -1) kpis.push(['Da meta do mês', Math.round(faturamentoMes(d) / d.meta * 100) + '%', 3]);
      else kpis.push(['Clientes ativos', String(d.clientes.length), 3]);

      var dias = d.R.dias.concat([ent]);
      var max = Math.max.apply(null, dias) * 1.15;
      var hoje = new Date().getDay();
      var barras = dias.map(function (v, i) {
        var dia = SEMANA[(hoje - 6 + i + 7) % 7];
        return '<div class="sx-barra-col' + (i === 6 ? ' is-hoje' : '') + '"><span class="sx-barra-val">' + real(v) + '</span>' +
          '<i style="height:' + Math.max(3, v / max * 100) + '%"></i><small>' + (i === 6 ? 'Hoje' : dia) + '</small></div>';
      }).join('');
      var ult = d.vendas.slice(-5).reverse();
      return '<div class="sx-kpis">' + kpis.map(function (k) {
          return '<div class="sx-kpi" style="--kc:var(--t' + k[2] + ');--kf:var(--f' + k[2] + ')"><small>' + k[0] + '</small><b>' + k[1] + '</b></div>';
        }).join('') + '</div>' +
        '<div class="sx-duas"><section class="sx-caixa-ui"><h4>Últimos 7 dias</h4><div class="sx-grafico" role="img" aria-label="Faturamento dos últimos sete dias">' + barras + '</div></section>' +
        '<section class="sx-caixa-ui"><h4>Movimento de hoje</h4><ul class="sx-feed">' +
          ult.map(function (v) {
            return '<li><span class="sx-feed-ico sx-feed-ico--' + v.tipo + '">' + ico(v.tipo === 'entrada' ? 'mais' : 'menos') + '</span><span><b>' + esc(v.desc) + '</b><small>' + v.hora + (v.forma ? ' · ' + v.forma : '') + '</small></span><em class="sx-' + v.tipo + '">' + (v.tipo === 'entrada' ? '+ ' : '− ') + real(v.valor) + '</em></li>';
          }).join('') +
        '</ul>' + (st.mods.indexOf('caixa') > -1 ? '<button type="button" class="sx-link" data-tela="caixa">Abrir o caixa ' + ico('seta') + '</button>' : '') + '</section></div>';
    }

    /* ---- caixa ---- */
    function tCaixa() {
      var d = st.d;
      var ent = somaHoje(d, 'entrada'), sai = somaHoje(d, 'saida');
      var opcoes = d.R.itens.map(function (it, i) { return '<option value="i' + i + '">' + esc(it[0]) + ' · ' + real(it[1]) + '</option>'; }).join('');
      var despesas = d.R.despesas.map(function (it, i) { return '<option value="d' + i + '">' + esc(it[0]) + '</option>'; }).join('');
      if (d.fechado) return fechamento();
      return '<div class="sx-kpis sx-kpis--3">' +
          '<div class="sx-kpi" style="--kc:var(--t3);--kf:var(--f3)"><small>Entradas de hoje</small><b>' + real(ent) + '</b></div>' +
          '<div class="sx-kpi" style="--kc:var(--t7);--kf:var(--f7)"><small>Saídas de hoje</small><b>' + real(sai) + '</b></div>' +
          '<div class="sx-kpi" style="--kc:var(--t1);--kf:var(--f1)"><small>Saldo do dia</small><b>' + real(ent - sai) + '</b></div></div>' +
        '<form class="sx-form sx-caixa-ui" data-form="venda">' +
          '<div class="sx-tipo" role="radiogroup" aria-label="Tipo de lançamento"><button type="button" role="radio" aria-checked="true" class="is-on" data-tipo="entrada">Entrada</button><button type="button" role="radio" aria-checked="false" data-tipo="saida">Saída</button></div>' +
          '<label class="sx-campo sx-campo--item"><span>O que foi</span><select name="produto" data-item>' + opcoes + '</select><select name="despesa" data-despesa hidden>' + despesas + '</select></label>' +
          '<label class="sx-campo sx-campo--valor"><span>Valor (R$)</span><input name="valor" inputmode="decimal" value="' + d.R.itens[0][1] + '" /></label>' +
          '<div class="sx-campo sx-campo--forma"><span>Forma</span><div class="sx-formas" role="radiogroup" aria-label="Forma de pagamento">' +
            FORMAS.map(function (f, i) { return '<button type="button" role="radio" aria-checked="' + (i === 0) + '" class="' + (i === 0 ? 'is-on' : '') + '" data-forma="' + f + '">' + f + '</button>'; }).join('') + '</div></div>' +
          '<button type="submit" class="sx-cta sx-cta--sm">' + ico('mais') + 'Lançar</button>' +
        '</form>' +
        '<section class="sx-caixa-ui"><div class="sx-cab-linha"><h4>Extrato de hoje</h4><button type="button" class="sx-fechar" data-fechar-dia>Fechar o dia</button></div>' +
          '<div class="sx-tabela" role="table">' +
            '<div class="sx-tr sx-th" role="row"><span role="columnheader">Hora</span><span role="columnheader">Descrição</span><span role="columnheader">Forma</span><span role="columnheader">Valor</span></div>' +
            d.vendas.slice().reverse().map(function (v) {
              return '<div class="sx-tr' + (v.id === st.novo ? ' is-novo' : '') + '" role="row"><span role="cell">' + v.hora + '</span><span role="cell">' + esc(v.desc) + '</span><span role="cell">' + (v.forma || '—') + '</span><span role="cell" class="sx-' + v.tipo + '">' + (v.tipo === 'entrada' ? '+ ' : '− ') + real(v.valor) + '</span></div>';
            }).join('') +
          '</div></section>';
    }
    function fechamento() {
      var d = st.d;
      var ent = somaHoje(d, 'entrada'), sai = somaHoje(d, 'saida');
      var porForma = FORMAS.map(function (f) {
        var s = d.vendas.filter(function (v) { return v.tipo === 'entrada' && v.forma === f; }).reduce(function (a, v) { return a + v.valor; }, 0);
        return '<li><span>' + f + '</span><b>' + real(s) + '</b></li>';
      }).join('');
      return '<div class="sx-fecha sx-caixa-ui"><span class="sx-fecha-selo">' + ico('check') + 'Dia fechado às ' + agora() + '</span>' +
        '<h4>Resumo do dia</h4><ul class="sx-fecha-lista">' + porForma +
        '<li class="sx-fecha-sep"><span>Saídas</span><b class="sx-saida">− ' + real(sai) + '</b></li>' +
        '<li class="sx-fecha-total"><span>Saldo</span><b>' + real(ent - sai) + '</b></li></ul>' +
        '<p>No sistema de verdade esse resumo sai em PDF ou vai pro seu WhatsApp todo dia, sozinho.</p>' +
        '<button type="button" class="sx-link" data-reabrir>Reabrir o caixa</button></div>';
    }

    /* ---- agenda ---- */
    function tAgenda() {
      var d = st.d;
      var cols = d.R.profs.map(function (p, pi) {
        return '<div class="sx-ag-col"><b class="sx-ag-prof">' + esc(p) + '</b>' + HORAS.map(function (h) {
          var k = pi + '|' + h, a = d.agenda[k], sel = st.sel === k;
          if (!a) return '<button type="button" class="sx-slot sx-slot--livre' + (sel ? ' is-sel' : '') + '" data-slot="' + k + '"><span>' + h + '</span><small>Livre</small></button>';
          return '<button type="button" class="sx-slot sx-slot--' + a.status + (sel ? ' is-sel' : '') + (k === st.novoSlot ? ' is-novo' : '') + '" data-slot="' + k + '"><span>' + h + '</span><b>' + esc(a.cliente.split(' ')[0]) + '</b><small>' + esc(a.servico) + '</small>' + (a.status === 'feito' ? ico('check', 'sx-slot-ok') : '') + '</button>';
        }).join('') + '</div>';
      }).join('');
      return '<div class="sx-ag"><div class="sx-ag-grade">' + cols + '</div><aside class="sx-ag-lado sx-caixa-ui">' + painelSlot() + '</aside></div>';
    }
    function painelSlot() {
      var d = st.d;
      if (!st.sel) return '<p class="sx-vazio">' + ico('agenda') + 'Clique num horário livre pra marcar, ou num marcado pra concluir.</p>';
      var p = st.sel.split('|'), prof = d.R.profs[p[0]], a = d.agenda[st.sel];
      var titulo = '<small>' + esc(prof) + ' · ' + p[1] + '</small>';
      if (!a) {
        var servs = d.R.itens.filter(function (i) { return i[2] === 'servico'; });
        return titulo + '<h4>Marcar ' + d.R.vaga.toLowerCase() + '</h4><form class="sx-form sx-form--col" data-form="marcar">' +
          '<label class="sx-campo"><span>Cliente</span><input name="cliente" list="sx-lista-cli" placeholder="Nome do cliente" required /></label>' +
          '<datalist id="sx-lista-cli">' + d.clientes.map(function (c) { return '<option value="' + esc(c.nome) + '">'; }).join('') + '</datalist>' +
          '<label class="sx-campo"><span>Serviço</span><select name="servico">' + servs.map(function (s) { return '<option>' + esc(s[0]) + '</option>'; }).join('') + '</select></label>' +
          '<button type="submit" class="sx-cta sx-cta--sm">' + ico('check') + 'Marcar</button></form>';
      }
      var preco = (d.R.itens.filter(function (i) { return i[0] === a.servico; })[0] || [0, 0])[1];
      return titulo + '<h4>' + esc(a.cliente) + '</h4><p class="sx-ag-serv">' + esc(a.servico) + ' · ' + real(preco) + '</p>' +
        (a.status === 'feito'
          ? '<p class="sx-ok">' + ico('check') + 'Concluído e lançado no caixa.</p>'
          : '<div class="sx-ag-bts"><button type="button" class="sx-cta sx-cta--sm" data-concluir>' + ico('check') + 'Concluir e cobrar</button><button type="button" class="sx-link sx-link--perigo" data-desmarcar>Desmarcar</button></div>' +
            '<p class="sx-dica">Concluir lança ' + real(preco) + ' no caixa na hora.</p>');
    }

    /* ---- clientes ---- */
    function tClientes() {
      var d = st.d;
      var q = st.busca.trim().toLowerCase();
      var lista = d.clientes.filter(function (c) { return !q || c.nome.toLowerCase().indexOf(q) > -1 || c.fone.indexOf(q) > -1; });
      var c = st.cli != null ? d.clientes[st.cli] : null;
      return '<div class="sx-cli"><div class="sx-caixa-ui"><div class="sx-busca">' + ico('busca') + '<input data-busca placeholder="Buscar por nome ou telefone" value="' + esc(st.busca) + '" aria-label="Buscar cliente" /></div>' +
          '<ul class="sx-cli-lista">' + (lista.length ? lista.map(function (c2) {
            var i = d.clientes.indexOf(c2);
            return '<li><button type="button" class="' + (i === st.cli ? 'is-on' : '') + (i === st.novoCli ? ' is-novo' : '') + '" data-cli="' + i + '"><i>' + iniciais(c2.nome) + '</i><span><b>' + esc(c2.nome) + '</b><small>' + c2.visitas + ' visitas · ' + (c2.dias ? 'há ' + c2.dias + ' dias' : 'hoje') + '</small></span>' + (c2.aniver ? '<em>Aniversário</em>' : '') + '</button></li>';
          }).join('') : '<li class="sx-vazio">Ninguém com esse nome. Cadastre ao lado.</li>') + '</ul></div>' +
        '<aside class="sx-caixa-ui">' + (c
          ? '<div class="sx-cli-ficha"><i>' + iniciais(c.nome) + '</i><h4>' + esc(c.nome) + '</h4><small>' + c.fone + '</small>' +
            '<dl><div><dt>Visitas</dt><dd>' + c.visitas + '</dd></div><div><dt>Já gastou</dt><dd>' + real(c.gasto) + '</dd></div><div><dt>Último</dt><dd>' + esc(c.ultimo) + '</dd></div></dl>' +
            (c.aniver ? '<p class="sx-dica">🎂 Faz aniversário essa semana. O sistema manda o parabéns com um cupom.</p>' : '<p class="sx-dica">Faz ' + c.dias + ' dias da última visita.' + (c.dias > 25 ? ' Bom momento pra chamar de volta.' : '') + '</p>') +
            '<button type="button" class="sx-link" data-cli-fechar>Fechar ficha</button></div>'
          : '<h4>Novo cliente</h4><form class="sx-form sx-form--col" data-form="cliente"><label class="sx-campo"><span>Nome</span><input name="nome" required maxlength="40" /></label>' +
            '<label class="sx-campo"><span>WhatsApp</span><input name="fone" inputmode="tel" placeholder="(61) 9…" /></label><button type="submit" class="sx-cta sx-cta--sm">' + ico('mais') + 'Cadastrar</button></form>') +
        '</aside></div>';
    }

    /* ---- estoque ---- */
    function tEstoque() {
      var d = st.d;
      return '<div class="sx-caixa-ui"><div class="sx-cab-linha"><h4>Produtos</h4>' + (alertas(d) ? '<span class="sx-alerta">' + ico('alerta') + alertas(d) + ' acabando</span>' : '<span class="sx-ok">' + ico('check') + 'Tudo em dia</span>') + '</div>' +
        '<div class="sx-est">' + d.estoque.map(function (e, i) {
          var baixo = e.qtd <= e.min;
          var pct = Math.min(100, e.qtd / (e.min * 3) * 100);
          return '<div class="sx-est-linha' + (baixo ? ' is-baixo' : '') + (i === st.novoEst ? ' is-novo' : '') + '"><span class="sx-est-nome"><b>' + esc(e.nome) + '</b><small>mínimo ' + e.min + ' ' + e.un + '</small></span>' +
            '<span class="sx-est-barra"><i style="width:' + pct + '%"></i></span>' +
            '<span class="sx-est-qtd"><button type="button" data-est="' + i + '" data-d="-1" aria-label="Tirar 1 de ' + esc(e.nome) + '">' + ico('menos') + '</button><b>' + e.qtd + '</b><button type="button" data-est="' + i + '" data-d="1" aria-label="Pôr 1 de ' + esc(e.nome) + '">' + ico('mais') + '</button></span>' +
            (baixo ? '<button type="button" class="sx-repor" data-repor="' + i + '">Repor</button>' : '<span class="sx-repor sx-repor--ok">OK</span>') + '</div>';
        }).join('') + '</div>' +
        (st.mods.indexOf('caixa') > -1 ? '<p class="sx-dica">Venda de produto no caixa já baixa o estoque sozinha.</p>' : '') + '</div>';
    }

    /* ---- ordens de servico ---- */
    var ETAPAS_OS = ['Aberta', 'Em andamento', 'Pronta'];
    function tOs() {
      var d = st.d;
      return '<div class="sx-kanban">' + ETAPAS_OS.map(function (nome, s) {
        var cards = d.os.filter(function (o) { return o.status === s; });
        return '<section class="sx-kb-col sx-kb-col--' + s + '"><h4>' + nome + ' <em>' + cards.length + '</em></h4>' +
          cards.map(function (o) {
            return '<article class="sx-kb-card' + (o.id === st.novoOs ? ' is-novo' : '') + '"><small>OS ' + o.id + '</small><b>' + esc(o.desc) + '</b><span>' + esc(o.cliente) + ' · ' + real(o.valor) + '</span>' +
              '<button type="button" class="sx-link" data-os="' + o.id + '">' + (s < 2 ? 'Avançar ' + ico('seta') : ico('check') + ' Entregar e cobrar') + '</button></article>';
          }).join('') +
          (s === 0 ? '<form class="sx-kb-nova" data-form="os"><input name="desc" placeholder="+ Nova OS" aria-label="Descrição da nova ordem de serviço" maxlength="40" /></form>' : '') +
        '</section>';
      }).join('') + '</div>';
    }

    /* ---- metas ---- */
    function tMetas() {
      var d = st.d;
      var fat = faturamentoMes(d), pct = Math.min(1, fat / d.meta);
      var hoje = new Date(), fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
      var uteis = 0;
      for (var dia = hoje.getDate(); dia <= fim; dia++) if (new Date(hoje.getFullYear(), hoje.getMonth(), dia).getDay() !== 0) uteis++;
      var falta = Math.max(0, d.meta - fat);
      var R = 70, C = 2 * Math.PI * R;
      return '<div class="sx-meta sx-caixa-ui"><div class="sx-anel"><svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="' + R + '" class="sx-anel-fundo"/>' +
          '<circle cx="90" cy="90" r="' + R + '" class="sx-anel-cor" style="stroke-dasharray:' + C + ';stroke-dashoffset:' + (C * (1 - pct)) + '"/></svg>' +
          '<span><b>' + Math.round(pct * 100) + '%</b><small>da meta</small></span></div>' +
        '<div class="sx-meta-txt"><dl><div><dt>Faturado no mês</dt><dd>' + real(fat) + '</dd></div><div><dt>Falta</dt><dd>' + real(falta) + '</dd></div>' +
          '<div><dt>Dias úteis restantes</dt><dd>' + uteis + '</dd></div><div><dt>Precisa por dia</dt><dd>' + real(uteis ? Math.ceil(falta / uteis) : falta) + '</dd></div></dl>' +
          '<form class="sx-form sx-meta-form" data-form="meta"><label class="sx-campo"><span>Meta do mês (R$)</span><input name="meta" inputmode="numeric" value="' + d.meta + '" /></label><button type="submit" class="sx-cta sx-cta--sm">Salvar meta</button></form>' +
          (falta === 0 ? '<p class="sx-ok">' + ico('check') + 'Meta batida! O sistema avisa a equipe na hora.</p>' : '<p class="sx-dica">Cada venda lançada no caixa já entra aqui.</p>') +
        '</div></div>';
    }

    /* ===============================================================
       Desenho e acoes
       =============================================================== */
    function desenhar() {
      if (st.etapa === 'ramo') corpo.innerHTML = telaRamo();
      else if (st.etapa === 'modulos') corpo.innerHTML = telaModulos();
      else if (st.etapa === 'montando') corpo.innerHTML = telaMontando();
      else corpo.innerHTML = telaPainel();
      $('[data-url]').textContent = st.etapa === 'painel' ? 'painel.' + slug(st.d.nome) + '.com.br' : 'painel.suaempresa.com.br';
      var acoes = $('[data-acoes]');
      acoes.classList.toggle('is-on', st.etapa === 'painel');
      if (st.etapa === 'painel') atualizaWhats();
      st.novo = st.novoSlot = st.novoCli = st.novoEst = st.novoOs = null;
    }
    // redesenha so a tela do modulo (e o menu, que tem o selo do estoque)
    // Trava de reentrada: trocar o innerHTML tira o foco do campo, o blur
    // dispara "change", e o change pedia outro redesenho no meio deste.
    var redesenhando = false;
    function redesenharTela() {
      if (redesenhando) return;
      var alvo = corpo.querySelector('[data-tela-corpo]');
      if (!alvo) return desenhar();
      redesenhando = true;
      var foco = document.activeElement && document.activeElement.name;
      corpo.innerHTML = telaPainel();
      atualizaWhats();
      if (foco) { var el = corpo.querySelector('[name="' + foco + '"]'); if (el) el.focus(); }
      st.novo = st.novoSlot = st.novoCli = st.novoEst = st.novoOs = null;
      redesenhando = false;
    }
    function slug(s) { return (String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'suaempresa').slice(0, 24); }

    function atualizaWhats() {
      var d = st.d;
      var nomes = st.mods.map(function (id) { return id === 'agenda' ? d.R.agenda : achaMod(id).nome; });
      var mais = null, n = 0;
      for (var k in d.usos) if (d.usos[k] > n) { n = d.usos[k]; mais = k; }
      var maisNome = mais ? (mais === 'agenda' ? d.R.agenda : mais === 'geral' ? 'Visão geral' : achaMod(mais).nome) : '';
      $('[data-acoes-txt]').innerHTML = 'Esse é o painel ' + (st.nome ? 'da <b>' + esc(st.nome) + '</b>' : 'de <b>' + esc(d.R.rotulo.toLowerCase()) + '</b>') + ' com <b>' + nomes.length + ' módulos</b>. O de verdade vem com os seus números e o seu jeito de trabalhar.';
      var msg = 'Olá! Testei o sistema na página da ACTech.\n\n' +
        (st.nome ? 'Negócio: ' + st.nome + '\n' : '') + 'Ramo: ' + d.R.rotulo + '\nMódulos: ' + nomes.join(', ') +
        (maisNome ? '\nO que mais usei: ' + maisNome : '') + '\n\nQuero um sistema assim!';
      $('[data-quero]').href = 'https://wa.me/' + fone + '?text=' + encodeURIComponent(msg);
    }
    function usou(m) { st.d.usos[m] = (st.d.usos[m] || 0) + 1; }
    function aviso(txt) {
      var a = $('[data-aviso]');
      a.textContent = txt; a.classList.add('is-on');
      clearTimeout(tiraAviso);
      tiraAviso = setTimeout(function () { a.classList.remove('is-on'); }, 2800);
    }
    function fala(t) { $('[data-fala]').textContent = t; }

    function lancar(desc, valor, forma, tipo, item) {
      var d = st.d;
      var v = { id: d.prox++, desc: desc, valor: valor, forma: forma, tipo: tipo, hora: agora(), item: item };
      d.vendas.push(v);
      st.novo = v.id;
      // venda de produto baixa o estoque
      if (tipo === 'entrada' && item && st.mods.indexOf('estoque') > -1) {
        d.estoque.forEach(function (e) { if (e.nome === item && e.qtd > 0) { e.qtd--; if (e.qtd <= e.min) aviso(e.nome + ' está acabando: ' + e.qtd + ' ' + e.un + ' no estoque.'); } });
      }
      return v;
    }

    function noClique(ev) {
      var t = ev.target, b;
      if ((b = t.closest('[data-ramo]'))) {
        st.ramo = b.dataset.ramo; st.mods = RAMOS[st.ramo].padrao.slice();
        var nomeIn = corpo.querySelector('[data-nome]'); if (nomeIn) st.nome = nomeIn.value.trim();
        desenhar(); var c = corpo.querySelector('[data-ir-modulos]'); if (c) c.focus();
        return;
      }
      if (t.closest('[data-ir-modulos]')) {
        var n = corpo.querySelector('[data-nome]'); st.nome = n ? n.value.trim() : st.nome;
        if (!st.mods.length) st.mods = RAMOS[st.ramo].padrao.slice();
        st.etapa = 'modulos'; desenhar(); return;
      }
      if (t.closest('[data-voltar]')) { st.etapa = 'ramo'; desenhar(); return; }
      if ((b = t.closest('[data-mod]'))) {
        var id = b.dataset.mod, i = st.mods.indexOf(id);
        if (i > -1) st.mods.splice(i, 1); else st.mods.push(id);
        // mantem a ordem da lista, que e a ordem do menu
        st.mods = MODULOS.map(function (m) { return m.id; }).filter(function (m) { return st.mods.indexOf(m) > -1; });
        desenhar(); var f = corpo.querySelector('[data-mod="' + id + '"]'); if (f) f.focus();
        return;
      }
      if (t.closest('[data-montar]')) {
        st.etapa = 'montando'; desenhar();
        setTimeout(function () {
          st.d = criarDados(st.ramo, st.nome);
          st.etapa = 'painel'; st.tela = 'geral'; st.sel = null; st.cli = null; st.busca = '';
          desenhar();
          fala('Sistema montado com ' + st.mods.length + ' módulos.');
        }, reduzido() ? 200 : 350 + st.mods.length * 180);
        return;
      }
      if (t.closest('[data-refazer]')) {
        st.etapa = 'modulos'; desenhar();
        raiz.querySelector('.sx-janela').scrollIntoView({ block: 'center', behavior: reduzido() ? 'auto' : 'smooth' });
        return;
      }
      if (!st.d) return;
      var d = st.d;
      if ((b = t.closest('[data-tela]'))) {
        st.tela = b.dataset.tela; st.sel = null; usou(st.tela); redesenharTela();
        var tela = corpo.querySelector('.sx-tela'); if (tela) tela.scrollTop = 0;
        fala(tituloTela() + '.'); return;
      }
      if ((b = t.closest('[data-tipo]'))) {
        var form = b.closest('form');
        form.querySelectorAll('[data-tipo]').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', x === b); });
        var saida = b.dataset.tipo === 'saida';
        form.querySelector('[data-item]').hidden = saida; form.querySelector('[data-despesa]').hidden = !saida;
        form.elements.valor.value = saida ? d.R.despesas[form.elements.despesa.selectedIndex][1] : d.R.itens[form.elements.produto.selectedIndex][1];
        form.dataset.tipoAtual = b.dataset.tipo;
        return;
      }
      if ((b = t.closest('[data-forma]'))) {
        b.parentNode.querySelectorAll('[data-forma]').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', x === b); });
        return;
      }
      if (t.closest('[data-fechar-dia]')) { d.fechado = true; usou('caixa'); redesenharTela(); fala('Dia fechado.'); return; }
      if (t.closest('[data-reabrir]')) { d.fechado = false; redesenharTela(); return; }
      if ((b = t.closest('[data-slot]'))) { st.sel = b.dataset.slot; usou('agenda'); redesenharTela(); var campo = corpo.querySelector('.sx-ag-lado input, .sx-ag-lado [data-concluir]'); if (campo) campo.focus(); return; }
      if (t.closest('[data-concluir]')) {
        var a = d.agenda[st.sel];
        var preco = (d.R.itens.filter(function (i2) { return i2[0] === a.servico; })[0] || [0, 0])[1];
        a.status = 'feito';
        lancar(a.servico + ' · ' + a.cliente.split(' ')[0], preco, 'Pix', 'entrada');
        st.novoSlot = st.sel;
        usou('agenda'); redesenharTela();
        aviso('Concluído: ' + real(preco) + ' entrou no caixa.');
        return;
      }
      if (t.closest('[data-desmarcar]')) { delete d.agenda[st.sel]; st.sel = null; redesenharTela(); aviso('Horário liberado.'); return; }
      if ((b = t.closest('[data-cli]'))) { st.cli = +b.dataset.cli; usou('clientes'); redesenharTela(); return; }
      if (t.closest('[data-cli-fechar]')) { st.cli = null; redesenharTela(); return; }
      if ((b = t.closest('[data-est]'))) {
        var e = d.estoque[+b.dataset.est]; e.qtd = Math.max(0, e.qtd + (+b.dataset.d));
        usou('estoque'); redesenharTela();
        var btn = corpo.querySelector('[data-est="' + b.dataset.est + '"][data-d="' + b.dataset.d + '"]'); if (btn) btn.focus();
        return;
      }
      if ((b = t.closest('[data-repor]'))) {
        var e2 = d.estoque[+b.dataset.repor]; var q = e2.min * 3 - e2.qtd; e2.qtd += q;
        st.novoEst = +b.dataset.repor; usou('estoque'); redesenharTela();
        aviso('Pedido de reposição: +' + q + ' ' + e2.un + ' de ' + e2.nome + '.');
        return;
      }
      if ((b = t.closest('[data-os]'))) {
        var o = d.os.filter(function (x) { return x.id === +b.dataset.os; })[0];
        usou('os');
        if (o.status < 2) { o.status++; st.novoOs = o.id; }
        else { o.status = 3; d.os = d.os.filter(function (x) { return x !== o; }); lancar('OS ' + o.id + ' · ' + o.desc, o.valor, 'Cartão', 'entrada'); aviso('OS ' + o.id + ' entregue: ' + real(o.valor) + ' no caixa.'); }
        redesenharTela(); return;
      }
    }

    function noEnvio(ev) {
      var f = ev.target.closest('[data-form]');
      if (!f || !st.d) return;
      ev.preventDefault();
      var d = st.d, k = f.dataset.form;
      if (k === 'venda') {
        var saida = f.dataset.tipoAtual === 'saida';
        var valor = num(f.elements.valor.value);
        if (valor <= 0) { f.elements.valor.focus(); return; }
        var forma = (f.querySelector('[data-forma].is-on') || {}).dataset;
        if (saida) { var dp = d.R.despesas[f.elements.despesa.selectedIndex]; lancar(dp[0], valor, forma ? forma.forma : 'Pix', 'saida'); }
        else { var it = d.R.itens[f.elements.produto.selectedIndex]; lancar(it[0], valor, forma ? forma.forma : 'Pix', 'entrada', it[0]); }
        usou('caixa'); redesenharTela();
        aviso((saida ? 'Saída' : 'Entrada') + ' de ' + real(valor) + ' lançada.');
        fala('Lançado. Saldo do dia: ' + real(somaHoje(d, 'entrada') - somaHoje(d, 'saida')) + '.');
      } else if (k === 'marcar') {
        var nome = f.elements.cliente.value.trim();
        if (!nome) return;
        d.agenda[st.sel] = { cliente: nome, servico: f.elements.servico.value, status: 'marcado' };
        st.novoSlot = st.sel; usou('agenda'); redesenharTela();
        aviso('Marcado. O cliente recebe a confirmação no WhatsApp.');
      } else if (k === 'cliente') {
        var n = f.elements.nome.value.trim();
        if (!n) return;
        d.clientes.unshift({ nome: n, fone: f.elements.fone.value.trim() || '(61) 9····-····', visitas: 0, gasto: 0, ultimo: '—', dias: 0 });
        st.novoCli = 0; st.cli = 0; st.busca = ''; usou('clientes'); redesenharTela();
        aviso(n + ' cadastrado.');
      } else if (k === 'os') {
        var desc = f.elements.desc.value.trim();
        if (!desc) return;
        var servs = d.R.itens.filter(function (i) { return i[2] === 'servico'; });
        d.os.push({ id: d.proxOs++, cliente: CLIENTES[d.proxOs % CLIENTES.length], desc: desc, valor: servs[0][1], status: 0 });
        st.novoOs = d.proxOs - 1; usou('os'); redesenharTela();
        var nova = corpo.querySelector('.sx-kb-nova input'); if (nova) nova.focus();
      } else if (k === 'meta') {
        var m = Math.round(num(f.elements.meta.value));
        if (m > 0) { d.meta = m; usou('metas'); redesenharTela(); aviso('Meta atualizada: ' + real(m) + '.'); }
      }
    }

    function noInput(ev) {
      var t = ev.target;
      if (t.matches('[data-busca]')) {
        if (ev.type !== 'input') return;
        st.busca = t.value;
        var pos = t.selectionStart;
        redesenharTela();
        var b = corpo.querySelector('[data-busca]'); if (b) { b.focus(); try { b.setSelectionRange(pos, pos); } catch (x) {} }
        return;
      }
      if (t.matches('[data-item]') && st.d) {
        t.form.elements.valor.value = st.d.R.itens[t.selectedIndex][1];
      }
      if (t.matches('[data-despesa]') && st.d) {
        t.form.elements.valor.value = st.d.R.despesas[t.selectedIndex][1];
      }
      if (t.matches('[data-nome]')) st.nome = t.value.trim();
    }

    raiz.addEventListener('click', noClique);
    raiz.addEventListener('submit', noEnvio);
    raiz.addEventListener('input', noInput);
    raiz.addEventListener('change', noInput);

    if (st.ramo) st.mods = RAMOS[st.ramo].padrao.slice();
    desenhar();

    var api = {
      destruir: function () {
        raiz.removeEventListener('click', noClique);
        raiz.removeEventListener('submit', noEnvio);
        raiz.removeEventListener('input', noInput);
        raiz.removeEventListener('change', noInput);
        document.removeEventListener('actech:previa', naPrevia);
        clearTimeout(tiraAviso);
        raiz.__sistema = null;
      }
    };
    raiz.__sistema = api;
    return api;
  }

  function reduzido() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  window.ACTechSistema = { montar: montar, ramos: RAMOS, modulos: MODULOS };
})();
