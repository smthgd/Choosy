using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// Настройка CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("http://localhost:5173") // Замените на URL вашего Frontend
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

// Добавление служб в контейнер
builder.Services.AddRazorPages();
builder.Services.AddControllers(); // Убедитесь, что контроллеры добавлены

var app = builder.Build(); // Здесь мы создаем приложение

// Настройка HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

// Переместите CORS перед авторизацией
//app.UseCors("AllowFrontend");

app.UseAuthorization();

// Настройка маршрутизации
app.MapControllers(); // Обработка API запросов
app.MapRazorPages();

app.Run();
