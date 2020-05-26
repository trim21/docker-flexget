FROM python:3.7-alpine

MAINTAINER Trim21 <trim21me@gmail.com>

COPY requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
RUN mkdir /root/.flexget

WORKDIR /opt/flexget

VOLUME ["/root/.flexget"]

ENTRYPOINT ["flexget"]

CMD daemon start
