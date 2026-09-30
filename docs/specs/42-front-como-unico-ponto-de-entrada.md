# 42-front-como-unico-ponto-de-entrada

## Intenção
Toda chamada à API passa a sair do servidor do site, e não do navegador — o
que permite à API existir sem nenhuma entrada da internet.

## Depende de
41-web-configuravel-e-build-reprodutivel

## Critérios

- [ ] **C1** `contrato-api` — uma chamada do navegador a `/api/v1/...` é atendida pelo próprio site e respondida com o corpo e o status que a API devolveu.
- [ ] **C2** `contrato-api` — o método, o corpo e os cabeçalhos relevantes da requisição chegam à API sem alteração.
- [ ] **C3** `seguranca` — o token da sessão da pessoa é repassado à API.
- [ ] **C4** `seguranca` — em produção, a requisição para a API leva a credencial de serviço que a API exige, e ela nunca chega ao navegador.
- [ ] **C5** `contrato-api` — o envio de imagem, que é multipart, atravessa o caminho e chega íntegro à API.
- [ ] **C6** `contrato-api` — a entrega de imagem atravessa o caminho preservando `Content-Type` e `X-Content-Type-Options`.
- [ ] **C7** `performance` — o corpo da resposta é repassado em fluxo, sem ser carregado inteiro na memória do site.
- [ ] **C8** `dominio` — a API fora do ar vira erro legível para quem está usando, e não uma página de erro do servidor.
- [ ] **C9** `seguranca` — o caminho só alcança a API configurada; parâmetro de requisição não redireciona para outro endereço.
- [ ] **C10** `dominio` — em desenvolvimento, `docker compose up` continua funcionando pelo mesmo caminho, sem credencial de serviço.
- [ ] **C11** `dominio` — as telas continuam funcionando sem mudar nenhuma chamada: quem muda é o endereço base, não o código de cada tela.
- [ ] **C12** `contrato-api` — o endereço base do navegador é relativo: nenhum host da API aparece no pacote servido.
- [ ] **C13** `dominio` — as fotos do acervo são carregadas pela própria origem do site.

## Contrato técnico

O caminho é um Route Handler que captura tudo sob `/api/v1/` e repassa. Não é
reescrever a API em TypeScript: **nada de regra de negócio mora aqui**. Ele
encaminha, acrescenta a credencial de serviço e devolve — e é essa estreiteza
que faz a spec caber em onze critérios em vez de virar um segundo backend.

C7 não é otimização prematura, é a diferença entre funcionar e cair: as fotos
do acervo passam por aqui, e cada uma pode ter 5 MB. Carregá-las inteiras na
memória para reenviar multiplicaria o consumo do site pelo número de pessoas
olhando fotos ao mesmo tempo -- num contêiner pequeno, isso é o primeiro a
estourar.

C4 é o que torna a API fechada possível: no Cloud Run, serviço sem entrada
pública ainda exige que quem chama prove quem é. O site obtém um token de
identidade para o endereço da API e o manda no cabeçalho, junto -- e não no
lugar -- do token da pessoa, que a API continua usando para saber quem está
falando.

C9 existe porque proxy que aceita destino de fora vira proxy aberto: alguém
pediria `/api/v1/...` apontando para outro host e usaria nosso serviço como
ponte. O destino é só o configurado.

C12 e C13 nasceram na spec 41 e vieram para cá: lá eles dependiam deste
mecanismo, que vem depois -- critério que depende de spec posterior nunca
fecha. Com eles, **a lista de origens do CORS deixa de ter função em
produção**, porque a requisição nunca é de outra origem.

## Fora de escopo

- **Cache de respostas no caminho.** Ele encaminha; cache é decisão com
  invalidação junto, e ninguém pediu.
- **Repassar qualquer coisa fora de `/api/v1/`.**
- **Autenticação própria do site.** Quem autentica continua sendo a API; o
  caminho não decide nada sobre sessão.
- **O Terraform que fecha a API.** São as specs 43 e 44 — esta torna o
  fechamento possível, aquelas o executam.

## Plano

1. O caminho, com fluxo e credencial de serviço —
   `app/api/v1/[...caminho]/route.ts`, `app/lib/ambiente.ts`.
2. O endereço base do navegador vira relativo — `app/services/api.ts`,
   `app/lib/imagem.ts`.
3. Testes por critério — `app/api/__tests__/caminho-da-api.test.ts`.

## Perguntas em aberto

Nenhuma.
