import { defineStore } from "pinia";

import { usePopupStore } from "./popup";
import { useGuidanceStore } from "@/stores/guidanceStore";
import {
	clearSaveFromLocalStorage,
	createSaveSnapshot,
	downloadSaveSnapshot,
	hydrateSaveSnapshot,
	readRawSaveFromLocalStorage,
	saveSnapshotToLocalStorage,
} from "@/services/saveService";

let nextWorkerId = 1;

// Core game store (migrated from Vuex). Former mutations and actions are both
// Pinia actions; pure pass-through getters were dropped in favor of reading
// state directly.
export const useGameStore = defineStore("game", {
	state: () => ({
		// DYNAMIC VARIABLES BELOW

		studioName: "Click Studios",

		// Phase Unlocks
		isPreproductionUnlocked: false,
		isFilmingUnlocked: false,
		isPostproductionUnlocked: false,
		isMarketingUnlocked: false,
		isReleaseUnlocked: false,

		// Toast notification state
		toastMessage: "",
		toastVisible: false,
		toastType: "temporary", // New property: 'temporary' or 'persistent'

		// Word Variables

			wordCount: 0,
			totalWordCount: 0,
			manualWordBurst: {
				id: 0,
				amount: 0,
			},

		wordAccumulator: 0,
		lastUpdate: 0,

		// Writing Tool
		currentWriteTool: "ballpointPen", // Default write tool available for purchase
		writingToolCardVisible: false,

			// Writers Room
			writerHireVisible: false,
			writersRoomVisible: false,
			currentCapacityIndex: 1, // Keeps track of the current capacity level

		writersRoomUpgradeVisible: false,

		// Dollar Variables
			writingDollarCount: 0,
			totalWritingDollarCount: 0,
			writingDollarBurst: {
				id: 0,
				amount: 0,
			},

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
			// Pre-production milestones
			twoDepartmentHeads: false,
			firstInspirationPoint: false,
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
			// --- Freelancers (temporary, flat fee, manual re-hire) ---
			intern: {
				name: "Intern",
				employment: "freelance",
				count: 0,
				totalcount: 0,
				cost: 25,
				wps: 1,
				duration: 0.5,
				emoji: "🙋",
				visible: false,
			},
			junior: {
				name: "Junior Writer",
				employment: "freelance",
				count: 0,
				totalcount: 0,
				cost: 70,
				wps: 5,
				duration: 1,
				emoji: "🧑‍💻",
				visible: false,
			},
			screenwriter: {
				name: "Freelance Screenwriter",
				employment: "freelance",
				count: 0,
				totalcount: 0,
				cost: 200,
				wps: 15,
				duration: 5,
				emoji: "🧑‍💼",
				visible: false,
			},
			// --- Contract staff (permanent, ramped signing fee, global payday) ---
			staffWriter: {
				name: "Staff Writer",
				employment: "contract",
				count: 0,
				totalcount: 0,
				signingBase: 350,
				cost: 350,
				salary: 40,
				wps: 15,
				emoji: "✍️",
				visible: false,
			},
			seniorStaff: {
				name: "Senior Staff",
				employment: "contract",
				count: 0,
				totalcount: 0,
				signingBase: 3000,
				cost: 3000,
				salary: 150,
				wps: 70,
				emoji: "👥",
				visible: false,
			},
			scriptDoctor: {
				name: "Script Doctor",
				employment: "contract",
				count: 0,
				totalcount: 0,
				signingBase: 24000,
				cost: 24000,
				salary: 600,
				wps: 0,
				effect: 0.2,
				emoji: "👩‍⚕️",
				visible: false,
			},
		},
		currentWorkers: [],
		nextPayrollAt: null,
		payrollWarned: false,

		// Products
		products: {
			logline: {
				title: "Logline",
				emoji: "💡",
				text: "Earn $6",
				cost: 15,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 6,
				visible: true,
			},
			synopsis: {
				title: "Synopsis",
				emoji: "💭",
				text: "Earn $42",
				cost: 120,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 42,
				visible: false,
			},
			outline: {
				title: "Outline",
				emoji: "📋",
				text: "Earn $300",
				cost: 700,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 300,
				visible: false,
			},
			treatment: {
				title: "Treatment",
				emoji: "🗒️",
				text: "Earn $2,000",
				cost: 4000,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 2000,
				visible: false,
			},
			draftScript: {
				title: "Draft Script",
				emoji: "📑",
				text: "Earn $13,000",
				cost: 22000,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 13000,
				visible: false,
			},
			shootingScript: {
				title: "Shooting Script",
				emoji: "📒",
				text: "Greenlight your project.",
				cost: 200000,
				count: 0,
				totalcount: 0,
				currency: "words",
				pay: 150000,
				visible: false,
			},
		},
		writingProductTierOrder: [
			"logline",
			"synopsis",
			"outline",
			"treatment",
			"draftScript",
			"shootingScript",
		],
		currentWritingProductTierIndex: 0,
		// Highest product tier the player is allowed to advance to. Advancement is
		// player-paced (Part 2.3): selling 5 of a tier raises this, but the active
		// card only switches when the player chooses to advance.
		unlockedProductTierIndex: 0,
		writerTierOrder: ["intern", "junior", "screenwriter"],
		contractTierOrder: ["staffWriter", "seniorStaff", "scriptDoctor"],
		currentWriterTierIndex: 0,
		lastWritingProductUpgradeKey: "",
		lastWriterTierUpgradeKey: "",

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

		currentDevelopmentEndpointReached: false,

		// Dialog Box
		activeDialog: null,
		showDialog: false,

		// Pitching Values

		searchesNeeded: 45,

		manualSearchAmount: 1,

		searchesPerSecond: 0,

		pitchesNeeded: 45,

		manualPitchAmount: 1,

		pitchesPerSecond: 0,

		currentInvestor: "",

		currentInvestment: 0,

		searcherCount: 0,
		pitcherCount: 0,
		searcherSpeed: 1,
		pitcherSpeed: 1,

		//PrePro Progress Values

		employeeCount: 0,

		unassignedEmployeeCount: 0,

		// TODO: Change back to 0 after testing
		inspiration: 10,

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
				emoji: "✏️",
				wordsPerClick: 1,
				cost: 0,
			},
			ballpointPen: {
				name: "Ballpoint Pen",
				emoji: "🖊️",
				wordsPerClick: 2,
				cost: 12,
			},
			fountainPen: {
				name: "Fountain Pen",
				emoji: "🖋️",
				wordsPerClick: 4,
				cost: 40,
			},
			typewriter: {
				name: "Typewriter",
				emoji: "📃",
				wordsPerClick: 7,
				cost: 110,
			},
			electricTypewriter: {
				name: "Electric Typewriter",
				emoji: "🖥️",
				wordsPerClick: 14,
				cost: 280,
			},
			wordprocessor: {
				name: "Word Processor",
				emoji: "💻",
				wordsPerClick: 28,
				cost: 650,
			},
			mechanicalKeyboard: {
				name: "Mechanical Keyboard",
				emoji: "⌨️",
				wordsPerClick: 80,
				cost: 2400,
			},
			printingPress: {
				name: "Printing Press",
				emoji: "🗞️",
				wordsPerClick: 300,
				cost: 10000,
			},
			industrialPrinter: {
				name: "Industrial Printer",
				emoji: "🖨️",
				wordsPerClick: 1200,
				cost: 45000,
			},
			printingPlant: {
				name: "Printing Plant",
				emoji: "🏭",
				wordsPerClick: 4500,
				cost: 160000,
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
			mediumInvestors: [
				"Julio Credito",
				"Bill Stacker",
				"Sterling Silverton",
				"Mindy Coinhaver",
				"Ruby Richcraft",
				"Cashmere McBank",
				"Megan Pei-Mintz",
				"Sapphire Spendwell",
				"Inda Blacknow",
				"Perry Platinum",
				"Carter Cash",
				"Cilla Plush",
				"Perry Portpholios",
				"Ainsley Neverbroke",
				"Gabriel Classbuilt",
				"Hugh Gendowment",
				"Felix Funderfield",
				"Mark Etvalue",
				"Simon Stocktrade",
				"Precious Breadwin",
			],
			largeInvestors: [
				"Golda Vaultman",
				"Franklin Fortunato",
				"Monae Indebank",
				"Barnaby Bankroll",
				"Garret Swank",
				"Richie Reserve",
				"Duncan Deposito",
				"Agnes Lavisham",
				"Em Bellish",
				"Magnus Wirefund",
				"Lance Ledger",
				"Phan C. Leighty",
				"Harriet Hedgefunt",
				"Preston Payout",
				"Spiff E. Drescher",
				"Evan Kaust-Lee",
				"Phoebe Giltforth",
				"A. Lottment",
				"Donna Deposito",
				"Wade Garnisher",
			],
			veryLargeInvestors: [
				"Bill Yeun-Ayer",
				"Ty Koons",
				"Jack Pott",
				"Phil Theeritch",
				"Heiress Paris",
				"Billionaire Bob",
				"Daphne Ritz-Astoria",
				"Midas Merrigold",
				"J. Gatbsy",
				"Warren Wealthspring",
				"Tiara D. Lucks",
				"Melinda Moneysea",
				"Heaven Feiner-Theens",
				"Anastasia Astorfeller",
				"Carlos Dewenswell",
				"Bethany Vanderbuff",
				"Ishi Everposh",
				"Geoff Besos",
				"Elan Crust",
				"Mack Zuckerford",
			],
			whaleInvestors: [
				"Bill Yeun-Ayer",
				"Ty Koons",
				"Jack Pott",
				"Phil Theeritch",
				"Heiress Paris",
				"Billionaire Bob",
				"Daphne Ritz-Astoria",
				"Midas Merrigold",
				"J. Gatbsy",
				"Warren Wealthspring",
				"Tiara D. Lucks",
				"Melinda Moneysea",
				"Heaven Feiner-Theens",
				"Anastasia Astorfeller",
				"Carlos Dewenswell",
				"Bethany Vanderbuff",
				"Ishi Everposh",
				"Geoff Besos",
				"Elan Crust",
				"Mack Zuckerford",
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
			smallInvestorPayAmount: [250, 750], // Average 500
			mediumInvestorPayAmount: [600, 2000], // Average 1300 (2.6x)
			largeInvestorPayAmount: [1700, 5100], // Average 3400 (2.6x)
			veryLargeInvestorPayAmount: [4400, 13200], // Average 8800 (2.6x)
			whaleInvestorPayAmount: [11500, 34500], // Average 23000 (2.6x)
		},

		// Investor tier upgrade costs
		investorTierUpgradeCosts: [
			5000, // Small to Medium
			15000, // Medium to Large
			50000, // Large to Very Large
			150000, // Very Large to Whale
		],

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

		secondPhaseSaveState: `{"studioName":"Second Phase Studios","isPreproductionUnlocked":true,"isFilmingUnlocked":true,"isPostproductionUnlocked":false,"isMarketingUnlocked":false,"isReleaseUnlocked":false,"wordCount":674072,"wordsPerSecond":60,"totalWordCount":0,"wordAccumulator":0.5262639998391876,"lastUpdate":1726778515568,"currentWriteTool":"supercomputer","writingToolCardVisible":true,"writersRoomVisible":true,"currentCapacityIndex":6,"writersRoomUpgradeVisible":true,"writingDollarCount":12462,"totalWritingDollarCount":0,"preproDollarCount":0,"totalPreproDollarCount":0,"currentPopup":"shootingScript","popupVisible":false,"scriptDescription":"No script.","roleDescription":"No roles.","currentTitle":"Tomorrow's Tears","currentGenre":"drama","milestones":{"fiveLoglines":true,"fiveSynopses":true,"fiveOutlines":true,"fiveTreatments":true,"fiveDraftScripts":true,"firstShootingScript":false,"fiveInterns":true,"fiveJuniors":true,"fiveScreenwriters":true,"fiveCowriters":false,"fiftyWords":true,"genreLevelTwo":true,"sixtyDollars":true,"threeWorkers":true,"secondWritersRoomUpgrade":true,"twoDepartmentHeads":false,"firstInspirationPoint":false},"genres":{"horror":{"name":"Horror","emoji":"😱","level":1,"wordsNeeded":100,"quality":1,"roles":["Alien","Babysitter","Beast","Clairvoyant","Copycat Killer","Cryptid","Cultist","Cursed One","Dark Magic Priest","Demon","Detective","Exorcist","Final Girl","Fugitive","Ghost","Ghoul","Gravekeeper","Healer","Hermit","Hunter","Mad Scientist","Medium","Mummy","Mutant","Nurse","Occultist","Paranormal Investigator","Phantom","Poltergeist","Recluse","Serial Killer","Shape-shifter","Siren","Skeptic","Sorcerer","Survivor","Vampire","Victim","Werewolf","Witch","Zombie"]},"comedy":{"name":"Comedy","emoji":"🤣","level":1,"wordsNeeded":100,"quality":1,"roles":["Boss","Busybody","Cat Lady","Chef","Conspiracy Theorist","Creep","Diva","Dreamer","Ex-boyfriend","Ex-girlfriend","Fashionista","Gamer","Goofball","Grump","Guru","Hipster","Imposter","Intern","Inventor","Journalist","Kid Genius","Klutz","Magician","Matchmaker","Neighbor","Nerd","Overachiever","Prankster","Psychic","Retiree","Roommate","Schemer","Slacker","Snob","Socialite","Stoner","Tourist","Town Gossip","Twin","Tycoon","Vlogger"]},"drama":{"name":"Drama","emoji":"🥲","level":11,"wordsNeeded":82660,"quality":3.2,"roles":["Activist","Artist","Babysitter","Baron","Brother","Caregiver","Composer","Con Artist","Dancer","Debutante","Diplomat","Divorcee","Envoy","Executive","Fugitive","Godparent","Heiress","Homeless Person","Immigrant","Journalist","Lawyer","Lobbyist","Mentor","Musician","Nomad","Orphan","Philanthropist","Poet","Priest","Prodigy","Rebel","Refugee","Reporter","Sister","Social Worker","Step-parent","Survivor","Teacher","Therapist","Veteran","Widow"]},"action":{"name":"Action","emoji":"😎","level":1,"wordsNeeded":100,"quality":1,"roles":["Accomplice","Arms Dealer","Assassin","Bodyguard","Bounty Hunter","Burglar","CIA Agent","Commando","Conspirator","Cop","Coroner","Deserter","Double Agent","Escape Artist","Fighter Pilot","Gang Leader","Gladiator","Guard","Gun Runner","Hacker","Interrogator","KGB Agent","Martial Artist","Mercenary","MI6 Agent","Ninja","Parole Officer","Pilot","President","Private Investigator","Rebel Leader","Scientist","Secret Service Agent","Security Guard","Smuggler","Sniper","Soldier","Spy Master","Terrorist","Thief","Undercover Agent","Warrior"]}},"switchGenreVisible":true,"workers":{"scriptDoctor":{"name":"Script Doctor","count":4,"totalcount":4,"cost":24000,"wps":0,"duration":120,"emoji":"👩‍⚕️","effect":1.4,"visible":true},"intern":{"name":"Intern","count":0,"totalcount":6,"cost":25,"wps":1,"duration":0.5,"emoji":"🙋","visible":true},"junior":{"name":"Junior","count":0,"totalcount":5,"cost":70,"wps":5,"duration":1,"emoji":"🧑‍💻","visible":true},"screenwriter":{"name":"Screenwriter","count":0,"totalcount":7,"cost":200,"wps":15,"duration":5,"emoji":"🧑‍💼","visible":true},"cowriters":{"name":"Cowriters","count":30,"totalcount":30,"cost":1400,"wps":70,"duration":15,"emoji":"👥","visible":true}},"currentWorkers":[{"workerType":"cowriters","id":1726777959909},{"workerType":"cowriters","id":1726777995344},{"workerType":"cowriters","id":1726778010693},{"workerType":"cowriters","id":1726778086381},{"workerType":"cowriters","id":1726778190795},{"workerType":"cowriters","id":1726778191167},{"workerType":"cowriters","id":1726778191527},{"workerType":"cowriters","id":1726778191863},{"workerType":"cowriters","id":1726778192218},{"workerType":"cowriters","id":1726778192596},{"workerType":"cowriters","id":1726778193016},{"workerType":"cowriters","id":1726778369044},{"workerType":"cowriters","id":1726778369228},{"workerType":"cowriters","id":1726778369380},{"workerType":"cowriters","id":1726778369545},{"workerType":"cowriters","id":1726778370466},{"workerType":"cowriters","id":1726778370659},{"workerType":"scriptDoctor","id":1726778372442},{"workerType":"scriptDoctor","id":1726778373215},{"workerType":"scriptDoctor","id":1726778378033},{"workerType":"cowriters","id":1726778379376},{"workerType":"cowriters","id":1726778383766},{"workerType":"cowriters","id":1726778384210},{"workerType":"cowriters","id":1726778384657},{"workerType":"cowriters","id":1726778391128},{"workerType":"cowriters","id":1726778391295},{"workerType":"cowriters","id":1726778391446},{"workerType":"cowriters","id":1726778405890},{"workerType":"cowriters","id":1726778479914},{"workerType":"cowriters","id":1726778480793},{"workerType":"cowriters","id":1726778481063},{"workerType":"cowriters","id":1726778481242},{"workerType":"cowriters","id":1726778481415},{"workerType":"scriptDoctor","id":1726778485651}],"products":{"logline":{"title":"Logline","emoji":"💡","text":"Earn $6","cost":20,"count":5,"totalcount":0,"currency":"words","pay":6,"visible":true},"synopsis":{"title":"Synopsis","emoji":"💭","text":"Earn $40","cost":120,"count":12,"totalcount":0,"currency":"words","pay":40,"visible":true},"outline":{"title":"Outline","emoji":"📋","text":"Earn $220","cost":800,"count":8,"totalcount":0,"currency":"words","pay":320,"visible":true},"treatment":{"title":"Treatment","emoji":"🗒️","text":"Earn $1,200","cost":5000,"count":13,"totalcount":0,"currency":"words","pay":2200,"visible":true},"draftScript":{"title":"Draft Script","emoji":"📑","text":"Earn $3,000","cost":30000,"count":9,"totalcount":0,"currency":"words","pay":15000,"visible":true},"shootingScript":{"title":"Shooting Script","emoji":"📒","text":"Greenlight your project.","cost":1000000,"count":0,"totalcount":0,"currency":"words","pay":150000,"visible":true}},"currentScript":{"title":"","roles":[],"shots":[],"sets":[],"locations":[],"costumes":[],"looks":[]},"activeDialog":null,"showDialog":false,"searchesNeeded":30,"manualSearchAmount":4,"searchesPerSecond":0,"pitchesNeeded":20,"manualPitchAmount":3,"pitchesPerSecond":0,"currentInvestor":"","currentInvestment":0,"searcherCount":0,"pitcherCount":0,"searcherSpeed":3,"pitcherSpeed":3,"employeeCount":0,"unassignedEmployeeCount":0,"inspiration":0,"popups":{"tutorialOne":{"title":"Name Your Studio","emoji":"✨","text":"Thanks for trying out my game! \\n\\n Name your studio to begin:","inputField":true,"buttonType":"next","nextPopup":"introduction","inputTarget":"studioName"},"introduction":{"title":"Welcome to Hollywood!","emoji":"🎟️","text":"Congratulations on starting your film studio! \\n\\n Fame and fortune await, but the journey begins with Writing. \\n \\n Sell your ideas to other studios until you're ready to make your own scripts!"},"writingTool":{"title":"🔓 Writing Tool Upgrade","emoji":"✒️","text":"They say the pen is mightier than the sword -- so it's definitely mightier than the pencil! \\n\\n You can now upgrade your tool to write more words per click!"},"synopsis":{"title":"🔓 Synopses","emoji":"💭","text":"A synopsis condenses your script's plot into a brief overview. \\n\\n It can be sold for more money per word."},"outline":{"title":"🔓 Outlines","emoji":"📋","text":"An outline lays out the main events of your script in sequence. \\n\\n Selling an outline earns more money per word."},"treatment":{"title":"🔓 Treatments","emoji":"🗒️","text":"A treatment provides a detailed story plan, including character arcs and plot points. \\n\\n Treatments fetch higher prices per word."},"draftScript":{"title":"🔓 Draft Scripts","emoji":"📑","text":"Every great screenplay starts with a first draft. \\n\\n These are quite valuable, but not enough on their own to greenlight a movie."},"shootingScript":{"title":"🔓 Shooting Scripts","emoji":"📒","text":"It can take dozens of revisions -- and millions of words written -- to arrive at a script ready for shooting. \\n\\n Once you've completed a shooting script, you can greenlight the project and move into preproduction!"},"writersRoom":{"title":"🔓 Writers Room","emoji":"🙋","text":"You've unlocked the Writers Room! \\n\\n Here, writers will automatically write words for you for the duration of their hire. \\n\\n To start, you can hire interns for short stints at inexpensive rates."},"juniorWriters":{"title":"🔓 Junior Writers","emoji":"🧑‍💻️","text":"Junior Writers are newcomers to the industry, offering fresh ideas. \\n\\n They write faster and can be hired for longer periods."},"screenwriters":{"title":"🔓 Screenwriters","emoji":"🧑‍💼","text":"Screenwriters are skilled in crafting compelling narratives. \\n\\n They work quickly and are available for extended contracts."},"cowriters":{"title":"🔓 Co-writers","emoji":"👥","text":"Co-writers collaborate on projects, bringing diverse perspectives. \\n\\nThey enhance writing speed and offer prolonged engagement."},"scriptDoctors":{"title":"🔓 Script Doctors","emoji":"👩‍⚕️","text":"Script Doctors work differently! \\n\\n They specialize in polishing and refining screenplays. \\n\\n They won't write words themselves, but can significantly boost your other writers productivity."},"changeGenre":{"title":"🔓 Change Genre","emoji":"🔄","text":"The more experience you have in a genre, the better quality those scripts will be. \\n\\n Switch between genres for a wide-ranging slate of movies, or double down on your favorite!"},"writersRoomCapacityUpgrade":{"title":"🔓 Writers Room Capacity Upgrade","emoji":"🪑","text":"Expand your Writers Room to accommodate more talent. \\n\\n Larger teams lead to faster project development."},"scriptDetails":{"title":"Film Named!","emoji":"📒","text":""}},"writeTools":{"pencil":{"name":"Pencil","emoji":"✍️","wordsPerClick":1,"cost":0},"pen":{"name":"Pen","emoji":"🖊️","wordsPerClick":2,"cost":18},"typewriter":{"name":"Typewriter","emoji":"📃","wordsPerClick":8,"cost":200},"wordprocessor":{"name":"Word Processor","emoji":"⌨️","wordsPerClick":16,"cost":800},"aimodel":{"name":"AI Model","emoji":"🤖","wordsPerClick":60,"cost":2400},"supercomputer":{"name":"Supercomputer","emoji":"🌐","wordsPerClick":2000,"cost":26000},"end":{"name":"End","emoji":"","wordsPerClick":0,"cost":0}},"pools":{"shots":["Aerial","B-Roll","Bird's Eye View","Bokeh","Close-up","Crane","Cutaway","Dolly Zoom","Dutch Angle","Establishing","Extra-wide","Extreme Close-up","Handheld","High Angle","Interior","Jib","Long Take","Low Angle","Master","Medium","Oner","Over-the-shoulder","Overhead","Panning","Pedestal","POV","Rack Focus","Reverse Angle","SnorriCam","Steadicam","Tilt","Tracking","Two-shot","Wide","Slider","Whip Pan","Match Cut","Jump Cut","Insert","Silhouette","Time-lapse","Freeze Frame","Pull-Out","Push-In","Split Screen","Depth of Field","Canted Angle","Reaction","Sequence","360","Point of Interest"],"sets":["Airport","Art Gallery","Backstage","Bedroom","Bridge","Castle","Cemetery","Coffee Shop","Courtroom","Downtown Street","Factory","Farm","Greenhouse","Gym","Harbor","Hospital","Hotel Lobby","Ice Rink","Jazz Club","Library","Mall","Mountain Cabin","Museum","Nightclub","Office","Old Mansion","Planetarium","Restaurant","Rooftop","School","Ski Resort","Subway Station","Traincar","Vineyard","Aquarium","Attic","Boardroom","Bookstore","Botanical Garden","Brewery","Church","Circus","Rooftop","Construction Site","Diner","Dive Bar","Dorm Room","Elevator","Ferry Boat","Fire Station","Garage","Haunted House","Lighthouse","Locker Room","Monastery","Opera House","Palace","Penthouse","Prison Cell","Recording Studio","Saloon","Space Station","Stadium","Temple","Theater","Bunker","Warehouse","Winery","Art Studio","Bakery","Ballroom","Bank","Barn","Basement","Bathroom","Bistro","Boathouse","Boxing Ring","Bridge Underpass","Broadcast Studio","Bungalow","Bus Station","Cafeteria","Candy Store","Car Dealership","Car Wash","Castle Tower","Catacombs","Cattle Farm","Cave Entrance","Cemetery Crypt","Chalet","Chapel","Chess Club","Chicken Coop","Children's Hospital","Cinema","Closet"],"locations":["Beach","Bridge","Campground","Desert","Forest","Highway","Lake","Mountain Cabin","Park","Vineyard","Cave","Country Road","Island","Jungle","Ranch","Ruins","Beach House","Bluff","Boardwalk","Canal","Canyon","Cliffside","College Campus","Bayou","Botanic Garden","Cabin","Riverbank","Meadow","Waterfall","Volcano","Glacier","Marshland","Sand Dunes","Lava Field","Prairie","Fjord","Oasis","Delta","Savanna","Tundra","Alpine Lodge","Hot Springs","Gorge","Plateau","Steppe","Coral Reef","Mangrove Forest","Bamboo Forest","Salt Flats","Sunflower Field","Village Square","Old Town","Old Dockyard","Moors","Valley","Orchard","Skyscraper","Suburbs","Town Hall","City Park","Opera House","Campus","Art Museum","Library","Cathedral","Shopping Mall","Train Station","Airport Terminal","Sports Arena","Theatre","High-rise","Warehouse ","Industrial Park","Convention Center","City Square","Historical Monument","Docklands","Metro Station","Business District","Luxury Hotel","Pedestrian Street","Gothic Quarter","Financial Center","Urban Alley","Rooftop Garden","Abandoned Factory"],"costumes":["Gown","Uniform","Ski Suit","Firefighter's Uniform","Pajamas","Space Suit","Medieval Armor","Victorian Dress","Pirate Outfit","Superhero Costume","Trench Coat","Flapper Dress","Cowboy Outfit","Ninja Attire","Astronaut Suit","Samurai Armor","Diving Suit","Wizard Robes","Viking Garb","Poodle Skirt","Steampunk Outfit","Gladiator Armor","Ballroom Gown","Ballet Costume","Disco Outfit","Military Camouflage","Lab Coat","Chef's Uniform","Flight Attendant Uniform","Wedding Dress","Toga","Egyptian Pharaoh Robe","Knight's Armor","Punk Rock Outfit","Clown Costume","Jumpsuit","Kimono","Lederhosen","Monk's Robes","Nun's Habit","Police Uniform","Driver Suit","Scuba Gear","Soccer Uniform","Tennis Outfit","Vampire Costume","Alien Costume","Angel Wings","Cheerleader Uniform","Jumpsuit","Royal Robe","Lab Uniform","Mime Outfit","Mummy Wraps","Peasant Outfit","Pilgrim Outfit","Sailor Suit","Santa Claus Suit","School Uniform","Scottish Kilt","Tudor Gown","Heavy Jacket","Sundress","Sweatpants","Cardigan","Denim Jeans","Polo Shirt","Leather Jacket","Chinos","Maxi Skirt","Cargo Pants","Tank Top","Linen Shirt","Velvet Blazer","Knit Sweater","Tulle Skirt","Flannel Shirt","High-Waisted Shorts","Bodysuit","Puffer Vest","Silk Blouse","Corduroy Trousers","Graphic Tee","Ballet Flats","Pencil Skirt","Capri Pants","Hooded Sweatshirt","Mock Turtleneck","Romper","Pea Coat","Leggings","Button-Down Shirt","Chambray Dress","Fisherman's Sweater","Joggers","Espadrilles","Wrap Dress","Culottes","Bomber Jacket","Ankle Boots"],"looks":["Glamour Makeup","Beehive Hair","Bruised Cheek","Bald Cap","Bob Wig","Fake Scar","Smokey Eye Makeup","Mohawk","Sunburn Makeup","Neon Eye Shadow","French Twist","Gothic Makeup","Dreadlocks","Old Age Makeup","Finger Waves","Clown Makeup","Buzz Cut","Airbrushed Makeup","Undercut","Zombie Makeup","Cornrows","Metallic Lipstick","Natural Hair","Vampire Makeup","Mullet","Cat Eye Liner","Faux Hawk","SFX Prosthetics","Pixie Cut","Salt and Pepper Wig","Punk Makeup","Ombre Hair","Glitter Makeup","Sideburns","Natural Makeup","High Ponytail","Burn Makeup","Silicone Wound","Futuristic Makeup","Braided Updo","Warrior Marks","Bowl Cut","Perm","Pale Makeup","Quiff","Contouring","Shag Hair","Freckles","Pompadour","Tattoo Cover-Up","Beachy Waves","Drag Makeup","Gory Wound Makeup","Retro Makeup","Wet Look Hair","Alien Makeup","Fishtail Braid","Cyberpunk Makeup"],"smallInvestors":["Penny Spendwell","Elvis Quarterman","Sean Simoleon","Nick L. Endime","Eleanor Plentycents","Macon Green","Bette Sheesflusch","Francis Dollarhyde","Quincy Quarterman","Patsy Pence","Cora Minte","Chuck Change","Owen Priceman","Frankie Fiverly","Tina Tennerson","Sally Centavo","Imelda Glamheel","Petra Pesobeso","Zainab Deenar","Ron Minbee"],"mediumInvestors":["Julio Credito","Bill Stacker","Sterling Silverton","Mindy Coinhaver","Ruby Richcraft","Cashmere McBank","Megan Pei-Mintz","Sapphire Spendwell","Inda Blacknow","Perry Platinum","Carter Cash","Cilla Plush","Perry Portpholios","Ainsley Neverbroke","Gabriel Classbuilt","Hugh Gendowment","Felix Funderfield","Mark Etvalue","Simon Stocktrade","Precious Breadwin"],"largeInvestors":["Golda Vaultman","Franklin Fortunato","Monae Indebank","Barnaby Bankroll","Garret Swank","Richie Reserve","Duncan Deposito","Agnes Lavisham","Em Bellish","Magnus Wirefund","Lance Ledger","Phan C. Leighty","Harriet Hedgefunt","Preston Payout","Spiff E. Drescher","Evan Kaust-Lee","Phoebe Giltforth","A. Lottment","Donna Deposito","Wade Garnisher"],"veryLargeInvestors":["Bill Yeun-Ayer","Ty Koons","Jack Pott","Phil Theeritch","Heiress Paris","Billionaire Bob","Daphne Ritz-Astoria","Midas Merrigold","J. Gatbsy","Warren Wealthspring","Tiara D. Lucks","Melinda Moneysea","Heaven Feiner-Theens","Anastasia Astorfeller","Carlos Dewenswell","Bethany Vanderbuff","Ishi Everposh","Geoff Besos","Elan Crust","Mack Zuckerford"],"whaleInvestors":["Bill Yeun-Ayer","Ty Koons","Jack Pott","Phil Theeritch","Heiress Paris","Billionaire Bob","Daphne Ritz-Astoria","Midas Merrigold","J. Gatbsy","Warren Wealthspring","Tiara D. Lucks","Melinda Moneysea","Heaven Feiner-Theens","Anastasia Astorfeller","Carlos Dewenswell","Bethany Vanderbuff","Ishi Everposh","Geoff Besos","Elan Crust","Mack Zuckerford"]},"ranges":{"roleAmount":[2,5],"shotAmount":[5,15],"locationAmount":[3,11],"setAmount":[2,8],"investorSearchAmount":[100,500],"investorPitchAmount":[100,500],"smallInvestorPayAmount":[2000,10000],"mediumInvestorPayAmount":[650,1950],"largeInvestorPayAmount":[1690,5070],"veryLargeInvestorPayAmount":[4394,13182],"whaleInvestorPayAmount":[11424,34273]},"levelCaps":[0,100,600,1000,2200,4700,10300,22400,48600,105700,229900,500000],"writersRoomCapacities":[{"capacity":0,"cost":0},{"capacity":3,"cost":30},{"capacity":5,"cost":90},{"capacity":9,"cost":270},{"capacity":16,"cost":810},{"capacity":25,"cost":2430},{"capacity":35,"cost":7290},{"capacity":48,"cost":21870},{"capacity":63,"cost":65610},{"capacity":80,"cost":196830},{"capacity":100,"cost":590490}]}`,

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

		// Component visibility tracking for Pre-Production UI
		componentVisibility: {
			hireWorkersCard: false,
			pitchingComponent: false,
			searchersPitchersCard: false,
			inspirationShop: false,
			preproBanner: true,
		},

		// Add current investor tier tracking
		currentInvestorTier: 1, // 1-5 representing the tiers

		// Auto-feature states
		autoSearchEnabled: false,
		autoPitchEnabled: false,
		autoCollectEnabled: false,

		preproUpgradeLevels: {
			searchesPerClick: 0,
			pitchesPerClick: 0,
			workerSearchSpeed: 0,
			workerPitchSpeed: 0,
			shortenSearches: 0,
			betterPitches: 0,
		},
	}),
	getters: {
		wordsPerSecond: (state) => {
			let doctorCount = 0;
			let baseWordsPerSecond = 0;

			Object.values(state.workers).forEach((worker) => {
				if (worker.name === "Script Doctor") {
					doctorCount = worker.count;
				} else {
					baseWordsPerSecond += worker.count * worker.wps;
				}
			});

			const scriptDoctorMultiplier = 1 + (state.workers.scriptDoctor?.effect ?? 0.2) * doctorCount;
			return baseWordsPerSecond * scriptDoctorMultiplier;
		},

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

		filmingShots: (state) => {
			const shots = state.currentScript?.shots || [];
			const currentIndex = shots.findIndex((shot) => !shot.isFilmed);

			return shots.map((shot, index) => {
				let status = "pending";
				if (shot.isFilmed) {
					status = "completed";
				} else if (index === currentIndex) {
					status = "current";
				}

				return { ...shot, id: index + 1, status, score: shot.shotScore };
			});
		},
		filmingShotGoal: (state) => state.currentScript?.shots?.length || 0,
		filmedShotsCount: (state) =>
			(state.currentScript?.shots || []).filter((shot) => shot.isFilmed).length,
		currentFilmingShotIndex: (state) =>
			(state.currentScript?.shots || []).findIndex((shot) => !shot.isFilmed),
		currentFilmingShot(state) {
			const index = this.currentFilmingShotIndex;
			return index >= 0 ? state.currentScript.shots[index] : null;
		},
		averageFilmingScore: (state) => {
			const filmedShots = (state.currentScript?.shots || []).filter(
				(shot) => shot.isFilmed
			);
			if (!filmedShots.length) {
				return 0;
			}
			const totalScore = filmedShots.reduce(
				(total, shot) => total + (shot.shotScore || 0),
				0
			);
			return Math.round(totalScore / filmedShots.length);
		},

		totalRoles(state) {
			if (state.currentScript && Array.isArray(state.currentScript.roles)) {
				return state.currentScript.roles.length;
			}
			return 0;
		},
		completeRolesCount(state) {
			if (state.currentScript && Array.isArray(state.currentScript.roles)) {
				return state.currentScript.roles.filter((role) => role.isCast).length;
			}
			return 0;
		},
		builtSetsCount: (state) =>
			state.currentScript.sets.filter((set) => set.isBuilt).length,
		scoutedLocationsCount: (state) =>
			state.currentScript.locations.filter((location) => location.isScouted)
				.length,
		completeShotsCount: (state) =>
			state.currentScript.shots.filter((shot) => shot.isPlanned).length,
		styledLooksCount: (state) =>
			state.currentScript.looks.filter((look) => look.isDesigned).length,
		madeCostumesCount: (state) =>
			state.currentScript.costumes.filter((costume) => costume.isMade).length,

		currentGenreDetails: (state) => state.genres[state.currentGenre] || {},
		currentToolDetails: (state) => state.writeTools[state.currentWriteTool],
		previousToolDetails: (state) => {
			const toolKeys = Object.keys(state.writeTools);
			const currentToolIndex = toolKeys.indexOf(state.currentWriteTool);
			if (currentToolIndex <= 0) {
				return null;
			}
			return state.writeTools[toolKeys[currentToolIndex - 1]];
		},

		getProductCardDetails: (state) => (key) => state.products[key],
		getWorkerDetails: (state) => (key) => state.workers[key],
		currentWritingProductKey: (state) =>
			state.writingProductTierOrder[state.currentWritingProductTierIndex] ||
			"logline",
		// Player-paced advancement (Part 2.3): true once the next tier is unlocked
		// but the player has not yet chosen to advance to it.
		nextProductTierReady: (state) =>
			state.unlockedProductTierIndex > state.currentWritingProductTierIndex,
		nextProductTierKey: (state) =>
			state.writingProductTierOrder[state.currentWritingProductTierIndex + 1] ||
			null,
		currentMainWriterType: (state) =>
			state.writerTierOrder[state.currentWriterTierIndex] || "intern",
		visibleProductCardTypes: (state) => {
			const productKey =
				state.writingProductTierOrder[state.currentWritingProductTierIndex] ||
				"logline";
			return state.products[productKey] ? [productKey] : [];
		},
		visibleWorkerCardTypes: (state) => {
			const cardTypes = [];
			const mainWriterType =
				state.writerTierOrder[state.currentWriterTierIndex] || "intern";

			if (state.writerHireVisible && state.workers[mainWriterType]?.visible) {
				cardTypes.push(mainWriterType);
			}

			return cardTypes;
		},
		visibleContractCardTypes: (state) =>
			state.contractTierOrder.filter((type) => state.workers[type]?.visible),
		currentWritersRoomCapacity: (state) =>
			state.writersRoomCapacities[state.currentCapacityIndex].capacity,
		currentWorkerAmount: (state) => state.currentWorkers.length,
		nextWritersRoomUpgrade: (state) => {
			const nextIndex = state.currentCapacityIndex + 1;
			if (nextIndex < state.writersRoomCapacities.length) {
				return state.writersRoomCapacities[nextIndex];
			}
			return null;
		},

		currentPopupContent: (state) => {
			if (state.currentPopup && state.popups[state.currentPopup]) {
				return state.popups[state.currentPopup];
			}
			return { title: "", emoji: "", text: "" };
		},

		searchRange: (state) => state.ranges.investorSearchAmount,
		smallInvestorNames: (state) => state.pools.smallInvestors,
		smallInvestorPayRange: (state) => state.ranges.smallInvestorPayAmount,
		pitchRange: (state) => state.ranges.investorPitchAmount,

		canAffordTool: (state) => (cost) => state.writingDollarCount >= cost,
		isToolVisible: (state) => (cost) =>
			cost !== 0 && state.writingToolCardVisible,
	},
	actions: {
		// Save durable game state to localStorage, optionally downloading a backup.
		SAVE_STATE({
			guidanceStore = null,
			preproductionStore = null,
			download = false,
			label = "Save",
		} = {}) {
			const startTime = performance.now();
			const snapshot = createSaveSnapshot({
				gameStore: this,
				guidanceStore,
				preproductionStore,
			});
			const serializedState = saveSnapshotToLocalStorage(snapshot);
			const fileName = download ? downloadSaveSnapshot(snapshot) : "";

			const endTime = performance.now();
			const saveDuration = endTime - startTime;

			console.log(
				`${label} state size: ${new Blob([serializedState]).size} bytes`
			);
			console.log(`${label} took: ${saveDuration.toFixed(2)} milliseconds`);

			if (fileName) {
				console.log(`Downloaded save file: ${fileName}`);
			}

			return {
				snapshot,
				serializedState,
				fileName,
				size: new Blob([serializedState]).size,
				duration: saveDuration,
			};
		},
		// Load durable game state from localStorage, including legacy full-store saves.
		LOAD_STATE({ guidanceStore = null, preproductionStore = null } = {}) {
			const serializedState = localStorage.getItem("gameState");
			if (!serializedState) {
				return false;
			}

			let loadedState = null;
			try {
				loadedState = readRawSaveFromLocalStorage();
			} catch (error) {
				console.warn("Unable to load saved game", error);
				return false;
			}
			const didLoad = hydrateSaveSnapshot(loadedState, {
				gameStore: this,
				guidanceStore,
				preproductionStore,
			});

			if (didLoad) {
				console.log(
					`Loaded state size: ${new Blob([serializedState]).size} bytes`
				);
			}

			return didLoad;
		},
		RESET_STATE({ guidanceStore = null, preproductionStore = null } = {}) {
			clearSaveFromLocalStorage();
			this.$reset();
			preproductionStore?.$reset();
			guidanceStore?.resetGuidance?.();
			console.log("Game reset to a new save state");
		},

		normalizeWritingTierState() {
			const productMilestoneIndex = [
				["fiveLoglines", "synopsis"],
				["fiveSynopses", "outline"],
				["fiveOutlines", "treatment"],
				["fiveTreatments", "draftScript"],
				["fiveDraftScripts", "shootingScript"],
			].reduce((highestIndex, [milestoneKey, productKey]) => {
				if (!this.milestones[milestoneKey]) {
					return highestIndex;
				}
				return Math.max(
					highestIndex,
					this.writingProductTierOrder.indexOf(productKey)
				);
			}, 0);
			const visibleProductIndex = this.writingProductTierOrder.reduce(
				(highestIndex, productKey, index) => {
					if (!this.products[productKey]?.visible) {
						return highestIndex;
					}
					return Math.max(highestIndex, index);
				},
				0
			);
			const savedProductIndex = Number.isInteger(
				this.currentWritingProductTierIndex
			)
				? this.currentWritingProductTierIndex
				: 0;
			// Active tier stays where the player left it; the unlocked ceiling is
			// derived from milestones (player-paced advancement, Part 2.3).
			const activeProductIndex = Math.max(savedProductIndex, visibleProductIndex);
			this.unlockedProductTierIndex = Math.max(
				this.unlockedProductTierIndex || 0,
				activeProductIndex,
				productMilestoneIndex
			);
			this.setWritingProductTierByIndex(activeProductIndex);

			// Remap legacy tool keys so an older save never points at a missing tool.
			const toolKeyRemap = {
				pen: "ballpointPen",
				aimodel: "mechanicalKeyboard",
				renderfarm: "printingPress",
				supercomputer: "industrialPrinter",
			};
			if (toolKeyRemap[this.currentWriteTool]) {
				this.currentWriteTool = toolKeyRemap[this.currentWriteTool];
			}
			if (!this.writeTools[this.currentWriteTool]) {
				this.currentWriteTool = "ballpointPen";
			}
			this.writerHireVisible =
				Boolean(this.writerHireVisible) ||
				this.writersRoomVisible ||
				this.milestones.sixtyDollars;

			const writerDollarIndex = this.milestones.fiveSynopses
				? 2
				: this.totalWritingDollarCount >= 200
					? 1
					: 0;
			const visibleWriterIndex = this.writerTierOrder.reduce(
				(highestIndex, workerType, index) => {
					if (!this.workers[workerType]?.visible) {
						return highestIndex;
					}
					return Math.max(highestIndex, index);
				},
				0
			);
			const writerIndex = Math.max(
				Number.isInteger(this.currentWriterTierIndex)
					? this.currentWriterTierIndex
					: 0,
				writerDollarIndex,
				visibleWriterIndex
			);
			this.setMainWriterTierByIndex(writerIndex);
		},

		setWritingProductTierByIndex(index) {
			const clampedIndex = Math.min(
				Math.max(index, 0),
				this.writingProductTierOrder.length - 1
			);
			this.currentWritingProductTierIndex = clampedIndex;
			const currentProductKey =
				this.writingProductTierOrder[this.currentWritingProductTierIndex];

			this.writingProductTierOrder.forEach((productKey) => {
				if (this.products[productKey]) {
					this.products[productKey].visible = productKey === currentProductKey;
				}
			});
		},

		upgradeWritingProductTier(productKey) {
			const nextIndex = this.writingProductTierOrder.indexOf(productKey);
			if (nextIndex === -1) {
				return;
			}

			this.setWritingProductTierByIndex(nextIndex);
			this.lastWritingProductUpgradeKey = productKey;
		},

		// Raise the unlocked ceiling by one tier without switching the active card.
		// Called when the player sells the 5th of the current tier (Part 2.3).
		unlockNextProductTier() {
			const maxIndex = this.writingProductTierOrder.length - 1;
			this.unlockedProductTierIndex = Math.min(
				Math.max(
					this.unlockedProductTierIndex,
					this.currentWritingProductTierIndex + 1
				),
				maxIndex
			);
		},

		// Player-triggered: graduate to the next unlocked tier (Part 2.3).
		advanceWritingProductTier() {
			if (this.unlockedProductTierIndex <= this.currentWritingProductTierIndex) {
				return;
			}
			const nextIndex = this.currentWritingProductTierIndex + 1;
			this.setWritingProductTierByIndex(nextIndex);
			this.lastWritingProductUpgradeKey =
				this.writingProductTierOrder[nextIndex];
		},

		setMainWriterTierByIndex(index) {
			const clampedIndex = Math.min(
				Math.max(index, 0),
				this.writerTierOrder.length - 1
			);
			this.currentWriterTierIndex = clampedIndex;
			const currentWorkerType =
				this.writerTierOrder[this.currentWriterTierIndex];

				this.writerTierOrder.forEach((workerType) => {
					if (this.workers[workerType]) {
						this.workers[workerType].visible =
							this.writerHireVisible && workerType === currentWorkerType;
					}
				});
		},

		upgradeMainWriterTier(workerType) {
			const nextIndex = this.writerTierOrder.indexOf(workerType);
			if (nextIndex === -1) {
				return;
			}

			this.setMainWriterTierByIndex(nextIndex);
			this.lastWriterTierUpgradeKey = workerType;
		},

		UPDATE_STATE_VARIABLE({ key, value }) {
			// Logic here to travel down nested paths as indicated by the key string
			const keys = key.split("."); // Split the key by periods
			let obj = this.$state;
			for (let i = 0; i < keys.length - 1; i++) {
				if (!obj[keys[i]]) return; // Exit if the path is invalid
				obj = obj[keys[i]];
			}
			if (Object.prototype.hasOwnProperty.call(obj, keys[keys.length - 1])) {
				obj[keys[keys.length - 1]] = value; // Set the value to the last key in the path
			}
		},

		SET_NEXT_WRITE_TOOL(nextToolKey) {
			this.currentWriteTool = nextToolKey;
		},
		SET_CURRENT_GENRE(genre) {
			this.currentGenre = genre;
		},
		UPDATE_GENRE_PROGRESS({ genre, words }) {
			let genreObject = this.genres[genre];
			genreObject.wordsNeeded -= words;

			// Continue to level up as long as there are excess words and not at max level
			while (
				genreObject.wordsNeeded <= 0 &&
				genreObject.level < this.levelCaps.length
			) {
				let excessWords = Math.abs(genreObject.wordsNeeded);
				genreObject.level++;
				// Check if next level exists, otherwise set wordsNeeded to 0
				if (genreObject.level < this.levelCaps.length) {
					genreObject.wordsNeeded =
						this.levelCaps[genreObject.level - 1] - excessWords;
				} else {
					genreObject.wordsNeeded = 0;
				}
				genreObject.quality = 1 + (genreObject.level - 1) * 0.22;
			}
		},

		SET_CURRENT_POPUP(popupKey) {
			this.currentPopup = popupKey;
		},

		SET_POPUP_VISIBLE(isVisible) {
			this.popupVisible = isVisible;
		},

		// See if I can change the script thing so that it uses the set current popup system I'm trying to implement universally.
		TOGGLE_DIALOG(show) {
			this.showDialog = show;
		},
		// DOES THIS NEED TO STAY? AM I USING IT ANYWHERE?
		SET_ACTIVE_DIALOG(dialogName) {
			this.activeDialog = dialogName;
		},

			// Dollars and Words and Variables Such as Those
			INCREASE_WORD_COUNT(amt) {
				this.wordCount += amt;
			},
			TRIGGER_MANUAL_WORD_BURST(amount) {
				this.manualWordBurst = {
					id: this.manualWordBurst.id + 1,
					amount,
				};
			},
			DECREASE_WORD_COUNT(cost) {
				this.wordCount -= cost;
			},
			INCREASE_WRITING_DOLLAR_AMOUNT(pay) {
				this.writingDollarCount += pay;
				this.totalWritingDollarCount += pay;
			},
			TRIGGER_WRITING_DOLLAR_BURST(amount) {
				this.writingDollarBurst = {
					id: this.writingDollarBurst.id + 1,
					amount,
				};
			},
		DECREASE_WRITING_DOLLAR_AMOUNT(cost) {
			this.writingDollarCount -= cost;
		},
		INCREASE_PREPRO_DOLLAR_AMOUNT(pay) {
			this.preproDollarCount += pay;
		},
		DECREASE_PREPRO_DOLLAR_AMOUNT(cost) {
			this.preproDollarCount -= cost;
		},

		ADD_PLAYER_SCRIPT(script) {
			this.uniqueScripts.push(script);
		},
		ADD_WORKER({ workerType, id, signedAt = null }) {
			const entry = { workerType, id };
			if (signedAt !== null) entry.signedAt = signedAt;
			this.currentWorkers.push(entry);
			this.workers[workerType].count++;
			this.workers[workerType].totalcount++;
		},
		REMOVE_WORKER({ workerType, id }) {
			this.currentWorkers = this.currentWorkers.filter(
				(worker) => worker.id !== id
			);
			this.workers[workerType].count--;
		},
		UPGRADE_WRITERS_ROOM_CAPACITY() {
			this.currentCapacityIndex += 1;
		},

		// Mutation to mark a milestone as achieved
		SET_MILESTONE_ACHIEVED(milestoneKey) {
			this.milestones[milestoneKey] = true;
		},

		// Mutation to toggle component visibility
		TOGGLE_COMPONENT_VISIBILITY(componentName) {
			console.log(`Toggling visibility for component: ${componentName}`);

			if (this.products[componentName]) {
				this.products[componentName].visible =
					!this.products[componentName].visible;
				console.log(
					`Product ${componentName} visibility set to: ${this.products[componentName].visible}`
				);
			} else if (this.workers[componentName]) {
				this.workers[componentName].visible =
					!this.workers[componentName].visible;
				console.log(
					`Worker ${componentName} visibility set to: ${this.workers[componentName].visible}`
				);
			} else if (
				this.componentVisibility &&
				componentName in this.componentVisibility
			) {
				this.componentVisibility[componentName] =
					!this.componentVisibility[componentName];
				console.log(
					`Component ${componentName} visibility set to: ${this.componentVisibility[componentName]}`
				);
			} else {
				console.warn(
					`Component ${componentName} not found in any visibility tracking object`
				);
				return;
			}
		},

		// Mutation to add script to list
		ADD_SCRIPT(script) {
			// Directly setting the currentScript with the provided script object
			this.currentScript = script;
			console.log(script);

			// Utilizing the script description constructed in the action
			this.scriptDescription = script.description;
			this.roleDescription = script.roleDescription;

			// Update the script details popup in the popup registry
			if (usePopupStore().popupRegistry) {
				usePopupStore().popupRegistry["script_details"] = {
					...usePopupStore().popupRegistry["script_details"],
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

		SET_SEARCH_COUNT(newValue) {
			this.searchCount = newValue;
		},
		SET_PITCH_COUNT(newValue) {
			this.pitchCount = newValue;
		},

		// Employee Mutations

		HIRE_EMPLOYEE(amt) {
			this.employeeCount += amt;
			this.unassignedEmployeeCount += amt;

			// After hiring employees, check if we need to update milestones
			// This will be called after each employee hire
			this.UPDATE_DEPARTMENT_HEADS_MILESTONE();
		},

		HIRE_DEPARTMENT_HEAD({ departmentId, employee, department, cost }) {
			console.log("Hiring department head...", {
				departmentId,
				employee,
				department,
				cost,
			});

			// Handle the case where we're passing departmentId and employee
			if (departmentId && employee) {
				const dept = this.departments[departmentId];
				if (dept) {
					// Increment the employee count instead of pushing to an array
					dept.employees += 1;
					this.employeeCount++;
					console.log(
						`Incremented employee count for department ${departmentId}`
					);
				}
			}
			// Handle the case where we're passing department and cost
			else if (department && cost !== undefined) {
				this.preproDollarCount -= cost;
				this.departments[department].isLocked = false;
				console.log(
					`Unlocked department ${department} and deducted ${cost} dollars`
				);
			}

			// Instead of just updating the milestone, we need to dispatch the action
			// that will handle showing the popup and making components visible
			// We can't dispatch from a mutation, so we'll use the store instance
			// This will be handled in the next step by the caller
		},

		ASSIGN_EMPLOYEE(amt) {
			this.unassignedEmployeeCount -= amt;
		},

		UNASSIGN_EMPLOYEE(amt) {
			this.unassignedEmployeeCount += amt;
		},

		INCREASE_INSPIRATION(amt) {
			this.inspiration += amt;

			// Instead of directly committing the milestone update,
			// dispatch the action that will handle both the milestone update and visibility toggle
			if (this.inspiration > 0 && !this.milestones.firstInspirationPoint) {
				// Use dispatch via the store instance since we're in a mutation
				this.checkInspirationMilestone();
			}
		},

		DECREASE_INSPIRATION(cost) {
			this.inspiration = Math.max(0, this.inspiration - cost);
		},

		ASSIGN_SEARCHER(amt) {
			this.unassignedEmployeeCount -= amt;
			this.searcherCount += amt;
		},

		UNASSIGN_SEARCHER(amt) {
			this.unassignedEmployeeCount += amt;
			this.searcherCount -= amt;
		},

		ASSIGN_PITCHER(amt) {
			this.unassignedEmployeeCount -= amt;
			this.pitcherCount += amt;
		},

		UNASSIGN_PITCHER(amt) {
			this.pitcherCount -= amt;
		},

		SET_SEARCHER_PITCHER_SPEED(speed = 1) {
			this.searcherSpeed = speed;
			this.pitcherSpeed = speed;
		},

		// Prepro Resource Mutations
		SET_ROLE_CAST({ roleIndex }) {
			if (this.currentScript.roles[roleIndex]) {
				this.currentScript.roles[roleIndex].isCast = true;
			}
		},
		SET_SHOT_PLANNED({ shotIndex }) {
			if (this.currentScript.shots[shotIndex]) {
				this.currentScript.shots[shotIndex].isPlanned = true;
			}
		},
		SET_SHOT_FILMED({ shotIndex, score }) {
			if (this.currentScript.shots[shotIndex]) {
				this.currentScript.shots[shotIndex].isFilmed = true;
				this.currentScript.shots[shotIndex].shotScore = score;
			}
		},
		RESET_FILMING_PROGRESS() {
			(this.currentScript.shots || []).forEach((shot) => {
				shot.isFilmed = false;
				shot.shotScore = null;
			});
			this.currentDevelopmentEndpointReached = false;
		},
		SET_DEVELOPMENT_ENDPOINT_REACHED(value) {
			this.currentDevelopmentEndpointReached = value;
		},
		SET_LOCATION_SCOUTED({ locationIndex }) {
			if (this.currentScript.locations[locationIndex]) {
				this.currentScript.locations[locationIndex].isScouted = true;
			}
		},
		SET_SET_BUILT({ setIndex }) {
			if (this.currentScript.sets[setIndex]) {
				this.currentScript.sets[setIndex].isBuilt = true;
			}
		},
		SET_COSTUME_MADE({ costumeIndex }) {
			if (this.currentScript.costumes[costumeIndex]) {
				this.currentScript.costumes[costumeIndex].isMade = true;
			}
		},
		SET_LOOK_DESIGNED({ lookIndex }) {
			if (this.currentScript.looks[lookIndex]) {
				this.currentScript.looks[lookIndex].isDesigned = true;
			}
		},

		SET_DEPARTMENT_EMPLOYEES({ department, count }) {
			this.departments[department].employees = count;
		},

		SET_DEPARTMENT_LOCK({ department, isLocked }) {
			this.departments[department].isLocked = isLocked;
		},
		DEDUCT_WORKER_WAGES(amount) {
			this.preproDollarCount = Math.max(0, this.preproDollarCount - amount);
		},
		UPDATE_WORKER_TIMES({ id, workerType, hireTime, expectedRemovalTime, animationStartTime }
		) {
			// Initialize times object if it doesn't exist for this worker type
			if (!this.workers[workerType].times) {
				this.workers[workerType].times = {};
			}

			// Only update the specific worker type
			this.workers[workerType].times[id] = {
				hireTime,
				expectedRemovalTime,
				animationStartTime,
			};
		},

		// Toast notification mutations
		SET_TOAST_MESSAGE(message) {
			this.toastMessage = message;
		},

		SET_TOAST_VISIBLE(isVisible) {
			this.toastVisible = isVisible;
		},

		SET_TOAST_TYPE(type) {
			this.toastType = type;
		},

		// Pre-production milestone mutations
		UPDATE_DEPARTMENT_HEADS_MILESTONE() {
			// Check if at least two department heads have been hired
			let departmentHeadCount = 0;

			// Count department heads across all departments
			// A department has a head if it's not locked
			for (const deptKey in this.departments) {
				const dept = this.departments[deptKey];
				if (!dept.isLocked) {
					departmentHeadCount++;
				}
			}

			// Update milestone if two or more department heads are hired
			// Only update if the milestone hasn't been achieved yet
			if (departmentHeadCount >= 2 && !this.milestones.twoDepartmentHeads) {
				this.milestones.twoDepartmentHeads = true;
				console.log("Two department heads milestone achieved!");
			}
		},

		UPDATE_INSPIRATION_MILESTONE() {
			// Check if player has earned their first inspiration point
			if (this.inspiration > 0 && !this.milestones.firstInspirationPoint) {
				this.milestones.firstInspirationPoint = true;
			}
		},

		// Mutations for investor tiers
		UPGRADE_INVESTOR_TIER() {
			if (this.currentInvestorTier < 5) {
				this.currentInvestorTier++;
			}
		},

		// Decrease the pitch range to make pitching faster
		DECREASE_PITCH_RANGE() {
			// Decrease the upper and lower bounds by a percentage (e.g., 10%)
			const currentRange = this.ranges.investorPitchAmount;
			const lowerBound = Math.max(5, Math.floor(currentRange[0] * 0.9)); // Don't go below 5
			const upperBound = Math.max(10, Math.floor(currentRange[1] * 0.9)); // Don't go below 10

			this.ranges.investorPitchAmount = [lowerBound, upperBound];
		},

		// Increase the number of searches per manual click
		INCREASE_MANUAL_SEARCH_AMOUNT(amount) {
			this.manualSearchAmount += amount;
		},

		// Increase the number of pitches per manual click
		INCREASE_MANUAL_PITCH_AMOUNT(amount) {
			this.manualPitchAmount += amount;
		},

		// Increase the search speed for workers
		INCREASE_WORKER_SEARCH_SPEED(amount) {
			this.searcherSpeed += amount;
		},

		// Increase the pitch speed for workers
		INCREASE_WORKER_PITCH_SPEED(amount) {
			this.pitcherSpeed += amount;
		},

		// Decrease the search range to make searching faster
		DECREASE_SEARCH_RANGE() {
			// Decrease the upper and lower bounds by a percentage (e.g., 10%)
			const currentRange = this.ranges.investorSearchAmount;
			const lowerBound = Math.max(5, Math.floor(currentRange[0] * 0.9)); // Don't go below 5
			const upperBound = Math.max(10, Math.floor(currentRange[1] * 0.9)); // Don't go below 10

			this.ranges.investorSearchAmount = [lowerBound, upperBound];
		},

		INCREMENT_PREPRO_UPGRADE_LEVEL(upgradeKey) {
			if (!this.preproUpgradeLevels) {
				this.preproUpgradeLevels = {};
			}

			this.preproUpgradeLevels[upgradeKey] =
				(this.preproUpgradeLevels[upgradeKey] || 0) + 1;
		},

		// Auto-feature mutations
		TOGGLE_AUTO_SEARCH() {
			this.autoSearchEnabled = !this.autoSearchEnabled;
		},

		TOGGLE_AUTO_PITCH() {
			this.autoPitchEnabled = !this.autoPitchEnabled;
		},

		TOGGLE_AUTO_COLLECT() {
			this.autoCollectEnabled = !this.autoCollectEnabled;
		},

		addInspiration(amount) {
			this.INCREASE_INSPIRATION(amount);
			// The milestone check is handled in the INCREASE_INSPIRATION mutation
		},

		wrapCurrentShot(score) {
			const shotIndex = this.currentFilmingShotIndex;
			if (shotIndex < 0) {
				this.showDevelopmentEndpoint();
				return;
			}

			this.SET_SHOT_FILMED({ shotIndex, score });

			if (this.filmedShotsCount >= this.filmingShotGoal) {
				this.showDevelopmentEndpoint();
			}
		},

		showDevelopmentEndpoint({ force = false } = {}) {
			if (!force && this.currentDevelopmentEndpointReached) {
				return;
			}

			this.SET_DEVELOPMENT_ENDPOINT_REACHED(true);
			usePopupStore().showPopup(
				{
					id: "game_developmentComplete",
				}
			);
		},

			increaseWordCount() {
				const previousToolDetails = this.previousToolDetails;
				if (previousToolDetails) {
					const amt = previousToolDetails.wordsPerClick;
					this.INCREASE_WORD_COUNT(amt);
					this.TRIGGER_MANUAL_WORD_BURST(amt);
				} else {
					// Handle the scenario where there is no previous tool
					console.log("No previous tool available to increase word count.");
				}
				if (this.wordCount >= 20) {
					useGuidanceStore().triggerStep("core_story_product");
				}
			},
		updateWordCount() {
			if (!this.lastUpdate) {
				this.lastUpdate = Date.now();
			}

			const step = () => {
				const now = Date.now();
				const deltaTime = (now - this.lastUpdate) / 1000; // Time in seconds since last update
				this.lastUpdate = now; // Update the lastUpdate time

				const wordsPerSecond = this.wordsPerSecond;
				const wordsToAdd = wordsPerSecond * deltaTime; // Keep this fractional

				// Use a proxy accumulator for fractional word counts
				this.wordAccumulator += wordsToAdd;

				if (this.wordAccumulator >= 1) {
					const wholeWords = Math.floor(this.wordAccumulator);
					this.INCREASE_WORD_COUNT(wholeWords);
					this.wordAccumulator -= wholeWords; // Adjust accumulator by subtracting whole words added
				}

				requestAnimationFrame(step);
			}

			requestAnimationFrame(step);
		},
		changeGenre(genre) {
			this.SET_CURRENT_GENRE(genre);
		},

		sellProduct({ cardType, cost, pay }) {
			// Decrease word count by cost
			this.DECREASE_WORD_COUNT(cost);

				if (this.milestones.genreLevelTwo) {
					this.UPDATE_GENRE_PROGRESS({
						genre: this.currentGenre,
						words: cost,
					});
				}

				// Increase writing dollar amount by pay
				this.INCREASE_WRITING_DOLLAR_AMOUNT(pay);
				this.TRIGGER_WRITING_DOLLAR_BURST(pay);

				if (!this.writingToolCardVisible) {
					this.UPDATE_STATE_VARIABLE({
						key: "writingToolCardVisible",
						value: true,
					});
					this.SET_MILESTONE_ACHIEVED("fiftyWords");
					useGuidanceStore().triggerStep("core_tool_upgrade");
				}

			// Increment the product count
			this.UPDATE_STATE_VARIABLE({
				key: `products.${cardType}.count`,
				value: this.products[cardType].count + 1,
			});

			console.log(`Sold ${cardType} for ${pay} dollars (cost: ${cost} words)`);

			// Check if this is a shooting script being sold
			if (cardType === "shootingScript") {
				// If this is the first shooting script, mark the milestone as achieved
				if (!this.milestones.firstShootingScript) {
					// Mark the milestone as achieved
					this.SET_MILESTONE_ACHIEVED("firstShootingScript");

					// Unlock preproduction phase if not already unlocked
					if (!this.isPreproductionUnlocked) {
						this.UPDATE_STATE_VARIABLE({
							key: "isPreproductionUnlocked",
							value: true,
						});

						// Show a toast notification to inform the user that preproduction is unlocked
						this.showPreproductionUnlockedToast();
					}
				}

				// Generate a new script with the current genre
				this.generateScript({
					genre: this.currentGenre,
					skipPopup: true,
				});

				// Ensure the script_details popup is correctly set up with current script information
				const scriptDetails =
					usePopupStore().popupRegistry["script_details"];
				usePopupStore().registerPopup(
					{
						id: "script_details",
						config: {
							...scriptDetails,
							title: this.currentScript.title || "Script Details",
							text: this.scriptDescription,
						},
					}
				);

				// Get the popup from the registry
				const popup =
					usePopupStore().popupRegistry["script_firstShootingScript"];

				// Get the current genre and capitalize the first letter
				const genre = this.currentGenre;
				const capitalizedGenre = genre.charAt(0).toUpperCase() + genre.slice(1);

				// Show the popup with the genre replacement
				usePopupStore().showPopup(
					{
						id: "script_firstShootingScript",
						props: {
							text: popup.text.replace("{genre}", capitalizedGenre),
							onSubmit: (inputValue) => {
								// Update the currentScript title with the input value
								this.UPDATE_STATE_VARIABLE({
									key: "currentScript.title",
									value: inputValue,
								});

								// Update the script_details popup again with the new title
								usePopupStore().registerPopup(
									{
										id: "script_details",
										config: {
											...usePopupStore().popupRegistry["script_details"],
											title: inputValue || "Script Details",
											text: this.scriptDescription,
										},
									}
								);
							},
						},
					}
				);
			} else {
				// Check for product-based milestones
				if (
					cardType === "logline" &&
					this.products.logline.count >= 5 &&
					!this.milestones.fiveLoglines
				) {
					// Mark the milestone as achieved
					this.SET_MILESTONE_ACHIEVED("fiveLoglines");

					this.unlockNextProductTier();

						useGuidanceStore().triggerStep("unlock_synopsis");
				}

				if (
					cardType === "synopsis" &&
					this.products.synopsis.count >= 5 &&
					!this.milestones.fiveSynopses
				) {
						this.SET_MILESTONE_ACHIEVED("fiveSynopses");
						this.unlockNextProductTier();
						useGuidanceStore().triggerStep("unlock_outline");
				}

				if (
					cardType === "outline" &&
					this.products.outline.count >= 5 &&
					!this.milestones.fiveOutlines
				) {
						this.SET_MILESTONE_ACHIEVED("fiveOutlines");
						this.unlockNextProductTier();
						useGuidanceStore().triggerStep("unlock_treatment");
				}

				if (
					cardType === "treatment" &&
					this.products.treatment.count >= 5 &&
					!this.milestones.fiveTreatments
				) {
						this.SET_MILESTONE_ACHIEVED("fiveTreatments");
						this.unlockNextProductTier();
						useGuidanceStore().triggerStep("unlock_draft_script");
				}

				if (
					cardType === "draftScript" &&
					this.products.draftScript.count >= 5 &&
					!this.milestones.fiveDraftScripts
				) {
						this.SET_MILESTONE_ACHIEVED("fiveDraftScripts");
						this.unlockNextProductTier();
						useGuidanceStore().triggerStep("unlock_shooting_script");
				}
			}

			// Check for dollar-based milestones
			this.checkDollarMilestones();
		},

		// ... existing code ...

			// Check for dollar-based and product-milestone-based unlocks
			checkDollarMilestones() {
				// $60: unlock intern hiring (writers room)
				if (this.writingDollarCount >= 60 && !this.milestones.sixtyDollars) {
					this.SET_MILESTONE_ACHIEVED("sixtyDollars");

					if (!this.writerHireVisible) {
						this.UPDATE_STATE_VARIABLE({
							key: "writerHireVisible",
							value: true,
						});
						this.upgradeMainWriterTier("intern");

						useGuidanceStore().triggerStep("unlock_writer_hire");
					}
				}

				// $200: unlock Junior Writer
				if (
					this.totalWritingDollarCount >= 200 &&
					this.currentWriterTierIndex < this.writerTierOrder.indexOf("junior")
				) {
					this.upgradeMainWriterTier("junior");
					useGuidanceStore().triggerStep("unlock_junior_writers");
				}

				// fiveSynopses milestone: unlock Freelance Screenwriter
				if (
					this.milestones.fiveSynopses &&
					this.currentWriterTierIndex < this.writerTierOrder.indexOf("screenwriter")
				) {
					this.upgradeMainWriterTier("screenwriter");
					useGuidanceStore().triggerStep("unlock_screenwriters");
				}

				// fiveOutlines milestone: unlock Staff Writer (contract zone opens)
				if (this.milestones.fiveOutlines && !this.workers.staffWriter?.visible) {
					this.workers.staffWriter.visible = true;
					useGuidanceStore().triggerStep("unlock_staff_writer");
				}

				// fiveTreatments milestone: unlock Senior Staff + Script Doctor
				if (this.milestones.fiveTreatments) {
					if (!this.workers.seniorStaff?.visible) {
						this.workers.seniorStaff.visible = true;
						useGuidanceStore().triggerStep("unlock_senior_staff");
					}
					if (!this.workers.scriptDoctor?.visible) {
						this.workers.scriptDoctor.visible = true;
						useGuidanceStore().triggerStep("unlock_script_doctors");
					}
				}
			},

		hireWorker({ cost, name }) {
			const workerType = name;
			const worker = this.workers[workerType];

			if (!worker) {
				console.error(`Worker type "${workerType}" not found in this.workers`);
				return;
			}

			if (this.writingDollarCount < cost) {
				console.log(
					`Not enough writing dollars to hire worker. Need ${cost}, have ${this.writingDollarCount}.`
				);
				return;
			}

			if (this.currentWorkers.length >= this.currentWritersRoomCapacity) {
				console.log("Can't hire worker. Writers room at capacity.");
				return;
			}

			if (worker.employment === "contract") {
				// --- Contract path: permanent worker, ramped signing fee ---
				this.DECREASE_WRITING_DOLLAR_AMOUNT(cost);

				const id = Date.now() + nextWorkerId++;
				const signedAt = Date.now();

				this.ADD_WORKER({ workerType, id, signedAt });

				if (!this.writersRoomVisible) {
					this.UPDATE_STATE_VARIABLE({ key: "writersRoomVisible", value: true });
					useGuidanceStore().triggerStep("unlock_writers_room");
				}

				// Advance signing fee for next hire
				const newTotalcount = this.workers[workerType].totalcount;
				this.workers[workerType].cost = Math.round(
					worker.signingBase * Math.pow(1.15, newTotalcount)
				);

				// Start global payroll clock on first contract hire
				if (this.nextPayrollAt === null) {
					this.nextPayrollAt = Date.now() + 5 * 60 * 1000;
					this.payrollWarned = false;
				}
			} else {
				// --- Freelance path: timed worker, flat fee ---
				this.DECREASE_WRITING_DOLLAR_AMOUNT(cost);

				const duration = worker.duration; // minutes
				const durationMs = duration * 60 * 1000;

				if (!worker.times) {
					worker.times = {};
				}

				const id = Date.now() + nextWorkerId++;

				this.ADD_WORKER({ workerType, id });

				if (!this.writersRoomVisible) {
					this.UPDATE_STATE_VARIABLE({ key: "writersRoomVisible", value: true });
					useGuidanceStore().triggerStep("unlock_writers_room");
				}

				const exactHireTime = Date.now();
				const animationBufferMs = 5000;

				this.UPDATE_WORKER_TIMES({
					id,
					workerType,
					hireTime: exactHireTime,
					animationStartTime: exactHireTime + durationMs - animationBufferMs,
					expectedRemovalTime: exactHireTime + durationMs,
				});

				// Freelance milestone tracking
				if (workerType === "intern" && this.workers.intern.count >= 5 && !this.milestones.fiveInterns) {
					this.SET_MILESTONE_ACHIEVED("fiveInterns");
				}
				if (workerType === "junior" && this.workers.junior.count >= 5 && !this.milestones.fiveJuniors) {
					this.SET_MILESTONE_ACHIEVED("fiveJuniors");
				}
				if (workerType === "screenwriter" && this.workers.screenwriter.count >= 5 && !this.milestones.fiveScreenwriters) {
					this.SET_MILESTONE_ACHIEVED("fiveScreenwriters");
				}
			}

			// Shared: three-workers milestone triggers room upgrade visibility
			if (this.currentWorkers.length >= 3 && !this.milestones.threeWorkers) {
				this.SET_MILESTONE_ACHIEVED("threeWorkers");
				this.UPDATE_STATE_VARIABLE({ key: "writersRoomUpgradeVisible", value: true });
				useGuidanceStore().triggerStep("unlock_writers_room_upgrade");
			}
		},

		expireWorkers() {
			const now = Date.now();
			this.currentWorkers.forEach(({ workerType, id }) => {
				// Contract workers are permanent — only expire freelancers
				if (this.workers[workerType]?.employment === "contract") return;

				const workerTimes = this.workers[workerType]?.times;
				const expectedRemovalTime = workerTimes?.[id]?.expectedRemovalTime;

				if (expectedRemovalTime && expectedRemovalTime <= now) {
					this.REMOVE_WORKER({ workerType, id });
					delete workerTimes[id];
				}
			});
		},

		processPayroll(now = Date.now()) {
			if (!this.nextPayrollAt) return;

			const paydayMs = 5 * 60 * 1000;

			// Warning: 30s before payday, if projected total exceeds balance
			if (!this.payrollWarned && now >= this.nextPayrollAt - 30000) {
				const eligible = this.currentWorkers.filter((w) => {
					const def = this.workers[w.workerType];
					return (
						def?.employment === "contract" &&
						(w.signedAt ?? now) <= this.nextPayrollAt - paydayMs
					);
				});
				const totalDue = eligible.reduce(
					(sum, w) => sum + (this.workers[w.workerType]?.salary ?? 0),
					0
				);
				if (totalDue > this.writingDollarCount) {
					this.showToast(
						`Payroll due soon — need $${totalDue.toLocaleString()}, you have $${Math.floor(this.writingDollarCount).toLocaleString()}`,
						"temporary"
					);
					this.payrollWarned = true;
				}
			}

			if (now < this.nextPayrollAt) return;

			// Collect eligible contracts (past their first free cycle)
			const eligible = this.currentWorkers.filter((w) => {
				const def = this.workers[w.workerType];
				return (
					def?.employment === "contract" &&
					(w.signedAt ?? now) <= this.nextPayrollAt - paydayMs
				);
			});

			// Sort highest salary first (lapse order)
			const sorted = [...eligible].sort(
				(a, b) =>
					(this.workers[b.workerType]?.salary ?? 0) -
					(this.workers[a.workerType]?.salary ?? 0)
			);

			let totalDue = sorted.reduce(
				(sum, w) => sum + (this.workers[w.workerType]?.salary ?? 0),
				0
			);

			// Lapse highest-salary contracts until affordable
			while (totalDue > this.writingDollarCount && sorted.length > 0) {
				const toLapse = sorted.shift();
				const salary = this.workers[toLapse.workerType]?.salary ?? 0;
				totalDue -= salary;
				const workerName = this.workers[toLapse.workerType]?.name ?? toLapse.workerType;
				this.REMOVE_WORKER({ workerType: toLapse.workerType, id: toLapse.id });
				this.showToast(
					`${workerName} contract lapsed — couldn't make payroll.`,
					"temporary"
				);
			}

			if (totalDue > 0) {
				this.DECREASE_WRITING_DOLLAR_AMOUNT(totalDue);
			}

			this.nextPayrollAt += paydayMs;
			this.payrollWarned = false;
		},

		recomputeContractCosts() {
			// Re-derive signing fees from signingBase * 1.15^totalcount on save load
			["staffWriter", "seniorStaff", "scriptDoctor"].forEach((type) => {
				const worker = this.workers[type];
				if (worker && worker.signingBase != null) {
					worker.cost = Math.round(
						worker.signingBase * Math.pow(1.15, worker.totalcount)
					);
				}
			});
		},

		upgradeWritersRoom() {
			// Get next capacity upgrade
			const nextIndex = this.currentCapacityIndex + 1;
			if (nextIndex < this.writersRoomCapacities.length) {
				const upgrade = this.writersRoomCapacities[nextIndex];

				// Deduct the cost
				this.DECREASE_WRITING_DOLLAR_AMOUNT(upgrade.cost);

				// Upgrade capacity
				this.UPGRADE_WRITERS_ROOM_CAPACITY();

				// Check for the second writers room upgrade milestone
				if (nextIndex === 2 && !this.milestones.secondWritersRoomUpgrade) {
					this.SET_MILESTONE_ACHIEVED("secondWritersRoomUpgrade");

						useGuidanceStore().triggerStep("unlock_writers_room_upgrade");
				}
			}
		},

		generateScript(options = {}) {
			// Use the genre from options or fall back to the current genre
			const genre = options.genre || this.currentGenre;
			const title = options.title || "";

			// Get ranges from state
			const roleRange = this.ranges.roleAmount;
			const shotRange = this.ranges.shotAmount;
			const setRange = this.ranges.setAmount;
			const locationRange = this.ranges.locationAmount;

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
			const possibleRoles = this.genres[genre].roles;
			const possibleShots = this.pools.shots;
			const possibleSets = this.pools.sets;
			const possibleLocations = this.pools.locations;
			const possibleCostumes = this.pools.costumes;
			const possibleLooks = this.pools.looks;
			const scriptQuality = this.genres[genre].quality;

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
					isFilmed: false,
					shotScore: null,
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
				const costumeName = this.pools.costumes[costumeIndex];

				costumes.push({
					name: costumeName,
					role: roles[i].name,
					isMade: false,
				});
				if (Math.random() >= 0.2) {
					const secondCostumeIndex = Math.floor(
						Math.random() * possibleCostumes.length
					);
					const secondCostumeName = this.pools.costumes[secondCostumeIndex];
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
				const lookName = this.pools.looks[lookIndex];

				looks.push({
					name: lookName,
					role: roles[i].name,
					isDesigned: false,
				});
				if (Math.random() >= 0.2) {
					const secondLookIndex = Math.floor(
						Math.random() * possibleLooks.length
					);
					const secondLookName = this.pools.looks[secondLookIndex];
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
			const scriptDescription = `✨ A ${scriptQuality.toFixed(
				1
			)} quality ${genre} script ✨

🎭 ${roles.length} ROLES:
${rolesList}

🎬 ${shots.length} SHOTS:
${shotsList}

🏗️ ${sets.length} SETS:
${setsList}

📍 ${locations.length} LOCATIONS:
${locationsList}

👔 ${costumes.length} COSTUMES:
${costumesList}

💄 ${looks.length} LOOKS:
${looksList}`;

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
			this.ADD_SCRIPT(script);

			// The "script_new" popup has been removed from the game
			// No popup will be shown when generating a script
		},

		deductWorkerWages() {
			// Calculate total wages based on assigned workers in departments
			const workerRate = 3; // Rate per worker per second
			const departmentWages = Object.values(this.departments).reduce(
				(total, dept) => {
					return total + dept.employees * workerRate;
				},
				0
			);

			// Add wages for searchers and pitchers
			const searcherWages = this.searcherCount * workerRate;
			const pitcherWages = this.pitcherCount * workerRate;
			const totalWages = departmentWages + searcherWages + pitcherWages;

			// Deduct wages if there are any workers
			if (totalWages > 0) {
				this.DEDUCT_WORKER_WAGES(totalWages);
			}
		},

		purchaseTool({ cost, wordsPerClick }) {
			// Check if the player can afford the tool
			if (this.writingDollarCount >= cost) {
				// Deduct the cost
				this.DECREASE_WRITING_DOLLAR_AMOUNT(cost);


				// Find the next tool in the sequence
				const toolKeys = Object.keys(this.writeTools);
				const currentToolIndex = toolKeys.indexOf(this.currentWriteTool);

				if (currentToolIndex < toolKeys.length - 1) {
					// Set the next tool as current
					const nextToolKey = toolKeys[currentToolIndex + 1];
					this.SET_NEXT_WRITE_TOOL(nextToolKey);

					}

				// Check for word-based milestones
				if (wordsPerClick >= 5 && !this.milestones.genreLevelTwo) {
					this.SET_MILESTONE_ACHIEVED("genreLevelTwo");

					// Make the genre switch visible
					this.UPDATE_STATE_VARIABLE({
						key: "switchGenreVisible",
						value: true,
					});

						useGuidanceStore().triggerStep("unlock_genre_progress");
					}
			}
		},

		// Show a toast notification when preproduction is unlocked
			showPreproductionUnlockedToast() {
				// Show a persistent toast notification
				this.showToast({
					message:
						"Preproduction phase unlocked! Welcome to your first movie project!",
					type: "persistent",
				});

				useGuidanceStore().triggerStep("unlock_preproduction");
			},

		// Show a toast notification via the store
		showToast(payload) {
			// Handle both string messages and object payloads
			if (typeof payload === "string") {
				this.SET_TOAST_MESSAGE(payload);
				this.SET_TOAST_TYPE("temporary");
				this.SET_TOAST_VISIBLE(true);

				// Auto-hide after 6 seconds for temporary toasts
				setTimeout(() => {
					this.SET_TOAST_VISIBLE(false);
				}, 6000);
			} else {
				const { message, type = "temporary" } = payload;
				this.SET_TOAST_MESSAGE(message);
				this.SET_TOAST_TYPE(type);
				this.SET_TOAST_VISIBLE(true);

				// Auto-hide after 6 seconds for temporary toasts
				if (type === "temporary") {
					setTimeout(() => {
						this.SET_TOAST_VISIBLE(false);
					}, 6000);
				}
			}
		},

		// Pre-production milestone actions
		checkDepartmentHeadsMilestone() {
			// First, check if the milestone is already achieved
			const wasAlreadyAchieved = this.milestones.twoDepartmentHeads;

			// Update the milestone state
			console.log("Checking department heads milestone...");
			this.UPDATE_DEPARTMENT_HEADS_MILESTONE();

			// If milestone was just achieved (wasn't achieved before but is now), show the popup and make components visible
			if (this.milestones.twoDepartmentHeads && !wasAlreadyAchieved) {
				console.log(
					"Two department heads milestone is achieved, showing popup and making components visible"
				);
				// Show the feature unlock popup
				this.showFeatureUnlock({
					popupKey: "feature_hireWorkerUnlock",
				});

				// Make the hire workers card visible if it's not already
				if (!this.componentVisibility.hireWorkersCard) {
					console.log("Making hireWorkersCard visible");
					this.TOGGLE_COMPONENT_VISIBILITY("hireWorkersCard");
				}

				// Make the pitching component visible if it's not already
				if (!this.componentVisibility.pitchingComponent) {
					console.log("Making pitchingComponent visible");
					this.TOGGLE_COMPONENT_VISIBILITY("pitchingComponent");
				}

				// Make the searchers and pitchers card visible if it's not already
				if (!this.componentVisibility.searchersPitchersCard) {
					console.log("Making searchersPitchersCard visible");
					this.TOGGLE_COMPONENT_VISIBILITY("searchersPitchersCard");
				}
			}
		},

		checkInspirationMilestone() {
			this.UPDATE_INSPIRATION_MILESTONE();

			// If milestone was just achieved, show the popup
			if (this.milestones.firstInspirationPoint) {
				this.showFeatureUnlock({
					popupKey: "feature_inspirationShopUnlock",
				});

				// Make the inspiration shop visible if it's not already
				if (!this.componentVisibility.inspirationShop) {
					console.log("Making inspirationShop visible");
					this.TOGGLE_COMPONENT_VISIBILITY("inspirationShop");
				}
			}
		},

			showFeatureUnlock({ popupKey }) {
				const popupData = usePopupStore().popupRegistry[popupKey];
				if (popupData) {
					this.showToast({
						message: `${popupData.title} unlocked!`,
						type: "success",
					});
				}
			},

		// Action to hire a department head
		hireDepartmentHead(payload) {
			console.log("hireDepartmentHead action called with payload:", payload);

			// First, commit the mutation to update the department state
			this.HIRE_DEPARTMENT_HEAD(payload);

			// Then, check if we've reached the milestone for hiring department heads
			this.checkDepartmentHeadsMilestone();
		},

		// Spend inspiration points
		spendInspiration(cost) {
			this.DECREASE_INSPIRATION(cost);
		},
	},
});

export default useGameStore;
