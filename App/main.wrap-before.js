var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onreadystatechange = function () {
    if (this.readyState == 'complete') helper();
}
script.onload = helper;
script.src = 'helper.js';
head.appendChild(script);