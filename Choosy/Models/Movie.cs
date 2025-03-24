public class Movie
{
    public int Id { get; set; }

    public string Name { get; set; }
    
    public double Rating { get; set; }
    
    public string PosterUrl { get; set; }

    public ICollection<Room> Rooms { get; set; }  // Возможно потребуется сделать поле необязательным
}

public class MoviesResponse
{
    public List<Movie> Docs { get; set; }
}

public class KinopoiskResponse
{
    public List<KinopoiskMovie> Docs { get; set; } // Список фильмов
}

public class KinopoiskMovie
{
    public int Id { get; set; } // ID фильма

    public string Name { get; set; } // Название фильма

    public Rating Rating { get; set; } // Рейтинг

    public Poster Poster { get; set; } // Постер
}

public class Rating
{
    public double Kp { get; set; } // Рейтинг на Кинопоиске
}

public class Poster
{
    public string Url { get; set; } // URL постера
}
