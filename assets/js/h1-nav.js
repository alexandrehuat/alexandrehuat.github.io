document.addEventListener("DOMContentLoaded", () => {
    let ul = document.querySelector("ul.h1-nav");
    document.querySelectorAll("h1").forEach(header => {
        let li = document.createElement("li");
        let text = document.createTextNode(header.textContent);
        li.appendChild(text);

        let a = document.createElement("a");
        a.href = "#" + header.id;
        a.appendChild(li);

        ul.appendChild(a);
    });
});