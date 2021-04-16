GOOS=linux go build
docker build -t pbatalov/summary .
go clean

docker push pbatalov/summary

ssh ec2-user@api.pavelsrinidhi.me < deploy.sh