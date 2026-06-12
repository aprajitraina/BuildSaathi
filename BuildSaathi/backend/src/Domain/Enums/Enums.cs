namespace BuildSaathi.Domain.Enums;

public enum ContractorPlan { Free, Pro, Business, Enterprise }

public enum UserRole { Owner, Supervisor, Accountant, Staff }

public enum TenderMatchStatus { Saved, Reviewing, BidSubmitted, Won, Lost, Withdrawn }

public enum BOQStatus { Draft, Finalized }

public enum ProjectStatus { Planning, Active, OnHold, Completed, Cancelled }

public enum MilestoneStatus { NotStarted, InProgress, Completed, Delayed, Cancelled }

public enum InvoiceStatus { Draft, Sent, PartiallyPaid, Paid, Overdue, Cancelled }
