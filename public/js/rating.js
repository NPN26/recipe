
$(document).ready(function() {
    // hide the rating if user is not logged in
    if (!localStorage.getItem('userId')){
        $('#rating-system').hide();
    }

    // Handle form submission with AJAX
    $('form').submit(function(event) {
        event.preventDefault(); // Prevent default form submission
        var rating = $('input[name="rating"]:checked').val();
        var recipe_id = $('input[name="recipe_id"]').val();
        var user_id = localStorage.getItem('userId');
        console.log('Rating:', rating, 'Recipe ID:', recipe_id, 'User ID:', user_id);

        $.ajax({
            url: `/recipe/${recipe_id}/rate`,
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify({
                user_id,
                recipe_id,
                rating
            }),
            success: function (response) {
                console.log("Server response: ", response.message);
                if (response.status === "success") {
                    alert('Thanks for rating!');
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Recipe submission failed, please try again");
            },
        });
    });
});