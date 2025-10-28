import { type Product, type InsertProduct, type Player, type InsertPlayer, type CartItem, type InsertCartItem } from "@shared/schema";
import { randomUUID } from "crypto";

const productImageUrl = "/attached_assets/generated_images/iPad_scouting_app_mockup_1a4da2f8.png";
const player1 = "/attached_assets/AddisonMackPhoto-e1726688270253.jpg";
const player2 = "/attached_assets/AliciaMitchellPhoto-e1717177516868.jpg";
const player3 = "/attached_assets/Alyssa-MurphyPhoto-e1717098983620.jpg";
const player4 = "/attached_assets/AmaiaJacksonPhoto-e1717171328776.jpg";
const player5 = "/attached_assets/AmaniJenkinsPhoto-e1717172767219.jpg";
const player6 = "/attached_assets/AngelinaHodgensPhoto-e1717173127450.jpg";
const player7 = "/attached_assets/AshleyDinglesPhoto-e1717173840507.jpg";
const player8 = "/attached_assets/AubreyGalvanPhoto-e1717174561941.jpg";
const player9 = "/attached_assets/AutumnMcCallPhoto-e1717175322501.jpg";
const player10 = "/attached_assets/AveryCooperPhoto-e1717175536678.jpg";
const player11 = "/attached_assets/AylaWilliamsPhoto-e1717176293306.jpg";
const player12 = "/attached_assets/BrandieHarrodPhoto-e1717176518319.jpg";


export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  getAllPlayers(): Promise<Player[]>;
  getPlayersByGradYear(gradYear: number): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;

  getCart(): Promise<CartItem[]>;
  getCartItemById(id: string): Promise<CartItem | undefined>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private players: Map<string, Player>;
  private cart: Map<string, CartItem>;

  constructor() {
    this.products = new Map();
    this.players = new Map();
    this.cart = new Map();
    this.initializeData();
  }

  private initializeData() {
    const regionalProduct: Product = {
      id: randomUUID(),
      name: "2025-26 All-Star Girls Report Scouting Service (Regional)",
      slug: "regional-package",
      description: "Access top regional high school basketball talent with comprehensive scouting reports for your area.",
      price: "149.99",
      category: "package",
      imageUrl: productImageUrl,
      features: [
        "Top 350 High School Class",
        "Regional Coverage: Carolinas, DMV, Peach State, Sunshine State, Lone Star State, SoCal/NorCal",
        "Detailed Player Profiles",
        "Monthly Rankings Updates",
        "Access to Regional Tournaments Coverage"
      ],
    };

    const nationalProduct: Product = {
      id: randomUUID(),
      name: "2025-26 All-Star Girls Report Scouting Service (National)",
      slug: "national-package",
      description: "Comprehensive national coverage of top high school basketball talent and college transfer portal players.",
      price: "249.99",
      category: "package",
      imageUrl: productImageUrl,
      features: [
        "Top 350 High School Class (National) - 2026-2027",
        "Top 350 College Transfer Portal - 2026",
        "Top 350 High School Class (Composite)",
        "Regional Coverage: Carolinas, DMV, Peach State, Sunshine State, Lone Star State, SoCal/NorCal",
        "Exclusive Video Analysis",
        "Priority Updates and Alerts"
      ],
    };

    const premiumProduct: Product = {
      id: randomUUID(),
      name: "2025-26 All-Star Girls Report Scouting Service (Premium)",
      slug: "premium-package",
      description: "Ultimate access to all rankings, analysis, and scouting reports across multiple graduating classes.",
      price: "399.99",
      category: "package",
      imageUrl: productImageUrl,
      features: [
        "Top 350 High School Class (National) - 2026-2030",
        "Top 350 College Transfer Portal - 2026",
        "Top 350 High School Class (Composite)",
        "Regional Coverage: All regions nationwide",
        "Exclusive Video Analysis & Highlights",
        "Direct Scout Contact Access",
        "Early Recruiting Insights",
        "Monthly Webinars with Scouts"
      ],
    };

    this.products.set(regionalProduct.id, regionalProduct);
    this.products.set(nationalProduct.id, nationalProduct);
    this.products.set(premiumProduct.id, premiumProduct);

    const samplePlayers: Player[] = [
      {
        id: randomUUID(),
        rank: 1,
        name: "Aaliyah Chavez",
        height: "5'9\"",
        position: "G",
        gradYear: 2025,
        highSchool: "Monterey, TX",
        circuitProgram: "CyFair Elite EYBL",
        college: "Oklahoma",
        collegeLogo: "",
        rating: 99,
        ratingDescription: "Dominant 3 Level scorer with advanced game and plays frames ahead with surreal court vision with passing, high IQ who scores off bounce, 3 shooter with mid-range game from all sets and transition. Final List includes Texas Tech, SC, Arizona, South Carolina, Oklahoma, Ohio State, LSU, UCLA, Texas & Tennessee.",
        photoUrl: player1,
      },
      {
        id: randomUUID(),
        rank: 2,
        name: "Jasmine Davidson",
        height: "6'1\"",
        position: "W",
        gradYear: 2025,
        highSchool: "Clackamas, OR",
        circuitProgram: "Cal Stars EYBL",
        college: "USC",
        collegeLogo: "",
        rating: 98,
        ratingDescription: "Lefty athletic, acrobatic finisher at rim with versatile skilled game with length/disrupts, shoots 3 and passer with exceptional motor. List includes UCLA, Duke, LSU, South Carolina, SC, Stanford, Texas & TCU.",
        photoUrl: player2,
      },
      {
        id: randomUUID(),
        rank: 3,
        name: "Sienna Betts",
        height: "6'4\"",
        position: "F",
        gradYear: 2025,
        highSchool: "Grandview, CO",
        circuitProgram: "Hardwood Elite 3SSB",
        college: "UCLA",
        collegeLogo: "",
        rating: 98,
        ratingDescription: "Great footwork has skills from H/L game, MR/face up, passer and excellent screener, and finishes inside will play with her sister Lauren Betts.",
        photoUrl: player3,
      },
      {
        id: randomUUID(),
        rank: 4,
        name: "Lara Somfai",
        height: "6'4\"",
        position: "W",
        gradYear: 2025,
        highSchool: "IMG Academy, FL",
        circuitProgram: "FBC United GUAA",
        college: "Stanford",
        collegeLogo: "",
        rating: 98,
        ratingDescription: "Strong Athletic R/R handles, WNBA footwork, excellent cutter to basket, shoots '3 High IQ, step back, attacks R/F Uses L/R rim, Australian National Team.",
        photoUrl: player4,
      },
      {
        id: randomUUID(),
        rank: 5,
        name: "Darianna Alexander",
        height: "6'1\"",
        position: "F",
        gradYear: 2025,
        highSchool: "Purcell Marian, OH",
        circuitProgram: "WV Thunder GUAA",
        college: "Cincinnati",
        collegeLogo: "",
        rating: 97,
        ratingDescription: "Explosive athletic vertical game can post up, rebound and finisher, rim to rim with euro step, shoots 3. Offers include UConn, Cincinnati, West Virginia, Texas, Arizona State, UCLA, Notre Dame, South Carolina, SC, Arizona, Oklahoma, & Illinois.",
        photoUrl: player1,
      },
      {
        id: randomUUID(),
        rank: 6,
        name: "Grace Knox",
        height: "6'2\"",
        position: "F",
        gradYear: 2025,
        highSchool: "Etiwanda, CA",
        circuitProgram: "Cal Sparks EYBL",
        college: "LSU",
        collegeLogo: "",
        rating: 97,
        ratingDescription: "Long athletic vertical inside/outside game, get R/R, rebounds, attacks R, finisher.",
        photoUrl: player2,
      },
      {
        id: randomUUID(),
        rank: 7,
        name: "Ayla McDowell",
        height: "6'2\"",
        position: "W",
        gradYear: 2025,
        highSchool: "Cypress Springs, TX",
        circuitProgram: "CyFair Elite EYBL",
        college: "South Carolina",
        collegeLogo: "",
        rating: 97,
        ratingDescription: "Athletic skilled R/R bounce shoots'3, length, guards multiple positions and looks to score.",
        photoUrl: player3,
      },
      {
        id: randomUUID(),
        rank: 8,
        name: "Aaliyah Crump",
        height: "6'1\"",
        position: "W",
        gradYear: 2025,
        highSchool: "Montverde Academy, FL",
        circuitProgram: "All Iowa Attack EYBL",
        college: "Texas",
        collegeLogo: "",
        rating: 96,
        ratingDescription: "Can play I/O strong versatile athletic, guards multiple positions and get to R, shoots '3 signed NIL with Klutch Athletics by New Balance. Offers include Minnesota, Texas, Baylor, Ohio State and many more Power 5 programs.",
        photoUrl: player4,
      },
      {
        id: randomUUID(),
        rank: 1,
        name: "Emma Rodriguez",
        height: "6'0\"",
        position: "G",
        gradYear: 2026,
        highSchool: "Oak Ridge, CA",
        circuitProgram: "West Coast Elite EYBL",
        college: "",
        collegeLogo: "",
        rating: 98,
        ratingDescription: "Elite point guard with exceptional court vision and leadership. Excellent three-point shooter with the ability to break down defenses. Top recruiting target for multiple Power 5 programs.",
        photoUrl: player1,
      },
      {
        id: randomUUID(),
        rank: 2,
        name: "Taylor Johnson",
        height: "6'3\"",
        position: "F",
        gradYear: 2026,
        highSchool: "Lincoln High, IL",
        circuitProgram: "Midwest Thunder GUAA",
        college: "",
        collegeLogo: "",
        rating: 97,
        ratingDescription: "Versatile forward with elite rebounding ability and post moves. Can stretch the floor with consistent mid-range game. High basketball IQ with excellent defensive instincts.",
        photoUrl: player2,
      },
      {
        id: randomUUID(),
        rank: 1,
        name: "Amani Jenkins",
        photoUrl: player5,
        rating: 94,
        height: "5'10\"",
        position: "Guard",
        gradYear: 2025,
        highSchool: "Central High",
        circuitProgram: "AAU Elite",
        college: "Louisville",
        collegeLogo: "",
        ratingDescription: "Quick first step with excellent scoring ability. Can create her own shot and finish through contact."
      },
      {
        id: randomUUID(),
        rank: 2,
        name: "Angelina Hodgens",
        photoUrl: player6,
        rating: 93,
        height: "6'0\"",
        position: "Forward",
        gradYear: 2025,
        highSchool: "Westside Academy",
        circuitProgram: "Nike EYBL",
        college: "Tennessee",
        collegeLogo: "",
        ratingDescription: "Athletic wing player with great defensive instincts. Strong rebounder who can run the floor."
      },
      {
        id: randomUUID(),
        rank: 3,
        name: "Ashley Dingles",
        photoUrl: player7,
        rating: 92,
        height: "5'9\"",
        position: "Guard",
        gradYear: 2025,
        highSchool: "Eastern High",
        circuitProgram: "Adidas 3SSB",
        college: "Maryland",
        collegeLogo: "",
        ratingDescription: "Excellent three-point shooter with high basketball IQ. Great decision maker in transition."
      },
      {
        id: randomUUID(),
        rank: 4,
        name: "Aubrey Galvan",
        photoUrl: player8,
        rating: 91,
        height: "6'1\"",
        position: "Forward",
        gradYear: 2025,
        highSchool: "North Valley High",
        circuitProgram: "Under Armour",
        college: "Notre Dame",
        collegeLogo: "",
        ratingDescription: "Versatile scorer who can play inside and out. Strong mid-range game and solid defender."
      },
      {
        id: randomUUID(),
        rank: 5,
        name: "Autumn McCall",
        photoUrl: player9,
        rating: 90,
        height: "5'11\"",
        position: "Guard",
        gradYear: 2025,
        highSchool: "Summit Prep",
        circuitProgram: "AAU Elite",
        college: "Baylor",
        collegeLogo: "",
        ratingDescription: "Dynamic playmaker with great court vision. Can score at all three levels."
      },
      {
        id: randomUUID(),
        rank: 6,
        name: "Avery Cooper",
        photoUrl: player10,
        rating: 89,
        height: "6'2\"",
        position: "Center",
        gradYear: 2025,
        highSchool: "Lake County High",
        circuitProgram: "Nike EYBL",
        college: "Texas",
        collegeLogo: "",
        ratingDescription: "Strong post presence with excellent footwork. Reliable scorer in the paint."
      },
      {
        id: randomUUID(),
        rank: 7,
        name: "Ayla Williams",
        photoUrl: player11,
        rating: 88,
        height: "5'10\"",
        position: "Guard",
        gradYear: 2025,
        highSchool: "Phoenix Academy",
        circuitProgram: "Adidas 3SSB",
        college: "UCLA",
        collegeLogo: "",
        ratingDescription: "Tenacious defender with great anticipation. Can disrupt passing lanes and score in transition."
      },
      {
        id: randomUUID(),
        rank: 8,
        name: "Brandie Harrod",
        photoUrl: player12,
        rating: 87,
        height: "6'0\"",
        position: "Forward",
        gradYear: 2025,
        highSchool: "Madison High",
        circuitProgram: "Under Armour",
        college: "Oregon",
        collegeLogo: "",
        ratingDescription: "Athletic wing with great slashing ability. Strong finisher around the basket."
      }
    ];

    samplePlayers.forEach(player => {
      this.players.set(player.id, player);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values()).sort((a, b) => {
      if (a.gradYear !== b.gradYear) {
        return a.gradYear - b.gradYear;
      }
      return a.rank - b.rank;
    });
  }

  async getPlayersByGradYear(gradYear: number): Promise<Player[]> {
    return Array.from(this.players.values())
      .filter(player => player.gradYear === gradYear)
      .sort((a, b) => a.rank - b.rank);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = { ...insertPlayer, id };
    this.players.set(id, player);
    return player;
  }

  async getCart(): Promise<CartItem[]> {
    return Array.from(this.cart.values());
  }

  async getCartItemById(id: string): Promise<CartItem | undefined> {
    return this.cart.get(id);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const existingItem = Array.from(this.cart.values()).find(
      item => item.productId === insertItem.productId
    );

    if (existingItem) {
      existingItem.quantity += insertItem.quantity;
      this.cart.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const item: CartItem = { ...insertItem, id };
    this.cart.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const item = this.cart.get(id);
    if (!item) {
      throw new Error("Cart item not found");
    }
    item.quantity = quantity;
    this.cart.set(id, item);
    return item;
  }

  async removeFromCart(id: string): Promise<void> {
    this.cart.delete(id);
  }
}

export const storage = new MemStorage();