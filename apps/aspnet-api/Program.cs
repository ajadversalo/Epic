using System.Collections.Concurrent;
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:4008");
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build(); app.UseCors();
var labs = new ConcurrentDictionary<string, Lab>();
var seed = new Lab("aspnet", "ASP.NET Core CRUD", "ASP.NET Core minimal API CRUD lab.", "ready", "/labs/aspnet", DateTimeOffset.UtcNow, DateTimeOffset.UtcNow); labs[seed.Id] = seed;
Lab? Find(string id) => labs.Values.FirstOrDefault(x => x.Id == id || x.Slug == id);
app.MapGet("/labs", () => Results.Ok(labs.Values));
app.MapGet("/labs/{id}", (string id) => Find(id) is { } lab ? Results.Ok(lab) : Results.NotFound());
app.MapPost("/labs", (LabInput input) => { if (string.IsNullOrWhiteSpace(input.Slug) || string.IsNullOrWhiteSpace(input.Title)) return Results.BadRequest(new { error = "slug and title are required" }); if (Find(input.Slug) is not null) return Results.Conflict(new { error = "slug already exists" }); var t=DateTimeOffset.UtcNow; var lab=new Lab(Guid.NewGuid().ToString(),input.Slug,input.Title,input.Description ?? "",input.Status ?? "planned",input.Endpoint ?? $"/labs/{input.Slug}",t,t); labs[lab.Id]=lab; return Results.Created($"/labs/{lab.Id}",lab); });
app.MapPut("/labs/{id}", (string id, LabInput input) => Save(id,input)); app.MapPatch("/labs/{id}", (string id, LabInput input) => Save(id,input));
app.MapDelete("/labs/{id}", (string id) => Find(id) is { } lab && labs.TryRemove(lab.Id,out _) ? Results.Ok(new { deleted=true, id=lab.Id }) : Results.NotFound());
IResult Save(string id, LabInput input) { if (Find(id) is not { } current) return Results.NotFound(); var updated=current with { Slug=input.Slug ?? current.Slug, Title=input.Title ?? current.Title, Description=input.Description ?? current.Description, Status=input.Status ?? current.Status, Endpoint=input.Endpoint ?? current.Endpoint, UpdatedAt=DateTimeOffset.UtcNow }; labs[current.Id]=updated; return Results.Ok(updated); }
app.Run();
record Lab(string Id,string Slug,string Title,string Description,string Status,string Endpoint,DateTimeOffset CreatedAt,DateTimeOffset UpdatedAt);
record LabInput(string? Slug,string? Title,string? Description,string? Status,string? Endpoint);
