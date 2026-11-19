# Trilha Dados

Painel em português para acompanhar a preparação para certificações em dados. Funciona com HTML, CSS e JavaScript, sem instalação, build, servidor de aplicação ou chave de API.

## GitHub Pages

1. Envie os arquivos deste pacote para a raiz da branch `main` do seu repositório.
2. Abra **Settings → Pages** no repositório.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha **main** e **/ (root)**, salve e aguarde o endereço que o GitHub exibe.

[Documentação do GitHub Pages](https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Hospedagem própria

Envie `index.html`, `style.css` e `app.js` juntos para a raiz pública ou para uma pasta como `/trilha-dados/`. Sirva por HTTPS. Para teste local, rode `python -m http.server 8000` na pasta e acesse `http://localhost:8000`.

O progresso, as revisões e o histórico são guardados no navegador, por endereço do site. Ao trocar de domínio, o painel começa com o plano inicial. O código mantém o nome que já aparece no site original. Se for publicar em um endereço público e quiser remover o nome, edite o perfil em `index.html` e a saudação em `app.js`.
