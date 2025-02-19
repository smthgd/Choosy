var builder = WebApplication.CreateBuilder(args);

// Настройка CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("*") // Замените на URL вашего Frontend
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

// Добавление служб в контейнер
builder.Services.AddRazorPages();
builder.Services.AddControllers(); // Убедитесь, что контроллеры добавлены

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build(); // Здесь мы создаем приложение

// Настройка HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseRouting();

// Переместите CORS перед авторизацией
app.UseCors("AllowFrontend");

app.UseAuthorization();

// Настройка маршрутизации
app.MapControllers(); // Обработка API запросов
app.MapRazorPages();

app.Run();
