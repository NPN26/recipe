
$(function () {
    $("form").submit(function (e) {
        e.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();

        $.ajax({
            url: "/login",
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (response) {
                console.log("Server response: ", response);
                if (response.status === "success") {
                    localStorage.setItem('userId', response.user_id);
                    window.location.href = "./";
                } else {
                    alert("Login failed, " + response.message + ", please try again");
                    $("#username").css("border", "1px solid red");
                    $("#password").css("border", "1px solid red");
                }
            },
            error: function () {
                alert("Login failed, please try again");
            },
        });
    });
});