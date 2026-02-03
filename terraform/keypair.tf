resource "aws_key_pair" "key" {
  key_name   = "devsecops-key"
  public_key = file("C:/Users/Lenovo/.ssh/devsecops-key.pub")
}
