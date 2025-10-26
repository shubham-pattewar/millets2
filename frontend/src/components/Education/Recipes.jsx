import React, { useState } from 'react';
import { FaClock, FaUtensils, FaFire } from 'react-icons/fa';
import './Education.css';

const Recipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const recipes = [
    {
      id: 1,
      name: 'Ragi Dosa',
      image: '🥞',
      millet: 'Finger Millet',
      difficulty: 'Easy',
      time: '30 mins',
      servings: 4,
      category: 'Breakfast',
      ingredients: [
        '1 cup Ragi (Finger Millet) flour',
        '1/2 cup Rice flour',
        '1/4 cup Urad dal',
        'Salt to taste',
        'Water as needed'
      ],
      instructions: [
        'Soak urad dal for 4 hours and grind to smooth paste',
        'Mix ragi flour, rice flour, and urad dal paste',
        'Add salt and water to make batter',
        'Ferment overnight',
        'Heat dosa pan and spread batter thin',
        'Cook until golden brown on both sides',
        'Serve hot with chutney'
      ],
      nutrition: { calories: 150, protein: '6g', fiber: '3g' },
      benefits: ['High in calcium', 'Good for bones', 'Gluten-free']
    },
    {
      id: 2,
      name: 'Bajra Roti',
      image: '🫓',
      millet: 'Pearl Millet',
      difficulty: 'Easy',
      time: '20 mins',
      servings: 4,
      category: 'Main Course',
      ingredients: [
        '2 cups Bajra (Pearl Millet) flour',
        'Warm water',
        'Salt to taste',
        'Ghee for cooking'
      ],
      instructions: [
        'Mix bajra flour with salt',
        'Add warm water gradually and knead soft dough',
        'Make small balls and roll into rotis',
        'Cook on hot tawa',
        'Apply ghee and serve hot',
        'Best enjoyed with curry or sabzi'
      ],
      nutrition: { calories: 180, protein: '7g', fiber: '8g' },
      benefits: ['Rich in iron', 'Boosts immunity', 'Good for anemia']
    },
    {
      id: 3,
      name: 'Foxtail Millet Khichdi',
      image: '🍲',
      millet: 'Foxtail Millet',
      difficulty: 'Easy',
      time: '25 mins',
      servings: 3,
      category: 'Main Course',
      ingredients: [
        '1 cup Foxtail millet',
        '1/2 cup Moong dal',
        '2 cups water',
        'Vegetables (carrots, peas, beans)',
        'Spices (turmeric, cumin, salt)',
        'Ghee 1 tbsp'
      ],
      instructions: [
        'Wash millet and dal thoroughly',
        'Heat ghee, add cumin seeds',
        'Add vegetables and sauté',
        'Add millet, dal, and water',
        'Pressure cook for 3 whistles',
        'Add salt and turmeric',
        'Serve hot with yogurt'
      ],
      nutrition: { calories: 220, protein: '10g', fiber: '6g' },
      benefits: ['Weight loss', 'Easy to digest', 'Diabetic-friendly']
    },
    {
      id: 4,
      name: 'Little Millet Upma',
      image: '🍛',
      millet: 'Little Millet',
      difficulty: 'Easy',
      time: '15 mins',
      servings: 2,
      category: 'Breakfast',
      ingredients: [
        '1 cup Little millet',
        '2 cups water',
        'Mustard seeds',
        'Curry leaves',
        'Onion, green chili',
        'Salt to taste',
        'Oil 1 tbsp'
      ],
      instructions: [
        'Roast little millet until aromatic',
        'Boil 2 cups water',
        'Heat oil, add mustard seeds',
        'Add curry leaves, onion, chili',
        'Add roasted millet and boiled water',
        'Cook covered for 10 mins',
        'Fluff and serve hot'
      ],
      nutrition: { calories: 160, protein: '5g', fiber: '5g' },
      benefits: ['Quick energy', 'Antioxidant rich', 'Heart healthy']
    }
  ];

  const RecipeCard = ({ recipe }) => (
    <div className="recipe-card" onClick={() => setSelectedRecipe(recipe)}>
      <div className="recipe-image">{recipe.image}</div>
      <div className="recipe-info">
        <h3>{recipe.name}</h3>
        <p className="recipe-millet">{recipe.millet}</p>
        <div className="recipe-meta">
          <span><FaClock /> {recipe.time}</span>
          <span><FaUtensils /> {recipe.servings} servings</span>
          <span><FaFire /> {recipe.difficulty}</span>
        </div>
        <span className="recipe-category">{recipe.category}</span>
      </div>
    </div>
  );

  return (
    <div className="education-container">
      <div className="container">
        <div className="education-header">
          <h1>🍳 Delicious Millet Recipes</h1>
          <p>Easy and healthy recipes using nutritious millets</p>
        </div>

        {!selectedRecipe ? (
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="recipe-detail">
            <button 
              className="btn btn-outline"
              onClick={() => setSelectedRecipe(null)}
            >
              ← Back to Recipes
            </button>

            <div className="recipe-detail-header">
              <div className="recipe-detail-image">{selectedRecipe.image}</div>
              <div className="recipe-detail-info">
                <h1>{selectedRecipe.name}</h1>
                <p className="recipe-detail-millet">Using {selectedRecipe.millet}</p>
                <div className="recipe-detail-meta">
                  <div className="meta-item">
                    <FaClock />
                    <div>
                      <strong>Time</strong>
                      <span>{selectedRecipe.time}</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <FaUtensils />
                    <div>
                      <strong>Servings</strong>
                      <span>{selectedRecipe.servings} people</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <FaFire />
                    <div>
                      <strong>Difficulty</strong>
                      <span>{selectedRecipe.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="recipe-sections">
              <section className="recipe-section">
                <h2>Ingredients</h2>
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </section>

              <section className="recipe-section">
                <h2>Instructions</h2>
                <ol className="instructions-list">
                  {selectedRecipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </section>

              <section className="recipe-section">
                <h2>Nutritional Information</h2>
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-label">Calories</span>
                    <span className="nutrition-value">{selectedRecipe.nutrition.calories}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Protein</span>
                    <span className="nutrition-value">{selectedRecipe.nutrition.protein}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Fiber</span>
                    <span className="nutrition-value">{selectedRecipe.nutrition.fiber}</span>
                  </div>
                </div>
              </section>

              <section className="recipe-section">
                <h2>Health Benefits</h2>
                <ul className="benefits-list">
                  {selectedRecipe.benefits.map((benefit, index) => (
                    <li key={index}>✓ {benefit}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;