$(document).ready(function () {
    $('#login-form').on('submit', function (e) {
      e.preventDefault();
  
      let username = $('#username').val();
      let password = $('#password').val();
  
      // Save username to local storage
      localStorage.setItem('username', username);
  
      $.ajax({
        type: 'POST',
        url: '/recipe/index.php/public/login',
        data: JSON.stringify({ username: username, password: password }),
        contentType: 'application/json',
        success: function (response) {
          if (response.status === 'success') {
            console.log('Login successful');
            //window.location.href = '../index.html';
          } else {
            $('#message').text(response.message);
          }
        },
        error: function (err) {
          $('#message').text('An error occurred. Please try again.');
        }
      });
    });
});
  