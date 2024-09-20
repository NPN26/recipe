let ingredientCount = 1;
let instructionCount = 1;

function addIngredient() {
    ingredientCount++;
    const container = document.getElementById('ingredients-container');
    const newIngredient = document.createElement('div');
    newIngredient.className = 'textbox';
    newIngredient.innerHTML = `<input type="text" placeholder="Ingredient ${ingredientCount}" name="recipe-ingredients" required />`;
    container.appendChild(newIngredient);
}

function addInstruction() {
    instructionCount++;
    const container = document.getElementById('instructions-container');
    const newInstruction = document.createElement('div');
    newInstruction.className = 'textbox';
    newInstruction.innerHTML = `<input type="text" placeholder="Step ${instructionCount}" name="recipe-instructions" required />`;
    container.appendChild(newInstruction);
}