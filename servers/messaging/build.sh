docker build -t pbatalov/messaging .

docker run -d -p 3000:80 --name messaging pbatalov/messaging