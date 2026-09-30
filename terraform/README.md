# Terraform do site

O **único serviço com entrada da internet**. Ele fala com a API por endereço
interno, lido do estado do outro repositório.

## A ordem entre os dois repositórios

O site depende da API, não o contrário. A API publica onde está e quem pode
invocá-la; este estado consome por `terraform_remote_state`.

No **primeiro** `apply` isso parece circular — a API precisa da conta de
serviço do site para autorizá-la, e o site precisa do endereço da API. São
três passos, uma vez só:

1. **Aqui**, só a identidade:
   `terraform apply -target=google_service_account.site`
   Ela não depende de nada da API.
2. **No repositório da API**, tudo, passando o e-mail da conta acima em
   `conta_do_site`.
3. **Aqui**, o resto. As saídas da API já existem.

Da segunda vez em diante, cada lado aplica sozinho.

## A imagem carrega o ambiente

`NEXT_PUBLIC_*` é embutido no **build**, e entre eles está o endereço público
do site. Consequência que vale saber antes de montar qualquer promoção de
artefato: **não se promove a imagem de homologação para produção.** Uma imagem
por ambiente, construída com o endereço daquele ambiente.

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://seu-dominio \
  -t southamerica-east1-docker.pkg.dev/SEU_PROJETO/attus-prod/site:$(git rev-parse --short HEAD) .

docker push southamerica-east1-docker.pkg.dev/SEU_PROJETO/attus-prod/site:$(git rev-parse --short HEAD)

gcloud artifacts docker images describe \
  southamerica-east1-docker.pkg.dev/SEU_PROJETO/attus-prod/site:$(git rev-parse --short HEAD) \
  --format='value(image_summary.digest)'
```

O `NEXT_PUBLIC_API_URL` **não** entra no build: desde a spec 42 o navegador
fala com a própria origem, e nenhum host da API aparece no pacote servido.

## Aplicar

```bash
terraform init \
  -backend-config="bucket=SEU_PROJETO-tfstate" \
  -backend-config="prefix=site"

terraform plan \
  -var="projeto=SEU_PROJETO" \
  -var="bucket_do_estado=SEU_PROJETO-tfstate" \
  -var="imagem_do_site=southamerica-east1-docker.pkg.dev/SEU_PROJETO/attus-prod/site@sha256:..." \
  -var="dominio=seu-dominio"
```

`dominio` é o **mesmo** valor que entrou no build como `NEXT_PUBLIC_SITE_URL`.
Um lugar de verdade: se divergirem, o site anuncia ao buscador um endereço em
que não responde.

## Destruir

`terraform destroy` aqui derruba **o site, e só ele**. O banco, o bucket e a
API vivem no outro estado. É por isso que são dois: um `destroy` no
repositório errado não leva os dados junto.

## O que este estado NÃO faz

- **Não aplica sozinho.**
- **Não constrói imagem.**
- **Não compra domínio nem delega DNS.** Ele declara o mapeamento; o registro
  é feito no registrador.
- **Não põe CDN na frente.** Faz sentido quando houver tráfego para medir.
