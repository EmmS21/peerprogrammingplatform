import os
from pathlib import Path
from decouple import config


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '7v2g512#_rcafql%j3-8kd--2y&tjtfrybi4e#36^2+x2-2t8w'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    "06e2-67-85-185-28.ngrok-free.app",
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "codesquad.onrender.com",
    "peerprogrammingplatform.vercel.app",
    "aicoder.onrender.com"  # Add this line
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'accounts',
    'voice_chat',
    'corsheaders',
    'rest_framework',
    'rest_framework_api_key',
    'rest_framework.authtoken',
    'rest_auth',
    # added simplejwt
    'rest_framework_simplejwt',
    # all auth in attempt to alleviate RuntimeError: Model class allauth.account.models.EmailAddress doesn't declare an explicit app_label and isn't in an application in INSTALLED_APPS
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'payments',
    'redisCache',
    'channels',
    'webpush',
    'connectmongodb',
    'codehelp',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "https://peerprogrammingplatform.vercel.app",
    "https://aicoder.onrender.com",
    "https://06e2-67-85-185-28.ngrok-free.app",
]

CORS_ORIGIN_WHITELIST = (
    "localhost",
    "aicoder.onrender.com",
    "https://aicoder.onrender.com",
    "https://peerprogrammingplatform.vercel.app",
    "https://06e2-67-85-185-28.ngrok-free.app",
)

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]


ROOT_URLCONF = 'signup.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'signup.wsgi.application'
ASGI_APPLICATION = 'signup.asgi.application'

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis://default:m6L7tzChLLbZ92p0hfESrM7d8SwNhzw9@redis-14474.c114.us-east-1-4.ec2.cloud.redislabs.com:14474")],
        },
    },
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# CACHES = {
#     "default": {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": "redis://default:m6L7tzChLLbZ92p0hfESrM7d8SwNhzw9@redis-14474.c114.us-east-1-4.ec2.cloud.redislabs.com:14474",
#         "TIMEOUT": 5 * 60,
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient"
#         },
#         "KEY_PREFIX": "pairprogramming"
#     },
#     "leadership_board" :{
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": "redis://clustercfg.pair-programming-leadership-board.znfz9i.use1.cache.amazonaws.com:6379",
#         "TIMEOUT": 5 * 60,
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient"
#         },
#         "KEY_PREFIX": "leadershipboard"
#     }
# }

WEBPUSH_SETTINGS = {
    "VAPID_PUBLIC_KEY": os.getenv('VAPID_PUBLIC_KEY'),
    "VAPID_PRIVATE_KEY": os.getenv('VAPID_PRIVATE_KEY'),
    "VAPID_ADMIN_EMAIL": os.getenv('VAPID_ADMIN_EMAIL')
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime}: {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': True,
        }
    }
}
# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/


STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.ScryptPasswordHasher",
]

SITE_ID = 1
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_SESSION_REMEMBER = True
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_UNIQUE_EMAIL = True

# Rest Framework config.
REST_FRAMEWORK = {
    'DATETIME_FORMAT': "%m/%d/%Y %H:%M:%S",
    'DEFAULT_PERMISSION_CLASSES': (
        # 'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
        # 'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
}

# Twilio Account details
TWILIO_ACCOUNT_SID = config('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = config('TWILIO_AUTH_TOKEN')
TWIML_APPLICATION_SID = config('TWIML_APPLICATION_SID')
TWILIO_API_KEY = config('TWILIO_API_KEY')
TWILIO_API_SECRET = config('TWILIO_API_SECRET')


SIMPLE_JWT = {
    'UPDATE_LAST_LOGIN': True,
}

# REDIS_HOST = 'newredis'
# REDIS_PORT = 10000
# REDIS_PASSWORD = 'P@ssword21'

REDIS_HOST = "redis-14474.c114.us-east-1-4.ec2.cloud.redislabs.com"
REDIS_PORT = 14474
REDIS_PASSWORD = "m6L7tzChLLbZ92p0hfESrM7d8SwNhzw9"


# REDIS_HOST_LAYER = 'localhost'
# REDIS_PORT_LAYER = 49153
