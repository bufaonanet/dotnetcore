using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class PalestranteDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        public string Nome { get; set; }
        public string MiniCurriculo { get; set; }
        public string ImagemUrl { get; set; }

        [Phone]
        public string Telefone { get; set; }

        [EmailAddress]
        public string Email { get; set; }
        public List<RedeSocialDto> RedeSocial { get; set; }
        public List<EventoDto> Eventos { get; set; }
    }
}