FROM flexget-base:latest

COPY requirements.plugins.txt /requirements.txt

RUN pip install --no-cache-dir --force-reinstall -r /requirements.txt &&\
    rm /requirements.txt
