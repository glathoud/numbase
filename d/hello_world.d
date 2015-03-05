import std.conv;    // to!
import std.stdio;
import std.string;  // chomp

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
    

    // block

    int iii = 3;
    writeln( "iii ", iii );
    {
      int iii = 4;
      writeln( "iii in block scope ", iii );
    }
    
    

  // http://ddili.org/ders/d.en/input.html

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
    writeln();
  }  
}


