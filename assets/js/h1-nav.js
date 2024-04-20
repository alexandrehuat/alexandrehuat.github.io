document.addEventListener("DOMContentLoaded", () => {
    let ul = document.querySelector(".h1-nav");
    document.querySelectorAll("section h1").forEach(header => {
        let a = document.createElement("a");
        a.href = "#" + header.id;
        let li = document.createElement("li");
        let i = document.createElement("i");
        i.classList.add("icon");
        li.appendChild(i);
        let text = document.createTextNode(header.textContent);
        li.appendChild(text);
        a.appendChild(li);
        ul.appendChild(a);
    });
});