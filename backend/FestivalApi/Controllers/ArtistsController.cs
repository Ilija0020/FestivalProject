using FestivalApi.Models;
using FestivalApi.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FestivalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        //private readonly FestivalRepository _repository;
        FestivalRepository _repository = new FestivalRepository();

        //public ArtistsController(FestivalRepository repository)
        //{
        //    _repository = repository;
        //}

        [HttpGet]
        public ActionResult<List<Artist>> GetAll()
        {
            //List <Artist> artists = _repository.GetAllArtists();
            return Ok(_repository.Artists.Values.ToList());
        }

        [HttpGet("{id}")]
        public ActionResult<Artist> GetById(int id)
        {
            if (_repository.Artists.ContainsKey(id))
            {
                return Ok(_repository.Artists[id]);
            }
            return NotFound($"Izvodjac sa ID-jem {id} nije pronadjen.");
        }

        [HttpPost]
        public ActionResult Create(Artist artist)
        {
            int noviId = IzracunajMaxId();
            artist.Id = noviId;

            if (artist.Events != null)
            {
                List<Event> trazeniFestivali = new List<Event>(artist.Events);
                artist.Events.Clear();

                foreach (Event jsonEvent in trazeniFestivali)
                {
                    if (_repository.Events.ContainsKey(jsonEvent.Id))
                    {
                        Event realEvent = _repository.Events[jsonEvent.Id];
                        artist.Events.Add(realEvent);
                        realEvent.Artists.Add(artist);
                    }
                }
            }
            _repository.Artists.Add(noviId, artist);
            _repository.SaveAllData();

            return Ok(artist);
        }

        [HttpPut("{id}")]
        public ActionResult Update(int id, Artist updatedArtist)
        {
            if (!_repository.Artists.ContainsKey(id))
            {
                return NotFound($"Izvodjac sa ID-jem {id} nije pronadjen.");
            }
            Artist oldArtist = _repository.Artists[id];

            oldArtist.Name = updatedArtist.Name;
            oldArtist.Genre = updatedArtist.Genre;
            oldArtist.Country = updatedArtist.Country;

            if (updatedArtist.Events != null)
            {
                foreach (Event oldEvent in oldArtist.Events)
                {
                    oldEvent.Artists.RemoveAll(a => a.Id == id);
                }
                oldArtist.Events.Clear();

                foreach (Event eventFromJson in updatedArtist.Events)
                {
                    if (_repository.Events.ContainsKey(eventFromJson.Id))
                    {
                        Event realEvent = _repository.Events[eventFromJson.Id];
                        oldArtist.Events.Add(realEvent);
                        realEvent.Artists.Add(oldArtist);
                    }
                }
            }

            _repository.SaveAllData();

            return Ok(oldArtist);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            if (!_repository.Artists.ContainsKey(id))
            {
                return NotFound($"Izvodjac sa ID-jem {id} nije pronadjen.");
            }

            foreach (Event ev in _repository.Events.Values)
            {
                ev.Artists.RemoveAll(a => a.Id == id);
            }
            _repository.Artists.Remove(id);
            _repository.SaveAllData();

            return NoContent();
        }

        private int IzracunajMaxId()
        {
            int maxId = 0;
            foreach (Artist artist in _repository.Artists.Values)
            {
                if (artist.Id > maxId)
                {
                    maxId = artist.Id;
                }
            }
            return maxId + 1;
        }
    }
}
