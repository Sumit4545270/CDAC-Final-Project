resource "aws_instance" "database" {
  ami = var.ami_id
  instance_type = "t2.micro"
  subnet_id = aws_subnet.private.id
  vpc_security_group_ids = [aws_security_group.mongodb-server.id]
  key_name = aws_key_pair.key.key_name

  tags = {
    Name = "database-server"
  }

}
