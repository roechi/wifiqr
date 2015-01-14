var ssid;
var password;
var encryption;
var hidden;
var totalString;
var qr;
var dotsize = 5;  // size of box drawn on canvas
var padding = 10; // (white area around your QRCode)
var black = "rgb(0,0,0)";
var white = "rgb(255,255,255)";
var QRCodeVersion = 5;

function updateQRCode() {
    ssid = document.getElementById("ssid").value;
    password = document.getElementById("password").value;
    encryption = document.getElementById("encryption").value;
    if (document.getElementById("hidden").checked)
        hidden = true;
    else 
        hidden = false;
    totalString = 'WIFI:S:' + ssid + ';T:' + encryption + ';P:' + password +';H:' + hidden + ';;';
    qr = new QRCode(QRCodeVersion, QRErrorCorrectLevel.L); 
    qr.addData(totalString);
    qr.make();
    var qrArea = document.getElementById('qrcode');
    if (qrArea.lastChild)
        qrArea.replaceChild(makeQRImage(qr), qrArea.lastChild);
    else 
        qrArea.appendChild(makeQRImage(qr));
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