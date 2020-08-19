function main() {
    const $searchForm = document.querySelector('#search-form')
    const $searchInput = document.querySelector('#search-input')
    const $booksList = document.querySelector('#books-list')
    const $mainBook = document.querySelector('.b-main-books');

    let booksList = [];
    let myBooks = JSON.parse(localStorage.getItem('myBooks')) || [];
    updateBooksList([
        {key: 'mainBook1', title_suggest: "JavaScript", author_name: ["David Flanagan"], cover_i: 2536428},
        {key: 'mainBook2', title_suggest: "The Road to React", author_name: ["Robin Wieruch"], cover_i: 9383710},
        {key: 'mainBook3', title_suggest: "Nodejs The Right Way Practical Serverside Javascript That Scales", author_name: ["Jim Wilson"], cover_i: 7532473},
        {key: 'mainBook4', title_suggest: "HTML and CSS",author_name: ["Jon Duckett"], cover_i: 7262081},
        {key: 'mainBook5', title_suggest: "Sexy Web Design", author_name: ["Stocks, Elliot Jay"], cover_i: 5550387},
        {key: 'mainBook6', title_suggest: "APIs", author_name: ["Daniel Jacobson", "Dan Woods", "Greg Brail"], cover_i: 7254443}
    ]);

    function loadingSpinner() {
        $booksList.innerHTML = '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
    }

    function updateBooksList(books = booksList) {
        booksList = books;
        $booksList.innerHTML = renderBooksList(books);
    }

    $searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loadingSpinner();
        const response = await searchBook($searchInput.value);
        const books = response.docs.filter(doc => doc.cover_i);
        updateBooksList(books);
    })

    $booksList.addEventListener('click', (event) => {
        if (!event.target.closest('.b-book__add-button')) {
            return;
        }

        const $book = event.target.closest('.b-book[data-key]')
        const key = $book.getAttribute('data-key');
        const book = booksList.find(book => book.key === key);

        saveToMyBooks(book)
    })

    function saveToMyBooks(book) {
        if (!isInMyBooks(book)) {
            myBooks.push(book);
            localStorage.setItem('myBooks', JSON.stringify(myBooks));
            updateBooksList();
        }
    }

    function isInMyBooks(targetBook) {
        return myBooks.some(book => book.key === targetBook.key)
    }

    async function searchBook(query) {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        return response.json();
    }

    function renderBooksList(books) {
        return books.map(book => renderBook(book)).join('');
    }

    function renderBook(book) {
        return `
        <li class="b-book" data-key="${book.key}">
          <div class="b-book__cover" style="background-image: url(http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg);"></div>
          <h4 class="b-book__title">${book.title_suggest}</h4>
          ${ book.author_name ? `<div class="b-book__author">${book.author_name.join(', ')}</div>` : ""}
          ${ isInMyBooks(book) ? `<b style="color: #ff6347">In your list</b>` : `<button class="b-book__add-button">Add to list</button>`}
        </li>
      `
    }

}
document.addEventListener('DOMContentLoaded', main);
