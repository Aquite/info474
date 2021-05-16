docker network create customNet

docker run \
    -d \
    --name rServe \
    --network customNet \
    redis

export MYSQL_ROOT_PASSWORD=password
export MYSQL_DATABASE=db


export REDISADDR=rServe:6379
export SESSIONKEY=bbbff88bc48858d0c7


export TLSCERT=/etc/letsencrypt/live/api.pavelsrinidhi.me/fullchain.pem
export TLSKEY=/etc/letsencrypt/live/api.pavelsrinidhi.me/privkey.pem

docker rm -f summarytest

docker pull pbatalov/summary


docker run \
    -d \
    -e ADDR=:443 \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    -e TLSCERT=$TLSCERT \
    -e TLSKEY=$TLSKEY \
    -e SESSIONKEY=$SESSIONKEY \
    -e REDISADDR=$REDISADDR \
    -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
    -e MYSQL_DATABASE=$MYSQL_DATABASE \
    -p 443:443 \
    --network customNet \
    --name summarytest \
    pbatalov/summary

exit