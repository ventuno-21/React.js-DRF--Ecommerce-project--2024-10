from rest_framework import serializers
from .models import Profile, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username
        token['is_authenticated'] = True
        try:
            token['vendor_id'] = user.vendor.id
        except:
            token['vendor_id'] = 0
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required= True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required= True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "password does not match"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            phone=validated_data['phone'],
        )

        email_username = user.email.split('@')[0]
        user.username = email_username
        user.set_password(validated_data['password'])
        user.save()
        return user




class UserSeriallizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model= Profile
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSeriallizer(instance.user).data
        return response
