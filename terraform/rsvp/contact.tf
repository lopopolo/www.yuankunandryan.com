variable "contact_email" {}
variable "recaptcha_secret_key" {}

resource "aws_cloudformation_stack" "contact" {
  name         = "YK-Lopo-Wedding-RSVP"
  capabilities = ["CAPABILITY_IAM"]

  parameters = {
    ToEmailAddress  = var.contact_email
    ReCaptchaSecret = var.recaptcha_secret_key
  }

  template_body = templatefile("contact-form-cloudformation-stack.yml", { zipfile = jsonencode(file("lambda.js")) })
}

output "contact_api_url" {
  value = aws_cloudformation_stack.contact.outputs["ApiUrl"]
}
