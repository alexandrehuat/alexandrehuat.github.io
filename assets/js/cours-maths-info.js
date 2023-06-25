const BASE_RATE = 34;
const PLANS = [ // must be in decreasing order of hours
    {hours: 52, rate: 24},
    {hours: 46, rate: 26},
    {hours: 36, rate: 28},
    {hours: 8, rate: 30},
];
const N_FHD = 2; // number of first hours with discount
const EUR_FMTER = new Intl.NumberFormat(document.querySelector("html").lang, {
    style: "currency",
    currency: "EUR",
    trailingZeroDisplay: "stripIfInteger",
});

document.addEventListener("DOMContentLoaded", function () {
    updatePrices(null);

    const hoursInput = document.querySelector("input[name=hours]");
    const firstHoursDiscountInput = document.querySelector("input[name=first-hours-discount]");

    hoursInput.addEventListener("change", function (event) {
        event.target.value = Math.max(0, parseFloat(event.target.value));
        updatePrices(event.target.value, firstHoursDiscountInput.checked);
    });

    firstHoursDiscountInput.addEventListener("change", function (event) {
        updatePrices(hoursInput.value, event.target.checked);
    });
})

function updatePrices(hours, firstHoursDiscount) {
    const totalPriceOutput = document.querySelector("output[name=total-price]");
    const hourlyPriceOutput = document.querySelector("output[name=hourly-price]");

    totalPrice = computeTotalPrice(hours, firstHoursDiscount);
    if (totalPrice === null)
        totalPriceOutput.value = hourlyPriceOutput.value = "N/A";
    else {
        totalPriceOutput.value = EUR_FMTER.format(totalPrice);
        const hourlyPrice = hours > 0 ? totalPrice / hours : 0;
        hourlyPriceOutput.value = EUR_FMTER.format(hourlyPrice);
    }
}

function computeTotalPrice(hours, firstHoursDiscount = true) {
    if (Number.isNaN(hours = parseFloat(hours)))
        return null;

    if (hours < 0)
        return 0;

    if (firstHoursDiscount) {
        const firstHoursPrice = Math.min(N_FHD, hours) * BASE_RATE * (N_FHD - 1) / N_FHD;
        return firstHoursPrice + computeTotalPrice(hours - 2, false);
    }

    for (const plan of PLANS)
        if (hours >= plan.hours) {
            const nPlans = Math.floor(hours / plan.hours);
            const remainingHours = hours % plan.hours;
            const plansPrice = nPlans * plan.hours * plan.rate;
            return plansPrice + computeTotalPrice(remainingHours, false);
        }

    return hours * BASE_RATE;
}