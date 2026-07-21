// ===============================
// Destaca a página atual no menu
// ===============================
const currentPage = document.body.dataset.page;

document.querySelectorAll("[data-route]").forEach(link => {
  if (link.dataset.route === currentPage) {
    link.style.background = "var(--pink)";
    link.style.color = "#fff";
  }
});

// =====================================================
// SERVICE WORKER DESATIVADO TEMPORARIAMENTE
// =====================================================
//
// O Service Worker estava causando erro na Vercel:
//
// "The FetchEvent resulted in a network error response..."
//
// Isso acontece porque a Vercel faz redirecionamentos e o
// cache do Service Worker acabava quebrando a navegação.
//
// Quando o jogo estiver totalmente pronto, podemos criar
// um Service Worker novo e correto.
//
// Por enquanto NÃO registre nenhum Service Worker.
//
// Código antigo:
//
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('./sw.js').catch(() => {});
//     });
// }
//
// (Removido de propósito.)
// =====================================================