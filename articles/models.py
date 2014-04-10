from django.db import models

# Create your models here.
class Article(models.Model):
	metaData = models.TextField()
	last_saved = models.DateField(auto_now=True)

class Slides(models.Model):
	aid = models.ForeignKey(Article, related_name='parent')
	uid = models.IntegerField()
	slide = models.TextField()
	last_saved = models.DateField(auto_now=True)

class Tree(models.Model):
	js = models.TextField()
