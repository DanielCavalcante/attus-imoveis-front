# O dominio proprio, quando houver.
#
# O Cloud Run cuida do certificado e redireciona HTTP para HTTPS sozinho: nao
# ha nada a declarar para C6 alem de existir o mapeamento. Sem dominio, o
# endereco gerado pelo Cloud Run ja e HTTPS.
#
# O registro do dominio e a delegacao do DNS ficam de fora: sao compra e
# configuracao no registrador, nao codigo.

resource "google_cloud_run_domain_mapping" "site" {
  count = var.dominio == "" ? 0 : 1

  name     = replace(replace(var.dominio, "https://", ""), "http://", "")
  location = google_cloud_run_v2_service.site.location

  metadata {
    namespace = var.projeto
  }

  spec {
    route_name = google_cloud_run_v2_service.site.name
  }
}
