# Jogar pelo GitHub Pages

O jogo funciona integralmente no navegador. Quem joga pelo link não precisa instalar Node.js nem manter um computador servidor ligado. Recordes e melhorias continuam salvos no navegador de cada pessoa.

O projeto está preparado para publicação em `https://rhuanzin121.github.io/flavio-rachadinha/`, usando o mesmo modelo do Nutria.

## Publicação automática

1. Use o conteúdo desta pasta como raiz do repositório `flavio-rachadinha`, na branch `main`.
2. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
3. O fluxo **Publicar jogo no GitHub Pages** instala as dependências, compila e publica somente `dist/`. É possível iniciá-lo também por **Actions → Run workflow**.
4. Acesse o endereço confirmado pelo deploy quando a execução terminar com sucesso.

Os arquivos da pasta `dist/` são gerados automaticamente, não precisam entrar no Git. A configuração do Vite usa caminhos relativos para funcionar também na subpasta do repositório. Não são necessárias chaves, tokens ou variáveis `.env` para o jogo funcionar.

## Conferir o build localmente

```sh
npm ci
npm run build
node scripts/check-pages.mjs
node serve.mjs
```

Documentação: [Vite no GitHub Pages](https://vite.dev/guide/static-deploy#github-pages) e [publicação por GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
