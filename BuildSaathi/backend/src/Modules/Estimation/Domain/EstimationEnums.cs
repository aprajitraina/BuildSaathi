namespace BuildSaathi.Modules.Estimation.Domain;

public enum ProjectType
{
    Building,
    Road,
    Drainage,
}

public enum EstimateSourceType
{
    Form,
    Upload,
}

public enum EstimateType
{
    Residential,
    Commercial,
    Industrial,
    Institutional,
    Other,
}

public enum EstimateWarningLevel
{
    Error,
    Warning,
}
