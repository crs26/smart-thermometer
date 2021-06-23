import QrScanner from "./qr-scanner.min.js";
QrScanner.WORKER_PATH = './qr-scanner-worker.min.js';

let currentTemp = 0;
let statusLabel = document.getElementById("status");
let tempLabel = document.getElementById("temp");
const video = document.getElementById('qr-video');
const label = document.getElementById('scan-region');
const firebaseConfig = {
  apiKey: "AIzaSyCmB5FLLGR8QdyDC1B8Xwlaim_likvfdys",
  authDomain: "smart-thermometer-3b737.firebaseapp.com",
  projectId: "smart-thermometer-3b737",
  storageBucket: "smart-thermometer-3b737.appspot.com",
  messagingSenderId: "707678332445",
  appId: "1:707678332445:web:38c9b565afa74dfee508f4",
  measurementId: "G-CHJ31JL700"
};
const alarm = new Audio('242006__photogtony__microwave-beep.wav');
const beep = new Audio('202530__kalisemorrison__scanner-beep.wav');

firebase.initializeApp(firebaseConfig);
let cloudDB = firebase.firestore();


const scanner = new QrScanner(video, result => {
  if(currentTemp > 0){
    beep.play();
    cloudDB.collection('temp-history').add({
      id: result,
      temp: currentTemp,
      timestamp: Date.now()
    });
    cloudDB.collection('temp-reader').doc('current-reading').set({temp: 0});
    currentTemp = 0;
    scanner.stop();
    statusLabel.innerHTML = "Waiting for temperaure";
    tempLabel.innerHTML = "";
  }
});


cloudDB.collection("temp-reader").doc("current-reading").onSnapshot((doc) => {
  if(doc.data().temp > 0){
      if(doc.data().temp > 37){
        alarm.play();
        // $('#temp').removeClass('green');
        // $('#temp').addClass('red');
        $('#container').removeClass('bg-success');
        $('#container').addClass('bg-danger');
      }else{
        // $('#temp').addClass('green');
        // $('#temp').removeClass('red');
        $('#container').addClass('bg-success');
        $('#container').removeClass('bg-danger');
        beep.play();
      }
      console.log(doc.data().temp)
      currentTemp = doc.data().temp;
      scanner.start();
      tempLabel.innerHTML = doc.data().temp;
      statusLabel.innerHTML = "Waiting for QR Code";
  }
})
label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
scanner.$canvas.style.display = true;

currentTemp = 0