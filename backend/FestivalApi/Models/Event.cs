namespace FestivalApi.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? City { get; set; }
        public DateTime Date { get; set; }
        public List<Artist> Artists { get; set; } = new List<Artist>();

        public Event() { }

        public Event(int id, string name, string city, DateTime date)
        {
            Id = id;
            Name = name;
            City = city;
            Date = date;
        }
    }
}
