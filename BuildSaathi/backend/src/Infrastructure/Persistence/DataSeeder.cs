using static BCrypt.Net.BCrypt;
using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Enums;
using BuildSaathi.Modules.Estimation.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BuildSaathi.Infrastructure.Persistence;

/// <summary>
/// Seeds the database with realistic development and demo data.
/// Idempotent — safe to run multiple times; checks for existing data before inserting.
/// Call from Program.cs in development only: await DataSeeder.SeedAsync(app.Services);
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        try
        {
            await db.Database.MigrateAsync();
            logger.LogInformation("Database migrations applied.");

            await SeedDSRRatesAsync(db, logger);
            await SeedRateMasterAsync(db, logger);
            await SeedMaterialRatesAsync(db, logger);
            await SeedTendersAsync(db, logger);
            await SeedDemoContractorAsync(db, logger);

            logger.LogInformation("Database seeding complete.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database seeding.");
        }
    }

    private static async Task SeedDSRRatesAsync(ApplicationDbContext db, ILogger logger)
    {
        if (await db.DSRRates.AnyAsync()) return;

        logger.LogInformation("Seeding DSR rates...");

        var rates = new List<DSRRate>
        {
            // Earthwork
            CreateDSR("EW-001", "Excavation in ordinary soil", "Cum", 95.00m, "Uttar Pradesh", "Earthwork", "UPPWD DSR 2023-24"),
            CreateDSR("EW-002", "Excavation in hard rock by blasting", "Cum", 485.00m, "Uttar Pradesh", "Earthwork", "UPPWD DSR 2023-24"),
            CreateDSR("EW-003", "Filling excavated earth in trenches", "Cum", 68.00m, "Uttar Pradesh", "Earthwork", "UPPWD DSR 2023-24"),
            CreateDSR("EW-004", "Compaction of earth filling by mechanical roller", "Cum", 45.00m, "Uttar Pradesh", "Earthwork", "UPPWD DSR 2023-24"),

            // Masonry
            CreateDSR("MA-001", "Brick masonry in CM 1:4 in foundation", "Cum", 4850.00m, "Uttar Pradesh", "Masonry", "UPPWD DSR 2023-24"),
            CreateDSR("MA-002", "Brick masonry in CM 1:6 in superstructure", "Cum", 4650.00m, "Uttar Pradesh", "Masonry", "UPPWD DSR 2023-24"),
            CreateDSR("MA-003", "Random Rubble masonry in CM 1:3", "Cum", 3850.00m, "Uttar Pradesh", "Masonry", "UPPWD DSR 2023-24"),
            CreateDSR("MA-004", "Stone masonry in CM 1:4", "Cum", 5200.00m, "Uttar Pradesh", "Masonry", "UPPWD DSR 2023-24"),

            // RCC Works
            CreateDSR("RC-001", "PCC M10 Grade", "Cum", 4200.00m, "Uttar Pradesh", "RCC Works", "UPPWD DSR 2023-24"),
            CreateDSR("RC-002", "RCC M20 Grade including shuttering", "Cum", 7800.00m, "Uttar Pradesh", "RCC Works", "UPPWD DSR 2023-24"),
            CreateDSR("RC-003", "RCC M25 Grade including shuttering", "Cum", 8650.00m, "Uttar Pradesh", "RCC Works", "UPPWD DSR 2023-24"),
            CreateDSR("RC-004", "Reinforcement steel Fe415", "MT", 68500.00m, "Uttar Pradesh", "RCC Works", "UPPWD DSR 2023-24"),
            CreateDSR("RC-005", "Formwork / Shuttering for slabs", "Sqm", 280.00m, "Uttar Pradesh", "RCC Works", "UPPWD DSR 2023-24"),

            // Plastering
            CreateDSR("PL-001", "Internal plastering 12mm CM 1:4", "Sqm", 185.00m, "Uttar Pradesh", "Plastering", "UPPWD DSR 2023-24"),
            CreateDSR("PL-002", "External plastering 20mm CM 1:4", "Sqm", 215.00m, "Uttar Pradesh", "Plastering", "UPPWD DSR 2023-24"),
            CreateDSR("PL-003", "Ceiling plastering 6mm CM 1:3", "Sqm", 165.00m, "Uttar Pradesh", "Plastering", "UPPWD DSR 2023-24"),

            // Flooring
            CreateDSR("FL-001", "Ceramic floor tiles 300x300 including bedding", "Sqm", 680.00m, "Uttar Pradesh", "Flooring", "UPPWD DSR 2023-24"),
            CreateDSR("FL-002", "Vitrified tiles 600x600", "Sqm", 950.00m, "Uttar Pradesh", "Flooring", "UPPWD DSR 2023-24"),
            CreateDSR("FL-003", "Marble flooring 18mm", "Sqm", 1850.00m, "Uttar Pradesh", "Flooring", "UPPWD DSR 2023-24"),
            CreateDSR("FL-004", "PCC flooring 75mm thick", "Sqm", 320.00m, "Uttar Pradesh", "Flooring", "UPPWD DSR 2023-24"),

            // Road Works
            CreateDSR("RD-001", "Granular Sub-Base (GSB) compacted", "Cum", 850.00m, "Uttar Pradesh", "Road & Highway", "MORTH DSR 2023"),
            CreateDSR("RD-002", "Water Bound Macadam (WBM) Grade-3", "Cum", 1250.00m, "Uttar Pradesh", "Road & Highway", "MORTH DSR 2023"),
            CreateDSR("RD-003", "Dense Bituminous Macadam 75mm (DBM)", "Tonne", 6800.00m, "Uttar Pradesh", "Road & Highway", "MORTH DSR 2023"),
            CreateDSR("RD-004", "Bituminous Concrete 40mm (BC)", "Tonne", 7200.00m, "Uttar Pradesh", "Road & Highway", "MORTH DSR 2023"),
            CreateDSR("RD-005", "Tack coat with bitumen emulsion", "Sqm", 18.00m, "Uttar Pradesh", "Road & Highway", "MORTH DSR 2023"),
            CreateDSR("RD-006", "Prime coat with bitumen emulsion", "Sqm", 25.00m, "Uttar Pradesh", "Road & Highway", "MORTH DSR 2023"),

            // Painting
            CreateDSR("PT-001", "Primer coat on new plaster", "Sqm", 42.00m, "Uttar Pradesh", "Painting", "UPPWD DSR 2023-24"),
            CreateDSR("PT-002", "Two coats emulsion paint on walls", "Sqm", 95.00m, "Uttar Pradesh", "Painting", "UPPWD DSR 2023-24"),
            CreateDSR("PT-003", "Oil paint on woodwork - 2 coats", "Sqm", 185.00m, "Uttar Pradesh", "Painting", "UPPWD DSR 2023-24"),

            // Maharashtra rates
            CreateDSR("MH-RC-001", "PCC M10 Grade", "Cum", 4650.00m, "Maharashtra", "RCC Works", "Maharashtra PWD DSR 2023"),
            CreateDSR("MH-RC-002", "RCC M20 Grade including shuttering", "Cum", 8400.00m, "Maharashtra", "RCC Works", "Maharashtra PWD DSR 2023"),
            CreateDSR("MH-EW-001", "Excavation in ordinary soil", "Cum", 115.00m, "Maharashtra", "Earthwork", "Maharashtra PWD DSR 2023"),
            CreateDSR("MH-MA-001", "Brick masonry in CM 1:4", "Cum", 5200.00m, "Maharashtra", "Masonry", "Maharashtra PWD DSR 2023"),
        };

        db.DSRRates.AddRange(rates);
        await db.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} DSR rates.", rates.Count);
    }

    private static async Task SeedRateMasterAsync(ApplicationDbContext db, ILogger logger)
    {
        if (await db.RateMasters.AnyAsync()) return;

        logger.LogInformation("Seeding RateMaster...");

        var state = "Uttar Pradesh";
        var rates = new[]
        {
            RateMaster.Create("CEMENT", "OPC Cement 53 Grade", "Bag", 420m, state),
            RateMaster.Create("STEEL", "TMT Steel Fe500", "Kg", 58m, state),
            RateMaster.Create("BRICKS", "First Class Bricks", "Nos", 8.5m, state),
            RateMaster.Create("SAND", "River Sand (Washed)", "Cft", 55m, state),
        };

        db.RateMasters.AddRange(rates);
        await db.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} RateMaster rows.", rates.Length);
    }

    private static async Task SeedMaterialRatesAsync(ApplicationDbContext db, ILogger logger)
    {
        if (await db.MaterialRates.AnyAsync()) return;

        var today = DateTime.UtcNow;
        var rates = new[]
        {
            CreateMaterial("OPC Cement 53 Grade", "Bag (50 kg)", 420.00m, "Uttar Pradesh", "Cement", today),
            CreateMaterial("PPC Cement", "Bag (50 kg)", 390.00m, "Uttar Pradesh", "Cement", today),
            CreateMaterial("TMT Steel Fe415 8mm", "Kg", 58.50m, "Uttar Pradesh", "Steel", today),
            CreateMaterial("TMT Steel Fe415 12mm", "Kg", 57.00m, "Uttar Pradesh", "Steel", today),
            CreateMaterial("TMT Steel Fe500 10mm", "Kg", 59.50m, "Uttar Pradesh", "Steel", today),
            CreateMaterial("River Sand (Washed)", "Cft", 55.00m, "Uttar Pradesh", "Sand & Aggregate", today),
            CreateMaterial("Manufactured Sand (M-Sand)", "Cft", 45.00m, "Uttar Pradesh", "Sand & Aggregate", today),
            CreateMaterial("Coarse Aggregate 20mm", "Cft", 38.00m, "Uttar Pradesh", "Sand & Aggregate", today),
            CreateMaterial("Coarse Aggregate 10mm", "Cft", 40.00m, "Uttar Pradesh", "Sand & Aggregate", today),
            CreateMaterial("First Class Bricks", "No.", 8.50m, "Uttar Pradesh", "Bricks", today),
            CreateMaterial("AAC Blocks 600x200x200", "No.", 58.00m, "Uttar Pradesh", "Bricks", today),
            CreateMaterial("OPC Cement 53 Grade", "Bag (50 kg)", 450.00m, "Maharashtra", "Cement", today),
            CreateMaterial("TMT Steel Fe500 12mm", "Kg", 62.00m, "Maharashtra", "Steel", today),
            CreateMaterial("River Sand", "Cft", 72.00m, "Maharashtra", "Sand & Aggregate", today),
        };

        db.MaterialRates.AddRange(rates);
        await db.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} material rates.", rates.Length);
    }

    private static async Task SeedTendersAsync(ApplicationDbContext db, ILogger logger)
    {
        if (await db.Tenders.AnyAsync()) return;

        var now = DateTime.UtcNow;
        var tenders = new[]
        {
            Tender.Create(
                "Construction of 2-Lane Road from Lucknow to Unnao (NH-56 Section KM 12-28)",
                "UP/PWD/NH/2024/1842", "Public Works Department", "UPPWD Lucknow Division",
                "Uttar Pradesh", "Road & Highway", 28_50_00_000m, now.AddDays(22), "GePNIC", now.AddDays(-8)),
            Tender.Create(
                "Construction of Primary School Building with 8 Classrooms at Sultanpur",
                "UP/EDU/BLDG/2024/0934", "Basic Education Department", "Uttar Pradesh Basic Shiksha Parishad",
                "Uttar Pradesh", "Building Construction", 1_85_00_000m, now.AddDays(15), "GePNIC", now.AddDays(-5)),
            Tender.Create(
                "Repair & Renovation of District Hospital OPD Block - Agra",
                "UP/HLTH/RENO/2024/2211", "Medical Health & Family Welfare", "Chief Medical Officer Agra",
                "Uttar Pradesh", "Renovation & Repair", 92_00_000m, now.AddDays(10), "State Portal", now.AddDays(-3)),
            Tender.Create(
                "Supply, Installation and Commissioning of Solar Street Lights - 500 Nos.",
                "UP/NEDA/SOL/2024/0478", "New & Renewable Energy Dev Agency", "NEDA UP",
                "Uttar Pradesh", "Electrical Works", 3_50_00_000m, now.AddDays(18), "GePNIC", now.AddDays(-10)),
            Tender.Create(
                "Construction of Overhead Water Tank 2 Lakh Litre Capacity at Prayagraj",
                "UP/JJM/OHT/2024/1105", "Jal Jeevan Mission", "UP Jal Nigam",
                "Uttar Pradesh", "Water Supply", 2_15_00_000m, now.AddDays(25), "GePNIC", now.AddDays(-12)),
            Tender.Create(
                "Widening of State Highway SH-92 from 2-Lane to 4-Lane (Package 3)",
                "MH/PWD/SH/2024/3387", "Public Works Department", "Maharashtra PWD Nashik",
                "Maharashtra", "Road & Highway", 45_80_00_000m, now.AddDays(30), "Mahatender", now.AddDays(-15)),
            Tender.Create(
                "Construction of Drainage Network - Zone 4, Bhopal Municipal Corporation",
                "MP/BMC/DRN/2024/0887", "Urban Development", "Bhopal Municipal Corporation",
                "Madhya Pradesh", "Sewerage & Drainage", 8_90_00_000m, now.AddDays(20), "GePNIC", now.AddDays(-6)),
            Tender.Create(
                "Construction of Foot Over Bridge at 3 Railway Level Crossings - Jaipur",
                "RJ/PWD/FOB/2024/0654", "Public Works Department", "Rajasthan PWD Jaipur Circle",
                "Rajasthan", "Bridge & Culvert", 6_25_00_000m, now.AddDays(28), "GePNIC", now.AddDays(-9)),
            Tender.Create(
                "Development of Urban Road Network - 15 Roads in Varanasi Smart City",
                "UP/VSCL/URB/2024/0219", "Smart City Mission", "Varanasi Smart City Ltd",
                "Uttar Pradesh", "Civil Works", 18_40_00_000m, now.AddDays(35), "GePNIC", now.AddDays(-20)),
            Tender.Create(
                "Construction of Rural Community Toilets under SBM Phase-2 - 200 Units",
                "UP/SBM/TOIL/2024/1678", "Rural Development", "Swachh Bharat Mission UP",
                "Uttar Pradesh", "Building Construction", 75_00_000m, now.AddDays(12), "State Portal", now.AddDays(-4)),
        };

        // Set EMD amounts (typically 2-3% of estimated value)
        db.Tenders.AddRange(tenders);
        await db.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} tenders.", tenders.Length);
    }

    private static async Task SeedDemoContractorAsync(ApplicationDbContext db, ILogger logger)
    {
        const string demoEmail = "demo@buildsaathi.in";
        if (await db.Users.AnyAsync(u => u.Email == demoEmail)) return;

        var contractor = Contractor.Create(
            "Ramesh Kumar", demoEmail, "9876543210",
            "Kumar Construction Pvt Ltd", "Lucknow", "Uttar Pradesh");
        db.Contractors.Add(contractor);

        var user = User.Create(
            contractor.Id, "Ramesh Kumar", demoEmail,
            HashPassword("Demo@1234"), UserRole.Owner);
        db.Users.Add(user);

        // Add a welcome notification
        var notification = Notification.Create(
            contractor.Id,
            "Welcome to BuildSaathi!",
            "Your account is set up. Explore tenders and create your first BOQ estimate.",
            "system",
            "/tenders");
        db.Notifications.Add(notification);

        await db.SaveChangesAsync();
        logger.LogInformation("Demo contractor seeded: {Email} / Demo@1234", demoEmail);
    }

    private static DSRRate CreateDSR(string code, string desc, string unit, decimal rate,
        string state, string category, string source) =>
        DSRRate.Create(code, desc, unit, rate, state, category, source);

    private static MaterialRate CreateMaterial(string name, string unit, decimal rate,
        string state, string category, DateTime effectiveDate) =>
        MaterialRate.Create(name, unit, rate, state, effectiveDate, category, "Market Survey");
}
