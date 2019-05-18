<template>
	<div id="app">
		<!--<img src="./assets/logo.png">-->
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'app',
	};
</script>

<style>
	html,
	body {
		margin: 0;
		padding: 0;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		overflow: hidden;
	}

	#app,
	.content {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		overflow: hidden;
	}
</style>
