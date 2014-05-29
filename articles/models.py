from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User

from taggit.managers import TaggableManager

# Create your models here.
class Article(models.Model):
	title = models.CharField(max_length=255)
	slug = models.CharField(max_length=255)
	metaData = models.TextField()
	search = models.TextField()
	slides = models.TextField()
	html =  models.TextField()
	last_saved = models.DateField(auto_now=True)
	tags = TaggableManager()
	user = models.ForeignKey(User)
	is_published = models.BooleanField(default=False)
	#hit_count = models.IntegerField()

	def save(self):
	    super(Article, self).save()
	    self.slug = '%i/%s' % (
	        self.id, slugify(self.title)
	    )
	    super(Article, self).save()

class Series(models.Model):
	title = models.CharField(max_length=255)
	slug = models.CharField(max_length=255)
	search = models.TextField()
	articles = models.TextField()
	rawJSON = models.TextField()
	last_saved = models.DateField(auto_now=True)
	tags = TaggableManager()
	user = models.ForeignKey(User)
	is_published = models.BooleanField(default=False)
	#hit_count = models.IntegerField()

	def save(self):
	    super(Series, self).save()
	    self.slug = '%i/%s' % (
	        self.id, slugify(self.title)
	    )
	    super(Series, self).save()


class SeriesAndArticles(models.Model):
	article = models.ForeignKey(Article)
	series =  models.ForeignKey(Series)


class BeginnerSeries(models.Model):
	series =  models.ForeignKey(Series)