import sys
from multiprocessing import Process
import json
from django.http import JsonResponse, HttpResponse
from django.contrib.sessions.models import Session
from django.shortcuts import render
from time import sleep
import scipy
from sentence_transformers import SentenceTransformer
# import django
# django.setup()


def home(request):
    return render(request, 'home.html')

def similarity(request):
    inp = request.POST.get('input')
    condition = request.POST.get('condition') 
    model = SentenceTransformer('bert-base-nli-mean-tokens')

    corpus= [condition]
    corpus_embeddings = model.encode(corpus)

    queries = [inp]
    query_embeddings = model.encode(queries)

    for query, query_embedding in zip(queries, query_embeddings):
        distances = scipy.spatial.distance.cdist([query_embedding], corpus_embeddings, "cosine")[0]
        distances = 1-distances
        new = " ".join(str(x) for x in distances)

    resp = {}
    resp['label'] = new
    # resp['getdata'] = getdata
    return HttpResponse(json.dumps(resp))
