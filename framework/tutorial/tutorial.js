//
// CodeEditor
//
CodeEditor = Control.subclass({
    name: "CodeEditor",
    content: [
        " ",
        {
            control: "BasicButton",
            content: "Hello"
        },
        " "
    ]
});

//
// TutorialPage
//
TutorialPage = SitePage.subclass({
    name: "TutorialPage",
    content: [
        " Hello ",
        {
            control: "CodeEditor"
        },
        " "
    ]
});

