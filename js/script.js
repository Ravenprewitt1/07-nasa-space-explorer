// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// Modal elements
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

// Use NASA's demo key for classroom projects.
// You can replace this with your own API key from https://api.nasa.gov/
const API_KEY = 'mZkCobXxsDgQm4oNWID8idj6Zsg8vTp1Hu0ztawa';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

function showMessage(message) {
  gallery.innerHTML = '';

  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  
  if (message === 'Loading space images...') {
    placeholder.classList.add('loading');
  }

  const icon = document.createElement('div');
  icon.className = 'placeholder-icon';
  icon.textContent = message === 'Loading space images...' ? '⏳' : '🔭';

  const text = document.createElement('p');
  text.textContent = message;

  placeholder.appendChild(icon);
  placeholder.appendChild(text);
  gallery.appendChild(placeholder);
}

function createGalleryItem(apodItem) {
  const card = document.createElement('article');
  card.className = 'gallery-item';
  card.style.cursor = 'pointer';

  if (apodItem.media_type === 'image') {
    const image = document.createElement('img');
    image.src = apodItem.url;
    image.alt = apodItem.title;
    card.appendChild(image);
  } else if (apodItem.media_type === 'video') {
    const videoLink = document.createElement('a');
    videoLink.href = apodItem.url;
    videoLink.target = '_blank';
    videoLink.rel = 'noopener noreferrer';
    videoLink.textContent = 'Watch video: ' + apodItem.title;
    card.appendChild(videoLink);
  }

  const title = document.createElement('h3');
  title.textContent = apodItem.title + ' (' + apodItem.date + ')';

  const description = document.createElement('p');
  description.textContent = apodItem.explanation;

  card.appendChild(title);
  card.appendChild(description);

  // Add click handler to open modal
  card.addEventListener('click', () => {
    openModal(apodItem);
  });

  return card;
}

function openModal(apodItem) {
  modalImage.src = apodItem.url;
  modalImage.alt = apodItem.title;
  modalTitle.textContent = apodItem.title;
  modalDate.textContent = 'Date: ' + apodItem.date;
  modalExplanation.textContent = apodItem.explanation;
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
}

async function fetchSpaceImagesByDateRange() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    showMessage('Please choose both start and end dates.');
    return;
  }

  if (startDate > endDate) {
    showMessage('Start date must be before or the same as end date.');
    return;
  }

  showMessage('Loading space images...');

  const url =
    APOD_URL +
    '?api_key=' + API_KEY +
    '&start_date=' + startDate +
    '&end_date=' + endDate;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('NASA API request failed with status ' + response.status);
    }

    const data = await response.json();
    const apodItems = Array.isArray(data) ? data : [data];

    if (apodItems.length === 0) {
      showMessage('No images found for this date range.');
      return;
    }

    // Show newest image first.
    apodItems.sort((a, b) => b.date.localeCompare(a.date));

    gallery.innerHTML = '';
    apodItems.forEach((item) => {
      const card = createGalleryItem(item);
      gallery.appendChild(card);
    });
  } catch (error) {
    showMessage('Something went wrong while contacting NASA. Please try again.');
    console.error(error);
  }
}

getImagesButton.addEventListener('click', fetchSpaceImagesByDateRange);

// Modal close listeners
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
