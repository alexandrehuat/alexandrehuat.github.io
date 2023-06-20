const BASE_RATE = 34;
const PLANS = [ // must be in decreasing order of hours
    {hours: 52, rate: 24},
    {hours: 46, rate: 26},
    {hours: 36, rate: 28},
    {hours: 8, rate: 30},
];
const N_FHD = 2; // number of first hours with discount

document.addEventListener("DOMContentLoaded", function () {
    const hours = document.getElementById("calc-hours");
    const price = document.getElementById("calc-price");
    const firstHoursDiscount = document.getElementById("calc-first-hours-discount");
    hours.addEventListener("input", function (event) {
        event.target.value = parseInt(event.target.value);
        price.value = computePrice(hours.value, firstHoursDiscount.checked);
    });
    firstHoursDiscount.addEventListener("input", function (event) {
        price.value = computePrice(hours.value, firstHoursDiscount.checked);
    });
})

function computePrice(hours, firstHoursDiscount = false) {
    if (hours < 1)
        return 0;
    if (firstHoursDiscount) {
        const firstHoursPrice = Math.min(N_FHD, hours) * BASE_RATE * (N_FHD - 1) / N_FHD;
        return firstHoursPrice + computePrice(hours - 2);
    }
    for (const plan of PLANS)
        if (hours >= plan.hours) {
            const nPlans = Math.floor(hours / plan.hours);
            const remainingHours = hours % plan.hours;
            const plansPrice = nPlans * plan.hours * plan.rate;
            return plansPrice + computePrice(remainingHours);
        }
    return hours * BASE_RATE;
}