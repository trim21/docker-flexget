FROM python:3.8

MAINTAINER Trim21 <trim21me@gmail.com>
ENV TZ Asia/Shanghai
WORKDIR /opt/flexget

ENTRYPOINT ["flexget"]
CMD ["daemon", "start", "--autoreload-config"]

# renovate: datasource=pypi depName=flexget
ENV FLEXGET_VERSION=3.1.116

RUN pip install --no-cache-dir transmissionrpc flexget==${FLEXGET_VERSION}
