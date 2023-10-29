namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        IMessageRepository MessageRepository {get;}
        ILikesRepository LikesRepository {get;}
        IChatGroupRepository ChatGroupRepository { get; }
        IChatGroupMessageRepository ChatGroupMessageRepository { get;  }
        IChatGroupMemberRepository ChatGroupMemberRepository { get; }

        Task<bool> Complete();
        bool HasChanges();
    }
}