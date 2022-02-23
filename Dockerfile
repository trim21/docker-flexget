FROM ghcr.io/flexget/flexget:3.3.1

COPY requirements.plugins.txt /requirements.txt

RUN pip install --no-cache-dir -r /requirements.txt &&\
    pip install --no-cache-dir --force-reinstall --no-dependencies https://github.com/Trim21/transmission-rpc/archive/master.tar.gz &&\
    rm /requirements.txt
