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

                    return Ok(movies);
                }
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
