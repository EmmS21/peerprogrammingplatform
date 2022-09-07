from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from django.db import close_old_connections
from urllib.parse import parse_qs
from jwt import decode as jwt_decode
from django.conf import settings
@database_sync_to_async
def get_user(validated_token):
    try:
        user = get_user_model().objects.get(id=validated_token["user_id"])
        print('what is user now', user)
        # return get_user_model().objects.get(id=toke_id)
        return user
    except:
        print('except hit')
        return AnonymousUser()


class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        print('JWTAUthMiddleware')
        print('what is token', scope["query_string"].decode("utf8"))
       # Close old database connections to prevent usage of timed out connections
        close_old_connections()
        token = scope["query_string"].decode("utf8")
        # print("token is now", token)
        token_extracted = jwt_decode(token)
        print('extracted token is now', token_extracted)
        # scope["user"] = await get_user(validated_token=token)
        # decoded_data = jwt_decode(token)
        # print('decoded_data', decoded_data)
        # decoded_data = jwt_decode(token, settings.SIMPLE_JWT["SIGNING_KEY"], algorithms=["HS256"])
        # Get the user using ID
        # scope["user"] = await get_user(validated_token=decoded_data)
        # print('scope user', scope['user'])
        # return await super().__call__(scope, receive, send)


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))
