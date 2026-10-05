import './style.css'

const typeOptions = ['halloween','weather', 'flags', 'body'];



const body = document.querySelector('body');
const header = document.createElement('header');
const main = document.createElement('main');
const startGameBtn = document.createElement('button');
const leadersBtn = document.createElement('button');
const typeSelect = document.createElement('select');
const matchedPairsDiv = document.createElement('div');
const movesCountDiv = document.createElement('div');
const dialog = document.createElement('dialog');
body?.appendChild(dialog);
header.classList.add('header');
main.classList.add('main');
startGameBtn.textContent = 'Новая игра';
leadersBtn.textContent = 'Таблица лидеров';
startGameBtn?.addEventListener('click', startGame);
leadersBtn?.addEventListener('click', showLeaders);
typeSelect.addEventListener('change', startGame);
typeSelect.id ='type';
body?.appendChild(header);
body?.appendChild(main);
header.appendChild(startGameBtn);
header.appendChild(leadersBtn);
header.appendChild(typeSelect);
header.appendChild(matchedPairsDiv);
header.appendChild(movesCountDiv);

let results = JSON.parse(localStorage?.getItem('results') || '[]');
let movesCount = 0;
let movesCountPair = 0;
let matchedPairs = 0;

const gameContainer = document.createElement('div');
main.appendChild(gameContainer);
for(let i=0;i<4;i++){
  const row = document.createElement('div');
  row.classList.add('row');
  gameContainer.appendChild(row);

for(let i=0;i<4;i++){
  const cell = document.createElement('div');
  cell.classList.add('cell');
  row.appendChild(cell);
  

}

}

for(let x=0;x<typeOptions.length;x++){
  const option = document.createElement('option');
  option.textContent =`${typeOptions[x]}`;
   option.value =`${typeOptions[x]}`;
  typeSelect.appendChild(option);
  
  

}

let openedCards: HTMLElement[] = []; 
let isLockBoard = false; 



function startGame () {
  openedCards = [];
  isLockBoard = false;
  matchedPairs=0;
  movesCount =0;
  movesCountPair =0;
matchedPairsDiv.textContent ='Найденных пар — 0 из 8';
movesCountDiv.textContent ='Счетчик ходов: 0';
  const cards =[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
  cards.sort(() => Math.random() - 0.5);

  const cells = document.getElementsByClassName('cell');

  for (let i = 0; i < cards.length; i++){
    const cell = cells[i] as HTMLElement;

    cell.removeEventListener('click', showCell);
    cell.addEventListener('click', showCell);

    const img = document.createElement('img');
    img.className = 'img hidden'; 
    img.src = `/assets/${typeSelect.value}/${cards[i]}.png`;

    if (cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }

    cell.appendChild(img);
  }
}

function showLeaders() {
  while (dialog.firstChild) {
    dialog.removeChild(dialog.firstChild);
  };
  dialog.showModal();


  const title = document.createElement('h3');
  title.textContent = 'Таблица лидеров:';
  dialog.appendChild(title);

  if (results.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Пока нет результатов';
    dialog.appendChild(p);
  } else {
    const list = document.createElement('ol');
    results.forEach((res: any) => {
      const li = document.createElement('li');
 
      li.textContent = `Ходов: ${res.moves} (${res.date})`;
      list.appendChild(li);
    });
    dialog.appendChild(list);
  }

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Закрыть';
  closeBtn.addEventListener('click', () => {
    dialog.close(); 
  });
  dialog.appendChild(closeBtn);
}

function showCell (e: any){
  if (isLockBoard) return; 

  const cell = e.target.closest('.cell');
  if (!cell) return;

  const img = cell.querySelector('img');
  if (!img.classList.contains('hidden')) return; 

  movesCount = movesCount + 1;
 
  if (movesCount % 2 === 0) {
    movesCountPair += 1;
  }
  movesCountDiv.textContent = `Счетчик ходов: ${movesCountPair}`;


  if (openedCards.length < 2) {
    openedCards.push(cell);
    img.classList.remove("hidden");
  }

  if (openedCards.length === 2) {
    checkCards();
  }
}

function checkCards (){
  let imgArr: HTMLImageElement[] = [];
  
  openedCards.forEach(el => {
    if (el) {
      const img = el.querySelector('img') as HTMLImageElement; 
      if (img) {
        imgArr.push(img);
      }
    }
  });

  if (imgArr.length === 2) {
    const imgFirst = imgArr[0].src;
    const imgSecond = imgArr[1].src;

    if (imgFirst === imgSecond){
      matchedPairs+=1;
      matchedPairsDiv.textContent =`Найденных пар — ${matchedPairs} из 8`
      openedCards = []; 
    } else {
      isLockBoard = true;
      
      setTimeout(() => {
        imgArr[0].classList.add("hidden");
        imgArr[1].classList.add("hidden");
        
        openedCards = [];
        isLockBoard = false;
      }, 1000);
    }
  }

  if(matchedPairs === 8){
    saveGame();
    while (dialog.firstChild) {
      dialog.removeChild(dialog.firstChild);
    };
    dialog.showModal();
  
    const winText = document.createElement('p');
    winText.textContent = `Вы выиграли! Ходов сделано: ${movesCountPair}`;
    dialog.appendChild(winText);
    const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Закрыть';
  closeBtn.addEventListener('click', () => {
    dialog.close(); 
  });
  dialog.appendChild(closeBtn);
  
  }
}


function saveGame(){
  const formattedDate = new Date().toLocaleDateString('ru-RU');
  results.push({ date: formattedDate, moves: movesCountPair });
  results.sort((a: any, b: any) => a.moves - b.moves);
  results = results.slice(0, 10);
  localStorage.setItem('results', JSON.stringify(results));
}


startGame ();