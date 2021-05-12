export MYSQL_ROOT_PASSWORD="password"
export MYSQL_DATABASE="db"

docker rm -f db

docker build -t pbatalov/db .

docker push pbatalov/db

docker pull pbatalov/db

docker run -d \
-p 3306:3306 \
--network customNet \
--name db \
-e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
-e MYSQL_DATABASE=$MYSQL_DATABASE \
pbatalov/db

exit