% Factions

hello(goodbye).

faction(factionOne).
faction(factionTwo).

ship(factionOne, 'A').
ship(factionTwo, 'B').

% System Types

void(v).

baseSystem(g).
baseSystem(h).

emptySystem(0).
onePlanetSystem(1).
twoPlanetSystem(2).
threePlanetSystem(3).

blackholeSystem(b).
wormholeSystem(w).

redNebulaeSystem(z).
greenNebulaeSystem(x).
blueNebulaeSystem(c).

% Structure Types

colony(o).
colony(p).

tradeStation(l).
tradeStation(k).

% Ownership

owns(factionOne, g).
owns(factionOne, o).
owns(factionOne, l).

owns(factionTwo, h).
owns(factionTwo, p).
owns(factionTwo, k).

% Movement Into System

cantMoveInto(System) :-
    void(System).
cantMoveInto(System) :-
    blackholeSystem(System).
cantMoveInto(System) :-
    wormholeSystem(System).
cantMoveInto(System) :-
    colony(System).
cantMoveInto(System) :-
    tradeStation(System).
cantMoveInto(Ship) :-
    ship(_, Ship).
    
canMoveInto(System) :- \+ cantMoveInto(System).

% Passing Through System

cantPassTrrough(_, System) :-
    void(System).
cantPassThrough(_, System) :-
    blackholeSystem(System).
cantPassThrough(factionOne, System) :-
    owns(factionTwo, System).
cantPassThrough(factionTwo, System) :-
    owns(factionOne, System).
cantPassThrough(Faction, _) :-
    \+ faction(Faction).

canPassThrough(Faction, System) :- \+ cantPassThrough(Faction, System).




