$(document).ready(function() {
    if(localStorage.getItem('userId')) {
        var loginItem = $(".login-item");
        loginItem.last().html("Submit recipe");
        loginItem.last().attr("href", "/submission.html");
        // add logout image and funcationality to delete local storage
        var logoutImage = $("<img>");
        logoutImage.attr("src", "/images/logout.png");
        logoutImage.attr("alt", "logout");
        logoutImage.attr("id", "logout");
        logoutImage.attr("style", "cursor:pointer");
        logoutImage.attr("title", "Logout");
        logoutImage.on('click', function() {
            //alert confirm
            if(!confirm("Are you sure you want to logout?")) {
                return;
            }
            localStorage.removeItem('userId');
            //send user to homepage
            window.location.href = "/";
        });
        loginItem.last().after(logoutImage);

    }
    else {
        var loginItem = $(".login-item");
        loginItem.last().html("Login");
        loginItem.last().attr("href", "/login.html");

    }


});