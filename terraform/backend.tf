terraform {
  backend "s3" {
    bucket         = "devsecops-terraform-state-bucket1"
    key            = "terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}
