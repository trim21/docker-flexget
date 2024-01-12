FROM ghcr.io/flexget/flexget:3.11.7

COPY requirements.plugins.txt /requirements.txt

RUN pip install --no-cache-dir -r /requirements.txt && \
    rm /requirements.txt
