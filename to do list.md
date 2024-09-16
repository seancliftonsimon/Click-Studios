TO DOs NOW:

Fix the set buildling, scouting, and look department sso they are consistent

THEN - make it so that spending inspiration actually reduces it -creating a vuex action and connecting it
THEN - Make workers cost money actively
Show active draw in budget panel/card
make workers stop when money is 0
make the upgrades work one a ta time.

Add in basic worker hiring functionality:

    Card with hire worker button
    Add unassigned/total workers indicator
    Add cost per second indicator
    add logic so that adding a worker adds to a variable being tracked...
        which affects cost per second indicator
        and affects the worker total and unassigned worker count.
    XYZ - LATER Add logic for stopping worker progress when money is 0

Complete pitching cycle
Confirm each of the four investor process cards pull values from the correct ranges
If feasible — unilaterally change the dollarCount variable to writingDollarCount, then create a specific preproDollarCount variable\*
Map the preproDollarAmount variable to the preproDollarCounter

UPDATE DEPARTMENT BARSTACKS

    Make click button say how much it increments [ + 1]
    Add in section with minus button, emoji and number, and plus button
    // Hey stud this is where you left off in the process last time - I say try to get the next several steps implemented as well as you can in the casting example before copying and pasting across so you don't have to go back and change as much. you already have the logic for updating every second, you just need to make sure that it is connected to the employee system correctly


    add logic for checking if there is an unassigned worker, assigning it and removing it from unassigned
    Connect +/- buttons to the assigning functionality
    Set progress per second to a value connected to the number of workers assigned x the efficiency of workers
    When an item gets completed, add an inspiration point
    make the inspiration points show up in the counter

- make inspiration points get added when something is completed - and you get 3 inspiration points whenever you clear a department - maybe show that under dollar amount in that counter

Update the pitch upgrade panel one at a time

Set up PitchingUpgrade card with the initial basics of:
Assign Worker > Searching
Assign Worker > Pitching\*\*
Searches per click ++ [ 2 inspiration ]
Pitches per click ++ [ 2 inspiration ]
Worker search speed ++ [ 5 inspiration ]
Worker pitch speed ++ [ 5 inspiration ]
Shorter Searches ++ [ 10 inspiration ]
Bigger Investors ++ [ 10 inspiration ]
Better Pitches ++ [ 10 inspiration ](increases the odds of a high final payout)
Automatically Pitch Found Investors [ 20 inspiration ]
Automatically Collect Investor Funds [ 20 inspiration ]
Automatically Search for New Investors [ 20 inspiration ]
LATER: Add capability for searchesPerSecond and pitchesPerSecond to actively increment those bars relative to the amount of workers assigned to those two roles

A few thoughts w/r/t Inspiration

For animation - could the progress bar emit a signal with its current location value and then the preproduction component would use it to dynamically set a CSS animation for the icon?

For balancing and payment:

Unless I add other ways to get inspired, right now there's a known total of inspiration you'll get by the end of the preproduction phase! Following the rules I'm starting with initially, every individual preproduction resource will generate one inspiration when it is completed, and each department of preproduction (such as costume dept) will grant 3 inspiration when fully complete. So there will always be 6\*3 (18) inpsiration plus the sum of the minimum values of the resources randomization ranges as a baseline.

i can set that to anything I want right now, and can either have the inspiration prices scale up for bigger projects, or simply make bigger projects more rewarding.

When I was just pulling numbers out of my ass, I set prices of 2, 5, and 10 inspiration. I should consider instead the full cost of each upgrade being upgraded to max.

like

Searches per click ++ [ 2 inspiration ]

this should be something the player can upgrade 4 or 5 times, perhaps for an effect of
x2, x4, x30, x120, x1K

If it starts at 1 inspiration, the next should be 2, then 4, then 6, then 8, for a total of 21.

To keep things very simple right now. I'll do a similar pricing scale for the other effects I'm interested in,

There are three permanent upgrades that should be the costliest items in the store, at the start. Right now I've set them at 20, but I'll consider reducing it if that balances it better. So it's 21x7 for the full upgrade path of the seven steppable upgrades, plus 3x20 for the permanent upgrades. That's a total of 207.

now that 3+ inspiration boost for finishing a whole category is looking rather paltry. If we bump that to 5, then it's 30 points and that's mroe helpful

right now, minimum roles and shots and locations and sets total to 12. plus an amount of costumes and looks that will be no lower than 2, but will have an average value of 2.66, if that makes sense.

So i think i need to bump the minimums up a lot here, but that's not gonna get us to 207. What if you get 3

Okay lets say I make completing a department worth 10 inspiration - that's 60 inspiration right there,

then 207-60 is 147, which divided by 6 is 24.5 needed on average per category.

hold on - if i let the cost of the perma-upgrades fall to 10 each, then the amount needed is not 207, but rather 177!

177-60 = 117, which divided by 6 is 19.5 on average.

I'd like the roles minimum to be 3, the shot minimum to be 20, the location minimum to be 20, the set minimum to be 20, plus the costumes min 3 and the looks min 3.

that's 11.5 on average, so I'll just make each thing give you 2 inspiration when completed and MAAAYBE we're okay.

So the first draft here will be:

Completing any resource will earn you 2 inspiration points.
Completing a full department will earn you 10 inspiration points.

The upgrade component will have 7 upgrades with paths, and three permanent upgrades.

The 7 upgrades will all have rising prices of
[1] [2] [4] [6] [8]

hold on though... some of these should start mroe expensive, but have fewer upgrades. the cost of these could be kept equivalent to 21, but use:
[3] [7] [10]

Similarly, I could adjust a 2-stage upgrade, which evens out with the other changes to still maintain a similar amount.

[8] [14]

This would be good for improving the worker speeds

Searches per click ++ [1]
Pitches per click ++ [1]

Worker search speed ++ [3]
Worker pitch speed ++ [3]

Shorter Searches ++ [8]
Bigger Investors ++ [8]
Better Pitches ++ [8] (increases the odds of a high final payout)

The permanent upgrades will be:
Automatically Pitch Found Investors [10]
Automatically Collect Investor Funds [10]
Automatically Search for New Investors [10]

This is a great start - i may change all the numbers later, but I like the concept of the sections all having shared starting prices that escalate.
