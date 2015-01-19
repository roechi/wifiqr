var ssid;
var password;
var encryption;
var hidden;
var hidePassword;
var totalString;
var qr;
var dotsize = 5;  // size of box drawn on canvas
var padding = 10; // (white area around your QRCode)
var black = "rgb(0,0,0)";
var white = "rgb(255,255,255)";
var QRCodeVersion = 5;

prefillQRForm();

function fetchData() {
    ssid = document.getElementById("ssid").value;
    password = document.getElementById("password").value;
    encryption = document.getElementById("encryption").value;
    hidden = document.getElementById("hidden").checked;
    hidePassword = document.getElementById("hidePassword").checked;
    localStorage.setItem('ssid', ssid);
    //localStorage.setItem('password', password);
    localStorage.setItem('encryption', encryption);
    localStorage.setItem('hidden', hidden);
    localStorage.setItem('hidePassword', hidePassword);
}

function fetchLocalStorage() {
    ssid = localStorage.getItem('ssid');
    //password = localStorage.getItem('password');
    encryption = localStorage.getItem('encryption');
    hidden = localStorage.getItem('hidden');
    if (hidden == "true")
        hidden = true;
    else 
        hidden = false;
    hidePassword = localStorage.getItem('hidePassword');
    if (hidePassword == "true")
        hidePassword = true;
    else 
        hidePassword = false;
}

function prefillQRForm() {
    fetchLocalStorage();
    document.getElementById('ssid').value = ssid;
    document.getElementById('password').value = password;
    document.getElementById('encryption').value = encryption;
    document.getElementById('hidden').checked = hidden;
    document.getElementById('hidePassword').checked = hidePassword;
    if (ssid != '' || password != '')
        updateQRCode();
    else
        makeEmpty();
    updateQRSheetData();
}

function updateQRCode() {
    fetchData();
    totalString = 'WIFI:S:' + ssid + ';T:' + encryption + ';P:' + password +';H:' + hidden + ';;';
    qr = new QRCode(QRCodeVersion, QRErrorCorrectLevel.L); 
    qr.addData(totalString);
    qr.make();
    var qrArea = document.getElementById('qrcode');
    if (qrArea.lastChild)
        qrArea.replaceChild(makeQRImage(qr), qrArea.lastChild);
    else 
        qrArea.appendChild(makeQRImage(qr));

    updateQRSheetData();
}

function updateQRSheetData() {
    fetchData();
    var sheetDiv = '';
    sheetDiv += '<p>SSID: ' + ssid + '</p>';
    if (!hidePassword)
        sheetDiv += '<p>Password: ' + password +'</p>';
    sheetDiv += '<p>Encryption: ' + encryption + '</p>';
    document.getElementById('qrSheetData').innerHTML=sheetDiv;
}

function makeQRImage( code ) {
    var canvas=document.createElement('canvas');
    var qrCanvasContext = canvas.getContext('2d');
    var qrsize = code.getModuleCount();
    canvas.setAttribute('height',(qrsize * dotsize) + padding);
    canvas.setAttribute('width',(qrsize * dotsize) + padding);
    var shiftForPadding = padding/2;
    if (canvas.getContext){
        for (var r = 0; r < qrsize; r++) {
            for (var c = 0; c < qrsize; c++) {
                if (code.isDark(r, c))
                    qrCanvasContext.fillStyle = black;  
                else
                    qrCanvasContext.fillStyle = white;  
                qrCanvasContext.fillRect ((c*dotsize) +shiftForPadding,(r*dotsize) + shiftForPadding,dotsize,dotsize);   // x, y, w, h
            }   
        }
    }

    var imgElement = document.createElement("img");
    imgElement.src = canvas.toDataURL("image/png");

    return imgElement;
}

function makeEmpty() {
    var canvas = document.createElement('canvas');
    var canvasContext = canvas.getContext('2d');
    qrEmpty = new QRCode(QRCodeVersion, QRErrorCorrectLevel.L);
    qrEmpty.addData('');
    qrEmpty.make();
    var shiftForPadding = padding/2;
    qrsize = qrEmpty.getModuleCount();
    canvas.setAttribute('height', (qrsize * dotsize) + padding); 
    canvas.setAttribute('width', (qrsize * dotsize) + padding);
    for (var r = 0; r < qrsize; r++) {
            for (var c = 0; c < qrsize; c++) {
                canvasContext.fillStyle = white;  
                canvasContext.fillRect ((c*dotsize) +shiftForPadding,(r*dotsize) + shiftForPadding,dotsize,dotsize);   // x, y, w, h
            }   
        } 
    var imgElement = document.createElement("img");
    imgElement.src = canvas.toDataURL("image/png");
     var qrArea = document.getElementById('qrcode');
    if (qrArea.lastChild)
        qrArea.replaceChild(imgElement, qrArea.lastChild);
    else 
        qrArea.appendChild(imgElement);
}


