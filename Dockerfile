FROM python:3.10

WORKDIR /home/root

RUN apt-get update \
    && apt-get install -y --no-install-recommends locales \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && locale-gen ja_JP.UTF-8 \
    && localedef -f UTF-8 -i ja_JP ja_JP.UTF-8 \
    && python3 -m pip install --upgrade pip \
    && python3 -m pip install requests line-bot-sdk ratelimit 
