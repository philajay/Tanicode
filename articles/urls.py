from django.conf.urls import patterns, url
from django.conf import settings
from django.conf.urls.static import static

from articles import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
	url(r'^ajaxupload', views.ajaxupload, name='ajaxupload'),
	url(r'^saveSlides', views.saveSlides, name='saveSlides'),
	url(r'^updateSlides', views.updateSlides, name='updateSlides'),
	url(r'^createHTML', views.createHTML, name='createHTML'),
	url(r'^saveTree', views.saveTree, name='saveTree'),
	url(r'^article', views.article, name='article'),
	url(r'^temparticle', views.article1, name='article1'),
	url(r'^getSlide', views.getSlide, name='article1'),
	url(r'^spad', views.spad, name='spad'),
	url(r'^create', views.create, name='create'),
	url(r'^scrollspy', views.scrollspy, name='scrollspy'),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)