# Flávio Rachadinha: Fugindo do Brasil

**Jogar por um link:** o projeto está preparado para o GitHub Pages, sem instalação para quem joga. Consulte [PUBLICACAO.md](PUBLICACAO.md).

Jogo arcade 3D de sátira política. Personagens e situações são fictícios e absurdos; a narrativa não pretende relatar fatos.

## Executar

Requer Node.js 22.12+ ou 24.

**Para jogar a versão pronta:** abra `Jogar.cmd`. Ela usa `dist/` e funciona sem instalar pacotes ou acessar a internet. Mantenha a janela aberta enquanto joga. Alternativa: `node serve.mjs`, depois abra http://127.0.0.1:4173.

**Para desenvolver com Vite:**

```sh
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. `npm run build` gera `dist/`; sirva essa pasta por HTTP para jogar sem depender de serviços externos. Todos os modelos e sons são procedurais, sem assets remotos.

## Jogar

WASD/setas movem; Espaço ativa a habilidade; Esc pausa. Direcional de toque aparece em dispositivos móveis. Atravesse cinco etapas de 12 faixas até o avião. Pistas verdes são seguras. Barreiras abrem ciclicamente; fiscai­s anunciam a fiscalização pela cor amarela. Repórteres alternam a direção.

Cada nova faixa rende V$ 2, cada moeda V$ 10. Etapas rendem 70/90/110/130/150, mais 20 por trecho sem colisões e 25 por coletar pelo menos 3 moedas cumulativas por etapa. O aeroporto conclui a partida. A loja abre após as primeiras quatro etapas; upgrades comprados persistem, enquanto o dinheiro é por partida. Blindagem recarrega na nova partida; passaporte funciona uma vez por partida. Apenas uma habilidade ativa pode ser equipada.

`npm test` executa 17 testes, incluindo os ataques do chefe, treino sem progresso, perseguição limitada e as regras originais de economia e progressão. O teste de progressão isola esse fluxo com proteção de teste; colisões são testadas separadamente. Menus, galeria, arena, movimento e pausa também foram verificados no navegador. LocalStorage guarda recorde, vitórias, opções e melhorias; falhas de armazenamento não interrompem a partida.
