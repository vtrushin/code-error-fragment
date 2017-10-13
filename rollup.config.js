import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
	name: 'prettyCodeErrors',
	output: {
		file: 'es5.js',
		format: 'umd'
	},
	plugins: [
		babel({
			exclude: 'node_modules/**'
		})
	],
	watch: {
		include: '*.js',
		exclude: 'node_modules/**'
	}
}