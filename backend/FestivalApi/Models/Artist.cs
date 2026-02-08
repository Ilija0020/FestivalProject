namespace FestivalApi.Models
{
    public class Artist
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Genre { get; set; }
        public string? Country { get; set; }

        public List<Event> Events { get; set; } = new List<Event>();

        public Artist() { }

        public Artist(int id, string name, string genre, string country)
        {
            Id = id;
            Name = name;
            Genre = genre;
            Country = country;
        }
    }
}
