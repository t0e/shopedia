# Generated by Django 2.1.2 on 2018-10-22 06:50

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('shopedia_customer', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Orders',
            fields=[
                ('_id', models.AutoField(primary_key=True, serialize=False)),
                ('order_id', models.IntegerField()),
                ('user_id', models.IntegerField()),
                ('items', jsonfield.fields.JSONField()),
                ('sub_total', models.DecimalField(decimal_places=4, max_digits=10)),
                ('internet_transaction_fee', models.DecimalField(decimal_places=4, max_digits=10)),
                ('total', models.DecimalField(decimal_places=4, max_digits=10)),
            ],
        ),
    ]
