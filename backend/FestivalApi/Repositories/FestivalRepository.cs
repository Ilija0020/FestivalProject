using FestivalApi.Models;
using Microsoft.Extensions.Configuration.CommandLine;
using Microsoft.OpenApi.Models;

namespace FestivalApi.Repositories
{
    public class FestivalRepository
    {
        private string artistsPath = "data/izvodjaci.csv";
        private string eventsPath = "data/eventi.csv";
        private string bookingsPath = "data/buking.csv";

        public Dictionary<int, Artist> Artists = new Dictionary<int, Artist>();
        public Dictionary<int, Event> Events = new Dictionary<int, Event>();

        public FestivalRepository()
        {
            LoadAllData();
        }

        private void LoadAllData()
        {
            if (File.Exists(artistsPath))
            {
                string[] artistLines = File.ReadAllLines(artistsPath);
                foreach (string line in artistLines)
                {
                    string[] parts = line.Split('|');
                    int id = int.Parse(parts[0]);
                    Artist artist = new Artist(id, parts[1], parts[2], parts[3]);
                    Artists[id] = artist;
                }
            }

            if (File.Exists(eventsPath))
            {
                string[] eventLines = File.ReadAllLines(eventsPath);
                foreach (string line in eventLines)
                {
                    string[] parts = line.Split('|');
                    int id = int.Parse(parts[0]);
                    DateTime date = DateTime.Parse(parts[3]);
                    Event ev = new Event(id, parts[1], parts[2], date);
                    Events[id] = ev;
                }
            }

            if (File.Exists(bookingsPath))
            {
                string[] bookingLines = File.ReadAllLines(bookingsPath);
                foreach (string line in bookingLines)
                {
                    string[] parts = line.Split('|');
                    int aId = int.Parse(parts[0]);
                    int eId = int.Parse(parts[1]);

                    if (Artists.ContainsKey(aId) && Events.ContainsKey(eId))
                    {
                        Artist currentArtist = Artists[aId];
                        Event currentEvent = Events[eId];

                        currentArtist.Events.Add(currentEvent);
                        currentEvent.Artists.Add(currentArtist);
                        Console.WriteLine($"USPEŠNO SPOJENO: {currentArtist.Name} nastupa na {currentEvent.Name}");

                    }
                    else
                    {
                        Console.WriteLine($"GREŠKA: Nisam našao ArtistId {aId} ili EventId {eId}");
                    }
                }
            }
        }

        public void SaveAllData()
        {
            SaveArtists();
            SaveEvents();
            SaveBookings();
        }

        private void SaveArtists()
        {
            List<string> lines = new List<string>();
            foreach (Artist artist in Artists.Values)
            {
                lines.Add($"{artist.Id}|{artist.Name}|{artist.Genre}|{artist.Country}");
            }
            File.WriteAllLines(artistsPath, lines);
        }

        private void SaveEvents()
        {
            List<string> lines = new List<string>();
            foreach (Event ev in Events.Values)
            {
                lines.Add($"{ev.Id}|{ev.Name}|{ev.City}|{ev.Date:yyyy-MM-dd}");
            }
            File.WriteAllLines(eventsPath, lines);
        }
        
        private void SaveBookings()
        {
            List<string> lines = new List<string>();
            foreach (Artist artist in Artists.Values)
            {
                foreach (Event ev in artist.Events)
                {
                    lines.Add($"{artist.Id}|{ev.Id}");
                }
            }

            File.WriteAllLines(bookingsPath, lines);
        }

        //public List<Artist> GetAllArtists()
        //{
        //    return Artists.Values.ToList();
        //}

        //public List<Event> GetAllEvents()
        //{
        //    return Events.Values.ToList();
        //}
    }
}
