const socket = io()

function disableButtons() {
  const buttons = document.querySelectorAll('button')
  buttons.forEach((button) => {
    button.disabled = true
  })
}

function createButton({ value, key, }) {
  const button = document.createElement('button')
  button.innerHTML = value
  button.addEventListener('click', () => {
    console.log('This button has been clicked now!', value)
    socket.emit('request', { key })
    disableButtons()

  })
  return button
}

function container() {
  const main = document.getElementById('menu')
  const card = document.createElement('div')
  card.className = 'card p-5 mt-6'
  main.appendChild(card)
  return card
}

function displayMenu(msg = 'Menu List') {
  const buttons = [
    { key: '1', value: 'Place Order' },
    { key: '99', value: 'Checkout Order' },
    { key: '98', value: 'Order History' },
    { key: '97', value: 'Current Order' },
    { key: '0', value: 'Cancel Order' },
  ]

  const main = document.getElementById('menu');
  const heading = document.createElement('h1')
  heading.className = 'title container'
  heading.textContent = msg
  main.appendChild(heading)


  for (each of buttons) {
    const button = createButton(each)
    button.className = 'button is-light mt-1'
    menu.appendChild(button)
  }
}

function botResponse(msg) {
  const main = document.getElementById('menu')
  const text = document.createElement('p')
  text.className = 'title container'
  text.innerHTML = msg
  main.appendChild(text)
}


socket.on('welcome', (msg) => {
  displayMenu(msg)
})

socket.on('bot_response', (msg) => {
  botResponse(msg)
  displayMenu()
})

socket.on('product_list', (data) => {
  console.log(data)
  if (data.length === 0) {
    botResponse('product is empty!')
    displayMenu()
    return
  }
  const main = document.getElementById('menu');
  const text = document.createElement('h1')
  text.textContent = 'Here are the list of orders!'
  text.className = 'title is-3'
  main.appendChild(text)
  for (const item of data) {
    const { _id, price, quantity = 1 } = item
    const button = createButton({ value: item.productName })
    button.className = 'button is-light mt-1'

    button.addEventListener('click', async () => {
      console.log(item)
      socket.emit('place_order', { product: _id, price, quantity })
    })

    main.appendChild(button)
  }
})

socket.on('order_list', (data) => {
  if (data.length === 0) {
    botResponse('You haven\'t made any order yet!')
    displayMenu()
    return
  }
  const main = container();
  for (const item of data) {
    const text = document.createElement('div')
    text.className = 'is-flex'
    text.innerHTML = `<h2>Name: ${item.product.productName}</h2> <p>Price: ${item.price}<p/> <p>Status: ${item.status} </p> </br>`
    text.className = 'is-size-5 mt-5 is-dark'
    main.appendChild(text)
  }
  displayMenu()
})


socket.on('incomplete_orders', (data) => {
  if (data.length === 0) {
    botResponse('You don\'t have any order, place one now')
    displayMenu()
  }
  for (const item of data) {
    console.log(item)
    const main = container()

    const text = document.createElement('p')
    text.className = 'title is-3'
    text.textContent = item.product.productName

    const button = createButton({ value: 'Checkout!', key: null })
    button.className = 'button'

    button.addEventListener('click', () => {
      socket.emit('checkout_order', { orderId: item._id })
    })

    main.appendChild(text)
    main.appendChild(button)
  }
})

socket.on('order_list_c', (data) => {
  if (data.length === 0) {
    botResponse('You don\'t have any order, place one now')
    displayMenu()
  }
  for (const item of data) {
    console.log(item)
    const main = container()

    const text = document.createElement('p')
    text.className = 'title is-3'
    text.textContent = item.product.productName

    const button = createButton({ value: 'Cancel!', key: null })
    button.className = 'button is-danger'

    button.addEventListener('click', () => {
      socket.emit('cancel_order', { orderId: item._id })
    })

    const back = createButton({ value: 'Back', key: null })
    back.className = 'button is-dark ml-6'

    back.addEventListener('click', () => {
      displayMenu()
    })

    main.appendChild(text)
    main.appendChild(button)
    main.appendChild(back)
  }
})

socket.on('current_order', (data) => {
  const main = container()
  const text = document.createElement('div')
  text.innerHTML = `<h2>Name: ${data.product.productName}</h2> <p>Price: ${data.price}<p/> <p>Status: ${data.status} </p> </br>`
  main.appendChild(text)
  displayMenu()
})

