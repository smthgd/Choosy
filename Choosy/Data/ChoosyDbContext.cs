using Microsoft.EntityFrameworkCore;

public class ChoosyDbContext : DbContext
{
    public ChoosyDbContext(DbContextOptions<ChoosyDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    // public DbSet<Movie> Movies { get; set; } // Если вы хотите хранить фильмы в БД
}
