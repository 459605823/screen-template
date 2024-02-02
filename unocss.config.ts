import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  rules: [
    ['font-number', {'font-family': 'DINAlternate-Bold'}],
    ['bg-fill', {'background-size': '100% 100%'}],
  ],
  shortcuts: {
    center: 'flex items-center justify-center',
  },
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
