import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
	name: 'codeErrorFragment',
	output: {
		file: 'build.js',
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