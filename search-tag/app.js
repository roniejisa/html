var content = document.querySelector('.content ul');
var btnRemoveAll = document.querySelector('.remove-all');
var input = document.querySelector('.content input');

const tags = ['NodeJs','ReactJs'];

async function createTags(){
    content.innerHTML = await tags.map(item => `<li>${item} <i class="fa-solid fa-xmark"></i></li>`).join('');
    await removeItem();
}

createTags();

function removeItem(){
    const removeBtn = document.querySelectorAll('.content i');
    removeBtn.forEach(btn => {
        btn.onclick = function(){
            const li = btn.closest('li');
            li.remove();
        } 
    });
}

input.addEventListener('keydown',function(e){
    if(e.key === 'Enter' && e.target.value !== ''){
        content.insertAdjacentHTML('beforeend',`<li>${e.target.value}<i class="fa-solid fa-xmark"></i></li>`);
        removeItem();
        e.target.value = '';
    }
});

btnRemoveAll.onclick = function(){
    content.innerHTML = '';
}