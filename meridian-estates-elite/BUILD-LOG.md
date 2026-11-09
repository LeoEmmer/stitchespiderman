# BUILD-LOG — Piloto 2 ELITE · Meridian Estates (luxury real estate)

**Data:** 09/11/2026 · **Pasta:** `~/workspace/cda-elite/piloto-2-realestate/`
**Base:** scaffold do Piloto 3 (`piloto-3-detailing/`) reaproveitado integralmente — mesma máquina (vanilla + GSAP/ScrollTrigger/Lenis vendored, palco pinado +400%, scrub em canvas com lerp 0,14, loader corrigido com contadores `settled/ok/failed`, poster pintado no canvas + fundo CSS do palco, `window.__scrubStatus()`, fallback `frames-failed`, versão estática `prefers-reduced-motion`, formulário com estado de sucesso, FAB click-to-call). Identidade nova: dark premium quente (bg #070604 · dourado #C6A15B · glow #E9CE8F · Sora/Inter).
**Negócio fictício de demonstração:** Meridian Estates, corretora de luxo em Marin — listing-herói "The Ridge House · Tiburon — $4,850,000 · 5 bd · 6 ba · 6,200 sqft" (números fictícios de demo).

## ⚠️ Footage — escolha e substituição (ler primeiro)

O clipe bespoke do plano (casa gerada por IA fazendo day→dusk com janelas acendendo, via Higgsfield) **não foi gerado** — créditos de vídeo do Higgsfield esgotados neste ciclo e a kie é reserva intocável (regra da casa, custo zero em mídia). No lugar, **stock gratuito do Pixabay**:

- **Clipe:** mansão moderna branca sobre uma encosta costeira, drone em arco lento se aproximando — 11,6s, usado o trecho **0,25s → 5,35s**
- **Autor/fonte:** seandeilgat — https://pixabay.com/videos/id-92009/
- **Licença:** Pixabay Content License (uso comercial permitido, sem atribuição obrigatória)
- **Como foi escolhido:** varredura via API do Pixabay (chave do MoneyPrinterTurbo) — 14 buscas, ~30 clipes avaliados com contact sheets (início/meio/fim). Rejeitados, entre outros: nuvens (64759/64767 — a busca "luxury house" retorna céu), gaivotas no pôr do sol (140111), skyline de Tóquio à noite (251074), cidade italiana em lago (67201), piscina de resort com banhistas (202392), corredor de piscina tropical sem casa (211152), cabana em CGI diurna (15356 — render, não fotografia) e casa no lago ao entardecer com a casa miúda no quadro (149153, ficou de reserva).
- **O truque do day→dusk:** o clipe é fim de tarde dourado, não uma transição real de luz. A progressão é **construída na grade, num passe único de ffmpeg por sequência**, via filtro `geq` com expressões por frame (`N`): luminância ×(1 − 0,30·N/61), croma aquecido progressivamente (cr +11·N/61, cb −9·N/61) + vinheta. Resultado medido na verificação: luminância média do canvas cai de 92,6 → 74,4 ao longo do scroll — o arco tarde → golden hour → entardecer **acontece no scrub**. (A alternativa óbvia, `eq` com expressão, foi testada e descartada: nesta build do ffmpeg ele NÃO avalia a expressão por frame — luminância ficou constante.)
- **O que a footage NÃO mostra (honesto):** as janelas não acendem literalmente e a piscina não aparece — o clipe é só exterior. Os beats 03 ("the house lights up") e 04 ("evenings end in the water") são carregados pela copy + pelo escurecimento progressivo, como no Piloto 3 as legendas carregavam a narrativa. A casa permanece o objeto-herói único em todos os 62 frames, em composição limpa — a regra do ator principal está cumprida.

**Troca futura (client-ready):** com créditos no Higgsfield, gerar o clipe bespoke (first frame = tarde, last frame = mesma casa ao entardecer com janelas acesas e piscina fumegante, movimento reversível, sem pessoas/texto) e rodar a mesma receita — o site não muda, só a pasta de frames (e a grade `geq` sai, porque a luz já vem no clipe).

## A sequência de frames (Receita B)

```bash
# receita usada (o -c:v libwebp é obrigatório: sem ele o ffmpeg 8.x desta
# máquina cai no libwebp_anim e grava UM webp animado em vez de frames;
# a grade progressiva é o geq com N = índice do frame, 0..61)
ffmpeg -ss 0.25 -t 5.1 -i ancora.mp4 -vf "fps=12,scale=1280:-2,format=yuv420p,\
geq=lum='clip(((lum(X,Y)-128)*1.06+128)*(1-0.30*N/61),0,255)'\
:cb='clip(128+(cb(X,Y)-128)*1.06-9*N/61,0,255)'\
:cr='clip(128+(cr(X,Y)-128)*1.06+11*N/61,0,255)',vignette=PI/6" \
-c:v libwebp -q:v 72 assets/frames/f%03d.webp
# mobile: mesma receita com scale=720:-2 e -q:v 68
```

| Sequência | Frames | Resolução | Peso total | Orçamento |
|---|---|---|---|---|
| Desktop | **62** | 1280×720 | **4,21 MB** | ≤ 5 MB ✅ |
| Mobile | **62** | 720×405 | **1,44 MB** | ≤ 3 MB ✅ |
| Poster (frame 1 da sequência) | 1 | 1280×720 | 92 KB | — |

## Stack e como a página funciona

- **Vanilla** HTML/CSS/JS, zero build. Libs **vendored** em `js/vendor/` (GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.18 — arquivos locais, sem CDN de terceiro no ar do cliente).
- **Lenis** no ticker do GSAP — integração padrão da SPEC.
- **Scrub:** seção `.story` com pin do palco (100svh) por +400% de scroll; progresso → frame alvo com **suavização (lerp 0,14)** — anda pra frente e pra trás sem engasgo. Os 6 beats (hero + Arrival → Golden hour → The lights → Evening → The offer com preço + CTA "Book a private tour") trocam por faixas de progresso; barra de progresso dourada no rodapé do palco.
- **Preload progressivo:** poster é o LCP (preload + `fetchpriority=high`); os 15 primeiros frames liberam o canvas interativo; o restante carrega em seguida, com barra visível ("Loading the light… %").
- **Âncoras** (nav, CTAs) rolam via `lenis.scrollTo`.
- **Reveals GSAP** em todas as seções (25 elementos).
- **Depois da história:** The Listing (grade de specs + texto de venda) · Details (rota cômodo a cômodo, 5 paradas) · Advisors (3 falas fictícias de corretores — **sem** schema de review) · formulário de tour privado com estado de confirmação — o envio real pro Supabase entra na fase de cliente.
- **`_headers`** incluído: cache imutável de 1 ano pros frames (padrão Cloudflare Pages da SPEC 2.5).

## SEO local (checklist 2.7)

- Title/meta com serviço + cidade ✅ · H1 único ✅ · JSON-LD `LocalBusiness` + `RealEstateAgent` com NAP fictício de demo (12 Main Street, Tiburon, CA 94920), geo, horários e `areaServed` ✅ (sem schema de reviews — as falas dos advisors são fictícias) · Open Graph com o poster ✅ · botão click-to-call fixo no mobile ✅ · alt descritivo no poster ✅.
- Pendente na publicação real: domínio definitivo no `canonical`/JSON-LD (hoje `meridianestates.example.com`, placeholder), GA4/Search Console, `sitemap.xml`/`robots.txt` (site de 1 página — gerar no deploy).

## Verificação (headless, 09/11/2026)

Bateria da casa (`verificacao/verify.js`, adaptada pros 62 frames; prints e relatórios JSON em `verificacao/`) — rodada **três vezes**: build canônica local, espelho packed local e **URL pública**:

| Teste | Canônica | Packed local | Ao vivo |
|---|---|---|---|
| Erros de JS na página | **0** | **0** | **0** |
| Frames assentados / ok / falhas | 62/62/0 | 62/62/0 | 62/62/0 |
| Canvas pronto + poster some | ✅ | ✅ | ✅ |
| Scrub no meio (55%) | frame 34, beat 3, luminância 92,6→74,4 ✅ | ✅ idem | ✅ idem |
| Fim da história (97,5%) | beat 5 + CTA "Book a private tour" ✅ | ✅ | ✅ |
| Scroll de volta (25%) | beat 1 — **scrub reversível** ✅ | ✅ | ✅ |
| Reveals | 25/25 visíveis ✅ | ✅ | ✅ |
| Formulário | sucesso com nome/telefone certos ✅ | ✅ | ✅ |
| Mobile 390px | set mobile carrega, FAB visível, 0 erros ✅ | ✅ | ✅ |
| `prefers-reduced-motion` | versão estática completa ✅ | ✅ | ✅ |
| **Total** | **16/16** | **16/16** | **16/16** |

Único erro de rede nos testes locais: Google Fonts bloqueado pelo proxy de saída desta VM (`ERR_TUNNEL_CONNECTION_FAILED`) — limitação do ambiente, não da página (no ar, via relay local com a CA do proxy, as fontes carregam; o fallback de sistema segura o layout de qualquer forma).

**Lighthouse formal não foi rodado** (mesma limitação de ambiente do Piloto 3); pelos números — peso inicial ≈ 250 KB (HTML+CSS+JS+poster), poster como LCP, canvas com altura reservada (CLS ~0), frames progressivos — a estrutura está dentro do orçamento da SPEC 2.6. Rodar o Lighthouse real no deploy de cliente.

## Como rodar / preview

```bash
cd ~/workspace/cda-elite/piloto-2-realestate
python3 -m http.server 8942
# abrir http://localhost:8942
```

Deploy: arrastar a pasta num projeto Cloudflare Pages (o `_headers` já está na raiz).

## Publicação — URL pública

### https://leoemmer.github.io/stitchespiderman/meridian-estates-elite/

- **Por que esse endereço:** a integração do GitHub **não tem permissão de criar repositórios** (403 no Piloto 3). Reaproveitado o repo antigo `LeoEmmer/stitchespiderman` (Pages ativo na branch `main`), publicando na subpasta **`meridian-estates-elite/`** — nenhum arquivo fora da subpasta foi tocado.
- **Espelho "packed":** o push via conector só aceita arquivos de texto (snapshot UTF-8), então os 124 frames + poster viajam **embutidos em base64** em `js/pack-*.js` (poster + 7 packs desktop + 3 packs mobile, cada um ≤ ~865 KB, em 11 commits fatiados). O `main.js` detecta `window.MAD_PACKED` e decodifica pras mesmas imagens via Blob URLs (suporte inerte na build canônica de arquivos). Cópia de publicação: `~/workspace/cda-elite/piloto-2-pages-repo/`; registro de sincronização: `~/workspace/cda-elite/piloto-2-pages-repo.muse-github-snapshot-sync.json` (11 entradas, uma por commit confirmado).
- **Corrida com o Piloto 1 (registro honesto):** o piloto do burger publicava no **mesmo repo/branch em paralelo**; duas tentativas minhas retornaram `Update is not a fast forward` porque o head andou durante a janela de aprovação do push. Conduta: nenhuma força, nada fora da minha subpasta — re-chequei o head, confirmei que minhas paths seguiam ausentes no remoto e repeti o push; com a sequência do burger encerrada, os 11 commits entraram limpos, um a um.
- **Verificação ao vivo (headless, desktop + mobile):** 62/62 frames nos dois sets, canvas pintado e **escurecendo** com o scroll (92,6→74,4), beat 3 no meio, beat 5 + CTA no fim, **0 erros de console** — prints `live-*` em `verificacao/`. (Nota de bastidor: o Chromium headless desta VM acessa o site público via relay local pro proxy de saída — `tools/verify/relay.js` — + `--ignore-certificate-errors` por causa da CA do proxy; o conteúdo foi conferido também via curl com a CA correta — 200 em todos os arquivos.)

## O que falta pra "client-ready"

1. **Clipe bespoke do Higgsfield** (mesma casa, tarde → entardecer de verdade, janelas acendendo, piscina ao anoitecer) — trocar `assets/frames*` mantendo nomes/contagem; ajustar `FRAME_COUNT` no `js/main.js` se mudar o fps; a grade progressiva `geq` sai nessa troca.
2. Ligar o formulário de tour no **Supabase** (padrão da casa) ou webhook Brevo.
3. Domínio real do cliente no canonical/JSON-LD/OG + GA4/Search Console + sitemap/robots.
4. Lighthouse mobile real no link do Pages (meta ≥ 90) + teste de scroll com o dedo num celular mediano.
5. Gravação de tela de 20–30s do scroll (desktop + mobile) — matéria-prima do reel "US$ 490 website vs US$ 4.900 website".
6. Stills reais do listing (interiores, piscina, vista) pros slots das seções internas, gerados nas ferramentas da casa.
