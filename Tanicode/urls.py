from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from articles import views



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Tanicode.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^dashboard/?$', views.dashboard),
    url(r'^/?$', views.index),
    url(r'^articles/', include('articles.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url('', include('social.apps.django_app.urls', namespace='social')),
    url('', include('django.contrib.auth.urls', namespace='auth')),
)
