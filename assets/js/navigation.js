document.addEventListener("DOMContentLoaded", createNavList)

function createNavList() {
    const navList = document.getElementById("nav-list");
    document.querySelectorAll("h1").forEach(function (item) {
        const li = document.createElement("li");
        li.classList.add("nav-item");
        const text = document.createTextNode(item.textContent);
        li.appendChild(text);
        const a = document.createElement("a");
        a.href = "#" + item.id;
        a.appendChild(li);
        navList.appendChild(a);
    });
}