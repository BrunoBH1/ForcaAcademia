const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');
const toast = document.getElementById('toast');

function showToast(message) {
	toast.textContent = message;
	toast.classList.add('visible');
	window.clearTimeout(showToast.timer);
	showToast.timer = window.setTimeout(() => toast.classList.remove('visible'), 3000);
}

document.getElementById('loginForm').addEventListener('submit', (event) => {
	event.preventDefault();
	loginScreen.style.display = 'none';
	appShell.classList.add('visible');
	window.scrollTo(0, 0);
});

document.getElementById('logoutButton').addEventListener('click', () => {
	appShell.classList.remove('visible');
	loginScreen.style.display = '';
});

document.getElementById('showPassword').addEventListener('click', (event) => {
	const password = document.getElementById('password');
	password.type = password.type === 'password' ? 'text' : 'password';
	event.currentTarget.textContent = password.type === 'password' ? '◉' : '◌';
});

const monthLabel = document.getElementById('monthLabel');
const calendarGrid = document.getElementById('calendarGrid');
let calendarDate = new Date(2024, 8, 1);
const completedDays = [2, 4, 6, 9, 11, 13, 16, 17];
const plannedDays = [19, 20, 23, 25, 27, 30];

function renderCalendar() {
	const month = calendarDate.getMonth();
	const year = calendarDate.getFullYear();
	const monthName = calendarDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
	monthLabel.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
	const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const previousDays = new Date(year, month, 0).getDate();
	calendarGrid.innerHTML = '';
	for (let index = firstDay - 1; index >= 0; index -= 1) {
		const day = document.createElement('span');
		day.className = 'calendar-day muted-day';
		day.textContent = previousDays - index;
		calendarGrid.append(day);
	}
	for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
		const day = document.createElement('button');
		day.className = 'calendar-day';
		day.textContent = dayNumber;
		if (year === 2024 && month === 8 && dayNumber === 18) day.classList.add('today');
		if (year === 2024 && month === 8 && completedDays.includes(dayNumber)) day.classList.add('done');
		if (year === 2024 && month === 8 && plannedDays.includes(dayNumber)) day.classList.add('planned');
		day.addEventListener('click', () => showToast(`Treino agendado para ${dayNumber} de ${monthName}.`));
		calendarGrid.append(day);
	}
}
document.getElementById('prevMonth').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(); });
document.getElementById('nextMonth').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(); });
renderCalendar();

const habitData = JSON.parse(localStorage.getItem('forjaHabits') || '{}');
let selectedHabitDate = '2024-09-18';
const workoutData = [{ date: '2024-09-18', name: 'Upper Body · Força', exercises: ['Supino reto com barra', 'Desenvolvimento militar', 'Tríceps na polia'] }, { date: '2024-09-20', name: 'Lower Body · Força', exercises: ['Agachamento livre', 'Leg press 45°', 'Mesa flexora'] }];

function openModal(id) { const modal = document.getElementById(id); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
function closeModal(id) { const modal = document.getElementById(id); modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.close)));
document.querySelectorAll('.modal-layer').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal.id); }));

function habitKey(date, name) { return `${date}|${name}`; }
function renderHabitDays() {
	const days = document.getElementById('habitDays');
	days.innerHTML = '';
	for (let day = 1; day <= 30; day += 1) {
		const date = `2024-09-${String(day).padStart(2, '0')}`;
		const button = document.createElement('button');
		button.className = date === selectedHabitDate ? 'active' : '';
		button.innerHTML = `<strong>${day}</strong>SET`;
		button.addEventListener('click', () => { selectedHabitDate = date; renderHabitDays(); renderModalHabits(); });
		days.append(button);
	}
}
function renderModalHabits() {
	const list = document.getElementById('modalHabitList');
	document.getElementById('habitDateTitle').textContent = `Hábitos de ${selectedHabitDate.split('-')[2]}/09`;
	const habits = habitData[selectedHabitDate] || ['Beber 3L de água', 'Dormir 8 horas', 'Alongar por 10 min'];
	list.innerHTML = '';
	habits.forEach((name) => {
		const item = document.createElement('label'); item.className = 'habit-item';
		const checked = localStorage.getItem(habitKey(selectedHabitDate, name)) === 'true';
		item.innerHTML = `<input type="checkbox" ${checked ? 'checked' : ''}><span class="custom-check">✓</span><span>${name}</span><b>dia ${selectedHabitDate.split('-')[2]}</b>`;
		item.classList.toggle('checked', checked);
		item.querySelector('input').addEventListener('change', (event) => { item.classList.toggle('checked', event.target.checked); localStorage.setItem(habitKey(selectedHabitDate, name), event.target.checked); renderMainHabits(); });
		list.append(item);
	});
}
function renderMainHabits() {
	const list = document.getElementById('habitList');
	const habits = habitData[selectedHabitDate] || ['Beber 3L de água', 'Dormir 8 horas', 'Alongar por 10 min', 'Sem açúcar'];
	list.innerHTML = '';
	habits.forEach((name) => {
		const item = document.createElement('label'); item.className = 'habit-item';
		const checked = localStorage.getItem(habitKey(selectedHabitDate, name)) === 'true';
		item.innerHTML = `<input type="checkbox" ${checked ? 'checked' : ''}><span class="custom-check">✓</span><span>${name}</span><b>${checked ? '1/1' : '0/1'}</b>`;
		item.classList.toggle('checked', checked);
		item.querySelector('input').addEventListener('change', (event) => { item.classList.toggle('checked', event.target.checked); item.querySelector('b').textContent = event.target.checked ? '1/1' : '0/1'; localStorage.setItem(habitKey(selectedHabitDate, name), event.target.checked); renderEvolutionPie(); });
		list.append(item);
	});
	renderEvolutionPie();
}
let evolutionPeriod = '3months';
function renderEvolutionPie() {
	const chartWrap = document.querySelector('.progress-panel .chart-wrap');
	if (!chartWrap) return;
	const habitItems = [...document.querySelectorAll('#habitList .habit-item')];
	const habitsDone = habitItems.filter((item) => item.querySelector('input').checked).length;
	const periodData = { today: { workout: 92, habitFactor: 1 }, '3days': { workout: 86, habitFactor: .9 }, '3months': { workout: 82, habitFactor: .75 } };
	const selected = periodData[evolutionPeriod] || periodData['3months'];
	const habitScore = habitItems.length ? Math.round((habitsDone / habitItems.length) * 100 * selected.habitFactor) : 0;
	const workoutScore = selected.workout;
	const total = workoutScore + habitScore;
	const workoutDegrees = Math.round((workoutScore / total) * 360);
	const habitDegrees = Math.round((habitScore / total) * 360);
	const average = Math.round((workoutScore + habitScore) / 2);
	chartWrap.innerHTML = `<div class="pie-progress"><div class="pie-chart" style="background:conic-gradient(var(--orange) 0 ${workoutDegrees}deg,var(--green) ${workoutDegrees}deg ${workoutDegrees + habitDegrees}deg,#e8e8e3 ${workoutDegrees + habitDegrees}deg 360deg)"><strong>${average}%</strong><small>EVOLUÇÃO</small></div><div class="pie-legend"><div><i class="workout-dot"></i><span>Treinos</span><strong>${workoutScore}%</strong></div><div><i class="habit-dot"></i><span>Hábitos</span><strong>${habitScore}%</strong></div><div><i class="remaining-dot"></i><span>A completar</span><small>${100 - average}% restante</small></div></div></div>`;
}
document.getElementById('evolutionPeriod').addEventListener('change', (event) => { evolutionPeriod = event.target.value; renderEvolutionPie(); showToast(`Período atualizado: ${event.target.options[event.target.selectedIndex].text}.`); });
function openHabits() { renderHabitDays(); renderModalHabits(); renderMainHabits(); openModal('habitModal'); }
document.getElementById('addHabit').addEventListener('click', openHabits);
document.getElementById('addHabitText').addEventListener('click', openHabits);
document.getElementById('newHabitButton').addEventListener('click', () => {
	const input = document.getElementById('newHabitName'); const name = input.value.trim(); if (!name) { input.focus(); showToast('Digite o nome do hábito primeiro.'); return; }
	if (!habitData[selectedHabitDate]) habitData[selectedHabitDate] = ['Beber 3L de água', 'Dormir 8 horas', 'Alongar por 10 min'];
	habitData[selectedHabitDate].push(name); localStorage.setItem('forjaHabits', JSON.stringify(habitData)); input.value = ''; renderModalHabits(); renderMainHabits(); showToast('Novo hábito adicionado para este dia.');
});
document.getElementById('newHabitName').addEventListener('keydown', (event) => { if (event.key === 'Enter') document.getElementById('newHabitButton').click(); });
renderMainHabits();

function buildEditor() {
	const list = document.getElementById('workoutEditorList'); list.innerHTML = '';
	const current = workoutData[0];
	current.exercises.forEach((exercise, index) => addEditorRow(exercise, index));
}
function addEditorRow(name = '', index = document.querySelectorAll('.editor-row').length) {
	const row = document.createElement('div'); row.className = 'editor-row'; row.innerHTML = `<input value="${name}" aria-label="Exercício ${index + 1}"><input value="3 séries × 10 repetições" aria-label="Séries e repetições"><button class="remove-exercise" aria-label="Remover exercício">×</button>`;
	row.querySelector('.remove-exercise').addEventListener('click', () => row.remove()); document.getElementById('workoutEditorList').append(row);
}
document.getElementById('editWorkout').addEventListener('click', () => { buildEditor(); openModal('workoutModal'); });
document.getElementById('addExercise').addEventListener('click', () => addEditorRow());
document.getElementById('exerciseList').addEventListener('click', (event) => { if (event.target.closest('.edit-exercise')) { buildEditor(); openModal('workoutModal'); } });
document.getElementById('saveWorkout').addEventListener('click', () => {
	const rows = [...document.querySelectorAll('.editor-row')]; const date = document.getElementById('workoutDate').value || '2024-09-18'; const workout = { date, name: document.getElementById('workoutName').value || 'Treino personalizado', exercises: rows.map((row) => row.querySelector('input').value).filter(Boolean) }; const existing = workoutData.findIndex((item) => item.date === date); if (existing >= 0) workoutData[existing] = workout; else workoutData.push(workout);
	document.getElementById('currentWorkoutTitle').textContent = workout.name; document.getElementById('exerciseCount').textContent = workout.exercises.length; document.getElementById('exerciseList').innerHTML = workout.exercises.slice(0, 3).map((exercise, index) => `<div><span class="exercise-number">0${index + 1}</span><strong>${exercise}</strong><small>3 séries × 10 repetições</small><button class="edit-exercise" data-exercise="${exercise}">✎</button></div>`).join(''); closeModal('workoutModal'); showToast(`Treino salvo para ${date.split('-').reverse().join('/')}.`);
});

let selectedWorkout = 0;
document.getElementById('switchWorkout').addEventListener('click', () => { selectedWorkout = (selectedWorkout + 1) % workoutData.length; const workout = workoutData[selectedWorkout]; document.getElementById('currentWorkoutTitle').textContent = workout.name; document.getElementById('exerciseCount').textContent = workout.exercises.length; document.getElementById('exerciseList').innerHTML = workout.exercises.slice(0, 3).map((exercise, index) => `<div><span class="exercise-number">0${index + 1}</span><strong>${exercise}</strong><small>3 séries × 10 repetições</small><button class="edit-exercise" data-exercise="${exercise}">✎</button></div>`).join(''); showToast(`Treino de ${workout.date.split('-').reverse().join('/')} carregado.`); });
document.getElementById('viewPlan').addEventListener('click', () => { document.getElementById('weeklyPlan').innerHTML = workoutData.map((workout) => `<div class="plan-day"><strong>${workout.date.split('-').reverse().join('/')}</strong><span><b>${workout.name}</b><br>${workout.exercises.join(' · ')}</span></div>`).join(''); openModal('planModal'); });

document.getElementById('renewButton').addEventListener('click', () => openModal('renewModal'));
document.querySelectorAll('.payment-tab').forEach((tab) => tab.addEventListener('click', () => { document.querySelectorAll('.payment-tab').forEach((item) => item.classList.remove('active')); tab.classList.add('active'); document.getElementById('pixContent').classList.toggle('hidden', tab.dataset.payment !== 'pix'); document.getElementById('cardContent').classList.toggle('hidden', tab.dataset.payment !== 'card'); }));
document.getElementById('copyPix').addEventListener('click', async () => { await navigator.clipboard?.writeText('forja@treino.com'); showToast('Chave PIX copiada.'); });
document.querySelectorAll('#confirmPayment, #confirmPaymentCard').forEach((button) => button.addEventListener('click', () => { closeModal('renewModal'); showToast('Pagamento enviado. Vamos confirmar sua renovação.'); }));

const savedSettings = JSON.parse(localStorage.getItem('forjaSettings') || '{}');
if (savedSettings.name) document.getElementById('settingsName').value = savedSettings.name;
if (savedSettings.email) document.getElementById('settingsEmail').value = savedSettings.email;
if (typeof savedSettings.notifyWorkout === 'boolean') document.getElementById('notifyWorkout').checked = savedSettings.notifyWorkout;
if (typeof savedSettings.notifyHabit === 'boolean') document.getElementById('notifyHabit').checked = savedSettings.notifyHabit;
if (savedSettings.compactMode) document.getElementById('compactMode').checked = true;
if (savedSettings.compactMode) document.body.classList.add('compact-mode');
document.getElementById('settingsLink').addEventListener('click', (event) => { event.preventDefault(); openModal('settingsModal'); });
document.getElementById('saveSettings').addEventListener('click', () => {
	const settings = { name: document.getElementById('settingsName').value.trim() || 'Mateus Silva', email: document.getElementById('settingsEmail').value.trim(), notifyWorkout: document.getElementById('notifyWorkout').checked, notifyHabit: document.getElementById('notifyHabit').checked, compactMode: document.getElementById('compactMode').checked };
	localStorage.setItem('forjaSettings', JSON.stringify(settings)); document.body.classList.toggle('compact-mode', settings.compactMode); document.querySelectorAll('.user-mini strong,.top-user span').forEach((element) => { element.textContent = settings.name; }); closeModal('settingsModal'); showToast('Configurações salvas.');
});

document.getElementById('openMusic').addEventListener('click', () => openModal('musicModal'));
document.getElementById('dockMusic').addEventListener('click', () => openModal('musicModal'));
document.getElementById('connectSpotify').addEventListener('click', async () => {
	const value = document.getElementById('spotifyUrl').value.trim();
	const match = value.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)(?:\?.*)?$/);
	if (!match) { showToast('Cole um link válido de música, álbum ou playlist do Spotify.'); return; }
	const embedUrl = `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
	const player = document.getElementById('spotifyPlayer');
	player.style.height = '225px';
	player.style.minHeight = '225px';
	player.style.position = 'relative';
	player.innerHTML = '<div style="padding:18px;text-align:center;color:#777;font-size:11px">Carregando capa e informações da música...</div>';
	player.classList.remove('hidden');
	try {
		const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(value)}`);
		const metadata = await response.json();
		const title = metadata.title || 'Música do Spotify';
		const artist = metadata.author_name || 'Spotify';
		const image = metadata.thumbnail_url || '';
		player.innerHTML = `<div class="spotify-track-card" style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:#191919;color:#fff"><img src="${image}" alt="Capa de ${title}" style="width:52px;height:52px;object-fit:cover"><div style="min-width:0;flex:1"><strong style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11px">${title}</strong><span style="display:block;color:#aaa;font-size:9px;margin-top:4px">${artist}</span><div style="height:3px;background:#555;margin-top:9px"><i style="display:block;width:32%;height:100%;background:#1ed760"></i></div><small style="display:block;color:#aaa;margin-top:4px;font-size:8px">Duração e progresso disponíveis no player Spotify</small></div><a href="${value}" target="_blank" rel="noreferrer" style="background:#1ed760;color:#071b0d;padding:8px 10px;font-size:10px;font-weight:800;white-space:nowrap">Abrir no Spotify ↗</a></div><iframe src="${embedUrl}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
	} catch (error) {
		player.innerHTML = `<div style="padding:17px;background:#191919;color:#fff;font-size:11px">Não foi possível carregar a capa neste arquivo local. <a href="${value}" target="_blank" rel="noreferrer" style="color:#1ed760;font-weight:800">Abrir no Spotify ↗</a></div><iframe src="${embedUrl}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
	}
	showToast('Música conectada. Use o play do player para tocar.');
});

let timerInterval;
function formatTime(seconds) { return new Date(seconds * 1000).toISOString().substring(11, 19); }
function updateTimer() { const startedAt = Number(localStorage.getItem('forjaWorkoutStarted')); if (!startedAt) return; document.getElementById('timerDisplay').textContent = formatTime(Math.max(0, Math.floor((Date.now() - startedAt) / 1000))); }
function startTimer() { if (!localStorage.getItem('forjaWorkoutStarted')) localStorage.setItem('forjaWorkoutStarted', Date.now()); document.getElementById('timerDock').classList.remove('hidden'); updateTimer(); clearInterval(timerInterval); timerInterval = setInterval(updateTimer, 1000); showToast('Treino começado com sucesso.'); }
document.getElementById('startWorkout').addEventListener('click', startTimer);
document.getElementById('finishWorkout').addEventListener('click', () => { const elapsed = document.getElementById('timerDisplay').textContent; localStorage.removeItem('forjaWorkoutStarted'); clearInterval(timerInterval); document.getElementById('timerDock').classList.add('hidden'); showToast(`Treino finalizado. Seu tempo foi ${elapsed}.`); });
if (localStorage.getItem('forjaWorkoutStarted')) startTimer();
document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
	const selector = link.getAttribute('href');
	if (selector === '#') { event.preventDefault(); showToast('Esta área ficará disponível em breve.'); return; }
	const target = document.querySelector(selector);
	if (!target) return;
	event.preventDefault();
	target.scrollIntoView({ behavior: 'smooth' });
	document.querySelectorAll('.nav-link').forEach((navLink) => navLink.classList.remove('active'));
	link.classList.add('active');
}));
