# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Três públicos, e a distinção entre eles é de identidade, não de permissão — decisão explícita do gate: "é mais um tipo de conta do que o que ele pode fazer lá, já que é tudo".

- **Pessoa física.** Alguém vendendo o próprio imóvel, normalmente pela primeira vez, sem repertório de mercado. Também é quem navega procurando comprar: quem só busca é uma pessoa física que ainda não anunciou.
- **Pessoa jurídica.** Imobiliária ou empresa que anuncia em volume. Precisa ser aprovada antes de publicar e contrata um pacote.
- **Equipe interna.** Analisa a confiabilidade das imobiliárias, gerencia os pacotes vendidos e atende os pedidos de apoio à venda.

Qualquer conta navega, favorita e anuncia. O tipo decide a regra que incide sobre o ato — quota na pessoa física, plano na jurídica —, nunca se o ato existe. Uma imobiliária também compra imóvel de outra pessoa.

## Product Purpose

Anunciar e encontrar imóveis. Sucesso para quem anuncia é o imóvel sair; para quem busca, é encontrar um anúncio em que dê para confiar.

## Positioning

Duas afirmações **indissociáveis**, confirmadas no gate, e que nenhum portal de volume pode copiar sem construir a mesma operação:

1. **Toda imobiliária é verificada por gente.** CNPJ, razão social, CRECI com número e UF, responsável legal e endereço da sede vão para uma fila onde a equipe interna aprova ou reprova **com motivo registrado**. O CRECI é o eixo: imobiliária no Brasil só opera legalmente com registro no conselho regional, e é conferível publicamente. Sem aprovação, a empresa não publica.
2. **Quem vende não vende sozinho.** A pessoa física publica de graça e, por anúncio, pede o contato de uma equipe que ajuda a vender mais rápido. O pedido entra numa fila interna com o telefone e o e-mail de quem pediu.

A primeira é sobre em quem o comprador pode confiar. A segunda é sobre quem segura a mão de quem nunca vendeu. As duas juntas são a posição; separadas, viram commodity.

## Operating Context

- **Alcance:** começa em João Pessoa e na Paraíba, com ambição nacional declarada. O produto não pode parecer provinciano nem prometer cobertura que ainda não tem.
- **Cadastro da pessoa jurídica em duas etapas:** CNPJ e um contato criam a conta; o dossiê completo vem depois, numa área própria. Catorze campos na frente de quem está criando conta é o motivo de existir a separação.
- **Fila de análise:** ordem de chegada, decisão humana, motivo obrigatório na reprovação. Empresa reprovada corrige e volta à fila; aprovada não revalida.
- **Quota da pessoa física:** três anúncios por mês civil, gratuitos. Configurável sem deploy.
- **Pacotes da pessoa jurídica:** plano com preço mensal e limite de anúncios, criados e ajustados pela equipe interna. Limite vazio significa ilimitado.
- **Busca:** por título, cidade e estado, insensível a caixa e a acento — em português quem digita rápido não acentua.

## Capabilities and Constraints

Em produção hoje: cadastro tipado, dossiê da empresa, análise de confiabilidade, planos configuráveis, quota mensal, pedido de apoio à venda, favoritos, histórico de visita, busca e listagem paginada, painel interno.

Terminologia do domínio: anúncio, imóvel, imobiliária, dossiê, CRECI, quota, fila de análise, pacote, backoffice.

**Explicitamente não decidido, e que nenhum trabalho pode fingir existir:**

- **Pagamento.** Nenhum gateway escolhido. Não há cobrança, assinatura, cartão nem recibo em lugar nenhum do sistema.
- **E-mail.** Nenhum provedor escolhido. O sistema não envia mensagem alguma: não há confirmação de cadastro, aviso de aprovação nem notificação de apoio.
- **Contato com anunciante.** Os botões "Entrar em contato" e "WhatsApp" na página de detalhe não fazem nada. O nome do anunciante exibido é um espaço reservado, não um dado real.
- **Filtro por tipo de imóvel e finalidade.** O seletor da home nunca filtrou nada.

Restrições técnicas: Next.js 16 no cliente, Spring Boot 3.3 e Postgres no servidor, em repositórios separados que são um só domínio. A imagem do anúncio é uma URL digitada por quem anuncia, não um upload.

## Brand Commitments

Nenhum. O gate liberou nome, logotipo e paleta para serem repensados.

O que existe hoje e é **evidência, não compromisso**: o nome "Encontrei", o logotipo em `public/logotipo.png`, e uma paleta roxa (`#7c3aed`) herdada do padrão do shadcn/ui, nunca escolhida por ninguém.

## Evidence on Hand

- Fotos de imóveis vindas do Unsplash, usadas como conteúdo de exemplo. As imagens reais dos anúncios são URLs que quem anuncia informa.
- `public/logotipo.png`, `public/login.jpg`, `public/register.jpg`, `public/image/register.jpg`.
- **Não existem:** depoimento, cliente real, número de usuários, volume de anúncios, prêmio, imprensa, parceria ou métrica de qualquer espécie. O rodapé atual traz telefone e e-mail que são espaço reservado. A home afirma "milhões de anúncios de imóveis, carros e motos" — é **falso em três frentes**: não há milhões, não há carros e não há motos. Nada disso pode ser reaproveitado como prova.

## Product Principles

1. **Confiança antes de volume.** O que se vende é que dá para acreditar no anúncio, não que há muitos.
2. **Tipo de conta é identidade, não capacidade.** Nenhuma tela pode sugerir que pessoa física é um usuário de segunda classe.
3. **Quem nunca vendeu um imóvel é o caso difícil.** A linguagem parte de quem não conhece o mercado, não de quem já é do ramo.
4. **Nada de prova inventada.** Sem depoimento, número ou selo que o produto não tenha conquistado.
5. **Regional sem ser pequeno.** A origem na Paraíba aparece como verdade, não como limite.

## Accessibility & Inclusion

Nenhuma exigência específica de produto foi estabelecida. O padrão geral de contraste, foco visível e alvo de toque se aplica.
