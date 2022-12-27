const step1 = new Step(1, false, true, false)
const step2 = new Step(2, true, true, false)
const step3 = new Step(3, true, true, false,)
const step4 = new Step(4, true, false, true,)
const step5 = new Step(5, false, false, false)
const btn = new Button()
const interval = new BillingInterval()
const plan = new Plan()
const addon = new Addon()

function Step(number, back, next, confirm){
    this.stepNbr = number;
    this.stepDomEl = document.querySelector(`.step${this.stepNbr}`)
    this.changeClassVisibility = function changeClassVisibility(){
        this.stepDomEl.classList.toggle("hidden")
        if (this.stepNbr < 5) activateSideBar(this.stepNbr)

        if (!this.stepDomEl.classList.contains('hidden')){
            displayBtns(back, next, confirm)
        }
    }
    // __________Variables and additional functions

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
        if (!step4.stepDomEl.classList.contains('hidden')){
            refreshOrder()
        }
    }

    // __________Variables and additional functions

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
        let text = document.createTextNode("This field is required")
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

    function refreshOrder(){       
        createPlanDomEl()
        removePreviousAddOns()
        createNewAddOns()
        let totalPriceExpression = calculateTotalPrice()
        updateTotalPriceDom(totalPriceExpression)
    }

    function createPlanDomEl(){
        let currentPlan = document.querySelector('.chosen-plan')
        let planName = currentPlan.querySelector('h3').textContent
        let planPrice = currentPlan.querySelector('p.plan-price:not(.hidden)').textContent
        let billing = interval.currentInterval 

        let summaryPlanName = document.querySelector('.plan--name')
        let summaryPrice = document.querySelector('.plan--price')
        summaryPlanName.textContent = `${planName} `
        let summaryBilling = document.createElement('span')
        let billingText = document.createTextNode(`(${billing})`)
        summaryBilling.appendChild(billingText)
        summaryPlanName.appendChild(summaryBilling)
        summaryPrice.textContent= planPrice
    }

    function  removePreviousAddOns() {
        let previousAddOns = document.querySelectorAll('.add-on')
        previousAddOns.forEach(
            function deleteAddons(addOn){
                addOn.remove()
        })
    }

    function createNewAddOns(){
        let currentAddOns = document.querySelectorAll('.chosen-addon')
        if (currentAddOns){
            currentAddOns.forEach(
                function analyzeChosenAddOns(addOn){
                    let addOnName = addOn.querySelector('input').value
                    let addOnPrice = addOn.querySelector('p.addon-price:not(.hidden)').textContent
                    createAddOnDomEl(addOnName, addOnPrice)                    
                }
            )
        }
    }

    function calculateTotalPrice(){
        let itemsToAddToTotalPrice = document.querySelectorAll('.add-to-total')
        let totalPrice = 0
        let priceBillInterval = ""
        itemsToAddToTotalPrice.forEach(
            function extractPriceNumber(item){
                let priceExpression = item.textContent.split("$")[1].split("/")
                let priceNr = Number(priceExpression[0])
                priceBillInterval = priceExpression[1]
                totalPrice += priceNr
            }
        )
        return `+$${totalPrice}/${priceBillInterval}`     
    }

    function updateTotalPriceDom(stringTypeTotalPrice){
        let totalPriceDomEl = document.querySelector('.total-price > p')
        totalPriceDomEl.textContent = stringTypeTotalPrice
        let totalBiilingTimeDomEl = document.querySelector('.total-billing-time')
        let billInterval = ""
        interval.currentInterval == "Monthly" ? billInterval = "(per month)" : billInterval = "(per year)"
        totalBiilingTimeDomEl.textContent = billInterval
    }

    function createAddOnDomEl(name, price){
        const parentDiv = document.querySelector('.colored-table-part')
        let li = document.createElement('li')
        li.setAttribute('class', 'add-on')
        let h3 = document.createElement('h3')
        let p = document.createElement('p')
        p.setAttribute('class', 'add-to-total')
        h3.textContent = name
        p.textContent = price
        li.appendChild(h3)
        li.appendChild(p)
        parentDiv.appendChild(li)
    }

}

function BillingInterval(){
    this.currentInterval = 'Monthly'
    this.changeInterval = function changeInterval(){
        let monthlyItems = document.querySelectorAll(`.monthly-price`)
        let yearlyItems = document.querySelectorAll(`.yearly-price`)
        toggleHiddenClass(yearlyItems)
        toggleHiddenClass(monthlyItems)

        const toggleBubble = document.querySelector('.toggle--bubble')
        toggleBubble.classList.toggle('Monthly')
        toggleBubble.classList.toggle('Yearly')
        if (toggleBubble.classList.contains('Monthly')){
            this.currentInterval = 'Monthly'
            toggleBubble.setAttribute("aria-label", "monthly billing")
        }
        else{
            toggleBubble.setAttribute("aria-label", "yearly billing")
            this.currentInterval = 'Yearly'
        }
    }
    // __________Variables and additional functions

    // step4 all cards total display
    function toggleHiddenClass(Nodes){
        Nodes.forEach(item =>{
            item.classList.toggle('hidden')
        })
    }
}

function Plan(){
    this.chooseplan = function chooseplan(){
        let clickedPlan = event.target.closest('li')
        let previouslyActivePlan = document.querySelector('.chosen-plan')
        previouslyActivePlan.classList.toggle('chosen-plan')
        previouslyActivePlan.setAttribute('aria-checked', 'false')

        clickedPlan.classList.toggle('chosen-plan')
        if (clickedPlan.classList.contains('chosen-plan')){
            clickedPlan.setAttribute('aria-checked', 'true')
        }
        else{
            clickedPlan.setAttribute('aria-checked', 'false')
        }
    }
}

function Addon(){
    this.chooseAddon = function chooseAddon(){
        let chosenAddonCard = event.target.closest('div')
        chosenAddonCard.classList.toggle('chosen-addon')
        let checkbox = chosenAddonCard.querySelector('input')
        if (chosenAddonCard.classList.contains('chosen-addon')){
            checkbox.setAttribute('aria-checked', 'true')
        }
        else{
            checkbox.setAttribute('aria-checked', 'false')
        }
    }
}


