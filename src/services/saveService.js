export const SAVE_VERSION = 2;
export const SAVE_STORAGE_KEY = "gameState";
export const AUTO_SAVE_INTERVAL_MS = 30000;

const PRODUCT_PROGRESS_KEYS = ["count", "totalcount", "visible"];
const WORKER_PROGRESS_KEYS = ["count", "totalcount", "visible", "times"];
const GENRE_PROGRESS_KEYS = ["level", "wordsNeeded", "quality"];

const clone = (value) => JSON.parse(JSON.stringify(value));

const hasValue = (value) => value !== undefined && value !== null;

const pickDefined = (source, keys) =>
	keys.reduce((result, key) => {
		if (hasValue(source?.[key])) {
			result[key] = clone(source[key]);
		}
		return result;
	}, {});

const createProgressMap = (source, keys) =>
	Object.entries(source || {}).reduce((result, [id, value]) => {
		result[id] = pickDefined(value, keys);
		return result;
	}, {});

const overlayProgressMap = (defaults, progress = {}) =>
	Object.entries(progress).reduce(
		(result, [id, value]) => {
			if (result[id]) {
				result[id] = {
					...result[id],
					...clone(value),
				};
			}
			return result;
		},
		clone(defaults || {})
	);

const compactProgressMap = (source, keys) =>
	Object.entries(source || {}).reduce((result, [id, value]) => {
		const progress = pickDefined(value, keys);
		if (Object.keys(progress).length > 0) {
			result[id] = progress;
		}
		return result;
	}, {});

export function createSaveSnapshot({
	gameStore,
	guidanceStore = null,
	preproductionStore = null,
	now = new Date(),
} = {}) {
	const state = gameStore.$state || gameStore;

	return {
		version: SAVE_VERSION,
		savedAt: now.toISOString(),
		player: {
			studioName: state.studioName,
			writingDollarCount: state.writingDollarCount,
			totalWritingDollarCount: state.totalWritingDollarCount,
			preproDollarCount: state.preproDollarCount,
			totalPreproDollarCount: state.totalPreproDollarCount,
		},
		progression: {
			isPreproductionUnlocked: state.isPreproductionUnlocked,
			isFilmingUnlocked: state.isFilmingUnlocked,
			isPostproductionUnlocked: state.isPostproductionUnlocked,
			isMarketingUnlocked: state.isMarketingUnlocked,
			isReleaseUnlocked: state.isReleaseUnlocked,
			milestones: clone(state.milestones),
			componentVisibility: clone(state.componentVisibility),
		},
		writing: {
			wordCount: state.wordCount,
			totalWordCount: state.totalWordCount,
			wordAccumulator: state.wordAccumulator,
			lastUpdate: Date.now(),
			currentWriteTool: state.currentWriteTool,
			writingToolCardVisible: state.writingToolCardVisible,
			writerHireVisible: state.writerHireVisible,
			writersRoomVisible: state.writersRoomVisible,
			currentCapacityIndex: state.currentCapacityIndex,
			writersRoomUpgradeVisible: state.writersRoomUpgradeVisible,
			currentGenre: state.currentGenre,
			switchGenreVisible: state.switchGenreVisible,
			genres: compactProgressMap(state.genres, GENRE_PROGRESS_KEYS),
			products: compactProgressMap(state.products, PRODUCT_PROGRESS_KEYS),
			workers: compactProgressMap(state.workers, WORKER_PROGRESS_KEYS),
			currentWorkers: clone(state.currentWorkers),
			nextPayrollAt: state.nextPayrollAt ?? null,
			payrollWarned: Boolean(state.payrollWarned),
			currentWritingProductTierIndex: state.currentWritingProductTierIndex,
			currentWriterTierIndex: state.currentWriterTierIndex,
			lastWritingProductUpgradeKey: state.lastWritingProductUpgradeKey,
			lastWriterTierUpgradeKey: state.lastWriterTierUpgradeKey,
		},
		project: {
			scriptDescription: state.scriptDescription,
			roleDescription: state.roleDescription,
			currentTitle: state.currentTitle,
			currentScript: clone(state.currentScript),
			currentDevelopmentEndpointReached:
				state.currentDevelopmentEndpointReached,
			projectUnlocks: clone(state.projectUnlocks),
		},
		preproduction: {
			searchesNeeded: state.searchesNeeded,
			manualSearchAmount: state.manualSearchAmount,
			searchesPerSecond: state.searchesPerSecond,
			pitchesNeeded: state.pitchesNeeded,
			manualPitchAmount: state.manualPitchAmount,
			pitchesPerSecond: state.pitchesPerSecond,
			currentInvestor: state.currentInvestor,
			currentInvestment: state.currentInvestment,
			searcherCount: state.searcherCount,
			pitcherCount: state.pitcherCount,
			searcherSpeed: state.searcherSpeed,
			pitcherSpeed: state.pitcherSpeed,
			employeeCount: state.employeeCount,
			unassignedEmployeeCount: state.unassignedEmployeeCount,
			inspiration: state.inspiration,
			departments: clone(state.departments),
			currentInvestorTier: state.currentInvestorTier,
			autoSearchEnabled: state.autoSearchEnabled,
			autoPitchEnabled: state.autoPitchEnabled,
			autoCollectEnabled: state.autoCollectEnabled,
			preproUpgradeLevels: clone(state.preproUpgradeLevels),
			departmentProgress: clone(preproductionStore?.departmentProgress || {}),
			lastWageTickAt: preproductionStore?.lastWageTickAt ?? null,
		},
		guidance: {
			completedStepIds: clone(guidanceStore?.completedStepIds || []),
			coreTutorialSkipped: Boolean(guidanceStore?.coreTutorialSkipped),
			welcomeCompleted: Boolean(guidanceStore?.welcomeCompleted),
		},
	};
}

export function serializeSaveSnapshot(snapshot, space = 0) {
	return JSON.stringify(snapshot, null, space);
}

export function saveSnapshotToLocalStorage(snapshot) {
	const serializedState = serializeSaveSnapshot(snapshot);
	localStorage.setItem(SAVE_STORAGE_KEY, serializedState);
	return serializedState;
}

export function clearSaveFromLocalStorage() {
	localStorage.removeItem(SAVE_STORAGE_KEY);
}

export function readRawSaveFromLocalStorage() {
	const serializedState = localStorage.getItem(SAVE_STORAGE_KEY);
	return serializedState ? JSON.parse(serializedState) : null;
}

export function migrateSave(rawSave) {
	if (!rawSave) return null;

	// Run structural migrations before normalization
	let save = rawSave;

	if (!save.version || save.version < 2) {
		save = migrateV1toV2(save);
	}

	if (save.version === SAVE_VERSION) {
		return normalizeVersionTwoSave(save);
	}

	return normalizeVersionTwoSave(adaptLegacySave(save));
}

function migrateV1toV2(rawSave) {
	const state = rawSave.writing || rawSave.game || rawSave.state || rawSave;
	const workers = state.workers || {};

	// Map old cowriters key → seniorStaff
	if (workers.cowriters && !workers.seniorStaff) {
		workers.seniorStaff = {
			count: workers.cowriters.count ?? 0,
			totalcount: workers.cowriters.totalcount ?? 0,
			visible: workers.cowriters.visible ?? false,
		};
		delete workers.cowriters;
	}

	// Clear currentWorkers — treat all as expired to avoid orphaned timers
	if (rawSave.writing) {
		rawSave.writing.workers = workers;
		rawSave.writing.currentWorkers = [];
		rawSave.writing.nextPayrollAt = null;
		rawSave.writing.payrollWarned = false;
	}

	return { ...rawSave, version: 2 };
}

function normalizeVersionTwoSave(save) {
	return {
		version: SAVE_VERSION,
		savedAt: save.savedAt || new Date().toISOString(),
		player: save.player || {},
		progression: {
			...(save.progression || {}),
			milestones: save.progression?.milestones || {},
			componentVisibility: save.progression?.componentVisibility || {},
		},
		writing: {
			...(save.writing || {}),
			genres: save.writing?.genres || {},
			products: save.writing?.products || {},
			workers: save.writing?.workers || {},
			currentWorkers: save.writing?.currentWorkers || [],
			nextPayrollAt: save.writing?.nextPayrollAt ?? null,
			payrollWarned: Boolean(save.writing?.payrollWarned),
		},
		project: save.project || {},
		preproduction: {
			...(save.preproduction || {}),
			departments: save.preproduction?.departments || {},
			preproUpgradeLevels: save.preproduction?.preproUpgradeLevels || {},
			departmentProgress: save.preproduction?.departmentProgress || {},
		},
		guidance: {
			completedStepIds: save.guidance?.completedStepIds || [],
			coreTutorialSkipped: Boolean(save.guidance?.coreTutorialSkipped),
			welcomeCompleted: Boolean(save.guidance?.welcomeCompleted),
		},
	};
}

function adaptLegacySave(rawSave) {
	const state = rawSave.game || rawSave.state || rawSave;

	return {
		version: SAVE_VERSION,
		savedAt: new Date().toISOString(),
		player: pickDefined(state, [
			"studioName",
			"writingDollarCount",
			"totalWritingDollarCount",
			"preproDollarCount",
			"totalPreproDollarCount",
		]),
		progression: {
			...pickDefined(state, [
				"isPreproductionUnlocked",
				"isFilmingUnlocked",
				"isPostproductionUnlocked",
				"isMarketingUnlocked",
				"isReleaseUnlocked",
			]),
			milestones: clone(state.milestones || {}),
			componentVisibility: clone(state.componentVisibility || {}),
		},
		writing: {
			...pickDefined(state, [
				"wordCount",
				"totalWordCount",
				"wordAccumulator",
				"lastUpdate",
				"currentWriteTool",
				"writingToolCardVisible",
				"writerHireVisible",
				"writersRoomVisible",
				"currentCapacityIndex",
				"writersRoomUpgradeVisible",
				"currentGenre",
				"switchGenreVisible",
				"currentWritingProductTierIndex",
				"currentWriterTierIndex",
				"lastWritingProductUpgradeKey",
				"lastWriterTierUpgradeKey",
			]),
			genres: createProgressMap(state.genres, GENRE_PROGRESS_KEYS),
			products: createProgressMap(state.products, PRODUCT_PROGRESS_KEYS),
			workers: createProgressMap(state.workers, WORKER_PROGRESS_KEYS),
			currentWorkers: clone(state.currentWorkers || []),
		},
		project: pickDefined(state, [
			"scriptDescription",
			"roleDescription",
			"currentTitle",
			"currentScript",
			"currentDevelopmentEndpointReached",
		]),
		preproduction: {
			...pickDefined(state, [
				"searchesNeeded",
				"manualSearchAmount",
				"searchesPerSecond",
				"pitchesNeeded",
				"manualPitchAmount",
				"pitchesPerSecond",
				"currentInvestor",
				"currentInvestment",
				"searcherCount",
				"pitcherCount",
				"searcherSpeed",
				"pitcherSpeed",
				"employeeCount",
				"unassignedEmployeeCount",
				"inspiration",
				"departments",
				"currentInvestorTier",
				"autoSearchEnabled",
				"autoPitchEnabled",
				"autoCollectEnabled",
				"preproUpgradeLevels",
			]),
			departmentProgress: {},
			lastWageTickAt: null,
		},
		guidance: {},
	};
}

export function hydrateSaveSnapshot(
	snapshot,
	{ gameStore, guidanceStore = null, preproductionStore = null } = {}
) {
	const save = migrateSave(snapshot);
	if (!save) return false;

	const patch = createGamePatch(save, gameStore.$state || gameStore);
	gameStore.$patch(patch);
	gameStore.normalizeWritingTierState?.();
	gameStore.recomputeContractCosts?.();

	if (preproductionStore) {
		preproductionStore.$patch({
			departmentProgress: clone(save.preproduction.departmentProgress),
			lastWageTickAt: save.preproduction.lastWageTickAt ?? null,
		});
	}

	if (guidanceStore) {
		guidanceStore.$patch({
			completedStepIds: Array.isArray(save.guidance.completedStepIds)
				? clone(save.guidance.completedStepIds)
				: [],
			coreTutorialSkipped: Boolean(save.guidance.coreTutorialSkipped),
			welcomeCompleted: Boolean(save.guidance.welcomeCompleted),
			hasHydrated: true,
		});
		guidanceStore.persist?.();
	}

	return true;
}

function createGamePatch(save, currentState) {
	const { player, progression, writing, project, preproduction } = save;

	return {
		...pickDefined(player, [
			"studioName",
			"writingDollarCount",
			"totalWritingDollarCount",
			"preproDollarCount",
			"totalPreproDollarCount",
		]),
		...pickDefined(progression, [
			"isPreproductionUnlocked",
			"isFilmingUnlocked",
			"isPostproductionUnlocked",
			"isMarketingUnlocked",
			"isReleaseUnlocked",
		]),
		milestones: {
			...clone(currentState.milestones),
			...clone(progression.milestones),
		},
		componentVisibility: {
			...clone(currentState.componentVisibility),
			...clone(progression.componentVisibility),
		},
		...pickDefined(writing, [
			"wordCount",
			"totalWordCount",
			"wordAccumulator",
			"currentWriteTool",
			"writingToolCardVisible",
			"writerHireVisible",
			"writersRoomVisible",
			"currentCapacityIndex",
			"writersRoomUpgradeVisible",
			"currentGenre",
			"switchGenreVisible",
			"currentWritingProductTierIndex",
			"currentWriterTierIndex",
			"lastWritingProductUpgradeKey",
			"lastWriterTierUpgradeKey",
		]),
		lastUpdate: Date.now(),
		genres: overlayProgressMap(currentState.genres, writing.genres),
		products: overlayProgressMap(currentState.products, writing.products),
		workers: overlayProgressMap(currentState.workers, writing.workers),
		currentWorkers: clone(writing.currentWorkers),
		nextPayrollAt: writing.nextPayrollAt ?? null,
		payrollWarned: Boolean(writing.payrollWarned),
		...pickDefined(project, [
			"scriptDescription",
			"roleDescription",
			"currentTitle",
			"currentScript",
			"currentDevelopmentEndpointReached",
		]),
		projectUnlocks: {
			...clone(currentState.projectUnlocks),
			...clone(project.projectUnlocks || {}),
			roles: {
				...clone(currentState.projectUnlocks?.roles),
				...clone(project.projectUnlocks?.roles || {}),
			},
		},
		...pickDefined(preproduction, [
			"searchesNeeded",
			"manualSearchAmount",
			"searchesPerSecond",
			"pitchesNeeded",
			"manualPitchAmount",
			"pitchesPerSecond",
			"currentInvestor",
			"currentInvestment",
			"searcherCount",
			"pitcherCount",
			"searcherSpeed",
			"pitcherSpeed",
			"employeeCount",
			"unassignedEmployeeCount",
			"inspiration",
			"currentInvestorTier",
			"autoSearchEnabled",
			"autoPitchEnabled",
			"autoCollectEnabled",
		]),
		departments: overlayProgressMap(
			currentState.departments,
			preproduction.departments
		),
		preproUpgradeLevels: {
			...clone(currentState.preproUpgradeLevels),
			...clone(preproduction.preproUpgradeLevels),
		},
		toastMessage: "",
		toastVisible: false,
		toastType: "temporary",
		currentPopup: null,
		popupVisible: false,
		activeDialog: null,
		showDialog: false,
		manualWordBurst: {
			id: currentState.manualWordBurst?.id || 0,
			amount: 0,
		},
		writingDollarBurst: {
			id: currentState.writingDollarBurst?.id || 0,
			amount: 0,
		},
	};
}

export function createSaveFileName(snapshot) {
	const studioName = sanitizeFilePart(
		snapshot?.player?.studioName || "Click Studios"
	);
	const timestamp = formatLocalTimestamp(snapshot?.savedAt);
	return `Click Studios - ${studioName} - ${timestamp}.json`;
}

export function downloadSaveSnapshot(snapshot) {
	const serializedState = serializeSaveSnapshot(snapshot, 2);
	const blob = new Blob([serializedState], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");

	link.href = url;
	link.download = createSaveFileName(snapshot);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);

	return link.download;
}

function sanitizeFilePart(value) {
	const sanitized = String(value)
		.replace(/[^a-z0-9 _-]/gi, "")
		.trim()
		.replace(/\s+/g, " ");

	return sanitized || "Click Studios";
}

function formatLocalTimestamp(savedAt) {
	const date = savedAt ? new Date(savedAt) : new Date();
	const pad = (value) => String(value).padStart(2, "0");

	return [
		date.getFullYear(),
		pad(date.getMonth() + 1),
		pad(date.getDate()),
	].join("-") +
		` ${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(
			date.getSeconds()
		)}`;
}
