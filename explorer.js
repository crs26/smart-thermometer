const firebaseConfig = {
    apiKey: "AIzaSyCmB5FLLGR8QdyDC1B8Xwlaim_likvfdys",
    authDomain: "smart-thermometer-3b737.firebaseapp.com",
    projectId: "smart-thermometer-3b737",
    storageBucket: "smart-thermometer-3b737.appspot.com",
    messagingSenderId: "707678332445",
    appId: "1:707678332445:web:38c9b565afa74dfee508f4",
    measurementId: "G-CHJ31JL700"
};

firebase.initializeApp(firebaseConfig);
let cloudDB = firebase.firestore();

cloudDB.collection("temp-history").orderBy('timestamp', 'desc').limit(500)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            $('#tempLog tr:last').after('<tr><th>'+convert_timestamp(doc.data().timestamp)+'</th><th>'+doc.data().id+'</th><th>'+doc.data().temp+'</th></tr>');
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

function convert_timestamp(timestamp){
    let date = new Date(timestamp);
    return(date.getDate()+
        "/"+(date.getMonth()+1)+
        "/"+date.getFullYear()+
        " "+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds());
}