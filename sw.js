/* Service worker: faz o site funcionar sem internet, no celular e no PC.

   O que ele NÃO resolve, e é bom saber antes de confiar:
   - Precisa de UMA visita com internet antes. Aparelho que nunca abriu o
     site não tem o que servir offline.
   - Checkout do Mercado Pago, links de WhatsApp e o pixel da Meta são de
     fora: sem rede, não funcionam. O resto da página funciona.

   Estratégia, por tipo de pedido:
   - Páginas (navegação): rede primeiro, cache como rede de segurança. Assim
     uma publicação nova aparece na hora quando há sinal, e a loja sem sinal
     ainda abre.
   - Arquivos (imagem, fonte, js, css): cache primeiro e atualiza por trás.
     São versionados pelo deploy e não mudam no meio do dia.
*/

var VERSAO = 'actech-v4';
var C_CASCA = VERSAO + '-casca';
var C_USO = VERSAO + '-uso';

/* O kit de venda: o que precisa estar garantido offline mesmo que o Amon
   nunca tenha aberto a apresentação naquele aparelho. São ~700 KB. */
var CASCA = [
  'apresentar.html',
  'index.html',
  'obrigado.html',
  '404.html',
  'offline.html',
  'manifest.webmanifest',
  'fontes/fontes.css',
  'fontes/dm-sans-400.woff2',
  'fontes/dm-sans-500.woff2',
  'fontes/dm-sans-700.woff2',
  'fontes/plus-jakarta-sans-500.woff2',
  'fontes/plus-jakarta-sans-600.woff2',
  'fontes/plus-jakarta-sans-700.woff2',
  'fontes/plus-jakarta-sans-800.woff2',
  'imgs/marca.webp',

  /* O que faz o site principal FUNCIONAR, não só aparecer. Sem estes, o
     index abria offline com o esqueleto do HTML e nada respondia: sem abas,
     sem carrossel, sem prévia de site, sem calculadora. */
  'support.js',
  'vendor/react-18.3.1.min.js',
  'vendor/react-dom-18.3.1.min.js',
  'vendor/gsap-3.12.5.min.js',
  'vendor/qrcode-1.4.4.min.js',
  'estilos/estilos.css',
  'estilos/estilos.js',
  'sistema/sistema.css',
  'sistema/sistema.js',
  'extras/extras.css',
  'extras/calculadora.js',
  'imgs/plano-glow.webp',
  'imgs/plano-blobs-1.webp',
  'imgs/plano-blobs-2.webp',
  'imgs/plano-blobs-1-verde.webp',
  'imgs/plano-blobs-2-verde.webp',
  /* As duas fotos de cada ramo: a previa agora rola e mostra as duas. */
  'imgs/ramos/roupa-1.webp',      'imgs/ramos/roupa-2.webp',
  'imgs/ramos/barbearia-1.webp',  'imgs/ramos/barbearia-3.webp',
  'imgs/ramos/salao-1.webp',      'imgs/ramos/salao-2.webp',
  'imgs/ramos/maquiagem-1.webp',  'imgs/ramos/salao-3.webp',
  'imgs/ramos/mercado-1.webp',    'imgs/ramos/mercado-2.webp',
  'imgs/ramos/petshop-1.webp',    'imgs/ramos/petshop-2.webp',
  'imgs/ramos/restaurante-1.webp','imgs/ramos/restaurante-2.webp',
  'imgs/ramos/clinica-1.webp',    'imgs/ramos/clinica-2.webp',
  'imgs/ramos/outro-1.webp',      'imgs/ramos/outro-2.webp'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(C_CASCA).then(function (c) {
      /* Um por vez em vez de addAll: com addAll, um único arquivo que falhe
         derruba a instalação inteira e o site fica sem offline nenhum. */
      return Promise.all(CASCA.map(function (u) {
        return c.add(u)['catch'](function (err) {
          console.warn('[sw] nao consegui guardar', u, err);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.map(function (n) {
        if (n.indexOf(VERSAO) !== 0) return caches['delete'](n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  // só o que é deste site; checkout, WhatsApp e pixel passam direto
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copia = res.clone();
        caches.open(C_USO).then(function (c) { c.put(req, copia); });
        return res;
      })['catch'](function () {
        return caches.match(req, { ignoreSearch: true }).then(function (r) {
          return r || caches.match('apresentar.html').then(function (a) {
            return a || caches.match('offline.html');
          });
        });
      })
    );
    return;
  }

  /* ignoreSearch: o site pede estilos.js?v=3 e extras.css?v=2 pra furar o
     cache do GitHub Pages. Guardamos sem a query; sem isto dava miss e a
     prévia de site não montava offline. */
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (guardado) {
      var daRede = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copia = res.clone();
          caches.open(C_USO).then(function (c) { c.put(req, copia); });
        }
        return res;
      })['catch'](function () { return guardado; });
      return guardado || daRede;
    })
  );
});
