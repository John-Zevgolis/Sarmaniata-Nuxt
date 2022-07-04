<template>
	<div class="loader fixed-top h-100 align-items-center justify-content-center" :class="{remove: loading}">
		<div class="sk-cube-grid">
			<div class="sk-cube sk-cube1"></div>
			<div class="sk-cube sk-cube2"></div>
			<div class="sk-cube sk-cube3"></div>
			<div class="sk-cube sk-cube4"></div>
			<div class="sk-cube sk-cube5"></div>
			<div class="sk-cube sk-cube6"></div>
			<div class="sk-cube sk-cube7"></div>
			<div class="sk-cube sk-cube8"></div>
			<div class="sk-cube sk-cube9"></div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['loading']
};
</script>

<style lang="scss" scoped>
.loader {
	z-index: 5000;
	background: #fff;
	display: flex;

	.sk-cube-grid {
		width: 40px;
		height: 40px;

		.sk-cube {
			width: 33%;
			height: 33%;
			background-color: #181818;
			float: left;
			animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out; 

			.sk-cube-grid .sk-cube1 {
				animation-delay: 0.2s;
			}
			.sk-cube-grid .sk-cube2 {
				animation-delay: 0.3s;
			}
			.sk-cube-grid .sk-cube3 {
				animation-delay: 0.4s;
			}
			.sk-cube-grid .sk-cube4 {
				animation-delay: 0.1s;
			}
			.sk-cube-grid .sk-cube5 {
				animation-delay: 0.2s;
			}
			.sk-cube-grid .sk-cube6 {
				animation-delay: 0.3s;
			}
			.sk-cube-grid .sk-cube7 {
				animation-delay: 0s; 
			}
			.sk-cube-grid .sk-cube8 {
				animation-delay: 0.1s;
			}
			.sk-cube-grid .sk-cube9 {
				animation-delay: 0.2s; 
			}
		}
	}
}

@keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
            transform: scale3D(1, 1, 1);
  } 35% {
    -webkit-transform: scale3D(0, 0, 1);
            transform: scale3D(0, 0, 1);
  } 
}
</style>