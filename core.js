
// Modais
function abrirModalContribuir() {
  document.getElementById('modal-contribuir').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function fecharModalContribuir(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('modal-contribuir').classList.remove('active');
  document.body.style.overflow = '';
}
function abrirModalMensagem() {
  const el = document.getElementById('modal-mensagem');
  if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function fecharModalMensagem(e) {
  if (e && e.target !== e.currentTarget) return;
  const el = document.getElementById('modal-mensagem');
  if (el) el.classList.remove('active');
  document.body.style.overflow = '';
}
function abrirModalMensagemEnviada() {
  const el = document.getElementById('modal-mensagem-enviada');
  if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function fecharModalMensagemEnviada(e) {
  if (e && e.target !== e.currentTarget) return;
  const el = document.getElementById('modal-mensagem-enviada');
  if (el) el.classList.remove('active');
  document.body.style.overflow = '';
}
function fecharModalMensagemCompleta(e) {
  if (e && e.target !== e.currentTarget) return;
  const el = document.getElementById('modal-mensagem-completa');
  if (el) el.classList.remove('active');
  document.body.style.overflow = '';
}
function mostrarDadosPix() {
  const el = document.getElementById('dados-pix');
  el.classList.toggle('hidden');
}
function copiarPix() {
  const txt = document.getElementById('chave-pix').textContent;
  navigator.clipboard.writeText(txt).then(() => alert('Chave PIX copiada!'));
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    fecharModalContribuir();
    fecharModalGaleria();
    fecharModalMensagem();
    fecharModalMensagemEnviada();
    fecharModalMensagemCompleta();
    document.body.style.overflow = '';
  }
});

// Galeria mosaico + lightbox
(function initGaleria() {
  const container = document.getElementById('galeria-mosaico');
  const moreWrapper = document.getElementById('galeria-more-wrapper');
  const moreBtn = document.getElementById('galeria-mostrar-mais');
  const imagens = window.GALERIA_IMAGES || [];

  if (!container || imagens.length === 0) return;

  const INICIAL_MOBILE = 2;
  const INICIAL_DESKTOP = 6;
  const BATCH_MOBILE = 2;
  const BATCH_DESKTOP = 6;

  function isDesktop() {
    return window.innerWidth >= 640;
  }

  function getInicial() {
    return isDesktop() ? INICIAL_DESKTOP : INICIAL_MOBILE;
  }

  function getBatch() {
    return isDesktop() ? BATCH_DESKTOP : BATCH_MOBILE;
  }

  let limiteVisivel = getInicial();

  function renderGaleria() {
    const qty = Math.min(limiteVisivel, imagens.length);
    container.innerHTML = imagens.slice(0, qty).map((src, i) => `
      <button type="button" class="galeria-item block w-full aspect-square rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2" data-index="${i}" aria-label="Ver foto ${i + 1}">
        <img src="assets/${src}" alt="" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy">
      </button>
    `).join('');

    if (limiteVisivel < imagens.length) {
      moreWrapper.classList.remove('hidden');
    } else {
      moreWrapper.classList.add('hidden');
    }

    container.querySelectorAll('.galeria-item').forEach((btn, i) => {
      btn.addEventListener('click', () => abrirModalGaleria(i));
    });
  }

  moreBtn?.addEventListener('click', () => {
    limiteVisivel = Math.min(limiteVisivel + getBatch(), imagens.length);
    renderGaleria();
  });

  window.addEventListener('resize', () => {
    const novoInicial = getInicial();
    if (limiteVisivel < novoInicial) {
      limiteVisivel = novoInicial;
      renderGaleria();
    }
  });

  renderGaleria();

  // Modal lightbox
  const modal = document.getElementById('modal-galeria');
  const imgEl = document.getElementById('galeria-img');
  const contadorEl = document.getElementById('galeria-contador');
  let indexAtual = 0;

  function abrirModalGaleria(i) {
    indexAtual = i;
    imgEl.src = 'assets/' + imagens[indexAtual];
    contadorEl.textContent = `${indexAtual + 1} / ${imagens.length}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function fecharModalGaleria(e) {
    if (e && e.target !== e.currentTarget) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function galeriaPrev() {
    indexAtual = (indexAtual - 1 + imagens.length) % imagens.length;
    imgEl.src = 'assets/' + imagens[indexAtual];
    contadorEl.textContent = `${indexAtual + 1} / ${imagens.length}`;
  }

  function galeriaNext() {
    indexAtual = (indexAtual + 1) % imagens.length;
    imgEl.src = 'assets/' + imagens[indexAtual];
    contadorEl.textContent = `${indexAtual + 1} / ${imagens.length}`;
  }

  window.fecharModalGaleria = fecharModalGaleria;

  container.querySelectorAll('.galeria-item').forEach((btn, i) => {
    btn.addEventListener('click', () => abrirModalGaleria(i));
  });

  document.getElementById('galeria-prev')?.addEventListener('click', (e) => { e.stopPropagation(); galeriaPrev(); });
  document.getElementById('galeria-next')?.addEventListener('click', (e) => { e.stopPropagation(); galeriaNext(); });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); galeriaPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); galeriaNext(); }
  });
})();

// Mensagens - DESATIVADO (descomentar seção no HTML para ativar)
const form = document.getElementById('form-mensagem');
const listaMensagens = document.getElementById('lista-mensagens');
const paginacaoMensagens = document.getElementById('paginacao-mensagens');

if (form && listaMensagens) {
const HOOK_BASE_URL = 'http://localhost:3001/hook/c133decc-3dc0-4fed-87b6-3c7ce532f767';
const MENSAGENS_ENDPOINT = HOOK_BASE_URL;
const MENSAGENS_API = HOOK_BASE_URL + '/messages';
const LIMIT = 8;

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function textoCard(item) {
  const p = item.payload || {};
  if (p.mensagem) return p.mensagem;
  if (p.telefone) return `${p.nome || ''} — ${p.telefone}`;
  return JSON.stringify(p).slice(0, 100) || '—';
}

function autorCard(item) {
  const p = item.payload || {};
  const nome = p.nome || 'Anônimo';
  const cidade = p.cidade || '';
  return cidade ? `${nome}, ${cidade}` : nome;
}

async function buscarMensagens(page = 1) {
  try {
    listaMensagens.innerHTML = '<p class="text-gray/50 py-12 min-w-full">Carregando...</p>';
    const url = `${MENSAGENS_API}?page=${page}&limit=${LIMIT}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const json = await res.json();
    const { data = [], pagination } = json;
    renderizarMensagens(data, pagination);
    renderizarPaginacao(pagination);
  } catch (err) {
    console.error(err);
    listaMensagens.innerHTML = '<p class="text-gray/50 py-12 min-w-full">Não foi possível carregar as mensagens. Tente mais tarde.</p>';
    paginacaoMensagens.innerHTML = '';
    msgPrev && (msgPrev.style.display = 'none');
    msgNext && (msgNext.style.display = 'none');
  }
}

const msgPrev = document.getElementById('msg-prev');
const msgNext = document.getElementById('msg-next');
const SCROLL_AMOUNT = 336;
const MAX_CARD_CHARS = 120;
let mensagensAtuais = [];

function setupMsgArrows() {
  msgPrev?.addEventListener('click', () => {
    listaMensagens.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  });
  msgNext?.addEventListener('click', () => {
    listaMensagens.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  });
  listaMensagens?.addEventListener('scroll', atualizarMsgArrows);
}

function atualizarMsgArrows() {
  if (!msgPrev || !msgNext) return;
  const { scrollLeft, scrollWidth, clientWidth } = listaMensagens;
  const podeVoltar = scrollLeft > 0;
  const podeAvancar = scrollLeft < scrollWidth - clientWidth - 1;
  msgPrev.style.display = podeVoltar ? 'flex' : 'none';
  msgNext.style.display = podeAvancar ? 'flex' : 'none';
  msgPrev.disabled = !podeVoltar;
  msgNext.disabled = !podeAvancar;
}

function truncarTexto(texto, maxLen) {
  if (!texto || texto.length <= maxLen) return texto;
  return texto.slice(0, maxLen).trim() + '…';
}

function renderizarMensagens(data, pagination) {
  if (!data || data.length === 0) {
    listaMensagens.innerHTML = '<p class="text-gray/50 py-12 min-w-full">Seja o primeiro a deixar uma mensagem de apoio!</p>';
    msgPrev && (msgPrev.style.display = 'none');
    msgNext && (msgNext.style.display = 'none');
    return;
  }
  mensagensAtuais = data;
  listaMensagens.innerHTML = data.map((item, i) => {
    const texto = textoCard(item);
    const autor = autorCard(item);
    const truncado = truncarTexto(texto, MAX_CARD_CHARS);
    const isLongo = texto && texto.length > MAX_CARD_CHARS;
    const clickable = isLongo ? `cursor-pointer hover:shadow-xl transition-shadow` : '';
    const onclick = isLongo ? `onclick="abrirModalMensagemCompleta(${i})"` : '';
    return `
    <div class="fade-in shrink-0 w-72 sm:w-80 p-5 rounded-2xl bg-white shadow-lg border border-gray/5 ${clickable}" ${onclick} style="animation-delay: ${i * 0.04}s">
      <p class="text-gray/90 leading-relaxed">${escapeHtml(truncado)}</p>
      <p class="text-sm text-gray/60 mt-3">— ${escapeHtml(autor)}</p>
    </div>
  `;
  }).join('');
  msgPrev && (msgPrev.style.display = 'flex');
  msgNext && (msgNext.style.display = 'flex');
  setTimeout(atualizarMsgArrows, 50);
}

function abrirModalMensagemCompleta(i) {
  const item = mensagensAtuais[i];
  if (!item) return;
  const texto = textoCard(item);
  const autor = autorCard(item);
  document.getElementById('modal-mensagem-texto').textContent = texto;
  document.getElementById('modal-mensagem-autor').textContent = '— ' + autor;
  document.getElementById('modal-mensagem-completa').classList.add('active');
  document.body.style.overflow = 'hidden';
}
window.abrirModalMensagemCompleta = abrirModalMensagemCompleta;

function renderizarPaginacao(pagination) {
  if (!pagination || pagination.totalPages <= 1) {
    paginacaoMensagens.innerHTML = '';
    return;
  }
  const { page, totalPages } = pagination;
  paginacaoMensagens.innerHTML = `
    <button type="button" onclick="irParaPagina(${page - 1})" ${page <= 1 ? 'disabled' : ''} class="px-4 py-2 rounded-xl border border-gray/20 text-gray/80 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-beige/50 transition-colors">
      Anterior
    </button>
    <span class="text-sm text-gray/70">Página ${page} de ${totalPages}</span>
    <button type="button" onclick="irParaPagina(${page + 1})" ${page >= totalPages ? 'disabled' : ''} class="px-4 py-2 rounded-xl border border-gray/20 text-gray/80 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-beige/50 transition-colors">
      Próxima
    </button>
  `;
}

function irParaPagina(p) {
  if (p < 1) return;
  buscarMensagens(p);
}
window.irParaPagina = irParaPagina;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome) { alert('Por favor, informe seu nome.'); return; }
  if (!mensagem) { alert('Por favor, escreva uma mensagem.'); return; }

  const payload = { nome, cidade, mensagem, data: new Date().toISOString() };
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnTexto = submitBtn.textContent;

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    const res = await fetch(MENSAGENS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(res.statusText);
    form.reset();
    fecharModalMensagem();
    abrirModalMensagemEnviada();
    document.getElementById('mensagens').scrollIntoView({ behavior: 'smooth' });
    buscarMensagens(1);
  } catch (err) {
    console.error(err);
    alert('Não foi possível enviar. Tente novamente.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = btnTexto;
  }
});

setupMsgArrows();
buscarMensagens(1);
}

// WhatsApp
const WHATSAPP_NUMBER = '5548996387745';
const SHARE_SITE_URL = 'https://cozinhandoemmissao.com.br';

const msgFalarWhatsApp = `Olá, Fernanda! 👋

Acessei o site *Cozinhando em Missão* e gostaria de saber mais sobre como posso apoiar essa obra.

Seja através de oração, divulgação ou contribuição financeira — quero fazer parte!

Aguardo seu retorno.`;

// Preencher mensagem nos links "Falar pelo WhatsApp" (exceto share)
document.querySelectorAll('a[href*="wa.me/' + WHATSAPP_NUMBER + '"]').forEach(link => {
  if (!link.href.includes('?text=')) {
    link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msgFalarWhatsApp);
  }
});

const shareTextoWhatsApp = `*🍳 Cozinhando em Missão*

Gastronomia como ferramenta de _missão_, _discipulado_ e _transformação social_.

A cozinha como adoração.
A mesa como comunhão.

👉 Saiba como apoiar essa obra:
${SHARE_SITE_URL}`;

const shareBtn = document.getElementById('share-whatsapp');
if (shareBtn) {
  shareBtn.href = 'https://wa.me/?text=' + encodeURIComponent(shareTextoWhatsApp);
}