variable "region" {
  default = "us-west-2"
}

provider "aws" {
  region  = var.region
  version = "~> 2.6"
}

provider "aws" {
  region = "us-east-1"
  alias  = "cloudfront_acm"
}
