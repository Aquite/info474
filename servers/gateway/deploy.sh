docker rm -f summarytest

export TLSCERT=/etc/letsencrypt/live/api.pavelsrinidhi.me/fullchain.pem
export TLSKEY=/etc/letsencrypt/live/api.pavelsrinidhi.me/privkey.pem

docker pull pbatalov/summary

docker run \
    -d \
    -e ADDR=:443 \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    -e TLSCERT=$TLSCERT \
    -e TLSKEY=$TLSKEY \
    -p 443:443 \
    --name summarytest \
    pbatalov/summary

exit