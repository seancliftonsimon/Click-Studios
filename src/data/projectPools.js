// Project customization pools + budget tiers.
//
// This powers the Greenlight Configurator: the player picks a budget (which
// fixes how many roles/sets/locations/shots the film has), then hand-picks the
// specific items from the pools that are currently unlocked.
//
// Unlocking is tier-based and ordered: each pool is a flat ordered array, and a
// category's "unlocked tier" reveals progressively more of it
// (starter items first, then `STEP` more each time a tier unlocks). Roles are
// scoped per genre; sets / locations / shots are shared across all genres.
//
// Budgets are intentionally fixed for now (no economy/cost yet) — a budget tier
// only determines the SCALE of the project.

export const POOL_STARTER = 6; // items available at tier 0 (brand-new studio)
export const POOL_STEP = 6; // additional items revealed per unlocked tier

export const budgetTiers = [
	{
		id: "low",
		name: "Low Budget",
		emoji: "💵",
		blurb: "A scrappy, focused production.",
		counts: { roles: 2, sets: 1, locations: 2, shots: 5 },
	},
	{
		id: "mid",
		name: "Mid Budget",
		emoji: "💰",
		blurb: "Room to tell a fuller story.",
		counts: { roles: 4, sets: 2, locations: 3, shots: 9 },
	},
	{
		id: "big",
		name: "Big Budget",
		emoji: "💎",
		blurb: "An ambitious, large-scale film.",
		counts: { roles: 6, sets: 4, locations: 5, shots: 14 },
	},
	{
		id: "blockbuster",
		name: "Blockbuster Budget",
		emoji: "🎆",
		blurb: "A sprawling tentpole event.",
		counts: { roles: 9, sets: 6, locations: 8, shots: 20 },
	},
];

export const getBudgetTier = (id) =>
	budgetTiers.find((tier) => tier.id === id) || null;

// Per-genre role pools (ordered: earlier = unlocked sooner). Short, iconic,
// movie-inspired archetypes — broadly useful ones first, niche ones later.
export const rolePools = {
	horror: [
		"Final Girl", "Killer", "Survivor", "Skeptic", "Babysitter", "Sheriff",
		"Ghost", "Demon", "Vampire", "Werewolf", "Witch", "Zombie",
		"Exorcist", "Medium", "Cultist", "Slasher", "Possessed Kid", "Mad Scientist",
		"Caretaker", "Camp Counselor", "Priest", "Hunter", "Drifter", "Recluse",
		"Creepy Twin", "Haunted Doll", "Ghoul", "Shapeshifter", "Banshee", "Doppelganger",
		"Coroner", "Cabin Owner", "Lone Survivor", "Runaway Bride", "Stranger", "Cryptid",
	],
	comedy: [
		"Slacker", "Best Friend", "Boss", "Intern", "Neighbor", "Roommate",
		"Class Clown", "Con Man", "Diva", "Nerd", "Stoner", "Bridesmaid",
		"Groomsman", "Overachiever", "Influencer", "Frenemy", "Wingman", "Mascot",
		"Substitute", "Mall Cop", "Life Coach", "Tourist", "In-Law", "Lottery Winner",
		"Manchild", "Party Animal", "Office Temp", "Foodie", "Matchmaker", "Bad Roommate",
		"Evil Twin", "Cat Lady", "Hype Man", "Karen", "Know-It-All", "Wannabe",
	],
	drama: [
		"Mentor", "Single Parent", "Widow", "Orphan", "Teacher", "Lawyer",
		"Doctor", "Veteran", "Addict", "Immigrant", "Activist", "Coach",
		"Pianist", "Boxer", "Convict", "Whistleblower", "Caregiver", "Heiress",
		"Prodigy", "Runaway", "Nun", "Diplomat", "Journalist", "Therapist",
		"Drifter", "Estranged Son", "Estranged Daughter", "Sponsor", "Patient", "Defector",
		"Poet", "Stepmother", "Foster Kid", "Union Boss", "Hospice Nurse", "Exile",
	],
	action: [
		"Cop", "Soldier", "Spy", "Assassin", "Mercenary", "Hacker",
		"Pilot", "Thief", "Bodyguard", "Sniper", "Detective", "Agent",
		"Vigilante", "Getaway Driver", "Bounty Hunter", "Commando", "Double Agent", "Arms Dealer",
		"Kingpin", "Bomb Tech", "Marshal", "Smuggler", "Operative", "Ex-Con",
		"Hostage", "Warlord", "Henchman", "Mob Boss", "Survivalist", "Rookie",
		"Handler", "Defector", "Ranger", "Saboteur", "Courier", "Enforcer",
	],
};

// Shared (cross-genre) set pool — interiors you build. Everyday rooms first,
// showpiece sets later.
export const setPool = [
	"Living Room", "Kitchen", "Office", "Classroom", "Diner", "Bedroom",
	"Hospital Room", "Courtroom", "Hotel Lobby", "Nightclub", "Library", "Bar",
	"Warehouse", "Penthouse", "Jail Cell", "Interrogation Room", "Church", "Boardroom",
	"Theater", "Ballroom", "Bunker", "Saloon", "Spaceship Bridge", "Haunted House",
	"Lighthouse", "Opera House", "Throne Room", "Cabin", "Art Gallery", "Dive Bar",
	"Locker Room", "Morgue", "Newsroom", "Casino Floor", "Recording Studio", "Operating Room",
	"Dungeon", "Speakeasy", "Greenhouse", "Server Room", "Attic", "Basement",
	"Garage", "Motel Room", "Police Station", "Apartment", "Strip Club", "War Room",
];

// Shared (cross-genre) location pool — exteriors you scout. Common spots first,
// epic landscapes later.
export const locationPool = [
	"Park", "Beach", "City Street", "Rooftop", "Forest", "Lake",
	"Bridge", "Desert", "Highway", "Cemetery", "Boardwalk", "Cliffside",
	"Canyon", "Waterfall", "Island", "Jungle", "Ruins", "Train Station",
	"Airport", "Mall", "Town Square", "Alley", "Cornfield", "Hot Springs",
	"Glacier", "Volcano", "Old Town", "Junkyard", "Pier", "Harbor",
	"Suburb", "Gas Station", "Drive-In", "Quarry", "Swamp", "Vineyard",
	"Ski Slope", "Subway Platform", "Stadium", "Battlefield", "Border Crossing", "Oil Rig",
	"Riverbank", "Mountain Pass", "Parking Lot", "Rooftop Helipad", "Crosswalk", "Rest Stop",
];

// Shared (cross-genre) shot pool — staple coverage first, flashy moves later.
export const shotPool = [
	"Establishing", "Close-Up", "Wide", "Medium", "Over-the-Shoulder", "Tracking",
	"Two-Shot", "POV", "Low Angle", "High Angle", "Dutch Angle", "Aerial",
	"Crane", "Dolly Zoom", "Handheld", "Steadicam", "Rack Focus", "Long Take",
	"Insert", "Reaction", "Master", "Bird's Eye", "Whip Pan", "Match Cut",
	"Jump Cut", "Silhouette", "Time-Lapse", "Split Screen", "Extreme Close-Up", "Reverse Angle",
	"Slow Motion", "Freeze Frame", "Tilt", "Pan", "Zoom", "Oner",
	"Cutaway", "Montage", "Push-In", "Pull-Out", "Top-Down", "Tracking In",
];

// Returns the slice of `pool` unlocked at the given tier (0-based).
export const unlockedSlice = (pool, tier) =>
	pool.slice(0, POOL_STARTER + Math.max(0, tier) * POOL_STEP);

// Highest tier index that still reveals new items for a pool. Past this,
// "unlock next" is a no-op (everything is already available).
export const maxTier = (pool) =>
	Math.max(0, Math.ceil((pool.length - POOL_STARTER) / POOL_STEP));

export const categoryMeta = {
	roles: { label: "Roles", emoji: "🎭", scope: "genre" },
	sets: { label: "Sets", emoji: "🏗️", scope: "all" },
	locations: { label: "Locations", emoji: "📍", scope: "all" },
	shots: { label: "Shots", emoji: "🎬", scope: "all" },
};
