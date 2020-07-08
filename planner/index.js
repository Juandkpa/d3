const form = document.querySelector('form');
const name = document.querySelector('#name');
const cost = document.querySelector('#cost');
const error = document.querySelector('#error');

form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    if (name.value && cost.value) {
        const item = {
            name: name.value,
            cost: parseInt(cost.value)
        };

        const res = await db.collection('expenses').add(item);
        name.value = '';
        cost.value = '';
        console.log(res)
    }else {
        error.textContent = 'Please enter values';
    }
});