using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]
public class RoomController : ControllerBase
{
    private static Dictionary<string, List<Movie>> rooms = new Dictionary<string, List<Movie>>();

    private static Dictionary<string, List<int>> watchedMovies = new Dictionary<string, List<int>>();

    private static Dictionary<string, List<int>> likedMovies = new Dictionary<string, List<int>>();

    private readonly WebSocketHandler _webSocketHandler;

    public RoomController(WebSocketHandler webSocketHandler)
    {
        _webSocketHandler = webSocketHandler;
    }

    [HttpPost("create")]
    public IActionResult CreateRoom()
    {
        var roomCode = Guid.NewGuid().ToString();
        rooms[roomCode] = new List<Movie>(); // Здесь вы можете добавить логику для получения фильмов из API

        return Ok(roomCode);
    }

    [HttpPost("join/{roomCode}")]
    public IActionResult JoinRoom(string roomCode)
    {
        if (!rooms.ContainsKey(roomCode))
        {
            return NotFound("Room not found");
        }

        return Ok();
    }

    [HttpGet("{roomCode}/movies")]
    public async Task<IActionResult> GetMovies(string roomCode)
    {
        if (!rooms.ContainsKey(roomCode))
        {
            return NotFound("Room not found");
        }

        using (var httpClient = new HttpClient())
        {
            var apiKey = "KTZV0EX-47647JH-JDRJYQ8-HSENZ44"; // Замените на ваш ключ API
            httpClient.DefaultRequestHeaders.Add("X-API-KEY", apiKey);
            var response = await httpClient.GetAsync("https://api.kinopoisk.dev/v1.3/movie?limit=30");

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                var moviesResponse = JsonSerializer.Deserialize<KinopoiskResponse>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (moviesResponse != null && moviesResponse.Docs != null)
                {
                    var movies = moviesResponse.Docs.Select(m => new Movie
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Rating = m.Rating.Kp, // Используем рейтинг из объекта Rating
                        PosterUrl = m.Poster.Url // Используем URL постера из объекта Poster
                    }).ToList();

                    rooms[roomCode] = movies;

                    return Ok(movies);
                }
            }

            return StatusCode((int)response.StatusCode, "Failed to load movies");
        }
    }

    [HttpGet("{roomCode}/next-movie")]
    public IActionResult GetNextMovie(string roomCode, [FromQuery] string userId)
    {
        if (!rooms.ContainsKey(roomCode))
        {
            return NotFound("Room not found");
        }

        // Получаем список выборов пользователя, если он существует
        List<int> watchedMoviesList;

        if (!watchedMovies.TryGetValue(userId, out watchedMoviesList))
        {
            watchedMoviesList = new List<int>();
        }

        var movies = rooms[roomCode];

        // Получаем следующий фильм, который еще не был просмотрен
        var nextMovie = movies.FirstOrDefault(m => !watchedMoviesList.Contains(m.Id));

        if (nextMovie != null)
        {
            return Ok(nextMovie);
        }

        return NotFound("No more movies available");
    }

    [HttpPost("{roomCode}/watched-movies")]
    public async Task<IActionResult> AddWatchedMovie(string roomCode, [FromBody] int movieId, [FromQuery] string userId)
    {
        if (!rooms.ContainsKey(roomCode))
        {
            return NotFound("Room not found");
        }

        if (!watchedMovies.ContainsKey(userId))
        {
            watchedMovies[userId] = new List<int>();
        }

        watchedMovies[userId].Add(movieId);

        return Ok("Movie added in watched");
    }

    [HttpPost("{roomCode}/match-checking")]
    public async Task<IActionResult> MatchChecking(string roomCode, [FromBody] int movieId, [FromQuery] string userId)
    {
        if (!rooms.ContainsKey(roomCode))
        {
            return NotFound("Room not found");
        }

        if (!likedMovies.ContainsKey(userId))
        {
            likedMovies[userId] = new List<int>();
        }

        likedMovies[userId].Add(movieId);

        // Проверка на совпадение
        if (likedMovies.Values.All(choices => choices.Contains(movieId)) && likedMovies.Count != 1)
        {
            // Отправка уведомления через WebSocket
            var message = $"Match found for movie ID: {movieId}";

            foreach (var user in likedMovies.Keys)
            {
                await _webSocketHandler.SendMessage(user, message);
            }

            return Ok("Match found!");
        }

        return Ok("Swipe recorded");
    }
}
