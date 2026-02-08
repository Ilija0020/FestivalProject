using FestivalApi.Models;
using FestivalApi.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FestivalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        //private readonly FestivalRepository _repository;
        FestivalRepository _repository = new FestivalRepository();

        //public EventsController(FestivalRepository repository)
        //{
        //    _repository = repository;
        //}

        [HttpGet]
        public ActionResult<List<Event>> GetAll()
        {
            return Ok(_repository.Events.Values.ToList());
        }

        [HttpGet("{id}")]
        public ActionResult<Event> GetById(int id)
        {
            if (_repository.Events.ContainsKey(id))
            {
                return Ok(_repository.Events[id]);
            }
            return NotFound($"Festival sa ID-jem {id} nije pronadjen.");
        }

        [HttpPost]
        public ActionResult Create(Event newEvent)
        {
            int noviId = IzracunajMaxId();
            newEvent.Id = noviId;

            if (newEvent.Artists != null)
            {
                List<Artist> trazeniIzvodjaci = new List<Artist>(newEvent.Artists);
                newEvent.Artists.Clear();

                foreach (Artist jsonArtist in trazeniIzvodjaci)
                {
                    if (_repository.Artists.ContainsKey(jsonArtist.Id))
                    {
                        Artist praviIzvodjac = _repository.Artists[jsonArtist.Id];

                        newEvent.Artists.Add(praviIzvodjac);
                        praviIzvodjac.Events.Add(newEvent);
                    }
                }
            }
            _repository.Events.Add(noviId, newEvent);
            _repository.SaveAllData();

            return Ok(newEvent);
        }

        [HttpPut("{id}")]
        public ActionResult Update(int id, Event updatedEvent)
        {
            if (!_repository.Events.ContainsKey(id))
            {
                return NotFound($"Festival sa ID-jem {id} nije pronadjen.");
            }
            Event oldEvent = _repository.Events[id];

            oldEvent.Name = updatedEvent.Name;
            oldEvent.City = updatedEvent.City;
            oldEvent.Date = updatedEvent.Date;

            if (updatedEvent.Artists != null)
            {
                foreach (Artist oldArtist in oldEvent.Artists)
                {
                    oldArtist.Events.RemoveAll(e => e.Id ==id);
                }
                oldEvent.Artists.Clear();

                foreach (Artist artistFromJson in updatedEvent.Artists)
                {
                    if (_repository.Artists.ContainsKey(artistFromJson.Id))
                    {
                        Artist realArtist = _repository.Artists[artistFromJson.Id];
                        oldEvent.Artists.Add(realArtist);
                        realArtist.Events.Add(oldEvent);
                    }
                }
            }
            _repository.SaveAllData();
            return Ok(oldEvent);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            if (!_repository.Events.ContainsKey(id))
            {
                return NotFound($"Festival sa ID-jem {id} nije pronadjen.");
            }

            foreach (Artist artist in _repository.Artists.Values)
            {
                artist.Events.RemoveAll(e => e.Id == id);
            }

            _repository.Events.Remove(id);
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
