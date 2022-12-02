const buttonSearch = document.querySelector('.search-box__button');

buttonSearch.addEventListener('click',function(){
    this.parentElement.classList.toggle('open');
    this.parentElement.querySelector('input').focus();
});