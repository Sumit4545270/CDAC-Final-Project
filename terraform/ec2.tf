resource "aws_instance" "master" {
  ami = var.ami_id
  instance_type = "t2.medium"
  subnet_id = aws_subnet.private.id
  vpc_security_group_ids = [aws_security_group.k8s_master.id]
  key_name = aws_key_pair.key.key_name

  
  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = { Name = "k8s-master" }
}

resource "aws_instance" "worker1" {
  ami = var.ami_id
  instance_type = "t2.medium"
  subnet_id = aws_subnet.private.id
  vpc_security_group_ids = [aws_security_group.k8s_worker.id]
  key_name = aws_key_pair.key.key_name

  
  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = { Name = "worker1" }
}

resource "aws_instance" "worker2" {
  ami = var.ami_id
  instance_type = "t2.medium"
  subnet_id = aws_subnet.private.id
  vpc_security_group_ids = [aws_security_group.k8s_worker.id]
  key_name = aws_key_pair.key.key_name
  
  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = { Name = "worker2" }


}

resource "aws_instance" "cicd" {
  ami = var.ami_id
  instance_type = "t3.large"

  subnet_id = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.cicd.id]
  key_name = aws_key_pair.key.key_name

  
  root_block_device {
    volume_size = 40
    volume_type = "gp3"
  }

  tags = { Name = "cicd-devops-node " }
}