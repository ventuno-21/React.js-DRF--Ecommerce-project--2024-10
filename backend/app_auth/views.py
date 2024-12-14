from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from app_auth.models import User, Profile
from app_auth.serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSeriallizer, ProfileSerializer
import shortuuid

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

def generate_otp():
    uuid_key = shortuuid.uuid()
    unique_key = uuid_key[:6]
    return unique_key

class PasswordResetEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSeriallizer

    def get_object(self):
        # Take email from url params
        email = self.kwargs['email']
        user  = User.objects.get(email=email)

        if user:
            user.otp= generate_otp()
            # otp should be saved to save it in our table
            user.save()
            uidb64=user.pk
            otp=user.otp
            link=f"http://localhost:5173/create-new-password?otp={otp}&uidb64={uidb64}/"
            print(link)

        return user

class PasswordChangeView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSeriallizer

    def create(self, request, *args, **kwargs):
        payload = request.data

        otp=payload['otp']
        uidb64=payload['uidb64']
        uidb64 = int(uidb64.split('/')[0])
        print(uidb64)

        # reset_token=payload['reset_token']
        password= payload['password']

        user=User.objects.get(id=uidb64, otp=otp)
        if user:
            user.set_password(password)
            user.otp=otp
            # user.reset_token=reset_token
            user.save()

            return Response({'message':'Password change successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message':'An error occurred'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        return profile



