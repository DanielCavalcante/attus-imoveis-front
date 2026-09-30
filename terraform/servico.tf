# O site: o unico servico com entrada da internet.
#
# `INGRESS_TRAFFIC_ALL` mais `allUsers` como invoker -- e a diferenca entre
# este arquivo e o da API, que tem entrada interna e invoker nominal. E a
# assimetria e a arquitetura inteira: um ponto de entrada, e so um.

resource "google_cloud_run_v2_service" "site" {
  name     = "attus-site-${var.ambiente}"
  location = var.regiao

  ingress             = "INGRESS_TRAFFIC_ALL"
  deletion_protection = false

  template {
    service_account = google_service_account.site.email

    scaling {
      min_instance_count = 0
      max_instance_count = var.instancias_maximas
    }

    # Saida pela mesma VPC da API: e por ela que o site alcanca um servico de
    # entrada interna.
    vpc_access {
      network_interfaces {
        network    = local.rede.nome
        subnetwork = local.rede.subnome
      }

      egress = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = var.imagem_do_site

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memoria
        }
      }

      # O endereco interno da API, lido do estado do outro repositorio. Nao ha
      # valor colado aqui.
      env {
        name  = "ATTUS_API_INTERNA"
        value = "${local.endereco_da_api}/api/v1"
      }

      # Liga a credencial de servico do proxy (spec 42): sem ela, o site nao
      # prova quem e, e a API fechada recusa.
      env {
        name  = "ATTUS_CREDENCIAL_DE_SERVICO"
        value = "1"
      }

      # A sonda do site nao consulta a API de proposito: se consultasse, uma
      # queda dela derrubaria e recriaria este conteiner em ciclo.
      startup_probe {
        http_get {
          path = "/api/saude"
        }

        initial_delay_seconds = 5
        period_seconds        = 3
        failure_threshold     = 10
      }

      liveness_probe {
        http_get {
          path = "/api/saude"
        }

        period_seconds = 30
      }
    }
  }

  depends_on = [google_project_service.necessarios]
}

# Aberto ao mundo -- e o unico lugar de todo o dominio onde `allUsers` aparece.
resource "google_cloud_run_v2_service_iam_member" "publico" {
  name     = google_cloud_run_v2_service.site.name
  location = google_cloud_run_v2_service.site.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
