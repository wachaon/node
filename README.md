# node
Call node.js from wes

## install
```
wes install @wachaon/node
```

## usage

node.js must be installed

Return value will be `{ stdout: String, stderr: String }`

### When using from an existing file

```javascript
const node = require( '@wachaon/node' )

const hoge = node( 'sample.js' ).stdout
console.log( hoge )
```

### When injecting functions directly

```javascript
const node = require( '@wachaon/node' )

node( () => {
    const path = require( 'path' )
    const { inspect } = require( 'util' )
    console.log( inspect( path, { colors: true } ) )
} )
```

### When using __dirname and __filename

```javascript
const node = require( '@wachaon/node' )
node.options = { __dirname, __filename }

const hoge = ( { __dirname, __filename } ) => console.log( `__dirname: ${ __dirname }\n__filename: ${ __filename }` )
```

### When receiving as JSON without outputting to the console

```javascript
const node = require( '@wachaon/node' )
node.options.silent = true
const hoge = node( () => {
    const path = require( 'path' )
    console.log( JSON.stringify( Object.keys( path ), null, 2 ) )
} )
console.log( hoge.stdout )
```
