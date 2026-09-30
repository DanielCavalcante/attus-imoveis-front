# 20-busca-da-home

## Intenção
A porta de entrada deixa de ser um campo de texto solto e passa a perguntar três coisas — onde, em que bairro e que tipo de imóvel — levando a resposta para a listagem.

## Depende de
19-bairro-derivado-do-cep

> **Aprovada no gate humano em 2026-09-29.** Todos os critérios aceitos.

## Critérios
- [ ] **C1** `experiencia` — A home abre com "João Pessoa" preenchida no campo de cidade.
- [ ] **C2** `experiencia` — O campo de cidade aceita texto digitado pelo visitante.
- [ ] **C3** `experiencia` — O campo de bairro aceita texto digitado pelo visitante.
- [ ] **C4** `experiencia` — O seletor de tipo abre com "qualquer tipo" escolhido.
- [ ] **C5** `dominio` — O seletor de tipo oferece apartamento, casa, condomínio e terreno.
- [ ] **C6** `dominio` — Submeter com cidade, bairro e tipo navega para `/imoveis` com os três na consulta.
- [ ] **C7** `dominio` — Submeter só com cidade navega com a cidade e sem bairro nem tipo na consulta.
- [ ] **C8** `dominio` — Submeter com "qualquer tipo" não envia tipo na consulta.
- [ ] **C9** `dominio` — Submeter com os campos vazios navega para `/imoveis` sem filtro na consulta.
- [ ] **C10** `dominio` — O tipo enviado na consulta é o valor do enum do backend, não o rótulo exibido.
- [ ] **C11** `experiencia` — O campo de termo livre não existe mais na home.
- [ ] **C12** `experiencia` — O campo de cidade tem rótulo associado ao controle.
- [ ] **C13** `experiencia` — O campo de bairro tem rótulo associado ao controle.
- [ ] **C14** `experiencia` — O seletor de tipo tem rótulo associado ao controle.
- [ ] **C15** `experiencia` — Os três controles e o botão são alcançáveis e operáveis por teclado.

## Contrato técnico
- **Cidade e bairro são campos digitáveis; tipo é escolha fechada.** O enum tem quatro valores e vem do backend — `HOUSE`, `APARTMENT`, `CONDOMINIUM`, `LAND`. Campo livre para um conjunto fechado de quatro só cria jeito de errar.
- **Uma escolha de tipo, não várias.** A home é a pergunta grossa; seleção múltipla mora em `/imoveis`, junto com preço e o resto do detalhe. Popover de caixas de seleção na porta de entrada foi exatamente o controle que saiu daqui por não filtrar nada.
- **"Qualquer tipo" é ausência de filtro, não um valor.** C8 é o que impede o filtro de nascer sempre ligado.
- **O rótulo nunca vai na consulta.** A tela mostra "Apartamento" e a API recebe `APARTMENT`; os dois vivem em `app/lib/property.ts` e a tradução já existe. C10 existe porque esse é o erro que passa silencioso — a listagem volta vazia e ninguém sabe por quê.
- **Campo vazio não vira filtro.** Vale para os três, e é a mesma regra que a spec 18 fixou no servidor.
- **`q` sai da home e continua em `/imoveis`.** O termo livre não deixa de existir no produto; deixa de ser a porta de entrada. Quem procura "cobertura" ainda tem onde digitar, uma tela adiante.
- A home não consulta acervo: ela só navega. Quem busca anúncio é `/imoveis`.

## Fora de escopo
- **Sugestões nos campos de cidade e bairro** — é a spec seguinte, e é o que exige DOM no harness de teste.
- Preço, quartos, área e finalidade na home: a porta de entrada pergunta onde e o quê, não quanto.
- Seleção de mais de um tipo.
- O painel de filtros de `/imoveis`.
- Geolocalização e "perto de mim".
- Lembrar a última busca do visitante.

## Plano
1. `app/components/home-busc.tsx` — troca do campo livre pelos três controles e pela navegação com a consulta montada.
2. `app/lib/property.ts` — a lista de tipos para o seletor, a partir dos rótulos que já existem.
3. `app/services/announcements.service.ts` — a consulta ganha `city`, `neighborhood` e `type`, na mesma função que já omite valor em branco.
4. `app/services/__tests__/announcements-query.test.ts` — os critérios de consulta, no harness que já existe.

Fatia única: os três controles montam uma consulta só, e C6 a C9 só se provam com os três na tela.

## Perguntas em aberto
nenhuma
