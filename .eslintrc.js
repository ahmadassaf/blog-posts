module.exports = {
  'env': {
    'amd': true,
    'browser': true,
    'es6': true,
    'node': true
  },
  'extends': [ 'eslint:recommended', 'plugin:react/recommended', 'next', 'next/core-web-vitals' ],
  'plugins': [ 'sort-keys-fix', 'simple-import-sort', 'sort-requires-by-path' ],
  'root': true,
  'rules': {
    'array-bracket-newline': [
      'error', {
        'multiline': true
      }
    ],
    'array-bracket-spacing': [
      'error', 'always', {
        'arraysInArrays': false,
        'objectsInArrays': false
      }
    ],
    'array-callback-return': 'error',
    'array-element-newline': [ 'error', 'consistent' ],
    'arrow-body-style': [
      'error', 'as-needed', {
        'requireReturnForObjectLiteral': true
      }
    ],
    'arrow-parens': [ 'error', 'always' ],
    'arrow-spacing': 'error',
    'block-scoped-var': 'error',
    'block-spacing': [ 'error', 'always' ],
    'brace-style': [
      'error', '1tbs', {
        'allowSingleLine': false
      }
    ],
    'callback-return': [ 'error', [ 'done', 'sendResponse', 'send.error', 'send.success' ]],
    'camelcase': [
      'error', {
        'properties': 'always'
      }
    ],
    'capitalized-comments': [
      'error', 'always', {
        'ignoreInlineComments': true
      }
    ],
    'comma-dangle': [ 'error', 'never' ],
    'comma-spacing': [
      'error', {
        'after': true,
        'before': false
      }
    ],
    'comma-style': [ 'error', 'last' ],
    'computed-property-spacing': [
      'error', 'never', {
        'enforceForClassMembers': true
      }
    ],
    'curly': [ 'error', 'multi', 'consistent' ],
    'default-case': 'error',
    'default-param-last': [ 'error' ],
    'dot-notation': [
      'error', {
        'allowPattern': '^[a-z]+(_[a-z]+)+$'
      }
    ],
    'eol-last': 'error',
    'eqeqeq': [ 'error', 'smart' ],
    'func-call-spacing': [ 'error', 'never' ],
    'func-name-matching': [ 'error', 'always' ],
    'func-names': [ 'error', 'always' ],
    'function-call-argument-newline': [ 'error', 'never' ],
    'function-paren-newline': [ 'error', 'consistent' ],
    'generator-star-spacing': [
      'error', {
        'after': true,
        'before': true
      }
    ],
    'handle-callback-err': [ 'error', '^(err|error)$' ],
    'id-blacklist': [ 'error', 'e', 'cb' ],
    'implicit-arrow-linebreak': [ 'error', 'beside' ],
    'indent': [ 'error', 2 ],
    'jsx-quotes': [ 'error', 'prefer-single' ],
    'key-spacing': [
      'error', {
        'afterColon': true,
        'beforeColon': false
      }
    ],
    'keyword-spacing': [
      'error', {
        'after': true,
        'before': true
      }
    ],
    'line-comment-position': [
      'error', {
        'position': 'above'
      }
    ],
    'lines-around-comment': [
      'error', {
        'allowArrayEnd': false,
        'allowBlockEnd': false,
        'allowClassEnd': false,
        'allowObjectEnd': false,
        'beforeBlockComment': true,
        'beforeLineComment': true
      }
    ],
    'lines-between-class-members': [ 'error', 'always' ],
    'max-classes-per-file': [ 'error', 1 ],
    'max-depth': [ 'error', 3 ],
    'max-nested-callbacks': [ 'error', 3 ],
    'max-statements-per-line': [
      'error', {
        'max': 2
      }
    ],
    'multiline-comment-style': [ 'error', 'starred-block' ],
    'multiline-ternary': [ 'error', 'never' ],
    'new-cap': [
      'error', {
        'capIsNew': false,
        'newIsCap': true,
        'properties': false
      }
    ],
    'new-parens': 'error',
    'newline-before-return': 'error',
    'newline-per-chained-call': [
      'error', {
        'ignoreChainWithDepth': 3
      }
    ],
    'no-array-constructor': 'error',
    'no-buffer-constructor': 'error',
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-confusing-arrow': [
      'error', {
        'allowParens': true
      }
    ],
    'no-delete-var': 'error',
    'no-div-regex': 'error',
    'no-duplicate-imports': [
      'error', {
        'includeExports': true
      }
    ],
    'no-else-return': 'error',
    'no-empty': 'error',
    'no-empty-function': 'error',
    'no-empty-pattern': 'error',
    'no-eq-null': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-semi': 'error',
    'no-fallthrough': 'error',
    'no-floating-decimal': 'error',
    'no-global-assign': [
      'error', {
        'exceptions': [ 'Window' ]
      }
    ],
    'no-implicit-coercion': [
      'error', {
        'allow': [ '!!' ]
      }
    ],
    'no-implicit-globals': 'error',
    'no-import-assign': 'error',
    'no-inline-comments': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-mixed-operators': [
      'error', {
        'allowSamePrecedence': true,
        'groups': [[ '==', '!=', '===', '!==', '>', '>=', '<', '<=' ], [ '&&', '||' ], [ 'in', 'instanceof' ]]
      }
    ],
    'no-mixed-requires': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-assign': 'error',
    'no-multi-spaces': [
      'error', {
        'exceptions': {
          'AssignmentExpression': true,
          'ImportDeclaration': true,
          'VariableDeclarator': true
        }
      }
    ],
    'no-multi-str': 'error',
    'no-multiple-empty-lines': [
      1, {
        'max': 1,
        'maxBOF': 1,
        'maxEOF': 1
      }
    ],
    'no-negated-condition': 'error',
    'no-nested-ternary': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-octal': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-proto': 'error',
    'no-redeclare': 'error',
    'no-return-assign': [ 'error', 'except-parens' ],
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-assign': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': [
      'error', {
        'allow': [],
        'builtinGlobals': false,
        'hoist': 'functions'
      }
    ],
    'no-shadow-restricted-names': 'error',
    'no-tabs': [
      'error', {
        'allowIndentationTabs': true
      }
    ],
    'no-this-before-super': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-undef-init': 'error',
    'no-unexpected-multiline': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': [
      'error', {
        'defaultAssignment': false
      }
    ],
    'no-unused-expressions': [
      'error', {
        'allowShortCircuit': true,
        'allowTaggedTemplates': true,
        'allowTernary': true
      }
    ],
    'no-unused-vars': [
      'error', {
        'args': 'none',
        'ignoreRestSiblings': true,
        'vars': 'all'
      }
    ],
    'no-use-before-define': 'error',
    'no-useless-call': 'error',
    'no-useless-catch': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-escape': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-whitespace-before-property': 'error',
    'no-with': 'error',
    'nonblock-statement-body-position': [ 'error', 'beside' ],
    'object-curly-newline': [
      'error', {
        'ExportDeclaration': 'never',
        'ImportDeclaration': 'never'
      }
    ],
    'object-curly-spacing': [
      'error', 'always', {
        'arraysInObjects': true,
        'objectsInObjects': true
      }
    ],
    'one-var': [
      'error', {
        'const': 'never',
        'let': 'never',
        'separateRequires': true,
        'var': 'never'
      }
    ],
    'operator-assignment': [ 'error', 'always' ],
    'operator-linebreak': [
      'error', 'after', {
        'overrides': {
          ':': 'before',
          '?': 'before'
        }
      }
    ],
    'padding-line-between-statements': [
      'error', {
        'blankLine': 'always',
        'next': 'return',
        'prev': '*'
      }, {
        'blankLine': 'always',
        'next': '*',
        'prev': [ 'const', 'let', 'var' ]
      }, {
        'blankLine': 'any',
        'next': [ 'const', 'let', 'var' ],
        'prev': [ 'const', 'let', 'var' ]
      }, {
        'blankLine': 'always',
        'next': '*',
        'prev': 'directive'
      }, {
        'blankLine': 'any',
        'next': 'directive',
        'prev': 'directive'
      }
    ],
    'prefer-arrow-callback': [
      'error', {
        'allowNamedFunctions': true
      }
    ],
    'prefer-const': [
      'error', {
        'destructuring': 'all',
        'ignoreReadBeforeAssign': true
      }
    ],
    'prefer-destructuring': [
      'error', {
        'array': false,
        'object': true
      }, {
        'enforceForRenamedProperties': false
      }
    ],
    'prefer-named-capture-group': 'warn',
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-regex-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quote-props': [ 'error', 'always' ],
    'quotes': [
      'error', 'single', {
        'allowTemplateLiterals': true,
        'avoidEscape': true
      }
    ],
    'react/jsx-curly-newline': [
      'error', {
        'multiline': 'forbid',
        'singleline': 'forbid'
      }
    ],
    'react/jsx-curly-spacing': [
      'error', {
        'spacing': {
          'objectLiterals': 'never'
        },
        'when': 'always'
      }
    ],
    'react/jsx-props-no-multi-spaces': 'error',
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off',
    'react/sort-prop-types': [
      'error', {
        'callbacksLast': true,
        'ignoreCase': false,
        'requiredFirst': true,
        'sortShapeProp': true
      }
    ],
    'rest-spread-spacing': [ 'error', 'never' ],
    'semi': [ 'error', 'always' ],
    'semi-spacing': [
      'error', {
        'after': true,
        'before': false
      }
    ],
    'semi-style': [ 'error', 'last' ],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error', {
        'groups': [

          // Packages `react` related packages come first.
          [ '^react', '^@?\\w' ],

          // Internal packages
          [ '^(@|components)(/.*|$)' ],

          // Side effect imports
          [ '^\\u0000' ],

          // Parent imports. Put `..` last
          [ '^\\.\\.(?!/?$)', '^\\.\\./?$' ],

          // Other relative imports. Put same-folder imports and `.` last
          [ '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$' ],

          // Style imports
          [ '^.+\\.?(css)$' ]
        ]
      }
    ],
    'sort-keys': [
      'error', 'asc', {
        'caseSensitive': true
      }
    ],
    'sort-keys-fix/sort-keys-fix': 'warn',
    'sort-requires-by-path/sort-requires-by-path': 'error',
    'sort-vars': [
      'error', {
        'ignoreCase': true
      }
    ],
    'space-before-blocks': [ 'error', 'always' ],
    'space-before-function-paren': [ 'error', 'never' ],
    'space-in-parens': [ 'error', 'never' ],
    'space-infix-ops': 'error',
    'space-unary-ops': [
      'error', {
        'nonwords': false,
        'words': true
      }
    ],
    'spaced-comment': [
      'error', 'always', {
        'block': {
          'balanced': true,
          'exceptions': [ '*' ],
          'markers': [ '*package', '!', ',', ':', ': :', 'flow-include' ]
        },
        'line': {
          'markers': [ '*package', '!', '/', ',', '=' ]
        }
      }
    ],
    'strict': [ 'error', 'never' ],
    'switch-colon-spacing': [
      'error', {
        'after': true,
        'before': false
      }
    ],
    'symbol-description': 'error',
    'template-curly-spacing': [ 'error', 'never' ],
    'template-tag-spacing': [ 'error', 'never' ],
    'unicode-bom': [ 'error', 'never' ],
    'vars-on-top': 'error',
    'wrap-iife': [
      'error', 'outside', {
        'functionPrototypeMethods': true
      }
    ],
    'yield-star-spacing': [ 'error', 'both' ],
    'yoda': [ 'error', 'never' ]
  }
};
