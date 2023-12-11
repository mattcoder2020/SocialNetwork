using API.Entities;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        IMessageRepository MessageRepository {get;}
        ILikesRepository LikesRepository {get;}
        IChatGroupRepository ChatGroupRepository { get; }
        IGenericRepository<Major> MajorRepository { get; }
        IGenericRepository<University> UniversityRepository { get; }
        IGenericRepository<Occupation> OccupationRepository { get; }

        Task<bool> Complete();
        bool HasChanges();
    }
}