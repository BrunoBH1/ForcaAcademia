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

document.getElementById('startWorkout').addEventListener('click', () => showToast('Treino iniciado. Bom trabalho, Mateus!'));
document.getElementById('editWorkout').addEventListener('click', () => showToast('Modo de edição ativado. Clique no lápis de um exercício.'));
document.querySelectorAll('.edit-exercise').forEach((button) => button.addEventListener('click', () => {
	const newName = window.prompt('Nome do exercício:', button.dataset.exercise);
	if (newName) { button.closest('div').querySelector('strong').textContent = newName; showToast('Exercício atualizado.'); }
}));
document.querySelectorAll('.habit-item input').forEach((input) => input.addEventListener('change', () => {
	input.closest('.habit-item').classList.toggle('checked', input.checked);
	showToast(input.checked ? 'Hábito marcado para hoje.' : 'Hábito desmarcado.');
}));
function addHabit() {
	const name = window.prompt('Qual hábito você quer adicionar?');
	if (!name) return;
	const item = document.createElement('label');
	item.className = 'habit-item';
	item.innerHTML = `<input type="checkbox"><span class="custom-check">✓</span><span>${name}</span><b>0/7</b>`;
	item.querySelector('input').addEventListener('change', (event) => { item.classList.toggle('checked', event.target.checked); });
	document.getElementById('habitList').append(item);
	showToast('Novo hábito adicionado.');
}
document.getElementById('addHabit').addEventListener('click', addHabit);
document.getElementById('addHabitText').addEventListener('click', addHabit);
document.getElementById('renewButton').addEventListener('click', () => showToast('Você será direcionado para o pagamento seguro.'));
document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
	const target = document.querySelector(link.getAttribute('href'));
	if (!target) return;
	event.preventDefault();
	target.scrollIntoView({ behavior: 'smooth' });
	document.querySelectorAll('.nav-link').forEach((navLink) => navLink.classList.remove('active'));
	link.classList.add('active');
}));
