from django.urls import path
from django.shortcuts import render
from . import views

def frontend_view(request):
    return render(request, "index.html")

urlpatterns = [
    path('start/', views.start_quiz, name='start_quiz'),
    path('questions/<int:session_id>/', views.get_questions, name='get_questions'),
    path('submit/<int:session_id>/', views.submit_answer, name='submit_answer'),
    path('stats/<int:session_id>/', views.get_stats, name='get_stats'),
    path('', frontend_view, name='frontend'),
]