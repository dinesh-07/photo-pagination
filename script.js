const loadPage = () => {
  devTest()
}
document.addEventListener('DOMContentLoaded', loadPage)
let currentPage = 1
const numberOfPhotos = 10
const photos = []
const devTest = async () => {
  await fetch('https://jsonplaceholder.typicode.com/photos')
    .then((response) => response.json())
    .then((json) => {
      photos.push(...json)
      displayPhoto(photos.slice(currentPage - 1, currentPage + numberOfPhotos))
      displayNav(photos.length)
    })
}

function displayNav(totalPhotos) {
  const totalPages = totalPhotos
    ? totalPhotos / numberOfPhotos
    : photos.length / numberOfPhotos
  const topNav = document.getElementById('top-pagination')
  displayNavElement(topNav, totalPages)
  const bottomNav = document.getElementById('bottom-pagination')
  displayNavElement(bottomNav, totalPages)
}

function displayNavElement(nav, totalPages) {
  nav.innerHTML = ''
  if (currentPage !== 1) {
    nav.appendChild(createList(false, false, '<<', 'first'))
    nav.appendChild(createList(false, false, '<', 'prev'))
    nav.appendChild(createList(false, false, currentPage - 1, currentPage - 1))
  }
  nav.appendChild(createList(true, false, currentPage, currentPage))

  if (currentPage !== totalPages) {
    if (currentPage + 1 !== totalPages) {
      nav.appendChild(
        createList(false, false, currentPage + 1, currentPage + 1)
      )
    }
    nav.appendChild(createList(false, false, '...', 'no-action'))
    nav.appendChild(createList(false, false, totalPages, totalPages))
    nav.appendChild(createList(false, false, '>', 'next'))
    nav.appendChild(createList(false, false, '>>', 'last'))
  }
}

function getHelpMessage(displayName) {
  let current
  if (isNaN(parseInt(displayName))) {
    if (displayName === '...') return ''
    if (displayName === '>') {
      current = currentPage + 1
    } else if (displayName === '>>') {
      current = photos.length / numberOfPhotos
    } else if (displayName === '<') {
      current = currentPage - 1
    } else if (displayName === '<<') {
      current = 1
    }
  }
  if (!current) {
    current = +displayName
  }
  const start = (current - 1) * numberOfPhotos
  const end = current * numberOfPhotos
  return `${start} - ${end}`
}

function createList(isActive, isDisabled, displayName, id) {
  const pageLink = document.createElement('a')
  pageLink.classList.add('page-link')
  pageLink.innerHTML = displayName
  pageLink.href = '#'

  const pageItem = document.createElement('li')
  pageItem.setAttribute('id', id)
  pageItem.classList.add('page-item')
  pageItem.setAttribute('title', getHelpMessage(displayName))

  if (isActive) {
    pageItem.classList.add('active')
  }
  if (isDisabled) {
    pageItem.classList.add('disabled')
  }
  pageItem.appendChild(pageLink)
  pageItem.addEventListener('click', () => handleSelectPage(id))
  return pageItem
}

function handleSelectPage(id) {
  if (isNaN(parseInt(id))) {
    if (id === 'no-action') return
    if (id === 'next') {
      currentPage++
    } else if (id === 'last') {
      currentPage = photos.length / numberOfPhotos
    } else if (id === 'prev') {
      currentPage--
    } else if (id === 'first') {
      currentPage = 1
    }
  } else {
    currentPage = +id
  }
  displayNav()
  displayPhoto(
    photos.slice(
      (currentPage - 1) * numberOfPhotos,
      currentPage * numberOfPhotos
    )
  )
}

const displayPhoto = (photos) => {
  const photoContainer = document.getElementById('photo-container')
  photoContainer.innerHTML = ''
  for (let i = 0; i < photos.length; i++) {
    photoContainer.appendChild(createPhotoContainer(photos[i]))
  }
}

function createPhotoContainer(photo) {
  const titleElement = document.createElement('p')
  titleElement.innerHTML = photo.title

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  cardBody.appendChild(titleElement)

  const imageElement = document.createElement('img')
  imageElement.src = photo.url
  imageElement.classList.add('card-img-top')
  imageElement.alt = photo.title

  const card = document.createElement('div')
  card.setAttribute('id', photo.id)
  card.classList.add('card')
  card.style.width = '15rem'
  card.appendChild(imageElement)
  card.appendChild(cardBody)
  return card
}
