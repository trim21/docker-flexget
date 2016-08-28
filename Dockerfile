FROM alpine
MAINTAINER Jimmy Koo <kukkiz@gmail.com

RUN apk add --update \
  python \
  py-pip \
  ca-certificates 

RUN pip install paver
RUN pip install flexget
RUN pip install transmissionrpc
RUN mkdir /root/.flexget

WORKDIR /opt/flexget

VOLUME ["/root/.flexget"]

ENTRYPOINT ["flexget"]
