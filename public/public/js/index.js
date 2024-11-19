$(document).ready(function () {
    $("form").submit(function (e) {
        e.preventDefault();
        const search = $("input[name='search']").val();
        $.ajax({
            url: "/search",
            method: "GET",
            contentType: 'application/json',
            data: { search },
            success: function (response) {
                console.log("Server response: ", response);
                if (response.status === "success") {
                    for (let i = 0; i < 6; i++) {
                        const recipeElement = $(`#recipe${i + 1}`);
                        if (i < response.recipes.length) {
                            const recipe = response.recipes[i];
                            const imagePath = recipe.image ? recipe.image.replace('public/', '') : '';
                            recipeElement.find("img").attr("src", `/${imagePath}`);
                            const recipeAEle = $(`#recipe${i + 1}link`);
                            recipeAEle.html(`<img alt="recipe-image" src="/${imagePath}"><br><p>${recipe.recipe_name}</p>`);
                            recipeAEle.attr("href", `/recipe/${recipe.recipe_id}`);
                            recipeElement.removeClass('hidden');
                        } else {
                            recipeElement.addClass('hidden');
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