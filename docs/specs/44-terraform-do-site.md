# 44-terraform-do-site

## Intenção
A infraestrutura do site existe como código: o único serviço com entrada da
internet, sabendo por estado remoto onde a API está.

## Depende de
42-front-como-unico-ponto-de-entrada, 43-terraform-da-api

## Critérios

- [ ] **C1** `infraestrutura` — `terraform plan` roda a partir do repositório limpo, sem nenhum recurso criado à mão antes.
- [ ] **C2** `infraestrutura` — o endereço da API e a conta de serviço vêm do estado remoto do outro repositório, e não de valor copiado à mão.
- [ ] **C3** `seguranca` — o serviço do site é o único com entrada da internet.
- [ ] **C4** `seguranca` — o site roda com a conta de serviço que a API autoriza a invocá-la.
- [ ] **C5** `seguranca` — a conta de serviço do site não tem acesso ao banco nem ao bucket.
- [ ] **C6** `seguranca` — o tráfego chega por HTTPS, e HTTP é redirecionado.
- [ ] **C7** `performance` — o serviço é declarado com o menor porte de CPU e memória que sobe a aplicação, e com mínimo de instâncias zero.
- [ ] **C8** `observabilidade` — o serviço usa a rota de saúde da spec 41 como sonda.
- [ ] **C9** `infraestrutura` — a imagem vem do Artifact Registry, por digest e não por `latest`.
- [ ] **C10** `dominio` — o endereço público do site é o que a aplicação recebe como configuração, sem valor repetido em dois lugares.
- [ ] **C11** `infraestrutura` — aplicar duas vezes seguidas não produz mudança na segunda.
- [ ] **C12** `infraestrutura` — destruir o site não derruba a API nem o banco.

## Contrato técnico

**C2 é o coração desta spec.** Cada repositório tem a sua terraformagem, mas os
dois são o mesmo domínio: o site precisa do endereço interno da API, e a API
precisa autorizar a conta de serviço do site. O caminho é
`terraform_remote_state` lendo as saídas que a spec 43 publica — o acoplamento
é declarado e verificável, em vez de alguém colar um endereço num arquivo e
descobrir meses depois que ele mudou.

A direção importa: **o site depende da API, e não o contrário.** Por isso a 43
vem antes. A API publica onde está e quem pode chamá-la; o site consome. A
alternativa — cada lado esperando o outro — não tem ordem de aplicação
possível.

**C12 é consequência dessa direção.** Se destruir o site derrubasse o banco, a
separação em dois estados seria ilusão, e um `terraform destroy` no repositório
errado levaria os dados junto.

**A imagem carrega o endereço público com que foi construída** (spec 41, C5 e
C6): `NEXT_PUBLIC_*` é embutido no build. C10 existe para esse valor não viver
em dois lugares que podem divergir -- o que o Terraform declara como domínio é
o que o build recebe.

Porte pequeno pelo mesmo motivo da 43, com uma diferença que vale medir: aqui
passa também o tráfego das fotos, que atravessam o site em fluxo desde a spec
42.

## Fora de escopo

- **Aplicar.** Escreve e planeja; subir é decisão sua.
- **CDN na frente do site.** Faz sentido quando houver tráfego para medir.
- **Pipeline de build e publicação das imagens.**
- **Ambiente de homologação.** Um ambiente primeiro; o segundo se faz com o
  mesmo código e outra variável, e é quando essa promessa será testada.
- **Domínio próprio comprado e delegado.** O Terraform declara o mapeamento; o
  registro do domínio é compra, não código.

## Plano

1. Estado remoto e leitura do estado da API — `terraform/backend.tf`,
   `terraform/remoto.tf`, `terraform/versions.tf`, `terraform/variables.tf`.
2. Conta de serviço do site — `terraform/identidade.tf`.
3. O serviço público, com sonda e porte declarado — `terraform/servico.tf`.
4. Domínio e HTTPS — `terraform/dominio.tf`.
5. Como rodar, e a ordem entre os dois repositórios —
   `terraform/README.md`.

## Perguntas em aberto

Nenhuma. A que era herdada da spec 43 foi respondida: "o usuário mexe apenas no
seu usuário" é regra do produto, virou a spec 45, e não muda a infraestrutura.
