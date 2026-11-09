# BUILD-LOG — Piloto 4 ELITE · Crown & Blade (barbearia premium)

**Data:** 09/11/2026 · **Pasta:** `~/workspace/cda-elite/piloto-4-barber/`
**Base:** receita provada dos Pilotos 3/1 — scaffold vanilla + GSAP 3.12.5/ScrollTrigger + Lenis 1.1.18 vendored, palco pinado +400%, canvas com lerp 0,14, loader corrigido (contadores settled/ok/failed separados, poster no canvas + fundo CSS do palco, `window.__scrubStatus()`, classe `frames-failed`, `prefers-reduced-motion` estático) herdado **byte a byte** do Piloto 1; mudam marca, copy, tokens e a sequência de frames. Identidade própria: barber luxury clássico — verde profundo #0A0E0B · brass #C8A24A · glow dourado #E9CE8C · Sora/Inter.
**Negócio (fictício, demo):** Crown & Blade — barbearia premium em San Rafael, CA. Preços: Signature Cut $45 · Cut + Beard $65 · The Full Works $85.

## ⚠️ Substituição importante (ler primeiro)

O clipe-âncora bespoke do plano (ritual completo gerado: consult → clipper → toalha quente → navalha → reveal, via Higgsfield) **não foi gerado** — créditos de vídeo do Higgsfield esgotados neste ciclo e a kie é reserva intocável (regra da casa, custo zero em mídia). No lugar, a sequência roda com **stock gratuito do Pixabay**:

- **Clipe:** close fechado de clipper-over-comb trabalhando o topo/lateral de um único cliente, barbeiro de luvas pretas, luz suave de janela, 7,85s, 1920×1080
- **Autor/fonte:** aghyadnajjar — https://pixabay.com/videos/id-48968/
- **Licença:** Pixabay Content License (uso comercial permitido, sem atribuição obrigatória)
- **Como foi escolhido:** varredura via API do Pixabay (chave do MoneyPrinterTurbo), 5 buscas e 10 candidatos avaliados por contact sheet contra a **regra do ator principal** (um cliente, trabalho próximo, luz moody, sem montagem de multidão, sem marca de negócio de terceiros). Rejeitados com motivo: salão claro com várias cadeiras e clientes de máscara (id 58444 — plano aberto, multidão) · salão neon movimentado com letreiro (id 101956/101959 — multidão + texto em cena) · documentário claro de barbearia com segundo rosto no espelho (id 39763/39767 — luz plana, sem clima) · styling caseiro com escova rosa em fundo branco (id 42964 — DIY, fora do posicionamento) · auto-barbeamento em banheiro claro (id 32057 — não é barbearia) · clipper manual vintage sobre fundo bege sem cliente (id 116192 — objeto sem ritual) · finalização com secador do mesmo barbeiro/cliente (id 48969 — ótimo, mas o 48968 é o momento-ritual mais forte).
- **Efeito na narrativa (honesto):** o clipe mostra **um** momento contínuo do ritual — o trabalho de clipper em close — e não os 5 atos. Os 6 beats seguem a história completa (hero → consult → detalhe → toalha → navalha → reveal) **carregada pelas legendas**, com o visual sustentando textura, precisão e clima — o mesmo arranjo dos Pilotos 3/1. Grade cinematográfica uniforme (contraste + vinheta + saturação 0,94) pra sentar no fundo verde profundo.
- **Ressalva de marca de ferramenta:** no corpo do clipper lê-se parcialmente a marca do fabricante da máquina ("Wahl Senior") — é a marca **da ferramenta de trabalho** do barbeiro, pequena no quadro e parcialmente fora de foco, como em qualquer barbearia real; não é marca de negócio/loja de terceiros. Fica registrada pra decisão consciente; o clipe bespoke client-ready (abaixo) elimina a questão.

**Troca futura (client-ready):** quando o Higgsfield tiver créditos, gerar o clipe bespoke do ritual seguindo a seção 2.4 do `PILOTOS-ELITE-v1.md` (first/last frame definidos, fundo dark contínuo, movimento reversível) e rodar a mesma receita — o site não muda, só a pasta de frames.

## A sequência de frames (Receita B)

```bash
# receita usada (o -c:v libwebp é obrigatório: sem ele o ffmpeg 8.x desta
# máquina cai no libwebp_anim e grava UM webp animado em vez de frames)
ffmpeg -i ancora.mp4 -vf "fps=12,scale=1280:-2,eq=contrast=1.07:brightness=-0.02:saturation=0.94,vignette=PI/5" -c:v libwebp -q:v 72 assets/frames/f%03d.webp
ffmpeg -i ancora.mp4 -vf "fps=12,scale=720:-2,<mesma grade>"  -c:v libwebp -q:v 68 assets/frames-mobile/f%03d.webp
```

| Sequência | Frames | Resolução | Peso total | Orçamento |
|---|---|---|---|---|
| Desktop | **94** | 1280×720 | **2,22 MB** | ≤ 5 MB ✅ |
| Mobile | **94** | 720×405 | **1,08 MB** | ≤ 3 MB ✅ |
| Poster (LCP/fallback) | 1 | 1280×720 | 38 KB | — |

## Stack e como a página funciona

- **Vanilla** HTML/CSS/JS, zero build. Libs **vendored** em `js/vendor/` (GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.18 — arquivos locais, idênticos aos dos Pilotos 1/3, copiados da pasta do Piloto 1).
- **Lenis** no ticker do GSAP (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`) — integração padrão da SPEC.
- **Scrub:** seção `.story` com pin do palco (100svh) por +400% de scroll; progresso → frame alvo com **suavização (lerp 0,14)** — anda pra frente e pra trás sem engasgo. Os 6 beats (hero + 5 atos) trocam por faixas de progresso; barra de progresso brass no rodapé do palco.
- **Preload progressivo:** poster é o LCP (preload + `fetchpriority=high`); os 15 primeiros frames liberam o canvas interativo; o restante carrega em seguida, com barra visível ("Loading the ritual… %").
- **Loader corrigido (herdado):** o canvas só assume depois que um frame **real** foi pintado; falha total → poster travado visível via CSS, beats/copy seguem, `console.error` claro. Handle: `window.__scrubStatus()`.
- **Âncoras** (nav, CTAs) rolam via `lenis.scrollTo`.
- **Reveals GSAP** em todas as seções (32 elementos).
- **Serviços:** Signature Cut **$45** · Cut + Beard **$65** (featured) · The Full Works **$85** + faixa de add-ons (hot towel $10 · beard sculpt $25 · grey blending $30 · kids $35). Reviews fictícios curtos (3, Marin) — **sem** schema de reviews no JSON-LD, como manda a regra.
- **Formulário de booking:** validação + estado de confirmação em JS ("confirm your chair") — o envio real pro Supabase entra na fase de cliente.
- **`_headers`** incluído: cache imutável de 1 ano pros frames (padrão Cloudflare Pages da SPEC 2.5).

## SEO local (checklist 2.7)

- Title/meta com serviço + cidade ✅ · H1 único ✅ · JSON-LD `BarberShop` com NAP fictício de demo (915 Fourth Street, San Rafael), geo, horários e `areaServed` ✅ (sem schema de reviews) · Open Graph com o poster ✅ · botão click-to-call fixo no mobile ✅ · alt descritivo no poster ✅.
- Pendente na publicação real: domínio definitivo no `canonical`/JSON-LD (hoje `crownandblade.example.com`, placeholder), GA4/Search Console, `sitemap.xml`/`robots.txt`.

## Verificação (headless, 09/11/2026)

Chromium headless (Playwright) + bateria de 16 checks em `~/workspace/tools/verify/verify-p4*.js`; prints e relatórios em `verificacao/`. **3 rodadas — build canônica local · espelho packed local · URL pública ao vivo: 16/16 nas três.**

| Teste | Resultado |
|---|---|
| Erros de JS na página | **0** (desktop e mobile, local e ao vivo) |
| Frames carregados | **ok 94/94** nos dois sets (desktop + mobile), 0 falhas |
| Canvas pronto + poster some | ✅ |
| Scrub no meio (55%) | frame avança (drawnFrame 51), beat 3 ativo ✅ |
| Fim da história (97,5%) | beat 5 + CTA "Book your chair" ✅ |
| Scroll de volta (25%) | beat 1 — **scrub reversível** ✅ |
| Reveals | 32/32 visíveis ✅ |
| Formulário | estado de sucesso com nome/telefone certos ✅ |
| Mobile 390px | frame set mobile carrega, FAB de ligação visível, 0 erros ✅ |
| `prefers-reduced-motion` | versão estática completa (poster + beats em lista), palco oculto ✅ |
| Peso inicial (HTML+CSS+JS+poster) | **208 KB** (meta < 1,5 MB ✅) |
| Peso total do site | 3,51 MB |

Nota de bastidor (rodada ao vivo): na primeira passagem, o desktop passou 16/16 mas o set mobile retornou 404 — os arquivos **estavam** no head do repo (commits confirmados), era o deploy do GitHub Pages ainda propagando os últimos commits; ~1 min depois os packs serviram 200 e a rodada completa refeita passou **16/16**. Único erro de rede nos testes locais: Google Fonts bloqueado pelo proxy de saída desta VM — limitação do ambiente, não da página (ao vivo, via relay local, as fontes carregaram).

**Lighthouse formal não foi rodado** (mesma limitação dos pilotos anteriores); pelos números — peso inicial de 208 KB, poster como LCP, canvas com altura reservada (CLS ~0), frames progressivos — a estrutura está dentro do orçamento da SPEC 2.6. Rodar o Lighthouse real no deploy de cliente (Cloudflare Pages).

## Como rodar / preview

```bash
cd ~/workspace/cda-elite/piloto-4-barber
python3 -m http.server 8934
# abrir http://localhost:8934
```

Deploy: arrastar a pasta num projeto Cloudflare Pages (o `_headers` já está na raiz).

## Publicação — URL pública

### https://leoemmer.github.io/stitchespiderman/crown-and-blade-elite/

- **Mesma rota dos Pilotos 1–3:** subpasta do repo antigo `LeoEmmer/stitchespiderman` (Pages ativo na branch `main`) — o conteúdo original do jogo e as subpastas dos outros pilotos **não foram tocados**.
- **Espelho "packed":** os 188 frames + poster viajam **embutidos em base64** em `js/pack-*.js` (poster + 4 packs desktop + 2 packs mobile, cada um ≤ ~877 KB). O `main.js` detecta `window.MAD_PACKED` e decodifica pras mesmas imagens via Blob URLs (suporte inerte na build canônica). Cópia de publicação: `~/workspace/cda-elite/piloto-4-pages-repo/`; registro de sincronização: `~/workspace/cda-elite/piloto-4-pages-repo.muse-github-snapshot-sync.json`.
- **Commits:** 9da71a04 (core) · c9e59731 (pack-desktop-1) · 65309014 (pack-desktop-2) · b473a259 (pack-desktop-3) · 6b05eb4d (pack-desktop-4) · 52a8e949 (pack-mobile-1) · 6031a99c (pack-mobile-2) · este BUILD-LOG.
- **Concorrência registrada:** a republicação do Piloto 1 (remake de footage) empurrou commits no mesmo repo durante esta publicação — 3 pushes retornaram "not a fast forward"/"Reference cannot be updated" e foram repetidos após re-checar o head, até pousarem; nenhum arquivo fora de `crown-and-blade-elite/` foi alterado por esta build.
- **Verificação ao vivo (headless, desktop + mobile):** `ok 94/94` nos dois, canvas pintado e mudando com o scroll, beat 3 no meio, beat 5 + CTA no fim, **0 erros de console** — prints `live-*` em `verificacao/`.

## O que falta pra "client-ready"

1. **Clipe bespoke do Higgsfield** (ritual completo: consult → clipper → toalha → navalha → reveal, fundo dark contínuo, first/last frame) — trocar `assets/frames*` mantendo nomes/contagem; ajustar `FRAME_COUNT` no `js/main.js` se mudar o fps. Resolve também a ressalva da marca da ferramenta.
2. Ligar o formulário de booking no **Supabase** (padrão da casa) ou webhook Brevo.
3. Domínio real do cliente no canonical/JSON-LD/OG + GA4/Search Console + sitemap/robots.
4. Lighthouse mobile real no link do Pages (meta ≥ 90) + teste de scroll com o dedo num celular mediano.
5. Gravação de tela de 20–30s do scroll (desktop + mobile) — matéria-prima do reel "US$ 490 website vs US$ 4.900 website".
6. Stills reais do interior da barbearia do cliente pras seções internas, gerados nas ferramentas da casa.
