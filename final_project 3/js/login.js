$(function() {
    $("#log_out").click(function(){
        handleSignOut();
    });
});

function handleSignUp() {
    //step1 :Get the email/password entered by user
    var email = document.getElementById('form-email').value;
    var password = document.getElementById('form-password').value;
    // Step2: Validate

    if(email.length<4){
        alert("Please enter a vaild email address");
        return;
    }
    if(password.length<4){
        alert("Please enter a stronger password" );
        return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(
            function(){
                alert("User Create" );
            }
        )
        .catch(
            function(error){
                alert("error.message");
                window.location.href="http://peterchangsite.com/aau/wnm617/final_project/main.html"
            }
        )
}
function handleSignIn() {
    //Step 1 : Get the email/passwd entered by user
    var email = document.getElementById('form-email').value;
    var password = document.getElementById('form-password').value;
    //Step2 : Sign them in
    firebase.auth().signInWithEmailAndPassword(email,password)
        .then(
            function(){
                window.location.href="http://peterchangsite.com/aau/wnm617/final_project/main.html"
            }
        )
        .catch(
            function(error){
                alert(error.message)
            }
        )
}
function handleSignOut(){  //step2: Sign them in
    firebase.auth().signOut()
        .then(function () {
            window.location.href="http://peterchangsite.com/aau/wnm617/final_project/"
        })
        .catch(function (error) {
            alert(error.message)
        });
}

// add facebook login
function handleFBLogin(){
    if(!firebase.auth().currentUser){
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;
                window.location.href="http://peterchangsite.com/aau/wnm617/final_project/main.html"
            })
            .catch(function(error){
                alert(error.message)
            });
    }
    else{
        handleSignOut();
    }
}

// add Twitter login

function handleTwitterLogin(){
    if(!firebase.auth().currentUser){
        var provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;
                window.location.href="http://peterchangsite.com/aau/wnm617/final_project/main.html"
            })
            .catch(function(error){
                alert(error.message)
            });
    }
    else{
        handleSignOut();
    }
}
function handleGoogleLogin() {
    if(! firebase.auth().currentUser){
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(
                function(result){
                    var token = result.credential.accessToken;
                    var user = result.user;
                    window.location.href="http://peterchangsite.com/aau/wnm617/final_project/main.html"
                }
            )
            .catch(
                function(error){
                    alert(error.message);
                }
            )
    }
    else{
        handleSignOut();
    }
}

