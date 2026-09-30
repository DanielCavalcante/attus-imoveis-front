variable "projeto" {
  description = "ID do projeto no GCP. O mesmo da API: sao o mesmo dominio."
  type        = string
}

variable "regiao" {
  description = "Regiao do servico."
  type        = string
  default     = "southamerica-east1"
}

variable "ambiente" {
  description = "Sufixo que separa um ambiente do outro nos nomes dos recursos."
  type        = string
  default     = "prod"
}

variable "bucket_do_estado" {
  description = "Bucket onde os dois estados moram, cada um sob o seu prefixo."
  type        = string
}

variable "prefixo_do_estado_da_api" {
  description = "Prefixo do estado da API dentro do bucket."
  type        = string
  default     = "api"
}

variable "imagem_do_site" {
  description = <<-TEXTO
    A imagem do site, POR DIGEST.

    Atencao ao que esta imagem carrega: `NEXT_PUBLIC_*` e embutido no BUILD, e
    entre eles esta o endereco publico do site. Ou seja, a imagem e especifica
    do ambiente -- nao se promove a de homologacao para producao.
  TEXTO
  type        = string

  validation {
    condition     = can(regex("@sha256:[0-9a-f]{64}$", var.imagem_do_site))
    error_message = "A imagem precisa vir por digest (@sha256:...), nunca por tag."
  }
}

variable "dominio" {
  description = <<-TEXTO
    O dominio publico do site. Vazio usa o endereco que o Cloud Run gera.

    Este e o MESMO valor que entrou no build como NEXT_PUBLIC_SITE_URL: um so
    lugar de verdade, para os dois nao divergirem (C10).
  TEXTO
  type        = string
  default     = ""
}

variable "cpu" {
  description = "O menor porte que sobe o site. Sobe depois de medir."
  type        = string
  default     = "1"
}

variable "memoria" {
  description = <<-TEXTO
    Memoria do conteiner.

    512Mi e realista para o Node, ao contrario da JVM da API. Vale medir com
    trafego de fotos: elas atravessam este servico em fluxo desde a spec 42.
  TEXTO
  type        = string
  default     = "512Mi"
}

variable "instancias_maximas" {
  description = "Teto de escala. Minimo e sempre zero."
  type        = number
  default     = 3
}
