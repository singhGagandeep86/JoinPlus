let userData = [];
let BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";

function handleLogin(event) {
    event.preventDefault(); // Verhindert das Standard-Formularverhalten
    let email = event.target.email.value;
    let password = event.target.password.value;
    // Überprüfen, ob E-Mail und Passwort eingegeben wurden
    if (!email || !password) {
        console.error("Bitte E-Mail und Passwort eingeben");
        return;
    }

    // Firebase REST API für die E-Mail- und Passwort-Authentifizierung
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fehler: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.idToken) {

                sessionStorage.setItem('authToken', data.idToken); 
                window.location.href = "assets/html/summary.html"; 
            } else {
                throw new Error("Anmeldung fehlgeschlagen: Kein Token erhalten");
            }
        })
        .catch(error => {
            // console.error("Fehler bei der Anmeldung:", error.message);
            errorLogin();
        });
}

function loginAlsGast() {
    return fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            returnSecureToken: true
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fehler: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.idToken) {
                
                let guestId = data.localId; // Gast-ID aus den Daten
                let guestRef = `/guests/${guestId}`; // Pfad zur Speicherung der Gastdaten

                // Hier kannst du zusätzliche Daten für den Gast speichern, z.B. einen anonymen Benutzernamen
                fetch(`https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app${guestRef}.json`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: "Gast User", // Anonymen Namen setzen

                    })
                });

                return data.idToken;
            } else {
                throw new Error("Fehler bei der anonymen Authentifizierung: kein Token erhalten");
            }
        })
        .catch(error => {
            
        });
}

function gastLogin() {
    loginAlsGast().then((token) => {
        if (token) {
            sessionStorage.setItem('authToken', token);
            fetchAndStoreUID();
            window.location.href = "assets/html/summary.html";
        } else {
            console.error("Gastzugang fehlgeschlagen: Kein Token erhalten");
        }
    });
}

function gastLogin() {
    loginAlsGast().then((token) => {
        if (token) {
            sessionStorage.setItem('authToken', token);
            window.location.href = "assets/html/summary.html";

        } else {
            console.error("Gastzugang fehlgeschlagen: Kein Token erhalten");
        }
    });
}


function logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('uid');
    userData = [];
    window.location.href = "../../index.html";
}

async function loadInitailUser() {
    let userId = sessionStorage.getItem('uid');
    let userObject = userData.filter(e => e['uid'] === userId);
    if (userObject == '') {
        let guest = 'GS'
        createUser(guest, userObject);
        writeGreetinGuest(userObject)
    } else {
        for (let i = 0; i < userObject.length; i++) {
            let element = userObject[i].name;
            let userInitial = extrahiereInitialen(element)
            let replaceElement = capitalizeName(element)
            createUser(userInitial);
            writeGreetin(replaceElement, userObject);
        }
    }
}

function capitalizeName(name) {
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function writeGreetin(replaceElement, userObject) {
    let nameGreeting = document.getElementById('greetingName');
    
    if(nameGreeting == null){

    }else{
        nameGreeting.innerHTML = replaceElement;
    }
}

function writeGreetinGuest() {
    let nameGreeting = document.getElementById('greetingName');
    if(nameGreeting == null){

    }else{
        nameGreeting.innerHTML = 'Guest User'
    }
    
}

function createUser(userInitial, guest, userObject) {
    let userInitials = document.getElementById('userIni');
    if (userObject == '') {
        userInitials.innerText = guest;
    } else {
        userInitials.innerText = `${userInitial}`;
    }


}

function extrahiereInitialen(element) {
    for (let i = 0; i < element.length; i++) {
        let nameParts = element.split(' ');
        let initials = '';
        for (let j = 0; j < nameParts.length; j++) {
            initials += nameParts[j].charAt(0).toUpperCase();
        }
        return initials;
    }
}


async function fetchUserData(path) {
    let response = await fetch(getDatabaseUrl(path));
    let responsetoJson = await response.json();
    let taskArray = Object.values(responsetoJson);
    for (let i = 0; i < taskArray.length; i++) {
        userData.push(taskArray[i]);
    }
    loadInitailUser();
}


function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

async function fetchAndStoreUID() {
    let token = sessionStorage.getItem('authToken');
    if (!sessionStorage.getItem('uid')) {
        let response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idToken: token
            })
        });
        let data = await response.json();
        let uid = data.users[0].localId;
        sessionStorage.setItem('uid', uid);
    }
}

function errorLogin(){    
     document.getElementById('emailInput').classList.add('falseEnter');
     document.getElementById('passwordInput').classList.add('falseEnter');
     document.getElementById('fail').classList.remove('d_none');
     document.getElementById('passwordInput').value = '';
     
}

function returnInput() {
    if(document.getElementById('emailInput').value== ''){
        document.getElementById('emailInput').classList.remove('falseEnter');
        document.getElementById('passwordInput').classList.remove('falseEnter');
        document.getElementById('fail').classList.add('d_none');
     }
    
}