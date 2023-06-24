document.addEventListener("DOMContentLoaded", createNavList)

function createNavList() {
    const navList = document.getElementById("nav-list");
    document.querySelectorAll("h1").forEach(function (item) {
        const li = document.createElement("li");
        const faIcon = document.createElement("i")
        const a = document.createElement("a");
        for (const cls of ["fa-solid", "fa-caret-right", "icon"])
            faIcon.classList.add(cls);
        li.appendChild(faIcon)
        a.href = "#" + item.id;
        const text = document.createTextNode(item.textContent);
        a.appendChild(text);
        li.appendChild(a);
        navList.appendChild(li);
    });
}