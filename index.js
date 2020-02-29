const WShell = require( 'WScript.Shell' )
const { join } = require( 'pathname' )
const { writeTextFileSync, deleteFileSync } = require( 'filesystem' )
const genUUID = require( 'genUUID' )

const LF = '\n'
const NONE = ''

function exec_node ( code_or_spec ) {
    const isCode = typeof code_or_spec === 'function'
    const spec = isCode ? join( exec_node.options.__dirname.replace( /[\{\}]/g, '' ), genUUID() + '.js' ) : String( code_or_spec )

    if ( isCode ) {
        writeTextFileSync( spec, `( () => {
            ( ${ String( code_or_spec ) } )( ${ JSON.stringify( exec_node.options ) } )
        } )()` )
    }

    const { stdOut, stdErr } = WShell.Exec( `node ${ spec }` )

    let outStream = []
    let errStream = []


    while ( !stdOut.AtEndOfStream || !stdErr.AtEndOfStream ) {
        const outLine = stdOut.ReadLine()
        outLine != NONE ? outStream.push( outLine ) : NONE

        const errLine = stdErr.ReadLine()
        errLine != NONE ? errStream.push( errLine ) : NONE
    }

    if ( isCode ) deleteFileSync( spec )

    return { stdout: outStream.join( LF ), stderr: errStream.join( LF ) }
}

exec_node.options = { __dirname, __filename }

module.exports = exec_node
