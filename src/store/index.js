/* eslint-disable */
import { createStore } from "vuex";

// Import modules
import popupManager from "./modules/popupManager";
import progressManager from "./modules/progressManager";

// Import popup configurations
import {
	tutorialPopups,
	achievementPopups,
	writersRoomPopups,
	scriptPopups,
	confirmationPopups,
	featureUnlockPopups,
	gamePhasePopups,
	errorPopups,
	popupKeyMapping,
	registerAllPopups,
} from "../data/popups";

const store = createStore({
	modules: {
		popupManager,
		progressManager,
	},
	state: {
		// DYNAMIC VARIABLES BELOW

		studioName: "Click Studios",

		// Phase Unlocks
		isPreproductionUnlocked: false,
		isFilmingUnlocked: false,
		isPostproductionUnlocked: false,
		isMarketingUnlocked: false,
		isReleaseUnlocked: false,

		// Word Variables

		wordCount: 10000000,
		wordsPerSecond: 0,
		totalWordCount: 0,

		wordAccumulator: 0,
		lastUpdate: 0,

		// Writing Tool
		currentWriteTool: "pen", // Default write tool available for purchase
		writingToolCardVisible: false,

		// Writers Room
		writersRoomVisible: false,
		currentCapacityIndex: 1, // Keeps track of the current capacity level

		writersRoomUpgradeVisible: false,

		// Dollar Variables
		writingDollarCount: 0,
		totalWritingDollarCount: 0,

		preproDollarCount: 0,
		totalPreproDollarCount: 0,
		// I should put the wpS value above in a compute function later probably XYZ

		//Pop Ups
		currentPopup: null,
		popupVisible: false,

		// Script and Roles
		scriptDescription: "No script.",
		roleDescription: "No roles.",
		currentTitle: "Tomorrow's Tears",
		currentGenre: "drama", // Default genre (for now)

		// Milestone tracking
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

		// Genre Progress
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

		// Workers
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
		currentWorkers: [],

		// Products
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

		currentScript: {
			title: "",
			genre: "",
			roles: [],
			shots: [],
			sets: [],
			locations: [],
			costumes: [],
			looks: [],
		},

		// Dialog Box
		activeDialog: null,
		showDialog: false,

		// Pitching Values

		searchesNeeded: 20,

		manualSearchAmount: 1,

		searchesPerSecond: 0,

		pitchesNeeded: 20,

		manualPitchAmount: 1,

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

		// STATIC VARIABLES BELOW

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
			scriptDetails: {
				title: "",
				emoji: "📒",
				text: "",
			},
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

		// Pools
		pools: {
			shots: [
				"Aerial",
				"B-Roll",
				"Bird's Eye View",
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
			settings: [
				{
					id: 1,
					type: "set",
					name: "Hospital Ward",
					image: "assets/ShotPhotos/hospitalward.jpg",
				},
				{
					id: 2,
					type: "set",
					name: "Courtroom",
					image: "assets/ShotPhotos/courtroom.jpg",
				},
				{
					id: 3,
					type: "set",
					name: "Living Room",
					image: "assets/ShotPhotos/livingroom.jpg",
				},
				{
					id: 4,
					type: "set",
					name: "Suburban Kitchen",
					image: "assets/ShotPhotos/kitchen.jpg",
				},
				{
					id: 5,
					type: "set",
					name: "Lounge",
					image: "assets/ShotPhotos/lounge.jpg",
				},
				{
					id: 6,
					type: "set",
					name: "Subway Train Car",
					image: "assets/ShotPhotos/subway.jpg",
				},
				{
					id: 7,
					type: "set",
					name: "Classroom",
					image: "assets/ShotPhotos/classroom.jpg",
				},
				{
					id: 8,
					type: "set",
					name: "Cellar",
					image: "assets/ShotPhotos/cellar.jpg",
				},
				{
					id: 9,
					type: "set",
					name: "Conference Room",
					image: "assets/ShotPhotos/conferenceroom.jpg",
				},
				{
					id: 10,
					type: "set",
					name: "Restaurant",
					image: "assets/ShotPhotos/restaurant.jpg",
				},
				{
					id: 11,
					type: "set",
					name: "Church Interior",
					image: "assets/ShotPhotos/church.jpg",
				},
				{
					id: 12,
					type: "set",
					name: "Waiting Room",
					image: "assets/ShotPhotos/waitingroom.jpg",
				},
				{
					id: 13,
					type: "set",
					name: "Walk-in Closet",
					image: "assets/ShotPhotos/closet.jpg",
				},
				{
					id: 14,
					type: "set",
					name: "Library Study Room",
					image: "assets/ShotPhotos/studyroom.jpg",
				},
				{
					id: 15,
					type: "set",
					name: "Motel Room",
					image: "assets/ShotPhotos/motel.jpg",
				},
				{
					id: 16,
					type: "set",
					name: "Manor Living Room",
					image: "assets/ShotPhotos/manorlivingroom.jpg",
				},
				{
					id: 17,
					type: "set",
					name: "Hotel Lobby",
					image: "assets/ShotPhotos/hotellobby.jpg",
				},
				{
					id: 18,
					type: "set",
					name: "Empty Hallway",
					image: "assets/ShotPhotos/hallway.jpg",
				},
				{
					id: 19,
					type: "set",
					name: "Rustic Cabin",
					image: "assets/ShotPhotos/rusticcabin.jpg",
				},
				{
					id: 20,
					type: "set",
					name: "Airplane",
					image: "assets/ShotPhotos/airplane.jpg",
				},
				{
					id: 21,
					type: "set",
					name: "Gym",
					image: "assets/ShotPhotos/gym.jpg",
				},
				{
					id: 22,
					type: "set",
					name: "Hotel Room",
					image: "assets/ShotPhotos/hotelroom.jpg",
				},
				{
					id: 23,
					type: "set",
					name: "Clothing Store",
					image: "assets/ShotPhotos/clothingstore.jpg",
				},
				{
					id: 24,
					type: "set",
					name: "Mechanic Garage",
					image: "assets/ShotPhotos/garage.jpg",
				},
				{
					id: 25,
					type: "set",
					name: "Treehouse",
					image: "assets/ShotPhotos/treehouse.jpg",
				},
				{
					id: 26,
					type: "location",
					name: "Train Station Platform",
					image: "assets/ShotPhotos/trainstation.jpg",
				},
				{
					id: 27,
					type: "location",
					name: "Sidewalk Cafe",
					image: "assets/ShotPhotos/cafe.jpg",
				},
				{
					id: 28,
					type: "location",
					name: "Public Park",
					image: "assets/ShotPhotos/publicpark.jpg",
				},
				{
					id: 29,
					type: "location",
					name: "Mall Atrium",
					image: "assets/ShotPhotos/mallatrium.jpg",
				},
				{
					id: 30,
					type: "location",
					name: "Cemetery",
					image: "assets/ShotPhotos/cemetery.jpg",
				},
				{
					id: 31,
					type: "location",
					name: "Sunflower Field",
					image: "assets/ShotPhotos/sunflowerfield.jpg",
				},
				{
					id: 32,
					type: "location",
					name: "Arena",
					image: "assets/ShotPhotos/arena.jpg",
				},
				{
					id: 33,
					type: "location",
					name: "Beachfront",
					image: "assets/ShotPhotos/beachfront.jpg",
				},
				{
					id: 34,
					type: "location",
					name: "Neighborhood Street",
					image: "assets/ShotPhotos/neighborhoodstreet.jpg",
				},
				{
					id: 35,
					type: "location",
					name: "Park Bench",
					image: "assets/ShotPhotos/parkbench.jpg",
				},
				{
					id: 36,
					type: "location",
					name: "College Campus",
					image: "assets/ShotPhotos/collegecampus.jpg",
				},
				{
					id: 37,
					type: "location",
					name: "Rooftop",
					image: "assets/ShotPhotos/rooftop.jpg",
				},
				{
					id: 38,
					type: "location",
					name: "Hiking Trail",
					image: "assets/ShotPhotos/hikingtrail.jpg",
				},
				{
					id: 39,
					type: "location",
					name: "Forest Path",
					image: "assets/ShotPhotos/forestpath.jpg",
				},
				{
					id: 40,
					type: "location",
					name: "Lake Path",
					image: "assets/ShotPhotos/lakepath.jpg",
				},
				{
					id: 41,
					type: "location",
					name: "Amusement Park",
					image: "assets/ShotPhotos/amusementpark.jpg",
				},
				{
					id: 42,
					type: "location",
					name: "Restaurant Patio",
					image: "assets/ShotPhotos/restaurantpatio.jpg",
				},
				{
					id: 43,
					type: "location",
					name: "Boardwalk",
					image: "assets/ShotPhotos/boardwalk.jpg",
				},
				{
					id: 44,
					type: "location",
					name: "Airport Tarmac",
					image: "assets/ShotPhotos/airporttarmac.jpg",
				},
				{
					id: 45,
					type: "location",
					name: "Cobblestone Street",
					image: "assets/ShotPhotos/cobblestone.jpg",
				},
				{
					id: 46,
					type: "location",
					name: "Lakeside",
					image: "assets/ShotPhotos/lakeside.jpg",
				},
				{
					id: 47,
					type: "location",
					name: "Park Bench",
					image: "assets/ShotPhotos/parkbench.jpg",
				},
				{
					id: 48,
					type: "location",
					name: "Abandoned Lot",
					image: "assets/ShotPhotos/abandonedlot.jpg",
				},
				{
					id: 49,
					type: "location",
					name: "Alleyway",
					image: "assets/ShotPhotos/alleyway.jpg",
				},
				{
					id: 50,
					type: "location",
					name: "Desert Highway",
					image: "assets/ShotPhotos/deserthighway.jpg",
				},
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
		},

		// RANGES
		ranges: {
			roleAmount: [2, 5],
			shotAmount: [5, 15],
			locationAmount: [3, 11],
			setAmount: [2, 8],
			investorSearchAmount: [20, 30],
			investorPitchAmount: [20, 30],
			smallInvestorPayAmount: [2000, 10000],
		},

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

		// Developer Checkpoint Save Data

		secondPhaseSaveState: `{"studioName":"Second Phase Studios","isPreproductionUnlocked":true,"isFilmingUnlocked":true,"isPostproductionUnlocked":false,"isMarketingUnlocked":false,"isReleaseUnlocked":false,"wordCount":674072,"wordsPerSecond":60,"totalWordCount":0,"wordAccumulator":0.5262639998391876,"lastUpdate":1726778515568,"currentWriteTool":"supercomputer","writingToolCardVisible":true,"writersRoomVisible":true,"currentCapacityIndex":6,"writersRoomUpgradeVisible":true,"writingDollarCount":12462,"totalWritingDollarCount":0,"preproDollarCount":0,"totalPreproDollarCount":0,"currentPopup":"shootingScript","popupVisible":false,"scriptDescription":"No script.","roleDescription":"No roles.","currentTitle":"Tomorrow's Tears","currentGenre":"drama","milestones":{"fiveLoglines":true,"fiveSynopses":true,"fiveOutlines":true,"fiveTreatments":true,"fiveDraftScripts":true,"firstShootingScript":false,"fiveInterns":true,"fiveJuniors":true,"fiveScreenwriters":true,"fiveCowriters":false,"fiftyWords":true,"genreLevelTwo":true,"sixtyDollars":true,"threeWorkers":true,"secondWritersRoomUpgrade":true},"genres":{"horror":{"name":"Horror","emoji":"😱","level":1,"wordsNeeded":100,"quality":1,"roles":["Alien","Babysitter","Beast","Clairvoyant","Copycat Killer","Cryptid","Cultist","Cursed One","Dark Magic Priest","Demon","Detective","Exorcist","Final Girl","Fugitive","Ghost","Ghoul","Gravekeeper","Healer","Hermit","Hunter","Mad Scientist","Medium","Mummy","Mutant","Nurse","Occultist","Paranormal Investigator","Phantom","Poltergeist","Recluse","Serial Killer","Shape-shifter","Siren","Skeptic","Sorcerer","Survivor","Vampire","Victim","Werewolf","Witch","Zombie"]},"comedy":{"name":"Comedy","emoji":"🤣","level":1,"wordsNeeded":100,"quality":1,"roles":["Boss","Busybody","Cat Lady","Chef","Conspiracy Theorist","Creep","Diva","Dreamer","Ex-boyfriend","Ex-girlfriend","Fashionista","Gamer","Goofball","Grump","Guru","Hipster","Imposter","Intern","Inventor","Journalist","Kid Genius","Klutz","Magician","Matchmaker","Neighbor","Nerd","Overachiever","Prankster","Psychic","Retiree","Roommate","Schemer","Slacker","Snob","Socialite","Stoner","Tourist","Town Gossip","Twin","Tycoon","Vlogger"]},"drama":{"name":"Drama","emoji":"🥲","level":11,"wordsNeeded":82660,"quality":3.2,"roles":["Activist","Artist","Babysitter","Baron","Brother","Caregiver","Composer","Con Artist","Dancer","Debutante","Diplomat","Divorcee","Envoy","Executive","Fugitive","Godparent","Heiress","Homeless Person","Immigrant","Journalist","Lawyer","Lobbyist","Mentor","Musician","Nomad","Orphan","Philanthropist","Poet","Priest","Prodigy","Rebel","Refugee","Reporter","Sister","Social Worker","Step-parent","Survivor","Teacher","Therapist","Veteran","Widow"]},"action":{"name":"Action","emoji":"😎","level":1,"wordsNeeded":100,"quality":1,"roles":["Accomplice","Arms Dealer","Assassin","Bodyguard","Bounty Hunter","Burglar","CIA Agent","Commando","Conspirator","Cop","Coroner","Deserter","Double Agent","Escape Artist","Fighter Pilot","Gang Leader","Gladiator","Guard","Gun Runner","Hacker","Interrogator","KGB Agent","Martial Artist","Mercenary","MI6 Agent","Ninja","Parole Officer","Pilot","President","Private Investigator","Rebel Leader","Scientist","Secret Service Agent","Security Guard","Smuggler","Sniper","Soldier","Spy Master","Terrorist","Thief","Undercover Agent","Warrior"]}},"switchGenreVisible":true,"workers":{"scriptDoctor":{"name":"Script Doctor","count":4,"totalcount":4,"cost":24000,"wps":0,"duration":120,"emoji":"👩‍⚕️","effect":1.4,"visible":true},"intern":{"name":"Intern","count":0,"totalcount":6,"cost":25,"wps":1,"duration":0.5,"emoji":"🙋","visible":true},"junior":{"name":"Junior","count":0,"totalcount":5,"cost":70,"wps":5,"duration":1,"emoji":"🧑‍💻","visible":true},"screenwriter":{"name":"Screenwriter","count":0,"totalcount":7,"cost":200,"wps":15,"duration":5,"emoji":"🧑‍💼","visible":true},"cowriters":{"name":"Cowriters","count":30,"totalcount":30,"cost":1400,"wps":70,"duration":15,"emoji":"👥","visible":true}},"currentWorkers":[{"workerType":"cowriters","id":1726777959909},{"workerType":"cowriters","id":1726777995344},{"workerType":"cowriters","id":1726778010693},{"workerType":"cowriters","id":1726778086381},{"workerType":"cowriters","id":1726778190795},{"workerType":"cowriters","id":1726778191167},{"workerType":"cowriters","id":1726778191527},{"workerType":"cowriters","id":1726778191863},{"workerType":"cowriters","id":1726778192218},{"workerType":"cowriters","id":1726778192596},{"workerType":"cowriters","id":1726778193016},{"workerType":"cowriters","id":1726778369044},{"workerType":"cowriters","id":1726778369228},{"workerType":"cowriters","id":1726778369380},{"workerType":"cowriters","id":1726778369545},{"workerType":"cowriters","id":1726778370466},{"workerType":"cowriters","id":1726778370659},{"workerType":"scriptDoctor","id":1726778372442},{"workerType":"scriptDoctor","id":1726778373215},{"workerType":"scriptDoctor","id":1726778378033},{"workerType":"cowriters","id":1726778379376},{"workerType":"cowriters","id":1726778383766},{"workerType":"cowriters","id":1726778384210},{"workerType":"cowriters","id":1726778384657},{"workerType":"cowriters","id":1726778391128},{"workerType":"cowriters","id":1726778391295},{"workerType":"cowriters","id":1726778391446},{"workerType":"cowriters","id":1726778405890},{"workerType":"cowriters","id":1726778479914},{"workerType":"cowriters","id":1726778480793},{"workerType":"cowriters","id":1726778481063},{"workerType":"cowriters","id":1726778481242},{"workerType":"cowriters","id":1726778481415},{"workerType":"scriptDoctor","id":1726778485651}],"products":{"logline":{"title":"Logline","emoji":"💡","text":"Earn $6","cost":20,"count":5,"totalcount":0,"currency":"words","pay":6,"visible":true},"synopsis":{"title":"Synopsis","emoji":"💭","text":"Earn $40","cost":120,"count":12,"totalcount":0,"currency":"words","pay":40,"visible":true},"outline":{"title":"Outline","emoji":"📋","text":"Earn $220","cost":800,"count":8,"totalcount":0,"currency":"words","pay":320,"visible":true},"treatment":{"title":"Treatment","emoji":"🗒️","text":"Earn $1,200","cost":5000,"count":13,"totalcount":0,"currency":"words","pay":2200,"visible":true},"draftScript":{"title":"Draft Script","emoji":"📑","text":"Earn $3,000","cost":30000,"count":9,"totalcount":0,"currency":"words","pay":15000,"visible":true},"shootingScript":{"title":"Shooting Script","emoji":"📒","text":"Greenlight your project.","cost":1000000,"count":0,"totalcount":0,"currency":"words","pay":150000,"visible":true}},"currentScript":{"title":"","roles":[],"shots":[],"sets":[],"locations":[],"costumes":[],"looks":[]},"activeDialog":null,"showDialog":false,"searchesNeeded":30,"manualSearchAmount":4,"searchesPerSecond":0,"pitchesNeeded":20,"manualPitchAmount":3,"pitchesPerSecond":0,"currentInvestor":"","currentInvestment":0,"searcherCount":0,"pitcherCount":0,"searcherSpeed":3,"pitcherSpeed":3,"employeeCount":0,"unassignedEmployeeCount":0,"inspiration":0,"popups":{"tutorialOne":{"title":"Name Your Studio","emoji":"✨","text":"Thanks for trying out my game! \\n\\n Name your studio to begin:","inputField":true,"buttonType":"next","nextPopup":"introduction","inputTarget":"studioName"},"introduction":{"title":"Welcome to Hollywood!","emoji":"🎟️","text":"Congratulations on starting your film studio! \\n\\n Fame and fortune await, but the journey begins with Writing. \\n \\n Sell your ideas to other studios until you're ready to make your own scripts!"},"writingTool":{"title":"🔓 Writing Tool Upgrade","emoji":"✒️","text":"They say the pen is mightier than the sword -- so it's definitely mightier than the pencil! \\n\\n You can now upgrade your tool to write more words per click!"},"synopsis":{"title":"🔓 Synopses","emoji":"💭","text":"A synopsis condenses your script's plot into a brief overview. \\n\\n It can be sold for more money per word."},"outline":{"title":"🔓 Outlines","emoji":"📋","text":"An outline lays out the main events of your script in sequence. \\n\\n Selling an outline earns more money per word."},"treatment":{"title":"🔓 Treatments","emoji":"🗒️","text":"A treatment provides a detailed story plan, including character arcs and plot points. \\n\\n Treatments fetch higher prices per word."},"draftScript":{"title":"🔓 Draft Scripts","emoji":"📑","text":"Every great screenplay starts with a first draft. \\n\\n These are quite valuable, but not enough on their own to greenlight a movie."},"shootingScript":{"title":"🔓 Shooting Scripts","emoji":"📒","text":"It can take dozens of revisions -- and millions of words written -- to arrive at a script ready for shooting. \\n\\n Once you've completed a shooting script, you can greenlight the project and move into preproduction!"},"writersRoom":{"title":"🔓 Writers Room","emoji":"🙋","text":"You've unlocked the Writers Room! \\n\\n Here, writers will automatically write words for you for the duration of their hire. \\n\\n To start, you can hire interns for short stints at inexpensive rates."},"juniorWriters":{"title":"🔓 Junior Writers","emoji":"🧑‍💻️","text":"Junior Writers are newcomers to the industry, offering fresh ideas. \\n\\n They write faster and can be hired for longer periods."},"screenwriters":{"title":"🔓 Screenwriters","emoji":"🧑‍💼","text":"Screenwriters are skilled in crafting compelling narratives. \\n\\n They work quickly and are available for extended contracts."},"cowriters":{"title":"🔓 Co-writers","emoji":"👥","text":"Co-writers collaborate on projects, bringing diverse perspectives. \\n\\nThey enhance writing speed and offer prolonged engagement."},"scriptDoctors":{"title":"🔓 Script Doctors","emoji":"👩‍⚕️","text":"Script Doctors work differently! \\n\\n They specialize in polishing and refining screenplays. \\n\\n They won't write words themselves, but can significantly boost your other writers productivity."},"changeGenre":{"title":"🔓 Change Genre","emoji":"🔄","text":"The more experience you have in a genre, the better quality those scripts will be. \\n\\n Switch between genres for a wide-ranging slate of movies, or double down on your favorite!"},"writersRoomCapacityUpgrade":{"title":"🔓 Writers Room Capacity Upgrade","emoji":"🪑","text":"Expand your Writers Room to accommodate more talent. \\n\\n Larger teams lead to faster project development."},"scriptDetails":{"title":"Film Named!","emoji":"📒","text":""}},"writeTools":{"pencil":{"name":"Pencil","emoji":"✍️","wordsPerClick":1,"cost":0},"pen":{"name":"Pen","emoji":"🖊️","wordsPerClick":2,"cost":18},"typewriter":{"name":"Typewriter","emoji":"📃","wordsPerClick":8,"cost":200},"wordprocessor":{"name":"Word Processor","emoji":"⌨️","wordsPerClick":16,"cost":800},"aimodel":{"name":"AI Model","emoji":"🤖","wordsPerClick":60,"cost":2400},"supercomputer":{"name":"Supercomputer","emoji":"🌐","wordsPerClick":2000,"cost":26000},"end":{"name":"End","emoji":"","wordsPerClick":0,"cost":0}},"pools":{"shots":["Aerial","B-Roll","Bird's Eye View","Bokeh","Close-up","Crane","Cutaway","Dolly Zoom","Dutch Angle","Establishing","Extra-wide","Extreme Close-up","Handheld","High Angle","Interior","Jib","Long Take","Low Angle","Master","Medium","Oner","Over-the-shoulder","Overhead","Panning","Pedestal","POV","Rack Focus","Reverse Angle","SnorriCam","Steadicam","Tilt","Tracking","Two-shot","Wide","Slider","Whip Pan","Match Cut","Jump Cut","Insert","Silhouette","Time-lapse","Freeze Frame","Pull-Out","Push-In","Split Screen","Depth of Field","Canted Angle","Reaction","Sequence","360","Point of Interest"],"sets":["Airport","Art Gallery","Backstage","Bedroom","Bridge","Castle","Cemetery","Coffee Shop","Courtroom","Downtown Street","Factory","Farm","Greenhouse","Gym","Harbor","Hospital","Hotel Lobby","Ice Rink","Jazz Club","Library","Mall","Mountain Cabin","Museum","Nightclub","Office","Old Mansion","Planetarium","Restaurant","Rooftop","School","Ski Resort","Subway Station","Traincar","Vineyard","Aquarium","Attic","Boardroom","Bookstore","Botanical Garden","Brewery","Church","Circus","Rooftop","Construction Site","Diner","Dive Bar","Dorm Room","Elevator","Ferry Boat","Fire Station","Garage","Haunted House","Lighthouse","Locker Room","Monastery","Opera House","Palace","Penthouse","Prison Cell","Recording Studio","Saloon","Space Station","Stadium","Temple","Theater","Bunker","Warehouse","Winery","Art Studio","Bakery","Ballroom","Bank","Barn","Basement","Bathroom","Bistro","Boathouse","Boxing Ring","Bridge Underpass","Broadcast Studio","Bungalow","Bus Station","Cafeteria","Candy Store","Car Dealership","Car Wash","Castle Tower","Catacombs","Cattle Farm","Cave Entrance","Cemetery Crypt","Chalet","Chapel","Chess Club","Chicken Coop","Children's Hospital","Cinema","Closet"],"locations":["Beach","Bridge","Campground","Desert","Forest","Highway","Lake","Mountain Cabin","Park","Vineyard","Cave","Country Road","Island","Jungle","Ranch","Ruins","Beach House","Bluff","Boardwalk","Canal","Canyon","Cliffside","College Campus","Bayou","Botanic Garden","Cabin","Riverbank","Meadow","Waterfall","Volcano","Glacier","Marshland","Sand Dunes","Lava Field","Prairie","Fjord","Oasis","Delta","Savanna","Tundra","Alpine Lodge","Hot Springs","Gorge","Plateau","Steppe","Coral Reef","Mangrove Forest","Bamboo Forest","Salt Flats","Sunflower Field","Village Square","Old Town","Old Dockyard","Moors","Valley","Orchard","Skyscraper","Suburbs","Town Hall","City Park","Opera House","Campus","Art Museum","Library","Cathedral","Shopping Mall","Train Station","Airport Terminal","Sports Arena","Theatre","High-rise","Warehouse ","Industrial Park","Convention Center","City Square","Historical Monument","Docklands","Metro Station","Business District","Luxury Hotel","Pedestrian Street","Gothic Quarter","Financial Center","Urban Alley","Rooftop Garden","Abandoned Factory"],"costumes":["Gown","Uniform","Ski Suit","Firefighter's Uniform","Pajamas","Space Suit","Medieval Armor","Victorian Dress","Pirate Outfit","Superhero Costume","Trench Coat","Flapper Dress","Cowboy Outfit","Ninja Attire","Astronaut Suit","Samurai Armor","Diving Suit","Wizard Robes","Viking Garb","Poodle Skirt","Steampunk Outfit","Gladiator Armor","Ballroom Gown","Ballet Costume","Disco Outfit","Military Camouflage","Lab Coat","Chef's Uniform","Flight Attendant Uniform","Wedding Dress","Toga","Egyptian Pharaoh Robe","Knight's Armor","Punk Rock Outfit","Clown Costume","Jumpsuit","Kimono","Lederhosen","Monk's Robes","Nun's Habit","Police Uniform","Driver Suit","Scuba Gear","Soccer Uniform","Tennis Outfit","Vampire Costume","Alien Costume","Angel Wings","Cheerleader Uniform","Jumpsuit","Royal Robe","Lab Uniform","Mime Outfit","Mummy Wraps","Peasant Outfit","Pilgrim Outfit","Sailor Suit","Santa Claus Suit","School Uniform","Scottish Kilt","Tudor Gown","Heavy Jacket","Sundress","Sweatpants","Cardigan","Denim Jeans","Polo Shirt","Leather Jacket","Chinos","Maxi Skirt","Cargo Pants","Tank Top","Linen Shirt","Velvet Blazer","Knit Sweater","Tulle Skirt","Flannel Shirt","High-Waisted Shorts","Bodysuit","Puffer Vest","Silk Blouse","Corduroy Trousers","Graphic Tee","Ballet Flats","Pencil Skirt","Capri Pants","Hooded Sweatshirt","Mock Turtleneck","Romper","Pea Coat","Leggings","Button-Down Shirt","Chambray Dress","Fisherman's Sweater","Joggers","Espadrilles","Wrap Dress","Culottes","Bomber Jacket","Ankle Boots"],"looks":["Glamour Makeup","Beehive Hair","Bruised Cheek","Bald Cap","Bob Wig","Fake Scar","Smokey Eye Makeup","Mohawk","Sunburn Makeup","Neon Eye Shadow","French Twist","Gothic Makeup","Dreadlocks","Old Age Makeup","Finger Waves","Clown Makeup","Buzz Cut","Airbrushed Makeup","Undercut","Zombie Makeup","Cornrows","Metallic Lipstick","Natural Hair","Vampire Makeup","Mullet","Cat Eye Liner","Faux Hawk","SFX Prosthetics","Pixie Cut","Salt and Pepper Wig","Punk Makeup","Ombre Hair","Glitter Makeup","Sideburns","Natural Makeup","High Ponytail","Burn Makeup","Silicone Wound","Futuristic Makeup","Braided Updo","Warrior Marks","Bowl Cut","Perm","Pale Makeup","Quiff","Contouring","Shag Hair","Freckles","Pompadour","Tattoo Cover-Up","Beachy Waves","Drag Makeup","Gory Wound Makeup","Retro Makeup","Wet Look Hair","Alien Makeup","Fishtail Braid","Cyberpunk Makeup"],"smallInvestors":["Penny Spendwell","Elvis Quarterman","Sean Simoleon","Nick L. Endime","Eleanor Plentycents","Macon Green","Bette Sheesflusch","Francis Dollarhyde","Quincy Quarterman","Patsy Pence","Cora Minte","Chuck Change","Owen Priceman","Frankie Fiverly","Tina Tennerson","Sally Centavo","Imelda Glamheel","Petra Pesobeso","Zainab Deenar","Ron Minbee"]},"ranges":{"roleAmount":[2,5],"shotAmount":[5,15],"locationAmount":[3,11],"setAmount":[2,8],"investorSearchAmount":[100,500],"investorPitchAmount":[100,500],"smallInvestorPayAmount":[2000,10000]},"levelCaps":[0,100,600,1000,2200,4700,10300,22400,48600,105700,229900,500000],"writersRoomCapacities":[{"capacity":0,"cost":0},{"capacity":3,"cost":30},{"capacity":5,"cost":90},{"capacity":9,"cost":270},{"capacity":16,"cost":810},{"capacity":25,"cost":2430},{"capacity":35,"cost":7290},{"capacity":48,"cost":21870},{"capacity":63,"cost":65610},{"capacity":80,"cost":196830},{"capacity":100,"cost":590490}]}`,

		// Add department states
		departments: {
			casting: {
				employees: 0,
				isLocked: true,
			},
			shotPlanning: {
				employees: 0,
				isLocked: true,
			},
			setBuilding: {
				employees: 0,
				isLocked: true,
			},
			locationScouting: {
				employees: 0,
				isLocked: true,
			},
			costumeMaking: {
				employees: 0,
				isLocked: true,
			},
			lookDesigning: {
				employees: 0,
				isLocked: true,
			},
		},
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
		scriptTitle: (state) => state.currentScript.title,
		scriptGenre: (state) => state.currentScript.genre,

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

		canAffordTool: (state) => (cost) => {
			return state.writingDollarCount >= cost;
		},

		isToolVisible: (state) => (cost) => {
			return cost !== 0 && state.writingToolCardVisible;
		},
	},
	mutations: {
		// Mutation to save the state to localStorage
		SAVE_STATE(state) {
			const serializedState = JSON.stringify(state);

			// Start timing the save
			const startTime = performance.now();

			// Save to localStorage
			localStorage.setItem("gameState", serializedState);

			// End timing and calculate the duration
			const endTime = performance.now();
			const saveDuration = endTime - startTime;

			// Log the file size and save duration
			console.log(
				`Saved state size: ${new Blob([serializedState]).size} bytes`
			);
			console.log(`Save took: ${saveDuration.toFixed(2)} milliseconds`);
		},
		// Mutation to load the state from localStorage
		LOAD_STATE(state) {
			const serializedState = localStorage.getItem("gameState");
			if (serializedState) {
				const loadedState = JSON.parse(serializedState);
				// Assign loaded values to the state variables
				Object.assign(state, loadedState);
				// Log the file size of the loaded state
				console.log(
					`Loaded state size: ${new Blob([serializedState]).size} bytes`
				);
			}
		},

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
			state.totalWritingDollarCount += pay;
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
			state.roleDescription = script.roleDescription;

			// Update the script details popup in the popup registry
			if (state.popupManager && state.popupManager.popupRegistry) {
				state.popupManager.popupRegistry["script_details"] = {
					...state.popupManager.popupRegistry["script_details"],
					title: script.title || "Script Details",
					text: script.description,
					emoji: "📒",
					type: "info",
					buttonText: "Let's Get Started!",
					theme: "achievement",
				};
			}

			// The newScript popup has been removed from the game
			// No need to update it anymore
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

		SET_DEPARTMENT_EMPLOYEES(state, { department, count }) {
			state.departments[department].employees = count;
		},

		SET_DEPARTMENT_LOCK(state, { department, isLocked }) {
			state.departments[department].isLocked = isLocked;
		},
		HIRE_DEPARTMENT_HEAD(state, { department, cost }) {
			state.preproDollarCount -= cost;
			state.departments[department].isLocked = false;
		},
		DEDUCT_WORKER_WAGES(state, amount) {
			state.preproDollarCount = Math.max(0, state.preproDollarCount - amount);
		},
		UPDATE_WORKER_TIMES(
			state,
			{ id, workerType, hireTime, expectedRemovalTime, animationStartTime }
		) {
			// Initialize times object if it doesn't exist for this worker type
			if (!state.workers[workerType].times) {
				state.workers[workerType].times = {};
			}

			// Only update the specific worker type
			state.workers[workerType].times[id] = {
				hireTime,
				expectedRemovalTime,
				animationStartTime,
			};
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
				dispatch("popupManager/showPopup", { id: "achievement_writingTool" });
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

		sellProduct({ commit, state, dispatch }, { cardType, cost, pay }) {
			// Decrease word count by cost
			commit("DECREASE_WORD_COUNT", cost);

			// Update genre progress with the words spent
			commit("UPDATE_GENRE_PROGRESS", {
				genre: state.currentGenre,
				words: cost,
			});

			// Increase writing dollar amount by pay
			commit("INCREASE_WRITING_DOLLAR_AMOUNT", pay);

			// Increment the product count
			commit("UPDATE_STATE_VARIABLE", {
				key: `products.${cardType}.count`,
				value: state.products[cardType].count + 1,
			});

			console.log(`Sold ${cardType} for ${pay} dollars (cost: ${cost} words)`);

			// Check if this is a shooting script being sold
			if (cardType === "shootingScript") {
				// If this is the first shooting script, mark the milestone as achieved
				if (!state.milestones.firstShootingScript) {
					// Mark the milestone as achieved
					commit("SET_MILESTONE_ACHIEVED", "firstShootingScript");

					// Unlock preproduction phase if not already unlocked
					if (!state.isPreproductionUnlocked) {
						commit("UPDATE_STATE_VARIABLE", {
							key: "isPreproductionUnlocked",
							value: true,
						});
					}
				}

				// Generate a new script with the current genre
				dispatch("generateScript", {
					genre: state.currentGenre,
					skipPopup: true,
				});

				// Ensure the script_details popup is correctly set up with current script information
				const scriptDetails =
					state.popupManager.popupRegistry["script_details"];
				dispatch(
					"popupManager/registerPopup",
					{
						id: "script_details",
						config: {
							...scriptDetails,
							title: state.currentScript.title || "Script Details",
							text: state.scriptDescription,
						},
					},
					{ root: true }
				);

				// Get the popup from the registry
				const popup =
					state.popupManager.popupRegistry["script_firstShootingScript"];

				// Get the current genre and capitalize the first letter
				const genre = state.currentGenre;
				const capitalizedGenre = genre.charAt(0).toUpperCase() + genre.slice(1);

				// Show the popup with the genre replacement
				dispatch(
					"popupManager/showPopup",
					{
						id: "script_firstShootingScript",
						props: {
							text: popup.text.replace("{genre}", capitalizedGenre),
							onSubmit: (inputValue) => {
								// Update the currentScript title with the input value
								commit("UPDATE_STATE_VARIABLE", {
									key: "currentScript.title",
									value: inputValue,
								});

								// Update the script_details popup again with the new title
								dispatch(
									"popupManager/registerPopup",
									{
										id: "script_details",
										config: {
											...state.popupManager.popupRegistry["script_details"],
											title: inputValue || "Script Details",
											text: state.scriptDescription,
										},
									},
									{ root: true }
								);
							},
						},
					},
					{ root: true }
				);
			} else {
				// Check for product-based milestones
				if (
					cardType === "logline" &&
					state.products.logline.count >= 5 &&
					!state.milestones.fiveLoglines
				) {
					// Mark the milestone as achieved
					commit("SET_MILESTONE_ACHIEVED", "fiveLoglines");

					// Make the synopsis product visible
					commit("UPDATE_STATE_VARIABLE", {
						key: "products.synopsis.visible",
						value: true,
					});

					// Show the unlock popup
					dispatch(
						"popupManager/showPopup",
						{ id: "achievement_synopsis" },
						{ root: true }
					);
				}

				if (
					cardType === "synopsis" &&
					state.products.synopsis.count >= 5 &&
					!state.milestones.fiveSynopses
				) {
					commit("SET_MILESTONE_ACHIEVED", "fiveSynopses");
					commit("UPDATE_STATE_VARIABLE", {
						key: "products.outline.visible",
						value: true,
					});
					dispatch(
						"popupManager/showPopup",
						{ id: "achievement_outline" },
						{ root: true }
					);
				}

				if (
					cardType === "outline" &&
					state.products.outline.count >= 5 &&
					!state.milestones.fiveOutlines
				) {
					commit("SET_MILESTONE_ACHIEVED", "fiveOutlines");
					commit("UPDATE_STATE_VARIABLE", {
						key: "products.treatment.visible",
						value: true,
					});
					dispatch(
						"popupManager/showPopup",
						{ id: "achievement_treatment" },
						{ root: true }
					);
				}

				if (
					cardType === "treatment" &&
					state.products.treatment.count >= 5 &&
					!state.milestones.fiveTreatments
				) {
					commit("SET_MILESTONE_ACHIEVED", "fiveTreatments");
					commit("UPDATE_STATE_VARIABLE", {
						key: "products.draftScript.visible",
						value: true,
					});
					dispatch(
						"popupManager/showPopup",
						{ id: "achievement_draftScript" },
						{ root: true }
					);
				}

				if (
					cardType === "draftScript" &&
					state.products.draftScript.count >= 5 &&
					!state.milestones.fiveDraftScripts
				) {
					commit("SET_MILESTONE_ACHIEVED", "fiveDraftScripts");
					commit("UPDATE_STATE_VARIABLE", {
						key: "products.shootingScript.visible",
						value: true,
					});
					dispatch(
						"popupManager/showPopup",
						{ id: "achievement_shootingScript" },
						{ root: true }
					);
				}
			}

			// Check for dollar-based milestones
			dispatch("checkDollarMilestones");
		},

		// ... existing code ...

		// Add a new action to check for dollar-based unlocks
		checkDollarMilestones({ state, commit, dispatch }) {
			// Check for Writers Room unlock
			if (state.writingDollarCount >= 60 && !state.milestones.sixtyDollars) {
				commit("SET_MILESTONE_ACHIEVED", "sixtyDollars");

				// Unlock Writers Room
				if (!state.writersRoomVisible) {
					commit("UPDATE_STATE_VARIABLE", {
						key: "writersRoomVisible",
						value: true,
					});
					commit("UPDATE_STATE_VARIABLE", {
						key: "workers.intern.visible",
						value: true,
					});

					// Show the unlock popup
					dispatch("popupManager/showPopup", { id: "writersRoom_unlock" });
				}
			}

			// Check for junior writers unlock (after earning more money)
			if (
				state.totalWritingDollarCount >= 200 &&
				!state.workers.junior.visible
			) {
				commit("UPDATE_STATE_VARIABLE", {
					key: "workers.junior.visible",
					value: true,
				});

				dispatch("popupManager/showPopup", { id: "writersRoom_juniorWriters" });
			}

			// Check for screenwriters unlock
			if (
				state.totalWritingDollarCount >= 800 &&
				!state.workers.screenwriter.visible
			) {
				commit("UPDATE_STATE_VARIABLE", {
					key: "workers.screenwriter.visible",
					value: true,
				});

				dispatch("popupManager/showPopup", { id: "writersRoom_screenwriters" });
			}

			// Check for cowriters unlock
			if (
				state.totalWritingDollarCount >= 3000 &&
				!state.workers.cowriters.visible
			) {
				commit("UPDATE_STATE_VARIABLE", {
					key: "workers.cowriters.visible",
					value: true,
				});

				dispatch("popupManager/showPopup", { id: "writersRoom_cowriters" });
			}

			// Check for script doctors unlock
			if (
				state.totalWritingDollarCount >= 10000 &&
				!state.workers.scriptDoctor.visible
			) {
				commit("UPDATE_STATE_VARIABLE", {
					key: "workers.scriptDoctor.visible",
					value: true,
				});

				dispatch("popupManager/showPopup", { id: "writersRoom_scriptDoctors" });
			}
		},

		hireWorker({ commit, state, dispatch, getters }, { cost, name }) {
			// Don't do anything if the user doesn't have enough writing dollars
			if (state.writingDollarCount < cost) {
				console.log(
					`Not enough writing dollars to hire worker. Need ${cost}, have ${state.writingDollarCount}.`
				);
				return;
			}

			// Deduct cost from writing dollars
			commit("DECREASE_WRITING_DOLLAR_AMOUNT", cost);

			// Get the worker type's details
			const workerType = name;
			const worker = state.workers[workerType];

			if (!worker) {
				console.error(`Worker type "${workerType}" not found in state.workers`);
				return;
			}

			// Calculate worker duration
			const duration = worker.duration; // Duration in minutes
			const durationMs = duration * 60 * 1000; // Convert to milliseconds

			// Check if we've already got max capacity
			if (state.currentWorkers.length >= getters.currentWritersRoomCapacity) {
				console.log("Can't hire worker. Writers room at capacity.");
				return;
			}

			// Initialize the worker times array if it doesn't exist
			if (!worker.times) {
				worker.times = {};
			}

			// Generate a unique ID for this worker
			if (!window.nextWorkerId) {
				window.nextWorkerId = 1;
			}
			const id = window.nextWorkerId++;

			// Add worker to state
			commit("ADD_WORKER", { workerType, id });

			// Initialize worker timeout tracking if not done already
			if (!window.workerTimeouts) {
				window.workerTimeouts = [];
			}

			// Set the exact time this worker was hired
			const exactHireTime = Date.now();

			// Calculate animation buffer - animation will start 5 seconds before removal
			const animationBufferMs = 5000; // 5 seconds for animation

			console.log(
				`Worker ${name} (ID: ${id}) hired at ${new Date(
					exactHireTime
				).toLocaleTimeString()} with duration ${duration} minutes. Animation will start ${
					(durationMs - animationBufferMs) / 1000
				}s before removal at exactly ${duration} minutes.`
			);

			// Set timeout to remove worker at exactly the duration (not duration + buffer)
			const timeoutId = setTimeout(() => {
				// Check if worker still exists before removing
				const workerExists = state.currentWorkers.some(
					(worker) => worker.id === id
				);
				if (workerExists) {
					const removeTime = Date.now();
					console.log(
						`Worker ${name} (ID: ${id}) removed at ${new Date(
							removeTime
						).toLocaleTimeString()}, total duration: ${
							(removeTime - exactHireTime) / 1000
						} seconds`
					);
					commit("REMOVE_WORKER", { workerType, id });
				}

				// Remove this timeout from the global array
				const timeoutIndex = window.workerTimeouts.indexOf(timeoutId);
				if (timeoutIndex > -1) {
					window.workerTimeouts.splice(timeoutIndex, 1);
				}
			}, durationMs); // Remove exactly at duration end (not + buffer)

			// Add the timeout ID to the global array
			window.workerTimeouts.push(timeoutId);

			// Store timing information for animation
			commit("UPDATE_WORKER_TIMES", {
				id,
				workerType,
				hireTime: exactHireTime,
				// Start animation 5 seconds before worker removal
				animationStartTime: exactHireTime + durationMs - animationBufferMs,
				// Worker will be removed exactly at duration end
				expectedRemovalTime: exactHireTime + durationMs,
			});

			// Check for worker-based milestones
			if (
				workerType === "intern" &&
				state.workers.intern.count >= 5 &&
				!state.milestones.fiveInterns
			) {
				commit("SET_MILESTONE_ACHIEVED", "fiveInterns");
			}

			if (
				workerType === "junior" &&
				state.workers.junior.count >= 5 &&
				!state.milestones.fiveJuniors
			) {
				commit("SET_MILESTONE_ACHIEVED", "fiveJuniors");
			}

			if (
				workerType === "screenwriter" &&
				state.workers.screenwriter.count >= 5 &&
				!state.milestones.fiveScreenwriters
			) {
				commit("SET_MILESTONE_ACHIEVED", "fiveScreenwriters");
			}

			if (
				workerType === "cowriters" &&
				state.workers.cowriters.count >= 5 &&
				!state.milestones.fiveCowriters
			) {
				commit("SET_MILESTONE_ACHIEVED", "fiveCowriters");
			}

			// Check if we've reached the three workers milestone
			if (state.currentWorkers.length >= 3 && !state.milestones.threeWorkers) {
				commit("SET_MILESTONE_ACHIEVED", "threeWorkers");

				// Make the writers room upgrade visible
				commit("UPDATE_STATE_VARIABLE", {
					key: "writersRoomUpgradeVisible",
					value: true,
				});

				// Show the upgrade popup
				dispatch("popupManager/showPopup", { id: "writersRoom_upgrade" });
			}
		},

		upgradeWritersRoom({ commit, state, dispatch }) {
			// Get next capacity upgrade
			const nextIndex = state.currentCapacityIndex + 1;
			if (nextIndex < state.writersRoomCapacities.length) {
				const upgrade = state.writersRoomCapacities[nextIndex];

				// Deduct the cost
				commit("DECREASE_WRITING_DOLLAR_AMOUNT", upgrade.cost);

				// Upgrade capacity
				commit("UPGRADE_WRITERS_ROOM_CAPACITY");

				// Check for the second writers room upgrade milestone
				if (nextIndex === 2 && !state.milestones.secondWritersRoomUpgrade) {
					commit("SET_MILESTONE_ACHIEVED", "secondWritersRoomUpgrade");

					// Only show the popup for the first capacity upgrade
					dispatch("popupManager/showPopup", {
						id: "writersRoom_capacityUpgrade",
					});
				}
			}
		},

		generateScript({ commit, state, dispatch }, options = {}) {
			// Use the genre from options or fall back to the current genre
			const genre = options.genre || state.currentGenre;
			const title = options.title || "";

			// Get ranges from state
			const roleRange = state.ranges.roleAmount;
			const shotRange = state.ranges.shotAmount;
			const setRange = state.ranges.setAmount;
			const locationRange = state.ranges.locationAmount;

			// Calculate random counts based on ranges
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

			// Initialize arrays for script components
			const roles = [];
			const shots = [];
			const sets = [];
			const locations = [];
			const costumes = [];
			const looks = [];

			// Get content pools from state
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

			// Assign sets randomly from the sets pool
			for (let i = 0; i < numberOfSets; i++) {
				const randomIndex = Math.floor(Math.random() * possibleSets.length);
				sets.push({
					name: possibleSets[randomIndex],
					isBuilt: false,
				});
			}

			// Assign locations randomly from the locations pool
			for (let i = 0; i < numberOfLocations; i++) {
				const randomIndex = Math.floor(
					Math.random() * possibleLocations.length
				);
				locations.push({
					name: possibleLocations[randomIndex],
					isScouted: false,
				});
			}

			// Generate costumes for each role, with a chance of a second costume
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

			// Generate looks for each role, with a chance of a second look
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
				title:
					title ||
					`New ${genre.charAt(0).toUpperCase() + genre.slice(1)} Script`,
				genre,
				roles,
				shots,
				looks,
				sets,
				locations,
				costumes,
				quality: scriptQuality,
				roleDescription: roleDescription,
				description: scriptDescription,
			};

			// Add the script to the store
			commit("ADD_SCRIPT", script);

			// The "script_new" popup has been removed from the game
			// No popup will be shown when generating a script
		},

		deductWorkerWages({ commit, state }) {
			// Calculate total wages based on assigned workers in departments
			const workerRate = 3; // Rate per worker per second
			const departmentWages = Object.values(state.departments).reduce(
				(total, dept) => {
					return total + dept.employees * workerRate;
				},
				0
			);

			// Add wages for searchers and pitchers
			const searcherWages = state.searcherCount * workerRate;
			const pitcherWages = state.pitcherCount * workerRate;
			const totalWages = departmentWages + searcherWages + pitcherWages;

			// Deduct wages if there are any workers
			if (totalWages > 0) {
				commit("DEDUCT_WORKER_WAGES", totalWages);
			}
		},

		purchaseTool({ commit, state, dispatch }, { cost, wordsPerClick }) {
			// Check if the player can afford the tool
			if (state.writingDollarCount >= cost) {
				// Deduct the cost
				commit("DECREASE_WRITING_DOLLAR_AMOUNT", cost);

				// Update the words per click
				commit("SET_WORDS_PER_CLICK", wordsPerClick);

				// Find the next tool in the sequence
				const toolKeys = Object.keys(state.writeTools);
				const currentToolIndex = toolKeys.indexOf(state.currentWriteTool);

				if (currentToolIndex < toolKeys.length - 1) {
					// Set the next tool as current
					const nextToolKey = toolKeys[currentToolIndex + 1];
					commit("SET_NEXT_WRITE_TOOL", nextToolKey);

					// Show a popup for the first tool upgrade
					if (currentToolIndex === 0) {
						dispatch("popupManager/showPopup", {
							id: "achievement_writingTool",
						});
					}
				}

				// Check for word-based milestones
				if (wordsPerClick >= 5 && !state.milestones.genreLevelTwo) {
					commit("SET_MILESTONE_ACHIEVED", "genreLevelTwo");

					// Make the genre switch visible
					commit("UPDATE_STATE_VARIABLE", {
						key: "switchGenreVisible",
						value: true,
					});

					// Show the genre unlock popup
					dispatch("popupManager/showPopup", { id: "genre_unlock" });
				}
			}
		},
	},
});

export default store;
