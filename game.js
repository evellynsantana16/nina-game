const defaultState = {
  hunger: 78,
  hygiene: 70,
  energy: 82,
  fun: 75,
  love: 88,
  coins: 250,
  xp: 0,
  level: 1,
  owned: [],
  lastReward: null
};

let state = loadState();
let toastTimer;

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem("ninaGame") || "{}") };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem("ninaGame", JSON.stringify(state));
  renderState();
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function speak(message, effect = "happy") {
  const speech = document.querySelector("#speech");
  const cat = document.querySelector("#ninaCat");
  if (speech) speech.textContent = message;
  if (cat) {
    cat.classList.remove("happy", "sleepy", "clean");
    void cat.offsetWidth;
    cat.classList.add(effect);
    setTimeout(() => cat.classList.remove(effect), 1000);
  }
}

function gainXp(amount) {
  state.xp += amount;
  while (state.xp >= 100) {
    state.xp -= 100;
    state.level += 1;
    state.coins += 100;
    showToast(`Nível ${state.level}! Você ganhou 100 moedas.`);
  }
}

function renderState() {
  ["hunger", "hygiene", "energy", "fun", "love"].forEach(key => {
    document.querySelectorAll(`[data-value="${key}"]`).forEach(el => el.textContent = `${Math.round(state[key])}%`);
    document.querySelectorAll(`[data-bar="${key}"]`).forEach(el => el.style.width = `${state[key]}%`);
  });

  document.querySelectorAll("[data-coins]").forEach(el => el.textContent = state.coins);
  document.querySelectorAll("[data-level]").forEach(el => el.textContent = state.level);
  document.querySelectorAll("[data-xp]").forEach(el => el.textContent = state.xp);
  document.querySelectorAll("[data-xp-bar]").forEach(el => el.style.width = `${state.xp}%`);

  const avg = (state.hunger + state.hygiene + state.energy + state.fun + state.love) / 5;
  const mood = avg > 75 ? "Feliz 😺" : avg > 50 ? "Bem 🙂" : avg > 30 ? "Triste 😿" : "Precisando de você 🙀";
  document.querySelectorAll("[data-mood]").forEach(el => el.textContent = mood);

  const owned = document.querySelector("#ownedItems");
  if (owned) {
    owned.innerHTML = state.owned.length
      ? state.owned.map(item => `<span class="owned-pill">${item}</span>`).join("")
      : "<p>Você ainda não comprou nenhum item.</p>";
  }
}

document.querySelectorAll("[data-action]").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const actions = {
      feed() {
        state.hunger = clamp(state.hunger + 16);
        state.energy = clamp(state.energy + 3);
        speak("Nhac! Que delícia! 🐟");
      },
      clean() {
        state.hygiene = clamp(state.hygiene + 18);
        speak("Estou brilhando! ✨", "clean");
      },
      sleep() {
        state.energy = clamp(state.energy + 20);
        state.hunger = clamp(state.hunger - 5);
        speak("Zzz... 😴", "sleepy");
      },
      play() {
        if (state.energy < 10) return showToast("A Nina está cansada demais.");
        state.fun = clamp(state.fun + 20);
        state.energy = clamp(state.energy - 8);
        state.coins += 4;
        speak("Amei brincar! 🧶");
      },
      pet() {
        state.love = clamp(state.love + 12);
        speak("Prrrr... 💗");
      }
    };
    actions[action]?.();
    gainXp(8);
    saveState();
  });
});

document.querySelector("#ninaCat")?.addEventListener("click", () => {
  state.love = clamp(state.love + 3);
  gainXp(2);
  speak("Miau! Mais carinho! 💕");
  saveState();
});

document.querySelector("#dailyReward")?.addEventListener("click", () => {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastReward === today) return showToast("Você já recebeu a recompensa de hoje.");
  state.lastReward = today;
  state.coins += 50;
  showToast("Você ganhou 50 moedas!");
  saveState();
});

document.querySelectorAll(".food-item").forEach(button => {
  button.addEventListener("click", () => {
    const price = Number(button.dataset.price);
    const points = Number(button.dataset.points);
    const food = button.dataset.food;
    if (state.coins < price) return showToast("Moedas insuficientes.");
    state.coins -= price;
    state.hunger = clamp(state.hunger + points);
    gainXp(10);
    speak(`${food}! Minha favorita! 😻`);
    saveState();
  });
});

document.querySelector("#sleepButton")?.addEventListener("click", () => {
  const scene = document.querySelector("#bedroomScene");
  const message = document.querySelector("#sleepMessage");
  scene?.classList.toggle("night");
  const sleeping = scene?.classList.contains("night");
  if (sleeping) {
    state.energy = clamp(state.energy + 35);
    state.hunger = clamp(state.hunger - 8);
    gainXp(10);
    if (message) message.textContent = "Shhh... A Nina está dormindo.";
    speak("Zzz... 🌙", "sleepy");
  } else if (message) {
    message.textContent = "A Nina acordou cheia de energia!";
    speak("Bom dia! 😺");
  }
  saveState();
});

let bath = 0;
document.querySelector("#spongeButton")?.addEventListener("click", () => {
  bath = Math.min(100, bath + 20);
  const fill = document.querySelector("#bathFill");
  const message = document.querySelector("#bathMessage");
  if (fill) fill.style.width = `${bath}%`;
  speak("Miau... 🫧", "clean");
  if (bath >= 100) {
    state.hygiene = 100;
    state.love = clamp(state.love + 5);
    gainXp(15);
    if (message) message.textContent = "Banho completo! A Nina está cheirosa.";
    showToast("Banho concluído!");
    bath = 0;
    setTimeout(() => { if (fill) fill.style.width = "0%"; }, 900);
    saveState();
  } else if (message) {
    message.textContent = `Limpeza: ${bath}%`;
  }
});

document.querySelectorAll(".buy-item").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.dataset.item;
    const price = Number(button.dataset.price);
    if (state.owned.includes(item)) return showToast("Você já possui este item.");
    if (state.coins < price) return showToast("Moedas insuficientes.");
    state.coins -= price;
    state.owned.push(item);
    state.love = clamp(state.love + 3);
    gainXp(8);
    showToast(`${item} comprado!`);
    saveState();
  });
});

const startGame = document.querySelector("#startGame");
const target = document.querySelector("#mouseTarget");
const field = document.querySelector("#mouseField");
let gameInterval;
let timeLeft = 20;
let score = 0;

function moveMouse() {
  if (!target || !field) return;
  const maxX = Math.max(0, field.clientWidth - 70);
  const maxY = Math.max(0, field.clientHeight - 70);
  target.style.left = `${Math.random() * maxX}px`;
  target.style.top = `${Math.random() * maxY}px`;
}

startGame?.addEventListener("click", () => {
  timeLeft = 20;
  score = 0;
  document.querySelector("#gameOverlay")?.classList.add("hidden");
  target.style.display = "block";
  moveMouse();
  document.querySelector("#gameTime").textContent = timeLeft;
  document.querySelector("#gameScore").textContent = score;
  document.querySelector("#gamePrize").textContent = 0;

  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    timeLeft--;
    document.querySelector("#gameTime").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      target.style.display = "none";
      const prize = score * 3;
      state.coins += prize;
      state.fun = clamp(state.fun + Math.min(30, score));
      state.energy = clamp(state.energy - 10);
      gainXp(Math.min(30, score * 2));
      document.querySelector("#gamePrize").textContent = prize;
      const overlay = document.querySelector("#gameOverlay");
      overlay?.classList.remove("hidden");
      if (overlay) overlay.querySelector("h2").textContent = `Fim! ${score} ratinhos`;
      if (startGame) startGame.textContent = "Jogar novamente";
      showToast(`Você ganhou ${prize} moedas!`);
      saveState();
    }
  }, 1000);
});

target?.addEventListener("click", () => {
  score++;
  document.querySelector("#gameScore").textContent = score;
  moveMouse();
});

setInterval(() => {
  state.hunger = clamp(state.hunger - 1);
  state.hygiene = clamp(state.hygiene - 0.6);
  state.energy = clamp(state.energy - 0.5);
  state.fun = clamp(state.fun - 0.7);
  saveState();
}, 60000);

renderState();


// Marca a aba atual
const currentPage = document.body.dataset.page;
document.querySelectorAll('[data-route]').forEach(link => {
  if (link.dataset.route === currentPage) {
    link.style.background = 'var(--pink)';
    link.style.color = '#fff';
  }
});

// O jogo salva o progresso no localStorage.
// Service Worker removido para evitar conflitos na Vercel.
