FROM ghcr.io/flexget/flexget:3.9.11

COPY requirements.plugins.txt /requirements.txt

RUN pip install --no-cache-dir -r /requirements.txt && \
    rm /requirements.txt
