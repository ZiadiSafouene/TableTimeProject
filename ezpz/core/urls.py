
from django.urls import path
from . import views

urlpatterns = [
    path('api/class-dashboard/<str:class_name>/', views.class_dashboard),
    path('api/teacher-dashboard/<str:teacher_name>/', views.teacher_dashboard),
    path('api/upload-schedule/', views.upload_schedule, name='upload_schedule'),
    path('api/student/<str:class_name>/', views.student_dashboard),
    path('api/teacher/<str:teacher_name>/', views.teacher_dashboard),
    path('api/admin/schedule/<str:find_by>/<str:find_key>/', views.admin_dashboard)
]

