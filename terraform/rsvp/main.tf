terraform {
  required_version = "~> 0.12"

  backend "s3" {
    bucket         = "hyperbola-terraform-state"
    region         = "us-east-1"
    key            = "terraform/YK-Lopo-Wedding-RSVP/terraform.tfstate"
    encrypt        = true
    dynamodb_table = "terraform_statelock"
  }
}
