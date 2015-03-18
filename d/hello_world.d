// -*- coding: utf-8 -*-  (for emacs)

import std.algorithm;  // sort   sort!
import std.conv;    // to!
import std.math;
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

    // ------- inputs -------

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


