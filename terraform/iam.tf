resource "aws_iam_role" "terraform_role" {
  name = "terraform-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{ Effect="Allow", Principal={Service="ec2.amazonaws.com"}, Action="sts:AssumeRole"}]
  })
}

resource "aws_iam_role" "k8s_role" {
  name = "k8s-node-role"
  assume_role_policy = aws_iam_role.terraform_role.assume_role_policy
}

resource "aws_iam_role" "cicd_role" {
  name = "cicd-role"
  assume_role_policy = aws_iam_role.terraform_role.assume_role_policy
}
