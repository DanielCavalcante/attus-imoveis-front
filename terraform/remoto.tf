# O que a API publica, lido daqui.
#
# E o coracao desta spec. Cada repositorio tem a sua terraformagem, mas os
# dois sao o mesmo dominio: o site precisa do endereco interno da API e da
# rede por onde alcanca-la. Isso viaja por saida de estado -- nao por alguem
# colar um endereco num arquivo e descobrir meses depois que ele mudou.
#
# A direcao importa: o site depende da API, e nao o contrario. Por isso a
# terraformagem da API vem antes.

data "terraform_remote_state" "api" {
  backend = "gcs"

  config = {
    bucket = var.bucket_do_estado
    prefix = var.prefixo_do_estado_da_api
  }
}

locals {
  endereco_da_api = data.terraform_remote_state.api.outputs.endereco_da_api
  rede            = data.terraform_remote_state.api.outputs.rede
}
