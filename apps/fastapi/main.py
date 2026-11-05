from datetime import datetime, timezone
from uuid import uuid4
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="StackLab FastAPI CRUD")
labs = {}

class LabInput(BaseModel):
    slug: str
    title: str
    description: str = ""
    status: str = "planned"
    endpoint: str | None = None
class LabUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    description: str | None = None
    status: str | None = None
    endpoint: str | None = None

def stamp(): return datetime.now(timezone.utc).isoformat()
def seed(slug, title):
    t=stamp(); labs[slug]={"id":slug,"slug":slug,"title":title,"description":f"{title} CRUD lab.","status":"ready","endpoint":f"/labs/{slug}","createdAt":t,"updatedAt":t}
seed("fastapi", "FastAPI CRUD")

def get_lab(id):
    return next((lab for lab in labs.values() if lab["id"] == id or lab["slug"] == id), None)

@app.get("/labs")
def list_labs(): return list(labs.values())
@app.get("/labs/{id}")
def get(id: str):
    lab=get_lab(id)
    if not lab: raise HTTPException(404, "Lab not found")
    return lab
@app.post("/labs", status_code=201)
def create(input: LabInput):
    if get_lab(input.slug): raise HTTPException(409, "Slug already exists")
    t=stamp(); lab={"id":str(uuid4()), **input.model_dump(), "endpoint":input.endpoint or f"/labs/{input.slug}", "createdAt":t,"updatedAt":t}; labs[lab["id"]]=lab; return lab
@app.put("/labs/{id}")
@app.patch("/labs/{id}")
def update(id: str, input: LabUpdate):
    current=get_lab(id)
    if not current: raise HTTPException(404, "Lab not found")
    changes={k:v for k,v in input.model_dump().items() if v is not None}; lab={**current, **changes, "endpoint":input.endpoint or current["endpoint"], "updatedAt":stamp()}; labs[current["id"]]=lab; return lab
@app.delete("/labs/{id}")
def delete(id: str):
    lab=get_lab(id)
    if not lab: raise HTTPException(404, "Lab not found")
    del labs[lab["id"]]; return {"deleted":True,"id":lab["id"]}
