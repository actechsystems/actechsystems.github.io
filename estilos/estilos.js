/* ===================================================================
   Modelos de site: "veja como ficaria o seu site"

   A pessoa escolhe um estilo, responde tres perguntas (nome, ramo,
   cidade) e ve um mini-site de verdade, montado aqui em HTML e CSS, com
   o nome dela. Troca de estilo ao vivo, alterna computador/celular e,
   no fim, manda pro WhatsApp uma mensagem que ja diz nome, ramo e estilo.

   Por que arquivo separado: o index.html ja passa de 300 KB. Este
   arquivo, o estilos.css e as fontes dos modelos so descem quando a
   secao #modelos chega perto da tela (setupEstilos() no index.html).

   Por que DOM na mao, e nao template do x-dc: o ponto de montagem
   ([data-estilos]) sai do React vazio, entao o React nunca mexe nos
   filhos dele. Re-render do componente (abrir o quiz, o menu) nao
   apaga a previa.

   ACRESCENTAR UM ESTILO NOVO
   1. Um objeto novo em ESTILOS (id, nome, desc, amostra, render).
   2. Um bloco de CSS em estilos.css, com prefixo proprio de 2 letras.
   3. Se a fonte for nova, some ela em FONTES.
   Nada mais precisa mudar: a lista, o celular e o WhatsApp leem daqui.
   =================================================================== */
(function () {
  'use strict';

  /* Fontes livres do Google Fonts no lugar das tipografias proprietarias
     que inspiraram cada modelo. Uma requisicao so, e so quando a secao
     aparece. DM Sans a pagina ja carrega. */
  var FONTES = 'https://fonts.googleapis.com/css2?' + [
    'family=Outfit:wght@400;500',
    'family=Nunito+Sans:wght@400;600;700',
    'family=Figtree:wght@400;700;800',
    'family=Barlow+Condensed:wght@400;500;600',
    'family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600',
    'family=Inter:wght@400;500;600',
    'family=Cal+Sans',
    'family=Archivo:wght@300;400;700',
    'family=Geist:wght@400;500;600'
  ].join('&') + '&display=swap';

  /* ---------------------------------------------------------------
     O conteudo de cada ramo. Todo modelo le daqui, entao o texto de
     um ramo muda num lugar so. servicos: [nome, descricao, preco, detalhe].
     tom: a cor do ramo, que so o modelo escuro de "aplicativo" usa, no
     degrade do topo.
     --------------------------------------------------------------- */
  var RAMOS = {
    barbearia: {
      rotulo: 'Barbearia', exemplo: 'Navalha', tom: '#8a6420',
      foto: 'imgs/mod-barbearia.webp', alt: 'Barbeiro fazendo a barba de um cliente na cadeira',
      fotos: [
        ['imgs/ramos/barbearia-1.webp', 'Cadeira antiga de barbearia diante do espelho'],
        ['imgs/ramos/barbearia-2.webp', 'Pincel, navalha e pentes sobre a bancada'],
        ['imgs/ramos/barbearia-3.webp', 'Barbeiro fazendo a barba com navalha']
      ],
      nav: ['Serviços', 'Equipe', 'Contato'],
      cta: 'Agendar horário', cta2: 'Ver serviços', acao: 'Agendar',
      titulo: 'Corte marcado. Sem fila, sem esperar.',
      curto: 'Corte marcado. Sem fila.',
      sub: 'Escolha o barbeiro e o horário. A agenda é online e o lembrete chega no seu WhatsApp na véspera.',
      servicos: [
        ['Corte', 'Tesoura ou máquina, do jeito que você pedir.', 'R$ 45', '40 min'],
        ['Barba', 'Toalha quente e navalha.', 'R$ 35', '30 min'],
        ['Corte e barba', 'O combo, com tempo reservado.', 'R$ 70', '1h10'],
        ['Sobrancelha', 'Acabamento rápido na navalha.', 'R$ 15', '10 min']
      ],
      dif: [
        ['Agenda online', 'Escolhe o dia e o barbeiro em trinta segundos.'],
        ['Lembrete automático', 'Aviso na véspera pra ninguém esquecer.'],
        ['Combo barba e cabelo', 'Preço fechado e tempo reservado.']
      ],
      numeros: [['4,9', 'nota no Google'], ['+2 mil', 'cortes por ano'], ['0 min', 'de fila']],
      horarios: ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'],
      agenda: 'Escolha o seu horário',
      depo: ['Marco pelo celular e chego na hora. Nunca mais fiquei esperando.', 'Rafael', 'cliente desde 2021']
    },
    mercado: {
      rotulo: 'Mercado', exemplo: 'Mercado do Bairro', tom: '#2e7d34',
      foto: 'imgs/mod-mercado.webp', alt: 'Prateleira de hortifrútis num mercado de bairro',
      fotos: [
        ['imgs/ramos/mercado-1.webp', 'Cliente escolhendo frutas na banca'],
        ['imgs/ramos/mercado-2.webp', 'Caixa de legumes e frutas frescas'],
        ['imgs/ramos/mercado-3.webp', 'Bancas de frutas coloridas']
      ],
      nav: ['Ofertas', 'Setores', 'Contato'],
      cta: 'Pedir no WhatsApp', cta2: 'Ver ofertas', acao: 'Pedir',
      titulo: 'A feira da semana, entregue na sua porta.',
      curto: 'A feira na sua porta.',
      sub: 'Mais de dois mil itens, preço de mercado de bairro e entrega no mesmo dia para quem mora perto.',
      servicos: [
        ['Hortifrúti', 'Chega fresco toda manhã, escolhido a dedo.', 'Ofertas', 'toda terça'],
        ['Açougue', 'Corte na hora, do jeito que você pedir.', 'Kg', 'no balcão'],
        ['Padaria', 'Pão quente às 7h e às 17h.', 'Fornada', '2x por dia'],
        ['Cesta da semana', 'O básico da casa montado e entregue.', 'R$ 189', 'entrega hoje']
      ],
      dif: [
        ['Entrega no dia', 'Pedido até as 16h chega até as 19h.'],
        ['Ofertas toda terça', 'A lista nova sai cedo, direto no WhatsApp.'],
        ['Conta do mês', 'Cliente antigo fecha no fim do mês, como sempre foi.']
      ],
      numeros: [['+2 mil', 'itens na loja'], ['3h', 'pra entregar'], ['15 anos', 'no bairro']],
      horarios: ['10h–12h', '12h–14h', '14h–16h', '16h–18h', '18h–19h', '19h–20h'],
      agenda: 'Escolha a janela de entrega',
      depo: ['Faço a lista no WhatsApp de manhã e à tarde já está tudo em casa.', 'Dona Célia', 'cliente há 9 anos']
    },
    restaurante: {
      rotulo: 'Restaurante', exemplo: 'Cantinho', tom: '#b2481a',
      foto: 'imgs/mod-restaurante.webp', alt: 'Salão de restaurante com mesas de madeira postas',
      fotos: [
        ['imgs/ramos/restaurante-1.webp', 'Prato de massa com cogumelos'],
        ['imgs/ramos/restaurante-2.webp', 'Cozinheiros trabalhando na cozinha'],
        ['imgs/ramos/restaurante-3.webp', 'Carne grelhada com batatas e brócolis']
      ],
      nav: ['Cardápio', 'Delivery', 'Contato'],
      cta: 'Pedir agora', cta2: 'Ver o cardápio', acao: 'Pedir',
      titulo: 'O prato feito que o bairro inteiro conhece.',
      curto: 'Comida de verdade.',
      sub: 'Cardápio do dia publicado toda manhã, com foto de verdade. Entrega própria, sem taxa de aplicativo.',
      servicos: [
        ['Prato do dia', 'Arroz, feijão, salada e a mistura da vez.', 'R$ 29', 'até 15h'],
        ['Executivo', 'Entrada, principal e suco da fruta.', 'R$ 42', 'seg a sex'],
        ['Marmita da semana', 'Cinco refeições, entregues na segunda.', 'R$ 129', 'por semana'],
        ['Sobremesa da casa', 'O pudim que acaba antes das duas.', 'R$ 12', 'fatia']
      ],
      dif: [
        ['Cardápio do dia', 'Atualizado toda manhã, com foto real.'],
        ['Entrega própria', 'Sem taxa de aplicativo mordendo a margem.'],
        ['Reserva de mesa', 'Fim de semana com lugar garantido.']
      ],
      numeros: [['4,8', 'nota no Google'], ['35 min', 'pra entregar'], ['200', 'pratos por dia']],
      horarios: ['11:30', '12:00', '12:30', '13:00', '19:30', '20:30'],
      agenda: 'Reserve a sua mesa',
      depo: ['O almoço chega quentinho no escritório, e o pudim vale a viagem.', 'Juliana', 'pede toda semana']
    },
    clinica: {
      rotulo: 'Clínica', exemplo: 'Clínica Bem-Estar', tom: '#17699c',
      foto: 'imgs/mod-clinica.webp', alt: 'Recepção clara de uma clínica',
      fotos: [
        ['imgs/ramos/clinica-1.webp', 'Médico conversando com paciente no consultório'],
        ['imgs/ramos/clinica-2.webp', 'Estetoscópio ao lado de um notebook'],
        ['imgs/ramos/clinica-3.webp', 'Médico consultando um tablet']
      ],
      nav: ['Especialidades', 'Convênios', 'Contato'],
      cta: 'Agendar consulta', cta2: 'Ver especialidades', acao: 'Agendar',
      titulo: 'Consulta marcada sem precisar ligar.',
      curto: 'Cuidado sem espera.',
      sub: 'Especialidades, convênios aceitos e horários livres, tudo na tela. Confirmação na hora.',
      servicos: [
        ['Clínica geral', 'Check-up, receitas e encaminhamentos.', 'R$ 180', '30 min'],
        ['Pediatria', 'Do recém-nascido ao adolescente.', 'R$ 220', '40 min'],
        ['Dermatologia', 'Consulta e pequenos procedimentos.', 'R$ 250', '30 min'],
        ['Exames', 'Coleta no local, resultado online.', 'Convênio', 'sem fila']
      ],
      dif: [
        ['Convênios na tela', 'A pessoa confere o dela antes de ligar.'],
        ['Confirmação na hora', 'Sem telefone ocupado, sem retorno.'],
        ['Equipe e registros', 'Cada profissional com a sua formação.']
      ],
      numeros: [['12', 'especialidades'], ['8', 'convênios aceitos'], ['24h', 'pra ter resultado']],
      horarios: ['08:00', '08:40', '10:20', '14:00', '15:20', '16:40'],
      agenda: 'Escolha o seu horário',
      depo: ['Marquei a consulta da minha filha às onze da noite, pelo celular. Simples assim.', 'Patrícia', 'paciente']
    },
    petshop: {
      rotulo: 'Pet shop', exemplo: 'Amigo Pet', tom: '#b45309',
      foto: 'imgs/mod-petshop.webp', alt: 'Tosador aparando o pelo de um cachorro pequeno com tesoura',
      fotos: [
        ['imgs/ramos/petshop-1.webp', 'Cachorro tomando banho'],
        ['imgs/ramos/petshop-2.webp', 'Filhote sentado no tapete'],
        ['imgs/ramos/petshop-3.webp', 'Gato olhando pra cima']
      ],
      nav: ['Serviços', 'Loja', 'Contato'],
      cta: 'Agendar banho', cta2: 'Ver serviços', acao: 'Agendar',
      titulo: 'Banho marcado, sem precisar telefonar.',
      curto: 'Banho marcado. Pet feliz.',
      sub: 'Agenda de banho e tosa online, com lembrete no WhatsApp e o histórico de cada bichinho guardado.',
      servicos: [
        ['Banho', 'Shampoo certo pra cada pelagem.', 'R$ 55', '1h'],
        ['Banho e tosa', 'Tosa higiênica ou na tesoura.', 'R$ 90', '1h30'],
        ['Consulta', 'Veterinário com hora marcada.', 'R$ 150', '30 min'],
        ['Leva e traz', 'A gente busca e devolve cheiroso.', 'R$ 20', 'até 5 km']
      ],
      dif: [
        ['Agenda online', 'Banho, tosa e consulta no mesmo lugar.'],
        ['Histórico do pet', 'Vacina, peso e última visita à mão.'],
        ['Loja de produtos', 'Ração e itens frequentes, com reposição avisada.']
      ],
      numeros: [['4,9', 'nota no Google'], ['+800', 'pets atendidos'], ['1h', 'de banho, em média']],
      horarios: ['08:30', '09:30', '11:00', '13:30', '15:00', '16:30'],
      agenda: 'Escolha o horário do banho',
      depo: ['A Mel volta cheirosa e a foto chega no meu WhatsApp. Amo.', 'Fernanda', 'tutora da Mel']
    },
    salao: {
      rotulo: 'Salão', exemplo: 'Espaço Bela', tom: '#a31e4d',
      foto: 'imgs/mod-salao.webp', alt: 'Profissional lavando o cabelo de uma cliente na pia do salão',
      fotos: [
        ['imgs/ramos/salao-1.webp', 'Cabeleireira cortando cabelo'],
        ['imgs/ramos/salao-2.webp', 'Manicure pintando as unhas de uma cliente'],
        ['imgs/ramos/salao-3.webp', 'Cabelo com bobes']
      ],
      nav: ['Serviços', 'Portfólio', 'Contato'],
      cta: 'Agendar horário', cta2: 'Ver serviços', acao: 'Agendar',
      titulo: 'Seu horário guardado, sem grupo de zap.',
      curto: 'Seu horário, guardado.',
      sub: 'A cliente escolhe o serviço, a profissional e o horário, e a confirmação chega sozinha, sem ida e volta.',
      servicos: [
        ['Corte', 'Com lavagem e finalização.', 'R$ 80', '1h'],
        ['Escova', 'Lisa ou modelada.', 'R$ 60', '45 min'],
        ['Coloração', 'Raiz, global ou mechas.', 'R$ 180', '2h'],
        ['Manicure', 'Mão e pé, com esmaltação.', 'R$ 50', '1h']
      ],
      dif: [
        ['Agenda por profissional', 'Cada uma com a própria escala de horários.'],
        ['Portfólio de fotos', 'Trabalho recente, direto na tela.'],
        ['Lembrete automático', 'Aviso na véspera pra ninguém faltar.']
      ],
      numeros: [['5,0', 'nota no Google'], ['6', 'profissionais'], ['+300', 'clientes por mês']],
      horarios: ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'],
      agenda: 'Escolha o seu horário',
      depo: ['Escolho a profissional, o horário, e pronto. Nada de ficar esperando resposta.', 'Aline', 'cliente']
    },
    outro: {
      rotulo: 'Outro ramo', exemplo: 'Sua Empresa', tom: '#3d6a99',
      foto: 'imgs/ramos/outro-0.webp', alt: 'Pessoa trabalhando no notebook com plantas de projeto',
      fotos: [
        ['imgs/ramos/outro-1.webp', 'Planta, trena e ferramentas sobre a mesa'],
        ['imgs/ramos/outro-2.webp', 'Parede de ferramentas numa oficina'],
        ['imgs/ramos/outro-3.webp', 'Tablet com painel de gráficos']
      ],
      nav: ['Serviços', 'Sobre', 'Contato'],
      cta: 'Pedir orçamento', cta2: 'Ver serviços', acao: 'Orçar',
      titulo: 'Atendimento de confiança, do orçamento à entrega.',
      curto: 'Feito com cuidado.',
      sub: 'Orçamento rápido pelo WhatsApp e atendimento de quem entende do assunto.',
      servicos: [
        ['Orçamento', 'Sem compromisso, com resposta no mesmo dia.', 'Grátis', 'no WhatsApp'],
        ['Hora marcada', 'Sem espera e sem enrolação.', 'Seg a sáb', 'agenda online'],
        ['Pagamento facilitado', 'Pix, cartão e parcelado.', 'Até 6x', 'sem juros'],
        ['Garantia', 'Voltou o problema, a gente resolve.', '90 dias', 'por escrito']
      ],
      dif: [
        ['Resposta rápida', 'O cliente pergunta e recebe retorno no mesmo dia.'],
        ['Tudo na tela', 'Serviços, preços e fotos antes do primeiro contato.'],
        ['Avaliações reais', 'Quem já comprou conta como foi.']
      ],
      numeros: [['4,9', 'nota no Google'], ['+500', 'clientes atendidos'], ['24h', 'pra responder']],
      horarios: ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'],
      agenda: 'Escolha o melhor horário',
      depo: ['Mandei mensagem de manhã e à tarde já tinha o orçamento. Atendimento de primeira.', 'Carlos', 'cliente']
    }
  };
  var ORDEM_RAMOS = ['barbearia', 'salao', 'petshop', 'clinica', 'restaurante', 'mercado', 'outro'];

  /* ---------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  // escapa o ramo inteiro de uma vez: os templates podem interpolar sem medo
  function escTudo(v) {
    if (Array.isArray(v)) return v.map(escTudo);
    if (v && typeof v === 'object') {
      var o = {};
      for (var k in v) o[k] = escTudo(v[k]);
      return o;
    }
    return typeof v === 'string' ? esc(v) : v;
  }
  function semAcento(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function slug(s) {
    var t = semAcento(s).toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 28);
    return (t || 'seunegocio') + '.com.br';
  }
  function inicial(s) {
    var m = String(s).trim().match(/[A-Za-zÀ-ÿ0-9]/);
    return m ? m[0].toUpperCase() : 'A';
  }

  var ICONES = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    busca: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    coracao: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    estrela: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z" fill="currentColor" stroke="none"/>',
    relogio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    local: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    whats: '<path d="M4.5 19.5l1.2-3.6A7.8 7.8 0 1 1 8.4 18.6z"/><path d="M9.3 9.2c.3 2.3 2.2 4.3 4.6 4.8l1-1.2 1.8.9c-.4 1.3-1.5 1.8-2.6 1.6-3-.6-5.4-3-6-6-.2-1.1.3-2.2 1.6-2.6l.9 1.8z" fill="currentColor" stroke="none"/>',
    casa: '<path d="M4 11l8-6.5 8 6.5V20h-5.5v-5h-5v5H4z"/>',
    lista: '<path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"/>',
    pc: '<rect x="3" y="4.5" width="18" height="12" rx="1.8"/><path d="M8.5 20h7M12 16.5V20"/>',
    cel: '<rect x="7" y="3" width="10" height="18" rx="2.2"/><path d="M11 17.6h2"/>',
    pausa: '<path d="M10 9v6M14 9v6"/>',
    sacola: '<path d="M5.5 8h13l-1 12h-11z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    calendario: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'
  };
  function ico(n, cls) {
    return '<svg class="est-i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONES[n] || '') + '</svg>';
  }

  /* A foto do ramo. n = 0 e a principal; 1 a 3 sao as extras (fotos),
     pra cartao e faixa nao repetirem a mesma imagem. Sem foto nenhuma,
     um bloco com a inicial do negocio. */
  function foto(v, cls, n) {
    var f = n ? v.r.fotos && v.r.fotos[(n - 1) % v.r.fotos.length] : v.r.foto && [v.r.foto, v.r.alt];
    if (f) {
      return '<img class="' + cls + '" src="' + f[0] + '" alt="' + f[1] + '" loading="lazy" decoding="async" width="800" height="600" />';
    }
    return '<span class="' + cls + ' est-semfoto" aria-hidden="true"><b>' + v.inicial + '</b></span>';
  }
  // links do menu de cada mini-site: rolam ate a secao, dentro da moldura
  var ALVOS = ['servicos', 'sobre', 'contato'];
  function links(v, cls) {
    return v.r.nav.map(function (t, i) {
      return '<button type="button" class="' + (cls || '') + '" data-ir="' + ALVOS[i] + '">' + t + '</button>';
    }).join('');
  }
  function bt(cls, txt, extra) {
    return '<button type="button" class="' + cls + '" data-acao>' + (extra || '') + txt + '</button>';
  }
  function onde(v, antes) {
    return v.cidade ? (antes || '') + v.cidade : '';
  }
  function ano() { return new Date().getFullYear(); }
  // o flutuante que acompanha a rolagem (bolinha de pedido, barra de "tocando")
  function flutua(html) {
    return '<div class="est-flutua">' + html + '</div>';
  }

  /* ===============================================================
     OS MODELOS
     Cada render recebe v (tudo ja escapado): v.nome, v.cidade, v.url,
     v.inicial e v.r (o conteudo do ramo). Devolve o HTML do mini-site.
     Secoes com data-sec="servicos|sobre|contato" sao o alvo do menu.
     =============================================================== */
  var ESTILOS = [

    /* ---- Vitrine: branco, silencioso, a foto faz todo o trabalho ---- */
    {
      id: 'vitrine', nome: 'Vitrine', desc: 'Branco, amplo, a foto em primeiro plano',
      amostra: { bg: '#ffffff', fg: '#171a20', ac: '#3e6ae1', fonte: "'Outfit'", raio: '4px' },
      render: function (v) {
        var r = v.r;
        return '<div class="vt">' +
          '<header class="vt-nav"><b class="vt-marca">' + v.nome + '</b><nav>' + links(v) + '</nav>' +
            '<button type="button" class="vt-menu" aria-label="Menu">' + ico('menu') + '</button></header>' +
          '<section class="vt-hero">' + foto(v, 'vt-foto') +
            '<div class="vt-hero-txt"><h1>' + v.nome + '</h1><p>' + r.curto + '</p></div>' +
            '<div class="vt-hero-bts">' + bt('vt-b1', r.cta) + bt('vt-b2', r.cta2) + '</div>' +
          '</section>' +
          '<section class="vt-sec" data-sec="servicos"><div class="vt-grade">' +
            r.servicos.slice(0, 3).map(function (s) {
              return '<div class="vt-item"><b>' + s[0] + '</b><span>' + s[1] + '</span>' +
                '<p><button type="button" data-acao>Saiba mais</button><button type="button" data-acao>' + r.acao + '</button></p></div>';
            }).join('') +
          '</div></section>' +
          '<section class="vt-cats" data-sec="sobre">' +
            '<div class="vt-cat vt-cat--foto">' + foto(v, 'vt-cat-img', 1) + '<b>Conheça o espaço</b></div>' +
            '<div class="vt-cat vt-cat--nums">' + r.numeros.map(function (n) {
              return '<p><b>' + n[0] + '</b><span>' + n[1] + '</span></p>';
            }).join('') + '</div>' +
          '</section>' +
          '<footer class="vt-pe" data-sec="contato"><span>' + v.nome + ' © ' + ano() + '</span><span>Privacidade</span><span>Contato</span>' +
            (v.cidade ? '<span>' + v.cidade + '</span>' : '') + '</footer>' +
        '</div>';
      }
    },

    /* ---- Cafe: creme, verdes em camadas, tudo arredondado ---- */
    {
      id: 'cafe', nome: 'Café', desc: 'Creme, verde e botões redondos',
      amostra: { bg: '#f2f0eb', fg: '#1e3932', ac: '#00754a', fonte: "'Nunito Sans'", raio: '99px' },
      render: function (v) {
        var r = v.r;
        return '<div class="cf">' +
          '<header class="cf-nav"><b class="cf-marca"><i>' + v.inicial + '</i>' + v.nome + '</b><nav>' + links(v) + '</nav>' +
            '<span class="cf-nav-dir">' + bt('cf-bo', 'Como chegar', ico('local')) + bt('cf-bk', r.acao) + '</span></header>' +
          '<section class="cf-hero"><div class="cf-hero-img">' + foto(v, 'cf-foto') + '</div>' +
            '<div class="cf-hero-txt"><h1>' + r.titulo + '</h1><p>' + r.sub + '</p>' +
            '<div class="cf-bts">' + bt('cf-b1', r.cta) + bt('cf-b2', r.cta2) + '</div></div></section>' +
          '<section class="cf-sec" data-sec="servicos"><h2>O que tem aqui</h2><div class="cf-cards">' +
            r.servicos.map(function (s) {
              return '<div class="cf-card"><b>' + s[0] + '</b><span>' + s[1] + '</span><em>' + s[2] + ' <small>· ' + s[3] + '</small></em></div>';
            }).join('') +
          '</div></section>' +
          '<section class="cf-banda" data-sec="sobre"><div class="cf-banda-txt"><span class="cf-selo">' + ico('estrela') + 'Cartão fidelidade</span>' +
            '<h2>A décima visita é por nossa conta.</h2><p>' + r.dif[0][1] + ' ' + r.dif[2][1] + '</p>' +
            '<div class="cf-bts">' + bt('cf-b1 cf-b1--inv', 'Quero participar') + bt('cf-b2 cf-b2--inv', 'Como funciona') + '</div></div>' +
            '<blockquote class="cf-depo"><p>“' + r.depo[0] + '”</p><cite>' + r.depo[1] + ', ' + r.depo[2] + '</cite></blockquote></section>' +
          '<footer class="cf-pe" data-sec="contato"><b>' + v.nome + '</b><span>' + onde(v, '') + (v.cidade ? ' · ' : '') + 'Seg a sáb, 9h às 19h</span><small>© ' + ano() + '</small></footer>' +
          flutua('<button type="button" class="cf-frap" data-acao aria-label="' + r.cta + '">' + ico('sacola') + '</button>') +
        '</div>';
      }
    },

    /* ---- Palco: escuro de aplicativo, servicos viram "faixas" ---- */
    {
      id: 'palco', nome: 'Palco', desc: 'Escuro, com cara de aplicativo',
      amostra: { bg: '#121212', fg: '#ffffff', ac: '#1ed760', fonte: "'Figtree'", raio: '99px' },
      render: function (v) {
        var r = v.r;
        return '<div class="pl" style="--pl-tom:' + r.tom + '">' +
          '<aside class="pl-lado"><b class="pl-marca"><i>' + v.inicial + '</i>' + v.nome + '</b>' +
            '<button type="button" class="is-on">' + ico('casa') + 'Início</button>' +
            '<button type="button" data-ir="servicos">' + ico('lista') + r.nav[0] + '</button>' +
            '<button type="button" data-ir="contato">' + ico('local') + 'Contato</button>' +
            '<div class="pl-caixa"><small>Sua agenda</small><p>Próximo horário livre hoje às ' + r.horarios[3] + '.</p>' + bt('pl-mini', r.acao) + '</div></aside>' +
          '<div class="pl-main">' +
            '<section class="pl-topo"><div class="pl-capa">' + foto(v, 'pl-foto') + '</div>' +
              '<div class="pl-topo-txt"><small>' + r.rotulo + '</small><h1>' + v.nome + '</h1><p>' + r.sub + '</p>' +
              '<span class="pl-meta"><b>' + (v.cidade || r.rotulo) + '</b> • ' + r.numeros[0][0] + ' ' + ico('estrela') + ' • ' + r.numeros[1][0] + ' ' + r.numeros[1][1] + '</span></div></section>' +
            '<div class="pl-acoes"><button type="button" class="pl-play" data-acao aria-label="' + r.cta + '">' + ico('play') + '</button>' +
              bt('pl-pill', r.cta) + bt('pl-contorno', 'Seguir') + '</div>' +
            '<section class="pl-sec" data-sec="servicos"><h2>' + r.nav[0] + '</h2><ol class="pl-faixas">' +
              '<li class="pl-cab"><span>#</span><span>Serviço</span><span>' + ico('relogio') + '</span><span>Valor</span></li>' +
              r.servicos.map(function (s, i) {
                return '<li><span>' + (i + 1) + '</span><span><b>' + s[0] + '</b><small>' + s[1] + '</small></span><span>' + s[3] + '</span><span>' + s[2] + '</span></li>';
              }).join('') +
            '</ol></section>' +
            '<section class="pl-sec" data-sec="sobre"><h2>Por que vir aqui</h2><div class="pl-cards">' +
              r.dif.map(function (d, i) {
                return '<div class="pl-card"><i class="pl-card-q pl-card-q--' + i + '">' + foto(v, 'pl-foto', i + 1) + '</i><b>' + d[0] + '</b><span>' + d[1] + '</span></div>';
              }).join('') +
            '</div></section>' +
            '<footer class="pl-pe" data-sec="contato"><b>' + v.nome + '</b><span>' + onde(v, '') + (v.cidade ? ' · ' : '') + '© ' + ano() + '</span></footer>' +
          '</div>' +
          '<div class="pl-tocando"><span class="pl-tocando-capa">' + foto(v, 'pl-foto') + '</span>' +
            '<span class="pl-tocando-txt"><b>Próximo horário livre</b><small>Hoje, ' + r.horarios[3] + '</small></span>' +
            '<span class="pl-barra"><i></i></span>' + bt('pl-pill pl-pill--sm', r.acao) + '</div>' +
        '</div>';
      }
    },

    /* ---- Impacto: preto absoluto, dourado, letra enorme em caixa alta ---- */
    {
      id: 'impacto', nome: 'Impacto', desc: 'Preto, dourado e letras enormes',
      amostra: { bg: '#000000', fg: '#ffffff', ac: '#ffc000', fonte: "'Barlow Condensed'", raio: '0', caixa: true },
      render: function (v) {
        var r = v.r;
        return '<div class="im">' +
          '<header class="im-nav"><button type="button" class="im-menu">' + ico('menu') + 'Menu</button><b>' + v.nome + '</b>' +
            '<span class="im-nav-dir">' + ico('busca') + '</span></header>' +
          '<section class="im-hero">' + foto(v, 'im-foto') +
            '<div class="im-hero-txt"><small>' + r.rotulo + onde(v, ' · ') + '</small><h1>' + r.curto + '</h1>' +
            '<div class="im-bts">' + bt('im-ouro', r.cta) + bt('im-fantasma', r.cta2) + '</div></div>' +
            '<span class="im-hex" aria-hidden="true"><svg viewBox="0 0 40 44"><path d="M20 1.5L38 12v20L20 42.5 2 32V12z"/></svg>' + ico('pausa') + '</span>' +
            '<i class="im-prog" aria-hidden="true"></i></section>' +
          '<section class="im-sec" data-sec="servicos"><h2>' + r.nav[0] + '</h2><div class="im-grade">' +
            r.servicos.map(function (s, i) {
              return '<div class="im-card"><small>0' + (i + 1) + '</small><h3>' + s[0] + '</h3><p>' + s[1] + '</p><b>' + s[2] + ' / ' + s[3] + '</b></div>';
            }).join('') +
          '</div></section>' +
          '<section class="im-nums" data-sec="sobre">' + r.numeros.map(function (n) {
            return '<p><b>' + n[0] + '</b><span>' + n[1] + '</span></p>';
          }).join('') + '</section>' +
          '<footer class="im-pe" data-sec="contato"><b>' + v.nome + '</b><span>' + onde(v, '') + '</span><span>© ' + ano() + '</span></footer>' +
        '</div>';
      }
    },

    /* ---- Colorido: creme, cartoes saturados e formas "de massinha" ---- */
    {
      id: 'colorido', nome: 'Colorido', desc: 'Cartões vivos e formas divertidas',
      amostra: { bg: '#fffaf0', fg: '#0a0a0a', ac: '#ff4d8b', fonte: "'Bricolage Grotesque'", raio: '12px' },
      render: function (v) {
        var r = v.r;
        var frag = [
          ico('check') + r.servicos[0][2] + ' · ' + r.servicos[0][3],
          ico('estrela') + r.numeros[0][0] + ' ' + r.numeros[0][1],
          ico('calendario') + 'Hoje, ' + r.horarios[2],
          ico('whats') + 'Resposta em minutos'
        ];
        return '<div class="co">' +
          '<header class="co-nav"><b class="co-marca"><i class="co-bola co-bola--logo"></i>' + v.nome + '</b><nav>' + links(v) + '</nav>' + bt('co-b1', r.acao) + '</header>' +
          '<section class="co-hero"><div class="co-hero-txt"><span class="co-selo">' + r.rotulo + onde(v, ' em ') + '</span>' +
            '<h1>' + r.titulo + '</h1><p>' + r.sub + '</p><div class="co-bts">' + bt('co-b1', r.cta) + bt('co-b2', r.cta2) + '</div></div>' +
            '<div class="co-ilustra">' + foto(v, 'co-foto') +
              '<i class="co-bola co-bola--1"></i><i class="co-bola co-bola--2"></i><i class="co-bola co-bola--3"></i></div></section>' +
          '<section class="co-sec" data-sec="servicos"><small class="co-rotulo">O que a gente faz</small><h2>' + r.nav[0] + ' pra todo gosto.</h2><div class="co-cards">' +
            r.servicos.map(function (s, i) {
              return '<div class="co-card co-card--' + i + '"><b>' + s[0] + '</b><span>' + s[1] + '</span><em class="co-frag">' + frag[i] + '</em></div>';
            }).join('') +
          '</div></section>' +
          '<section class="co-cta" data-sec="sobre"><div><h2>' + r.dif[0][0] + ', ' + r.dif[1][0].toLowerCase() + ' e muito mais.</h2><p>' + r.dif[2][1] + '</p>' + bt('co-b1', r.cta) + '</div>' +
            '<i class="co-bola co-bola--4"></i><i class="co-bola co-bola--5"></i></section>' +
          '<footer class="co-pe" data-sec="contato"><b><i class="co-bola co-bola--logo"></i>' + v.nome + '</b><span>' + onde(v, '') + '</span><span>© ' + ano() + '</span></footer>' +
        '</div>';
      }
    },

    /* ---- Agenda: branco limpo com a agenda na primeira dobra ---- */
    {
      id: 'agenda', nome: 'Agenda', desc: 'Limpo, com a agenda logo na entrada',
      amostra: { bg: '#ffffff', fg: '#111111', ac: '#111111', fonte: "'Cal Sans'", raio: '8px' },
      render: function (v) {
        var r = v.r;
        return '<div class="ag">' +
          '<header class="ag-nav"><b class="ag-marca"><i>' + v.inicial + '</i>' + v.nome + '</b><nav class="ag-pilulas">' + links(v) + '</nav>' + bt('ag-b1 ag-b1--sm', r.acao) + '</header>' +
          '<section class="ag-hero"><div class="ag-hero-txt"><span class="ag-selo"><i></i>Agenda aberta hoje</span><h1>' + r.titulo + '</h1><p>' + r.sub + '</p>' +
            '<div class="ag-bts">' + bt('ag-b1', r.cta) + bt('ag-b2', r.cta2) + '</div></div>' +
            calendario(v) + '</section>' +
          '<section class="ag-sec" data-sec="servicos"><h2>Como funciona</h2><div class="ag-cards">' +
            [['Escolha o serviço', r.servicos[0][0] + ', ' + r.servicos[1][0].toLowerCase() + ' e mais.'],
             ['Marque o horário', 'Só aparece o que está livre de verdade.'],
             ['Receba a confirmação', 'Na hora, e o lembrete na véspera.']].map(function (p, i) {
              return '<div class="ag-card"><small>0' + (i + 1) + '</small><b>' + p[0] + '</b><span>' + p[1] + '</span></div>';
            }).join('') +
          '</div></section>' +
          '<section class="ag-sec ag-depo" data-sec="sobre"><p>“' + r.depo[0] + '”</p><span class="ag-autor"><i>' + inicial(r.depo[1]) + '</i><b>' + r.depo[1] + '</b><small>' + r.depo[2] + '</small></span></section>' +
          '<footer class="ag-pe" data-sec="contato"><b class="ag-marca"><i>' + v.inicial + '</i>' + v.nome + '</b><span>' + onde(v, '') + '</span><span>© ' + ano() + '</span></footer>' +
        '</div>';
      }
    },

    /* ---- Pista: preto, faixa de tres cores e maiusculas pesadas ---- */
    {
      id: 'pista', nome: 'Pista', desc: 'Preto técnico com faixa tricolor',
      amostra: { bg: '#000000', fg: '#ffffff', ac: '#1c69d4', fonte: "'Archivo'", raio: '0', caixa: true, faixa: true },
      render: function (v) {
        var r = v.r;
        return '<div class="pi">' +
          '<header class="pi-nav"><b class="pi-marca">' + v.nome + '<i class="pi-faixa"></i></b><nav>' + links(v) + '</nav>' +
            '<button type="button" class="pi-menu" aria-label="Menu">' + ico('menu') + '</button></header>' +
          '<section class="pi-hero">' + foto(v, 'pi-foto') +
            '<div class="pi-hero-txt"><h1>' + r.curto + '</h1><p>' + r.sub + '</p>' +
            '<div class="pi-bts">' + bt('pi-b1', r.cta) + bt('pi-b2', r.cta2, '') + '</div></div></section>' +
          '<i class="pi-faixa pi-faixa--larga"></i>' +
          '<section class="pi-sec" data-sec="servicos"><h2>' + r.nav[0] + '</h2><ul class="pi-lista">' +
            r.servicos.map(function (s) {
              return '<li><b>' + s[0] + '</b><span>' + s[1] + '</span><em>' + s[2] + '</em>' + ico('seta') + '</li>';
            }).join('') +
          '</ul></section>' +
          '<section class="pi-dados" data-sec="sobre">' + r.numeros.map(function (n) {
            return '<p><b>' + n[0] + '</b><span>' + n[1] + '</span></p>';
          }).join('') + '</section>' +
          '<section class="pi-faixa-foto">' + foto(v, 'pi-foto', 2) + '<p><small>' + r.rotulo + '</small><b>' + r.dif[0][0] + '</b></p></section>' +
          '<footer class="pi-pe" data-sec="contato"><b>' + v.nome + '</b><span>' + onde(v, '') + '</span><span>© ' + ano() + '</span></footer>' +
        '</div>';
      }
    },

    /* ---- Convite: fotos em cartao, busca em pilula, um vermelho so ---- */
    {
      id: 'convite', nome: 'Convite', desc: 'Fotos em cartão e busca em pílula',
      amostra: { bg: '#ffffff', fg: '#222222', ac: '#ff385c', fonte: "'DM Sans'", raio: '99px' },
      render: function (v) {
        var r = v.r;
        return '<div class="cv">' +
          '<header class="cv-nav"><b class="cv-marca">' + ico('casa') + v.nome + '</b>' +
            '<nav class="cv-abas">' + v.r.nav.map(function (t, i) {
              return '<button type="button"' + (i === 0 ? ' class="is-on"' : '') + ' data-ir="' + ALVOS[i] + '">' + t + '</button>';
            }).join('') + '</nav>' +
            '<span class="cv-conta">' + ico('menu') + '<i>' + v.inicial + '</i></span></header>' +
          '<div class="cv-busca"><span><b>Serviço</b><small>' + r.servicos[0][0] + '</small></span><span><b>Quando</b><small>Hoje, ' + r.horarios[2] + '</small></span>' +
            '<span><b>' + (v.cidade ? 'Onde' : 'Quem') + '</b><small>' + (v.cidade || '1 pessoa') + '</small></span>' +
            '<button type="button" class="cv-orbe" data-acao aria-label="Buscar">' + ico('busca') + '</button></div>' +
          '<section class="cv-sec" data-sec="servicos"><h2>' + r.nav[0] + ' mais procurados</h2><div class="cv-grade">' +
            r.servicos.map(function (s, i) {
              return '<div class="cv-card"><div class="cv-card-img">' + foto(v, 'cv-foto', i) +
                (i < 2 ? '<span class="cv-fav">Favorito dos clientes</span>' : '') +
                '<button type="button" class="cv-coracao" data-coracao aria-label="Salvar ' + s[0] + '">' + ico('coracao') + '</button></div>' +
                '<p class="cv-card-l1"><b>' + s[0] + '</b><span>' + ico('estrela') + (i % 2 ? '4,8' : r.numeros[0][0]) + '</span></p>' +
                '<p class="cv-card-l2">' + s[1] + '</p><p class="cv-card-l3"><b>' + s[2] + '</b> · ' + s[3] + '</p></div>';
            }).join('') +
          '</div></section>' +
          '<section class="cv-sec cv-porque" data-sec="sobre"><h2>Por que escolher ' + v.nome + '</h2><div class="cv-itens">' +
            r.dif.map(function (d, i) {
              return '<div>' + ico(['calendario', 'relogio', 'estrela'][i]) + '<b>' + d[0] + '</b><span>' + d[1] + '</span></div>';
            }).join('') +
          '</div>' + bt('cv-b1', r.cta) + '</section>' +
          '<footer class="cv-pe" data-sec="contato"><div><b>Atendimento</b><span>WhatsApp</span><span>Como chegar</span></div>' +
            '<div><b>' + v.nome + '</b><span>' + (v.cidade || r.rotulo) + '</span><span>© ' + ano() + '</span></div></footer>' +
        '</div>';
      }
    },

    /* ---- Estudio: editorial, titulo grande e blocos de cor chapada ---- */
    {
      id: 'estudio', nome: 'Estúdio', desc: 'Editorial, com blocos de cor chapada',
      amostra: { bg: '#ffffff', fg: '#080808', ac: '#7a3dff', fonte: "'Geist'", raio: '4px' },
      render: function (v) {
        var r = v.r;
        return '<div class="es">' +
          '<header class="es-nav"><b class="es-marca"><i></i>' + v.nome + '</b><nav>' + links(v) + '</nav>' +
            '<span class="es-nav-dir">' + bt('es-b2 es-b--sm', 'Entrar') + bt('es-b1 es-b--sm', r.acao) + '</span></header>' +
          '<section class="es-hero"><small class="es-sobre">' + r.rotulo + onde(v, ' · ') + '</small><h1>' + r.titulo + '</h1><p>' + r.sub + '</p>' +
            '<div class="es-bts">' + bt('es-b1', r.cta, '') + bt('es-b2', r.cta2) + '</div>' +
            '<div class="es-vitrine">' + foto(v, 'es-foto') + '<span class="es-flutua">' + ico('check') + '<b>' + r.servicos[0][0] + '</b><small>' + r.servicos[0][2] + ' · ' + r.servicos[0][3] + '</small></span></div></section>' +
          '<section class="es-sec" data-sec="servicos"><small class="es-sobre">' + r.nav[0] + '</small><h2>Tudo o que você precisa, num lugar só.</h2><div class="es-blocos">' +
            r.servicos.concat([[r.dif[0][0], r.dif[0][1], '', '']]).map(function (s, i) {
              return '<div class="es-bloco es-bloco--' + i + '"><b>' + s[0] + '</b><span>' + s[1] + '</span>' + (s[2] ? '<em>' + s[2] + ' · ' + s[3] + '</em>' : '<em>' + ico('seta') + '</em>') + '</div>';
            }).join('') +
          '</div></section>' +
          '<section class="es-nums" data-sec="sobre">' + r.numeros.map(function (n) {
            return '<p><b>' + n[0] + '</b><span>' + n[1] + '</span></p>';
          }).join('') + '</section>' +
          '<footer class="es-pe" data-sec="contato"><b class="es-marca"><i></i>' + v.nome + '</b><span>' + onde(v, '') + '</span><span>© ' + ano() + '</span></footer>' +
        '</div>';
      }
    }
  ];

  /* O widget de agenda do modelo "Agenda": mes corrente de verdade, dias
     passados apagados, fim de semana e metade dos dias uteis livres.
     Clicar num dia e num horario seleciona -- e brinquedo, mas funciona. */
  var MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  function calendario(v) {
    var r = v.r;
    var hoje = new Date();
    var y = hoje.getFullYear(), m = hoje.getMonth(), d0 = hoje.getDate();
    var primeiro = new Date(y, m, 1).getDay();
    var total = new Date(y, m + 1, 0).getDate();
    var cel = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(function (s) { return '<span class="ag-sem">' + s + '</span>'; }).join('');
    for (var i = 0; i < primeiro; i++) cel += '<span></span>';
    var marcado = false;
    for (var d = 1; d <= total; d++) {
      var dow = new Date(y, m, d).getDay();
      var livre = d >= d0 && dow !== 0;
      var on = livre && !marcado;
      if (on) marcado = true;
      cel += livre
        ? '<button type="button" class="ag-dia' + (on ? ' is-on' : '') + '" data-sel="dia">' + d + '</button>'
        : '<span class="ag-dia ag-dia--off">' + d + '</span>';
    }
    return '<div class="ag-widget" aria-label="Exemplo de agenda">' +
      '<div class="ag-w-lado"><i class="ag-avatar">' + v.inicial + '</i><small>' + v.nome + '</small><b>' + r.servicos[0][0] + '</b>' +
        '<span>' + ico('relogio') + r.servicos[0][3] + '</span><span>' + ico('local') + (v.cidade || 'Presencial') + '</span></div>' +
      '<div class="ag-w-cal"><b>' + MESES[m] + ' <small>' + y + '</small></b><div class="ag-grade">' + cel + '</div></div>' +
      '<div class="ag-w-hora"><b>' + r.agenda + '</b>' +
        r.horarios.map(function (h, i) {
          return '<button type="button" class="ag-hora' + (i === 1 ? ' is-on' : '') + '" data-sel="hora">' + h + '</button>';
        }).join('') + '</div>' +
    '</div>';
  }

  /* ===============================================================
     O CONFIGURADOR
     =============================================================== */
  function montar(raiz, opts) {
    if (!raiz || raiz.__estilos) return raiz && raiz.__estilos;
    opts = opts || {};
    var fone = opts.whatsapp || '5561994299823';

    // Nada e guardado de proposito: F5 volta pro convite, do zero. A previa
    // vive so enquanto a aba esta aberta.
    var st = {
      estilo: ESTILOS[0].id,
      dados: null,          // null = ainda nao personalizou
      rascunho: {},
      disp: 'pc',
      etapa: 'convite'      // convite | nome | ramo | cidade | montando | null
    };

    raiz.classList.add('est');
    raiz.innerHTML =
      '<div class="est-lista" role="radiogroup" aria-label="Estilos de site">' +
        ESTILOS.map(function (e, i) {
          var a = e.amostra;
          return '<button type="button" class="est-opcao" role="radio" data-estilo="' + e.id + '" aria-checked="false" tabindex="-1">' +
            '<span class="est-amostra" style="--a-bg:' + a.bg + ';--a-fg:' + a.fg + ';--a-ac:' + a.ac + ';--a-fonte:' + a.fonte + ';--a-raio:' + a.raio + '">' +
              '<b' + (a.caixa ? ' class="is-caixa"' : '') + '>Aa</b><i></i>' + (a.faixa ? '<s></s>' : '') + '</span>' +
            '<span class="est-opcao-txt"><b>' + e.nome + '</b><small>' + e.desc + '</small></span></button>';
        }).join('') +
      '</div>' +
      '<div class="est-palco">' +
        '<div class="est-barra"><span class="est-barra-txt">Veja no</span>' +
          '<span class="est-disp" role="group" aria-label="Ver como">' +
            '<button type="button" data-disp="pc" aria-pressed="true" title="Computador">' + ico('pc') + '<span>Computador</span></button>' +
            '<button type="button" data-disp="cel" aria-pressed="false" title="Celular">' + ico('cel') + '<span>Celular</span></button></span></div>' +
        // o aparelho: MacBook no computador, iPhone no celular. O mesmo HTML
        // muda de forma so pelo data-modo -- a troca anima no CSS.
        '<div class="est-aparelho" data-aparelho>' +
          '<div class="est-corpo">' +
            '<i class="est-camera" aria-hidden="true"></i>' +
            '<div class="est-vidro" data-vidro>' +
              '<div class="est-status" aria-hidden="true"><b data-hora>9:41</b><span>' +
                '<svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect x="10" y="3" width="3" height="9" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8"/></svg>' +
                '<svg viewBox="0 0 16 12"><path d="M8 11.5l2.4-2.9a3.6 3.6 0 0 0-4.8 0zM3.3 6.3a7 7 0 0 1 9.4 0l1.6-1.9a9.6 9.6 0 0 0-12.6 0zM.2 2.6a11.7 11.7 0 0 1 15.6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
                '<i class="est-bateria"><i></i></i></span></div>' +
              '<div class="est-safari"><span class="est-semaforo" aria-hidden="true"><i></i><i></i><i></i></span>' +
                '<span class="est-setas" aria-hidden="true">‹ ›</span>' +
                '<span class="est-url"><svg viewBox="0 0 12 14" aria-hidden="true"><rect x="1" y="6" width="10" height="7.5" rx="1.6"/><path d="M3.5 6V4.2a2.5 2.5 0 0 1 5 0V6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span data-url></span></span></div>' +
              '<div class="est-moldura" data-moldura><div class="est-site" data-site role="region" aria-label="Prévia do site" tabindex="-1"></div>' +
                '<div class="est-aviso" data-aviso role="status"></div>' +
                '<div class="est-veu" data-veu></div></div>' +
              '<i class="est-home" aria-hidden="true"></i>' +
            '</div>' +
          '</div>' +
          '<div class="est-base" aria-hidden="true"><i></i></div>' +
        '</div>' +
      '</div>' +
      '<div class="est-acoes" data-acoes>' +
        '<p data-acoes-txt></p>' +
        '<div class="est-acoes-bts"><button type="button" class="btn btn-secondary btn-sm" data-trocar>Trocar os dados</button>' +
        '<a class="btn btn-primary btn-sm" data-quero data-sem-portao target="_blank" rel="noopener">' + ico('whats') + 'Quero um site assim</a></div>' +
      '</div>' +
      '<p class="est-sr" aria-live="polite" data-fala></p>';

    var $ = function (s) { return raiz.querySelector(s); };
    var lista = $('.est-lista'), site = $('[data-site]'), veu = $('[data-veu]'), moldura = $('[data-moldura]');
    var aparelho = $('[data-aparelho]'), vidro = $('[data-vidro]');
    // tela estreita (celular de verdade): nao tem escolha, e iPhone
    var estreita = window.matchMedia ? window.matchMedia('(max-width: 760px)') : { matches: false };
    function aplicaModo() {
      var modo = estreita.matches ? 'cel' : st.disp;
      aparelho.dataset.modo = modo;
      moldura.dataset.modo = modo;
      var d = new Date();
      $('[data-hora]').textContent = d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2);
    }
    function mudouTela() { aplicaModo(); }
    if (estreita.addEventListener) estreita.addEventListener('change', mudouTela);
    var opcoes = [].slice.call(raiz.querySelectorAll('.est-opcao'));
    var tiraAviso;

    function achaEstilo(id) {
      for (var i = 0; i < ESTILOS.length; i++) if (ESTILOS[i].id === id) return ESTILOS[i];
      return null;
    }

    // o que a previa mostra: os dados da pessoa, ou o exemplo do ramo
    function modelo() {
      var dd = st.dados;
      var ramoId = dd && RAMOS[dd.ramo] ? dd.ramo : 'barbearia';
      var ramo = JSON.parse(JSON.stringify(RAMOS[ramoId]));
      if (ramoId === 'outro' && dd && dd.outro) ramo.rotulo = dd.outro;
      var nome = dd ? dd.nome : ramo.exemplo;
      var cidade = dd ? (dd.cidade || '') : 'Brasília';
      return {
        r: escTudo(ramo), nome: esc(nome), cidade: esc(cidade),
        inicial: esc(inicial(nome)), url: slug(nome),
        cru: { nome: nome, cidade: cidade, rotulo: ramo.rotulo }
      };
    }

    function desenhar(anima) {
      var e = achaEstilo(st.estilo);
      var v = modelo();
      opcoes.forEach(function (b) {
        var on = b.dataset.estilo === st.estilo;
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      $('[data-url]').textContent = v.url;
      var troca = function () {
        site.innerHTML = e.render(v);
        site.dataset.estilo = e.id;
        // a barra de status do iPhone pega a cor do topo do site
        vidro.style.setProperty('--st-bg', e.amostra.bg);
        vidro.style.setProperty('--st-fg', e.amostra.fg);
        site.scrollTop = 0;
        site.classList.remove('is-saindo');
      };
      if (anima && !reduzido()) {
        site.classList.add('is-saindo');
        clearTimeout(site.__t);
        site.__t = setTimeout(troca, 160);
      } else troca();

      // o botao do WhatsApp so aparece depois que a pessoa personalizou
      var acoes = $('[data-acoes]');
      acoes.classList.toggle('is-on', !!st.dados);
      if (st.dados) {
        $('[data-acoes-txt]').innerHTML = 'Esse é o <b>' + v.nome + '</b> no estilo <b>' + e.nome + '</b>. Gostou? A gente faz o de verdade, com as suas fotos e os seus textos.';
        var msg = 'Olá! Montei uma prévia do meu site na página da ACTech.\n\n' +
          'Negócio: ' + v.cru.nome + '\nRamo: ' + v.cru.rotulo + (v.cru.cidade ? '\nCidade: ' + v.cru.cidade : '') +
          '\nEstilo: ' + e.nome + '\n\nQuero um site assim!';
        $('[data-quero]').href = 'https://wa.me/' + fone + '?text=' + encodeURIComponent(msg);
      }
    }

    /* ---- o veu com as perguntas ---- */
    function etapa(nome) {
      st.etapa = nome;
      var r = st.rascunho;
      var html = '';
      var passo = function (n) {
        return '<div class="est-passo"><span>' + n + ' de 3</span>' +
          (n > 1 ? '<button type="button" data-voltar>Voltar</button>' : '<button type="button" data-fechar>Fechar</button>') + '</div>';
      };
      if (nome === 'convite') {
        html = '<button type="button" class="est-cartao est-cartao--convite" data-comecar>' +
          '<span class="est-cartao-selo">Prévia grátis</span>' +
          '<b>Clique aqui e veja como ficaria o seu site</b>' +
          '<span>Três perguntas rápidas. Sem cadastro, sem compromisso.</span>' +
          '<span class="est-cartao-bt">Montar o meu site' + ico('seta') + '</span></button>';
      } else if (nome === 'nome') {
        html = '<form class="est-cartao" data-form="nome">' + passo(1) +
          '<label for="est-nome">Como se chama o seu negócio?</label>' +
          '<input id="est-nome" name="nome" maxlength="30" autocomplete="organization" placeholder="Ex.: Barbearia do Zé" value="' + esc(r.nome || '') + '" required />' +
          '<button class="est-cartao-bt" type="submit">Continuar' + ico('seta') + '</button></form>';
      } else if (nome === 'ramo') {
        html = '<form class="est-cartao" data-form="ramo">' + passo(2) +
          '<label>Qual é o ramo?</label><div class="est-ramos" role="radiogroup" aria-label="Ramo">' +
          ORDEM_RAMOS.map(function (id) {
            var on = r.ramo === id;
            return '<button type="button" role="radio" aria-checked="' + on + '" class="est-ramo' + (on ? ' is-on' : '') + '" data-ramo="' + id + '">' + RAMOS[id].rotulo + '</button>';
          }).join('') + '</div>' +
          '<div class="est-outro"' + (r.ramo === 'outro' ? '' : ' hidden') + '><label for="est-outro">O que vocês fazem?</label>' +
          '<input id="est-outro" name="outro" maxlength="30" placeholder="Ex.: Oficina mecânica" value="' + esc(r.outro || '') + '" /></div>' +
          '<button class="est-cartao-bt" type="submit"' + (r.ramo ? '' : ' disabled') + '>Continuar' + ico('seta') + '</button></form>';
      } else if (nome === 'cidade') {
        html = '<form class="est-cartao" data-form="cidade">' + passo(3) +
          '<label for="est-cidade">Em que cidade ou bairro? <small>(opcional)</small></label>' +
          '<input id="est-cidade" name="cidade" maxlength="30" autocomplete="address-level2" placeholder="Ex.: Taguatinga" value="' + esc(r.cidade || '') + '" />' +
          '<button class="est-cartao-bt" type="submit">Ver o meu site' + ico('seta') + '</button></form>';
      } else if (nome === 'montando') {
        var e = achaEstilo(st.estilo);
        html = '<div class="est-cartao est-montando" role="status"><b>Montando o seu site…</b><ul>' +
          '<li>Colocando o nome ' + esc(r.nome) + '</li>' +
          '<li>Escrevendo os textos de ' + esc((r.ramo === 'outro' && r.outro) ? r.outro.toLowerCase() : RAMOS[r.ramo].rotulo.toLowerCase()) + '</li>' +
          '<li>Aplicando o estilo ' + e.nome + '</li></ul></div>';
      }
      veu.innerHTML = html;
      veu.classList.toggle('is-on', !!nome);
      veu.classList.toggle('is-convite', nome === 'convite');
      // enquanto o veu cobre a previa, o Tab nao entra nela
      if (nome && nome !== 'convite') site.setAttribute('inert', '');
      else site.removeAttribute('inert');
      var foco = nome === 'ramo'
        ? veu.querySelector('.est-ramo.is-on') || veu.querySelector('.est-ramo')
        : veu.querySelector('input');
      if (foco) { try { foco.focus({ preventScroll: true }); } catch (x) { foco.focus(); } }
    }

    function concluir() {
      var r = st.rascunho;
      st.dados = { nome: r.nome.trim(), ramo: r.ramo, outro: (r.outro || '').trim(), cidade: (r.cidade || '').trim() };
      // o sistema de exemplo (sistema/sistema.js), mais abaixo, abre com o
      // mesmo nome e ramo: "o site e o sistema do SEU negocio"
      window.ACTechPrevia = st.dados;
      try { document.dispatchEvent(new CustomEvent('actech:previa', { detail: st.dados })); } catch (x) {}
      etapa('montando');
      setTimeout(function () {
        etapa(null);
        desenhar(true);
        fala('Pronto: prévia do site de ' + st.dados.nome + ' no estilo ' + achaEstilo(st.estilo).nome + '.');
        try { site.focus({ preventScroll: true }); } catch (x) {}
      }, reduzido() ? 300 : 1500);
    }

    /* ---- eventos ---- */
    function noClique(ev) {
      var t = ev.target;
      var b;
      if ((b = t.closest('.est-opcao'))) {
        escolher(b.dataset.estilo);
        return;
      }
      if ((b = t.closest('[data-disp]'))) {
        st.disp = b.dataset.disp;
        aplicaModo();
        raiz.querySelectorAll('[data-disp]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        return;
      }
      if (t.closest('[data-comecar]')) { etapa('nome'); return; }
      if (t.closest('[data-fechar]')) { etapa(st.dados ? null : 'convite'); return; }
      if (t.closest('[data-voltar]')) { etapa(st.etapa === 'cidade' ? 'ramo' : 'nome'); return; }
      if (t.closest('[data-trocar]')) {
        moldura.scrollIntoView({ block: 'center', behavior: reduzido() ? 'auto' : 'smooth' });
        etapa('nome');
        return;
      }
      if ((b = t.closest('[data-ramo]'))) {
        st.rascunho.ramo = b.dataset.ramo;
        veu.querySelectorAll('[data-ramo]').forEach(function (x) {
          var on = x === b;
          x.classList.toggle('is-on', on);
          x.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        var outro = veu.querySelector('.est-outro');
        outro.hidden = b.dataset.ramo !== 'outro';
        veu.querySelector('[type=submit]').disabled = false;
        if (!outro.hidden) outro.querySelector('input').focus();
        return;
      }
      // --- dentro do mini-site ---
      if (!site.contains(t)) return;
      if ((b = t.closest('[data-ir]'))) {
        var alvo = site.querySelector('[data-sec="' + b.dataset.ir + '"]');
        if (alvo) site.scrollTo({ top: alvo.offsetTop - 8, behavior: reduzido() ? 'auto' : 'smooth' });
        return;
      }
      if ((b = t.closest('[data-sel]'))) {
        var grupo = b.dataset.sel;
        site.querySelectorAll('[data-sel="' + grupo + '"]').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        if (grupo === 'hora') aviso('Horário escolhido. No site de verdade, a confirmação chega na hora pro seu cliente.');
        return;
      }
      if ((b = t.closest('[data-coracao]'))) {
        b.classList.toggle('is-on');
        return;
      }
      if (t.closest('[data-acao]')) {
        aviso('No site de verdade, este botão leva o cliente direto pro seu WhatsApp ou pra sua agenda.');
      }
    }

    function noEnvio(ev) {
      var f = ev.target.closest('[data-form]');
      if (!f) return;
      ev.preventDefault();
      var r = st.rascunho;
      var k = f.dataset.form;
      if (k === 'nome') {
        var n = f.elements.nome.value.trim();
        if (!n) { f.elements.nome.focus(); return; }
        r.nome = n;
        etapa('ramo');
      } else if (k === 'ramo') {
        if (!r.ramo) return;
        if (r.ramo === 'outro') r.outro = f.elements.outro.value.trim();
        etapa('cidade');
      } else if (k === 'cidade') {
        r.cidade = f.elements.cidade.value.trim();
        concluir();
      }
    }

    // setas andam entre os estilos, como manda um radiogroup
    function noTeclado(ev) {
      if (!ev.target.closest('.est-lista')) {
        if (ev.key === 'Escape' && st.etapa && st.etapa !== 'convite' && st.etapa !== 'montando') etapa(st.dados ? null : 'convite');
        return;
      }
      var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
      if (!d) return;
      ev.preventDefault();
      var i = opcoes.findIndex(function (b) { return b.dataset.estilo === st.estilo; });
      var alvo = opcoes[(i + d + opcoes.length) % opcoes.length];
      escolher(alvo.dataset.estilo);
      alvo.focus();
    }

    function escolher(id) {
      if (id === st.estilo) return;
      st.estilo = id;
      desenhar(true);
      fala('Estilo ' + achaEstilo(id).nome + '.');
      // no celular a lista rola de lado: traz a opcao escolhida pro meio
      var b = lista.querySelector('[data-estilo="' + id + '"]');
      if (b && lista.scrollWidth > lista.clientWidth) {
        lista.scrollTo({ left: b.offsetLeft - (lista.clientWidth - b.offsetWidth) / 2, behavior: reduzido() ? 'auto' : 'smooth' });
      }
    }

    function aviso(txt) {
      var a = $('[data-aviso]');
      a.textContent = txt;
      a.classList.add('is-on');
      clearTimeout(tiraAviso);
      tiraAviso = setTimeout(function () { a.classList.remove('is-on'); }, 3200);
    }
    function fala(txt) { $('[data-fala]').textContent = txt; }

    raiz.addEventListener('click', noClique);
    raiz.addEventListener('submit', noEnvio);
    raiz.addEventListener('keydown', noTeclado);

    aplicaModo();
    desenhar(false);
    etapa(st.etapa);

    var api = {
      destruir: function () {
        raiz.removeEventListener('click', noClique);
        raiz.removeEventListener('submit', noEnvio);
        raiz.removeEventListener('keydown', noTeclado);
        if (estreita.removeEventListener) estreita.removeEventListener('change', mudouTela);
        clearTimeout(tiraAviso);
        raiz.__estilos = null;
      }
    };
    raiz.__estilos = api;
    return api;
  }

  function reduzido() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  window.ACTechEstilos = { montar: montar, fontes: FONTES, estilos: ESTILOS, ramos: RAMOS };
})();
