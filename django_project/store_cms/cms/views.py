# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import datetime
import operator

from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.db.models import Q
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from cms.forms import LoginForm
from cms.models import Store
from cms.decorators import login_required_api


def list_stores(request):
    """
    List all the stores and the details
    :param request:
    :return:
    """
    response_dict = {}
    stores = Store.objects.filter(disabled=False).order_by('sort_order')
    store_list = []
    for store in stores:
        store_list.append(store.store_details_dict())

    response_dict['status'] = 200
    response_dict['stores'] = store_list
    return JsonResponse(response_dict)


@csrf_exempt
def login_api(request):
    """
    Login the store with store code and password
    :param request:
    :return:
    """
    response_dict = {}
    login_form = LoginForm(request.POST or None)
    if login_form.is_valid():
        store_object = login_form.store_obj
        cleaned_data = login_form.cleaned_data
        user = authenticate(request=request, username=store_object.login_user.username, password=cleaned_data['password'])
        if user:
            login(request, user)
            response_dict['status'] = 200
            response_dict['message'] = "Logged in successfully"
        else:
            response_dict['status'] = 400
            response_dict['message'] = "Invalid credentials"
    else:
        response_dict['status'] = 400
        response_dict['message'] = "Invalid credentials"

    return JsonResponse(response_dict)


@login_required_api
def store_contents(request):
    """
    Returns all the contents that belong to a particular store
    :param request:
    :return:
    """
    response_dict = {}

    date_today = timezone.now()

    store_object = Store.objects.get(login_user=request.user, disabled=False)

    # Fetch all the contents which has not expired or no expiry set for the store.
    q_list = [
        Q(start_time__isnull=False, start_time__lte=date_today) | Q(start_time__isnull=True),
        Q(end_time__isnull=False, end_time__gte=date_today) | Q(end_time__isnull=True)
    ]
    contents = store_object.content.filter(Q(reduce(operator.and_, q_list)))

    content_list = []
    for content in contents:
        content_list.append(content.content_details_dict())

    store_object.last_check_in = date_today
    store_object.save()

    response_dict['status'] = 200
    response_dict['contents'] = content_list
    return JsonResponse(response_dict)
