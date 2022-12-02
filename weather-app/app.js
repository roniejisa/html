const app = document.querySelector("#app");
const content = document.querySelector(".content");
const search = document.querySelector("input");
const time = document.querySelector(".time");
const city = document.querySelector(".city");
const country = document.querySelector(".country");
const value = document.querySelector(".value");
const shortDesc = document.querySelector(".short-desc");
const visibility = document.querySelector(".visibility p");
const wind = document.querySelector(".wind p");
const humidity = document.querySelector(".humidity p");

const apiURL = `http://api.openweathermap.org/data/2.5/weather?q=_NAME_&appid=3566139e460173d3870ff56330de3440`;
async function changeWeatherUI() {
    let timeout;
    search.oninput = function () {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            let data = await fetch(
                apiURL.replace("_NAME_", search.value.trim())
            ).then((res) => res.json());
            if (data.cod !== 200) {
                content.classList.add("hide");
                return;
            }
            const temp = Math.round((data.main.temp - 273.15) * 10) / 10;
            city.innerHTML = data.name;
            country.innerHTML = data.sys.country;
            wind.innerHTML = data.wind.speed + " (m/s)";
            visibility.innerHTML = data.visibility + " (m)";
            humidity.innerHTML = data.main.humidity + " (%)";
            shortDesc.innerHTML = data.weather[0].description;
            value.innerHTML = `${temp} <sup>o</sup>C`;
            time.innerHTML = new Date().toLocaleDateString("vi");
            if (content.classList.contains("hide")) {
                content.classList.remove("hide");
            }
            changeBackground(temp);
            search.value = "";
        }, 800);
    };
}

function changeBackground(temp) {
    console.log(temp);
    let backgroundBody = `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)),
    url(_IMG_URL_) no-repeat center/cover;`;
    let backgroundContent = `linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)),
    url(_IMG_URL_) no-repeat center/cover;`;
    if (temp >= 30) {
        document.body.setAttribute(
            "style",
            `background:${backgroundBody.replace("_IMG_URL_", "./hot.jpg")}`
        );
        app.setAttribute(
            "style",
            `background:${backgroundContent.replace("_IMG_URL_", "./hot.jpg")}`
        );
    } else if (temp >= 25) {
        document.body.setAttribute(
            "style",
            `background:${backgroundBody.replace("_IMG_URL_", "./warm.jpg")}`
        );
        app.setAttribute(
            "style",
            `background:${backgroundContent.replace("_IMG_URL_", "./warm.jpg")}`
        );
    } else if (temp >= 20) {
        document.body.setAttribute(
            "style",
            `background:${backgroundBody.replace("_IMG_URL_", "./cool.jpg")}`
        );
        app.setAttribute(
            "style",
            `background:${backgroundContent.replace("_IMG_URL_", "./cool.jpg")}`
        );
    } else {
        document.body.setAttribute(
            "style",
            `background:${backgroundBody.replace("_IMG_URL_", "./cold.jpg")}`
        );
        app.setAttribute(
            "style",
            `background:${backgroundContent.replace("_IMG_URL_", "./cold.jpg")}`
        );
    }
}
changeWeatherUI();
