GOOS=linux go build
docker build -t pbatalov/summary .
go clean

docker push pbatalov/summary

ssh ec2-user@ec2-100-21-212-102.us-west-2.compute.amazonaws.com < deploy.sh