const WShell = require( 'WScript.Shell' )
const { join, CurrentDirectory, toPosixSep } = require( 'pathname' )
const { writeTextFileSync, deleteFileSync, existsFileSync } = require( 'filesystem' )
const genUUID = require( 'genUUID' )

const LF = '\n'
const NONE = ''

function exec_node ( code_or_spec ) {
    const isCode = typeof code_or_spec === 'function'
    const spec = isCode ? join( exec_node.options.__dirname, genUUID() + '.js' ) : String( code_or_spec )

    if ( isCode ) {
        writeTextFileSync( spec, `( () => {
            ( ${ String( code_or_spec ) } )( ${ JSON.stringify( exec_node.options ) } )
        } )()` )
    }
    try {
        const { stdOut, stdErr } = WShell.Exec( `node ${ spec }` )
        let outStream = []
        let errStream = []

        while ( !stdOut.AtEndOfStream ) {
            const outLine = stdOut.ReadLine()
            if ( outLine != NONE ) {
                console.print( outLine + LF )
                outStream.push( outLine )
            }
        }

        while ( !stdErr.AtEndOfStream ) {
            const errLine = stdErr.ReadLine()
            if ( errLine != NONE ) {
                console.print( errLine + LF )
                errStream.push( errLine )
            }
        }

        return { stdout: outStream.join( LF ), stderr: errStream.join( LF ) }

    } catch ( error ) {

    } finally {
        if ( isCode && existsFileSync( spec ) ) deleteFileSync( spec )
    }

}

exec_node.options = {
    __dirname: toPosixSep( CurrentDirectory ),
    __filename: join( CurrentDirectory, __filename.match( /(?!\/)[^\/]+$/ )[0] )
}

module.exports = exec_node
