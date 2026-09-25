
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const dateError = document.getElementById("date-error");

function getToday() {
  return TodoUtils.getLocalDateString(new Date());
}

function updateDateMinimum() {
  dueDateInput.min = getToday();
}

function clearDateError() {
  dateError.hidden = true;
  dateError.textContent = "";
  dueDateInput.removeAttribute("aria-invalid");
}

function showDateError(message) {
  dateError.textContent = message;
  dateError.hidden = false;
  dueDateInput.setAttribute("aria-invalid", "true");
}

function updateEmptyMessage() {
  emptyMessage.hidden = taskList.childElementCount > 0;
}

function createTask(text, dueDate) {
  const item = document.createElement("li");
  item.className = "task-item";

  const label = document.createElement("label");
  label.className = "task-label";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";

  const content = document.createElement("span");
  content.className = "task-content";

  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = text;

  const dueDateText = document.createElement("time");
  dueDateText.className = "task-due-date";
  dueDateText.dateTime = dueDate;
  dueDateText.textContent = `期限日: ${TodoUtils.formatDueDate(dueDate)}`;

  if (dueDate === getToday()) {
    item.classList.add("is-due-today");
  }

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "削除";
  deleteButton.setAttribute("aria-label", `「${text}」を削除`);

  content.append(taskText, dueDateText);
  label.append(checkbox, content);
  item.append(label, deleteButton);
  return item;
}

updateDateMinimum();
dueDateInput.value = getToday();

dueDateInput.addEventListener("input", clearDateError);
dueDateInput.addEventListener("invalid", () => {
  updateDateMinimum();
  const message = TodoUtils.getDueDateError(dueDateInput.value, getToday());
  showDateError(message || "有効な期限日を入力してください。");
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateDateMinimum();

  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const dueDateError = TodoUtils.getDueDateError(dueDate, getToday());

  clearDateError();

  if (dueDateError) {
    showDateError(dueDateError);
    dueDateInput.focus();
    return;
  }

  if (!text) {
    return;
  }

  taskList.appendChild(createTask(text, dueDate));
  taskInput.value = "";
  dueDateInput.value = getToday();
  taskInput.focus();
  updateEmptyMessage();
});

taskList.addEventListener("change", (event) => {
  if (
    event.target instanceof HTMLInputElement &&
    event.target.matches(".task-checkbox")
  ) {
    const item = event.target.closest(".task-item");
    item?.classList.toggle("is-completed", event.target.checked);
  }
});

taskList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const deleteButton = event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  deleteButton.closest(".task-item")?.remove();
  updateEmptyMessage();
});
