public class RoomUser
{
    public int Id { get; set; }

    public int RoomId { get; set; } // Убедитесь, что это совпадает с типом Id в классе Room

    public int? UserId { get; set; }

    // Навигационные свойства
    public Room Room { get; set; }

    public User? User { get; set; }
}