using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Interfaces
{
    public interface IGenericRepository<T> where T : Entity
    {

        Task AddAsync(T entity);
        Task DeleteByIdAync(T entity);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetOneAsync(int id);
        void Update(T entity);
            
    }
}