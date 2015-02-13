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
                _n_2_digit_arr[ base_n_digit ] = 
                    Array.apply( null, Array( base_n_digit ) ).map( _number_one_digit ).join( '' )
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

        function _number_one_digit( tmp, i )
        {
            return i < 10  ?  '' + i  :  String.fromCharCode( 'a'.charCodeAt( 0 ) + i - 10 );
        }
    }
    

    function numbase_parse( /*string e.g. "b20:-_1_a2_3._45_6_34_a_e:-_242a_a" */s )
    {
        var        mo = /^(?:(b?b\d+):)?([\+\-]?)(\w*)?(?:\.(\w*)?)?(?::(?:([\+\-]?)(\w+)))?$/.exec( s.toLowerCase() )
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

        var sign = v < 0  ?  -1  :  +1
        ,   vabs = Math.abs( v )

        ,   exp2 = Math.log( vabs ) / Math.log( base_radix )
        , precision = Math.log( _2_POW_BIN_PREC ) / Math.log( base_radix )
        ;

        if (!is_balanced)
        {
            
        }
        else
        {
            
        }
             
        return 'xxx ' + vabs + ' ' + exp2 + ' ' + precision
    }

})();
