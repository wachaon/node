# node
Call node.js from wes

## install
```
wes install @wachaon/node
```

## usage

```javascript
const node = require( '@wachaon/node' )

console.log( node( () => {
    const path = require( 'path' )
    return Object.keys( path )
} ) )
```
