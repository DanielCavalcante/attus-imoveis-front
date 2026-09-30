terraform {
  required_version = ">= 1.9"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.projeto
  region  = var.regiao
}

resource "google_project_service" "necessarios" {
  for_each = toset([
    "run.googleapis.com",
    "iam.googleapis.com",
    "compute.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false
}
