import './style.css'

const body = document.querySelector('body');
const header = document.createElement('header');
header.classList.add('header');
const main = document.createElement('main');
main.classList.add('main');
const startGameBtn = document.createElement('button');
startGameBtn.textContent = 'Старт игры';
const leadersBtn = document.createElement('button');
leadersBtn.textContent = 'Лидеры';
startGameBtn?.addEventListener('click', startGame);
leadersBtn?.addEventListener('click', showLeaders);
body?.appendChild(header);
body?.appendChild(main);
header.appendChild(startGameBtn);
header.appendChild(leadersBtn);


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



let openedCards: HTMLElement[] = []; 
let isLockBoard = false; 



function startGame () {
  openedCards = [];
  isLockBoard = false;

  const cards =[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
  cards.sort(() => Math.random() - 0.5);

  const cells = document.getElementsByClassName('cell');

  for (let i = 0; i < cards.length; i++){
    const cell = cells[i] as HTMLElement;

    cell.removeEventListener('click', showCell);
    cell.addEventListener('click', showCell);

    const img = document.createElement('img');
    img.className = 'img hidden'; 
    img.src = `src/assets/${cards[i]}.png`;

    if (cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }

    cell.appendChild(img);
  }
}

function showLeaders () {
  alert('leaders')
}

function showCell (e: any){
  if (isLockBoard) return; 

  const cell = e.target.closest('.cell');
  if (!cell) return;

  const img = cell.querySelector('img');
  if (!img.classList.contains('hidden')) return;

  if (openedCards.length < 2){
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

  const hiddenCars = document.getElementsByClassName('.hidden');
  if(hiddenCars.length ===0){
    const dialog = document.createElement('dialog');
    body?.appendChild(dialog);
    dialog.textContent = 'Вы выиграли'
  }
}

