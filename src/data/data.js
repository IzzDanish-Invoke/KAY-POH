// Temporary content store.
// Keep database-shaped content here until a real API/database is connected.

export const packages = [
  {
    id: "ipoh-essentials",
    tag: "Best first visit",
    days: "2D1N",
    title: "Ipoh Essentials",
    color: "package-coral",
    price: 399,
    currency: "RM",
    description: "Old Town icons, limestone caves, local favourites, and a boutique stay—all sorted.",
    highlights: ["Heritage walk", "Cave temple", "3 local meals", "1-night stay"],
    includes: ["Accommodation", "Local guide", "Listed meals", "Scheduled transfers"],
    itinerary: [
      { day: 1, label: "Day 1", title: "Old Town & local flavours", items: [
        { time: "10:00", activity: "Welcome to Ipoh", note: "Meet your guide at Ipoh Railway Station and drop off your bags." },
        { time: "10:30", activity: "Heritage & mural walk", note: "Explore Concubine Lane, Market Lane, and the stories behind Old Town." },
        { time: "12:30", activity: "Classic Ipoh lunch", note: "A local favourite, selected around your dietary needs." },
        { time: "14:00", activity: "Check-in & free time", note: "Settle into your centrally located boutique hotel." },
        { time: "17:00", activity: "New Town food trail", note: "Taste famous street snacks and finish with an easy local dinner." },
      ]},
      { day: 2, label: "Day 2", title: "Limestone & white coffee", items: [
        { time: "08:00", activity: "Kopitiam breakfast", note: "White coffee, kaya toast, and a proper Ipoh morning." },
        { time: "09:30", activity: "Sam Poh Tong temple", note: "Visit Ipoh’s dramatic limestone cave temple and gardens." },
        { time: "11:30", activity: "Local product stop", note: "Pick up pomelo, biscuits, or coffee before departure." },
        { time: "13:00", activity: "Trip concludes", note: "Drop-off at the station or city centre." },
      ]},
    ],
  },
  {
    id: "hungry-kay-poh",
    tag: "Made for foodies",
    days: "2D1N",
    title: "The Hungry Kay Poh",
    color: "package-gold",
    price: 459,
    currency: "RM",
    description: "A weekend built around the dishes, makers, and old-school shops that define Ipoh.",
    highlights: ["Food trail", "Market visit", "Coffee workshop", "1-night stay"],
    includes: ["Accommodation", "Local guide", "Listed meals", "Scheduled transfers"],
    itinerary: [
      { day: 1, label: "Day 1", title: "Eat your way through Ipoh", items: [
        { time: "09:30", activity: "Old Town breakfast crawl", note: "White coffee, egg tarts, kaya toast, and local conversation." },
        { time: "11:30", activity: "Market with a local", note: "Meet traders and discover the ingredients behind Perak cooking." },
        { time: "13:00", activity: "Bean sprout chicken lunch", note: "Try Ipoh’s most debated signature dish at a guide-approved shop." },
        { time: "15:00", activity: "Hotel check-in", note: "Rest, wander, or follow our self-guided snack map." },
        { time: "18:30", activity: "Night food safari", note: "A progressive dinner across three neighbourhood institutions." },
      ]},
      { day: 2, label: "Day 2", title: "Makers, coffee & keepsakes", items: [
        { time: "08:30", activity: "Dim sum morning", note: "Share baskets of Ipoh favourites in a lively local restaurant." },
        { time: "10:30", activity: "White coffee workshop", note: "Learn how Ipoh’s iconic roast is made and blend your own cup." },
        { time: "12:30", activity: "Farewell lunch", note: "One final local meal before station drop-off." },
      ]},
    ],
  },
  {
    id: "limestone-and-legacy",
    tag: "Slow & scenic",
    days: "3D2N",
    title: "Limestone & Legacy",
    color: "package-sage",
    price: 699,
    currency: "RM",
    description: "A deeper journey from grand heritage streets to quiet valleys and hidden temples.",
    highlights: ["Private guide", "Countryside day", "All transfers", "2-night stay"],
    includes: ["Accommodation", "Private local guide", "Listed meals", "All scheduled transfers"],
    itinerary: [
      { day: 1, label: "Day 1", title: "The city and its stories", items: [
        { time: "10:00", activity: "Station welcome", note: "Private transfer, luggage drop, and an introduction to Ipoh." },
        { time: "11:00", activity: "Heritage discovery", note: "Colonial landmarks, murals, laneways, and local legends." },
        { time: "14:30", activity: "Hotel check-in", note: "A relaxed afternoon before dinner with your guide." },
      ]},
      { day: 2, label: "Day 2", title: "Beyond the city", items: [
        { time: "08:30", activity: "Gopeng countryside", note: "Scenic drive through kampungs and dramatic karst landscapes." },
        { time: "10:00", activity: "Gua Tempurung", note: "A guided dry cave experience suitable for first-time explorers." },
        { time: "13:00", activity: "Riverside lunch", note: "A leisurely local meal surrounded by greenery." },
        { time: "15:00", activity: "Kellie’s Castle", note: "Explore Perak’s most curious unfinished mansion." },
      ]},
      { day: 3, label: "Day 3", title: "Temples & a slow goodbye", items: [
        { time: "08:30", activity: "Cave temple trail", note: "Visit Perak Tong and a quieter guide-selected sanctuary." },
        { time: "11:30", activity: "Coffee and keepsakes", note: "Free time for coffee, biscuits, and last-minute shopping." },
        { time: "13:00", activity: "Departure transfer", note: "Drop-off at your next Ipoh connection." },
      ]},
    ],
  },
];

export const experiences = [
  { id: "old-town-stories", number: "01", title: "Old Town Stories", description: "Murals, kopitiams, and the people behind Ipoh's storied streets.", duration: "3 hours", price: 85, currency: "RM", color: "coral" },
  { id: "caves-and-temples", number: "02", title: "Caves & Temples", description: "Limestone hills, hidden temples, and a slower side of the city.", duration: "Half day", price: 130, currency: "RM", color: "green" },
  { id: "taste-of-ipoh", number: "03", title: "Taste of Ipoh", description: "A delicious trail from white coffee to bean sprout chicken.", duration: "4 hours", price: 110, currency: "RM", color: "gold" },
];

export const matchingQuestions = [
  { id: "duration", label: "How long?", defaultValue: "2D1N", options: ["Day trip", "2D1N", "3D2N", "4+ days"] },
  { id: "group", label: "Who’s coming?", defaultValue: "A couple", options: ["Solo traveller", "A couple", "Family", "Friends", "Corporate group"] },
  { id: "interest", label: "Your travel mood", defaultValue: "A little of everything", options: ["A little of everything", "Food, please", "Culture & heritage", "Nature & adventure", "Easy and relaxing"] },
  { id: "budget", label: "Budget per person", defaultValue: "RM300–500", options: ["Below RM300", "RM300–500", "RM500–800", "RM800+"] },
];

export const dashboardMetrics = [
  { id: "revenue", label: "Revenue this month", value: "RM24,580", change: "+18.2%", trend: "up" },
  { id: "bookings", label: "Total bookings", value: "148", change: "+12.5%", trend: "up" },
  { id: "travellers", label: "Active travellers", value: "326", change: "+9.1%", trend: "up" },
  { id: "rating", label: "Average rating", value: "4.86", change: "+0.14", trend: "up" },
];

export const monthlyBookings = [
  { month: "Jan", bookings: 62, revenue: 10800 }, { month: "Feb", bookings: 74, revenue: 12600 },
  { month: "Mar", bookings: 68, revenue: 11900 }, { month: "Apr", bookings: 91, revenue: 15700 },
  { month: "May", bookings: 105, revenue: 18400 }, { month: "Jun", bookings: 118, revenue: 20100 },
  { month: "Jul", bookings: 132, revenue: 22300 }, { month: "Aug", bookings: 148, revenue: 24580 },
];

export const members = [
  { id: "KP-M1024", name: "Alicia Tan", email: "alicia.tan@example.com", joined: "12 Aug 2026", bookings: 3, spent: 1287, status: "Active", initials: "AT" },
  { id: "KP-M1023", name: "Marcus Lee", email: "marcus.lee@example.com", joined: "10 Aug 2026", bookings: 1, spent: 699, status: "Active", initials: "ML" },
  { id: "KP-M1022", name: "Nur Aisyah", email: "aisyah@example.com", joined: "08 Aug 2026", bookings: 4, spent: 1840, status: "Active", initials: "NA" },
  { id: "KP-M1021", name: "Daniel Wong", email: "daniel.w@example.com", joined: "02 Aug 2026", bookings: 2, spent: 858, status: "Active", initials: "DW" },
  { id: "KP-M1020", name: "Siti Hajar", email: "siti.hajar@example.com", joined: "29 Jul 2026", bookings: 0, spent: 0, status: "New", initials: "SH" },
  { id: "KP-M1019", name: "James Carter", email: "j.carter@example.com", joined: "24 Jul 2026", bookings: 1, spent: 459, status: "Inactive", initials: "JC" },
];

export const tourGuides = [
  {
    id: "KP-G001", name: "Mei Ling Tan", initials: "ML", title: "Heritage storyteller",
    bio: "Ipoh-born history lover with a gift for bringing old streets and family stories to life.",
    languages: ["English", "Mandarin", "Malay"], specialties: ["Heritage", "Food"],
    rating: 4.95, reviews: 128, tours: 214, acceptance: 96, status: "Available", color: "orange",
    licensed: true, yearsExperience: 9,
    expertise: "Heritage walking tours and street-food crawls through Old Town Ipoh.",
    perks: ["Skip-the-line entry at Sam Poh Tong", "Introductions to three generations of shopkeepers on Concubine Lane"],
    testimonials: [
      { quote: "Mei Ling turned a two-hour walk into the highlight of our trip — she remembers every family story on every street.", guest: "Sarah, Australia" },
      { quote: "Punctual, funny, and clearly loves what she does.", guest: "Daniel, Singapore" },
    ],
  },
  {
    id: "KP-G002", name: "Arif Rahman", initials: "AR", title: "Nature & cave explorer",
    bio: "Outdoor guide and amateur geologist who knows Perak’s limestone landscape inside out.",
    languages: ["English", "Malay"], specialties: ["Nature", "Adventure"],
    rating: 4.89, reviews: 94, tours: 167, acceptance: 91, status: "On tour", color: "aqua",
    licensed: true, yearsExperience: 7,
    expertise: "Limestone cave systems and countryside trekking around Gopeng and Gunung Lang.",
    perks: ["Access to a trail not listed on public maps", "Caving gear provided at no extra cost"],
    testimonials: [
      { quote: "Arif knows every cave system like the back of his hand — genuinely felt like an expedition, not a tour.", guest: "Marco, Italy" },
    ],
  },
  {
    id: "KP-G003", name: "Uncle Chan", initials: "UC", title: "Ipoh food insider",
    bio: "Retired chef, lifelong Ipoh resident, and firm believer that every good story starts over coffee.",
    languages: ["Cantonese", "English", "Malay"], specialties: ["Food", "Culture"],
    rating: 4.98, reviews: 176, tours: 289, acceptance: 98, status: "Available", color: "red",
    licensed: true, yearsExperience: 15,
    expertise: "Old-school hawker trails and the stories behind Ipoh’s most-argued-over dishes.",
    perks: ["Reserved seating at a no-reservations noodle shop", "Tastings at a coffee roastery closed to walk-ins"],
    testimonials: [
      { quote: "Uncle Chan is a local legend — every stall owner greeted him by name.", guest: "Priya, UK" },
      { quote: "Hilarious, warm, and the bean sprout chicken recommendation alone was worth it.", guest: "Wei Jian, KL" },
    ],
  },
  {
    id: "KP-G004", name: "Priya Nair", initials: "PN", title: "Culture & family guide",
    bio: "A patient, energetic guide who creates thoughtful experiences for families and young travellers.",
    languages: ["English", "Tamil", "Malay"], specialties: ["Family", "Culture"],
    rating: 4.84, reviews: 72, tours: 121, acceptance: 88, status: "Off duty", color: "blue",
    licensed: true, yearsExperience: 6,
    expertise: "Family-paced culture walks and gentle sightseeing for travellers with young children.",
    perks: ["Kid-friendly pacing with built-in rest stops", "Hands-on craft demo with a local artisan"],
    testimonials: [
      { quote: "Endlessly patient with our kids and still made it interesting for the adults.", guest: "The Tan family, KL" },
    ],
  },
];

export const guideBookingRequests = [
  { id: "KP-B2048", member: "Alicia Tan", packageId: "ipoh-essentials", packageName: "Ipoh Essentials", guideId: "KP-G001", guide: "Mei Ling Tan", date: "22–23 Aug 2026", guests: 2, value: 798, status: "Pending" },
  { id: "KP-B2047", member: "Marcus Lee", packageId: "limestone-and-legacy", packageName: "Limestone & Legacy", guideId: "KP-G002", guide: "Arif Rahman", date: "25–27 Aug 2026", guests: 2, value: 1398, status: "Pending" },
  { id: "KP-B2046", member: "Nur Aisyah", packageId: "hungry-kay-poh", packageName: "The Hungry Kay Poh", guideId: "KP-G003", guide: "Uncle Chan", date: "19–20 Aug 2026", guests: 4, value: 1836, status: "Accepted" },
  { id: "KP-B2045", member: "Daniel Wong", packageId: "ipoh-essentials", packageName: "Ipoh Essentials", guideId: "KP-G001", guide: "Mei Ling Tan", date: "17–18 Aug 2026", guests: 2, value: 798, status: "Accepted" },
  { id: "KP-B2044", member: "James Carter", packageId: "hungry-kay-poh", packageName: "The Hungry Kay Poh", guideId: "KP-G004", guide: "Priya Nair", date: "12–13 Aug 2026", guests: 1, value: 459, status: "Completed" },
];

export const bookingAddOns = [
  { id: "station-pickup", name: "Station pickup", description: "Private pickup from Ipoh Railway Station", price: 35, appliesTo: ["package", "experience"] },
  { id: "private-tour", name: "Make it private", description: "Keep the guide exclusively for your group", price: 120, appliesTo: ["experience"] },
  { id: "food-upgrade", name: "Extra food stops", description: "Two additional guide-picked tastings", price: 45, appliesTo: ["package", "experience"] },
  { id: "late-checkout", name: "Late checkout", description: "Keep your room until 4pm on departure day", price: 80, appliesTo: ["package"] },
];
