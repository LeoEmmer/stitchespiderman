# BUILD-LOG — Piloto 5 ELITE · Lumière Aesthetics (med spa premium) — PILOTO FINAL

**Data:** 09/11/2026 · **Pasta:** `~/workspace/cda-elite/piloto-5-medspa/`
**Base:** receita provada dos Pilotos 1–4 — scaffold vanilla + GSAP 3.12.5/ScrollTrigger + Lenis 1.1.18 vendored, palco pinado +400%, canvas com lerp 0,14, loader corrigido (contadores settled/ok/failed separados, poster no canvas + fundo CSS do palco, `window.__scrubStatus()`, classe `frames-failed`, `prefers-reduced-motion` estático) herdado **byte a byte** do Piloto 4; mudam marca, copy, tokens e a sequência de frames.
**Identidade própria (a peça CLARA do portfólio):** marfim quente #FAF6EF · dourado suave #B08D57 · glow #C9A86A · texto carvão profundo #2B2620 · Sora/Inter. Véu do palco em gradiente de marfim (não escuro), sombras de texto claras, cartões brancos com sombra dourada suave.
**Negócio (fictício, demo):** Lumière Aesthetics — med spa premium em San Rafael, CA. Preços: Signature Facial $180 · HydraGlow $240 · The Lumière Ritual $320. **Copy 100% cosmética/wellness — nenhuma promessa médica ou de resultado em lugar nenhum** (sem "anti-aging", sem antes/depois, sem schema de reviews).

## ⚠️ Substituição importante (ler primeiro)

O clipe-âncora bespoke do plano (ritual completo gerado: consult → tratamento → glow → reveal, via Higgsfield) **não foi gerado** — créditos de vídeo do Higgsfield esgotados neste ciclo e a kie é reserva intocável (regra da casa, custo zero em mídia). No lugar, a sequência roda com **stock gratuito do Pixabay**:

- **Clipe:** momento de tratamento sereno em spa claro — cliente em primeiro plano, olhos fechados, mãos da terapeuta trabalhando pescoço/ombros, luz do dia suave, linho branco, 8,0s usados (janela 1,0s–9,0s do original de 14,5s), 1920×1080
- **Autor/fonte:** Eaktas06 — https://pixabay.com/videos/id-172687/
- **Licença:** Pixabay Content License (uso comercial permitido, sem atribuição obrigatória)
- **Como foi escolhido:** varredura via API do Pixabay (chave do MoneyPrinterTurbo), **15 buscas e 25+ candidatos avaliados por contact sheet/stills** contra a regra do ator principal (um cliente, momento sereno, luz suave, sem multidão, sem marca de terceiros, sem imaginário clínico/médico). Rejeitados com motivo: tratamento a laser com luvas e proteção ocular (id 137122 — clínico/médico) · aplicação de máscara facial com luvas de látex em ambiente azul escuro (id 129165 — clínico) · animação 3D de células da pele (id 276968 — gráfico médico) · salas de massagem cinzentas e planas em série (id 135150–135155 — escuras, clínicas, fora da identidade clara) · rotina de skincare caseira no espelho, aplicação própria olhando pra câmera (id 346145 — DIY, não é tratamento) · salão de beleza com produto rotulado em quadro (id 6997 — marca de terceiros) · montagem de cortes de massagem tailandesa (id 701 — vários cortes, sem momento único) · still lifes de spa sem pessoa (id 257902/266129 — lindos, mas parados: scrub sem movimento) · modelo segurando pote de cosmético (id 301426 — anúncio de produto) · banheira de hidromassagem vazia (id 38316 — sem pessoa).
- **Ressalvas honestas do clipe escolhido:** (1) a cena é de um **spa de casal** — um segundo cliente descansa na mesa ao fundo; a heroína ocupa o primeiro plano inteiro (rosto sereno, mãos da terapeuta) e carrega todos os beats, mas quem olhar o fundo vê a segunda mesa. O catálogo gratuito do Pixabay simplesmente não tem um facial single-client em sala clara no padrão — as alternativas eram piores em todos os outros critérios. (2) É um spa claro à beira de piscina, não uma sala de tratamento interna. (3) O grade original é quente/saturado demais — corrigido na grade abaixo.
- **Efeito na narrativa:** o clipe mostra **um** momento contínuo do ritual — o tratamento em curso — e não os 5 atos. Os 6 beats seguem a história completa (hero → consult → tratamento → glow → reveal → preço/CTA) **carregada pelas legendas**, com o visual sustentando serenidade, luz e textura — o mesmo arranjo dos Pilotos 1/3/4.

**Troca futura (client-ready):** quando o Higgsfield tiver créditos, gerar o clipe bespoke do ritual seguindo a seção 2.4 do `PILOTOS-ELITE-v1.md` (first/last frame definidos, fundo claro contínuo, movimento reversível, uma cliente) e rodar a mesma receita — o site não muda, só a pasta de frames. Resolve também as ressalvas (1) e (2).

## A sequência de frames (Receita B) — grade CLARA

```bash
# grade adaptada pra identidade light: SEM vinheta (a vinheta da receita
# escurece as bordas e "suja" footage clara) e com correção do cast
# laranja do stock (saturação 0,88 + colorbalance esfriando os meios-tons)
GRADE="eq=contrast=1.03:brightness=0.015:saturation=0.88,colorbalance=rm=-0.05:gm=-0.01:bm=0.06:rh=-0.03:bh=0.04"
ffmpeg -ss 1.0 -i ancora.mp4 -t 8.0 -vf "fps=12,scale=1280:-2,$GRADE" -c:v libwebp -q:v 72 assets/frames/f%03d.webp
ffmpeg -ss 1.0 -i ancora.mp4 -t 8.0 -vf "fps=12,scale=720:-2,$GRADE"  -c:v libwebp -q:v 68 assets/frames-mobile/f%03d.webp
# (-c:v libwebp obrigatório: sem ele o ffmpeg 8.x grava UM webp animado)
```

| Sequência | Frames | Resolução | Peso total | Orçamento |
|---|---|---|---|---|
| Desktop | **96** | 1280×720 | **3,4 MB** | ≤ 5 MB ✅ |
| Mobile | **96** | 720×405 | **1,6 MB** | ≤ 3 MB ✅ |
| Poster (LCP/fallback) | 1 | 1280×720 | 46 KB | — |

## Stack e como a página funciona

- **Vanilla** HTML/CSS/JS, zero build. Libs **vendored** em `js/vendor/` (GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.18 — arquivos locais, idênticos aos dos Pilotos 1/3/4).
- **Lenis** no ticker do GSAP (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`) — integração padrão da SPEC.
- **Scrub:** seção `.story` com pin do palco (100svh) por +400% de scroll; progresso → frame alvo com **suavização (lerp 0,14)** — anda pra frente e pra trás sem engasgo. Os 6 beats (hero + 5 atos) trocam por faixas de progresso; barra de progresso dourada no rodapé do palco.
- **Preload progressivo:** poster é o LCP (preload + `fetchpriority=high`); os 15 primeiros frames liberam o canvas interativo; o restante carrega em seguida, com barra visível ("Loading the calm… %").
- **Loader corrigido (herdado):** o canvas só assume depois que um frame **real** foi pintado; falha total → poster travado visível via CSS, beats/copy seguem, `console.error` claro. Handle: `window.__scrubStatus()`.
- **Âncoras** (nav, CTAs) rolam via `lenis.scrollTo`.
- **Reveals GSAP** em todas as seções (32 elementos).
- **Serviços:** Signature Facial **$180** · HydraGlow **$240** (featured) · The Lumière Ritual **$320** + faixa de enhancements (soft light $45 · cooling globe $25 · warm stone $30 · extended massage $35). Quotes fictícios curtos (3, Marin) focados na experiência — **sem** schema de reviews no JSON-LD, como manda a regra.
- **Formulário de consulta:** validação + estado de confirmação em JS ("confirm your consultation") — o envio real pro Supabase entra na fase de cliente.
- **`_headers`** incluído: cache imutável de 1 ano pros frames (padrão Cloudflare Pages da SPEC 2.5).

## SEO local (checklist 2.7)

- Title/meta com serviço + cidade ✅ · H1 único ✅ · JSON-LD `DaySpa` com NAP fictício de demo (1623 Fifth Avenue, San Rafael), geo, horários e `areaServed` ✅ (sem schema de reviews) · Open Graph com o poster ✅ · botão click-to-call fixo no mobile ✅ · alt descritivo no poster ✅.
- Pendente na publicação real: domínio definitivo no `canonical`/JSON-LD (hoje `lumiereaesthetics.example.com`, placeholder), GA4/Search Console, `sitemap.xml`/`robots.txt`.

## Verificação (headless, 09/11/2026)

Chromium headless (Playwright) + bateria de 16 checks em `~/workspace/tools/verify/verify-p5.js`; prints e relatórios em `verificacao/`. **3 rodadas — build canônica local · espelho packed local · URL pública ao vivo: 16/16 nas três.**

| Teste | Resultado |
|---|---|
| Erros de JS na página | **0** (desktop e mobile, local e ao vivo) |
| Frames carregados | **ok 96/96** nos dois sets (desktop + mobile), 0 falhas |
| Canvas pronto + poster some | ✅ |
| Scrub no meio (55%) | frame avança (drawnFrame 52), beat 3 ativo ✅ |
| Fim da história (97,5%) | beat 5 + CTA "Book your consultation" ✅ |
| Scroll de volta (25%) | beat 1 — **scrub reversível** ✅ |
| Reveals | 32/32 visíveis ✅ |
| Formulário | estado de sucesso com nome/telefone certos ✅ |
| Mobile 390px | frame set mobile carrega, FAB de ligação visível, 0 erros ✅ |
| `prefers-reduced-motion` | versão estática completa (poster + beats em lista), palco oculto ✅ |
| Peso inicial (HTML+CSS+JS+poster) | **~205 KB** (meta < 1,5 MB ✅) |
| Peso total do site | ~5,2 MB |

Nota de bastidor: nos testes locais o Google Fonts é bloqueado pelo proxy de saída desta VM (`ERR_TUNNEL_CONNECTION_FAILED`) — limitação do ambiente, não da página; ao vivo, via relay local, as fontes Sora/Inter carregam (nos prints locais o layout se sustenta no fallback de sistema).

**Lighthouse formal não foi rodado** (mesma limitação dos pilotos anteriores); pelos números — peso inicial de ~205 KB, poster como LCP, canvas com altura reservada (CLS ~0), frames progressivos — a estrutura está dentro do orçamento da SPEC 2.6. Rodar o Lighthouse real no deploy de cliente (Cloudflare Pages).

## Como rodar / preview

```bash
cd ~/workspace/cda-elite/piloto-5-medspa
python3 -m http.server 8935
# abrir http://localhost:8935
```

Deploy: arrastar a pasta num projeto Cloudflare Pages (o `_headers` já está na raiz).

## Publicação — URL pública

### https://leoemmer.github.io/stitchespiderman/lumiere-aesthetics-elite/

- **Mesma rota dos Pilotos 1–4:** subpasta do repo antigo `LeoEmmer/stitchespiderman` (Pages ativo na branch `main`) — o conteúdo original do jogo e as subpastas dos outros pilotos **não foram tocados**.
- **Espelho "packed":** os 192 frames + poster viajam **embutidos em base64** em `js/pack-*.js` (poster + 6 packs desktop + 3 packs mobile, cada um ≤ ~871 KB). O `main.js` detecta `window.MAD_PACKED` e decodifica pras mesmas imagens via Blob URLs (suporte inerte na build canônica). Cópia de publicação: `~/workspace/cda-elite/piloto-5-pages-repo/`; registro de sincronização: `~/workspace/cda-elite/piloto-5-pages-repo.muse-github-snapshot-sync.json`.
- **Commits:** 89331f7c (core) · 7c3f00bb (pack-desktop-1) · bf3175f8 (pack-desktop-2) · 6d891107 (pack-desktop-3) · 52220d3f (pack-desktop-4) · 8707eb5d (pack-desktop-5) · 089b766f (pack-desktop-6) · 89391cd4 (pack-mobile-1) · 17ca3140 (pack-mobile-2) · 87076708 (pack-mobile-3) · este BUILD-LOG
- **Verificação ao vivo (headless, desktop + mobile):** `ok 96/96` nos dois, canvas pintado e mudando com o scroll, beat 3 no meio, beat 5 + CTA no fim, **0 erros de console** — prints `live-*` em `verificacao/`.

## O que falta pra "client-ready"

1. **Clipe bespoke do Higgsfield** (ritual completo: consult → tratamento → glow → reveal, fundo claro contínuo, first/last frame, UMA cliente em sala de tratamento) — trocar `assets/frames*` mantendo nomes/contagem; ajustar `FRAME_COUNT` no `js/main.js` se mudar o fps. Resolve as ressalvas da cena de casal/poolside.
2. Ligar o formulário de consulta no **Supabase** (padrão da casa) ou webhook Brevo.
3. Domínio real do cliente no canonical/JSON-LD/OG + GA4/Search Console + sitemap/robots.
4. Lighthouse mobile real no link do Pages (meta ≥ 90) + teste de scroll com o dedo num celular mediano.
5. Gravação de tela de 20–30s do scroll (desktop + mobile) — matéria-prima do reel "US$ 490 website vs US$ 4.900 website".
6. Stills reais do interior da clínica do cliente pras seções internas, gerados nas ferramentas da casa.
7. Fotos/credenciais reais da equipe e revisão legal da copy (claims) antes de qualquer uso comercial.
