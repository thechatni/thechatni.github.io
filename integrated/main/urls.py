"""finalproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from . import views


urlpatterns = [
    path("", views.home, name='home'),
    path("similarity/", views.similarity, name='similarity'),
    # path("speech_to_text/", views.speech_to_text, name='speech_to_text'),
    # path("two/", views.two, name='two'),
    # path("three/", views.three, name='three'),
    # path("decision/", views.decision, name='decision'),
    # path("narration/", views.narration, name='narration'),
    # path("facialexp/", views.facialexp, name='facialexp'),
    # path("g1/", views.g1, name='g1'),
    # path("g2/", views.g2, name='g2'),
    # path("g3/", views.g3, name='g3'),
    # path("abc/", views.abc, name='abc')

]
