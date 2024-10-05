function handleLogin(event) {
    event.preventDefault(); 
    let email = event.target.email.value;
    let password = event.target.password.value;
   
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
            console.log("Gastzugang erfolgreich:", data);
            return data.idToken; 
        } else {
            throw new Error("Fehler bei der anonymen Authentifizierung: kein Token erhalten");
        }
    })
    .catch(error => {
        console.error("Fehler:", error);
    });
}

function gastLogin() {
    loginAlsGast().then((token) => {      
        if (token) {
            sessionStorage.setItem('authToken', token); 
            window.location.href = "../../assets/html/summary.html"; 
        } else {
            console.error("Gastzugang fehlgeschlagen: Kein Token erhalten");
        }
    });
}

function logout() {
    sessionStorage.removeItem('authToken');    
    window.location.href = "../../assets/html/login.html"; 
}