from functools import wraps

from django.http import JsonResponse


def login_required_api(view_fn):
    """Check if the user is logged in"""
    @wraps(view_fn)
    def _wrapped_view_fn(request, *args, **kwargs):
        if request.user.is_authenticated():
            # id user is logged in, return the function
            return view_fn(request, *args, **kwargs)
        else:
            # if user is not logged in send a failure response
            response = {
                'status': 400,
                'message': 'Please login to view this page'
            }
            return JsonResponse(response, status=401)
    return _wrapped_view_fn
