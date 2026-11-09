# BUILD-LOG — Piloto 1 ELITE · Stack House (smash burger)

**Data:** 09/11/2026 · **Pasta:** `~/workspace/cda-elite/piloto-1-burger/`
**Base:** receita provada do Piloto 3 (`~/workspace/cda-elite/piloto-3-detailing/`) — scaffold vanilla + GSAP 3.12.5/ScrollTrigger + Lenis 1.1.18 vendored, palco pinado +400%, canvas com lerp 0,14, loader corrigido (contadores settled/ok/failed separados, poster no canvas + fundo CSS do palco, `window.__scrubStatus()`, classe `frames-failed`, `prefers-reduced-motion` estático) copiado **byte a byte**; só mudam marca, copy, tokens e a sequência de frames. Identidade: Dark Premium CDA em variante quente — bg #0A0705 · ação ember #F07D1A · glow âmbar #FFB347 · Sora/Inter.

## ⚠️ Substituição importante (ler primeiro)

O clipe-âncora bespoke do plano (burger se montando camada por camada em fundo dark contínuo, via Higgsfield, padrão KALUA do Vadim) **não foi gerado** — créditos de vídeo do Higgsfield estão esgotados neste ciclo e a kie é reserva intocável (regra da casa, custo zero em mídia). No lugar, a sequência de frames roda com **stock gratuito do Pixabay**:

- **Clipe:** burger finalizado sobre prato branco em **fundo preto puro**, batatas fritas caindo em câmera lenta ao redor e nuggets pousando — a "montagem do prato" em slow motion, 16,5s, 1920×1080
- **Autor/fonte:** koudyt — https://pixabay.com/videos/id-79561/
- **Licença:** Pixabay Content License (uso comercial permitido, sem atribuição obrigatória)
- **Como foi escolhido:** varredura via API do Pixabay (chave do MoneyPrinterTurbo), 10 buscas e 10 candidatos avaliados frame a frame contra a **regra do ator principal** (objeto-herói único, fundo premium limpo, UMA ação clara, espaço negativo pra copy). Rejeitados com motivo: animação flat em cartoon de burger se montando (id 132533 — é literalmente camada por camada, mas ilustração 2D em fundo laranja, fora do padrão premium fotográfico) · chef montando burgers em cozinha comercial clara, mãos dominando o quadro (ids 36006/36007 — montagem real, mas fundo claro e movimentado, anti ator-principal) · burger embrulhado com marca visível "Mighty Burger" (id 136433 — logo de terceiro, proibido) · close de fritas+nuggets em bandeja clara (id 79170) · patty selando em grill elétrico, lindo mas quase estático (id 199545) · patties crus com labareda (id 124823) · bacon na chapa (id 381248, vertical e fora do tema) · avocado toast (id 1015, resultado errado da busca).
- **Efeito na narrativa (honesto):** diferente do plano KALUA, o vídeo **não mostra** o burger se montando camada por camada — mostra o herói pronto, isolado no preto, enquanto o prato se constrói ao redor em câmera lenta. Os 6 beats seguem a história da montagem (base → smash → queijo → frescos → fecha) **carregada pelas legendas**, com o visual sustentando herói/atmosfera — o mesmo arranjo do Piloto 3, cujas legendas de lavagem/correção/ceramic rodavam sobre um close de água e luz. Um reenquadramento aproxima o herói do padrão: crop 1728×972 + flip horizontal põem o burger como ator principal à direita do palco, com o preto livre à esquerda pra copy.
- **Janela usada:** 0,4s → 10,4s do clipe (sozinho no preto → fritas caem e pousam → primeira leva de nuggets chega). O restante (pilha final de nuggets até 16,5s) ficou de fora pra manter o arco em 120 frames.

**Troca futura (client-ready):** quando o Higgsfield tiver créditos, gerar o clipe bespoke de montagem camada por camada seguindo a seção 2.4 do `PILOTOS-ELITE-v1.md` (first/last frame definidos, fundo dark contínuo, sem mãos/texto) e rodar a mesma receita abaixo — o site não muda, só a pasta de frames.

## A sequência de frames (Receita B)

```bash
# receita usada (o -c:v libwebp é obrigatório: sem ele o ffmpeg 8.x desta
# máquina cai no libwebp_anim e grava UM webp animado em vez de frames)
# reenquadramento: crop 1728x972 + hflip (herói à direita, copy à esquerda)
ffmpeg -ss 0.4 -t 10 -i ancora.mp4 -vf "crop=1728:972:96:54,hflip,fps=12,scale=1280:-2,eq=contrast=1.07:brightness=-0.02:saturation=0.94,vignette=PI/5" -c:v libwebp -q:v 72 assets/frames/f%03d.webp
ffmpeg -ss 0.4 -t 10 -i ancora.mp4 -vf "crop=1728:972:96:54,hflip,fps=12,scale=720:-2,<mesma grade>"  -c:v libwebp -q:v 68 assets/frames-mobile/f%03d.webp
```

| Sequência | Frames | Resolução | Peso total | Orçamento |
|---|---|---|---|---|
| Desktop | **120** | 1280×720 | **1,65 MB** | ≤ 5 MB ✅ |
| Mobile | **120** | 720×405 | **0,71 MB** | ≤ 3 MB ✅ |
| Poster (LCP/fallback) | 1 | 1728×972 (16:9) | 23 KB | — |

## Stack e como a página funciona

- **Vanilla** HTML/CSS/JS, zero build. Libs **vendored** em `js/vendor/` (GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.18 — arquivos locais, idênticos aos do Piloto 3, md5 conferido).
- **Lenis** no ticker do GSAP (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`) — integração padrão da SPEC.
- **Scrub:** seção `.story` com pin do palco (100svh) por +400% de scroll; progresso → frame alvo com **suavização (lerp 0,14)** no loop de render — anda pra frente e pra trás sem engasgo. Os 6 beats (hero + 5 camadas) trocam por faixas de progresso; barra de progresso âmbar no rodapé do palco.
- **Preload progressivo:** poster é o LCP (preload + `fetchpriority=high`); os 15 primeiros frames liberam o canvas interativo; o restante carrega em seguida, com barra de progresso visível ("Loading the stack… %").
- **Âncoras** (nav, CTAs) rolam via `lenis.scrollTo`.
- **Reveals GSAP** em todas as seções (32 elementos).
- **Menu:** Single Smash **$12** · Double Stack **$16** (featured) · House Special **$19** + faixa de acompanhamentos (fritas $5 · onion rings $6 · shakes $7 · combo +$6). Reviews fictícios curtos (3, Marin) — **sem** schema de reviews no JSON-LD, como manda a regra.
- **Formulário de pedido:** mesmo comportamento do Piloto 3 (validação + estado de confirmação em JS, texto por nome/telefone) — o envio real pro Supabase entra na fase de cliente.
- **`_headers`** incluído: cache imutável de 1 ano pros frames (padrão Cloudflare Pages da SPEC 2.5).

## SEO local (checklist 2.7)

- Title/meta com serviço + cidade ✅ · H1 único ✅ · JSON-LD `Restaurant` com NAP, geo, horários, `servesCuisine` e `areaServed` ✅ (sem schema de reviews) · Open Graph com o poster ✅ · botão click-to-call fixo no mobile ✅ · alt descritivo no poster ✅.
- Pendente na publicação real: domínio definitivo no `canonical`/JSON-LD (hoje `stackhouse.example.com`, placeholder), GA4/Search Console, `sitemap.xml`/`robots.txt` (site de 1 página — gerar no deploy).

## Verificação (headless, 09/11/2026)

Chromium headless (Playwright) + servidor local; scripts e prints em `verificacao/`. Mesma bateria do Piloto 3, rodada **3 vezes: build canônica local · espelho packed local · URL pública ao vivo — 16/16 nas três**.

| Teste | Resultado |
|---|---|
| Erros de JS na página | **0** (desktop e mobile, local e ao vivo) |
| Frames carregados | **ok 120/120** nos dois sets (desktop + mobile), 0 falhas |
| Canvas pronto + poster some | ✅ |
| Scrub no meio (55%) | frame avança (drawnFrame 65), beat 3 ativo ✅ |
| Fim da história (97,5%) | beat 5 + CTA "Order ahead" ✅ |
| Scroll de volta (25%) | beat 1 — **scrub reversível** ✅ |
| Reveals | 32/32 visíveis ✅ |
| Formulário | estado de sucesso com nome/telefone certos ✅ |
| Mobile 390px | frame set mobile carrega, FAB de ligação visível, 0 erros ✅ |
| `prefers-reduced-motion` | versão estática completa (poster + beats em lista), palco oculto ✅ |
| Peso inicial (HTML+CSS+JS+poster) | **193 KB** (meta < 1,5 MB ✅) |
| Peso total do site (sem o vídeo-âncora) | 2,56 MB |

Nota de processo: a primeira rodada pegou um `FRAME_COUNT` errado (121 × 120 arquivos reais) — corrigido antes de publicar; a contagem de arquivos em disco é a fonte da verdade. Único erro de rede nos testes locais: Google Fonts bloqueado pelo proxy de saída desta VM (`ERR_TUNNEL_CONNECTION_FAILED`) — limitação do ambiente, não da página (ao vivo, via relay local pro mesmo proxy, as fontes carregaram e os prints `live-*` mostram Sora/Inter aplicadas).

**Lighthouse formal não foi rodado** (mesma limitação do Piloto 3); pelos números — peso inicial de 193 KB, poster como LCP, canvas com altura reservada (CLS ~0), frames progressivos — a estrutura está dentro do orçamento da SPEC 2.6. Rodar o Lighthouse real no deploy de cliente (Cloudflare Pages).

## Como rodar / preview

```bash
cd ~/workspace/cda-elite/piloto-1-burger
python3 -m http.server 8932
# abrir http://localhost:8932
```

Deploy: arrastar a pasta num projeto Cloudflare Pages (o `_headers` já está na raiz).

## Publicação — URL pública

### https://leoemmer.github.io/stitchespiderman/stack-house-elite/

- **Mesma rota do Piloto 3:** a integração do GitHub não cria repositórios (403), então o piloto mora numa **subpasta** do repo antigo `LeoEmmer/stitchespiderman` (Pages ativo na branch `main`) — o conteúdo original do jogo **não foi tocado**, nem a subpasta do Piloto 3.
- **Espelho "packed":** o push via conector só aceita arquivos de texto (snapshot UTF-8), então os 240 frames + poster viajam **embutidos em base64** em `js/pack-*.js` (~3,2 MB de texto, em 5 commits fatiados: core · desktop 1–3 · mobile 1 — push único estoura o limite, como no Piloto 3). O `main.js` detecta `window.MAD_PACKED` e decodifica pras mesmas imagens via Blob URLs (suporte inerte na build canônica de arquivos). Cópia de publicação: `~/workspace/cda-elite/piloto-1-burger-ghpages/`; staging + registro de sincronização: `~/workspace/cda-elite/piloto-1-pages-repo/` e `piloto-1-pages-repo.muse-github-snapshot-sync.json`.
- **Commits:** b28a496f (core) · a1163235 (pack-desktop-1) · bf0bacdc (pack-desktop-2) · 25ec0304 (pack-desktop-3) · a82ba5f3 (pack-mobile-1) · este BUILD-LOG.
- **Verificação ao vivo (headless, desktop + mobile):** `ok 120/120` nos dois, canvas pintado e mudando com o scroll, beat 3 no meio, beat 5 + CTA no fim, **0 erros de console** — prints `live-*` em `verificacao/`. (Bastidor: o Chromium desta VM acessou o Pages via relay local pro proxy de saída + `--ignore-certificate-errors` por causa da CA do proxy; o conteúdo foi conferido também via curl — 200 em todos os 11 arquivos.)

## O que falta pra "client-ready"

1. **Clipe bespoke do Higgsfield** (burger se montando camada por camada, fundo dark contínuo, first/last frame) — trocar `assets/frames*` mantendo nomes/contagem; ajustar `FRAME_COUNT` no `js/main.js` se mudar o fps. É a troca que transforma este piloto no padrão KALUA de verdade.
2. Ligar o formulário de pedido no **Supabase** (padrão da casa) ou webhook Brevo.
3. Domínio real do cliente no canonical/JSON-LD/OG + GA4/Search Console + sitemap/robots.
4. Lighthouse mobile real no link do Pages (meta ≥ 90) + teste de scroll com o dedo num celular mediano.
5. Gravação de tela de 20–30s do scroll (desktop + mobile) — matéria-prima do reel "US$ 490 website vs US$ 4.900 website".
6. Stills reais do cardápio do cliente pras seções internas, gerados nas ferramentas da casa.
