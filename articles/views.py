from django.http import HttpResponse
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render

import os
import traceback
import uuid
import sys
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import logging
import json
from articles.models import *

# Create your views here.
logger = logging.getLogger('articles.views')



def index(request):
    template = loader.get_template('articles/index.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))

def create(request):
    edit = request.GET.get('edit', None)
    metadata = ''
    slides = ''
    html = ''
    aid = 0
    if(edit):
		p = 1
		try:
			x = request.GET.get('aid', None)
			if x :
				p = int(x)
		except:
			pass
		a = Article.objects.get(pk=p)
		metadata = a.metaData
		slides = a.slides
		html = a.html
		aid = a.pk

    template = loader.get_template('articles/create.html')
    context = RequestContext(request, {
    	'metadata': json.dumps(metadata),
    	'slides' : json.dumps(slides),
    	'html' : html,
    	'aid': aid
    })
    return HttpResponse(template.render(context))
    
def edit(request, id):
	a = Article.objects.get(pk=id)
	metadata = a.metaData
	slides = a.slides
	html = a.html
	aid = a.pk
	template = loader.get_template('articles/create.html')
	context = RequestContext(request, {
		'metadata': json.dumps(metadata),
		'slides' : json.dumps(slides),
		'html' : html,
		'aid': aid
	})
	return HttpResponse(template.render(context))


def getSlide(request):
	a = 1
	try:
		x = request.GET.get('aid', None)
		if x :
			a = int(x)
	except:
		pass
	
	p = 1
	try:
		x = request.GET.get('uid', None)
		if x :
			p = int(x)
	except:
		pass
	s = Slides.objects.get(aid = a , uid=p)
	return HttpResponse(json.dumps(s.slide))

def viewArticle(request, id, slug):
	p = int(id)

	'''
	try:
		x = request.GET.get('aid', None)
		if x :
			p = int(x)
	except:
		pass
	'''
	a = Article.objects.get(pk=p)
	metadata = a.metaData
	slides = a.slides
	html = a.html
	aid = a.pk
	template = loader.get_template('articles/viewArticle.html')
	context = RequestContext(request, {
		'metadata': json.dumps(metadata),
		'slides' : json.dumps(slides),
		'html' : html,
		'aid': aid
	})
	return HttpResponse(template.render(context))


def viewAlgo(request):
	template = loader.get_template('articles/viewAlgo.html')
	context = RequestContext(request, {
	})
	return HttpResponse(template.render(context))


@csrf_exempt
def saveSlides(request):
	s = request.POST.get('data', None)
	obj = json.loads(s)
	slides = obj['slides']
	metaData = obj['metaData']
	obj1 = metaData['articleMetaData']
	obj1 = json.loads(obj1)
	name = obj1["name"]
	tags = filter(None,  obj1["tags"].split())
	html = obj['html']
	a = Article()
	a.metaData = json.dumps( metaData )
	a.slides = json.dumps( slides )
	a.html = json.dumps( html )
	a.title = name
	a.save()
	for tag in tags:
		a.tags.add(tag) 
	
	return HttpResponse( json.dumps( {'id': a.id} ) )
	
@csrf_exempt
def updateSlides(request):
	s = request.POST.get('data', None)
	obj = json.loads(s)
	p = obj['aid']
	try:
		p = int(p)
	except:
		return HttpResponse( json.dumps( {'id': 'exception occurred'} ) )

	slides = obj['slides']
	metaData = obj['metaData']
	obj1 = metaData['articleMetaData']
	obj1 = json.loads(obj1)
	#print str(obj1)
	#obj1 = obj['articleMetaData']
	name = obj1["name"]
	tags = filter(None,  obj1["tags"].split())

	html = obj['html']
	a = Article.objects.get(pk=p)
	a.metaData = json.dumps( metaData )
	a.slides = json.dumps( slides )
	a.html = json.dumps( html )
	a.title = name
	a.save()
	a.tags.clear()
	for tag in tags:
		a.tags.add(tag) 
	return HttpResponse( json.dumps( {'id': a.id} ) )



def save_upload( uploaded, filename, raw_data ):
	''' 
	raw_data: if True, uploaded is an HttpRequest object with the file being
			the raw post data 
			if False, uploaded has been submitted via the basic form
			submission and is a regular Django UploadedFile in request.FILES
	'''
	try:
		from io import FileIO, BufferedWriter
		#sPath = os.path.join(settings.BASE_DIR, 'articles', 'static', 'images')
		sPath = os.path.join('/home/philajay/webapps/static', 'images')
		ext = filename.split(".")
		if not ext:
			ext = ".jpg"
		else :
			ext = "." + str(ext[-1])
		sname = str(uuid.uuid1()) + ext
		sPathimage = os.path.join(sPath,  sname)
		with BufferedWriter( FileIO( sPathimage, "wb" ) ) as dest:
		  # if the "advanced" upload, read directly from the HTTP request 
		  # with the Django 1.3 functionality
			if raw_data:
				foo = uploaded.read( 1024 )
				while foo:
				  dest.write( foo )
				  foo = uploaded.read( 1024 ) 
			  # if not raw, it was a form upload so read in the normal Django chunks fashion
			else:
				for c in uploaded.chunks( ):
				  dest.write( c )
			# got through saving the upload, report success
			return sname
	except Exception, e:
		# could not open the file most likely
		# print 'Exception occurred ' + str(e)
		logger.debug('something went wrong')
		logger.exception(e)
		pass
	
	return ''

	
@csrf_exempt
def ajaxupload( request ):
	if request.method == "POST":   
		if request.is_ajax( ):
			# the file is stored raw in the request
			upload = request
			is_raw = True
			# AJAX Upload will pass the filename in the querystring if it is the "advanced" ajax upload
			try:
				filename = request.GET[ 'qqfile' ]
			except KeyError: 
				return HttpResponseBadRequest( "AJAX request not valid" )
		# not an ajax upload, so it was the "basic" iframe version with submission via form
		else:
			is_raw = False
			if len( request.FILES ) == 1:
				# FILES is a dictionary in Django but Ajax Upload gives the uploaded file an
				# ID based on a random number, so it cannot be guessed here in the code.
				# Rather than editing Ajax Upload to pass the ID in the querystring,
				# observer that each upload is a separate request,
				# so FILES should only have one entry.
				# Thus, we can just grab the first (and only) value in the dict.
				upload = request.FILES.values( )[ 0 ]
			else:
				raise Http404( "Bad Upload" )
			filename = upload.name
	else:
		return HttpResponse("You gotta be kidding me " + str(request.method)) 
	
	
	#return HttpResponse( json.dumps( {'success': 'Before calling save_upload'} ) )
	# save the file
	success = save_upload( upload, filename, is_raw )

	# let Ajax Upload know whether we saved it or not
	
	ret_json = { 'success': success}
	#logger.debug(str(ret_json))
	return HttpResponse( json.dumps( ret_json ) )



