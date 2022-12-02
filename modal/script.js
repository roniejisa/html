var modal = document.querySelector('.modal');
var modalClose = document.querySelector('.modal i');
var modalButtonClose = document.querySelector('.modal button');
var buttonOpenModal = document.querySelector('.btn-open-modal');


function toggleModal(){
    modal.classList.toggle('hide');
}

buttonOpenModal.addEventListener('click',toggleModal);
modalClose.addEventListener('click',toggleModal);
modalButtonClose.addEventListener('click',toggleModal);
modal.addEventListener('click',e =>{
    if(e.target !== e.currentTarget) return;
    toggleModal();
});