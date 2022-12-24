function Step(number, back, next, confirm){
    this.stepNbr = number;
    this.changeClassVisibility = function changeClassVisibility(){
        stepDomEl.classList.toggle("hidden")
        if (this.stepNbr < 5) activateSideBar(this.stepNbr)

        if (!stepDomEl.classList.contains('hidden')){
            displayBtns(back, next, confirm)
        }
    }
    // __________Variables and additional functions

    let stepDomEl = document.querySelector(`.step${this.stepNbr}`)
    const backBtnDomEl = document.querySelector(".previous")
    const nextBtnDomEl = document.querySelector(".next")
    const confirmBtnDomEl = document.querySelector(".confirm-btn")

    function displayBtns(back, next, confirm){
        backBtnDomEl.classList.remove('visible')
        nextBtnDomEl.classList.remove('visible')
        confirmBtnDomEl.classList.remove('visible')
        
        if (back == true) backBtnDomEl.classList.add('visible') 
        if (next == true) nextBtnDomEl.classList.add('visible') 
        if (confirm == true) confirmBtnDomEl.classList.add('visible') 
    }

    function activateSideBar(number){
        let sidebarStep = document.querySelector(`#sidebar-ol > :nth-child(${number})`)
        sidebarStep.classList.toggle('active')
    }
}

function Button(){
    let currentPage = 1

    this.buttonClicked = function buttonClicked(buttonType){
        preventDefault()
        if (inputValidation() == true ){
            let currentStep = `step${currentPage}`
            buttonType == 'previous' ? currentPage-- : currentPage++
            let newStep = `step${currentPage}`
            let stepsToChangeVisibility = [currentStep, newStep]

            stepsToChangeVisibility.forEach(
                function changeVisibilityOfSteps(stepItem){
                    eval(stepItem).changeClassVisibility()
            })
        }
    }

    function preventDefault(){
        this.addEventListener('click', event =>{
            event.preventDefault()
        })
    }

    function inputValidation(){
        removeEarlierErrorMsg()
        const step1Inputs = document.querySelectorAll(".step1 > div > input")

        // check all inputs of step one
        for (let i = 0; i < step1Inputs.length; i++){
            if (step1Inputs[i].value.length < 1){
                addErrorMsg(step1Inputs[i])            
                return false
            }
        }
        return true
    }

    function addErrorMsg(inputElement){
        inputElement.classList.add('error-msg')
        let textMessage = document.createElement("span")
        let text = document.createTextNode("this field is required")
        textMessage.setAttribute("class", "error-msg-text")
        textMessage.appendChild(text)
        inputElement.parentElement.insertBefore(textMessage, inputElement)
    }

    function removeEarlierErrorMsg(){
        let errorField = document.querySelector(".error-msg")
        if (errorField){
            errorField.classList.remove('error-msg')
            errorField.previousElementSibling.remove()
        } 
    }

}

const step1 = new Step(1, false, true, false)
const step2 = new Step(2, true, true, false)
const step3 = new Step(3, true, true, false,)
const step4 = new Step(4, true, false, true,)
const step5 = new Step(5, false, false, false)
const btn = new Button()



