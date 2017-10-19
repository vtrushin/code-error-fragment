import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { list as babelHelpersList } from 'babel-helpers';

const plugins = [
	commonjs(),
	resolve()
];

const settings = {
	input: 'index.js',
	watch: {
		include: '*.js',
		exclude: 'node_modules/**'
	}
};

export default [
	// ES5 build
	Object.assign({}, settings, {
		name: 'codeErrorFragment',
		output: {
			file: 'build.js',
			format: 'umd'
		},
		plugins: plugins.concat(
			babel({
				exclude: 'node_modules/**',
				presets: [
					['es2015', {
						modules: false
					}],
					'stage-3'
				],
				plugins: [
					'external-helpers'
				],
				// fixing temporary rollup's regression, remove when https://github.com/rollup/rollup/issues/1595 gets solved
				externalHelpersWhitelist: babelHelpersList.filter(helperName => helperName !== 'asyncGenerator'),
			})
		)
	}),

	// ES6 module
	Object.assign({}, settings, {
		output: {
			file: 'module.js',
			format: 'es'
		},
		plugins
	})
]