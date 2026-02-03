variable "ami_id" {
  default = "ami-03f4878755434977f"
}

variable "key_name" {
  default = "devsecops-key"
}
 
variable "my_ip" {
  description = "Public IP for restricted access"
  default     = "0.0.0.0/0"  # open to anywhere 
}