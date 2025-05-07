from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import numpy as np
import tempfile
import os

days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
day_idx = {d: i for i, d in enumerate(days)}
df = None  # Will be initialized when file is uploaded

@csrf_exempt
def upload_schedule(request):
    """Handle file upload and initialize the schedule dataframe"""
    global df
    
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    if 'file' not in request.FILES:
        return JsonResponse({"error": "No file provided"}, status=400)
    
    file = request.FILES['file']
    
    # Validate file extension
    if not file.name.endswith(('.xlsx', '.xls')):
        return JsonResponse({"error": "Invalid file format. Only Excel files are allowed."}, status=400)
    
    try:
        # Save to temp file and read
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            for chunk in file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        
        # Read the Excel file
        df = pd.read_excel(tmp_path)
        
        # Clean up
        os.unlink(tmp_path)
        
        return JsonResponse({"success": "File uploaded and processed successfully"})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_class_slots(class_):
    if df is None:
        return {"error": "No schedule data loaded. Please upload a file first."}
    
    sessions = df.iloc[0:1, 1:7].values[0]

    rooms = {}
    for i, room in enumerate(df.iloc[:, 0].values):
        if room is not np.nan:
            rooms[room] = i

    schedule = {}

    for day in days:
        day_id = day_idx[day]
        schedule[day] = []
        for slot in range(1, 7):
            session = day_id + slot

            for room in rooms:
                room_id = rooms[room]
                if df.iloc[room_id, session] is not np.nan and class_ in df.iloc[room_id, session]:
                    cls, teacher, lecture = df.iloc[room_id: room_id+3, session].tolist()
                    schedule[day].append(
                        {
                            "day": day,
                            "time": sessions[slot-1],
                            "room": room,
                            "class": cls,
                            "teacher": teacher,
                            "lecture": lecture
                        }
                    )
    return schedule

def get_teacher_slots(teacher_name):
    if df is None:
        return {"error": "No schedule data loaded. Please upload a file first."}
    
    sessions = df.iloc[0:1, 1:7].values[0]

    rooms = {}
    for i, room in enumerate(df.iloc[:, 0].values):
        if room is not np.nan:
            rooms[room] = i

    schedule = {}

    for day in days:
        day_id = day_idx[day]
        schedule[day] = []
        for slot in range(1, 7):
            session = day_id + slot

            for room in rooms:
                room_id = rooms[room]
                if df.iloc[room_id+1, session] is not np.nan and teacher_name in df.iloc[room_id+1, session]:
                    cls, teacher, lecture = df.iloc[room_id: room_id+3, session].tolist()
                    schedule[day].append(
                        {
                            "date": day,
                            "time": sessions[slot-1],
                            "room": room,
                            "class": cls,
                            "teacher": teacher,
                            "lecture": lecture
                        }
                    )
    return schedule



# views.py
from django.http import JsonResponse

def class_dashboard(request, class_name):
    data = get_class_slots(class_name)  # Your existing function
    return JsonResponse(data)

def teacher_dashboard(request, teacher_name):
    data = get_teacher_slots(teacher_name)  # Your existing function
    return JsonResponse(data)
z
def student_dashboard(request, class_name):
    """Render the student dashboard with class schedule"""
    return JsonResponse(get_class_slots(class_name))

def teacher_dashboard(request, teacher_name):
    """Render the teacher dashboard with their schedule"""
    return JsonResponse(get_teacher_slots(teacher_name))

def admin_dashboard(request):
    """Render the admin dashboard"""
    if df is None:
        return JsonResponse({"error": "No schedule data loaded. Please upload a file first."}, status=400)
    
    find_by = request.GET.get('find_by')
    find_key = request.GET.get('find_key')
    
    if find_by == "class":
        return JsonResponse(get_class_slots(find_key))
    elif find_by == "teacher":
        return JsonResponse(get_teacher_slots(find_key))
    else:
        return JsonResponse({"error": "invalid search key"}, status=400)