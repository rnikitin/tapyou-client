{
  "name": "durandal/amd/almond-custom",
  "inlineText": true,
  "stubModules": [
    "durandal/amd/text"
  ],
  "paths": {
    "text": "durandal/amd/text"
  },
  "baseUrl": "C:\\dev\\ePythia\\Deliverator.TFS\\Deliverator Web\\Src\\Trunk\\CompasPlus.Web.Site\\App",
  "mainConfigFile": "C:\\dev\\ePythia\\Deliverator.TFS\\Deliverator Web\\Src\\Trunk\\CompasPlus.Web.Site\\App\\main.js",
  "include": [
    "main-built",
    "main",
    "main.min",
    "durandal/app",
    "durandal/composition",
    "durandal/events",
    "durandal/http",
    "text!durandal/messageBox.html",
    "durandal/messageBox",
    "durandal/modalDialog",
    "durandal/system",
    "durandal/viewEngine",
    "durandal/viewLocator",
    "durandal/viewModel",
    "durandal/viewModelBinder",
    "durandal/widget",
    "durandal/plugins/router",
    "durandal/transitions/entrance",
    "durandal/widgets/personDetails/controller",
    "durandal/widgets/personDetails/controller.min",
    "text!durandal/widgets/personDetails/view.html",
    "durandal/widgets/taskDetails/controller",
    "durandal/widgets/taskDetails/controller.min",
    "text!durandal/widgets/taskDetails/view.html",
    "durandal/widgets/tasksTable/controller",
    "durandal/widgets/tasksTable/controller.min",
    "text!durandal/widgets/tasksTable/view.html",
    "tasks/backend/currentUser",
    "tasks/backend/currentUser.min",
    "tasks/backend/dal",
    "tasks/backend/dal.min",
    "tasks/backend/signalR",
    "tasks/backend/signalR.min",
    "tasks/models/events",
    "tasks/models/events.min",
    "tasks/models/geo",
    "tasks/models/geo.min",
    "tasks/models/tasks",
    "tasks/models/tasks.min",
    "tasks/viewmodels/chat",
    "tasks/viewmodels/chat.min",
    "tasks/viewmodels/globalMap",
    "tasks/viewmodels/globalMap.min",
    "tasks/viewmodels/page",
    "tasks/viewmodels/page.min",
    "tasks/viewmodels/personsList",
    "tasks/viewmodels/personsList.min",
    "tasks/viewmodels/tasksPanel",
    "tasks/viewmodels/tasksPanel.min",
    "tasks/viewmodels/tasksTabCompleted",
    "tasks/viewmodels/tasksTabCompleted.min",
    "tasks/viewmodels/tasksTabCurrent",
    "tasks/viewmodels/tasksTabCurrent.min",
    "tasks/viewmodels/tasksTabNew",
    "tasks/viewmodels/tasksTabNew.min",
    "text!tasks/views/chat.html",
    "text!tasks/views/globalMap.html",
    "text!tasks/views/page.html",
    "text!tasks/views/personsList.html",
    "text!tasks/views/tasksPanel.html",
    "text!tasks/views/tasksTabCompleted.html",
    "text!tasks/views/tasksTabCurrent.html",
    "text!tasks/views/tasksTabNew.html"
  ],
  "exclude": [],
  "keepBuildDir": true,
  "optimize": "uglify2",
  "out": "C:\\dev\\ePythia\\Deliverator.TFS\\Deliverator Web\\Src\\Trunk\\CompasPlus.Web.Site\\App\\main-built.js",
  "pragmas": {
    "build": true
  },
  "wrap": true,
  "insertRequire": [
    "main"
  ]
}