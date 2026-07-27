// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const moonFilterInput = document.getElementById('moonFilter');
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

let currentApodItems = [];

// Modal elements
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const modalMedia = document.getElementById('modalMedia');
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
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-placeholder';
    
    const playButton = document.createElement('div');
    playButton.className = 'play-button';
    playButton.textContent = '▶';
    
    const videoBadge = document.createElement('div');
    videoBadge.className = 'video-badge';
    videoBadge.textContent = 'VIDEO';
    
    videoContainer.appendChild(playButton);
    videoContainer.appendChild(videoBadge);
    card.appendChild(videoContainer);
  }

  const title = document.createElement('h3');
  title.textContent = apodItem.title;

  const date = document.createElement('p');
  date.className = 'gallery-date';
  date.textContent = apodItem.date;

  card.appendChild(title);
  card.appendChild(date);

  // Add click handler to open modal
  card.addEventListener('click', () => {
    openModal(apodItem);
  });

  return card;
}

function isMoonItem(apodItem) {
  const searchableText = (apodItem.title + ' ' + apodItem.explanation).toLowerCase();
  return searchableText.includes('moon') || searchableText.includes('lunar');
}

function renderGallery(items) {
  const shouldFilterMoon = moonFilterInput.checked;
  const itemsToRender = shouldFilterMoon ? items.filter(isMoonItem) : items;

  if (itemsToRender.length === 0) {
    if (items.length === 0) {
      showMessage('No images found for this date range.');
      return;
    }

    showMessage('No Moon images found in this date range. Try a different range.');
    return;
  }

  gallery.innerHTML = '';
  itemsToRender.forEach((item, index) => {
    const card = createGalleryItem(item);
    card.style.setProperty('--card-delay', index * 90 + 'ms');
    gallery.appendChild(card);
  });
}

function openModal(apodItem) {
  modalTitle.textContent = apodItem.title;
  modalDate.textContent = 'Date: ' + apodItem.date;
  modalExplanation.textContent = apodItem.explanation;
  
  // Clear previous content
  modalMedia.innerHTML = '';
  
  if (apodItem.media_type === 'image') {
    const img = document.createElement('img');
    img.className = 'modal-image';
    img.src = apodItem.url;
    img.alt = apodItem.title;
    modalMedia.appendChild(img);
  } else if (apodItem.media_type === 'video') {
    const videoSection = document.createElement('div');
    videoSection.className = 'modal-video-section';
    
    const videoIcon = document.createElement('div');
    videoIcon.className = 'modal-video-icon';
    videoIcon.textContent = '▶';
    
    const watchButton = document.createElement('a');
    watchButton.href = apodItem.url;
    watchButton.target = '_blank';
    watchButton.rel = 'noopener noreferrer';
    watchButton.className = 'watch-video-button';
    watchButton.textContent = 'Watch on YouTube';
    
    videoSection.appendChild(videoIcon);
    videoSection.appendChild(watchButton);
    modalMedia.appendChild(videoSection);
  }
  
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
    currentApodItems = Array.isArray(data) ? data : [data];

    // Show newest image first.
    currentApodItems.sort((a, b) => b.date.localeCompare(a.date));
    renderGallery(currentApodItems);
  } catch (error) {
    showMessage('Something went wrong while contacting NASA. Please try again.');
    console.error(error);
  }
}

getImagesButton.addEventListener('click', fetchSpaceImagesByDateRange);

moonFilterInput.addEventListener('change', () => {
  if (currentApodItems.length === 0) {
    return;
  }

  renderGallery(currentApodItems);
});

// Modal close listeners
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
