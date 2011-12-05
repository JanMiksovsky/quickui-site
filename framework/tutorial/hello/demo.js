/*
YOUR GOAL: You should see two buttons called "Hello" and "World" in the Results pane. Edit the JavaScript below to change the labels for these buttons, then press the Update button in the jsFiddle toolbar to view the results. Once you've done that, try creating more buttons by adding more BasicButton.create() calls. Be sure to include commas betwen those calls -- they're all parameters to the $.append() function.

Each page of this tutorial also contains a "Next page" link that leads to the next step of the tutorial. You can find the working Next link in the "Result" pane in the page's lower right quarter (below the buttons you've created).
*/

$( "#demo" ).append(
    ButtonBase.create().content( "Hello" ),
    ButtonBase.create().content( "World" )
);
