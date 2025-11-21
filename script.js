// 1. ARRAY PARA ALMACENAR LIBROS
let myLibrary = [];

// 2. CONSTRUCTOR DE LIBRO
function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    // Generamos un ID único nativo para evitar problemas al borrar
    this.id = crypto.randomUUID(); 
}

// 3. PROTOTIPO PARA CAMBIAR ESTADO LEÍDO
// Se define fuera del constructor para eficiencia de memoria
Book.prototype.toggleRead = function() {
    this.isRead = !this.isRead;
};

// 4. FUNCIÓN PARA AÑADIR AL ARRAY
function addBookToLibrary(title, author, pages, isRead) {
    const newBook = new Book(title, author, pages, isRead);
    myLibrary.push(newBook);
    displayBooks(); // Re-renderizamos la vista
}

// 5. FUNCIÓN PARA ELIMINAR LIBRO
function removeBook(id) {
    // Filtramos el array para dejar todos MENOS el que coincida con el ID
    myLibrary = myLibrary.filter(book => book.id !== id);
    displayBooks();
}

// 6. FUNCIÓN PARA MOSTRAR LIBROS (RENDER)
function displayBooks() {
    const container = document.querySelector('#library-container');
    container.innerHTML = ''; // Limpiamos el contenedor antes de repintar

    myLibrary.forEach(book => {
        // Crear tarjeta
        const card = document.createElement('div');
        card.classList.add('book-card');
        // Usamos el ID como data-attribute para encontrarlo luego
        card.setAttribute('data-id', book.id);

        // Contenido HTML de la tarjeta
        card.innerHTML = `
            <h3>${book.title}</h3>
            <span class="author">por ${book.author}</span>
            <p>${book.pages} páginas</p>
            <div class="card-actions">
                <button class="btn-toggle ${book.isRead ? 'read-true' : 'read-false'}">
                    ${book.isRead ? 'Leído ✅' : 'No leído ❌'}
                </button>
                <button class="btn-danger delete-btn">Eliminar</button>
            </div>
        `;

        // EVENT LISTENER: BOTÓN ELIMINAR
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            removeBook(book.id);
        });

        // EVENT LISTENER: BOTÓN TOGGLE READ
        const toggleBtn = card.querySelector('.btn-toggle');
        toggleBtn.addEventListener('click', () => {
            book.toggleRead(); // Llamamos al método del prototipo
            displayBooks();    // Re-renderizamos para actualizar color/texto
        });

        container.appendChild(card);
    });
}

// 7. MANEJO DEL DIALOG Y FORMULARIO
const dialog = document.querySelector('#book-dialog');
const newBookBtn = document.querySelector('#new-book-btn');
const closeDialogBtn = document.querySelector('#close-dialog-btn');
const bookForm = document.querySelector('#book-form');

// Abrir modal
newBookBtn.addEventListener('click', () => {
    dialog.showModal();
});

// Cerrar modal (botón cancelar)
closeDialogBtn.addEventListener('click', () => {
    dialog.close();
    bookForm.reset(); // Limpiar inputs al cerrar
});

// Enviar formulario
bookForm.addEventListener('submit', (event) => {
    // ¡IMPORTANTE! Evitamos que el formulario envíe datos al servidor
    event.preventDefault();

    // Obtener valores
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const isRead = document.querySelector('#read').checked;

    // Añadir lógica
    addBookToLibrary(title, author, pages, isRead);

    // Cerrar y limpiar
    dialog.close();
    bookForm.reset();
});

// 8. DATOS INICIALES (DUMMY DATA)
// Para que no se vea vacío al principio
addBookToLibrary("El Hobbit", "J.R.R. Tolkien", 295, true);
addBookToLibrary("1984", "George Orwell", 328, false);
