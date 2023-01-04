FROM registry-vpc.cn-chengdu.aliyuncs.com/longfei1/server-build AS build

#下载源码，编译，打包
RUN source ~/.bashrc \
    && cd /usr/code \ 
    && git clone https://github.com/Longfei1/TankBattleOL.git \
    && cd TankBattleOL/server/build \
    && cmake .. \ 
    && make \
    && cd ../../proxy/build \
    && cmake .. \
    && make \
    && cd ../.. \
    && tar -czf /service.tar.gz server/build proxy/build


FROM centos:7

LABEL author="longfei"

WORKDIR /data/service

COPY --from=build /service.tar.gz .

RUN tar -xzf service.tar.gz && rm -f service.tar.gz 