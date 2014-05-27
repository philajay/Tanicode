from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User

from taggit.managers import TaggableManager

# Create your models here.
class Article(models.Model):
	title = models.CharField(max_length=255)
	slug = models.CharField(max_length=255)
	metaData = models.TextField()
	slides = models.TextField()
	html =  models.TextField()
	last_saved = models.DateField(auto_now=True)
	tags = TaggableManager()
	user = models.ForeignKey(User)


	def save(self):
	    super(Article, self).save()
	    self.slug = '%i/%s' % (
	        self.id, slugify(self.title)
	    )
	    super(Article, self).save()
