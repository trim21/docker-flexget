FROM python:3.7-alpine

MAINTAINER Trim21 <trim21me@gmail.com>

# renovate: datasource=pypi depName=flexget
ENV FLEXGET_VERSION=3.1.57

RUN pip install transmissionrpc flexget==${FLEXGET_VERSION}
RUN mkdir /root/.flexget

WORKDIR /opt/flexget

VOLUME ["/root/.flexget"]

ENTRYPOINT ["flexget"]

CMD daemon start
