import { createStore } from "vuex";

export default createStore({
	state: {
		studioName: "Click Studios",

		// Phase Unlocks
		isPreproductionUnlocked: true,
		isFilmingUnlocked: true,
		isPostproductionUnlocked: false,
		isMarketingUnlocked: false,
		isReleaseUnlocked: false,

		// Word Variables
		wordCount: 0,
		wordsPerSecond: 0,
		totalWordCount: 0,

		wordAccumulator: 0,
		lastUpdate: 0,

		// Dollar Variables
		writingDollarCount: 0,
		totalWritingDollarCount: 0,

		preproDollarCount: 0,
		totalPreproDollarCount: 0,

		// I should put the wpS value above in a compute function later probably

		popups: {
			tutorialOne: {
				title: "Name Your Studio",
				emoji: "✨",
				text: "Thanks for trying out my game! \n\n Name your studio to begin:",
				inputField: true,
				buttonType: "next",
				nextPopup: "introduction",
				inputTarget: "studioName",
			},
			introduction: {
				title: "Welcome to Hollywood!",
				emoji: "🎟️",
				text: "Congratulations on starting your film studio! \n\n Fame and fortune await, but the journey begins with Writing. \n \n Sell your ideas to other studios until you're ready to make your own scripts!",
			},
			writingTool: {
				title: "🔓 Writing Tool Upgrade",
				emoji: "✒️",
				text: "They say the pen is mightier than the sword -- so it's definitely mightier than the pencil! \n\n You can now upgrade your tool to write more words per click!",
			},
			synopsis: {
				title: "🔓 Synopses",
				emoji: "💭",
				text: "A synopsis condenses your script's plot into a brief overview. \n\n It can be sold for more money per word.",
			},
			outline: {
				title: "🔓 Outlines",
				emoji: "📋",
				text: "An outline lays out the main events of your script in sequence. \n\n Selling an outline earns more money per word.",
			},
			treatment: {
				title: "🔓 Treatments",
				emoji: "🗒️",
				text: "A treatment provides a detailed story plan, including character arcs and plot points. \n\n Treatments fetch higher prices per word.",
			},
			draftScript: {
				title: "🔓 Draft Scripts",
				emoji: "📑",
				text: "Every great screenplay starts with a first draft. \n\n These are quite valuable, but not enough on their own to greenlight a movie.",
			},
			shootingScript: {
				title: "🔓 Shooting Scripts",
				emoji: "📒",
				text: "It can take dozens of revisions -- and millions of words written -- to arrive at a script ready for shooting. \n\n Once you've completed a shooting script, you can greenlight the project and move into preproduction!",
			},
			writersRoom: {
				title: "🔓 Writers Room",
				emoji: "🙋",
				text: "You've unlocked the Writers Room! \n\n Here, writers will automatically write words for you for the duration of their hire. \n\n To start, you can hire interns for short stints at inexpensive rates.",
			},
			juniorWriters: {
				title: "🔓 Junior Writers",
				emoji: "🧑‍💻️",
				text: "Junior Writers are newcomers to the industry, offering fresh ideas. \n\n They write faster and can be hired for longer periods.",
			},
			screenwriters: {
				title: "🔓 Screenwriters",
				emoji: "🧑‍💼",
				text: "Screenwriters are skilled in crafting compelling narratives. \n\n They work quickly and are available for extended contracts.",
			},
			cowriters: {
				title: "🔓 Co-writers",
				emoji: "👥",
				text: "Co-writers collaborate on projects, bringing diverse perspectives. \n\nThey enhance writing speed and offer prolonged engagement.",
			},
			scriptDoctors: {
				title: "🔓 Script Doctors",
				emoji: "👩‍⚕️",
				text: "Script Doctors work differently! \n\n They specialize in polishing and refining screenplays. \n\n They won't write words themselves, but can significantly boost your other writers productivity.",
			},
			changeGenre: {
				title: "🔓 Change Genre",
				emoji: "🔄",
				text: "The more experience you have in a genre, the better quality those scripts will be. \n\n Switch between genres for a wide-ranging slate of movies, or double down on your favorite!",
			},
			writersRoomCapacityUpgrade: {
				title: "🔓 Writers Room Capacity Upgrade",
				emoji: "🪑",
				text: "Expand your Writers Room to accommodate more talent. \n\n Larger teams lead to faster project development.",
			},
			newScript: {
				title: "New Script!",
				emoji: "",
				text: "",
			},
			scriptDetails: {
				title: "Film Named!",
				emoji: "📒",
				text: "",
			},
		},

		currentPopup: null,
		popupVisible: false,

		scriptDescription: "No script.",
		roleDescription: "No roles.",
		milestones: {
			fiveLoglines: false,
			fiveSynopses: false,
			fiveOutlines: false,
			fiveTreatments: false,
			fiveDraftScripts: false,
			firstShootingScript: false,
			fiveInterns: false,
			fiveJuniors: false,
			fiveScreenwriters: false,
			fiveCowriters: false,
			fiftyWords: false,
			genreLevelTwo: false,
			sixtyDollars: false,
			threeWorkers: false,
			secondWritersRoomUpgrade: false,
		},
		writeTools: {
			pencil: {
				name: "Pencil",
				emoji: "✍️",
				wordsPerClick: 1,
				cost: 0,
			},
			pen: {
				name: "Pen",
				emoji: "🖊️",
				wordsPerClick: 2,
				cost: 18,
			},
			typewriter: {
				name: "Typewriter",
				emoji: "📃",
				wordsPerClick: 8,
				cost: 200,
			},
			wordprocessor: {
				name: "Word Processor",
				emoji: "⌨️",
				wordsPerClick: 16,
				cost: 800,
			},
			aimodel: {
				name: "AI Model",
				emoji: "🤖",
				wordsPerClick: 60,
				cost: 2400,
			},
			supercomputer: {
				name: "Supercomputer",
				emoji: "🌐",
				wordsPerClick: 2000,
				cost: 26000,
			},
			end: {
				name: "End",
				emoji: "",
				wordsPerClick: 0,
				cost: 0,
			},
			// Add more tools as needed
		},
		currentWriteTool: "pen", // Default write tool available for purchase
		writingToolCardVisible: false,
		// Pools
		pools: {
			shots: [
				"Aerial",
				"B-Roll",
				"Bird’s Eye View",
				"Bokeh",
				"Close-up",
				"Crane",
				"Cutaway",
				"Dolly Zoom",
				"Dutch Angle",
				"Establishing",
				"Extra-wide",
				"Extreme Close-up",
				"Handheld",
				"High Angle",
				"Interior",
				"Jib",
				"Long Take",
				"Low Angle",
				"Master",
				"Medium",
				"Oner",
				"Over-the-shoulder",
				"Overhead",
				"Panning",
				"Pedestal",
				"POV",
				"Rack Focus",
				"Reverse Angle",
				"SnorriCam",
				"Steadicam",
				"Tilt",
				"Tracking",
				"Two-shot",
				"Wide",
				"Slider",
				"Whip Pan",
				"Match Cut",
				"Jump Cut",
				"Insert",
				"Silhouette",
				"Time-lapse",
				"Freeze Frame",
				"Pull-Out",
				"Push-In",
				"Split Screen",
				"Depth of Field",
				"Canted Angle",
				"Reaction",
				"Sequence",
				"360",
				"Point of Interest",
			],
			sets: [
				"Airport",
				"Art Gallery",
				"Backstage",
				"Bedroom",
				"Bridge",
				"Castle",
				"Cemetery",
				"Coffee Shop",
				"Courtroom",
				"Downtown Street",
				"Factory",
				"Farm",
				"Greenhouse",
				"Gym",
				"Harbor",
				"Hospital",
				"Hotel Lobby",
				"Ice Rink",
				"Jazz Club",
				"Library",
				"Mall",
				"Mountain Cabin",
				"Museum",
				"Nightclub",
				"Office",
				"Old Mansion",
				"Planetarium",
				"Restaurant",
				"Rooftop",
				"School",
				"Ski Resort",
				"Subway Station",
				"Traincar",
				"Vineyard",
				"Aquarium",
				"Attic",
				"Boardroom",
				"Bookstore",
				"Botanical Garden",
				"Brewery",
				"Church",
				"Circus",
				"Rooftop",
				"Construction Site",
				"Diner",
				"Dive Bar",
				"Dorm Room",
				"Elevator",
				"Ferry Boat",
				"Fire Station",
				"Garage",
				"Haunted House",
				"Lighthouse",
				"Locker Room",
				"Monastery",
				"Opera House",
				"Palace",
				"Penthouse",
				"Prison Cell",
				"Recording Studio",
				"Saloon",
				"Space Station",
				"Stadium",
				"Temple",
				"Theater",
				"Bunker",
				"Warehouse",
				"Winery",
				"Art Studio",
				"Bakery",
				"Ballroom",
				"Bank",
				"Barn",
				"Basement",
				"Bathroom",
				"Bistro",
				"Boathouse",
				"Boxing Ring",
				"Bridge Underpass",
				"Broadcast Studio",
				"Bungalow",
				"Bus Station",
				"Cafeteria",
				"Candy Store",
				"Car Dealership",
				"Car Wash",
				"Castle Tower",
				"Catacombs",
				"Cattle Farm",
				"Cave Entrance",
				"Cemetery Crypt",
				"Chalet",
				"Chapel",
				"Chess Club",
				"Chicken Coop",
				"Children's Hospital",
				"Cinema",
				"Closet",
			],
			locations: [
				"Beach",
				"Bridge",
				"Campground",
				"Desert",
				"Forest",
				"Highway",
				"Lake",
				"Mountain Cabin",
				"Park",
				"Vineyard",
				"Cave",
				"Country Road",
				"Island",
				"Jungle",
				"Ranch",
				"Ruins",
				"Beach House",
				"Bluff",
				"Boardwalk",
				"Canal",
				"Canyon",
				"Cliffside",
				"College Campus",
				"Bayou",
				"Botanic Garden",
				"Cabin",
				"Riverbank",
				"Meadow",
				"Waterfall",
				"Volcano",
				"Glacier",
				"Marshland",
				"Sand Dunes",
				"Lava Field",
				"Prairie",
				"Fjord",
				"Oasis",
				"Delta",
				"Savanna",
				"Tundra",
				"Alpine Lodge",
				"Hot Springs",
				"Gorge",
				"Plateau",
				"Steppe",
				"Coral Reef",
				"Mangrove Forest",
				"Bamboo Forest",
				"Salt Flats",
				"Sunflower Field",
				"Village Square",
				"Old Town",
				"Old Dockyard",
				"Moors",
				"Valley",
				"Orchard",
				"Skyscraper",
				"Suburbs",
				"Town Hall",
				"City Park",
				"Opera House",
				"Campus",
				"Art Museum",
				"Library",
				"Cathedral",
				"Shopping Mall",
				"Train Station",
				"Airport Terminal",
				"Sports Arena",
				"Theatre",
				"High-rise",
				"Warehouse ",
				"Industrial Park",
				"Convention Center",
				"City Square",
				"Historical Monument",
				"Docklands",
				"Metro Station",
				"Business District",
				"Luxury Hotel",
				"Pedestrian Street",
				"Gothic Quarter",
				"Financial Center",
				"Urban Alley",
				"Rooftop Garden",
				"Abandoned Factory",
			],
			costumes: [
				"Gown",
				"Uniform",
				"Ski Suit",
				"Firefighter's Uniform",
				"Pajamas",
				"Space Suit",
				"Medieval Armor",
				"Victorian Dress",
				"Pirate Outfit",
				"Superhero Costume",
				"Trench Coat",
				"Flapper Dress",
				"Cowboy Outfit",
				"Ninja Attire",
				"Astronaut Suit",
				"Samurai Armor",
				"Diving Suit",
				"Wizard Robes",
				"Viking Garb",
				"Poodle Skirt",
				"Steampunk Outfit",
				"Gladiator Armor",
				"Ballroom Gown",
				"Ballet Costume",
				"Disco Outfit",
				"Military Camouflage",
				"Lab Coat",
				"Chef's Uniform",
				"Flight Attendant Uniform",
				"Wedding Dress",
				"Toga",
				"Egyptian Pharaoh Robe",
				"Knight's Armor",
				"Punk Rock Outfit",
				"Clown Costume",
				"Jumpsuit",
				"Kimono",
				"Lederhosen",
				"Monk's Robes",
				"Nun's Habit",
				"Police Uniform",
				"Driver Suit",
				"Scuba Gear",
				"Soccer Uniform",
				"Tennis Outfit",
				"Vampire Costume",
				"Alien Costume",
				"Angel Wings",
				"Cheerleader Uniform",
				"Jumpsuit",
				"Royal Robe",
				"Lab Uniform",
				"Mime Outfit",
				"Mummy Wraps",
				"Peasant Outfit",
				"Pilgrim Outfit",
				"Sailor Suit",
				"Santa Claus Suit",
				"School Uniform",
				"Scottish Kilt",
				"Tudor Gown",
				"Heavy Jacket",
				"Sundress",
				"Sweatpants",
				"Cardigan",
				"Denim Jeans",
				"Polo Shirt",
				"Leather Jacket",
				"Chinos",
				"Maxi Skirt",
				"Cargo Pants",
				"Tank Top",
				"Linen Shirt",
				"Velvet Blazer",
				"Knit Sweater",
				"Tulle Skirt",
				"Flannel Shirt",
				"High-Waisted Shorts",
				"Bodysuit",
				"Puffer Vest",
				"Silk Blouse",
				"Corduroy Trousers",
				"Graphic Tee",
				"Ballet Flats",
				"Pencil Skirt",
				"Capri Pants",
				"Hooded Sweatshirt",
				"Mock Turtleneck",
				"Romper",
				"Pea Coat",
				"Leggings",
				"Button-Down Shirt",
				"Chambray Dress",
				"Fisherman's Sweater",
				"Joggers",
				"Espadrilles",
				"Wrap Dress",
				"Culottes",
				"Bomber Jacket",
				"Ankle Boots",
			],
			looks: [
				"Glamour Makeup",
				"Beehive Hair",
				"Bruised Cheek",
				"Bald Cap",
				"Bob Wig",
				"Fake Scar",
				"Smokey Eye Makeup",
				"Mohawk",
				"Sunburn Makeup",
				"Neon Eye Shadow",
				"French Twist",
				"Gothic Makeup",
				"Dreadlocks",
				"Old Age Makeup",
				"Finger Waves",
				"Clown Makeup",
				"Buzz Cut",
				"Airbrushed Makeup",
				"Undercut",
				"Zombie Makeup",
				"Cornrows",
				"Metallic Lipstick",
				"Natural Hair",
				"Vampire Makeup",
				"Mullet",
				"Cat Eye Liner",
				"Faux Hawk",
				"SFX Prosthetics",
				"Pixie Cut",
				"Salt and Pepper Wig",
				"Punk Makeup",
				"Ombre Hair",
				"Glitter Makeup",
				"Sideburns",
				"Natural Makeup",
				"High Ponytail",
				"Burn Makeup",
				"Silicone Wound",
				"Futuristic Makeup",
				"Braided Updo",
				"Warrior Marks",
				"Bowl Cut",
				"Perm",
				"Pale Makeup",
				"Quiff",
				"Contouring",
				"Shag Hair",
				"Freckles",
				"Pompadour",
				"Tattoo Cover-Up",
				"Beachy Waves",
				"Drag Makeup",
				"Gory Wound Makeup",
				"Retro Makeup",
				"Wet Look Hair",
				"Alien Makeup",
				"Fishtail Braid",
				"Cyberpunk Makeup",
			],
			smallInvestors: [
				"Penny Spendwell",
				"Elvis Quarterman",
				"Sean Simoleon",
				"Nick L. Endime",
				"Eleanor Plentycents",
				"Macon Green",
				"Bette Sheesflusch",
				"Francis Dollarhyde",
				"Quincy Quarterman",
				"Patsy Pence",
				"Cora Minte",
				"Chuck Change",
				"Owen Priceman",
				"Frankie Fiverly",
				"Tina Tennerson",
				"Sally Centavo",
				"Imelda Glamheel",
				"Petra Pesobeso",
				"Zainab Deenar",
				"Ron Minbee",
			],
		},
		// RANGES
		ranges: {
			roleAmount: [2, 5],
			shotAmount: [5, 15],
			locationAmount: [3, 11],
			setAmount: [2, 8],
			investorSearchAmount: [100, 500],
			investorPitchAmount: [100, 500],
			smallInvestorPayAmount: [2000, 10000],
		},

		// Genre Variables
		currentTitle: "Tomorrow's Tears",
		currentGenre: "drama", // Default genre (for now)
		genres: {
			horror: {
				name: "Horror",
				emoji: "😱",
				level: 1,
				wordsNeeded: 100,
				quality: 1,
				roles: [
					"Alien",
					"Babysitter",
					"Beast",
					"Clairvoyant",
					"Copycat Killer",
					"Cryptid",
					"Cultist",
					"Cursed One",
					"Dark Magic Priest",
					"Demon",
					"Detective",
					"Exorcist",
					"Final Girl",
					"Fugitive",
					"Ghost",
					"Ghoul",
					"Gravekeeper",
					"Healer",
					"Hermit",
					"Hunter",
					"Mad Scientist",
					"Medium",
					"Mummy",
					"Mutant",
					"Nurse",
					"Occultist",
					"Paranormal Investigator",
					"Phantom",
					"Poltergeist",
					"Recluse",
					"Serial Killer",
					"Shape-shifter",
					"Siren",
					"Skeptic",
					"Sorcerer",
					"Survivor",
					"Vampire",
					"Victim",
					"Werewolf",
					"Witch",
					"Zombie",
				],
			},
			comedy: {
				name: "Comedy",
				emoji: "🤣",
				level: 1,
				wordsNeeded: 100,
				quality: 1,
				roles: [
					"Boss",
					"Busybody",
					"Cat Lady",
					"Chef",
					"Conspiracy Theorist",
					"Creep",
					"Diva",
					"Dreamer",
					"Ex-boyfriend",
					"Ex-girlfriend",
					"Fashionista",
					"Gamer",
					"Goofball",
					"Grump",
					"Guru",
					"Hipster",
					"Imposter",
					"Intern",
					"Inventor",
					"Journalist",
					"Kid Genius",
					"Klutz",
					"Magician",
					"Matchmaker",
					"Neighbor",
					"Nerd",
					"Overachiever",
					"Prankster",
					"Psychic",
					"Retiree",
					"Roommate",
					"Schemer",
					"Slacker",
					"Snob",
					"Socialite",
					"Stoner",
					"Tourist",
					"Town Gossip",
					"Twin",
					"Tycoon",
					"Vlogger",
				],
			},
			drama: {
				name: "Drama",
				emoji: "🥲",
				level: 1,
				wordsNeeded: 100,
				quality: 1,
				roles: [
					"Activist",
					"Artist",
					"Babysitter",
					"Baron",
					"Brother",
					"Caregiver",
					"Composer",
					"Con Artist",
					"Dancer",
					"Debutante",
					"Diplomat",
					"Divorcee",
					"Envoy",
					"Executive",
					"Fugitive",
					"Godparent",
					"Heiress",
					"Homeless Person",
					"Immigrant",
					"Journalist",
					"Lawyer",
					"Lobbyist",
					"Mentor",
					"Musician",
					"Nomad",
					"Orphan",
					"Philanthropist",
					"Poet",
					"Priest",
					"Prodigy",
					"Rebel",
					"Refugee",
					"Reporter",
					"Sister",
					"Social Worker",
					"Step-parent",
					"Survivor",
					"Teacher",
					"Therapist",
					"Veteran",
					"Widow",
				],
			},
			action: {
				name: "Action",
				emoji: "😎",
				level: 1,
				wordsNeeded: 100,
				quality: 1,
				roles: [
					"Accomplice",
					"Arms Dealer",
					"Assassin",
					"Bodyguard",
					"Bounty Hunter",
					"Burglar",
					"CIA Agent",
					"Commando",
					"Conspirator",
					"Cop",
					"Coroner",
					"Deserter",
					"Double Agent",
					"Escape Artist",
					"Fighter Pilot",
					"Gang Leader",
					"Gladiator",
					"Guard",
					"Gun Runner",
					"Hacker",
					"Interrogator",
					"KGB Agent",
					"Martial Artist",
					"Mercenary",
					"MI6 Agent",
					"Ninja",
					"Parole Officer",
					"Pilot",
					"President",
					"Private Investigator",
					"Rebel Leader",
					"Scientist",
					"Secret Service Agent",
					"Security Guard",
					"Smuggler",
					"Sniper",
					"Soldier",
					"Spy Master",
					"Terrorist",
					"Thief",
					"Undercover Agent",
					"Warrior",
				],
			},
		},
		switchGenreVisible: false,
		levelCaps: [
			0, 100, 600, 1000, 2200, 4700, 10300, 22400, 48600, 105700, 229900,
			500000,
		],

		// Writers Room and Worker Variables
		writersRoomCapacities: [
			{ capacity: 0, cost: 0 },
			{ capacity: 3, cost: 30 },
			{ capacity: 5, cost: 90 },
			{ capacity: 9, cost: 270 },
			{ capacity: 16, cost: 810 },
			{ capacity: 25, cost: 2430 },
			{ capacity: 35, cost: 7290 },
			{ capacity: 48, cost: 21870 },
			{ capacity: 63, cost: 65610 },
			{ capacity: 80, cost: 196830 },
			{ capacity: 100, cost: 590490 },
		],
		writersRoomVisible: false,
		currentCapacityIndex: 1, // Keeps track of the current capacity level

		writersRoomUpgradeVisible: false,
		workers: {
			scriptDoctor: {
				name: "Script Doctor",
				count: 0,
				totalcount: 0,
				cost: 24000,
				wps: 0,
				duration: 120,
				emoji: "👩‍⚕️",
				effect: 1.4,
				visible: false,
			},
			intern: {
				name: "Intern",
				count: 0,
				totalcount: 0,
				cost: 25,
				wps: 1,
				duration: 0.5,
				emoji: "🙋",
				visible: false,
			},
			junior: {
				name: "Junior",
				count: 0,
				totalcount: 0,
				cost: 70,
				wps: 5,
				duration: 1,
				emoji: "🧑‍💻",
				visible: false,
			},
			screenwriter: {
				name: "Screenwriter",
				count: 0,
				totalcount: 0,
				cost: 200,
				wps: 15,
				duration: 5,
				emoji: "🧑‍💼",
				visible: false,
			},
			cowriters: {
				name: "Cowriters",
				count: 0,
				totalcount: 0,
				cost: 1400,
				wps: 70,
				duration: 15,
				emoji: "👥",
				visible: false,
			},
		},
		products: {
			logline: {
				title: "Logline",
				emoji: "💡",
				text: "Earn $6",
				cost: 20,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 6,
				visible: true,
			},
			synopsis: {
				title: "Synopsis",
				emoji: "💭",
				text: "Earn $40",
				cost: 120,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 40,
				visible: false,
			},
			outline: {
				title: "Outline",
				emoji: "📋",
				text: "Earn $220",
				cost: 800,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 320,
				visible: false,
			},
			treatment: {
				title: "Treatment",
				emoji: "🗒️",
				text: "Earn $1,200",
				cost: 5000,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 2200,
				visible: false,
			},
			draftScript: {
				title: "Draft Script",
				emoji: "📑",
				text: "Earn $3,000",
				cost: 30000,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 15000,
				visible: false,
			},
			shootingScript: {
				title: "Shooting Script",
				emoji: "📒",
				text: "Greenlight your project.",
				cost: 1000000,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 150000,
				visible: false,
			},
		},
		currentWorkers: [],

		currentScript: {
			title: "",
			roles: [],
			shots: [],
			sets: [],
			locations: [],
			costumes: [],
			looks: [],
		},

		activeDialog: null,

		showDialog: false,

		// Pitching Values

		searchesNeeded: 30,

		manualSearchAmount: 4,

		searchesPerSecond: 0,

		pitchesNeeded: 20,

		manualPitchAmount: 3,

		pitchesPerSecond: 0,

		currentInvestor: "",

		currentInvestment: 0,

		searcherCount: 0,
		pitcherCount: 0,
		searcherSpeed: 3,
		pitcherSpeed: 3,

		//PrePro Progress Values

		employeeCount: 0,

		unassignedEmployeeCount: 0,

		inspiration: 0,
	},
	getters: {
		wordCount: (state) => {
			return state.wordCount;
		},
		wordsPerSecond: (state) => {
			let scriptDoctorMultiplier = 1.0; // Start with a base multiplier
			let baseWordsPerSecond = 0; // Base WPS without Script Doctor

			Object.values(state.workers).forEach((worker) => {
				if (worker.name === "Script Doctor" && worker.count > 0) {
					// For each Script Doctor, multiply the current multiplier by 1.4
					scriptDoctorMultiplier *= Math.pow(worker.effect, worker.count);
				} else {
					// Sum the WPS of other workers
					baseWordsPerSecond += worker.count * worker.wps;
				}
			});

			// Apply the Script Doctor multiplier to the base WPS
			const adjustedWordsPerSecond =
				baseWordsPerSecond * scriptDoctorMultiplier;

			return adjustedWordsPerSecond;
		},
		writingDollarCount: (state) => {
			return state.writingDollarCount;
		},

		preproDollarCount: (state) => {
			return state.preproDollarCount;
		},

		//currentScript Getters for Prepro
		// Script Details
		scriptRoles: (state) => state.currentScript.roles,
		actorGoal: (state) => state.currentScript.roles.length,
		scriptShots: (state) => state.currentScript.shots,
		shotGoal: (state) => state.currentScript.shots.length,
		scriptSets: (state) => state.currentScript.sets,
		setGoal: (state) => state.currentScript.sets.length,
		scriptLocations: (state) => state.currentScript.locations,
		locationGoal: (state) => state.currentScript.locations.length,
		scriptCostumes: (state) => state.currentScript.costumes,
		costumeGoal: (state) => state.currentScript.costumes.length,
		scriptLooks: (state) => state.currentScript.looks,
		lookGoal: (state) => state.currentScript.looks.length,
		currentTitle: (state) => state.currentScript.title,

		// Roles
		totalRoles(state) {
			// Check if currentScript and its roles array exist, then return its length
			if (state.currentScript && Array.isArray(state.currentScript.roles)) {
				return state.currentScript.roles.length;
			}
			// Default to 0 if currentScript or roles array is not properly defined
			return 0;
		},
		completeRolesCount(state) {
			if (state.currentScript && Array.isArray(state.currentScript.roles)) {
				return state.currentScript.roles.filter((role) => role.isCast).length;
			}
			return 0;
		},
		// Sets
		builtSetsCount: (state) =>
			state.currentScript.sets.filter((set) => set.isBuilt).length,

		// Locations
		scoutedLocationsCount: (state) =>
			state.currentScript.locations.filter((location) => location.isScouted)
				.length,

		// Camera Shots
		completeShotsCount: (state) =>
			state.currentScript.shots.filter((shot) => shot.isPlanned).length,

		// Looks
		styledLooksCount: (state) =>
			state.currentScript.looks.filter((look) => look.isDesigned).length,

		// Costumes
		madeCostumesCount: (state) =>
			state.currentScript.costumes.filter((costume) => costume.isMade).length,

		currentGenreDetails: (state) => {
			return state.genres[state.currentGenre] || {};
		},
		currentToolDetails: (state) => {
			return state.writeTools[state.currentWriteTool];
		},
		previousToolDetails: (state) => {
			const toolKeys = Object.keys(state.writeTools);
			const currentToolIndex = toolKeys.indexOf(state.currentWriteTool);
			if (currentToolIndex <= 0) {
				// If there is no previous tool, return null or another appropriate value
				return null;
			}
			const previousToolIndex = currentToolIndex - 1;
			return state.writeTools[toolKeys[previousToolIndex]];
		},

		getProductCardDetails: (state) => (key) => {
			return state.products[key];
		},
		getWorkerDetails: (state) => (key) => {
			return state.workers[key];
		},
		currentWritersRoomCapacity: (state) => {
			return state.writersRoomCapacities[state.currentCapacityIndex].capacity;
		},
		currentWorkerAmount: (state) => {
			return state.currentWorkers.length;
		},
		nextWritersRoomUpgrade: (state) => {
			const nextIndex = state.currentCapacityIndex + 1;
			if (nextIndex < state.writersRoomCapacities.length) {
				return state.writersRoomCapacities[nextIndex];
			}
			return null; // Indicates there are no more upgrades available
		},

		currentPopupContent: (state) => {
			if (state.currentPopup && state.popups[state.currentPopup]) {
				return state.popups[state.currentPopup];
			}
			return { title: "", emoji: "", text: "" };
		},

		// Phase Unlocks
		isPreproductionUnlocked: (state) => state.isPreproductionUnlocked,
		isFilmingUnlocked: (state) => state.isFilmingUnlocked,
		isPostproductionUnlocked: (state) => state.isPostproductionUnlocked,
		isMarketingUnlocked: (state) => state.isMarketingUnlocked,
		isReleaseUnlocked: (state) => state.isReleaseUnlocked,
		switchGenreVisible: (state) => state.switchGenreVisible,
		popupVisible: (state) => state.popupVisible,
		studioName: (state) => state.studioName,
		scriptDescription: (state) => state.scriptDescription,

		writersRoomUpgradeVisible: (state) => state.writersRoomUpgradeVisible,

		// Pitching Getters
		manualSearchAmount: (state) => state.manualSearchAmount,
		searchRange: (state) => state.ranges.investorSearchAmount,
		searchCount: (state) => state.searchCount,
		searchesPerSecond: (state) => state.searchesPerSecond,
		smallInvestorNames: (state) => state.pools.smallInvestors,
		smallInvestorPayRange: (state) => state.ranges.smallInvestorPayAmount,
		currentInvestor: (state) => state.currentInvestor,
		currentInvestment: (state) => state.currentInvestment,

		manualPitchAmount: (state) => state.manualPitchAmount,
		pitchRange: (state) => state.ranges.investorPitchAmount,
		pitchesNeeded: (state) => state.pitchesNeeded,
		pitchCount: (state) => state.pitchCount,
		pitchesPerSecond: (state) => state.pitchesPerSecond,

		// Employee Getters
		employeeCount: (state) => state.employeeCount,
		unassignedEmployeeCount: (state) => state.unassignedEmployeeCount,

		searcherCount: (state) => state.searcherCount,
		pitcherCount: (state) => state.pitcherCount,
		searcherSpeed: (state) => state.searcherSpeed,
		pitcherSpeed: (state) => state.pitcherSpeed,

		inspiration: (state) => state.inspiration,
	},
	mutations: {
		UPDATE_STATE_VARIABLE(state, { key, value }) {
			// Logic here to travel down nested paths as indicated by the key string
			const keys = key.split("."); // Split the key by periods
			let obj = state;
			for (let i = 0; i < keys.length - 1; i++) {
				if (!obj[keys[i]]) return; // Exit if the path is invalid
				obj = obj[keys[i]];
			}
			if (Object.prototype.hasOwnProperty.call(obj, keys[keys.length - 1])) {
				obj[keys[keys.length - 1]] = value; // Set the value to the last key in the path
			}
		},

		SET_NEXT_WRITE_TOOL(state, nextToolKey) {
			state.currentWriteTool = nextToolKey;
		},
		SET_CURRENT_GENRE(state, genre) {
			state.currentGenre = genre;
		},
		UPDATE_GENRE_PROGRESS(state, { genre, words }) {
			let genreObject = state.genres[genre];
			genreObject.wordsNeeded -= words;

			// Continue to level up as long as there are excess words and not at max level
			while (
				genreObject.wordsNeeded <= 0 &&
				genreObject.level < state.levelCaps.length
			) {
				let excessWords = Math.abs(genreObject.wordsNeeded);
				genreObject.level++;
				// Check if next level exists, otherwise set wordsNeeded to 0
				if (genreObject.level < state.levelCaps.length) {
					genreObject.wordsNeeded =
						state.levelCaps[genreObject.level - 1] - excessWords;
				} else {
					genreObject.wordsNeeded = 0;
				}
				genreObject.quality = 1 + (genreObject.level - 1) * 0.22;
			}
		},

		SET_CURRENT_POPUP(state, popupKey) {
			state.currentPopup = popupKey;
		},

		SET_POPUP_VISIBLE(state, isVisible) {
			state.popupVisible = isVisible;
		},

		// See if I can change the script thing so that it uses the set current popup system I'm trying to implement universally.
		TOGGLE_DIALOG(state, show) {
			state.showDialog = show;
		},
		// DOES THIS NEED TO STAY? AM I USING IT ANYWHERE?
		SET_ACTIVE_DIALOG(state, dialogName) {
			state.activeDialog = dialogName;
		},

		// Dollars and Words and Variables Such as Those
		INCREASE_WORD_COUNT(state, amt) {
			state.wordCount += amt;
		},
		DECREASE_WORD_COUNT(state, cost) {
			state.wordCount -= cost;
		},
		INCREASE_WRITING_DOLLAR_AMOUNT(state, pay) {
			state.writingDollarCount += pay;
		},
		DECREASE_WRITING_DOLLAR_AMOUNT(state, cost) {
			state.writingDollarCount -= cost;
		},
		INCREASE_PREPRO_DOLLAR_AMOUNT(state, pay) {
			state.preproDollarCount += pay;
		},
		DECREASE_PREPRO_DOLLAR_AMOUNT(state, cost) {
			state.preproDollarCount -= cost;
		},

		SET_WORDS_PER_CLICK(state, wordsPerClick) {
			state.wordsPerSecond = wordsPerClick;
		},
		ADD_PLAYER_SCRIPT(state, script) {
			state.uniqueScripts.push(script);
		},
		ADD_WORKER(state, { workerType, id }) {
			state.currentWorkers.push({ workerType, id });
			state.workers[workerType].count++;
			state.workers[workerType].totalcount++;
		},
		REMOVE_WORKER(state, { workerType, id }) {
			state.currentWorkers = state.currentWorkers.filter(
				(worker) => worker.id !== id
			);
			state.workers[workerType].count--;
		},
		UPGRADE_WRITERS_ROOM_CAPACITY(state) {
			state.currentCapacityIndex += 1;
		},

		// Mutation to mark a milestone as achieved
		SET_MILESTONE_ACHIEVED(state, milestoneKey) {
			state.milestones[milestoneKey] = true;
		},

		// Mutation to toggle component visibility
		TOGGLE_COMPONENT_VISIBILITY(state, componentName) {
			if (state.products[componentName]) {
				state.products[componentName].visible =
					!state.products[componentName].visible;
			}
			if (state.workers[componentName]) {
				state.workers[componentName].visible =
					!state.workers[componentName].visible;
			} else {
				return;
			}
		},

		// Mutation to add script to list
		ADD_SCRIPT(state, script) {
			// Directly setting the currentScript with the provided script object
			state.currentScript = script;
			console.log(script);

			// Utilizing the script description constructed in the action
			state.scriptDescription = script.description;

			// Updating the newScriptPopup with details from the currentScript
			state.popups.newScript = {
				title: `New ${script.genre} Script`,
				emoji: "🎉",
				text: script.roleDescription,
				inputField: true,
				buttonType: "next",
				nextPopup: "scriptDetails",
				inputTarget: "currentScript.title",
			};
			state.popups.scriptDetails = {
				text: state.scriptDescription,
			};
		},

		//Pitching Mutations

		SET_SEARCH_COUNT(state, newValue) {
			state.searchCount = newValue;
		},
		SET_PITCH_COUNT(state, newValue) {
			state.pitchCount = newValue;
		},

		// Employee Mutations

		HIRE_EMPLOYEE(state, amt) {
			state.employeeCount += amt;
			state.unassignedEmployeeCount += amt;
		},

		ASSIGN_EMPLOYEE(state, amt) {
			state.unassignedEmployeeCount -= amt;
		},

		UNASSIGN_EMPLOYEE(state, amt) {
			state.unassignedEmployeeCount += amt;
		},

		INCREASE_INSPIRATION(state, amt) {
			state.inspiration += amt;
		},

		DECREASE_INSPIRATION(state, cost) {
			state.inspiration -= cost;
		},

		ASSIGN_SEARCHER(state, amt) {
			state.unassignedEmployeeCount -= amt;
			state.searcherCount += amt;
		},

		UNASSIGN_SEARCHER(state, amt) {
			state.unassignedEmployeeCount += amt;
			state.searcherCount -= amt;
		},

		ASSIGN_PITCHER(state, amt) {
			state.unassignedEmployeeCount -= amt;
			state.pitcherCount += amt;
		},

		UNASSIGN_PITCHER(state, amt) {
			state.unassignedEmployeeCount += amt;
			state.pitcherCount -= amt;
		},

		// Prepro Resource Mutations
		SET_ROLE_CAST(state, { roleIndex }) {
			if (state.currentScript.roles[roleIndex]) {
				state.currentScript.roles[roleIndex].isCast = true;
			}
		},
		SET_SHOT_PLANNED(state, { shotIndex }) {
			if (state.currentScript.shots[shotIndex]) {
				state.currentScript.shots[shotIndex].isPlanned = true;
			}
		},
		SET_LOCATION_SCOUTED(state, { locationIndex }) {
			if (state.currentScript.locations[locationIndex]) {
				state.currentScript.locations[locationIndex].isScouted = true;
			}
		},
		SET_SET_BUILT(state, { setIndex }) {
			if (state.currentScript.sets[setIndex]) {
				state.currentScript.sets[setIndex].isBuilt = true;
			}
		},
		SET_COSTUME_MADE(state, { costumeIndex }) {
			if (state.currentScript.costumes[costumeIndex]) {
				state.currentScript.costumes[costumeIndex].isMade = true;
			}
		},
		SET_LOOK_DESIGNED(state, { lookIndex }) {
			if (state.currentScript.looks[lookIndex]) {
				state.currentScript.looks[lookIndex].isDesigned = true;
			}
		},
	},
	actions: {
		increaseWordCount({ state, commit, dispatch, getters }) {
			const previousToolDetails = getters.previousToolDetails;
			if (previousToolDetails) {
				const amt = previousToolDetails.wordsPerClick;
				commit("INCREASE_WORD_COUNT", amt);
			} else {
				// Handle the scenario where there is no previous tool
				console.log("No previous tool available to increase word count.");
			}
			if (state.wordCount >= 50 && !state.milestones.fiftyWords) {
				commit("UPDATE_STATE_VARIABLE", {
					key: "writingToolCardVisible",
					value: true,
				});
				commit("SET_MILESTONE_ACHIEVED", "fiftyWords");
				dispatch("showPopup", "writingTool");
			}
		},
		updateWordCount({ state, getters, commit }) {
			if (!state.lastUpdate) {
				state.lastUpdate = Date.now();
			}

			function step() {
				const now = Date.now();
				const deltaTime = (now - state.lastUpdate) / 1000; // Time in seconds since last update
				state.lastUpdate = now; // Update the lastUpdate time

				const wordsPerSecond = getters.wordsPerSecond;
				const wordsToAdd = wordsPerSecond * deltaTime; // Keep this fractional

				// Use a proxy accumulator for fractional word counts
				state.wordAccumulator += wordsToAdd;

				if (state.wordAccumulator >= 1) {
					const wholeWords = Math.floor(state.wordAccumulator);
					commit("INCREASE_WORD_COUNT", wholeWords);
					state.wordAccumulator -= wholeWords; // Adjust accumulator by subtracting whole words added
				}

				requestAnimationFrame(step);
			}

			requestAnimationFrame(step);
		},
		changeGenre({ commit }, genre) {
			commit("SET_CURRENT_GENRE", genre);
		},

		showPopup({ commit }, popupKey) {
			commit("SET_CURRENT_POPUP", popupKey);

			commit("SET_POPUP_VISIBLE", true);
		},

		generateScript({ commit, state, dispatch }) {
			const genre = state.currentGenre;
			const title = "Untitled Script";
			const roleRange = state.ranges.roleAmount;
			const shotRange = state.ranges.shotAmount;
			const setRange = state.ranges.setAmount;
			const locationRange = state.ranges.locationAmount;
			const numberOfRoles =
				Math.floor(Math.random() * (roleRange[1] - roleRange[0] + 1)) +
				roleRange[0];
			const numberOfShots =
				Math.floor(Math.random() * (shotRange[1] - shotRange[0] + 1)) +
				shotRange[0];
			const numberOfSets =
				Math.floor(Math.random() * (setRange[1] - setRange[0] + 1)) +
				setRange[0];
			const numberOfLocations =
				Math.floor(Math.random() * (locationRange[1] - locationRange[0] + 1)) +
				locationRange[0];

			const roles = [];
			const shots = [];
			const sets = [];
			const locations = [];
			const costumes = [];
			const looks = [];
			const possibleRoles = state.genres[genre].roles;
			const possibleShots = state.pools.shots;
			const possibleSets = state.pools.sets;
			const possibleLocations = state.pools.locations;
			const possibleCostumes = state.pools.costumes;
			const possibleLooks = state.pools.looks;
			const scriptQuality = state.genres[genre].quality;

			// Assign roles randomly from the genre's roles pool
			for (let i = 0; i < numberOfRoles; i++) {
				const randomIndex = Math.floor(Math.random() * possibleRoles.length);
				roles.push({
					name: possibleRoles[randomIndex],
					isCast: false,
				});
			}

			// Assign shots randomly from the genre's shots pool
			for (let i = 0; i < numberOfShots; i++) {
				const randomIndex = Math.floor(Math.random() * possibleShots.length);
				shots.push({
					name: possibleShots[randomIndex],
					isPlanned: false,
				});
			}

			// Assign sets randomly from the general set pool
			for (let i = 0; i < numberOfSets; i++) {
				const randomIndex = Math.floor(Math.random() * possibleSets.length);
				sets.push({
					name: possibleSets[randomIndex],
					isBuilt: false,
				});
			}

			// Assign locations randomly from the general location pool
			for (let i = 0; i < numberOfLocations; i++) {
				const randomIndex = Math.floor(
					Math.random() * possibleLocations.length
				);
				locations.push({
					name: possibleLocations[randomIndex],
					isScouted: false,
				});
			}

			for (let i = 0; i < numberOfRoles; i++) {
				const costumeIndex = Math.floor(
					Math.random() * possibleCostumes.length
				);
				const costumeName = state.pools.costumes[costumeIndex];

				costumes.push({
					name: costumeName,
					role: roles[i].name,
					isMade: false,
				});
				if (Math.random() >= 0.2) {
					const secondCostumeIndex = Math.floor(
						Math.random() * possibleCostumes.length
					);
					const secondCostumeName = state.pools.costumes[secondCostumeIndex];
					costumes.push({
						name: secondCostumeName,
						role: roles[i].name,
						isMade: false,
					});
				}
			}

			for (let i = 0; i < numberOfRoles; i++) {
				const lookIndex = Math.floor(Math.random() * possibleLooks.length);
				const lookName = state.pools.looks[lookIndex];

				looks.push({
					name: lookName,
					role: roles[i].name,
					isDesigned: false,
				});
				if (Math.random() >= 0.2) {
					const secondLookIndex = Math.floor(
						Math.random() * possibleLooks.length
					);
					const secondLookName = state.pools.looks[secondLookIndex];
					looks.push({
						name: secondLookName,
						role: roles[i].name,
						isDesigned: false,
					});
				}
			}

			// Constructing the strings for the description
			const rolesList = roles.map((role) => `${role.name}`).join(", ");
			const shotsList = shots.map((shot) => `${shot.name}`).join(", ");
			const setsList = sets.map((set) => `${set.name}`).join(", ");
			const costumesList = costumes
				.map((costume) => `${costume.name} for ${costume.role}`)
				.join(", ");
			const locationsList = locations
				.map((location) => `${location.name}`)
				.join(", ");
			const looksList = looks
				.map((look) => `${look.name} for ${look.role}`)
				.join(", ");
			const roleDescription = `Roles: ${rolesList}`;
			const scriptDescription = `A ${scriptQuality.toFixed(
				1
			)} quality ${genre} script with ${roles.length} roles:
			${rolesList} \n 
			${shots.length} shots: \n ${shotsList}
			\n
			${sets.length} sets: \n ${setsList} \n
			${locations.length} locations: \n ${locationsList} \n
			${costumes.length} costumes: \n ${costumesList} \n
			${looks.length} looks: \n ${looksList}`;

			// Construct the script object including the description
			const script = {
				title,
				genre,
				roles,
				shots,
				looks,
				sets,
				locations,
				costumes,
				quality: scriptQuality,
				roleDescription: roleDescription,
				description: scriptDescription, // Include description directly in the script object
			};

			commit("ADD_SCRIPT", script);
			dispatch("showPopup", "newScript");
		},

		sellProduct({ state, getters, commit, dispatch }, { cardType, cost, pay }) {
			commit("DECREASE_WORD_COUNT", cost);
			commit("INCREASE_WRITING_DOLLAR_AMOUNT", pay);
			state.products[cardType].count++;
			console.log(`${cardType} count now ${state.products[cardType].count}`);

			commit("UPDATE_GENRE_PROGRESS", {
				genre: state.currentGenre,
				words: cost,
			});

			if (
				getters.currentGenreDetails.level >= 3 &&
				!state.milestones.genreLevelTwo
			) {
				commit("UPDATE_STATE_VARIABLE", {
					key: "switchGenreVisible",
					value: true,
				});
				commit("SET_MILESTONE_ACHIEVED", "genreLevelTwo");
				dispatch("showPopup", "changeGenre");
			}

			if (cardType === "shootingScript") {
				dispatch("generateScript");
			}
			if (state.products.logline.count >= 5 && !state.milestones.fiveLoglines) {
				commit("TOGGLE_COMPONENT_VISIBILITY", "synopsis");
				commit("SET_MILESTONE_ACHIEVED", "fiveLoglines");
				dispatch("showPopup", "synopsis");
			}
			if (state.writingDollarCount >= 60 && !state.milestones.sixtyDollars) {
				commit("UPDATE_STATE_VARIABLE", {
					key: "writersRoomVisible",
					value: true,
				});
				commit("TOGGLE_COMPONENT_VISIBILITY", "intern");
				commit("SET_MILESTONE_ACHIEVED", "sixtyDollars");
				dispatch("showPopup", "writersRoom");
			}
			if (
				state.products.synopsis.count >= 5 &&
				!state.milestones.fiveSynopses
			) {
				commit("TOGGLE_COMPONENT_VISIBILITY", "outline");
				commit("SET_MILESTONE_ACHIEVED", "fiveSynopses");
				dispatch("showPopup", "outline");
			}
			if (state.products.outline.count >= 5 && !state.milestones.fiveOutlines) {
				commit("TOGGLE_COMPONENT_VISIBILITY", "treatment");
				commit("SET_MILESTONE_ACHIEVED", "fiveOutlines");
				dispatch("showPopup", "treatment");
			}
			if (
				state.products.treatment.count >= 5 &&
				!state.milestones.fiveTreatments
			) {
				commit("TOGGLE_COMPONENT_VISIBILITY", "draftScript");
				commit("SET_MILESTONE_ACHIEVED", "fiveTreatments");
				dispatch("showPopup", "draftScript");
			}

			if (
				state.products.draftScript.count >= 5 &&
				!state.milestones.fiveDraftScripts
			) {
				commit("TOGGLE_COMPONENT_VISIBILITY", "shootingScript");
				commit("SET_MILESTONE_ACHIEVED", "fiveDraftScripts");
				dispatch("showPopup", "shootingScript");
			}
			if (
				state.products.shootingScript.count >= 1 &&
				!state.milestones.firstScript
			) {
				commit("SET_MILESTONE_ACHIEVED", "firstShootingScript");
				dispatch("showPopup", "newScript");
				commit("UPDATE_STATE_VARIABLE", {
					key: "isPreproductionUnlocked",
					value: true,
				});
			}
		},
		purchaseTool({ commit, state }, { cost, wordsPerClick }) {
			commit("DECREASE_WRITING_DOLLAR_AMOUNT", cost);
			commit("SET_WORDS_PER_CLICK", wordsPerClick);

			// Logic to set the next write tool
			const toolKeys = Object.keys(state.writeTools);
			const currentToolIndex = toolKeys.indexOf(state.currentWriteTool);
			const nextToolIndex = currentToolIndex + 1;
			commit("SET_NEXT_WRITE_TOOL", toolKeys[nextToolIndex]);
		},
		hireWorker({ commit, state, dispatch }, { cost, name }) {
			// First, find the workerType key that matches the provided name
			const workerTypeKey = Object.keys(state.workers).find(
				(key) => state.workers[key].name === name
			);

			if (!workerTypeKey) {
				console.error(`Worker with name ${name} not found.`);
				return;
			}

			// Now that you have the workerTypeKey, you can access the worker object
			const worker = state.workers[workerTypeKey];

			commit("DECREASE_WRITING_DOLLAR_AMOUNT", cost);

			const id = Date.now(); // Simple unique identifier
			commit("ADD_WORKER", { workerType: workerTypeKey, id }); // Use the key to identify the worker type

			if (
				state.workers.intern.totalcount >= 5 &&
				!state.milestones.fiveInterns
			) {
				commit("TOGGLE_COMPONENT_VISIBILITY", "junior");
				commit("SET_MILESTONE_ACHIEVED", "fiveInterns");
				dispatch("showPopup", "juniorWriters");
			}

			if (
				state.workers.junior.totalcount >= 5 &&
				!state.milestones.fiveJuniors
			) {
				commit("TOGGLE_COMPONENT_VISIBILITY", "screenwriter");
				commit("SET_MILESTONE_ACHIEVED", "fiveJuniors");
				dispatch("showPopup", "screenwriters");
			}

			if (
				state.workers.screenwriter.totalcount >= 5 &&
				!state.milestones.fiveScreenwriters
			) {
				commit("TOGGLE_COMPONENT_VISIBILITY", "cowriters");
				commit("SET_MILESTONE_ACHIEVED", "fiveScreenwriters");
				dispatch("showPopup", "cowriters");
			}
			if (
				state.workers.intern.totalcount >= 3 &&
				!state.milestones.threeWorkers
			) {
				commit("UPDATE_STATE_VARIABLE", {
					key: "writersRoomUpgradeVisible",
					value: true,
				});
				commit("SET_MILESTONE_ACHIEVED", "threeWorkers");
				dispatch("showPopup", "writersRoomCapacityUpgrade");
			}

			// Use the duration from the found worker object
			const durationMs = worker.duration * 60000; // Convert minutes to milliseconds
			console.log(`${workerTypeKey} with duration of ${durationMs} ms added`);
			setTimeout(() => {
				commit("REMOVE_WORKER", { workerType: workerTypeKey, id });
			}, durationMs);
		},
		upgradeWritersRoom({ commit, getters, state, dispatch }) {
			const upgrade = getters.nextWritersRoomUpgrade;
			if (upgrade) {
				commit("DECREASE_WRITING_DOLLAR_AMOUNT", upgrade.cost);
				commit("UPGRADE_WRITERS_ROOM_CAPACITY");
				if (
					state.currentCapacityIndex >= 3 &&
					!state.milestones.secondWritersRoomUpgrade
				) {
					commit("TOGGLE_COMPONENT_VISIBILITY", "scriptDoctor");
					commit("SET_MILESTONE_ACHIEVED", "secondWritersRoomUpgrade");
					dispatch("showPopup", "scriptDoctors");
				}
			} else {
				// Log or handle the error as needed; this serves as a fail-safe.
				console.error("Upgrade action called inappropriately.");
			}
		},
		addInspiration({ commit }, amt) {
			commit("INCREASE_INSPIRATION", amt);
		},
		spendInspiration({ commit }, cost) {
			commit("DECREASE_INSPIRATION", cost);
		},
	},
	modules: {},
});
