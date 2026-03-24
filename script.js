const API_URL = "http://localhost:3000/students";

// Отримати студентів
async function getStudents() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderStudents(data);
  } catch (error) {
    console.error("Помилка GET:", error);
  }
}

// Відобразити студентів
function renderStudents(students) {
  const tbody = document.querySelector("#students-table tbody");
  tbody.innerHTML = "";

  students.forEach(student => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.course}</td>
      <td>${student.skills.join(", ")}</td>
      <td>${student.email}</td>
      <td>${student.isEnrolled ? "Так" : "Ні"}</td>
      <td>
        <button onclick="updateStudent(${student.id})">Оновити</button>
        <button onclick="deleteStudent(${student.id})">Видалити</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Додати студента
async function addStudent(e) {
  e.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    age: Number(document.getElementById("age").value),
    course: document.getElementById("course").value,
    skills: document.getElementById("skills").value.split(",").map(s => s.trim()),
    email: document.getElementById("email").value,
    isEnrolled: document.getElementById("isEnrolled").checked
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(student)
    });

    getStudents();
    document.getElementById("add-student-form").reset();
  } catch (error) {
    console.error("Помилка POST:", error);
  }
}

// Оновити студента (простий варіант через prompt)
async function updateStudent(id) {
  const newName = prompt("Введіть нове ім'я:");

  if (!newName) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newName })
    });

    getStudents();
  } catch (error) {
    console.error("Помилка PATCH:", error);
  }
}

// Видалити студента
async function deleteStudent(id) {
  if (!confirm("Ви впевнені?")) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    getStudents();
  } catch (error) {
    console.error("Помилка DELETE:", error);
  }
}

// --------------------
// Обробники подій
// --------------------

document
  .getElementById("get-students-btn")
  .addEventListener("click", getStudents);

document
  .getElementById("add-student-form")
  .addEventListener("submit", addStudent);