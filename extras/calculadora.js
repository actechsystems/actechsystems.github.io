/* ===================================================================
   "Quando o plano se paga?" -- a conta, agora mexivel.

   Era um bloco parado (R$ 359,99 / R$ 50 = 8 clientes) com um "troque pelo
   seu ticket". Agora a pessoa troca de verdade: plano, ticket medio, quantas
   vezes o cliente volta no mes e quantos clientes novos ela espera. So usa
   o que ela mesma informa -- nenhuma estatistica inventada. Se ela montou a
   previa de site, os valores iniciais vem do ramo dela.

   PRECOS: batem com os cards de #planos. Mudou la, muda aqui (PLANOS).
   =================================================================== */
(function () {
  'use strict';
  var PLANOS = [['Essencial', 359.99], ['Completo', 597.99]];
  // ponto de partida por ramo: [ticket medio, vezes por mes]
  var RAMO = {
    barbearia: [45, 1, 'barbearia'], salao: [80, 1, 'salão'], petshop: [55, 2, 'pet shop'], clinica: [180, 1, 'clínica'],
    restaurante: [30, 4, 'restaurante'], mercado: [90, 4, 'mercado'], outro: [150, 1, '']
  };
  var FREQ = [[1, '1 vez'], [2, '2 vezes'], [4, 'Toda semana']];
  var fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  function real(v) { return fmt.format(Math.round(v)); }
  // preco de plano sai com centavos, igual ao card: R$ 359,99 e nao R$ 360
  var fmtC = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  function centavos(v) { return fmtC.format(v); }

  function montar(raiz) {
    if (!raiz || raiz.__calc) return;
    var st = { plano: 0, ticket: 50, freq: 1, novos: 8, ramo: '' };
    function doRamo() {
      var p = window.ACTechPrevia;
      if (p && RAMO[p.ramo]) { st.ticket = RAMO[p.ramo][0]; st.freq = RAMO[p.ramo][1]; st.ramo = RAMO[p.ramo][2]; return true; }
      return false;
    }
    doRamo();

    raiz.innerHTML =
      '<div class="calc-grade">' +
        '<div class="calc-campos">' +
          '<div class="calc-campo"><span class="calc-rot">Plano</span><div class="calc-seg" role="radiogroup" aria-label="Plano">' +
            PLANOS.map(function (p, i) { return '<button type="button" role="radio" data-plano="' + i + '">' + p[0] + '<small>' + centavos(p[1]) + '/mês</small></button>'; }).join('') + '</div></div>' +
          '<label class="calc-campo"><span class="calc-rot">Quanto um cliente gasta por visita <b data-out="ticket"></b></span>' +
            '<input type="range" min="10" max="500" step="5" data-in="ticket" aria-label="Ticket médio em reais" /></label>' +
          '<div class="calc-campo"><span class="calc-rot">Quantas vezes ele volta no mês</span><div class="calc-seg" role="radiogroup" aria-label="Frequência">' +
            FREQ.map(function (f) { return '<button type="button" role="radio" data-freq="' + f[0] + '">' + f[1] + '</button>'; }).join('') + '</div></div>' +
          '<label class="calc-campo"><span class="calc-rot">Clientes novos por mês que você espera <b data-out="novos"></b></span>' +
            '<input type="range" min="1" max="40" step="1" data-in="novos" aria-label="Clientes novos por mês" /></label>' +
          '<p class="calc-ramo" data-ramo></p>' +
        '</div>' +
        '<div class="calc-res" aria-live="polite">' +
          '<span class="calc-res-rot">O plano se paga com</span>' +
          '<b class="calc-grande" data-out="paga"></b>' +
          '<div class="calc-barras">' +
            '<div><span>Custo do plano</span><i class="calc-barra calc-barra--custo" data-barra="custo"></i><b data-out="custo"></b></div>' +
            '<div><span>Entra a mais no caixa</span><i class="calc-barra calc-barra--entra" data-barra="entra"></i><b data-out="entra"></b></div>' +
          '</div>' +
          '<p class="calc-sobra" data-out="sobra"></p>' +
        '</div>' +
      '</div>' +
      '<p class="calc-pe">É um exemplo de como pensar o investimento, com os números que você mesmo colocou, não uma promessa de resultado. E ainda sem contar que o cliente que chega este mês continua voltando nos próximos.</p>';

    var $ = function (s) { return raiz.querySelector(s); };
    function desenhar() {
      var plano = PLANOS[st.plano][1];
      var porCliente = st.ticket * st.freq;
      var paga = Math.ceil(plano / porCliente);
      var entra = st.novos * porCliente;
      var sobra = entra - plano;
      raiz.querySelectorAll('[data-plano]').forEach(function (b) { var on = +b.dataset.plano === st.plano; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
      raiz.querySelectorAll('[data-freq]').forEach(function (b) { var on = +b.dataset.freq === st.freq; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
      $('[data-in="ticket"]').value = st.ticket; $('[data-in="novos"]').value = st.novos;
      $('[data-out="ticket"]').textContent = real(st.ticket);
      $('[data-out="novos"]').textContent = st.novos;
      $('[data-out="paga"]').textContent = paga + (paga === 1 ? ' cliente novo' : ' clientes novos');
      $('[data-out="custo"]').textContent = centavos(plano);
      $('[data-out="entra"]').textContent = real(entra);
      var max = Math.max(plano, entra);
      $('[data-barra="custo"]').style.width = (plano / max * 100) + '%';
      $('[data-barra="entra"]').style.width = (entra / max * 100) + '%';
      var s = $('[data-out="sobra"]');
      s.classList.toggle('is-neg', sobra < 0);
      s.innerHTML = sobra >= 0
        ? 'Sobram <b>' + real(sobra) + ' por mês</b>, ' + real(sobra * 12) + ' no ano. Do ' + (paga + 1) + 'º cliente em diante, é lucro.'
        : 'Com ' + st.novos + ' ' + (st.novos === 1 ? 'cliente' : 'clientes') + ' ainda falta ' + real(-sobra) + '. Faltam ' + (paga - st.novos) + ' pra empatar.';
      $('[data-ramo]').textContent = st.ramo ? 'Começamos com valores comuns de ' + st.ramo + ', o ramo que você escolheu na prévia. Ajuste pro seu.' : '';
    }
    raiz.addEventListener('input', function (ev) {
      var k = ev.target.dataset.in; if (!k) return;
      st[k] = +ev.target.value; desenhar();
    });
    raiz.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-plano],[data-freq]'); if (!b) return;
      if (b.dataset.plano != null) st.plano = +b.dataset.plano; else st.freq = +b.dataset.freq;
      desenhar();
    });
    document.addEventListener('actech:previa', function () { if (doRamo()) desenhar(); });
    desenhar();
    raiz.__calc = true;
  }
  window.ACTechCalc = { montar: montar };
})();
