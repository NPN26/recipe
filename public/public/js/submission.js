// Function to add new ingredient input
function addIngredient() {
    const ingredientsContainer = $("#ingredients-container");
    const count = ingredientsContainer.children().length + 1;
    const newIngredient = $(`
        <div class="input-group mb-3" id="Ingredient ${count}">
            <input type="text" class="form-control" placeholder="Ingredient ${count}" name="recipe-ingredients" required />
            <div class="input-group-append">
                <button type="button" class="btn btn-danger" onclick="deleteIngredient(this)">Delete</button>
            </div>
        </div>
    `);
    ingredientsContainer.append(newIngredient);
}

// Function to add new instruction input
function addInstruction() {
    const instructionsContainer = $("#instructions-container");
    const count = instructionsContainer.children().length + 1;
    const newInstruction = $(`
        <div class="input-group mb-3" id="Step ${count}">
            <input type="text" class="form-control" placeholder="Step ${count}" name="recipe-instructions" required />
            <div class="input-group-append">
                <button type="button" class="btn btn-danger" onclick="deleteInstruction(this)">Delete</button>
            </div>
        </div>
    `);
    instructionsContainer.append(newInstruction);
}

// Function to delete ingredient
function deleteIngredient(button) {
    $(button).closest('.input-group').remove();
    updateIngredientsNumbering();
}

// Function to delete instruction
function deleteInstruction(button) {
    $(button).closest('.input-group').remove();
    updateInstructionsNumbering();
}

// Helper function to update ingredients numbering
function updateIngredientsNumbering() {
    $('#ingredients-container .input-group').each(function(index) {
        const number = index + 1;
        $(this).attr('id', `Ingredient ${number}`);
        $(this).find('input').attr('placeholder', `Ingredient ${number}`);
    });
}

// Helper function to update instructions numbering
function updateInstructionsNumbering() {
    $('#instructions-container .input-group').each(function(index) {
        const number = index + 1;
        $(this).attr('id', `Step ${number}`);
        $(this).find('input').attr('placeholder', `Step ${number}`);
    });
}

// Form submission handling
$(function () {
    $("form").submit(function (e) {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        const formData = new FormData(this);
        
        // Remove any existing prep/cook time fields
        formData.delete('prep-time');
        formData.delete('cook-time');
        
        // Add the prep time and cook time values
        const prepHours = formData.get('prep-time-hours') || '0';
        const prepMinutes = formData.get('prep-time-minutes') || '0';
        const cookHours = formData.get('cook-time-hours') || '0';
        const cookMinutes = formData.get('cook-time-minutes') || '0';
        
        // Validate time inputs are numbers
        if (!/^\d*$/.test(prepHours) || !/^\d*$/.test(prepMinutes) ||
            !/^\d*$/.test(cookHours) || !/^\d*$/.test(cookMinutes)) {
            alert("Please enter valid numbers for time values");
            return;
        }
        
        // Add userId to formData
        formData.append('userId', userId);

        $.ajax({
            url: "/add",
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Server response: ", response);
                if (response.status === "success") {
                    window.location.href = "./";
                } else {
                    alert($('#error-message').show());
                }
            },
            error: function (response) {
                alert("Recipe submission failed, please try again: " + response.message);
            },
        });
    });
});