using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;

        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _repo.GetAllEventosAsync(true);
                var result = _mapper.Map<EventoDto[]>(eventos);

                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao acessar db: {ex.Message}");
            }
        }

        [HttpPost("upload")]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    var fullPath = Path.Combine(pathToSave, fileName.Replace("\"", "").Trim());

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }

                return Ok();
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao fazer upload: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var evento = await _repo.GetEventoByIdAsync(id, true);
                var result = _mapper.Map<EventoDto>(evento);

                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao acessar db: {ex.Message}");
            }
        }

        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var eventos = await _repo.GetAllEventosByTemaAsync(tema, true);
                var result = _mapper.Map<EventoDto[]>(eventos);


                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao acessar db: {ex.Message}");
            }
        }

        [HttpPost()]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);

                _repo.Add(evento);

                if (await _repo.SavaChangesAsync())
                {
                    return Created($"api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao acessar db: {ex.Message}");
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model)
        {
            try
            {
                var evento = await _repo.GetEventoByIdAsync(id, false);
                if (evento == null) return NotFound();

                var idLotes = new List<int>();
                var idRedesSociais = new List<int>();

                model.Lotes.ForEach(lote => idLotes.Add(lote.Id));
                model.RedesSociais.ForEach(rede => idRedesSociais.Add(rede.Id));

                var lotes = evento.Lotes.Where(
                    lote => !idLotes.Contains(lote.Id)
                ).ToArray();

                var RedesSociais = evento.RedesSociais.Where(
                    redeSocial => !idLotes.Contains(redeSocial.Id)
                ).ToArray();

                if (lotes.Length > 0)
                    _repo.DeleteRange(lotes);

                if (RedesSociais.Length > 0)
                    _repo.DeleteRange(RedesSociais);

                _mapper.Map(model, evento);

                _repo.Update(evento);

                if (await _repo.SavaChangesAsync())
                {
                    return Created($"api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao acessar db: {ex.Message}");
            }

            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var evento = await _repo.GetEventoByIdAsync(id, false);

                if (evento == null)
                {
                    return NotFound();
                }

                _repo.Delete(evento);

                if (await _repo.SavaChangesAsync())
                {
                    return Ok();
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro ao acessar db");
            }

            return BadRequest();
        }
    }
}