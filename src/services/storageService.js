// Сервис для синхронизации данных между устройствами через GitHub Gist
// GitHub Gist - бесплатная и надежная альтернатива JSONBin.io
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''; // Токен из переменных окружения
const GIST_ID = import.meta.env.VITE_GIST_ID || ''; // ID Gist из переменных окружения
const GIST_FILENAME = 'wishlist-data.json';

const storageService = {
  async fetchGifts() {
    try {
      console.log('Fetching gifts from GitHub Gist...');
      
      // Если нет токена или ID, используем localStorage
      if (!GITHUB_TOKEN || GITHUB_TOKEN === '' || !GIST_ID || GIST_ID === '') {
        console.warn('GitHub Gist not configured, using localStorage');
        const localGifts = localStorage.getItem('wishlist-gifts');
        const parsed = localGifts ? JSON.parse(localGifts) : [];
        console.log('Loaded from localStorage:', parsed);
        return parsed;
      }

      const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const gist = await response.json();
        const content = gist.files[GIST_FILENAME]?.content;
        const data = content ? JSON.parse(content) : { gifts: [] };
        console.log('Loaded from Gist:', data);
        return data.gifts || [];
      } else {
        console.warn('Failed to fetch from Gist, using localStorage');
        const localGifts = localStorage.getItem('wishlist-gifts');
        const parsed = localGifts ? JSON.parse(localGifts) : [];
        return parsed;
      }
    } catch (error) {
      console.error('Error fetching gifts:', error);
      const localGifts = localStorage.getItem('wishlist-gifts');
      const parsed = localGifts ? JSON.parse(localGifts) : [];
      console.log('Error fallback to localStorage:', parsed);
      return parsed;
    }
  },

  async saveGifts(gifts) {
    try {
      console.log('Saving gifts:', gifts);
      localStorage.setItem('wishlist-gifts', JSON.stringify(gifts));
      console.log('Saved to localStorage');
      
      // Если нет токена или ID, сохраняем только локально
      if (!GITHUB_TOKEN || GITHUB_TOKEN === '' || !GIST_ID || GIST_ID === '') {
        console.warn('GitHub Gist not configured, data saved locally only');
        return false;
      }

      try {
        const currentResponse = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        let currentData = { gifts: [], users: [] };
        if (currentResponse.ok) {
          const gist = await currentResponse.json();
          const content = gist.files[GIST_FILENAME]?.content;
          currentData = content ? JSON.parse(content) : { gifts: [], users: [] };
        }

        const updatedData = {
          ...currentData,
          gifts: gifts
        };

        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            files: {
              [GIST_FILENAME]: {
                content: JSON.stringify(updatedData, null, 2)
              }
            }
          })
        });

        if (response.ok) {
          console.log('Successfully saved to GitHub Gist');
          return true;
        } else {
          console.warn('Failed to save to Gist:', response);
          return false;
        }
      } catch (error) {
        console.warn('Network error when saving to Gist:', error);
        console.log('Data saved locally only');
        return false;
      }
    } catch (error) {
      console.error('Error saving gifts:', error);
      return false;
    }
  }
};

export default storageService;