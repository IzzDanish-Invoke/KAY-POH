// Temporary content store.
// Keep database-shaped content here until a real API/database is connected.
import tourGuideRecords from "./tour-guides.json";

export const packages = [
  {
    id: "kaypoh-essential",
    tag: "Accessible as standard",
    days: "Essential",
    title: "KAYPOH Essential",
    color: "package-coral",
    price: 249,
    currency: "RM",
    description: "For relatively independent travellers who want a properly verified, comfortably paced Ipoh experience.",
    highlights: ["Verified itinerary", "Accessible transport", "Group support", "Clear access guide"],
    includes: ["Access-verified itinerary", "Prepared group companion", "Comfortable pacing", "Accessible transport"],
    accessibility: { mobility: "Accessible as standard", pace: "Comfortable group pace", support: "Basic assistance", venue: "Verified inclusive partners" },
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
    id: "kaypoh-plus",
    tag: "Most popular · Premium Economy",
    days: "2D1N",
    title: "KAYPOH Plus",
    color: "package-gold",
    price: 549,
    currency: "RM",
    description: "Our core experience with a smaller group, more coordination, slower pacing, and personalised assistance.",
    highlights: ["Smaller group", "More assistance", "Accessible stay", "Backup planning"],
    includes: ["Accessible accommodation", "Dedicated trip companion", "Pre-trip coordination", "Wheelchair-ready transfers"],
    accessibility: { mobility: "Individually reviewed", pace: "Slower and adjustable", support: "Personalised assistance", venue: "Prioritises OKU-run partners" },
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
    id: "kaypoh-private",
    tag: "Highest flexibility",
    days: "Private",
    title: "KAYPOH Private",
    color: "package-sage",
    price: 899,
    currency: "RM",
    description: "For individuals, families, or small groups needing a custom itinerary and dedicated end-to-end support.",
    highlights: ["Private group", "Custom itinerary", "Dedicated support", "Flexible timing"],
    includes: ["Individual access plan", "Private trip companion", "Personal transport plan", "Contingency planning"],
    accessibility: { mobility: "Planned individually", pace: "Fully flexible", support: "Dedicated support", venue: "Custom verified partners" },
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
  { id: "old-town-stories", number: "01", title: "Old Town, Easy Pace", description: "A step-conscious route through murals, kopitiams, and Ipoh stories, with planned rest points.", duration: "3 hours", price: 85, currency: "RM", color: "coral", accessibility: "Step-free route", venue: "OKU-friendly stops" },
  { id: "inclusive-makers", number: "02", title: "Inclusive Makers", description: "Meet craftspeople and community businesses creating meaningful work with and for OKU.", duration: "Half day", price: 130, currency: "RM", color: "green", accessibility: "Assisted access", venue: "OKU-led partners" },
  { id: "taste-of-ipoh", number: "03", title: "Taste of Ipoh", description: "An accessible tasting trail with dietary, sensory, seating, and communication needs planned in advance.", duration: "4 hours", price: 110, currency: "RM", color: "gold", accessibility: "Frequent seating", venue: "Inclusive eateries" },
];

export const matchingQuestions = [
  { id: "duration", label: "How long?", defaultValue: "2D1N", options: ["Day trip", "2D1N", "3D2N", "4+ days"] },
  { id: "group", label: "Who’s coming?", defaultValue: "A couple", options: ["Solo traveller", "A couple", "Family", "Friends", "Corporate group"] },
  { id: "interest", label: "Your travel mood", defaultValue: "A little of everything", options: ["A little of everything", "Food, please", "Culture & heritage", "Nature & adventure", "Easy and relaxing"] },
  { id: "budget", label: "Budget per person", defaultValue: "RM300–500", options: ["Below RM300", "RM300–500", "RM500–800", "RM800+"] },
  { id: "support", label: "Support needed", defaultValue: "Tell us during booking", options: ["Tell us during booking", "Wheelchair access", "Low-vision support", "Deaf / hard-of-hearing support", "Neurodiversity-friendly pace", "Personal care companion"] },
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

export const tourGuides = tourGuideRecords;

export const guideBookingRequests = [
  { id: "KP-B2048", member: "Alicia Tan", packageId: "kaypoh-essential", packageName: "KAYPOH Essential", guideId: "KP-G001", guide: "Mei Ling Tan", date: "22–23 Aug 2026", guests: 2, value: 498, status: "Pending" },
  { id: "KP-B2047", member: "Marcus Lee", packageId: "kaypoh-private", packageName: "KAYPOH Private", guideId: "KP-G002", guide: "Arif Rahman", date: "25–27 Aug 2026", guests: 2, value: 1798, status: "Pending" },
  { id: "KP-B2046", member: "Nur Aisyah", packageId: "kaypoh-plus", packageName: "KAYPOH Plus", guideId: "KP-G003", guide: "Uncle Chan", date: "19–20 Aug 2026", guests: 4, value: 2196, status: "Accepted" },
  { id: "KP-B2045", member: "Daniel Wong", packageId: "kaypoh-essential", packageName: "KAYPOH Essential", guideId: "KP-G001", guide: "Mei Ling Tan", date: "17–18 Aug 2026", guests: 2, value: 498, status: "Accepted" },
  { id: "KP-B2044", member: "James Carter", packageId: "kaypoh-plus", packageName: "KAYPOH Plus", guideId: "KP-G004", guide: "Priya Nair", date: "12–13 Aug 2026", guests: 1, value: 549, status: "Completed" },
];

export const bookingAddOns = [
  { id: "station-pickup", name: "Station pickup", description: "Private pickup from Ipoh Railway Station", price: 35, appliesTo: ["package", "experience"] },
  { id: "private-tour", name: "Make it private", description: "Keep the guide exclusively for your group", price: 120, appliesTo: ["experience"] },
  { id: "food-upgrade", name: "Extra food stops", description: "Two additional guide-picked tastings", price: 45, appliesTo: ["package", "experience"] },
  { id: "late-checkout", name: "Late checkout", description: "Keep your room until 4pm on departure day", price: 80, appliesTo: ["package"] },
];

export const accessibilityNeeds = [
  "Wheelchair or mobility access",
  "Step-free route only",
  "Low-vision guidance",
  "Deaf or hard-of-hearing support",
  "Neurodiversity-friendly pace",
  "Frequent seating and rest stops",
  "Personal care companion space",
  "Dietary or allergy planning",
];

export const liveTours = [
  {
    id: "tour-aug-1501", bookingId: "KP-B2051", title: "KAYPOH Plus · Ipoh", date: "15 Aug 2026", time: "08:30–18:30", status: "Live",
    guideId: "KP-G001", guide: "Mei Ling Tan", guests: 8, vehicle: "Accessible Van A", progress: 42,
    modules: [
      { id: "welcome-breakfast", time: "08:30", title: "Welcome & accessible breakfast", venue: "Kedai Kopi Kinta", status: "Completed", responses: 8, average: 4.8, ratings: [0,0,0,2,6] },
      { id: "old-town-route", time: "10:00", title: "Step-free Old Town route", venue: "Ipoh Old Town", status: "Rating open", responses: 5, average: 4.4, ratings: [0,0,1,1,3] },
      { id: "inclusive-lunch", time: "12:30", title: "Inclusive community lunch", venue: "Dapur Muafakat", status: "Next", responses: 0, average: 0, ratings: [0,0,0,0,0] },
      { id: "makers-workshop", time: "14:30", title: "OKU makers workshop", venue: "Kinta Inclusive Studio", status: "Upcoming", responses: 0, average: 0, ratings: [0,0,0,0,0] },
      { id: "evening-reflection", time: "17:00", title: "Coffee & trip reflection", venue: "Access Café Ipoh", status: "Upcoming", responses: 0, average: 0, ratings: [0,0,0,0,0] },
    ],
  },
  {
    id: "tour-aug-1502", bookingId: "KP-B2052", title: "Old Town, Easy Pace", date: "15 Aug 2026", time: "14:00–17:00", status: "Starting soon",
    guideId: "KP-G004", guide: "Priya Nair", guests: 5, vehicle: "Accessible Van B", progress: 0,
    modules: [
      { id: "easy-pace-briefing", time: "14:00", title: "Access briefing & introductions", venue: "Ipoh Railway Station", status: "Next", responses: 0, average: 0, ratings: [0,0,0,0,0] },
      { id: "easy-pace-walk", time: "14:30", title: "Easy-pace heritage route", venue: "Ipoh Old Town", status: "Upcoming", responses: 0, average: 0, ratings: [0,0,0,0,0] },
      { id: "easy-pace-coffee", time: "16:15", title: "Accessible coffee stop", venue: "Access Café Ipoh", status: "Upcoming", responses: 0, average: 0, ratings: [0,0,0,0,0] },
    ],
  },
];

export const liveRatingResponses = [
  { id: "R-1001", tourId: "tour-aug-1501", moduleId: "welcome-breakfast", rating: 5, tags: ["Comfortable pace", "Easy to access", "Helpful companion"], comment: "The van pickup and breakfast seating were both very easy for my wheelchair.", submittedAt: "09:42", anonymous: true },
  { id: "R-1002", tourId: "tour-aug-1501", moduleId: "welcome-breakfast", rating: 5, tags: ["Helpful companion", "Enjoyable activity"], comment: "Mei Ling explained the day clearly and checked what support I preferred.", submittedAt: "09:44", anonymous: true },
  { id: "R-1003", tourId: "tour-aug-1501", moduleId: "welcome-breakfast", rating: 4, tags: ["Good rest facilities"], comment: "Accessible toilet was useful. A little more space between tables would help.", submittedAt: "09:45", anonymous: true },
  { id: "R-1004", tourId: "tour-aug-1501", moduleId: "welcome-breakfast", rating: 5, tags: ["Comfortable pace", "Enjoyable activity"], comment: "", submittedAt: "09:47", anonymous: true },
  { id: "R-1005", tourId: "tour-aug-1501", moduleId: "old-town-route", rating: 5, tags: ["Easy to access", "Helpful companion"], comment: "The alternative ramp route worked well and never felt like a lesser experience.", submittedAt: "11:51", anonymous: true },
  { id: "R-1006", tourId: "tour-aug-1501", moduleId: "old-town-route", rating: 4, tags: ["Comfortable pace", "Good rest facilities"], comment: "Would appreciate one more shaded rest point near Concubine Lane.", submittedAt: "11:53", anonymous: true },
  { id: "R-1007", tourId: "tour-aug-1501", moduleId: "old-town-route", rating: 3, tags: ["Needs improvement"], comment: "One pavement section was quite uneven for my walking frame.", submittedAt: "11:55", anonymous: true },
  { id: "R-1008", tourId: "tour-aug-1501", moduleId: "old-town-route", rating: 5, tags: ["Enjoyable activity", "Helpful companion"], comment: "Loved the stories and the group size was just right.", submittedAt: "11:58", anonymous: true },
  { id: "R-1009", tourId: "tour-aug-1501", moduleId: "old-town-route", rating: 5, tags: ["Easy to access"], comment: "", submittedAt: "12:01", anonymous: true },
];
