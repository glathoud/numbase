/*global numbase*/
var numbase;
(function () {

    // --- API

    numbase = { 
        html       : numbase_html 
        , parse    : numbase_parse
        , parseInt : numbase_parseInt
        , str      : numbase_str
    };
    
    // --- Implementation

    var  _NUMBASE_SPLIT_RX = /_[^_]|[^_]/g
    ,    _BINARY_PRECISION = 52  // IEEE 754 double (64 bits)  http://en.wikipedia.org/wiki/Double-precision_floating-point_format
    ,    _2_POW_BIN_PREC   = Math.pow( 2, _BINARY_PRECISION )
    ,    _SMALL_POWERSHIFT = 4
    ;

    function numbase_html( /*string*/s )
    {
        var ind = s.indexOf( ':' );
        if (-1 < ind)
            s = s.slice( ind + 1 );
        
        var digit_arr = s.match( _NUMBASE_SPLIT_RX )

        ,     dot_ind = digit_arr.indexOf( '.' )
        ,     has_dot = -1 < dot_ind

        ,        left = has_dot  ?  digit_arr.slice( 0, dot_ind )   :  digit_arr
        ,       right = has_dot  ?  digit_arr.slice( 1 + dot_ind )  :  []
        ;
        for (var i = left.length - 2; i > 0; i-=3)
            left.splice( i, 0, ' ' );
        
        if (has_dot)
            for (var i = Math.ceil( right.length / 3 ) * 3; i > 0; i -= 3)
                if (i < right.length - 1)
                    right.splice( i, 0, ' ' );

        return [ '<span class="numbase-number">' ]
            .concat( left.concat( right  ?  [ '.' ].concat( right )  :  [] ).map( _numbase_signed_digit_2_html ) )
            .concat( [ '</span>' ] )
        ;

        function _numbase_signed_digit_2_html( /*string*/sd )
        {
            var is_space = sd === ' '
            ,     is_pos = sd.length < 2

            ,       html = is_space  ?  '&nbsp;'
                :  is_pos  ?  sd  
                :  sd.charAt( 1 )

            ,   digit_class = is_space  ?  ''
                :  (' numbase-digit-' + (is_pos  ?  'pos'  :  'neg'))
            ;
            
            return '<span class="numbase-digit' + digit_class + '">' + html + '</span>';
        }
    }

    function numbase_parseInt( /*string e.g. "-_1_a2_3"*/sInt, /*?string | number?  default 10*/base )
    {
        var bi = _numbase_get_baseinfo( base )

        , base_radix     = bi.base_radix
        , base_digit_arr = bi.base_digit_arr
        , base_digit_rx  = bi.base_digit_rx
        
        ,        mo = sInt.match( /^(\+|-)?(.*)$/ )
        ,  pre_sign = mo[ 1 ] === '-'  ?  -1  :  +1
        , digit_arr = mo[ 2 ].match( base_digit_rx )

        , number = 0
        ;

        for (var i = digit_arr.length, factor = 1; i--; factor *= base_radix)
        {
            var  d_str  = digit_arr[ i ]
            ,    d_sign = d_str.charAt( 0 ) === '_'  ?  -1  :  +1
            ,    digit  = base_digit_arr.indexOf( d_str.charAt( d_sign < 0  ?  1  :  0 ) ) | 0
            ;
            number += d_sign * digit * factor;
        }
        
        return pre_sign * number;

    }

    

    function numbase_parse( /*string e.g. "b20:-_1_a2_3._45_6_34_a_e:-_2a" */s )
    {
        var        mo = /^(?:(b?\d+):)?([\+\-]?)(\w*)?(?:\.(\w*)?)?(?::(?:([\+\-]?)(\w+)))?$/.exec( s.toLowerCase() )
        ,           i = 0
        ,        base = mo[ ++i ]  ||  '10'  // string e.g. "16" or "b20", or number (e.g. 10, equivalent to "10")
        , global_sign = mo[ ++i ] === '-'  ?  -1  :  +1
        ,    int_part = mo[ ++i ]  ||  '0'
        ,   frac_part = mo[ ++i ]  ||  '0'
        ,    exp_sign = mo[ ++i ] === '-'  ?  -1  :  +1
        ,    exponent = mo[ ++i ]  ||  '0'
        
        , base_radix = base.match( /\d+/ ) | 0

        ,  int_number = numbase_parseInt(  int_part, base )

        , frac_length = frac_part.match( /[^_]/g ).length
        , frac_number = numbase_parseInt( frac_part, base ) / Math.pow( base_radix, frac_length )
        
        ,  exp_number = numbase_parseInt( exponent, base )
        ,  exp_factor = Math.pow( base_radix, (exp_sign < 0  ?  -exp_number  :  exp_number) )
        
        ,  abs_value  = (int_number + frac_number) * exp_factor
        ;
        
        return global_sign < 0  ?  -abs_value  :  abs_value;
    }


    function numbase_str( /*integer | float*/v, /*string | number*/base )
    // Returns a string representing the number `v` in the required `base`.
    //
    // The string representation is complete, including `base`, so it
    // can be fed into `numbase.parse()` to obtained another number
    // `v2` very close to the original number `v` (rounding errors).
    {
        // Inputs

        // Outputs
        
        var digit_arr
        ,   exp_digit_arr
        ;
        
        if (v === 0)
        {
            digit_arr = [ '0' ];
            exp_digit_arr   = [];
        }
        else 
        {
            var d_output = _numbase_encode(
                { 
                    exponent : false
                    , v      : v
                    , base   : base
                }
            )
            , powershift = d_output.powershift
            ;
            digit_arr = d_output.digit_arr;

            var neg_delta  = powershift < 0   &&  powershift + digit_arr.length;
            
            // For better readability try to avoid small exponents

            if (0 < powershift  &&  powershift < _SMALL_POWERSHIFT)
            {
                while( powershift-- )
                    digit_arr.push( '0' );

                powershift = 0;
            }
            else if (-_SMALL_POWERSHIFT < powershift  &&  powershift < 0)
            {
                while (digit_arr.length < Math.abs( powershift ))
                    digit_arr.unshift( '0' );

                digit_arr.splice( powershift, 0, '.' );

                powershift = 0;
            }
            else if (neg_delta !== false  &&  -_SMALL_POWERSHIFT < neg_delta  &&  neg_delta <= 0)
            {
                while (neg_delta++ < 0)
                {
                    digit_arr.unshift( '0' );
                }

                digit_arr.unshift( '0', '.' );
                powershift = 0;
            }
            else if (neg_delta !== false  &&  0 < neg_delta   &&  neg_delta < _SMALL_POWERSHIFT)
            {
                digit_arr.splice( 1 + neg_delta, 0, '.' );
                powershift = 0;
            }
            
            
            // Also the exponent `powershift` is converted to the desired base

            exp_digit_arr = powershift === 0

                ?  []

                :  _numbase_encode( 
                    {
                        exponent : true
                        , v      : powershift
                        , base   : base
                    } 
                ).digit_arr
            ;
        }

        return base + ':' + digit_arr.join( '' ) + (exp_digit_arr  &&  exp_digit_arr.length  ?  ':' + exp_digit_arr.join( '' )  :  '');
    }

    // -------
    // Details
    
    function _create_base_n_digit_arr( base_n_digit )
    {
        return Array.apply( null, Array( base_n_digit ) ).map( _number_one_digit ).join( '' );
    }
    
    function _number_one_digit( tmp, i )
    {
        return i < 10  ?  '' + i  :  String.fromCharCode( 'a'.charCodeAt( 0 ) + i - 10 );
    }

    function _numbase_encode( input ) 
    {
        // -- Input: base

        var base = input.base;

        var str_base       = 'string' === typeof base
        ,    is_unbalanced = !(str_base  &&  'b' === base.charAt( 0 ).toLowerCase())
        ,  base_radix      = str_base  ?  base.match( /\d+/ ) | 0  :  base
        ;
        (base_radix  ||  null).toPrecision.call.a;

        var    base_n_digit = is_unbalanced  ?  base_radix  :  1 + (base_radix >> 1)

        ,    base_digit_arr = base_n_digit in _n_2_digit_arr
            ?  _n_2_digit_arr[ base_n_digit ]
            :  (
                _n_2_digit_arr[ base_n_digit ] = _create_base_n_digit_arr( base_n_digit )
            )

        
        // -- Other inputs

        ,   exponent = !!input.exponent  // Slight differences

        ,   v    = input.v
        ,   vabs = Math.abs( v )
        
        // `v_end`: Not using >> because it would automatically switch to the 32-bit JS integer representation
        , v_end = exponent  ?  null  :  (Math.abs( v ) / _2_POW_BIN_PREC / 2)

        ,      exp2 = Math.log( vabs ) / Math.log( base_radix )
        ,    fl_ex = Math.floor( exp2 )

        // -- Temporary variables

        ,  precision = exponent  ?  null  :  1 + Math.ceil( Math.log( _2_POW_BIN_PREC ) / Math.log( base_radix ) )
        ,  powershift
        ,  rest

        // -- Output

        , digit_arr;
        ;
        
        // Go!
        
        if (is_unbalanced)
        {
            digit_arr  = v < 0  ?  [ '-' ]  :  [];
            rest       = vabs;

            powershift = 1 + fl_ex;
        }
        else
        {
            digit_arr  = [];
            rest       = v;

            powershift = 1 + fl_ex + (
                exp2 > fl_ex + Math.log( base_radix * 0.5 ) / Math.log( base_radix ) + 1e-10  
                    ?  1  
                    :  0
            );
        }
        
        while (exponent  
               ?  powershift  
               :  precision--  &&  Math.abs( rest ) >= v_end
              )
        {
            powershift--;
            
            var tmp_value = Math.pow( base_radix, powershift )
            ,   digit_str
            ;
            if (is_unbalanced)
            {
                var digit_int = (rest / tmp_value) | 0;
                if (!(0 <= digit_int  &&  digit_int < base_radix))
                    null.bug;
                
                digit_str = base_digit_arr[ digit_int ];
            }
            else
            {
                var rest_sign = rest < 0  ?  -1  :  +1
                ,   rest_abs = Math.abs( rest )
                
                ,  digit_int = tmp_value > rest_abs  &&  rest_abs > tmp_value / 2 * (1 - 1e-10) 
                    ?  rest_sign 
                    :  rest_sign * Math.round( rest_abs / tmp_value )
                ;
                if (!(-base_radix <= digit_int  &&  digit_int < base_radix))
                    null.bug;
                
                var digit_sign = digit_int < 0  ?  -1  :  +1
                ,   digit_uint = Math.abs( digit_int )
                ,   digit_ustr = base_digit_arr[ digit_uint ]
                ;
                (digit_ustr  ||  null).substring.call.a;
                
                digit_str = (digit_sign < 0  ?  '_'  :  '') + digit_ustr;
            }
            
            digit_arr.push( digit_str );
            rest -= digit_int * tmp_value;
        }

        return { 
            digit_arr    : digit_arr 
            , powershift : exponent  ?  null  :  powershift
        };
    }

    var _n_2_digit_arr = {}
    ,   _n_2_digit_rx  = {}
    ;
    function _numbase_get_baseinfo( /*?string | number?  default 10*/base )
    {
        base != null  ||  (base = 10);

        var str_base       = 'string' === typeof base
        ,    is_unbalanced = !(str_base  &&  'b' === base.charAt( 0 ).toLowerCase())
        ,  base_radix      = str_base  ?  base.match( /\d+/ ) | 0  :  base
        ;
        (base_radix  ||  null).toPrecision.call.a;

        var base_n_digit = is_unbalanced  ?  base_radix  :  1 + (base_radix >> 1)

        , base_digit_arr = base_n_digit in _n_2_digit_arr
            ?  _n_2_digit_arr[ base_n_digit ]
            :  (
                _n_2_digit_arr[ base_n_digit ] = _create_base_n_digit_arr( base_n_digit )
            )

        , base_digit_rx = base_n_digit in _n_2_digit_rx  
            ?  _n_2_digit_rx[ base_n_digit ]
            :  (_n_2_digit_rx[ base_n_digit ] = new RegExp
                ( 
                    '_?[' + base_digit_arr + ']'
                    , 'g' 
                )
               )
        ;

        return {
            is_unbalanced    : is_unbalanced
            , base_radix     : base_radix
            , base_digit_arr : base_digit_arr
            , base_digit_rx  : base_digit_rx
        };
        
    }
   
})();
