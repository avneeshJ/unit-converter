// Unit definitions
const units = {
    length: {
        meter: {
            name: "Meter",
            symbol: "m",
            factor: 1
        },
        kilometer: {
            name: "Kilometer",
            symbol: "km",
            factor: 1000
        },
        centimeter: {
            name: "Centimeter",
            symbol: "cm",
            factor: 0.01
        },
        millimeter: {
            name: "Millimeter",
            symbol: "mm",
            factor: 0.001
        },
        mile: {
            name: "Mile",
            symbol: "mi",
            factor: 1609.344
        },
        yard: {
            name: "Yard",
            symbol: "yd",
            factor: 0.9144
        },
        foot: {
            name: "Foot",
            symbol: "ft",
            factor: 0.3048
        },
        inch: {
            name: "Inch",
            symbol: "in",
            factor: 0.0254
        }
    },

    weight: {
        kilogram: {
            name: "Kilogram",
            symbol: "kg",
            factor: 1
        },
        gram: {
            name: "Gram",
            symbol: "g",
            factor: 0.001
        },
        milligram: {
            name: "Milligram",
            symbol: "mg",
            factor: 0.000001
        },
        pound: {
            name: "Pound",
            symbol: "lb",
            factor: 0.45359237
        },
        ounce: {
            name: "Ounce",
            symbol: "oz",
            factor: 0.028349523125
        },
        tonne: {
            name: "Tonne",
            symbol: "t",
            factor: 1000
        }
    },

    temperature: {
        celsius: {
            name: "Celsius",
            symbol: "°C"
        },
        fahrenheit: {
            name: "Fahrenheit",
            symbol: "°F"
        },
        kelvin: {
            name: "Kelvin",
            symbol: "K"
        }
    }
};


// Get HTML elements
const categoryButtons = document.querySelectorAll(".category");
const fromValue = document.getElementById("fromValue");
const toValue = document.getElementById("toValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const swapButton = document.getElementById("swapButton");
const result = document.getElementById("result");
const formula = document.getElementById("formula");


// Current category
let currentCategory = "length";


// Populate unit dropdowns
function populateUnits(category) {

    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    const categoryUnits = units[category];

    Object.keys(categoryUnits).forEach((unitKey) => {

        const unit = categoryUnits[unitKey];

        const optionFrom = document.createElement("option");
        optionFrom.value = unitKey;
        optionFrom.textContent = `${unit.name} (${unit.symbol})`;

        const optionTo = document.createElement("option");
        optionTo.value = unitKey;
        optionTo.textContent = `${unit.name} (${unit.symbol})`;

        fromUnit.appendChild(optionFrom);
        toUnit.appendChild(optionTo);
    });


    // Sensible default units
    if (category === "length") {
        fromUnit.value = "meter";
        toUnit.value = "centimeter";
    }

    if (category === "weight") {
        fromUnit.value = "kilogram";
        toUnit.value = "gram";
    }

    if (category === "temperature") {
        fromUnit.value = "celsius";
        toUnit.value = "fahrenheit";
    }

    convert();
}


// Convert temperature
function convertTemperature(value, from, to) {

    let celsius;

    // Convert the input to Celsius first
    if (from === "celsius") {
        celsius = value;
    } else if (from === "fahrenheit") {
        celsius = (value - 32) * 5 / 9;
    } else if (from === "kelvin") {
        celsius = value - 273.15;
    }


    // Convert Celsius to requested unit
    if (to === "celsius") {
        return celsius;
    }

    if (to === "fahrenheit") {
        return (celsius * 9 / 5) + 32;
    }

    if (to === "kelvin") {
        return celsius + 273.15;
    }
}


// Get temperature formula
function getTemperatureFormula(value, from, to, converted) {

    const symbols = {
        celsius: "°C",
        fahrenheit: "°F",
        kelvin: "K"
    };

    const fromSymbol = symbols[from];
    const toSymbol = symbols[to];

    if (from === to) {
        return `${formatNumber(value)} ${fromSymbol} = ${formatNumber(converted)} ${toSymbol}`;
    }

    if (from === "celsius" && to === "fahrenheit") {
        return `(${formatNumber(value)} × 9/5) + 32 = ${formatNumber(converted)} °F`;
    }

    if (from === "fahrenheit" && to === "celsius") {
        return `(${formatNumber(value)} - 32) × 5/9 = ${formatNumber(converted)} °C`;
    }

    if (from === "celsius" && to === "kelvin") {
        return `${formatNumber(value)} + 273.15 = ${formatNumber(converted)} K`;
    }

    if (from === "kelvin" && to === "celsius") {
        return `${formatNumber(value)} - 273.15 = ${formatNumber(converted)} °C`;
    }

    if (from === "fahrenheit" && to === "kelvin") {
        return `(${formatNumber(value)} - 32) × 5/9 + 273.15 = ${formatNumber(converted)} K`;
    }

    if (from === "kelvin" && to === "fahrenheit") {
        return `(${formatNumber(value)} - 273.15) × 9/5 + 32 = ${formatNumber(converted)} °F`;
    }
}


// Main conversion function
function convert() {

    const value = parseFloat(fromValue.value);

    if (isNaN(value)) {
        toValue.value = "";
        result.textContent = "Enter a value to convert.";
        formula.textContent = "Enter a number above.";
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    let converted;


    // Temperature
    if (currentCategory === "temperature") {

        converted = convertTemperature(value, from, to);

        formula.textContent =
            getTemperatureFormula(value, from, to, converted);

    }

    // Length and weight
    else {

        const fromFactor = units[currentCategory][from].factor;
        const toFactor = units[currentCategory][to].factor;

        // Convert to base unit first
        const baseValue = value * fromFactor;

        // Convert base unit to target unit
        converted = baseValue / toFactor;

        const fromSymbol = units[currentCategory][from].symbol;
        const toSymbol = units[currentCategory][to].symbol;

        formula.textContent =
            `${formatNumber(value)} ${fromSymbol} × ${formatNumber(fromFactor)} ÷ ${formatNumber(toFactor)} = ${formatNumber(converted)} ${toSymbol}`;
    }


    toValue.value = formatNumber(converted);


    const fromName = units[currentCategory][from].name;
    const toName = units[currentCategory][to].name;

    const fromSymbol = units[currentCategory][from].symbol;
    const toSymbol = units[currentCategory][to].symbol;


    result.textContent =
        `${formatNumber(value)} ${fromName} (${fromSymbol}) = ${formatNumber(converted)} ${toName} (${toSymbol})`;
}


// Format numbers nicely
function formatNumber(number) {

    if (!Number.isFinite(number)) {
        return "Error";
    }

    // Avoid displaying -0
    if (Math.abs(number) < 0.0000000001) {
        number = 0;
    }

    return Number(number.toFixed(10)).toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}


// Category buttons
categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

        categoryButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentCategory = button.dataset.category;

        populateUnits(currentCategory);
    });

});


// Convert when typing
fromValue.addEventListener("input", convert);


// Convert when changing units
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);


// Swap units and values
swapButton.addEventListener("click", () => {

    const oldFromUnit = fromUnit.value;
    const oldToUnit = toUnit.value;

    fromUnit.value = oldToUnit;
    toUnit.value = oldFromUnit;

    convert();
});


// Start the application
populateUnits(currentCategory);