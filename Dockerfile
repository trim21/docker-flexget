FROM python:3.7-alpine

MAINTAINER Trim21 <trim21me@gmail.com>
ENV TZ Asia/Shanghai
WORKDIR /opt/flexget

ENTRYPOINT ["flexget"]
CMD ["daemon", "start", "--autoreload-config"]

# renovate: datasource=pypi depName=flexget
ENV FLEXGET_VERSION=3.1.81

RUN pip install --no-cache-dir transmissionrpc flexget==${FLEXGET_VERSION}
