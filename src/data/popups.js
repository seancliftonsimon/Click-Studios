// Standardized popup configuration format
// Required fields:
// - id: Unique identifier
// - type: Popup type (info, input, confirm, list, custom)
// - title: Popup title
// - text: Main content text
// Optional fields:
// - emoji: Optional emoji icon
// - theme: Visual theme
// - buttonText: Text for the primary button
// - Type-specific properties (inputTarget, confirmAction, etc.)

// Tutorial Popups
export const tutorialPopups = {
	welcome: {
		id: "tutorial_welcome",
		type: "input",
		title: "Name Your Studio",
		emoji: "✨",
		text: "Thanks for trying out my game! \n\n Name your studio to begin:",
		buttonText: "Next",
		inputTarget: "studioName",
		nextPopup: "tutorial_introduction",
		theme: "tutorial",
	},
	introduction: {
		id: "tutorial_introduction",
		type: "info",
		title: "Welcome to Hollywood!",
		emoji: "🎟️",
		text: "Congratulations on starting your film studio! \n\n Fame and fortune await, but the journey begins with Writing. \n \n Sell your ideas to other studios until you're ready to make your own scripts!",
		buttonText: "Close",
		theme: "tutorial",
	},
};

// Achievement Popups
export const achievementPopups = {
	writingTool: {
		id: "achievement_writingTool",
		type: "info",
		title: "🔓 Writing Tool Upgrade",
		emoji: "✒️",
		text: "They say the pen is mightier than the sword -- so it's definitely mightier than the pencil! \n\n You can now upgrade your tool to write more words per click!",
		buttonText: "Great!",
		theme: "achievement",
	},
	synopsis: {
		id: "achievement_synopsis",
		type: "info",
		title: "🔓 Synopses",
		emoji: "💭",
		text: "A synopsis condenses your script's plot into a brief overview. \n\n It can be sold for more money per word.",
		buttonText: "Great!",
		theme: "achievement",
	},
	outline: {
		id: "achievement_outline",
		type: "info",
		title: "🔓 Outlines",
		emoji: "📋",
		text: "An outline lays out the main events of your script in sequence. \n\n Selling an outline earns more money per word.",
		buttonText: "Great!",
		theme: "achievement",
	},
	treatment: {
		id: "achievement_treatment",
		type: "info",
		title: "🔓 Treatments",
		emoji: "🗒️",
		text: "A treatment provides a detailed story plan, including character arcs and plot points. \n\n Treatments fetch higher prices per word.",
		buttonText: "Great!",
		theme: "achievement",
	},
	draftScript: {
		id: "achievement_draftScript",
		type: "info",
		title: "🔓 Draft Scripts",
		emoji: "📑",
		text: "Every great screenplay starts with a first draft. \n\n These are quite valuable, but not enough on their own to greenlight a movie.",
		buttonText: "Great!",
		theme: "achievement",
	},
	shootingScript: {
		id: "achievement_shootingScript",
		type: "info",
		title: "🔓 Shooting Scripts",
		emoji: "📒",
		text: "It can take dozens of revisions -- and millions of words written -- to arrive at a script ready for shooting. \n\n Once you've completed a shooting script, you can greenlight the project and move into preproduction!",
		buttonText: "Great!",
		theme: "achievement",
	},
	changeGenre: {
		id: "achievement_changeGenre",
		type: "info",
		title: "🔓 Change Genre",
		emoji: "🔄",
		text: "The more experience you have in a genre, the better quality those scripts will be. \n\n Switch between genres for a wide-ranging slate of movies, or double down on your favorite!",
		buttonText: "Great!",
		theme: "achievement",
	},
	filmingUnlocked: {
		id: "achievement_filmingUnlocked",
		type: "info",
		title: "🔓 Filming Phase",
		emoji: "🎬",
		text: "Congratulations! You've completed all preproduction tasks and can now move into filming. \n\n It's time to bring your script to life on set!",
		buttonText: "Action!",
		theme: "achievement",
	},
};

// Writers Room Popups
export const writersRoomPopups = {
	unlock: {
		id: "writersRoom_unlock",
		type: "info",
		title: "🔓 Writers Room",
		emoji: "🙋",
		text: "You've unlocked the Writers Room! \n\n Here, writers will automatically write words for you for the duration of their hire. \n\n To start, you can hire interns for short stints at inexpensive rates.",
		buttonText: "Great!",
		theme: "achievement",
	},
	juniorWriters: {
		id: "writersRoom_juniorWriters",
		type: "info",
		title: "🔓 Junior Writers",
		emoji: "🧑‍💻️",
		text: "Junior Writers are newcomers to the industry, offering fresh ideas. \n\n They write faster and can be hired for longer periods.",
		buttonText: "Great!",
		theme: "achievement",
	},
	screenwriters: {
		id: "writersRoom_screenwriters",
		type: "info",
		title: "🔓 Screenwriters",
		emoji: "🧑‍💼",
		text: "Screenwriters are skilled in crafting compelling narratives. \n\n They work quickly and are available for extended contracts.",
		buttonText: "Great!",
		theme: "achievement",
	},
	cowriters: {
		id: "writersRoom_cowriters",
		type: "info",
		title: "🔓 Co-writers",
		emoji: "👥",
		text: "Co-writers collaborate on projects, bringing diverse perspectives. \n\nThey enhance writing speed and offer prolonged engagement.",
		buttonText: "Great!",
		theme: "achievement",
	},
	scriptDoctors: {
		id: "writersRoom_scriptDoctors",
		type: "info",
		title: "🔓 Script Doctors",
		emoji: "👩‍⚕️",
		text: "Script Doctors work differently! \n\n They specialize in polishing and refining screenplays. \n\n They won't write words themselves, but can significantly boost your other writers productivity.",
		buttonText: "Great!",
		theme: "achievement",
	},
	upgrade: {
		id: "writersRoom_upgrade",
		type: "info",
		title: "🔓 Writers Room Upgrade",
		emoji: "🏢",
		text: "You've hired enough writers to justify a bigger space! \n\n You can now upgrade your Writers Room to accommodate more writers at once.",
		buttonText: "Great!",
		theme: "achievement",
	},
	capacityUpgrade: {
		id: "writersRoom_capacityUpgrade",
		type: "info",
		title: "🔓 Writers Room Capacity Upgrade",
		emoji: "🪑",
		text: "Expand your Writers Room to accommodate more talent. \n\n Larger teams lead to faster project development.",
		buttonText: "Great!",
		theme: "achievement",
	},
};

// Script Popups
export const scriptPopups = {
	new: {
		id: "script_new",
		type: "info",
		title: "New Script",
		emoji: "📝",
		text: "You've started a new script!",
		buttonText: "Begin Writing",
		theme: "default",
	},
	details: {
		id: "script_details",
		type: "info",
		title: "Script Details",
		emoji: "📒",
		text: "",
		buttonText: "Let's Get Started!",
		theme: "achievement",
	},
	firstShootingScript: {
		id: "script_firstShootingScript",
		type: "input",
		title: "Your First Shooting Script!",
		emoji: "🎬",
		text: "Congratulations! You've completed your first shooting script and can now move into preproduction. What would you like to name your {genre} script?",
		buttonText: "Let's Make a Movie!",
		inputTarget: "currentScript.title",
		nextPopup: "script_details",
		theme: "achievement",
	},
};

// Confirmation Popups
export const confirmationPopups = {
	deleteSave: {
		id: "confirm_deleteSave",
		type: "confirm",
		title: "Delete Save",
		text: "Are you sure you want to delete your save game? This cannot be undone.",
		confirmText: "Delete",
		cancelText: "Cancel",
		confirmColor: "error",
		theme: "error",
	},
};

// Feature Unlock Popups
export const featureUnlockPopups = {
	genreUnlock: {
		id: "genre_unlock",
		type: "info",
		title: "🔓 Genre Selection",
		emoji: "🎭",
		text: "You've unlocked the ability to switch between different genres! \n\n Each genre has its own progression and quality levels. \n\n Experiment with different genres to find your studio's specialty.",
		buttonText: "Great!",
		theme: "achievement",
	},
};

// Game Phase Popups
export const gamePhasePopups = {
	// Add game phase popups here
};

// Error Popups
export const errorPopups = {
	generic: {
		id: "error_generic",
		type: "info",
		title: "Error",
		emoji: "⚠️",
		text: "An error occurred. Please try again.",
		buttonText: "OK",
		theme: "error",
	},
};

// Mapping from old popup keys to new popup keys for backward compatibility
export const popupKeyMapping = {
	tutorialOne: "tutorial_welcome",
	introduction: "tutorial_introduction",
	writingTool: "achievement_writingTool",
	synopsis: "achievement_synopsis",
	outline: "achievement_outline",
	treatment: "achievement_treatment",
	draftScript: "achievement_draftScript",
	shootingScript: "achievement_shootingScript",
	writersRoom: "writersRoom_unlock",
	juniorWriters: "writersRoom_juniorWriters",
	screenwriters: "writersRoom_screenwriters",
	cowriters: "writersRoom_cowriters",
	scriptDoctors: "writersRoom_scriptDoctors",
	changeGenre: "achievement_changeGenre",
	writersRoomCapacityUpgrade: "writersRoom_capacityUpgrade",
	newScript: "script_new",
	scriptDetails: "script_details",
	writersRoom_upgrade: "writersRoom_upgrade",
	genre_unlock: "genre_unlock",
	filmingUnlocked: "achievement_filmingUnlocked",
	firstShootingScript: "script_firstShootingScript",
};

// Registration function to load all popup definitions
export function registerAllPopups(store) {
	// Register all popup groups
	const popupGroups = {
		tutorial: tutorialPopups,
		achievement: achievementPopups,
		writersRoom: writersRoomPopups,
		script: scriptPopups,
		confirmation: confirmationPopups,
		featureUnlock: featureUnlockPopups,
		gamePhase: gamePhasePopups,
		error: errorPopups,
	};

	// Register each group
	// eslint-disable-next-line no-unused-vars
	Object.entries(popupGroups).forEach(([, popupGroup]) => {
		// Register the group
		store.dispatch("popupManager/registerPopupGroup", popupGroup);
	});

	console.log("All popups registered successfully");
}
