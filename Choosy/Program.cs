using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllers(); // Убедитесь, что контроллеры добавлены

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Убедитесь, что статические файлы не обрабатываются здесь, если Frontend работает на другом хосте
// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(@"C:\Users\sem06\source\repos\Choosy\Frontend"),
//     RequestPath = ""
// });

app.UseRouting();

app.UseAuthorization();

// Настройка маршрутизации
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers(); // Обработка API запросов

    // Если Frontend работает на другом хосте, вам не нужно перенаправлять запросы на index.html
    // Если вы хотите, чтобы ваш Backend возвращал CORS заголовки, добавьте CORS политику
});

// Если вы хотите использовать CORS, добавьте следующую строку
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("http://localhost:5173/") // Замените на URL вашего Frontend
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

app.UseCors("AllowFrontend");

app.MapRazorPages();

app.Run();