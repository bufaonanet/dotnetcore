using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class RedeSocialDto
    {     
        public int Id { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "'{0}' obrigatório")]
        public string URL { get; set; }               
    }
}