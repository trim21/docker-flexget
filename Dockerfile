FROM python:3.8

MAINTAINER Trim21 <trim21me@gmail.com>
ENV TZ Asia/Shanghai
WORKDIR /opt/flexget

RUN copy requiremenets.txt /req && \
    pip install --no-cache-dir -r /req &&\
    rm /req

ENTRYPOINT ["flexget"]
CMD ["daemon", "start", "--autoreload-config"]
