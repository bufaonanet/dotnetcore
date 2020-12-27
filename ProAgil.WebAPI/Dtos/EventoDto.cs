using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "'{0}' deve conter de {2} a {1} caracteres")]
        public string Local { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        public string DataEvento { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "'{0}' deve conter de {2} a {1} caracteres")]
        public string Tema { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        [Range(10, 12000, ErrorMessage = "'{0}' de pessoas deve ser de {1} a {2}")]
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        [Phone]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        [EmailAddress]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}