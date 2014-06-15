from django.http import HttpResponse
from django.http import Http404
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django import forms
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
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# Create your views here.
logger = logging.getLogger('articles.views')


SpecialTags = ["{{ACADEMICS}}", "{{BEGINNER}}"]


def searchArticles(request):
	if request.method == 'POST':
	    noResult = False
	    results = None
	    search = request.POST.get("search")
	    keyword = search
	    searchResults = Article.objects.search(search)
	    paginator = Paginator(searchResults, 20, allow_empty_first_page=False) # Show 25 contacts per page

	    page = request.GET.get('page')
	    try:
	        results = paginator.page(page)
	    except PageNotAnInteger:
	        # If page is not an integer, deliver first page.
	        try:
	        	results = paginator.page(1)
	        except EmptyPage:
	        	noResult = True
	    except EmptyPage:
	        # If page is out of range (e.g. 9999), deliver last page of results.
	        noResult = True
	        results = paginator.page(paginator.num_pages)
	    template = loader.get_template('articles/searchArticles.html')
	    
	    context = RequestContext(request, { 'user': request.user,
	    	'results' : results , 'noResult' : noResult, 'keyword' : keyword})
	    return HttpResponse(template.render(context))
	else:
		template = loader.get_template('articles/searchArticles.html')
		context = RequestContext(request, { 'user': request.user, 'keyword' : ''})
		return HttpResponse(template.render(context))
		#return render_to_response('articles/searchArticles.html', {"user": request.user})
		


def searchSeries(request):
	if request.method == 'POST':
	    noResult = False
	    results = None
	    search = request.POST.get("search")
	    keyword = search
	    searchResults = Series.objects.search(search)
	    paginator = Paginator(searchResults, 20, allow_empty_first_page=False) # Show 25 contacts per page

	    page = request.GET.get('page')
	    try:
	        results = paginator.page(page)
	    except PageNotAnInteger:
	        # If page is not an integer, deliver first page.
	        try:
	        	results = paginator.page(1)
	        except EmptyPage:
	        	noResult = True
	    except EmptyPage:
	        # If page is out of range (e.g. 9999), deliver last page of results.
	        noResult = True
	        results = paginator.page(paginator.num_pages)
	    template = loader.get_template('articles/searchSeries.html')
	    
	    context = RequestContext(request, { 'user': request.user,
	    	'results' : results , 'noResult' : noResult, 'keyword' : keyword})
	    return HttpResponse(template.render(context))
	else:
		template = loader.get_template('articles/searchSeries.html')
		context = RequestContext(request, { 'user': request.user, 'keyword' : ''})
		return HttpResponse(template.render(context))
		#return render_to_response('articles/searchArticles.html', {"user": request.user})


def index(request):
    template = loader.get_template('articles/index.html')
    context = RequestContext(request, { 'user': request.user 
    })
    return HttpResponse(template.render(context))

@login_required
def dashboard(request):
    template = loader.get_template('articles/dashboard.html')
    articles = Article.objects.filter(user = request.user).order_by("-last_saved")
    context = RequestContext(request, {"articles": articles})
    return HttpResponse(template.render(context))


@login_required
def dashboardGetAllSeries(request):
    series = Series.objects.filter(user = request.user).order_by("-last_saved")
    l = []
    for s in series:
    	l.append({'name': str(s.title), 'id' : s.pk, 'domId' : "series_id_" + str(s.pk) ,'date' : str(s.last_saved), 'is_published' : s.is_published, 
    		"edit" : "/articles/createSeries?edit=123&aid=" + str(s.pk), 'slug' : '/articles/viewSeries/' + s.slug })

    return HttpResponse( json.dumps( l ) )


@login_required
def createSeries(request):
	name = ''
	tags = ''
	zist = ''
	sa = ''
	aid = ''
	edit = request.GET.get('edit', None)
	if(edit):
		p = 1
		try:
			x = request.GET.get('aid', None)
			if x :
				p = int(x)
		except:
			pass
		a = Series.objects.get(pk=p)
		logger.debug("object got")
		d = json.loads(a.rawJSON)
		name = d['name']
		tags = d['tags']
		zist = d['zist']
		sa = a.articles
		aid = a.pk

	template = loader.get_template('articles/createSeries.html')
	articles = Article.objects.filter(user = request.user , is_published = True).order_by("-last_saved")
	editParams = {"articles": articles,'aid' : aid, 'name' : name , 'zist': zist, 'tags': tags, 'sa' : sa}
	logger.debug("User " + str(request.user))
	logger.debug("edit Params is " + str(editParams))	
	context = RequestContext(request, editParams)
 	return HttpResponse(template.render(context))

@login_required
def updateSeries(request):
	x = request.GET.get('aid', None)
	p = int(x)
	a = Series.objects.get(pk=p)
	s = request.POST.get('data', None)
	obj = json.loads(s)
	name = obj['name']
	zist = obj['zist']
	lt = None
	if obj["tags"]:
		lt = obj["tags"].lower()
	tags = filter(None,  lt.split())

	search = str(name) + " " + str(obj["tags"]) + " " + str(zist)
	articles = obj['articles']
	a.articles = articles
	a.title = name
	a.user = request.user
	a.is_published = True
	a.search = search
	a.rawJSON = s
	a.save()
	
	if SpecialTags[1].lower() in lt:
		for aTag in tags:
			aTag = aTag.lower()
			if aTag == SpecialTags[1].lower():
				continue
			BeginnerSeriesTags.objects.get_or_create(titleTags = aTag)


	SeriesAndArticles.objects.filter(series = a).delete()
	sid = a.pk;
	al = json.loads(articles)
	for a1 in al['articles'] :
		aid = a1['id']
		sa = SeriesAndArticles(article_id = aid, series_id = sid)
		sa.save()
			
	return HttpResponse( json.dumps( {'id': a.pk} ) )


@login_required
def saveSeries(request):
	s = request.POST.get('data', None)
	obj = json.loads(s)
	name = obj['name']
	zist = obj['zist']
	lt = None
	if obj["tags"]:
		lt = obj["tags"].lower()
	tags = filter(None,  lt.split())

	search = str(name) + " " + str(obj["tags"]) + " " + str(zist)
	articles = obj['articles']
	a = Series()
	a.articles = articles
	a.title = name
	a.user = request.user
	a.is_published = False
	a.search = search
	a.rawJSON = s
	a.save()


	if SpecialTags[1].lower() in lt:
		for aTag in tags:
			aTag = aTag.lower()
			if aTag == SpecialTags[1].lower():
				continue
			BeginnerSeriesTags.objects.get_or_create(titleTags = aTag)

	al = json.loads(articles)
	
	sid = a.pk;
	for a1 in al['articles'] :
		aid = a1['id']
		sa = SeriesAndArticles(article_id = aid, series_id = sid)
		sa.save()
			
	return HttpResponse( json.dumps( {'id': a.pk} ) )


@login_required
def saveComment(request):
	comment = request.POST.get('comment', None)
	aid = int(request.POST.get('aid', None))
	wid = int (request.POST.get('wid', None))
	c = Comments()
	c.comment = comment
	c.wid = wid
	c.article = Article.objects.get(pk=aid)
	c.user = request.user
	c.save()
	return HttpResponse( json.dumps( {'comment': comment, 'user': c.user.username, 'date' : str(c.saved_time)} ) )


def getComments(request):
	aid = request.GET.get("aid")
	p = int( aid )
	w = int ( request.GET.get("wid") )
	a = Article.objects.get(pk=p)
	cs = Comments.objects.filter(article= a, wid = w).order_by("-saved_time")
	retObjs = []
	for c in cs :
		s = {'comment' : c.comment, 'date' : str(c.saved_time), 'user': c.user.username}
		retObjs.append(s)

	return HttpResponse( json.dumps( {'comments': retObjs} ))



@login_required
def publishArticle(request):
	p = request.GET.get('id', None)
	try:
		p = int(p)
	except:
		return HttpResponse( json.dumps( {'msgg': 'Invalid article ID.'} ) )

	a = Article.objects.get(pk=p)
	a.is_published = True
	a.save()
	return HttpResponse( json.dumps( {'msgg': "Article " + a.title + " published", 'id': p} ) )

@login_required
def publishSeries(request):
	p = request.GET.get('id', None)
	try:
		p = int(p)
	except:
		return HttpResponse( json.dumps( {'msgg': 'Invalid article ID.'} ) )

	a = Series.objects.get(pk=p)
	a.is_published = True
	a.save()
	return HttpResponse( json.dumps( {'msgg': "Series " + a.title + " published", 'id': p} ) )


@login_required
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


@login_required  
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
	if not a.is_published:
		raise Http404

	metadata = a.metaData
	slides = a.slides
	html = a.html
	aid = a.pk
	template = loader.get_template('articles/viewArticle.html')
	context = RequestContext(request, {
		'object' : a,
		'metadata': json.dumps(metadata),
		'slides' : json.dumps(slides),
		'html' : html,
		'aid': aid,
		'user': request.user ,
	})
	return HttpResponse(template.render(context))

def viewSeries(request, id, slug):
	p = int(id)
	a = Series.objects.get(pk=p)
	if not a.is_published:
		raise Http404
	aid = a.pk
	template = loader.get_template('articles/viewSeries.html')
	context = RequestContext(request, {
		'object' : a,
		'aid': aid,
		'user' : request.user,
	})
	return HttpResponse(template.render(context))

def getArticleSlidesAjax(request):
	id = request.GET.get("aid")
	p = int(id)
	logger.debug("Inside")
	a = Article.objects.get(pk=p)
	metadata = a.metaData
	slides = a.slides
	html = a.html
	aid = a.pk
	d = {
		'metadata': json.dumps(metadata),
		'slides' : json.dumps(slides),
		'html' : html,
		'aid': aid,
		}
	#context = RequestContext(request, )
	return HttpResponse( json.dumps( d ) )
	


def viewAlgo(request, id, slug):
	template = loader.get_template('articles/viewAlgo.html')
	context = RequestContext(request, {
	})
	return HttpResponse(template.render(context))

@login_required
@csrf_exempt
def saveSlides(request):
	s = request.POST.get('data', None)
	obj = json.loads(s)
	slides = obj['slides']
	metaData = obj['metaData']
	obj1 = metaData['articleMetaData']
	obj1 = json.loads(obj1)
	name = obj1["name"]
	lt = None
	if obj1["tags"]:
		lt = obj1["tags"].lower()
	tags = filter(None,  lt.split())

	zist = obj1["zist"]
	search = str(name) + " " + str(obj1["tags"]) + " " + str(zist)
	html = obj['html']
	a = Article()
	a.metaData = json.dumps( metaData )
	a.slides = json.dumps( slides )
	a.html = search + " " +  html 
	a.title = name
	a.user = request.user
	a.is_published = False
	a.search = search
	a.save()

	if SpecialTags[0].lower() in lt:
		for aTag in tags:
			aTag = aTag.lower()
			if aTag == SpecialTags[0].lower():
				continue
			AcademicsTags.objects.get_or_create(titleTags = aTag)


	return HttpResponse( json.dumps( {'id': a.id} ) )

@login_required	
@csrf_exempt
def updateSlides(request, id):
	logger.debug("Ajay -- save Slides Called")
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
	zist = obj1["zist"]
	search = str(name) + " " + str(obj1["tags"]) + " " + str(zist)
	
	lt = None
	if obj1["tags"]:
		lt = obj1["tags"].lower()
	tags = filter(None,  lt.split())
	logger.debug("tags are " + str(tags))

	html = search + '  ' + obj['html']
	a = Article.objects.get(pk=p)
	a.title = name
	a.metaData = json.dumps( metaData )
	a.slides = json.dumps( slides )
	a.html = json.dumps( html )
	a.title = name
	a.search = search
	a.save()

	if SpecialTags[0].lower() in lt:
		for aTag in tags:
			aTag = aTag.lower()
			logger.debug("checking tag are " + aTag)
			if aTag == SpecialTags[0].lower():
				continue
			logger.debug("adding tag are " + aTag)
			AcademicsTags.objects.get_or_create(titleTags = aTag)



	logger.debug("Ajay -- save Slides saved")
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

@login_required	
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



