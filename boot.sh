#!/bin/sh
source venv/bin/activate
gunicorn -b :5000 shopedia.wsgi:application