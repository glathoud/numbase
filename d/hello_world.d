// -*- coding: utf-8 -*-  (for emacs)

import core.thread;
import std.algorithm;  // sort   sort!
import std.conv;    // to!
import std.math;
import std.range;
import std.stdio;
import std.string;  // chomp
import std.uni;

void main()
{
  writeln( "Hello world!" );

  print_type_info_int( int.init );
  writeln();
  writeln( "size_t.stringof : ", size_t.stringof );
  writeln();
  
  TInfo!( int ).print();
  TInfo!( uint ).print();
  TInfo!( long ).print();
  TInfo!( ulong ).print();

  TInfoNormal!( float ).print();
  TInfoNormal!( double ).print();
  TInfoNormal!( idouble ).print();
  TInfoNormal!( cdouble ).print();


  // http://ddili.org/ders/d.en/arithmetic.html

  // ubyte ub = to!ubyte(29999.0f); // Conversion positive overflow

    uint number_1 = 10;
    uint number_2 = 20;

    writeln("PROBLEM! uint cannot have negative values:");
    writeln(number_1 - number_2);
    writeln(number_2 - number_1);
    

    writeln( 7 / 2 );
    writeln( 7f / 2 );
    writeln( 7.0 / 2 );

    int nnn = 2;
    nnn ^^= 6;  // elevate to the 6th power
    writeln( "nnn ", nnn );  // now equal to 2^^6 == 64
    


    int iii = 3;
    writeln( "iii ", iii );


    // Shadowing forbidden in D
    // {
    //   int iii = 4;
    //   writeln( "iii in block scope ", iii );
    // }
    
    // http://ddili.org/ders/d.en/floating_point.html

    double zero = 0;
    double infinity = double.infinity;

    writeln("any expression with nan: ", double.nan + 1);
    writeln("zero / zero            : ", zero / zero);
    writeln("zero * infinity        : ", zero * infinity);
    writeln("infinity / infinity    : ", infinity / infinity);
    writeln("infinity - infinity    : ", infinity - infinity);

    writeln("nan == nan ", double.nan == double.nan);
    writeln("nan != nan ", double.nan != double.nan);
    writeln("nan <>= nan ", double.nan <>= double.nan);

    writeln("isNaN(double.nan): ", isNaN(double.nan));

    // precision

    float  f = 0.1234567899123456789912345678991234567899f;
    double d = 0.1234567899123456789912345678991234567899;

    writeln();
    writeln("Precision");
    writeln(  "input:  0.1234567899123456789912345678991234567899");
    writeln( "output:" );
    writefln( "float:  %.40g", f );
    writefln( "double: %.40g", d );

    // overflow

    writeln();

    real value = real.max;

    writeln("Before         : ", value);

    // Multiplying by 1.1 is the same as adding 10%
    value *= 1.1;
    writeln("Added 10%      : ", value);


    // http://ddili.org/ders/d.en/arrays.html

    writeln();
    
    int[10] first = 1;
    int[10] second = 2;
    int[] result;

    result = first ~ second;
    writeln(result.length);     // prints 20
    writeln(result);

    result ~= first;
    writeln(result.length);     // prints 30
    writeln(result);

    int[30] fixed30;
    fixed30 = result;

    int[] blah = [1,5,3,2,4];
    sort(blah);
    writeln();
    writeln("sorted");
    writeln(blah);
    reverse( blah );
    writeln( "reversed ", blah );


    blah = [1,5,3,2,4];
    sort!("a > b")( blah );
    writeln();
    writeln( "sorted, decreasing: ", blah );


    // http://ddili.org/ders/d.en/characters.html

    wchar é = 'é';
    writeln();
    writeln( é );

    writeln("Résumé preparation: 10.25€");
    writeln("\x52\&eacute;sum\u00e9 preparation: 10.25\&euro;");

    writeln("Is ğ lowercase? ", isLower('ğ'));
    writeln("Is Ş lowercase? ", isLower('Ş'));

    writeln("Is İ uppercase? ", isUpper('İ'));
    writeln("Is ç uppercase? ", isUpper('ç'));

    writeln("Is z alphanumeric? ",       isAlpha('z'));
    writeln("Is é alphanumeric? ",       isAlpha('é'));
    writeln("Is \&euro; alphanumeric? ", isAlpha('\&euro;'));

    writeln("Is new-line whitespace? ",  isWhite('\n'));
    writeln("Is underline whitespace? ", isWhite('_'));

    writeln("The lowercase of Ğ: ", toLower('Ğ'));
    writeln("The lowercase of İ: ", toLower('İ'));

    writeln("The uppercase of ş: ", toUpper('ş'));
    writeln("The uppercase of ı: ", toUpper('ı'));
    
    // http://ddili.org/ders/d.en/slices.html

    int[7] toto = [0, 1, 2, 3, 4, 5, 6];
    int[]  begin = toto[ 0..4 ];
    int[]    end = toto [4..$];
    
    begin[ 0 ] = 77;
    end[ 0 ]   = 88;
    writeln( "toto ", toto );



    int[12] monthDays =
        [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    int[] leapYear = monthDays.dup;

    ++leapYear[1];   // increments the days in February

    writeln("Non-leap year: ", monthDays);
    writeln("Leap year    : ", leapYear);



   int[3] a = [ 1, 1, 1 ];
    int[3] b = [ 2, 2, 2 ];

    a = b;        // the elements of 'a' become 2
    writeln("a ", a);
    writeln("b ", b);
    writeln("a==b ", a==b);
    writeln("a[0]=33;");
    a[0]=33;
    writeln("a ", a);
    writeln("b ", b);
    writeln("a==b ", a==b);
    

    // capacity

    writeln();

    int[] slice = [ 1, 3, 5, 7, 9, 11, 13, 15 ];
    int[] half = slice[0 .. $ / 2];
    int[] quarter = slice[0 .. $ / 4];

    writeln("slice.capacity: ", slice.capacity, ", remaining: ", slice.capacity - slice.length );
    writeln("half.capacity: ", half.capacity);
    writeln("quarter.capacity: ", quarter.capacity);

    slice ~= 42;      // adding to the longest slice ...
    slice[1] = 0;     // ... and then modifying an element

    writeln("slice.capacity: ", slice.capacity, ", remaining: ", slice.capacity - slice.length );
    writeln("half.capacity: ", half.capacity);
    writeln("quarter.capacity: ", quarter.capacity);

    writeln("q h s");
    writeln(quarter);
    writeln(half);
    writeln(slice);

    writeln( "quarter ~= 123;" );

    quarter ~= 123;

    writeln("slice.capacity: ", slice.capacity, ", remaining: ", slice.capacity - slice.length );
    writeln("half.capacity: ", half.capacity);
    writeln("quarter.capacity: ", quarter.capacity);

    writeln("q h s");
    writeln(quarter);
    writeln(half);
    writeln(slice);

    writeln( "\nquarter[0]=-3;" );
    quarter[0]=-3;

    writeln("slice.capacity: ", slice.capacity, ", remaining: ", slice.capacity - slice.length );
    writeln("half.capacity: ", half.capacity);
    writeln("quarter.capacity: ", quarter.capacity);

    writeln("q h s");
    writeln(quarter);
    writeln(half);
    writeln(slice);

    writeln( "\nhalf[0]=-7;" );
    half[0]=-7;

    writeln("slice.capacity: ", slice.capacity, ", remaining: ", slice.capacity - slice.length );
    writeln("half.capacity: ", half.capacity);
    writeln("quarter.capacity: ", quarter.capacity);

    writeln("q h s");
    writeln(quarter);
    writeln(half);
    writeln(slice);

    // Operations on all elements

    writeln();
    writeln("op on all elements");

    double[] five = [0,1,2,3,4];
    writeln("five (before): ", five);
    five[] /= sum( five );
    writeln("five (after): ", five);

    writeln();
    writeln("op on all elements (T)");

    float[] six = [5,4,3,2,1,0];
    writeln("six (before): ", six);
    six[] /= TArr!(float).sum( six );
    writeln("six (after): ", six);

    
    writeln();

    double[] slice1 = [ 1, 1, 1 ];
    double[] slice2 = [ 2, 2, 2 ];
    double[] slice3 = [ 3, 3, 3 ];

    slice2 = slice1;      // ← slice2 starts providing access
                          //   to the same elements that
                          //   slice1 provides access to

    slice3[] = slice1;    // ← the values of the elements of
                          //   slice3 change

    writeln("slice1 before: ", slice1);
    writeln("slice2 before: ", slice2);
    writeln("slice3 before: ", slice3);

    slice2[0] = 42;       // ← the value of an element that
                          //   it shares with slice1 changes

    slice3[1] = 43;       // ← the value of an element that
                          //   only it provides access to
                          //   changes

    writeln("slice1 after : ", slice1);
    writeln("slice2 after : ", slice2);
    writeln("slice3 after : ", slice3);


    writeln();
    int[2][3][4] arr3d;
    arr3d[0][2][1] = 3;
    ++arr3d[1][0][0];
    writeln( arr3d );


    writeln();

    double[] array_2h = [ 1, 20, 2, 30, 7, 11 ];
    int i_2h = array_2h.length;
    while (i_2h--)
      if (array_2h[ i_2h ] >= 10)
        array_2h[ i_2h ] /= 2;
    
    writeln( array_2h );
    
    // Same with slice

    double[] array2_2h = [ 1, 20, 2, 30, 7, 11 ];    
    double[] array2_slice = array2_2h;
    
    while (array2_slice.length)
      {
        if (array2_slice[0] >= 10)
          array2_slice[ 0 ] /= 2;

        array2_slice = array2_slice[ 1 .. $ ];
      }
    
    writeln( array2_2h );


     char[] sx = "hello".dup;
    sx[0] = 'H';
    writeln(sx);

    string resultx = (sx ~ '.').idup;
    writeln( resultx );

    writeln();
    writeln( "\"Résumé\".length ",  "Résumé".length  );
    writeln( "\"Résumé\"d.length ", "Résumé"d.length );

    dchar[] sd = "Résumé"d.dup;
    sd[ 1 ] = sd[ 5 ] = 'e';
    writeln("AFTER: ", sd);


    // http://ddili.org/ders/d.en/auto_and_typeof.html
    
    writeln();
    writeln("typeof(1.2).stringof: ", typeof(1.2).stringof);  // double

    // http://ddili.org/ders/d.en/ternary.html
    // The types of the selection expressions must match
    // 
    // int count = 12;
    // writeln((count == 12) ? "dozen" : count); // ← compilation ERROR

    // http://ddili.org/ders/d.en/literals.html

    int totoct = octal!576;
    writeln();
    writeln("totoct: ", totoct, ' ', 5*8*8+7*8+6);


    writeln(`c:\nurten`);
    writeln("c:\nurten");
    
  // several chars, as long as it ends with a new line
    writeln();
    writeln(q"MY_DELIMITER
first line
second line
MY_DELIMITER");
    
    auto str = q{int number = 42; ++number;};
    writeln(str);
    // infinite loop
    /*       for (int number = 0; ; ++number) {
        write("\rNumber: ", number);
    }
    */
    /*
   for (int number = 0; ; ++number) {
        write("\rNumber: ", number);
        stdout.flush();
        Thread.sleep(10.msecs);
    }
   // Flushing the output is normally not necessary as it is flushed automatically before getting to the next line e.g. by writeln, or before reading from stdin. 
   */
    

    // http://ddili.org/ders/d.en/formatted_output.html

    writefln( "%1$d (decimal) <=> %1$#x (hexa)", 267 );
    
    // http://ddili.org/ders/d.en/aa.html (1.)

    int[string] aabb = [ "aa":123, "bb":456 ];

    writeln();
    writeln(aabb);

    foreach (string k; aabb.keys)
      aabb.remove(k);
    
    writeln(aabb);

    /*
Another solution is to assign an empty array:

    string[int] emptyAA;
    names = emptyAA;

Since the initial value of an array is an empty array anyway, the following technique would achieve the same result:

    names = names.init;

    */

    // http://ddili.org/ders/d.en/aa.html (2.)

    writeln();
    
    int[][string] grades;

    /*
    grades[ "emre" ] = grades.get( "emre", [] ) ~ 90;
    grades[ "emre" ] = grades.get( "emre", [] ) ~ 85;

     actually D makes even easier, because of the automatic init to an
     empty array when appending:
     */
    
    grades[ "emre" ] ~= 90;
    writeln( grades[ "emre" ] );
    grades[ "emre" ] ~= 85;
    writeln( grades[ "emre" ] );

    writeln( "multigrades", grades );

    // http://ddili.org/ders/d.en/foreach.html

    writeln();

    foreach (gvalue; grades)
      writeln( "value: ", gvalue );

    foreach (gvalue; grades.byValue())
      writeln( "value: ", gvalue );

    foreach (key; grades.byKey())
      writeln( "key: ", key );

    foreach ( key, gvalue; grades )
      writeln( "key: ", key, ", value: ", gvalue );

    writeln();

   foreach (number; 10..15) {
        writeln(number);
    }

    writeln();
    {
      writeln( "    foreach ( c ; \"abcdeéèfgh\" )");
      size_t intic = 0;
      writeln( "typeof(intic).stringof: ", typeof(intic).stringof );
      foreach ( c ; "abcdeéèfgh" )
        writefln( "% 3d.: %s", intic++, c );
    }

    writeln();
    {
      writeln( "    foreach ( c ; stride(\"abcdeéèfgh\",1) )");
      auto intic = 0;
      writeln( "typeof(intic).stringof: ", typeof(intic).stringof );
      foreach ( c ; stride("abcdeéèfgh",1) )
        writefln( "% 3d.: %s", intic++, c );
    }

    writeln();
    {
    double[] numbers = [ 1.2, 3.4, 5.6 ];
    
    writefln( "Before: %s", numbers );
    foreach (number; numbers)
        number *= 2;
    writefln( "After:  %s", numbers );
    }

    writeln();
    {
    double[] numbers = [ 1.2, 3.4, 5.6 ];
    
    writefln( "Before: %s", numbers );
    foreach (ref number; numbers)      // <<< ref
        number *= 2;
    writefln( "After:  %s", numbers );
    }

    writeln();
    {
      auto container = [ 1, 2, 3 ];
      
    foreach_reverse (element; container) {
      writefln("%s ", element);
    }
    }

    // Exercise

    {
      writeln();
      writeln("Reverse mapping");
      
      string[int] names = [ 1 : "one", 7 : "seven", 20 : "twenty" ];
      int[string] values;
      foreach (name,value; names)
        values[ value ] = name;

      writeln( "n2v: ", names );
      writeln( "v2n: ", values );
    }

    // read: nomad.so/2013/08/alternative-function-syntax-in-d/
    
    // http://ddili.org/ders/d.en/enum.html

    {
      enum NaturalConstant : double { pi = 3.14, e = 2.72 }
      enum TemperatureUnit : string { C = "Celsius", F = "Fahrenheit" }

      enum secondsPerDay = 60 * 60 * 24;
      enum totalSeconds  = 31 * secondsPerDay;

      writeln();
      writefln( "secondsPerDay %1$s %1$d,  totalSeconds %2$s %2$d", secondsPerDay, totalSeconds );
      writeln();
      
      enum Suit { spades, hearts, diamonds, clubs }
      
      for (auto suit = Suit.min; suit <= Suit.max; ++suit) {
        writefln("%s: %d", suit, suit);
      }

    }

    // xxx http://nomad.so/2013/07/templates-in-d-explained/
    
    // ------- inputs -------

    // http://ddili.org/ders/d.en/strings.html   (2.)

    writeln();
    write( "Enter a line with two 'e's > " );
    string line_2_e = chomp( readln() );
    auto first_e = indexOf( line_2_e, 'e' );
    auto last_e  = lastIndexOf( line_2_e, 'e' );
    string between_2_e = line_2_e[ first_e .. last_e+1 ];
    writeln( "> Between the two 'e's: ", between_2_e );

    // http://ddili.org/ders/d.en/strings.html   (1.)

    writeln();
    write("firstname (lowercase) > " );
    string firstname = chomp( readln() );
    write("lastname (lowercase) > " );
    string lastname = chomp( readln() );
    
    string fullname = capitalize( firstname ) ~ ' ' ~ capitalize( lastname );
    writeln("> fullname: ", fullname );

    // http://ddili.org/ders/d.en/floating_point.html

    float[ 5 ] f_in_arr;
    for (auto i=f_in_arr.length; i--; )
      {
        readf( " %s", &f_in_arr[ i ] );
      }

    for (auto i=f_in_arr.length; i--; )
        writeln( i, ": 2times:", f_in_arr[ i ]*2, ", a fifth: ", f_in_arr[ i ]/5);

    

    // http://ddili.org/ders/d.en/input.html

    writeln();

    write("How many students are there? ");
    int studentCount;
    readf(" %s", &studentCount);

    write("How many teachers are there? ");
    int teacherCount;
    readf(" %s", &teacherCount);

    writeln("Got it: There are ", studentCount, " students",
            " and ", teacherCount, " teachers.");

    write("Do you like that statement? ");
    bool youlike;
    youlike = read_bool();

    if (youlike)
      writeln( "You like it! (", youlike, ")" );
    else
      writeln( "You don't like it! (", youlike, ")" );

  int number = 3;

    while (number == 3) {
        write("Number? ");
        readf(" %s", &number);
    }
}

double sum( double[] arr )
{
  double sum = 0;
  foreach ( x; arr )
    sum += x;

  return sum;
}

template TArr( T ) {

  T sum( T[] arr )
  {
    T ret = 0;

    foreach( x ; arr )
      ret += x;

    return ret;
  }
}

bool read_bool()
{
  string input;
  while (input.length == 0)
    input = chomp( readln() );
  
  return to!bool( input );
}


void print_type_info_int( int v )  // ...would like to generalize, see below
{
  alias t = typeof( v );

  writeln( "Type  : ", t.stringof );
  writeln( "Bytes : ", t.sizeof );
  stdout.writeln( "Min   : ", t.min );
  writeln( "Max   : ", t.max );
  writeln( "Init  : ", t.init ); 
}

template TInfo( T ) {
  void print()
  {
    writeln( "Type  : ", T.stringof );
    writeln( "Bytes : ", T.sizeof );
    stdout.writeln( "Min   : ", T.min );
    writeln( "Max   : ", T.max );
    writeln( "Init  : ", T.init ); 
    writeln();
  }  
}

template TInfoNormal( T ) {
  void print()
  {
    writeln( "Type  : ", T.stringof );
    writeln( "Bytes : ", T.sizeof );
    stdout.writeln( "Min   : ", T.min_normal );
    writeln( "Max   : ", T.max );
    writeln( "Init  : ", T.init ); 
    writeln( "Digits : ", T.dig );
    writeln();
  }  
}


