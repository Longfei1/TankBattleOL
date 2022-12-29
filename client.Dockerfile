FROM tomcat

LABEL author="longfei"

ARG PACK_PATH=/usr/local/tomcat/webapps
ARG PACK_NAME=TankBattleOL.zip

WORKDIR /usr/local/tomcat/bin

COPY $PACK_NAME $PACK_PATH

RUN unzip $PACK_PATH/$PACK_NAME -d $PACK_PATH && rm -rf $PACK_PATH/$PACK_NAME

CMD [ "catalina.sh", "run" ]