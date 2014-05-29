from django.contrib import admin

from articles.models import *
# Register your models here.
admin.site.register(Article)
admin.site.register(Series)
admin.site.register(SeriesAndArticles)
admin.site.register(BeginnerSeries)
#admin.site.register(Tree)
#admin.site.register(Slides)
