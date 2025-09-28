## This is React Railway's Monorepo

You need to run npm run dev in

```
apps/consumer
```

and in

```
packages/react-railway
```

### Important: change in production mode in react-railway, we need this only in dev mode for hot reloading
```
"exports": {
  ".": {
    "import": "./src/index.ts"
  }
}
```

Change later to:

```
"exports": {
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs",
    "types": "./dist/index.d.ts"
  }
},
```