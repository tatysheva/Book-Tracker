function main() {
    const $myList = document.querySelector('#my-list');
    let myBooks = JSON.parse(localStorage.getItem('myBooks')) || [];

    $myList.innerHTML = renderBooksList(myBooks);


    function save(myList) {
        localStorage.setItem('$myList', JSON.stringify(myList));
    }

    $myList.addEventListener('click', (event) => {
        if (!event.target.closest('.b-book__remove')) {
            return
        }

        const $book = event.target.closest('.b-book[data-key]')
        const key = $book.getAttribute('data-key');
        myBooks = myBooks.filter(book => book.key !== key);
        localStorage.setItem('myBooks', JSON.stringify(myBooks))
        $myList.innerHTML = renderBooksList(myBooks);

        save(todoList);
    })
}

function renderBooksList(books) {
    return books.map(book => renderBook(book)).join('');
}

function renderBook(book) {
    return `
      <li class="b-book" data-key="${book.key}">
        <div class="b-book__cover" style="background-image: url(http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg);"></div>
        <h4 class="b-book__title">${book.title}</h4>
        ${ book.author_name ? `<div class="b-book__author">${book.author_name.join(', ')}</div>` : ""}
        <button class="b-book__remove">Remove</button>
      </li>
    `
}

document.addEventListener('DOMContentLoaded', main);

