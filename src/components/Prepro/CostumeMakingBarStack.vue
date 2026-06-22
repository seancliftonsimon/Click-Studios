<template>
	<DepartmentProgressCard department-id="costumeMaking" v-bind="$attrs" />
</template>

<script>
import DepartmentProgressCard from "./DepartmentProgressCard.vue";

export default {
	components: {
		DepartmentProgressCard,
	},
};
</script>
