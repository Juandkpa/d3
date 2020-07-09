const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.querySelector('input');
const error = document.querySelector('.error');

let activity = 'cycling';

btns.forEach(btn => {
    btn.addEventListener('click', e => {
        activity = e.target.dataset.activity;
        btns.forEach( btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        input.setAttribute('id', activity);
        formAct.textContent = activity;

        update(data);
    });
});

form.addEventListener('submit', async e => {
    e.preventDefault();

    const distance = parseInt(input.value);

    if (distance) {
        await db.collection('activities').add({ distance, activity, date: new Date().toString()})
        error.textContent = '';
        input.value = '';
    }else {
        error.textContent = 'Please add a distance'
    }
})