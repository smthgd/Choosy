public class RoomHistoryDto
{
    public int RoomId { get; set; }
    
    public DateTime CreationDate { get; set; }

    public IEnumerable<UserDto> Users { get; set; }

    public IEnumerable<MatchedFilmDto> MatchedFilms { get; set; }
}