const settingsButton = document.getElementById("settings-button");
const settingsModal = document.getElementById("settings-modal")

let modalDisplayed = false;

settingsButton.addEventListener("click", () => {
    onButtonClicked();
});

function onButtonClicked(){
    if(modalDisplayed)
        retractModal();
    else
        showModal();

    modalDisplayed = !modalDisplayed;
}

function showModal(){
    settingsModal.style.opacity = 1;
}

function retractModal(){
    settingsModal.style.opacity = 0;
}