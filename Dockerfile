FROM python:3.7-alpine
MAINTAINER Trim21 <trim21me@gmail.com>

RUN pip install paver
RUN pip install flexget
RUN pip install transmissionrpc
RUN mkdir /root/.flexget

WORKDIR /opt/flexget

VOLUME ["/root/.flexget"]

ENTRYPOINT ["flexget"]

CMD daemon start
