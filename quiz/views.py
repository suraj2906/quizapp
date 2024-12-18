from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Question, UserSession
import random
import json

# Create your views here.
@csrf_exempt
def start_quiz(request):
    if request.method == "POST":
        session = UserSession.objects.create()
        return JsonResponse({"message": "Quiz session started", "session_id": session.id})

@csrf_exempt
def get_questions(request, session_id):
    session = get_object_or_404(UserSession, id=session_id)
    limit = int(request.GET.get("limit", 10))  
    all_questions = list(Question.objects.all())  
    selected_questions = random.sample(all_questions, min(limit, len(all_questions)))  

    questions_data = [
        {
            "question_id": question.id,
            "text": question.text,
            "options": question.options,
        }
        for question in selected_questions
    ]

    return JsonResponse({"questions": questions_data})
@csrf_exempt
def submit_answer(request, session_id):
    if request.method == "POST":
        session = get_object_or_404(UserSession, id=session_id)
        data = json.loads(request.body)
        question_id = data.get("question_id")
        selected_option = data.get("selected_option")

        question = get_object_or_404(Question, id=question_id)
        session.total_questions += 1

        if question.correct_option == selected_option:
            session.correct_answers += 1
            result = "correct"
        else:
            session.incorrect_answers += 1
            result = "incorrect"

        session.save()

        return JsonResponse({
            "result": result,
            "correct_option": question.correct_option
        })

@csrf_exempt
def get_stats(request, session_id):
    session = get_object_or_404(UserSession, id=session_id)
    return JsonResponse({
        "total_questions": session.total_questions,
        "correct_answers": session.correct_answers,
        "incorrect_answers": session.incorrect_answers
    })
