<template>
	<section class="ui-direction-mock" :class="directionClass">
		<div class="direction-switcher" aria-label="Design direction switcher">
			<strong>{{ activeDirection.name }}</strong>
			<span>{{ activeIndex + 1 }}/5</span>
			<div>
				<button class="control-button secondary" type="button" @click="previousDirection">
					Previous
				</button>
				<button class="control-button primary" type="button" @click="nextDirection">
					Next
				</button>
			</div>
		</div>

		<header class="page-header">
			<h1>{{ activeDirection.title }}</h1>
			<p>{{ activeDirection.note }}</p>
		</header>

		<main class="showcase">
			<section class="action-sample">
				<h2>Actions</h2>
				<div class="button-row">
					<button class="sample-button primary" type="button" @click="showPulse = !showPulse">
						Primary
					</button>
					<button class="sample-button secondary" type="button">
						Secondary
					</button>
					<button class="sample-button danger" type="button">
						Warning
					</button>
				</div>

				<div class="choice-set" role="group" aria-label="Metric choice">
					<button
						v-for="metric in metrics"
						:key="metric"
						type="button"
						:class="{ active: activeMetric === metric }"
						@click="activeMetric = metric"
					>
						{{ metric }}
					</button>
				</div>

				<label class="toggle-sample">
					<input v-model="autoMode" type="checkbox" />
					<span></span>
					Auto report
				</label>
			</section>

			<section class="ranking-sample">
				<h2>Rankings</h2>
				<button
					v-for="studio in studios"
					:key="studio.rank"
					type="button"
					class="ranking-item"
					:class="{ selected: selectedRank === studio.rank }"
					@click="selectedRank = studio.rank"
				>
					<span class="rank">#{{ studio.rank }}</span>
					<strong>{{ studio.name }}</strong>
					<span class="score">{{ studio.score }}</span>
				</button>
			</section>

			<section class="feedback-sample" :class="{ pulsing: showPulse }">
				<h2>Feedback</h2>
				<div class="status-line">
					<strong>{{ selectedStudio.name }}</strong>
					<span>{{ activeMetric }} selected</span>
				</div>
				<div class="progress-sample">
					<span :style="{ width: selectedStudio.progress + '%' }"></span>
				</div>
				<button class="sample-button primary" type="button" @click="modalOpen = true">
					Open Modal
				</button>
			</section>
		</main>

		<div v-if="modalOpen" class="modal-backdrop" @click.self="modalOpen = false">
			<section class="modal-sample" role="dialog" aria-modal="true">
				<h2>{{ selectedStudio.name }}</h2>
				<p>Simple modal preview for this direction.</p>
				<div class="button-row">
					<button class="sample-button secondary" type="button" @click="modalOpen = false">
						Cancel
					</button>
					<button class="sample-button primary" type="button" @click="modalOpen = false">
						Confirm
					</button>
				</div>
			</section>
		</div>
	</section>
</template>

<script>
const directions = [
	{
		id: "ticket",
		name: "Ticket Booth",
		title: "Ticket Booth UI",
		note: "Chunky, tactile, playful.",
	},
	{
		id: "sheet",
		name: "Ledger Sheet",
		title: "Ledger Sheet UI",
		note: "Flat, dense, managerial.",
	},
	{
		id: "marquee",
		name: "Premiere Marquee",
		title: "Premiere Marquee UI",
		note: "High contrast and theatrical.",
	},
	{
		id: "board",
		name: "Production Board",
		title: "Production Board UI",
		note: "Loose, pinned, workshop-like.",
	},
	{
		id: "console",
		name: "Control Console",
		title: "Control Console UI",
		note: "Compact, technical, signal-heavy.",
	},
];

export default {
	name: "LeaderboardDesignMock",
	data() {
		return {
			activeIndex: 0,
			activeMetric: "Box Office",
			autoMode: true,
			modalOpen: false,
			selectedRank: 4,
			showPulse: false,
			directions,
			metrics: ["Box Office", "Profit", "Critics", "Audience"],
			studios: [
				{ rank: 1, name: "Celestial Gate", score: "$92.4M", progress: 92 },
				{ rank: 2, name: "Rocket House", score: "$76.0M", progress: 82 },
				{ rank: 3, name: "Juniper Pictures", score: "$58.7M", progress: 74 },
				{ rank: 4, name: "Click Studios", score: "$41.2M", progress: 61 },
				{ rank: 5, name: "Blue Crane", score: "$38.9M", progress: 55 },
			],
		};
	},
	computed: {
		activeDirection() {
			return this.directions[this.activeIndex];
		},
		directionClass() {
			return `direction-${this.activeDirection.id}`;
		},
		selectedStudio() {
			return (
				this.studios.find((studio) => studio.rank === this.selectedRank) ||
				this.studios[0]
			);
		},
	},
	methods: {
		nextDirection() {
			this.activeIndex = (this.activeIndex + 1) % this.directions.length;
			this.modalOpen = false;
		},
		previousDirection() {
			this.activeIndex =
				(this.activeIndex - 1 + this.directions.length) %
				this.directions.length;
			this.modalOpen = false;
		},
	},
};
</script>

<style scoped>
.ui-direction-mock {
	--curtain: #931621;
	--gold: #fad01c;
	--night: #313b72;
	--popcorn: #fff5bf;
	--paper: #fffaf0;
	--ink: #151313;
	--muted: #625947;
	min-height: calc(100vh - 64px);
	padding: 40px clamp(18px, 4vw, 56px) 54px;
	background: var(--popcorn);
	color: var(--ink);
}

button {
	color: inherit;
	font: inherit;
	cursor: pointer;
}

.direction-switcher {
	position: fixed;
	z-index: 30;
	top: 84px;
	right: 18px;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	background: var(--paper);
}

.direction-switcher span {
	color: var(--muted);
	font-weight: 800;
}

.direction-switcher div,
.button-row {
	display: flex;
	gap: 8px;
}

.control-button,
.sample-button,
.choice-set button,
.ranking-item {
	transition:
		transform 140ms ease,
		background 140ms ease,
		border-color 140ms ease,
		box-shadow 140ms ease;
}

.control-button:hover,
.sample-button:hover,
.choice-set button:hover,
.ranking-item:hover {
	transform: translateY(-2px);
}

.control-button:active,
.sample-button:active,
.choice-set button:active,
.ranking-item:active {
	transform: translateY(0);
}

.page-header {
	max-width: 1020px;
	margin: 0 auto 24px;
	padding-top: 48px;
}

.page-header h1 {
	margin: 0;
	font-size: clamp(3.4rem, 8vw, 7rem);
	line-height: 0.92;
}

.page-header p {
	max-width: 360px;
	margin: 12px 0 0;
	color: var(--muted);
	font-size: 1.1rem;
}

.showcase {
	display: grid;
	grid-template-columns: 0.9fr 1.15fr 0.95fr;
	gap: 18px;
	max-width: 1020px;
	margin: 0 auto;
}

.showcase > section {
	min-height: 300px;
	padding: 20px;
}

.showcase h2,
.modal-sample h2 {
	margin: 0 0 16px;
	font-size: 1.8rem;
}

.action-sample,
.feedback-sample {
	display: grid;
	align-content: start;
	gap: 22px;
}

.choice-set {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.toggle-sample {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	width: fit-content;
	font-weight: 800;
}

.toggle-sample input {
	position: absolute;
	opacity: 0;
	pointer-events: none;
}

.toggle-sample span {
	position: relative;
	width: 46px;
	height: 26px;
}

.toggle-sample span::after {
	position: absolute;
	content: "";
}

.ranking-sample {
	display: grid;
	gap: 8px;
}

.ranking-item {
	display: grid;
	grid-template-columns: 48px minmax(0, 1fr) auto;
	gap: 10px;
	align-items: center;
	width: 100%;
	text-align: left;
}

.rank {
	font-weight: 900;
}

.score {
	font-weight: 900;
}

.status-line {
	display: grid;
	gap: 4px;
}

.status-line span {
	color: var(--muted);
}

.progress-sample {
	height: 16px;
	overflow: hidden;
}

.progress-sample span {
	display: block;
	height: 100%;
}

.modal-backdrop {
	position: fixed;
	z-index: 40;
	inset: 0;
	display: grid;
	place-items: center;
	padding: 24px;
}

.modal-sample {
	width: min(420px, 100%);
	padding: 24px;
}

.modal-sample p {
	margin: 0 0 20px;
	color: var(--muted);
}

/* Direction 1: tactile ticket-booth components */
.direction-ticket {
	background:
		radial-gradient(circle at 18% 0%, rgba(250, 208, 28, 0.4), transparent 24rem),
		var(--popcorn);
	font-family: "Voltaire", Arial, sans-serif;
}

.direction-ticket .direction-switcher,
.direction-ticket .showcase > section,
.direction-ticket .modal-sample {
	border: 2px solid var(--curtain);
	border-radius: 8px;
	background: var(--paper);
	box-shadow: 8px 8px 0 rgba(147, 22, 33, 0.18);
}

.direction-ticket .page-header h1 {
	color: var(--curtain);
	font-family: "Voltaire", Arial, sans-serif;
}

.direction-ticket button {
	border: 2px solid var(--curtain);
	border-radius: 8px;
	background: var(--paper);
	font-weight: 900;
}

.direction-ticket .primary,
.direction-ticket .choice-set .active,
.direction-ticket .ranking-item.selected {
	background: var(--curtain);
	color: white;
}

.direction-ticket .secondary {
	background: var(--gold);
	color: var(--ink);
}

.direction-ticket .danger {
	background: white;
	color: var(--curtain);
}

.direction-ticket .control-button,
.direction-ticket .sample-button,
.direction-ticket .choice-set button {
	padding: 11px 15px;
}

.direction-ticket .ranking-item {
	padding: 13px;
}

.direction-ticket .toggle-sample span {
	border: 2px solid var(--curtain);
	border-radius: 8px;
	background: white;
}

.direction-ticket .toggle-sample span::after {
	top: 3px;
	left: 3px;
	width: 16px;
	height: 16px;
	border-radius: 4px;
	background: var(--curtain);
	transition: left 140ms ease;
}

.direction-ticket .toggle-sample input:checked + span::after {
	left: 23px;
}

.direction-ticket .progress-sample {
	border: 2px solid var(--curtain);
	border-radius: 8px;
	background: white;
}

.direction-ticket .progress-sample span {
	background: var(--gold);
}

.direction-ticket .modal-backdrop {
	background: rgba(49, 59, 114, 0.36);
}

/* Direction 2: flat ledger sheet */
.direction-sheet {
	background: #fbf6df;
	font-family: "Helvetica Neue", Arial, sans-serif;
}

.direction-sheet .direction-switcher,
.direction-sheet .showcase > section,
.direction-sheet .modal-sample {
	border: 0;
	border-top: 3px solid var(--ink);
	background: transparent;
	box-shadow: none;
}

.direction-sheet .page-header h1 {
	font-family: "Helvetica Neue", Arial, sans-serif;
	font-size: clamp(2.8rem, 7vw, 5.6rem);
	font-weight: 900;
	letter-spacing: 0;
}

.direction-sheet .page-header p,
.direction-sheet .status-line span,
.direction-sheet .modal-sample p {
	color: #4f4f4f;
}

.direction-sheet button {
	border: 0;
	border-bottom: 2px solid var(--ink);
	border-radius: 0;
	background: transparent;
	font-weight: 800;
}

.direction-sheet .control-button,
.direction-sheet .sample-button,
.direction-sheet .choice-set button {
	padding: 8px 4px;
}

.direction-sheet .primary,
.direction-sheet .choice-set .active,
.direction-sheet .ranking-item.selected {
	border-bottom-color: var(--curtain);
	color: var(--curtain);
}

.direction-sheet .danger {
	color: var(--curtain);
}

.direction-sheet .showcase {
	grid-template-columns: 1fr 1.7fr 1fr;
	gap: 30px;
}

.direction-sheet .ranking-item {
	grid-template-columns: 42px minmax(0, 1fr) 90px;
	padding: 10px 0;
}

.direction-sheet .toggle-sample span {
	border-bottom: 2px solid var(--ink);
}

.direction-sheet .toggle-sample span::after {
	left: 0;
	bottom: -2px;
	width: 50%;
	height: 2px;
	background: var(--curtain);
	transition: width 140ms ease;
}

.direction-sheet .toggle-sample input:checked + span::after {
	width: 100%;
}

.direction-sheet .progress-sample {
	height: 6px;
	background: rgba(21, 19, 19, 0.16);
}

.direction-sheet .progress-sample span {
	background: var(--curtain);
}

.direction-sheet .modal-backdrop {
	background: rgba(255, 250, 240, 0.88);
}

/* Direction 3: theatrical marquee */
.direction-marquee {
	background:
		radial-gradient(circle at top, rgba(250, 208, 28, 0.16), transparent 28rem),
		#120d12;
	color: var(--popcorn);
	font-family: Georgia, "Times New Roman", serif;
}

.direction-marquee .direction-switcher,
.direction-marquee .showcase > section,
.direction-marquee .modal-sample {
	border: 1px solid rgba(250, 208, 28, 0.62);
	border-radius: 0;
	background: #21131e;
	box-shadow:
		0 0 0 4px rgba(250, 208, 28, 0.08),
		0 18px 40px rgba(0, 0, 0, 0.34);
}

.direction-marquee .page-header h1 {
	font-family: Georgia, "Times New Roman", serif;
	text-shadow: 0 0 18px rgba(250, 208, 28, 0.24);
}

.direction-marquee .page-header p,
.direction-marquee .direction-switcher span,
.direction-marquee .status-line span,
.direction-marquee .modal-sample p {
	color: #d9c98b;
}

.direction-marquee button {
	border: 1px solid rgba(250, 208, 28, 0.72);
	border-radius: 999px;
	background: #120d12;
	color: var(--popcorn);
	font-weight: 900;
}

.direction-marquee .control-button,
.direction-marquee .sample-button,
.direction-marquee .choice-set button {
	padding: 11px 18px;
}

.direction-marquee .primary,
.direction-marquee .choice-set .active,
.direction-marquee .ranking-item.selected {
	background: var(--gold);
	color: #130d0b;
	box-shadow: 0 0 24px rgba(250, 208, 28, 0.32);
}

.direction-marquee .danger {
	border-color: var(--curtain);
	color: #ff9aa4;
}

.direction-marquee .ranking-item {
	padding: 14px 16px;
	border-radius: 999px;
}

.direction-marquee .toggle-sample span {
	border: 1px solid rgba(250, 208, 28, 0.72);
	border-radius: 999px;
	background: #120d12;
}

.direction-marquee .toggle-sample span::after {
	top: 4px;
	left: 4px;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: var(--gold);
	box-shadow: 0 0 16px rgba(250, 208, 28, 0.5);
	transition: left 140ms ease;
}

.direction-marquee .toggle-sample input:checked + span::after {
	left: 23px;
}

.direction-marquee .progress-sample {
	border: 1px solid rgba(250, 208, 28, 0.72);
	border-radius: 999px;
	background: #120d12;
}

.direction-marquee .progress-sample span {
	background: linear-gradient(90deg, var(--curtain), var(--gold));
}

.direction-marquee .modal-backdrop {
	background: rgba(0, 0, 0, 0.72);
}

/* Direction 4: pinned production board */
.direction-board {
	background:
		linear-gradient(90deg, rgba(49, 59, 114, 0.08) 1px, transparent 1px) 0 0 / 34px 34px,
		#d9b879;
	font-family: "Trebuchet MS", Arial, sans-serif;
}

.direction-board .direction-switcher,
.direction-board .showcase > section,
.direction-board .modal-sample {
	border: 0;
	border-radius: 3px;
	background: var(--paper);
	box-shadow: 0 12px 22px rgba(83, 49, 20, 0.22);
}

.direction-board .showcase > section:nth-child(1) {
	transform: rotate(-0.8deg);
}

.direction-board .showcase > section:nth-child(2) {
	transform: rotate(0.45deg);
}

.direction-board .showcase > section:nth-child(3) {
	transform: rotate(-0.25deg);
}

.direction-board .page-header h1 {
	font-family: "Trebuchet MS", Arial, sans-serif;
	color: var(--night);
	font-size: clamp(3rem, 8vw, 6.4rem);
}

.direction-board button {
	border: 0;
	border-radius: 3px;
	background: #f8eaa5;
	box-shadow: 3px 4px 0 rgba(49, 59, 114, 0.18);
	font-weight: 900;
}

.direction-board .control-button,
.direction-board .sample-button,
.direction-board .choice-set button {
	padding: 10px 13px;
}

.direction-board .primary,
.direction-board .choice-set .active,
.direction-board .ranking-item.selected {
	background: var(--curtain);
	color: white;
}

.direction-board .secondary {
	background: var(--gold);
}

.direction-board .danger {
	background: var(--night);
	color: white;
}

.direction-board .ranking-item {
	margin-bottom: 5px;
	padding: 13px;
}

.direction-board .toggle-sample span {
	border-radius: 3px;
	background: #f8eaa5;
	box-shadow: inset 0 0 0 2px rgba(49, 59, 114, 0.22);
}

.direction-board .toggle-sample span::after {
	top: 5px;
	left: 5px;
	width: 16px;
	height: 16px;
	border-radius: 2px;
	background: var(--night);
	transition:
		left 140ms ease,
		background 140ms ease;
}

.direction-board .toggle-sample input:checked + span::after {
	left: 25px;
	background: var(--curtain);
}

.direction-board .progress-sample {
	border-radius: 3px;
	background: rgba(49, 59, 114, 0.16);
}

.direction-board .progress-sample span {
	background: var(--night);
}

.direction-board .modal-backdrop {
	background: rgba(83, 49, 20, 0.42);
}

/* Direction 5: compact control console */
.direction-console {
	background:
		linear-gradient(90deg, rgba(250, 208, 28, 0.06) 1px, transparent 1px) 0 0 / 28px 28px,
		#10152d;
	color: var(--popcorn);
	font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
}

.direction-console .direction-switcher,
.direction-console .showcase > section,
.direction-console .modal-sample {
	border: 1px solid rgba(250, 208, 28, 0.26);
	border-radius: 2px;
	background: rgba(14, 20, 49, 0.92);
	box-shadow: none;
}

.direction-console .page-header h1 {
	font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
	font-size: clamp(2.4rem, 7vw, 5.4rem);
	text-transform: uppercase;
}

.direction-console .page-header p,
.direction-console .direction-switcher span,
.direction-console .status-line span,
.direction-console .modal-sample p {
	color: #c8bc7f;
}

.direction-console .showcase {
	grid-template-columns: 1fr 1fr 1fr;
	gap: 10px;
}

.direction-console .showcase > section {
	min-height: 270px;
	padding: 14px;
}

.direction-console button {
	border: 1px solid rgba(250, 208, 28, 0.26);
	border-radius: 2px;
	background: rgba(255, 245, 191, 0.06);
	color: var(--popcorn);
	font-weight: 800;
	text-transform: uppercase;
}

.direction-console .control-button,
.direction-console .sample-button,
.direction-console .choice-set button {
	padding: 8px 10px;
}

.direction-console .primary,
.direction-console .choice-set .active,
.direction-console .ranking-item.selected {
	border-color: var(--gold);
	background: rgba(147, 22, 33, 0.86);
}

.direction-console .danger {
	border-color: var(--curtain);
	color: #ffb8be;
}

.direction-console .ranking-item {
	grid-template-columns: 40px minmax(0, 1fr);
	padding: 11px;
}

.direction-console .ranking-item .score {
	grid-column: 2;
	color: var(--gold);
}

.direction-console .toggle-sample span {
	border: 1px solid rgba(250, 208, 28, 0.26);
	border-radius: 2px;
	background: rgba(255, 245, 191, 0.06);
}

.direction-console .toggle-sample span::after {
	top: 3px;
	left: 3px;
	width: 18px;
	height: 18px;
	background: var(--gold);
	transition: left 140ms ease;
}

.direction-console .toggle-sample input:checked + span::after {
	left: 23px;
}

.direction-console .progress-sample {
	height: 10px;
	background: rgba(255, 245, 191, 0.08);
}

.direction-console .progress-sample span {
	background: var(--gold);
}

.direction-console .modal-backdrop {
	background: rgba(5, 8, 22, 0.78);
}

.direction-console .pulsing {
	animation: console-pulse 900ms ease-in-out infinite alternate;
}

@keyframes console-pulse {
	from {
		border-color: rgba(250, 208, 28, 0.26);
	}
	to {
		border-color: rgba(250, 208, 28, 0.92);
	}
}

@media (max-width: 920px) {
	.direction-switcher {
		position: sticky;
		top: 8px;
		margin-left: auto;
		width: fit-content;
	}

	.showcase,
	.direction-sheet .showcase,
	.direction-console .showcase {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 620px) {
	.ui-direction-mock {
		padding: 18px 12px 34px;
	}

	.direction-switcher,
	.direction-switcher div,
	.button-row {
		align-items: stretch;
		flex-direction: column;
	}

	.ranking-item {
		grid-template-columns: 1fr;
	}
}
</style>
