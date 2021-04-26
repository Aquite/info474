docker rm -f summaryclienttest

docker pull pbatalov/summaryclient

docker run \
    -d \
    --name summaryclienttest \
    -p 80:80 -p 443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    pbatalov/summaryclient