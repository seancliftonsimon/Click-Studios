import { defineStore } from "pinia";
import legacyStore from "@/store";
import {
	departmentProgressMax,
	preproductionDepartments,
} from "@/data/preproductionDepartments";
import { investorTierUpgradeCosts, preproductionBalance } from "@/data/balance";

const createProgress = () => ({ barOne: 0, barTwo: 0, barThree: 0 });

export const usePreproductionStore = defineStore("preproduction", {
	state: () => ({
		departmentProgress: {},
		departmentMaxValues: {},
		lastWageTickAt: null,
	}),
	getters: {
		departments() {
			return legacyStore.state.departments;
		},
		componentVisibility() {
			return legacyStore.state.componentVisibility;
		},
		preproDollarCount() {
			return legacyStore.state.preproDollarCount;
		},
		unassignedEmployeeCount() {
			return legacyStore.state.unassignedEmployeeCount;
		},
		currentInvestorTier() {
			return legacyStore.state.currentInvestorTier;
		},
		investorUpgradeCost() {
			return investorTierUpgradeCosts[this.currentInvestorTier - 1] || 0;
		},
		departmentConfigs() {
			return preproductionDepartments;
		},
	},
	actions: {
		isDepartmentLocked(departmentId) {
			return this.departments[departmentId]?.isLocked ?? true;
		},
		departmentEmployees(departmentId) {
			return this.departments[departmentId]?.employees || 0;
		},
		setDepartmentEmployees(departmentId, count) {
			legacyStore.commit("SET_DEPARTMENT_EMPLOYEES", {
				department: departmentId,
				count: Math.max(0, count),
			});
		},
		assignDepartmentEmployee(departmentId) {
			if (this.unassignedEmployeeCount <= 0) return;
			legacyStore.commit("ASSIGN_EMPLOYEE", 1);
			this.setDepartmentEmployees(
				departmentId,
				this.departmentEmployees(departmentId) + 1
			);
		},
		unassignDepartmentEmployee(departmentId) {
			if (this.departmentEmployees(departmentId) <= 0) return;
			legacyStore.commit("UNASSIGN_EMPLOYEE", 1);
			this.setDepartmentEmployees(
				departmentId,
				this.departmentEmployees(departmentId) - 1
			);
		},
		unassignAllDepartmentEmployees(departmentId) {
			while (this.departmentEmployees(departmentId) > 0) {
				this.unassignDepartmentEmployee(departmentId);
			}
		},
		hireDepartmentHead(departmentId) {
			legacyStore.dispatch("hireDepartmentHead", {
				department: departmentId,
				cost: preproductionBalance.departmentHeadCost,
			});
			legacyStore.commit("HIRE_EMPLOYEE", 1);
			this.assignDepartmentEmployee(departmentId);
		},
		upgradeInvestors() {
			if (
				this.currentInvestorTier >= 5 ||
				this.preproDollarCount < this.investorUpgradeCost
			) {
				return false;
			}

			legacyStore.commit("DECREASE_PREPRO_DOLLAR_AMOUNT", this.investorUpgradeCost);
			legacyStore.commit("UPGRADE_INVESTOR_TIER");
			return true;
		},
		initializeDepartmentProgress(departmentId, maxValues = departmentProgressMax) {
			if (!this.departmentProgress[departmentId]) {
				this.departmentProgress[departmentId] = createProgress();
			}
			this.departmentMaxValues[departmentId] = {
				...departmentProgressMax,
				...maxValues,
			};
		},
		getDepartmentProgress(departmentId) {
			this.initializeDepartmentProgress(departmentId);
			return this.departmentProgress[departmentId];
		},
		resetDepartmentProgress(departmentId) {
			this.departmentProgress[departmentId] = createProgress();
		},
		advanceDepartmentProgress(departmentId, amount, maxValues = departmentProgressMax) {
			this.initializeDepartmentProgress(departmentId, maxValues);
			const maxVals = this.departmentMaxValues[departmentId];
			const progress = { ...this.departmentProgress[departmentId] };

			progress.barThree += amount;

			while (progress.barThree >= maxVals.barThree) {
				progress.barThree -= maxVals.barThree;
				progress.barTwo += 1;
			}

			while (progress.barTwo >= maxVals.barTwo) {
				progress.barTwo -= maxVals.barTwo;
				progress.barOne += 1;
			}

			if (progress.barOne > maxVals.barOne) {
				progress.barOne = maxVals.barOne;
			}

			this.departmentProgress[departmentId] = progress;
			return progress.barOne >= maxVals.barOne;
		},
		deductWorkerWages(elapsedSeconds = 1) {
			const departmentWages = Object.values(this.departments).reduce(
				(total, dept) =>
					total +
					dept.employees *
						preproductionBalance.workerWagePerSecond *
						elapsedSeconds,
				0
			);
			const searcherWages =
				legacyStore.state.searcherCount *
				preproductionBalance.workerWagePerSecond *
				elapsedSeconds;
			const pitcherWages =
				legacyStore.state.pitcherCount *
				preproductionBalance.workerWagePerSecond *
				elapsedSeconds;
			const totalWages = Math.floor(departmentWages + searcherWages + pitcherWages);

			if (totalWages > 0) {
				legacyStore.commit("DEDUCT_WORKER_WAGES", totalWages);
			}
		},
		addInspiration(amount = 1) {
			legacyStore.commit("INCREASE_INSPIRATION", amount);
		},
	},
});
