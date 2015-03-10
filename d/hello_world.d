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


