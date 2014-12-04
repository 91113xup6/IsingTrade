from django.conf.urls import patterns, include, url
from django.contrib import admin
from server.views import my_homepage

urlpatterns = patterns('',
                       url(r'^$', my_homepage),
                       # Examples:
                       # url(r'^$', 'server.views.home', name='home'),
                       # url(r'^blog/', include('blog.urls')),
                       url(r'^admin/', include(admin.site.urls)),
)
