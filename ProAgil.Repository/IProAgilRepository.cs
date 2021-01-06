using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
        //geral
        void Add<T>(T entity) where T : class;
        void Update<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        void DeleteRange<T>(T[] entity) where T : class;
        Task<bool> SavaChangesAsync();

        //eventos
        Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes);
        Task<Evento[]> GetAllEventosAsync(bool includePalestrantes);
        Task<Evento> GetEventoByIdAsync(int EventoId, bool includePalestrantes);

        //palestrantes
        Task<Palestrante[]> GetPalestrantes(bool includeEventos);
        Task<Palestrante> GetPalestrantesById(int palestranteId, bool includeEventos);
         Task<Palestrante[]> GetAllPalestrantesByNameAsync(string name,  bool includeEventos);


    }
}