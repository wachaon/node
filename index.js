const WShell = require( 'WScript.Shell' )
const { join, CurrentDirectory, toPosixSep } = require( 'pathname' )
const { writeTextFileSync, deleteFileSync, existsFileSync, ByteToText } = require( 'filesystem' )
const genUUID = require( 'genUUID' )
const Buffer = require( 'buffer')

const LF = '\n'
const NONE = ''

function exec_node ( code_or_spec ) {
    const isCode = typeof code_or_spec === 'function'
    const spec = isCode ? join( exec_node.options.__dirname, genUUID() + '.js' ) : String( code_or_spec )

    if ( isCode ) {
        writeTextFileSync( spec, `( () => {
            const __wesStdLog__ = ( type, ...args ) => {
                const { format } = require( 'util' )
                const log = format( ...args )
                const uint16 = Uint16Array.from( log, ( c ) => c.charCodeAt( 0 ) )
                if ( type === 'log' ) process.stdout.write( JSON.stringify( Array.from( uint16 ) ) + '\\n' )
                else process.stderr.write( JSON.stringify( Array.from( uint16 ) ) + '\\n' )
            }
            console.log = ( ...args ) => { __wesStdLog__( 'log', ...args ) }
            console.error = ( ...args ) => { __wesStdLog__( 'error', ...args ) };
            ( ${ String( code_or_spec ) } )( ${ JSON.stringify( exec_node.options ) } )
        } )()`, 'UTF-8' )
    }
    try {
        const { stdOut, stdErr } = WShell.Exec( `node ${ spec }` )
        let outStream = []
        let errStream = []

        while ( !stdOut.AtEndOfStream ) {
            const outLine = JSON.parse( stdOut.ReadLine() ).map( v => String.fromCharCode( v ) ).join( NONE )
            if ( outLine != NONE ) {
                if( exec_node.options.silent ) console.print( outLine + LF )
                outStream.push( outLine )
            }
        }

        while ( !stdErr.AtEndOfStream ) {
            const errLine = JSON.parse( stdErr.ReadLine() ).map( v => String.fromCharCode( v ) ).join( NONE )
            if ( errLine != NONE ) {
                if( exec_node.options.silent ) console.print( errLine + LF )
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
    silent: false,
    __dirname: toPosixSep( CurrentDirectory ),
    __filename: join( CurrentDirectory, __filename.match( /(?!\/)[^\/]+$/ )[0] )
}

module.exports = exec_node
