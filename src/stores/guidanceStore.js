import { defineStore } from "pinia";
import { CORE_TUTORIAL_STEP_IDS, guidanceSteps } from "@/data/guidance";

const STORAGE_KEY = "clickStudiosGuidance";

export const useGuidanceStore = defineStore("guidance", {
	state: () => ({
		activeStepId: "",
		completedStepIds: [],
		pendingStepIds: [],
		coreTutorialSkipped: false,
		welcomeCompleted: false,
		hasHydrated: false,
	}),
	getters: {
		activeStep: (state) =>
			state.activeStepId ? guidanceSteps[state.activeStepId] : null,
		isStepComplete: (state) => (stepId) =>
			state.completedStepIds.includes(stepId),
		isCoreStep: () => (stepId) => guidanceSteps[stepId]?.group === "core",
		shouldSuppressStep: (state) => (stepId) => {
			const step = guidanceSteps[stepId];
			return !step || (step.group === "core" && state.coreTutorialSkipped);
		},
	},
	actions: {
		hydrate() {
			if (this.hasHydrated || typeof localStorage === "undefined") {
				this.hasHydrated = true;
				return;
			}

			const serializedState = localStorage.getItem(STORAGE_KEY);
			if (serializedState) {
				try {
					const savedState = JSON.parse(serializedState);
					this.completedStepIds = Array.isArray(savedState.completedStepIds)
						? savedState.completedStepIds
						: [];
					this.coreTutorialSkipped = Boolean(savedState.coreTutorialSkipped);
					this.welcomeCompleted = Boolean(savedState.welcomeCompleted);
				} catch (error) {
					console.warn("Unable to load guidance state", error);
				}
			}

			this.hasHydrated = true;
		},
		persist() {
			if (typeof localStorage === "undefined") {
				return;
			}

			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					completedStepIds: this.completedStepIds,
					coreTutorialSkipped: this.coreTutorialSkipped,
					welcomeCompleted: this.welcomeCompleted,
				})
			);
		},
		markWelcomeComplete() {
			this.welcomeCompleted = true;
			this.persist();
		},
		startCoreTutorial() {
			if (this.coreTutorialSkipped) {
				return;
			}

			const firstIncompleteStepId = CORE_TUTORIAL_STEP_IDS.find(
				(stepId) => !this.completedStepIds.includes(stepId)
			);
			if (firstIncompleteStepId) {
				this.triggerStep(firstIncompleteStepId);
			}
		},
		triggerStep(stepId) {
			if (
				this.shouldSuppressStep(stepId) ||
				this.completedStepIds.includes(stepId) ||
				this.activeStepId === stepId ||
				this.pendingStepIds.includes(stepId)
			) {
				return;
			}

			if (this.activeStepId) {
				this.pendingStepIds.push(stepId);
				return;
			}

			this.activeStepId = stepId;
		},
		completeActiveStep() {
			if (!this.activeStepId) {
				return;
			}

			const completedStep = guidanceSteps[this.activeStepId];
			this.markStepComplete(this.activeStepId);
			this.activeStepId = "";
			if (
				completedStep?.nextStep &&
				!this.shouldSuppressStep(completedStep.nextStep) &&
				!this.completedStepIds.includes(completedStep.nextStep)
			) {
				this.activeStepId = completedStep.nextStep;
				return;
			}
			this.showNextPendingStep();
		},
		markStepComplete(stepId) {
			if (!this.completedStepIds.includes(stepId)) {
				this.completedStepIds.push(stepId);
				this.persist();
			}
		},
		showNextPendingStep() {
			while (this.pendingStepIds.length > 0) {
				const nextStepId = this.pendingStepIds.shift();
				if (
					!this.shouldSuppressStep(nextStepId) &&
					!this.completedStepIds.includes(nextStepId)
				) {
					this.activeStepId = nextStepId;
					return;
				}
			}
		},
		skipCoreTutorial() {
			this.coreTutorialSkipped = true;
			CORE_TUTORIAL_STEP_IDS.forEach((stepId) => this.markStepComplete(stepId));
			this.pendingStepIds = this.pendingStepIds.filter(
				(stepId) => guidanceSteps[stepId]?.group !== "core"
			);
			if (this.activeStep && this.activeStep.group === "core") {
				this.activeStepId = "";
				this.showNextPendingStep();
			}
			this.persist();
		},
		resetGuidance() {
			this.activeStepId = "";
			this.completedStepIds = [];
			this.pendingStepIds = [];
			this.coreTutorialSkipped = false;
			this.welcomeCompleted = false;
			this.hasHydrated = true;

			if (typeof localStorage !== "undefined") {
				localStorage.removeItem(STORAGE_KEY);
			}
		},
	},
});
