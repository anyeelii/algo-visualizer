from django.db import models

# Create your models here.
# Represents the stucture of data stored in the database
# Object-Relational Mapper (ORM) allows developers to interact
# with the database using Python objects instead of raw SQL
# queries

class React(models.Model):
    name = models.CharField(max_length=30)
    detail = models.CharField(max_length=500)