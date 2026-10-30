# República em Pânico — expansão de identidade política

Sátira política com caricaturas procedurais de Flávio Bolsonaro, Alexandre de Moraes e Lula. Falas e acontecimentos são inventados e absurdos, sem pretensão de relatar fatos.

## Jogar

Abra **Jogar.cmd**. Requer Node.js 22.12+ ou 24 e usa a versão pronta de `dist/`, sem instalar pacotes ou acessar a internet. Alternativa: `node serve.mjs`, depois http://127.0.0.1:4173.

WASD/setas movem; Espaço ativa a habilidade; Esc pausa. Controles de toque continuam disponíveis. Para desenvolver: `npm install`, `npm run dev`. Para validar: `npm test` e `npm run build`.

## Elenco e comportamentos

- **Flávio:** cabeça e rosto modelados, cabelo castanho penteado, terno com lapelas, gravata clara, sobrancelhas preocupadas, suor, olhos que acompanham perigos e corrida articulada.
- **PT:** camisetas e bandeiras vermelhas com estrela branca. Marcha, piquetes que param por 2,6 s e perseguição curta. Nomes: Comitê do Não Passa, Bancada da Caminhada e Bloco da Pauta Infinita.
- **Comunistas:** foice e martelo em geometria, boinas, bandeiras e cartazes. Marcha, perseguição e piquete com cartaz maior. Nomes: Soviete do Cafezinho, Brigada da Mais-Fila e Coletivo do Cartaz Gigante.
- **PF:** coletes e bonés identificados; perseguição de 2,3 s, limitada a 2,4 m da faixa de origem. A fiscalização anuncia a zona amarela antes de ativar o vermelho.
- **Imprensa:** câmera, lente e microfone; movimento lateral alternado.
- **Oposição:** cartazes amarelos e travessia pela Esplanada.
- **Lula e parlamentares:** participações neutras, sem colisão hostil. Lula aparece no palanque e comenta a passagem pelo centro político.

O menu **Elenco 3D** permite inspecionar oito modelos animados e seus comportamentos.

## Cinco cenários

1. Brasília: Congresso com cúpulas e torres, espelho d’água, ministérios e parlamentares neutros.
2. Centro político: barracas, bandeiras, militância PT, comunistas e palanque de Lula.
3. STF: colunatas e arena **O Julgamento Final**.
4. BR-040: pedágio, cones, caminhões e trânsito.
5. Aeroporto: terminal, raio-X, bagagens em esteiras, portão 171 e avião.

## Chefe Xandão

A luta começa aos **28 m**. O jogador fica na arena de 28 a 34 m, entre nove colunas. Sobreviva **26 segundos** e alcance **34 m** para vencer. A barra de resistência diminui com o tempo. O jogador não precisa atacar o chefe.

| Ataque | Regra |
| --- | --- |
| Bloqueio judicial | Fecha parte de uma faixa; passe pelas colunas livres. |
| Martelada | Marca a faixa atual e gera uma onda; avance ou recue. |
| Intimação | Marca a posição no início do aviso; saia da casa. |
| Bloqueio de rota | Fecha colunas da direita temporariamente. |
| Decisão monocrática | Troca os bloqueios a cada 1,3 s, com 0,8 s de aviso. |

Os quatro primeiros ataques têm 1,8 s de aviso. Amarelo sinaliza, vermelho causa dano. Bloqueios sólidos impedem movimento para a casa ativa. Habilidades e proteções continuam funcionando; o passaporte ignora uma barreira uma vez. A recompensa de V$ 100 é concedida uma única vez na fuga completa.

**Treino:** Elenco 3D → Xandão → Treinar Julgamento. Testa a luta diretamente sem ganhar dinheiro, melhorias, vitórias ou recordes. A fuga completa continua começando em Brasília.

## Funcionalidades preservadas e validação

As cinco etapas de 12 faixas, quatro lojas, sete upgrades, preços progressivos, coleta única, bônus, opções de áudio, LocalStorage e sequência final de embarque continuam funcionando. A mesma chave `fr-save` preserva o progresso anterior. Os upgrades receberam novas descrições satíricas; seus efeitos numéricos permanecem iguais.

Os 17 testes cobrem economia, coleta única, colisão espacial, proteção, pausa, recargas, perseguição limitada, cinco ataques do chefe, avisos, casas livres, saída obrigatória, recompensa única, treino sem progresso e percurso completo até o embarque. O teste do percurso isola a progressão com proteção de teste; colisões são verificadas separadamente. Navegador usado para revisar menu, galeria, símbolos, arena, movimento e pausa.

Todos os modelos, arquitetura, símbolos, partículas, letreiros e sons são locais e procedurais. Nenhuma foto ou modelo externo é distribuído.

Referências visuais consultadas para a estilização, sem incorporar as fotografias: [Flávio / Agência Senado](https://commons.wikimedia.org/wiki/File:Foto_oficial_do_senador_Fl%C3%A1vio_Bolsonaro_(v._AgSen).jpg), [Alexandre de Moraes / Carlos Moura–STF](https://noticias.uol.com.br/politica/ultimas-noticias/2024/06/19/moraes-recua-de-censura-a-entrevista-da-folha-com-ex-mulher-de-lira.htm), [Lula / Ricardo Stuckert](https://commons.wikimedia.org/wiki/File:Foto_oficial_de_Luiz_In%C3%A1cio_Lula_da_Silva_(recortada).jpg).
