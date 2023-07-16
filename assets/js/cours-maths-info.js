const DOC_LANG = document.querySelector("html").lang;
const BASE_HOURLY_RATE = 34;
const PLANS = [ // must be in decreasing order of hours
    {hours: 52, rate: 24},
    {hours: 46, rate: 26},
    {hours: 36, rate: 28},
    {hours: 8, rate: 30},
];
const N_FHD = 2; // number of first hours with discount
const MAX_GROUP_SIZE = 4;
const EUR_FMTER = new Intl.NumberFormat(DOC_LANG, {
    style: "currency",
    currency: "EUR",
    trailingZeroDisplay: "stripIfInteger",
});

document.addEventListener("DOMContentLoaded", () => {
    fillGroupDiscountTable();
    updatePrices(null, null, null);

    let hoursInput = document.querySelector("input[name=hours]");
    let firstHoursDiscountInput = document.querySelector("input[name=first-hours-discount]");
    let groupSizeInput = document.querySelector("input[name=group-size]");
    groupSizeInput.max = MAX_GROUP_SIZE

    for (let [input, min, max] of [[hoursInput, 0, Infinity], [groupSizeInput, 1, MAX_GROUP_SIZE]]) {
        input.addEventListener("input", event => clipEventTargetValue(event, min, max));
    }
    for (let input of [hoursInput, firstHoursDiscountInput, groupSizeInput]) {
        input.addEventListener("input", event => {
            updatePrices(hoursInput.value, firstHoursDiscount.checked, groupSize.value);
        });
    }
})

function updatePrices(hours, firstHoursDiscount, groupSize) {
    let totalPriceOutput = document.querySelector("output[name=total-price]");
    let hourlyPriceOutput = document.querySelector("output[name=hourly-price]");

    totalPrice = computeTotalPrice(hours, firstHoursDiscount, groupSize);
    if (totalPrice === null)
        totalPriceOutput.value = hourlyPriceOutput.value = "N/A";
    else {
        totalPriceOutput.value = EUR_FMTER.format(totalPrice);
        let hourlyPrice = hours > 0 ? totalPrice / hours : 0;
        hourlyPriceOutput.value = EUR_FMTER.format(hourlyPrice);
    }
}

/**
* @param {number} hours - Le nombre d'heures de cours. Un réel positif.
*/
function computeTotalPrice(hours, firstHoursDiscount = true, groupSize = 1) {
    if (groupSize > 1):
        return groupDiscount(groupSize) * computeTotalPrice(hours, firstHoursDiscount, 1)

    if (firstHoursDiscount) {
        let firstHoursPrice = Math.min(N_FHD, hours) * BASE_HOURLY_RATE * (N_FHD - 1) / N_FHD;
        return firstHoursPrice + computeTotalPrice(hours - 2, false, groupSize);
    }

    for (let plan of PLANS)
        if (hours >= plan.hours) {
            let nPlans = Math.floor(hours / plan.hours);
            let remainingHours = hours % plan.hours;
            let plansPrice = nPlans * plan.hours * plan.rate;
            return plansPrice + computeTotalPrice(remainingHours, false, groupSize);
        }

    return hours * BASE_HOURLY_RATE;
}

/**
* Calcule le taux de réduction dont bénéficie chaque élève dans un cours de groupe.
* Le taux correspond à la proportion de liens entre un élève et moi parmi le nombre total de liens possibles
* dans un graphe complet symbolisant les élèves et moi.
* Autrement dit, en quelques sortes, il s'agit à mon influence sur le groupe.
* L'idée est que les liens entre les élèves perturbe la prestation.
* Je ne peux alors être rémunéré à 100% pour chaque élève.
*
* @param {number} size - La taille du groupe. Un entier supérieur à 1.
* @returns {number} Le taux à multiplier par le tarif initial
*/
function groupDiscount(size) {
    /* Simplification de :
        n / (n + (n-1) + (n-2) + ...)
      = n / ((n + 1) n / 2)
      = 2 / (n + 1) */
    return 2 / (size + 1)
}

/**
* Suppose les colonnes : taille du groupe, taux de réduction, base tarifaire après réduction.
*/
function fillGroupDiscountTable() {
    let tbody = document.querySelector("table.group-discount > tbody");
    let perc_fmter = new Intl.NumberFormat(DOC_LANG, {style: "percent"});

    for (let size = 2; size <= MAX_GROUP_SIZE; i++) {
        let discount = groupDiscount(size);
        let texts = [
            size,
            perc_fmter.format(1 - discount),
            EUR_FMTER.format(discount * BASE_HOURLY_RATE),
        ];

        let tr = document.createElement("tr");
        texts.forEach(text => tr.appendChild(createElementWithText("td", text)));
        tbody.appendChild(tr);
    }
}

function createElementWithText(tagName, text) {
    let element = document.createElement(tagName);
    let textNode = document.createTextNode(text);
    element.appendChild(textNode);
    return element;
}

function clipEventTargetValue(event, min = -Infinity, max = Infinity) {
    let target = event.target;
    let value = parseInt(target.value);
    target.value = Math.min(max, Math.max(min, value));
}