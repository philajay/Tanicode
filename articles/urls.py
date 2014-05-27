from django.conf.urls import patterns, url
from django.conf import settings
from django.conf.urls.static import static

from articles import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
	#ajax upload for images and files...
	url(r'^ajaxupload', views.ajaxupload, name='ajaxupload'),
	url(r'^saveSlides', views.saveSlides, name='saveSlides'),
	url(r'^edit/updateSlides', views.updateSlides, name='updateSlides'),
	url(r'^edit/ajaxupload', views.ajaxupload, name='ajaxupload'),
	#Main article page
	url(r'^viewArticle/(?P<id>\d+)/(?P<slug>[-\w\d]+)/?$', views.viewArticle, name='viewArticle'),
	#View Algo
	url(r'^viewAlgo/(?P<id>\d+)/(?P<slug>[-\w\d]+)/?$', views.viewAlgo, name='viewAlgo'),
	#Get the slide JSON through a ajax request. Used in multiple pages
	url(r'^getSlide', views.getSlide, name='getSlide'),
	#Main create page
	url(r'^create', views.create, name='create'),
	url(r'^edit/(?P<id>\d+)/?', views.edit, name='edit'),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)