function updateViewCount() {
    fetch('http://yourapi.com/view-counter')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const viewElement = document.getElementById("aws-views");
            if (viewElement) {
                viewElement.innerText = data.viewCount + " views";
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

window.onload = updateViewCount; 