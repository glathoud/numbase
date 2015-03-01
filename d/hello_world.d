import std.stdio;

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

// xxx http://ddili.org/ders/d.en/input.html

    write("How many students are there? ");
    int studentCount;
    readf(" %s", &studentCount);

    write("How many teachers are there? ");
    int teacherCount;
    readf(" %s", &teacherCount);

    writeln("Got it: There are ", studentCount, " students",
            " and ", teacherCount, " teachers.");

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


