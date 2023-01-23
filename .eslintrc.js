module.exports = {
	'root': true,
	'env': {
		'browser': true,
		'amd': true,
		'node': true,
		'es6': true,
	},
	'extends': ['eslint:recommended', 'next', 'next/core-web-vitals'],
	'rules': {
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 0,
		'no-unused-vars': 0,
		'react/no-unescaped-entities': 0,
		'quotes': ['error', 'single'],
		'quote-props': ['error', 'always'],
		'indent': ['error', 'tab'],
		'array-element-newline': [
			'error',
			{
				'multiline': true,
				'minItems': 5,
			},
		],
	},
}
