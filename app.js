class Recipe{
  constructor(name, thumbnail, youtubeLink, recipeIngredients){
    this.name = name;
    this.thumbnail = thumbnail;
    this.youtubeLink = youtubeLink;
    this.recipeIngredients = recipeIngredients;
  }
}

//Getting the Search item from the user
document.getElementById('btnsearch').addEventListener('click', () => {
  const ingredient = document.getElementById('ingredient').value.trim();
  if (ingredient) {
    fetchRecipes(ingredient);
  }
});

//Function to fetch recipes
async function fetchRecipes(ingredient){
  try {
     let pageLoad = document.createElement('style');
     pageLoad.innerHTML=`
      .main-container{
        opacity:5%;
      }
     `;
     document.head.appendChild(pageLoad);
    // pageLoad.classList.add('recipe-loading');
    document.getElementById('loading').style.display = 'block'; 

    document.getElementById('results').innerHTML = '';

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredient}`);
    const data = await response.json();
     pageLoad = document.createElement('style');
     pageLoad.innerHTML=`
      .main-container{
        opacity:100%;
      }
     `;
     document.head.appendChild(pageLoad);
    document.getElementById('loading').style.display = 'none';

    // Check if meals exist
    if (data.meals) {
      const recipes = data.meals.map(recipe => {
        let recipeIngredients = '';

        // Safely concatenate ingredients
        for (let i = 1; i <= 20; i++) {
          const ingredient = recipe[`strIngredient${i}`];
          if (ingredient) {
            recipeIngredients += ingredient + ', ';
          }
        }

        // Remove last comma and space
        recipeIngredients = recipeIngredients.slice(0, -2);

        return new Recipe(
          recipe.strMeal,
          recipe.strMealThumb,
          recipe.strYoutube,
          recipeIngredients
        );
      });

      displayRecipes(recipes);
    } else {
      // If no meals are found
      document.getElementById('results').innerHTML = '<p>No recipes found.</p>';
    }
  } catch (error) {
    document.getElementById('results').innerHTML = '<p>Error fetching recipes.</p>';
    console.error('Failed to fetch recipes:', error);
  }
}

    //  const recipeCard = document.createElement('div');
    //  recipeCard.classList.add('recipe-card');


//Function to display recipes
function displayRecipes(recipes) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  recipes.forEach(recipe => {
    // Create a div to hold the recipe details
    // const recipeDiv = document.createElement('div');
    // recipeDiv.classList.add('recipe');

    const recipeCard = document.createElement('div');
     recipeCard.classList.add('recipe-card');

    // Add recipe name
    const nameElement = document.createElement('h2');
    nameElement.textContent = recipe.name;
    recipeCard.appendChild(nameElement);

    // Add recipe thumbnail
    const thumbnailElement = document.createElement('img');
    thumbnailElement.src = recipe.thumbnail;
    thumbnailElement.alt = recipe.name;
    thumbnailElement.classList.add('thumbnail');
    recipeCard.appendChild(thumbnailElement);

    // Add YouTube button
    const youtubeButton = document.createElement('button');
    youtubeButton.textContent = 'Watch on YouTube';
    youtubeButton.addEventListener('click', () => {
      window.open(recipe.youtubeLink, '_blank');
    });
    recipeCard.appendChild(youtubeButton);

    // Add Ingredients button
    const ingredientsButton = document.createElement('button');
    ingredientsButton.textContent = 'View Ingredients';
    ingredientsButton.addEventListener('click', () => {
      const ingredientsDiv = recipeCard.querySelector('.ingredients');
      if (!ingredientsDiv) {
        const newIngredientsDiv = document.createElement('div');
        newIngredientsDiv.classList.add('ingredients');
        newIngredientsDiv.textContent = `Ingredients: ${recipe.recipeIngredients}`;
        recipeCard.appendChild(newIngredientsDiv);
      } else {
        // Toggle ingredients visibility if it's already displayed
        ingredientsDiv.style.display = ingredientsDiv.style.display === 'none' ? 'block' : 'none';
      }
    });
    recipeCard.appendChild(ingredientsButton);

    // Append the recipe div to the results div
    resultsDiv.appendChild(recipeCard);
  });
}
