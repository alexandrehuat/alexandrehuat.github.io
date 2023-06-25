document.addEventListener("DOMContentLoaded", createHeaderNavList)

function createHeaderNavList() {
    const ul = document.createElement("ul");
    document.querySelectorAll("h1").forEach(function (header) {
        const a = document.createElement("a");
        const li = document.createElement("li");
        const faIcon = document.createElement("i");

        a.href = "#" + header.id;
        faIcon.classList.add("icon");
        const text = document.createTextNode(header.textContent);

        const [inner, outer] = [li, a];
        inner.appendChild(faIcon)
        inner.appendChild(text);
        outer.appendChild(inner);

        ul.appendChild(outer);
    });
    document.querySelector("header nav").appendChild(ul);
}