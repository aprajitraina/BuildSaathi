using BuildSaathi.Domain.Enums;

namespace BuildSaathi.Domain.Entities;

public class Milestone : BaseEntity
{
    public Guid ProjectId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public MilestoneStatus Status { get; private set; } = MilestoneStatus.NotStarted;
    public DateTime? DueDate { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public int SortOrder { get; private set; }

    public Project Project { get; private set; } = null!;

    protected Milestone() { }

    public static Milestone Create(Guid projectId, string title, DateTime? dueDate = null, int sortOrder = 0) =>
        new() { ProjectId = projectId, Title = title, DueDate = dueDate, SortOrder = sortOrder };

    public void Complete()
    {
        Status = MilestoneStatus.Completed;
        CompletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetStatus(MilestoneStatus status)
    {
        Status = status;
        CompletedAt = status == MilestoneStatus.Completed ? DateTime.UtcNow : null;
        UpdatedAt = DateTime.UtcNow;
    }
}
