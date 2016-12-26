readPlayerInput(X1, Z1, X2, Z2, Structure) :-
    write('# Select source coordinates [X, Z] # '),
    read(Source),
    nth0(0, Source, X1),
    nth0(1, Source, Z1),
    write('# Select destination coordinates [X, Z] # '),
    read(Destination),
    nth0(0, Destination, X2),
    nth0(1, Destination, Z2),    
    write('# Select the type of structure to place (\'colony\' or \'trade station\' or \'exit\' to leave game) # '),
    read(Structure).

validatePlayerInput(_,_,_,_,_,_,'exit') :-
    showMenu,!.
validatePlayerInput(_, Board, X1, Z1, X2, Z2, Structure) :-
    getBoardSize(Board, Size),
    X1 < Size,
    Z1 < Size,
    X2 < Size,
    Z2 < Size,
    (Structure == 'colony'; Structure == 'trade station').

processPlayerInput(Faction, Board, X1, Z1, X2, Z2, Structure) :-
    repeat,
    readPlayerInput(X1, Z1, X2, Z2, Structure),
    validatePlayerInput(Faction, Board, X1, Z1, X2, Z2, Structure).

playerMove(0, Board, NewBoard, Mode) :- playFactionOne(Board, NewBoard, Mode).
playerMove(1, Board, NewBoard, Mode) :- playFactionTwo(Board, NewBoard, Mode).

playFactionOne(Board, NewBoard, Mode) :-
    (Mode == 0 ; Mode == 1; Mode == 4),
    repeat,
    cls,
    displayPlayingMessage(factionOne, Mode),
    printboard(Board),
    showHelp,
    readPlayerInput(X1, Z1, X2, Z2, Structure),
    validatePlayerInput(factionOne, Board, X1, Z1, X2, Z2, Structure),
    moveShip(factionOne, Board, X1, Z1, X2, Z2, TempBoard),
    placeStructure(factionOne, TempBoard, Structure, X2, Z2, NewBoard),!.
playFactionOne(Board, NewBoard, 2) :-
    repeat,
    cls,
    displayPlayingMessage(factionOne, 2),
    getAllPossibleBoards(factionOne, Board, 0, 0, [], PossibleBoards),
    length(PossibleBoards, Length),
    random(0, Length, BoardNumber),
    nth0(BoardNumber, PossibleBoards, NewBoard),
    printboard(NewBoard),!.
playFactionOne(Board, NewBoard, 3) :-
    cls,
    displayPlayingMessage(factionOne, 3),
    getBestBoard(factionOne, Board, NewBoard),
    printboard(NewBoard),!.
playFactionTwo(Board, NewBoard, 0) :-
    repeat,
    cls,
    displayPlayingMessage(factionTwo, 0),
    printboard(Board),
    showHelp,
    readPlayerInput(X1, Z1, X2, Z2, Structure),
    validatePlayerInput(factionTwo, Board, X1, Z1, X2, Z2, Structure),
    moveShip(factionTwo, Board, X1, Z1, X2, Z2, TempBoard),
    placeStructure(factionTwo, TempBoard, Structure, X2, Z2, NewBoard),!.
playFactionTwo(Board, NewBoard, Mode) :-
    (Mode == 1 ; Mode == 2),
    repeat,
    cls,
    displayPlayingMessage(factionTwo, Mode),
    getAllPossibleBoards(factionTwo, Board, 0, 0, [], PossibleBoards),
    length(PossibleBoards, Length),
    random(0, Length, BoardNumber),
    nth0(BoardNumber, PossibleBoards, NewBoard),
    printboard(NewBoard),!.
playFactionTwo(Board, NewBoard, Mode) :-
    (Mode == 3 ; Mode == 4),
    cls,
    displayPlayingMessage(factionTwo, Mode),
    getBestBoard(factionTwo, Board, NewBoard),
    printboard(NewBoard),!.

isGameOver(Board) :-
    getAllPossibleBoards(factionOne, Board, 0, 0, [], FactionOne),
    length(FactionOne, FactionOneBoards),
    FactionOneBoards==0,!.
isGameOver(Board) :-
    getAllPossibleBoards(factionTwo, Board, 0, 0, [], FactionTwo),
    length(FactionTwo, FactionTwoBoards),
    FactionTwoBoards==0,!.

hasTheGameEnded(Board, HasIt) :-
	getAllPossibleBoards(factionOne, Board, 0, 0, [], FactionOne),
	length(FactionOne, FactionOneBoards),
	FactionOneBoards == 0,
	HasIt is 1,!.
hasTheGameEnded(Board, HasIt) :-
    getAllPossibleBoards(factionTwo, Board, 0, 0, [], FactionTwo),
    length(FactionTwo, FactionTwoBoards),
    FactionTwoBoards==0,
	Hasit is 1,!.
hasTheGameEnded(_, 0).

printWinner(Points, Points) :-
    write('Faction One: '), write(Points), write(' Points\n'),
    write('Faction Two: '), write(Points), write(' Points\n'),
    write('\nIt\'s a tie.\n').
printWinner(Points1, Points2) :-
    Points1 > Points2,
    write('Faction One: '), write(Points1), write(' Points\n'),
    write('Faction Two: '), write(Points2), write(' Points\n'),
    write('\nFaction One Won!\n').
printWinner(Points1, Points2) :-
    Points1 < Points2,
    write('Faction Two: '), write(Points2), write(' Points\n'),
    write('Faction One: '), write(Points1), write(' Points\n'),
    write('\nFaction Two Won!\n').
findWinner(Board) :-
    calculateTotalPoints(factionOne, Board, FactionOnePoints),
    calculateTotalPoints(factionTwo, Board, FactionTwoPoints),
    printWinner(FactionOnePoints, FactionTwoPoints).

play(_, Board, _) :-
    isGameOver(Board),
    cls,
    write('###############################\n'),
    write('#        Game is over!        #\n'),
    write('###############################\n\n'),
    printboard(Board),
    findWinner(Board),
    write('Write anything to go back to the menu: '),
    read(_),
    showMenu.
play(Turn, Board, Mode) :-
    Faction is Turn mod 2,
    playerMove(Faction, Board, NewBoard, Mode),
    NTurn is Turn+1,
    play(NTurn, NewBoard, Mode).

calculatePlanetarySystemPoints(Faction, Board, Points) :-
    calculatePlanetarySystemPoints(Faction, Board, 0, 0, 0, Points),!.
calculatePlanetarySystemPoints(_, Board, X, Z, CurrentPoints, CurrentPoints) :-
    getBoardSize(Board, Size),
    X == Size,
    Z == Size.
calculatePlanetarySystemPoints(Faction, Board, X, Z, CurrentPoints, Points) :-
    getBoardSize(Board, Size),
    X == Size,
    NX is 0,
    NZ is Z+1,
    calculatePlanetarySystemPoints(Faction, Board, NX, NZ, CurrentPoints, Points).
calculatePlanetarySystemPoints(Faction, Board, X, Z, CurrentPoints, Points) :-
    getBoardSize(Board, Size),
    X < Size,
    getStructureLayer(X, Z, Board, Structure),
    owns(Owner, Structure),
    Owner == Faction,
    getMapLayer(X, Z, Board, System),
    onePlanetSystem(System),
    NCurrentPoints is CurrentPoints+1,
    NX is X+1,
    calculatePlanetarySystemPoints(Faction, Board, NX, Z, NCurrentPoints, Points).
calculatePlanetarySystemPoints(Faction, Board, X, Z, CurrentPoints, Points) :-
    getBoardSize(Board, Size),
    X < Size,
    getStructureLayer(X, Z, Board, Structure),
    owns(Owner, Structure),
    Owner == Faction,
    getMapLayer(X, Z, Board, System),
    twoPlanetSystem(System),
    NCurrentPoints is CurrentPoints+2,
    NX is X+1,
    calculatePlanetarySystemPoints(Faction, Board, NX, Z, NCurrentPoints, Points).
calculatePlanetarySystemPoints(Faction, Board, X, Z, CurrentPoints, Points) :-
    getBoardSize(Board, Size),
    X < Size,
    getStructureLayer(X, Z, Board, Structure),
    owns(Owner, Structure),
    Owner == Faction,
    getMapLayer(X, Z, Board, System),
    threePlanetSystem(System),
    NCurrentPoints is CurrentPoints+3,
    NX is X+1,
    calculatePlanetarySystemPoints(Faction, Board, NX, Z, NCurrentPoints, Points). 
calculatePlanetarySystemPoints(Faction, Board, X, Z, CurrentPoints, Points) :-
    getBoardSize(Board, Size),
    X < Size,
    NX is X+1,
    calculatePlanetarySystemPoints(Faction, Board, NX, Z, CurrentPoints, Points).

hasEnemyStructure(Faction, Board, X, Z, Result) :-
    getStructureLayer(X, Z, Board, Structure),
    (colony(Structure) ; tradeStation(Structure)),
    \+ owns(Faction, Structure),
    Result is 1,!.
hasEnemyStructure(Faction, Board, X, Z, Result) :-
    getMapLayer(X, Z, Board, System),
    baseSystem(System),
    \+ owns(Faction, System),
    Result is 1,!.
hasEnemyStructure(_,_,_,_, Result) :-
    Result is 0,!.

hasEnemyStructureLeft(_, _, 0, _, Result) :-
    Result is 0,!.
hasEnemyStructureLeft(Faction, Board, X, Z, Result) :-
    X > 0,
    X1 is X-1,
    hasEnemyStructure(Faction, Board, X1, Z, Result),!.

hasEnemyStructureRight(_, Board, X, _, Result) :-
    getBoardSize(Board, Size),
    NSize is Size-1,
    X == NSize,
    Result is 0,!.
hasEnemyStructureRight(Faction, Board, X, Z, Result) :-
    getBoardSize(Board, Size),
    NSize is Size-1,
    X < NSize,
    X1 is X+1,
    hasEnemyStructure(Faction, Board, X1, Z, Result),!.

hasEnemyStructureTop(_, _, _, 0, Result) :-
    Result is 0,!.
hasEnemyStructureTop(Faction, Board, X, Z, Result) :-
    Z > 0,
    Z1 is Z-1,
    hasEnemyStructure(Faction, Board, X, Z1, Result),!.

hasEnemyStructureBottom(_, Board, _, Z, Result) :-
    getBoardSize(Board, Size),
    NSize is Size-1,
    Z == NSize,
    Result is 0,!.
hasEnemyStructureBottom(Faction, Board, X, Z, Result) :-
    getBoardSize(Board, Size),
    NSize is Size-1,
    Z < NSize,
    Z1 is Z+1,
    hasEnemyStructure(Faction, Board, X, Z1, Result),!.

hasEnemyStructureBottomLeft(_, _, 0, _, Result) :-
    Result is 0,!.
hasEnemyStructureBottomLeft(_, Board, _, Z, Result) :-
    getBoardSize(Board, Size),
    NSize is Size-1,
    Z == NSize,
    Result is 0,!.
hasEnemyStructureBottomLeft(Faction, Board, X, Z, Result) :-
    X > 0,
    getBoardSize(Board, Size),
    NSize is Size-1,
    Z < NSize,
    X1 is X-1,
    Z1 is Z+1,
    hasEnemyStructure(Faction, Board, X1, Z1, Result),!.

hasEnemyStructureTopRight(_, _, _, 0, Result) :-
    Result is  0,!.
hasEnemyStructureTopRight(_, Board, X, _, Result) :-
    getBoardSize(Board, Size),
    NSize is Size-1,
    X == NSize,
    Result is 0,!.
hasEnemyStructureTopRight(Faction, Board, X, Z, Result) :-
    Z > 0,
    getBoardSize(Board, Size),
    NSize is Size-1,
    X < NSize,
    X1 is X+1,
    Z1 is Z-1,
    hasEnemyStructure(Faction, Board, X1, Z1, Result),!.
    
countAdjacentEnemyStructures(Faction, Board, X, Z, Result) :-
    Current is 0,
    hasEnemyStructureLeft(Faction, Board, X, Z, Left),
    Current1 is Current+Left,
    hasEnemyStructureRight(Faction, Board, X, Z, Right),
    Current2 is Current1+Right,
    hasEnemyStructureTop(Faction, Board, X, Z, Top),
    Current3 is Current2+Top,
    hasEnemyStructureBottom(Faction, Board, X, Z, Bottom),
    Current4 is Current3+Bottom,
    hasEnemyStructureTopRight(Faction, Board, X, Z, TopRight),
    Current5 is Current4+TopRight,
    hasEnemyStructureBottomLeft(Faction, Board, X, Z, BottomLeft),
    Result is Current5+BottomLeft.

calculateTradeStationPoints(Faction, Board, Points) :-
    calculateTradeStationPoints(Faction, Board, 0, 0, 0, Points),!.
calculateTradeStationPoints(_, Board, X, Z, CurrentPoints, CurrentPoints) :-
    getBoardSize(Board, Size),
    X == Size,
    Z == Size.
calculateTradeStationPoints(Faction, Board, X, Z, CurrentPoints, Points) :-
    getBoardSize(Board, Size),
    X == Size,
    NX is 0,
    NZ is Z+1,
    calculateTradeStationPoints(Faction, Board, NX, NZ, CurrentPoints, Points).
calculateTradeStationPoints(Faction, Board, X, Z, CurrentPoints, Points) :-
    getBoardSize(Board, Size),
    X < Size,
    getStructureLayer(X, Z, Board, Structure),
    tradeStation(Structure),
    owns(Owner, Structure),
    Owner == Faction,
    countAdjacentEnemyStructures(Faction, Board, X, Z, AdjacentPoints),
    NCurrentPoints is CurrentPoints+AdjacentPoints,
    NX is X+1,
    calculateTradeStationPoints(Faction, Board, NX, Z, NCurrentPoints, Points).
calculateTradeStationPoints(Faction, Board, X, Z, CurrentPoints, Points) :-
    getBoardSize(Board, Size),
    X < Size,
    NX is X+1,
    calculateTradeStationPoints(Faction, Board, NX, Z, CurrentPoints, Points).

countNebulae(Faction, Board, Colour, Number) :-
    countNebulae(Faction, Board, 0, 0, Colour, 0, Number), !.
countNebulae(_, Board, X, Z, _, CurrentNumber, CurrentNumber) :-
    getBoardSize(Board, Size),
    X == Size,
    Z == Size.
countNebulae(Faction, Board, X, Z, Colour, CurrentNumber, Number) :-
    getBoardSize(Board, Size),
    X == Size,
    NX is 0,
    NZ is Z+1,
    countNebulae(Faction, Board, NX, NZ, Colour, CurrentNumber, Number).
countNebulae(Faction, Board, X, Z, 'red', CurrentNumber, Number) :-
    getBoardSize(Board, Size),
    X < Size,
    getMapLayer(X, Z, Board, System),
    redNebulaeSystem(System),
    getStructureLayer(X, Z, Board, Structure),
    owns(Owner, Structure),
    Faction == Owner,
    NCurrentNumber is CurrentNumber+1,
    NX is X+1,
    countNebulae(Faction, Board, NX, Z, 'red', NCurrentNumber, Number).
countNebulae(Faction, Board, X, Z, 'green', CurrentNumber, Number) :-
    getBoardSize(Board, Size),
    X < Size,
    getMapLayer(X, Z, Board, System),
    greenNebulaeSystem(System),
    getStructureLayer(X, Z, Board, Structure),
    owns(Owner, Structure),
    Faction == Owner,
    NCurrentNumber is CurrentNumber+1,
    NX is X+1,
    countNebulae(Faction, Board, NX, Z, 'green', NCurrentNumber, Number).
countNebulae(Faction, Board, X, Z, 'blue', CurrentNumber, Number) :-
    getBoardSize(Board, Size),
    X < Size,
    getMapLayer(X, Z, Board, System),
    blueNebulaeSystem(System),
    getStructureLayer(X, Z, Board, Structure),
    owns(Owner, Structure),
    Faction == Owner,
    NCurrentNumber is CurrentNumber+1,
    NX is X+1,
    countNebulae(Faction, Board, NX, Z, 'blue', NCurrentNumber, Number).
countNebulae(Faction, Board, X, Z, Colour, NCurrentNumber, Number) :-
    getBoardSize(Board, Size),
    X < Size,
    NX is X+1,
    countNebulae(Faction, Board, NX, Z, Colour, NCurrentNumber, Number).

nebulaePointsMultiplier(0, Points) :-
    Points is 0.
nebulaePointsMultiplier(1, Points) :-
    Points is 2.
nebulaePointsMultiplier(2, Points) :-
    Points is 5.
nebulaePointsMultiplier(_, Points) :-
    Points is 8.

calculateNebulaePoints(Faction, Board, Points) :-
    countNebulae(Faction, Board, 'red', RedNumber),
    nebulaePointsMultiplier(RedNumber, RedPoints),
    countNebulae(Faction, Board, 'green', GreenNumber),
    nebulaePointsMultiplier(GreenNumber, GreenPoints),
    CurrentTotal is RedPoints + GreenPoints,
    countNebulae(Faction, Board, 'blue', BlueNumber),
    nebulaePointsMultiplier(BlueNumber, BluePoints),
    Points is CurrentTotal + BluePoints,!.
    
calculateTotalPoints(Faction, Board, Points) :-
    calculatePlanetarySystemPoints(Faction, Board, PlanetaryPoints),
    calculateTradeStationPoints(Faction, Board, TradePoints),
    CurrentTotal is PlanetaryPoints+TradePoints,
    calculateNebulaePoints(Faction, Board, NebulaePoints),
    Points is CurrentTotal+NebulaePoints.

getHighestValue(List, Value, Index) :-
    getHighestValue(List, 0, 0, 0, Value, Index),!.
getHighestValue([], HighValue, HighIndex, _, HighValue, HighIndex).
getHighestValue([X|Ys], HighValue, _, CurrentIndex, Value, Index) :-
    X > HighValue,
    NHighValue is X,
    NHighIndex is CurrentIndex,
    NCurrentIndex is CurrentIndex+1,
    getHighestValue(Ys, NHighValue, NHighIndex, NCurrentIndex, Value, Index).
getHighestValue([_|Ys], HighValue, HighIndex, CurrentIndex, Value, Index) :-
    NCurrentIndex is CurrentIndex+1,
    getHighestValue(Ys, HighValue, HighIndex, NCurrentIndex, Value, Index).

getAllPossiblePoints(_, PossibleBoards, Index, Current, Current) :-
    length(PossibleBoards, Length),
    Index == Length,!.
getAllPossiblePoints(Faction, PossibleBoards, Index, [], Points) :-
    nth0(Index, PossibleBoards, CurrentBoard),
    calculateTotalPoints(Faction, CurrentBoard, CurrentPoints),
    NIndex is Index+1,
    getAllPossiblePoints(Faction, PossibleBoards, NIndex, [CurrentPoints], Points).
getAllPossiblePoints(Faction, PossibleBoards, Index, Current, Points) :-
    nth0(Index, PossibleBoards, CurrentBoard),
    calculateTotalPoints(Faction, CurrentBoard, CurrentPoints),
    append(Current, [CurrentPoints], NPoints),
    NIndex is Index+1,
    getAllPossiblePoints(Faction, PossibleBoards, NIndex, NPoints, Points).

getBestBoard(Faction, Board, NewBoard) :-
    getAllPossibleBoards(Faction, Board, 0, 0, [], Result),
    getAllPossiblePoints(Faction, Result, 0, [], Points),
    getHighestValue(Points, _, Index),
    nth0(Index, Result, NewBoard).
