using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class GenericRepository<T>: IGenericRepository<T> where T : Entity
    {
        private readonly DataContext context;

       
        public GenericRepository(DataContext context)
        {
            this.context = context;
        }
        public async Task AddAsync(T entity)
        {
            await context.Set<T>().AddAsync(entity);

        }

        public Task DeleteByIdAync(T entity)
        {
            context.Set<T>().Remove(entity);
            return Task.CompletedTask;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {

            return await context.Set<T>().ToListAsync();
        }

        public async Task<T> GetOneAsync(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        public void Update(T entity)
        {
            context.Set<T>().Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
        }
    }
}