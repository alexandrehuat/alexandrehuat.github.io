const BASE_RATE = 34;
const PLANS = [ // must be in decreasing order of hours
    {hours: 52, rate: 24},
    {hours: 46, rate: 26},
    {hours: 36, rate: 28},
    {hours: 8, rate: 30},
];
const N_FHD = 2; // number of first hours with discount

document.addEventListener("DOMContentLoaded", function () {
    updatePrices(null); // init

    const hours = document.querySelector("input[name=hours]");
    const firstHoursDiscount = document.querySelector("input[name=first-hours-discount]");

    hours.addEventListener("input", function (event) {
        event.target.value = parseInt(event.target.value);
        updatePrices(event.target.values, firstHoursDiscount.checked);
    });

    firstHoursDiscount.addEventListener("input", function (event) {
        updatePrices(hours.values, event.target.checked);
    });

})

function updatePrices(hours, firstHoursDiscount, null_price = "—") {
    const totalPrice = document.querySelector("input[name=total-price]");
    const hourlyPrice = document.querySelector("input[name=hourly-price]");

    tp = computeTotalPrice(hours, firstHoursDiscount);
    if (tp === null)
        totalPrice.value = hourlyPrice.value = null_price
    else {
        totalPrice.value = tp;
        hourlyPrice.value = (tp / hours).toFixed(2);
    }
}

function computeTotalPrice(hours, firstHoursDiscount = true) {
    if (!Number.isInteger(hours))
        return null;

    if (hours < 1)
        return 0;

    if (firstHoursDiscount) {
        const firstHoursPrice = Math.min(N_FHD, hours) * BASE_RATE * (N_FHD - 1) / N_FHD;
        return firstHoursPrice + computeTotalPrice(hours - 2);
    }

    for (const plan of PLANS)
        if (hours >= plan.hours) {
            const nPlans = Math.floor(hours / plan.hours);
            const remainingHours = hours % plan.hours;
            const plansPrice = nPlans * plan.hours * plan.rate;
            return plansPrice + computeTotalPrice(remainingHours);
        }

    return hours * BASE_RATE;
}