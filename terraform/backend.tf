# Estado proprio, separado do da API.
#
# Separado de proposito: e o que faz `terraform destroy` aqui derrubar o site
# sem levar o banco junto (C12). Dois estados no mesmo lugar seriam a
# separacao como ilusao.
terraform {
  backend "gcs" {}
}
