# A conta de servico do site.
#
# E ela que a API autoriza a invocar (spec 43, C3), e e ela que NAO tem acesso
# ao banco nem ao bucket (C5): o site nao fala com nenhum dos dois. Quem fala
# e a API, e o site fala com a API.
#
# Nenhum `google_project_iam_member` neste arquivo, e a ausencia e o criterio:
# cada papel que entrasse aqui abriria um caminho que a arquitetura fechou.

resource "google_service_account" "site" {
  account_id   = "attus-site-${var.ambiente}"
  display_name = "Site do Encontrei (${var.ambiente})"

  depends_on = [google_project_service.necessarios]
}
