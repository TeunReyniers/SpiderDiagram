var electronInstaller = require('electron-winstaller')

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: '/build',
    outputDirectory: '/dist/win-installer',
    authors: 'Teun Reyniers',
    exe: 'SpiderDiagramInstaller.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));