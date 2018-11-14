# cf-vue-draggable

Vue component allowing drag-and-drop sorting in sync with View-Model

## Excemple

```html
<draggable :list='list' :element='"ul"'>
  <li v-for='item in list'>
    <span>{{ item }}</span>
  </li>
</draggable>
```

## Feature

version 0.1.0

- provide a vuejs component for draggable sort.
- support custom parent element, such as: ul, tbody
- emit event when start drag and stop drag

### todo

1. transition
2. draggable-icon component. Become draggable when mouse hover

## Test

need `browser-sync`

on shell `npm run test`, will open a develop server on `localhost:3000`