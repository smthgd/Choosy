using Microsoft.EntityFrameworkCore;

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

// Добавляем WebSocketHandler как Singleton
builder.Services.AddSingleton<WebSocketHandler>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ChoosyDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Чтение ключа из конфигурации
var hashKey = builder.Configuration["HashKey"];
builder.Services.AddSingleton(new HashingService(hashKey)); // Регистрация сервиса хэширования

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

// Добавьте обработку WebSocket соединений
app.UseWebSockets();
app.Map("/ws", async (HttpContext context, WebSocketHandler webSocketHandler) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        var random = new Random();
        int userId = (int)(DateTime.UtcNow.Ticks % 1000000000) + random.Next(1, 1000);
        await webSocketHandler.HandleWebSocket(webSocket, userId);
        await webSocketHandler.SendMessage(userId, $"userId: {userId}"); // Отправляем userId на фронтенд
    }
});

app.Run();
