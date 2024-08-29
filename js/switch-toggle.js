/* 
    Adicione a classe animes/series para fazer aparecer quando o controle deslizante de series ou animes for ativado. 
    Simplesmente não adicione nenhuma classe para que o card apareça sempre.
*/
const toggleInput = document.getElementById("toggle-input");
const toggleSlider = document.getElementById("toggle-slider");

const animesCharacters = document.getElementsByClassName("animes");
const animesimg = document.getElementsByClassName("animesimg");
const animesCharactersArray = Array.from(animesCharacters);

const seriesCharacters = document.getElementsByClassName("series");
const seriesimg = document.getElementsByClassName("seriesimg");
const seriesCharactersArray = Array.from(seriesCharacters);

const isToggled = toggleInput.checked;
if (isToggled) {
    hideCharacters(animesCharactersArray);
} else {
    hideCharacters(seriesCharactersArray);
}

toggleInput.addEventListener("change", () => {
    toggleSlider.style.left = toggleInput.checked ? "50%" : "0";
    
    if (!toggleInput.checked) {
        showCharacters(animesCharactersArray);
        hideCharacters(seriesCharactersArray);
        addSlideInAnimation(seriesimg);
    } else {
        showCharacters(seriesCharactersArray);
        hideCharacters(animesCharactersArray);
        addSlideInAnimation(animesimg);
    }
});

function hideCharacters(characters) {
    characters.forEach(character => {
        character.classList.add("hide");
    });
}

function showCharacters(characters) {
    characters.forEach(character => {
        character.classList.remove("hide");
    });
}


function addSlideInAnimation(images) {
    images.forEach(image => {
        image.classList.add("slide-in");
    });
}

function hideSlideInAnimation(images) {
    images.forEach(image => {
        image.classList.remove("slide-in");
    });
}

seriesCharactersArray.forEach(character => {
    console.log(character);
})
animesCharactersArray.forEach(character => {
    console.log(character);
})

