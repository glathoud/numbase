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

    , success_arr = result_arr.filter( yak.f( '.ok' ) )
    , failure_arr = result_arr.filter( yak.f( '!v.ok' ) )

    , n_total    = result_arr.length
    , n_success  = success_arr.length
    , n_failure  = failure_arr.length
    ;
    if (n_total !== n_success + n_failure)
        null.bug;
    
    if (outnode)
    {
        var ok_fail = []
        , tmp =

        outnode.innerHTML = yak(
            [
                { p : [
                    'Summary: ran '
                    , n_total, ' tests, got '
                    , n_success, ' success(es) and '
                    , n_failure, ' failure(s).'
                ] }
                , { ul : 
                    [ { ok : true, name : 'ok', arr : success_arr }
                      , { ok : false, name : 'failed', arr : failure_arr }
                    ]
                    .map( format_ok_failed_list )
                    .filter( yak.f( '' ))
                    .map( yak.f( '{li:v}' ) )
                  }
            ]
        );
    }
    
    if (all_passed  &&  'undefined' !== typeof console)
        console.log( 'All ' + n_total + ' tests passed.' );

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

    function format_ok_failed_list( o )
    {
        return o.arr.length > 0  &&  [
            yak.o(
                'span class="' + (o.ok  ?  'happy'  :  'sad') + '"'
                ,  o.name
            )
            , ': ' + (o.arr.map( yak.f( '.name' )).join( ', ' ))
            , '.'
        ];
    }
    

    function create_test_arr()
    {
        var FOUR_INT = '4:120',            V_FOUR_INT = 1*4*4 + 2*4 + 0*1
        ,   FOUR     = FOUR_INT + '.213',  V_FOUR     = V_FOUR_INT + /*.*/ 2/4 + 1/(4*4) + 3/(4*4*4)
        ,   FOUR_EXP = FOUR + ':-210',     V_FOUR_EXP = V_FOUR * Math.pow( 4, -(2*4*4 + 1*4 + 0) )

        ,   BALTHREE_INT = 'b3:_101_1',        V_BALTHREE_INT = ((-1*3 + 0)*3 + 1)*3 - 1
        ,   BALTHREE_INT_NEG = 'b3:-_101_1',   V_BALTHREE_INT_NEG = -V_BALTHREE_INT

        ,   BALFIVE_INT = 'b5:_210_2',         V_BALFIVE_INT = -2*5*5*5 + 1*5*5 + 0*5 - 2*1
        ,   BALFIVE = BALFIVE_INT + '._201_1', V_BALFIVE     = V_BALFIVE_INT - 2/5 + 0/(5*5) + 1/(5*5*5) - 1/(5*5*5*5)
        ,   BALFIVE_EXP = BALFIVE + ':_101',   V_BALFIVE_EXP = V_BALFIVE * Math.pow( 5, (- 1*5 + 0)*5 + 1*1 )
        ;
        return [ 

            function parse_four_exp()
            {
                return equal( numbase.parse( FOUR_EXP ), V_FOUR_EXP );
            }

            , function parse_four()
            {
                return equal( numbase.parse( FOUR ), V_FOUR );
            }

            , function parse_four_int()
            {
                return equal( numbase.parse( FOUR_INT ), V_FOUR_INT );
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

            , function backforth_four_int()
            {
                return equal( V_FOUR_INT, numbase.parse( numbase.str( V_FOUR_INT, 4 ) ) );
            }

            , function backforth_four()
            {
                return equal( V_FOUR, numbase.parse( numbase.str( V_FOUR, 4 ) ) );
            }

            , function backforth_four_exp()
            {
                return equal( V_FOUR_EXP, numbase.parse( numbase.str( V_FOUR_EXP, 4 ) ) );
            }



            , function parse_balthree_int()
            {
                return equal( numbase.parse( BALTHREE_INT ), V_BALTHREE_INT );
            }
            , function parse_balthree_int_neg()
            {
                return equal( numbase.parse( BALTHREE_INT_NEG ), V_BALTHREE_INT_NEG );
            }
            , function parseInt_balthree_int()
            {
                return equal( numbase.parseInt( BALTHREE_INT.split( ':' )[ 1 ], 'b3' ), V_BALTHREE_INT );
            }
            , function parseInt_balthree_int_neg()
            {
                return equal( numbase.parseInt( BALTHREE_INT_NEG.split( ':' )[ 1 ], 'b3' ), V_BALTHREE_INT_NEG );
            }




            , function parse_balfive_int()
            {
                return equal( numbase.parse( BALFIVE_INT ), V_BALFIVE_INT );
            }
            
            , function parse_balfive()
            {
                return equal( numbase.parse( BALFIVE ), V_BALFIVE );
            }

           , function parse_balfive_exp()
            {
                return equal( numbase.parse( BALFIVE_EXP ), V_BALFIVE_EXP );
            }

            , function parseInt_balfive_int()
            {
                var s   = BALFIVE_INT
                ,   arr = BALFIVE_INT.split( ':' )
                ;
                return equal(
                    numbase.parseInt( arr[ 1 ], arr[ 0 ] )
                    , numbase.parse( s )
                );
            }
            , function backforth_balfive_int()
            {
                return equal( V_BALFIVE_INT, numbase.parse( numbase.str( V_BALFIVE_INT, 'b5' ) ) );
            }
            , function backforth_balfive()
            {
                return equal( V_BALFIVE, numbase.parse( numbase.str( V_BALFIVE, 'b5' ) ) );
            }
            , function backforth_balfive_exp()
            {
                return equal( V_BALFIVE_EXP, numbase.parse( numbase.str( V_BALFIVE_EXP, 'b5' ) ) );
            }


            , function str_NO_small_powershift_balanced_base_4()
            {
                return 'b4:120_1101_11:_10' === numbase.str( (((1*4 + 2)*4 + 0)*4 -1)*4 + 1 + /*.*/ (0 + (1 - (1 - 1/4)/4)/4 )/4, 'b4' );
            }

            , function str_small_powershift_balanced_base_4_a()
            {
                return 'b4:120_11.01_1' === numbase.str( (((1*4 + 2)*4 + 0)*4 -1)*4 + 1 + /*.*/ (0 + (1 - 1/4)/4 )/4, 'b4' );
            }

            , function str_small_powershift_balanced_base_4_b()
            {
                return 'b4:120_11.01' === numbase.str( (((1*4 + 2)*4 + 0)*4 -1)*4 + 1 + /*.*/ (0 + 1/4 )/4, 'b4' );
            }
            
            , function str_small_powershift_balanced_base_4_c()
            {
                return 'b4:120_11.1' === numbase.str( (((1*4 + 2)*4 + 0)*4 -1)*4 + 1 + /*.*/ 1/4, 'b4' );
            }
            
            , function str_small_powershift_balanced_base_4_d()
            {
                return 'b4:120_11' === numbase.str( (((1*4 + 2)*4 + 0)*4 -1)*4 + 1, 'b4' );
            }
            
            , function str_small_powershift_balanced_base_4_e()
            {
                return 'b4:120_110' === numbase.str( ((((1*4 + 2)*4 + 0)*4 -1)*4 + 1)*4, 'b4' );
            }

            , function str_small_powershift_balanced_base_4_f()
            {
                return 'b4:120_1100' === numbase.str( ((((1*4 + 2)*4 + 0)*4 -1)*4 + 1)*4*4, 'b4' );
            }
            
            , function str_small_powershift_balanced_base_4_g()
            {
                return 'b4:120_21000' === numbase.str( ((((1*4 + 2)*4 + 0)*4 -2)*4 + 1)*4*4*4, 'b4' );
            }
            
            , function str_NO_small_powershift_balanced_base_4_g()
            {
                return 'b4:120_21:10' === numbase.str( ((((1*4 + 2)*4 + 0)*4 -2)*4 + 1)*4*4*4*4, 'b4' );
            }
            




            , function str_NO_small_powershift_unbalanced_base_4()
            {
                return '4:-1231032101:-10' === numbase.str( -(((((((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3)*4 +2)*4 +1)*4 +0)*4 + 1) /(4*4*4*4), 4 );
            }

            , function str_small_powershift_unbalanced_base_4_a()
            {
                return '4:-123103.213' === numbase.str( -((((((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3)*4 +2)*4 +1)*4 +3) /(4*4*4), 4 );
            }

            , function str_small_powershift_unbalanced_base_4_b()
            {
                return '4:-123103.21' === numbase.str( -(((((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3)*4 +2)*4 +1) /(4*4), 4 );
            }

            , function str_small_powershift_unbalanced_base_4_c()
            {
                return '4:-123103.2' === numbase.str( -((((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3)*4 +2) /4, 4 );
            }

            , function str_small_powershift_unbalanced_base_4_d()
            {
                return '4:-123103' === numbase.str( -(((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3), 4 );
            }

            , function str_small_powershift_unbalanced_base_4_e()
            {
                return '4:-1231030' === numbase.str( -(((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3)*4, 4 );
            }

            , function str_small_powershift_unbalanced_base_4_f()
            {
                return '4:-12310300' === numbase.str( -(((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3)*4*4, 4 );
            }

            , function str_small_powershift_unbalanced_base_4_g()
            {
                return '4:-123103000' === numbase.str( -(((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3)*4*4*4, 4 );
            }

            , function str_small_powershift_unbalanced_base_4_h()
            {
                return '4:-123103:10' === numbase.str( -(((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3)*4*4*4*4, 4 );
            }

            , function str_small_powershift_unbalanced_base_4_i()
            {
                return '4:-123103:11' === numbase.str( -(((((1*4 + 2)*4 + 3)*4 +1)*4 +0)*4 +3)*4*4*4*4*4, 4 );
            }

 






            , function basic_parse_base10() { return 1234 === numbase.parse( '1234' ); }
            
            , function basic_parseInt_base10_2() { return 1234 === numbase.parseInt( '1234' ); }
            
            , function basic_parseInt_base10_3() { return -1234 === numbase.parseInt( '-1234' ); }
            
            , function basic_parse_base10_4() { return -1234.5678 === numbase.parse( '-1234.5678' ); }

            

            , function basic_str_zero_1() { return 'b3:0' === numbase.str( 0, 'b3' ); }
            , function basic_str_zero_2() { return 'b4:0' === numbase.str( 0, 'b4' ); }
            , function basic_str_zero_3() { return 'b3:0' === numbase.str( -0, 'b3' ); }
            , function basic_str_zero_4() { return 'b4:0' === numbase.str( -0, 'b4' ); }

            , function basic_str_zero_11() { return '3:0' === numbase.str( 0, '3' ); }
            , function basic_str_zero_12() { return '4:0' === numbase.str( 0, '4' ); }
            , function basic_str_zero_13() { return '3:0' === numbase.str( -0, '3' ); }
            , function basic_str_zero_14() { return '4:0' === numbase.str( -0, '4' ); }
            , function basic_str_zero_15() { return '10:0' === numbase.str( 0, '10' ); }
            , function basic_str_zero_16() { return '10:0' === numbase.str( -0, '10' ); }
            
            , function basic_str_zero_21() { return '3:0' === numbase.str( 0, 3 ); }
            , function basic_str_zero_22() { return '4:0' === numbase.str( 0, 4 ); }
            , function basic_str_zero_23() { return '3:0' === numbase.str( -0, 3 ); }
            , function basic_str_zero_24() { return '4:0' === numbase.str( -0, 4 ); }



            // To be safe, also test the specific examples mentionned in the article ./index.html




            , function expl_int_parse_binary() { return equal( 123, numbase.parse( '2:1111011' ) ); }

            , function expl_int_parseInt_binary() { return equal( 123, numbase.parseInt( '1111011', 2 ) ); }

            , function expl_int_parseInt_binary_2() { return equal( 123, numbase.parseInt( '1111011', '2' ) ); }
            
            , function expl_int_parse_hexadecimal() { return equal( 123, numbase.parse( '16:7b' ) ); }

            , function expl_int_parseInt_hexadecimal() { return equal( 123, numbase.parseInt( '7b', 16 ) ); }

            , function expl_int_parseInt_hexadecimal_2() { return equal( 123, numbase.parseInt( '7b', '16' ) ); }           

            , function expl_int_parse_balanced_ternary() { return equal( 123, numbase.parse( 'b3:1_1_1_1_10' ) ); }

            , function expl_int_parseInt_balanced_ternary() { return equal( 123, numbase.parseInt( '1_1_1_1_10', 'b3' ) ); }




            , function expl_real_parse_binary() { return equal( -123.25, numbase.parse( '2:-1111011.01' ) ); }

            , function expl_real_parse_hexadecimal() { return equal( -123.25, numbase.parse( '16:-7b.4' ) ); }

            , function expl_real_parse_balanced_ternary() { return equal( -123.25, numbase.parse( 'b3:_111110_11_11_11_11_11_11_11_11_11_11_11_11_11_11:_100_1' ) ); }
     


            , function expl_int_parse_balanced_ternary_2() { return equal( -25, numbase.parse( 'b3:_101_1' ) ); }

            , function expl_int_parseInt_balanced_ternary_2() { return equal( -25, numbase.parseInt( '_101_1', 'b3' ) ); }



            , function expl_int_parse_negated_balanced_ternary_2() { return equal( 25, numbase.parse( 'b3:-_101_1' ) ); }

            , function expl_int_parseInt_negated_balanced_ternary_2() { return equal( 25, numbase.parseInt( '-_101_1', 'b3' ) ); }


            
            , function expl_real_parse_balanced_ternary_2() { return equal( -1*3 + 0*1 + 1/3 - 1/(3*3), numbase.parse( 'b3:_10.1_1' ) ); }

            , function expl_real_parse_balanced_ternary_exp() 
            { 
                return equal( (-1*3 + 0*1 + 1/3 - 1/(3*3)) * Math.pow( 3, 1*(3*3) - 1*3 + 0 )
                              , numbase.parse( 'b3:_10.1_1:1_10' ) 
                            ); 
            }

            
            , function expl_int_str_balanced_ternary_2() { return 'b3:_101_1' === numbase.str( -25, 'b3' ); }
            
            , function expl_real_str_balanced_ternary() 
            {
                return numbase.str( -123.25, 'b3' ) === 'b3:_111110_11_11_11_11_11_11_11_11_11_11_11_11_11_11:_100_1';
            }


            , function expl_real_str_balanced_ternary_2() 
            {
                return 'b3:0._11_11_11_11_11_11_11_11_11_11_11_11_11_11_11_11_11' === numbase.str( -0.25, 'b3' );
            }

            , function expl_real_back_and_forth_balanced_ternary_2() 
            {
                return equal( -0.25, numbase.parse( numbase.str( -0.25, 'b3' ) ) );
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
