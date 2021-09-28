const handleResponse = (response) => {
    document.getElementById("content").innerHTML = '';
    for (let i = 0; i < response.items.length; i++) {
    const item = response.items[i];
    // in production code, item.text should have the HTML entities escaped.
    //document.getElementById("content").innerHTML += "<br>" + item.volumeInfo.title;
    fetchOneBook(item.selfLink)
    }
}

const createImage = (source) => {
    const img = document.createElement('img');
    img.src = source;
    return img;
} 

const showBookInfo = (bookData) => {
    const modal = document.getElementById("my-modal");
    const modalContent = document.getElementById("modal-content");
    const modalTitle = document.getElementById("modal-title");
    const modalImg = document.getElementById("modal-img");
    const modalInfo = document.getElementById("modal-info");
    modal.style.display = "block";
    const span = document.getElementsByClassName("close")[0];
    
    modalTitle.innerHTML = bookData.volumeInfo.title;
    if(bookData.volumeInfo.imageLinks.small !== undefined) {
        modalImg.src = bookData.volumeInfo.imageLinks.small;
    } else if(bookData.volumeInfo.imageLinks.thumbnail !== undefined) {
        modalImg.src = bookData.volumeInfo.imageLinks.thumbnail;
    }

    if(modalContent.contains(document.getElementById("modal-button"))) {
        const button = document.getElementById("modal-button");
        modalContent.removeChild(button).remove();
    }

    modalImg.alt = bookData.volumeInfo.title;

    if (bookData.volumeInfo.description !== undefined) {
        modalInfo.innerHTML = bookData.volumeInfo.description;
    }
    
    if (bookData.saleInfo.buyLink !== undefined) {
        const modalButton = document.createElement("button");
        modalButton.onclick = () => {
            window.open(bookData.saleInfo.buyLink, "_blank")
        }
        modalButton.id="modal-button";
        modalButton.innerHTML = "Buy it!";
        console.log(modalButton)
        modalContent.appendChild(modalButton);
    }
    
    console.log(bookData.saleInfo.buyLink)
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
  
  // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}

const fetchOneBook = async (selfLink) => {
        const response = await axios.get(selfLink);
        //document.getElementById("content").innerHTML += "<br>" + response.data.volumeInfo.title;
        const book = document.createElement('article');
        book.classList.add("book-preview");
        book.onclick = (e) => showBookInfo(response.data);
        //book.innerHTML = "<h3>" + response.data.volumeInfo.title + "</h3>";
        const title = document.createElement('h3');
        title.classList.add("book-title");
        title.innerHTML = response.data.volumeInfo.title;
        title.classList.add("title");
        const img = createImage(response.data.volumeInfo.imageLinks.thumbnail);
        book.appendChild(img);
        book.appendChild(title);
        document.getElementById('content').appendChild(book);
    }


const fetchData = async (searchTerm) => {
    const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
        params: {
            apikey: "AIzaSyBWH9bei0wBFo9VUKp2FZ0fhP6D69fSsk4",
            q: searchTerm
        }
    });
    //fetchOneBook(response.data.items[0].selfLink);
    handleResponse(response.data);
}


const input = document.querySelector("input");
input.addEventListener("input", event => {
    event.preventDefault();
    fetchData(event.target.value);
});

//fetchData();
