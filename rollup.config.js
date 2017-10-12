import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
	name: 'prettyCodeErrors',
	output: {
		file: 'es5.js',
		format: 'umd'
	},
	plugins: [
		// resolve(),
		babel({
			exclude: 'node_modules/**'
		})
	],
	watch: {
		include: '*.js',
		exclude: 'node_modules/**'
	}
}