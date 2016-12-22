% Board Drawing

printspacing(0).
printspacing(N) :-
    write('   '),
    N > 0,
    N1 is N-1,
    printspacing(N1).

printboard :-
    nl,
    board(X),
    write(' '),
    printcolindexes(X, 0),
    printboard(X, 0).

printboard(Board) :-
    nl,
    write(' '),
    printcolindexes(Board, 0),
    printboard(Board, 0), !.

printboard([], _).
printboard([X|Ys], N) :-
    write(' '),
    printspacing(N),
    printcelltop(X, N),
    write(N),
    printspacing(N),
    printline(X, N),
    write(' '),
    printspacing(N),
    printcellbot(X, N),
    N1 is N+1,
    printboard(Ys, N1).

printcell([]).
printcell([X|Ys]) :-
    write(X),
    printcell(Ys).

printline([], _) :- nl.
printline([X|Ys], N) :-
    getelem(X, 1, V),
    =(V, v),
    write('  +  '),
    printline(Ys, N).
printline([X|Ys], N) :-
    write('|'),
    printcell(X),
    write('|'),
    printline(Ys, N).

printcelltop([], _) :- nl.
printcelltop([X|Ys], N) :-
    getelem(X, 1, V),
    =(V, v),
    write('     '),
    printcelltop(Ys, N).
printcelltop([_|Ys], N) :-
    write('/  \\ '),
    printcelltop(Ys, N).

printcellbot([], _) :- nl.
printcellbot([X|Ys], N) :-
    getelem(X, 1, V),
    =(V, v),
    write('     '),
    printcellbot(Ys, N).
printcellbot([_|Ys], N) :-
    write('\\   /'),
    printcellbot(Ys, N).

getelem([X|_], 0, Value) :-
    Value = X.
getelem([_|Ys], Index, Value) :-
    Index > 0,
    Index1 is Index-1,
    getelem(Ys, Index1, Value).
    
printcolindexes([], _) :- nl.
printcolindexes([_|Ys], N) :-
    write('  '),
    write(N),
    write('  '),
    N1 is N+1,
    printcolindexes(Ys, N1).

cls :- write('\33[H\33\[2J'). %write('\e[H\e[2J').

displayPlayingMessage(factionOne, 0) :-
    write('###############################\n'),
    write('#    Player One Playing...    #\n'),
    write('###############################\n').
displayPlayingMessage(factionOne, 1) :-
    write('###############################\n'),
    write('#    Player One Playing...    #\n'),
    write('###############################\n').
displayPlayingMessage(factionOne, 2) :-
    write('###############################\n'),
    write('#    Easy AI One Playing...   #\n'),
    write('###############################\n').
displayPlayingMessage(factionOne, 3) :-
    write('###############################\n'),
    write('#    Hard AI One Playing...   #\n'),
    write('###############################\n').
displayPlayingMessage(factionOne, 4) :-
    write('##############################\n'),
    write('#    Player One Playing...   #\n'),
    write('##############################\n').
displayPlayingMessage(factionTwo, 0) :-
    write('##############################\n'),
    write('#    Player Two Playing...   #\n'),
    write('##############################\n').
displayPlayingMessage(factionTwo, 1) :-
    write('###############################\n'),
    write('#    Easy AI Two Playing...   #\n'),
    write('###############################\n').
displayPlayingMessage(factionTwo, 2) :-
    write('###############################\n'),
    write('#    Easy AI Two Playing...   #\n'),
    write('###############################\n').
displayPlayingMessage(factionTwo, 3) :-
    write('###############################\n'),
    write('#    Hard AI Two Playing...   #\n'),
    write('###############################\n').
displayPlayingMessage(factionTwo, 4) :-
    write('###############################\n'),
    write('#    Hard AI Two Playing...   #\n'),
    write('###############################\n').

showMenu :-
    !,
    cls,
    writebanner,
    write('#########################\n'),
    write('#                       #\n'),
    write('#  Pick game mode:      #\n'),
    write('#                       #\n'),
    write('#  1.Player vs Player   #\n'),          
    write('#  2.Player vs Easy AI  #\n'),
    write('#  3.Easy AI vs Easy AI #\n'),
    write('#  4.Hard AI vs Hard AI #\n'),
    write('#  5.Player vs Hard AI  #\n'),
    write('#  6.Quit               #\n'),
    write('#                       #\n'),
    write('#########################\n'), nl,
    write('Your option: '),
    read(Mode),
    processMenuInput(Mode),!.

showHelp :-
    write('\n#######################################################################################################################\n'),
    write('#             * Colony * TradeStation * Ship # OnePlanet * TwoPlanets * ThreePlanets * Blackhole * Wormhole * Nebulae #\n'),
    write('# Player One  *    o   *       p      *   A  #     1     *     2      *      3       *     b     *     w    *    z    #\n'),
    write('# Player Two  *    l   *       k      *   B  #           *            *              *           *          *         #\n'),   
    write('#######################################################################################################################\n\n'). 

processMenuInput(Mode) :-
    Mode > 0,
    Mode < 6,
    NMode is Mode-1,
    board(Board),
    play(0, Board, NMode),!.
processMenuInput(_) :- abort.

writebanner :-
    write("   _____                 _ _    _____ _               ______                 _               \n"),
    write("  / ____|               | | |  / ____| |             |  ____|               (_)              \n"),
    write(" | (___  _ __ ___   __ _| | | | (___ | |_ __ _ _ __  | |__   _ __ ___  _ __  _ _ __ ___  ___ \n"),
    write("  \\___ \\| '_ ` _ \\ / _` | | |  \\___ \\| __/ _` | '__| |  __| | '_ ` _ \\| '_ \\| | '__/ _ \\/ __|\n"),
    write("  ____) | | | | | | (_| | | |  ____) | || (_| | |    | |____| | | | | | |_) | | | |  __/\\__ \\\n"),
    write(" |_____/|_| |_| |_|\\__,_|_|_| |_____/ \\__\\__,_|_|    |______|_| |_| |_| .__/|_|_|  \\___||___/\n"),
    write("                                                                      | |                    \n"),
    write("                                                                      |_|                    \n").
    







begin :- showMenu.
