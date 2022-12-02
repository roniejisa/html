const boxes = document.querySelectorAll('.box');
const targetList = document.querySelectorAll('.target');


let currentTarget = null;
targetList.forEach(target =>{
    target.addEventListener('dragstart', (e) => {
        target.style.border = '1px solid #ffff00';
        currentTarget = target;
    })
    
    target.addEventListener('dragend', (e) => {
        target.style.border = 'none';
    })
})

boxes.forEach(item => {
    item.addEventListener('dragover', (e)=>{
        e.preventDefault();
        if(!item.querySelector('.target')){
            item.appendChild(currentTarget);

        }
    });

    item.addEventListener('drop', (e) => {
        if(!item.querySelector('.target')){
            item.appendChild(currentTarget);
        }
    })
});