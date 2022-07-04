<template>
	<div class="modal fade" id="instructions" tabindex="-1" aria-labelledby="instructions" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body p-0">
					<img alt="Οδηγίες" v-if="objData.metadata.instructions" v-lazy="objData.metadata.instructions.url">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['objData']
};
</script>