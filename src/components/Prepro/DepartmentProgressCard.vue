<template>
	<v-container>
		<v-card class="d-flex flex-column align-center">
			<h3>{{ config.emoji }} {{ config.title }}</h3>

			<v-container v-show="deptLocked" align="center">
				<span>{{ config.hireLabel }}</span>
				<v-btn :disabled="!canAffordHire" @click="hireDeptHead">
					${{ departmentHeadCost }}
				</v-btn>
			</v-container>

			<v-container v-show="!deptLocked && hasItemsToComplete" class="py-0">
				<h4 class="py-0" align="center">
					{{ currentItem ? currentItem.name : config.emptyText }}
				</h4>

				<v-list class="pl-0">
					<v-list-item
						v-for="bar in progressBars"
						:key="bar.key"
						:style="{ color: bar.color }"
						class="px-0"
					>
						<v-col class="pa-0">
							<h3>{{ bar.label }}</h3>
							<v-progress-linear
								class="department-progress"
								:model-value="bar.value"
								:max="bar.max"
							/>
							<v-row class="justify-space-between">
								<span class="ml-3 mt-2">{{ formatProgress(bar.value) }}</span>
								<span class="mr-2 mt-2">{{ bar.max }}</span>
							</v-row>
						</v-col>
					</v-list-item>
				</v-list>

				<div class="d-flex justify-center">
					<v-btn @click="updateProgressOnClick">+{{ ticksPerClick }}</v-btn>
				</div>

				<br />
				<v-divider class="py-1"></v-divider>

				<v-row class="py-5 justify-center align-center">
					<v-btn
						v-show="isHireWorkersVisible"
						@click="unassignEmployee"
						class="plus-minus mx-1"
						:disabled="localEmployees <= 0"
					>
						-
					</v-btn>
					<span class="mx-1">👤{{ localEmployees }}</span>
					<v-btn
						v-show="isHireWorkersVisible"
						@click="assignEmployee"
						class="plus-minus mx-1"
						:disabled="!hasUnassignedEmployees"
					>
						+
					</v-btn>
					<span class="text-center mx-1">{{ ticksPerSecond }}ps</span>
				</v-row>
			</v-container>

			<v-container
				v-if="!deptLocked && !hasItemsToComplete"
				class="d-flex flex-column align-center justify-center text-center"
				style="min-height: 100%"
			>
				<span>{{ config.completeText }}</span>
				<br />
				<span>Workers have been unassigned.</span>
			</v-container>
		</v-card>
	</v-container>
</template>

<script>
import { preproductionDepartments } from "@/data/preproductionDepartments";
import { preproductionBalance } from "@/data/balance";
import { useGameClockStore } from "@/stores/gameClockStore";
import { usePreproductionStore } from "@/stores/preproductionStore";
import { useProjectStore } from "@/stores/projectStore";

export default {
	props: {
		departmentId: {
			type: String,
			required: true,
		},
	},
	emits: [
		"roleCast",
		"shotPlanned",
		"setBuilt",
		"locationScouted",
		"costumeMade",
		"lookDesigned",
		"taskCompleted",
	],
	data() {
		return {
			unregisterTicker: null,
			barColors: ["maroon", "red", "orangered"],
		};
	},
	computed: {
		config() {
			return preproductionDepartments[this.departmentId];
		},
		preproductionStore() {
			return usePreproductionStore();
		},
		projectStore() {
			return useProjectStore();
		},
		gameClockStore() {
			return useGameClockStore();
		},
		departmentHeadCost() {
			return preproductionBalance.departmentHeadCost;
		},
		employeeSpeed() {
			return preproductionBalance.departmentEmployeeSpeed;
		},
		ticksPerClick() {
			return preproductionBalance.departmentTicksPerClick;
		},
		progressMax() {
			return preproductionBalance.defaultDepartmentProgressMax;
		},
		deptLocked() {
			return this.preproductionStore.isDepartmentLocked(this.departmentId);
		},
		localEmployees() {
			return this.preproductionStore.departmentEmployees(this.departmentId);
		},
		items() {
			return this.projectStore.itemsForDepartment(this.config);
		},
		currentItemIndex() {
			return this.projectStore.nextIncompleteIndex(this.config);
		},
		currentItem() {
			return this.currentItemIndex >= 0
				? this.items[this.currentItemIndex]
				: null;
		},
		hasItemsToComplete() {
			return this.currentItemIndex >= 0;
		},
		hasUnassignedEmployees() {
			return this.preproductionStore.unassignedEmployeeCount >= 1;
		},
		isHireWorkersVisible() {
			return this.preproductionStore.componentVisibility.hireWorkersCard;
		},
		ticksPerSecond() {
			return this.localEmployees * this.employeeSpeed;
		},
		canAffordHire() {
			return this.preproductionStore.preproDollarCount >= this.departmentHeadCost;
		},
		currentProgress() {
			return this.preproductionStore.getDepartmentProgress(this.departmentId);
		},
		progressBars() {
			return [
				{
					key: "barOne",
					label: this.config.progressLabels[0],
					value: this.currentProgress.barOne,
					max: this.progressMax.barOne,
					color: this.barColors[0],
				},
				{
					key: "barTwo",
					label: this.config.progressLabels[1],
					value: this.currentProgress.barTwo,
					max: this.progressMax.barTwo,
					color: this.barColors[1],
				},
				{
					key: "barThree",
					label: this.config.progressLabels[2],
					value: this.currentProgress.barThree,
					max: this.progressMax.barThree,
					color: this.barColors[2],
				},
			];
		},
	},
	methods: {
		formatProgress(value) {
			return Number.isInteger(value) ? value : value.toFixed(1);
		},
		updateProgress(elapsedSeconds = 1) {
			if (!this.hasItemsToComplete || this.preproductionStore.preproDollarCount <= 0) {
				return;
			}

			const progressComplete = this.preproductionStore.advanceDepartmentProgress(
				this.departmentId,
				this.ticksPerSecond * elapsedSeconds,
				this.progressMax
			);

			if (progressComplete) {
				this.completeCurrentItem();
			}
		},
		updateProgressOnClick() {
			const progressComplete = this.preproductionStore.advanceDepartmentProgress(
				this.departmentId,
				this.ticksPerClick,
				this.progressMax
			);

			if (progressComplete) {
				this.completeCurrentItem();
			}
		},
		completeCurrentItem() {
			if (!this.currentItem) return;

			const completedName = this.currentItem.name;
			this.projectStore.completeDepartmentItem(this.config, this.currentItemIndex);
			this.preproductionStore.resetDepartmentProgress(this.departmentId);

			this.$emit(this.config.eventName, completedName);
			this.$emit("taskCompleted", {
				component: this.departmentId,
				item: completedName,
			});

			this.$nextTick(() => {
				if (!this.hasItemsToComplete) {
					this.preproductionStore.unassignAllDepartmentEmployees(
						this.departmentId
					);
				}
			});
		},
		assignEmployee() {
			this.preproductionStore.assignDepartmentEmployee(this.departmentId);
		},
		unassignEmployee() {
			this.preproductionStore.unassignDepartmentEmployee(this.departmentId);
		},
		hireDeptHead() {
			this.preproductionStore.hireDepartmentHead(this.departmentId);
		},
	},
	created() {
		this.preproductionStore.initializeDepartmentProgress(
			this.departmentId,
			this.progressMax
		);
	},
	mounted() {
		this.unregisterTicker = this.gameClockStore.registerTicker(
			`department:${this.departmentId}`,
			this.updateProgress
		);
	},
	beforeUnmount() {
		if (this.unregisterTicker) {
			this.unregisterTicker();
			this.unregisterTicker = null;
		}
	},
};
</script>

<style scoped>
.plus-minus {
	min-width: 0;
	max-width: fit-content;
}

.department-progress {
	height: 22px;
	width: 170px;
}

span {
	display: grid;
	align-items: center;
}
</style>
