using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System;

[ApiController]
[Route("api/[controller]")]
public class RoomController : ControllerBase
{
    private static Dictionary<string, List<Movie>> rooms = new Dictionary<string, List<Movie>>();
    private static Dictionary<string, List<int>> userChoices = new Dictionary<string, List<int>>();

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

        // Пример получения фильмов из TMDb API
        using (var httpClient = new HttpClient())
        {
            var apiKey = "YOUR_TMDB_API_KEY"; // Замените на ваш ключ API
            var response = await httpClient.GetAsync($"https://api.themoviedb.org/3/movie/popular?api_key={apiKey}");
        
            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                var movies = JsonSerializer.Deserialize<List<Movie>>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Игнорировать регистр имен свойств
                });
                
                return Ok(movies);
            }

            return StatusCode((int)response.StatusCode, "Failed to load movies");
        }
    }

    [HttpPost("{roomCode}/swipe")]
    public IActionResult Swipe(string roomCode, [FromBody] int movieId, string userId)
    {
        if (!rooms.ContainsKey(roomCode))
        {
            return NotFound("Room not found");
        }

        if (!userChoices.ContainsKey(userId))
        {
            userChoices[userId] = new List<int>();
        }

        userChoices[userId].Add(movieId);

        // Проверка на совпадение
        if (userChoices.Values.All(choices => choices.Contains(movieId)))
        {
            return Ok("Match found!");
        }

        return Ok("Swipe recorded");
    }
}
