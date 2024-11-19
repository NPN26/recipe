
$(document).ready(function () {
    $("form").submit(function (e) {
        e.preventDefault();
        const username = $("#username").val();
        const email = $("#email").val();
        const password = $("#password").val();
        const passwordReconfirm = $("#password-reconfirm").val();

        if (password !== passwordReconfirm) {
            alert("Passwords do not match.");
            $("#password").css("border-color", "red");
            $("#password-reconfirm").css("border-color", "red");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            $("#password").css("border-color", "red");
            $("#password-reconfirm").css("border-color", "red");
            return;
        }

        $.ajax({
            url: "/register",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username, email, password }),
            success: function (response) {
                if (response.status === "success") {
                    console.log("Registration successful");
                    window.location.href = "./login.html";
                } else {
                    alert("Registration failed: " + response.message + ", Please try again.");
                }
            },
            error: function () {
                alert("Registration failed, please try again.");
            },
        });
    });
});