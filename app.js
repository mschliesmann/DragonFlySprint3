//Signing Up Users
let signup_form = document.querySelector('#signup_form');
let signupbtn = document.querySelector('#signupbtn');

// Attach an event
signupbtn.addEventListener('click', (e) => {
    e.preventDefault();

    // grab the email and password
    let user = {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        challenge_type: document.querySelector('#challenge_type').value
    }
    

    // pass the values to firebase

    // sign up the user
    auth.createUserWithEmailAndPassword(user.email, user.password)
        .then(() => {
            db.collection('users').doc(auth.currentUser.uid).set(user)
        })
        .catch((error) => {
            let signup_error = document.querySelector('#signup_error');
            signup_error.innerHTML = `<p>${error.message}</p>`;
        });
    
    signup_form.reset();
})

// Signing In Users
let signin_form = document.querySelector('#signin_form');
let signinbtn = document.querySelector('#signinbtn');

// attach a submit event on the form
signinbtn.addEventListener('click', (e) => {
    e.preventDefault();

    // grab the email and password from the form

    let email = document.querySelector('#email_').value;
    let password = document.querySelector('#password_').value;


    auth.signInWithEmailAndPassword(email, password)
    .then((userCredentials) => {
        console.log(userCredentials.user.email + " with the uid " + userCredentials.user.uid + " is logged in!")
        // reset 
        signin_form.reset();
    })
    .catch((error) => {
        console.log(error.message);
        // grab the error div
        let signin_error = document.querySelector('#signin_error');
        signin_error.innerHTML = `<p>${error.message}</p>`
    })
})

// Signing Out Users
let signoutbtn = document.querySelector('#signoutbtn');

// attach a click event
signoutbtn.addEventListener('click', () => {
    auth.signOut()
        .then((msg) => {
        console.log("user signed out!");
    })
})

// Keeping track of user authentication status (signed in or signed out)
auth.onAuthStateChanged((user) => {
//check if user is signed in or signed out
if(user) {
  console.log('user is now signed in!')
  configureNav(user);
  configureContent(user);
}
else {
  console.log('user is now signed out!')
  configureNav();
  configureContent(user);
}
})

//Toggling Nav Bar
    let loggedoutlinks = document.querySelectorAll('.loggedout');
    let loggedinlinks = document.querySelectorAll('.loggedin');

    // Functions
    function configureNav(user) {
        //check if user is passed to the function - user is signed in
        if (user) {
            //show only the logged in links
            loggedinlinks.forEach((link) => {
                link.classList.remove('is-hidden'); //if there is any is-hidden class on the button, remove it
            })
  
            //hide all the logged out links
            loggedoutlinks.forEach((link) => {
                link.classList.add('is-hidden'); //add an is-hidden class on the button to hide it
            })
        }
        //no user is passed to the function - user is signed out
        else {
            //show only the logged out links
            loggedoutlinks.forEach((link) => {
                link.classList.remove('is-hidden');
            })
            //hide all the logged in links
            loggedinlinks.forEach((link) => {
                link.classList.add('is-hidden');
            })
        }
    }

// Configuring Content
var end = new Date('09/05/2022');
var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;

function showRemaining() {
    var now = new Date();
    var distance = end - now;
   
    var days = Math.floor(distance / _day);
    return days;
}

function getName(){
    db.collection('users').doc(auth.currentUser.uid).get().then(res => {
        let name = res.data().firstName;
        document.querySelector('#myname').innerHTML += name;
    })
}

function configureContent(user) {
    console.log('removed content')

    //check if user is signed in (passed to the function)
    if (user) {
    //empty the content div
        main_content.classList.remove('is-active');
        main_content.classList.add('is-hidden');
        signin_signout.classList.remove('is-active');
        signin_signout.classList.add('is-hidden');
        signedIn_content.classList.remove('is-hidden');
        signedIn_content.classList.add('is-active');
        prize_content.classList.remove('is-hidden');
        prize_content.classList.add('is-active');

        signedIn_content.innerHTML = `<h1 class="title is-1 p-3 has-text-centered has-background-white" style="border-radius: 50px;">Hi, <span id="myname"></span>!</h1>
        <div class="title is-3 has-text-centered p-3 has-text-white" style="border-radius: 50px; background:orange">
            <p>${showRemaining()} Days Left In Challenge</p>
        </div>

        <div class="title is-4 has-text-centered p-3 has-text-white" style="background:orange">Took a Class? Log it here!
            <div class = "field p-2">
                <div class="control">
                <div class="select p-2">
                    <select>
                        <option>Class Type</option>
                        <option value="flow">Flow</option>
                        <option value="yin">Yin</option>
                        <option value="power_up">Power Up</option>
                        <option value="yoga_up">Yoga Up</option>
                        <option value="barre">Barre</option>
                        <option value="fusion">Fusion</option>
                    </select>
                </div>
            </div>

            <div class = "field p-2 mt-2 title is-6 has-text-centered has-text-white">Date of Class
                <p></p>
                <input type="date"></input>
            </div>

            <div class="control mt-2">
                <button id= "submitClass" class="button is-white">Add Class</button>
            </div>

        </div>
        `;
        getName()
    
        //get challenge type for prizes
        db.collection('users').doc(auth.currentUser.uid).get().then(res => {
            let challenge = res.data().challenge_type;
            if (challenge == '40') {
                prize_content.innerHTML = 
                    `<div class="card-content p-2 has-background-white">
                        <div class="content has-text-centered">
                            <div class="card-header-title is-centered has-background-white-bis">
                                <h1 class="title is-6">Make it to 40 Classes and receive an exclusive DragonFly tank!</h1>
                            </div>
                            <div class="card-content p-2 has-background-white">
                                <div class="content has-text-centered">
                                    <div class="has-text-centered p-2">
                                        <figure class="image">
                                            <img src="99days_40_tank.jpg" alt="40 Tank">
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }
            if (challenge == '50') {
                prize_content.innerHTML = 
                    `<div class="card-content p-2 has-background-white">
                        <div class="content has-text-centered">
                            <div class="card-header-title is-centered has-background-white-bis">
                                <h1 class="title is-6">Make it to 50 Classes and receive an exclusive DragonFly tote!</h1>
                            </div>
                            <div class="card-content p-2 has-background-white">
                                <div class="content has-text-centered">
                                    <div class="has-text-centered p-2">
                                        <figure class="image">
                                            <img src="99days_50_tote.jpg" alt="50 Tote">
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }
            if (challenge == '60') {
                prize_content.innerHTML = 
                    `<div class="card-content p-2 has-background-white">
                        <div class="content has-text-centered">
                            <div class="card-header-title is-centered has-background-white-bis">
                                <h1 class="title is-6">Make it to 60 Classes and receive an exclusive DragonFly hoodie!</h1>
                            </div>
                        </div>
                        <div class="card-content p-2 has-background-white">
                                <div class="content has-text-centered">
                                    <div class="has-text-centered p-2">
                                        <figure class="image">
                                            <img src="99days_60_hoodie.jpg" alt="60 Hoodie">
                                        </figure>
                                    </div>
                                </div>
                            </div>
                    </div>`;
            }
        })
    }

    //user is not signed in (not passed to the function)
    else {
        main_content.classList.remove('is-hidden');
        main_content.classList.add('is-active');
        signin_signout.classList.remove('is-hidden');
        signin_signout.classList.add('is-active');
        signedIn_content.classList.remove('is-active');
        signedIn_content.classList.add('is-hidden');
        prize_content.classList.remove('is-active');
        prize_content.classList.add('is-hidden');

    }
}