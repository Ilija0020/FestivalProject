namespace FestivalApi.Models
{
    public class Booking
    {
        public int ArtistId { get; set; }
        public int EventId { get; set; }

        public Booking() { }

        public Booking(int artistId, int eventId)
        {
            ArtistId = artistId;
            EventId = eventId;
        }
    }
}
