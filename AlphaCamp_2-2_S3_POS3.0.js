// ------- 變數宣告 & 函數定義 ------
const productListElement = document.getElementById('product-list')
const cartItemListElement = document.getElementById('cart-item-list')
const totalAmountElement = document.getElementById('total-amount')
const clearCartButtonElement = document.getElementById('clear-cart-button')

let products = []
let productMap = {};

let cartItems = [
  {
    productId: 'product-3',
    quantity: 2
  },
  {
    productId: 'product-2',
    quantity: 3
  },
]

// 計算購物車價格
function getCartItemAmount(cartItem) {
  const product = productMap[cartItem.productId]
  return product.price * cartItem.quantity
}

function getTotalAmount() {
  let totalAmount = 0
  
  cartItems.forEach(cartItem => {
    totalAmount += getCartItemAmount(cartItem);
  })
  
  return totalAmount
}


// 商品列表畫面渲染
function renderProducts() {
  productListElement.innerHTML = ''
  
  products.forEach(product => {
    productListElement.innerHTML += `
      <div class="col-3">
         <div class="card disabled">
            <img src=${product.imgUrl} class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">${product.name} </h5>
              <p class="card-text">
                ${product.price} 元
              </p>
              <button id=${product.id} class="btn btn-primary add-to-cart-button">
                加入購物車
              </button>
            </div>
          </div>
        </div>
    `
  })
}

// 購物車畫面渲染
function renderCart() {
  cartItemListElement.innerHTML = ''

  cartItems.forEach(cartItem => {
    const product = productMap[cartItem.productId]
    const cartItemAmount = getCartItemAmount(cartItem)

    cartItemListElement.innerHTML += `
      <li class="list-group-item">
        ${product.name} X ${cartItem.quantity}，小計：${cartItemAmount} 元
      </li>
    `
  })
  
  const totalAmount = getTotalAmount()
  totalAmountElement.textContent = totalAmount
}

// 綁定加入購物車按鈕的事件
function bindAddItemToCartButtonEvent() {
  const buttonElementList = document.querySelectorAll('.add-to-cart-button');

  buttonElementList.forEach(buttonElement => {
    buttonElement.addEventListener('click', (event) => {
      // 加入購物車品項
      const productId = event.target.id;
      const existingCartItemIndex = cartItems.findIndex(cartItem => cartItem.productId === productId)

      if (existingCartItemIndex >= 0) {
        // 購物車中已有重複商品
        cartItems[existingCartItemIndex].quantity += 1
      } else {
        // 購物車中尚未有該種商品
        cartItems.push({
          productId,
          quantity: 1
        })
      }

      // 畫面刷新顯示購物車清單
      renderCart()
    })
  })
}

// 綁定清空購物車按鈕的事件
function bindClearCartButtonEvent() {
  clearCartButtonElement.addEventListener('click', () => {
    // 清空購物車並刷新購物車的畫面
    cartItems = []
    renderCart()
  })
}


// ------ 主流程 -------

// 請求 API 菜單商品資料
axios.get('https://ac-pos-with-inventory.firebaseio.com/products.json')
  .then((response) => {  
    // 成功取得 API 回傳的 products 陣列資料
    products = response.data
    
    // 將 products 陣列轉換成物件格式的資料，以供後續存取方便
    productMap = {}
    products.forEach(product => {
      productMap[product.id] = product;
    })
    
    // 畫面渲染
    renderProducts()
    renderCart()
  
    // 事件綁定
    bindAddItemToCartButtonEvent()
    bindClearCartButtonEvent()
  })
