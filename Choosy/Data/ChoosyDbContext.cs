using Microsoft.EntityFrameworkCore;

public class ChoosyDbContext : DbContext
{
    public ChoosyDbContext(DbContextOptions<ChoosyDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<Movie> MatchedFilms { get; set; }

    public DbSet<Room> Rooms { get; set; }

    public DbSet<RoomUser> RoomUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Настройка отношений
        modelBuilder.Entity<RoomUser>()
            .HasKey(ru => new { ru.RoomId, ru.UserId });

        modelBuilder.Entity<RoomUser>()
            .HasOne(ru => ru.Room)
            .WithMany(r => r.RoomUsers)
            .HasForeignKey(ru => ru.RoomId);

        modelBuilder.Entity<RoomUser>()
            .HasOne(ru => ru.User)
            .WithMany(u => u.RoomUsers)
            .HasForeignKey(ru => ru.UserId);

        modelBuilder.Entity<Room>()
            .HasOne(r => r.MatchedFilm)
            .WithMany(mf => mf.Rooms)
            .HasForeignKey(r => r.MatchedFilmId);
    }
}
