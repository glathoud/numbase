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

    var  _NUMBASE_SPLIT_RX = /(_[^_]|[^_])/g
    ,    _BINARY_PRECISION = 52  // IEEE 754 double (64 bits)  http://en.wikipedia.org/wiki/Double-precision_floating-point_format
    ,    _2_POW_BIN_PREC   = Math.pow( 2, _BINARY_PRECISION )
    ,    _SMALL_POWERSHIFT = 4
    ;

    function numbase_html( /*string*/s )
    {
        var ind = s.indexOf( ':' );
        if (-1 < ind)
            s = s.slice( ind + 1 );
        
        return s.match( _NUMBASE_SPLIT_RX ).map( _numbase_signed_digit_2_html );

        function _numbase_signed_digit_2_html( /*string*/sd )
        {
            return sd.length < 2  
                ?  sd  // positive
                :  '<span class="numbase-neg-digit">' + sd.charAt( 1 ) + '</span>';  // negative
        }
    }

    var _n_2_digit_arr = {}
    ,   _n_2_digit_rx  = {}
    ;
    function numbase_parseInt( /*string e.g. "-_1_a2_3"*/sInt, /*?string | number?  default 10*/base )
    {
        base != null  ||  (base = 10);

        var str_base     = 'string' === typeof base
        ,    is_balanced = str_base  &&  'b' === base.charAt( 0 ).toLowerCase()  ||  false
        ,  base_radix   = str_base  ?  base.match( /\d+/ ) | 0  :  base
        ;
        (base_radix  ||  null).toPrecision.call.a;

        var      mo = sInt.match( /^(\+|-)?(.*)$/ )
        ,      sign = mo[ 1 ] === '-'  ?  -1  :  +1
        
        , base_n_digit = is_balanced  ?  1 + (base_radix >> 1)  :  base_radix

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
        
        , digit_arr = mo[ 2 ].match( base_digit_rx )

        , number = 0
        ;

        for (var i = digit_arr.length, factor = 1; i--; factor *= base_radix)
        {
            var  d_str = digit_arr[ i ]
            ,     sign = d_str.charAt( 0 ) === '_'  ?  -1  :  +1
            ,    digit = base_digit_arr.indexOf( d_str.charAt( sign < 0  ?  1  :  0 ) ) | 0
            ;
            number += sign * digit * factor;
        }
        
        return number;

    }
    

    function numbase_parse( /*string e.g. "b20:-_1_a2_3._45_6_34_a_e:-_242a_a" */s )
    {
        var        mo = /^(?:(b?\d+):)?([\+\-]?)(\w*)?(?:\.(\w*)?)?(?::(?:([\+\-]?)(\w+)))?$/.exec( s.toLowerCase() )
        ,           i = 0
        ,        base = mo[ ++i ]  ||  10  // string e.g. "16" or "b20", or number (e.g. 10, equivalent to "10")
        , global_sign = mo[ ++i ] === '-'  ?  -1  :  +1
        ,    int_part = mo[ ++i ]  ||  '0'
        ,   frac_part = mo[ ++i ]  ||  '0'
        ,    exp_sign = mo[ ++i ] === '-'  ?  -1  :  +1
        ,    exponent = mo[ ++i ]  ||  '0'
        
        , base_radix = 'number' === typeof base  ?  base  :  base.match( /\d+/ ) | 0

        ,  int_number = numbase_parseInt(  int_part, base )

        , frac_length = frac_part.match( /[^_]/g ).length
        , frac_number = numbase_parseInt( frac_part, base ) / Math.pow( base_radix, frac_length )
        
        ,  exp_number = numbase_parseInt( exponent, base )
        ,  exp_factor = Math.pow( base_radix, (exp_sign < 0  ?  -exp_number  :  exp_number) )
       
        ,  abs_value  = (int_number + frac_number) * exp_factor
        ;
        
        return global_sign < 0  ?  -abs_value  :  abs_value
    }


    function numbase_str( /*integer | float*/v, /*string | number*/base )
    // Returns a string representing the number `v` in the required `base`.
    //
    // The string representation is complete, including `base`, so it
    // can be fed into `numbase.parse()` to obtained another number
    // `v2` very close to the original number `v` (rounding errors).
    {
        var str_base     = 'string' === typeof base
        ,    is_balanced = str_base  &&  'b' === base.charAt( 0 ).toLowerCase()  ||  false
        ,  base_radix   = str_base  ?  base.match( /\d+/ ) | 0  :  base
        ;
        (base_radix  ||  null).toPrecision.call.a;

        var    base_n_digit = is_balanced  ?  1 + (base_radix >> 1)  :  base_radix

        ,    base_digit_arr = base_n_digit in _n_2_digit_arr
            ?  _n_2_digit_arr[ base_n_digit ]
            :  (
                _n_2_digit_arr[ base_n_digit ] = _create_base_n_digit_arr( base_n_digit )
            )

        ,   sign = v < 0  ?  -1  :  +1
        ,   vabs = Math.abs( v )

        ,      exp2 = Math.log( vabs ) / Math.log( base_radix )

        // outputs
        ,  digit_arr
        ,  exp_arr
        ;
        
        if (v === 0)
        {
            digit_arr = [ '0' ];
            exp_arr   = [];
        }
        else if (!is_balanced)
        {
            var  precision = 1 + Math.ceil( Math.log( _2_POW_BIN_PREC ) / Math.log( base_radix ) );

            var    rest     = vabs
            ,      rest_end = rest / _2_POW_BIN_PREC / 2  // Not using >> because it would automatically switch to the 32-bit JS integer representation
            ,    powershift = 1 + Math.floor( exp2 )
            ;
            digit_arr   = sign < 0  ?  [ '-' ]  :  [];
            
            for (var i = precision; 
                 i--  &&  rest >= rest_end;
                )
            {
                powershift--;
                var digit_int = (rest / Math.pow( base_radix, powershift )) | 0;
                if (!(0 <= digit_int  &&  digit_int < base_radix))
                    null.bug;
                
                var digit_str = base_digit_arr[ digit_int ];

                digit_arr.push( digit_str );
                rest -= digit_int * Math.pow( base_radix, powershift )
            }
            
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
            

            // Also the exponent `powershift` is converted to the desired base

            var powershift_sign = powershift < 0  ?  -1  :  +1
            ,   powershift_rest = Math.abs( powershift )
            ;
            exp_arr = powershift_sign < 0  ?  [ '-' ]  :  [];
            
            if (powershift_rest !== 0)
            {
                var powershift_powershift = 1 + Math.floor( Math.log( powershift_rest ) / Math.log( base_radix ));
                while( powershift_powershift-- )
                {
                    var        tmp_value      = Math.pow( base_radix, powershift_powershift )
                    ,     exponent_digit_int  = (powershift_rest / tmp_value) | 0
                    ,     exponent_digit_str  = base_digit_arr[ exponent_digit_int ]
                    ;
                    exp_arr.push( exponent_digit_str );
                    powershift_rest -= exponent_digit_int * tmp_value;
                }
            }
            
        }
        else
        {
            // Unbalanced base

            var  precision = 1 + Math.round( Math.log( _2_POW_BIN_PREC ) / Math.log( base_radix ) );
         
            var    rest     = v
            ,      rest_end = Math.abs( rest ) / _2_POW_BIN_PREC / 2  // Not using >> because it would automatically switch to the 32-bit JS integer representation
        
            ,    fl_ex = Math.floor( exp2 )
            ,    powershift = 1 + fl_ex + (exp2 > fl_ex + Math.log( base_radix * 0.5 ) / Math.log( base_radix ) + 1e-10)
            ,   digit_arr   = []
            ;
            
            for (var i = precision; 
                 i--  &&  Math.abs( rest ) >= rest_end;
                )
            {
                powershift--;
                
                var tmp_value = Math.pow( base_radix, powershift );
                
                var rest_sign = rest < 0  ?  -1  :  +1
                ,   rest_abs = Math.abs( rest )
                
                ,  digit_int = tmp_value > rest_abs  &&  rest_abs > tmp_value / base_radix * (1 - 1e-10) 
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
                
                var digit_str = (digit_sign < 0  ?  '_'  :  '') + digit_ustr;

                digit_arr.push( digit_str );
                rest -= digit_int * tmp_value;
            }
      
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


            // Also the exponent `powershift` is converted to the desired base

            var powershift_rest = powershift
            ,   exp_arr = []
            ;
            
            if (powershift_rest !== 0)
            {
                var powershift_exp2 = Math.log( Math.abs( powershift_rest ) ) / Math.log( base_radix )
                ,   powershift_fl_ex = Math.floor( powershift_exp2 )
                ,   powershift_powershift = 1 + powershift_fl_ex + (powershift_exp2 > powershift_fl_ex +  Math.log( base_radix * 0.5 ) / Math.log( base_radix ) + 1e-10)
                ;
                while( powershift_powershift-- )
                {
                    var        tmp_value      = Math.pow( base_radix, powershift_powershift )

                    , p_rest_sign = powershift_rest < 0  ?  -1  :  +1
                    , p_rest_abs  = Math.abs( powershift_rest )

                    ,     exponent_digit_int  = tmp_value > p_rest_abs  &&  p_rest_abs > tmp_value / base_radix * (1 - 1e-10)
                        ?  p_rest_sign
                        :  p_rest_sign * Math.round( p_rest_abs / tmp_value )
                    ;
                    if (!(-base_radix <= exponent_digit_int  &&  exponent_digit_int <= base_radix))
                        null.bug;
                    
                    var e_digit_sign = exponent_digit_int < 0  ?  -1  :  +1
                    ,   e_digit_uint = Math.abs( exponent_digit_int )
                    ,   e_digit_ustr = base_digit_arr[ e_digit_uint ]
                    ;
                    (e_digit_ustr  ||  null).substring.call.a;
                    
                    var e_digit_str = (e_digit_sign < 0  ?  '_'  :  '') + e_digit_ustr;
                    
                    exp_arr.push( e_digit_str );
                    powershift_rest -= exponent_digit_int * tmp_value;
                }
            }

        }

        return base + ':' + digit_arr.join( '' ) + (exp_arr  &&  exp_arr.length  ?  ':' + exp_arr.join( '' )  :  '');
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
    
})();
