from django.conf.urls import url
from django.contrib import admin

from cms import views as cms_views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'storecms/stores/list/?', cms_views.list_stores),
    url(r'storecms/store/login/?', cms_views.login_api),
    url(r'storecms/store/contents/?', cms_views.store_contents),
]
