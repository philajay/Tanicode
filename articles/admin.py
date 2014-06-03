from django.contrib import admin

from articles.models import *
# Register your models here.
admin.site.register(Article)
admin.site.register(Series)
admin.site.register(SeriesAndArticles)
admin.site.register(BeginnerSeriesTags)
admin.site.register(AcademicsTags)
#admin.site.register(Slides)
