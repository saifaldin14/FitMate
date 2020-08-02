import axios from 'axios';

export const _retrieveNutrition = food => {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        app_id: '6dce04da',
        app_key: '731acc84a67f38fc729f70c9cc608012',
        ingr: food,
      };
      axios
        .get('https://api.edamam.com/api/food-database/parser', { params })
        .then(response => {
          if (response.data.hints[0]) {
            const { hints } = response.data;
            const { nutrients } = hints[0].food;
            console.log(nutrients);

            const {
              ENERC_KCAL: Energy = 0,
              PROCNT: Protein = 0,
              FAT: Fat = 0,
              CHOCDF: Carbs = 0,
              FIBTG: Fiber = 0,
            } = nutrients;

            const nutritionData = {
              Energy,
              Protein,
              Fat,
              Carbs,
              Fiber,
            };

            for (let prop in nutritionData) {
              if (Object.prototype.hasOwnProperty.call(nutritionData, prop)) {
                nutritionData[prop] = nutritionData[prop].toFixed(2);
              }
            }
            resolve(nutritionData);
          } else {
            reject('The input string is not a valid food name');
            console.log('The input string is not a valid food name');
            return;
          }
        });
    } catch (error) {
      console.log('error in retrieveNutrition()');
      reject(error);
    }
  });
};