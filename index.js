import { initializeApp  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champions-app-10ffd-default-rtdb.firebaseio.com/"
}
//firebase constants
const app = initializeApp(appSettings)
const database = getDatabase(app)
const dataRef = ref(database, "endorsements")

//app constants
const inputEl = document.getElementById("input-el")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")
const endorseList = document.getElementById("endorsements-list")
const pubBtn = document.getElementById("publish-btn")

//local storage
//const itemFavorites = JSON.parse( localStorage.getItem("favorites") )

//functions
function clearInputs() {
    inputEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}

function clearList() {
    endorseList.innerHTML = ""
}

function appendItem(to, fromX, endorsement, rating, Id) {
    //create elements
    let newLi = document.createElement("li")
    let div = document.createElement("div")
    let span = document.createElement("span")
    let pFrom = document.createElement("p")
    let pTo = document.createElement("p")
    let pBody = document.createElement("p")
    let favorites = document.createElement("p")
    let currentID = Id
    
    //setting values
    let toVal = `To ${to}`
    let fromVal = `From ${fromX}`
    let inputVal = endorsement
    let favoriteIcon = "♥ "
    let favoriteVal = rating
    
    //adding classes to elements
    pFrom.setAttribute("class", "list-heading")
    pTo.setAttribute("class", "list-heading")
    pBody.setAttribute("class", "list-body")
    favorites.setAttribute("class", "favorites")
    div.setAttribute("class", "from-wrap")
    
    if (localStorage.getItem(currentID)) {
        favorites.setAttribute("class", "favorites active")
    }

    //setting text content values for elements
    pFrom.textContent = fromVal
    pTo.textContent = toVal
    pBody.textContent = inputVal
    span.textContent = favoriteVal
    
    //appends
    favorites.append(favoriteIcon, span)
    div.append(pFrom, favorites)
    newLi.append(pTo, pBody, div)
    endorseList.append(newLi)
    
    //event listener
    favorites.addEventListener("click", function() {
        let id = currentID
        let location = `endorsements/${id}`
        let refLocation = ref(database, location)
        console.log(location)
        if (localStorage.getItem(currentID)) {
            let newRating = {
                "rating": rating -= 1
            }
            update(refLocation, newRating)
            favorites.setAttribute("class", "favorites")
            localStorage.removeItem(currentID)
        } else {
            localStorage.setItem(currentID, "clicked")
            let newRating = {
                "rating": rating += 1
            }
            update(refLocation, newRating)
        }
    })
    
    //clear
    clearInputs()
}


//on change to the database
onValue(dataRef, function(snapshot) {
    if (snapshot.exists()) {
        let itemArr = Object.entries(snapshot.val())
        
        clearList()
        
        for (let i = 0; i < itemArr.length; i++) {
            let currentVals = Object.values(itemArr[i][1])
            let id = itemArr[i][0]
            let to = currentVals[3]
            let fromX = currentVals[1]
            let endorsement = currentVals[0]
            let rating = currentVals[2]
            
            appendItem(to, fromX, endorsement, rating, id)
        }
    } else {
        console.log("No database items")
    }
})

//button click event
pubBtn.addEventListener("click", function() {
    if (inputEl.value !== "" && toEl.value !== "" && fromEl.value !== "") {
        let toVal = toEl.value
        let fromVal = fromEl.value
        let inputVal = inputEl.value
        
        let newItem = {
            "to": toVal,
            "from": fromVal,
            "endorsement": inputVal,
            "rating": 0
        }
        push(dataRef, newItem)
        clearInputs()
    } else {
        console.log("Still need to fill out the other fields to submit your Endorsement!")
    }
})