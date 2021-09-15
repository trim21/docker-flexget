FROM flexget-base:latest

# renovate: datasource=pypi depName=trim21-flexget-plugins
ARG TRIM21_PLUGIN_VERSION=0.0.1

RUN pip install --no-cache-dir trim21-flexget-plugins==${TRIM21_PLUGIN_VERSION}
