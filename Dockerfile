FROM ghcr.io/flexget/flexget:3.8.6

COPY requirements.plugins.txt /requirements.txt

RUN pip install --no-cache-dir -r /requirements.txt && \
    rm /requirements.txt
