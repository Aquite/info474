docker build -t pbatalov/summaryclient .

docker push pbatalov/summaryclient

ssh ec2-user@pavelsrinidhi.me < deploy.sh