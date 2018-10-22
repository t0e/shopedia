VERSION=$(cat version)
aws cloudformation update-stack \
--stack-name qa-shopedia \
--use-previous-template \
# --profile kyawgyi \
--capabilities=CAPABILITY_NAMED_IAM \
--parameters ParameterKey=ALBDNSName,ParameterValue="qa-1395352265.ap-southeast-1.elb.amazonaws.com" \
ParameterKey=Cluster,ParameterValue="qa" \
ParameterKey=DesiredCount,ParameterValue=2 \
ParameterKey=DomainName,ParameterValue=shopedia \
ParameterKey=Environment,ParameterValue=qa \
ParameterKey=Listener,ParameterValue="arn:aws:elasticloadbalancing:ap-southeast-1:336408011744:listener/app/qa/70bc544738eb8ae0/e2d1aa448facb60d" \
ParameterKey=VPCId,ParameterValue="vpc-0a7f8376ae9213928" \
ParameterKey=Version,ParameterValue=$VERSION