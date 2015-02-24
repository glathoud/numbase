numbase
=======

`numbase` is a JavaScript implementation to encode and decode string representations of numbers in any base, including balanced bases:
```
<float value> <=> "<string representation>"
```

Integer examples:
```
123 <=> "2:1111011" (binary)
123 <=> "16:7b"  (hexadecimal)
123 <=> "b3:1_1_1_1_10" (balanced ternary)
```

Real number examples:
```
-123.25 <=> "2:-1111011.01" (binary)
-123.25 <=> "16:-7b.4" (hexadecimal)
-123.25 <=> "b3:_111110_11_11_11_11_11_11_11_11_11_11_11_11_11_11:_100_1" 
(balanced ternary, "_100_1" is the exponent)
```

Inspiration: [Third Base](http://web.williams.edu/Mathematics/sjmiller/public_html/105Sp10/addcomments/Hayes_ThirdBase.htm), a column from Brian Hayes published in the November-December 2001 issue of American Scientist.

## Explanations

For a complete article including more explanations and an interactive area, please open [./index.html](./index.html) ([live version](http://glat.info/numbase/)) with a browser.

## API Usage

Use the underscore `"_"` before a negative digit. For example, a balanced ternary number can be written in a text editor `"_101_1"` which corresponds to the decimal value:
```
-1*(3*3*3) + 0*(3*3) + 1*3 -1*1 = -25
```

 * `numbase.parseInt( <intString>, <base> )`

converts an integer of any base to a decimal value, for example:
```
var decimal_value = numbase.parseInt( "_101_1", "b3" );
// -25
```

 * `numbase.parse( <fullString> )`

converts a float of any base to a decimal value. `<fullString>` contains three parts, separated by column: (1) the base, (2) integer and/or fractional part(s) and (3) an optional exponent. For example the string:
```
"b3:_10.1_1"
```
represents in balanced ternary base a float with decimal value:
```
-1*3 + 0*1 + 1/3 - 1/(3*3) = -2.7777777777777777
```

Let us now append an exponent `110`:
```
"b3:_10.1_1:1_10"
```
This has the effect of multiplying by the decimal value:
```
3^(1*(3*3) - 1*3 + 0) = 3^6 = 729
```
so that we should obtain the decimal value:
```
-2.7777777777777777 * 729 = -2025
```

Let us check:
```
var decimal_value_2 = numbase.parse( "b3:_10.1_1:1_10" );
// -2025
```

 * `numbase.str( <float>, <base> )`
converts a JavaScript float value to a string in the given base. Example:
```
var balanced_ternary_string = numbase.str( -25, "b3" );
// "b3:_101_1"
```
