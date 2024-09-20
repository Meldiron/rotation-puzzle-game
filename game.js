const getRandomElementFromArray = array => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

const voiceFiles = {
  flip: [
    'flip'
  ]
}

const handleCardClick = (event, isRightClick) => {
  event.preventDefault()

  const cardClicked = event.composedPath().find(element => (
    [...element.classList].includes('card'))
  )

  if (!cardClicked.disabled) {

    const direction = isRightClick ? -1 : 1;

    const currentRotation = cardClicked.dataset.rotation
    let newRotation = `${Number(currentRotation) + direction}`

    if(newRotation === "4") {
      newRotation = "0"
    }

    if(newRotation === "-1") {
      newRotation = "3"
    }

    let t = document.querySelector('#' + cardClicked.id + " div").style.transform;
    if(!t) {
      t = "rotate(0deg)";
    }

    let n = +(t.split("(")[1].split("deg")[0]);
    n += isRightClick ? -90 : 90;

    let isCorrect = false;
    if(n % 360 === 0) {
      isCorrect = true;
    }

    document.querySelector('#' + cardClicked.id + " div").style.transform = `rotate(${n}deg)`;

    cardClicked.dataset.rotation = newRotation

    const allCards = [...document.querySelectorAll('.card')]
    const isPuzzleComplete = allCards.every(card => ["0", "4"].includes(card.dataset.rotation))
    if (isPuzzleComplete) {
      allCards.forEach(card => {
        card.disabled = true
        card.style.margin = '0px';
      })
      document.getElementById('board').classList.add("finished");
      winAnimation()
    } else {
      if(isCorrect) {
        setTimeout(() => {
          if(document.querySelector('#' + cardClicked.id + " div").style.transform === `rotate(${n}deg)`) {
            console.log("Done");
            cardClicked.disabled = true;
          }
        }, 1000);
      }
    }
  }
}

const setupBoard = (puzzle, size = 4) => {
  const getRandomRotation = () => Math.floor(Math.random() * 3) + 1

  const renderCard = (x, y, data) => {
    let rotation = 0;
    if(data == 0) {
      rotation = 0;
    } else  if(data == 1) {
      rotation = 90;
    } else  if(data == 2) {
      rotation = 180;
    } else  if(data == 3) {
      rotation = 270;
    }

    return `
    <button
      id="if_${x}_${y}"
      class="card"
      data-rotation="${data}"
      style="
        width: ${(80 / size)}vmin;
        height: ${(80 / size)}vmin;
      "
    >
      <div
        class="imageFragment"
        style="
          transform: rotate(${rotation}deg);
          background-image: url('https://cloud.appwrite.io/v1/storage/buckets/images/files/${puzzle}/preview?project=rotation-puzzle-game&project=rotation-puzzle-game&format=webp&width=1720&height=1720&gravity=center');
          background-position: ${y * (100 / (size - 1))}% ${x * (100 / (size - 1))}%;
          background-size: ${(size) * 100}% ${(size) * 100}%;
        "
      ></div>
    </button>
    `
  }


  const renderRow = children => `
    <div class="row">${children}</div>
  `
  const indices = Array.from(Array(size).keys())
  const boardHTML = indices.map(rowIndex => (
    renderRow(
      indices.map(columnIndex => (
        renderCard(rowIndex, columnIndex, getRandomRotation())
      )).join('')
    )
  )).join('')
  document.getElementById('board').innerHTML = boardHTML
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (event) => handleCardClick(event, false))
    card.addEventListener('contextmenu', (event) => handleCardClick(event, true))
  })
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

/**
 * TEST
 */
const test = "3;66ed80b700341e1eef65";
console.log(btoa(test));

var gameData = atob(urlParams.get('game')).split(";")
console.log(gameData);

setupBoard(gameData[1], +gameData[0])

const winAnimation = () => {
  const confettiSettings = { "target": "confetti", "max": "80", "size": "1", "animate": true, "props": ["circle", "square", "triangle"], "colors": [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]], "clock": "15", "rotate": false, "start_from_edge": false, "respawn": true }
  var confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();
}