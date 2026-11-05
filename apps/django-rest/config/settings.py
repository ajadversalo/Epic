SECRET_KEY='stacklab-dev'
DEBUG=True
ROOT_URLCONF='config.urls'
ALLOWED_HOSTS=['*']
INSTALLED_APPS=['django.contrib.contenttypes','rest_framework','labs']
MIDDLEWARE=[]
DEFAULT_AUTO_FIELD='django.db.models.BigAutoField'
DATABASES={'default':{'ENGINE':'django.db.backends.sqlite3','NAME':'db.sqlite3'}}
