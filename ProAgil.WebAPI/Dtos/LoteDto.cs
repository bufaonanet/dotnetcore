using System;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public string DataInicio { get; set; }
        public string DataFim { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        [Range(10, 12000, ErrorMessage = "'{0}' deve ser de {1} a {2}")]
        public int quantidade { get; set; }             
    }
}