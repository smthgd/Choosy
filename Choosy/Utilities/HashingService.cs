using System.Text;
using System.Security.Cryptography;

public class HashingService
{
    private readonly byte[] _key;

    public HashingService(string key)
    {
        _key = Encoding.UTF8.GetBytes(key);
    }

    public string HashPassword(string password)
    {
        using (var hmac = new HMACSHA512(_key))
        {
            return Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }
    }

    public bool VerifyPassword(string password, string storedHash)
    {
        var computedHash = HashPassword(password);
        return computedHash == storedHash;
    }
}
