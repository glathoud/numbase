/*global numbase test_numbase document yak*/

function test_numbase( /*? DOM node | DOM id string?*/node_or_id )
{
    var outnode = node_or_id  &&  (
        'string' === typeof node_or_id  
            ?  document.getElementById( node_or_id )
            :  node_or_id
    )
    , result_arr = create_test_arr().map( run_one_test )
    , all_passed = result_arr.every( yak.f( '.ok' ) )

    , n_total    = result_arr.length
    , n_success  = result_arr.filter( yak.f( '.ok' ) ).length
    , n_failure  = n_total - n_success
    ;
    
    if (outnode)
    {
        outnode.innerHTML = yak( 
            [
                { p : [
                    'Summary: ran '
                    , n_total, ' tests, got '
                    , n_failure, ' failures.'
                ] }
                , { ul : result_arr.map( format_one_result ).map( yak.f( '{ li : v }' ) ) }
            ]
        );
    }
    
    return { 
        all_passed   : all_passed
        , result_arr : result_arr
        , n_total    : n_total
        , n_success  : n_success
        , n_failure  : n_failure
    };

    // --- Details

    function run_one_test( test_fun )
    {
        var name  = test_fun.name
        ,   error = ''
        ,   ok    = false
        ;

        try 
        {
            ok   = test_fun();
        }
        catch ( e )
        {
            ok = false;
            error = '' + e;
        }
        
        if (!ok)
        {
            var error_msg = 'Test "' + name + '" failed. ' + error;
            if ('undefined' !== typeof console)
                console.error( error_msg );
            else
                print( '[ERROR] ' + error_msg );
        }
        
        return { ok : ok, name : name };
    }

    function format_one_result( result )
    {
        return [
            result.name + ': '
            , yak.o(
                'span class="' + (result.ok  ?  'happy'  :  'sad') + '"'
                ,  result.ok  ?  'ok'  :  'failed'
            )
        ];
    }

    function create_test_arr()
    {
        var FOUR_EXP = '4:120.213:-210'
        ,   FOUR     = '4:120.213'
        ,   FOUR_INT = '4:120'
        ;
        return [ 

            function parse_four_exp()
            {
                var s = FOUR_EXP;

                return equal( 
                    numbase.parse( s )
                    , (1*4*4 + 2*4 + 0*1 + /*.*/ 2/4 + 1/(4*4) + 3/(4*4*4))
                        * Math.pow( 4, -(2*4*4 + 1*4 + 0*1))
                );
            }

            , function parse_four()
            {
                var s = FOUR;

                return equal( 
                    numbase.parse( s )
                    , (1*4*4 + 2*4 + 0*1 + /*.*/ 2/4 + 1/(4*4) + 3/(4*4*4))
                );
            }

            , function parse_four_int()
            {
                var s = FOUR_INT;

                return equal( 
                    numbase.parse( s )
                    , 1*4*4 + 2*4 + 0*1
                );
            }

            , function parseInt_four_int()
            {
                var s   = FOUR_INT
                ,   arr = FOUR_INT.split( ':' )
                ;

                return equal(
                    numbase.parseInt( arr[ 1 ], arr[ 0 ] )
                    , numbase.parse( s )
                );
            }
            
        ];
    }

    function equal( x, y )
    {
        var epsilon = x && y
            ?  Math.min( Math.abs( x ), Math.abs( y ) ) * 1e-10
            :  1e-10
        ;
        return Math.abs( x - y ) < epsilon;
    }
}