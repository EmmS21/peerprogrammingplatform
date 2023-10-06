from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from . import views
from rest_framework_simplejwt.views import (TokenRefreshView, TokenVerifyView)
from .serializers import CustomTokenObtainPairView
from .views import ProgrammingChallengeView, CacheView, usernames_to_room_id
from django.conf import settings
from django.conf.urls.static import static
from .api import RegisterApi
from voice_chat.views import RoomView
from payments.views import test_payment

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
# router.register(r'groups', views.GroupViewSet)
#create dynamic class to store media files
def get_img_upload_path(instance,filename):
    return f'{instance.name}/images/{filename}'

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/register', RegisterApi.as_view()),
    path('api/addEmail/', views.addEmail, name='addEmail'),
    path('update_profile/<int:pk>/', views.UpdateProfileView.as_view(), name='update_profile'),
    path('update_active/<int:pk>/', views.UpdateProfileActive.as_view(), name='update_activity'),
    path('get_room/', usernames_to_room_id, name='get room id'),
    path('voice_chat/', include('voice_chat.urls')),
    path('payments/', include('payments.urls')),
    path('cache/', include('redisCache.urls')),
    path('programming_challenge/', include ('connectmongodb.urls')),
    path('cacheUsers/', CacheView, name='cacheUsers'),
    path('api/programming_challenges/', ProgrammingChallengeView.as_view({'get': 'list'}), name='programming_challenges'),
    path('code_help/', include('codehelp.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.header = 'The Gradient Boost'
admin.site.site_title = f'The Gradient Boost Admin Portal'
admin.site.index_title = f'Welcome to the admin portal Emmanuel'
