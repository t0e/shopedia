FROM python:3.6-alpine

RUN adduser -D application

WORKDIR /home/application

COPY requirements.txt requirements.txt
# For PyCrypto
RUN apk add gcc g++ make libffi-dev openssl-dev
RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn

COPY shopedia/ ./shopedia/
COPY shopedia_customer/ ./shopedia_customer/
COPY media/ ./media/
COPY databasefiles ./databasefiles/

COPY manage.py config.ini boot.sh version db.sqlite3 auth.py ./
RUN chmod +x boot.sh

RUN chown -R application:application ./
USER application

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]