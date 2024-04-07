const DOC_LANG = document.querySelector("html").lang;
const BASE_RATE = 34;
const DISCOUNT_BY_PLAN = {
    // hours: absolute discount
    // must stay in descending hours
    52: 10,
    46: 8,
    36: 6,
    8: 4,
};
const N_FHD = 2; // number of first hours with discount
const MAX_GROUP_SIZE = 4;
const EUR_FMTER = new Intl.NumberFormat(DOC_LANG, {
    style: "currency",
    currency: "EUR",
    trailingZeroDisplay: "stripIfInteger",
});

document.addEventListener("DOMContentLoaded", () => {
    fillPlanRatesTable();
    fillGroupDiscountTable();
    document.querySelector("input[name=base-rate]").value = BASE_RATE;
    updatePrices(null, null, null);

    let hoursInput = document.querySelector("input[name=hours]");
    let firstHoursDiscountInput = document.querySelector("input[name=first-hours-discount]");
    let groupSizeInput = document.querySelector("input[name=group-size]");
    groupSizeInput.max = MAX_GROUP_SIZE;

    for (let [input, min, max] of [[hoursInput, 0, Infinity], [groupSizeInput, 1, MAX_GROUP_SIZE]])
        input.addEventListener("input", event => clipEventTargetValue(event, min, max));
    for (let input of [hoursInput, firstHoursDiscountInput, groupSizeInput])
        input.addEventListener("input", () => {
            let hours = Number(hoursInput.value);
            let groupSize = Number(groupSizeInput.value);
            updatePrices(hours, firstHoursDiscountInput.checked, groupSize);
        });
})

function updatePrices(hours, firstHoursDiscount, groupSize) {
    let totalPriceOutput = document.querySelector("output[name=total-price]");
    let hourlyPriceOutput = document.querySelector("output[name=hourly-price]");

    let totalPrice = computeTotalPrice(hours, firstHoursDiscount, groupSize);
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
    let baseRate = Number(document.querySelector("input[name=base-rate]").value);
    if (groupSize > 1)
        return groupDiscount(groupSize) * computeTotalPrice(hours, firstHoursDiscount, 1);

    if (firstHoursDiscount) {
        let h1 = Math.min(N_FHD, hours) * baseRate * (N_FHD - 1) / N_FHD;
        let h2 = computeTotalPrice(Math.max(0, hours - 2), false, groupSize);
        return h1 + h2;
    }

    for (let [planHours, discount] of Object.entries(DISCOUNT_BY_PLAN))
        if (hours >= planHours) {
            let nPlans = Math.floor(hours / planHours);
            let planRate = Math.max(0, baseRate - discount)
            let plansPrice = nPlans * planHours * planRate;
            let remainingHours = hours % planHours;
            return plansPrice + computeTotalPrice(remainingHours, false, groupSize);
        }

    return hours * baseRate;
}

function fillPlanRatesTable() {
    const baseRate = BASE_RATE;
    let tbody = document.querySelector("table#plan-rates > tbody");
    let trbase = tbody.querySelector("tr.base");
    trbase.querySelector("td.rate").textContent = EUR_FMTER.format(baseRate);
    trbase.querySelectorAll("td.total-price, td.equiv-period").forEach(td => td.textContent = "—");
    tbody.querySelectorAll("tr.pack").forEach(tr => {
        hours = parseInt(tr.id);
        tr.querySelector("td.name").textContent = `Série de ${hours} heures`;
        let rate = baseRate - DISCOUNT_BY_PLAN[hours];
        tr.querySelector("td.rate").textContent = EUR_FMTER.format(rate);
        tr.querySelector("td.total-price").textContent = EUR_FMTER.format(hours * rate);
    });
}

/**
* Calcule le taux de réduction dont bénéficie chaque élève dans un cours de groupe.
* Il s'agit du nombre de liens entre un élève et moi sur le nombre total de liens possibles
* dans un graphe complet de :math:`n` élèves plus moi.
* Autrement dit, il s'agit à mon influence sur le groupe.
*
* @param {number} size - La taille du groupe
* @returns {number} Le taux à multiplier par le tarif initial
*/
function groupDiscount(size) {
    /* Simplification de :
        n / (n + (n-1) + (n-2) + ...)
      = n / ((n + 1) n / 2)
      = 2 / (n + 1) */
    return 2 / (size + 1);
}

/**
* Suppose les colonnes : taille du groupe, taux de réduction, base tarifaire après réduction.
*/
function fillGroupDiscountTable() {
    let tbody = document.querySelector("table#group-discount > tbody");
    let percFmter = new Intl.NumberFormat(DOC_LANG, {style: "percent"});

    for (let size = 2; size <= MAX_GROUP_SIZE; size++) {
        let discount = groupDiscount(size);
        let texts = [
            size,
            percFmter.format(1 - discount),
            EUR_FMTER.format(discount * BASE_RATE),
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
    let value = Number(target.value);
    target.value = Math.min(max, Math.max(min, value));
}