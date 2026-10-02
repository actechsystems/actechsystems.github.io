# Componentes de terceiros usados na landing

A página (`index.html`) roda no runtime `x-dc` do Claude Design: React global,
sem bundler e sem npm. Por isso os componentes abaixo foram **portados** para HTML + CSS + JS
dentro do próprio arquivo, preservando parâmetros e física do original.

Quando isso virar código de verdade (React/Next), troque cada porte pelo componente original —
o visual já está calibrado para a paleta neumórfica.

| Componente | Origem | Onde está no protótipo | Dependência real |
|---|---|---|---|
| Click Effects (modo `sniper`) | Originkit | `setupClickFx()` — overlay `#fx-layer` | `gsap` (já carregado por CDN no `<helmet>`) |
| Hover Image Reveal | Originkit | seção `#servicos`, `setupHoverReveal()` | `framer-motion` (`useSpring`) |
| TestimonialsColumn | shadcn-style | seção `#depoimentos`, classes `.tcols` / `.tcol` / `.tcard` | `motion/react` (`motion.div` com `translateY: -50%`) |
| Liquid Carve Button | Originkit | botão do CTA, `setupGooButton()` | `framer-motion` (`useAnimate`) |
| BlobCard (FluidBlobs + GlowEffect) | shadcn-style | cards de plano, classes `.blob-*` | `FluidBlobs`, `GlowEffect` — **fonte não fornecida** |
| TiltCard (Tilt + ClippedCircle) | unlumen-ui | cards de plano, `setupTilt()` | `Tilt`, `ClippedCircle` — **fonte não fornecida** |
| Mockup iPhone (perfil Instagram) | Mockup iPhone Instagram Customizável | seção `#redes`, classes `.iph*` | nenhuma (os `<image-slot>` viraram `<img>`) |
| Cartão de métrica (hero) | — | seção do hero, classes `.mx*`; dados em `metricaFaixas()` e desenho em `metricaDesenho()` | nenhuma (SVG + CSS) |
| CardSwap | React Bits | seção `#diferenciais`, `setupCardSwap()` | `gsap` |
| TrueFocus | React Bits | título de `#planos`, `setupTrueFocus()` | `motion` |
| DriftWall (parede 3D em marquee) | — | seção `#trabalhos`, classes `.wall` / `.wall-col` / `.wtile` | nenhuma (transform 3D + `@keyframes`) |

## Bibliotecas servidas pelo próprio site (`vendor/`)

React 18.3.1, ReactDOM 18.3.1 e GSAP 3.12.5 ficam em `vendor/` e carregam no `<head>`, antes
do `support.js`. O runtime só busca o React no unpkg.com se `window.React` ainda não existir;
carregado antes, o site deixa de depender de CDN de terceiro. Antes, unpkg fora do ar ou
bloqueado numa rede de empresa deixava a página em branco. Os arquivos são os mesmos do
unpkg: o sha384 bate com o `REACT_SRI`/`REACT_DOM_SRI` do runtime. Testado com unpkg,
jsdelivr e Google Fonts bloqueados: a página monta inteira.

Fontes e GSAP saíram do `<helmet>` do template pro `<head>` de verdade. No helmet o
navegador baixava tudo duas vezes (uma lendo o HTML, outra quando o runtime montava o
helmet). A segunda leitura do `index.html` que continua aparecendo é do próprio runtime:
ele relê o arquivo cru pra recuperar atributos com maiúscula (`onClick`), que o navegador
converte pra minúscula. Não mexer.

A licença do GSAP 3 (sem custo, "Standard License") permite servir o arquivo no próprio site.

## Parâmetros mantidos

- **Click Effects**: `interactionMode="sniper"`, `duration=0.3`, `strokeWidth=2`, `effectSize=90`;
  cor trocada de `#ffffff` para o accent `#6C63FF` (fundo claro).
- **Hover Image Reveal**: `offsetX=200`, `imageWidth=300`, `imageHeight=400`, `rounded=32`.
  `textColor=#3D4852`, `dimColor=#A0AEC0` no lugar do par branco/`#51565A` do tema escuro.
- **TestimonialsColumn** (usado duas vezes — depoimentos e trabalhos): mesma física do original (`translateY: -50%`, `ease: linear`, `repeat: Infinity`),
  em CSS puro — sem JS na seção. `duration` vira `--tdur` por coluna (32s e 26s); a segunda coluna
  usa `animation-direction: reverse` pra rolar ao contrário. A lista é duplicada 2× com
  `padding-bottom` igual ao `gap`, que é o que faz a emenda do loop ficar invisível.
  Avatar por foto trocado por iniciais em baixo-relevo: zero requisição extra.
  O grid usa `align-items: start`: sem isso ele estica a coluna mais curta até a altura da mais
  alta e o `-50%` deixa de bater com uma volta do conteúdo — a emenda pula.
- **DriftWall**: cinco colunas em `rotateX(16deg) rotateY(-14deg) rotateZ(-3deg) scale(1.14)`,
  `perspective: 1200px`, profundidade por coluna em `--tz` (0 / -40 / -80 / -40 / 0). O mesmo
  `@keyframes tscroll` dos depoimentos move cada faixa, com duração e sentido próprios (42s a 62s).
  A profundidade fica no `.wall-col` e a animação no `.wall-lane` de dentro — as duas no mesmo
  elemento brigariam pelo `transform`. Cada coluna mostra a lista inteira girada pelo seu índice,
  então duas vizinhas nunca ficam iguais e todas têm a mesma altura. As bordas dissolvem num
  `::after` com dois gradientes até `var(--bg)`, sem moldura.
- **Liquid Carve Button**: `smoothness=55`, `squash` até `1.6`, `GOO_STRENGTH=8`.
  Raio da bolha reduzido de 50 para 34 — num botão de 64px de altura, 50 comia metade da pílula.
- **BlobCard**: `headerHeight=224`; paleta trocada para azul, como pedido —
  `#2B4BFF`, `#3B82F6`, `#60A5FA`, `#6C63FF`; glow em `#93C5FD → #A5B4FC → #2B4BFF`.
- **TiltCard**: `rotationFactor=11`.
- **CardSwap**: `cardDistance=60`, `verticalDistance=70`, `delay=5000`, `skewAmount=6`,
  `easing="elastic"`. Card 320×200 (o padrão 500×400 não cabe na coluna).

## Mockup do iPhone (`#redes`)

Porte do zip "Mockup iPhone Instagram Customizável", com três mudanças:

- Os `<image-slot>` (componente de upload do editor) viraram `<img>` apontando para
  `imgs/insta-*.webp`, então nada de `image-slot.js` aqui.
- O `zoom: .55` do original virou `scale()` dentro do `transform` 3D — `zoom` mexe no layout
  e empurraria a coluna; `scale` só desenha. O aparelho é posicionado absoluto e centrado
  dentro do `.iph-palco`, que é quem segura a altura na página.
- A sombra saiu do marrom do mockup (fundo bege) para a cinza-azulada da página.

Os ângulos (`rotateY(-22deg) rotateX(6deg) rotateZ(-6deg)`) e a moldura são os do original.
O tamanho é o `--iph-esc`: `.80` no desktop, `.68` até 900px, `.57` no celular.

**Conteúdo:** o perfil é o da própria ACTech e as artes são as reais, de `imgs2/`.
A ordem da grade é embaralhada de propósito (artes coloridas e escuras alternadas) —
em ordem de arquivo a grade fica com um bloco azul embaixo e um preto em cima.
São 8 artes em 12 quadros: as quatro últimas repetem para fechar a grade, senão sobra
meia fileira vazia no meio da tela.

> **@ e números são exemplo.** Os números (1.240 seguidores, 318 seguindo) estão chumbados
> no HTML da seção; o @ vem de `instagramUser` e é o mesmo dos links de contato. Trocar
> pelos reais antes de publicar — é o perfil de vocês na página de vocês.

## Cartão de métrica do hero

Substituiu os anéis neumórficos. O visual é o de um painel de cotação: número grande,
variação, seletor de período (1M / 3M / 6M / 1A), linha com área, base tracejada,
barras de volume e eixos.

- **Os números são ilustrativos.** Estão em `metricaFaixas()` — `total`, `delta`, `escala`,
  `subida` e os rótulos do eixo de baixo. O rodapé do cartão diz "Exemplo ilustrativo" de
  propósito: sem isso o gráfico se lê como resultado real de cliente.
- A curva usa ruído com semente fixa, não `Math.random`: sem isso o gráfico se redesenharia
  a cada re-render (abrir o menu, responder o quiz).
- `delta` e a base tracejada são a mesma coisa: a linha pontilhada é o ponto de partida e o
  `delta` é o quanto a curva subiu dali até a ponta.
- **Só linha e área são SVG.** Grade, base, ponto e barras são HTML posicionado por
  porcentagem, porque o parser do navegador recusa `{{ }}` em atributo de SVG (`cx`, `x`,
  `width`...) e joga erro no console antes da hidratação — em `style` ele aceita numa boa.
  Pelo mesmo motivo os rótulos dos eixos não são `<text>`: o runtime embrulha todo `{{ }}`
  num `<span>`, e um `<span>` dentro de `<svg>` não desenha nada.
- O `key="{{ mxFaixa }}"` no `<path>` é o que faz o traço se redesenhar ao trocar de período:
  mudando a key, o React remonta o elemento e a animação roda de novo.

## Ficha do Google e "a conta" (`#google` e `#planos`)

- **Antes e depois da ficha** (`#google`): as duas fichas são HTML montado à mão, não captura
  de cliente — dá pra editar item por item. A da esquerda usa `--nm-in` (afundada, cinza) e a
  da direita `--nm-out` (em relevo, branca): a hierarquia é a própria física da página.
  Dentro dos cartões a tipografia é Roboto e as cores são as do Google (`#1A73E8`, `#FBBC04`,
  `#188038`), porque ali a ilusão tem que ser de painel do Google, não de página nossa.
- **Tráfego pago saiu (ADS OFF)**: a ACTech não cuida mais de Google Ads / Meta Ads. Nada
  foi apagado — a faixa de plataformas, o painel do post patrocinado, o CSS dos dois, o item
  do plano Completo e a pergunta do FAQ sobre "verba de anúncio separada" estão comentados
  e marcados com `ADS OFF` no `index.html`. São sete pontos; o comentário grande do CSS
  (`.ads-faixa`) lista todos. Pra religar, é tirar os comentários desses sete.
- **A conta do padeiro** (fim de `#planos`): `R$ 197 ÷ R$ 50 = 4 clientes`. Os dois números
  de entrada estão no HTML da seção; se o preço do plano mudar, o resultado **não** se
  recalcula sozinho — é texto. O ticket de R$ 50 é o chute que faz fechar em 4.
  A letra miúda existe de propósito: sem ela a conta vira promessa de resultado.
- **Sozinho x com a ACTech** (`#sozinho`, entre `#planos` e `#diferenciais`): responde a
  objeção que vem depois do preço — "isso eu mesmo faço". Dois painéis com o mesmo mês:
  o da esquerda afundado (`--nm-in`, cinza), o da direita em relevo (`--nm-out`, roxo),
  a mesma física do antes/depois da ficha. As linhas **não** se alinham pixel a pixel;
  o par é feito pelo `data-tema`, e `setupDuelo()` acende as duas ao passar o mouse.
  Não tem `tabindex`: o realce é decorativo e dez paradas de tabulação só atrapalhariam.
  O medidor de horas embaixo só enche quando entra na tela. As 14h são estimativa, e a
  letra miúda diz isso — mesma regra da conta do padeiro.
- **Cabeçalho**: dois caminhos no topo — "Ver planos" (secundário, âncora pra `#planos`)
  para quem quer preço antes de conversa, e "Fale com a gente" (primário, WhatsApp).
  O link de texto "Planos" saiu do menu: com o botão do lado, era o mesmo destino duas vezes.

## Desempenho

A página junta muita coisa cara ao mesmo tempo: sete faixas em loop, quatro blobs sob
`blur`, um glow girando e uma parede 3D com 40 quadros. Três regras seguram isso:

1. **Anima só o que está na tela.** `setupPausar()` põe `fora-de-vista` em cada bloco
   marcado com `data-anima` (faixa de segmentos, planos, depoimentos, trabalhos) e o CSS
   pausa as animações lá dentro. Volta a rodar 200px antes de reaparecer, então ninguém
   flagra a faixa parada. Pausar não desalinha o loop: ele retoma de onde estava.
2. **Modal aberto congela o fundo.** `lockScroll()` põe `modal-aberto` no `<body>`.
   Por baixo de um `backdrop-filter`, cada quadro do fundo obriga o navegador a
   refazer o desfoque da tela inteira.
3. **Uma escrita por quadro no tilt.** O ponteiro dispara bem mais que 60 eventos por
   segundo; antes cada um media o card (`getBoundingClientRect`, que força layout) e
   escrevia o `transform`. Agora mede uma vez no `pointerenter` e escreve uma vez por
   quadro via `requestAnimationFrame` — 120 eventos viram 1 escrita de estilo.

Também: `renderVals()` roda inteiro a cada `setState` (e o quiz dispara um por resposta),
então o que não muda passou por `memo()` — perguntas, ícones, os 40 quadros da parede,
a curva do gráfico por faixa. E os raios de blur caíram um pouco (`.fluid` 50→40px,
glow 26→21px): o custo cresce com o raio e a diferença não aparece.

### O desfoque dos cards de plano virou textura

Era o gargalo da página inteira. Medido no cartão de preço, com a seção na tela:

| | antes | depois |
|---|---|---|
| Elementos com `filter` vivo animando | 4 | 0 |
| Área redesenhada por quadro | ~10,4 milhões de px | 0 |

O glow sozinho era um `conic-gradient` de ~2.200 × 2.250px sob `blur(21px)` girando sem
parar, **em cada um dos dois cards** — uns 15 MB de textura por card, pra aparecer uns 2px
de borda colorida. E os quatro blobs animavam dentro de um `filter: blur(40px)`, o que
obriga o navegador a refazer o desfoque da área toda a cada quadro.

Agora o desfoque vem pronto em três WebP somando 6 KB:

- `imgs/plano-blobs-1.webp` e `-2.webp` — as mesmas elipses de antes, desenhadas e
  desfocadas uma vez. Na página, duas camadas que trocam de opacidade e deslizam.
- `imgs/plano-glow.webp` — o anel do conic-gradient, já desfocado, girando.

`opacity` e `transform` o compositor resolve sozinho, sem repintar. Para regerar as
texturas (mudou cor, mudou tamanho), os dois scripts que as desenham estão no histórico
deste commit — são uns 30 linhas de Pillow cada.

**Efeitos com timer** (TrueFocus nos planos, CardSwap nos diferenciais) passaram a
consultar `podeAnimar()`: fora da tela ou com o modal aberto, o tique não faz nada.
Só a classe `fora-de-vista` não resolvia isso — ela pausa animação de CSS, não `setInterval`.

### Os cinco painéis de `#servicos`

Os mockups em SVG saíram. No lugar entraram cinco painéis montados com material da
própria ACTech — capturas dos sistemas e as artes reais do Instagram, os mesmos arquivos
que `#trabalhos` e `#redes` já carregam, então não pesou um byte a mais:

| Item | O painel |
|---|---|
| Sites que vendem | moldura de navegador com a home de um cliente + "no ar em 5 dias" |
| Redes sociais ativas | celular com a grade do perfil |
| Google Meu Negócio | a ficha, no estilo do painel do Google |
| Manutenção e suporte | painel do sistema + conversa de aprovação |

> O painel de anúncios (post patrocinado + contagem de cliques) era o quarto desta lista
> e está comentado com `ADS OFF`. Os painéis casam com os itens da lista **pela ordem** em
> que aparecem no HTML, não pelo número em `data-slide` / `data-item` — por isso comentar
> os dois (painel e item) de uma vez mantém tudo alinhado. Se religar um, religue o outro.

Os mesmos quatro existem como pranchas no canvas do Claude Design (`Painéis O Que Fazemos`),
que é onde dá pra mexer neles no olho e exportar PNG. Os arquivos-fonte `.dc.html` são
irmãos deste formato — o projeto todo roda no mesmo runtime `x-dc`.

O quadro muda de proporção (300×400 no desktop, 420×300 no celular), então nada aqui tem
tamanho fixo: a peça principal cresce com `flex: 1` e as imagens recortam com `object-fit`.
O texto dentro do celular mede em `cqw` (container query) porque em px ele estourava quando
o aparelho encolhia para 100px de largura.

### Contato

Duas portas, nesta ordem de prioridade: WhatsApp (botão do topo, hero, planos, CTA final e
o flutuante) e Instagram como alternativa para quem não quer puxar conversa — botão "Ver o
perfil" em `#redes`, "ou chama no direct" embaixo do CTA final e o chip no rodapé.

O número e o @ ficam nos campos de Contato (`whatsappNumber`, `instagramUser`) e viram
`whatsUrl` / `instaUrl` num lugar só do estado: trocar o @ é uma linha, e os três links
acompanham.

## Pendências de conteúdo

- **"Ilimitadas" saiu**: o Completo dizia "atualizações ilimitadas no site" e agora diz
  "4 atualizações de conteúdo por mês" — o Essencial tem 1, então a escada fica clara sem
  precisar de letra miúda. Quando o contrato existir, vale definir lá o que conta como
  atualização.
- **Depoimentos — seção desligada**: os seis depoimentos eram exemplo, com nome e negócio
  inventados, e por isso a seção saiu do ar antes da publicação. Ela está guardada inteira
  num `<script type="text/html" data-depoimentos-desligados>`, e não num comentário HTML,
  porque o bloco tem um comentário dentro dele e vários `--` (`--tdur`, `tcol--down`) —
  comentário aninhado quebraria o parser. Script de tipo desconhecido o navegador não
  renderiza, não carrega imagem e o runtime não percorre.

  Pra religar: troque texto, nome e negócio de cada `.tcard`, lembrando que **cada card
  aparece duas vezes** (a duplicata é o que fecha a emenda do loop), e apague as linhas do
  `<script>` e do `</script>`. O CSS `.tcols` / `.tcard` ficou de pé de propósito.

  Duas ou três depoimentos reais já resolvem — a coluna rola em loop e repete os cards.
- **Instagram**: o perfil é **@actech.systems**. As artes vêm de `imgs2/`, convertidas para
  WebP quadrado de 520px em `imgs/insta-N.webp`:
  - `insta-1..8` — as artes de maio/2026
  - `insta-9..16` — o caso do painel de indicadores do banco (set/2026): `carrossel-01..06`,
    `post-12-indicadores` e `post-dia30-dia1`

  As grades mostram as novas primeiro, como num perfil de verdade. Os originais são 1080×1350
  (4:5) e a célula da grade é quadrada, então o recorte é **central** — o mesmo que o
  `object-fit: cover` faria. Confira o recorte ao acrescentar arte nova: título muito no topo
  ou muito no pé fica de fora.

  Os números do perfil (`.iph-nums`) são os **reais** do @actech.systems, não chute — quem
  clica no link do rodapé confere em um segundo. Reconferir quando mudarem.

  A pasta `imgs2/` é só arquivo-fonte; não é referenciada por nada no HTML.
- **Sigilo**: nenhum nome de cliente aparece em `#trabalhos` — nem no texto, nem na barra de
  endereço da moldura (`cliente.com.br/...`). Nas capturas em `imgs/`, as marcas foram apagadas
  (logo borrado, nome removido do subtítulo). Os arquivos originais estão no histórico do git.
  Ao acrescentar um trabalho, confira a captura antes: o nome costuma aparecer em logo, título e
  rodapé.
- **Logo e card social**: o logo real está em `imgs2/logo.jpeg`, num quadrado de 1024px
  com fundo branco. Dele saíram dois arquivos:
  - `imgs/marca.webp` — só o símbolo (o "A"), sem o fundo. O logo completo traz "Python" e
    "Java" escritos embaixo, que não dizem nada pra quem veio comprar site pra padaria.
    O fundo branco saiu por preenchimento a partir da borda, não por teste de cor: o brilho
    azul em volta do DNA não é branco neutro, e um teste de cor ou deixava o halo ou comia
    a tela do celular junto. O que separa os dois é a topologia — o halo encosta na borda,
    as telas estão trancadas dentro de um contorno escuro.
  - `imgs/og.png` — o card 1200×630 que aparece quando alguém cola o link no WhatsApp.
    A URL no `og:image` é **absoluta** (`https://amontimo7.github.io/...`) porque raspador
    de rede social não resolve caminho relativo. Se o domínio mudar, muda lá também.

  O símbolo **não** virou favicon: a 16px e 32px ele vira borrão (testado). O favicon
  segue sendo o `< >` em SVG, que é nítido em qualquer tamanho.
- **Imagens**: as duas seções usam material real de `imgs/`. Se um dia entrarem fotos de
  verdade (a loja, a equipe, o cliente usando o sistema), elas caem nos mesmos lugares —
  `.srv-visual img` em `#servicos` e as capturas da parede em `#trabalhos`.

## Cor

A página era um mar de cinza. Tingir seções inteiras foi tentado e **descartado** — o
bege/pêssego sujava tudo. O que ficou:

### A aurora

Manchas de cor derivando devagar atrás de tudo (`.aurora`, quatro `<i>`). Duas regras que
esta página já aprendeu na marra:

1. **Nada de `filter: blur()`.** Foi exatamente isso que travava os cards de plano antes —
   o navegador refaz o desfoque da área inteira a cada quadro. `radial-gradient` com parada
   transparente já nasce macio, de graça.
2. **Só `transform` e `opacity` animam.** O compositor resolve os dois sozinho, sem repintar.
   Medido: 60fps com as quatro manchas rodando.

A camada é fixa em `z-index: 0`; as seções estão em `z-index: 1` e os cards são opacos, então
a cor só aparece nos vãos — que é onde estava o cinza. Pausa junto com o resto quando o modal
abre.

> **O véu (`.aurora::after`) não é enfeite, é o que torna a aurora viável.** Sem ele, duas
> manchas que se cruzam empilham alpha e o texto de corpo despencava para **1,95:1** —
> ilegível. Como o véu é a própria cor da página por cima de tudo, ele estabelece um **piso**:
> nenhuma combinação de manchas escurece além dali, não importa onde a animação leve cada uma.
> Medido com o `--muted` atual: **4,94** no cinza limpo, **4,14** sob uma mancha, **3,72** no
> pior empilhamento possível. **Mexeu no alpha das manchas ou no véu, refaça a conta.**

### O texto escureceu junto

A conta acima revelou um problema que já existia: `--muted: #6B7280` dava **3,82:1** contra o
próprio cinza da página — já reprovava em 4,5 antes de existir aurora. Virou `#59616E`
(**4,94**). Como havia **40 ocorrências chumbadas** no HTML contra 24 usando o token, a troca
foi na marra nos dois. `--placeholder` foi de `#A0AEC0` para `#7F8898` pelo mesmo motivo
(1,78 → 2,82); segue abaixo de 4,5, mas é letra miúda decorativa.

### A roda de cor

Oito matizes em `:root`, **três valores cada**, e a divisão não é capricho:

| token | pra quê | mínimo |
|---|---|---|
| `--cN` | a versão viva — só ícone e gráfico | 3:1 |
| `--tN` | a mesma cor escurecida até passar como **texto** | 4,5:1 |
| `--fN` | o fundo pálido do ladrilho | — |

O `--tN` foi derivado escurecendo o matiz até passar 4,5:1 **no pior empilhamento da aurora**,
não só no cinza limpo — por isso todos batem ~6,0 no cinza e ~4,5 sob a aurora.

> **Trocar um `--tN` pelo `--cN` correspondente parece inofensivo e reprova o contraste na
> hora:** as vivas ficam entre 2,0 e 3,1 sobre a aurora. Foi essa conta que mostrou que os
> eyebrows já reprovavam antes, no roxo #6C63FF (3,41).

Onde a roda é usada: cada **opção do quiz** (pela posição na grade), cada **eyebrow** de seção,
os quatro **ícones de "Por que ACTech"**, e o **check de cada plano**, que acompanha a cor do
próprio card — verde-água no Essencial, roxo no Completo.

### O diagnóstico com movimento

Tudo anima **só `transform` e `opacity`**, que o compositor resolve sem repintar. Nada de
animar `box-shadow` ou `width` — essa página já pagou essa conta uma vez nos cards de plano.
Medido: 60fps com tudo rodando.

- **As opções entram em cascata**, 40ms de atraso entre uma e outra (`:nth-child`), em vez de
  todas de uma vez.
- **O hover tinge o cartão inteiro** na cor da opção, e o ladrilho gira e cresce um pouco.
- **A barra de progresso tem um brilho** que corre por dentro, em loop.
- **O anel da nota se desenha** em vez de aparecer pronto. Com `stroke-dasharray` fixo em
  389,6 (a circunferência), quem controla quanto aparece é o `stroke-dashoffset` — 389,6
  esconde tudo, 0 mostra o anel inteiro. O valor final vai inline em `--off`.
- **A nota sobe de 0** junto com o anel (`contarNota()`), com a mesma desaceleração cúbica,
  pra os dois chegarem juntos. Um número que aparece pronto não tem peso; subindo, ele vira o
  momento do funil. O método checa `prefers-reduced-motion` e sai fora sem animar.
- **O anel de "analisando" passeia pela roda de cor** enquanto pensa.
- **A cor da pergunta banha o alto do painel** num radial suave.

> As animações em CSS já são cobertas pela regra global de `prefers-reduced-motion`, que zera
> `animation` na página inteira. O `contarNota()` é JS e por isso tem a checagem própria.

### Cor que carrega informação

`icon()` e `ico()` usam `currentColor` — quem manda na cor é o recipiente.

- **Cada pergunta do quiz tem seu tom.** A classe `q0..q9` vai no `.modal-panel`, não na
  grade: a barra de progresso é irmã da grade e não enxergaria a variável de lá. Só enquanto
  pergunta. No formato cartão o tom tinge o ladrilho do ícone; no formato lista o `.pick-ico`
  é o próprio radio, e tingir o fundo dele fazia a opção parecer já escolhida — ali a cor vai
  no anel do radio e numa barra à esquerda da linha.
- **A nota reage ao resultado.** Era sempre roxa; um 22 e um 85 ficavam idênticos. Agora
  vermelho (&lt;40), âmbar (40–67) e verde (≥68), com um chip dizendo a faixa. As faixas são as
  mesmas que decidem o título em `quizResult()` — **mexeu numa, mexa na outra.**

> **Anel vivo, número escuro, de propósito.** O âmbar e o verde vibrantes não passam 3:1
> contra o fundo, o mínimo para um gráfico. Mas o número declara a nota em texto do lado,
> então o anel não é a única fonte da informação e pode puxar saturação. O número usa as
> versões escuras (#C62A2F / #A76800 / #0E7C6F), todas acima de 3:1 como texto grande.

### Um plano de cada cor

O Essencial ficou verde-água (`.blob-card--verde`), o Completo seguiu roxo — é a cor da marca
e ele é o destaque. As texturas verdes são as mesmas de sempre com o matiz girado −55°, salvas
como arquivo. **Não use `hue-rotate` no CSS:** repintaria a área inteira a cada quadro, que é
exatamente o que esta seção já pagou caro para evitar. O desfoque continua assado dentro do
WebP e o custo em tela segue zero.

## Sistemas sob medida (`#sistemas`)

A virada da página: até `#modelos` tudo falava de site. Aqui entra o outro lado do negócio.

São **três casos reais num carrossel**: o painel de indicadores de um banco, o controle
financeiro (painel + livro caixa) e a calculadora de taxas de maquininha com simulador de
margem. Os textos do primeiro saíram da legenda que a própria ACTech escreveu para o
carrossel do Instagram (`imgs2/legendas.txt`).

**Como o carrossel funciona.** A pista é um flex e trocar de caso é mover o `translateX` — os
três slides ficam em fluxo, então a altura do palco é a do slide mais alto e **nada pula** na
troca. Anda por seta, por ponto, pelas setas do teclado e por arrasto.

> **O palco é UM cartão e os slides são conteúdo puro dentro dele.** Se cada slide tivesse a
> própria sombra, o `overflow: hidden` da janela cortaria ela.

> O arrasto usa Pointer Events — mouse e dedo pelo mesmo código — e só vira troca de slide
> depois de **45px**. Abaixo disso é rolagem da página, não gesto de carrossel. O `dragstart`
> é cancelado porque o arrasto nativo da imagem atrapalha o gesto.

Slide fora da vez leva `aria-hidden` **e** `visibility: hidden`: sem isso, leitor de tela leria
os três casos em sequência e o Tab passaria por dentro de slide invisível.

**As capturas foram reduzidas para 1100px de largura** e a moldura tem `max-width: 560px` —
antes ocupavam metade da tela e engoliam o texto do caso.

> **Os números do financeiro estão borrados.** As capturas traziam dados reais de um
> cliente: saldo de caixa, total em contratos, vendas do mês e um extrato com nome de
> pessoa na descrição. O desfoque é gaussiano (raio 13), aplicado banda a banda — só em
> cima do número, nunca do rótulo, que é o que faz a tela continuar legível como sistema.
> As bandas foram medidas por perfil de linha, não no olho; o script está no histórico
> deste commit. **Os rótulos continuam nítidos de propósito** — "SALDO DO CAIXA",
> "A RECEBER CP", a coluna "MÉTODO": é isso que vende a seção, não o valor. O PNG é a
> origem e o WebP sai dele por redimensionamento; ao regerar, borre o PNG e reexporte,
> senão a versão em alta continua legível na pasta `imgs/` — e ela é servida pela URL
> também. Ao acrescentar captura nova, o mesmo trabalho.
>
> Os chips de cada caso são fatos estruturais de propósito (2 cliques, dia e mês, 1x a 12x) e
> nunca os valores do cliente. Mantenha essa régua.

### A saída da seção

Até aqui `#sistemas` terminava na letra miúda do orçamento e emendava no Google: o
visitante via o caso do banco e não tinha para onde ir, enquanto todo o resto da página
levava ao WhatsApp. Agora tem três portas:

- **O cartão de saída** no fim da seção (`.sis-cta`), com link próprio: `sistemaUrl`, a
  mesma linha do `whatsUrl` mas com outra mensagem — quem chega por aqui não está pedindo
  plano mensal, e a conversa começa errada se a mensagem disser "planos". A mensagem é
  fixa no código, e não `prop`: mais um campo no editor é mais um campo pra esquecer.
- **"Sistemas" no menu**, no desktop e no mobile, como primeiro item. Era a única seção
  grande sem entrada no topo.
- **Uma linha no hero**, abaixo dos dois botões. O H1 segue falando de site e marketing —
  é o que a maioria vem buscar — mas quem chega com dor interna (planilha, controle,
  caixa) não deveria precisar rolar meia página pra descobrir que a ACTech faz isso.

Abaixo, quatro tipos de sistema (painel de gestão, financeiro, agenda, integração), cada um
com a sua cor da roda. E o rodapé diz o que precisa ser dito: **sistema sob medida é orçado à
parte, fora dos planos mensais** — senão a seção cria a expectativa de que cabe nos R$ 397.

## "Monte o seu sistema" (`#sistemas`)

O painel de exemplo da seção de sistemas funciona. A pessoa escolhe o ramo e os módulos
(caixa, agenda, clientes, estoque, ordens de serviço, metas) e usa: lança venda, fecha o
dia, marca e conclui horário, busca e cadastra cliente, repõe estoque, avança OS, muda a
meta. "Quero um sistema assim" manda pro WhatsApp o ramo, os módulos e o que ela mais usou.

**Onde está.** `sistema/sistema.js` e `sistema/sistema.css`, baixados pelo
`setupSistema()` quando a seção chega perto, igual ao `estilos/`. Mexeu? Suba o `V`.

**Os módulos dividem o mesmo estado.** É o que faz parecer sistema, e não um monte de telas
soltas: concluir horário ou entregar OS lança no caixa, vender produto baixa o estoque, e
a meta e a visão geral acompanham tudo na hora.

**Liga com a prévia de site.** Quando alguém monta a prévia em `#modelos`, o `estilos.js`
publica `window.ACTechPrevia` e dispara o evento `actech:previa`. O sistema escuta e abre
com o mesmo nome e ramo, então a pessoa vê o site e o sistema do negócio dela.

**Dados de exemplo.** Ficam em `RAMOS` no topo do `sistema.js`: serviços e preços,
profissionais, estoque, despesas, faturamento dos últimos dias e meta de cada ramo. São
ilustrativos, gerados com semente (o mesmo ramo sempre abre igual) e zeram no F5.

**Celular.** Por *container query* (`@container painel`), abaixo de 700px o menu lateral
vira uma faixa de abas em cima e os formulários empilham.

## Modelos de site (`#modelos`)

"Veja como ficaria o seu site": a pessoa escolhe um de **nove estilos**, responde três
perguntas (nome do negócio, ramo, cidade) e vê um mini-site de verdade com o nome dela,
no computador ou no celular. No fim, "Quero um site assim" abre o WhatsApp com negócio,
ramo, cidade e estilo já escritos.

**Onde está.** Tudo mora em `estilos/`: `estilos.js` (conteúdo dos ramos, os nove
`render()` e o configurador) e `estilos.css` (a interface do configurador e um bloco por
estilo). No `index.html` fica só a seção com um `<div data-estilos>` vazio e o
`setupEstilos()`, que baixa os dois arquivos e as fontes quando a seção chega a ~1 tela
de distância. Quem nunca rola até ali não paga nada.

> **Mexeu em `estilos.js` ou `estilos.css`? Suba o `V` no `setupEstilos()`.** O GitHub
> Pages segura arquivo em cache por uns 10 minutos, e o `?v=` é o que força a versão nova.

**Por que DOM na mão e não template do x-dc.** O `[data-estilos]` sai do React sem filho
nenhum, então o React nunca mexe no que o módulo põe ali: abrir o diagnóstico ou o menu
re-renderiza o componente e a prévia continua intacta.

**Os estilos e de onde vieram.** Cada um foi montado a partir de um DESIGN.md do repositório
[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (licença MIT):
cores, tipografia, raios, sombras e o elemento marcante de cada sistema. **Na tela nenhum
leva nome de marca, e não há logo nem fonte proprietária**: as fontes são equivalentes
livres do Google Fonts.

| Estilo na tela | Referência | Fonte usada | O que marca |
|---|---|---|---|
| Vitrine | tesla | Outfit | foto de tela cheia, azul só no botão, raio de 4px |
| Café | starbucks | Nunito Sans | creme, quatro verdes, pílulas, botão flutuante redondo |
| Palco | spotify | Figtree | escuro de app, serviços como "faixas", barra de "tocando" |
| Impacto | lamborghini | Barlow Condensed | preto, dourado, caixa alta gigante, hexágono de pausa |
| Colorido | clay | Bricolage Grotesque + Inter | creme, cartões saturados, bolinhas "de massinha" |
| Agenda | cal | Cal Sans + Inter | branco, agenda funcionando já na primeira dobra |
| Pista | bmw-m | Archivo | preto técnico, faixa de três cores, maiúsculas pesadas |
| Convite | airbnb | DM Sans | busca em pílula, fotos em cartão com coração |
| Estúdio | webflow | Geist | título editorial, blocos de cor chapada |

**Acrescentar um estilo:** um objeto novo em `ESTILOS` (id, nome, desc, amostra, render),
um bloco de CSS com prefixo próprio de duas letras e, se a fonte for nova, uma linha em
`FONTES`. A lista, o modo celular e a mensagem do WhatsApp leem dali sozinhos.

**Conteúdo dos ramos.** Barbearia, salão, pet shop, clínica, restaurante, mercado e "outro
ramo" ficam em `RAMOS`, no topo do `estilos.js`. Todos os estilos leem dali, então o texto
de um ramo muda num lugar só. A foto principal de cada ramo é a de `imgs/mod-*.webp`
(Unsplash, uso comercial sem atribuição), e mais três extras ficam em `imgs/ramos/`, pra
cartões e faixas não repetirem a mesma imagem. O "outro ramo" também tem as dele.

As extras são do StockSnap, via [Openverse](https://openverse.org), todas **CC0**: domínio
público, uso comercial livre, sem crédito obrigatório. Saem em WebP 800×600 com qualidade 68,
cerca de 30 KB cada, e cada prévia só baixa as quatro do ramo escolhido.

| Arquivo | Foto | Origem | Licença |
|---|---|---|---|
| `imgs/ramos/barbearia-1.webp` | Barbershop Chair | [StockSnap](https://stocksnap.io/photo/barbershop-chair-7M505B7MYV) | CC0 |
| `imgs/ramos/barbearia-2.webp` | Barbershop Brush | [StockSnap](https://stocksnap.io/photo/barbershop-brush-GZP9ZEQPFL) | CC0 |
| `imgs/ramos/barbearia-3.webp` | Barber Razor | [StockSnap](https://stocksnap.io/photo/barber-razor-06HGN8LMUX) | CC0 |
| `imgs/ramos/salao-1.webp` | Hairdresser Cut | [StockSnap](https://stocksnap.io/photo/hairdresser-cut-S7UEWWIRTD) | CC0 |
| `imgs/ramos/salao-2.webp` | People Hands | [StockSnap](https://stocksnap.io/photo/people-hands-XX356Q6EI4) | CC0 |
| `imgs/ramos/salao-3.webp` | Hair Curls | [StockSnap](https://stocksnap.io/photo/hair-curls-R6CKAMVOMZ) | CC0 |
| `imgs/ramos/petshop-1.webp` | Animal Dog | [StockSnap](https://stocksnap.io/photo/animal-dog-ZO5GDP2QY1) | CC0 |
| `imgs/ramos/petshop-2.webp` | Animals Puppy | [StockSnap](https://stocksnap.io/photo/animals-puppy-OOH59BAHBL) | CC0 |
| `imgs/ramos/petshop-3.webp` | Cat Pet | [StockSnap](https://stocksnap.io/photo/cat-pet-XHBLQZQP6J) | CC0 |
| `imgs/ramos/clinica-1.webp` | Doctor Patient | [StockSnap](https://stocksnap.io/photo/doctor-patient-EDI8LWKSBB) | CC0 |
| `imgs/ramos/clinica-2.webp` | Stethoscope Medical | [StockSnap](https://stocksnap.io/photo/stethoscope-medical-9M1HWW2JFV) | CC0 |
| `imgs/ramos/clinica-3.webp` | Male Doctor | [StockSnap](https://stocksnap.io/photo/male-doctor-KN1OCKC4Y2) | CC0 |
| `imgs/ramos/restaurante-1.webp` | Food Plate | [StockSnap](https://stocksnap.io/photo/food-plate-LF3YEO5Q13) | CC0 |
| `imgs/ramos/restaurante-2.webp` | Restaurant Kitchen | [StockSnap](https://stocksnap.io/photo/restaurant-kitchen-0HCMIT272C) | CC0 |
| `imgs/ramos/restaurante-3.webp` | Steak Potatoes | [StockSnap](https://stocksnap.io/photo/steak-potatoes-WYGI6J1B0S) | CC0 |
| `imgs/ramos/mercado-1.webp` | Guy Man | [StockSnap](https://stocksnap.io/photo/guy-man-HGWAXJFSVV) | CC0 |
| `imgs/ramos/mercado-2.webp` | Fruit Vegetables | [StockSnap](https://stocksnap.io/photo/fruit-vegetables-F8B73CPSBK) | CC0 |
| `imgs/ramos/mercado-3.webp` | Market Fruits | [StockSnap](https://stocksnap.io/photo/market-fruits-VBQSBXBAO8) | CC0 |
| `imgs/ramos/outro-0.webp` | Office Work | [StockSnap](https://stocksnap.io/photo/office-work-42H3JH8QI5) | CC0 |
| `imgs/ramos/outro-1.webp` | Floorplan Workshop | [StockSnap](https://stocksnap.io/photo/floorplan-workshop-N3BPNPN0FY) | CC0 |
| `imgs/ramos/outro-2.webp` | Tools Workshop | [StockSnap](https://stocksnap.io/photo/tools-workshop-KD30XPQR0A) | CC0 |
| `imgs/ramos/outro-3.webp` | Office Work | [StockSnap](https://stocksnap.io/photo/office-work-030TCBJQ8C) | CC0 |

**O aparelho.** A prévia fica dentro de um notebook (tela com borda, câmera, barra do
navegador com os três botões coloridos e base de alumínio) ou de um celular (ilha da câmera,
barra de status com hora e bateria, endereço embaixo e botões laterais). É o mesmo HTML: o
`data-modo` do `.est-aparelho` troca a forma e o CSS anima a passagem. Em tela de até 760px
não tem escolha: abre direto no celular. A barra de status pega a cor de fundo do estilo
(`amostra.bg`), e a hora é a do relógio do visitante. É desenho em CSS, sem logo nem imagem
de marca.

**Responsivo sem media query de janela.** Os mini-sites usam *container queries*
(`@container site`): quem decide o layout é a largura da moldura, não a da tela. É isso
que faz o botão "Celular" funcionar: ele só estreita a moldura pra 380px.

> **Contraste.** Os pares de texto e fundo dos nove estilos foram medidos e ficam todos em
> 4,5:1 ou mais. Dois ajustes saíram disso: o vermelho do Convite em texto e botão é
> `#e00b41`, porque o `#ff385c` original dá 3,5:1 no branco e ficou só no ícone. E nos
> cartões coloridos (Colorido e Estúdio) o texto é escuro no rosa, azul, laranja e verde,
> onde branco não passa de 3,4:1. Ao criar um estilo, refaça essas contas.

**Link de compartilhar.** "Mandar pra alguém" gera
`?n=nome&r=ramo&c=cidade&o=outro&e=estilo#modelos`. No celular abre o menu de compartilhar do
aparelho (`navigator.share`); no computador, o WhatsApp sem destinatário. Quem abre o link
encontra a prévia montada: o `setupEstilos()` carrega o módulo na hora e rola até ela, e o
sistema herda o nome. Na volta tudo é validado (ramo e estilo precisam existir, texto
cortado em 30 caracteres e escapado pelos templates, como qualquer dado digitado).

**Site, Google e Instagram.** O aparelho tem três abas. Com os mesmos dados, "Google" mostra
a busca com a ficha do negócio (mapa desenhado em CSS, nota, Rotas/Ligar/Site, fotos, horário,
avaliação) e "Instagram" mostra o perfil (bio, destaques, grade com fotos do ramo e artes nas
cores do estilo escolhido).

**Antes × Depois.** Quarta aba do aparelho. Duas camadas no mesmo lugar: embaixo o site no
estilo escolhido, em cima um site "do jeito antigo" (Times New Roman, letreiro, contador de
visitas, "em construção") recortado por `clip-path` até a cortina (`--ad`, registrada com
`@property` pra poder animar a abertura). Arrasta com dedo ou mouse; um `<input type=range>`
invisível por baixo dá teclado e leitor de tela. O site antigo tem largura fixa de 640px de
propósito: no celular ele não cabe, que é exatamente o argumento. É caricatura assumida (o
selo diz "do jeito antigo"), não o site de ninguém.

**QR do cardápio/catálogo.** Depois de montar, as ações da prévia mostram um QR que abre
`catalogo.html` com os mesmos parâmetros do link de compartilhar: cardápio (restaurante),
ofertas (mercado) ou serviços e preços (os outros), com o nome e as cores do estilo, e um
pedido de mentira que no fim explica que no de verdade ele cai no WhatsApp do negócio. No
celular o QR vira botão. O QR é gerado no navegador por `vendor/qrcode-1.4.4.min.js`
(qrcode-generator, Kazuhiko Arase, MIT, 20 KB), que só desce quando há QR pra desenhar.
`catalogo.html` tem `noindex`: é exemplo, não página de ninguém. Os itens vêm de `RAMOS`
(estilos.js) mais `ITENS_EXTRAS` no próprio catalogo.html.

**Nada fica guardado.** A prévia vive só enquanto a aba está aberta: F5 volta pro convite,
do zero, e nada sai do navegador até a pessoa clicar em "Quero um site assim".

**Portão do diagnóstico.** O botão "Quero um site assim" leva `data-sem-portao`, e o
`setupPortao()` deixa esse link passar direto: a pessoa acabou de responder três perguntas,
não faz sentido mandar pra outras dez. Pra voltar a exigir o diagnóstico, apague a linha
do `data-sem-portao` no `setupPortao()`.

**Acessibilidade.** A lista de estilos é um `radiogroup` (setas trocam o estilo), o botão
Computador/Celular usa `aria-pressed`, e enquanto as perguntas estão abertas a prévia fica
`inert`, então o Tab não entra nela. Esc fecha as perguntas. Com
`prefers-reduced-motion`, nada flutua nem desliza.

## A assinatura do rodapé

`imgs/assinatura.webp` fecha a página. Veio do banner original em fundo creme `#F4F1EC`.

> **O fundo saiu por preenchimento a partir da borda**, e o alpha foi calculado pela
> **distância até o creme**, não pela luminância. Isso importa: uma rampa calibrada para
> branco (~255) deixava o fundo inteiro em **alpha 141**, porque 236 não é 255 — a imagem
> saía com um retângulo creme fantasma por cima do cinza. Se entrar outra arte em fundo
> claro, é essa a conta a usar.

O `alt` carrega o texto que está dentro da imagem: quem usa leitor de tela não lê pixel. Vale
notar que o laranja do banner dá só **2,71:1** sobre o cinza da página — como é texto dentro
de imagem, o `alt` é o que garante que a informação não se perca.

**Um detalhe de mensagem:** o banner diz "sites e sistemas sob medida" e o rodapé logo abaixo
diz "sites e marketing digital". São posicionamentos diferentes. Vale alinhar os dois.

## Pendências que dependem de material seu

- **`actech.com.br` não é da ACTech.** A bio do mockup do Instagram exibia esse domínio como
  se fosse o site. Ele é da **Actech Tecnologia**, outra empresa — que por sinal também vende
  sistema para mercado e padaria, ou seja, concorrente direto no mesmo público. Está trocado
  pelo CTA que a bio real usa ("Faça seu orçamento"). Quando existir domínio próprio, é ali
  que ele entra.
- **Quarta captura de fora**: `imgs2/sistema-visitas.png` (Agenda de visitas) ficou fora de
  `#trabalhos`. O sistema é bom, mas a tela foi capturada com dados de teste digitados no
  improviso — aparecem "sada", "sdadas", "asdasd" e "Visita 1" nos cartões. Numa parede de
  portfólio isso é lido. Refaça a captura com dados que pareçam reais e ela entra: já está
  convertida em `imgs/sistema-visitas.webp`, é só acrescentar uma entrada em `trabalhos()`.
- **"Agência 3309"** aparece em duas das capturas. Não nomeia o banco, mas é um dado
  específico — se incomodar, vale borrar antes de republicar.

## Diagnóstico e presente

Fluxo próprio, sem biblioteca de terceiros — vive no estado do `DCLogic`:

| Peça | Onde |
|---|---|
| Perguntas, ícones e textos | `quizData()` no `index.html` |
| Cálculo da nota, faltas, ações e plano | `quizResult()` |
| Apresentação do ebook | bloco `.ebook` na seção `#diagnostico` |
| Slot do ebook | bloco `.mat-grid` no `index.html`, com as instruções em comentário logo acima |

### O fim do diagnóstico

O quiz não joga mais direto no WhatsApp. Depois do resultado (nota, o que está faltando
e o que a gente faria primeiro), o botão leva a uma **tela de oferta** — passo `N + 3` —
com três saídas, nesta ordem:

1. **Ebook** — slot igual ao da página, marcado "Em breve" enquanto o arquivo não existe.
   O comentário em cima do bloco tem as quatro linhas que mudam pra ligar, seja como
   download (presente) ou como link de compra.
2. **Auditoria em 24h** — esta já funciona: abre o WhatsApp com o diagnóstico escrito e a
   última linha em branco (`Meu link (site, Instagram ou ficha do Google):`), esperando a
   pessoa colar. É `res.audit`, irmã de `res.whats`.
3. **Falar no WhatsApp** — o caminho antigo, com o perfil inteiro na mensagem.

Chegar nessa tela já libera o presente na página (`unlocked`), então quem fechar o modal
encontra o ebook esperando embaixo.

> **Atenção ao ligar o ebook:** a página promete "um presente no fim" antes do quiz e o
> bloco liberado diz "Presente liberado". Se ele virar produto pago, esses dois textos
> precisam mudar junto — senão a página promete de graça o que cobra duas telas depois.

A mensagem do WhatsApp é montada com o perfil inteiro que a pessoa respondeu —
é o que transforma o diagnóstico em lead qualificado do lado de cá.

Para mudar as perguntas, mexa só em `quizData()`: a barra de progresso, o "de N"
e o passo do nome se ajustam sozinhos ao tamanho da lista.

O slot do ebook está vazio de propósito. Enquanto estiverem com
`data-vazio` ele aparece afundado na superfície, marcado como "Em breve" e não
é clicável. O comentário acima do bloco explica as quatro linhas que mudam para
ativá-lo.

O diagnóstico também é o portão de entrada: `setupPortao()` intercepta qualquer
link para o WhatsApp — CTA do topo, hero, os dois planos, o botão do CTA final e
o flutuante — e abre o modal antes. Depois que a pessoa responde (ou escolhe
falar direto), os links voltam a funcionar normalmente.

As imagens do carrossel ficam em `imgs/`, agora em WebP: `site-home`,
`site-portfolio`, `painel-caixa` e `livro-caixa` saíram de 1,31 MB em PNG para
205 KB, sem mexer nas dimensões. Os `.png` originais continuam na pasta como
fonte — nada no HTML aponta pra eles, mas eles ainda sobem no deploy.
