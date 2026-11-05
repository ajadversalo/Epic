from datetime import datetime, timezone
from uuid import uuid4
from rest_framework.decorators import api_view
from rest_framework.response import Response

store={}
def now(): return datetime.now(timezone.utc).isoformat()
def seed(slug,title):
    t=now(); store[slug]={'id':slug,'slug':slug,'title':title,'description':f'{title} CRUD lab.','status':'ready','endpoint':f'/labs/{slug}','createdAt':t,'updatedAt':t}
seed('django','Django REST Framework CRUD')
def find(value): return next((x for x in store.values() if x['id']==value or x['slug']==value),None)
@api_view(['GET','POST'])
def labs(request):
    if request.method=='GET': return Response(list(store.values()))
    data=request.data
    if not data.get('slug') or not data.get('title'): return Response({'error':'slug and title are required'},status=400)
    if find(data['slug']): return Response({'error':'slug already exists'},status=409)
    t=now(); lab={'id':str(uuid4()),'slug':data['slug'],'title':data['title'],'description':data.get('description',''),'status':data.get('status','planned'),'endpoint':data.get('endpoint',f"/labs/{data['slug']}"),'createdAt':t,'updatedAt':t}; store[lab['id']]=lab; return Response(lab,status=201)
@api_view(['GET','PUT','PATCH','DELETE'])
def lab_detail(request,lab_id):
    lab=find(lab_id)
    if not lab: return Response({'error':'Lab not found'},status=404)
    if request.method=='GET': return Response(lab)
    if request.method=='DELETE': del store[lab['id']]; return Response({'deleted':True,'id':lab['id']})
    data=request.data; lab.update({k:v for k,v in data.items() if k in ['slug','title','description','status','endpoint']}); lab['updatedAt']=now(); return Response(lab)
