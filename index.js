// -------------------------------------------  DOM Stuffs -----------------------------------
const form = document.getElementById('show-form')
const title_inp = document.getElementById('title')
const show_list = document.getElementById('show-list')
const finished_list = document.getElementById('finished_list')


document.addEventListener('DOMContentLoaded', Get_From_Local_Storage)


let All_Shows = []

// Add New Show
form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const title = title_inp.value

    if(title === '' || title === null) {
        alert('title is empty')
        return
    }

    const newShow = new Show(title, 1, 1, false)

    newShow.AddNew()

    All_Shows.push(newShow)

    title_inp.value = ''

    Store_In_Local_Storage()
})

show_list.addEventListener('click', (e) => {

    item_title = e.target.parentElement.parentElement.parentElement.children[0].textContent
    
    switch(e.target.parentElement.id) {
        case "season-plus":
            All_Shows.forEach(i => {
                if(i.title === item_title) {
                    i.SeasonPlus()
                    e.target.parentElement.parentElement.firstChild.textContent = i.season
                }
            })
        break;
        case "season-minus":
            All_Shows.forEach(i => {
                if(i.title === item_title) {
                    i.SeasonMinus()
                    e.target.parentElement.parentElement.firstChild.textContent = i.season
                }
            })
        break;
        case "ep-plus":
            All_Shows.forEach(i => {
                if(i.title === item_title) {
                    i.EpPlus()
                    e.target.parentElement.parentElement.firstChild.textContent = i.ep
                }
            })
        break;
        case "ep-minus":
            All_Shows.forEach(i => {
                if(i.title === item_title) {
                    i.EpMinus()
                    e.target.parentElement.parentElement.firstChild.textContent = i.ep
                }
            })
        break;
        case "finished":
            All_Shows.forEach(i => {
                if(i.title === item_title) {
                    i.IsFinishedWatching()
                    if(i.isFinished) {
                        e.target.parentElement.parentElement.parentElement.style.color = 'lime'
                    } else {
                        e.target.parentElement.parentElement.parentElement.style.color = 'black'
                    }
                }
            })
        break;
        case "delete":
            e.target.parentElement.parentElement.parentElement.remove()

            let del_indx
            for(let i = 0; i < All_Shows.length; i++) {
                if(All_Shows[i].title === item_title) {
                    del_indx = i
                }
            }
            All_Shows.splice(del_indx, 1)
        break;
    }
    console.log(All_Shows);
    Store_In_Local_Storage();
})


finished_list.addEventListener('click', (e) => {
    if(e.target.parentElement.parentElement.classList.contains('finished_item')){
        item_title = e.target.parentElement.parentElement.firstChild.textContent
        e.target.parentElement.parentElement.remove()
        All_Shows.forEach(i => {
            if(i.title === item_title) {
                i.IsFinishedWatching()
                i.AddNew()
            }
        })
        Store_In_Local_Storage();
    }
})












class Show {
    constructor (title, season, ep, isFinished) {
        this.title = title
        this.season = season
        this.ep = ep
        this.isFinished = isFinished
    }


    AddNew() {
        const new_tr = document.createElement('tr')

        
        if(!this.isFinished) {
            new_tr.innerHTML = `
                <td>${this.title}<a id="finished" class="btn-sm"><i class="fas fa-check"></i></a><a id="delete" class="btn-sm"><i class="fas fa-times"></i></a></td>
                <td>${this.season}<a id="season-minus" class="btn-sm"><i class="fas fa-minus"></i></a><a id="season-plus" class="btn-sm"><i class="fas fa-plus"></i></a></td>
                <td>${this.ep}<a id="ep-minus" class="btn-sm"><i class="fas fa-minus"></i></a><a id="ep-plus" class="btn-sm"><i class="fas fa-plus"></i></a></td>
            `
            show_list.appendChild(new_tr)
        } else {
            const new_li = document.createElement('li')
            new_li.innerHTML = `${this.title}<a id="delete" class="btn-sm"><i class="fas fa-times"></i></a>`
            new_li.classList.add('finished_item')
            finished_list.appendChild(new_li)
        }
    }

    SeasonPlus() {
        this.season += 1
    }
    SeasonMinus() {
        if(this.season <= 1) return
        this.season -= 1
    }
    EpPlus() {
        this.ep += 1
    }
    EpMinus() {
        if(this.ep <= 1) return
        this.ep -= 1
    }
    IsFinishedWatching() {
        this.isFinished = !this.isFinished
    }
}




//  Local Storage
function Store_In_Local_Storage() {
    localStorage.setItem('ep_tracker', JSON.stringify(All_Shows))
}
function Get_From_Local_Storage() {
    let temp_list = []

    if(localStorage.getItem('ep_tracker') == null) {
        temp_list = []
    } else {
        temp_list = JSON.parse(localStorage.getItem('ep_tracker'))
    }

    temp_list.forEach( i => {
        const newShow = new Show(i.title, i.season, i.ep, i.isFinished)
        All_Shows.push(newShow)
        newShow.AddNew()
    })

    console.log(All_Shows);
}