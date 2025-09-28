"exports": {
".": {
"import": "./src/index.ts"
}
}

change later to in prod

"exports": {
".": {
"import": "./dist/index.mjs",
"require": "./dist/index.cjs",
"types": "./dist/index.d.ts"
}
},
