let currentPageUrl = 'https://swapi.dev/api/people/';

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    }

    catch (error) {
        console.log(error);
        alert('Errou ao carregar cards')
    }

    const nextButton = document.querySelector("#next_button")
    const backButton = document.querySelector("#back_button")

    nextButton.addEventListener("click", loadNextPage)
    backButton.addEventListener("click", loadPreviousPage)
};

async function loadCharacters(url) {
    const mainContent = document.querySelector('#main_content');
    mainContent.innerHTML = ''; // limpa os resultados

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement('div');
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
            card.className = "cards";

            const characterNameBg = document.createElement("div");
            characterNameBg.className = "character_name_bg";

            const characterName = document.createElement("span");
            characterName.className = "character_name";
            characterName.innerText = `${character.name}`

            characterNameBg.appendChild(characterName); // coloca um filho dentro dele, no caso a div characterNameBg escatar colocando o span characterName dentro dele. 
            card.appendChild(characterNameBg);

            card.onclick = () => {
                const modal = document.querySelector("#modal");
                modal.style.visibility = "visible";

                const modalContent = document.querySelector("#modal_content");
                modalContent.innerHTML = ""

                const characterImage = document.createElement("div")
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg'`
                characterImage.className = "character_image"

                const name = document.createElement("span")
                name.className = "character_details"
                name.innerText = `Nome: ${character.name}`

                const characterHeight = document.createElement("span")
                characterHeight.className = "character_details"
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                const mass = document.createElement("span")
                mass.className = "character_details"
                mass.innerText = `Peso: ${convertMass(character.mass)}`

                const eyeColor = document.createElement("span")
                eyeColor.className = "character_details"
                eyeColor.innerText = `Cor dos olhos: ${covertEyeColor(character.eye_color)}`

                const birthYear = document.createElement("span")
                birthYear.className = "character_details"
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(eyeColor)
                modalContent.appendChild(birthYear)
            }

            mainContent.appendChild(card);
        });

        const nextButton = document.querySelector("#next_button");
        const backButton = document.querySelector("#back_button");

        nextButton.disabled = !responseJson.next
        backButton.disabled = !responseJson.previous

        backButton.style.visibility = responseJson.previous ? "visible" : "hidden";

        currentPageUrl = url

    }

    catch (error) {
        alert("Erro ao carregar os personagens");
        console.log(error);
    }


}

async function loadNextPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json();

        await loadCharacters(responseJson.next)
    }

    catch (error) {
        console.log(error);
        alert('Errou ao carregar a próxima página')
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json();

        await loadCharacters(responseJson.previous)
    }

    catch (error) {
        console.log(error);
        alert('Errou ao carregar a página anterior')
    }
}

function hideModal() {
    const modal = document.querySelector('#modal');
    modal.style.visibility = 'hidden';
}

function covertEyeColor(eyeColor) {
    const color = {
        unknown: "desconhecida",
        blue: "azul",
        brown: "castanho",
        green: "verde",
        gray: "cinza",
        pink: "rosa",
        purple: "roxo",
        red: "vermelho",
        white: "branco",
        yellow: "amarelo",
        black: "preto",
        hazel: "avela"
    }
    return color[eyeColor.toLowerCase()] || eyeColor;
}

function convertHeight(height) {
    if (height === "unknown") {
        return "desconhecida"
    }

    return (height / 100).toFixed(2);
}

function convertMass (mass) {
    if (mass === "unknown") {
        return "desconhecido"
    }

    return `${mass} pkg`
}

function convertBirthYear (birthYear) {
    if (birthYear === "unknown") {
        return "desconhecido"
    }

    return birthYear
}