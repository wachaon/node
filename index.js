const { writeTextFileSync, deleteFileSync } = require( 'filesystem' )
const { join, CurrentDirectory } = require( 'pathname' )
const Shell = require( 'WScript.Shell' )
const genUUID  = require( 'genUUID' )

const node = function node_exec ( code ) {
    const id = genUUID() + '.js'
    const spec = join( CurrentDirectory, id )
    const source = `try { console.log( ( ${ code } )() ) } catch ( error ) { console.log( error.stack ) }`
    writeTextFileSync( spec, source )
    const proc = Shell.exec( `node ${ spec }` )
    const result = proc.StdOut.ReadAll().trim()
    deleteFileSync( spec )
    return result
}

module.exports = node