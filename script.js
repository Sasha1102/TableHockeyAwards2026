let currentLang = 'en';
let currentNominationID = '';

// КАНДИДАТЫ: добавь сюда своих игроков и фото
const candidates = {
    men: [
        { name: "Edgars Caics", img: "img/p1.jpg" },
        { name: "Rainers Kalnins", img: "img/p2.jpg" },
        { name: "Oscar Henriksson", img: "img/p3.jpg" }
    ],
    women: [
        { name: "Krista Annija Lagzdina", img: "img/wp1.jpg" },
        { name: "Maria Savelieva", img: "img/wp2.jpg" }
    ],
    // Если категория пустая, код подтянет "men" как пример
};

function init() {
    renderNominations();
}

function renderNominations() {
    const grid = document.getElementById('nomGrid');
    grid.innerHTML = '';
    
    Object.keys(i18n[currentLang].cats).forEach(key => {
        const cat = i18n[currentLang].cats[key];
        const card = document.createElement('div');
        card.className = 'nom-card';
        card.innerHTML = `<h3>${cat.t}</h3>`;
        card.onclick = () => openModal(key);
        grid.appendChild(card);
    });
}

function openModal(key) {
    currentNominationID = key;
    const cat = i18n[currentLang].cats[key];
    document.getElementById('modalTitle').innerText = cat.t;
    document.getElementById('modalDesc').innerText = cat.d;
    
    const cGrid = document.getElementById('candidatesGrid');
    cGrid.innerHTML = '';
    
    const list = candidates[key] || candidates['men']; 
    
    list.forEach(p => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <img src="${p.img}" class="player-img" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200x200?text=No+Photo'">
            <h4>${p.name}</h4>
            <button class="vote-btn" onclick="submitVote('${p.name}')">${i18n[currentLang].voteText}</button>
        `;
        cGrid.appendChild(card);
    });
    
    document.getElementById('voteModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('voteModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// СОХРАНЕНИЕ В FIREBASE
function submitVote(playerName) {
    if (!window.firebaseDB) {
        alert("Database not connected! Check your Firebase Config in index.html");
        return;
    }

    const nominationTitle = i18n['en'].cats[currentNominationID].t; 
    const votesRef = window.dbRef(window.firebaseDB, 'votes');
    const newVoteRef = window.dbPush(votesRef);

    window.dbSet(newVoteRef, {
        nomination: nominationTitle,
        player: playerName,
        votedAt: new Date().toLocaleString(),
        language: currentLang
    })
    .then(() => {
        alert("✅ Success! Your vote for " + playerName + " has been recorded.");
        closeModal();
    })
    .catch((err) => {
        console.error(err);
        alert("❌ Error: " + err.message);
    });
}

function changeLanguage(lang) {
    currentLang = lang;
    document.getElementById('mainTitle').innerText = i18n[lang].mainTitle;
    document.getElementById('btnStart').innerText = i18n[lang].btnStart;
    document.getElementById('nomTitle').innerText = i18n[lang].nomTitle;
    renderNominations();
}

window.onclick = (e) => { if(e.target == document.getElementById('voteModal')) closeModal(); }

init();