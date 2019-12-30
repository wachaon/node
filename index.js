const { writeTextFileSync, deleteFileSync } = require( 'filesystem' )
const { join, CurrentDirectory } = require( 'pathname' )
const Shell = require( 'WScript.Shell' )
const genUUID  = require( 'genUUID' )

const node = function node_exec ( bindDir, bindFile, code, args ) {
    const id = genUUID() + '.js'
    const options = args != null ? JSON.stringify( args ) : null
    const spec = join( bindDir, id )
    const source = `
__dirname = "${ bindDir }"
__filename = "${ bindFile }"
try {
    const fn = ${ String( code ) }
    const res = fn( ${ options } )
    console.log( JSON.stringify( res ) )
} catch ( error ) {
    console.log( error.stack )
}`
    writeTextFileSync( spec, source )
    const proc = Shell.exec( `node ${ spec }` )
    const result = proc.StdOut.ReadAll().trim()
    deleteFileSync( spec )
    return JSON.parse( result )
}

module.exports = node