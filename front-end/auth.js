// // auth.js

// function checkAuthentication() {
//   fetch('http://localhost:4000/api/users/authenticated', {
//     credentials: 'include'
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (!data.authenticated) {
//       window.location.href = 'https://erkhemq.github.io/cookly/signin.html';
//     }
//   })
//   .catch(error => {
//     console.error('Error checking authentication status:', error);
//   });
// }

// checkAuthentication();
