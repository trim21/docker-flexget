# FlexGet service on Alpine Linux

This is a small container of FlexGet service on top of a tiny Linux distrubition. It's known that FlexGet requires Python and Python pip. They are already 160M to install on Ubuntu server 16.04 LTS. And this container is only 110MB.

## Configuration

* Detail configuration document can be found in [official web site](http://flexget.com/Configuration)
* Here is the sample `config.yml` file to co-operate with Transmission

```YAML
templates:
  transmissionrpc:
    transmission:
      host: <transmission-host>
      port: <transmission-port>
      path: /downloads/
      skip_files:
        - '*[sS]ample*'

tasks:
  tvshow:
    rss:
      url: https://www.tvshows.com/my_sub_rss.xml
    download: /torrents/
    template:
      - transmissionrpc
    accept_all: yes

schedules:
  - tasks: '*'
    interval:
      minutes: 10
```

* Prepare the configuratio file `config.yml` and put it in a dedicate directory. (i.e. `/path-to/flexget/conf`)
* Also please make sure the following properties are correctly set in Transmission configuraiton file `settings.json` , otherwise there will be a Forbidden issue.


> ...\
 "rpc-authentication-required": false,\
 "rpc-bind-address": "0.0.0.0",\
 "rpc-enabled": true,\
 "rpc-whitelist": "*.*.*.*",\
 "rpc-url": "/transmission/",\
 "rpc-whitelist-enabled": true,\
 ...

## Usage

```
docker pull kukki/docker-flexget
docker create --name flexget \
  -v /path-to/flexget/conf:/root/.flexget \
  -v /path-to/flexget/torrents:/torrents \
  kukki/docker-flexget daemon start
```

_Note_

* `/path-to/flexget/conf` is a directory that contains a `config.yml` for FlexGet.
  * The directory also contains a sqlite database file and temp files that help resuming torrents in each startup
* `/path-to/flexget/torrents` is a directory that stores downloaded torrents

When everything is ready, just put it to the background.

```
docker start flexget
```

## Reference

* [FlexGet](http://flexget.com/)

## Issue tracking

* [Trim21/docker-flexget](https://github.com/Trim21/docker-flexget)

## License
* [GNU General Public License v3](http://www.gnu.org/licenses/gpl-3.0.en.html)
