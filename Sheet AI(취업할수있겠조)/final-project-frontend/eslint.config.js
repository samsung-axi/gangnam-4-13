import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierConfig],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // 널널한 설정 - 귀찮은 규칙들 끄기
      'no-console': 'off', // console.log 허용
      'no-unused-vars': 'off', // 사용하지 않는 변수 허용
      '@typescript-eslint/no-unused-vars': [
        'off',
        {
          varsIgnorePattern: '^React$',
        },
      ], // TS 사용하지 않는 변수 허용
      'no-empty': 'off', // 빈 블록 허용
      'no-empty-function': 'off', // 빈 함수 허용
      '@typescript-eslint/no-empty-function': 'off', // TS 빈 함수 허용
      'no-undef': 'off', // 정의되지 않은 변수 허용
      'no-unreachable': 'off', // 도달할 수 없는 코드 허용
      'no-constant-condition': 'off', // 상수 조건문 허용
      'no-debugger': 'off', // debugger 허용
      'no-extra-semi': 'off', // 불필요한 세미콜론 허용
      'no-irregular-whitespace': 'off', // 불규칙한 공백 허용
      'no-useless-escape': 'off', // 불필요한 이스케이프 허용
      'prefer-const': 'off', // const 사용 강제 안함
      'no-var': 'off', // var 사용 허용

      // TypeScript 관련 널널한 설정
      '@typescript-eslint/no-explicit-any': 'off', // any 타입 허용
      '@typescript-eslint/no-inferrable-types': 'off', // 추론 가능한 타입 명시 허용
      '@typescript-eslint/ban-ts-comment': 'off', // @ts-ignore 등 허용
      '@typescript-eslint/no-non-null-assertion': 'off', // ! 연산자 허용
      '@typescript-eslint/no-empty-interface': 'off', // 빈 인터페이스 허용
      '@typescript-eslint/prefer-as-const': 'off', // as const 강제 안함
      '@typescript-eslint/no-namespace': 'off', // namespace 허용
      '@typescript-eslint/triple-slash-reference': 'off', // /// 참조 허용

      // React 관련 널널한 설정
      'react-hooks/exhaustive-deps': 'off', // useEffect 의존성 배열 체크 안함
    },
  }
);