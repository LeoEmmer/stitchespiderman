# BUILD-LOG — Piloto 3 ELITE · Marin Auto Detail (remake)

**Data:** 09/11/2026 · **Pasta:** `~/workspace/cda-elite/piloto-3-detailing/`
**Base:** demo original da campanha 7 sites (`~/workspace/campanha-7-sites/site-exemplo/`) — copy, pacotes (Refresh $89 / Signature $249 / Showroom $549), serviços, reviews e tokens **Dark Premium CDA** reaproveitados integralmente (bg #05070D · azul #2E7CF6 · glow #59D6FF · Sora/Inter). A coreografia antiga (IntersectionObserver) foi substituída pela camada GSAP + ScrollTrigger + Lenis, como manda a SPEC v1.

## ⚠️ Substituição importante (ler primeiro)

O clipe-âncora bespoke do plano (SUV em estúdio dark: sujo → espuma → faixa de luz → showroom, via Higgsfield) **não foi gerado** — créditos de vídeo do Higgsfield estão esgotados neste ciclo e a kie é reserva intocável (regra da casa, custo zero em mídia). No lugar, a sequência de frames roda com **stock gratuito do Pixabay**:

- **Clipe:** close de farol/pintura preta glossy sendo lavado com jato de água, 5,9s, 1920×1080
- **Autor/fonte:** VariousPhotography — https://pixabay.com/videos/id-2030/
- **Licença:** Pixabay Content License (uso comercial permitido, sem atribuição obrigatória)
- **Como foi escolhido:** varredura via API do Pixabay (chave do MoneyPrinterTurbo). Os candidatos avaliados e rejeitados: túnel de lava-rápido automático com escovas vermelhas e marca de equipamento visível (id 32890/3555 — contradiz o posicionamento "hand-finished"), politriz em carro vermelho com mão em quadro (id 41085), água em vidro de túnel (id 5644). Pexels retornou 403 (bloqueio de bot) e a Coverr não tem chave configurada — as duas rotas foram tentadas antes de fechar no Pixabay.
- **Efeito na narrativa:** os 5 beats do plano estão todos lá e legíveis (chegada → lavagem → correção → ceramic → entrega), mas o visual é um **close de pintura preta com água/luz**, não o plano aberto do SUV. As legendas carregam a história; o scrub mostra textura, água e brilho evoluindo. Grade cinematográfica uniforme aplicada nos frames (contraste + vinheta + saturação 0,94) pra sentar no fundo #05070D.

**Troca futura (client-ready):** quando o Higgsfield tiver créditos, gerar o clipe bespoke seguindo a seção 2.4 do `PILOTOS-ELITE-v1.md` (first/last frame definidos, movimento reversível, sem mãos/texto) e rodar a mesma receita abaixo — o site não muda, só a pasta de frames.

## A sequência de frames (Receita B)

```bash
# receita usada (o -c:v libwebp é obrigatório: sem ele o ffmpeg 8.x desta
# máquina cai no libwebp_anim e grava UM webp animado em vez de frames)
ffmpeg -i ancora.mp4 -vf "fps=12,scale=1280:-2,eq=contrast=1.07:brightness=-0.02:saturation=0.94,vignette=PI/5" -c:v libwebp -q:v 72 frames/f%03d.webp
ffmpeg -i ancora.mp4 -vf "fps=12,scale=720:-2,<mesma grade>"  -c:v libwebp -q:v 68 frames-mobile/f%03d.webp
```

| Sequência | Frames | Resolução | Peso total | Orçamento |
|---|---|---|---|---|
| Desktop | **71** | 1280×720 | **3,03 MB** | ≤ 5 MB ✅ |
| Mobile | **71** | 720×405 | **1,15 MB** | ≤ 3 MB ✅ |
| Poster (LCP/fallback) | 1 | 1280×720 | 45 KB | — |

## Stack e como a página funciona

- **Vanilla** HTML/CSS/JS, zero build. Libs **vendored** em `js/vendor/` (GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.18 — arquivos locais, sem CDN de terceiro no ar do cliente).
- **Lenis** no ticker do GSAP (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`) — integração padrão da SPEC.
- **Scrub:** seção `.story` com pin do palco (100svh) por +400% de scroll; progresso → frame alvo com **suavização (lerp 0,14)** no loop de render — anda pra frente e pra trás sem engasgo. Os 6 beats (hero + 5 atos) trocam por faixas de progresso; barra de progresso no rodapé do palco.
- **Preload progressivo:** poster é o LCP (preload + `fetchpriority=high`); os 15 primeiros frames liberam o canvas interativo; o restante carrega em seguida, com barra de progresso visível ("Loading the shine… %").
- **Âncoras** (nav, CTAs) rolam via `lenis.scrollTo`.
- **Reveals GSAP** em todas as seções (31 elementos), substituindo o IntersectionObserver do demo.
- **Formulário de booking:** mesmo comportamento do demo (validação + estado de confirmação em JS) — o envio real pro Supabase entra na fase de cliente.
- **`_headers`** incluído: cache imutável de 1 ano pros frames (padrão Cloudflare Pages da SPEC 2.5).

## SEO local (checklist 2.7)

- Title/meta com serviço + cidade ✅ · H1 único ✅ · JSON-LD `LocalBusiness` + `AutoBodyShop` com NAP, geo, horários e `areaServed` ✅ (sem schema de reviews — os reviews do demo são fictícios, como manda a regra) · Open Graph com o poster ✅ · botão click-to-call fixo no mobile ✅ · alt descritivo no poster ✅.
- Pendente na publicação real: domínio definitivo no `canonical`/JSON-LD (hoje `marinautodetail.example.com`, placeholder), GA4/Search Console, `sitemap.xml`/`robots.txt` (site de 1 página — gerar no deploy).

## Verificação (headless, 09/11/2026)

Servidor local (`python3 -m http.server`) + Chromium headless via Playwright, scripts e prints em `verificacao/`:

| Teste | Resultado |
|---|---|
| Erros de JS na página | **0** (desktop e mobile) |
| Canvas pronto (≥15 frames) + poster some | ✅ |
| Scrub no meio (55%) | frame avança (pixel central muda), beat 3 ativo ✅ |
| Fim da história (97,5%) | beat 5 + CTA "Book your detail" ✅ |
| Scroll de volta (25%) | beat 1 — **scrub reversível** ✅ |
| Reveals | 31/31 visíveis ✅ |
| Formulário | estado de sucesso com nome/telefone certos ✅ |
| Mobile 390px | frame set mobile carrega, FAB de ligação visível, 0 erros ✅ |
| `prefers-reduced-motion` | versão estática completa (poster + beats em lista), palco oculto ✅ |
| Peso inicial (HTML+CSS+JS+poster) | **210 KB** (meta < 1,5 MB ✅) |
| Peso total do site | 4,38 MB |

Único erro de rede no teste: Google Fonts bloqueado pelo proxy de saída desta VM (`ERR_TUNNEL_CONNECTION_FAILED`) — limitação do ambiente de teste, não da página; em rede normal as fontes Sora/Inter carregam (e o fallback de sistema segurou o layout nos prints).

**Lighthouse formal não foi rodado** (sem ambiente com rede aberta pras fontes); pelos números — peso inicial de 210 KB, poster como LCP, canvas com altura reservada (CLS ~0), frames progressivos — a estrutura está dentro do orçamento da SPEC 2.6. Rodar o Lighthouse real no deploy preview do Cloudflare Pages.

## Como rodar / preview

```bash
cd ~/workspace/cda-elite/piloto-3-detailing
python3 -m http.server 8931
# abrir http://localhost:8931
```

Deploy: arrastar a pasta num projeto Cloudflare Pages (o `_headers` já está na raiz).

## O que falta pra "client-ready"

1. **Clipe bespoke do Higgsfield** (SUV dark, arco completo do plano) — trocar `assets/frames*` mantendo nomes/contagem; ajustar `FRAME_COUNT` no `js/main.js` se mudar o fps.
2. Ligar o formulário no **Supabase** (padrão da casa) ou webhook Brevo.
3. Domínio real do cliente no canonical/JSON-LD/OG + GA4/Search Console + sitemap/robots.
4. Lighthouse mobile real no link do Pages (meta ≥ 90) + teste de scroll com o dedo num celular mediano.
5. Gravação de tela de 20–30s do scroll (desktop + mobile) — matéria-prima do reel "US$ 490 website vs US$ 4.900 website".
6. Stills de antes/depois reais do cliente (slot que o BUILD-NOTE do demo já previa) pras seções internas, gerados nas ferramentas da casa.

---

## Correção do fundo vazio + publicação (09/11/2026)

**O que o Leonardo viu no celular:** abriu o `index.html` pela prévia de arquivo do app e viu **só a copy cruzando** — sem carro, sem movimento no fundo.

**Causa (conclusão por evidência):** dois fatores somados.
1. **A prévia de arquivo do app não é um servidor web** — ela não resolve os caminhos relativos da pasta (frames/poster). Sem os arquivos, a sequência nunca chega.
2. **Um defeito real do loader antigo amplificou o problema:** o `onerror` de cada frame **contava como carregamento**. Com 15+ frames falhados, o loader marcava o canvas como "pronto", aplicava `.gone` no poster (fade-out) e o `drawFrame` retornava em silêncio (`naturalWidth === 0`) — ou seja, mesmo que o poster tivesse carregado, ele era **descartado** e o fundo ficava vazio: só o véu escuro + a copy. Reproduzido localmente antes da correção (cenário de frames bloqueados).

**O que mudou (build canônica `piloto-3-detailing/`):**
- Contadores separados no loader: `settled / ok / failed`. O canvas só assume (`canvas.ready` + `poster.gone`) depois que um frame **real** foi pintado com sucesso.
- `drawFrame` retorna sucesso/falha e, se o frame alvo não decodificou, pinta o **frame válido mais próximo** — nunca ar.
- O poster é pintado no canvas assim que carrega (`paintPoster`) e virou também o **fundo CSS do palco** (`.stage { background: … url("../assets/poster.webp") center/cover }`) — o fundo nunca fica vazio.
- Falha total dos 71 frames → classe `html.frames-failed`: poster travado visível (CSS `!important`), canvas ocultado, beats/copy seguem funcionando, e o console registra `console.error` claro com a pasta e o primeiro arquivo que falhou (erros individuais limitados aos 3 primeiros + resumo final). Handle de verificação: `window.__scrubStatus()`.
- **Orçamentos de peso mantidos** (frames 3,03 MB desktop / 1,15 MB mobile; poster 45 KB).

**Verificação local (chrome-headless-shell via CDP, prints em `verificacao/`):**
- Normal (desktop e mobile): `ok 71/71`, canvas pintado (luminância média 83→90 desktop, 95→112 mobile ao rolar), beats avançam 0→3→fim, 0 erros de console — `fix-desktop-*`, `fix-mobile-*`.
- Frames bloqueados (servidor retornando 404 nas sequências): `ok 0/71`, `frames-failed` ativo, poster visível (opacidade 1) cobrindo o palco, beats avançando — `fix-semframes-*`.

**Publicação — URL pública:**
### https://leoemmer.github.io/stitchespiderman/marin-auto-detail-elite/

- **Por que esse endereço:** a integração do GitHub **não tem permissão de criar repositórios** (403 "Resource not accessible by integration" ao criar `marin-auto-detail-elite`). Reaproveitado o repo antigo `LeoEmmer/stitchespiderman` (joguinho de 2025, Pages já ativo servindo da branch `main`), publicando numa **subpasta** `marin-auto-detail-elite/` — o conteúdo original do repo não foi tocado.
- **Espelho "packed":** o push via conector só aceita arquivos de texto (snapshot UTF-8), então os 142 frames + poster viajam **embutidos em base64** em `js/pack-*.js` (~5,9 MB de texto, em 8 commits fatiados — um push único de 6 MB retornou HTTP 413). O `main.js` detecta `window.MAD_PACKED` e decodifica pras mesmas imagens via Blob URLs (suporte inerte na build canônica de arquivos). Cópia de publicação: `~/workspace/cda-elite/piloto-3-detailing-ghpages/`; registro de sincronização: `~/workspace/cda-elite/piloto-3-pages-repo.muse-github-snapshot-sync.json`.
- **Verificação ao vivo (headless, desktop + mobile):** `ok 71/71` nos dois, canvas pintado e mudando com o scroll (83→90 / 95→112), beat 3 no meio da história, **0 erros de console** — prints `live-desktop-*` e `live-mobile-*` em `verificacao/`. (Nota de bastidor: o Chromium headless desta VM precisou de um relay local pro proxy de saída + `--ignore-certificate-errors` por causa da CA do proxy; o conteúdo foi conferido também via curl com a CA correta — 200 em todos os arquivos.)
- **Pendências de sempre:** clipe bespoke do Higgsfield quando o ciclo virar (trocar a pasta de frames na build canônica e regenerar o espelho), formulário → Supabase, domínio próprio — o espelho do Pages é vitrine do piloto, não o deploy de cliente.
