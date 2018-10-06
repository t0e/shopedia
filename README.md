# Shopedia

Shopping app for nearby shops

### Prerequisites

You can find the prerequisities in requirement.txt

Install packages from requirements.txt

```
pip install -r requirements.txt 
```

### Install Database

Install Mongodb and Mongodb server in your computer. 

Create Database name "shopedia" in mongodb

Import json collections to shopedia database

Go To Project folder and change driectory as followed.
```
cd shopedia.json/shopedia

```

Run the following command by replacing the collection_name and filename to each file name in the folder

```
mongoimport --db shopedia --collection collection_name --file filename.json
```

## Deployment

In local development server, you can run 
```
python manage.py runsslserver 0.0.0.0:8000
```