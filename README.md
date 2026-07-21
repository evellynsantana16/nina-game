# Nina — Meu Gatinho

Jogo virtual em HTML, CSS e JavaScript, pronto para GitHub e Vercel.

## Estrutura correta do repositório

Os arquivos abaixo devem ficar diretamente na raiz do repositório:

- `index.html`
- `cozinha.html`
- `quarto.html`
- `banheiro.html`
- `jogo.html`
- `loja.html`
- `assets/`
- `manifest.webmanifest`
- `sw.js`
- `vercel.json`

Não coloque tudo dentro de outra pasta ao enviar ao GitHub.

## Publicar na Vercel

1. Crie ou limpe o repositório no GitHub.
2. Envie o conteúdo desta pasta para a raiz do repositório.
3. Na Vercel, importe o repositório.
4. Use **Framework Preset: Other**.
5. Deixe Build Command e Output Directory vazios.
6. Clique em Deploy.

O projeto já está configurado com `cleanUrls: false`, evitando redirecionamentos das páginas `.html`.

## Observação sobre cache antigo

Esta versão remove automaticamente o Service Worker e os caches da versão anterior que causavam falhas de navegação na Vercel.
