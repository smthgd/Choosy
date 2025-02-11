using Microsoft.AspNetCore.Mvc;
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

    [HttpPost("{roomCode}/join")]
    public IActionResult JoinRoom(string roomCode)
    {
        if (!rooms.ContainsKey(roomCode))
        {
            return NotFound("Room not found");
        }
        
        return Ok();
    }

    [HttpGet("{roomCode}/movies")]
    public IActionResult GetMovies(string roomCode)
    {
        // Здесь вы можете получить фильмы из TMDb API и вернуть их
        return Ok(rooms[roomCode]);
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
