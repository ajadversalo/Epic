from django.urls import path
from labs.views import labs, lab_detail
urlpatterns=[path('labs', labs), path('labs/<str:lab_id>', lab_detail)]
