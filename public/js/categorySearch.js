$(document).ready(function () {
    $("form").submit(function (e) {
        e.preventDefault();
        const search = $("input[name='search']").val();
        const category_name = document.getElementById('category-name').textContent;
        console.log("Search: ", search);
        $.ajax({
            url: "/searchCategory",
            method: "GET",
            contentType: 'application/json',
            data: { search, category_name },
            success: function (response) {
                console.log("Server response: ", response);
                if (response.status === "success") {
                    console.log("Recipes: ", response.recipes);
                    if (response.recipes.length === 0) {
                        console.log(response.recipes.length)
                        alert("No recipes found, please try again");
                        window.location.href = "/category/" + category_name;
                    } else {
                        $("#no-recipes-message").addClass('hidden');
                        for (let i = 0; i < 6; i++) {
                            const recipeElement = $(`#recipe-link${i + 1}`).closest('.recipe-card');
                            if (i < response.recipes.length) {
                                const recipe = response.recipes[i];
                                const imagePath = recipe.image ? recipe.image.replace('public/', '') : '';
                                $(`#recipe-link${i + 1}`).html(`<img alt="recipe-image" src="/${imagePath}"><br><p>${recipe.recipe_name}</p>`);
                                $(`#recipe-link${i + 1}`).attr("href", `/recipe/${recipe.recipe_id}`);
                                recipeElement.removeClass('hidden');
                            } else {
                                recipeElement.addClass('hidden');
                            }
                        }
                    }
                } else {
                    alert("Search failed, please try again");
                }
            },
            error: function () {
                alert("Search failed, please try again");
            }
        });
    });
});