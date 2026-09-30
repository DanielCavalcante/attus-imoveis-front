output "endereco_do_site" {
  description = "Onde o site responde. O unico endereco publico do sistema."
  value       = google_cloud_run_v2_service.site.uri
}

output "conta_do_site" {
  description = <<-TEXTO
    A conta de servico do site.

    E este valor que vai para `conta_do_site` no Terraform da API: e ela, e
    so ela, que pode invocar a API fechada.
  TEXTO
  value       = google_service_account.site.email
}

output "api_que_o_site_usa" {
  description = "Confirma de onde veio o endereco da API: do estado do outro repositorio."
  value       = local.endereco_da_api
}
