using Microsoft.Extensions.FileProviders;

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

// Укажите папку для статических файлов
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(@"C:\Users\sem06\source\repos\Choosy\Frontend"),
    RequestPath = ""
});

app.UseRouting();

app.UseAuthorization();

// Настройка маршрутизации
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers(); // Обработка API запросов

    // Перенаправление всех остальных запросов на ваш React frontend
    endpoints.MapFallbackToFile("index.html"); // Убедитесь, что ваш React frontend собран и находится в папке Frontend
});

app.MapRazorPages();

app.Run();
