#!/usr/bin/env bash 
set -eo pipefail

dynamo_jar_dir=$(cd `dirname $0`/.. && pwd)/.dynamodb
pushd "$dynamo_jar_dir"
{
cat > log4j2.xml <<- XML
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
    </Console>
  </Appenders>
  <Loggers>
    <Logger name="com.amazonaws.services.dynamodbv2.local" level="DEBUG">
    	<AppenderRef ref="Console"/>
    </Logger>
     <Logger name="com.amazonaws.services.dynamodbv2.local.shared.access.sqlite.SQLiteDBAccess" level="INFO">
    	<AppenderRef ref="Console"/>
    </Logger>
     <Root level="WARN">
      <AppenderRef ref="Console"/>
    </Root>
  </Loggers>
</Configuration>
XML

zip -d DynamoDBLocal.jar log4j2.xml

zip -u DynamoDBLocal.jar log4j2.xml

# sqlite.SQLiteDBAccess is noisy
# java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar | grep -vw "sqlite.SQLiteDBAccess"
} || {
  popd
}
