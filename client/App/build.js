({
    name: "main",
    
    baseUrl: "./",
    //"inlineText": true,
    findNestedDependencies: true,
    
    paths: {
        "requireLib": "durandal/amd/almond-custom",

        "text": "durandal/amd/text",
        'jquery': 'libs/jquery-1.9.1',
        'ko': 'libs/knockout-2.2.1',
        'bootstrap': 'libs/bootstrap'
    },
    
    include: [
        "requireLib",
        'text',
        "jquery",
        "ko",
        'bootstrap',
        
        // viewmodels
        "viewmodels/shell",
        //// views
        "text!views/shell.html"
    ],
    
    out: "tapyou-latest.js",
    "pragmas": {
        "build": true
    },
    wrap: true,
    insertRequire: [
      "main"
    ]
})