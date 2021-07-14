// stylelint rule https://stylelint.io/user-guide/rules/selector-max-attribute
// https://cloud.tencent.com/developer/section/1489630

// 'function-url-no-scheme-relative': null, // --禁止使用相对协议的链接

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  rules: {
    'selector-max-id': 0, // 限制选择器中ID选择器的数量#a{}'
    'selector-max-type': 0, // 限制选择器中的类型数a{}'
    'selector-max-attribute': 0, // 限制选择器中属性选择器的数量[name="xxx"]{}'
    'at-rule-name-newline-after': 'always-multi-line', // 在规则名称后需要换行符
    'at-rule-no-unknown': true, // 禁止使用未知的 at 规则
    'at-rule-semicolon-space-before': 'never', // 在规则的分号之前需要一个空格或不允许使用空格
    'color-hex-case': 'lower', // 指定十六进制颜色大小写
    'color-hex-length': 'long', // 指定十六进制颜色是否使用缩写"short"|"long"
    'color-no-invalid-hex': true, // 禁止使用无效的十六进制颜色
    'comment-no-empty': true, // 禁止空注释
    'declaration-block-no-duplicate-properties': true, // 禁止在声明块中使用重复的属性
    'declaration-block-no-shorthand-property-overrides': true, // 禁止缩写属性覆盖相关普通写法属性
    'font-family-name-quotes': 'always-where-recommended', // --指定字体名称是否需要使用引号引起来
    'font-family-no-duplicate-names': true, // 禁止使用重复的字体名称
    'font-family-no-missing-generic-family-keyword': true, // 不允许移除通用的字体
    'font-weight-notation': 'named-where-possible', // --要求使用数字或命名的 (可能的情况下) font-weight 值
    'function-calc-no-invalid': true, // 禁止在calc函数出现无效的参数
    'function-calc-no-unspaced-operator': true, // 禁止在 calc 函数内使用不加空格的操作符
    'function-linear-gradient-no-nonstandard-direction': true, // 根据标准语法，禁止 linear-gradient() 中无效的方向值
    'function-url-quotes': 'always', // --要求或禁止 url 使用引号
    'keyframe-declaration-no-important': true, // 禁止在 keyframe 声明中使用 !important
    'max-line-length': null, // --限制单行的长度
    'media-feature-name-no-unknown': true, // 禁止使用未知的 media 特性名称
    'no-duplicate-at-import-rules': true, // 禁止重复的@import
    'no-duplicate-selectors': true, // 在一个样式表中禁止出现重复的选择器
    'no-empty-first-line': true, // --第一行不能为空
    'no-extra-semicolons': true, // 禁止多余的分号
    'no-invalid-double-slash-comments': true, // 禁用 CSS 不支持的双斜线注释
    'selector-attribute-quotes': 'always', // --要求或禁止特性值使用引号
    'string-no-newline': true, // 禁止在字符串中使用（非转义的）换行符
    'string-quotes': 'single', // 在字符串周围指定单引号或双引号
    'value-list-comma-space-after': 'always-single-line', // 在值列表的逗号后需要一个空格或不允许空格
  },
}
