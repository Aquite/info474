export MYSQL_ROOT_PASSWORD="password"

docker rm -f sqlsessions

docker build -t pbatalov/sqlsessions .

docker push pbatalov/sqlsessions

docker pull pbatalov/sqlsessions

docker run -d \
-p 3306:3306 \
--name sqlsessions \
-e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
-e MYSQL_DATABASE=demo \
pbatalov/sqlsessions