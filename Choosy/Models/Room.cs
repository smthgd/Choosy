public class Room
{
    public int Id { get; set; }

    public int MatchedFilmId { get; set; }

    public DateTime CreationDate { get; set; }

    // Навигационное свойство
    public Movie MatchedFilm { get; set; }

    public ICollection<RoomUser> RoomUsers { get; set; }
}