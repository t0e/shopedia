VERSION=$(cat version)
$(aws ecr get-login --no-include-email --region ap-southeast-1 --profile kyawgyi)
docker build -t shopedia:$VERSION .
docker tag shopedia:$VERSION 336408011744.dkr.ecr.ap-southeast-1.amazonaws.com/shopedia:$VERSION
docker push 336408011744.dkr.ecr.ap-southeast-1.amazonaws.com/shopedia:$VERSION