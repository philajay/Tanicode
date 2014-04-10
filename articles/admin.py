from django.contrib import admin

from articles.models import Article, Tree, Slides
# Register your models here.
admin.site.register(Article)
admin.site.register(Tree)
admin.site.register(Slides)
