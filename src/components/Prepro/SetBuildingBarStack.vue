<template>
	<DepartmentProgressCard department-id="setBuilding" v-bind="$attrs" />
</template>

<script>
import DepartmentProgressCard from "./DepartmentProgressCard.vue";

export default {
	components: {
		DepartmentProgressCard,
	},
};
</script>
