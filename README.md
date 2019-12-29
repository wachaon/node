# node
Call node.js from wes

## install
```
wes install @wachaon/node
```

## usage

node.js must be installed

```javascript
const node = require( '@wachaon/node' ).bind( null, __dirname, __filename )

console.log( node( () => {
    const path = require( 'path' )
    return Object.keys( path )
} ) )
```
