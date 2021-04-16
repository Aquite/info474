GOOS=linux go build
docker build -t pbatalov/summaryclient .
go clean

docker push pbatalov/summaryclient

ssh ec2-user@pavelsrinidhi.me < deploy.sh