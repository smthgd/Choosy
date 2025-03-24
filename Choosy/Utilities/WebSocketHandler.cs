using System.Net.WebSockets;
using System.Text;
using System.Threading;

public class WebSocketHandler
{
    private static Dictionary<int, WebSocket> _sockets = new Dictionary<int, WebSocket>();

    public async Task HandleWebSocket(WebSocket webSocket, int userId)
    {
        _sockets[userId] = webSocket;
        
        // Отправляем userId на фронтенд
        await SendMessage(userId, $"userId: {userId}");

        while (webSocket.State == WebSocketState.Open)
        {
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Close)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                _sockets.Remove(userId);
            }
        }
    }

    public async Task SendMessage(int userId, string message)
    {
        if (_sockets.TryGetValue(userId, out var socket))
        {
            var buffer = Encoding.UTF8.GetBytes(message);
            await socket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}
