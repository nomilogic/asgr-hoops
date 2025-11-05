import { db } from "./db";
import { schoolRankings } from "@shared/schema";

async function seedSchoolRankings() {
  console.log("Starting school rankings seed...");

  const rankings2023_24 = [
    { rank: 1, schoolName: "Etiwanda", schoolState: "CA", logoUrl: "/attached_assets/EtiwandaLogo.jpg", wins: 32, losses: 3, keyWins: "CIF Open State Champion", season: "2023-24" },
    { rank: 2, schoolName: "Archbishop Mitty", schoolState: "CA", logoUrl: "/attached_assets/AMLogo.png", wins: 30, losses: 1, keyWins: "Nike TOC Champions, CIF Open State Runner-Up", season: "2023-24" },
    { rank: 3, schoolName: "Montverde Academy", schoolState: "FL", logoUrl: "/attached_assets/MTVLogo.jpg", wins: 24, losses: 4, keyWins: "Chipotle National Champion", season: "2023-24" },
    { rank: 4, schoolName: "Long Island Lutheran", schoolState: "NY", logoUrl: "/attached_assets/LILLogo.png", wins: 22, losses: 2, keyWins: "Nike TOC Runner-Up, Chipotle Semifinals", season: "2023-24" },
    { rank: 5, schoolName: "Duncanville", schoolState: "TX", logoUrl: "/attached_assets/DuncanvilleLogo.png", wins: 35, losses: 4, keyWins: "6A UIL Texas State Champion", season: "2023-24" },
    { rank: 6, schoolName: "Crestwood Prep", schoolState: "ONT", logoUrl: "/attached_assets/CrestwoodPrepLogo.jpg", wins: 38, losses: 1, keyWins: "OSBA Champion", season: "2023-24" },
    { rank: 7, schoolName: "IMG Academy", schoolState: "FL", logoUrl: "/attached_assets/IMGLogo.jpg", wins: 25, losses: 4, keyWins: "Chipotle National Runner-Up", season: "2023-24" },
    { rank: 8, schoolName: "Bishop McNamara", schoolState: "MD", logoUrl: "/attached_assets/BMLogo.png", wins: 28, losses: 5, keyWins: "WCAC Runner-Up", season: "2023-24" },
    { rank: 9, schoolName: "Hebron Christian Academy", schoolState: "GA", logoUrl: "/attached_assets/HebronChristianLogo.png", wins: 32, losses: 2, keyWins: "3A Georgia State Champion, Throne National Champion", season: "2023-24" },
    { rank: 10, schoolName: "Sierra Canyon", schoolState: "CA", logoUrl: "/attached_assets/SCLogo.png", wins: 31, losses: 3, keyWins: "CIF Open Regional Finals", season: "2023-24" },
    { rank: 11, schoolName: "Grayson", schoolState: "GA", logoUrl: "/attached_assets/GraysonLogo.jpg", wins: 32, losses: 1, keyWins: "7A Georgia State Champion, Chipotle Nationals", season: "2023-24" },
    { rank: 12, schoolName: "Morris Catholic", schoolState: "NJ", logoUrl: "/attached_assets/MCLogo.jpg", wins: 29, losses: 1, keyWins: "Non Public B New Jersey State Champion", season: "2023-24" },
    { rank: 13, schoolName: "Johnston", schoolState: "IA", logoUrl: "/attached_assets/JohnstonLogo.png", wins: 29, losses: 0, keyWins: "5A Iowa State Champion", season: "2023-24" },
    { rank: 14, schoolName: "Grace Christian", schoolState: "NC", logoUrl: "/attached_assets/GCLogo.jpg", wins: 30, losses: 1, keyWins: "3A NCISAA State Champion, Chipolte Nationals", season: "2023-24" },
    { rank: 15, schoolName: "St. John's", schoolState: "DC", logoUrl: "/attached_assets/SJCLogo.jpg", wins: 26, losses: 5, keyWins: "WCAC Champion, DCSAA Champion", season: "2023-24" },
    { rank: 16, schoolName: "Westtown School", schoolState: "PA", logoUrl: "/attached_assets/WesttownLogo.jpg", wins: 25, losses: 2, keyWins: "PAISAA State Champion", season: "2023-24" },
    { rank: 17, schoolName: "Sidwell Friends", schoolState: "DC", logoUrl: "/attached_assets/SFLogo.png", wins: 25, losses: 7, keyWins: "DCSAA Runner-Up, Chipotle Nationals", season: "2023-24" },
    { rank: 18, schoolName: "Camden", schoolState: "SC", logoUrl: "/attached_assets/CamdenLogo.jpg", wins: 28, losses: 2, keyWins: "3A South Carolina State Champion", season: "2023-24" },
    { rank: 19, schoolName: "Purcell Marian", schoolState: "OH", logoUrl: "/attached_assets/PMLogo.png", wins: 28, losses: 1, keyWins: "Divison II OHSAA State Champion", season: "2023-24" },
    { rank: 20, schoolName: "Lake Highland Prep", schoolState: "FL", logoUrl: "/attached_assets/LHPLogo.png", wins: 25, losses: 5, keyWins: "4A FHSAA State Champion", season: "2023-24" },
    { rank: 21, schoolName: "South Grand Prairie", schoolState: "TX", logoUrl: "/attached_assets/SGPLogo.png", wins: 33, losses: 4, keyWins: "6A UIL Texas State Runner-Up", season: "2023-24" },
    { rank: 22, schoolName: "Minnetonka", schoolState: "MN", logoUrl: "/attached_assets/MinnetonkaLogo.jpg", wins: 29, losses: 2, keyWins: "4A MSHAL State Champion", season: "2023-24" },
    { rank: 23, schoolName: "Summer Creek", schoolState: "TX", logoUrl: "/attached_assets/SummerCreekLogo.jpg", wins: 35, losses: 4, keyWins: "6A UIL Texas State Semifinals", season: "2023-24" },
    { rank: 24, schoolName: "Incarnate Word Academy", schoolState: "MO", logoUrl: "/attached_assets/IWALogo.jpg", wins: 31, losses: 0, keyWins: "6A MSHSA State Champion", season: "2023-24" },
    { rank: 25, schoolName: "DeSoto", schoolState: "TX", logoUrl: "/attached_assets/DeSotoLogo.png", wins: 27, losses: 6, keyWins: "6A UIL Texas State Elite 8", season: "2023-24" },
  ];

  const rankings2024_25 = [
    { rank: 1, schoolName: "Archbishop Mitty", schoolState: "CA", logoUrl: "/attached_assets/AMLogo.png", wins: 15, losses: 0, keyWins: "Undefeated, Nike TOC Contender", season: "2024-25" },
    { rank: 2, schoolName: "Montverde Academy", schoolState: "FL", logoUrl: "/attached_assets/MTVLogo.jpg", wins: 18, losses: 1, keyWins: "Strong Season Start", season: "2024-25" },
    { rank: 3, schoolName: "Etiwanda", schoolState: "CA", logoUrl: "/attached_assets/EtiwandaLogo.jpg", wins: 16, losses: 2, keyWins: "Defending State Champs", season: "2024-25" },
    { rank: 4, schoolName: "Long Island Lutheran", schoolState: "NY", logoUrl: "/attached_assets/LILLogo.png", wins: 14, losses: 1, keyWins: "Strong Start", season: "2024-25" },
    { rank: 5, schoolName: "IMG Academy", schoolState: "FL", logoUrl: "/attached_assets/IMGLogo.jpg", wins: 17, losses: 2, keyWins: "National Tournament Contender", season: "2024-25" },
  ];

  try {
    await db.insert(schoolRankings).values([...rankings2023_24, ...rankings2024_25]);
    console.log(`Seeded ${rankings2023_24.length + rankings2024_25.length} school rankings`);
  } catch (error) {
    console.error("Error seeding school rankings:", error);
    throw error;
  }

  console.log("School rankings seed completed!");
}

seedSchoolRankings();
